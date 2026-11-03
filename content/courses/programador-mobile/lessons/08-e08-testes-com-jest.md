---
title: Testes com Jest
summary: "O Racha-conta ganha uma prova com gabarito: Jest, test e expect, o vermelho antes do verde e a tabela de casos."
module: linguagem-js
duration_minutes: 90
objectives:
  - Instalar o Jest e o Babel no Racha-conta e rodar os testes com npm test
  - Escrever testes com test, expect, toBe e toEqual
  - Ler o vermelho do Jest, com Expected e Received, antes de ver o verde
  - Conferir vários casos de uma vez com test.each
---

# Testes com Jest

Programador Mobile · Encontro E08 · Aula 8 de 45

---

## O que você vai aprender

:::goal
- Entender o que é um teste automatizado: a prova com gabarito que o computador corrige
- Instalar o Jest no Racha-conta e rodar os testes com `npm test`
- Escrever testes com `test`, `expect`, `toBe` e `toEqual`
- Ver o vermelho antes do verde e ler o `Expected` e o `Received`
- Conferir vários casos de uma vez com `test.each`
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **teste automatizado** | um código que usa a sua função e confere se o resultado está certo |
| **Jest** | o programa que roda os testes e diz quais passaram |
| **dependência de desenvolvimento** | um pacote que só quem programa usa, como o Jest |
| **Babel** | um tradutor que reescreve o seu código do jeito que o Jest lê |
| **caso de teste** | uma questão da prova: uma entrada e o resultado esperado |
| **vermelho e verde** | o teste que falhou e o teste que passou |

---

## Quem confere a conta?

No E07, as contas do Racha-conta viraram funções no `conta.js`. Para saber se elas acertam, hoje você roda `npm run racha` e confere as linhas com a calculadora:

```plaintext
Subtotal: R$ 187.50
Gorjeta (10%): R$ 18.75
Total: R$ 206.25
```

Hoje são 3 funções. Até o E12, serão 9, e o `formatarReais` muda no E09. A cada mudança, uma função que funcionava pode quebrar sem ninguém ver. No fim de hoje, um comando confere tudo sozinho:

```plaintext
Tests:       11 passed, 11 total
```

:::question
Além da conta da Cantina, que outras contas de gorjeta você conferiria?
:::

---

## Testes automatizados

Quem corrige 300 provas numa tarde sem errar nenhuma?

---

## :icon[clipboard-check] Teste: uma prova com gabarito

Um **teste automatizado** é um código que usa a sua função e confere o resultado. Pense numa prova com gabarito que o computador corrige sozinho:

| Na prova | No teste |
|---|---|
| a questão | chamar a função com uma entrada: `calcularGorjeta(18750, 10)` |
| a resposta do aluno | o que a função devolve |
| o gabarito | o resultado que você espera: `1875` |
| a correção | o computador compara a resposta com o gabarito |

O gabarito você calcula uma vez, à mão: 10% de 18750 centavos são 1875. Depois, o computador corrige quantas vezes você quiser, em segundos, sempre do mesmo jeito.

---

## :icon[clipboard-check] Testes na prática

Cada **caso de teste** é uma questão com o seu gabarito. Três casos do Racha-conta:

| Caso | A questão | O gabarito |
|---|---|---|
| a conta de exemplo | `calcularGorjeta(18750, 10)` | `1875` |
| o meio centavo | `calcularGorjeta(18755, 10)` | `1876` |
| o problema do E06 | `paraCentavos(0.1 + 0.2)` | `30` |

Com o `console.log`, quem corrige é você:

```javascript
console.log(calcularGorjeta(18755, 10)); // 1876
```

Você precisa lembrar do gabarito e olhar cada linha, a cada mudança. O teste guarda o gabarito junto da questão e diz sozinho se passou.

---

## O Jest

E quem aplica e corrige a prova do seu código?

---

## :icon[terminal] O Jest: o corretor da prova

O **Jest** é o corretor: acha os arquivos de teste, roda cada questão e diz quais passaram. Ele precisa do **Babel**, um tradutor: o Jest ainda carrega os arquivos de um jeito antigo, que não entende `import`, e o Babel reescreve o código para ele, sem mudar o seu arquivo. Os dois se instalam juntos:

```bash
npm i -D jest babel-jest @babel/preset-env@7
```

| Parte | O que ela diz |
|---|---|
| `npm i` | o mesmo que `npm install`, mais curto |
| `-D` | "é utensílio, não ingrediente": vai para a lista `devDependencies` |
| `jest` | o corretor |
| `babel-jest` e `@babel/preset-env` | o tradutor e as regras de tradução dele |
| `@7` | "a versão 7", a que combina com este Jest |

