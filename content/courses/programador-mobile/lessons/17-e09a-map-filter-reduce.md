---
title: map, filter e reduce
summary: Transforme, filtre, some e agrupe as listas da Lojinha com métodos de array, no lugar dos laços.
module: linguagem-js
duration_minutes: 40
objectives:
  - Transformar e filtrar listas com map e filter sem alterar o array original
  - Somar, contar e agrupar com reduce e um valor inicial
  - Responder perguntas sobre listas com find, some e every
  - Encadear métodos e decidir entre um laço e um método
---

# map, filter e reduce

Programador Mobile · Encontro E09 · Aula 17 de 89

---

## O que você vai aprender

:::goal
- Transformar cada item com `map` e manter só alguns com `filter`
- Somar, contar e agrupar com `reduce`, sempre com valor inicial
- Achar e verificar itens com `find`, `some` e `every`
- Encadear métodos e escolher entre um laço e um método
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **callback** | a função que você entrega para outro código chamar |
| **`map`** | transforma cada item da lista, como uma linha de produção |
| **`filter`** | fica só com os itens que passam num teste, como uma peneira |
| **`reduce`** | junta a lista inteira num valor só, como uma calculadora que vai acumulando |
| **acumulador** | o valor que o `reduce` carrega de uma volta para a outra |
| **encadear** | chamar um método direto no resultado do anterior |

---

## Três perguntas sobre o carrinho

O `simular-carrinho.js` do E07 faz perguntas à lista `itens` do carrinho:

- Quais linhas imprimir no resumo do pedido?
- Quantas unidades há no carrinho e quanto dá o subtotal?
- Todas as quantidades estão entre 1 e 10, para o pedido poder fechar?

No E07, você respondeu perguntas assim com um `for...of` e uma variável que muda a cada volta. Hoje cada uma vira **uma linha que diz o que faz**.

:::question
Das três perguntas, qual devolve uma lista, qual devolve um número e qual devolve sim ou não?
:::

---

## Callbacks

No restaurante, você faz o pedido. Quem decide a hora de preparar?

---

## :icon[square-function] Uma função para cada item

Um **callback** é uma função que você entrega para outro código chamar. É como deixar o pedido com o garçom: você diz o que quer, e quem decide a hora de preparar é a cozinha.

Os métodos de hoje recebem um callback e o chamam uma vez para cada item, na ordem. O callback recebe o item e, se pedir, o índice. O array original não muda.

Você já entregou callbacks no E08, ao `sort` e ao `find`:

```javascript
[89.9, 59.9, 119.9].sort((a, b) => a - b); // [ 59.9, 89.9, 119.9 ]
itens.find((i) => i.id === 4).nome;        // 'Luminária de Mesa'
```

Nos dois, a arrow é o callback: você escreveu o que fazer, e o método decidiu quando chamar.

---

## :icon[table] Os métodos de hoje

Cada método faz uma pergunta à lista:

| Método | Pergunta | Devolve |
|---|---|---|
| `map` | Como fica cada item? | array novo, do mesmo tamanho |
| `filter` | Quais itens passam? | array novo, igual ou menor |
| `reduce` | O que todos juntos dão? | um valor só |
| `find` | Qual é o primeiro que passa? | um item ou `undefined` |
| `some` e `every` | Algum passa? Todos passam? | `true` ou `false` |

As perguntas do carrinho cabem aqui: as linhas do resumo saem de um `map`, a quantidade e o subtotal de um `reduce`, e o "todas entre 1 e 10?" de um `every`.

---

## map

Entram 10 produtos na máquina de embalar. Quantos saem, e como?

---

## :icon[arrow-right] map: transformar cada item

O **`map`** é uma linha de produção: cada item entra, passa pela função e sai transformado, na mesma quantidade.

```javascript
const itens = [
  { id: 1, nome: 'Fone Bluetooth', preco: 199.9, qtd: 1 },
  { id: 4, nome: 'Luminária de Mesa', preco: 89.9, qtd: 2 },
];

const linhas = itens.map((item) => `${item.qtd}x ${item.nome}`);
// ['1x Fone Bluetooth', '2x Luminária de Mesa']
```

- A arrow recebe um item e **devolve** um texto; esse texto vira o item do array novo, na mesma posição
- Duas entradas, duas saídas: `map` nunca muda o tamanho
- `itens` continua igual; `linhas` é outro array

