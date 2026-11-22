---
title: Navegação
summary: O toque no cartão abre o Detalhe da casa por cima da lista, e o app ganha as abas Casas e Sobre.
module: layout-rn
duration_minutes: 90
objectives:
  - Ler a pasta app/ do Expo Router, em que o nome do arquivo é o endereço da tela
  - Abrir uma tela por cima da pilha com router.push e Link, e voltar tirando a de cima
  - Criar a rota casa/[id] e achar a casa com useLocalSearchParams e Number(id)
  - Organizar as telas principais em abas, num grupo de pastas (abas)
---

# Navegação

Programador Mobile · Encontro E37 · Aula 37 de 45

---

## O que você vai aprender

:::goal
- Ler a pasta `app/`: cada arquivo é uma tela, e o nome do arquivo é o endereço dela
- Abrir uma tela por cima da outra e voltar, como numa pilha de cartas
- Fazer o Detalhe das 12 casas com um arquivo só, `app/casa/[id].js`
- Pôr o nome da casa no cabeçalho e as abas Casas e Sobre embaixo
- Ligar uma casa às outras da mesma cidade com `Link`
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **navegação** | o caminho entre as telas do app: ir, voltar e lembrar de onde veio |
| **rota** | o endereço de uma tela, como `/cadastro` ou `/casa/4` |
| **pilha de telas** (*stack*) | as telas abertas, uma por cima da outra; você vê só a de cima |
| **parâmetro de rota** | o pedaço do endereço que muda, como o `4` de `/casa/4` |
| **cabeçalho** (*header*) | a barra do topo da tela, com o título e a seta de voltar |
| **aba** (*tab*) | um botão fixo na barra de baixo, que leva a uma tela principal |

---

## O toque ainda abre um aviso

No fim do E36, tocar no Lar da Mel mostra só um aviso com o horário de visitas. O endereço e o telefone estão nos dados, mas não há onde ver.

| Hoje, no começo | No fim do encontro |
|---|---|
| o toque abre um aviso | o toque abre o Detalhe da casa, por cima da lista |
| nenhum endereço nem telefone | foto grande, vagas, visitas e contato |
| a Sobre pronta, sem caminho | as abas Casas e Sobre, embaixo |
| uma casa não leva a outra | links para as casas da mesma cidade |

:::question
Você abriu uma casa para ver o telefone. Como espera voltar para a lista?
:::

---

## Expo Router

E se cada tela do app tivesse um endereço, como as páginas de um site?

---

## :icon[route] Expo Router: o arquivo é o endereço

**Navegação** é o caminho entre as telas: ir, voltar e lembrar de onde veio. No kit, quem cuida dela é o **Expo Router**, que está no `package.json` desde o E33.

Nele, cada arquivo da pasta `app/` é uma tela, e o nome do arquivo é o endereço dela, a **rota**, como as páginas de um site:

| Arquivo | Rota |
|---|---|
| `app/index.js` | `/`, a tela que abre primeiro |
| `app/cadastro.js` | `/cadastro` |
| `app/sobre.js` | `/sobre` |

- `index` é a rota da própria pasta: o `/` sozinho, a porta de entrada
- O **`_layout.js`** não é tela: é a **moldura** das telas da pasta. No kit, guarda o `TemaProvider` e o `CasasProvider` (E34 e E36)

---

## :icon[route] As rotas na prática

**Caso 1: endereço sem caminho.** A Sobre está pronta desde o E33 e tem endereço, `/sobre`. Mas nenhum botão leva até ela. Hoje ela ganha uma aba.

**Caso 2: peça não é tela.** O `CartaoCasa` mora em `src/components/` e não ganha endereço: só o que está em `app/` vira tela. Por isso todo arquivo de `app/` tem um `export default function`.

**Caso 3: endereço sem arquivo.** Pedir uma rota que nenhum arquivo atende, como `/perfil`, abre a tela do Expo Router:

```plaintext
Unmatched Route
Page could not be found.
Go back
```

