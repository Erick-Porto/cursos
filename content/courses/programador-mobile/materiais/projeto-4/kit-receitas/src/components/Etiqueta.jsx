// Etiqueta: a etiqueta colorida com a dificuldade da receita, em português.
//
// Props:
//   dificuldade  'Easy', 'Medium' ou 'Hard', como vem da API.
//                Mostra Fácil (verde), Média (amarela) ou Difícil (vermelha).
//
// Uso: <Etiqueta dificuldade="Easy" />  ou  <Etiqueta dificuldade={dificuldade} />

const NOMES = {
  Easy: 'Fácil',
  Medium: 'Média',
  Hard: 'Difícil',
}

const CORES = {
  Easy: 'etiqueta--facil',
  Medium: 'etiqueta--media',
  Hard: 'etiqueta--dificil',
}

function Etiqueta({ dificuldade }) {
  const nome = NOMES[dificuldade] ?? dificuldade
  const cor = CORES[dificuldade] ?? ''

  return <span className={`etiqueta ${cor}`}>{nome}</span>
}

export default Etiqueta
