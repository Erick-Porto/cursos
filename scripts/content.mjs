#!/usr/bin/env node
// =====================================================================
// Conteúdo dos cursos: validação e sincronização com o Supabase.
//
//   npm run content:check                 valida content/courses/**
//   npm run content:sync                  envia para o Supabase (upsert)
//   npm run content:sync:prune            idem, removendo o que saiu do repositório
//   node scripts/content.mjs check --course=fundamentos-sql
//   node --env-file=.env scripts/content.mjs sync --course=fundamentos-sql
//
// O formato dos arquivos está descrito em GUIA_DE_CONTEUDO.md. As regras
// daqui e as do guia andam juntas: ao mudar uma, atualize a outra.
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
// Regras aceitas em course.json (contam só o curso). xp_reached e streak_days são
// globais e vivem em supabase/migrations/0002_seed_achievements.sql.
const COURSE_RULE_TYPES = ['lessons_completed', 'course_completed', 'assessments_passed', 'perfect_score', 'first_try_pass']
const GLOBAL_RULE_TYPES = ['xp_reached', 'streak_days']
const QUESTION_TYPES = ['single', 'multiple', 'truefalse', 'fill']
const BLOCKS = ['info', 'tip', 'warning', 'danger', 'example', 'summary', 'goal', 'quote', 'question', 'columns', 'col', 'center', 'steps']
const IMAGE_TYPES = {
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
}
const EMOJI = /\p{Extended_Pictographic}/u
const KB = 1024
const MAX_STATIC_BYTES = 400 * KB // imagem estática (aviso)
const MAX_ANIMATED_BYTES = 1024 * KB // GIF ou WebP animado (aviso)
const MAX_IMAGE_BYTES = 2048 * KB // qualquer imagem (erro)
const MAX_IMAGE_WIDTH = 1600
const MAX_WORDS_WARN = 130
const MAX_WORDS_ERROR = 200
const GENERIC_ALT = /^(imagem|figura|foto|diagrama|print|captura|screenshot|gif|anima[cç][aã]o|ilustra[cç][aã]o|tabela|gr[aá]fico|tela)$/i
const FORBIDDEN_HTML = /<(script|iframe|style|link|video|audio|embed|object|form|svg)\b/i

// ---------------------------------------------------------------------
// util
// ---------------------------------------------------------------------
const ICONS = (() => {
  const src = readFileSync(join(ROOT, 'src', 'lib', 'icons.ts'), 'utf8')
  const names = new Set()
  for (const m of src.matchAll(/^\s+'?([a-z][a-z0-9-]*)'?:\s*[A-Z]/gm)) names.add(m[1])
  return names
})()