---

## :icon[milestone] Projeto 1 · Passo 1: o Jest no Racha-conta

:::steps
1. Na pasta raiz: `npm i -D jest babel-jest @babel/preset-env@7`
2. Na raiz, ao lado do `package.json`, crie o `babel.config.json` com esta linha:
3. No `package.json`, troque o comando do `test` por `"jest"`: `"test": "jest",`
4. Rode `npm test`
:::

```json
{ "presets": [["@babel/preset-env", { "targets": { "node": "current" } }]] }
```

A linha diz ao Babel: use as regras do `@babel/preset-env` e traduza para o Node deste computador (`"current"`). Cada colchete e cada chave contam.

O **`npm test`** roda o script `test`. É um apelido especial: funciona sem o `run`.

**Pronto quando:** `npm test` responde `No tests found, exiting with code 1` (nenhum teste encontrado). O Jest procura arquivos com o nome terminado em `.test.js`, e ainda não há nenhum.

---

## :icon[package] O que a instalação mudou

A instalação demora um pouco e termina assim:

```plaintext
added 371 packages, and audited 373 packages in 14s
19 vulnerabilities (1 low, 18 moderate)
```

No `package.json`, os três pacotes entram na lista nova:

```json
"devDependencies": {
  "@babel/preset-env": "^7.29.7",
  "babel-jest": "^30.5.2",
  "jest": "^30.5.2"
}
```

O picocolors continua em `dependencies`: é ingrediente, pinta o título quando o programa roda. O Jest é utensílio: confere a receita, mas não vai no bolo.

:::warning
O aviso `npm warn deprecated` e as `vulnerabilities` falam de pacotes que o Jest usa por dentro e não afetam o Racha-conta. **Não rode `npm audit fix --force`**: ele troca o Jest 30 pela versão 25, antiga, e os avisos sobem de 19 para 34.
:::

---

## O primeiro teste

O que uma questão de prova precisa ter para alguém conseguir corrigir?

---

## :icon[test-tube] test, expect e toBe

Um teste do Jest é uma questão da prova, escrita com três palavras: `test`, `expect` e `toBe`.

```javascript
test('gorjeta de 10% sobre R$ 187,50 é R$ 18,75', () => {
  expect(calcularGorjeta(18750, 10)).toBe(1875);
});
```

| Parte | O que ela diz |
|---|---|
| `test('...', ...)` | "uma questão com este nome": o nome diz, numa frase, o que se espera |
| `() => { ... }` | a seta do E07, sem ingredientes e com chaves; nas chaves fica a questão, e não precisa de `return`: quem confere é o `expect` |
| `expect(calcularGorjeta(18750, 10))` | "pegue a resposta da função...". *Expect* é "esperar" |
| `.toBe(1875)` | "...e confira: ela é 1875?". *To be* é "ser" |

O `test` e o `expect` não precisam de `import`: o Jest entrega os dois a todo arquivo de teste.

---

## :icon[folder-tree] O caminho do import no teste

:::center
![Diagrama: dentro de src, o racha.js, na pasta scripts, chega ao conta.js por '../regras/conta.js', subindo uma pasta; o conta.test.js mora na pasta regras, ao lado do conta.js, e chega a ele por './conta.js', sem subir nada](images/e08-caminho-do-teste.svg)
:::

- O caminho parte da **pasta do arquivo que importa**, como no E07
- O `racha.js` mora em `scripts/`: sobe com `..` até `src/` e entra em `regras/`
- O `conta.test.js` mora em `regras/`, ao lado do `conta.js`. O **`./`** quer dizer "nesta mesma pasta"

Por isso o teste importa com `'./conta.js'`: sem `..` e sem `regras/`.

---

## :icon[milestone] Projeto 1 · Passo 2: o primeiro teste

Crie `src/regras/conta.test.js`, ao lado do `conta.js`:

```javascript
import { calcularGorjeta } from './conta.js';

test('gorjeta de 10% sobre R$ 187,50 é R$ 18,75', () => {
  expect(calcularGorjeta(18750, 10)).toBe(1875);
});
```

Rode `npm test`:

```plaintext
PASS src/regras/conta.test.js
  √ gorjeta de 10% sobre R$ 187,50 é R$ 18,75 (4 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
```

**Pronto quando:** aparecem o `PASS`, o `√` e `Tests: 1 passed, 1 total`.

`Test Suites` conta os arquivos de teste; `Tests`, as questões. Embaixo vêm `Snapshots: 0 total`, um recurso que o curso não usa, e `Time`, o tempo total. O tempo, como o `(4 ms)`, muda a cada vez.

