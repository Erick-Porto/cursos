---
title: Primeiro projeto React com Vite e JSX
summary: Crie o projeto minhas-tarefas com Vite, entenda cada arquivo e escreva seus primeiros componentes em JSX.
module: react
duration_minutes: 40
objectives:
  - Criar e rodar um projeto React com Vite
  - Explicar a função de cada arquivo do projeto
  - Escrever JSX válido com expressões
  - Criar e importar um componente
---

# Primeiro projeto React com Vite e JSX

Programador Mobile · Encontro E21 · Aula 42 de 89

---

## O que você vai aprender

:::goal
- Criar e rodar o projeto `minhas-tarefas` com Vite
- Reconhecer o que cada arquivo do projeto faz
- Escrever JSX válido, com as três regras e as expressões entre chaves
- Criar um componente em arquivo próprio e usá-lo no `App`
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **Vite** | a ferramenta que cria o projeto React e o roda no navegador; o nome vem do francês, "rápido" |
| **servidor local** | um site que roda só no seu computador, num endereço como `http://localhost:5173` |
| **JSX** | o jeito de escrever a tela com tags, parecidas com as do HTML, dentro do JavaScript |
| **compilar** | traduzir o código antes de rodar; o Vite traduz o JSX para JavaScript comum |
| **hot reload** | recarga automática: salvou o arquivo, a página atualiza sozinha |
| **fragmento** | `<>...</>`: agrupa tags sem criar uma tag a mais na página |

---

## Por que um gerador de projeto?

No E02, você montou o `lojinha-regras` à mão: `npm init`, `"type": "module"` e os scripts. Um projeto React precisa de bem mais: um servidor local, um tradutor do código React para JavaScript comum, recarga automática e uma estrutura de pastas. Montar isso à mão levaria uma tarde inteira e muitos erros.

O **Vite** resolve com um comando: gera o projeto pronto e cuida da parte chata enquanto você escreve componentes.

:::question
Ao fim deste encontro, o app `minhas-tarefas` estará rodando no seu navegador e publicado no GitHub. Quantos arquivos você acha que vai precisar escrever para isso?
:::

---

## O Vite

Para cozinhar, é mais rápido montar a cozinha do zero ou chegar numa cozinha pronta?

---

## :icon[rocket] O Vite: a cozinha montada

O **Vite** é um gerador de projeto: monta a estrutura toda com um comando e depois roda o projeto no navegador. É como chegar numa cozinha já montada, com fogão, panelas e bancada no lugar: você só cozinha.

Para criar e ligar um projeto React, quatro comandos, na pasta onde você guarda os projetos:

```bash
npm create vite@latest minhas-tarefas -- --template react --eslint
cd minhas-tarefas
npm install
npm run dev
```

Abra no navegador o endereço que aparece no terminal: surge a página de boas-vindas do Vite.

:::tip
Se o gerador perguntar "Install with npm and start now?", escolha **No** com as setas: você roda os comandos você mesmo.
:::

---

## :icon[rocket] Os 4 comandos na prática

| Comando | O que faz | O que aparece |
|---|---|---|
| `npm create vite@latest minhas-tarefas -- --template react --eslint` | baixa o gerador, como o `npx` do E03, e cria a pasta com o modelo **React** em JavaScript; o `--eslint` traz o linter do E03 | `Done. Now run:` e os três comandos seguintes |
| `cd minhas-tarefas` | entra na pasta nova; os próximos comandos rodam aqui | o caminho do terminal termina em `minhas-tarefas` |
| `npm install` | baixa o que o `package.json` lista, como no E02 | `found 0 vulnerabilities` |
| `npm run dev` | roda o script `dev`, como o `npm run relatorio` do E02 | `Local: http://localhost:5173/` |

---

## :icon[refresh-cw] npm run dev e a recarga automática

Com `npm run dev` ligado, o Vite roda um **servidor local** e vigia os arquivos. Salvou, a página atualiza sozinha: isso é o **hot reload**.

Demonstração: abra `src/App.jsx`, troque o texto do `<h1>` e salve com `Ctrl + S`. O texto do modelo muda entre versões do Vite; hoje ele é:

```jsx
<h1>Get started</h1>
```

vira

```jsx
<h1>Minhas Tarefas</h1>
```

Olhe o navegador: o título mudou sem apertar F5.

