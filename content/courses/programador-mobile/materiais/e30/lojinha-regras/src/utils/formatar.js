// Textos para mostrar ao cliente. As contas ficam em src/regras/.

// o formatador é criado uma vez e reaproveitado (E06)
const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function formatarPreco(valor) {
  return moeda.format(valor);
}

export function resumoDaCompra(textoQtd, preco) {
  const qtd = parseInt(textoQtd, 10);
  return Number.isNaN(qtd)
    ? 'Digite a quantidade em números'
    : `${qtd} x ${formatarPreco(preco)} = ${formatarPreco(qtd * preco)}`;
}
