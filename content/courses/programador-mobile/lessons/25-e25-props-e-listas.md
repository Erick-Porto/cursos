---
title: Props e listas
summary: "Etapa 2 do Projeto 4: o CartaoReceita recebe props e as 8 receitas viram cartões com map e key."
module: react
duration_minutes: 90
objectives:
  - Fazer o pedido a um componente com props, entre aspas ou entre chaves
  - Receber as props no componente, desestruturadas no parâmetro
  - Gerar um cartão por receita com map
  - Dar a cada item da lista uma key única, o id
---

# Props e listas

Programador Mobile · Encontro E25 · Aula 25 de 45

---

## O que você vai aprender

:::goal
- Fazer o pedido a uma peça do React com **props**
- Saber quando o valor vai entre aspas e quando vai entre chaves
- Receber o pedido dentro do componente, desestruturado
- Transformar a lista de receitas em cartões com o `map`
- Dar a cada cartão um crachá único, a `key`
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **prop** | uma informação que você manda para um componente, escrita na tag; de *property*, propriedade |
| **pai** e **filho** | o pai é o componente que usa a peça; o filho é a peça usada. O `App` é o pai do `CartaoReceita` |
| **desestruturar** | tirar de uma ficha os campos que você vai usar, cada um numa caixa, como no E13 |
| **`map`** | a linha de produção do E14: cada item da lista entra e sai transformado |
| **`key`** | o crachá de cada item de uma lista no React: único, para o React saber quem é quem |

---

## Oito receitas, um cartão

No fim do E24, a tela mostra um cartão só: o da pizza, com tudo escrito à mão dentro do `CartaoReceita`. O kit traz **8 receitas** prontas, em `src/data/receitas.js`.

| Hoje | No fim do encontro |
|---|---|
| 1 cartão, o da pizza | 8 cartões, um por receita |
| o texto fixo dentro do cartão | o cartão recebe as informações de quem o usa |
| "Feito por Seu nome aqui" | o seu nome no rodapé |

Copiar o cartão oito vezes dá oito arquivos quase iguais. Se o desenho mudar, você conserta oito vezes.

:::question
De um cartão para outro, o que muda? E o que fica igual?
:::

---

## Props

Na lanchonete, a chapa é a mesma para todos. Como cada lanche sai do jeito que o cliente pediu?

---

## :icon[sliders-horizontal] Props: o pedido feito à peça

No E24, você escreveu `<Etiqueta dificuldade="Easy" />`, e a etiqueta mostrou "Fácil". Esse `dificuldade="Easy"` é uma **prop**: uma informação que o componente **pai** manda para a peça, escrita na tag como um atributo. É o pedido feito à peça: o pai diz como quer cada uma.

Cada peça do kit traz o seu manual no topo do arquivo. O do `Rodape.jsx`:

```jsx
// Props:
//   autor  (opcional) o seu nome, um texto. Sem ela, aparece "Seu nome aqui".
//
// Uso: <Rodape autor="Ana Souza" />
```

| A tag, no `App` | Na tela |
|---|---|
| `<Rodape />` | Feito por Seu nome aqui no curso Programador Mobile. |
| `<Rodape autor="Ana Souza" />` | Feito por Ana Souza no curso Programador Mobile. |

O nome da prop, `autor`, vem do manual. O valor é o seu pedido.

---

## :icon[sliders-horizontal] Props na prática

**Caso 1: a mesma peça, três pedidos.** A `Etiqueta` traduz e pinta conforme a prop:

| A tag | Na tela |
|---|---|
| `<Etiqueta dificuldade="Easy" />` | Fácil, em verde |
| `<Etiqueta dificuldade="Medium" />` | Média, em amarelo |
| `<Etiqueta dificuldade="Hard" />` | Difícil, em vermelho |

**Caso 2: o pedido segue o manual.** O manual da `Etiqueta` diz: `'Easy'`, `'Medium'` ou `'Hard'`. Um valor fora da lista aparece como veio, sem cor:

| A tag | Na tela |
|---|---|
| `<Etiqueta dificuldade="Fácil" />` | Fácil, sem cor |
| `<Etiqueta dificuldade="easy" />` | easy, sem cor |

Como na aula 3, texto só é igual letra por letra, maiúsculas incluídas: `'easy'` não é `'Easy'`.

---

## :icon[milestone] Projeto 4 · Passo 1: o seu nome no rodapé

O `livro-de-receitas` continua do ponto em que o E24 parou.

