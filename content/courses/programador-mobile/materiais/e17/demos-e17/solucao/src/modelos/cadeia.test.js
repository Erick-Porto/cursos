import Produto from './Produto.js';
import { Pagamento, PagamentoBoleto, PagamentoPix } from './Pagamento.js';
import { CepInvalidoError, ErroDeNegocio } from './erros.js';
import { produtos } from '../data/produtos.js';

const fone = Produto.deJSON(produtos[0]);

test('dados na instância, métodos no protótipo', () => {
  expect(Object.hasOwn(fone, 'nome')).toBe(true);
  expect(Object.hasOwn(fone, 'precoPara')).toBe(false);
  expect(Object.getPrototypeOf(fone)).toBe(Produto.prototype);
});

test('todas as instâncias usam a mesma função', () => {
  const caixa = Produto.deJSON(produtos[1]);
  expect(fone.precoPara).toBe(caixa.precoPara);
});

test('extends liga o protótipo da filha ao da mãe', () => {
  expect(Object.getPrototypeOf(PagamentoPix.prototype)).toBe(Pagamento.prototype);
  expect(new PagamentoBoleto().totalAPagar).toBe(Pagamento.prototype.totalAPagar);
});

test('a cópia perde a cadeia', () => {
  const copia = { ...fone };
  expect(copia.precoFormatado).toBeUndefined();
  expect(copia).not.toBeInstanceOf(Produto);
});

test('os erros próprios descendem de Error', () => {
  const erro = new CepInvalidoError('123');
  expect(Object.getPrototypeOf(CepInvalidoError.prototype)).toBe(ErroDeNegocio.prototype);
  expect(Object.getPrototypeOf(ErroDeNegocio.prototype)).toBe(Error.prototype);
  expect(erro).toBeInstanceOf(Error);
});
