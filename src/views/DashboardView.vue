<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Award, BookOpen, CircleCheck, Flame, GraduationCap, Play, Sparkles, Trophy } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useCatalogStore } from '@/stores/catalog'
import { useAchievementsStore } from '@/stores/achievements'
import { fetchLessonsIndex, fetchRecentActivity } from '@/lib/api'
import { formatNumber, relativeTime } from '@/lib/format'
import type { ActivityEntry, LessonSummary } from '@/types/db'
import LevelBar from '@/components/ui/LevelBar.vue'
import StatTile from '@/components/ui/StatTile.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import CourseCard from '@/components/course/CourseCard.vue'
import AchievementBadge from '@/components/achievements/AchievementBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'

const auth = useAuthStore()
const catalog = useCatalogStore()
const achievements = useAchievementsStore()

const loading = ref(true)
const lessonsIndex = ref<LessonSummary[]>([])
const activity = ref<ActivityEntry[]>([])

const firstName = computed(() => auth.displayName.split(' ')[0])
const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
})

const resume = computed(() => {
  const e = catalog.enrolledCourses
    .map((c) => ({ course: c, enrollment: catalog.enrollmentFor(c.id)! }))
    .find((x) => !x.enrollment.completed_at && x.enrollment.last_lesson_id)
  if (!e) return null
  const lesson = lessonsIndex.value.find((l) => l.id === e.enrollment.last_lesson_id)
  return lesson ? { ...e, lesson } : null
})

const lessonTitle = (id: string | null) => lessonsIndex.value.find((l) => l.id === id)?.title
const courseTitle = (id: string | null) => catalog.courses.find((c) => c.id === id)?.title
const achievementTitle = (id: string | null) => achievements.all.find((a) => a.id === id)?.title

function activityText(a: ActivityEntry): string {
  const pct = (a.meta as { pct?: number } | null)?.pct
  switch (a.kind) {
    case 'lesson_completed':
      return `Concluiu a aula ${lessonTitle(a.ref_id) ?? ''}`.trim()
    case 'assessment_passed':
      return `Aprovado em avaliação${pct !== undefined ? ` com ${pct}%` : ''}`
    case 'assessment_failed':
      return `Tentativa em avaliação${pct !== undefined ? ` (${pct}%)` : ''}`
    case 'course_completed':
      return `Concluiu o curso ${courseTitle(a.ref_id) ?? ''}`.trim()
    case 'achievement':
      return `Conquista: ${achievementTitle(a.ref_id) ?? ''}`.trim()
    case 'enrolled':
      return `Matrícula em ${courseTitle(a.ref_id) ?? 'curso'}`
    default:
      return a.kind
  }
}