`console.log(linhas.join('\n'))` imprime uma linha por item: o `'\n'` quer dizer "pule uma linha". No laboratório, ele substitui o laço que imprime o carrinho no `simular-carrinho.js`. No E30, essas linhas vão para a tela do app.

---

## :icon[arrow-right] map na prática

Com os mesmos `itens` (o fone e duas luminárias) e o catálogo:

```javascript
// 1. Só os nomes, para uma lista na tela
produtos.map((p) => p.nome).slice(0, 3);
// [ 'Fone Bluetooth', 'Caixa de Som Portátil', 'Microfone USB' ]

// 2. O valor de cada linha do carrinho: preço vezes quantidade
itens.map((item) => item.preco * item.qtd);  // [ 199.9, 179.8 ]

// 3. A linha pronta para imprimir, com o formatarPreco do E05
itens.map((item) => `${item.nome}: ${formatarPreco(item.preco * item.qtd)}`);
// [ 'Fone Bluetooth: R$ 199,90', 'Luminária de Mesa: R$ 179,80' ]
```

- Nos três casos, sai um array com o mesmo número de itens que entrou
- O que muda é o que a arrow devolve: um texto, um número ou uma linha formatada

---

## filter

Quando você peneira farinha, o que passa e o que fica?

---

## :icon[funnel] filter: manter só o que passa

O **`filter`** é uma peneira: olha item por item e fica só com os que passam no teste. A função responde `true` (fica) ou `false` (sai):

```javascript
const destaques = produtos.filter((p) => p.destaque);
// Fone Bluetooth, Luminária de Mesa, Tênis de Corrida, Lógica de Programação

const ate100 = produtos.filter((p) => p.preco <= 100);
// 6 dos 12 produtos
```

Remover um item do carrinho é ficar com todos **menos** ele. O `removerItem` do E07, com a lista `novos` e o `push`, cabe numa linha:

```javascript
const restantes = itens.filter((item) => item.id !== id);
```

Em português: "fique com os itens cujo id é diferente (`!==`) do que eu quero tirar". Os objetos que passam são os mesmos do original: `filter` escolhe, não copia nem altera. O laço da categoria no `aplicarFiltros` do E08 encolhe do mesmo jeito.

---

## :icon[funnel] filter na prática

```javascript
// 1. Os produtos de uma categoria: o laço do aplicarFiltros do E08
produtos.filter((p) => p.categoria === 'livros').length;  // 3

// 2. Uma busca por nome, sem ligar para maiúsculas
produtos.filter((p) => p.nome.toLowerCase().includes('fone')).length;
// 2: o Fone Bluetooth e o Microfone USB

// 3. Tirar o fone (id 1) do carrinho
itens.filter((item) => item.id !== 1);
// [ { id: 4, nome: 'Luminária de Mesa', preco: 89.9, qtd: 2 } ]
```

- O teste de cada caso responde `true` ou `false` para um item
- Se ninguém passar, o resultado é `[]`, um array vazio, e não um erro

---

## reduce

No caixa do mercado, o que o visor mostra a cada produto?

---

## :icon[sigma] reduce: muitos itens, um valor

O **`reduce`** junta a lista inteira num valor só. Pense numa calculadora que vai acumulando: cada item soma no visor, e o visor passa para o item seguinte.

```javascript
const quantidade = itens.reduce((soma, item) => soma + item.qtd, 0);
```

- `soma` é o **acumulador**, o visor: começa no **valor inicial** (`0`, o último argumento)
- A cada volta, o que a função devolve vira o acumulador da volta seguinte
- O que sobra depois do último item é o resultado

É o `contarItens` do laboratório: o total de unidades do carrinho.

---

## :icon[calculator] As voltas do reduce

Com o fone (1), duas luminárias (2) e um livro (1), o visor começa no 0 e anda assim:

:::center
![Animação: o reduce começa com soma 0; a volta 1 soma o fone (qtd 1) e devolve 1, a volta 2 soma as luminárias (qtd 2) e devolve 3, a volta 3 soma o livro (qtd 1) e devolve 4, o resultado](images/e09-reduce-voltas.svg)
:::

