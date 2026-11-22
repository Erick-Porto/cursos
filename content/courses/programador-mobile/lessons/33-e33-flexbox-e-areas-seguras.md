---
title: Flexbox e áreas seguras
summary: "Começa o Projeto 6: o kit no celular e a tela Início montada com Flexbox, longe do entalhe."
module: layout-rn
duration_minutes: 90
objectives:
  - Montar a tela Início do Casas de adoção com as peças do kit, dentro da área segura
  - Arrumar caixas em linha ou em coluna com flexDirection, justifyContent e alignItems
  - "Dividir o espaço com flex: 1 e separar as peças com padding, margin e gap"
  - Importar os arquivos do projeto com o atalho @ do jsconfig.json
---

# Flexbox e áreas seguras

Programador Mobile · Encontro E33 · Aula 33 de 45

---

## O que você vai aprender

:::goal
- Começar o Projeto 6, o Casas de adoção, a partir de um kit
- Afastar a tela do entalhe e das barras do celular com a área segura
- Pôr caixas em linha ou em coluna e alinhar cada uma com Flexbox
- Dividir o espaço com `flex: 1` e separar as peças com `padding`, `margin` e `gap`
- Montar a tela Início com as peças do kit
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **Flexbox** | o jeito de arrumar as caixas de uma `View`: a direção, o alinhamento e o espaço entre elas |
| **eixo principal** | o caminho em que as caixas se enfileiram: para baixo ou para o lado |
| **eixo cruzado** | o caminho que atravessa o principal |
| **área segura** | a parte da tela que nada cobre: nem o entalhe da câmera, nem as barras do celular |
| **atalho `@`** | um nome curto para a pasta `src/`, usado nos `import` |

---

## :icon[milestone] Projeto 6: Casas de adoção

O **Casas de adoção** é um app para achar abrigos de cães e gatos: quem quer adotar encontra uma casa com vaga perto de casa. Ele vem num **kit**, com as peças de tela prontas, o tema e 12 casas de exemplo. Você monta as telas e, no E35, cria o seu componente, o `CartaoCasa`.

Hoje o kit abre com uma frase só, colada no relógio do celular. No fim do dia, a Início fica assim:

```plaintext
Casas de adoção                  .--.
Adote perto de você              '--'
+-----------+ +-----------+ +-----------+
|    12     | |     5     | |    76     |
|   casas   | |  cidades  | |   vagas   |
+-----------+ +-----------+ +-----------+
+---------------------------------------+
| +------+  Lar da Mel                  |
| |      |  Pinheiros, São Paulo        |
| +------+  [0 vagas]                   |
+---------------------------------------+
  ... e mais 11 cartões
```

Uma etapa por encontro, até o E39; entrega no início do E41. Enunciado e rubrica: página do curso, em **Projetos**.

:::question
Nessa tela, quais caixas ficam lado a lado? Quais ficam uma embaixo da outra?
:::

---

## O kit

Para montar um guarda-roupa, você corta a madeira ou abre a caixa com as peças prontas?

---

## :icon[folder-tree] O kit das Casas de adoção

O **kit** é um app Expo pronto para rodar, como o do Gota, com 11 peças de tela prontas para encaixar: peças de Lego. Cada arquivo da pasta `app/` é uma tela do app.

| Pasta ou arquivo | O que tem |
|---|---|
| `app/index.js` | a **Início**, a primeira tela, no endereço `/` (a **rota**) |
| `app/_layout.js` | o que envolve todas as telas, como o tema; você não mexe |
| `src/components/ui/` | as peças, como `Tela`, `Cartao` e `Badge` |
| `src/data/casas.js` | as 12 casas de exemplo |
| `src/theme/` e `src/utils/` | cores, medidas e funções de apoio |
| `jsconfig.json` | o **atalho `@`** para a pasta `src/` |

Navegação a fundo: E37.

---

## :icon[link] O atalho @ na prática

O **`@`** é o endereço salvo como "Casa" no app de mapas: de onde você estiver, o nome curto leva ao mesmo lugar. No `jsconfig.json` do kit, uma linha cria o atalho: "onde o `import` começar com `@/`, leia `./src/`".

