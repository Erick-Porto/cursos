// npm run agenda: mostra a agenda no terminal.
import { contatos } from '../data/contatos.js';

console.log(`Agenda: ${contatos.length} contatos`);

for (const contato of contatos) {
  console.log(contato.nome);
}
