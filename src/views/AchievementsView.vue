<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Sparkles, Trophy } from 'lucide-vue-next'
import { useAchievementsStore } from '@/stores/achievements'
import { useCatalogStore } from '@/stores/catalog'
import { RARITY_LABEL } from '@/lib/xp'
import { formatDate } from '@/lib/format'
import type { Achievement } from '@/types/db'
import AchievementBadge from '@/components/achievements/AchievementBadge.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'

const achievements = useAchievementsStore()
const catalog = useCatalogStore()
const filter = ref<'all' | 'earned' | 'locked'>('all')
const loading = ref(true)

const visible = computed(() =>
  achievements.all.filter((a) => {
    const e = achievements.isEarned(a.id)
    return filter.value === 'all' || (filter.value === 'earned' ? e : !e)
  }),
)

const groups = computed(() => {
  const byCourse = new Map<string | null, Achievement[]>()
  for (const a of visible.value) {
    const list = byCourse.get(a.course_id) ?? []
    list.push(a)
    byCourse.set(a.course_id, list)
  }
  const out: Array<{ key: string; title: string; items: Achievement[] }> = []
  if (byCourse.has(null)) out.push({ key: 'global', title: 'Gerais', items: byCourse.get(null)! })
  for (const [courseId, items] of byCourse) {
    if (courseId === null) continue
    const course = catalog.courses.find((c) => c.id === courseId)
    out.push({ key: courseId, title: course?.title ?? 'Curso', items })
  }
  return out
})

const xpFromAchievements = computed(() =>
  achievements.all.filter((a) => achievements.isEarned(a.id)).reduce((s, a) => s + a.xp, 0),
)

onMounted(async () => {
  try {
    await Promise.all([achievements.load(true), catalog.load()])
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container page">
    <div class="page-head">
      <div>
        <span class="eyebrow">Gamificação</span>
        <h1>Conquistas</h1>
      </div>
    </div>

    <div class="card summary">
      <div class="summary__icon"><Trophy /></div>
      <div class="grow">
        <div class="row between wrap">
          <strong>{{ achievements.earnedCount }} de {{ achievements.all.length }} desbloqueadas</strong>
          <span class="badge badge--accent"><Sparkles /> {{ xpFromAchievements }} XP em conquistas</span>
        </div>
        <ProgressBar :value="achievements.all.length ? (achievements.earnedCount / achievements.all.length) * 100 : 0" variant="gradient" size="sm" />
      </div>
    </div>

    <div class="row wrap" style="margin: 16px 0">
      <button v-for="f in [['all', 'Todas'], ['earned', 'Conquistadas'], ['locked', 'Bloqueadas']] as const" :key="f[0]" type="button" class="chip" :class="{ 'is-on': filter === f[0] }" @click="filter = f[0]">
        {{ f[1] }}
      </button>
    </div>

    <LoadingBlock v-if="loading" text="Carregando conquistas" />

    <template v-else>
      <section v-for="g in groups" :key="g.key" class="group">
        <div class="section-title"><h2>{{ g.title }}</h2></div>
        <div class="grid grid--cards">
          <article v-for="a in g.items" :key="a.id" class="card ach" :class="{ 'is-locked': !achievements.isEarned(a.id) }">
            <AchievementBadge :achievement="a" :earned="achievements.isEarned(a.id)" :size="64" />
            <div class="grow">
              <div class="row between wrap">
                <h3 class="ach__title">{{ a.is_secret && !achievements.isEarned(a.id) ? 'Conquista secreta' : a.title }}</h3>
                <span class="badge" :class="`rarity rarity--${a.rarity}`">{{ RARITY_LABEL[a.rarity] }}</span>
              </div>
              <p class="ach__desc">
                {{ a.is_secret && !achievements.isEarned(a.id) ? 'Continue estudando para descobrir.' : a.description }}
              </p>
              <div class="row between wrap small muted">
                <span v-if="a.xp">+{{ a.xp }} XP</span>
                <span v-if="achievements.isEarned(a.id)">Conquistada em {{ formatDate(achievements.earnedAt.get(a.id)) }}</span>
                <span v-else>Bloqueada</span>
              </div>
            </div>
          </article>
        </div>
      </section>
      <p v-if="!groups.length" class="muted">Nada por aqui com esse filtro.</p>
    </template>
  </div>
</template>

<style scoped>
.summary {
  display: flex;
  align-items: center;
  gap: 14px;
}

.summary__icon {
  flex: none;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: var(--warning-soft);
  color: var(--warning);
}

.summary__icon svg {
  width: 24px;
  height: 24px;
}

.chip {
  padding: 7px 14px;
  border-radius: 999px;
  border: 1px solid var(--border-strong);
  background: var(--surface);
  color: var(--text-2);
  font-size: 0.85rem;
  font-weight: 600;
}

.chip.is-on {
  background: var(--primary-soft);
  border-color: var(--primary);
  color: var(--primary);
}

.group + .group {
  margin-top: 12px;
}

.ach {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.ach.is-locked {
  opacity: 0.8;
}

.ach__title {
  margin: 0;
  font-size: 1rem;
}

.ach__desc {
  margin: 4px 0 8px;
  color: var(--text-2);
  font-size: 0.9rem;
}

.rarity {
  --c: var(--rarity-common);
  color: var(--c);
  border-color: color-mix(in srgb, var(--c) 40%, transparent);
  background: color-mix(in srgb, var(--c) 12%, transparent);
}

.rarity--rare {
  --c: var(--rarity-rare);
}

.rarity--epic {
  --c: var(--rarity-epic);
}

.rarity--legendary {
  --c: var(--rarity-legendary);
}
</style>
