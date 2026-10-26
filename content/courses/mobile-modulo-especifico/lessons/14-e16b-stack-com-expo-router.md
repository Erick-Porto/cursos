---
title: Pilha de telas com Expo Router
summary: Monte a pilha do Lojinha com rotas finas, Link, router, parâmetros de rota e um carrinho compartilhado.
module: layout-rn
duration_minutes: 40
objectives:
  - Configurar a pilha em app/_layout.js com provedores e cores do tema
  - Navegar entre telas com Link e router
  - Ler parâmetros de rotas dinâmicas com useLocalSearchParams
  - Compartilhar o carrinho entre telas com um contexto
---

# Pilha de telas com Expo Router

Programador Mobile: Módulo Específico · Encontro E16 · Aula 14 de 71

---

## O que você vai aprender

:::goal
- Montar a pilha em `app/_layout.js`, com os provedores e as cores do tema
- Ligar rotas finas às telas de `src/telas/`
- Navegar com `Link` e `router` e ler o `id` com `useLocalSearchParams`
- Compartilhar o carrinho entre as telas com o `CarrinhoContext`
:::

---

## Do toque à sacola

Em um app de loja, você toca em um fone na vitrine: o detalhe abre por cima, com o nome do produto no cabeçalho. Você toca em **Adicionar ao carrinho** e o carrinho já mostra o fone e o total. Volta duas vezes e está de novo na vitrine, no mesmo ponto da rolagem.

Três telas e um caminho: é isso que você constrói hoje no `lojinha`.

:::question
Como o carrinho fica sabendo o que foi adicionado no detalhe, se uma tela não renderiza a outra?
:::

---

## :icon[layers] O layout raiz: app/_layout.js

```jsx
import { Stack } from 'expo-router';
import { TemaProvider } from '../src/theme/TemaContext';
import { CarrinhoProvider } from '../src/contexts/CarrinhoContext';

export default function Layout() {
  return (
    <TemaProvider>
      <CarrinhoProvider>
        <Stack />
      </CarrinhoProvider>
    </TemaProvider>
  );
}
```

- **`Stack`** é a pilha: cada rota de `app/` vira uma tela dela
- Os provedores ficam **por fora** da pilha, e assim todas as telas enxergam o tema e o carrinho
- O que o `App.js` fazia, como carregar as fontes e esconder a splash, muda para este arquivo

---

## :icon[sliders-horizontal] Cabeçalho com as cores do tema

`useTema()` só funciona **dentro** do `TemaProvider`. Por isso as opções da pilha ficam num componente filho, a `Pilha`:

```jsx
function Pilha() {
  const { cores } = useTema();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: cores.superficie },
        headerTintColor: cores.texto,
        contentStyle: { backgroundColor: cores.fundo },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="carrinho" options={{ title: 'Carrinho' }} />
    </Stack>
  );
}
```

No `Layout`, troque `<Stack />` por `<Pilha />`. **`screenOptions`** vale para todas as telas; `headerTintColor` pinta o título e a seta. Cada `Stack.Screen` com `name` ajusta uma rota: o Início esconde o cabeçalho da pilha porque já tem o seu.

---

## :icon[route] Rotas finas

Cada arquivo de `app/` só aponta para uma tela que mora em `src/telas/`:

```javascript
// app/index.js
export { default } from '../src/telas/Inicio';
```

```javascript
// app/carrinho.js
export { default } from '../src/telas/Carrinho';
```

```javascript
// app/produto/[id].js
export { default } from '../../src/telas/Detalhe';
```

- A linha importa o `export default` da tela e o exporta de novo, que é o que o Expo Router procura
- `app/` descreve **os endereços**; `src/telas/` guarda **o código das telas**
- No E17, as rotas mudam de pasta para criar as abas e as telas não mudam
- `[id].js` está uma pasta abaixo: por isso o `../../`

---

## :icon[link] Link: navegar com um toque

```jsx
import { Link } from 'expo-router';

<Link href="/carrinho">Ver carrinho</Link>
```

Sozinho, o `Link` desenha um `Text` que navega. Para transformar um botão seu em link, use **`asChild`**: o `Link` repassa o toque e o endereço ao filho, que precisa aceitar `onPress`, como o `Pressable`.

```jsx
<Link href="/carrinho" asChild>
  <Pressable style={estilos.botaoCarrinho}>
    <Ionicons name="cart-outline" size={22} color={cores.texto} />
    <Text style={{ color: cores.texto }}>Carrinho ({quantidade})</Text>
  </Pressable>
</Link>
```

Na tela: um botão com o ícone do carrinho e a quantidade; o toque empilha a tela do carrinho.

---

## :icon[navigation] router: navegar pelo código

