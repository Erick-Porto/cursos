<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { CircleAlert, MailCheck, Send } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { friendlyError } from '@/lib/supabase'

const auth = useAuthStore()
const email = ref('')
const loading = ref(false)
const error = ref('')
const sent = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await auth.requestPasswordReset(email.value.trim())
    sent.value = true
  } catch (e) {
    error.value = friendlyError(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="sent" class="stack" style="text-align: center; align-items: center">
    <MailCheck style="width: 44px; height: 44px; color: var(--primary)" />
    <h1 style="font-size: 1.3rem; margin: 0">Verifique seu e-mail</h1>
    <p class="text-2" style="margin: 0">Se existir uma conta para <strong>{{ email }}</strong>, enviamos um link para criar uma nova senha.</p>
    <RouterLink to="/entrar" class="btn btn--outline">Voltar ao login</RouterLink>
  </div>

  <form v-else class="stack" @submit.prevent="submit">
    <div>
      <h1 style="font-size: 1.4rem; margin-bottom: 4px">Recuperar senha</h1>
      <p class="muted" style="margin: 0">Informe o e-mail da sua conta.</p>
    </div>
    <div v-if="error" class="alert alert--error"><CircleAlert /> {{ error }}</div>
    <div class="field">
      <label for="email">E-mail</label>
      <input id="email" v-model="email" class="input" type="email" autocomplete="email" required />
    </div>
    <button class="btn btn--primary btn--lg btn--block" type="submit" :disabled="loading">
      <Send /> {{ loading ? 'Enviando…' : 'Enviar link' }}
    </button>
    <p class="small muted" style="text-align: center; margin: 4px 0 0"><RouterLink to="/entrar">Voltar ao login</RouterLink></p>
  </form>
</template>
