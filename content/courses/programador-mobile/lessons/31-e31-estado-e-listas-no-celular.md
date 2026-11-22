---
title: Estado e listas no celular
summary: "O Gota ganha memória: os copos no estado, o total na barra, a FlatList, o remover e a entrega do Projeto 5."
module: react-native
duration_minutes: 90
objectives:
  - Guardar os copos do dia num estado e pôr cada copo novo numa lista nova, sem push
  - Somar o total com reduce e mostrá-lo no cartão da meta
  - Mostrar uma lista com FlatList, keyExtractor e o aviso de lista vazia
  - Remover um item com filter e entregar o Projeto 5
---

# Estado e listas no celular

Programador Mobile · Encontro E31 · Aula 31 de 45

---

## O que você vai aprender

:::goal
- Guardar os copos do dia num **estado**, com o `useState`
- Pôr cada copo novo no topo de uma lista nova, sem rasurar a antiga
- Somar o total com o `reduce` e encher a barra da meta
- Mostrar os copos numa `FlatList`, com o crachá de cada um e o aviso de lista vazia
- Remover um copo com o `filter` e entregar o Projeto 5
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **registro** | a ficha de um copo: o crachá (`id`), os ml e a hora |
| **`Date.now()`** | um número que muda a cada milésimo de segundo; serve de crachá |
| **`FlatList`** | a lista do React Native: uma esteira, que só desenha o que cabe na tela |
| **`renderItem`** | a função que desenha cada item da lista (*render item*: desenhe o item) |
| **`keyExtractor`** | a função que dá o crachá de cada item (*key extractor*: o que tira a chave) |
| **`ListEmptyComponent`** | a peça que aparece no lugar da lista quando ela está vazia |

---

## Os copos ainda não contam

No fim do E30, tocar em +300 só escreve `Copo de 300 ml` no terminal. O app não lembra de nenhum copo.

| Hoje, no começo | No fim do encontro |
|---|---|
| o toque só escreve no terminal | cada toque vira um registro, com a hora |
| "Meta do dia" e "2000 ml", fixos | o cartão com o total e a barra |
| nenhuma lista | "Registros de hoje", o mais novo em cima |
| nenhum jeito de desfazer | Remover tira só aquele copo |
| o README do kit | o README com prints, e o projeto entregue |

:::question
Você tomou três copos. Onde o app guarda isso para mostrar o total?
:::

---

## Estado no celular

Saiu um ponto no jogo de vôlei. O que muda no placar, e quem fica sabendo?

---

## :icon[refresh-cw] useState: o mesmo placar, no celular

Um **estado** é um valor que o componente guarda e que, quando muda, faz a tela ser **desenhada de novo**. É o placar do jogo, do E26: mudou o número, o telão mostra o novo. O **`useState`** do celular é o mesmo do Projeto 4 e vem do pacote `react`, não de `react-native`:

```jsx
import { useState } from 'react';

const [registros, setRegistros] = useState([]);
```

| Parte | O que ela diz |
|---|---|
| `useState([])` | "crie um placar que começa com uma lista vazia" |
| `registros` | a lista de agora, a que a tela mostra |
| `setRegistros` | a função que troca a lista e pede o desenho novo |

Ele fica no começo do componente. Os colchetes dão nome aos dois itens que ele devolve, pela posição (E26).

---

## :icon[refresh-cw] Estado na prática

**Caso 1: contar toques.** O contador do E26, com as peças do celular: `Pressable` no lugar do `button`, `onPress` no lugar do `onClick`.

```jsx
const [toques, setToques] = useState(0);

<Pressable onPress={() => setToques(toques + 1)}>
  <Text>Toques: {toques}</Text>
</Pressable>
```

Na tela, "Toques: 0"; cada toque soma 1.

**Caso 2: a lista diz quantos.** Com `registros` vazio, `<Text>Copos hoje: {registros.length}</Text>` mostra "Copos hoje: 0". As chaves põem o JavaScript dentro da tela (E24).

**Caso 3: recarregar zera.** A tecla `r`, no terminal do `npx expo start`, recarrega o app: o `useState` começa do zero, e volta "Toques: 0". O estado mora na memória do app; guardar no aparelho é assunto do E43.

---

## :icon[notebook-pen] Exercícios: Estado no celular

