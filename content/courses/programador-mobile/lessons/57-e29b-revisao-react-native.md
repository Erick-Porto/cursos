---
title: "Revisão: o ambiente React Native"
summary: Recapitulação do React Native de E26 a E29, questões comentadas no estilo da Prova 3 e fechamento do app mobile.
module: react-native
duration_minutes: 40
objectives:
  - Revisar os conceitos de E26 a E29
  - Resolver questões no estilo da prova
  - Concluir e documentar a versão 1 do app mobile
---

# Revisão: o ambiente React Native

Programador Mobile · Encontro E29 · Aula 57 de 89

---

## O que você vai aprender

:::goal
- Rever os temas de E26 a E29, do Expo ao app compartilhado
- Resolver cinco questões comentadas no estilo da Prova 3
- Reconhecer as armadilhas que mais derrubam nota
- Fechar e documentar a versão 1 do `minhas-tarefas-mobile` no laboratório
:::

---

## :icon[book-open] Palavras novas de hoje

São palavras que a Prova 3 usa. Você já viu todas; aqui elas vêm explicadas de novo.

| Palavra | O que é |
|---|---|
| **nativo** | feito com as peças do próprio sistema, Android ou iOS |
| **híbrido** | um site rodando dentro de um app |
| **WebView** | o navegador escondido dentro do app híbrido, que mostra o site |
| **virtualizada** | uma lista que só desenha os itens que cabem na tela |
| **cache** | uma cópia guardada para abrir mais rápido; às vezes guarda o que você já mudou |
| **lacuna** | a questão em que você escreve a palavra que falta |

---

## :icon[map] Mapa da unidade

Em quatro encontros você foi do `npx create-expo-app` ao app aberto no celular de um colega. A Prova 3 tem 20 questões, todas de E26 a E29. O React (E21 a E25) já caiu na Prova 2: aqui ele aparece só como ponte.

::::columns
:::col
**E26 e E27: o app nasce**

1. Mobile e React Native
2. Ambiente Expo e Expo Go
3. Componentes essenciais
4. StyleSheet e Flexbox
:::
:::col
**E28 e E29: o app ganha vida**

1. Estado, FlatList e Alert
2. Depuração e React Native DevTools
3. Do React ao React Native
4. Túnel e `app.json`
:::
::::

---

## Mobile e React Native

Dá para perceber quando um app é só um site disfarçado?

---

## :icon[smartphone] Mobile e React Native

Um **site** roda no navegador. Um **app** é instalado, pode notificar e usar câmera e sensores. Há três jeitos de fazer um app:

| Jeito | Como é feito | Quem desenha a tela |
|---|---|---|
| **Nativo** | Kotlin (Android) e Swift (iOS): o app é escrito duas vezes | o sistema |
| **Híbrido** | um site dentro de uma **WebView**: a TV na vitrine mostrando a loja | o navegador escondido |
| **React Native** | escrito uma vez, em JavaScript e React | o sistema, com componentes nativos |

- O JavaScript roda num motor dentro do app e pede ao sistema para desenhar a tela
- Igual ao web: JSX, componentes, props, `useState`, `useEffect` e `fetch`

---

## :icon[layers] Os três jeitos na prática

Três apps, um de cada jeito:

| App | Como foi feito | Na tela |
|---|---|---|
| banco com uma equipe Android e outra iPhone | nativo: Kotlin e Swift, tudo duas vezes | botões e listas do sistema |
| cardápio que abre o site do restaurante dentro do app | híbrido: o site numa WebView | botões de site; a rolagem às vezes trava |
| o seu `minhas-tarefas-mobile` | React Native: uma base em JavaScript | botões e listas do sistema |

```jsx
<Text>Minhas Tarefas</Text>
// no Android, vira o texto do Android; no iPhone, o do iPhone
```

---

## O Expo

Precisa instalar o Android Studio para ver o seu app no celular?

---

## :icon[terminal] Ambiente Expo

O **Expo** é o kit sobre o React Native, como o Vite do E21 no mundo mobile. Ele cria o projeto com um comando, roda o app no celular sem Android Studio nem Xcode e traz pacotes prontos para câmera, localização e outros recursos do aparelho.

```bash
npx create-expo-app@latest minhas-tarefas-mobile --template blank
cd minhas-tarefas-mobile
npx expo start
```

- `npx create-expo-app@latest` cria o projeto; `npx expo start` sobe o servidor e mostra o QR code
- O **Expo Go** lê o QR code; celular e computador no mesmo Wi-Fi (ou use `--tunnel`)
- Salvou o arquivo, o celular atualiza: **Fast Refresh** (*atualização rápida*)

