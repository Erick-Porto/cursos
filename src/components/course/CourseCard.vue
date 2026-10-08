<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowRight, CircleCheck, Clock, Signal } from 'lucide-vue-next'
import { resolveIcon } from '@/lib/icons'
import { LEVEL_LABEL } from '@/lib/format'
import type { Course, Enrollment } from '@/types/db'
import ProgressBar from '@/components/ui/ProgressBar.vue'

const props = defineProps<{ course: Course; enrollment?: Enrollment | null }>()

const icon = computed(() => resolveIcon(props.course.icon))
const color = computed(() => props.course.color || 'var(--primary)')
const done = computed(() => Boolean(props.enrollment?.completed_at))
</script>

<template>
  <RouterLink :to="`/cursos/${course.slug}`" class="cc card" :style="{ '--cc': color }">
    <div class="cc__cover" :style="course.cover_url ? { backgroundImage: `url(${course.cover_url})` } : undefined">
      <span class="cc__icon"><component :is="icon" /></span>
      <span v-if="!course.is_published" class="badge badge--warning cc__draft">Rascunho</span>
      <span v-else-if="done" class="badge badge--primary cc__draft"><CircleCheck /> Concluído</span>
    </div>
    <div class="cc__body">
      <h3 class="cc__title">{{ course.title }}</h3>
      <p v-if="course.subtitle" class="cc__sub">{{ course.subtitle }}</p>
      <div class="row wrap cc__meta">
        <span v-if="course.level" class="badge"><Signal /> {{ LEVEL_LABEL[course.level] ?? course.level }}</span>
        <span v-if="course.estimated_hours" class="badge"><Clock /> {{ course.estimated_hours }} h</span>
        <span v-for="tag in course.tags.slice(0, 2)" :key="tag" class="badge">{{ tag }}</span>
      </div>
      <div v-if="enrollment" class="cc__progress">
        <ProgressBar :value="enrollment.progress_pct" size="sm" label />
      </div>
      <div class="cc__cta">
        <span>{{ enrollment ? (done ? 'Revisar' : 'Continuar') : 'Ver curso' }}</span>
        <ArrowRight />
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.cc {
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  color: inherit;
  text-decoration: none;
  transition: transform var(--t) var(--ease), border-color var(--t-fast);
}

.cc:hover {
  text-decoration: none;
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--cc) 50%, var(--border));
}

.cc__cover {
  position: relative;
  height: 108px;
  background:
    radial-gradient(80% 120% at 0% 0%, color-mix(in srgb, var(--cc) 45%, transparent), transparent 60%),
    linear-gradient(135deg, var(--surface-2), var(--surface-3));
  background-size: cover;
  background-position: center;
}

.cc__icon {
  position: absolute;
  left: 18px;
  bottom: -22px;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--cc);
  box-shadow: var(--shadow-1);
}

.cc__icon svg {
  width: 26px;
  height: 26px;
}

.cc__draft {
  position: absolute;
  top: 12px;
  right: 12px;
}

.cc__body {
  padding: 32px 18px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.cc__title {
  margin: 0;
  font-size: 1.08rem;
}

.cc__sub {
  margin: 0;
  color: var(--text-2);
  font-size: 0.9rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cc__meta {
  gap: 6px;
}

.cc__progress {
  margin-top: 4px;
}

.cc__cta {
  margin-top: auto;
  padding-top: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--cc);
  font-weight: 700;
  font-size: 0.9rem;
}

.cc__cta svg {
  width: 16px;
  height: 16px;
  transition: transform var(--t-fast);
}

.cc:hover .cc__cta svg {
  transform: translateX(3px);
}
</style>
