---
title: Operadores e dinheiro sem perder centavo
summary: Operadores, comparação, curto-circuito, ternário e Math nas regras de preço, com a conta em centavos inteiros.
module: linguagem-js
duration_minutes: 40
objectives:
  - Usar operadores aritméticos, de comparação e lógicos nas regras da Lojinha
  - Prever o resultado do curto-circuito com && e || e escolher um valor com o ternário
  - Calcular desconto e parcelas em centavos inteiros, sem perder centavo
  - Testar regras de dinheiro com Jest
---

# Operadores e dinheiro sem perder centavo

Programador Mobile · Encontro E05 · Aula 10 de 89

---

## O que você vai aprender

:::goal
- Fazer as contas com os operadores aritméticos e o resto `%`
- Comparar com `===` e combinar condições com `&&`, `||` e `!`
- Escolher valores com o curto-circuito e o ternário, e arredondar com `Math`
- Calcular desconto, Pix e parcelas em centavos inteiros, com testes
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **operador** | o sinal que faz uma conta ou uma pergunta: `+`, `*`, `===` |
| **`boolean`** | o tipo do sim ou não: `true` ou `false` |
| **valor padrão** | o "de sempre": o valor usado quando o outro falta |
| **ternário** | o operador que faz uma pergunta e escolhe entre dois valores |
| **ponto flutuante** | o jeito como o computador guarda números com vírgula, às vezes com uma sobra minúscula |
| **centavos inteiros** | o preço sem vírgula: R$ 199,90 vira 19990 |

---

## Onde foi parar o centavo?

O anúncio da Lojinha diz **ou 3x de R$ 66,63** para o Fone Bluetooth de R$ 199,90. Faça a conta: 3 × 66,63 = 199,89. Falta um centavo.

No Pix, 5% de desconto dá R$ 189,905. O anúncio mostra R$ 189,91 ou R$ 189,90? Depende de quem arredondou, e de como.

Numa loja, centavo sumindo vira reclamação, estorno e teste vermelho no CI.

:::question
Como dividir R$ 199,90 em 3 parcelas sem sumir nem sobrar centavo?
:::

---

## Operadores

Que teclas da calculadora você usa para dividir a conta do restaurante?

---

## :icon[calculator] Operadores aritméticos

Um **operador** é o sinal que faz uma conta, como as teclas da calculadora. Os **aritméticos** fazem as contas da escola:

| Operador | Na Lojinha | O que faz |
|---|---|---|
| `+` | `subtotal + frete` | soma |
| `-` | `preco - desconto` | subtrai |
| `*` | `preco * qtd` | multiplica |
| `/` | `total / parcelas` | divide, com decimais: `7 / 2` é `3.5` |
| `%` | `centavos % parcelas` | resto da divisão: `19990 % 3` é `1` |
| `**` | `2 ** 3` | potência: `8` |

O **resto** é o que sobra na conta armada: 7 dividido por 2 dá 3, e sobra 1.

---

## :icon[calculator] Operadores na prática

Contas de verdade da Lojinha:

```javascript
const preco = 199.9;
const frete = 15;
console.log(preco * 2 + frete); // 414.8: dois fones e o frete
console.log(19990 % 3);         // 1: o centavo que sobra em 3 parcelas
console.log(12 / 5);            // 2.4: 12 produtos, 5 por página

let qtd = 1;
qtd++;
console.log(qtd);               // 2: mais um no carrinho
```

- Como na escola, `*`, `/` e `%` vêm antes de `+` e `-`: a primeira conta multiplica e só depois soma o frete. Na dúvida, use parênteses: `2 + 3 * 4` é `14`, e `(2 + 3) * 4` é `20`
- Para acumular num `let`, `total += preco` é o mesmo que `total = total + preco`
- `qtd++` soma 1 ao valor de `qtd`

---

## Comparação

Que pergunta de sim ou não a loja faz antes de dar frete grátis?

---

## :icon[scale] Comparar: perguntas de sim ou não

