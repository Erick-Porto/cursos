---
title: "Projeto 2 · Agenda de contatos"
summary: "A agenda do celular em JavaScript: a ficha de cada contato, busca, ordem, mudanças sem rasurar o original e validação, com testes e uma página pronta."
section: Módulo Básico
module: linguagem-js
opens: e13-objetos
due: e17-condicoes-legiveis
due_label: início do E17
passing_score: 70
required: true
rubric:
  - key: regras
    title: Regras da agenda
    points: 35
    description: "As 14 funções existem nos arquivos combinados, com os nomes e os parâmetros do enunciado, e dão os resultados das tabelas das Regras, inclusive nas bordas: termo vazio, 'zé', id que não existe, contato sem aniversário, lista vazia no proximoId e as quatro mensagens da validação."
  - key: sem-rasurar
    title: Sem rasurar o original
    points: 15
    description: "Nenhuma função muda a lista ou o contato que recebeu: adicionar, editar, remover e ordenar devolvem uma lista nova. Na página, Remover e Salvar seguidos de Desfazer voltam a agenda de antes, e o aviso \"mudou a lista que recebeu\" não aparece."
  - key: testes
    title: Testes
    points: 20
    description: "`npm test` verde, com pelo menos um teste para cada função e as bordas das tabelas, inclusive os testes de que a lista recebida não muda."
  - key: modulos
    title: Módulos e a página web
    points: 15
    description: "Cada função no arquivo combinado, `NOMES_DOS_GRUPOS` em src/regras/grupos.js importada por contato.js e validacao.js, `validarContato` com export default e regras sem console.log. Com `npx serve .`, a página mostra 14 de 14 funções."
  - key: entrega
    title: Repositório, commits e README
    points: 15
    description: "Repositório público agenda-de-contatos no GitHub, sem node_modules, com o commit do kit e os commits das etapas 1 a 4, cada um com o nome da etapa, e um README que explica o projeto e como rodar, com o print da página."
steps:
  - lesson: e13-objetos
    when: E13
    title: A ficha do contato
    summary: "O kit da agenda rodando e no GitHub; criarContato, descreverContato e formatarAniversario em src/regras/contato.js, com testes."
  - lesson: e14-listas-a-fundo
    when: E14
    title: Buscar, ordenar e nomes
    summary: "nomesDosContatos, buscarPorId, buscarContatos e ordenarPorNome em src/regras/lista.js, com testes; npm run agenda mar busca no terminal."
  - lesson: e15-sem-rasurar-o-original
    when: E15
    title: Adicionar, editar, remover e agrupar
    summary: "proximoId, adicionarContato, removerContato e editarContato sem mudar a lista recebida; agruparPorLetra com reduce e aniversariantesDoMes."
  - lesson: e16-modulos-e-a-agenda-na-web
    when: E16
    title: Validação e a agenda na web
    summary: "validarContato com export default, NOMES_DOS_GRUPOS em grupos.js, a página pronta ligada às suas funções, README com print e entrega."
---

## O que você vai construir

A agenda de contatos do celular parece simples: uma lista de nomes. Por trás dela, cada contato é uma **ficha** com nome, telefone, e-mail, grupo e aniversário. A agenda busca pelo nome ou por um pedaço do telefone, põe tudo em ordem alfabética, separa por letra, mostra quem faz aniversário no mês e confere os campos antes de salvar um contato novo. E, quando você apaga alguém sem querer, o **Desfazer** traz de volta.

Neste projeto, você escreve essas regras em JavaScript, com testes no Jest. O curso dá um **kit** com a pasta do projeto montada: os 15 contatos de exemplo, o Jest já configurado e uma **página web pronta**, que chama as suas funções. Você constrói o projeto do E13 ao E16, em 4 etapas, uma por encontro. A etapa **é a prática da aula**: a maior parte você faz junto com o instrutor, e a parte "Sua vez" você termina sozinho, no fim do encontro.

