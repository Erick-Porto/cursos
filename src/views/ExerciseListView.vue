<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { ArrowLeft, ArrowRight, BookOpen, CircleCheck, ClipboardList, Lock } from 'lucide-vue-next'
import { useCatalogStore } from '@/stores/catalog'
import { useToastStore } from '@/stores/toast'
import { fetchCourseBySlug, fetchExerciseContent, fetchExerciseList, fetchMyExerciseAnswers } from '@/lib/api'
import { courseMaterialBase, renderMarkdown } from '@/lib/markdown'
import { courseAssetBase, friendlyError } from '@/lib/supabase'
import { copyCodeBlock, exerciseState, groupTopics, isExerciseDone } from '@/lib/exercises'
import type { Course, Exercise, ExerciseAnswer, ExerciseList, ExerciseTopic } from '@/types/db'
import ExerciseCard from '@/components/exercises/ExerciseCard.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const route = useRoute()
const router = useRouter()
const catalog = useCatalogStore()
const toast = useToastStore()

const courseSlug = computed(() => String(route.params.course))
const listSlug = computed(() => String(route.params.list))

const course = ref<Course | null>(null)
const list = ref<ExerciseList | null>(null)
const topics = ref<ExerciseTopic[]>([])
const exercises = ref<Exercise[]>([])
const answers = ref<ExerciseAnswer[]>([])
const loading = ref(true)
const notFound = ref(false)

const enrollment = computed(() => (course.value ? catalog.enrollmentFor(course.value.id) : undefined))
const answerByExercise = computed(() => new Map(answers.value.map((a) => [a.exercise_id, a])))
const modules = computed(() => groupTopics(topics.value))

const exercisesByTopic = computed(() => {
  const map = new Map<string, Exercise[]>()
  for (const x of exercises.value) {
    const group = map.get(x.topic_id)
    if (group) group.push(x)
    else map.set(x.topic_id, [x])
  }
  return map
})

const isDone = (x: Exercise) => isExerciseDone(exerciseState(x, answerByExercise.value.get(x.id)))
const doneTotal = computed(() => exercises.value.filter(isDone).length)
const pctDone = computed(() => (exercises.value.length ? (100 * doneTotal.value) / exercises.value.length : 0))
const topicDone = (t: ExerciseTopic) => (exercisesByTopic.value.get(t.id) ?? []).filter(isDone).length
const topicSize = (t: ExerciseTopic) => exercisesByTopic.value.get(t.id)?.length ?? 0
const isTopicComplete = (t: ExerciseTopic) => topicSize(t) > 0 && topicDone(t) === topicSize(t)

// ---- tema aberto: fica no endereço, para voltar ao mesmo lugar ----
const currentIndex = computed(() => {
  const i = topics.value.findIndex((t) => t.slug === route.query.tema)
  if (i >= 0) return i
  const firstOpen = topics.value.findIndex((t) => !isTopicComplete(t))
  return firstOpen >= 0 ? firstOpen : 0
})
const current = computed(() => topics.value[currentIndex.value] ?? null)
const previous = computed(() => topics.value[currentIndex.value - 1] ?? null)
const next = computed(() => topics.value[currentIndex.value + 1] ?? null)
const currentExercises = computed(() => (current.value ? (exercisesByTopic.value.get(current.value.id) ?? []) : []))

const contentTop = ref<HTMLElement | null>(null)

async function openTopic(slug: string) {
  await router.push({ query: { ...route.query, tema: slug } })
  await nextTick()
  contentTop.value?.scrollIntoView({ block: 'start' })
}

const renderOptions = computed(() =>
  course.value ? { assetBase: courseAssetBase(course.value.slug), materialBase: courseMaterialBase(course.value.slug) } : {},
)
const introHtml = computed(() => renderMarkdown(list.value?.intro_md ?? '', renderOptions.value))
const recapHtml = computed(() => renderMarkdown(current.value?.recap_md ?? '', renderOptions.value))

