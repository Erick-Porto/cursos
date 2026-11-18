<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ArrowLeft, ArrowRight, CircleCheck, CircleX, ClipboardList, Undo2 } from 'lucide-vue-next'
import {
  fetchCourseBySlug, fetchExerciseAnswersForStaff, fetchExerciseContent, fetchExerciseKeys, fetchExerciseList, fetchStudentProgress,
  reviewExercise,
} from '@/lib/api'
import { renderMarkdown } from '@/lib/markdown'
import { friendlyError } from '@/lib/supabase'
import { formatDateTime } from '@/lib/format'
import { copyCodeBlock, EXERCISE_STATE_BADGE, EXERCISE_STATE_LABEL, exerciseState, MAX_TRIES } from '@/lib/exercises'
import { useToastStore } from '@/stores/toast'
import type { Course, Exercise, ExerciseAnswer, ExerciseKey, ExerciseList, ExerciseTopic, StudentProgressRow } from '@/types/db'
import LoadingBlock from '@/components/ui/LoadingBlock.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import UserAvatar from '@/components/ui/UserAvatar.vue'

const route = useRoute()
const toast = useToastStore()

const courseSlug = computed(() => String(route.params.course))
const listSlug = computed(() => String(route.params.list))
const studentId = computed(() => String(route.params.student))

const course = ref<Course | null>(null)
const list = ref<ExerciseList | null>(null)
const topics = ref<ExerciseTopic[]>([])
const exercises = ref<Exercise[]>([])
const keys = ref<ExerciseKey[]>([])
const allAnswers = ref<ExerciseAnswer[]>([])
const student = ref<StudentProgressRow | null>(null)
const loading = ref(true)
const error = ref('')

type Filter = 'waiting' | 'code' | 'theory'
const filter = ref<Filter>('waiting')
const feedback = reactive<Record<string, string>>({})
const saving = ref('')

const keyByExercise = computed(() => new Map(keys.value.map((k) => [k.exercise_id, k])))
const exerciseById = computed(() => new Map(exercises.value.map((x) => [x.id, x])))
const answers = computed(() => allAnswers.value.filter((a) => a.user_id === studentId.value))
const answerByExercise = computed(() => new Map(answers.value.map((a) => [a.exercise_id, a])))

const codeAnswers = computed(() => answers.value.filter((a) => exerciseById.value.get(a.exercise_id)?.type === 'code'))
const theoryAnswers = computed(() => answers.value.filter((a) => exerciseById.value.get(a.exercise_id)?.type !== 'code'))
const waitingCount = computed(() => codeAnswers.value.filter((a) => a.status === 'submitted').length)
const theoryRight = computed(() => theoryAnswers.value.filter((a) => a.correct).length)

const groups = computed(() =>
  topics.value
    .map((topic) => {
      const items = exercises.value
        .filter((x) => x.topic_id === topic.id)
        .map((exercise, i) => ({ exercise, number: i + 1, answer: answerByExercise.value.get(exercise.id) ?? null }))
        .filter(({ exercise, answer }) => {
          if (!answer) return false
          if (filter.value === 'theory') return exercise.type !== 'code'
          if (exercise.type !== 'code') return false
          return filter.value === 'code' || answer.status === 'submitted'
        })
      return { topic, items }
    })
    .filter((g) => g.items.length),
)

/** Próximo aluno com código aguardando correção. */
const nextStudent = computed(() => {
  const waiting = allAnswers.value
    .filter((a) => a.status === 'submitted' && a.user_id !== studentId.value)
    .sort((a, b) => a.submitted_at.localeCompare(b.submitted_at))
  return waiting[0]?.user_id ?? null
})

const backTo = computed(() => ({ path: '/instrutor', query: { aba: 'exercicios', curso: course.value?.id ?? '', lista: list.value?.id ?? '' } }))

const codeHtml = (code: string | null | undefined) => renderMarkdown('```javascript\n' + (code ?? '').trimEnd() + '\n```')
const outputHtml = (text: string | null | undefined) => renderMarkdown('```plaintext\n' + (text ?? '').trimEnd() + '\n```')
const norm = (s: string | null | undefined) => (s ?? '').replace(/\r\n?/g, '\n').split('\n').map((l) => l.trimEnd()).join('\n').trim()
const outputMatches = (a: ExerciseAnswer) => norm(a.output) === norm(keyByExercise.value.get(a.exercise_id)?.expected_output)

