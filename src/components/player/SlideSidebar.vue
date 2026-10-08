<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { Check } from 'lucide-vue-next'
import type { Slide } from '@/lib/markdown'

const props = defineProps<{ slides: Slide[]; index: number; maxSlide: number; title: string }>()
const emit = defineEmits<{ select: [index: number] }>()

const list = ref<HTMLElement | null>(null)

watch(
  () => props.index,
  async () => {
    await nextTick()
    list.value?.querySelector<HTMLElement>('.is-current')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  },
  { immediate: true },
)
</script>

<template>
  <nav class="sb" aria-label="Sumário da aula">
    <div class="sb__head">
      <div class="sb__title">{{ title }}</div>
      <div class="hint">{{ slides.length }} slides</div>
    </div>
    <ol ref="list" class="sb__list">
      <li v-for="s in slides" :key="s.index">
        <button
          type="button"
          class="sb__item"
          :class="{ 'is-current': s.index === index, 'is-visited': s.index < index || s.index <= maxSlide }"
          @click="emit('select', s.index)"
        >
          <span class="sb__num">
            <Check v-if="s.index !== index && (s.index < index || s.index <= maxSlide)" />
            <template v-else>{{ s.index + 1 }}</template>
          </span>
          <span class="sb__label">{{ s.title }}</span>
        </button>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.sb {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.sb__head {
  padding: 16px 16px 10px;
  border-bottom: 1px solid var(--border);
}

.sb__title {
  font-weight: 700;
  font-size: 0.95rem;
  line-height: 1.3;
}

.sb__list {
  list-style: none;
  margin: 0;
  padding: 8px;
  overflow-y: auto;
  flex: 1;
}

.sb__item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  text-align: left;
  color: var(--text-2);
  font-size: 0.86rem;
  transition: background var(--t-fast), color var(--t-fast);
}

.sb__item:hover {
  background: var(--surface-2);
  color: var(--text);
}

.sb__item.is-current {
  background: var(--primary-soft);
  color: var(--primary);
  font-weight: 600;
}

.sb__num {
  flex: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 0.72rem;
  font-weight: 700;
  background: var(--surface-3);
  color: var(--muted);
}

.sb__num svg {
  width: 13px;
  height: 13px;
}

.is-visited .sb__num {
  background: var(--primary-soft);
  color: var(--primary);
}

.is-current .sb__num {
  background: var(--primary);
  color: var(--on-primary);
}

.sb__label {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
