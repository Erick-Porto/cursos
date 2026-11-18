// Regras de apresentação das listas de exercícios, usadas pelo aluno e pelo instrutor.
import type { DragOptions, Exercise, ExerciseAnswer, ExerciseAnswerValue, ExerciseTopic, QuestionOption } from '@/types/db'

/** Tentativas de cada questão de teoria (a função submit_exercise aplica o mesmo limite). */
export const MAX_TRIES = 3

/** Compilador on-line indicado para rodar os exercícios de código. */
export const COMPILER_URL = 'https://onecompiler.com/nodejs'

export type ExerciseState = 'pending' | 'trying' | 'correct' | 'wrong' | 'submitted' | 'returned' | 'approved'

export function exerciseState(ex: Exercise, a: ExerciseAnswer | null | undefined): ExerciseState {
  if (!a) return 'pending'
  if (ex.type === 'code') return a.status === 'approved' ? 'approved' : a.status === 'returned' ? 'returned' : 'submitted'
  if (a.correct) return 'correct'
  return a.tries >= MAX_TRIES ? 'wrong' : 'trying'
}

export const EXERCISE_STATE_LABEL: Record<ExerciseState, string> = {
  pending: 'A fazer',
  trying: 'Tente de novo',
  correct: 'Acertou',
  wrong: 'Encerrada',
  submitted: 'Entregue',
  returned: 'Refazer',
  approved: 'Aprovado',
}

export const EXERCISE_STATE_BADGE: Record<ExerciseState, string> = {
  pending: '',
  trying: 'badge--warning',
  correct: 'badge--primary',
  wrong: 'badge--danger',
  submitted: 'badge--info',
  returned: 'badge--warning',
  approved: 'badge--primary',
}

/** Feito: o aluno não tem mais nada a fazer neste exercício por enquanto. */
export function isExerciseDone(state: ExerciseState): boolean {
  return state === 'correct' || state === 'wrong' || state === 'submitted' || state === 'approved'
}

export const EXERCISE_TYPE_LABEL: Record<Exercise['type'], string> = {
  code: 'Código',
  single: 'Múltipla escolha',
  multiple: 'Marque todas as corretas',
  truefalse: 'Verdadeiro ou falso',
  fill: 'Complete as lacunas',
  drag: 'Arraste e solte',
}

export const dragOptions = (ex: Exercise): DragOptions | null =>
  ex.type === 'drag' && ex.options && !Array.isArray(ex.options) ? ex.options : null

export const choiceOptions = (ex: Exercise): QuestionOption[] => (Array.isArray(ex.options) ? ex.options : [])

/** A resposta está completa o bastante para ser conferida? */
export function isAnswerReady(ex: Exercise, value: ExerciseAnswerValue): boolean {
  if (ex.type === 'truefalse') return typeof value === 'boolean'
  if (ex.type === 'single') return typeof value === 'string' && value !== ''
  if (ex.type === 'multiple') return Array.isArray(value) && value.length > 0
  if (ex.type === 'fill') {
    const blanks = (ex.prompt_md.match(/_{3,}/g) ?? []).length
    return Array.isArray(value) && value.length === blanks && value.every((v) => String(v).trim() !== '')
  }
  if (ex.type === 'drag') {
    const slots = dragOptions(ex)?.slots ?? []
    return !!value && typeof value === 'object' && !Array.isArray(value) && slots.every((s) => !!value[s.key])
  }
  return false
}

/** Botão "Copiar" dos blocos de código renderizados pelo Markdown (mesmo comportamento do player de slides). */
export async function copyCodeBlock(e: MouseEvent) {
  const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-copy]')
  if (!btn) return
  const code = btn.closest('.code-block')?.querySelector('code')?.textContent ?? ''
  try {
    await navigator.clipboard.writeText(code)
    btn.textContent = 'Copiado'
    btn.setAttribute('data-done', '')
    setTimeout(() => {
      btn.textContent = 'Copiar'
      btn.removeAttribute('data-done')
    }, 1600)
  } catch {
    btn.textContent = 'Erro'
  }
}

export interface TopicLesson {
  key: string
  title: string
  topics: ExerciseTopic[]
}

export interface TopicModule {
  key: string
  title: string
  lessons: TopicLesson[]
}

/** Agrupa os temas por módulo e aula, na ordem da lista. */
export function groupTopics(topics: ExerciseTopic[]): TopicModule[] {
  const modules: TopicModule[] = []
  for (const t of topics) {
    const moduleTitle = t.module_title ?? 'Temas'
    let mod = modules.find((m) => m.title === moduleTitle)
    if (!mod) modules.push((mod = { key: moduleTitle, title: moduleTitle, lessons: [] }))
    const lessonKey = t.lesson_slug ?? t.slug
    let lesson = mod.lessons.find((l) => l.key === lessonKey)
    if (!lesson) mod.lessons.push((lesson = { key: lessonKey, title: t.lesson_title ?? t.title, topics: [] }))
    lesson.topics.push(t)
  }
  return modules
}
