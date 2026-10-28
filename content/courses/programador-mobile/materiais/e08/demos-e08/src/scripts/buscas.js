import { registrarBusca } from '../regras/historico.js';

let historico = [];
for (const termo of process.argv.slice(2)) {
  historico = registrarBusca(historico, termo);
  console.log(`"${termo}" -> ${historico.join(', ')}`);
}
