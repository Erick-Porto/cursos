// As consultas simuladas do E18: cada uma devolve uma Promise que cumpre depois de um tempo.

export function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function consultarFrete(cep) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!/^\d{5}-?\d{3}$/.test(cep)) reject(new Error('CEP inválido'));
      else resolve(19.9);
    }, 800);
  });
}

export function consultarPrazo(cep) {
  return esperar(600).then(() => 3); // 3 dias úteis
}

export function consultarCupom(codigo) {
  return esperar(400).then(() => (codigo === 'BEMVINDO' ? 0.1 : 0)); // 10% de desconto
}
