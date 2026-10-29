---
title: Dimensões e áreas seguras
summary: Pontos, useWindowDimensions, áreas seguras e StatusBar; e a Lojinha nasce com as regras do lojinha-regras.
module: layout-rn
duration_minutes: 40
objectives:
  - Medir a tela em pontos lógicos com useWindowDimensions
  - Proteger o conteúdo do notch e da barra de gestos com SafeAreaView e useSafeAreaInsets
  - Ajustar a barra de status e detalhes por plataforma com StatusBar e Platform
  - Criar o app Lojinha com o src/ do lojinha-regras e montar a tela inicial em wireframe
---

# Dimensões e áreas seguras

Programador Mobile · Encontro E30 · Aula 59 de 89

---

## O que você vai aprender

:::goal
- Entender por que `width: 100` não são 100 pixels e ler a tela com `useWindowDimensions`
- Afastar o conteúdo do notch e da barra de gestos com `SafeAreaView` e `useSafeAreaInsets`
- Ajustar a barra de status e detalhes por sistema com `StatusBar` e `Platform`
- Criar o app **Lojinha** com o `src/` do `lojinha-regras` e montar a tela Início
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **ponto** | a medida das telas no React Native: tem quase o mesmo tamanho em qualquer celular |
| **densidade** | quantos pixels, os pontinhos de luz da tela, o aparelho usa em cada ponto |
| **notch** | o recorte da câmera no alto da tela |
| **barra de status** | a faixa do topo com o relógio, o sinal e a bateria |
| **área segura** | a parte da tela que nada cobre: nem o notch, nem as barras do sistema |
| **wireframe** | o rascunho de uma tela feito só com caixas, sem cor nem foto |

---

## Funcionava no meu celular

Você testa o app do banco no seu Android e está tudo certo. Na apresentação, o cliente abre num iPhone:

- o saldo aparece **atrás do relógio e da câmera**
- o botão "Pagar" fica colado na **barra de gestos**, a faixa de baixo onde o dedo desliza para sair do app
- deitado, o cartão de 360 de largura ocupa metade da tela e o resto fica vazio

Nada disso aparecia no seu aparelho. Celulares diferentes têm telas diferentes, e o app precisa se adaptar sozinho, sem um ajuste para cada modelo.

:::question
O que precisa mudar no código para a mesma tela funcionar em todos esses aparelhos?
:::

---

## Pontos e pixels

Um centímetro na régua tem o mesmo tamanho num caderno e num cartaz?

---

## :icon[smartphone] Pontos, não pixels

Quando você escreve `width: 100`, não são 100 pixels: são 100 **pontos lógicos** (no Android, chamados de *dp*). O aparelho multiplica pela própria **densidade** para chegar aos pixels físicos.

Pense numa régua: 1 centímetro tem o mesmo tamanho em qualquer folha. O ponto é o centímetro da tela. Os pixels são os pontinhos de luz que desenham cada centímetro: a tela boa usa mais pontinhos, e por isso fica mais nítida, mas o tamanho é o mesmo.

```jsx
<View style={{ width: 100, height: 100 }} />
// densidade 2: 200 pixels de largura; densidade 3: 300 pixels
```

Nos dois casos, o quadrado tem quase o mesmo tamanho na sua mão.

---

## :icon[table] Pontos na prática

O mesmo app, aberto em quatro aparelhos:

| Aparelho | Largura em pontos | Densidade | Largura em pixels |
|---|---|---|---|
| Android simples | 360 | 2 | 720 |
| Android topo de linha | 360 | 3 | 1080 |
| iPhone recente | 393 | 3 | 1179 |
| Tablet | 800 | 2 | 1600 |

Os dois Android têm a mesma largura em pontos: o mesmo layout cabe igual nos dois, só fica mais nítido no segundo. O que muda de verdade entre aparelhos é **quantos pontos cabem**: de 360 a 800 ou mais.

---

## Medir a tela

Como saber a largura da janela antes de comprar a cortina?

---

## :icon[rotate-cw] useWindowDimensions: a medida da tela

O **`useWindowDimensions`** é um hook, uma função do React que começa com `use` (E24). Ele mede a janela do app em pontos, como uma fita métrica sempre ligada:

```jsx
import { Text, useWindowDimensions } from 'react-native';

export default function Medidas() {
  const { width, height, scale } = useWindowDimensions();
  const deitado = width > height;

  return (
    <Text>
      {Math.round(width)} x {Math.round(height)} pontos, densidade {scale},
      {deitado ? ' paisagem' : ' retrato'}
    </Text>
  );
}
```

| Linha | O que ela diz |
|---|---|
| `const { width, height, scale } = ...` | "guarde a largura, a altura e a densidade da tela" |
| `const deitado = width > height` | "está deitado se a largura for maior que a altura" |
| `deitado ? ' paisagem' : ' retrato'` | "se deitado, escreva paisagem; senão, retrato" |

Na tela, algo como "393 x 852 pontos, densidade 3, retrato".

---

## :icon[refresh-cw] useWindowDimensions na prática

**Caso 1: girar o celular.** O hook **redesenha o componente** quando a medida muda: ao girar o celular ou ao dividir a tela com outro app. O texto do `Medidas` passa de "retrato" para "paisagem" sem recarregar.

**Caso 2: quantas colunas cabem.**

```jsx
const { width } = useWindowDimensions();
const colunas = width >= 600 ? 3 : 2;

<Text>Vitrine com {colunas} colunas</Text>
```

Na tela: num celular de 393, "Vitrine com 2 colunas"; num tablet de 800, "Vitrine com 3 colunas".

Tutoriais antigos usam `Dimensions.get('window')`, que devolve a medida do momento da chamada e não redesenha nada ao girar. Prefira o hook.

:::warning Para testar a rotação
O template trava o app em retrato. No `app.json`, troque `"orientation": "portrait"` por `"default"`, reinicie o `npx expo start` e ligue a rotação automática do celular.
:::

---

## Medidas flexíveis

Chegou mais um amigo: o que acontece com as fatias da pizza?

---

## :icon[percent] Porcentagem ou flex?

Uma **medida flexível** acompanha o tamanho de quem está em volta, em vez de um número fixo. Há dois jeitos:

- **Porcentagem**, escrita como texto: `width: '50%'` é metade **do pai**, não da tela
- **`flex`**: divide em fatias o que sobra, como as fatias de uma pizza: `flex: 1`

Somada a `gap` ou `padding`, a porcentagem pode estourar; o `flex` sempre cabe.

| Use | Quando |
|---|---|
| `flex` | dividir o espaço entre irmãos, o caso mais comum |
| `'80%'` | uma fração do pai sem irmãos disputando, como `maxWidth: '80%'` num balão |
| `useWindowDimensions` | decidir pela tela: 2 ou 3 colunas, mostrar ou esconder um painel |

---

## :icon[percent] Medidas flexíveis na prática

**Caso 1: dois cartões lado a lado, com porcentagem.**

```jsx
// 50% + 50% + gap de 8: passa 8 da borda
<View style={{ flexDirection: 'row', gap: 8 }}>
  <View style={{ width: '50%' }} />
  <View style={{ width: '50%' }} />
</View>
```

Na tela: o segundo cartão fica cortado na borda direita.

**Caso 2: os mesmos cartões, com `flex`.**

```jsx
// flex divide o que sobra depois do gap: sempre cabe
<View style={{ flexDirection: 'row', gap: 8 }}>
  <View style={{ flex: 1 }} />
  <View style={{ flex: 1 }} />
</View>
```

Na tela: os dois do mesmo tamanho, com o vão de 8 no meio, dentro da tela.

**Caso 3: o balão de mensagem**, `maxWidth: '80%'`: cresce com o texto, mas nunca passa de 80% da conversa.

---

## Pense

:::question
O cartão de produto foi feito com `width: 360` e ficou perfeito no seu celular, que tem 393 pontos de largura.

1. O que acontece num Android de 360 pontos, com `padding: 16` na tela?
2. E no seu celular deitado, com uns 850 pontos de largura?
3. Como reescrever o estilo para os três casos?
:::

