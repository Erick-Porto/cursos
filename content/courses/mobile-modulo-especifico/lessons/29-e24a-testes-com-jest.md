---
title: Testes automatizados com Jest
summary: Jest no app Expo, describe, test e expect, matchers, arrange-act-assert, TDD e cobertura nas regras da Lojinha.
module: ambiente-js
duration_minutes: 40
objectives:
  - Configurar o Jest com o preset jest-expo e escrever testes com describe, test e expect
  - Organizar cada teste em arrange, act, assert e escolher o matcher certo
  - Aplicar um ciclo de TDD e ler o relatório de cobertura
---

# Testes automatizados com Jest

Programador Mobile: Módulo Específico · Encontro E24 · Aula 29 de 71

---

## O que você vai aprender

:::goal
- Instalar o Jest com o preset `jest-expo` e rodar `npm test`
- Escrever testes com `describe`, `test`, `expect` e os matchers mais usados
- Organizar cada teste em arrange, act, assert
- Fazer um ciclo de TDD e ler o relatório de cobertura
:::

---

## O preço que sumiu

Na quinta, você muda o `formatarPreco` para esconder os centavos nos destaques do Início. A vitrine fica ótima. Na sexta, um cliente manda o print do carrinho: "Total: R$ 200", quando a conta dava R$ 199,90. A mesma função formata preços em várias telas, e você conferiu só uma.

Conferir à mão as funções de `src/utils/` a cada mudança custa muitos minutos de toques no celular. Um **teste automatizado** é um código que chama a sua função e confere o resultado: roda todas as conferências em segundos, sempre do mesmo jeito.

:::question
Que funções da Lojinha você testaria primeiro, e por quê?
:::

---

## :icon[terminal] Jest no projeto Expo

O **Jest** é o executor de testes padrão do React Native. O preset **`jest-expo`** configura o Jest como o Metro: entende JSX e TypeScript e simula os módulos nativos do celular.

```bash
npx expo install jest-expo jest -- --save-dev
```

No `package.json`, acrescente o script e a configuração:

```json
"scripts": {
  "test": "jest"
},
"jest": {
  "preset": "jest-expo"
}
```

- `npm test` roda todos os arquivos terminados em `.test.js` (ou `.test.ts`)
- O teste fica **ao lado** do código: `src/utils/validar.test.js` testa `validar.js`
- Os testes rodam no Node do computador (E21), sem celular
- Nunca coloque testes dentro de `app/`: lá, todo arquivo vira rota

---

## :icon[test-tube] Seu primeiro teste

```javascript
// src/utils/validar.test.js
import { validarEmail } from './validar';

describe('validarEmail', () => {
  test('aceita um e-mail válido', () => {
    expect(validarEmail('ana@loja.com')).toBeNull();
  });

  test('pede o e-mail quando o campo está vazio', () => {
    expect(validarEmail('')).toBe('Informe seu e-mail');
  });
});
```

- **`describe`** agrupa os testes de uma função
- **`test`** é um caso: um nome que se lê como frase e uma função com a conferência
- **`expect(valor)`** recebe o resultado; o **matcher** (`toBe`, `toBeNull`) diz o que você espera dele

Rode `npm test` e leia o resumo: `Tests: 2 passed, 2 total`.

---

## :icon[bug] Lendo uma falha

Agora o `formatarPreco`. O teste parece óbvio, mas falha:

```javascript
expect(formatarPreco(199.9)).toBe('R$ 199,90');
```

```plaintext
Expected: "R$ 199,90"
Received: "R$ 199,90"
```

Os dois textos parecem iguais, e não são. Entre `R$` e o número, o `toLocaleString` põe um **espaço que não quebra** (`\u00a0`), para o preço nunca se partir em duas linhas no cartão. O teste achou um detalhe que o olho não vê:

```javascript
expect(formatarPreco(199.9)).toBe('R$\u00a0199,90');
```

Leia toda falha nesta ordem: o nome do teste, o **Expected** (o que você pediu), o **Received** (o que veio) e a linha marcada com `>`.

---

## :icon[list-checks] Matchers: as formas de conferir

| Matcher | Passa quando o resultado... | Exemplo na Lojinha |
|---|---|---|
| `toBe(v)` | é exatamente `v` | `mascararTelefone('11')` é `'(11'` |
| `toEqual(v)` | tem o mesmo conteúdo | ids filtrados são `[2, 1]` |
| `toBeNull()` | é `null` | `validarEmail` sem erro |
| `toHaveLength(n)` | tem `n` itens | 2 produtos de áudio na lista |
| `toContain(x)` | contém `x` | o preço formatado tem `'199,90'` |
| `toThrow()` | lança um erro | as regras do E32 |

