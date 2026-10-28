---
title: Variáveis e tipos
summary: const, let, tipos primitivos, o texto do terminal convertido em número e as mensagens com template strings.
module: linguagem-js
duration_minutes: 35
objectives:
  - Declarar valores com const e let e explicar por que evitar var
  - Identificar os tipos primitivos com typeof
  - Converter o texto do terminal em número com Number, parseInt e Number.isNaN
  - Montar mensagens com template strings e com a função formatarPreco
---

# Variáveis e tipos

Programador Mobile · Encontro E05 · Aula 9 de 89

---

## O que você vai aprender

:::goal
- Declarar valores com `const` e `let`, e por que deixar o `var` de lado
- Reconhecer os tipos primitivos e perguntar o tipo com `typeof`
- Converter o texto que chega do terminal em número com `Number`, `parseInt` e `Number.isNaN`
- Montar mensagens com template strings e escrever a sua primeira função, `formatarPreco`
:::

---

## 2 + 1 = 21 no terminal

O ambiente está pronto: Node, npm, Git, lint e testes. A partir de hoje, a linguagem. Comece por um script de compra no `lojinha-regras`:

```javascript
// src/scripts/compra.js
import { produtos } from '../data/produtos.js';

const qtd = process.argv[2]; // a quantidade digitada no comando
const fone = produtos[0];    // o primeiro produto: Fone Bluetooth

console.log('Com mais um:', qtd + 1);
console.log('Total:', qtd * fone.preco);
```

```bash
node src/scripts/compra.js 2
# Com mais um: 21
# Total: 399.8
```

Ninguém errou a conta. O comando entregou o texto `'2'`, e texto mais número junta, não soma.

:::question
Por que `qtd + 1` deu `21`, mas `qtd * fone.preco` calculou um valor?
:::

---

## :icon[variable] const: um nome para um valor

Uma **variável** guarda um valor com um nome. No `lojinha-regras`, quase tudo nasce com **`const`**: o nome fica preso àquele valor.

```javascript
const nomeDaLoja = 'Lojinha';
const freteFixo = 15;
const fone = produtos[0];

freteFixo = 20; // TypeError: uma const não pode ser reatribuída
```

- Nomes em português e em camelCase, que dizem o que guardam: `precoComDesconto`, não `pcd`
- Reatribuir uma `const` é erro, e o problema aparece logo, não semanas depois
- `const` prende o nome, não o conteúdo: os campos de um objeto `const`, como `fone.preco`, ainda podem mudar

---

## :icon[pencil] let: quando o valor muda

Use **`let`** quando o mesmo nome precisa receber outro valor mais adiante, como um total que vai somando:

```javascript
let total = 0;
total = total + 199.9; // fone
total = total + 79.9;  // garrafa: total agora é 279.8

let mensagem = 'Seu carrinho está vazio';
mensagem = 'Pronto para finalizar';
```

O `=` não é o "igual" da matemática: ele **atribui**. Primeiro calcula o lado direito, depois guarda o resultado no nome da esquerda. Por isso `total = total + 199.9` faz sentido.

:::tip Regra prática
Comece sempre com `const` e troque por `let` só quando precisar reatribuir. Quem lê sabe que uma `const` não muda no meio do caminho.
:::

---

## :icon[ban] Por que não var

**`var`** é a forma antiga de declarar, de antes do `let` e do `const`. Ela ignora os **blocos**, os trechos entre chaves `{ }`:

```javascript
{
  var desconto = 10;
}
console.log(desconto); // 10: o var vaza do bloco

{
  let descontoCupom = 10;
}
console.log(descontoCupom); // ReferenceError: só existe dentro do bloco
```

- `var` vale na função inteira e pode ser declarada duas vezes sem aviso
- `let` e `const` valem só no bloco onde nasceram: menos surpresa. No E07, os blocos do `if` e do `for` seguem essa regra
- Você ainda vai ver `var` em código antigo e em respostas da internet; em código novo, não use

---

## :icon[shapes] Tipos primitivos

Todo valor tem um **tipo**. Os que mais aparecem nas regras da Lojinha:

| Tipo | Exemplo | Onde aparece |
|---|---|---|
| `string` | `'Fone Bluetooth'`, `'01310-100'` | nomes, CEP, tudo que vem do terminal |
| `number` | `199.9`, `3` | preço, quantidade, avaliação |
| `boolean` | `true`, `false` | `destaque`, tem estoque |
| `undefined` | valor que nunca foi definido | o argumento que faltou no comando |
| `null` | "nada", de propósito | nenhum cupom escolhido |

