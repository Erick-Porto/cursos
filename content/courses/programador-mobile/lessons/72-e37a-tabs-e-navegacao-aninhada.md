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

Programador Mobile · Encontro E37 · Aula 72 de 89

---

## O que você vai aprender

:::goal
- Decidir quando uma tela merece uma aba
- Criar o grupo `(tabs)` com `Tabs`, ícones, cores do tema e o badge do carrinho
- Montar uma pilha dentro da aba Categorias
- Manter o detalhe do produto fora das abas, com um único cabeçalho por tela
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **aba** (*tab*) | um destino principal do app, com um botão fixo na barra do rodapé |
| **grupo de rotas** | uma pasta com o nome entre parênteses, que organiza arquivos sem mudar o endereço |
| **badge** | o numerozinho sobre um ícone, como o das mensagens não lidas |
| **navegação aninhada** | um navegador dentro de outro, como uma pilha de telas dentro de uma aba |
| **cabeçalho** (*header*) | a barra no topo da tela, com o título e a seta de voltar |
| **slug** | o nome curto de uma categoria, sem acento nem espaço, que vai no endereço: `audio` |

---

## Quatro toques, sempre à mão

Abra o app do seu banco ou de delivery. No rodapé, quatro ou cinco abas fixas: Início, Busca, Pedidos, Perfil. De qualquer tela, um toque leva a cada uma, e cada aba lembra onde você parou.

A Lojinha do E36 é uma pilha só. Para ver o carrinho, você depende do "Ver carrinho" no rodapé do Início; para voltar à vitrine, toca em voltar várias vezes. Categorias e Perfil nem têm caminho.

:::question
Quais telas da Lojinha merecem lugar fixo no rodapé? E quais não deveriam estar lá?
:::

---

## Abas

Quais seções do seu app de banco estão sempre a um toque, no rodapé?

---

## :icon[columns-3] Quando usar abas

**Abas** são os destinos principais do app, como as abas de um fichário: do mesmo nível, sempre à vista e abertas em qualquer ordem.

| Use aba para | Não use aba para |
|---|---|
| Início, Categorias, Carrinho, Perfil | o detalhe de um produto |
| destinos que existem o tempo todo | passos de um fluxo, como endereço e pagamento |
| de 3 a 5 destinos | uma tela que só abre a partir de outra |

Regra prática: se a tela só faz sentido a partir de outra, ela é **empilhada**, não é aba.

:::tip
Com mais de 5 abas, os rótulos ficam espremidos e o polegar erra o alvo. Leve os destinos menos usados para dentro do Perfil.
:::

---

## :icon[columns-3] As abas na prática

Três apps, as abas de cada um e as telas que ficam de fora:

| App | Abas no rodapé | Abre por cima, sem ser aba |
|---|---|---|
| delivery | Início, Busca, Pedidos, Perfil | o cardápio de um restaurante, o pagamento |
| banco | Início, Pix, Cartões, Perfil | o comprovante de um Pix |
| Lojinha | Início, Categorias, Carrinho, Perfil | Detalhe, Filtros, Entrar |

Repare na terceira coluna: cada tela dali só faz sentido a partir de outra. Por isso ela é empilhada.

---

## Grupos de rotas

Se você põe o WhatsApp numa pasta do celular, ele muda de nome?

---

## :icon[folder-tree] Grupos de rotas com parênteses

Uma pasta com o nome entre parênteses é um **grupo de rotas**. Ela funciona como uma pasta de apps na tela do celular: junta os ícones, mas cada app continua com o mesmo nome. O grupo organiza os arquivos e pode ter o próprio `_layout.js`, mas **não entra no endereço** (a URL).

| Arquivo | URL |
|---|---|
| `app/(tabs)/index.js` | `/` |
| `app/(tabs)/carrinho.js` | `/carrinho` |
| `app/(tabs)/categorias/[slug].js` | `/categorias/audio` |
| `app/produto/[id].js` | `/produto/3` |

Por isso o `Link` para `/carrinho` do E36 continua funcionando depois da mudança: a URL é a mesma, só a pasta mudou. Agora ele troca para a aba Carrinho.

---

