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

## As tarefas somem ao recarregar

Abra o `minhas-tarefas`, adicione três tarefas e aperte F5.

Tudo volta ao começo: o array `tarefasIniciais` vive só na memória do navegador e morre com a página.

Na vida real, as tarefas ficam em um **servidor** e o app as busca pela rede quando abre, como o `lojinha-regras` buscou produtos na DummyJSON no E19.

:::question
Onde, dentro do componente `App`, você colocaria o código que busca as tarefas? E quantas vezes ele deveria rodar?
:::

---

## :icon[play] Quando o componente nasce

Na primeira vez que React chama `App()`, ele **monta** o componente: executa a função e desenha o resultado na tela.

Buscar dados direto no corpo da função parece natural, mas cria um laço:

:::steps
1. React executa `App()` e desenha a tela
2. A busca dispara; quando a resposta chega, você chama `setTarefas`
3. `setTarefas` faz React executar `App()` de novo
4. A busca dispara de novo, e volta ao passo 2
:::

Resultado: requisições sem fim. O corpo da função é lugar de **descrever a tela**, não de buscar dados.

---

## useEffect: código que roda depois de renderizar

**useEffect** registra um **efeito**: uma função que React executa depois de desenhar a tela, fora do fluxo de renderização. Como o `useState`, ele é um **hook**, uma função do React que começa com `use`.

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

## O array de dependências

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
- Concluir uma tarefa muda `pendentes`: React roda o efeito de novo
- Digitar no formulário redesenha o `App`, mas `pendentes` não muda: o efeito fica parado

Regra: **todo valor do componente que o efeito usa entra no array**; as funções `set...` do `useState` ficam de fora, porque nunca mudam. Com `[]` no lugar de `[pendentes]`, a aba ficaria presa no primeiro número.

---

## Pense

:::question
Imagine `fetch` e `setTarefas` escritos direto no corpo de `App`, sem `useEffect`.

1. O que acontece no instante em que `setTarefas` recebe a lista?
2. Quantas vezes o servidor vai ser chamado?
3. E se você usar `useEffect`, mas esquecer o segundo argumento: o problema desaparece?
:::

:::tip Dica
Toda mudança de estado faz React executar a função do componente de novo. Siga a sequência passo a passo.
:::

---

## :icon[server] A API de tarefas

Para tarefas, use a **JSONPlaceholder**, uma API de testes como a DummyJSON do E19. Abra no navegador:

`https://jsonplaceholder.typicode.com/todos?_limit=10`

```json
[
  { "userId": 1, "id": 1, "title": "delectus aut autem", "completed": false },
  { "userId": 1, "id": 2, "title": "quis ut nam facilis", "completed": false }
]
```

- `?_limit=10` pede só as 10 primeiras tarefas
- Os campos vêm em inglês (`title`, `completed`); os títulos, em latim de teste
- O `fetch` do navegador é o mesmo do Node: o que você fez no terminal no E19 vale aqui

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

Lembretes do E19: dois `await` (a resposta e o `.json()`), `resposta.ok` porque 404 e 500 não rejeitam, e o `map` que traduz. Nada aqui é React: é JavaScript comum.

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
- A função do efeito **não pode ser `async`**: React espera que ela devolva nada ou uma limpeza, e uma função `async` devolve uma Promise. Por isso você cria `iniciar` dentro do efeito e a chama em seguida
- `[]` garante uma única busca, ao montar

---

## :icon[route] Do primeiro desenho à lista na tela

:::center
![Animação: React desenha a lista vazia, depois o efeito roda e chama fetch(URL_API); com await, a resposta chega e setTarefas guarda a lista; React desenha de novo com as 10 tarefas, e o efeito não volta a rodar](images/e24-render-efeito-fetch.svg)
:::

React desenha primeiro a lista vazia. Só **depois** o efeito roda e busca as tarefas. Quando a resposta chega, `setTarefas` guarda a lista e React desenha de novo.

Como o array de dependências é `[]`, o efeito não roda nessa segunda renderização: uma busca só.

---

## :icon[hourglass] Estado de carregamento

Entre abrir o app e a resposta chegar, a lista fica vazia. Avise o usuário com um estado **`carregando`**:

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

No JSX, renderização condicional:

```jsx
{carregando ? <p>Carregando...</p> : <ListaTarefas tarefas={tarefas} />}
```

Começa `true` e vira `false` só depois que as tarefas foram guardadas no estado.

---

## :icon[triangle-alert] Estado de erro

Sem internet, o `fetch` rejeita; com status 500, o seu `throw` lança. Capture com o **`try/catch/finally`** do E17 e guarde uma mensagem no estado **`erro`**:

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

Para testar, desligue o Wi-Fi ou troque a URL por uma inválida e recarregue.

---

## :icon[split] Carregando, lista ou erro

:::center
![Diagrama: enquanto carregando é true, a tela mostra Carregando...; se o try dá certo, aparecem as tarefas; se a falha cai no catch, aparece Não foi possível carregar as tarefas; o finally chama setCarregando(false) nos dois casos](images/e24-carregando-lista-erro.svg)
:::

A tela começa em "Carregando...". Quando a busca termina, ela mostra a lista, se o `try` deu certo, ou a mensagem de `erro`, se a falha caiu no `catch`.

Nos dois casos, o `finally` chama `setCarregando(false)`: a tela nunca fica presa em "Carregando...".

---

## :icon[ban] A limpeza: desfazer o que o efeito fez

O efeito pode devolver uma função de **limpeza**. React a chama antes de rodar o efeito de novo e quando o componente sai da tela. Aqui, ela cancela o pedido com o `AbortController` do E19:

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

`carregarTarefas(sinal)` repassa o sinal: `fetch(URL_API, { signal: sinal })`. Cancelar não é erro nem fim: quem desliga o `carregando` é o efeito que rodou depois.

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

- Em desenvolvimento, o **StrictMode** monta o componente, desmonta e monta de novo, para provar que a sua limpeza funciona
- A limpeza cancela o primeiro pedido; só o segundo chega à tela
- Sem a limpeza, os dois pedidos chegariam e a lista seria guardada duas vezes
- No `npm run build`, que vai para o usuário, o efeito roda uma vez

---

## Erros comuns

:::warning
- Esquecer o `[]` no `useEffect`: busca infinita, tela piscando e dezenas de requisições por segundo na aba Rede
- Usar um valor no efeito sem colocá-lo no array: o efeito não roda de novo quando ele muda
- Escrever `useEffect(async () => ...)`: React avisa no console; crie uma função `async` dentro do efeito e chame-a
- `setCarregando(false)` dentro do `try`: sem internet, o app fica em "Carregando..." para sempre
- Mostrar o `AbortError` como falha: cancelar é normal, ignore esse erro
:::

---

## Resumo

:::summary
- **useEffect** executa código depois que React desenha a tela; o array de dependências diz quando ele roda de novo
- Todo valor do componente que o efeito usa entra no array; `[]` roda uma vez, ao montar
- A função do efeito não é `async`: crie uma `async` dentro dela, com o `fetch` do E19
- `carregando` e `erro` são estados como os outros: mostram ao usuário o que está acontecendo
- A limpeza desfaz o efeito; com o `AbortController`, ela cancela o pedido que não serve mais
:::

Próxima aula: o `App` ficou grande. Você vai separar essa lógica em **hooks próprios** e criar uma busca de tarefas.
