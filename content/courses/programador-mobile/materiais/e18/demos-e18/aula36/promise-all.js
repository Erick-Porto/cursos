// Aula 36, slide "Promise.all: tudo ao mesmo tempo"
const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const consultarFrete = () => esperar(800).then(() => 19.9);
const consultarPrazo = () => esperar(600).then(() => 3);
const consultarCupom = () => esperar(400).then(() => 10);

const inicio = Date.now();
Promise.all([consultarFrete('01310-100'), consultarPrazo('01310-100'), consultarCupom('BEMVINDO')])
  .then(([frete, prazo, desconto]) => console.log({ frete, prazo, desconto }))
  .catch((erro) => console.log('Erro:', erro.message))
  .finally(() => console.log(`${Date.now() - inicio} ms`)); // cerca de 800
