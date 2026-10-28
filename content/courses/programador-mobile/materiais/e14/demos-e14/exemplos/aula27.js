// E14, aula 27: demonstrações para editar ao vivo.
// Coloque esta pasta exemplos/ na raiz do lojinha-regras e rode: node exemplos/aula27.js
import { produtos } from '../src/data/produtos.js';
import { paraCentavos, paraReais } from '../src/regras/precos.js';
import { ehDiaUtil } from '../src/utils/datas.js';

const comoData = { weekday: 'long', day: '2-digit', month: '2-digit' };

// for e while: o mesmo laço, arrumado de outro jeito
for (let i = 0; i < 3; i++) {
  console.log('for:', produtos[i].nome);
}
let i = 0;
while (i < 3) {
  console.log('while:', produtos[i].nome);
  i++; // ao vivo: apague esta linha, rode e encerre com Ctrl + C
}

// do...while: o pedido nunca é despachado no mesmo dia
function proximoDiaUtil(hoje) {
  const data = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  do {
    data.setDate(data.getDate() + 1);
  } while (!ehDiaUtil(data));
  return data;
}
// ao vivo: troque o do...while por while (slide "Pense") e rode de novo
console.log('Pedido na sexta, 10/10:', proximoDiaUtil(new Date(2025, 9, 10)).toLocaleDateString('pt-BR', comoData));
console.log('Pedido no sábado, 11/10:', proximoDiaUtil(new Date(2025, 9, 11)).toLocaleDateString('pt-BR', comoData));

// Uma passada, três respostas
function resumirCatalogo(lista) {
  let emDestaque = 0; // contador
  let centavos = 0; // soma
  let maisBarato = null; // o melhor até agora
  for (const produto of lista) {
    if (produto.destaque) emDestaque++;
    centavos += paraCentavos(produto.preco);
    if (maisBarato === null || produto.preco < maisBarato.preco) {
      maisBarato = produto;
    }
  }
  return { emDestaque, total: paraReais(centavos), maisBarato };
}
const resumo = resumirCatalogo(produtos);
console.log('Em destaque:', resumo.emDestaque, '| Total:', resumo.total, '| Mais barato:', resumo.maisBarato?.nome);
console.log('Catálogo vazio:', resumirCatalogo([]));

let emReais = 0;
for (const produto of produtos) emReais += produto.preco;
console.log('A mesma soma em reais:', emReais); // 2183.8000000000006

// break e continue: o vale-presente
function escolherPeloVale(desejos, valor) {
  const maximo = paraCentavos(valor);
  const escolhidos = [];
  let centavos = 0;
  for (const produto of desejos) {
    const preco = paraCentavos(produto.preco);
    if (centavos + preco > maximo) break; // ao vivo: troque break por continue
    centavos += preco;
    escolhidos.push(produto);
  }
  return escolhidos;
}
const desejos = [produtos[0], produtos[4], produtos[6], produtos[10]]; // fone, garrafa, tênis, receitas
console.log('Vale de R$ 350:', escolherPeloVale(desejos, 350).map((p) => p.nome));