```json
"@/*": ["./src/*"]
```

| Arquivo | Sem o atalho | Com o atalho |
|---|---|---|
| `app/index.js`, hoje | `'../src/components/ui'` | `'@/components/ui'` |
| `app/casa/[id].js`, no E37 | `'../../src/components/ui'` | `'@/components/ui'` |
| `src/components/CartaoCasa.js`, no E35 | `'./ui'` | `'@/components/ui'` |

No E37, a Início muda de pasta, e nenhum `import` quebra. O caminho termina na pasta `ui/`: quem responde é o `index.js` dela, a vitrine das 11 peças.

---

## :icon[notebook-pen] Exercícios: O kit

:::example Exercícios
1. No kit de um app de ônibus, a pasta `app/` tem `_layout.js`, `index.js` e `linhas.js`. Qual é a primeira tela, a do endereço `/`?
2. Com `"@/*": ["./src/*"]` no `jsconfig.json`, que arquivo o `import { lanches } from '@/data/lanches';` abre?
3. Sem o atalho, que caminho o `app/index.js` usaria para chegar ao mesmo arquivo?
4. `import { Tela } from '@/src/components/ui';` dá `Unable to resolve`. Por quê?
:::

:::tip Respostas
1. O `app/index.js`, a Início; o `_layout.js` só envolve todas as telas
2. O `src/data/lanches.js`: o `@/` vira `./src/`
3. `'../src/data/lanches'`: o `..` sai da pasta `app/`
4. O `@` já é a pasta `src/`: o caminho vira `./src/src/components/ui`, que não existe. O certo é `'@/components/ui'`
:::

---

## :icon[milestone] Projeto 6 · Passo 1: o kit no celular

:::steps
1. Baixe o [kit-casas.zip](materiais/projeto-6/kit-casas.zip) e extraia na pasta dos projetos (botão direito, **Extrair tudo**)
2. Renomeie a pasta `kit-casas` para `casas-de-adocao`
3. No terminal: `code casas-de-adocao`; no terminal do VS Code, `npm install`
4. `npx expo start` e leia o QR code com o Expo Go, na mesma conta Expo do E29
:::

O `npm install` termina com `added 535 packages` (o número pode variar um pouco). Como no E29, ele sugere `npm audit fix --force`: não rode, porque ele troca as versões do kit, e o Expo Go deixa de abrir o app.

**Pronto quando:** o celular mostra "Casas de adoção" em negrito, no alto, **colado no relógio**.

---

## :icon[milestone] Projeto 6 · Passo 1: o kit no GitHub

O zip não traz arquivos que começam com ponto. Na pasta do projeto, crie o `.gitignore`:

```plaintext
node_modules/
.expo/
dist/
```

As duas primeiras são as do Gota. A `dist/` é a pasta do app empacotado para publicar (E44): ela se refaz sozinha. No GitHub, **New repository**, `casas-de-adocao`, **Public**, sem README. Num segundo terminal do VS Code:

```bash
git init
git add .
git commit -m "Kit do Projeto 6"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/casas-de-adocao.git
git push -u origin main
```

**Pronto quando:** o GitHub mostra o commit "Kit do Projeto 6", sem a pasta `node_modules`.

---

## Área segura

Por que ninguém escreve em cima da espiral do caderno?

---

## :icon[shield-check] Área segura: a margem da tela

A **área segura** é a parte da tela que nada cobre. Fora dela ficam o **entalhe** (o recorte da câmera, *notch* em inglês), a **barra de status**, com o relógio e a bateria, e a barra de gestos, embaixo. É a margem do caderno: você escreve dentro dela, longe do furo e da espiral.

:::center
![Diagrama: sem a área segura, o título fica atrás do relógio e da câmera; com a SafeAreaView, o conteúdo começa abaixo deles, dentro da área segura](images/e27-area-segura.svg)
:::

Cada celular tem entalhe e barras de tamanhos diferentes. Quem mede é a **`SafeAreaView`** (a vista da área segura), que mora dentro da `Tela` do kit: ela põe o espaço certo em qualquer aparelho, Android ou iPhone.

---

## :icon[shield-check] A Tela na prática

