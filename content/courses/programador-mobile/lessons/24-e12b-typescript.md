---
title: Uma degustação de TypeScript
summary: Tipos que o editor confere enquanto você digita, type, interface e uniões, e um rascunho .ts conferido pelo tsc.
module: linguagem-js
duration_minutes: 40
objectives:
  - Explicar o que o TypeScript resolve e em que momento ele confere o código
  - Escrever tipos básicos, type, interface e uniões, aproveitando a inferência
  - Tratar o undefined que o modo estrito aponta, inclusive em Set e Map tipados
  - Rodar um arquivo .ts no Node e conferi-lo com npx tsc --noEmit
---

# Uma degustação de TypeScript

Programador Mobile · Encontro E12 · Aula 24 de 89

---

## O que você vai aprender

:::goal
- Entender o que o TypeScript confere e o que ele não confere
- Escrever tipos básicos, `type`, `interface` e uniões, deixando a inferência trabalhar
- Tipar funções, inclusive as de `Set` e `Map` da aula 23, e tratar o `undefined` que o `strict` aponta
- Rodar um `.ts` no Node e conferir um rascunho com `npx tsc --noEmit`
- Saber por que o curso segue em JavaScript, e quando vale adotar TypeScript
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **TypeScript** | o JavaScript com tipos: o editor confere cada valor antes de rodar |
| **tipo** | o que cabe numa variável ou num parâmetro: número, texto, sim ou não, um formato de objeto |
| **anotação** | o tipo escrito depois de dois-pontos: `preco: number` |
| **inferência** | o tipo que o TypeScript deduz sozinho, sem você escrever |
| **união** | uma lista fechada de opções, separadas por `\|`: `'pago' \| 'enviado'` |
| **`tsc`** | o compilador do TypeScript: confere os tipos de todos os arquivos de uma vez |

---

## Um erro que só o cliente veria

O `lojinha-regras` já tem regras de preço, carrinho e favoritos. Agora imagine o projeto com 40 arquivos e três pessoas mexendo no código:

- Um colega renomeia `preco` para `valor` em `src/data/produtos.js` e esquece o script dos favoritos: ele cai com `Cannot read properties of undefined (reading 'toLocaleString')`
- Outro chama `ehFavorito(favoritos, '7')` com o texto do `process.argv`: a resposta é `false`, sem erro nenhum
- Ninguém percebe até o código chegar ao app, no E30, e um cliente reclamar

:::question
E se o editor sublinhasse esses erros antes mesmo de você rodar o programa?
:::

---

## TypeScript

Numa mudança, para que serve escrever "frágil" ou "cozinha" na caixa?

---

## :icon[file-check] O que o TypeScript resolve

O **TypeScript** é JavaScript com **tipos**: uma etiqueta "só cabe número" na caixa, que o editor confere enquanto você digita.

| Problema | Em JavaScript | Em TypeScript |
|---|---|---|
| Campo errado (`produto.preço`) | `undefined` na conta | sublinhado no editor |
| Texto onde se espera número | `NaN` ou `false`, calado | sublinhado no editor |
| Valor fora da lista (`'entrege'`) | nunca casa | sublinhado no editor |
| Valor que pode faltar (`find`) | `TypeError` ao rodar | aviso antes de rodar |

Os tipos só existem enquanto você programa: o Node os remove antes de rodar.

:::info Neste curso
TypeScript é degustação: o `lojinha-regras` e o app seguem em JavaScript.
:::

---

## Tipos básicos

Que tipos de valor você já guardou numa variável, desde o E05?

---

## :icon[variable] Tipos básicos e funções

Um **tipo** diz o que cabe na caixa. A **anotação** é a etiqueta: o tipo escrito depois de dois-pontos.

```typescript
const nome: string = 'Garrafa Térmica';
const preco: number = 79.9;
const emDestaque: boolean = true;
const favoritos: number[] = [1, 5, 7];
let cupom: string | null = null; // texto ou nada

function totalDoItem(preco: number, qtd: number): number {
  return preco * qtd;
}

totalDoItem('79,90', 2);
// Argument of type 'string' is not assignable to parameter of type 'number'.
```

A última linha nem chega a rodar: o editor sublinha antes. Em português, a mensagem diz: "um argumento do tipo texto não cabe num parâmetro do tipo número".

---

## :icon[list-ordered] Os tipos em português

