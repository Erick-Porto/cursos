---
title: Revisão de React Native
summary: Do E29 ao E31 lendo código do Gota, os erros mais comuns, a Prova 3 e a entrega do Projeto 5.
module: react-native
duration_minutes: 90
objectives:
  - Ler um código React Native e dizer o que aparece no celular e no terminal
  - Achar o engano num código com View, Text, estilo, toque, estado ou FlatList
  - Saber como é a Prova 3 e o que ela cobra
  - Conferir o Gota antes de entregar o Projeto 5
---

# Revisão de React Native

Programador Mobile · Encontro E32 · Aula 32 de 45

---

## O que você vai revisar

:::goal
- O app no celular: React Native, Expo, `View`, `Text` e o terminal, do E29
- Estilo, imagem, toque e o `BotaoCopo`, do E30
- Estado, total, `FlatList` e o Remover, do E31
- Como é a Prova 3 e o que conferir antes de entregar o Projeto 5
:::

Hoje não tem palavra nova: o encontro é para ler código. Na última hora, a Prova 3.

---

## :icon[map] O mapa da unidade

Em três encontros, o React do Projeto 4 foi para o celular.

| Encontro | Você aprendeu | O Gota ganhou |
|---|---|---|
| E29 | app nativo, React Native, Expo, Expo Go, `View`, `Text`, o terminal | o kit no celular, a saudação e a meta do dia |
| E30 | `StyleSheet`, as cores do tema, `Image`, `Pressable`, a coluna | a gota no topo e o seu `BotaoCopo`, três copos na `Linha` |
| E31 | `useState`, a lista nova, `reduce`, `FlatList`, a lista vazia, `filter` | os registros, a barra da meta, a lista, o Remover e o README |

A Prova 3 cobre as três linhas, com o código do Gota.

---

## :icon[arrow-left-right] Do Livro de receitas ao Gota

O componente, o JSX, as chaves, as props, o `useState` e a função como prop vieram iguais do Projeto 4. Mudaram as peças e o lugar onde o app roda:

| No Livro de receitas (P4) | No Gota (P5) |
|---|---|
| `<div>`, `<p>` e `<h2>` | `<View>` e `<Text>` |
| `className` e o CSS | `style={estilos.titulo}` e o `StyleSheet.create` |
| `<img src="..." />` | `<Image source={require('...')} />` |
| `<button onClick={...}>` | `<Pressable onPress={...}>` |
| `map` com `key` | `FlatList` com `keyExtractor` |
| `npm run dev` e o Console do navegador | `npx expo start` e o terminal, com `LOG` |

---

## O app no celular

Você escreve React. Quem traduz para a língua do Android e do iPhone?

---

## :icon[layers] O intérprete e a rádio de alcance curto

O **React Native** é o intérprete: você escreve JSX, e ele repete cada peça na língua do sistema. O **Expo** é a caixa de ferramentas que leva o app ao celular.

| Ideia | Como funciona |
|---|---|
| o servidor | `npx expo start`; salvou, o celular muda (Fast Refresh) |
| a rádio de alcance curto | o QR code guarda o endereço; só pega no mesmo Wi-Fi, senão `--tunnel` |
| a conta Expo | a mesma no terminal (`npx expo login`) e no Expo Go |
| as peças | a `View` agrupa; só o `Text` mostra letras |
| o terminal | o `console.log` chega com `LOG`; `r` recarrega; <kbd>Ctrl</kbd> + <kbd>C</kbd> desliga |

---

## :icon[code-xml] Leia o código: a tela e o terminal

:::example O que aparece no celular? E no terminal?
```jsx
export default function App() {
  console.log('Gota aberto');
  return (
    <Tela>
      <View>
        <Text>Gota</Text>
        {/* <Text>Bom dia!</Text> */}
      </View>
      <View>
        <Text>Meta do dia</Text>
        <Text>2000 ml</Text>
      </View>
    </Tela>
  );
}
```
:::

:::tip Resposta
No celular, de cima para baixo: `Gota` e, depois de um espaço, `Meta do dia` e `2000 ml`. O `Bom dia!` está num comentário `{/* */}` e não aparece. O espaço entre as duas `View` vem da `Tela` do kit.

No terminal, ` LOG  Gota aberto`: o app roda no celular, mas o recado do `console.log` vem para o terminal do `npx expo start`. Troque um texto e salve: a linha aparece de novo, porque o `App` desenhou outra vez.
:::

---

## :icon[code-xml] Leia o código: as peças da web

:::example O que está errado? São dois enganos.
Uma colega trouxe do Projeto 4 a meta do dia, dentro da `Tela`:

```jsx
<div>
  <Text>Meta do dia</Text>
</div>
<View>
  2000 ml
</View>
```
:::

:::tip Resposta
1. A `div` é uma tag da web, e o celular não tem HTML. A tela **Render Error** diz ``View config getter callback for component `div` must be a function (received `undefined`). Make sure to start component names with a capital letter.`` O conserto: `<View>`
2. Com a `div` trocada, o app abre, mas o `2000 ml` está solto na `View`. Uma faixa escura embaixo da tela e o terminal avisam `Text strings must be rendered within a <Text> component.` O conserto: `<View><Text>2000 ml</Text></View>`
:::

---

## Componentes e estilo

O que transforma um texto preto num botão azul que responde ao dedo?

---

## :icon[pencil] A ficha de estilo, a campainha e o caderno

No celular não há CSS: o **estilo** é uma ficha do `StyleSheet.create`. O `BotaoCopo` é a sua peça de Lego; `ml={300}` é o pedido.

| Ideia | Como se escreve |
|---|---|
| a ficha de estilo | `style={estilos.titulo}`; camelCase, sem `px`: `fontSize: 32` |
| as tintas com nome | `cores.agua`; o tema é `'./src/tema'` no `App.js` e `'../tema'` em `src/components/` |
| a foto da galeria | `<Image source={require('./assets/gota.png')} />`, com `width` e `height` |
| a campainha | `onPress={() => ...}`: a seta espera o toque |
| a caixa | `backgroundColor`, `borderRadius` e `padding`, o plástico-bolha |
| o caderno | cada peça ganha a linha inteira; a `Linha` põe lado a lado |

---

## :icon[sliders-horizontal] Leia o código: a garrafa

:::example O que aparece no celular?
Os estilos `caixa` e `letra` são os do `BotaoCopo`: fundo azul, cantos redondos, letra branca e em negrito.

```jsx
function Garrafa({ nome, ml }) {
  return (
    <View style={estilos.caixa}>
      <Text style={estilos.letra}>{nome}: {ml + 250} ml</Text>
    </View>
  );
}

// no return do App, dentro da Tela:
<Garrafa nome="Manhã" ml={500} />
<Garrafa nome="Tarde" ml="500" />
```
:::

:::tip Resposta
Duas faixas azuis da largura da tela, uma embaixo da outra: `Manhã: 750 ml` e `Tarde: 500250 ml`.

- Coluna por padrão: cada `View` ganha a linha inteira, como no caderno, mesmo com pouco texto
- `ml={500}`, entre chaves, chega como número, e o `+` soma. `ml="500"`, entre aspas, chega como texto, e o `+` junta: é o mesmo engano do total `0300200 ml`, no E31
:::

---

## :icon[mouse-pointer-click] Leia o código: o botão que não avisa

:::example O que está errado? São três enganos.
O `BotaoCopo.js`, em `src/components/`, com os estilos do E30 no fim do arquivo:

```jsx
import { Pressable, StyleSheet, Text } from 'react-native';
import { cores } from './tema';

export default function BotaoCopo(ml) {
  return (
    <Pressable
      style={estilos.botao}
      onPress={console.log(`Copo de ${ml} ml`)}
    >
      <Text style={estilos.texto}>+{ml} ml</Text>
    </Pressable>
  );
}
```
:::

:::tip Resposta
1. `'./tema'` procura o tema dentro de `src/components/`: `Unable to resolve "./tema" from "src\components\BotaoCopo.js"`. O tema fica uma pasta acima: `'../tema'`
2. Sem as chaves, `ml` recebe a ficha inteira das props: `Objects are not valid as a React child (found: object with keys {ml})`. O conserto: `BotaoCopo({ ml })`
3. Sem a seta, o `console.log` roda ao desenhar: os três `LOG` saem sozinhos, ao salvar, e o toque não faz nada. O conserto: `onPress={() => console.log(...)}`
:::

---

## Estado e listas

Três copos tomados. Onde o app guarda isso, e como a tela fica sabendo?

---

## :icon[refresh-cw] O placar, a esteira e a peneira

O **estado** é o placar do jogo: o `setRegistros` troca a lista, e a tela se redesenha. O pai guarda, o filho avisa: o botão chama `aoAdicionar(ml)`.

| Ideia | Como se escreve |
|---|---|
| o placar | `useState([])`, de `react`; a tecla `r` zera o dia |
| a lista nova | `setRegistros([novo, ...registros])`: o novo em cima, sem `push` |
| a calculadora que acumula | `registros.reduce((soma, registro) => soma + registro.ml, 0)` |
| a esteira e o crachá | `FlatList` com `data`, `renderItem={({ item }) => ...}` e `String(item.id)` |
| o carrinho vazio | `ListEmptyComponent`, só com a `data` vazia |
| a peneira | `registro.id !== id` no `filter`: todos menos um |

