---
title: Hooks próprios
summary: "Tire a lógica do App para hooks seus: regras dos hooks, useDebounce na busca e useTarefas com a API."
module: react
duration_minutes: 40
objectives:
  - Explicar o que é um hook próprio e seguir as regras dos hooks
  - Criar o hook useDebounce a partir do debounce do E10a e ligá-lo a uma busca
  - Criar o hook useTarefas, que busca as tarefas e devolve carregando, erro e recarregar
---

# Hooks próprios

Programador Mobile · Encontro E24 · Aula 48 de 89

---

## O que você vai aprender

:::goal
- Reconhecer um hook e criar o seu primeiro, `useTituloDaAba`
- Seguir as três regras dos hooks e entender por que elas existem
- Transformar o `debounce` do E10a no hook `useDebounce` e ligá-lo a uma busca
- Levar a busca de tarefas para o hook `useTarefas`, com carregando, erro e recarregar
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **hook** | "gancho", em inglês: uma função do React com nome começando por `use`, como `useState` e `useEffect` |
| **hook próprio** | um hook escrito por você, que usa outros hooks por dentro |
| **regras dos hooks** | três combinados que todo hook segue, para o React não se perder |
| **debounce** | esperar a pessoa parar de digitar antes de agir |
| **lint** | o corretor ortográfico do código: o `npm run lint` aponta erros antes de rodar |

---

## O App faz tudo

Depois da aula 47, o `App.jsx` faz tudo: três estados, dois efeitos, o `AbortController`, as três funções do E23 e o JSX. São mais de 70 linhas.

E o próximo pedido já chegou: **buscar uma tarefa pelo título**, no servidor. Cada letra digitada seria uma requisição, e mais estados se misturariam ao desenho.

:::question
Que partes do `App` falam de **tarefas** e que partes falam de **desenhar a tela**? Dá para separar as duas?
:::

---

## Hooks próprios

Quando uma receita dá certo, como você faz para repetir?

---

## :icon[blocks] Seu primeiro hook

Um **hook** é uma função do React que começa com `use` e guarda algo do componente entre uma renderização e outra: `useState` guarda valores, `useEffect` guarda efeitos. Um **hook próprio** é uma receita sua, com nome começando por `use`, que leva outros hooks como ingredientes.

O primeiro tira do `App` o efeito do título da aba:

```javascript
// src/hooks/useTituloDaAba.js
import { useEffect } from 'react'

export function useTituloDaAba(titulo) {
  useEffect(() => {
    document.title = titulo
  }, [titulo])
}
```

```jsx
// no App, no lugar do efeito do título
useTituloDaAba(`(${pendentes}) Minhas Tarefas`)
```

Hook não tem JSX: arquivo `.js` em `src/hooks/`, com export nomeado, como os módulos do E11a.

---

## :icon[blocks] Hooks próprios na prática

A mesma receita serve em vários lugares. Um segundo hook, `useAlternar`, liga e desliga como um interruptor:

```javascript
// src/hooks/useAlternar.js
import { useState } from 'react'

export function useAlternar(inicial = false) {
  const [ligado, setLigado] = useState(inicial)
  function alternar() { setLigado(!ligado) }
  return [ligado, alternar]
}
```

```jsx
useTituloDaAba('(2) Minhas Tarefas')     // na tela de tarefas
useTituloDaAba('Carrinho: 3 itens')      // na tela do carrinho

const [aberto, alternarAberto] = useAlternar()
<button onClick={alternarAberto}>{aberto ? 'Fechar' : 'Ver detalhes'}</button>
```

| Chamada | O que você vê |
|---|---|
| `useTituloDaAba`, na tela de tarefas | a aba mostra "(2) Minhas Tarefas" |
| `useTituloDaAba`, na tela do carrinho | a aba mostra "Carrinho: 3 itens" |
| `useAlternar()`, a cada clique | Ver detalhes, Fechar, Ver detalhes... |

---

## :icon[file-code] O primeiro hook em português

| Parte | O que ela diz |
|---|---|
| `export function useTituloDaAba(titulo)` | "este hook recebe um título e fica na vitrine do módulo" |
| `useEffect(...)` | o mesmo efeito do título da aula 47, agora dentro do hook |
| `[titulo]` | "rode de novo quando o título mudar" |
| `useTituloDaAba(...)` no `App` | uma linha no lugar do efeito inteiro |

O export é nomeado, então o `import` vai **com chaves**:

```jsx
import { useTituloDaAba } from './hooks/useTituloDaAba.js'
```

A tela continua igual: mudou só o lugar onde o código mora.

---

## Regras dos hooks

