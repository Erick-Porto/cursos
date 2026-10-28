// E11 · cópia rasa, nível por nível e profunda. Rode: node copias.mjs
const pedido = {
  id: 101,
  criadoEm: new Date('2026-10-28T14:30:00'),
  itens: [{ id: 1, nome: 'Fone Bluetooth', qtd: 1 }],
  entrega: { cep: '01310-100', prazo: 5 },
};

const rasa = { ...pedido };
console.log(rasa === pedido, rasa.entrega === pedido.entrega); // false true

const atualizado = { ...pedido, entrega: { ...pedido.entrega, prazo: 2 } };
console.log(atualizado.entrega === pedido.entrega, atualizado.itens === pedido.itens); // false true

const clone = structuredClone(pedido);
console.log(clone.entrega === pedido.entrega, clone.criadoEm instanceof Date); // false true

const viaJson = JSON.parse(JSON.stringify(pedido));
console.log(typeof viaJson.criadoEm, viaJson.criadoEm); // string 2026-10-28T17:30:00.000Z (em UTC)

const promocao = { nome: 'Semana do Áudio', anunciar() {} };
try {
  structuredClone(promocao);
} catch (erro) {
  console.log(erro.name); // DataCloneError: funções não são copiadas
}
console.log(JSON.stringify(promocao)); // {"nome":"Semana do Áudio"}: o JSON perde o método em silêncio
