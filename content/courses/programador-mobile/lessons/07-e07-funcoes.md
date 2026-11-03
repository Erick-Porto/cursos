---
title: Funções
summary: "As contas do Racha-conta viram regras com nome, num arquivo só delas: paraCentavos, calcularGorjeta e formatarReais."
module: linguagem-js
duration_minutes: 90
objectives:
  - Escrever funções com parâmetros, valor padrão e return, e chamá-las com argumentos
  - Reconhecer a função seta do filter e do reduce como a forma curta de uma função
  - Separar as regras do Racha-conta num módulo próprio, com export e import
  - Arrumar o código com o Formatar Documento do VS Code
---

# Funções

Programador Mobile · Encontro E07 · Aula 7 de 45

---

## O que você vai aprender

:::goal
- Guardar uma conta numa **função**, uma receita com nome, e usar quando quiser
- Mandar valores para a função e receber o resultado de volta
- Reconhecer a função seta, a que você usa no `filter` e no `reduce` desde a aula 3
- Separar as regras do Racha-conta num arquivo só delas, com `export` e `import`
- Passar o código a limpo com um atalho do VS Code
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **função** | uma receita com nome: um pedaço de código guardado para usar quando quiser |
| **parâmetro** | o espaço do ingrediente na receita: o nome que a função usa por dentro |
| **argumento** | o ingrediente que você põe nesse espaço, na hora de usar a função |
| **`return`** | o prato pronto: o valor que a função entrega de volta |
| **módulo** | um arquivo `.js` que escolhe o que mostra aos outros arquivos |
| **regra pura** | uma função que só calcula: recebe valores e devolve um valor, sem mostrar nada |

---

## As contas soltas no racha.js

Hoje, as contas do Racha-conta estão soltas no meio do `racha.js`:

```javascript
const subtotalCentavos = Math.round(subtotal * 100);
const gorjetaCentavos = Math.round(subtotalCentavos * conta.gorjeta / 100);
```

Essas contas vão servir em outros lugares: nos testes do E08 e na página web do E12. Copiar a mesma conta em três lugares é pedir para errar num deles. No fim do dia, cada conta tem um nome e mora num arquivo só dela:

```javascript
const subtotalCentavos = paraCentavos(subtotal);
const gorjetaCentavos = calcularGorjeta(subtotalCentavos, conta.gorjeta);
```

A saída do `npm run racha` não muda nem um centavo. O que muda é a organização.

:::question
Se a regra da gorjeta mudar, em quantos lugares do código você quer mexer?
:::

---

## Funções

Quando alguém pede "faz um brigadeiro", precisa explicar a receita de novo?

---

## :icon[square-function] Função: uma receita com nome

Uma **função** é uma receita com nome, guardada para usar quando quiser. Você escreve os passos uma vez e, depois, só diz o nome.

```javascript
function saudar() {
  console.log('Boa noite! Mesa para quantos?');
}

saudar();
saudar();
```

```plaintext
Boa noite! Mesa para quantos?
Boa noite! Mesa para quantos?
```

| Parte | O que ela diz |
|---|---|
| `function saudar()` | "guarde uma receita chamada `saudar`"; `function` é "função" em inglês |
| `{ ... }` | o modo de preparo: as linhas que a receita faz |
| `saudar();` | **chamar** a função: "faça a receita agora" |

Escrever a função não faz nada aparecer. Ela só roda quando é chamada, com os parênteses, e cada chamada faz a receita de novo.

---

## :icon[square-function] Funções na prática

**Caso 1: a mesma linha em vários lugares.** Uma linha divisória no recibo:

```javascript
function linha() {
  console.log('========================');
}

console.log('Cantina Bella Nonna');
linha();
console.log('Total: R$ 206.25');
linha();
```

```plaintext
Cantina Bella Nonna
========================
Total: R$ 206.25
========================
```

Para trocar o desenho da linha, você muda um lugar só: dentro da função.

**Caso 2: sem os parênteses, nada acontece.** `linha;` sozinho não chama a receita. E `console.log(linha)` mostra `[Function: linha]`, "isto é uma função", e não o que ela faz.

O nome diz o que a função faz: `linha`, `saudar`, `calcularGorjeta`.

---

## Parâmetros e argumentos

Bolo de chocolate ou bolo de cenoura: o que muda na receita?

---

## :icon[square-function] Parâmetro e argumento

A receita pode ter um espaço para um ingrediente: o **parâmetro**. Na hora de chamar, você põe o ingrediente nesse espaço: o **argumento**.