---

## :icon[test-tube] O primeiro teste na prática

O `toBe` confere número, texto e `true` ou `false`:

```javascript
test('gorjeta de 15% sobre R$ 187,50 é R$ 28,13', () => {
  expect(calcularGorjeta(18750, 15)).toBe(2813);
});

test('a gorjeta é um número', () => {
  expect(typeof calcularGorjeta(18750, 10)).toBe('number');
});

test('0.1 + 0.2 não dá 0.3', () => {
  expect(0.1 + 0.2 === 0.3).toBe(false);
});
```

```plaintext
  √ gorjeta de 15% sobre R$ 187,50 é R$ 28,13 (6 ms)
  √ a gorjeta é um número (1 ms)
  √ 0.1 + 0.2 não dá 0.3 (1 ms)
```

- 15% de 18750 dá 2812,5, e o `Math.round` sobe para 2813, como no E07
- O `typeof`, do E06, responde o tipo como texto: `'number'`
- A comparação responde `false`, e o gabarito é `false`: passou

---

## Vermelho e verde

O detector de fumaça nunca apitou. Como você sabe que ele funciona?

---

## :icon[circle-check] Verde passou, vermelho falhou

O Jest marca cada resultado com uma cor e um sinal:

| Onde | Verde: passou | Vermelho: falhou |
|---|---|---|
| no arquivo | `PASS` | `FAIL` |
| em cada teste | `√` | `×` |
| no resumo | `Tests: 1 passed` | `Tests: 1 failed` |

O detector de fumaça tem um botão de teste: você aperta e ouve o apito. Com o teste é igual. Um teste que nunca ficou vermelho pode não estar conferindo nada: um gabarito errado ou uma questão que não chama a função.

Por isso, todo teste novo é visto falhando pelo menos uma vez: quebre a função de propósito, veja o vermelho e conserte.

---

## :icon[milestone] Projeto 1 · Passo 3: ver o vermelho

:::steps
1. No `conta.js`, na `calcularGorjeta`, troque o `/ 100` por `/ 10` e salve
2. Rode `npm test` e leia o vermelho
3. Volte o `/ 100`, salve e rode `npm test` de novo
:::

```plaintext
FAIL src/regras/conta.test.js
  × gorjeta de 10% sobre R$ 187,50 é R$ 18,75 (4 ms)

    Expected: 1875
    Received: 18750
```

Com `/ 10`, a função devolve dez vezes mais: 18750 no lugar de 1875. O teste percebeu.

**Pronto quando:** você viu o `FAIL` com `Expected: 1875` e `Received: 18750` e, depois do conserto, o `PASS` de novo.

---

## :icon[file-search] Lendo o vermelho

Abaixo da lista de testes, o Jest explica cada falha:

```plaintext
  ● gorjeta de 10% sobre R$ 187,50 é R$ 18,75

    expect(received).toBe(expected) // Object.is equality

    Expected: 1875
    Received: 18750

    > 4 |   expect(calcularGorjeta(18750, 10)).toBe(1875);
        |                                      ^
      at Object.toBe (src/regras/conta.test.js:4:38)
```

| O que aparece | Quer dizer |
|---|---|
| `●` e o nome | qual teste falhou |
| `expect(received).toBe(expected)` | a conferência que falhou: o `toBe`, que compara como o `===` |
| `Expected` (esperado) | o gabarito: o que o teste pediu |
| `Received` (recebido) | a resposta: o que a função devolveu |
| `>` e `^` | a linha e o ponto do `expect` que falhou |
| `conta.test.js:4:38` | o arquivo, a linha 4 e a coluna 38 |

Depois de ler, decida: quem errou, a função ou o gabarito?

---

## :icon[bug] O vermelho na prática

**Caso 1: o gabarito errou.** O teste foi digitado com `toBe(1857)`:

```plaintext
Expected: 1857
Received: 1875
```

A função está certa: 10% de 18750 é 1875. Conserte o teste, não a função.

**Caso 2: o problema do E06.** Com `expect(0.1 + 0.2).toBe(0.3)`:

```plaintext
Expected: 0.3
Received: 0.30000000000000004
```

É por isso que o Racha-conta conta em centavos.

**Caso 3: texto vem entre aspas.** Com `expect(typeof calcularGorjeta(18750, 10)).toBe('string')`:

```plaintext
Expected: "string"
Received: "number"
```

---

## Tabela de casos

Para conferir quatro contas, você escreveria quatro vezes a mesma frase?

---

## :icon[table] test.each: uma tabela, vários testes

