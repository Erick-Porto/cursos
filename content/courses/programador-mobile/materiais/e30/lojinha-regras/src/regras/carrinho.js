import { EstoqueInsuficienteError } from '../modelos/erros.js';
import { paraCentavos, paraReais } from './precos.js';

// Regras puras do carrinho: recebem dados e devolvem dados, sem imprimir nada.

export function subtotal(itens) {
  const centavos = itens.reduce(
    (soma, item) => soma + paraCentavos(item.preco) * item.qtd,
    0,
  );
  return paraReais(centavos);
}

export function contarItens(itens) {
  return itens.reduce((total, item) => total + item.qtd, 0);
}

// Uma linha do carrinho: só o que o carrinho precisa do produto, mais a quantidade.
// O estoque entra no E17, para a guarda de alterarQuantidade funcionar.
function criarItem(produto, qtd) {
  const { id, nome, preco, estoque } = produto;
  return { id, nome, preco, estoque, qtd };
}

export function adicionarItem(itens, produto) {
  const existente = itens.find((item) => item.id === produto.id);
  if (existente !== undefined) {
    return alterarQuantidade(itens, produto.id, existente.qtd + 1);
  }
  return [...itens, criarItem(produto, 1)];
}

export function removerItem(itens, id) {
  return itens.filter((item) => item.id !== id);
}

export function alterarQuantidade(itens, id, qtd) {
  const item = itens.find((i) => i.id === id);
  if (item && qtd > item.estoque) {
    throw new EstoqueInsuficienteError(item.nome, item.estoque); // E17
  }
  if (qtd <= 0) return removerItem(itens, id);
  return itens.map((i) => (i.id === id ? { ...i, qtd } : i));
}