A `Tela` do kit cuida da área segura, do fundo do tema e de um espaço de 16 nas bordas e entre os blocos. Duas props mudam o jeito dela:

| Onde | Como fica | Por quê |
|---|---|---|
| Início, hoje | `<Tela rolar>` | os 12 cartões não cabem: a tela **rola** |
| Início, no E36 | `<Tela>` | a `FlatList` do E31 já rola sozinha |
| Detalhe, no E37 | `<Tela rolar comCabecalho>` | o cabeçalho protege o topo |

Prop sem valor vale `true`: `<Tela rolar>` é o mesmo que `<Tela rolar={true}>`. As props de cada peça estão no comentário do topo do arquivo dela.

---

## :icon[notebook-pen] Exercícios: Área segura

:::example Exercícios
1. Quais ficam fora da área segura: o relógio, o entalhe, a playlist, a barra de gestos?
2. Uma playlist de 50 músicas com `map`: `<Tela>` ou `<Tela rolar>`? E com `FlatList`?
3. A Início de um app de ônibus feito com o kit é só isto. Onde aparece o texto? Como consertar?

   ```jsx
   <View>
     <Text>Próximo ônibus: 8 min</Text>
   </View>
   ```

4. Por que não pôr um espaço fixo de 40 no topo?
:::

:::tip Respostas
1. O relógio, o entalhe e a barra de gestos
2. Com `map`, `<Tela rolar>`: as 50 não cabem. Com `FlatList`, `<Tela>`: ela já rola
3. Colado no relógio. Troque a `View` de fora pela `Tela` do kit
4. Em cada celular, o entalhe e as barras têm um tamanho: 40 sobra ou falta
:::

---

## :icon[milestone] Projeto 6 · Passo 2: a Tela e a área segura

Em `app/index.js`, os comentários do topo podem ficar. Do `import` para baixo, a `View` de fora vira a `Tela` do kit, e o estilo `tela` sai:

```jsx
import { StyleSheet, Text } from 'react-native';
import { Tela } from '@/components/ui';

export default function Inicio() {
  return (
    <Tela rolar>
      <Text style={estilos.titulo}>Casas de adoção</Text>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  titulo: { fontSize: 24, fontWeight: 'bold' },
});
```

O `{ Tela }` vai entre chaves: o `index.js` da vitrine exporta cada peça com o seu nome, como no E16.

**Pronto quando:** o título desce para baixo do relógio, afastado 16 das bordas, num fundo bege claro. Hoje, use o celular no **tema claro**: no escuro, os seus textos, pretos, somem no fundo escuro.

---

## Flexbox

Na prateleira da cozinha, os potes ficam lado a lado ou um em cima do outro?

---

## :icon[columns-3] Flexbox: a prateleira

No Gota, a `Linha` do kit punha os copos lado a lado. Por dentro, ela era um estilo de duas linhas:

```javascript
linha: { flexDirection: 'row', justifyContent: 'space-between' },
```

Isso é **Flexbox**: o jeito de arrumar as caixas de dentro de uma `View`, como numa prateleira. No estilo da `View` de fora, você escolhe a direção, o alinhamento e o espaço entre as caixas. A direção vem do **`flexDirection`**:

```plaintext
'column', o padrão        'row'
+--------------+          +------------------+
| [A         ] |          | [A] [B] [C]      |
| [B         ] |          +------------------+
| [C         ] |
+--------------+
```

- `'column'`: uma embaixo da outra, cada uma na linha inteira do caderno, a coluna do E30
- `'row'`: lado a lado, na mesma linha, cada uma do tamanho do seu conteúdo

---

## :icon[arrow-left-right] Os dois eixos

A direção cria dois caminhos dentro da `View`:

- o **eixo principal**, por onde a fileira anda: em `'column'`, desce; em `'row'`, vai para o lado
- o **eixo cruzado**, que atravessa o principal

:::center
![Diagrama: em column, o padrão, o eixo principal desce e o cruzado vai para o lado; em row, os dois trocam, e o principal vai para o lado. justifyContent age no eixo principal e alignItems no cruzado](images/e30-eixos.svg)
:::

