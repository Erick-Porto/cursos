// EstadoVazio: o aviso de "não tem nada aqui", com ícone, título, mensagem e uma ação opcional.
// Props:
//   titulo     a frase principal, como 'Nenhuma casa encontrada'
//   mensagem   uma explicação curta (opcional)
//   icone      nome de um ícone do Ionicons (padrão 'paw-outline')
//   textoAcao  o texto de um botão (opcional), como 'Limpar busca'
//   onAcao     o que o botão faz (o botão só aparece com textoAcao e onAcao)
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { espaco, fonte, useTema } from '@/theme';
import Botao from './Botao';

export default function EstadoVazio({ titulo, mensagem, icone = 'paw-outline', textoAcao, onAcao }) {
  const { cores } = useTema();
  return (
    <View style={estilos.estado}>
      <Ionicons name={icone} size={56} color={cores.textoSuave} />
      <Text accessibilityRole="header" style={[estilos.titulo, { color: cores.texto }]}>
        {titulo}
      </Text>
      {mensagem ? (
        <Text style={[estilos.mensagem, { color: cores.textoSuave }]}>{mensagem}</Text>
      ) : null}
      {textoAcao && onAcao ? (
        <Botao titulo={textoAcao} variante="secundaria" onPress={onAcao} />
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  estado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaco.sm,
    padding: espaco.xl,
  },
  titulo: { fontSize: fonte.subtitulo, fontWeight: 'bold', textAlign: 'center' },
  mensagem: { fontSize: fonte.corpo, textAlign: 'center' },
});
