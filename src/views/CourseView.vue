<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  ArrowLeft, Award, BookOpen, Circle, CircleCheck, CirclePlay, Clock, FileText, Layers, Lock, Play, Signal, Trophy, UserRound,
} from 'lucide-vue-next'
import { useCatalogStore } from '@/stores/catalog'
import { useAchievementsStore } from '@/stores/achievements'
import { useToastStore } from '@/stores/toast'
import { fetchCourseBySlug, fetchCourseProgress, fetchCourseStructure } from '@/lib/api'
import { renderMarkdown } from '@/lib/markdown'
import { courseAssetBase, friendlyError } from '@/lib/supabase'
import { resolveIcon } from '@/lib/icons'
import { formatMinutes, formatPct, LEVEL_LABEL } from '@/lib/format'
import type { Achievement, Assessment, Attempt, Course, LessonProgress, LessonSummary, Module } from '@/types/db'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import AchievementBadge from '@/components/achievements/AchievementBadge.vue'

const route = useRoute()
const catalog = useCatalogStore()
const achievements = useAchievementsStore()
const toast = useToastStore()

const slug = computed(() => String(route.params.course))
const course = ref<Course | null>(null)
const modules = ref<Module[]>([])
const lessons = ref<LessonSummary[]>([])
const assessments = ref<Assessment[]>([])
const courseAchievements = ref<Achievement[]>([])
const progress = ref<LessonProgress[]>([])
const attempts = ref<Attempt[]>([])
const loading = ref(true)
const notFound = ref(false)
const enrolling = ref(false)

const enrollment = computed(() => (course.value ? catalog.enrollmentFor(course.value.id) : undefined))
const icon = computed(() => resolveIcon(course.value?.icon))
const color = computed(() => course.value?.color || 'var(--primary)')
const descriptionHtml = computed(() =>
  course.value ? renderMarkdown(course.value.description_md, { assetBase: courseAssetBase(course.value.slug) }) : '',
)

const progressByLesson = computed(() => new Map(progress.value.map((p) => [p.lesson_id, p])))
const bestByAssessment = computed(() => {
  const m = new Map<string, Attempt>()
  for (const a of attempts.value) {
    const cur = m.get(a.assessment_id)
    if (!cur || Number(a.pct) > Number(cur.pct)) m.set(a.assessment_id, a)
  }
  return m
})
const attemptsByAssessment = computed(() => {
  const m = new Map<string, number>()
  for (const a of attempts.value) m.set(a.assessment_id, (m.get(a.assessment_id) ?? 0) + 1)
  return m
})

const sections = computed(() => {
  const byModule = new Map<string | null, LessonSummary[]>()
  for (const l of lessons.value) {
    const list = byModule.get(l.module_id) ?? []
    list.push(l)
    byModule.set(l.module_id, list)
  }
  const out = modules.value.map((m) => ({ key: m.id, title: m.title, description: m.description, lessons: byModule.get(m.id) ?? [] }))
  if (byModule.has(null)) {
    out.push({ key: 'sem-modulo', title: modules.value.length ? 'Outras aulas' : 'Aulas', description: null, lessons: byModule.get(null)! })
  }
  return out.filter((s) => s.lessons.length)
})

const lessonAssessments = (lessonId: string) => assessments.value.filter((a) => a.lesson_id === lessonId)
const finalAssessments = computed(() => assessments.value.filter((a) => a.lesson_id === null))
const totalMinutes = computed(() => lessons.value.reduce((s, l) => s + (l.duration_minutes ?? 0), 0))
const completedCount = computed(() => progress.value.filter((p) => p.status === 'completed').length)

function lessonStatus(l: LessonSummary): 'completed' | 'in_progress' | 'not_started' {
  const p = progressByLesson.value.get(l.id)
  if (!p) return 'not_started'
  return p.status === 'completed' ? 'completed' : 'in_progress'
}

const nextLesson = computed(() => {
  if (!lessons.value.length) return null
  if (!enrollment.value) return lessons.value[0]
  const last = lessons.value.find((l) => l.id === enrollment.value!.last_lesson_id)
  if (last && lessonStatus(last) !== 'completed') return last
  return lessons.value.find((l) => lessonStatus(l) !== 'completed') ?? lessons.value[0]
})

async function loadProgress(courseId: string) {
  const p = await fetchCourseProgress(courseId)
  progress.value = p.progress
  attempts.value = p.attempts
}

