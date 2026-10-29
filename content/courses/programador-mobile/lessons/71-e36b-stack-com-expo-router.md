---
title: Pilha de telas com Expo Router
summary: Monte a pilha do Lojinha com rotas finas, Link, router, parâmetros de rota e um carrinho compartilhado.
module: layout-rn
duration_minutes: 40
objectives:
  - Configurar a pilha em app/_layout.js com provedores e cores do tema
  - Navegar entre telas com Link e router
  - Ler parâmetros de rotas dinâmicas com useLocalSearchParams
  - Compartilhar o carrinho entre telas com um contexto que chama as regras do carrinho
---

# Pilha de telas com Expo Router

Programador Mobile · Encontro E36 · Aula 71 de 89

---

## O que você vai aprender

:::goal
- Montar a pilha em `app/_layout.js`, com os provedores e as cores do tema
- Ligar rotas finas às telas de `src/telas/`
- Navegar com `Link` e `router` e ler o `id` com `useLocalSearchParams`
- Compartilhar o carrinho entre as telas com o `CarrinhoContext`, que usa as regras de `src/regras/carrinho.js`
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **layout raiz** | o `app/_layout.js`: a moldura que envolve todas as telas do app |
| **cabeçalho** (*header*) | a barra no topo da tela, com o título e a seta de voltar |
| **rota fina** | um arquivo de `app/` com uma linha só, que aponta para a tela de verdade |
| **parâmetro de rota** | o pedaço do endereço que muda, como o `7` em `/produto/7` |
| **contexto** | um lugar acima das telas onde ficam dados que todas leem, como o carrinho |
| **provedor** (*provider*) | o componente que guarda um contexto e o entrega a tudo o que está dentro dele |

---

## Do toque à sacola

Em um app de loja, você toca em um fone na vitrine: o detalhe abre por cima, com o nome do produto no cabeçalho. Você toca em **Adicionar ao carrinho** e o carrinho já mostra o fone e o total. Volta duas vezes e está de novo na vitrine, no mesmo ponto da rolagem.

Três telas e um caminho: é isso que você constrói hoje no `lojinha`.

:::question
Como o carrinho fica sabendo o que foi adicionado no detalhe, se uma tela não renderiza a outra?
:::

---

## O layout raiz

Onde colocar aquilo que todas as telas do app precisam enxergar, como o tema?

---

## :icon[layers] O layout raiz: app/_layout.js

O **layout raiz** é o `app/_layout.js`: a moldura que envolve todas as telas do app. É nele que você escolhe a pilha e coloca os **provedores**, os componentes que entregam o tema e o carrinho a todas as telas.

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

- **`Stack`** é a pilha de cartas: cada rota de `app/` vira uma carta dela
- Os provedores ficam **por fora** da pilha, e assim todas as telas enxergam o tema e o carrinho
- O que o `App.js` fazia, como carregar as fontes e esconder a splash, muda para este arquivo

---

## :icon[sliders-horizontal] Cabeçalho com as cores do tema

O **cabeçalho** é a barra no topo, com o título e a seta de voltar. `useTema()` só funciona **dentro** do `TemaProvider`. Por isso as opções da pilha ficam num componente filho, a `Pilha`:

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

- No `Layout`, troque `<Stack />` por `<Pilha />`
- **`screenOptions`** (opções das telas) vale para todas as telas; `headerTintColor` pinta o título e a seta
- Cada `Stack.Screen` com `name` ajusta uma rota: o Início esconde o cabeçalho da pilha (`headerShown: false`) porque já tem o seu

---

## :icon[layers] O layout raiz na prática

O que o `app/_layout.js` muda em cada tela, sem você abrir o arquivo da tela:

| Tela | No layout | Na tela |
|---|---|---|
| Início | `headerShown: false` | só o cabeçalho que a própria tela desenha |
| Carrinho | `title: 'Carrinho'` | "Carrinho" no topo e a seta de voltar |
| Detalhe | nada, por enquanto | o nome da rota, `produto/[id]`, até a tela definir o título |
| todas, no tema escuro | `cores` no `screenOptions` | cabeçalho e fundo escuros |
| todas | os provedores por fora da pilha | `useTema()` e `useCarrinho()` funcionam em qualquer uma |

