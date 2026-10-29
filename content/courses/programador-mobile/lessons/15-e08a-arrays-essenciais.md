---
title: Arrays essenciais
summary: Ponha, tire, procure e ordene itens nas listas da Lojinha sem bagunçar o catálogo que os outros scripts usam.
module: linguagem-js
duration_minutes: 40
objectives:
  - Adicionar e remover itens com push, pop, shift, unshift, splice e slice
  - Procurar valores e objetos com includes, indexOf, find e findIndex
  - Ordenar números e nomes com comparadores e localeCompare
  - Distinguir os métodos que mudam o array original dos que devolvem uma cópia
---

# Arrays essenciais

Programador Mobile · Encontro E08 · Aula 15 de 89

---

## O que você vai aprender

:::goal
- Pôr e tirar itens no fim, no começo e no meio de um array
- Copiar um pedaço com `slice` sem mexer no original
- Procurar com `includes`, `indexOf`, `find` e `findIndex`
- Ordenar preços e nomes com comparador e `localeCompare`, copiando antes
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **array** | uma lista de valores em ordem, como uma fileira de gavetas numeradas a partir do 0 |
| **índice** | o número da gaveta: a posição de um item na lista |
| **método** | uma função que vem junto com o valor e se chama com um ponto: `lista.push('fone')` |
| **mudar o original** | o que um método faz quando mexe no próprio array, em vez de entregar outro |
| **comparador** | a função que olha dois itens e diz qual deles vem primeiro |

---

## Listas por toda parte

Abra o `lojinha-regras` e conte as listas: os 12 `produtos` do catálogo, as `categorias`, os itens do carrinho do E07. Hoje chegam mais duas: as **últimas buscas** e os **favoritos**.

Quase tudo o que as regras fazem com uma lista é pôr, tirar, procurar e ordenar. E há uma pegadinha: alguns métodos mudam o array original. Ordene a vitrine do jeito errado e todo script, regra ou teste que importa `produtos` passa a ver o catálogo em outra ordem, sem ninguém ter mexido nele.

:::question
Como ordenar a vitrine por preço sem mudar a ordem do catálogo que os outros scripts e regras usam?
:::

---

## Arrays

Numa cômoda de gavetas numeradas, como você acha as meias sem abrir todas?

---

## :icon[list] O que é um array

Um **array** é uma lista de valores em ordem. Pense numa fileira de gavetas numeradas a partir do 0: cada gaveta guarda um valor, e o número dela é o **índice**.

```javascript
const ultimasBuscas = ['fone', 'garrafa', 'tênis'];

ultimasBuscas[0];                        // 'fone': o índice começa em 0
ultimasBuscas.length;                    // 3
ultimasBuscas[ultimasBuscas.length - 1]; // 'tênis': o último
ultimasBuscas[5];                        // undefined, sem erro
ultimasBuscas.join(', ');                // 'fone, garrafa, tênis' (E06)
```

- Os colchetes `[ ]` criam o array; os itens vão separados por vírgula
- `ultimasBuscas[0]` abre a gaveta 0. A última é a `length - 1`, porque a contagem começa no 0
- Gaveta que não existe devolve `undefined` em vez de dar erro: confira antes de usar
- Cabe qualquer valor: textos, números e objetos, como os 12 produtos do catálogo
- A `const` não deixa trocar a fileira por outra, mas as gavetas continuam abrindo: dá para pôr e tirar itens

---

## :icon[list] Arrays na prática

Três arrays que você já usa no `lojinha-regras`:

```javascript
import { categorias, produtos } from '../data/produtos.js';

// 1. O catálogo: quantos produtos, e qual está na gaveta 0
console.log(produtos.length);                         // 12
console.log(produtos[0].nome);                        // Fone Bluetooth

// 2. A última categoria, sem saber quantas são
console.log(categorias[categorias.length - 1].nome);  // Livros

// 3. As palavras do comando: node buscar.js fone bola
console.log(process.argv.length);                     // 4
console.log(process.argv[3]);                         // bola
```

O `process.argv` do E02 também é um array: gaveta 0 é o `node`, gaveta 1 é o arquivo, e as palavras que você digitou vêm depois.

---

## Pôr e tirar

No celular, você abre um produto, depois o carrinho, e aperta voltar. Aonde vai?

---

## :icon[arrow-right] Fim do array: push e pop

O `push` e o `pop` mexem no fim do array, como numa pilha de cartas: a carta nova vai por cima, e tirar pega a de cima. Um app guarda as telas abertas assim: abrir uma tela empilha, voltar desempilha a de cima. Cada texto abaixo é o endereço de uma tela; `'/'` é o Início.

