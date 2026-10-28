import fs from 'node:fs';
import { categorias, produtos } from '../data/produtos.js';

const catalogo = { categorias, produtos };
const texto = JSON.stringify(catalogo, null, 2);
fs.writeFileSync('src/data/catalogo.json', texto);

console.log('catalogo.json gravado com', produtos.length, 'produtos');
