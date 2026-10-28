import { resumoDoCarrinho } from '../regras/carrinho.js';
import { textoDoFrete } from '../regras/frete.js';
import { formatarPreco } from '../utils/formatar.js';

const itens = [
  { id: 5, nome: 'Garrafa Térmica', preco: 79.9, qtd: 1 },
  { id: 11, nome: 'Livro de Receitas', preco: 59.9, qtd: 1 },
];
const [cep, codigo] = process.argv.slice(2); // os dois podem faltar
const resumo = resumoDoCarrinho(itens, cep, codigo);

console.log(`Itens (${resumo.quantidade}): ${formatarPreco(resumo.valorItens)}`);
if (resumo.cupom !== null) console.log(resumo.cupom.mensagem);
if (resumo.desconto > 0) console.log(`Desconto: - ${formatarPreco(resumo.desconto)}`);
console.log(`Frete: ${textoDoFrete(resumo.frete)}`);
console.log(`Total: ${formatarPreco(resumo.total)}`);
