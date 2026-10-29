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

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **evento** | algo que a pessoa faz na tela: clicar, digitar, enviar |
| **redesenhar** | o React chamar o componente de novo e atualizar a tela com o JSX novo |
| **estado** | um dado que o componente guarda e que, quando muda, faz a tela ser redesenhada |
| **`useState`** | a função do React que cria um estado |
| **mutar** | mudar um array ou objeto por dentro, sem criar outro |
| **referência** | o endereço de um array ou objeto na memória do computador |

---

## A lista é um cartaz

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

## Eventos

Quando a campainha toca, como você sabe o que fazer?

---

## :icon[mouse-pointer-click] Eventos no JSX

Um **evento** é algo que a pessoa faz: clicar, digitar, enviar. Pense na campainha de casa: você combina antes o que fazer quando ela tocar. No JSX, o combinado é um atributo como `onClick` ("ao clicar"), que recebe a função a chamar:

```jsx
function Botao() {
  function avisar() {
    alert('Você clicou!')
  }
  return <button onClick={avisar}>Clique aqui</button>
}
```

| Parte | O que ela diz |
|---|---|
| `function avisar()` | "isto é o que fazer quando a campainha tocar" |
| `alert(...)` | mostra uma janela de aviso do navegador |
| `onClick={avisar}` | "quando clicarem neste botão, chame `avisar`" |

O nome segue o **camelCase**: palavras grudadas, cada uma nova com maiúscula (`onClick`, não `onclick`).

---

## :icon[mouse-pointer-click] Eventos na prática

Três botões, três combinados. Cada um diz o que fazer quando a campainha tocar:

```jsx
// 1. uma função com nome
<button onClick={avisar}>Clique aqui</button>

// 2. uma arrow escrita ali mesmo
<button onClick={() => console.log('Curtiu!')}>Curtir</button>

// 3. uma arrow que chama outra função, levando um dado junto
<button onClick={() => alert('Tarefa: ' + titulo)}>Detalhes</button>
```

| Clique em | O que acontece |
|---|---|
| Clique aqui | a janela "Você clicou!" |
| Curtir | o console mostra `Curtiu!` |
| Detalhes | com `titulo` igual a `'Ler'`, a janela "Tarefa: Ler" |

No terceiro, a arrow embrulha a chamada: o `alert` só roda no clique.

---

## :icon[circle-alert] Entregue a função, sem chamar

No E01, o `addEventListener('click', ...)` ligava uma função ao clique. No JSX, a ideia é a mesma: a função é um **callback**, como no E10a. Você entrega a função, e o React a chama quando o clique acontecer.

::::columns
:::col
**Certo:** `onClick={avisar}` entrega a função.
:::
:::col
**Errado:** `onClick={avisar()}` chama a função na hora de desenhar e entrega o resultado (`undefined`).
:::
::::

Com os parênteses, o `alert` aparece assim que a página abre, antes de qualquer clique. Sem eles, só no clique.

---

## O problema: a variável comum não redesenha

Primeira tentativa de um contador, com uma variável `let`, a caixa que deixa trocar o conteúdo:

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

- `contador++` soma 1 ao valor da variável
- A cada clique, o console mostra 1, 2, 3, mas o botão continua em **0**

O React não "vê" variáveis comuns. Ele só redesenha um componente quando alguém avisa, e `contador++` não avisa ninguém.

---

## Estado

Como o estádio inteiro fica sabendo que saiu um gol?

---

## :icon[braces] useState: a memória do componente

**Estado** é um dado que o componente guarda e que, quando muda, faz o React redesenhar a tela. Pense no placar do jogo: quando o número muda, o telão mostra o novo. A variável comum é um papel no bolso: muda, mas ninguém vê.

Você cria um estado com `useState`:

```jsx
import { useState } from 'react'

const [contador, setContador] = useState(0)
```

| Parte | O que é |
|---|---|
| `import { useState } ...` | traz o `useState` do React para o arquivo |
| `contador` | o valor atual: o número do placar |
| `setContador` | a função que troca o valor e pede o redesenho |
| `useState(0)` | o valor inicial, usado só na primeira vez |

---

## :icon[braces] Estado na prática

Três placares, cada um com o seu tipo de valor: número, sim ou não, e texto.

```jsx
// 1. um número: curtidas
const [curtidas, setCurtidas] = useState(0)
<button onClick={() => setCurtidas(curtidas + 1)}>Curtir ({curtidas})</button>

// 2. sim ou não: mostrar os detalhes
const [aberto, setAberto] = useState(false)
<button onClick={() => setAberto(!aberto)}>{aberto ? 'Fechar' : 'Ver detalhes'}</button>

// 3. um texto: o tema da tela
const [tema, setTema] = useState('claro')
<button onClick={() => setTema('escuro')}>Tema: {tema}</button>
```

| Botão | A tela mostra, a cada clique |
|---|---|
| curtidas | Curtir (0), Curtir (1), Curtir (2)... |
| detalhes | Ver detalhes, Fechar, Ver detalhes... |
| tema | Tema: claro, depois Tema: escuro |

---

## :icon[variable] Os colchetes do useState