async function review(a: ExerciseAnswer, approved: boolean) {
  saving.value = a.id
  try {
    const updated = await reviewExercise(a.id, approved, feedback[a.id] ?? '')
    allAnswers.value = allAnswers.value.map((x) => (x.id === updated.id ? updated : x))
    toast.success(approved ? 'Exercício aprovado' : 'Devolvido para ajustes')
  } catch (e) {
    toast.error('Não foi possível salvar', friendlyError(e))
  } finally {
    saving.value = ''
  }
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const c = await fetchCourseBySlug(courseSlug.value)
    const l = c ? await fetchExerciseList(c.id, listSlug.value) : null
    if (!c || !l) {
      error.value = 'Lista de exercícios não encontrada.'
      return
    }
    course.value = c
    list.value = l
    const [content, k, ans, students] = await Promise.all([
      fetchExerciseContent(l.id),
      fetchExerciseKeys(l.id),
      fetchExerciseAnswersForStaff(l.id),
      fetchStudentProgress(),
    ])
    topics.value = content.topics
    exercises.value = content.exercises
    keys.value = k
    allAnswers.value = ans
    student.value = students.find((s) => s.user_id === studentId.value && s.course_id === c.id) ?? null
    for (const a of ans) if (a.user_id === studentId.value) feedback[a.id] = a.feedback ?? ''
    filter.value = ans.some((a) => a.user_id === studentId.value && a.status === 'submitted') ? 'waiting' : 'code'
  } catch (e) {
    error.value = friendlyError(e)
  } finally {
    loading.value = false
  }
}

watch(studentId, load)
onMounted(load)
</script>

<template>
  <div class="container page" @click="copyCodeBlock">
    <RouterLink :to="backTo" class="btn btn--ghost btn--sm" style="margin-bottom: 12px"><ArrowLeft /> Voltar ao painel</RouterLink>

    <LoadingBlock v-if="loading" text="Carregando respostas" />

    <div v-else-if="error" class="card">
      <EmptyState :icon="ClipboardList" title="Não foi possível abrir" :text="error" />
    </div>

    <template v-else>
      <header class="head card">
        <div class="row">
          <UserAvatar :name="student?.full_name ?? 'Aluno'" :src="student?.avatar_url ?? null" :size="44" />
          <div class="grow">
            <h1 class="head__name">{{ student?.full_name ?? 'Aluno' }}</h1>
            <p class="hint" style="margin: 0">{{ list?.title }}</p>
          </div>
        </div>
        <dl class="facts">
          <div><dt>Aguardando correção</dt><dd>{{ waitingCount }}</dd></div>
          <div><dt>Código entregue</dt><dd>{{ codeAnswers.length }}</dd></div>
          <div><dt>Teoria certa</dt><dd>{{ theoryRight }} de {{ theoryAnswers.length }}</dd></div>
        </dl>
        <RouterLink
          v-if="nextStudent && !waitingCount"
          class="btn btn--primary btn--sm head__next"
          :to="`/instrutor/exercicios/${courseSlug}/${listSlug}/${nextStudent}`"
        >
          Próximo aluno <ArrowRight />
        </RouterLink>
      </header>

      <div class="filters" role="tablist" aria-label="Filtrar respostas">
        <button class="filters__tab" :class="{ 'is-active': filter === 'waiting' }" type="button" role="tab" :aria-selected="filter === 'waiting'" @click="filter = 'waiting'">
          Aguardando ({{ waitingCount }})
        </button>
        <button class="filters__tab" :class="{ 'is-active': filter === 'code' }" type="button" role="tab" :aria-selected="filter === 'code'" @click="filter = 'code'">
          Todo o código ({{ codeAnswers.length }})
        </button>
        <button class="filters__tab" :class="{ 'is-active': filter === 'theory' }" type="button" role="tab" :aria-selected="filter === 'theory'" @click="filter = 'theory'">
          Teoria ({{ theoryAnswers.length }})
        </button>
      </div>

      <div v-if="!groups.length" class="card">
        <EmptyState
          :icon="ClipboardList"
          :title="filter === 'waiting' ? 'Nada aguardando correção' : 'Nenhuma resposta aqui'"
          text="Quando este aluno entregar, as respostas aparecem nesta tela."
        />
      </div>

      <section v-for="g in groups" :key="g.topic.id" class="group">
        <h2 class="group__title">{{ g.topic.title }} <span class="hint">{{ g.topic.lesson_title }}</span></h2>

        <article v-for="it in g.items" :key="it.exercise.id" class="card item">
          <header class="item__head">
            <strong>Exercício {{ it.number }}</strong>
            <span class="badge" :class="EXERCISE_STATE_BADGE[exerciseState(it.exercise, it.answer)]">{{ EXERCISE_STATE_LABEL[exerciseState(it.exercise, it.answer)] }}</span>
            <span class="hint item__when">{{ formatDateTime(it.answer!.submitted_at) }}</span>
          </header>

          <details class="item__prompt">
            <summary>Ver o enunciado</summary>
            <div class="md" v-html="renderMarkdown(it.exercise.prompt_md)"></div>
          </details>

          <!-- código -->
          <template v-if="it.exercise.type === 'code'">
            <div class="compare">
              <div class="compare__col">
                <h3 class="compare__title">Código do aluno</h3>
                <div class="md" v-html="codeHtml(it.answer!.code)"></div>
                <h3 class="compare__title">Saída que o aluno colou</h3>
                <div class="md" v-html="outputHtml(it.answer!.output)"></div>
                <p class="match" :class="outputMatches(it.answer!) ? 'match--ok' : 'match--no'">
                  <CircleCheck v-if="outputMatches(it.answer!)" aria-hidden="true" /><CircleX v-else aria-hidden="true" />
                  {{ outputMatches(it.answer!) ? 'Igual à saída esperada' : 'Diferente da saída esperada' }}
                </p>
              </div>
              <div class="compare__col">
                <h3 class="compare__title">Solução de referência</h3>
                <div class="md" v-html="codeHtml(keyByExercise.get(it.exercise.id)?.solution_code)"></div>
                <h3 class="compare__title">Saída esperada</h3>
                <div class="md" v-html="outputHtml(keyByExercise.get(it.exercise.id)?.expected_output)"></div>
              </div>
            </div>

            <div class="field">
              <label :for="`fb-${it.answer!.id}`">Comentário para o aluno</label>
              <textarea
                :id="`fb-${it.answer!.id}`"
                v-model="feedback[it.answer!.id]"
                class="input"
                rows="2"
                maxlength="5000"
                placeholder="Obrigatório para devolver. Diga o que ajustar e onde olhar."
              ></textarea>
            </div>
            <div class="item__actions">
              <button class="btn btn--outline" type="button" :disabled="saving === it.answer!.id" @click="review(it.answer!, false)"><Undo2 /> Devolver</button>
              <button class="btn btn--primary" type="button" :disabled="saving === it.answer!.id" @click="review(it.answer!, true)"><CircleCheck /> Aprovar</button>
            </div>
          </template>

          <!-- teoria: corrigida automaticamente -->
          <p v-else class="match" :class="it.answer!.correct ? 'match--ok' : 'match--no'">
            <CircleCheck v-if="it.answer!.correct" aria-hidden="true" /><CircleX v-else aria-hidden="true" />
            {{ it.answer!.correct ? 'Acertou' : 'Errou' }} em {{ it.answer!.tries }} de {{ MAX_TRIES }} tentativas
          </p>
        </article>
      </section>
    </template>
  </div>