| Anotação | O que ela diz |
|---|---|
| `nome: string` | "só cabe texto" (*string*, em inglês, é uma sequência de letras) |
| `preco: number` | "só cabe número" |
| `emDestaque: boolean` | "só cabe `true` ou `false`" |
| `favoritos: number[]` | "uma lista só de números" |
| `cupom: string \| null` | "texto ou nada" |
| `(preco: number, qtd: number): number` | "recebe dois números e devolve um número": o tipo do retorno vem depois dos parênteses |

- Os tipos são em minúsculas: `string`, `number`, `boolean`
- `'79,90'` é exatamente o que o `process.argv` entrega (E02): o TypeScript lembra você de converter

---

## :icon[lightbulb] Inferência: o tipo que você não escreve

Na **inferência**, o TypeScript olha o que você pôs na caixa e escreve a etiqueta sozinho:

```typescript
const preco = 79.9;    // number, sem anotar nada
let quantidade = 1;    // number
quantidade = 'duas';
// Type 'string' is not assignable to type 'number'.

function dobro(valor: number) {
  return valor * 2;    // o retorno é deduzido: number
}
```

A mensagem diz: "texto não cabe numa caixa de número". Passe o mouse sobre um nome no VS Code: ele mostra o tipo que deduziu.

Regra prática: anote os **parâmetros** e os formatos de dados, como o produto; deixe a **inferência** cuidar das variáveis e dos retornos. Anote o retorno quando ele documenta a intenção, como o `: string` de uma função que formata preço.

---

## :icon[list-checks] Tipos na prática

**Caso 1: o preço que chega como texto.** A regra do Pix só aceita número:

```typescript
function precoComPix(preco: number): number {
  return preco * 0.95;
}
precoComPix(Number('199.90')); // certo: o texto virou número
precoComPix('199,90');
// Argument of type 'string' is not assignable to parameter of type 'number'.
```

**Caso 2: a conta que vira texto.** No E05, `1 + '1'` dava `'11'`. Aqui, a inferência barra:

```typescript
let quantidade = 1;
quantidade = quantidade + '1';
// Type 'string' is not assignable to type 'number'.
```

**Caso 3: a lista de um tipo só.**

```typescript
const nomes: string[] = ['Fone Bluetooth', 'Bola de Futebol'];
nomes.push(7);
// Argument of type 'number' is not assignable to parameter of type 'string'.
```

---

## type e interface

O que um formulário de cadastro em branco já diz, antes de alguém preencher?

---

## :icon[braces] type: o formato de um objeto

Um objeto é uma ficha de cadastro. O **`type`** é o formulário em branco: diz quais campos a ficha tem e o que cabe em cada um.

```typescript
type Produto = {
  id: number;
  nome: string;
  preco: number;
  categoria: string;
  imagem?: string; // opcional
};

function rotulo(produto: Produto): string {
  return `${produto.nome} por ${produto.preço}`;
  // Property 'preço' does not exist on type 'Produto'. Did you mean 'preco'?
}
```

- `type Nome = { ... }` dá nome a um formato; os campos são separados por `;`
- `?` marca um campo **opcional**, que pode faltar
- O editor completa `produto.` com os campos certos e sugere a correção: "não existe `preço` em `Produto`; você quis dizer `preco`?"

---

## :icon[scale] interface e type

Uma **interface** também descreve o formato de um objeto. Ela pode **estender** outra: aproveitar todos os campos dela e acrescentar os seus.

```typescript
interface ItemCarrinho {
  id: number;
  nome: string;
  preco: number;
  qtd: number;
}

interface ItemComPresente extends ItemCarrinho {
  mensagem: string; // tudo do ItemCarrinho, mais a mensagem
}
```

| | `type` | `interface` |
|---|---|---|
| Formato de objeto | sim | sim |
| Aproveitar outro formato | com `&` | com `extends` |

Para objetos, os dois funcionam. Regra simples: `type` para os dados do dia a dia; `interface` quando um formato vai estender outro. Em equipe, siga o padrão que o projeto já usa.

---

## :icon[list-checks] type e interface na prática

Com o `type Produto` e a `interface ItemComPresente` desta seção:

**Caso 1: a vitrine com um produto incompleto.**

```typescript
const vitrine: Produto[] = [
  { id: 1, nome: 'Fone Bluetooth', preco: 199.9, categoria: 'audio' },
  { id: 5, nome: 'Garrafa Térmica', categoria: 'casa' },
];
// Property 'preco' is missing ... but required in type 'Produto'.
```

O Fone passa sem `imagem`, que é opcional; a Garrafa sem `preco`, não.

**Caso 2: um campo que não existe no formato.**

```typescript
const garrafa: Produto = { id: 5, nome: 'Garrafa Térmica', preco: 79.9, categoria: 'casa', cor: 'azul' };
// Object literal may only specify known properties, and 'cor' does not exist in type 'Produto'.
```

