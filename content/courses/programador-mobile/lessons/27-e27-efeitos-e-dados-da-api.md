---
title: Efeitos e dados da API
summary: O Livro de Receitas busca as receitas na DummyJSON com useEffect, com carregando e erro, e o Projeto 4 é entregue.
module: react
duration_minutes: 90
objectives:
  - Rodar um efeito depois do primeiro desenho da tela com useEffect e o []
  - Buscar dados com fetch dentro do efeito e guardar o que chegou no estado
  - Mostrar carregando e erro como estados, com try, catch e finally
  - Terminar e entregar o Projeto 4, com README e print
---

# Efeitos e dados da API

Programador Mobile · Encontro E27 · Aula 27 de 45

---

## O que você vai aprender

:::goal
- Rodar um código depois de a tela aparecer, com `useEffect`
- Buscar as receitas numa API com o `fetch` dentro do efeito
- Mostrar "Carregando receitas..." enquanto a resposta não chega
- Avisar a pessoa quando a internet ou a API falha
- Terminar e entregar o Projeto 4
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **desenhar** | o React chama a função do componente e mostra na tela o JSX que ela devolve |
| **efeito** | um código que o React roda depois de desenhar a tela, como buscar dados |
| **`useEffect`** | a função do React que guarda um efeito |
| **hook** | gancho, em inglês: as funções do React que começam com `use` |
| **aba Rede** | a parte do DevTools que lista cada pedido que a página faz |

---

## As receitas de verdade

O Livro de Receitas mostra 8 receitas que moram num arquivo do kit, o `src/data/receitas.js`. Para ter uma receita nova, só mudando o código. Um app de verdade busca os dados na internet, numa **API**, o endereço que entrega dados, do E22: hoje, a DummyJSON.

| As receitas | Hoje | No fim do dia |
|---|---|---|
| de onde vêm | do arquivo do kit | da API, pela internet |
| quantas | 8, em português | 30, em inglês |
| enquanto espera | nada | "Carregando receitas..." |
| sem internet | nada muda | "Não foi possível carregar as receitas." |

:::question
O app deve buscar as receitas antes, durante ou depois de desenhar a tela?
:::

---

## useEffect

O que você faz logo depois de abrir a porta de casa, à noite?

---

## :icon[zap] useEffect: depois de desenhar a tela, faça isto

**Desenhar** é o que o React faz quando chama a função do componente e mostra o JSX dela. Buscar dados demora, e a tela não pode ficar esperando. O **`useEffect`** guarda um **efeito**: uma função que o React roda **depois** de desenhar a tela, como um bilhete "depois de desenhar a tela, faça isto".

```jsx
import { useEffect, useState } from 'react'

function App() {
  useEffect(() => {
    console.log('O App apareceu na tela')
  }, [])

  // ... o resto do App continua igual
}
```

Como o `useState`, ele vem do React e começa com `use`: é um **hook** (gancho, em inglês).

---

## :icon[list-ordered] O useEffect em português

| Parte | O que ela diz |
|---|---|
| `import { useEffect, useState }` | "traga do React o `useEffect`, junto com o `useState` do E26" |
| `useEffect(` | "React, guarde este efeito" |
| `() => { ... }` | **o que** fazer: uma função seta, com o código entre as chaves |
| `, []`, no fim | **quando** fazer: a lista vazia quer dizer "só uma vez, quando o App aparece" |

O `[]` se chama **lista de dependências**. Hoje, ela fica sempre vazia.

---

## :icon[zap] useEffect na prática

Um teste no `App` do Livro de Receitas, para apagar depois: uma linha no corpo da função e um efeito.

```jsx
  const [busca, setBusca] = useState('')
  const [favoritas, setFavoritas] = useState([])

  console.log('Desenhando o App')

  useEffect(() => {
    console.log('O App apareceu na tela')
  }, [])
```

| O que você faz | O Console mostra |
|---|---|
| abre a página (F5) | `Desenhando o App` e, depois, `O App apareceu na tela` |
| digita `piz` na busca | `Desenhando o App` três vezes, uma por letra |
| tira o `[]` e digita `piz` | as duas linhas, três vezes |

O desenho vem primeiro; o efeito, depois.

---

## :icon[list-ordered] O efeito, desenho por desenho

