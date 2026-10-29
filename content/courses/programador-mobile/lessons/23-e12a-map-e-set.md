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

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **`Set`** (conjunto) | uma coleção de valores sem repetição, como uma lista de convidados |
| **`Map`** (mapa) | uma coleção de pares: cada chave leva a um valor, como numa agenda de contatos |
| **chave** | o que você usa para achar o valor num `Map`: aqui, o id do produto |
| **iterável** | uma coleção que o `for...of` sabe percorrer, item por item |
| **`WeakMap`** | um `Map` com objetos como chave, que esquece a entrada quando o objeto deixa de ser usado |

---

## Um coração que percorre a lista inteira

No E08, os favoritos viraram um array de ids em `src/regras/favoritos.js`, e o `src/scripts/favoritos.js` alterna os ids do comando. Para saber se um produto é favorito, `favoritos.includes(id)` percorre a lista inteira; para achar um produto pelo id, o `find` percorre o catálogo inteiro.

Hoje os favoritos viram um **Set** de ids, e o catálogo ganha um **Map** para achar cada produto pelo id. No E30, essas mesmas regras vão para o app e acendem o coração da vitrine.

:::question
Você troca o array por um `Set` e escreve o `alternarFavorito` com `favoritos.add(id)` e `return favoritos`. O favorito entra, mas o teste "alternar não altera o array recebido", do E08, reescrito com `Set`, fica vermelho. Por quê?
:::

---

## Set

Numa lista de convidados, o que acontece com um nome que já está lá?

---

## :icon[fingerprint] Set: valores sem repetição

Um **Set** (em inglês, conjunto) é uma coleção de valores **únicos**, sem posição numerada. Pense numa lista de convidados: cada nome aparece uma vez só, e a pergunta é "esta pessoa está na lista?". O Set responde direto, sem percorrer tudo como o `includes`.

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

---

## :icon[list-ordered] O Set em português

| Linha | O que ela diz |
|---|---|
| `new Set([1, 5])` | "crie a lista de convidados com o 1 e o 5" |
| `add(7)` | "ponha o 7"; se ele já estiver, nada muda |
| `has(5)` | "o 5 está na lista?": `true` ou `false` |
| `delete(5)` | "tire o 5"; responde `true` se tirou |
| `size` | "quantos são?" |
| `[...favoritos]` | "transforme num array", na ordem de entrada |

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

- Guarde **ids**, não produtos: um produto igual que vem de outro lugar é outro objeto, e o Set não o reconhece. É o endereço do E11: duas casas iguais, em endereços diferentes
- O id que chega pelo `process.argv` é texto, como no E05: converta com `Number` antes de perguntar

---

## :icon[list-checks] Set na prática

**Caso 1: as categorias do catálogo, sem repetir.** São 12 produtos, mas só 4 categorias:

```javascript
const categorias = new Set(produtos.map((p) => p.categoria));
console.log(categorias.size); // 4
console.log([...categorias]); // ['audio', 'casa', 'esporte', 'livros']
```

**Caso 2: tirar os repetidos de uma lista.** Ida e volta: o Set descarta, o spread devolve um array.

```javascript
const digitados = [7, 1, 7, 3, 1];
console.log([...new Set(digitados)]); // [7, 1, 3]
```

**Caso 3: os filtros marcados na vitrine.** A pergunta é sempre "está marcado?":

```javascript
const marcadas = new Set(['casa', 'livros']);
console.log(marcadas.has('casa'), marcadas.has('audio')); // true false
```

---

## Map

Na agenda do celular, como você acha o telefone de alguém sem ler a lista toda?

---

## :icon[key-round] Map: achar pela chave

Um **Map** (em inglês, mapa) guarda pares **chave e valor**, como uma agenda de contatos: o nome leva ao telefone. No catálogo, o id leva ao produto.

```javascript
// src/data/produtos.js, no fim do arquivo
export const produtosPorId = new Map(produtos.map((p) => [p.id, p]));
```

- `new Map(pares)` recebe uma lista de pares `[chave, valor]`
- O `map` do array, a linha de produção do E09, monta um par por produto: `[p.id, p]`, o id e o produto
- Os nomes parecem iguais, mas são coisas diferentes: o `map` com minúscula transforma uma lista; o `Map` com maiúscula guarda pares

---

## :icon[contact] Map: get, has e size

```javascript
produtosPorId.get(7);   // { id: 7, nome: 'Tênis de Corrida', ... }
produtosPorId.get('7'); // undefined: a chave é o número 7
produtosPorId.has(99);  // false
produtosPorId.size;     // 12
```

- `get(chave)`: "qual o valor desta chave?"; sem a chave, `undefined`
- `has(chave)`: "esta chave existe?"
- `set(chave, valor)` e `delete(chave)` completam o básico