---

## :icon[keyboard] O Expo na prática

Com o `npx expo start` rodando, o terminal responde a teclas. Três situações do dia a dia:

| Situação | O que fazer | O que acontece |
|---|---|---|
| salvou o `App.js` | nada | o celular atualiza sozinho: Fast Refresh |
| o app travou | tecla `r` | recarrega o app |
| quer ver props e estado | tecla `j` | abre o React Native DevTools |

Outras teclas: `m` abre o menu do desenvolvedor; `a` abre o emulador Android, se a máquina tiver um.

Estrutura do projeto: `App.js` (componente raiz, o primeiro que aparece), `app.json` (nome, ícone, splash), `assets/` (imagens), `package.json`.

---

## Componentes essenciais

Quais peças de Lego você usou em todas as telas até agora?

---

## :icon[component] Componentes essenciais

Componentes são as peças de Lego da tela. As peças básicas vêm prontas: tudo vem de `react-native`.

- `View` agrupa, como uma caixa; `Text` mostra texto; `Image` precisa de `source` e de tamanho (`width` e `height`)
- **Todo texto fica dentro de `Text`**; texto solto em `View` é erro
- `ScrollView` rola o que não cabe; `TextInput` recebe digitação
- `Button` é simples, com a aparência fixa do sistema; `Pressable` aceita qualquer filho e estilo
- `SafeAreaView` (de `react-native-safe-area-context`) afasta o conteúdo do entalhe da câmera e da barra de status; `StatusBar` vem de `expo-status-bar`

```jsx
import { View, Text, Pressable } from 'react-native';

<View style={estilos.cartao}>
  <Text style={estilos.titulo}>{titulo}</Text>
  <Pressable onPress={onRemover}><Text>Remover</Text></Pressable>
</View>
```

---

## :icon[image] Componentes essenciais na prática

```jsx
// 1. imagem da internet, com tamanho
<Image source={{ uri: 'https://exemplo.com/fone.png' }} style={{ width: 80, height: 80 }} />

// 2. botão simples, com a cara do sistema
<Button title="Adicionar" onPress={adicionar} />

// 3. botão livre, com o seu estilo
<Pressable style={estilos.botao} onPress={adicionar}>
  <Text style={estilos.textoBotao}>Adicionar</Text>
</Pressable>
```

- Caso 1: sem `width` e `height`, a imagem da internet não aparece
- Caso 2: `Button` recebe só o `title`; a cor e a forma são do sistema
- Caso 3: `Pressable` aceita qualquer filho e estilo próprio

---

## StyleSheet e Flexbox

Por que 16px não funciona no estilo de um app?

---

## :icon[braces] StyleSheet e Flexbox

O estilo é um objeto JavaScript. O **Flexbox** é a prateleira: você escolhe a direção, o alinhamento e o espaço entre as caixas.

- Estilos são objetos em `StyleSheet.create`, aplicados com `style`; nomes em **camelCase** (`backgroundColor`)
- Medidas são **números sem unidade** (`padding: 16`); strings só para cores e porcentagens
- Toda `View` já é **flex**, em **coluna** por padrão; `flexDirection: 'row'` coloca lado a lado
- `justifyContent` distribui no **eixo principal**, o da direção; `alignItems`, no **eixo cruzado**, o outro; `flex: 1` ocupa o espaço livre
- Estilo condicional com array: `style={[estilos.cartao, concluida && estilos.concluida]}`

```jsx
const estilos = StyleSheet.create({
  linha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cartao: { padding: 16, borderRadius: 8, backgroundColor: '#fff' },
  concluida: { opacity: 0.5 },
});
```

---

## :icon[layout-grid] Flexbox na prática

```jsx
// 1. sem flexDirection: coluna
<View>
  <Text>Lojinha</Text>
  <Text>12 produtos</Text>
</View>

// 2. linha, nas pontas, no meio da altura
<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 56 }}>
  <Text>Lojinha</Text>
  <Text>12 produtos</Text>
</View>
```

```jsx
// 3. o campo ocupa o que sobra ao lado do botão
<View style={{ flexDirection: 'row', gap: 8 }}>
  <TextInput style={{ flex: 1 }} placeholder="Nova tarefa" />
  <Button title="Adicionar" onPress={adicionar} />
</View>
```

- Caso 1: "Lojinha" em cima, "12 produtos" embaixo, os dois à esquerda
- Caso 2: "Lojinha" à esquerda e "12 produtos" à direita, no meio da altura
- Caso 3: o campo estica até encostar no botão

