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

Programador Mobile: Módulo Básico · Encontro E09 · Aula 17 de 18

---

## O que você vai aprender

:::goal
- O que se mantém igual entre o React web e o React Native
- O que muda: componentes, eventos, estilo, listas e navegação
- Como reaproveitar a lógica do app web no app mobile
- Como compartilhar o app pelo Expo Go e configurar o `app.json`
:::

---

## :icon[monitor] Dois projetos, uma só lógica

Você tem dois apps funcionando:

- `minhas-tarefas`, no navegador, com dados vindos de uma API
- `minhas-tarefas-mobile`, no celular, com FlatList, formulário e Alert

Os dois fazem a mesma coisa: listam, adicionam, concluem e removem tarefas.

:::question
Abra os dois `App` lado a lado. Quanto do código você precisou **reescrever de verdade** e quanto você só copiou?
:::

Saber separar essas duas partes é o que permite a uma equipe manter web e mobile sem fazer tudo duas vezes.

---

## :icon[check] O que não muda

A parte "React" do React Native é a mesma biblioteca. Tudo isto funciona igual nas duas plataformas:

- Componentes são **funções que devolvem JSX**
- **Props** levam dados do pai para o filho
- `useState` guarda o que muda na tela
- `useEffect` roda código depois de renderizar (buscar dados, por exemplo)
- `map` com `key` transforma arrays em elementos
- **Lifting state up**: o estado fica no pai, que passa funções por props

:::center
![Animação: a lógica do minhas-tarefas é copiada igual para o minhas-tarefas-mobile; depois surge a tela do celular, traduzida de div e onClick para View e onPress](images/e09-logica-e-tela.svg)
:::

A lógica de `adicionarTarefa`, `alternarConcluida` e `removerTarefa` é idêntica nos dois projetos: é **copiada**. Só a tela muda: é **traduzida**.

---

## :icon[component] O que muda: componentes

No navegador, o JSX vira HTML. No celular, vira componentes **nativos** do Android e do iOS. Por isso as tags mudam:

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

## :icon[mouse-pointer-click] O que muda: eventos

No celular não existe clique nem `e.target`: existe **toque**, e o texto digitado chega direto como string.

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

`onChangeText` entrega o texto pronto: `(texto) => setTitulo(texto)` ou, mais curto, `setTitulo`.

---

## :icon[braces] O que muda: estilo

Não há CSS nem `className`. Os estilos são **objetos JavaScript** criados com `StyleSheet.create` e aplicados pela prop `style`.

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

Nomes em **camelCase**, números **sem unidade** e combinação com array: `style={[estilos.cartao, concluida && estilos.concluida]}`.

---

## :icon[list] O que muda: listas

Na web, `tarefas.map(...)` direto no JSX resolve. No celular, a tela e a memória são pequenas: a **FlatList** desenha só os itens visíveis.

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

A `key` do `map` vira `keyExtractor`; o conteúdo do `map` vira `renderItem`. O array `tarefas` continua o mesmo.

---

## :icon[smartphone] O que muda: navegação e APIs do aparelho

| Na web | No celular |
|---|---|
| Links `<a>` e rotas por URL | **Telas** que se empilham: você entra em uma e volta com o botão do aparelho |
| A barra de endereço é a navegação | A **navegação por pilha** vem de uma biblioteca de navegação |
| Acesso limitado ao hardware | Câmera, notificações, GPS e contatos ficam a um `import` de distância |

:::info
Navegação entre telas, câmera e notificações você vai ver no Módulo Específico. Por enquanto, seu app tem uma tela só, e isso é suficiente.
:::

---

## :icon[lightbulb] Pense

:::question
Imagine que você precisa fazer um **app de receitas** para o celular, e já existe uma versão web em React com lista de receitas, busca por nome e botão de favoritar.

O que você reaproveitaria do app web sem mudar uma linha? O que teria que reescrever?

Separe em duas colunas no caderno: **lógica** e **tela**.
:::

---

## :icon[columns-3] Lado a lado: adicionar tarefa

