// Cabecalho: o topo da página, com o nome do app.
//
// Props:
//   totalFavoritas  (opcional) quantas receitas estão favoritas, um número.
//                   Sem ela, o contador não aparece.
//
// Uso: <Cabecalho />  ou  <Cabecalho totalFavoritas={2} />

function textoDasFavoritas(total) {
  if (total === 0) {
    return 'Nenhuma favorita'
  }
  if (total === 1) {
    return '1 favorita'
  }
  return `${total} favoritas`
}

function Cabecalho({ totalFavoritas }) {
  let contador = null
  if (totalFavoritas !== undefined) {
    contador = <p className="cabecalho__contador">{textoDasFavoritas(totalFavoritas)}</p>
  }

  return (
    <header className="cabecalho">
      <div className="cabecalho__dentro">
        <div className="cabecalho__marca">
          <svg
            className="cabecalho__icone"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 12h18" />
            <path d="M19 12v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6" />
            <path d="M8 8.5c0-1.5 1.5-1.5 1.5-3M12 8.5c0-1.5 1.5-1.5 1.5-3M16 8.5c0-1.5 1.5-1.5 1.5-3" />
          </svg>
          <div>
            <h1 className="cabecalho__titulo">Livro de Receitas</h1>
            <p className="cabecalho__frase">Receitas do mundo para cozinhar em casa</p>
          </div>
        </div>
        {contador}
      </div>
    </header>
  )
}

export default Cabecalho
