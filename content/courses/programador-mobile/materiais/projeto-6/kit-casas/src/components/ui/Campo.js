// Campo: rótulo em cima, caixa de texto (TextInput) no meio e mensagem de erro embaixo.
// Props:
//   rotulo  o texto em cima da caixa, como 'Nome da casa' (o leitor de tela também lê)
//   erro    a mensagem de erro (opcional): com ela, a borda fica vermelha e a mensagem aparece embaixo
//   icone   ícone do Ionicons dentro da caixa, à esquerda (opcional), como 'search-outline'
//   style   estilo extra do bloco inteiro
//   ...e qualquer prop do TextInput, que o Campo repassa: value, onChangeText, placeholder,
//   keyboardType, autoCapitalize, maxLength, onBlur...
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { espaco, fonte, raio, useTema } from '@/theme';

export default function Campo({ rotulo, erro, icone, style, ...resto }) {
  const { cores } = useTema();
  return (
    <View style={[estilos.campo, style]}>
      <Text style={[estilos.rotulo, { color: cores.texto }]}>{rotulo}</Text>
      <View
        style={[
          estilos.caixa,
          { backgroundColor: cores.superficie, borderColor: erro ? cores.perigo : cores.borda },
          erro ? estilos.caixaComErro : null,
        ]}
      >
        {icone ? <Ionicons name={icone} size={20} color={cores.textoSuave} /> : null}
        <TextInput
          style={[estilos.entrada, { color: cores.texto }]}
          placeholderTextColor={cores.textoSuave}
          accessibilityLabel={rotulo}
          accessibilityHint={erro || undefined}
          {...resto}
        />
      </View>
      {erro ? (
        <View style={estilos.linhaDoErro}>
          <Ionicons name="alert-circle" size={16} color={cores.perigo} />
          <Text style={[estilos.erro, { color: cores.perigo }]}>{erro}</Text>
        </View>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  campo: { gap: espaco.xs },
  rotulo: { fontSize: fonte.pequena, fontWeight: 'bold' },
  caixa: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.sm,
    paddingHorizontal: espaco.md,
    borderWidth: 1,
    borderRadius: raio.md,
  },
  caixaComErro: { borderWidth: 2 },
  entrada: { flex: 1, fontSize: fonte.corpo, paddingVertical: espaco.sm },
  linhaDoErro: { flexDirection: 'row', alignItems: 'center', gap: espaco.xs },
  erro: { flexShrink: 1, fontSize: fonte.pequena },
});
