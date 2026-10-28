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

## Por que um gerador de projeto?

No E02, você montou o `lojinha-regras` à mão: `npm init`, `"type": "module"` e os scripts. Um projeto React precisa de bem mais: um servidor local, um tradutor do código React para JavaScript comum, recarga automática e uma estrutura de pastas. Montar isso à mão levaria uma tarde inteira e muitos erros.

O **Vite** resolve com um comando: gera o projeto pronto e cuida da parte chata enquanto você escreve componentes.

:::question
Ao fim deste encontro, o app `minhas-tarefas` estará rodando no seu navegador e publicado no GitHub. Quantos arquivos você acha que vai precisar escrever para isso?
:::

---

## :icon[rocket] Criando o projeto em 4 comandos

No terminal, dentro da pasta onde você guarda os projetos:

```bash
npm create vite@latest minhas-tarefas -- --template react --eslint
cd minhas-tarefas
npm install
npm run dev
```

1. `npm create vite@latest`: baixa o gerador, como o `npx` do E02, e cria a pasta com o modelo **React** em JavaScript; `--eslint` traz o linter do E03
2. `cd minhas-tarefas`: entra na pasta nova; os próximos comandos rodam aqui
3. `npm install`: baixa o que o `package.json` lista, como no E02
4. `npm run dev`: roda o script `dev`, como o `npm run relatorio` do E02, e mostra um endereço como `http://localhost:5173`

Abra o endereço no navegador: a página de boas-vindas do Vite aparece.

:::tip
Se o gerador perguntar "Install with npm and start now?", escolha **No** com as setas: você roda os comandos você mesmo.
:::

---

## :icon[folder-tree] O que cada arquivo faz

| Arquivo | Função |
|---|---|
| `index.html` | a única página; tem a `<div id="root">` onde o React desenha tudo |
| `src/main.jsx` | ponto de partida: liga o React à `div#root` e renderiza o `App` |
| `src/App.jsx` | o componente principal; é aqui que você vai trabalhar |
| `package.json` | o mesmo do E02: `"type": "module"`, scripts (`dev`, `build`, `lint`) e pacotes |
| `node_modules/` | pacotes instalados pelo `npm install`; o `.gitignore` já o deixa fora do Git |
| `vite.config.js` | configurações do Vite; raramente você mexe aqui |

Também existem `src/App.css` e `src/index.css` (estilos), a pasta `public/` (arquivos estáticos) e o `eslint.config.js`, com as regras de lint para React (`npm run lint`).

---

## :icon[route] O caminho até a tela

Como o navegador chega ao seu componente? Três passos, sempre nesta ordem:

:::center
![Animação: o index.html carrega o main.jsx, o main.jsx renderiza o App e o que o App.jsx devolve aparece dentro da div root, na tela](images/e21-caminho-ate-a-tela.svg)
:::

O **`index.html`** tem uma `<div id="root"></div>` vazia e um `<script type="module" src="/src/main.jsx">`. O **`src/main.jsx`** encontra a `div#root` e pede ao React para renderizar o `App` dentro dela. Tudo o que o **`src/App.jsx`** devolver (e os componentes que ele usar) vira HTML ali dentro. O `getElementById` procura no DOM, como o `querySelector` da aula anterior.

```jsx
// src/main.jsx (resumido: o original também importa o index.css)
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(<App />)
```

---

## :icon[refresh-cw] npm run dev e a recarga automática

Com `npm run dev` ligado, o Vite vigia os arquivos. Salvou, a página atualiza sozinha: isso é o **hot reload**.

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

Isso é **JSX**: uma sintaxe que descreve a tela com tags, dentro do JavaScript. O Vite traduz para JavaScript comum antes de chegar ao navegador. O `export default` é o dos módulos do E11: o arquivo entrega uma coisa principal.

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

Vale qualquer **expressão** (algo que produz um valor): variável, conta, chamada de função, até o ternário do E05. Não vale `if` nem `for` soltos: eles são comandos, não expressões.

---

## :icon[lightbulb] Pense

:::question
JSX é HTML?

Compare: `<div class="card">` funciona em HTML e quebra em JSX. `<p>{2 + 2}</p>` mostra 4 em JSX e mostra "{2 + 2}" em HTML.

Se não é HTML, o que é? Para onde vai o JSX depois que o Vite o processa? Pense na resposta antes de avançar: ela explica as três regras.
:::

---

## :icon[component] Seu primeiro componente: Saudacao

Um **componente** é uma função que devolve JSX. Fica em um arquivo próprio (um módulo, como no E11), com nome iniciado em maiúscula, e sai com `export default`. Crie a pasta `src/components` e, dentro dela:

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

:::tip
O formato muda entre versões do Vite, mas arquivo, linha e mensagem estão sempre lá. O resto costuma ser repetição.
:::

---

## :icon[triangle-alert] Erros comuns

:::warning
- **Esquecer o `export default`.** A tela fica em branco e o Console diz "does not provide an export named 'default'". Todo componente termina com `export default Nome`.
- **Usar `class` em vez de `className`.** O React avisa no Console: "Invalid DOM property `class`".
- **Componente com letra minúscula.** `<saudacao />` é tratado como tag HTML desconhecida e aparece vazio. Componentes começam com maiúscula: `<Saudacao />`.
- **Esquecer de fechar a tag.** `<img src="...">` sem `/>` quebra a compilação; procure a linha que o Vite aponta.
- **Rodar `npm run dev` fora da pasta.** "Missing script: dev" (na pasta do `lojinha-regras`) ou "Could not read package.json": você não está em `minhas-tarefas`.
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
1. Crie e rode o projeto com os 4 comandos, fora da pasta do `lojinha-regras`
2. `git init`, `git add .` e `git commit -m "Cria o projeto"`, o ciclo do E03
3. Limpe o modelo: `App` devolve só um fragmento vazio; esvazie `App.css`
4. Crie `src/components/Cabecalho.jsx` com um `<header>` e o título "Minhas Tarefas"
5. Crie `src/components/Rodape.jsx` com um `<footer>`: seu nome e o ano via `{new Date().getFullYear()}`
6. Use os dois no `App`, rode `npm run lint`, faça o segundo commit e o push para um repositório público
:::

**Critérios**: roda sem erro; lint limpo; dois componentes em arquivos próprios; 2 commits ou mais, sem `node_modules`. **Entrega**: o link do repositório.
