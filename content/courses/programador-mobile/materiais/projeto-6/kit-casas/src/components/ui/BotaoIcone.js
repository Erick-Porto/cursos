// BotaoIcone: botão só com um ícone, redondo, num alvo de 48 por 48 (bom para o dedo).
// Props:
//   icone    nome de um ícone do Ionicons, como 'moon-outline'
//   rotulo   o que o leitor de tela fala, como 'Usar tema escuro' (obrigatório: um ícone sozinho não diz nada)
//   onPress  o que fazer no toque
//   cor      cor do ícone (opcional; o padrão é cores.texto)
//   style    estilo extra
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { raio, useTema } from '@/theme';

export default function BotaoIcone({ icone, rotulo, onPress, cor, style }) {
  const { cores } = useTema();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      style={({ pressed }) => [
        estilos.botao,
        { backgroundColor: cores.superficie, borderColor: cores.borda },
        pressed && estilos.apertado,
        style,
      ]}
    >
      <Ionicons name={icone} size={24} color={cor ?? cores.texto} />
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  botao: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: raio.redondo,
  },
  apertado: { opacity: 0.6 },
});
