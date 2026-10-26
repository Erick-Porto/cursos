const dateFmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
const dateTimeFmt = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  return dateFmt.format(new Date(iso)).replace('.', '')
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '—'
  return dateTimeFmt.format(new Date(iso))
}

export function formatMinutes(minutes: number | null | undefined): string {
  if (!minutes) return '—'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m} min`
  return m === 0 ? `${h} h` : `${h} h ${m} min`
}

export function formatSeconds(seconds: number | null | undefined): string {
  if (!seconds || seconds < 60) return '< 1 min'
  return formatMinutes(Math.round(seconds / 60))
}

export function formatPct(value: number | string | null | undefined, digits = 0): string {
  const n = Number(value ?? 0)
  return `${n.toLocaleString('pt-BR', { maximumFractionDigits: digits, minimumFractionDigits: 0 })}%`
}

export function formatNumber(value: number | null | undefined): string {
  return Number(value ?? 0).toLocaleString('pt-BR')
}

export function plural(n: number, singular: string, pluralForm: string): string {
  return `${formatNumber(n)} ${n === 1 ? singular : pluralForm}`
}

export function relativeTime(iso: string | null | undefined): string {
  if (!iso) return '—'
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.round(diff / 60000)
  if (min < 1) return 'agora'
  if (min < 60) return `há ${min} min`
  const h = Math.round(min / 60)
  if (h < 24) return `há ${h} h`
  const d = Math.round(h / 24)
  if (d < 30) return d === 1 ? 'ontem' : `há ${d} dias`
  const m = Math.round(d / 30)
  if (m < 12) return `há ${m} ${m === 1 ? 'mês' : 'meses'}`
  const y = Math.round(m / 12)
  return `há ${y} ${y === 1 ? 'ano' : 'anos'}`
}

export function initials(name: string | null | undefined): string {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export const LEVEL_LABEL: Record<string, string> = {
  iniciante: 'Iniciante',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
}

/** Converte markdown simples em texto puro (para PDF e resumos). */
export function plainText(md: string | null | undefined): string {
  if (!md) return ''
  return md
    .replace(/```[\s\S]*?```/g, (m) => m.replace(/```\w*\n?/g, ''))
    .replace(/!\[((?:[^[\]]|\[[^[\]]*\])*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`~#>]+/g, '')
    .replace(/\n{2,}/g, '\n')
    .trim()
}

export function shuffle<T>(items: T[], seed?: number): T[] {
  const arr = [...items]
  let s = seed ?? Math.floor(Math.random() * 2 ** 31)
  const rand = () => {
    // xorshift simples e determinístico quando há seed
    s ^= s << 13
    s ^= s >>> 17
    s ^= s << 5
    return ((s >>> 0) % 100000) / 100000
  }
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
