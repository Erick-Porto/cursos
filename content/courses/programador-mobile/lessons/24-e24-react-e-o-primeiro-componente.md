---
title: React e o primeiro componente
summary: "Começa o Projeto 4: o kit React no navegador com o Vite e o seu primeiro componente, o cartão da pizza."
module: react
duration_minutes: 90
objectives:
  - Explicar o que é um componente e por que o React monta a tela com peças
  - Rodar o kit do Projeto 4 com npm run dev e abrir o endereço do localhost
  - Escrever um componente em JSX, com as regras do JSX e valores entre chaves
  - Importar componentes e usar uma peça pronta do kit
---

# React e o primeiro componente

Programador Mobile · Encontro E24 · Aula 24 de 45

---

## O que você vai aprender

:::goal
- Começar o Projeto 4, o Livro de receitas, a partir de um kit
- Rodar um projeto React no navegador com `npm run dev`
- Escrever o seu primeiro componente, o `CartaoReceita`, em JSX
- Mostrar na tela valores do JavaScript, com chaves
- Encaixar no seu componente uma peça pronta do kit
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **React** | um pacote do npm que monta telas juntando peças, os componentes |
| **componente** | uma peça da tela, com nome, que você usa quantas vezes quiser |
| **JSX** | o jeito de escrever a tela com tags, como as do HTML, dentro do JavaScript |
| **Vite** | o programa que roda o projeto React no navegador enquanto você trabalha |
| **localhost** | o endereço do seu próprio computador: um site que só você vê |

---

## :icon[milestone] Projeto 4: o Livro de receitas

Até o E22, a tela dos projetos vinha pronta. Agora, você monta a tela.

O **Livro de receitas** mostra receitas em cartões. Ele vem num **kit**, um projeto pronto para rodar, com cabeçalho, rodapé e visual. Você escreve dois componentes, o `CartaoReceita` e o `BotaoFavorito`.

| Encontro | O app ganha |
|---|---|
| E24, hoje | o kit rodando e o cartão da pizza |
| E25 | as 8 receitas, uma por cartão |
| E26 | a busca e as favoritas |
| E27 | as receitas da internet e a entrega |

Hoje, o kit mostra o aviso "O seu cartão de receita aparece aqui.". No fim do dia, o seu cartão fica no lugar dele.

---

## Componentes

Com as mesmas peças de Lego, dá para montar um carro e uma casa?

---

## :icon[component] React: a tela feita de peças

O **React** é um pacote do npm, como o picocolors do E04, que monta telas com **componentes**. Um componente é uma peça de Lego: pequena, reaproveitável, encaixa em outras. Cada peça desenha um pedaço da tela, e as peças juntas formam a página.

:::center
![Diagrama: o App encaixa o Cabecalho, três CartaoReceita, cada um com uma Etiqueta, e o Rodape; o CartaoReceita é a peça que você escreve, e as outras vêm do kit](images/e24-tela-em-pecas.svg)
:::

O `App` é a tela inteira. A mesma peça, o `CartaoReceita`, aparece três vezes, e cada cartão encaixa uma `Etiqueta`.

---

## :icon[component] Componentes na prática

**Caso 1: escrever uma vez, usar muitas.** Você escreve o `CartaoReceita` uma vez só. No E25, a mesma peça vira 8 cartões, um para cada receita.

**Caso 2: corrigir num lugar só.** Quer mudar o desenho do cartão? Você muda um arquivo, e todos os cartões mudam juntos.

**Caso 3: usar peças prontas.** O kit traz peças feitas e testadas, que você encaixa sem abrir:

| Peça do kit | O que mostra |
|---|---|
| `Cabecalho` | o nome do app, no topo |
| `Rodape` | quem fez o app e de onde vêm as receitas |
| `Etiqueta` | a dificuldade da receita: Fácil, Média ou Difícil |

No E29, o React Native monta apps de celular do mesmo jeito.

---

## :icon[notebook-pen] Exercícios: Componentes

