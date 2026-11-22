---
title: Revisão de React
summary: Do E24 ao E27 lendo código do Livro de receitas, os erros mais comuns, a Prova 2 e a entrega do Projeto 4.
module: react
duration_minutes: 90
objectives:
  - Ler um componente React e dizer o que aparece na tela e no Console
  - Achar o engano num código com JSX, props, map, estado ou efeito
  - Saber como é a Prova 2 e o que ela cobra
  - Conferir o Livro de receitas antes de entregar o Projeto 4
---

# Revisão de React

Programador Mobile · Encontro E28 · Aula 28 de 45

---

## O que você vai revisar

:::goal
- Componente, JSX e chaves, do E24
- Props, `map` e `key`, do E25
- Estado, eventos e o campo controlado, do E26
- O efeito que busca a API, com carregando e erro, do E27
- Como é a Prova 2 e o que conferir antes de entregar o Projeto 4
:::

Hoje não tem palavra nova: o encontro é para ler código. Na última hora, a Prova 2.

---

## :icon[map] O mapa da unidade

Em quatro encontros, o JavaScript que você já sabia virou tela.

| Encontro | Você aprendeu | O Livro de receitas ganhou |
|---|---|---|
| E24 | componente, JSX, chaves, `import`, o Vite | o kit rodando e o cartão fixo da pizza |
| E25 | props, `map` e `key` | 8 cartões e o seu nome no rodapé |
| E26 | eventos, `useState`, campo controlado, função como prop | a busca, o `BotaoFavorito` e o total de favoritas |
| E27 | `useEffect`, `fetch` no efeito, carregando e erro | as 30 receitas da API e o README |

A Prova 2 cobre as quatro linhas, com o código do Livro de receitas.

---

## Componente e JSX

Uma peça de Lego serve em quantos brinquedos diferentes?

---

## :icon[component] A peça de Lego e as regras do JSX

Um **componente** é uma peça de Lego: pequena, reaproveitável, encaixa em outras. No código, é uma **função** com nome em maiúscula que devolve tela em **JSX**, as tags do HTML dentro do JavaScript.

| Ideia | Como se escreve |
|---|---|
| usar a peça | `<CartaoReceita />`, como uma tag |
| as três regras | `className`; toda tag fecha (`<img ... />`); um pai, como `<article>` ou `<>...</>` |
| as chaves | `{preparo + cozimento}` é calculado; sem chaves, o texto fica como está |
| a vitrine | `export default CartaoReceita` e, no `App`, `import CartaoReceita from './components/CartaoReceita.jsx'` |
| o Vite | `npm run dev` serve em `http://localhost:5173`; salvou, a página muda |

---

## :icon[code-xml] Leia o código: as chaves

:::example O que aparece na tela?
```jsx
function CartaoBolo() {
  const nome = 'Bolo de cenoura'
  const preparo = 15
  const forno = 40

  return (
    <article className="cartao">
      <h2 className="cartao__nome">{nome.toUpperCase()}</h2>
      <p className="cartao__info">{preparo + forno} minutos</p>
      <p className="cartao__info">preparo + forno minutos</p>
    </article>
  )
}
```
:::

:::tip Resposta
`BOLO DE CENOURA`, `55 minutos` e `preparo + forno minutos`. Entre chaves, o JavaScript é calculado: o `toUpperCase` do E09 e a soma. A última linha esqueceu as chaves, e o React mostra o texto como está, sem erro nenhum.
:::

---

## :icon[code-xml] Leia o código: as regras do JSX

:::example O que está errado? São três enganos.
```jsx
function Aviso() {
  return (
    <h2 class="cartao__nome">Lave as mãos</h2>
    <img src="maos.webp" alt="Mãos com sabão">
  )
}
```
:::

:::tip Resposta
1. Duas tags soltas, sem pai. A tela de erro do Vite diz `Adjacent JSX elements must be wrapped in an enclosing tag.`
2. A `<img>` não fecha. Com o pai no lugar, a tela de erro diz `Expected corresponding JSX closing tag for 'img'.`
3. `class` no lugar de `className`. A página funciona, mas o Console avisa ``Invalid DOM property `class`. Did you mean `className`?``

O conserto: uma `<div>` em volta das duas tags, `className="cartao__nome"` e `<img src="maos.webp" alt="Mãos com sabão" />`.
:::

---

## :icon[notebook-pen] Exercícios: Componente e JSX

