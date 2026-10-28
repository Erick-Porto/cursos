// Aula 36, slide "Promise.race": a perdedora não é cancelada
const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function comTempoLimite(promessa, ms) {
  let id;
  const limite = new Promise((resolve, reject) => {
    id = setTimeout(() => reject(new Error(`A operação passou de ${ms / 1000} s.`)), ms);
  });
  return Promise.race([promessa, limite]).finally(() => clearTimeout(id));
}

const inicio = Date.now();
const cobranca = esperar(6000).then(() => {
  console.log(`${Date.now() - inicio} ms: a cobrança terminou, mesmo tendo perdido`);
  return 'pago';
});

comTempoLimite(cobranca, 5000)
  .then((resultado) => console.log('Resultado:', resultado))
  .catch((erro) => console.log(`${Date.now() - inicio} ms: ${erro.message}`));
