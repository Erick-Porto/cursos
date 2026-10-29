---
title: Testes automatizados com Jest
summary: Jest no lojinha-regras, describe, test e expect, matchers, arrange-act-assert, TDD e cobertura.
module: ambiente-js
duration_minutes: 40
objectives:
  - Configurar o Jest no lojinha-regras e escrever testes com describe, test e expect
  - Organizar cada teste em arrange, act, assert e escolher o matcher certo
  - Aplicar um ciclo de TDD e ler o relatório de cobertura
---

# Testes automatizados com Jest

Programador Mobile · Encontro E04 · Aula 7 de 89

---

## O que você vai aprender

:::goal
- Instalar o Jest, o programa que roda os testes, e usar o `npm test`
- Escrever um teste com `describe`, `test` e `expect` e ler o resultado
- Organizar cada teste em três partes: preparar, agir e conferir
- Escrever o teste antes do código (TDD) e ver o que ficou sem teste (cobertura)
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **teste automatizado** | um código que usa a sua função e confere se o resultado está certo |
| **Jest** | o programa que roda os testes e mostra quais passaram |
| **matcher** (comparador) | o jeito de conferir: "é igual a", "contém", "tem tantos itens" |
| **caso de borda** | um teste no limite: o texto vazio, o valor exato do limite |
| **TDD** | escrever o teste antes do código que ele confere |
| **cobertura** | o relatório das linhas que algum teste fez rodar |

---

## O preço que sumiu

Do E05 ao E20, o `lojinha-regras` ganha dezenas de **funções**, receitas com nome que o código usa quando precisa: o preço, o frete, o carrinho. Uma mesma função é usada em vários lugares.

Imagine o E10. Você muda a função do preço para o relatório de destaques e confere esse relatório: tudo certo. Mas o resumo do pedido usa a mesma função e passa a mostrar R$ 200 onde a conta dava R$ 199,90. Você conferiu um lugar só.

Conferir tudo à mão, a cada mudança, ninguém aguenta. O computador aguenta.

:::question
Que funções da Lojinha você testaria primeiro, e por quê?
:::

---

## Testes automatizados

Quem corrige 300 provas numa tarde sem errar nenhuma?

---

## :icon[clipboard-check] Teste: uma prova com gabarito

Um **teste automatizado** é um código que usa a sua função e confere o resultado. Pense numa prova com gabarito que o computador corrige sozinho:

| Na prova | No teste |
|---|---|
| a questão | usar a função com uma entrada |
| a resposta do aluno | o que a função devolve |
| o gabarito | o resultado que você espera |

Exemplo: a função `abreviar` promete encurtar nomes longos. A questão: `'Caixa de Som Portátil'`, com no máximo 15 caracteres, vira o quê? O gabarito: `'Caixa de Som...'`.

O teste roda todas as questões em segundos, sempre do mesmo jeito, a cada mudança.

---

## :icon[clipboard-check] Testes automatizados na prática

Três conferências que os testes do curso fazem por você:

| Caso | A questão | O gabarito |
|---|---|---|
| o relatório do E02 | `npm run relatorio Audio` | 3 produtos de áudio |
| a média do E03 | o preço médio dos livros | `R$ 68.23` |
| o Racha-conta (E07) | R$ 100,00 para 3 pessoas | 33,34 + 33,33 + 33,33 = 100,00 |

- No E02, a primeira dava `Produtos: 0`. O E03 corrigiu; o teste impede o bug de voltar
- No E03, a média dividida por 12 dava `R$ 17.06`: o lint não viu, o teste vê
- No Racha-conta, as partes precisam fechar a conta, sem perder um centavo

---

## O Jest

E quem aplica e corrige a prova do seu código?

---

## :icon[terminal] Jest no lojinha-regras

O **Jest** é o corretor da prova: ele roda os seus testes e diz quais passaram. É o mais usado em JavaScript e o padrão do React Native (E26). Na pasta raiz do projeto:

```bash
npm i -D jest babel-jest @babel/preset-env
```

| Parte | O que ela diz |
|---|---|
| `npm i` | o mesmo que `npm install`, mais curto |
| `-D` | "é ferramenta de quem programa": vai para `devDependencies`, a lista das ferramentas, como o ESLint no E03 |
| `jest` | o corretor |
| `babel-jest` e `@babel/preset-env` | o **Babel**, um tradutor de que o Jest precisa para ler o seu código |

Com eles, o `node_modules` passa de 200 pacotes: a instalação demora um pouco.

