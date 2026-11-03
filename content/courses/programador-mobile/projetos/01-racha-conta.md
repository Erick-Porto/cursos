---
title: "Projeto 1 · Racha-conta"
summary: Divida a conta do restaurante entre as pessoas da mesa, no terminal e no navegador, em centavos e com testes, sem perder nenhum centavo.
section: Módulo Básico
module: linguagem-js
opens: e04-npm-e-o-racha-conta
due: e13-objetos
due_label: início do E13
passing_score: 70
required: true
rubric:
  - key: regras
    title: Regras da conta
    points: 35
    description: "As funções de src/regras/conta.js têm os nomes do enunciado e dão o resultado das tabelas das Regras, em centavos: gorjeta arredondada (10% por padrão), divisão que sempre fecha com a sobra nas primeiras pessoas, valor e pessoas digitados (null no que não vale), data e hora e recibo."
  - key: testes
    title: Testes
    points: 20
    description: "`npm test` verde, com testes de cada função e das bordas: gorjeta de 0%, sobra de centavos, uma pessoa, lista vazia, valores e pessoas que não valem e data fixa, nunca a de hoje."
  - key: terminal-e-web
    title: Recibo no terminal e interface web
    points: 20
    description: "`npm run racha` imprime o recibo da conta de exemplo; `npm run racha \"R$ 100,00\" 3` imprime o recibo desse valor para 3 pessoas; um valor ou um número de pessoas que não vale mostra um aviso, sem erro do Node. A interface web em web/ divide a conta com as suas funções."
  - key: qualidade
    title: Qualidade do código
    points: 10
    description: "Formatar Documento do VS Code aplicado: recuo e espaços em ordem. Regras puras em src/regras/, sem console.log e sem fs; quem lê o arquivo e imprime é o script. Nomes que dizem o que guardam."
  - key: entrega
    title: Repositório, commits e README
    points: 15
    description: "Repositório público racha-conta no GitHub, sem node_modules, com os commits das etapas 1 a 9, cada um com o nome da etapa, e um README que explica o projeto e como rodar no terminal e na web, com um print da interface."
steps:
  - lesson: e04-npm-e-o-racha-conta
    when: E04
    title: Projeto npm e a conta no terminal
    summary: "package.json com type module, picocolors, src/data/conta.json e npm run racha mostrando os itens e o subtotal."
  - lesson: e05-git-e-github
    when: E05
    title: GitHub e README
    summary: "Repositório público racha-conta com .gitignore, os commits das etapas 1 e 2 e um README com como rodar e o que ele mostra."
  - lesson: e06-numeros-textos-e-dinheiro
    when: E06
    title: Centavos, gorjeta e total
    summary: "Subtotal, gorjeta e total em centavos no racha.js, com template string, mais a parte de cada pessoa e os centavos que sobram."
  - lesson: e07-funcoes
    when: E07
    title: As primeiras regras
    summary: "src/regras/conta.js com paraCentavos, calcularGorjeta e formatarReais, usadas pelo racha.js, e o Formatar Documento."
  - lesson: e08-testes-com-jest
    when: E08
    title: Os primeiros testes
    summary: "Jest e Babel, conta.test.js com test.each para calcularGorjeta, paraCentavos e formatarReais, e o vermelho antes do verde."
  - lesson: e09-trabalhando-com-textos
    when: E09
    title: O valor digitado
    summary: "lerValor aceita R$ 187,50, 187,5 e 187.50; npm run racha com o valor no comando; formatarReais com vírgula."
  - lesson: e10-decisoes
    when: E10
    title: Entrada inválida
    summary: "lerPessoas e o null do lerValor, com testes; o racha.js aceita valor e pessoas e avisa quando um deles não vale."
  - lesson: e11-repeticoes
    when: E11
    title: Somar e dividir
    summary: "somarItens com for...of e dividirConta com for e if, com testes; o racha.js mostra a parte de cada pessoa."
  - lesson: e12-datas-recibo-e-pagina-web
    when: E12
    title: Recibo e página web
    summary: "formatarDataHora e montarRecibo com data fixa nos testes, o recibo no terminal, a interface web ligada, README com print e entrega."
---

## O que você vai construir