:::example Exercícios
1. O app da academia mostra 12 aulas, cada uma num cartão. Quantas peças de cartão você escreve?
2. O horário saiu pequeno demais nos 12 cartões. Em quantos arquivos você corrige?
3. Divida em peças a tela de um app de ônibus: o topo, uma linha por ônibus e o rodapé. Qual peça se repete?
4. Certo ou errado: para encaixar o `Cabecalho` do kit, você precisa entender o código dele.
:::

:::tip Respostas
1. Uma: a mesma peça aparece 12 vezes
2. Num só, o da peça: os 12 mudam juntos
3. Por exemplo, `Cabecalho`, `LinhaOnibus` e `Rodape`, dentro do `App`; a `LinhaOnibus` se repete
4. Errado: a peça pronta encaixa sem abrir, como no Lego
:::

---

## O Vite

Todo site precisa de um servidor. E se o servidor fosse o seu computador?

---

## :icon[server] Vite: um servidor no seu computador

No E01, o navegador pedia a página a um **servidor**, a cozinha do restaurante, longe de você. O **Vite** liga um servidor dentro do seu computador, para testar o projeto. Ele faz três trabalhos:

| Trabalho | O que quer dizer |
|---|---|
| servir a página | o navegador pede, e o Vite entrega a página e o seu código |
| traduzir o JSX | o navegador não entende JSX, a tela escrita do jeito React; o Vite traduz |
| recarregar ao salvar | salvou um arquivo, a página muda sozinha |

No `package.json` do kit, o script `"dev": "vite"` liga o Vite. Você roda com **`npm run dev`**, como o `npm run racha` do E04.

---

## :icon[server] localhost: o endereço do seu computador

Ligado, o Vite escreve no terminal:

```plaintext
  VITE v8.3.5  ready in 287 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

| Parte | O que quer dizer |
|---|---|
| `localhost` | "este computador": o navegador pede a página à sua própria máquina |
| `5173` | a **porta**: o número da entrada em que o Vite atende; cada servidor ligado usa uma |
| `Network` | o projeto não aparece para outros aparelhos da rede; para hoje, está certo assim |

O endereço não está na internet: só você vê. É o mesmo tipo de endereço do `npx serve`, no E12.

---

## :icon[server] O Vite na prática

**Caso 1: salvou, mudou.** Com o `npm run dev` ligado, troque um texto no `App.jsx` e salve com <kbd>Ctrl</kbd> + <kbd>S</kbd>. A página muda sem <kbd>F5</kbd>, e o terminal avisa que trocou só o arquivo que mudou:

```plaintext
13:34:15 [vite] (client) hmr update /src/App.jsx
```

**Caso 2: o terminal fica ocupado.** Enquanto o Vite está ligado, aquele terminal não aceita outro comando. Para o Git, abra um segundo terminal, no botão **+** do painel.

**Caso 3: desligar e ligar.** <kbd>Ctrl</kbd> + <kbd>C</kbd> desliga, e a página para de abrir: "A conexão com localhost foi recusada". `npm run dev` liga de novo. Com dois ligados, o segundo avisa `Port 5173 is in use` e atende na porta 5174.

---

## :icon[notebook-pen] Exercícios: O Vite

:::example Exercícios
1. Qual comando liga o Vite? E o que o desliga?
2. Com o Vite ligado, você salva o `App.jsx`. Precisa do <kbd>F5</kbd>?
3. No terminal do Vite, você digita `git status`, e nada acontece. Por quê?
4. O terminal mostra `http://localhost:5174/`. Por que não 5173?
5. Você manda `http://localhost:5173` a um colega. O que ele vê no computador dele?
:::

:::tip Respostas
1. `npm run dev` liga; <kbd>Ctrl</kbd> + <kbd>C</kbd> desliga
2. Não: ao salvar, a página muda sozinha
3. O terminal está ocupado: abra um segundo, no **+**
4. Já havia um Vite ligado na 5173, e o segundo atende na 5174
5. "A conexão com localhost foi recusada": para ele, `localhost` é o computador dele, sem Vite
:::

