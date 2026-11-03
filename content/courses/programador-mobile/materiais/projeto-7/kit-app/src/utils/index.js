// Funções de apoio do kit. As três primeiras são as que você escreveu no Projeto 1 (Racha-conta).
//   formatarReais(centavos)  o valor em reais, com vírgula: formatarReais(4590) devolve 'R$ 45,90'
//   lerValor(texto)          o que a pessoa digitou, em centavos: lerValor('45,90') devolve 4590;
//                            texto que não é um valor maior que zero devolve null
//   formatarData(data)       uma data em dia/mês/ano: formatarData(new Date(2026, 9, 8)) devolve '08/10/2026';
//                            formatarData(new Date()) devolve a data de hoje
//   paraBusca(texto)         o texto em minúsculas, sem acento e sem espaço nas pontas (Projeto 6):
//                            paraBusca(' Água ') devolve 'agua'

export function formatarReais(centavos) {
  const reais = (centavos / 100).toFixed(2);
  const comVirgula = reais.replace('.', ',');
  return `R$ ${comVirgula}`;
}

export function lerValor(texto) {
  let limpo = texto.trim();
  limpo = limpo.replace('R$', '');
  limpo = limpo.trim();
  limpo = limpo.replace(',', '.');

  const partes = limpo.split('.');
  if (partes.length > 1 && partes[1].length > 2) {
    return null;
  }
  const reais = Number(limpo);
  if (Number.isNaN(reais) || reais <= 0) {
    return null;
  }
  return Math.round(reais * 100);
}

export function formatarData(data) {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

const SEM_ACENTO = {
  á: 'a', à: 'a', â: 'a', ã: 'a', é: 'e', ê: 'e', í: 'i',
  ó: 'o', ô: 'o', õ: 'o', ú: 'u', ü: 'u', ç: 'c',
};

export function paraBusca(texto) {
  const letras = [...texto.trim().toLowerCase()];
  return letras.map((letra) => SEM_ACENTO[letra] ?? letra).join('');
}
