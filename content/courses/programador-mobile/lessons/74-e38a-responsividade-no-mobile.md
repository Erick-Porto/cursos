---
title: Responsividade no mobile
summary: Grade que muda de 2 para 3 colunas, orientação decidida e layout que aguenta a fonte grande do sistema.
module: layout-rn
duration_minutes: 40
objectives:
  - Adaptar a grade de produtos à largura da tela com useWindowDimensions
  - Decidir quando liberar ou travar a orientação do app
  - Preparar o layout para a fonte do sistema aumentada
---

# Responsividade no mobile

Programador Mobile · Encontro E38 · Aula 74 de 89

---

## O que você vai aprender

:::goal
- Escolher as colunas da grade com um breakpoint de largura
- Trocar `numColumns` e a `key` da `FlatList` juntos, sem tela vermelha
- Decidir quando liberar ou travar a orientação
- Manter o layout de pé quando o usuário aumenta a fonte do sistema
:::

---

## Por que isso importa

Uma cliente abre um app de delivery no tablet da cozinha, apoiado deitado num suporte. A tela não gira: ela inclina a cabeça para ler o cardápio.

O pai dela, no celular pequeno com a letra no máximo, não acha o botão "Finalizar pedido": o texto foi cortado e o resumo vazou para fora do cartão.

O app foi testado em um aparelho só: o de quem o programou.

:::question
Em quantos tamanhos de tela a sua Lojinha já foi aberta?
:::

---

## :icon[smartphone] Um app, muitas telas

Desde o E30, você mede em **pontos**, não em pixels. Larguras aproximadas:

| Aparelho | Largura | Exemplo |
|---|---|---|
| Celular pequeno, em pé | 320 a 360 | iPhone SE antigo, Android de entrada |
| Celular comum ou grande, em pé | 375 a 430 | a maioria dos celulares atuais |
| Dobrável fechado | 340 a 380 | tela externa, estreita e alta |
| Dobrável aberto | 670 a 840 | quase um quadrado |
| Tablet em pé | 740 a 1024 | iPad, tablets Android |
| Celular deitado | 568 a 932 | a altura vira largura |

Duas colunas servem aos celulares em pé; no resto, esticam.

---

## :icon[columns-3] Um breakpoint basta

Um **breakpoint** é a largura a partir da qual o layout muda. Com o `useWindowDimensions` do E30, um só resolve a grade da Lojinha:

```jsx
const { width } = useWindowDimensions();
const colunas = width >= 600 ? 3 : 2;
```

:::center
![Animação: o mesmo celular mostra 2 colunas em pé, com 393 de largura; ao girar, fica com 852, passa do breakpoint de 600 e a grade ganha 3 colunas](images/e38-breakpoint-colunas.svg)
:::

Por que 600? Celulares em pé ficam abaixo de 450, de 360 a 430; tablets, como o iPad em pé com 820, e celulares deitados passam de 600. É também o limite que o Android usa para separar telas compactas das médias.

Decida pela **largura**, nunca pelo modelo do aparelho: o mesmo iPhone tem 393 em pé e 852 deitado.

---

## :icon[rotate-cw] Orientação: liberar ou travar

No E30, você trocou `"orientation": "portrait"` por `"default"` no `app.json` para testar a rotação. Agora a decisão é de produto, e travar é exceção:

| App ou tela | `orientation` | Por quê |
|---|---|---|
| Loja, banco, mensagens | `default` | listas e textos funcionam nos dois sentidos |
| Leitor de código de barras | `portrait` | a mira foi desenhada em pé |
| Jogo de corrida | `landscape` | a pista precisa da tela larga |

Há quem dependa do giro: quem tem o celular preso deitado na cadeira de rodas, quem apoia o tablet na mesa. E tablets Android recentes podem ignorar a trava.

A Lojinha fica com `default`. Mudou o `app.json`? Reinicie o `npx expo start`.

---

## :icon[layout-grid] Colunas que mudam com a tela

Na grade do `Inicio.js`, `numColumns` passa a vir do breakpoint, e a `key` da lista muda junto:

