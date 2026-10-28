<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ArrowLeft, ArrowRight, BookOpenCheck, CircleCheck, ExternalLink, History, ListChecks, MessageSquare, Undo2 } from 'lucide-vue-next'
import {
  fetchCourseBySlug, fetchProjectGuide, fetchProjectsForStaff, fetchStudentProgress, fetchSubmissionForStaff, fetchSubmissionsForStaff,
  gradeProject,
} from '@/lib/api'
import { courseMaterialBase, renderInline, renderMarkdown } from '@/lib/markdown'
import { courseAssetBase, friendlyError } from '@/lib/supabase'
import { formatDateTime, formatPct } from '@/lib/format'
import { PROJECT_STATE_BADGE, PROJECT_STATE_LABEL, projectState, rubricTotal } from '@/lib/projects'
import { useToastStore } from '@/stores/toast'
import type { Course, Project, ProjectSubmission, StudentProgressRow } from '@/types/db'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import UserAvatar from '@/components/ui/UserAvatar.vue'

const route = useRoute()
const toast = useToastStore()

const courseSlug = computed(() => String(route.params.course))
const projectSlug = computed(() => String(route.params.project))
const studentId = computed(() => String(route.params.student))

const course = ref<Course | null>(null)
const project = ref<Project | null>(null)
const submission = ref<ProjectSubmission | null>(null)
const student = ref<StudentProgressRow | null>(null)
const guide = ref<string | null>(null)
const nextPending = ref<string | null>(null)
const loading = ref(true)
const error = ref('')

const scores = ref<Record<string, number | null>>({})
const feedback = ref('')
const saving = ref(false)
const formError = ref('')

const state = computed(() => projectState(submission.value))
const max = computed(() => (project.value ? rubricTotal(project.value) : 0))
const total = computed(() => Object.values(scores.value).reduce<number>((s, v) => s + (Number.isFinite(v) ? Number(v) : 0), 0))
const pct = computed(() => (max.value ? Math.round((1000 * total.value) / max.value) / 10 : 0))
const complete = computed(() => !!project.value && project.value.rubric.every((c) => isValidScore(scores.value[c.key], c.points)))
const willPass = computed(() => !!project.value && pct.value >= Number(project.value.passing_score))
const guideHtml = computed(() =>
  guide.value && course.value
    ? renderMarkdown(guide.value, { assetBase: courseAssetBase(course.value.slug), materialBase: courseMaterialBase(course.value.slug) })
    : '',
)
const history = computed(() => [...(submission.value?.history ?? [])].reverse())
const backTo = computed(() => ({
  path: '/instrutor',
  query: { aba: 'projetos', curso: course.value?.id ?? '', projeto: project.value?.id ?? '' },
}))

function isValidScore(v: number | null | undefined, points: number): boolean {
  return typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= Number(points)
}

/** Atalhos de pontuação: fração do máximo do critério, arredondada para meio ponto. */
function quick(points: number, fraction: number): number {
  return Math.round(Number(points) * fraction * 2) / 2
}

function fillForm() {
  const sub = submission.value
  const next: Record<string, number | null> = {}
  for (const c of project.value?.rubric ?? []) {
    const v = sub?.scores?.[c.key]
    next[c.key] = typeof v === 'number' ? v : null
  }
  scores.value = next
  feedback.value = sub?.feedback ?? ''
}

async function findNextPending() {
  if (!course.value || !project.value) return
  const subs = await fetchSubmissionsForStaff(course.value.id)
  const next = subs
    .filter((s) => s.project_id === project.value!.id && s.status === 'submitted' && s.user_id !== studentId.value)
    .sort((a, b) => a.submitted_at.localeCompare(b.submitted_at))[0]
  nextPending.value = next?.user_id ?? null
}

async function load() {
  loading.value = true
  error.value = ''
  nextPending.value = null
  try {
    const c = await fetchCourseBySlug(courseSlug.value)
    if (!c) {
      error.value = 'Curso não encontrado.'
      return
    }
    course.value = c
    const projects = await fetchProjectsForStaff(c.id)
    const p = projects.find((x) => x.slug === projectSlug.value) ?? null
    if (!p) {
      error.value = 'Projeto não encontrado.'
      return
    }
    project.value = p
    const [sub, g, students] = await Promise.all([
      fetchSubmissionForStaff(p.id, studentId.value),
      fetchProjectGuide(p.id),
      fetchStudentProgress(),
    ])
    submission.value = sub
    guide.value = g
    student.value = students.find((s) => s.user_id === studentId.value && s.course_id === c.id) ?? null
    if (!sub) error.value = 'Este aluno ainda não entregou o projeto.'
    fillForm()
    await findNextPending()
  } catch (e) {
    error.value = friendlyError(e)
  } finally {
    loading.value = false
  }
}

