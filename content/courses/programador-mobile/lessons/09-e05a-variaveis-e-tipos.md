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
- Guardar valores com nome, usando `const` e `let`, e por que deixar o `var` de lado
- Reconhecer o tipo de cada valor e perguntar o tipo com `typeof`
- Converter o texto que chega do terminal em número com `Number`, `parseInt` e `Number.isNaN`
- Montar mensagens com template strings e escrever a sua primeira função, `formatarPreco`
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **variável** | uma caixa com etiqueta: o nome fica na etiqueta, e o valor, dentro da caixa |
| **tipo** | o que cabe na caixa: número, texto, sim ou não |
| **string** | o tipo dos textos; no código, sempre entre aspas |
| **converter** | trocar o tipo de um valor: o texto `'2'` vira o número `2` |
| **`NaN`** | "não é um número": o resultado de uma conversão que falhou |
| **função** | uma receita com nome, guardada para usar quando quiser |

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

## Variáveis

Onde você guarda uma coisa para achar depois, sem confundir com as outras?

---

## :icon[tag] O que é uma variável

Uma **variável** é uma caixa com etiqueta: a etiqueta é o **nome**, e o **valor** fica dentro. No E02, você já criou algumas com `const`: as constantes.

```javascript
const nomeDaLoja = 'Lojinha';
console.log(nomeDaLoja); // Lojinha
```

| Parte | O que ela diz | Na caixa |
|---|---|---|
| `const` | "crie uma variável" | pegue uma caixa |
| `nomeDaLoja` | o nome | escreva a etiqueta |
| `=` | "guarde este valor" | ponha dentro |
| `'Lojinha'` | o valor, um texto | o conteúdo |

Daí em diante, cada vez que o código escreve `nomeDaLoja`, o JavaScript abre a caixa e usa o que está dentro.

---

## :icon[variable] const: a caixa lacrada

Com **`const`**, a caixa vem lacrada: o nome fica preso àquele valor. No `lojinha-regras`, quase tudo nasce com `const`.

```javascript
const nomeDaLoja = 'Lojinha';
const freteFixo = 15;
const fone = produtos[0];

freteFixo = 20; // TypeError: uma const não pode ser reatribuída
```

- **Reatribuir** é guardar outro valor num nome que já existe. Com `const`, é erro: o Node para com `TypeError`, e o problema aparece logo, não semanas depois
- Dê nomes em português, que dizem o que a caixa guarda: `precoComDesconto`, não `pcd`. As palavras vão juntas, e cada uma, a partir da segunda, começa com maiúscula: é o **camelCase**
- `const` prende o nome, não o conteúdo: os campos de uma ficha guardada em `const`, como `fone.preco`, ainda podem mudar

---

## :icon[pencil] let: quando o valor muda

**`let`** é a caixa que deixa trocar o conteúdo. Use quando o mesmo nome precisa receber outro valor mais adiante, como um total que vai somando:

```javascript
let total = 0;
total = total + 199.9; // fone
total = total + 79.9;  // garrafa: total agora é 279.8

let mensagem = 'Seu carrinho está vazio';
mensagem = 'Pronto para finalizar';
```

O `=` não é o "igual" da matemática: ele **atribui**, isto é, guarda. Primeiro calcula o lado direito, depois guarda o resultado na caixa da esquerda. Por isso `total = total + 199.9` faz sentido: "pegue o total, some 199,90 e guarde de novo em `total`".

:::tip Regra prática
Comece sempre com `const` e troque por `let` só quando precisar reatribuir. Quem lê sabe que uma `const` não muda no meio do caminho.
:::

---

## :icon[tag] Variáveis na prática

Três usos de variáveis num script da Lojinha:

```javascript
const nomeDaLoja = 'Lojinha';
const freteFixo = 15;
console.log('Bem-vindo à', nomeDaLoja); // Bem-vindo à Lojinha

let total = 0;
total = total + 199.9;     // um fone
total = total + freteFixo; // mais o frete
console.log('Total:', total); // Total: 214.9

let mensagem = 'Seu carrinho está vazio';
mensagem = 'Você tem 1 item no carrinho';
console.log(mensagem); // Você tem 1 item no carrinho
```

