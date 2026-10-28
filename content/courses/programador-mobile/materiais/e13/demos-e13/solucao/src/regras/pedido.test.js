import { textoDoStatus, tomDoStatus, validarCupom } from './pedido.js';

describe('status do pedido', () => {
  test('cada status tem texto e tom', () => {
    expect(textoDoStatus('pendente')).toBe('Aguardando pagamento');
    expect(tomDoStatus('pendente')).toBe('alerta');
    expect(textoDoStatus('enviado')).toBe('A caminho');
    expect(tomDoStatus('enviado')).toBe('neutro');
    expect(tomDoStatus('pago')).toBe('sucesso');
    expect(tomDoStatus('entregue')).toBe('sucesso');
    expect(tomDoStatus('cancelado')).toBe('perigo');
  });
  test('status desconhecido cai no default', () => {
    expect(textoDoStatus('devolvido')).toBe('Status desconhecido');
    expect(textoDoStatus('Pago')).toBe('Status desconhecido');
    expect(tomDoStatus(undefined)).toBe('neutro');
  });
});

describe('validarCupom', () => {
  test('BEMVINDO10 dá 10% em centavos exatos', () => {
    expect(validarCupom('BEMVINDO10', 199.9)).toEqual({
      valido: true,
      desconto: 19.99,
      mensagem: 'Cupom BEMVINDO10 aplicado',
    });
  });
  test('ignora espaços e minúsculas', () => {
    expect(validarCupom('  bemvindo10 ', 129.8).desconto).toBe(12.98);
  });
  test('LOJINHA20 exige R$ 100 em compras', () => {
    expect(validarCupom('LOJINHA20', 129.8).desconto).toBe(20);
    expect(validarCupom('LOJINHA20', 100).valido).toBe(true);
    expect(validarCupom('LOJINHA20', 99.9)).toEqual({
      valido: false,
      desconto: 0,
      mensagem: 'Válido em compras a partir de R$ 100',
    });
  });
  test('recusa código vazio, inexistente ou expirado', () => {
    expect(validarCupom('', 200).mensagem).toBe('Digite o código do cupom');
    expect(validarCupom('   ', 200).mensagem).toBe('Digite o código do cupom');
    expect(validarCupom(null, 200).mensagem).toBe('Digite o código do cupom');
    expect(validarCupom(undefined, 200).mensagem).toBe('Digite o código do cupom');
    expect(validarCupom('DESCONTO50', 200).mensagem).toBe('Cupom não encontrado');
    expect(validarCupom('NATAL25', 200).mensagem).toBe('Este cupom expirou');
  });
});
