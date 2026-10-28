// Aula 36, slide "then, catch e finally"
// node frete.js 01310-100   e   node frete.js 123
function consultarFrete(cep) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!/^\d{5}-?\d{3}$/.test(cep)) reject(new Error('CEP inválido'));
      else resolve(19.9);
    }, 800);
  });
}

const cep = process.argv[2];
const aguardando = setInterval(() => console.log('aguardando...'), 200);

consultarFrete(cep)
  .then((valor) => console.log('Frete:', valor))
  .catch((erro) => console.log('Erro:', erro.message))
  .finally(() => clearInterval(aguardando)); // para nos dois casos
