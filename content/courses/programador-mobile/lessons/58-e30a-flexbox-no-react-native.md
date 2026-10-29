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

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **layout** | o jeito como as peças se organizam na tela: o que fica ao lado, embaixo ou no centro |
| **Flexbox** | o sistema que organiza os filhos de uma `View`: direção, alinhamento e espaço |
| **eixo principal** | a linha em que os filhos se enfileiram: para baixo ou para o lado |
| **eixo cruzado** | a outra linha, que atravessa o eixo principal |
| **espaço livre** | o que sobra dentro da caixa depois que os filhos se acomodam |
| **quebrar a linha** | mandar para a linha de baixo o que não cabe na de cima |

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

## Eixos

Numa prateleira, você enfileira os potes deitados ou empilhados?

---

## :icon[arrow-left-right] Eixo principal e eixo cruzado

O Flexbox funciona como uma prateleira: você escolhe a direção, o alinhamento e o espaço entre as caixas. Tudo começa pela direção.

`flexDirection` escolhe o **eixo principal**: a direção em que os filhos se enfileiram. O **eixo cruzado** é o perpendicular a ele, a linha que atravessa.

:::center
![Diagrama: em column, o padrão, o eixo principal desce e o cruzado vai para o lado; em row, os dois trocam. justifyContent age no principal; alignItems, no cruzado](images/e30-eixos.svg)
:::

- `column`, o padrão: o principal desce, o cruzado vai para o lado
- `row`: o principal vai para o lado, o cruzado desce

`justifyContent` trabalha sempre no eixo principal; `alignItems`, sempre no cruzado. Trocou a direção, trocou o efeito das duas.

---

## :icon[columns-3] Eixos na prática

**Caso 1: a lista de produtos.** Sem `flexDirection`, vale o padrão, `column`: um embaixo do outro.

```jsx
<View>
  <Text>Fone Bluetooth</Text>
  <Text>Caixa de Som</Text>
</View>
```

**Caso 2: o preço ao lado do nome.** Com `row`, lado a lado.

```jsx
<View style={{ flexDirection: 'row' }}>
  <Text>Fone Bluetooth</Text>
  <Text>R$ 199,90</Text>
</View>
```

```plaintext
caso 1               caso 2
|Fone Bluetooth |    |Fone BluetoothR$ 199,90|
|Caixa de Som   |
```

Existem ainda `'row-reverse'` e `'column-reverse'`, que invertem a ordem: com `'row-reverse'`, o preço vem antes do nome.

:::info Diferente da web
Na web, você escreve `display: flex` e o padrão é `row`. Aqui toda `View` já é flex, em `column`, e as medidas são números sem unidade: `gap: 8`, nunca `'8px'`.
:::

---

## justifyContent

Sobrou espaço na prateleira: ele fica num canto, no meio ou entre os potes?

---

## :icon[chevrons-right] justifyContent: o espaço que sobra

`justifyContent` decide onde fica o **espaço livre** no eixo principal. Na prateleira, é escolher se os potes ficam juntos num canto, no meio ou espalhados. Em uma linha (`row`) com três itens:

```plaintext
flex-start     |[A][B][C]            |
center         |      [A][B][C]      |
flex-end       |            [A][B][C]|
space-between  |[A]      [B]      [C]|
space-around   |  [A]    [B]    [C]  |
space-evenly   |   [A]   [B]   [C]   |
```

- `flex-start`, `center` e `flex-end`: todos juntos, no começo, no meio ou no fim
- `space-between`: primeiro e último encostam nas bordas
- `space-around`: cada item ganha o mesmo espaço dos dois lados, então as pontas ficam com a metade
- `space-evenly`: todos os espaços iguais, inclusive nas pontas

:::tip
O padrão é `flex-start`. Se nada mudou, confira se sobra espaço: uma `View` em `column` sem `flex: 1` tem só a altura do conteúdo e não tem nada para distribuir.
:::

---

## :icon[chevrons-right] justifyContent na prática

**Caso 1: nome e preço nas pontas.**

```jsx
<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
  <Text>Fone Bluetooth</Text>
  <Text>R$ 199,90</Text>
</View>
```

