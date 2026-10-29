---
title: Por que React
summary: O problema de atualizar a tela na mão, o jeito declarativo do React e os componentes que formam uma tela.
module: react
duration_minutes: 40
objectives:
  - Explicar o problema que o React resolve
  - Diferenciar código declarativo de imperativo
  - Identificar componentes em uma tela
---

# Por que React

Programador Mobile · Encontro E21 · Aula 41 de 89

---

## O que você vai aprender

:::goal
- Por que atualizar a tela "na mão" com JavaScript vira um problema
- A diferença entre código **imperativo** e **declarativo**
- O que é um componente e como enxergá-los em qualquer tela
- Onde o React, o Vite e o JavaScript que você já sabe se encaixam
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **DOM** | a página montada na memória do navegador, a partir do HTML; é nela que o JavaScript mexe |
| **React** | uma biblioteca, código pronto, que desenha a tela a partir dos dados |
| **imperativo** | código que diz **como** fazer, passo a passo |
| **declarativo** | código que diz **o que** você quer e deixa os passos com outro |
| **componente** | uma peça da tela, com nome, que se reaproveita em vários lugares |
| **SPA** | um site que carrega uma vez e troca de tela sem recarregar a página |

---

## Por que isso importa

Até o E20, o resultado do seu código era uma linha no terminal: o `console.log` imprimia e pronto. Uma tela é diferente: ela fica à vista e muda a cada clique.

Pense na tela de uma lista de tarefas. Quando você adiciona uma tarefa:

- um item novo entra na lista
- o contador "2 pendentes" vira "3 pendentes"
- a mensagem "nenhuma tarefa" precisa sumir

A mesma informação aparece em três lugares. Esqueça um deles, e a tela mente para o usuário.

:::question
Quem garante que tudo isso muda junto, a cada clique, num app com dezenas de telas?
:::

---

## O DOM

Se você muda um móvel de lugar, a planta da casa muda junto?

---

## :icon[code-xml] O DOM: a página na memória

Quando abre uma página, o navegador lê o HTML e monta uma cópia dela na memória: o **DOM**. Pense numa casa: o HTML é a planta, e o DOM é a casa montada a partir dela. O JavaScript muda os móveis de lugar; a planta continua igual.

Cada tag vira um **elemento**, um dentro do outro, como os galhos de uma árvore. Foi essa cópia que você editou na aba Elements, no E01.

Para mexer num elemento, o JavaScript faz duas coisas:

- **procura** o elemento: `document.querySelector('#total')`, "o elemento com id `total`"
- **muda** o elemento: `.textContent = 99` troca o texto dele

A tela muda na hora; o arquivo HTML, não.

---

## :icon[code-xml] O DOM na prática

No Console do DevTools, com o [contador](materiais/e21/aluno/contador.html) aberto:

```javascript
document.title
// 'Contador em JavaScript puro · E21': o título da aba

document.querySelector('#total').textContent
// '0': o texto que está na tela

document.querySelector('#total').textContent = 99
// a tela passa a mostrar 99
```

Aperte <kbd>F5</kbd>: o número volta a 0. Você mudou a casa montada, não a planta.

---

## :icon[code] Um contador em JavaScript puro

Um contador de cliques, sem React. O HTML tem o número e o botão:

```html
<p>Cliques: <span id="total">0</span></p>
<button id="botao">Clicar</button>
```

O JavaScript liga os dois:

```javascript
let total = 0
const span = document.querySelector('#total')
const botao = document.querySelector('#botao')

botao.addEventListener('click', () => {
  total = total + 1
  span.textContent = total
})
```

**Acompanhe**: [abra o contador em outra aba](materiais/e21/aluno/contador.html), teste e repita a demonstração.

---

## :icon[list-ordered] O contador em português

| Linha | O que ela diz |
|---|---|
| `let total = 0` | "uma caixa `total`, que começa em 0 e pode mudar" |
| `document.querySelector('#total')` | "procure na página o elemento com id `total`"; o `#` é o mesmo do CSS |
| `botao.addEventListener('click', () => {...})` | "a cada clique no botão, rode esta função": um **callback**, como no E10 |
| `total = total + 1` | "some 1 ao número guardado" |
| `span.textContent = total` | "escreva o número novo na tela" |

