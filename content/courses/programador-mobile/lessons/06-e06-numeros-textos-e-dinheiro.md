---
title: Números, textos e dinheiro
summary: "Tipos, contas e dinheiro em centavos: o Racha-conta calcula a gorjeta e o total sem errar um centavo."
module: linguagem-js
duration_minutes: 90
objectives:
  - Reconhecer os tipos number, string e boolean e perguntar o tipo com typeof
  - Escolher entre const e let e fazer contas com os operadores, o resto e o Math
  - Calcular dinheiro em centavos inteiros, sem o erro do 0.1 + 0.2
  - Montar as linhas do Racha-conta com template string
---

# Números, textos e dinheiro

Programador Mobile · Encontro E06 · Aula 6 de 45

---

## O que você vai aprender

:::goal
- Reconhecer o tipo de cada valor: número, texto, sim ou não
- Escolher entre `const` e `let`
- Fazer as contas da mesa com os operadores, o resto `%` e o `Math`
- Entender por que `0.1 + 0.2` não dá `0.3` e contar dinheiro em centavos
- Montar as linhas do Racha-conta com template string
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **tipo** | o que cabe na caixa: número, texto, sim ou não |
| **`typeof`** | a pergunta "de que tipo é este valor?" |
| **operador** | o sinal que faz uma conta: `+`, `-`, `*`, `/` |
| **resto** | o que sobra numa divisão em partes inteiras: 10 balas para 3 crianças, sobra 1 |
| **centavos inteiros** | o dinheiro contado sem vírgula: R$ 187,50 vira 18750 |
| **template string** | um texto entre crases, com lacunas para encaixar valores |

---

## A conta ainda não fecha

No E04, a calculadora disse "51,5625 para cada um". Hoje, o Racha-conta só calcula o subtotal. No fim do encontro, ele mostra a conta inteira (o título, as pessoas e a tabela dos itens continuam iguais):

::::columns
:::col
**Hoje**

```plaintext
Subtotal: R$ 187.50
Unidades pedidas: 5
Itens acima de R$ 50: 2
```
:::
:::col
**No fim do encontro**

```plaintext
Unidades pedidas: 5
Itens acima de R$ 50: 2
Subtotal: R$ 187.50
Gorjeta (10%): R$ 18.75
Total: R$ 206.25
Por pessoa: R$ 51.56
Centavos que sobram: 1
```
:::
::::

:::question
Por que não fazer todas as contas direto em reais, com os preços do `conta.json`?
:::

---

## Tipos

Dá para somar o nome do restaurante com o preço da pizza?

---

## :icon[shapes] Tipos: o que cabe na caixa

Todo valor guardado numa caixa, a `const` da aula 3, tem um **tipo**: o que cabe na caixa.

| Tipo | O que guarda | Na conta do restaurante |
|---|---|---|
| `number` | número, inteiro ou com ponto | `4`, `72.9` |
| `string` | texto, entre aspas | `'Cantina Bella Nonna'` |
| `boolean` | sim ou não: `true` ou `false` | a resposta de `72.9 > 50` |

- **`number`** (número): inteiro e decimal são o mesmo tipo, sem aspas
- **`string`** (em inglês, "cordão", de letras): com aspas, `'4'` é texto, mesmo sendo um dígito
- **`boolean`**: a resposta das comparações da aula 3

O tipo decide o que dá para fazer: número se soma, texto se junta.

---

## :icon[search] typeof: pergunte o tipo

O **`typeof`** (em inglês, "tipo de") responde o tipo de um valor. Escreva `typeof`, um espaço e o valor. No REPL:

```plaintext
> typeof 72.9
'number'
> typeof 'Cantina Bella Nonna'
'string'
> typeof (72.9 > 50)
'boolean'
> typeof '4'
'string'
```

- A resposta vem entre aspas: o `typeof` devolve o nome do tipo como texto
- O `'4'` é `string`: as aspas mandam mais que o dígito
- Nos parênteses, a comparação vira `true` primeiro; depois o `typeof` pergunta o tipo de `true`

É a primeira pergunta a fazer quando uma conta dá um resultado estranho.

---

## :icon[shapes] Tipos na prática

**Caso 1: o `+` com texto junta.** Com um número de cada lado, o `+` soma. Com um texto de um lado, ele junta os dois, como texto:

