<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  ArrowLeft, CalendarClock, Circle, CircleCheck, ExternalLink, History, ListChecks, Lock, Milestone, Send, Target,
} from 'lucide-vue-next'
import { useCatalogStore } from '@/stores/catalog'
import { useToastStore } from '@/stores/toast'
import { fetchCourseBySlug, fetchCourseProgress, fetchCourseStructure, fetchMySubmission, fetchProject, submitProject } from '@/lib/api'
import { courseMaterialBase, renderInline, renderMarkdown } from '@/lib/markdown'
import { courseAssetBase, friendlyError } from '@/lib/supabase'
import { formatDateTime, formatPct } from '@/lib/format'
import { PROJECT_STATE_BADGE, PROJECT_STATE_LABEL, projectState, rubricTotal } from '@/lib/projects'
import type { Course, LessonProgress, LessonSummary, Project, ProjectSubmission } from '@/types/db'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const route = useRoute()
const catalog = useCatalogStore()
const toast = useToastStore()

const courseSlug = computed(() => String(route.params.course))
const projectSlug = computed(() => String(route.params.project))

const course = ref<Course | null>(null)
const project = ref<Project | null>(null)
const lessons = ref<LessonSummary[]>([])
const progress = ref<LessonProgress[]>([])
const submission = ref<ProjectSubmission | null>(null)
const loading = ref(true)
const notFound = ref(false)

const repoUrl = ref('')
const demoUrl = ref('')
const notes = ref('')
const sending = ref(false)
const formError = ref('')

const enrollment = computed(() => (course.value ? catalog.enrollmentFor(course.value.id) : undefined))
const state = computed(() => projectState(submission.value))
const total = computed(() => (project.value ? rubricTotal(project.value) : 0))
const canSubmit = computed(() => !!enrollment.value && state.value !== 'passed' && state.value !== 'failed')
const html = computed(() =>
  project.value && course.value
    ? renderMarkdown(project.value.content_md, {
        assetBase: courseAssetBase(course.value.slug),
        materialBase: courseMaterialBase(course.value.slug),
      })
    : '',
)

const lessonBySlug = computed(() => new Map(lessons.value.map((l) => [l.slug, l])))
const doneLessons = computed(() => new Set(progress.value.filter((p) => p.status === 'completed').map((p) => p.lesson_id)))
const steps = computed(() =>
  (project.value?.steps ?? []).map((s) => {
    const lesson = lessonBySlug.value.get(s.lesson) ?? null
    return { ...s, lessonTitle: lesson?.title ?? s.lesson, done: !!lesson && doneLessons.value.has(lesson.id) }
  }),
)
const dueLesson = computed(() => (project.value?.due_lesson ? (lessonBySlug.value.get(project.value.due_lesson) ?? null) : null))
const history = computed(() => [...(submission.value?.history ?? [])].reverse())

const submitLabel = computed(() => {
  if (state.value === 'submitted') return 'Atualizar entrega'
  if (state.value === 'returned') return 'Reenviar'
  return 'Enviar entrega'
})

function fillForm(s: ProjectSubmission | null) {
  repoUrl.value = s?.repo_url ?? ''
  demoUrl.value = s?.demo_url ?? ''
  notes.value = s?.status === 'submitted' ? (s.notes ?? '') : ''
}

async function load() {
  loading.value = true
  notFound.value = false
  try {
    await catalog.load()
    const c = catalog.courseBySlug(courseSlug.value) ?? (await fetchCourseBySlug(courseSlug.value))
    if (!c) {
      notFound.value = true
      return
    }
    course.value = c
    const [p, structure] = await Promise.all([fetchProject(c.id, projectSlug.value), fetchCourseStructure(c.id)])
    if (!p) {
      notFound.value = true
      return
    }
    project.value = p
    lessons.value = structure.lessons
    document.title = `${p.title} · Cursos`
    if (catalog.enrollmentFor(c.id)) {
      const [sub, prog] = await Promise.all([fetchMySubmission(p.id), fetchCourseProgress(c.id)])
      submission.value = sub
      progress.value = prog.progress
      fillForm(sub)
    }
  } catch (e) {
    toast.error('Erro ao carregar o projeto', friendlyError(e))
  } finally {
    loading.value = false
  }
}

