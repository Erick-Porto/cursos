---
title: Listas a fundo
summary: A agenda aprende a listar os nomes, achar um contato, buscar por um pedaço e pôr tudo em ordem alfabética.
module: linguagem-js
duration_minutes: 90
objectives:
  - Transformar listas com map e achar um item com find e findIndex
  - Perguntar à lista com some, every e includes e escrever a seta com chaves e return
  - "Ordenar nomes e números com sort, numa cópia feita com [...] ou slice"
  - Buscar, ordenar e listar os nomes da agenda de contatos
---

# Listas a fundo

Programador Mobile · Encontro E14 · Aula 14 de 45

---

## O que você vai aprender

:::goal
- Transformar cada item de uma lista com `map`
- Achar um item com `find` e perguntar à lista com `some`, `every` e `includes`
- Escrever o teste da peneira em várias linhas, com chaves e `return`
- Pôr nomes e números em ordem com `sort`, sem rasurar a lista original
- Fazer a etapa 2 do Projeto 2: a agenda busca e ordena
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **`map`** | a linha de produção da lista: cada item entra e sai transformado |
| **`find`** | a peneira que para no primeiro item que passa e entrega esse item |
| **`some`** e **`every`** | perguntas à lista inteira: "alguém passa?" e "todos passam?" |
| **`sort`** | põe a lista em ordem, mexendo na própria lista |
| **comparador** | a função que olha dois itens e diz qual vem antes |
| **cópia** | uma lista nova com os mesmos itens: mexer nela não rasura a original |

---

## A agenda ainda não busca

No celular, você digita "mar" e a agenda mostra só quem tem "mar", em ordem alfabética. A sua agenda, do E13, ainda ignora a palavra e mostra os 15 contatos, na ordem do arquivo.

::::columns
:::col
**Hoje,** `npm run agenda mar`:

```plaintext
Agenda: 15 contatos
Mariana Souza, (11) 98765-4321, Amigos, aniversário 30/10
Bruno Carvalho, (21) 99812-3344, Amigos, aniversário 14/03
(mais 13 linhas, na ordem do arquivo)
```
:::
:::col
**No fim do encontro:**

```plaintext
Agenda: 15 contatos
Encontrados: 3
Helena Martins, (11) 3456-7890, Família, aniversário 02/07
Marcos Teixeira, (61) 98234-7766, Trabalho, aniversário 19/11
Mariana Souza, (11) 98765-4321, Amigos, aniversário 30/10
```
:::
::::

:::question
Sem computador, como você acharia "mar" em 15 nomes? E como poria os 15 em ordem?
:::

---

## map

Na padaria, entram 15 bolinhas de massa no forno. Quantos pães saem?

---

## :icon[factory] map: a linha de produção

O **`map`** ("mapear") é a linha de produção da lista: cada item entra, passa pela máquina e sai transformado, na mesma quantidade e na mesma ordem. A máquina é uma seta, como o teste do `filter` da aula 3: ela recebe um item e devolve o que sai. Com os 15 contatos do kit:

```javascript
const nomes = contatos.map((contato) => contato.nome);

console.log(nomes.length);   // 15
console.log(nomes[0]);       // Mariana Souza
```

| Parte | O que ela diz |
|---|---|
| `contatos.map(...)` | "passe cada contato pela linha de produção" |
| `(contato) => contato.nome` | a máquina: entra a ficha, sai o nome |
| `const nomes = ...` | "guarde a lista nova": 15 textos |

A lista `contatos` não muda: continua com as 15 fichas.

---

## :icon[factory] map, item por item

A seta `(contato) => contato.nome` recebe uma ficha por vez. O que ela devolve vai para a mesma gaveta, na lista nova:

| Gaveta | Entra | Sai na lista nova |
|---|---|---|
| 0 | a ficha da Mariana | `'Mariana Souza'` |
| 1 | a ficha do Bruno | `'Bruno Carvalho'` |
| 2 | a ficha da Helena | `'Helena Martins'` |
| 3 a 13 | as fichas do Álvaro à Paula | um nome por gaveta |
| 14 | a ficha do Marcos | `'Marcos Teixeira'` |

