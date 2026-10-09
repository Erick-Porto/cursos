<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Slide } from '@/lib/markdown'

const props = defineProps<{ slides: Slide[]; index: number }>()
const emit = defineEmits<{ prev: []; next: [] }>()

const current = computed(() => props.slides[props.index])
const direction = ref<'next' | 'prev'>('next')
watch(
  () => props.index,
  (n, o) => {
    direction.value = n >= (o ?? 0) ? 'next' : 'prev'
  },
)

// deslize no toque
let startX = 0
let startY = 0
function onTouchStart(e: TouchEvent) {
  startX = e.touches[0].clientX
  startY = e.touches[0].clientY
}
function onTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0].clientX - startX
  const dy = e.changedTouches[0].clientY - startY
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
    if (dx < 0) emit('next')
    else emit('prev')
  }
}

// botão "Copiar" dos blocos de código (HTML vindo do markdown)
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
</script>

<template>
  <div class="viewer" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd" @click="onClick">
    <Transition :name="direction === 'next' ? 'slide-left' : 'slide-right'" mode="out-in">
      <article
        v-if="current"
        :key="current.index"
        class="slide md"
        :class="{ 'slide--cover': current.isCover }"
        v-html="current.html"
      ></article>
    </Transition>
  </div>
</template>

<style scoped>
.viewer {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: column;
}

.slide {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px var(--gutter) 40px;
  flex: 1;
}

@media (min-width: 768px) {
  .slide {
    padding: 36px 32px 56px;
    font-size: 1.08rem;
  }
}

@media (min-width: 1280px) {
  .slide {
    max-width: 980px;
    font-size: 1.12rem;
  }
}

.slide--cover {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  min-height: 100%;
}

.slide--cover :deep(h1) {
  font-size: clamp(1.9rem, 4vw + 1rem, 3.2rem);
  background: linear-gradient(90deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 0.4em;
}

.slide--cover :deep(h1 .icon-inline) {
  color: var(--primary);
}

.slide--cover :deep(p) {
  color: var(--text-2);
  font-size: 1.1em;
}

.slide :deep(h2:first-child) {
  padding-bottom: 10px;
  margin-bottom: 18px;
  border-bottom: 1px solid var(--border);
  position: relative;
}

.slide :deep(h2:first-child)::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 64px;
  height: 3px;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--primary), var(--accent));
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: opacity var(--t) var(--ease), transform var(--t) var(--ease);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(24px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-24px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(24px);
}
</style>