:::example Exercícios
1. Complete a foto da padaria: `<img src="pao.webp" alt="Pão francês" ___`
2. O `App.jsx` está em `src/`, e o `Placa.jsx`, em `src/components/`. Qual caminho serve no `import`: `'./Placa.jsx'` ou `'./components/Placa.jsx'`?
3. O que aparece na tela?

   ```jsx
   function placa() {
     return <p>Aberto até as 22h</p>
   }

   function App() {
     return <placa />
   }
   ```

4. Escreva o componente `Placa`, que mostra `Fechado para almoço` num `<p>`, e a linha que o põe na vitrine
:::

:::tip Respostas
1. `/>`: no JSX, toda tag fecha
2. `'./components/Placa.jsx'`: o `./` parte da pasta do `App.jsx`. O outro dá `Failed to resolve import`
3. Nada: com minúscula, o React procura uma tag do HTML `placa`. O Console avisa `The tag <placa> is unrecognized`
4. `function Placa() { return <p>Fechado para almoço</p> }` e, no fim, `export default Placa`
:::

---

## Props e listas

Oito pedidos, uma chapa só. Quem diz como cada lanche sai?

---

## :icon[sliders-horizontal] O pedido, a linha de produção e o crachá

Uma **prop** é o pedido feito à peça: o pai escreve na tag, e o filho recebe. Texto pronto vai entre aspas; número, conta e campo de ficha vão entre chaves.

```jsx
<Rodape autor="Ana Souza" />

{receitas.map((receita) => (
  <CartaoReceita key={receita.id} nome={receita.name} />
))}
```

- O filho recebe as props numa ficha e **desestrutura** no parâmetro: `function CartaoReceita({ nome })`. O nome é o mesmo nos dois lados
- O **`map`** é a linha de produção: entra uma receita, sai um cartão, na mesma quantidade e na ordem da lista
- A **`key`** é o crachá de cada item: `key={receita.id}`, único, na tag que o `map` devolve. O cartão não recebe a `key`

---

## :icon[factory] Leia o código: aspas e map

:::example O que aparece na tela?
```jsx
function Linha({ nome, porcoes }) {
  return <p>{nome}: {porcoes} porções</p>
}

const pratos = [
  { id: 7, nome: 'Feijoada', porcoes: 6 },
  { id: 2, nome: 'Moqueca', porcoes: 4 },
]

// no return do App, dentro de uma <div>:
{pratos.map((prato) => (
  <Linha key={prato.id} nome={prato.nome} porcoes="prato.porcoes" />
))}
```
:::

:::tip Resposta
Dois parágrafos, na ordem da lista: `Feijoada: prato.porcoes porções` e `Moqueca: prato.porcoes porções`. O `nome` foi entre chaves, e o React leu o campo. As `porcoes` foram entre aspas, e o React copiou o texto letra por letra. Com `porcoes={prato.porcoes}`, aparecem `Feijoada: 6 porções` e `Moqueca: 4 porções`.
:::

---

## :icon[id-card] Leia o código: nomes e key

:::example O que está errado? São dois enganos.
Os cartões aparecem sem o número dos minutos, e o Console avisa `Each child in a list should have a unique "key" prop.`

```jsx
function CartaoReceita({ nome, cozinha, minutos }) {
  return (
    <article key={nome} className="cartao">
      <h2 className="cartao__nome">{nome}</h2>
      <p className="cartao__info">{cozinha}, {minutos} minutos</p>
    </article>
  )
}
```

```jsx
{receitas.map((receita) => (
  <CartaoReceita
    nome={receita.name}
    cozinha={receita.cuisine}
    tempo={receita.prepTimeMinutes + receita.cookTimeMinutes}
  />
))}
```
:::

:::tip Resposta
1. O `App` pede `tempo=`, e o cartão espera `minutos`. O valor some sem erro: o cartão da pizza mostra "Italiana, minutos". O nome da prop é o mesmo nos dois lados
2. A `key` está no `<article>`, dentro do cartão. O React confere o crachá na tag que o `map` devolve: `<CartaoReceita key={receita.id} ...>`
:::

---

## :icon[notebook-pen] Exercícios: Props e listas

:::example Exercícios
1. Escreva a tag que pede à `Ficha` o nome `Bia` e a idade 20, em número
2. O que aparece na tela com `<Ficha nome="Caio" idade={17 + 1} />`?

   ```jsx
   function Ficha(props) {
     return <p>{props.nome}, {props.idade} anos</p>
   }
   ```