A função do `App` é a mesma; só o formulário troca de "tags".

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

Na web, `enviar` chama `event.preventDefault()` antes de `onAdicionar(texto)`. No celular, `adicionar` chama `onAdicionar(texto)` direto: não há página para recarregar.

---

## :icon[cloud-download] useEffect e fetch funcionam igual

Copie `carregarTarefas` e o efeito do `App.jsx` para o `App.js`: rodam no celular **sem mudar uma linha**. `fetch`, `async/await` e `useEffect` são JavaScript e React, não navegador.

```jsx
const URL_API = 'https://jsonplaceholder.typicode.com/todos?_limit=10';
async function carregarTarefas() {
  const resposta = await fetch(URL_API);
  const dados = await resposta.json();
  return dados.map((item) => ({
    id: item.id, titulo: item.title, concluida: item.completed, prioridade: 'media',
  }));
}
useEffect(() => {
  async function iniciar() {
    setTarefas(await carregarTarefas());
    setCarregando(false);
  }
  iniciar();
}, []);
```

O `try/catch` com o estado `erro` também vai junto. Só muda o que mostra `carregando` e `erro`: `<p>` vira `<Text>`.

---

## :icon[qr-code] Compartilhar o app com o Expo Go

Até agora, celular e computador precisavam estar no mesmo Wi-Fi. Com o **túnel**, qualquer pessoa com o Expo Go instalado abre o seu app:

```bash
npx expo start --tunnel
```

:::center
![Diagrama: sem túnel, computador e celular ficam no mesmo Wi-Fi; com --tunnel, o colega abre o app de qualquer rede](images/e09-tunel-expo.svg)
:::

- O terminal mostra um QR code e um link `exp://...`; na primeira vez, aceite instalar o pacote do túnel
- Quem escanear com o Expo Go vê o app rodando no próprio celular
- Funciona só enquanto o seu servidor estiver ligado: desligou o computador, o app some

:::info
A publicação definitiva, com **EAS Build** e envio para as lojas, fica para a unidade de integração do curso.
:::

---

## :icon[file-code] app.json antes de compartilhar

Quem abrir o seu app pelo Expo Go vê o nome, o ícone e a tela de abertura definidos no `app.json`. Cinco campos importam agora:

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
- `icon` e `splash`: imagens da pasta `assets/` (troque as imagens, mantenha os nomes)
- Mudou o `app.json`? Pare o servidor e rode `npx expo start -c`

---

## :icon[triangle-alert] Erros comuns ao migrar

:::warning
- Copiar o JSX da web com `div`, `p` e `button`: no React Native essas tags não existem e o app quebra
- Usar `className`: a prop certa é `style`, com um objeto do `StyleSheet`
- Deixar texto solto fora de `Text`: erro na hora
- Renderizar 200 itens com `map` dentro de `ScrollView` em vez de usar `FlatList`
- Esperar que o CSS funcione: `16px`, arquivos `.css` e seletores não existem no celular
:::

---

## :icon[list-checks] Resumo

:::summary
- A lógica (componentes como funções, props, `useState`, `useEffect`, `map`) é a mesma nas duas plataformas
- Muda o que desenha: `View`, `Text`, `Pressable` e `TextInput` no lugar das tags HTML
- Eventos: `onPress` e `onChangeText`; estilo: `StyleSheet` e `style`; listas longas: `FlatList`
- `npx expo start --tunnel` compartilha o app com quem tiver o Expo Go
- O `app.json` define nome, ícone, splash e versão
:::

---

## :icon[arrow-right] Próximos passos

Ainda neste encontro:

1. Quiz desta aula no sistema
2. Aula 18: revisão de todo o Módulo Básico, com questões comentadas
3. Laboratório: versão 1 do `minhas-tarefas-mobile` compartilhada com a turma
4. Prova 2, na última hora

Depois, no **Módulo Específico**:

- Layout e componentes do React Native, logo a seguir
- JavaScript a fundo
- O projeto integrador
