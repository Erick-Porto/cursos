---
title: Decisões
summary: "O Racha-conta aprende a escolher: if, else, else if, e, ou, não, null e um aviso quando a entrada não vale."
module: linguagem-js
duration_minutes: 90
objectives:
  - Escolher o caminho do código com if, else e else if, conferindo caso por caso
  - "Juntar perguntas com &&, || e ! e conferir números inteiros com Number.isInteger"
  - Devolver null quando a entrada não vale, com retorno antecipado, e testar esses casos
  - Fazer o Racha-conta mostrar um aviso quando o valor ou o número de pessoas não vale
---

# Decisões

Programador Mobile · Encontro E10 · Aula 10 de 45

---

## O que você vai aprender

:::goal
- Escolher entre dois caminhos com `if` e `else`, e entre vários com `else if`
- Juntar perguntas com `&&` (e), `||` (ou) e `!` (não)
- Devolver `null` quando a entrada não vale e sair cedo de uma função
- Escolher um valor numa linha só, com o ternário
- Fazer o Racha-conta avisar quando o valor ou o número de pessoas não vale
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **`else`** | "senão": o caminho que o código pega quando a resposta do `if` é `false` |
| **`else if`** | "senão, se": mais uma pergunta, feita só se a de cima deu `false` |
| **operador lógico** | o "e" (`&&`), o "ou" (`\|\|`) e o "não" (`!`): juntam ou invertem perguntas |
| **`null`** | "nada, de propósito": o valor que uma função devolve para dizer "não deu" |
| **retorno antecipado** | o `return` que sai da função logo no começo, quando a entrada não vale |
| **ternário** | um `if` e `else` numa linha só, que escolhe entre dois valores |

---

## O Racha-conta aceita qualquer coisa

No E09, o Racha-conta passou a aceitar o valor no comando. Mas ele aceita **qualquer** valor e ignora o número de pessoas:

| Comando | Hoje | No fim do encontro |
|---|---|---|
| `npm run racha abc` | `R$ NaN` em todas as contas | `Valor inválido: "abc". Digite como 187,50 ou "R$ 187,50".` |
| `npm run racha "R$ 100,00" 3` | `Pessoas na mesa: 4`: o 3 some | `Pessoas na mesa: 3` |
| `npm run racha 100 0` | divide por 4, sem reclamar | `Número de pessoas inválido: "0". ...` |

:::question
O que o app do banco faz quando você digita "abc" no valor de um Pix?
:::

---

## if e else

Na bifurcação da estrada, dá para seguir pelos dois lados ao mesmo tempo?

---

## :icon[split] if e else: um caminho ou o outro

Na aula 3, o **`if`** ("se") rodava as chaves só quando a resposta era `true`. O **`else`** ("senão") é o outro lado da bifurcação na estrada: as chaves dele rodam quando a resposta é `false`.

```javascript
const bateria = 15;

if (bateria < 20) {
  console.log('Bateria fraca: ligue o carregador');
} else {
  console.log('Bateria ok');
}
```

| `bateria` | A pergunta | Caminho | Aparece |
|---|---|---|---|
| 15 | `15 < 20`: `true` | o do `if` | Bateria fraca: ligue o carregador |
| 20 | `20 < 20`: `false` | o do `else` | Bateria ok |
| 80 | `80 < 20`: `false` | o do `else` | Bateria ok |

- Sempre **um** dos dois caminhos roda: nunca os dois, nunca nenhum
- O `else` não tem pergunta: ele pega todo o resto

---

## :icon[split] if e else na prática

**Caso 1: o argumento veio?** A saudação da aula 3, agora sem a caixa `let`: cada caminho mostra o seu texto.

```javascript
const nome = process.argv[2];

if (nome) {
  console.log('Olá,', nome);
} else {
  console.log('Olá, visitante');
}
```

```bash
node ola.js Ana    # Olá, Ana
node ola.js        # Olá, visitante
```

Como na aula 3, um valor que chegou conta como "sim", e o `undefined` conta como "não".

**Caso 2: a conta tem gorjeta?** Com `gorjeta` valendo 0, sai `Sem gorjeta`; com 10, sai `Gorjeta de 10%`.

