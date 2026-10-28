---
title: "Revisão: layout e componentes React Native"
summary: Recapitulação da unidade, questões comentadas no estilo da Prova 4 e a tela Perfil que fecha a v1 da Lojinha.
module: layout-rn
duration_minutes: 40
objectives:
  - Revisar os temas da unidade Layout e componentes React Native
  - Resolver questões no estilo da prova
  - Concluir e documentar a versão 1 da Lojinha
---

# Revisão: layout e componentes React Native

Programador Mobile · Encontro E40 · Aula 79 de 89

---

## :icon[map] Mapa da unidade

:::goal
- Rever cada tema em um slide e resolver cinco questões no estilo da Prova 4
- Reconhecer as armadilhas que mais derrubam nota
- Fechar a versão 1 da Lojinha no laboratório
:::

Em onze encontros, a Lojinha foi do wireframe a um app navegável com 5 telas, apoiado nas regras que vieram do `lojinha-regras`. A prova cobre:

::::columns
:::col

1. Flexbox e dimensões
2. Tokens e tema
3. Toque, ícones, imagens e fontes
4. UI kit
5. Listas
6. Formulários

:::
:::col

7. Navegação em pilha
8. Abas, modais e fluxos
9. Responsividade e acessibilidade
10. Animações e estados
11. Do protótipo ao código

:::
::::

---

## :icon[columns-3] Flexbox e dimensões

- Toda `View` é flex em **coluna**; `flexDirection: 'row'` põe os filhos lado a lado
- `justifyContent` distribui no eixo principal; `alignItems` e `alignSelf` alinham no eixo cruzado
- `flex: 1` divide o espaço que sobra; `flexWrap: 'wrap'` e `gap` montam chips e grades
- Medidas em pontos, sem unidade, ou em porcentagem (`'48%'`); evite altura fixa em quem tem texto
- `SafeAreaView`, de `react-native-safe-area-context`, afasta o conteúdo do entalhe e da barra de status

```jsx
// wireframe do E30: imagem à esquerda, textos à direita
<View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
  <View style={{ width: 80, height: 80, backgroundColor: '#e2e8f0' }} />
  <View style={{ flex: 1, marginLeft: 16 }}>
    <Text>Fone Bluetooth</Text>
    <Text>R$ 199,90</Text>
  </View>
</View>
```

---

## :icon[sun] Tokens e tema

- **Tokens** dão nome às decisões visuais em `src/theme/tokens.js`: `cores`, `espaco` (de 4 a 32), `fonte`, `familia` e `raio`
- `cores.claro` e `cores.escuro` têm as mesmas chaves: `fundo`, `superficie`, `texto`, `textoSuave`, `primaria`, `borda`, `perigo`, `sucesso`
- `useTema()` devolve `{ cores, espaco, fonte, raio, escuro, alternarTema }`; o tema inicial vem do `useColorScheme`
- Estrutura e espaço no `StyleSheet`; cor do tema no array de estilos

```jsx
const { cores } = useTema();

<View style={[estilos.cartao, { backgroundColor: cores.superficie }]}>
  <Text style={[estilos.nome, { color: cores.texto }]}>{produto.nome}</Text>
</View>
// no StyleSheet: cartao: { padding: espaco.md, borderRadius: raio.md }
```

---

## :icon[mouse-pointer-click] Toque, ícones, imagens e fontes

- `Pressable` com `style={({ pressed }) => ...}` dá retorno visual ao toque
- `Ionicons`, de `@expo/vector-icons`, recebe `name`, `size` e `color`
- `Image` do `expo-image`: `contentFit`, `placeholder` e `transition`; imagem remota sempre com tamanho
- `useFonts` carrega `Inter_400Regular` e `Inter_700Bold`; `SplashScreen.preventAutoHideAsync()` segura a abertura até o `hideAsync()`
- Com fonte própria, o peso vem da família (`familia.negrito`), não do `fontWeight`

```jsx
<Pressable onPress={abrir} style={({ pressed }) => [estilos.cartao, pressed && { opacity: 0.7 }]}>
  <Image source={produto.imagem} style={estilos.imagem} contentFit="cover" transition={300} />
  <Text style={estilos.nome}>{produto.nome}</Text>
  <Text style={estilos.preco}>{formatarPreco(produto.preco)}</Text>
  <Ionicons name="cart-outline" size={24} color={cores.primaria} />
</Pressable>
```

---

## :icon[component] UI kit

