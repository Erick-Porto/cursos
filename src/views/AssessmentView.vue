<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  ArrowLeft, ArrowRight, Award, ChevronLeft, ChevronRight, CircleCheck, CircleX, Clock, Download, FileText, Lock, Play, RefreshCw, Send, Timer,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useCatalogStore } from '@/stores/catalog'
import { useAchievementsStore } from '@/stores/achievements'
import { useToastStore } from '@/stores/toast'
import { fetchAssessment, fetchAttempts, fetchCourseStructure, submitAttempt } from '@/lib/api'
import { renderMarkdown } from '@/lib/markdown'
import { friendlyError } from '@/lib/supabase'
import { downloadAttemptPdf } from '@/lib/pdf'
import { formatDateTime, formatPct, shuffle } from '@/lib/format'
import type { AnswerValue, Assessment, Attempt, AttemptDetail, Course, LessonSummary, Question, QuestionOption } from '@/types/db'
import QuestionCard from '@/components/assessment/QuestionCard.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'

type State = 'intro' | 'running' | 'result'

const route = useRoute()
const auth = useAuthStore()
const catalog = useCatalogStore()
const achievements = useAchievementsStore()
const toast = useToastStore()

const courseSlug = computed(() => String(route.params.course))
const assessmentSlug = computed(() => String(route.params.assessment))

const course = ref<Course | null>(null)
const assessment = ref<Assessment | null>(null)
const questions = ref<Question[]>([])
const attempts = ref<Attempt[]>([])
const lesson = ref<LessonSummary | null>(null)
const nextLesson = ref<LessonSummary | null>(null)
const loading = ref(true)
const error = ref('')
const notEnrolled = ref(false)
const enrolling = ref(false)

const state = ref<State>('intro')
const order = ref<Question[]>([])
const optionsByQ = ref<Record<string, QuestionOption[]>>({})
const answers = ref<Record<string, AnswerValue>>({})
const current = ref(0)
const startedAt = ref<string | null>(null)
const remaining = ref<number | null>(null)
const submitting = ref(false)
const result = ref<Attempt | null>(null)
const pdfBusy = ref(false)
let timer: number | undefined

const total = computed(() => order.value.length)
const currentQuestion = computed(() => order.value[current.value])
const bestAttempt = computed(() =>
  attempts.value.reduce<Attempt | null>((best, a) => (!best || Number(a.pct) > Number(best.pct) ? a : best), null),
)
const attemptsLeft = computed(() =>
  assessment.value?.max_attempts == null ? null : Math.max(0, assessment.value.max_attempts - attempts.value.length),
)
const canStart = computed(() => attemptsLeft.value === null || attemptsLeft.value > 0)
const passedBefore = computed(() => attempts.value.some((a) => a.passed))

function isAnswered(q: Question): boolean {
  const v = answers.value[q.id]
  if (v === null || v === undefined) return false
  if (Array.isArray(v)) return q.type === 'fill' ? v.some((s) => String(s).trim().length > 0) : v.length > 0
  if (typeof v === 'string') return v.length > 0
  return true
}
const answeredCount = computed(() => order.value.filter(isAnswered).length)

const clock = computed(() => {
  if (remaining.value === null) return ''
  const m = Math.floor(remaining.value / 60)
  const s = remaining.value % 60
  return `${m}:${String(s).padStart(2, '0')}`
})

function start() {
  if (!assessment.value || !canStart.value) return
  const seed = Date.now() % 2147483647
  order.value = assessment.value.shuffle_questions ? shuffle(questions.value, seed) : [...questions.value]
  optionsByQ.value = Object.fromEntries(
    questions.value.map((q) => [
      q.id,
      assessment.value!.shuffle_options && q.options ? shuffle(q.options, seed + q.position) : (q.options ?? []),
    ]),
  )
  answers.value = {}
  current.value = 0
  startedAt.value = new Date().toISOString()
  result.value = null
  state.value = 'running'
  window.clearInterval(timer)
  if (assessment.value.time_limit_minutes) {
    remaining.value = assessment.value.time_limit_minutes * 60
    timer = window.setInterval(() => {
      if (remaining.value === null) return
      remaining.value -= 1
      if (remaining.value <= 0) {
        window.clearInterval(timer)
        toast.info('Tempo esgotado', 'Suas respostas foram enviadas automaticamente.')
        void submit(true)
      }
    }, 1000)
  } else {
    remaining.value = null
  }
  window.scrollTo({ top: 0 })
}

function setAnswer(qid: string, v: AnswerValue) {
  answers.value = { ...answers.value, [qid]: v }
}

