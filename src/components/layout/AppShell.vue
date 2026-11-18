<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { BookOpen, Home, Moon, PanelLeftClose, PanelLeftOpen, Sun, Trophy, UserRound, Users } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import UserAvatar from '@/components/ui/UserAvatar.vue'
import BrandMark from '@/components/ui/BrandMark.vue'
import ProfileDrawer from '@/components/layout/ProfileDrawer.vue'

const COLLAPSED_KEY = 'cursos:sidenav-collapsed'

const auth = useAuthStore()
const theme = useThemeStore()
const route = useRoute()

const nav = computed(() => {
  const items = [
    { to: '/inicio', label: 'Início', icon: Home },
    { to: '/cursos', label: 'Cursos', icon: BookOpen },
    { to: '/conquistas', label: 'Conquistas', icon: Trophy },
    { to: '/perfil', label: 'Perfil', icon: UserRound },
  ]
  if (auth.isStaff) items.push({ to: '/instrutor', label: 'Instrutor', icon: Users })
  return items
})

// ---- barra lateral recolhida: a escolha fica guardada neste navegador ----
function readCollapsed(): boolean {
  try {
    return localStorage.getItem(COLLAPSED_KEY) === '1'
  } catch {
    return false
  }
}

const collapsed = ref(readCollapsed())

function toggleCollapsed() {
  collapsed.value = !collapsed.value
  try {
    localStorage.setItem(COLLAPSED_KEY, collapsed.value ? '1' : '0')
  } catch {
    /* armazenamento indisponível: vale só até recarregar a página */
  }
}

// ---- gavetinha do perfil, aberta pela foto ----
const profileOpen = ref(false)
watch(() => route.fullPath, () => (profileOpen.value = false))
</script>

<template>
  <div class="shell" :class="{ 'is-collapsed': collapsed }">
    <header class="topbar">
      <RouterLink to="/inicio" class="brand" aria-label="Início">
        <BrandMark :size="28" />
        <span>Cursos</span>
      </RouterLink>
      <div class="row">
        <button class="btn btn--ghost btn--icon" type="button" :aria-label="theme.theme === 'dark' ? 'Tema claro' : 'Tema escuro'" @click="theme.toggle()">
          <Sun v-if="theme.theme === 'dark'" />
          <Moon v-else />
        </button>
        <button
          class="avatar-btn"
          :class="{ 'is-open': profileOpen }"
          type="button"
          data-profile-trigger
          aria-label="Abrir o menu do perfil"
          aria-haspopup="dialog"
          aria-controls="profile-drawer"
          :aria-expanded="profileOpen"
          @click="profileOpen = !profileOpen"
        >
          <UserAvatar :name="auth.displayName" :src="auth.profile?.avatar_url" :size="34" />
        </button>
      </div>
    </header>

    <aside class="sidenav">
      <div class="sidenav__head">
        <RouterLink to="/inicio" class="brand brand--side" aria-label="Cursos, ir para o início">
          <BrandMark :size="34" />
          <span class="sidenav__label">Cursos</span>
        </RouterLink>
        <button
          class="btn btn--ghost btn--icon btn--sm sidenav__toggle"
          type="button"
          :title="collapsed ? 'Expandir o menu' : 'Recolher o menu'"
          :aria-label="collapsed ? 'Expandir o menu' : 'Recolher o menu'"
          :aria-expanded="!collapsed"
          @click="toggleCollapsed"
        >
          <PanelLeftOpen v-if="collapsed" />
          <PanelLeftClose v-else />
        </button>
      </div>

      <nav class="sidenav__nav" aria-label="Principal">
        <RouterLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="sidenav__link"
          active-class="is-active"
          :title="collapsed ? item.label : undefined"
        >
          <component :is="item.icon" />
          <span class="sidenav__label">{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="sidenav__user">
        <button
          class="avatar-btn"
          :class="{ 'is-open': profileOpen }"
          type="button"
          data-profile-trigger
          title="Seu perfil"
          aria-label="Abrir o menu do perfil"
          aria-haspopup="dialog"
          aria-controls="profile-drawer"
          :aria-expanded="profileOpen"
          @click="profileOpen = !profileOpen"
        >
          <UserAvatar :name="auth.displayName" :src="auth.profile?.avatar_url" :size="40" />
        </button>
      </div>
    </aside>

    <ProfileDrawer :open="profileOpen" :collapsed="collapsed" @close="profileOpen = false" />

    <main class="shell__main">
      <slot />
    </main>

    <nav class="bottomnav" aria-label="Principal">
      <RouterLink v-for="item in nav" :key="item.to" :to="item.to" class="bottomnav__link" active-class="is-active">
        <component :is="item.icon" />
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.shell {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  font-size: 1.1rem;
  letter-spacing: -0.01em;
  color: var(--text);
  text-decoration: none;
}

.brand:hover {
  text-decoration: none;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  height: var(--header-h);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--gutter);
  background: color-mix(in srgb, var(--bg-elev) 88%, transparent);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}

