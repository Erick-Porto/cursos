<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, CircleCheck, ClipboardList, FileText, List, Lock, Maximize, Minimize, Moon, Sun,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useCatalogStore } from '@/stores/catalog'
import { useAchievementsStore } from '@/stores/achievements'
import { useToastStore } from '@/stores/toast'
import { useThemeStore } from '@/stores/theme'
import { fetchClassScripts, fetchCourseStructure, fetchLesson, fetchLessonProgress, trackLessonProgress } from '@/lib/api'
import { courseMaterialBase, renderLesson, type Slide } from '@/lib/markdown'
import { courseAssetBase, friendlyError } from '@/lib/supabase'
import type { Assessment, ClassScript, Course, Lesson, LessonProgress, LessonSummary, TrackResult } from '@/types/db'
import SlideViewer from '@/components/player/SlideViewer.vue'
import SlideSidebar from '@/components/player/SlideSidebar.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const catalog = useCatalogStore()
const achievements = useAchievementsStore()
const toast = useToastStore()
const theme = useThemeStore()

const courseSlug = computed(() => String(route.params.course))
const lessonSlug = computed(() => String(route.params.lesson))

const course = ref<Course | null>(null)
const lesson = ref<Lesson | null>(null)
const slides = ref<Slide[]>([])
const lessons = ref<LessonSummary[]>([])
const assessments = ref<Assessment[]>([])
const scripts = ref<ClassScript[]>([]) // roteiros do instrutor (vazio para alunos)
const progress = ref<LessonProgress | null>(null)

const index = ref(0)
const maxSlide = ref(0)
const loading = ref(true)
const error = ref('')
const notEnrolled = ref(false)
const enrolling = ref(false)
const completing = ref(false)
const sidebarOpen = ref(false)
const sidebarPinned = ref(true)
const fullscreen = ref(false)

const total = computed(() => slides.value.length)
const isLast = computed(() => total.value > 0 && index.value === total.value - 1)
const completed = computed(() => progress.value?.status === 'completed')
const lessonIndex = computed(() => lessons.value.findIndex((l) => l.id === lesson.value?.id))
const nextLesson = computed(() => lessons.value[lessonIndex.value + 1] ?? null)
const lessonQuiz = computed(() => assessments.value.find((a) => a.lesson_id === lesson.value?.id) ?? null)
const lessonScript = computed(() => scripts.value.find((s) => s.lesson_slugs.includes(lessonSlug.value)) ?? null)
const pct = computed(() => (total.value ? ((index.value + 1) / total.value) * 100 : 0))

// ---- tempo de estudo (só conta com a aba visível) ----
let lastTick = Date.now()
let pendingSeconds = 0
function tick() {
  const now = Date.now()
  if (document.visibilityState === 'visible') pendingSeconds += Math.min(60, Math.round((now - lastTick) / 1000))
  lastTick = now
}

// ---- salvar progresso ----
let saveTimer: number | undefined
function scheduleSave(delay = 1500) {
  window.clearTimeout(saveTimer)
  saveTimer = window.setTimeout(() => void save(), delay)
}

async function save(complete = false): Promise<TrackResult | undefined> {
  if (!lesson.value || notEnrolled.value || !total.value) return
  tick()
  const seconds = pendingSeconds
  pendingSeconds = 0
  try {
    const res = await trackLessonProgress({
      lessonId: lesson.value.id,
      slide: index.value,
      slideCount: total.value,
      seconds,
      complete,
    })
    progress.value = res.progress
    catalog.applyEnrollment(res.enrollment)
    if (complete) {
      toast.celebrate(res)
      achievements.markEarned(res.new_achievements)
      await auth.refreshStats()
    }
    return res
  } catch (e) {
    pendingSeconds += seconds
    if (complete) toast.error('Não foi possível concluir a aula', friendlyError(e))
    return undefined
  }
}

function goTo(i: number) {
  if (i < 0 || i >= total.value || i === index.value) return
  index.value = i
  maxSlide.value = Math.max(maxSlide.value, i)
  sidebarOpen.value = false
  router.replace({ query: { ...route.query, slide: String(i + 1) } })
  scheduleSave()
}
const next = () => goTo(index.value + 1)
const prev = () => goTo(index.value - 1)

