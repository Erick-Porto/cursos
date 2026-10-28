// E10 · O script que faz tudo: copie para src/scripts/resumo-do-carrinho.js no lojinha-regras
// Rode da raiz do projeto: node src/scripts/resumo-do-carrinho.js

const itens = [
  { id: 5, nome: 'Garrafa Térmica', preco: 79.9, qtd: 1 },
  { id: 11, nome: 'Livro de Receitas', preco: 59.9, qtd: 1 },
];
let centavos = 0;
for (const item of itens) {
  centavos = centavos + Math.round(item.preco * 100) * item.qtd;
}
let frete = 9.9; // a regra do frete, copiada à mão
if (centavos >= 15000) {
  frete = 0;
}
console.log(`Itens: R$ ${(centavos / 100).toFixed(2)}`);
console.log(`Frete: R$ ${frete.toFixed(2)}`);
console.log(`Total: R$ ${(centavos / 100 + frete).toFixed(2)}`);
