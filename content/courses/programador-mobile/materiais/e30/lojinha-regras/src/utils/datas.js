export function somarDias(data, dias) {
  // a cópia à meia-noite não altera a data recebida e ignora a hora
  const nova = new Date(data.getFullYear(), data.getMonth(), data.getDate());
  nova.setDate(nova.getDate() + dias);
  return nova;
}

const UM_DIA = 24 * 60 * 60 * 1000; // um dia em milissegundos

export function diasEntre(inicio, fim) {
  return Math.round((fim - inicio) / UM_DIA);
}

export function ehDiaUtil(data) {
  const dia = data.getDay(); // 0 = domingo, 6 = sábado
  return dia !== 0 && dia !== 6;
}

// de domingo (0) a sábado (6): quantos dias até o próximo dia útil
const DIAS_ATE_O_PROXIMO_UTIL = [1, 1, 1, 1, 1, 3, 2];

export function proximoDiaUtil(data) {
  return somarDias(data, DIAS_ATE_O_PROXIMO_UTIL[data.getDay()]);
}

// versão pronta: o for repete o bloco diasUteis vezes (você escreve laços no E07)
export function preverEntrega(diasUteis, hoje = new Date()) {
  let data = hoje;
  for (let i = 0; i < diasUteis; i++) {
    data = proximoDiaUtil(data);
  }
  return data;
}

const formatoCurto = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
});

export function formatarData(data) {
  return formatoCurto.format(data);
}
