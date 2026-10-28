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

## 40 tons de cinza

Uma loja online cresce de 3 para 40 telas em um ano. Cada pessoa escolheu "um cinza bonito" na hora de escrever o estilo: `'#666'` aqui, `'#6b6b6b'` ali, `'#777'` e `'gray'` mais adiante. Os espaçamentos seguiram o mesmo caminho: 10, 12, 15, 16.

Então chegam dois pedidos:

- O designer: "o texto secundário está fraco, escureçam um pouco"
- Os clientes: "cadê o tema escuro?"

Cada pedido vira uma caça a valores em dezenas de arquivos, e sempre sobra uma tela com o cinza antigo.

:::question
Na `Inicio` que você montou no E30, quantas linhas você mudaria para escurecer todos os textos secundários? E se o app tivesse 40 telas?
:::

---

## :icon[tag] Tokens: nomes, não valores

Um **token de design** é um nome para uma decisão visual: `cores.claro.textoSuave` em vez de `'#475569'`, `espaco.md` em vez de `16`. O valor mora em um único arquivo; os componentes só conhecem o nome.

Pense nos contatos do celular: você liga para "Mãe", não decora o número. Se ela troca de chip, você atualiza um contato e todas as ligações continuam funcionando.

| Valor solto | Token |
|---|---|
| `color: '#475569'` | `color: cores.claro.textoSuave` |
| `padding: 16` | `padding: espaco.md` |
| `fontSize: 20` | `fontSize: fonte.titulo` |
| `borderRadius: 12` | `borderRadius: raio.md` |

---

## :icon[tag] Um valor, um lugar

:::center
![Antes e depois: os cinzas '#666', '#6b6b6b', '#777' e 'gray', um em cada arquivo, viram o mesmo nome textoSuave, e o valor '#475569' fica só em tokens.js](images/e31-tokens-um-lugar.svg)
:::

Os cinzas da loja de 40 telas viram um papel só, `textoSuave`, e o valor `'#475569'` passa a morar em `tokens.js`. Mudou a decisão? Você muda um valor em `tokens.js` e o app inteiro acompanha.

---

## :icon[sliders-horizontal] Cores pelo papel, não pela aparência

Um token de cor diz **para que** a cor serve. `cinzaClaro` vira mentira quando o tema escurece; `borda` continua verdade. A Lojinha usa 8 papéis:

| Grupo | Tokens | Onde aparece |
|---|---|---|
| Fundos | `fundo`, `superficie` | a tela; cartões e abas |
| Textos | `texto`, `textoSuave` | nome do produto; categoria e legendas |
| Linhas | `borda` | contorno do cartão, divisórias |
| Ação | `primaria` | preço, aba ativa, botões |
| Estados | `perigo`, `sucesso` | erro; "Adicionado ao carrinho" |

Os valores ficam em `cores.claro`. A paleta `cores.escuro` usa os mesmos 8 nomes e entra em cena na próxima aula.

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

## :icon[layout-grid] Espaçamento de 4 em 4

Medidas soltas como 10, 13 e 15 deixam a tela torta: um cartão respira mais que o vizinho e ninguém sabe dizer por quê. Uma **escala de espaçamento** limita as escolhas a poucos valores, todos múltiplos de 4:

```javascript
export const espaco = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
```

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

Com nove tamanhos de fonte, nada parece título e nada parece legenda. Quatro bastam para uma loja inteira:

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

Cantos arredondados também seguem uma escala, do menor elemento ao maior:

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

## :icon[file-code] src/theme/tokens.js: as cores

Crie a pasta `src/theme/` e, nela, o arquivo que guarda as decisões visuais do app. Primeiro, as duas paletas:

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

As duas paletas têm exatamente as mesmas chaves. É isso que vai permitir trocar uma pela outra sem tocar nos componentes.

---

## :icon[file-code] src/theme/tokens.js: espaço, fonte e raio

No mesmo arquivo, abaixo das cores:

```javascript
export const espaco = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

export const fonte = { pequena: 12, corpo: 16, titulo: 20, destaque: 28 };

export const raio = { sm: 6, md: 12, lg: 20 };
```

São quatro exportações nomeadas. Em cada tela, importe só o que usar:

```jsx
import { cores, espaco, fonte, raio } from '../theme/tokens';
```

O caminho `../theme/tokens` vale para arquivos em `src/telas/`. Este é o **único arquivo** do app com códigos de cor.

---

## :icon[layers] Sombra no iOS e no Android

Cada plataforma desenha sombra do seu jeito: o iOS usa quatro propriedades `shadow`; o Android usa só **`elevation`**, a altura simulada do elemento. **`Platform.select`** entrega o objeto da plataforma em que o app está rodando:

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

Aplique com spread dentro do estilo: `cartao: { ...sombra, borderRadius: raio.md }`.

---

## Pratique

:::example Desafio: o cartão da Inicio
Este é o estilo do cartão de produto do jeito que muita gente deixou no E30. Troque cada valor que se repete pelo token mais próximo (3 minutos):

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

---

## :icon[ban] Nunca cor literal no componente

A regra da Lojinha daqui em diante: **nenhuma cor escrita à mão** em telas e componentes. Toda cor vem de `cores`; só `tokens.js` tem códigos de cor.

Para fiscalizar, abra a busca em todos os arquivos do VS Code (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>F</kbd>):

- procure `#` em `src/telas` e `src/components`
- procure nomes de cor em inglês, como `'white'`, `'black'` e `'gray'`
- cada resultado é uma cor sem papel: dê um token a ela

O mesmo vale para medidas repetidas: `padding: 15` em três telas é um `espaco.md` esperando para nascer.

:::warning
Uma única cor literal basta para estragar o tema escuro: aquele cartão continua branco quando todo o resto escurece.
:::

---

## :icon[triangle-alert] Erros comuns

:::warning
- Nomear o token pela aparência (`cinzaClaro`, `roxo`): no tema escuro o nome vira mentira; use o papel (`textoSuave`, `primaria`)
- Criar um token para cada valor quebrado (`espaco.quinze`): a escala existe para limitar as escolhas
- `elevation` sem `backgroundColor`: no Android, a sombra não aparece
- `overflow: 'hidden'` no cartão para arredondar a imagem: no iOS, ele corta a sombra junto; arredonde a própria imagem com `borderRadius`
- Esquecer o `export` de um token: o import chega `undefined` e a tela vermelha avisa que não consegue ler `claro` de `undefined`
:::

---

## Resumo

:::summary
- Valores soltos se multiplicam: cada mudança de cor ou de espaço vira uma caça em dezenas de arquivos
- Um token é um nome para uma decisão visual; o valor mora só em `src/theme/tokens.js`
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
