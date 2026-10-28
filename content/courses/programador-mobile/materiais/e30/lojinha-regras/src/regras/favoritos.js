export function ehFavorito(favoritos, id) {
  return favoritos.has(id);
}

export function alternarFavorito(favoritos, id) {
  const novo = new Set(favoritos); // o Set recebido não muda
  if (novo.has(id)) {
    novo.delete(id);
  } else {
    novo.add(id);
  }
  return novo;
}

export function listarFavoritos(favoritos, produtosPorId) {
  return [...favoritos]
    .map((id) => produtosPorId.get(id))
    .filter((produto) => produto !== undefined);
}
