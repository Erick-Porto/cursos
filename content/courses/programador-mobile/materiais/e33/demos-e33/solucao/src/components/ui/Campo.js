import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useTema } from '../../theme/TemaContext';
import { familia, espaco, fonte, raio } from '../../theme/tokens';

export default function Campo({ rotulo, style, ...rest }) {
  const { cores } = useTema();
  return (
    <View style={[estilos.campo, style]}>
      <Text style={[estilos.rotulo, { color: cores.textoSuave }]}>{rotulo}</Text>
      <TextInput
        style={[estilos.entrada, { color: cores.texto, borderColor: cores.borda, backgroundColor: cores.superficie }]}
        placeholderTextColor={cores.textoSuave}
        accessibilityLabel={rotulo}
        {...rest}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  campo: { gap: espaco.xs },
  rotulo: { fontSize: fonte.pequena, fontFamily: familia.negrito },
  entrada: {
    minHeight: 44, paddingHorizontal: espaco.md, borderWidth: 1, borderRadius: raio.md,
    fontSize: fonte.corpo, fontFamily: familia.regular,
  },
});