---

## :icon[milestone] Projeto 4 · Passo 1: o kit rodando

:::steps
1. Baixe o [kit-receitas.zip](materiais/projeto-4/kit-receitas.zip) e extraia na pasta dos seus projetos (no Windows: botão direito, **Extrair tudo**)
2. Renomeie a pasta `kit-receitas` para `livro-de-receitas`. Se aparecer `kit-receitas/kit-receitas`, use a de dentro, a que tem o `package.json`
3. No terminal: `cd livro-de-receitas` e `code .`
4. No terminal do VS Code: `npm install`, uma vez só. Ele baixa o React e o Vite para o `node_modules`, como no E04
5. `npm run dev` e, com <kbd>Ctrl</kbd> + clique no endereço, abra a página
:::

**Pronto quando:** `http://localhost:5173` mostra o cabeçalho "Livro de Receitas", uma caixa tracejada com "O seu cartão de receita aparece aqui." e o rodapé.

---

## :icon[folder-tree] O que tem no kit

| Arquivo ou pasta | O que é |
|---|---|
| `index.html` | a página; tem uma caixa vazia, a `<div id="root">`, onde o React desenha tudo |
| `src/main.jsx` | liga o React à página: desenha o `App` dentro da `<div id="root">`. Você não mexe |
| `src/App.jsx` | a tela do app: é aqui que você trabalha |
| `src/components/` | as peças prontas do kit; as suas entram aqui também |
| `src/styles/` | o visual pronto, em CSS |
| `package.json` | os scripts, como o `dev`, e os pacotes `react` e `vite` |

Um arquivo **`.jsx`** é um arquivo JavaScript com JSX dentro. O `src/data/receitas.js` guarda 8 receitas, que entram no E25.

---

## :icon[milestone] Projeto 4 · Passo 2: o kit no Git

O terminal do `npm run dev` fica ocupado: abra um segundo terminal no VS Code, no botão **+**.

:::steps
1. Na raiz do projeto, crie o arquivo `.gitignore` com duas linhas: `node_modules/` e `dist/`
2. `git init`
3. `git add .` e `git status`: a lista não pode ter `node_modules/`
4. `git commit -m "Kit do livro de receitas"`
:::

O `dist/` é a pasta que o Vite cria quando monta a versão final do site. Como o `node_modules`, ela se refaz sozinha e fica fora do Git.

**Pronto quando:** `git status` diz `nothing to commit, working tree clean`, e `git log --oneline` mostra um commit.

---

## O primeiro componente

Se você desenhasse um cartão de receita, o que poria nele?

---

## :icon[component] Componente: uma função que devolve tela

No código, um **componente** é uma **função** que devolve um pedaço de tela. É a peça de Lego escrita em JavaScript:

```jsx
function Aviso() {
  return <p>Lave as mãos antes de cozinhar.</p>
}

export default Aviso
```

- O nome começa com **letra maiúscula**: `Aviso`, `CartaoReceita`. É assim que o React sabe que é uma peça, e não uma tag do HTML
- O `return` devolve a tela, escrita com tags: o `<p>` é o parágrafo do E01
- Para usar a peça, escreva o nome dela como tag: `<Aviso />`. Com duas tags `<Aviso />`, aparecem dois avisos
- O `export default` deixa outros arquivos usarem a peça, como no E16

---

## :icon[code-xml] JSX: as tags da tela

As tags depois do `return` são **JSX**: o HTML do E01, as paredes e os cômodos da página, escrito dentro do JavaScript. O Vite traduz o JSX antes de o navegador ler. Quando a tela ocupa várias linhas, ela vai entre parênteses: `return ( ... )`.

| Tag | O que é |
|---|---|
| `<article>` | um bloco que faz sentido sozinho, como um cartão |
| `<div>` | uma caixa para agrupar outras tags |
| `<h2>` | um título, menor que o `<h1>` |
| `<p>` | um parágrafo |
| `<img>` | uma imagem: `src` é o endereço da foto; `alt`, a descrição dela |
| `<main>` | o conteúdo principal da página |

