<script setup lang="ts">
import { LoaderCircle } from 'lucide-vue-next'
defineProps<{ text?: string }>()
</script>

<template>
  <div class="loading" role="status">
    <LoaderCircle class="loading__icon" />
    <span v-if="text">{{ text }}</span>
  </div>
</template>

<style scoped>
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 32px;
  color: var(--muted);
}

.loading__icon {
  width: 22px;
  height: 22px;
  animation: spin 0.9s linear infinite;
  color: var(--primary);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
