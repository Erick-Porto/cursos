import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/** false quando o .env não foi preenchido: o app mostra uma tela de instruções. */
export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase = createClient(url || 'https://placeholder.supabase.co', anonKey || 'placeholder', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
})

/** URL pública de um arquivo do bucket `course-assets` (imagens das aulas). */
export function courseAssetBase(courseSlug: string): string {
  return `${url}/storage/v1/object/public/course-assets/${courseSlug}/`
}

/** URL pública de um arquivo do bucket `avatars`. */
export function avatarPublicUrl(path: string): string {
  return supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl
}

/**
 * URL de retorno para fluxos por e-mail. Não usa hash (o roteador é hash-based),
 * só um parâmetro `flow` que o App lê ao iniciar para decidir a rota.
 *
 * Com VITE_SITE_URL definida (endereço público do site), os links do e-mail apontam
 * sempre para ela. Sem isso, um cadastro feito em http://localhost:5173 manda um
 * link que só abre no computador de quem rodou o servidor de desenvolvimento.
 */
export function redirectUrl(flow?: 'recovery' | 'confirm'): string {
  const site = import.meta.env.VITE_SITE_URL?.trim()
  const base = site ? site.replace(/\/*$/, '/') : `${window.location.origin}${import.meta.env.BASE_URL}`
  return flow ? `${base}?flow=${flow}` : base
}

/** Mensagens de erro do Supabase em português para o usuário final. */
export function friendlyError(err: unknown): string {
  const msg = (err as { message?: string })?.message ?? String(err)
  const map: Array<[RegExp, string]> = [
    [/invalid login credentials/i, 'E-mail ou senha incorretos.'],
    [/email not confirmed/i, 'Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.'],
    [/user already registered/i, 'Já existe uma conta com este e-mail.'],
    [/password should be at least/i, 'A senha precisa ter pelo menos 6 caracteres.'],
    [/rate limit|too many requests/i, 'Muitas tentativas. Aguarde um instante e tente de novo.'],
    [/limite de tentativas/i, 'Você atingiu o limite de tentativas desta avaliação.'],
    [/matrícula necessária/i, 'Matricule-se no curso para continuar.'],
    [/duplicate key.*username/i, 'Este nome de usuário já está em uso.'],
    [/profiles_username_check/i, 'Nome de usuário inválido: use 3 a 30 letras minúsculas, números ou _.'],
    [/failed to fetch|networkerror/i, 'Sem conexão com o servidor. Verifique sua internet.'],
  ]
  for (const [re, text] of map) if (re.test(msg)) return text
  return msg || 'Ocorreu um erro inesperado.'
}
