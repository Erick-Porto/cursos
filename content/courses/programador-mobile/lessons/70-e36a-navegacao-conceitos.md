---
title: Navegação em apps e o Expo Router
summary: Padrões de navegação, a pilha de telas com o botão voltar e o Expo Router, que cria uma rota para cada arquivo.
module: layout-rn
duration_minutes: 35
objectives:
  - Reconhecer os padrões de navegação pilha, abas, gaveta e modal
  - Explicar como a pilha de telas e o botão voltar funcionam
  - Relacionar os arquivos da pasta app/ às rotas do Expo Router
  - Instalar o Expo Router em um projeto Expo existente
---

# Navegação em apps e o Expo Router

Programador Mobile · Encontro E36 · Aula 70 de 89

---

## O que você vai aprender

:::goal
- Reconhecer pilha, abas, gaveta e modal nos apps que você usa
- Entender a pilha de telas e o botão voltar do Android
- Ler a pasta `app/` do Expo Router, em que cada arquivo vira uma rota
- Instalar o Expo Router no `lojinha` sem recriar o projeto
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **navegação** | o caminho do usuário entre as telas: ir, voltar e lembrar de onde veio |
| **pilha de telas** (*stack*) | as telas abertas, uma por cima da outra; você vê só a de cima |
| **rota** | o endereço de uma tela, como `/carrinho` |
| **biblioteca** | um conjunto grande de código pronto, instalado como pacote, que resolve um assunto inteiro |
| **layout** | o arquivo que envolve as telas de uma pasta, como uma moldura |
| **parâmetro de rota** | o pedaço do endereço que muda, como o `7` em `/produto/7` |

---

## Um app de uma tela só

Abra um app de delivery: a lista de restaurantes leva ao cardápio, o cardápio leva ao prato e o prato leva à sacola. Em cada passo, o voltar devolve você exatamente para onde estava, com a rolagem no mesmo ponto.

O `lojinha` ainda não faz nada disso. Ele tem quatro telas prontas em `src/telas/`, mas o cliente só vê uma, e quem escolhe qual é você, editando o código.

:::question
O que falta para um toque no produto abrir o detalhe e o voltar trazer o cliente de volta à vitrine?
:::

---

## Navegação

No WhatsApp, como você volta da conversa para a lista de conversas?

---

## :icon[file-code] Navegação e o App.js de hoje

**Navegação** é o caminho do usuário entre as telas: ir, voltar e lembrar de onde veio. No `lojinha`, quem troca a tela ainda é você:

```jsx
// imports das telas, das fontes e do TemaProvider omitidos
export default function App() {
  return (
    <TemaProvider>
      <Inicio />
      {/* <Categorias /> */}
      {/* <Galeria /> */}
      {/* <Cadastro /> */}
    </TemaProvider>
  );
}
```

Para ver o cadastro, você comenta `<Inicio />` (põe entre `{/*` e `*/}`, e o React ignora), tira o comentário de `<Cadastro />` e salva. Serve para testar o visual, mas:

- o cliente não tem como trocar de tela
- não existe voltar nem histórico
- uma tela de detalhe não saberia **qual** produto mostrar

---

## :icon[refresh-cw] E se trocar com useState?

```jsx
const [tela, setTela] = useState('inicio');

if (tela === 'detalhe') return <Detalhe onVoltar={() => setTela('inicio')} />;
return <Inicio onAbrir={() => setTela('detalhe')} />;
```

Em português: "se o estado diz `'detalhe'`, desenhe o Detalhe; se não, o Início". O toque troca a tela, mas todo o resto fica por sua conta:

| Recurso | Com `useState` | Com uma biblioteca de navegação |
|---|---|---|
| Voltar do Android | sai do app | volta uma tela |
| Histórico de várias telas | você programa | pronto |
| Animação de entrada | nenhuma | a nativa do sistema |
| Cabeçalho com título e seta | você desenha | pronto |
| Dizer qual produto abrir | props passadas à mão | parâmetro no endereço |

---

## Padrões de navegação

