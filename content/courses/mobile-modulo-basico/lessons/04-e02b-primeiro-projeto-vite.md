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

Programador Mobile: Módulo Básico · Encontro E02 · Aula 4 de 18

---

## O que você vai aprender

:::goal
- Criar e rodar o projeto `minhas-tarefas` com Vite
- Reconhecer o que cada arquivo do projeto faz
- Escrever JSX válido, com as três regras e as expressões entre chaves
- Criar um componente em arquivo próprio e usá-lo no `App`
:::

---

## Por que um gerador de projeto?

Um projeto React de verdade precisa de um servidor local, de um tradutor do código React para JavaScript comum, de recarga automática e de uma estrutura de pastas. Montar isso à mão levaria uma tarde inteira e muitos erros.

O **Vite** resolve com um comando: gera o projeto pronto e cuida da parte chata enquanto você escreve componentes.

:::question
Ao fim deste encontro, o app `minhas-tarefas` estará rodando no seu navegador e publicado no GitHub. Quantos arquivos você acha que vai precisar escrever para isso?
:::

---

## :icon[rocket] Criando o projeto em 4 comandos

No terminal, dentro da pasta onde você guarda os projetos:

```bash
npm create vite@latest minhas-tarefas -- --template react
cd minhas-tarefas
npm install
npm run dev
```

1. `npm create vite@latest`: baixa o gerador do Vite e cria a pasta `minhas-tarefas` com o modelo **React** em JavaScript
2. `cd minhas-tarefas`: entra na pasta nova; todos os próximos comandos rodam aqui
3. `npm install`: baixa o React e as ferramentas listadas no `package.json`
4. `npm run dev`: liga o servidor de desenvolvimento e mostra um endereço como `http://localhost:5173`

Abra o endereço no navegador: a página de boas-vindas do Vite aparece.

:::tip
Se o gerador fizer perguntas extras, responda com `Enter` para aceitar o padrão.
:::

---

## :icon[folder-tree] O que cada arquivo faz

| Arquivo | Função |
|---|---|
| `index.html` | a única página; tem a `<div id="root">` onde o React desenha tudo |
| `src/main.jsx` | ponto de partida: liga o React à `div#root` e renderiza o `App` |
| `src/App.jsx` | o componente principal; é aqui que você vai trabalhar |
| `package.json` | nome do projeto, scripts (`dev`, `build`) e lista de pacotes |
| `node_modules/` | pacotes instalados pelo `npm install`; nunca vai para o Git |
| `vite.config.js` | configurações do Vite; raramente você mexe aqui |

Também existem `src/App.css` e `src/index.css` (estilos) e a pasta `public/` (imagens e arquivos estáticos).

---

## :icon[route] O caminho até a tela

Como o navegador chega ao seu componente? Três passos, sempre nesta ordem:

:::center
![Animação: o index.html carrega o main.jsx, o main.jsx renderiza o App e o que o App.jsx devolve aparece dentro da div root, na tela](images/e02-caminho-ate-a-tela.svg)
:::

O **`index.html`** tem uma `<div id="root"></div>` vazia e um `<script type="module" src="/src/main.jsx">`. O **`src/main.jsx`** encontra a `div#root` e pede ao React para renderizar o `App` dentro dela. Tudo o que o **`src/App.jsx`** devolver (e os componentes que ele usar) vira HTML ali dentro.

```jsx
// src/main.jsx (resumido)
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(<App />)
```

---

## :icon[refresh-cw] npm run dev e a recarga automática

Com `npm run dev` ligado, o Vite vigia os arquivos. Salvou, a página atualiza sozinha: isso é o **hot reload**.

Demonstração: abra `src/App.jsx`, troque o texto do `<h1>` e salve com `Ctrl + S`.

