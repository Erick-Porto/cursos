---
title: Efeitos e dados externos
summary: Buscar tarefas de uma API com useEffect, fetch e async/await, com estados de carregamento e erro.
module: react
duration_minutes: 40
objectives:
  - Executar código após a renderização com useEffect
  - Buscar dados de uma API com fetch e async/await
  - Mostrar estados de carregamento e erro
---

# Efeitos e dados externos

Programador Mobile: Módulo Básico · Encontro E05 · Aula 9 de 18

---

## O que você vai aprender

:::goal
- Executar código depois de a tela aparecer, com `useEffect`
- Entender o papel do array de dependências
- Buscar dados de uma API com `fetch` e `async/await`
- Mostrar "Carregando..." e uma mensagem de erro para o usuário
:::

---

## As tarefas somem ao recarregar

Abra o `minhas-tarefas`, adicione três tarefas e aperte F5.

Tudo volta ao começo: o array inicial vive só na memória do navegador e morre com a página.

Na vida real, as tarefas ficam em um **servidor** e o app as busca pela rede quando abre.

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

**useEffect** registra um **efeito**: uma função que React executa depois de desenhar a tela, fora do fluxo de renderização.

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
| `[valor]` | Ao montar e sempre que `valor` mudar | Reagir a um filtro ou id |

```jsx
useEffect(() => { /* ... */ }, [])        // só ao montar
useEffect(() => { /* ... */ })            // toda renderização
useEffect(() => { /* ... */ }, [filtro])  // quando filtro muda
```

Para carregar as tarefas ao abrir o app, use `[]`.

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

## :icon[server] fetch: pedir dados a um servidor

**fetch** é a função do navegador que faz um pedido a uma URL e recebe a resposta pela rede.

Nesta unidade usamos a **API** de testes JSONPlaceholder. Abra no navegador:

`https://jsonplaceholder.typicode.com/todos?_limit=10`

```json
[
  { "userId": 1, "id": 1, "title": "delectus aut autem", "completed": false },
  { "userId": 1, "id": 2, "title": "quis ut nam facilis", "completed": false }
]
```

- O servidor responde em **JSON**: texto com a forma de objetos JavaScript
- `?_limit=10` pede só as 10 primeiras tarefas
- A resposta demora: a viagem até o servidor leva tempo, e o código precisa **esperar**

---

## :icon[timer] async/await: a receita para esperar

Esperar uma resposta em JavaScript segue sempre os mesmos três passos:

:::steps
1. Marque a função com **`async`**
2. Escreva `await` antes de `fetch(url)`: pausa até a resposta chegar
3. Escreva `await` antes de `resposta.json()`: pausa até o texto virar objetos
:::

```javascript
async function buscar(url) {
  const resposta = await fetch(url)
  const dados = await resposta.json()
  return dados
}
```

:::info
`await` só funciona dentro de uma função `async`. O que acontece por baixo (as **promises**) você vai aprofundar no módulo específico.
:::

---

## Exemplo completo (1 de 2): carregarTarefas

A API fala inglês (`title`, `completed`) e nossos componentes esperam `titulo`, `concluida` e `prioridade`. A função busca e traduz:

```jsx
const URL_API = 'https://jsonplaceholder.typicode.com/todos?_limit=10'

async function carregarTarefas() {
  const resposta = await fetch(URL_API)
  const dados = await resposta.json()
  return dados.map((item) => ({
    id: item.id,
    titulo: item.title,
    concluida: item.completed,
    prioridade: 'media',
  }))
}
```

Coloque a função em `src/App.jsx`, acima do componente `App`. O `map` devolve uma lista nova, já no formato que `ListaTarefas` conhece.

---

## Exemplo completo (2 de 2): o efeito

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

- O estado começa vazio: `useState([])`
- A função do efeito não pode ser `async`; por isso você cria `iniciar` dentro dela e a chama em seguida
- `[]` garante uma única busca, ao montar
- Quando a lista chega, `setTarefas` renderiza a tela com as 10 tarefas

---

## :icon[route] Do primeiro desenho à lista na tela

:::center
![Animação: React desenha a lista vazia, depois o efeito roda e chama fetch(URL_API); com await, a resposta chega e setTarefas guarda a lista; React desenha de novo com as 10 tarefas, e o efeito não volta a rodar](images/e05-render-efeito-fetch.svg)
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

Sem internet ou com o servidor fora, o `await` falha. Capture a falha com **`try/catch`** e guarde uma mensagem no estado **`erro`**:

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
![Diagrama: enquanto carregando é true, a tela mostra Carregando...; se o try dá certo, aparecem as tarefas; se a falha cai no catch, aparece Não foi possível carregar as tarefas; o finally chama setCarregando(false) nos dois casos](images/e05-carregando-lista-erro.svg)
:::

A tela começa em "Carregando...". Quando a busca termina, ela mostra a lista, se o `try` deu certo, ou a mensagem de `erro`, se a falha caiu no `catch`.

Nos dois casos, o `finally` chama `setCarregando(false)`: a tela nunca fica presa em "Carregando...".

---

## :icon[refresh-cw] O efeito que nunca para

```jsx
useEffect(() => {
  async function iniciar() {
    setTarefas(await carregarTarefas())
  }
  iniciar()
}) // faltou o array!
```

:::warning
Sem o array de dependências, o efeito roda **depois de cada renderização**. `setTarefas` renderiza de novo, o efeito roda de novo, faz nova busca, chama `setTarefas`... A aba **Rede** (Network) do DevTools mostra dezenas de requisições por segundo e a tela pisca.
:::

Com `[]`, a aba Rede mostra **uma** requisição para `todos`. Confira sempre.

---

## Erros comuns

:::warning
- Esquecer o `[]` no `useEffect`: busca infinita e tela piscando
- Esquecer o `await` antes de `fetch(...)` ou de `resposta.json()`: a variável recebe uma promessa, não os dados, e `dados.map` falha
- Chamar `setTarefas(resposta)` sem o `.json()`: a resposta é um objeto `Response`, não a lista de tarefas
- Não tratar erro: sem internet, o app fica em "Carregando..." para sempre
- Escrever `useEffect(async () => ...)`: React avisa no console; crie uma função `async` dentro do efeito e chame-a
:::

---

## Resumo

:::summary
- **useEffect** executa código depois que React desenha a tela; com `[]`, roda uma vez, ao montar
- Buscar dados no corpo do componente gera um laço de renderizações; dentro do efeito, não
- **fetch** pede dados a uma URL; `async/await` espera a resposta e o `.json()`
- O `map` traduz os campos da API para a forma que seus componentes esperam
- `carregando` e `erro` são estados como os outros: mostram ao usuário o que está acontecendo
:::

---

## Próximos passos

Com `useEffect` e `fetch`, o **Minhas Tarefas** fecha o ciclo da unidade: componentes, props, estado, eventos e dados de um servidor.

A aula 10 é de **revisão**: um mapa dos oito temas da unidade, cinco questões comentadas no estilo da prova e o enunciado do laboratório.

:::info Programe-se
- Laboratório de 40 minutos: carregar as tarefas da API no seu projeto e fechar a versão 1
- Em seguida, a **Prova 1** no sistema: 60 minutos, cobrindo as aulas 1 a 9
:::

Antes de seguir, faça o quiz desta aula.
