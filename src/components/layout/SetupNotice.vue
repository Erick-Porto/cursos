<script setup lang="ts">
import { Settings } from 'lucide-vue-next'
import BrandMark from '@/components/ui/BrandMark.vue'
</script>

<template>
  <div class="setup">
    <div class="card card--pad-lg setup__card">
      <div class="row" style="margin-bottom: 14px">
        <BrandMark :size="36" />
        <h1 style="margin: 0; font-size: 1.3rem">Configuração necessária</h1>
      </div>
      <p class="text-2">
        As variáveis de ambiente do Supabase não foram encontradas. O app precisa de
        <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code>.
      </p>
      <ol class="setup__steps">
        <li>Copie <code>.env.example</code> para <code>.env</code> e preencha com os dados do projeto.</li>
        <li>Rode as migrations em <code>supabase/migrations</code> no SQL Editor.</li>
        <li>No GitHub, cadastre as mesmas variáveis em <em>Settings → Secrets and variables → Actions</em>.</li>
      </ol>
      <p class="hint row"><Settings style="width: 16px; height: 16px" /> Passo a passo completo no README.md.</p>
    </div>
  </div>
</template>

<style scoped>
.setup {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: var(--gutter);
}

.setup__card {
  max-width: 560px;
}

.setup__steps {
  padding-left: 1.2em;
  color: var(--text-2);
}

.setup__steps li {
  margin-bottom: 8px;
}

code {
  background: var(--surface-2);
  padding: 0.1em 0.4em;
  border-radius: 6px;
}
</style>
