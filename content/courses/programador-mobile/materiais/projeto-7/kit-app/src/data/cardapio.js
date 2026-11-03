// Briefing 2 · Cardápio e pedidos: os dados fixos da lanchonete.
// E41: apague este arquivo se a equipe escolheu outro briefing.
//
// Cada produto:
// {
//   id: 1,                    número único
//   nome: 'X-Burger',
//   categoria: 'Lanches',     uma das categorias abaixo
//   preco: 2290,              em centavos: 2290 é R$ 22,90 (use formatarReais, de '@/utils')
//   descricao: '...',
//   disponivel: true,         false: acabou hoje, aparece apagado e não entra no carrinho
// }
//
// Cada item do carrinho:
// {
//   id: 1,
//   produtoId: 1,             o id do produto
//   nome: 'X-Burger',
//   preco: 2290,              o preço de uma unidade, em centavos
//   quantidade: 2,            de 1 a 10
//   observacao: 'sem cebola', até 140 letras ('' quando não tem)
// }
// Regras do briefing: pedido mínimo de R$ 15,00 (1500 centavos);
// previsão de retirada: 10 minutos mais 2 por unidade, no máximo 45.

export const categorias = ['Lanches', 'Bebidas', 'Sobremesas'];

export const produtos = [
  {
    id: 1,
    nome: 'X-Burger',
    categoria: 'Lanches',
    preco: 2290,
    descricao: 'Pão, hambúrguer, queijo e salada.',
    disponivel: true,
  },
  {
    id: 2,
    nome: 'X-Salada',
    categoria: 'Lanches',
    preco: 2490,
    descricao: 'Pão, hambúrguer, queijo, alface, tomate e maionese da casa.',
    disponivel: true,
  },
  {
    id: 3,
    nome: 'Misto quente',
    categoria: 'Lanches',
    preco: 1200,
    descricao: 'Pão de forma, presunto e queijo na chapa.',
    disponivel: true,
  },
  {
    id: 4,
    nome: 'Wrap de frango',
    categoria: 'Lanches',
    preco: 2650,
    descricao: 'Frango desfiado, cenoura, alface e molho de iogurte.',
    disponivel: false,
  },
  {
    id: 5,
    nome: 'Suco de laranja',
    categoria: 'Bebidas',
    preco: 900,
    descricao: 'Copo de 400 ml, feito na hora.',
    disponivel: true,
  },
  {
    id: 6,
    nome: 'Refrigerante lata',
    categoria: 'Bebidas',
    preco: 650,
    descricao: 'Lata de 350 ml.',
    disponivel: true,
  },
  {
    id: 7,
    nome: 'Água sem gás',
    categoria: 'Bebidas',
    preco: 400,
    descricao: 'Garrafa de 500 ml.',
    disponivel: true,
  },
  {
    id: 8,
    nome: 'Pudim',
    categoria: 'Sobremesas',
    preco: 1100,
    descricao: 'Fatia de pudim de leite.',
    disponivel: true,
  },
  {
    id: 9,
    nome: 'Brownie',
    categoria: 'Sobremesas',
    preco: 950,
    descricao: 'Brownie de chocolate com castanha.',
    disponivel: false,
  },
  {
    id: 10,
    nome: 'Salada de frutas',
    categoria: 'Sobremesas',
    preco: 1000,
    descricao: 'Pote de 300 ml com as frutas da estação.',
    disponivel: true,
  },
];

// Um carrinho para as telas não começarem vazias: 3 unidades, R$ 54,80.
export const carrinhoDeExemplo = [
  { id: 1, produtoId: 1, nome: 'X-Burger', preco: 2290, quantidade: 2, observacao: 'sem cebola' },
  { id: 2, produtoId: 5, nome: 'Suco de laranja', preco: 900, quantidade: 1, observacao: '' },
];
