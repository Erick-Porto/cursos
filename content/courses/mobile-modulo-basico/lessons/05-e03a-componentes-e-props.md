---
title: Componentes e props
summary: Componentes que recebem props, desestruturação, valores padrão e composição com children.
module: react
duration_minutes: 35
objectives:
  - Criar componentes que recebem props
  - Usar desestruturação e valores padrão
  - Compor componentes com children
---

# Componentes e props

Programador Mobile: Módulo Básico · Encontro E03 · Aula 5 de 18

---

## O que você vai aprender

:::goal
- Relembrar o que é um componente e como ele devolve JSX
- Passar informações para um componente com **props**
- Simplificar o código com desestruturação e valores padrão
- Encaixar conteúdo dentro de um componente com `children`
:::

---

## Três cartões iguais, três textos diferentes

No `minhas-tarefas`, você quer mostrar três tarefas. A primeira ideia é copiar e colar:

```jsx
<div className="cartao">
  <h3>Estudar React</h3>
  <p>Prioridade: alta</p>
</div>
<div className="cartao">
  <h3>Fazer compras</h3>
  <p>Prioridade: baixa</p>
</div>
<div className="cartao">
  <h3>Ir à academia</h3>
  <p>Prioridade: media</p>
</div>
```

Só o texto muda; a estrutura é idêntica.

:::question
E se forem 50 tarefas? E se o desenho do cartão precisar mudar, você corrige em 50 lugares?
:::

---

## :icon[component] Componente: uma função que devolve JSX

Você já criou `Cabecalho` e `Rodape`. O cartão pode seguir o mesmo caminho:

```jsx
function CartaoTarefa() {
  return (
    <div className="cartao">
      <h3>Estudar React</h3>
      <p>Prioridade: alta</p>
    </div>
  )
}
```

Uso: `<CartaoTarefa />`. Resolve a repetição da estrutura, mas cria outro problema: o texto está fixo. Toda chamada mostra "Estudar React".

Falta um jeito de dizer ao componente **o que** exibir.

---

## :icon[braces] Props: os parâmetros do componente

**Props** (de *properties*) são valores que você passa na tag, como atributos do HTML. O React junta todos em um objeto e entrega à função.

::::columns
:::col
Quem usa escreve na tag:

```jsx
<CartaoTarefa titulo="Estudar React" />
<CartaoTarefa titulo="Fazer compras" />
```
:::
:::col
O componente lê do objeto:

```jsx
function CartaoTarefa(props) {
  return <p>{props.titulo}</p>
}
```
:::
::::

O nome na tag (`titulo=`) é o mesmo nome dentro da função (`props.titulo`). Mesma função, dois textos diferentes na tela.

---

## O objeto props de perto

Cada atributo da tag vira uma chave do objeto `props`:

```jsx
<CartaoTarefa titulo="Estudar React" prioridade="alta" />
```

Dentro de `CartaoTarefa`, `props` vale:

```javascript
{ titulo: 'Estudar React', prioridade: 'alta' }
```

| Na tag | No objeto | Na tela |
|---|---|---|
| `titulo="Estudar React"` | `props.titulo` | Estudar React |
| `prioridade="alta"` | `props.prioridade` | alta |

:::tip
Pense em um pedido de lanchonete: a cozinha (função) é a mesma, o pedido (props) muda, e sai um lanche diferente (JSX) a cada vez.
:::

---

## Desestruturação: pegando as props pelo nome

Escrever `props.` em toda linha cansa. A **desestruturação** abre o objeto e cria uma variável para cada chave que você pedir:

```javascript
const tarefa = { titulo: 'Estudar React', prioridade: 'alta' }
const { titulo, prioridade } = tarefa
// titulo vale 'Estudar React'; prioridade vale 'alta'
```

No componente, isso acontece direto no parâmetro:

```jsx
function CartaoTarefa({ titulo, prioridade }) {
  return (
    <div className="cartao">
      <h3>{titulo}</h3>
      <p>Prioridade: {prioridade}</p>
    </div>
  )
}
```

As chaves `{ }` no parâmetro dizem: "deste objeto, quero `titulo` e `prioridade`".

---

## Props de vários tipos

Texto vai entre aspas. Qualquer outra coisa vai entre chaves, para o JSX saber que é JavaScript:

```jsx
<CartaoTarefa
  titulo="Estudar React"
  prioridade="alta"
  pontos={10}
  concluida={true}
/>
```

| Tipo | Como passar | O que chega |
|---|---|---|
| texto | `titulo="Estudar React"` | a string `'Estudar React'` |
| número | `pontos={10}` | o número `10` |
| booleano | `concluida={true}` | `true` |
| expressão | `pontos={5 * 2}` | o resultado, `10` |

:::warning
`pontos="10"` entrega o **texto** `"10"`, não o número. `pontos + 1` daria `"101"`.
:::

---

## Valores padrão

Nem toda prop precisa ser passada. Com um **valor padrão**, o componente funciona mesmo quando quem usa não informa:

```jsx
function CartaoTarefa({ titulo, prioridade = 'media' }) {
  return (
    <div className="cartao">
      <h3>{titulo}</h3>
      <p>Prioridade: {prioridade}</p>
    </div>
  )
}
```