async function submit(auto = false) {
  if (!assessment.value || submitting.value) return
  const missing = total.value - answeredCount.value
  if (!auto && missing > 0 && !window.confirm(`Você deixou ${missing} questão(ões) sem resposta. Enviar mesmo assim?`)) return
  submitting.value = true
  try {
    const res = await submitAttempt(assessment.value.id, answers.value, startedAt.value)
    result.value = res.attempt
    attempts.value = [res.attempt, ...attempts.value]
    toast.celebrate(res)
    achievements.markEarned(res.new_achievements)
    catalog.applyEnrollment(res.enrollment)
    await auth.refreshStats()
    state.value = 'result'
    window.clearInterval(timer)
    remaining.value = null
    window.scrollTo({ top: 0 })
  } catch (e) {
    toast.error('Não foi possível enviar', friendlyError(e))
  } finally {
    submitting.value = false
  }
}

function viewAttempt(a: Attempt) {
  result.value = a
  state.value = 'result'
  window.scrollTo({ top: 0 })
}

const reviewQuestions = computed(() => [...questions.value].sort((a, b) => a.position - b.position))
const detailFor = (q: Question): AttemptDetail | null => result.value?.details.find((d) => d.question_id === q.id) ?? null
const answerFor = (q: Question): AnswerValue => result.value?.answers?.[q.id] ?? null

async function pdf() {
  if (!result.value || !assessment.value || !course.value) return
  pdfBusy.value = true
  try {
    await downloadAttemptPdf({
      attempt: result.value,
      assessment: assessment.value,
      course: course.value,
      lessonTitle: lesson.value?.title,
      profile: auth.profile,
      questions: questions.value,
    })
  } catch (e) {
    toast.error('Falha ao gerar o PDF', friendlyError(e))
  } finally {
    pdfBusy.value = false
  }
}

async function load() {
  loading.value = true
  error.value = ''
  notEnrolled.value = false
  state.value = 'intro'
  try {
    await catalog.load()
    const c = catalog.courseBySlug(courseSlug.value)
    if (!c) {
      error.value = 'Curso não encontrado.'
      return
    }
    course.value = c
    if (!catalog.enrollmentFor(c.id)) {
      notEnrolled.value = true
      return
    }
    const data = await fetchAssessment(c.id, assessmentSlug.value)
    if (!data) {
      error.value = 'Avaliação não encontrada.'
      return
    }
    assessment.value = data.assessment
    questions.value = data.questions
    document.title = `${data.assessment.title} · ${c.title}`
    const [list, structure] = await Promise.all([fetchAttempts(data.assessment.id), fetchCourseStructure(c.id)])
    attempts.value = list
    lesson.value = structure.lessons.find((l) => l.id === data.assessment.lesson_id) ?? null
    const idx = structure.lessons.findIndex((l) => l.id === data.assessment.lesson_id)
    nextLesson.value = idx >= 0 ? (structure.lessons[idx + 1] ?? null) : null

    const wanted = typeof route.query.attempt === 'string' ? route.query.attempt : null
    const found = wanted ? list.find((a) => a.id === wanted) : null
    if (found) viewAttempt(found)
  } catch (e) {
    error.value = friendlyError(e)
  } finally {
    loading.value = false
  }
}

async function enroll() {
  if (!course.value) return
  enrolling.value = true
  try {
    await catalog.enroll(course.value.id)
    await load()
  } catch (e) {
    toast.error('Não foi possível matricular', friendlyError(e))
  } finally {
    enrolling.value = false
  }
}

function beforeUnload(e: BeforeUnloadEvent) {
  if (state.value === 'running') {
    e.preventDefault()
    e.returnValue = ''
  }
}

onMounted(() => {
  window.addEventListener('beforeunload', beforeUnload)
  void load()
})
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', beforeUnload)
  window.clearInterval(timer)
})
watch([courseSlug, assessmentSlug], load)
</script>

