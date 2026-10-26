---
title: map, filter e reduce
summary: Transforme, filtre, some e agrupe as listas da Lojinha com métodos de array em vez de laços.
module: linguagem-js
duration_minutes: 40
objectives:
  - Transformar e filtrar listas com map e filter sem alterar o array original
  - Somar, contar e agrupar com reduce e um valor inicial
  - Responder perguntas sobre listas com find, some e every
  - Encadear métodos e decidir entre um laço e um método
---

# map, filter e reduce

Programador Mobile: Módulo Específico · Encontro E34 · Aula 49 de 71

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

Toda vez que o carrinho da Lojinha muda, a tela faz perguntas à lista `itens`:

- Quais linhas mostrar no resumo do pedido?
- Quantas unidades vão no badge da aba e quanto dá o subtotal?
- Algum item é um livro, para avisar do frete reduzido?

No E27, cada pergunta virou um laço com `let`, `for` e uma variável que muda a cada volta. Hoje cada uma vira **uma linha que diz o que faz**.

:::question
Das três perguntas, qual devolve uma lista, qual devolve um número e qual devolve sim ou não?
:::

---

## :icon[square-function] Uma função para cada item

Os métodos de hoje recebem uma **função de callback** e a chamam uma vez para cada item, na ordem. O array original não muda.

| Método | Pergunta que responde | Devolve |
|---|---|---|
| `map` | Como fica cada item? | array novo, do mesmo tamanho |
| `filter` | Quais itens passam? | array novo, igual ou menor |
| `reduce` | O que todos juntos dão? | um valor só |
| `find` | Qual é o primeiro que passa? | um item ou `undefined` |
| `some` e `every` | Algum passa? Todos passam? | `true` ou `false` |

A função recebe o item (e, se você pedir, o índice): `itens.map((item, indice) => ...)`.

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

Na tela: o resumo do pedido mostra "1x Fone Bluetooth" e "2x Luminária de Mesa".

---

## :icon[funnel] filter: manter só o que passa

A função responde `true` (fica) ou `false` (sai):

```javascript
const destaques = produtos.filter((p) => p.destaque);
// Fone Bluetooth, Luminária de Mesa, Tênis de Corrida, Lógica de Programação

const ate100 = produtos.filter((p) => p.preco <= 100);
// 6 dos 12 produtos
```

Você já usa `filter` no `CarrinhoContext`: remover um item é ficar com todos **menos** ele.

```javascript
const restantes = itens.filter((item) => item.id !== id);
```

Os objetos que passam são os mesmos do original: `filter` escolhe, não copia nem altera.

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
![Animação: o reduce começa com soma 0; a volta 1 soma o fone (qtd 1) e devolve 1, a volta 2 soma as luminárias (qtd 2) e devolve 3, a volta 3 soma o livro (qtd 1) e devolve 4, o resultado](images/e34-reduce-voltas.svg)
:::

Na tela: o badge da aba Carrinho mostra 4.

---

## :icon[coins] Somar dinheiro em centavos

O fone e duas luminárias, somados direto em reais:

```javascript
itens.reduce((soma, item) => soma + item.preco * item.qtd, 0);
// 379.70000000000005
```

O erro do ponto flutuante que você viu no E25 aparece de novo. A solução também é a mesma: some em **centavos inteiros**, com as funções de `src/regras/precos.js`, e volte para reais no fim.

```javascript
import { paraCentavos, paraReais } from './precos';

const centavos = itens.reduce(
  (soma, item) => soma + paraCentavos(item.preco) * item.qtd,
  0,
);
const total = paraReais(centavos); // 379.7
```

O `Math.round` dentro de `paraCentavos` garante o inteiro: a garrafa térmica, por exemplo, dá `79.9 * 100 = 7990.000000000001`. Na tela, `formatarPreco(total)` mostra "R$ 379,70".

---

## :icon[hash] Contar com reduce

O acumulador pode ser um **objeto**. Cada chave é um status; cada valor, quantos pedidos têm esse status:

```javascript
const porStatus = pedidos.reduce((contagem, pedido) => {
  contagem[pedido.status] = (contagem[pedido.status] ?? 0) + 1;
  return contagem;
}, {});
// { entregue: 1, pago: 1, enviado: 2 }
```

