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
- Escolher as colunas da grade pela largura da tela
- Trocar `numColumns` e a `key` da `FlatList` juntos, sem tela vermelha
- Decidir quando liberar ou travar a orientação
- Manter o layout de pé quando o usuário aumenta a fonte do sistema
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **responsivo** | o layout que se ajusta ao tamanho da tela |
| **breakpoint** | (*ponto de quebra*) a largura em que o layout muda: abaixo dela, um jeito; a partir dela, outro |
| **orientação** | o celular em pé (*portrait*, retrato) ou deitado (*landscape*, paisagem) |
| **notch** | o recorte da câmera na borda da tela |
| **fonte do sistema** | o tamanho de letra que a pessoa escolhe nas configurações do celular; vale para todos os apps |
| **`fontScale`** | (*escala da fonte*) quantas vezes essa letra é maior que a padrão: 1, 1,3, 2 |

---

## Por que isso importa

Uma cliente abre um app de delivery no tablet da cozinha, apoiado deitado num suporte. A tela não gira: ela inclina a cabeça para ler o cardápio.

O pai dela, no celular pequeno com a letra no máximo, não acha o botão "Finalizar pedido": o texto foi cortado e o resumo vazou para fora do cartão.

O app foi testado em um aparelho só: o de quem o programou.

:::question
Em quantos tamanhos de tela a sua Lojinha já foi aberta?
:::

---

## Responsividade

Quando chega visita para o almoço e a mesa é pequena, o que você faz?

---

## :icon[smartphone] O que é um app responsivo

Um app **responsivo** se ajusta ao tamanho da tela. Pense numa mesa extensível: com pouca gente, ela fica pequena; quando chega visita, abre e ganha lugares.

A grade da Lojinha vai fazer o mesmo: 2 colunas no celular em pé, 3 numa tela larga.

- As telas se medem em **pontos**, a medida do E30, que vale igual em qualquer aparelho
- O que muda de um aparelho para outro é **quantos pontos cabem**: de 320 a mais de 1000 na largura
- Para saber quanto espaço tem, o app pergunta a largura com o **`useWindowDimensions`**, o hook do E30

---

## :icon[smartphone] Responsividade na prática

O mesmo código, em três aparelhos:

```jsx
const { width, height } = useWindowDimensions();
console.log(width, height);
// iPhone em pé:    393 852
// iPhone deitado:  852 393
// iPad em pé:      820 1180
```

Larguras aproximadas, em pontos:

| Aparelho | Largura | Exemplo |
|---|---|---|
| Celular pequeno, em pé | 320 a 360 | iPhone SE antigo, Android de entrada |
| Celular comum ou grande, em pé | 375 a 430 | a maioria dos celulares atuais |
| Dobrável fechado | 340 a 380 | tela externa, estreita e alta |
| Dobrável aberto | 670 a 840 | quase um quadrado |
| Tablet em pé | 740 a 1024 | iPad, tablets Android |
| Celular deitado | 568 a 932 | a altura vira largura |

Duas colunas servem aos celulares em pé. No resto, os cartões ficam esticados.

---

## Breakpoint

A partir de quanto a Lojinha dá frete grátis?

---

## :icon[columns-3] Breakpoint: a largura da virada

Um **breakpoint** é a largura a partir da qual o layout muda. É como o frete grátis da Lojinha, no E07: abaixo de R$ 150, uma regra; a partir de R$ 150, outra. Aqui, abaixo de 600 de largura, 2 colunas; a partir de 600, 3.

```jsx
const { width } = useWindowDimensions();
const colunas = width >= 600 ? 3 : 2;
```

| Linha | O que ela diz |
|---|---|
| `const { width } = useWindowDimensions();` | "guarde em `width` a largura da tela agora". Quando a tela gira, o valor muda e o componente redesenha |
| `width >= 600 ? 3 : 2` | "a largura é 600 ou mais? Então 3; senão, 2" |

O `? :` é o ternário do E05: a pergunta, a resposta do sim e a resposta do não.

---

## :icon[columns-3] Breakpoint na prática

:::center
![Animação: o mesmo celular mostra 2 colunas em pé, com 393 de largura; ao girar, fica com 852, passa do breakpoint de 600 e a grade ganha 3 colunas](images/e38-breakpoint-colunas.svg)
:::

```javascript
const larguras = [320, 393, 600, 820, 852];
for (const width of larguras) {
  const colunas = width >= 600 ? 3 : 2;
  console.log(width, '->', colunas, 'colunas');
}
// 320 -> 2 colunas    393 -> 2 colunas    600 -> 3 colunas
// 820 -> 3 colunas    852 -> 3 colunas
```

Por que 600? Celulares em pé ficam abaixo de 450; tablets e celulares deitados passam de 600. É também o limite que o Android usa para separar telas compactas das médias. Decida pela **largura**, nunca pelo modelo: o mesmo iPhone tem 393 em pé e 852 deitado.

