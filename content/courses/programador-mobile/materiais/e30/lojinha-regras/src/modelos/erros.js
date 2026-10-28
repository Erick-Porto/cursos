export class ErroDeNegocio extends Error {
  constructor(mensagem, codigo) {
    super(mensagem);
    this.name = 'ErroDeNegocio';
    this.codigo = codigo;
  }
}

export class CepInvalidoError extends ErroDeNegocio {
  constructor(cep) {
    super(`Confira o CEP ${cep}: ele precisa ter 8 números.`, 'CEP_INVALIDO');
    this.name = 'CepInvalidoError';
    this.cep = cep;
  }
}

export class CupomInvalidoError extends ErroDeNegocio {
  constructor(cupom, motivo = 'Este cupom não vale para este pedido') {
    super(motivo, 'CUPOM_INVALIDO');
    this.name = 'CupomInvalidoError';
    this.cupom = cupom;
  }
}

export class EstoqueInsuficienteError extends ErroDeNegocio {
  constructor(nome, disponivel) {
    super(`${nome}: só ${disponivel} em estoque.`, 'ESTOQUE_INSUFICIENTE');
    this.name = 'EstoqueInsuficienteError';
    this.disponivel = disponivel;
  }
}

// E18
export class FalhaNoCheckoutError extends ErroDeNegocio {
  constructor(etapa, mensagem) {
    super(mensagem, 'FALHA_' + etapa.toUpperCase());
    this.name = 'FalhaNoCheckoutError';
    this.etapa = etapa;
  }
}

export class TempoEsgotadoError extends ErroDeNegocio {
  constructor(ms) {
    super(`A operação passou de ${ms / 1000} s. Tente de novo.`, 'TEMPO_ESGOTADO');
    this.name = 'TempoEsgotadoError';
    this.ms = ms;
  }
}