Entram 15, saem 15. A peneira do `filter` tira quem não passa; a linha de produção do `map` não tira ninguém: troca cada item pelo que a seta devolve.

---

## :icon[factory] map na prática

Trocando a seta, a linha de produção faz outra peça. A lista `tres` tem os três primeiros contatos:

```javascript
const tres = [contatos[0], contatos[1], contatos[2]];

console.log(tres.map((contato) => contato.telefone));
// [ '(11) 98765-4321', '(21) 99812-3344', '(11) 3456-7890' ]

console.log(tres.map((contato) => contato.id));   // [ 1, 2, 3 ]

const precos = [72.9, 68.9, 14.5];
console.log(precos.map((preco) => Math.round(preco * 100)));   // [ 7290, 6890, 1450 ]
```

- **Os telefones**, para uma lista de discagem
- **Os ids**, para comparar resultados num teste: é o que o Passo 3 faz
- **Os preços do Racha-conta em centavos**, com o `Math.round` do E06

---

## :icon[notebook-pen] Exercícios: map

:::example Exercícios
1. Na promoção, tudo pela metade. O que aparece?
   ```javascript
   console.log([1000, 2500, 790].map((preco) => preco / 2));
   ```
2. Complete para sair a lista das notas, `[ 8, 5 ]`:
   ```javascript
   const alunos = [{ nome: 'Ana', nota: 8 }, { nome: 'Caio', nota: 5 }];
   console.log(alunos.map((aluno) => ___));
   ```
3. Para ficar só com os pedidos prontos, você usa `map` ou `filter`?
4. A chamada da escola sai em maiúsculas. Com `const chamada = ['ana', 'bruno'];`, escreva o `map` que dá `[ 'ANA', 'BRUNO' ]`
5. O que aparece?
   ```javascript
   const produtos = [{ nome: 'Arroz', preco: 2500 }, { nome: 'Sal', preco: 300 }];
   const caros = produtos.filter((produto) => produto.preco > 1000);
   console.log(caros.map((produto) => produto.nome));
   ```
:::

:::tip Respostas
1. `[ 500, 1250, 395 ]`: cada preço sai dividido por 2, na mesma ordem
2. `aluno.nota`: entra a ficha, sai a nota
3. `filter`: o `map` não tira ninguém, só transforma
4. `chamada.map((nome) => nome.toUpperCase())`
5. `[ 'Arroz' ]`: a peneira deixa só o arroz, e o `map` troca a ficha pelo nome
:::

---

## :icon[milestone] Projeto 2 · Passo 1: nomesDosContatos

Em `src/regras/lista.js`, abaixo do comentário do kit:

```javascript
// A lista só com os nomes, na mesma ordem.
export function nomesDosContatos(contatos) {
  return contatos.map((contato) => contato.nome);
}
```

Crie `src/regras/lista.test.js`, ao lado:

```javascript
import { contatos } from '../data/contatos.js';
import { nomesDosContatos } from './lista.js';

test('nomesDosContatos devolve os 15 nomes, na ordem da lista', () => {
  const nomes = nomesDosContatos(contatos);
  expect(nomes.length).toBe(15);
  expect(nomes[0]).toBe('Mariana Souza');
});

test('nomesDosContatos de uma lista com dois contatos', () => {
  expect(nomesDosContatos([contatos[0], contatos[1]])).toEqual(['Mariana Souza', 'Bruno Carvalho']);
});
```

O `toEqual` confere a lista gaveta por gaveta, como no E08.

**Pronto quando** `npm test` mostra `Test Suites: 3 passed, 3 total` e `Tests: 13 passed, 13 total`.

---

## find

Você procura a Helena na agenda do celular. Precisa ler os 15 nomes até o fim?

---

## :icon[search] find: o primeiro que passa

O **`find`** ("achar") é a peneira que para no primeiro item que passa no teste. Ele não devolve uma lista: devolve **o próprio item**. Se ninguém passa, devolve `undefined`, a caixa em que ninguém pôs nada (E10). O **`findIndex`** faz a mesma procura e devolve a **gaveta** do item.

