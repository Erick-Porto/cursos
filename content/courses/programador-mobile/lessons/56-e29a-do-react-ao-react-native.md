---
title: Do React ao React Native
summary: O que muda e o que se mantém entre o app web e o app mobile, e como compartilhar o app pelo Expo Go.
module: react-native
duration_minutes: 40
objectives:
  - Comparar o React web com o React Native
  - Reaproveitar lógica entre as duas plataformas
  - Compartilhar o app pelo Expo Go e configurar o app.json
---

# Do React ao React Native

Programador Mobile · Encontro E29 · Aula 56 de 89

---

## O que você vai aprender

:::goal
- O que se mantém igual entre o React web e o React Native
- O que muda: componentes, eventos, estilo, listas e navegação
- Como reaproveitar a lógica do app web no app mobile
- Como compartilhar o app pelo Expo Go e configurar o `app.json`
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **plataforma** | o lugar onde o app roda: o navegador (web) ou o celular (mobile) |
| **lógica** | a parte do app que guarda os dados e decide o que fazer com eles |
| **tela** | a parte do app que desenha: caixas, textos, botões e campos |
| **componente nativo** | uma peça de tela desenhada pelo próprio Android ou iOS, igual à dos apps do sistema |
| **túnel** | um caminho pela internet que deixa outra pessoa abrir o seu app de qualquer rede |
| **`app.json`** | o arquivo com o nome, o ícone e a tela de abertura do app |

---

## :icon[monitor] Dois projetos, uma só lógica

Você tem dois apps funcionando:

- `minhas-tarefas`, no navegador (E21 a E25), com dados vindos de uma API, o garçom do E19 que traz os dados da internet
- `minhas-tarefas-mobile`, no celular (E26 a E28), com FlatList, formulário e Alert

Os dois fazem a mesma coisa: listam, adicionam, concluem e removem tarefas.

:::question
Abra os dois `App` lado a lado. Quanto do código você precisou **reescrever de verdade** e quanto você só copiou?
:::

Quem sabe separar essas duas partes mantém o app web e o mobile sem fazer tudo duas vezes.

---

## Lógica e tela

Num livro traduzido do inglês, o que muda e o que continua igual?

---

## :icon[check] O que não muda

Todo app tem duas partes. A **lógica** guarda os dados e decide o que fazer com eles. A **tela** desenha o resultado.

Pense num livro traduzido do inglês: a história é a mesma, só o idioma muda. A lógica é a história. A tela é o idioma.

Tudo isto é lógica e funciona igual nas duas plataformas:

- Componentes são **funções que devolvem JSX**, as peças de Lego da tela
- **Props** levam dados do pai para o filho
- `useState` guarda o que muda na tela, como um placar
- `useEffect` e os hooks próprios do E24
- `map` com `key` transforma arrays em elementos
- **Lifting state up** (*levantar o estado*): o estado fica no pai, que passa funções por props

---

## :icon[arrow-left-right] Lógica e tela na prática

:::center
![Animação: a lógica do minhas-tarefas é copiada igual para o minhas-tarefas-mobile; depois surge a tela do celular, traduzida de div e onClick para View e onPress](images/e29-logica-e-tela.svg)
:::

Três trechos do `minhas-tarefas`. Para cada um, pergunte: ele desenha na tela?

| Trecho | Desenha? | No celular |
|---|---|---|
| `alternarConcluida`, com `map` e spread | não | **copiado** igual |
| `carregarTarefas`, com `fetch` | não | **copiado** igual |
| `<div className="cartao">` | sim | **traduzido**: `<View style={estilos.cartao}>` |

A tradução da tela tem cinco partes: componentes, eventos, estilo, listas e navegação.

---

## Componentes nativos

Por que os botões do WhatsApp são diferentes no Android e no iPhone?

---

## :icon[component] O que muda: componentes

No navegador, o JSX vira HTML. No celular, vira **componentes nativos**: peças de tela que o próprio Android ou iOS desenha, iguais às dos apps do sistema. As peças de Lego trocam de nome, mas encaixam do mesmo jeito.

