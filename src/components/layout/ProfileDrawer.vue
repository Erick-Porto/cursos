<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { LogOut, Moon, Sun, UserRound } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { useCatalogStore } from '@/stores/catalog'
import { useAchievementsStore } from '@/stores/achievements'
import { levelInfo } from '@/lib/xp'
import UserAvatar from '@/components/ui/UserAvatar.vue'

const props = defineProps<{
  open: boolean
  /** A barra lateral está recolhida: a gavetinha abre ao lado dela. */
  collapsed: boolean
}>()
const emit = defineEmits<{ close: [] }>()

const auth = useAuthStore()
const theme = useThemeStore()
const catalog = useCatalogStore()
const achievements = useAchievementsStore()
const router = useRouter()

const panel = ref<HTMLElement | null>(null)
const level = computed(() => levelInfo(auth.stats?.xp ?? 0))
let opener: HTMLElement | null = null

function onPointerDown(e: PointerEvent) {
  const target = e.target as Element
  if (panel.value?.contains(target) || target.closest('[data-profile-trigger]')) return
  emit('close')
}

function onKeydown(e: KeyboardEvent) {
  if (e.key !== 'Escape') return
  emit('close')
  opener?.focus()
}

/** Quem sai da gavetinha com a tecla Tab também a fecha. */
function onFocusOut(e: FocusEvent) {
  const next = e.relatedTarget as Element | null
  if (next && !panel.value?.contains(next) && !next.closest('[data-profile-trigger]')) emit('close')
}

function stopListening() {
  document.removeEventListener('pointerdown', onPointerDown)
  document.removeEventListener('keydown', onKeydown)
}

watch(
  () => props.open,
  async (open) => {
    if (!open) {
      stopListening()
      return
    }
    opener = document.activeElement as HTMLElement | null
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeydown)
    await nextTick()
    panel.value?.querySelector<HTMLElement>('a, button')?.focus()
  },
)

onBeforeUnmount(stopListening)

async function signOut() {
  emit('close')
  await auth.signOut()
  catalog.reset()
  achievements.reset()
  router.replace('/entrar')
}
</script>

<template>
  <Transition name="drawer">
    <section
      v-if="open"
      id="profile-drawer"
      ref="panel"
      class="drawer"
      :class="{ 'drawer--collapsed': collapsed }"
      role="dialog"
      aria-label="Seu perfil"
      @focusout="onFocusOut"
    >
      <header class="drawer__head">
        <UserAvatar :name="auth.displayName" :src="auth.profile?.avatar_url" :size="44" />
        <div class="grow">
          <div class="drawer__name">{{ auth.displayName }}</div>
          <div class="drawer__level">Nível {{ level.level }} · {{ level.title }}</div>
        </div>
      </header>

      <div class="drawer__xp">
        <div class="drawer__bar" aria-hidden="true"><span :style="{ width: level.pct + '%' }"></span></div>
        <span class="drawer__points">{{ auth.stats?.xp ?? 0 }} XP</span>
      </div>

      <div class="drawer__actions">
        <RouterLink to="/perfil" class="drawer__item" @click="emit('close')">
          <UserRound aria-hidden="true" />
          Ver perfil
        </RouterLink>
        <button class="drawer__item" type="button" @click="theme.toggle()">
          <Sun v-if="theme.theme === 'dark'" aria-hidden="true" />
          <Moon v-else aria-hidden="true" />
          {{ theme.theme === 'dark' ? 'Usar tema claro' : 'Usar tema escuro' }}
        </button>
        <button class="drawer__item drawer__item--danger" type="button" @click="signOut">
          <LogOut aria-hidden="true" />
          Sair
        </button>
      </div>
    </section>
  </Transition>
</template>

<style scoped>
/* celular: desce do topo, abaixo da foto */
.drawer {
  position: fixed;
  z-index: 40;
  top: calc(var(--header-h) + 8px);
  right: var(--gutter);
  width: min(300px, calc(100vw - 2 * var(--gutter)));
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-lg);
  background: var(--surface);
  box-shadow: var(--shadow-2);
}

.drawer__head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.drawer__name {
  overflow: hidden;
  font-size: 0.95rem;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.drawer__level,
.drawer__points {
  color: var(--muted);
  font-size: 0.75rem;
}

.drawer__xp {
  display: flex;
  align-items: center;
  gap: 10px;
}

.drawer__points {
  flex: none;
  font-weight: 600;
}

.drawer__bar {
  flex: 1;
  height: 6px;
  overflow: hidden;
  border-radius: 3px;
  background: var(--surface-3);
}

.drawer__bar span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--accent));
}

.drawer__actions {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-top: 8px;
  border-top: 1px solid var(--border);
}

.drawer__item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 42px;
  padding: 8px 10px;
  border: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-2);
  font: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  transition: background var(--t-fast), color var(--t-fast);
}

.drawer__item svg {
  flex: none;
  width: 18px;
  height: 18px;
}

.drawer__item:hover {
  background: var(--surface-2);
  color: var(--text);
  text-decoration: none;
}

.drawer__item--danger:hover {
  background: var(--danger-soft);
  color: var(--danger);
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity var(--t-fast) var(--ease), transform var(--t) var(--ease);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* computador: desliza para fora da barra lateral, na altura da foto */
@media (min-width: 1024px) {
  .drawer {
    top: auto;
    right: auto;
    bottom: 14px;
    left: calc(var(--sidenav-w) + 8px);
  }

  .drawer--collapsed {
    left: calc(var(--sidenav-w-collapsed) + 8px);
  }

  .drawer-enter-from,
  .drawer-leave-to {
    transform: translateX(-12px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .drawer-enter-active,
  .drawer-leave-active {
    transition: opacity var(--t-fast) linear;
  }

  .drawer-enter-from,
  .drawer-leave-to {
    transform: none;
  }
}
</style>