```javascript
const alvaro = contatos.find((contato) => contato.id === 4);
const ninguem = contatos.find((contato) => contato.id === 99);
const gaveta = contatos.findIndex((contato) => contato.id === 4);

console.log(alvaro.nome);   // Álvaro Mendes
console.log(ninguem);       // undefined
console.log(gaveta);        // 3
```

| Método | Devolve | Se ninguém passa |
|---|---|---|
| `filter` | uma lista com todos que passam | `[]` |
| `find` | o primeiro que passa | `undefined` |
| `findIndex` | a gaveta do primeiro que passa | `-1` |

---

## :icon[search] find, item por item

Procurando o id 4. O `find` pergunta a uma ficha por vez e para na primeira que responde `true`:

| Gaveta | Contato | A pergunta vira | O `find`... |
|---|---|---|---|
| 0 | Mariana | `1 === 4`: `false` | segue |
| 1 | Bruno | `2 === 4`: `false` | segue |
| 2 | Helena | `3 === 4`: `false` | segue |
| 3 | Álvaro | `4 === 4`: `true` | para e entrega a ficha |
| 4 a 14 | os outros 11 | nenhuma | nem olha |

O `findIndex` faz a mesma volta e entrega a gaveta: `3`. Com o id 99, ninguém passa: o `find` entrega `undefined`, e o `findIndex`, `-1`.

---

## :icon[notebook-pen] Exercícios: find

:::example Exercícios
1. O que aparece?
   ```javascript
   const notas = [4, 7, 9, 6];
   console.log(notas.find((nota) => nota >= 7), notas.findIndex((nota) => nota >= 7));
   ```
2. Com as mesmas `notas`, o que `find` e `findIndex` devolvem com `nota > 10`?
3. Para saber o primeiro ônibus depois das 7h, você usa `filter` ou `find`? Por quê?
4. Em `linhas`, fichas com `numero` e `destino`, escreva a linha que acha a do `'703'`
5. Ache o erro: esta busca sempre devolve o primeiro produto
   ```javascript
   produtos.find((produto) => produto.codigo = 42);
   ```
:::

:::tip Respostas
1. `7 1`: o 7 é o primeiro que passa, e ele está na gaveta 1
2. `undefined` e `-1`: ninguém passa
3. `find`: ele entrega o primeiro que passa, e não uma lista
4. `linhas.find((linha) => linha.numero === '703')`
5. O `=` sozinho guarda o 42 no código, em vez de perguntar: use `===`
:::

---

## :icon[milestone] Projeto 2 · Passo 2: buscarPorId

No `lista.js`, depois da `nomesDosContatos`:

```javascript
// O contato daquele id. Se nenhum contato tem o id, undefined.
export function buscarPorId(contatos, id) {
  return contatos.find((contato) => contato.id === id);
}
```

No `lista.test.js`, o `import` ganha o nome novo: `import { nomesDosContatos, buscarPorId } from './lista.js';`. No fim do arquivo:

```javascript
test('buscarPorId acha o Álvaro, de id 4', () => {
  expect(buscarPorId(contatos, 4).nome).toBe('Álvaro Mendes');
});

test('buscarPorId de um id que não existe: undefined', () => {
  expect(buscarPorId(contatos, 99)).toBe(undefined);
});
```

Em `buscarPorId(contatos, 4).nome`, o `find` entrega a ficha, e o `.nome` lê o campo dela.

**Pronto quando** `npm test` mostra `Tests: 15 passed, 15 total` (3 suites).

---

## Perguntas à lista

"Alguém tem caneta?" e "Todos trouxeram documento?": quando você pode parar de perguntar?

---

## :icon[list-checks] some, every e includes: sim ou não

Três perguntas à lista inteira, com resposta `true` ou `false`:

- **`some`** ("algum"): **alguém** passa no teste? Como "alguém tem caneta?": a primeira mão levantada já responde sim
- **`every`** ("todos"): **todos** passam? Como "todos trouxeram documento?": o primeiro sem documento já responde não
- **`includes`** ("inclui"): **este item** está na lista? O de texto, do E09, procura um trecho; o de lista procura um item inteiro

