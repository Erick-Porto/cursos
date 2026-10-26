// Renderização de Markdown para slides, descrições e questões.
// Formato dos slides: um arquivo .md por aula, slides separados por uma linha "---".
// Ver GUIA_DE_CONTEUDO.md para o padrão de autoria.
import MarkdownIt from 'markdown-it'
import container from 'markdown-it-container'
import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import csharp from 'highlight.js/lib/languages/csharp'
import css from 'highlight.js/lib/languages/css'
import diff from 'highlight.js/lib/languages/diff'
import go from 'highlight.js/lib/languages/go'
import java from 'highlight.js/lib/languages/java'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import markdown from 'highlight.js/lib/languages/markdown'
import php from 'highlight.js/lib/languages/php'
import plaintext from 'highlight.js/lib/languages/plaintext'
import python from 'highlight.js/lib/languages/python'
import sql from 'highlight.js/lib/languages/sql'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import yaml from 'highlight.js/lib/languages/yaml'
import { INLINE_ICONS } from './inline-icons'

hljs.registerLanguage('bash', bash)
hljs.registerLanguage('csharp', csharp)
hljs.registerLanguage('css', css)
hljs.registerLanguage('diff', diff)
hljs.registerLanguage('go', go)
hljs.registerLanguage('java', java)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('json', json)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('php', php)
hljs.registerLanguage('plaintext', plaintext)
hljs.registerLanguage('python', python)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('yaml', yaml)

const SVG_OPEN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
const ICON_SVG: Record<string, string> = {
  info: `${SVG_OPEN}<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
  lightbulb: `${SVG_OPEN}<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`,
  warning: `${SVG_OPEN}<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
  danger: `${SVG_OPEN}<path d="M12 16h.01"/><path d="M12 8v4"/><path d="M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z"/></svg>`,
  example: `${SVG_OPEN}<path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></svg>`,
  summary: `${SVG_OPEN}<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/></svg>`,
  goal: `${SVG_OPEN}<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  quote: `${SVG_OPEN}<path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"/></svg>`,
  question: `${SVG_OPEN}<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>`,
}

/** Blocos `:::nome` disponíveis nos slides. */
export const CALLOUTS: Record<string, { label: string; icon: string }> = {
  info: { label: 'Saiba mais', icon: 'info' },
  tip: { label: 'Dica', icon: 'lightbulb' },
  warning: { label: 'Atenção', icon: 'warning' },
  danger: { label: 'Cuidado', icon: 'danger' },
  example: { label: 'Exemplo', icon: 'example' },
  summary: { label: 'Resumo', icon: 'summary' },
  goal: { label: 'Objetivo', icon: 'goal' },
  quote: { label: 'Citação', icon: 'quote' },
  question: { label: 'Pense', icon: 'question' },
}

export interface RenderOptions {
  /** Prefixo para imagens com caminho relativo (ex.: images/x.png). */
  assetBase?: string
  /** Prefixo para links de materiais do curso (ex.: materiais/e01/aluno/contador.html). */
  materialBase?: string
}

/**
 * Endereço dos materiais de um curso: `content/courses/<curso>/materiais/` é servido
 * pelo próprio site (ver scripts/vite-materiais.mjs), não pelo storage.
 */
export function courseMaterialBase(courseSlug: string): string {
  return `${import.meta.env.BASE_URL}materiais/${courseSlug}/`
}

export interface Slide {
  index: number
  title: string
  html: string
  isCover: boolean
  wordCount: number
}

type Token = ReturnType<MarkdownIt['parse']>[number]

/** Sintaxe `:icon[nome]` dentro de qualquer texto (títulos, listas, parágrafos). */
const INLINE_ICON_RE = /:icon\[([a-z0-9-]+)\]/g

export function inlineIconSvg(name: string): string | null {
  const inner = INLINE_ICONS[name]
  if (!inner) return null
  return (
    `<svg class="icon-inline" data-icon="${name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" ` +
    `stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`
  )
}

