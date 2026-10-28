// Demonstração do Bloco 1: o relógio para enquanto o laço ocupa a thread.
// Rode com: node relogio-trava.js
let tique = 0;
const relogio = setInterval(() => {
  tique = tique + 1;
  console.log(`tique ${tique}`);
}, 500);

setTimeout(() => {
  console.log('--- trabalho pesado: 3 s num laço ---');
  const fim = Date.now() + 3000;
  while (Date.now() < fim) {} // a thread não fica livre
  console.log('--- laço terminou ---');
}, 1600);

setTimeout(() => clearInterval(relogio), 7000);
