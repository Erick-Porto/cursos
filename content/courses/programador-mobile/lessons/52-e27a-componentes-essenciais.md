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

Programador Mobile · Encontro E27 · Aula 52 de 89

---

## O que você vai aprender

:::goal
- Quais componentes substituem `div`, `p`, `img`, `input` e `button`
- Como organizar uma tela com `View` e `Text`
- Como mostrar imagens, campos de texto e botões que respondem ao toque
- Como manter o conteúdo fora do notch com `SafeAreaView`
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **componente nativo** | uma peça de tela do próprio Android ou iOS: um texto, uma imagem, um botão |
| **imagem local** | uma imagem guardada na pasta do projeto, que vai junto com o app |
| **imagem remota** | uma imagem que vem de um endereço na internet |
| **rolagem** | deslizar o dedo para ver o que não coube na tela (*scroll*, em inglês) |
| **notch** | o recorte no topo da tela, onde ficam a câmera e o alto-falante |
| **área segura** | a parte da tela que o notch e a barra de status não cobrem |

---

## Não existe div

Você abre o `App.js` do `minhas-tarefas-mobile`, digita `<div>` por hábito e o Expo mostra uma tela vermelha.

No celular não há navegador nem HTML. O React Native traduz cada componente para uma **peça nativa** do Android ou do iOS, e essas peças têm outros nomes.

A boa notícia: o vocabulário é pequeno. Seis componentes montam quase qualquer tela, e a lógica de componentes, props e estado do E22 e do E23 continua igual.

:::question
Se não existe `div`, `p` nem `img`, com o que você monta a tela de perfil de um app?
:::

---

## Componentes nativos

Se as peças de Lego fossem de outra marca, o que mudaria?

---

## :icon[arrow-left-right] De HTML para React Native

Os componentes continuam sendo peças de Lego (E22): pequenas, reaproveitáveis, uma encaixando na outra. No celular, as peças vêm de outra caixa, com outros nomes. Cada uma faz o papel de uma tag do HTML:

| Na web (HTML) | No React Native | Para que serve |
|---|---|---|
| `div` | `View` | caixa que organiza |
| `p`, `span`, `h1` | `Text` | qualquer texto |
| `img` | `Image` | imagem local ou da internet |
| `input` | `TextInput` | campo digitável |
| `button` | `Button` ou `Pressable` | responder ao toque |
| área com rolagem | `ScrollView` | conteúdo maior que a tela |

Todos vêm do pacote `react-native`, importados pelo nome, entre chaves:

```jsx
import { View, Text, Image, TextInput, Pressable, ScrollView } from 'react-native';
```

---

## :icon[code-xml] Componentes nativos na prática

Três pedaços da web traduzidos para o celular:

```jsx
// título: na web, <h1>Minhas Tarefas</h1>
<Text>Minhas Tarefas</Text>

// campo: na web, <input placeholder="Nova tarefa" />
<TextInput placeholder="Nova tarefa" />

// botão: na web, <button>Adicionar</button>
<Pressable>
  <Text>Adicionar</Text>
</Pressable>
```

- O título e o texto do botão vão dentro de `Text`
- O botão vira `Pressable`, com o texto dentro dele
- Na tela, aparecem um título, um campo com a dica "Nova tarefa" e a palavra "Adicionar", ainda sem estilo

---

## View

Para que serve uma caixa organizadora na prateleira?

---

## View: a caixa que organiza

`View` é a `div` do React Native: uma **caixa** que não mostra nada sozinha. Ela só **agrupa** o que está dentro, como uma caixa organizadora na prateleira. Você coloca Views dentro de Views para dividir a tela em regiões.

```jsx
<View>
  {/* o que fica junto vai aqui dentro */}
</View>
```

- Uma `View` pode ter outras `View`, textos, imagens e botões dentro
- Sem estilo, ela é invisível: só os filhos aparecem
- O `{/* ... */}` é um comentário dentro do JSX: o app ignora

---

## View na prática

Uma tela com duas regiões, o cabeçalho e a lista:

::::columns
:::col
![Diagrama: a View de fora é a tela e contém duas Views, o cabeçalho e a lista, cada uma com um Text; sem estilo, as Views não aparecem e a tela mostra só os dois textos, um abaixo do outro](images/e27-views-aninhadas.svg)
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

## Text

Nos quadrinhos, onde fica a fala de um personagem?

---

## Text: todo texto vive dentro de Text

