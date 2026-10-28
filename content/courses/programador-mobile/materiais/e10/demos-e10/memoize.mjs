// E10 · memoize: a função lembra os resultados numa closure
// Rode da pasta demos-e10: node memoize.mjs

function memoize(fn) {
  const cache = {};
  return (...args) => {
    const chave = JSON.stringify(args);
    if (chave in cache) return cache[chave];
    const resultado = fn(...args);
    cache[chave] = resultado;
    return resultado;
  };
}

// o frete simples da aula 19, com um aviso para ver quando ele roda de verdade
function calcularFrete(subtotal, cep) {
  console.log('  calculando', subtotal, cep);
  if (subtotal >= 150) {
    return 0;
  }
  if (cep[0] === '0' || cep[0] === '1') {
    return 9.9;
  }
  return 19.9;
}

const calcularFreteComCache = memoize(calcularFrete);
console.log(calcularFreteComCache(80, '01001000')); // calculando, depois 9.9
console.log(calcularFreteComCache(80, '01001000')); // só 9.9: veio do cache
console.log(calcularFreteComCache(80, '20040020')); // outra chave: calcula de novo

// Erro comum: criar o memoize dentro de uma função que roda muitas vezes
function freteDoResumo(subtotal, cep) {
  const comCache = memoize(calcularFrete); // cache novo, vazio, a cada chamada
  return comCache(subtotal, cep);
}
console.log('--- memoize criado a cada chamada');
freteDoResumo(80, '01001000');
freteDoResumo(80, '01001000'); // calcula de novo