- `nomeDaLoja` e `freteFixo` nunca mudam: caixas lacradas, com `const`
- `total` e `mensagem` recebem outro valor no caminho: caixas com `let`
- No `console.log`, o nome vai sem aspas: o JavaScript mostra o que está dentro da caixa

---

## :icon[ban] Por que não var

**`var`** é a forma antiga de criar variáveis, de antes do `let` e do `const`. Ela ignora os **blocos**, os trechos entre chaves `{ }`:

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

- `let` e `const` valem só no bloco onde nasceram. Fora dele, o nome não existe, e o Node avisa com `ReferenceError`. No E07, os blocos do `if` e do `for` seguem essa regra
- `var` vale na **função** inteira (funções: no fim desta aula) e pode ser criada duas vezes com o mesmo nome, sem aviso
- Você ainda vai ver `var` em código antigo e em respostas da internet; em código novo, não use

---

## Tipos

Dá para somar o nome de um produto com o preço dele?

---

## :icon[shapes] Tipos primitivos

Todo valor tem um **tipo**: o que cabe na caixa. Os **primitivos** são os tipos mais simples, que já vêm na linguagem:

| Tipo | Exemplo | Onde aparece |
|---|---|---|
| `string` | `'Fone Bluetooth'`, `'01310-100'` | nomes, CEP, tudo que vem do terminal |
| `number` | `199.9`, `3` | preço, quantidade, avaliação |
| `boolean` | `true`, `false` | `destaque`, tem estoque |
| `undefined` | valor que nunca foi definido | o argumento que faltou no comando |
| `null` | "nada", de propósito | nenhum cupom escolhido |

O `boolean` é o sim ou não: `true` ou `false`. Inteiro e decimal são o mesmo tipo, `number`. Existem ainda `bigint` e `symbol`, raros no dia a dia.

---

## :icon[search] typeof: pergunte o tipo

**`typeof`** (em inglês, "tipo de") devolve o nome do tipo de um valor, como texto:

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

O catálogo guarda número; o comando entrega texto. Foi por isso que a conta deu `21`.

---

## Texto do terminal

Faz sentido somar dois números de telefone?

---

## :icon[terminal] O terminal sempre entrega texto

Para o terminal, tudo o que você digita é texto, até os números. É como um número de telefone: tem dígitos, mas não é para fazer conta.

O `process.argv` do E02 é a **lista** das partes do comando: uma fileira de gavetas numeradas a partir do 0. Cada número é uma **posição**. A 0 guarda o `node`, a 1 guarda o script, e os seus argumentos começam na **posição 2**.

```javascript
// node src/scripts/compra.js 2 Ana
process.argv[2]; // '2': entre aspas, é texto
process.argv[3]; // 'Ana'
process.argv[4]; // undefined: não veio
```

O `'2'` aparece entre aspas: é a string `'2'`, e não o número `2`.

---

## :icon[table] De onde vem cada tipo

| De onde vem | Tipo que chega |
|---|---|
| argumento do comando | sempre `string` |
| `src/data/produtos.js` | o tipo escrito no código: `preco: 199.9` é `number` |
| arquivo `.json` lido do disco | `string`, até passar pelo `JSON.parse` |

Guarde o texto do jeito que chegou e converta uma vez, antes da conta. No E30, o campo de texto do app também entrega `string`: a regra é a mesma.

---

## :icon[combine] Coerção: o JavaScript converte sozinho

Quando os tipos não combinam, o JavaScript converte um deles por conta própria, sem avisar. Isso é **coerção**, e o `+` é o sinal mais traiçoeiro:

```javascript
'10' + 5;     // '105': com texto de um lado, o + junta
'10' - 5;     // 5: o - converte para número
'2' * 199.9;  // 399.8: o * também converte
'R$ 10' * 2;  // NaN: não deu para converter
```

Com uma string de um lado, o `+` vira **concatenação**: junta os textos, um depois do outro. Os outros sinais de conta (`-`, `*`, `/`) tentam converter para número.

:::center
![Diagrama: process.argv[2] entrega o texto '2'; textoQtd + 1 junta os textos e dá '21', enquanto Number(textoQtd) + 1 soma e dá 3](images/e05-texto-mais-numero.svg)
:::

