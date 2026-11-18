-- =====================================================================
-- Listas de exercícios: treino por tema, com entrega na plataforma.
--
-- Dois jeitos de responder:
--   code   : o aluno roda o código num compilador on-line e entrega o
--            código e a saída; o instrutor aprova ou devolve com comentário.
--   teoria : single, multiple, truefalse, fill e drag (arrastar e soltar),
--            corrigidas no servidor, com até 3 tentativas por exercício.
--
-- exercise_lists, exercise_topics, exercises e exercise_keys são preenchidas
-- pelo content:sync a partir de content/courses/<curso>/exercicios/.
-- O gabarito (exercise_keys) nunca é lido pelo aluno, e as respostas só
-- mudam pelas funções SECURITY DEFINER submit_exercise e review_exercise.
-- As listas são treino: não contam para o progresso nem para a conclusão.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Conteúdo
-- ---------------------------------------------------------------------
create table if not exists public.exercise_lists (
  id           uuid primary key default gen_random_uuid(),
  course_id    uuid not null references public.courses(id) on delete cascade,
  slug         text not null,
  title        text not null,
  summary      text,
  intro_md     text not null default '',
  position     integer not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (course_id, slug)
);
create index if not exists exercise_lists_course_idx on public.exercise_lists (course_id, position);

create table if not exists public.exercise_topics (
  id           uuid primary key default gen_random_uuid(),
  list_id      uuid not null references public.exercise_lists(id) on delete cascade,
  slug         text not null,
  title        text not null,
  module_title text,             -- módulo da aula, para agrupar o índice
  lesson_slug  text,
  lesson_title text,
  recap_md     text,             -- lembrete curto do conteúdo, antes dos exercícios
  position     integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (list_id, slug)
);
create index if not exists exercise_topics_list_idx on public.exercise_topics (list_id, position);

create table if not exists public.exercises (
  id           uuid primary key default gen_random_uuid(),
  list_id      uuid not null references public.exercise_lists(id) on delete cascade,
  topic_id     uuid not null references public.exercise_topics(id) on delete cascade,
  key          text not null,
  position     integer not null default 0,
  type         text not null check (type in ('code', 'single', 'multiple', 'truefalse', 'fill', 'drag')),
  prompt_md    text not null,
  starter_code text,             -- código inicial que o aluno copia (só em code)
  options      jsonb,            -- alternativas, ou { layout, slots, items } em drag
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (topic_id, key)
);
create index if not exists exercises_list_idx on public.exercises (list_id, position);

