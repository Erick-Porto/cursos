// Aula 36: a versão errada, com o clearInterval só no then.
// node frete-sem-finally.js 123   (Ctrl + C para parar)
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
  .then((valor) => {
    console.log('Frete:', valor);
    clearInterval(aguardando); // só no sucesso: na falha, segue para sempre
  })
  .catch((erro) => console.log('Erro:', erro.message));
