# Cursos

Plataforma de cursos 100% estática (GitHub Pages) com banco de dados e autenticação no
Supabase. Aulas em slides, avaliações corrigidas no servidor, progresso por aula, XP, níveis
e conquistas.

| Camada | Tecnologia |
|---|---|
| Front-end | Vue 3 + TypeScript + Vite, Pinia, Vue Router (hash), lucide (ícones), markdown-it + highlight.js, jsPDF |
| Back-end | Supabase: Auth, Postgres com RLS, funções SQL (`security definer`), Storage |
| Conteúdo | Markdown e JSON versionados em `content/`, sincronizados por script |
| Deploy | GitHub Actions → GitHub Pages |

## Funcionalidades

- **Conta e perfil**: cadastro por e-mail e senha (Google opcional), recuperação de senha, foto, nome de usuário, biografia.
- **Catálogo e curso**: módulos, aulas, avaliações, conquistas específicas, progresso em %.
- **Player de aulas**: slides em Markdown com blocos de destaque, colunas, código com realce e botão copiar, sumário, teclado, gestos no celular, tela cheia, retomada de onde parou, tempo de estudo.
- **Avaliações**: escolha única, múltipla, verdadeiro/falso e lacunas. Embaralhamento, limite de tentativas, cronômetro, correção **no servidor** (o gabarito nunca chega ao navegador), revisão com explicações, PDF com código de verificação.
- **Gamificação**: XP por aula, quiz, prova e curso; níveis; sequência de dias; conquistas globais e por curso, com regras declarativas.
- **Instrutor**: painel com progresso de todos os alunos, notas e tempo, exportação CSV.
- **Tema claro e escuro**, layout mobile-first com navegação inferior e sidebar no desktop.

## Estrutura

```
.github/workflows/deploy.yml   CI (typecheck, migrations, conteúdo, build) + deploy no Pages
content/courses/<slug>/        conteúdo dos cursos (ver GUIA_DE_CONTEUDO.md)
scripts/content.mjs            valida e sincroniza o conteúdo com o Supabase
scripts/check-migrations.mjs   roda as migrations num Postgres em memória e testa as funções
supabase/migrations/           esquema, RLS, funções e conquistas iniciais
src/
  lib/        supabase, api (consultas), markdown (slides), pdf, xp, icons, format
  stores/     auth, catalog, achievements, toast, theme
  views/      telas (auth, início, catálogo, curso, aula, avaliação, conquistas, perfil, instrutor)
  components/ layout, ui, course, player, assessment, achievements
  styles/     tokens (tema) e base (globais + conteúdo renderizado)
```

## Configuração passo a passo

### 1. Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. **SQL Editor** → cole e execute, nesta ordem, `supabase/migrations/0001_schema.sql` e `0002_seed_achievements.sql`.
   (Ou, com a CLI: `supabase link` e `supabase db push`.)
3. **Authentication → URL Configuration**:
   - *Site URL*: `https://<usuario>.github.io/<repo>/`
   - *Redirect URLs*: `https://<usuario>.github.io/<repo>/**` e `http://localhost:5173/**`
4. **Authentication → Providers → Email**: deixe "Confirm email" ligado (recomendado). Para Google, configure o provider e defina `VITE_ENABLE_GOOGLE_LOGIN=true`.
5. **Project Settings → API**: copie a *URL*, a *anon key* e a *service_role key*.

### 2. Local

```bash
cp .env.example .env     # preencha URL, anon key e service_role key
npm install
npm run db:check         # valida as migrations num Postgres em memória
npm run content:check    # valida o conteúdo em content/
npm run content:sync     # publica o conteúdo no Supabase
npm run dev              # http://localhost:5173
```

Crie sua conta pelo app e depois torne-se instrutor no SQL Editor:

```sql
update public.user_roles set role = 'instructor'
where user_id = (select id from auth.users where email = 'seu@email.com');
```

Papéis: `student` (padrão), `instructor` (painel e leitura de todo o progresso), `admin` (idem + pode alterar papéis).

### 3. GitHub Pages

1. Crie o repositório no GitHub e envie o código (`git remote add origin ... && git push -u origin main`).
2. **Settings → Pages → Source**: *GitHub Actions*.
3. **Settings → Secrets and variables → Actions**:
   - Variables: `VITE_SUPABASE_URL`, opcionalmente `VITE_ENABLE_GOOGLE_LOGIN`, e `VITE_BASE` só se usar domínio próprio (`/`).
   - Secrets: `VITE_SUPABASE_ANON_KEY`.
4. Cada push na `main` roda os checks e publica em `https://<usuario>.github.io/<repo>/`.

O workflow também roda em pull requests (sem deploy).

## Fluxo de conteúdo

O conteúdo é versionado no repositório e enviado ao banco pelo script, o que permite revisão
em PR e histórico no git. O formato completo está em **[GUIA_DE_CONTEUDO.md](GUIA_DE_CONTEUDO.md)**,
e `content/courses/fundamentos-sql` é um curso de exemplo que usa todos os recursos.

```bash
npm run content:check          # erros bloqueiam; avisos orientam
npm run content:sync           # upsert (nunca apaga)
npm run content:sync:prune     # apaga do banco o que saiu do repositório
node --env-file=.env scripts/content.mjs sync --course=fundamentos-sql
```

As imagens de `content/courses/<slug>/images/` sobem para o bucket público `course-assets`.
Mudanças de conteúdo não exigem novo deploy do site.

## Segurança

- O cliente só tem a *anon key*. Tudo é filtrado por RLS: cada aluno lê o próprio progresso, as próprias tentativas e as aulas dos cursos em que está matriculado.
- Progresso, notas, XP e conquistas são gravados **apenas** por funções `security definer` (`track_lesson_progress`, `submit_attempt`, `enroll`). O cliente não consegue inserir ou alterar essas tabelas diretamente.
- O gabarito fica em `question_keys`, sem nenhuma policy: só as funções e a *service role* leem.
- A *service role key* fica só no `.env` local (ignorado pelo git) e é usada apenas pelo script de sincronização.
- Se o repositório for público, os JSON das avaliações (com gabarito) ficam visíveis no GitHub. Para provas sensíveis, mantenha o repositório privado.

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | build de produção em `dist/` |
| `npm run typecheck` | verificação de tipos (vue-tsc) |
| `npm run db:check` | aplica as migrations num Postgres em memória (PGlite) e roda um teste funcional |
| `npm run content:check` | valida `content/` |
| `npm run content:sync` | envia `content/` ao Supabase |

## Próximos passos sugeridos

- Importar o curso antigo (`curso_dba_senai`) com um script que converta os slides HTML em Markdown e os `ask.js` em JSON de avaliação.
- Questões dissertativas com correção manual pelo instrutor.
- Certificado em PDF ao concluir o curso.
- Ranking opcional por curso (os dados já existem em `user_stats`).
