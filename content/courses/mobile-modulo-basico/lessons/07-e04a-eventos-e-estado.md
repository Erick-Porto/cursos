---
title: Eventos e estado com useState
summary: Reaja a cliques e guarde dados que mudam com useState, sem mutar arrays.
module: react
duration_minutes: 35
objectives:
  - Reagir a eventos de clique no JSX
  - Guardar e atualizar dados com useState
  - Adicionar, remover e alterar itens de um array sem mutá-lo
---

# Eventos e estado com useState

Programador Mobile: Módulo Básico · Encontro E04 · Aula 7 de 18

---

## O que você vai aprender

:::goal
- Reagir a cliques com `onClick` no JSX
- Guardar dados que mudam com `useState`
- Adicionar, remover e alterar itens de um array sem mutá-lo
- Fazer o botão "Concluir" do `CartaoTarefa` funcionar
:::

---

## Por que isso importa

O `minhas-tarefas` já mostra uma lista bonita, mas ela é um **cartaz**: o array de tarefas está fixo no `App` e nenhum botão faz nada.

Um app de verdade precisa reagir:

- clicar em "Concluir" risca a tarefa
- digitar um título cria uma tarefa nova
- o contador de pendentes muda sozinho

:::question
Quando você clica em um botão, como o React fica sabendo que precisa redesenhar a tela?
:::

---

## :icon[mouse-pointer-click] Eventos no JSX

Um **evento** é algo que a pessoa faz: clicar, digitar, enviar. No JSX, você liga uma função ao evento com um atributo em camelCase, como `onClick`.

```jsx
function Botao() {
  function avisar() {
    alert('Você clicou!')
  }
  return <button onClick={avisar}>Clique aqui</button>
}
```

::::columns
:::col
**Certo:** `onClick={avisar}` passa a função. O React a chama no clique.
:::
:::col
**Errado:** `onClick={avisar()}` chama a função na hora de desenhar e passa o resultado (`undefined`).
:::
::::

---

## O problema: a variável comum não redesenha

Primeira tentativa de um contador:

```jsx
let contador = 0

function Contador() {
  function contar() {
    contador++
    console.log(contador) // 1, 2, 3...
  }
  return <button onClick={contar}>Cliques: {contador}</button>
}
```

O console mostra 1, 2, 3, mas o botão continua em **0**.

O React não "vê" variáveis comuns. Ele só redesenha um componente quando você avisa, e `contador++` não avisa ninguém.

---

## :icon[braces] useState: a memória do componente

**Estado** é um dado que o componente guarda e que, ao mudar, faz o React redesenhar. Você cria um com `useState`:

```jsx
import { useState } from 'react'

const [contador, setContador] = useState(0)
```

| Parte | O que é |
|---|---|
| `contador` | o valor atual |
| `setContador` | a função que troca o valor e pede o redesenho |
| `useState(0)` | o valor inicial, usado só na primeira vez |

:::tip
A convenção é `[coisa, setCoisa]`. Sempre em par, sempre dentro do componente.
:::

---

## Exemplo completo: contador

```jsx
import { useState } from 'react'

function Contador() {
  const [contador, setContador] = useState(0)

  function contar() {
    setContador(contador + 1)
  }

  return <button onClick={contar}>Cliques: {contador}</button>
}

export default Contador
```

Agora o botão acompanha cada clique. A diferença para a variável comum está toda em `setContador`.

---

## :icon[refresh-cw] O ciclo de um clique

:::center
![Animação: o clique no botão Cliques: 0 chama setContador(contador + 1), que guarda o valor 1 e pede o redesenho; o React chama Contador() de novo e o JSX novo mostra Cliques: 1](images/e04-clique-redesenha.svg)
:::

A cada clique, `setContador` guarda o novo valor e pede o redesenho. O React chama `Contador()` de novo, e o JSX sai com o número atualizado.

---

## :icon[lightbulb] Pense

:::question
Imagine a tela de um **player de música**: nome da música, botão de tocar/pausar, barra de progresso, controle de volume, botão de curtir e a lista de próximas faixas.

O que nessa tela é **estado** (muda quando você interage) e o que é só dado fixo? Para cada item que muda, qual seria o valor inicial do `useState`?
:::

---

## :icon[triangle-alert] Estado com arrays: nunca mutar

Com arrays, a tentação é usar `push`:

```jsx
const [tarefas, setTarefas] = useState([])

function adicionar(nova) {
  tarefas.push(nova)   // muda o array por dentro
  setTarefas(tarefas)  // entrega o mesmo array de antes
}
```

Não funciona: `push` **muta** o array (altera o original). O React compara o array novo com o antigo, vê que é o mesmo objeto e não redesenha.

:::center
![Diagrama: com tarefas.push(nova), antes e depois apontam para o mesmo array e o React não redesenha; com o spread, depois aponta para um array novo e o React redesenha](images/e04-push-mesmo-array.svg)
:::

A regra: **sempre crie um array novo** e entregue para `setTarefas`. Três receitas resolvem quase tudo.

---

## :icon[plus] Receita 1: adicionar com spread