Quando a navegação acontece no meio de uma função, como depois de guardar algo, use o objeto **`router`**:

```jsx
import { router } from 'expo-router';

router.push('/produto/' + item.id); // empilha o detalhe daquele produto
router.back();                      // fecha a tela de cima
```

| Chamada | O que faz na pilha |
|---|---|
| `router.push('/carrinho')` | coloca o carrinho por cima |
| `router.back()` | tira a tela de cima, como o voltar do sistema |
| `router.replace('/')` | troca a tela de cima, sem deixar caminho de volta |

Regra prática: `Link` quando o toque só leva a outra tela; `router` quando a função faz mais alguma coisa antes de navegar.

---

## Pratique

:::example Desafio
No `Inicio`, a `FlatList` desenha cada produto com o `CartaoProduto`. Escreva o `renderItem` para que tocar no cartão abra `/produto/` seguido do `id` daquele produto.
:::

:::tip Resposta
```jsx
renderItem={({ item }) => (
  <CartaoProduto
    produto={item}
    onPress={() => router.push('/produto/' + item.id)}
  />
)}
```

A arrow function é obrigatória: `onPress={router.push(...)}` navegaria durante a renderização, antes de qualquer toque. Se o seu `CartaoProduto` ainda não recebe `onPress`, acrescente a prop e repasse-a ao `Pressable` dele.
:::

---

## :icon[hash] Rota dinâmica: lendo o id

Em `app/produto/[id].js`, o trecho entre colchetes vira um **parâmetro**. A tela lê esse valor com o hook **`useLocalSearchParams()`**:

```jsx
import { useLocalSearchParams } from 'expo-router';
import { produtos } from '../data/produtos';

export default function Detalhe() {
  const { id } = useLocalSearchParams();
  const produto = produtos.find((p) => p.id === Number(id));
  if (!produto) return <Text>Produto não encontrado</Text>;
  // mostra produto.nome, produto.preco e produto.descricao
}
```

| Endereço | O que a tela recebe |
|---|---|
| `/produto/7` | `{ id: '7' }` |
| `/produto/12` | `{ id: '12' }` |

O nome da chave é o nome entre colchetes: `[id]` vira `id`.

---

## :icon[circle-alert] O parâmetro é sempre texto

Endereços são texto. Mesmo que você chame `router.push('/produto/' + 7)`, a tela recebe a string `'7'`. No `produtos.js`, o `id` é número.

```jsx
produtos.find((p) => p.id === id);         // 7 === '7' é false: undefined
produtos.find((p) => p.id === Number(id)); // 7 === 7: encontra o produto
```

Sem a conversão, `produto` fica `undefined` e a primeira linha que lê `produto.nome` derruba o app com a tela vermelha `Cannot read property 'nome' of undefined`.

:::tip
Converta uma vez, logo depois de ler o parâmetro, e guarde o produto encontrado numa constante. O `if (!produto)` cuida de um `id` que não existe, como `/produto/99`.
:::

---

## :icon[tag] Título da tela com Stack.Screen

O nome do produto só é conhecido quando a tela abre. Coloque um `Stack.Screen` **dentro** da tela, com opções que valem só para ela:

```jsx
import { Stack } from 'expo-router';

return (
  <ScrollView style={{ backgroundColor: cores.fundo }}>
    <Stack.Screen options={{ title: produto.nome }} />
    <Image source={produto.imagem} style={estilos.imagem} contentFit="cover" />
    <Text style={[estilos.nome, { color: cores.texto }]}>{produto.nome}</Text>
  </ScrollView>
);
```

O `Stack.Screen` não desenha nada: só ajusta o cabeçalho. Na tela, o cabeçalho mostra "Fone Bluetooth" e a seta volta para o Início.

| Onde | Para quê |
|---|---|
| `screenOptions` no `Stack` | opções de todas as telas |
| `Stack.Screen name` no layout | título fixo de uma rota |
| `Stack.Screen` dentro da tela | título que depende dos dados |

---

## :icon[shopping-cart] Um carrinho acima da pilha

:::center
![Animação: o Detalhe chama adicionar no CarrinhoProvider, que fica acima da pilha; depois itens e total descem até o Carrinho, que mostra R$ 199,90; entre as telas irmãs, props não passam](images/e16-carrinho-no-contexto.svg)
:::

Detalhe e Carrinho são telas irmãs na pilha: props não passam de uma para a outra. A saída é a receita do tema: um **contexto** acima da pilha. O Detalhe chama `adicionar`, e o Carrinho lê `itens` e `total` do mesmo `CarrinhoProvider`.

---

## :icon[shopping-cart] CarrinhoContext (1): estado e adicionar