- Na primeira vez que um status aparece, `?? 0` começa a contagem
- Com chaves, a função precisa de `return`: sem ele, a volta seguinte recebe `undefined`
- Alterar `contagem` é seguro: o objeto nasceu no `{}` do valor inicial e ninguém mais o vê

Em Meus pedidos: "2 pedidos a caminho" sai de `porStatus.enviado`.

---

## :icon[boxes] Agrupar com reduce

Troque o `+ 1` por um `push` e a contagem vira um **agrupamento**: cada chave guarda a lista dos pedidos.

```javascript
const porStatus = pedidos.reduce((grupos, pedido) => {
  if (!grupos[pedido.status]) grupos[pedido.status] = [];
  grupos[pedido.status].push(pedido);
  return grupos;
}, {});
// entregue: [pedido 101], pago: [pedido 102], enviado: [pedido 103, pedido 104]
```

Contar, somar e agrupar por chave são a mesma receita: um objeto vazio no início e uma linha que decide o que guardar em cada chave.

Em "Meus pedidos", `porStatus.enviado` vira a seção "A caminho" e `porStatus.entregue`, a seção "Entregues".

---

## Pense

:::question
O badge da aba usa este código. Com o fone (`qtd: 1`) e duas luminárias (`qtd: 2`), ele mostra `[object Object]2`. Com o carrinho vazio, o app fecha com `TypeError: Reduce of empty array with no initial value`. O que está errado?

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
// Detalhe: o produto da rota, ou undefined
const produto = produtos.find((p) => p.id === Number(id));

// Carrinho: algum livro? Mostra "Livros têm frete reduzido"
const temLivro = itens.some((item) => item.categoria === 'livros');

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
- O `sort` altera o array em que é chamado; aqui ele recebe o array **novo** do `filter`, e `produtos` fica intacto

Na Início: a faixa "Mais bem avaliados" com três nomes.

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
| Parar no meio por uma regra complicada | `for` com `break` |
| Passos que esperam um ao outro (E38) | `for...of` com `await` |

Nas listas de um app, a diferença de velocidade não importa: escolha o que lê melhor.

---

## Pratique

:::example Desafio
A Início ganha o carrossel "Destaques até R$ 200". Escreva uma cadeia que devolva, dos `produtos`, só os que estão em destaque e custam até R$ 200, cada um no formato `{ id, titulo }`.
:::

:::tip Resposta
```javascript
const carrossel = produtos
  .filter((p) => p.destaque && p.preco <= 200)
  .map((p) => ({ id: p.id, titulo: p.nome }));
// Fone Bluetooth, Luminária de Mesa, Lógica de Programação
```

Filtre antes de transformar: o `map` cria objetos sem `destaque` e `preco`. Os parênteses em volta de `{ id, titulo }` são obrigatórios: sem eles, a arrow lê as chaves como corpo de função e devolve `undefined`.
:::

---

## :icon[triangle-alert] Erros comuns

:::warning
- `reduce` sem valor inicial: `[object Object]` na tela e erro com a lista vazia
- Abrir chaves na arrow e esquecer o `return`: o `map` devolve `[undefined, undefined]`
- Devolver um objeto sem parênteses: `(p) => { id: p.id }` não devolve objeto nenhum
- Usar `map` para filtrar: os itens que "não passam" viram `undefined`, e o tamanho não muda
- Usar `map` só para executar algo, sem usar o array que ele devolve: isso é trabalho de `forEach` ou `for...of`
- Confiar em `every` com a lista vazia: ele devolve `true`
:::

---

## Resumo

:::summary
- `map` transforma cada item e mantém o tamanho; `filter` mantém só os itens que passam no teste
- `reduce` junta a lista num valor só: some, conte ou agrupe, sempre com valor inicial
- Dinheiro se soma em centavos inteiros e se divide por 100 no fim
- `find` devolve um item; `some` e `every` devolvem `true` ou `false` e param cedo
- Encadeie um passo por linha; use laço quando precisar parar no meio ou esperar
:::

---

## :icon[arrow-right] Próximos passos

Na próxima aula, você vê por que o React só redesenha a tela quando recebe um array ou objeto **novo**, e as ferramentas para criá-los: spread, rest e desestruturação.

No laboratório, `subtotal`, `contarItens` e `itemMaisCaro`, escritos com laços no E27, viram `reduce`, e os mesmos testes precisam continuar passando. Deixe aberto o `src/regras/carrinho.js`.