Todo estado que muda faz o React desenhar o `App` de novo, como o placar do E26. E o efeito?

| Momento | O que mudou | Desenha? | O efeito roda? |
|---|---|---|---|
| abrir a página | nada: primeiro desenho | sim | sim, depois do desenho |
| digitar `p` | o estado `busca` | sim | não: com `[]`, já rodou |
| digitar `i` | o estado `busca` | sim | não |
| clicar em Favoritar | o estado `favoritas` | sim | não |

Sem o `[]`, o efeito roda depois de **todo** desenho. Com um pedido à API dentro, a resposta muda o estado, o `App` desenha, e o efeito pede outra vez, sem parar.

---

## :icon[notebook-pen] Exercícios: useEffect

:::example Exercícios
O contador de séries da academia:

```jsx
function Treino() {
  const [series, setSeries] = useState(0)
  console.log('desenhou')

  useEffect(() => {
    console.log('aquecimento')
  }, [])

  return (
    <button onClick={() => setSeries(series + 1)}>
      Séries: {series}
    </button>
  )
}
```

1. A pessoa abre a página. O que o Console mostra, em ordem?
2. Depois, ela clica duas vezes no botão. O que aparece a mais?
3. Escreva um efeito que mostre `Bom treino!` no Console uma vez só, quando a tela aparece
4. Sem o `[]`, o que os mesmos dois cliques mostram a mais?
:::

:::tip Respostas
1. `desenhou` e `aquecimento`: o React desenha primeiro e roda o efeito depois
2. `desenhou` duas vezes: cada clique muda o estado e redesenha; o efeito com `[]` não roda de novo
3. `useEffect(() => { console.log('Bom treino!') }, [])`
4. `desenhou`, `aquecimento`, `desenhou`, `aquecimento`: sem o `[]`, o efeito roda depois de todo desenho
:::

---

## Buscar no efeito

No restaurante, você vai até a cozinha buscar o prato?

---

## :icon[cloud-download] O garçom dentro do efeito

O **`fetch`** é o garçom do E22: leva o pedido à API e traz a resposta, em JSON. A resposta demora, então vem com **`await`**, que espera a senha ser chamada sem travar a fila, como no E21. O `await` só funciona dentro de uma função **`async`**.

A função do efeito não pode ser `async`. Por isso, a função `async` mora **dentro** do efeito e é chamada logo abaixo:

```jsx
useEffect(() => {
  async function carregarReceitas() {
    const resposta = await fetch('https://dummyjson.com/recipes')
    const dados = await resposta.json()
    console.log(dados)
  }
  carregarReceitas()
}, [])
```

---

## :icon[list-ordered] O efeito que busca, em português

| Linha | O que ela diz |
|---|---|
| `async function carregarReceitas() {` | "crie a função que busca; ela é `async` para poder esperar" |
| `await fetch('https://...')` | "garçom, traga as receitas; espere a resposta" |
| `await resposta.json()` | "espere o corpo da resposta virar objeto" |
| `console.log(dados)` | "mostre no Console o que chegou" |
| `carregarReceitas()` | "agora, chame a função": sem esta linha, nada é buscado |

Por que não `useEffect(async () => ...)`? Uma função `async` sempre devolve uma Promise, a senha da lanchonete. E o React quer que o efeito não devolva nada.

---

## :icon[braces] A resposta da DummyJSON

Abra `https://dummyjson.com/recipes` numa aba do navegador: é o JSON que o garçom traz. Depois do `json()`, `dados` é um **objeto**, e a lista fica **dentro** dele, no campo `recipes`:

| O que você quer saber | O caminho | O valor |
|---|---|---|
| a lista de receitas | `dados.recipes` | uma lista com 30 receitas |
| quantas vieram | `dados.recipes.length` | `30` |
| quantas a API tem | `dados.total` | `50` |
| o nome da primeira | `dados.recipes[0].name` | `'Classic Margherita Pizza'` |
| a cozinha dela | `dados.recipes[0].cuisine` | `'Italian'` |

Os campos são os mesmos das receitas do kit (`name`, `image`, `cuisine`...). Só os textos vêm em inglês.

---

## :icon[notebook-pen] Exercícios: Buscar no efeito

