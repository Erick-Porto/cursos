// O formatarPreco do E05, copiado para a demonstração rodar fora do projeto.
export function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
