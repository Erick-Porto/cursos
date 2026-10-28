// Aula 35, slide "Uma thread para tudo"
function esperarTravando(ms) {
  const fim = Date.now() + ms;
  while (Date.now() < fim) {} // gira sem parar: a thread não fica livre
}

console.log('1. Ana finalizou a compra');
esperarTravando(2000); // "espera" o servidor
console.log('2. Pedido da Ana confirmado');
console.log('3. Bia consultou o frete'); // esperou 2 s sem motivo