**Caso 3: o presente sem mensagem.** `const presente: ItemComPresente = { id: 1, nome: 'Fone Bluetooth', preco: 199.9, qtd: 1 };` dá `Property 'mensagem' is missing`: a interface estendida pede tudo do `ItemCarrinho`, mais a mensagem.

---

## Pratique

:::example Desafio
Quais chamadas o TypeScript sublinha, e por quê?

```typescript
type ItemCarrinho = { id: number; nome: string; preco: number; qtd: number };

function subtotal(item: ItemCarrinho) {
  return item.preco * item.qtd;
}

subtotal({ id: 5, nome: 'Garrafa Térmica', preco: 79.9, qtd: 2 });   // A
subtotal({ id: 5, nome: 'Garrafa Térmica', preco: '79.90', qtd: 2 }); // B
subtotal({ id: 5, nome: 'Garrafa Térmica', preco: 79.9 });            // C
const total: string = subtotal({ id: 1, nome: 'Fone', preco: 199.9, qtd: 1 }); // D
```
:::

:::tip Resposta
- **A** passa: o objeto tem todos os campos, com os tipos certos
- **B**: `Type 'string' is not assignable to type 'number'`, no `preco`
- **C**: `Property 'qtd' is missing`: faltou a quantidade
- **D**: o retorno deduzido é `number`, e `total` foi anotado como `string`

Três erros achados sem rodar nada.
:::

---

## Uniões

Numa pergunta de múltipla escolha, dá para responder algo fora das opções?

---

## :icon[tags] Uniões: só estes valores

Um `string` qualquer aceita `'pagou'`, `'entrege'` e todo erro de digitação. Uma **união** de valores aceita só a lista que você definiu, como uma pergunta de múltipla escolha: vale uma das opções, e nada mais.

```typescript
type StatusPedido = 'pendente' | 'pago' | 'enviado' | 'entregue' | 'cancelado';

function foiEntregue(status: StatusPedido): boolean {
  return status === 'entrege';
  // This comparison appears to be unintentional because the types
  // 'StatusPedido' and '"entrege"' have no overlap.
}

foiEntregue('pagou');
// Argument of type '"pagou"' is not assignable to parameter of type 'StatusPedido'.
```

- As mensagens dizem: "`'entrege'` não está entre as opções" e "`'pagou'` não é um `StatusPedido`"
- O `|` também junta tipos: `string | null` é "texto ou nada"
- União só se escreve com `type`; a `interface` não faz união

No E13, o `tomDoStatus` da Lojinha vai trabalhar com exatamente estes cinco valores.

---

## :icon[list-checks] Uniões na prática

**Caso 1: as formas de pagamento da Lojinha.**

```typescript
type FormaDePagamento = 'pix' | 'cartao' | 'boleto';

function temDesconto(forma: FormaDePagamento): boolean {
  return forma === 'pix';
}

temDesconto('pix');    // true
temDesconto('cheque');
// Argument of type '"cheque"' is not assignable to parameter of type 'FormaDePagamento'.
```

**Caso 2: a categoria com maiúscula.** O editor ainda sugere a certa:

```typescript
type Categoria = 'audio' | 'casa' | 'esporte' | 'livros';
const escolhida: Categoria = 'Audio';
// Type '"Audio"' is not assignable to type 'Categoria'. Did you mean '"audio"'?
```

Ao digitar `temDesconto('`, o VS Code mostra as três opções da lista: você nem precisa decorar.

---

## O undefined

Quando você busca na agenda um contato que não existe, o que o celular mostra?

---

## :icon[circle-alert] undefined: o erro que mais derruba programa

O `find` devolve o produto ou `undefined`, quando não acha nada: é a busca que volta de mãos vazias. Com o **`strict`** (em inglês, rigoroso) ligado, o TypeScript não deixa você esquecer:

```typescript
function nomeDoProduto(produtos: Produto[], id: number): string {
  const produto = produtos.find((p) => p.id === id); // Produto | undefined
  return produto.nome;
  // 'produto' is possibly 'undefined'.
}
```

O aviso diz: "`produto` pode ser `undefined`". É o `Cannot read properties of undefined (reading 'nome')` do Node, apontado antes de rodar. A saída é tratar, com um `if`, o caso de não achar nada.

---

## :icon[list-checks] undefined na prática

**Caso 1: o produto que não existe.**

