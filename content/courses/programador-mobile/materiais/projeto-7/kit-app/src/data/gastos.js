// Briefing 3 · Controle de gastos: os dados fixos do app de finanças.
// E41: apague este arquivo se a equipe escolheu outro briefing.
//
// Cada lançamento:
// {
//   id: 1,                       número único
//   tipo: 'Saída',               'Entrada' ou 'Saída'
//   valor: 4590,                 em centavos: 4590 é R$ 45,90 (use formatarReais, de '@/utils')
//   categoria: 'Mercado',        o nome de uma das categorias abaixo
//   descricao: 'Feira da semana',
//   data: '06/10/2026',          dia/mês/ano (use formatarData(new Date()) para a data de hoje)
// }
// Regras do briefing: valor maior que zero; saldo = soma das entradas menos soma das saídas;
// cada categoria mostra quanto das saídas foi para ela, em reais e em porcentagem.

export const tipos = ['Entrada', 'Saída'];

// Cada categoria vale para um tipo: as de saída para gastos, as de entrada para o que você recebe.
export const categorias = [
  { nome: 'Mercado', tipo: 'Saída', icone: 'cart-outline' },
  { nome: 'Transporte', tipo: 'Saída', icone: 'bus-outline' },
  { nome: 'Contas da casa', tipo: 'Saída', icone: 'home-outline' },
  { nome: 'Lazer', tipo: 'Saída', icone: 'game-controller-outline' },
  { nome: 'Salário', tipo: 'Entrada', icone: 'cash-outline' },
  { nome: 'Renda extra', tipo: 'Entrada', icone: 'gift-outline' },
];

// Lançamentos para as telas não começarem vazias, do mais novo para o mais velho.
// Entradas R$ 1950,00; saídas R$ 222,90; saldo R$ 1727,10.
export const lancamentosDeExemplo = [
  { id: 6, tipo: 'Entrada', valor: 15000, categoria: 'Renda extra', descricao: 'Venda de bolos', data: '10/10/2026' },
  { id: 5, tipo: 'Saída', valor: 3500, categoria: 'Lazer', descricao: 'Cinema', data: '09/10/2026' },
  { id: 4, tipo: 'Saída', valor: 12000, categoria: 'Contas da casa', descricao: 'Conta de luz', data: '08/10/2026' },
  { id: 3, tipo: 'Saída', valor: 2200, categoria: 'Transporte', descricao: 'Recarga do cartão', data: '06/10/2026' },
  { id: 2, tipo: 'Saída', valor: 4590, categoria: 'Mercado', descricao: 'Feira da semana', data: '06/10/2026' },
  { id: 1, tipo: 'Entrada', valor: 180000, categoria: 'Salário', descricao: 'Bolsa do estágio', data: '05/10/2026' },
];
