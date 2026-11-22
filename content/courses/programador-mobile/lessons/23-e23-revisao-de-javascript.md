---
title: Revisão de JavaScript
summary: Do E04 ao E22 lendo código dos três projetos, os erros mais comuns, a Prova 1 e a entrega do Projeto 3.
module: classes-e-controle
duration_minutes: 90
objectives:
  - Ler um código JavaScript e dizer o que aparece no terminal
  - Achar o engano num código com contas, textos, decisões, laços, listas, classes ou espera
  - Saber como é a Prova 1 e o que ela cobra
  - Conferir a Lista de tarefas antes de entregar o Projeto 3
---

# Revisão de JavaScript

Programador Mobile · Encontro E23 · Aula 23 de 45

---

## O que você vai revisar

:::goal
- Valores, textos e dinheiro, e as funções com os seus testes
- Decisões, repetições, objetos e listas
- Classes, erros, código que espera e o `fetch`
- Como é a Prova 1 e o que ela cobra
- O que conferir antes de entregar o Projeto 3
:::

Hoje não tem palavra nova: o encontro é para ler código. Na última hora, a Prova 1.

---

## :icon[map] O mapa do JavaScript no curso

Do E04 ao E22: três unidades e três projetos, todos no terminal e com uma página pronta.

| Unidade | Projeto | O que ele usou |
|---|---|---|
| Ambiente JavaScript, E04 e E05 | Racha-conta, etapas 1 e 2 | npm, scripts, `reduce`, Git e README |
| Linguagem JavaScript, E06 a E16 | Racha-conta, etapas 3 a 9; Agenda de contatos | centavos, funções, Jest, textos, `if`, laços, `Date`; a ficha, `find`, `map`, spread, módulos |
| Classes e controle, E17 a E22 | Lista de tarefas | `switch`, `??`, `while`, classes, herança, erros, `async`, `fetch` |

Nos três: regras puras, testes no Jest e um commit por etapa. A Prova 1 cobre as três linhas.

---

## :icon[package] A rotina de todo projeto

Os três projetos cresceram do mesmo jeito, com o npm e o Git:

| O quê | O que faz |
|---|---|
| `package.json` | a lista de ingredientes: o nome, os scripts e os pacotes |
| `npm install` | baixa os pacotes para o `node_modules`, que o `.gitignore` deixa fora das fotos |
| `npm test`, `npm run racha` | rodam um apelido de `scripts`, como o contato salvo com nome |
| `git add .` e `git commit -m` | tiram a foto da etapa, com legenda |
| `git push` | manda as fotos ao GitHub: a sua cópia na nuvem |

O `package-lock.json` é a nota fiscal: vai junto, para todos instalarem as mesmas versões.

---

## Valores, textos e dinheiro

R$ 206,25 para quatro amigos: por que ninguém paga 51,5625?

---

## :icon[coins] O que cabe na caixa e o dinheiro em centavos

Todo valor tem um **tipo**, o que cabe na caixa. O dinheiro vai em **centavos inteiros**.

| Ideia | Como se escreve |
|---|---|
| tipos | `number`, `string`, `boolean`; com texto, o `+` junta: `'4' + 1` dá `'41'` |
| `const` e `let` | a caixa lacrada e a que deixa trocar |
| centavos | `Math.round(72.9 * 100)` dá `7290`, sem a sobra do `0.1 + 0.2` |
| dividir sem partir | `Math.floor(10000 / 3)` dá `3333`; o resto, `10000 % 3`, dá `1` |
| textos | `trim` e `replace` devolvem um texto novo; `Number('72,90')` dá `NaN` |
| datas | o mês começa em 0; `String(9).padStart(2, '0')` dá `'09'` |

---

## :icon[coins] Leia o código: a conta dividida

:::example O que aparece nas três linhas?
```javascript
const totalCentavos = Math.round(98.5 * 100);
const pessoas = 3;
const parte = Math.floor(totalCentavos / pessoas);
const sobra = totalCentavos % pessoas;
console.log(`Cada um: R$ ${(parte / 100).toFixed(2)}`);
console.log(`Centavos que sobram: ${sobra}`);
console.log('Pessoas: ' + pessoas + 1);
```
:::

