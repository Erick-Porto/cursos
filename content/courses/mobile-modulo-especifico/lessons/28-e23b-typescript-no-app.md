---
title: TypeScript no app
summary: Tipos que o editor confere enquanto você digita, type, interface e uniões, e TypeScript no Expo sem configurar nada.
module: ambiente-js
duration_minutes: 40
objectives:
  - Explicar o que o TypeScript resolve num app e em que momento ele confere o código
  - Escrever tipos básicos, type, interface e uniões, aproveitando a inferência
  - Tipar funções e props, tratando o undefined que o modo estrito aponta
  - Adotar TypeScript no Expo arquivo por arquivo e conferir o projeto com o tsc
---

# TypeScript no app

Programador Mobile: Módulo Específico · Encontro E23 · Aula 28 de 71

---

## O que você vai aprender

:::goal
- Entender o que o TypeScript confere e o que ele não confere
- Escrever tipos básicos, `type`, `interface` e uniões, deixando a inferência trabalhar
- Tipar funções e props de componentes e tratar o `undefined` que o `strict` aponta
- Ligar o TypeScript no Expo e conferir o projeto com `npx tsc --noEmit`
- Decidir quando adotar TypeScript num app
:::

---

## Um erro que só o cliente viu

No E16, `produto.nome` com `produto` indefinido derrubou o Detalhe com a tela vermelha. Agora imagine a Lojinha com 40 telas e três pessoas mexendo no código:

- Um colega renomeia `preco` para `valor` no `catalogo.json` e esquece o `CartaoProduto`: a vitrine quebra com `Cannot read property 'toLocaleString' of undefined`
- Outro escreve `<Badge tom="vermelho" />`, mas o `Badge` só conhece `perigo`: o selo sai sem cor
- Ninguém percebe até um cliente reclamar na loja de aplicativos

:::question
E se o editor sublinhasse esses erros antes mesmo de você salvar o arquivo?
:::

---

## :icon[file-check] O que o TypeScript resolve

O **TypeScript** é JavaScript com **tipos**: você descreve o formato dos dados, e o editor confere cada uso enquanto você digita.

| Problema | Em JavaScript | Em TypeScript |
|---|---|---|
| Campo com nome errado (`produto.preço`) | `undefined` na tela | sublinhado no editor |
| Texto onde se espera número | conta errada em produção | sublinhado no editor |
| Prop que o componente não aceita | selo sem cor | sublinhado no editor |
| Valor que pode faltar (`find`) | tela vermelha | aviso antes de rodar |

Os tipos só existem enquanto você programa: o Metro os remove, e o Hermes executa o JavaScript de sempre. Nada é conferido com o app rodando.

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
- `'79,90'` é exatamente o que um `TextInput` entrega: o TypeScript lembra você de converter
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

function podeCancelar(status: StatusPedido): boolean {
  if (status === 'entrege') return false;
  // This comparison appears to be unintentional because the types
  // 'StatusPedido' and '"entrege"' have no overlap.
  return status === 'pendente' || status === 'pago';
}

podeCancelar('pagou');
// Argument of type '"pagou"' is not assignable to parameter of type 'StatusPedido'.
```

O `|` também junta tipos: `string | null` é "texto ou nada". No E26, o Badge de status da Lojinha usa exatamente estes cinco valores.

---

## :icon[scale] interface e type

Uma **interface** também descreve o formato de um objeto, e pode estender outra:

```typescript
interface PropsCartao {
  produto: Produto;
  onPress: () => void; // função sem parâmetros e sem retorno
}

interface PropsCartaoDestaque extends PropsCartao {
  selo: string;
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

Três erros achados sem abrir o app.
:::

---

## :icon[circle-alert] undefined: o erro que mais derruba app

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
  if (!produto) return 'Produto não encontrado';
  return produto.nome; // aqui o TypeScript sabe que o produto existe
}
```

É o `Cannot read property 'nome' of undefined` do E16, apontado antes de rodar. Depois do `if`, o tipo **estreita** para `Produto`. Fuja dos atalhos que calam o aviso: `produto!.nome` e `any` só escondem o problema.

---

## :icon[component] Props tipadas num componente

Arquivo com JSX vira `.tsx`. O `Badge` do kit, com as props descritas:

```typescript
// src/components/ui/Badge.tsx
type PropsBadge = {
  texto: string;
  tom?: 'neutro' | 'sucesso' | 'alerta' | 'perigo';
};

export default function Badge({ texto, tom = 'neutro' }: PropsBadge) {
  // o corpo continua igual ao do Badge.js
}