Fim do jantar, a conta chega: R$ 187,50, mais 10% de gorjeta, para 4 pessoas. Alguém abre a calculadora, divide e diz "dá 51,5625". Ninguém paga 51,5625. Se todo mundo arredonda para 51,56, falta um centavo; se arredonda para 51,57, sobram três. O **racha-conta** resolve isso: soma os itens, calcula a gorjeta e divide o total em partes que **sempre fecham a conta**, com o centavo que sobra na primeira pessoa.

Você constrói o projeto do E04 ao E12, em 9 etapas, uma por encontro. A etapa **é a prática da aula**: você faz a maior parte junto com o instrutor e termina sozinho, no fim do encontro, a parte "Sua vez". Cada etapa usa só o que a aula dela ensinou. No fim, o mesmo código roda em três lugares: nos testes do Jest, no terminal e numa página web.

No terminal, `npm run racha` lê a conta de exemplo e imprime o recibo:

```plaintext
Racha-conta
Cantina Bella Nonna
28/10/2026 19:42
Subtotal: R$ 187,50
Gorjeta (10%): R$ 18,75
Total: R$ 206,25
Pessoa 1: R$ 51,57
Pessoa 2: R$ 51,56
Pessoa 3: R$ 51,56
Pessoa 4: R$ 51,56
```

No navegador, a **interface web pronta** do curso mostra um formulário (restaurante, valor da conta, pessoas e gorjeta), a parte de cada pessoa, a conferência "as partes somam o total" e o recibo para copiar. A página não faz conta nenhuma: ela importa as **suas** funções de `src/regras/conta.js`. Por isso os nomes e os parâmetros abaixo são combinados e não podem mudar.

O repositório, no fim:

```plaintext
racha-conta/
├── src/
│   ├── data/conta.json        a conta de exemplo
│   ├── regras/conta.js        as regras, puras e testadas
│   ├── regras/conta.test.js   os testes
│   └── scripts/racha.js       o recibo no terminal
├── web/                       a interface pronta do curso (E12)
├── docs/interface.png         o print do README (E12)
├── babel.config.json
├── package.json, package-lock.json, .gitignore
└── README.md
```

O projeto é individual e é **seu**: um repositório próprio, na pasta de projetos, ao lado do `lojinha-regras` da aula 3 e nunca dentro dele.

## As funções combinadas

Todas ficam em `src/regras/conta.js`, com `export`. Dinheiro entra e sai em **centavos inteiros**. Reais só aparecem nos preços do `conta.json` (que `paraCentavos` e `somarItens` convertem), no que alguém digita (`lerValor`) e na hora de mostrar (`formatarReais`).

| Função | Devolve | Etapa |
|---|---|---|
| `paraCentavos(reais)` | os centavos de um valor em reais | E07 |
| `calcularGorjeta(subtotal, percentual = 10)` | a gorjeta, em centavos | E07 |
| `formatarReais(centavos)` | o texto em reais: `'R$ 187.50'` no E07, `'R$ 187,50'` a partir do E09 | E07, muda no E09 |
| `lerValor(texto)` | os centavos do valor digitado; a partir do E10, `null` se o texto não vale | E09, muda no E10 |
| `lerPessoas(texto)` | o número de pessoas, de 1 a 50, ou `null` | E10 |
| `somarItens(itens)` | a soma dos itens, em centavos | E11 |
| `dividirConta(total, pessoas)` | uma lista com a parte de cada pessoa, em centavos | E11 |
| `formatarDataHora(data)` | o texto `'28/10/2026 19:42'` | E12 |
| `montarRecibo(dados)` | o recibo inteiro, num texto com uma linha por informação | E12 |

Exemplos de uso, que viram testes:

```javascript
paraCentavos(72.9); // 7290
calcularGorjeta(18750, 10); // 1875
calcularGorjeta(18750); // 1875: sem o percentual, 10%
formatarReais(18750); // 'R$ 187,50'
lerValor('R$ 187,50'); // 18750
lerValor('abc'); // null
lerPessoas('4'); // 4
dividirConta(10000, 3); // [3334, 3333, 3333]
formatarDataHora(new Date(2026, 9, 28, 19, 42)); // '28/10/2026 19:42'
```