:::tip Resposta
1. 360 + 16 + 16 = 392 não cabem em 360: a direita do cartão fica cortada
2. O cartão continua com 360 e sobra mais de meia tela vazia
3. Tire a largura fixa: em `column`, o `stretch` padrão já estica o cartão até o `padding` do pai. Para não alargar demais no tablet: `width: '100%'`, `maxWidth: 600` (largura máxima) e `alignSelf: 'center'`
:::

---

## :icon[ban] Evite altura fixa

A altura de um bloco com texto depende da fonte que a pessoa escolheu no celular, do tamanho da tela e da rotação.

```jsx
// frágil: corta o texto com fonte maior ou em tela baixa
cartao: { height: 120, padding: 12 },
lista: { height: 600 },

// robusto: a altura vem do conteúdo ou do espaço que sobra
cartao: { minHeight: 96, padding: 12 },
lista: { flex: 1 },
```

- Deixe conteúdo e `padding` definirem a altura
- Use `flex: 1` para ocupar o resto e `minHeight` (altura mínima) quando precisar de um mínimo
- Medida fixa é normal no que não tem texto dentro: foto, ícone, avatar
- Foto que acompanha a largura: `aspectRatio: 1` no lugar de `height`

---

## Área segura

Por que ninguém escreve em cima da espiral do caderno?

---

## :icon[shield] SafeAreaView: use a da biblioteca

A **área segura** é o que sobra da tela depois do notch, da barra de status, da barra de gestos e dos cantos arredondados. É como a margem de um caderno: você escreve dentro dela, longe do furo e da espiral. Nos projetos Expo novos, o Android também desenha o app de ponta a ponta, por trás das barras: o problema é das duas plataformas.

```jsx
// App.js: uma vez, em volta de tudo
<SafeAreaProvider>
  <Inicio />
</SafeAreaProvider>

// src/telas/Inicio.js: em cada tela
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView style={{ flex: 1 }}>{/* conteúdo */}</SafeAreaView>
```

Existe uma `SafeAreaView` no `react-native`, mas ela só funciona no iOS e está marcada como obsoleta. A de `react-native-safe-area-context` funciona nas duas plataformas e aceita `edges` (bordas) para escolher quais proteger: `edges={['top']}` protege só o topo.

---

## :icon[scan] useSafeAreaInsets: as medidas de cada borda

Às vezes você quer o **fundo** do cabeçalho subindo até a borda, por trás do relógio, e só o **conteúdo** descendo. `useSafeAreaInsets` devolve os *insets*, quanto cada borda está ocupada, em pontos:

```jsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const insets = useSafeAreaInsets();
// num iPhone com notch, em pé: { top: 59, right: 0, bottom: 34, left: 0 }

<View style={{ paddingTop: insets.top + 12, backgroundColor: '#0f172a' }}>
```

::::columns
:::col
![Comparação: com SafeAreaView, fundo e título do cabeçalho descem para baixo do notch; com useSafeAreaInsets, o fundo sobe até a borda e só o título desce insets.top + 12](images/e30-safeareaview-ou-insets.svg)
:::
:::col
`SafeAreaView` aplica o espaço sozinha: use na tela inteira. `useSafeAreaInsets` só devolve os números: use em fundos até a borda, rodapés e barras de abas.
:::
::::

No Android, os valores variam com o aparelho e com o tipo de navegação (gestos ou botões). Some sempre os insets ao seu espaçamento, nunca troque por um número fixo.

---

## :icon[shield-check] Área segura na prática

**Caso 1: a tela inteira protegida.** Nada atrás do notch nem da barra de gestos.

```jsx
<SafeAreaView style={{ flex: 1 }}>{/* conteúdo */}</SafeAreaView>
```

**Caso 2: só o topo protegido.** A barra de abas desce até a borda de baixo.

```jsx
<SafeAreaView edges={['top']} style={{ flex: 1 }}>{/* conteúdo */}</SafeAreaView>
```

**Caso 3: as abas, com fundo até a borda.** O fundo vai até embaixo; os textos ficam acima da barra de gestos.

```jsx
const insets = useSafeAreaInsets();

<View style={{ flexDirection: 'row', paddingBottom: insets.bottom }}>{/* abas */}</View>
```

