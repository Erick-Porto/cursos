import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { currentUserId, supabase } from '@/lib/supabase'
import type { Achievement, UserAchievement } from '@/types/db'

export const useAchievementsStore = defineStore('achievements', () => {
  const all = ref<Achievement[]>([])
  const earned = ref<UserAchievement[]>([])
  const loaded = ref(false)

  const earnedAt = computed(() => new Map(earned.value.map((ua) => [ua.achievement_id, ua.earned_at])))
  const earnedCount = computed(() => earned.value.length)
  const globalAchievements = computed(() => all.value.filter((a) => a.course_id === null))
  const recent = computed(() =>
    [...earned.value]
      .sort((a, b) => b.earned_at.localeCompare(a.earned_at))
      .map((ua) => ({ ...ua, achievement: all.value.find((a) => a.id === ua.achievement_id) }))
      .filter((x) => x.achievement),
  )

  async function load(force = false) {
    if (loaded.value && !force) return
    // Filtra pelo usuário: para instrutor/admin a RLS devolve as conquistas de todos.
    const uid = await currentUserId()
    const [a, ua] = await Promise.all([
      supabase.from('achievements').select('*').order('position'),
      uid ? supabase.from('user_achievements').select('*').eq('user_id', uid) : Promise.resolve({ data: [] }),
    ])
    if (a.error) throw a.error
    all.value = (a.data as Achievement[]) ?? []
    earned.value = (ua.data as UserAchievement[]) ?? []
    loaded.value = true
  }

  function isEarned(id: string): boolean {
    return earnedAt.value.has(id)
  }

  /** Registra localmente conquistas devolvidas por uma RPC (sem nova consulta). */
  function markEarned(list: Achievement[]) {
    const now = new Date().toISOString()
    for (const a of list) {
      if (!all.value.some((x) => x.id === a.id)) all.value.push(a)
      if (!earnedAt.value.has(a.id)) earned.value.push({ user_id: '', achievement_id: a.id, earned_at: now })
    }
  }

  function reset() {
    all.value = []
    earned.value = []
    loaded.value = false
  }

  return { all, earned, loaded, earnedAt, earnedCount, globalAchievements, recent, load, isEarned, markEarned, reset }
})