:::example Exercícios
1. Complete: `import { useState } from '___';`
2. O que aparece ao abrir?
   ```jsx
   const [pedidos, setPedidos] = useState(['Pastel', 'Suco']);
   <Text>Pedidos: {pedidos.length}</Text>
   ```
3. A catraca do ônibus conta assim. Ao abrir, a pessoa toca 4 vezes, e depois você aperta `r` no terminal. O que a tela mostra antes e depois do `r`?
   ```jsx
   const [passageiros, setPassageiros] = useState(0);
   <Pressable onPress={() => setPassageiros(passageiros + 1)}>
     <Text>Passageiros: {passageiros}</Text>
   </Pressable>
   ```
4. Escreva o estado `senha`, que começa em 1, e o `onPress` que chama a próxima senha.
:::

:::tip Respostas
1. `react`; o `react-native` traz as peças da tela
2. "Pedidos: 2", o tamanho da lista
3. Antes, "Passageiros: 4"; depois do `r`, "Passageiros: 0": o estado mora na memória do app
4. `const [senha, setSenha] = useState(1);` e `onPress={() => setSenha(senha + 1)}`
:::

---

## Uma lista nova

Para pôr um convidado no topo da lista da festa, você rasura ou passa a limpo?

---

## :icon[copy] Cada copo, um registro numa lista nova

Cada toque num copo cria um **registro**: uma ficha (E13) com três campos.

| Campo | Exemplo | De onde vem |
|---|---|---|
| `id` | `1793725500000` | **`Date.now()`**: os milésimos de segundo desde 1º de janeiro de 1970. Muda a cada milésimo e serve de crachá |
| `ml` | `300` | o botão tocado |
| `hora` | `'14:05'` | **`horaAgora()`**, do kit: a hora de agora, em texto |

Para guardar, o `App` entrega ao `setRegistros` uma **lista nova**, com o registro na frente:

```jsx
setRegistros([novo, ...registros]);
```

É o **spread** do E15: os três pontos copiam os registros de antes para a lista nova. Você tira uma cópia e mexe na cópia, sem rasurar o original.

---

## :icon[copy] Lista nova na prática

**Caso 1: o novo na frente.** No Node, com dois registros curtos:

```javascript
const registros = [{ id: 1, ml: 300 }, { id: 2, ml: 200 }];
const novo = { id: 3, ml: 500 };

console.log([novo, ...registros]);
// [ { id: 3, ml: 500 }, { id: 1, ml: 300 }, { id: 2, ml: 200 } ]
console.log(registros);
// [ { id: 1, ml: 300 }, { id: 2, ml: 200 } ]
```

A lista de antes não mudou. Com `[...registros, novo]`, o novo iria para o fim.

**Caso 2: o `push` não avisa ninguém.** `registros.push(novo)` muda a lista velha por dentro, no mesmo endereço (E15). O React compara, acha a mesma lista e não desenha de novo: o toque não muda nada, e nenhum erro aparece.

**Caso 3: a ficha no terminal.** Um `console.log(novo)` dentro do `adicionarCopo`, por um instante, mostra no terminal os campos em ordem alfabética:

```plaintext
 LOG  {"hora": "14:05", "id": 1793725500000, "ml": 300}
```

---

## :icon[notebook-pen] Exercícios: Uma lista nova

:::example Exercícios
1. O que o Node mostra?
   ```javascript
   const fila = ['Ana', 'Bia'];
   const nova = ['Caio', ...fila];
   console.log(nova);
   console.log(fila);
   ```
2. Com a mesma `fila`, que lista sai de `[...fila, 'Davi']`?
3. O que o Node mostra? A lista de antes ficou igual?
   ```javascript
   const carrinho = ['arroz'];
   const outro = carrinho;
   outro.push('feijão');
   console.log(carrinho);
   ```
4. No app do mercado, qual linha faz a tela mudar: `itens.push(novo)` ou `setItens([novo, ...itens])`?
:::

:::tip Respostas
1. `[ 'Caio', 'Ana', 'Bia' ]` e `[ 'Ana', 'Bia' ]`: o spread copia, sem rasurar
2. `[ 'Ana', 'Bia', 'Davi' ]`: o novo vai para o fim
3. `[ 'arroz', 'feijão' ]`: não; os dois nomes levam à mesma casa, e o `push` mexeu nela
4. `setItens([novo, ...itens])`: o `push` rasura a lista velha, e o React não desenha de novo
:::

