---
title: Componentes nativos e estilo
summary: "Etapa 2 do Gota: o topo com StyleSheet, a gota com Image e o seu BotaoCopo, que responde ao toque."
module: react-native
duration_minutes: 90
objectives:
  - Dar estilo a textos e caixas com StyleSheet.create, a prop style e as cores do tema
  - Mostrar uma imagem do projeto com Image, require, width e height
  - Responder ao toque com Pressable e onPress e ler o console.log no terminal
  - Criar o BotaoCopo com a prop ml e pôr os copos em coluna ou lado a lado
---

# Componentes nativos e estilo

Programador Mobile · Encontro E30 · Aula 30 de 45

---

## O que você vai aprender

:::goal
- Dar tamanho, negrito e cor aos textos do Gota com o `StyleSheet`
- Usar as cores com nome do kit, sem escrever código de cor
- Mostrar a gota no topo do app com a `Image`
- Responder ao toque com o `Pressable` e ler o aviso no terminal
- Criar o seu componente, o `BotaoCopo`, e pôr três copos lado a lado
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **estilo** | a aparência de uma peça: tamanho, cor, espaço |
| **`StyleSheet`** | (*folha de estilos*) a lista dos estilos de um arquivo, cada um com nome |
| **`Image`** | a peça que mostra uma imagem |
| **`Pressable`** | (*que dá para apertar*) a peça que sente o toque do dedo |
| **`onPress`** | (*ao pressionar*) o que fazer quando a pessoa toca |
| **coluna** | o jeito padrão da tela: uma peça embaixo da outra |

---

## O Gota ainda parece um bloco de notas

No E29, o Gota abriu no seu celular. Mas tudo tem a mesma letra preta e pequena, e nada responde ao dedo.

| Hoje, no começo | No fim do encontro |
|---|---|
| "Gota" do tamanho do resto | "Gota" grande, em negrito e azul-escuro |
| a saudação em preto | a saudação em cinza |
| nenhuma imagem | a gota azul no topo |
| nenhum botão | três botões azuis: +200 ml, +300 ml e +500 ml |
| tocar não faz nada | cada toque avisa no terminal: `Copo de 300 ml` |

:::question
O que faz um app parecer um app, e não um bloco de notas?
:::

---

## Estilo no celular

No E01, o CSS pintava a página. No celular, onde fica a tinta?

---

## :icon[pencil] StyleSheet: o estilo é uma ficha

O celular não tem navegador, então não tem CSS. A pintura e os móveis do E01 continuam, escritos em JavaScript: cada **estilo** é uma ficha (um objeto), com um campo para cada detalhe da aparência.

```jsx
import { StyleSheet, Text } from 'react-native';

export default function Aviso() {
  return <Text style={estilos.aviso}>Hora de beber água</Text>;
}

const estilos = StyleSheet.create({
  aviso: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
```

- **`StyleSheet.create`** junta os estilos do arquivo numa ficha, `estilos`. Cada estilo tem um nome: aqui, `aviso`
- A prop **`style`** diz qual estilo a peça usa: `style={estilos.aviso}`
- O `estilos` fica no fim do arquivo. Funciona porque a tela só é desenhada depois que o arquivo inteiro foi lido

---

## :icon[arrow-left-right] Do CSS do E01 ao StyleSheet

Os nomes vêm do CSS do E01, escritos de outro jeito:

| No CSS | No `StyleSheet` | O que mudou |
|---|---|---|
| `font-size: 32px;` | `fontSize: 32,` | sem hífen: a palavra seguinte começa com maiúscula |
| `font-weight: bold;` | `fontWeight: 'bold',` | a palavra vira texto, entre aspas |
| `padding: 12px;` | `padding: 12,` | o número vai sem `px` |

- Emendar palavras com maiúscula no meio se chama **camelCase**: as maiúsculas são as corcovas do camelo
- **Sem `px`**: o celular mede em pontos e ajusta o ponto a cada tela. `fontSize: 16` parece do mesmo tamanho num celular simples e num caro
- No fim de cada campo, vírgula, como em toda ficha

