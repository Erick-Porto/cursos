// Rodape: o fim da página, com quem fez o app e de onde vêm as receitas.
//
// Props:
//   autor  (opcional) o seu nome, um texto. Sem ela, aparece "Seu nome aqui".
//
// Uso: <Rodape autor="Ana Souza" />

function Rodape({ autor = 'Seu nome aqui' }) {
  return (
    <footer className="rodape">
      <div className="rodape__dentro">
        <p>Feito por {autor} no curso Programador Mobile.</p>
        <p>
          Receitas e fotos: <a href="https://dummyjson.com/docs/recipes">DummyJSON</a>
        </p>
      </div>
    </footer>
  )
}

export default Rodape
