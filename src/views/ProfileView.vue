<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Award, Camera, CircleCheck, Flame, GraduationCap, KeyRound, LogOut, Save, Trophy } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useAchievementsStore } from '@/stores/achievements'
import { useCatalogStore } from '@/stores/catalog'
import { useToastStore } from '@/stores/toast'
import { fetchMyAttempts } from '@/lib/api'
import { friendlyError, supabase } from '@/lib/supabase'
import { formatDate, formatDateTime, formatPct } from '@/lib/format'
import type { Attempt } from '@/types/db'
import UserAvatar from '@/components/ui/UserAvatar.vue'
import LevelBar from '@/components/ui/LevelBar.vue'
import StatTile from '@/components/ui/StatTile.vue'
import AchievementBadge from '@/components/achievements/AchievementBadge.vue'

const auth = useAuthStore()
const achievements = useAchievementsStore()
const catalog = useCatalogStore()
const toast = useToastStore()
const router = useRouter()

const fullName = ref('')
const username = ref('')
const bio = ref('')
const saving = ref(false)
const uploading = ref(false)
const newPassword = ref('')
const changingPassword = ref(false)
const attempts = ref<Attempt[]>([])
const assessmentInfo = ref<Record<string, { title: string; slug: string }>>({})

const roleLabel = computed(() => ({ student: 'Aluno', instructor: 'Instrutor', admin: 'Administrador' })[auth.role])

function fill() {
  fullName.value = auth.profile?.full_name ?? ''
  username.value = auth.profile?.username ?? ''
  bio.value = auth.profile?.bio ?? ''
}

async function save() {
  saving.value = true
  try {
    await auth.updateProfile({
      full_name: fullName.value.trim(),
      username: username.value.trim().toLowerCase() || null,
      bio: bio.value.trim() || null,
    })
    toast.success('Perfil atualizado')
  } catch (e) {
    toast.error('Não foi possível salvar', friendlyError(e))
  } finally {
    saving.value = false
  }
}

async function onAvatar(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) {
    toast.error('Imagem muito grande', 'Use uma imagem de até 2 MB.')
    return
  }
  uploading.value = true
  try {
    await auth.uploadAvatar(file)
    toast.success('Foto atualizada')
  } catch (err) {
    toast.error('Falha no envio', friendlyError(err))
  } finally {
    uploading.value = false
  }
}

async function changePassword() {
  changingPassword.value = true
  try {
    await auth.updatePassword(newPassword.value)
    newPassword.value = ''
    toast.success('Senha alterada')
  } catch (e) {
    toast.error('Não foi possível alterar', friendlyError(e))
  } finally {
    changingPassword.value = false
  }
}

async function signOut() {
  await auth.signOut()
  catalog.reset()
  achievements.reset()
  router.replace('/entrar')
}

const courseSlug = (id: string) => catalog.courses.find((c) => c.id === id)?.slug ?? ''

onMounted(async () => {
  fill()
  await Promise.all([achievements.load(), catalog.load(), auth.refreshStats()])
  attempts.value = await fetchMyAttempts(20)
  const ids = [...new Set(attempts.value.map((a) => a.assessment_id))]
  if (ids.length) {
    const { data } = await supabase.from('assessments').select('id,title,slug').in('id', ids)
    assessmentInfo.value = Object.fromEntries((data ?? []).map((a) => [a.id, { title: a.title, slug: a.slug }]))
  }
})
</script>