São duas atualizações por clique: a variável e a tela. Esqueça a segunda, e o número fica parado, sem nenhum erro.

---

## O problema cresce com a tela

No contador, cada clique pede duas atualizações: a variável `total` e o texto na tela. Numa tela real, são muitas mais:

| Ação do usuário | O que você atualiza na mão |
|---|---|
| Adicionar tarefa | Inserir o `<li>`, somar no contador, esconder "nenhuma tarefa" |
| Concluir tarefa | Riscar o item, subtrair do contador |
| Remover tarefa | Tirar o `<li>`, subtrair do contador, talvez mostrar "nenhuma tarefa" |

Os dados vivem num lugar, e a tela, em outro. Manter os dois em dia é trabalho seu, a cada ação. É aí que nasce a maioria dos bugs de tela.

---

## :icon[milestone] Você já fez isso na mão: o Projeto 3

A sua `lista-de-tarefas`, entregue hoje, mudava a tela pelo DOM. A cada ação, o código de `src/tela/` precisava lembrar de tudo:

- concluir: riscar o item e refazer o resumo
- remover: tirar o `<li>` e, se a lista esvaziou, mostrar o aviso
- importar da API: "Carregando...", a lista nova ou o aviso de erro

:::question
Abra o seu `src/tela/`. Quantas linhas existem só para a tela não ficar diferente dos dados?
:::

No Projeto 4, você descreve a lista a partir do array, e o React cuida dessas linhas.

---

## React

No estádio, quem troca o número do placar eletrônico quando sai um gol?

---

## :icon[component] React: a tela a partir dos dados

O **React** é uma biblioteca: código pronto, instalado com o npm, que desenha a tela a partir dos dados. Pense num placar eletrônico: muda o número, e o painel se redesenha sozinho. Ninguém troca placa na mão.

Como usar, em uma ideia: você escreve como a tela fica para cada valor, e o React cuida do resto.

- No JavaScript puro: mude o `total` **e** escreva o número no `span`
- No React: mude o `total`; a tela que mostra `Cliques: {total}` se redesenha sozinha

As chaves `{total}` põem o valor da variável dentro da tela.

---

## :icon[component] React na prática: o mesmo contador

```jsx
import { useState } from 'react'

function Contador() {
  const [total, setTotal] = useState(0)
  return (
    <button onClick={() => setTotal(total + 1)}>
      Cliques: {total}
    </button>
  )
}
```

Clique três vezes: o botão mostra `Cliques: 1`, `Cliques: 2`, `Cliques: 3`. Nenhuma linha procura o `span` nem troca texto: quando `total` muda, o React redesenha o botão.

---

## :icon[list-ordered] O contador em React, em português

| Linha | O que ela diz |
|---|---|
| `import { useState } from 'react'` | "traga o `useState` do pacote `react`" (E11) |
| `function Contador()` | um componente: uma função que devolve um pedaço de tela |
| `const [total, setTotal] = useState(0)` | "guarde um valor que muda, começando em 0": `total` é o valor, e `setTotal`, a função que o troca |
| `onClick={() => setTotal(total + 1)}` | "a cada clique, troque o total pelo total mais 1" |
| `Cliques: {total}` | "mostre aqui o valor de `total`" |

Os dois nomes entre colchetes são a desestruturação de array do E09. Hoje é só para ler: o `useState` volta a fundo no E23.

---

## Declarativo e imperativo

No restaurante, você entra na cozinha e dita a receita, ou só pede o prato?

---

## Declarativo vs. imperativo

Código **imperativo** diz **como** fazer, passo a passo. Código **declarativo** diz **o que** você quer e deixa os passos com outro. Imagine um restaurante:

::::columns
:::col
### Imperativo

Você entra na cozinha e dita a receita: "pegue a panela, corte a cebola, refogue por três minutos". Qualquer passo errado estraga o prato.

É o JavaScript puro: procure o elemento, leia o valor, some, escreva de volta.
:::
:::col
### Declarativo

Você pede: "uma moqueca, por favor". O cozinheiro sabe os passos.

É o React: você declara "a tela mostra `Cliques: {total}`", e ele faz as mudanças no DOM.
:::
::::

---

## :icon[list-filter] Declarativo na prática

Você já escreveu os dois jeitos. Os produtos em destaque da Lojinha:

::::columns
:::col
**Imperativo** (o `for` do E07)

