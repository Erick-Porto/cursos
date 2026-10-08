# Instruções para agentes

- **Conteúdo de cursos (slides, quizzes, provas)**: siga `GUIA_DE_CONTEUDO.md` à risca e use
  `content/courses/fundamentos-sql` como referência. Valide com `npm run content:check` antes de concluir.
- **Nunca use emojis** na interface nem no conteúdo. Ícones vêm do lucide (`src/lib/icons.ts`).
- **Banco**: toda mudança de esquema é uma nova migration em `supabase/migrations/NNNN_nome.sql`.
  Rode `npm run db:check` (Postgres em memória) e amplie o teste em `scripts/check-migrations.mjs`.
- **Escritas sensíveis** (progresso, tentativas, XP, conquistas) só por funções `security definer`.
  O cliente nunca grava nessas tabelas; o gabarito (`question_keys`) nunca é lido pelo cliente.
- **Front**: Vue 3 `<script setup lang="ts">`, estilos scoped usando só os tokens de `src/styles/tokens.css`.
  Mobile-first; verifique também em desktop (sidebar) e nos dois temas.
- Antes de encerrar: `npm run typecheck && npm run build`.