async function load() {
  loading.value = true
  notFound.value = false
  try {
    await Promise.all([catalog.load(), achievements.load()])
    const c = catalog.courseBySlug(slug.value) ?? (await fetchCourseBySlug(slug.value))
    if (!c) {
      notFound.value = true
      return
    }
    course.value = c
    document.title = `${c.title} · Cursos`
    const s = await fetchCourseStructure(c.id)
    modules.value = s.modules
    lessons.value = s.lessons
    assessments.value = s.assessments
    courseAchievements.value = s.achievements
    if (catalog.enrollmentFor(c.id)) await loadProgress(c.id)
    else {
      progress.value = []
      attempts.value = []
    }
  } catch (e) {
    toast.error('Erro ao carregar o curso', friendlyError(e))
  } finally {
    loading.value = false
  }
}

async function enroll() {
  if (!course.value) return
  enrolling.value = true
  try {
    await catalog.enroll(course.value.id)
    await loadProgress(course.value.id)
    toast.success('Matrícula realizada', 'Bons estudos!')
  } catch (e) {
    toast.error('Não foi possível matricular', friendlyError(e))
  } finally {
    enrolling.value = false
  }
}

watch(slug, load)
onMounted(load)
</script>

<template>
  <div class="container page">
    <RouterLink to="/cursos" class="btn btn--ghost btn--sm" style="margin-bottom: 12px"><ArrowLeft /> Catálogo</RouterLink>

    <LoadingBlock v-if="loading" text="Carregando curso" />

    <div v-else-if="notFound" class="card">
      <EmptyState :icon="BookOpen" title="Curso não encontrado" text="Ele pode ter sido despublicado ou o endereço está errado.">
        <RouterLink to="/cursos" class="btn btn--primary">Ver catálogo</RouterLink>
      </EmptyState>
    </div>

    <template v-else-if="course">
      <section class="hero card" :style="{ '--cc': color }">
        <div class="hero__icon"><component :is="icon" /></div>
        <div class="hero__body">
          <div class="row wrap" style="gap: 6px; margin-bottom: 8px">
            <span v-if="course.level" class="badge"><Signal /> {{ LEVEL_LABEL[course.level] ?? course.level }}</span>
            <span class="badge"><Layers /> {{ lessons.length }} aulas</span>
            <span v-if="totalMinutes" class="badge"><Clock /> {{ formatMinutes(totalMinutes) }}</span>
            <span v-if="assessments.length" class="badge"><FileText /> {{ assessments.length }} avaliações</span>
            <span v-if="!course.is_published" class="badge badge--warning">Rascunho</span>
          </div>
          <h1 class="hero__title">{{ course.title }}</h1>
          <p v-if="course.subtitle" class="hero__sub">{{ course.subtitle }}</p>
          <div v-if="course.instructor_name" class="row small muted"><UserRound style="width: 16px; height: 16px" /> {{ course.instructor_name }}</div>

          <div v-if="enrollment" class="hero__progress">
            <div class="row between small">
              <span>{{ completedCount }} de {{ lessons.length }} aulas concluídas</span>
              <strong>{{ formatPct(enrollment.progress_pct) }}</strong>
            </div>
            <ProgressBar :value="enrollment.progress_pct" variant="gradient" />
          </div>

          <div class="row wrap" style="margin-top: 14px">
            <button v-if="!enrollment" class="btn btn--primary btn--lg" type="button" :disabled="enrolling" @click="enroll">
              <Play /> {{ enrolling ? 'Matriculando…' : 'Matricular-se' }}
            </button>
            <RouterLink v-else-if="nextLesson" :to="`/cursos/${course.slug}/aulas/${nextLesson.slug}`" class="btn btn--primary btn--lg">
              <Play /> {{ enrollment.completed_at ? 'Revisar' : completedCount ? 'Continuar' : 'Começar' }}
            </RouterLink>
            <span v-if="enrollment?.completed_at" class="badge badge--primary"><CircleCheck /> Curso concluído</span>
          </div>
        </div>
      </section>

      <div class="course-grid">
        <main class="stack">
          <section v-if="descriptionHtml" class="card md" v-html="descriptionHtml"></section>

          <section v-for="s in sections" :key="s.key" class="card" style="padding: 0">
            <header class="mod__head">
              <h2 class="mod__title">{{ s.title }}</h2>
              <p v-if="s.description" class="muted small" style="margin: 2px 0 0">{{ s.description }}</p>
            </header>
            <ol class="lessons">
              <li v-for="(l, i) in s.lessons" :key="l.id">
                <component
                  :is="enrollment ? RouterLink : 'div'"
                  :to="enrollment ? `/cursos/${course.slug}/aulas/${l.slug}` : undefined"
                  class="lesson"
                  :class="[`is-${lessonStatus(l)}`, { 'is-locked': !enrollment }]"
                >
                  <span class="lesson__status">
                    <Lock v-if="!enrollment" />
                    <CircleCheck v-else-if="lessonStatus(l) === 'completed'" />
                    <CirclePlay v-else-if="lessonStatus(l) === 'in_progress'" />
                    <Circle v-else />
                  </span>
                  <span class="lesson__body">
                    <span class="lesson__title">{{ i + 1 }}. {{ l.title }}</span>
                    <span v-if="l.summary" class="lesson__summary">{{ l.summary }}</span>
                    <span class="lesson__meta">
                      <span v-if="l.duration_minutes"><Clock /> {{ formatMinutes(l.duration_minutes) }}</span>
                      <span>{{ l.slide_count }} slides</span>
                      <span v-if="lessonStatus(l) === 'in_progress'">slide {{ (progressByLesson.get(l.id)?.last_slide ?? 0) + 1 }}</span>
                    </span>
                  </span>
                </component>

                <component
                  :is="enrollment ? RouterLink : 'div'"
                  v-for="a in lessonAssessments(l.id)"
                  :key="a.id"
                  :to="enrollment ? `/cursos/${course.slug}/avaliacoes/${a.slug}` : undefined"
                  class="lesson lesson--assessment"
                  :class="{ 'is-locked': !enrollment, 'is-completed': bestByAssessment.get(a.id)?.passed }"
                >
                  <span class="lesson__status">
                    <Lock v-if="!enrollment" />
                    <CircleCheck v-else-if="bestByAssessment.get(a.id)?.passed" />
                    <FileText v-else />
                  </span>
                  <span class="lesson__body">
                    <span class="lesson__title">{{ a.title }}</span>
                    <span class="lesson__meta">
                      <span>{{ a.kind === 'exam' ? 'Prova' : 'Quiz' }}</span>
                      <span>mínimo {{ formatPct(a.passing_score) }}</span>
                      <span v-if="bestByAssessment.get(a.id)">melhor nota {{ formatPct(bestByAssessment.get(a.id)!.pct, 1) }}</span>
                      <span v-if="attemptsByAssessment.get(a.id)">{{ attemptsByAssessment.get(a.id) }} tentativa(s)</span>
                    </span>
                  </span>
                </component>
              </li>
            </ol>
          </section>

          <section v-if="finalAssessments.length" class="card" style="padding: 0">
            <header class="mod__head"><h2 class="mod__title">Avaliação final</h2></header>
            <ol class="lessons">
              <li v-for="a in finalAssessments" :key="a.id">
                <component
                  :is="enrollment ? RouterLink : 'div'"
                  :to="enrollment ? `/cursos/${course.slug}/avaliacoes/${a.slug}` : undefined"
                  class="lesson lesson--assessment"
                  :class="{ 'is-locked': !enrollment, 'is-completed': bestByAssessment.get(a.id)?.passed }"
                >
                  <span class="lesson__status">
                    <Lock v-if="!enrollment" />
                    <CircleCheck v-else-if="bestByAssessment.get(a.id)?.passed" />
                    <Award v-else />
                  </span>
                  <span class="lesson__body">
                    <span class="lesson__title">{{ a.title }}</span>
                    <span v-if="a.description" class="lesson__summary">{{ a.description }}</span>
                    <span class="lesson__meta">
                      <span>{{ a.kind === 'exam' ? 'Prova' : 'Quiz' }}</span>
                      <span>mínimo {{ formatPct(a.passing_score) }}</span>
                      <span v-if="a.max_attempts">até {{ a.max_attempts }} tentativas</span>
                      <span v-if="a.time_limit_minutes">{{ a.time_limit_minutes }} min</span>
                      <span v-if="bestByAssessment.get(a.id)">melhor nota {{ formatPct(bestByAssessment.get(a.id)!.pct, 1) }}</span>
                    </span>
                  </span>
                </component>
              </li>
            </ol>
          </section>

          <div v-if="!sections.length" class="card">
            <EmptyState :icon="BookOpen" title="Conteúdo em preparação" text="As aulas deste curso ainda não foram publicadas." />
          </div>
        </main>

        <aside class="stack">
          <section v-if="courseAchievements.length" class="card">
            <h2 style="font-size: 1.05rem" class="row"><Trophy style="width: 18px; height: 18px" /> Conquistas do curso</h2>
            <ul class="ach-list">
              <li v-for="a in courseAchievements" :key="a.id" class="row">
                <AchievementBadge :achievement="a" :earned="achievements.isEarned(a.id)" :size="44" />
                <div class="grow">
                  <div style="font-weight: 600; font-size: 0.9rem">{{ a.title }}</div>
                  <div class="hint">{{ a.description }}</div>
                </div>
              </li>
            </ul>
          </section>

          <section v-if="enrollment && attempts.length" class="card">
            <h2 style="font-size: 1.05rem">Suas notas</h2>
            <ul class="scores">
              <li v-for="a in assessments.filter((x) => bestByAssessment.has(x.id))" :key="a.id" class="row between">
                <span class="small">{{ a.title }}</span>
                <span class="badge" :class="bestByAssessment.get(a.id)!.passed ? 'badge--primary' : 'badge--danger'">
                  {{ formatPct(bestByAssessment.get(a.id)!.pct, 1) }}
                </span>
              </li>
            </ul>
          </section>

          <section class="card">
            <h2 style="font-size: 1.05rem">Sobre</h2>
            <dl class="about">
              <div v-if="course.instructor_name"><dt>Instrutor</dt><dd>{{ course.instructor_name }}</dd></div>
              <div v-if="course.estimated_hours"><dt>Carga horária</dt><dd>{{ course.estimated_hours }} h</dd></div>
              <div><dt>Aulas</dt><dd>{{ lessons.length }}</dd></div>
              <div><dt>Avaliações</dt><dd>{{ assessments.length }}</dd></div>
              <div v-if="course.tags.length"><dt>Temas</dt><dd>{{ course.tags.join(', ') }}</dd></div>
            </dl>
          </section>
        </aside>
      </div>
    </template>
  </div>
