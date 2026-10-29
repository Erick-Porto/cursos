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
- Rever os oito temas da unidade, do E21 ao E24
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

## :icon[book-open] Palavras da unidade

Hoje não há palavra nova. Estas seis aparecem em quase toda questão:

| Palavra | O que é |
|---|---|
| **componente** | uma função que devolve um pedaço de tela, como uma peça de Lego |
| **prop** | um dado que o pai passa ao filho, como atributo da tag; o filho só lê |
| **estado** | um dado guardado pelo componente; quando muda pelo `set`, a tela é redesenhada |
| **renderizar** | o React chamar a função do componente e desenhar o JSX que ela devolve |
| **efeito** | um código que roda depois de a tela ser desenhada, como buscar dados |
| **hook** | uma função com nome começando por `use`, como `useState` e `useEffect` |

---

## Por que React

No restaurante, você dita a receita ou pede o prato?

---

## :icon[component] React: você pede, ele desenha

No JavaScript puro, você entra na cozinha e dita a receita: procura o elemento e troca o texto à mão. Esqueça um lugar, e a tela mente. O **React** é **declarativo**: você pede o prato, "a tela mostra `Cliques: {total}`", e ele atualiza o DOM.

- Um **componente** é uma função que devolve um pedaço de tela, uma peça de Lego; a tela é uma árvore de componentes
- Uma **SPA** (*single-page application*, aplicação de página única) carrega a página uma vez e depois troca só o que mudou

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

## :icon[component] React na prática

A mesma mudança, dos dois jeitos. No imperativo, você escreve cada passo; no declarativo, só o estado novo:

| Mudança | Imperativo: você faz | Declarativo: o React faz |
|---|---|---|
| somar um clique | `total = total + 1` e `span.textContent = total` | `setTotal(total + 1)` |
| apagar uma tarefa | tirar do array, achar o `<li>`, remover, refazer o resumo | `setTarefas(tarefas.filter((t) => t.id !== id))` |
| lista vazia | achar o aviso com `querySelector` e mostrar | `{tarefas.length === 0 && <p>Nenhuma tarefa por aqui</p>}` |

Esqueça uma linha no imperativo, e a tela mente. No declarativo, a tela sai sempre do estado.

---

## Vite e JSX

Qual arquivo liga o App à página?

---

## :icon[code-xml] O projeto Vite e as regras do JSX

O **Vite** cria e roda o projeto. O **JSX** é o HTML escrito dentro do JavaScript, com algumas regras.

- `npm create vite@latest` cria o projeto; `npm run dev` liga o servidor com recarga automática
- `index.html` carrega `src/main.jsx`, que renderiza o `App` dentro da `div#root`
- Três regras do JSX: um só elemento raiz (`<>...</>`), atributos em camelCase (`className`, `htmlFor`, `onClick`) e toda tag fecha (`<img />`)
- Chaves `{}` inserem qualquer **expressão**, um trecho que vira um valor, como `tarefas.length`; `if` e `for` soltos não entram

```jsx
<>
  <h1 className="titulo">Minhas Tarefas</h1>
  <p>{tarefas.length} tarefas cadastradas</p>
  <img src="/logo.png" alt="Logotipo" />
</>
```

---

## :icon[code-xml] JSX na prática

Com `nome` igual a `'Ana'` e `tarefas` com dois itens, o que cada linha mostra:

```jsx
<p>Olá, {nome}!</p>                                         // Olá, Ana!
<p>{tarefas.length} tarefas</p>                             // 2 tarefas
<p>{2 + 3} minutos</p>                                      // 5 minutos
<p>{tarefas.length > 0 ? 'Mãos à obra' : 'Tudo feito'}</p>  // Mãos à obra
<label htmlFor="titulo">Título</label>                      // Título
```

- Entre chaves, qualquer expressão: uma variável, uma conta, um ternário
- No lugar de um `if`, o ternário; no lugar de `for`, o `map`
- `htmlFor` e `className`: os nomes do JSX para `for` e `class`

---

## Componentes e props

O filho pode mudar uma prop que recebeu do pai?

---

## :icon[blocks] Componente é a peça, prop é o pedido

Um **componente** é uma peça de Lego: uma função com nome em **PascalCase** (cada palavra com maiúscula, `CartaoTarefa`) que devolve JSX. As **props** são o pedido que o pai faz à peça: chegam como atributos, num objeto, e o filho só lê.

- Um componente por arquivo em `src/components/`, com `export default`
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

## :icon[blocks] Componentes e props na prática

```jsx
function Selo({ texto, cor = 'cinza' }) {
  return <span className={cor}>{texto}</span>
}
function Caixa({ children }) {
  return <div className="caixa">{children}</div>
}

<Selo texto="Alta" cor="vermelho" />   // <span class="vermelho">Alta</span>
<Selo texto="Baixa" />                 // <span class="cinza">Baixa</span>
<Caixa><p>Oi</p></Caixa>               // <div class="caixa"><p>Oi</p></div>
```