---

## Estado e FlatList

O placar mudou: quem avisa a tela para se redesenhar?

---

## :icon[list] Estado, FlatList e Alert

O **estado** é o placar do jogo: quando muda, a tela se redesenha. O `useState` é o mesmo do web; mudam os eventos.

- `onPress` no lugar de `onClick`; `onChangeText` no lugar de `onChange`
- `TextInput` controlado: `value={texto}` e `onChangeText={setTexto}`; o texto chega pronto, sem `e.target.value`
- O array muda com `setTarefas` e uma cópia nova; `push` sem `setTarefas` não redesenha a tela
- `Alert.alert(titulo, mensagem, botoes)` confirma ações destrutivas, as que apagam algo; cada botão é `{ text, onPress }`
- O estado mora no `App` e desce por props (`onAdicionar`, `onAlternar`, `onRemover`)

---

## :icon[rows-3] FlatList: a esteira

A **`FlatList`** é uma esteira: desenha só os itens que cabem na tela e reaproveita os componentes conforme você rola. Ela recebe três props:

- `data`: o array
- `renderItem`: `({ item }) => ...`, desenha um item
- `keyExtractor`: devolve o crachá de cada item, como **string**

E uma opcional: `ListEmptyComponent`, o que aparece quando a lista está vazia.

---

## :icon[file-code] Estado e FlatList na prática

```jsx
// 1. adicionar: um array novo no estado, e a tela se redesenha
setTarefas([...tarefas, nova]);
```

```jsx
// 2. a lista, com aviso de lista vazia
<FlatList
  data={tarefas}
  keyExtractor={(item) => String(item.id)}
  renderItem={({ item }) => <CartaoTarefa titulo={item.titulo} concluida={item.concluida} />}
  ListEmptyComponent={<Text>Nenhuma tarefa</Text>}
/>

// 3. confirmar antes de remover
Alert.alert('Remover?', 'Esta ação não pode ser desfeita', [
  { text: 'Cancelar' },
  { text: 'Remover', onPress: () => removerTarefa(id) },
]);
```

- Caso 1: a tarefa nova aparece na lista. Com `tarefas.push(nova)`, nada aparece
- Caso 2: com o array vazio, "Nenhuma tarefa"
- Caso 3: a caixa do sistema com Cancelar e Remover; só o Remover apaga

---

## Depuração

Tela vermelha ou aviso amarelo: qual dos dois para o app?

---

## :icon[bug] Depuração

**Depurar** é achar e corrigir um erro. A mensagem de erro é a luz do painel do carro: diz o que aconteceu e onde.

- **Menu do desenvolvedor**: agite o celular ou tecle `m` no terminal; tem Reload, inspetor e monitor de performance
- `console.log` aparece no **terminal do Expo** (`LOG`, `WARN`, `ERROR`), não no celular
- **Tela vermelha**: o app parou; leia a primeira linha, o arquivo e a linha indicada
- **Aviso amarelo**: o app continua, mas é um bug esperando a vez (chave faltando, por exemplo)

---

## :icon[search] Depuração: ferramentas e método

- Tecla `j`: o **React Native DevTools** mostra props e estado (Components) e pausa o app em breakpoints, os pontos de parada (Sources), como no E03
- O **Expo Snack** (snack.expo.dev) roda e compartilha código no navegador
- Método: reproduzir, isolar, formular hipótese, testar **uma mudança por vez**
- Travou? Tecle `r`. Mudou o `app.json`? `npx expo start -c`, que limpa o cache

---

## :icon[siren] Depuração na prática

| O que você fez | Onde aparece | O que você vê |
|---|---|---|
| `console.log('Tarefas:', tarefas.length)` | no terminal do Expo | `LOG  Tarefas: 3` |
| texto solto dentro de uma `View` | tela vermelha; o app parou | `Text strings must be rendered within a <Text> component` |
| `map` sem `key` | aviso amarelo; o app continua | `Each child in a list should have a unique "key" prop` |

Nos três casos, leia a mensagem inteira antes de mexer no código: ela diz o que aconteceu e, quase sempre, onde.

---

## Do React ao React Native

Do minhas-tarefas web para o celular, o que você copiou sem mudar nada?

---

## :icon[arrow-left-right] Do React ao React Native

Levar o app da web para o celular é como traduzir um livro: a história é a mesma, só o idioma muda.