<template>
  <div class="assess">
    <header class="assess__bar">
      <RouterLink :to="`/cursos/${courseSlug}`" class="btn btn--ghost btn--icon" aria-label="Voltar ao curso"><ArrowLeft /></RouterLink>
      <div class="assess__titles">
        <div class="assess__course">{{ course?.title }}{{ lesson ? ` · ${lesson.title}` : '' }}</div>
        <div class="assess__name">{{ assessment?.title ?? 'Avaliação' }}</div>
      </div>
      <span v-if="state === 'running' && remaining !== null" class="badge" :class="remaining < 60 ? 'badge--danger' : 'badge--warning'">
        <Timer /> {{ clock }}
      </span>
    </header>

    <div class="assess__body container">
      <LoadingBlock v-if="loading" text="Carregando avaliação" />

      <div v-else-if="notEnrolled" class="card center-msg">
        <Lock />
        <h2>Matricule-se para fazer esta avaliação</h2>
        <button class="btn btn--primary btn--lg" type="button" :disabled="enrolling" @click="enroll">{{ enrolling ? 'Matriculando…' : 'Matricular-se' }}</button>
      </div>

      <div v-else-if="error" class="card center-msg">
        <h2>Ops</h2>
        <p class="muted">{{ error }}</p>
        <RouterLink :to="`/cursos/${courseSlug}`" class="btn btn--outline">Voltar ao curso</RouterLink>
      </div>

      <!-- INTRO -->
      <template v-else-if="assessment && state === 'intro'">
        <section class="card intro">
          <div class="intro__icon"><component :is="assessment.kind === 'exam' ? Award : FileText" /></div>
          <h1 style="font-size: 1.5rem">{{ assessment.title }}</h1>
          <div v-if="assessment.description" class="md text-2" v-html="renderMarkdown(assessment.description)"></div>

          <dl class="facts">
            <div><dt>Questões</dt><dd>{{ questions.length }}</dd></div>
            <div><dt>Nota mínima</dt><dd>{{ formatPct(assessment.passing_score) }}</dd></div>
            <div><dt>Tentativas</dt><dd>{{ attempts.length }}{{ assessment.max_attempts ? ` de ${assessment.max_attempts}` : '' }}</dd></div>
            <div v-if="assessment.time_limit_minutes"><dt>Tempo</dt><dd>{{ assessment.time_limit_minutes }} min</dd></div>
            <div v-if="bestAttempt"><dt>Melhor nota</dt><dd>{{ formatPct(bestAttempt.pct, 1) }}</dd></div>
          </dl>

          <div class="alert alert--info" v-if="!assessment.show_answers"><Lock /> Esta avaliação não revela o gabarito após o envio.</div>

          <div class="row wrap">
            <button v-if="canStart" class="btn btn--primary btn--lg" type="button" :disabled="!questions.length" @click="start">
              <Play /> {{ attempts.length ? 'Nova tentativa' : 'Começar' }}
            </button>
            <span v-else class="badge badge--danger">Limite de tentativas atingido</span>
            <RouterLink v-if="passedBefore && nextLesson" :to="`/cursos/${courseSlug}/aulas/${nextLesson.slug}`" class="btn btn--outline btn--lg">
              Próxima aula <ArrowRight />
            </RouterLink>
          </div>
        </section>

        <section v-if="attempts.length" class="card">
          <h2 style="font-size: 1.05rem">Tentativas anteriores</h2>
          <div class="table-wrap">
            <table class="data-table">
              <thead><tr><th>#</th><th>Nota</th><th>Resultado</th><th>Data</th><th></th></tr></thead>
              <tbody>
                <tr v-for="a in attempts" :key="a.id">
                  <td>{{ a.attempt_number }}ª</td>
                  <td>{{ formatPct(a.pct, 1) }}</td>
                  <td><span class="badge" :class="a.passed ? 'badge--primary' : 'badge--danger'">{{ a.passed ? 'Aprovado' : 'Reprovado' }}</span></td>
                  <td>{{ formatDateTime(a.submitted_at) }}</td>
                  <td><button class="btn btn--ghost btn--sm" type="button" @click="viewAttempt(a)">Ver</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </template>

      <!-- RUNNING -->
      <template v-else-if="assessment && state === 'running' && currentQuestion">
        <div class="run__top">
          <ProgressBar :value="(answeredCount / total) * 100" size="sm" />
          <span class="small muted">{{ answeredCount }} de {{ total }} respondidas</span>
        </div>

        <QuestionCard
          :key="currentQuestion.id"
          :question="currentQuestion"
          :options="optionsByQ[currentQuestion.id] ?? []"
          :model-value="answers[currentQuestion.id] ?? null"
          :number="current + 1"
          :total="total"
          @update:model-value="(v) => setAnswer(currentQuestion!.id, v)"
        />

        <div class="run__nav">
          <button class="btn btn--outline" type="button" :disabled="current === 0" @click="current--"><ChevronLeft /> Anterior</button>
          <div class="run__dots">
            <button
              v-for="(q, i) in order"
              :key="q.id"
              type="button"
              :class="{ 'is-on': i === current, 'is-done': isAnswered(q) }"
              :aria-label="`Questão ${i + 1}`"
              @click="current = i"
            >
              {{ i + 1 }}
            </button>
          </div>
          <button v-if="current < total - 1" class="btn btn--primary" type="button" @click="current++">Próxima <ChevronRight /></button>
          <button v-else class="btn btn--primary" type="button" :disabled="submitting" @click="submit()"><Send /> {{ submitting ? 'Enviando…' : 'Enviar' }}</button>
        </div>
        <p v-if="current === total - 1 && answeredCount < total" class="small muted" style="text-align: center">
          Ainda faltam {{ total - answeredCount }} questão(ões). Use os números acima para voltar.
        </p>
      </template>

      <!-- RESULT -->
      <template v-else-if="assessment && state === 'result' && result">
        <section class="card score" :class="result.passed ? 'score--pass' : 'score--fail'">
          <div class="score__ring">
            <component :is="result.passed ? CircleCheck : CircleX" />
          </div>
          <div class="score__pct">{{ formatPct(result.pct, 1) }}</div>
          <div class="score__label">{{ result.passed ? 'Aprovado' : 'Não aprovado' }} · {{ result.score }} de {{ result.max_score }} pontos</div>
          <div class="hint">Tentativa {{ result.attempt_number }} · {{ formatDateTime(result.submitted_at) }} · nota mínima {{ formatPct(assessment.passing_score) }}</div>
          <div class="row wrap" style="justify-content: center; margin-top: 14px">
            <button class="btn btn--outline" type="button" :disabled="pdfBusy" @click="pdf"><Download /> {{ pdfBusy ? 'Gerando…' : 'Baixar PDF' }}</button>
            <button v-if="canStart && !result.passed" class="btn btn--primary" type="button" @click="start"><RefreshCw /> Tentar de novo</button>
            <RouterLink v-else-if="nextLesson" :to="`/cursos/${courseSlug}/aulas/${nextLesson.slug}`" class="btn btn--primary">Próxima aula <ArrowRight /></RouterLink>
            <RouterLink :to="`/cursos/${courseSlug}`" class="btn btn--ghost">Voltar ao curso</RouterLink>
            <button class="btn btn--ghost" type="button" @click="state = 'intro'">Tentativas</button>
          </div>
        </section>

        <section v-if="assessment.show_answers" class="stack">
          <h2 style="font-size: 1.05rem; margin: 8px 0 0">Revisão</h2>
          <QuestionCard
            v-for="(q, i) in reviewQuestions"
            :key="q.id"
            :question="q"
            :options="q.options ?? []"
            :model-value="answerFor(q)"
            :number="i + 1"
            :total="reviewQuestions.length"
            :review="detailFor(q)"
            disabled
          />
        </section>
        <div v-else class="alert alert--info"><Clock /> O gabarito desta avaliação não é exibido.</div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.assess {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.assess__bar {
  position: sticky;
  top: 0;
  z-index: 20;
  height: var(--header-h);
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 8px;
  background: color-mix(in srgb, var(--bg-elev) 92%, transparent);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}

.assess__titles {
  flex: 1;
  min-width: 0;
  line-height: 1.2;
  padding: 0 6px;
}

.assess__course {
  font-size: 0.68rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.assess__name {
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.assess__body {
  max-width: 820px;
  padding-block: 20px 48px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.center-msg {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.center-msg > svg {
  width: 40px;
  height: 40px;
  color: var(--muted);
}

.intro {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.intro__icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: var(--primary-soft);
  color: var(--primary);
}

.intro__icon svg {
  width: 26px;
  height: 26px;
}

.facts {
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
}

.facts div {
  padding: 10px 12px;
  border-radius: var(--radius);
  background: var(--surface-2);
}

.facts dt {
  font-size: 0.72rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.facts dd {
  margin: 2px 0 0;
  font-weight: 700;
  font-size: 1.05rem;
}

.run__top {
  display: flex;
  align-items: center;
  gap: 12px;
}

.run__top > :first-child {
  flex: 1;
}

.run__nav {
  display: flex;
  align-items: center;
  gap: 10px;
}

.run__dots {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
}

.run__dots button {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--muted);
  background: var(--surface-2);
  border: 1px solid transparent;
}

.run__dots button.is-done {
  color: var(--primary);
  background: var(--primary-soft);
}

.run__dots button.is-on {
  border-color: var(--primary);
  color: var(--text);
}

.score {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  --c: var(--primary);
}

.score--fail {
  --c: var(--danger);
}

.score__ring {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--c);
  background: color-mix(in srgb, var(--c) 15%, transparent);
  margin-bottom: 6px;
}

.score__ring svg {
  width: 36px;
  height: 36px;
}

.score__pct {
  font-size: 2.6rem;
  font-weight: 800;
  color: var(--c);
  line-height: 1;
}

.score__label {
  font-weight: 600;
}
</style>