O contexto mora em `src/contexts/CarrinhoContext.js`:

```jsx
import { createContext, useContext, useState } from 'react';

const CarrinhoContext = createContext(null);

export function CarrinhoProvider({ children }) {
  const [itens, setItens] = useState([]);

  function adicionar(produto) {
    const existe = itens.find((i) => i.id === produto.id);
    if (existe) {
      setItens(itens.map((i) => (i.id === produto.id ? { ...i, qtd: i.qtd + 1 } : i)));
    } else {
      setItens([...itens, { ...produto, qtd: 1 }]);
    }
  }
```

Cada item é o produto com uma `qtd`. Produto repetido soma 1 na `qtd` em vez de aparecer duas vezes.

---

## :icon[shopping-cart] CarrinhoContext (2): total e hook

O mesmo arquivo, a partir do fim de `adicionar`:

```jsx
  function remover(id) {
    setItens(itens.filter((i) => i.id !== id));
  }
  const quantidade = itens.reduce((soma, i) => soma + i.qtd, 0);
  const total = itens.reduce((soma, i) => soma + i.preco * i.qtd, 0);
  const valor = { itens, adicionar, remover, quantidade, total };
  return <CarrinhoContext.Provider value={valor}>{children}</CarrinhoContext.Provider>;
}

export function useCarrinho() {
  const valor = useContext(CarrinhoContext);
  if (!valor) throw new Error('useCarrinho fora do CarrinhoProvider');
  return valor;
}
```

- `reduce` percorre a lista acumulando uma soma que começa em `0`
- `quantidade` e `total` são **calculados** a partir de `itens` a cada renderização: não precisam de estado próprio
- O `throw` deixa claro o erro de usar o hook fora do provedor

---

## :icon[mouse-pointer-click] Adicionar e ir para o carrinho

No `Detalhe`, guarde primeiro e navegue depois:

```jsx
const { adicionar } = useCarrinho(); // no topo, junto dos outros hooks

function comprar() {
  adicionar(produto);
  router.push('/carrinho');
}

<Botao titulo="Adicionar ao carrinho" onPress={comprar} />
```

No `Carrinho`, leia o mesmo contexto:

```jsx
const { itens, remover, total } = useCarrinho();

<Text style={[estilos.total, { color: cores.texto }]}>Total: {formatarPreco(total)}</Text>
```

Na tela: o carrinho abre por cima do detalhe, já com o fone e "Total: R$ 199,90". A seta volta ao detalhe, que continua lá embaixo.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Comparar `p.id === id` sem `Number(id)`: o produto não é encontrado e o app quebra em `produto.nome`
- Chamar `useTema()` no mesmo componente que renderiza o `TemaProvider`: o hook ainda não enxerga o provedor. Use um componente filho, como a `Pilha`
- `Link` em volta de um `Pressable` sem `asChild`: o toque fica com o `Pressable` e nada navega
- `onPress={router.push('/carrinho')}` sem arrow function: navega durante a renderização, não no toque
- Caminho errado na rota fina: de `app/produto/[id].js` até `src/` são dois `../`
:::

---

## Resumo

:::summary
- `app/_layout.js` monta a pilha com `Stack` e põe o `TemaProvider` e o `CarrinhoProvider` por fora dela
- Rotas finas reexportam as telas de `src/telas/`; `app/` só descreve os endereços
- `Link` navega no toque (com `asChild` para botões próprios); `router.push` e `router.back` navegam pelo código
- `useLocalSearchParams` lê o `id` da rota dinâmica sempre como texto: converta com `Number(id)`
- `Stack.Screen` dentro da tela define o título, e o `CarrinhoContext` leva `itens`, `quantidade` e `total` a todas as telas
:::

---

## :icon[flask-conical] No laboratório

Monte as três telas do `lojinha` em pilha.

:::steps
1. Instale o Expo Router, ajuste `main` e `scheme` e rode `npx expo start -c`
2. `app/_layout.js` com provedores, fontes e `Stack`, mais `app/index.js`; apague o `App.js`
3. `src/contexts/CarrinhoContext.js` e a `Pilha` com as cores do tema
4. `src/telas/Detalhe.js` e `app/produto/[id].js`, com o nome no cabeçalho
5. `src/telas/Carrinho.js`, com total por `formatarPreco`, e `app/carrinho.js`
6. No `Inicio`: `router.push` no cartão e `Link` com `asChild` para o carrinho
7. Commit "E16: navegação em pilha e carrinho" e `git push`
:::

**Critérios de entrega**: detalhe com o nome do produto no cabeçalho; adicionar leva ao carrinho com o total formatado; o voltar percorre a pilha; `app/` só com layout e rotas finas. Entregue o link do repositório no sistema.