```jsx
<FlatList
  key={'grade-' + colunas}
  numColumns={colunas}
  data={lista}
  keyExtractor={(item) => String(item.id)}
  renderItem={({ item }) => (
    <View style={estilos.celula}>
      <CartaoProduto produto={item} onPress={() => router.push('/produto/' + item.id)} />
    </View>
  )}
  columnWrapperStyle={estilos.linha}
/>
```

A `FlatList` não troca o número de colunas com a lista montada. Sem a `key`, a primeira rotação dá tela vermelha: `Changing numColumns on the fly is not supported`. Com uma `key` nova, o React descarta a lista antiga e monta outra.

Se a `celula` tem `maxWidth: '50%'`, o conserto do E34 para sobras, troque por `maxWidth: 100 / colunas + '%'`.

---

## :icon[shield] Deitado, o notch vai para o lado

Deitado, a câmera do iPhone (e o recorte de muitos Android) fica na lateral, e a primeira coluna da grade some atrás dela. O cabeçalho e a barra de abas já cuidam do topo e da base; a tela só precisa proteger as laterais.

```jsx
import { SafeAreaView } from 'react-native-safe-area-context';

return (
  <SafeAreaView edges={['left', 'right']} style={[estilos.tela, { backgroundColor: cores.fundo }]}>
    <FlatList /* a grade */ />
  </SafeAreaView>
);
```

- Em pé, `left` e `right` valem 0: nada muda
- Deitado, o lado do notch ganha uns 50 pontos de margem
- Se a tela ainda tem a `SafeAreaView` do E30 com todas as bordas, só acrescente o `edges`

---

## :icon[text] A fonte do sistema é do usuário

Quem enxerga pouco aumenta a letra nas configurações do celular, e o React Native **multiplica todo `fontSize`** por essa escala. O mesmo hook a entrega: `const { fontScale } = useWindowDimensions();`.

- Android: Configurações, Tela, Tamanho da fonte (o caminho muda um pouco por fabricante)
- iOS: Ajustes, Acessibilidade, Tela e Tamanho do Texto, Texto Maior

| `fontScale` | `corpo` (16) | `titulo` (20) | `destaque` (28) |
|---|---|---|---|
| 1 (padrão) | 16 | 20 | 28 |
| 1,3 | 21 | 26 | 36 |
| 2 (máximo no Android) | 32 | 40 | 56 |

No iOS, com os tamanhos de acessibilidade ligados, a escala passa de 3.

---

## Pense

:::question
Um celular de 4 polegadas tem 320 de largura. A dona dele usa a fonte do sistema em 2.

O que acontece com a grade de 2 colunas da Lojinha? O que você mudaria?
:::

:::tip Resposta
Cada cartão fica com uns 135 de largura e o nome, em 32, quebra em várias linhas. Se o cartão ou o botão têm `height` fixa, o preço some e o texto vaza.

A saída não é travar a fonte: é deixar o layout crescer. Troque alturas fixas por `minHeight`, deixe o texto quebrar linha e limite só o que mora em espaço fixo, como um selo sobre a foto.
:::

---

## :icon[sliders-horizontal] allowFontScaling e maxFontSizeMultiplier

Todo `Text` e `TextInput` tem `allowFontScaling`, ligado por padrão. Desligar parece consertar o layout, mas tira a leitura de quem mais precisa dela.

```jsx
// Não faça: quem aumentou a letra não consegue ler o nome
<Text allowFontScaling={false}>{produto.nome}</Text>

// Faça: no selo sobre a foto, o texto cresce até 1,5 vez e para
<Text maxFontSizeMultiplier={1.5} style={estilos.selo}>Destaque</Text>
```

**`maxFontSizeMultiplier`** põe um teto na escala daquele texto: com o sistema em 2, uma fonte de 12 vai a 18, não a 24.

Use o teto só onde o espaço é fixo de verdade: selo sobre uma foto, rótulo de uma barra. Nunca no texto corrido.

---

## :icon[rows-3] Layout que cresce com a letra

Numa linha com nome à esquerda e preço à direita, a fonte grande faz o nome empurrar o preço para fora da tela.