Não conte com a coerção, nem quando ela acerta por sorte. Converta você mesmo, de forma **explícita**: escrita no código.

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

## Texto em número

Se alguém escreve "dois" num formulário, o computador entende o número 2?

---

## :icon[binary] Number e parseInt

**Converter** é trocar o tipo de um valor: o texto `'2'` vira o número `2`. Duas funções prontas fazem isso, **`Number`** e **`parseInt`**, com regras diferentes:

| Texto | `Number(texto)` | `parseInt(texto, 10)` |
|---|---|---|
| `'2'` | `2` | `2` |
| `'2.5'` | `2.5` | `2` |
| `'2,5'` | `NaN` | `2` |
| `'3 unidades'` | `NaN` | `3` |
| `''` | `0` | `NaN` |
| `undefined`, o argumento que faltou | `NaN` | `NaN` |

---

## :icon[binary] Number ou parseInt?

- **`Number`** exige que o texto inteiro seja número; ignora só os espaços nas pontas
- **`parseInt`** (*parse integer*, "ler um inteiro") lê até o primeiro caractere que não é dígito e descarta o resto: `'3 unidades'` vira `3`
- Passe sempre a base `10` ao `parseInt`, a contagem de 0 a 9 de sempre: `parseInt(texto, 10)`
- Com `Number`, texto vazio vira `0`: confira o vazio antes
- A vírgula que o brasileiro digita engana os dois: `NaN` em um, `2` calado no outro

---

## :icon[binary] Converter na prática

O `compra.js` do começo da aula, agora convertendo o texto uma vez, logo depois de ler:

```javascript
const textoQtd = process.argv[2];
const qtd = Number(textoQtd);
const fone = produtos[0];

console.log('Com mais um:', qtd + 1);
console.log('Total:', qtd * fone.preco);
```

```bash
node src/scripts/compra.js 2
# Com mais um: 3
# Total: 399.8
node src/scripts/compra.js dois
# Com mais um: NaN
# Total: NaN
```

- Com `'2'`, a conta soma de verdade: o bug do 21 acabou
- Com `'dois'`, o `Number` falha e o `NaN` aparece nas duas contas
- Com `parseInt(textoQtd, 10)` no lugar do `Number`, o comando `node src/scripts/compra.js "3 unidades"` mostra `Com mais um: 4` e `Total: 599.7`

---

## :icon[circle-alert] NaN e Number.isNaN

**`NaN`** (*not a number*, "não é um número") é o resultado de uma conversão que falhou. É como o "Erro" no visor da calculadora: toda conta feita em cima dele também dá erro. `NaN * 199.9` é `NaN`, e o preço sai "R$ NaN". E, por estranho que pareça, ele é do tipo `number`.

```javascript
const qtd = Number('dois');
qtd === NaN;         // false: NaN não é igual nem a si mesmo
Number.isNaN(qtd);   // true: o jeito certo de testar
Number.isNaN('abc'); // false: só é true para o próprio NaN
```

O `===` pergunta "é igual?", como no relatório do E02. Teste logo depois de converter:

```javascript
const qtdDoComando = parseInt(process.argv[2], 10);
console.log('A conversão falhou?', Number.isNaN(qtdDoComando));
```

Para escolher uma mensagem quando a conversão falha, falta um operador que decide entre dois valores: o **ternário**, na aula 10. Para executar passos diferentes, o `if`, no E07.

---

## Funções

Por que a cozinha guarda a receita do bolo, em vez de inventar tudo de novo?

---

## :icon[square-function] Sua primeira função: formatarPreco

Uma **função** é uma receita com nome, guardada para usar quando quiser. Ela recebe os ingredientes pelos **parâmetros** e entrega o prato pronto com **`return`**. Esta escreve um preço em reais:

```javascript
// src/utils/formatar.js
export function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
```

| Parte | O que ela diz |
|---|---|
| `export` | "outros arquivos podem usar esta função" |
| `function formatarPreco` | "esta é a receita `formatarPreco`" |
| `(valor)` | o parâmetro: o espaço do ingrediente, o número a formatar |
| `return ...` | "entregue este resultado a quem pediu" |
| `toLocaleString('pt-BR', ...)` | "escreva o número no jeito do Brasil, em reais" |

