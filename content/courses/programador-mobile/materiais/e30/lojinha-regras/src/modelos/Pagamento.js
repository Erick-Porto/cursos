import { PERCENTUAL_PIX, paraCentavos, paraReais, parcelar, precoComPix } from '../regras/precos.js';
import { preverEntrega } from '../utils/datas.js';

const TAXA_MENSAL = 0.0199; // 1,99% ao mês, juros compostos
const LIMITE_SEM_JUROS = 6;
const MAXIMO_DE_PARCELAS = 12;
const DIAS_PARA_PAGAR = 3; // dias úteis até o vencimento do boleto

export class Pagamento {
  #tipo;
  #nome;

  constructor(tipo, nome) {
    this.#tipo = tipo; // 'pix', 'cartao' ou 'boleto': identifica a forma
    this.#nome = nome; // o que o cliente lê
  }

  get tipo() {
    return this.#tipo;
  }

  get nome() {
    return this.#nome;
  }

  get descricao() {
    return this.#nome;
  }

  totalAPagar(valor) {
    return valor; // sem desconto nem juros
  }
}

export class PagamentoPix extends Pagamento {
  constructor() {
    super('pix', 'Pix');
  }

  get descricao() {
    return `${super.descricao} com ${PERCENTUAL_PIX}% de desconto`;
  }

  totalAPagar(valor) {
    return precoComPix(valor); // a regra do E05, já testada
  }
}

export class PagamentoCartao extends Pagamento {
  #parcelas;

  constructor(parcelas = 1) {
    super('cartao', 'Cartão');
    if (!Number.isInteger(parcelas) || parcelas < 1 || parcelas > MAXIMO_DE_PARCELAS) {
      throw new Error(`Parcelas devem ser de 1 a ${MAXIMO_DE_PARCELAS}`);
    }
    this.#parcelas = parcelas;
  }

  get parcelas() {
    return this.#parcelas;
  }

  get temJuros() {
    return this.#parcelas > LIMITE_SEM_JUROS;
  }

  get descricao() {
    const juros = this.temJuros ? 'com juros' : 'sem juros';
    return `${super.descricao} em ${this.#parcelas}x ${juros}`;
  }

  totalAPagar(valor) {
    if (!this.temJuros) return super.totalAPagar(valor);
    const comJuros = paraCentavos(valor) * (1 + TAXA_MENSAL) ** this.#parcelas;
    return paraReais(Math.round(comJuros));
  }

  valorDaParcela(valor) {
    return parcelar(this.totalAPagar(valor), this.#parcelas).valor;
  }
}

export class PagamentoBoleto extends Pagamento {
  constructor() {
    super('boleto', 'Boleto');
  }

  vencimento(hoje = new Date()) {
    return preverEntrega(DIAS_PARA_PAGAR, hoje); // o laço de dias úteis do E06
  }
}