No terminal, `npm run agenda mar` busca "mar" no nome e no telefone e mostra o resultado em ordem e por letra:

```plaintext
Agenda: 15 contatos
Encontrados: 3
Helena Martins, (11) 3456-7890, Família, aniversário 02/07
Marcos Teixeira, (61) 98234-7766, Trabalho, aniversário 19/11
Mariana Souza, (11) 98765-4321, Amigos, aniversário 30/10

H: Helena Martins
M: Marcos Teixeira, Mariana Souza
```

No navegador, a página do kit mostra a busca, os aniversariantes do mês, o formulário de novo contato com as mensagens da sua validação e a lista separada por letra, com Copiar, Editar e Remover em cada contato. A página não tem regra nenhuma: ela importa as **suas** funções de `src/regras/`. Por isso os nomes, os parâmetros e os arquivos abaixo são combinados e não podem mudar.

O repositório, no fim:

```plaintext
agenda-de-contatos/
├── src/
│   ├── data/contatos.js        os 15 contatos de exemplo (kit)
│   ├── regras/texto.js         soDigitos e inicial, prontas (kit), e o texto.test.js
│   ├── regras/contato.js       a ficha de um contato (E13)
│   ├── regras/lista.js         buscar, ordenar, nomes (E14), agrupar e aniversariantes (E15)
│   ├── regras/edicao.js        adicionar, remover e editar (E15)
│   ├── regras/grupos.js        os nomes dos grupos (E16)
│   ├── regras/validacao.js     a conferência do formulário (E16)
│   ├── regras/*.test.js        um arquivo de testes para cada arquivo de regras
│   └── scripts/agenda.js       o que o npm run agenda mostra
├── web/                        a página pronta (kit)
├── docs/agenda.png             o print do README (E16)
├── babel.config.json, package.json, package-lock.json, .gitignore
└── README.md
```

O projeto é individual: um repositório próprio, `agenda-de-contatos`, na pasta de projetos, ao lado do `racha-conta` e nunca dentro dele.

## O kit

Baixe [agenda-de-contatos.zip](materiais/projeto-2/agenda-de-contatos.zip) no E13. Ele traz:

| Arquivo | O que é |
|---|---|
| `package.json` e `package-lock.json` | `"type": "module"`, os scripts `test` e `agenda`, e o Jest 30.5.2, o babel-jest 30.5.2 e o @babel/preset-env 7.29.7, os mesmos do Racha-conta |
| `babel.config.json` | o mesmo do Racha-conta: deixa o Jest entender `import` e `export` |
| `src/data/contatos.js` | a lista `contatos`, com `export` |
| `src/regras/texto.js` e `texto.test.js` | duas funções prontas, com os testes delas: `soDigitos(texto)` e `inicial(nome)` |
| `src/regras/contato.js`, `lista.js`, `edicao.js` e `validacao.js` | só um comentário com o que entra em cada um |
| `src/scripts/agenda.js` | o script do `npm run agenda`: por enquanto, os 15 nomes |
| `web/` | a página pronta: `index.html`, `estilo.css` e `tela.js` |
| `README.md` | o README de partida, que você completa no E16 |

O zip não traz o `.gitignore`: arquivos que começam com ponto ficam fora dele. Você cria o seu no primeiro passo.

Cada contato de `src/data/contatos.js` é uma ficha com estes campos:

| Campo | Exemplo | Observação |
|---|---|---|
| `id` | `1` | número, um por contato |
| `nome` | `'Mariana Souza'` | |
| `telefone` | `'(11) 98765-4321'` | com DDD, como na tela do celular |
| `email` | `'mariana.souza@exemplo.com'` | `''` quando não foi informado |
| `grupo` | `'amigos'` | `'familia'`, `'amigos'` ou `'trabalho'` |
| `aniversario` | `{ dia: 30, mes: 10 }` | uma ficha dentro da ficha; `null` quando não foi informado |
| `favorito` | `true` | `true` ou `false` |