---

## :icon[pencil] Estilo na prática

Um arquivo pode ter vários estilos, e um estilo pode servir a várias peças:

```jsx
const estilos = StyleSheet.create({
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  apoio: {
    fontSize: 14,
  },
});
```

| A peça | Na tela |
|---|---|
| `<Text style={estilos.titulo}>Gota</Text>` | "Gota", grande e em negrito |
| `<Text style={estilos.apoio}>às 14:05</Text>` | "às 14:05", pequeno |
| `<Text style={estilos.apoio}>de 2000 ml</Text>` | pequeno também: o mesmo estilo, outra peça |
| `<Text>Meta do dia</Text>` | sem `style`: preto, no tamanho padrão |

O `fontWeight` aceita `'bold'` (negrito) ou `'normal'`.

---

## :icon[tags] As cores do tema.js

O kit traz o `src/tema.js`, a paleta de tintas do Gota: cada cor tem um **nome**, e o código dela mora num lugar só. Quatro das nove cores:

```javascript
export const cores = {
  agua: '#0369a1', // azul da água: botões e barra
  titulo: '#0c4a6e', // títulos
  textoFraco: '#64748b', // texto de apoio, como a hora
  textoNoAzul: '#ffffff', // texto em cima do azul
};
```

```jsx
import { cores } from './src/tema';
// ...
    color: cores.titulo,
```

- `cores` é um `export` com nome: o `import` leva chaves, como no E16
- `cores.titulo` lê um campo da ficha e dá `'#0c4a6e'`, um código de cor como os do CSS do E01. Você não escreve nenhum: usa o nome
- O **`color`** é a cor da letra, como no CSS do E01
- Mudou uma cor no `tema.js`? O app inteiro muda junto

---

## :icon[notebook-pen] Exercícios: Estilo no celular

:::example Exercícios
1. Passe para o `StyleSheet` este CSS do cardápio: `font-size: 22px;`
2. Com o estilo `preco: { fontSize: 24, color: cores.agua }`, como aparecem os dois textos?
   ```jsx
   <Text style={estilos.preco}>R$ 15</Text>
   <Text>X-salada</Text>
   ```
3. Ache os dois enganos no estilo do horário do ônibus:
   ```jsx
   horario: {
     fontSize: '18px',
     font-weight: 'bold',
   },
   ```
4. Para o nome da academia: `color: cores.titulo` ou `color: '#0c4a6e'`? Por quê?
:::

:::tip Respostas
1. `fontSize: 22,`: camelCase e sem `px`
2. "R$ 15" na letra 24, azul; "X-salada" preto, no tamanho padrão
3. `font-weight`, com hífen, quebra o arquivo (`Unexpected token`): é `fontWeight`. O `'18px'` falha calado: é `fontSize: 18`
4. `cores.titulo`: o código mora só no `tema.js`, e mudar lá muda o app inteiro
:::

---

## :icon[milestone] Projeto 5 · Passo 1: o estilo do topo

O `gota` continua do ponto em que o E29 parou: `npx expo start` ligado e o app aberto no Expo Go.

No `App.js`, troque as duas linhas de `import` por estas três. O `StyleSheet` entra nas chaves, e a linha nova traz as cores:

```jsx
import { StyleSheet, Text, View } from 'react-native';
import Tela from './src/components/Tela';
import { cores } from './src/tema';
```

Nos dois `Text` do topo, a prop `style` (a frase da saudação é a sua):

```jsx
      <View>
        <Text style={estilos.titulo}>Gota</Text>
        <Text style={estilos.saudacao}>Olá, Ana! Bora beber água hoje?</Text>
      </View>
```

Se salvar agora, aparece a tela de erro, **Render Error**: o `estilos` ainda não existe. Ele nasce no fim do arquivo.

---

## :icon[milestone] Projeto 5 · Passo 1: os estilos no fim do arquivo

No fim do `App.js`, no lugar do comentário "Etapa 2 (E30): os estilos do App, com StyleSheet.create...":

