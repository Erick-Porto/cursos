// Carregando: o aviso que aparece enquanto as receitas não chegam da API.
//
// Props: nenhuma.
//
// Uso: <Carregando />

function Carregando() {
  return (
    <div className="estado" role="status">
      <span className="estado__girando" aria-hidden="true"></span>
      <p className="estado__titulo">Carregando receitas...</p>
    </div>
  )
}

export default Carregando