O `find` percorre o catálogo a cada busca; o `get` vai direto. Como o módulo roda uma vez (E11), o Map é montado uma vez e consultado muitas: um **cache** de produtos por id, primo do `memoize` do E10.

---

## :icon[list-checks] Map na prática

**Caso 1: o produto pelo id.** O coração da vitrine só sabe o id; o Map traz o resto:

```javascript
console.log(produtosPorId.get(7).nome); // Tênis de Corrida
```

**Caso 2: a quantidade de cada produto no carrinho.** O `set` com uma chave que já existe troca o valor:

```javascript
const qtdPorId = new Map();
qtdPorId.set(7, 1);
qtdPorId.set(7, qtdPorId.get(7) + 1); // mais um tênis
qtdPorId.set(1, 1);
console.log(qtdPorId.get(7), qtdPorId.size); // 2 2
```

**Caso 3: contar produtos por categoria.** Na primeira vez, o `get` dá `undefined`, e o `|| 0` do E05 começa do zero:

```javascript
const porCategoria = new Map();
for (const p of produtos) {
  porCategoria.set(p.categoria, (porCategoria.get(p.categoria) || 0) + 1);
}
console.log(porCategoria.get('audio'), porCategoria.size); // 3 4
```

---

## Qual coleção usar

Aos favoritos, você pergunta "qual é o terceiro?" ou "este produto está lá?"

---

## :icon[scale] Array, objeto, Set ou Map?

Cada coleção responde bem a uma pergunta. Escolha pela pergunta que você vai fazer a ela:

| Coleção | Use para | Na Lojinha |
|---|---|---|
| Array | ordem, repetição, lista para mostrar | `itens` do carrinho, histórico de buscas |
| Objeto | registro com campos conhecidos | produto, pedido, `filtros` |
| Set | "está ou não está?" | ids favoritos, categorias marcadas |
| Map | buscar um valor pela chave | produtos por id, quantidade por id |

O histórico de buscas é array, e não Set: nele a ordem importa, e a busca nova vai para a frente.

---

## :icon[braces] Objeto ou Map?

Objeto serve de dicionário com chaves de texto fixas, como os `comparadores` do E08. Prefira **Map** quando a chave é número ou vem de fora:

```javascript
Object.keys({ 7: 'x' }); // ['7']: a chave virou texto
'toString' in {};        // true: o objeto vazio já tem um toString
```

- Num objeto, toda chave vira texto: o `7` vira `'7'`
- Até um objeto vazio já traz alguns nomes de fábrica, como o `toString`, por uma herança que o E17 explica. Uma chave digitada pelo usuário pode esbarrar num deles
- No Map, a chave é o que você pôs: o número `7` continua número, e ele nasce vazio

---

## Iteráveis

Como o caixa do supermercado confere a sua compra, na saída?

---

## :icon[repeat] Set e Map são iteráveis

Um **iterável** é uma coleção que o `for...of` sabe percorrer, item por item, como quem confere o carrinho até acabar: arrays, textos, `Set` e `Map`. O spread e o `Array.from` aceitam qualquer iterável.

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

- `[id, produto]` é a desestruturação do E09: o par de cada volta vira duas variáveis
- `values()` entrega só os valores do Map, sem as chaves
- `Set` e `Map` não têm `map`, `filter` nem `sort`: converta primeiro em array, com spread ou `Array.from`

---

## :icon[list-checks] Iteráveis na prática

**Caso 1: os nomes dos favoritos.** O `for...of` passa por cada id, e o Map traz o produto:

```javascript
const favoritos = new Set([7, 1]);
for (const id of favoritos) {
  console.log(produtosPorId.get(id).nome);
}
// Tênis de Corrida
// Fone Bluetooth
```

**Caso 2: os ids em ordem.** O Set não tem `sort`; o array que sai do spread tem:

```javascript
console.log([...new Set([7, 1, 3])].sort((a, b) => a - b)); // [1, 3, 7]
```

**Caso 3: quantos itens há no carrinho.** Os valores do Map viram array, e o `reduce` do E09 soma:

```javascript
const qtd = new Map([[7, 2], [1, 1]]);
console.log(Array.from(qtd.values()).reduce((total, n) => total + n, 0)); // 3
```

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

## O Set recebido

Você empresta a sua lista de convidados, e a pessoa risca um nome. A sua lista muda?

---

## :icon[bug] add e delete mudam o Set recebido

Um Set é um objeto. Passar um Set para uma função passa o endereço dele, como no E11: se a função usa `add` ou `delete`, mexe no Set de quem chamou.

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

É o **efeito colateral** do E11. As regras de `src/regras/` não fazem isso desde o E09: elas devolvem um valor novo e deixam o recebido como estava.

---

## :icon[copy] O mesmo Set ou um Set novo