// markdown-it 14.3 traz tipos próprios; os @types do plugin de container apontam para
// outra declaração. Chamamos o plugin diretamente com uma assinatura local.
type ContainerPlugin = (
  md: MarkdownIt,
  name: string,
  opts: { render: (tokens: Token[], idx: number) => string },
) => void
const useContainer = container as unknown as ContainerPlugin

function createRenderer(opts: RenderOptions): MarkdownIt {
  const md = new MarkdownIt({ html: true, linkify: true, typographer: false })

  for (const [name, def] of Object.entries(CALLOUTS)) {
    useContainer(md, name, {
      render(tokens: Token[], idx: number) {
        const token = tokens[idx]
        if (token.nesting === 1) {
          const custom = token.info.trim().slice(name.length).trim()
          const title = md.utils.escapeHtml(custom || def.label)
          return `<aside class="callout callout--${name}"><div class="callout__title">${ICON_SVG[def.icon]}<span>${title}</span></div><div class="callout__body">\n`
        }
        return '</div></aside>\n'
      },
    })
  }

  useContainer(md, 'columns', {
    render: (tokens: Token[], idx: number) => (tokens[idx].nesting === 1 ? '<div class="columns">\n' : '</div>\n'),
  })
  useContainer(md, 'col', {
    render: (tokens: Token[], idx: number) => (tokens[idx].nesting === 1 ? '<div class="col">\n' : '</div>\n'),
  })
  useContainer(md, 'center', {
    render: (tokens: Token[], idx: number) => (tokens[idx].nesting === 1 ? '<div class="center">\n' : '</div>\n'),
  })
  useContainer(md, 'steps', {
    render: (tokens: Token[], idx: number) => (tokens[idx].nesting === 1 ? '<div class="steps">\n' : '</div>\n'),
  })

  // Ícones inline: troca ":icon[nome]" por um SVG do lucide (ver src/lib/inline-icons.ts).
  md.core.ruler.push('inline_icons', (state) => {
    for (const block of state.tokens) {
      if (block.type !== 'inline' || !block.children) continue
      if (!block.content.includes(':icon[')) continue
      const out: Token[] = []
      for (const child of block.children) {
        if (child.type !== 'text' || !child.content.includes(':icon[')) {
          out.push(child)
          continue
        }
        let last = 0
        for (const m of child.content.matchAll(INLINE_ICON_RE)) {
          const svg = inlineIconSvg(m[1])
          if (!svg) continue
          if (m.index! > last) {
            const t = new state.Token('text', '', 0)
            t.content = child.content.slice(last, m.index)
            out.push(t)
          }
          const icon = new state.Token('html_inline', '', 0)
          icon.content = svg
          out.push(icon)
          last = m.index! + m[0].length
        }
        if (last < child.content.length) {
          const t = new state.Token('text', '', 0)
          t.content = child.content.slice(last)
          out.push(t)
        }
      }
      block.children = out
    }
  })

  // Imagens: caminho relativo -> storage do curso; carregamento preguiçoso.
  const defaultImage = md.renderer.rules.image!
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const src = token.attrGet('src') || ''
    if (opts.assetBase && !/^(?:https?:)?\/\/|^data:|^\//i.test(src)) {
      token.attrSet('src', opts.assetBase + src.replace(/^\.\//, ''))
    }
    token.attrSet('loading', 'lazy')
    return defaultImage(tokens, idx, options, env, self)
  }

  // Links externos e materiais do curso abrem em nova aba; <pasta>.zip baixa a pasta.
  const defaultLinkOpen =
    md.renderer.rules.link_open || ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options))
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const href = token.attrGet('href') || ''
    const material = opts.materialBase ? href.match(/^(?:\.\/)?materiais\/(.+)$/) : null
    if (material) token.attrSet('href', opts.materialBase + material[1])
    if (material && /\.zip$/i.test(material[1])) {
      token.attrSet('download', '')
    } else if (material || /^https?:\/\//i.test(href)) {
      token.attrSet('target', '_blank')
      token.attrSet('rel', 'noopener noreferrer')
    }
    return defaultLinkOpen(tokens, idx, options, env, self)
  }

  // Blocos de código: cabeçalho com linguagem + botão copiar + realce.
  md.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx]
    const lang = (token.info.trim().split(/\s+/)[0] || '').toLowerCase()
    const resolved = lang && hljs.getLanguage(lang) ? lang : 'plaintext'
    const highlighted = hljs.highlight(token.content, { language: resolved, ignoreIllegals: true }).value
    const label = md.utils.escapeHtml(lang || 'texto')
    return (
      `<div class="code-block"><div class="code-block__head"><span class="code-block__lang">${label}</span>` +
      `<button type="button" class="code-block__copy" data-copy>Copiar</button></div>` +
      `<pre class="hljs"><code class="language-${md.utils.escapeHtml(resolved)}">${highlighted}</code></pre></div>\n`
    )
  }

  // Tabelas roláveis no celular.
  md.renderer.rules.table_open = () => '<div class="table-wrap"><table>'
  md.renderer.rules.table_close = () => '</table></div>'

  return md
}

