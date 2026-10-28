import Pedido from '../modelos/Pedido.js';
import {
  CepInvalidoError,
  CupomInvalidoError,
  ErroDeNegocio,
  EstoqueInsuficienteError,
} from '../modelos/erros.js';
import { subtotal } from './carrinho.js';
import { calcularFrete } from './frete.js';
import { validarCupom } from './pedido.js';

// E17
export function freteDoCep(valor, cep) {
  const frete = calcularFrete(valor, cep);
  if (frete === null) {
    throw new CepInvalidoError(cep);
  }
  return frete;
}

export function conferirEstoque(itens) {
  for (const item of itens) {
    if (item.qtd > item.estoque) {
      throw new EstoqueInsuficienteError(item.nome, item.estoque);
    }
  }
}

export function descontoDoCupom(cupom, valor) {
  if (!cupom) return 0; // cupom é opcional
  const resultado = validarCupom(cupom, valor); // E13
  if (!resultado.valido) throw new CupomInvalidoError(cupom, resultado.mensagem);
  return resultado.desconto;
}

export function fecharPedido({ itens, cep, cupom, pagamento }) {
  if (itens.length === 0) {
    throw new ErroDeNegocio('Seu carrinho está vazio.', 'CARRINHO_VAZIO');
  }
  conferirEstoque(itens);
  const valor = subtotal(itens); // E07
  const desconto = descontoDoCupom(cupom, valor);
  const frete = freteDoCep(valor, cep); // sobre os produtos
  return new Pedido({ itens, entrega: { cep, frete }, desconto, pagamento });
}
