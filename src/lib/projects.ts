// Situação de um projeto avaliado do ponto de vista do aluno, com rótulo e cor
// do badge. Usado na página do curso, na página do projeto e no painel do instrutor.
import type { Project, ProjectSubmission } from '@/types/db'

export type ProjectState = 'pending' | 'submitted' | 'returned' | 'passed' | 'failed'

export function projectState(sub: ProjectSubmission | null | undefined): ProjectState {
  if (!sub) return 'pending'
  if (sub.status === 'submitted') return 'submitted'
  if (sub.status === 'returned') return 'returned'
  return sub.passed ? 'passed' : 'failed'
}

export const PROJECT_STATE_LABEL: Record<ProjectState, string> = {
  pending: 'Não entregue',
  submitted: 'Aguardando correção',
  returned: 'Devolvido para ajustes',
  passed: 'Aprovado',
  failed: 'Reprovado',
}

export const PROJECT_STATE_BADGE: Record<ProjectState, string> = {
  pending: '',
  submitted: 'badge--info',
  returned: 'badge--warning',
  passed: 'badge--primary',
  failed: 'badge--danger',
}

/** Projetos agrupados pela seção ("Módulo Básico", "Módulo Específico"), na ordem em que aparecem. */
export function groupBySection<T extends Pick<Project, 'section'>>(projects: T[]): Array<{ section: string | null; projects: T[] }> {
  const groups: Array<{ section: string | null; projects: T[] }> = []
  for (const p of projects) {
    const last = groups[groups.length - 1]
    if (last && last.section === p.section) last.projects.push(p)
    else groups.push({ section: p.section, projects: [p] })
  }
  return groups
}

/** Soma dos pontos da rubrica (normalmente 100). */
export function rubricTotal(project: Pick<Project, 'rubric'>): number {
  return project.rubric.reduce((s, c) => s + Number(c.points), 0)
}
