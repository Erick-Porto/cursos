/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  readonly VITE_ENABLE_GOOGLE_LOGIN?: string
  readonly VITE_BASE?: string
  /** Endereço público do site, usado nos links de confirmação e recuperação enviados por e-mail. */
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
