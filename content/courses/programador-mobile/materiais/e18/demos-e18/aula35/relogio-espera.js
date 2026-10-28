// Demonstração do Bloco 1: a mesma espera de 3 s, agora com setTimeout.
// Rode com: node relogio-espera.js
let tique = 0;
const relogio = setInterval(() => {
  tique = tique + 1;
  console.log(`tique ${tique}`);
}, 500);

setTimeout(() => {
  console.log('--- pedido enviado: resposta em 3 s ---');
  setTimeout(() => console.log('--- resposta chegou ---'), 3000); // a thread fica livre
}, 1600);

setTimeout(() => clearInterval(relogio), 7000);
