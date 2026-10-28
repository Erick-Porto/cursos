---
title: "Revisão: o ambiente React"
summary: Recapitulação de E21 a E24, questões comentadas no estilo da Prova 2 e a versão 1 do Minhas Tarefas.
module: react
duration_minutes: 40
objectives:
  - Revisar os temas da Introdução ao ambiente React, de E21 a E24
  - Resolver questões no estilo da Prova 2 e reconhecer as armadilhas mais comuns
  - Fechar a versão 1 do projeto Minhas Tarefas
---

# Revisão: o ambiente React

Programador Mobile · Encontro E25 · Aula 49 de 89

---

## :icon[map] Mapa da revisão

:::goal
- Rever os oito temas da unidade, um slide por tema
- Resolver seis questões comentadas no estilo da Prova 2
- Reconhecer as armadilhas que mais derrubam nota
- Fechar a versão 1 do Minhas Tarefas no laboratório
:::

Em quatro encontros, o JavaScript que você já sabia virou tela. A Prova 2 cobre:

| Encontro | Temas |
|---|---|
| E21 | por que React, projeto Vite e JSX |
| E22 | componentes, props, listas, keys e estilos |
| E23 | eventos, `useState` e formulários controlados |
| E24 | `useEffect`, dependências, limpeza e hooks próprios |

---

## :icon[component] Por que React

- Em JavaScript puro, cada mudança nos dados exige procurar o elemento e trocar o texto à mão; esqueça um lugar e a tela mente
- **React** é **declarativo**: você descreve o que a tela mostra para cada estado, e ele atualiza o DOM
- Um **componente** é uma função que devolve um pedaço de tela; a tela é uma árvore de componentes
- Uma **SPA** carrega a página uma vez e depois troca só o que mudou

::::columns
:::col
**Imperativo**

```javascript
total = total + 1
span.textContent = total
```
:::
:::col
**Declarativo**

```jsx
<button onClick={() => setTotal(total + 1)}>
  Cliques: {total}
</button>
```
:::
::::

---

## :icon[code-xml] Projeto Vite e JSX

- `npm create vite@latest` cria o projeto; `npm run dev` liga o servidor com recarga automática
- `index.html` carrega `src/main.jsx`, que renderiza o `App` dentro da `div#root`
- **JSX** tem três regras: um só elemento raiz (`<>...</>`), atributos em camelCase (`className`, `htmlFor`, `onClick`) e toda tag fecha (`<img />`)
- Chaves `{}` inserem qualquer **expressão**; `if` e `for` soltos não entram

```jsx
<>
  <h1 className="titulo">Minhas Tarefas</h1>
  <p>{tarefas.length} tarefas cadastradas</p>
  <img src="/logo.png" alt="Logotipo" />
</>
```

---

## :icon[blocks] Componentes e props

- Um **componente** é uma função com nome em **PascalCase** que devolve JSX; um por arquivo em `src/components/`, com `export default`
- **Props** são os dados que o pai passa como atributos; chegam em um objeto e o filho só lê
- Desestruture no parâmetro (como no E09) e defina padrões: `prioridade = 'media'`
- Texto vai entre aspas; número, booleano e função, entre chaves
- `children` é o conteúdo entre a abertura e o fechamento da tag

```jsx
function CartaoTarefa({ titulo, prioridade = 'media', concluida }) {
  return <li>{titulo} ({prioridade})</li>
}

<CartaoTarefa titulo="Estudar React" concluida={false} />
```

---

## :icon[list] Listas, keys e estilos

- O `map` do E09 transforma o array de dados em um array de elementos JSX
- Cada item leva uma **`key`** única e estável: o `id`, nunca a posição no array
- `condicao && <JSX />` mostra ou nada; o ternário escolhe entre dois
- **CSS Modules** (`CartaoTarefa.module.css`) deixam as classes exclusivas do componente

