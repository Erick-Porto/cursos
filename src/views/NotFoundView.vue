<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Compass } from 'lucide-vue-next'
import EmptyState from '@/components/ui/EmptyState.vue'
</script>

<template>
  <div class="container page">
    <EmptyState :icon="Compass" title="Página não encontrada" text="O endereço que você abriu não existe ou foi movido.">
      <RouterLink to="/inicio" class="btn btn--primary">Ir para o início</RouterLink>
    </EmptyState>
  </div>
</template>