3. Duas alunas da academia se chamam Bia. Qual crachá: `key={aluno.nome}` ou `key={aluno.matricula}`?
4. Nenhum aluno aparece, e o Console está limpo. O que está errado?

   ```jsx
   {alunos.map((aluno) => {
     <li key={aluno.matricula}>{aluno.nome}</li>
   })}
   ```
:::

:::tip Respostas
1. `<Ficha nome="Bia" idade={20} />`: texto pronto entre aspas, número entre chaves
2. `Caio, 18 anos`: sem chaves no parâmetro, a ficha chega inteira, e a conta já vem feita
3. `aluno.matricula`: o nome repete o crachá, e o Console avisa `Encountered two children with the same key`
4. Com chaves, a seta precisa de `return`; com parênteses, devolve o `<li>` direto
:::

---

## Estado e eventos

Saiu gol. Quem muda o placar, e como o telão fica sabendo?

---

## :icon[refresh-cw] O placar e o que a pessoa faz

O **estado** é o placar do jogo: quando muda, a tela se redesenha. A variável comum também muda, mas o React não fica sabendo.

| Ideia | Como se escreve |
|---|---|
| o evento | `onClick={avisar}`: a função, sem parênteses |
| o placar | `const [gols, setGols] = useState(0)`: o `set` troca, e o React redesenha |
| o campo controlado | `value` e `onChange` com `evento.target.value`: o estado manda, o campo obedece |
| a lista da tela | `visiveis` sai do `filter` a cada desenho: não é estado |
| o pai guarda, o filho avisa | a função vai como prop: `aoClicar={aoFavoritar}` |
| lista no estado | sempre nova: `[...favoritas, id]`, nunca `push` |

---

## :icon[refresh-cw] Leia o código: o forno

:::example O que aparece na tela?
A pessoa clica em **Ligar** e, depois, duas vezes em **Mais quente**. O que mostram o primeiro botão e o parágrafo?

```jsx
function Forno() {
  const [ligado, setLigado] = useState(false)
  const [graus, setGraus] = useState(180)

  return (
    <>
      <button onClick={() => setLigado(!ligado)}>
        {ligado ? 'Desligar' : 'Ligar'}
      </button>
      <button onClick={() => setGraus(graus + 20)}>Mais quente</button>
      <p>Forno {ligado ? 'ligado' : 'desligado'}, {graus} graus</p>
    </>
  )
}
```
:::

:::tip Resposta
O botão mostra `Desligar`, e o parágrafo, `Forno ligado, 220 graus`. Cada clique chama um `set`, e o React redesenha com o valor novo: `!ligado` vira `true`, e os graus vão de 180 a 200 e a 220. Mais um clique no primeiro botão mostra `Ligar` e `Forno desligado, 220 graus`: cada placar muda sozinho.
:::

---

## :icon[copy] Leia o código: o clique que não marca

:::example O que está errado?
No Livro de receitas, o clique em **Favoritar** chama `alternarFavorita(receita.id)`. A pessoa clica, e nada muda. O Console não mostra erro.

```jsx
const [favoritas, setFavoritas] = useState([])

function alternarFavorita(id) {
  favoritas.push(id)
  setFavoritas(favoritas)
}
```
:::

:::tip Resposta
O `push` rasura a lista velha, e o `set` recebe **a mesma** lista, no mesmo endereço (E15). O React compara, acha igual e não redesenha: o botão continua "Favoritar", e o cabeçalho, "Nenhuma favorita". A lista no estado é sempre uma lista nova, com o spread do E15: `setFavoritas([...favoritas, id])` tira uma cópia e mexe na cópia, sem rasurar o original.
:::

---

## :icon[notebook-pen] Exercícios: Estado e eventos

:::example Exercícios
1. Complete o botão do jogo: `<button ___={() => setPontos(pontos + 1)}>+1</button>`
2. A pessoa digita `Oi, mãe`. O que o parágrafo mostra?

   ```jsx
   const [recado, setRecado] = useState('')

   <input value={recado} onChange={(evento) => setRecado(evento.target.value)} />
   <p>{recado.length} de 20 letras</p>
   ```

3. Sem o `onChange` no `<input>`, o que acontece quando a pessoa digita?
4. Escreva o `onClick` que põe `'arroz'` no fim da lista `compras`, guardada num estado
:::

:::tip Respostas
1. `onClick`, com C maiúsculo
2. `7 de 20 letras`: cada letra troca o estado, e o React redesenha
3. O campo fica vazio: ele mostra o estado, e ninguém troca o estado. O Console avisa ``without an `onChange` handler``
4. `onClick={() => setCompras([...compras, 'arroz'])}`: uma lista nova, sem `push`
:::

