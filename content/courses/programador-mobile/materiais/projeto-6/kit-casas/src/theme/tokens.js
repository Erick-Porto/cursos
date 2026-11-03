// Tokens de design do Casas de adoção: o único arquivo do app com códigos de cor.
// Cada cor tem um papel (fundo, texto, primaria...). Os dois temas usam os mesmos nomes.
//
// Quer outra cor primária? Troque as duas linhas "primaria" por um destes pares
// (claro | escuro), todos com contraste de pelo menos 4,5 : 1 nos dois temas:
//   roxo  '#6d28d9' | '#c4b5fd'
//   azul  '#1d4ed8' | '#93c5fd'
//   rosa  '#be185d' | '#f9a8d4'

export const cores = {
  claro: {
    fundo: '#f7f4ef', // atrás de tudo
    superficie: '#ffffff', // cartões, campos e barras
    borda: '#e2dbd1', // contornos e divisórias
    texto: '#1f1a14', // texto principal
    textoSuave: '#5c5348', // texto de apoio (bairro, rótulos)
    primaria: '#0f766e', // a cor do app: botões, links e destaques
    sobreCor: '#ffffff', // texto em cima de uma cor forte (botão, selo)
    sucesso: '#15803d',
    alerta: '#b45309',
    perigo: '#b91c1c',
  },
  escuro: {
    fundo: '#15120f',
    superficie: '#211d19',
    borda: '#3d362f',
    texto: '#f4efe8',
    textoSuave: '#b8ad9f',
    primaria: '#5eead4',
    sobreCor: '#15120f',
    sucesso: '#4ade80',
    alerta: '#fbbf24',
    perigo: '#f87171',
  },
};

// Espaços (padding, margin e gap), de 4 em 4
export const espaco = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

// Arredondamento dos cantos (borderRadius)
export const raio = { sm: 8, md: 12, lg: 20, redondo: 999 };

// Tamanhos de letra (fontSize)
export const fonte = { pequena: 13, corpo: 16, subtitulo: 18, titulo: 24, destaque: 28 };