## :icon[folder-tree] A árvore antes e depois

::::columns
:::col
**Antes (E36)**

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

## O layout das abas

Quem desenha a barra do rodapé e decide a ordem das abas?

---

## :icon[columns-3] O layout das abas

O **`Tabs`** é o navegador das abas: desenha a barra do rodapé e troca de tela a cada toque. Dentro do grupo, `app/(tabs)/_layout.js` devolve um `Tabs` no lugar do `Stack`. Cada `Tabs.Screen` aponta para um arquivo do grupo pelo nome, sem o `.js`.

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

Na tela: uma barra no rodapé com três rótulos, e o toque troca de aba sem a animação da pilha. A ordem dos `Tabs.Screen` é a ordem da barra. O Início esconde o cabeçalho das abas porque já desenha o seu, como no E36.

:::info
O nome `(tabs)` é só uma convenção. Quem cria as abas é o `Tabs`, que já vem com o `expo-router`: não há nada a instalar.
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

- `icone('home-outline')` devolve uma **função**, como as de alta ordem do E10. A barra chama essa função com a cor e o tamanho certos
- Em cada aba: `tabBarIcon: icone('home-outline')`, depois `grid-outline`, `cart-outline` e `person-outline`
- **`screenOptions`** vale para todas as abas; `options`, para uma só. Para o cabeçalho seguir o tema, some `headerStyle` e `headerTintColor`, como na `Pilha` do E36

---

## Badge

Como você sabe, sem abrir o WhatsApp, que chegou mensagem nova?

---

## :icon[shopping-cart] Badge do carrinho

O **badge** é o numerozinho sobre o ícone, como o das mensagens não lidas do WhatsApp. No `Tabs`, ele vem da opção **`tabBarBadge`**. Leia a `quantidade` do `useCarrinho()`, o mesmo contexto que o Detalhe usa para adicionar. Quem conta é o `contarItens` do E09, que soma as `qtd` de todos os itens.

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

- Com 2 fones e 1 livro, `contarItens` dá 3, e aparece "3" sobre o carrinho
- Com 0, `0 || undefined` dá `undefined` (o `0` é falsy, E13) e o badge some; sem o `||`, ficaria um "0" ali
- Quando o Detalhe chama `adicionar`, o contexto muda, o layout redesenha e o número sobe

---

## :icon[undo-2] Comprar e voltar à vitrine

No `comprar` do Detalhe, troque `router.push('/carrinho')` por `router.back()`:

```jsx
function comprar() {
  adicionar(produto);
  router.back(); // antes: router.push('/carrinho')
}
```

- O cliente volta à lista e vê o número do badge subir: é a confirmação da compra
- O `push` empilharia uma segunda barra de abas por cima do detalhe

---

## A pilha raiz

O detalhe do produto deveria mostrar a barra de abas embaixo dele?

---

## :icon[layers] O layout raiz continua uma pilha

As abas não substituem a pilha de cartas do E36: ficam **dentro** dela. O fichário de abas vira a primeira carta da pilha, e o detalhe entra por cima dele. Na `Pilha` de `app/_layout.js`, o grupo `(tabs)` vira a primeira tela:

```jsx
// app/_layout.js, dentro da Pilha do E36
<Stack screenOptions={{ /* cores do tema, como no E36 */ }}>
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
![Animação: o toque na aba Categorias chama router.push('/produto/3'); o push sobe até a pilha raiz e o Detalhe, em produto/[id], entra por cima de todas as abas do grupo (tabs)](images/e37-detalhe-na-pilha-raiz.svg)
:::

Quando a aba Categorias chama `router.push('/produto/3')`, o Expo Router procura quem conhece essa rota: a pilha raiz. O detalhe entra **por cima do grupo `(tabs)` inteiro**:

- a barra de abas fica coberta, sem roubar espaço da foto e do botão
- todas as abas abrem o mesmo arquivo, em vez de um detalhe por aba
- o voltar devolve o cliente à aba de origem, onde ele parou

Telas de foco, como detalhe, filtros e pagamento, ficam fora das abas.

---

## Pilha dentro da aba

Dá para entrar em Áudio e voltar sem sair da aba Categorias?

---

## :icon[layers] Uma pilha dentro da aba

Cada aba do fichário pode ter a própria pilha de cartas. Isso é **navegação aninhada**: um navegador dentro de outro. Na aba Categorias, o cliente toca em Áudio e vê os fones; volta e escolhe Livros.

```plaintext
app/(tabs)/categorias/
├── _layout.js    Stack da aba
├── index.js      /categorias, a SectionList do E34
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