onMounted(async () => {
  try {
    const [, , idx, act] = await Promise.all([
      catalog.load(),
      achievements.load(),
      fetchLessonsIndex(),
      fetchRecentActivity(8),
      auth.refreshStats(),
    ])
    lessonsIndex.value = idx
    activity.value = act
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container page">
    <div class="page-head">
      <div>
        <span class="eyebrow">{{ greeting }}</span>
        <h1>{{ firstName }}</h1>
      </div>
      <RouterLink to="/cursos" class="btn btn--outline"><BookOpen /> Explorar cursos</RouterLink>
    </div>

    <LoadingBlock v-if="loading" text="Carregando seu painel" />

    <template v-else>
      <div class="grid dash-top">
        <div class="card">
          <LevelBar :xp="auth.stats?.xp ?? 0" />
        </div>
        <div class="grid grid--stats">
          <StatTile :icon="Flame" label="Dias seguidos" :value="auth.stats?.current_streak ?? 0" variant="warning" :hint="`recorde ${auth.stats?.longest_streak ?? 0}`" />
          <StatTile :icon="CircleCheck" label="Aulas concluídas" :value="auth.stats?.lessons_completed ?? 0" />
          <StatTile :icon="Award" label="Avaliações aprovadas" :value="auth.stats?.assessments_passed ?? 0" variant="info" />
          <StatTile :icon="GraduationCap" label="Cursos concluídos" :value="auth.stats?.courses_completed ?? 0" variant="accent" />
        </div>
      </div>

      <section v-if="resume" class="card resume">
        <div class="resume__text">
          <span class="eyebrow">Continuar de onde parou</span>
          <h2 style="margin: 4px 0 2px">{{ resume.lesson.title }}</h2>
          <p class="muted" style="margin: 0 0 10px">{{ resume.course.title }}</p>
          <ProgressBar :value="resume.enrollment.progress_pct" size="sm" label />
        </div>
        <RouterLink :to="`/cursos/${resume.course.slug}/aulas/${resume.lesson.slug}`" class="btn btn--primary btn--lg">
          <Play /> Continuar aula
        </RouterLink>
      </section>

      <div class="section-title">
        <h2>Meus cursos</h2>
        <RouterLink to="/cursos" class="small">Ver todos</RouterLink>
      </div>
      <div v-if="catalog.enrolledCourses.length" class="grid grid--cards">
        <CourseCard v-for="c in catalog.enrolledCourses" :key="c.id" :course="c" :enrollment="catalog.enrollmentFor(c.id)" />
      </div>
      <div v-else class="card">
        <EmptyState :icon="BookOpen" title="Você ainda não está em nenhum curso" text="Escolha um curso no catálogo para começar a estudar.">
          <RouterLink to="/cursos" class="btn btn--primary">Ver catálogo</RouterLink>
        </EmptyState>
      </div>

      <div class="grid dash-bottom">
        <section>
          <div class="section-title">
            <h2>Conquistas recentes</h2>
            <RouterLink to="/conquistas" class="small">{{ achievements.earnedCount }} de {{ achievements.all.length }}</RouterLink>
          </div>
          <div class="card">
            <div v-if="achievements.recent.length" class="badges">
              <RouterLink v-for="r in achievements.recent.slice(0, 6)" :key="r.achievement_id" to="/conquistas" class="badges__item" :title="r.achievement!.title">
                <AchievementBadge :achievement="r.achievement!" earned :size="56" />
                <span>{{ r.achievement!.title }}</span>
              </RouterLink>
            </div>
            <EmptyState v-else :icon="Trophy" title="Nenhuma conquista ainda" text="Conclua sua primeira aula para desbloquear a primeira." />
          </div>
        </section>

        <section>
          <div class="section-title"><h2>Atividade recente</h2></div>
          <div class="card">
            <ul v-if="activity.length" class="activity">
              <li v-for="a in activity" :key="a.id">
                <span class="activity__dot" :class="`activity__dot--${a.kind}`"></span>
                <span class="grow">{{ activityText(a) }}</span>
                <span v-if="a.xp" class="badge badge--accent"><Sparkles /> +{{ formatNumber(a.xp) }}</span>
                <span class="hint">{{ relativeTime(a.created_at) }}</span>
              </li>
            </ul>
            <EmptyState v-else :icon="Sparkles" title="Sem atividade ainda" text="Seu histórico aparece aqui conforme você estuda." />
          </div>
        </section>
      </div>
    </template>
  </div>
</template>

<style scoped>
.dash-top {
  grid-template-columns: 1fr;
  margin-bottom: 20px;
}

@media (min-width: 1024px) {
  .dash-top {
    grid-template-columns: 1.1fr 2fr;
    align-items: stretch;
  }
}

.resume {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 8px;
  border-color: color-mix(in srgb, var(--primary) 40%, var(--border));
  background:
    radial-gradient(70% 120% at 100% 0%, var(--primary-soft), transparent 60%),
    var(--surface);
}

.resume__text {
  flex: 1;
  min-width: 240px;
}

.eyebrow {
  display: block;
  color: var(--muted);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.dash-bottom {
  grid-template-columns: 1fr;
  margin-top: 8px;
}

@media (min-width: 1024px) {
  .dash-bottom {
    grid-template-columns: 1fr 1fr;
  }
}

.badges {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(84px, 1fr));
  gap: 12px;
}

.badges__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
  font-size: 0.72rem;
  color: var(--text-2);
  text-decoration: none;
}

.activity {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 0.9rem;
}

.activity li {
  display: flex;
  align-items: center;
  gap: 10px;
}

.activity__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--muted);
  flex: none;
}

.activity__dot--lesson_completed,
.activity__dot--assessment_passed,
.activity__dot--course_completed {
  background: var(--primary);
}

.activity__dot--achievement {
  background: var(--warning);
}

.activity__dot--assessment_failed {
  background: var(--danger);
}
</style>
