---
title: Map, Set e os favoritos
summary: Set e Map nas coleções do app, iteráveis, WeakMap como visão e os favoritos num contexto próprio com Set.
module: linguagem-js
duration_minutes: 40
objectives:
  - Usar Set para ids únicos e Map para achar produtos pela chave
  - Escolher entre array, objeto, Set e Map para cada coleção do app
  - Percorrer e converter Set e Map com for...of, spread e Array.from
  - Guardar um Set no estado do React criando um Set novo a cada mudança
---

# Map, Set e os favoritos

Programador Mobile: Módulo Específico · Encontro E36 · Aula 54 de 71

---

## O que você vai aprender

:::goal
- Guardar ids sem repetição num `Set` e achar produtos pelo id num `Map`
- Escolher a coleção certa: array, objeto, `Set` ou `Map`
- Percorrer e converter coleções iteráveis com `for...of`, spread e `Array.from`
- Levar os favoritos para um contexto próprio, recriando o `Set` a cada toque
- Conhecer o `WeakMap` e o cuidado com `Set` e `Map` no JSON
:::

---

## Um coração para o app inteiro

No E29, o coração ganhou regras puras e um array de ids guardado no estado do Início. O app cresceu: o coração aparece na vitrine, nas categorias e no Detalhe, e o Perfil vai ganhar uma tela só de favoritos. Um estado preso no Início não chega a essas telas, e cada coração pergunta `favoritos.includes(id)`, que percorre a lista inteira.

Hoje os favoritos viram um **Set** de ids num **contexto** próprio, e o catálogo ganha um **Map** para achar cada produto pelo id.

:::question
Você troca o array por um `Set`, escreve `favoritos.add(id)` e chama `setFavoritos(favoritos)`. O coração não acende. Por quê?
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
favoritos.has(7);          // true
favoritos.has('7');        // false: texto não é número
favoritos.has(Number(id)); // true quando id é '7', o parâmetro da rota

const deObjetos = new Set([{ id: 7 }]);
deObjetos.has({ id: 7 });             // false: outro objeto, outro endereço
new Set([{ id: 7 }, { id: 7 }]).size; // 2: nada foi descartado
```

- Guarde **ids**, não produtos: o produto que chega por outra tela é outro objeto, e o Set não o reconhece
- O `id` da rota chega como texto, como no E16: converta com `Number(id)` antes de perguntar

---

## :icon[key-round] Map: achar pela chave

Um **Map** guarda pares **chave e valor**. `new Map(pares)` recebe uma lista de `[chave, valor]`, e o `map` do array monta um par por produto:

```javascript
// src/data/produtos.js
import catalogo from './catalogo.json';

export const { categorias, produtos } = catalogo;
export const produtosPorId = new Map(produtos.map((p) => [p.id, p]));
```

```javascript
produtosPorId.get(7);   // { id: 7, nome: 'Tênis de Corrida', ... }
produtosPorId.get('7'); // undefined: a chave é o número 7
produtosPorId.has(99);  // false
produtosPorId.size;     // 12
```

O `find` percorre o catálogo a cada busca; o `get` vai direto. Como o módulo roda uma vez (E35), o Map é montado uma vez e consultado muitas: um **cache** de produtos por id. `set(chave, valor)` e `delete(chave)` completam o básico.

---

## :icon[scale] Array, objeto, Set ou Map?

A pergunta que a tela faz à coleção decide:

| Coleção | Use para | Na Lojinha |
|---|---|---|
| Array | ordem, repetição ou lista na tela | `itens` do carrinho, `data` da `FlatList` |
| Objeto | registro com campos conhecidos | produto, pedido, `filtros` |
| Set | "está ou não está?" | ids favoritos, categorias marcadas |
| Map | buscar um valor pela chave | produtos por id, quantidade por id |

Objeto serve de dicionário com chaves de texto fixas, como os `comparadores` do E29. Prefira **Map** quando a chave é número (em `{ 7: 'x' }`, ela vira `'7'`) ou vem de fora: num objeto, `'toString' in cache` é `true`, herança do protótipo.

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

const ids = [...favoritos];                        // [7, 1]: o Set vira array
const lista = Array.from(produtosPorId.values()); // os 12 produtos
```

