// Duas funções de texto que vêm prontas no kit. Elas não sabem nada de contatos:
// servem para qualquer texto. As suas regras importam daqui quando precisam.

// Só os algarismos do texto: soDigitos('(11) 98765-4321') dá '11987654321'.
// O for...of percorre o texto letra por letra; fica só o que é algarismo.
export function soDigitos(texto) {
  let digitos = '';
  for (const letra of texto) {
    if ('0123456789'.includes(letra)) {
      digitos = digitos + letra;
    }
  }
  return digitos;
}

// As letras com acento que podem abrir um nome, cada uma com a sua versão sem acento.
const SEM_ACENTO = {
  Á: 'A',
  À: 'A',
  Â: 'A',
  Ã: 'A',
  É: 'E',
  Ê: 'E',
  Í: 'I',
  Ó: 'O',
  Ô: 'O',
  Õ: 'O',
  Ú: 'U',
  Ç: 'C',
};

// A primeira letra do nome, maiúscula e sem acento: inicial('Álvaro Mendes') dá 'A'.
export function inicial(nome) {
  const letra = nome.trim()[0].toUpperCase();
  if (SEM_ACENTO[letra] !== undefined) {
    return SEM_ACENTO[letra];
  }
  return letra;
}