:::example Exercícios
O app de frases do dia. No Console, a resposta da DummyJSON é `{quotes: Array(30), total: 1454, skip: 0, limit: 30}`.

```jsx
useEffect(() => {
  ___ function carregarFrases() {
    const resposta = ___ fetch('https://dummyjson.com/quotes')
    const dados = await resposta.json()
    console.log(dados.quotes.length, dados.total)
  }
  ___
}, [])
```

1. Complete as três lacunas
2. Completo, o que o efeito mostra no Console?
3. Escreva a linha que mostra a primeira frase, guardada no campo `quote`
4. Sem o `await` do `json()`, quanto vale `dados.quotes`?
:::

:::tip Respostas
1. `async`, `await` e `carregarFrases()`: o `await` pede uma função `async`, e sem a chamada nada é buscado
2. `30 1454`: vieram 30 frases, de um total de 1454
3. `console.log(dados.quotes[0].quote)`
4. `undefined`: sem o `await`, `dados` guarda a senha, e não o prato
:::

---

## :icon[milestone] Projeto 4 · Passo 1: o efeito que busca

:::steps
1. No `App.jsx`, a primeira linha de `import` passa a trazer os dois: `import { useEffect, useState } from 'react'`
2. Logo depois dos dois `useState`, escreva o efeito abaixo
3. Salve, abra o Console (F12) e aperte F5
:::

```jsx
function App() {
  const [busca, setBusca] = useState('')
  const [favoritas, setFavoritas] = useState([])

  useEffect(() => {
    async function carregarReceitas() {
      const resposta = await fetch('https://dummyjson.com/recipes')
      const dados = await resposta.json()
      console.log(dados)
    }
    carregarReceitas()
  }, [])
```

**Pronto quando:** a tela continua com as 8 receitas, e o Console mostra, uma vez só, `{recipes: Array(30), total: 50, skip: 0, limit: 30}`. Na aba **Rede**, aparece um pedido a `recipes`.

---

## Dados no estado

A resposta chegou no Console. Como ela chega à tela?

---

## :icon[refresh-cw] As receitas no estado

A tela só muda quando um **estado** muda, como o placar do E26. Então o que chegou da API vai para um estado novo, `receitas`:

```jsx
const [receitas, setReceitas] = useState([])
```

```jsx
setReceitas(dados.recipes)
```

- O estado começa com a lista vazia, `[]`: no primeiro desenho, nada chegou ainda
- `setReceitas(dados.recipes)` guarda a lista que está **dentro** de `dados`, e o React desenha de novo
- O nome é `receitas`, o mesmo que o `filter` da busca já usa: o resto do `App` não muda
- O `import { receitas }` do arquivo do kit sai: o `App` não usa mais as receitas locais

---

## :icon[route] Do primeiro desenho às 30 receitas

:::center
![Animação: React desenha o App ainda sem receitas; depois o efeito roda e chama carregarReceitas; com await, a resposta chega e setReceitas guarda as 30; React desenha de novo com 30 cartões, e com [] o efeito não volta a rodar](images/e27-efeito-receitas.svg)
:::

O React desenha primeiro, com a lista vazia. Só **depois** o efeito pede as receitas. Quando a resposta chega, `setReceitas` muda o estado, e o React desenha de novo. Com o `[]`, o efeito não roda nesse segundo desenho: um pedido só.

---

## :icon[notebook-pen] Exercícios: Dados no estado

:::example Exercícios
O app do mercado busca os produtos na DummyJSON:

```jsx
function Mercado() {
  const [produtos, setProdutos] = useState([])
  console.log('produtos:', produtos.length)

  useEffect(() => {
    async function carregar() {
      const resposta = await fetch('https://dummyjson.com/products/category/groceries')
      const dados = await resposta.json()
      setProdutos(dados.products)
    }
    carregar()
  }, [])

  return <p>{produtos.length} produtos</p>
}
```

1. O que a tela mostra no primeiro desenho? E quando chegam os 27 produtos?
2. O que o Console mostra, em ordem?
3. Quantos pedidos aparecem na aba Rede?
4. Com `useState()` no lugar de `useState([])`, o que acontece ao abrir?
:::