-- Gabarito: sem policy para alunos (só staff lê).
create table if not exists public.exercise_keys (
  exercise_id     uuid primary key references public.exercises(id) on delete cascade,
  answer          jsonb,         -- resposta das questões de teoria
  explanation_md  text,
  solution_code   text,          -- solução de referência (code)
  expected_output text,          -- saída da solução de referência (code)
  updated_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Respostas: uma linha por aluno e exercício.
--   answered : teoria respondida (correct diz se acertou)
--   submitted: código entregue, aguardando o instrutor
--   returned : código devolvido para ajustes (o aluno reenvia)
--   approved : código aprovado pelo instrutor
-- ---------------------------------------------------------------------
create table if not exists public.exercise_answers (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  exercise_id  uuid not null references public.exercises(id) on delete cascade,
  list_id      uuid not null references public.exercise_lists(id) on delete cascade,
  course_id    uuid not null references public.courses(id) on delete cascade,
  code         text,
  output       text,
  answer       jsonb,
  correct      boolean,
  tries        integer not null default 0,
  status       text not null check (status in ('answered', 'submitted', 'returned', 'approved')),
  feedback     text,
  reviewed_by  uuid references public.profiles(id) on delete set null,
  reviewed_at  timestamptz,
  submitted_at timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (user_id, exercise_id)
);
create index if not exists exercise_answers_list_idx on public.exercise_answers (list_id, user_id);
create index if not exists exercise_answers_course_idx on public.exercise_answers (course_id, status);

do $$
declare t text;
begin
  foreach t in array array['exercise_lists','exercise_topics','exercises','exercise_keys','exercise_answers'] loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------
alter table public.exercise_lists   enable row level security;
alter table public.exercise_topics  enable row level security;
alter table public.exercises        enable row level security;
alter table public.exercise_keys    enable row level security;
alter table public.exercise_answers enable row level security;

-- o conteúdo é visível como os projetos: lista publicada de curso publicado (ou staff)
drop policy if exists "exercise_lists_select" on public.exercise_lists;
create policy "exercise_lists_select" on public.exercise_lists for select to authenticated
  using (
    public.is_staff()
    or (is_published and exists (select 1 from public.courses c where c.id = course_id and c.is_published))
  );

drop policy if exists "exercise_topics_select" on public.exercise_topics;
create policy "exercise_topics_select" on public.exercise_topics for select to authenticated
  using (exists (select 1 from public.exercise_lists l where l.id = list_id));

drop policy if exists "exercises_select" on public.exercises;
create policy "exercises_select" on public.exercises for select to authenticated
  using (exists (select 1 from public.exercise_lists l where l.id = list_id));

drop policy if exists "exercise_keys_select_staff" on public.exercise_keys;
create policy "exercise_keys_select_staff" on public.exercise_keys for select to authenticated
  using (public.is_staff());

-- respostas: só leitura (escrita via RPC)
drop policy if exists "exercise_answers_select" on public.exercise_answers;
create policy "exercise_answers_select" on public.exercise_answers for select to authenticated
  using (user_id = auth.uid() or public.is_staff());

-- ---------------------------------------------------------------------
-- Correção de uma questão de teoria. Em drag, a resposta é o objeto
-- { "<slot>": "<item>" } e precisa ser igual ao gabarito.
-- ---------------------------------------------------------------------
create or replace function public.grade_exercise(p_type text, p_key jsonb, p_answer jsonb)
returns boolean language plpgsql immutable as $$
begin
  if p_answer is null or p_answer = 'null'::jsonb then
    return false;
  end if;
  if p_type = 'drag' then
    return jsonb_typeof(p_answer) = 'object' and p_answer = p_key;
  end if;
  return public.grade_answer(p_type::public.question_type, p_key, p_answer);
end $$;

-- ---------------------------------------------------------------------
-- O que o aluno pode ver do gabarito de um exercício, já com a resposta dele:
--   teoria: resposta e explicação depois de acertar ou gastar as tentativas
--   code  : solução e explicação depois que o instrutor aprovar
-- ---------------------------------------------------------------------
create or replace function public.exercise_reveal(p_type text, p_answer public.exercise_answers, p_key public.exercise_keys)
returns jsonb language sql stable as $$
  select case
    when p_answer.id is null or p_key.exercise_id is null then null
    when p_type = 'code' and p_answer.status = 'approved' then jsonb_build_object(
      'solution_code', p_key.solution_code,
      'expected_output', p_key.expected_output,
      'explanation_md', p_key.explanation_md)
    when p_type <> 'code' and (p_answer.correct or p_answer.tries >= 3) then jsonb_build_object(
      'answer', p_key.answer,
      'explanation_md', p_key.explanation_md)
    else null
  end;
$$;

-- ---------------------------------------------------------------------
-- RPC do aluno: entrega um exercício.
--   code  : p_code e p_output obrigatórios; pode trocar até ser aprovado
--   teoria: p_answer corrigida aqui; até 3 tentativas, encerra ao acertar
-- ---------------------------------------------------------------------
create or replace function public.submit_exercise(
  p_exercise_id uuid,
  p_answer      jsonb default null,
  p_code        text  default null,
  p_output      text  default null
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_user    uuid := auth.uid();
  x         public.exercises;
  l         public.exercise_lists;
  k         public.exercise_keys;
  a         public.exercise_answers;
  v_correct boolean;
begin
  if v_user is null then
    raise exception 'não autenticado' using errcode = '42501';
  end if;

  select * into x from public.exercises where id = p_exercise_id;
  if not found then
    raise exception 'exercício não encontrado' using errcode = 'P0002';
  end if;
  select * into l from public.exercise_lists where id = x.list_id;
  if not exists (select 1 from public.enrollments where user_id = v_user and course_id = l.course_id) then
    raise exception 'matrícula necessária' using errcode = '42501';
  end if;

  select * into k from public.exercise_keys where exercise_id = x.id;
  select * into a from public.exercise_answers
  where user_id = v_user and exercise_id = x.id for update;

  if x.type = 'code' then
    if btrim(coalesce(p_code, '')) = '' then
      raise exception 'cole o código que você escreveu' using errcode = '22023';
    end if;
    if btrim(coalesce(p_output, '')) = '' then
      raise exception 'cole a saída que apareceu ao rodar o código' using errcode = '22023';
    end if;
    if length(p_code) > 20000 or length(p_output) > 20000 then
      raise exception 'código ou saída com mais de 20000 caracteres' using errcode = '22023';
    end if;
    if a.id is not null and a.status = 'approved' then
      raise exception 'este exercício já foi aprovado pelo instrutor' using errcode = 'P0001';
    end if;

    insert into public.exercise_answers (user_id, exercise_id, list_id, course_id, code, output, tries, status)
    values (v_user, x.id, x.list_id, l.course_id, p_code, p_output, 1, 'submitted')
    on conflict (user_id, exercise_id) do update
      set code = excluded.code, output = excluded.output, tries = exercise_answers.tries + 1,
          status = 'submitted', feedback = null, reviewed_by = null, reviewed_at = null, submitted_at = now()
    returning * into a;
  else
    if p_answer is null or p_answer = 'null'::jsonb then
      raise exception 'responda antes de conferir' using errcode = '22023';
    end if;
    if a.id is not null and (a.correct or a.tries >= 3) then
      raise exception 'este exercício já foi encerrado' using errcode = 'P0001';
    end if;

    v_correct := public.grade_exercise(x.type, k.answer, p_answer);

    insert into public.exercise_answers (user_id, exercise_id, list_id, course_id, answer, correct, tries, status)
    values (v_user, x.id, x.list_id, l.course_id, p_answer, v_correct, 1, 'answered')
    on conflict (user_id, exercise_id) do update
      set answer = excluded.answer, correct = excluded.correct, tries = exercise_answers.tries + 1,
          submitted_at = now()
    returning * into a;
  end if;

  perform public.touch_streak(v_user);

  return jsonb_build_object('answer', to_jsonb(a), 'reveal', public.exercise_reveal(x.type, a, k));
end $$;

-- ---------------------------------------------------------------------
-- RPC do aluno: as próprias respostas numa lista, com o que já pode ver
-- do gabarito.
-- ---------------------------------------------------------------------
create or replace function public.my_exercise_answers(p_list_id uuid)
returns jsonb
language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_agg(to_jsonb(a) || jsonb_build_object('reveal', public.exercise_reveal(x.type, a, k))), '[]'::jsonb)
  from public.exercise_answers a
  join public.exercises x on x.id = a.exercise_id
  left join public.exercise_keys k on k.exercise_id = a.exercise_id
  where a.user_id = auth.uid() and a.list_id = p_list_id;
$$;

-- ---------------------------------------------------------------------
-- RPC do instrutor: aprova o código entregue ou devolve com um comentário.
-- ---------------------------------------------------------------------
create or replace function public.review_exercise(
  p_answer_id uuid,
  p_approved  boolean,
  p_feedback  text default null
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_staff    uuid := auth.uid();
  a          public.exercise_answers;
  v_feedback text := nullif(btrim(coalesce(p_feedback, '')), '');
begin
  if v_staff is null or not public.is_staff() then
    raise exception 'apenas instrutores corrigem exercícios' using errcode = '42501';
  end if;

  select * into a from public.exercise_answers where id = p_answer_id for update;
  if not found then
    raise exception 'resposta não encontrada' using errcode = 'P0002';
  end if;
  if a.status = 'answered' then
    raise exception 'questões de teoria são corrigidas automaticamente' using errcode = 'P0001';
  end if;
  if not coalesce(p_approved, false) and v_feedback is null then
    raise exception 'escreva um comentário dizendo o que ajustar' using errcode = '22023';
  end if;
  if v_feedback is not null and length(v_feedback) > 5000 then
    raise exception 'comentário com mais de 5000 caracteres' using errcode = '22023';
  end if;

  update public.exercise_answers
  set status = case when p_approved then 'approved' else 'returned' end,
      feedback = v_feedback, reviewed_by = v_staff, reviewed_at = now()
  where id = a.id
  returning * into a;

  return jsonb_build_object('answer', to_jsonb(a));
end $$;

-- ---------------------------------------------------------------------
-- Permissões de execução
-- ---------------------------------------------------------------------
revoke all on function public.grade_exercise(text, jsonb, jsonb) from public, anon, authenticated;
revoke all on function public.exercise_reveal(text, public.exercise_answers, public.exercise_keys) from public, anon, authenticated;
revoke all on function public.submit_exercise(uuid, jsonb, text, text) from public, anon;
revoke all on function public.my_exercise_answers(uuid) from public, anon;
revoke all on function public.review_exercise(uuid, boolean, text) from public, anon;
grant execute on function public.submit_exercise(uuid, jsonb, text, text) to authenticated;
grant execute on function public.my_exercise_answers(uuid) to authenticated;
grant execute on function public.review_exercise(uuid, boolean, text) to authenticated;
