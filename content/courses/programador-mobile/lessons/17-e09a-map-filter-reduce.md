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

## :icon[square-function] Uma função para cada item

Os métodos de hoje recebem uma **função de callback**, que o método chama uma vez para cada item, na ordem. O array original não muda.

| Método | Pergunta | Devolve |
|---|---|---|
| `map` | Como fica cada item? | array novo, do mesmo tamanho |
| `filter` | Quais itens passam? | array novo, igual ou menor |
| `reduce` | O que todos juntos dão? | um valor só |
| `find` | Qual é o primeiro que passa? | um item ou `undefined` |
| `some` e `every` | Algum passa? Todos passam? | `true` ou `false` |

O `find` e o `sort` do E08 já recebiam uma função assim. Ela recebe o item e, se pedir, o índice.

---

## :icon[arrow-right] map: transformar cada item

```javascript
const itens = [
  { id: 1, nome: 'Fone Bluetooth', preco: 199.9, qtd: 1 },
  { id: 4, nome: 'Luminária de Mesa', preco: 89.9, qtd: 2 },
];

const linhas = itens.map((item) => `${item.qtd}x ${item.nome}`);
// ['1x Fone Bluetooth', '2x Luminária de Mesa']
```

- O que a função **devolve** vira o item do array novo, na mesma posição
- Duas entradas, duas saídas: `map` nunca muda o tamanho
- `itens` continua igual; `linhas` é outro array

`console.log(linhas.join('\n'))` imprime uma linha por item: no laboratório, ele substitui o laço que imprime o carrinho no `simular-carrinho.js`. No E30, essas linhas vão para a tela do app.

---

## :icon[funnel] filter: manter só o que passa

A função responde `true` (fica) ou `false` (sai):

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

Os objetos que passam são os mesmos do original: `filter` escolhe, não copia nem altera. O laço da categoria no `aplicarFiltros` do E08 encolhe do mesmo jeito.

---

## :icon[sigma] reduce: muitos itens, um valor

```javascript
const quantidade = itens.reduce((soma, item) => soma + item.qtd, 0);
```

- `soma` é o **acumulador**: começa no **valor inicial** (`0`, o último argumento)
- A cada volta, o que a função devolve vira o acumulador da volta seguinte
- O que sobra depois do último item é o resultado

Com o fone (1), duas luminárias (2) e um livro (1):

:::center
![Animação: o reduce começa com soma 0; a volta 1 soma o fone (qtd 1) e devolve 1, a volta 2 soma as luminárias (qtd 2) e devolve 3, a volta 3 soma o livro (qtd 1) e devolve 4, o resultado](images/e09-reduce-voltas.svg)
:::

É o `contarItens` do laboratório. No E37, esse 4 vira o badge da aba Carrinho no app.

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

O `Math.round` dentro de `paraCentavos` garante o inteiro: a garrafa térmica, por exemplo, dá `79.9 * 100 = 7990.000000000001`. `formatarPreco(total)` imprime "R$ 379,70".

---

## :icon[hash] Contar com reduce

O acumulador pode ser um **objeto**. É o `contarPorCategoria` do E08, com `reduce`:

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

Contar, somar e agrupar por chave são a mesma receita: um objeto vazio no início e uma linha que decide o que guardar em cada chave.

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

## :icon[search] find, some e every

```javascript
// O produto de um id, ou undefined: o find do E08
const produto = produtos.find((p) => p.id === 7);

// Algum item já chegou ao limite de 10 unidades?
const noLimite = itens.some((item) => item.qtd === 10);

// Checkout: todas as quantidades entre 1 e 10?
const quantidadesOk = itens.every((item) => item.qtd >= 1 && item.qtd <= 10);
```

- Os três **param** assim que a resposta fica clara: `find` e `some` no primeiro que passa, `every` no primeiro que falha
- `find` devolve o próprio item; `filter` devolveria um array com ele dentro
- Com a lista vazia, `every` devolve `true`: um carrinho vazio passaria na validação. Confira `itens.length > 0` junto

---

## :icon[workflow] Encadeando métodos

Como `filter` e `map` devolvem arrays, você chama o próximo método direto no resultado:

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

## :icon[scale] Laço ou método?

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
