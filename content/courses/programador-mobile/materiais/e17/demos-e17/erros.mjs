// demos-e17/erros.mjs: o começo do Bloco 2 (aula 34), fora do projeto.
// Rode com: node erros.mjs
// Ele PARA no primeiro throw de propósito: é o passo 1 do roteiro.

function calcularFrete(subtotal, cep) {
  const digitos = (cep ?? '').replace(/\D/g, '');
  if (digitos.length !== 8) return null;
  return subtotal >= 150 ? 0 : 9.9; // versão curta do E13
}

function freteDoCep(subtotal, cep) {
  const frete = calcularFrete(subtotal, cep);
  if (frete === null) throw new Error(`CEP inválido: ${cep}`);
  return frete;
}

freteDoCep(100, '0131000');
console.log('depois');

// Passo 4 do roteiro: apague as duas linhas acima e tire os comentários abaixo.
// function testar(cep) {
//   try {
//     console.log('A');
//     freteDoCep(100, cep);
//     console.log('B');
//   } catch (erro) {
//     console.log('C');
//   } finally {
//     console.log('D');
//   }
//   console.log('E');
// }
//
// testar('123');
// console.log('---');
// testar('01310000');
