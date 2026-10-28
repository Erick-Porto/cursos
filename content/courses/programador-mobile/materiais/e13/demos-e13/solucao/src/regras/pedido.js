import { calcularDesconto } from './precos.js';

export function textoDoStatus(status) {
  switch (status) {
    case 'pendente':
      return 'Aguardando pagamento';
    case 'pago':
      return 'Pagamento aprovado';
    case 'enviado':
      return 'A caminho';
    case 'entregue':
      return 'Entregue';
    case 'cancelado':
      return 'Cancelado';
    default:
      return 'Status desconhecido';
  }
}

export function tomDoStatus(status) {
  switch (status) {
    case 'pendente':
      return 'alerta';
    case 'pago':
    case 'entregue':
      return 'sucesso';
    case 'cancelado':
      return 'perigo';
    default:
      return 'neutro'; // enviado e qualquer status desconhecido
  }
}

const CUPONS = {
  BEMVINDO10: { tipo: 'percentual', valor: 10, minimo: 0, ativo: true },
  LOJINHA20: { tipo: 'fixo', valor: 20, minimo: 100, ativo: true },
  NATAL25: { tipo: 'percentual', valor: 25, minimo: 0, ativo: false },
};

function recusar(mensagem) {
  return { valido: false, desconto: 0, mensagem };
}

export function validarCupom(codigo, subtotal) {
  const chave = codigo?.trim().toUpperCase() ?? '';
  if (chave === '') return recusar('Digite o código do cupom');

  const cupom = CUPONS[chave];
  if (!cupom) return recusar('Cupom não encontrado');
  if (!cupom.ativo) return recusar('Este cupom expirou');
  if (subtotal < cupom.minimo) return recusar(`Válido em compras a partir de R$ ${cupom.minimo}`);

  // o percentual usa o calcularDesconto do E05, em centavos: 10% de 199,90 = 19,99
  const desconto =
    cupom.tipo === 'percentual' ? calcularDesconto(subtotal, cupom.valor) : cupom.valor;
  return { valido: true, desconto, mensagem: `Cupom ${chave} aplicado` };
}