---

## :icon[code-xml] As três regras do JSX

| Regra | No HTML | No JSX |
|---|---|---|
| 1. `className` | `<p class="aviso">` | `<p className="aviso">` |
| 2. toda tag fecha | `<img src="pizza.webp">` | `<img src="pizza.webp" />` |
| 3. um pai | duas tags soltas | uma tag em volta |

1. A **classe** liga a tag a um visual pronto do CSS. O JSX usa `className` porque `class` é palavra do JavaScript, a das classes do E18
2. No E01, a `<img>` ficava aberta. No JSX, tag sem conteúdo fecha com `/>`, inclusive as peças: `<Aviso />`
3. A receita entrega um prato só, e o `return` também: as tags vão dentro de uma, como `<article>`, `<div>` ou o **fragmento** `<>...</>`, que não aparece na página

---

## :icon[triangle-alert] As regras na prática

**Sem um pai, ou com a `<img>` aberta:** a página some, e o Vite mostra no navegador uma tela de erro, com o arquivo e a linha. Trecho dela:

```plaintext
[PARSE_ERROR] Adjacent JSX elements must be wrapped in an enclosing tag.
╭─[ src/components/CartaoReceita.jsx:16:7 ]
│ Help: Did you want a JSX fragment `<>...</>`?
```

A da `<img>` diz `Expected corresponding JSX closing tag for 'img'.` Corrija e salve: a tela de erro some sozinha.

**Com `class`:** a página funciona, mas o Console (<kbd>F12</kbd>) avisa:

```plaintext
Invalid DOM property `class`. Did you mean `className`?
```

**O fragmento não aparece:** o `App` do kit começa com `<>`. Na aba Elements, dentro da `<div id="root">`, estão só o `<header>` (o topo), o `<main>` e o `<footer>` (o rodapé).

---

## :icon[notebook-pen] Exercícios: O primeiro componente

:::example Exercícios
1. Com `<Horario />` duas vezes dentro do `<main>`, o que aparece?

   ```jsx
   function Horario() {
     return <p>Academia aberta das 6h às 22h</p>
   }
   ```

2. O que está errado em `<p class="preco">Coxinha: R$ 7</p>`?
3. E em `<img src="onibus.png" alt="Ônibus 101">`?
4. Por que esta peça dá erro? Corrija.

   ```jsx
   function Parada() {
     return (
       <h2>Parada Central</h2>
       <p>Linhas 101 e 230</p>
     )
   }
   ```

5. A peça `function cardapio()`, usada como `<cardapio />`, não aparece. Por quê?
:::

:::tip Respostas
1. Dois parágrafos iguais: "Academia aberta das 6h às 22h"
2. No JSX, é `className`: com `class`, a página funciona, mas o Console avisa
3. Ela não fecha: `<img src="onibus.png" alt="Ônibus 101" />`
4. Duas tags sem um pai: envolva as duas numa `<div>` ou no fragmento `<>...</>`
5. Com minúscula, o React procura a tag `<cardapio>` do HTML, que não existe. O nome vai com maiúscula
:::

---

## Importar componentes

Na padaria, como o pão sai da vitrine e chega à sua mesa?

---

## :icon[store] export default e import

Cada peça mora no seu arquivo. Para o `App` usar o cartão, são duas pontas, como a vitrine do E16: o `export` põe na vitrine, e o `import` pega de lá.

```jsx
// no fim de src/components/CartaoReceita.jsx
export default CartaoReceita
```

```jsx
// no topo de src/App.jsx
import CartaoReceita from './components/CartaoReceita.jsx'
```

- **`export default`**: o arquivo entrega uma coisa principal, a peça. Por isso o `import` vem sem chaves, como no E16
- **`'./components/CartaoReceita.jsx'`**: o `./` quer dizer "a partir da pasta deste arquivo". O `App.jsx` está em `src`, e o cartão, em `src/components`
- Depois do `import`, a peça vira tag: `<CartaoReceita />`