```jsx
import estilos from './CartaoTarefa.module.css'

<li className={`${estilos.cartao} ${concluida ? estilos.concluida : ''}`}>

{tarefas.length === 0 && <p>Nenhuma tarefa por aqui</p>}
{tarefas.map((t) => (
  <CartaoTarefa key={t.id} titulo={t.titulo} prioridade={t.prioridade} />
))}
```

---

## :icon[mouse-pointer-click] Eventos e estado

- `onClick={contar}` passa a função; `onClick={contar()}` a chama ao desenhar
- Com argumento, embrulhe em uma arrow: `onClick={() => onRemover(id)}`
- **`useState`** devolve `[valor, setValor]`; só o `set` faz React desenhar de novo, e o valor novo só existe na próxima renderização
- Nunca mute o estado: spread para adicionar, `filter` para remover e `map` para alterar, como no E09

```jsx
const [tarefas, setTarefas] = useState([])

function alternarConcluida(id) {
  setTarefas(tarefas.map((t) =>
    t.id === id ? { ...t, concluida: !t.concluida } : t
  ))
}
```

---

## :icon[keyboard] Formulários controlados

- Input **controlado**: `value={titulo}` e `onChange={(e) => setTitulo(e.target.value)}`; o estado manda, o campo obedece
- `value` sem `onChange` trava o campo
- `onSubmit` no `<form>` com `event.preventDefault()`, para a página não recarregar
- O estado mora no **pai mais próximo** que precisa dele: dados descem por props, eventos sobem por funções como `onAdicionar`

```jsx
function enviar(event) {
  event.preventDefault()
  if (titulo.trim() === '') return
  onAdicionar(titulo, prioridade)
  setTitulo('')
}
```

---

## :icon[cloud-download] Efeitos e fetch

- **`useEffect(função, dependências)`** roda depois de React desenhar a tela
- `[]`: uma vez, ao montar; sem array: toda renderização; `[pendentes]`: quando `pendentes` muda. Todo valor que o efeito usa entra no array
- A função do efeito não é `async`: crie uma função `async` dentro dela, com o `fetch` do E19, e chame
- `carregando` e `erro` com `try/catch/finally`; a **limpeza** (`return () => controle.abort()`) cancela o pedido que não serve mais
- No `npm run dev`, o StrictMode monta duas vezes: duas requisições, a primeira cancelada

:::center
![Diagrama: com o array vazio, React desenha, o efeito busca, setTarefas guarda e React desenha de novo, com uma busca só; sem o array, setTarefas volta para a renderização e as buscas não têm fim](images/e25-com-e-sem-array.svg)
:::

---

## :icon[puzzle] Hooks próprios

- Um **hook próprio** é uma função sua, com nome começando por `use`, que chama outros hooks e devolve dados, não JSX
- Regras: só no topo de componentes ou de hooks, nunca em `if`, `for`, evento ou depois de um `return`; React conta os hooks pela ordem
- `useDebounce` devolve uma cópia do valor que só muda depois da pausa; a limpeza cancela o agendamento anterior, a closure do E10
- `useTarefas(busca)` busca, guarda `carregando` e `erro` e devolve `recarregar` e as ações do E23
- Cada chamada tem estados próprios: o hook divide a lógica, não os dados

```jsx
function App() {
  const [busca, setBusca] = useState('')
  const buscaAtrasada = useDebounce(busca, 300)
  const { tarefas, carregando, erro, recarregar,
    adicionarTarefa, alternarConcluida, removerTarefa } = useTarefas(buscaAtrasada)
  // o App só desenha
}
```

---

## Questão comentada 1

:::question
O componente abaixo não compila. Quais são os **dois** problemas?

```jsx
function Cabecalho() {
  return (
    <h1 class="titulo">Minhas Tarefas</h1>
    <p>Organize o seu dia</p>
  )
}
```
:::

:::tip Resposta
1. Dois elementos irmãos na raiz: JSX exige **um só elemento raiz**. Envolva com `<header>...</header>` ou `<>...</>`.
2. `class` é palavra reservada do JavaScript; em JSX o atributo é **`className`**.

