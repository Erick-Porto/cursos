import { produtos } from '../data/produtos.js';
import { aplicarFiltros, rotulosDeOrdem } from '../regras/catalogo.js';
import { formatarPreco } from '../utils/formatar.js';

const ordem = process.argv[2] || 'nome';
const categoria = process.argv[3] || null;

if (rotulosDeOrdem[ordem] === undefined) {
  console.log(`Ordem desconhecida: ${ordem}. Use uma destas:`);
  for (const [valor, rotulo] of Object.entries(rotulosDeOrdem)) {
    console.log(`  ${valor}: ${rotulo}`);
  }
} else {
  console.log(`Vitrine · ${rotulosDeOrdem[ordem]}`);
  for (const p of aplicarFiltros(produtos, { categoria, ordem })) {
    console.log(`  ${p.nome} · ${formatarPreco(p.preco)} · nota ${p.avaliacao}`);
  }
  console.log(`Primeiro do catálogo: ${produtos[0].nome}`);
}
