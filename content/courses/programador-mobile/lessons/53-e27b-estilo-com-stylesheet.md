---
title: Estilo com StyleSheet
summary: Cores, espaçamento e Flexbox no React Native com StyleSheet.create e estilos combinados em array.
module: react-native
duration_minutes: 40
objectives:
  - Estilizar componentes com StyleSheet
  - Alinhar elementos com flexDirection, justifyContent e alignItems
  - Combinar estilos condicionalmente
---

# Estilo com StyleSheet

Programador Mobile · Encontro E27 · Aula 53 de 89

---

## O que você vai aprender

:::goal
- Criar estilos com `StyleSheet.create` e aplicá-los com `style`
- Traduzir propriedades do CSS para camelCase sem unidades
- Alinhar elementos com `flexDirection`, `justifyContent` e `alignItems`
- Combinar estilos em array e deixar um deles condicional
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **estilo** | a aparência de um componente: cor, tamanho, espaço, alinhamento |
| **`StyleSheet`** | (*folha de estilos*) o lugar do arquivo onde cada estilo ganha um nome |
| **camelCase** | palavras juntas, cada nova começando com maiúscula: `fontSize` |
| **Flexbox** | o jeito de organizar as caixas da tela: direção, alinhamento e espaço |
| **eixo** | a linha em que os itens se enfileiram: na horizontal ou na vertical |
| **padding** e **margin** | o espaço por dentro e o espaço por fora de uma caixa |

---

## Onde está o CSS?

No E22, no `minhas-tarefas` web, você criou `CartaoTarefa.module.css` e usou `className`. No `minhas-tarefas-mobile` isso não existe: o celular não tem navegador, e nenhuma regra CSS chega até ele.

Resultado: a tela de perfil com tudo colado no canto superior esquerdo, texto preto na fonte padrão, botão que parece um texto comum.

:::question
Como dar cor, espaço e alinhamento a uma tela que não tem CSS?
:::

A resposta do React Native: estilos são **objetos JavaScript**, escritos no mesmo arquivo do componente.

---

## StyleSheet

Onde você guarda as roupas, e como acha a certa na hora de sair?

---

## StyleSheet.create e a prop style

Um **estilo** é a roupa do componente: cor, tamanho, espaço. O `StyleSheet.create` é o guarda-roupa do arquivo: cada estilo ganha um nome, e a prop `style` veste o componente com ele.

```jsx
const estilos = StyleSheet.create({
  titulo: { fontSize: 24 },
});

<Text style={estilos.titulo}>Minhas Tarefas</Text>
```

- `StyleSheet.create` recebe um objeto: cada chave (aqui, `titulo`) é um estilo nomeado
- A prop `style` recebe um desses estilos: `style={estilos.titulo}`
- O `StyleSheet` vem do `react-native`, no mesmo `import` do `View` e do `Text`

---

## :icon[layers] StyleSheet na prática

Uma tela com dois estilos: o fundo da tela e o título.

```jsx
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={estilos.tela}>
      <Text style={estilos.titulo}>Minhas Tarefas</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { padding: 16, backgroundColor: '#f8fafc' },
  titulo: { fontSize: 24, fontWeight: 'bold' },
});
```

- `tela` dá espaço de 16 por dentro e fundo cinza bem claro; `titulo`, letra 24 em negrito
- A constante fica **no fim do arquivo**, e funciona porque só é usada quando o componente desenha a tela

Na tela: "Minhas Tarefas" grande e em negrito, afastado das bordas, sobre um fundo quase branco.

---

## camelCase

Como fica `font-size` sem o hífen, com as palavras emendadas?

---

## camelCase e sem unidades

As propriedades são as do CSS, com três ajustes:

- Nomes em **camelCase**: palavras juntas, cada nova com maiúscula, como as corcovas de um camelo. `font-size` vira `fontSize`
- Números **sem unidade**: `18`, e não `18px`
- Valores de texto entre aspas: `'bold'`, `'#1e293b'`

