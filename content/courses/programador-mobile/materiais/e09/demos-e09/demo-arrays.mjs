// E09 · Bloco 1 (aula 17): map, filter, reduce, find, some e every.
// Rode com: node demo-arrays.mjs
// Edite ao vivo: comente e descomente os trechos de cada slide.

const produtos = [
  { id: 1, nome: 'Fone Bluetooth', preco: 199.9, categoria: 'audio', destaque: true, avaliacao: 4.6 },
  { id: 2, nome: 'Caixa de Som Portátil', preco: 249.9, categoria: 'audio', destaque: false, avaliacao: 4.4 },
  { id: 3, nome: 'Microfone USB', preco: 329.9, categoria: 'audio', destaque: false, avaliacao: 4.3 },
  { id: 4, nome: 'Luminária de Mesa', preco: 89.9, categoria: 'casa', destaque: true, avaliacao: 4.5 },
  { id: 5, nome: 'Garrafa Térmica', preco: 79.9, categoria: 'casa', destaque: false, avaliacao: 4.7 },
  { id: 6, nome: 'Jogo de Panelas', preco: 459.9, categoria: 'casa', destaque: false, avaliacao: 4.2 },
  { id: 7, nome: 'Tênis de Corrida', preco: 349.9, categoria: 'esporte', destaque: true, avaliacao: 4.8 },
  { id: 8, nome: 'Tapete de Yoga', preco: 119.9, categoria: 'esporte', destaque: false, avaliacao: 4.4 },
  { id: 9, nome: 'Bola de Futebol', preco: 99.9, categoria: 'esporte', destaque: false, avaliacao: 4.1 },
  { id: 10, nome: 'Lógica de Programação', preco: 69.9, categoria: 'livros', destaque: true, avaliacao: 4.9 },
  { id: 11, nome: 'Livro de Receitas', preco: 59.9, categoria: 'livros', destaque: false, avaliacao: 4.5 },
  { id: 12, nome: 'Guia de Viagem', preco: 74.9, categoria: 'livros', destaque: false, avaliacao: 4.0 },
];

// O carrinho dos slides, no formato do E07: { id, nome, preco, qtd }
const itens = [
  { id: 1, nome: 'Fone Bluetooth', preco: 199.9, qtd: 1 },
  { id: 4, nome: 'Luminária de Mesa', preco: 89.9, qtd: 2 },
];

// O carrinho da animação do reduce: o fone, duas luminárias e um livro
const comLivro = [...itens, { id: 10, nome: 'Lógica de Programação', preco: 69.9, qtd: 1 }];

// As funções do E05, copiadas aqui para a demonstração rodar fora do projeto
function paraCentavos(reais) {
  return Math.round(reais * 100);
}
function paraReais(centavos) {
  return centavos / 100;
}

console.log('--- map: transformar cada item');
const linhas = itens.map((item) => `${item.qtd}x ${item.nome}`);
console.log(linhas);
// Passo 2 do roteiro: com chaves e sem return, sai [undefined, undefined]
// console.log(itens.map((item) => { `${item.qtd}x ${item.nome}`; }));
console.log('itens continua igual:', itens.length, 'itens');
console.log(linhas.join('\n'));

console.log('--- filter: manter só o que passa');
console.log(produtos.filter((p) => p.destaque).map((p) => p.nome));
console.log('até R$ 100:', produtos.filter((p) => p.preco <= 100).length, 'de', produtos.length);
console.log('sem o fone:', itens.filter((item) => item.id !== 1));

console.log('--- reduce: muitos itens, um valor');
const quantidade = comLivro.reduce((soma, item) => {
  console.log('soma:', soma, 'qtd:', item.qtd);
  return soma + item.qtd;
}, 0);
console.log('quantidade:', quantidade);

console.log('--- dinheiro: em reais e em centavos');
console.log(itens.reduce((soma, item) => soma + item.preco * item.qtd, 0));
const centavos = itens.reduce((soma, item) => soma + paraCentavos(item.preco) * item.qtd, 0);
console.log(paraReais(centavos));

console.log('--- contar e agrupar por categoria');
const porCategoria = produtos.reduce((contagem, p) => {
  if (contagem[p.categoria] === undefined) {
    contagem[p.categoria] = 0; // primeira vez desta categoria
  }
  contagem[p.categoria] = contagem[p.categoria] + 1;
  return contagem; // apague esta linha e rode: TypeError na segunda volta
}, {});
console.log(porCategoria);

const nomesPorCategoria = produtos.reduce((grupos, p) => {
  if (grupos[p.categoria] === undefined) {
    grupos[p.categoria] = [];
  }
  grupos[p.categoria].push(p.nome);
  return grupos;
}, {});
console.log(nomesPorCategoria);

console.log('--- Pense: reduce sem valor inicial');
console.log(itens.reduce((soma, item) => soma + item.qtd));
// Com a lista vazia, o Node para com TypeError: descomente para ver
// console.log([].reduce((soma, item) => soma + item.qtd));

console.log('--- find, some e every');
console.log(produtos.find((p) => p.id === 7));
console.log('algum no limite de 10?', itens.some((item) => item.qtd === 10));
console.log('quantidades ok?', itens.every((item) => item.qtd >= 1 && item.qtd <= 10));
console.log('lista vazia, every:', [].every((item) => item.qtd >= 1));

console.log('--- encadeando métodos');
const maisBemAvaliados = produtos
  .filter((p) => p.avaliacao >= 4.5)
  .sort((a, b) => b.avaliacao - a.avaliacao)
  .slice(0, 3)
  .map((p) => p.nome);
console.log(maisBemAvaliados);
console.log('produtos continua com', produtos.length, 'itens, na ordem do catálogo:', produtos[0].nome);

console.log('--- Pratique: destaques até R$ 200');
const destaquesBaratos = produtos
  .filter((p) => p.destaque && p.preco <= 200)
  .map((p) => ({ id: p.id, titulo: p.nome }));
console.log(destaquesBaratos);
