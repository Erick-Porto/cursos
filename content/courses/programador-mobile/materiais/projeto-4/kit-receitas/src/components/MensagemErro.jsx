// MensagemErro: a caixa vermelha que avisa que algo deu errado.
//
// Props:
//   texto  a mensagem, um texto. Exemplo: 'Não foi possível carregar as receitas.'
//
// Uso: <MensagemErro texto="Não foi possível carregar as receitas." />

function MensagemErro({ texto }) {
  return (
    <div className="estado estado--erro" role="alert">
      <p className="estado__titulo">{texto}</p>
      <p>Confira a internet e aperte F5 para tentar de novo.</p>
    </div>
  )
}

export default MensagemErro
