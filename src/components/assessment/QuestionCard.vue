<script setup lang="ts">
import { computed } from 'vue'
import { Check, CircleCheck, CircleX, X } from 'lucide-vue-next'
import { renderInline, renderMarkdown } from '@/lib/markdown'
import type { AnswerValue, AttemptDetail, Question, QuestionOption } from '@/types/db'

const props = defineProps<{
  question: Question
  options: QuestionOption[]
  modelValue: AnswerValue
  number: number
  total: number
  disabled?: boolean
  /** Quando presente, mostra a correção (modo revisão). */
  review?: AttemptDetail | null
}>()
const emit = defineEmits<{ 'update:modelValue': [value: AnswerValue] }>()

const BLANK = /_{3,}/

const promptHtml = computed(() => renderMarkdown(props.question.prompt_md))
const fillParts = computed(() => props.question.prompt_md.split(BLANK))
const fillCount = computed(() => Math.max(1, fillParts.value.length - 1))

const fillValues = computed<string[]>(() => {
  const v = props.modelValue
  const arr = Array.isArray(v) ? v.map(String) : []
  return Array.from({ length: fillCount.value }, (_, i) => arr[i] ?? '')
})

function setFill(i: number, text: string) {
  const next = [...fillValues.value]
  next[i] = text
  emit('update:modelValue', next)
}

const multiValues = computed<string[]>(() => (Array.isArray(props.modelValue) ? props.modelValue.map(String) : []))
function toggleMulti(key: string) {
  const set = new Set(multiValues.value)
  if (set.has(key)) set.delete(key)
  else set.add(key)
  emit('update:modelValue', [...set])
}

const correctKeys = computed<string[]>(() => {
  const c = props.review?.correct_answer
  if (c === null || c === undefined) return []
  return Array.isArray(c) ? c.map(String) : [String(c)]
})

function optionState(key: string): 'correct' | 'wrong' | 'missed' | null {
  if (!props.review || correctKeys.value.length === 0) return null
  const chosen =
    props.question.type === 'multiple' ? multiValues.value.includes(key) : String(props.modelValue ?? '') === key
  const isCorrect = correctKeys.value.includes(key)
  if (chosen && isCorrect) return 'correct'
  if (chosen && !isCorrect) return 'wrong'
  if (!chosen && isCorrect) return 'missed'
  return null
}

const expectedFill = computed<string[]>(() => {
  const c = props.review?.correct_answer
  if (!Array.isArray(c)) return []
  return c.map((variants) => (Array.isArray(variants) ? String(variants[0] ?? '') : String(variants)))
})

const typeLabel: Record<Question['type'], string> = {
  single: 'Escolha uma alternativa',
  multiple: 'Marque todas as corretas',
  truefalse: 'Verdadeiro ou falso',
  fill: 'Complete as lacunas',
}
</script>

<template>
  <section class="q card" :class="{ 'q--correct': review?.correct, 'q--wrong': review && !review.correct }">
    <header class="q__head">
      <span class="q__num">Questão {{ number }} de {{ total }}</span>
      <span class="q__type">{{ typeLabel[question.type] }} · {{ question.points }} {{ question.points === 1 ? 'ponto' : 'pontos' }}</span>
    </header>

    <!-- enunciado (lacunas são renderizadas inline abaixo) -->
    <div v-if="question.type !== 'fill'" class="q__prompt md" v-html="promptHtml"></div>
    <p v-else class="q__prompt q__fill">
      <template v-for="(part, i) in fillParts" :key="i">
        <span v-html="renderInline(part)"></span>
        <input
          v-if="i < fillParts.length - 1"
          class="q__blank"
          type="text"
          autocomplete="off"
          spellcheck="false"
          :value="fillValues[i]"
          :disabled="disabled"
          :aria-label="`Lacuna ${i + 1}`"
          @input="setFill(i, ($event.target as HTMLInputElement).value)"
        />
      </template>
    </p>

    <!-- alternativas -->
    <div v-if="question.type === 'single' || question.type === 'multiple'" class="q__options">
      <label
        v-for="opt in options"
        :key="opt.key"
        class="opt"
        :class="[
          optionState(opt.key) ? `opt--${optionState(opt.key)}` : '',
          {
            'is-selected':
              question.type === 'multiple' ? multiValues.includes(opt.key) : String(modelValue ?? '') === opt.key,
          },
        ]"
      >
        <input
          v-if="question.type === 'single'"
          type="radio"
          :name="`q-${question.id}`"
          :value="opt.key"
          :checked="String(modelValue ?? '') === opt.key"
          :disabled="disabled"
          @change="emit('update:modelValue', opt.key)"
        />
        <input
          v-else
          type="checkbox"
          :value="opt.key"
          :checked="multiValues.includes(opt.key)"
          :disabled="disabled"
          @change="toggleMulti(opt.key)"
        />
        <span class="opt__mark" aria-hidden="true"><Check /></span>
        <span class="opt__text" v-html="renderInline(opt.text)"></span>
        <span v-if="optionState(opt.key) === 'correct'" class="opt__state"><CircleCheck /></span>
        <span v-else-if="optionState(opt.key) === 'wrong'" class="opt__state"><CircleX /></span>
        <span v-else-if="optionState(opt.key) === 'missed'" class="opt__state opt__state--missed">esperada</span>
      </label>
    </div>

    <div v-else-if="question.type === 'truefalse'" class="q__tf">
      <button
        v-for="v in [true, false]"
        :key="String(v)"
        type="button"
        class="tf"
        :class="[
          { 'is-selected': String(modelValue) === String(v) },
          optionState(String(v)) ? `opt--${optionState(String(v))}` : '',
        ]"
        :disabled="disabled"
        @click="emit('update:modelValue', v)"
      >
        <component :is="v ? Check : X" />
        {{ v ? 'Verdadeiro' : 'Falso' }}
      </button>
    </div>

    <!-- revisão -->
    <footer v-if="review" class="q__review">
      <div class="q__verdict">
        <component :is="review.correct ? CircleCheck : CircleX" />
        <strong>{{ review.correct ? 'Correta' : 'Incorreta' }}</strong>
        <span class="muted">· {{ review.earned }}/{{ review.points }} pt</span>
      </div>
      <p v-if="question.type === 'fill' && !review.correct && expectedFill.length" class="small text-2">
        Resposta esperada: <strong>{{ expectedFill.join(' / ') }}</strong>
      </p>
      <div v-if="review.explanation_md" class="q__explain md" v-html="renderMarkdown(review.explanation_md)"></div>
    </footer>
  </section>
