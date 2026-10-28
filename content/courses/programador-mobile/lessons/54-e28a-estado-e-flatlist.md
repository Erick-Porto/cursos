---
title: Estado e FlatList no React Native
summary: Controle um TextInput com useState, renderize listas com FlatList e confirme remoções com Alert.
module: react-native
duration_minutes: 40
objectives:
  - Controlar um TextInput com estado
  - Renderizar listas com FlatList
  - Confirmar ações destrutivas com Alert
---

# Estado e FlatList no React Native

Programador Mobile · Encontro E28 · Aula 54 de 89

---

## O que você vai aprender

:::goal
- Reaproveitar o `useState` do React web no celular
- Controlar um `TextInput` com `value` e `onChangeText`
- Renderizar muitas tarefas com `FlatList` sem travar o app
- Confirmar a remoção de uma tarefa com `Alert`
:::

---

## Uma tela bonita que não faz nada

Você mostra o `minhas-tarefas-mobile` para um colega. Ele digita "Comprar pão", toca em **Adicionar**... e nada acontece.

A tela que você montou no E27 é uma foto: tarefas fixas no código, campo que não guarda nada, botão sem função.

:::question
No `minhas-tarefas` web, o que fez a lista ganhar vida no E23? A resposta é a mesma no celular.
:::

---

## :icon[refresh-cw] O mesmo useState, em outra tela

`useState` vem do pacote `react`, não do `react-native`. Ele funciona no celular como funcionou no navegador no E23: o que muda são os componentes e os eventos.

```jsx
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

export default function Contador() {
  const [toques, setToques] = useState(0);
  return (
    <View>
      <Text>Toques: {toques}</Text>
      <Pressable onPress={() => setToques(toques + 1)}>
        <Text>Tocar</Text>
      </Pressable>
    </View>
  );
}
```

Cada toque atualiza o estado e o React Native redesenha o `Text`.

---

## :icon[mouse-pointer-click] Eventos: web e React Native

| Na web (React) | No React Native |
|---|---|
| `onClick` no `<button>` | `onPress` no `Pressable` |
| `onChange={(e) => setTexto(e.target.value)}` | `onChangeText={(texto) => setTexto(texto)}` |
| `<input value={texto} />` | `<TextInput value={texto} />` |
| `onSubmit` no `<form>` | não existe `form`: trate tudo no `onPress` do botão |

A diferença que mais confunde: **`onChangeText` recebe o texto pronto**, como string. Não existe `e.target.value`, porque não existe DOM no celular.

---

## :icon[keyboard] TextInput controlado

Um **campo controlado** mostra o que está no estado e atualiza o estado a cada letra digitada.

```jsx
const [texto, setTexto] = useState('');

<TextInput
  style={estilos.campo}
  placeholder="Nova tarefa"
  value={texto}
  onChangeText={setTexto}
/>
```

- `value`: o que aparece no campo vem do estado
- `onChangeText`: recebe a string nova e guarda no estado
- `placeholder`: dica em cinza enquanto o campo está vazio

:::tip
Como `onChangeText` já entrega o texto, você pode passar `setTexto` direto, sem arrow function.
:::

---

## :icon[component] Exemplo: FormularioTarefa mobile

Mesma ideia do web: o formulário guarda o texto e avisa o pai pela prop `onAdicionar`.

```jsx
export default function FormularioTarefa({ onAdicionar }) {
  const [texto, setTexto] = useState('');
  function adicionar() {
    if (texto.trim() === '') return;
    onAdicionar(texto.trim());
    setTexto('');
  }
  return (
    <View style={estilos.formulario}>
      <TextInput value={texto} onChangeText={setTexto} placeholder="Nova tarefa" />
      <Pressable style={estilos.botao} onPress={adicionar}><Text>Adicionar</Text></Pressable>
    </View>
  );
}
```

Imports de `useState`, `View`, `Text`, `TextInput` e `Pressable` omitidos; `estilos` fica no fim do arquivo. `trim()` ignora texto só com espaços e `setTexto('')` limpa o campo.

---

## :icon[plus] Adicionando no App com spread

A receita é a mesma do React web: monte o objeto da nova tarefa, copie o array atual com `...tarefas` (o spread do E09), acrescente a nova no fim e entregue o **array novo** a `setTarefas`.

:::center
![Diagrama: com setTarefas([...tarefas, nova]) nasce um array novo com a tarefa nova no fim e a tela atualiza; com tarefas.push(nova) o mesmo array muda, ninguém chama setTarefas e a tela não muda](images/e28-spread-array-novo.svg)
:::

```jsx
function adicionarTarefa(titulo) {
  const nova = { id: Date.now(), titulo, prioridade: 'media', concluida: false };
  setTarefas([...tarefas, nova]);
}

<FormularioTarefa onAdicionar={adicionarTarefa} />
```

`Date.now()` dá um número que não se repete, bom como `id` enquanto não há servidor. Já `tarefas.push(nova)` altera o mesmo array, sem `setTarefas`, e a tela não muda.

---

## :icon[list] FlatList: a lista que só desenha o visível

**`FlatList`** é o componente de lista do React Native. Ela renderiza só os itens que cabem na tela e reaproveita os cartões conforme você rola. Com 10 ou 10.000 tarefas, o app continua leve.

:::center
![Animação: a lista de 1.000 tarefas rola atrás da tela; só os itens dentro dela são desenhados, e os de fora ficam como contornos vazios](images/e28-flatlist-visiveis.svg)
:::

Pense na janela de um trem: a paisagem é enorme, mas você só vê o trecho que passa pela janela.

Três props fazem tudo:

- `data`: o array de itens, como `tarefas`
- `renderItem`: função que recebe `{ item }` e devolve o componente de um item
- `keyExtractor`: função que devolve uma string única por item, como `String(item.id)`