No React Native, **qualquer** texto (título, rótulo, número) precisa estar dentro de um `Text`. Pense no balão de fala dos quadrinhos: fala fora do balão não aparece.

```jsx
<Text>Minhas Tarefas</Text>
```

- O texto vai entre a abertura `<Text>` e o fechamento `</Text>`
- Um número calculado também vai dentro: `<Text>{pendentes} pendentes</Text>`

:::warning Texto solto quebra o app
`<View>Olá</View>` derruba o app com a tela vermelha `Text strings must be rendered within a <Text> component`. Envolva: `<View><Text>Olá</Text></View>`.
:::

---

## :icon[message-square] Text na prática

Para destacar um trecho, **aninhe** um `Text` dentro de outro, ou seja, coloque um dentro do outro:

```jsx
<Text>
  Prioridade: <Text style={{ fontWeight: 'bold' }}>alta</Text>
</Text>
```

Na tela: "Prioridade: **alta**", com só a palavra "alta" em negrito.

O `Text` de dentro herda a fonte do de fora e muda só o que você pedir: aqui, `fontWeight: 'bold'` deixa "alta" em negrito. A prop `style` ganha uma aula inteira, a aula 53; aqui, repare só no aninhamento.

| Você quer mostrar | Escreva |
|---|---|
| um título | `<Text>Minhas Tarefas</Text>` |
| um texto com um número | `<Text>{pendentes} pendentes</Text>` |
| uma palavra destacada | um `Text` dentro de outro |

---

## Image

Foto da galeria ou foto aberta por um link: qual a diferença?

---

## Image: local e remota

A `Image` mostra uma imagem. Ela vem de um de dois lugares, como uma foto salva na galeria ou uma foto aberta por um link:

- **Local**: o arquivo fica em `assets/` e entra com `require`, que pede ao Expo para embutir o arquivo no app. Código continua com o `import` do E11
- **Remota**: vem da internet, num objeto com `uri`, o endereço. As duas chaves são a janela do JSX (E21) e o objeto (E08)

A imagem local já sabe o próprio tamanho. A remota não: ela precisa de `width` (largura) e `height` (altura).

---

## :icon[image] Image na prática

Uma imagem de cada tipo:

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

Na tela: a `foto.png` no tamanho do arquivo e, embaixo, uma foto da internet num quadrado de 200 por 200.

:::info
O aparelho não sabe o tamanho de uma imagem remota antes de baixá-la. Sem `width` e `height`, ela ocupa zero pixels e não aparece, sem nenhum erro.
:::

---

## ScrollView

Como você lê uma notícia que não cabe na tela do celular?

---

## ScrollView: quando o conteúdo passa da tela

Uma `View` não rola: o que não cabe na tela fica cortado, sem aviso. A **`ScrollView`** é a caixa que rola. Como numa notícia comprida no celular, o usuário desliza o dedo e vê o resto.

```jsx
<ScrollView>
  {/* conteúdo maior que a tela */}
</ScrollView>
```

Para isso, troque a View de fora por `ScrollView`. Ela serve para telas com poucos itens fixos, escritos no JSX: um perfil, um formulário, um texto comprido.

---

## :icon[scroll-text] ScrollView na prática

Trinta tarefas escritas à mão, mais do que cabe na tela:

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

Na tela: as primeiras tarefas e, ao deslizar o dedo para cima, as outras, até a Tarefa 30. Com `View` no lugar de `ScrollView`, as últimas ficariam cortadas.

:::info
Para listas longas, com dezenas ou centenas de itens, existe a `FlatList`, que só desenha o que está visível. Ela chega no E28.
:::

---

## TextInput

No WhatsApp, onde você digita a mensagem?

---

## TextInput: o campo de digitação

`TextInput` (entrada de texto) é o `input` do celular: o campo onde você digita, como o da mensagem no WhatsApp. Ao receber o toque, ele abre o teclado e avisa cada mudança pelo `onChangeText` ("quando o texto mudar").

- `placeholder`: a dica cinza que aparece antes de digitar
- `onChangeText` chama uma função a cada letra e entrega o **texto pronto**, não um evento. No E23 você escrevia `e.target.value`; aqui é só `texto`
- Guardar o texto, com o `useState` do E23, é assunto do E28. Hoje o campo só mostra o texto no terminal

:::tip
Sem estilo, o campo pode parecer invisível, principalmente no iPhone. Toque onde ele deveria estar: o teclado abre.
:::

