# Ponto de partida: lista de tarefas (Projeto 3)

Este é o começo do seu repositório `lista-de-tarefas`. O HTML e o CSS já estão prontos para você
se concentrar no JavaScript.

## O que vem pronto

| Arquivo | O que é |
|---|---|
| `index.html` | a página inteira: formulário, busca, filtro, lista e o botão de importar |
| `estilo.css` | o visual, com tema claro e escuro e layout de celular e de computador |
| `package.json` | os scripts `test`, `lint` e `verificar`, com Jest e ESLint |
| `babel.config.json` | deixa o Jest entender `import` e `export` (E04) |
| `eslint.config.js` | regras recomendadas, globais do navegador no app e do Jest nos testes |
| `src/tela/app.js` | vazio: o código da tela começa aqui na etapa 3 |

A lista do `index.html` traz três tarefas escritas à mão. Elas são o **molde**: mostram o HTML e as
classes que o seu JavaScript vai criar para cada tarefa. Quando a sua renderização funcionar, ela
apaga o molde.

## Primeiros passos

1. Descompacte a pasta e renomeie para `lista-de-tarefas`
2. Abra a pasta no VS Code e rode `npm install` no terminal
3. Crie o arquivo `.gitignore` com a linha `node_modules/`
4. Rode `npx serve .` e abra o endereço que aparece (em geral, `http://localhost:3000`)
5. `git init`, primeiro commit e o repositório público `lista-de-tarefas` no GitHub (E03)

Não abra o `index.html` com dois cliques: pelo endereço `file://`, o navegador não carrega módulos
JavaScript. Use sempre o `npx serve .`.

## Comandos

```bash
npm test           # os testes do Jest
npm run lint       # o ESLint
npm run verificar  # os dois, em sequência
npx serve .        # o app no navegador
```

O enunciado completo, com as etapas e a rubrica, está na página do curso, em **Projetos**. Na
etapa 8, troque este arquivo pelo README do seu projeto.