---

## Efeitos e API

Primeiro a porta abre, depois a luz acende. No app, o que vem primeiro?

---

## :icon[zap] Depois de desenhar a tela, faça isto

O **`useEffect`** é o bilhete "depois de desenhar a tela, faça isto"; com o `[]` no fim, roda uma vez só. O **`fetch`** é o garçom: leva o pedido à API e traz o JSON.

| No Livro de receitas | Por quê |
|---|---|
| a `async function carregarReceitas` dentro do efeito | o efeito não pode ser `async` |
| `setReceitas(dados.recipes)` | a lista está dentro de `dados` |
| `carregando` começa `true` | ao abrir, já está buscando |
| `setCarregando(false)` no `finally` | o `finally` roda sempre |
| `if (!resposta.ok)` com `throw` | o 404 não cai no `catch` sozinho |
| carregando, erro, vazia, grade | vale o primeiro caminho que dá sim |

---

## :icon[zap] Leia o código: desenho e efeito

:::example O que o Console mostra, em ordem? E a tela?
```jsx
function Aviso() {
  const [texto, setTexto] = useState('Buscando...')
  console.log('desenho:', texto)

  useEffect(() => {
    console.log('efeito')
    setTexto('Pronto')
  }, [])

  return <p>{texto}</p>
}
```
:::

:::tip Resposta
O Console mostra `desenho: Buscando...`, `efeito` e `desenho: Pronto`; a tela, `Pronto`.

1. O React desenha primeiro, com o valor inicial do estado
2. Depois de desenhar, roda o efeito, que troca o estado com `setTexto`
3. O estado mudou: o React desenha de novo. Com o `[]`, o efeito não roda nesse segundo desenho

É o caminho das receitas no `App`: desenha vazio, o efeito busca, a resposta vai para o estado, desenha com os cartões.
:::

---

## :icon[cloud-download] Leia o código: a tela branca

:::example O que está errado? São dois enganos.
O Console mostra `useEffect must not return anything besides a function, which is used for clean-up.` Quando a resposta chega, a tela fica branca com `receitas.filter is not a function`.

```jsx
useEffect(async () => {
  const resposta = await fetch('https://dummyjson.com/recipes')
  const dados = await resposta.json()
  setReceitas(dados)
  setCarregando(false)
}, [])
```
:::

:::tip Resposta
1. A função do efeito é `async`, e toda função `async` devolve uma Promise, a senha da lanchonete do E21. O React quer um efeito que não devolva nada: a `async function carregarReceitas` mora **dentro** do efeito e é chamada logo abaixo, com `carregarReceitas()`
2. `dados` é o objeto inteiro, e o objeto não tem `filter`. A lista está dentro dele: `setReceitas(dados.recipes)`
:::

---

## :icon[notebook-pen] Exercícios: Efeitos e API

:::example Exercícios
1. Escreva o estado `carregando` do app do clima, que já abre buscando
2. O app pede a temperatura ao abrir. O pedido vai no corpo do componente ou num `useEffect` com `[]`?
3. O Console mostra `resposta.json is not a function`. O que falta?

   ```jsx
   async function carregarAlunos() {
     const resposta = fetch('https://dummyjson.com/users')
     const dados = await resposta.json()
     setAlunos(dados.users)
   }
   ```

4. O que `contarAlunos()` mostra sem internet? E com a API no ar?

   ```javascript
   async function contarAlunos() {
     try {
       await fetch('https://dummyjson.com/users')
       console.log('A')
     } catch (falha) {
       console.log('B')
     } finally {
       console.log('C')
     }
   }
   ```
:::

:::tip Respostas
1. `const [carregando, setCarregando] = useState(true)`
2. No efeito com `[]`: no corpo, o pedido sairia a cada desenho, e cada resposta pediria outro
3. O `await` antes do `fetch`: sem ele, `resposta` guarda a senha, e não a resposta
4. Sem internet, `B` e `C`. Com a API no ar, `A` e `C`: o `finally` roda sempre
:::

---

## :icon[siren] Os erros que mais apareceram

| O engano | O que aparece | O conserto |
|---|---|---|
| a conta sem chaves | o texto `preparo + cozimento` | `{preparo + cozimento}` |
| a prop com outro nome no filho | o valor some | o mesmo nome |
| a `key` faltando ou no `<article>` | `unique "key" prop` | `key={receita.id}` no `map` |
| `onClick={aoClicar()}` | os botões disparam sozinhos | `onClick={aoClicar}` |
| `push` na lista do estado | o clique não muda nada | `[...favoritas, id]` |
| `setCarregando(false)` só no `try` | sem internet, carregando para sempre | no `finally` |

