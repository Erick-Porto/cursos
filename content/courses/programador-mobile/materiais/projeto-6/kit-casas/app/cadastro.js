// Tela Cadastro: o formulário de uma casa nova (a rota "/cadastro").
// E38 (etapa 6): o formulário entra aqui, no lugar do aviso.
import { EstadoVazio, Tela } from '@/components/ui';

export default function Cadastro() {
  return (
    <Tela comCabecalho>
      <EstadoVazio
        icone="construct-outline"
        titulo="Em construção"
        mensagem="O formulário de cadastro entra aqui no E38."
      />
    </Tela>
  );
}
