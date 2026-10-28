import { produtos } from '../data/produtos.js';
import { alternarFavorito, ehFavorito } from '../regras/favoritos.js';

let favoritos = [];
for (const texto of process.argv.slice(2)) {
  favoritos = alternarFavorito(favoritos, Number(texto));
}

console.log(`Favoritos: ${favoritos.join(', ')}`);
for (const p of produtos) {
  let marca = '[ ]';
  if (ehFavorito(favoritos, p.id)) marca = '[x]';
  console.log(`${marca} ${p.nome}`);
}