---

## :icon[settings] npm test e o babel.config.json

Lembra do script `test`, que o `npm init` criou no E02 e só mostrava um erro? Hoje ele ganha função: no `package.json`, troque a linha dele por `"test": "jest"`.

O Jest não entende o `import` e o `export` do jeito que o projeto escreve. O **Babel** é o tradutor: passa esse código para o formato que o Jest lê. Na raiz, crie o `babel.config.json`:

```json
{ "presets": [["@babel/preset-env", { "targets": { "node": "current" } }]] }
```

- `"node": "current"`: "traduza para o Node instalado neste computador"
- `npm test` roda todos os arquivos terminados em `.test.js`. Eles ficam **ao lado** do código que conferem

---

## :icon[terminal] O Jest na prática

O `npm test` sempre termina com um resumo. Três respostas que você vai ver hoje:

```bash
npm test    # 1. logo depois de instalar, sem nenhum teste
# No tests found, exiting with code 1

npm test    # 2. todos os testes passaram
# Tests:       2 passed, 2 total

npm test    # 3. uma questão errada
# Tests:       1 failed, 3 passed, 4 total
```

- **1:** ainda não existe arquivo `.test.js`. É o esperado, por enquanto
- **2:** `passed` quer dizer "passou"; `total`, quantos testes rodaram
- **3:** `failed` quer dizer "falhou". Acima do resumo, o Jest mostra qual teste falhou e por quê

---

## Entrada e saída

Para corrigir uma prova, o professor precisa saber como o aluno pensou?

---

## :icon[file-code] A função que você vai testar

Para testar uma função, você não precisa saber **como** ela faz. Precisa saber o que ela **promete**: o que entra e o que sai. Na prova é igual: quem corrige confere a resposta com o gabarito, sem ler o pensamento do aluno.

Crie `src/utils/texto.js` com uma função que encurta textos, para o relatório do catálogo caber no terminal:

```javascript
// encurta o texto para caber em `limite` caracteres, terminando em '...'
export function abreviar(texto, limite) {
  if (texto.length <= limite) return texto;
  return texto.slice(0, limite - 3) + '...';
}
```

- **Entra:** um texto e um limite. **Sai:** o texto, igual ou encurtado
- Cabe no limite? Volta igual. Não cabe? É cortado e ganha três pontos, sem passar do limite

Hoje, só leia: o `if` e as funções voltam no E07, e o `slice`, que corta o texto, no E06.

---

## :icon[file-code] Entrada e saída na prática

A promessa do `abreviar` em três casos. Um script de rascunho mostra o que sai para cada entrada:

```javascript
// src/scripts/testar-abreviar.js
import { abreviar } from '../utils/texto.js';

console.log(abreviar('Fone Bluetooth', 20));        // Fone Bluetooth
console.log(abreviar('Caixa de Som Portátil', 15)); // Caixa de Som...
console.log(abreviar('Jogo de Panelas', 10));       // Jogo de...
```

- `'Fone Bluetooth'` tem 14 caracteres: cabe em 20 e volta igual
- `'Caixa de Som Portátil'` tem 21: sobram 12, mais os três pontos, 15
- `'Jogo de Panelas'` tem 15: sobram 7, mais os três pontos, 10

Cada linha vira uma questão da prova. O teste faz essa mesma conferência, sem você ler a saída.

---

## O primeiro teste

Uma prova tem matéria, questões e gabarito. Como fica a prova de uma função?

---

## :icon[test-tube] Seu primeiro teste

O arquivo de teste é a prova da função. No Jest, **`describe`** é a prova de uma matéria: junta as questões de uma função. **`test`** é uma questão. **`expect`** confere a resposta com o gabarito.

```javascript
// src/utils/texto.test.js
import { abreviar } from './texto.js';

describe('abreviar', () => {
  test('mantém um nome que cabe', () => {
    expect(abreviar('Fone Bluetooth', 20)).toBe('Fone Bluetooth');
  });

  test('corta um nome longo e põe reticências', () => {
    expect(abreviar('Caixa de Som Portátil', 15)).toContain('...');
  });
});
```

Rode `npm test` e leia o resumo: `Tests: 2 passed, 2 total`. Dois testes passaram, de dois.

---

## :icon[list-ordered] O primeiro teste em português

