---
title: "Projeto 2 · Agenda de contatos"
summary: "Agenda de celular em JavaScript: busca, grupos, aniversários, validação e favoritos com testes, e uma interface web pronta que usa as suas regras."
section: Módulo Básico
module: linguagem-js
opens: e08a-arrays-essenciais
due: e13a-if-else-e-switch
due_label: início do E13
passing_score: 70
required: true
rubric:
  - key: regras
    title: Regras da agenda
    points: 35
    description: "As 16 funções públicas existem com os nomes e parâmetros do enunciado e dão o resultado dos exemplos, inclusive nas bordas: termo vazio, inicial com acento, grupo sem ninguém, id que não existe, data que não existe."
  - key: testes
    title: Testes
    points: 20
    description: "`npm test` verde, com testes de cada função pública, das bordas e de que nenhuma regra altera a lista, o contato ou o Set que recebeu."
  - key: interface
    title: Interface web ligada
    points: 15
    description: "Com `npx serve .`, a página `/web/` abre com o painel em 17 de 17 e tudo funciona: busca com debounce, histórico, filtros, aniversariantes, favoritos, cadastro com validação, edição, remoção e Desfazer."
  - key: organizacao
    title: Organização e dados protegidos
    points: 15
    description: "Pastas `data`, `regras`, `utils` e `scripts`, o barril `src/index.js`, os contatos congelados, regras sem `console.log`, scripts sem contas e `npm run lint` sem erros."
  - key: entrega
    title: Repositório, commits e README
    points: 15
    description: "Repositório público `agenda-de-contatos` com um commit por etapa, na mensagem pedida, e um README que explica como rodar testes, scripts e interface, com prints da tela."
steps:
  - lesson: e08b-objetos-e-colecoes
    when: E08
    title: Busca, ordem e histórico
    summary: "Repositório novo, dados de exemplo, `buscarContatos`, `ordenarPorNome` e `registrarBusca`, com testes e o script `buscar.js`."
  - lesson: e09b-imutabilidade-spread-e-desestruturacao
    when: E09
    title: Grupos, aniversários e cadastro
    summary: "`agruparPorInicial` e `contarPorGrupo` com `reduce`, `aniversariantesDoMes`, `adicionarContato` e `removerContato`, sem mutar."
  - lesson: e10b-recursao-e-decomposicao
    when: E10
    title: Validação e debounce
    summary: "`validarContato` montada com validadores pequenos, `debounce` com o script `digitar.js` e `doGrupo`, que devolve uma função."
  - lesson: e11b-referencia-e-copia
    when: E11
    title: Barril, dados congelados e edição
    summary: "O barril `src/index.js`, os contatos congelados com `Object.freeze` e `editarContato`, testados com os dados de verdade."
  - lesson: e12b-typescript
    when: E12
    title: Favoritos e a interface web
    summary: "Favoritos num `Set`, `indexarPorId` com `Map`, a interface web ligada às suas funções e o README com prints."
---

## O que você vai construir

A agenda de contatos de um celular. Você escreve as **regras** em JavaScript, com testes no Jest: buscar, ordenar, separar por letra, contar por grupo, achar os aniversariantes do mês, cadastrar, validar, editar, remover e marcar favoritos. O curso dá os 15 contatos de exemplo e, no E12, uma **interface web pronta** que chama as suas funções.

A tela final, aberta no navegador, tem:

- um campo de busca por nome ou telefone, que espera você parar de digitar (o debounce do E10) e guarda as buscas recentes
- filtros Família, Amigos e Trabalho, com a quantidade de cada grupo
- os aniversariantes do mês e a seção Favoritos
- a lista em ordem alfabética, separada por letra, com estrela, editar e remover (com Desfazer) em cada contato
- um formulário de novo contato que mostra, embaixo de cada campo, as mensagens da sua validação
- um painel que confere quais das suas funções a tela encontrou

Até o E12, as regras aparecem no terminal, por scripts como este:

```plaintext
$ node src/scripts/buscar.js ana 9876
"ana": 3 contato(s)
  Ana Beatriz Costa · (11) 99234-5678
  Juliana Ribeiro · (11) 97654-3210
  Mariana Souza · (11) 98765-4321
"9876": 3 contato(s)
  Daniel Rocha · (21) 98765-0099
  Érica Nogueira · (11) 99876-5401
  Mariana Souza · (11) 98765-4321
Buscas recentes: 9876, ana
```

