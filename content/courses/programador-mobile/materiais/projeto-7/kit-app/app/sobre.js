// Tela Sobre, pronta: o nome do app, a frase, o briefing, a equipe e o botão de tema (a rota "/sobre").
// Ela lê tudo de src/data/equipe.js: a equipe muda os dados lá, não aqui.
// Também serve de exemplo: só peças do kit, tokens e cores do tema, nenhuma cor solta.
// E41: este arquivo vai para app/(abas)/ e vira a aba Sobre.
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Botao, Cartao, LinhaInfo, Tela } from '@/components/ui';
import { briefing, equipe, frase, nomeDoApp } from '@/data/equipe';
import { espaco, fonte, raio, useTema } from '@/theme';

export default function Sobre() {
  const { cores, escuro, alternarTema } = useTema();

  return (
    <Tela rolar>
      <View style={estilos.topo} accessible accessibilityLabel={`${nomeDoApp}. ${frase}`}>
        <View style={[estilos.marca, { backgroundColor: cores.primaria }]}>
          <Ionicons name="phone-portrait-outline" size={36} color={cores.sobreCor} />
        </View>
        <Text style={[estilos.nome, { color: cores.texto }]}>{nomeDoApp}</Text>
        <Text style={[estilos.frase, { color: cores.textoSuave }]}>{frase}</Text>
      </View>

      <Cartao titulo="O briefing">
        <LinhaInfo icone="document-text-outline" texto={briefing} />
      </Cartao>

      <Cartao titulo="Equipe">
        {equipe.map((pessoa) => (
          <LinhaInfo
            key={pessoa.github}
            icone="person-outline"
            texto={`${pessoa.nome} · github.com/${pessoa.github}`}
          />
        ))}
      </Cartao>

      <Botao
        titulo={escuro ? 'Usar tema claro' : 'Usar tema escuro'}
        icone={escuro ? 'sunny-outline' : 'moon-outline'}
        variante="secundaria"
        onPress={alternarTema}
      />
      <Text style={[estilos.rodape, { color: cores.textoSuave }]}>
        Projeto integrador do curso Programador Mobile, feito com Expo e React Native.
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
  nome: { fontSize: fonte.titulo, fontWeight: 'bold', textAlign: 'center' },
  frase: { fontSize: fonte.corpo, textAlign: 'center' },
  rodape: { fontSize: fonte.pequena, textAlign: 'center' },
});