Quando só os números mudam, os casos vão numa **tabela**, e o **`test.each`** ("teste cada") faz um teste para cada linha. É a prova com várias questões do mesmo tipo. A tabela é uma lista de linhas, e cada linha é uma lista de três números.

```javascript
test.each([
  [18750, 10, 1875],
  [3330, 15, 500],
])('calcularGorjeta(%i, %i) dá %i', (subtotal, percentual, esperado) => {
  expect(calcularGorjeta(subtotal, percentual)).toBe(esperado);
});
```

| Parte | O que quer dizer |
|---|---|
| `test.each([...])` | "para cada linha desta tabela..." |
| `('calcularGorjeta(%i, %i) dá %i', ...)` | "...um `test` com este nome"; cada `%i` vira um número da linha |
| `(subtotal, percentual, esperado)` | os três números da linha entram nestes nomes, na ordem |
| `toBe(esperado)` | o gabarito é o terceiro número |

---

## :icon[table] test.each, linha por linha

O Jest lê a tabela de cima para baixo. Em cada linha, os três números entram, na ordem, em `subtotal`, `percentual` e `esperado`:

| Linha da tabela | A questão | O gabarito | O que ela confere |
|---|---|---|---|
| `[18750, 10, 1875]` | `calcularGorjeta(18750, 10)` | `1875` | a conta de exemplo |
| `[3330, 15, 500]` | `calcularGorjeta(3330, 15)` | `500` | 4,995 vira 5,00: o problema do E06 |
| `[18755, 10, 1876]` | `calcularGorjeta(18755, 10)` | `1876` | o meio centavo sobe |
| `[8000, 0, 0]` | `calcularGorjeta(8000, 0)` | `0` | sem gorjeta |

Quatro linhas, quatro testes, cada um com o seu nome. Para um caso novo, uma linha nova.

---

## :icon[milestone] Projeto 1 · Passo 4: a tabela da gorjeta

No `conta.test.js`, embaixo do primeiro teste:

```javascript
test.each([
  [18750, 10, 1875],
  [3330, 15, 500],
  [18755, 10, 1876],
  [8000, 0, 0],
])('calcularGorjeta(%i, %i) dá %i', (subtotal, percentual, esperado) => {
  expect(calcularGorjeta(subtotal, percentual)).toBe(esperado);
});

test('sem o percentual, a gorjeta é de 10%', () => {
  expect(calcularGorjeta(18750)).toBe(1875);
});
```

O último fica fora da tabela porque chama a função com um número só: confere o valor padrão `percentual = 10`, do E07.

**Pronto quando:** `npm test` mostra seis `√` e termina com `Tests: 6 passed, 6 total`.

---

## :icon[table] test.each na prática

**Caso 1: só a linha errada fica vermelha.** Com `[3330, 15, 499]` na tabela:

```plaintext
  √ calcularGorjeta(18750, 10) dá 1875 (3 ms)
  × calcularGorjeta(3330, 15) dá 499 (2 ms)
  √ calcularGorjeta(18755, 10) dá 1876
  √ calcularGorjeta(8000, 0) dá 0
```

O nome diz qual linha falhou. Aqui, o gabarito: 4,995 arredonda para 5,00.

**Caso 2: o marcador certo no nome.** Cada marcador mostra o valor de um jeito:

| Marcador | Mostra | Com `187.5` | Com `'R$ 0.05'` |
|---|---|---|---|
| `%i` | número inteiro | `187` | `NaN` |
| `%d` | número, com as casas | `187.5` | `NaN` |
| `%s` | texto, como está | `187.5` | `R$ 0.05` |

O marcador muda só o nome. A conferência usa o valor da linha, inteiro.

---

## Comparar listas

Dois gaveteiros com as mesmas coisas, gaveta por gaveta, são o mesmo gaveteiro?

---

## :icon[equal] toEqual: confere gaveta por gaveta

A lista é uma fileira de gavetas, da aula 3. O `toBe` pergunta "é a **mesma** fileira?". Uma lista escrita no teste é outra fileira, mesmo com o mesmo conteúdo, e o `toBe` falha. O **`toEqual`** (*to equal*: ser igual a) abre as gavetas e compara uma por uma, na ordem.

```javascript
const precos = [72.9, 68.9, 14.5, 16.7];

test('com toEqual, a lista passa', () => {
  expect(precos.filter((preco) => preco > 50)).toEqual([72.9, 68.9]);
});
```

Com `toBe` no lugar do `toEqual`, o teste falha com `Received: serializes to the same string`: o conteúdo bate, mas são duas fileiras. O Jest sugere o `toStrictEqual`, um `toEqual` mais rigoroso; no curso, use o `toEqual`.

