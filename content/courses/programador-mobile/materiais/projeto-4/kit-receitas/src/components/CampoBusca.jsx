// CampoBusca: o campo onde a pessoa digita o nome da receita.
// Ele não guarda o texto: quem guarda é o App, num estado.
//
// Props:
//   valor    o texto que aparece no campo (o estado da busca no App).
//   aoMudar  a função que o campo chama a cada letra, com o texto novo.
//            Se a pessoa digita "piz", o campo chama aoMudar('piz').
//
// Uso: <CampoBusca valor={busca} aoMudar={setBusca} />

function CampoBusca({ valor, aoMudar }) {
  return (
    <div className="busca">
      <label className="busca__rotulo" htmlFor="busca">
        Buscar receita
      </label>
      <input
        id="busca"
        className="busca__campo"
        type="search"
        placeholder="Digite um nome, como pizza"
        value={valor}
        onChange={(evento) => aoMudar(evento.target.value)}
      />
    </div>
  )
}

export default CampoBusca
