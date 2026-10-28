import { textoDoStatus, tomDoStatus } from '../regras/pedido.js';

const pedidos = [
  { id: 1041, status: 'entregue' },
  { id: 1042, status: 'enviado' },
  { id: 1043, status: 'pendente' },
  { id: 1044, status: 'devolvido' },
];

for (const pedido of pedidos) {
  const texto = textoDoStatus(pedido.status);
  console.log(`#${pedido.id}  ${texto}  [${tomDoStatus(pedido.status)}]`);
}
