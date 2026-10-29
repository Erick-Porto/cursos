---
title: SectionList, puxar para atualizar e desempenho
summary: Agrupe produtos por categoria, atualize a lista com um gesto e entenda o que a virtualização desenha.
module: layout-rn
duration_minutes: 40
objectives:
  - Agrupar produtos por categoria com SectionList
  - Implementar o gesto de puxar para atualizar
  - Explicar a virtualização e medir antes de otimizar
---

# SectionList, puxar para atualizar e desempenho

Programador Mobile · Encontro E34 · Aula 67 de 89

---

## O que você vai aprender

:::goal
- Montar o array `sections` a partir de `produtos` e `categorias`
- Mostrar cabeçalhos de seção que ficam fixos no topo ao rolar
- Atualizar a lista com o gesto de puxar para baixo
- Explicar o que a lista desenha de verdade e medir antes de otimizar
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **seção** | um grupo da lista, com título próprio: "Áudio", "Casa" |
| **cabeçalho fixo** | o título da seção que fica preso no topo enquanto você rola |
| **puxar para atualizar** | o gesto de puxar a lista para baixo para buscar dados novos |
| **virtualização** | desenhar só os itens perto da tela, e não a lista inteira |
| **FPS** | quadros por segundo (*frames per second*): quantas vezes a tela se redesenha por segundo |
| **otimizar** | mudar o código para ele ficar mais rápido ou gastar menos |

---

## Listas com grupos e dados que mudam

Abra a agenda de contatos: nomes agrupados por letra, e a letra atual fica presa no topo enquanto você rola. No app do banco, o extrato vem agrupado por dia; você puxa a tela para baixo, aparece uma rodinha e as transações novas chegam.

A tela Categorias da Lojinha precisa das duas coisas: produtos agrupados por categoria e um jeito de buscar a versão mais nova do catálogo.

:::question
Com uma `FlatList`, dá para mostrar o título "Áudio" antes dos fones e "Casa" antes dos itens de casa? Qual seria o custo?
:::

---

## SectionList

Como o cardápio separa as entradas das bebidas?

---

## :icon[list-tree] SectionList: uma lista de grupos

A **`SectionList`** é uma lista dividida em grupos, as **seções**. Pense num cardápio: cada seção (Entradas, Pratos, Bebidas) tem um título e a sua própria lista de itens. Ela recebe a prop `sections`: um array de seções, cada uma com um `title` e o seu próprio `data`.

```javascript
const secoes = [
  { title: 'Áudio', data: [/* os 3 produtos de áudio */] },
  { title: 'Casa', data: [/* os 3 produtos de casa */] },
  { title: 'Esporte', data: [/* ... */] },
  { title: 'Livros', data: [/* ... */] },
];
```

| Chave | Obrigatória? | Para que serve |
|---|---|---|
| `data` | sim, com esse nome | o array de itens que a lista percorre na seção |
| `title` | não; é convenção | o texto que você lê de volta no cabeçalho |

---

## :icon[list-tree] SectionList na prática

Três listas com grupos, sempre no mesmo formato, `{ title, data }`:

**1. Categorias da Lojinha:** um grupo por categoria.

```javascript
{ title: 'Áudio', data: [/* Fone Bluetooth, Caixa de Som Portátil, Microfone USB */] }
```

**2. Extrato do banco:** um grupo por dia.

```javascript
{ title: 'Hoje', data: [/* Pix recebido, Mercado, Farmácia */] }
```

**3. Projeto 6:** um grupo por cidade.

```javascript
{ title: 'Campinas, SP', data: [/* as 3 casas de Campinas */] }
```

Na tela: o título do grupo e, logo abaixo, os itens dele. Muda só o que vai dentro do `title` e do `data`.

---

## Montar as seções

Os produtos chegam todos misturados. Como separar por categoria?

---

## :icon[braces] Montando as seções a partir dos dados

Os dados da Lojinha não vêm agrupados: em `src/data/produtos.js`, `categorias` e `produtos` são arrays separados. Para cada categoria, filtre os produtos dela:

```javascript
import { categorias, produtos } from '../data/produtos';

const secoes = categorias.map((categoria) => ({
  title: categoria.nome,
  data: produtos.filter((p) => p.categoria === categoria.slug),
}));
```