---

## :icon[milestone] Projeto 5 · Passo 1: o estado no App

No `App.js`, no lugar do comentário "Etapa 3 (E31): o import...", os dois `import` novos:

```jsx
import { useState } from 'react';
import { horaAgora } from './src/hora';
```

No começo do `App`, no lugar do comentário "Etapa 3 (E31): o estado...":

```jsx
export default function App() {
  const [registros, setRegistros] = useState([]);

  function adicionarCopo(ml) {
    const novo = { id: Date.now(), ml: ml, hora: horaAgora() };
    setRegistros([novo, ...registros]);
  }
```

- `ml: ml`: o campo `ml` da ficha recebe o parâmetro `ml`, os ml do copo tocado
- A função mora dentro do `App`: por isso enxerga `registros` e `setRegistros`

Na `View` da meta do dia, embaixo do "2000 ml", uma linha provisória para ver o estado: `<Text>Copos hoje: {registros.length}</Text>`.

**Pronto quando:** embaixo de "2000 ml" aparece "Copos hoje: 0", e os copos ainda escrevem no terminal.

---

## :icon[milestone] Projeto 5 · Passo 1: o copo avisa o App

O registro nasce no `App`, mas o toque acontece no `BotaoCopo`. É o botão do elevador do E26: o pai guarda, o filho avisa. O `App` entrega a função numa prop, e o botão chama no toque. Em `src/components/BotaoCopo.js`, só o componente muda; os estilos continuam:

```jsx
export default function BotaoCopo({ ml, aoAdicionar }) {
  return (
    <Pressable style={estilos.botao} onPress={() => aoAdicionar(ml)}>
      <Text style={estilos.texto}>+{ml} ml</Text>
    </Pressable>
  );
}
```

No `App`, os três copos ganham a prop. A função vai sem parênteses: quem chama é o botão.

```jsx
      <Linha>
        <BotaoCopo ml={200} aoAdicionar={adicionarCopo} />
        <BotaoCopo ml={300} aoAdicionar={adicionarCopo} />
        <BotaoCopo ml={500} aoAdicionar={adicionarCopo} />
      </Linha>
```

A seta `() => aoAdicionar(ml)` espera o toque e entrega os ml daquele botão.

**Pronto quando:** cada toque soma 1 em "Copos hoje"; o terminal não mostra mais `Copo de ... ml`.

---

## O total do dia

Três copos: 500, 300 e 200 ml. Como você chega ao total de cabeça?

---

## :icon[calculator] reduce: a calculadora soma os ml

O **`reduce`** da aula 3 junta a lista inteira num valor só. É a calculadora que vai acumulando: o visor começa no 0, e cada registro soma os seus ml ao que já estava lá.

```jsx
const total = registros.reduce((soma, registro) => soma + registro.ml, 0);
```

| Parte | O que quer dizer |
|---|---|
| `0`, no fim | o visor no começo, antes do primeiro copo |
| `soma` | o que está no visor agora |
| `registro` | o copo da vez |
| `soma + registro.ml` | a conta de cada volta; o resultado vira a nova `soma` |

O `total` não é estado: como a lista `visiveis` do E26, ele sai dos `registros` a cada desenho, e o `reduce` refaz a conta.

---

## :icon[calculator] O total, volta por volta

Três registros, o mais novo em cima:

| Volta | `soma` antes | `registro.ml` | A conta | `soma` depois |
|---|---|---|---|---|
| 1 | 0 | 500 | `0 + 500` | 500 |
| 2 | 500 | 300 | `500 + 300` | 800 |
| 3 | 800 | 200 | `800 + 200` | 1000 |

- Acabaram os copos: o `reduce` entrega 1000, e o `total` vale 1000
- **Lista vazia:** nenhuma volta, e o `reduce` entrega o próprio 0. Ao abrir o app, o total é 0
- **Sem o `0` no fim**, a lista vazia derruba o app: a tela de erro, Render Error, diz `Reduce of empty array with no initial value`

---

## :icon[notebook-pen] Exercícios: O total do dia

:::example Exercícios
1. O que o Node mostra? Diga a `soma` depois de cada volta.
   ```javascript
   const compras = [12, 5, 8];
   console.log(compras.reduce((soma, preco) => soma + preco, 0));
   ```