Sem mensagem no Console: a conta sem chaves, o nome diferente e o `push`. A pista é a tela.

---

## :icon[clipboard-check] Como é a Prova 2

| Item | Como é |
|---|---|
| questões | 20, do E24 ao E27, embaralhadas para cada pessoa |
| tempo | 60 minutos: o cronômetro começa no **Começar** e, no zero, envia sozinho |
| tentativas | uma; ela só conta quando você clica em **Enviar** |
| consulta | nenhuma: só a aba da prova aberta, sem slides, sem VS Code, celular guardado |
| nota mínima | 70 |
| gabarito | não aparece ao enviar: você vê a nota e se foi aprovado |

Os tipos de questão: escolha única, múltipla escolha (marque todas as certas), verdadeiro ou falso e lacuna (a palavra exata, como no código).

---

## :icon[book-open] O que estudar para a prova

Mais da metade das questões traz um código para ler: o que aparece na tela, o que o Console mostra ou o que está errado.

:::steps
1. Leia o código linha por linha antes de olhar as alternativas
2. Procure primeiro os enganos mais comuns: as chaves, o nome das props, a `key`, os parênteses no `onClick`, o `push`, o `[]` e o `finally`
3. Repare nas palavras que mudam a resposta: **não**, **sempre**, **uma vez**, **primeiro**
4. Na múltipla escolha, julgue cada alternativa sozinha
:::

Para estudar: as aulas do E24 ao E27, os quatro quizzes e o `App.jsx`, o `CartaoReceita` e o `BotaoFavorito` do seu Livro de receitas.

---

## :icon[milestone] Projeto 4 · Antes de entregar

Com o `npm run dev` ligado e o DevTools aberto, faça o caminho da correção:

- :icon[check] ao abrir, "Carregando receitas..." e 30 cartões; na aba Rede, **um** pedido a `recipes`
- :icon[search] `chicken` e `CHICKEN` mostram 5; `xyz`, a `ListaVazia`
- :icon[heart] duas favoritas, "2 favoritas"; desmarcar uma, "1 favorita"; a marca sobrevive à busca
- :icon[wifi] sem internet, F5 mostra "Não foi possível carregar as receitas."
- :icon[file-text] o README com o seu texto, o print e o seu nome, sem os trechos "Etapa 4"
- :icon[git-commit-horizontal] no GitHub, o commit do kit, os quatro das etapas e nenhum `node_modules`

Na correção, o instrutor pode pedir que você explique o `alternarFavorita` ou o efeito que busca a API.

---

## :icon[milestone] Projeto 4 · Como entregar

A etapa 4 ainda sem commit? Num segundo terminal do VS Code:

```bash
git add .
git commit -m "Projeto 4: etapa 4, receitas da API e README"
git push
```

Um ajuste depois desse commit vai num commit novo, com uma mensagem que diz o que mudou, como `Projeto 4: print no README`.

:::steps
1. No GitHub, abra o repositório `livro-de-receitas` e confira se o print aparece no README
2. Na página do curso, em **Projetos**, abra o Projeto 4 e cole o link do repositório, e não o do seu perfil
3. Até a correção, você pode trocar o link
:::

**Prazo: início do E29.** O instrutor pode devolver o projeto para ajustes, com um comentário por critério: corrija, faça um commit e envie de novo pela mesma página.

---

## Resumo

:::summary
- Um componente é uma função que devolve JSX; as chaves calculam, e sem elas o texto aparece como está
- A prop é o pedido feito à peça: aspas para texto pronto, chaves para JavaScript, o mesmo nome nos dois lados
- O `map` faz um cartão por receita, cada um com o seu crachá, `key={receita.id}`
- O estado é o placar: o `set` troca o valor e o React redesenha; a lista no estado é sempre uma lista nova
- O `useEffect` com `[]` busca depois do primeiro desenho; o `finally` desliga o carregando, com falha ou sem falha
- A Prova 2 tem 20 questões, 60 minutos, uma tentativa e nota mínima 70
:::

---

## :icon[arrow-right] Próximos passos

No E29, o React vai para o celular:

- :icon[smartphone] o **React Native** e o **Expo**: o app abre no seu celular, pelo Expo Go
- :icon[component] as ideias desta unidade, com outras peças, como `View` e `Text`
- :icon[milestone] começa o Projeto 5, o Gota

Traga o celular carregado. O Projeto 4 entra até o início do E29.