```plaintext
> 72.9 + 1
73.9
> '72.9' + 1
'72.91'
> 'Mesa ' + 4
'Mesa 4'
```

**Caso 2: o `toFixed(2)` do E04 devolve texto.** Ele serve para mostrar, não para fazer conta (o `undefined` é o de sempre: criar uma caixa não devolve resultado):

```plaintext
> const subtotal = 187.5
undefined
> subtotal.toFixed(2)
'187.50'
> typeof subtotal.toFixed(2)
'string'
```

Por isso, no Racha-conta, as contas são feitas com números, e o `toFixed(2)` fica só na hora de mostrar.

---

## const e let

O número do seu CPF muda? E o saldo do cartão de ônibus?

---

## :icon[tag] const e let: a caixa lacrada e a que deixa trocar

As duas criam uma caixa com etiqueta: o nome fica na etiqueta, e o valor, dentro. A **`const`** é a caixa lacrada: o valor não troca mais, como o CPF. O **`let`** é a caixa que deixa trocar o conteúdo, como o saldo do cartão.

```javascript
const pessoas = 4;
let gorjeta = 10;

gorjeta = 15;   // o let deixa trocar
pessoas = 5;    // TypeError: Assignment to constant variable.
```

- O `=` **guarda**: primeiro calcula o lado direito, depois põe o resultado na caixa da esquerda. A pergunta "é igual?" é o `===`
- Guardar outro valor numa caixa que já existe é **reatribuir**. Na `const`, dá `TypeError`
- Comece sempre com `const`. Use `let` só quando o valor precisa trocar

---

## :icon[tag] const e let na prática

**Caso 1: o `let` que vai somando.** A conta da mesa cresce a cada pedido:

```javascript
let total = 0;
total = total + 72.9;   // chegou a marguerita
total = total + 68.9;   // chegou a calabresa
console.log(total);     // 141.8
```

`total = total + 72.9` diz: "pegue o que está na caixa, some 72.9 e guarde de volta".

**Caso 2: no Racha-conta, tudo é `const`.** Cada valor é calculado uma vez. Para o subtotal em centavos, nasce uma caixa nova, com outro nome: `subtotalCentavos`. O nome junta as palavras, e cada uma, a partir da segunda, começa com maiúscula: é o **camelCase**.

**Caso 3: duas caixas com o mesmo nome** dão erro: `SyntaxError: Identifier 'conta' has already been declared`.

---

## Operadores

Que teclas da calculadora você usa para dividir a conta do restaurante?

---

## :icon[calculator] Operadores: as teclas da calculadora

Um **operador** é o sinal que faz uma conta, como as teclas da calculadora:

| Operador | Faz | Na conta do restaurante | Dá |
|---|---|---|---|
| `+` | soma | `72.9 + 68.9` | `141.8` |
| `-` | subtrai | `206.25 - 187.5` | `18.75` |
| `*` | multiplica | `14.5 * 2` | `29` |
| `/` | divide | `206.25 / 4` | `51.5625` |

- Como na escola, `*` e `/` vêm antes de `+` e `-`
- Sinais do mesmo grupo, lado a lado, vão da esquerda para a direita: `187.5 * 10 / 100` multiplica e depois divide
- Os **parênteses** mudam a ordem: o que está dentro deles é feito primeiro

---

## :icon[calculator] Operadores na prática

A conta da Cantina, no REPL:

```plaintext
> 187.5 * 10 / 100
18.75
> 187.5 + 18.75
206.25
> 187.5 + 18.75 / 4
192.1875
> (187.5 + 18.75) / 4
51.5625
```

- A primeira é a gorjeta: 10% de 187.5, isto é, 187.5 vezes 10, dividido por 100
- A terceira está errada: a divisão veio antes da soma, e só a gorjeta foi dividida
- Com os parênteses, a soma vem primeiro, e o total é dividido pelas 4 pessoas

O `51.5625` é o mesmo da calculadora do E04. Ninguém paga 51,5625: falta arredondar ao centavo, e do jeito certo.

---

## O problema do 0.1 + 0.2

Dá para escrever 1 dividido por 3 com todas as casas decimais?

---

## :icon[binary] Por que 0.1 + 0.2 não dá 0.3

Escreva 1 dividido por 3 em decimal: 0,333... e nunca acaba. Em algum momento você para, com um valor muito perto, mas não exato.