| Volta | `soma` que entra | `item.qtd` | devolve |
|---|---|---|---|
| 1 | 0 | 1 | 1 |
| 2 | 1 | 2 | 3 |
| 3 | 3 | 1 | 4 |

No E37, esse 4 vira o badge da aba Carrinho no app.

---

## :icon[coins] Somar dinheiro em centavos

O fone e duas luminárias, somados direto em reais:

```javascript
itens.reduce((soma, item) => soma + item.preco * item.qtd, 0);
// 379.70000000000005
```

O erro do ponto flutuante que você viu no E05 aparece de novo. A solução também é a mesma: some em **centavos inteiros**, com as funções de `src/regras/precos.js`, e volte para reais no fim.

```javascript
import { paraCentavos, paraReais } from './precos.js';

const centavos = itens.reduce(
  (soma, item) => soma + paraCentavos(item.preco) * item.qtd,
  0,
);
const total = paraReais(centavos); // 379.7
```

`paraCentavos` transforma reais em centavos, e o `Math.round` dentro dela garante o inteiro: a garrafa térmica, por exemplo, dá `79.9 * 100 = 7990.000000000001`. `paraReais` faz a volta. `formatarPreco(total)` imprime "R$ 379,70".

---

## Contar e agrupar

Num campeonato, como o placar sabe quantos gols tem cada time?

---

## :icon[hash] Contar com reduce

O acumulador não precisa ser um número. Com um **objeto** no lugar do visor, o `reduce` vira um placar: uma chave para cada categoria. É o `contarPorCategoria` do E08, com `reduce`:

```javascript
const porCategoria = produtos.reduce((contagem, p) => {
  if (contagem[p.categoria] === undefined) {
    contagem[p.categoria] = 0; // primeira vez desta categoria
  }
  contagem[p.categoria] = contagem[p.categoria] + 1;
  return contagem;
}, {});
// { audio: 3, casa: 3, esporte: 3, livros: 3 }
```

- O `const contagem = {}` de antes do laço virou o valor inicial `{}`
- O corpo do laço virou o corpo da função, com um `return` no fim: sem ele, a volta seguinte recebe `undefined`
- Alterar `contagem` é seguro: o objeto nasceu no `{}` e ninguém mais o vê

---

## :icon[boxes] Agrupar com reduce

Troque o `+ 1` por um `push` e a contagem vira um **agrupamento**: cada chave guarda a lista dos nomes daquela categoria.

```javascript
const nomesPorCategoria = produtos.reduce((grupos, p) => {
  if (grupos[p.categoria] === undefined) {
    grupos[p.categoria] = [];
  }
  grupos[p.categoria].push(p.nome);
  return grupos;
}, {});
// audio: ['Fone Bluetooth', 'Caixa de Som Portátil', 'Microfone USB'], casa: [...], ...
```

Contar, somar e agrupar por chave são a mesma receita: um objeto vazio no início e uma linha que decide o que guardar em cada chave. Aqui, na primeira vez de cada categoria, o `if` cria uma lista vazia; depois, o `push` põe o nome nela.

No laboratório, a receita guarda o produto inteiro e vira a função `agruparPorCategoria`. No E34, essas seções vão para a lista de categorias do app.

---

## Pense

:::question
O script imprime a quantidade com este código. Com o fone (`qtd: 1`) e duas luminárias (`qtd: 2`), ele mostra `[object Object]2`. Com o carrinho vazio, o Node para com `TypeError: Reduce of empty array with no initial value`. O que está errado?

```javascript
const quantidade = itens.reduce((soma, item) => soma + item.qtd);
```
:::

:::tip Resposta
Falta o valor inicial `0`. Sem ele, o `reduce` usa o **primeiro item** como acumulador e começa do segundo. O acumulador vira o objeto do fone, e objeto mais número vira texto: `[object Object]2`. Com a lista vazia, não há primeiro item para usar, e o `reduce` lança o erro. Correção: `itens.reduce((soma, item) => soma + item.qtd, 0)`.
:::

---

## Achar e conferir

"Alguém tem caneta?" e "Todos trouxeram documento?": quando você para de perguntar?

---

## :icon[search] find, some e every

Três métodos respondem perguntas sobre a lista. O `find` acha um item. O **`some`** pergunta "algum passa?", como "alguém aqui tem caneta?": uma mão levantada já responde sim. O **`every`** pergunta "todos passam?", como "todos trouxeram documento?": um só sem documento já responde não.