| Web (HTML) | React Native | Para que serve |
|---|---|---|
| `div` | `View` | caixa que agrupa e posiciona |
| `p`, `span`, `h1` | `Text` | qualquer texto na tela |
| `button` | `Pressable` ou `Button` | algo que reage ao toque |
| `input` | `TextInput` | campo de digitação |
| `img` | `Image` | imagem |

:::warning
No React Native, **todo texto precisa estar dentro de `Text`**. Uma palavra solta dentro de `View` gera erro.
:::

---

## :icon[smartphone] Componentes nativos na prática

O cabeçalho do `minhas-tarefas`, traduzido peça por peça:

::::columns
:::col
Web

```jsx
<div className="cabecalho">
  <img src="/logo.png" alt="Logo" />
  <h1>Minhas Tarefas</h1>
  <p>3 pendentes</p>
</div>
```
:::
:::col
React Native

```jsx
<View style={estilos.cabecalho}>
  <Image
    source={require('./assets/icon.png')}
    style={{ width: 32, height: 32 }}
  />
  <Text>Minhas Tarefas</Text>
  <Text>3 pendentes</Text>
</View>
```
:::
::::

- `div` vira `View`: a caixa que agrupa
- `img` vira `Image`, com `require` para a imagem local e um tamanho
- `h1` e `p` viram `Text`: no celular, todo texto é `Text`

Na tela: o ícone, o título e a contagem, desenhados pelo próprio sistema.

---

## Eventos

No celular, existe clique?

---

## :icon[mouse-pointer-click] O que muda: eventos

Um **evento** é algo que a pessoa faz na tela: tocar, digitar, rolar. No celular não existe clique nem `e.target`: existe **toque**, e o texto digitado chega direto como string, um texto pronto.

::::columns
:::col
Web

```jsx
<button onClick={salvar}>
  Salvar
</button>

<input
  value={titulo}
  onChange={(e) => setTitulo(e.target.value)}
/>
```
:::
:::col
React Native

```jsx
<Pressable onPress={salvar}>
  <Text>Salvar</Text>
</Pressable>

<TextInput
  value={titulo}
  onChangeText={setTitulo}
/>
```
:::
::::

- `onClick` vira **`onPress`**: "quando tocar, rode `salvar`"
- O texto do botão vai dentro de `Text`
- `onChangeText` entrega o texto pronto: `(texto) => setTitulo(texto)` ou, mais curto, `setTitulo`

---

## :icon[hand] Eventos na prática

Três toques e uma digitação do `minhas-tarefas-mobile`:

```jsx
// 1. tocar no cartão conclui a tarefa
<Pressable onPress={() => onAlternar(id)}>
  <Text>{titulo}</Text>
</Pressable>

// 2. tocar em Remover apaga a tarefa
<Pressable onPress={() => onRemover(id)}>
  <Text>Remover</Text>
</Pressable>

// 3. a busca guarda cada letra digitada
<TextInput value={busca} onChangeText={setBusca} placeholder="Buscar" />
```

- Nos casos 1 e 2, o `() =>` quer dizer "quando tocar, chame com este `id`". Sem ele, a função rodaria ao desenhar a tela
- No caso 3, a cada letra o `setBusca` recebe o texto inteiro: "c", depois "co", depois "com"

Na tela: o toque troca a tarefa entre feita e pendente, ou a remove; a busca mostra o que você digita.

---

## Estilo

Onde fica o CSS de um app de celular?

---

## :icon[braces] O que muda: estilo

**Estilo** é a aparência: cor, espaço, borda. Não há CSS nem `className`. Os estilos são **objetos JavaScript** criados com `StyleSheet.create` e aplicados pela prop `style`.

::::columns
:::col
Web (`CartaoTarefa.module.css`)

```css
.cartao {
  padding: 16px;
  border-radius: 8px;
  background-color: #fff;
}
```

```jsx
<div className={estilos.cartao}>
```
:::
:::col
React Native (fim do `App.js`)

```jsx
const estilos = StyleSheet.create({
  cartao: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
});

<View style={estilos.cartao}>
```
:::
::::

- Nomes em **camelCase**: sem hífen, a palavra seguinte com maiúscula (`border-radius` vira `borderRadius`)
- Números **sem unidade**: `16`, nunca `'16px'`
- Combinação com array: `style={[estilos.cartao, concluida && estilos.concluida]}`. O segundo estilo só entra se a tarefa estiver concluída