```javascript
const pilha = ['/'];          // a pilha de telas de um app, simplificada
pilha.push('/produto/7');     // devolve 2, o novo tamanho
pilha.push('/carrinho');      // ['/', '/produto/7', '/carrinho']
pilha.pop();                  // devolve '/carrinho' e o tira da pilha
```

| Método | O que faz | Devolve |
|---|---|---|
| `push(item)` | põe no fim | o novo tamanho |
| `pop()` | tira o último | o item tirado |

Os dois **mudam o array original**: depois do `pop`, `pilha` tem dois itens. O `push` é o do `removerItem` do E07; no E36, a Lojinha navega por uma pilha assim.

---

## :icon[arrow-left] Começo do array: unshift e shift

O `unshift` e o `shift` fazem o mesmo trabalho, só que no começo do array.

```javascript
const historico = ['garrafa', 'tênis'];
historico.unshift('fone');    // ['fone', 'garrafa', 'tênis']

const fila = ['pedido 101', 'pedido 102'];
const proximo = fila.shift(); // 'pedido 101'; fila fica ['pedido 102']
```

::::columns
:::col
![Diagrama: no começo do array, unshift põe e shift tira; no fim, push põe e pop tira; os quatro mudam o array original](images/e08-pontas-do-array.svg)
:::
:::col
- `unshift` põe no começo: ideal para "mais recente primeiro", como o histórico de buscas
- `shift` tira o primeiro: é a **fila**, como a do banco, em que quem chegou antes sai antes. Exemplo: pedidos esperando a internet voltar para serem enviados
- Os dois também mudam o original
:::
::::

---

## :icon[arrow-left-right] Pôr e tirar na prática

```javascript
// 1. Desfazer: a última busca digitada sai do fim
const digitadas = ['fone', 'garrafa', 'tênis'];
const desfeita = digitadas.pop();
console.log(desfeita, digitadas);  // tênis [ 'fone', 'garrafa' ]

// 2. Mais recente primeiro: a busca nova entra no começo
const recentes = ['garrafa', 'fone'];
recentes.unshift('bola');
console.log(recentes);             // [ 'bola', 'garrafa', 'fone' ]

// 3. Fila de envio: o pedido novo entra no fim, o mais antigo sai primeiro
const fila = ['pedido 101', 'pedido 102'];
fila.push('pedido 103');
console.log(fila.shift(), fila);   // pedido 101 [ 'pedido 102', 'pedido 103' ]
```

| Para | Use |
|---|---|
| pôr no fim / tirar do fim | `push` / `pop` |
| pôr no começo / tirar do começo | `unshift` / `shift` |

---

## Cortar ou copiar

Na lista de compras da casa, você risca o item na original ou numa cópia?

---

## :icon[minus] No meio: splice

O **`splice`** corta itens do meio do array, como uma tesoura no próprio original. Você diz em que gaveta começar e quantos itens tirar; se quiser, passa itens novos para pôr no lugar. A forma geral é `splice(inicio, quantos, ...novos)`.

```javascript
const historico = ['fone', 'garrafa', 'tênis', 'bola'];

historico.splice(1, 1);         // tira 1 item a partir do índice 1: devolve ['garrafa']
// historico: ['fone', 'tênis', 'bola']

historico.splice(1, 0, 'yoga'); // no índice 1, tira 0 e insere 'yoga'
// historico: ['fone', 'yoga', 'tênis', 'bola']
```

| Chamada | O que ela diz |
|---|---|
| `splice(1, 1)` | "a partir da gaveta 1, tire 1 item" |
| `splice(1, 0, 'yoga')` | "na gaveta 1, não tire nada e ponha `'yoga'`" |

Ele devolve um array com os itens tirados e **muda o original**. É o "apagar esta busca" do histórico: você descobre a posição do item e tira um a partir dela.

---

## :icon[copy] Uma fatia sem mexer: slice

O **`slice`** copia um pedaço do array e deixa o original como estava. É tirar uma cópia e mexer na cópia, sem rasurar o original.

```javascript
const historico = ['fone', 'yoga', 'tênis', 'bola', 'garrafa', 'panela'];

historico.slice(0, 5); // as 5 primeiras: o índice do fim não entra
historico.slice(-2);   // ['garrafa', 'panela']: negativo conta do fim
historico.slice();     // cópia do array inteiro
// historico continua com as 6 buscas

process.argv.slice(2); // só os argumentos do comando (E02)
```

`slice(inicio, fim)` copia da gaveta `inicio` até antes da `fim`. O `process.argv.slice(2)` pula o `node` e o arquivo e fica com as palavras que você digitou. Para não confundir: s**p**lice **p**ica o original; slice só tira uma fatia para você.

