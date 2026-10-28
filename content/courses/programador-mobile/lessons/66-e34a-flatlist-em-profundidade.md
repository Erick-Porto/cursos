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

## Uma vitrine é feita de listas

Abra o app de uma grande loja ou de delivery. No topo, um carrossel de ofertas que desliza para o lado. Embaixo, uma grade de produtos em 2 colunas. No fim, uma rodinha de "carregando mais" enquanto você rola. Buscou e não achou nada? Aparece uma mensagem e um botão para limpar a busca.

Tudo isso é a mesma `FlatList`, com props diferentes.

:::question
Na tela Início que você vai montar hoje, quantas listas existem? Qual delas rola para o lado?
:::

---

## :icon[list] Anatomia da FlatList

No E28, a lista de tarefas usou `data`, `renderItem` e `keyExtractor`, e mostrou de passagem o cabeçalho e o estado vazio. A `FlatList` tem dezenas de props; estas são as que importam hoje, em quatro grupos:

| Grupo | Props | Responde |
|---|---|---|
| Dados | `data`, `renderItem`, `keyExtractor` | o que mostrar e como identificar |
| Moldura | `ListHeaderComponent`, `ListFooterComponent`, `ListEmptyComponent`, `ItemSeparatorComponent` | o que fica em volta dos itens |
| Forma | `numColumns`, `columnWrapperStyle`, `horizontal` | lista, grade ou carrossel |
| Rolagem | `onEndReached`, `onEndReachedThreshold` | o que fazer perto do fim |

Pense numa vitrine: os produtos são os itens; a placa no alto, as divisórias e o aviso de "vitrine vazia" são a moldura.

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

## :icon[key] Key estável: a identidade do item

A `FlatList` usa a key para saber **qual cartão é qual** entre um desenho e outro. Se a key de um item muda, ela joga o cartão fora e cria outro do zero.

| keyExtractor | Resultado |
|---|---|
| `(item) => String(item.id)` | estável: o id vem do dado e nunca muda |
| `(item, index) => String(index)` | quebra ao filtrar ou reordenar: cartões trocam de produto |
| `() => String(Math.random())` | muda a cada desenho: tudo é recriado e as imagens piscam |

Use um campo do próprio dado que nunca se repete, como `id` ou `slug`, e devolva sempre uma **string**.

---

## :icon[rows-3] Cabeçalho e rodapé que rolam junto

`ListHeaderComponent` aparece antes do primeiro item; `ListFooterComponent`, depois do último. Os dois **rolam com a lista**.

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

## Pense

:::question
O `buscarProdutos` do E14 não achou nada para "geladeira", ou a API devolveu um array vazio. `data` chega como `[]`.

O que a lista mostra para o usuário? E o que ela **deveria** mostrar?
:::

---

## :icon[package] ListEmptyComponent: a lista sem dados

:::tip Resposta
Sem tratamento, a lista não mostra nada: tela em branco, e o usuário acha que o app travou. Mostre o motivo e, se der, uma saída.
:::

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

## :icon[minus] ItemSeparatorComponent: o espaço entre itens

Um componente desenhado **entre** cada par de itens: nunca antes do primeiro nem depois do último.

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

## :icon[layout-grid] Grade com numColumns

`numColumns={2}` distribui os itens em linhas de dois. Cada célula envolve o cartão numa `View` que divide a largura:

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

## :icon[arrow-left-right] Carrossel de destaques com horizontal

`horizontal` deita a lista: os itens ficam lado a lado e o dedo rola para o lado.

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

---

## :icon[layers] A tela Início por dentro

:::center
![Diagrama: na tela Início, o ListHeaderComponent da grade guarda o título Destaques, o carrossel horizontal e o título Todos os produtos; o carrossel rola para o lado, e a grade de 2 colunas rola para baixo levando o cabeçalho junto](images/e34-carrossel-e-grade.svg)
:::

O carrossel rola para o lado; a grade rola para baixo e leva o cabeçalho junto.

Lista horizontal dentro de lista vertical é permitido: as rolagens têm direções diferentes e não brigam. O proibido é vertical dentro de vertical, como uma `FlatList` dentro de uma `ScrollView`.

---

## :icon[arrow-down] Carregar mais ao chegar no fim

Catálogos grandes chegam em **páginas**: 6 produtos agora, mais 6 quando o usuário se aproxima do fim. A conta da página você já escreveu: o `paginar` do E14, em `src/regras/catalogo.js`.

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

- `onEndReached`: chamada quando falta `onEndReachedThreshold` para o fim; `0.5` é **meia tela**
- O spread do E09 **junta** a página nova às que já estão na tela
- Prévia: no E42, a próxima página vem da DummyJSON, pelo `listarProdutos({ limite, pular })` do E19, com uma `ActivityIndicator` (a rodinha nativa) no `ListFooterComponent`

---

## :icon[triangle-alert] Erros comuns

:::warning
- Key pelo índice ou por `Math.random()`: cartões trocam de produto ao filtrar e as imagens piscam
- Mudar `numColumns` com a lista na tela: tela vermelha `Changing numColumns on the fly is not supported`; troque a `key` junto
- `columnWrapperStyle` em lista de uma coluna: tela vermelha, porque ele só vale com `numColumns` maior que 1
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
