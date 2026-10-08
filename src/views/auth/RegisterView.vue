<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { CircleAlert, MailCheck, UserPlus } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { friendlyError } from '@/lib/supabase'

const auth = useAuthStore()
const router = useRouter()

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirm = ref('')
const loading = ref(false)
const error = ref('')
const needsConfirmation = ref(false)

async function submit() {
  error.value = ''
  if (password.value !== confirm.value) {
    error.value = 'As senhas não conferem.'
    return
  }
  loading.value = true
  try {
    const pending = await auth.signUp(email.value.trim(), password.value, fullName.value.trim())
    if (pending) needsConfirmation.value = true
    else router.replace('/inicio')
  } catch (e) {
    error.value = friendlyError(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="needsConfirmation" class="stack" style="text-align: center; align-items: center">
    <MailCheck style="width: 44px; height: 44px; color: var(--primary)" />
    <h1 style="font-size: 1.3rem; margin: 0">Confirme seu e-mail</h1>
    <p class="text-2" style="margin: 0">
      Enviamos um link para <strong>{{ email }}</strong>. Abra-o para ativar sua conta e depois volte para entrar.
    </p>
    <RouterLink to="/entrar" class="btn btn--primary">Ir para o login</RouterLink>
  </div>

  <form v-else class="stack" @submit.prevent="submit">
    <div>
      <h1 style="font-size: 1.4rem; margin-bottom: 4px">Criar conta</h1>
      <p class="muted" style="margin: 0">Leva menos de um minuto.</p>
    </div>

    <div v-if="error" class="alert alert--error"><CircleAlert /> {{ error }}</div>

    <div class="field">
      <label for="name">Nome completo</label>
      <input id="name" v-model="fullName" class="input" type="text" autocomplete="name" required minlength="3" />
    </div>
    <div class="field">
      <label for="email">E-mail</label>
      <input id="email" v-model="email" class="input" type="email" autocomplete="email" required />
    </div>
    <div class="field">
      <label for="password">Senha</label>
      <input id="password" v-model="password" class="input" type="password" autocomplete="new-password" required minlength="6" />
      <span class="hint">Mínimo de 6 caracteres.</span>
    </div>
    <div class="field">
      <label for="confirm">Confirmar senha</label>
      <input id="confirm" v-model="confirm" class="input" type="password" autocomplete="new-password" required minlength="6" />
    </div>

    <button class="btn btn--primary btn--lg btn--block" type="submit" :disabled="loading">
      <UserPlus /> {{ loading ? 'Criando…' : 'Criar conta' }}
    </button>

    <p class="small muted" style="text-align: center; margin: 4px 0 0">
      Já tem conta? <RouterLink to="/entrar">Entrar</RouterLink>
    </p>
  </form>
</template>