Mudou a cor do cabeçalho? Uma linha no layout, e todas as telas acompanham.

---

## Rotas finas

Para que serve o atalho de um programa na área de trabalho do computador?

---

## :icon[route] Rotas finas

Uma **rota fina** é um arquivo de `app/` com uma linha só, que aponta para a tela de verdade, em `src/telas/`. Funciona como um atalho na área de trabalho do computador: o ícone só aponta para o programa, que mora em outra pasta.

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

- A linha diz: "pegue o `export default` da tela e ponha na vitrine deste arquivo", a reexportação do E11. É o que o Expo Router procura
- `app/` descreve **os endereços**; `src/telas/` guarda **o código das telas**
- No E37, as rotas mudam de pasta para criar as abas e as telas não mudam
- `[id].js` está uma pasta abaixo: por isso o `../../`

---

## Link e router

O que acontece quando você toca num link dentro de um site?

---

## :icon[link] Link: navegar com um toque

Um **`Link`** é como um link de site: tocou, abriu outra rota. O endereço vai na prop `href`.

```jsx
import { Link } from 'expo-router';

<Link href="/carrinho">Ver carrinho</Link>
```

Sozinho, o `Link` desenha um `Text` que navega. Para transformar um botão seu em link, use **`asChild`** ("como filho"): o `Link` repassa o toque e o endereço ao filho, que precisa aceitar `onPress`, como o `Pressable`.

```jsx
<Link href="/carrinho" asChild>
  <Pressable style={estilos.botaoCarrinho}>
    <Ionicons name="cart-outline" size={22} color={cores.texto} />
    <Text style={{ color: cores.texto }}>Ver carrinho</Text>
  </Pressable>
</Link>
```

Na tela: o toque empilha a tela do carrinho. O `Botao` do E33 também aceita `asChild`, porque repassa o `onPress` ao `Pressable` dele: no Início, o "Ver carrinho" do rodapé, que desde o E32 só imprimia no terminal, vira `<Link href="/carrinho" asChild><Botao ... /></Link>`.

---

## :icon[navigation] router: navegar pelo código

Quando a navegação acontece no meio de uma função, como depois de guardar algo, use o objeto **`router`**. Ele mexe na pilha de cartas pelo código:

```jsx
import { router } from 'expo-router';

router.push('/produto/' + item.id); // empilha o detalhe daquele produto
router.back();                      // fecha a tela de cima
```

| Chamada | O que faz na pilha |
|---|---|
| `router.push('/carrinho')` | põe o carrinho por cima |
| `router.back()` | tira a tela de cima, como o voltar do sistema |
| `router.replace('/')` | troca a tela de cima por outra, sem deixar caminho de volta |

Regra prática: `Link` quando o toque só leva a outra tela; `router` quando a função faz mais alguma coisa antes de navegar.

---

## :icon[navigation] Link e router na prática

Três toques da Lojinha e o código de cada um:

```jsx
<Link href="/carrinho">Ver carrinho</Link>

<Link href="/carrinho" asChild>
  <Botao titulo="Ver carrinho" icone="cart-outline" />
</Link>

<Botao titulo="Continuar comprando" onPress={() => router.back()} />
```

| Toque em | Na tela |
|---|---|
| o texto "Ver carrinho" | o Carrinho entra por cima, com animação |
| o botão "Ver carrinho", no rodapé do Início | o mesmo, com o visual do `Botao` |
| "Continuar comprando", no Carrinho | o Carrinho sai, e o Início aparece onde estava |

---

## Pratique

:::example Desafio
No `Inicio`, a `FlatList` desenha cada produto com o `CartaoProduto`, que já tem o `onAdicionar` do E32 no ícone do carrinho. Escreva o `renderItem` para que tocar no resto do cartão abra `/produto/` seguido do `id` daquele produto.
:::