function onSaved(answer: ExerciseAnswer) {
  const others = answers.value.filter((a) => a.exercise_id !== answer.exercise_id)
  answers.value = [...others, answer]
}

async function load() {
  loading.value = true
  notFound.value = false
  try {
    await catalog.load()
    const c = catalog.courseBySlug(courseSlug.value) ?? (await fetchCourseBySlug(courseSlug.value))
    const l = c ? await fetchExerciseList(c.id, listSlug.value) : null
    if (!c || !l) {
      notFound.value = true
      return
    }
    course.value = c
    list.value = l
    document.title = `${l.title} · Cursos`
    const content = await fetchExerciseContent(l.id)
    topics.value = content.topics
    exercises.value = content.exercises
    answers.value = catalog.enrollmentFor(c.id) ? await fetchMyExerciseAnswers(l.id) : []
  } catch (e) {
    toast.error('Erro ao carregar a lista', friendlyError(e))
  } finally {
    loading.value = false
  }
}

watch([courseSlug, listSlug], load)
onMounted(load)
</script>

<template>
  <div class="container page" @click="copyCodeBlock">
    <RouterLink :to="`/cursos/${courseSlug}`" class="btn btn--ghost btn--sm" style="margin-bottom: 12px"><ArrowLeft /> Voltar ao curso</RouterLink>

    <LoadingBlock v-if="loading" text="Carregando exercícios" />

    <div v-else-if="notFound || !list || !course" class="card">
      <EmptyState :icon="ClipboardList" title="Lista não encontrada" text="Ela pode ter saído do curso ou o endereço está errado.">
        <RouterLink :to="`/cursos/${courseSlug}`" class="btn btn--primary">Ver o curso</RouterLink>
      </EmptyState>
    </div>

    <template v-else>
      <section class="hero card">
        <span class="hero__eyebrow">{{ course.title }}</span>
        <h1 class="hero__title">{{ list.title }}</h1>
        <div class="md hero__intro" v-html="introHtml"></div>
        <div v-if="enrollment" class="hero__progress">
          <div class="row between small">
            <span>{{ doneTotal }} de {{ exercises.length }} exercícios feitos</span>
            <strong>{{ Math.round(pctDone) }}%</strong>
          </div>
          <ProgressBar :value="pctDone" variant="gradient" />
        </div>
        <p v-else class="hero__locked">
          <Lock aria-hidden="true" /> Matricule-se no curso para entregar os exercícios.
          <RouterLink :to="`/cursos/${course.slug}`">Ir para o curso</RouterLink>
        </p>
      </section>

      <div v-if="!topics.length" class="card">
        <EmptyState :icon="ClipboardList" title="Lista em preparação" text="Os exercícios desta lista ainda não foram publicados." />
      </div>

      <div v-else class="layout">
        <!-- celular: o índice vira uma caixa de seleção -->
        <div class="picker">
          <label class="picker__label" for="tema">Tema</label>
          <select id="tema" class="input" :value="current?.slug" @change="openTopic(($event.target as HTMLSelectElement).value)">
            <template v-for="m in modules" :key="m.key">
              <optgroup v-for="l in m.lessons" :key="l.key" :label="l.title">
                <option v-for="t in l.topics" :key="t.id" :value="t.slug">{{ t.title }} ({{ topicDone(t) }}/{{ topicSize(t) }})</option>
              </optgroup>
            </template>
          </select>
        </div>

        <!-- desktop: índice lateral por módulo e aula -->
        <nav class="index card" aria-label="Temas da lista">
          <section v-for="m in modules" :key="m.key" class="index__module">
            <h2 class="index__title">{{ m.title }}</h2>
            <div v-for="l in m.lessons" :key="l.key" class="index__lesson">
              <h3 class="index__subtitle">{{ l.title }}</h3>
              <ul class="index__list">
                <li v-for="t in l.topics" :key="t.id">
                  <RouterLink
                    class="index__link"
                    :class="{ 'is-active': current?.id === t.id, 'is-complete': isTopicComplete(t) }"
                    :to="{ query: { tema: t.slug } }"
                    :aria-current="current?.id === t.id ? 'true' : undefined"
                  >
                    <span class="index__name">{{ t.title }}</span>
                    <CircleCheck v-if="isTopicComplete(t)" class="index__check" aria-label="Tema concluído" />
                    <span v-else class="index__count">{{ topicDone(t) }}/{{ topicSize(t) }}</span>
                  </RouterLink>
                </li>
              </ul>
            </div>
          </section>
        </nav>

        <main v-if="current" ref="contentTop" class="content stack">
          <section class="card topic">
            <span class="topic__lesson"><BookOpen aria-hidden="true" /> {{ current.lesson_title }}</span>
            <h2 class="topic__title">{{ current.title }}</h2>
            <div v-if="current.recap_md" class="md topic__recap" v-html="recapHtml"></div>
          </section>

          <ExerciseCard
            v-for="(x, i) in currentExercises"
            :key="x.id"
            :exercise="x"
            :number="i + 1"
            :answer="answerByExercise.get(x.id) ?? null"
            :readonly="!enrollment"
            @saved="onSaved"
          />

          <nav class="pager" aria-label="Navegar entre os temas">
            <button v-if="previous" class="btn btn--outline" type="button" @click="openTopic(previous.slug)">
              <ArrowLeft /> <span class="pager__text">{{ previous.title }}</span>
            </button>
            <button v-if="next" class="btn btn--primary pager__next" type="button" @click="openTopic(next.slug)">
              <span class="pager__text">{{ next.title }}</span> <ArrowRight />
            </button>
          </nav>
        </main>
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
.hero__intro {
  max-width: 75ch;
  color: var(--text-2);
}
.hero__progress {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 520px;
  margin-top: 4px;
}
.hero__locked {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin: 4px 0 0;
  color: var(--text-2);
}
.hero__locked svg {
  width: 16px;
  height: 16px;
}

