import { registrarBusca } from './historico.js';

describe('registrarBusca', () => {
  test('põe a busca mais recente no começo', () => {
    expect(registrarBusca(['garrafa'], 'fone')).toEqual(['fone', 'garrafa']);
  });
  test('não repete: a busca repetida sobe para o começo', () => {
    expect(registrarBusca(['fone', 'garrafa', 'tênis'], 'Garrafa')).toEqual(['Garrafa', 'fone', 'tênis']);
  });
  test('guarda no máximo 5 buscas', () => {
    const cheio = ['fone', 'bola', 'yoga', 'panela', 'livro'];
    expect(registrarBusca(cheio, 'garrafa')).toEqual(['garrafa', 'fone', 'bola', 'yoga', 'panela']);
  });
  test('ignora busca vazia e tira os espaços das pontas', () => {
    expect(registrarBusca(['fone'], '   ')).toEqual(['fone']);
    expect(registrarBusca([], '  bola ')).toEqual(['bola']);
  });
  test('não altera o histórico recebido', () => {
    const historico = ['fone', 'garrafa'];
    registrarBusca(historico, 'bola');
    expect(historico).toEqual(['fone', 'garrafa']);
  });
});
