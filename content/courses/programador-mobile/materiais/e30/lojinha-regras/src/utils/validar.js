const CEP = /^\d{5}-?\d{3}$/;
const CPF = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;

// conferem só o formato: um CPF com formato certo ainda pode não existir
export function ehCepValido(texto) {
  return CEP.test(texto.trim());
}

export function ehCpfValido(texto) {
  return CPF.test(texto.trim());
}

export function mascararCep(texto) {
  const d = texto.replace(/\D/g, '').slice(0, 8);
  return d.replace(/^(\d{5})(\d)/, '$1-$2');
}

export function mascararTelefone(texto) {
  const d = texto.replace(/\D/g, '').slice(0, 11);
  return d
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}

export function mascararCpf(texto) {
  const d = texto.replace(/\D/g, '').slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
}

export function semAcentos(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '');
}