:::center
![Animação: o map percorre as 4 categorias e monta uma seção de cada vez, Áudio, Casa, Esporte e Livros; o title vem do nome, e o data recebe do filter os 3 produtos com aquele slug](images/e34-categorias-viram-secoes.svg)
:::

São o `map` e o `filter` do E09. O `map` é a linha de produção: as 4 categorias entram e saem 4 seções. O `filter` é a peneira: fica só o produto cujo campo `categoria` é igual ao `slug` da categoria.

---

## :icon[list-ordered] As seções em português

| Linha | O que ela diz |
|---|---|
| `categorias.map((categoria) => (...))` | "para cada categoria, monte uma seção" |
| `({ ... })` | os parênteses em volta das chaves fazem a arrow function devolver um objeto |
| `title: categoria.nome` | o título é o nome feito para ler: `'Áudio'` |
| `produtos.filter((p) => ...)` | "dos produtos, fique com os desta categoria" |
| `p.categoria === categoria.slug` | o teste da peneira: o `slug` (`'audio'`) é feito para comparar |

Sem os parênteses, as chaves viram um bloco de código, e não um objeto: aqui, com dois campos, aparece um `SyntaxError`.

---

## Pratique

:::example Desafio (3 min)
Um filtro de preço deixou a categoria Livros sem produtos. A seção aparece só com o título, vazia.

Encadeie mais um passo depois do `map` para tirar as seções vazias.
:::

:::tip Resposta
```javascript
const secoes = categorias
  .map((c) => ({
    title: c.nome,
    data: produtos.filter((p) => p.categoria === c.slug),
  }))
  .filter((s) => s.data.length > 0);
```

O segundo `filter` recebe as seções prontas e mantém só as que têm ao menos um produto.
:::

---

## Desenhar as seções

Uma lista, dois desenhos: o do produto e o do título de cada grupo.

---

## :icon[rows-3] renderItem e renderSectionHeader

A `SectionList` desenha duas coisas: cada item, com o `renderItem`, e o título de cada seção, com o **`renderSectionHeader`**.

```jsx
<SectionList
  sections={secoes}
  keyExtractor={(item) => String(item.id)}
  renderItem={({ item }) => <CartaoProduto produto={item} />}
  renderSectionHeader={({ section }) => (
    <Text style={estilos.secao}>
      {section.title} ({section.data.length})
    </Text>
  )}
/>
```

- `renderItem` funciona como na `FlatList`: recebe `{ item }` e também `section`, a seção do item
- `renderSectionHeader` recebe `{ section }`: o objeto inteiro, com `title` e `data`
- `keyExtractor` vale para os itens de todas as seções; os ids não se repetem entre categorias

Na tela: "Áudio (3)", três cartões, "Casa (3)", mais três, e assim até Livros.

---

## Cabeçalho fixo

Na agenda do celular, por que a letra fica presa no topo enquanto você rola?

---

## :icon[pin] Cabeçalhos fixos no topo

::::columns
:::col
![Animação: a lista rola, Áudio (3) fica preso no topo enquanto os itens passam por baixo, até Casa (3) subir, empurrá-lo e ocupar o lugar](images/e34-cabecalho-fixo.svg)
:::
:::col
Um **cabeçalho fixo** fica preso no topo enquanto você rola. Com **`stickySectionHeadersEnabled`** (*sticky* é "grudento"), o título da seção atual gruda no topo até ser empurrado pelo da seção seguinte. É a letra da agenda de contatos.
:::
::::

```jsx
<SectionList
  sections={secoes}
  // keyExtractor, renderItem e renderSectionHeader como antes
  stickySectionHeadersEnabled
/>
```

O padrão é ligado no iOS e desligado no Android. Escreva a prop sempre: assim as duas plataformas se comportam igual.

:::warning
Cabeçalho fixo precisa de **cor de fundo**. Sem ela, os cartões aparecem por trás do título ao rolar.
:::

---

## Puxar para atualizar

O que você faz no app do banco para ver se o Pix já caiu?

---

## :icon[refresh-cw] Puxar para atualizar

**Puxar para atualizar** é o gesto de puxar a lista para baixo e soltar: aparece uma rodinha, e o app busca os dados novos. Ele pede duas coisas: **se** a lista está atualizando e **o que fazer** quando o usuário puxa.

