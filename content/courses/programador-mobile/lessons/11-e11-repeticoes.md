---
title: Repetições
summary: "Laços com for...of e for, acumulador e push: o Racha-conta soma os itens e divide a conta sem perder centavo."
module: linguagem-js
duration_minutes: 90
objectives:
  - Percorrer uma lista com for...of e somar com um acumulador
  - Repetir com o for de índice, sabendo o começo, a condição e o passo
  - Montar uma lista com push dentro de um laço
  - Dividir a conta em partes que sempre fecham e testar listas com toEqual
---

# Repetições

Programador Mobile · Encontro E11 · Aula 11 de 45

---

## O que você vai aprender

:::goal
- Repetir um trecho para cada item de uma lista, com `for...of`
- Somar uma lista com um acumulador, o visor do `reduce` feito à mão
- Contar as voltas com o `for` de índice e montar uma lista com `push`
- Dividir a conta do Racha-conta em partes que sempre fecham, uma linha por pessoa
- Comparar listas nos testes com `toEqual`
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **laço** | um trecho de código que se repete, como conferir o carrinho item por item, até acabar |
| **volta** | cada repetição do laço |
| **`for...of`** | o laço que dá uma volta para cada item de uma lista |
| **acumulador** | a caixa que nasce antes do laço e vai somando a cada volta |
| **índice** | o número da volta, que também abre a gaveta da lista: `itens[i]` |
| **`push`** | põe um item no fim de uma lista (*push*, empurrar) |

---

## O centavo que sobra

No fim do E10, o Racha-conta mostra a parte de cada um e o centavo que sobra. Ninguém sabe quem paga esse centavo.

::::columns
:::col
**Hoje**

```plaintext
Total: R$ 206,25
Por pessoa: R$ 51,56
Centavos que sobram: 1
```
:::
:::col
**No fim do encontro**

```plaintext
Total: R$ 206,25
Pessoa 1: R$ 51,57
Pessoa 2: R$ 51,56
Pessoa 3: R$ 51,56
Pessoa 4: R$ 51,56
```
:::
::::

Quatro vezes 51,56 dá 206,24: falta 1 centavo, e a primeira pessoa paga 51,57.

:::question
Se a mesa tiver 7 pessoas, quem escreve as 7 linhas? E se tiver 30?
:::

---

## Laços

Chegou a compra do mercado. Como você confere se veio tudo?

---

## :icon[repeat] Laço: conferir item por item

Um **laço** repete um trecho de código. É como conferir o carrinho do mercado item por item, até acabar: pega um, confere, pega o próximo. Cada repetição é uma **volta**.

Sem laço, mostrar os itens da conta pede uma linha para cada gaveta da lista:

```javascript
console.log(conta.itens[0].descricao);   // Pizza grande marguerita
console.log(conta.itens[1].descricao);   // Pizza grande calabresa
console.log(conta.itens[2].descricao);   // Refrigerante 2 litros
console.log(conta.itens[3].descricao);   // Petit gâteau
```

- Com 10 itens, faltam 6 linhas
- Com 2 itens, a gaveta 2 não existe, e o script quebra: `Cannot read properties of undefined (reading 'descricao')`
- Com um laço, você escreve a linha **uma vez**, e o JavaScript repete para cada item, sejam 2 ou 200

---

## :icon[repeat] for...of: uma volta por item

O **`for...of`** ("para cada... de") é o laço que percorre uma lista. A cada volta, ele guarda o item da vez numa caixa e roda o que está nas chaves. Com a `conta` lida do `conta.json`, como no `racha.js`:

```javascript
for (const item of conta.itens) {
  console.log(item.descricao);
}
```

| Parte | O que ela diz |
|---|---|
| `for (... of conta.itens)` | "para cada item da lista `conta.itens`..." |
| `const item` | "...guarde o item da vez na caixa `item`". O nome é você quem escolhe |
| `{ console.log(...) }` | "...e faça o que está nas chaves" |