```jsx
const estilos = StyleSheet.create({
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: cores.titulo,
  },
  saudacao: {
    fontSize: 16,
    color: cores.textoFraco,
  },
});
```

| Estilo | O que ele pede |
|---|---|
| `titulo` | letra 32, em negrito, no azul-escuro dos títulos |
| `saudacao` | letra 16, no cinza do texto de apoio |

**Pronto quando:** ao salvar, o celular mostra "Gota" grande, em negrito e azul-escuro, e a saudação em cinza, sem você apertar nada.

---

## Imagens

A foto salva na galeria abre até no modo avião. Onde ela mora?

---

## :icon[image] Image: a imagem que vai dentro do app

A **`Image`** mostra uma imagem. A gota do Gota é uma **imagem local**: o arquivo `gota.png` mora na pasta `assets/` do projeto e vai junto com o app, como a foto da galeria, que abre sem internet.

```jsx
<Image source={require('./assets/gota.png')} style={estilos.gota} />
```

| Parte | O que ela diz |
|---|---|
| `source={...}` | "a imagem vem daqui" (*source*, origem) |
| `require('./assets/gota.png')` | "ponha este arquivo dentro do app"; o `./` parte da pasta do `App.js` |
| `style={estilos.gota}` | o tamanho, num estilo com `width` (largura) e `height` (altura) |

A `Image` não tem nada dentro: fecha com `/>`, como a `<img>` do E24. Ela também entra no `import` de `react-native`.

---

## :icon[image] Image na prática

**Caso 1: o tamanho que você pede.** O estilo da gota, no `StyleSheet.create`:

```jsx
  gota: {
    width: 48,
    height: 48,
  },
```

| Estilo | Na tela |
|---|---|
| `width: 48, height: 48` | a gota do tamanho de um ícone |
| `width: 96, height: 96` | o dobro |
| sem `width` e `height` | o tamanho do arquivo, 192 por 192: quase metade da largura da tela |

**Caso 2: a mesma gota, de outra pasta.** A `ListaVazia` do kit mora em `src/components/` e usa a mesma imagem. O caminho sobe duas pastas, como o `cd ../..` da aula 3: `require('../../assets/gota.png')`.

---

## :icon[notebook-pen] Exercícios: Imagens

:::example Exercícios
1. Complete: `<Image ___={require('./assets/onibus.png')} style={estilos.icone} />`
2. A `onibus.png` tem 120 por 120. Com o estilo `icone: { width: 60, height: 60 }`, de que tamanho ela aparece? E sem `style`?
3. O `Cabecalho.js` mora em `src/`, e o logo em `assets/logo.png`, na raiz do projeto. Qual caminho vai no `require`?
4. O app mostra `Property 'Image' doesn't exist`. O `App.js` começa assim. O que falta?
   ```jsx
   import { StyleSheet, Text, View } from 'react-native';
   ```
:::

:::tip Respostas
1. `source`, a origem da imagem
2. 60 por 60; sem `style`, 120 por 120, o tamanho do arquivo
3. `require('../assets/logo.png')`: o `..` sobe de `src/` para a raiz
4. O nome `Image` entre as chaves do `import` de `react-native`
:::

---

## :icon[milestone] Projeto 5 · Passo 2: a gota no topo

No `import` de `react-native`, mais um nome. A ordem dentro das chaves não importa:

```jsx
import { Image, StyleSheet, Text, View } from 'react-native';
```

No topo da tela, antes do "Gota":

```jsx
      <View>
        <Image source={require('./assets/gota.png')} style={estilos.gota} />
        <Text style={estilos.titulo}>Gota</Text>
        <Text style={estilos.saudacao}>Olá, Ana! Bora beber água hoje?</Text>
      </View>
```

No `StyleSheet.create`, antes do `titulo`:

```jsx
  gota: {
    width: 48,
    height: 48,
  },
```

**Pronto quando:** a gota azul aparece no alto, à esquerda, e embaixo dela "Gota" e a saudação, uma peça embaixo da outra.

---

## O toque

No celular não tem mouse. Como o app sabe que você tocou?

---

