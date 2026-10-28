import { memoize } from '../utils/funcoes.js';
import { formatarPreco } from '../utils/formatar.js';
import { ehCepValido } from '../utils/validar.js';

export const FRETE_GRATIS_A_PARTIR_DE = 150;

// primeiro dígito do CEP: valor do frete em reais
const FRETE_POR_DIGITO = {
  0: 9.9, // SP
  1: 9.9, // SP
  2: 14.9, // RJ e ES
  3: 14.9, // MG
  4: 19.9, // BA e SE
  5: 19.9, // PE, AL, PB e RN
  6: 24.9, // CE, PI, MA, PA, AP, AM, RR e AC
  7: 19.9, // DF, GO, TO, MT, MS e RO
  8: 14.9, // PR e SC
  9: 14.9, // RS
};

export function calcularFrete(subtotal, cep) {
  const cepValido = ehCepValido(cep ?? ''); // do E06
  if (!cepValido) return null;
  if (subtotal >= FRETE_GRATIS_A_PARTIR_DE) return 0;

  const digitos = cep.replace(/\D/g, '');
  return FRETE_POR_DIGITO[digitos[0]];
}

export function textoDoFrete(frete) {
  if (frete === null) return 'Informe o CEP';
  if (frete === 0) return 'Grátis';
  return formatarPreco(frete);
}

// do E10: continua no fim do arquivo
export const calcularFreteComCache = memoize(calcularFrete);
