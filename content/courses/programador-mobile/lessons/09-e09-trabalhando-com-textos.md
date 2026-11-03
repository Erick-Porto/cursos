---
title: Trabalhando com textos
summary: "O Racha-conta aceita o valor digitado do jeito brasileiro: limpar o texto, converter em número e entender o NaN."
module: linguagem-js
duration_minutes: 90
objectives:
  - Limpar e examinar textos com trim, replace, includes, startsWith, toLowerCase e split
  - Converter texto em número com Number e reconhecer o NaN com Number.isNaN
  - Escrever e testar o lerValor, que transforma o valor digitado em centavos
  - Passar no comando um valor com espaço, vírgula e cifrão, entre aspas
---

# Trabalhando com textos

Programador Mobile · Encontro E09 · Aula 9 de 45

---

## O que você vai aprender

:::goal
- Limpar o texto digitado com `trim` e `replace`
- Converter texto em número com `Number` e reconhecer o `NaN`
- Procurar num texto com `includes` e `startsWith` e quebrar com `split`
- Ensinar o Racha-conta a ler `"R$ 187,50"` e a escrever o real com vírgula
- Mandar no comando um valor com espaço e vírgula, entre aspas
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **método** | uma função que já vem com o valor; você chama com um ponto: `texto.trim()` |
| **converter** | transformar um valor de um tipo em outro: o texto `'4'` no número `4` |
| **`NaN`** | "não é um número" (*Not a Number*): o resultado de uma conta que não deu |
| **encadear** | chamar um método logo depois do outro: `texto.trim().toLowerCase()` |
| **PowerShell** | o terminal do VS Code no Windows, com regras próprias para aspas, vírgula e `$` |

---

## O valor que a pessoa digita

Na mesa, ninguém quer abrir o `conta.json`. A pessoa olha a comanda e digita o total. Hoje, o Racha-conta ignora o que vem no comando:

| Comando | Hoje | No fim do dia |
|---|---|---|
| `npm run racha` | `Subtotal: R$ 187.50` | `Subtotal: R$ 187,50` |
| `npm run racha "R$ 100,00"` | `Subtotal: R$ 187.50` | `Subtotal: R$ 100,00` |

E cada amigo escreve o mesmo valor de um jeito: `R$ 187,50`, `187,5`, `187.50`, às vezes com um espaço sobrando. Todos precisam virar 18750 centavos.

:::question
O que muda entre esses textos? O que o programa precisa tirar ou trocar em cada um?
:::

---

## Limpar o texto

Quando você copia um valor de uma conversa, o que vem junto sem você ver?

---

## :icon[text] trim e replace: limpar o texto

Todo texto, a `string` do E06, já vem com **métodos**: funções prontas que trabalham com ele. Você chama com um ponto, o nome e os parênteses, como o `toFixed(2)` do E04. Dois deles limpam o valor digitado. No REPL:

```plaintext
> '  187,50 '.trim()
'187,50'
> 'R$ 187,50'.replace('R$', '')
' 187,50'
> '187,50'.replace(',', '.')
'187.50'
```

| Método | O que devolve |
|---|---|
| `trim()` ("aparar") | o texto sem os espaços das **pontas**; os do meio ficam |
| `replace(velho, novo)` ("trocar") | o texto com o `velho` trocado pelo `novo`, só na **primeira** vez |
| `replaceAll(velho, novo)` ("trocar todos") | o mesmo, mas troca **todas** as vezes |

Trocar por `''`, o texto vazio, é o jeito de apagar um pedaço.

---

## :icon[copy] O texto original não muda

O método não mexe no texto que já existe. Ele tira uma cópia, mexe na cópia e devolve a cópia, sem rasurar o original. Quem não guarda a cópia perde a limpeza:

```javascript
let limpo = '  187,50 ';
limpo.trim();
console.log(limpo.length);   // 9: os espaços continuam lá

limpo = limpo.trim();
console.log(limpo.length);   // 6
```

| Linha | O que ela diz |
|---|---|
| `let limpo = '  187,50 ';` | a caixa `limpo`, com `let`: o conteúdo vai ser trocado |
| `limpo.trim();` | "faça uma cópia sem os espaços"; ninguém guardou a cópia |
| `limpo = limpo.trim();` | "faça a cópia e guarde na caixa `limpo`": agora sim |

No texto, o **`length`** (comprimento) conta as letras, com os espaços, como contava os itens da lista na aula 3.

---

## :icon[text] Limpar na prática

