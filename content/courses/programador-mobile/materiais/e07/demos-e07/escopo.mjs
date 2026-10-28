// E07 · aula 14: escopo de bloco e escopo de função.
// Uso: node escopo.mjs

const FRETE_GRATIS_A_PARTIR_DE = 150;

// 1. Versão com erro: aviso só existe dentro de cada bloco do if.
//    Rode, leia o ReferenceError e corrija: let aviso; antes do if, e só a atribuição dentro dos blocos.
function avisoDoFrete(subtotal) {
  if (subtotal >= FRETE_GRATIS_A_PARTIR_DE) {
    const aviso = 'Você ganhou frete grátis';
  } else {
    const aviso = 'Ainda falta para o frete grátis';
  }
  return aviso;
}
console.log(avisoDoFrete(199.9));

// 2. Depois da correção: rode e veja 1 e 1.
//    Mova o let total = 0; para fora da função, logo abaixo de NOTA_MINIMA, e rode: 1 e 2.
const NOTA_MINIMA = 4.5;

function contarBemAvaliados(produtos) {
  let total = 0;
  for (const p of produtos) {
    if (p.avaliacao >= NOTA_MINIMA) total++;
  }
  return total;
}

const lista = [{ avaliacao: 4.8 }, { avaliacao: 3.9 }];
console.log(contarBemAvaliados(lista));
console.log(contarBemAvaliados(lista));
