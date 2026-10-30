-- =====================================================================
-- Tentativas extras: o instrutor libera mais tentativas de uma avaliação
-- para um aluno (pelo painel, 3 de cada vez).
--
-- Cada liberação vira uma linha em attempt_grants. O limite do aluno é
-- max_attempts da avaliação + a soma das liberações dele. A escrita só
-- acontece pela função SECURITY DEFINER grant_extra_attempts (staff).
-- =====================================================================

create table if not exists public.attempt_grants (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  course_id     uuid not null references public.courses(id) on delete cascade,
  extra         integer not null check (extra between 1 and 10),
  granted_by    uuid references public.profiles(id) on delete set null,
  created_at    timestamptz not null default now()
);
create index if not exists attempt_grants_user_assessment_idx on public.attempt_grants (user_id, assessment_id);
create index if not exists attempt_grants_course_idx on public.attempt_grants (course_id);

alter table public.attempt_grants enable row level security;

-- só leitura: o aluno vê as próprias liberações, o staff vê todas
drop policy if exists "attempt_grants_select" on public.attempt_grants;
create policy "attempt_grants_select" on public.attempt_grants for select to authenticated
  using (user_id = auth.uid() or public.is_staff());

-- ---------------------------------------------------------------------
-- Limite de tentativas de um aluno numa avaliação (null = sem limite).
-- ---------------------------------------------------------------------
create or replace function public.attempt_limit(p_user uuid, p_assessment uuid)
returns integer
language sql stable security definer set search_path = public as $$
  select case
    when a.max_attempts is null then null
    else a.max_attempts + coalesce((
      select sum(g.extra)::integer from public.attempt_grants g
      where g.user_id = p_user and g.assessment_id = a.id
    ), 0)
  end
  from public.assessments a
  where a.id = p_assessment;
$$;

