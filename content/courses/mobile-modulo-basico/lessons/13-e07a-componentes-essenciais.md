---
title: Componentes essenciais do React Native
summary: View, Text, Image, ScrollView, TextInput e Pressable no lugar das tags HTML, com área segura.
module: react-native
duration_minutes: 35
objectives:
  - Mapear elementos HTML para componentes do React Native
  - Montar uma tela com View, Text, Image e Pressable
  - Usar a área segura do aparelho
---

# Componentes essenciais do React Native

Programador Mobile: Módulo Básico · Encontro E07 · Aula 13 de 18

---

## O que você vai aprender

:::goal
- Quais componentes substituem `div`, `p`, `img`, `input` e `button`
- Como organizar uma tela com `View` e `Text`
- Como mostrar imagens, campos de texto e botões que respondem ao toque
- Como manter o conteúdo fora do notch com `SafeAreaView`
:::

---

## Não existe div

Você abre o `App.js` do `minhas-tarefas-mobile`, digita `<div>` por hábito e o Expo mostra uma tela vermelha.

No celular não há navegador nem HTML. O React Native traduz cada componente para uma **peça nativa** do Android ou do iOS, e essas peças têm outros nomes.

A boa notícia: o vocabulário é pequeno. Seis componentes montam quase qualquer tela, e a lógica de componentes, props e estado que você já usa na web continua igual.

:::question
Se não existe `div`, `p` nem `img`, com o que você monta a tela de perfil de um app?
:::

---

## :icon[arrow-left-right] De HTML para React Native

| Na web (HTML) | No React Native | Para que serve |
|---|---|---|
| `div` | `View` | caixa que organiza |
| `p`, `span`, `h1` | `Text` | qualquer texto |
| `img` | `Image` | imagem local ou da internet |
| `input` | `TextInput` | campo digitável |
| `button` | `Button` ou `Pressable` | responder ao toque |
| área com rolagem | `ScrollView` | conteúdo maior que a tela |

Todos vêm do pacote `react-native`, importados pelo nome:

```jsx
import { View, Text, Image, TextInput, Pressable, ScrollView } from 'react-native';
```

---

## View: a caixa que organiza

`View` é a `div` do React Native: não mostra nada sozinha, só **agrupa** o que está dentro. Você aninha Views para dividir a tela em regiões.

::::columns
:::col
![Diagrama: a View de fora é a tela e contém duas Views, o cabeçalho e a lista, cada uma com um Text; sem estilo, as Views não aparecem e a tela mostra só os dois textos, um abaixo do outro](images/e07-views-aninhadas.svg)
:::
:::col
```jsx
import { View, Text } from 'react-native';

export default function App() {
  return (
    <View>
      <View>
        <Text>Minhas Tarefas</Text>
      </View>
      <View>
        <Text>Estudar React Native</Text>
      </View>
    </View>
  );
}
```
:::
::::

A View de fora é a tela; as duas de dentro são o cabeçalho e a lista. Sem estilo, as caixas são invisíveis: aparecem só os textos, um abaixo do outro.

---

## Text: todo texto vive dentro de Text

No React Native, **qualquer** texto (título, rótulo, número) precisa estar dentro de um `Text`. Para destacar um trecho, aninhe um `Text` dentro de outro:

```jsx
<Text>
  Prioridade: <Text style={{ fontWeight: 'bold' }}>alta</Text>
</Text>
```

O `Text` de dentro herda a fonte do de fora e muda só o que você pedir. A prop `style` ganha uma aula inteira a seguir; aqui, repare só no aninhamento.

:::warning Texto solto quebra o app
`<View>Olá</View>` derruba o app com a tela vermelha `Text strings must be rendered within a <Text> component`. Envolva: `<View><Text>Olá</Text></View>`.
:::

---

## Image: local e remota

Uma imagem **local** fica na pasta `assets/` do projeto e entra com `require`. Uma imagem **remota** vem de um endereço na internet, em um objeto com `uri` (duas chaves: uma do JSX, outra do objeto).

```jsx
import { Image } from 'react-native';

// arquivo do projeto: o tamanho vem do próprio arquivo
<Image source={require('./assets/foto.png')} />

// endereço na internet: precisa de width e height
<Image
  source={{ uri: 'https://picsum.photos/200' }}
  style={{ width: 200, height: 200 }}
/>
```

:::info
O aparelho não sabe o tamanho de uma imagem remota antes de baixá-la. Sem `width` e `height`, ela ocupa zero pixels e simplesmente não aparece, sem nenhum erro.
:::

---

## ScrollView: quando o conteúdo passa da tela

Uma `View` não rola. O que não cabe na tela fica cortado, sem aviso. Para o usuário deslizar o dedo e ver o resto, troque a View de fora por `ScrollView`.

```jsx
import { ScrollView, Text } from 'react-native';

export default function Lista() {
  return (
    <ScrollView>
      <Text>Tarefa 1</Text>
      <Text>Tarefa 2</Text>
      {/* ... muitas outras ... */}
      <Text>Tarefa 30</Text>
    </ScrollView>
  );
}
```

:::info
Para listas longas, com dezenas ou centenas de itens, existe a `FlatList`, que só desenha o que está visível. Ela chega no próximo encontro.
:::

---

## TextInput: o campo de digitação

