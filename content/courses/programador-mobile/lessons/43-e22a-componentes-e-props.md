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
- Ler as props com a desestruturação do E09 e dar valores padrão a elas
- Encaixar conteúdo dentro de um componente com `children`
- Repassar props com rest e spread, sem nunca alterá-las
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **props** | de *properties*, propriedades: as informações que o pai passa a um componente, na tag |
| **desestruturação** | tirar de um objeto só os campos que você quer, cada um numa variável, como no E09 |
| **valor padrão** | o valor que entra quando a prop não chega |
| **children** | do inglês, "filhos": o conteúdo entre a abertura e o fechamento da tag |
| **composição** | montar um componente usando outros dentro dele |
| **somente leitura** | dá para ler, mas não para mudar |

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

## Componentes

Uma peça de Lego que só vem numa cor serve para qualquer montagem?

---

## :icon[component] Componente: uma função que devolve JSX

Um **componente** é uma peça de Lego: pequena, reaproveitável, encaixa em outras. No código, é uma função que devolve JSX. No E21, você criou `Cabecalho` e `Rodape`. O cartão pode virar uma peça também:

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

Para usar, escreva a peça como tag: `<CartaoTarefa />`.

---

## :icon[component] Componentes na prática

A mesma peça, três vezes:

```jsx
<CartaoTarefa />
<CartaoTarefa />
<CartaoTarefa />
```

Na tela, três cartões iguais, os três com "Estudar React". A estrutura se repete sem copiar e colar, mas o texto está preso dentro da função.

No E07, uma regra repetida virou uma função com **parâmetros**, o espaço do ingrediente na receita. Falta exatamente isso ao componente: um jeito de dizer **o que** cada cartão mostra.

---

## Props

O mesmo cartão, três textos: como avisar a cada um o que mostrar?

---

## :icon[braces] Props: os parâmetros do componente

**Props** (de *properties*, propriedades) são as informações que você passa para um componente, escritas na tag como atributos do HTML. São o pedido feito à peça: o pai diz como quer cada uma. O React junta todas num objeto e entrega à função.

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

## :icon[braces] Props na prática

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

---

## :icon[variable] Desestruturação no parâmetro

Props são um objeto, a ficha de cadastro do E08: cada campo tem nome e valor. **Desestruturar** é tirar do objeto só os campos que você usa. No E09, o `aplicarFiltros(lista, { categoria, ordem = 'nome' })` fazia isso no parâmetro. No componente, funciona igual:

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

No objeto, as chaves de fora abrem o JavaScript, e as de dentro são o objeto do E08.

:::warning
`pontos="10"` entrega o **texto** `'10'`, não o número. `pontos + 1` vira a concatenação do E05: `'101'`.
:::

---

## Valores padrão

Num cadastro, que país já vem marcado quando você não escolhe nenhum?

---

## :icon[sliders-horizontal] Valores padrão

Um **valor padrão** é o que entra quando a prop não chega. É o padrão da desestruturação do E09 (`{ qtd = 1 }`), agora no componente:

```jsx
function CartaoTarefa({ titulo, prioridade = 'media' }) {
  return <p>{titulo}: prioridade {prioridade}</p>
}
```

Como nos parâmetros padrão do E07, ele só entra quando a prop **não chega**, isto é, quando ela vale `undefined`.

---

## :icon[sliders-horizontal] Valores padrão na prática

O mesmo `CartaoTarefa`, com `prioridade = 'media'`, em quatro tags:

| Tag | `prioridade` vale |
|---|---|
| `<CartaoTarefa titulo="Ler um livro" />` | `'media'` |
| `<CartaoTarefa titulo="Ler" prioridade="alta" />` | `'alta'` |
| `<CartaoTarefa titulo="Ler" prioridade={undefined} />` | `'media'` |
| `<CartaoTarefa titulo="Ler" prioridade={null} />` | `null`: nada aparece depois de "prioridade" |

`null` é um valor: quem passa `null` desliga o padrão.

---

## children

Numa loja de molduras, a moldura muda conforme a foto?

---

## :icon[layers] children: o que vai dentro da tag

**children** (do inglês, "filhos") é uma prop especial: tudo o que fica entre a abertura e o fechamento da tag. Pense numa moldura: ela é sempre a mesma, e a foto de dentro muda.

```jsx
function Card({ children }) {
  return <div className="card">{children}</div>
}
```

`Card` não sabe o que vai receber: só desenha a moldura e coloca `children` dentro. O conteúdo é decidido por quem usa.

---

## :icon[layers] children na prática

A mesma moldura, dois recheios:

```jsx
<Card>
  <h3>Estudar React</h3>
  <p>Prioridade: alta</p>
</Card>

<Card>
  <p>Nenhuma tarefa por aqui</p>
</Card>
```

No HTML da página, aba Elements:

```html
<div class="card"><h3>Estudar React</h3><p>Prioridade: alta</p></div>
<div class="card"><p>Nenhuma tarefa por aqui</p></div>
```

Serve para caixas, seções, modais: qualquer moldura que se repete com recheios diferentes.

---

## :icon[lightbulb] Pense

:::question
Imagine um componente `Botao` reutilizável para o app inteiro: botão de salvar, de cancelar e de excluir.

- De quantas props ele precisa para cobrir esses três usos?
- O texto do botão deveria vir por uma prop `texto` ou por `children`?
- Alguma prop merece um valor padrão?
:::

:::tip Resposta
Duas props resolvem: o texto por `children` e uma `variante` com padrão `'primario'`. Poucas props bem escolhidas valem mais que muitas.
:::

---

## Rest e spread

No E09, o que os três pontinhos faziam com um objeto?

---

## :icon[package] Rest e spread nas props

Os três pontinhos do E09 servem também nas props:

- o **rest** (`...resto`, no parâmetro) **junta** numa variável as props que sobraram
- o **spread** (`{...resto}`, na tag) **espalha** essas props de volta

O `Botao` ainda precisa aceitar `type`, `disabled` e, no E23, o clique. Em vez de listar um por um:

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

---

## :icon[package] Rest e spread na prática

O mesmo `Botao`, em três usos:

| Uso | `resto` vale | O `<button>` recebe |
|---|---|---|
| `<Botao type="submit" disabled>Salvar</Botao>` | `{ type: 'submit', disabled: true }` | `type="submit"`, `disabled` e a classe `botao primario` |
| `<Botao variante="perigo" type="button">Excluir</Botao>` | `{ type: 'button' }` | `type="button"` e a classe `botao perigo` |
| `<Botao>Cancelar</Botao>` | `{}` | só a classe `botao primario` |

O spread também passa um objeto inteiro: `<CartaoTarefa {...tarefa} />` vale o mesmo que escrever uma prop para cada chave de `tarefa`. Use com cuidado: o componente recebe tudo, até o que não pediu.

---

## Composição

Como peças de Lego viram um carrinho inteiro?

---

## :icon[blocks] Composição: componente dentro de componente

**Composição** é montar um componente com outros dentro dele, como peças de Lego encaixadas. Um componente pode usar outro no próprio JSX, como já usa `<h3>` e `<p>`:

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

O app vira uma árvore: `App` contém `Cabecalho`, `ListaTarefas` e `Rodape`.

---

## :icon[blocks] Composição na prática

Os dados descem de pai para filho pelas props:

:::center
![Animação: ListaTarefas passa titulo e prioridade por props e cada valor desce até o seu CartaoTarefa; o terceiro, sem prioridade, usa o padrão media](images/e22-arvore-props.svg)
:::

Na tela, três cartões: "Estudar React" com prioridade alta, "Fazer compras" com baixa e "Ir à academia" com media, o valor padrão. O `ListaTarefas` decide o que cada cartão mostra; o `CartaoTarefa` só desenha.

---

## Somente leitura

Recebeu um documento original: você rasura ou tira uma cópia?

---

## :icon[snowflake] Props são somente leitura

O componente **lê** as props; nunca as muda. Quem decide o valor é o pai. As props são o original: dá para ler, não para rasurar. Em desenvolvimento, o React congela as props, como o `Object.freeze` do E11, e a atribuição lança erro:

```jsx
function CartaoTarefa(props) {
  props.titulo = 'Outro título' // TypeError: Cannot assign to read only property
  return <h3>{props.titulo}</h3>
}
```

Dados que mudam com o tempo, como marcar uma tarefa como concluída, pedem **estado**, assunto do E23.

---

## :icon[snowflake] Somente leitura na prática

Precisa de um valor diferente? Tire a sua cópia: crie uma variável nova a partir da prop.

```jsx
function CartaoTarefa({ titulo }) {
  const tituloMaiusculo = titulo.toUpperCase()
  return <h3>{tituloMaiusculo}</h3>
}
```

| Tag | Na tela |
|---|---|
| `<CartaoTarefa titulo="Estudar React" />` | ESTUDAR REACT |
| `<CartaoTarefa titulo="Fazer compras" />` | FAZER COMPRAS |

A prop `titulo` continua igual; só a variável nova mudou. É a função pura do E07: mesmas props, mesmo JSX.

---

## :icon[file-code] Nomeação e organização

- **PascalCase**: cada palavra com inicial maiúscula, tudo junto, como `CartaoTarefa`, nunca `cartaoTarefa`. Tag em minúsculo é tratada como HTML, e `<cartaotarefa>` não existe no navegador
- Um componente por arquivo, com o mesmo nome do arquivo: `src/components/CartaoTarefa.jsx`
- O `export default` do E11: a coisa principal do arquivo, importada sem chaves

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

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Cannot assign to read only property` e a tela em branco | o componente mudou uma prop | criar uma variável nova |
| `101` onde devia ser `11` | número entre aspas: `pontos="10"` é texto | chaves: `pontos={10}` |
| `<h3>` vazio, sem mensagem | nomes diferentes (`titulo=` na tag, `props.title` dentro) ou faltaram as chaves: `CartaoTarefa(titulo)` recebe o objeto inteiro | `console.log(props)` e comparar com a tag |
| nada depois de "prioridade" | a tag passou `null`, e o padrão só cobre `undefined` | não passar a prop |

E um sem sinal nenhum: `concluida="false"` é um texto, e texto com letras é truthy. Use `concluida={false}`.

---

## :icon[list-checks] Resumo

:::summary
- Um componente é uma peça: uma função que recebe **props** e devolve JSX
- Props viajam na tag (`titulo="..."`) e chegam como um objeto; o que não é texto vai entre chaves
- Desestruturar (`{ titulo, prioridade }`) e dar padrões (`prioridade = 'media'`) deixa a assinatura clara
- `children` é o conteúdo entre a abertura e o fechamento da tag; `...resto` repassa o que sobrou
- Props são somente leitura: quem usa o componente decide o valor
:::

---

## :icon[arrow-right] Próximos passos

Seu `CartaoTarefa` já recebe props, mas você ainda escreve uma tag para cada tarefa. Na próxima aula:

- :icon[list] Guardar as tarefas num array e gerar os cartões com o `map` do E09
- :icon[key-round] Entender a `key` que o React pede em toda lista
- :icon[eye] Mostrar "Nenhuma tarefa por aqui" quando a lista estiver vazia
- :icon[file-code] Estilizar o cartão com CSS Modules

No laboratório, você monta o `ListaTarefas` do `minhas-tarefas` com tudo isso.
