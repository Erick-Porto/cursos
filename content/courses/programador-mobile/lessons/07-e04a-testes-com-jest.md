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
- Instalar o Jest no `lojinha-regras` e rodar `npm test`
- Escrever testes com `describe`, `test`, `expect` e os matchers mais usados
- Organizar cada teste em arrange, act, assert
- Fazer um ciclo de TDD e ler o relatório de cobertura
:::

---

## O preço que sumiu

Do E05 ao E20, o `lojinha-regras` ganha dezenas de funções: preço, frete, carrinho, pedido. Uma mesma função costuma ser usada em vários lugares.

Imagine o E10: você muda a função que calcula o preço para o relatório de destaques, confere esse relatório e está tudo certo. O resumo do pedido, que usa a mesma função, passa a mostrar R$ 200 onde a conta dava R$ 199,90. Você conferiu só um script.

Um **teste automatizado** é um código que chama a sua função e confere o resultado. Ele roda todas as conferências em segundos, sempre do mesmo jeito, a cada mudança.

:::question
Que funções da Lojinha você testaria primeiro, e por quê?
:::

---

## :icon[terminal] Jest no lojinha-regras

O **Jest** é o executor de testes mais usado em JavaScript e o padrão do React Native (E26). Instale-o com dois ajudantes:

```bash
npm i -D jest babel-jest @babel/preset-env
```

No `package.json`, troque o `test` que o `npm init` criou (o que só mostra um erro) por `"test": "jest"`. Na raiz, crie o `babel.config.json`:

```json
{ "presets": [["@babel/preset-env", { "targets": { "node": "current" } }]] }
```

- `-D` põe os três em `devDependencies` (E02): são ferramentas, não regras da loja
- O **Babel** traduz o `import` e o `export` do seu código para o formato que o Jest carrega; `"node": "current"` diz que o alvo é o seu Node
- `npm test` roda todos os arquivos terminados em `.test.js`, que ficam **ao lado** do código

---

## :icon[file-code] A função que você vai testar

Crie `src/utils/texto.js` com uma função que encurta textos, para o relatório do catálogo caber no terminal:

```javascript
// encurta o texto para caber em `limite` caracteres, terminando em '...'
export function abreviar(texto, limite) {
  if (texto.length <= limite) return texto;
  return texto.slice(0, limite - 3) + '...';
}
```

Em uma frase: se o texto cabe no limite, ele volta igual; se não, é cortado e ganha três pontos, sem passar do limite. Você vai entender cada parte a partir do E05.

Para testar, basta saber **o que entra** (um texto e um limite) e **o que sai**: `abreviar('Caixa de Som Portátil', 15)` devolve `'Caixa de Som...'`.

:::tip
Testar não exige saber como a função faz. Exige saber o que ela promete.
:::

---

## :icon[test-tube] Seu primeiro teste

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

- **`describe`** agrupa os testes de uma função
- **`test`** é um caso: um nome que se lê como frase e uma função com a conferência
- **`expect(valor)`** recebe o resultado; o **matcher** (`toBe`, `toContain`) diz o que você espera dele

Rode `npm test` e leia o resumo: `Tests: 2 passed, 2 total`.

---

## :icon[bug] Lendo uma falha

Agora, o texto inteiro do nome cortado. Você copia as reticências de um documento, e o teste falha:

```javascript
expect(abreviar('Caixa de Som Portátil', 15)).toBe('Caixa de Som…');
```

```plaintext
Expected: "Caixa de Som…"
Received: "Caixa de Som..."
```

Olhe de perto: o teste espera **um** caractere de reticências (`…`), que editores de texto e celulares trocam sozinhos; a função promete **três pontos**. A promessa está no comentário da função: quem corrige é o teste, com `'Caixa de Som...'`.

Leia toda falha nesta ordem: o nome do teste, o **Expected** (o que você pediu), o **Received** (o que veio) e a linha marcada com `>`. Depois decida: o erro está no código ou no teste?

---

## :icon[list-checks] Matchers: as formas de conferir

| Matcher | Passa quando o resultado... | Exemplo na Lojinha |
|---|---|---|
| `toBe(v)` | é exatamente `v` | `abreviar('Fone Bluetooth', 20)` é `'Fone Bluetooth'` |
| `toEqual(v)` | tem o mesmo conteúdo | a primeira categoria é `{ slug: 'audio', nome: 'Áudio' }` |
| `toContain(x)` | contém `x` | o nome cortado tem `'...'` |
| `toHaveLength(n)` | tem `n` itens ou caracteres | o catálogo tem 4 categorias |
| `toThrow()` | lança um erro | as regras do E17 |

Qualquer matcher aceita **`.not`** antes: `expect(abreviar('Fone Bluetooth', 20)).not.toContain('...')` confere que um nome que cabe não ganha reticências.

---

## :icon[equal] toBe ou toEqual?

As categorias de `src/data/produtos.js` (E02) são objetos. Compare:

```javascript
// src/data/produtos.test.js
import { categorias } from './produtos.js';

test('a primeira é Áudio', () => {
  expect(categorias[0]).toBe({ slug: 'audio', nome: 'Áudio' }); // falha
  expect(categorias[0]).toEqual({ slug: 'audio', nome: 'Áudio' }); // passa
});
```

