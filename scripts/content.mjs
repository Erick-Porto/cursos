#!/usr/bin/env node
// =====================================================================
// Conteúdo dos cursos: validação e sincronização com o Supabase.
//
//   npm run content:check                 valida content/courses/**
//   npm run content:sync                  envia para o Supabase (upsert)
//   npm run content:sync:prune            idem, removendo o que saiu do repositório
//   node --env-file=.env scripts/content.mjs sync --course=fundamentos-sql
//
// O formato dos arquivos está descrito em GUIA_DE_CONTEUDO.md.
// =====================================================================
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, dirname, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const CONTENT_DIR = join(ROOT, 'content', 'courses')

const args = process.argv.slice(2)
const command = args[0]
const prune = args.includes('--prune')
const onlyCourse = (args.find((a) => a.startsWith('--course=')) ?? '').split('=')[1] || null

const LEVELS = ['iniciante', 'intermediario', 'avancado']
const RARITIES = ['common', 'rare', 'epic', 'legendary']
const RULE_TYPES = ['lessons_completed', 'course_completed', 'assessments_passed', 'perfect_score', 'first_try_pass', 'xp_reached', 'streak_days']
const QUESTION_TYPES = ['single', 'multiple', 'truefalse', 'fill']
const BLOCKS = ['info', 'tip', 'warning', 'danger', 'example', 'summary', 'goal', 'quote', 'question', 'columns', 'col', 'center', 'steps']
const MIME = {
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.avif': 'image/avif', '.mp4': 'video/mp4', '.pdf': 'application/pdf',
}
const EMOJI = /\p{Extended_Pictographic}/u
const MAX_IMAGE_BYTES = 400 * 1024
const MAX_WORDS_WARN = 130
const MAX_WORDS_ERROR = 200

// ---------------------------------------------------------------------
// util
// ---------------------------------------------------------------------
const ICONS = (() => {
  const src = readFileSync(join(ROOT, 'src', 'lib', 'icons.ts'), 'utf8')
  const names = new Set()
  for (const m of src.matchAll(/^\s+'?([a-z][a-z0-9-]*)'?:\s*[A-Z]/gm)) names.add(m[1])
  return names
})()

class Report {
  constructor() {
    this.errors = []
    this.warnings = []
  }
  error(where, msg) {
    this.errors.push(`${where}: ${msg}`)
  }
  warn(where, msg) {
    this.warnings.push(`${where}: ${msg}`)
  }
}

