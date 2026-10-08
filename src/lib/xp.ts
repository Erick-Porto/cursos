import type { Rarity } from '@/types/db'

/** XP acumulado necessário para entrar em cada nível (índice 0 = nível 1). */
export const LEVELS = [
  0, 100, 250, 500, 850, 1300, 1900, 2600, 3400, 4300, 5300, 6400, 7600, 9000, 10500, 12500, 15000, 18000, 22000,
  27000,
]

const LEVEL_TITLES = [
  'Iniciante',
  'Aprendiz',
  'Estudante',
  'Praticante',
  'Dedicado',
  'Competente',
  'Proficiente',
  'Avançado',
  'Especialista',
  'Mestre',
]

export interface LevelInfo {
  level: number
  title: string
  floor: number
  next: number | null
  pct: number
  toNext: number
}

export function levelInfo(xp: number): LevelInfo {
  let level = 1
  for (let i = 1; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i]) level = i + 1
    else break
  }
  const floor = LEVELS[level - 1] ?? 0
  const next = LEVELS[level] ?? null
  const pct = next ? Math.min(100, Math.round(((xp - floor) / (next - floor)) * 100)) : 100
  const title = LEVEL_TITLES[Math.min(Math.floor((level - 1) / 2), LEVEL_TITLES.length - 1)]
  return { level, title, floor, next, pct, toNext: next ? next - xp : 0 }
}

export const RARITY_LABEL: Record<Rarity, string> = {
  common: 'Comum',
  rare: 'Rara',
  epic: 'Épica',
  legendary: 'Lendária',
}

export const XP_RULES = [
  { label: 'Concluir uma aula', xp: 50 },
  { label: 'Aprovação em quiz', xp: 100 },
  { label: 'Aprovação em prova', xp: 150 },
  { label: 'Bônus por nota máxima', xp: 50 },
  { label: 'Concluir um curso', xp: 300 },
]
