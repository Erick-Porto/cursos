// ItemRegistro: um copo da lista, com os ml, a hora e o botão Remover.
// Props:
//   ml: quantos ml tinha o copo (número)
//   hora: a hora do registro, como texto ('14:05')
//   aoRemover: a função que roda quando a pessoa toca em Remover
// Exemplo: <ItemRegistro ml={300} hora="14:05" aoRemover={() => console.log('remover')} />
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { cantos, cores, espacos } from '../tema';

export default function ItemRegistro({ ml, hora, aoRemover }) {
  return (
    <View style={estilos.item}>
      <View>
        <Text style={estilos.ml}>{ml} ml</Text>
        <Text style={estilos.hora}>às {hora}</Text>
      </View>
      <Pressable style={estilos.remover} onPress={aoRemover}>
        <Text style={estilos.textoRemover}>Remover</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: cores.cartao,
    borderRadius: cantos.pequeno,
    padding: espacos.grande,
    marginBottom: espacos.medio,
  },
  ml: {
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.texto,
  },
  hora: {
    fontSize: 14,
    color: cores.textoFraco,
  },
  remover: {
    borderWidth: 1,
    borderColor: cores.perigo,
    borderRadius: cantos.pequeno,
    paddingVertical: espacos.medio,
    paddingHorizontal: espacos.grande,
  },
  textoRemover: {
    color: cores.perigo,
    fontWeight: 'bold',
  },
});
