<script setup lang="ts">
import { computed } from 'vue'
import { initials } from '@/lib/format'

const props = withDefaults(defineProps<{ name?: string | null; src?: string | null; size?: number }>(), { size: 40 })

const hue = computed(() => {
  const s = props.name ?? ''
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360
  return h
})
</script>

<template>
  <span
    class="avatar"
    :style="{
      width: size + 'px',
      height: size + 'px',
      fontSize: Math.round(size * 0.38) + 'px',
      background: src ? 'var(--surface-2)' : `hsl(${hue} 55% 40%)`,
    }"
  >
    <img v-if="src" :src="src" :alt="name ?? ''" />
    <template v-else>{{ initials(name) }}</template>
  </span>
</template>

<style scoped>
.avatar {
  display: inline-grid;
  place-items: center;
  border-radius: 50%;
  overflow: hidden;
  color: #fff;
  font-weight: 700;
  flex: none;
  border: 2px solid var(--border);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