</template>

<style scoped>
.hero {
  display: flex;
  gap: 18px;
  align-items: flex-start;
  margin-bottom: 18px;
  background:
    radial-gradient(70% 140% at 0% 0%, color-mix(in srgb, var(--cc) 22%, transparent), transparent 60%),
    var(--surface);
  border-color: color-mix(in srgb, var(--cc) 35%, var(--border));
}

.hero__icon {
  flex: none;
  width: 64px;
  height: 64px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: color-mix(in srgb, var(--cc) 18%, transparent);
  color: var(--cc);
}

.hero__icon svg {
  width: 32px;
  height: 32px;
}

.hero__body {
  flex: 1;
  min-width: 0;
}

.hero__title {
  margin: 0 0 4px;
}

.hero__sub {
  color: var(--text-2);
  margin: 0 0 8px;
  font-size: 1.05rem;
}

.hero__progress {
  margin-top: 14px;
  max-width: 520px;
}

@media (max-width: 600px) {
  .hero {
    flex-direction: column;
  }
}

.course-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
}

@media (min-width: 1024px) {
  .course-grid {
    grid-template-columns: 1fr 320px;
    align-items: start;
  }
}

.mod__head {
  padding: 16px 18px 12px;
  border-bottom: 1px solid var(--border);
}