---

## Barra de status

Onde você olha a hora no celular? E se ela sumir?

---

## :icon[sun] StatusBar: a cor do relógio e da bateria

A **barra de status** é a faixa do topo com o relógio e a bateria. `StatusBar`, de `expo-status-bar`, escolhe a cor dos ícones dela. Ela já vem no `App.js` do template:

```jsx
import { StatusBar } from 'expo-status-bar';

<StatusBar style="auto" />
```

| `style` | Ícones | Use quando |
|---|---|---|
| `"auto"` | acompanham o tema do sistema | o fundo da tela segue o tema |
| `"light"` | claros | o topo é escuro: cabeçalho colorido, foto |
| `"dark"` | escuros | o topo é sempre claro |

Ícones escuros sobre um cabeçalho escuro somem: a pessoa perde a hora e a bateria. Coloque a `StatusBar` dentro da tela, junto do fundo que ela precisa contrastar.

---

## :icon[sun] StatusBar na prática: o cabeçalho escuro

Fundo escuro até a borda de cima, título logo abaixo do notch e relógio em branco, com `style="light"`:

```jsx
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CabecalhoEscuro({ titulo }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[estilos.cabecalho, { paddingTop: insets.top + 12 }]}>
      <StatusBar style="light" />
      <Text style={estilos.titulo}>{titulo}</Text>
    </View>
  );
}
// cabecalho: { paddingBottom: 12, paddingHorizontal: 16, backgroundColor: '#0f172a' }
// titulo: { fontSize: 20, fontWeight: 'bold', color: '#ffffff' }
```

O espaço fixo (12) fica no `StyleSheet` e o variável (`insets.top`) entra pelo array de estilos. Na tela: num iPhone com notch, a faixa escura começa no topo e o título aparece logo abaixo da câmera; num Android, abaixo da barra de status. A tela que usa esse cabeçalho protege só o resto: `edges={['bottom', 'left', 'right']}`.

---

## Platform

O mesmo carregador serve na tomada de qualquer país?

---

## :icon[split] Platform: um detalhe por sistema

Android e iOS às vezes fazem a mesma coisa com nomes diferentes. Pense no adaptador de tomada: o carregador é o mesmo, só o encaixe muda de país.

- **`Platform.OS`** diz onde o app está rodando: `'ios'`, `'android'` ou `'web'`
- **`Platform.select({ ios: ..., android: ... })`** escolhe um valor por plataforma

:::tip Use pouco
Se você está escrevendo `Platform.OS` para acertar o topo da tela, pare: isso é trabalho da área segura. `Platform` serve para diferenças reais entre sistemas, como fontes e o comportamento do teclado (E35).
:::

---

## :icon[split] Platform na prática

**Caso 1: dizer onde o app roda.** **Caso 2: o cupom de desconto em fonte monoespaçada**, aquela em que toda letra tem a mesma largura, que tem nome diferente em cada sistema.

```jsx
import { Platform, StyleSheet, Text } from 'react-native';

<Text>Rodando no {Platform.OS === 'ios' ? 'iPhone' : 'Android'}</Text>
<Text style={estilos.cupom}>LOJA10</Text>

const estilos = StyleSheet.create({
  cupom: {
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
    fontSize: 18,
  },
});
```

- Caso 1, na tela: "Rodando no iPhone" ou "Rodando no Android"
- Caso 2: `Platform.select({ ios: 'Menlo', android: 'monospace' })` quer dizer "no iPhone, `'Menlo'`; no Android, `'monospace'`". Na tela, `LOJA10` com todas as letras da mesma largura, nos dois sistemas

---

## Mensagens de erro

A tela vermelha avisa. E quando a tela só sai torta, quem avisa?

---

## :icon[siren] Quando aparece um erro

A mensagem é a luz do painel do carro: diz o que aconteceu e onde.