```jsx
<CartaoTarefa titulo="Ler um livro" />
// Prioridade: media
<CartaoTarefa titulo="Entregar relatório" prioridade="alta" />
// Prioridade: alta
```

O padrão só entra quando a prop não é passada. Se quem usa escreve `prioridade="baixa"`, vale `baixa`.

---

## :icon[layers] children: o que vai dentro da tag

Tudo que fica entre a abertura e o fechamento de uma tag chega como uma prop especial, **children**:

```jsx
function Card({ children }) {
  return <div className="card">{children}</div>
}
```

```jsx
<Card>
  <h3>Estudar React</h3>
  <p>Prioridade: alta</p>
</Card>
```

`Card` não sabe o que vai receber: só desenha a moldura e coloca `children` dentro. O conteúdo é decidido por quem usa.

Serve para caixas, seções, modais: qualquer "moldura" que repete com recheios diferentes.

---

## :icon[lightbulb] Pense

:::question
Imagine um componente `Botao` reutilizável para o app inteiro: botão de salvar, de cancelar e de excluir.

- De quantas props ele precisa para cobrir esses três usos?
- O texto do botão deveria vir por uma prop `texto` ou por `children`?
- Alguma prop merece um valor padrão?
:::

:::info Uma resposta possível
Duas props bastam: o texto por `children` e uma `variante` com padrão `'primario'`. Poucas props bem escolhidas valem mais que muitas.
:::

---

## :icon[blocks] Composição: componente dentro de componente

Um componente pode usar outro no próprio JSX, como já usa `<h3>` e `<p>`:

```jsx
function ListaTarefas() {
  return (
    <section>
      <CartaoTarefa titulo="Estudar React" prioridade="alta" />
      <CartaoTarefa titulo="Fazer compras" prioridade="baixa" />
      <CartaoTarefa titulo="Ir à academia" />
    </section>
  )
}
```

O app vira uma árvore: `App` contém `Cabecalho`, `ListaTarefas` e `Rodape`. Os dados descem de pai para filho pelas props:

:::center
![Animação: ListaTarefas passa titulo e prioridade por props e cada valor desce até o seu CartaoTarefa; o terceiro, sem prioridade, usa o padrão media](images/e03-arvore-props.svg)
:::

---

## Props são somente leitura

:::warning
O componente **lê** as props; nunca as altera. Quem decide o valor é o pai.

```jsx
function CartaoTarefa(props) {
  props.titulo = 'Outro título' // erro: props é somente leitura
  return <h3>{props.titulo}</h3>
}
```
:::

Precisa de um valor derivado? Crie uma variável nova:

```jsx
function CartaoTarefa({ titulo }) {
  const tituloMaiusculo = titulo.toUpperCase()
  return <h3>{tituloMaiusculo}</h3>
}
```

Dados que mudam com o tempo (marcar uma tarefa como concluída) pedem **estado**, assunto do próximo encontro.

---

## :icon[file-code] Nomeação e organização

- **PascalCase**: `CartaoTarefa`, nunca `cartaoTarefa`. Tag em minúsculo é tratada como HTML, e `<cartaotarefa>` não existe no navegador
- Um componente por arquivo, com o mesmo nome do arquivo: `src/components/CartaoTarefa.jsx`
- `export default` no componente; `import` em quem usa

```jsx
// src/components/CartaoTarefa.jsx
export default function CartaoTarefa({ titulo, prioridade = 'media' }) {
  return <h3>{titulo}</h3>
}
```

```jsx
// src/App.jsx
import CartaoTarefa from './components/CartaoTarefa.jsx'
```

---

## :icon[triangle-alert] Erros comuns

:::warning
- Número ou booleano entre aspas: `pontos="10"` é texto; escreva `pontos={10}`
- Alterar uma prop dentro do componente: `props.titulo = ...` gera erro; crie uma variável nova
- Nome em minúsculo: `<cartaoTarefa />` não renderiza nada e o console avisa
- Nome diferente nos dois lados: `titulo="..."` na tag e `props.title` dentro; a tela fica vazia, sem erro
- Esquecer as chaves da desestruturação: `function CartaoTarefa(titulo)` recebe o objeto inteiro, não o texto
:::

---

## :icon[list-checks] Resumo

:::summary
- Um componente é uma função que recebe **props** e devolve JSX
- Props viajam na tag (`titulo="..."`) e chegam como um objeto; o que não é texto vai entre chaves
- Desestruturar (`{ titulo, prioridade }`) e definir padrões (`prioridade = 'media'`) deixa o código mais limpo
- `children` é o conteúdo entre a abertura e o fechamento da tag
- Props são somente leitura: quem usa o componente decide o valor
:::

---

## :icon[arrow-right] Próximos passos

Seu `CartaoTarefa` já recebe props, mas você ainda escreve uma tag para cada tarefa. Na próxima aula:

- :icon[list] Guardar as tarefas em um **array** e gerar os cartões com `.map()`
- :icon[key-round] Entender a `key` que o React pede em toda lista
- :icon[eye] Mostrar "Nenhuma tarefa por aqui" quando a lista estiver vazia
- :icon[layers] Estilizar o cartão com CSS Modules

No laboratório, você monta o `ListaTarefas` do `minhas-tarefas` com tudo isso.
