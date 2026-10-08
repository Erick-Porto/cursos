<script setup lang="ts">
import { computed } from 'vue'
import { Lock } from 'lucide-vue-next'
import { resolveIcon } from '@/lib/icons'
import type { Achievement } from '@/types/db'

const props = withDefaults(defineProps<{ achievement: Achievement; earned?: boolean; size?: number }>(), {
  earned: false,
  size: 64,
})

const icon = computed(() => resolveIcon(props.achievement.icon))
const hidden = computed(() => props.achievement.is_secret && !props.earned)
</script>

<template>
  <span
    class="badge-ring"
    :class="[`rarity--${achievement.rarity}`, { 'is-locked': !earned }]"
    :style="{ width: size + 'px', height: size + 'px' }"
    :title="hidden ? 'Conquista secreta' : achievement.title"
  >
    <Lock v-if="hidden" :style="{ width: size * 0.4 + 'px', height: size * 0.4 + 'px' }" />
    <component :is="icon" v-else :style="{ width: size * 0.48 + 'px', height: size * 0.48 + 'px' }" />
  </span>
</template>

<style scoped>
.badge-ring {
  --c: var(--rarity-common);
  display: inline-grid;
  place-items: center;
  border-radius: 50%;
  flex: none;
  color: var(--c);
  background:
    radial-gradient(circle at 30% 25%, color-mix(in srgb, var(--c) 35%, transparent), transparent 60%),
    var(--surface-2);
  border: 2px solid var(--c);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--c) 18%, transparent);
  transition: transform var(--t) var(--ease);
}

.badge-ring:hover {
  transform: translateY(-2px) scale(1.03);
}

.rarity--rare {
  --c: var(--rarity-rare);
}

.rarity--epic {
  --c: var(--rarity-epic);
}

.rarity--legendary {
  --c: var(--rarity-legendary);
}

.badge-ring.is-locked {
  --c: var(--muted);
  filter: grayscale(1);
  opacity: 0.55;
  box-shadow: none;
}
</style>
