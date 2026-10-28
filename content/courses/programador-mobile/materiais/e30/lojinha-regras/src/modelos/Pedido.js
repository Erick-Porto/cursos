import { contarItens, subtotal as somarItens } from '../regras/carrinho.js';
import { paraCentavos, paraReais } from '../regras/precos.js';
import { formatarPreco } from '../utils/formatar.js';

const STATUS = ['pendente', 'pago', 'enviado', 'entregue', 'cancelado'];

export default class Pedido {
  #status;

  constructor({ id, itens = [], status = 'pendente', entrega = null, desconto = 0, pagamento = null } = {}) {
    this.id = id;
    this.itens = itens; // [{ ...produto, qtd }]
    this.status = status; // passa pelo setter
    this.entrega = entrega; // { cep, frete } ou null
    this.desconto = desconto;
    this.pagamento = pagamento; // qualquer filha de Pagamento, ou null
  }

  get status() {
    return this.#status;
  }

  set status(valor) {
    if (!STATUS.includes(valor)) {
      throw new Error(`Status inválido: ${valor}`);
    }
    this.#status = valor;
  }

  get quantidade() {
    return contarItens(this.itens);
  }

  get subtotal() {
    return somarItens(this.itens);
  }

  get frete() {
    return this.entrega?.frete ?? 0;
  }

  get valorDaCompra() {
    // o total do E15, com outro nome: em centavos e nunca negativo
    const centavos = paraCentavos(this.subtotal) + paraCentavos(this.frete) - paraCentavos(this.desconto);
    return paraReais(Math.max(centavos, 0));
  }

  get total() {
    if (!this.pagamento) return this.valorDaCompra;
    return this.pagamento.totalAPagar(this.valorDaCompra);
  }

  paraJSON() {
    const { id, itens, status, entrega, desconto } = this;
    return { id, itens, status, entrega, desconto }; // só dados: o pagamento vai à parte
  }

  comStatus(novo) {
    return new Pedido({ ...this.paraJSON(), pagamento: this.pagamento, status: novo });
  }

  comPagamento(pagamento) {
    return new Pedido({ ...this.paraJSON(), pagamento });
  }

  toString() {
    return `Pedido ${this.id}, ${this.status}, ${formatarPreco(this.total)}`;
  }
}
