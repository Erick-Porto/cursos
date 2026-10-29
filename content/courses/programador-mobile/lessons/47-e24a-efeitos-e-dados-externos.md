---
title: Efeitos e dados externos
summary: Buscar tarefas de uma API com useEffect, com carregando, erro e a limpeza que cancela o pedido.
module: react
duration_minutes: 40
objectives:
  - Executar código depois da renderização com useEffect e escolher as dependências
  - Buscar tarefas de uma API dentro de um efeito, com estados de carregamento e erro
  - Escrever a limpeza de um efeito e cancelar o pedido com AbortController
---

# Efeitos e dados externos

Programador Mobile · Encontro E24 · Aula 47 de 89

---

## O que você vai aprender

:::goal
- Executar código depois de a tela aparecer, com `useEffect`
- Escolher o array de dependências: quando o efeito roda de novo
- Buscar as tarefas de uma API com o `fetch` do E19, mostrando "Carregando..." e erro
- Escrever a limpeza do efeito e cancelar o pedido com `AbortController`
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **renderizar** | desenhar a tela: o React chama a função do componente e mostra o JSX que ela devolve |
| **montar** | a primeira renderização: o componente aparece na tela |
| **efeito** | um código que roda depois que a tela foi desenhada, como buscar dados |
| **dependências** | a lista de valores que, quando mudam, fazem o efeito rodar de novo |
| **limpeza** | a função que desfaz o que o efeito fez |

---

## As tarefas somem ao recarregar

Abra o `minhas-tarefas`, adicione três tarefas e aperte F5.

Tudo volta ao começo: o array `tarefasIniciais` vive só na memória do navegador e morre com a página.

Na vida real, as tarefas ficam em um **servidor**, um computador na internet que guarda os dados. O app as busca pela rede quando abre, como o `lojinha-regras` buscou produtos na DummyJSON no E19.

:::question
Onde, dentro do componente `App`, você colocaria o código que busca as tarefas? E quantas vezes ele deveria rodar?
:::

---

## :icon[play] Quando o componente nasce

**Renderizar** é desenhar a tela: o React chama a função do componente e mostra o JSX que ela devolve. A primeira vez se chama **montar**: é a peça de Lego sendo encaixada na tela. Depois, cada `set` renderiza de novo.

Buscar dados direto no corpo da função parece natural, mas cria um laço:

:::steps
1. O React executa `App()` e desenha a tela
2. A busca dispara; quando a resposta chega, você chama `setTarefas`
3. `setTarefas` faz o React executar `App()` de novo
4. A busca dispara de novo, e volta ao passo 2
:::

Resultado: requisições sem fim. O corpo da função é lugar de **descrever a tela**, não de buscar dados.

---

## useEffect

O que você faz logo depois de abrir a porta de casa, à noite?

---

## useEffect: código que roda depois de renderizar

O **useEffect** registra um **efeito**: uma função que o React executa depois de desenhar a tela. É o bilhete "depois de desenhar a tela, faça isto": buscar dados, ligar um relógio. Como o `useState`, ele é um **hook** (gancho, em inglês): uma função do React com nome começando por `use`.

```jsx
import { useState, useEffect } from 'react'

function App() {
  const [tarefas, setTarefas] = useState([])

  useEffect(() => {
    console.log('App apareceu na tela')
  }, [])

  return <ListaTarefas tarefas={tarefas} />
}
```

Anatomia: `useEffect(função, dependências)`. O primeiro argumento é **o que** fazer; o segundo, um array que diz **quando** fazer.

---

## :icon[zap] useEffect na prática

Três bilhetes "depois de desenhar a tela, faça isto", todos com `[]`: uma vez, quando o `App` aparece.

```jsx
// 1. avisar no console
useEffect(() => {
  console.log('App apareceu na tela')
}, [])

// 2. trocar o texto da aba do navegador
useEffect(() => {
  document.title = 'Minhas Tarefas'
}, [])

// 3. guardar um recado no navegador, com o localStorage do Projeto 3
useEffect(() => {
  localStorage.setItem('minhas-tarefas:visitou', 'sim')
}, [])
```

| Bilhete | O que você vê depois que a tela aparece |
|---|---|
| 1 | o console mostra `App apareceu na tela` (no `npm run dev`, duas vezes: é o StrictMode, explicado junto com a limpeza) |
| 2 | a aba do navegador mostra "Minhas Tarefas" |
| 3 | no DevTools, a aba Application guarda `minhas-tarefas:visitou` com o valor `sim` |

---

## Dependências

Como o app da loja sabe a hora de avisar que o preço baixou?

---

## O array de dependências

As **dependências** são a lista do "me avise se mudar", como o alerta de preço de uma loja: você só recebe aviso quando o produto marcado muda. Depois de cada renderização, o React confere a lista e só roda o efeito de novo se um valor dela mudou.

