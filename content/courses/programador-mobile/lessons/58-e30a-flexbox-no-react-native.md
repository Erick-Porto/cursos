---
title: Flexbox no React Native
summary: Eixos, alinhamento, flex, flexWrap e gap para montar os seis layouts que mais aparecem em apps.
module: layout-rn
duration_minutes: 40
objectives:
  - Identificar o eixo principal e o eixo cruzado de uma View
  - Distribuir e alinhar filhos com justifyContent, alignItems e alignSelf
  - Dividir o espaço com flex e quebrar linhas com flexWrap e gap
  - Montar layouts clássicos de app só com View, Text e Flexbox
---

# Flexbox no React Native

Programador Mobile · Encontro E30 · Aula 58 de 89

---

## O que você vai aprender

:::goal
- Encontrar o eixo principal e o eixo cruzado de qualquer `View`
- Distribuir e alinhar filhos com `justifyContent`, `alignItems` e `alignSelf`
- Dividir o espaço com `flex` e quebrar linhas com `flexWrap` e `gap`
- Montar seis layouts que aparecem em quase todo app
:::

---

## Uma tela, dezenas de caixas

Abra o app de delivery que você usa. Só na tela inicial:

- uma barra no topo com o endereço à esquerda e o ícone da sacola à direita
- filtros em pílulas ("Lanches", "Pizza", "Japonesa") que quebram para a linha de baixo
- cartões com a foto do restaurante à esquerda e nome, nota e tempo de entrega à direita
- o botão "Ver sacola" sempre colado no rodapé

Nenhuma dessas peças tem posição fixa. Todas são **Flexbox**: caixas dentro de caixas, cada uma dizendo como organizar os próprios filhos. No `CartaoTarefa` do E27 você já usou o básico; hoje ele vai a fundo.

:::question
Quantas `View` você acha que existem só no cartão de um restaurante?
:::

---

## :icon[arrow-left-right] Eixo principal e eixo cruzado

`flexDirection` escolhe o **eixo principal**: a direção em que os filhos se enfileiram. O **eixo cruzado** é o perpendicular a ele.

:::center
![Diagrama: em column, o padrão, o eixo principal desce e o cruzado vai para o lado; em row, os dois trocam. justifyContent age no principal; alignItems, no cruzado](images/e30-eixos.svg)
:::

`justifyContent` trabalha sempre no eixo principal; `alignItems`, sempre no cruzado. Trocou a direção, trocou o efeito das duas. Existem ainda `'row-reverse'` e `'column-reverse'`, que invertem a ordem.

:::info Diferente da web
Na web, você escreve `display: flex` e o padrão é `row`. Aqui toda `View` já é flex, em `column`, e as medidas são números sem unidade: `gap: 8`, nunca `'8px'`.
:::

---

## :icon[chevrons-right] justifyContent: o espaço que sobra

`justifyContent` decide onde fica o **espaço livre** no eixo principal. Em uma linha (`row`) com três itens:

```plaintext
flex-start     |[A][B][C]            |
center         |      [A][B][C]      |
flex-end       |            [A][B][C]|
space-between  |[A]      [B]      [C]|
space-around   |  [A]    [B]    [C]  |
space-evenly   |   [A]   [B]   [C]   |
```

- `space-between`: primeiro e último encostam nas bordas
- `space-around`: cada item ganha o mesmo espaço dos dois lados, então as pontas ficam com a metade
- `space-evenly`: todos os espaços iguais, inclusive nas pontas

:::tip
O padrão é `flex-start`. Se nada mudou, confira se sobra espaço: uma `View` em `column` sem `flex: 1` tem só a altura do conteúdo e não tem nada para distribuir.
:::

---

## :icon[arrow-up-down] alignItems e alignSelf: o eixo cruzado

`alignItems` fica no **pai** e alinha todos os filhos no eixo cruzado: `stretch` (padrão, estica), `flex-start`, `center`, `flex-end` e `baseline` (pela linha de base do texto).

