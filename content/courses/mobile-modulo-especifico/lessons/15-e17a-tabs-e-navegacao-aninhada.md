---
title: Abas e navegação aninhada
summary: Organize a Lojinha em abas com o grupo (tabs), ícones, badge do carrinho e uma pilha dentro da aba Categorias.
module: layout-rn
duration_minutes: 40
objectives:
  - Organizar as telas principais em abas com o grupo (tabs) e o Tabs
  - Configurar ícones, cores do tema e o badge do carrinho na barra de abas
  - Aninhar uma pilha dentro de uma aba
  - Decidir quais telas ficam fora das abas, com um cabeçalho por tela
---

# Abas e navegação aninhada

Programador Mobile: Módulo Específico · Encontro E17 · Aula 15 de 71

---

## O que você vai aprender

:::goal
- Decidir quando uma tela merece uma aba
- Criar o grupo `(tabs)` com `Tabs`, ícones, cores do tema e o badge do carrinho
- Montar uma pilha dentro da aba Categorias
- Manter o detalhe do produto fora das abas, com um único cabeçalho por tela
:::

---

## Quatro toques, sempre à mão

Abra o app do seu banco ou de delivery. No rodapé, quatro ou cinco abas fixas: Início, Busca, Pedidos, Perfil. De qualquer tela, um toque leva a cada uma, e cada aba lembra onde você parou.

A Lojinha do E16 é uma pilha só. Para ver o carrinho, você depende do botão no topo do Início; para voltar à vitrine, toca em voltar várias vezes. Categorias e Perfil nem têm caminho.

:::question
Quais telas da Lojinha merecem lugar fixo no rodapé? E quais não deveriam estar lá?
:::

---

## :icon[columns-3] Quando usar abas

**Abas** são os destinos principais do app: do mesmo nível, sempre disponíveis e visitados em qualquer ordem.

| Use aba para | Não use aba para |
|---|---|
| Início, Categorias, Carrinho, Perfil | o detalhe de um produto |
| destinos que existem o tempo todo | passos de um fluxo, como endereço e pagamento |
| de 3 a 5 destinos | uma tela que só abre a partir de outra |

Regra prática: se a tela só faz sentido a partir de outra, ela é **empilhada**, não é aba.

:::tip
Com mais de 5 abas, os rótulos ficam espremidos e o polegar erra o alvo. Agrupe destinos ou leve os menos usados para dentro do Perfil.
:::

---

## :icon[folder-tree] Grupos de rotas com parênteses

Uma pasta com o nome entre parênteses é um **grupo de rotas**: organiza os arquivos e pode ter o próprio `_layout.js`, mas **não entra na URL**.

| Arquivo | URL |
|---|---|
| `app/(tabs)/index.js` | `/` |
| `app/(tabs)/carrinho.js` | `/carrinho` |
| `app/(tabs)/categorias/[slug].js` | `/categorias/audio` |
| `app/produto/[id].js` | `/produto/3` |

Por isso o `Link` para `/carrinho` do E16 continua funcionando depois da mudança: a URL é a mesma, só a pasta mudou. Agora ele troca para a aba Carrinho.

:::info
O nome `(tabs)` é uma convenção. Quem cria as abas é o `Tabs` dentro do `_layout.js` do grupo.
:::

---

## :icon[folder-tree] A árvore antes e depois

::::columns
:::col
**Antes (E16)**

```plaintext
app/
├── _layout.js
├── index.js
├── carrinho.js
└── produto/
    └── [id].js
```
:::
:::col
**Depois**

```plaintext
app/
├── _layout.js
├── (tabs)/
│   ├── _layout.js
│   ├── index.js
│   ├── carrinho.js
│   └── perfil.js
└── produto/
    └── [id].js
```
:::
::::

Mova `index.js` e `carrinho.js` para dentro de `(tabs)` e **apague os originais**. Cada arquivo desceu uma pasta, então o caminho até `src/` ganha um `../`:

```javascript
// app/(tabs)/index.js
export { default } from '../../src/telas/Inicio';
```

---

## :icon[columns-3] O layout das abas

Dentro do grupo, `app/(tabs)/_layout.js` devolve um **`Tabs`** no lugar do `Stack`. Cada `Tabs.Screen` aponta para um arquivo do grupo pelo nome, sem o `.js`.

```jsx
import { Tabs } from 'expo-router';

export default function LayoutAbas() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Início', headerShown: false }} />
      <Tabs.Screen name="carrinho" options={{ title: 'Carrinho' }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
```

