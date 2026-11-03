// Botao: botão com texto e, se quiser, um ícone na frente.
// Props:
//   titulo        o texto do botão, como 'Salvar'
//   onPress       o que fazer no toque
//   variante      'primaria' (cheio, padrão), 'secundaria' (só o contorno) ou 'perigo' (contorno vermelho)
//   icone         nome de um ícone do Ionicons, como 'add' (opcional)
//   desabilitado  true: o botão fica apagado e não responde ao toque
//   style         estilo extra (margem, largura...)
// Tem altura mínima de 48 (bom alvo para o dedo) e fica mais claro enquanto o dedo aperta.
import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { espaco, fonte, raio, useTema } from '@/theme';

// cada variante escolhe as cores de fundo, texto e borda
function coresDaVariante(cores, variante) {
  const variantes = {
    primaria: { fundo: cores.primaria, texto: cores.sobreCor, borda: cores.primaria },
    secundaria: { fundo: cores.superficie, texto: cores.primaria, borda: cores.primaria },
    perigo: { fundo: cores.superficie, texto: cores.perigo, borda: cores.perigo },
  };
  return variantes[variante] ?? variantes.primaria;
}

export default function Botao({
  titulo,
  onPress,
  variante = 'primaria',
  icone,
  desabilitado = false,
  style,
  ...resto
}) {
  const { cores } = useTema();
  const cor = coresDaVariante(cores, variante);
  return (
    <Pressable
      onPress={onPress}
      disabled={desabilitado}
      accessibilityRole="button"
      accessibilityState={{ disabled: desabilitado }}
      style={({ pressed }) => [
        estilos.botao,
        { backgroundColor: cor.fundo, borderColor: cor.borda },
        pressed && estilos.apertado,
        desabilitado && estilos.desabilitado,
        style,
      ]}
      {...resto}
    >
      {icone ? <Ionicons name={icone} size={20} color={cor.texto} /> : null}
      <Text style={[estilos.titulo, { color: cor.texto }]}>{titulo}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  botao: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaco.sm,
    paddingHorizontal: espaco.lg,
    borderWidth: 2,
    borderRadius: raio.md,
  },
  apertado: { opacity: 0.7 },
  desabilitado: { opacity: 0.4 },
  titulo: { fontSize: fonte.corpo, fontWeight: 'bold' },
});
