-- =====================================================================
-- Projetos avaliados: enunciado com etapas ligadas às aulas, entrega do
-- aluno (link do repositório) e correção do instrutor por rubrica.
--
-- projects e project_guides são preenchidas pelo content:sync a partir de
-- content/courses/<curso>/projetos/. As entregas e as notas só mudam pelas
-- funções SECURITY DEFINER submit_project (aluno) e grade_project (staff).
-- Projetos obrigatórios contam para a conclusão do curso.
-- =====================================================================

do $$ begin
  create type public.submission_status as enum ('submitted', 'returned', 'graded');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------
-- Conteúdo
-- ---------------------------------------------------------------------
create table if not exists public.projects (
  id            uuid primary key default gen_random_uuid(),
  course_id     uuid not null references public.courses(id) on delete cascade,
  module_id     uuid references public.modules(id) on delete set null,
  slug          text not null,
  title         text not null,
  summary       text,
  section       text,                         -- agrupamento na página do curso (ex.: "Módulo Básico")
  content_md    text not null default '',     -- enunciado
  rubric        jsonb not null default '[]',  -- [{ key, title, description, points }]
  steps         jsonb not null default '[]',  -- [{ lesson, when, title, summary }] (slugs de aula)
  opens_lesson  text,                         -- slug da aula em que o projeto começa
  due_lesson    text,                         -- slug da aula até a qual a entrega deve chegar
  due_label     text,                         -- o prazo como o aluno lê ("início do E08")
  passing_score numeric not null default 70,
  is_required   boolean not null default true,
  position      integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (course_id, slug)
);
create index if not exists projects_course_position_idx on public.projects (course_id, position);

-- Guia de correção: sem policy para alunos (só staff lê).
create table if not exists public.project_guides (
  project_id uuid primary key references public.projects(id) on delete cascade,
  content_md text not null default '',
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Entregas: uma linha por aluno e projeto, com a versão atual e o
-- histórico das anteriores (link, nota e comentário de cada uma).
--   submitted: aguardando correção (o aluno ainda pode trocar o link)
--   returned : devolvido para ajustes (o aluno reenvia; vira nova versão)
--   graded   : nota final lançada (passed diz se foi aprovado)
-- ---------------------------------------------------------------------
create table if not exists public.project_submissions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  project_id   uuid not null references public.projects(id) on delete cascade,
  course_id    uuid not null references public.courses(id) on delete cascade,
  version      integer not null default 1,
  repo_url     text not null,
  demo_url     text,
  notes        text,
  status       public.submission_status not null default 'submitted',
  submitted_at timestamptz not null default now(),
  scores       jsonb,              -- {"<key do critério>": pontos}
  score        numeric,
  max_score    numeric,
  pct          numeric,
  passed       boolean,            -- só com status graded
  feedback     text,
  graded_by    uuid references public.profiles(id) on delete set null,
  graded_at    timestamptz,
  history      jsonb not null default '[]',
  updated_at   timestamptz not null default now(),
  unique (user_id, project_id)
);
create index if not exists project_submissions_course_idx on public.project_submissions (course_id, project_id);

do $$
declare t text;
begin
  foreach t in array array['projects','project_guides','project_submissions'] loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------
alter table public.projects            enable row level security;
alter table public.project_guides      enable row level security;
alter table public.project_submissions enable row level security;

-- o enunciado é visível como as avaliações: curso publicado (ou staff)
drop policy if exists "projects_select" on public.projects;
create policy "projects_select" on public.projects for select to authenticated
  using (
    public.is_staff()
    or exists (select 1 from public.courses c where c.id = course_id and c.is_published)
  );

drop policy if exists "project_guides_select_staff" on public.project_guides;
create policy "project_guides_select_staff" on public.project_guides for select to authenticated
  using (public.is_staff());

-- entregas: só leitura (escrita via RPC)
drop policy if exists "project_submissions_select" on public.project_submissions;
create policy "project_submissions_select" on public.project_submissions for select to authenticated
  using (user_id = auth.uid() or public.is_staff());

-- ---------------------------------------------------------------------
-- Link aceito na entrega: https, com domínio, sem espaços.
-- ---------------------------------------------------------------------
create or replace function public.is_valid_url(p text) returns boolean
language sql immutable as $$
  select p is not null and length(p) <= 500 and p ~* '^https://[a-z0-9.-]+\.[a-z]{2,}(:[0-9]+)?(/[^[:space:]]*)?$';
$$;

