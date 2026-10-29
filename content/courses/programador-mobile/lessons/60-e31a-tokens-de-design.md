---
title: "Tokens de design: cores, espaço e tipografia"
summary: Troque cores e medidas espalhadas pelo código por tokens guardados em um único arquivo do app.
module: layout-rn
duration_minutes: 40
objectives:
  - Identificar o custo de cores e medidas espalhadas pelo código
  - Criar tokens de cor, espaçamento, fonte e raio em src/theme/tokens.js
  - Aplicar sombras no iOS e no Android com Platform.select
  - Refatorar um componente trocando valores literais por tokens
---

# Tokens de design: cores, espaço e tipografia

Programador Mobile · Encontro E31 · Aula 60 de 89

---

## O que você vai aprender

:::goal
- Reconhecer o custo de cores e medidas espalhadas pelo código
- Nomear cores, espaçamentos, fontes e raios como **tokens** em `src/theme/tokens.js`
- Criar uma sombra que funciona no iOS e no Android com `Platform.select`
- Refatorar o cartão da `Inicio` sem nenhuma cor literal
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **token de design** | um nome para uma decisão visual: `textoSuave` em vez de `'#475569'` |
| **valor literal** | a cor ou a medida escrita direto no código, como `'#475569'` ou `16` |
| **escala** | uma lista curta de valores permitidos, como os tamanhos de roupa P, M e G |
| **tipografia** | os tamanhos e os pesos das letras do app |
| **raio** | o quanto um canto é arredondado |
| **refatorar** | mudar como o código está escrito sem mudar o que a tela mostra (E04) |

---

## 40 tons de cinza

Uma loja online cresce de 3 para 40 telas em um ano. Cada pessoa escolheu "um cinza bonito" na hora de escrever o estilo: `'#666'` aqui, `'#6b6b6b'` ali, `'#777'` e `'gray'` mais adiante. Os espaçamentos seguiram o mesmo caminho: 10, 12, 15, 16.

Então chegam dois pedidos:

- O designer, quem desenha as telas: "o texto secundário está fraco, escureçam um pouco"
- Os clientes: "cadê o tema escuro?"

Cada pedido vira uma caça a valores em dezenas de arquivos, e sempre sobra uma tela com o cinza antigo.

:::question
Na `Inicio` que você montou no E30, quantas linhas você mudaria para escurecer todos os textos secundários? E se o app tivesse 40 telas?
:::

---

## Tokens

Numa loja de tintas, você pede a cor pela mistura ou pelo nome?

---

## :icon[tag] Tokens: nomes, não valores

Um **token de design** é um nome para uma decisão visual: `cores.claro.textoSuave` em vez de `'#475569'`, `espaco.md` em vez de `16`. O valor mora em um único arquivo; os componentes só conhecem o nome.

Pense numa paleta de tintas com nome: cada pote tem uma etiqueta, como "textoSuave", e a cor fica dentro do pote. As telas pegam a tinta pelo nome. Quer outro cinza? Troque a tinta do pote, e tudo o que usa aquele nome muda junto.

| Valor solto | Token |
|---|---|
| `color: '#475569'` | `color: cores.claro.textoSuave` |
| `padding: 16` | `padding: espaco.md` |
| `fontSize: 20` | `fontSize: fonte.titulo` |
| `borderRadius: 12` | `borderRadius: raio.md` |

---

## :icon[tag] Tokens na prática

:::center
![Antes e depois: os cinzas '#666', '#6b6b6b', '#777' e 'gray', um em cada arquivo, viram o mesmo nome textoSuave, e o valor '#475569' fica só em tokens.js](images/e31-tokens-um-lugar.svg)
:::

**Caso 1: os cinzas da loja de 40 telas** viram um papel só, `textoSuave`, e o valor `'#475569'` passa a morar em `tokens.js`.

**Caso 2: o designer pede o texto secundário mais escuro.** Você muda um valor em `tokens.js`, numa linha só. Na tela: categorias, legendas e rótulos de todas as telas escurecem juntos.

---

## Cores pelo papel

O pote se chama cinza claro e o app ficou escuro: o nome continua certo?

---

## :icon[sliders-horizontal] Cores pelo papel, não pela aparência

Um token de cor diz **para que** a cor serve, o papel dela. `cinzaClaro` vira mentira quando o tema escurece; `borda` continua verdade. A Lojinha usa 8 papéis:

| Grupo | Tokens | Onde aparece |
|---|---|---|
| Fundos | `fundo`, `superficie` | a tela; cartões e abas |
| Textos | `texto`, `textoSuave` | nome do produto; categoria e legendas |
| Linhas | `borda` | contorno do cartão, divisórias |
| Ação | `primaria` | preço, aba ativa, botões |
| Estados | `perigo`, `sucesso` | erro; "Adicionado ao carrinho" |

