---
title: Laços sobre coleções
summary: for...of, for...in e laços aninhados nas regras do carrinho, na busca sem acento e na paginação da Lojinha.
module: logica-js
duration_minutes: 40
objectives:
  - Percorrer arrays e strings com for...of
  - Explicar os riscos do for...in e quando usá-lo
  - Escrever laços aninhados e estimar quanto custam
  - Depurar um laço com breakpoint no React Native DevTools
---

# Laços sobre coleções

Programador Mobile: Módulo Específico · Encontro E27 · Aula 36 de 71

---

## O que você vai aprender

:::goal
- Percorrer arrays e strings com `for...of`, sem índice
- Usar `for...in` em objetos e evitá-lo em arrays
- Escrever laços aninhados e estimar quantas voltas eles dão
- Pausar um laço com breakpoint e acompanhar as variáveis volta a volta
:::

---

## A busca que não acha o tênis

A cliente toca na busca da Lojinha e digita "tenis", sem acento, como quase todo mundo digita no celular. O produto se chama "Tênis de Corrida", e a comparação direta falha:

```javascript
'Tênis de Corrida'.toLowerCase().includes('tenis'); // false
```

Para a busca funcionar, o app precisa passar por **cada produto** da vitrine, deixar nome e termo no mesmo formato e guardar os que combinam. É um laço sobre uma coleção, e você o escreve hoje, junto com as regras do carrinho.

:::question
Que passos a busca repete para cada produto? E o que ela devolve quando o campo está vazio?
:::

---

## :icon[list] for...of: um item por volta

O `for...of` entrega **cada item** do array, na ordem, sem índice. Compare as duas formas de contar as unidades do carrinho:

```javascript
// for clássico: índice, condição e passo por sua conta
for (let i = 0; i < itens.length; i++) {
  total += itens[i].qtd;
}

// for...of: o JavaScript entrega o item da volta
for (const item of itens) {
  total += item.qtd;
}
```

- `item` é uma constante nova a cada volta: `const` é o certo aqui
- Sem índice, não existe `<=` para errar
- Precisa da posição ou de começar no meio da lista? Use o `for` clássico

---

## :icon[text] for...of em strings

Uma string também é uma coleção: o `for...of` entrega um caractere por volta. O CEP chega do `Campo` com máscara, "01310-100", e o frete precisa só dos dígitos:

```javascript
function somenteDigitos(texto) {
  let digitos = '';
  for (const caractere of texto) {
    if ('0123456789'.includes(caractere)) {
      digitos += caractere;
    }
  }
  return digitos;
}
somenteDigitos('01310-100'); // '01310100'
```

O acumulador aqui é uma string: começa vazia e cresce a cada dígito. É o que o `cep.replace(/\D/g, '')` do `calcularFrete` faz por dentro, volta a volta; no E33, você aprende a ler essa expressão regular.

---

## :icon[braces] for...in: as chaves de um objeto

O `for...in` percorre as **chaves** de um objeto. Para montar o resumo da vitrine por categoria:

```javascript
const porCategoria = { audio: 3, casa: 3, esporte: 3, livros: 3 };
const linhas = [];
for (const slug in porCategoria) {
  linhas.push(slug + ': ' + porCategoria[slug] + ' produtos');
}
// ['audio: 3 produtos', 'casa: 3 produtos', ...]
```

- A cada volta, `slug` recebe o **nome** da chave, como texto
- O valor sai com colchetes: `porCategoria[slug]`
- `porCategoria.slug` procuraria uma chave chamada literalmente "slug" e daria `undefined`

---

## :icon[shield-alert] Os riscos do for...in

Num array, o `for...in` não entrega os itens, e sim as posições, **como texto**:

```javascript
const nomes = ['Fone Bluetooth', 'Luminária de Mesa'];
for (const i in nomes) {
  console.log(i + 1); // '01' e '11', não 1 e 2
}
```

| Risco | O que acontece |
|---|---|
| Posição em texto | `'0' + 1` concatena e vira `'01'` |
| Chaves extras | passa também por propriedades acrescentadas ou herdadas |
| Ordem | chaves numéricas primeiro, em ordem crescente, depois as outras |

Regra da Lojinha: array com `for` ou `for...of`; objeto com `for...in` (ou `Object.keys`, no E29).

---

## Pense

