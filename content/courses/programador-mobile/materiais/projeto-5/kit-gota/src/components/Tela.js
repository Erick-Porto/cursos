// Tela: o fundo do app, longe do entalhe (notch) e da barra de status do celular.
// As peças de dentro ficam uma embaixo da outra, com um espaço entre elas.
// Props:
//   children: tudo o que você puser entre <Tela> e </Tela>
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { cores, espacos } from '../tema';

export default function Tela({ children }) {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={estilos.area}>
        <View style={estilos.conteudo}>{children}</View>
        <StatusBar style="dark" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const estilos = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    flex: 1,
    padding: espacos.grande,
    gap: espacos.grande,
  },
});