- Peças genéricas em `src/components/ui/`, reexportadas pelo `index.js`: `Botao`, `Cartao`, `Badge`, `Avatar`, `Campo`, `Divisor`
- **Variantes** escolhidas por prop, com mapa de estilos: `variante` e `tamanho` no `Botao`, `tom` no `Badge`
- `children` recebe o conteúdo; `style` de fora só posiciona; `...rest` repassa props nativas, como `accessibilityLabel`
- **Componente composto**: `Cartao.Cabecalho` e `Cartao.Corpo`
- `Avatar` sem `uri` mostra as iniciais do `nome`

```jsx
import { Badge, Botao, Cartao } from '../components/ui';

<Cartao>
  <Cartao.Cabecalho><Badge texto="Destaque" tom="sucesso" /></Cartao.Cabecalho>
  <Cartao.Corpo>
    <Botao titulo="Comprar" tamanho="lg" icone="cart-outline" onPress={comprar} />
  </Cartao.Corpo>
</Cartao>
```

---

## :icon[list] Listas

- `FlatList`: `data`, `renderItem={({ item }) => ...}` e `keyExtractor` que devolve **string**
- `numColumns={2}` monta a grade; `horizontal` monta o carrossel, com item de largura fixa
- Trocar `numColumns` com a lista na tela exige trocar a `key` junto
- `ListHeaderComponent` rola com a lista; `ListEmptyComponent` aparece com `data` vazio
- `SectionList` agrupa por `sections` (`title` e `data`); `RefreshControl` faz o puxar para atualizar

```jsx
<FlatList
  data={produtos}
  keyExtractor={(item) => String(item.id)}
  numColumns={2}
  renderItem={({ item }) => <CartaoProduto produto={item} />}
  ListHeaderComponent={<FlatList horizontal data={destaques} /* ... */ />}
  ListEmptyComponent={<Text>Nenhum produto</Text>}
/>
```

---

## :icon[keyboard] Formulários

- `Campo` do kit envolve o `TextInput` com `rotulo` e `erro`
- Teclado certo para cada campo: `keyboardType`, `autoCapitalize="none"`, `secureTextEntry`
- Foco no próximo: `useRef(null)`, `returnKeyType="next"` e `onSubmitEditing` com arrow function
- `KeyboardAvoidingView`, com `behavior` por plataforma, impede o teclado de cobrir o botão
- Validação e máscara em funções puras: `validar.js` e `mascararTelefone`; termos com `Switch`

```jsx
const emailRef = useRef(null);

<Campo rotulo="Nome" value={nome} onChangeText={setNome}
  returnKeyType="next" onSubmitEditing={() => emailRef.current.focus()} />
<Campo ref={emailRef} rotulo="E-mail" value={email} onChangeText={setEmail}
  keyboardType="email-address" autoCapitalize="none" erro={erros.email} />
```

---

## :icon[layers] Navegação em pilha

- Expo Router: cada arquivo em `app/` é uma rota; `app/_layout.js` monta o `Stack` e envolve tudo com `TemaProvider` e `CarrinhoProvider`, que usa as regras de `src/regras/carrinho.js`
- `"main": "expo-router/entry"` no `package.json`: o `App.js` deixa de ser usado
- `Link` ou `router.push('/produto/' + id)` empilham uma tela; voltar desempilha
- Rota dinâmica `app/produto/[id].js`; `useLocalSearchParams()` devolve **string**
- Título da tela com `<Stack.Screen options={{ title: ... }} />`

```jsx
// src/telas/Detalhe.js, aberta por app/produto/[id].js
const { id } = useLocalSearchParams();
const produto = produtos.find((p) => p.id === Number(id));

<Stack.Screen options={{ title: produto.nome }} />
```

---

## :icon[navigation] Abas, modais e fluxos

- `app/(tabs)/_layout.js` com `Tabs`; o grupo entre parênteses não aparece no endereço
- `tabBarIcon` com `Ionicons`; `tabBarBadge` mostra a quantidade do carrinho
- Pilha dentro da aba: `app/(tabs)/categorias/_layout.js` com `Stack`
- Modal: `app/filtros.js` com `presentation: 'modal'` no layout raiz
- Fluxo de entrada com `app/(auth)/entrar.js` e `Redirect`; o `scheme` do `app.json` abre links como `lojinha://produto/3`

```jsx
// app/(tabs)/_layout.js
<Tabs>
  <Tabs.Screen name="index" options={{ title: 'Início',
    tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} /> }} />
  <Tabs.Screen name="carrinho" options={{ title: 'Carrinho', tabBarBadge: quantidade || undefined }} />
</Tabs>
```

---

## :icon[smartphone] Responsividade e acessibilidade