---

## :icon[store] Importar na prática

**Caso 1: as peças do kit.** O `App` do kit já importa duas, e as encaixa como tags, `<Cabecalho />` e `<Rodape />`:

```jsx
import Cabecalho from './components/Cabecalho.jsx'
import Rodape from './components/Rodape.jsx'
```

**Caso 2: o manual da peça.** Cada peça do kit começa com um comentário. A linha `Props` lista o que a peça recebe, e a `Uso` mostra a tag:

```jsx
// Carregando: o aviso que aparece enquanto as receitas não chegam da API.
//
// Props: nenhuma.
//
// Uso: <Carregando />
```

**Caso 3: uma peça com atributo.** Como o `src` diz à `<img>` qual foto mostrar, um atributo diz à peça o que mostrar: `<Etiqueta dificuldade="Easy" />` mostra "Fácil", em verde. No E25, esse atributo ganha um nome: **prop**.

---

## :icon[notebook-pen] Exercícios: Importar componentes

:::example Exercícios
1. Complete a última linha de `src/components/Saldo.jsx`, a peça com o saldo do cartão do ônibus: `___ ___ Saldo`
2. Escreva a linha que importa o `Saldo` no `src/App.jsx`
3. O `src/components/Extrato.jsx`, da mesma pasta, importa o `Saldo` assim, e a página mostra `Failed to resolve import`. Corrija.

   ```jsx
   import Saldo from './components/Saldo.jsx'
   ```

4. O que está errado em `import { Saldo } from './components/Saldo.jsx'`, se o arquivo termina com `export default Saldo`?
:::

:::tip Respostas
1. `export default Saldo`
2. `import Saldo from './components/Saldo.jsx'`
3. O `./` parte da pasta do `Extrato.jsx`, que já é a `components`: `import Saldo from './Saldo.jsx'`
4. As chaves: com `export default`, o `import` vem sem elas
:::

---

## :icon[milestone] Projeto 4 · Passo 3: o CartaoReceita

No painel do VS Code, crie o arquivo `src/components/CartaoReceita.jsx`:

```jsx
function CartaoReceita() {
  return (
    <article className="cartao">
      <img
        className="cartao__foto"
        src="https://cdn.dummyjson.com/recipe-images/1.webp"
        alt="Pizza margherita"
      />
      <div className="cartao__corpo">
        <h2 className="cartao__nome">Pizza margherita</h2>
      </div>
    </article>
  )
}
```

Depois de uma linha em branco, a última linha do arquivo põe a peça na vitrine: `export default CartaoReceita`.

A `<img>` ocupa várias linhas para caber na tela: um atributo por linha, e o `/>` fecha a tag.

As classes vêm prontas no CSS do kit. `cartao__foto` quer dizer "a foto do cartão": antes dos dois sublinhados vem a peça; depois, a parte dela.

---

## :icon[milestone] Projeto 4 · Passo 3: o cartão no App

No `src/App.jsx`, uma linha nova de `import`, logo depois das duas do kit:

```jsx
import CartaoReceita from './components/CartaoReceita.jsx'
```

Dentro do `<main>`, no lugar do `<p className="aviso">`, a grade com o cartão:

```jsx
      <main className="conteudo">
        <div className="grade">
          <CartaoReceita />
        </div>
      </main>
```

A classe `grade` arruma os cartões lado a lado: três colunas no computador, uma no celular. O `export default App`, no fim do arquivo, continua como veio no kit.

**Pronto quando:** o aviso tracejado some, e aparece o cartão, com a foto da pizza e "Pizza margherita" em negrito.

---

## :icon[list-ordered] O cartão em português

