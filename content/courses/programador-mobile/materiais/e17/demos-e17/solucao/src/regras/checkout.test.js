import { freteDoCep } from './checkout.js';
import { CepInvalidoError } from '../modelos/erros.js';

describe('freteDoCep', () => {
  test('CEP válido devolve o frete da região', () => {
    expect(freteDoCep(89.9, '01310000')).toBe(9.9);
  });

  test('CEP com 7 números lança CepInvalidoError', () => {
    expect(() => freteDoCep(100, '0131000')).toThrow(CepInvalidoError);
  });

  test('o erro traz o código CEP_INVALIDO', () => {
    let erro;
    try { freteDoCep(100, 'abc'); } catch (e) { erro = e; }
    expect(erro.codigo).toBe('CEP_INVALIDO');
  });
});