| Linha | O que ela diz |
|---|---|
| `import { abreviar } from './texto.js'` | "traga o `abreviar` do arquivo ao lado", com o `.js` no fim, como no E02 |
| `describe('abreviar', ...)` | "começa a prova do `abreviar`" |
| `test('mantém um nome...', ...)` | "questão: mantém um nome que cabe". O nome se lê como frase |
| `expect(abreviar(...))` | "pegue a resposta da função..." |
| `.toBe('Fone Bluetooth')` | "...e confira: é exatamente este texto?" |
| `.toContain('...')` | "...e confira: tem `'...'` dentro?" |

O `() => {` abre uma **arrow function**, uma função curta que guarda as linhas que o Jest vai rodar. Hoje, só leia; escrever vem no E07.

---

## :icon[test-tube] O primeiro teste na prática

**Caso 1: mais uma questão na mesma prova.** Dentro do `describe('abreviar', ...)` do `texto.test.js`:

```javascript
test('corta o nome das panelas', () => {
  expect(abreviar('Jogo de Panelas', 10)).toBe('Jogo de...');
});
```

**Caso 2: a prova de outro arquivo.** As categorias do `produtos.js` (E02) ganham o `produtos.test.js`, ao lado dele:

```javascript
// src/data/produtos.test.js
import { categorias } from './produtos.js';

describe('categorias', () => {
  test('são quatro', () => {
    expect(categorias.length).toBe(4);
  });
});
```

```bash
npm test
# Tests:       4 passed, 4 total
```

O `npm test` acha os dois arquivos `.test.js` sozinho, e o resumo soma as questões de todas as provas.

---

## Ler uma falha

A prova voltou com um X vermelho. O que você olha primeiro?

---

## :icon[bug] Lendo uma falha

Quando a resposta não bate com o gabarito, o teste **falha**: o Jest marca em vermelho e mostra as duas versões. Agora, o texto inteiro do nome cortado. Você copia as reticências de um documento, e o teste falha:

```javascript
expect(abreviar('Caixa de Som Portátil', 15)).toBe('Caixa de Som…');
```

```plaintext
Expected: "Caixa de Som…"
Received: "Caixa de Som..."
```

Leia toda falha nesta ordem:

1. O nome do teste: qual questão errou
2. O **Expected** (esperado): o que o teste pediu
3. O **Received** (recebido): o que a função devolveu
4. A linha marcada com `>`: onde está o `expect` que falhou

Depois decida: o erro está no código ou no teste?

---

## :icon[bug] Falhas na prática

**Caso 1: o teste errou.** É a falha das reticências:

```plaintext
Expected: "Caixa de Som…"
Received: "Caixa de Som..."
```

O teste espera **um** caractere de reticências (`…`), que editores de texto e celulares põem no lugar de três pontos. A função promete três pontos, no comentário dela. Corrija o gabarito: `'Caixa de Som...'`, digitado no VS Code. Aspas curvas (“ ”) copiadas também enganam.

**Caso 2: o código errou.** Alguém trocou `<=` por `<` no `abreviar`, e o teste do limite exato falha:

```plaintext
Expected: "Fone Bluetooth"
Received: "Fone Blueto..."
```

Um nome de 14 caracteres cabe num limite de 14: a promessa vale, e quem corrige é o código.

---

## Matchers

Uma questão pede a resposta exata; outra, só a palavra-chave. Como corrigir as duas?

---

## :icon[list-checks] Matchers: as formas de conferir

O **matcher** (comparador), depois do `expect`, diz como conferir a resposta:

| Matcher | Passa quando o resultado... | Exemplo na Lojinha |
|---|---|---|
| `toBe(v)` | é exatamente `v` | `abreviar('Fone Bluetooth', 20)` é `'Fone Bluetooth'` |
| `toEqual(v)` | tem o mesmo conteúdo | a primeira categoria é `{ slug: 'audio', nome: 'Áudio' }` |
| `toContain(x)` | contém `x` | o nome cortado tem `'...'` |
| `toHaveLength(n)` | tem `n` itens ou caracteres | o catálogo tem 4 categorias |
| `toThrow()` | lança um erro, de propósito | as regras do E17 |

O **`.not`** antes do matcher inverte: `.not.toContain('...')` quer dizer "não contém".

---

## :icon[list-checks] Matchers na prática

Três conferências de verdade do `lojinha-regras`, cada uma com o matcher que diz melhor o que se espera:

```javascript
test('o nome cortado não passa de 15 caracteres', () => {
  expect(abreviar('Caixa de Som Portátil', 15)).toHaveLength(15);
});

test('um nome que cabe não ganha reticências', () => {
  expect(abreviar('Fone Bluetooth', 20)).not.toContain('...');
});

// no produtos.test.js
test('são quatro', () => {
  expect(categorias).toHaveLength(4);
});
```