```javascript
function saudar(nome) {
  console.log(`Boa noite, ${nome}!`);
}

saudar('Ana');     // Boa noite, Ana!
saudar('Bruno');   // Boa noite, Bruno!
```

| Parte | No exemplo | Na receita |
|---|---|---|
| parâmetro | `nome`, nos parênteses da `function` | o espaço do ingrediente |
| argumento | `'Ana'` e `'Bruno'`, nos parênteses da chamada | o ingrediente que você põe |

A cada chamada, o parâmetro recebe o argumento daquela chamada: na primeira, `nome` vale `'Ana'`; na segunda, `'Bruno'`. O `${nome}` é a template string do E06: encaixa o valor no texto.

---

## :icon[square-function] Parâmetros na prática

**Caso 1: dois parâmetros, separados por vírgula.** A ordem dos argumentos é a ordem dos parâmetros:

```javascript
function fatiasPorPessoa(fatias, pessoas) {
  console.log(`Cada um come ${fatias / pessoas} fatias`);
}

fatiasPorPessoa(8, 4);   // Cada um come 2 fatias
fatiasPorPessoa(4, 8);   // Cada um come 0.5 fatias
```

Trocou a ordem, trocou a conta: o primeiro argumento vai sempre para o primeiro parâmetro.

**Caso 2: o argumento que falta.** O espaço fica vazio, e o parâmetro vale `undefined`, "nada aqui":

```javascript
fatiasPorPessoa(8);      // Cada um come NaN fatias
```

A conta `8 / undefined` não dá número. O **`NaN`** (*Not a Number*, "não é um número") é o resultado dela.

---

## O return

No restaurante, você quer receber o prato ou a foto do prato?

---

## :icon[corner-down-right] return: o prato pronto

O **`return`** ("devolver", em inglês) entrega um valor de volta para quem chamou: é o prato pronto da receita. O `console.log` só mostra a foto do prato na tela, e quem chamou fica de mãos vazias.

```javascript
function totalDoItem(preco, quantidade) {
  return preco * quantidade;
}
function mostrarTotalDoItem(preco, quantidade) {
  console.log(preco * quantidade);
}

const a = totalDoItem(14.5, 2);         // nada aparece; a vale 29
const b = mostrarTotalDoItem(14.5, 2);  // aparece 29; b vale undefined
console.log(a, b);                      // 29 undefined
```

- Com o `return`, a chamada vira o valor: `totalDoItem(14.5, 2)` vale `29`
- Sem `return`, a função devolve `undefined`
- O `return` encerra a receita: o que vem depois dele, dentro das chaves, não roda

---

## :icon[corner-down-right] O return na prática

Com o prato na mão, você faz o que quiser com ele:

```javascript
function totalDoItem(preco, quantidade) {
  return preco * quantidade;
}

const refri = totalDoItem(14.5, 2);
console.log(refri);                                        // 29
console.log(totalDoItem(72.9, 1) + totalDoItem(14.5, 2));  // 101.9
console.log(`Refrigerantes: R$ ${totalDoItem(14.5, 2).toFixed(2)}`);
// Refrigerantes: R$ 29.00
```

| Caso | O que acontece |
|---|---|
| guardar numa constante | `refri` passa a valer 29 |
| usar numa conta | as chamadas viram 72.9 e 29, e o `+` soma os dois |
| encaixar na template string | a chamada entra no `${}`, e o valor dela vai para a frase |

Uma função que só faz `console.log` não serve para nada disso: ela mostra o 29, mas não entrega nada.

---

## :icon[list-ordered] A chamada, passo a passo

Esta é a primeira regra do Racha-conta: os centavos de um valor em reais.

```javascript
function paraCentavos(reais) {
  return Math.round(reais * 100);
}

const subtotalCentavos = paraCentavos(187.5);
```

| Passo | O que acontece |
|---|---|
| 1 | O Node encontra `paraCentavos(187.5)` e vai até a receita |
| 2 | O argumento entra no parâmetro: `reais` vale `187.5` |
| 3 | O corpo faz a conta: `Math.round(187.5 * 100)` dá `18750` |
| 4 | O `return` entrega `18750`, e a receita acaba |
| 5 | A chamada vira o prato: `const subtotalCentavos = 18750;` |

Você chama funções desde a aula 3: `console.log`, `Math.round` e `toFixed` são receitas que já vêm com o JavaScript.

---

## Módulos

Numa loja, o que fica na vitrine e o que fica no estoque?

---

## :icon[store] export e import: a vitrine

