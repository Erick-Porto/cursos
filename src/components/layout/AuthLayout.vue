<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next'
import { useThemeStore } from '@/stores/theme'
import BrandMark from '@/components/ui/BrandMark.vue'

const theme = useThemeStore()
</script>

<template>
  <div class="auth">
    <div class="auth__bg" aria-hidden="true"></div>
    <button
      class="btn btn--ghost btn--icon auth__theme"
      type="button"
      :aria-label="theme.theme === 'dark' ? 'Tema claro' : 'Tema escuro'"
      @click="theme.toggle()"
    >
      <Sun v-if="theme.theme === 'dark'" />
      <Moon v-else />
    </button>

    <div class="auth__panel">
      <div class="auth__brand">
        <BrandMark :size="44" />
        <div>
          <div class="auth__title">Cursos</div>
          <div class="auth__sub">Aprenda no seu ritmo. Conquiste cada etapa.</div>
        </div>
      </div>
      <div class="card card--pad-lg auth__card">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth {
  position: relative;
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 24px var(--gutter) 40px;
  overflow: hidden;
}

.auth__bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(60% 50% at 10% 0%, var(--primary-soft), transparent 70%),
    radial-gradient(50% 40% at 100% 100%, var(--accent-soft), transparent 70%);
}

.auth__theme {
  position: absolute;
  top: 12px;
  right: 12px;
}

.auth__panel {
  width: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.auth__brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.auth__title {
  font-weight: 800;
  font-size: 1.4rem;
  letter-spacing: -0.02em;
}

.auth__sub {
  color: var(--muted);
  font-size: 0.9rem;
}

.auth__card {
  width: 100%;
}
</style>
