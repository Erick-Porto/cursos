<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { BookOpen, Home, LogOut, Moon, Sun, Trophy, UserRound, Users } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { useCatalogStore } from '@/stores/catalog'
import { useAchievementsStore } from '@/stores/achievements'
import { levelInfo } from '@/lib/xp'
import UserAvatar from '@/components/ui/UserAvatar.vue'
import BrandMark from '@/components/ui/BrandMark.vue'

const auth = useAuthStore()
const theme = useThemeStore()
const catalog = useCatalogStore()
const achievements = useAchievementsStore()
const router = useRouter()

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

const level = computed(() => levelInfo(auth.stats?.xp ?? 0))

async function signOut() {
  await auth.signOut()
  catalog.reset()
  achievements.reset()
  router.replace('/entrar')
}
</script>

<template>
  <div class="shell">
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
        <RouterLink to="/perfil" class="topbar__avatar" aria-label="Perfil">
          <UserAvatar :name="auth.displayName" :src="auth.profile?.avatar_url" :size="34" />
        </RouterLink>
      </div>
    </header>

    <aside class="sidenav">
      <RouterLink to="/inicio" class="brand brand--side">
        <BrandMark :size="34" />
        <span>Cursos</span>
      </RouterLink>

      <nav class="sidenav__nav" aria-label="Principal">
        <RouterLink v-for="item in nav" :key="item.to" :to="item.to" class="sidenav__link" active-class="is-active">
          <component :is="item.icon" />
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="sidenav__user">
        <RouterLink to="/perfil" class="sidenav__profile">
          <UserAvatar :name="auth.displayName" :src="auth.profile?.avatar_url" :size="40" />
          <div class="grow">
            <div class="sidenav__name">{{ auth.displayName }}</div>
            <div class="sidenav__level">Nível {{ level.level }} · {{ level.title }}</div>
          </div>
        </RouterLink>
        <div class="sidenav__xp" :title="`${auth.stats?.xp ?? 0} XP`">
          <span :style="{ width: level.pct + '%' }"></span>
        </div>
        <div class="row between">
          <button class="btn btn--ghost btn--sm" type="button" @click="theme.toggle()">
            <Sun v-if="theme.theme === 'dark'" />
            <Moon v-else />
            {{ theme.theme === 'dark' ? 'Claro' : 'Escuro' }}
          </button>
          <button class="btn btn--ghost btn--sm" type="button" @click="signOut">
            <LogOut />
            Sair
          </button>
        </div>
      </div>
    </aside>

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

.topbar__avatar {
  display: inline-flex;
  border-radius: 50%;
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
    background: var(--bg-elev);
    border-right: 1px solid var(--border);
  }

  .brand--side {
    padding: 0 8px 16px;
    font-size: 1.2rem;
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
    flex-direction: column;
    gap: 10px;
    padding: 12px;
    border-radius: var(--radius-lg);
    background: var(--surface);
    border: 1px solid var(--border);
  }

  .sidenav__profile {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--text);
    text-decoration: none;
  }

  .sidenav__name {
    font-weight: 700;
    font-size: 0.92rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sidenav__level {
    font-size: 0.75rem;
    color: var(--muted);
  }

  .sidenav__xp {
    height: 6px;
    border-radius: 3px;
    background: var(--surface-3);
    overflow: hidden;
  }

  .sidenav__xp span {
    display: block;
    height: 100%;
    background: linear-gradient(90deg, var(--primary), var(--accent));
    transition: width var(--t) var(--ease);
  }
}
</style>
