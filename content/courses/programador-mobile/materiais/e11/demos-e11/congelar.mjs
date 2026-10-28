// E11 · Object.freeze e congelarTudo. Rode: node congelar.mjs
const promocao = Object.freeze({ nome: 'Semana do Áudio', percentual: 10 });
try {
  promocao.percentual = 50;
} catch (erro) {
  console.log(erro.message); // Cannot assign to read only property 'percentual' of object '#<Object>'
}

const FORMAS_DE_PAGAMENTO = Object.freeze(['pix', 'cartao', 'boleto']);
try {
  FORMAS_DE_PAGAMENTO.push('cheque');
} catch (erro) {
  console.log(erro.message); // Cannot add property 3, object is not extensible
}

const itens = Object.freeze([{ id: 1, nome: 'Fone Bluetooth', qtd: 1 }]);
itens[0].qtd = 3; // sem erro: o congelamento é raso
console.log(itens[0].qtd); // 3

function congelarTudo(valor) {
  if (typeof valor !== 'object' || valor === null) {
    return valor; // caso base: número, texto, null...
  }
  for (const dentro of Object.values(valor)) {
    congelarTudo(dentro); // congela cada nível de dentro
  }
  return Object.freeze(valor);
}

const pedido = congelarTudo({ id: 101, itens: [{ id: 1, nome: 'Fone Bluetooth', qtd: 1 }] });
try {
  pedido.itens[0].qtd = 3;
} catch (erro) {
  console.log(erro.message); // Cannot assign to read only property 'qtd' of object '#<Object>'
}