Inteiro e decimal são o mesmo tipo: `number`. Existem ainda `bigint` e `symbol`, raros no dia a dia.

---

## :icon[search] typeof: pergunte o tipo

**`typeof`** devolve o nome do tipo, como texto:

```javascript
typeof 'Fone Bluetooth'; // 'string'
typeof 199.9;            // 'number'
typeof true;             // 'boolean'
typeof undefined;        // 'undefined'
typeof null;             // 'object': um erro antigo da linguagem
```

É a primeira pergunta quando uma conta dá um resultado estranho. No `compra.js`:

```javascript
console.log(typeof qtd);        // 'string': o '2' do comando
console.log(typeof fone.preco); // 'number': o 199.9 do catálogo
```

---

## :icon[terminal] O terminal sempre entrega texto

O `process.argv` do E02 é a lista das partes do comando. As posições contam a partir de 0: a 0 é o `node`, a 1 é o script, e os seus argumentos começam na **posição 2**.

```javascript
// node src/scripts/compra.js 2 Ana
process.argv[2]; // '2': entre aspas, é texto
process.argv[3]; // 'Ana'
process.argv[4]; // undefined: não veio
```

| De onde vem | Tipo que chega |
|---|---|
| argumento do comando | sempre `string` |
| `src/data/produtos.js` | o tipo escrito no código: `preco: 199.9` é `number` |
| arquivo `.json` lido do disco | `string`, até passar pelo `JSON.parse` |

Guarde o texto do jeito que chegou e converta uma vez, antes da conta. No E30, o campo de texto do app também entrega `string`: a regra é a mesma.

---

## :icon[combine] Coerção: o JavaScript converte sozinho

Quando os tipos não combinam, o JavaScript converte um deles por conta própria. Isso é **coerção**, e o `+` é o operador mais traiçoeiro:

```javascript
'10' + 5;     // '105': com texto de um lado, o + junta
'10' - 5;     // 5: o - converte para número
'2' * 199.9;  // 399.8: o * também converte
'R$ 10' * 2;  // NaN: não deu para converter
```

Com uma string de um lado, o `+` vira **concatenação**: junta os textos. Os outros operadores aritméticos tentam converter para número.

:::center
![Diagrama: process.argv[2] entrega o texto '2'; textoQtd + 1 junta os textos e dá '21', enquanto Number(textoQtd) + 1 soma e dá 3](images/e05-texto-mais-numero.svg)
:::

Não conte com a coerção, nem quando ela acerta por sorte. Converta você mesmo, de forma **explícita**.

---

## Pense

:::question
No `compra.js`, o comando entregou `qtd = '2'` e o código fazia:

```javascript
const novaQtd = qtd + 1;
const subtotal = qtd * 199.9;
```

Por que `novaQtd` deu errado e `subtotal` deu certo? Como corrigir as duas linhas de uma vez só?
:::

:::tip Resposta
`qtd + 1` concatena: `'2' + 1` é `'21'`. Já `qtd * 199.9` converte o texto e dá `399.8`, por sorte. A correção é guardar o texto com um nome que diga isso e converter uma vez, logo depois de ler o argumento:

```javascript
const textoQtd = process.argv[2];
const qtd = Number(textoQtd);
```

Daí em diante, todas as contas recebem um número de verdade.
:::

---

## :icon[binary] Number e parseInt

Duas conversões, com regras diferentes:

| Texto | `Number(texto)` | `parseInt(texto, 10)` |
|---|---|---|
| `'2'` | `2` | `2` |
| `'2.5'` | `2.5` | `2` |
| `'2,5'` | `NaN` | `2` |
| `'3 unidades'` | `NaN` | `3` |
| `''` | `0` | `NaN` |
| `undefined`, o argumento que faltou | `NaN` | `NaN` |

- **`Number`** exige que o texto inteiro seja número; ignora só os espaços nas pontas
- **`parseInt`** lê até o primeiro caractere que não é dígito e descarta o resto. Passe sempre a base `10`
- Com `Number`, texto vazio vira `0`: confira o vazio antes
- A vírgula que o brasileiro digita engana os dois: `NaN` em um, `2` calado no outro

---

## :icon[circle-alert] NaN e Number.isNaN

**`NaN`** (*not a number*) é o resultado de uma conversão que falhou. Ele é do tipo `number` e contamina as contas: `NaN * 199.9` é `NaN`, e o preço sai "R$ NaN".

