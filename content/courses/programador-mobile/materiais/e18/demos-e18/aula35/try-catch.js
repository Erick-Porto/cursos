// Aula 35, slide "Erro primeiro": o try não pega o erro do callback
try {
  setTimeout(() => {
    throw new Error('CEP inválido');
  }, 800);
} catch (erro) {
  console.log('Capturado:', erro.message); // nunca roda
}
console.log('O try já terminou');
