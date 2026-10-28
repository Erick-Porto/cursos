// Aula 36: as mesmas três consultas, uma depois da outra
const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const consultarFrete = () => esperar(800).then(() => 19.9);
const consultarPrazo = () => esperar(600).then(() => 3);
const consultarCupom = () => esperar(400).then(() => 10);

const inicio = Date.now();
consultarFrete('01310-100')
  .then(() => consultarPrazo('01310-100'))
  .then(() => consultarCupom('BEMVINDO'))
  .then(() => console.log(`${Date.now() - inicio} ms`)); // cerca de 1800