O projeto é **individual**, num repositório próprio no GitHub, `agenda-de-contatos`, separado do `lojinha-regras`. Cada etapa usa só o que o encontro dela ensinou: o laboratório mostra como se faz na Lojinha, e o projeto mostra que você sabe fazer em outro lugar.

```plaintext
agenda-de-contatos/
├── package.json         "type": "module"; scripts test, lint, formatar e verificar
├── babel.config.json, eslint.config.js, .prettierrc, .gitignore
├── README.md
├── docs/                os prints da tela, para o README
├── src/
│   ├── index.js         o barril (E11): tudo o que a interface usa sai daqui
│   ├── data/            contatos.js, fornecido pelo curso
│   ├── regras/          agenda.js, historico.js, validacao.js, favoritos.js e os testes
│   ├── utils/           texto.js, funcoes.js e os testes
│   └── scripts/         buscar.js, resumo.js e digitar.js
└── web/                 a interface pronta (E12): index.html, estilo.css e tela.js
```

## Os dados

Abra [contatos.js](materiais/projeto-2/contatos.js) e salve como `src/data/contatos.js` no seu repositório. Ele exporta `grupos` e `contatos`, com 15 contatos fictícios. Cada contato tem:

| Campo | Exemplo | Observação |
|---|---|---|
| `id` | `1` | número, um por contato |
| `nome` | `'Mariana Souza'` | |
| `telefone` | `'(11) 98765-4321'` | com DDD: 10 dígitos (fixo) ou 11 (celular) |
| `email` | `'mariana.souza@exemplo.com'` | `''` quando não foi informado |
| `aniversario` | `'1998-10-30'` | `'AAAA-MM-DD'`, ou `''` quando não foi informado |
| `grupo` | `'amigos'` | `'familia'`, `'amigos'` ou `'trabalho'` |

Os exemplos deste enunciado usam esses 15 contatos. Nos testes, monte listas pequenas suas, com 3 a 5 contatos: fica mais fácil saber o resultado certo.

## As funções que a interface chama

A interface importa estas 16 funções e a lista `contatos` pelo **nome**, do seu `src/index.js`. Use exatamente estes nomes e esta ordem de parâmetros. Funções auxiliares, como uma `soDigitos`, você cria à vontade.

| Função | Etapa | Devolve |
|---|---|---|
| `buscarContatos(contatos, termo)` | E08 | array com os contatos que batem com o termo |
| `ordenarPorNome(contatos)` | E08 | array novo, em ordem alfabética |
| `registrarBusca(historico, termo)` | E08 | array novo, com até 5 buscas |
| `agruparPorInicial(contatos)` | E09 | objeto `{ A: [...], B: [...] }` |
| `contarPorGrupo(contatos)` | E09 | objeto `{ familia, amigos, trabalho }` |
| `aniversariantesDoMes(contatos, mes)` | E09 | array, do dia 1 ao 31 |
| `adicionarContato(contatos, dados)` | E09 | array novo, com o contato no fim |
| `removerContato(contatos, id)` | E09 | array novo, sem o contato |
| `validarContato(dados)` | E10 | objeto `{ campo: mensagem }`, ou `{}` |
| `debounce(fn, espera = 300)` | E10 | uma função que espera a pausa |
| `doGrupo(grupo)` | E10 | uma função de teste, para o `filter` |
| `editarContato(contatos, id, mudancas)` | E11 | array novo, com o contato alterado |
| `indexarPorId(contatos)` | E12 | `Map` de id para contato |
| `alternarFavorito(favoritos, id)` | E12 | `Set` novo |
| `ehFavorito(favoritos, id)` | E12 | `true` ou `false` |
| `listarFavoritos(favoritos, contatosPorId)` | E12 | array de contatos, em ordem alfabética |

:::warning Duas regras valem para todas
- Nenhuma regra muda o que recebeu: devolve uma lista, um objeto ou um `Set` novo, e quem chamou continua com o que tinha. É por isso que o Desfazer da interface funciona
- Regras e utilitários não imprimem nada. Quem imprime são os scripts de `src/scripts/`
:::