`TextInput` é o `input` do celular. Ele abre o teclado ao receber o toque e avisa cada mudança pelo `onChangeText`.

```jsx
import { TextInput } from 'react-native';

<TextInput
  placeholder="Nova tarefa"
  onChangeText={(texto) => console.log(texto)}
/>
```

- `placeholder`: a dica cinza que aparece antes de digitar
- `onChangeText` entrega o **texto pronto**, não um evento. Na web você escrevia `event.target.value`; aqui é só `texto`
- Nesta aula o campo é só visual. Guardar o que foi digitado em um estado é assunto do próximo encontro

:::tip
Sem estilo, o campo pode parecer invisível, principalmente no iPhone. Toque onde ele deveria estar: o teclado abre.
:::

---

## Button ou Pressable?

Os dois respondem ao toque com `onPress`. A diferença é quanto você controla a aparência.

```jsx
import { Button, Pressable, Text } from 'react-native';

// Button: pronto, mas rígido. Só título e onPress.
<Button title="Seguir" onPress={() => console.log('seguiu')} />

// Pressable: qualquer conteúdo dentro, estilo seu.
<Pressable onPress={() => console.log('seguiu')}>
  <Text>Seguir</Text>
</Pressable>
```

| | `Button` | `Pressable` |
|---|---|---|
| Conteúdo | só texto, pela prop `title` | qualquer coisa: texto, imagem, ícone |
| Aparência | a do sistema; muda entre Android e iOS | você define com `style` |
| Quando usar | protótipo rápido | o app de verdade |

No projeto, use `Pressable`.

---

## Pense

:::question
Imagine a tela de um app de música tocando uma faixa: a capa do álbum, o nome da música, o nome do artista e três botões (anterior, tocar, próxima).

O que vira `View`, o que vira `Text`, o que vira `Image` e o que vira `Pressable`?
:::

:::info Resposta
- `Image`: a capa do álbum
- `Text`: o nome da música e o nome do artista, cada um no seu `Text`
- `Pressable`: os três botões, cada um com um `Text` dentro
- `View`: a tela inteira, o bloco dos textos e a linha dos botões; ela não aparece, só organiza
:::

---

## :icon[smartphone] SafeAreaView: fora do notch

::::columns
:::col
![Antes e depois: sem SafeAreaView, o título Minhas Tarefas fica atrás do relógio e da câmera; com SafeAreaView, ele começa abaixo da barra de status, dentro da área segura](images/e07-area-segura.svg)
:::
:::col
Em celulares com notch ou barra de status, o conteúdo começa **atrás do relógio e da câmera**. A **área segura** é a parte da tela que nada cobre.
:::
::::

Instale o pacote pelo Expo, que escolhe a versão compatível com o projeto:

```bash
npx expo install react-native-safe-area-context
```

```jsx
import { Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Text>Minhas Tarefas</Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
```

`SafeAreaProvider` envolve o app uma única vez; `SafeAreaView` envolve o conteúdo de cada tela.

---

## Exemplo: tela de perfil

Foto, nome, biografia e um botão em quatro componentes. Salve uma `foto.png` em `assets/` e crie `Perfil.js` ao lado de `App.js`:

```jsx
import { View, Text, Image, Pressable } from 'react-native';

export default function Perfil() {
  return (
    <View>
      <Image source={require('./assets/foto.png')} />
      <Text>Ana Souza</Text>
      <Text>Desenvolvedora em formação. Estudando React Native.</Text>
      <Pressable onPress={() => console.log('seguindo')}>
        <Text>Seguir</Text>
      </Pressable>
    </View>
  );
}
```

Na tela: a foto, os dois textos e a palavra "Seguir", um abaixo do outro, colados no canto superior esquerdo e com a fonte padrão. Funciona, mas ainda não parece um app. Toque em "Seguir" e veja `seguindo` no terminal do Expo.

---

## :icon[bug] Erros comuns

:::warning
- Texto solto fora de `Text`: `<View>Olá</View>` derruba o app na hora
- `Image` remota sem `width` e `height`: nada aparece e nenhum erro avisa
- `onClick` em vez de `onPress`: o botão não responde e ninguém reclama
- `div`, `p` ou `span` por hábito: o React Native não conhece tags HTML
- Esquecer o `import` de `react-native`: o componente fica indefinido e a tela vermelha aponta o nome
:::

---

## Resumo

:::summary
- Não há HTML no celular: `View`, `Text`, `Image`, `TextInput`, `ScrollView` e `Pressable` fazem o papel das tags
- `View` só organiza; todo texto fica dentro de `Text`
- `Image` local usa `require`; a remota usa `{ uri }` e exige `width` e `height`
- `Pressable` aceita qualquer conteúdo e responde a `onPress`
- `SafeAreaView` mantém a tela fora do notch e da barra de status
:::

---

## :icon[arrow-right] Próximos passos

A tela de perfil funciona, mas tudo está colado no canto, sem cor e com a mesma fonte. Falta o que na web você fazia com CSS.

Na próxima aula, **Estilo com StyleSheet**:

- cores, bordas e espaçamento sem nenhum arquivo `.css`
- Flexbox em três propriedades para alinhar qualquer coisa
- o `CartaoTarefa` do app `minhas-tarefas-mobile`, com estilo condicional por prioridade

Antes de seguir, deixe o `react-native-safe-area-context` instalado no seu projeto: o laboratório começa por ele.