`alignSelf` fica no **filho** e abre uma exceção só para ele. É assim que um app de mensagens separa os balões:

```jsx
<View>
  <View style={estilos.balao}><Text>O fone ainda tem em estoque?</Text></View>
  <View style={[estilos.balao, estilos.meu]}><Text>Tem sim, chega amanhã</Text></View>
</View>

// no StyleSheet
balao: { alignSelf: 'flex-start', padding: 8, borderRadius: 12, backgroundColor: '#e2e8f0' },
meu: { alignSelf: 'flex-end', backgroundColor: '#bbf7d0' },
```

```plaintext
+--------------------------------+
| [O fone ainda tem em estoque?] |
|        [Tem sim, chega amanhã] |
+--------------------------------+
```

Sem o `alignSelf`, os dois balões esticariam até a largura toda: é o `stretch` padrão.

---

## :icon[columns-3] flex: dividindo o espaço

`flex` com um número diz **quantas partes** do espaço livre o filho recebe. Três filhos com `flex: 1`, `2` e `1` somam 4 partes:

```jsx
<View style={{ flexDirection: 'row', height: 48 }}>
  <View style={{ flex: 1, backgroundColor: '#fde68a' }} />
  <View style={{ flex: 2, backgroundColor: '#a7f3d0' }} />
  <View style={{ flex: 1, backgroundColor: '#bfdbfe' }} />
</View>
```

:::center
![Animação: numa linha de 360, os filhos com flex 1, 2 e 1 entram um a um e ficam com 1/4, 2/4 e 1/4: 90, 180 e 90](images/e30-flex-1-2-1.svg)
:::

Numa linha de 360 de largura: 90, 180 e 90.

Filhos com tamanho fixo são medidos primeiro; o `flex` divide **o que sobra**. Foi assim que, no `FormularioTarefa` do E28, o campo com `flex: 1` ocupou toda a largura menos a do botão.

---

## :icon[corner-down-right] flexWrap e gap

Em `row`, os filhos não quebram linha: se não cabem, passam da borda e ficam cortados. `flexWrap: 'wrap'` manda o excedente para a linha de baixo.

```plaintext
sem flexWrap
|[Todos] [Áudio] [Casa] [Espo|rte] [Livros]
                             ^ borda da tela
com flexWrap: 'wrap'
|[Todos] [Áudio] [Casa]      |
|[Esporte] [Livros]          |
```

```jsx
linha: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
```

**`gap`** põe espaço **entre** os filhos, nas duas direções, sem sobrar margem na borda. Para valores diferentes, use `rowGap` (entre as linhas) e `columnGap` (entre as colunas). Esqueça o `marginRight` em cada filho: com `gap`, o espaçamento fica no pai.

---

## Layout 1: centralizar

O estado vazio do carrinho, a tela de carregamento, a mensagem de erro: tudo no centro.

```plaintext
+------------------------------+
|                              |
|                              |
|   Seu carrinho está vazio    |
|  Que tal ver os destaques?   |
|                              |
|                              |
+------------------------------+
```

```jsx
<View style={estilos.vazio}>
  <Text style={estilos.titulo}>Seu carrinho está vazio</Text>
  <Text>Que tal ver os destaques?</Text>
</View>

// no StyleSheet
vazio: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
```

`flex: 1` dá à caixa todo o espaço da tela. Em `column`, `justifyContent` centraliza na vertical e `alignItems`, na horizontal. Para centralizar só um filho, sem mexer nos irmãos, use `alignSelf: 'center'` nele.

---

## Layout 2: barra superior

Título numa ponta, ícone na outra, os dois alinhados pelo meio.

```plaintext
+------------------------------+
| Lojinha                  ( ) |
+------------------------------+
```

```jsx
<View style={estilos.barra}>
  <Text style={estilos.titulo}>Lojinha</Text>
  <View style={estilos.icone} />
</View>

// no StyleSheet
barra: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingVertical: 12,
},
icone: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#e2e8f0' },
```