`Set` e `Map` não têm `map`, `filter` nem `sort`, e a `FlatList` só aceita array. Converta primeiro, com spread ou `Array.from`, e use os métodos de array do E34.

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

O spread transforma o `Set` em array, o `map` troca cada id pelo produto e o `filter` descarta o `undefined` de um id que sumiu. Com `new Set([7, 99, 1])`, sai o array com o Tênis de Corrida e o Fone Bluetooth. É a lista que a tela de favoritos entrega à `FlatList`.
:::

---

## :icon[refresh-cw] Set no estado: crie um novo

```jsx
// errado: muda o Set que já está no estado
function alternar(id) {
  favoritos.add(id);
  setFavoritos(favoritos); // mesma referência: o React ignora
}

// certo: um Set novo, feito a partir do anterior
function alternar(id) {
  setFavoritos((anterior) => {
    const novo = new Set(anterior); // copia os ids
    if (novo.has(id)) novo.delete(id);
    else novo.add(id);
    return novo;
  });
}
```

A **forma de função** do `set` recebe o valor mais recente, mesmo com duas chamadas antes de a tela redesenhar.

---

## :icon[refresh-cw] O mesmo Set ou um Set novo

:::center
![Diagrama: com add no mesmo Set, o valor atual e o novo são o mesmo objeto, Object.is dá true e o coração não acende; com new Set(anterior), o novo é outro Set, Object.is dá false e o coração acende](images/e36-set-novo.svg)
:::

`add` e `delete` mudam o Set **por dentro**. O React compara o valor novo com o atual por `Object.is`: mesmo objeto, nada a redesenhar. `new Set(anterior)` cria outro Set com os mesmos ids, e a comparação dá diferente.

---

## :icon[test-tube] As regras do E29 com Set

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
test('devolve um Set novo e não muda o recebido', () => {
  const original = new Set([1]);
  const novo = alternarFavorito(original, 7);
  expect(novo).toEqual(new Set([1, 7]));
  expect(novo).not.toBe(original);
  expect(original.size).toBe(1);
});
```

`toEqual` compara o conteúdo; `not.toBe` garante que é outro objeto, a mesma pergunta que o React faz.

---

## :icon[heart] FavoritosContext

Em `src/contexts/FavoritosContext.js`, a receita do carrinho com um `Set`:

```jsx
const FavoritosContext = createContext(null);

export function FavoritosProvider({ children }) {
  const [favoritos, setFavoritos] = useState(new Set());

  function alternar(id) {
    setFavoritos((anterior) => alternarFavorito(anterior, id));
  }
  function ehFavorito(id) {
    return favoritos.has(id);
  }
  const valor = { favoritos, alternar, ehFavorito };
  return <FavoritosContext.Provider value={valor}>{children}</FavoritosContext.Provider>;
}
```

- Imports: `createContext`, `useContext` e `useState` do React, e `alternarFavorito` da regra
- No fim do arquivo, `useFavoritos()`, igual ao `useCarrinho()`, com o `throw` fora do provedor
- No `app/_layout.js`, o `FavoritosProvider` entra junto dos outros provedores, por fora da `Pilha`

---

## :icon[component] O mesmo cartão, ligado ao contexto

O `CartaoProduto` do E29 não muda: continua recebendo `favorito` e `onFavoritar`. Muda quem entrega esses valores. No `src/telas/Inicio.js`:

```jsx
// saem o useState([]), a função alternar e o import das regras
const { favoritos, alternar, ehFavorito } = useFavoritos();

// na FlatList da grade, como no E29
extraData={favoritos}

// no renderItem, só o ehFavorito perde um argumento
<CartaoProduto
  produto={item}
  onPress={() => router.push('/produto/' + item.id)}
  favorito={ehFavorito(item.id)}
  onFavoritar={() => alternar(item.id)}