.mod__title {
  margin: 0;
  font-size: 1.05rem;
}

.lessons {
  list-style: none;
  margin: 0;
  padding: 8px;
}

.lesson {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 12px;
  border-radius: var(--radius);
  color: inherit;
  text-decoration: none;
  transition: background var(--t-fast);
}

a.lesson:hover {
  background: var(--surface-2);
  text-decoration: none;
}

.lesson.is-locked {
  opacity: 0.7;
}

.lesson--assessment {
  margin-left: 20px;
  padding-top: 8px;
  padding-bottom: 8px;
}

.lesson__status {
  flex: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: var(--muted);
  background: var(--surface-2);
}

.lesson__status svg {
  width: 18px;
  height: 18px;
}

.is-completed .lesson__status {
  color: var(--primary);
  background: var(--primary-soft);
}

.is-in_progress .lesson__status {
  color: var(--accent);
  background: var(--accent-soft);
}

.lesson__body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.lesson__title {
  font-weight: 600;
}

.lesson__summary {
  color: var(--text-2);
  font-size: 0.88rem;
}

.lesson__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 0.75rem;
  color: var(--muted);
}

.lesson__meta span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.lesson__meta svg {
  width: 12px;
  height: 12px;
}

.ach-list,
.scores {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.about {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.9rem;
}

.about div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.about dt {
  color: var(--muted);
}

.about dd {
  margin: 0;
  font-weight: 600;
  text-align: right;
}
</style>