-- ---------------------------------------------------------------------
-- RPC do aluno: envia (ou reenvia) a entrega de um projeto.
--   Sem entrega ou "submitted": grava/atualiza a versão atual.
--   "returned": a versão anterior vai para o histórico e nasce a próxima.
--   "graded": recusa; o instrutor precisa devolver para ajustes antes.
-- ---------------------------------------------------------------------
create or replace function public.submit_project(
  p_project_id uuid,
  p_repo_url   text,
  p_demo_url   text default null,
  p_notes      text default null
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_user  uuid := auth.uid();
  p       public.projects;
  s       public.project_submissions;
  v_repo  text := nullif(trim(coalesce(p_repo_url, '')), '');
  v_demo  text := nullif(trim(coalesce(p_demo_url, '')), '');
  v_notes text := nullif(trim(coalesce(p_notes, '')), '');
begin
  if v_user is null then
    raise exception 'não autenticado' using errcode = '42501';
  end if;

  select * into p from public.projects where id = p_project_id;
  if not found then
    raise exception 'projeto não encontrado' using errcode = 'P0002';
  end if;
  if not exists (select 1 from public.enrollments where user_id = v_user and course_id = p.course_id) then
    raise exception 'matrícula necessária' using errcode = '42501';
  end if;

  if not public.is_valid_url(v_repo) then
    raise exception 'link do repositório inválido: use o endereço completo, começando com https://' using errcode = '22023';
  end if;
  if v_demo is not null and not public.is_valid_url(v_demo) then
    raise exception 'link de demonstração inválido: use o endereço completo, começando com https://' using errcode = '22023';
  end if;
  if v_notes is not null and length(v_notes) > 2000 then
    raise exception 'comentário com mais de 2000 caracteres' using errcode = '22023';
  end if;

  select * into s from public.project_submissions
  where user_id = v_user and project_id = p_project_id for update;

  if not found then
    insert into public.project_submissions (user_id, project_id, course_id, repo_url, demo_url, notes)
    values (v_user, p_project_id, p.course_id, v_repo, v_demo, v_notes)
    returning * into s;
  elsif s.status = 'graded' then
    raise exception 'este projeto já tem nota final; peça ao instrutor para devolvê-lo se quiser reenviar' using errcode = 'P0001';
  elsif s.status = 'submitted' then
    update public.project_submissions
    set repo_url = v_repo, demo_url = v_demo, notes = v_notes, submitted_at = now()
    where id = s.id
    returning * into s;
  else
    update public.project_submissions
    set history = history || jsonb_build_array(jsonb_build_object(
          'version', version, 'repo_url', repo_url, 'demo_url', demo_url, 'notes', notes,
          'submitted_at', submitted_at, 'status', status, 'scores', scores, 'score', score,
          'max_score', max_score, 'pct', pct, 'feedback', feedback, 'graded_at', graded_at)),
        version = version + 1,
        repo_url = v_repo, demo_url = v_demo, notes = v_notes,
        status = 'submitted', submitted_at = now(),
        scores = null, score = null, max_score = null, pct = null, passed = null,
        feedback = null, graded_by = null, graded_at = null
    where id = s.id
    returning * into s;
  end if;

  perform public.add_xp(v_user, 0, 'project_submitted', p_project_id, jsonb_build_object('version', s.version));
  perform public.touch_streak(v_user);

  return jsonb_build_object('submission', to_jsonb(s));
end $$;

-- ---------------------------------------------------------------------
-- RPC do instrutor: corrige uma entrega pela rubrica.
--   p_scores = {"<key>": pontos} com todos os critérios, de 0 ao máximo
--   p_final  = true lança a nota final; false devolve para ajustes
-- A primeira aprovação de cada projeto vale 200 XP para o aluno.
-- ---------------------------------------------------------------------
create or replace function public.grade_project(
  p_submission_id uuid,
  p_scores        jsonb,
  p_feedback      text,
  p_final         boolean
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_staff    uuid := auth.uid();
  s          public.project_submissions;
  p          public.projects;
  c          jsonb;
  v_val      numeric;
  v_score    numeric := 0;
  v_max      numeric := 0;
  v_scores   jsonb := '{}'::jsonb;
  v_pct      numeric;
  v_passed   boolean;
  v_feedback text := nullif(trim(coalesce(p_feedback, '')), '');
  v_xp       integer := 0;
begin
  if v_staff is null or not public.is_staff() then
    raise exception 'apenas instrutores corrigem projetos' using errcode = '42501';
  end if;

  select * into s from public.project_submissions where id = p_submission_id for update;
  if not found then
    raise exception 'entrega não encontrada' using errcode = 'P0002';
  end if;
  select * into p from public.projects where id = s.project_id;

  for c in select * from jsonb_array_elements(p.rubric) loop
    begin
      v_val := (coalesce(p_scores, '{}'::jsonb) ->> (c ->> 'key'))::numeric;
    exception when others then
      v_val := null;
    end;
    if v_val is null then
      raise exception 'falta a nota do critério "%"', c ->> 'title' using errcode = '22023';
    end if;
    if v_val < 0 or v_val > (c ->> 'points')::numeric then
      raise exception 'nota do critério "%" deve ficar entre 0 e %', c ->> 'title', c ->> 'points' using errcode = '22023';
    end if;
    v_scores := v_scores || jsonb_build_object(c ->> 'key', v_val);
    v_score  := v_score + v_val;
    v_max    := v_max + (c ->> 'points')::numeric;
  end loop;
  if v_max = 0 then
    raise exception 'projeto sem rubrica' using errcode = 'P0001';
  end if;
  if v_feedback is not null and length(v_feedback) > 5000 then
    raise exception 'comentário com mais de 5000 caracteres' using errcode = '22023';
  end if;

  v_pct    := round(100.0 * v_score / v_max, 1);
  v_passed := case when p_final then v_pct >= p.passing_score else null end;

  update public.project_submissions
  set scores = v_scores, score = v_score, max_score = v_max, pct = v_pct,
      passed = v_passed, feedback = v_feedback,
      status = case when p_final then 'graded'::public.submission_status else 'returned'::public.submission_status end,
      graded_by = v_staff, graded_at = now()
  where id = s.id
  returning * into s;

  if p_final and v_passed and not exists (
    select 1 from public.activity_log
    where user_id = s.user_id and kind = 'project_passed' and ref_id = s.project_id
  ) then
    v_xp := 200;
    perform public.add_xp(s.user_id, v_xp, 'project_passed', s.project_id, jsonb_build_object('pct', v_pct, 'version', s.version));
  else
    perform public.add_xp(s.user_id, 0,
      case when not p_final then 'project_returned' when v_passed then 'project_passed' else 'project_failed' end,
      s.project_id, jsonb_build_object('pct', v_pct, 'version', s.version));
  end if;

  perform public.recompute_enrollment(s.user_id, s.course_id);
  perform public.award_achievements(s.user_id);

  return jsonb_build_object('submission', to_jsonb(s), 'xp_gained', v_xp);
end $$;

-- ---------------------------------------------------------------------
-- Progresso da matrícula: aulas + avaliações obrigatórias aprovadas
-- + projetos obrigatórios aprovados (nota final).
-- ---------------------------------------------------------------------
create or replace function public.recompute_enrollment(p_user uuid, p_course uuid)
returns public.enrollments
language plpgsql security definer set search_path = public as $$
declare
  e             public.enrollments;
  v_total       integer;
  v_done        integer;
  v_req_total   integer;
  v_req_passed  integer;
  v_proj_total  integer;
  v_proj_passed integer;
  v_pct         numeric;
  v_was_done    boolean;
begin
  select * into e from public.enrollments
  where user_id = p_user and course_id = p_course for update;
  if not found then return null; end if;
  v_was_done := e.completed_at is not null;

  select count(*) into v_total
  from public.lessons l where l.course_id = p_course and l.is_published;

  select count(*) into v_done
  from public.lesson_progress lp
  join public.lessons l on l.id = lp.lesson_id
  where lp.user_id = p_user and lp.course_id = p_course
    and lp.status = 'completed' and l.is_published;

  select count(*) into v_req_total
  from public.assessments a where a.course_id = p_course and a.is_required;

  select count(distinct t.assessment_id) into v_req_passed
  from public.attempts t
  join public.assessments a on a.id = t.assessment_id
  where t.user_id = p_user and t.course_id = p_course and t.passed and a.is_required;

  select count(*) into v_proj_total
  from public.projects p where p.course_id = p_course and p.is_required;

  select count(*) into v_proj_passed
  from public.project_submissions s
  join public.projects p on p.id = s.project_id
  where s.user_id = p_user and s.course_id = p_course
    and s.status = 'graded' and s.passed and p.is_required;

  v_pct := case
    when v_total + v_req_total + v_proj_total = 0 then 0
    else round(100.0 * (v_done + v_req_passed + v_proj_passed) / (v_total + v_req_total + v_proj_total), 1)
  end;

  update public.enrollments
  set progress_pct = v_pct,
      last_activity_at = now(),
      completed_at = case when v_pct >= 100 and completed_at is null then now() else completed_at end
  where id = e.id
  returning * into e;

  if not v_was_done and e.completed_at is not null then
    update public.user_stats set courses_completed = courses_completed + 1 where user_id = p_user;
    perform public.add_xp(p_user, 300, 'course_completed', p_course);
  end if;

  return e;
end $$;

-- ---------------------------------------------------------------------
-- Conquistas: acrescenta a regra {"type":"projects_approved","count":N}
-- (projetos com nota final aprovada). O resto é igual à 0001.
-- ---------------------------------------------------------------------
create or replace function public.award_achievements(p_user uuid)
returns setof public.achievements
language plpgsql security definer set search_path = public as $$
declare
  a        public.achievements;
  v_ok     boolean;
  v_type   text;
  v_n      integer;
  v_round  integer := 0;
  v_found  boolean;
begin
  loop
    v_round := v_round + 1;
    v_found := false;

    for a in
      select * from public.achievements ach
      where not exists (
        select 1 from public.user_achievements ua
        where ua.user_id = p_user and ua.achievement_id = ach.id
      )
      order by ach.position, ach.slug
    loop
      v_type := a.rule ->> 'type';
      v_n    := coalesce((a.rule ->> 'count')::integer, 1);
      v_ok   := false;

      case v_type
        when 'lessons_completed' then
          select count(*) >= v_n into v_ok
          from public.lesson_progress lp
          where lp.user_id = p_user and lp.status = 'completed'
            and (a.course_id is null or lp.course_id = a.course_id);

        when 'course_completed' then
          if a.course_id is null then
            select count(*) >= v_n into v_ok
            from public.enrollments e
            where e.user_id = p_user and e.completed_at is not null;
          else
            select exists (
              select 1 from public.enrollments e
              where e.user_id = p_user and e.course_id = a.course_id and e.completed_at is not null
            ) into v_ok;
          end if;

        when 'assessments_passed' then
          select count(distinct t.assessment_id) >= v_n into v_ok
          from public.attempts t
          where t.user_id = p_user and t.passed
            and (a.course_id is null or t.course_id = a.course_id);

        when 'perfect_score' then
          select count(distinct t.assessment_id) >= v_n into v_ok
          from public.attempts t
          where t.user_id = p_user and t.pct >= 100
            and (a.course_id is null or t.course_id = a.course_id);

        when 'first_try_pass' then
          select count(*) >= v_n into v_ok
          from public.attempts t
          where t.user_id = p_user and t.passed and t.attempt_number = 1
            and (a.course_id is null or t.course_id = a.course_id);

        when 'projects_approved' then
          select count(*) >= v_n into v_ok
          from public.project_submissions s
          where s.user_id = p_user and s.status = 'graded' and s.passed
            and (a.course_id is null or s.course_id = a.course_id);

        when 'xp_reached' then
          select xp >= coalesce((a.rule ->> 'amount')::integer, 0) into v_ok
          from public.user_stats where user_id = p_user;

        when 'streak_days' then
          select current_streak >= coalesce((a.rule ->> 'days')::integer, 1) into v_ok
          from public.user_stats where user_id = p_user;

        else
          v_ok := false;
      end case;

      if coalesce(v_ok, false) then
        insert into public.user_achievements (user_id, achievement_id)
        values (p_user, a.id) on conflict do nothing;
        if a.xp > 0 then
          perform public.add_xp(p_user, a.xp, 'achievement', a.id, jsonb_build_object('slug', a.slug));
        end if;
        v_found := true;
        return next a;
      end if;
    end loop;

    exit when not v_found or v_round >= 3;
  end loop;
  return;
end $$;

-- ---------------------------------------------------------------------
-- Permissões de execução
-- ---------------------------------------------------------------------
revoke all on function public.submit_project(uuid, text, text, text) from public, anon;
revoke all on function public.grade_project(uuid, jsonb, text, boolean) from public, anon;
grant execute on function public.submit_project(uuid, text, text, text) to authenticated;
grant execute on function public.grade_project(uuid, jsonb, text, boolean) to authenticated;

revoke all on function public.recompute_enrollment(uuid, uuid) from public, anon, authenticated;
revoke all on function public.award_achievements(uuid) from public, anon, authenticated;