:::center
![Diagrama: com add no Set recebido, antes e depois apontam o mesmo Set, depois === antes dá true e o antes também mudou; com new Set(favoritos), depois é outro Set, a comparação dá false e o antes fica intacto](images/e12-set-copia.svg)
:::

`new Set(favoritos)` cria outro Set com os mesmos ids: é tirar uma cópia e mexer na cópia, sem rasurar o original. O `add` e o `delete` acontecem nele, e o recebido fica intacto. Quando os favoritos chegarem ao app, o React vai fazer exatamente a pergunta da última linha, "é o mesmo Set?", para decidir se redesenha o coração.

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

---

## :icon[list-ordered] O script em português

| Linha | O que ela diz |
|---|---|
| `let favoritos = new Set();` | "comece sem favoritos". É `let` porque a variável recebe um Set novo a cada toque |
| `process.argv.slice(2)` | "as palavras escritas depois do nome do arquivo" (E02) |
| `Number(texto)` | "o texto `'7'` vira o número `7`" |
| `favoritos = alternarFavorito(...)` | "troque o Set velho pelo novo" |
| `[...favoritos].join(', ')` | "o Set vira array, e o `join` junta os ids com vírgula" |

Com `7 1 7 3`: o 7 entra, o 1 entra, o 7 sai e o 3 entra. Os imports vêm dos barris do E11, e o `listarFavoritos` entra no barril sozinho, pelo `export *`.

---

## Set, Map e JSON

Se você manda a lista de convidados por mensagem, o que chega: a folha ou um texto?

---

## :icon[braces] Set, Map e JSON

O JSON, do E02, só sabe escrever texto, número, lista e ficha. `JSON.stringify` não sabe escrever `Set` nem `Map`: os dois viram `{}`, e os favoritos somem sem erro.

```javascript
const favoritos = new Set([7, 1]);
JSON.stringify(favoritos);                    // '{}': os ids sumiram
```

Para guardar os favoritos num arquivo, como o `catalogo.json` do E02, ou no celular, no E43, converta antes:

- **Na ida**, espalhe num array: `JSON.stringify([...favoritos])`
- **Na volta**, entregue o array ao construtor: `new Set(JSON.parse(texto))`

Para copiar, e não guardar, o `structuredClone` do E11 copia `Set` e `Map` sem perder nada.

---

## :icon[list-checks] JSON na prática

**Caso 1: os favoritos, ida e volta.**

```javascript
const texto = JSON.stringify([...favoritos]); // '[7,1]'
const deVolta = new Set(JSON.parse(texto));   // Set de novo: has(7) é true
```

O texto `'[7,1]'` é o que vai para o arquivo; o `deVolta` é um Set igual ao original.

**Caso 2: um Map vira lista de pares.**

```javascript
const qtdPorId = new Map([[7, 2], [1, 1]]);
JSON.stringify([...qtdPorId]);                // '[[7,2],[1,1]]': lista de pares
```

Na volta, `new Map(JSON.parse(texto))` monta o Map de novo, com os mesmos pares.

---

## WeakMap

O que acontece com um bilhete colado numa caixa que vai para o lixo?

---

## :icon[memory-stick] WeakMap: uma visão

Um **WeakMap** (em inglês, mapa fraco) é um Map em que as chaves são só objetos, e ele não segura esses objetos na memória. Pense num bilhete colado no próprio objeto: quando ninguém mais usa o objeto, ele vai para o lixo, e o bilhete vai junto.

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

## :icon[list-checks] WeakMap na prática

Com o `subtotalLembrado` e o `WeakMap` chamado `subtotais`:

```javascript
const itens = [{ preco: 79.9, qtd: 2 }];
console.log(subtotais.has(itens)); // false: ainda não lembra
console.log(subtotalLembrado(itens)); // 159.8: fez a conta
console.log(subtotais.has(itens)); // true: agora lembra

const novos = [...itens, { preco: 59.9, qtd: 1 }];
console.log(subtotalLembrado(novos)); // 219.7: array novo, conta nova

subtotais.set(7, 10);
// TypeError: Invalid value used as weak map key
```

- O mesmo array: a conta sai da memória, sem refazer
- Um carrinho alterado é outro array: conta nova
- Chave número não vale: "valor inválido para chave de WeakMap"

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `favoritos.join is not a function` | o `join` é de array; o Set não tem | `[...favoritos].join(', ')` |
| `slice` ou `includes` + `is not a function` | regra de array, do E08, recebendo um Set | `new Set(favoritos)` e `has` |
| `has is not a function` | regra de Set recebendo um array no teste | `new Set(...)` nas entradas do teste |
| `Constructor Set requires 'new'` | faltou o `new` | `new Set([1, 5])` |
| `(reading 'nome')` depois de um `get` | o `get` não achou: id em texto, ou que não existe | `Number(texto)`; tratar o `undefined` |

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
