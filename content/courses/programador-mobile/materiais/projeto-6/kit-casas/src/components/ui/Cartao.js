// Cartao: uma moldura com fundo de superfície, borda fina e cantos arredondados.
// Props:
//   children  o conteúdo do cartão
//   titulo    um título em cima do conteúdo (opcional), como 'Endereço'
//   style     estilo extra, como { flexDirection: 'row' } para pôr o conteúdo em linha
//   ...e props de acessibilidade, como accessible e accessibilityLabel, que o Cartao repassa
// Já vem com padding de 16 e gap de 8 entre os itens de dentro.
import { StyleSheet, Text, View } from 'react-native';
import { espaco, fonte, raio, useTema } from '@/theme';

export default function Cartao({ children, titulo, style, ...resto }) {
  const { cores } = useTema();
  return (
    <View
      style={[estilos.cartao, { backgroundColor: cores.superficie, borderColor: cores.borda }, style]}
      {...resto}
    >
      {titulo ? (
        <Text accessibilityRole="header" style={[estilos.titulo, { color: cores.texto }]}>
          {titulo}
        </Text>
      ) : null}
      {children}
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    padding: espaco.md,
    gap: espaco.sm,
    borderRadius: raio.md,
    borderWidth: 1,
  },
  titulo: { fontSize: fonte.subtitulo, fontWeight: 'bold' },
});