Cada arquivo `.js` é um **módulo**: o que nasce nele fica nele. Pense numa loja: o **`export`** (exportar) põe a função na vitrine, e outro arquivo pega de lá com o **`import`** (importar). O que não tem `export` fica no estoque.

```javascript
// src/regras/conta.js
export function paraCentavos(reais) {
  return Math.round(reais * 100);
}
```

```javascript
// src/scripts/racha.js
import { paraCentavos } from '../regras/conta.js';
```

| Parte | O que ela diz |
|---|---|
| `export function` | "ponha esta receita na vitrine" |
| `import { paraCentavos }` | "pegue da vitrine a `paraCentavos`": entre chaves, com o nome exato |
| `from '../regras/conta.js'` | "da vitrine deste arquivo"; o `.js` no fim é obrigatório |

Na aula 3, o gerador do catálogo importou as listas de `'../data/produtos.js'`: lá, elas tinham `export`.

---

## :icon[folder-tree] O caminho do import

:::center
![Diagrama: o caminho '../regras/conta.js' parte da pasta scripts, onde está o racha.js; os dois pontos sobem para src, e regras/conta.js entra na pasta regras até o conta.js, que tem o export](images/e07-caminho-do-import.svg)
:::

- O caminho parte da **pasta do arquivo que importa**: o `racha.js` mora em `scripts/`
- O **`..`** sobe uma pasta: de `scripts/` para `src/`
- O `regras/conta.js` entra em `regras/` e chega no arquivo

É diferente do `fs`: o `'src/data/conta.json'` do `readFileSync` parte da pasta em que o terminal está.

---

## :icon[equal] Regras puras: a receita só cozinha

Uma **regra pura** é uma receita que só cozinha: recebe os ingredientes pelos parâmetros e entrega o prato com `return`. Ela não tira foto (`console.log`) e não vai buscar nada no armário (`fs`). Cada arquivo tem o seu trabalho:

| Arquivo | O que faz | `console.log` ou `fs`? |
|---|---|---|
| `src/regras/conta.js` | as regras: recebem e devolvem valores | nunca |
| `src/scripts/racha.js` | lê o `conta.json`, chama as regras e mostra | sim |

Por que separar:

- :icon[test-tube] No E08, o teste chama a regra e confere o que ela devolveu
- :icon[globe] No E12, a página web usa o `conta.js` no navegador, onde não existe `fs`
- :icon[clipboard-check] A rubrica do projeto confere essa separação

---

## :icon[milestone] Projeto 1 · Passo 1: paraCentavos

No painel do VS Code, crie a pasta `src/regras`, ao lado de `data` e `scripts`. Dentro dela, o arquivo `conta.js`:

```javascript
export function paraCentavos(reais) {
  return Math.round(reais * 100);
}
```

No `racha.js`, uma linha de `import` nova, logo depois da do `picocolors`:

```javascript
import { paraCentavos } from '../regras/conta.js';
```

E a linha do `subtotalCentavos` passa a chamar a função:

```javascript
const subtotalCentavos = paraCentavos(subtotal);
```

Com `subtotal` valendo `187.5`, a chamada entrega `18750`, o mesmo número de antes.

**Pronto quando:** `npm run racha` mostra a mesma saída da etapa 3, de `Racha-conta:` até `Centavos que sobram: 1`.

---

## Valor padrão

Na conta do restaurante, quanto de gorjeta vem se ninguém disser nada?

---

## :icon[sliders-horizontal] Valor padrão: o de sempre

Na conta do restaurante, a gorjeta de 10% vem sozinha: é o de sempre. Se você quiser outra, você diz. O **valor padrão** é isso: o valor que o parâmetro recebe quando a chamada não traz o argumento.

```javascript
function saudar(nome = 'visitante') {
  console.log(`Boa noite, ${nome}!`);
}

saudar('Ana');   // Boa noite, Ana!
saudar();        // Boa noite, visitante!
```

- `nome = 'visitante'` se lê: "se ninguém disser o nome, use `'visitante'`"
- O padrão só entra quando o argumento **não vem**. Veio um valor, vale o valor
- Os parâmetros com padrão ficam no fim da lista

---

## :icon[sliders-horizontal] Valor padrão na prática

**Caso 1: a taxa de entrega.** O delivery cobra R$ 8 de entrega, a não ser que o pedido diga outra:

```javascript
function totalDoPedido(pedido, entrega = 8) {
  return pedido + entrega;
}

console.log(totalDoPedido(50));       // 58
console.log(totalDoPedido(50, 12));   // 62
console.log(totalDoPedido(50, 0));    // 50: entrega grátis
```