A caixa `item` nasce de novo a cada volta: por isso pode ser `const`. Na tela, as mesmas quatro linhas, agora com um `console.log` só.

---

## :icon[repeat] for...of, volta por volta

| Volta | `item` é a ficha | O que aparece |
|---|---|---|
| 1 | `itens[0]` | Pizza grande marguerita |
| 2 | `itens[1]` | Pizza grande calabresa |
| 3 | `itens[2]` | Refrigerante 2 litros |
| 4 | `itens[3]` | Petit gâteau |
| | acabaram os itens | o laço termina |

- As voltas seguem a ordem da lista, da gaveta 0 até a última
- São tantas voltas quantos itens: `conta.itens.length`, 4. Com a lista vazia, zero voltas, e nada aparece
- Depois da última volta, o script segue na linha de baixo da `}`

---

## :icon[repeat] for...of na prática

**Caso 1: a comanda.** Uma linha por item, com a quantidade na frente:

```javascript
for (const item of conta.itens) {
  console.log(`${item.quantidade} x ${item.descricao}`);
}
```

```plaintext
1 x Pizza grande marguerita
1 x Pizza grande calabresa
2 x Refrigerante 2 litros
1 x Petit gâteau
```

**Caso 2: uma decisão a cada volta.** O `if` do E10, dentro do laço, escolhe o que mostrar:

```javascript
for (const item of conta.itens) {
  if (item.quantidade > 1) {
    console.log(`Mais de uma unidade: ${item.descricao}`);
  }
}
// Mais de uma unidade: Refrigerante 2 litros
```

---

## Acumulador

O visor do caixa, do `reduce` da aula 3: dá para montar um você mesmo?

---

## :icon[calculator] Acumulador: o visor feito à mão

Um **acumulador** é uma caixa que nasce **antes** do laço e cresce a cada volta. É o visor da calculadora que acumula, a do `reduce` da aula 3: começa no 0, e cada item soma a sua parte ao que já estava lá. Quantas unidades a mesa pediu?

```javascript
let unidades = 0;
for (const item of conta.itens) {
  unidades = unidades + item.quantidade;
}
console.log('Unidades:', unidades);   // Unidades: 5
```

| Linha | O que ela diz |
|---|---|
| `let unidades = 0;` | "o visor começa no 0". `let`, porque o valor vai mudar |
| `unidades = unidades + item.quantidade;` | "pegue o que está no visor, some a quantidade do item e guarde de volta no visor" |
| o `console.log`, depois da `}` | "mostre o visor quando os itens acabarem" |

---

## :icon[calculator] O acumulador, volta por volta

| Volta | `unidades` antes | `item` | A conta | `unidades` depois |
|---|---|---|---|---|
| 1 | 0 | Pizza marguerita | `0 + 1` | 1 |
| 2 | 1 | Pizza calabresa | `1 + 1` | 2 |
| 3 | 2 | Refrigerante | `2 + 2` | 4 |
| 4 | 4 | Petit gâteau | `4 + 1` | 5 |

- O valor depois de uma volta é o valor antes da próxima, como no `reduce`
- O acumulador nasce **fora** das chaves do `for`: lá dentro, voltaria a 0 a cada volta

:::tip Atalho
`unidades += item.quantidade` faz a mesma conta, mais curta. O Racha-conta usa a forma longa.
:::

---

## :icon[arrow-left-right] for...of ou reduce?

O `unidades` do `racha.js`, desde o E04, é um `reduce`:

```javascript
const unidades = conta.itens.reduce((total, item) => total + item.quantidade, 0);
```

As mesmas peças, nos dois:

| Peça | No `reduce` | No `for...of` |
|---|---|---|
| o visor no começo | o `0`, no fim | `let unidades = 0;` |
| o que está no visor | `total` | `unidades` |
| o item da vez | `item` | `const item` |
| a conta de cada volta | `total + item.quantidade` | `unidades = unidades + item.quantidade;` |