:::question
Este laço deveria somar um carrinho de 2 itens. O que fica em `total`, e por quê?

```javascript
let total = 0;
for (const item in itens) {
  total += item.preco * item.qtd;
}
```
:::

:::tip Resposta
`NaN`. Com `in`, `item` recebe `'0'` e `'1'`, as posições em texto, e não os objetos. `'0'.preco` é `undefined`, e `undefined * undefined` dá `NaN`, que contamina toda a soma: o carrinho mostraria "R$ NaN". Trocar `in` por `of` resolve, uma palavra de diferença.
:::

---

## :icon[layers] Laços aninhados

Num laço dentro de outro, para cada volta de fora o de dentro roda **inteiro**. Para contar os produtos de cada categoria:

```javascript
function contarPorCategoria(categorias, produtos) {
  const contagem = {};
  for (const categoria of categorias) {
    let quantos = 0;
    for (const produto of produtos) {
      if (produto.categoria === categoria.slug) quantos++;
    }
    contagem[categoria.slug] = quantos;
  }
  return contagem; // { audio: 3, casa: 3, esporte: 3, livros: 3 }
}
```

O contador `quantos` nasce **dentro** do laço de fora: recomeça em 0 para cada categoria. São 4 categorias vezes 12 produtos: **48 voltas** do laço de dentro.

---

## :icon[gauge] Quanto custa um laço aninhado

As voltas se multiplicam:

| Categorias | Produtos | Voltas de dentro |
|---|---|---|
| 4 | 12 | 48 |
| 20 | 1.000 | 20.000 |
| 50 | 10.000 | 500.000 |

Numa tela, a conta roda a cada renderização, por exemplo a cada letra digitada na busca. Muitas vezes uma passada só resolve:

```javascript
const contagem = {};
for (const produto of produtos) {
  contagem[produto.categoria] = (contagem[produto.categoria] ?? 0) + 1;
}
```

São 12 voltas em vez de 48. Aninhe quando precisar mesmo cruzar duas listas, e use `break` assim que achar o que procura.

---

## :icon[search] Comparando sem acento e sem maiúsculas

Antes de comparar, deixe nome e termo no mesmo formato:

```javascript
function normalizar(texto) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}
normalizar('Tênis de Corrida'); // 'tenis de corrida'
```

| Passo | `'Tênis'` vira |
|---|---|
| `normalize('NFD')` | `T`, `e`, um acento solto, `n`, `i`, `s` |
| `replace(...)` | `'Tenis'`: os acentos soltos saem |
| `toLowerCase()` | `'tenis'` |

O trecho `/[\u0300-\u036f]/g` é uma **expressão regular** que quer dizer "qualquer acento solto". Hoje, use como receita; no E33 você aprende a ler regex. Normalize **os dois lados**: o termo digitado e o nome do produto.

---

## :icon[search-check] buscarProdutos com for...of

```javascript
export function buscarProdutos(produtos, termo) {
  const procurado = normalizar(termo).trim();
  if (procurado === '') return produtos;
  const encontrados = [];
  for (const produto of produtos) {
    if (normalizar(produto.nome).includes(procurado)) {
      encontrados.push(produto);
    }
  }
  return encontrados;
}
```

- Campo vazio, ou só com espaços, devolve a vitrine toda: guard clause do E26
- `includes` acha o termo em qualquer parte do nome: "corr" acha "Tênis de Corrida"
- `encontrados` é um array **novo**: a lista recebida não muda, e a função continua pura

---

## :icon[layout-list] Paginar: um pedaço da lista por vez

Apps não desenham mil produtos de uma vez: mostram páginas. Na página `p` de tamanho `t`, a primeira posição é `(p - 1) * t`.

```javascript
export function paginar(lista, pagina, tamanho) {
  if (pagina < 1 || tamanho < 1) return [];
  const inicio = (pagina - 1) * tamanho;
  const fim = Math.min(inicio + tamanho, lista.length);
  const resultado = [];
  for (let i = inicio; i < fim; i++) {
    resultado.push(lista[i]);
  }
  return resultado;
}
```

Aqui o `for` clássico vence: você precisa das posições. `Math.min` impede passar do fim da lista. No E40, a mesma conta pede à API uma página de cada vez.

---

## :icon[layout-list] As páginas como fatias