```javascript
if (gorjeta === 0) {
  console.log('Sem gorjeta');
} else {
  console.log(`Gorjeta de ${gorjeta}%`);
}
```

:::warning
Para perguntar, `===`. Um `=` só **guarda** um valor na caixa: `if (gorjeta = 0)` troca a gorjeta em vez de perguntar.
:::

---

## O null

Pediu um lanche e acabou o pão. Melhor receber um lanche errado ou um "não deu"?

---

## :icon[ban] null: "não deu"

Às vezes a função não consegue fazer o que você pediu: o texto era `'abc'`, não um número. Em vez de devolver um número errado, ela devolve **`null`** ("nulo"), que quer dizer **nada, de propósito**. É a caixa que a função entrega vazia para avisar: não deu.

```javascript
function lerIdade(texto) {
  const idade = Number(texto);
  if (Number.isNaN(idade)) {
    return null;
  } else {
    return idade;
  }
}

console.log(lerIdade('17'));    // 17
console.log(lerIdade('abc'));   // null
```

- `null` se escreve sem aspas: `'null'`, com aspas, seria um texto
- Quem recebe pergunta com `=== null`, porque `null === null` dá `true`. O `NaN` do E09 não deixava: `NaN === NaN` dá `false`

---

## :icon[ban] null na prática

**Caso 1: quem chamou decide o que fazer.** A função só avisa; o script, com a `lerIdade` no mesmo arquivo, escolhe o caminho:

```javascript
const idade = lerIdade(process.argv[2]);

if (idade === null) {
  console.log('Digite a idade em números');
} else {
  console.log('Idade:', idade);
}
```

```bash
node idade.js 17           # Idade: 17
node idade.js dezessete    # Digite a idade em números
```

**Caso 2: três jeitos de "nada".**

| Valor | Quer dizer | Exemplo |
|---|---|---|
| `undefined` | ninguém pôs nada na caixa | `process.argv[3]`, sem a segunda palavra no comando |
| `null` | a função avisou: não deu | `lerIdade('abc')` |
| `NaN` | a conta não deu um número | `Number('abc')` |

---

## E, ou, não

Na portaria do cinema, o que pedem para o filme de 18 anos? E para a meia-entrada?

---

## :icon[binary] E, ou, não: juntar perguntas

Às vezes uma pergunta só é pouco. Na portaria do cinema, o filme de 18 anos pede idade **e** documento; a meia-entrada aceita estudante **ou** idoso. Os **operadores lógicos** juntam perguntas de sim ou não:

| Operador | Lê-se | Dá `true` quando |
|---|---|---|
| `&&` | e | as duas perguntas dão `true` |
| `\|\|` | ou | pelo menos uma dá `true` |
| `!` | não | a pergunta dá `false`: ele inverte a resposta |

```javascript
const idade = 17;
const temDocumento = true;
const estudante = true;

console.log(idade >= 18 && temDocumento);   // false: o filme de 18 anos pede os dois
console.log(estudante || idade >= 60);      // true: a meia-entrada aceita um dos dois
console.log(!estudante);                    // false: o "não" inverte o true
```

No teclado ABNT2, o `&` é <kbd>Shift</kbd> + <kbd>7</kbd>, e a barra `|` é <kbd>Shift</kbd> + a tecla ao lado do <kbd>Z</kbd>.

---

## :icon[binary] && e ||, caso por caso

**`&&`: de 1 a 50 pessoas?**

| `pessoas` | `pessoas >= 1` | `pessoas <= 50` | `&&` dá |
|---|---|---|---|
| 4 | `true` | `true` | `true` |
| 0 | `false` | pula | `false` |
| 51 | `true` | `false` | `false` |

**`||`: paga meia?**

| Quem | `estudante` | `idade >= 60` | `\|\|` dá |
|---|---|---|---|
| estudante, 17 anos | `true` | pula | `true` |
| 65 anos | `false` | `true` | `true` |
| 30 anos | `false` | `false` | `false` |

- O **`<=`** pergunta "é menor ou igual?", o par do `>=`
- O `&&` para no primeiro `false`; o `||`, no primeiro `true`

---

## :icon[hash] E, ou, não na prática