```typescript
function nomeDoProduto(produtos: Produto[], id: number): string {
  const produto = produtos.find((p) => p.id === id);
  if (produto === undefined) {
    return 'Produto não encontrado';
  }
  return produto.nome; // aqui o TypeScript sabe que o produto existe
}
```

Com o id 7, sai `'Tênis de Corrida'`; com o 99, `'Produto não encontrado'`. Depois do `if`, o tipo **estreita** para `Produto`: o aviso some.

**Caso 2: o atalho que esconde o problema.**

```typescript
return produto!.nome; // o ! cala o aviso; com o id 99, o TypeError volta ao rodar
```

Fuja dos atalhos que calam o aviso: `produto!.nome` e o tipo `any` (qualquer coisa) só escondem o problema.

---

## Set e Map tipados

Se a lista de convidados tivesse a etiqueta "só números", o texto '7' entraria?

---

## :icon[fingerprint] Set e Map com tipo

Os sinais de menor e maior dizem o que vai dentro da coleção: é a etiqueta "só cabe isto" para cada item.

```typescript
function ehFavorito(favoritos: Set<number>, id: number): boolean {
  return favoritos.has(id);
}

ehFavorito(new Set([7, 1]), '7');
// Argument of type 'string' is not assignable to parameter of type 'number'.
```

- `Set<number>` é "um Set de números"; `Map<number, Produto>` é "chaves número, valores `Produto`"
- O `'7'` que na aula 23 respondia `false` em silêncio agora fica sublinhado

---

## :icon[list-checks] Set e Map tipados na prática

**Caso 1: o `get` que pode não achar.**

```typescript
const produtosPorId = new Map<number, Produto>();
const tenis = produtosPorId.get(7); // Produto | undefined
console.log(tenis.nome);
// 'tenis' is possibly 'undefined'.
```

**Caso 2: o mesmo `if` do `find`.**

```typescript
if (tenis !== undefined) {
  console.log(tenis.nome); // sem aviso: aqui o tênis existe
}
```

O `get` pode não achar a chave: o `strict` pede o mesmo `if` do `find`, e o tipo estreita do mesmo jeito.

---

## Node e tsc

Na mudança, quem carrega as caixas confere as etiquetas ou só carrega?

---

## :icon[play] Rodando um .ts no Node

Um arquivo `.ts` é um arquivo TypeScript. O Node consegue rodá-lo: ele arranca as etiquetas de tipo, sem ler, e roda o JavaScript que sobra.

```typescript
// rascunhos/tipos.ts
function totalDoItem(preco: number, qtd: number): number {
  return preco * qtd;
}

console.log(totalDoItem(79.9, 2));
console.log(totalDoItem('79,90', 2)); // erro de tipo, de propósito
```

```bash
node --experimental-strip-types rascunhos/tipos.ts
# 159.8
# NaN
# (node:5812) ExperimentalWarning: Type Stripping is an experimental feature...
```

- O Node **remove** os tipos e roda o resto, sem conferir nada: o `'79,90'` vira `NaN`, sem erro
- No Node 22 até a versão 22.17, a opção `--experimental-strip-types` (remover os tipos, experimental) é obrigatória, e o aviso pode ser ignorado
- Do 22.18 em diante, e no Node 24, `node rascunhos/tipos.ts` já funciona, sem a opção

---

## :icon[split] O Node roda, o tsc confere

:::center
![Diagrama: o tipos.ts segue dois caminhos; o editor e o npx tsc --noEmit conferem os tipos e apontam o erro, enquanto o node só remove os tipos e roda o JavaScript que sobra, mesmo com erro de tipo](images/e12-tsc-e-node.svg)
:::

O Node **remove** os tipos sem conferi-los: com um erro de tipo, o programa roda do mesmo jeito. Quem confere é o editor, arquivo por arquivo, e o compilador do TypeScript, o **tsc** (*TypeScript compiler*), na pasta inteira.

---

## :icon[square-terminal] Conferindo o rascunho com o tsc

:::steps
1. `npm i -D typescript`: o compilador entra nas `devDependencies`, como o Jest no E04
2. `tsconfig.json` na raiz, como abaixo
3. `npx tsc --noEmit`
:::

```json
{
  "compilerOptions": { "strict": true, "noEmit": true },
  "include": ["rascunhos"]
}
```

```plaintext
rascunhos/tipos.ts:7:25 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.

Found 1 error in rascunhos/tipos.ts:7
```

- `tipos.ts:7:25` é o arquivo, a linha 7 e a coluna 25: vá direto nelas
- `strict` liga as checagens mais úteis; `--noEmit` só confere, sem gerar `.js`
- `include` prende a conferência em `rascunhos/`: a `src/` segue em JavaScript e vai para o app no E30
- Sem erros, o comando não imprime nada

