import { memoize } from '../utils/funcoes.js';
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

// a pirâmide do slide "Uma regra difícil de ler": ponto de partida da refatoração
export function calcularFrete(subtotal, cep) {
  if (cep) {
    if (ehCepValido(cep)) {
      if (subtotal < 150) {
        const digitos = cep.replace(/\D/g, '');
        return FRETE_POR_DIGITO[digitos[0]];
      } else {
        return 0;
      }
    } else {
      return null;
    }
  }
  return null;
}

// do E10: continua no fim do arquivo
export const calcularFreteComCache = memoize(calcularFrete);