**Caso 1: o CPF copiado.** O `replace` troca só o primeiro ponto; o `replaceAll`, todos:

```javascript
const cpf = '123.456.789-01';
console.log(cpf.replace('.', ''));      // 123456.789-01
console.log(cpf.replaceAll('.', ''));   // 123456789-01
```

**Caso 2: o espaço que estraga a comparação.** Para o `===`, um espaço a mais já é outro texto:

```javascript
const digitado = ' Bella Nonna ';
console.log(digitado === 'Bella Nonna');          // false
console.log(digitado.trim() === 'Bella Nonna');   // true
```

**Caso 3: o preço do jeito brasileiro.** O JavaScript escreve os centavos depois de um ponto:

```javascript
console.log('72,90'.replace(',', '.'));   // 72.90
```

---

## Texto para número

Quanto dá `'100' + 10`: 110 ou 10010?

---

## :icon[hash] Number: de texto para número

O que chega do terminal é sempre **texto**, mesmo quando parece número: em `npm run racha 100`, o `process.argv[2]` é `'100'`, com aspas. E, com texto, o `+` junta, como no E06:

```plaintext
> '100' + 10
'10010'
> Number('100') + 10
110
```

O **`Number(texto)`** **converte**: lê o texto e devolve o número escrito nele. Ele só entende o jeito do JavaScript, com **ponto** antes dos centavos:

| Texto | `Number(texto)` |
|---|---|
| `'187.50'` | `187.5` |
| `' 42 '` | `42`: os espaços das pontas não atrapalham |
| `'187,50'` | `NaN` |
| `'R$ 187.50'` | `NaN` |

---

## :icon[circle-alert] NaN: não é um número

Quando não entende o texto, o `Number` devolve **`NaN`**, de *Not a Number*, "não é um número". É o visor da calculadora mostrando "Erro": toda conta feita em cima dele continua dando erro.

```plaintext
> Number('abc')
NaN
> NaN * 100 + 5
NaN
> NaN === NaN
false
> Number.isNaN(Number('abc'))
true
```

- Toda conta com `NaN` dá `NaN`: é assim que um valor mal escrito vira `R$ NaN` na tela
- O `NaN` não é igual a nada, nem a ele mesmo: o `===` não serve para reconhecê-lo
- Para perguntar "deu `NaN`?", use **`Number.isNaN(valor)`** (*is NaN*, "é NaN?"): a resposta é `true` ou `false`

---

## :icon[hash] Number na prática

**Caso 1: as pessoas da mesa, digitadas.** Convertido, o texto soma:

```javascript
const pessoas = Number('4');
console.log(pessoas + 1);   // 5, e não 41
```

**Caso 2: o valor com vírgula.** O `replace` roda primeiro, e o texto que ele devolve entra no `Number`:

```javascript
const digitado = '187,50';
console.log(Number(digitado));                     // NaN
console.log(Number(digitado.replace(',', '.')));   // 187.5
```

**Caso 3: conferir antes de usar.**

```javascript
console.log(Number.isNaN(Number('abc')));   // true
console.log(Number.isNaN(Number('12')));    // false
```

Cuidado: `Number('')`, o texto vazio, dá `0`, e não `NaN`. O E10 cuida desse caso.

---

## :icon[milestone] Projeto 1 · Passo 1: lerValor

No fim do `src/regras/conta.js`, a quarta regra. Ela recebe o texto digitado e devolve os centavos, com a `paraCentavos` do E07, que já mora no mesmo arquivo:

```javascript
export function lerValor(texto) {
  let limpo = texto.trim();
  limpo = limpo.replace('R$', '');
  limpo = limpo.trim();
  limpo = limpo.replace(',', '.');
  return paraCentavos(Number(limpo));
}
```

- Cada linha limpa um pouco e guarda o resultado na mesma caixa, `limpo`
- Na última, o `Number` converte primeiro, e o número entra no `paraCentavos`
- É uma regra pura: sem `console.log` e sem `fs`

**Pronto quando:** o arquivo está salvo, e `npm test` continua verde, com `Tests: 11 passed, 11 total`. A regra nova ganha os testes dela no passo 2.

---

## :icon[list-ordered] lerValor, linha por linha

O que a caixa `limpo` guarda depois de cada linha, com dois textos digitados:

| Linha | Com `'R$ 187,50'` | Com `'  187,5 '` |
|---|---|---|
| `let limpo = texto.trim();` | `'R$ 187,50'` | `'187,5'` |
| `limpo = limpo.replace('R$', '');` | `' 187,50'` | `'187,5'` |
| `limpo = limpo.trim();` | `'187,50'` | `'187,5'` |
| `limpo = limpo.replace(',', '.');` | `'187.50'` | `'187.5'` |
| `return paraCentavos(Number(limpo));` | `18750` | `18750` |

- O segundo `trim` tira o espaço que ficou entre o `R$` e o número
- Quando não há o que trocar, o `replace` devolve o texto igual: com `'187'`, sai `18700`

---

## :icon[milestone] Projeto 1 · Passo 2: os testes do lerValor

No `conta.test.js`, o `lerValor` entra no `import` da primeira linha:

```javascript
import { calcularGorjeta, paraCentavos, formatarReais, lerValor } from './conta.js';
```

No fim do arquivo, uma tabela de casos, como a da gorjeta do E08. Cada linha traz um texto digitado e os centavos esperados:

```javascript
test.each([
  ['187,50', 18750],
  ['R$ 187,50', 18750],
  ['R$187,50', 18750],
  ['  187,5 ', 18750],
  ['187.50', 18750],
  ['187', 18700],
])('lerValor("%s") dá %i', (texto, esperado) => {
  expect(lerValor(texto)).toBe(esperado);
});
```

As aspas em volta do `%s`, no nome do teste, deixam ver os espaços: `lerValor("  187,5 ")`.

**Pronto quando:** `npm test` termina com `Tests: 17 passed, 17 total`.

---

## Aspas no terminal

No balcão, "um lanche de frango com queijo" é um pedido ou cinco?

---

## :icon[list] Aspas: um argumento só

Cada **argumento** do comando é um detalhe do pedido, e o **espaço** separa um do outro. As **aspas** juntam tudo num detalhe só, como o `"Maria Souza"` da aula 3.

No **PowerShell**, o terminal do VS Code no Windows, a vírgula e o `$` também pedem cuidado:

| `npm run racha` com | Chega ao script | Por quê |
|---|---|---|
| `"R$ 100,00"` | `R$ 100,00` | certo |
| `187,50` | `187 50` | sem aspas, a vírgula vira espaço |
| `"R$187,50"` | `R,50` | o `$187` vira uma caixa vazia do PowerShell |
| `'R$187,50'` | `R$187,50` | certo: aspas simples protegem o `$` |

Regra do curso: aspas duplas e espaço depois do `R$`. Vale também no Mac.

---

## :icon[list] Aspas na prática

Antes da saída, o npm escreve duas linhas começadas por `>`. A segunda mostra o comando que ele rodou, com o que chegou ao script. Com `npm run racha 187,50`, sem aspas:

```plaintext
> racha-conta@1.0.0 racha
> node src/scripts/racha.js 187 50
```

Ali está `187 50`: a vírgula se perdeu no caminho. Com `npm run racha "187,50"`:

```plaintext
> racha-conta@1.0.0 racha
> node src/scripts/racha.js 187,50
```

- A linha não mostra as aspas, mas o valor chegou inteiro
- Resultado estranho? Leia essa linha primeiro: ela diz o que o script recebeu

---

## :icon[milestone] Projeto 1 · Passo 3: o valor no comando

No `racha.js`, o `lerValor` entra no `import`:

```javascript
import { paraCentavos, calcularGorjeta, formatarReais, lerValor } from '../regras/conta.js';
```

A linha do `subtotalCentavos` vira um `let` com um `if`, como o frete da aula 3:

```javascript
let subtotalCentavos = paraCentavos(subtotal);
if (process.argv[2]) {
  subtotalCentavos = lerValor(process.argv[2]);
}
```

O resto do script não muda. Rode sem valor e com valor:

```bash
npm run racha
npm run racha "R$ 100,00"
```

**Pronto quando:** sem valor, a saída é a de sempre; com `"R$ 100,00"`, ela termina com `Subtotal: R$ 100.00`, `Gorjeta (10%): R$ 10.00` e `Total: R$ 110.00`.

---

## :icon[list-ordered] O valor no comando em português

| Linha | O que ela diz |
|---|---|
| `let subtotalCentavos = paraCentavos(subtotal);` | "comece com o subtotal dos itens"; `let`, porque pode ser trocado |
| `if (process.argv[2]) {` | "se veio um valor no comando..." |
| `subtotalCentavos = lerValor(process.argv[2]);` | "...troque pelo valor digitado, em centavos" |

