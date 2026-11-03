// EstadoErro: o aviso de que algo deu errado, com o botão "Tentar de novo".
// Props:
//   mensagem        o que aconteceu, como a mensagem que veio do useCasas()
//   titulo          a frase principal (padrão 'Algo deu errado')
//   onTentarDeNovo  o que o botão faz, como o recarregar do useCasas()
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { espaco, fonte, useTema } from '@/theme';
import Botao from './Botao';

export default function EstadoErro({ mensagem, titulo = 'Algo deu errado', onTentarDeNovo }) {
  const { cores } = useTema();
  return (
    <View style={estilos.estado} accessibilityLiveRegion="polite">
      <Ionicons name="cloud-offline-outline" size={56} color={cores.perigo} />
      <Text accessibilityRole="header" style={[estilos.titulo, { color: cores.texto }]}>
        {titulo}
      </Text>
      {mensagem ? (
        <Text style={[estilos.mensagem, { color: cores.textoSuave }]}>{mensagem}</Text>
      ) : null}
      {onTentarDeNovo ? (
        <Botao titulo="Tentar de novo" icone="refresh" onPress={onTentarDeNovo} />
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  estado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaco.sm,
    padding: espaco.xl,
  },
  titulo: { fontSize: fonte.subtitulo, fontWeight: 'bold', textAlign: 'center' },
  mensagem: { fontSize: fonte.corpo, textAlign: 'center' },
});
