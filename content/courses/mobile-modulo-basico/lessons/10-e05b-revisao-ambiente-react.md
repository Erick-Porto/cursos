---
title: "Revisão: o ambiente React"
summary: Recapitulação dos oito temas da unidade, questões comentadas no estilo da prova e fechamento do projeto.
module: react
duration_minutes: 40
objectives:
  - Revisar os conceitos da unidade
  - Resolver questões no estilo da prova
  - Concluir a versão 1 do projeto Minhas Tarefas
---

# Revisão: o ambiente React

Programador Mobile: Módulo Básico · Encontro E05 · Aula 10 de 18

---

## O que você vai aprender

:::goal
- Rever os oito temas da unidade, um slide por tema
- Resolver cinco questões comentadas no estilo da Prova 1
- Reconhecer as armadilhas que mais derrubam nota
- Fechar a versão 1 do projeto Minhas Tarefas no laboratório
:::

---

## :icon[map] Mapa da unidade

Em cinco encontros você saiu da página HTML e chegou a um app que conversa com um servidor. A Prova 1 cobre estes oito temas:

::::columns
:::col

1. A web por dentro
2. Por que React
3. Ambiente: Node, npm, Vite e Git
4. JSX

:::
:::col

5. Componentes e props
6. Listas, keys e estilos
7. Estado, eventos e formulários
8. Efeitos e fetch

:::
::::

Use esta aula como roteiro de estudo: um slide por tema e, depois, questões comentadas.

---

## :icon[globe] A web por dentro

- O navegador (**cliente**) pede uma página ao **servidor** e recebe HTML, CSS e JavaScript
- **HTML** dá estrutura, **CSS** dá aparência, **JavaScript** dá comportamento
- O **front** (navegador ou app no celular) é o que o usuário vê; o **back-end** roda no servidor
- O **DevTools** (F12) mostra elementos, console e requisições de rede

```html
<main>
  <h1>Minhas Tarefas</h1>
  <ul id="lista"></ul>
  <script src="app.js"></script>
</main>
```

---

## :icon[component] Por que React

- Com JavaScript puro, cada mudança nos dados exige atualizar o HTML à mão; tela e dados saem de sincronia
- **React** é uma biblioteca para montar interfaces em **componentes**: peças reutilizáveis que descrevem a tela a partir dos dados
- Você descreve **o que** mostrar; React decide **como** atualizar a página
- O mesmo modelo serve para o celular, com **React Native**

```jsx
function App() {
  return <h1>Minhas Tarefas</h1>
}
```

---

## :icon[terminal] Ambiente: Node, npm, Vite e Git

- **Node.js** (versão LTS) executa JavaScript fora do navegador; **npm** instala pacotes
- `package.json` lista as dependências; `node_modules/` guarda os arquivos e **nunca vai para o Git**
- **Vite** cria o projeto e serve o app com recarga automática
- **Git** registra versões; o **GitHub** guarda o repositório na nuvem

```bash
npm create vite@latest minhas-tarefas -- --template react
cd minhas-tarefas
npm install
npm run dev
git init
git add .
git commit -m "primeira versão"
git push
```

---

## :icon[code-xml] JSX

- **JSX** é HTML dentro do JavaScript; o Vite o converte em chamadas de função
- Um componente devolve **um só elemento raiz**; agrupe com `<>...</>` quando precisar
- Atributos em camelCase: `className`, `onClick`, `htmlFor`
- Toda tag fecha: `<img />`, `<input />`
- Chaves `{}` inserem qualquer expressão JavaScript

```jsx
<>
  <h1 className="titulo">Minhas Tarefas</h1>
  <p>{tarefas.length} tarefas cadastradas</p>
  <img src={logo} alt="Logotipo" />
</>
```

---

## :icon[blocks] Componentes e props

- Um **componente** é uma função com nome em **PascalCase** que devolve JSX
- **Props** são os dados que o pai passa ao filho, como atributos; o filho só lê, nunca altera
- Receba props por desestruturação: `function CartaoTarefa({ titulo, prioridade })`
- Um arquivo por componente em `src/components/`, com `export default` e `import`

```jsx
function CartaoTarefa({ titulo, prioridade, concluida }) {
  return <li>{titulo} ({prioridade})</li>
}

<CartaoTarefa titulo="Estudar React" prioridade="alta" concluida={false} />
```

---

## :icon[list] Listas, keys e estilos

- `.map` transforma um array de dados em um array de elementos JSX
- Cada item precisa de uma **`key`** única e estável: use o `id`, nunca a posição no array
- **CSS Modules** (`CartaoTarefa.module.css`) deixam as classes locais ao componente
- Classe condicional: só aplica `concluida` quando a tarefa estiver concluída