*Unmatched route* quer dizer "rota sem par": o endereço não bate com nenhum arquivo de `app/`. Compare o endereço com os nomes das pastas e dos arquivos.

---

## :icon[notebook-pen] Exercícios: Expo Router

:::example Exercícios
A pasta `app/` de uma lanchonete:

```plaintext
app/
├── _layout.js
├── index.js
├── cardapio.js
└── pedido.js
```

1. Qual é a rota de `cardapio.js`? E a de `index.js`?
2. O `_layout.js` é a tela `/_layout`?
3. A pessoa pede o endereço `/promocoes`. O que aparece?
4. A peça `src/components/CartaoLanche.js` tem rota?
5. Para a rota `/horarios`, que arquivo você cria?
:::

:::tip Respostas
1. `/cardapio` e `/`, a porta de entrada
2. Não: é a moldura das telas da pasta
3. `Unmatched Route`: nenhum arquivo atende esse endereço
4. Não: só o que está em `app/` vira tela
5. `app/horarios.js`, com um `export default function`
:::

---

## A pilha de telas

O que acontece com a tela de baixo quando outra abre por cima dela?

---

## :icon[layers] A pilha de telas: a pilha de cartas

A **pilha de telas** (*stack*) é uma pilha de cartas: a tela nova vai por cima, e voltar tira a de cima. A de baixo fica como você deixou, com a rolagem e a busca.

No kit, a pilha está no `app/_layout.js`:

```jsx
<Stack screenOptions={opcoesDaPilha(cores)}>
  <Stack.Screen name="index" options={{ headerShown: false }} />
  <Stack.Screen name="cadastro" options={{ title: 'Nova casa' }} />
</Stack>
```

| Parte | O que ela diz |
|---|---|
| `Stack` | "as telas ficam numa pilha" (de `expo-router`) |
| `screenOptions={opcoesDaPilha(cores)}` | "as opções de todas as telas (*screen options*): o **cabeçalho** nas cores do tema" |
| `Stack.Screen name="index"` | "a tela (*screen*) do arquivo `index.js`..." |
| `headerShown: false` | "...sem cabeçalho à mostra": a Início desenha o próprio topo |
| `options={{ title: 'Nova casa' }}` | "o título do cabeçalho do Cadastro" |

---

## :icon[layers] A pilha na prática

A pilha, toque por toque. Ela está escrita de baixo para cima: a última tela é a que aparece.

```plaintext
abre o app               Início
toca no Lar da Mel       Início, Lar da Mel
toca em Casa do Bigode   Início, Lar da Mel, Casa do Bigode
volta                    Início, Lar da Mel
volta                    Início
volta, no Android        sai do app
```

| Para voltar | Android | iPhone |
|---|---|---|
| uma tela | a seta do cabeçalho, ou o voltar do sistema | a seta do cabeçalho, ou deslizar da borda esquerda |
| na primeira tela | o voltar do sistema sai do app | não há seta: nada acontece |

A seta só aparece da segunda carta em diante: na primeira, não há nada embaixo.

---

## :icon[notebook-pen] Exercícios: A pilha de telas

:::example Exercícios
1. App do banco: abre na Início, toca em Pix, toca em Confirmar e volta. Que tela aparece?
2. Ela rolou a lista de produtos até o fim e abriu um. Ao voltar, a lista está no topo?
3. Complete: `<Stack.Screen name="carrinho" options={{ ____: 'Seu carrinho' }} />`
4. Que opção esconde o cabeçalho da tela `index`?
5. Pilha: Início, Produto e Carrinho. Quantos "voltar" do Android até sair do app?
:::

:::tip Respostas
1. A de Pix: voltar tira a Confirmar, a carta de cima
2. Não: a tela de baixo fica como ela deixou
3. `title`
4. `headerShown: false`
5. Três: o terceiro, já na Início, sai do app
:::

---

## Rota com parâmetro

Doze casas no app: são precisos doze arquivos de Detalhe?

---

## :icon[map-pin] Rota com parâmetro: o [id]

