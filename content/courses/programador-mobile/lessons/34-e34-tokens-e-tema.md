---
title: Tokens e tema
summary: A Início do Casas de adoção troca números por tokens, ganha as cores do tema claro e escuro e um botão de tema.
module: layout-rn
duration_minutes: 90
objectives:
  - Trocar os números de espaço, canto e letra do StyleSheet pelos tokens do kit
  - Explicar como o useTema() entrega o mesmo tema a todas as telas e peças
  - Pintar textos e caixas com as cores do tema no array de estilos
  - Alternar entre o tema claro e o escuro com o BotaoIcone do kit
---

# Tokens e tema

Programador Mobile · Encontro E34 · Aula 34 de 45

---

## O que você vai aprender

:::goal
- Dar nome aos espaços, aos cantos e às letras do app: os tokens
- Escolher a cor pelo papel dela: texto, texto suave, primária
- Entender como todas as telas leem o mesmo tema
- Pintar a Início com as cores do tema claro e do escuro
- Trocar o tema com um botão
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **token de design** | um nome para uma decisão visual: `espaco.md` no lugar de `16` |
| **tema** | o jeito do app na tela: claro, de fundo bege, ou escuro, de fundo quase preto |
| **paleta** | as cores de um tema, cada uma com o seu papel: fundo, texto, borda |
| **contexto** | um valor que todas as telas leem, sem passar de peça em peça pelas props |
| **array de estilos** | uma lista de estilos no `style`: o React Native junta todos num só |

---

## A Início no escuro

Ponha o celular no tema escuro e abra o app do E33. O fundo e os cartões do kit escurecem sozinhos. Os seus textos continuam pretos, e somem.

| A Início | No fim do E33 | No fim de hoje |
|---|---|---|
| espaços e letras | números: `16`, `24`, `13` | tokens: `espaco.md`, `fonte.titulo` |
| a cor dos seus textos | nenhuma: o preto padrão | a do tema: `cores.texto` |
| no tema escuro | os textos somem | tudo se lê |
| o círculo do topo | só guarda o lugar | o botão que troca o tema |

:::question
Por que as peças do kit escurecem sozinhas, e os seus textos não?
:::

---

## Tokens

Numa loja de tintas, você pede a cor pela mistura ou pelo nome?

---

## :icon[tags] Tokens: o valor mora num lugar só

O `tema.js` do Gota, no E30, já era uma paleta de tintas com nome: cada cor tinha um nome, e o código dela morava num lugar só. Um **token de design** é isso, para qualquer decisão visual. No kit, os espaços, os cantos e as letras também ganham nome: `espaco.md` no lugar de `16`, `fonte.titulo` no lugar de `24`. O valor mora no `src/theme/tokens.js`:

```javascript
export const espaco = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const raio = { sm: 8, md: 12, lg: 20, redondo: 999 };
export const fonte = { pequena: 13, corpo: 16, subtitulo: 18, titulo: 24, destaque: 28 };
```

- `espaco` vale para `gap` e `padding`; `raio`, para os cantos (`borderRadius`); `fonte`, para o tamanho da letra (`fontSize`)
- Cada um é uma ficha, como no E13: `espaco.md` lê o campo `md` e vale `16`
- `xs`, `sm`, `md`, `lg` e `xl` são tamanhos de roupa em inglês: PP, P, M, G e GG

---

## :icon[tags] Cores com nome de papel

As cores do kit também vão além do Gota: o nome diz **para que** a cor serve, o **papel** dela, e não como ela é. Um nome de aparência, como `cinzaClaro`, vira mentira quando o app escurece; `textoSuave` continua certo nos dois temas.

:::center
![Antes e depois: os cinzas '#666', '#6b6b6b', '#777' e 'gray', um em cada arquivo, viram o mesmo nome textoSuave, e o valor fica só em tokens.js](images/e31-tokens-um-lugar.svg)
:::

Num app que cresceu sem tokens, cada tela escolheu o seu cinza. Com tokens, todas pedem `textoSuave`: para escurecer o texto de apoio do app inteiro, você muda uma linha.

---

## :icon[tags] Tokens na prática

**Caso 1: os números da Início.** Cada número do E33 tem um token de mesmo valor:

| Na Início | Número | Token |
|---|---|---|
| `gap` do topo e do cartão | 16 | `espaco.md` |
| `gap` dos textos | 4 | `espaco.xs` |
| letra do título | 24 | `fonte.titulo` |
| letra da frase e do nome | 16 | `fonte.corpo` |
| letra do bairro | 13 | `fonte.pequena` |
| canto da foto | 8 | `raio.sm` |

