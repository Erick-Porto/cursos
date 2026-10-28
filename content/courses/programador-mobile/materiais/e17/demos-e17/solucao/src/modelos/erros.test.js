import { CepInvalidoError, CupomInvalidoError, ErroDeNegocio, EstoqueInsuficienteError } from './erros.js';

test('CepInvalidoError é ErroDeNegocio e Error, com codigo', () => {
  const erro = new CepInvalidoError('123');
  expect(erro).toBeInstanceOf(ErroDeNegocio);
  expect(erro).toBeInstanceOf(Error);
  expect(erro.codigo).toBe('CEP_INVALIDO');
  expect(erro.name).toBe('CepInvalidoError');
});

test('CupomInvalidoError usa o motivo como message', () => {
  const erro = new CupomInvalidoError('NATAL25', 'Este cupom expirou');
  expect(erro.message).toBe('Este cupom expirou');
  expect(erro.cupom).toBe('NATAL25');
});

test('CupomInvalidoError tem um motivo padrão', () => {
  expect(new CupomInvalidoError('XYZ').message).toBe('Este cupom não vale para este pedido');
});

test('EstoqueInsuficienteError guarda o disponível', () => {
  const erro = new EstoqueInsuficienteError('Luminária de Mesa', 2);
  expect(erro.message).toBe('Luminária de Mesa: só 2 em estoque.');
  expect(erro.disponivel).toBe(2);
  expect(erro.codigo).toBe('ESTOQUE_INSUFICIENTE');
});
