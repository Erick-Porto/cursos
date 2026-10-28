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

## Por que isso importa

Até o E20, o resultado do seu código era uma linha no terminal: o `console.log` imprimia e pronto. Uma tela é diferente: ela fica à vista e muda a cada clique.

Pense na tela de uma lista de tarefas. Quando você adiciona uma tarefa:

- um item novo entra na lista
- o contador "2 pendentes" vira "3 pendentes"
- a mensagem "nenhuma tarefa" precisa sumir

A mesma informação aparece em três lugares. Esqueça um deles e a tela mente para o usuário.

:::question
Quem garante que tudo isso muda junto, a cada clique, em um app com dezenas de telas?
:::

---

## :icon[code] Um contador em JavaScript puro

```html
<p>Cliques: <span id="total">0</span></p>
<button id="botao">Clicar</button>
```

```javascript
let total = 0
const span = document.querySelector('#total')
const botao = document.querySelector('#botao')

botao.addEventListener('click', () => {
  total = total + 1
  span.textContent = total
})
```

O navegador monta o **DOM**, a árvore de elementos da página: é a cópia que você editou na aba Elements no E01. Você procura o elemento (`querySelector`), espera o clique (`addEventListener`, que recebe uma arrow function como callback, do E10) e troca o texto (`textContent`).

**Acompanhe**: [abra o contador em outra aba](materiais/e21/aluno/contador.html), teste e repita a demonstração.

---

## O problema cresce com a tela

No contador, cada clique exige duas atualizações: a variável `total` e o texto na tela. Em uma tela real, são muitas mais:

| Ação do usuário | O que você atualiza na mão |
|---|---|
| Adicionar tarefa | Inserir o `<li>`, somar no contador, esconder "nenhuma tarefa" |
| Concluir tarefa | Riscar o item, subtrair do contador |
| Remover tarefa | Tirar o `<li>`, subtrair do contador, talvez mostrar "nenhuma tarefa" |

Os dados vivem em um lugar e a tela, em outro. Manter os dois em dia é trabalho seu, a cada ação. É aí que a maioria dos bugs de interface nasce.

---

## :icon[component] O mesmo contador em React

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

Você descreve o que a tela mostra: `Cliques: {total}`. Quando `total` muda, o **React** redesenha o que for preciso. Ninguém procura o `span` nem troca texto.

:::info
`useState` guarda um valor que pode mudar e devolve um par: o valor e a função que o troca, lidos com a desestruturação de array do E09. Por enquanto, só observe; você vai aprender isso a fundo no E23.
:::

---

## Declarativo vs. imperativo

Imagine um restaurante.

::::columns
:::col
### Imperativo

Você entra na cozinha e dita a receita: "pegue a panela, corte a cebola, refogue por três minutos". Qualquer passo errado estraga o prato.

É o JavaScript puro: procure o elemento, leia o valor, some, escreva de volta.
:::
:::col
### Declarativo

Você pede: "uma moqueca, por favor". O cozinheiro sabe os passos.

É o React: você declara "a tela mostra `Cliques: {total}`" e ele executa as mudanças no DOM.
:::
::::

Código **declarativo** diz **o que** você quer; código **imperativo** diz **como** fazer, passo a passo.

---

## :icon[list-filter] Você já escreveu código declarativo

Os produtos em destaque da Lojinha, de dois jeitos:

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

O `filter` diz o que você quer e esconde os passos. O React faz o mesmo com a tela: você diz o que ela mostra, e ele cuida dos passos no DOM.

:::question
Qual das duas versões você consegue ler em voz alta como uma frase?
:::

---

## :icon[blocks] Componentes: peças reutilizáveis

Um **componente** é uma função que devolve um pedaço de tela. Uma tela React é uma árvore de componentes, um dentro do outro.

:::center
![Diagrama: a tela do app Minhas Tarefas dividida em componentes; App contém Cabecalho, ListaTarefas e Rodape, e ListaTarefas contém três CartaoTarefa](images/e21-componentes-na-tela.svg)
:::

No app Minhas Tarefas, que você constrói do E21 ao E29 (no navegador e depois no celular), `App` contém `Cabecalho`, `ListaTarefas` e `Rodape`, e `ListaTarefas` contém três `CartaoTarefa`. Cada peça cuida só da própria parte. `CartaoTarefa` aparece três vezes: é o mesmo molde com dados diferentes.

---

## Um molde, muitas peças

O mesmo componente recebe dados diferentes e desenha resultados diferentes, como uma função chamada com argumentos diferentes:

```jsx
<CartaoTarefa titulo="Estudar React" prioridade="alta" />
<CartaoTarefa titulo="Comprar pão" prioridade="baixa" />
```

- Escreveu uma vez, usa quantas vezes quiser
- Corrigiu um bug no molde, corrigiu em todos os lugares
- Cada componente pode ser testado e entendido sozinho

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

---

## :icon[globe] SPA: uma página, muitas telas

Um app React costuma ser uma **SPA** (Single Page Application): o servidor envia a página uma única vez; depois, o JavaScript troca o conteúdo na tela sem recarregar.

| Site tradicional | SPA |
|---|---|
| Cada clique pede uma página nova ao servidor | Carrega uma vez; depois atualiza só o que mudou |
| A tela pisca em branco a cada navegação | A navegação é instantânea, como em um app |
| Exemplos: blogs, portais de notícias | Exemplos: Gmail, Trello, painel do banco |

O servidor continua existindo: ele passa a enviar **dados** em vez de páginas prontas, como o JSON que o seu `fetch` buscou na DummyJSON no E19.

---

## :icon[layers] O ecossistema

| Ferramenta | Para que serve |
|---|---|
| **React** | Biblioteca para construir interfaces web com componentes |
| **React Native** | Leva os mesmos componentes e ideias para apps de celular |
| **Expo** | Conjunto de ferramentas que simplifica criar, testar e publicar apps React Native |
| **Vite** | Cria e roda projetos React na web, com recarga instantânea ao salvar |
| **Node.js** | Executa JavaScript fora do navegador; roda o `lojinha-regras` e as ferramentas acima |
| **npm** | Instala pacotes e roda os scripts do `package.json`, como no E02 |

Node.js e npm você já usa. O React e o Vite chegam com o projeto da próxima aula; o React Native e o Expo, no E26.

---

## :icon[trending-up] Mercado e tendência

- **React Native** está entre as principais formas de construir apps para Android e iOS com uma só base de código, e é a ferramenta desta formação
- Foi criado pela Meta, que o usa no Facebook e no Instagram; empresas de todos os tamanhos o adotaram
- Quem domina React entra em dois mercados: o mobile, foco deste curso, e a web
- Empresas olham portfólio: um perfil no GitHub com apps reais pesa na seleção

:::tip
O seu GitHub já tem o `lojinha-regras`, desde o E03. Hoje entra o `minhas-tarefas`: o primeiro projeto com tela.
:::

---

## :icon[braces] O JavaScript que vem junto

React é JavaScript. Quase tudo do E05 ao E19 volta nas próximas aulas:

| Você viu | No React | Quando |
|---|---|---|
| Funções e módulos (E07, E11) | Um componente por arquivo | E21 |
| `map` e `filter` (E09) | Listas na tela | E22 |
| Desestruturação (E09) | Props e `useState` | E22 e E23 |
| Arrow functions e callbacks (E07, E10) | `onClick` e `onChange` | E23 |
| Spread e cópias (E09, E11) | Estado sem mudar o original | E23 |
| `fetch`, `async` e closures (E10, E19) | Dados externos e hooks próprios | E24 |

:::tip
Travou no React? Quase sempre a dúvida é de JavaScript: volte ao encontro indicado.
:::

---

## Erros comuns

:::warning
- Achar que React substitui o HTML: o JSX vira HTML, e você precisa saber o que `<ul>`, `<button>` e `<input>` fazem
- Achar que React é outra linguagem: é JavaScript, e o `map`, a desestruturação e os módulos continuam iguais
- No JavaScript puro, mudar a variável e esquecer a tela: o número fica parado e nenhum erro aparece
- Criar um componente diferente para cada item repetido, em vez de um molde que recebe dados diferentes
- Copiar o código sem rodar: só o que você digita e vê funcionar fica
:::

---

## Resumo

:::summary
- Em JavaScript puro, dados e tela vivem separados e você atualiza cada pedaço do DOM na mão; é onde os bugs nascem
- React é **declarativo**: você descreve o que a tela mostra e ele redesenha quando os dados mudam
- Um **componente** é uma função que devolve um pedaço de tela; telas são árvores de componentes reutilizáveis
- Uma **SPA** carrega uma vez e atualiza só o que mudou
- React e Vite rodam sobre o Node.js e o npm que você usa desde o E02
:::

Próxima aula: o projeto `minhas-tarefas` com Vite, o JSX e o seu primeiro componente.