## :icon[mouse-pointer-click] Pressable e onPress: o toque

No E26, o evento era a campainha, e o `onClick`, o combinado do que fazer quando ela toca. No celular, quem toca a campainha é o dedo. A peça que sente o toque é o **`Pressable`** ("que dá para apertar"), e o combinado vai no **`onPress`** ("ao pressionar"):

```jsx
<Pressable onPress={() => console.log('Oi!')}>
  <Text>Diga oi</Text>
</Pressable>
```

- O texto fica num `Text`, e o `Text` fica dentro do `Pressable`: tocar em qualquer parte dele chama a função
- O `onPress` recebe uma **função**: a seta `() =>` guarda o `console.log` para a hora do toque
- Sem estilo, o `Pressable` não tem cara de botão: parece um texto comum
- Ele entra no `import` de `react-native`, como o `Text`

---

## :icon[mouse-pointer-click] O toque na prática

**Caso 1: o aviso no terminal.** O `console.log` do toque não aparece no celular. Ele vai para o terminal do computador onde o `npx expo start` está ligado, com `LOG` na frente. Três toques em "Diga oi":

```plaintext
 LOG  Oi!
 LOG  Oi!
 LOG  Oi!
```

**Caso 2: sem a seta.** `onPress={console.log('Oi!')}` roda o `console.log` na hora de desenhar a tela: o `Oi!` aparece sozinho, ao salvar, e o toque não faz mais nada. É o `avisar()` com parênteses do E26.

**Caso 3: o nome do combinado.** No celular, é `onPress`. O `onClick` é da web, do Projeto 4.

---

## :icon[notebook-pen] Exercícios: O toque

:::example Exercícios
1. Complete o botão de pedir parada no ônibus: `<Pressable ___={() => console.log('Parada')}>`
2. A pessoa toca duas vezes. O que aparece no celular? E no terminal?
   ```jsx
   <Pressable onPress={() => console.log('Senha chamada')}>
     <Text>Chamar senha</Text>
   </Pressable>
   ```
3. O botão da academia escreve `Bom treino!` ao salvar, e o toque não faz nada. Conserte: `onPress={console.log('Bom treino!')}`
4. Escreva um `Pressable` com o texto "Chamar garçom" que, no toque, escreve `Garçom chamado` no terminal.
:::

:::tip Respostas
1. `onPress`; o `onClick` é da web
2. No celular, só "Chamar senha". No terminal, duas linhas `LOG  Senha chamada`
3. Com a seta, que espera o toque: `onPress={() => console.log('Bom treino!')}`
4. `<Pressable onPress={() => console.log('Garçom chamado')}><Text>Chamar garçom</Text></Pressable>`
:::

---

## :icon[milestone] Projeto 5 · Passo 3: o BotaoCopo nasce

O seu componente do Projeto 5. No painel do VS Code, dentro de `src/components/`, crie o arquivo `BotaoCopo.js`, com **B** e **C** maiúsculos:

```jsx
import { Pressable, Text } from 'react-native';

export default function BotaoCopo() {
  return (
    <Pressable onPress={() => console.log('Copo de 200 ml')}>
      <Text>+200 ml</Text>
    </Pressable>
  );
}
```

No `App.js`, apague o comentário "o import do seu BotaoCopo e da Linha" e, logo abaixo do `import` da `Tela`, escreva `import BotaoCopo from './src/components/BotaoCopo';`. No lugar do comentário "os três copos, dentro da Linha", embaixo da meta do dia, a peça:

```jsx
      <BotaoCopo />
```

**Pronto quando:** embaixo da meta do dia aparece "+200 ml" em letra preta, e cada toque nele escreve `LOG  Copo de 200 ml` no terminal.

---

## :icon[list-ordered] O BotaoCopo em português