Os valores ficam em `cores.claro`. A paleta `cores.escuro` usa os mesmos 8 nomes e entra em cena na próxima aula.

---

## :icon[sliders-horizontal] Cores pelo papel na prática

Três textos do cartão de produto, cada um com o seu papel:

```jsx
<Text style={{ color: cores.claro.textoSuave }}>Áudio</Text>
<Text style={{ color: cores.claro.primaria }}>R$ 199,90</Text>
<Text style={{ color: cores.claro.sucesso }}>Adicionado ao carrinho</Text>
```

- **Caso 1:** a categoria é texto secundário: `textoSuave`, um cinza
- **Caso 2:** o preço é ação, o que leva a comprar: `primaria`, um roxo
- **Caso 3:** a confirmação é estado de sucesso: `sucesso`, um verde

Se amanhã o roxo virar azul, o nome `primaria` continua certo. Um token chamado `roxo` viraria mentira.

---

## Pense

:::question Quantas cores este app usa?
A tela "Meu pedido" de um app de delivery tem estes estilos:

- fundo da tela `#fafafa` e cartões `#ffffff`
- nome do prato `#222222` e preço `#212121`
- descrição `#666666` e horário `#757575`
- bordas `#eeeeee` e divisórias `#e0e0e0`
- botão "Confirmar" `#e53935` e selo "Entrega grátis" `#43a047`

Quantas cores diferentes existem? De quantos tokens a tela precisa?
:::

:::tip Resposta
São 10 valores, mas só 7 papéis: `fundo`, `superficie`, `texto`, `textoSuave`, `borda`, `primaria` e `sucesso`. Ninguém enxerga a diferença entre `#222222` e `#212121`, mas alguém vai esquecer um deles na próxima mudança.
:::

---

## Escalas

Por que a loja vende roupa em P, M e G, e não em todas as medidas?

---

## :icon[layout-grid] Espaçamento de 4 em 4

Medidas soltas como 10, 13 e 15 deixam a tela torta: um cartão respira mais que o vizinho e ninguém sabe dizer por quê. Uma **escala de espaçamento** limita as escolhas a poucos valores, todos múltiplos de 4, como os tamanhos de roupa: PP, P, M, G e GG servem em quase todo mundo.

```javascript
export const espaco = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
```

Os nomes vêm das etiquetas de roupa em inglês:

- `xs` (*extra small*, PP) e `sm` (*small*, P)
- `md` (*medium*, M)
- `lg` (*large*, G) e `xl` (*extra large*, GG)

---

## :icon[table] Onde usar cada espaço

| Token | Valor | Uso típico |
|---|---|---|
| `xs` | 4 | entre um texto e o seu complemento |
| `sm` | 8 | entre cartões de uma lista |
| `md` | 16 | margem da tela, recheio do cartão |
| `lg` | 24 | entre seções |
| `xl` | 32 | respiro antes de um botão principal |

Ficou na dúvida entre 14 e 18? Escolha `md`. Com poucas opções, as telas se alinham sem esforço.

---

## :icon[text] Tipografia em poucos tamanhos

A **tipografia** são os tamanhos e os pesos das letras. É outra escala de tamanhos de roupa. Com nove tamanhos de fonte, nada parece título e nada parece legenda. Quatro dão conta de uma loja inteira:

```javascript
export const fonte = { pequena: 12, corpo: 16, titulo: 20, destaque: 28 };
```

| Token | Valor | Na Lojinha |
|---|---|---|
| `pequena` | 12 | categoria, avaliação, rótulo das abas |
| `corpo` | 16 | nome do produto, descrição |
| `titulo` | 20 | preço no cartão, título de seção |
| `destaque` | 28 | nome da loja, total do carrinho |

Para criar hierarquia, combine tamanho e peso: `fontWeight: 'bold'` no nome e no preço, peso normal na categoria. Quatro tamanhos e dois pesos cobrem todos os níveis de uma tela.

---

## :icon[square] Raios e bordas

O **raio** diz o quanto um canto é arredondado. Cantos arredondados também seguem uma escala, do menor elemento ao maior:

```javascript
export const raio = { sm: 6, md: 12, lg: 20 };
```

- `raio.sm`: imagem pequena, selo de desconto
- `raio.md`: cartão de produto, campo de texto
- `raio.lg`: botão em forma de pílula, painel que sobe do rodapé

A borda é a forma mais barata de separar um cartão do fundo, e funciona nos dois temas: `borderWidth: 1` com `borderColor: cores.claro.borda`.

:::tip
Medidas que só um componente usa, como a imagem de 80 por 80 do cartão, ficam no próprio componente. Vira token o que se repete pelo app.
:::

---

