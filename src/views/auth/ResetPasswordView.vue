<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { CircleAlert, KeyRound } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { friendlyError } from '@/lib/supabase'

const auth = useAuthStore()
const toast = useToastStore()
const router = useRouter()

const password = ref('')
const confirm = ref('')
const loading = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  if (password.value !== confirm.value) {
    error.value = 'As senhas não conferem.'
    return
  }
  loading.value = true
  try {
    await auth.updatePassword(password.value)
    toast.success('Senha atualizada')
    router.replace('/inicio')
  } catch (e) {
    error.value = friendlyError(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="stack" @submit.prevent="submit">
    <div>
      <h1 style="font-size: 1.4rem; margin-bottom: 4px">Nova senha</h1>
      <p class="muted" style="margin: 0">Defina a nova senha da sua conta.</p>
    </div>
    <div v-if="error" class="alert alert--error"><CircleAlert /> {{ error }}</div>
    <div class="field">
      <label for="password">Nova senha</label>
      <input id="password" v-model="password" class="input" type="password" autocomplete="new-password" required minlength="6" />
    </div>
    <div class="field">
      <label for="confirm">Confirmar senha</label>
      <input id="confirm" v-model="confirm" class="input" type="password" autocomplete="new-password" required minlength="6" />
    </div>
    <button class="btn btn--primary btn--lg btn--block" type="submit" :disabled="loading">
      <KeyRound /> {{ loading ? 'Salvando…' : 'Salvar senha' }}
    </button>
    <p class="small muted" style="text-align: center; margin: 4px 0 0">
      Chegou aqui sem querer? <RouterLink to="/inicio">Ir para o início</RouterLink>
    </p>
  </form>
</template>
