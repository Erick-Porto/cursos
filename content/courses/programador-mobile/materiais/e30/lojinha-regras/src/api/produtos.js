import { pedir } from './cliente.js';

export function traduzirProduto(p) {
  return {
    id: p.id,
    nome: p.title,
    preco: p.price, // em dólar: a API é de testes
    categoria: p.category,
    imagem: p.thumbnail,
    avaliacao: p.rating,
    descricao: p.description,
    destaque: p.rating >= 4.5, // a DummyJSON não tem destaque: a regra é sua
  };
}

export async function listarProdutos({ limite = 20, pular = 0, sinal } = {}) {
  const dados = await pedir(`/products?limit=${limite}&skip=${pular}`, { signal: sinal });
  return dados.products.map(traduzirProduto);
}

export async function buscarProduto(id) {
  return traduzirProduto(await pedir('/products/' + id));
}

export async function pesquisar(termo, sinal) {
  const caminho = '/products/search?q=' + encodeURIComponent(termo.trim());
  const dados = await pedir(caminho, { signal: sinal });
  return dados.products.map(traduzirProduto);
}

export async function listarCategorias() {
  const dados = await pedir('/products/categories'); // [{ slug, name, url }]
  return dados.map((c) => ({ slug: c.slug, nome: c.name }));
}
