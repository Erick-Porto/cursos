<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    value: number | string | null | undefined
    size?: 'sm' | 'md' | 'lg'
    variant?: 'primary' | 'accent' | 'warning' | 'danger' | 'gradient'
    label?: boolean
  }>(),
  { size: 'md', variant: 'primary', label: false },
)

const pct = computed(() => Math.max(0, Math.min(100, Number(props.value ?? 0))))
</script>

<template>
  <div class="pb" :class="[`pb--${size}`, `pb--${variant}`]">
    <div class="pb__track" role="progressbar" :aria-valuenow="Math.round(pct)" aria-valuemin="0" aria-valuemax="100">
      <div class="pb__fill" :style="{ width: pct + '%' }"></div>
    </div>
    <span v-if="label" class="pb__label">{{ Math.round(pct) }}%</span>
  </div>
</template>

<style scoped>
.pb {
  display: flex;
  align-items: center;
  gap: 10px;
  --h: 8px;
  --fill: var(--primary);
}

.pb--sm {
  --h: 5px;
}

.pb--lg {
  --h: 12px;
}

.pb--accent {
  --fill: var(--accent);
}

.pb--warning {
  --fill: var(--warning);
}

.pb--danger {
  --fill: var(--danger);
}

.pb--gradient {
  --fill: linear-gradient(90deg, var(--primary), var(--accent));
}

.pb__track {
  flex: 1;
  height: var(--h);
  border-radius: 999px;
  background: var(--surface-3);
  overflow: hidden;
}

.pb__fill {
  height: 100%;
  border-radius: 999px;
  background: var(--fill);
  transition: width var(--t) var(--ease);
}

.pb__label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-2);
  min-width: 3ch;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
</style>