2. E `[].reduce((soma, preco) => soma + preco, 0)`? E sem o `0`?
3. Escreva o `reduce` que soma os minutos de `treinos`:
   ```javascript
   const treinos = [{ minutos: 30 }, { minutos: 45 }];
   ```
4. O que o Node mostra, e por quê?
   ```javascript
   const ml = ['300', '200'];
   console.log(ml.reduce((soma, copo) => soma + copo, 0));
   ```
:::

:::tip Respostas
1. `25`; a `soma` vai de 0 para 12, 17 e 25
2. `0`, sem nenhuma volta; sem o `0`, `TypeError: Reduce of empty array with no initial value`
3. `treinos.reduce((soma, treino) => soma + treino.minutos, 0)`, que dá `75`
4. `0300200`: os ml são textos, e o `+` junta em vez de somar
:::

---

## :icon[milestone] Projeto 5 · Passo 2: o total na barra

O `ProgressoMeta` do kit é o cartão da meta. O comentário no topo de `src/components/ProgressoMeta.js` diz as props: `total` e `meta`, números em ml. No topo do `App.js`, junto das peças do kit:

```jsx
import ProgressoMeta from './src/components/ProgressoMeta';
```

Depois da função `adicionarCopo`, antes do `return`:

```jsx
  const total = registros.reduce((soma, registro) => soma + registro.ml, 0);
```

Na tela, a `View` da meta do dia sai inteira, com a linha provisória. No lugar dela:

```jsx
      <ProgressoMeta total={total} meta={2000} />
```

**Pronto quando:** ao abrir, "0 ml", "de 2000 ml", a barra vazia e "Faltam 2000 ml"; +300 e +500 dão "800 ml", "40% da meta" e "Faltam 1200 ml". Recarregue com `r` e toque cinco vezes em +500: "2500 ml", "125% da meta", a barra cheia e "Meta batida!".

---

## FlatList

Na esteira de bagagens do aeroporto, você vê todas as malas do voo de uma vez?

---

## :icon[list] FlatList: a esteira

A **`FlatList`** é a lista do React Native. Ela funciona como uma esteira: só desenha o que cabe na tela. Conforme você rola, os itens que saem dão lugar aos que entram. Num app de tarefas com 1.000 itens, só os que estão na tela são desenhados, e o app continua leve.

:::center
![Animação: a lista tarefas tem 1.000 itens e rola atrás da tela; só os itens dentro da tela são desenhados, e os de fora aparecem só como contornos tracejados](images/e28-flatlist-visiveis.svg)
:::

Ela vem de `react-native`, como a `View`, e três props fazem a lista:

- **`data`**: a lista de itens, como `registros`
- **`renderItem`**: a função que desenha cada item
- **`keyExtractor`**: a função que dá o crachá de cada item

---

## :icon[list] renderItem: a peça de cada item

Na `FlatList`, nada de `map`: ela percorre a `data` sozinha. Para cada item, chama o **`renderItem`** e entrega uma ficha com o `item`, a posição dele (`index`) e um terceiro campo que o Gota não usa. As chaves em `({ item })` pegam só o campo `item`: é a desestruturação do E13, a mesma das props no E25.

```jsx
<FlatList
  data={['Arroz', 'Feijão', 'Café']}
  keyExtractor={(item) => item}
  renderItem={({ item }) => <Text>{item}</Text>}
/>
```

| Volta | `item` | A peça desenhada |
|---|---|---|
| 1 | `'Arroz'` | `<Text>Arroz</Text>` |
| 2 | `'Feijão'` | `<Text>Feijão</Text>` |
| 3 | `'Café'` | `<Text>Café</Text>` |

Na tela: Arroz, Feijão e Café, um embaixo do outro.

---

## :icon[id-card] keyExtractor: o crachá do item

No E25, cada cartão do `map` ganhou um **crachá** na prop `key`, para o React saber quem é quem quando a lista muda. Na `FlatList`, o crachá sai de uma função, o **`keyExtractor`**: ela recebe o item e devolve o crachá dele, **como texto**.

```jsx
keyExtractor={(item) => String(item.id)}
```

- O `id` do registro é um número. O **`String()`** transforma em texto: é o par do `Number()` do E09, que faz o caminho contrário
- Numa lista de textos que não se repetem, como `['Arroz', 'Feijão', 'Café']`, o próprio item serve de crachá: `(item) => item`
- O `id` serve porque o `Date.now()` muda a cada milésimo. Com crachá repetido, o terminal avisa `Encountered two children with the same key`