- Sem a prop `cor`, vale o padrão `'cinza'`; sem padrão, viria `undefined`
- `children` é o que vai entre a abertura e o fechamento da tag
- `props.cor = 'azul'` dentro do `Selo` seria errado: o filho só lê

---

## Listas, keys e estilos

Por que a posição na fila é um crachá ruim?

---

## :icon[list] Uma lista, um crachá por item

O `map` do E09 é a linha de produção: cada tarefa entra e sai como um elemento JSX. Cada item leva uma **`key`** (chave), o crachá: única e estável. É o `id`, nunca a posição no array.

- `condicao && <JSX />` mostra ou nada; o ternário escolhe entre dois
- Cuidado com o zero: `{tarefas.length && ...}` mostra um `0` com a lista vazia. Escreva a condição completa: `=== 0` ou `> 0`
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

## :icon[list] Listas na prática

Com `tarefas` igual a Ler (id 1) e Correr (id 2):

```jsx
<ul>{tarefas.map((t) => <li key={t.id}>{t.titulo}</li>)}</ul>  // Ler, Correr
{tarefas.length === 0 && <p>Nenhuma tarefa</p>}             // nada: a lista tem 2
{[].length && <p>Você tem tarefas</p>}                      // 0, a armadilha do zero
{tarefas.length > 0 && <p>Você tem tarefas</p>}             // Você tem tarefas
```

- A `key` não aparece na tela: ela serve só para o React
- Com `key={i}`, ao remover Ler, o cartão de Correr ganharia o crachá 0, que era de Ler
- `[].length` vale `0`; o `&&` para nele e o React desenha o `0`

---

## Eventos e estado

Quando roda o `onClick={remover(id)}`: no clique ou ao desenhar?

---

## :icon[mouse-pointer-click] O placar que redesenha a tela

Um **evento** é a campainha: `onClick={contar}` combina o que fazer quando ela tocar. O **estado** é o placar do jogo: quando ele muda, a tela se redesenha.

- `onClick={contar}` passa a função; `onClick={contar()}` a chama ao desenhar
- Com argumento, embrulhe em uma arrow: `onClick={() => onRemover(id)}`
- **`useState`** devolve `[valor, setValor]`; só o `set` faz o React desenhar de novo, e o valor novo só existe na próxima renderização
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

## :icon[mouse-pointer-click] Eventos e estado na prática

| Linha | O que acontece |
|---|---|
| `<button onClick={contar}>` | conta a cada clique |
| `<button onClick={contar()}>` | roda ao desenhar; com `set` dentro, `Too many re-renders` |
| `<button onClick={() => remover(3)}>` | remove a tarefa 3, só no clique |
| `setTarefas([...tarefas, nova])` | a tela mostra a tarefa nova |
| `tarefas.push(nova); setTarefas(tarefas)` | a tela não muda: é o mesmo array |
| `setContador(contador + 1); console.log(contador)` | o console mostra o valor antigo |

Pergunta para cada linha da prova: entreguei a função ou chamei? Entreguei um array novo ou o mesmo?

---

## Formulários controlados

Por que um campo com `value` e sem `onChange` não aceita digitação?

---

## :icon[keyboard] O estado manda, o campo obedece

Um input **controlado** é o espelho do estado: mostra só o que está guardado nele, e cada tecla atualiza o estado.

- O par completo: `value={titulo}` e `onChange={(e) => setTitulo(e.target.value)}`
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

## :icon[keyboard] Formulários na prática

A pessoa digita Ler em cada campo:

| Campo | O que acontece |
|---|---|
| `<input value={titulo} onChange={(e) => setTitulo(e.target.value)} />` | aparece Ler, e `setTitulo('')` limpa o campo |
| `<input value={titulo} />` | nada aparece: o campo está travado |
| `<input onChange={(e) => setTitulo(e.target.value)} />` | aparece Ler, mas `setTitulo('')` não limpa o campo |

E no envio, com <kbd>Enter</kbd>:

| `enviar` tem | O que acontece |
|---|---|
| `event.preventDefault()` e a guarda do `trim()` | a tarefa entra; campo em branco é ignorado |
| nada disso | a página recarrega, e as tarefas em memória somem |

---

## Efeitos e fetch

Por que o npm run dev mostra duas requisições?

---

## :icon[cloud-download] useEffect: depois de desenhar, faça isto

O **`useEffect(função, dependências)`** é o bilhete "depois de desenhar a tela, faça isto". As dependências são a lista do "me avise se mudar":

- `[]`: uma vez, ao montar; sem array: toda renderização; `[pendentes]`: quando `pendentes` muda
- Todo valor que o efeito usa entra no array