:::info
O número não é pixel: o aparelho o ajusta à densidade da tela, quantos pontos de luz cabem em cada centímetro. `fontSize: 18` tem o mesmo tamanho aparente num celular simples e num topo de linha.
:::

---

## :icon[arrow-left-right] camelCase na prática

Seis regras de CSS traduzidas para o `StyleSheet`:

| CSS | StyleSheet |
|---|---|
| `font-size: 18px;` | `fontSize: 18` |
| `margin-top: 8px;` | `marginTop: 8` |
| `background-color: #1e293b;` | `backgroundColor: '#1e293b'` |
| `border-radius: 12px;` | `borderRadius: 12` |
| `font-weight: bold;` | `fontWeight: 'bold'` |
| `text-align: center;` | `textAlign: 'center'` |

Repare em cada linha: o hífen sai e a letra seguinte vira maiúscula; o `px` some; a cor e o `bold` ganham aspas; o `;` do fim vira vírgula entre as propriedades.

---

## Cores e espaçamento

Numa mudança, para que serve o plástico-bolha dentro da caixa?

---

## Cores, bordas e espaçamento

Pense numa caixa de mudança: o **`padding`** é o plástico-bolha por dentro, entre a caixa e o objeto; a **`margin`** é a distância entre esta caixa e as outras.

| Propriedade | O que faz |
|---|---|
| `backgroundColor` | a cor de fundo |
| `padding` | espaço por dentro, entre a borda e o conteúdo |
| `margin` | espaço por fora, entre a caixa e o que está em volta |
| `borderWidth` e `borderColor` | a largura e a cor da borda; sem largura, não há borda |
| `borderRadius` | cantos arredondados |

---

## :icon[package] Espaçamento na prática

Um cartão: fundo branco, cantos arredondados, borda fina, espaço por dentro e por fora.

```jsx
<View style={estilos.cartao}>
  <Text style={estilos.titulo}>Estudar React Native</Text>
</View>
```

```jsx
const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: '#ffffff',
    padding: 16,       // espaço entre a borda e o conteúdo
    margin: 8,         // espaço entre o cartão e o que está fora
    borderRadius: 12,  // cantos arredondados
    borderWidth: 1,    // a borda só aparece com uma largura
    borderColor: '#e2e8f0',
  },
  titulo: { fontSize: 18, color: '#0f172a' },
});
```

Na tela: um retângulo branco com cantos redondos e contorno cinza-claro, afastado 8 das bordas da tela, com o texto respirando 16 por dentro.

---

## Flexbox

Numa prateleira, de que jeitos dá para arrumar três caixas?

---

## Flexbox: flexDirection

O **Flexbox** organiza as caixas como numa prateleira: você escolhe a direção, o alinhamento e o espaço entre elas. Toda `View` já é uma prateleira para os seus filhos. A propriedade `flexDirection` (direção) diz em que sentido eles se enfileiram: `row` (linha), lado a lado, ou `column` (coluna), um embaixo do outro.

```jsx
<View style={{ flexDirection: 'row' }}>
  <Text>Estudar React Native</Text>
  <Text>alta</Text>
</View>
```

Na tela: os dois textos **lado a lado**, na mesma linha, encostados à esquerda.

:::warning Padrão diferente da web
No React Native o padrão é `column`: os filhos empilham um abaixo do outro. Na web, o padrão do Flexbox é `row`. Se nada se alinha na horizontal, é porque faltou `flexDirection: 'row'`.
:::

---

## justifyContent: o eixo principal

`justifyContent` (distribuir o conteúdo) espalha os filhos **ao longo da direção** escolhida em `flexDirection`: é o **eixo principal**. Em `row`, ele é horizontal; em `column`, vertical.

:::center
![Animação: numa View com flexDirection row, os textos Estudar React Native e alta passam por flex-start, center e flex-end e param em space-between, um em cada ponta, com o espaço vazio no meio](images/e27-justify-content.svg)
:::

