// E09 · Bloco 2 (aula 18): imutabilidade, spread e desestruturação.
// Rode com: node demo-imutavel.mjs
// Edite ao vivo: troque a versão do colega pela versão certa e rode de novo.

// Do E05 e do E07, copiadas aqui para a demonstração rodar fora do projeto
function paraCentavos(reais) {
  return Math.round(reais * 100);
}
function paraReais(centavos) {
  return centavos / 100;
}
function subtotal(itens) {
  let centavos = 0;
  for (const item of itens) {
    centavos += paraCentavos(item.preco) * item.qtd;
  }
  return paraReais(centavos);
}
function criarItem(produto, qtd) {
  return { id: produto.id, nome: produto.nome, preco: produto.preco, qtd: qtd };
}

const garrafa = { id: 5, nome: 'Garrafa Térmica', preco: 79.9, categoria: 'casa' };

console.log('--- O carrinho de antes mudou sozinho');
// A versão do colega: muda o array recebido e devolve o mesmo array.
// Ao vivo, troque as duas linhas por: return [...itens, criarItem(produto, 1)];
function adicionarItemDoColega(itens, produto) {
  itens.push(criarItem(produto, 1));
  return itens;
}
const antes = [{ id: 1, nome: 'Fone Bluetooth', preco: 199.9, qtd: 1 }];
const depois = adicionarItemDoColega(antes, garrafa);
console.log(subtotal(antes), subtotal(depois)); // 279.8 279.8
console.log('mesma lista?', antes === depois); // true

console.log('--- Duas variáveis, a mesma lista');
const itens = [{ id: 1, nome: 'Fone Bluetooth', preco: 199.9, qtd: 1 }];
const novo = { id: 4, nome: 'Luminária de Mesa', preco: 89.9, qtd: 1 };
const guardada = itens;
itens.push(novo);
console.log(guardada === itens); // true: mesma caixa, conteúdo trocado
const outra = [...itens, novo];
console.log(guardada === outra); // false: caixa nova

console.log('--- Spread em objetos: o que vem depois vence');
const item = { id: 1, nome: 'Fone Bluetooth', qtd: 2 };
console.log({ ...item, qtd: 3 }); // qtd: 3
console.log({ qtd: 3, ...item }); // qtd: 2
const filtros = { categoria: 'audio', ordem: 'nome' };
console.log({ ordem: 'preco' }); // a categoria sumiu
console.log({ ...filtros, ordem: 'preco' }); // a categoria continua
console.log({ ...garrafa, qtd: 1 }); // com categoria: campo que o carrinho não guarda
console.log(criarItem(garrafa, 1)); // o formato do carrinho

console.log('--- Cópia rasa');
const pedido = { id: 104, status: 'pago', entrega: { cep: '01310-100', numero: '200' } };
const copia = { ...pedido };
copia.status = 'enviado';
copia.entrega.numero = '210';
console.log(pedido.status, pedido.entrega.numero); // pago 210
const pedido2 = { id: 105, status: 'pago', entrega: { cep: '01310-100', numero: '200' } };
const corrigido = { ...pedido2, entrega: { ...pedido2.entrega, numero: '210' } };
console.log(pedido2.entrega.numero, corrigido.entrega.numero); // 200 210

console.log('--- Pense: [...itens] copia só a lista');
function alterarQuantidadeQuebrada(itens, id, qtd) {
  const copia = [...itens];
  const item = copia.find((i) => i.id === id);
  item.qtd = qtd;
  return copia;
}
const carrinho = [{ id: 1, nome: 'Fone Bluetooth', preco: 199.9, qtd: 1 }];
alterarQuantidadeQuebrada(carrinho, 1, 3);
console.log('original:', carrinho[0].qtd); // 3: o original mudou

console.log('--- As regras do carrinho sem mutar');
function removerItem(itens, id) {
  return itens.filter((item) => item.id !== id);
}
function alterarQuantidade(itens, id, qtd) {
  if (qtd <= 0) {
    return removerItem(itens, id);
  }
  return itens.map((item) => {
    if (item.id === id) {
      return { ...item, qtd };
    }
    return item;
  });
}
function adicionarItem(itens, produto) {
  const existente = itens.find((item) => item.id === produto.id);
  if (existente !== undefined) {
    return alterarQuantidade(itens, produto.id, existente.qtd + 1);
  }
  return [...itens, criarItem(produto, 1)];
}
const antes2 = [{ id: 1, nome: 'Fone Bluetooth', preco: 199.9, qtd: 1 }];
const depois2 = adicionarItem(antes2, garrafa);
console.log(subtotal(antes2), subtotal(depois2)); // 199.9 279.8
const mais = adicionarItem(depois2, garrafa);
console.log(depois2[1].qtd, mais[1].qtd); // 1 2

console.log('--- Desestruturação');
const produto = { id: 1, nome: 'Fone Bluetooth', preco: 199.9, categoria: 'audio' };
const { nome: titulo, qtd = 1 } = produto;
console.log(titulo, qtd); // Fone Bluetooth 1
const [ano, mes] = '2026-10'.split('-');
console.log(ano, mes); // '2026' '10'
function mostrarFiltros(lista, { categoria, ordem = 'nome' } = {}) {
  console.log(lista.length, 'produtos, categoria:', categoria, 'ordem:', ordem);
}
mostrarFiltros([produto], { categoria: 'audio' }); // ordem: nome
mostrarFiltros([produto]); // categoria: undefined, ordem: nome

console.log('--- Rest');
const { id, ...semId } = produto;
console.log(id, semId);
const historico = ['fone', 'garrafa', 'tênis'];
const [maisRecente, ...anteriores] = historico;
console.log(maisRecente, anteriores);

console.log('--- flatMap');
const pedidos = [
  { id: 101, status: 'entregue', itens: [{ nome: 'Fone Bluetooth' }, { nome: 'Garrafa Térmica' }] },
  { id: 102, status: 'cancelado', itens: [{ nome: 'Jogo de Panelas' }] },
  { id: 103, status: 'enviado', itens: [{ nome: 'Tênis de Corrida' }] },
];
console.log(pedidos.map((p) => p.itens)); // array de arrays
console.log(pedidos.flatMap((p) => p.itens)); // um array só
console.log(pedidos.flatMap((p) => {
  if (p.status === 'cancelado') {
    return [];
  }
  return p.itens;
}));