O computador tem o mesmo problema com números como 0,1. Ele guarda tudo em **binário**, só com zeros e uns, e em binário 0,1 nunca acaba. Ele guarda um valor muito perto, com uma sobra minúscula:

```plaintext
> 0.1 + 0.2
0.30000000000000004
> 0.1 + 0.2 === 0.3
false
```

Para medir farinha, a sobra não faz diferença. Com dinheiro, ela vira centavo a mais ou a menos, e comparação que dá `false`.

---

## :icon[binary] O 0.1 + 0.2 na prática

A sobra aparece com os preços da Cantina:

```plaintext
> 68.9 * 3
206.70000000000002
> 16.7 * 3
50.099999999999994
> 33.3 * 15 / 100
4.994999999999999
> (33.3 * 15 / 100).toFixed(2)
'4.99'
```

- Três pizzas calabresa não custam 206,70000000000002
- A última é a pior. 15% de gorjeta sobre R$ 33,30 é R$ 4,995, que arredonda para **R$ 5,00**. O JavaScript achou um valor um pouco abaixo, e o `toFixed(2)` mostrou **R$ 4,99**

Quem decidiu o centavo foi o binário, não a regra da gorjeta.

---

## Centavos inteiros

Como o caixa da padaria conta o troco sem errar nenhum centavo?

---

## :icon[coins] Dinheiro em centavos inteiros

O caixa conta o troco em moedas, e moeda não se parte. Faça igual: conte o dinheiro em **centavos inteiros**. R$ 187,50 vira 18750. Inteiro não tem sobra: 18750 é 18750, exato.

Para converter, multiplique por 100 e arredonde com **`Math.round`**:

```javascript
const subtotalCentavos = Math.round(187.5 * 100);   // 18750
```

- A **`Math`** reúne as ferramentas de matemática que já vêm no JavaScript. Cada uma se chama com um ponto, como o `pc.bold` do E04
- **`Math.round`** (em inglês, "arredondar") leva ao inteiro mais perto; o meio, `.5`, sobe
- Converta **uma vez**, na entrada, e faça as contas em centavos. Para mostrar, volte a reais: `centavos / 100`, com o `toFixed(2)`

---

## :icon[coins] Centavos e Math.round na prática

**Caso 1: a sobra do binário some.** Um preço vezes 100 pode virar quase um inteiro. O `Math.round` acerta:

```plaintext
> 33.3 * 100
3329.9999999999995
> Math.round(33.3 * 100)
3330
```

**Caso 2: a gorjeta de 15% sobre R$ 33,30, agora certa.** Em centavos, a conta dá exatamente o meio centavo, e o meio sobe:

```plaintext
> 3330 * 15 / 100
499.5
> Math.round(3330 * 15 / 100)
500
```

500 centavos são R$ 5,00, o valor certo. Em reais, o JavaScript tinha mostrado R$ 4,99.

---

## :icon[milestone] Projeto 1 · Passo 1: o problema do 0.1 + 0.2

No terminal do VS Code, abra o REPL com `node` e digite uma linha de cada vez:

```plaintext
> 0.1 + 0.2
0.30000000000000004
> 0.1 + 0.2 === 0.3
false
> 33.3 * 15 / 100
4.994999999999999
> 72.9 * 100
7290.000000000001
> Math.round(72.9 * 100)
7290
```

15% de R$ 33,30 é R$ 4,995, que arredonda para R$ 5,00; o JavaScript acha `4.994999999999999` e arredondaria para R$ 4,99. Em centavos, inteiros, a conta é exata: converta **uma vez**, na entrada, com `Math.round(reais * 100)`.

**Pronto quando:** as cinco respostas aparecem iguais na sua tela. Saia do REPL com `.exit`.

---

## :icon[milestone] Projeto 1 · Passo 2: subtotal, gorjeta e total em centavos

No `racha.js`, logo depois da linha do `caros`:

```javascript
const subtotalCentavos = Math.round(subtotal * 100);
const gorjetaCentavos = Math.round(subtotalCentavos * conta.gorjeta / 100);
const totalCentavos = subtotalCentavos + gorjetaCentavos;
```

| Linha | A conta | O valor |
|---|---|---|
| `subtotalCentavos` | `Math.round(187.5 * 100)` | `18750` |
| `gorjetaCentavos` | `Math.round(18750 * 10 / 100)` | `1875` |
| `totalCentavos` | `18750 + 1875` | `20625` |