Qualquer matcher aceita **`.not`** antes: `expect(validarEmail('ana')).not.toBeNull()` confere que veio uma mensagem de erro.

---

## :icon[equal] toBe ou toEqual?

O `aplicarFiltros` devolve um **array novo**. Compare:

```javascript
const ids = aplicarFiltros(lista, filtros).map((p) => p.id);

expect(ids).toBe([2, 1]);    // falha: são dois arrays diferentes
expect(ids).toEqual([2, 1]); // passa: o conteúdo é o mesmo
```

- **`toBe`** pergunta "é o **mesmo** valor?". Para texto e número, basta ser igual; para array e objeto, precisa ser o mesmo na memória
- **`toEqual`** percorre o conteúdo, item por item e campo por campo
- Na falha do `toBe`, o Jest avisa: `Received: serializes to the same string`. É a dica de que o conteúdo bate e a comparação é que está errada

Regra prática: `toBe` para texto, número e booleano; `toEqual` para arrays e objetos.

---

## :icon[list-ordered] Arrange, act, assert

Todo teste bom tem três partes, nesta ordem:

```javascript
test('filtra pela categoria e ordena pelo menor preço', () => {
  // arrange: uma lista pequena, feita para o teste
  const lista = [
    { id: 1, nome: 'Fone Bluetooth', preco: 199.9, categoria: 'audio', avaliacao: 4.5 },
    { id: 2, nome: 'Caixa de Som', preco: 89.9, categoria: 'audio', avaliacao: 4.8 },
    { id: 3, nome: 'Bola de Futebol', preco: 59.9, categoria: 'esporte', avaliacao: 4.1 },
  ];
  // act: uma chamada só
  const resultado = aplicarFiltros(lista, { categoria: 'audio', ordem: 'preco' });
  // assert: o que a tela vai mostrar
  expect(resultado.map((p) => p.id)).toEqual([2, 1]);
});
```

- **Arrange** prepara os dados; **act** chama a função; **assert** confere
- Use uma lista **feita para o teste**, não o `catalogo.json`: se alguém mudar um preço do catálogo, o teste não pode quebrar sem haver bug

---

## :icon[table] Vários casos com test.each

Escolha casos de três tipos: o **caminho feliz**, as **bordas** (vazio, limite, excesso) e as **entradas erradas**. Quando só a entrada muda, use uma tabela:

```javascript
import { mascararTelefone } from './mascaras';

test.each([
  ['', ''],                                // vazio
  ['abc', ''],                             // entrada errada
  ['11', '(11'],                           // só o DDD
  ['1198765', '(11) 98765'],               // digitando
  ['11987654321', '(11) 98765-4321'],      // completo
  ['(11) 98765-43219', '(11) 98765-4321'], // excesso: corta
])('mascararTelefone(%p) devolve %p', (entrada, esperado) => {
  expect(mascararTelefone(entrada)).toBe(esperado);
});
```

Cada linha vira um teste, com o nome montado pelo `%p`: `mascararTelefone("11") devolve "(11"`. Se uma linha falha, o relatório diz qual.

---

## Pense

:::question
O `validarEmail` da Lojinha faz `trim()`, devolve `'Informe seu e-mail'` para campo vazio, `'Use o formato nome@exemplo.com'` para formato errado e `null` quando está tudo certo. Liste quatro casos de teste, com entrada e resultado esperado, cobrindo caminho feliz, bordas e entrada errada.
:::

:::tip Resposta
| Entrada | Esperado | Tipo |
|---|---|---|
| `'ana@loja.com'` | `null` | caminho feliz |
| `'  ana@loja.com '` | `null` | borda: espaços nas pontas |
| `'   '` | `'Informe seu e-mail'` | borda: só espaços |
| `'ana.loja.com'` | mensagem de formato | entrada errada |

Os dois do meio pegam bugs de verdade: sem o `trim()`, o e-mail colado com espaço seria recusado.
:::

---

## :icon[repeat] TDD: o teste vem antes

No **TDD** (desenvolvimento guiado por testes), você escreve o teste antes do código, em três passos curtos que se repetem:

::::columns
:::col
![Animação: os três passos do TDD aparecem em sequência; vermelho, o teste falha; verde, o teste passa; refatorar, tudo segue verde; e a seta do próximo teste volta ao vermelho](images/e24-ciclo-tdd.svg)
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

Bug real: um cliente cola `+55 11 98765-4321` no cadastro e o campo mostra `(55) 11987-6543`. Primeiro, o teste que reproduz o bug:

```javascript
test('tira o +55 de um número colado', () => {
  expect(mascararTelefone('+55 11 98765-4321')).toBe('(11) 98765-4321');
});
```

`npm test`: vermelho, com `Received: "(55) 11987-6543"`. O bug agora tem prova.

---

## :icon[circle-check] TDD: verde e refatorar

**Verde**: a primeira versão separa o `slice(0, 11)` e, antes dele, corta o `55` quando vêm 13 dígitos. Passa, mas o `'55'` e o `13` ficam soltos no meio da função. **Refatorar**: com o teste verde, dê nome à regra.

```javascript
const CODIGO_DO_BRASIL = '55';

function tirarCodigoDoPais(digitos) {
  const temCodigo = digitos.length === 13 && digitos.startsWith(CODIGO_DO_BRASIL);
  return temCodigo ? digitos.slice(2) : digitos;
}

export function mascararTelefone(texto) {
  const d = tirarCodigoDoPais(texto.replace(/\D/g, '')).slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}
```

Os 7 testes seguem verdes: o novo e os 6 antigos, que garantem que nada mais quebrou.

---

## :icon[chart-bar] Cobertura: o que os testes visitam

```bash
npm test -- --coverage
```

```plaintext
File         | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
filtrar.js   |     100 |      100 |     100 |     100 |
mascaras.js  |     100 |      100 |     100 |     100 |
validar.js   |   35.71 |       25 |      20 |   36.36 | 4,14-25
```

- **% Funcs**: funções chamadas por algum teste. Em `validar.js`, só o `validarEmail` tem teste
- **% Branch**: caminhos de `if` e `?:` percorridos
- **Uncovered Line #s**: linhas que nenhum teste executou

A cobertura mostra o que **não** foi testado. 100% não prova que não há bug: um teste sem `expect` visita a linha e não confere nada. O Jest grava o relatório na pasta `coverage/`, que fica fora do Git.

---

## :icon[smartphone] Testes de componente: uma visão

As funções puras são a base. Um degrau acima, a **React Native Testing Library** desenha um componente no Node e simula o toque:

```jsx
import { render, screen, userEvent } from '@testing-library/react-native';
import { TemaProvider } from '../../theme/TemaContext';
import Botao from './Botao';

test('o Botao chama onPress no toque', async () => {
  const aoTocar = jest.fn();
  const user = userEvent.setup();
  await render(<TemaProvider><Botao titulo="Comprar" onPress={aoTocar} /></TemaProvider>);
  await user.press(screen.getByText('Comprar'));
  expect(aoTocar).toHaveBeenCalledTimes(1);
});
```

- `jest.fn()` cria uma função espiã, que conta as chamadas
- O `TemaProvider` em volta é obrigatório: o `Botao` usa `useTema()`
- No topo ficam os testes **ponta a ponta**: um robô usa o app instalado

Hoje o laboratório fica nas funções puras.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Teste dentro de `app/`: o Expo Router trata o arquivo como rota. Testes ficam em `src/`, ao lado do código
- `toBe` com array ou objeto: use `toEqual`
- Digitar espaço comum no preço esperado: o `formatarPreco` usa `\u00a0`
- Testar com o `catalogo.json` de verdade: o teste quebra quando o catálogo muda, sem bug nenhum
- Teste sem `expect`: passa sempre e não protege nada
- Ver o teste novo passar de primeira e confiar: quebre o código de propósito e confira que ele fica vermelho
:::

---

## Resumo

:::summary
- O `jest-expo` configura o Jest como o Metro; `npm test` roda os arquivos `.test.js`, que ficam ao lado do código em `src/`
- `describe` agrupa, `test` descreve um caso e `expect` com um matcher confere: `toBe` para primitivos, `toEqual` para arrays e objetos
- Cada teste segue arrange, act, assert, com dados feitos para ele; `test.each` cobre muitos casos numa tabela
- TDD é vermelho, verde, refatorar: o teste do bug vem antes da correção
- `--coverage` mostra o que nenhum teste visitou, não a ausência de bugs
:::

---

## Próximos passos

Na próxima aula, os testes deixam de depender da sua memória:

- :icon[terminal] o script `verificar`, que roda o lint e os testes de uma vez
- :icon[variable] o `.env` com `EXPO_PUBLIC_`, para configurar o app sem expor segredo
- :icon[workflow] o GitHub Actions rodando tudo a cada push, com selo no README

No laboratório, os quatro utilitários de `src/utils/` ganham pelo menos 12 testes. A partir do E25, cada regra de negócio da Lojinha nasce com os testes dela.
