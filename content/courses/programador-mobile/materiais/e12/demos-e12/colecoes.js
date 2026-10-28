// E12 · Set e Map, com o código dos slides da aula 23.
// Rode fora do projeto: node colecoes.js
// Cada console.log mostra o resultado esperado no comentário.

// Set: valores sem repetição
const favoritos = new Set([1, 5]);
favoritos.add(7);
favoritos.add(1); // já estava: nada muda
console.log(favoritos.has(5));    // true
console.log(favoritos.delete(5)); // true: removeu
console.log(favoritos.delete(5)); // false: não estava mais
console.log(favoritos.size);      // 2
console.log([...favoritos]);      // [ 1, 7 ]
console.log(new Set([1, 5, 1, 1]).size); // 2

// O Set compara como o ===
const marcados = new Set([7]);
console.log(marcados.has('7'));         // false: texto não é número
console.log(marcados.has(Number('7'))); // true
console.log(new Set([{ id: 7 }]).has({ id: 7 }));  // false: outro objeto
console.log(new Set([{ id: 7 }, { id: 7 }]).size); // 2

// Map: achar pela chave (um pedaço do catálogo)
const produtos = [
  { id: 1, nome: 'Fone Bluetooth', preco: 199.9 },
  { id: 3, nome: 'Microfone USB', preco: 329.9 },
  { id: 7, nome: 'Tênis de Corrida', preco: 349.9 },
];
const produtosPorId = new Map(produtos.map((p) => [p.id, p]));
console.log(produtosPorId.get(7).nome); // Tênis de Corrida
console.log(produtosPorId.get('7'));    // undefined: a chave é o número 7
console.log(produtosPorId.has(99));     // false
console.log(produtosPorId.size);        // 3

// Objeto como dicionário: a chave vira texto, e há chaves herdadas
console.log(Object.keys({ 7: 'x' })); // [ '7' ]
console.log('toString' in {});        // true (o porquê fica para o E17)

// Iteráveis
for (const id of new Set([7, 1])) {
  console.log(id); // 7, depois 1
}
for (const [id, produto] of produtosPorId) {
  console.log(id, produto.nome); // um par [chave, valor] por volta
}
console.log(new Set([7, 1]).map);                     // undefined: Set não é array
console.log([...new Set([7, 1])].map((id) => id * 10)); // [ 70, 10 ]
console.log(Array.from(produtosPorId.values()).length); // 3

// add e delete mudam o Set recebido
function alternarErrado(lista, id) {
  if (lista.has(id)) {
    lista.delete(id);
  } else {
    lista.add(id);
  }
  return lista;
}
const antes = new Set([1]);
const depois = alternarErrado(antes, 7);
console.log(antes.size);       // 2: o antes também ganhou o 7
console.log(depois === antes); // true: é o mesmo Set

// Set, Map e JSON
console.log(JSON.stringify(new Set([7, 1])));             // {}
console.log(JSON.stringify([...new Set([7, 1])]));        // [7,1]
console.log(new Set(JSON.parse('[7,1]')).has(7));         // true
console.log(JSON.stringify([...new Map([[7, 2], [1, 1]])])); // [[7,2],[1,1]]
console.log(structuredClone(new Set([7, 1])));            // Set(2) { 7, 1 }: cópia completa

// Object.freeze não protege um Set
const congelado = Object.freeze(new Set([1]));
congelado.add(2);
console.log(congelado.size); // 2