function rel(p) {
  return p.replace(ROOT, '').replace(/\\/g, '/').replace(/^\//, '')
}

function splitSlides(source) {
  const lines = source.replace(/\r\n?/g, '\n').split('\n')
  const slides = []
  let current = []
  let fence = null
  for (const line of lines) {
    const m = line.match(/^\s{0,3}(`{3,}|~{3,})/)
    if (m) {
      const mark = m[1]
      if (!fence) fence = mark
      else if (mark[0] === fence[0] && mark.length >= fence.length) fence = null
      current.push(line)
      continue
    }
    if (!fence && /^-{3,}\s*$/.test(line)) {
      slides.push(current.join('\n'))
      current = []
      continue
    }
    current.push(line)
  }
  slides.push(current.join('\n'))
  return slides.map((s) => s.trim()).filter(Boolean)
}

function wordCount(text) {
  return text.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length
}

function normalizeOptions(options) {
  if (!options) return null
  if (Array.isArray(options)) return options
  return Object.entries(options).map(([key, text]) => ({ key, text }))
}

// ---------------------------------------------------------------------
// leitura
// ---------------------------------------------------------------------
function loadCourse(dir, report) {
  const slug = basename(dir)
  const jsonPath = join(dir, 'course.json')
  const where = rel(jsonPath)
  if (!existsSync(jsonPath)) {
    report.error(where, 'arquivo course.json não encontrado')
    return null
  }
  let json
  try {
    json = JSON.parse(readFileSync(jsonPath, 'utf8'))
  } catch (e) {
    report.error(where, `JSON inválido: ${e.message}`)
    return null
  }
  const descPath = join(dir, 'description.md')
  const description_md = existsSync(descPath) ? readFileSync(descPath, 'utf8').trim() : (json.description_md ?? null)

  const lessonsDir = join(dir, 'lessons')
  const lessons = existsSync(lessonsDir)
    ? readdirSync(lessonsDir)
        .filter((f) => f.endsWith('.md'))
        .sort()
        .map((f) => loadLesson(join(lessonsDir, f)))
    : []

  const assessmentsDir = join(dir, 'assessments')
  const assessments = existsSync(assessmentsDir)
    ? readdirSync(assessmentsDir)
        .filter((f) => f.endsWith('.json'))
        .sort()
        .map((f, i) => loadAssessment(join(assessmentsDir, f), i + 1, report))
        .filter(Boolean)
    : []

  const imagesDir = join(dir, 'images')
  const images = existsSync(imagesDir) ? readdirSync(imagesDir).filter((f) => !f.startsWith('.')).map((f) => join(imagesDir, f)) : []

  return { dir, slug, json, description_md, lessons, assessments, images }
}

function loadLesson(file) {
  const raw = readFileSync(file, 'utf8')
  const { data, content } = matter(raw)
  const name = basename(file, '.md')
  const m = name.match(/^(\d{1,3})-([a-z0-9-]+)$/)
  const body = content.replace(/\r\n?/g, '\n').trim()
  return {
    file,
    name,
    position: m ? Number(m[1]) : null,
    slug: m ? m[2] : name,
    fm: data,
    body,
    slides: splitSlides(body),
  }
}

function loadAssessment(file, index, report) {
  try {
    const json = JSON.parse(readFileSync(file, 'utf8'))
    const name = basename(file, '.json')
    const m = name.match(/^(\d{1,3})-([a-z0-9-]+)$/)
    return { file, slug: m ? m[2] : name, position: json.position ?? (m ? Number(m[1]) : index), json }
  } catch (e) {
    report.error(rel(file), `JSON inválido: ${e.message}`)
    return null
  }
}

// ---------------------------------------------------------------------
// validação
// ---------------------------------------------------------------------
function validateCourse(course, report) {
  const { json, slug, dir } = course
  const where = rel(join(dir, 'course.json'))

  if (json.slug !== slug) report.error(where, `"slug" (${json.slug}) deve ser igual ao nome da pasta (${slug})`)
  if (!/^[a-z0-9-]+$/.test(slug)) report.error(where, 'slug da pasta deve usar só letras minúsculas, números e hífens')
  if (!json.title) report.error(where, '"title" é obrigatório')
  if (json.level && !LEVELS.includes(json.level)) report.error(where, `"level" deve ser um de: ${LEVELS.join(', ')}`)
  if (json.icon && !ICONS.has(json.icon)) report.error(where, `"icon" ${json.icon} não existe em src/lib/icons.ts`)
  if (json.color && !/^#[0-9a-f]{6}$/i.test(json.color)) report.error(where, '"color" deve ser hexadecimal (#rrggbb)')
  if (json.tags && !Array.isArray(json.tags)) report.error(where, '"tags" deve ser uma lista')
  if (!course.description_md) report.warn(where, 'curso sem descrição (description.md ou description_md)')
  if (EMOJI.test(JSON.stringify(json))) report.error(where, 'não use emojis; use ícones (campo icon)')

  const modules = Array.isArray(json.modules) ? json.modules : []
  const moduleSlugs = new Set()
  for (const m of modules) {
    if (!m.slug || !m.title) report.error(where, 'cada módulo precisa de "slug" e "title"')
    if (moduleSlugs.has(m.slug)) report.error(where, `módulo duplicado: ${m.slug}`)
    moduleSlugs.add(m.slug)
  }

  const achievements = Array.isArray(json.achievements) ? json.achievements : []
  const achSlugs = new Set()
  for (const a of achievements) {
    const w = `${where} (conquista ${a.slug ?? '?'})`
    if (!a.slug || !a.title || !a.description) report.error(w, 'conquista precisa de slug, title e description')
    if (achSlugs.has(a.slug)) report.error(w, 'slug de conquista duplicado')
    achSlugs.add(a.slug)
    if (a.icon && !ICONS.has(a.icon)) report.error(w, `ícone ${a.icon} não existe em src/lib/icons.ts`)
    if (a.rarity && !RARITIES.includes(a.rarity)) report.error(w, `rarity deve ser um de: ${RARITIES.join(', ')}`)
    if (!a.rule || !RULE_TYPES.includes(a.rule.type)) report.error(w, `rule.type deve ser um de: ${RULE_TYPES.join(', ')}`)
  }

  // aulas
  const lessonSlugs = new Set()
  const positions = new Set()
  if (!course.lessons.length) report.warn(where, 'curso sem aulas')
  for (const l of course.lessons) {
    const lw = rel(l.file)
    if (l.position === null) report.error(lw, 'nome do arquivo deve ser NN-slug.md (ex.: 01-introducao.md)')
    if (positions.has(l.position)) report.error(lw, `posição ${l.position} repetida em outra aula`)
    positions.add(l.position)
    if (lessonSlugs.has(l.slug)) report.error(lw, `slug de aula repetido: ${l.slug}`)
    lessonSlugs.add(l.slug)
    if (!l.fm.title) report.error(lw, 'frontmatter precisa de "title"')
    if (!l.fm.summary) report.warn(lw, 'frontmatter sem "summary" (aparece na lista de aulas)')
    if (l.fm.module && !moduleSlugs.has(l.fm.module)) report.error(lw, `módulo "${l.fm.module}" não existe em course.json`)
    if (modules.length && !l.fm.module) report.warn(lw, 'aula sem "module" apesar de o curso ter módulos')
    if (l.fm.duration_minutes !== undefined && typeof l.fm.duration_minutes !== 'number') report.error(lw, '"duration_minutes" deve ser número')
    if (l.fm.objectives !== undefined && !Array.isArray(l.fm.objectives)) report.error(lw, '"objectives" deve ser uma lista')
    validateSlides(l, course, report)
  }

  // avaliações
  const assessmentSlugs = new Set()
  for (const a of course.assessments) {
    const aw = rel(a.file)
    if (assessmentSlugs.has(a.slug)) report.error(aw, `slug de avaliação repetido: ${a.slug}`)
    assessmentSlugs.add(a.slug)
    validateAssessment(a, lessonSlugs, report)
  }

  // imagens
  for (const img of course.images) {
    const iw = rel(img)
    const ext = extname(img).toLowerCase()
    if (!MIME[ext]) report.error(iw, `extensão ${ext} não suportada`)
    const size = statSync(img).size
    if (size > MAX_IMAGE_BYTES) report.warn(iw, `imagem com ${Math.round(size / 1024)} KB (ideal até ${MAX_IMAGE_BYTES / 1024} KB)`)
    if (!/^[a-z0-9._-]+$/.test(basename(img))) report.error(iw, 'nome de imagem deve usar só minúsculas, números, ponto, hífen e underline')
  }
}

function validateSlides(lesson, course, report) {
  const lw = rel(lesson.file)
  const { slides, body } = lesson
  if (slides.length < 4) report.warn(lw, `apenas ${slides.length} slide(s); aulas costumam ter entre 8 e 20`)
  if (slides.length > 30) report.warn(lw, `${slides.length} slides; considere dividir a aula`)
  if (EMOJI.test(body)) report.error(lw, 'não use emojis nos slides; use ícones dos blocos (:::tip etc.)')

  // "---" precisa de linha em branco antes (senão vira título setext no Markdown)
  const lines = body.split('\n')
  for (let i = 1; i < lines.length; i++) {
    if (/^-{3,}\s*$/.test(lines[i]) && lines[i - 1].trim() !== '') {
      report.warn(`${lw}:${i + 1}`, 'deixe uma linha em branco antes do separador "---"')
    }
  }

  slides.forEach((slide, i) => {
    const sw = `${lw} (slide ${i + 1})`
    const slideLines = slide.split('\n')
    const headings = slideLines.filter((l) => /^#{1,3}\s/.test(l))
    const first = slideLines[0] ?? ''

    if (i === 0) {
      if (!/^#\s/.test(first)) report.warn(sw, 'o primeiro slide deve ser a capa, começando com "# Título"')
    } else if (!/^(##|#)\s/.test(first)) {
      report.error(sw, 'slide deve começar com um título "## ..."')
    }
    if (headings.filter((h) => /^##\s/.test(h)).length > 1) report.warn(sw, 'mais de um "##" no slide; uma ideia por slide')

    const words = wordCount(slide)
    if (words > MAX_WORDS_ERROR) report.error(sw, `${words} palavras; máximo ${MAX_WORDS_ERROR}`)
    else if (words > MAX_WORDS_WARN) report.warn(sw, `${words} palavras; ideal até ${MAX_WORDS_WARN}`)

    // listas longas
    let run = 0
    for (const l of slideLines) {
      if (/^\s*([-*]|\d+\.)\s/.test(l)) run++
      else if (l.trim() === '') {
        if (run > 7) report.warn(sw, `lista com ${run} itens; prefira até 7`)
        run = 0
      }
    }
    if (run > 7) report.warn(sw, `lista com ${run} itens; prefira até 7`)

    // blocos :::
    let open = 0
    for (const l of slideLines) {
      const m = l.match(/^(:{3,})\s*([a-z]*)\s*(.*)$/)
      if (!m) continue
      if (m[2]) {
        if (!BLOCKS.includes(m[2])) report.error(sw, `bloco ":::${m[2]}" não existe (use: ${BLOCKS.join(', ')})`)
        open++
      } else open--
    }
    if (open !== 0) report.error(sw, 'bloco ::: aberto sem fechamento (ou fechado a mais)')

    // código sem linguagem
    for (const l of slideLines) {
      if (/^\s{0,3}```\s*$/.test(l) && !slideLines.some((x) => x !== l && /^\s{0,3}```\w/.test(x))) {
        /* fechamento */
      }
    }
    const fences = slideLines.filter((l) => /^\s{0,3}```/.test(l))
    for (let k = 0; k < fences.length; k += 2) {
      if (!/```\s*\w+/.test(fences[k])) report.warn(sw, 'bloco de código sem linguagem (ex.: ```sql)')
    }

    // imagens
    for (const m of slide.matchAll(/!\[([^\]]*)\]\(([^)\s]+)[^)]*\)/g)) {
      const alt = m[1]
      const src = m[2]
      if (!alt.trim()) report.warn(sw, `imagem ${src} sem texto alternativo`)
      if (/^(https?:)?\/\//i.test(src)) report.error(sw, `imagem externa (${src}); coloque o arquivo em images/`)
      else if (!src.startsWith('data:')) {
        const p = join(course.dir, src.replace(/^\.\//, ''))
        if (!existsSync(p)) report.error(sw, `imagem não encontrada: ${src}`)
      }
    }
  })
}

function validateAssessment(a, lessonSlugs, report) {
  const w = rel(a.file)
  const j = a.json
  if (!j.title) report.error(w, '"title" é obrigatório')
  if (j.lesson && !lessonSlugs.has(j.lesson)) report.error(w, `"lesson" ${j.lesson} não corresponde a nenhuma aula`)
  if (j.kind && !['quiz', 'exam'].includes(j.kind)) report.error(w, '"kind" deve ser quiz ou exam')
  if (j.passing_score !== undefined && (typeof j.passing_score !== 'number' || j.passing_score < 0 || j.passing_score > 100)) report.error(w, '"passing_score" deve ser um número de 0 a 100')
  if (j.max_attempts !== undefined && j.max_attempts !== null && (!Number.isInteger(j.max_attempts) || j.max_attempts < 1)) report.error(w, '"max_attempts" deve ser inteiro >= 1 ou null')
  if (j.time_limit_minutes !== undefined && j.time_limit_minutes !== null && (!Number.isInteger(j.time_limit_minutes) || j.time_limit_minutes < 1)) report.error(w, '"time_limit_minutes" deve ser inteiro >= 1 ou null')
  if (EMOJI.test(JSON.stringify(j))) report.error(w, 'não use emojis nas questões')

  const questions = Array.isArray(j.questions) ? j.questions : []
  if (!questions.length) report.error(w, 'avaliação sem questões')
  if (questions.length < 3) report.warn(w, 'poucas questões; quizzes costumam ter de 5 a 15')
  const ids = new Set()
  questions.forEach((q, i) => {
    const qw = `${w} (questão ${q.id ?? i + 1})`
    if (!q.id) report.error(qw, 'questão sem "id"')
    if (ids.has(q.id)) report.error(qw, `id repetido: ${q.id}`)
    ids.add(q.id)
    if (!QUESTION_TYPES.includes(q.type)) report.error(qw, `"type" deve ser um de: ${QUESTION_TYPES.join(', ')}`)
    if (!q.prompt) report.error(qw, 'questão sem "prompt"')
    if (q.points !== undefined && (typeof q.points !== 'number' || q.points <= 0)) report.error(qw, '"points" deve ser número > 0')
    if (!q.explanation) report.warn(qw, 'sem "explanation" (o aluno aprende mais com o porquê)')
    const options = normalizeOptions(q.options)
    const keys = options ? options.map((o) => o.key) : []

    if (q.type === 'single' || q.type === 'multiple') {
      if (!options || options.length < 2) report.error(qw, 'precisa de pelo menos 2 opções')
      if (new Set(keys).size !== keys.length) report.error(qw, 'chaves de opção repetidas')
      if (options && options.some((o) => !o.key || !o.text)) report.error(qw, 'cada opção precisa de key e text')
      if (options && options.some((o) => /todas as (anteriores|alternativas)|nenhuma das/i.test(o.text))) report.warn(qw, 'evite "todas as anteriores" / "nenhuma das anteriores"')
    }
    if (q.type === 'single') {
      if (typeof q.answer !== 'string' || !keys.includes(q.answer)) report.error(qw, '"answer" deve ser a key de uma opção')
    }
    if (q.type === 'multiple') {
      if (!Array.isArray(q.answer) || !q.answer.length || q.answer.some((k) => !keys.includes(k))) report.error(qw, '"answer" deve ser uma lista de keys válidas')
    }
    if (q.type === 'truefalse') {
      if (typeof q.answer !== 'boolean') report.error(qw, '"answer" deve ser true ou false')
    }
    if (q.type === 'fill') {
      const blanks = (q.prompt.match(/_{3,}/g) ?? []).length
      if (!blanks) report.error(qw, 'prompt de "fill" precisa de pelo menos uma lacuna "___"')
      if (!Array.isArray(q.answer) || q.answer.length !== blanks) report.error(qw, `"answer" deve ter ${blanks} lista(s) de respostas aceitas, uma por lacuna`)
      else if (q.answer.some((v) => !Array.isArray(v) || !v.length || v.some((s) => typeof s !== 'string' || !s.trim()))) report.error(qw, 'cada lacuna precisa de uma lista de textos aceitos, ex.: [["WHERE"]]')
    }
  })
}

// ---------------------------------------------------------------------
// sincronização
// ---------------------------------------------------------------------
async function sync(courses) {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.error('Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env (rode com node --env-file=.env).')
    process.exit(1)
  }
  const { createClient } = await import('@supabase/supabase-js')
  const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
  const must = ({ data, error }, what) => {
    if (error) throw new Error(`${what}: ${error.message}`)
    return data
  }

  for (const c of courses) {
    const j = c.json
    console.log(`\n> ${c.slug}`)
    const course = must(
      await sb
        .from('courses')
        .upsert(
          {
            slug: c.slug,
            title: j.title,
            subtitle: j.subtitle ?? null,
            description_md: c.description_md,
            cover_url: j.cover_url ?? null,
            color: j.color ?? null,
            icon: j.icon ?? null,
            level: j.level ?? null,
            estimated_hours: j.estimated_hours ?? null,
            tags: j.tags ?? [],
            instructor_name: j.instructor_name ?? null,
            is_published: j.is_published !== false,
          },
          { onConflict: 'slug' },
        )
        .select()
        .single(),
      'curso',
    )

    // módulos
    const moduleIds = {}
    const modules = Array.isArray(j.modules) ? j.modules : []
    for (const [i, m] of modules.entries()) {
      const row = must(
        await sb
          .from('modules')
          .upsert({ course_id: course.id, slug: m.slug, title: m.title, description: m.description ?? null, position: i + 1 }, { onConflict: 'course_id,slug' })
          .select()
          .single(),
        `módulo ${m.slug}`,
      )
      moduleIds[m.slug] = row.id
    }

    // aulas
    const lessonIds = {}
    for (const l of c.lessons) {
      const row = must(
        await sb
          .from('lessons')
          .upsert(
            {
              course_id: course.id,
              module_id: l.fm.module ? (moduleIds[l.fm.module] ?? null) : null,
              slug: l.slug,
              title: l.fm.title,
              summary: l.fm.summary ?? null,
              objectives: l.fm.objectives ?? [],
              duration_minutes: l.fm.duration_minutes ?? null,
              position: l.position ?? 0,
              slide_count: l.slides.length,
              content_md: l.body,
              is_published: l.fm.published !== false,
            },
            { onConflict: 'course_id,slug' },
          )
          .select()
          .single(),
        `aula ${l.slug}`,
      )
      lessonIds[l.slug] = row.id
    }
    console.log(`  ${c.lessons.length} aula(s), ${modules.length} módulo(s)`)

    // avaliações
    let qTotal = 0
    for (const a of c.assessments) {
      const aj = a.json
      const row = must(
        await sb
          .from('assessments')
          .upsert(
            {
              course_id: course.id,
              lesson_id: aj.lesson ? (lessonIds[aj.lesson] ?? null) : null,
              slug: a.slug,
              title: aj.title,
              description: aj.description ?? null,
              kind: aj.kind ?? 'quiz',
              passing_score: aj.passing_score ?? 70,
              max_attempts: aj.max_attempts ?? null,
              time_limit_minutes: aj.time_limit_minutes ?? null,
              shuffle_questions: aj.shuffle_questions !== false,
              shuffle_options: aj.shuffle_options !== false,
              show_answers: aj.show_answers !== false,
              is_required: aj.is_required !== false,
              position: a.position,
            },
            { onConflict: 'course_id,slug' },
          )
          .select()
          .single(),
        `avaliação ${a.slug}`,
      )
      const keys = []
      for (const [i, q] of (aj.questions ?? []).entries()) {
        keys.push(q.id)
        const qrow = must(
          await sb
            .from('questions')
            .upsert(
              {
                assessment_id: row.id,
                key: q.id,
                position: i + 1,
                type: q.type,
                prompt_md: q.prompt,
                options: normalizeOptions(q.options),
                explanation_md: q.explanation ?? null,
                points: q.points ?? 1,
              },
              { onConflict: 'assessment_id,key' },
            )
            .select()
            .single(),
          `questão ${q.id}`,
        )
        must(await sb.from('question_keys').upsert({ question_id: qrow.id, answer: q.answer }, { onConflict: 'question_id' }), `gabarito ${q.id}`)
        qTotal++
      }
      if (prune) {
        const del = sb.from('questions').delete().eq('assessment_id', row.id)
        must(await (keys.length ? del.not('key', 'in', `(${keys.map((k) => `"${k}"`).join(',')})`) : del), 'prune questões')
      }
    }
    console.log(`  ${c.assessments.length} avaliação(ões), ${qTotal} questão(ões)`)

    // conquistas do curso (slug global = curso--slug)
    const achievements = Array.isArray(j.achievements) ? j.achievements : []
    const achSlugs = []
    for (const [i, a] of achievements.entries()) {
      const slug = `${c.slug}--${a.slug}`
      achSlugs.push(slug)
      must(
        await sb.from('achievements').upsert(
          {
            slug,
            title: a.title,
            description: a.description,
            icon: a.icon ?? 'award',
            rarity: a.rarity ?? 'common',
            xp: a.xp ?? 0,
            rule: a.rule,
            course_id: course.id,
            is_secret: a.is_secret === true,
            position: 1000 + i,
          },
          { onConflict: 'slug' },
        ),
        `conquista ${a.slug}`,
      )
    }

    if (prune) {
      const inList = (arr) => `(${arr.map((s) => `"${s}"`).join(',')})`
      const lessonSlugs = c.lessons.map((l) => l.slug)
      const assessmentSlugs = c.assessments.map((a) => a.slug)
      const moduleSlugs = modules.map((m) => m.slug)
      const q1 = sb.from('lessons').delete().eq('course_id', course.id)
      must(await (lessonSlugs.length ? q1.not('slug', 'in', inList(lessonSlugs)) : q1), 'prune aulas')
      const q2 = sb.from('assessments').delete().eq('course_id', course.id)
      must(await (assessmentSlugs.length ? q2.not('slug', 'in', inList(assessmentSlugs)) : q2), 'prune avaliações')
      const q3 = sb.from('modules').delete().eq('course_id', course.id)
      must(await (moduleSlugs.length ? q3.not('slug', 'in', inList(moduleSlugs)) : q3), 'prune módulos')
      const q4 = sb.from('achievements').delete().eq('course_id', course.id)
      must(await (achSlugs.length ? q4.not('slug', 'in', inList(achSlugs)) : q4), 'prune conquistas')
      console.log('  itens removidos do repositório foram apagados do banco')
    }

    // imagens -> storage course-assets/<curso>/images/<arquivo>
    for (const img of c.images) {
      const name = basename(img)
      const { error } = await sb.storage
        .from('course-assets')
        .upload(`${c.slug}/images/${name}`, readFileSync(img), { upsert: true, contentType: MIME[extname(img).toLowerCase()] ?? 'application/octet-stream' })
      if (error) throw new Error(`imagem ${name}: ${error.message}`)
    }
    if (c.images.length) console.log(`  ${c.images.length} imagem(ns) enviada(s)`)
  }
}

// ---------------------------------------------------------------------
// main
// ---------------------------------------------------------------------
if (!['check', 'sync'].includes(command)) {
  console.log('Uso: node scripts/content.mjs check | sync [--prune] [--course=slug]')
  process.exit(1)
}
if (!existsSync(CONTENT_DIR)) {
  console.error(`Pasta ${rel(CONTENT_DIR)} não existe.`)
  process.exit(1)
}

const report = new Report()
const dirs = readdirSync(CONTENT_DIR)
  .map((d) => join(CONTENT_DIR, d))
  .filter((d) => statSync(d).isDirectory() && (!onlyCourse || basename(d) === onlyCourse))
const courses = dirs.map((d) => loadCourse(d, report)).filter(Boolean)
for (const c of courses) validateCourse(c, report)

for (const w of report.warnings) console.log(`  aviso  ${w}`)
for (const e of report.errors) console.log(`  ERRO   ${e}`)
console.log(`\n${courses.length} curso(s), ${report.errors.length} erro(s), ${report.warnings.length} aviso(s).`)
if (report.errors.length) process.exit(1)

if (command === 'sync') {
  try {
    await sync(courses)
    console.log('\nSincronização concluída.')
  } catch (e) {
    console.error(`\nFalha: ${e.message}`)
    process.exit(1)
  }
}