.avatar-btn {
  display: inline-flex;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  transition: box-shadow var(--t-fast);
}

.avatar-btn:hover,
.avatar-btn.is-open {
  box-shadow: var(--glow-primary);
}

.shell__main {
  flex: 1;
  padding-bottom: calc(var(--bottomnav-h) + env(safe-area-inset-bottom));
}

.bottomnav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  height: calc(var(--bottomnav-h) + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  background: color-mix(in srgb, var(--bg-elev) 92%, transparent);
  backdrop-filter: blur(12px);
  border-top: 1px solid var(--border);
}

.bottomnav__link {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--muted);
  text-decoration: none;
}

.bottomnav__link svg {
  width: 22px;
  height: 22px;
}

.bottomnav__link.is-active {
  color: var(--primary);
}

.sidenav {
  display: none;
}

@media (min-width: 1024px) {
  .shell {
    flex-direction: row;
  }

  .topbar,
  .bottomnav {
    display: none;
  }

  .shell__main {
    padding-bottom: 0;
    min-width: 0;
  }

  .sidenav {
    position: sticky;
    top: 0;
    height: 100dvh;
    width: var(--sidenav-w);
    flex: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 22px 16px;
    overflow: hidden;
    background: var(--bg-elev);
    border-right: 1px solid var(--border);
    transition: width var(--t) var(--ease), padding var(--t) var(--ease);
  }

  .sidenav__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 0 0 16px 8px;
  }

  .brand--side {
    font-size: 1.2rem;
  }

  .sidenav__toggle {
    flex: none;
    color: var(--muted);
  }

  .sidenav__label {
    white-space: nowrap;
  }

  /* recolhida: só os ícones; os nomes continuam disponíveis para leitores de tela */
  .is-collapsed .sidenav {
    width: var(--sidenav-w-collapsed);
    padding-inline: 12px;
  }

  .is-collapsed .sidenav__head {
    flex-direction: column;
    gap: 12px;
    padding-left: 0;
  }

  .is-collapsed .sidenav__label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }

  .is-collapsed .sidenav__link {
    justify-content: center;
    padding-inline: 0;
  }

  .is-collapsed .sidenav__user {
    justify-content: center;
    padding-left: 0;
  }

  .sidenav__nav {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .sidenav__link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: var(--radius);
    color: var(--text-2);
    font-weight: 600;
    text-decoration: none;
    transition: background var(--t-fast), color var(--t-fast);
  }

  .sidenav__link svg {
    width: 20px;
    height: 20px;
  }

  .sidenav__link:hover {
    background: var(--surface-2);
    color: var(--text);
  }

  .sidenav__link.is-active {
    background: var(--primary-soft);
    color: var(--primary);
  }

  .sidenav__user {
    margin-top: auto;
    display: flex;
    padding: 6px 0 2px 8px;
  }
}

/* com mouse, o botão de reabrir fica atrás da logo e os dois trocam de lugar quando o cursor entra na barra */
@media (min-width: 1024px) and (hover: hover) {
  .is-collapsed .sidenav__head {
    display: grid;
    place-items: center;
    justify-content: center;
  }

  .is-collapsed .brand--side,
  .is-collapsed .sidenav__toggle {
    grid-area: 1 / 1;
    transition: opacity var(--t-fast);
  }

  .is-collapsed .sidenav__toggle {
    opacity: 0;
  }

  .is-collapsed .sidenav:hover .sidenav__toggle,
  .is-collapsed .sidenav__toggle:focus-visible {
    opacity: 1;
  }

  .is-collapsed .sidenav:hover .brand--side {
    opacity: 0;
    pointer-events: none;
  }

  .is-collapsed .sidenav__head:has(.sidenav__toggle:focus-visible) .brand--side {
    opacity: 0;
  }
}

@media (min-width: 1024px) and (prefers-reduced-motion: reduce) {
  .sidenav,
  .is-collapsed .brand--side,
  .is-collapsed .sidenav__toggle {
    transition: none;
  }
}
</style>