**Caso 2: mudar num lugar só.** `md: 32` no `tokens.js` dobra todo espaço médio, também nas peças do kit.

**Caso 3: o que fica número.** Os 72 da foto são a medida daquela caixa, não um espaço que se repete.

---

## :icon[milestone] Projeto 6 · Passo 1: os números viram tokens

:::steps
1. No `app/index.js`, um `import` novo, logo abaixo do de `@/data/casas`
2. No `StyleSheet`, troque os números de `gap`, `fontSize` e `borderRadius` pelos tokens
3. Salve e olhe o celular
:::

```jsx
import { espaco, fonte, raio } from '@/theme';
```

```javascript
topo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: espaco.md },
titulos: { flex: 1, gap: espaco.xs },
titulo: { fontSize: fonte.titulo, fontWeight: 'bold' },
subtitulo: { fontSize: fonte.corpo },
cartao: { flexDirection: 'row', alignItems: 'center', gap: espaco.md },
foto: { width: 72, height: 72, borderRadius: raio.sm, backgroundColor: '#e2dbd1' },
textos: { flex: 1, gap: espaco.xs },
nome: { fontSize: fonte.corpo, fontWeight: 'bold' },
detalhe: { fontSize: fonte.pequena },
```

A faixa de números (`numeros`, `valor` e `rotulo`) fica para a Sua vez; o `reserva` sai no passo 3.

**Pronto quando:** o celular mostra a mesma tela de antes. Teste o token: `md: 32` no `tokens.js` afasta tudo; depois, volte para 16.

---

## Tema claro e escuro

Meia-noite, quarto escuro, e o app abre todo branco. O que dá vontade de fazer?

---

## :icon[sun] Duas paletas, os mesmos nomes

O **tema** é o jeito do app na tela: claro ou escuro. Cada tema tem a sua **paleta**, as cores com os seus papéis. No `tokens.js`, `cores.claro` e `cores.escuro` têm **os mesmos nomes**: as etiquetas dos potes são iguais, só muda a tinta de dentro.

| Papel | Claro | Escuro |
|---|---|---|
| `fundo` | `#f7f4ef`, bege claro | `#15120f`, quase preto |
| `superficie`, dos cartões | `#ffffff`, branco | `#211d19`, marrom-escuro |
| `texto` | `#1f1a14`, marrom-escuro | `#f4efe8`, quase branco |
| `textoSuave` | `#5c5348` | `#b8ad9f` |
| `primaria` | `#0f766e`, verde-azulado | `#5eead4`, verde-água |
| `borda` | `#e2dbd1` | `#3d362f` |

Há ainda `sobreCor`, `sucesso`, `alerta` e `perigo`, usados pelo `Badge` e pelo `Botao`.

---

## :icon[smartphone] O tema na prática

**Caso 1: o app segue o celular.** O `app.json` do kit tem `"userInterfaceStyle": "automatic"`: o app abre no tema do celular e acompanha quando ele muda. Para trocar:

- **Android**: Configurações, Tela (ou Visor), Tema escuro; ou o atalho da barra de notificações
- **iPhone**: Ajustes, Tela e Brilho, Escuro; ou a Central de Controle

**Caso 2: o contraste**, a diferença de claridade entre o texto e o fundo. Numa placa de rua, letra branca no azul se lê de longe. Texto pede pelo menos **4,5 : 1**.

| Texto sobre o cartão escuro | Contraste |
|---|---|
| `texto` da paleta escura, `#f4efe8` | 14,6 : 1 |
| o preto padrão dos seus textos | 1,3 : 1: some |

---

## Contexto

Como avisar todo mundo da casa sem falar com cada um?

---

## :icon[pin] Contexto: o quadro de avisos da casa

O tema precisa chegar a todas as telas e peças. Passar as cores por props, de peça em peça, daria trabalho em cada tela. O React tem outro caminho: o **contexto**, um valor que todos leem, como o quadro de avisos da casa, que todos os cômodos leem. No kit, o quadro fica em `app/_layout.js`, em volta do app inteiro:

```jsx
export default function LayoutRaiz() {
  return (
    <TemaProvider>
      <CasasProvider>
        <Pilha />
      </CasasProvider>
    </TemaProvider>
  );
}
```

- O **`TemaProvider`** (provedor do tema) pendura o aviso no quadro: as cores da vez, se está escuro e a função que troca
- Qualquer tela ou peça **dentro** dele lê o quadro com **`useTema()`**
- Tudo vem pronto no kit: o `CasasProvider` é outro quadro, o da lista de casas (E36), e a `Pilha` são as telas do app (E37)