---

## :icon[keyboard] TextInput na prática

Um campo de nova tarefa que mostra no terminal tudo o que você digita:

```jsx
import { TextInput } from 'react-native';

<TextInput
  placeholder="Nova tarefa"
  onChangeText={(texto) => console.log(texto)}
/>
```

Toque no campo e digite "pão". No terminal do Expo, uma linha por letra, sempre com o texto inteiro até ali:

```plaintext
 LOG  p
 LOG  pã
 LOG  pão
```

O `onChangeText` entrega o texto pronto: nada de `e.target.value`.

---

## Botões

Camiseta de tamanho único ou roupa sob medida: qual fica do seu jeito?

---

## Button ou Pressable?

Os dois respondem ao toque com `onPress` ("ao pressionar"). A diferença é quanto você controla a aparência: o `Button` é roupa pronta, de tamanho único; o `Pressable` é roupa sob medida.

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

## :icon[mouse-pointer-click] Botões na prática

Dois usos comuns do `Pressable`, com o que aparece no terminal a cada toque:

```jsx
// 1. um botão de texto
<Pressable onPress={() => console.log('adicionar')}>
  <Text>Adicionar</Text>
</Pressable>

// 2. um cartão inteiro que responde ao toque
<Pressable onPress={() => console.log('abrir tarefa')}>
  <Text>Estudar React Native</Text>
  <Text>alta</Text>
</Pressable>
```

```plaintext
 LOG  adicionar
 LOG  abrir tarefa
```

O `Pressable` aceita vários filhos: no segundo caso, tocar em qualquer parte do cartão chama a mesma função.

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

Para ver no celular, importe no `App.js` (`import Perfil from './Perfil';`) e use `<Perfil />` na tela.

Na tela: a foto, os dois textos e a palavra "Seguir", um abaixo do outro, colados no canto superior esquerdo e com a fonte padrão. Funciona, mas ainda não parece um app. Toque em "Seguir" e veja `seguindo` no terminal do Expo.

---

## Pense

:::question
Imagine a tela de um app de música tocando uma faixa: a capa do álbum, o nome da música, o nome do artista e três botões (anterior, tocar, próxima).

O que vira `View`, o que vira `Text`, o que vira `Image` e o que vira `Pressable`?
:::

:::tip Resposta
- `Image`: a capa do álbum
- `Text`: o nome da música e o nome do artista, cada um no seu `Text`
- `Pressable`: os três botões, cada um com um `Text` dentro
- `View`: a tela inteira, o bloco dos textos e a linha dos botões; ela não aparece, só organiza
:::

---

## Área segura

Num porta-retratos, o que acontece com a parte da foto atrás da moldura?

---

## :icon[smartphone] SafeAreaView: fora do notch

::::columns
:::col
![Antes e depois: sem SafeAreaView, o título Minhas Tarefas fica atrás do relógio e da câmera; com SafeAreaView, ele começa abaixo da barra de status, dentro da área segura](images/e27-area-segura.svg)
:::
:::col
Em celulares com notch ou barra de status, o conteúdo começa **atrás do relógio e da câmera**.

É como a moldura de um porta-retratos: a parte da foto que fica atrás dela some. A **área segura** é a parte da tela que nada cobre.

O **`SafeAreaView`** é uma `View` que começa dentro da área segura.
:::
::::

---

## :icon[download] Área segura na prática

O `SafeAreaView` vem de um pacote à parte. Instale pelo Expo, que escolhe a versão compatível com o projeto (o `npm install` não escolhe):

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

`SafeAreaProvider` envolve o app uma única vez; `SafeAreaView` envolve o conteúdo de cada tela. Na tela: "Minhas Tarefas" logo abaixo do relógio, inteiro, em qualquer celular.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Text strings must be rendered within a <Text> component` | "texto precisa estar dentro de `<Text>`": há texto solto | envolver o texto em `<Text>` |
| o nome `div`, `p` ou `span` | uma tag HTML, por hábito | trocar pelo componente: `View`, `Text` |
| o nome de um componente, como `Pressable` | ele faltou no `import` | acrescentar ao `import { ... } from 'react-native'` |
| nenhuma; a imagem não aparece | imagem remota sem tamanho | `width` e `height` no `style` |
| nenhuma; o botão não responde | `onClick` no lugar de `onPress` | trocar por `onPress` |

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