```jsx
const { fontScale } = useWindowDimensions();
const empilhar = fontScale > 1.3;

<View style={[estilos.linha, empilhar && estilos.empilhada]}>
  <Text style={estilos.nome}>{item.qtd} x {item.nome}</Text>
  <Text style={estilos.preco}>{formatarPreco(item.preco * item.qtd)}</Text>
</View>

const estilos = StyleSheet.create({
  linha: { flexDirection: 'row', justifyContent: 'space-between', minHeight: 44, gap: 8 },
  empilhada: { flexDirection: 'column' },
  nome: { flexShrink: 1 }, // quebra linha em vez de empurrar o preço
});
```

- `minHeight` no lugar de `height`: linha, cartão e botão crescem com o texto
- `flexShrink: 1` no texto de uma linha: ele quebra em vez de vazar
- `numberOfLines` só onde o texto inteiro aparece em outra tela, como o nome no cartão

---

## :icon[monitor] Largura máxima em tablets

Num iPad deitado, com 1180 de largura, a descrição do produto vira uma linha de quase 150 letras: o olho se perde ao voltar para o começo da próxima. Linhas confortáveis têm de 50 a 80 caracteres.

No `Detalhe.js`, o conteúdo da `ScrollView` ganha um limite:

```jsx
<ScrollView style={{ backgroundColor: cores.fundo }} contentContainerStyle={estilos.conteudo}>
  {/* imagem, nome, preço, descrição e botão */}
</ScrollView>

const estilos = StyleSheet.create({
  conteudo: { width: '100%', maxWidth: 720, alignSelf: 'center', padding: espaco.md, gap: espaco.md },
});
```

Até 720 de largura, o conteúdo ocupa a tela toda; acima disso, fica centralizado com margem dos dois lados. Na grade do `Inicio.js`, o mesmo limite no `contentContainerStyle` evita cartões gigantes.

---

## :icon[laptop] Teste em vários tamanhos

:::steps
1. No Android Studio, em Device Manager, crie um emulador **Small Phone** e outro **Medium Tablet**
2. Com o emulador aberto, tecle `a` no terminal do Expo para abrir a Lojinha nele
3. Gire o emulador pelos botões da barra lateral ou com <kbd>Ctrl</kbd> + as setas para os lados
4. Aumente a fonte nas Configurações do emulador ou pelo terminal: `adb shell settings put system font_scale 2.0`
5. No seu celular: rotação automática ligada, fonte no máximo e uma volta por todas as telas
:::

:::tip
Volte a fonte ao normal com `font_scale 1.0`. No Mac, o Simulator do Xcode tem iPhone SE e iPad prontos.
:::

---

## :icon[triangle-alert] Erros comuns

:::warning
- Trocar `numColumns` sem trocar a `key` da `FlatList`: tela vermelha na primeira rotação
- `Dimensions.get('window')` no topo do arquivo: a largura não muda ao girar; use `useWindowDimensions` dentro do componente
- `allowFontScaling={false}` para "consertar" o layout: o app fica ilegível para quem precisa de letra grande
- `height` fixa em cartões e botões: com fonte grande, o texto vaza ou some; use `minHeight`
- Decidir pelo aparelho (`Platform.OS` ou o modelo) em vez da largura: o tablet e o celular deitado quebram
:::

---

## Resumo

:::summary
- Em pontos, as larguras vão de 320 a mais de 1000; deitado, a altura vira largura
- Um breakpoint simples, `width >= 600`, escolhe entre 2 e 3 colunas; `numColumns` e `key` mudam juntos
- `"orientation": "default"` segue o aparelho; trave só quando o giro estraga algo essencial
- Deitado, `SafeAreaView` com `edges={['left', 'right']}` tira a grade de trás do notch
- A fonte do sistema é do usuário: deixe o layout crescer e use `maxFontSizeMultiplier` só no espaço fixo
:::

---

## :icon[arrow-right] Próximos passos

A Lojinha agora cabe em qualquer tela e aguenta letra grande. Mas ainda tem gente que não consegue comprar nela: quem não enxerga a tela, quem tem tremor nas mãos, quem não distingue cores.

Na aula 75, você deixa a Lojinha acessível:

- :icon[eye-off] o leitor de tela, TalkBack e VoiceOver, e o que ele fala
- :icon[tag] rótulo, papel, estado e dica em cada elemento
- :icon[hand] área de toque de 44 por 44 e contraste nos tokens