- A gorjeta, o total e as linhas usam o `subtotalCentavos`, venha de onde vier
- Os itens continuam os do `conta.json`: o valor digitado troca só o subtotal
- O dinheiro ainda sai com ponto, `R$ 100.00`: a vírgula é a Sua vez

Com `npm run racha abc`, sai `R$ NaN`: `Number('abc')` dá `NaN`, e as contas também. No E10, um aviso entra no lugar.

---

## Procurar no texto

Você digita PIZZA na busca do delivery. O app acha a "Pizza grande calabresa"?

---

## :icon[search-check] includes e startsWith: perguntas ao texto

Dois métodos fazem perguntas de sim ou não ao texto, como as comparações da aula 3, e respondem `true` ou `false`:

```plaintext
> 'Pizza grande calabresa'.includes('calabresa')
true
> 'Pizza grande calabresa'.includes('Calabresa')
false
> 'R$ 187,50'.startsWith('R$')
true
> '187,50'.startsWith('R$')
false
```

| Método | A pergunta |
|---|---|
| `includes(trecho)` ("inclui") | "o trecho aparece em algum lugar do texto?" É o <kbd>Ctrl</kbd> + <kbd>F</kbd> do texto |
| `startsWith(trecho)` ("começa com") | "o texto começa com este trecho?" |

Maiúscula conta: para o JavaScript, `'C'` e `'c'` são letras diferentes.

---

## :icon[text] Maiúsculas e minúsculas

Para a busca não depender de como a pessoa digitou, dois métodos devolvem o texto todo de um jeito só:

```plaintext
> 'Pizza Grande'.toUpperCase()
'PIZZA GRANDE'
> 'Pizza Grande'.toLowerCase()
'pizza grande'
> 'PIZZA'.toLowerCase() === 'pizza'
true
```

- **`toUpperCase`** (*upper case*, "caixa alta") põe tudo em maiúsculas; **`toLowerCase`** (*lower case*, "caixa baixa"), em minúsculas
- Para comparar sem ligar para maiúsculas, ponha **os dois lados** em minúsculas
- Um método pode vir logo depois do outro. Em `texto.toLowerCase().includes('pizza')`, o `includes` pergunta ao texto que o `toLowerCase` devolveu: é o **encadeamento**

---

## :icon[search-check] Procurar na prática

**Caso 1: a busca nos itens.** A peneira do `filter`, da aula 3, com o `includes` no teste:

```javascript
const itens = [
  'Pizza grande marguerita',
  'Pizza grande calabresa',
  'Refrigerante 2 litros',
  'Petit gâteau',
];
const busca = 'PIZZA'.toLowerCase();
const achados = itens.filter((descricao) => descricao.toLowerCase().includes(busca));
console.log(achados.length);   // 2
```

**Caso 2: o telefone é do Brasil?** Todo número do Brasil começa com `+55`:

```javascript
console.log('+55 11 98765-4321'.startsWith('+55'));   // true
console.log('+1 305 555 0100'.startsWith('+55'));     // false
```

---

## :icon[funnel] A busca, item por item

O teste pergunta a cada descrição, já em minúsculas: "o trecho `'pizza'` aparece em você?"

| `descricao` | Em minúsculas | `.includes('pizza')` | Fica? |
|---|---|---|---|
| Pizza grande marguerita | `'pizza grande marguerita'` | `true` | sim |
| Pizza grande calabresa | `'pizza grande calabresa'` | `true` | sim |
| Refrigerante 2 litros | `'refrigerante 2 litros'` | `false` | não |
| Petit gâteau | `'petit gâteau'` | `false` | não |

A lista nova, `achados`, fica com as duas pizzas. Sem o `toLowerCase` nos dois lados, a busca voltaria vazia: `'Pizza grande marguerita'.includes('PIZZA')` dá `false`.

---

## Quebrar o texto

Como separar o nome de cada amigo em "Ana, Bruno, Carla"?

---

## :icon[layout-list] split: o texto em pedaços

O **`split(separador)`** ("dividir") quebra o texto em cada lugar onde aparece o separador, como a barra de chocolate que parte nos sulcos. Os pedaços vão para uma **lista**, a fileira de gavetas numeradas a partir do 0:

```plaintext
> 'Ana Souza'.split(' ')
[ 'Ana', 'Souza' ]
> 'Ana Souza'.split(' ')[0]
'Ana'
> '187.50'.split('.')
[ '187', '50' ]
> '187'.split('.')
[ '187' ]
```

- O separador some: não fica em nenhum pedaço
- Cada pedaço é um texto: `'50'`, com aspas
- Sem o separador no texto, a lista tem um pedaço só

