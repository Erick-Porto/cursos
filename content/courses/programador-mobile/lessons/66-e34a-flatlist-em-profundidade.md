---
title: FlatList em profundidade
summary: Cabeçalho, estado vazio, separador, grade, carrossel e paginação na FlatList da Lojinha.
module: layout-rn
duration_minutes: 40
objectives:
  - Compor a FlatList com cabeçalho, rodapé, estado vazio e separador
  - Montar uma grade com numColumns e um carrossel com horizontal
  - Escolher uma key estável e carregar mais itens com paginar e onEndReached
---

# FlatList em profundidade

Programador Mobile · Encontro E34 · Aula 66 de 89

---

## O que você vai aprender

:::goal
- Montar a moldura da lista: cabeçalho, rodapé, estado vazio e separador
- Transformar a lista em uma grade de 2 colunas com `numColumns`
- Criar um carrossel de destaques com `horizontal`
- Escolher uma key estável e carregar mais produtos com o `paginar` do E14 e `onEndReached`
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **key** | o crachá de cada item da lista: um texto único que diz quem ele é |
| **cabeçalho e rodapé** | o que aparece antes do primeiro item e depois do último |
| **estado vazio** | o que a lista mostra quando não tem nenhum item |
| **grade** | itens lado a lado, em linhas e colunas |
| **carrossel** | uma fileira de itens que rola para o lado |
| **paginação** | trazer os itens aos poucos, uma página de cada vez |

---

## Uma vitrine é feita de listas

Abra o app de uma grande loja ou de delivery. No topo, um carrossel de ofertas que desliza para o lado. Embaixo, uma grade de produtos em 2 colunas. No fim, uma rodinha de "carregando mais" enquanto você rola. Buscou e não achou nada? Aparece uma mensagem e um botão para limpar a busca.

Tudo isso é a mesma `FlatList`, com props diferentes.

:::question
Na tela Início que você vai montar hoje, quantas listas existem? Qual delas rola para o lado?
:::

---

## A FlatList

Por que a esteira do caixa não leva o carrinho inteiro de uma vez?

---

## :icon[list] Anatomia da FlatList

A **`FlatList`** do E28 é uma esteira: só desenha o que cabe na tela. Lá, a lista de tarefas usou `data`, `renderItem` e `keyExtractor`, e mostrou de passagem o cabeçalho e o estado vazio. A `FlatList` tem dezenas de props; estas são as de hoje, em quatro grupos:

| Grupo | Props | Responde |
|---|---|---|
| Dados | `data`, `renderItem`, `keyExtractor` | o que mostrar e como identificar |
| Moldura | `ListHeaderComponent`, `ListFooterComponent`, `ListEmptyComponent`, `ItemSeparatorComponent` | o que fica em volta dos itens |
| Forma | `numColumns`, `columnWrapperStyle`, `horizontal` | lista, grade ou carrossel |
| Rolagem | `onEndReached`, `onEndReachedThreshold` | o que fazer perto do fim |

---

## :icon[file-code] A base com os produtos da Lojinha

```jsx
import { FlatList } from 'react-native';
import CartaoProduto from '../components/CartaoProduto';
import { produtos } from '../data/produtos';

// dentro do return da tela
<FlatList
  data={produtos}
  keyExtractor={(item) => String(item.id)}
  renderItem={({ item }) => <CartaoProduto produto={item} />}
/>
```

- `produtos` é o de `src/data/produtos.js`, que veio do `lojinha-regras` com a pasta `src/` no E30
- `renderItem` recebe `{ item, index }`; aqui só o `item` interessa
- O `CartaoProduto` recebe o produto inteiro pela prop `produto`
- Na tela: os 12 produtos empilhados, um cartão por linha, rolando na vertical

---

## Key estável

Numa festa, como a portaria sabe quem é quem, mesmo quando as pessoas trocam de lugar?

---

## :icon[key] Key estável: a identidade do item