**Caso 2: os botões do formulário no fim da linha.**

```jsx
<View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
  <Button title="Cancelar" onPress={cancelar} />
  <Button title="Salvar" onPress={salvar} />
</View>
```

```plaintext
caso 1  |Fone Bluetooth         R$ 199,90|
caso 2  |            [Cancelar] [Salvar] |
```

---

## alignItems e alignSelf

Num app de mensagens, por que os seus balões ficam do lado direito?

---

## :icon[arrow-up-down] alignItems e alignSelf: o eixo cruzado

`alignItems` fica no **pai** e alinha todos os filhos no eixo cruzado. Numa prateleira em linha, é decidir se as caixas ficam no alto, no meio ou embaixo, ou se esticam até a altura toda.

| Valor | Os filhos no eixo cruzado |
|---|---|
| `stretch` | esticam até ocupar tudo; é o padrão |
| `flex-start` | ficam no começo |
| `center` | ficam no meio |
| `flex-end` | ficam no fim |
| `baseline` | alinham pela linha de base do texto, a linha onde as letras se apoiam |

`alignSelf` fica no **filho** e abre uma exceção só para ele, com os mesmos valores.

---

## :icon[message-square] alignItems e alignSelf na prática

**Caso 1: avatar e nome alinhados pelo meio.** `alignItems` no pai, para todos os filhos:

```jsx
<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#cbd5e1' }} />
  <Text>Ana Souza</Text>
</View>
```

Na tela: o nome fica na altura do meio do avatar, e não colado no topo.

**Caso 2: os balões de mensagem.** `alignSelf` em cada filho:

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

- `balao` encosta no começo, à esquerda: `alignSelf: 'flex-start'`
- O segundo balão soma os dois estilos no array; o `meu` troca para `'flex-end'`, à direita, e muda a cor

Sem o `alignSelf`, os dois balões esticariam até a largura toda: é o `stretch` padrão.

---

## Dividir o espaço

Uma pizza de 4 fatias: quem pediu 2 leva quanto?

---

## :icon[columns-3] flex: dividindo o espaço

`flex` com um número diz **quantas partes** do espaço livre o filho recebe. É como dividir uma pizza: se os pedidos somam 4 fatias, quem pediu 2 leva metade. Três filhos com `flex: 1`, `2` e `1` somam 4 partes:

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

---

## :icon[split] flex na prática

**Caso 1: o campo ao lado do botão.** Filhos com tamanho fixo são medidos primeiro; o `flex` divide **o que sobra**.

```jsx
<View style={{ flexDirection: 'row', gap: 8 }}>
  <TextInput style={{ flex: 1 }} placeholder="Nova tarefa" />
  <Pressable style={{ width: 96 }}><Text>Adicionar</Text></Pressable>
</View>
```

- O botão tem 96 de largura: ele é medido primeiro
- O campo, com `flex: 1`, fica com todo o resto, menos o `gap`

Foi assim que, no `FormularioTarefa` do E28, o campo com `flex: 1` ocupou toda a largura menos a do botão.

**Caso 2: abas do mesmo tamanho.** Quatro filhos com `flex: 1`: cada um leva uma fatia igual.

```jsx
<View style={{ flexDirection: 'row' }}>
  {['Início', 'Categorias', 'Carrinho', 'Perfil'].map((aba) => (
    <Text key={aba} style={{ flex: 1, textAlign: 'center' }}>{aba}</Text>
  ))}
</View>
```

Numa tela de 360: quatro abas de 90, com o texto centralizado em cada uma.

---

## flexWrap e gap

Quando a linha do caderno acaba, onde você continua escrevendo?

---

## :icon[corner-down-right] flexWrap e gap

Em `row`, os filhos não quebram linha: se não cabem, passam da borda e ficam cortados. `flexWrap: 'wrap'` (*wrap*, embrulhar) manda o excedente para a linha de baixo, como no caderno: a linha acabou, você continua na de baixo.

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

**`gap`** (vão) põe espaço **entre** os filhos, nas duas direções, sem sobrar margem na borda. Para valores diferentes, use `rowGap` (entre as linhas) e `columnGap` (entre as colunas). Esqueça o `marginRight` em cada filho: com `gap`, o espaçamento fica no pai.

