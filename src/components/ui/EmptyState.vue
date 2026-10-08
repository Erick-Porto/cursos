<script setup lang="ts">
import type { Component } from 'vue'
defineProps<{ icon: Component; title: string; text?: string }>()
</script>

<template>
  <div class="empty">
    <component :is="icon" />
    <h3 style="margin-bottom: 4px">{{ title }}</h3>
    <p v-if="text" style="margin-bottom: 14px">{{ text }}</p>
    <slot />
  </div>
</template>