:::center
![Diagrama: as posições 0 a 11 de 12 produtos divididas em páginas de 5; a página 1 tem 0 a 4, a 2 tem 5 a 9, a 3 só 10 e 11 porque Math.min corta o fim em 12, e a página 4 começa em 15 e devolve uma lista vazia](images/e27-paginar.svg)
:::

Com 12 produtos e páginas de 5: a página 1 tem as posições 0 a 4; a 3, só 10 e 11; a 4, nenhuma. Na página 3, o `Math.min` corta o `fim` em 12; na 4, o `inicio` já passou do fim e o laço não dá nenhuma volta.

---

## Pratique

:::example Desafio
Escreva `itemMaisCaro(itens)` com `for...of`. Ela devolve o item de maior **preço unitário**; com a lista vazia, `null`; no empate, fica o primeiro.
:::

:::tip Resposta
```javascript
export function itemMaisCaro(itens) {
  let maisCaro = null;
  for (const item of itens) {
    if (maisCaro === null || item.preco > maisCaro.preco) {
      maisCaro = item;
    }
  }
  return maisCaro;
}
```

Começar em `null` resolve a lista vazia sem `if` extra. O `>`, e não `>=`, mantém o primeiro no empate. Compare `preco`, não `preco * qtd`: 6 garrafas somam mais que 2 fones, mas o item mais caro é o fone.
:::

---

## :icon[bug] Depurando um laço com breakpoint

Um `console.log` num laço de 500 voltas enche o terminal. Pause o laço e olhe:

:::steps
1. Com `npx expo start` rodando, aperte `j`: o React Native DevTools abre
2. Em **Sources**, aperte <kbd>Ctrl</kbd> + <kbd>P</kbd> e abra `carrinho.js`
3. Clique no número de uma linha dentro do laço de `buscarProdutos`
4. Digite uma letra na busca: o app pausa naquela linha
5. Em **Scope**, veja `produto` e `encontrados`; <kbd>F8</kbd> segue até a próxima volta e <kbd>F10</kbd> anda uma linha
:::

:::tip Breakpoint condicional
Clique com o botão direito no número da linha, escolha "Add conditional breakpoint" e escreva `produto.id === 7`: o app só pausa na volta do tênis.
:::

---

## :icon[triangle-alert] Erros comuns

:::warning
- `for...in` num array: posições em texto e `NaN` na soma
- Normalizar só o termo: "Tênis de Corrida" nunca aparece, com ou sem acento na busca
- Página começando em 0 num lugar e em 1 no outro: a primeira página some ou se repete
- Laço aninhado na tela para uma conta que uma passada resolve
- `push` ou `splice` na própria lista que o laço percorre: voltas a mais ou a menos
- `return` no lugar de `continue` dentro do laço: a busca para no primeiro produto que não combina
:::

---

## Resumo

:::summary
- `for...of` entrega cada item de um array ou cada caractere de uma string, sem índice
- `for...in` entrega as chaves de um objeto, como texto; em array, evite
- Em laços aninhados as voltas se multiplicam: prefira uma passada quando ela resolve
- Busca boa normaliza os dois lados: sem acento, sem maiúsculas e sem espaços nas pontas
- Um breakpoint, condicional se preciso, mostra as variáveis de cada volta sem encher o terminal
:::

---

## :icon[flask-conical] No laboratório

Regras com laços, testes e a busca na Início.

:::steps
1. `subtotal` (`for`, em centavos) e `contarItens` (`for...of`) em `src/regras/carrinho.js`, com testes
2. `itemMaisCaro(itens)` e `paginar(lista, pagina, tamanho)`, página começando em 1
3. `buscarProdutos(produtos, termo)` com `normalizar`; teste "TENIS", "lógica" e campo vazio
4. `CarrinhoContext` chamando `contarItens` e `subtotal`
5. Início: `Campo` de busca e `buscarProdutos` sobre a lista filtrada
6. Nada encontrado: `EstadoVazio` com "Limpar busca"
7. `npm run verificar`, commit "E27: totais, busca e paginação com laços" e `git push`
:::

**Critérios de entrega**: só laços nas funções, sem `reduce`, `filter` ou `find`; 2 testes ou mais cada, um com lista vazia, todos verdes; a busca acha "tenis" e "LOGICA"; badge e total do carrinho certos. Entregue o link do repositório no sistema.