`conta.gorjeta` é o `10` do `conta.json`: o percentual. A conta da gorjeta multiplica e divide da esquerda para a direita, e o `Math.round` arredonda ao centavo.

**Pronto quando:** `npm run racha` roda sem erro, com a mesma saída de antes. As linhas que mostram os três valores chegam com a template string.

---

## Template string

Você já mandou uma mensagem pronta em que só faltava trocar o nome?

---

## :icon[message-square] Template string: o texto com lacunas

Uma **template string** (modelo de texto) é um texto entre **crases**, com lacunas para encaixar valores, como a mensagem pronta em que só falta o nome. Cada lacuna é um `${ }`: o JavaScript faz a conta que está dentro e põe o resultado no texto.

```javascript
const restaurante = 'Cantina Bella Nonna';
const pessoas = 4;

console.log('Mesa de', pessoas, 'na', restaurante);
console.log(`Mesa de ${pessoas} na ${restaurante}`);
// as duas mostram: Mesa de 4 na Cantina Bella Nonna
```

- No teclado ABNT2, a crase é <kbd>Shift</kbd> + a tecla do acento agudo, e depois espaço
- Com aspas simples, o `${ }` não funciona: sai escrito do jeito que está
- O resultado é uma `string`, como qualquer texto

---

## :icon[message-square] Template string na prática

**Caso 1: uma conta dentro da lacuna.**

```javascript
console.log(`2 refrigerantes: R$ ${14.5 * 2}`);   // 2 refrigerantes: R$ 29
```

**Caso 2: centavos de volta para reais, com 2 casas.** Os parênteses fazem a divisão primeiro; o `toFixed(2)` vale para o resultado:

```javascript
const subtotalCentavos = 18750;
console.log(`Subtotal: R$ ${(subtotalCentavos / 100).toFixed(2)}`);   // Subtotal: R$ 187.50
```

**Caso 3: texto logo depois da lacuna.** O `%` fora do `${ }` é só o sinal de por cento, texto comum:

```javascript
const gorjeta = 10;
console.log(`Gorjeta de ${gorjeta}%`);   // Gorjeta de 10%
```

---

## :icon[milestone] Projeto 1 · Passo 3: as linhas com template string

Apague a linha `console.log('Subtotal: R$', subtotal.toFixed(2));`. No fim do arquivo, depois de `Itens acima de R$ 50`, três linhas novas:

```javascript
console.log(`Subtotal: R$ ${(subtotalCentavos / 100).toFixed(2)}`);
console.log(`Gorjeta (${conta.gorjeta}%): R$ ${(gorjetaCentavos / 100).toFixed(2)}`);
console.log(`Total: R$ ${(totalCentavos / 100).toFixed(2)}`);
```

| Parte | O que quer dizer |
|---|---|
| a crase no começo e no fim | um texto com lacunas para encaixar valores: template string |
| `${conta.gorjeta}` | "encaixe aqui o valor de `conta.gorjeta`": `10` |
| `(gorjetaCentavos / 100).toFixed(2)` | de centavos para reais, com 2 casas: `18.75` |

**Pronto quando:** depois da tabela dos itens, `npm run racha` mostra:

```plaintext
Unidades pedidas: 5
Itens acima de R$ 50: 2
Subtotal: R$ 187.50
Gorjeta (10%): R$ 18.75
Total: R$ 206.25
```

---

## O resto da divisão

Como dividir 10 balas entre 3 crianças sem partir nenhuma?

---

## :icon[percent] Resto e Math.floor: dividir sem partir

Dez balas para três crianças: cada uma ganha 3, e sobra 1, inteira. Na conta armada da escola, 10 dividido por 3 dá 3, e o **resto** é 1.

| Conta | Dá | O que diz |
|---|---|---|
| `10 / 3` | `3.3333333333333335` | a divisão, com casas decimais |
| `Math.floor(10 / 3)` | `3` | quantas balas cada criança ganha |
| `10 % 3` | `1` | quantas balas sobram |

- **`Math.floor`** (em inglês, "chão") corta as casas depois do ponto: arredonda sempre para baixo
- **`%`** é o operador do **resto** da divisão em partes inteiras. Aqui, ele não é porcentagem
- Para conferir: 3 vezes 3, mais 1 que sobra, dá 10

---

## :icon[percent] Resto e Math.floor na prática

Uma conta de R$ 100,00 para 3 pessoas, em centavos:

```plaintext
> 10000 / 3
3333.3333333333335
> Math.floor(10000 / 3)
3333
> 10000 % 3
1
```

Cada pessoa paga 3333 centavos, R$ 33,33, e sobra 1 centavo. Mais contas, conferidas:

| Total, em centavos | Pessoas | `Math.floor` da divisão | Resto, com `%` | Confere |
|---|---|---|---|---|
| 10000 | 3 | 3333 | 1 | 3 × 3333 + 1 = 10000 |
| 9000 | 3 | 3000 | 0 | 3 × 3000 + 0 = 9000 |
| 11000 | 3 | 3666 | 2 | 3 × 3666 + 2 = 11000 |

Resto 0 quer dizer que a conta dividiu certinho, sem sobra.

---

## :icon[milestone] Projeto 1 · Sua vez: por pessoa e os centavos que sobram

Agora, sozinho. A conta é de 4 pessoas, `conta.pessoas`. Acrescente duas linhas no fim da saída: quanto cada pessoa paga, sem os centavos que sobram, e quantos centavos sobram da divisão:

```plaintext
Por pessoa: R$ 51.56
Centavos que sobram: 1
```

:::tip Dicas
- Faça as contas em centavos, como o total. Mostre o valor em reais como nas outras linhas
- `Math.floor` corta as casas depois do ponto: `Math.floor(5156.25)` dá `5156`
- `%` dá o resto da divisão inteira: `7 % 2` dá `1`
:::

**Pronto quando:** `npm run racha` termina com `Por pessoa: R$ 51.56` e `Centavos que sobram: 1`. O centavo que sobra ganha dono no E11.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `is not defined` | nome escrito errado | copiar o nome do `const` |
| `${...}` escrito na tela | aspas no lugar da crase | trocar por crases |
| `missing ) after argument list` ou `Unexpected end of input` | faltou uma crase | conferir as duas crases |
| `R$ NaN` | campo errado: `conta.gorgeta` | usar o nome do `conta.json` |
| `R$ 18750.00` | faltou dividir por 100 | `(centavos / 100).toFixed(2)` |
| `Assignment to constant variable` | trocou o valor de uma `const` | uma constante nova |

**`NaN`** (*not a number*) quer dizer "não é um número": a conta usou um `undefined`.

---

## :icon[milestone] Projeto 1 · Etapa 3 pronta

`npm run racha` termina com:

```plaintext
Unidades pedidas: 5
Itens acima de R$ 50: 2
Subtotal: R$ 187.50
Gorjeta (10%): R$ 18.75
Total: R$ 206.25
Por pessoa: R$ 51.56
Centavos que sobram: 1
```

- O `racha.js` tem `subtotalCentavos`, `gorjetaCentavos`, `totalCentavos`, `porPessoa` e `sobra`, todos com `const`
- A linha antiga do subtotal, a que usava vírgula no `console.log`, saiu

A foto da etapa vai para o GitHub:

```bash
git add .
git commit -m "Projeto 1: etapa 3, centavos, gorjeta e total"
git push
```

Faltou a Sua vez? Termine em casa, antes do E07, e faça o commit do mesmo jeito.

---

## Resumo

:::summary
- Todo valor tem um tipo: `number`, `string` ou `boolean`; o `typeof` diz qual
- `const` é a caixa lacrada, e `let`, a que deixa trocar. Comece com `const`
- `+`, `-`, `*` e `/` fazem as contas; `*` e `/` vêm antes, e os parênteses mudam a ordem
- Decimais não são exatos no computador: `0.1 + 0.2` dá `0.30000000000000004`
- Dinheiro se conta em centavos inteiros: `Math.round(reais * 100)` na entrada, reais só para mostrar
- `Math.floor` arredonda para baixo, e `%` dá o resto: a divisão sem partir o centavo
- A template string encaixa valores no texto com `${ }`, entre crases
:::

---

## :icon[arrow-right] Próximos passos

No E07, as contas de hoje viram **funções**, receitas com nome, guardadas em `src/regras/conta.js`:

- :icon[coins] `paraCentavos`, o `Math.round(reais * 100)` de hoje, com nome
- :icon[calculator] `calcularGorjeta`, a gorjeta em centavos
- :icon[message-square] `formatarReais`, a template string que mostra `R$ 187.50`

A saída do `npm run racha` continua a mesma: o que muda é a organização do código.