A interface web usa sete delas: `lerValor`, `lerPessoas`, `calcularGorjeta`, `dividirConta`, `formatarReais`, `formatarDataHora` e `montarRecibo`. Com um nome diferente, mesmo numa letra, a página avisa que não encontrou a função.

## Regras

### Dinheiro em centavos

O `number` do JavaScript não guarda todo decimal com exatidão (E06): `0.1 + 0.2` dá `0.30000000000000004`, e 15% de R$ 33,30 em reais dá `4.994999999999999`, que arredonda para o lado errado. Em centavos, a conta é exata. Converta uma vez, na entrada, com `Math.round(reais * 100)`.

### Gorjeta

A gorjeta é um percentual do subtotal, **10% por padrão**, e pode ser zero ("sem gorjeta"). O resultado é arredondado ao centavo com `Math.round`, e o meio centavo sobe:

| Subtotal | Percentual | Gorjeta |
|---|---|---|
| R$ 187,50 | 10 | R$ 18,75 |
| R$ 33,30 | 15 | R$ 5,00 (a conta exata é 4,995) |
| R$ 187,55 | 10 | R$ 18,76 (18,755 sobe) |
| R$ 80,00 | 0 | R$ 0,00 |

O total da conta é o subtotal mais a gorjeta.

### Divisão que sempre fecha

Cada pessoa paga a parte inteira da divisão, em centavos. Os centavos que **sobram** vão, um a um, para as **primeiras** pessoas. Assim as partes diferem em no máximo 1 centavo e a soma é sempre o total.

| Total | Pessoas | Partes |
|---|---|---|
| R$ 100,00 | 3 | 33,34 + 33,33 + 33,33 |
| R$ 206,25 | 4 | 51,57 + 51,56 + 51,56 + 51,56 |
| R$ 110,00 | 3 | 36,67 + 36,67 + 36,66 |
| R$ 90,00 | 1 | 90,00 |
| R$ 0,02 | 3 | 0,01 + 0,01 + 0,00 |

### O que a pessoa digita

O valor da conta chega como texto, do jeito que se escreve no Brasil. `lerValor` devolve os centavos ou, a partir do E10, `null`:

| Aceita | Vira | Recusa (`null`) |
|---|---|---|
| `'187,50'` | 18750 | `''` (vazio) e `'abc'` |
| `'R$ 187,50'` e `'R$187,50'` | 18750 | `'0'` e `'0,00'`: a conta precisa ser positiva |
| `'  187,5 '`, com espaços | 18750 | `'-10'` |
| `'187.50'`, com ponto | 18750 | `'187,505'`: mais de duas casas |
| `'187'` | 18700 | `'1.250,00'`: milhar com ponto (veja "Para ir além") |

As casas depois da vírgula são conferidas **no texto**, com `split('.')`, e não multiplicando por 100: `72.9 * 100` dá `7290.000000000001`.

O número de pessoas também chega como texto. `lerPessoas` aceita um **inteiro de 1 a 50** (`'4'`, `' 4 '`, `'1'`, `'50'`) e devolve `null` para o resto (`''`, `'0'`, `'51'`, `'2,5'`, `'-3'`, `'três'`).

### Recibo

`montarRecibo(dados)` recebe um objeto com cinco campos, os mesmos que a interface web envia:

| Campo | O que guarda | Exemplo |
|---|---|---|
| `restaurante` | o nome do restaurante | `'Cantina Bella Nonna'` |
| `subtotal` | o subtotal, em centavos | `18750` |
| `percentual` | o percentual da gorjeta | `10` |
| `pessoas` | quantas pessoas dividem | `4` |
| `data` | a data e a hora do recibo | `new Date(2026, 9, 28, 19, 42)` |

O recibo tem uma linha por informação, nesta ordem: o restaurante, a data e a hora (`'28/10/2026 19:42'`, com zero à esquerda: `'05/03/2026 09:07'`), `Subtotal: R$ 187,50`, `Gorjeta (10%): R$ 18,75`, `Total: R$ 206,25` e uma linha por pessoa, `Pessoa 1: R$ 51,57`. A função calcula a gorjeta, o total e as partes com as outras regras e **devolve** o texto; quem imprime é o script. A data entra por parâmetro: o script passa `new Date()`, e o teste passa uma data fixa.

