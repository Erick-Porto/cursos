export function memoize(fn) {
  const cache = {}; // um por função memoizada
  return (...args) => {
    const chave = JSON.stringify(args); // [80,"01001000"]
    if (chave in cache) return cache[chave];
    const resultado = fn(...args);
    cache[chave] = resultado;
    return resultado;
  };
}

export function debounce(fn, espera = 300) {
  let temporizador; // guardado na closure
  return (...args) => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => fn(...args), espera);
  };
}