</template>

<style scoped>
.head {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 14px;
}
.head__name {
  margin: 0;
  font-size: 1.25rem;
}
.head__next {
  align-self: flex-start;
}
.facts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
  margin: 0;
}
.facts dt {
  color: var(--muted);
  font-size: 0.75rem;
  font-weight: 600;
}
.facts dd {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
}

.filters {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  scrollbar-width: none;
  width: fit-content;
  max-width: 100%;
  margin-bottom: 16px;
  padding: 4px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
}
.filters__tab {
  flex: none;
  padding: 8px 14px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: var(--text-2);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}
.filters__tab.is-active {
  background: var(--primary-soft);
  color: var(--primary);
}

.group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 22px;
}
.group__title {
  margin: 0;
  font-size: 1.05rem;
}
.item {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.item__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
.item__when {
  margin-left: auto;
}
.item__prompt summary {
  cursor: pointer;
  color: var(--text-2);
  font-size: 0.9rem;
  font-weight: 600;
}
.item__prompt[open] summary {
  margin-bottom: 8px;
}
.item__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
}

.compare {
  display: grid;
  gap: 14px;
  grid-template-columns: minmax(0, 1fr);
}
@media (min-width: 900px) {
  .compare {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.compare__col {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.compare__title {
  margin: 4px 0 0;
  color: var(--text-2);
  font-size: 0.82rem;
}

.match {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
}
.match svg {
  flex: none;
  width: 16px;
  height: 16px;
}
.match--ok {
  color: var(--primary);
}
.match--no {
  color: var(--warning);
}
</style>
