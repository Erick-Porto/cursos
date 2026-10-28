// Aula 36, slide "Pratique": a corrente que não esperou
const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const validarEstoque = () => esperar(100);
const reservar = () =>
  esperar(300).then(() => {
    console.log('reserva terminou');
    return { codigo: 'RES-1' };
  });
const cobrar = () => {
  console.log('cobrança começou');
  return esperar(100).then(() => ({ codigo: 'PAG-1' }));
};

validarEstoque()
  .then(() => {
    reservar(); // falta o return
  })
  .then((reserva) => {
    console.log('reserva recebida:', reserva);
    return cobrar();
  });