Os contatos ficam estes, sem mudança, em todas as etapas: os testes e as saídas do "Pronto quando" usam eles.

As duas funções prontas do kit:

- `soDigitos(texto)`: só os algarismos. `soDigitos('(11) 98765-4321')` dá `'11987654321'`
- `inicial(nome)`: a primeira letra, maiúscula e sem acento. `inicial('Álvaro Mendes')` dá `'A'`

## As funções combinadas

Todas com `export`, nos arquivos da tabela. Funções auxiliares, só para você, ficam à vontade, no mesmo arquivo.

| Função | Arquivo | Devolve | Etapa |
|---|---|---|---|
| `criarContato(id, dados)` | `contato.js` | a ficha de um contato novo | E13 |
| `descreverContato(contato)` | `contato.js` | uma linha de texto com nome, telefone e grupo | E13 |
| `formatarAniversario(contato)` | `contato.js` | o texto `'30/10'`, ou `'sem data'` | E13 |
| `nomesDosContatos(contatos)` | `lista.js` | uma lista só com os nomes | E14 |
| `buscarPorId(contatos, id)` | `lista.js` | o contato daquele id, ou `undefined` | E14 |
| `buscarContatos(contatos, termo)` | `lista.js` | uma lista com os contatos que têm o termo | E14 |
| `ordenarPorNome(contatos)` | `lista.js` | uma lista nova, em ordem alfabética | E14 |
| `proximoId(contatos)` | `edicao.js` | o maior id da lista mais 1 | E15 |
| `adicionarContato(contatos, dados)` | `edicao.js` | uma lista nova, com o contato novo no fim | E15 |
| `removerContato(contatos, id)` | `edicao.js` | uma lista nova, sem o contato daquele id | E15 |
| `editarContato(contatos, id, mudancas)` | `edicao.js` | uma lista nova, com aquele contato mudado | E15 |
| `agruparPorLetra(contatos)` | `lista.js` | um objeto `{ A: [...], B: [...] }` | E15 |
| `aniversariantesDoMes(contatos, mes)` | `lista.js` | uma lista com quem faz aniversário no mês | E15 |
| `validarContato(dados)` | `validacao.js`, com **export default** | uma lista de mensagens; vazia quando está tudo certo | E16 |

Exemplos de uso, que viram testes (`contatos` é a lista do kit):

```javascript
descreverContato(contatos[0]); // 'Mariana Souza, (11) 98765-4321, Amigos'
formatarAniversario(contatos[8]); // '03/03'
formatarAniversario(contatos[10]); // 'sem data': o Daniel não tem aniversário
buscarPorId(contatos, 4).nome; // 'Álvaro Mendes'
buscarContatos(contatos, 'MAR').length; // 3
ordenarPorNome(contatos)[0].nome; // 'Álvaro Mendes'
proximoId(contatos); // 16
removerContato(contatos, 2).length; // 14
Object.keys(agruparPorLetra(ordenarPorNome(contatos))).join(''); // 'ABCDEFGHJMPR'
nomesDosContatos(aniversariantesDoMes(contatos, 10)); // ['Juliana Ribeiro', 'Mariana Souza']
validarContato({ nome: '', telefone: '123', email: '', grupo: 'amigos', aniversario: null }).length; // 2
```

A página usa as 14. Com um nome diferente, mesmo numa letra, ou num arquivo diferente, ela avisa.

## Regras

### A ficha do contato

`dados` são os cinco campos do formulário: `{ nome, telefone, email, grupo, aniversario }`. O `email` pode vir `''` e o `aniversario` pode vir `null`. A página sempre manda os cinco.

- `criarContato(id, dados)` devolve a ficha `{ id, nome, telefone, email, grupo, aniversario, favorito }`. O `nome`, o `telefone` e o `email` perdem os espaços das pontas; o `aniversario` vai como veio; `favorito` é sempre `false`
- `descreverContato(contato)` devolve o nome, o telefone e o nome do grupo, separados por vírgula e espaço. O grupo aparece como na tela: `familia` vira `Família`, `amigos` vira `Amigos` e `trabalho` vira `Trabalho`
- `formatarAniversario(contato)` devolve dia e mês com dois algarismos cada, separados por barra. Sem aniversário, `'sem data'`

