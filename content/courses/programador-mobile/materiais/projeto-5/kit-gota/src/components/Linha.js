// Linha: põe as peças lado a lado, com o mesmo espaço entre elas.
// Props:
//   children: as peças que você puser entre <Linha> e </Linha>
// Exemplo: <Linha><BotaoCopo ml={200} /><BotaoCopo ml={300} /></Linha>
import { StyleSheet, View } from 'react-native';

export default function Linha({ children }) {
  return <View style={estilos.linha}>{children}</View>;
}

const estilos = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