Um arquivo só atende as 12 casas: `app/casa/[id].js`, com **colchetes**. O `[id]` é o pedaço do endereço que muda, o **parâmetro**: a rua é a mesma, `/casa/`; o número diz qual casa.

| Endereço | A tela recebe | A casa |
|---|---|---|
| `/casa/1` | `{ id: '1' }` | Lar da Mel |
| `/casa/4` | `{ id: '4' }` | Casa do Bigode |
| `/casa/12` | `{ id: '12' }` | Cantinho dos Bichanos |

A tela lê o parâmetro com o **`useLocalSearchParams()`** (*use local search params*: use os parâmetros do endereço), uma função `use...` como o `useTema()`:

```jsx
const { id } = useLocalSearchParams();
```

O nome entre colchetes vira o nome do campo: `[id]` dá `id`, e as chaves o pegam (E13).

---

## :icon[map-pin] O id chega como texto

Endereço é texto. Em `/casa/4`, o `id` chega como `'4'`, com aspas. Nos dados, o `id` é número, e o `===` dá `false` quando os tipos (E06) são diferentes. No Node, com as 12 casas do kit:

```javascript
const { id } = { id: '4' }; // o que o useLocalSearchParams() entrega em /casa/4

console.log(typeof id, id);                                  // string 4
console.log(4 === id, 4 === Number(id));                     // false true
console.log(casas.find((item) => item.id === id));           // undefined
console.log(casas.find((item) => item.id === Number(id)).nome); // Casa do Bigode
```

| Endereço | `Number(id)` | O `find` acha |
|---|---|---|
| `/casa/4` | `4` | a Casa do Bigode |
| `/casa/12` | `12` | o Cantinho dos Bichanos |
| `/casa/99` | `99` | ninguém: `undefined` |

O `Number` do E09 transforma o texto em número. Quando ninguém passa, o `find` (E14) devolve `undefined`.

---

## :icon[notebook-pen] Exercícios: Rota com parâmetro

:::example Exercícios
1. Quantos arquivos atendem os 300 produtos, de `/produto/1` a `/produto/300`? Com que nome?
2. Com o arquivo `app/linha/[numero].js`, o que o endereço `/linha/202` entrega ao `useLocalSearchParams()`?
3. O que aparece?
   ```javascript
   const { id } = { id: '7' };
   console.log(typeof id, id === 7, Number(id) === 7);
   ```
4. Ache o erro: o `find` não acha o pedido 3
   ```javascript
   const pedidos = [{ id: 3, lanche: 'X-Salada' }];
   const { id } = { id: '3' };
   console.log(pedidos.find((p) => p.id === id));
   ```
:::

:::tip Respostas
1. Um só: `app/produto/[id].js`
2. `{ numero: '202' }`: o nome entre colchetes vira o campo, e o valor chega como texto
3. `string false true`
4. Sai `undefined`, porque `3 === '3'` é `false`. Com `p.id === Number(id)`, sai `{ id: 3, lanche: 'X-Salada' }`
:::

---

## :icon[milestone] Projeto 6 · Passo 1: a rota com parâmetro

:::steps
1. No painel do VS Code, crie a pasta `casa` dentro de `app` e, nela, o arquivo `[id].js`, com os colchetes
2. Escreva os dois blocos abaixo e, no fim do arquivo, `const estilos = StyleSheet.create({ nome: { fontSize: fonte.titulo, fontWeight: 'bold' } });`
3. No `app/_layout.js`, depois da linha `index`: `<Stack.Screen name="casa/[id]" options={{ title: 'Casa' }} />`
:::

```jsx
import { StyleSheet, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Tela } from '@/components/ui';
import { useCasas } from '@/data/CasasContext';
import { fonte, useTema } from '@/theme';
```

```jsx
export default function Detalhe() {
  const { id } = useLocalSearchParams();
  const { casas } = useCasas();
  const { cores } = useTema();
  const casa = casas.find((item) => item.id === Number(id));

  return (
    <Tela rolar comCabecalho>
      <Text style={[estilos.nome, { color: cores.texto }]}>{casa.nome}</Text>
    </Tela>
  );
}
```