| Chamada | Resultado |
|---|---|
| `criarContato(16, { nome: '  Rafaela Lopes ', telefone: '(11) 91234-5678', email: '', grupo: 'amigos', aniversario: { dia: 2, mes: 9 } })` | `{ id: 16, nome: 'Rafaela Lopes', telefone: '(11) 91234-5678', email: '', grupo: 'amigos', aniversario: { dia: 2, mes: 9 }, favorito: false }` |
| `descreverContato(contatos[2])` | `'Helena Martins, (11) 3456-7890, Família'` |
| `formatarAniversario(contatos[0])` | `'30/10'` |
| `formatarAniversario(contatos[8])` | `'03/03'` |
| `formatarAniversario(contatos[10])` | `'sem data'` |

### Buscar e ordenar

- `nomesDosContatos(contatos)` devolve os nomes, na mesma ordem da lista
- `buscarPorId(contatos, id)` devolve o próprio contato da lista. Nenhum com aquele id: `undefined`
- `buscarContatos(contatos, termo)`: os espaços das pontas do termo não contam, e maiúsculas e minúsculas são iguais. Um contato entra quando o nome tem o termo, ou quando o telefone tem o termo do jeito que foi digitado. O resultado segue a ordem da lista. Termo vazio, ou só com espaços, devolve todos
- `ordenarPorNome(contatos)` devolve uma **cópia** em ordem alfabética, com as regras do português: Álvaro vem antes de Ana, e Érica fica entre Daniel e Fernanda. A lista recebida não muda de ordem

| Busca | ids no resultado |
|---|---|
| `'ana'` | `[1, 5, 7]`: Mariana, Juliana e Ana Beatriz |
| `'MAR'` | `[1, 3, 15]`: Mariana, Helena Martins e Marcos |
| `'9876'` | `[1, 10, 11]`, pelo telefone |
| `'(11) 3456'` | `[3]` |
| `'zé'` | `[]` |
| `'   '` | os 15, na ordem da lista |

### Mudanças sem rasurar o original

:::warning A regra que vale para todas
Nenhuma função muda a lista ou o contato que recebeu. Quem muda a agenda devolve uma **lista nova**, e quem chamou continua com a lista de antes. É isso que faz o Desfazer da página funcionar: ela guarda a lista de antes e volta para ela.
:::

- `proximoId(contatos)`: o maior id da lista mais 1. Lista vazia: 1. Não é o tamanho da lista mais 1: depois de uma remoção, o tamanho diminui e o id repetiria um que já existe
- `adicionarContato(contatos, dados)`: uma lista nova com o contato no fim, montado pelo `criarContato` com o `proximoId`
- `removerContato(contatos, id)`: uma lista nova sem o contato daquele id. Um id que não existe devolve uma lista com os mesmos contatos
- `editarContato(contatos, id, mudancas)`: uma lista nova em que o contato daquele id é uma **ficha nova**, com os campos de `mudancas` trocados e os outros como estavam. Os outros contatos passam como estão, sem cópia
- `agruparPorLetra(contatos)`: um objeto em que cada chave é a inicial do nome (a `inicial` do kit) e cada valor é a lista dos contatos dessa letra, na ordem em que vieram. Com a lista em ordem alfabética, as letras também saem em ordem: `A B C D E F G H J M P R`, com Álvaro e Ana juntos no A
- `aniversariantesDoMes(contatos, mes)`: `mes` vai de 1 a 12. Quem faz aniversário naquele mês, do dia menor para o maior. Quem tem `aniversario: null` nunca entra

