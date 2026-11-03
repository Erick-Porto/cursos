// A lista de casas, compartilhada por todas as telas (o mesmo "quadro de avisos" do tema).
// O CasasProvider fica em app/_layout.js e busca as casas no servidor quando o app abre.
// Em qualquer tela:
//   const { casas, carregando, atualizando, erro, recarregar, adicionarCasa } = useCasas();
//   casas              a lista de casas (vazia até a primeira resposta do servidor)
//   carregando         true enquanto espera a lista sem nada na tela (ao abrir o app ou ao tentar de novo)
//   atualizando        true enquanto busca de novo com a lista já na tela (puxar para atualizar)
//   erro               a mensagem de erro, ou null quando deu certo
//   recarregar()       busca a lista de novo no servidor
//   adicionarCasa(dados) cadastra uma casa nova no começo da lista e devolve a casa, já com id
import { createContext, useContext, useEffect, useState } from 'react';
import { carregarCasas, salvarCasa } from './servidor';

const CasasContext = createContext(null);

export function CasasProvider({ children }) {
  const [casas, setCasas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState(null);

  async function buscar() {
    try {
      const lista = await carregarCasas();
      setCasas(lista);
      setErro(null);
    } catch (problema) {
      setErro(problema.message);
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }

  // ao abrir o app: a primeira busca
  useEffect(() => {
    buscar();
  }, []);

  function recarregar() {
    // sem lista na tela (ou depois de um erro), a espera é de tela cheia; com lista, é a rodinha da lista
    if (casas.length === 0 || erro) {
      setCarregando(true);
    } else {
      setAtualizando(true);
    }
    return buscar();
  }

  function adicionarCasa(dados) {
    const nova = salvarCasa(dados);
    setCasas([nova, ...casas]);
    return nova;
  }

  const valor = { casas, carregando, atualizando, erro, recarregar, adicionarCasa };
  return <CasasContext.Provider value={valor}>{children}</CasasContext.Provider>;
}

export function useCasas() {
  const valor = useContext(CasasContext);
  if (!valor) throw new Error('useCasas só funciona dentro do CasasProvider (veja app/_layout.js)');
  return valor;
}
