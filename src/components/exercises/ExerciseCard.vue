<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Check, CircleCheck, CircleX, Copy, ExternalLink, MessageSquare, RotateCcw, Send } from 'lucide-vue-next'
import { renderMarkdown } from '@/lib/markdown'
import { friendlyError } from '@/lib/supabase'
import { submitExercise } from '@/lib/api'
import {
  choiceOptions, COMPILER_URL, dragOptions, EXERCISE_STATE_BADGE, EXERCISE_STATE_LABEL, EXERCISE_TYPE_LABEL, exerciseState,
  isAnswerReady, MAX_TRIES,
} from '@/lib/exercises'
import type { AnswerValue, AttemptDetail, Exercise, ExerciseAnswer, ExerciseAnswerValue, Question, QuestionType } from '@/types/db'
import QuestionCard from '@/components/assessment/QuestionCard.vue'
import DragBoard from '@/components/exercises/DragBoard.vue'

const props = defineProps<{
  exercise: Exercise
  number: number
  answer: ExerciseAnswer | null
  /** Sem matrícula o aluno só lê os enunciados. */
  readonly?: boolean
}>()
const emit = defineEmits<{ saved: [answer: ExerciseAnswer] }>()

const isCode = computed(() => props.exercise.type === 'code')
const isDrag = computed(() => props.exercise.type === 'drag')
const state = computed(() => exerciseState(props.exercise, props.answer))
const reveal = computed(() => props.answer?.reveal ?? null)
const closed = computed(() => state.value === 'correct' || state.value === 'wrong' || state.value === 'approved')
const locked = computed(() => closed.value || !!props.readonly)
const triesLeft = computed(() => MAX_TRIES - (props.answer?.tries ?? 0))

const promptHtml = computed(() => (props.exercise.type === 'fill' ? '' : renderMarkdown(props.exercise.prompt_md)))
const explanationHtml = computed(() => renderMarkdown(reveal.value?.explanation_md ?? ''))
const solutionHtml = computed(() =>
  reveal.value?.solution_code ? renderMarkdown('```javascript\n' + reveal.value.solution_code.trimEnd() + '\n```') : '',
)
const starterHtml = computed(() =>
  props.exercise.starter_code ? renderMarkdown('```javascript\n' + props.exercise.starter_code.trimEnd() + '\n```') : '',
)

// ---- rascunho do código: fica neste navegador até a entrega ----
const draftKey = computed(() => `exercicio-rascunho:${props.exercise.id}`)