O `0` é um valor: ele veio, então vale, e o padrão não entra.

**Caso 2: a gorjeta do Racha-conta**, `calcularGorjeta(subtotal, percentual = 10)`, com o subtotal de 18750 centavos:

| Chamada | `percentual` vale | Devolve |
|---|---|---|
| `calcularGorjeta(18750)` | 10, o de sempre | `1875` |
| `calcularGorjeta(18750, 15)` | 15 | `2813` |
| `calcularGorjeta(18750, 0)` | 0, sem gorjeta | `0` |

---

## :icon[milestone] Projeto 1 · Passo 2: calcularGorjeta

No `conta.js`, embaixo da primeira regra:

```javascript
export function calcularGorjeta(subtotal, percentual = 10) {
  return Math.round(subtotal * percentual / 100);
}
```

No `racha.js`, o `import` traz as duas, separadas por vírgula, e a linha da gorjeta chama a função:

```javascript
import { paraCentavos, calcularGorjeta } from '../regras/conta.js';
```

```javascript
const gorjetaCentavos = calcularGorjeta(subtotalCentavos, conta.gorjeta);
```

- Dentro da regra, `subtotal` é o espaço do ingrediente: ele recebe o `subtotalCentavos` (18750), e não o `subtotal` em reais do script
- Para ver o padrão, ponha no fim do `racha.js` `console.log(calcularGorjeta(18750));` e `console.log(calcularGorjeta(18750, 15));`. Rode, confira `1875` e `2813` e apague as duas linhas. O `18750 * 15 / 100` dá `2812.5`, e o `Math.round` sobe o meio centavo

**Pronto quando:** `npm run racha` mostra a mesma saída da etapa 3.

---

## A função seta

Dá para escrever a mesma receita num bilhete de uma linha?

---

## :icon[square-function] A seta: a forma curta

Desde a aula 3, você escreve funções: o teste do `filter` e a conta do `reduce` são **funções seta**, a forma curta de uma função. Esta receita, com `function`:

```javascript
function caro(item) {
  return item.preco > 50;
}
```

fica assim, com a seta:

```javascript
const caro = (item) => item.preco > 50;
```

| Parte | O que quer dizer |
|---|---|
| `const caro =` | a função guardada numa constante chamada `caro` |
| `(item)` | o parâmetro, como na `function` |
| `=>` | a seta: "devolva" (na aula 3, "responda") |
| `item.preco > 50` | o que ela devolve; sem chaves, a seta não precisa de `return` |

As duas se chamam do mesmo jeito: `caro({ preco: 68.9 })` devolve `true`.

---

## :icon[square-function] A seta na prática

**Caso 1: o `caros` do `racha.js`.** O teste do `filter` é essa seta, escrita ali mesmo, sem nome:

```javascript
const caros = conta.itens.filter((item) => item.preco > 50);
console.log(caros.length);   // 2
```

O `filter` chama a seta uma vez por item, e cada item entra no parâmetro `item`.

**Caso 2: a seta do `reduce` tem dois parâmetros**, separados por vírgula: `(total, item) => total + item.quantidade`.

**Caso 3: com chaves, precisa de `return`.** As chaves viram o modo de preparo, e sem `return` a seta devolve `undefined`:

```javascript
conta.itens.filter((item) => { item.preco > 50 });          // 0 itens
conta.itens.filter((item) => { return item.preco > 50; });  // 2 itens
```

No Racha-conta, as regras do `conta.js` usam `function`, com `export`; a seta fica no `filter` e no `reduce`.

---

## Formatar Documento

Caderno rabiscado ou passado a limpo: em qual você estuda melhor?

---

## :icon[wand] Formatar Documento: o código passado a limpo

O **Formatar Documento** (*Format Document*, no VS Code em inglês) passa o código a limpo: arruma os espaços e o recuo, sem mudar o que o código faz. O atalho é <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>F</kbd>.

Antes:

```javascript
export function calcularGorjeta(subtotal,percentual=10){
return Math.round(subtotal*percentual/100);
    }
```

Depois:

```javascript
export function calcularGorjeta(subtotal, percentual = 10) {
  return Math.round(subtotal * percentual / 100);
}
```

- Um espaço depois da vírgula e em volta do `=`, do `*` e da `/`
- O **recuo**, o espaço no começo da linha, mostra o que está dentro das chaves
- As aspas e os `;` ficam como você escreveu

---