:::tip Resposta
1. `Cada um: R$ 32.83`. Os 9850 centavos divididos por 3 dão 3283,33...; o `Math.floor` corta as casas, e a template string mostra em reais
2. `Centavos que sobram: 1`. Três vezes 3283 dá 9849, e o resto, o `%`, é 1. No Racha-conta, esse centavo vai para a Pessoa 1
3. `Pessoas: 31`. Da esquerda para a direita, o texto junta o 3 e depois o 1. Com parênteses, `(pessoas + 1)`, sai `Pessoas: 4`
:::

---

## :icon[text] Leia o código: o valor digitado

:::example O que aparece nas quatro linhas?
```javascript
let valor = '  72,90 ';
valor.trim();
console.log(valor.length);
valor = valor.trim();
console.log(Number(valor));
valor = valor.replace(',', '.');
console.log(Number(valor) * 2);
console.log(Number.isNaN(Number('setenta')));
```
:::

:::tip Resposta
1. `8`. O `trim` da segunda linha fez uma cópia limpa, e ninguém guardou: o texto continua com os espaços
2. `NaN`. O `Number` não entende a vírgula
3. `145.8`. Com o ponto, `'72.90'` vira `72.9`, e a conta dá `145.8`
4. `true`. `Number('setenta')` dá `NaN`, e o `Number.isNaN` reconhece. O `=== NaN` não serve: o `NaN` não é igual nem a ele mesmo
:::

---

## :icon[notebook-pen] Exercícios: Valores, textos e dinheiro

:::example Exercícios
1. O que aparece? `console.log('5' + 3, Number('5') + 3);`
2. Quanto dá `19.9 * 100`? E `Math.round(19.9 * 100)`?
3. São 50 ovos e bandejas de 12. Escreva as duas contas: quantas bandejas ficam cheias e quantos ovos sobram
4. O que aparece nas duas linhas?
   ```javascript
   const placa = ' abc-1234 ';
   console.log(placa.trim().toUpperCase().length);
   console.log(placa.length);
   ```
:::

:::tip Respostas
1. `53 8`: com texto, o `+` junta; o `Number` transforma o texto em número antes da conta
2. `1989.9999999999998` e `1990`: o `Math.round` tira a sobra, como na conversão para centavos
3. `Math.floor(50 / 12)` dá `4` bandejas; `50 % 12` dá `2` ovos
4. `8` e `10`: o `trim` e o `toUpperCase` trabalham numa cópia, e a `placa` continua com os espaços
:::

---

## Funções, módulos e testes

A regra da gorjeta mudou. Em quantos lugares do código você quer mexer?

---

## :icon[square-function] A receita, a vitrine e a prova com gabarito

A **função** é a receita com nome; o **módulo**, a vitrine; o **teste**, a prova com gabarito.

| Ideia | Como se escreve |
|---|---|
| a receita | `function calcularGorjeta(subtotal, percentual = 10)`: o 10 é o padrão |
| o prato e a foto | o `return` entrega o valor; só com `console.log`, a chamada vale `undefined` |
| a forma curta | `(item) => item.preco > 50`; com chaves, precisa de `return` |
| a vitrine | `export function` entra com chaves; `export default`, sem; o caminho termina em `.js` |
| o gabarito | `expect(calcularGorjeta(18750, 10)).toBe(1875)`; lista, com `toEqual` |
| o vermelho | `Expected` é o gabarito; `Received`, o que a função devolveu |

---

## :icon[square-function] Leia o código: o prato e a foto

:::example O que aparece no terminal, em ordem?
```javascript
function taxa(pedido, entrega = 8) {
  return pedido + entrega;
}
function mostrarTaxa(pedido, entrega = 8) {
  console.log(pedido + entrega);
}
const a = taxa(50, 0);
const b = mostrarTaxa(50);
console.log(a, b);
console.log(taxa());
```
:::

