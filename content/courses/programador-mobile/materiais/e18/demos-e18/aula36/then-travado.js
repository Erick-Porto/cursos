// Aula 36, roteiro: um then com laço pesado também trava
const inicio = Date.now();
setTimeout(() => console.log(`Timer de 0 ms rodou em ${Date.now() - inicio} ms`), 0);
Promise.resolve().then(() => {
  const fim = Date.now() + 1000;
  while (Date.now() < fim) {} // 1 s dentro do then
});
