// horaAgora(): devolve a hora deste momento como texto, no formato '08:05'.
// Exemplo: às 8h05, horaAgora() devolve '08:05'. Usa o Date e o padStart do curso.

export function horaAgora() {
  const agora = new Date();
  const horas = String(agora.getHours()).padStart(2, '0');
  const minutos = String(agora.getMinutes()).padStart(2, '0');
  return `${horas}:${minutos}`;
}