Numa prateleira de potes sem rótulo, como você acha o açúcar?

---

## :icon[list-checks] As regras dos hooks

As **regras dos hooks** valem para todo hook, do React ou seu:

1. **Só no topo** do componente ou de outro hook: nunca dentro de `if`, de `for`, de uma função de evento nem depois de um `return` antecipado
2. **Só em componentes ou em hooks**: uma função comum, como `carregarTarefas`, não chama `useState`
3. **O nome começa com `use`**: é assim que você, o React e o lint reconhecem um hook

```jsx
function enviar(event) {
  event.preventDefault()
  const atrasada = useDebounce(titulo) // errado: hook numa função de evento
}
```

O `npm run lint` do projeto Vite já traz a regra `rules-of-hooks` e aponta a linha: `React Hook "useDebounce" is called in function "enviar"`.

---

## :icon[list-checks] As regras na prática

Uma quebra para cada regra, e o que o `npm run lint` responde:

```jsx
// regra 1: o hook dentro de um if
if (pendentes > 0) useTituloDaAba('Há pendentes')

// regra 2: o hook numa função comum
async function carregarTarefas() {
  const [tarefas, setTarefas] = useState([])
}

// regra 3: um hook sem "use" no nome
function tituloDaAba(titulo) {
  useEffect(() => { document.title = titulo }, [titulo])
}
```

| Regra | O lint diz | Conserto |
|---|---|---|
| 1 | `React Hook "useTituloDaAba" is called conditionally` | chame sempre e escolha o valor: `useTituloDaAba(pendentes > 0 ? 'Há pendentes' : 'Tudo feito')` |
| 2 | `React Hook "useState" is called in function "carregarTarefas"` | o estado fica no componente ou no hook; a função comum só busca |
| 3 | `React Hook "useEffect" is called in function "tituloDaAba"` | dê o nome certo: `useTituloDaAba` |

---

## :icon[list-ordered] React conta os hooks pela ordem

O React não sabe o nome dos seus estados. Ele guarda os valores como potes sem rótulo numa prateleira e entrega **na ordem das chamadas**: o primeiro `useState` pega o primeiro pote, o segundo pega o segundo. Se um hook pula a vez, cada um pega o pote errado: sal no lugar do açúcar.

```jsx
function Painel({ carregando }) {
  if (carregando) return <p>Carregando...</p> // return antes do hook
  const [aberto] = useState(false)
  return <p>{aberto ? 'Aberto' : 'Fechado'}</p>
}
```

| Renderização | `carregando` | Hooks chamados |
|---|---|---|
| 1ª | `true` | nenhum |
| 2ª | `false` | um `useState` |

Na segunda, aparece um hook que não existia, e o React para com `Rendered more hooks than during the previous render`. Correção: todos os hooks no topo, os `return` depois deles.

---

## :icon[lightbulb] Pratique: certo ou errado?

:::example Desafio
Quais destas linhas, dentro do componente `App`, quebram as regras dos hooks?

```jsx
// A
const buscaAtrasada = useDebounce(busca, 300)
// B
if (busca !== '') useTituloDaAba('Buscando...')
// C
function limpar() { setBusca('') }
// D
<button onClick={() => useTarefas()}>Recarregar</button>
```
:::

:::tip Resposta
- **A** está certa: no topo do componente
- **B** quebra a regra 1: o hook entra em algumas renderizações e em outras não. Chame sempre e decida o valor: `useTituloDaAba(busca !== '' ? 'Buscando...' : 'Minhas Tarefas')`
- **C** está certa: `setBusca` não é hook, é a função que o `useState` devolveu
- **D** quebra a regra 1: o hook rodaria no clique, não na renderização
:::

---

## useDebounce

Por que a porta do elevador espera um pouco antes de fechar?

---

## :icon[timer] useDebounce: o debounce do E10a vira hook

O **debounce** espera a pessoa parar antes de agir, como o elevador que só fecha a porta quando ninguém entra por alguns segundos: cada pessoa que chega reinicia a espera.

No E10a, `debounce(fn, 300)` guardava o `temporizador` numa closure. Dentro de um componente, essa closure nasceria de novo a cada renderização, com o temporizador vazio. O hook guarda o valor atrasado no estado e cancela pela limpeza do efeito:

```javascript
// src/hooks/useDebounce.js
import { useEffect, useState } from 'react'

export function useDebounce(valor, espera = 300) {
  const [atrasado, setAtrasado] = useState(valor)

  useEffect(() => {
    const temporizador = setTimeout(() => setAtrasado(valor), espera)
    return () => clearTimeout(temporizador)
  }, [valor, espera])

  return atrasado
}
```