---

## Pratique

:::example Desafio
Com esta linha, quantas colunas a grade tem em cada tela?

```jsx
const colunas = width >= 600 ? 3 : 2;
```

1. Dobrável fechado, com 360 de largura
2. O mesmo dobrável aberto, com 700
3. Um celular pequeno deitado, com 568
4. Se a linha fosse `width > 600`, quantas colunas numa tela de exatamente 600?
:::

:::tip Resposta
1. 2: 360 é menor que 600
2. 3: aberto, ele passou de 600
3. 2: mesmo deitado, 568 não chega a 600. Quem decide é a largura, não a posição
4. 2: o `>` quer dizer "maior que"; só o `>=` ("maior **ou igual**") aceita o 600
:::

---

## Grade adaptável

Crachá novo, o porteiro acha que é outra pessoa. E se a lista trocar de crachá?

---

## :icon[layout-grid] Colunas que mudam com a tela

A `FlatList` tem uma regra: ela não troca o número de colunas com a lista já montada. A saída é trocar junto a **`key`** da lista. O `keyExtractor` é o crachá de cada item; a `key` na própria `FlatList` é o crachá da lista inteira. Crachá novo, lista nova: o React descarta a antiga e monta outra.

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

Sem a `key`, a primeira rotação dá a tela vermelha `Changing numColumns on the fly is not supported` ("não dá para trocar o `numColumns` com a lista rodando").

---

## :icon[list-ordered] A grade em português

| Linha | O que ela diz |
|---|---|
| `key={'grade-' + colunas}` | "meu crachá é `grade-2` ou `grade-3`". Mudou a coluna, mudou o crachá |
| `numColumns={colunas}` | "use 2 ou 3 colunas, conforme a largura" |
| `keyExtractor` | o crachá de cada produto: o `id`, em texto |
| `renderItem` | como desenhar cada produto: um `CartaoProduto` dentro de uma `View` com o estilo `celula` |
| `columnWrapperStyle` | o estilo de cada linha da grade, como o espaço entre os cartões |

---

## :icon[layout-grid] Grade adaptável na prática

| Tela | `colunas` | `key` | Ao girar |
|---|---|---|---|
| iPhone em pé, 393 | 2 | `grade-2` | ponto de partida |
| iPhone deitado, 852 | 3 | `grade-3` | crachá novo: o React monta outra lista, sem tela vermelha |
| iPad em pé, 820 | 3 | `grade-3` | já começa com 3 |

No E34, a `celula` ganhou `maxWidth: '50%'`, para o último cartão sozinho na linha não esticar. Com colunas que mudam, troque por `maxWidth: 100 / colunas + '%'`:

```javascript
const colunas = 3;
console.log('grade-' + colunas);   // grade-3
console.log(100 / colunas + '%');  // 33.333333333333336%: um terço da largura
```

Com 2 colunas, a mesma conta dá `50%`.

---

## Orientação

Que apps do seu celular não giram? Eles precisavam travar?

---

## :icon[rotate-cw] Orientação: em pé ou deitado

A **orientação** é o jeito de segurar o celular, como numa foto: em pé é *portrait* (retrato); deitado é *landscape* (paisagem). Quem decide se o app gira é a linha `orientation` do `app.json`:

```json
"orientation": "default"
```

| Valor | O app |
|---|---|
| `default` | gira junto com o aparelho |
| `portrait` | fica sempre em pé; é o que vem no modelo `blank` do Expo |
| `landscape` | fica sempre deitado |

No E30, você trocou `portrait` por `default` para testar a rotação. Mudou o `app.json`? Pare o servidor e rode `npx expo start` de novo. A rotação automática do celular também precisa estar ligada.

---

## :icon[rotate-cw] Orientação na prática

Travar é exceção. A decisão é de produto: o que a tela precisa?

| App ou tela | `orientation` | Por quê |
|---|---|---|
| Loja, banco, mensagens | `default` | listas e textos funcionam nos dois sentidos |
| Leitor de código de barras | `portrait` | a mira foi desenhada em pé |
| Jogo de corrida | `landscape` | a pista precisa da tela larga |

Há quem dependa do giro: quem tem o celular preso deitado na cadeira de rodas, quem apoia o tablet na mesa. E tablets Android recentes podem ignorar a trava.

A Lojinha fica com `default`. Travar em `portrait` para fugir da tela vermelha da grade só esconde o problema.

---

## :icon[shield] Deitado, o notch vai para o lado

A **área segura** do E30 é a parte da tela livre do notch e das barras do sistema. Deitado, a câmera do iPhone (e o recorte de muitos Android) fica na lateral, e a primeira coluna da grade some atrás dela. O cabeçalho e a barra de abas já cuidam do topo e da base: a tela só precisa proteger as laterais.