## Etapas

Cada etapa começa onde a anterior terminou e termina com um **commit** cujo nome é `Projeto 1: etapa N, nome da etapa`. Pode haver outros commits no meio; o da etapa marca o ponto em que ela ficou pronta. A etapa 1 não tem Git ainda: o commit dela é o primeiro do E05. Do E05 em diante, cada commit de etapa vai para o GitHub com `git push`.

Os passos "Juntos em aula" têm o código completo nos slides da aula do encontro. Quem faltou faz a etapa pelos slides e por este enunciado. Os "Sua vez" você faz sozinho; os slides trazem o enunciado e as dicas, sem a resposta.

### Etapa 1 · E04: projeto npm e a conta no terminal

**Juntos em aula:**

1. Crie a pasta `racha-conta` na pasta de projetos, ao lado do `lojinha-regras`, e abra no VS Code (`code .`). Dentro dela, `src/data/conta.json` com a conta abaixo
2. Crie `src/scripts/racha.js`: ele lê o JSON com `fs.readFileSync` e `JSON.parse` e mostra o restaurante, as pessoas, quantos itens a conta tem e a tabela dos itens, com `console.table`
3. O subtotal, somado com `reduce` (preço vezes quantidade), na última linha: `Subtotal: R$ 187.50`, com `toFixed(2)`
4. `npm init -y`; no `package.json`, troque o `"type"` para `"module"` e escreva a `description`: `"Divide a conta do restaurante sem perder nenhum centavo"`
5. No `package.json`, o script `"racha": "node src/scripts/racha.js"`
6. `npm install picocolors` e o título `Racha-conta:` em negrito, com `pc.bold`

```json
{
  "restaurante": "Cantina Bella Nonna",
  "pessoas": 4,
  "gorjeta": 10,
  "itens": [
    { "descricao": "Pizza grande marguerita", "quantidade": 1, "preco": 72.9 },
    { "descricao": "Pizza grande calabresa", "quantidade": 1, "preco": 68.9 },
    { "descricao": "Refrigerante 2 litros", "quantidade": 2, "preco": 14.5 },
    { "descricao": "Petit gâteau", "quantidade": 1, "preco": 16.7 }
  ]
}
```

A conta fica esta, a da Cantina, em todas as etapas: as saídas do "Pronto quando" de cada encontro valem para todos.

**Sua vez:** duas linhas novas no fim do que o script mostra. `Unidades pedidas: 5`, somando as quantidades dos itens com outro `reduce`, e `Itens acima de R$ 50: 2`, com um `filter` que fica com os itens de preço maior que 50 e o `.length` da lista nova. Os dois são da aula 3.

**Pronto quando** `npm run racha` mostra:

```plaintext
Racha-conta: Cantina Bella Nonna
Pessoas na mesa: 4
Itens na conta: 4
┌─────────┬───────────────────────────┬────────────┬───────┐
│ (index) │ descricao                 │ quantidade │ preco │
├─────────┼───────────────────────────┼────────────┼───────┤
│ 0       │ 'Pizza grande marguerita' │ 1          │ 72.9  │
│ 1       │ 'Pizza grande calabresa'  │ 1          │ 68.9  │
│ 2       │ 'Refrigerante 2 litros'   │ 2          │ 14.5  │
│ 3       │ 'Petit gâteau'            │ 1          │ 16.7  │
└─────────┴───────────────────────────┴────────────┴───────┘
Subtotal: R$ 187.50
Unidades pedidas: 5
Itens acima de R$ 50: 2
```

**Commit:** ainda não há Git. Guarde a pasta: o commit desta etapa é o primeiro do E05.

### Etapa 2 · E05: GitHub e README

**Juntos em aula:**

1. Confira o Git: `git config --global user.name` mostra o seu nome. Se não mostrar, configure nome, e-mail e o ramo `main`, como no E01
2. Na pasta `racha-conta`: `git init` e um `.gitignore` com a linha `node_modules/`
3. `git add .` e o commit `Projeto 1: etapa 1, a conta no terminal`
4. No GitHub, o repositório **público** `racha-conta`, sem README. Copie as três linhas que o GitHub mostra: `git remote add origin ...`, `git branch -M main` e `git push -u origin main`
5. Crie o `README.md` com o título, uma frase sobre o projeto e a seção "Como rodar", com `npm install` e `npm run racha` num bloco de código
6. Commit `Projeto 1: etapa 2, GitHub e README` e `git push`