## Etapas

Cada etapa tem um slide na última aula do encontro, uns 15 minutos de aula para começar e até uma hora em casa para terminar. Termine com `npm run verificar` verde, um commit com a mensagem pedida e `git push`.

### Etapa 1 · E08: busca, ordem e histórico

**Repositório novo.** Faça como no Projeto 1:

:::steps
1. Pasta `agenda-de-contatos`, `npm init -y` e `"type": "module"` no `package.json`
2. `npm i -D jest babel-jest @babel/preset-env eslint @eslint/js globals prettier`
3. Copie do seu `racha-conta` (ou do `lojinha-regras`, que tem os mesmos) o `babel.config.json`, o `eslint.config.js`, o `.prettierrc`, o `.gitignore` e os scripts `test`, `lint`, `formatar` e `verificar` do `package.json`, e a pasta `.github/workflows/`, se ele tiver
4. `src/data/contatos.js`, com o arquivo da seção "Os dados"
5. `git init`, um repositório **público** no GitHub com o mesmo nome e o primeiro `push`
:::

**`buscarContatos(contatos, termo)`**, em `src/regras/agenda.js`. Um contato entra no resultado quando:

- o termo aparece em qualquer parte do **nome**, sem diferenciar maiúsculas; ou
- os **dígitos** do termo aparecem nos dígitos do **telefone**: parênteses, espaço e hífen não contam, nem no termo nem no telefone

Termo sem nenhum dígito não busca pelo telefone. Termo vazio, ou só com espaços, devolve todos. Espaços nas pontas do termo não contam, e o resultado segue a ordem da lista recebida.

| Chamada | ids no resultado |
|---|---|
| `buscarContatos(contatos, 'ana')` | `[1, 5, 7]`: Mariana, Juliana e Ana Beatriz |
| `buscarContatos(contatos, 'MAR')` | `[1, 3, 15]`: Mariana, Helena Martins e Marcos |
| `buscarContatos(contatos, '9876')` | `[1, 10, 11]` |
| `buscarContatos(contatos, '(11) 3456')` | `[3]` |
| `buscarContatos(contatos, 'zé')` | `[]`: e não os 15 |
| `buscarContatos(contatos, '   ')` | os 15, na ordem da lista |

Nesta etapa, use `for...of`, `if` e `push`, como no E07. O `filter` chega no E09.

**`ordenarPorNome(contatos)`**, no mesmo arquivo: uma **cópia** em ordem alfabética, com as regras do português. Álvaro Mendes vem antes de Ana Beatriz Costa, e Érica Nogueira fica entre Daniel e Fernanda. A lista recebida não muda de ordem.

**`registrarBusca(historico, termo)`**, em `src/regras/historico.js`: as buscas recentes, a mais nova na frente e no máximo 5. Uma busca repetida, sem diferenciar maiúsculas, não aparece duas vezes: ela sobe para a frente, com a grafia nova. Espaços nas pontas não contam, e uma busca vazia não entra.

| Histórico | Busca | Resultado |
|---|---|---|
| `['ana']` | `'bruno'` | `['bruno', 'ana']` |
| `['ana', 'bruno', 'carla']` | `'Bruno'` | `['Bruno', 'ana', 'carla']` |
| `['a', 'b', 'c', 'd', 'e']` | `'f'` | `['f', 'a', 'b', 'c', 'd']` |
| `['ana']` | `'   '` | `['ana']` |

**Testes**: pelo menos 10, com as bordas das tabelas e um "não altera a lista recebida" para cada função.

**Script** `src/scripts/buscar.js`: cada palavra do comando é uma busca. Para cada uma, imprime quantos contatos achou e os nomes em ordem alfabética, com o telefone; no fim, as buscas recentes. A saída esperada está em "O que você vai construir".

Commit: `Projeto 2: etapa 1, busca, ordem e histórico`.

### Etapa 2 · E09: grupos, aniversários e cadastro

Tudo em `src/regras/agenda.js`, com os métodos de array e o spread do E09, sem mudar o que a função recebe.