Os dois dão 5. O `reduce` é um laço pronto, com o acumulador por dentro; no `for...of`, cada peça fica à vista, com nome. A soma da conta, no `somarItens`, usa o `for...of`.

---

## :icon[milestone] Projeto 1 · Passo 1: somarItens

No `racha.js`, o subtotal ainda soma os preços em reais, com `reduce`, e só depois vira centavos. A regra nova soma já em centavos: converte **cada preço** antes de somar. No fim do `conta.js`:

```javascript
export function somarItens(itens) {
  let soma = 0;
  for (const item of itens) {
    soma = soma + paraCentavos(item.preco) * item.quantidade;
  }
  return soma;
}
```

- `paraCentavos(72.9)` dá `7290`: a soma é toda de inteiros, sem o problema do `0.1 + 0.2` do E06
- O `return soma;` fica **depois** da `}` do `for`: a função só entrega quando os itens acabam
- Com a lista vazia, o laço não dá nenhuma volta, e a função devolve o `0` do começo

---

## :icon[calculator] somarItens, volta por volta

Com os itens da Cantina Bella Nonna:

| Volta | `item` | A conta | `soma` depois |
|---|---|---|---|
| 1 | Pizza grande marguerita | `0 + 7290 * 1` | 7290 |
| 2 | Pizza grande calabresa | `7290 + 6890 * 1` | 14180 |
| 3 | Refrigerante 2 litros | `14180 + 1450 * 2` | 17080 |
| 4 | Petit gâteau | `17080 + 1670 * 1` | 18750 |

- A multiplicação vem antes da soma, como no subtotal do E04
- Acabaram os itens: o `return` entrega `18750`, os R$ 187,50 da conta em centavos

---

## :icon[milestone] Projeto 1 · Passo 1: os testes de somarItens

No `conta.test.js`, `somarItens` no `import` e, no fim do arquivo:

```javascript
test('somarItens soma a conta de exemplo em centavos', () => {
  const itens = [
    { descricao: 'Pizza grande marguerita', quantidade: 1, preco: 72.9 },
    { descricao: 'Pizza grande calabresa', quantidade: 1, preco: 68.9 },
    { descricao: 'Refrigerante 2 litros', quantidade: 2, preco: 14.5 },
    { descricao: 'Petit gâteau', quantidade: 1, preco: 16.7 },
  ];
  expect(somarItens(itens)).toBe(18750);
});

test('somarItens de uma lista vazia dá 0', () => {
  expect(somarItens([])).toBe(0);
});
```

O teste monta os itens ali mesmo: não lê o `conta.json`. O `[]` é uma lista vazia.

**Pronto quando:** `npm test` passa com 35 testes, os dois novos com `√`.

---

## for com índice

Na academia, como você sabe que já fez as 12 repetições?

---

## :icon[hash] for: começo, condição e passo

Às vezes o laço precisa do **número** da volta, para escrever "Pessoa 1", "Pessoa 2". O **`for`** com **índice** conta as voltas numa caixa, quase sempre chamada `i`. É o mesmo laço de conferir o carrinho item por item, agora contando: 0, 1, 2...

```javascript
for (let i = 0; i < 4; i++) {
  console.log(`Pessoa ${i + 1}`);
}
// Pessoa 1, Pessoa 2, Pessoa 3 e Pessoa 4, uma por linha
```

| Parte | No código | A pergunta |
|---|---|---|
| começo | `let i = 0` | de onde parto? |
| condição | `i < 4` | continuo? Ela é testada antes de cada volta |
| passo | `i++` | como avanço? Soma 1 ao `i`: o mesmo que `i = i + 1` |

O `i` é `let` porque muda a cada volta.

---

## :icon[hash] for, volta por volta

| Volta | `i` | `i < 4`? | O que aparece |
|---|---|---|---|
| 1 | 0 | sim | Pessoa 1 |
| 2 | 1 | sim | Pessoa 2 |
| 3 | 2 | sim | Pessoa 3 |
| 4 | 3 | sim | Pessoa 4 |
| | 4 | não | o laço termina |

