// E14, aula 28: demonstrações para editar ao vivo.
// Coloque esta pasta exemplos/ na raiz do lojinha-regras e rode: node exemplos/aula28.js
import { categorias, produtos } from '../src/data/produtos.js';

const porCategoria = { audio: 3, casa: 3, esporte: 3, livros: 3 };

// for...of num objeto: descomente para ver o TypeError "porCategoria is not iterable"
// for (const x of porCategoria) console.log(x);

// for...in: as chaves de um objeto
const linhas = [];
for (const slug in porCategoria) {
  linhas.push(slug + ': ' + porCategoria[slug] + ' produtos');
}
console.log(linhas);
console.log('porCategoria.slug:', porCategoria.slug); // undefined: procura a chave "slug"

// os riscos do for...in num array
const nomes = ['Fone Bluetooth', 'Luminária de Mesa'];
for (const i in nomes) {
  console.log('i + 1:', i + 1); // '01' e '11'
}

// Pense: for...in no carrinho
const itens = [
  { nome: 'Fone Bluetooth', preco: 199.9, qtd: 2 },
  { nome: 'Luminária de Mesa', preco: 89.9, qtd: 1 },
];
let total = 0;
for (const item in itens) {
  total += item.preco * item.qtd; // ao vivo: troque in por of
}
console.log('total:', total);

// Laços aninhados: quantas voltas?
let voltas = 0;
const contagem = {};
for (const categoria of categorias) {
  let quantos = 0;
  for (const produto of produtos) {
    voltas++;
    if (produto.categoria === categoria.slug) quantos++;
  }
  contagem[categoria.slug] = quantos;
}
console.log(contagem, 'voltas do laço de dentro:', voltas);

// Uma passada só
let voltasUmaPassada = 0;
const contagem2 = {};
for (const produto of produtos) {
  voltasUmaPassada++;
  contagem2[produto.categoria] = (contagem2[produto.categoria] ?? 0) + 1;
}
console.log(contagem2, 'voltas:', voltasUmaPassada);

// As palavras vazias do split
console.log("'  '.split(' '):", '  '.split(' '));
console.log("'corrida  tenis'.split(' '):", 'corrida  tenis'.split(' '));