async function save(final: boolean) {
  if (!submission.value || !project.value) return
  formError.value = ''
  if (!complete.value) {
    formError.value = 'Dê uma nota a todos os critérios, de 0 ao máximo de cada um.'
    return
  }
  if (!final && !feedback.value.trim()) {
    formError.value = 'Para devolver, escreva no comentário o que o aluno precisa ajustar.'
    return
  }
  saving.value = true
  try {
    const r = await gradeProject({
      submissionId: submission.value.id,
      scores: Object.fromEntries(Object.entries(scores.value).map(([k, v]) => [k, Number(v)])),
      feedback: feedback.value.trim(),
      final,
    })
    submission.value = r.submission
    fillForm()
    toast.success(final ? 'Nota final lançada' : 'Devolvido para ajustes', final ? `${formatPct(r.submission.pct, 1)} para o aluno.` : 'O aluno vê o comentário e pode reenviar.')
    await findNextPending()
  } catch (e) {
    formError.value = friendlyError(e)
  } finally {
    saving.value = false
  }
}

watch([courseSlug, projectSlug, studentId], load)
onMounted(load)
</script>

<template>
  <div class="container page">
    <div class="row between wrap" style="margin-bottom: 12px">
      <RouterLink :to="backTo" class="btn btn--ghost btn--sm"><ArrowLeft /> Projetos</RouterLink>
      <RouterLink
        v-if="nextPending && course && project"
        :to="`/instrutor/projetos/${course.slug}/${project.slug}/${nextPending}`"
        class="btn btn--outline btn--sm"
      >
        Próxima entrega aguardando <ArrowRight />
      </RouterLink>
    </div>

    <LoadingBlock v-if="loading" text="Carregando entrega" />

    <div v-else-if="error || !submission || !project" class="card">
      <EmptyState :icon="ListChecks" title="Nada para corrigir aqui" :text="error || 'Entrega não encontrada.'">
        <RouterLink :to="backTo" class="btn btn--primary">Voltar aos projetos</RouterLink>
      </EmptyState>
    </div>

    <template v-else>
      <section class="card head">
        <div class="row" style="gap: 12px">
          <UserAvatar :name="student?.full_name ?? 'Aluno'" :src="student?.avatar_url ?? null" :size="44" />
          <div class="grow" style="min-width: 0">
            <span class="head__eyebrow">{{ project.title }}</span>
            <h1 class="head__title">{{ student?.full_name ?? 'Aluno' }}</h1>
            <div class="row wrap" style="gap: 6px">
              <span class="badge" :class="PROJECT_STATE_BADGE[state]">{{ PROJECT_STATE_LABEL[state] }}</span>
              <span class="badge">versão {{ submission.version }}</span>
              <span class="hint">enviado em {{ formatDateTime(submission.submitted_at) }}</span>
            </div>
          </div>
        </div>
        <div class="links">
          <a :href="submission.repo_url" target="_blank" rel="noopener" class="btn btn--outline btn--sm"><ExternalLink /> Repositório</a>
          <a v-if="submission.demo_url" :href="submission.demo_url" target="_blank" rel="noopener" class="btn btn--outline btn--sm"><ExternalLink /> Demonstração</a>
        </div>
        <p class="mono small links__url">{{ submission.repo_url }}</p>
        <div v-if="submission.notes" class="note">
          <MessageSquare />
          <p>{{ submission.notes }}</p>
        </div>
      </section>

      <div class="grade-grid">
        <section class="card rubric-card">
          <h2 class="card__title"><ListChecks /> Rubrica</h2>
          <ol class="crit-list">
            <li v-for="c in project.rubric" :key="c.key" class="crit">
              <div class="row between" style="align-items: flex-start; gap: 10px">
                <div style="min-width: 0">
                  <strong>{{ c.title }}</strong>
                  <p v-if="c.description" class="crit__desc inline-md" v-html="renderInline(c.description)"></p>
                </div>
                <label class="crit__input">
                  <span class="visually-hidden">Nota de {{ c.title }}</span>
                  <input
                    v-model.number="scores[c.key]"
                    class="input mono"
                    type="number"
                    inputmode="decimal"
                    min="0"
                    :max="c.points"
                    step="0.5"
                    :aria-invalid="scores[c.key] !== null && !isValidScore(scores[c.key], c.points)"
                  />
                  <span class="crit__max mono">/ {{ c.points }}</span>
                </label>
              </div>
              <div class="quick" role="group" :aria-label="`Atalhos para ${c.title}`">
                <button v-for="f in [0, 0.5, 0.7, 1]" :key="f" type="button" class="quick__btn" :class="{ 'is-on': scores[c.key] === quick(c.points, f) }" @click="scores[c.key] = quick(c.points, f)">
                  {{ f === 0 ? 'Zero' : f === 1 ? 'Cheia' : `${f * 100}%` }}
                </button>
              </div>
            </li>
          </ol>

          <div class="total" :class="complete ? (willPass ? 'total--pass' : 'total--fail') : ''">
            <span>Total</span>
            <strong class="mono">{{ total }} / {{ max }} · {{ formatPct(pct, 1) }}</strong>
            <span class="hint" style="margin: 0">mínimo {{ formatPct(project.passing_score) }}{{ complete ? (willPass ? ', aprovado' : ', abaixo do mínimo') : '' }}</span>
          </div>

          <div class="field">
            <label for="feedback">Comentário para o aluno</label>
            <textarea id="feedback" v-model="feedback" class="input" rows="5" maxlength="5000" placeholder="O que ficou bom, o que falta e onde olhar"></textarea>
          </div>

          <p v-if="formError" class="error-text" role="alert">{{ formError }}</p>
          <div class="actions">
            <button class="btn btn--outline" type="button" :disabled="saving" @click="save(false)"><Undo2 /> Devolver para ajustes</button>
            <button class="btn btn--primary" type="button" :disabled="saving" @click="save(true)"><CircleCheck /> Lançar nota final</button>
          </div>
          <p class="hint" style="margin: 0">
            Devolver mostra a nota parcial e o comentário, e libera o reenvio. A nota final conta para concluir o curso; você pode corrigir de novo depois.
          </p>
        </section>

        <div class="stack">
          <details v-if="guideHtml" class="card guide" open>
            <summary class="card__title"><BookOpenCheck /> Guia de correção</summary>
            <div class="md" v-html="guideHtml"></div>
          </details>

          <section v-if="history.length" class="card">
            <h2 class="card__title"><History /> Versões anteriores</h2>
            <ul class="history">
              <li v-for="h in history" :key="h.version">
                <div class="row between wrap">
                  <strong>Versão {{ h.version }}</strong>
                  <span v-if="h.pct !== null" class="badge badge--warning">{{ formatPct(h.pct, 1) }}</span>
                </div>
                <span class="hint">{{ formatDateTime(h.submitted_at) }}</span>
                <a :href="h.repo_url" target="_blank" rel="noopener" class="small" style="word-break: break-all">{{ h.repo_url }}</a>
                <p v-if="h.feedback" class="history__feedback">{{ h.feedback }}</p>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.head {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}