**Sua vez:** no README, a seção "O que ele mostra", com a saída do `npm run racha` num bloco de código. Commit com uma mensagem que diga o que mudou, `git push` e, no GitHub, confira o histórico de commits.

**Pronto quando** o repositório abre no GitHub sem a pasta `node_modules/`, com o `package-lock.json`, o README com as duas seções e os commits das etapas 1 e 2.

### Etapa 3 · E06: centavos, gorjeta e total

**Juntos em aula:**

1. No `racha.js`, o subtotal em centavos: `Math.round(subtotal * 100)`
2. A gorjeta em centavos, com o percentual de `conta.gorjeta`, arredondada com `Math.round`, e o total, que é o subtotal mais a gorjeta
3. A linha antiga do subtotal sai. No fim do script, três linhas com template string, os valores em reais com `(centavos / 100).toFixed(2)`: `Subtotal: R$ 187.50`, `Gorjeta (10%): R$ 18.75` e `Total: R$ 206.25`

**Sua vez:** a parte de cada pessoa, sem os centavos que sobram, com `Math.floor`, e quantos centavos sobram da divisão, com o `%`. Duas linhas no fim: `Por pessoa: R$ 51.56` e `Centavos que sobram: 1`. O E11 resolve para onde vai esse centavo.

**Pronto quando** `npm run racha` termina com:

```plaintext
Unidades pedidas: 5
Itens acima de R$ 50: 2
Subtotal: R$ 187.50
Gorjeta (10%): R$ 18.75
Total: R$ 206.25
Por pessoa: R$ 51.56
Centavos que sobram: 1
```

**Commit:** `Projeto 1: etapa 3, centavos, gorjeta e total` e `git push`.

### Etapa 4 · E07: as primeiras regras

**Juntos em aula:**

1. Crie `src/regras/conta.js` com `export function paraCentavos(reais)`, que devolve os centavos com `Math.round`
2. No `racha.js`, importe de `'../regras/conta.js'` e troque o `Math.round(subtotal * 100)` pela chamada da função
3. `export function calcularGorjeta(subtotal, percentual = 10)`, em centavos, com `Math.round`; o `racha.js` passa a usá-la
4. **Formatar Documento**: <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>F</kbd> no `conta.js` e no `racha.js`. Na primeira vez, o VS Code pergunta qual formatador usar: escolha **TypeScript and JavaScript Language Features**, o que já vem com ele

**Sua vez:** `export function formatarReais(centavos)`, que devolve o texto `'R$ 187.50'`, montado com template string. Depois, troque as linhas de Subtotal, Gorjeta, Total e Por pessoa do script para usarem `formatarReais`. A vírgula do real chega no E09.

**Pronto quando** `npm run racha` mostra a mesma saída da etapa 3, o `conta.js` tem as três funções, sem `console.log` e sem `fs`, e os dois arquivos estão formatados.

**Commit:** `Projeto 1: etapa 4, as primeiras regras` e `git push`.

### Etapa 5 · E08: os primeiros testes

**Juntos em aula:**

1. `npm i -D jest babel-jest @babel/preset-env@7`. O `@7` escolhe a versão do Babel que combina com o Jest e evita uma lista de avisos na instalação
2. Na raiz, o `babel.config.json` com `{ "presets": [["@babel/preset-env", { "targets": { "node": "current" } }]] }`. No `package.json`, o script `"test": "jest"`
3. `src/regras/conta.test.js` com o primeiro teste: `calcularGorjeta(18750, 10)` dá `1875`. `npm test`: verde
4. Quebre a função de propósito (troque o `100` por `10`), rode e leia o vermelho: `Expected: 1875`, `Received: 18750`. Conserte
5. Um `test.each` com a tabela da gorjeta (18750 e 10 dão 1875; 3330 e 15 dão 500; 18755 e 10 dão 1876; 8000 e 0 dão 0) e um teste sem o percentual: `calcularGorjeta(18750)` dá `1875`

