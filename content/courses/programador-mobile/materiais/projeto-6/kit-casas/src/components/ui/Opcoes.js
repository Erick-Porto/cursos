// Opcoes: uma fileira de botões para escolher uma opção só, como 'Cães', 'Gatos' ou 'Cães e gatos'.
// Props:
//   rotulo   o texto em cima, como 'A casa aceita'
//   opcoes   a lista de textos das opções: ['Cães', 'Gatos', 'Cães e gatos']
//   valor    a opção escolhida agora ('' quando nenhuma)
//   onMudar  função chamada com a opção tocada, como onMudar('Gatos'): use o set do seu useState
//   erro     a mensagem de erro (opcional), embaixo das opções
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { espaco, fonte, raio, useTema } from '@/theme';

export default function Opcoes({ rotulo, opcoes, valor, onMudar, erro }) {
  const { cores } = useTema();
  return (
    <View style={estilos.bloco}>
      <Text style={[estilos.rotulo, { color: cores.texto }]}>{rotulo}</Text>
      <View style={estilos.fileira} accessibilityRole="radiogroup" accessibilityLabel={rotulo}>
        {opcoes.map((opcao) => {
          const escolhida = opcao === valor;
          return (
            <Pressable
              key={opcao}
              onPress={() => onMudar(opcao)}
              accessibilityRole="radio"
              accessibilityState={{ checked: escolhida }}
              style={({ pressed }) => [
                estilos.opcao,
                {
                  backgroundColor: escolhida ? cores.primaria : cores.superficie,
                  borderColor: escolhida ? cores.primaria : erro ? cores.perigo : cores.borda,
                },
                pressed && estilos.apertado,
              ]}
            >
              {escolhida ? <Ionicons name="checkmark" size={18} color={cores.sobreCor} /> : null}
              <Text style={[estilos.texto, { color: escolhida ? cores.sobreCor : cores.texto }]}>
                {opcao}
              </Text>
            </Pressable>
          );
        })}
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
  bloco: { gap: espaco.xs },
  rotulo: { fontSize: fonte.pequena, fontWeight: 'bold' },
  fileira: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.sm },
  opcao: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.xs,
    paddingHorizontal: espaco.md,
    borderWidth: 1,
    borderRadius: raio.redondo,
  },
  apertado: { opacity: 0.7 },
  texto: { fontSize: fonte.corpo },
  linhaDoErro: { flexDirection: 'row', alignItems: 'center', gap: espaco.xs },
  erro: { flexShrink: 1, fontSize: fonte.pequena },
});