```javascript
// O produto de um id, ou undefined: o find do E08
const produto = produtos.find((p) => p.id === 7);

// Algum item já chegou ao limite de 10 unidades?
const noLimite = itens.some((item) => item.qtd === 10);

// Checkout: todas as quantidades entre 1 e 10?
const quantidadesOk = itens.every((item) => item.qtd >= 1 && item.qtd <= 10);
```

O `&&` é o "e" do E05: a quantidade precisa ser pelo menos 1 **e** no máximo 10.

---

## :icon[search] find, some e every na prática

Um carrinho com o fone e dez luminárias:

```javascript
const carrinho = [
  { id: 1, nome: 'Fone Bluetooth', preco: 199.9, qtd: 1 },
  { id: 4, nome: 'Luminária de Mesa', preco: 89.9, qtd: 10 },
];

produtos.find((p) => p.id === 7).nome;                       // 'Tênis de Corrida'
produtos.find((p) => p.id === 99);                           // undefined
carrinho.some((item) => item.qtd === 10);                    // true: avise o limite
carrinho.every((item) => item.qtd >= 1 && item.qtd <= 10);   // true: pode fechar
[].every((item) => item.qtd >= 1);                           // true: cuidado!
```

- Os três **param** assim que a resposta fica clara: `find` e `some` no primeiro que passa, `every` no primeiro que falha
- `find` devolve o próprio item; `filter` devolveria um array com ele dentro
- Com a lista vazia, `every` devolve `true`: ninguém falhou, então "todos passam". Um carrinho vazio passaria no checkout. Confira `itens.length > 0` junto

---

## Encadear métodos

Numa linha de montagem, o que cada estação recebe?

---

## :icon[workflow] Encadeando métodos

**Encadear** é chamar o próximo método direto no resultado do anterior. Como `filter` e `map` devolvem arrays, a lista passa de um para o outro, como nas estações de uma linha de produção: cada estação recebe o que a anterior entregou.

```javascript
const maisBemAvaliados = produtos
  .filter((p) => p.avaliacao >= 4.5)
  .sort((a, b) => b.avaliacao - a.avaliacao)
  .slice(0, 3)
  .map((p) => p.nome);
// ['Lógica de Programação', 'Tênis de Corrida', 'Garrafa Térmica']
```

- Um passo por linha: a cadeia se lê de cima para baixo, como uma receita
- A ordem importa: depois do `map`, só sobram os nomes, e não dá mais para filtrar pela nota
- O `sort` do E08 altera o array em que é chamado, mas aqui ele recebe o array **novo** do `filter`: sem `slice()`, `produtos` fica intacto

No app da Lojinha, a partir do E30, essa lista pode virar a faixa "Mais bem avaliados" da tela Início.

---

## :icon[list-ordered] A cadeia em português

| Linha | O que ela diz |
|---|---|
| `.filter((p) => p.avaliacao >= 4.5)` | "fique com os produtos de nota 4,5 ou mais" |
| `.sort((a, b) => b.avaliacao - a.avaliacao)` | "ponha a maior nota na frente" |
| `.slice(0, 3)` | "pegue os 3 primeiros" |
| `.map((p) => p.nome)` | "troque cada produto pelo nome dele" |

O resultado é uma lista de 3 nomes. O ponto no começo de cada linha continua a frase da linha de cima.

---

## :icon[workflow] Encadear na prática

```javascript
// 1. O resumo do carrinho, pronto para imprimir: map e depois join
console.log(itens.map((item) => `${item.qtd}x ${item.nome}`).join('\n'));
// 1x Fone Bluetooth
// 2x Luminária de Mesa

// 2. Quanto custam, juntos, os destaques? filter e depois reduce
produtos
  .filter((p) => p.destaque)
  .reduce((soma, p) => soma + paraCentavos(p.preco), 0);  // 70960 centavos
```

```javascript
// 3. Os livros de A a Z: filter, map e sort
produtos
  .filter((p) => p.categoria === 'livros')
  .map((p) => p.nome)
  .sort((a, b) => a.localeCompare(b, 'pt-BR'));
// [ 'Guia de Viagem', 'Livro de Receitas', 'Lógica de Programação' ]
```