:::tip Respostas
1. `0 produtos` e, depois, `27 produtos`: o `setProdutos` muda o estado, e o React desenha de novo
2. `produtos: 0` e `produtos: 27`
3. Um: com o `[]`, o efeito não roda no segundo desenho
4. Tela branca e `Cannot read properties of undefined`: nada chegou ainda, e `undefined` não tem `length`
:::

---

## :icon[milestone] Projeto 4 · Passo 2: as receitas da API na tela

:::steps
1. Apague a linha `import { receitas } from './data/receitas.js'` (o arquivo pode ficar na pasta)
2. Antes dos outros estados, o estado `receitas`, começando com `[]`
3. No efeito, troque o `console.log(dados)` por `setReceitas(dados.recipes)`
:::

```jsx
function App() {
  const [receitas, setReceitas] = useState([])
  const [busca, setBusca] = useState('')
  const [favoritas, setFavoritas] = useState([])

  useEffect(() => {
    async function carregarReceitas() {
      const resposta = await fetch('https://dummyjson.com/recipes')
      const dados = await resposta.json()
      setReceitas(dados.recipes)
    }
    carregarReceitas()
  }, [])
```

**Pronto quando:** aparecem 30 cartões em inglês, como "Classic Margherita Pizza, Italian, 35 minutos"; `pasta` acha 2 receitas e as favoritas funcionam. A API é em inglês: `frango` não acha nada, `chicken` acha.

---

## Carregando

Enquanto o lanche não fica pronto, o que o painel da lanchonete mostra?

---

## :icon[hourglass] Um estado para a espera

Aperte F5 e olhe bem: por um instante, a tela diz "Nenhuma receita por aqui.". É a lista vazia do primeiro desenho, antes de a resposta chegar. Parece que não existe receita nenhuma.

O certo é avisar que está buscando, como o painel da lanchonete mostra "preparando" até a senha ser chamada. Para isso, um estado **`carregando`**, de sim ou não:

```jsx
const [carregando, setCarregando] = useState(true)
```

- Começa `true`: ao abrir, o app já está buscando
- Vira `false` com `setCarregando(false)`, logo depois do `setReceitas`
- Enquanto é `true`, a tela mostra a peça `Carregando` do kit, que não recebe props

---

## :icon[split] O if do conteudo, caminho por caminho

O `if` com `else if` do E10 é a bifurcação: testa de cima para baixo e segue o **primeiro** caminho que dá sim. O carregando entra antes da lista vazia:

```jsx
let conteudo
if (carregando) {
  conteudo = <Carregando />
} else if (visiveis.length === 0) {
  conteudo = <ListaVazia busca={busca} />
} else {
  // a grade com os cartões, como no E26
}
```

| Momento | `carregando` | `visiveis.length` | Na tela |
|---|---|---|---|
| acabou de abrir | `true` | 0 | Carregando receitas... |
| a resposta chegou | `false` | 30 | 30 cartões |
| chegou, busca `xyz` | `false` | 0 | Nenhuma receita encontrada para "xyz". |

---

## :icon[notebook-pen] Exercícios: Carregando

:::example Exercícios
O painel do ponto de ônibus:

```jsx
let painel
if (carregando) {
  painel = <p>Buscando horários...</p>
} else if (horarios.length === 0) {
  painel = <p>Nenhum ônibus agora.</p>
} else {
  painel = <p>{horarios.length} ônibus a caminho</p>
}
```

1. Complete a linha que vem logo depois de guardar os horários: `___(false)`
2. `carregando` é `true`, e `horarios` está vazia. O que aparece?
3. `carregando` é `false`, e chegaram 3 horários?
4. `carregando` é `false`, e a lista veio vazia?
5. O estado começa com `useState(false)`. O que aparece ao abrir, antes da resposta?
:::

:::tip Respostas
1. `setCarregando`: a resposta chegou, a espera acabou
2. `Buscando horários...`: vale o primeiro caminho que dá sim
3. `3 ônibus a caminho`: os dois testes dão não, e vale o `else`
4. `Nenhum ônibus agora.`
5. `Nenhum ônibus agora.`, até a resposta chegar: o primeiro teste dá não, e a lista ainda vazia dá sim
:::

---

## :icon[milestone] Projeto 4 · Passo 3: o aviso de carregando