O **spread** (`...`) copia os itens de um array para dentro de outro, novo:

```javascript
const tarefas = [{ id: 1, titulo: 'Estudar React' }]
const nova = { id: 2, titulo: 'Fazer café' }

const atualizadas = [...tarefas, nova]
// [{ id: 1, ... }, { id: 2, ... }]
```

No componente:

```jsx
setTarefas([...tarefas, nova])
```

`tarefas` continua intacto; `atualizadas` é um array novo com um item a mais.

---

## :icon[trash-2] Receita 2: remover com filter

`filter` percorre o array e devolve um **array novo** só com os itens que passam no teste:

```javascript
const tarefas = [
  { id: 1, titulo: 'Estudar React' },
  { id: 2, titulo: 'Fazer café' },
]

const semCafe = tarefas.filter((t) => t.id !== 2)
// [{ id: 1, titulo: 'Estudar React' }]
```

No componente:

```jsx
setTarefas(tarefas.filter((t) => t.id !== id))
```

Lê-se: "fique com as tarefas cujo id é diferente do que quero remover".

---

## :icon[pencil] Receita 3: alterar com map

`map` devolve um **array novo** com o mesmo tamanho, trocando cada item pelo que a função retornar:

```javascript
const concluidas = tarefas.map((t) =>
  t.id === 2 ? { ...t, concluida: true } : t
)
```

- se o `id` bate, devolve uma **cópia** do objeto com `concluida` trocada
- se não bate, devolve o item como está

:::tip
O spread também funciona em objetos: `{ ...t, concluida: true }` copia `t` e sobrescreve só `concluida`.
:::

---

## No projeto: alternarConcluida no App

O `App` passa a guardar as tarefas em estado e ganha a função que inverte `concluida`:

```jsx
const [tarefas, setTarefas] = useState(tarefasIniciais)

function alternarConcluida(id) {
  setTarefas(
    tarefas.map((t) =>
      t.id === id ? { ...t, concluida: !t.concluida } : t
    )
  )
}

// no JSX do App:
<ListaTarefas tarefas={tarefas} onAlternar={alternarConcluida} />
```

`ListaTarefas` recebe `onAlternar` e repassa para cada `CartaoTarefa`, junto com o `id` da tarefa:

```jsx
<CartaoTarefa key={t.id} id={t.id} titulo={t.titulo}
  prioridade={t.prioridade} concluida={t.concluida} onAlternar={onAlternar} />
```

---

## CartaoTarefa: o botão Concluir

```jsx
export default function CartaoTarefa({ id, titulo, prioridade, concluida, onAlternar }) {
  return (
    <div className={estilos.cartao}>
      <h3>{titulo}</h3>
      <p>Prioridade: {prioridade}</p>
      <button onClick={() => onAlternar(id)}>
        {concluida ? 'Reabrir' : 'Concluir'}
      </button>
    </div>
  )
}
```

- `onAlternar(id)` precisa de argumento, então vai embrulhada em uma **arrow function**: `() => onAlternar(id)`. Sem isso, seria chamada na hora de desenhar.
- O cartão não sabe como a lista muda: ele só **avisa** o `App`, que é quem guarda o estado.
- As classes dinâmicas do CSS Module (`estilos.concluida`) continuam valendo.

---

## A atualização não é imediata

:::warning
`setContador` não troca a variável na hora. Ele **agenda** o redesenho; o valor novo só existe quando o componente roda de novo.

```jsx
function contar() {
  setContador(contador + 1)
  console.log(contador) // ainda mostra o valor antigo
}
```

Não leia o estado logo depois do `set`. Se precisa do valor novo, use o que você acabou de calcular (`contador + 1`).
:::

---

## :icon[bug] Erros comuns

:::warning
- Escrever `onClick={contar()}`: a função roda ao desenhar, não no clique
- Usar `push`, `splice` ou `tarefas[0].concluida = true` no estado: o React não percebe
- Esquecer o `import { useState } from 'react'`: erro "useState is not defined"
- Ler o estado logo após o `set` e estranhar o valor antigo
- Criar o `useState` fora do componente ou dentro de um `if`
:::

---

## :icon[list-checks] Resumo

:::summary
- Eventos ligam funções a ações da pessoa: `onClick={funcao}`, sem parênteses
- Variáveis comuns mudam em silêncio; só o estado faz o React redesenhar
- `const [valor, setValor] = useState(inicial)` cria a memória do componente
- Arrays no estado nunca são mutados: spread para adicionar, `filter` para remover, `map` para alterar
- O filho avisa o pai por uma função recebida via prop, como `onAlternar`
:::

---

## :icon[arrow-right] Próximos passos

O botão "Concluir" funciona, mas ainda não dá para **criar** tarefas: falta um campo de texto.

Na próxima aula, você vai ligar inputs ao estado, tratar o envio de um formulário sem recarregar a página e montar o `FormularioTarefa` que conversa com o `App`.

- :icon[keyboard] inputs controlados
- :icon[check] validação e limpeza do campo
- :icon[layers] estado no componente certo
