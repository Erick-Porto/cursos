#!/usr/bin/env node
// =====================================================================
// Gera src/lib/inline-icons.ts a partir dos ícones do lucide instalados.
// Esses ícones podem ser usados dentro dos slides com a sintaxe :icon[nome]
// (ver GUIA_DE_CONTEUDO.md). Para adicionar um ícone, inclua o nome na
// lista abaixo e rode:  node scripts/inline-icons.mjs
// =====================================================================
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const ICONS_DIR = join(ROOT, 'node_modules', 'lucide-vue-next', 'dist', 'esm', 'icons')
const OUT = join(ROOT, 'src', 'lib', 'inline-icons.ts')

const NAMES = `
  activity alarm-clock archive archive-restore arrow-down arrow-down-a-z arrow-left arrow-left-right arrow-right
  arrow-up arrow-up-a-z arrow-up-down award badge-alert badge-check ban banknote bell binary blocks book book-open
  bookmark bot boxes braces brain briefcase bug building-2 cable calculator calendar calendar-check calendar-clock
  chart-bar chart-column chart-line chart-pie check check-check chevrons-right circle-alert circle-check circle-dot
  circle-help circle-minus circle-plus circle-x clipboard-check clipboard-list clock cloud cloud-download cloud-upload
  code code-xml cog coins columns-3 combine compass component contact copy corner-down-right cpu credit-card crown
  database database-backup database-zap dices download equal equal-not eye eye-off factory file-check file-clock
  file-code file-lock file-search file-text file-warning files funnel fingerprint flag flame flask-conical folder
  folder-open folder-tree footprints gamepad-2 gauge gem git-branch git-commit-horizontal git-fork git-merge globe
  goal graduation-cap grid-2x2 hammer hand handshake hard-drive hard-drive-download hard-drive-upload hash heart
  heart-pulse history hourglass id-card image info kanban key key-round keyboard lamp landmark laptop layers
  layout-grid layout-list leaf library lightbulb link link-2 list list-checks list-filter list-ordered list-tree lock
  lock-open magnet mail map map-pin medal megaphone memory-stick merge message-square messages-square milestone
  minus monitor mountain mouse-pointer-click navigation network newspaper notebook-pen octagon-alert package
  package-check paperclip party-popper pause pencil percent phone pin play plug plug-zap plus power puzzle qr-code
  receipt refresh-cw repeat rocket rotate-ccw rotate-cw route rows-3 save scale scan school scroll-text search
  search-check send server server-cog server-crash settings shapes sheet shield shield-alert shield-check shield-off
  shopping-cart sigma siren skip-forward sliders-horizontal smartphone smile snowflake sparkles split square
  square-check square-function square-pen square-terminal star stethoscope store sun swords table table-2
  table-properties tag tags target terminal test-tube text thumbs-down thumbs-up ticket timer timer-reset trash-2
  trending-down trending-up triangle-alert trophy truck undo-2 redo-2 unlink upload user user-check user-cog
  user-plus user-x users variable wallet wand warehouse waypoints wifi workflow wrench x zap
`.split(/\s+/).filter(Boolean)

const unique = [...new Set(NAMES)].sort()
const entries = []
const missing = []
for (const name of unique) {
  const file = join(ICONS_DIR, `${name}.js`)
  if (!existsSync(file)) {
    missing.push(name)
    continue
  }
  const src = readFileSync(file, 'utf8')
  const m = src.match(/createLucideIcon\("[^"]+",\s*(\[[\s\S]*?\])\s*\);/)
  if (!m) {
    missing.push(name)
    continue
  }
  // O array é JS válido (objetos com chaves sem aspas): avalia em sandbox simples.
  const nodes = new Function(`return ${m[1]}`)()
  const inner = nodes
    .map(([tag, attrs]) => {
      const a = Object.entries(attrs)
        .filter(([k]) => k !== 'key')
        .map(([k, v]) => `${k}="${v}"`)
        .join(' ')
      return `<${tag} ${a}/>`
    })
    .join('')
  entries.push(`  '${name}': '${inner}',`)
}

if (missing.length) {
  console.error(`Ícones não encontrados no lucide instalado: ${missing.join(', ')}`)
  process.exit(1)
}

const out = `// Gerado por scripts/inline-icons.mjs. Não edite à mão.
// Ícones usáveis nos slides com a sintaxe :icon[nome] (lucide v0.487, licença ISC).
export const INLINE_ICONS: Record<string, string> = {
${entries.join('\n')}
}

export const inlineIconNames = Object.keys(INLINE_ICONS)
`
writeFileSync(OUT, out)
console.log(`${entries.length} ícones escritos em src/lib/inline-icons.ts`)

// Mantém a lista do guia em dia (Apêndice A, entre os marcadores).
const GUIDE = join(ROOT, 'GUIA_DE_CONTEUDO.md')
if (existsSync(GUIDE)) {
  const guide = readFileSync(GUIDE, 'utf8')
  const start = '<!-- inline-icons:start -->'
  const end = '<!-- inline-icons:end -->'
  const a = guide.indexOf(start)
  const b = guide.indexOf(end)
  if (a !== -1 && b > a) {
    const lines = []
    for (let i = 0; i < unique.length; i += 10) {
      lines.push(unique.slice(i, i + 10).map((n) => `\`${n}\``).join(' · '))
    }
    const next = guide.slice(0, a) + `${start}\n${lines.join('\n')}\n${end}` + guide.slice(b + end.length)
    if (next !== guide) {
      writeFileSync(GUIDE, next)
      console.log('Apêndice A do GUIA_DE_CONTEUDO.md atualizado')
    }
  }
}
