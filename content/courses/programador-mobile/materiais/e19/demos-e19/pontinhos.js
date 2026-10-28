// node pontinhos.js 01310-100   (CEP válido)
// node pontinhos.js 123         (CEP inválido)
// Slide "try e catch com await". Para ver o bug, apague o finally e ponha o
// clearInterval logo depois do await: com o CEP 123, os pontinhos não param (Ctrl+C).
import { consultarFrete } from './consultas.js';
import { formatarPreco } from './formatar.js';

async function mostrarFrete(cep) {
  const pontos = setInterval(() => process.stdout.write('.'), 200); // escreve sem pular linha
  try {
    const valor = await consultarFrete(cep);
    console.log('\nFrete: ' + formatarPreco(valor));
  } catch (erro) {
    console.log('\n' + erro.message); // 'CEP inválido'
  } finally {
    clearInterval(pontos); // roda com sucesso ou com falha
  }
}

await mostrarFrete(process.argv[2] ?? '01310-100');