A **key** é o crachá do item: um texto único que diz quem ele é. A `FlatList` usa a key para saber **qual cartão é qual** entre um desenho e outro. Se a key muda, a lista joga o cartão fora e cria outro.

| keyExtractor | Resultado |
|---|---|
| `(item) => String(item.id)` | estável: o id vem do dado e nunca muda |
| `(item, index) => String(index)` | quebra ao filtrar ou reordenar: cartões trocam de produto |
| `() => String(Math.random())` | muda a cada desenho: tudo é recriado e as imagens piscam |

Use um campo do dado que nunca se repete, como `id` ou `slug`, sempre como **string**: o `String(...)` faz do número um texto.

---

## :icon[key] Key na prática

Cada lista usa o campo que identifica o item e nunca se repete:

**1. Produtos:** o `id`, um número, vira texto.

```jsx
keyExtractor={(item) => String(item.id)}
```

**2. Categorias:** o `slug`, que já é texto e não se repete.

```jsx
keyExtractor={(item) => item.slug}
```

**3. Buscas recentes, a lista sem repetição do E08:** o próprio texto da busca.

```jsx
keyExtractor={(item) => item}
```

Na tela, nada parece mudar. A diferença aparece ao filtrar ou reordenar: cada cartão continua com o seu produto, e as fotos não piscam.

---

## A moldura

Num álbum de fotos, o que vem antes da primeira foto e depois da última?

---

## :icon[rows-3] Cabeçalho e rodapé que rolam junto

A **moldura** da lista é o que fica em volta dos itens. Pense num álbum de fotos: a capa vem antes da primeira foto, e a contracapa depois da última. Na `FlatList`, `ListHeaderComponent` aparece antes do primeiro item; `ListFooterComponent`, depois do último. Os dois **rolam com a lista**.

```jsx
<FlatList
  data={produtos}
  keyExtractor={(item) => String(item.id)}
  renderItem={({ item }) => <CartaoProduto produto={item} />}
  ListHeaderComponent={<Text style={estilos.titulo}>Todos os produtos</Text>}
  ListFooterComponent={<Text style={estilos.fim}>Você viu tudo</Text>}
/>
```

As duas props aceitam um elemento, como `<Text>...</Text>`, ou um componente, como `Titulo`.

:::tip
Precisa de um título que role junto com os produtos? Ele vai no `ListHeaderComponent`, nunca em uma `ScrollView` em volta da lista.
:::

---

## Lista vazia

A busca não achou nada: tela em branco ou um aviso?

---

## :icon[package] ListEmptyComponent: a lista sem dados

O **estado vazio** é o que a lista mostra quando não tem nenhum item. O `buscarProdutos` do E14 não achou nada para "geladeira", ou a API devolveu um array vazio: `data` chega como `[]`. Sem tratamento, a lista não mostra nada: tela em branco, e o usuário acha que o app travou. O **`ListEmptyComponent`** aparece só nessa hora. Mostre o motivo e, se der, uma saída:

```jsx
<FlatList
  data={resultado}
  // keyExtractor e renderItem como antes
  ListEmptyComponent={
    <View style={estilos.vazio}>
      <Text style={estilos.textoVazio}>Nenhum produto encontrado</Text>
      <Botao titulo="Limpar busca" variante="secundaria" onPress={limparBusca} />
    </View>
  }
  contentContainerStyle={{ flexGrow: 1 }}
/>
```

Com `flexGrow: 1`, o conteúdo ocupa a altura toda da lista. Assim, `vazio: { flex: 1, justifyContent: 'center', alignItems: 'center' }` põe a mensagem no meio da tela.

---

## :icon[package] Lista vazia na prática

Cada lista vazia diz o motivo e, quando dá, oferece uma saída:

**1. Carrinho vazio:** um convite para voltar às compras.

```jsx
ListEmptyComponent={
  <View style={estilos.vazio}>
    <Text style={estilos.textoVazio}>Seu carrinho está vazio</Text>
    <Botao titulo="Ver produtos" onPress={verProdutos} />
  </View>
}
```

**2. Filtro de preço sem resultado:** só o motivo, em uma linha.

