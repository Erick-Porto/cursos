import { ErroDeNegocio } from '../modelos/erros.js';

export const URL_BASE = 'https://dummyjson.com';

export class ApiError extends ErroDeNegocio {
  constructor(status) {
    super(status === 404 ? 'Não encontramos esse produto.' : 'A loja não respondeu. Tente de novo.', 'API_' + status);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function pedir(caminho, opcoes = {}) {
  let resposta;
  try {
    resposta = await fetch(URL_BASE + caminho, {
      ...opcoes,
      headers: { 'Content-Type': 'application/json', ...opcoes.headers },
    });
  } catch (erro) {
    if (erro.name === 'AbortError') throw erro; // cancelado de propósito
    throw new ErroDeNegocio('Sem conexão. Confira a internet e tente de novo.', 'SEM_CONEXAO');
  }
  if (!resposta.ok) throw new ApiError(resposta.status);
  return resposta.json();
}
