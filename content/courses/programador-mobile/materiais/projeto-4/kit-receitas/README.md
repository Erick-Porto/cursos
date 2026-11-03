# Livro de Receitas

> **Etapa 4 (E27):** troque este parágrafo por duas ou três frases suas: o que o app mostra,
> o que a pessoa consegue fazer nele e de onde vêm as receitas.

## Como rodar

1. Instale as dependências (uma vez só): `npm install`
2. Ligue o servidor: `npm run dev`
3. Abra no navegador o endereço que aparece no terminal: `http://localhost:5173`

Para desligar o servidor, aperte `Ctrl + C` no terminal.

## Tela

> **Etapa 4 (E27):** tire um print do app funcionando, salve como `docs/tela.png`
> e troque este parágrafo por esta linha:
> `![Tela do Livro de Receitas](docs/tela.png)`

## Feito por

> **Etapa 4 (E27):** o seu nome e o link do seu GitHub.

---

## O kit

Este projeto começou do kit do Projeto 4 do curso Programador Mobile: um projeto
Vite + React com as peças prontas. Você escreve dois componentes, o `CartaoReceita`
e o `BotaoFavorito`, e a tela no `src/App.jsx`.

Antes do primeiro commit, crie na pasta do projeto o arquivo `.gitignore` com estas
duas linhas, para o Git deixar de fora os pacotes e o build:

```
node_modules/
dist/
```

### O que tem em cada pasta

| Arquivo ou pasta | O que é |
|---|---|
| `src/App.jsx` | a tela do app; é aqui que você trabalha |
| `src/components/` | as peças prontas do kit; o seu `CartaoReceita.jsx` e o seu `BotaoFavorito.jsx` entram aqui |
| `src/data/receitas.js` | 8 receitas para usar antes de ligar a API, no mesmo formato da DummyJSON |
| `src/styles/` | o CSS pronto; `cartao.css` tem as classes do seu cartão e do seu botão |
| `src/main.jsx` | liga o React à página; você não precisa mexer |
| `index.html`, `vite.config.js` | a página e a configuração do Vite; você não precisa mexer |

### Peças prontas (`src/components/`)

| Componente | Props | O que mostra |
|---|---|---|
| `Cabecalho` | `totalFavoritas` (opcional, número) | o nome do app e, se receber o número, "Nenhuma favorita", "1 favorita" ou "N favoritas" |
| `Rodape` | `autor` (opcional, texto) | "Feito por" com o seu nome e o crédito da DummyJSON |
| `CampoBusca` | `valor` (texto) e `aoMudar` (função) | o campo "Buscar receita"; a cada letra, chama `aoMudar` com o texto novo |
| `Etiqueta` | `dificuldade` (`'Easy'`, `'Medium'` ou `'Hard'`) | a etiqueta Fácil (verde), Média (amarela) ou Difícil (vermelha) |
| `ListaVazia` | `busca` (texto) | o aviso de que nenhuma receita passou na busca |
| `Carregando` | nenhuma | o aviso "Carregando receitas..." |
| `MensagemErro` | `texto` (texto) | a caixa vermelha com a mensagem de erro |

### Classes do seu cartão e do seu botão (`src/styles/cartao.css`)

| Classe | Onde vai |
|---|---|
| `cartao` | o `<article>` do cartão |
| `cartao__foto` | a `<img>` da receita |
| `cartao__corpo` | a `<div>` com os textos |
| `cartao__nome` | o `<h2>` com o nome |
| `cartao__info` | cada `<p>` de informação |
| `cartao__rodape` | a `<div>` do fim, com a etiqueta e o botão |
| `favorito` | o `<button>` de favoritar |
| `favorito--ativo` | junto com `favorito`, quando a receita é favorita |

Na tela, também entram `conteudo` (no `<main>`) e `grade` (na `<div>` que arruma os cartões).

### Versões

React 19.3.1, Vite 8.3.5 e @vitejs/plugin-react 6.2.1. O `package-lock.json` guarda
as versões exatas: com ele, o `npm install` instala as mesmas em todos os computadores.

Receitas e fotos: [DummyJSON](https://dummyjson.com/docs/recipes), uma API de testes.