---

## :icon[pencil] Estilo na prática

Três estilos do `minhas-tarefas`, traduzidos do CSS:

```jsx
const estilos = StyleSheet.create({
  titulo: { fontSize: 24, fontWeight: 'bold' },        // era font-size: 24px
  linha: { flexDirection: 'row', justifyContent: 'space-between' },
  cartao: { padding: 16, borderRadius: 8, backgroundColor: '#fff' },
  concluida: { opacity: 0.5 },                          // meio transparente
});

<Text style={estilos.titulo}>Minhas Tarefas</Text>
<View style={estilos.linha}>{/* título e botão */}</View>
<View style={[estilos.cartao, concluida && estilos.concluida]}>{/* tarefa */}</View>
```

- `titulo`: na tela, o título grande e em negrito
- `linha`: o título numa ponta e o botão na outra (o Flexbox a fundo vem no E30)
- `concluida`: entra só quando a tarefa está feita; na tela, o cartão fica meio apagado

---

## Listas

No caixa do mercado, a esteira mostra todas as compras de uma vez?

---

## :icon[list] O que muda: listas

Na web, `tarefas.map(...)` direto no JSX resolve. No celular, a tela e a memória são pequenas. A **FlatList** é uma esteira: desenha só os itens que cabem na tela.

::::columns
:::col
Web

```jsx
<ul>
  {tarefas.map((t) => (
    <CartaoTarefa
      key={t.id}
      titulo={t.titulo}
      concluida={t.concluida}
    />
  ))}
</ul>
```
:::
:::col
React Native

```jsx
<FlatList
  data={tarefas}
  keyExtractor={(t) => String(t.id)}
  renderItem={({ item }) => (
    <CartaoTarefa
      titulo={item.titulo}
      concluida={item.concluida}
    />
  )}
/>
```
:::
::::

- O array `tarefas` continua o mesmo, agora na prop `data`
- A `key` do `map` vira **`keyExtractor`**: devolve o crachá de cada item, como texto
- O conteúdo do `map` vira **`renderItem`**: desenha um item; o `({ item })` pega o item da vez
- A `FlatList` não recebe filhos: um `map` escrito dentro dela é ignorado

---

## :icon[rows-3] Listas na prática

Caso 1: a lista de tarefas, com aviso de lista vazia.

```jsx
<FlatList
  data={tarefas}
  keyExtractor={(t) => String(t.id)}
  renderItem={({ item }) => <Text>{item.titulo}</Text>}
  ListEmptyComponent={<Text>Nenhuma tarefa</Text>}
/>
```

Na tela: com 3 tarefas, 3 linhas de texto; com o array vazio, "Nenhuma tarefa".

Caso 2: o hábito da web, que não funciona.

```jsx
<FlatList data={tarefas}>
  {tarefas.map((t) => <Text key={t.id}>{t.titulo}</Text>)}
</FlatList>
```

Na tela: nenhuma tarefa. A lista ignora o `map` e reclama que falta o `renderItem`.

---

## Navegação

Quando você aperta voltar no celular, para onde vai?

---

## :icon[smartphone] O que muda: navegação e APIs do aparelho

**Navegar** é ir de uma tela para outra. No celular, as telas são uma pilha de cartas: a nova vai por cima, e voltar tira a de cima.

| Na web | No celular |
|---|---|
| Links `<a>` e rotas por URL | **Telas** que se empilham; o botão do aparelho volta |
| A barra de endereço é a navegação | A **navegação por pilha** vem de um pacote |
| Pouco acesso às peças do aparelho | Câmera, notificações, GPS e contatos ficam a um `import` de distância |

:::info
A navegação entre telas chega no E36, já na Lojinha, com o Expo Router. Por enquanto, seu app tem uma tela só, e isso é suficiente.
:::

---

## :icon[lightbulb] Pense

:::question
Imagine que você precisa fazer um **app de receitas** para o celular, e já existe uma versão web em React com lista de receitas, busca por nome e botão de favoritar.

