export function ehFavorito(favoritos, id) {
  return favoritos.includes(id);
}

export function alternarFavorito(favoritos, id) {
  const novo = favoritos.slice();
  const posicao = novo.indexOf(id);
  if (posicao === -1) {
    novo.push(id);
  } else {
    novo.splice(posicao, 1);
  }
  return novo;
}