- A **lógica** é copiada: componentes como funções, props, `useState`, `useEffect`, hooks próprios, `map`, `filter` e `fetch` são React e JavaScript, não navegador
- A **tela** é traduzida: `div` vira `View`, `p` vira `Text`, `button` vira `Pressable`, `input` vira `TextInput` e `className` vira `style`
- Eventos: `onClick` vira `onPress`; `onChange` com `e.target.value` vira `onChangeText`, que entrega a string, o texto pronto
- Listas longas: o `map` com `key` vira `FlatList` com `renderItem` e `keyExtractor`
- `--tunnel` abre o app em qualquer rede, enquanto o seu servidor estiver ligado; o `app.json` define `name`, `slug`, `version`, `icon` e `splash`

```bash
npx expo start -c --tunnel
```

---

## :icon[columns-3] Do React ao React Native na prática

O mesmo cartão, nas duas plataformas:

::::columns
:::col
Web

```jsx
<div className="cartao">
  <p>{titulo}</p>
  <input value={nota} onChange={(e) => setNota(e.target.value)} />
  <button onClick={remover}>Remover</button>
</div>
```
:::
:::col
React Native

```jsx
<View style={estilos.cartao}>
  <Text>{titulo}</Text>
  <TextInput value={nota} onChangeText={setNota} />
  <Pressable onPress={remover}><Text>Remover</Text></Pressable>
</View>
```
:::
::::

O `useState` de `nota` e a função `remover` não mudam: são lógica. Mudam as peças, o estilo e os eventos: são tela.

---

## A prova

Hoje é o ensaio geral: que tipos de questão vão cair?

---

## :icon[clipboard-check] Como será a prova

Antes de treinar com as questões, conheça o formato da Prova 3.

| Item | Como é |
|---|---|
| Questões | 20 objetivas, todas de React Native (E26 a E29) |
| Tempo | 60 minutos, 1 tentativa |
| Nota mínima | 70 |
| Onde | No sistema, na última hora do encontro |

Tipos: **escolha única**, **múltipla escolha** (marque todas as corretas), **verdadeiro ou falso** e **lacuna** (escreva o nome exato, como `FlatList` ou `onChangeText`).

:::tip Leia o enunciado
- Em questões com código, leia linha por linha antes das alternativas
- Palavras como **não**, **sempre**, **só** e **web** mudam a resposta
- Quando a questão compara web e celular, pergunte-se: isso é React ou é navegador?
:::

---

## Questão comentada 1

:::question
O que acontece ao abrir este componente no celular?

```jsx
function Cabecalho() {
  return (
    <View>
      Minhas Tarefas
      <Text>3 pendentes</Text>
    </View>
  );
}
```

- a) Mostra as duas linhas de texto
- b) Mostra só "3 pendentes"
- c) Tela vermelha: texto fora de `Text`
- d) Aviso amarelo, mas o app funciona
:::

:::tip Resposta
**c.** No React Native, texto só existe dentro de `Text`. "Minhas Tarefas" está solto dentro de `View`, e o erro `Text strings must be rendered within a <Text> component` para o app. Na web, `div` aceita texto direto; é esse hábito que engana. Na prova, procure texto solto sempre que vir uma `View`.
:::

---

## Questão comentada 2

:::question
Um colega renomeou o campo `id` das tarefas para `codigo`, e a lista passou a mostrar o aviso `missing keys for items`. Qual prop resolve?

```jsx
<FlatList
  data={tarefas}
  renderItem={({ item }) => <CartaoTarefa titulo={item.titulo} />}
/>
```

- a) `key={item.codigo}` no `CartaoTarefa`, dentro do `renderItem`
- b) `keyExtractor={(item) => String(item.codigo)}` na `FlatList`
- c) `id={tarefas}` na `FlatList`
- d) Nada: a `FlatList` gera as chaves sozinha
:::

:::tip Resposta
**b.** A `FlatList` identifica cada item pelo `keyExtractor`, que deve devolver uma **string** única. Sem ele, ela procura `key` ou `id` no objeto; como o campo virou `codigo`, não encontra e avisa. A opção **a** imita a `key` do `map`, mas a `FlatList` não lê a `key` do que o `renderItem` devolve. Sem um crachá que não muda, remover um item faz os cartões trocarem de lugar.
:::

---

## Questão comentada 3

:::question
Qual linha está correta dentro de `StyleSheet.create` para um espaçamento interno de 16?

```jsx
const estilos = StyleSheet.create({
  cartao: {
    // complete com a opção correta
  },
});
```

- a) `padding: '16px'`
- b) `padding: 16px`
- c) `padding: 16`
- d) `padding: '16'`
:::

