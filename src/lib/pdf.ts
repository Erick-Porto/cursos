// Relatório em PDF de uma tentativa de avaliação (gerado no navegador).
// A tentativa fica salva no banco: o código de verificação impresso é o id dela.
import { formatDateTime, formatPct, plainText } from '@/lib/format'
import type { AnswerValue, Assessment, Attempt, Course, Profile, Question } from '@/types/db'

export interface ReportInput {
  attempt: Attempt
  assessment: Assessment
  course: Course
  lessonTitle?: string | null
  profile: Profile | null
  questions: Question[]
}

export function answerToText(question: Question | undefined, value: unknown): string {
  if (value === null || value === undefined || value === '') return 'Não respondida'
  if (!question) return String(value)
  const opts = question.options ?? []
  const label = (key: string) => opts.find((o) => o.key === key)?.text ?? key
  switch (question.type) {
    case 'single':
      return label(String(value))
    case 'multiple':
      return Array.isArray(value) && value.length ? value.map((k) => label(String(k))).join('; ') : 'Não respondida'
    case 'truefalse':
      return String(value) === 'true' ? 'Verdadeiro' : 'Falso'
    case 'fill':
      if (Array.isArray(value)) {
        // gabarito: lista de listas de variantes; resposta: lista de textos
        return value
          .map((v) => (Array.isArray(v) ? String(v[0] ?? '') : String(v)))
          .filter((s) => s.length)
          .join(' / ')
      }
      return String(value)
    default:
      return String(value as AnswerValue)
  }
}

export async function downloadAttemptPdf(input: ReportInput): Promise<void> {
  const { jsPDF } = await import('jspdf')
  const { attempt, assessment, course, profile, questions, lessonTitle } = input
  const byId = new Map(questions.map((q) => [q.id, q]))

  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 16
  const contentW = pageW - margin * 2
  let y = 0

  const DARK: [number, number, number] = [11, 16, 32]
  const GREEN: [number, number, number] = [16, 185, 129]
  const RED: [number, number, number] = [220, 38, 38]
  const TEXT: [number, number, number] = [15, 23, 42]
  const MUTED: [number, number, number] = [100, 116, 139]

  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - margin - 8) {
      doc.addPage()
      y = margin
    }
  }

  // Cabeçalho
  doc.setFillColor(...DARK)
  doc.rect(0, 0, pageW, 40, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text(doc.splitTextToSize(assessment.title, contentW), margin, 15)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(180, 191, 211)
  doc.text(`${course.title}${lessonTitle ? ` · ${lessonTitle}` : ''}`, margin, 24)
  doc.text(`Aluno(a): ${profile?.full_name || '—'}`, margin, 31)
  doc.text(`Data: ${formatDateTime(attempt.submitted_at)}`, pageW - margin, 31, { align: 'right' })
  doc.text(`Tentativa nº ${attempt.attempt_number}`, pageW - margin, 24, { align: 'right' })
  y = 50

  // Resultado
  const pct = Number(attempt.pct)
  doc.setTextColor(...TEXT)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text(`Resultado: ${formatPct(pct, 1)} (${attempt.score} de ${attempt.max_score} pontos)`, margin, y)
  y += 7
  doc.setFontSize(11)
  doc.setTextColor(...(attempt.passed ? GREEN : RED))
  doc.text(
    attempt.passed
      ? `APROVADO(A) — nota mínima ${formatPct(assessment.passing_score)}`
      : `NÃO APROVADO(A) — nota mínima ${formatPct(assessment.passing_score)}`,
    margin,
    y,
  )
  y += 5
  // barra de desempenho
  doc.setFillColor(226, 232, 240)
  doc.roundedRect(margin, y, contentW, 4, 2, 2, 'F')
  doc.setFillColor(...(attempt.passed ? GREEN : RED))
  doc.roundedRect(margin, y, Math.max(2, (contentW * Math.min(100, pct)) / 100), 4, 2, 2, 'F')
  y += 12

  // Questões
  const details = [...attempt.details].sort((a, b) => a.position - b.position)
  details.forEach((d, i) => {
    const q = byId.get(d.question_id)
    const prompt = plainText(q?.prompt_md ?? `Questão ${d.key}`)
    const promptLines = doc.splitTextToSize(`${i + 1}. ${prompt}`, contentW)
    const userLines = doc.splitTextToSize(`Sua resposta: ${answerToText(q, d.user_answer)}`, contentW)
    const correctLines =
      d.correct_answer !== null && d.correct_answer !== undefined && !d.correct
        ? doc.splitTextToSize(`Resposta esperada: ${answerToText(q, d.correct_answer)}`, contentW)
        : []
    const needed = (promptLines.length + userLines.length + correctLines.length) * 5 + 12
    ensureSpace(needed)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10.5)
    doc.setTextColor(...TEXT)
    doc.text(promptLines, margin, y)
    y += promptLines.length * 5

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(...(d.correct ? TEXT : RED))
    doc.text(userLines, margin, y)
    y += userLines.length * 5

    if (correctLines.length) {
      doc.setTextColor(...MUTED)
      doc.text(correctLines, margin, y)
      y += correctLines.length * 5
    }

    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...(d.correct ? GREEN : RED))
    doc.text(`${d.correct ? 'Correta' : 'Incorreta'} · ${d.earned}/${d.points} pt`, margin, y)
    y += 4
    doc.setDrawColor(226, 232, 240)
    doc.line(margin, y, pageW - margin, y)
    y += 6
  })

  // Rodapé com código de verificação em todas as páginas
  const pages = doc.getNumberOfPages()
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...MUTED)
    doc.text(`Código de verificação: ${attempt.id}`, margin, pageH - 8)
    doc.text(`Página ${p} de ${pages}`, pageW - margin, pageH - 8, { align: 'right' })
  }

  const safe = (s: string) =>
    s
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase()
  doc.save(`resultado-${safe(assessment.title)}-${safe(profile?.full_name || 'aluno')}.pdf`)
}
