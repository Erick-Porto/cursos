import { aplicarFiltros, comparadores, rotulosDeOrdem } from './catalogo.js';

const vitrine = [
  { id: 1, nome: 'Tênis de Corrida', preco: 349.9, categoria: 'esporte', avaliacao: 4.8 },
  { id: 2, nome: 'Óculos de Natação', preco: 89.9, categoria: 'esporte', avaliacao: 4.4 },
  { id: 3, nome: 'Garrafa Térmica', preco: 79.9, categoria: 'casa', avaliacao: 4.7 },
  { id: 4, nome: 'Bola de Futebol', preco: 99.9, categoria: 'esporte', avaliacao: 4.4 },
];

function ids(lista) {
  const resultado = [];
  for (const p of lista) resultado.push(p.id);
  return resultado;
}

describe('aplicarFiltros', () => {
  test('ordena por nome respeitando o acento', () => {
    expect(ids(aplicarFiltros(vitrine, { ordem: 'nome' }))).toEqual([4, 3, 2, 1]);
  });
  test('ordena por menor preço', () => {
    expect(ids(aplicarFiltros(vitrine, { ordem: 'preco' }))).toEqual([3, 2, 4, 1]);
  });
  test('ordena por avaliação e desempata pelo nome', () => {
    expect(ids(aplicarFiltros(vitrine, { ordem: 'avaliacao' }))).toEqual([1, 3, 4, 2]);
  });
  test('filtra a categoria e ordena', () => {
    expect(ids(aplicarFiltros(vitrine, { categoria: 'esporte', ordem: 'preco' }))).toEqual([2, 4, 1]);
  });
  test('sem filtros, ordena por nome', () => {
    expect(ids(aplicarFiltros(vitrine))).toEqual([4, 3, 2, 1]);
  });
  test('ordem desconhecida cai no nome', () => {
    expect(ids(aplicarFiltros(vitrine, { ordem: 'cor' }))).toEqual([4, 3, 2, 1]);
  });
  test('não altera a lista recebida', () => {
    aplicarFiltros(vitrine, { ordem: 'preco' });
    expect(ids(vitrine)).toEqual([1, 2, 3, 4]);
  });
  test('toda ordem com rótulo tem comparador', () => {
    expect(Object.keys(rotulosDeOrdem)).toEqual(Object.keys(comparadores));
  });
});
