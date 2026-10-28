import { StyleSheet, Text, View } from 'react-native';
import { useTema } from '../../theme/TemaContext';
import { familia, espaco, fonte, raio } from '../../theme/tokens';

export default function Cartao({ children, style, ...rest }) {
  const { cores } = useTema();
  return (
    <View
      style={[estilos.cartao, { backgroundColor: cores.superficie, borderColor: cores.borda }, style]}
      {...rest}
    >
      {children}
    </View>
  );
}

function Cabecalho({ titulo, children }) {
  const { cores } = useTema();
  return (
    <View style={estilos.cabecalho}>
      <Text style={[estilos.titulo, { color: cores.texto }]}>{titulo}</Text>
      {children}
    </View>
  );
}

const Corpo = ({ children, style }) => <View style={[estilos.corpo, style]}>{children}</View>;

Cartao.Cabecalho = Cabecalho;
Cartao.Corpo = Corpo;

const estilos = StyleSheet.create({
  cartao: { padding: espaco.md, borderRadius: raio.md, borderWidth: 1 },
  cabecalho: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: espaco.sm,
  },
  titulo: { fontSize: fonte.titulo, fontFamily: familia.negrito },
  corpo: { gap: espaco.sm },
});