:::steps
1. No topo, com os outros, `import Carregando from './components/Carregando.jsx'`
2. Logo abaixo do estado `receitas`, o estado `carregando`, começando `true`
3. No efeito, `setCarregando(false)` logo depois do `setReceitas`
4. No `if` do `conteudo`, o caminho do carregando primeiro; o da lista vazia vira `else if`
:::

```jsx
  const [receitas, setReceitas] = useState([])
  const [carregando, setCarregando] = useState(true)
```

```jsx
      const dados = await resposta.json()
      setReceitas(dados.recipes)
      setCarregando(false)
```

**Pronto quando:** ao abrir, aparece "Carregando receitas..." com o círculo girando e, depois, os 30 cartões. Para ver com calma: na aba **Rede**, troque **Sem limitação** por **3G** e aperte F5. A página inteira fica lenta: espere uns 15 segundos. Depois, volte para **Sem limitação**.

---

## Quando a API falha

O garçom volta da cozinha sem o prato. O que ele precisa dizer à mesa?

---

## :icon[wifi] Rede ou resposta: as duas falhas

Desligue o Wi-Fi e aperte F5. A página abre, porque vem do seu computador, mas fica presa em "Carregando receitas...": o `fetch` falhou, o código **parou** ali, e o `setCarregando(false)` nunca rodou.

| Situação | O que o `fetch` faz | Como perceber |
|---|---|---|
| sem internet | falha: `TypeError: Failed to fetch` | cai no `catch` |
| receita que não existe | responde 404 | `resposta.ok` é `false` |
| tudo certo | responde 200 | `resposta.ok` é `true` |

O `try`/`catch`/`finally` do E20 é a rede de proteção do trapezista: o `catch` pega a falha, e o `finally` roda **sempre**. O 404 não cai no `catch` sozinho: confira o `ok` e lance um erro, como no E22.

---

## :icon[wifi] Falhas na prática

A rede de proteção numa função que busca uma receita pelo `id`, testada no Console do navegador:

```javascript
async function verReceita(id) {
  try {
    const resposta = await fetch('https://dummyjson.com/recipes/' + id)
    if (!resposta.ok) {
      throw new Error('A API respondeu ' + resposta.status)
    }
    const receita = await resposta.json()
    console.log(receita.name)
  } catch (falha) {
    console.log('Falhou:', falha.message)
  } finally {
    console.log('Pedido encerrado')
  }
}
```

| Chamada | O Console mostra |
|---|---|
| `verReceita(1)` | `Classic Margherita Pizza` e `Pedido encerrado` |
| `verReceita(9999)` | `Falhou: A API respondeu 404` e `Pedido encerrado` |
| `verReceita(1)`, sem internet | `Falhou: Failed to fetch` e `Pedido encerrado` |

O `resposta.status` é o número da resposta (200, 404), e o `falha.message`, o texto do erro. Sem o `if` do `ok`, o 9999 mostraria `undefined`. Computador sem Wi-Fi para desligar? Um endereço que não existe, como `https://dummyjson.invalid/recipes`, falha igual à falta de internet.

---

## :icon[notebook-pen] Exercícios: Quando a API falha

:::example Exercícios
1. Sem internet, o `fetch` cai no `catch`? E quando a API responde 404?
2. Complete: `if (___) { throw new Error('A API respondeu ' + resposta.status) }`
3. O que este código mostra?

   ```javascript
   function conferir(resposta) {
     if (!resposta.ok) {
       throw new Error('A API respondeu ' + resposta.status)
     }
     console.log('Chegou:', resposta.status)
   }
   try {
     conferir({ ok: true, status: 200 })
     conferir({ ok: false, status: 500 })
     conferir({ ok: true, status: 200 })
   } catch (falha) {
     console.log('Falhou:', falha.message)
   } finally {
     console.log('Pedido encerrado')
   }
   ```

4. Sem o `finally`, com o `console.log('Pedido encerrado')` no fim do `try`, o que muda?
:::

:::tip Respostas
1. Sem internet, sim. Com 404, não: chegou uma resposta, com `ok` falso
2. `!resposta.ok`, "não deu certo?"
3. `Chegou: 200`, `Falhou: A API respondeu 500` e `Pedido encerrado`: o `throw` pula para o `catch`, e a terceira chamada não roda
4. `Pedido encerrado` some: o `throw` pulou o resto do `try`
:::