:::tip Resposta
`58`, depois `50 undefined` e `NaN`.

1. `mostrarTaxa(50)` mostra `58`, a foto do prato, e não entrega nada: `b` vale `undefined`
2. `taxa(50, 0)` entrega `50`: o `0` veio, então vale, e o padrão 8 não entra
3. `taxa()` chega sem argumentos: `pedido` é `undefined`, e `undefined + 8` não dá número
:::

---

## :icon[test-tube] Leia o código: o vermelho do Jest

:::example Quantos testes passam? O que o vermelho mostra?
```javascript
// fatias.js
export function fatiasPorPessoa(fatias, pessoas = 2) {
  return Math.floor(fatias / pessoas);
}
```

```javascript
// fatias.test.js, na mesma pasta
import { fatiasPorPessoa } from './fatias.js';

test.each([
  [8, 4, 2],
  [8, 3, 3],
])('fatiasPorPessoa(%i, %i) dá %i', (fatias, pessoas, esperado) => {
  expect(fatiasPorPessoa(fatias, pessoas)).toBe(esperado);
});

test('sem pessoas, divide por 2', () => {
  expect(fatiasPorPessoa(8)).toBe(4);
});
```
:::

:::tip Resposta
`Tests: 1 failed, 2 passed, 3 total`. O vermelho é o `● fatiasPorPessoa(8, 3) dá 3`, com `Expected: 3` e `Received: 2`: o `Math.floor(8 / 3)` corta para 2. Quem errou foi o gabarito: 8 fatias para 3 pessoas dão 2 para cada, e sobram 2. O terceiro teste confere o valor padrão: `fatiasPorPessoa(8)` divide por 2.
:::

---

## :icon[notebook-pen] Exercícios: Funções, módulos e testes

:::example Exercícios
1. Qual devolve o dobro: `(n) => n * 2` ou `(n) => { n * 2; }`?
2. O que aparece? (em centavos)
   ```javascript
   function passagem(tarifa = 500, viagens = 2) {
     return tarifa * viagens;
   }
   console.log(passagem(), passagem(440), passagem(440, 1));
   ```
3. O `preco.js` tem `export default function formatarPreco` e `export function somar`. Escreva o import das duas numa linha só, da mesma pasta
4. No vermelho do Jest, `Expected: 1000` e `Received: 880`: qual é o gabarito?
:::

:::tip Respostas
1. A primeira. Com chaves, a seta precisa de `return`: a segunda devolve `undefined`
2. `1000 880 440`: o padrão vale só para o argumento que não veio
3. `import formatarPreco, { somar } from './preco.js';`: chaves só no nomeado
4. O `Expected`; o `Received` é o que a função devolveu
:::

---

## Decisões e repetições

Bateria em 3%: o celular avisa "fraca" ou "desligando"? Quem escolhe?

---

## :icon[split] A bifurcação, as saídas e o carrinho

O **`if`** é a bifurcação na estrada; o **laço** confere o carrinho item por item.

| Ideia | Como se escreve |
|---|---|
| um caminho só | no `else if` e no `switch`, vale o primeiro caso que bate |
| juntar perguntas | `&&` pede todas, `\|\|` pede uma, `!` inverte |
| o que não veio | `a ?? b` troca só `null` e `undefined`; `?.` lê sem quebrar |
| barrar na porta | o `if` com `return` no começo da função |
| item por item | `for...of`, `for` com índice e `while (condição)` |
| o visor e a gaveta | o acumulador nasce antes do laço; o `push` põe no fim |

---

## :icon[split] Leia o código: a ordem das saídas

:::example O que aparece nas três linhas?
```javascript
function selo(nota) {
  if (nota >= 4) {
    return 'Muito bom';
  } else if (nota >= 4.5) {
    return 'Excelente';
  }
  return 'Sem selo';
}
const avaliacao = { nota: 0 };
console.log(selo(4.8));
console.log(avaliacao.nota ?? 5, avaliacao.estrelas ?? 5);
console.log(avaliacao.nota === 0 ? 'Nova' : 'Avaliada');
```
:::

