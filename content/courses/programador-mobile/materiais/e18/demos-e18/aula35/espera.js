// Aula 35, slide "Assíncrono: pedir agora, receber depois"
console.log('1. Ana finalizou a compra');
setTimeout(() => {
  console.log('3. Pedido da Ana confirmado');
}, 2000);
console.log('2. Bia consultou o frete'); // na hora