---

## :icon[pin] Quem lê o quadro

:::center
![Diagrama: o TemaProvider, em app/_layout.js, envolve o app; a Tela, o Cartao, o BotaoIcone e a sua Inicio pedem o mesmo quadro com useTema(), que tem cores, escuro e alternarTema; fora do TemaProvider, o useTema() dá erro](images/e34-quadro-de-avisos.svg)
:::

Cada peça pede o quadro com `useTema()`, e todas recebem o mesmo aviso. Quando o tema muda, o quadro muda, e todas desenham de novo, juntas. Só quem está dentro do `TemaProvider` lê o quadro: é por isso que ele fica na raiz, em volta de tudo.

---

## :icon[list-ordered] O useTema em português

```jsx
const { cores, escuro, alternarTema } = useTema();
```

| Parte | O que ela diz |
|---|---|
| `useTema()` | "leia o quadro do tema". Começa com `use`: é um **hook**, como o `useState` do E26 |
| `const { ... } =` | "tire do objeto estes campos, cada um na sua caixa": a desestruturação do E13 |
| `cores` | a paleta do tema da vez: `cores.texto`, `cores.primaria`... |
| `escuro` | `true` no tema escuro, `false` no claro |
| `alternarTema` | a função que troca para o outro tema |

Como o `useState`, o `useTema()` vai **dentro** da função da tela, na primeira linha. Fora dela, no `StyleSheet` por exemplo, o React reclama com `Invalid hook call`.

---

## :icon[pin] Contexto na prática

As peças do kit já leem o quadro. É por isso que escurecem sozinhas:

| Quem lê | O que usa do quadro | No tema escuro |
|---|---|---|
| `Tela` | `cores.fundo` | o fundo fica quase preto |
| `Cartao` | `cores.superficie` e `cores.borda` | o cartão fica marrom-escuro |
| `Badge` | `cores.textoSuave` e `cores.sobreCor` | o selo muda de cor |
| `app/_layout.js` | `escuro` | as letras da barra de status ficam claras |
| a tela Sobre | `escuro` e `alternarTema` | o botão passa a dizer "Usar tema claro" |
| a sua Início | nada, ainda | os textos somem |

Um aviso no quadro, e todos leem. Hoje, a sua Início passa a ler também.

---

## Pratique

:::example Desafio
O celular está no tema escuro. A função `Inicio` começa assim:

```jsx
const { cores, escuro } = useTema();
console.log(escuro, cores.texto, cores.primaria);
```

O que aparece no terminal do Expo? E se o celular estiver no tema claro?
:::

:::tip Resposta
1. No escuro: `LOG  true #f4efe8 #5eead4`. O `cores` é a paleta escura
2. No claro: `LOG  false #1f1a14 #0f766e`. Os nomes são os mesmos; o quadro entrega a outra paleta
:::

---

## Cor no array

Uma parede se constrói uma vez. E a tinta dela, quantas vezes dá para trocar?

---

## :icon[layers] O array de estilos: a estrutura e a cor

O `StyleSheet.create` roda **uma vez**, quando o arquivo carrega, fora da função da tela. Ele nunca fica sabendo que o tema mudou, e o `useTema()` não funciona lá. É como a parede e a tinta: a parede se constrói uma vez; a tinta, você troca quando quiser, da paleta da vez. Por isso cada estilo tem duas partes:

- **a estrutura** (espaço, letra, canto, flexbox): não muda com o tema; fica no `StyleSheet`, com tokens
- **a cor**: muda com o tema; vem do `useTema()`, num objeto escrito ali mesmo, no `style`

As duas se juntam num **array de estilos**: um array, a lista entre colchetes da aula 3, no lugar de um estilo só:

```jsx
<Text style={[estilos.titulo, { color: cores.texto }]}>Casas de adoção</Text>
```

---

## :icon[list-ordered] O array, item por item

O React Native lê o array da esquerda para a direita e junta tudo num estilo só. Se dois itens trazem a mesma propriedade, vale a do **último**.

`style={[estilos.titulo, { color: cores.texto }]}`, no tema claro:

| Item | O que ele traz | O estilo até aqui |
|---|---|---|
| 1: `estilos.titulo` | `fontSize: fonte.titulo` (24) e `fontWeight: 'bold'` | letra 24, negrito |
| 2: `{ color: cores.texto }` | `color: '#1f1a14'` | letra 24, negrito, marrom-escuro |