- Deixe o terminal com `npm run dev` aberto durante todo o trabalho
- Para parar o servidor: `Ctrl + C` no terminal
- Para subir de novo: `npm run dev`

---

## Os arquivos do projeto

Se a página começa com uma caixa vazia, quem coloca o conteúdo nela?

---

## :icon[folder-tree] O que cada arquivo faz

Quase todo o seu trabalho fica em `src/` (de *source*, fonte), a pasta do código.

| Arquivo | Função |
|---|---|
| `index.html` | a única página; tem a `<div id="root">` vazia, onde o React desenha tudo |
| `src/main.jsx` | ponto de partida: liga o React à `div#root` e desenha o `App` |
| `src/App.jsx` | o componente principal; é aqui que você trabalha |
| `package.json` | como no E02: `"type": "module"`, scripts e pacotes |
| `node_modules/` | pacotes do `npm install`; o `.gitignore` já o deixa fora do Git |
| `vite.config.js` | configurações do Vite; você quase nunca mexe |

Também vêm os estilos (`src/App.css` e `src/index.css`), a pasta `public/` e o `eslint.config.js`, do `npm run lint`.

---

## :icon[route] O caminho até a tela

Como o navegador chega ao seu componente? Três passos, sempre nesta ordem:

:::center
![Animação: o index.html carrega o main.jsx, o main.jsx renderiza o App e o que o App.jsx devolve aparece dentro da div root, na tela](images/e21-caminho-ate-a-tela.svg)
:::

O **`index.html`** tem uma `<div id="root"></div>` vazia e um `<script type="module" src="/src/main.jsx">`. O **`src/main.jsx`** encontra a `div#root` e pede ao React para **renderizar** (desenhar) o `App` dentro dela. Tudo o que o **`src/App.jsx`** devolver vira HTML ali dentro. O `getElementById` procura no DOM, como o `querySelector` da aula anterior.

```jsx
// src/main.jsx (resumido: o original também importa o index.css)
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(<App />)
```

---

## JSX

Uma tag de HTML dentro de uma função JavaScript: pode isso?

---

## :icon[braces] JSX: HTML dentro do JavaScript

O **JSX** é o jeito de escrever a tela com tags dentro do JavaScript. Abra `src/App.jsx`:

```jsx
function App() {
  return (
    <div>
      <h1>Minhas Tarefas</h1>
      <p>Organize seu dia.</p>
    </div>
  )
}

export default App
```

- `function App()` é um componente: uma função
- `return ( ... )` devolve o pedaço de tela; os parênteses só agrupam as linhas
- `<div>`, `<h1>` e `<p>` são as tags da tela, escritas em JSX
- `export default App` é o dos módulos do E11: o arquivo entrega uma coisa principal

O Vite **compila** o JSX, isto é, traduz para JavaScript comum antes de chegar ao navegador. Parece HTML, mas tem três regras próprias. Quebrou uma, a página não compila.

---

## Regra 1: um único elemento raiz

O `return` devolve **um** elemento. Dois irmãos soltos não são permitidos.

::::columns
:::col
**Errado**

```jsx
return (
  <h1>Minhas Tarefas</h1>
  <p>Organize seu dia.</p>
)
```
:::
:::col
**Certo**

```jsx
return (
  <>
    <h1>Minhas Tarefas</h1>
    <p>Organize seu dia.</p>
  </>
)
```
:::
::::

`<>...</>` é o **fragmento**: agrupa sem criar uma `div` extra no HTML. Uma `<div>` em volta também funciona.

---

## Regra 2: className e atributos em camelCase

`class` e `for` são palavras reservadas do JavaScript (das classes do E15 e dos laços do E07), então o JSX as renomeia. Atributos compostos ficam em **camelCase**: a primeira palavra minúscula, as seguintes com inicial maiúscula.

::::columns
:::col
**Errado**

```jsx
<label class="rotulo" for="nome">
  Nome
</label>
```
:::
:::col
**Certo**

```jsx
<label className="rotulo" htmlFor="nome">
  Nome
</label>
```
:::
::::

| HTML | JSX |
|---|---|
| `class` | `className` |
| `for` | `htmlFor` |
| `onclick` | `onClick` |
| `tabindex` | `tabIndex` |

---

## Regra 3: toda tag fecha

