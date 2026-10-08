<script setup lang="ts">
import { computed } from 'vue'
import { Zap } from 'lucide-vue-next'
import { levelInfo } from '@/lib/xp'
import { formatNumber } from '@/lib/format'
import ProgressBar from '@/components/ui/ProgressBar.vue'

const props = defineProps<{ xp: number }>()
const info = computed(() => levelInfo(props.xp))
</script>

<template>
  <div class="level">
    <div class="level__badge">
      <span class="level__num">{{ info.level }}</span>
      <span class="level__word">nível</span>
    </div>
    <div class="grow">
      <div class="row between">
        <strong>{{ info.title }}</strong>
        <span class="level__xp"><Zap /> {{ formatNumber(xp) }} XP</span>
      </div>
      <ProgressBar :value="info.pct" variant="gradient" size="sm" />
      <div class="hint">
        <template v-if="info.next">Faltam {{ formatNumber(info.toNext) }} XP para o nível {{ info.level + 1 }}</template>
        <template v-else>Nível máximo alcançado</template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.level {
  display: flex;
  align-items: center;
  gap: 14px;
}

.level__badge {
  flex: none;
  width: 58px;
  height: 58px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  align-content: center;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: #fff;
  line-height: 1;
}

.level__num {
  font-size: 1.5rem;
  font-weight: 800;
}

.level__word {
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.9;
}

.level__xp {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  color: var(--accent);
  font-weight: 700;
}

.level__xp svg {
  width: 14px;
  height: 14px;
}
</style>