:::tip Resposta
```jsx
renderItem={({ item }) => (
  <CartaoProduto
    produto={item}
    onPress={() => router.push('/produto/' + item.id)}
    onAdicionar={() => setItens(adicionarItem(itens, item))}
  />
)}
```

A arrow function é obrigatória: `onPress={router.push(...)}` navegaria durante a renderização, antes de qualquer toque. É o mesmo erro do `onClick={avisar()}` do E23. Se o `CartaoProduto` ainda não recebe `onPress`, acrescente a prop e repasse-a a um `Pressable` em volta do cartão.
:::

---

## Rota dinâmica

Doze produtos na loja: são precisos doze arquivos de tela?

---

## :icon[hash] Rota dinâmica: lendo o id

Em `app/produto/[id].js`, o `[id]` é um espaço em branco no endereço, como o espaço do ingrediente numa receita (E07). O valor que chega nele, como o `7` de `/produto/7`, é o **parâmetro**. A tela lê o parâmetro com o hook **`useLocalSearchParams()`** ("use os parâmetros desta rota"):

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

O nome da chave é o nome entre colchetes: `[id]` vira `id`. O `find` do E08 procura o produto com esse `id`.

---

## :icon[circle-alert] O parâmetro é sempre texto

Endereços são texto. Mesmo que você chame `router.push('/produto/' + 7)`, a tela recebe a string `'7'`. No `produtos.js`, o `id` é número, e o `===` do E05 não converte tipos.

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

## :icon[hash] A rota dinâmica na prática

O mesmo arquivo, `app/produto/[id].js`, aberto por três endereços:

```jsx
router.push('/produto/' + 1); // o Fone Bluetooth
router.push('/produto/' + 7); // o Tênis de Corrida
router.push('/produto/99');   // nenhum produto tem o id 99
```

| Endereço | O `id` que chega | Na tela |
|---|---|---|
| `/produto/1` | `'1'` | Fone Bluetooth, R$ 199,90, com o nome no cabeçalho |
| `/produto/7` | `'7'` | Tênis de Corrida, R$ 349,90 |
| `/produto/99` | `'99'` | "Produto não encontrado": o `find` devolveu `undefined`, e o `if (!produto)` cuidou do resto |

Um arquivo, doze produtos e nenhum caso esquecido.

---

## Contexto

Onde a família deixa um recado para que todos da casa leiam?

---

## :icon[shopping-cart] Um carrinho acima da pilha

Um **contexto** é o quadro de avisos da casa: fica num lugar que todos os cômodos enxergam, e todos leem o mesmo aviso. No app, ele fica acima da pilha, e todas as telas leem o mesmo carrinho.

:::center
![Animação: o Detalhe chama adicionar no CarrinhoProvider, que fica acima da pilha; depois itens e total descem até o Carrinho, que mostra R$ 199,90; entre as telas irmãs, props não passam](images/e36-carrinho-no-contexto.svg)
:::

Início, Detalhe e Carrinho são telas irmãs na pilha: props não passam de uma para a outra. A saída é **levantar o estado** (E23) até um contexto, com a receita do tema (E31). O Detalhe chama `adicionar`, e o Carrinho lê `itens` e `total` do mesmo `CarrinhoProvider`.

---

## :icon[shopping-cart] O carrinho já existe, no lugar errado

O **carrinho** é uma lista de itens num estado (o placar do E23). Desde o E32, ele mora num `useState` do Início, e as contas são as regras de `src/regras/carrinho.js` (E07 e E09):

| Regra | O que devolve |
|---|---|
| `adicionarItem(itens, produto)` | lista nova; produto repetido soma 1 na `qtd` |
| `removerItem(itens, id)` | lista nova sem o item |
| `alterarQuantidade(itens, id, qtd)` | lista nova; `qtd` 0 ou menos remove |
| `contarItens(itens)` e `subtotal(itens)` | as unidades e o valor em reais, somado em centavos |

