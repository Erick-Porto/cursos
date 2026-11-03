// App.jsx: a tela do Livro de Receitas. É aqui que você trabalha.
//
// Etapa 1 (E24): troque o aviso pelo seu CartaoReceita, dentro de <div className="grade">.
// Etapa 2 (E25): o seu nome no Rodape e a lista das receitas, com map.
// Etapa 3 (E26): a busca, com o CampoBusca, e as favoritas.
// Etapa 4 (E27): as receitas da API, com Carregando e MensagemErro.
import Cabecalho from './components/Cabecalho.jsx'
import Rodape from './components/Rodape.jsx'

function App() {
  return (
    <>
      <Cabecalho />
      <main className="conteudo">
        <p className="aviso">O seu cartão de receita aparece aqui.</p>
      </main>
      <Rodape />
    </>
  )
}

export default App
