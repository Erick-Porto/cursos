import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Avatar, Badge, Botao, Campo, Cartao, Divisor } from '../components/ui';
import { textoDoStatus, tomDoStatus } from '../regras/pedido';
import { useTema } from '../theme/TemaContext';
import { familia, espaco, fonte } from '../theme/tokens';

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
  const { cores, escuro, alternarTema } = useTema();
  return (
    <SafeAreaView style={[estilos.tela, { backgroundColor: cores.fundo }]}>
      <StatusBar style={escuro ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <Botao
          titulo={escuro ? 'Ver tema claro' : 'Ver tema escuro'}
          variante="secundaria"
          icone={escuro ? 'sunny-outline' : 'moon-outline'}
          onPress={alternarTema}
        />
        {variantes.map((variante) => (
          <Secao key={variante} titulo={`Botao ${variante}`}>
            {tamanhos.map((tamanho) => (
              <Botao key={tamanho} titulo={tamanho} variante={variante} tamanho={tamanho} />
            ))}
          </Secao>
        ))}
        <Secao titulo="Botao com ícone e desabilitado">
          <Botao titulo="Comprar" icone="cart-outline" />
          <Botao titulo="Esgotado" desabilitado />
        </Secao>
        <Secao titulo="Badge">
          <Badge texto="Neutro" />
          <Badge texto="Novo" tom="sucesso" />
          <Badge texto="Últimas unidades" tom="alerta" />
          <Badge texto="Esgotado" tom="perigo" />
          <Badge texto={textoDoStatus('pendente')} tom={tomDoStatus('pendente')} />
        </Secao>
        <Secao titulo="Avatar">
          <Avatar nome="Ana Clara" tamanho="sm" />
          <Avatar nome="Bruno Lima" />
          <Avatar nome="Carla Dias" tamanho="lg" uri="https://picsum.photos/seed/carla/400/400" />
        </Secao>
        <Secao titulo="Cartao, Divisor e Campo">
          <Cartao style={estilos.cheio}>
            <Cartao.Cabecalho titulo="Pedido #1042">
              <Badge texto="A caminho" tom="neutro" />
            </Cartao.Cabecalho>
            <Cartao.Corpo>
              <Text style={{ color: cores.textoSuave }}>2 itens · R$ 259,80</Text>
              <Divisor />
              <Botao titulo="Acompanhar" variante="secundaria" tamanho="sm" />
            </Cartao.Corpo>
          </Cartao>
          <Campo rotulo="E-mail" placeholder="voce@email.com"
            keyboardType="email-address" style={estilos.cheio} />
        </Secao>
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