Quantos jeitos diferentes de trocar de tela o seu app favorito usa?

---

## :icon[layout-grid] Padrões de navegação

Um **padrão de navegação** é um jeito de andar entre telas que se repete em quase todo app. São quatro:

- **Pilha** (*stack*): uma tela entra por cima da outra, como cartas; voltar tira a de cima
- **Abas** (*tabs*): uma barra fixa no rodapé com as seções principais, como as abas de um fichário
- **Gaveta** (*drawer*): um menu que desliza da borda da tela, como uma gaveta que se puxa
- **Modal**: uma tela que sobe por cima para uma tarefa curta e fecha, como um post-it colado na página

Apps grandes misturam: abas no rodapé e uma pilha dentro de cada aba.

---

## :icon[smartphone] Os padrões nos apps que você usa

| Padrão | Onde você já viu | No Lojinha |
|---|---|---|
| **Pilha** | WhatsApp: conversas, conversa, contato | Início, Detalhe, Carrinho (E36) |
| **Abas** | Instagram: início, busca, perfil | quatro abas (E37) |
| **Gaveta** | Gmail: entrada, enviados | não usa |
| **Modal** | lojas: filtros da busca | Filtros (E37) |

Abra um desses apps no seu celular e procure os quatro padrões. Quase sempre aparecem dois ou três no mesmo app.

---

## A pilha de telas

O que acontece com a tela de baixo quando outra abre por cima dela?

---

## :icon[layers] A pilha de telas

Pense numa pilha de cartas: cada tela nova é uma carta posta por cima. Você só vê a de cima, e voltar tira essa carta, mostrando a de baixo do jeito que estava.

:::center
![Animação: push coloca Detalhe 7 e depois Carrinho por cima do Início; back tira o Carrinho e o Detalhe 7 volta a ser a tela visível, do jeito que estava](images/e36-pilha-de-telas.svg)
:::

- **Empilhar** (push, "empurrar"): abre uma tela por cima, como o Detalhe 7 e depois o Carrinho
- **Desempilhar** (back, "voltar"): fecha a tela de cima
- A tela de baixo **continua montada**, isto é, continua existindo, só escondida: a rolagem e o que foi digitado estão lá quando você volta

---

## :icon[layers] A pilha na prática

Um cliente na Lojinha, toque por toque. A pilha está escrita de baixo para cima: a última tela é a que aparece.

```plaintext
abre o app              Início
toca no Tênis           Início, Detalhe 7
toca em Adicionar       Início, Detalhe 7, Carrinho
toca em voltar          Início, Detalhe 7
toca em voltar          Início
toca em voltar          Android: sai do app
```

- Cada toque que abre uma tela acrescenta uma carta no fim da lista
- Cada voltar tira a última carta
- Quando o Detalhe 7 reaparece, ele está do jeito que o cliente deixou, porque continuou montado

---

## :icon[undo-2] O botão voltar e o histórico

A pilha é o **histórico** do app: a lista das telas por onde o cliente passou. Cada sistema oferece um jeito de andar para trás nela:

| Ação | Android | iOS |
|---|---|---|
| Voltar uma tela | botão ou gesto voltar do sistema | seta do cabeçalho ou deslizar da borda esquerda |
| Voltar na primeira tela | sai do app | não há seta: nada acontece |
| Seta no cabeçalho | aparece a partir da segunda tela | aparece com o nome da tela de baixo |

Uma biblioteca de navegação liga tudo isso à pilha por você. Com a troca feita à mão, o voltar do Android sai do app no meio da compra.

---

## Pense

:::question
Quantas telas tem o Lojinha e como elas se ligam? Liste os arquivos de `src/telas/` e desenhe, com setas, de onde o cliente sai e aonde chega a cada toque.
:::

:::tip Resposta
Hoje são quatro arquivos: `Inicio`, `Categorias`, `Galeria` e `Cadastro`. A `Galeria` é a vitrine do UI kit para quem desenvolve; o cliente não precisa chegar a ela. Neste encontro entram `Detalhe` e `Carrinho`, ligados em pilha:

```plaintext
Início --toque no produto--> Detalhe --adicionar--> Carrinho
Início --ver carrinho--------------------------------> Carrinho
```

Ao fim da unidade, o cliente navega por cinco telas: Início, Categorias, Detalhe, Carrinho e Perfil.
:::

---

## Expo Router

E se cada tela do app tivesse um endereço, como as páginas de um site?

---

## :icon[route] Expo Router: rotas por arquivo

Uma **rota** é o endereço de uma tela, como `/carrinho`. É a mesma ideia do endereço de uma página na barra do navegador.

O **Expo Router** é a biblioteca de navegação que você vai usar. Nele, cada arquivo da pasta `app/` vira uma rota, como as páginas de um site:

| Arquivo | Rota |
|---|---|
| `app/index.js` | `/`, a tela inicial |
| `app/carrinho.js` | `/carrinho` |

Você cria o arquivo, e a tela passa a ter endereço. Ninguém precisa listar as telas em outro lugar.

---

## :icon[layers] Por baixo: o React Navigation

O Expo Router é construído sobre o **React Navigation**, a biblioteca de navegação mais usada no React Native: a pilha, as abas, as animações e o voltar do Android vêm de lá. O Expo Router decide quais telas existem olhando os arquivos.

| | React Navigation direto | Expo Router |
|---|---|---|
| Telas | declaradas em código, uma a uma | os arquivos de `app/` |
| Abrir o produto 7 | `navigation.navigate('Detalhe', { id: 7 })` | `router.push('/produto/7')` |
| Link que abre o app | configuração extra | toda tela já tem endereço |

Em tutoriais na internet, você vai ver os dois jeitos. Neste curso, só o Expo Router.

---

## :icon[folder-tree] A pasta app/ e o _layout.js

A pasta **`app/`** guarda só as rotas do app. O código das telas continua em `src/`:

```plaintext
lojinha/
├── app/
│   ├── _layout.js      como as telas se apresentam (pilha)
│   ├── index.js        tela inicial
│   ├── carrinho.js
│   └── produto/
│       └── [id].js     detalhe de qualquer produto
└── src/
    └── telas/          o código das telas continua aqui
```

- Em `app/` só ficam rotas: todo arquivo ali vira tela e precisa de `export default`
- O **`_layout.js`** não é tela: ele **envolve** as rotas da mesma pasta, como a moldura de um quadro. É nele que você escolhe a pilha e coloca provedores como o `TemaProvider`
- Componentes, dados e utilitários continuam em `src/`

---

## :icon[map-pin] Arquivo vira rota: as rotas na prática

:::center
![Diagrama: dentro da moldura do app/_layout.js, index.js responde por /, carrinho.js por /carrinho e o mesmo produto/[id].js por /produto/7 e /produto/12](images/e36-arquivo-vira-rota.svg)
:::

`app/index.js` abre o Início em `/`: `index` é a rota da própria pasta, como o `index.html` de um site. `app/carrinho.js` responde por `/carrinho`. O `app/_layout.js` não tem rota: é a moldura.

Colchetes no nome criam uma **rota dinâmica**. O `[id]` é um espaço em branco no endereço, como o espaço do ingrediente numa receita (E07). O valor posto ali, como o `7` de `/produto/7`, chega à tela como **parâmetro**. Um arquivo atende os 12 produtos.

---

## Instalação

Precisa jogar fora o app que você já fez para ganhar navegação?

---

## :icon[terminal] Instalação (1): os pacotes

Instalar o Expo Router é baixar os pacotes dele, os ingredientes prontos do E02. O `lojinha` nasceu do modelo `blank`, sem rotas, e não precisa ser recriado. Na pasta do projeto:

```bash
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
```

| Pacote | Para quê |
|---|---|
| `expo-router` | rotas por arquivo, `Stack`, `Link` e `router` |
| `react-native-screens` | cada rota vira uma tela nativa do sistema |
| `react-native-safe-area-context` | margens do notch (já veio no E30) |
| `expo-linking` e `expo-constants` | endereços e configuração do app |
| `expo-status-bar` | barra de status (já veio no modelo) |