- `useWindowDimensions()` devolve `width` e `height` atualizados ao girar; `width >= 600` pede 3 colunas
- `maxFontSizeMultiplier` limita o crescimento da fonte; `allowFontScaling={false}` só em último caso
- Leitor de tela: `accessibilityLabel`, `accessibilityRole`, `accessibilityState` e `accessibilityHint`
- Área de toque mínima de 44 por 44; `hitSlop` amplia sem mudar o desenho
- Contraste AA: 4,5 para 1 em texto comum; audite com TalkBack e VoiceOver

```jsx
const { width } = useWindowDimensions();
const colunas = width >= 600 ? 3 : 2;
<FlatList key={'grade-' + colunas} numColumns={colunas} /* ... */ />

<Pressable onPress={remover} hitSlop={12} accessibilityRole="button"
  accessibilityLabel="Remover Fone Bluetooth do carrinho">
  <Ionicons name="trash-outline" size={20} color={cores.perigo} />
</Pressable>
```

---

## :icon[sparkles] Animações e estados

- `useRef(new Animated.Value(0)).current` guarda o valor entre as renderizações
- `Animated.timing` (duração), `Animated.spring` (mola) e `Animated.stagger` (um depois do outro) só rodam com `.start()`
- `useNativeDriver: true` anima no lado nativo, mas só `opacity` e `transform`
- `interpolate` converte de 0 a 1 em outra faixa, como `translateY` de 20 a 0
- Estados de tela no kit: `Esqueleto`, `EstadoCarregando`, `EstadoVazio` e `EstadoErro` com "Tentar novamente"

```jsx
const entrada = useRef(new Animated.Value(0)).current;
useEffect(() => {
  Animated.timing(entrada, { toValue: 1, duration: 300, useNativeDriver: true }).start();
}, []);
const subir = entrada.interpolate({ inputRange: [0, 1], outputRange: [20, 0] });

<Animated.View style={{ opacity: entrada, transform: [{ translateY: subir }] }} />
```

---

## Questão comentada 1

:::question
O que aparece na tela?

```jsx
<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', height: 120 }}>
  <Text>A</Text>
  <Text>B</Text>
</View>
```

- a) A em cima de B, centralizados na horizontal, no fundo da caixa
- b) A e B lado a lado, centralizados na horizontal, no fundo da caixa
- c) A e B lado a lado, no início da linha, centralizados na vertical
- d) A à esquerda e B à direita, no topo da caixa
:::

:::tip Resposta
**b.** Com `row`, o eixo principal é o horizontal: `justifyContent: 'center'` junta A e B no meio da linha. O eixo cruzado é o vertical: `alignItems: 'flex-end'` leva os dois ao fundo dos 120. A **c** é a pegadinha de quem inverte os eixos. Na prova, ache primeiro o `flexDirection`: ele define o que cada propriedade controla.
:::

---

## Questão comentada 2

:::question
Ao girar o tablet, o app mostra a tela vermelha `Changing numColumns on the fly is not supported`. Qual é a correção?

```jsx
const { width } = useWindowDimensions();
const colunas = width >= 600 ? 3 : 2;

<FlatList data={produtos} numColumns={colunas}
  keyExtractor={(item) => String(item.id)} renderItem={renderizarProduto} />
```

- a) Ler a largura com `Dimensions.get('window')` uma vez, fora do componente
- b) Acrescentar `key={'grade-' + colunas}` à `FlatList`
- c) Trocar `numColumns` por `horizontal`
- d) Envolver a `FlatList` numa `ScrollView`
:::

:::tip Resposta
**b.** A `FlatList` não troca o número de colunas com a lista na tela. Uma `key` nova faz o React descartar a lista antiga e montar outra, já com 3 colunas. A **a** faz a tela vermelha sumir só porque a largura nunca mais muda: o tablet deitado fica com 2 colunas. A **d** cria listas aninhadas.
:::

---

## Questão comentada 3

:::question
Ao abrir `/produto/3`, a tela vermelha diz `Cannot read property 'nome' of undefined`. O produto de `id` 3 existe em `produtos.js`. Por quê?

```jsx
// src/telas/Detalhe.js
const { id } = useLocalSearchParams();
const produto = produtos.find((p) => p.id === id);

return <Text>{produto.nome}</Text>;
```
:::

:::tip Resposta
Parâmetro de rota é sempre **string**: `id` vale `'3'`, e o `id` em `produtos.js` é o número `3`. Como `3 === '3'` é `false`, o `find` não acha nada e devolve `undefined`; ler `.nome` de `undefined` derruba a tela.