:::tip Resposta
1. `Muito bom`. Com 4.8, a primeira pergunta, `nota >= 4`, já dá `true`, e o `Excelente` nunca é perguntado. Com `>=`, a faixa maior vem primeiro
2. `0 5`. O `??` troca só a caixa vazia: a `nota` tem um 0 dentro e fica; o campo `estrelas` não existe, vale `undefined` e vira 5
3. `Nova`. O ternário escolhe o valor do sim, porque `0 === 0` dá `true`
:::

---

## :icon[repeat] Leia o código: os copos, volta por volta

:::example O que aparece no terminal?
```javascript
const copos = [250, 300, 0, 500];
let total = 0;
const cheios = [];
for (const copo of copos) {
  total = total + copo;
  if (copo >= 300) {
    cheios.push(copo);
  }
}
console.log(total, cheios);
```
:::

:::tip Resposta
`1050 [ 300, 500 ]`.

| Volta | `copo` | `total` depois | `copo >= 300`? | `cheios` depois |
|---|---|---|---|---|
| 1 | 250 | 250 | não | `[]` |
| 2 | 300 | 550 | sim | `[300]` |
| 3 | 0 | 550 | não | `[300]` |
| 4 | 500 | 1050 | sim | `[300, 500]` |

O `total` e a `cheios` nascem antes do laço, e o `console.log` vem depois da `}`: aparece uma vez só, no fim.
:::

---

## :icon[notebook-pen] Exercícios: Decisões e repetições

:::example Exercícios
1. Meia-entrada vale para estudante ou para quem tem 60 anos ou mais. Complete: `const meia = estudante ___ idade >= 60;`
2. Escreva com ternário: a `placa` é `'aberto'` se `hora < 22`; senão, `'fechado'`
3. Quantas vezes aparece `Chamando`?
   ```javascript
   let senha = 10;
   while (senha < 5) {
     console.log('Chamando', senha);
     senha = senha + 1;
   }
   console.log('Fim');
   ```
4. Ache o erro e conserte para mostrar `10000`:
   ```javascript
   const passos = [3200, 4100, 2700];
   for (const dia of passos) {
     let total = 0;
     total = total + dia;
   }
   console.log(total);
   ```
:::

:::tip Respostas
1. `||`: uma das duas já vale
2. `const placa = hora < 22 ? 'aberto' : 'fechado';`
3. Nenhuma: `10 < 5` começa `false`, o laço não dá nenhuma volta, e só aparece `Fim`
4. `total is not defined`: o `let total` nasceu dentro do laço. Com o `let total = 0;` antes do `for`, ele acumula as três voltas: `10000`
:::

---

## Objetos e listas

Peneira, linha de produção e calculadora: qual delas devolve um número só?

---

## :icon[funnel] A ficha, as gavetas e as três máquinas

O **objeto** é a ficha de cadastro; a **lista**, a fileira de gavetas numeradas a partir do 0.

| Ideia | Como se escreve |
|---|---|
| a ficha e as gavetas | `contato.nome`, `contato[campo]`, `lista[0]`, `lista.length` |
| a peneira | `filter`: lista nova, só com quem passa no teste |
| a linha de produção | `map`: lista nova, cada item transformado |
| a calculadora | `reduce`: um valor só; o número do fim é o começo do visor |
| achar | `find`: o primeiro que passa, ou `undefined`; `some`: algum passa? |
| a cópia | `[...lista, novo]` e `{ ...ficha, nome: 'Ana' }`; `const outra = lista` é o mesmo endereço |

---

## :icon[funnel] Leia o código: peneira, linha de produção e calculadora

:::example O que aparece no terminal?
```javascript
const itens = [
  { descricao: 'Pizza marguerita', preco: 72.9, quantidade: 1 },
  { descricao: 'Refrigerante', preco: 14.5, quantidade: 2 },
  { descricao: 'Água', preco: 4, quantidade: 3 },
];
const caros = itens.filter((item) => item.preco > 10);
const nomes = caros.map((item) => item.descricao.toUpperCase());
const unidades = itens.reduce((total, item) => total + item.quantidade, 0);
console.log(caros.length, nomes, unidades);
```
:::

