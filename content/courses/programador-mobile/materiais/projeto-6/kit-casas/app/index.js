// Tela Início: a primeira tela do app (a rota "/", por isso o arquivo se chama index.js).
// Onde cada etapa entra:
//   E33 (etapa 1)  troque a View pela Tela do kit e monte o topo, os números e os cartões
//   E34 (etapa 2)  tokens no StyleSheet, cores do useTema() e o botão de tema
//   E35 (etapa 3)  os cartões viram o seu componente CartaoCasa
//   E36 (etapa 4)  FlatList, busca, lista vazia e puxar para atualizar
//   E37 (etapa 5)  o toque no cartão abre o Detalhe; este arquivo vai para app/(abas)/
//   E38 (etapa 6)  o botão Cadastrar casa
//   E39 (etapa 7)  carregando, erro, acessibilidade e duas colunas em tela larga
import { StyleSheet, Text, View } from 'react-native';

export default function Inicio() {
  return (
    <View style={estilos.tela}>
      <Text style={estilos.titulo}>Casas de adoção</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1 },
  titulo: { fontSize: 24, fontWeight: 'bold' },
});