| Linha | O que ela diz |
|---|---|
| `function CartaoReceita() {` | "esta é a peça `CartaoReceita`" |
| `return ( ... )` | "ela devolve esta tela"; os parênteses juntam as linhas |
| `<article className="cartao">` | "um cartão, com o visual da classe `cartao`" |
| `<img ... />` | "a foto que está neste endereço (`src`), descrita como Pizza margherita (`alt`)" |
| `<div className="cartao__corpo">` | "a parte de baixo do cartão, com os textos" |
| `<h2 className="cartao__nome">` | "o nome da receita, como título" |

No `App`, a tag `<CartaoReceita />` encaixa a peça dentro da `grade`. O `alt` também aparece no lugar da foto quando ela não carrega, por exemplo sem internet.

---

## Chaves no JSX

Num cartaz, se você escrever 20 + 15, aparece a conta ou o 35?

---

## :icon[variable] Chaves: o JavaScript dentro da tela

No JSX, o texto aparece do jeito que você escreveu. As **chaves** `{ }` abrem uma janela para o JavaScript: o que está entre elas é calculado, e o resultado vai para a tela.

```jsx
function Festa() {
  const porcoes = 8

  return <p>Duas receitas rendem {porcoes * 2} porções</p>
}
```

Na tela: `Duas receitas rendem 16 porções`.

- Fora das chaves, o texto fica como está; dentro, `porcoes * 2` vira `16`
- É o `${ }` da template string do E06, agora no JSX
- Entre as chaves cabe o que dá um valor: uma constante, uma conta, um método. Um `if` não cabe: ele escolhe um caminho, não dá um valor
- As constantes ficam dentro da função, antes do `return`

---

## :icon[variable] Chaves na prática

Com estas constantes antes do `return`:

```jsx
const nome = 'Brigadeiro'
const porcoes = 8
const preco = 2.5
```

| No JSX | Na tela |
|---|---|
| `<p>{nome}</p>` | Brigadeiro |
| `<p>{nome.toUpperCase()}</p>` | BRIGADEIRO |
| `<p>{nome.length} letras</p>` | 10 letras |
| `<p>{porcoes * 2} porções na festa</p>` | 16 porções na festa |
| `<p>R$ {(preco * porcoes).toFixed(2)} a receita</p>` | R$ 20.00 a receita |
| `<p>porcoes * 2</p>` | porcoes * 2 |

Dentro das chaves vale o JavaScript que você já conhece: o `toUpperCase` do E09, o `.length` da aula 3, o `toFixed(2)` do E04.

A última linha esqueceu as chaves: o React mostra o texto como está, sem erro nenhum. É o engano mais comum com chaves.

---

## :icon[notebook-pen] Exercícios: Chaves no JSX

:::example Exercícios
1. Com `const alunos = 30`, complete para a tela mostrar "Turma de 30 alunos": `<p>Turma de ___ alunos</p>`
2. O que aparece em cada parágrafo?

   ```jsx
   function Passagem() {
     const linha = 'Centro'
     const preco = 4.5

     return (
       <div>
         <p>Linha {linha.toUpperCase()}</p>
         <p>Ida e volta: R$ {(preco * 2).toFixed(2)}</p>
         <p>preco * 2</p>
       </div>
     )
   }
   ```

3. Com `const preco = 3` e `const itens = 4`, escreva o parágrafo que mostra "Total: R$ 12.00"
4. Por que `<p>{if (vip) 'Sala VIP'}</p>` não funciona?
:::

:::tip Respostas
1. `{alunos}`
2. "Linha CENTRO", "Ida e volta: R$ 9.00" e "preco * 2": sem chaves, o texto fica como está
3. `<p>Total: R$ {(preco * itens).toFixed(2)}</p>`
4. Entre as chaves cabe só o que dá um valor; o `if` escolhe um caminho, não dá um valor
:::

---

## :icon[milestone] Projeto 4 · Passo 4: o tempo entre chaves

No `CartaoReceita`, duas constantes antes do `return`: os 20 minutos de preparo e os 15 de forno da pizza.

```jsx
function CartaoReceita() {
  const preparo = 20
  const cozimento = 15

  return (
```