**`agruparPorInicial(contatos)`**, com `reduce`: um objeto em que cada chave é a inicial do nome, em maiúscula e **sem acento**, e cada valor é a lista dos contatos dessa letra, na ordem em que vieram. Álvaro fica no A, e Érica no E: o `semAcentos` do E06 ajuda. Com a lista em ordem alfabética, as letras também saem em ordem:

```javascript
agruparPorInicial(ordenarPorNome(contatos));
// { A: [Álvaro Mendes, Ana Beatriz Costa], B: [Bruno Carvalho], ..., M: [Marcos Teixeira, Mariana Souza], ... }
// 12 letras: A B C D E F G H J M P R
```

**`contarPorGrupo(contatos)`**, com `reduce`: quantos contatos há em cada grupo. Os três grupos aparecem **sempre**, mesmo sem ninguém: `contarPorGrupo(contatos)` dá `{ familia: 4, amigos: 6, trabalho: 5 }`, e `contarPorGrupo([])` dá `{ familia: 0, amigos: 0, trabalho: 0 }`. Pense no valor inicial.

**`aniversariantesDoMes(contatos, mes)`**: `mes` vai de 1 a 12. Devolve quem faz aniversário naquele mês, do dia menor para o maior; no mesmo dia, pelo nome. Quem tem `aniversario: ''` nunca entra.

| Chamada | Resultado |
|---|---|
| `aniversariantesDoMes(contatos, 10)` | Juliana Ribeiro (08/10) e Mariana Souza (30/10) |
| `aniversariantesDoMes(contatos, 3)` | Fernanda Lima (03/03) e Bruno Carvalho (14/03) |

O mês está no meio do texto `'AAAA-MM-DD'`: `slice` ou `split` do E06.

**`adicionarContato(contatos, dados)`**: `dados` traz `nome`, `telefone`, `email`, `aniversario` e `grupo`. Devolve uma lista nova com o contato no fim e o `id` igual ao **maior id da lista mais 1** (lista vazia: id 1). O `email` e o `aniversario` que não vierem ficam `''`, e um campo a mais em `dados`, como `senha`, não entra no contato. Esta função não valida: a validação é da etapa 3.

```javascript
const nova = adicionarContato(contatos, { nome: 'Rafaela Lopes', telefone: '(11) 91234-5678', grupo: 'amigos' });
nova.length; // 16
nova[15];    // { id: 16, nome: 'Rafaela Lopes', telefone: '(11) 91234-5678', email: '', aniversario: '', grupo: 'amigos' }
```

**`removerContato(contatos, id)`**: a lista sem o contato daquele id. Um id que não existe devolve os mesmos contatos.

**Testes**: pelo menos 12 novos, com as bordas acima (inicial com acento, grupo sem ninguém, mês sem aniversariante, maior id fora de ordem, lista vazia) e um "não altera a lista recebida" por função.

**Script** `src/scripts/resumo.js`: o total por grupo, os nomes por letra e os aniversariantes do mês passado no comando (sem ele, o mês de hoje).

```plaintext
$ node src/scripts/resumo.js 10
Agenda: 15 contatos
Família: 4 · Amigos: 6 · Trabalho: 5

A: Álvaro Mendes, Ana Beatriz Costa
B: Bruno Carvalho
...
M: Marcos Teixeira, Mariana Souza
P: Paula Fernandes
R: Rafael Gomes

Aniversariantes do mês 10: 2
  08/10 Juliana Ribeiro
  30/10 Mariana Souza
```

Commit: `Projeto 2: etapa 2, grupos, aniversários e cadastro`.

### Etapa 3 · E10: validação e debounce

**Validação**, em `src/regras/validacao.js`, dividida de cima para baixo, como na aula 20. Um validador pequeno por campo recebe o texto do campo e devolve `''` quando está tudo certo, ou a mensagem do problema. `validarContato(dados)` chama os cinco e devolve um objeto só com os campos que têm problema; com tudo certo, `{}`. Um campo que não veio em `dados` conta como `''`.