- Depois de cada volta, o passo roda (`i++`), e a condição é testada de novo
- O `i` vai do 0 ao 3: 4 voltas. O `i + 1` no texto conta as pessoas a partir de 1
- Com `i <= 4`, o 4 ainda passaria: uma volta a mais, e apareceria `Pessoa 5`

---

## :icon[hash] for com índice na prática

**Caso 1: a comanda numerada.** `conta.itens[i]` abre a gaveta número `i`:

```javascript
for (let i = 0; i < conta.itens.length; i++) {
  console.log(`${i + 1}. ${conta.itens[i].descricao}`);
}
// 1. Pizza grande marguerita, 2. Pizza grande calabresa...
```

As gavetas vão do 0 ao 3, e `conta.itens.length` é 4: por isso `<`, e não `<=`.

**Caso 2: uma decisão a cada volta.** Na padaria, os 2 primeiros clientes do dia ganham brinde:

```javascript
const brindes = 2;
for (let i = 0; i < 4; i++) {
  if (i < brindes) {
    console.log(`Cliente ${i + 1}: com brinde`);
  } else {
    console.log(`Cliente ${i + 1}: sem brinde`);
  }
}
```

Saem `Cliente 1: com brinde`, `Cliente 2: com brinde`, `Cliente 3: sem brinde` e `Cliente 4: sem brinde`.

---

## push

Lembrou de mais um item para a lista de compras. Onde você escreve?

---

## :icon[circle-plus] push: um item no fim da lista

O **`push`** (empurrar) põe um item no fim de uma lista. Na fileira de gavetas, é abrir uma gaveta nova depois da última. A lista pode nascer vazia, `[]`, e crescer:

```javascript
const partes = [];
partes.push(5157);
partes.push(5156);
console.log(partes);          // [ 5157, 5156 ]
console.log(partes.length);   // 2
```

| Linha | O que ela diz |
|---|---|
| `const partes = [];` | "crie uma lista vazia, sem nenhuma gaveta" |
| `partes.push(5157);` | "ponha 5157 no fim da lista": vai para a gaveta 0 |
| `partes.push(5156);` | "ponha 5156 no fim": vai para a gaveta 1 |

Com `const`, funciona: a caixa continua com a mesma lista, e o `push` só põe itens dentro dela. Trocar a lista por outra, `partes = [1]`, é que dá erro.

---

## :icon[circle-plus] push na prática

**Caso 1: uma lista nova, montada num `for...of`.** Os preços da conta em centavos, com o `paraCentavos` do `conta.js`:

```javascript
const centavos = [];
for (const item of conta.itens) {
  centavos.push(paraCentavos(item.preco));
}
console.log(centavos);   // [ 7290, 6890, 1450, 1670 ]
```

**Caso 2: `for`, `if` e `push` juntos.** Os brindes da padaria viram uma lista:

```javascript
const fila = [];
for (let i = 0; i < 4; i++) {
  if (i < 2) {
    fila.push('com brinde');
  } else {
    fila.push('sem brinde');
  }
}
console.log(fila);   // [ 'com brinde', 'com brinde', 'sem brinde', 'sem brinde' ]
```

A lista também é um acumulador: começa vazia e ganha um item por volta.

---

## :icon[milestone] Projeto 1 · Passo 2: dividirConta

A regra que reparte o total, em centavos. Cada pessoa paga a parte inteira, e os centavos que sobram vão, **um a um**, para as primeiras pessoas. No fim do `conta.js`:

```javascript
export function dividirConta(total, pessoas) {
  const parte = Math.floor(total / pessoas);
  const sobra = total % pessoas;
  const partes = [];
  for (let i = 0; i < pessoas; i++) {
    if (i < sobra) {
      partes.push(parte + 1);
    } else {
      partes.push(parte);
    }
  }
  return partes;
}
```