:::steps
1. No VS Code, abra a pasta `livro-de-receitas` e rode `npm run dev` no terminal
2. Abra `http://localhost:5173` no navegador
3. Em `src/App.jsx`, troque `<Rodape />` por `<Rodape autor="Seu Nome" />`, com o seu nome entre as aspas
4. Salve com <kbd>Ctrl</kbd> + <kbd>S</kbd> e olhe o fim da página: ela muda sem o F5, como no E24
:::

```jsx
      <Rodape autor="Ana Souza" />
```

**Pronto quando:** o rodapé mostra "Feito por", o seu nome e "no curso Programador Mobile.", e o Console (F12) não tem mensagem vermelha.

---

## Desestruturar as props

Na farmácia, a atendente pega a sua ficha. Ela lê todos os campos ou só os que precisa?

---

## :icon[contact] Desestruturar as props

Do lado da peça, o React junta as props da tag numa **ficha**, o objeto do E13, e entrega ao componente como o **parâmetro** da função (E07). Com `<CartaoReceita nome="Brigadeiro" minutos={30} />`, a ficha que chega é `{ nome: 'Brigadeiro', minutos: 30 }`.

**Desestruturar** é tirar da ficha os campos que você vai usar, cada um numa caixa com o mesmo nome. No parâmetro, as chaves fazem isso:

```jsx
function CartaoReceita({ nome, minutos }) {
  return <h2 className="cartao__nome">{nome}, {minutos} minutos</h2>
}
```

Na tela: "Brigadeiro, 30 minutos". Em voz alta: "da ficha que chegar, quero o `nome` e os `minutos`". É a desestruturação do E13, `const { nome, minutos } = props`, escrita direto no parâmetro.

---

## :icon[contact] Desestruturar na prática

**Caso 1: ver a ficha que chegou.** Sem as chaves, o parâmetro recebe a ficha inteira. Um `console.log` mostra o pedido que o pai fez:

```jsx
function CartaoReceita(props) {
  console.log(props)
  return <h2 className="cartao__nome">{props.nome}</h2>
}
```

No Console (F12): `{nome: 'Brigadeiro', minutos: 30}`. Serve para conferir uma prop que não chegou.

**Caso 2: a prop dentro de um atributo.** A prop entra no lugar de qualquer valor, entre chaves:

```jsx
<img className="cartao__foto" src={foto} alt={nome} />
```

O `src` recebe o endereço que chegou em `foto`. O `alt`, o texto que aparece quando a foto não carrega, recebe o nome da receita.

---

## :icon[database] As receitas do kit

O `src/data/receitas.js` exporta, com nome, a lista `receitas`: 8 fichas no formato da API do E27, com campos em inglês.

| Campo | Na pizza | O que é |
|---|---|---|
| `name` | `'Pizza margherita'` | o nome |
| `image` | `'https://cdn.dummyjson.com/recipe-images/1.webp'` | a foto |
| `cuisine` | `'Italiana'` | a cozinha |
| `difficulty` | `'Easy'` | a dificuldade |
| `prepTimeMinutes`, `cookTimeMinutes` | `20`, `15` | minutos de preparo e de fogo |
| `servings`, `rating` | `4`, `4.6` | porções e nota, de 0 a 5 |

No `App`, o `import` leva chaves, como todo `export` nomeado (E16): `import { receitas } from './data/receitas.js'`. A pizza é a `receitas[0]`; o brigadeiro, a oitava receita, é a `receitas[7]`.

---

## :icon[braces] Aspas ou chaves

O valor de uma prop vai **entre aspas** quando é um texto pronto. Vai **entre chaves** quando é JavaScript: um número, uma conta, um campo de uma ficha. São as chaves do E24, as do `{preparo + cozimento}`.

| A prop | O que chega | Na tela |
|---|---|---|
| `autor="Ana Souza"` | o texto Ana Souza | Ana Souza |
| `minutos={20 + 10}` | o número 30, já somado | 30 |
| `minutos="20 + 10"` | o texto, letra por letra | 20 + 10 |
| `nome={receitas[7].name}` | o campo `name` da oitava receita | Brigadeiro |
| `nome="receitas[7].name"` | o texto, letra por letra | receitas[7].name |

Entre aspas, o React não lê nada: copia o texto como está.

---

## :icon[milestone] Projeto 4 · Passo 2: o cartão recebe props

