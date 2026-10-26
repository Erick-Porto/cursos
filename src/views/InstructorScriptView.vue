<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ArrowLeft, ArrowRight, BookOpen, ClipboardList, Clock, Printer } from 'lucide-vue-next'
import { fetchClassScript, fetchClassScripts, fetchCourseBySlug, fetchCourseStructure } from '@/lib/api'
import { courseMaterialBase, renderMarkdown } from '@/lib/markdown'
import { courseAssetBase, friendlyError } from '@/lib/supabase'
import { formatMinutes } from '@/lib/format'
import type { ClassScript, Course, LessonSummary } from '@/types/db'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const route = useRoute()
const courseSlug = computed(() => String(route.params.course))
const scriptSlug = computed(() => String(route.params.script))

const course = ref<Course | null>(null)
const script = ref<ClassScript | null>(null)
const all = ref<ClassScript[]>([])
const lessons = ref<LessonSummary[]>([])
const loading = ref(true)
const error = ref('')

const html = computed(() =>
  script.value && course.value ? renderMarkdown(script.value.content_md, {
        assetBase: courseAssetBase(course.value.slug),
        materialBase: courseMaterialBase(course.value.slug),
      }) : '',
)
const scriptLessons = computed(() =>
  (script.value?.lesson_slugs ?? []).map((slug) => lessons.value.find((l) => l.slug === slug) ?? { slug, title: slug, id: slug }),
)
const index = computed(() => all.value.findIndex((s) => s.id === script.value?.id))
const previous = computed(() => (index.value > 0 ? all.value[index.value - 1] : null))
const next = computed(() => (index.value >= 0 ? (all.value[index.value + 1] ?? null) : null))

async function load() {
  loading.value = true
  error.value = ''
  try {
    const c = await fetchCourseBySlug(courseSlug.value)
    if (!c) {
      error.value = 'Curso não encontrado.'
      return
    }
    course.value = c
    const [s, list, structure] = await Promise.all([
      fetchClassScript(c.id, scriptSlug.value),
      fetchClassScripts(c.id),
      fetchCourseStructure(c.id),
    ])
    script.value = s
    all.value = list
    lessons.value = structure.lessons
    if (!s) error.value = 'Roteiro não encontrado.'
  } catch (e) {
    error.value = friendlyError(e)
  } finally {
    loading.value = false
  }
}

// Botão "Copiar" dos blocos de código (mesmo comportamento do player de slides).
async function onClick(e: MouseEvent) {
  const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-copy]')
  if (!btn) return
  const code = btn.closest('.code-block')?.querySelector('code')?.textContent ?? ''
  try {
    await navigator.clipboard.writeText(code)
    btn.textContent = 'Copiado'
    btn.setAttribute('data-done', '')
    setTimeout(() => {
      btn.textContent = 'Copiar'
      btn.removeAttribute('data-done')
    }, 1600)
  } catch {
    btn.textContent = 'Erro'
  }
}

function print() {
  window.print()
}

watch(() => [courseSlug.value, scriptSlug.value], () => void load())
onMounted(load)
</script>

<template>
  <div class="container page script-page">
    <LoadingBlock v-if="loading" text="Carregando roteiro" />

    <div v-else-if="error" class="card">
      <EmptyState :icon="ClipboardList" title="Roteiro indisponível" :text="error" />
      <div class="row" style="justify-content: center; margin-top: 12px">
        <RouterLink to="/instrutor" class="btn btn--outline"><ArrowLeft /> Voltar ao painel</RouterLink>
      </div>
    </div>

    <template v-else-if="script && course">
      <div class="page-head script-head">
        <div>
          <RouterLink to="/instrutor" class="eyebrow script-back"><ArrowLeft /> Roteiro do instrutor · {{ course.title }}</RouterLink>
          <h1>{{ script.title }}</h1>
          <p v-if="script.summary" class="hint script-summary">{{ script.summary }}</p>
        </div>
        <button class="btn btn--outline no-print" type="button" @click="print"><Printer /> Imprimir</button>
      </div>

      <div class="script-meta">
        <span v-if="script.duration_minutes" class="badge badge--info"><Clock /> {{ formatMinutes(script.duration_minutes) }}</span>
        <RouterLink
          v-for="l in scriptLessons"
          :key="l.slug"
          :to="`/cursos/${course.slug}/aulas/${l.slug}`"
          class="badge badge--primary script-lesson"
          :title="`Abrir a aula ${l.title} no player`"
        >
          <BookOpen /> {{ l.title }}
        </RouterLink>
      </div>

      <article class="card md script-body" @click="onClick" v-html="html"></article>

      <nav class="script-nav no-print" aria-label="Outros roteiros">
        <RouterLink v-if="previous" :to="`/instrutor/roteiros/${course.slug}/${previous.slug}`" class="btn btn--ghost">
          <ArrowLeft /> {{ previous.title }}
        </RouterLink>
        <span v-else></span>
        <RouterLink v-if="next" :to="`/instrutor/roteiros/${course.slug}/${next.slug}`" class="btn btn--ghost">
          {{ next.title }} <ArrowRight />
        </RouterLink>
      </nav>
    </template>
  </div>
</template>

<style scoped>
.script-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--muted);
  text-decoration: none;
}
.script-back:hover {
  color: var(--text);
}
.script-back svg {
  width: 14px;
  height: 14px;
}
.script-summary {
  margin: 6px 0 0;
  max-width: 70ch;
}
.script-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0 0 16px;
}
.script-lesson {
  text-decoration: none;
  cursor: pointer;
}
.script-lesson:hover {
  filter: brightness(1.1);
}
.script-body {
  padding: 20px;
}
.script-nav {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 20px;
}
.script-nav .btn {
  max-width: 48%;
  text-align: left;
}
@media (min-width: 900px) {
  .script-body {
    padding: 28px 32px;
  }
}
@media print {
  .no-print,
  :global(.topbar),
  :global(.sidenav),
  :global(.bottomnav) {
    display: none !important;
  }
  .script-body {
    border: 0;
    box-shadow: none;
    padding: 0;
  }
  .script-page {
    max-width: none;
    padding: 0;
  }
}
</style>