async function send() {
  if (!project.value) return
  formError.value = ''
  const repo = repoUrl.value.trim()
  const demo = demoUrl.value.trim()
  if (!/^https:\/\/\S+\.\S+/i.test(repo)) {
    formError.value = 'Cole o endereço completo do repositório, começando com https://'
    return
  }
  if (demo && !/^https:\/\/\S+\.\S+/i.test(demo)) {
    formError.value = 'O link de demonstração também precisa começar com https://'
    return
  }
  sending.value = true
  try {
    const r = await submitProject({ projectId: project.value.id, repoUrl: repo, demoUrl: demo, notes: notes.value.trim() })
    submission.value = r.submission
    fillForm(r.submission)
    toast.success('Entrega enviada', 'O instrutor vai corrigir pela rubrica. A nota aparece aqui.')
  } catch (e) {
    formError.value = friendlyError(e)
  } finally {
    sending.value = false
  }
}

watch([courseSlug, projectSlug], load)
onMounted(load)
</script>

<template>
  <div class="container page">
    <RouterLink :to="`/cursos/${courseSlug}`" class="btn btn--ghost btn--sm" style="margin-bottom: 12px"><ArrowLeft /> Voltar ao curso</RouterLink>

    <LoadingBlock v-if="loading" text="Carregando projeto" />

    <div v-else-if="notFound || !project || !course" class="card">
      <EmptyState :icon="Target" title="Projeto não encontrado" text="Ele pode ter saído do curso ou o endereço está errado.">
        <RouterLink :to="`/cursos/${courseSlug}`" class="btn btn--primary">Ver o curso</RouterLink>
      </EmptyState>
    </div>

    <template v-else>
      <section class="hero card">
        <span v-if="project.section" class="hero__eyebrow">{{ project.section }}</span>
        <h1 class="hero__title">{{ project.title }}</h1>
        <p v-if="project.summary" class="hero__sub inline-md" v-html="renderInline(project.summary)"></p>
        <div class="row wrap" style="gap: 6px">
          <span v-if="enrollment" class="badge" :class="PROJECT_STATE_BADGE[state]">{{ PROJECT_STATE_LABEL[state] }}</span>
          <span v-if="project.due_label" class="badge"><CalendarClock /> Entrega até o {{ project.due_label }}</span>
          <span class="badge"><Milestone /> {{ project.steps.length }} etapas</span>
          <span class="badge"><ListChecks /> mínimo {{ formatPct(project.passing_score) }}</span>
        </div>
        <a v-if="enrollment" href="#entrega" class="btn btn--primary hero__cta">
          <Send /> {{ state === 'passed' || state === 'failed' ? 'Ver a correção' : state === 'pending' ? 'Entregar' : 'Ver a entrega' }}
        </a>
      </section>

      <div class="proj-grid">
        <main class="stack">
          <section class="card">
            <h2 class="card__title"><Milestone /> Etapas</h2>
            <p class="hint" style="margin: 0 0 10px">Uma etapa por encontro, apresentada no slide do projeto da aula. Faça um commit por etapa.</p>
            <ol class="steps-list">
              <li v-for="(s, i) in steps" :key="i" class="step" :class="{ 'is-done': s.done }">
                <span class="step__mark"><CircleCheck v-if="s.done" /><Circle v-else /></span>
                <div class="step__body">
                  <div class="step__head">
                    <span v-if="s.when" class="step__when mono">{{ s.when }}</span>
                    <strong>{{ s.title }}</strong>
                  </div>
                  <p v-if="s.summary" class="step__summary inline-md" v-html="renderInline(s.summary)"></p>
                  <RouterLink v-if="enrollment" :to="`/cursos/${course.slug}/aulas/${s.lesson}`" class="step__lesson">{{ s.lessonTitle }}</RouterLink>
                  <span v-else class="step__lesson muted">{{ s.lessonTitle }}</span>
                </div>
              </li>
            </ol>
          </section>

          <section class="card md" v-html="html"></section>
        </main>

        <aside class="stack aside">
          <section id="entrega" class="card">
            <h2 class="card__title"><Send /> Sua entrega</h2>

            <div v-if="!enrollment" class="empty-note">
              <Lock />
              <p>Matricule-se no curso para entregar o projeto.</p>
              <RouterLink :to="`/cursos/${course.slug}`" class="btn btn--outline btn--sm">Ir para o curso</RouterLink>
            </div>

            <template v-else>
              <div v-if="submission" class="sub">
                <div class="row between wrap">
                  <span class="badge" :class="PROJECT_STATE_BADGE[state]">{{ PROJECT_STATE_LABEL[state] }}</span>
                  <span class="hint">versão {{ submission.version }} · {{ formatDateTime(submission.submitted_at) }}</span>
                </div>
                <a :href="submission.repo_url" target="_blank" rel="noopener" class="sub__link"><ExternalLink /> {{ submission.repo_url }}</a>
                <a v-if="submission.demo_url" :href="submission.demo_url" target="_blank" rel="noopener" class="sub__link"><ExternalLink /> {{ submission.demo_url }}</a>

                <div v-if="submission.pct !== null" class="grade" :class="`grade--${state}`">
                  <div class="row between">
                    <span>{{ state === 'returned' ? 'Nota parcial' : 'Nota final' }}</span>
                    <strong class="grade__value">{{ formatPct(submission.pct, 1) }}</strong>
                  </div>
                  <p v-if="submission.feedback" class="grade__feedback">{{ submission.feedback }}</p>
                  <p class="hint" style="margin: 0">Corrigido em {{ formatDateTime(submission.graded_at) }}</p>
                </div>

                <p v-if="state === 'submitted'" class="hint" style="margin: 0">
                  Enquanto o instrutor não corrige, você pode trocar o link e reenviar.
                </p>
                <p v-else-if="state === 'returned'" class="hint" style="margin: 0">
                  Ajuste o que o comentário pede, faça o commit e reenvie: vira a versão {{ submission.version + 1 }}.
                </p>
                <p v-else class="hint" style="margin: 0">Nota final lançada. Para reenviar, fale com o instrutor.</p>
              </div>
              <p v-else class="hint" style="margin: 0 0 12px">
                Entregue o link do repositório no GitHub{{ project.due_label ? ` até o ${project.due_label}` : '' }}{{ dueLesson ? ` (aula ${dueLesson.title})` : '' }}.
              </p>

              <form v-if="canSubmit" class="form" @submit.prevent="send">
                <div class="field">
                  <label for="repo">Repositório no GitHub</label>
                  <input id="repo" v-model="repoUrl" class="input" type="url" inputmode="url" autocomplete="url" placeholder="https://github.com/seu-usuario/projeto" required />
                </div>
                <div class="field">
                  <label for="demo">Link de demonstração <span class="muted">(opcional)</span></label>
                  <input id="demo" v-model="demoUrl" class="input" type="url" inputmode="url" placeholder="https://..." />
                </div>
                <div class="field">
                  <label for="notes">Comentário para o instrutor <span class="muted">(opcional)</span></label>
                  <textarea id="notes" v-model="notes" class="input" maxlength="2000" rows="3" placeholder="O que ficou pronto, o que faltou, onde teve dúvida"></textarea>
                </div>
                <p v-if="formError" class="error-text" role="alert">{{ formError }}</p>
                <button class="btn btn--primary btn--block" type="submit" :disabled="sending"><Send /> {{ sending ? 'Enviando…' : submitLabel }}</button>
              </form>
            </template>
          </section>

          <section class="card">
            <h2 class="card__title"><ListChecks /> Rubrica</h2>
            <p class="hint" style="margin: 0 0 10px">{{ total }} pontos; aprovação a partir de {{ formatPct(project.passing_score) }}.</p>
            <ul class="rubric">
              <li v-for="c in project.rubric" :key="c.key" class="rubric__item">
                <div class="row between" style="align-items: flex-start">
                  <strong>{{ c.title }}</strong>
                  <span class="rubric__pts mono">
                    <template v-if="submission?.scores && submission.scores[c.key] !== undefined">{{ submission.scores[c.key] }}/</template>{{ c.points }}
                  </span>
                </div>
                <p v-if="c.description" class="rubric__desc inline-md" v-html="renderInline(c.description)"></p>
              </li>
            </ul>
          </section>

          <section v-if="history.length" class="card">
            <h2 class="card__title"><History /> Versões anteriores</h2>
            <ul class="history">
              <li v-for="h in history" :key="h.version">
                <div class="row between wrap">
                  <strong>Versão {{ h.version }}</strong>
                  <span v-if="h.pct !== null" class="badge badge--warning">{{ formatPct(h.pct, 1) }}</span>
                </div>
                <span class="hint">{{ formatDateTime(h.submitted_at) }}</span>
                <a :href="h.repo_url" target="_blank" rel="noopener" class="sub__link"><ExternalLink /> {{ h.repo_url }}</a>
                <p v-if="h.feedback" class="grade__feedback">{{ h.feedback }}</p>
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </template>
  </div>