---

## :icon[corner-down-right] flexWrap e gap na prática

**Caso 1: os tamanhos de uma camiseta.** Cabem numa linha; o `gap` separa sem margem.

```jsx
<View style={{ flexDirection: 'row', gap: 8 }}>
  <Text>P</Text>
  <Text>M</Text>
  <Text>G</Text>
</View>
```

**Caso 2: as categorias da Lojinha.** Não cabem numa linha; o `flexWrap` desce o resto.

```jsx
<View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 12, columnGap: 8 }}>
  {['Todos', 'Áudio', 'Casa', 'Esporte', 'Livros'].map((c) => <Text key={c}>{c}</Text>)}
</View>
```

```plaintext
caso 1  |P M G                     |
caso 2  |Todos Áudio Casa Esporte  |
        |Livros                    |
```

No caso 2, 12 entre as linhas e 8 entre as palavras.

---

## Layouts de app

Quantas telas de app você lembra com tudo no centro?

---

## :icon[layout-grid] Seis layouts de app

Um **layout de app** é um jeito de arrumar a prateleira que se repete em quase todo app. Com as propriedades de hoje, você monta seis:

| Layout | Onde aparece | O segredo |
|---|---|---|
| centralizar | carrinho vazio, carregando | `flex: 1`, `justifyContent` e `alignItems` em `center` |
| barra superior | título e ícone no topo | `row` e `space-between` |
| grade | vitrine de produtos | `row`, `flexWrap` e largura de `'48%'` |
| rodapé fixo | botão "Finalizar" | `flex: 1` na área de cima |
| cartão com imagem | produto, contato | foto fixa e textos com `flex: 1` |
| chips | filtros, categorias | `row`, `flexWrap` e `gap` |

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

`space-between` empurra o primeiro e o último filho para as pontas; `alignItems: 'center'` alinha o texto pelo meio do ícone. A caixa cinza guarda o lugar do ícone até o E32. Com três itens (voltar, título, sacola), dê `flex: 1` e `textAlign: 'center'` ao título: ele ocupa o meio e centraliza o próprio texto.

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

Cada célula tem 48% da largura, então cabem duas por linha; `space-between` joga os 4% que sobram para o meio. `aspectRatio: 1` (proporção 1 para 1) faz a altura igual à largura, sem medida fixa. Com muitos produtos, a `FlatList` faz o mesmo com rolagem (E34).

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

A área de cima tem `flex: 1`: cresce e empurra o rodapé para a borda. O rodapé fica com a altura do próprio conteúdo. O `{/* ... */}` é um comentário dentro do JSX. Evite `position: 'absolute'` (a caixa presa num ponto fixo) aqui: o rodapé passa a cobrir o último item da lista.

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

A foto tem tamanho fixo; a coluna de textos tem `flex: 1` e fica com o resto da largura. Sem ele, um nome longo empurra o cartão para fora da tela. `numberOfLines={2}` (número de linhas) corta a descrição com reticências. A foto de verdade entra no E32.

---

## Layout 6: chips em linha com quebra

Filtros, categorias, etiquetas: **chips** são pílulas lado a lado, que descem quando a linha enche.

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

| O que você vê | Por quê | O que fazer |
|---|---|---|
| o filho ignora `justifyContent` ou `alignItems` | as duas organizam os **filhos** de quem as recebe | `alignSelf` no filho |
| em `row`, `alignItems: 'center'` centraliza na **vertical** | trocou a direção, trocaram os eixos | na horizontal, `justifyContent` |
| `flex: 1` não faz nada | o pai não tem altura para dividir | `flex: 1` desde a raiz da tela |
| texto longo em `row` sai da tela | falta `flex: 1` nos textos | `flex: 1` na coluna de textos |
| o estilo não funciona | `display: 'grid'` ou `'16px'`, hábitos da web | Flexbox e números sem unidade |

---

## Resumo

:::summary
- O Flexbox é a prateleira: direção, alinhamento e espaço entre as caixas
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