```jsx
<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
  <Text>Estudar React Native</Text>
  <Text>alta</Text>
</View>
```

Na tela: o título grudado à esquerda, a prioridade grudada à direita e o espaço vazio no meio.

Valores: `flex-start` (padrão, tudo no começo), `center` (tudo junto no centro), `flex-end` (tudo no fim) e `space-between` (espaço entre: primeiro no começo, último no fim).

---

## alignItems: o eixo cruzado

`alignItems` (alinhar os itens) alinha os filhos no **eixo cruzado**, a linha que atravessa a direção. Em `row`, alinha na vertical; em `column`, na horizontal.

:::center
![Diagrama dos eixos: em row, justifyContent age na horizontal e alignItems na vertical; em column, que é o padrão, os eixos trocam e justifyContent age na vertical e alignItems na horizontal](images/e27-eixos-flexbox.svg)
:::

```jsx
<View style={{ flexDirection: 'row', alignItems: 'center' }}>
  <Text style={{ fontSize: 28 }}>Estudar</Text>
  <Text style={{ fontSize: 12 }}>alta</Text>
</View>
```

Na tela: o texto pequeno fica alinhado ao **meio da altura** do texto grande, em vez de colado no topo da linha.

Valores: `stretch` (padrão, estica para preencher), `flex-start`, `center` e `flex-end`.

:::tip
Em uma `View` comum (direção `column`), `alignItems: 'center'` centraliza os filhos na horizontal. É assim que você centraliza um título.
:::

---

## :icon[layout-grid] Flexbox na prática

Três arrumações que aparecem em quase todo app:

| Você quer | Estilo da `View` de fora |
|---|---|
| imagem e título lado a lado, alinhados pelo meio (um cabeçalho) | `flexDirection: 'row', alignItems: 'center'` |
| título à esquerda e prioridade à direita (a linha de um cartão) | `flexDirection: 'row', justifyContent: 'space-between'` |
| um título no meio da largura da tela | `alignItems: 'center'`, sem mudar a direção |

O segundo caso, inteiro:

```jsx
<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
  <Text style={{ fontSize: 18 }}>Revisar Flexbox</Text>
  <Text style={{ fontSize: 12 }}>media</Text>
</View>
```

Na tela: "Revisar Flexbox" à esquerda, "media" à direita, os dois na mesma altura do meio. As três propriedades juntas: direção, espaço e alinhamento.

---

## Ocupar o espaço

Se sobra um vão na prateleira, como uma caixa ocupa o vão inteiro?

---

## flex: 1 para ocupar o espaço

Uma `View` tem só a altura do seu conteúdo. Com `flex: 1`, ela **cresce** até preencher o espaço que sobra no pai, como uma caixa que estica até ocupar o vão vazio da prateleira.

```jsx
<View style={{ flex: 1 }}>
  {/* ocupa todo o espaço que sobrar */}
</View>
```

:::info
Sem `flex: 1` no `SafeAreaView`, ele envolve só o conteúdo e a cor de fundo não cobre a tela inteira. É o primeiro estilo de toda tela.
:::

---

## :icon[arrow-down] flex: 1 na prática

Dois usos de uma vez: a tela inteira e a lista que empurra o botão.

```jsx
<SafeAreaView style={{ flex: 1 }}>
  <View style={{ flex: 1 }}>
    <Text>Lista de tarefas</Text>
  </View>
  <Pressable style={{ padding: 16 }}>
    <Text>Nova tarefa</Text>
  </Pressable>
</SafeAreaView>
```

- O `SafeAreaView` com `flex: 1` ocupa a tela toda: uma cor de fundo nele pinta tudo
- A `View` da lista com `flex: 1` estica e ocupa o que sobra depois do botão

Na tela: a lista estica até embaixo e **empurra o botão para o rodapé**.

