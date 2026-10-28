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

## :icon[smartphone] Mobile e React Native

- Um **site** roda no navegador; um **app** é instalado, pode notificar e acessar câmera e sensores
- **Nativo**: Kotlin ou Swift, uma base de código por sistema. **Híbrido**: um site dentro de uma **WebView**. **React Native**: JavaScript que vira componentes nativos de verdade
- O código JavaScript roda em um motor dentro do app e pede ao sistema para desenhar a tela
- **Expo** é o kit sobre o React Native: cria o projeto, roda no celular pelo **Expo Go** e dá acesso ao aparelho com pacotes prontos
- O que fica igual ao web: JSX, componentes, props, `useState`, `useEffect` e `fetch`

---

## :icon[terminal] Ambiente Expo

- `npx create-expo-app@latest` cria o projeto; `npx expo start` sobe o servidor e mostra o QR code
- O **Expo Go** lê o QR code; celular e computador no mesmo Wi-Fi (ou use `--tunnel`)
- Tecla `r` recarrega; `m` abre o menu do desenvolvedor; `j` abre o React Native DevTools; `a` abre o emulador Android, se a máquina tiver um
- Estrutura: `App.js` (componente raiz), `app.json` (nome, ícone, splash), `assets/` (imagens), `package.json`
- Salvou o arquivo, o celular atualiza: **Fast Refresh**

```bash
npx create-expo-app@latest minhas-tarefas-mobile --template blank
cd minhas-tarefas-mobile
npx expo start
```

---

## :icon[component] Componentes essenciais

- Tudo vem de `react-native`: `View` agrupa, `Text` mostra texto, `Image` precisa de `source` e de tamanho
- **Todo texto fica dentro de `Text`**; texto solto em `View` é erro
- `ScrollView` rola o que não cabe; `TextInput` recebe digitação; `Button` é simples; `Pressable` aceita qualquer filho e estilo
- `SafeAreaView` (de `react-native-safe-area-context`) afasta o conteúdo do entalhe e da barra de status; `StatusBar` vem de `expo-status-bar`

```jsx
import { View, Text, Pressable } from 'react-native';

<View style={estilos.cartao}>
  <Text style={estilos.titulo}>{titulo}</Text>
  <Pressable onPress={onRemover}><Text>Remover</Text></Pressable>
</View>
```

---

## :icon[braces] StyleSheet e Flexbox

- Estilos são objetos em `StyleSheet.create`, aplicados com `style`; nomes em **camelCase** (`backgroundColor`)
- Medidas são **números sem unidade** (`padding: 16`); strings só para cores e porcentagens
- Toda `View` já é **flex**, em **coluna** por padrão; `flexDirection: 'row'` coloca lado a lado
- `justifyContent` distribui no eixo principal; `alignItems`, no eixo cruzado; `flex: 1` ocupa o espaço livre
- Estilo condicional com array: `style={[estilos.cartao, concluida && estilos.concluida]}`

```jsx
const estilos = StyleSheet.create({
  linha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cartao: { padding: 16, borderRadius: 8, backgroundColor: '#fff' },
  concluida: { opacity: 0.5 },
});
```

---

## :icon[list] Estado, FlatList e Alert

- `useState` é o mesmo do web; mudam os eventos: `onPress` no lugar de `onClick`, `onChangeText` no lugar de `onChange`
- `TextInput` controlado: `value={texto}` e `onChangeText={setTexto}`; o texto chega pronto, sem `e.target.value`
- `FlatList` desenha só o visível: `data` (array), `renderItem` (`({ item }) => ...`) e `keyExtractor` (devolve **string**)
- `Alert.alert(titulo, mensagem, botoes)` confirma ações destrutivas; cada botão é `{ text, onPress }`
- O estado mora no `App` e desce por props (`onAdicionar`, `onAlternar`, `onRemover`)

```jsx
<FlatList
  data={tarefas}
  keyExtractor={(item) => String(item.id)}
  renderItem={({ item }) => <CartaoTarefa titulo={item.titulo} concluida={item.concluida} />}
  ListEmptyComponent={<Text>Nenhuma tarefa</Text>}
/>
```

---

## :icon[bug] Depuração

- **Menu do desenvolvedor**: agite o celular ou tecle `m` no terminal; tem Reload, inspetor e monitor de performance
- `console.log` aparece no **terminal do Expo** (`LOG`, `WARN`, `ERROR`), não no celular
- **Tela vermelha**: o app parou; leia a primeira linha, o arquivo e a linha indicada
- **Aviso amarelo**: o app continua, mas é um bug esperando a vez (chave faltando, por exemplo)
- Tecla `j`: o **React Native DevTools** mostra props e estado (Components) e pausa o app em breakpoints (Sources), como no E03; o **Expo Snack** (snack.expo.dev) roda e compartilha código no navegador
- Método: reproduzir, isolar, formular hipótese, testar **uma mudança por vez**; travou, `r`; mudou o `app.json`, `npx expo start -c`

---

## :icon[arrow-left-right] Do React ao React Native

- A **lógica** é copiada: componentes como funções, props, `useState`, `useEffect`, hooks próprios, `map`, `filter` e `fetch` são React e JavaScript, não navegador
- A **tela** é traduzida: `div` vira `View`, `p` vira `Text`, `button` vira `Pressable`, `input` vira `TextInput` e `className` vira `style`
- Eventos: `onClick` vira `onPress`; `onChange` com `e.target.value` vira `onChangeText`, que entrega a string
- Listas longas: o `map` com `key` vira `FlatList` com `renderItem` e `keyExtractor`
- `--tunnel` abre o app em qualquer rede, enquanto o seu servidor estiver ligado; o `app.json` define `name`, `slug`, `version`, `icon` e `splash`

```bash
npx expo start -c --tunnel
```

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
**b.** A `FlatList` identifica cada item pelo `keyExtractor`, que deve devolver uma **string** única. Sem ele, ela procura `key` ou `id` no objeto; como o campo virou `codigo`, não encontra e avisa. A opção **a** imita a `key` do `map`, mas a `FlatList` não lê a `key` do que o `renderItem` devolve. Sem chave estável, remover um item faz os cartões trocarem de lugar.
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
**c.** No React Native, medidas são **números sem unidade**: `padding: 16` são 16 pontos independentes de densidade, e o sistema ajusta para cada tela. A opção **a** é a tentação de quem vem do CSS, mas `'16px'` não é um valor válido e o estilo não é aplicado (em algumas versões, o app mostra erro). A **b** nem é JavaScript válido. Strings só para cores (`'#fff'`) e porcentagens (`'50%'`).
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

## :icon[clipboard-check] Como será a prova

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
