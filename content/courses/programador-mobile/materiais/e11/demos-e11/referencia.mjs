// E11 · valor e referência. Rode: node referencia.mjs (peça a previsão antes de cada console.log)
let frete = 15;
let freteComCupom = frete;
freteComCupom = 0;
console.log(frete); // 15: o número foi copiado

const item = { nome: 'Fone Bluetooth', qtd: 1 };
const noPedido = item;
noPedido.qtd = 3;
console.log(item.qtd); // 3: as duas variáveis apontam o mesmo objeto

const a = { id: 7 };
const b = { id: 7 };
const c = a;
console.log(a === b, a === c); // false true

const itens = [{ id: 7, qtd: 1 }];
console.log(itens.includes({ id: 7, qtd: 1 })); // false: procura este endereço
console.log(itens.some((i) => i.id === 7)); // true: compara pelo id

function aplicarCupom(pedido) {
  pedido.desconto = 20; // escreve no objeto de quem chamou
  return pedido;
}
const pedido = { subtotal: 200, desconto: 0 };
const comCupom = aplicarCupom(pedido);
console.log(pedido.desconto, comCupom === pedido); // 20 true