| Linha | O que ela diz |
|---|---|
| `import { Pressable, Text } from 'react-native';` | "vou usar duas peças nativas" |
| `export default function BotaoCopo() {` | "esta é a peça `BotaoCopo`, e ela vai para a vitrine": o `export default` do E24, na mesma linha da função |
| `<Pressable onPress={() => ...}>` | "uma área que, no toque, roda esta função" |
| `console.log('Copo de 200 ml')` | "escreva no terminal": por enquanto, o copo só avisa |
| `import BotaoCopo from './src/components/BotaoCopo';` | "pegue a peça da vitrine"; no Expo, o caminho vem sem o `.js` |
| `<BotaoCopo />` | "encaixe a peça aqui", como o `<CartaoReceita />` do E24 |

---

## A caixa do botão

O que faz um retângulo na tela parecer um botão?

---

## :icon[square] Fundo, cantos e espaço por dentro

Sem estilo, o `Pressable` é invisível: só aparece o texto. Três propriedades de **caixa** dão a ele cara de botão:

| Propriedade | O que faz | No CSS do E01 |
|---|---|---|
| `backgroundColor` | a cor do fundo | `background` |
| `borderRadius` | arredonda os cantos; quanto maior, mais redondo | `border-radius` |
| `padding` | o **espaço por dentro**, entre a borda e o conteúdo | `padding` |

O `padding` é o plástico-bolha da caixa de mudança: o espaço entre a parede e o que vai dentro. Com `padding: 12`, o texto fica a 12 pontos da borda, nos quatro lados.

O estilo da caixa vai na peça de fora; o da letra, no `Text` de dentro.

---

## :icon[square] A caixa na prática

Um selo de aviso: uma `View` com fundo azul e, dentro, o texto branco.

```jsx
<View style={estilos.selo}>
  <Text style={estilos.textoSelo}>Meta batida!</Text>
</View>
```

```jsx
  selo: {
    backgroundColor: cores.agua,
    borderRadius: 8,
    padding: 8,
  },
  textoSelo: {
    color: cores.textoNoAzul,
  },
```

| Mudança no `selo` | Na tela |
|---|---|
| como está | uma faixa azul, de cantos redondos, com "Meta batida!" em branco |
| sem o `padding` | o texto encosta na borda da faixa |
| `borderRadius: 0` | os cantos ficam retos |
| sem o `backgroundColor` | a faixa some, e o texto branco quase desaparece no fundo claro |

---

## :icon[notebook-pen] Exercícios: A caixa do botão

:::example Exercícios
1. Qual propriedade dá os cantos redondos? E a cor do fundo? E o espaço por dentro?
2. Como aparece esta etiqueta do mercado?
   ```jsx
   <View style={estilos.etiqueta}>
     <Text style={estilos.letra}>Oferta</Text>
   </View>
   // etiqueta: { backgroundColor: cores.agua, borderRadius: 0, padding: 4 }
   // letra: { color: cores.textoNoAzul }
   ```
3. A senha da lanchonete saiu em letra preta no fundo azul. Por quê?
   ```jsx
   <View style={estilos.senha}>
     <Text>Senha 27</Text>
   </View>
   // senha: { backgroundColor: cores.agua, color: cores.textoNoAzul }
   ```
4. Escreva o estilo `ficha`: fundo `cores.agua`, cantos 16 e espaço por dentro de 20.
:::

:::tip Respostas
1. `borderRadius`, `backgroundColor` e `padding`
2. Uma faixa azul de cantos retos, com "Oferta" em branco, a 4 pontos da borda
3. O `color` pinta a letra e vai no `Text`; na `View`, não pinta nada
4. `ficha: { backgroundColor: cores.agua, borderRadius: 16, padding: 20 },`
:::

---

## :icon[milestone] Projeto 5 · Passo 4: o BotaoCopo com estilo

No `BotaoCopo.js`, o `import` ganha o `StyleSheet`, e uma linha nova traz as cores. Dentro de `src/components/`, o tema fica uma pasta acima: `'../tema'`, com o `..` do `cd ..` da aula 3.

```jsx
import { Pressable, StyleSheet, Text } from 'react-native';
import { cores } from '../tema';

export default function BotaoCopo() {
  return (
    <Pressable
      style={estilos.botao}
      onPress={() => console.log('Copo de 200 ml')}
    >
      <Text style={estilos.texto}>+200 ml</Text>
    </Pressable>
  );
}
```

