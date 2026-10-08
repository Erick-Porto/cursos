<script setup lang="ts">
import { CircleAlert, CircleCheck, Info, Sparkles, X } from 'lucide-vue-next'
import { useToastStore } from '@/stores/toast'
import AchievementBadge from '@/components/achievements/AchievementBadge.vue'

const toast = useToastStore()
</script>

<template>
  <div class="toasts" aria-live="polite">
    <TransitionGroup name="toast">
      <div v-for="t in toast.toasts" :key="t.id" class="toast" :class="`toast--${t.kind}`" role="status">
        <div class="toast__icon">
          <AchievementBadge v-if="t.kind === 'achievement' && t.achievement" :achievement="t.achievement" :size="44" earned />
          <Sparkles v-else-if="t.kind === 'xp'" />
          <CircleCheck v-else-if="t.kind === 'success'" />
          <CircleAlert v-else-if="t.kind === 'error'" />
          <Info v-else />
        </div>
        <div class="toast__body">
          <div v-if="t.kind === 'achievement'" class="toast__eyebrow">Conquista desbloqueada</div>
          <div class="toast__title">{{ t.title }}</div>
          <div v-if="t.message" class="toast__msg">{{ t.message }}</div>
        </div>
        <button class="toast__close" type="button" aria-label="Fechar" @click="toast.dismiss(t.id)">
          <X />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toasts {
  position: fixed;
  z-index: 100;
  left: 50%;
  transform: translateX(-50%);
  bottom: calc(var(--bottomnav-h) + 12px + env(safe-area-inset-bottom));
  width: min(420px, calc(100vw - 2 * var(--gutter)));
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}

@media (min-width: 1024px) {
  .toasts {
    left: auto;
    right: 20px;
    bottom: 20px;
    transform: none;
  }
}

.toast {
  --c: var(--info);
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 12px 12px 14px;
  border-radius: var(--radius-lg);
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 4px solid var(--c);
  box-shadow: var(--shadow-2);
}

.toast--success {
  --c: var(--primary);
}

.toast--error {
  --c: var(--danger);
}

.toast--xp {
  --c: var(--accent);
}

.toast--achievement {
  --c: var(--warning);
  background: linear-gradient(135deg, var(--surface), var(--surface-2));
}

.toast__icon {
  flex: none;
  color: var(--c);
  display: grid;
  place-items: center;
}

.toast__icon svg {
  width: 22px;
  height: 22px;
}

.toast__body {
  flex: 1;
  min-width: 0;
}

.toast__eyebrow {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--warning);
}

.toast__title {
  font-weight: 700;
  font-size: 0.95rem;
}

.toast__msg {
  color: var(--text-2);
  font-size: 0.85rem;
}

.toast__close {
  color: var(--muted);
  padding: 4px;
  border-radius: 6px;
}

.toast__close svg {
  width: 16px;
  height: 16px;
}

.toast-enter-active,
.toast-leave-active {
  transition: all var(--t) var(--ease);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}
</style>