- `toHaveLength(15)` conta os caracteres do texto; `toHaveLength(4)`, os itens da lista
- `.not.toContain('...')` confere que o pedaço **não** está lá
- `toHaveLength(4)` diz o mesmo que `categorias.length` com `toBe(4)`, e na falha mostra a lista inteira

---

## :icon[equal] toBe ou toEqual?

As categorias de `src/data/produtos.js` (E02) são **objetos**, fichas com campos. Compare:

```javascript
// src/data/produtos.test.js
import { categorias } from './produtos.js';

test('a primeira é Áudio', () => {
  expect(categorias[0]).toBe({ slug: 'audio', nome: 'Áudio' }); // falha
  expect(categorias[0]).toEqual({ slug: 'audio', nome: 'Áudio' }); // passa
});
```

- `categorias[0]` é o primeiro item da lista: as posições contam a partir do 0
- Um objeto é como uma casa. **`toBe`** pergunta "é a **mesma** casa?". O objeto escrito no teste é outra casa, mesmo igual por dentro: falha
- **`toEqual`** pergunta "as casas são iguais por dentro?": confere campo por campo. Passa
- Na falha do `toBe`, o Jest avisa `serializes to the same string`: o conteúdo bate, o matcher é que está errado

Regra prática: `toBe` para texto, número e booleano (sim ou não); `toEqual` para objetos e listas.

---

## Arrange, act, assert

Quais são os passos para provar uma receita nova?

---

## :icon[list-ordered] Arrange, act, assert

Todo teste bom tem três partes, como provar uma receita: separar os ingredientes, cozinhar, provar. Em inglês: **arrange** (preparar), **act** (agir) e **assert** (conferir).

```javascript
test('não passa do limite', () => {
  // arrange: um nome longo e o limite
  const nome = 'Caixa de Som Portátil';
  const limite = 15;
  // act: chama a função, uma vez só
  const curto = abreviar(nome, limite);
  // assert: confere o resultado
  expect(curto).toHaveLength(limite);
});
```

- **Arrange** prepara os dados; **act** chama a função; **assert** confere com o `expect`
- O `const` é a caixa com etiqueta do E02: guarda a entrada e a saída com um nome (a fundo no E05)
- A partir do E08, as regras recebem listas de produtos. No arrange, monte uma lista pequena, **feita para o teste**: com o catálogo inteiro, o teste quebraria a cada preço novo, sem bug nenhum

---

## :icon[list-ordered] Arrange, act, assert na prática

**Caso 1: a coluna do relatório.** O nome do produto precisa caber em 10 caracteres:

```javascript
test('o nome do produto cabe na coluna do relatório', () => {
  // arrange: o produto e a largura da coluna
  const produto = { nome: 'Jogo de Panelas', preco: 459.9 };
  const largura = 10;
  // act
  const coluna = abreviar(produto.nome, largura);
  // assert
  expect(coluna).toBe('Jogo de...');
});
```

**Caso 2: uma lista feita para o teste.** Três produtos são o suficiente para conferir a peneira dos destaques:

```javascript
test('conta os produtos em destaque', () => {
  // arrange: uma lista pequena, feita para o teste
  const lista = [
    { nome: 'Fone Bluetooth', destaque: true },
    { nome: 'Garrafa Térmica', destaque: false },
    { nome: 'Jogo de Panelas', destaque: false },
  ];
  // act
  const destaques = lista.filter((produto) => produto.destaque);
  // assert
  expect(destaques).toHaveLength(1);
});
```

O `filter` é a peneira do relatório do E02; escrever um vem no E09.

---

## Escolher os casos

O elevador diz "máximo 8 pessoas". Com quantas pessoas você testaria?

---

## :icon[target] Que casos testar

Uma prova boa não pergunta só o fácil. Escolha casos de três tipos:

| Tipo | O que é | No `abreviar` |
|---|---|---|
| **caminho feliz** | o uso normal | um nome que cabe; um nome longo |
| **borda** | o limite exato, o vazio | `'Fone Bluetooth'` tem 14 caracteres: com limite 14, ele cabe? E o texto vazio, `''`? |
| **entrada errada** | um dado que não devia chegar | quando a função valida dados (E06) |

Um caso de **borda** é como a lotação do elevador: com exatamente o limite de pessoas, ele anda? É nas bordas que os bugs se escondem.

---