---

## :icon[calculator] Leia o código: três toques

:::example O que o cartão da meta e a lista mostram?
Ao abrir, `registros` está vazio. A pessoa toca em **+300**, **+200** e **+500**, nessa ordem.

```jsx
function adicionarCopo(ml) {
  const novo = { id: Date.now(), ml: ml, hora: horaAgora() };
  setRegistros([novo, ...registros]);
}

const total = registros.reduce((soma, registro) => soma + registro.ml, 0);

<ProgressoMeta total={total} meta={2000} />
<FlatList
  data={registros}
  keyExtractor={(item) => String(item.id)}
  renderItem={({ item }) => <ItemRegistro ml={item.ml} hora={item.hora} />}
/>
```
:::

:::tip Resposta
O cartão mostra `1000 ml`, `50% da meta` e `Faltam 1000 ml`. A lista, de cima para baixo: 500 ml, 200 ml e 300 ml.

- Cada toque põe o copo novo na **frente** de uma lista nova: o último toque fica em cima
- Volta por volta, o visor da calculadora vai de 0 a 500, 700 e 1000
- O `total` não é estado: o `reduce` refaz a conta a cada desenho
:::

---

## :icon[trash-2] Leia o código: o Remover

:::example O que está errado? São dois enganos.
```jsx
function removerRegistro(id) {
  setRegistros(registros.filter((registro) => registro.id === id));
}

// na FlatList:
renderItem={({ item }) => (
  <ItemRegistro
    ml={item.ml}
    hora={item.hora}
    aoRemover={removerRegistro(item.id)}
  />
)}
```
:::

:::tip Resposta
Cada engano, sozinho, faz uma coisa:

1. Sem a seta, o `removerRegistro` roda ao desenhar a lista, e não no toque: os copos somem logo depois de aparecer, e o terminal mostra `Cannot update a component (App) while rendering a different component (CellRenderer)`. O conserto: `aoRemover={() => removerRegistro(item.id)}`
2. O `===` deixa passar só o copo tocado: Remover no de 300 apaga os outros e deixa só ele. O teste pergunta "é diferente?": `registro.id !== id`
:::

---

## :icon[siren] Os erros com mensagem

A mensagem é a luz do painel do carro: leia antes de mexer.

| A mensagem tem | O engano | O conserto |
|---|---|---|
| `Text strings must be rendered` | texto solto numa `View` | dentro de um `<Text>` |
| `Property 'StyleSheet' doesn't exist` | o nome faltou no `import` | pôr no `import` |
| `Unable to resolve` | caminho ou maiúscula errados | `'../tema'`, `BotaoCopo` |
| `Cannot update a component (App)` | `onPress={aoAdicionar(ml)}` | `onPress={() => aoAdicionar(ml)}` |
| `Reduce of empty array` | o `reduce` sem o `0` | `soma + registro.ml, 0)` |
| `two children with the same key` | crachá repetido, como `id: 1` | `id: Date.now()` |

---

## :icon[eye-off] Os erros sem mensagem

Estes não acendem nenhuma luz: a pista é a tela. Teste cada botão.

| O engano | O que aparece | O conserto |
|---|---|---|
| `ml="300"`, com aspas | o total `0300200 ml` | `ml={300}` |
| `push` na lista do estado | o toque não muda nada | `setRegistros([novo, ...registros])` |
| `fontsize` minúsculo, ou `'32px'` | o estilo não muda | `fontSize: 32` |
| `renderItem={(item) => ...}` | cartões só com "ml" e "às" | `renderItem={({ item }) => ...}` |
| `===` no `filter` do Remover | sobra só o copo tocado | `!==` |
| `onPress={console.log(...)}` | o `LOG` sai ao salvar; o toque, nada | `onPress={() => console.log(...)}` |

---

## :icon[clipboard-check] Como é a Prova 3

| Item | Como é |
|---|---|
| questões | 20, do E29 ao E31, embaralhadas para cada pessoa |
| tempo | 60 minutos: o cronômetro começa no **Começar** e, no zero, envia sozinho |
| tentativas | uma; ela só conta quando você clica em **Enviar** |
| consulta | nenhuma: só a aba da prova aberta, sem slides, sem VS Code, celular guardado |
| nota mínima | 70 |
| gabarito | não aparece ao enviar: você vê a nota e se foi aprovado |

Os tipos de questão: escolha única, múltipla escolha (marque todas as certas), verdadeiro ou falso e lacuna (a palavra exata, como no código).

---

## :icon[book-open] O que estudar para a prova