---

## :icon[milestone] Projeto 4 · Sua vez 1: quando a API falha

Sem internet, a tela fica presa no carregando. Faça o app avisar:

1. um estado `erro`, que começa `false`
2. o `try`/`catch`/`finally` no `carregarReceitas`: o `catch` liga o `erro`; o `finally` desliga o `carregando`
3. o `ok` conferido, para o 404 cair no `catch`
4. depois do carregando, o caminho do erro: a `MensagemErro`, com "Não foi possível carregar as receitas."

:::tip Dicas
- No `catch`, use o nome `falha` e `console.log(falha)`: `erro` já é o estado
- Para testar o `ok`, use por um instante o endereço `https://dummyjson.com/recipes/9999`
:::

**Pronto quando:** sem internet ou com o `/recipes/9999`, F5 mostra "Não foi possível carregar as receitas.", sem tela branca; com a internet de volta, os 30 cartões.

---

## :icon[milestone] Projeto 4 · Sua vez 2: README e entrega

O `README.md` do kit tem três trechos marcados com "Etapa 4". Troque cada um pelo seu texto:

1. o que o app mostra, o que a pessoa faz nele e de onde vêm as receitas
2. o print do app em `docs/tela.png` e a linha que o mostra, que o trecho traz
3. o seu nome e o link do seu GitHub

:::tip Dicas
- Print: <kbd>Win</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd>, a área, o aviso e <kbd>Ctrl</kbd> + <kbd>S</kbd>
- <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>V</kbd> mostra o README como no GitHub
:::

**Pronto quando:** a pré-visualização mostra o seu texto, o print e o seu nome. A parte "O kit" pode ficar.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `receitas.filter is not a function` | guardou o objeto inteiro: `setReceitas(dados)` | `setReceitas(dados.recipes)` |
| `useEffect is not defined` | faltou importar | `useEffect` no `import` |
| a aba Rede enche de pedidos | o efeito sem o `[]` | `}, [])` no fim |
| `useEffect must not return anything` | `useEffect(async () => ...)` | a `async` dentro do efeito |
| "Carregando receitas..." para sempre | `setCarregando(false)` fora do `finally` | no `finally` |
| `Cannot read properties of undefined` | o 404 virou `dados` sem `recipes` | conferir o `ok` |

As mensagens em inglês aparecem no Console (F12).

---

## :icon[milestone] Projeto 4 · Etapa 4 pronta

É a última etapa. Antes de entregar, confira no `npm run dev`:

- :icon[check] "Carregando receitas..." e depois 30 cartões; `chicken` mostra 5
- :icon[heart] duas favoritas mostram "2 favoritas"; a marca sobrevive à busca
- :icon[wifi] sem internet, "Não foi possível carregar as receitas."
- :icon[file-text] o README com o print; o Console sem mensagem vermelha

```bash
git add .
git commit -m "Projeto 4: etapa 4, receitas da API e README"
git push
```

No GitHub, confira o print no README. Na plataforma, na página do Projeto 4, cole o link do repositório. **Prazo: início do E29.** Faltou o README? Termine em casa, com outro commit e `git push`.

---

## Resumo

:::summary
- `useEffect(() => { ... }, [])` roda o efeito depois do primeiro desenho da tela; o `[]` faz rodar uma vez só
- A função do efeito não é `async`: a `async function carregarReceitas` mora dentro dele e é chamada logo abaixo
- O que chega da API vai para o estado com `setReceitas(dados.recipes)`, e o React desenha de novo
- `carregando` começa `true` e vira `false` quando a resposta chega; no `if` do `conteudo`, ele vem primeiro
- Sem internet, o `fetch` falha; com 404, ele responde com `ok` falso. O `try`/`catch`/`finally` e o `ok` cuidam das duas falhas
:::

---

## :icon[arrow-right] Próximos passos

No E28, a **revisão de React** e a **Prova 2**, do E24 ao E27:

- :icon[component] componentes, JSX e props
- :icon[list] listas com `map` e `key`
- :icon[refresh-cw] estado, eventos e o campo controlado
- :icon[zap] o efeito que busca, com carregando e erro

Traga o Livro de Receitas funcionando. A entrega do Projeto 4 vai até o início do E29.