```javascript
const algumSemData = contatos.some((contato) => contato.aniversario === null);
const todosComDDD = contatos.every((contato) => contato.telefone.startsWith('('));
const todosComEmail = contatos.every((contato) => contato.email !== '');
console.log(algumSemData, todosComDDD, todosComEmail);   // true true false

const grupos = ['familia', 'amigos', 'trabalho'];
console.log(grupos.includes('amigos'), grupos.includes('ami'));   // true false
```

O **`!==`** é o contrário do `===`: "é diferente?".

---

## :icon[list-checks] every, item por item

"Todos têm e-mail?" O `every` pergunta `contato.email !== ''` a uma ficha por vez e para no primeiro `false`:

| Gaveta | Contato | A resposta | O `every`... |
|---|---|---|---|
| 0 | Mariana | `true` | segue |
| 1 | Bruno | `true` | segue |
| 2 a 7 | Helena a Gustavo | `true` | segue |
| 8 | Fernanda, com `email: ''` | `false` | para e responde `false` |
| 9 a 14 | Érica a Marcos | nenhuma | nem olha |

O `some` faz o contrário: para no primeiro `true`. Em "alguém sem aniversário?", ele pergunta a 11 fichas e para no Daniel, na gaveta 10: `true`.

---

## :icon[notebook-pen] Exercícios: Perguntas à lista

:::example Exercícios
1. Na portaria da festa, o que aparece?
   ```javascript
   const idades = [17, 21, 34];
   console.log(idades.some((idade) => idade < 18), idades.every((idade) => idade >= 18));
   ```
2. O que `['pix', 'dinheiro'].includes('Pix')` devolve?
3. "Alguém da turma tirou 10?": `some` ou `every`?
4. Complete para "todas as mensalidades estão em dia": `mensalidades.every((m) => m.status ___ 'atrasada')`
5. Escreva a pergunta "algum item do `carrinho` está com `quantidade` 0?"
:::

:::tip Respostas
1. `true false`: o 17 já responde as duas perguntas
2. `false`: o `includes` de lista compara o item inteiro, e `'Pix'` não é `'pix'`
3. `some`: uma nota 10 já responde sim
4. `!==`, "é diferente?"
5. `carrinho.some((item) => item.quantidade === 0)`
:::

---

## A seta com chaves

E quando o teste da peneira precisa de duas perguntas antes de responder?

---

## :icon[square-function] Seta com chaves: o teste em várias linhas

Até aqui, o teste coube numa linha: a seta devolve o que vem depois do `=>`. Para mais passos, a seta ganha **chaves** `{ }` e vira uma receita com modo de preparo. Com chaves, ela só entrega o resultado com **`return`**, como a `function` do E07.

```javascript
// numa linha: devolve sozinha
const favoritos = contatos.filter((contato) => contato.favorito);

// com chaves: devolve o que vem depois do return
const favoritosDaFamilia = contatos.filter((contato) => {
  const daFamilia = contato.grupo === 'familia';
  return contato.favorito && daFamilia;
});
```

- `favoritos`: Mariana e Helena. `favoritosDaFamilia`: só a Helena, favorita **e** da família
- No `test` do E08, as chaves iam sem `return` porque ninguém usava a resposta. O `filter` usa: sem `return`, a resposta é `undefined`, e ninguém passa

---

## :icon[square-function] Seta com chaves na prática

**Caso 1: uma caixa para cada pergunta.** Quem é do trabalho e tem DDD 11?

```javascript
const trabalhoEmSP = contatos.filter((contato) => {
  const ddd11 = contato.telefone.startsWith('(11)');
  return ddd11 && contato.grupo === 'trabalho';
});
console.log(trabalhoEmSP.length);   // 3: Juliana, Gustavo e Carla
```

**Caso 2: o `map` com chaves e um `if`.** Os favoritos ganham uma marca; os outros saem como estão:

```javascript
const linhas = contatos.map((contato) => {
  if (contato.favorito) {
    return `${contato.nome} (favorito)`;
  }
  return contato.nome;
});
console.log(linhas[0], '|', linhas[1]);   // Mariana Souza (favorito) | Bruno Carvalho
```