function readDraft(): { code: string; output: string } | null {
  try {
    const raw = localStorage.getItem(draftKey.value)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
function writeDraft() {
  try {
    localStorage.setItem(draftKey.value, JSON.stringify({ code: code.value, output: output.value }))
  } catch {
    // sem armazenamento disponível: segue sem rascunho
  }
}
function clearDraft() {
  try {
    localStorage.removeItem(draftKey.value)
  } catch {
    // sem armazenamento disponível: nada a limpar
  }
}

// ---- resposta em edição ----
const code = ref('')
const output = ref('')
const value = ref<ExerciseAnswerValue>(null)
const sending = ref(false)
const error = ref('')
const copied = ref(false)

function emptyValue(): ExerciseAnswerValue {
  if (props.exercise.type === 'drag') return {}
  if (props.exercise.type === 'multiple' || props.exercise.type === 'fill') return []
  return null
}

function fill() {
  const a = props.answer
  const draft = isCode.value && state.value !== 'approved' ? readDraft() : null
  code.value = draft?.code ?? a?.code ?? ''
  output.value = draft?.output ?? a?.output ?? ''
  value.value = a?.answer ?? emptyValue()
  error.value = ''
}
watch(() => [props.exercise.id, props.answer?.updated_at], fill, { immediate: true })

const ready = computed(() =>
  isCode.value ? code.value.trim() !== '' && output.value.trim() !== '' : isAnswerReady(props.exercise, value.value),
)

const submitLabel = computed(() => {
  if (sending.value) return 'Enviando…'
  if (!isCode.value) return 'Conferir resposta'
  if (state.value === 'returned') return 'Reenviar'
  return state.value === 'submitted' ? 'Atualizar entrega' : 'Entregar'
})

async function send() {
  error.value = ''
  if (!ready.value) {
    error.value = isCode.value ? 'Preencha o código e a saída antes de entregar.' : 'Responda antes de conferir.'
    return
  }
  sending.value = true
  try {
    const res = await submitExercise(
      isCode.value
        ? { exerciseId: props.exercise.id, code: code.value, output: output.value }
        : { exerciseId: props.exercise.id, answer: value.value },
    )
    if (isCode.value) clearDraft()
    emit('saved', { ...res.answer, reveal: res.reveal })
  } catch (e) {
    error.value = friendlyError(e)
  } finally {
    sending.value = false
  }
}

async function copyStarter() {
  try {
    await navigator.clipboard.writeText(props.exercise.starter_code ?? '')
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    error.value = 'Não foi possível copiar. Selecione o código e use Ctrl + C.'
  }
}

// ---- adaptação para o cartão de questão das avaliações ----
const question = computed<Question>(() => ({
  id: props.exercise.id,
  assessment_id: props.exercise.list_id,
  key: props.exercise.key,
  position: props.exercise.position,
  type: props.exercise.type as QuestionType,
  prompt_md: props.exercise.prompt_md,
  options: choiceOptions(props.exercise),
  explanation_md: null,
  points: 1,
}))

const review = computed<AttemptDetail | null>(() => {
  if (!closed.value || !props.answer) return null
  return {
    question_id: props.exercise.id,
    key: props.exercise.key,
    position: props.exercise.position,
    type: props.exercise.type as QuestionType,
    points: 1,
    earned: props.answer.correct ? 1 : 0,
    correct: !!props.answer.correct,
    user_answer: props.answer.answer as AnswerValue,
    correct_answer: reveal.value?.answer ?? null,
    explanation_md: reveal.value?.explanation_md ?? null,
  }
})

const dragValue = computed({
  get: () => (value.value && typeof value.value === 'object' && !Array.isArray(value.value) ? value.value : {}),
  set: (v: Record<string, string>) => (value.value = v),
})
const questionValue = computed({
  get: () => value.value as AnswerValue,
  set: (v: AnswerValue) => (value.value = v),
})
const dragCorrect = computed(() => (closed.value ? ((reveal.value?.answer as Record<string, string> | undefined) ?? null) : null))
const dragSeed = computed(() => [...props.exercise.id].reduce((s, ch) => (s * 31 + ch.charCodeAt(0)) | 0, 7) || 7)
</script>

<template>
  <article class="ex card" :class="`ex--${state}`">
    <header class="ex__head">
      <span class="ex__num">{{ number }}</span>
      <span class="ex__type">{{ EXERCISE_TYPE_LABEL[exercise.type] }}</span>
      <span class="badge ex__state" :class="EXERCISE_STATE_BADGE[state]">{{ EXERCISE_STATE_LABEL[state] }}</span>
    </header>

    <!-- ===================== código ===================== -->
    <template v-if="isCode">
      <div class="md ex__prompt" v-html="promptHtml"></div>

      <div v-if="exercise.starter_code" class="starter">
        <div class="starter__bar">
          <span class="starter__title">Código inicial</span>
          <button class="btn btn--ghost btn--sm" type="button" @click="copyStarter">
            <Check v-if="copied" /><Copy v-else /> {{ copied ? 'Copiado' : 'Copiar' }}
          </button>
        </div>
        <div class="md" v-html="starterHtml"></div>
      </div>

      <a :href="COMPILER_URL" target="_blank" rel="noopener" class="btn btn--outline btn--sm ex__compiler">
        <ExternalLink /> Abrir o OneCompiler
      </a>

      <div v-if="answer?.feedback" class="note" :class="state === 'returned' ? 'note--warning' : 'note--ok'">
        <MessageSquare aria-hidden="true" />
        <div>
          <strong>Comentário do instrutor</strong>
          <p>{{ answer.feedback }}</p>
        </div>
      </div>

      <form v-if="!readonly" class="ex__form" @submit.prevent="send">
        <div class="field">
          <label :for="`code-${exercise.id}`">Seu código</label>
          <textarea
            :id="`code-${exercise.id}`"
            v-model="code"
            class="input mono ex__code"
            rows="9"
            maxlength="20000"
            spellcheck="false"
            autocapitalize="off"
            autocomplete="off"
            :readonly="locked"
            placeholder="Cole aqui o código que você rodou"
            @input="writeDraft"
          ></textarea>
        </div>
        <div class="field">
          <label :for="`output-${exercise.id}`">Saída do programa</label>
          <textarea
            :id="`output-${exercise.id}`"
            v-model="output"
            class="input mono ex__code"
            rows="4"
            maxlength="20000"
            spellcheck="false"
            autocapitalize="off"
            autocomplete="off"
            :readonly="locked"
            placeholder="Cole aqui o que apareceu em Output"
            @input="writeDraft"
          ></textarea>
        </div>
        <p v-if="error" class="error-text" role="alert">{{ error }}</p>
        <div v-if="!locked" class="ex__actions">
          <button class="btn btn--primary" type="submit" :disabled="sending"><Send /> {{ submitLabel }}</button>
          <span v-if="state === 'submitted'" class="hint">Entregue. Você pode atualizar até o instrutor corrigir.</span>
        </div>
      </form>

      <details v-if="solutionHtml" class="solution">
        <summary>Ver a solução de referência</summary>
        <div class="md" v-html="solutionHtml"></div>
        <div v-if="reveal?.explanation_md" class="md solution__why" v-html="explanationHtml"></div>
      </details>
    </template>

    <!-- ===================== arrastar e soltar ===================== -->
    <template v-else-if="isDrag">
      <div class="md ex__prompt" v-html="promptHtml"></div>
      <DragBoard v-if="dragOptions(exercise)" v-model="dragValue" :options="dragOptions(exercise)!" :seed="dragSeed" :disabled="locked" :correct="dragCorrect" />
      <div v-if="closed" class="verdict" :class="answer?.correct ? 'verdict--ok' : 'verdict--no'">
        <CircleCheck v-if="answer?.correct" aria-hidden="true" /><CircleX v-else aria-hidden="true" />
        <strong>{{ answer?.correct ? 'Correta' : 'Incorreta' }}</strong>
      </div>
      <div v-if="closed && reveal?.explanation_md" class="md explain" v-html="explanationHtml"></div>
    </template>

    <!-- ===================== demais questões de teoria ===================== -->
    <QuestionCard
      v-else
      v-model="questionValue"
      bare
      :question="question"
      :options="choiceOptions(exercise)"
      :number="number"
      :total="5"
      :disabled="locked"
      :review="review"
    />

    <!-- envio da teoria -->
    <template v-if="!isCode && !locked">
      <p v-if="state === 'trying'" class="retry" role="status">
        <RotateCcw aria-hidden="true" />
        Ainda não é essa. {{ triesLeft === 1 ? 'Resta 1 tentativa' : `Restam ${triesLeft} tentativas` }}.
      </p>
      <p v-if="error" class="error-text" role="alert">{{ error }}</p>
      <div class="ex__actions">
        <button class="btn btn--primary" type="button" :disabled="sending" @click="send"><Check /> {{ submitLabel }}</button>
      </div>
    </template>
  </article>
</template>

<style scoped>
.ex {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.ex--correct,
.ex--approved {
  border-color: color-mix(in srgb, var(--primary) 45%, var(--border));
}
.ex--wrong {
  border-color: color-mix(in srgb, var(--danger) 45%, var(--border));
}
.ex--returned,
.ex--trying {
  border-color: color-mix(in srgb, var(--warning) 45%, var(--border));
}

.ex__head {
  display: flex;
  align-items: center;
  gap: 10px;
}
.ex__num {
  flex: none;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--primary-soft);
  color: var(--primary);
  font-weight: 700;
  font-size: 0.9rem;
}
.ex__type {
  min-width: 0;
  color: var(--muted);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.ex__state {
  flex: none;
  margin-left: auto;
}
.ex__prompt {
  font-size: 1rem;
}

.starter {
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: var(--radius);
}
.starter__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 4px 6px 4px 12px;
  background: var(--surface-2);
}
.starter__title {
  color: var(--text-2);
  font-size: 0.82rem;
  font-weight: 600;
}
.starter :deep(.code-block) {
  margin: 0;
  border: 0;
  border-radius: 0;
}
.starter :deep(.code-block__head) {
  display: none;
}
.ex__compiler {
  align-self: flex-start;
}

.ex__form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.ex__code {
  font-size: 0.875rem;
  line-height: 1.55;
  white-space: pre;
  overflow-x: auto;
  tab-size: 2;
}
.ex__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.note {
  display: flex;
  gap: 10px;
  padding: 12px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--surface-2);
}
.note svg {
  flex: none;
  width: 18px;
  height: 18px;
  margin-top: 2px;
}
.note p {
  margin: 4px 0 0;
  white-space: pre-wrap;
}
.note--warning {
  border-color: color-mix(in srgb, var(--warning) 45%, var(--border));
  background: var(--warning-soft);
}
.note--warning svg {
  color: var(--warning);
}
.note--ok {
  border-color: color-mix(in srgb, var(--primary) 45%, var(--border));
  background: var(--primary-soft);
}
.note--ok svg {
  color: var(--primary);
}

.retry {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  color: var(--warning);
  font-size: 0.92rem;
  font-weight: 600;
}
.retry svg {
  flex: none;
  width: 16px;
  height: 16px;
}

.verdict {
  display: flex;
  align-items: center;
  gap: 8px;
}
.verdict svg {
  width: 20px;
  height: 20px;
}
.verdict--ok {
  color: var(--primary);
}
.verdict--no {
  color: var(--danger);
}
.explain,
.solution__why {
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  background: var(--surface-2);
  color: var(--text-2);
  font-size: 0.95rem;
}

.solution {
  padding: 10px 12px;
  border: 1px dashed var(--border-strong);
  border-radius: var(--radius);
}
.solution summary {
  cursor: pointer;
  font-weight: 600;
}
.solution[open] summary {
  margin-bottom: 10px;
}
.solution__why {
  margin-top: 10px;
}
</style>