**Pronto quando:** o app abre como antes, sem tela vermelha. Nada leva ao Detalhe ainda: é o Passo 2.

---

## :icon[list-ordered] O Detalhe em português

| Linha | O que ela diz |
|---|---|
| `const { id } = useLocalSearchParams();` | "pegue o `id` do endereço": em `/casa/4`, o texto `'4'` |
| `const { casas } = useCasas();` | "leia a lista no quadro de avisos" (E36) |
| `casas.find((item) => item.id === Number(id))` | "ache a casa cujo `id` é o número do endereço" |
| `<Tela rolar comCabecalho>` | "a tela rola; o cabeçalho da pilha já protege o topo" |
| `name="casa/[id]"` e `title: 'Casa'` | "na pilha, o Detalhe tem cabeçalho: Casa" |

O `comCabecalho` é a prop da `Tela` do kit para telas com cabeçalho: ela protege só as laterais e a parte de baixo.

---

## Abrir outra tela

Você tocou no cartão de uma casa. Quem põe a tela nova em cima da pilha?

---

## :icon[navigation] router.push: uma carta por cima

O **`router`** é o objeto do Expo Router que mexe na pilha pelo código. O **`push`** ("empurrar") põe por cima a tela do endereço que você entrega:

```jsx
import { router } from 'expo-router';

router.push('/casa/' + 4); // abre o Detalhe da Casa do Bigode
router.back();             // tira a tela de cima, como o voltar do sistema
```

- `'/casa/' + 4` junta o texto e o número, como o `+` de textos da aula 3: dá `'/casa/4'`
- É o mesmo nome do `push` das listas (E11): lá, um item a mais no fim; aqui, uma carta a mais no topo
- No `onPress`, ele vai dentro de uma seta, `() => router.push(...)`, e só roda no toque. Sem a seta, roda ao **desenhar** a tela: é o `onClick={avisar()}` do E26
- O `router.back()` volta no E38, depois de salvar uma casa nova

---

## :icon[milestone] Projeto 6 · Passo 2: do cartão ao Detalhe

Na Início, `app/index.js`, o `Alert` sai do import de `react-native`, e entra `import { router } from 'expo-router';`. No `renderItem`, o `onPress` do cartão muda:

```jsx
renderItem={({ item }) => (
  <CartaoCasa
    casa={item}
    onPress={() => router.push('/casa/' + item.id)}
  />
)}
```

A seta de cada cartão guarda o endereço do seu `item`. O `CartaoCasa` do E35 não muda: ele avisa do toque, e a tela decide aonde ir.

| `item` | `'/casa/' + item.id` | O toque abre |
|---|---|---|
| Lar da Mel | `'/casa/1'` | o Detalhe do Lar da Mel |
| Casa do Bigode | `'/casa/4'` | o da Casa do Bigode |

**Pronto quando:** o Lar da Mel abre por cima, com o cabeçalho "Casa", a seta e o nome. Voltar mostra a lista onde ela estava.

---

## :icon[bookmark] O nome da casa no cabeçalho

No `app/_layout.js`, o título do Detalhe é fixo: `title: 'Casa'`. O nome da casa só aparece quando a tela abre e acha a casa. Para isso, o **`<Stack.Title>`** vai **dentro** da tela, com o título entre a tag que abre e a que fecha:

```jsx
import { Stack } from 'expo-router';

<Tela rolar comCabecalho>
  <Stack.Title>{casa.nome}</Stack.Title>
  {/* a foto, o nome e a descrição */}
</Tela>
```

- Ele não desenha nada na tela: só troca o título do cabeçalho desta tela
- Quando a tela não chega a desenhar o `Stack.Title`, vale o `'Casa'` do layout