Cada eixo tem a sua propriedade: o **`justifyContent`** (*justify*, distribuir) arruma no principal, e o **`alignItems`** (*align*, alinhar), no cruzado. Trocou a direção, trocaram os eixos.

---

## :icon[arrow-left-right] justifyContent, valor por valor

O `justifyContent` decide onde fica o espaço que sobra no eixo principal. Três caixas numa `View` em `'row'`:

```plaintext
flex-start     |[A][B][C]            |
center         |      [A][B][C]      |
flex-end       |            [A][B][C]|
space-between  |[A]      [B]      [C]|
space-around   |  [A]    [B]    [C]  |
space-evenly   |   [A]   [B]   [C]   |
```

- `'flex-start'` é o padrão: as caixas ficam juntas, no começo
- `'space-between'` encosta a primeira e a última nas pontas e reparte o resto entre elas. É o da `Linha` do Gota
- `'space-around'` dá a cada caixa o mesmo espaço dos dois lados; `'space-evenly'` deixa todos os vãos iguais, até nas pontas
- Em `'column'`, vale o mesmo de cima para baixo, quando a `View` é mais alta que as caixas

---

## :icon[arrow-up-down] alignItems, valor por valor

O `alignItems` alinha as caixas no eixo cruzado. Em `'column'`, o cruzado vai para o lado. Dois textos numa coluna:

```plaintext
stretch     |[Casas de adoção     ]|
            |[Adote               ]|
flex-start  |[Casas de adoção]     |
            |[Adote]               |
center      |  [Casas de adoção]   |
            |       [Adote]        |
flex-end    |     [Casas de adoção]|
            |               [Adote]|
```

- `'stretch'` (esticar) é o padrão: a caixa estica até a largura toda. Foi por isso que o `BotaoCopo` sozinho virou uma faixa da largura da tela, no E30
- Caixa com tamanho fixo não estica: com `'stretch'`, ela fica no começo
- Em `'row'`, o cruzado é a altura: `'center'` põe cada caixa no meio da altura da linha; `'flex-start'`, no alto; `'flex-end'`, embaixo

---

## :icon[columns-3] Flexbox na prática

**Caso 1: título numa ponta, botão na outra**, o topo de muitos apps:

```javascript
topo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
```

```plaintext
| Casas de adoção                 .--. |
| Adote perto de você             '--' |
```

**Caso 2: os botões de um player de música**, juntos no meio, com o play maior:

```javascript
controles: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 24 },
```

```plaintext
|          ( |< )   (  >  )   ( >| )          |
```

O `alignItems: 'center'` põe os botões de 40 na altura do meio do play, de 64. O **`gap`** (vão) é o espaço entre as caixas, posto na `View` de fora: 24 entre um botão e outro.

---

## :icon[notebook-pen] Exercícios: Flexbox

:::example Exercícios
1. No app do ônibus, onde fica cada texto?

   ```jsx
   <View style={estilos.linha}>
     <Text>Linha 201</Text>
     <Text>8 min</Text>
   </View>
   ```

   ```javascript
   linha: { flexDirection: 'row', justifyContent: 'space-between' },
   ```

2. Três abas lado a lado, com todos os vãos iguais, até nas pontas: `justifyContent: ___`
3. Num chat, a coluna das mensagens enviadas tem `alignItems: 'flex-end'`. Onde fica cada balão?
4. Numa coluna de botões, `justifyContent: 'center'` não centralizou os botões na largura. Por quê? Qual o conserto?
:::

:::tip Respostas
1. Na mesma linha: "Linha 201" na ponta esquerda, "8 min" na direita
2. `'space-evenly'`
3. Encostado à direita, cada um do tamanho do seu texto
4. Em `'column'`, o `justifyContent` age de cima para baixo. Na largura, o eixo cruzado, quem centraliza é o `alignItems: 'center'`
:::

---

## flex: 1

Sobrou um vão no fim da prateleira. Qual caixa estica para ocupar?

---

## :icon[chevrons-right] flex: 1: fica com o que sobra

Na prateleira, as caixas de tamanho fixo entram primeiro. **`flex: 1`** diz a uma caixa: "estique e fique com o espaço que sobrou, na direção da fileira". Sem ele, a caixa tem o tamanho do seu conteúdo, e um texto comprido não quebra a linha.

