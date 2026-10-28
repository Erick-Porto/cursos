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

// E14: busca, item mais caro e paginação (aplicarFiltros e comparadores do E08 continuam no arquivo)

function normalizar(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function contemTodas(texto, palavras) {
  for (const palavra of palavras) {
    if (!texto.includes(palavra)) return false; // uma faltou: nem olha as outras
  }
  return true;
}

export function buscarProdutos(produtos, termo) {
  const palavras = normalizar(termo ?? '').split(' ').filter((p) => p !== '');
  if (palavras.length === 0) return produtos;
  const encontrados = [];
  for (const produto of produtos) {
    if (contemTodas(normalizar(produto.nome), palavras)) {
      encontrados.push(produto);
    }
  }
  return encontrados;
}

export function itemMaisCaro(itens) {
  let maisCaro = null;
  for (const item of itens) {
    if (maisCaro === null || item.preco > maisCaro.preco) {
      maisCaro = item;
    }
  }
  return maisCaro;
}

export function paginar(lista, pagina = 1, tamanho = 6) {
  if (pagina < 1 || tamanho < 1) return [];
  const inicio = (pagina - 1) * tamanho;
  const fim = Math.min(inicio + tamanho, lista.length);
  const pedaco = [];
  for (let i = inicio; i < fim; i++) {
    pedaco.push(lista[i]);
  }
  return pedaco;
}