O que você reaproveitaria do app web sem mudar uma linha? O que teria que reescrever?

Separe em duas colunas no caderno: **lógica** e **tela**.
:::

:::tip Resposta
- **Lógica**, copiada: o estado das receitas, o `filter` da busca, o `map` que marca a favorita e o `fetch` no `useEffect`
- **Tela**, traduzida: `View` e `Text`, `TextInput` na busca, `Pressable` no favorito, `StyleSheet` no lugar do CSS, `FlatList` na lista e `Image` com tamanho
:::

---

## Copiar a lógica

O que precisa mudar numa função que não desenha nada na tela?

---

## :icon[columns-3] Lado a lado: adicionar tarefa

Copiar a lógica é levar a função para o outro projeto sem mudar nada, como a história que passa igual para o livro traduzido. A função do `App` é a mesma; só o formulário troca de "tags".

::::columns
:::col
Web (`App.jsx` e `FormularioTarefa.jsx`)

```jsx
function adicionarTarefa(titulo) {
  const nova = { id: Date.now(), titulo, prioridade: 'media', concluida: false }
  setTarefas([...tarefas, nova])
}
// FormularioTarefa.jsx
<form onSubmit={enviar}>
  <input value={texto} onChange={(e) => setTexto(e.target.value)} />
  <button type="submit">Adicionar</button>
</form>
```
:::
:::col
React Native (`App.js` e `FormularioTarefa.js`)

```jsx
function adicionarTarefa(titulo) {
  const nova = { id: Date.now(), titulo, prioridade: 'media', concluida: false };
  setTarefas([...tarefas, nova]);
}
// FormularioTarefa.js
<View style={estilos.formulario}>
  <TextInput value={texto} onChangeText={setTexto} placeholder="Nova tarefa" />
  <Pressable style={estilos.botao} onPress={adicionar}><Text>Adicionar</Text></Pressable>
</View>
```
:::
::::

- Na função, a única diferença é o `;` no fim das linhas: o projeto web não usa, o mobile usa. Os dois jeitos funcionam
- Na web, `enviar` chama `event.preventDefault()`, que impede a página de recarregar, antes de `onAdicionar(texto)`. No celular, `adicionar` chama `onAdicionar(texto)` direto: não há página para recarregar

---

## :icon[cloud-download] Os hooks do E24 funcionam igual

Copie `src/api/tarefas.js` e os hooks `useTarefas.js` e `useDebounce.js` do projeto web para o app: rodam no celular **sem mudar uma linha**. `fetch`, `async/await`, `useEffect` e hooks próprios são JavaScript e React, não navegador: o mesmo `fetch` já rodou no terminal, no E19.

```jsx
import { useTarefas } from './src/hooks/useTarefas';

export default function App() {
  const { tarefas, carregando, erro, recarregar,
    adicionarTarefa, alternarConcluida, removerTarefa } = useTarefas();
  // o resto da tela é o do E28: TextInput, FlatList e Pressable
}
```

- `src/api/tarefas.js` traz o `carregarTarefas`, o `fetch` que busca as tarefas na API
- As chaves em `const { ... } = useTarefas()` tiram do hook, pelo nome, tudo o que a tela usa

O `useTituloDaAba` fica de fora: `document.title` é do navegador, e no celular não existe `document`.

---

## Compartilhar o app

Como alguém entra na sua chamada de vídeo estando em outra cidade?

---

## :icon[qr-code] Compartilhar o app com o Expo Go

Até agora, celular e computador precisavam estar no mesmo Wi-Fi. O **túnel** é um caminho pela internet até o seu computador, como uma chamada de vídeo por link: quem tem o link entra de qualquer lugar, e a chamada acaba quando você sai.

```bash
npx expo start --tunnel
```

- O terminal mostra um QR code e um link `exp://...`; na primeira vez, aceite instalar o pacote do túnel
- Quem escanear com o Expo Go vê o app no próprio celular
- Só funciona com o servidor (`npx expo start`) ligado: desligou o computador, o app some

---

## :icon[wifi] O túnel na prática

:::center
![Diagrama: sem túnel, computador e celular ficam no mesmo Wi-Fi; com --tunnel, o colega abre o app de qualquer rede](images/e29-tunel-expo.svg)
:::