</template>

<style scoped>
.hero {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  background:
    radial-gradient(70% 140% at 0% 0%, var(--accent-soft), transparent 60%),
    var(--surface);
}
.hero__eyebrow {
  color: var(--muted);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.hero__title {
  margin: 0;
}
.hero__sub {
  margin: 0;
  color: var(--text-2);
  font-size: 1.02rem;
  max-width: 70ch;
}
.hero__cta {
  align-self: flex-start;
  margin-top: 6px;
}
.inline-md :deep(code) {
  padding: 0.05em 0.35em;
  border-radius: 6px;
  background: var(--surface-2);
  font-size: 0.85em;
}
.badge svg {
  width: 13px;
  height: 13px;
}

.proj-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: minmax(0, 1fr);
}
@media (min-width: 1024px) {
  .proj-grid {
    grid-template-columns: minmax(0, 1fr) 360px;
    align-items: start;
  }
  .aside {
    position: sticky;
    top: calc(var(--header-h) + 16px);
  }
}

.card__title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 8px;
  font-size: 1.05rem;
}
.card__title svg {
  width: 18px;
  height: 18px;
  color: var(--primary);
}

.steps-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}
.step {
  display: flex;
  gap: 12px;
  padding: 10px 0;
  border-top: 1px solid var(--border);
}
.step:first-child {
  border-top: 0;
}
.step__mark {
  flex: none;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--muted);
  background: var(--surface-2);
}
.step__mark svg {
  width: 16px;
  height: 16px;
}
.step.is-done .step__mark {
  color: var(--primary);
  background: var(--primary-soft);
}
.step__body {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.step__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
}
.step__when {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--accent);
}
.step__summary {
  margin: 0;
  color: var(--text-2);
  font-size: 0.9rem;
}
.step__lesson {
  font-size: 0.8rem;
}