| Método | Muda o original? | Devolve |
|---|---|---|
| `splice` | sim | os itens removidos |
| `slice` | não | a cópia do pedaço |

---

## :icon[copy] Cortar e copiar na prática

```javascript
// 1. O cliente apaga a busca da posição 1
const historico = ['fone', 'garrafa', 'tênis', 'bola'];
historico.splice(1, 1);
console.log(historico);              // [ 'fone', 'tênis', 'bola' ]

// 2. A tela mostra só as 2 primeiras, sem perder as outras
console.log(historico.slice(0, 2));  // [ 'fone', 'tênis' ]
console.log(historico.length);       // 3: o original continua inteiro

// 3. Vários termos no comando: node buscas.js fone bola
console.log(process.argv.slice(2));  // [ 'fone', 'bola' ]
```

Apagar de verdade é `splice`; mostrar um pedaço é `slice`. O terceiro caso é o jeito dos scripts do laboratório lerem todos os termos digitados de uma vez.

---

## Pense

:::question
Depois destas linhas, o que há em `favoritos`, `copia` e `removidos`?

```javascript
const favoritos = [3, 7, 10];
const copia = favoritos.slice();
copia.push(12);
const removidos = favoritos.splice(0, 1);
```
:::

:::tip Resposta
- `favoritos` é `[7, 10]`: o `splice` tirou o 3 do original
- `copia` é `[3, 7, 10, 12]`: o `slice` copiou antes, e o `push` mexeu só na cópia
- `removidos` é `[3]`: o `splice` sempre devolve um array, mesmo com um item só

Depois do `slice`, cópia e original seguem caminhos separados.
:::

---

## Procurar

O leite está na lista de compras? E em que linha?

---

## :icon[search] Procurar um valor: includes e indexOf

Para saber se um valor está na lista, use **`includes`**. Para saber em que gaveta ele está, use **`indexOf`**.

```javascript
const favoritos = [3, 7, 10]; // ids dos produtos favoritos

favoritos.includes(7);   // true: o 7 é favorito
favoritos.indexOf(7);    // 1: a posição
favoritos.indexOf(12);   // -1: não está
favoritos.includes('7'); // false: '7' é texto, 7 é número
```

- `includes` responde sim ou não: use quando só quer saber se o item está lá
- `indexOf` dá a posição, ou `-1` quando não acha: use quando vai agir naquela posição, como num `splice`
- Os dois comparam com `===`, o "é igual?" do E07, que também confere o tipo. Tudo o que chega por `process.argv` (E02) é texto: converta com `Number(texto)` antes de procurar um id

---

## :icon[file-search] Procurar com condição: find e findIndex

Num array de objetos, você procura por uma condição: "o item cujo id é 7". O `find` e o `findIndex` recebem uma **função de teste**, uma arrow function como as do E07. Eles olham item por item, como quem confere o carrinho, e param no primeiro que passa no teste.

```javascript
const itens = [
  { id: 1, nome: 'Fone Bluetooth', qtd: 1 },
  { id: 7, nome: 'Tênis de Corrida', qtd: 2 },
];

itens.find((i) => i.id === 7);      // o objeto do tênis
itens.findIndex((i) => i.id === 7); // 1
itens.find((i) => i.id === 99);     // undefined
itens.indexOf({ id: 7, nome: 'Tênis de Corrida', qtd: 2 }); // -1
```

`find` devolve o item, ou `undefined` se ninguém passar; `findIndex` devolve a posição, ou `-1`.

---

## :icon[list-ordered] O find em português

| Linha | O que ela diz |
|---|---|
| `(i) => i.id === 7` | o teste: "para cada item `i`, o id dele é 7?" |
| `itens.find(...)` | "me dê o primeiro item que passar no teste" |
| `itens.findIndex(...)` | "me dê a posição desse item" |
| `find` com o id 99 | ninguém passou: `undefined` |
| `indexOf({ id: 7, ... })` | `-1`: o objeto escrito de novo é outro objeto |

O `indexOf` não serve para objetos. Dois objetos com os mesmos dados são como duas casas iguais em endereços diferentes: o `indexOf` procura o endereço, não os móveis. Em arrays de objetos, procure pelo `id`.

---

## :icon[search] Procurar na prática

```javascript
// 1. O id 7 é favorito? O texto do terminal vira número antes
const favoritos = [3, 7, 10];
console.log(favoritos.includes(Number('7')));  // true

// 2. O nome e o preço do produto de id 5
const produto = produtos.find((p) => p.id === 5);
console.log(produto.nome, produto.preco);      // Garrafa Térmica 79.9

// 3. Tirar 'tênis' do histórico, esteja onde estiver
const historico = ['fone', 'tênis', 'bola'];
const posicao = historico.indexOf('tênis');
if (posicao !== -1) historico.splice(posicao, 1);
console.log(historico);                        // [ 'fone', 'bola' ]
```

