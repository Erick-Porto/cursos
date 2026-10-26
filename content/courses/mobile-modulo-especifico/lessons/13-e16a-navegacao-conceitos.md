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

Programador Mobile: Módulo Específico · Encontro E16 · Aula 13 de 71

---

## O que você vai aprender

:::goal
- Reconhecer pilha, abas, gaveta e modal nos apps que você usa
- Entender a pilha de telas e o botão voltar do Android
- Ler a pasta `app/` do Expo Router, em que cada arquivo vira uma rota
- Instalar o Expo Router no `lojinha` sem recriar o projeto
:::

---

## Um app de uma tela só

Abra um app de delivery: a lista de restaurantes leva ao cardápio, o cardápio leva ao prato e o prato leva à sacola. Em cada passo, o voltar devolve você exatamente para onde estava, com a rolagem no mesmo ponto.

O `lojinha` ainda não faz nada disso. Ele tem quatro telas prontas em `src/telas/`, mas o cliente só vê uma, e quem escolhe qual é você, editando o código.

:::question
O que falta para um toque no produto abrir o detalhe e o voltar trazer o cliente de volta à vitrine?
:::

---

## :icon[file-code] O App.js de hoje

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

Para ver o cadastro, você comenta `<Inicio />`, tira o comentário de `<Cadastro />` e salva. Serve para testar o visual, mas:

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

O toque troca a tela, mas todo o resto fica por sua conta:

| Recurso | Com `useState` | Com uma biblioteca de navegação |
|---|---|---|
| Voltar do Android | sai do app | volta uma tela |
| Histórico de várias telas | você programa | pronto |
| Animação de entrada | nenhuma | a nativa do sistema |
| Cabeçalho com título e seta | você desenha | pronto |
| Dizer qual produto abrir | props passadas à mão | parâmetro no endereço |

---

## :icon[layout-grid] Padrões de navegação

Quase todo app combina quatro padrões:

| Padrão | Como funciona | Onde você já viu | No Lojinha |
|---|---|---|---|
| **Pilha** (stack) | uma tela entra por cima da outra; voltar tira a de cima | WhatsApp: conversas, conversa, contato | Início, Detalhe, Carrinho (E16) |
| **Abas** (tabs) | barra fixa no rodapé com as seções principais | Instagram: início, busca, perfil | quatro abas (E17) |
| **Gaveta** (drawer) | menu que desliza da borda | Gmail: entrada, enviados | não usa |
| **Modal** | sobe por cima para uma tarefa curta e fecha | lojas: filtros da busca | Filtros (E17) |

Apps grandes misturam: abas no rodapé e uma pilha dentro de cada aba.

---

## :icon[layers] A pilha de telas

Pense numa pilha de pratos: cada tela nova é um prato colocado por cima. Você só vê o de cima, e voltar tira esse prato, revelando o de baixo do jeito que estava.

:::center
![Animação: push coloca Detalhe 7 e depois Carrinho por cima do Início; back tira o Carrinho e o Detalhe 7 volta a ser a tela visível, do jeito que estava](images/e16-pilha-de-telas.svg)
:::

- **Empilhar** (push): abre uma tela por cima, como o Detalhe 7 e depois o Carrinho
- **Desempilhar** (back): fecha a tela de cima
- A tela de baixo **continua montada**: a rolagem e o que foi digitado estão lá quando você volta

---

## :icon[undo-2] O botão voltar e o histórico

A pilha é o **histórico** do app. Cada sistema oferece um jeito de andar para trás nela:

| Ação | Android | iOS |
|---|---|---|
| Voltar uma tela | botão ou gesto voltar do sistema | seta do cabeçalho ou deslizar da borda esquerda |
| Voltar na primeira tela | sai do app | não há seta: nada acontece |
| Seta no cabeçalho | aparece a partir da segunda tela | aparece com o nome da tela anterior |

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

## :icon[route] Expo Router: rotas por arquivo

Uma **rota** é o endereço de uma tela, como `/carrinho`. No **Expo Router**, cada arquivo da pasta `app/` vira uma rota, como as páginas de um site.

Ele é construído sobre o **React Navigation**, a biblioteca de navegação mais usada no React Native: a pilha, as abas, as animações e o voltar do Android vêm de lá. O Expo Router decide quais telas existem olhando os arquivos.

| | React Navigation direto | Expo Router |
|---|---|---|
| Telas | declaradas em código, uma a uma | os arquivos de `app/` |
| Abrir o produto 7 | `navigation.navigate('Detalhe', { id: 7 })` | `router.push('/produto/7')` |
| Link que abre o app | configuração extra | toda tela já tem endereço |

---

## :icon[folder-tree] A pasta app/ e o _layout.js

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
- O **`_layout.js`** não é tela: ele **envolve** as rotas da mesma pasta. É nele que você escolhe a pilha e coloca provedores como o `TemaProvider`
- Componentes, dados e utilitários continuam em `src/`

---

## :icon[map-pin] Arquivo vira rota

:::center
![Diagrama: dentro da moldura do app/_layout.js, index.js responde por /, carrinho.js por /carrinho e o mesmo produto/[id].js por /produto/7 e /produto/12](images/e16-arquivo-vira-rota.svg)
:::

`app/index.js` abre o Início em `/`: `index` é a rota da própria pasta, como o `index.html` de um site. `app/carrinho.js` responde por `/carrinho`. O `app/_layout.js` não tem rota: é a moldura que envolve as rotas da pasta.

Colchetes no nome criam uma **rota dinâmica**: `[id]` aceita qualquer valor naquele trecho do endereço e entrega esse valor à tela como **parâmetro**. Um arquivo atende os 12 produtos.

---

## :icon[terminal] Instalação (1): os pacotes

O `lojinha` nasceu do modelo `blank`, sem rotas. Você não precisa recriá-lo: na pasta do projeto, instale o Expo Router e as dependências dele.

```bash
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
```

| Pacote | Para quê |
|---|---|
| `expo-router` | rotas por arquivo, `Stack`, `Link` e `router` |
| `react-native-screens` | cada rota vira uma tela nativa do sistema |
| `react-native-safe-area-context` | margens do notch (já veio no E10) |
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

Crie também `app/sobre.js` com um `Text`. Na tela: tocar em "Sobre a loja" empilha a nova tela com animação, e a seta do cabeçalho ou o voltar do Android trazem você de volta. Sem título configurado, o cabeçalho mostra o nome do arquivo: `index` e `sobre`.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Esquecer o `"main": "expo-router/entry"`: o app continua abrindo o `App.js` como se nada tivesse mudado
- Não limpar o cache depois de instalar: tela em branco ou erro estranho; suba com `npx expo start -c`
- Guardar componentes em `app/`: um `CartaoProduto.js` ali vira a rota `/CartaoProduto`. Componentes ficam em `src/`
- Rota sem `export default`: o terminal avisa que falta o componente daquela rota
- Endereço que não bate com nenhum arquivo, como `/produtos/7` com a pasta `produto/`: aparece a tela "Unmatched Route"
:::

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

Com o Expo Router instalado, a aula 14 transforma o `lojinha` em um app de três telas:

- :icon[layers] `app/_layout.js` com a pilha e as cores do tema no cabeçalho
- :icon[link] `Link` e `router.push` para abrir o detalhe de um produto
- :icon[hash] `useLocalSearchParams` para descobrir qual produto mostrar
- :icon[shopping-cart] um `CarrinhoContext` que guarda o que o cliente escolheu, visível em todas as telas