`space-between` empurra o primeiro e o último filho para as pontas; `alignItems: 'center'` alinha o texto pelo meio do ícone. A caixa cinza guarda o lugar do ícone até o E32. Com três itens (voltar, título, sacola), dê `flex: 1` e `textAlign: 'center'` ao título.

---

## Layout 3: grade de 2 colunas

Vitrine de produtos, galeria de fotos, atalhos de um app de banco.

```plaintext
+--------------------------------+
| +------------+  +------------+ |
| | Fone       |  | Caixa      | |
| |            |  |            | |
| +------------+  +------------+ |
|                                |
| +------------+  +------------+ |
| | Microfone  |  | Luminária  | |
| |            |  |            | |
| +------------+  +------------+ |
+--------------------------------+
```

```jsx
<View style={estilos.grade}>
  {produtos.map((produto) => (
    <View key={produto.id} style={estilos.celula}>
      <Text>{produto.nome}</Text>
    </View>
  ))}
</View>

// no StyleSheet
grade: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 },
celula: { width: '48%', aspectRatio: 1, padding: 8, borderRadius: 12, backgroundColor: '#e2e8f0' },
```

Cada célula tem 48% da largura, então cabem duas por linha; `space-between` joga os 4% que sobram para o meio. `aspectRatio: 1` faz a altura igual à largura, sem medida fixa. Com muitos produtos, a `FlatList` faz o mesmo com rolagem (E34).

---

## Pense

:::question
Como montar este cabeçalho de perfil? Quantas `View` existem, qual é a direção de cada uma e quem recebe `flex: 1`?

```plaintext
+------------------------------+
|            ( foto )          |
|           Ana Souza          |
|                              |
|   128        56      3.400   |
|  posts    seguindo seguidores|
+------------------------------+
```
:::

:::tip Resposta
```jsx
<View style={{ padding: 16, gap: 16 }}>
  <View style={{ alignItems: 'center', gap: 8 }}>
    <View style={estilos.foto} />
    <Text style={estilos.nome}>Ana Souza</Text>
  </View>
  <View style={{ flexDirection: 'row' }}>
    <View style={estilos.numero}><Text>128</Text><Text>posts</Text></View>
    <View style={estilos.numero}><Text>56</Text><Text>seguindo</Text></View>
    <View style={estilos.numero}><Text>3.400</Text><Text>seguidores</Text></View>
  </View>
</View>
// numero: { flex: 1, alignItems: 'center' }
```

Um bloco em `column` centralizado (foto e nome) e uma linha em `row` com três filhos `flex: 1`, cada um centralizando os próprios textos. Se você pôs `alignItems: 'center'` no pai de tudo, a linha encolhe até o tamanho do conteúdo: devolva a largura com `alignSelf: 'stretch'` nela.
:::

---

## Layout 4: rodapé fixo

O botão "Finalizar" do carrinho fica sempre na borda de baixo; a lista rola por cima.

```plaintext
+------------------------------+
| Fone Bluetooth     R$ 199,90 |
| Caixa de Som       R$ 249,90 |
|   (a lista rola aqui)        |
|                              |
+------------------------------+
| Total R$ 449,80  [Finalizar] |
+------------------------------+
```

```jsx
<View style={{ flex: 1 }}>
  <ScrollView style={{ flex: 1 }}>
    {/* itens do carrinho */}
  </ScrollView>
  <View style={estilos.rodape}>
    <Text style={estilos.total}>Total R$ 449,80</Text>
    <View style={estilos.botao}><Text>Finalizar</Text></View>
  </View>
</View>

// no StyleSheet
rodape: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
```

A área de cima tem `flex: 1`: cresce e empurra o rodapé para a borda. O rodapé fica com a altura do próprio conteúdo. Evite `position: 'absolute'` aqui: o rodapé passa a cobrir o último item da lista.

---

## Layout 5: cartão com imagem à esquerda