**Caso 1: o número é inteiro?** Pessoa não se divide: 2,5 pessoas não existe. O **`Number.isInteger`** responde:

```javascript
console.log(Number.isInteger(4));      // true
console.log(Number.isInteger(2.5));    // false
console.log(Number.isInteger(NaN));    // false
console.log(Number.isInteger('4'));    // false: é texto; converta antes, com Number
console.log(!Number.isInteger(2.5));   // true: "2,5 não é inteiro"
```

**Caso 2: três perguntas juntas.** É inteiro, e é de 1 a 50?

```javascript
const pessoas = Number('4');
console.log(Number.isInteger(pessoas) && pessoas >= 1 && pessoas <= 50);   // true
```

**Caso 3: o "ou" pede a comparação inteira dos dois lados.**

```javascript
const dia = 'terça';
if (dia === 'sábado' || 'domingo') {
  console.log('Fim de semana');   // aparece até na terça
}
```

`'domingo'` sozinho não é pergunta: é um texto, e no `if` um texto conta como "sim". O certo é `dia === 'sábado' || dia === 'domingo'`.

---

## :icon[milestone] Projeto 1 · Passo 1: lerPessoas

No fim do `src/regras/conta.js`, a função que lê o número de pessoas digitado. Ela devolve o número, se ele vale, ou `null`:

```javascript
export function lerPessoas(texto) {
  const pessoas = Number(texto.trim());
  if (Number.isInteger(pessoas) && pessoas >= 1 && pessoas <= 50) {
    return pessoas;
  }
  return null;
}
```

- `Number(texto.trim())` tira os espaços das pontas e converte, como no `lerValor` do E09
- O `if` faz três perguntas juntas com `&&`: é inteiro? É 1 ou mais? É 50 ou menos?
- O **`return`** entrega o número e **sai da função** na hora. Por isso o `return null` só roda quando o `if` dá `false`

**Pronto quando:** o arquivo está salvo, com o Formatar Documento, e `npm test` continua verde, com 17 testes.

---

## :icon[list-ordered] lerPessoas, caso por caso

| `texto` | `pessoas` | A pergunta do `if` | Devolve |
|---|---|---|---|
| `'4'` | `4` | inteiro, 4 >= 1 e 4 <= 50: `true` | `4` |
| `' 4 '` | `4` | `true`: o `trim` tirou os espaços | `4` |
| `'0'` | `0` | `0 >= 1` é `false` | `null` |
| `'2,5'` | `NaN` | `Number.isInteger(NaN)` é `false` | `null` |
| `''` | `0` | `Number('')` dá `0`, e `0 >= 1` é `false` | `null` |

- Com `&&`, se uma parte dá `false`, o `if` todo dá `false`, e a função segue para o `return null`
- `'2,5'` vira `NaN` porque o `Number` não entende vírgula, como no E09

---

## :icon[milestone] Projeto 1 · Passo 2: os testes de lerPessoas

No `conta.test.js`, `lerPessoas` entra no `import`. Com cinco nomes, escreva um por linha, para caber na tela:

```javascript
import {
  calcularGorjeta,
  paraCentavos,
  formatarReais,
  lerValor,
  lerPessoas,
} from './conta.js';
```

No fim do arquivo, os aceitos e os recusados:

```javascript
test.each([
  ['4', 4],
  [' 4 ', 4],
  ['1', 1],
  ['50', 50],
])('lerPessoas("%s") dá %i', (texto, esperado) => {
  expect(lerPessoas(texto)).toBe(esperado);
});

test.each(['', '0', '51', '2,5', '-3', 'três'])('lerPessoas("%s") dá null', (texto) => {
  expect(lerPessoas(texto)).toBe(null);
});
```

- Na segunda tabela, cada linha é **um texto só**, sem colchetes: ele entra em `texto`. O `toBe(null)` espera o "não deu"
- `1` e `50` são as **bordas**: os valores exatos onde a faixa começa e termina

**Pronto quando:** `npm test` termina com `Tests: 27 passed, 27 total`.

---

## :icon[milestone] Projeto 1 · Passo 3: as pessoas no comando