| Onde | Vale para |
|---|---|
| `screenOptions`, no `Stack` | todas as telas da pilha: as cores do tema |
| `Stack.Screen`, no `_layout.js` | uma tela, com título fixo |
| `<Stack.Title>`, dentro da tela | uma tela, com título que vem dos dados |

---

## :icon[notebook-pen] Exercícios: Abrir outra tela

:::example Exercícios
1. Que endereço `router.push('/produto/' + 15)` abre?
2. A pilha tem Início e Produto. O código roda `router.back()` e, depois, `router.push('/carrinho')`. Como fica?
3. Ache o erro: `onPress={router.push('/carrinho')}`
4. Ache o erro: com `item.id` igual a 7, `router.push('/produto' + item.id)` dá `Unmatched Route`
5. O layout tem `title: 'Produto'`; a tela, `<Stack.Title>{produto.nome}</Stack.Title>`. No Tênis Azul, o que diz o cabeçalho?
:::

:::tip Respostas
1. `'/produto/15'`
2. Início e Carrinho: o `back` tira o Produto; o `push` põe o Carrinho
3. Sem a seta, roda ao desenhar: `onPress={() => router.push('/carrinho')}`
4. Dá `'/produto7'`, sem a barra: `'/produto/' + item.id`
5. Tênis Azul: o `Stack.Title` troca o título fixo
:::

---

## :icon[milestone] Projeto 6 · Passo 3: a casa que não existe

No `app/casa/[id].js`, os imports ficam assim:

```jsx
import { Image, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { EstadoVazio, Tela } from '@/components/ui';
import { useCasas } from '@/data/CasasContext';
import { fonte, raio, useTema } from '@/theme';
```

Depois do `find`, antes do `return`, o **retorno antecipado** do E10:

```jsx
if (!casa) {
  return (
    <EstadoVazio
      icone="help-circle-outline"
      titulo="Casa não encontrada"
      mensagem="Volte para a lista e escolha outra casa."
    />
  );
}
```

| Endereço | `casa` | `!casa` | A tela mostra |
|---|---|---|---|
| `/casa/1` | o Lar da Mel | `false` | segue para a foto, o nome e a descrição |
| `/casa/99` | `undefined` | `true` | "Casa não encontrada", e para ali |

**Pronto quando:** na Início, com `'/casa/99'` no lugar de `'/casa/' + item.id` por um minuto, qualquer cartão abre "Casa não encontrada". Volte o código.

---

## :icon[milestone] Projeto 6 · Passo 3: foto, nome e descrição

O `return` de baixo troca o nome sozinho por:

```jsx
<Tela rolar comCabecalho>
  <Stack.Title>{casa.nome}</Stack.Title>
  {casa.foto ? (
    <Image source={{ uri: casa.foto }} style={estilos.foto} />
  ) : (
    <View style={[estilos.foto, estilos.semFoto, { backgroundColor: cores.borda }]}>
      <Ionicons name="paw" size={64} color={cores.textoSuave} />
    </View>
  )}
  <Text style={[estilos.nome, { color: cores.texto }]}>{casa.nome}</Text>
  <Text style={[estilos.descricao, { color: cores.textoSuave }]}>{casa.descricao}</Text>
</Tela>
```

No `StyleSheet.create`, junto do `nome`:

```javascript
foto: { width: '100%', height: 220, borderRadius: raio.md },
semFoto: { alignItems: 'center', justifyContent: 'center' },
descricao: { fontSize: fonte.corpo },
```

A foto ou a pata é o ternário do `CartaoCasa` (E35), agora grande. `width: '100%'`, em texto, é a largura inteira do espaço.

**Pronto quando:** o cabeçalho diz "Lar da Mel"; embaixo, a foto grande, o nome e a descrição. A ONG Amigo Fiel, sem foto, mostra a pata.

---

## Abas

Quais telas do seu app de banco estão sempre a um toque, na barra de baixo?

---

## :icon[folder-open] Abas: o fichário

As **abas** são as telas principais do app, como as abas de um fichário: sempre à vista, na barra de baixo, abertas em qualquer ordem. Trocar de aba não empilha nada.

