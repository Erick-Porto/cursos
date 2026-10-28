import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '../../theme/TemaContext';
import { espaco, familia, fonte, raio } from '../../theme/tokens';

const tamanhos = {
  sm: { altura: 36, padding: espaco.md, fonte: fonte.pequena, icone: 16 },
  md: { altura: 44, padding: espaco.lg, fonte: fonte.corpo, icone: 20 },
  lg: { altura: 56, padding: espaco.xl, fonte: fonte.titulo, icone: 24 },
};

function variantes(cores) {
  return {
    primaria: { fundo: cores.primaria, texto: cores.fundo, borda: cores.primaria },
    secundaria: { fundo: 'transparent', texto: cores.primaria, borda: cores.primaria },
    fantasma: { fundo: 'transparent', texto: cores.primaria, borda: 'transparent' },
  };
}

export default function Botao({
  titulo, onPress, variante = 'primaria', tamanho = 'md',
  icone, desabilitado = false, style, ...rest
}) {
  const { cores } = useTema();
  const v = variantes(cores)[variante];
  const t = tamanhos[tamanho];
  return (
    <Pressable
      onPress={onPress}
      disabled={desabilitado}
      accessibilityRole="button"
      accessibilityState={{ disabled: desabilitado }}
      android_ripple={{ color: cores.borda }}
      style={({ pressed }) => [
        estilos.base,
        { minHeight: t.altura, paddingHorizontal: t.padding },
        { backgroundColor: v.fundo, borderColor: v.borda },
        pressed && estilos.pressionado,
        desabilitado && estilos.desabilitado,
        style,
      ]}
      {...rest}
    >
      {icone ? <Ionicons name={icone} size={t.icone} color={v.texto} /> : null}
      <Text style={[estilos.titulo, { fontSize: t.fonte, color: v.texto }]}>{titulo}</Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: espaco.sm, borderWidth: 1, borderRadius: raio.md,
  },
  pressionado: { opacity: 0.8 },
  desabilitado: { opacity: 0.5 },
  titulo: { fontFamily: familia.negrito },
});