<Badge texto="Novo" tom="vermelho" />;
// Type '"vermelho"' is not assignable to type '"neutro" | "sucesso" | "alerta" | "perigo" | undefined'.
<Badge tom="sucesso" />;
// Property 'texto' is missing in type '{ tom: "sucesso"; }' but required in type 'PropsBadge'.
```

Quem usa o `Badge` ganha a lista de tons no autocompletar e não consegue esquecer o `texto`. Prop errada vira sublinhado no editor, e não selo sem cor no celular.

---

## :icon[settings] TypeScript no Expo, sem configurar nada

O Expo entende `.ts` e `.tsx` de fábrica, e JavaScript e TypeScript convivem no mesmo projeto:

:::steps
1. Renomeie um arquivo: `src/utils/formatar.js` vira `formatar.ts`
2. Rode `npx expo start`: o Expo percebe o TypeScript e oferece instalar `typescript` e `@types/react`; aceite
3. Ele cria o `tsconfig.json` na raiz; confira que o modo estrito está ligado, como abaixo
4. Os imports não mudam: `'../utils/formatar'` encontra o `.ts` sozinho
:::

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true
  }
}
```

O `extends` traz as opções que o Expo recomenda; o `strict` liga as checagens mais úteis, como a do `undefined`. Se a instalação não for oferecida, rode `npx expo install typescript @types/react -- --save-dev`.

---

## :icon[split] O app roda, o tsc confere

:::center
![Diagrama: o formatar.ts segue dois caminhos; o editor e o npx tsc --noEmit conferem os tipos e apontam o erro, enquanto o Metro só remove os tipos e o Hermes roda o app mesmo com erro de tipo](images/e23-tsc-e-metro.svg)
:::

O Metro **remove** os tipos sem conferi-los: com um erro de tipo, o app abre do mesmo jeito. Quem confere é o editor, arquivo por arquivo, e o compilador do TypeScript, no projeto inteiro.

---

## :icon[square-terminal] Conferindo o projeto com o tsc

O compilador do TypeScript confere todos os arquivos do projeto de uma vez:

```bash
npx tsc --noEmit
```

```bash
src/rascunho.ts:2:15 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.

Found 1 error in src/rascunho.ts:2
```

- `--noEmit`: só confere, sem gerar arquivos; quem monta o app continua sendo o Metro
- Sem erros, o comando não imprime nada
- Rode antes do commit, junto com o `npm run lint`

---

## :icon[compass] Quando adotar

| Situação | O que fazer |
|---|---|
| App novo, em equipe | TypeScript desde o início: o modelo padrão do `create-expo-app` já vem assim |
| App em JavaScript que já funciona | aos poucos, arquivo por arquivo, começando por `utils/` e regras puras |
| Protótipo de um dia | JavaScript resolve; os tipos se pagam em projetos que crescem |
| A Lojinha neste curso | segue em JavaScript, o foco das próximas unidades; o `formatar.ts` mostra a convivência |

O custo existe: aprender a sintaxe, lidar com os tipos das bibliotecas e resistir ao `any`. O retorno cresce com o tamanho do app e do time, e as vagas de React Native pedem TypeScript com frequência.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Achar que o TypeScript confere dados que chegam da API ou do JSON com o app rodando: os tipos somem no bundle
- Usar `any` para calar o editor: a checagem desliga, e o erro volta no celular
- Esperar que o Metro avise erro de tipo: confira no editor e com `npx tsc --noEmit`
- Escrever `Number` e `String` como tipo: use `number` e `string`, em minúsculas
- Renomear para `.ts` um arquivo com JSX: componentes vão para `.tsx`
- Desligar o `strict` para sumir com os avisos de `undefined`
:::

---

## Resumo

:::summary
- TypeScript é JavaScript com tipos, conferidos pelo editor e pelo `npx tsc --noEmit`; o Metro só os remove
- Anote parâmetros e formatos de dados, e deixe a inferência deduzir o resto
- `type` descreve objetos e uniões de valores; `interface` descreve objetos e pode estender outra
- O `strict` aponta o `undefined` do `find` antes de ele virar tela vermelha
- No Expo, basta renomear para `.ts` ou `.tsx`: o `tsconfig.json` nasce sozinho, e JS e TS convivem
:::

---

## :icon[flask-conical] No laboratório

A Lojinha passa pelo controle de qualidade.

:::steps
1. Aplique o diff do instrutor sem abri-lo (`git apply --ignore-whitespace bugs-e23.diff`) e faça o commit "E23: bugs plantados"
2. Cace os 3 bugs das fichas de sintoma **só com breakpoints**; mostre a pausa que prova a causa
3. Corrija cada bug num commit próprio, com a causa na mensagem
4. Prettier, EditorConfig e formatar ao salvar; `npm run formatar` num commit só de formatação
5. `npm run lint` sem erros nem avisos
6. `src/utils/formatar.js` vira `formatar.ts`, com tipos, e `npx tsc --noEmit` passa limpo
7. Commit "E23: qualidade" e `git push`
:::

**Critérios de entrega**: 3 bugs corrigidos, um por commit; lint zerado; código formatado; `formatar.ts` tipado e `tsc` limpo. Entregue o link do repositório no sistema.