## :icon[table] Vários casos com test.each

Quando só a entrada muda, escreva os casos numa tabela, com o **`test.each`**:

```javascript
test.each([
  ['Fone Bluetooth', 20, 'Fone Bluetooth'], // cabe
  ['Caixa de Som Portátil', 15, 'Caixa de Som...'], // corta
  ['Fone Bluetooth', 14, 'Fone Bluetooth'], // borda: limite exato
  ['', 10, ''], // borda: vazio
])('%p com limite %p vira %p', (texto, limite, esperado) => {
  expect(abreviar(texto, limite)).toBe(esperado);
});
```

- Cada linha, `[texto, limite, esperado]`, vira um teste
- Cada `%p` do nome é trocado por um valor da linha: `"Fone Bluetooth" com limite 20 vira "Fone Bluetooth"`
- As bordas pegam bugs reais: com `<` no lugar de `<=` no `abreviar`, a linha do limite exato fica vermelha com `Received: "Fone Blueto..."`

---

## Pense

:::example Desafio
O próximo utilitário do `texto.js` é o `boasVindas(nome)`, que monta a saudação do cliente nos scripts: `'Ana'` vira `'Olá, Ana!'`. O nome chega do terminal, digitado por alguém. Antes de escrever a função, liste três casos de teste, com entrada e resultado esperado.
:::

:::tip Resposta
| Entrada | Esperado | Tipo |
|---|---|---|
| `'Ana'` | `'Olá, Ana!'` | caminho feliz |
| `'Ana Souza'` | `'Olá, Ana Souza!'` | nome composto |
| `'  Ana '` | `'Olá, Ana!'` | borda: espaços digitados a mais |

E o nome vazio? Ainda não há regra: é uma pergunta para a dona da loja. Você escreveu os testes antes do código: é assim que o TDD começa.
:::

---

## TDD

E se o gabarito ficasse pronto antes da resposta?

---

## :icon[repeat] TDD: o teste vem antes

No **TDD** (*test-driven development*, desenvolvimento guiado por testes), você escreve o teste antes do código. É escrever o gabarito antes de resolver a questão. São três passos curtos, que se repetem:

::::columns
:::col
![Animação: os três passos do TDD aparecem em sequência; vermelho, o teste falha; verde, o teste passa; refatorar, tudo segue verde; e a seta do próximo teste volta ao vermelho](images/e04-ciclo-tdd.svg)
:::
:::col
1. **Vermelho**: um teste para o que ainda não funciona. Ele falha
2. **Verde**: o mínimo de código para ele passar
3. **Refatorar**: melhore nomes e estrutura com todos os testes verdes

Depois, o próximo teste recomeça o ciclo.
:::
::::

---

## :icon[circle-x] TDD: vermelho

Na prática, com o `boasVindas`. Primeiro, o teste do caminho feliz, no `texto.test.js`. O `boasVindas` ainda não existe:

```javascript
import { abreviar, boasVindas } from './texto.js';

test('cumprimenta pelo nome', () => {
  expect(boasVindas('Ana')).toBe('Olá, Ana!');
});
```

```plaintext
TypeError: (0 , _texto.boasVindas) is not a function
```

O Jest avisa que `boasVindas` não é uma função: ela não existe. Vermelho, como devia.

Por que ver o vermelho? Um teste que nasce verde pode não estar conferindo nada. O vermelho prova que ele percebe a falta da função.

---

## :icon[circle-check] TDD: verde

O mínimo para passar, no `texto.js`; o `+` junta os pedaços de texto:

```javascript
export function boasVindas(nome) {
  return 'Olá, ' + nome + '!';
}
```

O `return` entrega o resultado, como o prato pronto que sai da receita (E07). Verde.

O próximo teste é a borda dos espaços: `expect(boasVindas('  Ana ')).toBe('Olá, Ana!')`.

```plaintext
Expected: "Olá, Ana!"
Received: "Olá,   Ana !"
```

Vermelho de novo: os espaços digitados entraram na mensagem. A correção usa o `trim()`, que tira os espaços das pontas de um texto (E06): `return 'Olá, ' + nome.trim() + '!';`. Os dois testes, verdes.

---

## :icon[wrench] TDD: refatorar

Com tudo verde, melhore o código **sem mudar o que ele faz**: é passar a receita a limpo, com palavras melhores, sem mudar o bolo. Os testes também são código: os dois testes quase iguais viram uma tabela.

