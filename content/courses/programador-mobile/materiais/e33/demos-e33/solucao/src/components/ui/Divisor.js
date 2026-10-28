import { StyleSheet, View } from 'react-native';
import { useTema } from '../../theme/TemaContext';
import { espaco } from '../../theme/tokens';

export default function Divisor({ style, ...rest }) {
  const { cores } = useTema();
  return <View style={[estilos.divisor, { backgroundColor: cores.borda }, style]} {...rest} />;
}

const estilos = StyleSheet.create({
  divisor: { height: StyleSheet.hairlineWidth, marginVertical: espaco.md },
});
