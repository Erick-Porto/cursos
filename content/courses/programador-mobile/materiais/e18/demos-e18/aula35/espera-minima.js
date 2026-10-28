// Aula 35, slide "setTimeout: espera mínima, não exata"
const inicio = Date.now();
setTimeout(() => {
  console.log(`O lembrete apareceu depois de ${Date.now() - inicio} ms`);
}, 100);
const fim = Date.now() + 1000;
while (Date.now() < fim) {} // 1 segundo de trabalho síncrono