O `useState` devolve um par: o valor e a função que o troca. Os colchetes são a desestruturação de array do E09b: o primeiro item do par vai para o primeiro nome, o segundo vai para o segundo. Vale a posição, e você escolhe os nomes.

```jsx
const [contador, setContador] = useState(0)
const [nome, setNome] = useState('Ana')
```

- A convenção é `[coisa, setCoisa]`: o nome do dado e, depois, `set` mais o nome
- Cada `useState` cria um estado separado, com o seu valor inicial
- O `useState` fica sempre **dentro** do componente, no começo da função; nunca fora dele nem dentro de um `if`

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

| Linha | O que ela diz |
|---|---|
| `useState(0)` | "o placar começa em 0" |
| `setContador(contador + 1)` | "troque o placar para o valor atual mais 1 e redesenhe" |
| `Cliques: {contador}` | "mostre o número do placar" |

Agora o botão acompanha cada clique. A diferença para a variável comum está toda no `setContador`.

---

## :icon[refresh-cw] O ciclo de um clique

:::center
![Animação: o clique no botão Cliques: 0 chama setContador(contador + 1), que guarda o valor 1 e pede o redesenho; o React chama Contador() de novo e o JSX novo mostra Cliques: 1](images/e23-clique-redesenha.svg)
:::

A cada clique, `setContador` guarda o novo valor e pede o redesenho. O React chama `Contador()` de novo, e o JSX sai com o número atualizado.

---

## :icon[clock] A atualização não é imediata

O `set` não troca a variável na hora. Ele **agenda** o redesenho: o valor novo só existe quando o componente roda de novo.

```jsx
function contar() {
  setContador(contador + 1)
  console.log(contador) // ainda mostra o valor antigo
}
```

Com o placar em 0, o clique mostra `0` no console, e o botão passa a mostrar `Cliques: 1`.

:::tip
Não leia o estado logo depois do `set`. Se precisa do valor novo, use o que você acabou de calcular (`contador + 1`).
:::

---

## :icon[lightbulb] Pratique: estado ou dado fixo?

:::example Desafio
Imagine a tela de um **player de música**: nome da música, botão de tocar/pausar, barra de progresso, controle de volume, botão de curtir e a lista de próximas faixas.

O que nessa tela é **estado** (muda quando você interage) e o que é só dado fixo? Para cada item que muda, qual seria o valor inicial do `useState`?
:::

:::tip Resposta
- **Estado:** tocando ou pausado (`false`), progresso (`0`), volume (`50`, por exemplo) e curtida (`false`)
- **Dado fixo:** o nome da música e a lista de próximas faixas; eles chegam ao componente por props
- Pergunta que ajuda: "isto muda quando eu clico ou arrasto?" Se muda, é estado
:::

---

## Arrays no estado

Dois papéis com o mesmo endereço. Se eu pinto a casa, o que você encontra lá?

---

## :icon[triangle-alert] Estado com arrays: o push não redesenha

Para mudar um array no estado, entregue ao `set` um array **novo**. É a regra do E09b: tire uma cópia e mexa na cópia, sem rasurar o original. Quem usa o `push` cai neste bug:

```jsx
const [tarefas, setTarefas] = useState([])

function adicionar(nova) {
  tarefas.push(nova)   // muda o array por dentro
  setTarefas(tarefas)  // entrega o mesmo array de antes
}
```

O `console.log(tarefas)` mostra a tarefa nova, mas a tela não muda. O `push` **muta** o array: altera o original por dentro, sem criar outro. É o mesmo bug do carrinho que "mudou sozinho" no E09b, só que agora quem guardou a lista antiga é o React.

---

## :icon[arrow-left-right] Arrays no estado na prática

As três receitas da tabela "Atualizar sem mutar" do E09b, agora com o resultado indo para o `set`. Com `tarefas` igual a Ler (id 1) e Correr (id 2), `nova` igual a Dormir e `id` igual a 2:

```jsx
// adicionar: spread
setTarefas([...tarefas, nova])

// remover: filter fica com todas menos a do id
setTarefas(tarefas.filter((t) => t.id !== id))

// alterar: map devolve uma cópia só do item certo
setTarefas(tarefas.map((t) => (t.id === id ? { ...t, concluida: true } : t)))
```

| Receita | Imagem | A lista nova |
|---|---|---|
| spread | a cópia, com um item a mais | Ler, Correr, Dormir |
| `filter` | a peneira | Ler |
| `map` | a linha de produção | Ler, Correr (concluída) |

Os três devolvem um array novo, e `tarefas` continua intacto: Ler, Correr.

---

## :icon[equal-not] O React compara referências

Uma **referência** é o endereço do array: dois papéis com o mesmo endereço levam à mesma casa. Como na prévia do E11b, o React pergunta se o valor novo é **o mesmo** do anterior, com `Object.is`. Para arrays e objetos, ele funciona como o `===`: compara endereços, não conteúdo.

:::center
![Diagrama: com tarefas.push(nova), antes e depois apontam para o mesmo array e o React não redesenha; com o spread, depois aponta para um array novo e o React redesenha](images/e23-push-mesmo-array.svg)
:::