No tema escuro, o item 1 é o mesmo. O item 2 traz `'#f4efe8'`, e o título fica quase branco. Só a cor mudou.

---

## :icon[layers] O array na prática

**Caso 1: o texto de apoio**, na cor suave do tema:

```jsx
<Text style={[estilos.subtitulo, { color: cores.textoSuave }]}>Adote perto de você</Text>
```

**Caso 2: uma caixa**, com o fundo na cor da borda. É o lugar da foto até o E35:

```jsx
<View style={[estilos.foto, { backgroundColor: cores.borda }]} />
```

**Caso 3: o último ganha.** Um nome maior que os outros, sem mudar o `StyleSheet`:

```jsx
<Text style={[estilos.nome, { fontSize: fonte.subtitulo }]}>{casa.nome}</Text>
```

O `estilos.nome` traz a letra 16 e o negrito; o objeto do fim troca a letra para 18. O negrito fica.

---

## :icon[milestone] Projeto 6 · Passo 2: as cores do tema

:::steps
1. No `import` de `@/theme`, acrescente `useTema`; na primeira linha da `Inicio`, chame o `useTema()`
2. O título, a frase, a caixa da foto, o nome e o "bairro, cidade" ganham o array com a cor
3. Tire o `backgroundColor: '#e2dbd1'` do estilo `foto`
:::

```jsx
import { espaco, fonte, raio, useTema } from '@/theme';

export default function Inicio() {
  const { cores } = useTema();
  const resumo = resumoDasCasas(casas);
```

```jsx
<Text style={[estilos.titulo, { color: cores.texto }]}>Casas de adoção</Text>
<Text style={[estilos.subtitulo, { color: cores.textoSuave }]}>Adote perto de você</Text>
```

```jsx
<View style={[estilos.foto, { backgroundColor: cores.borda }]} />
<View style={estilos.textos}>
  <Text style={[estilos.nome, { color: cores.texto }]}>{casa.nome}</Text>
  <Text style={[estilos.detalhe, { color: cores.textoSuave }]}>
    {casa.bairro}, {casa.cidade}
  </Text>
```

**Pronto quando:** no claro, os textos ficam marrom-escuros e marrom-acinzentados. Com o celular no escuro, a tela inteira escurece, e tudo se lê.

---

## O botão de tema

E se a pessoa quiser o tema escuro mesmo de dia?

---

## :icon[mouse-pointer-click] BotaoIcone: o botão só com ícone

O kit traz o **`BotaoIcone`**: um botão redondo, de 48 por 48, só com um ícone. Ele já lê o quadro: o fundo e a cor do ícone vêm do tema. As props, no manual da peça, no topo de `src/components/ui/BotaoIcone.js`:

```jsx
// Props:
//   icone    nome de um ícone do Ionicons, como 'moon-outline'
//   rotulo   o que o leitor de tela fala, como 'Usar tema escuro' (obrigatório: um ícone sozinho não diz nada)
//   onPress  o que fazer no toque
//   cor      cor do ícone (opcional; o padrão é cores.texto)
//   style    estilo extra
```

- **`icone`**: o nome de um desenho do **Ionicons**, um pacote de ícones que vem com o Expo
- **`rotulo`**: o **leitor de tela** fala em voz alta o que está na tela, para quem não enxerga. O ícone não diz nada a ele; o rótulo diz. O E39 volta nele
- **`onPress`**: a função do toque, como no `Pressable` do E30

---

## :icon[split] O ternário escolhe o ícone

O botão mostra o tema **para onde vai**: a lua leva ao escuro; o sol, ao claro. Quem escolhe é o ternário do E10, a placa aberto ou fechado:

```jsx
<BotaoIcone
  icone={escuro ? 'sunny-outline' : 'moon-outline'}
  rotulo={escuro ? 'Usar tema claro' : 'Usar tema escuro'}
  onPress={alternarTema}
/>
```

| `escuro` | `icone` | `rotulo` | O toque leva para |
|---|---|---|---|
| `false` | `'moon-outline'`, a lua | Usar tema escuro | o tema escuro |
| `true` | `'sunny-outline'`, o sol | Usar tema claro | o tema claro |

`onPress={alternarTema}` vai **sem** parênteses: você entrega a função, e o botão chama no toque. Com `alternarTema()`, ela roda na hora de desenhar a tela, e o toque não faz nada.

---

## :icon[milestone] Projeto 6 · Passo 3: o botão de tema