Uma **comparação** é uma pergunta de sim ou não sobre dois valores: "o subtotal chegou a 150?". A resposta é um **`boolean`**: `true` (sim) ou `false` (não).

| Operador | Pergunta | Exemplo | Resposta |
|---|---|---|---|
| `===` | é igual a? | `3 === 3` | `true` |
| `!==` | é diferente de? | `'audio' !== 'livros'` | `true` |
| `>` e `<` | é maior? é menor? | `199.9 > 200` | `false` |
| `>=` e `<=` | é maior ou igual? é menor ou igual? | `150 >= 150` | `true` |

Uma comparação também é um valor: dá para guardar a resposta numa `const`, como `const freteGratis = subtotal >= 150`.

---

## :icon[equal] Comparação: sempre ===

Para "é igual?", use **`===`** e, para "é diferente?", **`!==`**: eles comparam valor **e** tipo, sem coerção.

```javascript
'7' === 7;                   // false: texto e número
'7' == 7;                    // true: o == converte antes
0 == '';                     // true: outra surpresa do ==
subtotal >= 150;             // frete grátis?
fone.categoria !== 'livros'; // true para o fone
```

O `==`, com dois sinais de igual, converte os tipos antes de comparar e cria igualdades estranhas. Com `===`, `process.argv[2] === 2` dá `false` e denuncia o texto que veio do terminal. A correção não é trocar por `==`, e sim converter: `Number(process.argv[2]) === 2`.

---

## Operadores lógicos

Para entrar no show, só o ingresso resolve, ou precisa do documento também?

---

## :icon[split] Operadores lógicos

Eles juntam duas condições numa só, como se diz em português. Uma **condição** é uma pergunta que dá `true` ou `false`.

- **`&&`** é o "e": precisa das duas. Entra no show quem tem ingresso **e** documento
- **`||`** é o "ou": uma das duas já serve. Paga meia quem é estudante **ou** professor
- **`!`** é o "não": inverte o sim e o não

```javascript
const quantidadeValida = qtd >= 1 && qtd <= 10;
const freteGratis = subtotal >= 150 || cupom === 'FRETEGRATIS';
const precisaDeAviso = !quantidadeValida;
```

| Expressão | Resultado |
|---|---|
| `true && false` | `false` |
| `false && true` | `false` |
| `!quantidadeValida` com `quantidadeValida = true` | `false` |

Dê nome às condições: a primeira linha se lê "a quantidade é válida se for pelo menos 1 **e** no máximo 10".

---

## :icon[split] Operadores lógicos na prática

As mesmas regras, com valores de verdade e a resposta de cada uma:

```javascript
const subtotal = 120;
const cupom = 'FRETEGRATIS';
let qtd = 5;
console.log(qtd >= 1 && qtd <= 10); // true: 5 está entre 1 e 10
qtd = 50;
console.log(qtd >= 1 && qtd <= 10); // false: 50 passou de 10

console.log(subtotal >= 150 || cupom === 'FRETEGRATIS'); // true
console.log(!(subtotal >= 150));                         // true
```

- Com `&&`, se uma parte falha, tudo falha: `50 <= 10` é `false`, e a quantidade deixa de ser válida
- Com `||`, uma parte que vale já resolve: o subtotal não chegou a 150, mas o cupom salva o frete grátis
- O `!` inverte: "o subtotal **não** chegou a 150" é `true`

---

## :icon[zap] Curto-circuito: || e o valor padrão

`&&` e `||` param assim que sabem a resposta: é o **curto-circuito**. E devolvem **um dos valores**, não necessariamente `true` ou `false`:

```javascript
'Ana' || 'Visitante'; // 'Ana'
'' || 'Visitante';    // 'Visitante': texto vazio conta como falso
true && 'ok';         // 'ok'
0 && 'ok';            // 0
```

