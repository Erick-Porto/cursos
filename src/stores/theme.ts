import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

type Theme = 'dark' | 'light'
const KEY = 'cursos:theme'

function initial(): Theme {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'dark' || saved === 'light') return saved
  } catch {
    /* armazenamento indisponível */
  }
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>(initial())

  function apply(t: Theme) {
    document.documentElement.setAttribute('data-theme', t)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t === 'dark' ? '#0b1020' : '#f3f5fa')
  }

  function toggle() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  watch(
    theme,
    (t) => {
      try {
        localStorage.setItem(KEY, t)
      } catch {
        /* ignorar */
      }
      apply(t)
    },
    { immediate: true },
  )

  return { theme, toggle }
})