**Pronto quando:** `npm test` continua verde, com 35 testes. A divisão aparece na tela no Passo 3.

---

## :icon[list-ordered] dividirConta em português

| Linha | O que ela diz |
|---|---|
| `Math.floor(total / pessoas)` | "a parte de todos, sem as casas": o `Math.floor` do E06 |
| `total % pessoas` | "os centavos que sobram": o resto, do E06 |
| `const partes = [];` | "a lista das partes começa vazia" |
| `for (let i = 0; i < pessoas; i++)` | "uma volta por pessoa" |
| `if (i < sobra)` | "esta é uma das primeiras, que levam um centavo da sobra?" |
| `partes.push(...)` | "a parte dela vai para o fim da lista": `parte + 1` ou `parte` |

Depois do `for`, o `return partes` entrega a lista inteira.

---

## :icon[circle-plus] dividirConta, volta por volta

`dividirConta(11000, 3)`, R$ 110,00 para 3 pessoas: `parte` é 3666 e `sobra` é 2.

| Volta | `i` | `i < sobra`? | `push` | `partes` depois |
|---|---|---|---|---|
| 1 | 0 | `0 < 2`: sim | 3667 | [3667] |
| 2 | 1 | `1 < 2`: sim | 3667 | [3667, 3667] |
| 3 | 2 | `2 < 2`: não | 3666 | [3667, 3667, 3666] |

- Com `i` igual a 3, `3 < 3` é `false`: o laço para, e a função devolve a lista
- 3667 + 3667 + 3666 dá 11000: as partes fecham o total
- Na conta da Cantina, `dividirConta(20625, 4)` dá `[5157, 5156, 5156, 5156]`

---

## :icon[milestone] Projeto 1 · Passo 3: o racha.js com as duas

:::steps
1. No `import`, sai o `paraCentavos` (o script não usa mais) e entram `somarItens` e `dividirConta`
2. Sai a linha `const subtotal = conta.itens.reduce(...)`. O subtotal nasce do `somarItens`: `let subtotalCentavos = somarItens(conta.itens);`
3. No `else`, saem `porPessoa` e `sobra`, e entra `const partes = dividirConta(totalCentavos, pessoas);`
4. No fim do `else`, um `for` escreve uma linha por pessoa, no lugar de Por pessoa e Centavos que sobram:
:::

```javascript
  for (let i = 0; i < partes.length; i++) {
    console.log(`Pessoa ${i + 1}: ${formatarReais(partes[i])}`);
  }
```

`partes.length` é o tamanho da lista, uma parte por pessoa. `partes[i]` abre a gaveta `i`, e o `i + 1` numera as pessoas a partir de 1.

---

## :icon[milestone] Projeto 1 · Passo 3: a conta fecha

**Pronto quando** os dois comandos terminam assim:

::::columns
:::col
`npm run racha`

```plaintext
Subtotal: R$ 187,50
Gorjeta (10%): R$ 18,75
Total: R$ 206,25
Pessoa 1: R$ 51,57
Pessoa 2: R$ 51,56
Pessoa 3: R$ 51,56
Pessoa 4: R$ 51,56
```
:::
:::col
`npm run racha "R$ 100,00" 3`

```plaintext
Subtotal: R$ 100,00
Gorjeta (10%): R$ 10,00
Total: R$ 110,00
Pessoa 1: R$ 36,67
Pessoa 2: R$ 36,67
Pessoa 3: R$ 36,66
```
:::
::::

Antes dessas linhas, o título, a tabela dos itens e as outras linhas continuam iguais. 51,57 + 51,56 + 51,56 + 51,56 dá 206,25: o centavo da sobra ganhou dono.

---

## :icon[test-tube] Listas no teste: toEqual

No REPL, duas listas com os mesmos itens:

```bash
> [5157, 5156] === [5157, 5156]
false
```