**Sua vez:** os testes de `paraCentavos` (`187.5` dá `18750`, `72.9` dá `7290` e `0.1 + 0.2` dá `30`) e de `formatarReais` (`18750` dá `'R$ 187.50'` e `5` dá `'R$ 0.05'`).

**Pronto quando** `npm test` termina com `Tests: 11 passed, 11 total`.

**Commit:** `Projeto 1: etapa 5, os primeiros testes` e `git push`.

### Etapa 6 · E09: o valor digitado

**Juntos em aula:**

1. `export function lerValor(texto)`, primeira versão: tira os espaços das pontas com `trim`, tira o `R$` com `replace`, tira os espaços de novo, troca a vírgula por ponto, converte com `Number` e devolve os centavos com `paraCentavos`
2. Um `test.each` com os textos aceitos: `'187,50'`, `'R$ 187,50'`, `'R$187,50'` e `'  187,5 '` dão `18750`; `'187.50'` dá `18750`; `'187'` dá `18700`
3. No `racha.js`, o valor pode vir do comando: se veio um argumento (`process.argv[2]`), o subtotal é o `lerValor` dele, com o `if` da aula 3

**Sua vez:** a vírgula do real no `formatarReais`, com `replace`: `'R$ 187,50'`. Primeiro mude os testes de `formatarReais` para `'R$ 187,50'` e `'R$ 0,05'` e veja o vermelho; depois mude a função.

**Pronto quando** `npm test` passa com 17 testes e `npm run racha "R$ 100,00"` termina com `Subtotal: R$ 100,00`, `Gorjeta (10%): R$ 10,00`, `Total: R$ 110,00`, `Por pessoa: R$ 27,50` e `Centavos que sobram: 0`. Com `npm run racha abc` ainda sai `R$ NaN`: o E10 resolve.

**Commit:** `Projeto 1: etapa 6, o valor digitado` e `git push`.

### Etapa 7 · E10: entrada inválida

**Juntos em aula:**

1. `export function lerPessoas(texto)`: converte com `Number(texto.trim())` e devolve o número se ele for inteiro (`Number.isInteger`) e estiver de 1 a 50; senão, `null`
2. Os testes de `lerPessoas`: os quatro aceitos e os seis recusados da tabela "O que a pessoa digita"
3. No `racha.js`, as pessoas também podem vir do comando (`process.argv[3]`). Se `lerPessoas` devolveu `null`, o script mostra um aviso no lugar do recibo, com `if` e `else`

**Sua vez:** `lerValor` devolve `null` para vazio, `'abc'`, zero, negativo e mais de duas casas, com retornos antecipados e as casas conferidas com `split('.')`. Escreva os testes dos seis recusados antes e veja o vermelho. Depois, o aviso de valor inválido no `racha.js`, com `else if`.

**Pronto quando** `npm test` passa com 33 testes e:

| Comando | O que aparece no fim |
|---|---|
| `npm run racha "R$ 100,00" 3` | `Pessoas na mesa: 3`, total R$ 110,00, `Por pessoa: R$ 36,66` e `Centavos que sobram: 2` |
| `npm run racha abc` | `Valor inválido: "abc". Digite como 187,50 ou "R$ 187,50".` |
| `npm run racha 100 0` | `Número de pessoas inválido: "0". Digite um número inteiro de 1 a 50.` |

**Commit:** `Projeto 1: etapa 7, entrada inválida` e `git push`.

### Etapa 8 · E11: somar e dividir

**Juntos em aula:**

1. `export function somarItens(itens)`: um `for...of` com acumulador soma, item por item, o preço em centavos vezes a quantidade. A conta de exemplo dá `18750`; a lista vazia dá `0`. Dois testes
2. `export function dividirConta(total, pessoas)`: a parte inteira com `Math.floor`, a sobra com `%`, e um `for` com índice que faz `push` de uma parte por pessoa; um `if` decide quem leva um centavo a mais
3. No `racha.js`, `somarItens` substitui o `reduce` do subtotal, e um `for` imprime `Pessoa 1: R$ 51,57` e as outras, no lugar de Por pessoa e Centavos que sobram

