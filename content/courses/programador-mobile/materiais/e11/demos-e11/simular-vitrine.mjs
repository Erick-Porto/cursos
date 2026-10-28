// E11 · a simulação que mudou o catálogo. Rode: node simular-vitrine.mjs
import { produtos } from './produtos.mjs';

function destacarCategoria(lista, categoria) {
  for (const produto of lista) {
    if (produto.categoria === categoria) {
      produto.destaque = true;
    }
  }
  return lista;
}

const simulacao = destacarCategoria(produtos, 'audio');
console.log(simulacao.filter((p) => p.destaque).length); // 6
console.log(produtos.filter((p) => p.destaque).length); // 6: o catálogo mudou junto (eram 4)
console.log(simulacao === produtos); // true: nem é outro array

// A versão pura, para trocar ao vivo pela função de cima:
// function destacarCategoria(lista, categoria) {
//   return lista.map((p) => (p.categoria === categoria ? { ...p, destaque: true } : p));
// }
// Com ela, as três linhas mostram 6, 4 e false.