O **slug** é o nome curto da categoria, sem acento nem espaço: `audio`, `casa`. `app/(tabs)/categorias/[slug].js` só reexporta `src/telas/ProdutosCategoria.js`, que lê o `slug` e filtra os produtos:

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

## :icon[list-ordered] ProdutosCategoria em português

| Linha | O que ela diz |
|---|---|
| `const { slug } = useLocalSearchParams()` | "pegue o `slug` do endereço": em `/categorias/audio`, `'audio'` |
| `categorias.find(...)` | "ache a categoria com esse slug", para mostrar o nome com acento: Áudio |
| `produtos.filter(...)` | "fique só com os produtos dessa categoria", a peneira do E09 |
| `<> ... </>` | o **fragmento** do E21: junta dois elementos sem desenhar caixa nenhuma |
| `categoria ? categoria.nome : 'Categoria'` | "achou? o nome dela no cabeçalho; se não, 'Categoria'" |
| `onPress={() => router.push(...)}` | "no toque, abra o detalhe do produto", na pilha raiz |

---

## :icon[layers] A pilha da aba na prática

Um cliente na aba Categorias, toque por toque. Ao lado, o que está na tela:

```plaintext
toca na aba Categorias     Categorias, com a barra de abas
toca em Áudio              Áudio por cima, com a seta e a barra
toca no Fone               Detalhe, cobrindo a barra (pilha raiz)
toca em voltar             Áudio de novo
toca na aba Início         a vitrine
toca na aba Categorias     Áudio: a aba lembrou onde você parou
toca em voltar             Categorias
```

- Áudio entra na pilha **da aba**: a barra continua embaixo
- O Detalhe entra na pilha **raiz**: cobre tudo
- Cada aba guarda a própria pilha enquanto você visita as outras

---

## Cabeçalhos

Dois títulos empilhados no topo da tela: quem desenhou cada um?

---

## :icon[eye-off] Um cabeçalho por tela

O **cabeçalho** é a barra no topo, com o título e a seta de voltar. Cada navegador desenha o próprio cabeçalho. Quando um está dentro do outro, os dois aparecem. Decida quem fala em cada tela:

| Tela | Quem desenha o cabeçalho | Onde esconder o outro |
|---|---|---|
| Início | a própria tela, como no E36 | `index` no `Tabs` |
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

## Erros comuns

Dois arquivos respondem pelo mesmo endereço. Qual deles o app deve abrir?

---

## :icon[siren] Quando aparece um erro

| O que aparece | Quer dizer | O que fazer |
|---|---|---|
| tela vermelha citando `index.js` e `(tabs)/index.js` | duas rotas respondem por `/`: o arquivo antigo ficou | apagar `app/index.js` |
| `Unable to resolve module ../src/telas/Inicio` | o arquivo desceu uma pasta e o caminho não acompanhou | `'../../src/telas/Inicio'` |
| uma aba sobrando, como "produto/[id]" | tela solta dentro de `(tabs)`: todo arquivo do grupo vira aba | mover para `app/` |
| dois cabeçalhos empilhados | falta `headerShown: false` em `(tabs)` ou em `categorias` | esconder o cabeçalho de fora |
| o badge nunca aparece | um `useState` próprio no layout, que ninguém atualiza | ler a `quantidade` do `useCarrinho()` |

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

Na aula 73, você completa a navegação:

- :icon[list-filter] o modal de filtros, que sobe por cima da vitrine e aplica a escolha com as regras do catálogo do E08
- :icon[lock] o fluxo de entrada com o grupo `(auth)` e o `Redirect`
- :icon[link] deep links que abrem um produto direto
- :icon[workflow] os padrões de onboarding e checkout
