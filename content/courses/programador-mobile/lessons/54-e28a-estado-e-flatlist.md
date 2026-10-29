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

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **estado** | um dado guardado pelo componente que, quando muda, redesenha a tela |
| **evento** | algo que a pessoa faz na tela: tocar, digitar |
| **campo controlado** | um campo que mostra só o que está guardado no estado |
| **`FlatList`** | a lista do React Native que só desenha o que cabe na tela |
| **chave** | um texto único por item, que a lista usa para não confundir os itens |
| **ação destrutiva** | uma ação que apaga algo e não tem volta, como remover uma tarefa |

---

## Uma tela bonita que não faz nada

Você mostra o `minhas-tarefas-mobile` para um colega. Ele digita "Comprar pão", toca em **Adicionar**... e nada acontece.

A tela que você montou no E27 é uma foto: tarefas fixas no código, campo que não guarda nada, botão sem função.

:::question
No `minhas-tarefas` web, o que fez a lista ganhar vida no E23? A resposta é a mesma no celular.
:::

---

## Estado no celular

Num jogo, o que muda no telão quando sai um gol?

---

## :icon[refresh-cw] O mesmo useState, em outra tela

O **estado** é o placar do jogo (E23): quando o número muda, a tela se redesenha. O `useState` vem do pacote `react`, não do `react-native`, e funciona no celular como funcionou no navegador. Mudam só os componentes e os eventos.

```jsx
const [toques, setToques] = useState(0);
```

- `toques` é o valor atual, o número do placar
- `setToques` é o único jeito de mudar o placar e redesenhar a tela
- `useState(0)` diz o valor do começo: 0

---

## :icon[gamepad-2] Estado na prática

Um contador de toques, inteiro:

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

| Linha | O que ela diz |
|---|---|
| `useState(0)` | "o placar `toques` começa em 0" |
| `setToques(toques + 1)` | "no toque, troque o placar para o valor atual mais 1" |
| `Toques: {toques}` | "mostre o número do placar" |

Na tela: "Toques: 0". Depois de três toques em "Tocar", "Toques: 3". Cada toque atualiza o estado e o React Native redesenha o `Text`.

---

## Eventos

Quando a campainha toca, como você sabe o que fazer?

---

## :icon[mouse-pointer-click] Eventos: web e React Native

Um **evento** é algo que a pessoa faz: tocar, digitar. É a campainha de casa (E23): você combina antes o que fazer quando ela tocar. No celular, as campainhas têm outros nomes:

| Na web (React) | No React Native |
|---|---|
| `onClick` no `<button>` | `onPress` no `Pressable` |
| `onChange={(e) => setTexto(e.target.value)}` | `onChangeText={(texto) => setTexto(texto)}` |
| `<input value={texto} />` | `<TextInput value={texto} />` |
| `onSubmit` no `<form>` | não existe `form`: trate tudo no `onPress` do botão |

A diferença que mais confunde: **`onChangeText` recebe o texto pronto**, como string. Não existe `e.target.value`, porque não existe DOM no celular.

---

## :icon[bell] Eventos na prática

Três campainhas que o app usa hoje, cada uma com um `console.log` para você ver quando ela toca:

```jsx
<Pressable onPress={() => console.log('tocou')}>
  <Text>Adicionar</Text>
</Pressable>

<TextInput onChangeText={(texto) => console.log(texto)} />

<Pressable onLongPress={() => console.log('segurou')}>
  <Text>Comprar pão</Text>
</Pressable>
```

| Você faz | No terminal |
|---|---|
| toca em "Adicionar" | `LOG  tocou` |
| digita "pão" no campo | `LOG  p`, `LOG  pã`, `LOG  pão` |
| segura o dedo em "Comprar pão" | `LOG  segurou` |

O `onLongPress` ("ao segurar") dispara quando o dedo fica parado sobre o componente.

---

## Campo controlado

Um espelho pode mostrar algo que não está na frente dele?

---

## :icon[keyboard] TextInput controlado

