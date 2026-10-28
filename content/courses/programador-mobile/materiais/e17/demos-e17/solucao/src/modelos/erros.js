export class ErroDeNegocio extends Error {
  constructor(mensagem, codigo) {
    super(mensagem); // o Error guarda a message
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
    super(motivo, 'CUPOM_INVALIDO'); // o motivo vem do validarCupom do E13
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
