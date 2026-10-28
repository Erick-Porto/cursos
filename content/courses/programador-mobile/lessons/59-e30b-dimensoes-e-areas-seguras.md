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

## Funcionava no meu celular

Você testa o app do banco no seu Android e está tudo certo. Na apresentação, o cliente abre num iPhone:

- o saldo aparece **atrás do relógio e da câmera**
- o botão "Pagar" fica colado na **barra de gestos**, meio escondido
- deitado, o cartão de 360 de largura ocupa metade da tela e o resto fica vazio

Nada disso aparecia no seu aparelho. Celulares diferentes têm telas diferentes, e o app precisa se adaptar sozinho, sem um ajuste para cada modelo.

:::question
O que precisa mudar no código para a mesma tela funcionar em todos esses aparelhos?
:::

---

## :icon[smartphone] Pontos, não pixels

Quando você escreve `width: 100`, não são 100 pixels: são 100 **pontos lógicos** (no Android, chamados de *dp*). O aparelho multiplica pela própria **densidade** para chegar aos pixels físicos.

| Aparelho | Largura em pontos | Densidade | Largura em pixels |
|---|---|---|---|
| Android simples | 360 | 2 | 720 |
| Android topo de linha | 360 | 3 | 1080 |
| iPhone recente | 393 | 3 | 1179 |
| Tablet | 800 | 2 | 1600 |

Os dois Android têm a mesma largura em pontos: o mesmo layout cabe igual nos dois, só fica mais nítido no segundo. O que muda de verdade entre aparelhos é **quantos pontos cabem**: de 360 a 800 ou mais.

---

## :icon[rotate-cw] useWindowDimensions: a medida da tela

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

O hook devolve largura e altura da janela em pontos e **redesenha o componente** quando elas mudam: ao girar o celular ou ao dividir a tela com outro app. Tutoriais antigos usam `Dimensions.get('window')`, que devolve a medida do momento da chamada e não redesenha nada ao girar. Prefira o hook.

:::warning Para testar a rotação
O template trava o app em retrato. No `app.json`, troque `"orientation": "portrait"` por `"default"`, reinicie o `npx expo start` e ligue a rotação automática do celular.
:::

---

## :icon[percent] Porcentagem ou flex?

Porcentagem existe, como texto: `width: '50%'` é metade **do pai**, não da tela. Somada a `gap` ou `padding`, ela estoura:

```jsx
// 50% + 50% + gap de 8: passa 8 da borda
<View style={{ flexDirection: 'row', gap: 8 }}>
  <View style={{ width: '50%' }} />
  <View style={{ width: '50%' }} />
</View>

// flex divide o que sobra depois do gap: sempre cabe
<View style={{ flexDirection: 'row', gap: 8 }}>
  <View style={{ flex: 1 }} />
  <View style={{ flex: 1 }} />
</View>
```

| Use | Quando |
|---|---|
| `flex` | dividir o espaço entre irmãos, o caso mais comum |
| `'80%'` | uma fração do pai sem irmãos disputando, como `maxWidth: '80%'` num balão |
| `useWindowDimensions` | decidir pela tela: 2 ou 3 colunas, mostrar ou esconder um painel |

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
3. Tire a largura fixa: em `column`, o `stretch` padrão já estica o cartão até o `padding` do pai. Para não alargar demais no tablet: `width: '100%'`, `maxWidth: 600` e `alignSelf: 'center'`
:::

---

## :icon[shield] SafeAreaView: use a da biblioteca

A **área segura** é o que sobra da tela depois do notch, da barra de status, da barra de gestos e dos cantos arredondados. Nos projetos Expo novos, o Android também desenha o app de ponta a ponta, por trás das barras: o problema é das duas plataformas.

```jsx
// App.js: uma vez, em volta de tudo
<SafeAreaProvider>
  <Inicio />
</SafeAreaProvider>

// src/telas/Inicio.js: em cada tela
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView style={{ flex: 1 }}>{/* conteúdo */}</SafeAreaView>
```

Existe uma `SafeAreaView` no `react-native`, mas ela só funciona no iOS e está marcada como obsoleta. A de `react-native-safe-area-context` funciona nas duas plataformas e aceita `edges` para escolher as bordas: `edges={['top']}` protege só o topo.

---

## :icon[scan] useSafeAreaInsets: as medidas de cada borda

Às vezes você quer o **fundo** do cabeçalho subindo até a borda, por trás do relógio, e só o **conteúdo** descendo. `useSafeAreaInsets` devolve quanto cada borda está ocupada, em pontos:

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