```jsx
import estilos from './CartaoTarefa.module.css'

<li className={`${estilos.cartao} ${concluida ? estilos.concluida : ''}`}>

{tarefas.map((t) => (
  <CartaoTarefa key={t.id} titulo={t.titulo} prioridade={t.prioridade} />
))}
```

---

## :icon[refresh-cw] Estado, eventos e formulários

- **`useState`** devolve `[valor, setValor]`; só o `setValor` faz React renderizar de novo
- Nunca altere o estado direto (`tarefas.push`): crie uma lista nova com `[...tarefas, nova]`, `.map` ou `.filter`
- Eventos: `onClick={() => removerTarefa(id)}`; passe a função, não o resultado dela
- Input **controlado**: `value={titulo}` + `onChange={(e) => setTitulo(e.target.value)}`
- `onSubmit` no `<form>` com `event.preventDefault()` para não recarregar a página

```jsx
const [tarefas, setTarefas] = useState([])

function adicionarTarefa(titulo) {
  const nova = { id: Date.now(), titulo, prioridade: 'media', concluida: false }
  setTarefas([...tarefas, nova])
}
```

---

## :icon[cloud-download] Efeitos e fetch

- **`useEffect`** roda a função **depois** de React desenhar a tela
- `[]` como segundo argumento: roda uma vez, ao montar; sem array: toda renderização
- **`fetch(url)`** pede dados ao servidor; `async/await` espera a resposta e o `.json()`
- Estados `carregando` e `erro` avisam o usuário; `try/catch` captura falhas de rede

:::center
![Diagrama: com o array vazio, React desenha, o efeito busca, setTarefas guarda e React desenha de novo, com uma busca só; sem o array, setTarefas volta para a renderização e as buscas não têm fim](images/e05-com-e-sem-array.svg)
:::

```jsx
useEffect(() => {
  async function iniciar() {
    const lista = await carregarTarefas() // fetch + json + title vira titulo
    setTarefas(lista)
  }
  iniciar()
}, [])
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
  onAdicionar(titulo)
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

## :icon[triangle-alert] Erros que mais reprovam

:::warning
- Confundir **props** (vêm do pai, só leitura) com **estado** (vive no componente, muda com o `set`)
- Alterar o estado direto (`tarefas.push(nova)`, `contagem++`) e esperar que a tela mude
- Usar o índice do array como `key` ou esquecer a `key` no `map`
- Chamar a função no evento em vez de passá-la: `onClick={remover(id)}` roda no render, não no clique
- Esquecer o `[]` do `useEffect` ou o `await` antes de `fetch` e `.json()`
:::

Se um enunciado parece fácil demais, procure um desses cinco antes de responder.

---

## :icon[clipboard-check] Como será a prova

| Item | Como é |
|---|---|
| Questões | 20 objetivas |
| Tempo | 60 minutos, 1 tentativa |
| Nota mínima | 70 |
| Conteúdo | E01 a E05 (aulas 1 a 9) |
| Onde | No sistema, na última hora do encontro |

Tipos: **escolha única**, **múltipla escolha** (marque todas as corretas), **verdadeiro ou falso** e **lacuna** (escreva a palavra exata, como `className`).

:::tip Leia o enunciado
- Palavras como **não**, **sempre**, **uma vez** e **remover** mudam a resposta
- Em questões com código, leia linha por linha antes de olhar as alternativas
- Em múltipla escolha, julgue cada alternativa sozinha
:::

---

## :icon[flask-conical] No laboratório

**40 minutos.** Fechar a versão 1 do **Minhas Tarefas**: ao abrir, as 10 primeiras tarefas vêm da API.

:::steps
1. Em `src/App.jsx`, crie `carregarTarefas`: `fetch` em `https://jsonplaceholder.typicode.com/todos?_limit=10` e `map` para `{ id, titulo, concluida, prioridade: 'media' }`
2. Troque o array inicial por `useState([])` e chame a função em um `useEffect` com `[]`
3. Adicione os estados `carregando` ("Carregando...") e `erro` (`try/catch` com mensagem amigável)
4. Teste: uma só requisição na aba Rede; sem Wi-Fi, a mensagem de erro aparece
5. `git add .`, `git commit -m "v1 web"` e `git push`
6. No GitHub, confira se o README diz o que o projeto faz e como rodá-lo
:::

Entrega: link do repositório no sistema. Depois, a **Prova 1** (60 minutos, no sistema).
