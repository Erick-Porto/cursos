---
title: Map, Set e os favoritos
summary: Set e Map nas coleções da Lojinha, iteráveis e as regras de favoritos reescritas com um Set de ids.
module: linguagem-js
duration_minutes: 40
objectives:
  - Usar Set para ids únicos e Map para achar produtos pela chave
  - Escolher entre array, objeto, Set e Map para cada coleção da Lojinha
  - Percorrer e converter Set e Map com for...of, spread e Array.from
  - Reescrever as regras de favoritos com Set sem alterar o Set recebido
---

# Map, Set e os favoritos

Programador Mobile · Encontro E12 · Aula 23 de 89

---

## O que você vai aprender

:::goal
- Guardar ids sem repetição num `Set` e achar produtos pelo id num `Map`
- Escolher a coleção certa: array, objeto, `Set` ou `Map`
- Percorrer e converter coleções iteráveis com `for...of`, spread e `Array.from`
- Reescrever as regras de favoritos com `Set`, devolvendo sempre um `Set` novo
- Conhecer o cuidado com `Set` e `Map` no JSON e, como visão, o `WeakMap`
:::

---

## Um coração que percorre a lista inteira

No E08, os favoritos viraram um array de ids em `src/regras/favoritos.js`, e o `src/scripts/favoritos.js` alterna os ids do comando. Para saber se um produto é favorito, `favoritos.includes(id)` percorre a lista inteira; para achar um produto pelo id, o `find` percorre o catálogo inteiro.

Hoje os favoritos viram um **Set** de ids, e o catálogo ganha um **Map** para achar cada produto pelo id. No E30, essas mesmas regras vão para o app e acendem o coração da vitrine.

:::question
Você troca o array por um `Set` e escreve o `alternarFavorito` com `favoritos.add(id)` e `return favoritos`. O favorito entra, mas o teste "alternar não altera o array recebido", do E08, reescrito com `Set`, fica vermelho. Por quê?
:::

---

## :icon[fingerprint] Set: valores sem repetição

Um **Set** é uma coleção de valores **únicos**, sem índice. Ele responde direto à pergunta "este id está aqui?", sem percorrer a lista como o `includes`.

```javascript
const favoritos = new Set([1, 5]); // nasce a partir de um array
favoritos.add(7);    // entra
favoritos.add(1);    // já estava: nada muda
favoritos.has(5);    // true
favoritos.delete(5); // true: removeu
favoritos.delete(5); // false: não estava mais
favoritos.size;      // 2
[...favoritos];      // [1, 7]: na ordem de entrada

new Set([1, 5, 1, 1]).size; // 2: os repetidos somem
```

- `size` é propriedade, não método: sem parênteses
- A ordem é a de entrada, mas não existe `favoritos[0]`
- `add` e `delete` mudam o próprio Set, como o `push` e o `splice` num array

---

## :icon[equal] O Set compara como o `===`

Para saber se um valor já está lá, o Set usa a mesma ideia do `===`. Duas consequências:

```javascript
const favoritos = new Set([7]);
favoritos.has(7);           // true
favoritos.has('7');         // false: texto não é número
favoritos.has(Number('7')); // true: converta o que chega como texto

const deObjetos = new Set([{ id: 7 }]);
deObjetos.has({ id: 7 });             // false: outro objeto, outro endereço
new Set([{ id: 7 }, { id: 7 }]).size; // 2: nada foi descartado
```

- Guarde **ids**, não produtos: um produto igual que vem de outro lugar é outro objeto, e o Set não o reconhece. São as etiquetas e caixas do E11
- O id que chega pelo `process.argv` é texto, como no E05: converta com `Number` antes de perguntar

---

## :icon[key-round] Map: achar pela chave

Um **Map** guarda pares **chave e valor**. `new Map(pares)` recebe uma lista de `[chave, valor]`, e o `map` do array monta um par por produto:

```javascript
// src/data/produtos.js, no fim do arquivo
export const produtosPorId = new Map(produtos.map((p) => [p.id, p]));
```

```javascript
produtosPorId.get(7);   // { id: 7, nome: 'Tênis de Corrida', ... }
produtosPorId.get('7'); // undefined: a chave é o número 7
produtosPorId.has(99);  // false
produtosPorId.size;     // 12
```

O `find` percorre o catálogo a cada busca; o `get` vai direto. Como o módulo roda uma vez (E11), o Map é montado uma vez e consultado muitas: um **cache** de produtos por id, primo do `memoize` do E10. `set(chave, valor)` e `delete(chave)` completam o básico.

---

## :icon[scale] Array, objeto, Set ou Map?

A pergunta que você faz à coleção decide:

| Coleção | Use para | Na Lojinha |
|---|---|---|
| Array | ordem, repetição, lista para mostrar | `itens` do carrinho, histórico de buscas |
| Objeto | registro com campos conhecidos | produto, pedido, `filtros` |
| Set | "está ou não está?" | ids favoritos, categorias marcadas |
| Map | buscar um valor pela chave | produtos por id, quantidade por id |

Objeto serve de dicionário com chaves de texto fixas, como os `comparadores` do E08. Prefira **Map** quando a chave é número (em `{ 7: 'x' }`, ela vira `'7'`) ou vem de fora: até um objeto vazio responde `true` para `'toString' in {}`, herança que o E17 explica.

---

## :icon[repeat] Set e Map são iteráveis

Um **iterável** é uma coleção que o `for...of` sabe percorrer: arrays, textos, `Set` e `Map`. O spread e o `Array.from` aceitam qualquer iterável.

```javascript
const favoritos = new Set([7, 1]);
for (const id of favoritos) {
  console.log(id); // 7, depois 1
}

for (const [id, produto] of produtosPorId) {
  console.log(id, produto.nome); // cada volta é um par [chave, valor]
}

const ids = [...favoritos];                       // [7, 1]: o Set vira array
const lista = Array.from(produtosPorId.values()); // os 12 produtos
```

`Set` e `Map` não têm `map`, `filter` nem `sort`. Converta primeiro, com spread ou `Array.from`, e use os métodos de array do E09. O `[id, produto]` é a desestruturação do E09.

---

## Pratique

:::example Desafio
Em `src/regras/favoritos.js`, escreva `listarFavoritos(favoritos, produtosPorId)`: recebe o `Set` de ids e o `Map` de produtos e devolve o array de produtos favoritos, na ordem em que foram favoritados. Um id que saiu do catálogo é ignorado.
:::

:::tip Resposta
```javascript
export function listarFavoritos(favoritos, produtosPorId) {
  return [...favoritos]
    .map((id) => produtosPorId.get(id))
    .filter((produto) => produto !== undefined);
}
```

O spread transforma o `Set` em array, o `map` troca cada id pelo produto e o `filter` descarta o `undefined` de um id que sumiu. Com `new Set([7, 99, 1])`, sai o array com o Tênis de Corrida e o Fone Bluetooth. É a lista que o script de hoje imprime e que, no E30, a tela de favoritos mostra.
:::

---

## :icon[bug] add e delete mudam o Set recebido

```javascript
// errado: mexe no Set que a função recebeu
function alternarFavorito(favoritos, id) {
  if (favoritos.has(id)) {
    favoritos.delete(id);
  } else {
    favoritos.add(id);
  }
  return favoritos;
}

const antes = new Set([1]);
const depois = alternarFavorito(antes, 7);
antes.size;       // 2: o antes também ganhou o 7
depois === antes; // true: é o mesmo Set
```

É o **efeito colateral** do E11: o Set é passado por referência, e a função muda o dado de quem a chamou. As regras de `src/regras/` não fazem isso desde o E09: elas devolvem um valor novo e deixam o recebido como estava.

---

## :icon[copy] O mesmo Set ou um Set novo

:::center
![Diagrama: com add no Set recebido, antes e depois apontam o mesmo Set, depois === antes dá true e o antes também mudou; com new Set(favoritos), depois é outro Set, a comparação dá false e o antes fica intacto](images/e12-set-copia.svg)
:::

`new Set(favoritos)` cria outro Set com os mesmos ids. O `add` e o `delete` acontecem nele, e o recebido fica intacto. Quando os favoritos chegarem ao app, o React vai fazer exatamente a pergunta da última linha, "é o mesmo Set?", para decidir se redesenha o coração.

---

## :icon[test-tube] As regras do E08 com Set

Em `src/regras/favoritos.js`, os nomes continuam; mudam o miolo e os testes.

```javascript
export function ehFavorito(favoritos, id) {
  return favoritos.has(id);
}

export function alternarFavorito(favoritos, id) {
  const novo = new Set(favoritos); // o Set recebido não muda
  if (novo.has(id)) {
    novo.delete(id);
  } else {
    novo.add(id);
  }
  return novo;
}
```

```javascript
test('alternar não altera o Set recebido e devolve outro', () => {
  const favoritos = new Set([3]);
  const novo = alternarFavorito(favoritos, 7);
  expect(novo).toEqual(new Set([3, 7]));
  expect(favoritos).toEqual(new Set([3]));
  expect(novo).not.toBe(favoritos);
});
```

`toEqual` compara o conteúdo; `not.toBe` garante que é outro Set, a mesma pergunta do `===`. Congelar a entrada, como no E11, não serve aqui: o `Object.freeze` não impede o `add` de um Set.

---

## :icon[terminal] Os favoritos no terminal