```javascript
describe('boasVindas', () => {
  test.each([
    ['Ana', 'Olá, Ana!'],
    ['  Ana ', 'Olá, Ana!'], // borda: espaços nas pontas
  ])('%p vira %p', (nome, esperado) => {
    expect(boasVindas(nome)).toBe(esperado);
  });
});
```

`npm test`: os mesmos dois casos, verdes. Agora, o caso do nome composto, `'Ana Souza'`, entra como uma linha nova na tabela. Se ela ficar vermelha, o ciclo recomeça.

---

## Cobertura

Você estuda com marca-texto? O que diz uma página sem nenhuma marca?

---

## :icon[chart-bar] Cobertura: o que os testes visitam

A **cobertura** (*coverage*) funciona como um marca-texto: o Jest marca cada linha que algum teste fez rodar. O que fica sem marca nunca foi conferido.

```bash
npm test -- --coverage
```

O `--` sozinho quer dizer "o que vem depois é para o Jest, não para o npm". O Jest roda os testes e mostra uma tabela por arquivo:

| Coluna | O que conta |
|---|---|
| **% Stmts** (instruções) e **% Lines** (linhas) | quanto do código rodou |
| **% Branch** (caminhos) | os caminhos de decisão percorridos, como os dois lados de um `if` |
| **% Funcs** (funções) | as funções chamadas por algum teste |
| **Uncovered Line #s** | as linhas que nenhum teste fez rodar |

---

## :icon[chart-bar] Cobertura na prática

**Caso 1: um teste só.** Imagine o `texto.js` com as duas funções e um teste só: o do nome longo no `abreviar`. O relatório denuncia:

```plaintext
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
texto.js  |      50 |       50 |      50 |   66.66 | 8
```

O `boasVindas` nunca rodou (% Funcs), o `if` do `abreviar` seguiu só um dos dois caminhos (% Branch), e a linha 8, a do `boasVindas`, ficou sem marca.

**Caso 2: com os testes do laboratório.** Os casos do `abreviar` que cabem e que cortam e os do `boasVindas`:

```plaintext
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
texto.js  |     100 |      100 |     100 |     100 |
```

O relatório completo fica na pasta `coverage/`. Abra o `coverage/lcov-report/index.html` no navegador: as linhas sem teste aparecem em vermelho.

---

## :icon[circle-alert] 100% não quer dizer sem bug

A cobertura mostra o que **não** foi testado. Ela não prova que o resto está certo:

- Um teste sem `expect` faz a linha rodar e não confere nada: passa sempre e não protege nada
- Teste novo que passou de primeira? Quebre o código de propósito e confira que ele fica vermelho
- Cobertura alta com gabarito errado continua errada: o teste confere o que você escreveu nele

---

## Mensagens de erro

O Jest também acende luzes no painel. Você sabe ler cada uma?

---

## :icon[siren] Quando aparece um erro

A mensagem de erro é a luz do painel do carro: diz o que aconteceu e onde.

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `No tests found` | nenhum arquivo de teste | nome terminado em `.test.js` (não `.teste.js`) |
| `Must use import to load ES Module` | o Jest não leu o `import` | `babel.config.json` na raiz |
| `is not a function` | a função importada não existe | conferir o `import` e o `export` |
| `serializes to the same string` | `toBe` com objeto ou lista | trocar por `toEqual` |
| `Error: no test specified` | o `test` antigo do `npm init` | `"test": "jest"` |

---

## Resumo

:::summary
- O Jest roda os arquivos `.test.js`, que ficam ao lado do código em `src/`; o `babel.config.json` traduz o `import` para ele
- `describe` agrupa, `test` descreve um caso e `expect` com um matcher confere: `toBe` para texto e número, `toEqual` para objetos e listas
- Cada teste segue arrange, act, assert (preparar, agir, conferir); `test.each` cobre muitos casos numa tabela, bordas incluídas
- TDD é vermelho, verde, refatorar: o teste vem antes do código
- `--coverage` mostra o que nenhum teste visitou, não a ausência de bugs
:::

---

## Próximos passos

Na próxima aula, os testes deixam de depender da sua memória:

- :icon[terminal] o script `verificar`, que roda o lint e os testes de uma vez
- :icon[variable] variáveis de ambiente e o `.env`, para configurar sem expor segredo
- :icon[workflow] o GitHub Actions rodando tudo a cada push, com selo no README

No laboratório, o `abreviar`, o `boasVindas` e as categorias ganham pelo menos 12 testes. A partir do E05, cada regra de negócio da Lojinha nasce com os testes dela.