```bash
> String(1793725500000)
'1793725500000'
> Number('300')
300
```

---

## :icon[notebook-pen] Exercícios: FlatList

:::example Exercícios
1. Complete a prop que recebe a lista: `<FlatList ___={onibus} ... />`
2. O que aparece na tela?
   ```jsx
   <FlatList
     data={['501', '230', '115']}
     keyExtractor={(item) => item}
     renderItem={({ item }) => <Text>Linha {item}</Text>}
   />
   ```
3. O que o Node mostra? `console.log(String(10) + 1);`
4. Com `data={[{ id: 1, nome: 'Pão' }]}`, a linha saiu em branco. Ache o engano: `renderItem={(item) => <Text>{item.nome}</Text>}`
5. Escreva o `keyExtractor` de produtos como `{ codigo: 15, nome: 'Arroz' }`.
:::

:::tip Respostas
1. `data`
2. "Linha 501", "Linha 230" e "Linha 115", um embaixo do outro
3. `101`: o `String` fez do 10 um texto, e o `+` juntou
4. Faltaram as chaves, `({ item })`: sem elas, `item` é a ficha inteira, e `item.nome` dá `undefined`
5. `keyExtractor={(item) => String(item.codigo)}`
:::

---

## :icon[milestone] Projeto 5 · Passo 3: a lista

No topo do `App.js`, a `FlatList` entra no `import` de `react-native`, e o `ItemRegistro` do kit, junto das outras peças:

```jsx
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import ItemRegistro from './src/components/ItemRegistro';
```

Embaixo da `Linha`, no lugar do comentário "Etapa 3 (E31): o título... e a lista":

```jsx
      <Text style={estilos.secao}>Registros de hoje</Text>
      <FlatList
        data={registros}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ItemRegistro ml={item.ml} hora={item.hora} />
        )}
      />
```

No `StyleSheet.create`, depois da `saudacao`, o estilo novo:

```jsx
  secao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: cores.texto,
  },
```

A `FlatList` fica direto dentro da `Tela`, como a última peça: assim ela ocupa o espaço que sobra e rola.

**Pronto quando:** cada toque põe um cartão no topo da lista, com "300 ml", "às 14:05" e o botão Remover, que ainda não faz nada; com muitos copos, a lista rola e o resto da tela fica parado.

---

## Lista vazia

No app de compras, o que aparece quando o seu carrinho está vazio?

---

## :icon[circle-minus] ListEmptyComponent: o aviso da lista vazia

Sem nenhum item, a `FlatList` não desenha nada, e embaixo do título fica um vazio. A prop **`ListEmptyComponent`** (o componente da lista vazia) recebe a peça que aparece no lugar dos itens, só enquanto a `data` está vazia:

```jsx
<FlatList
  data={[]}
  renderItem={({ item }) => <Text>{item}</Text>}
  ListEmptyComponent={<Text>Seu carrinho está vazio</Text>}
/>
```

- O valor da prop é uma **peça pronta**, em JSX, entre chaves. No E26, o JSX coube numa variável, o `let conteudo`: ele é um valor, como um número ou um texto, e por isso cabe numa prop
- Chegou o primeiro item, o aviso some; a lista esvaziou de novo, ele volta
- No Gota, a peça é a `ListaVazia` do kit, com a prop `texto`

---

## :icon[notebook-pen] Exercícios: Lista vazia

:::example Exercícios
1. O que aparece? E se a `data` fosse `['Oi, tudo bem?']`?
   ```jsx
   <FlatList
     data={[]}
     keyExtractor={(item) => item}
     renderItem={({ item }) => <Text>{item}</Text>}
     ListEmptyComponent={<Text>Nenhuma mensagem</Text>}
   />
   ```
2. A pessoa apaga a última tarefa da lista. O aviso de lista vazia volta?
3. Escreva a prop que mostra "Nada para hoje" na agenda vazia.
4. O terminal avisa `Text strings must be rendered within a <Text> component.` Ache o engano: `ListEmptyComponent={<View>Carrinho vazio</View>}`
:::

:::tip Respostas
1. "Nenhuma mensagem"; com um item, só "Oi, tudo bem?", e o aviso some
2. Sim: com a `data` vazia de novo, ele aparece
3. `ListEmptyComponent={<Text>Nada para hoje</Text>}`
4. O texto ficou solto na `View`: `<View><Text>Carrinho vazio</Text></View>`
:::