A abertura do `Pressable` ficou comprida: uma prop por linha, e o `>` sozinho fecha a abertura, como no `<button` do E26.

---

## :icon[milestone] Projeto 5 · Passo 4: os estilos do botão

No fim do `BotaoCopo.js`, depois da chave que fecha o componente:

```jsx
const estilos = StyleSheet.create({
  botao: {
    backgroundColor: cores.agua,
    borderRadius: 12,
    padding: 12,
  },
  texto: {
    color: cores.textoNoAzul,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
```

O `App.js` também tem um `estilos`, e não há confusão: cada arquivo tem o seu.

**Pronto quando:** aparece uma **faixa azul da largura da tela**, com cantos redondos e "+200 ml" em branco e negrito, à esquerda. O toque continua escrevendo `Copo de 200 ml` no terminal.

---

## Coluna por padrão

Por que o botão de +200 ml ficou da largura da tela?

---

## :icon[rows-3] Coluna: uma peça embaixo da outra

Na `Tela` e em toda `View`, as peças ficam em **coluna**: uma embaixo da outra, na ordem do código, e cada uma ocupa a **largura toda**. É o padrão do React Native. Como no caderno: cada peça ganha a linha inteira, mesmo que escreva pouco nela.

:::center
![Diagrama: a View do topo, a View da meta e a Linha ocupam a largura toda, uma embaixo da outra; dentro da Linha, os três botões ficam lado a lado](images/e30-coluna-e-linha.svg)
:::

- A `View` e o `Pressable` sem fundo não aparecem, mas ocupam a linha toda
- A `Image` fica do tamanho que o `width` e o `height` pedem
- O espaço entre as peças vem da `Tela` do kit

---

## :icon[columns-3] Coluna e Linha na prática

**Caso 1: o toque no vazio.** No passo 3, o `Pressable` do "+200 ml" já ocupava a linha toda, só não aparecia: tocar à direita do texto também escrevia `Copo de 200 ml`.

**Caso 2: três peças soltas.** Três `<BotaoCopo />` seguidos, dentro da `Tela`, viram três faixas azuis, uma embaixo da outra.

**Caso 3: lado a lado.** A `Linha` do kit põe o que vai entre `<Linha>` e `</Linha>` na mesma linha, com o espaço dividido entre as peças. Lá dentro, cada botão fica do tamanho do seu texto:

```jsx
<Linha>
  <BotaoCopo />
  <BotaoCopo />
</Linha>
```

Como a `Linha` faz isso por dentro é assunto do E33.

---

## :icon[sliders-horizontal] Props no celular

No celular, as props são as do E25: o pai faz o pedido na tag, e a peça recebe uma ficha, desestruturada no parâmetro.

```jsx
import { Text } from 'react-native';

export default function Lembrete({ hora }) {
  return <Text>Beba água às {hora}</Text>;
}
```

| A tag, no pai | Na tela |
|---|---|
| `<Lembrete hora="10:00" />` | Beba água às 10:00 |
| `<Lembrete hora="15:30" />` | Beba água às 15:30 |

- Texto pronto vai entre aspas. Número vai entre chaves: `copos={3}` chega como número; `copos="3"`, como texto
- Dentro da peça, a prop entra no JSX entre chaves, como o `{hora}`, e numa template string, com `${ }`

---

## :icon[notebook-pen] Exercícios: Coluna por padrão

:::example Exercícios
1. Como os três textos aparecem dentro da `Tela`?
   ```jsx
   <Text>Pão</Text>
   <Linha>
     <Text>Leite</Text>
     <Text>Café</Text>
   </Linha>
   ```
2. Um `Pressable` sem fundo, com o texto "Ligar", está sozinho na `Tela`. Tocar à direita do texto, longe dele, chama o `onPress`?
3. O que o celular mostra em cada tag?
   ```jsx
   function Senha({ numero }) {
     return <Text>Próxima: {numero + 1}</Text>;
   }
   <Senha numero={7} />
   <Senha numero="7" />
   ```
