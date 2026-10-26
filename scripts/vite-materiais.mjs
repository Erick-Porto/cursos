// =====================================================================
// Materiais de aula: arquivos que o aluno ou o instrutor abre no navegador
// ou baixa (demonstrações em HTML, soluções de referência, arquivos de apoio).
//
// Ficam em content/courses/<curso>/materiais/ e o próprio site os serve em
// <base>materiais/<curso>/...: no `npm run dev` direto da pasta do curso, no
// build copiados para dist/. Um link para <pasta>.zip baixa a pasta
// compactada (o zip é gerado na hora no dev e no build para os links que
// aparecem nas aulas, roteiros e descrição).
//
// Formato e regras em GUIA_DE_CONTEUDO.md (seção 10).
// =====================================================================
import { createReadStream, cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, extname, join, relative, resolve, sep } from 'node:path'
import { deflateRawSync } from 'node:zlib'

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.sql': 'text/plain; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
}

const contentType = (name) => TYPES[extname(name).toLowerCase()] ?? 'application/octet-stream'

/** Arquivos de uma pasta (recursivo, sem ocultos), em ordem. */
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true })
    .filter((e) => !e.name.startsWith('.'))
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]))
}

const isFile = (p) => existsSync(p) && statSync(p).isFile()
const isDir = (p) => existsSync(p) && statSync(p).isDirectory()

// ---------------------------------------------------------------------
// zip (método deflate), sem dependências
// ---------------------------------------------------------------------
const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})

function crc32(buf) {
  let c = 0xffffffff
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function dosDateTime(d) {
  return {
    time: (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1),
    date: ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate(),
  }
}

/** Compacta a pasta; dentro do zip os arquivos ficam em <nome-da-pasta>/... */
export function zipFolder(dir) {
  const root = basename(dir)
  const parts = []
  const central = []
  let offset = 0
  const files = walk(dir)
  for (const file of files) {
    const name = Buffer.from(`${root}/${relative(dir, file).split(sep).join('/')}`, 'utf8')
    const data = readFileSync(file)
    const packed = deflateRawSync(data)
    const crc = crc32(data)
    const { time, date } = dosDateTime(statSync(file).mtime)

    const local = Buffer.alloc(30)
    local.writeUInt32LE(0x04034b50, 0)
    local.writeUInt16LE(20, 4) // versão mínima
    local.writeUInt16LE(0x0800, 6) // nomes em UTF-8
    local.writeUInt16LE(8, 8) // deflate
    local.writeUInt16LE(time, 10)
    local.writeUInt16LE(date, 12)
    local.writeUInt32LE(crc, 14)
    local.writeUInt32LE(packed.length, 18)
    local.writeUInt32LE(data.length, 22)
    local.writeUInt16LE(name.length, 26)

    const entry = Buffer.alloc(46)
    entry.writeUInt32LE(0x02014b50, 0)
    entry.writeUInt16LE(20, 4)
    entry.writeUInt16LE(20, 6)
    entry.writeUInt16LE(0x0800, 8)
    entry.writeUInt16LE(8, 10)
    entry.writeUInt16LE(time, 12)
    entry.writeUInt16LE(date, 14)
    entry.writeUInt32LE(crc, 16)
    entry.writeUInt32LE(packed.length, 20)
    entry.writeUInt32LE(data.length, 24)
    entry.writeUInt16LE(name.length, 28)
    entry.writeUInt32LE(offset, 42)

    parts.push(local, name, packed)
    central.push(entry, name)
    offset += local.length + name.length + packed.length
  }
  const dirBuf = Buffer.concat(central)
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50, 0)
  end.writeUInt16LE(files.length, 8)
  end.writeUInt16LE(files.length, 10)
  end.writeUInt32LE(dirBuf.length, 12)
  end.writeUInt32LE(offset, 16)
  return Buffer.concat([...parts, dirBuf, end])
}

// ---------------------------------------------------------------------
// plugin
// ---------------------------------------------------------------------
/** Links `materiais/<caminho>.zip` usados nos textos de um curso. */
function zipLinks(courseDir) {
  const texts = []
  const desc = join(courseDir, 'description.md')
  if (isFile(desc)) texts.push(readFileSync(desc, 'utf8'))
  for (const sub of ['lessons', 'roteiros']) {
    const d = join(courseDir, sub)
    if (isDir(d)) for (const f of walk(d)) if (f.endsWith('.md')) texts.push(readFileSync(f, 'utf8'))
  }
  const found = new Set()
  for (const t of texts) {
    for (const m of t.matchAll(/\]\((?:\.\/)?materiais\/([^)\s]+?\.zip)[)\s]/gi)) found.add(m[1])
  }
  return [...found]
}

export function materiais() {
  let base = '/'
  let coursesDir = ''

  /** Resolve `<curso>/<caminho>` para um arquivo ou para uma pasta a compactar. */
  function locate(path) {
    const [slug, ...rest] = path.split('/')
    if (!slug || !/^[a-z0-9-]+$/.test(slug) || !rest.length) return null
    const root = join(coursesDir, slug, 'materiais')
    const target = resolve(root, ...rest)
    if (!target.startsWith(root + sep)) return null
    if (isFile(target)) return { file: target }
    if (/\.zip$/i.test(target) && isDir(target.slice(0, -4))) return { folder: target.slice(0, -4) }
    if (isFile(join(target, 'index.html'))) return { file: join(target, 'index.html') }
    return null
  }

  return {
    name: 'materiais-dos-cursos',

    configResolved(config) {
      base = config.base
      coursesDir = resolve(config.root, 'content', 'courses')
    },

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const prefix = `${base}materiais/`
        let path
        try {
          path = decodeURIComponent((req.url ?? '').split(/[?#]/)[0])
        } catch {
          return next()
        }
        if (!path.startsWith(prefix)) return next()
        const found = locate(path.slice(prefix.length))
        if (!found) {
          res.statusCode = 404
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          res.end('Material não encontrado.')
          return
        }
        res.setHeader('Cache-Control', 'no-cache')
        if (found.folder) {
          res.setHeader('Content-Type', TYPES['.zip'])
          res.end(zipFolder(found.folder))
        } else {
          res.setHeader('Content-Type', contentType(found.file))
          createReadStream(found.file).pipe(res)
        }
      })
    },

    writeBundle(options) {
      const outDir = options.dir ?? resolve('dist')
      if (!isDir(coursesDir)) return
      for (const slug of readdirSync(coursesDir)) {
        const courseDir = join(coursesDir, slug)
        const src = join(courseDir, 'materiais')
        if (!isDir(src)) continue
        const dest = join(outDir, 'materiais', slug)
        cpSync(src, dest, { recursive: true, filter: (p) => !basename(p).startsWith('.') })
        for (const link of zipLinks(courseDir)) {
          const folder = join(src, link.slice(0, -4))
          if (!isDir(folder)) continue
          const out = join(dest, link)
          mkdirSync(dirname(out), { recursive: true })
          writeFileSync(out, zipFolder(folder))
        }
      }
    },
  }
}
