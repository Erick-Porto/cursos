---
title: Componentes e props
summary: Componentes que recebem props, desestruturação, valores padrão, children e repasse de props com spread.
module: react
duration_minutes: 35
objectives:
  - Criar componentes que recebem props
  - Ler props com desestruturação e valores padrão
  - Compor componentes com children
  - Repassar props com rest e spread
---

# Componentes e props

Programador Mobile · Encontro E22 · Aula 43 de 89

---

## O que você vai aprender

:::goal
- Passar informações para um componente com **props**
- Ler as props com a desestruturação do E09b e dar valores padrão a elas
- Encaixar conteúdo dentro de um componente com `children`
- Repassar props com rest e spread, sem nunca alterá-las
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

No E21, você criou `Cabecalho` e `Rodape`. O cartão pode seguir o mesmo caminho:

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

Uso: `<CartaoTarefa />`. Resolve a repetição da estrutura, mas o texto está fixo: toda chamada mostra "Estudar React".

No E07b, uma regra repetida virou uma função com **parâmetros**. Falta exatamente isso ao componente: um jeito de dizer **o que** exibir.

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

Com `console.log(props)` antes do `return`, o console do navegador mostra:

```javascript
{ titulo: 'Estudar React', prioridade: 'alta' }
```

| Na tag | No objeto | Na tela |
|---|---|---|
| `titulo="Estudar React"` | `props.titulo` | Estudar React |
| `prioridade="alta"` | `props.prioridade` | alta |
| (não passou) | `props.pontos` é `undefined` | nada |

:::tip
Pense em um pedido de lanchonete: a cozinha (função) é a mesma, o pedido (props) muda, e sai um lanche diferente (JSX) a cada vez.
:::

---

## :icon[variable] Desestruturação no parâmetro

Você conhece este formato do E09b: `function linhaDoItem({ nome, qtd })` tirava do objeto só os campos que usava. Props são um objeto, então funciona igual:

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

A tela não muda; some o `props.` de cada linha. Daqui em diante, todo componente do curso recebe props assim, e a assinatura já diz o que ele espera.

---

## Props de vários tipos

Texto vai entre aspas. Qualquer outra coisa vai entre chaves, a janela para o JavaScript do E21:

| Tipo | Como passar | O que chega |
|---|---|---|
| texto | `titulo="Estudar React"` | `'Estudar React'` |
| número | `pontos={10}` | `10` |
| booleano | `concluida={true}` ou só `concluida` | `true` |
| array | `etiquetas={['estudo', 'react']}` | o array |
| objeto | `autor={{ nome: 'Ana' }}` | o objeto |
| expressão | `pontos={5 * 2}` | `10` |

No objeto, as chaves de fora abrem o JavaScript e as de dentro são o objeto literal do E08b.

:::warning
`pontos="10"` entrega o **texto** `'10'`, não o número. `pontos + 1` vira a concatenação do E05a: `'101'`.
:::

---

## :icon[sliders-horizontal] Valores padrão

É o padrão na desestruturação do E09b (`{ qtd = 1 }`), agora no componente:

```jsx
function CartaoTarefa({ titulo, prioridade = 'media' }) {
  return <p>{titulo}: prioridade {prioridade}</p>
}
```

Como nos parâmetros padrão do E07b, ele só entra quando a prop **não chega** (`undefined`):

| Tag | `prioridade` vale |
|---|---|
| `<CartaoTarefa titulo="Ler um livro" />` | `'media'` |
| `<CartaoTarefa titulo="Ler" prioridade="alta" />` | `'alta'` |
| `<CartaoTarefa titulo="Ler" prioridade={undefined} />` | `'media'` |
| `<CartaoTarefa titulo="Ler" prioridade={null} />` | `null`: nada aparece depois de "prioridade" |

`null` é um valor: quem passa `null` desliga o padrão.

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

## :icon[package] Rest e spread nas props

O `Botao` ainda precisa aceitar `type`, `disabled` e, no E23, o clique. Em vez de listar um por um, junte o que sobra com o rest do E09b e espalhe na tag com spread:

```jsx
function Botao({ variante = 'primario', children, ...resto }) {
  return (
    <button className={`botao ${variante}`} {...resto}>
      {children}
    </button>
  )
}

<Botao type="submit" disabled>Salvar</Botao>
// resto: { type: 'submit', disabled: true }
```

O spread também passa um objeto inteiro: `<CartaoTarefa {...tarefa} />` vale o mesmo que escrever uma prop para cada chave de `tarefa`. Use com cuidado: o componente recebe tudo, até o que não pediu.

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
![Animação: ListaTarefas passa titulo e prioridade por props e cada valor desce até o seu CartaoTarefa; o terceiro, sem prioridade, usa o padrão media](images/e22-arvore-props.svg)
:::

---

## :icon[snowflake] Props são somente leitura

O componente **lê** as props; nunca as altera. Quem decide o valor é o pai. Em desenvolvimento, o React congela as props como o `Object.freeze` do E11b, e a atribuição lança erro:

```jsx
function CartaoTarefa(props) {
  props.titulo = 'Outro título' // TypeError: Cannot assign to read only property
  return <h3>{props.titulo}</h3>
}
```

Precisa de um valor derivado? Crie uma variável nova:

```jsx
function CartaoTarefa({ titulo }) {
  const tituloMaiusculo = titulo.toUpperCase()
  return <h3>{tituloMaiusculo}</h3>
}
```

É a função pura do E07b: mesmas props, mesmo JSX. Dados que mudam com o tempo (marcar uma tarefa como concluída) pedem **estado**, assunto do E23.

---

## :icon[file-code] Nomeação e organização

- **PascalCase**: `CartaoTarefa`, nunca `cartaoTarefa`. Tag em minúsculo é tratada como HTML, e `<cartaotarefa>` não existe no navegador
- Um componente por arquivo, com o mesmo nome do arquivo: `src/components/CartaoTarefa.jsx`
- O `export default` do E11a: a coisa principal do arquivo, importada sem chaves

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
- Número ou booleano entre aspas: `pontos="10"` é texto e `concluida="false"` é uma string truthy; use chaves
- Alterar uma prop dentro do componente: `props.titulo = ...` gera erro; crie uma variável nova
- Nome diferente nos dois lados: `titulo="..."` na tag e `props.title` dentro; a tela fica vazia, sem erro
- Esquecer as chaves da desestruturação: `function CartaoTarefa(titulo)` recebe o objeto inteiro, não o texto
- Passar `null` esperando o valor padrão: o padrão só cobre `undefined`
:::

---

## :icon[list-checks] Resumo

:::summary
- Um componente é uma função que recebe **props** e devolve JSX
- Props viajam na tag (`titulo="..."`) e chegam como um objeto; o que não é texto vai entre chaves
- Desestruturar (`{ titulo, prioridade }`) e dar padrões (`prioridade = 'media'`) deixa a assinatura clara
- `children` é o conteúdo entre a abertura e o fechamento da tag; `...resto` repassa o que sobrou
- Props são somente leitura: quem usa o componente decide o valor
:::

---

## :icon[arrow-right] Próximos passos

Seu `CartaoTarefa` já recebe props, mas você ainda escreve uma tag para cada tarefa. Na próxima aula:

- :icon[list] Guardar as tarefas em um array e gerar os cartões com o `map` do E09a
- :icon[key-round] Entender a `key` que o React pede em toda lista
- :icon[eye] Mostrar "Nenhuma tarefa por aqui" quando a lista estiver vazia
- :icon[file-code] Estilizar o cartão com CSS Modules

No laboratório, você monta o `ListaTarefas` do `minhas-tarefas` com tudo isso.