4. Escreva a tag da `Senha` que mostra "Próxima: 43".
:::

:::tip Respostas
1. "Pão" em cima, na linha toda; embaixo, "Leite" e "Café" na mesma linha, um em cada ponta
2. Sim: o `Pressable` ocupa a linha toda, mesmo sem aparecer
3. "Próxima: 8" e "Próxima: 71": entre chaves chega número, e o `+` soma; entre aspas chega texto, e o `+` junta
4. `<Senha numero={42} />`, com o número entre chaves
:::

---

## :icon[milestone] Projeto 5 · Sua vez: os três copos

Agora, sozinho: um `BotaoCopo` para qualquer copo.

1. Ele recebe a prop **`ml`** e mostra "+200 ml", "+300 ml" ou "+500 ml"
2. O toque escreve no terminal `Copo de 300 ml`, com o número do botão
3. No `App.js`, no lugar do botão sozinho, três botões de 200, 300 e 500 ml, dentro da `Linha`

:::tip Dicas
- Props desestruturadas, como no `CartaoReceita` do Projeto 4
- Número entre chaves: `ml={300}`
- A frase do terminal é uma template string (E06)
- A `Linha` entra por `import`, como a `Tela`; o topo de `Linha.js` mostra o uso
:::

**Pronto quando:** três botões azuis lado a lado; cada toque escreve `Copo de` no terminal, com o número do botão.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Property 'StyleSheet' doesn't exist` | o nome faltou no `import` (vale para `Image`, `Pressable`, `Linha`) | pôr o nome no `import` |
| `Property 'estilos' doesn't exist` | faltou o `StyleSheet.create`, ou o nome mudou | `const estilos` no fim do arquivo |
| `Unable to resolve` | caminho errado; maiúsculas contam | `./assets/gota.png`; `'../tema'`; `BotaoCopo` |
| `Unexpected token` | `font-size`, com hífen | `fontSize`, em camelCase |
| `Element type is invalid` | o `BotaoCopo.js` sem `export default` | `export default function BotaoCopo` |
| nenhuma; o estilo não muda | `fontsize` minúsculo, ou `'32px'` | `fontSize: 32`, sem `px` |

---

## :icon[milestone] Projeto 5 · Etapa 2 pronta

O celular mostra, de cima para baixo:

- a gota, "Gota" grande e azul-escuro e a sua saudação em cinza
- "Meta do dia" e "2000 ml", ainda sem estilo
- três botões azuis lado a lado: +200 ml, +300 ml e +500 ml

Cada toque escreve `Copo de ... ml` no terminal, com o número do botão. Num segundo terminal do VS Code (o primeiro está com o `npx expo start`):

```bash
git add .
git commit -m "Projeto 5: etapa 2, estilo e BotaoCopo"
git push
```

O que faltar, termine em casa antes do E31: o enunciado está na página do Projeto 5. O E31 começa com os três copos prontos.

---

## Resumo

:::summary
- No celular não há CSS: o estilo é uma ficha, criada com `StyleSheet.create` no fim do arquivo e usada com `style={estilos.nome}`
- As propriedades têm os nomes do CSS em camelCase (`fontSize`), e os números vão sem `px`
- As cores vêm com nome do `tema.js` do kit: `cores.titulo`, `cores.agua`
- A `Image` com `require` mostra uma imagem do projeto; o `width` e o `height` dão o tamanho
- O `Pressable` com `onPress` responde ao toque; o `console.log` aparece no terminal do `npx expo start`
- As peças ficam em coluna, cada uma na largura toda; a `Linha` do kit põe lado a lado
:::

---

## :icon[arrow-right] Próximos passos

No E31, os copos passam a contar de verdade, e o Projeto 5 é entregue:

- :icon[refresh-cw] o `useState` do E26 guarda cada copo, com a hora em que você tocou
- :icon[gauge] o total aparece na barra da meta, o `ProgressoMeta` do kit
- :icon[list] a lista dos copos do dia, com a `FlatList`, e o botão Remover
- :icon[file-text] o README com os prints do celular e a entrega