**Sua vez:** os testes de `dividirConta` com a tabela "Divisão que sempre fecha", num `test.each` com `toEqual`, e um teste que soma as partes de `dividirConta(20625, 4)` e confere que dá o total.

**Pronto quando** `npm test` passa com 41 testes, `npm run racha` termina com `Pessoa 1: R$ 51,57` e três `R$ 51,56`, e `npm run racha "R$ 100,00" 3` termina com 36,67, 36,67 e 36,66.

**Commit:** `Projeto 1: etapa 8, somar e dividir` e `git push`.

### Etapa 9 · E12: recibo e página web

**Juntos em aula:**

1. `export function formatarDataHora(data)`: dia, mês, ano, hora e minuto com `getDate`, `getMonth`, `getFullYear`, `getHours` e `getMinutes`, o mês com `+ 1` (ele começa em 0) e o zero à esquerda com `padStart`. Dois testes com data fixa: `new Date(2026, 9, 28, 19, 42)` dá `'28/10/2026 19:42'` e `new Date(2026, 2, 5, 9, 7)` dá `'05/03/2026 09:07'`
2. `export function montarRecibo(dados)`, pura: calcula gorjeta, total e partes, monta as linhas numa lista com `push` e junta com `join('\n')`
3. O `racha.js` final: lê a conta, decide o subtotal e as pessoas, avisa se um deles não vale e, senão, imprime o título e o recibo. As linhas de itens, unidades e itens acima de R$ 50 saem: o recibo ocupa o lugar delas
4. A interface web, como na seção abaixo

**Sua vez:**

1. O teste de `montarRecibo` com a conta de exemplo e a data fixa de 28/10/2026 19:42, conferindo as 9 linhas do recibo
2. O print da interface com a conta dividida, salvo como `docs/interface.png` (a pasta `docs` fica na raiz do repositório)
3. No README: o print logo abaixo da frase do começo, a seção "Como rodar na web" e a saída nova em "O que ele mostra"
4. Commit, `git push` e a entrega, em "Como entregar"

**Pronto quando** `npm test` passa com 44 testes, `npm run racha` imprime o recibo da conta de exemplo com a data e a hora de agora, `npm run racha "R$ 100,00" 3` divide R$ 110,00 em 36,67 + 36,67 + 36,66, `npm run racha abc` mostra o aviso e a página web divide a conta.

**Commit:** `Projeto 1: etapa 9, recibo e página web` e `git push`.

## A interface web

1. Baixe [interface-web.zip](materiais/projeto-1/interface-web.zip) e descompacte. Copie os três arquivos (`index.html`, `estilo.css` e `tela.js`) para uma pasta `web/` na raiz do repositório. Não mude nada neles
2. Na raiz do repositório, `npx serve .`. Na primeira vez, o npm pergunta se pode instalar o `serve`: responda `y`
3. Abra `http://localhost:3000/web/` no navegador
4. A lista "Funções que a página usa" mostra o que foi encontrado. Se uma conta sair errada, a página diz qual função e com qual entrada: escreva um teste com ela e corrija

Aberta com dois cliques no arquivo, a página não funciona: o navegador só importa módulos de um servidor. Para parar o servidor, <kbd>Ctrl</kbd> + <kbd>C</kbd> no terminal. Para o print, <kbd>Win</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd> recorta a tela; salve como `docs/interface.png`.

## Como entregar

1. Repositório **público** `racha-conta` no seu GitHub, com tudo enviado (`git push`)
2. Os commits das etapas, na ordem: `Projeto 1: etapa 1, a conta no terminal` até `Projeto 1: etapa 9, recibo e página web`
3. README com o que o projeto faz, como rodar no terminal e na web e o print da interface (a imagem fica no repositório, em `docs/`)
4. Na página deste projeto, cole o link do repositório (`https://github.com/seu-usuario/racha-conta`) e envie
5. Prazo: **início do E13**

Antes de enviar, rode na raiz, nesta ordem: `npm test`, `npm run racha`, `npm run racha "R$ 100,00" 3` e `npm run racha abc`. Depois, abra a interface web e divida uma conta. O instrutor corrige pela rubrica, critério por critério, e pode devolver o projeto para ajustes antes da nota final. A aprovação é com 70 pontos.

## Como será avaliado