:::tip
`npx expo install` escolhe as versões compatíveis com o seu projeto. Com `npm install`, você arrisca pacotes que não conversam entre si.
:::

---

## :icon[settings] Instalação (2): main e scheme

Duas mudanças dizem ao Expo que o app agora começa pelas rotas. No `package.json`:

```json
{
  "main": "expo-router/entry"
}
```

No `app.json`:

```json
{
  "expo": {
    "scheme": "lojinha"
  }
}
```

- O **`main`** é a porta de entrada: com `expo-router/entry`, o Expo deixa de abrir o `App.js` e passa a ler a pasta `app/`
- O **`scheme`** dá ao app um endereço próprio, como `lojinha://produto/7`, usado por links que abrem o app
- Pare o servidor e suba de novo limpando o cache: `npx expo start -c`

:::warning
Troque só o valor do `main` e acrescente o `scheme` dentro de `"expo"`. O resto dos dois arquivos continua igual.
:::

---

## :icon[code] Exemplo: duas telas e um Link

```jsx
// app/_layout.js
import { Stack } from 'expo-router';

export default function Layout() {
  return <Stack />;
}
```

```jsx
// app/index.js
import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function Inicio() {
  return (
    <View>
      <Text>Bem-vindo à loja</Text>
      <Link href="/sobre">Sobre a loja</Link>
    </View>
  );
}
```

- `<Stack />` é a pilha: cada arquivo de `app/` vira uma carta dela
- `<Link href="/sobre">` é um texto que, tocado, abre a rota `/sobre`

Crie também `app/sobre.js` com um `Text`. Na tela: tocar em "Sobre a loja" empilha a nova tela com animação, e a seta do cabeçalho ou o voltar do Android trazem você de volta. Sem título configurado, o cabeçalho mostra o nome do arquivo: `index` e `sobre`.

---

## Erros comuns

O app continua abrindo a tela antiga. Por onde começar a procurar?

---

## :icon[siren] Quando aparece um erro

| O que aparece | Quer dizer | O que fazer |
|---|---|---|
| o app continua abrindo o `App.js` | o `"main"` não foi trocado | `"main": "expo-router/entry"` |
| tela em branco ou erro estranho depois de instalar | o Expo guardou uma cópia antiga, o **cache** | `npx expo start -c` |
| uma rota `/CartaoProduto` | há um componente em `app/`, e todo arquivo ali vira tela | levar o componente para `src/` |
| `missing the required default export` | o arquivo da rota está sem `export default` | acrescentar o `export default` |
| `Unmatched Route` | nenhum arquivo atende o endereço: `/produtos/7`, com a pasta `produto/` | comparar o endereço com a árvore de `app/` |

---

## Resumo

:::summary
- Trocar a tela no `App.js` à mão não dá ao cliente voltar, histórico nem parâmetros
- Apps combinam quatro padrões de navegação: pilha, abas, gaveta e modal
- Na pilha, cada tela nova entra por cima e o voltar tira a de cima; na primeira tela, o voltar do Android sai do app
- No Expo Router, cada arquivo de `app/` é uma rota, `[id]` cria uma rota dinâmica e o `_layout.js` envolve as rotas
- Em projeto existente: `npx expo install`, `"main": "expo-router/entry"`, `"scheme"` e `npx expo start -c`
:::

---

## :icon[arrow-right] Próximos passos

Com o Expo Router instalado, a aula 71 transforma o `lojinha` em um app de três telas:

- :icon[layers] `app/_layout.js` com a pilha e as cores do tema no cabeçalho
- :icon[link] `Link` e `router.push` para abrir o detalhe de um produto
- :icon[hash] `useLocalSearchParams` para descobrir qual produto mostrar
- :icon[shopping-cart] um `CarrinhoContext` que tira o carrinho do Início e o leva a todas as telas, com as mesmas regras do E07 e do E09