Um **campo controlado** mostra o que está no estado e atualiza o estado a cada letra digitada. Ele é um espelho: mostra só o que está guardado no `useState`. O estado manda, o campo obedece.

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

Mesma ideia do web: o formulário guarda o texto e, para avisar o pai, toca a campainha dele, a prop `onAdicionar`.

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

| Linha | O que ela diz |
|---|---|
| `if (texto.trim() === '') return;` | "se o texto, sem os espaços das pontas, está vazio, pare aqui" |
| `onAdicionar(texto.trim())` | "toque a campainha do pai, entregando o texto" |
| `setTexto('')` | "esvazie o estado": o campo limpa sozinho |

Os `import` e o `estilos` ficam de fora do trecho: imports no topo, `estilos` no fim.

Na tela: digite "Comprar pão" e toque em Adicionar. O pai recebe o texto e o campo fica vazio. Com o campo só com espaços, nada acontece.

---

## Array novo

Para mudar um documento importante, você rasura o original ou faz uma cópia?

---

## :icon[plus] Adicionando no App com spread

Para mudar a lista do estado, você não rasura a original: tira uma cópia e mexe na cópia. Monte o objeto da nova tarefa, copie o array atual com `...tarefas` (o spread do E09), acrescente a nova no fim e entregue o **array novo** a `setTarefas`.

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

## :icon[copy] Array novo na prática

O spread copia a lista e põe o item novo onde você quiser. Rode no Node para ver:

```javascript
const tarefas = ['Estudar', 'Revisar'];

console.log([...tarefas, 'Comprar pão']); // [ 'Estudar', 'Revisar', 'Comprar pão' ]
console.log(['Comprar pão', ...tarefas]); // [ 'Comprar pão', 'Estudar', 'Revisar' ]
console.log(tarefas);                     // [ 'Estudar', 'Revisar' ]
```

| Você quer | Escreva |
|---|---|
| o item novo no fim | `[...tarefas, nova]` |
| o item novo no topo | `[nova, ...tarefas]` |

A última linha prova: o original não mudou. No app, o array novo vai para o `setTarefas`, e a tela se redesenha.

---

## FlatList

Numa esteira de aeroporto, você vê todas as malas de uma vez?

---

## :icon[list] FlatList: a lista que só desenha o visível

A **`FlatList`** é o componente de lista do React Native. Ela é uma esteira: só desenha o que cabe na tela. Conforme você rola, ela reaproveita os cartões que saíram para mostrar os que entram. Com 10 ou 10.000 tarefas, o app continua leve.

:::center
![Animação: a lista de 1.000 tarefas rola atrás da tela; só os itens dentro dela são desenhados, e os de fora ficam como contornos vazios](images/e28-flatlist-visiveis.svg)
:::

Três props fazem tudo:

- `data`: o array de itens, como `tarefas`
- `renderItem` ("desenhe o item"): função que recebe `{ item }` e devolve o componente de um item
- `keyExtractor` ("tire a chave"): função que devolve uma string única por item, o crachá dele, como `String(item.id)`

---

## :icon[file-code] FlatList na prática

`FlatList` vem de `react-native`, como `View` e `Text`. Aqui, cada tarefa vira um `CartaoTarefa`:

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
- `keyExtractor` precisa devolver string, um texto: por isso o `String(item.id)`
- Nada de `.map()`: a `FlatList` percorre o array por você

Na tela: um cartão por tarefa. Com 3 tarefas, 3 cartões; com 1.000, só os que cabem na tela, e os outros aparecem ao rolar.

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

:::tip Resposta
- Mensagens: `FlatList`. Na tela cabem umas dez; desenhar as 10.000 de uma vez trava o app
- Configurações: `ScrollView`. São poucos itens fixos, escritos no JSX, e não vêm de um array
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

- `ListEmptyComponent` (lista vazia): aparece quando `data` está vazio
- `ListHeaderComponent` e `ListFooterComponent` (cabeçalho e rodapé): rolam junto com a lista
- `ItemSeparatorComponent` (separador): um componente entre cada par de itens