```jsx
<h1>Vite + React</h1>
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

## :icon[braces] JSX: HTML dentro do JavaScript

Abra `src/App.jsx`. Dentro de uma função JavaScript há algo que parece HTML:

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

Isso é **JSX**: uma sintaxe que descreve a tela com tags, dentro do JavaScript. O Vite traduz para JavaScript comum antes de chegar ao navegador.

Parece HTML, mas tem três regras próprias. Quebrou uma, a página não compila.

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

`class` e `for` são palavras reservadas do JavaScript, então o JSX as renomeia. Atributos compostos ficam em **camelCase**: a primeira palavra minúscula, as seguintes com inicial maiúscula.

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

## :icon[variable] Expressões com chaves

Dentro do JSX, **chaves `{}`** abrem uma janela para o JavaScript. O que está entre elas é calculado e o resultado aparece na tela.

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

Na tela: "Olá, Ana", "2 + 2 = 4", o ano atual e "ANA tem 3 letras".

Vale qualquer **expressão** (algo que produz um valor): variável, conta, chamada de função. Não vale `if` nem `for` soltos: eles são comandos, não expressões.

---

## :icon[lightbulb] Pense

:::question
JSX é HTML?

Compare: `<div class="card">` funciona em HTML e quebra em JSX. `<p>{2 + 2}</p>` mostra 4 em JSX e mostra "{2 + 2}" em HTML.

Se não é HTML, o que é? Para onde vai o JSX depois que o Vite o processa? Pense na resposta antes de avançar: ela explica as três regras.
:::

---

## :icon[component] Seu primeiro componente: Saudacao

Um **componente** é uma função que devolve JSX. Fica em um arquivo próprio, com nome iniciado em maiúscula, e sai com `export default`. Crie a pasta `src/components` e, dentro dela:

```jsx
// src/components/Saudacao.jsx
function Saudacao() {
  const nome = 'Ana'
  return <p>Bem-vinda, {nome}!</p>
}

export default Saudacao
```

Para usar, o `App` importa e escreve como se fosse uma tag:

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

---

## :icon[bug] Lendo uma mensagem de erro

Erro não é fracasso: é o Vite dizendo onde olhar. Ele aparece no navegador (tela de fundo escuro) e no terminal.

```plaintext
[plugin:vite:react-babel] /src/App.jsx: Adjacent JSX elements
must be wrapped in an enclosing tag. Did you want a JSX fragment <>...</>?
  5 |     <h1>Minhas Tarefas</h1>
> 6 |     <Saudacao />
    |     ^
```

Como ler, nesta ordem:

1. **Arquivo**: `/src/App.jsx`
2. **Linha**: a seta `>` aponta a linha 6 e o `^` marca a coluna
3. **Mensagem**: "elementos JSX adjacentes precisam de uma tag em volta", ou seja, faltou o fragmento `<>...</>`
4. Corrija e salve: a tela de erro some sozinha

:::tip
Leia a primeira linha do erro e a linha apontada pela seta. O resto costuma ser repetição.
:::

---

## :icon[triangle-alert] Erros comuns

:::warning
- **Esquecer o `export default`.** O `import` recebe nada e o React reclama: "Element type is invalid". Toda função de componente termina com `export default Nome`.
- **Usar `class` em vez de `className`.** O React avisa no console do navegador e a classe pode nem ser aplicada.
- **Componente com letra minúscula.** `<saudacao />` é tratado como tag HTML desconhecida e aparece vazio. Componentes começam com maiúscula: `<Saudacao />`.
- **Esquecer de fechar a tag.** `<img src="...">` sem `/>` quebra a compilação; procure a linha que o Vite aponta.
- **Rodar `npm run dev` fora da pasta.** Se o terminal diz "Missing script: dev", você não está em `minhas-tarefas`.
:::

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
1. `npm create vite@latest minhas-tarefas -- --template react`, depois `cd minhas-tarefas`, `npm install`, `npm run dev`
2. `git init`, `git add .` e `git commit -m "Cria o projeto"`
3. Limpe o modelo: `App.jsx` fica só com a função `App` retornando um fragmento vazio; esvazie `App.css`
4. Crie `src/components/Cabecalho.jsx` com um `<header>` e o título "Minhas Tarefas"
5. Crie `src/components/Rodape.jsx` com um `<footer>`: seu nome e o ano atual via `{new Date().getFullYear()}`
6. Use `<Cabecalho />` e `<Rodape />` no `App`; segundo commit e push para um repositório público no GitHub
:::

**Critérios**: roda sem erro; dois componentes em arquivos separados; repositório público com pelo menos 2 commits. **Entrega**: o link do repositório.