```jsx
ListEmptyComponent={<Text style={estilos.textoVazio}>Nenhum produto até R$ 50</Text>}
```

**3. Favoritos ainda vazios:** um ícone e a explicação de como encher a lista.

```jsx
ListEmptyComponent={
  <View style={estilos.vazio}>
    <Ionicons name="heart-outline" size={48} color={cores.textoSuave} />
    <Text style={estilos.textoVazio}>Toque no coração de um produto para guardar aqui</Text>
  </View>
}
```

---

## Separador

Margem embaixo de cada cartão: o que sobra depois do último?

---

## :icon[minus] ItemSeparatorComponent: o espaço entre itens

O **separador** é a folha de papel fino entre as fotos do álbum: um componente desenhado **entre** cada par de itens, nunca antes do primeiro nem depois do último.

```jsx
<FlatList
  data={produtos}
  // keyExtractor e renderItem como antes
  ItemSeparatorComponent={() => <View style={estilos.separador} />}
/>

// no StyleSheet, com espaco importado de src/theme/tokens.js
separador: { height: espaco.md },
```

| `marginBottom` no cartão | `ItemSeparatorComponent` |
|---|---|
| sobra espaço depois do último item | espaço só entre os itens |
| o cartão precisa saber onde está | o cartão não sabe; a lista cuida |

Para uma linha fina em vez de espaço, troque a `View` pelo `<Divisor />` do seu UI kit.

---

## Pratique

:::example Desafio
Esta lista tem a moldura inteira, mas a busca não achou nada:

```jsx
<FlatList
  data={[]}
  renderItem={({ item }) => <CartaoProduto produto={item} />}
  ListHeaderComponent={<Text>Resultados</Text>}
  ListFooterComponent={<Text>Fim da lista</Text>}
  ListEmptyComponent={<Text>Nenhum produto encontrado</Text>}
  ItemSeparatorComponent={() => <View style={estilos.separador} />}
/>
```

Quais destes aparecem na tela: o cabeçalho, o rodapé, o estado vazio, o separador?
:::

:::tip Resposta
O cabeçalho, o estado vazio e o rodapé, nessa ordem. O separador não aparece: sem itens, não há nada para separar.
:::

---

## Grade

Como os ovos ficam arrumados na caixa?

---

## :icon[layout-grid] Grade com numColumns

Uma **grade** põe os itens lado a lado, em linhas e colunas, como uma caixa de ovos: cada linha tem o mesmo número de lugares. `numColumns={2}` distribui os itens em linhas de dois. Cada célula envolve o cartão numa `View` que divide a largura:

```jsx
<FlatList
  data={produtos}
  numColumns={2}
  keyExtractor={(item) => String(item.id)}
  renderItem={({ item }) => (
    <View style={estilos.celula}>
      <CartaoProduto produto={item} />
    </View>
  )}
  columnWrapperStyle={estilos.linha}
  ItemSeparatorComponent={() => <View style={estilos.separador} />}
/>
```

```jsx
linha: { gap: espaco.md },   // espaço entre as duas colunas
celula: { flex: 1 },         // as duas células dividem a largura
```

Na tela: 6 linhas com 2 cartões lado a lado, separadas por 16 na vertical e na horizontal.

---

## :icon[columns-3] Como a grade se monta

Com 12 produtos e `numColumns={2}`, a lista agrupa os itens de dois em dois, cada par numa `View` em `row` que ela mesma cria: `produtos[0]` e `produtos[1]` na linha 1, e assim até a linha 6.

:::center
![Diagrama: os 12 produtos viram 6 linhas de dois; o columnWrapperStyle estiliza cada linha e o ItemSeparatorComponent fica só entre as linhas](images/e34-grade-numcolumns.svg)
:::

Três regras saem daí:

- `columnWrapperStyle` estiliza a linha e só existe com `numColumns` maior que 1
- `ItemSeparatorComponent` aparece entre as **linhas**, não entre as células
- `numColumns` não muda com a lista na tela: para passar de 2 para 3 colunas, troque também a `key` da `FlatList`: `key={'grade-' + colunas}`