---

## :icon[milestone] Projeto 5 · Passo 4: a lista vazia

No topo do `App.js`, junto das peças do kit:

```jsx
import ListaVazia from './src/components/ListaVazia';
```

Na `FlatList`, depois do `renderItem`, mais uma prop:

```jsx
        ListEmptyComponent={<ListaVazia texto="Nenhum copo registrado hoje" />}
```

O comentário no topo de `src/components/ListaVazia.js` diz a prop: `texto`, a frase que aparece embaixo da gota.

**Pronto quando:** ao abrir, embaixo de "Registros de hoje", aparecem a gota clarinha e "Nenhum copo registrado hoje"; no primeiro copo, a mensagem some e entra o cartão. Recarregue com `r`: a lista vazia volta.

---

## Remover

Você registrou um copo a mais. Como tirar só ele, sem mexer nos outros?

---

## :icon[funnel] filter: todos menos um

Para tirar um item sem rasurar a lista, use a peneira do **`filter`** (aula 3) com um teste que deixa passar todos, menos ele. O sinal **`!==`** pergunta "é diferente?": é o contrário do `===`.

```javascript
const nomes = ['Ana', 'Bia', 'Caio'];
const semBia = nomes.filter((nome) => nome !== 'Bia');

console.log(semBia);   // [ 'Ana', 'Caio' ]
console.log(nomes);    // [ 'Ana', 'Bia', 'Caio' ]
```

| `nome` | `nome !== 'Bia'` | Fica? |
|---|---|---|
| `'Ana'` | `true` | sim |
| `'Bia'` | `false` | sai |
| `'Caio'` | `true` | sim |

O `filter` entrega uma lista nova, e a `nomes` continua com os três. No app, é a lista nova que vai para o `set` do estado.

---

## :icon[trash-2] Remover na prática

**Caso 1: tirar pelo crachá.** No E15, o `removerContato` da agenda fez isto: o teste pergunta a cada ficha "o seu `id` é diferente do que vai sair?".

```javascript
const contatos = [
  { id: 1, nome: 'Ana' },
  { id: 2, nome: 'Bia' },
  { id: 3, nome: 'Caio' },
];
console.log(contatos.filter((contato) => contato.id !== 2));
// [ { id: 1, nome: 'Ana' }, { id: 3, nome: 'Caio' } ]
```

Pelo `id`, sai só a Bia, mesmo que houvesse duas pessoas com o mesmo nome.

**Caso 2: a seta leva o `id` junto.** No E26, cada cartão recebeu `aoFavoritar={() => alternarFavorita(receita.id)}`. A seta guarda o pedido com o `id` daquele cartão, e ele só roda no clique. Sem a seta, a função rodaria ao desenhar a tela.

---

## :icon[notebook-pen] Exercícios: Remover

:::example Exercícios
1. O que o Node mostra?
   ```javascript
   const pedidos = ['suco', 'pastel', 'café'];
   console.log(pedidos.filter((pedido) => pedido !== 'pastel'));
   console.log(pedidos);
   ```
2. E se o teste fosse `pedido === 'pastel'`?
3. Escreva o `filter` que tira a linha `'230'` de `const linhas = ['501', '230', '115'];`
4. A pessoa queria tirar um pão só. O que o Node mostra?
   ```javascript
   const compras = ['pão', 'leite', 'pão'];
   console.log(compras.filter((item) => item !== 'pão'));
   ```
:::

:::tip Respostas
1. `[ 'suco', 'café' ]` e `[ 'suco', 'pastel', 'café' ]`: o `filter` entrega uma lista nova
2. `[ 'pastel' ]`: a peneira deixa passar só o pastel
3. `linhas.filter((linha) => linha !== '230')`, que dá `[ '501', '115' ]`
4. `[ 'leite' ]`: saem os dois pães. Com um `id` em cada item, sairia só aquele
:::

---

## :icon[milestone] Projeto 5 · Sua vez 1: remover um copo

Agora, sozinho. Os botões Remover ainda não fazem nada. Faça o toque em Remover tirar só aquele registro:

1. uma função `removerRegistro(id)` no `App`, que entrega ao `setRegistros` uma lista nova, sem o registro desse `id`
2. no `renderItem`, a prop `aoRemover` do `ItemRegistro`, que chama `removerRegistro` com o `id` do item