Mais da metade das questões traz um código para ler: o que aparece no celular, o que vai para o terminal ou o que está errado.

:::steps
1. Leia o código linha por linha antes de olhar as alternativas
2. Procure primeiro os enganos mais comuns: o texto fora do `Text`, o caminho do `import`, a seta no `onPress`, as aspas no `ml`, o `0` do `reduce`, as chaves do `renderItem` e o `!==`
3. Repare nas palavras que mudam a resposta: **não**, **sempre**, **só**, **primeiro**
4. Na múltipla escolha, julgue cada alternativa sozinha
:::

Para estudar: as aulas do E29 ao E31, os três quizzes e o `App.js` e o `BotaoCopo.js` do seu Gota.

---

## :icon[milestone] Projeto 5 · Antes de entregar

Com o `npx expo start` ligado e o app no celular, faça o caminho da correção:

- :icon[check] ao abrir, a gota, a sua saudação, "0 ml" e a lista vazia
- :icon[plus] +300 e +500: "800 ml", "40% da meta" e o de 500 em cima
- :icon[trophy] `r` no terminal e cinco +500: a barra cheia e "Meta batida!"
- :icon[trash-2] Remover tira só aquele copo, e o total cai; sem copos, a lista vazia volta
- :icon[terminal] o terminal sem `ERROR` nem `WARN`
- :icon[file-text] o README com o seu texto, os dois prints e o seu nome
- :icon[git-commit-horizontal] no GitHub, o commit do kit e os três das etapas, sem `node_modules`

---

## :icon[milestone] Projeto 5 · Explique o seu código

Na correção, o instrutor pode pedir que você explique o `adicionarCopo` ou o `removerRegistro` e que mude uma coisa pequena na hora.

:::example O pedido: "troque o copo de 500 por um de 400"
O que muda no `App.js`? E no `BotaoCopo.js`?

```jsx
<Linha>
  <BotaoCopo ml={200} aoAdicionar={adicionarCopo} />
  <BotaoCopo ml={300} aoAdicionar={adicionarCopo} />
  <BotaoCopo ml={500} aoAdicionar={adicionarCopo} />
</Linha>
```
:::

:::tip Resposta
No `App.js`, só o pedido da terceira peça: `ml={400}`. O `BotaoCopo.js` não muda: ele mostra `+{ml} ml` e chama `aoAdicionar(ml)`, então o botão aparece como "+400 ml", e cada toque nele soma 400 ao total. É a peça de Lego: o pedido muda, a peça é a mesma.
:::

---

## :icon[milestone] Projeto 5 · Como entregar

A etapa 3 ainda sem commit? Num segundo terminal do VS Code (o primeiro está com o `npx expo start`):

```bash
git add .
git commit -m "Projeto 5: etapa 3, registros, lista e entrega"
git push
```

Um ajuste depois desse commit vai num commit novo, que diz o que mudou, como `Projeto 5: prints no README`.

:::steps
1. No GitHub, abra o repositório `gota` e confira se os dois prints aparecem no README
2. Na página do curso, em **Projetos**, abra o Projeto 5 e cole o link do repositório, e não o do perfil nem o `exp://`
3. Até a correção, você pode trocar o link
:::

**Prazo: início do E33.** O instrutor pode devolver o projeto para ajustes, com um comentário por critério: corrija, faça um commit e envie de novo pela mesma página.

---

## Resumo

:::summary
- O React Native é o intérprete: o mesmo JSX vira peça nativa; a `View` agrupa, e todo texto mora num `Text`
- O Expo leva o app ao celular pelo QR code, no mesmo Wi-Fi e com a mesma conta; o `console.log` vai para o terminal
- O estilo é uma ficha do `StyleSheet.create`, em camelCase e sem `px`; o toque é o `Pressable`, com a seta no `onPress`
- O estado é o placar: cada copo entra numa lista nova, e o total sai de um `reduce` com o `0`
- A `FlatList` é a esteira, com o crachá em texto; o Remover é a peneira com `!==`
- A Prova 3 tem 20 questões, 60 minutos, uma tentativa e nota mínima 70
:::

---

## :icon[arrow-right] Próximos passos

No E33, começa o Projeto 6, o **Casas de adoção**, um app para achar abrigos de cães e gatos:

- :icon[layout-grid] o **flexbox**: você mesmo põe as caixas lado a lado, como a `Linha` do Gota fazia por você
- :icon[smartphone] a **área segura**: a tela longe do entalhe da câmera e das barras do celular
- :icon[folder-tree] um kit novo, com as peças de tela prontas para encaixar

Traga o celular carregado. O Projeto 5 entra até o início do E33.