No terceiro caso, o `indexOf` acha a gaveta e o `splice` corta nela. O `if` protege: sem ele, `splice(-1, 1)` cortaria o último item.

---

## Ordenar

Como o dicionário põe as palavras em ordem?

---

## :icon[arrow-up-down] sort sem comparador ordena como texto

O **`sort`** põe os itens do array em ordem. Sem nenhuma instrução, ele transforma cada item em texto e compara caractere a caractere, como num dicionário:

```javascript
const precos = [89.9, 119.9, 59.9];
precos.sort(); // [119.9, 59.9, 89.9]
```

Como texto, "1" vem antes de "5", que vem antes de "8". Por isso R$ 119,90 aparece antes de R$ 59,90.

Com nomes, o resultado também surpreende:

```javascript
['Livros', 'Áudio', 'Casa'].sort(); // ['Casa', 'Livros', 'Áudio']
['fone', 'Garrafa', 'bola'].sort(); // ['Garrafa', 'bola', 'fone']
```

Maiúsculas passam na frente das minúsculas, e letras acentuadas vão para o fim. Para números e nomes, passe sempre um **comparador**.

---

## :icon[scale] O comparador: negativo, zero ou positivo

O **comparador** é a função que você entrega ao `sort` para dizer a ordem. Ele trabalha como um juiz: o `sort` mostra dois itens, `a` e `b`, e o juiz responde com um número.

:::center
![Diagrama: o sinal do comparador decide a ordem; negativo põe a antes de b, positivo põe b antes de a, zero mantém; 59.9 - 89.9 é negativo, então 59.9 vem antes](images/e08-comparador.svg)
:::

- **negativo**: `a` vem antes de `b`
- **positivo**: `b` vem antes de `a`
- **zero**: empate, os dois ficam como estão

---

## :icon[calculator] Números: subtrair dá o sinal

```javascript
const precos = [89.9, 119.9, 59.9];
precos.sort((a, b) => a - b); // [59.9, 89.9, 119.9]
precos.sort((a, b) => b - a); // [119.9, 89.9, 59.9]

lista.sort((a, b) => a.preco - b.preco);         // objetos: menor preço primeiro
lista.sort((a, b) => b.avaliacao - a.avaliacao); // melhor avaliação primeiro
```

| Comparador | O que ele diz |
|---|---|
| `(a, b) => a - b` | "se `a` é menor, a conta dá negativo e `a` vai para a frente": do menor para o maior |
| `(a, b) => b - a` | a conta invertida: do maior para o menor |
| `a.preco - b.preco` | o mesmo, com o campo `preco` de dois produtos |

Com 59.9 e 89.9, `59.9 - 89.9` dá negativo: o 59.9 vem antes.

---

## :icon[arrow-down-a-z] Nomes com acento: localeCompare

Texto não se subtrai: `'Casa' - 'Áudio'` dá `NaN`, "não é um número". Use **`localeCompare`**, que já devolve negativo, zero ou positivo seguindo as regras do idioma:

```javascript
'Áudio'.localeCompare('Casa', 'pt-BR'); // negativo: Áudio vem antes

const nomes = ['Livros', 'Áudio', 'Casa'];
nomes.sort((a, b) => a.localeCompare(b, 'pt-BR'));
// ['Áudio', 'Casa', 'Livros']

['fone', 'Garrafa', 'bola'].sort((a, b) => a.localeCompare(b, 'pt-BR'));
// ['bola', 'fone', 'Garrafa']
```

O `'pt-BR'` escolhe as regras do português: o Á fica junto do A, e a maiúscula não fura a fila. Para produtos, compare o campo: `(a, b) => a.nome.localeCompare(b.nome, 'pt-BR')`.

---

## :icon[arrow-up-down] Ordenar na prática

As três ordens da vitrine da Lojinha, cada uma com o seu comparador:

```javascript
const vitrine = produtos.slice();

vitrine.sort((a, b) => a.preco - b.preco);
console.log(vitrine[0].nome);  // Livro de Receitas: o mais barato

vitrine.sort((a, b) => b.avaliacao - a.avaliacao);
console.log(vitrine[0].nome);  // Lógica de Programação: nota 4.9

vitrine.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
console.log(vitrine[0].nome);  // Bola de Futebol: a primeira de A a Z
```