async function complete() {
  completing.value = true
  await save(true)
  completing.value = false
}

function toggleSidebar() {
  if (window.matchMedia('(min-width: 1024px)').matches) {
    sidebarPinned.value = !sidebarPinned.value
    try {
      localStorage.setItem('cursos:sidebar', sidebarPinned.value ? 'on' : 'off')
    } catch {
      /* ignorar */
    }
  } else {
    sidebarOpen.value = !sidebarOpen.value
  }
}

function toggleFullscreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.()
  else document.exitFullscreen?.()
}
const onFsChange = () => (fullscreen.value = Boolean(document.fullscreenElement))

function onKey(e: KeyboardEvent) {
  const tag = (e.target as HTMLElement)?.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || e.metaKey || e.ctrlKey || e.altKey) return
  switch (e.key) {
    case 'ArrowRight':
    case 'PageDown':
    case ' ':
      e.preventDefault()
      next()
      break
    case 'ArrowLeft':
    case 'PageUp':
      e.preventDefault()
      prev()
      break
    case 'Home':
      goTo(0)
      break
    case 'End':
      goTo(total.value - 1)
      break
    case 'Escape':
      sidebarOpen.value = false
      break
    case 'f':
    case 'F':
      toggleFullscreen()
      break
  }
}

async function load() {
  loading.value = true
  error.value = ''
  notEnrolled.value = false
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
    const [l, s] = await Promise.all([fetchLesson(c.id, lessonSlug.value), fetchCourseStructure(c.id)])
    if (!l) {
      error.value = 'Aula não encontrada.'
      return
    }
    lesson.value = l
    lessons.value = s.lessons
    assessments.value = s.assessments
    // o roteiro do encontro só interessa a quem dá a aula; carrega sem atrasar os slides
    if (auth.isStaff) void fetchClassScripts(c.id).then((list) => (scripts.value = list)).catch(() => {})
    slides.value = renderLesson(l.content_md, {
      assetBase: courseAssetBase(c.slug),
      materialBase: courseMaterialBase(c.slug),
    })
    progress.value = await fetchLessonProgress(l.id)

    const q = Number(route.query.slide)
    const start =
      q >= 1 && q <= total.value ? q - 1 : Math.min(progress.value?.last_slide ?? 0, Math.max(0, total.value - 1))
    index.value = start
    maxSlide.value = Math.max(progress.value?.max_slide ?? 0, start)
    document.title = `${l.title} · ${c.title}`
    lastTick = Date.now()
    pendingSeconds = 0
    if (!progress.value) scheduleSave(400)
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

let ticker: number | undefined
onMounted(() => {
  try {
    sidebarPinned.value = localStorage.getItem('cursos:sidebar') !== 'off'
  } catch {
    /* ignorar */
  }
  window.addEventListener('keydown', onKey)
  document.addEventListener('fullscreenchange', onFsChange)
  document.addEventListener('visibilitychange', tick)
  ticker = window.setInterval(tick, 15000)
  void load()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.removeEventListener('fullscreenchange', onFsChange)
  document.removeEventListener('visibilitychange', tick)
  window.clearInterval(ticker)
  window.clearTimeout(saveTimer)
  void save()
})

watch([courseSlug, lessonSlug], async () => {
  await save()
  await load()
})
</script>

<template>
  <div class="player" :class="{ 'is-pinned': sidebarPinned, 'is-fullscreen': fullscreen }">
    <header class="player__bar">
      <RouterLink :to="`/cursos/${courseSlug}`" class="btn btn--ghost btn--icon" aria-label="Voltar ao curso"><ArrowLeft /></RouterLink>
      <div class="player__titles">
        <div class="player__course">{{ course?.title }}</div>
        <div class="player__lesson">{{ lesson?.title ?? 'Aula' }}</div>
      </div>
      <span v-if="total" class="player__count mono">{{ index + 1 }}/{{ total }}</span>
      <RouterLink
        v-if="lessonScript && course"
        :to="`/instrutor/roteiros/${course.slug}/${lessonScript.slug}`"
        class="btn btn--ghost btn--icon"
        aria-label="Roteiro do instrutor"
        title="Roteiro do instrutor"
      >
        <ClipboardList />
      </RouterLink>
      <button class="btn btn--ghost btn--icon" type="button" aria-label="Sumário" @click="toggleSidebar"><List /></button>
      <button class="btn btn--ghost btn--icon hide-mobile" type="button" :aria-label="fullscreen ? 'Sair da tela cheia' : 'Tela cheia'" @click="toggleFullscreen">
        <Minimize v-if="fullscreen" />
        <Maximize v-else />
      </button>
      <button class="btn btn--ghost btn--icon hide-mobile" type="button" aria-label="Alternar tema" @click="theme.toggle()">
        <Sun v-if="theme.theme === 'dark'" />
        <Moon v-else />
      </button>
      <div class="player__progress"><span :style="{ width: pct + '%' }"></span></div>
    </header>

    <div class="player__body">
      <aside v-if="!loading && lesson" class="player__side" :class="{ 'is-open': sidebarOpen }">
        <SlideSidebar :slides="slides" :index="index" :max-slide="maxSlide" :title="lesson.title" @select="goTo" />
      </aside>
      <div v-if="sidebarOpen" class="player__backdrop" @click="sidebarOpen = false"></div>

      <div class="player__main">
        <LoadingBlock v-if="loading" text="Preparando a aula" />

        <div v-else-if="notEnrolled" class="player__msg">
          <Lock />
          <h2>Matricule-se para assistir</h2>
          <p class="muted">Esta aula faz parte de <strong>{{ course?.title }}</strong>. A matrícula é gratuita e registra seu progresso.</p>
          <button class="btn btn--primary btn--lg" type="button" :disabled="enrolling" @click="enroll">{{ enrolling ? 'Matriculando…' : 'Matricular-se' }}</button>
        </div>

        <div v-else-if="error" class="player__msg">
          <h2>Ops</h2>
          <p class="muted">{{ error }}</p>
          <RouterLink :to="`/cursos/${courseSlug}`" class="btn btn--outline">Voltar ao curso</RouterLink>
        </div>

        <template v-else>
          <SlideViewer :slides="slides" :index="index" @next="next" @prev="prev" />

          <Transition name="fade">
            <div v-if="isLast" class="finish">
              <template v-if="!completed">
                <div class="grow">
                  <strong>Chegou ao fim da aula</strong>
                  <div class="small muted">Marque como concluída para registrar seu progresso e ganhar XP.</div>
                </div>
                <button class="btn btn--primary" type="button" :disabled="completing" @click="complete"><Check /> Concluir aula</button>
              </template>
              <template v-else>
                <div class="grow row"><CircleCheck style="color: var(--primary)" /> <strong>Aula concluída</strong></div>
                <div class="row wrap">
                  <RouterLink v-if="lessonQuiz" :to="`/cursos/${courseSlug}/avaliacoes/${lessonQuiz.slug}`" class="btn btn--primary btn--sm">
                    <FileText /> {{ lessonQuiz.kind === 'exam' ? 'Fazer prova' : 'Fazer quiz' }}
                  </RouterLink>
                  <RouterLink v-if="nextLesson" :to="`/cursos/${courseSlug}/aulas/${nextLesson.slug}`" class="btn btn--outline btn--sm">
                    Próxima aula <ArrowRight />
                  </RouterLink>
                  <RouterLink :to="`/cursos/${courseSlug}`" class="btn btn--ghost btn--sm">Voltar ao curso</RouterLink>
                </div>
              </template>
            </div>
          </Transition>
        </template>
      </div>
    </div>

    <footer v-if="!loading && lesson && !notEnrolled && !error" class="player__nav">
      <button class="btn btn--outline" type="button" :disabled="index === 0" @click="prev"><ChevronLeft /> <span class="hide-mobile">Anterior</span></button>
      <div class="player__dots" aria-hidden="true">
        <span v-for="s in slides" :key="s.index" :class="{ 'is-on': s.index <= index }" @click="goTo(s.index)"></span>
      </div>
      <button v-if="!isLast" class="btn btn--primary" type="button" @click="next"><span class="hide-mobile">Próximo</span> <ChevronRight /></button>
      <button v-else-if="!completed" class="btn btn--primary" type="button" :disabled="completing" @click="complete"><Check /> Concluir</button>
      <RouterLink v-else-if="lessonQuiz" :to="`/cursos/${courseSlug}/avaliacoes/${lessonQuiz.slug}`" class="btn btn--primary"><FileText /> Quiz</RouterLink>
      <RouterLink v-else-if="nextLesson" :to="`/cursos/${courseSlug}/aulas/${nextLesson.slug}`" class="btn btn--primary">Próxima <ArrowRight /></RouterLink>
      <RouterLink v-else :to="`/cursos/${courseSlug}`" class="btn btn--primary">Curso</RouterLink>
    </footer>
  </div>
</template>

<style scoped>
.player {
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
}

.player__bar {
  position: relative;
  flex: none;
  height: var(--header-h);
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px;
  background: var(--bg-elev);
  border-bottom: 1px solid var(--border);
}

.player__titles {
  flex: 1;
  min-width: 0;
  padding: 0 6px;
  line-height: 1.2;
}

.player__course {
  font-size: 0.68rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.player__lesson {
  font-weight: 700;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.player__count {
  font-size: 0.8rem;
  color: var(--muted);
  padding: 0 6px;
}

.player__progress {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 3px;
  background: var(--surface-3);
}

.player__progress span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--accent));
  transition: width var(--t) var(--ease);
}