const cache = new Map<string, MarkdownIt>()
function renderer(opts: RenderOptions = {}): MarkdownIt {
  const key = `${opts.assetBase ?? ''}|${opts.materialBase ?? ''}`
  let md = cache.get(key)
  if (!md) {
    md = createRenderer(opts)
    cache.set(key, md)
  }
  return md
}

/** Remove o bloco YAML inicial (---\n...\n---), caso o conteúdo ainda o tenha. */
export function stripFrontmatter(source: string): string {
  const text = source.replace(/\r\n?/g, '\n')
  if (!text.startsWith('---\n')) return text
  const end = text.indexOf('\n---', 4)
  if (end === -1) return text
  const after = text.indexOf('\n', end + 1)
  return after === -1 ? '' : text.slice(after + 1)
}

/** Divide o markdown em slides por linhas "---" (ignora as que estão dentro de blocos de código). */
export function splitSlides(source: string): string[] {
  const lines = source.replace(/\r\n?/g, '\n').split('\n')
  const slides: string[] = []
  let current: string[] = []
  let fence: string | null = null

  for (const line of lines) {
    const match = line.match(/^\s{0,3}(`{3,}|~{3,})/)
    if (match) {
      const mark = match[1]
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
  return slides.map((s) => s.trim()).filter((s) => s.length > 0)
}

function textOf(inline: Token | undefined): string {
  if (!inline) return ''
  if (inline.children?.length) {
    return inline.children
      .filter((c) => c.type === 'text' || c.type === 'code_inline')
      .map((c) => c.content)
      .join('')
      .trim()
  }
  return inline.content.trim()
}

/** Renderiza uma aula inteira em slides. */
export function renderLesson(source: string, opts: RenderOptions = {}): Slide[] {
  const md = renderer(opts)
  return splitSlides(stripFrontmatter(source)).map((part, index) => {
    const tokens = md.parse(part, {})
    let title = ''
    let isCover = false
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i]
      if (t.type === 'heading_open') {
        title = textOf(tokens[i + 1])
        isCover = t.tag === 'h1' && i === 0
        break
      }
    }
    const html = md.renderer.render(tokens, md.options, {})
    const wordCount = part
      .replace(/```[\s\S]*?```/g, ' ')
      .split(/\s+/)
      .filter(Boolean).length
    return { index, title: title || `Slide ${index + 1}`, html, isCover, wordCount }
  })
}

/** Renderiza um trecho de markdown (descrição de curso, enunciado, explicação). */
export function renderMarkdown(source: string | null | undefined, opts: RenderOptions = {}): string {
  if (!source) return ''
  return renderer(opts).render(source)
}

/** Renderiza apenas elementos inline (negrito, código) sem envolver em <p>. */
export function renderInline(source: string | null | undefined): string {
  if (!source) return ''
  return renderer().renderInline(source)
}