```javascript
Object.is(tarefas, tarefas)             // true: nada mudou, nada redesenha
Object.is(tarefas, [...tarefas, nova])  // false: array novo, a tela redesenha
```

A regra: **sempre entregue um array novo** ao `set`.

:::tip
As regras do `carrinho.js` do `lojinha-regras` já devolvem arrays novos. No E30, `setItens(adicionarItem(itens, produto))` funciona sem mudar uma linha delas.
:::

---

## O filho avisa o pai

A visita quer entrar: ela abre a sua porta ou toca a campainha?

---

## :icon[arrow-up] O App guarda, o cartão avisa

Quem guarda o estado é o dono dos dados: o `App`. O `CartaoTarefa` não muda a lista. Ele recebe do `App`, por prop, uma função, e a chama no clique, como quem toca a campainha: "esta tarefa mudou".

No `App`, as tarefas passam para o estado, e nasce a função que inverte `concluida`:

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

---

## :icon[arrow-up] Avisar o pai na prática

No `minhas-tarefas`, três filhos tocam a campainha do `App`. Cada um chama uma função que recebeu por prop e leva junto o dado que o `App` precisa:

```jsx
// no CartaoTarefa: o botão Concluir
<button onClick={() => onAlternar(id)}>Concluir</button>

// no CartaoTarefa: o botão Remover (laboratório de hoje)
<button onClick={() => onRemover(id)}>Remover</button>

// no FormularioTarefa, ao enviar (aula 46)
onAdicionar(titulo, prioridade)
```

| O filho chama | O `App` faz | A tela mostra |
|---|---|---|
| `onAlternar(1)` | troca `concluida` da tarefa 1 | o cartão de Ler riscado |
| `onRemover(1)` | tira a tarefa 1 da lista | a lista sem Ler |
| `onAdicionar('Dormir', 'baixa')` | põe uma tarefa no fim | Dormir no fim da lista |

---

## :icon[list-ordered] alternarConcluida em português

| Linha | O que ela diz |
|---|---|
| `useState(tarefasIniciais)` | "o estado começa com o array do E22", agora chamado `tarefasIniciais` |
| `tarefas.map(...)` | "monte uma lista nova, tarefa por tarefa" |
| `t.id === id ? ... : t` | "é a tarefa clicada? Faça uma cópia com `concluida` trocada; senão, deixe como está" |
| `!t.concluida` | o contrário do valor: `true` vira `false`, e `false` vira `true` |
| `onAlternar={...}` | "entregue a função à lista". O nome começa com `on`, como `onClick`: é uma função para um evento |

A `ListaTarefas` recebe `onAlternar` e repassa para cada `CartaoTarefa`, junto com o `id` da tarefa:

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

- `onAlternar(id)` precisa de argumento, então vai embrulhada em uma arrow: `() => onAlternar(id)`. Sem a arrow, seria chamada na hora de desenhar
- A arrow é uma closure (E10a), a mochila: cada cartão cria a sua, e ela leva junto o `id` daquele cartão
- O ternário do E13 escolhe o texto do botão: "Reabrir" ou "Concluir"
- O cartão não muda a lista: ele só **avisa** o `App`. As classes dinâmicas do E22 continuam valendo

---

## Mensagens de erro

O React também acende luzes no painel. Você sabe ler cada uma?

---

## :icon[siren] Quando aparece um erro

| O que aparece | Quer dizer | O que fazer |
|---|---|---|
| `useState is not defined` | faltou o `import` | `import { useState } from 'react'` no topo |
| a ação roda ao abrir a página, ou `Too many re-renders` | parênteses no `onClick`: `onClick={contar()}` | `onClick={contar}` ou `() => onAlternar(id)` |
| `onAlternar is not a function` | a função não chegou ao cartão | siga a cadeia `App`, `ListaTarefas`, `CartaoTarefa` |
| a tela não muda, mas o console mostra o valor novo | mutação (`push`, `tarefas[0].concluida = true`) ou variável comum | entregue um array novo ao `set` |

O `console.log` logo depois do `set` mostrar o valor antigo não é erro: o redesenho é agendado.

---

## :icon[list-checks] Resumo

:::summary
- Eventos ligam funções a ações da pessoa: `onClick={funcao}`, sem parênteses
- Variáveis comuns mudam em silêncio; só o estado faz o React redesenhar
- `const [valor, setValor] = useState(inicial)` cria a memória do componente; o `set` agenda o redesenho
- O React compara referências: arrays no estado nunca são mutados; spread adiciona, `filter` remove, `map` altera
- O filho avisa o pai por uma função recebida via prop, como `onAlternar`
:::

---

## :icon[arrow-right] Próximos passos

O botão "Concluir" funciona, mas ainda não dá para **criar** tarefas: falta um campo de texto.

Na aula 46, você vai ligar campos de texto ao estado, tratar o envio de um formulário sem recarregar a página e montar o `FormularioTarefa` que conversa com o `App`.

- :icon[keyboard] inputs controlados
- :icon[check] validação e limpeza do campo
- :icon[layers] estado no componente certo
