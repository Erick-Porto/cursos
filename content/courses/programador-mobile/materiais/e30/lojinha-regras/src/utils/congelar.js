export function congelarTudo(valor) {
  if (typeof valor !== 'object' || valor === null) {
    return valor; // caso base: número, texto, null...
  }
  for (const dentro of Object.values(valor)) {
    congelarTudo(dentro); // congela cada nível de dentro
  }
  return Object.freeze(valor);
}