<template>
  <div class="container page">
    <div class="page-head">
      <div>
        <span class="eyebrow">Minha conta</span>
        <h1>Perfil</h1>
      </div>
      <button class="btn btn--ghost" type="button" @click="signOut"><LogOut /> Sair</button>
    </div>

    <div class="profile-grid">
      <aside class="stack">
        <div class="card hero">
          <label class="hero__avatar" :class="{ 'is-busy': uploading }" title="Alterar foto">
            <UserAvatar :name="auth.displayName" :src="auth.profile?.avatar_url" :size="96" />
            <span class="hero__cam"><Camera /></span>
            <input type="file" accept="image/*" class="visually-hidden" :disabled="uploading" @change="onAvatar" />
          </label>
          <h2 style="margin: 10px 0 2px">{{ auth.profile?.full_name || auth.displayName }}</h2>
          <div class="muted small">
            <span v-if="auth.profile?.username">@{{ auth.profile.username }} · </span>{{ roleLabel }}
          </div>
          <div class="hint" style="margin-top: 6px">Desde {{ formatDate(auth.profile?.created_at) }}</div>
        </div>

        <div class="card"><LevelBar :xp="auth.stats?.xp ?? 0" /></div>

        <div class="grid grid--stats stats-2">
          <StatTile :icon="Flame" label="Dias seguidos" :value="auth.stats?.current_streak ?? 0" variant="warning" />
          <StatTile :icon="CircleCheck" label="Aulas" :value="auth.stats?.lessons_completed ?? 0" />
          <StatTile :icon="Award" label="Aprovações" :value="auth.stats?.assessments_passed ?? 0" variant="info" />
          <StatTile :icon="GraduationCap" label="Cursos" :value="auth.stats?.courses_completed ?? 0" variant="accent" />
        </div>

        <div class="card">
          <div class="row between" style="margin-bottom: 10px">
            <strong><Trophy style="width: 16px; height: 16px; vertical-align: -3px" /> Conquistas</strong>
            <RouterLink to="/conquistas" class="small">Ver todas</RouterLink>
          </div>
          <div v-if="achievements.recent.length" class="row wrap">
            <AchievementBadge v-for="r in achievements.recent.slice(0, 8)" :key="r.achievement_id" :achievement="r.achievement!" earned :size="46" />
          </div>
          <p v-else class="muted small" style="margin: 0">Nenhuma ainda.</p>
        </div>
      </aside>

      <main class="stack">
        <form class="card stack" @submit.prevent="save">
          <h2 style="font-size: 1.1rem; margin: 0">Dados pessoais</h2>
          <div class="field">
            <label for="full_name">Nome completo</label>
            <input id="full_name" v-model="fullName" class="input" type="text" required minlength="3" />
          </div>
          <div class="field">
            <label for="username">Nome de usuário</label>
            <input id="username" v-model="username" class="input" type="text" pattern="[a-z0-9_]{3,30}" placeholder="ex.: maria_silva" />
            <span class="hint">3 a 30 caracteres: letras minúsculas, números e _.</span>
          </div>
          <div class="field">
            <label for="bio">Sobre você</label>
            <textarea id="bio" v-model="bio" class="input" maxlength="280" placeholder="Uma frase sobre seus objetivos"></textarea>
          </div>
          <div class="row" style="justify-content: flex-end">
            <button class="btn btn--primary" type="submit" :disabled="saving"><Save /> {{ saving ? 'Salvando…' : 'Salvar' }}</button>
          </div>
        </form>

        <form class="card stack" @submit.prevent="changePassword">
          <h2 style="font-size: 1.1rem; margin: 0">Senha</h2>
          <div class="field">
            <label for="new_password">Nova senha</label>
            <input id="new_password" v-model="newPassword" class="input" type="password" autocomplete="new-password" required minlength="6" />
          </div>
          <div class="row" style="justify-content: flex-end">
            <button class="btn btn--outline" type="submit" :disabled="changingPassword"><KeyRound /> Alterar senha</button>
          </div>
        </form>

        <section class="card">
          <h2 style="font-size: 1.1rem">Histórico de avaliações</h2>
          <div v-if="attempts.length" class="table-wrap">
            <table class="data-table">
              <thead>
                <tr><th>Avaliação</th><th>Tentativa</th><th>Nota</th><th>Resultado</th><th>Data</th></tr>
              </thead>
              <tbody>
                <tr v-for="a in attempts" :key="a.id">
                  <td>
                    <RouterLink
                      v-if="assessmentInfo[a.assessment_id]"
                      :to="`/cursos/${courseSlug(a.course_id)}/avaliacoes/${assessmentInfo[a.assessment_id].slug}?attempt=${a.id}`"
                    >
                      {{ assessmentInfo[a.assessment_id].title }}
                    </RouterLink>
                    <span v-else>Avaliação</span>
                  </td>
                  <td>{{ a.attempt_number }}ª</td>
                  <td>{{ formatPct(a.pct, 1) }}</td>
                  <td><span class="badge" :class="a.passed ? 'badge--primary' : 'badge--danger'">{{ a.passed ? 'Aprovado' : 'Reprovado' }}</span></td>
                  <td>{{ formatDateTime(a.submitted_at) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-else class="muted small" style="margin: 0">Você ainda não fez nenhuma avaliação.</p>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.profile-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
}

@media (min-width: 1024px) {
  .profile-grid {
    grid-template-columns: 340px 1fr;
    align-items: start;
  }
}

.hero {
  text-align: center;
}

.hero__avatar {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.hero__cam {
  position: absolute;
  right: -2px;
  bottom: -2px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--primary);
  color: var(--on-primary);
  border: 2px solid var(--surface);
}

.hero__cam svg {
  width: 16px;
  height: 16px;
}

.hero__avatar.is-busy {
  opacity: 0.6;
}

.stats-2 {
  grid-template-columns: 1fr 1fr;
}
</style>
