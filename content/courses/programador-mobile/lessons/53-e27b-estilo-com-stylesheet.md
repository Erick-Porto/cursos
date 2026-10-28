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

## Onde está o CSS?

No E22, no `minhas-tarefas` web, você criou `CartaoTarefa.module.css` e usou `className`. No `minhas-tarefas-mobile` isso não existe: o celular não tem navegador, e nenhuma regra CSS chega até ele.

Resultado: a tela de perfil com tudo colado no canto superior esquerdo, texto preto na fonte padrão, botão que parece um texto comum.

:::question
Como dar cor, espaço e alinhamento a uma tela que não tem CSS?
:::

A resposta do React Native: estilos são **objetos JavaScript**, escritos no mesmo arquivo do componente.

---

## StyleSheet.create e a prop style

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

- `StyleSheet.create` recebe um objeto: cada chave (`tela`, `titulo`) é um estilo nomeado
- A prop `style` recebe um desses estilos: `style={estilos.titulo}`
- A constante fica **no fim do arquivo**, e funciona porque só é usada quando o componente desenha a tela

---

## camelCase e sem unidades

As propriedades são as do CSS, com três ajustes: nomes em **camelCase**, números **sem unidade** e valores de texto entre aspas.

| CSS | StyleSheet |
|---|---|
| `font-size: 18px;` | `fontSize: 18` |
| `margin-top: 8px;` | `marginTop: 8` |
| `background-color: #1e293b;` | `backgroundColor: '#1e293b'` |
| `border-radius: 12px;` | `borderRadius: 12` |
| `font-weight: bold;` | `fontWeight: 'bold'` |
| `text-align: center;` | `textAlign: 'center'` |

:::info
O número não é pixel: é uma unidade independente de densidade, que o aparelho ajusta. `fontSize: 18` tem o mesmo tamanho aparente em um celular simples e em um topo de linha.
:::

---

## Cores, bordas e espaçamento

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

## Flexbox: flexDirection

Toda `View` já é um contêiner **Flexbox**. `flexDirection` diz em que direção os filhos se enfileiram.

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

`justifyContent` distribui os filhos **ao longo da direção** escolhida em `flexDirection`. Em `row`, é na horizontal; em `column`, na vertical.

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

Valores: `flex-start` (padrão, tudo no começo), `center` (tudo junto no centro), `flex-end` (tudo no fim) e `space-between` (primeiro no começo, último no fim, espaço igual entre eles).

---

## alignItems: o eixo cruzado

`alignItems` alinha os filhos no eixo **perpendicular** à direção. Em `row`, alinha na vertical; em `column`, na horizontal.

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

## flex: 1 para ocupar o espaço

Uma `View` tem só a altura do seu conteúdo. Com `flex: 1`, ela **cresce** até preencher o espaço que sobra no pai.

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

Na tela: a lista estica até embaixo e **empurra o botão para o rodapé**.

:::info
Sem `flex: 1` no `SafeAreaView`, ele envolve só o conteúdo e a cor de fundo não cobre a tela inteira. É o primeiro estilo de toda tela.
:::

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

## Exemplo: CartaoTarefa mobile

A versão mobile do `CartaoTarefa`, com as mesmas props da versão web do E22 (`titulo`, `prioridade`, `concluida`). Em `src/components/CartaoTarefa.js`:

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

A `View` de dentro, `linha`, existe só para colocar título e prioridade lado a lado.

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

## Combinando estilos com array

A prop `style` também aceita um **array**. Os estilos se somam e, em caso de conflito, o último vence. Um valor `false` é ignorado: com o `&&` do E13, o mesmo da lista vazia no E22, você liga um estilo por condição:

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

Para destacar pela prioridade, a mesma ideia com uma comparação:

```jsx
<View style={[estilos.cartao, prioridade === 'alta' && estilos.alta]}>
```

Na tela: o cartão concluído fica meio transparente; a tarefa alta ganha uma faixa vermelha na borda esquerda, e o texto "alta" continua lá para quem não distingue cores.

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
- `font-size` com hífen: dentro de um objeto JavaScript isso é erro de sintaxe. Escreva `fontSize`
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
- Barra de progresso com duas `View`, o trilho e o preenchimento; a largura do preenchimento em porcentagem, como texto: `'60%'`
- Três `BotaoCopo` lado a lado: 200, 300 e 500 ml
- `StyleSheet.create` no fim de cada arquivo

Commit: `Projeto 5: etapa 2, tela com StyleSheet`. Enunciado completo e entrega: página do curso, em **Projetos**.