Cada `[ ]` cria uma lista nova. O `===`, e o `toBe` do Jest, perguntam "é a **mesma** lista?", e não "tem os mesmos itens?". Para comparar listas, o teste usa o **`toEqual`**, que confere item por item, na ordem:

```javascript
test('push põe os itens no fim da lista', () => {
  const partes = [];
  partes.push(5157);
  partes.push(5156);
  expect(partes).toEqual([5157, 5156]);
});
```

- Com `toBe`, este teste falha com `Received: serializes to the same string`: os itens são iguais, mas são duas listas
- No nome de um `test.each`, o **`%j`** mostra uma lista, como o `%i` mostra um inteiro: `[5157,5156]`

---

## :icon[milestone] Projeto 1 · Sua vez: os testes da divisão

No `conta.test.js`, `dividirConta` no `import` e:

1. Um `test.each` com esta tabela:

| Total | Pessoas | Partes |
|---|---|---|
| 10000 | 3 | [3334,3333,3333] |
| 20625 | 4 | [5157,5156,5156,5156] |
| 11000 | 3 | [3667,3667,3666] |
| 9000 | 1 | [9000] |
| 2 | 3 | [1,1,0] |

2. Um teste que soma as partes de `dividirConta(20625, 4)` e confere que dá `20625`

:::tip Dicas
- A terceira coluna é uma lista: `[10000, 3, [3334, 3333, 3333]]`
- Lista se compara com `toEqual`; no nome, o `%j` mostra a lista
- Some as partes com um `for...of`, como no `somarItens`
:::

**Pronto quando:** `npm test` passa com 41 testes.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Assignment to constant variable.` | `const i` no `for` | `let i = 0` |
| `soma is not defined` | `let soma` dentro do `for` | criar antes do laço |
| `Received: 7290` | o `return` está dentro do `for` | `return soma;` depois da `}` |
| uma parte a mais, ou `Pessoa 5: R$ NaN` | `<=`: uma volta a mais | `<` na condição |
| `serializes to the same string` | `toBe` com lista | `toEqual` |
| `Pessoa 1` sem parar, ou `Invalid array length` | laço sem fim: faltou o `i++` | <kbd>Ctrl</kbd> + <kbd>C</kbd>; pôr o `i++` |

---

## :icon[milestone] Projeto 1 · Etapa 8 pronta

- `npm test` passa com 41 testes
- `npm run racha` termina com `Pessoa 1: R$ 51,57` e três `R$ 51,56`
- `npm run racha "R$ 100,00" 3` termina com 36,67, 36,67 e 36,66
- O `conta.js` tem `somarItens` e `dividirConta`, sem `console.log`; o `racha.js` não tem mais o `reduce` do subtotal nem as linhas Por pessoa e Centavos que sobram

Na raiz do `racha-conta`:

```bash
git add .
git commit -m "Projeto 1: etapa 8, somar e dividir"
git push
```

Faltou algum teste? Termine em casa e faça o commit e o `push` antes do E12.

---

## Resumo

:::summary
- Um laço repete um trecho; cada repetição é uma volta. O `for...of` dá uma volta por item, na ordem da lista
- O acumulador nasce antes do laço e cresce a cada volta, como o visor do `reduce`
- O `for` com índice tem começo, condição e passo: `for (let i = 0; i < n; i++)`; a condição é testada antes de cada volta
- `lista[i]` abre a gaveta `i`, o `push` põe um item no fim da lista, e no teste as listas se comparam com `toEqual`
- `dividirConta` dá a parte com `Math.floor`, a sobra com `%` e um centavo a mais para cada uma das primeiras pessoas
:::

---

## :icon[arrow-right] Próximos passos

No E12, a última etapa do Racha-conta, e a entrega:

- :icon[calendar] a data e a hora do recibo, com `Date`
- :icon[receipt] o recibo montado numa regra só, as linhas juntas num texto
- :icon[globe] uma página web pronta que divide a conta com as **suas** funções
- :icon[send] o README com o print, o último commit e a entrega do projeto