| O que aparece | Quer dizer | O que fazer |
|---|---|---|
| `No safe area value available` | `useSafeAreaInsets` sem `SafeAreaProvider` no `App.js` | `SafeAreaProvider` em volta de tudo |
| no Android, o texto fica atrás do relógio | `SafeAreaView` importada de `react-native` | importar de `react-native-safe-area-context` |
| certo num celular, errado em outro | `paddingTop: 44` "para fugir do notch" | somar `insets.top` ao espaço |
| girou e a tela não se ajustou | `Dimensions.get('window')` no topo do arquivo, lido uma vez | `useWindowDimensions` |
| hora e bateria sumiram | `<StatusBar style="dark" />` sobre cabeçalho escuro | `style="light"` |

---

## A Lojinha no app

As regras que você testou no terminal funcionam no celular?

---

## :icon[store] Lojinha: o app herda o lojinha-regras

Até o E40, você constrói a **Lojinha**: um catálogo com carrinho que sai do wireframe de hoje e vira um app com 5 telas. As regras de negócio você já escreveu, no `lojinha-regras`. Como no E29, a lógica é copiada: o app **copia a pasta `src/`**.

- :icon[check] **Vão**: `data/`, `utils/`, `regras/`, `modelos/`, `api/` e `servicos/`, com `formatarPreco`, carrinho, frete, `Produto`, `Pedido` e a DummyJSON
- :icon[x] **Não vão**: `scripts/` e `catalogo.json`, feitos para o terminal, com `fs` e `process.argv`, que o celular não tem
- :icon[test-tube] **Ficam no `lojinha-regras`**: os `*.test.js`. O app não roda o Jest; as regras continuam sendo testadas lá, com `npm test`

Fora do `src/`, nada vai: `package.json`, configurações e o TypeScript do E12 (`tsconfig.json`, `rascunhos/`).

---

## :icon[folder-tree] Copiando o src/ para o app

:::steps
1. Crie o app `lojinha` ao lado do `lojinha-regras`, com o comando do laboratório
2. Copie a pasta `src/` inteira do `lojinha-regras` para dentro de `lojinha/`
3. Na cópia, apague `scripts/`, os `*.test.js` e o `catalogo.json`
:::

:::tip O catálogo fica no produtos.js
O app lê o literal de `produtos.js`, com `estoque` e o `Map` `produtosPorId`. O `catalogo.json` era a cópia que os scripts liam com `fs`.
:::

---

## :icon[package] O Metro lê os imports do Node

O **Metro** é o empacotador que o `npx expo start` liga: ele junta todos os arquivos do app num pacote só, que o celular baixa. Ele lê os módulos do Node sem mudar nada:

- `from './precos.js'`: a extensão que o Node exige funciona igual
- os barris do E11 também, o `index.js` que reúne o que a pasta exporta: `from '../regras/index.js'`
- nos arquivos novos do app, a extensão é opcional; as próximas aulas escrevem sem ela

---

## :icon[check-check] Primeiro teste: as regras no celular

Antes de desenhar a tela, prove que as regras chegaram. Troque o `App.js` por este teste provisório:

```jsx
import { Text, View } from 'react-native';
import { produtos } from './src/data/produtos.js';
import { adicionarItem, contarItens, subtotal } from './src/regras/carrinho.js';
import { formatarPreco } from './src/utils/formatar.js';

const itens = adicionarItem(adicionarItem([], produtos[0]), produtos[1]);

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{produtos.length} produtos no catálogo</Text>
      <Text>{contarItens(itens)} itens: {formatarPreco(subtotal(itens))}</Text>
    </View>
  );
}
```

A linha do `itens` começa com o carrinho vazio, `[]`, põe o produto 0 e depois o produto 1. Na tela: "12 produtos no catálogo" e "2 itens: R$ 449,80". São as mesmas funções que passaram nos seus testes do Jest, agora no celular.

:::warning
Tela vermelha com `Unable to resolve module`? Confira se ficou `lojinha/src/data/produtos.js`, e não `src/src/data`.
:::

---

## Wireframe

Antes de construir a casa, o que o pedreiro olha?

---

## :icon[layout-grid] A tela Início em 4 wireframes

Um **wireframe** é a planta de uma casa: mostra onde fica cada cômodo, sem móveis nem pintura. Na tela, são só caixas: foto e ícones viram caixas cinza.