---

## :icon[timer] useDebounce na prática

```jsx
const buscaAtrasada = useDebounce(busca, 300)   // a busca de tarefas
const rascunhoAtrasado = useDebounce(texto, 1000) // um rascunho, salvo 1 s depois
```

| A pessoa | `busca` muda para | `buscaAtrasada` muda para |
|---|---|---|
| digita "qui" depressa, uma letra a cada 100 ms | q, qu, qui | só "qui", 300 ms depois da última letra |
| digita "qui" devagar, uma letra a cada 500 ms | q, qu, qui | q, qu e qui, cada uma 300 ms depois da sua letra |
| escreve um bilhete e para | o texto, a cada letra | `rascunhoAtrasado`: o texto todo, 1 segundo depois da pausa |

O elevador só fecha a porta quando ninguém chega: quem digita depressa gera uma mudança só.

---

## :icon[list-ordered] useDebounce em português

| Linha | O que ela diz |
|---|---|
| `espera = 300` | "se ninguém disser o tempo, espere 300 ms": valor padrão, como nas props do E22 |
| `useState(valor)` | "a cópia atrasada começa igual ao valor" |
| `setTimeout(() => setAtrasado(valor), espera)` | "daqui a `espera` ms, copie o valor" |
| `return () => clearTimeout(temporizador)` | a limpeza: "cancele o agendamento, se ele ainda não rodou" |
| `[valor, espera]` | "rode de novo quando o valor ou o tempo mudar" |
| `return atrasado` | "entregue a cópia atrasada a quem chamou" |

Recebe um valor que muda a cada letra e devolve uma cópia que só muda depois de `espera` ms sem mudanças.

---

## :icon[history] Cada letra, uma limpeza

A pessoa digita "qui" depressa. A cada letra, `busca` muda, o `App` renderiza e o efeito do hook roda de novo. Antes, o React chama a limpeza da renderização anterior, que lembra o **seu** `temporizador`:

| `busca` | Primeiro, a limpeza | Depois, o efeito |
|---|---|---|
| "q" | cancela o agendamento inicial | agenda "q" para 300 ms |
| "qu" | cancela "q" | agenda "qu" |
| "qui" | cancela "qu" | agenda "qui" |
| pausa de 300 ms | nada | `atrasado` vira "qui" |

Cada renderização cria as suas funções, e cada uma lembra as variáveis daquela renderização: é a closure do E10a, a mochila, agora dentro do React.

---

## :icon[search] O campo de busca

No `App`, a busca é um input controlado, como os do E23:

```jsx
const [busca, setBusca] = useState('')
const buscaAtrasada = useDebounce(busca, 300)
```

```jsx
<input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar tarefa" />
{busca !== buscaAtrasada && <p>Buscando...</p>}
```

- O campo fica ligado a `busca`: cada letra aparece na hora
- A busca no servidor vai usar `buscaAtrasada`: só muda depois da pausa
- Enquanto as duas são diferentes, a pessoa ainda está digitando: "Buscando..."

Quem recebe a `buscaAtrasada` é o `useTarefas`, o hook das tarefas.

---

## useTarefas

Se um hook cuidasse das tarefas, o que o App ainda precisaria dele?

---

## :icon[variable] useTarefas (1): o que entra e o que sai

O **`useTarefas`** é o hook próprio que junta tudo o que fala de tarefas: os estados, o efeito que busca e as ações. Ele recebe a busca e devolve o que a tela precisa:

```javascript
// src/hooks/useTarefas.js
import { useEffect, useState } from 'react'
import { carregarTarefas } from '../api/tarefas.js'

export function useTarefas(busca = '') {
  const [tarefas, setTarefas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [tentativa, setTentativa] = useState(0) // conta os "Tentar de novo"
  // o efeito, recarregar e as funções do E23
  return { tarefas, carregando, erro, recarregar,
    adicionarTarefa, alternarConcluida, removerTarefa }
}
```

- Entra a busca (sem busca, `''`); sai tudo o que a tela precisa para desenhar e para agir
- `tarefas`, `carregando` e `erro` são os estados da aula 47, agora fora do `App`

---

## :icon[variable] useTarefas na prática

```jsx
const { tarefas, carregando, erro } = useTarefas('qui')
```

| Momento | `carregando` | `erro` | `tarefas` |
|---|---|---|---|
| logo depois de montar | `true` | `null` | `[]` |
| a resposta chegou | `false` | `null` | 10 tarefas com "qui", como "quis ut nam facilis et officia qui" |
| sem internet | `false` | `'Não foi possível carregar as tarefas.'` | `[]` |

