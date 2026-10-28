import fs from 'node:fs';
import pc from 'picocolors';

const texto = fs.readFileSync('src/data/catalogo.json', 'utf-8');
const catalogo = JSON.parse(texto);
const categoria = process.argv[2];

let lista = catalogo.produtos;
let titulo = 'todas as categorias';
if (categoria) {
  lista = lista.filter((produto) => produto.categoria === categoria);
  titulo = categoria;
}

const destaques = lista.filter((produto) => produto.destaque);
const caros = lista.filter((produto) => produto.preco > 200);
const semImagem = lista.filter((produto) => produto.imagem === '');
const soma = lista.reduce((total, produto) => total + produto.preco, 0);
const media = soma / lista.length;

console.log(pc.bold('Relatório do catálogo:'), titulo);
console.log('Produtos:', lista.length);
console.log('Em destaque:', destaques.length);
console.log('Acima de R$ 200:', caros.length);
console.log('Preço médio: R$', media.toFixed(2));
console.log(pc.yellow('Sem imagem:'), semImagem.length);