**Caso 3: sem `return`.** `contatos.filter((contato) => { contato.favorito })` dá `[]`. No `map`, sai `undefined` em todas as gavetas.

---

## :icon[notebook-pen] Exercícios: A seta com chaves

:::example Exercícios
1. O que aparece? Por quê?
   ```javascript
   const dobro = (numero) => { numero * 2 };
   console.log(dobro(4));
   ```
2. Corrija o `dobro` para devolver `8`, ainda com chaves
3. O que aparece?
   ```javascript
   const etiquetas = [800, 1500, 300].map((preco) => {
     if (preco > 1000) {
       return 'caro';
     }
     return 'ok';
   });
   console.log(etiquetas);
   ```
4. Escreva, com chaves e uma caixa `notaBoa`, a peneira de `alunos` que deixa passar quem tem `nota` 7 ou mais e menos de 10 `faltas`
:::

:::tip Respostas
1. `undefined`: com chaves, a seta só devolve com `return`
2. `const dobro = (numero) => { return numero * 2; };`
3. `[ 'ok', 'caro', 'ok' ]`: só o 1500 sai pelo primeiro `return`
4. A peneira abaixo:
   ```javascript
   alunos.filter((aluno) => {
     const notaBoa = aluno.nota >= 7;
     return notaBoa && aluno.faltas < 10;
   });
   ```
:::

---

## :icon[milestone] Projeto 2 · Passo 3: buscarContatos

A busca da agenda: quem tem o termo no nome ou no telefone. No `lista.js`, depois da `buscarPorId`:

```javascript
// Os contatos que têm o termo no nome (sem diferenciar maiúsculas) ou no telefone.
// Termo vazio, ou só com espaços, devolve todos.
export function buscarContatos(contatos, termo) {
  const procurado = termo.trim().toLowerCase();
  return contatos.filter((contato) => {
    const noNome = contato.nome.toLowerCase().includes(procurado);
    const noTelefone = contato.telefone.includes(procurado);
    return noNome || noTelefone;
  });
}
```

| Linha | O que ela diz |
|---|---|
| `const procurado = ...` | "o termo sem os espaços das pontas e em minúsculas" (E09) |
| `const noNome = ...` | "o nome, em minúsculas, tem o termo?" |
| `const noTelefone = ...` | "o telefone, como está escrito, tem o termo?" |
| `return noNome \|\| noTelefone;` | "passa quem tem o termo no nome **ou** no telefone" (E10) |

---

## :icon[funnel] buscarContatos, item por item

Com o termo `'mar'`, quatro dos 15 contatos:

| Contato | O nome em minúsculas | `noNome` | `noTelefone` | Passa? |
|---|---|---|---|---|
| Mariana Souza | `mariana souza` | `true` | `false` | sim |
| Bruno Carvalho | `bruno carvalho` | `false` | `false` | não |
| Helena Martins | `helena martins` | `true` | `false` | sim |
| Marcos Teixeira | `marcos teixeira` | `true` | `false` | sim |

- Com `'MAR'`, dá o mesmo: o `toLowerCase` deixa o termo em `'mar'`
- Com `'9876'`, passam pelo telefone: Mariana, Érica e Daniel
- Com `''`, ou só espaços, todos passam: todo texto inclui o texto vazio
- Com `'zé'`, ninguém: `[]`

---

## :icon[milestone] Projeto 2 · Passo 3: os testes da busca

No `lista.test.js`, o `import` ganha `buscarContatos`: `import { nomesDosContatos, buscarPorId, buscarContatos } from './lista.js';`. No fim do arquivo:

```javascript
// Os ids de uma lista de contatos: deixa os resultados fáceis de comparar.
const ids = (lista) => lista.map((contato) => contato.id);

test.each([
  ['ana', [1, 5, 7]],
  ['MAR', [1, 3, 15]],
  ['9876', [1, 10, 11]],
  ['zé', []],
])('buscarContatos com "%s"', (termo, esperado) => {
  expect(ids(buscarContatos(contatos, termo))).toEqual(esperado);
});

test('buscarContatos com termo vazio devolve todos', () => {
  expect(buscarContatos(contatos, '   ').length).toBe(15);
});
```

