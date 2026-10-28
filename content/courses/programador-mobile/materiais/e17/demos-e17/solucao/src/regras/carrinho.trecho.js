// src/regras/carrinho.js: só o que muda no E17.
// O resto do arquivo (subtotal, adicionarItem, removerItem...) continua como você escreveu.
import { EstoqueInsuficienteError } from '../modelos/erros.js'; // no topo, junto dos outros imports

// A linha do carrinho passa a guardar o estoque do produto (sem ele, a guarda nunca dispara).
function criarItem(produto, qtd) {
  const { id, nome, preco, estoque } = produto;
  return { id, nome, preco, estoque, qtd };
}

export function alterarQuantidade(itens, id, qtd) {
  const item = itens.find((i) => i.id === id);
  if (item && qtd > item.estoque) {
    throw new EstoqueInsuficienteError(item.nome, item.estoque);
  }
  if (qtd <= 0) return removerItem(itens, id);
  return itens.map((i) => (i.id === id ? { ...i, qtd } : i));
}
