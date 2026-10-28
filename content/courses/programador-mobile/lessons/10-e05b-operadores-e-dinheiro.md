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

## Onde foi parar o centavo?

O anúncio da Lojinha diz **ou 3x de R$ 66,63** para o Fone Bluetooth de R$ 199,90. Faça a conta: 3 × 66,63 = 199,89. Falta um centavo.

No Pix, 5% de desconto dá R$ 189,905. O anúncio mostra R$ 189,91 ou R$ 189,90? Depende de quem arredondou, e de como.

Numa loja, centavo sumindo vira reclamação, estorno e teste vermelho no CI.

:::question
Como dividir R$ 199,90 em 3 parcelas sem sumir nem sobrar centavo?
:::

---

## :icon[calculator] Operadores aritméticos

| Operador | Na Lojinha | O que faz |
|---|---|---|
| `+` | `subtotal + frete` | soma |
| `-` | `preco - desconto` | subtrai |
| `*` | `preco * qtd` | multiplica |
| `/` | `total / parcelas` | divide, com decimais: `7 / 2` é `3.5` |
| `%` | `centavos % parcelas` | resto da divisão: `19990 % 3` é `1` |
| `**` | `2 ** 3` | potência: `8` |

`*`, `/` e `%` vêm antes de `+` e `-`: `preco * qtd + frete` multiplica primeiro. Quando a ordem não for óbvia, use parênteses.

Para acumular num `let`, `total += preco` é o mesmo que `total = total + preco`, e `qtd++` soma 1.

---

## :icon[equal] Comparação: sempre ===

Comparações devolvem `true` ou `false`. Use **`===`** e **`!==`**: elas comparam valor **e** tipo, sem coerção.

```javascript
'7' === 7;                   // false: texto e número
'7' == 7;                    // true: o == converte antes
0 == '';                     // true: outra surpresa do ==
subtotal >= 150;             // frete grátis?
fone.categoria !== 'livros'; // true para o fone
```

Também existem `>`, `<`, `>=` e `<=`.

O `==` converte os tipos e cria igualdades estranhas. Com `===`, `process.argv[2] === 2` dá `false` e denuncia o texto que veio do terminal. A correção não é trocar por `==`, e sim converter: `Number(process.argv[2]) === 2`.

---

## :icon[split] Operadores lógicos

Eles combinam condições: **`&&`** (e: precisa das duas), **`||`** (ou: basta uma) e **`!`** (não: inverte).

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

Dê nome às condições, como `quantidadeValida` e `freteGratis`: o código passa a ser lido como uma frase.

---

## :icon[zap] Curto-circuito: || e o valor padrão

`&&` e `||` param assim que sabem a resposta e devolvem **um dos valores**, não necessariamente `true` ou `false`:

```javascript
'Ana' || 'Visitante'; // 'Ana'
'' || 'Visitante';    // 'Visitante': texto vazio conta como falso
true && 'ok';         // 'ok'
0 && 'ok';            // 0
```

- Contam como falso: `false`, `0`, `''`, `null`, `undefined` e `NaN`. Todo o resto conta como verdadeiro
- `||` devolve o primeiro valor verdadeiro e serve de **valor padrão**: `process.argv[3] || 'Visitante'`
- Cuidado: `qtd || 1` troca o `0` por `1`. No E13 você conhece o `??`, que só troca `null` e `undefined`

---

## :icon[arrow-left-right] Ternário: um valor ou outro

O **operador ternário** escolhe entre dois valores: `condição ? seVerdadeiro : seFalso`. É o único operador com três partes.

```javascript
const rotulo = qtd === 1 ? 'item' : 'itens';
const frete = subtotal >= 150 ? 0 : 15;
```

Com ele, o `resumoDaCompra` da aula 9 troca o "R$ NaN" por um aviso:

```javascript
export function resumoDaCompra(textoQtd, preco) {
  const qtd = parseInt(textoQtd, 10);
  return Number.isNaN(qtd)
    ? 'Digite a quantidade em números'
    : `${qtd} x ${formatarPreco(preco)} = ${formatarPreco(qtd * preco)}`;
}
```

O ternário **produz um valor**: cabe num `const`, num `return` e numa template string. Serve para dois resultados e uma condição curta. Para executar passos diferentes, o `if`, no E07.

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

## :icon[sigma] Math: arredondar e limitar

| Chamada | Resultado | Uso na Lojinha |
|---|---|---|
| `Math.round(999.5)` | `1000` | arredondar ao centavo |
| `Math.floor(6663.33)` | `6663` | parcela que cabe no total |
| `Math.ceil(12 / 5)` | `3` | páginas para 12 produtos, 5 por página |
| `Math.min(qtd, 10)` | o menor | no máximo 10 por pedido |
| `Math.max(0, valor)` | o maior | nunca negativo |

`Math.floor` arredonda sempre para baixo, `Math.ceil` sempre para cima e `Math.round` para o mais próximo, com o meio (`.5`) subindo. Para prender um valor entre dois limites, combine os dois últimos:

```javascript
const percentual = Math.min(Math.max(entrada, 0), 100); // entre 0 e 100
```

---

## :icon[coins] Dinheiro em ponto flutuante

Abra o REPL do Node e some produtos da Lojinha:

```javascript
0.1 + 0.2;          // 0.30000000000000004
79.9 * 3;           // 239.70000000000002: três garrafas térmicas
69.9 + 59.9 + 74.9; // 204.70000000000002: três livros
0.1 + 0.2 === 0.3;  // false
```

O `number` guarda decimais em binário, e frações como 0,1 não têm representação exata, assim como 1/3 não tem em decimal: 0,333... O erro é minúsculo, mas aparece em comparações, em testes e no arredondamento.

Na conta exata, `199.9 * 0.95` e `59.9 * 0.95` terminam em ,905. Com o `formatarPreco`, um vira R$ 189,91 e o outro R$ 56,90: quem decidiu foi o binário, não a regra da loja.

---

## :icon[banknote] A solução: centavos inteiros

Inteiros são exatos no `number`. Converta o preço em **centavos**, faça a conta com inteiros e volte para reais só no fim:

```javascript
export function paraCentavos(reais) {
  return Math.round(reais * 100); // 199.9 vira 19990
}

export function paraReais(centavos) {
  return centavos / 100; // 18990 vira 189.9
}
```

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

## :icon[credit-card] Parcelar sem sumir centavo

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

`Math.floor` acha a parcela que cabe em todas; o `%` acha o que sobrou; a **primeira parcela** leva a sobra. A função devolve um objeto com três campos, e o anúncio mostra o valor das demais: **ou 3x de R$ 66,63**.

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

A soma está em centavos de propósito: em reais, `66.64 + 66.63 * 2` dá `199.89999999999998`. Para comparar decimais que você mesmo calculou com `number`, use `toBeCloseTo`.

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
