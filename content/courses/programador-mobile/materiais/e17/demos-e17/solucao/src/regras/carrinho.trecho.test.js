// src/regras/carrinho.test.js: testes acrescentados no E17 (junte os imports aos que já existem).
import { adicionarItem, alterarQuantidade } from './carrinho.js';
import { EstoqueInsuficienteError } from '../modelos/erros.js';

const luminaria = { id: 4, nome: 'Luminária de Mesa', preco: 89.9, estoque: 2 };

test('alterar acima do estoque lança e não muda a lista', () => {
  const itens = [{ ...luminaria, qtd: 2 }];
  expect(() => alterarQuantidade(itens, 4, 3)).toThrow(EstoqueInsuficienteError);
  expect(itens[0].qtd).toBe(2);
});

test('adicionar de novo além do estoque lança', () => {
  const itens = adicionarItem(adicionarItem([], luminaria), luminaria);
  expect(() => adicionarItem(itens, luminaria)).toThrow('Luminária de Mesa: só 2 em estoque.');
});
