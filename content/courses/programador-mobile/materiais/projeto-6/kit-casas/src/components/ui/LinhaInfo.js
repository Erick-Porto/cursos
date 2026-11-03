// LinhaInfo: uma linha com ícone e texto, para dados como endereço, telefone e horário.
// Props:
//   icone  nome de um ícone do Ionicons, como 'call-outline'
//   texto  o texto da linha. Sem texto (''), a linha não aparece
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { espaco, fonte, useTema } from '@/theme';

export default function LinhaInfo({ icone, texto }) {
  const { cores } = useTema();
  if (!texto) return null;
  return (
    <View style={estilos.linha}>
      <Ionicons name={icone} size={20} color={cores.primaria} />
      <Text style={[estilos.texto, { color: cores.texto }]}>{texto}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  linha: { minHeight: 32, flexDirection: 'row', alignItems: 'center', gap: espaco.sm },
  texto: { flex: 1, fontSize: fonte.corpo },
});