- Contam como falso: `false`, `0`, `''`, `null`, `undefined` e `NaN`. Todo o resto conta como verdadeiro
- `||` devolve o primeiro valor verdadeiro e serve de **valor padrão**, o "de sempre": `process.argv[3] || 'Visitante'` se lê "o nome do comando ou, se ele faltar, `'Visitante'`"
- Cuidado: `qtd || 1` troca o `0` por `1`. No E13 você conhece o `??`, que só troca `null` e `undefined`

---

## Ternário

Como o app sabe se escreve "1 item" ou "2 itens"?

---

## :icon[arrow-left-right] Ternário: um valor ou outro

O **operador ternário** faz uma pergunta e escolhe entre duas respostas prontas: `condição ? seVerdadeiro : seFalso`. É o único operador com três partes, e daí vem o nome.

```javascript
const rotulo = qtd === 1 ? 'item' : 'itens';
const frete = subtotal >= 150 ? 0 : 15;
```

| Linha | O que ela diz |
|---|---|
| `qtd === 1 ? 'item' : 'itens'` | "a quantidade é 1? Então `'item'`; senão, `'itens'`" |
| `subtotal >= 150 ? 0 : 15` | "o subtotal chegou a 150? Então frete 0; senão, 15" |

O ternário **produz um valor**: cabe num `const`, num `return` e numa template string. Serve para dois resultados e uma condição curta. Para executar passos diferentes, o `if`, no E07.

---

## :icon[arrow-left-right] O ternário no resumoDaCompra

Com o ternário, o `resumoDaCompra` da aula 9 troca o "R$ NaN" por um aviso:

```javascript
export function resumoDaCompra(textoQtd, preco) {
  const qtd = parseInt(textoQtd, 10);
  return Number.isNaN(qtd)
    ? 'Digite a quantidade em números'
    : `${qtd} x ${formatarPreco(preco)} = ${formatarPreco(qtd * preco)}`;
}
```

- A pergunta é `Number.isNaN(qtd)`: "a conversão falhou?"
- Depois do `?`, a resposta para o sim: o aviso `'Digite a quantidade em números'`
- Depois do `:`, a resposta para o não: a conta, como `'2 x R$ 199,90 = R$ 399,80'`
- O `return` entrega o valor que o ternário escolheu. As três linhas são um ternário só, quebrado para ficar fácil de ler

---

## Pense

:::question
Escreva, com nome, três valores de um script de compra:

1. `quantidadeValida`: `qtd` entre 1 e 10, inclusive
2. `nomeExibido`: o nome que veio em `process.argv[3]` ou, se faltar, `'Visitante'`
3. `rotuloDoFrete`: `'Frete grátis'` quando o `subtotal` é 150 ou mais; senão, `'Frete: R$ 15,00'`
:::

:::tip Resposta
```javascript
const quantidadeValida = qtd >= 1 && qtd <= 10;
const nomeExibido = process.argv[3] || 'Visitante';
const rotuloDoFrete = subtotal >= 150 ? 'Frete grátis' : 'Frete: R$ 15,00';
```

`1 <= qtd <= 10` parece certo, mas não funciona: o JavaScript calcula `1 <= qtd`, que vira `true` ou `false`, e compara esse booleano com `10`. Com `qtd = 50`, o resultado é `true`.
:::

---

## Math

Quantas páginas são precisas para mostrar 12 produtos, 5 por página?

---

## :icon[sigma] Math: arredondar e limitar

**`Math`** é a caixa de ferramentas de matemática que já vem no JavaScript. Cada ferramenta se chama com um ponto: `Math.round(...)`.

| Chamada | Resultado | Uso na Lojinha |
|---|---|---|
| `Math.round(999.5)` | `1000` | arredondar ao centavo |
| `Math.floor(6663.33)` | `6663` | parcela que cabe no total |
| `Math.ceil(12 / 5)` | `3` | páginas para 12 produtos, 5 por página |
| `Math.min(qtd, 10)` | o menor | no máximo 10 por pedido |
| `Math.max(0, valor)` | o maior | nunca negativo |

`Math.floor` (em inglês, "chão") arredonda sempre para baixo, `Math.ceil` ("teto") sempre para cima e `Math.round` ("arredondar") para o mais próximo, com o meio (`.5`) subindo.

