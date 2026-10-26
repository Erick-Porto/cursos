-- =====================================================================
-- Roteiros de aula do instrutor: um documento em Markdown por encontro
-- presencial, com o passo a passo dos blocos, demonstrações, laboratório
-- e fechamento. Preenchido pelo content:sync a partir de
-- content/courses/<curso>/roteiros/NN-slug.md.
--
-- Só instrutores e administradores leem (RLS). Não há policy de escrita:
-- apenas a service role grava.
-- =====================================================================

create table if not exists public.class_scripts (
  id               uuid primary key default gen_random_uuid(),
  course_id        uuid not null references public.courses(id) on delete cascade,
  module_id        uuid references public.modules(id) on delete set null,
  slug             text not null,
  title            text not null,
  summary          text,
  duration_minutes integer,
  position         integer not null default 0,
  lesson_slugs     text[] not null default '{}',
  content_md       text not null default '',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (course_id, slug)
);
create index if not exists class_scripts_course_position_idx on public.class_scripts (course_id, position);

drop trigger if exists set_updated_at on public.class_scripts;
create trigger set_updated_at before update on public.class_scripts
  for each row execute function public.set_updated_at();

alter table public.class_scripts enable row level security;

drop policy if exists "class_scripts_select_staff" on public.class_scripts;
create policy "class_scripts_select_staff" on public.class_scripts for select to authenticated
  using (public.is_staff());
