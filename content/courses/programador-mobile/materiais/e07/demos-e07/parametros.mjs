// E07 · aula 14: parâmetro padrão e parâmetro rest.
// Uso: node parametros.mjs

function paraCentavos(reais) {
  return Math.round(reais * 100);
}

function paraReais(centavos) {
  return centavos / 100;
}

// Padrão: só o argumento ausente ou undefined usa o 1
function f(p = 1) {
  return p;
}
console.log(f(), f(undefined), f(null), f(0)); // 1 1 null 0

// Rest: percentuais junta numa lista os argumentos que sobram
function aplicarDescontos(preco, ...percentuais) {
  console.log('percentuais:', percentuais);
  let centavos = paraCentavos(preco);
  for (const p of percentuais) {
    centavos = centavos - Math.round((centavos * p) / 100);
  }
  return paraReais(centavos);
}
console.log(aplicarDescontos(200, 10, 5)); // [ 10, 5 ] e 171
console.log(aplicarDescontos(200, 10)); // [ 10 ] e 180
console.log(aplicarDescontos(200)); // [] e 200
