// E10 · debounce: simula alguém digitando "fone" no campo de busca
// Rode da pasta demos-e10: node debounce.mjs      (uma letra a cada 120 ms)
//                          node debounce.mjs 400  (um cliente lento)

function debounce(fn, espera = 300) {
  let temporizador;
  return (...args) => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => fn(...args), espera);
  };
}

// os nomes dos 12 produtos da Lojinha
const produtos = [
  'Fone Bluetooth', 'Caixa de Som Portátil', 'Microfone USB', 'Luminária de Mesa',
  'Garrafa Térmica', 'Jogo de Panelas', 'Tênis de Corrida', 'Tapete de Yoga',
  'Bola de Futebol', 'Lógica de Programação', 'Livro de Receitas', 'Guia de Viagem',
].map((nome) => ({ nome }));

let intervalo = 120; // ms entre uma letra e outra
if (process.argv[2] !== undefined) {
  intervalo = Number(process.argv[2]);
}

const inicio = Date.now();
const buscar = debounce((termo) => {
  const achados = produtos.filter((p) => p.nome.toLowerCase().includes(termo));
  console.log(`${Date.now() - inicio} ms: "${termo}" acha ${achados.length}`);
}, 300);

const termos = ['f', 'fo', 'fon', 'fone'];
for (let i = 0; i < termos.length; i++) {
  setTimeout(() => buscar(termos[i]), i * intervalo);
}