---

## Quando adotar

Você etiquetaria cada sacola da feira, ou só as caixas de uma mudança?

---

## :icon[compass] Quando adotar

| Situação | O que fazer |
|---|---|
| Projeto novo, em equipe | TypeScript desde o início; muitos modelos de projeto, inclusive o padrão do Expo, já vêm assim |
| Projeto em JavaScript que já funciona | aos poucos, arquivo por arquivo, começando por `utils/` e regras puras |
| Script ou protótipo de um dia | JavaScript resolve; os tipos se pagam em projetos que crescem |
| Este curso | o `lojinha-regras` e o app seguem em JavaScript; o TypeScript fica no rascunho |

O custo existe: aprender a sintaxe, lidar com os tipos das bibliotecas e resistir ao `any`. O retorno cresce com o projeto e o time, e muitas vagas de React Native pedem TypeScript.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `is not assignable to` | o valor não cabe no tipo pedido | converter (`Number(texto)`) ou corrigir o valor |
| `does not exist on type` | esse campo não existe no formato | o `Did you mean` sugere o nome certo |
| `is missing` | faltou um campo obrigatório | acrescentá-lo |
| `is possibly 'undefined'` | o valor pode faltar | um `if (x === undefined)` antes de usar |
| `Unknown file extension ".ts"` | Node 22 antigo, sem a opção | `node --experimental-strip-types ...` |
| `No inputs were found` | o `.ts` está fora de `rascunhos/` | movê-lo para `rascunhos/` |

---

## :icon[triangle-alert] Erros comuns

:::warning
- Achar que o TypeScript confere dados que chegam com o programa rodando, do `process.argv` ou de um JSON: os tipos somem antes de rodar
- Usar `any` para calar o editor: a checagem desliga, e o erro volta ao rodar
- Esperar que o `node` avise erro de tipo: ele só remove os tipos; confira com `npx tsc --noEmit`
- Escrever `Number` e `String` como tipo: use `number` e `string`, em minúsculas
- Desligar o `strict` para sumir com os avisos de `undefined`
- Esperar que o TypeScript ache regra errada: frete grátis a partir de `15`, e não `150`, tem o tipo certo. Regra se confere com teste
:::

---

## Resumo

:::summary
- TypeScript é JavaScript com tipos, conferidos pelo editor e pelo `npx tsc --noEmit`; o Node só os remove
- Anote parâmetros e formatos de dados; a inferência deduz o resto
- `type` descreve objetos e uniões; `interface` descreve objetos e pode estender outra
- O `strict` aponta o `undefined` do `find` e do `get` antes de rodar
- Neste curso, TypeScript é degustação: o resto segue em JavaScript
:::

Fim da unidade Linguagem JavaScript. O E13 abre Classes e estruturas de controle.

---

## :icon[flask-conical] No laboratório

Favoritos com `Set`, catálogo com `Map` e um rascunho em TypeScript.

:::steps
1. `src/regras/favoritos.js` com `Set` e `listarFavoritos`; testes do E08 reescritos, mais os novos
2. `produtosPorId` em `src/data/produtos.js`, com teste de `size` e `get`
3. `src/scripts/favoritos.js` com `Set`; lista vazia imprime "Nenhum favorito ainda."
4. `npm test` verde e commit "E12: favoritos com Set e catálogo com Map"
5. `npm i -D typescript`, `tsconfig.json` e `rascunhos/tipos.ts` com os tipos da aula
6. Um erro plantado: o `node` roda, o `tsc` acusa; corrija até o `tsc` passar limpo
7. Commit "E12: rascunho em TypeScript" e `git push`
:::

**Critérios de entrega**: nenhuma regra muda o `Set` recebido; `npm test` verde; `npx tsc --noEmit` limpo. Entregue o link do repositório no sistema.

---

## :icon[milestone] Projeto 2 · Etapa 5: favoritos e a interface web

No `agenda-de-contatos`, a última etapa:

- `alternarFavorito`, `ehFavorito` e `listarFavoritos` com um `Set` de ids, em `src/regras/favoritos.js`
- `indexarPorId(contatos)`: um `Map` de id para contato
- a interface pronta, [interface-web.zip](materiais/projeto-2/interface-web.zip), descompactada e renomeada para `web/`: `npx serve .`, o endereço com `/web/` no fim e o painel em 17 de 17
- README com como rodar e prints da tela

Commit: `Projeto 2: etapa 5, favoritos e interface web`. Entrega na página do projeto até o início do E13.
