export function registrarBusca(historico, termo, limite = 5) {
  const limpo = termo.trim();
  if (limpo === '') return historico;

  const novo = historico.slice();
  const repetida = novo.findIndex((t) => t.toLowerCase() === limpo.toLowerCase());
  if (repetida !== -1) novo.splice(repetida, 1);

  novo.unshift(limpo);
  return novo.slice(0, limite);
}
