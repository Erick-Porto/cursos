// E07 · aula 13: if e else com o total vindo do terminal.
// Uso: node aviso.mjs 199.9   (teste também 129.8 e 150)

const FRETE_GRATIS_A_PARTIR_DE = 150;

function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const totalDoCarrinho = Number(process.argv[2]);

let aviso;
if (totalDoCarrinho >= FRETE_GRATIS_A_PARTIR_DE) {
  aviso = 'Você ganhou frete grátis';
} else {
  const falta = FRETE_GRATIS_A_PARTIR_DE - totalDoCarrinho;
  aviso = `Faltam ${formatarPreco(falta)} para o frete grátis`;
}

console.log(`Total: ${formatarPreco(totalDoCarrinho)}`);
console.log(aviso);
