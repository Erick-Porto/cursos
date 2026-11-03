// Funções de apoio do kit.
//   paraBusca(texto)      o texto em minúsculas, sem acento e sem espaço nas pontas:
//                         paraBusca('São Paulo') devolve 'sao paulo'
//   resumoDasCasas(casas) os números do app: { casas: 12, cidades: 5, vagas: 76 } com as 12 casas do curso

const SEM_ACENTO = {
  á: 'a', à: 'a', â: 'a', ã: 'a', é: 'e', ê: 'e', í: 'i',
  ó: 'o', ô: 'o', õ: 'o', ú: 'u', ü: 'u', ç: 'c',
};

export function paraBusca(texto) {
  const letras = [...texto.trim().toLowerCase()];
  return letras.map((letra) => SEM_ACENTO[letra] ?? letra).join('');
}

export function resumoDasCasas(casas) {
  const cidades = [];
  let vagas = 0;
  for (const casa of casas) {
    if (!cidades.includes(casa.cidade)) cidades.push(casa.cidade);
    vagas = vagas + Math.max(0, casa.capacidade - casa.ocupacao);
  }
  return { casas: casas.length, cidades: cidades.length, vagas };
}