```jsx
const [atualizando, setAtualizando] = useState(false);

function atualizar() {
  setAtualizando(true);
  setTimeout(() => {
    // aqui entraria a busca dos dados novos
    setAtualizando(false);
  }, 1500);
}

<SectionList sections={secoes} refreshing={atualizando} onRefresh={atualizar} />
```

- `onRefresh`: chamada quando o usuário puxa e solta
- `refreshing`: enquanto for `true`, a rodinha gira no topo. É estado, o placar do E23: quando muda, a tela se redesenha
- O `setTimeout` do E18 simula 1,5 s de rede; quem desliga a rodinha é você, com `false`

---

## :icon[refresh-cw] Quem desliga a rodinha

A lista não desliga a rodinha sozinha, nem quando os dados novos chegam. A sequência é sempre esta:

:::steps
1. O usuário puxa e solta: a lista chama `atualizar`
2. `setAtualizando(true)`: a rodinha aparece
3. A busca acontece (hoje, o `setTimeout` de 1,5 s)
4. `setAtualizando(false)`: a rodinha some
:::

Sem o passo 4, a rodinha gira para sempre.

Prévia do E42: a busca na API entra no lugar do `setTimeout`, com `await`, e o `setAtualizando(false)` vai para o `finally` do E17. Assim a rodinha para mesmo quando a rede falha.

---

## :icon[sliders-horizontal] RefreshControl: a rodinha com a cor do tema

`refreshing` e `onRefresh` são um atalho. Por baixo, a lista usa o **`RefreshControl`**, que você pode passar na prop `refreshControl` para personalizar:

```jsx
import { RefreshControl } from 'react-native';

<SectionList
  sections={secoes}
  // keyExtractor e renderizações como antes
  refreshControl={
    <RefreshControl
      refreshing={atualizando}
      onRefresh={atualizar}
      colors={[cores.primaria]} // Android
      tintColor={cores.primaria} // iOS
    />
  }
/>
```

`cores` vem do `useTema()`. O mesmo `RefreshControl` funciona em uma `ScrollView`, que não tem o atalho. Na lista, use o atalho ou o `refreshControl`, nunca os dois.

---

## Virtualização

Se a lista tem mil produtos, o celular precisa desenhar os mil?

---

## :icon[eye] O que a lista renderiza de verdade

A `FlatList` e a `SectionList` são esteiras: só desenham o que cabe na tela. Isso se chama **virtualização**: a lista monta só os itens de uma janela em volta da área visível e desmonta os que ficam longe dela.

Para ver, coloque um `console.log` no `renderItem` e abra uma lista com 1.000 produtos:

```jsx
renderItem={({ item }) => {
  console.log('desenhando', item.id);
  return <CartaoProduto produto={item} />;
}}
```

O terminal não mostra 1.000 linhas.

- Na abertura: os 10 primeiros, para a tela aparecer logo
- Logo depois: em lotes, os que cabem em cerca de 10 telas abaixo
- Ao rolar: monta os que vão entrar na janela e desmonta os que saíram
- Rolou rápido demais? Espaços em branco por um instante: a lista ainda está desenhando

---

## :icon[gauge] As alavancas da virtualização

| Prop | Padrão | O que controla |
|---|---|---|
| `initialNumToRender` | 10 | quantos itens o primeiro desenho monta |
| `maxToRenderPerBatch` | 10 | quantos itens cada lote monta ao rolar |
| `windowSize` | 21 | tamanho da janela, em telas: 10 acima, a visível e 10 abaixo |

Janela menor: menos memória e abertura mais rápida, mas mais espaços em branco ao rolar rápido. Janela maior: o contrário.

```jsx
<FlatList
  data={produtos}
  // keyExtractor e renderItem como antes
  initialNumToRender={6}
  windowSize={7}
/>
```

Os padrões servem para a maioria das listas. Mexa neles só depois de medir.

---

## Duas otimizações

Num prédio de andares iguais, precisa medir para saber a altura do décimo?

---

## :icon[zap] getItemLayout e React.memo

**Otimizar** é mudar o código para ele ficar mais rápido. Estas duas você vai encontrar em projetos maiores. Por enquanto, saiba que existem e quando ajudam.