.player__body {
  flex: 1;
  min-height: 0;
  display: flex;
  position: relative;
}

.player__side {
  position: fixed;
  top: var(--header-h);
  bottom: 0;
  left: 0;
  z-index: 30;
  width: min(320px, 85vw);
  background: var(--bg-elev);
  border-right: 1px solid var(--border);
  transform: translateX(-100%);
  transition: transform var(--t) var(--ease);
}

.player__side.is-open {
  transform: translateX(0);
}

.player__backdrop {
  position: fixed;
  inset: var(--header-h) 0 0 0;
  z-index: 25;
  background: rgba(0, 0, 0, 0.45);
}

.player__main {
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.player__msg {
  margin: auto;
  max-width: 440px;
  padding: 32px var(--gutter);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.player__msg svg {
  width: 40px;
  height: 40px;
  color: var(--muted);
}

.finish {
  flex: none;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin: 0 var(--gutter) 10px;
  padding: 12px 16px;
  border-radius: var(--radius-lg);
  background: var(--surface);
  border: 1px solid color-mix(in srgb, var(--primary) 45%, var(--border));
  box-shadow: var(--shadow-1);
}

.player__nav {
  flex: none;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px var(--gutter) calc(10px + env(safe-area-inset-bottom));
  background: var(--bg-elev);
  border-top: 1px solid var(--border);
}

.player__dots {
  flex: 1;
  display: flex;
  gap: 3px;
  justify-content: center;
  overflow: hidden;
}

.player__dots span {
  flex: 1;
  max-width: 18px;
  height: 4px;
  border-radius: 2px;
  background: var(--surface-3);
  cursor: pointer;
}

.player__dots span.is-on {
  background: var(--primary);
}

.hide-mobile {
  display: none;
}

@media (min-width: 768px) {
  .hide-mobile {
    display: inline-flex;
  }
}

@media (min-width: 1024px) {
  .player__side {
    position: static;
    transform: none;
    width: 0;
    overflow: hidden;
    border-right: 0;
    transition: width var(--t) var(--ease);
  }

  .is-pinned .player__side {
    width: 280px;
    border-right: 1px solid var(--border);
  }

  .player__backdrop {
    display: none;
  }

  .finish {
    margin: 0 24px 12px;
  }
}

.is-fullscreen .player__bar {
  border-bottom-color: transparent;
}
</style>