---

## :icon[sliders-horizontal] Prender um valor entre dois limites

Um desconto de 150% deixaria o preço negativo. Para prender um valor entre dois limites, combine `Math.min` e `Math.max`:

```javascript
const percentual = Math.min(Math.max(entrada, 0), 100); // entre 0 e 100
```

Leia de dentro para fora:

| Parte | O que ela diz | Com `entrada` 150 | Com `entrada` -10 |
|---|---|---|---|
| `Math.max(entrada, 0)` | "o maior entre a entrada e 0": nunca abaixo de 0 | `150` | `0` |
| `Math.min(..., 100)` | "o menor entre isso e 100": nunca acima de 100 | `100` | `0` |

O `calcularDesconto` do laboratório começa com esta linha.

---

## Ponto flutuante

Dá para escrever 1 dividido por 3 com todas as casas decimais?

---

## :icon[coins] Dinheiro em ponto flutuante

**Ponto flutuante** é o jeito como o `number` guarda números com vírgula. Ele guarda os decimais em binário, a linguagem de zeros e uns do computador.

Frações como 0,1 não têm representação exata em binário, assim como 1/3 não tem em decimal: 0,333..., e nunca acaba. O computador guarda um valor muito perto, com uma sobra minúscula.

Por isso `0.1 + 0.2` não dá `0.3`: dá `0.30000000000000004`. O erro é minúsculo, mas aparece em comparações, em testes e no arredondamento. Com dinheiro, vira centavo a mais ou a menos.

---

## :icon[coins] Ponto flutuante na prática

Abra o REPL do Node e some produtos da Lojinha:

```javascript
0.1 + 0.2;          // 0.30000000000000004
79.9 * 3;           // 239.70000000000002: três garrafas térmicas
69.9 + 59.9 + 74.9; // 204.70000000000002: três livros
0.1 + 0.2 === 0.3;  // false
```

Três garrafas térmicas não deveriam custar 239,70000000000002, e a sobra aparece em qualquer soma de preços.

Na conta exata, `199.9 * 0.95` e `59.9 * 0.95` terminam em ,905. Com o `formatarPreco`, um vira R$ 189,91 e o outro R$ 56,90: quem decidiu foi o binário, não a regra da loja.

---

## Centavos inteiros

Como o caixa da padaria conta o troco sem errar nenhum centavo?

---

## :icon[banknote] A solução: centavos inteiros

Inteiros são exatos no `number`: 19990 é 19990, sem sobra. É como o caixa da padaria, que conta o troco em moedas: moeda não se parte. Converta o preço em **centavos**, faça a conta com inteiros e volte para reais só no fim:

```javascript
export function paraCentavos(reais) {
  return Math.round(reais * 100); // 199.9 vira 19990
}

export function paraReais(centavos) {
  return centavos / 100; // 18990 vira 189.9
}
```

- `paraCentavos` diz: "multiplique por 100 e arredonde"
- `paraReais` diz: "divida por 100"

O `Math.round` na entrada é obrigatório: `(0.1 + 0.2) * 100` dá `30.000000000000004`, e ele devolve o inteiro `30`.

---

## :icon[banknote] Reais por fora, centavos por dentro

:::center
![Diagrama: a regra recebe 199.9 em reais, paraCentavos converte para 19990, a conta com inteiros chega a 18990, paraReais devolve 189.9 e só na saída o formatarPreco mostra R$ 189,90](images/e05-centavos-por-dentro.svg)
:::

- As regras de `src/regras/precos.js` recebem e devolvem **reais**, como o catálogo; **por dentro**, a conta é em centavos
- Quem formata é o `formatarPreco`, só na saída: no `console.log` do script hoje e na tela do app no E30
- O exemplo é o Pix do Fone: R$ 199,90 entra e R$ 189,90 sai

---

## :icon[percent] Desconto e Pix sem perder centavo