:::center
![Wireframe da tela Início: 1 cabeçalho, 2 cartões numa ScrollView com flex 1, 3 rodapé com total e o botão Finalizar, 4 abas de mesma largura](images/e30-tela-inicio.svg)
:::

Só `View`, `Text` e Flexbox. Fotos e ícones chegam no E32; abas de verdade, no E37.

---

## :icon[rows-3] Os 4 wireframes em Flexbox

1. **Cabeçalho**: `row`, `space-between`, `alignItems: 'center'`
2. **Cartões de produto**: `row`, foto fixa e textos (nome, descrição, preço) com `flex: 1`, dentro de uma `ScrollView` com `flex: 1`
3. **Rodapé com total** ("2 itens", R$ 449,80 e Finalizar), calculado com as regras do primeiro teste: `row`, `space-between`, sempre acima das abas
4. **Barra de abas falsa** (Início, Categorias, Carrinho, Perfil): `row`, cada aba com `flex: 1`; a ativa em negrito e colorida

---

## Resumo

:::summary
- Medidas são pontos lógicos; o aparelho multiplica pela densidade para chegar aos pixels
- `useWindowDimensions` devolve largura e altura da tela e redesenha ao girar
- `flex` divide o espaço entre irmãos; porcentagem é fração do pai; a medida da tela serve para decisões
- `SafeAreaView` e `useSafeAreaInsets` vêm de `react-native-safe-area-context` e valem nas duas plataformas
- `StatusBar` contrasta os ícones do topo com o fundo; `Platform` resolve diferenças reais entre sistemas
- A Lojinha copia o `src/` do `lojinha-regras`: as regras rodam no celular sem mudar uma linha
:::

---

## :icon[flask-conical] No laboratório

:::steps
1. Ao lado do `lojinha-regras`: `npx create-expo-app@latest lojinha --template blank`, `cd lojinha` e `npx expo install react-native-safe-area-context`
2. No `app.json`, `"orientation": "default"`; rode `npx expo start` e abra no Expo Go
3. Copie o `src/` do `lojinha-regras` e rode o primeiro teste no `App.js`
4. `src/telas/Inicio.js`: `SafeAreaView`, `StatusBar` e os 4 wireframes com 2 produtos, preços por `formatarPreco`
5. `App.js`: só o `SafeAreaProvider` em volta de `<Inicio />`
6. Confira em pé e deitado: nada atrás do notch
7. Repositório `lojinha` no GitHub, `git commit -m "E30: wireframe da tela Início"` e `git push`
:::

**Critérios**: `src/` sem testes nem scripts; só `View`, `Text`, `ScrollView` e Flexbox; nenhuma altura fixa em texto; nada cortado, em pé e deitado. **Entrega**: link do repositório no sistema.

---

## :icon[milestone] Projeto 6 · Casas de adoção

Até o E40, além da Lojinha, você constrói sozinho um app para cadastrar e encontrar **casas de adoção** de cães e gatos: quem é voluntário cadastra a casa onde ajuda; quem quer adotar acha uma com vaga perto de casa.

- :icon[layout-list] lista por cidade, busca, filtros e favoritas
- :icon[file-text] cadastro validado, com o CEP que preenche o endereço
- :icon[smartphone] abas, tema claro e escuro, tablet e leitor de tela

São 11 etapas, uma por encontro, num repositório seu chamado `casas-de-adocao`. Entrega pela plataforma até o **início do E41**.

---

## :icon[milestone] Projeto 6 · Etapa 1: projeto e tela Início

No seu repositório `casas-de-adocao`:

- projeto Expo criado ao lado da `lojinha`, com a área segura e `"orientation": "default"`
- o [casas.js](materiais/projeto-6/casas.js) do curso copiado para `src/data/casas.js`
- `vagas(casa)` em `src/regras/casas.js`
- `src/telas/Inicio.js`: cabeçalho, chips (Todas, Cães, Gatos, Com vagas) e 3 cartões com a caixa da foto, nome, bairro e vagas, só com Flexbox
- nada atrás do notch, em pé e deitado

Commit: `Projeto 6: etapa 1, projeto e tela Início`. Enunciado completo e entrega: página do curso, em **Projetos**.
