import { CepInvalidoError } from '../modelos/erros.js';
import { calcularFrete } from './frete.js';

export function freteDoCep(subtotal, cep) {
  const frete = calcularFrete(subtotal, cep);
  if (frete === null) {
    throw new CepInvalidoError(cep);
  }
  return frete; // daqui para baixo, frete é sempre um número
}
