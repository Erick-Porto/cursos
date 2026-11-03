// Gota: meta de água. Este arquivo é a tela do app: o que aparece no celular.
// Etapa 1 (E29): a sua saudação e a meta do dia.
// Etapa 2 (E30): estilos, a gota no topo e o seu BotaoCopo.
// Etapa 3 (E31): os registros, o total, a lista e o Remover.
import { Text, View } from 'react-native';
import Tela from './src/components/Tela';
// Etapa 2 (E30): o import do seu BotaoCopo e da Linha
// Etapa 3 (E31): o import do useState, da FlatList, do ProgressoMeta, do ItemRegistro, da ListaVazia e do horaAgora

export default function App() {
  // Etapa 3 (E31): o estado dos registros, as funções adicionarCopo e removerRegistro, e o total

  return (
    <Tela>
      <View>
        <Text>Gota</Text>
        <Text>Olá! Troque esta frase pela sua saudação.</Text>
      </View>

      {/* Etapa 1 (E29), sua vez: a meta do dia */}

      {/* Etapa 2 (E30): os três copos, dentro da Linha */}

      {/* Etapa 3 (E31): o título "Registros de hoje" e a lista */}
    </Tela>
  );
}

// Etapa 2 (E30): os estilos do App, com StyleSheet.create, ficam aqui no fim do arquivo
