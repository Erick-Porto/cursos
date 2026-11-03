# Kit da lista de tarefas (Projeto 3)

Este é o começo do seu repositório `lista-de-tarefas`. A tela já vem pronta: você escreve as
regras e as classes em `src/`, com testes no Jest, e a tela usa o que você escreveu.

## O que vem pronto

| Arquivo | O que é |
|---|---|
| `package.json` | a ficha do projeto, com o script `test` e o Jest |
| `package-lock.json` | a versão exata de cada pacote, para todos instalarem as mesmas |
| `babel.config.json` | deixa o Jest entender `import` e `export` |
| `serve.json` | avisa ao navegador que busque sempre a versão nova dos seus arquivos |
| `web/` | a tela pronta: `index.html`, `estilo.css` e `tela.js`. Não precisa mexer |
| `src/utils/datas.js` | as datas do kit: `diasAte`, `somarDias`, `paraPrazo` e `ehDataValida` |
| `src/utils/datas.test.js` | os testes das datas do kit, que já passam |
| os outros arquivos de `src/` | vazios, com um comentário dizendo a etapa e o que entra em cada um |

## Primeiros passos

1. Descompacte, renomeie a pasta para `lista-de-tarefas` e abra no VS Code (`code .`)
2. No terminal, `npm install`
3. `npm test`: os testes das datas do kit passam
4. Crie o `.gitignore` com a linha `node_modules/`
5. `git init`, o primeiro commit e o repositório **público** `lista-de-tarefas` no GitHub
6. `npx serve .` e abra `http://localhost:3000/web/` no navegador

Não abra o `index.html` com dois cliques: pelo endereço `file://`, o navegador não importa os
arquivos de `src/`. Use sempre o `npx serve .`, rodado na pasta do `package.json`.

## A tela

A tela cresce com o projeto. Até a etapa 1, ela mostra só o que falta. Com as funções de
`src/regras/prazos.js`, aparecem as tarefas de demonstração. Com a classe `Tarefa`, o botão
Concluir funciona. Com a `ListaDeTarefas`, funcionam o formulário, o Remover e a tarefa que se
repete. Depois vêm as mensagens de erro, o salvamento e as tarefas de exemplo da internet.

No fim da página, a lista **O que a página usa** confere cada função e cada classe com os exemplos
do enunciado e diz o que ainda falta. Salvou um arquivo? Recarregue a página.

## Comandos

```bash
npm test        # os testes do Jest
npx serve .     # a tela no navegador, em http://localhost:3000/web/
```

O enunciado completo, com as etapas e a rubrica, está na página do curso, em **Projetos**. Na
etapa 6, troque este arquivo pelo README do seu projeto.