## O arquivo tokens.js

Onde fica guardada cada tinta numa loja?

---

## :icon[file-code] src/theme/tokens.js: as cores

O `tokens.js` é o armário das tintas: o único lugar com os valores. Crie a pasta `src/theme/` (*theme*, tema) e, nela, o arquivo. Primeiro, as duas paletas:

```javascript
export const cores = {
  claro: {
    fundo: '#f8fafc', superficie: '#ffffff', borda: '#e2e8f0',
    texto: '#0f172a', textoSuave: '#475569',
    primaria: '#6d28d9', perigo: '#b91c1c', sucesso: '#15803d',
  },
  escuro: {
    fundo: '#0f172a', superficie: '#1e293b', borda: '#334155',
    texto: '#f1f5f9', textoSuave: '#94a3b8',
    primaria: '#a78bfa', perigo: '#f87171', sucesso: '#4ade80',
  },
};
```

- `cores` é uma ficha com duas fichas dentro, `claro` e `escuro`
- `cores.claro.textoSuave` abre uma de cada vez: `cores`, depois `claro`, depois `textoSuave`

As duas paletas têm exatamente as mesmas chaves. É isso que vai permitir trocar uma pela outra sem tocar nos componentes.

---

## :icon[file-code] src/theme/tokens.js: espaço, fonte e raio

No mesmo arquivo, abaixo das cores:

```javascript
export const espaco = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

export const fonte = { pequena: 12, corpo: 16, titulo: 20, destaque: 28 };

export const raio = { sm: 6, md: 12, lg: 20 };
```

São quatro exportações nomeadas: cada `export` põe um objeto na vitrine do arquivo. Em cada tela, importe só o que usar:

```jsx
import { cores, espaco, fonte, raio } from '../theme/tokens';
```

O caminho `../theme/tokens` vale para arquivos em `src/telas/`: o `..` sobe de `telas` para `src`. Este é o **único arquivo** do app com códigos de cor.

---

## :icon[file-code] tokens.js na prática

Na `Inicio`, três estilos usam as três escalas:

```jsx
import { espaco, fonte, raio } from '../theme/tokens';

const estilos = StyleSheet.create({
  cartao: { padding: espaco.md, marginBottom: espaco.sm, borderRadius: raio.md },
  nome: { fontSize: fonte.corpo, fontWeight: 'bold' },
  botao: { paddingVertical: espaco.sm, paddingHorizontal: espaco.md, borderRadius: raio.lg },
});
```

- **Caso 1, o cartão:** recheio de 16, 8 até o próximo cartão e cantos de 12
- **Caso 2, o nome do produto:** tamanho 16, em negrito
- **Caso 3, o botão:** a pílula, com cantos de 20

Na tela, os mesmos números de antes. A diferença: cada um tem nome e mora num lugar só.

---

## Sombra

Por que um papel sobre a mesa parece levantado?

---

## :icon[layers] Sombra no iOS e no Android

A **sombra** faz o cartão parecer levantado do fundo, como um papel sobre a mesa. Cada plataforma desenha sombra do seu jeito: o iOS usa quatro propriedades `shadow`; o Android usa só **`elevation`** (elevação), a altura simulada do elemento. **`Platform.select`**, do E30, entrega o objeto da plataforma em que o app está rodando:

```jsx
import { Platform } from 'react-native';
import { cores } from '../theme/tokens';

const sombra = Platform.select({
  ios: {
    shadowColor: cores.claro.texto, // quase preto, vindo do token
    shadowOpacity: 0.1, // de 0 a 1: quão forte
    shadowRadius: 8, // quanto a sombra se espalha
    shadowOffset: { width: 0, height: 4 }, // deslocada para baixo
  },
  android: { elevation: 3 }, // quanto maior, mais alto e mais sombra
});
```

Aplique com spread dentro do estilo: `cartao: { ...sombra, borderRadius: raio.md }`. Os `...` copiam os campos da `sombra` para dentro do `cartao`.

---

## :icon[layers] Sombra na prática

**Caso 1: o cartão levantado.** A sombra junto com um fundo:

```jsx
cartao: {
  ...sombra,
  backgroundColor: cores.claro.superficie,
  borderRadius: raio.md,
  padding: espaco.md,
},
```

Na tela: o cartão parece um papel sobre a mesa, no iPhone e no Android.

**Caso 2: o mesmo cartão, sem fundo.**

```jsx
cartao: { ...sombra, borderRadius: raio.md, padding: espaco.md },
```

Na tela: no Android, nenhuma sombra. A `elevation` só aparece com `backgroundColor`.

---

## Nenhuma cor literal

Uma parede pintada com tinta fora da paleta: o que acontece quando a loja muda a cor?

---

## :icon[ban] Nunca cor literal no componente

