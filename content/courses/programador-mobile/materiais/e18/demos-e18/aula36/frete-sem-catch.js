// Aula 36: sem catch, a rejeição não tratada derruba o script
function consultarFrete(cep) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!/^\d{5}-?\d{3}$/.test(cep)) reject(new Error('CEP inválido'));
      else resolve(19.9);
    }, 800);
  });
}

consultarFrete('123').then((valor) => console.log('Frete:', valor));
