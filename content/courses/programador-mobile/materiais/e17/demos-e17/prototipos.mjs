// demos-e17/prototipos.mjs: o Bloco 1 (aula 33) com as classes da própria turma.
// Copie para a raiz do lojinha-regras e rode: node prototipos.mjs
// Peça a previsão da turma antes de mostrar cada bloco.
import Produto from './src/modelos/Produto.js';
import { Pagamento, PagamentoBoleto, PagamentoCartao, PagamentoPix } from './src/modelos/Pagamento.js';
import { produtos } from './src/data/produtos.js';

const fone = Produto.deJSON(produtos[0]);
const caixa = Produto.deJSON(produtos[1]);

console.log('1. O que o fone guarda');
console.log(Object.keys(fone));
console.log(fone.precoPara(2), fone.precoFormatado, `${fone}`);

console.log('\n2. O elo de um objeto literal');
const item = { nome: 'Fone Bluetooth', qtd: 1 };
console.log(Object.getPrototypeOf(item) === Object.prototype); // true
console.log(Object.hasOwn(item, 'nome'), Object.hasOwn(item, 'toString')); // true false
console.log(item.toString()); // [object Object]

console.log('\n3. A cadeia de um array');
const itens = [{ id: 1, qtd: 1 }];
console.log(Object.hasOwn(itens, 'map')); // false
console.log(Object.getPrototypeOf(itens) === Array.prototype); // true
console.log(Object.getPrototypeOf(Array.prototype) === Object.prototype); // true
console.log(Object.getPrototypeOf(Object.prototype)); // null
console.log(itens.desconto, [1].map === [2].map); // undefined true

console.log('\n4. O que a class cria');
console.log(typeof Produto); // function
console.log(Object.hasOwn(Produto.prototype, 'precoPara')); // true
console.log(Object.hasOwn(Produto.prototype, 'precoFormatado')); // true
console.log(Object.getPrototypeOf(fone) === Produto.prototype); // true
console.log(fone.deJSON, Object.hasOwn(Produto, 'deJSON')); // undefined true

console.log('\n5. Um método para todas as instâncias');
console.log(fone.precoPara === caixa.precoPara); // true
console.log(fone.precoPara(2), caixa.precoPara(2)); // 399.8 499.8

console.log('\n6. Antes do class');
function ProdutoAntigo(id, nome, preco) {
  this.id = id;
  this.nome = nome;
  this.preco = preco;
}
ProdutoAntigo.prototype.precoPara = function (qtd) {
  return (Math.round(this.preco * 100) * qtd) / 100;
};
const antigo = new ProdutoAntigo(1, 'Fone Bluetooth', 199.9);
console.log(antigo.precoPara(2), Object.keys(antigo)); // 399.8 [ 'id', 'nome', 'preco' ]
try {
  ProdutoAntigo(1, 'Fone Bluetooth', 199.9); // sem new: o this fica undefined
} catch (erro) {
  console.log(erro.message); // Cannot set properties of undefined (setting 'id')
}

console.log('\n7. extends liga dois protótipos');
const pix = new PagamentoPix();
const boleto = new PagamentoBoleto();
console.log(Object.getPrototypeOf(PagamentoPix.prototype) === Pagamento.prototype); // true
console.log(pix.totalAPagar === Pagamento.prototype.totalAPagar); // false: o do Pix vem antes
console.log(boleto.totalAPagar === Pagamento.prototype.totalAPagar); // true: subiu até a mãe

console.log('\n8. instanceof');
console.log(pix instanceof PagamentoPix, pix instanceof Pagamento, pix instanceof Object); // true true true
console.log(pix instanceof PagamentoCartao, { ...pix } instanceof Pagamento); // false false

console.log('\n9. Cópias e JSON');
const copia = { ...fone };
console.log(copia.nome, copia.precoFormatado, copia instanceof Produto); // Fone Bluetooth undefined false
const deVolta = Produto.deJSON(JSON.parse(JSON.stringify(fone)));
console.log(deVolta.precoFormatado); // R$ 199,90

// 10. Só para ver e desfazer: tire os comentários, rode, e comente de novo.
// Mudar o protótipo muda TODOS os produtos de uma vez.
// Produto.prototype.precoPara = () => 0;
// console.log(fone.precoPara(2), caixa.precoPara(2)); // 0 0
