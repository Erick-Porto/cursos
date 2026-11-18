<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { BookOpen, ClipboardList, Clock, Code, Download, GraduationCap, ListChecks, Plus, Target, Users, TrendingUp } from 'lucide-vue-next'
import {
  fetchAssessmentsForStaff,
  fetchAttemptGrantsForStaff,
  fetchAttemptSummariesForStaff,
  fetchClassScripts,
  fetchCoursesForStaff,
  fetchExerciseAnswersForStaff,
  fetchExerciseContent,
  fetchExerciseLists,
  fetchLessonsIndex,
  fetchProjectsForStaff,
  fetchStudentProgress,
  fetchSubmissionsForStaff,
  grantExtraAttempts,
} from '@/lib/api'
import { formatDate, formatMinutes, formatPct, formatSeconds, plural, relativeTime } from '@/lib/format'
import { PROJECT_STATE_BADGE, PROJECT_STATE_LABEL, projectState, type ProjectState } from '@/lib/projects'
import { friendlyError } from '@/lib/supabase'
import { useToastStore } from '@/stores/toast'
import type {
  Assessment,
  AttemptGrant,
  AttemptSummary,
  ClassScript,
  Course,
  Exercise,
  ExerciseAnswer,
  ExerciseList,
  LessonSummary,
  Project,
  ProjectSubmission,
  StudentProgressRow,
} from '@/types/db'
import StatTile from '@/components/ui/StatTile.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import UserAvatar from '@/components/ui/UserAvatar.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const route = useRoute()
const toast = useToastStore()

type Tab = 'alunos' | 'avaliacoes' | 'exercicios' | 'roteiros' | 'projetos'
const tab = ref<Tab>('alunos')

// ---- alunos ----
const rows = ref<StudentProgressRow[]>([])
const loading = ref(true)
const courseId = ref('')
const query = ref('')

const courses = computed(() => {
  const map = new Map<string, string>()
  for (const r of rows.value) map.set(r.course_id, r.course_title)
  return [...map].map(([id, title]) => ({ id, title }))
})

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return rows.value.filter(
    (r) =>
      (!courseId.value || r.course_id === courseId.value) &&
      (!q || `${r.full_name} ${r.username ?? ''}`.toLowerCase().includes(q)),
  )
})

const summary = computed(() => {
  const list = filtered.value
  const n = list.length
  const avg = n ? list.reduce((s, r) => s + Number(r.progress_pct), 0) / n : 0
  const done = list.filter((r) => r.completed_at).length
  const time = list.reduce((s, r) => s + Number(r.time_spent_seconds), 0)
  return { n, avg, done, time }
})

