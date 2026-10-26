import type { Plugin } from 'vite'

/** Serve e publica content/courses/<curso>/materiais/ em <base>materiais/<curso>/. */
export function materiais(): Plugin

/** Compacta uma pasta em zip (os arquivos ficam em <nome-da-pasta>/...). */
export function zipFolder(dir: string): Buffer
