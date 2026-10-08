import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Achievement } from '@/types/db'

export type ToastKind = 'info' | 'success' | 'error' | 'achievement' | 'xp'

export interface Toast {
  id: number
  kind: ToastKind
  title: string
  message?: string
  timeout: number
  achievement?: Achievement
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])
  let seq = 0

  function push(t: Omit<Toast, 'id' | 'timeout'> & { timeout?: number }): number {
    const id = ++seq
    const toast: Toast = { timeout: 4500, ...t, id }
    toasts.value.push(toast)
    if (toast.timeout > 0) setTimeout(() => dismiss(id), toast.timeout)
    return id
  }

  function dismiss(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  const success = (title: string, message?: string) => push({ kind: 'success', title, message })
  const error = (title: string, message?: string) => push({ kind: 'error', title, message, timeout: 6500 })
  const info = (title: string, message?: string) => push({ kind: 'info', title, message })

  /** Mostra XP ganho e conquistas novas devolvidas pelas RPCs. */
  function celebrate(result: { xp_gained?: number; new_achievements?: Achievement[] }) {
    if (result.xp_gained && result.xp_gained > 0) {
      push({ kind: 'xp', title: `+${result.xp_gained} XP`, timeout: 3500 })
    }
    for (const a of result.new_achievements ?? []) {
      push({ kind: 'achievement', title: a.title, message: a.description, achievement: a, timeout: 7000 })
    }
  }

  return { toasts, push, dismiss, success, error, info, celebrate }
})