| Critério | Pontos | Nota cheia | Nota parcial |
|---|---|---|---|
| Regras da conta | 35 | todas as tabelas das Regras dão o resultado certo | a divisão perde ou sobra centavo, ou `lerValor` aceita `'abc'` |
| Testes | 20 | um teste por função e as bordas de cada uma | só o caminho feliz, ou um teste que usa a data de hoje |
| Recibo no terminal e interface web | 20 | os comandos do "Pronto quando" da etapa 9 e a página funcionando | o script quebra com argumento que não vale, ou a página avisa que falta uma função |
| Qualidade do código | 10 | código formatado, regras sem `console.log` e sem `fs` | recuo bagunçado, ou a gorjeta calculada dentro do script |
| Repositório, commits e README | 15 | os 9 commits de etapa e README com print | todos os commits num dia só, ou README sem como rodar |

Um critério sem nada entregue vale zero. Código que você não sabe explicar também: o instrutor pode pedir, em aula, que você mostre uma função e diga o que cada linha faz.

## Dúvidas frequentes

**Posso usar a minha própria conta no `conta.json`?** Durante as etapas, não: as saídas do "Pronto quando" usam a da Cantina. Depois da etapa 9, pode (veja "Para ir além"). Os testes não dependem do `conta.json`: cada teste monta os dados de que precisa.

**`npm run racha 187,50` deu `Valor inválido: "187 50"`.** No terminal do VS Code (o PowerShell), a vírgula sem aspas separa o valor em dois. Use aspas: `npm run racha "187,50"`.

**`npm run racha "R$187,50"` deu `R,50`.** No PowerShell, `$187` dentro de aspas duplas vira uma variável vazia. Escreva com o espaço, `"R$ 187,50"`, ou com aspas simples, `'R$187,50'`.

**Com um valor negativo no comando, o npm avisa `Unknown cli config`.** O npm entende o `-10` como uma opção dele e não passa para o script. O negativo se testa no Jest, que chama `lerValor('-10')` direto.

**Na instalação, o npm fala em vulnerabilidades.** São avisos sobre pacotes que o Jest usa por dentro e não afetam o projeto. Não rode `npm audit fix --force`: ele troca o Jest por uma versão antiga.

**O Formatar Documento não fez nada.** Confira se o arquivo está salvo como `.js` e se, na primeira vez, você escolheu um formatador na pergunta do VS Code. Para trocar a escolha: <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>, "Format Document With...".

**Esqueci o commit de uma etapa. E agora?** Faça quando lembrar, com o nome da etapa. O que conta é ter um commit por etapa, na ordem, ao longo das semanas.

**A página diz que não encontrou as funções.** Três causas comuns: a página foi aberta com dois cliques, e não pelo `npx serve .`; o servidor foi aberto dentro de `web/`, e não na raiz; ou o `conta.js` importa o `fs`. As regras não leem arquivos: quem lê o `conta.json` é o script.

**A página diz que falta uma função que eu escrevi.** Confira o nome letra por letra e o `export` antes da função.

**A página mostra "as partes somam R$ 99,99, mas o total é R$ 100,00".** O seu `dividirConta` perdeu a sobra. Escreva o teste de R$ 100,00 para 3 pessoas e corrija até ficar verde.

**Faltei a um encontro.** Faça a etapa pelos slides da aula e por este enunciado antes do encontro seguinte: ele começa onde ela termina.

**Não terminei a tempo.** Entregue o que tiver até o início do E13: o instrutor corrige o que existe e pode devolver para ajustes.

## Para ir além

Nada aqui vale ponto extra. É para quem terminou e quer praticar mais.

- Depois da etapa 9, troque a conta do `conta.json` pela da sua última ida a um restaurante: pelo menos 4 itens, um com quantidade maior que 1. Confira o recibo na calculadora
- A gorjeta pelo comando: `npm run racha "R$ 100,00" 3 15`, com `process.argv[4]`
- O aviso em amarelo no terminal, com `pc.yellow` do `picocolors`
- `lerValor` aceitando milhar com ponto: `'1.250,00'` vira `125000`
- No terminal, os itens alinhados em colunas com `padEnd`: `Pizza grande marguerita    R$ 72,90`