---

## :icon[file-code] FlatList: exemplo completo

`FlatList` vem de `react-native`, como `View` e `Text`.

```jsx
<FlatList
  data={tarefas}
  keyExtractor={(item) => String(item.id)}
  renderItem={({ item }) => (
    <CartaoTarefa
      titulo={item.titulo}
      prioridade={item.prioridade}
      concluida={item.concluida}
    />
  )}
/>
```

- `renderItem` recebe um objeto `{ item, index }`; as chaves em `({ item })` pegam só o item
- `keyExtractor` precisa devolver string: por isso o `String(item.id)`
- Nada de `.map()`: a `FlatList` percorre o array por você

---

## :icon[layers] ScrollView ou FlatList?

| | `ScrollView` | `FlatList` |
|---|---|---|
| Renderiza | tudo de uma vez | só o que está na tela |
| Conteúdo | filhos escritos no JSX | `data` + `renderItem` |
| Bom para | poucos itens fixos: formulário, tela de perfil | muitos itens de dados: tarefas, mensagens, produtos |
| Com 1.000 itens | trava e consome memória | continua leve |

Regra prática: se os itens vêm de um array, use `FlatList`.

---

## Pense

:::question
Um app de mensagens precisa mostrar 10.000 mensagens de uma conversa. `ScrollView` ou `FlatList`? Por quê?

E a tela de configurações, com 8 opções fixas escritas no JSX?
:::

---

## :icon[rows-3] Lista vazia, cabeçalho e separador

A `FlatList` tem props para o que fica em volta dos itens:

```jsx
<FlatList
  data={tarefas}
  keyExtractor={(item) => String(item.id)}
  renderItem={({ item }) => <CartaoTarefa titulo={item.titulo} />}
  ListEmptyComponent={<Text style={estilos.vazio}>Nenhuma tarefa</Text>}
  ListHeaderComponent={<Text style={estilos.titulo}>Minhas tarefas</Text>}
  ItemSeparatorComponent={() => <View style={estilos.separador} />}
/>
```

- `ListEmptyComponent`: aparece quando `data` está vazio
- `ListHeaderComponent` e `ListFooterComponent`: rolam junto com a lista
- `ItemSeparatorComponent`: um componente entre cada par de itens

:::warning
Não coloque `FlatList` dentro de `ScrollView`: as duas rolagens brigam e a lista perde a eficiência. Use o cabeçalho e o rodapé da própria lista.
:::

---

## :icon[check] Concluir ao tocar: map e onAlternar

No `App`, o `map` do E09 cria um array novo e inverte `concluida` só na tarefa tocada:

```jsx
function alternarConcluida(id) {
  setTarefas(
    tarefas.map((t) => (t.id === id ? { ...t, concluida: !t.concluida } : t))
  );
}
```

No `renderItem`, passe a função para o cartão; no `CartaoTarefa`, ligue-a ao `onPress`:

```jsx
<CartaoTarefa titulo={item.titulo} concluida={item.concluida}
  onAlternar={() => alternarConcluida(item.id)} />

// dentro de CartaoTarefa
<Pressable onPress={onAlternar} style={[estilos.cartao, concluida && estilos.concluida]}>
```

---

## :icon[trash-2] Remover com confirmação: Alert

Remover não tem volta. **`Alert.alert`** abre a caixa nativa de confirmação: título, mensagem e uma lista de botões.

```jsx
import { Alert } from 'react-native';

function confirmarRemocao(id) {
  Alert.alert('Remover?', 'Esta ação não pode ser desfeita', [
    { text: 'Cancelar' },
    { text: 'Remover', onPress: () => removerTarefa(id) },
  ]);
}

function removerTarefa(id) {
  setTarefas(tarefas.filter((t) => t.id !== id));
}
```

Cada botão é um objeto `{ text, onPress }`. "Cancelar" não tem `onPress`: só fecha. Passe `confirmarRemocao` ao cartão como `onRemover` e chame no `onLongPress` ou em um `Pressable` "Remover".

---

## :icon[triangle-alert] Erros comuns

:::warning
- Escrever `e.target.value` no `onChangeText`: não existe `e.target`; o parâmetro já é o texto
- Esquecer o `keyExtractor` ou usar o índice, `(item, i) => String(i)`: ao remover um item, os cartões trocam de lugar
- Mutar o array com `tarefas.push(nova)`: a tela não atualiza; crie um array novo com `[...tarefas, nova]`
- `Alert.alert('Remover?')` sem botões: aparece um "OK" que só fecha e nada é removido
- Passar `onPress={alternarConcluida(item.id)}` sem arrow function: chama na hora, não no toque
:::

---

## Resumo

:::summary
- `useState` é o mesmo do web; mudam os eventos: `onPress` e `onChangeText`
- `TextInput` controlado usa `value` + `onChangeText`, que entrega o texto direto
- `FlatList` renderiza só o visível com `data`, `renderItem` e `keyExtractor`
- `ScrollView` serve para poucos itens fixos; dados em array pedem `FlatList`
- `Alert.alert` confirma ações destrutivas com título, mensagem e botões
:::

---

## :icon[arrow-right] Próximos passos

Com estado e lista, o app ganhou vida. Também ganhou os primeiros bugs: um texto solto fora de `<Text>`, um `onClick` que ninguém chama, uma lista que não atualiza.

Na aula 55, você aprende a ler o que o Expo diz quando algo quebra:

- :icon[smartphone] o menu do desenvolvedor no celular
- :icon[terminal] `console.log` no terminal do Expo
- :icon[bug] a tela vermelha, o aviso amarelo e um método de 4 passos para achar o erro
- :icon[pause] os breakpoints do E03, agora pausando o app
