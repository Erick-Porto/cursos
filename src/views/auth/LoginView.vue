<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { CircleAlert, Eye, EyeOff, LogIn } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { friendlyError } from '@/lib/supabase'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const googleEnabled = import.meta.env.VITE_ENABLE_GOOGLE_LOGIN === 'true'

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await auth.signIn(email.value.trim(), password.value)
    const next = typeof route.query.next === 'string' ? route.query.next : '/inicio'
    router.replace(next)
  } catch (e) {
    error.value = friendlyError(e)
  } finally {
    loading.value = false
  }
}

async function google() {
  error.value = ''
  try {
    await auth.signInWithGoogle()
  } catch (e) {
    error.value = friendlyError(e)
  }
}
</script>

<template>
  <form class="stack" @submit.prevent="submit">
    <div>
      <h1 style="font-size: 1.4rem; margin-bottom: 4px">Entrar</h1>
      <p class="muted" style="margin: 0">Acesse seus cursos e continue de onde parou.</p>
    </div>

    <div v-if="error" class="alert alert--error"><CircleAlert /> {{ error }}</div>

    <div class="field">
      <label for="email">E-mail</label>
      <input id="email" v-model="email" class="input" type="email" autocomplete="email" required />
    </div>

    <div class="field">
      <div class="row between">
        <label for="password">Senha</label>
        <RouterLink to="/recuperar-senha" class="small">Esqueci a senha</RouterLink>
      </div>
      <div class="pw">
        <input
          id="password"
          v-model="password"
          class="input"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="current-password"
          required
        />
        <button type="button" class="pw__toggle" :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'" @click="showPassword = !showPassword">
          <EyeOff v-if="showPassword" />
          <Eye v-else />
        </button>
      </div>
    </div>

    <button class="btn btn--primary btn--lg btn--block" type="submit" :disabled="loading">
      <LogIn /> {{ loading ? 'Entrando…' : 'Entrar' }}
    </button>

    <button v-if="googleEnabled" class="btn btn--outline btn--block" type="button" @click="google">
      Entrar com Google
    </button>

    <p class="small muted" style="text-align: center; margin: 4px 0 0">
      Ainda não tem conta? <RouterLink to="/cadastro">Criar conta</RouterLink>
    </p>
  </form>
</template>

<style scoped>
.pw {
  position: relative;
}

.pw .input {
  padding-right: 44px;
}

.pw__toggle {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  color: var(--muted);
}

.pw__toggle svg {
  width: 18px;
  height: 18px;
}
</style>
