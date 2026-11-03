// ListaVazia: a mensagem que aparece quando a lista ainda não tem nenhum item.
// Props:
//   texto: a frase que aparece embaixo da gota, por exemplo 'Nenhum copo registrado hoje'
// Exemplo: <ListaVazia texto="Nenhum copo registrado hoje" />
import { Image, StyleSheet, Text, View } from 'react-native';
import { cores, espacos } from '../tema';

export default function ListaVazia({ texto }) {
  return (
    <View style={estilos.vazia}>
      <Image source={require('../../assets/gota.png')} style={estilos.gota} />
      <Text style={estilos.texto}>{texto}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  vazia: {
    alignItems: 'center',
    paddingVertical: espacos.grande,
    gap: espacos.medio,
  },
  gota: {
    width: 40,
    height: 40,
    opacity: 0.35,
  },
  texto: {
    fontSize: 16,
    color: cores.textoFraco,
    textAlign: 'center',
  },
});
