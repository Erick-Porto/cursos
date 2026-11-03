// Tema do Gota: as cores, os espaços e os cantos do app, cada um com um nome.
// Use o nome no estilo, por exemplo: backgroundColor: cores.agua
// Cada cor é um código: # e seis letras ou números, que dizem quanto tem de vermelho, verde e azul.

export const cores = {
  fundo: '#f0f9ff', // fundo da tela, um azul bem claro
  cartao: '#ffffff', // fundo dos cartões
  agua: '#0369a1', // azul da água: botões e barra
  aguaClara: '#e0f2fe', // trilho da barra, por baixo do azul
  titulo: '#0c4a6e', // títulos
  texto: '#0f172a', // texto principal
  textoFraco: '#64748b', // texto de apoio, como a hora
  textoNoAzul: '#ffffff', // texto em cima do azul
  perigo: '#b91c1c', // o botão Remover
};

// espaços, em pontos da tela (sem px)
export const espacos = {
  pequeno: 4,
  medio: 8,
  grande: 16,
};

// arredondamento dos cantos
export const cantos = {
  pequeno: 8,
  grande: 16,
};
