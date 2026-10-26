<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { BookOpen, ClipboardList, Clock, Download, GraduationCap, Users, TrendingUp } from 'lucide-vue-next'
import { fetchClassScripts, fetchCoursesForStaff, fetchLessonsIndex, fetchStudentProgress } from '@/lib/api'
import { formatDate, formatMinutes, formatPct, formatSeconds, relativeTime } from '@/lib/format'
import type { ClassScript, Course, LessonSummary, StudentProgressRow } from '@/types/db'
import StatTile from '@/components/ui/StatTile.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import UserAvatar from '@/components/ui/UserAvatar.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

type Tab = 'alunos' | 'roteiros'
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

onMounted(async () => {
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
    </div>

    <div class="tabs" role="tablist" aria-label="Seções do painel">
      <button class="tabs__tab" :class="{ 'is-active': tab === 'alunos' }" type="button" role="tab" :aria-selected="tab === 'alunos'" @click="tab = 'alunos'">
        <Users /> Alunos
      </button>
      <button class="tabs__tab" :class="{ 'is-active': tab === 'roteiros' }" type="button" role="tab" :aria-selected="tab === 'roteiros'" @click="openRoteiros">
        <ClipboardList /> Roteiros de aula
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
