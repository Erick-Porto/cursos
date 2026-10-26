<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isSupabaseConfigured } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import AppShell from '@/components/layout/AppShell.vue'
import AuthLayout from '@/components/layout/AuthLayout.vue'
import SetupNotice from '@/components/layout/SetupNotice.vue'
import ToastHost from '@/components/ui/ToastHost.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const toast = useToastStore()

const layout = computed(() => route.meta.layout ?? 'app')

onMounted(async () => {
  if (!isSupabaseConfigured) return
  await auth.init()

  // Links de e-mail voltam com ?code=... (PKCE) e ?flow=...; limpamos a URL depois
  // que o supabase-js já trocou o código por sessão.
  if (window.location.search) {
    const params = new URLSearchParams(window.location.search)
    const flow = params.get('flow')
    const linkError = params.get('error_code') ?? params.get('error')
    window.history.replaceState(null, '', window.location.pathname + window.location.hash)
    if (linkError) {
      // Link vencido ou já usado: o Supabase volta com ?error=...&error_code=...
      toast.error('Link inválido ou expirado', 'Peça um novo e-mail ou tente entrar com sua senha.')
    } else if (flow === 'recovery') {
      auth.recoveryMode = true
      router.replace('/nova-senha')
    } else if (flow === 'confirm' && auth.isAuthenticated) {
      toast.success('E-mail confirmado', 'Sua conta está pronta. Bons estudos!')
    } else if (flow === 'confirm') {
      // Link aberto em outro aparelho ou navegador: o Supabase já confirmou o e-mail,
      // mas a troca do código por sessão só funciona onde o cadastro foi feito.
      toast.success('E-mail confirmado', 'Agora entre com seu e-mail e senha.')
    }
  }
})
</script>

<template>
  <SetupNotice v-if="!isSupabaseConfigured" />
  <template v-else>
    <div v-if="!auth.ready" class="boot">
      <LoadingBlock text="Carregando" />
    </div>
    <template v-else>
      <AppShell v-if="layout === 'app'">
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </AppShell>
      <AuthLayout v-else-if="layout === 'auth'">
        <RouterView />
      </AuthLayout>
      <RouterView v-else />
    </template>
    <ToastHost />
  </template>
</template>

<style scoped>
.boot {
  min-height: 100dvh;
  display: grid;
  place-items: center;
}
</style>
