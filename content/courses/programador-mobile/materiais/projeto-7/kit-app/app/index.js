// Tela Início: a primeira tela do app (a rota "/", por isso o arquivo se chama index.js).
// Onde cada etapa entra:
//   E41  este arquivo vai para app/(abas)/ e vira a primeira aba
//   E42  quem ficou com a tela principal troca o aviso "Em construção" pela tela de verdade,
//        montada com as peças de '@/components/ui' e o seu componente
//   E43  os dados passam a vir do quadro de avisos da equipe (useContext)
import { StyleSheet, Text, View } from 'react-native';
import { EstadoVazio, Tela } from '@/components/ui';
import { frase, nomeDoApp } from '@/data/equipe';
import { espaco, fonte, useTema } from '@/theme';

export default function Inicio() {
  const { cores } = useTema();
  return (
    <Tela>
      <View style={estilos.topo}>
        <Text accessibilityRole="header" style={[estilos.titulo, { color: cores.texto }]}>
          {nomeDoApp}
        </Text>
        <Text style={[estilos.frase, { color: cores.textoSuave }]}>{frase}</Text>
      </View>
      <EstadoVazio
        icone="construct-outline"
        titulo="Em construção"
        mensagem="A tela principal do app entra aqui no E42."
      />
    </Tela>
  );
}

const estilos = StyleSheet.create({
  topo: { gap: espaco.xs },
  titulo: { fontSize: fonte.titulo, fontWeight: 'bold' },
  frase: { fontSize: fonte.corpo },
});