Desde o E17, `adicionarItem` e `alterarQuantidade` **lançam** `EstoqueInsuficienteError` se a quantidade passar do `estoque` do item.

É esse estado que sobe para o contexto. As regras não mudam.

---

## :icon[shopping-cart] CarrinhoContext (1): o estado sobe

O `useState` sai do Início e vai para `src/contexts/CarrinhoContext.js`:

```jsx
import { createContext, useContext, useState } from 'react';
import { Alert } from 'react-native';
import { adicionarItem, alterarQuantidade, contarItens, removerItem, subtotal } from '../regras/carrinho';
import { ErroDeNegocio } from '../modelos/erros';

const CarrinhoContext = createContext(null);

export function CarrinhoProvider({ children }) {
  const [itens, setItens] = useState([]); // o mesmo estado que morava no Início
  const adicionar = (produto) => tentar(() => adicionarItem(itens, produto));
  const alterar = (id, qtd) => tentar(() => alterarQuantidade(itens, id, qtd)); // 0 remove
  const remover = (id) => setItens(removerItem(itens, id));
  const esvaziar = () => setItens([]);
```

Cada ação troca a lista do estado pela que a regra devolve, como o `onAdicionar` do E32. As regras nunca alteram a lista recebida (E09): o React recebe uma lista **nova** e redesenha quem usa o carrinho. As duas que podem lançar o erro de estoque passam pelo `tentar`.

---

## :icon[shopping-cart] CarrinhoContext (2): estoque, valores e hook

O mesmo arquivo, a partir do fim de `esvaziar`. O `tentar` é o "trate o esperado, relance o bug" do E17:

```jsx
  function tentar(regra) {
    try {
      const novos = regra(); // a regra roda aqui, dentro do try
      setItens(novos);
    } catch (erro) {
      if (!(erro instanceof ErroDeNegocio)) throw erro; // bug: relança (E17)
      Alert.alert('Carrinho', erro.message); // esperado: avisa o cliente
    }
  }
  const quantidade = contarItens(itens);
  const total = subtotal(itens);
  const valor = { itens, adicionar, remover, alterar, esvaziar, quantidade, total };
  return <CarrinhoContext.Provider value={valor}>{children}</CarrinhoContext.Provider>;
}
```

```jsx
export function useCarrinho() {
  const valor = useContext(CarrinhoContext);
  if (!valor) throw new Error('useCarrinho fora do CarrinhoProvider');
  return valor;
}
```

- O Tênis tem estoque 1: o segundo Adicionar mostra "Tênis de Corrida: só 1 em estoque." e o carrinho fica como estava. No E39, o aviso vira um toast
- `tentar` recebe uma **função** (E10): com `tentar(adicionarItem(itens, produto))`, a regra rodaria antes do `try`, e o erro derrubaria o app
- No Início, o `useState` sai: `const { adicionar, esvaziar, quantidade, total } = useCarrinho();`, e o `onAdicionar` vira `() => adicionar(item)`

---

## :icon[list-ordered] O CarrinhoContext em português

| Linha | O que ela diz |
|---|---|
| `createContext(null)` | "crie um quadro de avisos, ainda vazio" |
| `CarrinhoProvider({ children })` | "pendure o quadro em volta das telas": `children` são as telas que ficam dentro dele |
| `adicionar`, `alterar`, `remover`, `esvaziar` | "cada ação chama uma regra e troca a lista do estado pela lista nova" |
| `tentar(regra)` | "rode a regra dentro do `try`; falta de estoque vira aviso, e bug é relançado" |
| `valor = { itens, ... }` | "o que fica no quadro: os itens, as ações e as contas" |
| `useCarrinho()` | "leia o quadro"; fora do provedor, avisa com um erro |

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

No `Carrinho`, leia o mesmo contexto. Em cada linha, os botões - e + chamam `alterar`:

```jsx
const { itens, alterar, total } = useCarrinho();

<Botao titulo="+" tamanho="sm" desabilitado={item.qtd >= item.estoque}
  onPress={() => alterar(item.id, item.qtd + 1)} />
<Text style={[estilos.total, { color: cores.texto }]}>Total: {formatarPreco(total)}</Text>
```