Regra: `toBe` para número, texto e `true` ou `false`; `toEqual` para listas.

---

## :icon[equal] toEqual na prática

**Caso 1: a ordem conta.** O `filter` mantém a ordem da lista. Com `toEqual([68.9, 72.9])`:

```plaintext
    - Expected  - 1
    + Received  + 1

      Array [
    -   68.9,
        72.9,
    +   68.9,
      ]
```

A linha com `-` está só no gabarito; a linha com `+`, só no que a função devolveu.

**Caso 2: ninguém passou.** Nenhum preço passa de 100, e o `filter` devolve a lista vazia:

```javascript
test('ninguém passa: a lista vazia', () => {
  expect(precos.filter((preco) => preco > 100)).toEqual([]);
});
```

No E11, o `dividirConta` devolve a parte de cada pessoa numa lista, e os testes dele usam o `toEqual`.

---

## :icon[milestone] Projeto 1 · Sua vez: os testes das outras duas

Agora, sozinho. No `conta.test.js`, testes para `paraCentavos` e `formatarReais`:

| Chamada | Esperado |
|---|---|
| `paraCentavos(187.5)` | `18750` |
| `paraCentavos(72.9)` | `7290` |
| `paraCentavos(0.1 + 0.2)` | `30` |
| `formatarReais(18750)` | `'R$ 187.50'` |
| `formatarReais(5)` | `'R$ 0.05'` |

:::tip Dicas
- Acrescente as duas funções no `import` da primeira linha
- Copie o `test.each` da gorjeta e troque a função, a tabela e os nomes
- O `0.1 + 0.2` fica mais claro num `test` próprio, como o "sem o percentual"
- No nome, `%d` mostra número com casas e `%s` mostra texto
:::

**Pronto quando:** `npm test` termina com `Tests: 11 passed, 11 total`.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `"Error: no test specified"` | o `test` ainda é o do `npm init` | `"test": "jest"` no `package.json` |
| `No tests found` | nenhum arquivo termina em `.test.js` | renomear: `conta.test.js` |
| `Must use import to load ES Module` | falta o `babel.config.json` na raiz | criar ao lado do `package.json` |
| `ReferenceError: paraCentavos is not defined` | a função não foi importada | pôr o nome nas chaves do `import` |
| `serializes to the same string` | `toBe` com lista | trocar por `toEqual` |
| `Expected` e `Received` parecem iguais | um espaço a mais ou a menos | conferir letra por letra |

---

## :icon[milestone] Projeto 1 · Etapa 5 pronta

`npm test` mostra 11 testes com `√` e termina com:

```plaintext
Test Suites: 1 passed, 1 total
Tests:       11 passed, 11 total
```

- `babel.config.json` na raiz, ao lado do `package.json`
- `package.json` com `"test": "jest"` e os três pacotes em `devDependencies`
- `src/regras/conta.test.js` com os testes das três funções, passado a limpo com <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>F</kbd>
- `npm run racha` com a mesma saída de antes: o `conta.js` e o `racha.js` não mudam

```bash
git add .
git commit -m "Projeto 1: etapa 5, os primeiros testes"
git push
```

O `node_modules` fica fora do commit, pelo `.gitignore` do E05. Se faltou algo, termine em casa antes do E09.

---

## Resumo

:::summary
- Um teste automatizado é uma prova com gabarito: chama a função e confere a resposta sozinho
- `npm i -D` instala ferramentas de quem programa em `devDependencies`; o Babel, com o `babel.config.json`, traduz o `import` para o Jest
- `test('nome', () => { ... })` é uma questão; `expect(valor).toBe(esperado)` confere número, texto e `true` ou `false`
- `npm test` roda os arquivos `.test.js`: `PASS` e `√` é verde; `FAIL` e `×` é vermelho, com o `Expected` (o gabarito) e o `Received` (a resposta)
- Todo teste novo é visto vermelho pelo menos uma vez: quebre a função de propósito
- `test.each` faz um teste por linha da tabela; `toEqual` compara listas gaveta por gaveta
:::

---

## :icon[arrow-right] Próximos passos

No E09, o Racha-conta aprende a ler o valor que a pessoa digita:

- :icon[text] o texto `"R$ 187,50"` vira os centavos `18750`, com o `lerValor`
- :icon[terminal] `npm run racha "R$ 100,00"` divide outra conta, sem mexer no `conta.json`
- :icon[circle-check] o `formatarReais` ganha a vírgula: primeiro o teste muda e fica vermelho, depois a função
