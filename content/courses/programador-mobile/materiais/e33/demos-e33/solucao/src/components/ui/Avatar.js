import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useTema } from '../../theme/TemaContext';
import { familia } from '../../theme/tokens';

const medidas = { sm: 32, md: 48, lg: 72 };

function iniciais(nome) {
  return nome.split(' ').filter(Boolean).slice(0, 2)
    .map((parte) => parte[0].toUpperCase()).join('');
}

export default function Avatar({ uri, nome = '', tamanho = 'md', style, ...rest }) {
  const { cores } = useTema();
  const lado = medidas[tamanho];
  const forma = { width: lado, height: lado, borderRadius: lado / 2 };
  if (uri) {
    return (
      <Image source={{ uri }} style={[forma, style]} contentFit="cover"
        accessibilityLabel={nome} {...rest} />
    );
  }
  return (
    <View style={[estilos.iniciais, forma, { backgroundColor: cores.primaria }, style]} {...rest}>
      <Text style={[estilos.texto, { color: cores.fundo, fontSize: lado * 0.4 }]}>
        {iniciais(nome)}
      </Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  iniciais: { alignItems: 'center', justifyContent: 'center' },
  texto: { fontFamily: familia.negrito },
});