No Expo Router, as abas moram numa pasta com o nome **entre parênteses**, `app/(abas)/`, com um `_layout.js` próprio. Os parênteses fazem dela um **grupo**: a pasta organiza os arquivos, mas **não entra no endereço**.

| Arquivo | Rota |
|---|---|
| `app/(abas)/index.js` | `/`, a aba Casas |
| `app/(abas)/sobre.js` | `/sobre`, a aba Sobre |
| `app/casa/[id].js` | `/casa/4`, fora das abas |
| `app/cadastro.js` | `/cadastro`, fora das abas |

Tela principal vira aba. Tela que só abre a partir de outra, como o Detalhe, vai por cima, na pilha.

---

## :icon[folder-open] Abas na prática: o Detalhe por cima

:::center
![Animação: o grupo (abas), com Casas e Sobre, é a primeira carta da pilha; o push põe o Detalhe do Lar da Mel, casa/[id], por cima dele, cobrindo a barra de abas; voltar tira o Detalhe e as abas voltam a aparecer como estavam](images/e37-detalhe-por-cima-das-abas.svg)
:::

- O grupo `(abas)` inteiro é **uma carta** da pilha do `app/_layout.js`, a de baixo
- O Detalhe entra nessa pilha e cobre tudo, até a barra de abas: sobra espaço para a foto
- Voltar tira o Detalhe, e a aba Casas aparece como estava

Por isso a pasta `casa` fica **fora** de `(abas)`.

---

## :icon[notebook-pen] Exercícios: Abas

:::example Exercícios
1. Qual é a rota de `app/(abas)/perfil.js`? E de `app/(abas)/index.js`?
2. Trocar da aba Início para a Perfil empilha uma tela?
3. App de música: Início, Buscar, Biblioteca e a tela de uma música. Quais viram aba?
4. A música, `app/musica/[id].js`, fica fora de `(abas)`. Ela mostra a barra?
5. Ache o erro: com a pasta `app/abas/`, sem parênteses, o app abre em `Unmatched Route`
:::

:::tip Respostas
1. `/perfil` e `/`: os parênteses não entram no endereço
2. Não: trocar de aba não empilha nada
3. Início, Buscar e Biblioteca; a música vai por cima, na pilha
4. Não: ela cobre a barra, por cima do grupo
5. A pasta entra no endereço: a Início vira `/abas`, e nada atende o `/`
:::

---

## :icon[milestone] Projeto 6 · Passo 4: as abas

:::steps
1. No painel do VS Code, crie a pasta `(abas)` dentro de `app`, com os parênteses
2. Arraste `app/index.js` e `app/sobre.js` para dentro dela
3. Crie `app/(abas)/_layout.js` com o código abaixo
4. No `app/_layout.js`, troque a linha `index` por `<Stack.Screen name="(abas)" options={{ headerShown: false }} />`; o comentário do E37 pode sair
:::

```jsx
import { Tabs } from 'expo-router/js-tabs';
import { iconeDaAba, opcoesDasAbas, useTema } from '@/theme';

export default function LayoutAbas() {
  const { cores } = useTema();
  return (
    <Tabs screenOptions={opcoesDasAbas(cores)}>
      <Tabs.Screen name="index" options={{ title: 'Casas', tabBarIcon: iconeDaAba('paw-outline') }} />
      <Tabs.Screen
        name="sobre"
        options={{ title: 'Sobre', tabBarIcon: iconeDaAba('information-circle-outline') }}
      />
    </Tabs>
  );
}
```

**Pronto quando:** uma barra embaixo com Casas (a pata) e Sobre (o "i"); tocar num cartão abre o Detalhe por cima, sem a barra. Apareceu `Unmatched Route`? Pare o servidor e rode `npx expo start -c`.

---

## :icon[list-ordered] O layout das abas em português