Na tela: o carrinho abre por cima do detalhe, já com o fone e "Total: R$ 199,90". Com 1 unidade, o - tira o item, regra do E07; no limite do estoque, o + apaga.

---

## Erros comuns

Tocou no produto e a tela ficou vermelha. O que a mensagem diz?

---

## :icon[siren] Quando aparece um erro

| O que aparece | Quer dizer | O que fazer |
|---|---|---|
| `Cannot read property 'nome' of undefined` | `p.id === id`, sem `Number(id)`, não acha o produto | `p.id === Number(id)` |
| erro com `cores` ao abrir | `useTema()` no mesmo componente do `TemaProvider` | usar um filho, como a `Pilha` |
| o toque não navega | `Link` em volta de um `Pressable`, sem `asChild` | `<Link href="..." asChild>` |
| navega sozinho, ou tela vermelha de estoque | faltou a arrow function: a chamada roda na hora | `() => router.push(...)`; `tentar(() => ...)` |
| o Início e o Carrinho mostram números diferentes | sobrou o `useState` do E32: dois carrinhos | ler de `useCarrinho()` |

---

## Resumo

:::summary
- `app/_layout.js` monta a pilha com `Stack` e põe o `TemaProvider` e o `CarrinhoProvider` por fora dela
- Rotas finas reexportam as telas de `src/telas/`; `app/` só descreve os endereços
- `Link` navega no toque (com `asChild` para botões próprios); `router.push` e `router.back` navegam pelo código
- `useLocalSearchParams` lê o `id` sempre como texto (converta com `Number(id)`), e `Stack.Screen` dentro da tela define o título
- O `CarrinhoContext` recebe o estado que morava no Início e leva a todas as telas as ações e os valores das regras do `carrinho.js`; o estoque esgotado é erro esperado e vira aviso
:::

---

## :icon[flask-conical] No laboratório

Três telas do `lojinha` em pilha:

:::steps
1. Instale o Expo Router, ajuste `main` e `scheme` e rode `npx expo start -c`
2. `app/_layout.js` com provedores, fontes e `Stack`, mais `app/index.js`; apague o `App.js`
3. `CarrinhoContext.js` com o estado do Início e a `Pilha` com as cores do tema
4. `src/telas/Detalhe.js` e `app/produto/[id].js`, com o nome no cabeçalho
5. `src/telas/Carrinho.js` (- e +, total com `formatarPreco`) e `app/carrinho.js`
6. No `Inicio`: `useCarrinho()`, `router.push` no cartão e `Link` no "Ver carrinho"
7. Commit "E36: navegação em pilha e carrinho" e `git push`
:::

**Critérios de entrega**: nome do produto no cabeçalho; carrinho com total formatado; o voltar percorre a pilha; `app/` só com layout e rotas finas; contas só em `src/regras/`. Entregue o link do repositório.

---

## :icon[milestone] Projeto 6 · Etapa 7: pilha de telas e CasasContext

No seu repositório `casas-de-adocao`:

- Expo Router instalado, com o `main` trocado e um `scheme` próprio; o `App.js` sai
- `app/_layout.js` com a pilha, o `TemaProvider` e o `CasasProvider` por fora e o cabeçalho nas cores do tema
- rotas `app/index.js` (Início), `app/casa/[id].js` (Detalhe, com o nome da casa no cabeçalho) e `app/cadastro.js`
- `src/contexts/CasasContext.js` com `casas`, que começam pelas de `src/data/casas.js`, e `adicionar`; o id da casa nova vem de `proximoId(casas)`, em `src/regras/casas.js`
- tocar num `CartaoCasa` abre o Detalhe; Salvar no Cadastro adiciona e volta, e a casa aparece na seção da cidade dela

Commit: `Projeto 6: etapa 7, pilha e CasasContext`. Enunciado completo e entrega: página do curso, em **Projetos**.
