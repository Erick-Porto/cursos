// Esqueleto da Galeria do E33: copie para src/telas/Galeria.js da sua lojinha.
// Ele roda antes de o kit existir. Descomente cada import quando a peça estiver pronta;
// aos 45 minutos, troque os seis imports por um só, vindo do índice:
// import { Avatar, Badge, Botao, Campo, Cartao, Divisor } from '../components/ui';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
// import Avatar from '../components/ui/Avatar';
// import Badge from '../components/ui/Badge';
// import Botao from '../components/ui/Botao';
// import Campo from '../components/ui/Campo';
// import Cartao from '../components/ui/Cartao';
// import Divisor from '../components/ui/Divisor';
import { useTema } from '../theme/TemaContext';
import { familia, espaco, fonte } from '../theme/tokens';

// os nomes das chaves dos mapas do Botao: a grade 3 por 3 nasce deles
const variantes = ['primaria', 'secundaria', 'fantasma'];
const tamanhos = ['sm', 'md', 'lg'];

// Título e conteúdo de cada seção; só existe nesta tela
function Secao({ titulo, children }) {
  const { cores } = useTema();
  return (
    <View style={estilos.secao}>
      <Text style={[estilos.tituloSecao, { color: cores.texto }]}>{titulo}</Text>
      <View style={estilos.linha}>{children}</View>
    </View>
  );
}

export default function Galeria() {
  const { cores, escuro } = useTema();
  return (
    <SafeAreaView style={[estilos.tela, { backgroundColor: cores.fundo }]}>
      <StatusBar style={escuro ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <Secao titulo="Galeria do kit">
          <Text style={{ color: cores.textoSuave }}>
            {variantes.length} variantes e {tamanhos.length} tamanhos de Botao
          </Text>
        </Secao>
        {/* 1. no topo, um Botao secundário que chama alternarTema (pegue-o do useTema) */}
        {/* 2. a grade: variantes.map com uma Secao por variante e, dentro, tamanhos.map */}
        {/* 3. Botao com ícone e Botao desabilitado */}
        {/* 4. Badge: neutro, sucesso, alerta e perigo */}
        {/* 5. Avatar: sm com iniciais, md com iniciais, lg com uri */}
        {/* 6. Cartao com Cartao.Cabecalho e Cartao.Corpo, um Divisor dentro e um Campo */}
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1 },
  conteudo: { padding: espaco.md, gap: espaco.lg },
  secao: { gap: espaco.sm },
  tituloSecao: { fontSize: fonte.titulo, fontFamily: familia.negrito },
  linha: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: espaco.sm },
  cheio: { width: '100%' },
});
