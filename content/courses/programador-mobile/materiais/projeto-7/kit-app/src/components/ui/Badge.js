// Badge: um selo pequeno com texto, pintado na cor do tom.
// Props:
//   texto  o que o selo diz, como 'Lotada' ou '8 vagas'
//   tom    'neutro' (padrão), 'sucesso', 'alerta' ou 'perigo': a variante de cor
//   style  estilo extra
// O selo sempre tem texto: a cor ajuda, mas quem não vê cor também precisa entender.
import { StyleSheet, Text, View } from 'react-native';
import { espaco, fonte, raio, useTema } from '@/theme';

// cada tom aponta para uma cor do tema
const corDoTom = {
  neutro: 'textoSuave',
  sucesso: 'sucesso',
  alerta: 'alerta',
  perigo: 'perigo',
};

export default function Badge({ texto, tom = 'neutro', style }) {
  const { cores } = useTema();
  const fundo = cores[corDoTom[tom]] ?? cores.textoSuave;
  return (
    <View style={[estilos.selo, { backgroundColor: fundo }, style]}>
      <Text style={[estilos.texto, { color: cores.sobreCor }]}>{texto}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  selo: {
    alignSelf: 'flex-start',
    paddingHorizontal: espaco.sm,
    paddingVertical: 2,
    borderRadius: raio.redondo,
  },
  texto: { fontSize: fonte.pequena, fontWeight: 'bold' },
});
