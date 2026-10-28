const porNome = (a, b) => a.nome.localeCompare(b.nome, 'pt-BR');

export const comparadores = {
  nome: porNome,
  preco: (a, b) => a.preco - b.preco || porNome(a, b),
  avaliacao: (a, b) => b.avaliacao - a.avaliacao || porNome(a, b),
};

export const rotulosDeOrdem = {
  nome: 'Nome',
  preco: 'Menor preço',
  avaliacao: 'Melhor avaliação',
};

export function aplicarFiltros(lista, filtros = {}) {
  let base = lista;
  if (filtros.categoria) {
    base = [];
    for (const produto of lista) {
      if (produto.categoria === filtros.categoria) base.push(produto);
    }
  }
  const comparar = comparadores[filtros.ordem] || comparadores.nome;
  return base.slice().sort(comparar);
}