:::center
![Diagrama: com o array vazio, React desenha, o efeito busca, setTarefas guarda e React desenha de novo, com uma busca só; sem o array, setTarefas volta para a renderização e as buscas não têm fim](images/e25-com-e-sem-array.svg)
:::

---

## :icon[cloud-download] Efeitos na prática

Com 6 tarefas pendentes depois que a API responde:

```jsx
useEffect(() => { document.title = `(${pendentes}) Minhas Tarefas` }, [])
// a aba fica presa em (0): o efeito rodou só ao montar, com a lista vazia

useEffect(() => { document.title = `(${pendentes}) Minhas Tarefas` }, [pendentes])
// a aba mostra (6) e acompanha cada tarefa concluída

useEffect(() => { iniciar() })
// sem array: busca, redesenha, busca de novo, sem parar
```

Ao ver um `useEffect`, olhe primeiro o fim: tem array? O que ele usa está dentro?

---

## :icon[route] Buscar dados num efeito

- A função do efeito não é `async`: crie uma função `async` dentro dela, com o `fetch` do E19, e chame
- `carregando` e `erro` com `try/catch/finally`: o `finally` desliga o "Carregando..." com ou sem erro
- A **limpeza** (`return () => controle.abort()`) desfaz o que o efeito fez, como apagar a luz ao sair: cancela o pedido que não serve mais
- No `npm run dev`, o StrictMode (modo rigoroso) monta duas vezes, como um treino de incêndio: duas requisições, a primeira cancelada

```jsx
useEffect(() => {
  async function iniciar() {
    const lista = await carregarTarefas()
    setTarefas(lista)
  }
  iniciar()
}, [])
```

---

## Hooks próprios

Dois componentes que chamam useTarefas() dividem a mesma lista?

---

## :icon[puzzle] Hooks próprios: receitas suas

Um **hook próprio** é uma receita sua, com nome começando por `use`, que leva outros hooks como ingredientes e devolve dados, não JSX.

- Regras: só no topo de componentes ou de hooks, nunca em `if`, `for`, evento ou depois de um `return`; o React conta os hooks pela ordem
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

## :icon[puzzle] Hooks próprios na prática

| Trecho | O que acontece |
|---|---|
| `useDebounce(busca, 300)` e "qui" digitado depressa | `buscaAtrasada` muda uma vez, e o `useTarefas` busca "qui" |
| o mesmo, sem o `return () => clearTimeout(temporizador)` | três buscas atrasadas: q, qu e qui |
| `useTarefas()` no `App` e de novo no `Resumo` | duas listas e duas requisições; uma não vê a outra |
| `if (busca !== '') useDebounce(busca)` | o lint acusa; na primeira letra, `Rendered more hooks than during the previous render` |

Hooks no topo, com `use` no nome; os `return` depois deles.

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
**b.** O `filter` mantém só as tarefas com `concluida` igual a `false`; o `map` cria um `<li>` para cada uma. A `key` serve só para o React identificar os itens e não aparece na página.
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
`cliques` é uma variável comum. Mudar o valor dela **não avisa o React**, então a tela não é redesenhada; e, se fosse, a função rodaria de novo e `cliques` voltaria a 0.

Só o **estado** faz o React renderizar de novo e lembrar o valor entre renderizações:

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
**b.** O comportamento padrão de um `<form>` é enviar os dados e recarregar a página. `preventDefault()` cancela esse padrão para que o React continue no controle. Sem ele, `enviar` até roda, mas a página recarrega em seguida e o estado volta ao inicial.
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
**b.** Cada letra muda `valor` e o efeito roda de novo. Antes, o React chama a limpeza da renderização anterior, que cancela o agendamento dela. Só o último `setTimeout` chega aos 300 ms, e o `useTarefas` faz uma busca só. Sem o `return () => clearTimeout(...)`, a resposta seria a.
:::

---

## :icon[triangle-alert] Erros que mais reprovam

:::warning
- Confundir **props** (vêm do pai, só leitura) com **estado** (vive no componente, muda com o `set`)
- Alterar o estado direto (`tarefas.push(nova)`, `contagem++`) e esperar que a tela mude
- Usar o índice do array como `key` ou esquecer a `key` no `map`
- Chamar a função no evento em vez de passá-la: `onClick={remover(id)}` roda ao desenhar, não no clique
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

## :icon[milestone] Projeto 4 · Etapa 5: detalhe e entrega

No seu repositório `livro-de-receitas`, a última etapa:

- `DetalheReceita`: a ficha, os ingredientes em `<ul>` e o modo de preparo em `<ol>`
- "Ver receita" no cartão e "Voltar para a lista", com um estado no `App`
- README com o que o app faz, como rodar e dois prints
- o link do repositório colado na página do projeto

Commit: `Projeto 4: etapa 5, detalhe da receita e README`. Prazo: **início do E26**. Enunciado completo e entrega: página do curso, em **Projetos**.

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