No HTML, `<img>`, `<br>` e `<input>` podem ficar abertas. No JSX, não: tags sem conteúdo fecham com `/>`.

::::columns
:::col
**Errado**

```jsx
<img src="/logo.png" alt="Logo">
<br>
<input type="text">
```
:::
:::col
**Certo**

```jsx
<img src="/logo.png" alt="Logo" />
<br />
<input type="text" />
```
:::
::::

:::tip
Error Lens sublinha a tag aberta na hora, e o Vite mostra o erro no navegador com o número da linha.
:::

---

## Chaves no JSX

Numa página HTML, o que aparece se você escrever 2 + 2?

---

## :icon[variable] Expressões com chaves

Dentro do JSX, as **chaves `{}`** abrem uma janela para o JavaScript. O que está entre elas é calculado, e o resultado aparece na tela.

```jsx
<h1>Olá, {nome}</h1>
```

Em português: "escreva Olá, e depois o valor da variável `nome`".

Vale qualquer **expressão**, isto é, algo que produz um valor: variável, conta, chamada de função, até o ternário do E05. Não vale `if` nem `for` soltos: eles são comandos, não expressões.

---

## :icon[variable] Chaves na prática

Quatro expressões no mesmo componente:

```jsx
function App() {
  const nome = 'Ana'
  return (
    <>
      <h1>Olá, {nome}</h1>
      <p>2 + 2 = {2 + 2}</p>
      <p>Ano: {new Date().getFullYear()}</p>
      <p>{nome.toUpperCase()} tem {nome.length} letras</p>
    </>
  )
}
```

| No JSX | Na tela |
|---|---|
| `Olá, {nome}` | Olá, Ana |
| `2 + 2 = {2 + 2}` | 2 + 2 = 4 |
| `Ano: {new Date().getFullYear()}` | o ano atual |
| `{nome.toUpperCase()} tem {nome.length} letras` | ANA tem 3 letras |

---

## :icon[lightbulb] Pense

:::question
JSX é HTML?

Compare: `<div class="card">` funciona em HTML e quebra em JSX. `<p>{2 + 2}</p>` mostra 4 em JSX e mostra "{2 + 2}" em HTML.

Se não é HTML, o que é? Para onde vai o JSX depois que o Vite o processa?
:::

:::tip Resposta
JSX é JavaScript. O Vite traduz cada tag numa chamada de função, como `_jsxDEV("h1", ...)`. Por isso `class` conflita com a palavra reservada do JavaScript, e as chaves rodam JavaScript de verdade. As três regras vêm daí.
:::

---

## Componentes

Lembra das peças de Lego da aula 41? Como uma peça entra em outra?

---

## :icon[component] Seu primeiro componente: Saudacao

Um **componente** é uma peça de Lego da tela: pequena, reaproveitável, encaixa em outras. No código, é uma função que devolve JSX. Como fazer um:

- um arquivo próprio, um módulo como no E11, dentro de `src/components`
- nome começando com letra maiúscula: `Saudacao`
- `export default` no fim, para outros arquivos usarem

Crie a pasta `src/components` e, dentro dela:

```jsx
// src/components/Saudacao.jsx
function Saudacao() {
  const nome = 'Ana'
  return <p>Bem-vinda, {nome}!</p>
}

export default Saudacao
```

---

## :icon[component] Componentes na prática

Para usar a peça, o `App` importa e escreve o nome como se fosse uma tag:

```jsx
// src/App.jsx
import Saudacao from './components/Saudacao.jsx'

function App() {
  return (
    <>
      <h1>Minhas Tarefas</h1>
      <Saudacao />
    </>
  )
}
```

Na tela: "Minhas Tarefas" e, embaixo, "Bem-vinda, Ana!".

- `import Saudacao from ...` traz a peça, sem chaves, porque ela saiu com `export default`
- `<Saudacao />` encaixa a peça; a barra no fim fecha a tag (regra 3)
- Escreva `<Saudacao />` duas vezes, e a frase aparece duas vezes: a mesma peça, usada de novo

---

## Mensagens de erro

Acendeu uma luz no painel do carro: você ignora ou lê o que ela quer dizer?

---

## :icon[bug] Lendo uma mensagem de erro

Uma **mensagem de erro** é a luz do painel do carro: diz o que aconteceu e onde. O Vite mostra o erro no navegador (tela de fundo escuro) e no terminal.