Em `src/components/CartaoReceita.jsx`, troque o começo do arquivo, do `import` até a `const nota`. O cartão passa a receber cinco props, desestruturadas no parâmetro, uma por linha:

```jsx
import Etiqueta from './Etiqueta.jsx'

function CartaoReceita({
  nome,
  foto,
  cozinha,
  minutos,
  dificuldade,
}) {
  const porcoes = 4
  const nota = 4.6
```

- As constantes `preparo` e `cozimento` saem: o tempo total chega pronto, na prop `minutos`
- `porcoes` e `nota` ficam fixas, por enquanto
- A vírgula depois de `dificuldade` pode ficar: no JavaScript, ela é permitida. No JSON da aula 3, não

---

## :icon[milestone] Projeto 4 · Passo 2: o cartão usa as props

Troque o `return` inteiro: cada texto fixo vira a prop que traz a informação. A `<img>` agora cabe numa linha:

```jsx
  return (
    <article className="cartao">
      <img className="cartao__foto" src={foto} alt={nome} />
      <div className="cartao__corpo">
        <h2 className="cartao__nome">{nome}</h2>
        <p className="cartao__info">{cozinha}, {minutos} minutos</p>
        <p className="cartao__info">{porcoes} porções, nota {nota}</p>
        <div className="cartao__rodape">
          <Etiqueta dificuldade={dificuldade} />
        </div>
      </div>
    </article>
  )
}
```

O `export default CartaoReceita` continua no fim. Salve: o cartão fica sem foto, sem nome e sem etiqueta, com ", minutos" no lugar do tempo. Ele espera o pedido, que vem do `App`.

---

## :icon[milestone] Projeto 4 · Passo 2: dois pedidos no App

Em `src/App.jsx`, depois dos outros `import`, a linha nova:

```jsx
import { receitas } from './data/receitas.js'
```

Dentro da `<div className="grade">`, no lugar do `<CartaoReceita />`, dois pedidos: a pizza, `receitas[0]`, e o brigadeiro, `receitas[7]`.

```jsx
<CartaoReceita
  nome={receitas[0].name}
  foto={receitas[0].image}
  cozinha={receitas[0].cuisine}
  minutos={receitas[0].prepTimeMinutes + receitas[0].cookTimeMinutes}
  dificuldade={receitas[0].difficulty}
/>
<CartaoReceita
  nome={receitas[7].name}
  foto={receitas[7].image}
  cozinha={receitas[7].cuisine}
  minutos={receitas[7].prepTimeMinutes + receitas[7].cookTimeMinutes}
  dificuldade={receitas[7].difficulty}
/>
```

**Pronto quando:** dois cartões diferentes saem do mesmo componente: "Pizza margherita, Italiana, 35 minutos" e "Brigadeiro, Brasileira, 30 minutos", os dois com a etiqueta "Fácil". O brigadeiro ainda diz "4 porções, nota 4.6".

---

## :icon[list-ordered] O passo 2 em português

| Linha | O que ela diz |
|---|---|
| `function CartaoReceita({ nome, foto, cozinha, minutos, dificuldade })` | "da ficha que chegar, quero o `nome`, a `foto`..." |
| `src={foto}` | "o endereço da foto é o que chegou em `foto`" |
| `{cozinha}, {minutos} minutos` | "a cozinha, uma vírgula, os minutos e a palavra minutos" |
| `dificuldade={dificuldade}` | "peça à `Etiqueta` a dificuldade que chegou": o cartão é o pai dela |
| `nome={receitas[0].name}` | "a prop `nome` recebe o campo `name` da primeira receita" |

Com muitas props, a tag ocupa várias linhas, uma prop por linha. O nome da prop é o mesmo nos dois lados: `nome=` na tag, `nome` no parâmetro.

---

## Listas com map

Numa linha de produção, o que entra e o que sai?

---

## :icon[factory] map: entra receita, sai cartão

O **`map`** é a linha de produção do E14: cada item da lista entra e sai transformado, na mesma quantidade. Em JavaScript, `receitas.map((receita) => receita.name)` devolve os 8 nomes. No React, a linha de produção pode devolver JSX: entra uma receita, sai um cartão.

```jsx
<div className="grade">
  {receitas.map((receita) => (
    <CartaoReceita
      nome={receita.name}
      foto={receita.image}
      cozinha={receita.cuisine}
      minutos={receita.prepTimeMinutes + receita.cookTimeMinutes}
      dificuldade={receita.difficulty}
    />
  ))}
</div>
```