A `<img>` continua igual. Dentro da `<div className="cartao__corpo">`, uma linha nova, embaixo do nome:

```jsx
      <div className="cartao__corpo">
        <h2 className="cartao__nome">Pizza margherita</h2>
        <p className="cartao__info">Italiana, {preparo + cozimento} minutos</p>
      </div>
```

A classe `cartao__info` deixa a linha menor e cinza.

**Pronto quando:** embaixo do nome aparece "Italiana, 35 minutos", e não "preparo + cozimento".

---

## :icon[milestone] Projeto 4 · Sua vez: complete o cartão

Agora, sozinho. Complete o cartão fixo da pizza:

1. Uma segunda linha de informação, "4 porções, nota 4.6", com duas constantes novas, `porcoes` e `nota`, entre chaves
2. A `Etiqueta` do kit, com a dificuldade da pizza, `"Easy"`, dentro de uma `<div className="cartao__rodape">`, no fim do corpo do cartão

:::tip Dicas
- O comentário no topo de `src/components/Etiqueta.jsx` mostra como usar a peça
- O `CartaoReceita` e a `Etiqueta` estão na mesma pasta: o caminho do `import` começa com `./`
:::

**Pronto quando:** o cartão mostra a foto, "Pizza margherita", "Italiana, 35 minutos", "4 porções, nota 4.6" e a etiqueta verde "Fácil", e o Console (<kbd>F12</kbd>) não tem mensagem vermelha.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `'vite' não é reconhecido` | faltou instalar os pacotes | `npm install` |
| `Could not read package.json` | o terminal está fora do projeto | `cd livro-de-receitas` |
| `does not provide an export named 'default'` | faltou o `export default` | `export default CartaoReceita` no fim |
| `Failed to resolve import` | caminho ou nome de arquivo diferente | conferir letra por letra e o `./` |
| `is not defined` | um nome do JSX não existe | criar a constante ou importar a peça |

Tela em branco? Veja o Console (<kbd>F12</kbd>) ou o terminal do `npm run dev`.

---

## :icon[milestone] Projeto 4 · Etapa 1 pronta

O cartão mostra a foto, "Pizza margherita", "Italiana, 35 minutos", "4 porções, nota 4.6" e a etiqueta "Fácil". No segundo terminal:

```bash
git add .
git commit -m "Projeto 4: etapa 1, kit e cartão fixo"
```

No GitHub: **New repository**, nome `livro-de-receitas`, **Public**, sem README nem `.gitignore`, porque o projeto já tem. Depois, os três comandos que o GitHub mostra:

```bash
git remote add origin https://github.com/SEU-USUARIO/livro-de-receitas.git
git branch -M main
git push -u origin main
```

No GitHub, o histórico mostra dois commits: o do kit e o da etapa 1. O que faltar, termine em casa: a etapa inteira está no enunciado, na página do curso, em **Projetos**.

---

## Resumo

:::summary
- O React monta a tela com componentes, peças de Lego que se encaixam e se repetem
- O Vite serve o projeto em `http://localhost:5173`, traduz o JSX e recarrega a página ao salvar; `npm run dev` liga, e <kbd>Ctrl</kbd> + <kbd>C</kbd> desliga
- Um componente é uma função com nome em maiúscula que devolve JSX; você usa a peça como tag: `<CartaoReceita />`
- As regras do JSX: `className`, toda tag fecha com `/>` e um elemento pai, que pode ser o fragmento `<>...</>`
- As chaves `{ }` põem na tela o resultado de uma constante ou de uma conta
- `export default` põe a peça na vitrine; `import Nome from './arquivo.jsx'` pega de lá
:::

---

## :icon[arrow-right] Próximos passos

No E25, o cartão deixa de ser fixo:

- :icon[package] as **props**: o pedido feito à peça, que diz o que cada cartão mostra
- :icon[layout-grid] as 8 receitas do kit viram 8 cartões, com o `map` do E14
- :icon[user] o seu nome no rodapé do app