const INLINE_ICONS = (() => {
  const file = join(ROOT, 'src', 'lib', 'inline-icons.ts')
  const names = new Set()
  if (!existsSync(file)) return names
  for (const m of readFileSync(file, 'utf8').matchAll(/^\s+'([a-z0-9-]+)':\s*'/gm)) names.add(m[1])
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

/** Remove blocos de código e código inline (onde :icon[] e HTML são texto literal). */
function stripCode(text) {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/~~~[\s\S]*?~~~/g, ' ')
    .replace(/`[^`\n]*`/g, ' ')
}

function wordCount(text) {
  return text.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length
}

function normalizeOptions(options) {
  if (!options) return null
  if (Array.isArray(options)) return options
  return Object.entries(options).map(([key, text]) => ({ key, text }))
}

/**
 * Lê só o cabeçalho de uma imagem: dimensões e se é animada.
 * Suporta PNG (e APNG), GIF, JPEG, WebP e SVG; de AVIF só o tamanho em bytes.
 */
function imageInfo(file) {
  const ext = extname(file).toLowerCase()
  const buf = readFileSync(file)
  const info = { ext, bytes: buf.length, width: null, height: null, animated: false, svg: null }

  if (ext === '.svg') {
    info.svg = buf.toString('utf8')
    const open = info.svg.match(/<svg\b[^>]*>/i)?.[0] ?? ''
    const vb = open.match(/viewBox\s*=\s*["']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i)
    if (vb) {
      info.width = Number(vb[1])
      info.height = Number(vb[2])
    }
    info.animated = /@keyframes|<(animate|animateTransform|animateMotion|set)\b/i.test(info.svg)
    return info
  }

  if (ext === '.png') {
    if (buf.length >= 24 && buf.toString('ascii', 1, 4) === 'PNG') {
      info.width = buf.readUInt32BE(16)
      info.height = buf.readUInt32BE(20)
      info.animated = buf.indexOf('acTL') !== -1
    }
  } else if (ext === '.gif') {
    if (buf.length >= 10 && buf.toString('ascii', 0, 3) === 'GIF') {
      info.width = buf.readUInt16LE(6)
      info.height = buf.readUInt16LE(8)
      let frames = 0
      for (let i = 0; i < buf.length - 2; i++) {
        if (buf[i] === 0x21 && buf[i + 1] === 0xf9 && buf[i + 2] === 0x04) frames++
      }
      info.animated = frames > 1 || buf.indexOf('NETSCAPE2.0') !== -1
    }
  } else if (ext === '.jpg' || ext === '.jpeg') {
    let i = 2
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) {
        i++
        continue
      }
      const marker = buf[i + 1]
      if (marker === 0xff) {
        i++
        continue
      }
      if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
        i += 2
        continue
      }
      if (marker === 0xd9 || marker === 0xda) break
      const len = buf.readUInt16BE(i + 2)
      const isSof = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc
      if (isSof) {
        info.height = buf.readUInt16BE(i + 5)
        info.width = buf.readUInt16BE(i + 7)
        break
      }
      i += 2 + len
    }
  } else if (ext === '.webp') {
    if (buf.length >= 30 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
      const chunk = buf.toString('ascii', 12, 16)
      if (chunk === 'VP8X') {
        info.animated = (buf[20] & 0x02) !== 0
        info.width = 1 + buf.readUIntLE(24, 3)
        info.height = 1 + buf.readUIntLE(27, 3)
      } else if (chunk === 'VP8 ') {
        info.width = buf.readUInt16LE(26) & 0x3fff
        info.height = buf.readUInt16LE(28) & 0x3fff
      } else if (chunk === 'VP8L') {
        const b = buf.readUInt32LE(21)
        info.width = (b & 0x3fff) + 1
        info.height = ((b >> 14) & 0x3fff) + 1
      }
    }
  }
  return info
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
        .map((f) => loadLesson(join(lessonsDir, f), report))
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
  const images = existsSync(imagesDir)
    ? readdirSync(imagesDir)
        .filter((f) => !f.startsWith('.'))
        .sort()
        .map((f) => join(imagesDir, f))
    : []

  // roteiros do instrutor (um por encontro presencial), só para quem dá a aula
  const scriptsDir = join(dir, 'roteiros')
  const scripts = existsSync(scriptsDir)
    ? readdirSync(scriptsDir)
        .filter((f) => f.endsWith('.md'))
        .sort()
        .map((f) => loadScript(join(scriptsDir, f), report))
    : []

  // materiais de aula (demonstrações, soluções, arquivos de apoio), servidos pelo próprio site
  const materialsDir = join(dir, 'materiais')
  const materials = existsSync(materialsDir) ? listFiles(materialsDir) : []

  return { dir, slug, json, description_md, descPath, lessons, assessments, images, scripts, materials }
}

/** Arquivos de uma pasta, recursivo, sem ocultos. */
function listFiles(dir) {
  return readdirSync(dir, { withFileTypes: true })
    .filter((e) => !e.name.startsWith('.'))
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((e) => (e.isDirectory() ? listFiles(join(dir, e.name)) : [join(dir, e.name)]))
}

function loadLesson(file, report) {
  const raw = readFileSync(file, 'utf8')
  let data = {}
  let content = raw
  try {
    ;({ data, content } = matter(raw))
  } catch (e) {
    // frontmatter inválido (ex.: "summary: texto: com dois-pontos" sem aspas) não pode derrubar a validação inteira
    report?.error(rel(file), `frontmatter YAML inválido: ${String(e.reason ?? e.message).split('\n')[0]} (coloque o valor entre aspas)`)
    content = raw.replace(/^---\n[\s\S]*?\n---\n?/, '')
  }
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

/** Roteiro do instrutor: mesmo frontmatter + corpo de uma aula, mas é um documento (sem slides). */
function loadScript(file, report) {
  const { slides, ...rest } = loadLesson(file, report)
  return rest
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
  // imagens de images/ referenciadas em algum lugar (para apontar as órfãs)
  const ctx = { used: new Set(), materials: new Set() }

  if (json.slug !== slug) report.error(where, `"slug" (${json.slug}) deve ser igual ao nome da pasta (${slug})`)
  if (!/^[a-z0-9-]+$/.test(slug)) report.error(where, 'slug da pasta deve usar só letras minúsculas, números e hífens')
  if (!json.title) report.error(where, '"title" é obrigatório')
  if (json.level && !LEVELS.includes(json.level)) report.error(where, `"level" deve ser um de: ${LEVELS.join(', ')}`)
  if (json.icon && !ICONS.has(json.icon)) report.error(where, `"icon" ${json.icon} não existe em src/lib/icons.ts`)
  if (json.color && !/^#[0-9a-f]{6}$/i.test(json.color)) report.error(where, '"color" deve ser hexadecimal (#rrggbb)')
  if (json.tags && !Array.isArray(json.tags)) report.error(where, '"tags" deve ser uma lista')
  if (json.estimated_hours !== undefined && (typeof json.estimated_hours !== 'number' || json.estimated_hours <= 0)) {
    report.error(where, '"estimated_hours" deve ser um número maior que zero')
  }
  if (json.cover_url !== undefined && json.cover_url !== null) {
    if (typeof json.cover_url !== 'string') report.error(where, '"cover_url" deve ser texto')
    else if (/^images\//.test(json.cover_url)) {
      if (!existsSync(join(dir, json.cover_url))) report.error(where, `capa não encontrada: ${json.cover_url}`)
      else ctx.used.add(basename(json.cover_url))
    } else if (!/^https?:\/\//i.test(json.cover_url)) {
      report.error(where, '"cover_url" deve ser images/arquivo (enviado pelo sync) ou uma URL https')
    }
  }
  if (!course.description_md) report.warn(where, 'curso sem descrição (description.md ou description_md)')
  if (EMOJI.test(JSON.stringify(json))) report.error(where, 'não use emojis; use ícones (campo icon)')

  const modules = Array.isArray(json.modules) ? json.modules : []
  const moduleSlugs = new Set()
  for (const m of modules) {
    if (!m.slug || !m.title) report.error(where, 'cada módulo precisa de "slug" e "title"')
    if (moduleSlugs.has(m.slug)) report.error(where, `módulo duplicado: ${m.slug}`)
    moduleSlugs.add(m.slug)
  }

  // conquistas do curso
  const achievements = Array.isArray(json.achievements) ? json.achievements : []
  const achSlugs = new Set()
  let hasCompletion = false
  for (const a of achievements) {
    const w = `${where} (conquista ${a.slug ?? '?'})`
    if (!a.slug || !a.title || !a.description) report.error(w, 'conquista precisa de slug, title e description')
    if (achSlugs.has(a.slug)) report.error(w, 'slug de conquista duplicado')
    achSlugs.add(a.slug)
    if (a.icon && !ICONS.has(a.icon)) report.error(w, `ícone ${a.icon} não existe em src/lib/icons.ts`)
    if (a.rarity && !RARITIES.includes(a.rarity)) report.error(w, `rarity deve ser um de: ${RARITIES.join(', ')}`)
    if (a.xp !== undefined && (!Number.isInteger(a.xp) || a.xp < 0)) report.error(w, 'xp deve ser inteiro >= 0')
    const rule = a.rule ?? {}
    if (GLOBAL_RULE_TYPES.includes(rule.type)) {
      report.error(w, `rule.type "${rule.type}" é global (supabase/migrations/0002_seed_achievements.sql); em course.json use: ${COURSE_RULE_TYPES.join(', ')}`)
    } else if (!COURSE_RULE_TYPES.includes(rule.type)) {
      report.error(w, `rule.type deve ser um de: ${COURSE_RULE_TYPES.join(', ')}`)
    } else if (rule.type === 'course_completed') {
      hasCompletion = true
      if (rule.count !== undefined) report.warn(w, 'rule.count é ignorado em course_completed de curso')
    } else if (!Number.isInteger(rule.count) || rule.count < 1) {
      report.error(w, `rule.count deve ser inteiro >= 1 para ${rule.type}`)
    }
  }
  if (achievements.length && !hasCompletion) report.warn(where, 'nenhuma conquista com rule.type course_completed (convenção: uma por curso)')
  if (achievements.length > 6) report.warn(where, `${achievements.length} conquistas; o guia sugere de 1 a 6 por curso`)

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
    else if (String(l.fm.summary).length > 120) report.warn(lw, `"summary" com ${String(l.fm.summary).length} caracteres; ideal até 120`)
    if (l.fm.module && !moduleSlugs.has(l.fm.module)) report.error(lw, `módulo "${l.fm.module}" não existe em course.json`)
    if (modules.length && !l.fm.module) report.warn(lw, 'aula sem "module" apesar de o curso ter módulos')
    if (l.fm.duration_minutes !== undefined && typeof l.fm.duration_minutes !== 'number') report.error(lw, '"duration_minutes" deve ser número')
    if (l.fm.objectives !== undefined && !Array.isArray(l.fm.objectives)) report.error(lw, '"objectives" deve ser uma lista')
    if (l.fm.published !== undefined && typeof l.fm.published !== 'boolean') report.error(lw, '"published" deve ser true ou false')
    validateSlides(l, course, ctx, report)
  }

  // descrição do curso (mesmo renderizador dos slides)
  if (course.description_md) validateProse(course.description_md, rel(course.descPath), course, ctx, report)

  // avaliações
  const assessmentSlugs = new Set()
  for (const a of course.assessments) {
    const aw = rel(a.file)
    if (assessmentSlugs.has(a.slug)) report.error(aw, `slug de avaliação repetido: ${a.slug}`)
    assessmentSlugs.add(a.slug)
    validateAssessment(a, lessonSlugs, course, ctx, report)
  }

  // roteiros do instrutor
  const scriptSlugs = new Set()
  const scriptPositions = new Set()
  for (const s of course.scripts) {
    const sw = rel(s.file)
    if (s.position === null) report.error(sw, 'nome do arquivo deve ser NN-slug.md (ex.: 01-e01.md)')
    if (scriptPositions.has(s.position)) report.error(sw, `posição ${s.position} repetida em outro roteiro`)
    scriptPositions.add(s.position)
    if (scriptSlugs.has(s.slug)) report.error(sw, `slug de roteiro repetido: ${s.slug}`)
    scriptSlugs.add(s.slug)
    validateScript(s, moduleSlugs, lessonSlugs, modules.length > 0, course, ctx, report)
  }

  // imagens
  for (const img of course.images) validateImageFile(img, ctx.used, report)

  // materiais
  for (const file of course.materials) validateMaterialFile(file, course, ctx, report)
}

const MATERIAL_TEXT = new Set(['.html', '.css', '.js', '.mjs', '.json', '.txt', '.md', '.sql', '.csv', '.svg'])
const MAX_MATERIAL_BYTES = 2 * 1024 * KB

function validateMaterialFile(file, course, ctx, report) {
  const mw = rel(file)
  const path = file.slice(join(course.dir, 'materiais').length + 1).split(/[\\/]/)
  if (path.some((p) => !/^[a-z0-9._-]+$/.test(p))) {
    report.error(mw, 'nomes em materiais/ usam só minúsculas, números, ponto, hífen e underline (o endereço vira URL)')
  }
  const bytes = statSync(file).size
  if (bytes > MAX_MATERIAL_BYTES) report.warn(mw, `${Math.round(bytes / KB)} KB; materiais vão junto com o site, mantenha até ${MAX_MATERIAL_BYTES / KB / KB} MB`)
  if (MATERIAL_TEXT.has(extname(file).toLowerCase()) && EMOJI.test(readFileSync(file, 'utf8'))) {
    report.error(mw, 'não use emojis nos materiais')
  }
  // página HTML que ninguém abre: sem link direto e fora de qualquer pasta baixada como .zip
  // (CSS, imagens e scripts são carregados pelas próprias páginas, então não entram no aviso)
  if (extname(file).toLowerCase() !== '.html') return
  const ancestors = path.slice(0, -1).map((_, i) => path.slice(0, i + 1).join('/'))
  if (!ctx.materials.has(path.join('/')) && !ancestors.some((p) => ctx.materials.has(`${p}.zip`))) {
    report.warn(mw, 'página sem link em nenhuma aula, roteiro ou descrição (link: materiais/pasta/arquivo.html)')
  }
}

/**
 * Regras que valem para qualquer texto renderizado pelo markdown da plataforma
 * (slides, description.md, enunciados): emojis, ícones inline, HTML e imagens.
 * Devolve quantas imagens o texto referencia.
 */
function validateProse(text, where, course, ctx, report, opts = {}) {
  const plain = stripCode(text)
  if (EMOJI.test(text)) report.error(where, 'não use emojis; use ícones (:icon[nome]) ou os blocos :::tip etc.')

  for (const m of plain.matchAll(/:icon\[([^\]]*)\]/g)) {
    if (!INLINE_ICONS.has(m[1])) report.error(where, `ícone inline "${m[1]}" não existe (lista no Apêndice A do guia; gere com node scripts/inline-icons.mjs)`)
  }

  const html = plain.match(FORBIDDEN_HTML)
  if (html) report.error(where, `tag <${html[1].toLowerCase()}> não é suportada; use os blocos ::: e a sintaxe Markdown`)
  if (/<img\b/i.test(plain)) report.warn(where, 'use a sintaxe Markdown para imagens: ![descrição](images/arquivo.svg)')

  let count = 0
  // o texto alternativo pode ter colchetes balanceados, como em `[...tarefas]`
  for (const m of plain.matchAll(/!\[((?:[^[\]]|\[[^[\]]*\])*)\]\(([^)\s]+)[^)]*\)/g)) {
    const [, alt, src] = m
    count++
    if (/^(https?:)?\/\//i.test(src)) {
      report.error(where, `imagem externa (${src}); coloque o arquivo em images/`)
      continue
    }
    if (src.startsWith('data:')) {
      report.error(where, 'imagem embutida em base64; coloque o arquivo em images/')
      continue
    }
    const clean = src.replace(/^\.\//, '')
    if (!clean.startsWith('images/') || clean.includes('..')) {
      report.error(where, `imagem fora de images/ (${src})`)
      continue
    }
    if (opts.noLocalImages) {
      report.error(where, `questões não carregam imagens de images/ (${src}); descreva em texto, tabela ou código`)
      continue
    }
    if (!existsSync(join(course.dir, clean))) report.error(where, `imagem não encontrada: ${src}`)
    else ctx.used.add(basename(clean))
    checkAlt(alt, clean, where, report)
  }

  // links para materiais/ (arquivo servido pelo site; <pasta>.zip baixa a pasta compactada)
  for (const m of plain.matchAll(/(?<!!)\[((?:[^[\]]|\[[^[\]]*\])*)\]\(([^)\s]+)[^)]*\)/g)) {
    const href = m[2].replace(/^\.\//, '')
    if (!href.startsWith('materiais/')) continue
    if (opts.noLocalImages) {
      report.error(where, `questões não têm links para materiais/ (${m[2]}); cite o material no slide ou no roteiro`)
      continue
    }
    const path = href.slice('materiais/'.length)
    if (!path || path.includes('..') || /[?#\\]/.test(path)) {
      report.error(where, `link de material inválido (${m[2]}); use materiais/pasta/arquivo`)
      continue
    }
    const target = join(course.dir, 'materiais', path)
    const isFile = existsSync(target) && statSync(target).isFile()
    const zipOf = /\.zip$/i.test(path) ? target.slice(0, -4) : null
    if (!isFile && !(zipOf && existsSync(zipOf) && statSync(zipOf).isDirectory())) {
      report.error(where, `material não encontrado: ${m[2]} (arquivo em materiais/, ou <pasta>.zip para baixar uma pasta)`)
      continue
    }
    ctx.materials?.add(path)
  }
  return count
}

function checkAlt(alt, src, where, report) {
  const a = alt.trim()
  if (!a) {
    report.warn(where, `imagem ${src} sem texto alternativo`)
    return
  }
  const file = basename(src)
  const stem = file.replace(/\.[a-z0-9]+$/i, '')
  if (GENERIC_ALT.test(a) || a.toLowerCase() === file.toLowerCase() || a.toLowerCase() === stem.toLowerCase() || a.length < 15) {
    report.warn(where, `texto alternativo de ${src} é genérico ("${a}"); descreva o que a imagem ensina`)
  }
}

function validateSlides(lesson, course, ctx, report) {
  const lw = rel(lesson.file)
  const { slides, body } = lesson
  if (slides.length < 4) report.warn(lw, `apenas ${slides.length} slide(s); aulas costumam ter entre 8 e 20`)
  if (slides.length > 30) report.warn(lw, `${slides.length} slides; considere dividir a aula`)

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
      if (/:icon\[/.test(first)) report.warn(sw, 'evite ícone no título da capa (ele já tem destaque próprio)')
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

    // código: linguagem declarada e tamanho
    const fences = []
    slideLines.forEach((l, n) => {
      if (/^\s{0,3}```/.test(l)) fences.push(n)
    })
    for (let k = 0; k + 1 < fences.length; k += 2) {
      if (!/```\s*\w+/.test(slideLines[fences[k]])) report.warn(sw, 'bloco de código sem linguagem (ex.: ```sql)')
      const codeLines = fences[k + 1] - fences[k] - 1
      if (codeLines > 15) report.warn(sw, `bloco de código com ${codeLines} linhas; ideal até 15 (divida em dois slides)`)
    }

    // emojis, ícones inline, HTML e imagens
    const images = validateProse(slide, sw, course, ctx, report)
    if (images > 1) report.warn(sw, `${images} imagens no slide; use uma por slide (ou ::::columns para comparar duas)`)
  })
}