Na tela: uma barra no rodapé com três rótulos, e o toque troca de aba sem a animação da pilha. A ordem dos `Tabs.Screen` é a ordem da barra. O Início esconde o cabeçalho das abas porque já desenha o seu, como no E16.

:::tip
O `Tabs` já vem com o `expo-router`: não há nada a instalar.
:::

---

## :icon[smartphone] Ícones e cores do tema

`tabBarIcon` recebe `{ color, size, focused }` e devolve o ícone. Use a `color` recebida: a barra pinta sozinha a aba ativa e as inativas.

```jsx
function icone(nome) {
  return ({ color, size }) => <Ionicons name={nome} size={size} color={color} />;
}

// dentro de LayoutAbas, antes do return
const { cores } = useTema();

<Tabs
  screenOptions={{
    tabBarActiveTintColor: cores.primaria,
    tabBarInactiveTintColor: cores.textoSuave,
    tabBarStyle: { backgroundColor: cores.superficie, borderTopColor: cores.borda },
  }}
>
```

Em cada aba: `tabBarIcon: icone('home-outline')`, depois `grid-outline`, `cart-outline` e `person-outline`. **`screenOptions`** vale para todas as abas; `options`, para uma só. Para o cabeçalho das abas seguir o tema, some `headerStyle` e `headerTintColor`, como na `Pilha` do E16.

---

## :icon[shopping-cart] Badge do carrinho

**`tabBarBadge`** mostra um número sobre o ícone. Leia a `quantidade` do `useCarrinho()`, o mesmo contexto que o Detalhe usa para adicionar.

```jsx
const { quantidade } = useCarrinho();

<Tabs.Screen
  name="carrinho"
  options={{
    title: 'Carrinho',
    tabBarIcon: icone('cart-outline'),
    tabBarBadge: quantidade || undefined,
  }}
/>
```

- Com 3 itens, aparece "3" sobre o carrinho
- Com 0, `0 || undefined` dá `undefined` e o badge some; sem o `||`, ficaria um "0" ali
- Quando o Detalhe chama `adicionar`, o contexto muda, o layout redesenha e o número sobe

:::tip
No `comprar` do Detalhe, troque `router.push('/carrinho')` por `router.back()`: o cliente volta à lista e vê o número subir. O `push` empilharia uma segunda barra de abas por cima do detalhe.
:::

---

## :icon[layers] O layout raiz continua uma pilha

As abas não substituem o `Stack` do E16: elas ficam **dentro** dele. Na `Pilha` de `app/_layout.js`, o grupo `(tabs)` vira a primeira tela, e o detalhe entra por cima dele.

```jsx
// app/_layout.js, dentro da Pilha do E16
<Stack screenOptions={{ /* cores do tema, como no E16 */ }}>
  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
</Stack>
```

As linhas `index` e `carrinho` da `Pilha` saem: essas rotas agora pertencem ao grupo.

Sem `headerShown: false`, o `Stack` desenha um cabeçalho escrito "(tabs)" e, logo abaixo, as abas desenham o delas. Dois cabeçalhos empilhados: o erro mais comum desta aula.

---

## Pense

:::question
A Lojinha tem 4 abas: Início, Categorias, Carrinho e Perfil. O detalhe do produto abre a partir da vitrine do Início e da lista de uma categoria.

O detalhe do produto fica em qual aba?
:::

:::tip Resposta
Em nenhuma. Ele fica fora das abas, em `app/produto/[id].js`, na pilha raiz. Assim qualquer aba abre o mesmo detalhe com `router.push('/produto/' + id)`, a tela cobre a barra de abas e o voltar devolve o cliente para a aba de onde ele veio.
:::

---

## :icon[layers] Detalhe fora das abas, por cima de tudo

:::center
![Animação: o toque na aba Categorias chama router.push('/produto/3'); o push sobe até a pilha raiz e o Detalhe, em produto/[id], entra por cima de todas as abas do grupo (tabs)](images/e17-detalhe-na-pilha-raiz.svg)
:::

Quando a aba Categorias chama `router.push('/produto/3')`, o Expo Router procura quem conhece essa rota: a pilha raiz. O detalhe entra **por cima do grupo `(tabs)` inteiro**:

- a barra de abas fica coberta, sem roubar espaço da foto e do botão
- todas as abas abrem o mesmo arquivo, em vez de um detalhe por aba
- o voltar devolve o cliente à aba de origem, onde ele parou

