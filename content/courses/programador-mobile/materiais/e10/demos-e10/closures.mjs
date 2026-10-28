// E10 · Função como valor, alta ordem e closure
// Rode da pasta demos-e10: node closures.mjs

const produtos = [
  { id: 1, nome: 'Fone Bluetooth', preco: 199.9, categoria: 'audio' },
  { id: 4, nome: 'Luminária de Mesa', preco: 89.9, categoria: 'casa' },
  { id: 2, nome: 'Caixa de Som Portátil', preco: 249.9, categoria: 'audio' },
];

// 1. Função é um valor: guardada numa constante e entregue ao sort
const porPreco = (a, b) => a.preco - b.preco;
console.log([...produtos].sort(porPreco).map((p) => p.nome));
// [...produtos].sort(porPreco()); // descomente: TypeError, porPreco rodou sem a e b

// 2. Alta ordem: daCategoria fabrica o teste que o filter usa
function daCategoria(categoria) {
  return (produto) => produto.categoria === categoria; // apague o return e rode de novo
}
console.log(produtos.filter(daCategoria('audio')).map((p) => p.nome));

// 3. Closure: cada chamada de criarContador cria um total novo
function criarContador() {
  let total = 0;
  return () => {
    total = total + 1;
    return total;
  };
}
const tentativasDeCupom = criarContador();
const tentativasDeLogin = criarContador();
console.log(tentativasDeCupom(), tentativasDeCupom()); // 1 2
console.log(tentativasDeLogin()); // 1: outra caixa
// console.log(total); // descomente: ReferenceError, ninguém de fora abre a caixa

// 4. O "Pense" da aula 19
function criarCarrinhoDeTeste() {
  let itens = 0;
  return {
    adicionar: () => {
      itens = itens + 1;
    },
    quantos: () => itens,
  };
}
const a = criarCarrinhoDeTeste();
const b = criarCarrinhoDeTeste();
a.adicionar();
a.adicionar();
b.adicionar();
console.log(a.quantos(), b.quantos()); // 2 1