## :icon[sun] StatusBar: a cor do relógio e da bateria

`StatusBar`, de `expo-status-bar`, escolhe a cor dos ícones da barra de status. Ela já vem no `App.js` do template:

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

## :icon[split] Platform: um detalhe por sistema

`Platform.OS` diz onde o app está rodando: `'ios'`, `'android'` ou `'web'`. `Platform.select` escolhe um valor por plataforma. Exemplo: o cupom de desconto em fonte monoespaçada, que tem nome diferente em cada sistema.

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

:::tip Use pouco
Se você está escrevendo `Platform.OS` para acertar o topo da tela, pare: isso é trabalho da área segura. `Platform` serve para diferenças reais entre sistemas, como fontes e o comportamento do teclado (E35).
:::

---

## Exemplo: cabeçalho que respeita o notch

Fundo escuro até a borda de cima, título logo abaixo do notch, relógio em branco:

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
- Use `flex: 1` para ocupar o resto e `minHeight` quando precisar de um mínimo
- Medida fixa é normal no que não tem texto dentro: foto, ícone, avatar
- Foto que acompanha a largura: `aspectRatio: 1` no lugar de `height`

---

## :icon[triangle-alert] Erros comuns

:::warning
- Importar `SafeAreaView` de `react-native`: no Android não protege nada. Importe de `react-native-safe-area-context`
- `useSafeAreaInsets` sem `SafeAreaProvider` no `App.js`: tela vermelha com `No safe area value available`
- `paddingTop: 44` "para fugir do notch": acerta um aparelho e erra todos os outros
- `Dimensions.get('window')` no topo do arquivo: lê a medida uma vez e não acompanha a rotação
- `<StatusBar style="dark" />` sobre cabeçalho escuro: hora e bateria somem
:::

---

## Resumo

:::summary
- Medidas são pontos lógicos; o aparelho multiplica pela densidade para chegar aos pixels
- `useWindowDimensions` devolve largura e altura da tela e redesenha ao girar
- `flex` divide o espaço entre irmãos; porcentagem é fração do pai; a medida da tela serve para decisões
- `SafeAreaView` e `useSafeAreaInsets` vêm de `react-native-safe-area-context` e valem nas duas plataformas
- `StatusBar` contrasta os ícones do topo com o fundo; `Platform` resolve diferenças reais entre sistemas
:::

---

## :icon[store] Lojinha: o app herda o lojinha-regras

Até o E40, você constrói a **Lojinha**: um catálogo com carrinho que sai do wireframe de hoje e vira um app com 5 telas. As regras de negócio você já escreveu, no `lojinha-regras`. O app não reescreve nenhuma conta: ele **copia a pasta `src/`**.

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

O **Metro**, o empacotador que o `npx expo start` liga, lê os módulos do Node sem mudar nada:

- `from './precos.js'`: a extensão que o Node exige funciona igual
- os barris do E11 também: `from '../regras/index.js'`
- nos arquivos novos do app, a extensão é opcional; as próximas aulas escrevem sem ela

:::tip O catálogo fica no produtos.js
O app lê o literal de `produtos.js`, com `estoque` e o `Map` `produtosPorId`. O `catalogo.json` era a cópia que os scripts liam com `fs`.
:::

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

Na tela: "12 produtos no catálogo" e "2 itens: R$ 449,80". São as mesmas funções que passaram nos seus testes do Jest, agora no celular.

:::warning
Tela vermelha com `Unable to resolve module`? Confira se ficou `lojinha/src/data/produtos.js`, e não `src/src/data`.
:::

---

## :icon[layout-grid] A tela Início em 4 wireframes

:::center
![Wireframe da tela Início: 1 cabeçalho, 2 cartões numa ScrollView com flex 1, 3 rodapé com total e o botão Finalizar, 4 abas de mesma largura](images/e30-tela-inicio.svg)
:::

1. **Cabeçalho**: `row`, `space-between`, `alignItems: 'center'`
2. **Cartões de produto**: `row`, foto fixa e textos (nome, descrição, preço) com `flex: 1`, dentro de uma `ScrollView` com `flex: 1`
3. **Rodapé com total** ("2 itens", R$ 449,80 e Finalizar), calculado com as regras do primeiro teste: `row`, `space-between`, sempre acima das abas
4. **Barra de abas falsa** (Início, Categorias, Carrinho, Perfil): `row`, cada aba com `flex: 1`; a ativa em negrito e colorida

Só `View`, `Text` e Flexbox: foto e ícones são caixas cinza. Fotos e ícones chegam no E32; abas de verdade, no E37.

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
