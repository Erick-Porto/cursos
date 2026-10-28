// Aula 35, slide "Erro primeiro: a convenção dos callbacks"
function consultarFrete(cep, callback) {
  setTimeout(() => {
    if (!/^\d{5}-?\d{3}$/.test(cep)) return callback(new Error('CEP inválido'));
    callback(null, 19.9);
  }, 800);
}

consultarFrete('01310-100', (erro, valor) => {
  if (erro) return console.log('Erro:', erro.message);
  console.log('Frete:', valor);
});

consultarFrete('123', (erro, valor) => {
  if (erro) return console.log('Erro:', erro.message);
  console.log('Frete:', valor);
});