- `categorias[0]` é o primeiro item da lista
- **`toBe`** pergunta "é o **mesmo** valor?". Para texto e número, basta ser igual; para objeto e array, precisa ser o mesmo na memória
- **`toEqual`** compara o conteúdo, campo por campo e item por item
- Na falha do `toBe`, o Jest avisa: `Received: serializes to the same string`. O conteúdo bate; a comparação é que está errada

Regra prática: `toBe` para texto, número e booleano; `toEqual` para objetos e arrays.

---

## :icon[list-ordered] Arrange, act, assert

Todo teste bom tem três partes, nesta ordem:

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

- **Arrange** prepara os dados; **act** chama a função; **assert** confere
- `const` dá um nome a um valor (E05): aqui, a entrada e a saída
- A partir do E08, as regras recebem listas de produtos. No arrange, monte uma lista pequena, **feita para o teste**: com o catálogo inteiro, o teste quebraria a cada preço novo, sem bug nenhum

---

## :icon[table] Vários casos com test.each

Escolha casos de três tipos: o **caminho feliz**, as **bordas** (vazio, limite exato) e, quando a função valida dados (E06), as **entradas erradas**. Quando só a entrada muda, use uma tabela:

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

Cada linha vira um teste, com o nome montado pelo `%p`. As bordas pegam bugs reais: com `<` no lugar de `<=` no `abreviar`, a linha do limite exato fica vermelha com `Received: "Fone Blueto..."`.

---

## Pense

:::question
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

## :icon[repeat] TDD: o teste vem antes

No **TDD** (desenvolvimento guiado por testes), você escreve o teste antes do código, em três passos curtos que se repetem:

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

Primeiro, o teste do caminho feliz, no `texto.test.js`. O `boasVindas` ainda não existe:

```javascript
import { abreviar, boasVindas } from './texto.js';

test('cumprimenta pelo nome', () => {
  expect(boasVindas('Ana')).toBe('Olá, Ana!');
});
```

```plaintext
TypeError: (0 , _texto.boasVindas) is not a function
```

O Jest avisa que `boasVindas` não é uma função: ela não existe. Vermelho, como devia. Um teste que nasce verde pode não estar conferindo nada; ver o vermelho prova que ele detecta a falta da função.

---

## :icon[circle-check] TDD: verde

O mínimo para passar, no `texto.js`; o `+` junta os pedaços de texto:

```javascript
export function boasVindas(nome) {
  return 'Olá, ' + nome + '!';
}
```

Verde. O próximo teste é a borda do Pense: `expect(boasVindas('  Ana ')).toBe('Olá, Ana!')`.

```plaintext
Expected: "Olá, Ana!"
Received: "Olá,   Ana !"
```

Vermelho de novo: os espaços digitados entraram na mensagem. A correção usa o `trim()`, que tira os espaços das pontas de um texto (E06): `return 'Olá, ' + nome.trim() + '!';`. Os dois testes, verdes.

---

## :icon[wrench] TDD: refatorar

Com tudo verde, melhore o código **sem mudar o que ele faz**. Os testes também são código: os dois testes quase iguais viram uma tabela.

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

`npm test`: os mesmos dois casos, verdes. Agora, o terceiro caso do Pense, `'Ana Souza'`, é só uma linha nova na tabela. Se ela ficar vermelha, o ciclo recomeça.

---

## :icon[chart-bar] Cobertura: o que os testes visitam

Imagine o `texto.js` com as duas funções e um teste só: o do nome longo no `abreviar`. O relatório denuncia:

```bash
npm test -- --coverage
```

```plaintext
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
texto.js  |      50 |       50 |      50 |   66.66 | 8
```

- **% Funcs**: funções chamadas por algum teste; o `boasVindas` nunca rodou
- **% Branch**: caminhos de decisão percorridos; o `if` do `abreviar` seguiu só um dos dois
- **Uncovered Line #s**: linhas que nenhum teste executou; a 8 é a do `boasVindas`

A cobertura mostra o que **não** foi testado. 100% não prova que não há bug: um teste sem `expect` visita a linha e não confere nada. O relatório fica na pasta `coverage/`.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Nome errado, como `texto.teste.js`: o Jest não acha o arquivo e avisa `No tests found`
- Sem o `babel.config.json` na raiz: o Jest pode parar com `Must use import to load ES Module`
- Import sem extensão (`'./texto'`): o Jest até acha, mas o Node não (E02). Escreva `'./texto.js'`
- `toBe` com objeto ou array: use `toEqual`
- Valor esperado copiado de um documento: `…` não é `...`, e aspas curvas não são retas
- Teste sem `expect`: passa sempre e não protege nada
- Ver o teste novo passar de primeira e confiar: quebre o código de propósito e confira que ele fica vermelho
:::

---

## Resumo

:::summary
- O Jest roda os arquivos `.test.js`, que ficam ao lado do código em `src/`; o `babel.config.json` traduz o `import` para ele
- `describe` agrupa, `test` descreve um caso e `expect` com um matcher confere: `toBe` para texto e número, `toEqual` para objetos e arrays
- Cada teste segue arrange, act, assert; `test.each` cobre muitos casos numa tabela, bordas incluídas
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
