import { FalhaNoCheckoutError, TempoEsgotadoError } from '../modelos/erros.js';

export const CHANCE_DE_FALHA = 0.2; // 1 força a falha; volte para 0.2
const ATRASO = 800;

export function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function gerarCodigo() {
  return String(Date.now()).slice(-6);
}

function simularEtapa(chave, mensagem, valor, opcoes = {}) {
  const { sortear = Math.random, atraso = ATRASO, aoMudarEtapa = () => {} } = opcoes;
  aoMudarEtapa(chave);
  return esperar(atraso).then(() => {
    if (sortear() < CHANCE_DE_FALHA) throw new FalhaNoCheckoutError(chave, mensagem);
    return valor;
  });
}

export function comTempoLimite(promessa, ms) {
  let id;
  const limite = new Promise((resolve, reject) => {
    id = setTimeout(() => reject(new TempoEsgotadoError(ms)), ms);
  });
  return Promise.race([promessa, limite]).finally(() => clearTimeout(id));
}

export function validarEstoque(itens, opcoes) {
  return simularEtapa('estoque', 'Um produto do carrinho acabou de esgotar.', itens, opcoes);
}

export function reservar(itens, opcoes) {
  return simularEtapa('reserva', 'Não conseguimos reservar seus produtos.', { codigo: 'RES-' + gerarCodigo() }, opcoes);
}

export function cobrar(total, pagamento, opcoes) {
  const mensagem = 'O pagamento foi recusado. Confira os dados ou escolha outra forma.';
  return simularEtapa('pagamento', mensagem, { codigo: 'PAG-' + gerarCodigo(), valor: total }, opcoes);
}

export function confirmar(reserva, cobranca, opcoes) {
  const pedido = { numero: gerarCodigo(), status: 'pago', reserva: reserva.codigo, valor: cobranca.valor };
  return simularEtapa('confirmacao', 'Não conseguimos confirmar o pedido.', pedido, opcoes);
}

export async function finalizarCompra(pedido, aoMudarEtapa = () => {}, opcoes = {}) {
  const config = { ...opcoes, aoMudarEtapa };
  await validarEstoque(pedido.itens, config);
  const reserva = await reservar(pedido.itens, config);
  const cobranca = await comTempoLimite(cobrar(pedido.total, pedido.pagamento, config), 5000);
  return confirmar(reserva, cobranca, config);
}
