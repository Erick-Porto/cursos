import { alternarFavorito, ehFavorito } from './favoritos.js';

describe('favoritos', () => {
  test('alternar acrescenta o id que não está', () => {
    expect(alternarFavorito([3], 7)).toEqual([3, 7]);
  });
  test('alternar tira o id que já está', () => {
    expect(alternarFavorito([3, 7, 10], 7)).toEqual([3, 10]);
  });
  test('alternar não altera o array recebido', () => {
    const favoritos = [3];
    alternarFavorito(favoritos, 7);
    expect(favoritos).toEqual([3]);
  });
  test('ehFavorito responde se o id está na lista', () => {
    expect(ehFavorito([3, 7], 7)).toBe(true);
    expect(ehFavorito([3, 7], 10)).toBe(false);
  });
  test('ehFavorito não acha o id escrito como texto', () => {
    expect(ehFavorito([3, 7], '7')).toBe(false);
  });
});
