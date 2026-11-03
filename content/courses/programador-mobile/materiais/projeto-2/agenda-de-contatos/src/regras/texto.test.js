import { inicial, soDigitos } from './texto.js';

test('soDigitos tira parênteses, espaço e hífen', () => {
  expect(soDigitos('(11) 98765-4321')).toBe('11987654321');
});

test('soDigitos de um texto sem algarismos dá texto vazio', () => {
  expect(soDigitos('sem telefone')).toBe('');
});

test('inicial é a primeira letra, em maiúscula', () => {
  expect(inicial('Mariana Souza')).toBe('M');
  expect(inicial('bruno')).toBe('B');
});

test('inicial tira o acento: Álvaro fica no A, Érica no E', () => {
  expect(inicial('Álvaro Mendes')).toBe('A');
  expect(inicial('Érica Nogueira')).toBe('E');
});
