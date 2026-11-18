<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { ArrowDown, ArrowRight, CircleCheck, CircleX, GripVertical } from 'lucide-vue-next'
import { renderInline } from '@/lib/markdown'
import { shuffle } from '@/lib/format'
import type { DragItem, DragOptions } from '@/types/db'

/**
 * Arrastar e soltar: as peças vão para os lugares com o mouse ou o dedo. Quem usa teclado,
 * ou prefere tocar, escolhe a peça e depois o lugar.
 */
const props = defineProps<{
  options: DragOptions
  modelValue: Record<string, string>
  /** Semente da ordem das peças: a mesma a cada abertura do exercício. */
  seed: number
  disabled?: boolean
  /** Gabarito { lugar: peça }, quando o exercício já foi encerrado. */
  correct?: Record<string, string> | null
}>()
const emit = defineEmits<{ 'update:modelValue': [value: Record<string, string>] }>()

const items = computed(() => shuffle(props.options.items, props.seed))
const itemByKey = computed(() => new Map(props.options.items.map((i) => [i.key, i])))
const placed = computed(() => new Set(Object.values(props.modelValue)))
const pool = computed(() => items.value.filter((i) => !placed.value.has(i.key)))

const selected = ref<string | null>(null)
const announce = ref('')

const plain = (text: string) => text.replace(/[`*]/g, '')
const slotLabel = (key: string) => plain(props.options.slots.find((s) => s.key === key)?.label ?? '')

function place(slotKey: string, itemKey: string) {
  const next = { ...props.modelValue }
  // a peça sai do lugar onde estava; quem ocupava o lugar novo volta para as peças
  for (const k of Object.keys(next)) if (next[k] === itemKey) delete next[k]
  next[slotKey] = itemKey
  selected.value = null
  announce.value = `${plain(itemByKey.value.get(itemKey)?.text ?? '')} colocada em ${slotLabel(slotKey)}.`
  emit('update:modelValue', next)
}

function removeFrom(slotKey: string) {
  const next = { ...props.modelValue }
  delete next[slotKey]
  announce.value = `Peça retirada de ${slotLabel(slotKey)}.`
  emit('update:modelValue', next)
}

function chooseItem(key: string) {
  if (props.disabled) return
  selected.value = selected.value === key ? null : key
  if (selected.value) announce.value = `${plain(itemByKey.value.get(key)?.text ?? '')} selecionada. Agora escolha um lugar.`
}

function chooseSlot(slotKey: string) {
  if (props.disabled) return
  if (selected.value) place(slotKey, selected.value)
  else if (props.modelValue[slotKey]) removeFrom(slotKey)
}

// ---- arrastar com mouse ou dedo (Pointer Events) ----
const MOVE_TOLERANCE = 6
const drag = ref<{ key: string; x: number; y: number; moved: boolean } | null>(null)
const hoverSlot = ref<string | null>(null)
let startX = 0
let startY = 0
let skipClick = false

const slotAt = (x: number, y: number) =>
  document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-drag-slot]')?.dataset.dragSlot ?? null

function onMove(e: PointerEvent) {
  if (!drag.value) return
  const moved = drag.value.moved || Math.hypot(e.clientX - startX, e.clientY - startY) > MOVE_TOLERANCE
  drag.value = { ...drag.value, x: e.clientX, y: e.clientY, moved }
  if (moved) hoverSlot.value = slotAt(e.clientX, e.clientY)
}

function stopListening() {
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerup', onUp)
  window.removeEventListener('pointercancel', onCancel)
}

function onUp(e: PointerEvent) {
  stopListening()
  const current = drag.value
  drag.value = null
  hoverSlot.value = null
  if (!current?.moved) return
  skipClick = true
  const slot = slotAt(e.clientX, e.clientY)
  if (slot) place(slot, current.key)
}

function onCancel() {
  stopListening()
  drag.value = null
  hoverSlot.value = null
}

function startDrag(e: PointerEvent, item: DragItem) {
  if (props.disabled || e.button !== 0) return
  startX = e.clientX
  startY = e.clientY
  skipClick = false
  drag.value = { key: item.key, x: e.clientX, y: e.clientY, moved: false }
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
  window.addEventListener('pointercancel', onCancel)
}

/** O clique que encerra um arraste não conta como escolher a peça. */
function afterDrag(action: () => void) {
  if (skipClick) {
    skipClick = false
    return
  }
  action()
}

onBeforeUnmount(stopListening)

const slotResult = (slotKey: string): 'right' | 'wrong' | null => {
  if (!props.correct) return null
  return props.modelValue[slotKey] === props.correct[slotKey] ? 'right' : 'wrong'
}
const expectedText = (slotKey: string) => {
  const key = props.correct?.[slotKey]
  return key ? (itemByKey.value.get(key)?.text ?? '') : ''
}
</script>

<template>
  <div class="board" :class="{ 'is-dragging': drag?.moved }">
    <p v-if="!disabled" class="hint board__how">Arraste cada peça até o lugar certo. Se preferir, toque na peça e depois no lugar.</p>

    <ul v-if="!disabled || pool.length" class="pool" aria-label="Peças disponíveis">
      <li v-for="item in pool" :key="item.key">
        <button
          class="chip"
          :class="{ 'is-selected': selected === item.key, 'is-lifted': drag?.moved && drag.key === item.key }"
          type="button"
          :disabled="disabled"
          :aria-pressed="selected === item.key"
          @pointerdown="startDrag($event, item)"
          @click="afterDrag(() => chooseItem(item.key))"
        >
          <GripVertical aria-hidden="true" />
          <span class="inline-md" v-html="renderInline(item.text)"></span>
        </button>
      </li>
      <li v-if="!pool.length" class="hint pool__empty">Todas as peças foram colocadas.</li>
    </ul>

    <ol class="slots" :class="`slots--${options.layout}`">
      <li v-for="(slot, i) in options.slots" :key="slot.key" class="slot-wrap">
        <div
          class="slot"
          :class="[
            slotResult(slot.key) ? `slot--${slotResult(slot.key)}` : '',
            { 'is-over': hoverSlot === slot.key, 'is-armed': !!selected && !disabled },
          ]"
          :data-drag-slot="slot.key"
        >
          <span class="slot__label inline-md" v-html="renderInline(slot.label)"></span>

          <button
            v-if="modelValue[slot.key]"
            class="chip chip--placed"
            :class="{ 'is-lifted': drag?.moved && drag.key === modelValue[slot.key] }"
            type="button"
            :disabled="disabled"
            :aria-label="`${plain(itemByKey.get(modelValue[slot.key])?.text ?? '')}, em ${plain(slot.label)}. Toque para retirar.`"
            @pointerdown="startDrag($event, itemByKey.get(modelValue[slot.key])!)"
            @click="afterDrag(() => chooseSlot(slot.key))"
          >
            <span class="inline-md" v-html="renderInline(itemByKey.get(modelValue[slot.key])?.text ?? '')"></span>
          </button>
          <button
            v-else
            class="slot__drop"
            type="button"
            :disabled="disabled"
            :aria-label="`Colocar a peça selecionada em ${plain(slot.label)}`"
            @click="chooseSlot(slot.key)"
          >
            Solte aqui
          </button>

          <p v-if="slotResult(slot.key)" class="slot__verdict">
            <CircleCheck v-if="slotResult(slot.key) === 'right'" aria-hidden="true" />
            <CircleX v-else aria-hidden="true" />
            <span v-if="slotResult(slot.key) === 'right'">Certo</span>
            <span v-else>Certo seria: <span class="inline-md" v-html="renderInline(expectedText(slot.key))"></span></span>
          </p>
        </div>

        <span v-if="options.layout === 'flow' && i < options.slots.length - 1" class="slot__arrow" aria-hidden="true">
          <ArrowDown class="arrow--down" />
          <ArrowRight class="arrow--right" />
        </span>
      </li>
    </ol>

    <p class="sr-only" aria-live="polite">{{ announce }}</p>

    <Teleport to="body">
      <div v-if="drag?.moved" class="ghost" :style="{ left: `${drag.x}px`, top: `${drag.y}px` }" aria-hidden="true">
        <span class="inline-md" v-html="renderInline(itemByKey.get(drag.key)?.text ?? '')"></span>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.board {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.board__how {
  margin: 0;
}
.board.is-dragging {
  user-select: none;
}

.pool {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 10px;
  min-height: 56px;
  list-style: none;
  border: 1px dashed var(--border-strong);
  border-radius: var(--radius);
  background: var(--bg-elev);
}
.pool__empty {
  align-self: center;
  margin: 0;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 100%;
  min-height: 40px;
  padding: 6px 12px 6px 8px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  background: var(--surface-2);
  color: var(--text);
  font: inherit;
  font-size: 0.92rem;
  text-align: left;
  cursor: grab;
  /* o dedo arrasta a peça em vez de rolar a página */
  touch-action: none;
  transition: border-color var(--t-fast), background var(--t-fast);
}
.chip svg {
  flex: none;
  width: 16px;
  height: 16px;
  color: var(--muted);
}
.chip:hover:not(:disabled) {
  border-color: var(--primary);
}
.chip.is-selected {
  border-color: var(--primary);
  background: var(--primary-soft);
  box-shadow: var(--glow-primary);
}
.chip.is-lifted {
  opacity: 0.4;
}
.chip:disabled {
  cursor: default;
  touch-action: auto;
}
.chip--placed {
  width: 100%;
  padding-left: 12px;
  background: var(--primary-soft);
  border-color: var(--primary);
}

.slots {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.slot-wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}
.slot {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface-2);
  transition: border-color var(--t-fast), box-shadow var(--t-fast);
}
.slot.is-armed {
  border-color: var(--border-strong);
}
.slot.is-over {
  border-color: var(--primary);
  box-shadow: var(--glow-primary);
}
.slot--right {
  border-color: var(--primary);
}
.slot--wrong {
  border-color: var(--danger);
  border-style: dashed;
}
.slot__label {
  color: var(--text-2);
  font-size: 0.875rem;
  font-weight: 600;
}
.slot__drop {
  min-height: 40px;
  padding: 6px 10px;
  border: 1px dashed var(--border-strong);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--muted);
  font: inherit;
  font-size: 0.85rem;
  cursor: pointer;
}
.slot__drop:hover:not(:disabled) {
  border-color: var(--primary);
  color: var(--primary);
}
.slot__drop:disabled {
  cursor: default;
}
.slot__verdict {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-2);
}
.slot__verdict svg {
  flex: none;
  width: 16px;
  height: 16px;
}
.slot--right .slot__verdict svg {
  color: var(--primary);
}
.slot--wrong .slot__verdict svg {
  color: var(--danger);
}

.slot__arrow {
  display: flex;
  justify-content: center;
  color: var(--accent);
}
.slot__arrow svg {
  width: 20px;
  height: 20px;
}
.arrow--right {
  display: none;
}

/* desktop: o fluxo vira um diagrama da esquerda para a direita */
@media (min-width: 900px) {
  .slots--flow {
    flex-direction: row;
    align-items: stretch;
    gap: 8px;
  }
  .slots--flow .slot-wrap {
    flex: 1 1 0;
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }
  .slots--flow .slot {
    flex: 1;
    min-width: 0;
    align-self: stretch;
  }
  .slots--flow .arrow--down {
    display: none;
  }
  .slots--flow .arrow--right {
    display: block;
  }
}

.inline-md :deep(code) {
  padding: 0.05em 0.3em;
  border-radius: 5px;
  background: var(--code-bg);
  color: var(--code-str);
  font-family: var(--font-mono);
  font-size: 0.88em;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.ghost {
  position: fixed;
  z-index: 1000;
  max-width: 280px;
  padding: 8px 12px;
  border: 1px solid var(--primary);
  border-radius: var(--radius-sm);
  background: var(--surface-3);
  color: var(--text);
  font-size: 0.92rem;
  box-shadow: var(--shadow-2);
  transform: translate(-50%, -120%);
  pointer-events: none;
}
.ghost :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.88em;
}
</style>