- As chaves em volta do `map` são as do E24: abrem o JavaScript no meio do JSX
- `(receita) => ( ... )` é a seta do E07 que devolve direto. Os parênteses agrupam o JSX de várias linhas, como no `return ( ... )`
- O React desenha a lista que sai, um cartão atrás do outro. Falta só o crachá de cada um

---

## :icon[factory] map, item por item

A cada volta, `receita` é a receita da vez, e o `map` pede um cartão com os campos dela:

| Volta | `receita` | Sai |
|---|---|---|
| 1 | Pizza margherita | o cartão da pizza, 35 minutos, Fácil |
| 2 | Cookies com gotas de chocolate | o dos cookies, 25 minutos, Fácil |
| 3 | Fettuccine Alfredo com frango | o do fettuccine, 35 minutos, Média |
| 4 a 7 | salada, biryani, lámen, moussaka | mais quatro cartões |
| 8 | Brigadeiro | o do brigadeiro, 30 minutos, Fácil |

- 8 receitas entram, 8 cartões saem, na ordem da lista
- O `receitas[0]` dos pedidos à mão vira `receita`: uma tag serve para as oito

---

## :icon[factory] map na prática

No Node, como no E14, a linha de produção trabalhando com as receitas do kit, num arquivo `.js` na pasta do projeto.

**Caso 1: os nomes, para o índice do livro.**

```javascript
import { receitas } from './src/data/receitas.js'

const nomes = receitas.map((receita) => receita.name)
console.log(nomes)
```

```plaintext
[
  'Pizza margherita',
  'Cookies com gotas de chocolate',
  'Fettuccine Alfredo com frango',
  'Salada caprese',
  'Biryani de frango',
  'Lámen japonês',
  'Moussaka grega',
  'Brigadeiro'
]
```

**Caso 2: o tempo total de cada uma**, a conta do cartão, no mesmo arquivo:

```javascript
console.log(receitas.map((receita) => receita.prepTimeMinutes + receita.cookTimeMinutes))
```

```plaintext
[
  35, 25, 35, 10,
  75, 45, 90, 30
]
```

Com a lista vazia, `[]`, o `map` devolve `[]`: nenhum cartão.

---

## A key

Num evento com cem pessoas, como a organização sabe quem é quem?

---

## :icon[id-card] key: o crachá de cada item

Em toda lista que o `map` desenha, o React pede uma prop especial, a **`key`** (chave, em inglês): o crachá de cada item, único. É por ele que o React reconhece quem é quem quando a lista muda.

Um parágrafo por receita, com crachá:

```jsx
{receitas.map((receita) => (
  <p key={receita.id}>{receita.name}</p>
))}
```

- Use o campo **`id`**, o número único de cada receita (1, 3, 4, 9, 11, 16, 19 e 35): ele não muda
- A `key` vai na tag que o `map` devolve: aqui o `<p>`; no projeto, o `<CartaoReceita>`
- Ela é só para o React: o cartão não a recebe como prop
- Sem `key`, a lista aparece, mas o Console avisa: `Each child in a list should have a unique "key" prop.`

---

## :icon[id-card] key na prática

O aviso aparece no Console (F12) e no terminal do `npm run dev`, com `[vite] (client) [console.error]` na frente.

| A `key` do `<CartaoReceita>` | O Console diz |
|---|---|
| nenhuma | `Each child in a list should have a unique "key" prop.` |
| `key={receita.cuisine}` | `Encountered two children with the same key`, com o nome repetido: `Italiana` |
| `key={receita.id}` | nada: 8 crachás diferentes |

- **Crachá repetido:** três receitas são italianas. A cozinha não identifica uma receita; o `id`, sim
- **Crachá no lugar errado:** a `key` no `<article>`, dentro do cartão, não conta. O aviso continua, porque o React confere o crachá na tag que o `map` devolve

---

## :icon[milestone] Projeto 4 · Passo 3: a lista com map

No `App.jsx`, os dois pedidos à mão saem. No lugar deles, dentro da mesma `<div className="grade">`, o `map` faz um pedido por receita, com o crachá:

```jsx
{receitas.map((receita) => (
  <CartaoReceita
    key={receita.id}
    nome={receita.name}
    foto={receita.image}
    cozinha={receita.cuisine}
    minutos={receita.prepTimeMinutes + receita.cookTimeMinutes}
    dificuldade={receita.difficulty}
  />
))}
```

Teste o crachá: apague a linha da `key`, salve e leia o aviso no Console. Depois, ponha a linha de volta.

