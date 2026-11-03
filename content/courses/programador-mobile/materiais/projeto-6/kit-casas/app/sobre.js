// Tela Sobre, pronta: o que é o app, os números e o botão de tema (a rota "/sobre").
// Ela também serve de exemplo: só peças do kit, tokens e cores do tema, nenhuma cor solta.
// E37 (etapa 5): este arquivo vai para app/(abas)/ e vira a aba Sobre.
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Botao, Cartao, LinhaInfo, Tela } from '@/components/ui';
import { useCasas } from '@/data/CasasContext';
import { espaco, fonte, raio, useTema } from '@/theme';
import { resumoDasCasas } from '@/utils';

export default function Sobre() {
  const { cores, escuro, alternarTema } = useTema();
  const { casas } = useCasas();
  const resumo = resumoDasCasas(casas);
  const numeros = [
    { valor: resumo.casas, rotulo: 'casas' },
    { valor: resumo.cidades, rotulo: 'cidades' },
    { valor: resumo.vagas, rotulo: 'vagas' },
  ];

  return (
    <Tela rolar>
      <View style={estilos.topo} accessible accessibilityLabel="Casas de adoção. Adote perto de você">
        <View style={[estilos.marca, { backgroundColor: cores.primaria }]}>
          <Ionicons name="paw" size={36} color={cores.sobreCor} />
        </View>
        <Text style={[estilos.nome, { color: cores.texto }]}>Casas de adoção</Text>
        <Text style={[estilos.frase, { color: cores.textoSuave }]}>Adote perto de você</Text>
      </View>

      <Cartao style={estilos.numeros}>
        {numeros.map((numero) => (
          <View
            key={numero.rotulo}
            style={estilos.numero}
            accessible
            accessibilityLabel={`${numero.valor} ${numero.rotulo}`}
          >
            <Text style={[estilos.valor, { color: cores.primaria }]}>{numero.valor}</Text>
            <Text style={[estilos.rotulo, { color: cores.textoSuave }]}>{numero.rotulo}</Text>
          </View>
        ))}
      </Cartao>

      <Cartao titulo="Como funciona">
        <LinhaInfo icone="search-outline" texto="Busque uma casa pelo nome, bairro ou cidade" />
        <LinhaInfo icone="calendar-outline" texto="Veja o horário e marque a visita" />
        <LinhaInfo icone="add-circle-outline" texto="Cadastre a casa onde você ajuda" />
      </Cartao>

      <Botao
        titulo={escuro ? 'Usar tema claro' : 'Usar tema escuro'}
        icone={escuro ? 'sunny-outline' : 'moon-outline'}
        variante="secundaria"
        onPress={alternarTema}
      />
      <Text style={[estilos.rodape, { color: cores.textoSuave }]}>
        Dados fictícios, feitos para o curso Programador Mobile.
      </Text>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  topo: { alignItems: 'center', gap: espaco.xs, paddingTop: espaco.md },
  marca: {
    width: 72,
    height: 72,
    borderRadius: raio.redondo,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: espaco.sm,
  },
  nome: { fontSize: fonte.titulo, fontWeight: 'bold' },
  frase: { fontSize: fonte.corpo },
  numeros: { flexDirection: 'row' },
  numero: { flex: 1, alignItems: 'center' },
  valor: { fontSize: fonte.destaque, fontWeight: 'bold' },
  rotulo: { fontSize: fonte.pequena },
  rodape: { fontSize: fonte.pequena, textAlign: 'center' },
});