| Chamada | Resultado |
|---|---|
| `proximoId([{ id: 3 }, { id: 9 }, { id: 5 }])` | `10` |
| `adicionarContato(contatos, dados)[15].id` | `16` |
| `editarContato(contatos, 2, { grupo: 'trabalho' })[1].grupo` | `'trabalho'`, e `contatos[1].grupo` continua `'amigos'` |
| `aniversariantesDoMes(contatos, 10)` | Juliana Ribeiro (dia 8) e Mariana Souza (dia 30) |
| `aniversariantesDoMes(contatos, 3)` | Fernanda Lima (dia 3) e Bruno Carvalho (dia 14) |
| `aniversariantesDoMes(contatos, 11)` | Marcos Teixeira (dia 19) |

### A conferência do formulário

`validarContato(dados)` sai do arquivo com `export default`. Ela devolve a lista dos problemas, na ordem dos campos, com estas mensagens, exatamente como estão. Tudo certo: `[]`.

| Campo | Regra | Mensagem |
|---|---|---|
| `nome` | não pode ficar vazio; espaços sozinhos contam como vazio | `Informe o nome` |
| `telefone` | 10 ou 11 dígitos, contando só os algarismos (o `soDigitos` do kit) | `O telefone precisa de 10 ou 11 dígitos, com o DDD` |
| `email` | pode ficar vazio; quando vem, precisa ter `@` e ponto | `E-mail inválido` |
| `grupo` | `'familia'`, `'amigos'` ou `'trabalho'` | `Escolha família, amigos ou trabalho` |

```javascript
validarContato({ nome: ' ', telefone: '123', email: 'ana@', grupo: 'vizinhos', aniversario: null });
// ['Informe o nome', 'O telefone precisa de 10 ou 11 dígitos, com o DDD',
//  'E-mail inválido', 'Escolha família, amigos ou trabalho']
```

Os nomes dos grupos (`Família`, `Amigos`, `Trabalho`) moram num lugar só: a ficha `NOMES_DOS_GRUPOS`, em `src/regras/grupos.js`, com `export`. O `contato.js` e o `validacao.js` importam de lá.

## Etapas

Cada etapa começa onde a anterior terminou e termina com um **commit** `Projeto 2: etapa N, nome da etapa` e o `git push`. Pode haver outros commits no meio; o da etapa marca o ponto em que ela ficou pronta.

Os passos "Juntos em aula" têm o código completo nos slides da aula do encontro. Quem faltou faz a etapa pelos slides e por este enunciado. A "Sua vez" você faz sozinho: os slides trazem o enunciado e as dicas, sem a resposta. Cada função ganha os seus testes no mesmo passo, num arquivo `.test.js` ao lado dela.

### Etapa 1 · E13: a ficha do contato

**Juntos em aula:**

1. **O kit.** Baixe o zip, extraia na pasta de projetos e abra no VS Code a pasta `agenda-de-contatos`, a que tem o `package.json`. No terminal: `npm install`, `npm test` (os 4 testes do kit passam) e `npm run agenda` (os 15 nomes). Crie o `.gitignore` com a linha `node_modules/`. Depois, `git init`, `git add .` e `git commit -m "Projeto 2: kit da agenda"`
2. **`criarContato(id, dados)`** em `src/regras/contato.js`, e o arquivo `src/regras/contato.test.js` com dois testes: a ficha inteira com `toEqual` e o aniversário lido com dois pontos, `contato.aniversario.dia`
3. **`descreverContato(contato)`**, com a ficha `NOMES_DOS_GRUPOS` e os colchetes: `NOMES_DOS_GRUPOS[contato.grupo]`. Dois testes, com a Mariana e a Helena. No `agenda.js`, cada linha passa a mostrar `descreverContato(contato)`

**Sua vez:** `formatarAniversario(contato)`, com três testes: a Mariana (`'30/10'`), a Fernanda (`'03/03'`, com o zero) e o Daniel (`'sem data'`). No `agenda.js`, cada linha ganha, no fim, `, aniversário ` e o `formatarAniversario`.