| Campo | Regra | Mensagem sugerida |
|---|---|---|
| `nome` | obrigatório, com pelo menos 2 letras sem os espaços das pontas | "Informe o nome" ou "O nome precisa de pelo menos 2 letras" |
| `telefone` | obrigatório, com 10 ou 11 dígitos, com ou sem máscara | "Informe o telefone" ou "Telefone com DDD: 10 ou 11 dígitos" |
| `email` | opcional; quando vem, tem texto antes do `@`, depois dele e um ponto no fim | "E-mail inválido" |
| `aniversario` | opcional; quando vem, no formato `AAAA-MM-DD` e uma data que existe | "Use o formato AAAA-MM-DD" ou "Essa data não existe" |
| `grupo` | `'familia'`, `'amigos'` ou `'trabalho'` | "Escolha família, amigos ou trabalho" |

As chaves (`nome`, `telefone`, `email`, `aniversario`, `grupo`) são fixas: a interface mostra cada mensagem embaixo do campo com esse nome. O texto das mensagens é seu.

```javascript
validarContato({ nome: '', telefone: '(11) 98765-4321', email: 'ana@', grupo: 'vizinhos' });
// { nome: 'Informe o nome', email: 'E-mail inválido', grupo: 'Escolha família, amigos ou trabalho' }
```

:::tip Ferramentas que você já tem
- `match` com grupos (E06) separa ano, mês e dia; `new Date(ano, mes - 1, dia)` "rola" uma data que não existe para o mês seguinte (E06), e aí o mês ou o dia não batem mais: `2001-02-29` e `1998-13-01` não existem, e `2000-02-29` existe
- Para o e-mail, `/^\S+@\S+\.\S+$/`: `\S` é tudo o que não é espaço, como o `\D` do E06 é tudo o que não é dígito
- Um objeto com uma função por campo, como os comparadores do E08, deixa o `validarContato` curto
:::

**`debounce(fn, espera = 300)`**, em `src/utils/funcoes.js`: a closure da aula 19. Para ver funcionando, o script `src/scripts/digitar.js` simula alguém digitando "mari" na busca: chama a busca com debounce com `'m'`, `'ma'`, `'mar'` e `'mari'`, uma a cada 120 ms (ou o intervalo passado no comando), e imprime cada busca que de fato roda.

```plaintext
$ node src/scripts/digitar.js
690 ms: "mari" acha 1
$ node src/scripts/digitar.js 400
319 ms: "m" acha 6
718 ms: "ma" acha 4
1124 ms: "mar" acha 3
1515 ms: "mari" acha 1
```

Os milissegundos mudam um pouco de uma máquina para outra.

**`doGrupo(grupo)`**, em `src/regras/agenda.js`: uma função de alta ordem, como o `daCategoria` da aula 19. Ela não filtra nada: devolve o teste que o `filter` usa. `contatos.filter(doGrupo('familia'))` dá os 4 contatos da família, e cada chamada lembra o próprio grupo.

**Testes**: os cinco validadores com as bordas (só espaços, 9 dígitos, data que não existe, grupo vazio), o `validarContato` com tudo certo, com vários erros e com um campo faltando, e o `doGrupo`. O `debounce` você confere pelo script.

Commit: `Projeto 2: etapa 3, validação e debounce`.

### Etapa 4 · E11: barril, dados congelados e edição

**O barril `src/index.js`**: reexporta a lista `contatos` (e os `grupos`, se você usa) de `src/data/contatos.js` e tudo o que os arquivos de `src/regras/` e `src/utils/` exportam. Os scripts passam a importar dele, com `'../index.js'`. Dentro de `regras/` e `utils/`, os arquivos continuam importando uns dos outros direto, nunca do barril.

**Dados congelados**: em `src/data/contatos.js`, congele cada contato e a lista com `Object.freeze` (o congelamento é raso: um nível de cada vez). Depois disso, `contatos.push(...)` ou `contatos[0].nome = 'Outra'` lançam `TypeError` em qualquer módulo, inclusive nos testes.

**`editarContato(contatos, id, mudancas)`**, em `src/regras/agenda.js`: uma lista nova em que o contato do id é um **objeto novo**, com os campos de `mudancas` trocados. O id nunca muda, mesmo que `mudancas` traga outro. Os outros contatos passam como estão, sem cópia. Um id que não existe devolve os mesmos contatos.