| Situação | Comando | O que acontece |
|---|---|---|
| colega no mesmo Wi-Fi | `npx expo start` | lê o QR code e abre |
| colega no 4G | `npx expo start --tunnel` | link terminado em `exp.direct`; abre de qualquer rede |
| você desligou o computador | nenhum | o app some do celular do colega |

Nos dois casos, o Expo Go baixa o app do servidor que roda no seu computador.

:::info
A publicação definitiva, com **EAS Build** e envio para as lojas, fica para o E44, na Integração de competências profissionais.
:::

---

## :icon[file-code] app.json antes de compartilhar

O **`app.json`** é a embalagem do app: o nome, o logotipo e a primeira imagem que aparece ao abrir. Quem abrir o seu app pelo Expo Go vê o que está nele. Cinco campos importam agora:

```json
{
  "expo": {
    "name": "Minhas Tarefas",
    "slug": "minhas-tarefas-mobile",
    "version": "1.0.0",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash-icon.png",
      "backgroundColor": "#1e293b"
    }
  }
}
```

- `name`: nome que aparece embaixo do ícone; `slug`: identificador do projeto no Expo, sem espaços
- `version`: a versão que você entrega
- `icon` e `splash`: imagens da pasta `assets/` (troque as imagens, mantenha os nomes). A **splash** é a tela de abertura, que aparece enquanto o app carrega
- Mudou o `app.json`? Pare o servidor e rode `npx expo start -c`. O `-c` (ou `--clear`, limpar) apaga o **cache**, a cópia antiga que o Expo guardou

---

## Mensagens de erro

Quando acende uma luz no painel do carro, o que você faz?

---

## :icon[siren] Quando aparece um erro

Quase todo erro ao migrar é um hábito da web. A tela vermelha é a luz do painel do carro: diz o que aconteceu e onde. Leia a primeira linha.

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `View config getter callback for component` | uma tag da web (`div`, `p`, `button`) ficou no JSX | trocar pela peça nativa: `View`, `Text`, `Pressable` |
| `Text strings must be rendered within a <Text> component` | texto solto, fora de `Text` | pôr o texto dentro de `<Text>` |
| `Something went wrong`, no Expo Go do colega | o túnel caiu ou o servidor parou | `npx expo start --tunnel` de novo |

---

## :icon[eye-off] Erros que não avisam

Alguns hábitos da web não mostram mensagem nenhuma: o app roda, mas sai errado.

| O que você vê | Por quê | O que fazer |
|---|---|---|
| o estilo não aparece | `className`, ou medida como texto (`'16px'`) | `style` com o `StyleSheet` e números sem unidade |
| o campo não muda ao digitar | `onChange` com `e.target.value`, copiado da web | `onChangeText={setTexto}` |
| a lista fica lenta ao rolar | 200 itens com `map` dentro de `ScrollView` | `FlatList` com `data` e `renderItem` |

Arquivos `.css` e seletores também não existem no celular: todo estilo vem do `StyleSheet`.

---

## :icon[list-checks] Resumo

:::summary
- A lógica (componentes como funções, props, `useState`, `useEffect`, `map`) é a mesma nas duas plataformas: é copiada
- Muda o que desenha: `View`, `Text`, `Pressable` e `TextInput` no lugar das tags HTML. A tela é traduzida
- Eventos: `onPress` e `onChangeText`; estilo: `StyleSheet` e `style`; listas longas: `FlatList`
- `npx expo start --tunnel` compartilha o app com quem tiver o Expo Go, enquanto o servidor estiver ligado
- O `app.json` define nome, ícone, splash e versão; mudou, `npx expo start -c`
:::

---

## :icon[arrow-right] Próximos passos

Ainda neste encontro:

1. Aula 57: revisão de E26 a E29, com questões comentadas
2. Laboratório: versão 1 do `minhas-tarefas-mobile` compartilhada com a turma
3. Prova 3, na última hora; o quiz do E29 fica para casa

Depois, de E30 a E40, **Layout e componentes React Native**: a Lojinha nasce no app, e as regras que você testou no terminal com o `lojinha-regras` ganham tela.
