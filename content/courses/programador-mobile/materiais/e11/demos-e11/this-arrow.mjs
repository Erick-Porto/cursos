// E11 · arrow dentro do método, nunca como método. Rode: node this-arrow.mjs
import { produtos } from './produtos.mjs';

const promocao = {
  nome: 'Semana do Áudio',
  categoria: 'audio',
  participantesComFunction(lista) {
    return lista.filter(function (produto) {
      return produto.categoria === this.categoria; // o filter chama sem ponto: this é undefined
    });
  },
  participantes(lista) {
    return lista.filter((produto) => produto.categoria === this.categoria); // o this do método
  },
  anunciarComArrow: () => console.log(this.nome), // arrow como método: o this não é a promoção
};

console.log(promocao.participantes(produtos).map((p) => p.nome));
// [ 'Fone Bluetooth', 'Caixa de Som Portátil', 'Microfone USB' ]

try {
  promocao.participantesComFunction(produtos);
} catch (erro) {
  console.log(erro.message); // Cannot read properties of undefined (reading 'categoria')
}

try {
  promocao.anunciarComArrow();
} catch (erro) {
  console.log(erro.message); // Cannot read properties of undefined (reading 'nome')
}