```javascript
const qtd = Number('dois');
qtd === NaN;         // false: NaN não é igual nem a si mesmo
Number.isNaN(qtd);   // true: o jeito certo de testar
Number.isNaN('abc'); // false: só é true para o próprio NaN
```

Teste logo depois de converter:

```javascript
const qtdDoComando = parseInt(process.argv[2], 10);
console.log('A conversão falhou?', Number.isNaN(qtdDoComando));
```

Para escolher uma mensagem quando a conversão falha, falta um operador que decide entre dois valores: o **ternário**, na próxima aula. Para executar passos diferentes, o `if`, no E07.

---

## :icon[square-function] Sua primeira função: formatarPreco

Uma **função** dá nome a um trecho de código: recebe valores pelos **parâmetros**, entre parênteses, e devolve o resultado com **`return`**. Com `export`, outros arquivos podem importá-la. No E07 você vê funções a fundo.

```javascript
// src/utils/formatar.js
export function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
```

```javascript
// src/utils/formatar.test.js
import { formatarPreco } from './formatar.js';

test('formata em reais', () => {
  expect(formatarPreco(199.9)).toBe('R$\u00a0199,90');
});
```

O `toLocaleString` escreve o número no formato do Brasil, em reais. Entre o `R$` e o número vem um espaço que não quebra a linha, o `\u00a0`: no teste, escreva-o assim.

---

## :icon[message-square] Template strings nas mensagens

Entre crases, uma **template string** encaixa valores com `${ }`. Qualquer expressão cabe lá dentro, inclusive a chamada de uma função:

```javascript
// com +: fácil esquecer um espaço
'Adicionado: ' + qtd + ' x ' + fone.nome;

// com template string
`Adicionado: ${qtd} x ${fone.nome}`;
`${qtd} itens · ${formatarPreco(total)}`;
```

No script, ela vai direto no `console.log`:

```javascript
console.log(`${fone.nome} por ${formatarPreco(fone.preco)}`);
// Fone Bluetooth por R$ 199,90
```

No E30, as mesmas template strings montam os textos das telas do app.

---

## Pratique

:::example Desafio
Em `src/utils/formatar.js`, escreva a função `resumoDaCompra(textoQtd, preco)`. Ela converte o texto com `parseInt` e devolve uma mensagem como `'2 x R$ 199,90 = R$ 399,80'`, usando `formatarPreco`. O que ela devolve para `'dois'`?
:::

:::tip Resposta
```javascript
export function resumoDaCompra(textoQtd, preco) {
  const qtd = parseInt(textoQtd, 10);
  return `${qtd} x ${formatarPreco(preco)} = ${formatarPreco(qtd * preco)}`;
}
```

Converta uma vez e só então faça a conta. Com `'dois'`, sai `'NaN x R$ 199,90 = R$ NaN'`: a conversão falhou e o `NaN` contaminou a conta. Na próxima aula, o ternário troca essa mensagem por um aviso.
:::

---

## :icon[triangle-alert] Erros comuns

:::warning
- Somar o argumento do terminal sem converter: `'2' + 1` vira `'21'`
- Achar que digitar um número no comando entrega um `number`: `process.argv` só tem texto
- Testar com `=== NaN`, que é sempre `false`: use `Number.isNaN`
- `parseInt` sem a base `10`, ou `Number('')` virando `0`
- Esquecer o argumento: `process.argv[2]` vira `undefined` e a conta dá `NaN`
- Declarar com `let` o que nunca muda, ou usar `var` em código novo
:::

---

## Resumo

:::summary
- `const` por padrão, `let` quando o valor precisa mudar, `var` nunca em código novo
- Os primitivos do dia a dia são `string`, `number`, `boolean`, `undefined` e `null`; `typeof` diz qual é qual
- O terminal entrega sempre texto: converta com `Number` ou `parseInt(texto, 10)` antes da conta
- Conversão que falha dá `NaN`; teste com `Number.isNaN`
- Template strings montam mensagens com `${ }`; `formatarPreco` mostra o número em reais
:::

---

## :icon[arrow-right] Próximos passos

Os valores agora chegam às contas com o tipo certo. Na aula 10, você faz as contas: operadores, comparação com `===`, curto-circuito, o ternário e `Math`.

E um mistério para resolver: no JavaScript, `0.1 + 0.2` não dá `0.3`. Numa loja, isso vira centavo sumindo da parcela.

No laboratório, o `lojinha-regras` ganha a sua primeira regra de negócio de verdade: `src/regras/precos.js`, com desconto, Pix e parcelas, tudo coberto por testes.