Correção: `p.id === Number(id)`. Na prova, sempre que aparecer `useLocalSearchParams`, procure a conversão.
:::

---

## Questão comentada 4

:::question
Quais trechos continuam legíveis quando o usuário troca para o tema escuro? Marque todos os corretos.

- a) `style={[estilos.cartao, { backgroundColor: cores.superficie }]}`
- b) `cartao: { backgroundColor: '#ffffff', padding: espaco.md }`, no `StyleSheet`
- c) `<Ionicons name="cart-outline" size={24} color={cores.primaria} />`
- d) `<Text style={{ color: 'black' }}>{produto.nome}</Text>`
:::

:::tip Resposta
**a** e **c.** As duas leem a cor do `useTema()`, que troca junto com o tema. A **b** parece segura porque usa token no espaçamento, mas o fundo fixo continua branco, e o texto claro do tema escuro some sobre ele. A **d** pinta preto sobre fundo escuro.

Regra: cor sempre do tema; hex só dentro do `tokens.js`.
:::

---

## Questão comentada 5

:::question
Verdadeiro ou falso: "Este botão está pronto para quem usa leitor de tela e para quem tem dedos grandes."

```jsx
<Pressable onPress={remover}>
  <Ionicons name="trash-outline" size={20} color={cores.perigo} />
</Pressable>
```
:::

:::tip Resposta
**Falso**, por três motivos: sem `accessibilityLabel`, o leitor de tela não tem o que falar, porque o ícone não tem texto; sem `accessibilityRole="button"`, não anuncia que é um botão; e a área de toque tem 20 por 20, abaixo do mínimo de 44.

```jsx
<Pressable onPress={remover} hitSlop={12} accessibilityRole="button"
  accessibilityLabel="Remover Fone Bluetooth do carrinho">
```

Com `hitSlop={12}`, a área vai a 44 por 44 sem mudar o desenho.
:::

---

## :icon[clipboard-check] Como será a prova

| Item | Como é |
|---|---|
| Questões | 20 objetivas |
| Tempo | 60 minutos, 1 tentativa |
| Nota mínima | 70 |
| Conteúdo | E30 a E40 (aulas 58 a 79) |
| Onde | No sistema, na última hora do encontro |

Tipos: **escolha única**, **múltipla escolha** (marque todas as corretas), **verdadeiro ou falso** e **lacuna** (o nome exato, como `numColumns` ou `useLocalSearchParams`).

:::tip Leia o enunciado
- Em código, ache primeiro o `flexDirection`, a origem de cada cor e o tipo de cada valor
- Palavras como **não**, **sempre**, **só** e **todos** mudam a resposta
- O gabarito não aparece ao enviar: ele é liberado depois da correção
:::

---

## :icon[flask-conical] No laboratório

**40 minutos.** A tela **Perfil** completa, a partir do protótipo da aula 78, e a **v1 da Lojinha**.

:::steps
1. Protótipo em `src/telas/Perfil.js`, com o UI kit e tokens; `app/(tabs)/perfil.js` só reexporta
2. Os 4 estados: `Esqueleto`, `EstadoErro` com "Tentar novamente", `EstadoVazio` para visitante e a tela com dados
3. "Sair" confirma com `Alert.alert` e vai a `/entrar` com `router.replace`
4. Checklist de entrega: leitor de tela, fonte em 200%, nome longo, tema escuro, celular deitado
5. Vídeo de até 20 segundos navegando pelas 5 telas, no README
6. `git add .`, `git commit -m "v1 Lojinha"` e `git push`
:::

**Critérios**: fiel ao protótipo, só tokens, 4 estados, checklist completo, vídeo no README. Entrega: link do repositório no sistema. Depois, a **Prova 4**.

---

## Resumo

:::summary
- Layout e visual: flex em coluna, `row` troca os eixos; cor do tema com `useTema()`, medidas dos tokens e peças repetidas no UI kit
- Listas e formulários: `FlatList`, `SectionList` e `Campo`, com validação e preço pelas regras do `lojinha-regras`
- Navegação: cada arquivo em `app/` é uma rota, com pilha, abas e modal; parâmetro de rota chega como string
- Qualidade: rótulo e 44 por 44 no toque, fonte grande sem cortes, 4 estados e animação só com `opacity` e `transform`
- Armadilhas: eixos trocados, cor fixa, `id` sem `Number`, `numColumns` sem trocar a `key` e ícone sem rótulo
:::

Enunciado fácil demais? Procure uma dessas armadilhas. Agora, a **Prova 4**. No E41, o projeto em equipe: um app novo, do briefing ao Demo Day.