O cartão de produto, de restaurante, de contato: foto de um lado, textos do outro.

```plaintext
+------------------------------+
| +------+  Fone Bluetooth     |
| | foto |  Fone sem fio com   |
| |      |  20 horas de bat... |
| +------+  R$ 199,90          |
+------------------------------+
```

```jsx
<View style={estilos.cartao}>
  <View style={estilos.foto} />
  <View style={estilos.textos}>
    <Text style={estilos.nome}>Fone Bluetooth</Text>
    <Text numberOfLines={2}>Fone sem fio com 20 horas de bateria.</Text>
    <Text style={estilos.preco}>R$ 199,90</Text>
  </View>
</View>

// no StyleSheet
cartao: { flexDirection: 'row', gap: 12, padding: 12, borderRadius: 12 },
foto: { width: 72, height: 72, borderRadius: 8, backgroundColor: '#cbd5e1' },
textos: { flex: 1, gap: 4 },
```

A foto tem tamanho fixo; a coluna de textos tem `flex: 1` e fica com o resto da largura. Sem ele, um nome longo empurra o cartão para fora da tela. `numberOfLines={2}` corta a descrição com reticências. A foto de verdade entra no E32.

---

## Layout 6: chips em linha com quebra

Filtros, categorias, etiquetas: pílulas lado a lado que descem quando a linha enche.

```plaintext
+------------------------------+
| (Todos) (Áudio) (Casa)       |
| (Esporte) (Livros)           |
| (Promoções) (Mais vendidos)  |
+------------------------------+
```

```jsx
const filtros = ['Todos', 'Áudio', 'Casa', 'Esporte', 'Livros', 'Promoções', 'Mais vendidos'];

<View style={estilos.chips}>
  {filtros.map((filtro) => (
    <View key={filtro} style={estilos.chip}>
      <Text>{filtro}</Text>
    </View>
  ))}
</View>

// no StyleSheet
chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
```

Cada chip tem a largura do próprio texto mais o `padding`. `flexWrap` quebra a linha quando ela enche e `gap` espaça nas duas direções. `borderRadius: 999` é maior que metade de qualquer altura: as pontas ficam sempre redondas.

---

## :icon[triangle-alert] Erros comuns

:::warning
- `justifyContent` ou `alignItems` no filho: as duas organizam os **filhos** de quem as recebe. Para mexer só em um filho, use `alignSelf` nele
- Trocar a direção e esquecer que os eixos trocaram junto: em `row`, `alignItems: 'center'` centraliza na **vertical**
- `flex: 1` num filho cujo pai não tem altura: não há espaço para dividir. A corrente de `flex: 1` começa na raiz da tela
- Texto longo em `row` saindo da tela: falta `flex: 1` na coluna de textos
- Hábitos da web: `display: 'grid'` não existe e `'16px'` não é medida
:::

---

## Resumo

:::summary
- `flexDirection` escolhe o eixo principal (padrão `column`); o cruzado é o perpendicular
- `justifyContent` distribui no eixo principal; `alignItems` alinha no cruzado; `alignSelf` abre exceção para um filho
- `flex` divide o espaço que sobra em partes: 1, 2 e 1 viram 25%, 50% e 25%
- `flexWrap: 'wrap'` quebra a linha e `gap` espaça os filhos sem margens
- Seis padrões resolvem a maioria das telas: centro, barra, grade, rodapé, cartão e chips
:::

---

## :icon[arrow-right] Próximos passos

O Flexbox diz onde cada caixa fica. Falta saber em que tela ela vai aparecer: um celular pequeno, um grande deitado, um tablet, com notch ou sem.

Na próxima aula, você aprende a:

- :icon[smartphone] medir a tela em pontos com `useWindowDimensions`
- :icon[shield] fugir do notch e da barra de gestos com `SafeAreaView` e `useSafeAreaInsets`
- :icon[store] criar o app **Lojinha** com as regras do `lojinha-regras` e montar a tela inicial em wireframe