| Segundo argumento | Quando o efeito roda | Uso típico |
|---|---|---|
| `[]` | Uma vez, logo após montar | Buscar dados iniciais |
| Omitido | Depois de toda renderização | Quase nunca; risco de laço |
| `[valor]` | Ao montar e sempre que `valor` mudar | Reagir a uma busca ou a um id |

```jsx
useEffect(() => { /* ... */ }, [])        // só ao montar
useEffect(() => { /* ... */ })            // toda renderização
useEffect(() => { /* ... */ }, [filtro])  // quando filtro muda
```

Para carregar as tarefas ao abrir o app, use `[]`.

---

## :icon[tag] Dependência na prática: o título da aba

`document.title` é o texto da aba do navegador. Um efeito o mantém igual ao contador de pendentes:

```jsx
const pendentes = tarefas.filter((t) => !t.concluida).length

useEffect(() => {
  document.title = `(${pendentes}) Minhas Tarefas`
}, [pendentes])
```

- Ao montar, a aba mostra "(2) Minhas Tarefas"
- Concluir uma tarefa muda `pendentes`: o React roda o efeito de novo
- Remover uma tarefa já concluída redesenha o `App`, mas `pendentes` não muda: o efeito fica parado

Regra: **todo valor do componente que o efeito usa entra no array**. As funções `set...` do `useState` ficam de fora, porque nunca mudam. Com `[]` no lugar de `[pendentes]`, a aba ficaria presa no primeiro número.

---

## :icon[lightbulb] Pratique: busca no corpo da função

:::example Desafio
Imagine `fetch` e `setTarefas` escritos direto no corpo de `App`, sem `useEffect`.

1. O que acontece no instante em que `setTarefas` recebe a lista?
2. Quantas vezes o servidor vai ser chamado?
3. E se você usar `useEffect`, mas esquecer o segundo argumento: o problema desaparece?

Dica: toda mudança de estado faz o React executar a função do componente de novo.
:::

:::tip Resposta
1. `setTarefas` faz o React executar `App()` de novo, e a busca dispara outra vez
2. Sem parar: cada resposta faz outra busca
3. Não: sem o segundo argumento, o efeito roda depois de toda renderização, e o laço continua. Para buscar uma vez, termine com `}, [])`
:::

---

## Dados da API

No restaurante, você vai até a cozinha buscar o prato?

---

## :icon[server] A API de tarefas

Uma **API** é o garçom da internet: você pede pelo cardápio (o endereço), a cozinha (o servidor) prepara, e ele traz o prato, em JSON. Para tarefas, use a **JSONPlaceholder**, uma API de testes como a DummyJSON do E19. Abra no navegador:

`https://jsonplaceholder.typicode.com/todos?_limit=10`

```json
[
  { "userId": 1, "id": 1, "title": "delectus aut autem", "completed": false },
  { "userId": 1, "id": 2, "title": "quis ut nam facilis", "completed": false }
]
```

- `?_limit=10` pede só as 10 primeiras tarefas
- Os campos vêm em inglês (`title`, título; `completed`, concluída); os títulos, em latim de teste
- O `fetch` do navegador é o mesmo do Node: o que você fez no terminal no E19 vale aqui

---

## :icon[server] A API na prática

Três pedidos ao garçom, digitados no Console do navegador (F12). O fim do endereço muda o pedido:

```javascript
const r1 = await fetch('https://jsonplaceholder.typicode.com/todos/1')
await r1.json()
// { userId: 1, id: 1, title: 'delectus aut autem', completed: false }

const r2 = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=2')
const duas = await r2.json()
duas.length // 2

const r3 = await fetch('https://jsonplaceholder.typicode.com/todos?completed=true&_limit=1')
await r3.json()
// [{ userId: 1, id: 4, title: 'et porro tempora', completed: true }]
```

- `/todos/1` pede uma tarefa só, a de id 1: vem um objeto, sem colchetes
- `?_limit=2` pede as duas primeiras; o `&` junta mais um pedido, como `completed=true`, só as concluídas

---

## :icon[cloud-download] carregarTarefas: o fetch do E19

A função busca e traduz para os nomes que seus componentes esperam. Fica em `src/App.jsx`, acima do `App`:

```jsx
const URL_API = 'https://jsonplaceholder.typicode.com/todos?_limit=10'

async function carregarTarefas() {
  const resposta = await fetch(URL_API)
  if (!resposta.ok) throw new Error('A API respondeu ' + resposta.status)
  const dados = await resposta.json()
  return dados.map((item) => ({
    id: item.id,
    titulo: item.title,
    concluida: item.completed,
    prioridade: 'media',
  }))
}
```

Nada aqui é React: é o JavaScript comum do E19.

---

