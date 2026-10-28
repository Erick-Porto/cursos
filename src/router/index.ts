import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    guest?: boolean
    staff?: boolean
    layout?: 'app' | 'auth' | 'player'
    title?: string
  }
}

// Hash history: funciona no GitHub Pages sem configuração de fallback.
export const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    if (to.path === from.path) return undefined
    return { top: 0 }
  },
  routes: [
    { path: '/', redirect: '/inicio' },

    { path: '/entrar', component: () => import('@/views/auth/LoginView.vue'), meta: { guest: true, layout: 'auth', title: 'Entrar' } },
    { path: '/cadastro', component: () => import('@/views/auth/RegisterView.vue'), meta: { guest: true, layout: 'auth', title: 'Criar conta' } },
    { path: '/recuperar-senha', component: () => import('@/views/auth/ForgotPasswordView.vue'), meta: { guest: true, layout: 'auth', title: 'Recuperar senha' } },
    { path: '/nova-senha', component: () => import('@/views/auth/ResetPasswordView.vue'), meta: { requiresAuth: true, layout: 'auth', title: 'Nova senha' } },

    { path: '/inicio', component: () => import('@/views/DashboardView.vue'), meta: { requiresAuth: true, title: 'Início' } },
    { path: '/cursos', component: () => import('@/views/CatalogView.vue'), meta: { requiresAuth: true, title: 'Cursos' } },
    { path: '/cursos/:course', component: () => import('@/views/CourseView.vue'), meta: { requiresAuth: true } },
    { path: '/cursos/:course/aulas/:lesson', component: () => import('@/views/LessonView.vue'), meta: { requiresAuth: true, layout: 'player' } },
    { path: '/cursos/:course/avaliacoes/:assessment', component: () => import('@/views/AssessmentView.vue'), meta: { requiresAuth: true, layout: 'player' } },
    { path: '/cursos/:course/projetos/:project', component: () => import('@/views/ProjectView.vue'), meta: { requiresAuth: true, title: 'Projeto' } },
    { path: '/conquistas', component: () => import('@/views/AchievementsView.vue'), meta: { requiresAuth: true, title: 'Conquistas' } },
    { path: '/perfil', component: () => import('@/views/ProfileView.vue'), meta: { requiresAuth: true, title: 'Perfil' } },
    { path: '/instrutor', component: () => import('@/views/InstructorView.vue'), meta: { requiresAuth: true, staff: true, title: 'Instrutor' } },
    { path: '/instrutor/roteiros/:course/:script', component: () => import('@/views/InstructorScriptView.vue'), meta: { requiresAuth: true, staff: true, title: 'Roteiro de aula' } },
    { path: '/instrutor/projetos/:course/:project/:student', component: () => import('@/views/InstructorGradeView.vue'), meta: { requiresAuth: true, staff: true, title: 'Correção de projeto' } },

    { path: '/:pathMatch(.*)*', component: () => import('@/views/NotFoundView.vue'), meta: { title: 'Página não encontrada' } },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  await auth.init()

  if (auth.recoveryMode && to.path !== '/nova-senha') return '/nova-senha'
  if (to.meta.requiresAuth && !auth.isAuthenticated) return { path: '/entrar', query: { next: to.fullPath } }
  if (to.meta.guest && auth.isAuthenticated) return '/inicio'
  if (to.meta.staff && !auth.isStaff) return '/inicio'
  return true
})

router.afterEach((to) => {
  const title = to.meta.title
  document.title = title ? `${title} · Cursos` : 'Cursos'
})