</template>

<style scoped>
.q {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.q--correct {
  border-color: color-mix(in srgb, var(--primary) 50%, var(--border));
}

.q--wrong {
  border-color: color-mix(in srgb, var(--danger) 50%, var(--border));
}

.q__head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 6px;
  font-size: 0.78rem;
  color: var(--muted);
  font-weight: 600;
}

.q__num {
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.q__prompt {
  font-size: 1.08rem;
  font-weight: 500;
  line-height: 1.6;
}

.q__fill {
  margin: 0;
}

.q__blank {
  display: inline-block;
  width: 10ch;
  min-width: 6ch;
  margin: 0 4px;
  padding: 2px 8px;
  border: 0;
  border-bottom: 2px solid var(--primary);
  background: var(--primary-soft);
  border-radius: 6px 6px 0 0;
  font-family: var(--font-mono);
  font-size: 0.95em;
  text-align: center;
}

.q__blank:focus {
  outline: none;
  background: color-mix(in srgb, var(--primary) 22%, transparent);
}

.q__options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.opt {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: var(--radius);
  border: 1px solid var(--border-strong);
  background: var(--bg-elev);
  cursor: pointer;
  transition: border-color var(--t-fast), background var(--t-fast);
}

.opt input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
}

.opt:hover {
  border-color: var(--primary);
}

.opt.is-selected {
  border-color: var(--primary);
  background: var(--primary-soft);
}

.opt__mark {
  flex: none;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 2px solid var(--border-strong);
  display: grid;
  place-items: center;
  color: transparent;
  transition: all var(--t-fast);
}

.opt__mark svg {
  width: 14px;
  height: 14px;
}

.opt input[type='radio'] + .opt__mark {
  border-radius: 50%;
}

.opt.is-selected .opt__mark {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--on-primary);
}

.opt__text {
  flex: 1;
}

.opt__state {
  flex: none;
  display: inline-flex;
  align-items: center;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.opt__state svg {
  width: 20px;
  height: 20px;
}

.opt--correct {
  border-color: var(--primary) !important;
  background: var(--primary-soft);
}

.opt--correct .opt__state {
  color: var(--primary);
}

.opt--wrong {
  border-color: var(--danger) !important;
  background: var(--danger-soft);
}

.opt--wrong .opt__mark {
  background: var(--danger) !important;
  border-color: var(--danger) !important;
}

.opt--wrong .opt__state {
  color: var(--danger);
}

.opt--missed {
  border-style: dashed;
  border-color: var(--primary) !important;
}

.opt__state--missed {
  color: var(--primary);
}

.q__tf {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.tf {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 56px;
  border-radius: var(--radius);
  border: 1px solid var(--border-strong);
  background: var(--bg-elev);
  font-weight: 700;
  font-size: 1rem;
  transition: all var(--t-fast);
}

.tf svg {
  width: 20px;
  height: 20px;
}

.tf:hover {
  border-color: var(--primary);
}

.tf.is-selected {
  border-color: var(--primary);
  background: var(--primary-soft);
  color: var(--primary);
}

.tf:disabled {
  cursor: default;
}

.q__review {
  border-top: 1px solid var(--border);
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.q__verdict {
  display: flex;
  align-items: center;
  gap: 8px;
}

.q__verdict svg {
  width: 20px;
  height: 20px;
}

.q--correct .q__verdict {
  color: var(--primary);
}

.q--wrong .q__verdict {
  color: var(--danger);
}

.q__explain {
  font-size: 0.95rem;
  color: var(--text-2);
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  background: var(--surface-2);
}
</style>
