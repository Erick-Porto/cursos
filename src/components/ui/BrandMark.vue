<script setup lang="ts">
defineProps<{ size?: number }>()
</script>

<template>
  <svg :width="size ?? 32" :height="size ?? 32" viewBox="0 0 64 64" aria-hidden="true">
    <rect width="64" height="64" rx="14" fill="var(--bg)" stroke="var(--border-strong)" />
    <path d="M32 14 L54 25 L32 36 L10 25 Z" fill="var(--primary)" />
    <path d="M18 31 V42 C18 46 25 50 32 50 C39 50 46 46 46 42 V31 L32 38 Z" fill="var(--accent)" />
    <path d="M52 27 V40" stroke="var(--primary)" stroke-width="3" stroke-linecap="round" />
  </svg>
</template>
