import { StyleSheet, Text, View } from 'react-native';
import { useTema } from '../../theme/TemaContext';
import { familia, espaco, fonte, raio } from '../../theme/tokens';

// os mesmos tons que o tomDoStatus do E13 devolve
const corDoTom = { neutro: 'textoSuave', sucesso: 'sucesso', alerta: 'alerta', perigo: 'perigo' };

export default function Badge({ texto, tom = 'neutro', style, ...rest }) {
  const { cores } = useTema();
  const cor = cores[corDoTom[tom]];
  return (
    <View style={[estilos.badge, { borderColor: cor }, style]} {...rest}>
      <Text style={[estilos.texto, { color: cor }]}>{texto}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start', borderWidth: 1, borderRadius: raio.sm,
    paddingHorizontal: espaco.sm, paddingVertical: espaco.xs,
  },
  texto: { fontSize: fonte.pequena, fontFamily: familia.negrito },
});