A vitrine é uma cópia do catálogo, feita com `slice()`: o `sort` reordena a cópia, e `produtos` fica na ordem original. No laboratório, esses três comparadores ganham nome e vão morar num objeto.

---

## Ordenar uma cópia

Se você reorganiza a estante da sala, alguém da casa ainda acha os livros?

---

## :icon[triangle-alert] sort muda o original

O `sort` não entrega uma lista nova: ele ordena **no lugar**, isto é, reordena o próprio array e devolve esse mesmo array. É rasurar o original.

```javascript
import { produtos } from '../data/produtos.js';

const porPreco = produtos.sort((a, b) => a.preco - b.preco);
// porPreco e produtos são o MESMO array, agora ordenado por preço
console.log(produtos[0].nome); // 'Livro de Receitas', não mais 'Fone Bluetooth'
```

Todo arquivo que importa `produtos` recebe esse mesmo array. Depois dessa linha, scripts, regras e testes passam a ver o catálogo reordenado, e o primeiro produto deixa de ser o Fone Bluetooth.

---

## :icon[copy] Copie antes de ordenar

Para não rasurar o original, tire uma cópia e ordene a cópia:

```javascript
const porPreco = produtos.slice().sort((a, b) => a.preco - b.preco);
```

```javascript
console.log(porPreco[0].nome);      // Livro de Receitas
console.log(produtos[0].nome);      // Fone Bluetooth: o catálogo não mudou
console.log(porPreco === produtos); // false: são dois arrays
```

O `slice()` sem nada copia o array inteiro; o `sort` mexe só na cópia, e `produtos` fica como estava.

Você também vai ver `[...produtos].sort(...)`: os três pontos criam um array novo com os mesmos itens. É o **spread**, que o E09 ensina; hoje é só para ler.

| Mudam o original | Devolvem um array novo |
|---|---|
| `push`, `pop`, `shift`, `unshift`, `splice`, `sort` | `slice`, `[...lista]` (e, no E09, `map` e `filter`) |

---

## Pratique

:::example Desafio
Escreva `maisBaratos(lista, quantos)`, que devolve os `quantos` produtos mais baratos, do menor preço para o maior, sem mexer na `lista` recebida. Com o catálogo, `maisBaratos(produtos, 2)` devolve o Livro de Receitas e o Lógica de Programação.
:::

:::tip Resposta
```javascript
function maisBaratos(lista, quantos) {
  const ordenados = lista.slice().sort((a, b) => a.preco - b.preco);
  return ordenados.slice(0, quantos);
}
```

O primeiro `slice` protege o catálogo; o `sort` mexe só na cópia; o segundo `slice` corta os primeiros. Sem o primeiro `slice`, a função funciona e, de brinde, reordena `produtos` para todo mundo.
:::

---

## :icon[triangle-alert] Erros comuns

:::warning
- `precos.sort()` sem comparador: números e nomes com acento saem fora de ordem
- Comparador que devolve `true` ou `false`, como `(a, b) => a.preco > b.preco`: ele nunca devolve negativo, e a ordem sai errada. Devolva um número
- Ordenar `produtos` direto: os outros scripts e regras veem o catálogo reordenado. Use `produtos.slice().sort(...)`
- Trocar `splice` por `slice`: um corta o original, o outro só copia
- `if (lista.indexOf(id))`: a posição 0 conta como falso, e o `-1` como verdadeiro. Use `includes` ou compare com `-1`
- Procurar `'7'` em `[3, 7]`: o `===` diferencia texto de número
:::

---

## Resumo

:::summary
- `push` e `pop` mexem no fim; `unshift` e `shift`, no começo; `splice` corta ou insere no meio
- `slice` copia um pedaço e deixa o original intacto
- `includes` e `indexOf` procuram um valor; `find` e `findIndex` procuram com uma condição, como o `id`
- O `sort` precisa de comparador: subtração para números, `localeCompare` com `'pt-BR'` para nomes
- `sort` muda o original: no `lojinha-regras`, ordene sempre uma cópia, `lista.slice()` ou `[...lista]`
:::

---

## Próximos passos

Na aula 16, o foco passa para os itens das listas: **objetos**, ponto e colchete, `Object.entries` e JSON.

No laboratório, você junta as duas aulas no `lojinha-regras`: a vitrine ordenada por comparadores guardados num objeto, as 5 últimas buscas sem repetir e os favoritos, tudo com testes e impresso no terminal. No E30, essas regras vão para as telas do app.

Para fixar, abra o REPL do Node (`node`) e ordene `[89.9, 119.9, 59.9]` com e sem comparador. Depois de cada `sort`, digite o nome do array e veja se o original mudou.