---

## :icon[layout-grid] Grade na prática

**1. Celular em pé:** duas colunas, cada célula com metade da largura.

```jsx
numColumns={2}
```

**2. Número ímpar de produtos:** a célula ganha um limite, e o último cartão fica com meia largura, em vez de esticar na linha toda.

```jsx
celula: { flex: 1, maxWidth: '50%' },
```

**3. Trocar de 2 para 3 colunas, num tablet:** a `key` da lista muda junto, e o React monta outra lista.

```jsx
<FlatList key={'grade-' + colunas} numColumns={colunas} /* demais props */ />
```

No E38, a largura da tela escolhe as colunas, e essa `key` volta.

---

## Carrossel

Como você vê as ofertas que não cabem na largura da tela?

---

## :icon[arrow-left-right] Carrossel de destaques com horizontal

Um **carrossel** é uma lista deitada: os itens ficam lado a lado, e o dedo rola para o lado. A prop `horizontal` faz isso.

```jsx
const destaques = produtos.filter((p) => p.destaque);

<FlatList
  data={destaques}
  horizontal
  showsHorizontalScrollIndicator={false}
  keyExtractor={(item) => String(item.id)}
  renderItem={({ item }) => (
    <View style={estilos.destaque}>
      <CartaoProduto produto={item} />
    </View>
  )}
  contentContainerStyle={estilos.carrossel}
/>
```

- `destaques` é a peneira do E09: fica só o que tem `destaque: true`
- `destaque: { width: 160 }`: na horizontal, o item precisa de **largura fixa**
- `showsHorizontalScrollIndicator={false}` esconde a barrinha de rolagem
- `carrossel: { gap: espaco.md }` afasta os cartões
- `horizontal` não combina com `numColumns`: carrossel tem uma linha só

---

## :icon[layers] O carrossel dentro do cabeçalho da grade

A tela Início tem as duas listas. Para rolarem juntas, o carrossel entra no `ListHeaderComponent` da grade:

```jsx
const cabecalho = (
  <View>
    <Text style={estilos.secao}>Destaques</Text>
    <FlatList horizontal data={destaques} /* demais props do carrossel */ />
    <Text style={estilos.secao}>Todos os produtos</Text>
  </View>
);

<FlatList
  data={produtos}
  numColumns={2}
  ListHeaderComponent={cabecalho}
  // demais props da grade
/>
```

O `cabecalho` é um elemento pronto, guardado numa `const`: a grade o desenha antes do primeiro produto.

---

## :icon[layers] A tela Início por dentro

:::center
![Diagrama: na tela Início, o ListHeaderComponent da grade guarda o título Destaques, o carrossel horizontal e o título Todos os produtos; o carrossel rola para o lado, e a grade de 2 colunas rola para baixo levando o cabeçalho junto](images/e34-carrossel-e-grade.svg)
:::

O carrossel rola para o lado; a grade rola para baixo e leva o cabeçalho junto.

Lista horizontal dentro de lista vertical é permitido: as rolagens têm direções diferentes e não brigam. O proibido é vertical dentro de vertical, como uma `FlatList` dentro de uma `ScrollView`.

---

## Carregar mais

Você lê um livro de 300 páginas todas de uma vez?

---

## :icon[arrow-down] Carregar mais ao chegar no fim

**Paginação** é trazer os itens aos poucos, como as páginas de um livro: você lê uma e vira a próxima. Catálogos grandes chegam assim: 6 produtos agora, mais 6 quando o usuário se aproxima do fim. A conta da página você já escreveu: o `paginar` do E14, em `src/regras/catalogo.js`.

```jsx
import { paginar } from '../regras/catalogo';

const [pagina, setPagina] = useState(1);
const [visiveis, setVisiveis] = useState(paginar(produtos, 1)); // 6 por página

function carregarMais() {
  const proxima = paginar(produtos, pagina + 1);
  if (proxima.length === 0) return; // acabou o catálogo
  setVisiveis([...visiveis, ...proxima]);
  setPagina(pagina + 1);
}

<FlatList data={visiveis} onEndReached={carregarMais} onEndReachedThreshold={0.5} />
```