:::tip Resposta
**c.** No React Native, medidas são **números sem unidade**: `padding: 16` são 16 pontos, e o sistema ajusta o tamanho para cada tela (o E30 mostra como). A opção **a** é a tentação de quem vem do CSS, mas `'16px'` não é um valor válido e o estilo não é aplicado (em algumas versões, o app mostra erro). A **b** nem é JavaScript válido. Strings só para cores (`'#fff'`) e porcentagens (`'50%'`).
:::

---

## Questão comentada 4

:::question
O campo abaixo não atualiza o estado quando o usuário digita. Qual é a correção?

```jsx
<TextInput
  value={texto}
  onChange={(e) => setTexto(e.target.value)}
/>
```

- a) Trocar `onChange` por `onInput`
- b) Trocar `e.target.value` por `e.value`
- c) Trocar por `onChangeText={(novoTexto) => setTexto(novoTexto)}`
- d) Adicionar `type="text"` ao `TextInput`
:::

:::tip Resposta
**c.** No React Native, `onChangeText` recebe o texto digitado já como string; dá até para escrever `onChangeText={setTexto}`. `onChange` existe no `TextInput`, mas o evento não tem `target.value` (o texto fica em `e.nativeEvent.text`), então `setTexto` recebe `undefined` e o campo trava. `onInput` e `type` são coisas do HTML.
:::

---

## Questão comentada 5

:::question
Um app de loja precisa mostrar **500 produtos** vindos de uma API, com rolagem. Qual é o componente mais adequado?

- a) `ScrollView` com `produtos.map(...)` dentro
- b) `View` com `produtos.map(...)` dentro
- c) `FlatList` com `data={produtos}`
- d) `Text` com `produtos.join(', ')`
:::

:::tip Resposta
**c.** A `FlatList` é **virtualizada**: desenha só os itens que cabem na tela e reaproveita os componentes conforme você rola. A opção **a** funciona para poucos itens fixos (um formulário, uma tela de perfil), mas com 500 produtos cria 500 componentes de uma vez, deixando o app lento e gastando memória. `View` sozinha nem rola. Regra prática: se os itens vêm de um array, use `FlatList`.
:::

---

## :icon[triangle-alert] Erros que mais reprovam

:::warning
- Misturar o que é **React** (igual nas duas plataformas: `useState`, props, `map`, `useEffect`) com o que é **React Native** (`View`, `Text`, `StyleSheet`, `FlatList`)
- Copiar o `onChange` com `e.target.value` para o `TextInput`: no celular é `onChangeText`
- Escrever estilo como CSS: `padding: '16px'`, `background-color`, `className`
- Esquecer o `keyExtractor` (ou devolver número) e errar a prop que recebe o array: é `data`, não `items`
- Inverter os eixos do Flexbox: `justifyContent` é o eixo principal, `alignItems` o cruzado, e a `View` começa em **coluna**
:::

Se um enunciado parece fácil demais, procure um desses cinco antes de responder.

---

## :icon[flask-conical] No laboratório

**40 minutos.** Fechar a versão 1 do **Minhas Tarefas mobile**.

:::steps
1. No `app.json`: `name` "Minhas Tarefas", `icon` e `splash` com imagens suas em `assets/`, `version` "1.0.0"; ajuste as cores do `StyleSheet`
2. Rode `npx expo start -c --tunnel` e peça a um colega para ler o QR code no Expo Go
3. `git add .`, `git commit -m "v1 mobile"` e `git push`
4. No `README.md`: o que o app faz, uma captura de tela e como rodar (`npm install`, `npx expo start`)
:::

**Critérios**: o app abre no celular de um colega e adiciona, conclui e remove tarefas; `app.json` com nome e ícone próprios; commit e README no GitHub.

Entrega: link do repositório no sistema. Depois, a **Prova 3** (60 minutos, no sistema).

---

## :icon[milestone] Projeto 5 · Etapa 4: hook, regras e entrega

Etapa curta, para casa. No `gota`, a tela não muda; muda onde a lógica mora:

- `src/regras/agua.js`: `totalDoDia`, `percentualDaMeta`, `quantoFalta`, `mensagemDaFaixa`, `validarMeta` e `formatarHora`, puras: recebem valores e devolvem valores
- `src/hooks/useConsumo.js` com o estado e as funções; o `App` só monta a tela e confirma a remoção
- `CartaoProgresso` mostra quanto falta e a mensagem da faixa
- `app.json` com `"name": "Gota"`; README com dois prints do celular e como rodar

Commit: `Projeto 5: etapa 4, hook, regras e entrega`. Prazo: **início do E30**, com o link do repositório na página do projeto, em **Projetos**.