```javascript
export const PERCENTUAL_PIX = 5;

export function calcularDesconto(preco, percentual) {
  const limitado = Math.min(Math.max(percentual, 0), 100);
  const desconto = Math.round((paraCentavos(preco) * limitado) / 100);
  return paraReais(desconto);
}

export function precoComPix(preco) {
  const desconto = calcularDesconto(preco, PERCENTUAL_PIX);
  return paraReais(paraCentavos(preco) - paraCentavos(desconto));
}
```

`calcularDesconto` devolve o **valor** do desconto. 5% de 19990 centavos são 999,5: o `Math.round` leva o desconto a 1000, e o Pix fica em 18990, **R$ 189,90**. Uma função chama outra: `precoComPix` usa `calcularDesconto`, que usa `paraCentavos`.

A regra é da loja, e não do acaso: o desconto é arredondado uma vez, ao centavo, e o meio centavo fica sempre com o cliente.

---

## :icon[list-ordered] O desconto em português

| Linha | O que ela diz |
|---|---|
| `PERCENTUAL_PIX = 5` | "o Pix dá 5%". Nome todo em maiúsculas: um valor fixo da loja |
| `Math.min(Math.max(percentual, 0), 100)` | "prenda o percentual entre 0 e 100" |
| `paraCentavos(preco) * limitado / 100` | "a porcentagem do preço, em centavos" |
| `Math.round(...)` | "arredonde o desconto ao centavo, uma vez só" |
| `paraReais(desconto)` | "devolva o desconto em reais" |
| `paraCentavos(preco) - paraCentavos(desconto)` | "o preço menos o desconto, em centavos" |

---

## Parcelas

Como dividir 10 balas entre 3 crianças sem jogar nenhuma fora?

---

## :icon[credit-card] Parcelar sem sumir centavo

Pense em 10 balas para 3 crianças: cada uma ganha 3, e sobra 1, que vai para a primeira. Com centavos, a conta é a mesma:

```javascript
export const PARCELAS_NA_VITRINE = 3; // o "3x" do anúncio

export function parcelar(total, parcelas) {
  const centavos = paraCentavos(total);          // 19990
  const valor = Math.floor(centavos / parcelas); // 6663
  const resto = centavos % parcelas;             // 1
  return {
    parcelas: parcelas,
    valor: paraReais(valor),
    primeira: paraReais(valor + resto),
  };
}
```

`Math.floor` acha a parcela que cabe em todas; o `%` acha o que sobrou; a **primeira parcela** leva a sobra. A função devolve um objeto, uma ficha com três campos, e o anúncio mostra o valor das demais: **ou 3x de R$ 66,63**.

| Total | `valor` | `primeira` | Soma |
|---|---|---|---|
| R$ 199,90 | R$ 66,63 | R$ 66,64 | R$ 199,90 |
| R$ 89,90 | R$ 29,96 | R$ 29,98 | R$ 89,90 |

---

## :icon[credit-card] O centavo que sobra vai na primeira

:::center
![Animação: 19990 centavos divididos por 3 dão 6663 em cada parcela; o resto, 1 centavo, vai para a primeira parcela, e R$ 66,64 + R$ 66,63 + R$ 66,63 fecha os R$ 199,90](images/e05-parcelar.svg)
:::

`Math.floor(19990 / 3)` dá 6663 centavos para cada parcela, e `19990 % 3` deixa 1 de sobra. A primeira fica com 6664: 6664 + 6663 + 6663 = 19990, e nenhum centavo some.

---

## :icon[test-tube] Testando regras de dinheiro

Com centavos, o resultado é exato e o `toBe` do E04 funciona. Teste também a promessa da regra: a soma das parcelas fecha o total.

```javascript
import { paraCentavos, parcelar, precoComPix } from './precos.js';

test('R$ 199,90 vira R$ 189,90 no Pix', () => {
  expect(precoComPix(199.9)).toBe(189.9);
});

test('a soma das parcelas fecha o total', () => {
  const p = parcelar(349.9, 3);
  const soma = paraCentavos(p.primeira) + paraCentavos(p.valor) * 2;
  expect(soma).toBe(34990);
});
```

