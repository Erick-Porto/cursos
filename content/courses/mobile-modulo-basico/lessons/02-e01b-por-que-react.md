---
title: Por que React
summary: O problema de atualizar a tela na mão, o jeito declarativo do React e o ambiente de trabalho.
module: react
duration_minutes: 40
objectives:
  - Explicar o problema que o React resolve
  - Diferenciar código declarativo de imperativo
  - Identificar componentes em uma tela
  - Preparar o ambiente com Node.js, VS Code e Git
---

# Por que React

Programador Mobile: Módulo Básico · Encontro E01 · Aula 2 de 18

---

## O que você vai aprender

:::goal
- Por que atualizar a tela "na mão" com JavaScript vira um problema
- A diferença entre código **imperativo** e **declarativo**
- O que é um componente e como enxergá-los em qualquer tela
- Quais ferramentas instalar hoje e como conferir se funcionaram
:::

---

## Por que isso importa

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

O navegador monta o **DOM**, a árvore de elementos da página. Você procura o elemento (`querySelector`), espera o clique (`addEventListener`) e troca o texto (`textContent`).

**Acompanhe**: [abra o contador em outra aba](materiais/e01/aluno/contador.html), teste e repita a demonstração.

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
`useState` guarda um valor que pode mudar. Por enquanto, só observe; você vai aprender isso a fundo no E04.
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

## :icon[blocks] Componentes: peças reutilizáveis

Um **componente** é uma função que devolve um pedaço de tela. Uma tela React é uma árvore de componentes, um dentro do outro.

:::center
![Diagrama: a tela do app Minhas Tarefas dividida em componentes; App contém Cabecalho, ListaTarefas e Rodape, e ListaTarefas contém três CartaoTarefa](images/e01-componentes-na-tela.svg)
:::

No app que você vai construir neste curso, `App` contém `Cabecalho`, `ListaTarefas` e `Rodape`, e `ListaTarefas` contém três `CartaoTarefa`. Cada peça cuida só da própria parte. `CartaoTarefa` aparece três vezes: é o mesmo molde com dados diferentes.

---

## Um molde, muitas peças

O mesmo componente recebe dados diferentes e desenha resultados diferentes:

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

O servidor continua existindo: ele passa a enviar **dados** em vez de páginas prontas.

---

## :icon[layers] O ecossistema

| Ferramenta | Para que serve |
|---|---|
| **React** | Biblioteca para construir interfaces web com componentes |
| **React Native** | Leva os mesmos componentes e ideias para apps de celular |
| **Expo** | Conjunto de ferramentas que simplifica criar, testar e publicar apps React Native |
| **Vite** | Cria e roda projetos React na web, com recarga instantânea ao salvar |
| **Node.js** | Executa JavaScript fora do navegador; as ferramentas acima dependem dele |
| **npm** | Instala pacotes de código prontos; vem junto com o Node.js |

Hoje você instala o Node.js (e o npm). O resto chega com o projeto.

---

## :icon[trending-up] Mercado e tendência

- **React Native** está entre as principais formas de construir apps para Android e iOS com uma só base de código, e é a ferramenta desta formação
- Foi criado pela Meta, que o usa no Facebook e no Instagram; empresas de todos os tamanhos o adotaram
- Quem domina React entra em dois mercados: o mobile, foco deste curso, e a web
- Empresas olham portfólio: um perfil no GitHub com apps reais pesa na seleção

:::tip
A conta do GitHub que você cria hoje no laboratório é o começo do seu portfólio.
:::

---

## Erros comuns

:::warning
- Achar que React substitui o HTML: o JSX vira HTML, e você precisa saber o que `<ul>`, `<button>` e `<input>` fazem
- Achar que precisa dominar todo o JavaScript antes de começar: você aprende os dois juntos, no ritmo deste curso
- Copiar o código sem rodar: só o que você digita e vê funcionar fica
- Instalar uma versão de Node.js que não é LTS: ferramentas podem falhar sem explicação
- Fechar o terminal diante de um erro: leia a mensagem; ela quase sempre diz o que falta
:::

---

## Resumo

:::summary
- Em JavaScript puro, dados e tela vivem separados e você atualiza cada pedaço na mão; é onde os bugs nascem
- React é **declarativo**: você descreve o que a tela mostra e ele redesenha quando os dados mudam
- Um **componente** é uma função que devolve um pedaço de tela; telas são árvores de componentes reutilizáveis
- Uma **SPA** carrega uma vez e atualiza só o que mudou
- React, React Native, Expo e Vite rodam sobre Node.js e npm
:::

---

## :icon[list-checks] Checklist de instalação

| O que | Onde baixar | Como conferir |
|---|---|---|
| **Node.js LTS** (vem com o npm) | nodejs.org, botão LTS | `node -v` e `npm -v` |
| **VS Code** | code.visualstudio.com | Abrir e instalar as extensões ES7+ React snippets, Prettier e Error Lens |
| **Git** | git-scm.com | `git --version` |
| **Navegador** com DevTools | Chrome ou Edge | `F12` abre o painel |
| **Conta no GitHub** | github.com | Entrar com usuário e senha |

:::tip
No Windows, depois de instalar, feche e abra o terminal de novo. Sem isso, `node` e `git` podem não ser encontrados.
:::

---

## :icon[flask-conical] No laboratório

Hoje você monta sua primeira página e deixa o computador pronto para o React.

:::steps
1. No VS Code (instale-o antes, se preciso), crie `perfil.html` e `estilo.css` com uma foto, seu nome e três links (GitHub, LinkedIn, e-mail ou outros). Abra no navegador e inspecione com o DevTools
2. Instale Node.js LTS e Git
3. Abra o terminal e confira as versões
4. Crie sua conta no GitHub com um nome de usuário que você colocaria em um currículo
:::

```bash
node -v
npm -v
git --version
```

**Entrega**: captura de tela do terminal com as três versões e o arquivo `perfil.html` (com o CSS), enviados ao instrutor. Quem não terminar hoje entrega por commit no E02.