- `ids` é uma seta guardada numa constante (E07): o `map` troca cada contato pelo id
- O `test.each` do E08, com o `%s` do E09: uma linha da tabela, um teste
- `ids(buscarContatos(...))`: a busca roda primeiro, e o `ids` recebe a lista que ela entregou

**Pronto quando** `npm test` mostra `Tests: 20 passed, 20 total` (3 suites).

---

## :icon[milestone] Projeto 2 · Passo 3: a busca no terminal

O termo vem do comando, como o detalhe do pedido no Racha-conta. O começo do `agenda.js` fica assim:

```javascript
// npm run agenda: mostra a agenda no terminal.
// Com uma palavra no fim, busca: npm run agenda mar
import { contatos } from '../data/contatos.js';
import { descreverContato, formatarAniversario } from '../regras/contato.js';
import { buscarContatos } from '../regras/lista.js';

let termo = '';
if (process.argv[2]) {
  termo = process.argv[2];
}
const encontrados = buscarContatos(contatos, termo);
```

Embaixo, depois da linha `Agenda`, entra `` console.log(`Encontrados: ${encontrados.length}`); ``, e o `for` troca `contatos` por `encontrados`. Sem palavra no comando, `process.argv[2]` é `undefined`, e o `trim` quebraria: por isso o `termo` começa com `''`.

**Pronto quando** `npm run agenda mar` mostra `Encontrados: 3`, com Mariana, Helena e Marcos, e `npm run agenda` mostra `Encontrados: 15`. Termo com espaço ou parênteses vai entre aspas: `npm run agenda "(11) 3456"`.

---

## Ordenar

Como o dicionário põe as palavras em ordem?

---

## :icon[arrow-down-a-z] sort: pôr em ordem

O **`sort`** ("ordenar") põe a lista em ordem. Ele pega dois itens por vez, `a` e `b`, e pergunta a um **comparador**, uma seta com dois parâmetros, qual vem antes. Para nomes, o comparador é o **`localeCompare`** ("comparar pelo idioma"): ele compara como o dicionário, com o Á junto do A.

```javascript
const sem = ['Érica', 'Daniel', 'Álvaro', 'Bruno'];
sem.sort();
console.log(sem);   // [ 'Bruno', 'Daniel', 'Álvaro', 'Érica' ]

const com = ['Érica', 'Daniel', 'Álvaro', 'Bruno'];
com.sort((a, b) => a.localeCompare(b));
console.log(com);   // [ 'Álvaro', 'Bruno', 'Daniel', 'Érica' ]
```

- Sem comparador, o `sort` compara pelo número que o computador guarda para cada letra, e as letras com acento ficam depois do Z
- Com fichas, compare um campo: `(a, b) => a.nome.localeCompare(b.nome)`
- O `sort` muda a própria lista: depois dele, `com` já está em ordem

---

## :icon[arrow-up-down] sort com números: a - b

Sem comparador, o `sort` trata número como texto: `[30, 8, 14, 3].sort()` dá `[ 14, 3, 30, 8 ]`, porque `'14'` começa com `'1'`. Com números, o comparador é a conta **`(a, b) => a - b`**, e o `sort` olha o sinal do resultado:

| `a` | `b` | `a - b` | Quem vem antes |
|---|---|---|---|
| 30 | 8 | `22`, positivo | o `b`: 8 |
| 8 | 14 | `-6`, negativo | o `a`: 8 |
| 14 | 14 | `0` | tanto faz |

```javascript
const dias = [30, 8, 14, 3];
dias.sort((a, b) => a - b);
console.log(dias);   // [ 3, 8, 14, 30 ]: do menor ao maior

dias.sort((a, b) => b - a);
console.log(dias);   // [ 30, 14, 8, 3 ]: do maior ao menor
```

Com fichas, subtraia um campo de número: `(a, b) => a.id - b.id`. O `localeCompare` responde do mesmo jeito: `'Álvaro'.localeCompare('Bruno')` dá `-1`.

---

## :icon[notebook-pen] Exercícios: Ordenar