```javascript
const destaques = []
for (const produto of produtos) {
  if (produto.destaque) {
    destaques.push(produto)
  }
}
```
:::
:::col
**Declarativo** (o `filter` do E09)

```javascript
const destaques = produtos.filter(
  (produto) => produto.destaque
)
```
:::
::::

Os dois dão o mesmo resultado: `destaques.length` vale 4. O `filter`, a peneira do E09, diz o que você quer e esconde os passos. O React faz o mesmo com a tela: você diz o que ela mostra, e ele cuida dos passos no DOM.

:::question
Qual das duas versões você consegue ler em voz alta como uma frase?
:::

---

## Componentes

Com as mesmas peças de Lego, dá para montar um carro e uma casa?

---

## :icon[blocks] Componentes: peças reutilizáveis

Um **componente** é uma peça de Lego: pequena, reaproveitável, encaixa em outras. No código, é uma função que devolve um pedaço de tela. Uma tela React é feita de peças encaixadas, uma dentro da outra:

:::center
![Diagrama: a tela do app Minhas Tarefas dividida em componentes; App contém Cabecalho, ListaTarefas e Rodape, e ListaTarefas contém três CartaoTarefa](images/e21-componentes-na-tela.svg)
:::

No app Minhas Tarefas, que você constrói do E21 ao E29 (no navegador e depois no celular), `App` contém `Cabecalho`, `ListaTarefas` e `Rodape`. `ListaTarefas` contém três `CartaoTarefa`: a mesma peça, três vezes, com dados diferentes.

---

## :icon[blocks] Componentes na prática

A mesma peça recebe dados diferentes e desenha resultados diferentes, como uma função chamada com argumentos diferentes:

```jsx
<CartaoTarefa titulo="Estudar React" prioridade="alta" />
<CartaoTarefa titulo="Comprar pão" prioridade="baixa" />
```

Na tela, dois cartões: um com "Estudar React", outro com "Comprar pão".

- Escreveu uma vez, usa quantas vezes quiser
- Corrigiu um bug na peça, corrigiu em todos os lugares
- Cada componente pode ser testado e entendido sozinho

Hoje é só para ler: você escreve o primeiro componente na próxima aula. Esses atributos, como `titulo="Estudar React"`, ganham nome no E22: **props**.

:::tip
Em sites grandes, um botão, um cartão de produto ou um menu são componentes repetidos em centenas de telas.
:::

---

## Pense

:::question
Tela inicial de um app de delivery, de cima para baixo:

- faixa no topo com o endereço de entrega e um campo de busca
- fileira de categorias (Pizza, Lanches, Japonesa)
- lista de restaurantes: cada um com foto, nome, nota e tempo de entrega
- barra inferior com Início, Pedidos e Perfil

Quais componentes você vê? Quais se repetem? Qual deles contém outros?
:::

:::tip Resposta
- `Cabecalho`, com o endereço e um `CampoBusca`
- `ListaCategorias`, com vários `ChipCategoria`
- `ListaRestaurantes`, com vários `CartaoRestaurante`
- `BarraInferior`, com três `BotaoAba`

Repetem-se o chip, o cartão e o botão. O `App`, as listas, a barra e o cabeçalho contêm outros.
:::

---

## SPA

Quando você troca de aba no WhatsApp, a tela pisca em branco?

---

## :icon[globe] SPA: uma página, muitas telas

Uma **SPA** (*Single Page Application*, aplicação de página única) carrega a página uma vez só. Depois, o JavaScript troca o conteúdo sem recarregar. É como um app aberto no celular: você troca de tela sem fechar o app.

| Site tradicional | SPA |
|---|---|
| Cada clique pede uma página nova ao servidor | Carrega uma vez; depois, atualiza só o que mudou |
| A tela pisca em branco a cada clique | A troca de tela é instantânea |
| Exemplos: blogs, portais de notícias | Exemplos: Gmail, Trello, painel do banco |

O servidor continua lá, mas envia **dados**, não páginas prontas.

---

## :icon[globe] SPA na prática

Três jeitos de reconhecer uma SPA, no painel deste curso ou no Gmail:

1. Clique num link: a tela troca, sem piscar em branco
2. Abra a aba Network do DevTools e clique de novo: o pedido traz dados, não uma página. É o mesmo tipo de resposta que o seu `fetch` recebeu da DummyJSON no E19:

```plaintext
GET https://dummyjson.com/products/1
{"id":1,"title":"Essence Mascara Lash Princess", ...}
```

3. Aperte <kbd>F5</kbd>: só aí a página inteira carrega de novo

---

## As ferramentas

Numa caixa de ferramentas, por que não existe só um martelo?

---

## :icon[layers] O ecossistema

O **ecossistema** do React é a caixa de ferramentas em volta dele: cada ferramenta faz uma parte do trabalho.

| Ferramenta | Para que serve |
|---|---|
| **React** | monta telas web com componentes |
| **React Native** | leva os mesmos componentes para apps de celular |
| **Expo** | facilita criar, testar e publicar apps React Native |
| **Vite** | cria e roda projetos React na web; salvou, a tela atualiza |
| **Node.js** | roda JavaScript fora do navegador e as ferramentas acima |
| **npm** | instala pacotes e roda os scripts do `package.json` |

Node.js e npm você já usa. O React e o Vite chegam na próxima aula; o React Native e o Expo, no E26.

---

## :icon[layers] As ferramentas na prática

Duas você já tem no computador desde o E01:

```bash
node -v                           # v22.16.0: o Node, 22 ou mais novo
npm -v                            # 10.9.2: o npm, que veio com o Node
node src/scripts/checkout.js      # o Node rodando o lojinha-regras
```

Na próxima aula, um comando do npm chama o Vite, e o Vite cria o projeto React:

```bash
npm create vite@latest minhas-tarefas -- --template react --eslint
```

Uma ferramenta chama a outra: o npm baixa o Vite, o Vite monta o projeto, e o Node roda tudo.

---

## :icon[trending-up] Mercado e tendência

- **React Native** está entre as principais formas de fazer apps para Android e iOS com um código só, e é a ferramenta desta formação
- Foi criado pela Meta, que o usa no Facebook e no Instagram; empresas de todos os tamanhos o adotaram
- Quem domina React entra em dois mercados: o mobile, foco deste curso, e a web
- Empresas olham portfólio: um perfil no GitHub com apps reais pesa na seleção

:::tip
O seu GitHub já tem o `lojinha-regras`, desde o E03. Hoje entra o `minhas-tarefas`: o primeiro projeto com tela.
:::

---

## :icon[braces] O JavaScript que vem junto

Quase tudo do E05 ao E19 volta nas próximas aulas:

| Você viu | No React | Quando |
|---|---|---|
| Funções e módulos (E07, E11) | Um componente por arquivo | E21 |
| `map` e `filter` (E09) | Listas na tela | E22 |
| Desestruturação (E09) | Props e `useState` | E22 e E23 |
| Arrow functions e callbacks (E07, E10) | `onClick` e `onChange` | E23 |
| Spread e cópias (E09, E11) | Estado sem mudar o original | E23 |
| `fetch`, `async` e closures (E10, E19) | Dados externos e hooks próprios | E24 |

:::tip
Travou no React? Quase sempre a dúvida é de JavaScript, e o encontro da tabela tem a resposta.
:::

---

## Erros comuns

:::warning
- Achar que React substitui o HTML: o JSX vira HTML, e você precisa saber o que `<ul>`, `<button>` e `<input>` fazem
- Achar que React é outra linguagem: é JavaScript, e o `map`, a desestruturação e os módulos continuam iguais
- No JavaScript puro, mudar a variável e esquecer a tela: o número fica parado e nenhum erro aparece
- Criar um componente diferente para cada item repetido, em vez de uma peça só, que recebe dados diferentes
- Copiar o código sem rodar: só o que você digita e vê funcionar fica
:::

---

## Resumo

:::summary
- Em JavaScript puro, dados e tela vivem separados, e você atualiza cada pedaço do DOM na mão; é onde os bugs nascem
- React é **declarativo**: você descreve o que a tela mostra, e ele redesenha quando os dados mudam
- Um **componente** é uma peça de Lego: uma função que devolve um pedaço de tela; telas são peças encaixadas
- Uma **SPA** carrega uma vez e atualiza só o que mudou
- React e Vite rodam sobre o Node.js e o npm que você usa desde o E02
:::

Próxima aula: o projeto `minhas-tarefas` com Vite, o JSX e o seu primeiro componente.
