import { calcularFrete, calcularFreteComCache } from './frete.js';

describe('calcularFrete', () => {
  test('grátis a partir de R$ 150', () => {
    expect(calcularFrete(150, '01310-100')).toBe(0);
  });
  test('cobra pela região abaixo de R$ 150', () => {
    expect(calcularFrete(149.99, '01310-100')).toBe(9.9);
    expect(calcularFrete(149.99, '69900-000')).toBe(24.9);
  });
  test('CEP inválido devolve null, mesmo acima de R$ 150', () => {
    expect(calcularFrete(200, '1234')).toBeNull();
    expect(calcularFrete(50, undefined)).toBeNull();
  });
});

describe('calcularFreteComCache', () => {
  test('devolve o mesmo que calcularFrete', () => {
    expect(calcularFreteComCache(80, '01001000')).toBe(calcularFrete(80, '01001000'));
    expect(calcularFreteComCache(200, '20040020')).toBe(0);
  });
});