---

## :icon[layout-list] split na prática

**Caso 1: os nomes da mesa.** O separador pode ter mais de uma letra, como a vírgula com o espaço:

```javascript
const nomes = 'Ana, Bruno, Carla, Davi'.split(', ');
console.log(nomes.length);   // 4
console.log(nomes[1]);       // Bruno
```

**Caso 2: os centavos de um valor.** Com o ponto de separador, a gaveta 0 guarda os reais, e a 1, os centavos:

```javascript
const partes = '187.505'.split('.');
console.log(partes[0]);          // 187
console.log(partes[1].length);   // 3: casas demais para dinheiro
```

O `.length` de um pedaço conta as letras dele. No E10, o `lerValor` usa essa conta para recusar um valor com mais de duas casas.

---

## :icon[milestone] Projeto 1 · Sua vez: a vírgula do real

Agora, sozinho. O `formatarReais` passa a escrever o dinheiro como no Brasil, com vírgula:

| Chamada | Hoje | Depois |
|---|---|---|
| `formatarReais(18750)` | `'R$ 187.50'` | `'R$ 187,50'` |
| `formatarReais(5)` | `'R$ 0.05'` | `'R$ 0,05'` |

1. Primeiro, mude os dois testes do `formatarReais` no `conta.test.js`, rode `npm test` e veja o vermelho
2. Depois, mude a função até ficar verde

:::tip Dicas
- O `toFixed(2)` devolve um texto com ponto: `'187.50'`
- O `replace` troca o ponto pela vírgula
- No vermelho, o Jest mostra `Expected: "R$ 187,50"` e `Received: "R$ 187.50"`
:::

**Pronto quando:** `npm test` passa com 17 testes, e `npm run racha "R$ 100,00"` mostra `Subtotal: R$ 100,00`.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Cannot read properties of undefined (reading 'trim')` | o `lerValor` ficou fora do `if` e recebeu `undefined` | a linha vai dentro do `if` |
| `Received: NaN` no teste | o `Number` recebeu a vírgula, ou um `replace` não foi guardado | `limpo = limpo.replace(...)` |
| `Assignment to constant variable` | `const limpo`, a caixa lacrada | `let limpo` |
| `(0 , _conta.lerValor) is not a function` | faltou o `export` ou o `import` | `export function lerValor` e o nome no `import` |
| `187 50` ou `R,50` na linha do `>` | faltaram as aspas certas no comando | `npm run racha "R$ 187,50"` |

---

## :icon[milestone] Projeto 1 · Etapa 6 pronta

- `src/regras/conta.js` tem o `lerValor` e o `formatarReais` com vírgula, sem `console.log` e sem `fs`
- `npm test` termina com `Tests: 17 passed, 17 total`
- `npm run racha` termina com `Subtotal: R$ 187,50` e `Por pessoa: R$ 51,56`
- `npm run racha "R$ 100,00"` termina com:

```plaintext
Subtotal: R$ 100,00
Gorjeta (10%): R$ 10,00
Total: R$ 110,00
Por pessoa: R$ 27,50
Centavos que sobram: 0
```

```bash
git add .
git commit -m "Projeto 1: etapa 6, o valor digitado"
git push
```

Com `npm run racha abc`, ainda sai `R$ NaN`: o E10 resolve. Se faltar alguma parte, termine em casa: o E10 começa com o `lerValor` pronto.

---

## Resumo

:::summary
- Métodos de texto devolvem um texto novo e não mudam o original: guarde o resultado, como em `limpo = limpo.trim()`
- `trim` tira os espaços das pontas; `replace` troca a primeira vez, e `replaceAll`, todas
- `includes` e `startsWith` respondem `true` ou `false`; `toLowerCase` e `toUpperCase` deixam o texto todo num jeito só
- `split` quebra o texto numa lista de pedaços; `length` conta as letras
- `Number` converte texto em número; o que ele não entende vira `NaN`, reconhecido com `Number.isNaN`
- No PowerShell, o valor vai entre aspas duplas, com espaço: `npm run racha "R$ 100,00"`
:::

---

## :icon[arrow-right] Próximos passos

No E10, o Racha-conta aprende a **decidir**:

- :icon[split] `if` e `else`: um caminho quando o valor vale, outro quando não vale
- :icon[circle-x] `lerValor('abc')` devolve `null`, e o script mostra um aviso no lugar de `R$ NaN`
- :icon[users] o número de pessoas também vem do comando: `npm run racha "R$ 100,00" 3`
