-- =====================================================================
-- Plataforma de cursos — esquema inicial
-- Execute no SQL Editor do Supabase (ou `supabase db push`).
-- Idempotente onde possível. Todas as escritas sensíveis (progresso,
-- notas, XP, conquistas) passam por funções SECURITY DEFINER; o cliente
-- nunca grava nessas tabelas diretamente.
-- =====================================================================


-- ---------------------------------------------------------------------
-- Tipos
-- ---------------------------------------------------------------------
do $$ begin
  create type public.user_role as enum ('student', 'instructor', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.lesson_status as enum ('in_progress', 'completed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.question_type as enum ('single', 'multiple', 'truefalse', 'fill');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.assessment_kind as enum ('quiz', 'exam');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.rarity as enum ('common', 'rare', 'epic', 'legendary');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------
-- Tabelas: usuário
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text unique check (username ~ '^[a-z0-9_]{3,30}$'),
  full_name   text not null default '',
  avatar_url  text,
  bio         text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.user_roles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  role    public.user_role not null default 'student'
);

create table if not exists public.user_stats (
  user_id            uuid primary key references public.profiles(id) on delete cascade,
  xp                 integer not null default 0,
  lessons_completed  integer not null default 0,
  assessments_passed integer not null default 0,
  courses_completed  integer not null default 0,
  current_streak     integer not null default 0,
  longest_streak     integer not null default 0,
  last_activity_date date,
  updated_at         timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Tabelas: conteúdo (preenchidas pelo script scripts/content.mjs)
-- ---------------------------------------------------------------------
create table if not exists public.courses (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique check (slug ~ '^[a-z0-9-]+$'),
  title           text not null,
  subtitle        text,
  description_md  text,
  cover_url       text,
  color           text,
  icon            text,
  level           text,
  estimated_hours numeric,
  tags            text[] not null default '{}',
  instructor_name text,
  is_published    boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table if not exists public.modules (
  id          uuid primary key default gen_random_uuid(),
  course_id   uuid not null references public.courses(id) on delete cascade,
  slug        text not null,
  title       text not null,
  description text,
  position    integer not null default 0,
  unique (course_id, slug)
);

create table if not exists public.lessons (
  id               uuid primary key default gen_random_uuid(),
  course_id        uuid not null references public.courses(id) on delete cascade,
  module_id        uuid references public.modules(id) on delete set null,
  slug             text not null,
  title            text not null,
  summary          text,
  objectives       text[] not null default '{}',
  duration_minutes integer,
  position         integer not null default 0,
  slide_count      integer not null default 0,
  content_md       text not null default '',
  is_published     boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (course_id, slug)
);
create index if not exists lessons_course_position_idx on public.lessons (course_id, position);

create table if not exists public.assessments (
  id                 uuid primary key default gen_random_uuid(),
  course_id          uuid not null references public.courses(id) on delete cascade,
  lesson_id          uuid references public.lessons(id) on delete set null,
  slug               text not null,
  title              text not null,
  description        text,
  kind               public.assessment_kind not null default 'quiz',
  passing_score      numeric not null default 70,
  max_attempts       integer,
  time_limit_minutes integer,
  shuffle_questions  boolean not null default true,
  shuffle_options    boolean not null default true,
  show_answers       boolean not null default true,
  is_required        boolean not null default true,
  position           integer not null default 0,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (course_id, slug)
);
create index if not exists assessments_course_idx on public.assessments (course_id, position);

create table if not exists public.questions (
  id             uuid primary key default gen_random_uuid(),
  assessment_id  uuid not null references public.assessments(id) on delete cascade,
  key            text not null,
  position       integer not null default 0,
  type           public.question_type not null,
  prompt_md      text not null,
  options        jsonb,
  explanation_md text,
  points         numeric not null default 1,
  unique (assessment_id, key)
);

-- Gabarito. Sem nenhuma policy: só funções SECURITY DEFINER e a service role leem.
create table if not exists public.question_keys (
  question_id uuid primary key references public.questions(id) on delete cascade,
  answer      jsonb not null
);

-- ---------------------------------------------------------------------
-- Tabelas: progresso e avaliação
-- ---------------------------------------------------------------------
create table if not exists public.enrollments (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profiles(id) on delete cascade,
  course_id        uuid not null references public.courses(id) on delete cascade,
  enrolled_at      timestamptz not null default now(),
  completed_at     timestamptz,
  progress_pct     numeric not null default 0,
  last_lesson_id   uuid references public.lessons(id) on delete set null,
  last_activity_at timestamptz not null default now(),
  unique (user_id, course_id)
);
create index if not exists enrollments_course_idx on public.enrollments (course_id);

create table if not exists public.lesson_progress (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references public.profiles(id) on delete cascade,
  lesson_id          uuid not null references public.lessons(id) on delete cascade,
  course_id          uuid not null references public.courses(id) on delete cascade,
  status             public.lesson_status not null default 'in_progress',
  last_slide         integer not null default 0,
  max_slide          integer not null default 0,
  slide_count        integer not null default 0,
  time_spent_seconds integer not null default 0,
  started_at         timestamptz not null default now(),
  completed_at       timestamptz,
  updated_at         timestamptz not null default now(),
  unique (user_id, lesson_id)
);
create index if not exists lesson_progress_user_course_idx on public.lesson_progress (user_id, course_id);

create table if not exists public.attempts (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  assessment_id  uuid not null references public.assessments(id) on delete cascade,
  course_id      uuid not null references public.courses(id) on delete cascade,
  attempt_number integer not null,
  answers        jsonb not null,
  details        jsonb not null,
  score          numeric not null,
  max_score      numeric not null,
  pct            numeric not null,
  passed         boolean not null,
  started_at     timestamptz,
  submitted_at   timestamptz not null default now()
);
create index if not exists attempts_user_assessment_idx on public.attempts (user_id, assessment_id);
create index if not exists attempts_user_course_idx on public.attempts (user_id, course_id);

-- ---------------------------------------------------------------------
-- Tabelas: gamificação
-- ---------------------------------------------------------------------
create table if not exists public.achievements (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  description text not null,
  icon        text not null default 'award',
  rarity      public.rarity not null default 'common',
  xp          integer not null default 0,
  rule        jsonb not null,
  course_id   uuid references public.courses(id) on delete cascade,
  is_secret   boolean not null default false,
  position    integer not null default 0
);

create table if not exists public.user_achievements (
  user_id        uuid not null references public.profiles(id) on delete cascade,
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  earned_at      timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

create table if not exists public.activity_log (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  kind       text not null,
  ref_id     uuid,
  xp         integer not null default 0,
  meta       jsonb,
  created_at timestamptz not null default now()
);
create index if not exists activity_log_user_idx on public.activity_log (user_id, created_at desc);

-- ---------------------------------------------------------------------
-- updated_at automático
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

do $$
declare t text;
begin
  foreach t in array array['profiles','courses','lessons','assessments','user_stats'] loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- Helpers de autorização
-- ---------------------------------------------------------------------
create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role in ('instructor', 'admin')
  );
$$;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.is_enrolled(p_course_id uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.enrollments where user_id = auth.uid() and course_id = p_course_id
  );
$$;

-- ---------------------------------------------------------------------
-- Novo usuário -> perfil, papel e estatísticas
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_name     text;
  v_username text;
begin
  v_name := coalesce(
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'name', ''),
    split_part(coalesce(new.email, ''), '@', 1)
  );
  v_username := regexp_replace(lower(split_part(coalesce(new.email, ''), '@', 1)), '[^a-z0-9_]', '', 'g');
  if length(v_username) < 3 then v_username := null; end if;

  begin
    insert into public.profiles (id, full_name, username, avatar_url)
    values (new.id, v_name, v_username, new.raw_user_meta_data ->> 'avatar_url');
  exception when unique_violation or check_violation then
    insert into public.profiles (id, full_name, username, avatar_url)
    values (new.id, v_name, null, new.raw_user_meta_data ->> 'avatar_url');
  end;

  insert into public.user_roles (user_id) values (new.id) on conflict do nothing;
  insert into public.user_stats (user_id) values (new.id) on conflict do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- XP, atividade e sequência de dias
-- ---------------------------------------------------------------------
create or replace function public.add_xp(p_user uuid, p_amount integer, p_kind text, p_ref uuid, p_meta jsonb default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.activity_log (user_id, kind, ref_id, xp, meta)
  values (p_user, p_kind, p_ref, coalesce(p_amount, 0), p_meta);
  if coalesce(p_amount, 0) <> 0 then
    update public.user_stats set xp = xp + p_amount where user_id = p_user;
  end if;
end $$;

-- Fuso usado para contar "dias" de sequência.
create or replace function public.touch_streak(p_user uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_today  date := (now() at time zone 'America/Sao_Paulo')::date;
  v_last   date;
  v_streak integer;
begin
  select last_activity_date, current_streak into v_last, v_streak
  from public.user_stats where user_id = p_user;

  if v_last = v_today then
    return;
  elsif v_last = v_today - 1 then
    v_streak := coalesce(v_streak, 0) + 1;
  else
    v_streak := 1;
  end if;

  update public.user_stats
  set current_streak = v_streak,
      longest_streak = greatest(longest_streak, v_streak),
      last_activity_date = v_today
  where user_id = p_user;
end $$;

-- ---------------------------------------------------------------------
-- Conquistas: avalia regras e concede as que faltam
-- Regras (achievements.rule):
--   {"type":"lessons_completed","count":N}
--   {"type":"course_completed","count":N}        (count só vale para globais)
--   {"type":"assessments_passed","count":N}
--   {"type":"perfect_score","count":N}
--   {"type":"first_try_pass","count":N}
--   {"type":"xp_reached","amount":N}
--   {"type":"streak_days","days":N}
-- Se achievement.course_id estiver preenchido, a regra conta só aquele curso.
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

    -- XP de conquistas pode destravar conquistas de XP: repete até estabilizar
    exit when not v_found or v_round >= 3;
  end loop;
  return;
end $$;

-- ---------------------------------------------------------------------
-- Progresso da matrícula (aulas concluídas + avaliações obrigatórias)
-- ---------------------------------------------------------------------
create or replace function public.recompute_enrollment(p_user uuid, p_course uuid)
returns public.enrollments
language plpgsql security definer set search_path = public as $$
declare
  e            public.enrollments;
  v_total      integer;
  v_done       integer;
  v_req_total  integer;
  v_req_passed integer;
  v_pct        numeric;
  v_was_done   boolean;
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

  v_pct := case
    when v_total + v_req_total = 0 then 0
    else round(100.0 * (v_done + v_req_passed) / (v_total + v_req_total), 1)
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
-- RPC: progresso de aula (chamada pelo player de slides)
--   p_seconds = segundos desde a última chamada (delta)
--   p_complete = true marca a aula como concluída
-- ---------------------------------------------------------------------
create or replace function public.track_lesson_progress(
  p_lesson_id   uuid,
  p_slide       integer,
  p_slide_count integer,
  p_seconds     integer default 0,
  p_complete    boolean default false
) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_user   uuid := auth.uid();
  v_course uuid;
  lp       public.lesson_progress;
  e        public.enrollments;
  v_xp     integer := 0;
  v_new    jsonb;
begin
  if v_user is null then
    raise exception 'não autenticado' using errcode = '42501';
  end if;

  select course_id into v_course from public.lessons
  where id = p_lesson_id and is_published;
  if v_course is null then
    raise exception 'aula não encontrada' using errcode = 'P0002';
  end if;
  if not exists (select 1 from public.enrollments where user_id = v_user and course_id = v_course) then
    raise exception 'matrícula necessária' using errcode = '42501';
  end if;

  insert into public.lesson_progress
    (user_id, lesson_id, course_id, last_slide, max_slide, slide_count, time_spent_seconds)
  values
    (v_user, p_lesson_id, v_course, greatest(p_slide, 0), greatest(p_slide, 0),
     greatest(p_slide_count, 1), least(greatest(coalesce(p_seconds, 0), 0), 3600))
  on conflict (user_id, lesson_id) do update set
    last_slide         = greatest(excluded.last_slide, 0),
    max_slide          = greatest(public.lesson_progress.max_slide, excluded.last_slide),
    slide_count        = excluded.slide_count,
    time_spent_seconds = public.lesson_progress.time_spent_seconds + excluded.time_spent_seconds,
    updated_at         = now()
  returning * into lp;

  if p_complete and lp.status <> 'completed' then
    update public.lesson_progress
    set status = 'completed', completed_at = now(),
        max_slide = greatest(max_slide, slide_count - 1)
    where id = lp.id
    returning * into lp;

    update public.user_stats set lessons_completed = lessons_completed + 1 where user_id = v_user;
    v_xp := 50;
    perform public.add_xp(v_user, v_xp, 'lesson_completed', p_lesson_id);
  end if;

  update public.enrollments
  set last_lesson_id = p_lesson_id, last_activity_at = now()
  where user_id = v_user and course_id = v_course;

  perform public.touch_streak(v_user);
  e := public.recompute_enrollment(v_user, v_course);

  select coalesce(jsonb_agg(to_jsonb(x)), '[]'::jsonb) into v_new
  from public.award_achievements(v_user) x;

  return jsonb_build_object(
    'progress', to_jsonb(lp),
    'enrollment', to_jsonb(e),
    'xp_gained', v_xp,
    'new_achievements', v_new
  );
end $$;

-- ---------------------------------------------------------------------
-- Correção de uma resposta
--   single   : key "b"                     answer "b"
--   multiple : key ["a","c"]               answer ["c","a"]
--   truefalse: key true                    answer true | "true"
--   fill     : key [["NOT NULL","not null"],["PRIMARY KEY"]]  answer ["not null","primary key"]
-- ---------------------------------------------------------------------
create or replace function public.normalize_text(t text) returns text
language sql immutable as $$
  select regexp_replace(lower(trim(coalesce(t, ''))), '\s+', ' ', 'g');
$$;

create or replace function public.grade_answer(p_type public.question_type, p_key jsonb, p_answer jsonb)
returns boolean language plpgsql immutable as $$
declare
  i       integer;
  v_given text;
  v_opt   text;
  v_ok    boolean;
begin
  if p_answer is null or p_answer = 'null'::jsonb then
    return false;
  end if;

  case p_type
    when 'single' then
      return jsonb_typeof(p_answer) = 'string'
         and public.normalize_text(p_answer #>> '{}') = public.normalize_text(p_key #>> '{}');

    when 'truefalse' then
      return public.normalize_text(p_answer #>> '{}') = public.normalize_text(p_key #>> '{}');

    when 'multiple' then
      if jsonb_typeof(p_answer) <> 'array' or jsonb_typeof(p_key) <> 'array' then
        return false;
      end if;
      return (select coalesce(array_agg(lower(x) order by lower(x)), '{}'::text[]) from jsonb_array_elements_text(p_answer) x)
           = (select coalesce(array_agg(lower(x) order by lower(x)), '{}'::text[]) from jsonb_array_elements_text(p_key) x);

    when 'fill' then
      if jsonb_typeof(p_answer) <> 'array' or jsonb_typeof(p_key) <> 'array' then
        return false;
      end if;
      if jsonb_array_length(p_answer) <> jsonb_array_length(p_key) then
        return false;
      end if;
      for i in 0 .. jsonb_array_length(p_key) - 1 loop
        v_given := public.normalize_text(p_answer ->> i);
        v_ok := false;
        for v_opt in select jsonb_array_elements_text(p_key -> i) loop
          if public.normalize_text(v_opt) = v_given then
            v_ok := true;
            exit;
          end if;
        end loop;
        if not v_ok then return false; end if;
      end loop;
      return true;

    else
      return false;
  end case;
end $$;

-- ---------------------------------------------------------------------
-- RPC: envia uma tentativa de avaliação. Corrige no servidor.
--   p_answers = {"<question_id>": <resposta>}
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
  if a.max_attempts is not null and v_n >= a.max_attempts then
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
-- RPC: matrícula (registra atividade e devolve a matrícula)
-- ---------------------------------------------------------------------
create or replace function public.enroll(p_course_id uuid) returns public.enrollments
language plpgsql security definer set search_path = public as $$
declare
  v_user uuid := auth.uid();
  e      public.enrollments;
begin
  if v_user is null then
    raise exception 'não autenticado' using errcode = '42501';
  end if;
  if not exists (select 1 from public.courses where id = p_course_id and (is_published or public.is_staff())) then
    raise exception 'curso não encontrado' using errcode = 'P0002';
  end if;

  insert into public.enrollments (user_id, course_id) values (v_user, p_course_id)
  on conflict (user_id, course_id) do update set last_activity_at = now()
  returning * into e;

  perform public.add_xp(v_user, 0, 'enrolled', p_course_id);
  return e;
end $$;

-- ---------------------------------------------------------------------
-- Views
-- ---------------------------------------------------------------------
-- Sumário das aulas (sem conteúdo) de cursos publicados, visível antes da matrícula.
create or replace view public.v_course_syllabus as
  select l.id, l.course_id, l.module_id, l.slug, l.title, l.summary, l.objectives,
         l.duration_minutes, l.position, l.slide_count
  from public.lessons l
  join public.courses c on c.id = l.course_id
  where l.is_published and c.is_published;

-- Painel do instrutor: progresso dos alunos (respeita RLS de quem consulta).
create or replace view public.v_student_progress
with (security_invoker = true) as
  select
    e.course_id,
    c.slug  as course_slug,
    c.title as course_title,
    e.user_id,
    p.full_name,
    p.username,
    p.avatar_url,
    e.enrolled_at,
    e.progress_pct,
    e.completed_at,
    e.last_activity_at,
    (select count(*) from public.lesson_progress lp
       where lp.user_id = e.user_id and lp.course_id = e.course_id and lp.status = 'completed') as lessons_completed,
    (select count(*) from public.lessons l
       where l.course_id = e.course_id and l.is_published) as lessons_total,
    (select coalesce(round(avg(best.pct), 1), 0) from (
       select max(t.pct) as pct from public.attempts t
       where t.user_id = e.user_id and t.course_id = e.course_id
       group by t.assessment_id) best) as avg_best_pct,
    (select coalesce(sum(lp.time_spent_seconds), 0) from public.lesson_progress lp
       where lp.user_id = e.user_id and lp.course_id = e.course_id) as time_spent_seconds
  from public.enrollments e
  join public.courses c on c.id = e.course_id
  join public.profiles p on p.id = e.user_id;

-- ---------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------
alter table public.profiles          enable row level security;
alter table public.user_roles        enable row level security;
alter table public.user_stats        enable row level security;
alter table public.courses           enable row level security;
alter table public.modules           enable row level security;
alter table public.lessons           enable row level security;
alter table public.assessments       enable row level security;
alter table public.questions         enable row level security;
alter table public.question_keys     enable row level security;
alter table public.enrollments       enable row level security;
alter table public.lesson_progress   enable row level security;
alter table public.attempts          enable row level security;
alter table public.achievements      enable row level security;
alter table public.user_achievements enable row level security;
alter table public.activity_log      enable row level security;

-- profiles
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_staff());
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- user_roles (admin altera papéis)
drop policy if exists "user_roles_select" on public.user_roles;
create policy "user_roles_select" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.is_staff());
drop policy if exists "user_roles_admin_update" on public.user_roles;
create policy "user_roles_admin_update" on public.user_roles for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- user_stats
drop policy if exists "user_stats_select" on public.user_stats;
create policy "user_stats_select" on public.user_stats for select to authenticated
  using (user_id = auth.uid() or public.is_staff());

-- conteúdo
drop policy if exists "courses_select" on public.courses;
create policy "courses_select" on public.courses for select to authenticated
  using (is_published or public.is_staff());

drop policy if exists "modules_select" on public.modules;
create policy "modules_select" on public.modules for select to authenticated
  using (exists (select 1 from public.courses c where c.id = course_id and (c.is_published or public.is_staff())));

drop policy if exists "lessons_select" on public.lessons;
create policy "lessons_select" on public.lessons for select to authenticated
  using (
    public.is_staff()
    or (is_published
        and exists (select 1 from public.courses c where c.id = course_id and c.is_published)
        and public.is_enrolled(course_id))
  );

drop policy if exists "assessments_select" on public.assessments;
create policy "assessments_select" on public.assessments for select to authenticated
  using (
    public.is_staff()
    or exists (select 1 from public.courses c where c.id = course_id and c.is_published)
  );

drop policy if exists "questions_select" on public.questions;
create policy "questions_select" on public.questions for select to authenticated
  using (
    public.is_staff()
    or exists (select 1 from public.assessments a where a.id = assessment_id and public.is_enrolled(a.course_id))
  );

-- question_keys: sem policies (negado para anon/authenticated)

-- matrículas
drop policy if exists "enrollments_select" on public.enrollments;
create policy "enrollments_select" on public.enrollments for select to authenticated
  using (user_id = auth.uid() or public.is_staff());
drop policy if exists "enrollments_delete_own" on public.enrollments;
create policy "enrollments_delete_own" on public.enrollments for delete to authenticated
  using (user_id = auth.uid());

-- progresso e tentativas: só leitura (escrita via RPC)
drop policy if exists "lesson_progress_select" on public.lesson_progress;
create policy "lesson_progress_select" on public.lesson_progress for select to authenticated
  using (user_id = auth.uid() or public.is_staff());

drop policy if exists "attempts_select" on public.attempts;
create policy "attempts_select" on public.attempts for select to authenticated
  using (user_id = auth.uid() or public.is_staff());

-- gamificação
drop policy if exists "achievements_select" on public.achievements;
create policy "achievements_select" on public.achievements for select to authenticated using (true);

drop policy if exists "user_achievements_select" on public.user_achievements;
create policy "user_achievements_select" on public.user_achievements for select to authenticated
  using (user_id = auth.uid() or public.is_staff());

drop policy if exists "activity_log_select" on public.activity_log;
create policy "activity_log_select" on public.activity_log for select to authenticated
  using (user_id = auth.uid() or public.is_staff());

-- ---------------------------------------------------------------------
-- Permissões de execução
--   RPCs públicas: apenas usuários autenticados.
--   Funções internas: ninguém via API (só outras funções definer).
-- ---------------------------------------------------------------------
revoke all on function public.track_lesson_progress(uuid, integer, integer, integer, boolean) from public, anon;
revoke all on function public.submit_attempt(uuid, jsonb, timestamptz) from public, anon;
revoke all on function public.enroll(uuid) from public, anon;
grant execute on function public.track_lesson_progress(uuid, integer, integer, integer, boolean) to authenticated;
grant execute on function public.submit_attempt(uuid, jsonb, timestamptz) to authenticated;
grant execute on function public.enroll(uuid) to authenticated;

revoke all on function public.add_xp(uuid, integer, text, uuid, jsonb) from public, anon, authenticated;
revoke all on function public.touch_streak(uuid) from public, anon, authenticated;
revoke all on function public.award_achievements(uuid) from public, anon, authenticated;
revoke all on function public.recompute_enrollment(uuid, uuid) from public, anon, authenticated;
revoke all on function public.grade_answer(public.question_type, jsonb, jsonb) from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;

grant select on public.v_course_syllabus to authenticated;
grant select on public.v_student_progress to authenticated;

-- ---------------------------------------------------------------------
-- Storage: imagens do conteúdo (escrita só pela service role) e avatares
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('course-assets', 'course-assets', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "public_read_assets" on storage.objects;
create policy "public_read_assets" on storage.objects for select to public
  using (bucket_id in ('course-assets', 'avatars'));

drop policy if exists "avatars_insert_own" on storage.objects;
create policy "avatars_insert_own" on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "avatars_update_own" on storage.objects;
create policy "avatars_update_own" on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "avatars_delete_own" on storage.objects;
create policy "avatars_delete_own" on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