.layout {
  display: grid;
  gap: 16px;
  grid-template-columns: minmax(0, 1fr);
}
.picker {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.picker__label {
  color: var(--text-2);
  font-size: 0.85rem;
  font-weight: 600;
}
.index {
  display: none;
}

@media (min-width: 1024px) {
  .layout {
    grid-template-columns: 300px minmax(0, 1fr);
    align-items: start;
  }
  .picker {
    display: none;
  }
  .index {
    display: flex;
    flex-direction: column;
    gap: 18px;
    position: sticky;
    top: calc(var(--header-h) + 16px);
    max-height: calc(100vh - var(--header-h) - 32px);
    overflow-y: auto;
    padding: 14px;
  }
}

.index__title {
  margin: 0 0 8px;
  color: var(--primary);
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.index__lesson + .index__lesson {
  margin-top: 12px;
}
.index__subtitle {
  margin: 0 0 4px;
  color: var(--text-2);
  font-size: 0.82rem;
  font-weight: 600;
}
.index__list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.index__link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 8px;
  border-radius: var(--radius-sm);
  color: var(--text);
  font-size: 0.875rem;
  text-decoration: none;
}
.index__link:hover {
  background: var(--surface-2);
}
.index__link.is-active {
  background: var(--primary-soft);
  color: var(--primary);
  font-weight: 600;
}
.index__name {
  min-width: 0;
}
.index__count {
  flex: none;
  color: var(--muted);
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
}
.index__check {
  flex: none;
  width: 16px;
  height: 16px;
  color: var(--primary);
}

.content {
  min-width: 0;
  scroll-margin-top: calc(var(--header-h) + 12px);
}
.topic {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.topic__lesson {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--muted);
  font-size: 0.82rem;
  font-weight: 600;
}
.topic__lesson svg {
  width: 15px;
  height: 15px;
}
.topic__title {
  margin: 0;
  font-size: 1.35rem;
}
.topic__recap {
  color: var(--text-2);
}

.pager {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 4px;
}
.pager .btn {
  max-width: 100%;
}
.pager__next {
  margin-left: auto;
}
.pager__text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