**Pronto quando:** 8 cartões, em 3 colunas no computador e em 1 no celular; a moussaka com a etiqueta vermelha "Difícil"; o fettuccine, o biryani e o lámen com a amarela "Média"; e o Console sem o aviso de `key`. Todos ainda dizem "4 porções, nota 4.6".

---

## :icon[milestone] Projeto 4 · Sua vez: porções e nota de cada receita

Agora, sozinho. Os 8 cartões mostram "4 porções, nota 4.6", que são da pizza. O brigadeiro não serve 4 pessoas.

Transforme `porcoes` e `nota` em props do cartão e, no `map`, passe as porções e a nota de cada receita.

:::tip Dicas
- O nome da prop precisa ser igual nos dois lados: na tag, no `App`, e na lista do parâmetro, no cartão
- As porções estão no campo `servings`, e a nota, no `rating`
:::

**Pronto quando:** o brigadeiro mostra "Brasileira, 30 minutos" e "8 porções, nota 4.2"; os cookies, "24 porções, nota 4.9"; o biryani, "6 porções, nota 5"; e o Console continua sem mensagem vermelha e sem aviso.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `nota is not defined` | `{nota}` no cartão, sem `nota` no parâmetro | `nota,` no parâmetro |
| `Objects are not valid as a React child` | o parâmetro sem as chaves | `CartaoReceita({` e `})` |
| `does not provide an export named 'default'` | o `import` sem as chaves | `import { receitas }` |
| `receitas is not defined` | faltou o `import` | `import { receitas }` |
| `unique "key" prop` | sem `key`, ou ela dentro do cartão | `key={receita.id}` no `map` |

Nos quatro primeiros, a tela fica branca. Todos aparecem no Console (F12) e no terminal do `npm run dev`.

---

## :icon[circle-help] Erros sem mensagem

Estes não escrevem nada no Console. A pista é a tela:

| O que aparece | Quer dizer | O que fazer |
|---|---|---|
| nenhum cartão, Console limpo | o `map` com chaves `{ }` no lugar dos parênteses, sem `return` | `(receita) => ( ... )` |
| o cartão diz "receita.name" | a prop foi entre aspas | entre chaves: `nome={receita.name}` |
| " porções, nota 4.2", sem o número | nomes diferentes nos dois lados, como `porcao` e `porcoes` | o mesmo nome na tag e no parâmetro |
| no lugar da foto, só o nome | `src="foto"`, entre aspas, ou o computador sem internet | `src={foto}`; as fotos vêm da DummyJSON |

---

## :icon[milestone] Projeto 4 · Etapa 2 pronta

- 8 cartões, cada um com a foto, o nome, a cozinha, os minutos, as porções, a nota e a etiqueta da sua receita
- O `CartaoReceita` recebe 7 props, desestruturadas no parâmetro: `nome`, `foto`, `cozinha`, `minutos`, `dificuldade`, `porcoes` e `nota`
- O `App` gera os cartões com `receitas.map`, com `key={receita.id}`
- O seu nome no rodapé, e o Console sem aviso

Num segundo terminal do VS Code (o primeiro está ocupado com o `npm run dev`):

```bash
git add .
git commit -m "Projeto 4: etapa 2, cartão com props e lista"
git push
```

Faltou alguma coisa? Termine em casa, antes do E26: a etapa 3 começa deste ponto.

---

## Resumo

:::summary
- Uma prop é o pedido feito à peça: o pai escreve na tag, como em `<Rodape autor="Ana Souza" />`
- Texto pronto vai entre aspas; número, conta e campo de ficha vão entre chaves
- A peça recebe as props numa ficha, e as chaves no parâmetro desestruturam: `function CartaoReceita({ nome, foto })`
- O nome da prop é o mesmo nos dois lados, na tag e no parâmetro
- `receitas.map((receita) => ( ... ))` faz um cartão por receita: 8 entram, 8 saem
- A `key` é o crachá de cada item: `key={receita.id}`, na tag que o `map` devolve
:::

---

## :icon[arrow-right] Próximos passos

No E26, os cartões passam a responder ao que a pessoa faz, com **estado** e **eventos**:

- :icon[search] um campo de busca, que filtra os cartões a cada letra digitada
- :icon[heart] o seu segundo componente, o `BotaoFavorito`
- :icon[refresh-cw] a tela que se redesenha sozinha quando um valor muda
- :icon[hash] o cabeçalho contando as favoritas