.head__eyebrow {
  display: block;
  color: var(--muted);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.head__title {
  margin: 2px 0 6px;
  font-size: 1.4rem;
}
.links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.links__url {
  margin: 0;
  color: var(--text-2);
  word-break: break-all;
}
.note {
  display: flex;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius);
  background: var(--surface-2);
}
.note svg {
  flex: none;
  width: 18px;
  height: 18px;
  color: var(--muted);
  margin-top: 2px;
}
.note p {
  margin: 0;
  white-space: pre-wrap;
}

.grade-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: minmax(0, 1fr);
}
@media (min-width: 1024px) {
  .grade-grid {
    grid-template-columns: minmax(0, 440px) minmax(0, 1fr);
    align-items: start;
  }
  .rubric-card {
    position: sticky;
    top: calc(var(--header-h) + 16px);
  }
}

.card__title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 10px;
  font-size: 1.05rem;
  font-weight: 700;
}
.card__title svg {
  width: 18px;
  height: 18px;
  color: var(--primary);
}

.rubric-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.crit-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.crit {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border);
}
.inline-md :deep(code) {
  padding: 0.05em 0.35em;
  border-radius: 6px;
  background: var(--surface-2);
  font-size: 0.85em;
}
.crit__desc {
  margin: 4px 0 0;
  color: var(--text-2);
  font-size: 0.85rem;
}
.crit__input {
  flex: none;
  display: flex;
  align-items: center;
  gap: 6px;
}
.crit__input .input {
  width: 84px;
  text-align: right;
}
.crit__input .input[aria-invalid='true'] {
  border-color: var(--danger);
}
.crit__max {
  color: var(--muted);
  font-size: 0.85rem;
}
.quick {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.quick__btn {
  min-height: 32px;
  padding: 4px 10px;
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  background: transparent;
  color: var(--text-2);
  font: inherit;
  font-size: 0.8rem;
  cursor: pointer;
}
.quick__btn:hover {
  color: var(--text);
}
.quick__btn.is-on {
  border-color: var(--primary);
  background: var(--primary-soft);
  color: var(--primary);
}

.total {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 6px 12px;
  padding: 12px;
  border-radius: var(--radius);
  background: var(--surface-2);
  border: 1px solid var(--border);
}
.total--pass {
  background: var(--primary-soft);
  border-color: color-mix(in srgb, var(--primary) 45%, var(--border));
}
.total--fail {
  background: var(--danger-soft);
  border-color: color-mix(in srgb, var(--danger) 45%, var(--border));
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.actions .btn {
  flex: 1 1 180px;
}

.guide summary {
  cursor: pointer;
  list-style: none;
}
.guide summary::-webkit-details-marker {
  display: none;
}
.guide[open] summary {
  margin-bottom: 12px;
}

.history {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.history li {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.history__feedback {
  margin: 0;
  white-space: pre-wrap;
  font-size: 0.9rem;
  color: var(--text-2);
}
</style>
