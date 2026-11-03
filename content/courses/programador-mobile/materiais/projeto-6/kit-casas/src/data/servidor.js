// Um servidor de mentira: guarda as casas na memória e responde com atraso, como uma API de verdade.
// Quem usa estas funções é o CasasProvider (src/data/CasasContext.js); as telas usam o useCasas().
//
//   carregarCasas()   devolve uma Promise com a lista de casas, depois de "simulacao.atraso" milissegundos
//   salvarCasa(dados) guarda uma casa nova e devolve a casa com o id que ela ganhou
//
// As casas cadastradas somem quando o app recarrega: tudo fica na memória.
import { casas as casasIniciais } from './casas';

// Para testar as telas de espera, de erro e de lista vazia (E39), troque os valores e salve:
export const simulacao = {
  atraso: 800, // quanto o servidor demora para responder, em milissegundos
  falhas: 0, // quantas buscas seguidas dão erro: com 1, a primeira falha e a segunda funciona
  vazio: false, // true: o servidor responde com a lista vazia
};

// os campos que a casa nova ganha quando o formulário não manda
const CASA_EM_BRANCO = {
  nome: '',
  bairro: '',
  cidade: '',
  endereco: '',
  responsavel: '',
  telefone: '',
  aceita: 'Cães e gatos',
  capacidade: 0,
  ocupacao: 0,
  visitas: '',
  descricao: '',
  foto: '',
};

let casasGuardadas = [...casasIniciais];
let proximoId = casasIniciais.length + 1;
let falhasQueFaltam = simulacao.falhas;

function esperar(milissegundos) {
  return new Promise((resolve) => setTimeout(resolve, milissegundos));
}

export async function carregarCasas() {
  await esperar(simulacao.atraso);
  if (falhasQueFaltam > 0) {
    falhasQueFaltam = falhasQueFaltam - 1;
    throw new Error('Não foi possível falar com o servidor. Confira a internet e tente de novo.');
  }
  if (simulacao.vazio) return [];
  return [...casasGuardadas];
}

export function salvarCasa(dados) {
  const nova = { ...CASA_EM_BRANCO, ...dados, id: proximoId };
  proximoId = proximoId + 1;
  casasGuardadas = [nova, ...casasGuardadas];
  return nova;
}
