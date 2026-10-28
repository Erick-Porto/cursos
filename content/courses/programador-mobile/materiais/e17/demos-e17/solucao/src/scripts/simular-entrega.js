// node src/scripts/simular-entrega.js 01310000
import { produtos } from '../data/produtos.js';
import { ErroDeNegocio, EstoqueInsuficienteError } from '../modelos/erros.js';
import { adicionarItem, alterarQuantidade, subtotal } from '../regras/carrinho.js';
import { freteDoCep } from '../regras/checkout.js';
import { formatarPreco } from '../utils/formatar.js';

function rotulo(erro) {
  switch (erro.codigo) {
    case 'CEP_INVALIDO': return 'Entrega';
    case 'CUPOM_INVALIDO': return 'Cupom';
    case 'ESTOQUE_INSUFICIENTE': return 'Carrinho';
    default: return 'Aviso';
  }
}

function aumentar(itens, id) {
  const item = itens.find((i) => i.id === id);
  try {
    return alterarQuantidade(itens, id, item.qtd + 1);
  } catch (erro) {
    if (!(erro instanceof EstoqueInsuficienteError)) throw erro;
    console.log(`${rotulo(erro)}: ${erro.message}`);
    return itens; // a quantidade fica como estava
  }
}

function resumoDaEntrega(itens, cep) {
  const valor = subtotal(itens);
  const frete = freteDoCep(valor, cep); // sem try: se lançar, o erro sobe
  return `Produtos ${formatarPreco(valor)} + frete ${formatarPreco(frete)}`;
}

function simularEntrega(itens, cep) {
  console.time('simulação');
  try {
    const resumo = resumoDaEntrega(itens, cep);
    console.log(resumo);
  } catch (erro) {
    if (!(erro instanceof ErroDeNegocio)) throw erro; // bug: não esconda
    console.log(`${rotulo(erro)}: ${erro.message}`);
  } finally {
    console.timeEnd('simulação');
  }
}

const cep = process.argv[2] ?? '01310000'; // sem argumento, um CEP de São Paulo
const luminaria = produtos.find((p) => p.id === 4); // estoque: 2

let itens = adicionarItem([], luminaria); // 1 luminária: R$ 89,90
simularEntrega(itens, cep);               // frete pela região do CEP

itens = aumentar(itens, luminaria.id);    // 2: cabe no estoque
itens = aumentar(itens, luminaria.id);    // 3: passa do estoque e avisa
simularEntrega(itens, cep);               // R$ 179,80: frete grátis
