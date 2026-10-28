<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { BookOpen, ClipboardList, Clock, Download, GraduationCap, Target, Users, TrendingUp } from 'lucide-vue-next'
import { fetchClassScripts, fetchCoursesForStaff, fetchLessonsIndex, fetchProjectsForStaff, fetchStudentProgress, fetchSubmissionsForStaff } from '@/lib/api'
import { formatDate, formatMinutes, formatPct, formatSeconds, plural, relativeTime } from '@/lib/format'
import { PROJECT_STATE_BADGE, PROJECT_STATE_LABEL, projectState, type ProjectState } from '@/lib/projects'
import type { ClassScript, Course, LessonSummary, Project, ProjectSubmission, StudentProgressRow } from '@/types/db'
import StatTile from '@/components/ui/StatTile.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import UserAvatar from '@/components/ui/UserAvatar.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const route = useRoute()

type Tab = 'alunos' | 'roteiros' | 'projetos'
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
  padding: 4px;
  margin: 0 0 18px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
  width: fit-content;
  max-width: 100%;
}
.tabs__tab {
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