Telas de foco, como detalhe, filtros e pagamento, ficam fora das abas.

---

## :icon[layers] Uma pilha dentro da aba

Na aba Categorias, o cliente toca em Áudio e vê os fones; volta e escolhe Livros. Isso é uma **pilha aninhada**: um `Stack` que vive dentro de uma aba.

```plaintext
app/(tabs)/categorias/
├── _layout.js    Stack da aba
├── index.js      /categorias, a SectionList do E14
└── [slug].js     /categorias/audio
```

```jsx
// app/(tabs)/categorias/_layout.js
import { Stack } from 'expo-router';

export default function LayoutCategorias() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Categorias' }} />
      <Stack.Screen name="[slug]" options={{ title: 'Categoria' }} />
    </Stack>
  );
}
```

No layout das abas, o nome da aba é o da pasta: `name="categorias"`, com `tabBarIcon: icone('grid-outline')`.

---

## :icon[route] A rota `[slug]` da categoria

`app/(tabs)/categorias/[slug].js` só reexporta `src/telas/ProdutosCategoria.js`, que lê o `slug` e filtra os produtos:

```jsx
export default function ProdutosCategoria() {
  const { slug } = useLocalSearchParams();
  const categoria = categorias.find((c) => c.slug === slug);
  const lista = produtos.filter((p) => p.categoria === slug);
  return (
    <>
      <Stack.Screen options={{ title: categoria ? categoria.nome : 'Categoria' }} />
      <FlatList data={lista} keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <CartaoProduto produto={item}
          onPress={() => router.push('/produto/' + item.id)} />} />
    </>
  );
}
```

Para chegar aqui, a `SectionList` de `Categorias.js` ganha `slug: categoria.slug` em cada seção, e o título da seção vira um `Link` para `'/categorias/' + section.slug`.

---

## :icon[eye-off] Um cabeçalho por tela

Cada navegador desenha o próprio cabeçalho. Quando um está dentro do outro, os dois aparecem. Decida quem fala em cada tela:

| Tela | Quem desenha o cabeçalho | Onde esconder o outro |
|---|---|---|
| Início | a própria tela, como no E16 | `index` no `Tabs` |
| Carrinho e Perfil | `Tabs` | `(tabs)` na pilha raiz |
| Categorias e `[slug]` | `Stack` da aba | `categorias` no `Tabs` |
| Detalhe | pilha raiz | nada a esconder |

```jsx
<Tabs.Screen
  name="categorias"
  options={{ title: 'Categorias', headerShown: false, tabBarIcon: icone('grid-outline') }}
/>
```

Na tela: "Áudio" no cabeçalho, com a seta de voltar, e a barra de abas embaixo.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Criar `app/(tabs)/index.js` sem apagar `app/index.js`: duas rotas respondem por `/` e o Expo Router acusa conflito
- Mover o arquivo e não corrigir o caminho: `'../src/telas/Inicio'` agora precisa de `'../../src/telas/Inicio'`
- Pôr o detalhe ou uma tela solta dentro de `(tabs)`: todo arquivo do grupo vira aba
- Esquecer `headerShown: false` em `(tabs)` ou em `categorias`: dois cabeçalhos empilhados
- Badge com um `useState` próprio no layout: ninguém o atualiza; leia a `quantidade` do `useCarrinho()`
:::

---

## Resumo

:::summary
- Abas são de 3 a 5 destinos principais, visitados em qualquer ordem
- Pasta entre parênteses é grupo de rotas: organiza e tem layout, mas não entra na URL
- `Tabs` no `_layout.js` do grupo, com `tabBarIcon`, cores do tema e `tabBarBadge: quantidade || undefined`
- Uma pasta com `_layout.js` e `Stack` vira uma pilha dentro da aba
- Telas de foco, como o detalhe, ficam na pilha raiz, e cada tela tem um único cabeçalho
:::

---

## :icon[arrow-right] Próximos passos

A Lojinha já tem a estrutura de um app de loja de verdade. Falta o que acontece por cima das abas e antes delas.

Na aula 16, você completa a navegação:

- :icon[list-filter] o modal de filtros, que sobe por cima da vitrine e devolve a escolha
- :icon[lock] o fluxo de entrada com o grupo `(auth)` e o `Redirect`
- :icon[link] deep links que abrem um produto direto
- :icon[workflow] os padrões de onboarding e checkout