Na prova, olhe primeiro a raiz do `return` e depois os atributos: são os erros de JSX mais cobrados.
:::

---

## Questão comentada 2

:::question
O que aparece na tela?

```jsx
const tarefas = [
  { id: 1, titulo: 'Estudar React', concluida: true },
  { id: 2, titulo: 'Fazer café', concluida: false },
  { id: 3, titulo: 'Revisar JSX', concluida: false },
]

<ul>
  {tarefas.filter((t) => !t.concluida).map((t) => <li key={t.id}>{t.titulo}</li>)}
</ul>
```

- a) Três itens, um por tarefa
- b) Dois itens: "Fazer café" e "Revisar JSX"
- c) Um item: "Estudar React"
- d) Erro, porque `key` não aparece no HTML
:::

:::tip Resposta
**b.** O `filter` mantém só as tarefas com `concluida` igual a `false`; o `map` cria um `<li>` para cada uma. A `key` serve só para React identificar os itens e não aparece na página.
:::

---

## Questão comentada 3

:::question
Ao clicar no botão, o número na tela não muda. Por quê?

```jsx
function Contador() {
  let cliques = 0

  return (
    <button onClick={() => { cliques = cliques + 1 }}>
      Cliques: {cliques}
    </button>
  )
}
```
:::

:::tip Resposta
`cliques` é uma variável comum. Mudar o valor dela **não avisa React**, então a tela não é redesenhada; e, se fosse, a função rodaria de novo e `cliques` voltaria a 0.

Só o **estado** faz React renderizar de novo e lembrar o valor entre renderizações:

```jsx
const [cliques, setCliques] = useState(0)
<button onClick={() => setCliques(cliques + 1)}>
```
:::

---

## Questão comentada 4

:::question
No `FormularioTarefa`, o que acontece se você **remover** a linha `event.preventDefault()`?

```jsx
function enviar(event) {
  event.preventDefault()
  onAdicionar(titulo, prioridade)
  setTitulo('')
}

<form onSubmit={enviar}>
```

- a) O formulário deixa de chamar `enviar`
- b) A página recarrega e as tarefas em memória se perdem
- c) O campo de texto não é limpo
- d) Nada muda; a linha é opcional
:::

:::tip Resposta
**b.** O comportamento padrão de um `<form>` é enviar os dados e recarregar a página. `preventDefault()` cancela esse padrão para que React continue no controle. Sem ele, `enviar` até roda, mas a página recarrega em seguida e o estado volta ao inicial.
:::

---

## Questão comentada 5

:::question
Verdadeiro ou falso: "Este efeito busca as tarefas **uma única vez**, quando o `App` aparece na tela."

```jsx
useEffect(() => {
  async function iniciar() {
    const lista = await carregarTarefas()
    setTarefas(lista)
  }
  iniciar()
})
```
:::

:::tip Resposta
**Falso.** Faltou o segundo argumento. Sem o array de dependências, o efeito roda depois de **toda** renderização: `setTarefas` renderiza de novo, o efeito roda de novo, nova busca, e assim por diante. Para rodar só ao montar, termine com `}, [])`.

Na prova, ao ver um `useEffect`, olhe primeiro o fim: tem array? Está vazio? O que tem dentro?
:::

---

## Questão comentada 6

:::question
A pessoa digita "dolor" depressa no campo de busca, uma letra a cada 100 ms. O `App` tem `buscaAtrasada = useDebounce(busca, 300)`. Quantas vezes `buscaAtrasada` muda?

```jsx
function useDebounce(valor, espera = 300) {
  const [atrasado, setAtrasado] = useState(valor)
  useEffect(() => {
    const temporizador = setTimeout(() => setAtrasado(valor), espera)
    return () => clearTimeout(temporizador)
  }, [valor, espera])
  return atrasado
}
```

