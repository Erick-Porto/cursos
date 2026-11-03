// ListaVazia: o aviso de quando nenhuma receita aparece na lista.
//
// Props:
//   busca  o texto que a pessoa buscou, para aparecer na mensagem.
//          Vazio (''), a mensagem não fala de busca.
//
// Uso: <ListaVazia busca={busca} />

function ListaVazia({ busca }) {
  let titulo = 'Nenhuma receita por aqui.'
  if (busca) {
    titulo = `Nenhuma receita encontrada para "${busca}".`
  }

  return (
    <div className="estado">
      <p className="estado__titulo">{titulo}</p>
      <p>Tente outro nome ou apague a busca.</p>
    </div>
  )
}

export default ListaVazia
