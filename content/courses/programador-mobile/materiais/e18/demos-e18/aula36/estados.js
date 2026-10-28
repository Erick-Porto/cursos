// Aula 36, slides "Promise" e "Criando uma Promise"
function consultarFrete(cep) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!/^\d{5}-?\d{3}$/.test(cep)) reject(new Error('CEP inválido'));
      else resolve(19.9);
    }, 800);
  });
}

const p = consultarFrete('01310-100');
console.log(p); // Promise { <pending> }: a Promise chega na hora
setTimeout(() => console.log(p), 1000); // Promise { 19.9 }: o valor, depois
