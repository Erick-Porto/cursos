import { produtos } from '../data/produtos.js';

console.log(`Antes do sort: ${produtos[0].nome}`);

const porPreco = produtos.sort((a, b) => a.preco - b.preco);
console.log(`Mais barato: ${porPreco[0].nome}`);

console.log(`Depois do sort: ${produtos[0].nome}`);
console.log(`Mesmo array? ${porPreco === produtos}`);