| Linha | O que ela diz |
|---|---|
| `import { Tabs } from 'expo-router/js-tabs';` | "traga as abas": no SDK 58, elas vêm daqui |
| `screenOptions={opcoesDasAbas(cores)}` | "a barra nas cores do tema"; cada aba desenha o seu topo |
| `<Tabs.Screen name="index" ...>` | "a primeira aba é o `index.js` desta pasta" |
| `title: 'Casas'` | "o rótulo embaixo do ícone" |
| `tabBarIcon: iconeDaAba('paw-outline')` | "o ícone na barra de abas (*tab bar icon*)", do Ionicons (E35) |

- A ordem dos `Tabs.Screen` é a ordem na barra
- Tutoriais antigos usam o `Tabs` de `'expo-router'`, hoje marcado como antigo
- Nenhum import quebrou ao mover: o `@/` do E33 é sempre a pasta `src/`

---

## Link

O que acontece quando você toca num link dentro de um site?

---

## :icon[link-2] Link: um texto que navega

O **`Link`** é como o link de um site: um texto que, tocado, abre outra rota. Ele vem de `expo-router`, e o endereço vai na prop **`href`** (de *hypertext reference*, o endereço do link):

```jsx
import { Link } from 'expo-router';

<Link href="/sobre">Sobre o app</Link>
<Link href={'/casa/' + 4}>Casa do Bigode</Link>
```

- O toque põe a tela do endereço por cima, na pilha, como o `router.push`; para uma aba, como `/sobre`, ele troca de aba
- O `Link` desenha um `Text`: aceita `style` com `fontSize`, `fontWeight` e `color`

| Use | Quando |
|---|---|
| `Link` | o texto tocado só leva a outra tela |
| `router.push` | quem avisa do toque é uma peça, como o `onPress` do `CartaoCasa` |

---

## :icon[link-2] Link na prática

Uma lista de links: os gatos com vaga. O `filter` faz duas perguntas, ligadas pelo `&&` do E10: só passa quem responde sim às duas.

```jsx
const gatosComVaga = casas.filter(
  (casa) => casa.aceita === 'Gatos' && casa.capacidade - casa.ocupacao > 0,
);

{gatosComVaga.map((casa) => (
  <Link key={casa.id} href={'/casa/' + casa.id}>
    {casa.nome}
  </Link>
))}
```

| Casa | `aceita === 'Gatos'` | vagas `> 0` | Passa? |
|---|---|---|---|
| Lar da Mel | `false` | `false` (0) | não |
| Casa do Bigode | `true` | `true` (3) | sim |
| Gatil Sete Vidas | `true` | `false` (0) | não |
| Lar Temporário Ronrom | `true` | `true` (5) | sim |
| Cantinho dos Bichanos | `true` | `true` (7) | sim |

Na tela, três links, cada um com o seu crachá, o `key` do E25. Tocar em Lar Temporário Ronrom abre `/casa/10`.

---

## :icon[notebook-pen] Exercícios: Link

:::example Exercícios
1. Complete: `<Link ____="/ajuda">Precisa de ajuda?</Link>`
2. Aonde leva `<Link href={'/linha/' + 302}>Linha 302</Link>`?
3. `Link` ou `router.push`: o texto "Ver regulamento", no fim da tela? E o cartão de um produto, que avisa pelo `onPress`?
4. Quais lanches viram link?
   ```javascript
   const lanches = [
     { nome: 'X-Salada', preco: 18, temHoje: true },
     { nome: 'X-Bacon', preco: 24, temHoje: true },
     { nome: 'Misto', preco: 12, temHoje: false },
   ];
   const nomes = lanches.filter((l) => l.preco < 20 && l.temHoje).map((l) => l.nome);
   console.log(nomes);
   ```
5. Ache o erro: no `map` dos links, o terminal avisa `Each child in a list should have a unique "key" prop`
:::

:::tip Respostas
1. `href`
2. A `/linha/302`, por cima, na pilha
3. O texto: `Link`. O cartão: `router.push`, no `onPress`
4. `[ 'X-Salada' ]`: o X-Bacon passa de 20, e o Misto não tem hoje
5. Faltou o crachá: cada `Link` do `map` leva um `key` único, como o nome do lanche
:::

