import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Session } from '@supabase/supabase-js'
import { avatarPublicUrl, redirectUrl, supabase } from '@/lib/supabase'
import type { Profile, UserRole, UserStats } from '@/types/db'

export const useAuthStore = defineStore('auth', () => {
  const session = ref<Session | null>(null)
  const profile = ref<Profile | null>(null)
  const stats = ref<UserStats | null>(null)
  const role = ref<UserRole>('student')
  const ready = ref(false)
  /** true quando o usuário chegou por link de recuperação de senha. */
  const recoveryMode = ref(false)

  const user = computed(() => session.value?.user ?? null)
  const isAuthenticated = computed(() => session.value !== null)
  const isStaff = computed(() => role.value === 'instructor' || role.value === 'admin')
  const displayName = computed(() => profile.value?.full_name || user.value?.email?.split('@')[0] || 'Aluno')

  let initPromise: Promise<void> | null = null

  function init(): Promise<void> {
    if (initPromise) return initPromise
    initPromise = (async () => {
      const { data } = await supabase.auth.getSession()
      session.value = data.session
      if (session.value) await loadProfile()
      ready.value = true

      supabase.auth.onAuthStateChange((event, next) => {
        session.value = next
        if (event === 'PASSWORD_RECOVERY') recoveryMode.value = true
        if (!next) {
          profile.value = null
          stats.value = null
          role.value = 'student'
          return
        }
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'INITIAL_SESSION') {
          // Não aguardar chamadas ao Supabase dentro do callback (evita deadlock do lock de auth).
          setTimeout(() => void loadProfile(), 0)
        }
      })
    })()
    return initPromise
  }

  async function loadProfile() {
    const uid = user.value?.id
    if (!uid) return
    const [p, r, s] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', uid).maybeSingle(),
      supabase.from('user_roles').select('role').eq('user_id', uid).maybeSingle(),
      supabase.from('user_stats').select('*').eq('user_id', uid).maybeSingle(),
    ])
    profile.value = (p.data as Profile | null) ?? null
    role.value = ((r.data as { role: UserRole } | null)?.role ?? 'student') as UserRole
    stats.value = (s.data as UserStats | null) ?? null
  }

  async function refreshStats() {
    const uid = user.value?.id
    if (!uid) return
    const { data } = await supabase.from('user_stats').select('*').eq('user_id', uid).maybeSingle()
    if (data) stats.value = data as UserStats
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  /** Devolve true quando o cadastro exige confirmação por e-mail. */
  async function signUp(email: string, password: string, fullName: string): Promise<boolean> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName }, emailRedirectTo: redirectUrl('confirm') },
    })
    if (error) throw error
    return data.session === null
  }

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: redirectUrl() },
    })
    if (error) throw error
  }

  async function requestPasswordReset(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: redirectUrl('recovery') })
    if (error) throw error
  }

  async function updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw error
    recoveryMode.value = false
  }

  async function updateProfile(patch: Partial<Pick<Profile, 'full_name' | 'username' | 'bio' | 'avatar_url'>>) {
    const uid = user.value?.id
    if (!uid) throw new Error('não autenticado')
    const { data, error } = await supabase.from('profiles').update(patch).eq('id', uid).select().single()
    if (error) throw error
    profile.value = data as Profile
  }

  async function uploadAvatar(file: File) {
    const uid = user.value?.id
    if (!uid) throw new Error('não autenticado')
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const path = `${uid}/avatar-${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true, contentType: file.type })
    if (error) throw error
    await updateProfile({ avatar_url: avatarPublicUrl(path) })
  }

  async function signOut() {
    await supabase.auth.signOut()
    session.value = null
    profile.value = null
    stats.value = null
    role.value = 'student'
    recoveryMode.value = false
  }

  return {
    session,
    user,
    profile,
    stats,
    role,
    ready,
    recoveryMode,
    isAuthenticated,
    isStaff,
    displayName,
    init,
    loadProfile,
    refreshStats,
    signIn,
    signUp,
    signInWithGoogle,
    requestPasswordReset,
    updatePassword,
    updateProfile,
    uploadAvatar,
    signOut,
  }
})