No cartão de hoje, a foto tem 72 de largura. A coluna de textos, ao lado, é quem estica:

```plaintext
sem flex: 1 nos textos: o nome não quebra
+--------------------------------+
| +----+  Associação Patinhas do |Bem
| +----+                         |
+--------------------------------+

com flex: 1 nos textos: o nome quebra dentro do cartão
+--------------------------------+
| +----+  Associação Patinhas    |
| +----+  do Bem                 |
+--------------------------------+
```

Num celular estreito, sem o `flex: 1`, o nome passa da borda do cartão.

---

## :icon[chevrons-right] flex: 1 na prática

**Caso 1: o título ao lado de um botão.** O botão tem 48 de largura; os títulos, com `flex: 1`, ficam com o resto da linha. Uma frase comprida quebra a linha, e o botão continua na tela. Sem o `flex: 1`, a frase empurra o botão para fora.

**Caso 2: teclas do mesmo tamanho.** Três caixas com `flex: 1` dividem o espaço em partes iguais, como as teclas de uma calculadora:

```jsx
<View style={estilos.teclado}>
  <View style={estilos.tecla}><Text>7</Text></View>
  <View style={estilos.tecla}><Text>8</Text></View>
  <View style={estilos.tecla}><Text>9</Text></View>
</View>
```

```javascript
teclado: { flexDirection: 'row', gap: 8 },
tecla: { flex: 1, height: 48, alignItems: 'center', justifyContent: 'center' },
```

Numa tela de 360 dentro da `Tela`: 360 menos as bordas de 16 dá 328; menos os dois vãos de 8, 312; cada tecla fica com 104.

---

## :icon[notebook-pen] Exercícios: flex: 1

:::example Exercícios
1. No carrinho, um nome comprido empurra o botão Remover para fora. O que falta?
2. Três caixas `time` num `placar` de 300. Quanto mede cada uma?

   ```javascript
   placar: { flexDirection: 'row', gap: 6 },
   time: { flex: 1 },
   ```

3. Numa linha de 300, sem vão: uma caixa com `width: 60` e duas com `flex: 1`. Quanto mede cada?
4. A tela, em coluna, ocupa o celular; a lista tem `flex: 1`, e o botão Pagar vem depois. Onde ele fica?
:::

:::tip Respostas
1. `flex: 1` no nome: fica com o que sobra e quebra a linha
2. 96: 300 menos os 12 dos vãos, dividido por 3
3. 60, 120 e 120: as duas repartem os 240 que sobram
4. No pé da tela: a lista estica e empurra o botão
:::

---

## :icon[milestone] Projeto 6 · Passo 3: o topo em linha

O `import` de `react-native` ganha a `View`. Troque o conteúdo da `Tela`:

```jsx
<Tela rolar>
  <View style={estilos.topo}>
    <View style={estilos.titulos}>
      <Text style={estilos.titulo}>Casas de adoção</Text>
      <Text style={estilos.subtitulo}>Adote perto de você</Text>
    </View>
    <View style={estilos.reserva} />
  </View>
</Tela>
```

No `StyleSheet`, o `titulo` continua, e entram quatro estilos:

```javascript
topo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 16 },
titulos: { flex: 1, gap: 4 },
titulo: { fontSize: 24, fontWeight: 'bold' },
subtitulo: { fontSize: 16 },
reserva: { width: 48, height: 48, borderRadius: 24, borderWidth: 1 },
```

**Pronto quando:** o título e a frase ficam empilhados à esquerda e, à direita, um círculo de contorno, na altura do meio dos dois textos.

---

## :icon[list-ordered] O topo em português

| Linha | O que ela diz |
|---|---|
| `flexDirection: 'row'` | "os filhos do `topo` lado a lado" |
| `justifyContent: 'space-between'` | "um em cada ponta" |
| `alignItems: 'center'` | "no meio da altura": o círculo na altura do meio dos textos |
| `gap: 16` | "16 de vão entre os dois" |
| `titulos: { flex: 1, gap: 4 }` | "os títulos ficam com o que sobra, com 4 entre eles" |
| `borderWidth: 1` | o **contorno**, com 1 de espessura; sem cor, sai preto |

