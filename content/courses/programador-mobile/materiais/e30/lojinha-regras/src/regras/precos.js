// Regras de preço da Lojinha.
// Entrada e saída em reais, como no catálogo; a conta é feita em centavos inteiros.

export const PERCENTUAL_PIX = 5;
export const PARCELAS_NA_VITRINE = 3;

export function paraCentavos(reais) {
  return Math.round(reais * 100);
}

export function paraReais(centavos) {
  return centavos / 100;
}

// Valor do desconto, arredondado ao centavo. O percentual fica entre 0 e 100.
export function calcularDesconto(preco, percentual) {
  const limitado = Math.min(Math.max(percentual, 0), 100);
  const desconto = Math.round((paraCentavos(preco) * limitado) / 100);
  return paraReais(desconto);
}

export function precoComPix(preco) {
  const desconto = calcularDesconto(preco, PERCENTUAL_PIX);
  return paraReais(paraCentavos(preco) - paraCentavos(desconto));
}

// A primeira parcela leva os centavos que sobram da divisão.
export function parcelar(total, parcelas) {
  const centavos = paraCentavos(total);
  const valor = Math.floor(centavos / parcelas);
  const resto = centavos % parcelas;
  return {
    parcelas: parcelas,
    valor: paraReais(valor),
    primeira: paraReais(valor + resto),
  };
}

// E10: soma dois valores em reais, sem o erro do ponto flutuante
export function somarReais(a, b) {
  return paraReais(paraCentavos(a) + paraCentavos(b));
}

export function maximoDeParcelas(preco) {
  if (preco < 50) {
    return 1;
  } else if (preco < 300) {
    return 3;
  } else if (preco < 1000) {
    return 6;
  } else {
    return 10;
  }
}