```jsx
const ALTURA = 120; // todo item mede exatamente isso, separador incluído

<FlatList
  // demais props como antes
  getItemLayout={(data, index) => ({ length: ALTURA, offset: ALTURA * index, index })}
/>
```

- **`getItemLayout`**: pense num prédio com andares da mesma altura: o 10º andar fica a 10 alturas do chão, sem medir. Com altura fixa, a lista calcula a posição de cada item em vez de medir; rolar até um item distante fica instantâneo. Com altura variável, a conta sai errada
- **`React.memo`**: `export default memo(CartaoProduto)`, com `memo` importado de `react`, faz o cartão só redesenhar quando as props mudam

---

## Medir primeiro

O médico receita o remédio antes ou depois do exame?

---

## :icon[activity] Meça antes de otimizar

O médico examina antes de receitar. No código é igual: otimizar no escuro deixa o código mais difícil sem garantia de ganho. Siga a ordem:

:::steps
1. Reproduza: gere 1.000 produtos e role rápido no celular de verdade
2. Meça: abra o menu do desenvolvedor, ligue o monitor de desempenho e observe os FPS de UI e de JS (60 é liso)
3. Ache a causa: imagem grande demais? Cartão pesado? Key instável?
4. Mude **uma** coisa e meça de novo
5. Não melhorou? Desfaça a mudança
:::

O modo de desenvolvimento é mais lento que o app publicado. Compare medidas feitas do mesmo jeito, no mesmo aparelho.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Seção sem a chave `data` (como `itens` ou `produtos`): a `SectionList` quebra ao ler a seção, com `Cannot read property 'length' of undefined`
- Cabeçalho fixo sem cor de fundo: os cartões aparecem por trás do título
- Esquecer o `setAtualizando(false)`: a rodinha gira para sempre
- Passar `refreshing` e `onRefresh` e também um `refreshControl`: o `refreshControl` vence e os outros dois são ignorados
- Aumentar `windowSize` ou pôr `memo` em tudo sem medir: mais memória e código, nenhum ganho
:::

---

## Resumo

:::summary
- `SectionList` recebe `sections`, um array de `{ title, data }`, montado com `map` nas categorias e `filter` nos produtos
- `renderSectionHeader` recebe `{ section }`; `stickySectionHeadersEnabled` prende o título no topo, que precisa de cor de fundo
- Puxar para atualizar pede `refreshing` e `onRefresh`; o `RefreshControl` personaliza a rodinha
- A lista monta só uma janela de itens; `initialNumToRender` e `windowSize` ajustam essa janela
- Meça com o monitor de desempenho antes de otimizar e mude uma coisa por vez
:::

---

## :icon[flask-conical] No laboratório

A Início vira vitrine e nasce a tela Categorias.

:::steps
1. `src/telas/Inicio.js`: grade de 2 colunas com `numColumns`, `columnWrapperStyle` e separador
2. No `ListHeaderComponent` da grade: título "Destaques" e o carrossel horizontal de `produtos.filter((p) => p.destaque)`
3. `ListEmptyComponent` com ícone e mensagem; teste com `data={[]}` e volte
4. `src/telas/Categorias.js`: `SectionList` com seções de `categorias` e `produtos` e cabeçalhos fixos com fundo
5. Puxar para atualizar com `RefreshControl` e `setTimeout`, mostrando "Atualizado às" no topo
6. No `App.js`, troque `<Inicio />` por `<Categorias />` para testar; commit "E34: listas da Lojinha" e `push`
:::

**Critérios**: keys estáveis, cores do tema nos dois modos, nenhuma lista vertical dentro de `ScrollView`. Entregue o link do repositório no sistema.

---

## :icon[milestone] Projeto 6 · Etapa 5: lista por cidade e busca

No seu repositório `casas-de-adocao`:

- `agruparPorCidade` e `buscarCasas` em `src/regras/casas.js`; a busca ignora maiúsculas e acentos
- `SectionList` com as 5 cidades, título de seção fixo, com fundo e a quantidade de casas
- busca com um `Campo` controlado acima da lista: "sao" acha 4 casas
- puxar para atualizar, com "atualizado às" no topo
- lista vazia com mensagem e o botão "Limpar busca"

Commit: `Projeto 6: etapa 5, lista por cidade e busca`. Enunciado completo e entrega: página do curso, em **Projetos**.
