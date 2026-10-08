<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Download, GraduationCap, Users, TrendingUp, Clock } from 'lucide-vue-next'
import { fetchStudentProgress } from '@/lib/api'
import { formatDate, formatPct, formatSeconds, relativeTime } from '@/lib/format'
import type { StudentProgressRow } from '@/types/db'
import StatTile from '@/components/ui/StatTile.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import UserAvatar from '@/components/ui/UserAvatar.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

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
      <button class="btn btn--outline" type="button" :disabled="!filtered.length" @click="exportCsv"><Download /> Exportar CSV</button>
    </div>

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
  </div>
</template>
