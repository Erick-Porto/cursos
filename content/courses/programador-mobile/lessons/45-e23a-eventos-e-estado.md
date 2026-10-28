---
title: Eventos e estado com useState
summary: Reaja a cliques e guarde dados que mudam com useState, sem mutar arrays.
module: react
duration_minutes: 35
objectives:
  - Reagir a eventos de clique no JSX
  - Guardar e atualizar dados com useState
  - Adicionar, remover e alterar itens de um array no estado sem mutá-lo
  - Explicar por que o React só redesenha quando recebe uma referência nova
---

# Eventos e estado com useState

Programador Mobile · Encontro E23 · Aula 45 de 89

---

## O que você vai aprender

:::goal
- Reagir a cliques com `onClick` no JSX
- Guardar dados que mudam com `useState`
- Entender por que o React só redesenha quando recebe um array novo
- Fazer o botão "Concluir" do `CartaoTarefa` funcionar
:::

---

## Por que isso importa

O `minhas-tarefas` já mostra uma lista bonita, mas ela é um **cartaz**: o array de tarefas está fixo no `App` e nenhum botão faz nada.

Um app de verdade precisa reagir:

- clicar em "Concluir" risca a tarefa
- digitar um título cria uma tarefa nova
- o contador de pendentes muda sozinho

No E21, você só observou um contador com `useState`. Hoje, você entende cada peça dele.

:::question
Quando você clica em um botão, como o React fica sabendo que precisa redesenhar a tela?
:::

---

## :icon[mouse-pointer-click] Eventos no JSX

Um **evento** é algo que a pessoa faz: clicar, digitar, enviar. No E01, `addEventListener('click', ...)` ligava uma função ao clique. No JSX, basta um atributo em camelCase, como `onClick`:

```jsx
function Botao() {
  function avisar() {
    alert('Você clicou!')
  }
  return <button onClick={avisar}>Clique aqui</button>
}
```

É um callback, como no E10a: você entrega a função e o React a chama no clique.

::::columns
:::col
**Certo:** `onClick={avisar}` entrega a função.
:::
:::col
**Errado:** `onClick={avisar()}` chama a função na hora de desenhar e entrega o resultado (`undefined`).
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

`useState` devolve um par, e os colchetes são a desestruturação de array do E09b: vale a posição, e você escolhe os nomes. A convenção é `[coisa, setCoisa]`, sempre dentro do componente.

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
![Animação: o clique no botão Cliques: 0 chama setContador(contador + 1), que guarda o valor 1 e pede o redesenho; o React chama Contador() de novo e o JSX novo mostra Cliques: 1](images/e23-clique-redesenha.svg)
:::

A cada clique, `setContador` guarda o novo valor e pede o redesenho. O React chama `Contador()` de novo, e o JSX sai com o número atualizado.

---

## :icon[lightbulb] Pense

:::question
Imagine a tela de um **player de música**: nome da música, botão de tocar/pausar, barra de progresso, controle de volume, botão de curtir e a lista de próximas faixas.

O que nessa tela é **estado** (muda quando você interage) e o que é só dado fixo? Para cada item que muda, qual seria o valor inicial do `useState`?
:::

---

## :icon[triangle-alert] Estado com arrays: o push não redesenha

Com arrays, a tentação é usar `push`:

```jsx
const [tarefas, setTarefas] = useState([])

function adicionar(nova) {
  tarefas.push(nova)   // muda o array por dentro
  setTarefas(tarefas)  // entrega o mesmo array de antes
}
```

O `console.log(tarefas)` mostra a tarefa nova, mas a tela não muda. `push` **muta** o array: altera o original, sem criar outro. É o mesmo bug do carrinho que "mudou sozinho" no E09b, só que agora quem guardou a lista antiga é o React.

---

## :icon[equal-not] O React compara referências

No E11b, a prévia dizia: o React pergunta se o valor novo é **o mesmo** do anterior, com `Object.is`. Para arrays e objetos, ele funciona como o `===`: compara endereços, não conteúdo.

:::center
![Diagrama: com tarefas.push(nova), antes e depois apontam para o mesmo array e o React não redesenha; com o spread, depois aponta para um array novo e o React redesenha](images/e23-push-mesmo-array.svg)
:::

```javascript
Object.is(tarefas, tarefas)             // true: nada mudou, nada redesenha
Object.is(tarefas, [...tarefas, nova])  // false: array novo, a tela redesenha
```

A regra: **sempre entregue um array novo** ao `set`.

---

## :icon[arrow-left-right] As receitas do E09b, agora no estado

São as três linhas da tabela "Atualizar sem mutar" do E09b. A única novidade é que o resultado vai para o `set`:

```jsx
// adicionar: spread
setTarefas([...tarefas, nova])

// remover: filter fica com todas menos a do id
setTarefas(tarefas.filter((t) => t.id !== id))

// alterar: map devolve uma cópia só do item certo
setTarefas(tarefas.map((t) => (t.id === id ? { ...t, concluida: true } : t)))
```

Os três devolvem um array novo, e `tarefas` continua intacto.

:::tip
As regras do `carrinho.js` do `lojinha-regras` já devolvem arrays novos. No E30, `setItens(adicionarItem(itens, produto))` funciona sem mudar uma linha delas.
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

- `onAlternar(id)` precisa de argumento, então vai embrulhada em uma arrow: `() => onAlternar(id)`. Sem isso, seria chamada na hora de desenhar.
- A arrow é uma closure (E10a): cada cartão cria a sua, e ela lembra o `id` daquele cartão.
- O cartão não muda a lista: ele só **avisa** o `App`, que guarda o estado. As classes dinâmicas do E22 continuam valendo.

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
- Usar `push`, `splice` ou `tarefas[0].concluida = true` no estado: a referência não muda e o React não percebe
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
- O React compara referências: arrays no estado nunca são mutados; spread adiciona, `filter` remove, `map` altera
- O filho avisa o pai por uma função recebida via prop, como `onAlternar`
:::

---

## :icon[arrow-right] Próximos passos

O botão "Concluir" funciona, mas ainda não dá para **criar** tarefas: falta um campo de texto.

Na próxima aula, você vai ligar inputs ao estado, tratar o envio de um formulário sem recarregar a página e montar o `FormularioTarefa` que conversa com o `App`.

- :icon[keyboard] inputs controlados
- :icon[check] validação e limpeza do campo
- :icon[layers] estado no componente certo
