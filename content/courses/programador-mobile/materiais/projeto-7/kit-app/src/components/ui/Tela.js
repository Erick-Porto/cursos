// Tela: o chão de cada tela, com o fundo do tema e a área segura (longe do notch e da barra de status).
// Props:
//   children      o conteúdo da tela
//   rolar         true: o conteúdo rola (fica num ScrollView). Com FlatList, deixe sem rolar
//   comCabecalho  true nas telas que a pilha abre com cabeçalho (Detalhe, Cadastro): o cabeçalho
//                 já protege o topo, então a Tela protege só as laterais e a parte de baixo
//   style         estilo extra para o conteúdo
// A Tela já põe padding de 16 (espaco.md) e gap de 16 entre os blocos e, em tela larga,
// centraliza o conteúdo com até 960 de largura. Com rolar, o teclado não cobre os campos.
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { espaco, useTema } from '@/theme';

export default function Tela({ children, rolar = false, comCabecalho = false, style }) {
  const { cores } = useTema();
  const bordas = comCabecalho ? ['left', 'right', 'bottom'] : ['top', 'left', 'right'];

  return (
    <SafeAreaView edges={bordas} style={[estilos.tela, { backgroundColor: cores.fundo }]}>
      {rolar ? (
        <KeyboardAvoidingView behavior="padding" style={estilos.tela}>
          <ScrollView
            contentContainerStyle={[estilos.conteudo, estilos.rolando, style]}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        <View style={[estilos.tela, estilos.conteudo, style]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1 },
  conteudo: {
    width: '100%',
    maxWidth: 960,
    alignSelf: 'center',
    padding: espaco.md,
    gap: espaco.md,
  },
  rolando: { paddingBottom: espaco.xl },
});
