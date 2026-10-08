import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import { useThemeStore } from './stores/theme'
import './styles/tokens.css'
import './styles/base.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

// aplica o tema antes do primeiro render (evita piscar)
useThemeStore()

app.use(router)
app.mount('#app')