**Pronto quando** `npm test` passa com 11 testes e `npm run agenda` mostra as 15 linhas, como estas:

```plaintext
Agenda: 15 contatos
Mariana Souza, (11) 98765-4321, Amigos, aniversário 30/10
Bruno Carvalho, (21) 99812-3344, Amigos, aniversário 14/03
...
Daniel Rocha, (21) 98765-0099, Amigos, aniversário sem data
...
Marcos Teixeira, (61) 98234-7766, Trabalho, aniversário 19/11
```

**Commit:** `Projeto 2: etapa 1, a ficha do contato`. Depois, o repositório **público** `agenda-de-contatos` no GitHub e o primeiro `git push`, como no E05.

### Etapa 2 · E14: buscar, ordenar e nomes

**Juntos em aula:**

1. **`nomesDosContatos(contatos)`** em `src/regras/lista.js`, com `map`. O arquivo `src/regras/lista.test.js`, com dois testes
2. **`buscarPorId(contatos, id)`**, com `find`. Dois testes: o id 4 acha o Álvaro, e o id 99 dá `undefined`
3. **`buscarContatos(contatos, termo)`**, com `filter`, `toLowerCase` e `includes`. Um `test.each` com `'ana'`, `'MAR'`, `'9876'` e `'zé'`, e um teste do termo vazio. No `agenda.js`, o termo vem do comando, com o `if (process.argv[2])` do Racha-conta: `npm run agenda mar`

**Sua vez:** `ordenarPorNome(contatos)`, com a cópia `[...contatos]`, `sort` e `localeCompare`. Dois testes: o Álvaro primeiro e o Rafael por último, e a lista recebida continua com a Mariana na frente. No `agenda.js`, os encontrados aparecem em ordem.

**Pronto quando** `npm test` passa com 22 testes e `npm run agenda mar` mostra:

```plaintext
Agenda: 15 contatos
Encontrados: 3
Helena Martins, (11) 3456-7890, Família, aniversário 02/07
Marcos Teixeira, (61) 98234-7766, Trabalho, aniversário 19/11
Mariana Souza, (11) 98765-4321, Amigos, aniversário 30/10
```

**Commit:** `Projeto 2: etapa 2, buscar, ordenar e nomes` e `git push`.

### Etapa 3 · E15: adicionar, editar, remover e agrupar

**Juntos em aula:**

1. **`proximoId(contatos)`** e **`adicionarContato(contatos, dados)`** em `src/regras/edicao.js`, com `[...contatos, novo]`. O arquivo `src/regras/edicao.test.js`, com três testes, um deles de que a lista recebida continua com 15
2. **`removerContato(contatos, id)`**, com `filter`. Dois testes: sem o Bruno, a lista nova tem 14, e a recebida continua com 15
3. **`editarContato(contatos, id, mudancas)`**, com `map` e `{ ...contato, ...mudancas }`. Dois testes: o grupo mudou na lista nova, e na recebida não; e `nova[0]` é o mesmo contato de `contatos[0]` (`toBe`)
4. **`agruparPorLetra(contatos)`** em `lista.js`, com `reduce`, começando de `{}`, e a `inicial` do kit. Dois testes. No `agenda.js`, depois das linhas, uma linha por letra

**Sua vez:** `aniversariantesDoMes(contatos, mes)`, com três testes: outubro, março e uma lista só com o Daniel, que não tem aniversário.

**Pronto quando** `npm test` passa com 34 testes e `npm run agenda mar` termina com:

```plaintext
H: Helena Martins
M: Marcos Teixeira, Mariana Souza
```

**Commit:** `Projeto 2: etapa 3, adicionar, editar, remover e agrupar` e `git push`.

### Etapa 4 · E16: validação e a agenda na web

**Juntos em aula:**