:::tip Resposta
`2 [ 'PIZZA MARGUERITA', 'REFRIGERANTE' ] 6`.

1. A peneira, item por item: `72.9 > 10` sim, `14.5 > 10` sim, `4 > 10` não. A `caros` fica com 2
2. A linha de produção recebe as 2 fichas da `caros` e entrega 2 textos em maiúsculas, na mesma ordem
3. A calculadora soma as quantidades da `itens`, as 3: volta 1, `0 + 1 = 1`; volta 2, `1 + 2 = 3`; volta 3, `3 + 3 = 6`
:::

---

## :icon[copy] Leia o código: a cópia e o endereço

:::example O que aparece nas duas linhas?
```javascript
const contatos = [{ nome: 'Ana' }, { nome: 'Bruno' }];
const mesma = contatos;
const copia = [...contatos];
mesma.push({ nome: 'Carla' });
console.log(contatos.length, copia.length);
const ana = { ...contatos[0], nome: 'Ana Souza' };
console.log(contatos[0].nome, ana.nome);
```
:::

:::tip Resposta
`3 2` e `Ana Ana Souza`.

1. A `mesma` não é outra lista: é outro papel com o mesmo endereço, e os dois levam à mesma casa. O `push` pela `mesma` muda a `contatos`
2. O `[...contatos]` tirou uma cópia antes do `push`: ela continua com 2
3. `{ ...contatos[0], nome: 'Ana Souza' }` copia a ficha e troca o nome na cópia. É mexer na cópia, sem rasurar o original: a `contatos[0]` continua `Ana`
:::

---

## :icon[notebook-pen] Exercícios: Objetos e listas

:::example Exercícios
1. O que aparece?
   ```javascript
   const precos = { pao: 150, leite: 600 };
   const item = 'leite';
   console.log(precos[item], precos.item);
   ```
2. O que aparece nas duas linhas?
   ```javascript
   const onibus = [
     { linha: '101', lotado: true },
     { linha: '202', lotado: false },
     { linha: '303', lotado: false },
   ];
   console.log(onibus.find((o) => !o.lotado).linha);
   console.log(onibus.some((o) => o.lotado), onibus.every((o) => o.lotado));
   ```
3. Escreva o `map` que transforma `[10, 20]` em `['R$ 10', 'R$ 20']`
4. O que dá `['Uva', 'banana', 'Abacaxi'].sort((a, b) => a.localeCompare(b))`?
:::

:::tip Respostas
1. `600 undefined`: o `[item]` lê o campo com o nome guardado na caixa, `leite`; o `.item` procura um campo chamado `item`
2. `202`, o primeiro não lotado, e `true false`: algum está lotado, mas não todos
3. `[10, 20].map((n) => 'R$ ' + n)`
4. `[ 'Abacaxi', 'banana', 'Uva' ]`: a ordem do dicionário
:::

---

## Classes e erros

Uma forma, muitos bolos. E quando a massa vem errada, quem avisa?

---

## :icon[boxes] A forma de bolo e a rede de proteção

A **classe** é a forma de bolo; cada **instância**, um bolo feito pelo `new`. O `try`/`catch` é a rede de proteção do trapezista.

| Ideia | Como se escreve |
|---|---|
| a forma | `class Tarefa`, `constructor(dados)`, `this.titulo = dados.titulo` |
| fazer e responder | método com parênteses, `regar.concluir()`; `get` sem, `prova.peso` |
| um tipo de | `extends Tarefa`; `super(dados)` antes do `this`; o mesmo nome sobrescreve |
| acender a luz | `throw new ErroDeTarefa('...', 'titulo')`: a função para ali |
| a rede | o `catch` segura, o `finally` roda sempre, o bug volta com `throw erro` |
| o teste do erro | `expect(() => new Tarefa({ titulo: '' })).toThrow(...)` |