- Com `useTarefas()`, sem busca, chegam as 10 primeiras tarefas
- Depois de `recarregar()`, o `carregando` volta a `true` e o efeito busca de novo
- O `App` só lê esses três valores e escolhe o que desenhar

---

## :icon[plug] carregarTarefas vai para src/api/

Como no `lojinha-regras` do E19, o `fetch` mora em `src/api/`. A função ganha a busca, que a JSONPlaceholder filtra com `q`:

```javascript
// src/api/tarefas.js
const URL_API = 'https://jsonplaceholder.typicode.com/todos'

export async function carregarTarefas(busca, sinal) {
  const endereco = `${URL_API}?_limit=10&q=${encodeURIComponent(busca.trim())}`
  const resposta = await fetch(endereco, { signal: sinal })
  if (!resposta.ok) throw new Error('A API respondeu ' + resposta.status)
  const dados = await resposta.json()
  return dados.map((item) => ({
    id: item.id, titulo: item.title, concluida: item.completed, prioridade: 'media',
  }))
}
```

- O endereço junta os pedidos: `?` começa a lista, e `&` acrescenta mais um (`_limit=10` e `q=`)
- `encodeURIComponent` protege espaços e acentos, como no `pesquisar` do E19
- Busca vazia (`q=`) traz as 10 primeiras; os títulos são em latim: busque "qui" ou "dolor"

---

## :icon[cloud-download] useTarefas (2): o efeito

```javascript
  useEffect(() => {
    const controle = new AbortController()
    async function buscar() {
      try {
        setTarefas(await carregarTarefas(busca, controle.signal))
        setErro(null)
      } catch (e) {
        if (e.name !== 'AbortError') setErro('Não foi possível carregar as tarefas.')
      } finally {
        if (!controle.signal.aborted) setCarregando(false)
      }
    }
    buscar()
    return () => controle.abort()
  }, [busca, tentativa])
```

- É o efeito da aula 47, com a busca e a tentativa nas dependências
- O efeito roda ao montar, a cada busca nova e a cada "Tentar de novo"
- A limpeza cancela o pedido da busca anterior. O `useDebounce` corta os pedidos; o `abort` garante que uma resposta velha nunca cubra a nova: a dupla do E19

---

## :icon[rotate-cw] useTarefas (3): recarregar e as funções do E23

```javascript
  function recarregar() {
    setCarregando(true)
    setErro(null)
    setTentativa(tentativa + 1) // muda a dependência: o efeito roda de novo
  }
```

- `tentativa` não aparece na tela: existe só para estar nas dependências
- `recarregar` liga o "Carregando..." no clique; numa busca nova, a lista antiga fica na tela até a resposta chegar

`adicionarTarefa`, `alternarConcluida` e `removerTarefa` saem do `App` e entram no hook **sem mudar uma linha**: o `setTarefas` que elas usam agora é o do hook.

:::info API de testes
A JSONPlaceholder não guarda o que você adiciona: uma busca nova traz só o que está no servidor. Num servidor de verdade, `adicionarTarefa` faria antes um POST, como no E19.
:::

---

## :icon[layout-list] O App só desenha

```jsx
function App() {
  const [busca, setBusca] = useState('')
  const buscaAtrasada = useDebounce(busca, 300)
  const { tarefas, carregando, erro, recarregar,
    adicionarTarefa, alternarConcluida, removerTarefa } = useTarefas(buscaAtrasada)
  const pendentes = tarefas.filter((t) => !t.concluida).length
  useTituloDaAba(`(${pendentes}) Minhas Tarefas`)
  return (
    <>
      {/* Cabecalho, FormularioTarefa e o campo de busca, como antes */}
      {erro && <p className="erro">{erro} <button onClick={recarregar}>Tentar de novo</button></p>}
      {carregando ? <p>Carregando...</p> : <ListaTarefas /* props do E23 */ />}
    </>
  )
}
```

- As chaves em `const { tarefas, ... } = useTarefas(...)` são a desestruturação de objeto do E09b: pegam pelo nome o que o hook devolveu
- Os hooks vêm no topo e em cadeia: o valor que um devolve é a entrada do outro

O `App` passou de mais de 70 para menos de 40 linhas.

---

## Lógica, não dados

Duas casas fazem a mesma receita de bolo. Comer um bolo diminui o outro?

---

## :icon[users] Um hook divide a lógica, não os dados

Um hook é uma receita. A mesma receita feita em duas cozinhas dá dois bolos: comer um não diminui o outro. Cada componente que chama `useTarefas()` ganha estados **próprios** e faz a sua busca:

