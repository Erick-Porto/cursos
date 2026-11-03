# Agenda de contatos

Projeto 2 do curso Programador Mobile. Uma agenda de contatos de celular: as regras
(criar, descrever, buscar, ordenar, agrupar, adicionar, editar, remover e conferir contatos)
são funções em JavaScript, com testes no Jest, e uma página web pronta usa essas funções.

<!-- Etapa 4: troque este comentário por uma frase sua sobre o que a agenda faz. -->

## Como rodar

Na pasta do projeto, a que tem o `package.json`:

```bash
npm install          # baixa o Jest, uma vez por computador
npm test             # roda os testes
npm run agenda       # mostra a agenda no terminal
npm run agenda mar   # busca "mar" no nome e no telefone
```

## A agenda no navegador

```bash
npx serve .
```

Abra `http://localhost:3000/web/` no navegador. A página da pasta `web/` veio pronta no kit e
chama as funções de `src/regras/`.

<!-- Etapa 4: coloque aqui o print da página, salvo em docs/agenda.png:
![A agenda no navegador, com a busca e a lista por letra](docs/agenda.png) -->

## Pastas

- `src/data/contatos.js`: os 15 contatos de exemplo do kit
- `src/regras/`: as funções da agenda, cada arquivo com os seus testes (`.test.js`)
- `src/scripts/agenda.js`: o que o `npm run agenda` mostra no terminal
- `web/`: a página pronta do curso