:::steps
1. No `racha.js`, `lerPessoas` no `import`, um nome por linha, como no teste
2. Logo depois do `if` do valor, o `let pessoas` e o `if` do **`process.argv[3]`**: a segunda palavra depois do nome do arquivo
3. Embaixo, o `if` e `else`: o aviso, ou as contas e as linhas de sempre, agora **dentro do `else`**
:::

```javascript
let pessoas = conta.pessoas;
if (process.argv[3]) {
  pessoas = lerPessoas(process.argv[3]);
}

if (pessoas === null) {
  console.log(`Número de pessoas inválido: "${process.argv[3]}". Digite um número inteiro de 1 a 50.`);
} else {
  // as contas e os console.log de antes
}
```

Sem pessoas que valem, não dá para dividir: as contas só rodam no caminho do `else`.

---

## :icon[milestone] Projeto 1 · Passo 3: dentro do else

Recorte as quatro contas, da `gorjetaCentavos` à `sobra`, e os `console.log`, e cole dentro do `else`. Em três lugares, `conta.pessoas` vira `pessoas`:

```javascript
} else {
  const gorjetaCentavos = calcularGorjeta(subtotalCentavos, conta.gorjeta);
  const totalCentavos = subtotalCentavos + gorjetaCentavos;
  const porPessoa = Math.floor(totalCentavos / pessoas);
  const sobra = totalCentavos % pessoas;

  console.log(pc.bold('Racha-conta:'), conta.restaurante);
  console.log('Pessoas na mesa:', pessoas);
  // ... os outros console.log, iguais
}
```

Depois, Formatar Documento: o recuo mostra o que está dentro do `else`.

**Pronto quando**, caso por caso:

| Comando | Caminho | O que aparece |
|---|---|---|
| `npm run racha` | o `else`, com as 4 pessoas do `conta.json` | a saída de sempre, com `Por pessoa: R$ 51,56` |
| `npm run racha "R$ 100,00" 3` | o `else` | `Pessoas na mesa: 3`, `Por pessoa: R$ 36,66` e `Centavos que sobram: 2` |
| `npm run racha 100 0` | o `if` | só o aviso: `Número de pessoas inválido: "0". ...` |

---

## else if

Numa estrada com várias saídas, quantas você pega para chegar aonde quer?

---

## :icon[list-ordered] else if: mais saídas na estrada

O **`else if`** ("senão, se") põe mais uma saída na estrada. O JavaScript faz as perguntas **de cima para baixo** e pega a **primeira** que dá `true`; as de baixo nem são feitas. O `else` do fim pega todo o resto.

```javascript
const bateria = 15;

if (bateria < 5) {
  console.log('Desligando...');
} else if (bateria < 20) {
  console.log('Bateria fraca: ligue o carregador');
} else {
  console.log('Bateria ok');
}
```

| `bateria` | `bateria < 5` | `bateria < 20` | Caminho | Aparece |
|---|---|---|---|---|
| 3 | `true` | não pergunta | o `if` | Desligando... |
| 15 | `false` | `true` | o `else if` | Bateria fraca: ligue o carregador |
| 50 | `false` | `false` | o `else` | Bateria ok |

Com 3, as duas perguntas dariam `true`, mas vale só a primeira: roda **um** caminho só.

---

## :icon[list-ordered] else if na prática

**Caso 1: um aviso de cada vez.** No cadastro de um app, `senha` guarda o texto digitado, e aparece o primeiro problema dela:

```javascript
if (senha === '') {
  console.log('Digite uma senha');
} else if (senha.length < 8) {
  console.log('A senha precisa ter 8 caracteres ou mais');
} else {
  console.log('Senha aceita');
}
```

| `senha` | Caminho | Aparece |
|---|---|---|
| `''` | o `if` | Digite uma senha |
| `'abc123'` | o `else if`: 6 caracteres | A senha precisa ter 8 caracteres ou mais |
| `'girassol2026'` | o `else`: 12 caracteres | Senha aceita |

O **`.length`** de um texto conta os **caracteres**: cada letra, número, espaço ou símbolo.

**Caso 2: a ordem importa.** Com a pergunta larga em cima, a estreita nunca é feita:

```javascript
if (bateria < 20) {
  console.log('Bateria fraca: ligue o carregador');
} else if (bateria < 5) {
  console.log('Desligando...');   // nunca aparece: menor que 5 já é menor que 20
}
```

