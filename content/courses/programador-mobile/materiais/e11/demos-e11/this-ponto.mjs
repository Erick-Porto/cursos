// E11 · o this é decidido na hora da chamada. Rode: node this-ponto.mjs
const promocao = {
  nome: 'Semana do Áudio',
  percentual: 10,
  descrever() {
    return `${this.nome}: ${this.percentual}% de desconto`;
  },
};

const semanaDaCasa = { nome: 'Semana da Casa', percentual: 15 };
semanaDaCasa.descrever = promocao.descrever; // a mesma função

console.log(promocao.descrever()); // Semana do Áudio: 10% de desconto
console.log(semanaDaCasa.descrever()); // Semana da Casa: 15% de desconto
console.log(semanaDaCasa.descrever === promocao.descrever); // true: é a mesma função

const descrever = promocao.descrever; // copia só a função
console.log(descrever()); // TypeError: Cannot read properties of undefined (reading 'nome')
