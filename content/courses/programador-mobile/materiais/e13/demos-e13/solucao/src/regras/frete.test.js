import { calcularFrete, calcularFreteComCache, textoDoFrete } from './frete.js';

describe('calcularFrete', () => {
  test('grátis a partir de R$ 150', () => {
    expect(calcularFrete(150, '01310-100')).toBe(0);
    expect(calcularFrete(199.9, '69900-000')).toBe(0);
  });
  test('cobra pela região abaixo de R$ 150', () => {
    expect(calcularFrete(149.99, '01310-100')).toBe(9.9);
    expect(calcularFrete(129.8, '30130-010')).toBe(14.9);
    expect(calcularFrete(129.8, '40020-000')).toBe(19.9);
    expect(calcularFrete(129.8, '69900-000')).toBe(24.9);
    expect(calcularFrete(129.8, '70040-010')).toBe(19.9);
    expect(calcularFrete(129.8, '90010-000')).toBe(14.9);
  });
  test('aceita CEP com ou sem hífen', () => {
    expect(calcularFrete(59.9, '20040020')).toBe(14.9);
    expect(calcularFrete(59.9, ' 20040-020 ')).toBe(14.9);
  });
  test('CEP inválido devolve null, mesmo acima de R$ 150', () => {
    expect(calcularFrete(200, '1234')).toBeNull();
    expect(calcularFrete(50, '01310-1000')).toBeNull();
    expect(calcularFrete(50, '')).toBeNull();
    expect(calcularFrete(50, undefined)).toBeNull();
  });
});

describe('textoDoFrete', () => {
  test('null pede o CEP e 0 vira Grátis', () => {
    expect(textoDoFrete(null)).toBe('Informe o CEP');
    expect(textoDoFrete(0)).toBe('Grátis');
  });
  test('valor aparece em reais', () => {
    expect(textoDoFrete(24.9)).toContain('24,90');
  });
});

describe('calcularFreteComCache', () => {
  test('devolve o mesmo que calcularFrete', () => {
    expect(calcularFreteComCache(80, '69900-000')).toBe(calcularFrete(80, '69900-000'));
    expect(calcularFreteComCache(200, '1234')).toBeNull();
  });
});
