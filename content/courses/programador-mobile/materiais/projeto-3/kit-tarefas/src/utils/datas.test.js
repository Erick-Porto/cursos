// Testes das datas do kit. Eles já passam: são o seu modelo de teste com data fixa.
import { diasAte, ehDataValida, paraPrazo, somarDias } from './datas.js';

const HOJE = new Date(2026, 10, 10); // 10 de novembro de 2026 (o mês começa em 0)

test('diasAte conta os dias de hoje até o prazo', () => {
  expect(diasAte('2026-11-15', HOJE)).toBe(5);
  expect(diasAte('2026-11-10', HOJE)).toBe(0);
  expect(diasAte('2026-11-07', HOJE)).toBe(-3);
});

test('diasAte não liga para a hora de hoje', () => {
  const quaseMeiaNoite = new Date(2026, 10, 10, 23, 59);
  expect(diasAte('2026-11-11', quaseMeiaNoite)).toBe(1);
});

test('somarDias devolve o novo prazo em texto', () => {
  expect(somarDias('2026-11-10', 7)).toBe('2026-11-17');
  expect(somarDias('2026-11-28', 7)).toBe('2026-12-05');
  expect(somarDias('2026-12-31', 1)).toBe('2027-01-01');
});

test('paraPrazo escreve o mês e o dia com dois dígitos', () => {
  expect(paraPrazo(new Date(2026, 0, 5))).toBe('2026-01-05');
});

test.each([
  ['2026-11-10', true],
  ['2026-02-30', false],
  ['10/11/2026', false],
  ['2026-11-1', false],
  ['', false],
])('ehDataValida(%s) devolve %s', (texto, esperado) => {
  expect(ehDataValida(texto)).toBe(esperado);
});