O `reserva` tem 48 por 48 e canto de 24, a metade: vira um círculo, o lugar do botão de tema do E34. Os títulos ficam em coluna, o padrão.

---

## Espaços

Na prateleira, quem decide o vão entre os potes: cada pote ou a prateleira?

---

## :icon[square] padding, margin e gap

Três propriedades põem espaço, cada uma num lugar:

```plaintext
+------------------ Cartao ------------------+
|  padding: por dentro, até a borda          |
|   +------+    gap    +------------------+  |
|   | foto | <-------> | textos           |  |
|   +------+           +------------------+  |
+--------------------------------------------+
       margin: por fora, afasta os vizinhos
```

| Propriedade | Onde fica o espaço | Vai em quem |
|---|---|---|
| `padding` | por dentro, entre a borda e o conteúdo: o plástico-bolha do E30 | na própria caixa |
| `margin` | por fora, entre a caixa e os vizinhos | na própria caixa |
| `gap` | entre os filhos, nunca nas pontas: o vão da prateleira | na `View` de fora |

Para um lado só: `paddingHorizontal` (esquerda e direita), `paddingVertical` (em cima e embaixo), `marginTop` (em cima) e `marginBottom` (embaixo).

---

## :icon[square] Espaços na prática

**Caso 1: o Cartao do kit.** Ele já vem com `padding: 16` e `gap: 8`. O seu estilo vai por cima do dele: com `gap: 16`, a foto fica a 16 dos textos.

**Caso 2: a Tela entre os cartões.** A `Tela` tem `gap: 16`: os 12 cartões saem separados, sem nenhum `margin`. Com o vão na prateleira, nenhum pote precisa de espaço próprio.

**Caso 3: um espaço só num lugar.** No menu de um app, o botão Sair fica mais longe dos outros:

```javascript
sair: { marginTop: 24 },
```

Prefira o `gap` na `View` de fora: o `margin` vai em cada filho, precisa ser lembrado em todos e sobra no último.

---

## :icon[notebook-pen] Exercícios: Espaços

:::example Exercícios
1. No botão Pedir da lanchonete, o texto encosta na borda. `padding`, `margin` ou `gap`?
2. Cinco treinos, com 12 entre um e outro e nada nas pontas: `lista: { ___: 12 }`
3. Onde fica cada espaço da etiqueta de preço? Quanto sobra para o texto, na largura?

   ```javascript
   etiqueta: { width: 100, paddingHorizontal: 20, paddingVertical: 8 },
   ```

4. Cada item do menu tem `marginBottom: 16`, e sobra espaço embaixo do último. Como evitar?
:::

:::tip Respostas
1. `padding`: o espaço por dentro, até a borda
2. `gap`, na `View` de fora: o vão entre os filhos, nunca nas pontas
3. Por dentro: 20 de cada lado e 8 em cima e embaixo. Sobram 60 dos 100
4. Tire o `marginBottom` dos itens e ponha `gap: 16` na `View` de fora
:::

---

## :icon[milestone] Projeto 6 · Passo 4: os cartões

No topo, o `import` do kit ganha `Badge` e `Cartao`, e chega a lista das casas:

```jsx
import { Badge, Cartao, Tela } from '@/components/ui';
import { casas } from '@/data/casas';
```

Depois do `topo`, ainda dentro da `Tela`:

```jsx
{casas.map((casa) => (
  <Cartao key={casa.id} style={estilos.cartao}>
    <View style={estilos.foto} />
    <View style={estilos.textos}>
      <Text style={estilos.nome}>{casa.nome}</Text>
      <Text style={estilos.detalhe}>
        {casa.bairro}, {casa.cidade}
      </Text>
      <Badge texto={`${casa.capacidade - casa.ocupacao} vagas`} />
    </View>
  </Cartao>
))}
```

E, no `StyleSheet`:

```javascript
cartao: { flexDirection: 'row', alignItems: 'center', gap: 16 },
foto: { width: 72, height: 72, borderRadius: 8, backgroundColor: '#e2dbd1' },
textos: { flex: 1, gap: 4 },
nome: { fontSize: 16, fontWeight: 'bold' },
detalhe: { fontSize: 13 },
```

