// E07 · aula 13: for com início, condição e passo, e um if dentro.
// Uso: node estrelas.mjs

function estrelasDaNota(nota) {
  const cheias = Math.round(nota);
  let estrelas = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= cheias) {
      estrelas += '*';
    } else {
      estrelas += '-';
    }
  }
  return estrelas;
}

console.log('Caixa de Som Portátil, 4.4:', estrelasDaNota(4.4)); // ****-
console.log('Fone Bluetooth, 4.6:', estrelasDaNota(4.6)); // *****