/**
 * Roteiro do instrutor (roteiros/NN-slug.md): documento em Markdown com o passo a passo
 * de um encontro presencial. Vai para class_scripts, que só instrutores leem.
 */
function validateScript(script, moduleSlugs, lessonSlugs, courseHasModules, course, ctx, report) {
  const sw = rel(script.file)
  const fm = script.fm
  if (!fm.title) report.error(sw, 'frontmatter precisa de "title"')
  if (!fm.summary) report.warn(sw, 'frontmatter sem "summary" (aparece na lista de roteiros)')
  else if (String(fm.summary).length > 160) report.warn(sw, `"summary" com ${String(fm.summary).length} caracteres; ideal até 160`)
  if (fm.module && !moduleSlugs.has(fm.module)) report.error(sw, `módulo "${fm.module}" não existe em course.json`)
  if (courseHasModules && !fm.module) report.warn(sw, 'roteiro sem "module" apesar de o curso ter módulos')
  if (fm.duration_minutes !== undefined && typeof fm.duration_minutes !== 'number') report.error(sw, '"duration_minutes" deve ser número')
  if (!Array.isArray(fm.lessons)) report.error(sw, '"lessons" deve ser uma lista com os slugs das aulas do encontro')
  else {
    if (!fm.lessons.length) report.warn(sw, '"lessons" vazia: o roteiro não vai aparecer ligado a nenhuma aula')
    for (const l of fm.lessons) {
      if (!lessonSlugs.has(l)) report.error(sw, `aula "${l}" em "lessons" não existe em lessons/`)
    }
  }

  const body = script.body
  const lines = body.split('\n')
  if (/^#\s/.test(lines[0] ?? '')) report.warn(sw, 'o título vem do frontmatter; comece o corpo com "## ..." em vez de "# ..."')
  const words = wordCount(body)
  if (words < 150) report.warn(sw, `roteiro com ${words} palavras; um encontro de 4h costuma pedir mais detalhe`)

  // blocos :::
  let open = 0
  for (const l of lines) {
    const m = l.match(/^(:{3,})\s*([a-z]*)\s*(.*)$/)
    if (!m) continue
    if (m[2]) {
      if (!BLOCKS.includes(m[2])) report.error(sw, `bloco ":::${m[2]}" não existe (use: ${BLOCKS.join(', ')})`)
      open++
    } else open--
  }
  if (open !== 0) report.error(sw, 'bloco ::: aberto sem fechamento (ou fechado a mais)')

  // código com linguagem declarada
  const fences = []
  lines.forEach((l, n) => {
    if (/^\s{0,3}```/.test(l)) fences.push(n)
  })
  for (let k = 0; k + 1 < fences.length; k += 2) {
    if (!/```\s*\w+/.test(lines[fences[k]])) report.warn(sw, 'bloco de código sem linguagem (ex.: ```jsx)')
  }

  validateProse(body, sw, course, ctx, report)
}

function validateImageFile(file, used, report) {
  const iw = rel(file)
  const name = basename(file)
  const ext = extname(file).toLowerCase()
  if (!/^[a-z0-9._-]+$/.test(name)) report.error(iw, 'nome de imagem deve usar só minúsculas, números, ponto, hífen e underline')
  if (!IMAGE_TYPES[ext]) {
    report.error(iw, `extensão ${ext || '(nenhuma)'} não suportada; use ${Object.keys(IMAGE_TYPES).join(', ')}`)
    return
  }
  if (!used.has(name)) report.warn(iw, 'imagem não é usada em nenhuma aula, na descrição nem como capa')

  const info = imageInfo(file)
  const kb = Math.round(info.bytes / KB)
  const animatedRaster = info.animated && ext !== '.svg'
  if (info.bytes > MAX_IMAGE_BYTES) report.error(iw, `${kb} KB; máximo ${MAX_IMAGE_BYTES / KB} KB`)
  else if (animatedRaster && info.bytes > MAX_ANIMATED_BYTES) {
    report.warn(iw, `${kb} KB; animação ideal até ${MAX_ANIMATED_BYTES / KB} KB (menos quadros por segundo, menor largura ou menos segundos)`)
  } else if (!animatedRaster && info.bytes > MAX_STATIC_BYTES) {
    report.warn(iw, `${kb} KB; ideal até ${MAX_STATIC_BYTES / KB} KB (converta para WebP ou reduza a largura)`)
  }

  if (ext === '.svg') {
    validateSvg(info.svg, iw, report)
    return
  }
  if (info.width === null) {
    if (ext !== '.avif') report.warn(iw, 'não foi possível ler as dimensões (arquivo corrompido ou extensão errada)')
    return
  }
  if (info.width > MAX_IMAGE_WIDTH) report.warn(iw, `${info.width} px de largura; redimensione para até ${MAX_IMAGE_WIDTH} px`)
  if (ext === '.gif' && !info.animated) report.warn(iw, 'GIF estático: converta para PNG ou WebP (menor e com mais cores)')
  if (ext === '.png' && info.animated) report.warn(iw, 'PNG animado (APNG): prefira WebP animado ou SVG animado')
}

function validateSvg(svg, where, report) {
  const open = svg.match(/<svg\b[^>]*>/i)?.[0]
  if (!open) {
    report.error(where, 'arquivo .svg sem elemento <svg>')
    return
  }
  if (!/\bviewBox\s*=/i.test(open)) report.error(where, 'SVG sem viewBox: não redimensiona no celular (ex.: viewBox="0 0 720 300")')
  if (/<script\b/i.test(svg) || /\son[a-z]+\s*=/i.test(svg)) report.error(where, 'SVG com <script> ou atributos on*: não é permitido')
  if (/(href|src)\s*=\s*["'](https?:)?\/\//i.test(svg) || /url\(\s*["']?(https?:)?\/\//i.test(svg) || /@import\b/i.test(svg)) {
    report.error(where, 'SVG com referência externa (http, @import): o navegador bloqueia dentro de <img>')
  }
  if (!/<title\b/i.test(svg)) report.warn(where, 'SVG sem <title>: inclua um título curto logo depois de <svg>')
  if (/<foreignObject\b/i.test(svg)) report.warn(where, 'SVG com <foreignObject> (texto em HTML): pode não renderizar; exporte o texto como <text> ou curvas')
  if (/<image\b/i.test(svg) || /data:image\//i.test(svg)) report.warn(where, 'SVG com imagem embutida: prefira desenhar com formas e texto (menor e nítido)')
  if (EMOJI.test(svg)) report.error(where, 'SVG com emoji: use formas ou ícones do lucide')
  if (/<(animate|animateTransform|animateMotion|set)\b/i.test(svg)) {
    report.warn(where, 'animação SMIL (<animate>): prefira @keyframes em <style>, que respeita prefers-reduced-motion')
  }
  if (/@keyframes/i.test(svg) && !/prefers-reduced-motion/i.test(svg)) {
    report.warn(where, 'SVG animado sem @media (prefers-reduced-motion: reduce): inclua para quem desativa animações')
  }
}

function validateAssessment(a, lessonSlugs, course, ctx, report) {
  const w = rel(a.file)
  const j = a.json
  if (!j.title) report.error(w, '"title" é obrigatório')
  if (j.lesson && !lessonSlugs.has(j.lesson)) report.error(w, `"lesson" ${j.lesson} não corresponde a nenhuma aula`)
  if (j.kind && !['quiz', 'exam'].includes(j.kind)) report.error(w, '"kind" deve ser quiz ou exam')
  if (j.passing_score !== undefined && (typeof j.passing_score !== 'number' || j.passing_score < 0 || j.passing_score > 100)) report.error(w, '"passing_score" deve ser um número de 0 a 100')
  if (j.max_attempts !== undefined && j.max_attempts !== null && (!Number.isInteger(j.max_attempts) || j.max_attempts < 1)) report.error(w, '"max_attempts" deve ser inteiro >= 1 ou null')
  if (j.time_limit_minutes !== undefined && j.time_limit_minutes !== null && (!Number.isInteger(j.time_limit_minutes) || j.time_limit_minutes < 1)) report.error(w, '"time_limit_minutes" deve ser inteiro >= 1 ou null')
  if (EMOJI.test(JSON.stringify(j))) report.error(w, 'não use emojis nas questões')
  if (typeof j.description === 'string') validateProse(j.description, `${w} (description)`, course, ctx, report, { noLocalImages: true })

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

    // enunciado, alternativas e explicação passam pelo mesmo markdown dos slides
    const texts = [q.prompt, q.explanation, ...(options ?? []).map((o) => o.text)].filter((t) => typeof t === 'string')
    for (const t of texts) validateProse(t, qw, course, ctx, report, { noLocalImages: true })

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
      const blanks = (String(q.prompt ?? '').match(/_{3,}/g) ?? []).length
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
    console.error('Defina VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env (rode com node --env-file=.env).')
    process.exit(1)
  }
  const { createClient } = await import('@supabase/supabase-js')
  const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
  const must = ({ data, error }, what) => {
    if (error) throw new Error(`${what}: ${error.message}`)
    return data
  }
  const publicUrl = (slug, path) => `${url.replace(/\/$/, '')}/storage/v1/object/public/course-assets/${slug}/${path}`

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
            // capa local (images/capa.webp) vira a URL pública do storage
            cover_url: j.cover_url ? (/^images\//.test(j.cover_url) ? publicUrl(c.slug, j.cover_url) : j.cover_url) : null,
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

    // roteiros do instrutor (tabela criada pela migration 0003; sem ela, avisa e segue)
    let scriptsTableMissing = false
    for (const s of c.scripts) {
      const res = await sb.from('class_scripts').upsert(
          {
            course_id: course.id,
            module_id: s.fm.module ? (moduleIds[s.fm.module] ?? null) : null,
            slug: s.slug,
            title: s.fm.title,
            summary: s.fm.summary ?? null,
            duration_minutes: s.fm.duration_minutes ?? null,
            position: s.position ?? 0,
            lesson_slugs: Array.isArray(s.fm.lessons) ? s.fm.lessons : [],
            content_md: s.body,
          },
          { onConflict: 'course_id,slug' },
        )
      if (res.error && /class_scripts/.test(res.error.message)) {
        scriptsTableMissing = true
        break
      }
      must(res, `roteiro ${s.slug}`)
    }
    if (scriptsTableMissing) {
      console.log(`  aviso: tabela class_scripts não existe no banco; aplique supabase/migrations/0003_class_scripts.sql e rode o sync de novo (${c.scripts.length} roteiro(s) não enviados)`)
    } else if (c.scripts.length) console.log(`  ${c.scripts.length} roteiro(s) do instrutor`)

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
      if (!scriptsTableMissing) {
        const scriptSlugs = c.scripts.map((s) => s.slug)
        const q5 = sb.from('class_scripts').delete().eq('course_id', course.id)
        must(await (scriptSlugs.length ? q5.not('slug', 'in', inList(scriptSlugs)) : q5), 'prune roteiros')
      }
      console.log('  itens removidos do repositório foram apagados do banco')
    }

    // imagens -> storage course-assets/<curso>/images/<arquivo>
    // O CDN guarda o arquivo por 1 hora (cacheControl padrão): ao trocar uma imagem
    // mantendo o nome, o aluno pode ver a antiga por um tempo. Prefira renomear.
    const bucket = sb.storage.from('course-assets')
    for (const img of c.images) {
      const name = basename(img)
      const { error } = await bucket.upload(`${c.slug}/images/${name}`, readFileSync(img), {
        upsert: true,
        contentType: IMAGE_TYPES[extname(img).toLowerCase()] ?? 'application/octet-stream',
      })
      if (error) throw new Error(`imagem ${name}: ${error.message}`)
    }
    if (c.images.length) console.log(`  ${c.images.length} imagem(ns) enviada(s)`)

    if (prune) {
      const stored = must(await bucket.list(`${c.slug}/images`, { limit: 1000 }), 'listar imagens') ?? []
      const keep = new Set(c.images.map((p) => basename(p)))
      const stale = stored.filter((f) => f.name && !keep.has(f.name)).map((f) => `${c.slug}/images/${f.name}`)
      if (stale.length) {
        must(await bucket.remove(stale), 'prune imagens')
        console.log(`  ${stale.length} imagem(ns) removida(s) do storage`)
      }
    }
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
if (onlyCourse && !dirs.length) {
  console.error(`Curso "${onlyCourse}" não encontrado em ${rel(CONTENT_DIR)}.`)
  process.exit(1)
}
const courses = dirs.map((d) => loadCourse(d, report)).filter(Boolean)
for (const c of courses) validateCourse(c, report)

for (const c of courses) {
  const slides = c.lessons.reduce((n, l) => n + l.slides.length, 0)
  const questions = c.assessments.reduce((n, a) => n + (Array.isArray(a.json.questions) ? a.json.questions.length : 0), 0)
  console.log(`  ${c.slug}: ${c.lessons.length} aula(s), ${slides} slide(s), ${c.assessments.length} avaliação(ões), ${questions} questão(ões), ${c.images.length} imagem(ns), ${c.scripts.length} roteiro(s), ${c.materials.length} material(is)`)
}
if (report.warnings.length || report.errors.length) console.log('')
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
