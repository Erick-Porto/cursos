// node lacos.js
// Slide "await dentro de laços": for...of em fila, Promise.all em paralelo e o forEach que não espera.
import { esperar } from './consultas.js';

const itens = [{ id: 1, qtd: 1 }, { id: 2, qtd: 2 }, { id: 3, qtd: 1 }];

async function consultarEstoque(id, qtd) {
  await esperar(300);
  console.log(`  item ${id} (${qtd}): em estoque`);
}

console.time('for...of');
for (const item of itens) {
  await consultarEstoque(item.id, item.qtd);
}
console.timeEnd('for...of'); // cerca de 900 ms: um depois do outro

console.time('Promise.all');
await Promise.all(itens.map((item) => consultarEstoque(item.id, item.qtd)));
console.timeEnd('Promise.all'); // cerca de 300 ms: todos juntos

console.time('forEach');
itens.forEach(async (item) => {
  await consultarEstoque(item.id, item.qtd);
});
console.timeEnd('forEach'); // quase 0 ms: terminou antes de consultar qualquer item