---

## :icon[list-ordered] O carregarMais em português

| Linha | O que ela diz |
|---|---|
| `useState(1)` e `paginar(produtos, 1)` | começa na página 1, com os 6 primeiros produtos |
| `paginar(produtos, pagina + 1)` | "pegue a página seguinte" |
| `if (proxima.length === 0) return` | "veio vazia? Acabou o catálogo: pare aqui" |
| `[...visiveis, ...proxima]` | "uma lista nova com os que já estão na tela **e** os novos": o spread do E09 **junta** as páginas |
| `onEndReached={carregarMais}` | "perto do fim, chame `carregarMais`" |
| `onEndReachedThreshold={0.5}` | "perto" é a meia tela que falta para o fim |

Prévia: no E42, a próxima página vem da DummyJSON, pelo `listarProdutos({ limite, pular })` do E19, com uma `ActivityIndicator` (a rodinha nativa) no `ListFooterComponent`.

---

## :icon[arrow-down] Carregar mais na prática

Com os 12 produtos da Lojinha e páginas de 6:

```javascript
paginar(produtos, 1); // os 6 primeiros: do Fone Bluetooth ao Jogo de Panelas
paginar(produtos, 2); // os 6 seguintes: do Tênis de Corrida ao Guia de Viagem
paginar(produtos, 3); // []: acabou o catálogo
```

O que acontece na tela enquanto o usuário rola:

| Momento | `pagina` | Produtos na tela |
|---|---|---|
| Ao abrir | 1 | 6 |
| Chegou perto do fim | 2 | 12: a página 2 foi juntada à 1 |
| Chegou perto do fim de novo | 2 | 12: a página 3 veio vazia, e o `return` parou |

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Changing numColumns on the fly is not supported` | o número de colunas mudou com a lista na tela | trocar a `key` da `FlatList` junto: `key={'grade-' + colunas}` |
| `columnWrapperStyle not supported for single column lists` | `columnWrapperStyle` numa lista de uma coluna, como o carrossel | no carrossel, `gap` no `contentContainerStyle` |
| `VirtualizedLists should never be nested` (aviso amarelo) | lista vertical dentro de uma `ScrollView` vertical | tirar a `ScrollView`; o que rola junto vai no `ListHeaderComponent` |

---

## :icon[triangle-alert] Erros comuns

Estes não mostram mensagem nenhuma:

:::warning
- Key pelo índice ou por `Math.random()`: cartões trocam de produto ao filtrar e as imagens piscam
- Grade com número ímpar de itens: o último cartão estica na linha inteira; limite a célula com `maxWidth: '50%'`
- Carrossel sem largura fixa no item: cada cartão fica de um tamanho
:::

---

## Resumo

:::summary
- A moldura vem de props: `ListHeaderComponent`, `ListFooterComponent`, `ListEmptyComponent` e `ItemSeparatorComponent`
- Lista vazia nunca é tela em branco: explique o motivo e ofereça uma saída
- `numColumns` monta a grade e `columnWrapperStyle` estiliza cada linha; trocar as colunas exige trocar a `key`
- `horizontal`, com item de largura fixa, monta o carrossel, que pode morar no cabeçalho da grade
- A key vem de um campo único do dado, como string; `onEndReached` com o `paginar` do E14 carrega mais uma página
:::

---

## :icon[arrow-right] Próximos passos

A tela Início ficou pronta para muitos produtos. A tela Categorias pede outra forma: produtos **agrupados**, com o nome da categoria separando cada grupo.

Na aula 67, você aprende:

- :icon[list-tree] `SectionList`, com seções montadas a partir de `produtos` e `categorias`
- :icon[refresh-cw] puxar para atualizar com `RefreshControl`
- :icon[gauge] o que a lista renderiza de verdade e como medir antes de otimizar