1. **`validarContato(dados)`** em `src/regras/validacao.js`, com `export default`, conferindo o nome e o telefone. O arquivo `src/regras/validacao.test.js`, com dois testes. O `import` de um default não leva chaves: `import validarContato from './validacao.js'`
2. **`grupos.js`.** A ficha `NOMES_DOS_GRUPOS` sai do `contato.js` e vai para `src/regras/grupos.js`, com `export`. O `contato.js` passa a importar de lá. Os 36 testes continuam verdes
3. **A página web**, como na seção abaixo: as 14 funções encontradas, uma busca, um contato salvo, outro editado e um removido, com Desfazer
4. **O README**: uma frase sua sobre o que a agenda faz e o print da página, salvo como `docs/agenda.png`

**Sua vez:** o e-mail e o grupo no `validarContato`, com as mensagens da tabela. O grupo vale quando está entre as chaves de `NOMES_DOS_GRUPOS`, importada de `grupos.js`. Três testes: um e-mail com `@` e ponto passa, um sem `@` não passa, e o grupo `'vizinhos'` não passa.

**Pronto quando** `npm test` passa com 39 testes, a página mostra "Funções do seu projeto: 14 de 14" sem aviso, e salvar o formulário vazio mostra `Informe o nome`, a mensagem do telefone e `Escolha família, amigos ou trabalho`.

**Commit:** `Projeto 2: etapa 4, validação e a agenda na web`, `git push` e a entrega, em "Como entregar".

## A página web

A página veio no kit, na pasta `web/`. Não mude nada nela: a correção usa a página do curso.

1. Na raiz do projeto, `npx serve .`. Na primeira vez, o npm pergunta se pode instalar o `serve`: responda `y`
2. Abra o endereço que o `serve` mostrar, com `/web/` no fim: `http://localhost:3000/web/`
3. O painel "Funções do seu projeto" mostra quais das 14 a página achou e em que etapa cada uma nasce. Ela funciona desde o E13: cada etapa liga uma parte
4. Se uma função lançar um erro, devolver outra coisa ou mudar a lista que recebeu, a página diz qual função e o que aconteceu. Escreva um teste com o caso e corrija

Aberta com dois cliques no arquivo, a página não funciona: o navegador só importa módulos de um servidor. Para parar o servidor, <kbd>Ctrl</kbd> + <kbd>C</kbd> no terminal. Para o print, <kbd>Win</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd> recorta a tela.

## Como entregar

1. Repositório **público** `agenda-de-contatos` no seu GitHub, com tudo enviado (`git push`) e sem `node_modules`
2. Os commits, na ordem: `Projeto 2: kit da agenda` e os das etapas 1 a 4
3. README com o que a agenda faz, como rodar no terminal e na web e o print da página (a imagem fica no repositório, em `docs/`)
4. Na página deste projeto, cole o link do repositório (`https://github.com/seu-usuario/agenda-de-contatos`) e envie
5. Prazo: **início do E17**

Antes de enviar, rode na raiz: `npm test` e `npm run agenda mar`. Depois, abra a página e confira o 14 de 14. O instrutor corrige pela rubrica, critério por critério, e pode devolver o projeto para ajustes antes da nota final. A aprovação é com 70 pontos.

## Como será avaliado

| Critério | Pontos | Nota cheia | Nota parcial |
|---|---|---|---|
| Regras da agenda | 35 | as tabelas das Regras dão o resultado certo, nas bordas também | `'zé'` acha todo mundo, o Álvaro fica no fim da ordem, ou o id do contato novo repete |
| Sem rasurar o original | 15 | nada muda o que recebeu, e o Desfazer funciona | um `push`, um `sort` ou um `splice` na lista recebida |
| Testes | 20 | testes de cada função e das bordas, inclusive os de "não muda a lista" | só o caso comum, ou um teste vermelho |
| Módulos e a página web | 15 | cada função no seu arquivo, `grupos.js`, o default e 14 de 14 na página | uma função no arquivo errado, ou a ficha dos grupos repetida em dois arquivos |
| Repositório, commits e README | 15 | o commit do kit, os 4 das etapas e o README com print | todos os commits num dia só, ou README sem como rodar |