function exportCsv() {
  const head = ['curso', 'aluno', 'usuario', 'matricula', 'progresso_pct', 'aulas_concluidas', 'aulas_total', 'media_melhores_notas', 'tempo_segundos', 'concluido_em', 'ultima_atividade']
  const lines = filtered.value.map((r) =>
    [r.course_title, r.full_name, r.username ?? '', r.enrolled_at, r.progress_pct, r.lessons_completed, r.lessons_total, r.avg_best_pct, r.time_spent_seconds, r.completed_at ?? '', r.last_activity_at]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(';'),
  )
  const blob = new Blob(['﻿' + [head.join(';'), ...lines].join('\n')], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `progresso-alunos-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(a.href)
}

// ---- avaliações: tentativas de cada aluno ----
/** Quantas tentativas o botão libera de cada vez. */
const EXTRA_ATTEMPTS = 3

const evCourses = ref<Course[]>([])
const evCourseId = ref('')
const evAssessments = ref<Assessment[]>([])
const evAttempts = ref<AttemptSummary[]>([])
const evGrants = ref<AttemptGrant[]>([])
const evAssessmentId = ref('')
const evQuery = ref('')
const evLoading = ref(false)
const evReady = ref(false)
/** Aluno cuja liberação está em andamento. */
const granting = ref('')

type EvState = 'blocked' | 'failed' | 'none' | 'passed'
const EV_LABEL: Record<EvState, string> = { blocked: 'Sem tentativas', failed: 'Abaixo da mínima', none: 'Não fez', passed: 'Aprovado' }
const EV_BADGE: Record<EvState, string> = { blocked: 'badge--danger', failed: 'badge--warning', none: '', passed: 'badge--primary' }
// quem esgotou as tentativas aparece primeiro: é para eles que o botão existe
const EV_ORDER: Record<EvState, number> = { blocked: 0, failed: 1, none: 2, passed: 3 }

interface EvStats {
  used: number
  best: number | null
  passed: boolean
  extra: number
}

const evStudents = computed(() => rows.value.filter((r) => r.course_id === evCourseId.value))
const evKey = (assessmentId: string, userId: string) => `${assessmentId}:${userId}`

/** Tentativas usadas, melhor nota e tentativas extras de cada aluno em cada avaliação. */
const evStats = computed(() => {
  const map = new Map<string, EvStats>()
  const get = (k: string) => {
    let st = map.get(k)
    if (!st) map.set(k, (st = { used: 0, best: null, passed: false, extra: 0 }))
    return st
  }
  for (const t of evAttempts.value) {
    const st = get(evKey(t.assessment_id, t.user_id))
    st.used++
    st.best = Math.max(st.best ?? 0, Number(t.pct))
    if (t.passed) st.passed = true
  }
  for (const g of evGrants.value) get(evKey(g.assessment_id, g.user_id)).extra += g.extra
  return map
})

function evRow(a: Assessment, student: StudentProgressRow) {
  const st = evStats.value.get(evKey(a.id, student.user_id)) ?? { used: 0, best: null, passed: false, extra: 0 }
  const limit = a.max_attempts == null ? null : a.max_attempts + st.extra
  const state: EvState = st.passed ? 'passed' : limit !== null && st.used >= limit ? 'blocked' : st.used ? 'failed' : 'none'
  return { student, ...st, limit, state }
}
type EvRow = ReturnType<typeof evRow>

/** Alunos sem tentativas restantes, por avaliação (aparece na lista de avaliações). */
const evBlocked = computed(() => {
  const map = new Map<string, number>()
  for (const a of evAssessments.value) {
    const n = evStudents.value.filter((st) => evRow(a, st).state === 'blocked').length
    if (n) map.set(a.id, n)
  }
  return map
})

const evAssessment = computed(() => evAssessments.value.find((a) => a.id === evAssessmentId.value) ?? null)
const evRows = computed(() => {
  const a = evAssessment.value
  if (!a) return []
  const q = evQuery.value.trim().toLowerCase()
  return evStudents.value
    .filter((st) => !q || `${st.full_name} ${st.username ?? ''}`.toLowerCase().includes(q))
    .map((st) => evRow(a, st))
    .sort((x, y) => EV_ORDER[x.state] - EV_ORDER[y.state] || x.student.full_name.localeCompare(y.student.full_name))
})

async function loadEvaluations() {
  evAssessments.value = []
  evAttempts.value = []
  evGrants.value = []
  evAssessmentId.value = ''
  if (!evCourseId.value) return
  evLoading.value = true
  try {
    const [list, attempts, grants] = await Promise.all([
      fetchAssessmentsForStaff(evCourseId.value),
      fetchAttemptSummariesForStaff(evCourseId.value),
      fetchAttemptGrantsForStaff(evCourseId.value),
    ])
    evAssessments.value = list
    evAttempts.value = attempts
    evGrants.value = grants
    // começa pela primeira avaliação com aluno sem tentativas; senão, pela última que alguém fez
    const blocked = list.find((a) => evBlocked.value.has(a.id))
    const lastDone = [...list].reverse().find((a) => attempts.some((t) => t.assessment_id === a.id))
    evAssessmentId.value = (blocked ?? lastDone ?? list[0])?.id ?? ''
  } catch (e) {
    toast.error('Não foi possível carregar as avaliações', friendlyError(e))
  } finally {
    evLoading.value = false
  }
}

async function openAvaliacoes() {
  tab.value = 'avaliacoes'
  if (evReady.value) return
  evLoading.value = true
  try {
    const list = await fetchCoursesForStaff()
    evCourses.value = list
    evReady.value = true
    if (!evCourseId.value && list.length) evCourseId.value = (list.find((c) => c.is_published) ?? list[0]).id
  } catch (e) {
    toast.error('Não foi possível carregar os cursos', friendlyError(e))
  } finally {
    evLoading.value = false
  }
}

watch(evCourseId, () => void loadEvaluations())

async function grantAttempts(r: EvRow) {
  const a = evAssessment.value
  if (!a || granting.value) return
  granting.value = r.student.user_id
  try {
    const res = await grantExtraAttempts(a.id, r.student.user_id, EXTRA_ATTEMPTS)
    evGrants.value = [...evGrants.value, res.grant]
    toast.success(`Mais ${EXTRA_ATTEMPTS} tentativas para ${r.student.full_name}`, `${a.title}: ${res.used} de ${res.limit} usadas.`)
  } catch (e) {
    toast.error('Não foi possível liberar as tentativas', friendlyError(e))
  } finally {
    granting.value = ''
  }
}

// ---- listas de exercícios: entregas de cada aluno ----
const exCourses = ref<Course[]>([])
const exCourseId = ref('')
const exLists = ref<ExerciseList[]>([])
const exListId = ref('')
const exItems = ref<Exercise[]>([])
const exAnswers = ref<ExerciseAnswer[]>([])
const exLoading = ref(false)
const exReady = ref(false)
let wantedListId = ''

const exCourse = computed(() => exCourses.value.find((c) => c.id === exCourseId.value) ?? null)
const exList = computed(() => exLists.value.find((l) => l.id === exListId.value) ?? null)
const exCodeIds = computed(() => new Set(exItems.value.filter((x) => x.type === 'code').map((x) => x.id)))
const exCodeTotal = computed(() => exCodeIds.value.size)
const exTheoryTotal = computed(() => exItems.value.length - exCodeTotal.value)

/** Situação de cada aluno na lista: quem tem código aguardando correção aparece primeiro. */
const exRows = computed(() =>
  rows.value
    .filter((r) => r.course_id === exCourseId.value)
    .map((student) => {
      const mine = exAnswers.value.filter((a) => a.user_id === student.user_id)
      const code = mine.filter((a) => exCodeIds.value.has(a.exercise_id))
      const theory = mine.filter((a) => !exCodeIds.value.has(a.exercise_id))
      return {
        student,
        delivered: code.length,
        waiting: code.filter((a) => a.status === 'submitted').length,
        approved: code.filter((a) => a.status === 'approved').length,
        returned: code.filter((a) => a.status === 'returned').length,
        theoryDone: theory.length,
        theoryRight: theory.filter((a) => a.correct).length,
      }
    })
    .sort((a, b) => b.waiting - a.waiting || a.student.full_name.localeCompare(b.student.full_name)),
)

async function loadExerciseAnswers() {
  exItems.value = []
  exAnswers.value = []
  if (!exListId.value) return
  exLoading.value = true
  try {
    const [content, answers] = await Promise.all([fetchExerciseContent(exListId.value), fetchExerciseAnswersForStaff(exListId.value)])
    exItems.value = content.exercises
    exAnswers.value = answers
  } catch (e) {
    toast.error('Não foi possível carregar os exercícios', friendlyError(e))
  } finally {
    exLoading.value = false
  }
}

async function loadExerciseLists() {
  exLists.value = []
  exListId.value = ''
  if (!exCourseId.value) return
  exLoading.value = true
  try {
    const lists = await fetchExerciseLists(exCourseId.value)
    exLists.value = lists
    exListId.value = (lists.find((l) => l.id === wantedListId) ?? lists[0])?.id ?? ''
    wantedListId = ''
  } catch (e) {
    toast.error('Não foi possível carregar as listas', friendlyError(e))
  } finally {
    exLoading.value = false
  }
}

async function openExercicios(courseHint = '') {
  tab.value = 'exercicios'
  if (exReady.value) return
  exLoading.value = true
  try {
    const list = await fetchCoursesForStaff()
    exCourses.value = list
    exReady.value = true
    const hinted = list.find((c) => c.id === courseHint)
    if (hinted) exCourseId.value = hinted.id
    else if (!exCourseId.value && list.length) exCourseId.value = (list.find((c) => c.is_published) ?? list[0]).id
  } catch (e) {
    toast.error('Não foi possível carregar os cursos', friendlyError(e))
  } finally {
    exLoading.value = false
  }
}

watch(exCourseId, () => void loadExerciseLists())
watch(exListId, () => void loadExerciseAnswers())

// ---- roteiros de aula ----
const scriptCourses = ref<Course[]>([])
const scriptCourseId = ref('')
const scripts = ref<ClassScript[]>([])
const lessonsIndex = ref<LessonSummary[]>([])
const scriptsLoading = ref(false)
const scriptsReady = ref(false)

const scriptCourse = computed(() => scriptCourses.value.find((c) => c.id === scriptCourseId.value) ?? null)

function lessonTitle(slug: string): string {
  return lessonsIndex.value.find((l) => l.slug === slug && l.course_id === scriptCourseId.value)?.title ?? slug
}

async function loadScripts() {
  if (!scriptCourseId.value) {
    scripts.value = []
    return
  }
  scriptsLoading.value = true
  try {
    scripts.value = await fetchClassScripts(scriptCourseId.value)
  } finally {
    scriptsLoading.value = false
  }
}

async function openRoteiros() {
  tab.value = 'roteiros'
  if (scriptsReady.value) return
  scriptsLoading.value = true
  try {
    const [list, index] = await Promise.all([fetchCoursesForStaff(), fetchLessonsIndex()])
    scriptCourses.value = list
    lessonsIndex.value = index
    scriptsReady.value = true
    if (!scriptCourseId.value && list.length) {
      // começa pelo curso que mais provavelmente está em andamento: o primeiro publicado
      scriptCourseId.value = (list.find((c) => c.is_published) ?? list[0]).id
    }
  } finally {
    scriptsLoading.value = false
  }
}

watch(scriptCourseId, () => void loadScripts())

// ---- projetos avaliados ----
const projCourses = ref<Course[]>([])
const projCourseId = ref('')
const projects = ref<Project[]>([])
const submissions = ref<ProjectSubmission[]>([])
const projectId = ref('')
let wantedProjectId = ''
const projLoading = ref(false)
const projReady = ref(false)

const projCourse = computed(() => projCourses.value.find((c) => c.id === projCourseId.value) ?? null)
const projStudents = computed(() => rows.value.filter((r) => r.course_id === projCourseId.value))
const subKey = (projectIdValue: string, userId: string) => `${projectIdValue}:${userId}`
const subsByKey = computed(() => new Map(submissions.value.map((s) => [subKey(s.project_id, s.user_id), s])))

function projectCounts(p: Project) {
  const subs = submissions.value.filter((s) => s.project_id === p.id)
  return {
    delivered: subs.length,
    waiting: subs.filter((s) => s.status === 'submitted').length,
    passed: subs.filter((s) => s.status === 'graded' && s.passed).length,
    enrolled: projStudents.value.length,
  }
}

// aguardando correção primeiro; depois devolvidos, sem entrega e corrigidos
const STATE_ORDER: Record<ProjectState, number> = { submitted: 0, returned: 1, pending: 2, failed: 3, passed: 4 }
const projectRows = computed(() => {
  if (!projectId.value) return []
  return projStudents.value
    .map((st) => {
      const sub = subsByKey.value.get(subKey(projectId.value, st.user_id)) ?? null
      return { student: st, sub, state: projectState(sub) }
    })
    .sort((a, b) => STATE_ORDER[a.state] - STATE_ORDER[b.state] || a.student.full_name.localeCompare(b.student.full_name))
})
const selectedProject = computed(() => projects.value.find((p) => p.id === projectId.value) ?? null)

async function loadProjects() {
  projects.value = []
  submissions.value = []
  projectId.value = ''
  if (!projCourseId.value) return
  projLoading.value = true
  try {
    const [list, subs] = await Promise.all([fetchProjectsForStaff(projCourseId.value), fetchSubmissionsForStaff(projCourseId.value)])
    projects.value = list
    submissions.value = subs
    // volta no projeto de onde veio a correção; senão, no primeiro com entrega aguardando (ou no primeiro)
    const wanted = list.find((p) => p.id === wantedProjectId)
    wantedProjectId = ''
    projectId.value = (wanted ?? list.find((p) => subs.some((s) => s.project_id === p.id && s.status === 'submitted')) ?? list[0])?.id ?? ''
  } finally {
    projLoading.value = false
  }
}

async function openProjetos(courseHint = '') {
  tab.value = 'projetos'
  if (projReady.value) return
  projLoading.value = true
  try {
    const list = await fetchCoursesForStaff()
    projCourses.value = list
    projReady.value = true
    const hinted = list.find((c) => c.id === courseHint)
    if (hinted) projCourseId.value = hinted.id
    else if (!projCourseId.value && list.length) projCourseId.value = (list.find((c) => c.is_published) ?? list[0]).id
  } finally {
    projLoading.value = false
  }
}

watch(projCourseId, () => void loadProjects())

const csvCell = (v: unknown) => `"${String(v).replace(/"/g, '""')}"`