---

## :icon[list-tree] Leia o código: o cartão é um tipo de pagamento

:::example O que aparece nas duas linhas?
```javascript
class Pagamento {
  constructor(valor) {
    this.valor = valor;
  }
  pagar() {
    return `Pago: R$ ${this.valor}`;
  }
}
```

```javascript
class Cartao extends Pagamento {
  constructor(valor, parcelas) {
    super(valor);
    this.parcelas = parcelas;
  }
  pagar() {
    return `${this.parcelas}x de R$ ${this.valor / this.parcelas}`;
  }
}
```

```javascript
const pix = new Pagamento(90);
const cartao = new Cartao(90, 3);
console.log(pix.pagar());
console.log(cartao.pagar(), cartao.valor);
```
:::

:::tip Resposta
`Pago: R$ 90` e `3x de R$ 30 90`. O `pix` é um bolo da forma `Pagamento`. O `cartao` é um tipo de pagamento: o `super(valor)` monta a parte da mãe, e o `valor` 90 vem dela. O pedido é o mesmo, `pagar()`, e cada forma paga do seu jeito: o `pagar` da filha sobrescreve o da mãe.
:::

---

## :icon[shield-check] Leia o código: a rede dentro do laço

:::example O que aparece no terminal?
```javascript
function lerIdade(texto) {
  const idade = Number(texto);
  if (Number.isNaN(idade)) {
    throw new Error(`Idade inválida: ${texto}`);
  }
  return idade;
}
```

```javascript
for (const texto of ['17', 'doze', '30']) {
  try {
    console.log('Idade:', lerIdade(texto));
  } catch (erro) {
    console.log(erro.message);
  } finally {
    console.log('fim de', texto);
  }
}
```
:::

:::tip Resposta
| Volta | `texto` | O `try` | Aparece |
|---|---|---|---|
| 1 | `'17'` | sem erro | `Idade: 17` e `fim de 17` |
| 2 | `'doze'` | o `throw` pula para o `catch` | `Idade inválida: doze` e `fim de doze` |
| 3 | `'30'` | sem erro | `Idade: 30` e `fim de 30` |

O `finally` roda nas três voltas. A rede segura o erro da segunda, e o laço segue para a terceira.
:::

---

## :icon[notebook-pen] Exercícios: Classes e erros

:::example Exercícios
1. O que aparece? E com `g.litros()`?
   ```javascript
   class Garrafa {
     constructor(ml) {
       this.ml = ml;
     }
     get litros() {
       return this.ml / 1000;
     }
   }
   const g = new Garrafa(1500);
   console.log(g.litros, g.ml);
   ```
2. Ache o erro: com `constructor(saldo) { saldo = saldo; }`, a `new Conta(50).saldo` dá `undefined`
3. Na filha, `constructor(valor, dia) { this.dia = dia; super(valor); }`. O que acontece no `new`?
4. Num `catch` que só mostra `erro.message`, o bug `criarConta is not defined` vira aviso. Como relançar o que não é `ErroDeConta`?
:::

:::tip Respostas
1. `1.5 1500`: o `get` se lê sem parênteses. Com eles, `TypeError: g.litros is not a function`
2. Falta o `this.`: `this.saldo = saldo;` guarda na instância
3. `ReferenceError: Must call super constructor...`: o `super(valor)` vem antes de qualquer `this`
4. Relance o que não é seu: `if (erro.name !== 'ErroDeConta') { throw erro; }`
:::

---

## Código que espera

Você pagou o lanche e recebeu uma senha. O que dá para fazer enquanto espera?

---

## :icon[hourglass] O garçom, a senha e o pedido pela internet

O código **assíncrono** termina depois, sem travar o resto: é o garçom que atende outras mesas e volta quando a cozinha chama.