:::example Exercícios
1. Tempos da corrida, em minutos. O que aparece?
   ```javascript
   const tempos = [42, 7, 15];
   tempos.sort((a, b) => a - b);
   console.log(tempos);
   ```
2. O que `[9, 10, 2].sort()` devolve? Por quê?
3. Complete para o ranking, do maior para o menor: `pontos.sort((a, b) => ___)`
4. O que aparece em cada linha?
   ```javascript
   console.log(['Bia', 'Ágata', 'Caio'].sort());
   console.log(['Bia', 'Ágata', 'Caio'].sort((a, b) => a.localeCompare(b)));
   ```
5. Escreva o `sort` que põe as fichas de `produtos` do menor `preco` ao maior
:::

:::tip Respostas
1. `[ 7, 15, 42 ]`: o `a - b` põe do menor ao maior
2. `[ 10, 2, 9 ]`: sem comparador, o número vira texto, e `'10'` começa com `'1'`
3. `b - a`
4. `[ 'Bia', 'Caio', 'Ágata' ]` e `[ 'Ágata', 'Bia', 'Caio' ]`: sem o `localeCompare`, o Á vai depois do Z
5. `produtos.sort((a, b) => a.preco - b.preco);`
:::

---

## Cópia

Na lista de compras da geladeira, você risca a original ou tira uma cópia?

---

## :icon[copy] Cópia: ordenar sem rasurar

O `sort` mexe na própria lista. Na agenda, isso estraga tudo: todo arquivo que importa `contatos` usa a mesma lista, e depois de um `contatos.sort(...)` a Mariana deixa de ser o `contatos[0]`. A saída é **tirar uma cópia e mexer na cópia, sem rasurar o original**:

```javascript
const maisNovos = [...contatos];
maisNovos.sort((a, b) => b.id - a.id);

console.log(maisNovos[0].nome);   // Marcos Teixeira, o id 15
console.log(contatos[0].nome);    // Mariana Souza: o original como estava
```

- **`[...contatos]`**: os três pontos espalham as fichas dentro de colchetes novos. É uma lista nova, com as mesmas 15 fichas. O E15 aprofunda
- **`contatos.slice()`** faz a mesma cópia
- `const copia = contatos;` **não** copia: é outro nome para a mesma lista, e o `sort` rasura o original

---

## :icon[copy] slice e cópia na prática

O **`slice`** ("fatiar") copia um pedaço da lista, da gaveta do começo até **antes** da gaveta do fim, e deixa o original como estava:

```javascript
const primeiros = contatos.slice(0, 3);
console.log(nomesDosContatos(primeiros));
// [ 'Mariana Souza', 'Bruno Carvalho', 'Helena Martins' ]

const tresMaisNovos = [...contatos].sort((a, b) => b.id - a.id).slice(0, 3);
console.log(nomesDosContatos(tresMaisNovos));
// [ 'Marcos Teixeira', 'Paula Fernandes', 'João Pedro Alves' ]

console.log(contatos[0].nome, contatos.length);   // Mariana Souza 15
```

| Escrito | O que copia |
|---|---|
| `contatos.slice(0, 3)` | as gavetas 0, 1 e 2 |
| `contatos.slice(13)` | da gaveta 13 até o fim: Paula e Marcos |
| `contatos.slice()` | a lista inteira |

Os três mais novos: o `sort` ordena a cópia e devolve ela mesma, e o `slice` corta os três primeiros.

---

## :icon[notebook-pen] Exercícios: Cópia

:::example Exercícios
1. Com `const fila = ['Ana', 'Bia', 'Caio', 'Davi'];`, o que `fila.slice(1, 3)` devolve?
2. E `fila.slice(2)`?
3. O que aparece? Por quê?
   ```javascript
   const notas = [8, 5, 9];
   const copia = notas;
   copia.sort((a, b) => a - b);
   console.log(notas);
   ```
4. Corrija a segunda linha para `notas` continuar `[ 8, 5, 9 ]`
5. Escreva a linha que mostra os 3 maiores `placares`, sem mexer na lista `placares`
:::