Com `bateria` valendo 3, sai `Bateria fraca: ligue o carregador`. Com `<`, a faixa menor vem primeiro.

---

## Retorno antecipado

Num show, o segurança barra quem não tem ingresso na porta ou lá dentro?

---

## :icon[shield-check] Retorno antecipado: barrar na porta

Na função, o `return` entrega o resultado e **sai na hora**: o que vem embaixo não roda. Com isso, a função trabalha como o segurança do show: cada `if` barra um problema logo na entrada, com `return`, e o fim da função só cuida de quem passou. É o **retorno antecipado**.

```javascript
function podeEntrar(pessoa) {
  if (!pessoa.ingresso) {
    return 'Sem ingresso: não entra';
  }
  if (pessoa.idade < 18) {
    return 'Menor de idade: não entra';
  }
  return 'Pode entrar';
}
```

- `!pessoa.ingresso` é "não tem ingresso": o `!` inverte o `true` ou `false` do campo
- Não precisa de `else`: se um `if` barrou, o `return` já saiu da função

---

## :icon[shield-check] Retorno antecipado na prática

**Caso 1: onde cada pessoa para.**

```javascript
console.log(podeEntrar({ ingresso: false, idade: 30 }));   // Sem ingresso: não entra
console.log(podeEntrar({ ingresso: true, idade: 16 }));    // Menor de idade: não entra
console.log(podeEntrar({ ingresso: true, idade: 30 }));    // Pode entrar
```

| `pessoa` | Onde para | Devolve |
|---|---|---|
| sem ingresso, 30 anos | no primeiro `if` | `'Sem ingresso: não entra'` |
| com ingresso, 16 anos | no segundo `if` | `'Menor de idade: não entra'` |
| com ingresso, 30 anos | passa pelos dois | `'Pode entrar'` |

**Caso 2: o `null` com retorno antecipado.** A `lerIdade` fica sem `else` e devolve o mesmo, `17` para `'17'` e `null` para `'abc'`:

```javascript
function lerIdade(texto) {
  const idade = Number(texto);
  if (Number.isNaN(idade)) {
    return null;
  }
  return idade;
}
```

---

## Ternário

A placa na porta da loja diz "aberto" ou "fechado". Quem escolhe o lado?

---

## :icon[arrow-left-right] Ternário: escolher um valor numa linha

O **ternário** é um `if` e `else` numa linha só, que **escolhe entre dois valores**. Funciona como a placa da porta da loja: um lado diz "aberto", o outro diz "fechado", e a hora escolhe qual aparece.

```javascript
const hora = 20;
const placa = hora < 18 ? 'Aberto' : 'Fechado';
console.log(placa);   // Fechado
```

| Parte | O que quer dizer |
|---|---|
| `hora < 18` | a pergunta |
| `?` | "se sim..." |
| `'Aberto'` | o valor do sim |
| `:` | "...senão" |
| `'Fechado'` | o valor do não |

O nome vem das **três** partes: a pergunta, o valor do sim e o valor do não.

---

## :icon[arrow-left-right] Ternário na prática

**Caso 1: singular ou plural.**

```javascript
const pessoas = 1;
const palavra = pessoas === 1 ? 'pessoa' : 'pessoas';
console.log(`Conta dividida entre ${pessoas} ${palavra}`);
// Conta dividida entre 1 pessoa
```

Com `pessoas` valendo 3, sai `Conta dividida entre 3 pessoas`.

**Caso 2: dentro do `${ }` da template string.**

```javascript
const quantidade = 2;
console.log(`Refrigerante: ${quantidade} ${quantidade === 1 ? 'unidade' : 'unidades'}`);
// Refrigerante: 2 unidades
```

**Quando não usar:** o ternário só escolhe um valor. Para fazer coisas diferentes em cada caminho, como mostrar um aviso ou o recibo inteiro, use `if` e `else`.

---

## :icon[milestone] Projeto 1 · Sua vez: o null do lerValor

O `lerValor` passa a devolver `null` quando o texto não vale:

| Texto | Por quê |
|---|---|
| `''` | vazio |
| `'abc'` | não é número |
| `'0'` e `'0,00'` | zero |
| `'-10'` | negativo |
| `'187,505'` | mais de duas casas |

1. Os seis testes, num `test.each` como o dos recusados do `lerPessoas`. Veja o vermelho
2. Mude a função, com retorno antecipado, até ficar verde

:::tip Dicas
- Com a vírgula trocada, `limpo.split('.')` separa os centavos: `'187.505'` vira `['187', '505']`. Sem ponto, a lista tem uma parte só: confira o `.length` dela antes
- `Number('abc')` dá `NaN`: pergunte com `Number.isNaN`
:::

**Pronto quando:** `npm test` passa com 33 testes.

---

## :icon[milestone] Projeto 1 · Sua vez: o aviso do valor

No `racha.js`, o valor também ganha um aviso. Ele é conferido **antes** do das pessoas:

```plaintext
Valor inválido: "abc". Digite como 187,50 ou "R$ 187,50".
```

:::tip Dica
O `if` do valor vem primeiro, e o das pessoas vira `else if`. O `else` com as contas continua no fim.
:::

**Pronto quando**, caso por caso:

| Comando | O que aparece |
|---|---|
| `npm run racha abc` | só o aviso do valor |
| `npm run racha abc 0` | só o aviso do valor: vale a primeira pergunta que dá `true` |
| `npm run racha 100 0` | só o aviso das pessoas |
| `npm run racha "R$ 100,00" 3` | a conta, com `Por pessoa: R$ 36,66` |

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `does not provide an export named` | faltou o `export` | `export function lerPessoas` |
| `lerPessoas is not defined` | faltou no `import` do `racha.js` | `lerPessoas,` no `import` |
| `Expected: null` e `Received: undefined` | faltou o `return` do fim | `return null` |
| `reading 'length'` | `partes[1]` não existe: faltou o ponto | o tamanho da lista antes, com `&&` |
| `Unexpected end of input` ou `Unexpected token` | `}` a menos ou a mais, ou algo antes do `else` | Formatar Documento e olhar o recuo |
| `Pessoas na mesa: null` | `pessoas = null`, com um `=` só | `===` |

---

## :icon[milestone] Projeto 1 · Etapa 7 pronta

- `npm test` passa com **33 testes**
- O `conta.js` tem `lerPessoas` e o `lerValor` com `null`, sem `console.log` e sem `fs`

| Comando | O que aparece no fim |
|---|---|
| `npm run racha "R$ 100,00" 3` | `Pessoas na mesa: 3`, `Total: R$ 110,00`, `Por pessoa: R$ 36,66` e `Centavos que sobram: 2` |
| `npm run racha abc` | `Valor inválido: "abc". Digite como 187,50 ou "R$ 187,50".` |
| `npm run racha 100 0` | `Número de pessoas inválido: "0". Digite um número inteiro de 1 a 50.` |

Formatar Documento nos três arquivos, e o commit:

```bash
git add .
git commit -m "Projeto 1: etapa 7, entrada inválida"
git push
```

Faltou uma parte? Termine em casa antes do E11, que começa daqui, com o enunciado da página do projeto.

---

## Resumo

:::summary
- `if` e `else`: um caminho ou o outro, nunca os dois; o `else` pega todo o resto
- `else if` faz as perguntas de cima para baixo e para na primeira `true`: a ordem importa
- `&&` pede todas as respostas `true`, `||` pede uma, e `!` inverte; `Number.isInteger` confere se o número é inteiro
- `null` é "nada, de propósito": a função devolve para dizer "não deu", e quem chamou pergunta `=== null`
- Retorno antecipado: cada `if` barra um problema com `return`, e o fim da função cuida de quem passou
- O ternário escolhe um valor numa linha: `pergunta ? sim : não`
:::

---

## :icon[arrow-right] Próximos passos

No E11, o Racha-conta aprende a **repetir**:

- :icon[repeat] o `for...of`, que confere a conta item por item, até acabar
- :icon[calculator] o `somarItens`, que soma os itens em centavos, no lugar do `reduce`
- :icon[users] o `dividirConta`, que dá o centavo que sobra para a primeira pessoa: `Pessoa 1: R$ 51,57`