## :icon[list-ordered] carregarTarefas em português

| Linha | O que ela diz |
|---|---|
| `const URL_API = ...` | "o endereço da API, escrito num lugar só" |
| `async` e `await fetch(URL_API)` | "faça o pedido e espere a resposta", sem travar a tela |
| `if (!resposta.ok) throw ...` | "se a API respondeu com erro, lance um erro": o `fetch` não falha sozinho com 404 ou 500 |
| `await resposta.json()` | "espere o corpo da resposta virar dados" |
| `dados.map(...)` | "traduza cada item": `title` vira `titulo`, `completed` vira `concluida` |
| `prioridade: 'media'` | a API não tem prioridade: todas começam como média |

São dois `await`: um para a resposta e outro para o `.json()`.

---

## :icon[zap] O efeito chama carregarTarefas

```jsx
function App() {
  const [tarefas, setTarefas] = useState([])

  useEffect(() => {
    async function iniciar() {
      const lista = await carregarTarefas()
      setTarefas(lista)
    }
    iniciar()
  }, [])

  return <ListaTarefas tarefas={tarefas} />
}
```

- O `tarefasIniciais` sai: o estado começa vazio, `useState([])`
- A função do efeito **não pode ser `async`**: o React espera que ela devolva nada ou uma limpeza, e uma função `async` devolve uma Promise, a senha da lanchonete. Por isso você cria `iniciar` dentro do efeito e a chama em seguida
- `[]` garante uma única busca, ao montar

---

## :icon[route] Do primeiro desenho à lista na tela

:::center
![Animação: React desenha a lista vazia, depois o efeito roda e chama fetch(URL_API); com await, a resposta chega e setTarefas guarda a lista; React desenha de novo com as 10 tarefas, e o efeito não volta a rodar](images/e24-render-efeito-fetch.svg)
:::

O React desenha primeiro a lista vazia. Só **depois** o efeito roda e busca as tarefas. Quando a resposta chega, `setTarefas` guarda a lista e o React desenha de novo.

Como o array de dependências é `[]`, o efeito não roda nessa segunda renderização: uma busca só.

---

## Carregando e erro

Enquanto o pedido não fica pronto, o que o painel da lanchonete mostra?

---

## :icon[hourglass] Estado de carregamento

Entre abrir o app e a resposta chegar, a lista fica vazia. Avise a pessoa com um estado **`carregando`**, como o painel da lanchonete que mostra "preparando" até a senha ser chamada:

```jsx
const [carregando, setCarregando] = useState(true)

useEffect(() => {
  async function iniciar() {
    const lista = await carregarTarefas()
    setTarefas(lista)
    setCarregando(false)
  }
  iniciar()
}, [])
```

No JSX, renderização condicional, com o ternário do E13:

```jsx
{carregando ? <p>Carregando...</p> : <ListaTarefas tarefas={tarefas} />}
```

Começa `true` e vira `false` só depois que as tarefas foram guardadas no estado.

---

## :icon[triangle-alert] Estado de erro

Sem internet, o `fetch` rejeita com `Failed to fetch`; com status 500, o seu `throw` lança. Capture com o **`try/catch/finally`** do E17, a rede de proteção do trapezista, e guarde uma mensagem no estado **`erro`**:

```jsx
const [erro, setErro] = useState(null)

async function iniciar() {
  try {
    const lista = await carregarTarefas()
    setTarefas(lista)
  } catch (e) {
    setErro('Não foi possível carregar as tarefas.')
  } finally {
    setCarregando(false) // roda sempre, com ou sem erro
  }
}
```

```jsx
{erro && <p className="erro">{erro}</p>}
```

- `useState(null)`: começa sem erro; `null` quer dizer "nada aqui"
- `erro && ...` mostra a mensagem só quando há erro

Para testar, desligue o Wi-Fi ou troque a URL por uma inválida e recarregue.

---

## :icon[split] Carregando e erro na prática

:::center
![Diagrama: enquanto carregando é true, a tela mostra Carregando...; se o try dá certo, aparecem as tarefas; se a falha cai no catch, aparece Não foi possível carregar as tarefas; o finally chama setCarregando(false) nos dois casos](images/e24-carregando-lista-erro.svg)
:::

```jsx
{erro && <p className="erro">{erro}</p>}
{carregando ? <p>Carregando...</p> : <ListaTarefas tarefas={tarefas} />}
```

| Situação | A tela mostra |
|---|---|
| a resposta ainda não chegou | Carregando... |
| a resposta chegou (o `try` deu certo) | as 10 tarefas |
| sem internet, ou status 500 (o `catch`) | Não foi possível carregar as tarefas. |

Nos dois finais, o `finally` chama `setCarregando(false)`: a tela nunca fica presa em "Carregando...".

---

## A limpeza