:::tip Dicas
- Tirar um item sem rasurar o original é o `filter`, a peneira que deixa passar todos menos um
- A prop `aoRemover` recebe uma função, `aoRemover={() => ...}`, como o `aoFavoritar` do Projeto 4
- O comentário no topo de `src/components/ItemRegistro.js` mostra a prop
:::

**Pronto quando:** Remover tira só aquele copo, e o total cai na hora; removendo todos, a lista vazia volta.

---

## :icon[milestone] Projeto 5 · Sua vez 2: README e entrega

O `README.md` do kit tem três trechos "Etapa 3 (E31)". Troque cada um pelo seu:

1. o que o app mostra e o que a pessoa faz nele
2. dois prints do celular (lista vazia e três copos) em `docs/vazio.png` e `docs/com-registros.png`, com as duas linhas do trecho
3. o seu nome e o link do GitHub

:::tip Dicas
- Print: no Android, ligar e baixar o volume; no iPhone, botão lateral e aumentar o volume
- Do celular ao computador: e-mail, WhatsApp Web ou Google Drive
- <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>V</kbd> mostra o README como no GitHub
:::

**Pronto quando:** a pré-visualização mostra o texto, os dois prints e o nome. A parte "O kit" pode ficar.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `aoAdicionar is not a function` | um copo sem a prop | `aoAdicionar={adicionarCopo}` |
| `Cannot update a component (App) while rendering a different component (BotaoCopo)` | `onPress={aoAdicionar(ml)}` roda ao desenhar | `onPress={() => aoAdicionar(ml)}` |
| `Reduce of empty array with no initial value` | faltou o `0` | `soma + registro.ml, 0)` |
| `Encountered two children with the same key` | crachá repetido | `id: Date.now()` |
| `Property 'FlatList' doesn't exist` | faltou no `import` | `FlatList` entre as chaves |
| nenhuma; o total sai "0300200 ml" | `ml="300"`: texto, não número | `ml={300}` |

Aparecem na tela de erro e no terminal.

---

## :icon[milestone] Projeto 5 · Etapa 3 pronta

É a última etapa. Antes de entregar, confira no celular:

- :icon[check] ao abrir, "0 ml" e a lista vazia com a gota clarinha
- :icon[plus] cada copo entra no topo, com a hora; 2500 ml enchem a barra: "Meta batida!"
- :icon[trash-2] Remover tira só aquele copo; sem copos, a lista vazia volta
- :icon[file-text] o README com os prints; o terminal sem `ERROR` nem `WARN`

Num segundo terminal do VS Code (o primeiro está com o `npx expo start`):

```bash
git add .
git commit -m "Projeto 5: etapa 3, registros, lista e entrega"
git push
```

No GitHub, confira os prints. Na página do Projeto 5, na plataforma, cole o link do repositório (o `exp://` do terminal não serve). **Prazo: início do E33.** Faltou o README? Termine em casa, com outro commit e `git push`.

---

## Resumo

:::summary
- O `useState` do celular é o mesmo do E26: o `setRegistros` troca a lista, e a tela é desenhada de novo
- Cada toque cria `{ id: Date.now(), ml: ml, hora: horaAgora() }` e entrega uma lista nova, `[novo, ...registros]`, sem `push`
- O total sai de um `reduce` com valor inicial 0, refeito a cada desenho
- A `FlatList` é a esteira: `data`, `renderItem={({ item }) => ...}` e o crachá em texto, `String(item.id)`, no `keyExtractor`
- `ListEmptyComponent` recebe uma peça em JSX, que aparece só com a lista vazia
- Remover é o `filter` com `!==`: todos menos um, numa lista nova
- A tecla `r` recarrega o app e zera o dia: o estado mora na memória
:::

---

## :icon[arrow-right] Próximos passos

No E32, a **revisão de React Native** e a **Prova 3**, do E29 ao E31:

- :icon[smartphone] o Expo Go, a `View`, o `Text`, a `Image` e o `Pressable`
- :icon[sliders-horizontal] o `StyleSheet` e as props do `BotaoCopo`
- :icon[refresh-cw] o estado, a `FlatList` e o remover

Traga o Gota funcionando no celular. A entrega do Projeto 5 vai até o início do E33, quando começa o Projeto 6, com o flexbox.