:::warning
Não coloque `FlatList` dentro de `ScrollView`: as duas rolagens brigam e a lista perde a eficiência. Use o cabeçalho e o rodapé da própria lista.
:::

---

## Concluir ao tocar

Numa linha de produção, quantos itens saem se entram dez?

---

## :icon[check] Concluir ao tocar: map e onAlternar

Para concluir uma tarefa, o `App` cria uma lista nova em que só a tarefa tocada muda. O `map` do E09 é a linha de produção: cada tarefa entra e sai, na mesma quantidade.

```jsx
function alternarConcluida(id) {
  setTarefas(
    tarefas.map((t) => (t.id === id ? { ...t, concluida: !t.concluida } : t))
  );
}
```

Em português, para cada tarefa `t`:

- se o `id` dela é o da tarefa tocada, sai uma cópia com `concluida` trocado; o `!` inverte, `true` vira `false` e `false` vira `true`
- senão, sai a mesma `t`, sem mudança

---

## :icon[mouse-pointer-click] Ligando o toque ao cartão

O `App` tem a função; quem recebe o toque é o cartão. No `renderItem`, passe a função para o cartão; no `CartaoTarefa`, ligue-a ao `onPress`:

```jsx
<CartaoTarefa titulo={item.titulo} concluida={item.concluida}
  onAlternar={() => alternarConcluida(item.id)} />

// dentro de CartaoTarefa
<Pressable onPress={onAlternar} style={[estilos.cartao, concluida && estilos.concluida]}>
```

- `onAlternar={() => alternarConcluida(item.id)}`: uma função guardada, que só roda no toque, com o `id` deste item
- No cartão, `onPress={onAlternar}`: o toque chama a função que veio do pai. É a campainha do pai
- O array de estilos do E27 esmaece o cartão concluído

Na tela: toque em "Estudar React Native" e o cartão fica meio transparente; toque de novo e ele volta ao normal. Os outros cartões não mudam.

---

## Confirmar com Alert

O que o celular pergunta antes de apagar uma foto?

---

## :icon[trash-2] Remover com confirmação: Alert

Remover não tem volta: é uma **ação destrutiva**. Antes dela, o app pergunta, como o celular faz antes de apagar uma foto. **`Alert.alert`** abre essa caixa nativa: título, mensagem e uma lista de botões.

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

- Cada botão é um objeto `{ text, onPress }`. "Cancelar" não tem `onPress`: só fecha
- "Remover" guarda `removerTarefa(id)` numa arrow function: só roda no toque
- `removerTarefa` passa a lista na peneira, o `filter` do E09: fica tudo, menos a tarefa do `id`

---

## :icon[hand] Alert na prática

Passe `confirmarRemocao` ao cartão como `onRemover` e chame de um destes jeitos:

```jsx
// 1. segurar o dedo no cartão pede a remoção
<Pressable onPress={onAlternar} onLongPress={onRemover}>

// 2. um botão "Remover" dentro do cartão
<Pressable onPress={onRemover}><Text>Remover</Text></Pressable>
```

Na tela, nos dois casos: a caixa "Remover?", com "Esta ação não pode ser desfeita" e os botões Cancelar e Remover.

| Você toca | O que acontece |
|---|---|
| Cancelar | a caixa fecha e a tarefa fica |
| Remover | a tarefa sai da lista |

---

## :icon[triangle-alert] Erros comuns

:::warning
- Escrever `e.target.value` no `onChangeText`: não existe `e.target`, e a tela vermelha diz `Cannot read property 'value' of undefined`. O parâmetro já é o texto
- Esquecer o `keyExtractor` ou usar o índice, `(item, i) => String(i)`: ao remover um item, os cartões trocam de lugar
- Mutar o array com `tarefas.push(nova)`: a tela não atualiza; crie um array novo com `[...tarefas, nova]`
- `Alert.alert('Remover?')` sem botões: aparece um "OK" que só fecha e nada é removido
- Passar `onPress={alternarConcluida(item.id)}` sem arrow function: chama na hora, ao desenhar a tela, e não no toque
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