```jsx
import { SafeAreaView } from 'react-native-safe-area-context';

return (
  <SafeAreaView edges={['left', 'right']} style={[estilos.tela, { backgroundColor: cores.fundo }]}>
    <FlatList /* a grade */ />
  </SafeAreaView>
);
```

- `edges` (*bordas*) diz quais lados a `SafeAreaView` protege: aqui, a esquerda e a direita
- Em pé, `left` e `right` valem 0: nada muda
- Deitado, o lado do notch ganha uns 50 pontos de margem
- Se a tela ainda tem a `SafeAreaView` do E30 com todas as bordas, acrescente só o `edges`

---

## Fonte do sistema

Quem você conhece que usa a letra do celular no máximo?

---

## :icon[text] A fonte do sistema é do usuário

Quem enxerga pouco aumenta a letra nas configurações do celular. A **fonte do sistema** funciona como o volume: quem escolhe é a pessoa, vale para todos os apps, e o seu app precisa funcionar em qualquer nível.

O React Native **multiplica todo `fontSize`** por essa escala, o **`fontScale`**. O mesmo hook entrega o número: `const { fontScale } = useWindowDimensions();`.

| `fontScale` | `corpo` (16) | `titulo` (20) | `destaque` (28) |
|---|---|---|---|
| 1 (padrão) | 16 | 20 | 28 |
| 1,3 | 21 | 26 | 36 |
| 2 (máximo no Android) | 32 | 40 | 56 |

No iOS, com os tamanhos de acessibilidade ligados, a escala passa de 3.

---

## :icon[sliders-horizontal] Fonte do sistema na prática

Todo `Text` e `TextInput` tem **`allowFontScaling`** (*permitir a escala da fonte*), ligado por padrão. Desligar é travar o volume baixo para quem ouve mal: o layout fica arrumado, mas quem mais precisa deixa de ler.

```jsx
// Não faça: quem aumentou a letra não consegue ler o nome
<Text allowFontScaling={false}>{produto.nome}</Text>

// Faça: no selo sobre a foto, o texto cresce até 1,5 vez e para
<Text maxFontSizeMultiplier={1.5} style={estilos.selo}>Destaque</Text>
```

**`maxFontSizeMultiplier`** (*multiplicador máximo do tamanho da fonte*) põe um teto na escala daquele texto:

| Sistema em | Nome do produto (16), sem teto | Selo (12), com teto de 1,5 |
|---|---|---|
| 1 | 16 | 12 |
| 1,3 | 21 | 16 |
| 2 | 32 | 18, não 24 |

Use o teto só onde o espaço é fixo de verdade: selo sobre uma foto, rótulo de uma barra. Nunca no texto corrido.

---

## :icon[text] Onde a pessoa aumenta a letra

Para testar a Lojinha com letra grande, mude a fonte no seu celular:

- **Android:** Configurações, Tela, Tamanho da fonte. O caminho muda um pouco de um fabricante para outro
- **iOS:** Ajustes, Acessibilidade, Tela e Tamanho do Texto, Texto Maior

Depois, volte à Lojinha: ela já abre com a letra nova, sem você mudar uma linha de código. É o React Native multiplicando cada `fontSize` pelo `fontScale`.

Ao terminar o teste, devolva a fonte ao tamanho de antes.

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

## Layout que cresce

O que acontece quando você enche demais uma caixa de sapato? E uma sacola?

---

## :icon[rows-3] Layout que cresce com a letra

Medida fixa é uma caixa de sapato: o que não cabe fica de fora. Medida mínima é uma sacola: tem um tamanho de partida, mas estica para caber tudo. Com letra grande, prefira a sacola.

Numa linha com nome à esquerda e preço à direita, a fonte grande faz o nome empurrar o preço para fora da tela:

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

---

## :icon[list-ordered] A linha em português

| Trecho | O que ele diz |
|---|---|
| `fontScale > 1.3` | "a letra passou de 1,3 vez a padrão?" O sim ou não fica em `empilhar` |
| `empilhar && estilos.empilhada` | "só se `empilhar` for verdade, use também `empilhada`": o curto-circuito do E05 |
| `flexDirection: 'column'` | com letra grande, nome em cima e preço embaixo |
| `minHeight: 44` | a linha tem pelo menos 44 de altura e cresce se o texto pedir |
| `flexShrink: 1` | o nome pode encolher na largura: ele quebra linha em vez de empurrar o preço |

`numberOfLines` corta o texto com "...": use só onde o texto inteiro aparece em outra tela, como o nome no cartão.

---

## :icon[rows-3] Layout que cresce na prática

Três lugares da Lojinha, com a fonte do sistema em 2:

| Onde | Caixa de sapato | Sacola | Resultado |
|---|---|---|---|
| Cartão do produto | `height: 260` | sem `height` | o cartão cresce e o preço aparece |
| `Botao` | `height: t.altura` | `minHeight: t.altura` | o botão ganha uma linha e o texto não vaza |
| Linha do carrinho | sempre `'row'` | `empilhar && estilos.empilhada` | nome em cima, preço embaixo |

Quando a linha empilha:

```javascript
const empilhar = (fontScale) => fontScale > 1.3;
console.log(empilhar(1));    // false: lado a lado
console.log(empilhar(1.3));  // false: 1,3 não passa de 1,3
console.log(empilhar(2));    // true: empilhada
```

---

## Largura máxima

Por que o jornal divide a página em colunas estreitas?

---

## :icon[monitor] Largura máxima em tablets

**Largura máxima** (`maxWidth`) é um limite: o conteúdo cresce até ali e para. É o que o jornal faz ao dividir a página em colunas estreitas: linha comprida cansa o olho, que se perde ao voltar para o começo da próxima. Linhas confortáveis têm de 50 a 80 letras; num iPad deitado, com 1180 de largura, a descrição do produto chegaria a quase 150.

No `Detalhe.js`, o conteúdo da `ScrollView` ganha um limite:

```jsx
<ScrollView style={{ backgroundColor: cores.fundo }} contentContainerStyle={estilos.conteudo}>
  {/* imagem, nome, preço, descrição e botão */}
</ScrollView>

const estilos = StyleSheet.create({
  conteudo: { width: '100%', maxWidth: 720, alignSelf: 'center', padding: espaco.md, gap: espaco.md },
});
```

- `width: '100%'` com `maxWidth: 720`: ocupa a tela toda, até 720
- `alignSelf: 'center'`: acima disso, fica no meio, com margem dos dois lados

---

## :icon[monitor] Largura máxima na prática

O mesmo Detalhe, em três telas. O conteúdo fica com a menor das duas medidas, a tela ou 720, e o que sobra vira margem:

```javascript
const maxWidth = 720;
for (const tela of [393, 820, 1180]) {
  const conteudo = Math.min(tela, maxWidth);
  const margem = (tela - conteudo) / 2;
  console.log(tela, '->', conteudo, 'de conteúdo e', margem, 'de cada lado');
}
// 393 -> 393 de conteúdo e 0 de cada lado
// 820 -> 720 de conteúdo e 50 de cada lado
// 1180 -> 720 de conteúdo e 230 de cada lado
```

- `Math.min` devolve o menor dos números
- No celular, nada muda; no tablet, o texto fica numa coluna confortável, no centro
- Na grade do `Inicio.js`, o mesmo limite no `contentContainerStyle` evita cartões gigantes

---

## :icon[laptop] Teste em vários tamanhos

O **emulador** é um celular de mentira, dentro do computador. Com ele, você testa tamanhos que não tem:

:::steps
1. No Android Studio, em Device Manager, crie um emulador **Small Phone** e outro **Medium Tablet**
2. Com o emulador aberto, tecle `a` no terminal do Expo para abrir a Lojinha nele
3. Gire o emulador pelos botões da barra lateral ou com <kbd>Ctrl</kbd> + as setas para os lados
4. Aumente a fonte nas Configurações do emulador ou pelo terminal: `adb shell settings put system font_scale 2.0`
5. No seu celular: rotação automática ligada, fonte no máximo e uma volta por todas as telas
:::

O `adb` leva comandos do computador ao Android. Para voltar: `font_scale 1.0`.

---

## Mensagens de erro

A luz do painel do carro acendeu. O que ela está dizendo?

---

## :icon[siren] Quando aparece um erro

A tela vermelha é a luz do painel do carro: diz o que aconteceu e onde.

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Changing numColumns on the fly is not supported` | o `numColumns` mudou com a lista montada | `key={'grade-' + colunas}` |
| `columnWrapperStyle not supported for single column lists` | estilo de linha pede 2 colunas ou mais | `columnWrapperStyle` só com `colunas > 1` |
| Girou e nada mudou | `portrait` no `app.json` ou rotação automática desligada | `default`, reiniciar o servidor, ligar a rotação |
| A grade não muda ao girar | `Dimensions.get` no topo do arquivo lê a largura uma vez só | `useWindowDimensions()` dentro do componente |

---

## :icon[triangle-alert] Erros comuns

:::warning
- `allowFontScaling={false}` para "consertar" o layout: o app fica ilegível para quem precisa de letra grande
- `height` fixa em cartões e botões: com fonte grande, o texto vaza ou some; use `minHeight`
- Decidir pelo aparelho (`Platform.OS` ou o modelo) em vez da largura: o tablet e o celular deitado quebram
- Travar a orientação para fugir de um erro: quem precisa do modo deitado perde o app
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