-- ---------------------------------------------------------------------
-- RPC do instrutor: libera mais tentativas para um aluno.
-- Devolve as tentativas usadas e o novo limite.
-- ---------------------------------------------------------------------
create or replace function public.grant_extra_attempts(
  p_assessment_id uuid,
  p_user_id       uuid,
  p_extra         integer default 3
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_staff uuid := auth.uid();
  a       public.assessments;
  g       public.attempt_grants;
  v_used  integer;
begin
  if v_staff is null or not public.is_staff() then
    raise exception 'apenas instrutores liberam tentativas' using errcode = '42501';
  end if;
  if p_extra is null or p_extra < 1 or p_extra > 10 then
    raise exception 'libere de 1 a 10 tentativas por vez' using errcode = '22023';
  end if;

  select * into a from public.assessments where id = p_assessment_id;
  if not found then
    raise exception 'avaliação não encontrada' using errcode = 'P0002';
  end if;
  if a.max_attempts is null then
    raise exception 'esta avaliação não tem limite de tentativas' using errcode = 'P0001';
  end if;
  if not exists (select 1 from public.enrollments where user_id = p_user_id and course_id = a.course_id) then
    raise exception 'o aluno não está matriculado neste curso' using errcode = 'P0002';
  end if;

  insert into public.attempt_grants (user_id, assessment_id, course_id, extra, granted_by)
  values (p_user_id, a.id, a.course_id, p_extra, v_staff)
  returning * into g;

  select count(*) into v_used from public.attempts
  where user_id = p_user_id and assessment_id = a.id;

  -- aparece na atividade recente do aluno (sem XP)
  perform public.add_xp(p_user_id, 0, 'attempts_granted', a.id, jsonb_build_object('extra', p_extra));

  return jsonb_build_object(
    'grant', to_jsonb(g),
    'used', v_used,
    'limit', public.attempt_limit(p_user_id, a.id)
  );
end $$;

-- ---------------------------------------------------------------------
-- RPC: envia uma tentativa de avaliação. Igual à 0001, mas o limite
-- agora soma as tentativas liberadas pelo instrutor.
-- ---------------------------------------------------------------------
create or replace function public.submit_attempt(
  p_assessment_id uuid,
  p_answers       jsonb,
  p_started_at    timestamptz default null
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_user        uuid := auth.uid();
  a             public.assessments;
  q             record;
  v_user_ans    jsonb;
  v_correct     boolean;
  v_score       numeric := 0;
  v_max         numeric := 0;
  v_details     jsonb := '[]'::jsonb;
  v_n           integer;
  v_limit       integer;
  v_pct         numeric;
  v_passed      boolean;
  v_prev_passed boolean;
  v_xp          integer := 0;
  t             public.attempts;
  e             public.enrollments;
  v_new         jsonb;
begin
  if v_user is null then
    raise exception 'não autenticado' using errcode = '42501';
  end if;

  select * into a from public.assessments where id = p_assessment_id;
  if not found then
    raise exception 'avaliação não encontrada' using errcode = 'P0002';
  end if;
  if not exists (select 1 from public.enrollments where user_id = v_user and course_id = a.course_id) then
    raise exception 'matrícula necessária' using errcode = '42501';
  end if;

  select count(*) into v_n from public.attempts
  where user_id = v_user and assessment_id = p_assessment_id;
  v_limit := public.attempt_limit(v_user, p_assessment_id);
  if v_limit is not null and v_n >= v_limit then
    raise exception 'limite de tentativas atingido' using errcode = 'P0001';
  end if;

  select exists (
    select 1 from public.attempts where user_id = v_user and assessment_id = p_assessment_id and passed
  ) into v_prev_passed;

  for q in
    select qu.id, qu.key, qu.position, qu.type, qu.points, qu.explanation_md, qk.answer as answer_key
    from public.questions qu
    join public.question_keys qk on qk.question_id = qu.id
    where qu.assessment_id = p_assessment_id
    order by qu.position
  loop
    v_user_ans := coalesce(p_answers, '{}'::jsonb) -> q.id::text;
    v_correct  := public.grade_answer(q.type, q.answer_key, v_user_ans);
    v_max      := v_max + q.points;
    if v_correct then v_score := v_score + q.points; end if;

    v_details := v_details || jsonb_build_array(jsonb_build_object(
      'question_id',    q.id,
      'key',            q.key,
      'position',       q.position,
      'type',           q.type,
      'points',         q.points,
      'earned',         case when v_correct then q.points else 0 end,
      'correct',        v_correct,
      'user_answer',    v_user_ans,
      'correct_answer', case when a.show_answers then q.answer_key else null end,
      'explanation_md', case when a.show_answers then q.explanation_md else null end
    ));
  end loop;

  v_pct    := case when v_max = 0 then 0 else round(100.0 * v_score / v_max, 1) end;
  v_passed := v_pct >= a.passing_score;

  insert into public.attempts
    (user_id, assessment_id, course_id, attempt_number, answers, details, score, max_score, pct, passed, started_at)
  values
    (v_user, p_assessment_id, a.course_id, v_n + 1, coalesce(p_answers, '{}'::jsonb), v_details,
     v_score, v_max, v_pct, v_passed, p_started_at)
  returning * into t;

  if v_passed and not v_prev_passed then
    update public.user_stats set assessments_passed = assessments_passed + 1 where user_id = v_user;
    v_xp := case a.kind when 'exam' then 150 else 100 end;
    if v_pct >= 100 then v_xp := v_xp + 50; end if;
    perform public.add_xp(v_user, v_xp, 'assessment_passed', p_assessment_id, jsonb_build_object('pct', v_pct, 'attempt', t.id));
  else
    perform public.add_xp(v_user, 0,
      case when v_passed then 'assessment_passed' else 'assessment_failed' end,
      p_assessment_id, jsonb_build_object('pct', v_pct, 'attempt', t.id));
  end if;

  perform public.touch_streak(v_user);
  e := public.recompute_enrollment(v_user, a.course_id);

  select coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) into v_new
  from public.award_achievements(v_user) x;

  return jsonb_build_object(
    'attempt', to_jsonb(t),
    'enrollment', to_jsonb(e),
    'xp_gained', v_xp,
    'new_achievements', v_new
  );
end $$;

-- ---------------------------------------------------------------------
-- Permissões de execução
-- ---------------------------------------------------------------------
revoke all on function public.grant_extra_attempts(uuid, uuid, integer) from public, anon;
grant execute on function public.grant_extra_attempts(uuid, uuid, integer) to authenticated;
revoke all on function public.attempt_limit(uuid, uuid) from public, anon, authenticated;
revoke all on function public.submit_attempt(uuid, jsonb, timestamptz) from public, anon;
grant execute on function public.submit_attempt(uuid, jsonb, timestamptz) to authenticated;