**Pronto quando:** 12 cartões brancos, um embaixo do outro; no primeiro, a caixa bege, "Lar da Mel", "Pinheiros, São Paulo" e o selo "0 vagas".

---

## :icon[list-ordered] Os cartões em português

| Linha | O que ela diz |
|---|---|
| `casas.map((casa) => ( ... ))` | "um cartão para cada casa": o `map` com JSX do E25 |
| `key={casa.id}` | o crachá de cada cartão |
| `style={estilos.cartao}` | o seu estilo por cima do do `Cartao`: em linha |
| `<View style={estilos.foto} />` | a caixa no lugar da foto, que chega no E35 |
| `{casa.bairro}, {casa.cidade}` | dois campos entre chaves, com a vírgula no meio |
| `` `${casa.capacidade - casa.ocupacao} vagas` `` | a conta na template string do E06: `20 - 20` dá "0 vagas" |

O `'#e2dbd1'` é um **código de cor**, o bege das bordas do kit. No E34, ele vira um nome do tema.

---

## :icon[milestone] Projeto 6 · Sua vez: a faixa de números

Agora, sozinho. Entre o topo e os cartões, mostre três cartões lado a lado, do mesmo tamanho, com os números do app: casas, cidades e vagas.

:::tip Dicas
- `resumoDasCasas(casas)`, de `@/utils`, devolve `{ casas: 12, cidades: 5, vagas: 76 }`. Guarde numa `const resumo`, antes do `return`
- Uma `View` com `flexDirection: 'row'` e `gap: 8` guarda os três `Cartao`; cada `Cartao` com `flex: 1` e `alignItems: 'center'`
- O número com `fontSize: 28` e negrito; o rótulo com `fontSize: 13`
:::

**Pronto quando:** aparecem 12 casas, 5 cidades e 76 vagas, em três caixas iguais lado a lado, entre o topo e o primeiro cartão.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Project is incompatible` | o Expo Go é de outra versão | atualizar na loja (SDK 58) |
| `Unable to resolve "@/component/ui"` | caminho errado: falta o s | conferir a grafia; `npx expo start -c` |
| `Property 'casas' doesn't exist` | faltou o `import` | `import { casas } from '@/data/casas';` |
| `Text strings must be rendered` | texto solto numa `View` | pôr o texto num `Text` |
| `unique "key" prop` | `map` sem `key` | `key={casa.id}` no `Cartao` |

Sem mensagem, o nome comprido passa da borda? Falta `flex: 1` nos textos. Os textos sumiram no fundo escuro? Hoje, tema claro.

---

## :icon[milestone] Projeto 6 · Etapa 1 pronta

No celular, no tema claro:

- nada atrás do entalhe nem da barra de status
- o topo, com o título, a frase e o círculo
- a faixa com 12 casas, 5 cidades e 76 vagas
- os 12 cartões, e o nome comprido quebrando dentro do cartão

No segundo terminal:

```bash
git add .
git commit -m "Projeto 6: etapa 1, tela Início com flexbox"
git push
```

O que faltar, termine em casa antes do E34: a etapa inteira está na página do Projeto 6, e o E34 começa com esta Início pronta.

---

## Resumo

:::summary
- A `Tela` do kit põe o conteúdo na área segura, longe do entalhe e das barras do celular
- O atalho `@` aponta para a pasta `src/`: o mesmo `import` funciona em qualquer arquivo
- `flexDirection` escolhe a direção: `'column'`, o padrão, ou `'row'`, lado a lado
- `justifyContent` arruma as caixas no eixo principal; `alignItems`, no eixo cruzado
- `flex: 1` fica com o espaço que sobra e deixa o texto quebrar a linha
- `padding` é o espaço por dentro, `margin` o de fora e `gap` o vão entre os filhos
:::

---

## :icon[arrow-right] Próximos passos

No E34, a Início ganha as cores e os nomes do kit:

- :icon[tags] os números do `StyleSheet` viram **tokens**, valores com nome guardados num lugar só
- :icon[sun] o tema claro e o escuro, com as cores do `useTema()`
- :icon[mouse-pointer-click] o botão de tema, no lugar do círculo do topo