---

## Pense

:::question
Você quer mostrar "Nenhuma tarefa ainda" no **centro exato da tela**, na horizontal e na vertical.

Quais três propriedades resolvem isso, e por quê?
:::

:::tip Resposta
```jsx
<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  <Text>Nenhuma tarefa ainda</Text>
</View>
```

`flex: 1` faz a View ocupar a tela inteira. Como a direção padrão é `column`, `justifyContent: 'center'` centraliza na vertical e `alignItems: 'center'` centraliza na horizontal.
:::

---

## O CartaoTarefa

No E22, que props o CartaoTarefa recebia?

---

## Exemplo: CartaoTarefa mobile

A versão mobile do `CartaoTarefa`, com as mesmas props da versão web do E22 (`titulo`, `prioridade`, `concluida`): o pedido que o pai faz à peça. Em `src/components/CartaoTarefa.js`:

```jsx
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function CartaoTarefa({ titulo, prioridade, concluida }) {
  return (
    <View style={estilos.cartao}>
      <View style={estilos.linha}>
        <Text style={estilos.titulo}>{titulo}</Text>
        <Text style={estilos.prioridade}>{prioridade}</Text>
      </View>
      <Pressable style={estilos.botao} onPress={() => console.log('concluir')}>
        <Text style={estilos.textoBotao}>Concluir</Text>
      </Pressable>
    </View>
  );
}
```

- A `View` de dentro, `linha`, existe só para colocar título e prioridade lado a lado
- O "Concluir", por enquanto, só escreve `concluir` no terminal; ele ganha função no E28

---

## Os estilos do CartaoTarefa

No fim do mesmo arquivo:

```jsx
const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  linha: { flexDirection: 'row', justifyContent: 'space-between' },
  titulo: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  prioridade: { fontSize: 14, color: '#475569' },
  botao: { backgroundColor: '#0ea5e9', padding: 10, borderRadius: 8, marginTop: 12 },
  textoBotao: { color: '#ffffff', textAlign: 'center' },
});
```

Na tela: um cartão branco de cantos redondos; na primeira linha, o título em negrito à esquerda e a prioridade em cinza à direita; embaixo, um botão azul de largura total com "Concluir" em branco, centralizado.

:::tip
`Pressable` não tem aparência própria. São o fundo, o `padding` e o `borderRadius` que o fazem parecer um botão.
:::

---

## Estilos em array

Camiseta e casaco: quem olha para você vê qual dos dois?

---

## Combinando estilos com array

A prop `style` também aceita um **array**: uma lista de estilos, vestidos em camadas. Eles se somam e, quando dois mexem na mesma propriedade, o último vence, como a roupa de cima. Um valor `false` é ignorado: com o `&&` do E13, o mesmo da lista vazia no E22, você liga um estilo por condição.

```jsx
<View style={[estilos.cartao, concluida && estilos.concluida]}>
```

```jsx
const estilos = StyleSheet.create({
  cartao: { backgroundColor: '#ffffff', padding: 16, borderRadius: 12 },
  concluida: { opacity: 0.5 },
  alta: { borderLeftWidth: 4, borderLeftColor: '#ef4444' },
});
```

Em português: "vista o `cartao`; se `concluida` for verdadeiro, vista também o `concluida` por cima". Se for falso, o `&&` entrega `false`, e o React Native ignora.

---

## Estilos em array na prática

Três cartões, com os estilos `cartao`, `concluida` e `alta` do `StyleSheet.create`:

```jsx
<View style={[estilos.cartao, prioridade === 'alta' && estilos.alta]}>
```

| O cartão | O array vira | Na tela |
|---|---|---|
| concluído | `[cartao, concluida]` | meio transparente (`opacity: 0.5`) |
| de prioridade `alta` | `[cartao, alta]` | uma faixa vermelha de 4 na borda esquerda |
| comum | `[cartao, false]` | só o `cartao`: o `false` é ignorado |