- a) Cinco vezes, uma por letra, cada uma 300 ms atrasada
- b) Uma vez, para "dolor", 300 ms depois da última letra
- c) Nenhuma, porque o efeito tem dependências
- d) Cinco vezes, sem atraso
:::

:::tip Resposta
**b.** Cada letra muda `valor` e o efeito roda de novo. Antes, React chama a limpeza da renderização anterior, que cancela o agendamento dela. Só o último `setTimeout` chega aos 300 ms, e o `useTarefas` faz uma busca só. Sem o `return () => clearTimeout(...)`, a resposta seria a.
:::

---

## :icon[triangle-alert] Erros que mais reprovam

:::warning
- Confundir **props** (vêm do pai, só leitura) com **estado** (vive no componente, muda com o `set`)
- Alterar o estado direto (`tarefas.push(nova)`, `contagem++`) e esperar que a tela mude
- Usar o índice do array como `key` ou esquecer a `key` no `map`
- Chamar a função no evento em vez de passá-la: `onClick={remover(id)}` roda no render, não no clique
- Esquecer o `[]` do `useEffect`, ou deixar fora do array um valor que o efeito usa
- Chamar um hook dentro de `if`, de um evento ou depois de um `return`
- Esquecer a limpeza no `useDebounce`: todas as letras disparam, só que atrasadas
:::

Se um enunciado parece fácil demais, procure um desses sete antes de responder.

---

## :icon[clipboard-check] Como será a prova

| Item | Como é |
|---|---|
| Questões | 20 objetivas, só de React |
| Tempo | 60 minutos, 1 tentativa |
| Nota mínima | 70 |
| Conteúdo | E21 a E25 (aulas 41 a 49) |
| Onde | No sistema, na última hora do encontro |

Tipos: **escolha única**, **múltipla escolha** (marque todas as corretas), **verdadeiro ou falso** e **lacuna** (a palavra exata, como `className`).

:::tip Leia o enunciado
- Palavras como **não**, **sempre**, **uma vez** e **remover** mudam a resposta
- Em questões com código, leia linha por linha antes de olhar as alternativas
- Em múltipla escolha, julgue cada alternativa sozinha
- O gabarito não aparece ao enviar: sai depois da correção
:::

---

## :icon[flask-conical] No laboratório

**40 minutos.** Fechar a versão 1 do **Minhas Tarefas**: a unidade inteira funcionando junto.

:::steps
1. Confira a base do E24: tarefas da API pelo `useTarefas`, "Carregando...", erro e "Tentar de novo"
2. Confira adicionar, concluir, remover, o título da aba e a busca com `useDebounce`
3. Crie o filtro **Todas, Pendentes, Concluídas**: um estado `filtro`, no topo, e três botões com `onClick`
4. A lista recebe só as tarefas que passam no filtro; o contador continua contando todas
5. No README, escreva o que o app faz e como rodá-lo (`npm install` e `npm run dev`)
6. `npm run lint` sem erros, `git commit -m "v1 web"` e `git push`
:::

Entrega: link do repositório no sistema. Depois, a **Prova 2** (60 minutos, no sistema).

---

## Resumo

:::summary
- React é declarativo: a tela é uma árvore de componentes que recebem props e desenham a partir do estado
- JSX tem uma raiz, `className` e tags fechadas; listas usam `map` com `key={t.id}`
- O estado muda só pelo `set`, sem mutação, e mora no pai mais próximo que precisa dele
- `useEffect` roda depois de desenhar, quando muda o que está no array; a limpeza desfaz o que ele fez
- Hooks próprios como `useTarefas` e `useDebounce` tiram a lógica do componente, sempre chamados no topo
- Armadilhas: `onClick={f()}`, `push` no estado, `key={i}`, efeito sem `[]` e hook dentro de `if`
:::

Agora, a **Prova 2**. No E26, o celular entra: React Native e Expo levam o Minhas Tarefas para o bolso.
