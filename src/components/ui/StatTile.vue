<script setup lang="ts">
import type { Component } from 'vue'
defineProps<{ icon: Component; label: string; value: string | number; hint?: string; variant?: 'primary' | 'accent' | 'warning' | 'info' }>()
</script>

<template>
  <div class="stat card card--flat" :class="variant ? `stat--${variant}` : ''">
    <div class="stat__icon"><component :is="icon" /></div>
    <div class="stat__body">
      <div class="stat__value">{{ value }}</div>
      <div class="stat__label">{{ label }}</div>
      <div v-if="hint" class="stat__hint">{{ hint }}</div>
    </div>
  </div>
</template>

<style scoped>
.stat {
  --c: var(--primary);
  --c-soft: var(--primary-soft);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
}

.stat--accent {
  --c: var(--accent);
  --c-soft: var(--accent-soft);
}

.stat--warning {
  --c: var(--warning);
  --c-soft: var(--warning-soft);
}

.stat--info {
  --c: var(--info);
  --c-soft: var(--info-soft);
}

.stat__icon {
  flex: none;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: var(--c-soft);
  color: var(--c);
}

.stat__icon svg {
  width: 22px;
  height: 22px;
}

.stat__body {
  min-width: 0;
}

.stat__value {
  font-size: 1.35rem;
  font-weight: 800;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}

.stat__label {
  font-size: 0.78rem;
  color: var(--muted);
  font-weight: 600;
}

.stat__hint {
  font-size: 0.72rem;
  color: var(--muted);
}
</style>