| Ideia | Como se escreve |
|---|---|
| depois de um tempo | `setTimeout(callback, ms)`: o código de agora sai primeiro |
| a senha | a Promise: pendente, depois cumprida ou rejeitada |
| sem travar a fila | `await`, só em função `async`; sem ele, `Promise { <pending> }` |
| a gaveta do navegador | `setItem(chave, JSON.stringify(lista))`; o `getItem` sem nada dá `null` |
| o garçom da internet | `await fetch(url)` e `await resposta.json()` |
| deu certo? | 404 e 500 chegam com `ok` falso; sem internet, o `await` lança |

---

## :icon[hourglass] Leia o código: quem aparece primeiro

:::example Em que ordem aparecem as quatro linhas?
```javascript
function esperar(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
async function salvar() {
  console.log('1: salvando');
  await esperar(300);
  console.log('2: salvo');
}
setTimeout(() => console.log('3: lembrete'), 0);
salvar();
console.log('4: tela pronta');
```
:::

:::tip Resposta
**1, 4, 3, 2.**

| Momento | O que roda | Aparece |
|---|---|---|
| agora | o lembrete é marcado; o `salvar()` começa | `1: salvando` |
| agora | o `await` pausa o `salvar` e dá a vez | nada |
| agora | a última linha | `4: tela pronta` |
| 0 ms, depois do código de agora | o callback do lembrete | `3: lembrete` |
| 300 ms | o `salvar` continua de onde parou | `2: salvo` |
:::

---

## :icon[cloud-download] Leia o código: o garçom da internet

