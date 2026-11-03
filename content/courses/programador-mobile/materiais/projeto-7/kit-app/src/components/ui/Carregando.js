// Carregando: a rodinha de espera com um texto, no meio da tela.
// Props:
//   texto  o que o app está fazendo (padrão 'Carregando...'), como 'Buscando as casas...'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { espaco, fonte, useTema } from '@/theme';

export default function Carregando({ texto = 'Carregando...' }) {
  const { cores } = useTema();
  return (
    <View style={estilos.estado} accessible accessibilityLabel={texto}>
      <ActivityIndicator size="large" color={cores.primaria} />
      <Text style={[estilos.texto, { color: cores.textoSuave }]}>{texto}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  estado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaco.md,
    padding: espaco.xl,
  },
  texto: { fontSize: fonte.corpo, textAlign: 'center' },
});
