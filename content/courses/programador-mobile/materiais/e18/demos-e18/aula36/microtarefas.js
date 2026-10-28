// Aula 36, slide "then nunca roda na hora"
console.log('1. Cliente escolheu Pix');
setTimeout(() => console.log('4. Timer de 0 ms'), 0);
Promise.resolve('Pix gerado').then((msg) => console.log('3. ' + msg));
console.log('2. Fim do código atual');