---

## :icon[milestone] Projeto 6 · Sua vez: o resto do Detalhe

Agora, sozinho. No Detalhe, depois da descrição, três `Cartao` com título:

1. **Vagas e visitas**: o que aceita, as vagas livres de quantas e as visitas
2. **Endereço e contato**: endereço, bairro e cidade, responsável e telefone
3. **Outras casas em** e a cidade: um `Link` para cada outra casa da cidade

Cada dado numa `LinhaInfo` do kit, com as props `icone` e `texto`.

:::tip Dicas
- Ícones sugeridos: `paw-outline`, `calendar-outline`, `location-outline`, `call-outline`
- Outras casas: um `filter` com duas perguntas, mesma cidade **e** `id` diferente
:::

**Pronto quando:** o Lar da Mel mostra "Aceita: Cães", "0 vagas de 20", as visitas e o contato, e os links Casa do Bigode e Abrigo Rabo Abanando, que abrem por cima.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| nenhuma; sempre "Casa não encontrada" | `item.id === id`: número com texto | `Number(id)` |
| `Unmatched Route` | nenhum arquivo atende o endereço | `'/casa/'` e `app/casa/[id].js` |
| `Cannot update a component`; um Detalhe abre sozinho | o `router.push` sem a seta | `() => router.push(...)` |
| `No route named "index"` | o `app/_layout.js` ainda cita `index` | trocar por `(abas)` |
| `No route named "casa/[id]"` | a pasta `casa` dentro de `(abas)` | tirar `casa` de `(abas)` |
| `Cannot read property 'nome' of undefined` | faltou o `if (!casa)` | o retorno antecipado |

O `No route named` é um `WARN` do terminal.

---

## :icon[milestone] Projeto 6 · Etapa 5 pronta

Confira no celular:

- :icon[check] o toque num cartão abre o Detalhe, com o nome no cabeçalho, a foto ou a pata, as vagas e o contato
- :icon[link-2] as outras casas da cidade abrem por cima; voltar desfaz a pilha uma tela por vez
- :icon[folder-open] as abas Casas e Sobre embaixo, que somem no Detalhe
- :icon[circle-check] o terminal sem `ERROR` nem `WARN`

```plaintext
app/
├── _layout.js         a pilha: (abas), casa/[id] e cadastro
├── (abas)/
│   ├── _layout.js     as abas Casas e Sobre
│   ├── index.js       a Início
│   └── sobre.js       a Sobre do kit
├── casa/[id].js       o Detalhe
└── cadastro.js        ainda "Em construção"
```

```bash
git add .
git commit -m "Projeto 6: etapa 5, detalhe e abas"
git push
```

Faltou a Sua vez? Termine em casa, com outro commit e `git push`, antes do E38.

---

## Resumo

:::summary
- No Expo Router, cada arquivo de `app/` é uma tela, e o nome dele é o endereço: `index.js` é o `/`; o `_layout.js` é a moldura
- A pilha é uma pilha de cartas: `router.push('/casa/' + item.id)` põe o Detalhe por cima, e voltar tira a carta de cima
- `app/casa/[id].js` atende as 12 casas; o `useLocalSearchParams()` entrega o `id` como texto, e o `find` compara com `Number(id)`
- O `<Stack.Title>` põe o nome da casa no cabeçalho; sem casa, o `if (!casa)` mostra o `EstadoVazio`
- As abas moram em `app/(abas)/`, com o `Tabs` de `'expo-router/js-tabs'`; os parênteses não entram no endereço
- O `Link` é um texto que navega, com o endereço no `href`
:::

---

## :icon[arrow-right] Próximos passos

No E38, o **Cadastro** deixa de ser "Em construção":

- :icon[square-pen] um campo para cada dado da casa, com o teclado certo
- :icon[circle-alert] a mensagem embaixo de cada campo com erro
- :icon[undo-2] salvar e voltar para a lista com o `router.back()`, a carta de cima saindo da pilha