```javascript
const nova = editarContato(contatos, 2, { grupo: 'trabalho' });
nova[1].grupo;           // 'trabalho'
contatos[1].grupo;       // 'amigos': o original não mudou
nova[0] === contatos[0]; // true: quem não mudou é reaproveitado
```

**Testes com os dados de verdade**: um arquivo de teste que importa do barril confere que a lista e cada contato estão congelados e roda as regras das etapas anteriores sobre os 15 contatos congelados. Se alguma regra mexer no que recebe, o `TypeError` aparece no teste. Teste também o `editarContato`: os campos trocados, o id que não muda, os outros contatos iguais (`toBe`) e o id que não existe.

Commit: `Projeto 2: etapa 4, barril, dados congelados e edição`.

### Etapa 5 · E12: favoritos e a interface web

**Favoritos**, em `src/regras/favoritos.js`: os favoritos são um `Set` de ids. Acrescente o arquivo ao barril.

- `alternarFavorito(favoritos, id)`: um `Set` **novo**, com o id se ele não estava e sem o id se estava. O `Set` recebido não muda
- `ehFavorito(favoritos, id)`: `true` se o id está no `Set`. O id é número: `'3'` não é `3`
- `listarFavoritos(favoritos, contatosPorId)`: os contatos favoritos em **ordem alfabética**. Um id que saiu da agenda, porque o contato foi removido, é ignorado

**`indexarPorId(contatos)`**, em `src/regras/agenda.js`: um `Map` de id para contato, com os mesmos objetos da lista. É o segundo parâmetro do `listarFavoritos`.

```javascript
const porId = indexarPorId(contatos);
porId.get(4).nome; // 'Álvaro Mendes'
listarFavoritos(new Set([1, 4, 99]), porId); // [Álvaro Mendes, Mariana Souza]: o 99 não existe
```

**A interface**: baixe [interface-web.zip](materiais/projeto-2/interface-web.zip) e descompacte na raiz do repositório. Sai uma pasta `interface-web/`: renomeie para `web/`, com `index.html`, `estilo.css` e `tela.js` dentro. Não edite esses arquivos: a correção usa a interface do curso.

:::steps
1. Na raiz do repositório, `npx serve .`, o mesmo do Projeto 1
2. Abra o endereço que o `serve` mostrar com `/web/` no fim, por exemplo `http://localhost:3000/web/`
3. O painel do topo deve mostrar "17 de 17 ligadas". O que faltar aparece com o nome e a etapa
4. Use tudo: busque "mar" digitando rápido, tecle <kbd>Enter</kbd>, filtre a Família, marque duas estrelas, remova um favorito e desfaça, cadastre um contato com erros e depois certo, edite outro
:::

O `tela.js` importa todas as funções de `../src/index.js`. Ele começa com o comentário `/* global document */`, que avisa o ESLint que `document` existe no navegador: `npm run lint` continua limpo.

**README** final: o que é o projeto, como instalar, como rodar os testes, os scripts e a interface, e pelo menos dois prints da tela, um na largura de celular (o modo dispositivo do DevTools, <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>M</kbd>, do laboratório do E01) e um no computador. Guarde os prints em `docs/`.

**Testes**: os favoritos (acrescentar, tirar, não mudar o `Set` recebido, id como texto, ordem alfabética, id que não existe) e o `indexarPorId`.

Commit: `Projeto 2: etapa 5, favoritos e interface web`. Depois, a entrega.

## Como entregar

- Repositório **público** `agenda-de-contatos` no seu GitHub, com `node_modules` fora do git
- Um commit por etapa, com as mensagens das etapas. Commits a mais no meio são bem-vindos
- `npm run verificar` verde no último commit
- README com como rodar e os prints
- Na página deste projeto, cole o link do repositório até o **início do E13**. Se publicar a interface no GitHub Pages (veja "Para ir além"), cole também o link da demonstração

O instrutor corrige pela rubrica, critério por critério, e pode devolver o projeto para ajustes antes da nota final. Para aprovar, 70 de 100 pontos.

## Como será avaliado

**Regras da agenda (35 pontos).** O instrutor roda as 16 funções com os exemplos deste enunciado. Nota cheia: todas existem com os nomes e parâmetros da tabela e acertam os exemplos, inclusive as bordas. Parcial: cada borda errada tira poucos pontos (`'zé'` achando todo mundo, Álvaro fora do A, `contarPorGrupo([])` sem os zeros, 29 de fevereiro de 2001 aceito); cada função faltando ou errada no caso comum tira mais.