Um critério sem nada entregue vale zero. Código que você não sabe explicar também: o instrutor pode pedir, em aula, que você mostre uma função e diga o que cada linha faz.

## Dúvidas frequentes

**Extraí o zip e ficou uma pasta dentro da outra.** O Windows cria uma pasta com o nome do zip e põe a do kit dentro. Abra no VS Code a pasta `agenda-de-contatos` que tem o `package.json`. Na hora de extrair, você pode escolher a pasta de projetos como destino.

**Onde está o `.gitignore`?** O zip não traz arquivos que começam com ponto. Crie o seu na raiz, com a linha `node_modules/`, antes do primeiro `git add .`.

**Na instalação, o npm fala em `deprecated` e em vulnerabilidades.** São avisos sobre pacotes que o Jest usa por dentro e não afetam o projeto. Não rode `npm audit fix --force`: ele troca o Jest por uma versão antiga.

**O primeiro commit mostra vários `LF will be replaced by CRLF`.** São avisos do Windows sobre o fim de linha dos arquivos do kit. Não são erro; pode seguir.

**`npm run agenda (11) 3456` mostrou quase todos os contatos.** No terminal do VS Code (o PowerShell), os parênteses têm significado: eles somem, e a busca chega ao script como `11`. Use aspas: `npm run agenda "(11) 3456"`.

**`Cannot find module` no `npm run agenda`.** Um `import` sem o `.js` no fim. O Jest encontra o arquivo mesmo sem ele; o Node e o navegador, não. Escreva sempre `from './contato.js'`.

**A página fica em "Carregando as suas funções".** Ela foi aberta com dois cliques, e não pelo `npx serve .`, ou o endereço não tem o `/web/` no fim.

**A página diz que falta uma função que eu escrevi.** Confira o nome letra por letra, o `export` antes da função e o arquivo, na tabela das funções combinadas. Se ela estiver no arquivo errado, a página diz onde achou.

**A página diz que uma função "mudou a lista que recebeu".** A função rasurou o original: um `push`, um `sort` ou um `splice` direto na lista que chegou, ou um campo trocado no próprio contato. Tire uma cópia antes e devolva a cópia.

**Recarreguei a página e os contatos novos sumiram.** É assim mesmo: a página guarda tudo na memória do navegador, e recarregar volta aos 15 contatos do kit. Guardar os dados no navegador é assunto do E21.

**Posso trocar os contatos do kit pelos meus?** Não: os testes e as saídas do "Pronto quando" usam os 15 do kit. Na página, você pode cadastrar quantos quiser.

**Faltei a um encontro.** Faça a etapa pelos slides da aula e por este enunciado antes do encontro seguinte: ele começa onde ela termina.

**Não terminei a tempo.** Entregue o que tiver até o início do E17: o instrutor corrige o que existe e pode devolver para ajustes.

## Para ir além

Nada aqui vale ponto extra. É para quem terminou e quer praticar mais. A página já sabe usar as duas primeiras.

- `contarPorGrupo(contatos)`, em `lista.js`: quantos contatos há em cada grupo, `{ familia: 4, amigos: 6, trabalho: 5 }`. Os três grupos aparecem sempre, mesmo sem ninguém. Na página, a contagem aparece no topo
- `alternarFavorito(contatos, id)`, em `edicao.js`: uma lista nova em que o favorito daquele contato troca de `true` para `false`, e o contrário. Na página, a estrela de cada contato passa a funcionar, com Desfazer
- No `validarContato`, um dia que não existe no mês, como 31 de abril: `Esse dia não existe nesse mês`. Uma lista com o último dia de cada mês ajuda: `[31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]`
- A busca pelos algarismos do telefone, com o `soDigitos` do kit: `'11987654321'` acha a Mariana. Cuidado com o `'zé'`: ele não tem algarismo nenhum
- Publicar a página no GitHub Pages (Settings, Pages, branch `main`) e abrir `https://seu-usuario.github.io/agenda-de-contatos/web/`