A soma está em centavos de propósito: em reais, `66.64 + 66.63 * 2` dá `199.89999999999998`. Para comparar decimais que você mesmo calculou com `number`, use `toBeCloseTo` (em inglês, "perto de"), que aceita a diferença minúscula.

---

## :icon[siren] Quando aparece um erro

Nas regras de dinheiro, o erro quase sempre aparece no teste. Leia o **Expected** (o que você pediu) e o **Received** (o que veio):

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Received: 199.89999999999998` | a conta foi feita em reais, com decimais | some em centavos, ou compare com `toBeCloseTo` |
| `Received: 66.63333333333334` | a divisão foi feita em reais | converta para centavos e use `Math.floor` |
| `Expected: 189.9`, `Received: 189.91` | arredondou o preço final, não o desconto | arredonde o desconto em centavos e subtraia |
| `R$ NaN` | um valor da conta não é número | `typeof` no valor; confira o nome do campo |

---

## :icon[triangle-alert] Erros comuns

:::warning
- Usar `==`: `'7' == 7` é `true` e esconde o bug do tipo
- `qtd || 1` quando `0` é um valor válido
- Escrever `1 <= qtd <= 10` em vez de `qtd >= 1 && qtd <= 10`
- Calcular em reais e arredondar com `toFixed`, que devolve texto e arredonda pelo binário
- Esquecer o `Math.round` em `reais * 100`
- Arredondar cada parcela com `Math.round`: 3 × 66,63 perde um centavo
- Comparar decimais calculados com `toBe` nos testes
:::

---

## Resumo

:::summary
- `+`, `-`, `*` e `/` fazem as contas; o `%` dá o resto e, com `Math.floor`, divide sem perder nada
- Compare com `===` e `!==`; o `==` converte tipos e esconde bugs
- `&&` e `||` devolvem um dos valores, e o `||` dá valor padrão; o ternário escolhe entre dois valores
- Decimais em `number` não são exatos: `0.1 + 0.2` não é `0.3`
- Dinheiro se calcula em centavos inteiros: `Math.round(reais * 100)` na entrada, um arredondamento por regra e reais de volta no fim
:::

---

## :icon[flask-conical] No laboratório

As primeiras regras de negócio do `lojinha-regras`, testadas e no terminal.

:::steps
1. Em `src/utils/formatar.js`, `formatarPreco` e `resumoDaCompra` com o ternário; testes em `formatar.test.js`
2. Crie `src/regras/precos.js` com `paraCentavos`, `paraReais`, `PERCENTUAL_PIX` e `PARCELAS_NA_VITRINE`
3. Escreva `calcularDesconto(preco, percentual)`, `precoComPix(preco)` e `parcelar(total, parcelas)`
4. Em `src/regras/precos.test.js`, pelo menos 8 testes, com valores conferidos à mão; `npm test` verde
5. `src/scripts/vitrine.js`, com a posição do produto e a quantidade: `node src/scripts/vitrine.js 0 2` mostra "ou 3x de R$ 66,63" e "R$ 189,90 no Pix"
6. `npm run verificar` sem erros
7. Commit "E05: regras de preço" e `git push`
:::

**Critérios de entrega**: regras sem `console.log` e sem formatação; nenhuma conta de preço no script; teste da soma das parcelas; CI verde. Entregue o link do repositório no sistema.

---

## :icon[milestone] Projeto 1 · Etapa 4: centavos, gorjeta e reais

No seu `racha-conta`:

- `paraCentavos(reais)` e `formatarReais(centavos)`, que devolve `'R$ 187,50'`
- `calcularGorjeta` passa a receber e devolver centavos, arredondada ao centavo: mude os testes primeiro
- um teste para 15% de R$ 33,30, que dá R$ 5,00
- `npm run racha 187.5` mostra o subtotal, a gorjeta e o total

Commit: `Projeto 1: etapa 4, centavos, gorjeta e reais`. Enunciado completo e entrega: página do curso, em **Projetos**.
