// =====================================================================
// Datas do kit: prontas para usar. Você não precisa mudar este arquivo.
// Um prazo é sempre um texto no formato 'AAAA-MM-DD', como '2026-11-10'.
// Os exemplos de cada função viram testes em datas.test.js.
// =====================================================================

const UM_DIA = 24 * 60 * 60 * 1000; // um dia, em milissegundos

function soDigitos(texto) {
  for (const letra of texto) {
    if (letra < '0' || letra > '9') return false;
  }
  return true;
}

// Diz se o texto é uma data de verdade no formato 'AAAA-MM-DD'.
//   ehDataValida('2026-11-10') devolve true
//   ehDataValida('10/11/2026') e ehDataValida('2026-02-30') devolvem false
export function ehDataValida(texto) {
  if (typeof texto !== 'string') return false;
  const partes = texto.split('-');
  if (partes.length !== 3) return false;
  const [ano, mes, dia] = partes;
  if (ano.length !== 4 || mes.length !== 2 || dia.length !== 2) return false;
  if (!soDigitos(ano + mes + dia)) return false;
  const data = new Date(Number(ano), Number(mes) - 1, Number(dia));
  return data.getMonth() === Number(mes) - 1 && data.getDate() === Number(dia);
}

// O prazo vira um Date, à meia-noite do dia, no fuso do computador.
// (new Date('2026-11-10') seria a meia-noite de Londres: no Brasil, ainda o dia 9.)
function lerPrazo(prazo) {
  if (!ehDataValida(prazo)) {
    throw new Error(
      `O prazo precisa ser um texto 'AAAA-MM-DD'; chegou ${JSON.stringify(prazo)}.`,
    );
  }
  const [ano, mes, dia] = prazo.split('-');
  return new Date(Number(ano), Number(mes) - 1, Number(dia));
}

// Quantos dias faltam de hoje até o prazo. 0: vence hoje. Negativo: o prazo já passou.
// A hora de hoje não conta: às 23h59 do dia 10, o prazo do dia 11 ainda está a 1 dia.
//   diasAte('2026-11-15', new Date(2026, 10, 10)) devolve 5
//   diasAte('2026-11-07', new Date(2026, 10, 10)) devolve -3
export function diasAte(prazo, hoje) {
  if (!(hoje instanceof Date)) {
    throw new Error(
      `diasAte precisa de hoje, um Date; chegou ${hoje}. Você passou o hoje adiante?`,
    );
  }
  const inicioDeHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  return Math.round((lerPrazo(prazo) - inicioDeHoje) / UM_DIA);
}

// O prazo mais alguns dias, de novo em texto 'AAAA-MM-DD'.
//   somarDias('2026-11-10', 7) devolve '2026-11-17'
//   somarDias('2026-11-28', 7) devolve '2026-12-05'
export function somarDias(prazo, dias) {
  const data = lerPrazo(prazo);
  data.setDate(data.getDate() + dias);
  return paraPrazo(data);
}

// Um Date vira prazo em texto 'AAAA-MM-DD'.
//   paraPrazo(new Date(2026, 10, 10)) devolve '2026-11-10'
export function paraPrazo(data) {
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${data.getFullYear()}-${mes}-${dia}`;
}
