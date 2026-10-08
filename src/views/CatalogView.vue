<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { BookOpen, Search } from 'lucide-vue-next'
import { useCatalogStore } from '@/stores/catalog'
import { LEVEL_LABEL } from '@/lib/format'
import CourseCard from '@/components/course/CourseCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'

const catalog = useCatalogStore()
const query = ref('')
const level = ref<string>('')
const onlyMine = ref(false)

const levels = computed(() => [...new Set(catalog.courses.map((c) => c.level).filter(Boolean))] as string[])

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return catalog.courses.filter((c) => {
    if (onlyMine.value && !catalog.enrollmentFor(c.id)) return false
    if (level.value && c.level !== level.value) return false
    if (!q) return true
    const hay = `${c.title} ${c.subtitle ?? ''} ${c.tags.join(' ')} ${c.instructor_name ?? ''}`.toLowerCase()
    return hay.includes(q)
  })
})

onMounted(() => catalog.load())
</script>

<template>
  <div class="container page">
    <div class="page-head">
      <div>
        <span class="eyebrow">Catálogo</span>
        <h1>Cursos</h1>
      </div>
    </div>

    <div class="filters">
      <label class="search">
        <Search />
        <input v-model="query" class="input" type="search" placeholder="Buscar por título, tema ou instrutor" />
      </label>
      <div class="row wrap">
        <button type="button" class="chip" :class="{ 'is-on': !level && !onlyMine }" @click="level = ''; onlyMine = false">Todos</button>
        <button type="button" class="chip" :class="{ 'is-on': onlyMine }" @click="onlyMine = !onlyMine">Meus cursos</button>
        <button v-for="l in levels" :key="l" type="button" class="chip" :class="{ 'is-on': level === l }" @click="level = level === l ? '' : l">
          {{ LEVEL_LABEL[l] ?? l }}
        </button>
      </div>
    </div>

    <LoadingBlock v-if="catalog.loading && !catalog.loaded" text="Carregando cursos" />
    <div v-else-if="filtered.length" class="grid grid--cards">
      <CourseCard v-for="c in filtered" :key="c.id" :course="c" :enrollment="catalog.enrollmentFor(c.id)" />
    </div>
    <div v-else class="card">
      <EmptyState :icon="BookOpen" title="Nenhum curso encontrado" :text="catalog.courses.length ? 'Tente outra busca ou filtro.' : 'Os cursos publicados aparecerão aqui.'" />
    </div>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.search {
  position: relative;
  display: block;
}

.search svg {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: var(--muted);
  pointer-events: none;
}

.search .input {
  padding-left: 42px;
}

.chip {
  padding: 7px 14px;
  border-radius: 999px;
  border: 1px solid var(--border-strong);
  background: var(--surface);
  color: var(--text-2);
  font-size: 0.85rem;
  font-weight: 600;
  transition: all var(--t-fast);
}

.chip:hover {
  border-color: var(--primary);
}

.chip.is-on {
  background: var(--primary-soft);
  border-color: var(--primary);
  color: var(--primary);
}
</style>