```plaintext
[plugin:vite:oxc] Transform failed with 1 error:
[PARSE_ERROR] Adjacent JSX elements must be wrapped in an enclosing tag.
   ╭─[ src/App.jsx:6:5 ]
 6 │     <Saudacao />
   │     ┬
   │ Help: Did you want a JSX fragment `<>...</>`?
```

Como ler, nesta ordem:

1. **Arquivo e posição**: `src/App.jsx:6:5` é o arquivo, a linha 6 e a coluna 5
2. **Mensagem**: "elementos JSX adjacentes precisam de uma tag em volta"
3. **Help**: a sugestão de conserto, aqui o fragmento `<>...</>`
4. Corrija e salve: a tela de erro some sozinha

O formato muda entre versões do Vite, mas arquivo, linha e mensagem estão sempre lá.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `does not provide an export named 'default'` | faltou o `export default`; tela em branco | `export default Nome` no fim |
| ``Invalid DOM property `class` `` | `class` no lugar de `className`; só um aviso | trocar por `className` |
| `Adjacent JSX elements must be wrapped` | dois irmãos sem raiz | fragmento `<>...</>` |
| `Expected corresponding JSX closing tag for 'img'` | uma tag sem `/>` | fechar com `/>` |
| `Missing script: "dev"` ou `Could not read package.json` | o terminal está fora de `minhas-tarefas` | `cd minhas-tarefas` |

Sem mensagem nenhuma: `<saudacao />`, com minúscula, vira tag HTML desconhecida e fica vazio.

---

## :icon[list-checks] Resumo

:::summary
- `npm create vite@latest`, `cd`, `npm install` e `npm run dev` criam e ligam o projeto
- `index.html` carrega `main.jsx`, que renderiza `App.jsx` dentro da `div#root`
- **JSX** é HTML dentro do JavaScript, com três regras: uma raiz, `className` em camelCase, toda tag fecha
- Chaves `{}` colocam qualquer expressão JavaScript dentro do JSX
- Um **componente** é uma função que retorna JSX, exportada com `export default` e usada como tag
:::

---

## :icon[flask-conical] No laboratório

Monte a base do app **Minhas Tarefas** e publique no GitHub.

:::steps
1. Crie e rode o projeto com os 4 comandos, fora da pasta do `lojinha-regras`
2. `git init`, `git add .` e `git commit -m "Cria o projeto"`, o ciclo do E03
3. Limpe o modelo: `App` devolve só um fragmento vazio; esvazie `App.css`
4. Crie `src/components/Cabecalho.jsx` com um `<header>` e o título "Minhas Tarefas"
5. Crie `src/components/Rodape.jsx` com um `<footer>`: seu nome e o ano via `{new Date().getFullYear()}`
6. Use os dois no `App`, rode `npm run lint`, faça o segundo commit e o push para um repositório público
:::

**Critérios**: roda sem erro; lint limpo; dois componentes em arquivos próprios; 2 commits ou mais, sem `node_modules`. **Entrega**: o link do repositório.

---

## :icon[milestone] Projeto 4 · Livro de receitas

Do E21 ao E25, além do laboratório, você constrói **sozinho** um app React: um livro de receitas que busca pratos numa API, filtra pela dificuldade, guarda as favoritas e mostra o modo de preparo.

| Encontro | Etapa |
|---|---|
| E21 | projeto Vite e cartão fixo |
| E22 | lista com props e CSS Modules |
| E23 | favoritas, busca e filtro |
| E24 | API e hooks próprios |
| E25 | detalhe, README e entrega |

Um repositório só seu, `livro-de-receitas`, com um commit por etapa. Entrega pela plataforma até o **início do E26**; nota mínima 70.

---

## :icon[milestone] Projeto 4 · Etapa 1: projeto Vite e cartão fixo

Fora das pastas dos outros projetos:

- crie o `livro-de-receitas` com os 4 comandos desta aula
- `Cabecalho` com o título "Livro de Receitas"
- `CartaoReceita` fixo da pizza margherita: foto com `alt`, nome, cozinha, dificuldade e porções
- o tempo total por uma expressão: `{preparo + cozimento}` min
- README com como rodar, `npm run lint` limpo e push num repositório público

Commit: `Projeto 4: etapa 1, projeto Vite e cartão fixo`. Enunciado completo e entrega: página do curso, em **Projetos**.