## :icon[milestone] Projeto 1 · Passo 3: Formatar Documento

:::steps
1. No `conta.js`, bagunce de propósito a `calcularGorjeta`: tire os espaços e o recuo, como no "antes"
2. Aperte <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>F</kbd>
3. Na primeira vez, aparece o aviso *There are multiple formatters for 'JavaScript' files*. Clique em **Configure...**, escolha **TypeScript and JavaScript Language Features** e aperte o atalho de novo
4. Salve com <kbd>Ctrl</kbd> + <kbd>S</kbd>. Faça o mesmo no `racha.js`
:::

- O aviso aparece porque o Prettier, do E01, também formata; o do VS Code mantém as aspas simples
- O recuo segue o **Spaces** da barra de baixo do VS Code: 2 ou 4, os dois servem

**Pronto quando:** apertar o atalho de novo não muda nada nos dois arquivos.

---

## :icon[milestone] Projeto 1 · Sua vez: formatarReais

Agora, sozinho. No `conta.js`, a terceira regra: `export function formatarReais(centavos)`, que devolve o texto em reais, com `R$` e duas casas, montado com template string:

```javascript
formatarReais(18750);   // 'R$ 187.50'
formatarReais(5);       // 'R$ 0.05'
```

Depois, importe no `racha.js` e troque as quatro linhas de dinheiro (Subtotal, Gorjeta, Total e Por pessoa) para usarem a função. A vírgula do real chega no E09.

:::tip Dicas
- A conta é a que as linhas do script já fazem: `(centavos / 100).toFixed(2)`
- A função devolve com `return`; quem mostra é o `console.log` do script
- No script, a chamada vai dentro do `${}`: `` `Total: ${formatarReais(totalCentavos)}` ``
:::

**Pronto quando:** `npm run racha` mostra a mesma saída da etapa 3, e o `conta.js` tem as três funções, sem `console.log` e sem `fs`.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `does not provide an export named` | faltou o `export`, ou o nome difere | `export function`, com o mesmo nome no `import` |
| `Cannot find module` | caminho do `import` errado | `'../regras/conta.js'`, com `..` e `.js` |
| `R$ NaN` nas linhas | `paraCentavos` sem `return` | `return Math.round(reais * 100);` |
| `Subtotal: undefined` | `formatarReais` sem `return` | `return` antes da template string |
| `formatarReais is not defined` | a função não está no `import` | o nome nas chaves do `import` |
| o código bagunçado continua igual | nenhum formatador escolhido | <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>, *Format Document With...* |

---

## :icon[milestone] Projeto 1 · Etapa 4 pronta

`npm run racha` termina com as mesmas linhas da etapa 3:

```plaintext
Unidades pedidas: 5
Itens acima de R$ 50: 2
Subtotal: R$ 187.50
Gorjeta (10%): R$ 18.75
Total: R$ 206.25
Por pessoa: R$ 51.56
Centavos que sobram: 1
```

- `src/regras/conta.js` tem `paraCentavos`, `calcularGorjeta` e `formatarReais`, com `export`, sem `console.log` e sem `fs`
- O `racha.js` importa e usa as três; os dois arquivos passaram pelo Formatar Documento

```bash
git add .
git commit -m "Projeto 1: etapa 4, as primeiras regras"
git push
```

Se faltar alguma parte, termine em casa: o E08 começa com as três regras prontas.

---

## Resumo

:::summary
- Uma função é uma receita com nome: `function nome(parametro) { ... }` guarda, e `nome(argumento)` chama
- O parâmetro é o espaço do ingrediente; o argumento, o ingrediente da chamada. O que falta chega como `undefined`
- O `return` entrega o prato pronto, e a chamada vira esse valor; sem `return`, sai `undefined`
- Em `percentual = 10`, o 10 é o valor padrão: vale quando o argumento não vem
- A seta, `(item) => item.preco > 50`, é a forma curta; sem chaves, ela devolve sozinha
- `export` põe na vitrine e `import { nome } from '../regras/conta.js'` pega de lá; regra pura não tem `console.log` nem `fs`
- <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>F</kbd> passa o código a limpo
:::

---

## :icon[arrow-right] Próximos passos

No E08, as três regras ganham **testes automatizados**: uma prova com gabarito que o computador corrige sozinho.

- :icon[test-tube] o Jest chama cada regra e confere o que ela devolveu, por isso elas têm `return`
- :icon[circle-x] primeiro, você vê um teste falhar, em vermelho
- :icon[circle-check] depois, conserta a regra e vê o verde