:::steps
1. No `useTema()`, peça também `escuro` e `alternarTema`
2. Acrescente `BotaoIcone` no `import` de `@/components/ui`
3. No lugar de `<View style={estilos.reserva} />`, o `BotaoIcone`; o estilo `reserva` sai do `StyleSheet`
:::

```jsx
import { Badge, BotaoIcone, Cartao, Tela } from '@/components/ui';
```

```jsx
const { cores, escuro, alternarTema } = useTema();
```

```jsx
<BotaoIcone
  icone={escuro ? 'sunny-outline' : 'moon-outline'}
  rotulo={escuro ? 'Usar tema claro' : 'Usar tema escuro'}
  onPress={alternarTema}
/>
```

**Pronto quando:** no topo, um botão redondo com uma lua. O toque escurece o app inteiro, as letras da barra de status ficam claras e a lua vira sol. Trocar o tema do celular continua mandando.

---

## :icon[milestone] Projeto 6 · Sua vez: os números e a sua cor

Agora, sozinho. Duas partes:

1. **A faixa de números**: `numeros`, `valor` e `rotulo` com `espaco.sm`, `fonte.destaque` e `fonte.pequena`; o número em `primaria`, o rótulo em `textoSuave`
2. **A sua cor primária**: no `src/theme/tokens.js`, troque as duas linhas `primaria` por um dos pares do comentário do topo, ou fique com a do kit

:::tip Dicas
- A cor vai no array de `style`, como no nome da casa
- `primaria` aparece em `claro` e em `escuro`: as duas mudam juntas, com as duas cores do mesmo par
:::

**Pronto quando:** <kbd>Ctrl</kbd> + <kbd>F</kbd> com `#` no `app/index.js` não acha nada; só os `72` e os `flex: 1` são números; a faixa aparece na sua cor, nos dois temas.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Property 'espaco' doesn't exist` | token sem `import` | `espaco`, `fonte` e `raio` no `import` de `@/theme` |
| `Invalid hook call` | `useTema()` fora da função, como no `StyleSheet` | na primeira linha da `Inicio` |
| `Property 'cores' doesn't exist` | `cores` sem o `useTema()`, ou com outro nome: `{ cor }` | `const { cores } = useTema();` |
| `Property 'BotaoIcone' doesn't exist` | a peça não está no `import` | `BotaoIcone` no `import` de `@/components/ui` |
| `Cannot update a component` | `onPress={alternarTema()}`: o toque não faz nada | `onPress={alternarTema}` |

Texto que some no escuro, sem mensagem: a cor ficou fora do array.

---

## :icon[milestone] Projeto 6 · Etapa 2 pronta

Confira no celular, nos dois temas:

- :icon[check] no claro, a Início do E33, agora com os textos marrom-escuros e os números na sua cor primária
- :icon[sun] no escuro, tudo se lê; o botão troca o tema, e a barra de status acompanha
- :icon[search] `#` no `app/index.js` não acha nada; no `StyleSheet`, só os `72` e os `flex: 1` continuam números

```bash
git add .
git commit -m "Projeto 6: etapa 2, tokens e tema"
git push
```

Faltou a faixa de números ou a sua cor? Termine em casa, pelos slides e pela página do projeto, com outro commit e `git push`.

---

## Resumo

:::summary
- Um token é um nome para uma decisão visual; o valor mora num lugar só, o `src/theme/tokens.js`: `espaco`, `raio`, `fonte` e as cores
- A cor tem nome de papel (`texto`, `textoSuave`, `primaria`), e as duas paletas, `claro` e `escuro`, têm os mesmos nomes
- O `TemaProvider`, em `app/_layout.js`, é o quadro de avisos; o `useTema()` lê o quadro e devolve `{ cores, escuro, alternarTema }`
- O `StyleSheet` roda uma vez: a estrutura fica nele, com tokens, e a cor entra no array: `style={[estilos.titulo, { color: cores.texto }]}`
- O `BotaoIcone` do kit, com o ternário, mostra a lua ou o sol e chama `alternarTema` no toque
:::

---

## :icon[arrow-right] Próximos passos

No E35, **Componentes próprios**: o cartão da casa sai da Início e vira o seu componente, o `CartaoCasa`:

- :icon[component] um arquivo seu, com a prop `casa`
- :icon[image] a foto da casa, vinda da internet
- :icon[map-pin] ícones de lugar e de animais
- :icon[badge-check] o selo certo: "Lotada", "Última vaga" ou "8 vagas"

O `useTema()` e o array de estilos de hoje vão junto para dentro dele.
