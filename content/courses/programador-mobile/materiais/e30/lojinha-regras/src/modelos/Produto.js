import { paraCentavos, paraReais, precoComPix } from '../regras/precos.js';
import { formatarPreco } from '../utils/formatar.js';

export default class Produto {
  constructor({
    id, nome, preco, categoria, imagem, descricao,
    destaque = false, avaliacao = 0,
  }) {
    this.id = id;
    this.nome = nome;
    this.preco = preco;
    this.categoria = categoria;
    this.imagem = imagem;
    this.descricao = descricao;
    this.destaque = destaque;
    this.avaliacao = avaliacao;
  }

  static deJSON(obj) {
    if (!obj || typeof obj.preco !== 'number') {
      throw new Error('Produto inválido no JSON');
    }
    return new Produto(obj);
  }

  static listaDeJSON(lista) {
    return lista.map((obj) => Produto.deJSON(obj));
  }

  get precoFormatado() {
    return formatarPreco(this.preco);
  }

  get precoNoPix() {
    return precoComPix(this.preco);
  }

  get emDestaque() {
    return this.destaque || this.avaliacao >= 4.5;
  }

  ehDaCategoria(slug) {
    return this.categoria === slug;
  }

  precoPara(qtd) {
    return paraReais(paraCentavos(this.preco) * qtd);
  }

  toString() {
    return `${this.nome}, ${this.precoFormatado}`;
  }
}