**Testes (20 pontos).** Nota cheia: `npm test` verde, com testes de cada função pública, das bordas e de que nenhuma regra altera o que recebeu, inclusive o arquivo que roda as regras sobre os dados congelados. Parcial: testes só do caso comum, funções sem teste ou algum teste vermelho.

**Interface web ligada (15 pontos).** Nota cheia: a página abre com o painel em 17 de 17, e busca, histórico, filtros, aniversariantes, favoritos, cadastro com mensagens, edição, remoção e Desfazer funcionam. Parcial: funções faltando ou com erro no painel, ou um recurso que não responde.

**Organização e dados protegidos (15 pontos).** Nota cheia: as pastas do projeto, o barril com tudo, os contatos congelados, nenhum `console.log` em `src/regras/` e `src/utils/`, scripts que só montam os dados, chamam as regras e imprimem, e `npm run lint` sem erros. Parcial: um desses pontos falhando.

**Repositório, commits e README (15 pontos).** Nota cheia: repositório público, os cinco commits das etapas, feitos ao longo dos encontros, e um README que permite a outra pessoa rodar tudo, com os prints. Parcial: commits das etapas faltando ou todos no mesmo dia, ou README sem como rodar ou sem prints.

## Para ir além

Sem ponto extra, para quem quiser treinar mais:

- Busca que ignora acentos: `'joao'` acha João Pedro Alves e `'erica'` acha Érica (o `semAcentos` do E06)
- Um teste do `debounce` com `jest.useFakeTimers()` e `jest.advanceTimersByTime(300)`: a documentação do Jest mostra como
- `diasAteOAniversario(contato, hoje)`, com as datas do E06, e um script que lista os próximos 3 aniversários
- Um rascunho `rascunhos/tipos.ts` com `type Contato` e `type Grupo = 'familia' | 'amigos' | 'trabalho'`, conferido com `npx tsc --noEmit`, como na aula 24
- Publicar a interface no GitHub Pages (Settings, Pages, branch `main`, pasta raiz) e abrir `https://seu-usuario.github.io/agenda-de-contatos/web/`

## Dúvidas frequentes

**Posso usar o código do laboratório?** Os utilitários genéricos, como o `debounce` e o `semAcentos`, podem vir do seu `lojinha-regras`. As regras da agenda você escreve, com os seus testes: copiar e colar pula justamente o treino. Na correção, o instrutor pode pedir para você explicar qualquer linha.

**Posso usar `filter` e `map` na etapa 1?** Eles chegam no E09. Na etapa 1, use `for...of` e `push`. No E09, se quiser, reescreva a busca com `filter`: os testes da etapa 1 provam que nada mudou.

**A interface fica em "Carregando as suas regras".** O `src/index.js` não carregou. Confira se você abriu pelo `npx serve .`, e não com dois cliques no arquivo, e se o endereço termina em `/web/`. Depois, abra o DevTools (<kbd>F12</kbd>), aba Console: um `import` sem `.js` ou um nome que o barril não exporta aparece lá, com o arquivo. O barril também não pode levar nada que só existe no Node, como o `fs` ou os scripts de `src/scripts/`, que usam o `process.argv`: o navegador não tem nenhum dos dois.

**O painel diz "falta" para uma função que eu escrevi.** Ou o nome está diferente do da tabela, ou o arquivo dela não está no `src/index.js`. Um "erro" no painel mostra a mensagem que a sua função lançou.

**Recarreguei a página e os contatos novos sumiram.** É assim mesmo: a interface guarda tudo na memória do navegador, e recarregar volta aos 15 contatos de exemplo. Salvar no aparelho é assunto do E43.

**O `npm test` diz "No tests found".** Na etapa 1, antes do primeiro teste, é esperado. Os arquivos de teste terminam em `.test.js` e ficam ao lado do código.

**Perdi um encontro.** O slide da etapa está na última aula do encontro, e o enunciado completo está aqui. Faça em casa e mantenha o commit daquela etapa: a etapa seguinte parte dela.