Leia cada cadeia de cima para baixo, como uma frase: "dos produtos, fique com os destaques e some os preços".

---

## Laço ou método

O que é mais fácil de ler: o passo a passo ou o nome do que você quer?

---

## :icon[scale] Laço ou método?

Tudo o que os métodos de hoje fazem, um laço `for...of` também faz. A diferença está na leitura: o método diz **o que** faz; o laço mostra **como**, passo a passo. As duas versões abaixo contam as unidades do carrinho:

::::columns
:::col
```javascript
let total = 0;
for (const item of itens) {
  total += item.qtd;
}
```
:::
:::col
```javascript
const total = itens.reduce(
  (soma, item) => soma + item.qtd,
  0,
);
```
:::
::::

| Situação | Prefira |
|---|---|
| Transformar, filtrar, somar, agrupar | `map`, `filter`, `reduce` |
| Achar um item ou testar a lista | `find`, `some`, `every` |
| Parar no meio por uma regra complicada | um laço (o E14 aprofunda) |
| Passos que esperam um ao outro (E19) | `for...of` com `await` |

Laço não é errado. Nas listas da Lojinha, a diferença de velocidade não importa: escolha o que lê melhor.

---

## Pratique

:::example Desafio
O `vitrine.js` do E08 ganha a seção "Destaques até R$ 200". Escreva uma cadeia que devolva, dos `produtos`, só os que estão em destaque e custam até R$ 200, cada um no formato `{ id, titulo }`.
:::

:::tip Resposta
```javascript
const destaquesBaratos = produtos
  .filter((p) => p.destaque && p.preco <= 200)
  .map((p) => ({ id: p.id, titulo: p.nome }));
// Fone Bluetooth, Luminária de Mesa, Lógica de Programação
```

Filtre antes de transformar: o `map` cria objetos sem `destaque` e `preco`. Os parênteses em volta do objeto são obrigatórios: sem eles, a arrow lê as chaves como corpo de função, e o Node acusa erro de sintaxe.
:::

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Reduce of empty array with no initial value` | `reduce` sem valor inicial, numa lista vazia | pôr o valor inicial: `0` ou `{}` |
| `[object Object]` no resultado | o primeiro item, um objeto, virou o acumulador | pôr o valor inicial |
| `Cannot read properties of undefined` na segunda volta | faltou devolver o acumulador | `return contagem` no fim da função |
| `[undefined, undefined]` | arrow com chaves e sem `return` | tirar as chaves ou escrever o `return` |
| `SyntaxError: Unexpected token ':'` | objeto devolvido sem parênteses | `(p) => ({ id: p.id })` |

---

## :icon[triangle-alert] Erros comuns

:::warning
- `reduce` sem valor inicial: `[object Object]` no resultado e erro com a lista vazia
- Abrir chaves na arrow e esquecer o `return`: o `map` devolve `[undefined, undefined]`
- Devolver um objeto sem parênteses: `(p) => { id: p.id }` não devolve objeto nenhum
- Usar `map` para filtrar: os itens que "não passam" viram `undefined`, e o tamanho não muda
- Usar `map` só para executar algo, sem usar o array que ele devolve: isso é trabalho do `for...of`
- Confiar em `every` com a lista vazia: ele devolve `true`
:::

---

## Resumo

:::summary
- `map` transforma cada item e mantém o tamanho; `filter` mantém só os itens que passam no teste
- `reduce` junta a lista num valor só: some, conte ou agrupe, sempre com valor inicial
- Dinheiro se soma em centavos inteiros e volta para reais no fim
- `find` devolve um item; `some` e `every` devolvem `true` ou `false` e param cedo
- Encadeie um passo por linha; use laço quando precisar parar no meio ou esperar
:::

---

## :icon[arrow-right] Próximos passos

Na próxima aula, você vê por que as regras do carrinho devolvem arrays e objetos **novos** em vez de mudar os que recebem, e as ferramentas para criá-los em uma linha: spread, rest e desestruturação.

No laboratório, o `subtotal` do E07 vira `reduce`, o `contarItens` nasce com `reduce`, o `aplicarFiltros` do E08 ganha um `filter` e o catálogo ganha seções por categoria, com os testes do E07 e do E08 verdes do começo ao fim. Deixe aberto o `src/regras/carrinho.js`.