O script do E08 muda pouco: o começo vazio vira `new Set()`, e o `join`, que é de array, pede o spread.

```javascript
// src/scripts/favoritos.js
import { produtosPorId } from '../data/produtos.js';
import { alternarFavorito, listarFavoritos } from '../regras/index.js';
import { formatarPreco } from '../utils/index.js';

let favoritos = new Set();
for (const texto of process.argv.slice(2)) {
  favoritos = alternarFavorito(favoritos, Number(texto)); // um toque no coração
}

console.log(`Favoritos: ${[...favoritos].join(', ')}`);
for (const produto of listarFavoritos(favoritos, produtosPorId)) {
  console.log(`${produto.nome}: ${formatarPreco(produto.preco)}`);
}
```

```bash
node src/scripts/favoritos.js 7 1 7 3
# Favoritos: 1, 3
# Fone Bluetooth: R$ 199,90
# Microfone USB: R$ 329,90
```

O 7 entra, o 1 entra, o 7 sai e o 3 entra. Os imports vêm dos barris do E11, e o `listarFavoritos` entra no barril sozinho, pelo `export *`.

---

## :icon[braces] Set, Map e JSON

`JSON.stringify` não sabe escrever `Set` nem `Map`: os dois viram `{}`, e os favoritos somem sem erro. Para guardar os favoritos num arquivo, como o `catalogo.json` do E02, ou no celular, no E43, converta antes:

```javascript
const favoritos = new Set([7, 1]);
JSON.stringify(favoritos);                    // '{}': os ids sumiram

const texto = JSON.stringify([...favoritos]); // '[7,1]'
const deVolta = new Set(JSON.parse(texto));   // Set de novo: has(7) é true

const qtdPorId = new Map([[7, 2], [1, 1]]);
JSON.stringify([...qtdPorId]);                // '[[7,2],[1,1]]': lista de pares
```

Na ida, espalhe num array. Na volta, entregue o array ao construtor. Para copiar, e não guardar, o `structuredClone` do E11 copia `Set` e `Map` sem perder nada.

---

## :icon[memory-stick] WeakMap: uma visão

Um **WeakMap** é um Map com duas diferenças: as chaves são só objetos, e ele não segura esses objetos na memória. Quando nada mais aponta para um carrinho, a entrada dele some junto.

```javascript
import { subtotal } from './carrinho.js';

const subtotais = new WeakMap();

function subtotalLembrado(itens) {
  if (!subtotais.has(itens)) {
    subtotais.set(itens, subtotal(itens)); // conta feita uma vez por array
  }
  return subtotais.get(itens);
}
```

- Combina com o E09: carrinho alterado é array novo, com entrada nova; o antigo é limpo
- Chave que não é objeto, como `set(7, ...)`, lança `TypeError`
- Sem `size` e sem `for...of`. `WeakSet` é a versão para conjuntos; você raramente escreve um

---

## :icon[triangle-alert] Erros comuns

:::warning
- `add` ou `delete` no Set que a regra recebeu: quem chamou perde o Set antigo; trabalhe num `new Set(favoritos)`
- `ehFavorito(favoritos, '7')` com o texto do `process.argv`: converta com `Number`
- Guardar o produto inteiro no Set: outro objeto igual não é encontrado; guarde o id
- `favoritos.join(', ')` ou `favoritos[0]`: Set não é array; espalhe com `[...favoritos]`
- `JSON.stringify(favoritos)`: grava `{}`; converta para array antes
- `Object.freeze` ou o `congelarTudo` do E11 para proteger o Set: o `add` continua funcionando, porque os valores não ficam em propriedades
- `Set([1, 5])` sem `new`: `TypeError: Constructor Set requires 'new'`
:::

---

## Resumo

:::summary
- `Set` guarda valores únicos e responde `has` direto; `Map` guarda pares e busca com `get`. Os dois comparam como o `===`: guarde ids, com o tipo certo
- Array para ordem e listas, objeto para registros, `Set` para "está ou não está", `Map` para buscar pela chave
- `Set` e `Map` são iteráveis: `for...of`, spread e `Array.from` funcionam, e o spread os transforma em array
- Numa regra pura, `add` e `delete` só acontecem num `new Set(...)`, e a função devolve o novo
- No JSON, converta para array na ida e volte com o construtor
:::

---

## :icon[arrow-right] Próximos passos

Na aula 24, a última da unidade Linguagem JavaScript, você prova o **TypeScript**: tipos que o editor confere enquanto você digita, inclusive o `Set<number>` dos favoritos, que sublinha o `'7'` antes de rodar.

No laboratório do E12, os favoritos ganham o `Set`, o catálogo ganha o `Map`, e um arquivo de rascunho em TypeScript passa pelo compilador.