:::tip Respostas
1. `[ 'Bia', 'Caio' ]`: da gaveta 1 até antes da 3
2. `[ 'Caio', 'Davi' ]`: da gaveta 2 até o fim
3. `[ 5, 8, 9 ]`: `copia` é outro nome para a mesma lista, e o `sort` rasura o original
4. `const copia = [...notas];` ou `const copia = notas.slice();`
5. `console.log([...placares].sort((a, b) => b - a).slice(0, 3));`
:::

---

## :icon[milestone] Projeto 2 · Sua vez: ordenarPorNome

Agora, sozinho. No `lista.js`, escreva `ordenarPorNome(contatos)`, com `export`. Ela devolve uma **cópia** da lista em ordem alfabética: o Álvaro primeiro, o Rafael por último. A lista recebida não muda: `contatos[0]` continua sendo a Mariana.

1. Dois testes: um da ordem e um de que a lista recebida não mudou
2. No `agenda.js`, os encontrados aparecem em ordem

:::tip Dicas
- O `sort` muda a própria lista: tire a cópia antes, com `[...contatos]`
- Comparar dois contatos pelo nome: `a.nome.localeCompare(b.nome)`
- No teste da ordem, o Passo 1 ajuda: `nomesDosContatos(ordenarPorNome(contatos))`
- Uma função recebe o resultado da outra: `ordenarPorNome(buscarContatos(contatos, termo))`
:::

**Pronto quando** `npm test` mostra `Tests: 22 passed, 22 total` e `npm run agenda mar` mostra Helena, Marcos e Mariana, nessa ordem.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `buscarContatos com "ana"` recebendo `[]` | seta com chaves sem `return` | `return noNome \|\| noTelefone;` |
| só o `"MAR"` vermelho | faltou o `toLowerCase()` no termo | `termo.trim().toLowerCase()` |
| `ReferenceError: ... is not defined` | faltou o nome no `import` do teste | pôr o nome nas chaves |
| `Received: "Álvaro Mendes"`, teste "não muda" | o `sort` rasurou a lista recebida | `[...contatos]` antes |
| `Received: "Mariana Souza"`, teste da ordem | `sort()` sem comparador não ordena fichas | o `localeCompare` |
| `Cannot read properties of undefined (reading 'trim')` | o `termo` é `undefined` | `let termo = ''` e o `if` |

---

## :icon[milestone] Projeto 2 · Etapa 2 pronta

`npm test` mostra `Tests: 22 passed, 22 total`, e `npm run agenda mar` mostra:

```plaintext
Agenda: 15 contatos
Encontrados: 3
Helena Martins, (11) 3456-7890, Família, aniversário 02/07
Marcos Teixeira, (61) 98234-7766, Trabalho, aniversário 19/11
Mariana Souza, (11) 98765-4321, Amigos, aniversário 30/10
```

- `git add .`, `git commit -m "Projeto 2: etapa 2, buscar, ordenar e nomes"` e `git push`
- Na página (`npx serve .` e `http://localhost:3000/web/`), o painel vai a **7 de 14**: a busca funciona, e a lista aparece em ordem

Em casa, se faltar: a Sua vez, o commit e o push.

---

## Resumo

:::summary
- `map` é a linha de produção: cada item entra e sai transformado, na mesma quantidade
- `find` entrega o primeiro item que passa, ou `undefined`; `findIndex` entrega a gaveta, ou `-1`
- `some` pergunta "alguém passa?", `every` pergunta "todos passam?", e `includes`, "este item está na lista?"
- A seta com chaves precisa de `return`; sem ele, a peneira não deixa ninguém passar
- `sort` põe em ordem com um comparador: `localeCompare` para nomes, `a - b` para números
- O `sort` muda a própria lista: ordene uma cópia, `[...lista]` ou `lista.slice()`
:::

---

## :icon[arrow-right] Próximos passos

No E15, **sem rasurar o original** vira a regra da agenda inteira:

- :icon[user-plus] adicionar, editar e remover contatos, sempre devolvendo uma lista nova
- :icon[copy] o `[...]` de hoje a fundo, em listas e em fichas
- :icon[layout-list] os contatos separados por letra, com o `reduce`
- :icon[calendar] os aniversariantes do mês, do dia menor ao maior, com o `a - b` de hoje
