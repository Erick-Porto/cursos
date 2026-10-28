// E10 · Recursão numa árvore de categorias (só nesta aula: o catálogo da Lojinha não muda)
// Rode da pasta demos-e10: node arvore.mjs

const casa = {
  nome: 'Casa',
  produtos: ['Tapete'],
  subcategorias: [
    { nome: 'Cozinha', produtos: ['Panela', 'Chaleira', 'Faqueiro'], subcategorias: [] },
    {
      nome: 'Iluminação',
      produtos: ['Abajur'],
      subcategorias: [
        { nome: 'Lâmpadas', produtos: ['Lâmpada LED', 'Fita LED'], subcategorias: [] },
      ],
    },
  ],
};

function contarProdutos(categoria) {
  console.log('começa', categoria.nome);
  // caso base: categoria sem subcategorias
  if (categoria.subcategorias.length === 0) {
    console.log('termina', categoria.nome, 'devolve', categoria.produtos.length);
    return categoria.produtos.length;
  }
  // caso recursivo: os próprios mais os de cada subcategoria
  let total = categoria.produtos.length;
  for (const sub of categoria.subcategorias) {
    total += contarProdutos(sub); // versão B do "Pense": troque sub por categoria
  }
  console.log('termina', categoria.nome, 'devolve', total);
  return total;
}

console.log('Total da Casa:', contarProdutos(casa)); // 7

// "Quando não usar recursão": descomente as linhas abaixo e rode de novo
// function subtotalRecursivo(itens, i = 0) {
//   if (i === itens.length) return 0;
//   return itens[i].preco * itens[i].qtd + subtotalRecursivo(itens, i + 1);
// }
// const muitos = Array.from({ length: 200000 }, () => ({ preco: 1, qtd: 1 }));
// console.log(subtotalRecursivo(muitos)); // RangeError: Maximum call stack size exceeded
