// node tempo.js
// Mede as três consultas em sequência e em paralelo (slides "Em sequência" e "Em paralelo").
import { consultarCupom, consultarFrete, consultarPrazo } from './consultas.js';

const cep = '01310-100';
const codigo = 'BEMVINDO';

console.time('em sequência');
const frete = await consultarFrete(cep);
const prazo = await consultarPrazo(cep);
const desconto = await consultarCupom(codigo);
console.timeEnd('em sequência'); // cerca de 1800 ms

console.time('em paralelo');
const resultados = await Promise.all([consultarFrete(cep), consultarPrazo(cep), consultarCupom(codigo)]);
console.timeEnd('em paralelo'); // cerca de 800 ms

console.log({ frete, prazo, desconto }, resultados);