:::example O que aparece no terminal? E sem internet?
```javascript
async function buscarTarefa(id) {
  let resposta;
  try {
    resposta = await fetch(`https://dummyjson.com/todos/${id}`);
  } catch (erro) {
    return 'Sem conexão';
  }
  if (!resposta.ok) {
    return `Respondeu ${resposta.status}`;
  }
  const tarefa = await resposta.json();
  return tarefa.todo;
}
```

```javascript
async function mostrar() {
  console.log(await buscarTarefa(3));
  console.log(await buscarTarefa(9999));
}
mostrar();
```
:::

:::tip Resposta
`Watch a classic movie` e `Respondeu 404`. A tarefa 3 existe: o `ok` é `true`, e o segundo `await` transforma o corpo em objeto. A 9999 não existe: a resposta chega, com `ok` falso e o status 404, e quem confere é o `if`, porque o `fetch` não lança. Sem internet, o pedido nem chega: o `await fetch` lança, e o `catch` devolve `Sem conexão` nas duas linhas.
:::

---

## :icon[notebook-pen] Exercícios: Código que espera

:::example Exercícios
1. O `esperar(ms)` é o do Projeto 3. Em que ordem, e quando, aparecem as linhas?
   ```javascript
   async function lavar() {
     console.log('Lavando');
     await esperar(300);
     console.log('Enxaguando');
     await esperar(300);
     console.log('Pronto');
   }
   lavar();
   console.log('Máquina ligada');
   ```
2. A gaveta guardou `JSON.stringify([3, 5, 8])` na chave `'fila'`. Quanto dão `localStorage.getItem('fila').length` e `JSON.parse(localStorage.getItem('fila')).length`?
3. Verdadeiro ou falso: sem internet, o `fetch` devolve uma resposta com `ok` falso
4. Escreva a linha: `dados` recebe o corpo da `resposta`, como objeto
:::

:::tip Respostas
1. `Lavando` e `Máquina ligada` na hora; `Enxaguando` em 300 ms; `Pronto` em 600 ms. Cada `await` pausa só a `lavar`
2. `7` e `3`: o texto `'[3,5,8]'` tem 7 sinais; a lista, 3 itens
3. Falso: a senha é cancelada, e o `await` lança. O `ok` falso é do 404 e do 500
4. `const dados = await resposta.json();`
:::

---

## :icon[siren] Os erros que mais apareceram

| O engano | O que aparece | O conserto |
|---|---|---|
| texto no `+` | `'41'`, `Pessoas: 31` | `Number(...)` ou parênteses |
| função sem `return` | `undefined`, `R$ NaN` | `return` |
| `toBe` com lista | `serializes to the same string` | `toEqual` |
| `<=` no `for` | uma volta a mais | `i < lista.length` |
| campo sem `this.` | `is not defined` | `this.saldo` |
| `await` esquecido | `Promise { <pending> }` | `await`, em função `async` |

Sem mensagem nenhuma: o `+` que junta, a ordem do `else if` e a lista mudada pelo outro endereço. A pista é a saída.

---

## :icon[clipboard-check] Como é a Prova 1

| Item | Como é |
|---|---|
| questões | 20, do E04 ao E22, embaralhadas para cada pessoa |
| tempo | 60 minutos, do clique em **Começar**; no zero, envia sozinho |
| tentativas | uma, que só conta no **Enviar** |
| consulta | nenhuma: só a aba da prova, celular guardado |
| nota | mínimo 70; o gabarito não aparece ao enviar |

Mais da metade das questões traz um código: o que aparece no terminal ou o que está errado. Leia linha por linha antes das alternativas e faça a tabela volta por volta no rascunho. Na múltipla escolha, marque todas as certas; na lacuna, a palavra exata do código.

---

## :icon[milestone] Projeto 3 · Antes de entregar

Com o `npx serve .` ligado, numa janela anônima (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>N</kbd>), faça o caminho da correção:

- :icon[wifi] `npm test` verde com o Wi-Fi desligado
- :icon[circle-x] o título vazio e o "ab": a mensagem embaixo do título
- :icon[repeat] concluir a semanal: nasce outra, "Vence em 7 dias"
- :icon[save] recarregar a página: as tarefas voltam
- :icon[cloud-download] importar duas vezes: "5 tarefas novas" e "Nenhuma tarefa nova"; na aba Network em Offline, "Sem conexão"
- :icon[file-text] o README com os dois prints, como rodar e como testar
- :icon[git-commit-horizontal] no GitHub, o commit do kit, os seis das etapas e nenhum `node_modules`

Na correção, o instrutor pode pedir que você explique o seu `concluir` ou o `importar`.

---

## :icon[milestone] Projeto 3 · Como entregar

A etapa 6 ainda sem commit? Na raiz do `lista-de-tarefas`:

```bash
git add .
git commit -m "Projeto 3: etapa 6, exemplos da API e entrega"
git push
```

Um ajuste depois desse commit vai num commit novo, com uma legenda que diz o que mudou, como `Projeto 3: prints no README`.

:::steps
1. No GitHub, abra o repositório `lista-de-tarefas` e confira os prints no README
2. Na página do curso, em **Projetos**, abra o Projeto 3, cole o link do repositório e clique em **Enviar entrega**
3. Até a correção, você pode trocar o link
:::

**Prazo: início do E24.** O instrutor pode devolver o projeto para ajustes, com um comentário por critério: corrija, faça um commit e envie de novo pela mesma página.

---

## Resumo

:::summary
- Dinheiro em centavos inteiros; `Math.floor` e `%` dividem sem partir; o `+` com texto junta
- A função entrega com `return`; o teste confere com `toBe`, e a lista com `toEqual`
- No `else if`, vale a primeira `true`; o laço anda volta por volta, e o acumulador nasce antes dele
- `filter` peneira, `map` transforma e `reduce` acumula; o spread tira uma cópia sem rasurar o original
- A classe é a forma; `extends` e `super` fazem um tipo de; o `catch` segura o erro, e o `finally` roda sempre
- O `await` espera a senha sem travar; com o `fetch`, confira o `ok` antes de ler o corpo
- A Prova 1 tem 20 questões, 60 minutos, uma tentativa e nota mínima 70
:::

---

## :icon[arrow-right] Próximos passos

No E24, o JavaScript vira tela, com o **React**:

- :icon[component] os componentes, as peças de Lego da tela
- :icon[code-xml] o JSX: as tags do HTML dentro do JavaScript
- :icon[milestone] começa o Projeto 4, o Livro de receitas, a partir de um kit

O Projeto 3 entra até o início do E24.