A regra da Lojinha daqui em diante: **nenhuma cor escrita à mão** em telas e componentes. Toda cor vem de `cores`; só `tokens.js` tem códigos de cor. Cor literal é tinta misturada fora da paleta: ninguém lembra de trocá-la.

Para fiscalizar, abra a busca em todos os arquivos do VS Code (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>F</kbd>):

- procure `#` em `src/telas` e `src/components`
- procure nomes de cor em inglês, como `'white'` (branco), `'black'` (preto) e `'gray'` (cinza)
- cada resultado é uma cor sem papel: dê um token a ela

O mesmo vale para medidas repetidas: `padding: 15` em três telas é um `espaco.md` esperando para nascer.

---

## Pratique

:::example Desafio: o cartão da Inicio
Este é o estilo do cartão de produto do jeito que muita gente deixou no E30. Refatore: troque cada valor que se repete pelo token mais próximo (3 minutos):

```jsx
cartao: {
  flexDirection: 'row', gap: 15, padding: 15, marginBottom: 10,
  backgroundColor: '#fff', borderRadius: 10,
  borderWidth: 1, borderColor: '#ddd',
},
imagem: { width: 80, height: 80, borderRadius: 8, backgroundColor: '#ccc' },
nome: { fontSize: 17, color: '#222' },
categoria: { fontSize: 13, color: 'gray' },
preco: { fontSize: 19, fontWeight: 'bold', color: '#6d28d9' },
```

Os tokens: `espaco` xs 4, sm 8, md 16, lg 24, xl 32; `fonte` pequena 12, corpo 16, titulo 20, destaque 28; `raio` sm 6, md 12, lg 20; e as 8 cores de `cores.claro`.
:::

---

## :icon[pencil] O cartão com tokens

:::tip Resposta
```jsx
cartao: {
  flexDirection: 'row', gap: espaco.md, padding: espaco.md,
  marginBottom: espaco.sm, borderRadius: raio.md, borderWidth: 1,
  backgroundColor: cores.claro.superficie, borderColor: cores.claro.borda,
},
imagem: {
  width: 80, height: 80, borderRadius: raio.sm,
  backgroundColor: cores.claro.borda,
},
nome: { fontSize: fonte.corpo, color: cores.claro.texto },
categoria: { fontSize: fonte.pequena, color: cores.claro.textoSuave },
preco: { fontSize: fonte.titulo, fontWeight: 'bold', color: cores.claro.primaria },
```

Os valores quebrados viraram o token mais próximo: 15 virou `md`, 10 virou `sm`, 17 virou `corpo`. `'#222'` e `'gray'` ganharam um papel. O `80` e o `borderWidth: 1` ficam: são medidas deste cartão.
:::

Na tela, quase nada muda. A diferença aparece no dia em que alguém pedir outra cor.

:::warning
Uma única cor literal já estraga o tema escuro: aquele cartão continua branco quando todo o resto escurece.
:::

---

## :icon[triangle-alert] Erros comuns

:::warning
- Nomear o token pela aparência (`cinzaClaro`, `roxo`): no tema escuro o nome vira mentira; use o papel (`textoSuave`, `primaria`)
- Criar um token para cada valor quebrado (`espaco.quinze`): a escala existe para limitar as escolhas
- `elevation` sem `backgroundColor`: no Android, a sombra não aparece
- `overflow: 'hidden'` (esconder o que passa da borda) no cartão para arredondar a imagem: no iOS, ele corta a sombra junto; arredonde a própria imagem com `borderRadius`
- Esquecer o `export` de um token: o import chega `undefined` e a tela vermelha avisa que não consegue ler `claro` de `undefined`
:::

---

## Resumo

:::summary
- Valores soltos se multiplicam: cada mudança de cor ou de espaço vira uma caça em dezenas de arquivos
- Um token é um nome para uma decisão visual, como o pote com etiqueta numa paleta de tintas; o valor mora só em `src/theme/tokens.js`
- Cores têm nome de papel; espaços seguem a escala de 4; a fonte tem quatro tamanhos e o raio, três
- A sombra usa `shadow` no iOS e `elevation` no Android, escolhidos com `Platform.select`
- Regra da Lojinha: nenhuma cor literal em telas e componentes
:::

---

## :icon[arrow-right] Próximos passos

A `Inicio` agora usa `cores.claro` em todo lugar. E o tema escuro? Trocar `claro` por `escuro` à mão em cada estilo seria a mesma caça de antes.

Na próxima aula, o app escolhe a paleta sozinho:

- :icon[smartphone] `useColorScheme` lê o tema do sistema
- :icon[sun] `TemaProvider` e `useTema()` entregam as cores da vez a qualquer tela
- :icon[mouse-pointer-click] um botão alterna entre claro e escuro