/>
```

- A mesma ligação vale nas categorias e na tela de favoritos: um Set só, o mesmo coração em todas
- O `extraData` também compara referências: com o Set mutado, a grade não redesenharia os corações
- No Detalhe, um coração igual ao do cartão vai na linha do nome, com `ehFavorito(produto.id)`

---

## :icon[braces] Set, Map e JSON

`JSON.stringify` não sabe escrever `Set` nem `Map`: os dois viram `{}`, e os favoritos somem sem erro. No E39, quando os favoritos forem salvos no aparelho, converta antes:

```javascript
const favoritos = new Set([7, 1]);
JSON.stringify(favoritos);                    // '{}': os ids sumiram

const texto = JSON.stringify([...favoritos]); // '[7,1]'
const deVolta = new Set(JSON.parse(texto));   // Set de novo: has(7) é true

const qtdPorId = new Map([[7, 2], [1, 1]]);
JSON.stringify([...qtdPorId]);                // '[[7,2],[1,1]]': lista de pares
```

Na ida, espalhe num array. Na volta, entregue o array ao construtor.

---

## :icon[memory-stick] WeakMap: uma visão

Um **WeakMap** é um Map com duas diferenças: as chaves são só objetos, e ele não segura esses objetos na memória. Quando nada mais aponta para um pedido, a entrada dele some junto.

```javascript
const resumos = new WeakMap();

function resumoDoPedido(pedido) {
  if (!resumos.has(pedido)) {
    resumos.set(pedido, calcularResumo(pedido)); // conta feita uma vez por objeto
  }
  return resumos.get(pedido);
}
```

- Combina com imutabilidade: pedido alterado é objeto novo, com entrada nova; o antigo é limpo
- Sem `size` e sem `for...of`: não dá para listar o que tem dentro
- `WeakSet` é a versão para conjuntos. No app você raramente escreve um; bibliotecas usam bastante

---

## :icon[triangle-alert] Erros comuns

:::warning
- `favoritos.add(id)` seguido de `setFavoritos(favoritos)`: o coração não acende
- `ehFavorito(id)` com o `id` da rota, que é texto: converta com `Number(id)`
- Guardar o produto inteiro no Set: outro objeto igual não é encontrado; guarde o id
- `favoritos.map(...)` ou `data={favoritos}`: Set não é array; espalhe com `[...favoritos]`
- `JSON.stringify(favoritos)`: grava `{}`; converta para array antes
- `Object.freeze(favoritos)` para proteger o Set: o `add` continua funcionando, porque os valores não ficam em propriedades
:::

---

## Resumo

:::summary
- `Set` guarda valores únicos e responde `has` direto; `Map` guarda pares e busca com `get`
- Os dois comparam como o `===`: guarde ids, com o tipo certo
- Array para ordem e tela, objeto para registros, `Set` para "está ou não está", `Map` para buscar pela chave
- `Set` e `Map` são iteráveis: `for...of`, spread e `Array.from` funcionam, e o spread os transforma em array
- No estado, `add` e `delete` não avisam o React: crie `new Set(anterior)` e devolva o novo
- No JSON, converta para array na ida e volte com o construtor
:::

---

## :icon[flask-conical] No laboratório

Os favoritos ganham um `Set` num contexto próprio, e o catálogo, um `Map`.

:::steps
1. `src/regras/favoritos.js` com `Set` e `listarFavoritos`; testes do E29 atualizados e novos
2. `FavoritosContext` e o `FavoritosProvider` no `app/_layout.js`
3. Início e categorias ligam o `CartaoProduto` ao contexto; o coração chega ao Detalhe
4. `produtosPorId` em `src/data/produtos.js`; o Detalhe busca com `get`
5. Tela `Favoritos` com `EstadoVazio`, rota `app/favoritos.js` e opção no Perfil
6. `npm test` verde, commit "E36: favoritos com Set e catálogo com Map" e `git push`
:::

**Critérios de entrega**: o coração muda junto em todas as telas; Favoritos vazio mostra o `EstadoVazio`; nenhum `add` ou `delete` no Set do estado; testes passando. Entregue o link do repositório no sistema.