Para usar, **chame** a função pelo nome, com o valor entre parênteses: `formatarPreco(199.9)` devolve `'R$ 199,90'`. No E07, você vê funções a fundo.

---

## :icon[square-function] formatarPreco na prática

Num script em `src/scripts/`, a mesma receita serve para qualquer preço:

```javascript
import { formatarPreco } from '../utils/formatar.js';

console.log(formatarPreco(199.9));         // R$ 199,90
console.log(formatarPreco(1299.5));        // R$ 1.299,50
console.log(formatarPreco(0.5));           // R$ 0,50
console.log('Pix:', formatarPreco(189.9)); // Pix: R$ 189,90
```

- Cada chamada entrega um prato novo, com o valor que você pôs entre parênteses
- O ponto do milhar, a vírgula dos centavos e o `R$` vêm prontos
- A chamada vale o resultado que a função devolve: por isso ela cabe dentro do `console.log`

---

## :icon[test-tube] Testando o formatarPreco

O teste do E04 confere a promessa da função: com `199.9`, ela devolve `'R$ 199,90'`.

```javascript
// src/utils/formatar.test.js
import { formatarPreco } from './formatar.js';

test('formata em reais', () => {
  expect(formatarPreco(199.9)).toBe('R$\u00a0199,90');
});
```

Entre o `R$` e o número, o `toLocaleString` põe um espaço especial, que não deixa a linha quebrar ali: o **espaço não separável**. No teste, escreva-o como `\u00a0`.

Com um espaço comum, o teste falha, e o Expected e o Received parecem iguais na tela: a diferença é esse espaço.

---

## Template strings

Você já mandou uma mensagem pronta em que só faltava trocar o nome?

---

## :icon[message-square] Template strings nas mensagens

Uma **template string** (modelo de texto) é um texto entre crases com lacunas para preencher, como uma mensagem pronta em que só falta o nome: "Olá, (nome)! Seu pedido chegou." Cada lacuna é um `${ }`, e qualquer conta ou chamada de função cabe lá dentro:

```javascript
// com +: fácil esquecer um espaço
'Adicionado: ' + qtd + ' x ' + fone.nome;

// com template string
`Adicionado: ${qtd} x ${fone.nome}`;
`${qtd} itens · ${formatarPreco(total)}`;
```

No teclado brasileiro, a crase sai com <kbd>Shift</kbd> + a tecla do acento agudo, seguida de espaço.

---

## :icon[message-square] Template strings na prática

No script, ela vai direto no `console.log`:

```javascript
console.log(`${fone.nome} por ${formatarPreco(fone.preco)}`);
// Fone Bluetooth por R$ 199,90
```

Mais três mensagens da Lojinha, com `nome` valendo `'Ana'` e `qtd` valendo `2`:

```javascript
console.log(`Olá, ${nome}!`);                             // Olá, Ana!
console.log(`${qtd} x ${fone.nome}`);                     // 2 x Fone Bluetooth
console.log(`Total: ${formatarPreco(qtd * fone.preco)}`); // Total: R$ 399,80
```

Na última, a lacuna faz a conta e formata o resultado, tudo dentro do `${ }`. No E30, as mesmas template strings montam os textos das telas do app.

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

Converta uma vez e só então faça a conta. Com `'dois'`, sai `'NaN x R$ 199,90 = R$ NaN'`: a conversão falhou e o `NaN` contaminou a conta. Na aula 10, o ternário troca essa mensagem por um aviso.
:::

---

## :icon[siren] Quando aparece um erro

Leia a mensagem com calma: como a luz do painel do carro, ela diz o que aconteceu e onde.

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Assignment to constant variable` | você tentou trocar o valor de uma `const` | use `let`, se o valor precisa mudar |
| `is not defined` | o nome não existe neste ponto do código | confira a grafia e o bloco `{ }` onde ele nasceu |
| `21` onde devia sair `3` | o `+` juntou texto com número | converta com `Number` antes da conta |
| `NaN` ou `R$ NaN` | uma conversão falhou | confira o argumento; teste com `Number.isNaN` |

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
- Uma variável é uma caixa com etiqueta: `const` por padrão, `let` quando o valor precisa mudar, `var` nunca em código novo
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