/** Planilha com a situação e a nota de cada aluno em cada projeto do curso (para o diário). */
function exportProjectsCsv() {
  const head = ['aluno', 'usuario', ...projects.value.flatMap((p) => [`${p.title} - situacao`, `${p.title} - nota`])]
  const lines = projStudents.value.map((st) =>
    [
      st.full_name,
      st.username ?? '',
      ...projects.value.flatMap((p) => {
        const sub = subsByKey.value.get(subKey(p.id, st.user_id)) ?? null
        return [PROJECT_STATE_LABEL[projectState(sub)], sub?.pct ?? '']
      }),
    ]
      .map(csvCell)
      .join(';'),
  )
  const blob = new Blob(['﻿' + [head.map(csvCell).join(';'), ...lines].join('\n')], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `projetos-${projCourse.value?.slug ?? 'curso'}-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(a.href)
}

onMounted(async () => {
  // a tela de correção volta com ?aba=projetos&curso=<id>&projeto=<id>
  if (route.query.aba === 'projetos') {
    wantedProjectId = String(route.query.projeto ?? '')
    void openProjetos(String(route.query.curso ?? ''))
  } else if (route.query.aba === 'avaliacoes') {
    void openAvaliacoes()
  } else if (route.query.aba === 'exercicios') {
    wantedListId = String(route.query.lista ?? '')
    void openExercicios(String(route.query.curso ?? ''))
  }
  try {
    rows.value = await fetchStudentProgress()
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container page">
    <div class="page-head">
      <div>
        <span class="eyebrow">Painel</span>
        <h1>Instrutor</h1>
      </div>
      <button v-if="tab === 'alunos'" class="btn btn--outline" type="button" :disabled="!filtered.length" @click="exportCsv"><Download /> Exportar CSV</button>
      <button v-else-if="tab === 'projetos'" class="btn btn--outline" type="button" :disabled="!projects.length || !projStudents.length" @click="exportProjectsCsv"><Download /> Exportar notas</button>
    </div>

    <div class="tabs" role="tablist" aria-label="Seções do painel">
      <button class="tabs__tab" :class="{ 'is-active': tab === 'alunos' }" type="button" role="tab" :aria-selected="tab === 'alunos'" @click="tab = 'alunos'">
        <Users /> Alunos
      </button>
      <button class="tabs__tab" :class="{ 'is-active': tab === 'avaliacoes' }" type="button" role="tab" :aria-selected="tab === 'avaliacoes'" @click="openAvaliacoes">
        <ListChecks /> Avaliações
      </button>
      <button class="tabs__tab" :class="{ 'is-active': tab === 'exercicios' }" type="button" role="tab" :aria-selected="tab === 'exercicios'" @click="openExercicios()">
        <Code /> Exercícios
      </button>
      <button class="tabs__tab" :class="{ 'is-active': tab === 'roteiros' }" type="button" role="tab" :aria-selected="tab === 'roteiros'" @click="openRoteiros">
        <ClipboardList /> Roteiros de aula
      </button>
      <button class="tabs__tab" :class="{ 'is-active': tab === 'projetos' }" type="button" role="tab" :aria-selected="tab === 'projetos'" @click="openProjetos()">
        <Target /> Projetos
      </button>
    </div>

    <!-- ===================== Alunos ===================== -->
    <template v-if="tab === 'alunos'">
      <LoadingBlock v-if="loading" text="Carregando alunos" />

      <template v-else>
        <div class="row wrap" style="margin-bottom: 16px">
          <select v-model="courseId" class="input" style="max-width: 320px">
            <option value="">Todos os cursos</option>
            <option v-for="c in courses" :key="c.id" :value="c.id">{{ c.title }}</option>
          </select>
          <input v-model="query" class="input" type="search" placeholder="Buscar aluno" style="max-width: 280px" />
        </div>

        <div class="grid grid--stats" style="margin-bottom: 20px">
          <StatTile :icon="Users" label="Matrículas" :value="summary.n" />
          <StatTile :icon="TrendingUp" label="Progresso médio" :value="formatPct(summary.avg)" variant="info" />
          <StatTile :icon="GraduationCap" label="Concluíram" :value="summary.done" variant="accent" />
          <StatTile :icon="Clock" label="Tempo de estudo" :value="formatSeconds(summary.time)" variant="warning" />
        </div>

        <div v-if="filtered.length" class="card" style="padding: 0">
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Aluno</th>
                  <th>Curso</th>
                  <th style="min-width: 160px">Progresso</th>
                  <th>Aulas</th>
                  <th>Média</th>
                  <th>Tempo</th>
                  <th>Atividade</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in filtered" :key="r.course_id + r.user_id">
                  <td>
                    <div class="row">
                      <UserAvatar :name="r.full_name" :src="r.avatar_url" :size="30" />
                      <div>
                        <div style="font-weight: 600">{{ r.full_name }}</div>
                        <div class="hint">{{ r.username ? '@' + r.username : 'desde ' + formatDate(r.enrolled_at) }}</div>
                      </div>
                    </div>
                  </td>
                  <td>{{ r.course_title }}</td>
                  <td><ProgressBar :value="r.progress_pct" size="sm" label /></td>
                  <td>{{ r.lessons_completed }}/{{ r.lessons_total }}</td>
                  <td>{{ formatPct(r.avg_best_pct) }}</td>
                  <td>{{ formatSeconds(r.time_spent_seconds) }}</td>
                  <td :title="r.last_activity_at">{{ relativeTime(r.last_activity_at) }}</td>
                  <td>
                    <span class="badge" :class="r.completed_at ? 'badge--primary' : 'badge--info'">{{ r.completed_at ? 'Concluído' : 'Em andamento' }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-else class="card">
          <EmptyState :icon="Users" title="Nenhuma matrícula" text="Quando alunos se matricularem, o progresso deles aparece aqui." />
        </div>
      </template>
    </template>

    <!-- ===================== Avaliações ===================== -->
    <template v-else-if="tab === 'avaliacoes'">
      <p class="hint" style="margin: 0 0 14px; max-width: 72ch">
        Tentativas de cada aluno nos quizzes e provas. Quem já tentou pode ganhar mais {{ EXTRA_ATTEMPTS }}: a liberação vale na hora,
        e o aluno vê o novo limite ao abrir a avaliação.
      </p>

      <div class="ev-filters">
        <select v-model="evCourseId" class="input" aria-label="Curso">
          <option v-if="!evCourses.length" value="">Nenhum curso</option>
          <option v-for="c in evCourses" :key="c.id" :value="c.id">{{ c.title }}{{ c.is_published ? '' : ' (não publicado)' }}</option>
        </select>
        <select v-model="evAssessmentId" class="input" aria-label="Avaliação" :disabled="!evAssessments.length">
          <option v-if="!evAssessments.length" value="">Nenhuma avaliação</option>
          <option v-for="a in evAssessments" :key="a.id" :value="a.id">
            {{ a.title }}{{ evBlocked.get(a.id) ? ` (${plural(evBlocked.get(a.id)!, 'aluno', 'alunos')} sem tentativas)` : '' }}
          </option>
        </select>
        <input v-model="evQuery" class="input" type="search" placeholder="Buscar aluno" aria-label="Buscar aluno" />
      </div>

      <LoadingBlock v-if="evLoading" text="Carregando avaliações" />

      <div v-else-if="!evAssessments.length" class="card">
        <EmptyState :icon="ListChecks" title="Nenhuma avaliação neste curso" text="Crie arquivos em content/courses/<curso>/assessments/ e rode npm run content:sync." />
      </div>

      <template v-else-if="evAssessment">
        <div class="ev-meta">
          <span class="badge">{{ evAssessment.kind === 'exam' ? 'Prova' : 'Quiz' }}</span>
          <span class="badge badge--info">mínimo {{ formatPct(evAssessment.passing_score) }}</span>
          <span class="badge badge--info">
            {{ evAssessment.max_attempts ? `até ${plural(evAssessment.max_attempts, 'tentativa', 'tentativas')}` : 'sem limite de tentativas' }}
          </span>
          <span v-if="evBlocked.get(evAssessment.id)" class="badge badge--danger">
            {{ plural(evBlocked.get(evAssessment.id)!, 'aluno', 'alunos') }} sem tentativas
          </span>
        </div>

        <div class="card" style="padding: 0">
          <!-- no desktop as linhas viram colunas; no celular, cartões em que o botão desce quando falta espaço -->
          <ul v-if="evRows.length" class="ev-list" aria-label="Tentativas por aluno">
            <li class="ev-row ev-row--head" aria-hidden="true">
              <span>Aluno</span>
              <span>Situação</span>
              <span>Tentativas</span>
              <span>Melhor nota</span>
              <span></span>
            </li>
            <li v-for="r in evRows" :key="r.student.user_id" class="ev-row">
              <div class="ev-row__top">
                <div class="ev-row__student row">
                  <UserAvatar :name="r.student.full_name" :src="r.student.avatar_url" :size="30" />
                  <div style="min-width: 0">
                    <div class="ev-row__name">{{ r.student.full_name }}</div>
                    <div v-if="r.student.username" class="hint">@{{ r.student.username }}</div>
                  </div>
                </div>
                <div class="ev-row__state">
                  <span class="badge" :class="EV_BADGE[r.state]">{{ EV_LABEL[r.state] }}</span>
                </div>
              </div>
              <div class="ev-row__bottom">
                <div class="ev-row__facts">
                  <div class="ev-row__fact">
                    <span class="ev-row__label">Tentativas</span>
                    <span>{{ r.used }}{{ r.limit !== null ? ` de ${r.limit}` : '' }}</span>
                    <span v-if="r.extra" class="hint">{{ plural(r.extra, 'liberada', 'liberadas') }}</span>
                  </div>
                  <div class="ev-row__fact">
                    <span class="ev-row__label">Melhor nota</span>
                    <span>{{ r.best !== null ? formatPct(r.best, 1) : 'sem nota' }}</span>
                  </div>
                </div>
                <div class="ev-row__action">
                  <button
                    v-if="evAssessment.max_attempts && r.used"
                    class="btn btn--sm"
                    :class="r.state === 'blocked' ? 'btn--primary' : 'btn--outline'"
                    type="button"
                    :disabled="!!granting"
                    :aria-label="`Liberar mais ${EXTRA_ATTEMPTS} tentativas para ${r.student.full_name}`"
                    @click="grantAttempts(r)"
                  >
                    <Plus /> {{ granting === r.student.user_id ? 'Liberando…' : `Liberar mais ${EXTRA_ATTEMPTS}` }}
                  </button>
                </div>
              </div>
            </li>
          </ul>
          <EmptyState
            v-else
            :icon="Users"
            :title="evQuery ? 'Nenhum aluno encontrado' : 'Nenhum aluno matriculado'"
            :text="evQuery ? 'Confira o nome digitado na busca.' : 'Quando alunos se matricularem, as tentativas aparecem aqui.'"
          />
        </div>
      </template>
    </template>

    <!-- ===================== Listas de exercícios ===================== -->
    <template v-else-if="tab === 'exercicios'">
      <p class="hint" style="margin: 0 0 14px; max-width: 72ch">
        O código entregue espera a sua correção: aprove ou devolva com um comentário. A teoria é corrigida automaticamente.
      </p>

      <div class="ev-filters ev-filters--two">
        <select v-model="exCourseId" class="input" aria-label="Curso">
          <option v-if="!exCourses.length" value="">Nenhum curso</option>
          <option v-for="c in exCourses" :key="c.id" :value="c.id">{{ c.title }}{{ c.is_published ? '' : ' (não publicado)' }}</option>
        </select>
        <select v-model="exListId" class="input" aria-label="Lista de exercícios" :disabled="!exLists.length">
          <option v-if="!exLists.length" value="">Nenhuma lista</option>
          <option v-for="l in exLists" :key="l.id" :value="l.id">{{ l.title }}</option>
        </select>
      </div>

      <LoadingBlock v-if="exLoading" text="Carregando exercícios" />

      <div v-else-if="!exLists.length" class="card">
        <EmptyState
          :icon="Code"
          title="Nenhuma lista neste curso"
          text="Crie as listas em content/courses/<curso>/exercicios/ e rode npm run content:sync (a migration 0006 precisa estar aplicada)."
        />
      </div>

      <div v-else class="card" style="padding: 0">
        <div v-if="exRows.length" class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Aluno</th>
                <th>Aguardando</th>
                <th>Código entregue</th>
                <th>Aprovados</th>
                <th>Teoria certa</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in exRows" :key="r.student.user_id">
                <td>
                  <div class="row">
                    <UserAvatar :name="r.student.full_name" :src="r.student.avatar_url" :size="30" />
                    <div>
                      <div style="font-weight: 600">{{ r.student.full_name }}</div>
                      <div class="hint">{{ r.student.username ? '@' + r.student.username : '' }}</div>
                    </div>
                  </div>
                </td>
                <td><span class="badge" :class="r.waiting ? 'badge--info' : ''">{{ r.waiting }}</span></td>
                <td>{{ r.delivered }} de {{ exCodeTotal }}</td>
                <td>{{ r.approved }}<span v-if="r.returned" class="hint"> ({{ r.returned }} a refazer)</span></td>
                <td>{{ r.theoryRight }} de {{ exTheoryTotal }}</td>
                <td style="text-align: right">
                  <RouterLink
                    v-if="exCourse && exList && (r.delivered || r.theoryDone)"
                    :to="`/instrutor/exercicios/${exCourse.slug}/${exList.slug}/${r.student.user_id}`"
                    class="btn btn--sm"
                    :class="r.waiting ? 'btn--primary' : 'btn--outline'"
                  >
                    {{ r.waiting ? 'Corrigir' : 'Abrir' }}
                  </RouterLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <EmptyState v-else :icon="Users" title="Nenhum aluno matriculado" text="Quando alunos se matricularem, as entregas aparecem aqui." />
      </div>
    </template>

    <!-- ===================== Projetos avaliados ===================== -->
    <template v-else-if="tab === 'projetos'">
      <p class="hint" style="margin: 0 0 14px; max-width: 72ch">
        Entregas dos projetos avaliados. Corrija pela rubrica: devolva para ajustes (o aluno reenvia) ou lance a nota final.
      </p>

      <div class="row wrap" style="margin-bottom: 16px">
        <select v-model="projCourseId" class="input" style="max-width: 360px" aria-label="Curso">
          <option v-if="!projCourses.length" value="">Nenhum curso</option>
          <option v-for="c in projCourses" :key="c.id" :value="c.id">{{ c.title }}{{ c.is_published ? '' : ' (não publicado)' }}</option>
        </select>
      </div>

      <LoadingBlock v-if="projLoading" text="Carregando projetos" />

      <div v-else-if="!projects.length" class="card">
        <EmptyState
          :icon="Target"
          title="Nenhum projeto neste curso"
          text="Crie arquivos em content/courses/<curso>/projetos/ e rode npm run content:sync (a migration 0004 precisa estar aplicada)."
        />
      </div>

      <template v-else>
        <div class="proj-cards" role="tablist" aria-label="Projetos do curso">
          <button
            v-for="p in projects"
            :key="p.id"
            class="proj-card"
            :class="{ 'is-active': p.id === projectId }"
            type="button"
            role="tab"
            :aria-selected="p.id === projectId"
            @click="projectId = p.id"
          >
            <span class="proj-card__section">{{ p.section ?? 'Projeto' }}</span>
            <span class="proj-card__title">{{ p.title }}</span>
            <span class="proj-card__meta">
              <span>{{ projectCounts(p).delivered }} de {{ projectCounts(p).enrolled }} entregaram</span>
              <span v-if="projectCounts(p).waiting" class="badge badge--info">{{ projectCounts(p).waiting }} aguardando</span>
              <span v-if="projectCounts(p).passed" class="badge badge--primary">{{ plural(projectCounts(p).passed, 'aprovado', 'aprovados') }}</span>
            </span>
          </button>
        </div>

        <div v-if="selectedProject" class="card" style="padding: 0">
          <div v-if="projectRows.length" class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Aluno</th>
                  <th>Situação</th>
                  <th>Versão</th>
                  <th>Enviado</th>
                  <th>Nota</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in projectRows" :key="r.student.user_id">
                  <td>
                    <div class="row">
                      <UserAvatar :name="r.student.full_name" :src="r.student.avatar_url" :size="30" />
                      <div>
                        <div style="font-weight: 600">{{ r.student.full_name }}</div>
                        <div class="hint">{{ r.student.username ? '@' + r.student.username : '' }}</div>
                      </div>
                    </div>
                  </td>
                  <td><span class="badge" :class="PROJECT_STATE_BADGE[r.state]">{{ PROJECT_STATE_LABEL[r.state] }}</span></td>
                  <td>{{ r.sub ? r.sub.version : '' }}</td>
                  <td :title="r.sub?.submitted_at">{{ r.sub ? relativeTime(r.sub.submitted_at) : '' }}</td>
                  <td>{{ r.sub?.pct != null ? formatPct(r.sub.pct, 1) : '' }}</td>
                  <td style="text-align: right">
                    <RouterLink
                      v-if="r.sub && projCourse"
                      :to="`/instrutor/projetos/${projCourse.slug}/${selectedProject.slug}/${r.student.user_id}`"
                      class="btn btn--sm"
                      :class="r.state === 'submitted' ? 'btn--primary' : 'btn--outline'"
                    >
                      {{ r.state === 'submitted' ? 'Corrigir' : 'Abrir' }}
                    </RouterLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <EmptyState v-else :icon="Users" title="Nenhum aluno matriculado" text="Quando alunos se matricularem, as entregas aparecem aqui." />
        </div>
      </template>
    </template>

    <!-- ===================== Roteiros de aula ===================== -->
    <template v-else>
      <p class="hint" style="margin: 0 0 14px; max-width: 72ch">
        O roteiro é o passo a passo de cada encontro presencial: blocos, tempos, demonstrações, laboratório e fechamento.
        Só instrutores enxergam esta seção.
      </p>

      <div class="row wrap" style="margin-bottom: 16px">
        <select v-model="scriptCourseId" class="input" style="max-width: 360px" aria-label="Curso">
          <option v-if="!scriptCourses.length" value="">Nenhum curso</option>
          <option v-for="c in scriptCourses" :key="c.id" :value="c.id">{{ c.title }}{{ c.is_published ? '' : ' (não publicado)' }}</option>
        </select>
      </div>

      <LoadingBlock v-if="scriptsLoading" text="Carregando roteiros" />

      <div v-else-if="!scripts.length" class="card">
        <EmptyState
          :icon="ClipboardList"
          title="Nenhum roteiro neste curso"
          text="Crie arquivos em content/courses/<curso>/roteiros/ e rode npm run content:sync."
        />
      </div>

      <div v-else class="scripts">
        <article v-for="s in scripts" :key="s.id" class="card script">
          <div class="script__head">
            <span class="script__pos mono">{{ String(s.position).padStart(2, '0') }}</span>
            <div class="script__titles">
              <h2 class="script__title">{{ s.title }}</h2>
              <p v-if="s.summary" class="hint script__summary">{{ s.summary }}</p>
            </div>
          </div>
          <div class="script__meta">
            <span v-if="s.duration_minutes" class="badge badge--info"><Clock /> {{ formatMinutes(s.duration_minutes) }}</span>
            <span v-for="slug in s.lesson_slugs" :key="slug" class="badge"><BookOpen /> {{ lessonTitle(slug) }}</span>
          </div>
          <div class="script__actions">
            <RouterLink v-if="scriptCourse" :to="`/instrutor/roteiros/${scriptCourse.slug}/${s.slug}`" class="btn btn--primary btn--sm">
              <ClipboardList /> Abrir roteiro
            </RouterLink>
          </div>
        </article>
      </div>
    </template>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  scrollbar-width: none;
  padding: 4px;
  margin: 0 0 18px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
  width: fit-content;
  max-width: 100%;
}
.tabs__tab {
  flex: none;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: var(--text-2);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}
.tabs__tab svg {
  width: 16px;
  height: 16px;
}
.tabs__tab:hover {
  color: var(--text);
}
.tabs__tab.is-active {
  background: var(--primary-soft);
  color: var(--primary);
}

.ev-filters {
  display: grid;
  gap: 10px;
  margin-bottom: 14px;
}
@media (min-width: 720px) {
  .ev-filters {
    grid-template-columns: minmax(0, 300px) minmax(0, 420px) minmax(0, 240px);
  }
  .ev-filters--two {
    grid-template-columns: minmax(0, 300px) minmax(0, 420px);
  }
}
.ev-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}
.ev-list {
  margin: 0;
  padding: 0;
  list-style: none;
}
/* celular: cartão com nome e situação em cima; tentativas, nota e botão embaixo */
.ev-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--border);
  font-size: 0.9rem;
}
.ev-row:last-child {
  border-bottom: 0;
}
.ev-row--head {
  display: none;
}
.ev-row__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.ev-row__student {
  min-width: 0;
}
.ev-row__name {
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ev-row__state {
  flex: none;
}
.ev-row__bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;
}
.ev-row__facts {
  display: flex;
  gap: 20px;
}
.ev-row__fact {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.ev-row__label {
  color: var(--muted);
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}
.ev-row__action {
  margin-left: auto;
}
.ev-row__action:empty {
  display: none;
}

/* desktop: as mesmas peças viram as colunas de uma tabela */
@media (min-width: 720px) {
  .ev-row,
  .ev-row--head {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 1.2fr) minmax(0, 1fr) minmax(0, 1fr) 160px;
    align-items: center;
    gap: 12px;
  }
  .ev-row__top,
  .ev-row__bottom,
  .ev-row__facts {
    display: contents;
  }
  .ev-row--head {
    padding-block: 10px;
    color: var(--muted);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .ev-row__action {
    justify-self: end;
  }
  .ev-row__action:empty {
    display: block;
  }
  /* o cabeçalho já diz o nome da coluna; o rótulo fica só para leitores de tela */
  .ev-row__label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }
}

.proj-cards {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
  overflow-x: auto;
  padding-bottom: 4px;
  scroll-snap-type: x proximity;
}
.proj-card {
  flex: 0 0 220px;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  color: var(--text);
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.proj-card:hover {
  border-color: var(--border-strong);
}
.proj-card.is-active {
  border-color: var(--primary);
  box-shadow: var(--glow-primary);
}
.proj-card__section {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
}
.proj-card__title {
  font-weight: 700;
}
.proj-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  font-size: 0.8rem;
  color: var(--text-2);
}
@media (min-width: 1024px) {
  .proj-cards {
    flex-wrap: wrap;
    overflow: visible;
  }
}

.scripts {
  display: grid;
  gap: 12px;
}
.script {
  display: grid;
  gap: 12px;
}
.script__head {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.script__pos {
  flex: 0 0 auto;
  min-width: 40px;
  padding: 6px 0;
  border-radius: 10px;
  background: var(--primary-soft);
  color: var(--primary);
  font-weight: 700;
  text-align: center;
}
.script__title {
  margin: 0;
  font-size: 1.05rem;
}
.script__summary {
  margin: 4px 0 0;
}
.script__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.script__actions {
  display: flex;
  justify-content: flex-end;
}
@media (min-width: 900px) {
  .script {
    grid-template-columns: 1fr auto;
    align-items: center;
  }
  .script__head {
    grid-column: 1;
  }
  .script__meta {
    grid-column: 1;
  }
  .script__actions {
    grid-column: 2;
    grid-row: 1 / span 2;
  }
}
</style>