.empty-note {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  color: var(--text-2);
}
.empty-note p {
  margin: 0;
}
.empty-note svg {
  width: 20px;
  height: 20px;
  color: var(--muted);
}

.sub {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 14px;
}
.sub__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  word-break: break-all;
}
.sub__link svg {
  flex: none;
  width: 14px;
  height: 14px;
}

.grade {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--surface-2);
}
.grade--passed {
  border-color: color-mix(in srgb, var(--primary) 45%, var(--border));
  background: var(--primary-soft);
}
.grade--failed {
  border-color: color-mix(in srgb, var(--danger) 45%, var(--border));
  background: var(--danger-soft);
}
.grade--returned {
  border-color: color-mix(in srgb, var(--warning) 45%, var(--border));
  background: var(--warning-soft);
}
.grade__value {
  font-size: 1.25rem;
}
.grade__feedback {
  margin: 0;
  white-space: pre-wrap;
  font-size: 0.92rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rubric,
.history {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.rubric__pts {
  flex: none;
  font-weight: 700;
  color: var(--primary);
}
.rubric__desc {
  margin: 4px 0 0;
  color: var(--text-2);
  font-size: 0.875rem;
}
.history li {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 10px;
  border-top: 1px solid var(--border);
}
.history li:first-child {
  padding-top: 0;
  border-top: 0;
}
</style>
