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

## Um erro que só o cliente veria

O `lojinha-regras` já tem regras de preço, carrinho e favoritos. Agora imagine o projeto com 40 arquivos e três pessoas mexendo no código:

- Um colega renomeia `preco` para `valor` em `src/data/produtos.js` e esquece o script dos favoritos: ele cai com `Cannot read properties of undefined (reading 'toLocaleString')`
- Outro chama `ehFavorito(favoritos, '7')` com o texto do `process.argv`: a resposta é `false`, sem erro nenhum
- Ninguém percebe até o código chegar ao app, no E30, e um cliente reclamar

:::question
E se o editor sublinhasse esses erros antes mesmo de você rodar o programa?
:::

---

## :icon[file-check] O que o TypeScript resolve

O **TypeScript** é JavaScript com **tipos**: você descreve o formato dos dados, e o editor confere cada uso enquanto você digita.

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

## :icon[variable] Tipos básicos e funções

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

- O tipo vem depois de dois-pontos: `nome: tipo`
- Na função, cada parâmetro tem o seu tipo, e o do retorno vem depois dos parênteses
- `'79,90'` é exatamente o que o `process.argv` entrega (E02): o TypeScript lembra você de converter
- Os tipos são em minúsculas: `string`, `number`, `boolean`

---

## :icon[lightbulb] Inferência: o tipo que você não escreve

```typescript
const preco = 79.9;    // number, sem anotar nada
let quantidade = 1;    // number
quantidade = 'duas';
// Type 'string' is not assignable to type 'number'.

function dobro(valor: number) {
  return valor * 2;    // o retorno é deduzido: number
}
```

O TypeScript deduz o tipo pelo valor inicial e pelo `return`. Passe o mouse sobre um nome no VS Code: ele mostra o tipo que deduziu.

Regra prática: anote os **parâmetros** e os formatos de dados, como o produto; deixe a **inferência** cuidar das variáveis e dos retornos. Anote o retorno quando ele documenta a intenção, como o `: string` de uma função que formata preço.

---

## :icon[braces] type: o formato de um objeto

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
- Com o tipo, o editor completa `produto.` com os campos certos e ainda sugere a correção do erro de digitação

---

## :icon[tags] Uniões: só estes valores

Um `string` qualquer aceita `'pagou'`, `'entrege'` e todo erro de digitação. Uma **união** de valores literais aceita só a lista que você definiu:

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

O `|` também junta tipos: `string | null` é "texto ou nada". No E13, o `tomDoStatus` da Lojinha vai trabalhar com exatamente estes cinco valores.

---

## :icon[scale] interface e type

Uma **interface** também descreve o formato de um objeto, e pode estender outra:

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
| União de valores literais | sim | não |
| Aproveitar outro formato | com `&` | com `extends` |

Para objetos, os dois funcionam. Regra simples: `type` para uniões e dados; `interface` quando um formato vai estender outro. Em equipe, siga o padrão que o projeto já usa.

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

## :icon[circle-alert] undefined: o erro que mais derruba programa

O `find` devolve o produto ou `undefined`, quando não acha nada. Com o `strict` ligado, o TypeScript não deixa você esquecer:

```typescript
function nomeDoProduto(produtos: Produto[], id: number): string {
  const produto = produtos.find((p) => p.id === id); // Produto | undefined
  return produto.nome;
  // 'produto' is possibly 'undefined'.
}
```

```typescript
function nomeDoProduto(produtos: Produto[], id: number): string {
  const produto = produtos.find((p) => p.id === id);
  if (produto === undefined) {
    return 'Produto não encontrado';
  }
  return produto.nome; // aqui o TypeScript sabe que o produto existe
}
```

É o `Cannot read properties of undefined (reading 'nome')` do Node, apontado antes de rodar. Depois do `if`, o tipo **estreita** para `Produto`. Fuja dos atalhos que calam o aviso: `produto!.nome` e `any` só escondem o problema.

---

## :icon[fingerprint] Set e Map com tipo

Os sinais de menor e maior dizem o que vai dentro da coleção:

```typescript
function ehFavorito(favoritos: Set<number>, id: number): boolean {
  return favoritos.has(id);
}

ehFavorito(new Set([7, 1]), '7');
// Argument of type 'string' is not assignable to parameter of type 'number'.

const produtosPorId = new Map<number, Produto>();
const tenis = produtosPorId.get(7); // Produto | undefined
console.log(tenis.nome);
// 'tenis' is possibly 'undefined'.
```

- `Set<number>` é "um Set de números"; `Map<number, Produto>` é "chaves número, valores `Produto`"
- O `'7'` que na aula 23 respondia `false` em silêncio agora fica sublinhado
- O `get` pode não achar a chave: o `strict` pede o mesmo `if` do `find`

---

## :icon[play] Rodando um .ts no Node

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
- No Node 22 até a versão 22.17, a opção é obrigatória, e o aviso pode ser ignorado
- Do 22.18 em diante, e no Node 24, `node rascunhos/tipos.ts` já basta

---

## :icon[split] O Node roda, o tsc confere

:::center
![Diagrama: o tipos.ts segue dois caminhos; o editor e o npx tsc --noEmit conferem os tipos e apontam o erro, enquanto o node só remove os tipos e roda o JavaScript que sobra, mesmo com erro de tipo](images/e12-tsc-e-node.svg)
:::

O Node **remove** os tipos sem conferi-los: com um erro de tipo, o programa roda do mesmo jeito. Quem confere é o editor, arquivo por arquivo, e o compilador do TypeScript, o **tsc**, na pasta inteira.

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

- `strict` liga as checagens mais úteis; `--noEmit` só confere, sem gerar `.js`
- `include` prende a conferência em `rascunhos/`: a `src/` segue em JavaScript e vai para o app no E30
- Sem erros, o comando não imprime nada

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

## :icon[triangle-alert] Erros comuns

:::warning
- Achar que o TypeScript confere dados que chegam com o programa rodando, do `process.argv` ou de um JSON: os tipos somem antes de rodar
- Usar `any` para calar o editor: a checagem desliga, e o erro volta ao rodar
- Esperar que o `node` avise erro de tipo: ele só remove os tipos; confira com `npx tsc --noEmit`
- Escrever `Number` e `String` como tipo: use `number` e `string`, em minúsculas
- `node rascunhos/tipos.ts` sem a opção num Node 22 antigo: `Unknown file extension ".ts"`
- Desligar o `strict` para sumir com os avisos de `undefined`
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