```jsx
function Resumo() {
  const { tarefas } = useTarefas() // outra lista, outra requisição
  return <p>{tarefas.length} tarefas</p>
}
```

Concluir uma tarefa no `App` não muda o `Resumo`: são duas listas que não se enxergam. Para dividir a mesma lista, ela continua num lugar só, o `App`, e desce por props, como no E23.

:::tip Prévia
No E42, a equipe cria hooks para a API do app (cada tela chama o seu) e usa um **contexto** para os dados que várias telas dividem.
:::

---

## :icon[users] Lógica ou dados na prática

Dois jeitos de mostrar o total de tarefas num `Resumo`:

```jsx
// jeito 1: o Resumo chama o hook de novo
function Resumo() {
  const { tarefas } = useTarefas()
  return <p>{tarefas.length} tarefas</p>
}

// jeito 2: o App chama o hook uma vez e passa a lista por prop
function Resumo({ tarefas }) {
  return <p>{tarefas.length} tarefas</p>
}
<Resumo tarefas={tarefas} />
```

| A pessoa adiciona uma tarefa no `App` | O `Resumo` mostra | Aba Rede |
|---|---|---|
| jeito 1 | 10 tarefas: não muda, é outra lista | uma requisição a mais |
| jeito 2 | 11 tarefas: é a mesma lista | nada a mais |

---

## Mensagens de erro

O lint acende a luz antes de o app rodar. Você sabe ler o aviso?

---

## :icon[siren] Quando aparece um erro

| O que aparece | Quer dizer | O que fazer |
|---|---|---|
| `Rendered more hooks than during the previous render` | hook depois de um `return` | todos os hooks no topo |
| lint: `React Hook "..." is called conditionally` | hook dentro de `if` ou de um evento | chame sempre, no topo |
| `does not provide an export named 'default'` | faltaram as chaves no `import` | `import { useTarefas } ...` |
| uma requisição por letra | `useTarefas(busca)` | `useTarefas(buscaAtrasada)` |
| todas as letras disparam, atrasadas | `useDebounce` sem limpeza | `return () => clearTimeout(temporizador)` |
| "Tentar de novo" não busca | `tentativa` fora do array | `[busca, tentativa]` |

---

## Resumo

:::summary
- Hook próprio é uma função sua, com nome começando por `use`, que chama outros hooks e tira lógica da tela
- Regras: só no topo, só em componentes ou hooks, nome com `use`; o React conta os hooks pela ordem
- `useDebounce` devolve um valor que só muda depois da pausa; a limpeza cancela o agendamento anterior
- `useTarefas(busca)` busca, guarda `carregando` e `erro` e devolve `recarregar` e as ações; o `App` só desenha
- Cada chamada de um hook tem estados próprios: o hook divide a lógica, não os dados
:::

Próximo encontro: o E25 revisa o ambiente React e aplica a **Prova 2**, do E21 ao E25.

---

## :icon[flask-conical] No laboratório

:::steps
1. `carregarTarefas` e o efeito no `App`, com `carregando`, `erro` e a limpeza com `AbortController`
2. Na aba Rede, confira: duas requisições no `npm run dev`, a primeira cancelada
3. `src/hooks/useTituloDaAba.js`: a aba mostra as pendentes
4. `src/api/tarefas.js` com a busca, e `src/hooks/useTarefas.js` com `recarregar` e as funções do E23
5. `src/hooks/useDebounce.js` e o campo de busca no `App`, com "Buscando..."
6. `npm run lint` sem erros, commit "E24: efeitos e hooks próprios" e `git push`
:::

**Critérios de entrega**: 10 tarefas da API ao abrir; "Carregando..." antes delas; sem rede, a mensagem e o "Tentar de novo" funcionando; digitar "qui" depressa gera uma requisição só; adicionar, concluir e remover funcionando. Entregue o link do repositório no sistema.

---

## :icon[milestone] Projeto 4 · Etapa 4: API e hooks próprios

No seu repositório `livro-de-receitas`:

- `buscarReceitas(busca, sinal)` e `traduzirReceita` em `src/api/receitas.js`, na DummyJSON (`/recipes/search?q=`)
- `useReceitas(busca)`: "Carregando receitas...", erro com "Tentar de novo" e busca sem resultado
- `useDebounce` entre o campo e o `useReceitas`: uma requisição por pausa
- `useFavoritos`: as favoritas no `localStorage`, ainda lá depois do F5

Commit: `Projeto 4: etapa 4, API, hooks próprios e favoritas salvas`. Enunciado completo e entrega: página do curso, em **Projetos**.