O `prioridade === 'alta'` dá `true` ou `false`, e o `&&` faz o resto. O texto "alta" continua no cartão, para quem não distingue cores.

---

## :icon[lightbulb] Nomeie pelo papel

:::tip
Deixe `StyleSheet.create` sempre no fim do arquivo: quem lê encontra primeiro o que o componente faz e depois como ele se veste.

Nomeie cada estilo pelo **papel** que ele cumpre, não pela aparência. Se a cor do botão mudar de azul para verde, `botao` continua fazendo sentido; `azul` vira mentira.
:::

| Evite | Prefira |
|---|---|
| `azul`, `grande`, `cinzaClaro` | `botao`, `titulo`, `prioridade` |
| `estilo1`, `estilo2` | `cartao`, `linha` |
| `vermelho` | `alta`, `concluida` |

---

## :icon[bug] Erros comuns

:::warning
- `font-size` com hífen: dentro de um objeto JavaScript, isso é erro de sintaxe (`Unexpected token`). Escreva `fontSize`
- Unidade `px`: `fontSize: '18px'` não funciona. Escreva `fontSize: 18`
- Esquecer que o padrão é `column`: os itens empilham e parece que o Flexbox "não funcionou"
- `style="padding: 16"` como texto: `style` recebe um objeto ou um array, nunca uma string
- `className`: não existe no React Native. Nenhum CSS chega ao celular
:::

---

## Resumo

:::summary
- Sem CSS: estilos são objetos JavaScript em `StyleSheet.create`, aplicados com `style={estilos.nome}`
- Propriedades em camelCase e números sem unidade: `fontSize: 18`, `marginTop: 8`
- `flexDirection` define a direção (padrão `column`); `justifyContent` alinha no eixo principal e `alignItems`, no cruzado
- `flex: 1` faz um elemento ocupar o espaço que sobra
- Um array em `style` combina estilos e liga um deles por condição
:::

---

## :icon[flask-conical] No laboratório

Monte a tela inicial do `minhas-tarefas-mobile` no celular, pelo Expo Go.

:::steps
1. Instale `react-native-safe-area-context`; em `App.js`, `SafeAreaProvider` envolve tudo e a tela usa `SafeAreaView` com `flex: 1`
2. Cabeçalho com uma imagem local (`assets/icon.png` serve), o título "Minhas Tarefas" e o contador fixo "3 pendentes"
3. `src/components/CartaoTarefa.js` com `View`, `Text` e um `Pressable` "Concluir", estilos no fim do arquivo
4. Três cartões estáticos com prioridades `alta`, `media` e `baixa`; a alta visualmente destacada
5. Rodapé com um `Pressable` "Nova tarefa"
6. `git add .`, `git commit -m "E27: tela inicial com StyleSheet"` e `git push`
:::

**Critérios de entrega**: componentes em arquivos separados; todo estilo com `StyleSheet`; prioridade alta destacada; nada atrás do notch; app rodando no celular. Entregue o link do repositório.

---

## :icon[milestone] Projeto 5 · Etapa 2: tela com StyleSheet

No repositório `gota`, ainda com valores fixos:

- `SafeAreaProvider` e `SafeAreaView` com `flex: 1`; a [gota.png](materiais/projeto-5/gota.png) do curso em `assets/`
- `Cabecalho`, `CartaoProgresso` (props `total` e `meta`) e `BotaoCopo` (prop `ml`) em `src/components/`
- Barra de progresso com duas `View`: o trilho, o fundo da barra, e o preenchimento, a parte colorida dentro dele. A largura do preenchimento vai em porcentagem, como texto: `'60%'`
- Três `BotaoCopo` lado a lado: 200, 300 e 500 ml
- `StyleSheet.create` no fim de cada arquivo

Commit: `Projeto 5: etapa 2, tela com StyleSheet`. Enunciado completo e entrega: página do curso, em **Projetos**.