O que você faz com a luz quando sai do quarto?

---

## :icon[ban] A limpeza: desfazer o que o efeito fez

A **limpeza** desfaz o que o efeito fez, como apagar a luz ao sair do cômodo. O efeito a devolve com `return`. O React a chama antes de rodar o efeito de novo e quando o componente sai da tela. Aqui, ela cancela o pedido com o `AbortController` do E19: é avisar o garçom "esquece aquele pedido".

```jsx
useEffect(() => {
  const controle = new AbortController()
  async function iniciar() {
    try {
      const lista = await carregarTarefas(controle.signal)
      setTarefas(lista)
    } catch (e) {
      if (e.name !== 'AbortError') setErro('Não foi possível carregar as tarefas.')
    } finally {
      if (!controle.signal.aborted) setCarregando(false)
    }
  }
  iniciar()
  return () => controle.abort() // a limpeza
}, [])
```

---

## :icon[ban] A limpeza na prática

Cada efeito que liga alguma coisa devolve a limpeza que desliga. Três casos, com os timers do E18:

```jsx
// 1. cancelar um pedido
const controle = new AbortController()
return () => controle.abort()

// 2. desligar um relógio
const relogio = setInterval(() => console.log('tique'), 1000)
return () => clearInterval(relogio)

// 3. cancelar um aviso agendado
const aviso = setTimeout(() => console.log('Salvo!'), 2000)
return () => clearTimeout(aviso)
```

| Limpeza | Sem ela, quando o componente sai da tela | Com ela |
|---|---|---|
| `abort()` | a resposta velha ainda chega e é guardada | o pedido aparece cancelado na aba Rede |
| `clearInterval` | o console continua: tique, tique, tique... | o relógio para |
| `clearTimeout` | o `Salvo!` aparece mesmo assim | o aviso não aparece |

---

## :icon[list-ordered] A limpeza em português

| Linha | O que ela diz |
|---|---|
| `new AbortController()` | "crie o controle que pode cancelar este pedido" |
| `carregarTarefas(controle.signal)` | "leve o sinal de cancelamento junto com o pedido" |
| `e.name !== 'AbortError'` | "só mostre erro se não foi um cancelamento" |
| `!controle.signal.aborted` | "só desligue o carregando se este pedido não foi cancelado" |
| `return () => controle.abort()` | a limpeza: "cancele o pedido" |

O `carregarTarefas` passa a receber o sinal e o repassa ao `fetch`:

```jsx
async function carregarTarefas(sinal) {
  const resposta = await fetch(URL_API, { signal: sinal })
  // o resto continua igual
```

Cancelar não é erro nem fim: quem desliga o `carregando` é o efeito que rodou depois.

---

## :icon[bug] Duas requisições no npm run dev

Abra a aba **Rede** (Network) do DevTools e recarregue: aparecem duas requisições para `todos`, e a primeira está cancelada. Não é defeito seu. O `main.jsx` completo do Vite embrulha o `App` em `<StrictMode>`:

```jsx
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- Em desenvolvimento, o **StrictMode** (modo rigoroso) monta o componente, desmonta e monta de novo, como um treino de incêndio: prova que a sua limpeza funciona
- A limpeza cancela o primeiro pedido; só o segundo chega à tela
- Sem a limpeza, os dois pedidos chegariam e a lista seria guardada duas vezes
- No `npm run build`, que vai para o usuário, o efeito roda uma vez

---

## Mensagens de erro

A aba Rede também é um painel. O que cada luz dela quer dizer?

---

## :icon[siren] Quando aparece um erro

| O que aparece | Quer dizer | O que fazer |
|---|---|---|
| tela piscando e dezenas de requisições na aba Rede | faltou o `[]` | complete o array de dependências |
| `useEffect must not return anything besides a function` | `useEffect(async () => ...)` | crie a função `async` dentro do efeito |
| "Carregando..." para sempre | `setCarregando(false)` no `try` | mova para o `finally` |
| no `npm run dev`, a mensagem de erro junto com a lista | o cancelamento virou erro | ignore o `AbortError` |
| o efeito não roda quando um valor muda | o valor está fora do array | ponha no array: `[pendentes]` |

---

## Resumo

:::summary
- **useEffect** executa código depois que o React desenha a tela; o array de dependências diz quando ele roda de novo
- Todo valor do componente que o efeito usa entra no array; `[]` roda uma vez, ao montar
- A função do efeito não é `async`: crie uma `async` dentro dela, com o `fetch` do E19
- `carregando` e `erro` são estados como os outros: mostram à pessoa o que está acontecendo
- A limpeza desfaz o efeito; com o `AbortController`, ela cancela o pedido que não serve mais
:::

Próxima aula: o `App` ficou grande. Você vai separar essa lógica em **hooks próprios** e criar uma busca de tarefas.
