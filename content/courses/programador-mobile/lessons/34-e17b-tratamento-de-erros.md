---
title: Tratamento de erros
summary: Lance, capture e teste erros, crie erros próprios com código e leve cada falha à mensagem certa no terminal.
module: classes-e-controle
duration_minutes: 40
objectives:
  - Lançar e capturar erros com throw, try, catch e finally
  - Criar erros próprios com a propriedade codigo em src/modelos/erros.js
  - Distinguir um erro esperado de um bug e relançar o que não é seu
  - Testar o caminho do erro no Jest com toThrow
---

# Tratamento de erros

Programador Mobile · Encontro E17 · Aula 34 de 89

---

## O que você vai aprender

:::goal
- Lançar e capturar erros com `throw`, `try`, `catch` e `finally`
- Criar `src/modelos/erros.js` com erros próprios que têm a propriedade `codigo`
- Separar o erro esperado, que a pessoa resolve, do bug, que você corrige
- Testar o caminho do erro no Jest e levar cada falha à mensagem certa no terminal
:::

---

## O CEP que virou frete grátis

A cliente digita o CEP com um número a menos. Rode o script do E16 com ele:

```bash
node src/scripts/formas-de-pagamento.js 0131000
```

```plaintext
Produtos (2): R$ 134,80
Frete: R$ 0,00
Pix com 5% de desconto: R$ 128,06
```

O `calcularFrete` do E13 devolve `null` para CEP inválido, o script monta a entrega como `null` e o `Pedido` conta frete zero. A loja paga a entrega e nenhuma mensagem aparece. Um valor especial escondido entre os números é fácil de esquecer: basta um script que não confira.

:::question
Como a regra pode avisar quem a chamou de um jeito que não dê para ignorar?
:::

---

## :icon[octagon-alert] throw: parar e avisar

**`throw`** lança uma **exceção**: a função para na hora, nenhuma linha abaixo roda e o erro sobe para quem a chamou, e para quem chamou essa, até alguém capturar.

```javascript
// src/regras/checkout.js
import { calcularFrete } from './frete.js';

export function freteDoCep(subtotal, cep) {
  const frete = calcularFrete(subtotal, cep);
  if (frete === null) {
    throw new Error(`CEP inválido: ${cep}`);
  }
  return frete; // daqui para baixo, frete é sempre um número
}
```

Se ninguém capturar, o Node para o script e mostra `Error: CEP inválido: 0131000` com o caminho das chamadas, a **pilha** (*stack*), a partir de `at freteDoCep`. É o mesmo `throw` do `deJSON` do E15 e do cartão em 0x do E16. E é isso que você quer: o problema não passa despercebido.

---

## :icon[shield-alert] try e catch: capturar o erro

```javascript
try {
  const frete = freteDoCep(89.9, '0131000');
  console.log('Frete:', frete);  // só roda se não houve erro
} catch (erro) {
  console.log(erro.name);        // Error
  console.log(erro.message);     // CEP inválido: 0131000
}
console.log('o script continua');
```

- O **`try`** roda até a primeira exceção e pula direto para o **`catch`**
- `erro` é o objeto lançado: `message` tem o texto, `name` o tipo e `stack` o caminho das chamadas
- Depois do `catch`, o código segue normalmente: o erro foi **tratado**

---

## :icon[check-check] finally: o que roda sempre

O **`finally`** roda no fim, com erro ou sem erro, mesmo que o `try` tenha um `return`. Ele fecha o que você abriu, como um cronômetro (`console.time` liga, `console.timeEnd` mostra o tempo):

```javascript
function simularEntrega(itens, cep) {
  console.time('simulação');
  try {
    const resumo = resumoDaEntrega(itens, cep); // soma os itens e chama freteDoCep
    console.log(resumo);
  } catch (erro) {
    console.log(erro.message);
  } finally {
    console.timeEnd('simulação'); // desliga o cronômetro nos dois casos
  }
}
```

| Caso | O que roda |
|---|---|
| Sem erro | o `try` inteiro e o `finally` |
| Com erro | o `try` até o `throw`, o `catch` e o `finally` |
| `return` no `try` ou no `catch` | o `finally`, antes de a função devolver |

No E18, as Promises ganham um `finally` próprio, para quando a espera termina.

---

## :icon[arrow-up] O erro sobe até o catch mais próximo

:::center
![Animação: o throw em freteDoCep sobe por resumoDaEntrega, que não tem try, e para no catch de simularEntrega; o console.log do resumo não roda, o catch mostra a mensagem e o finally desliga o cronômetro](images/e17-erro-sobe.svg)
:::

`resumoDaEntrega` soma os itens com o `subtotal` do E07 e chama `freteDoCep`, sem `try`. Quando `freteDoCep` lança, o erro atravessa `resumoDaEntrega` e para no `catch` de `simularEntrega`: o `console.log(resumo)` não roda, o `catch` mostra a mensagem e o `finally` desliga o cronômetro.

---

## Pense

:::question
O que aparece no terminal com `testar('123')`? E com `testar('01310000')`, um CEP válido?

```javascript
function testar(cep) {
  try {
    console.log('A');
    freteDoCep(100, cep);
    console.log('B');
  } catch (erro) {
    console.log('C');
  } finally {
    console.log('D');
  }
  console.log('E');
}
```
:::

:::tip Resposta
Com `'123'`: A, C, D, E. O `throw` dentro de `freteDoCep` pula o `B` e vai direto ao `catch`. Com `'01310000'`: A, B, D, E. O `catch` é pulado e o `finally` roda do mesmo jeito. Nos dois casos o `E` aparece, porque o erro foi tratado.
:::

---

## :icon[bug] Erro esperado ou bug?

| | Erro esperado | Bug |
|---|---|---|
| Exemplos | CEP inválido, cupom vencido, estoque acabou | `undefined.nome`, `NaN` no total |
| Culpa de quem | da situação | do código |
| Quem resolve | a pessoa, com uma boa mensagem | você, corrigindo o código |
| O que fazer | lançar um erro próprio e mostrar a mensagem | deixar estourar e corrigir |

Erros do próprio JavaScript, como um **`TypeError`** ao ler `produto.nome` com `produto` indefinido, quase sempre são bugs. E o cartão em 0x que o `PagamentoCartao` do E16 recusa? Com parcelas escolhidas numa lista de 1x a 12x, um 0x só nasce de bug; se a pessoa digitasse as parcelas, seria esperado.

---

## :icon[file-code] Erros próprios: a base e o CEP

Com `extends Error`, a herança do E16, cada situação esperada ganha uma classe em `src/modelos/erros.js`. A base **`ErroDeNegocio`** marca os erros que o programa sabe tratar e guarda o **`codigo`**: fixo, para o programa decidir. O `message` é o texto para a pessoa.

```javascript
export class ErroDeNegocio extends Error {
  constructor(mensagem, codigo) {
    super(mensagem); // o Error guarda a message
    this.name = 'ErroDeNegocio';
    this.codigo = codigo;
  }
}

export class CepInvalidoError extends ErroDeNegocio {
  constructor(cep) {
    super(`Confira o CEP ${cep}: ele precisa ter 8 números.`, 'CEP_INVALIDO');
    this.name = 'CepInvalidoError';
    this.cep = cep;
  }
}
```

Escreva o `name` à mão: sem ele, `erro.name` sobe a cadeia da aula 33 e acha o `'Error'` de `Error.prototype`.

---

## :icon[file-code] Erros próprios: cupom e estoque

O mesmo arquivo, com as outras duas situações da compra:

```javascript
export class CupomInvalidoError extends ErroDeNegocio {
  constructor(cupom, motivo = 'Este cupom não vale para este pedido') {
    super(motivo, 'CUPOM_INVALIDO'); // o motivo vem do validarCupom do E13
    this.name = 'CupomInvalidoError';
    this.cupom = cupom;
  }
}

export class EstoqueInsuficienteError extends ErroDeNegocio {
  constructor(nome, disponivel) {
    super(`${nome}: só ${disponivel} em estoque.`, 'ESTOQUE_INSUFICIENTE');
    this.name = 'EstoqueInsuficienteError';
    this.disponivel = disponivel;
  }
}
```

| Classe | `codigo` | Dado extra |
|---|---|---|
| `CepInvalidoError` | `CEP_INVALIDO` | `cep` |
| `CupomInvalidoError` | `CUPOM_INVALIDO` | `cupom` |
| `EstoqueInsuficienteError` | `ESTOQUE_INSUFICIENTE` | `disponivel` |

---

## :icon[shopping-cart] Lance na regra, trate em quem chama

No `alterarQuantidade` do E07, entra uma guarda no começo:

```javascript
// src/regras/carrinho.js
import { EstoqueInsuficienteError } from '../modelos/erros.js';

export function alterarQuantidade(itens, id, qtd) {
  const item = itens.find((i) => i.id === id);
  if (item && qtd > item.estoque) {
    throw new EstoqueInsuficienteError(item.nome, item.estoque);
  }
  if (qtd <= 0) return removerItem(itens, id);
  return itens.map((i) => (i.id === id ? { ...i, qtd } : i));
}
```

- A guarda vem antes de qualquer conta: se ela lança, nenhuma lista nova nasce e a recebida continua igual
- A regra não imprime nada nem escolhe a mensagem final: quem chama decide. Hoje, um script; no E30, a tela do app
- No laboratório, o `estoque` entra nos 12 produtos e o `criarItem` do E07 passa a copiá-lo para a linha do carrinho; sem isso, `item.estoque` é `undefined` e a guarda nunca dispara

---

## :icon[test-tube] Testando quem lança

Os testes esperam `CepInvalidoError`: troque o `new Error` de `freteDoCep` por `new CepInvalidoError(cep)`.

```javascript
import { freteDoCep } from './checkout.js';
import { CepInvalidoError } from '../modelos/erros.js';

test('CEP com 7 números lança CepInvalidoError', () => {
  expect(() => freteDoCep(100, '0131000')).toThrow(CepInvalidoError);
});

test('o erro traz o código CEP_INVALIDO', () => {
  let erro;
  try { freteDoCep(100, 'abc'); } catch (e) { erro = e; }
  expect(erro.codigo).toBe('CEP_INVALIDO');
});
```

- **`toThrow`** recebe uma **função**: a arrow adia a chamada para dentro do `expect`
- Sem a arrow, a exceção estoura antes do `expect` e o teste quebra
- Se nada for lançado, `erro` fica `undefined` e o segundo teste também falha, como deve

---

## :icon[message-square] O código decide, a mensagem explica

Cada falha precisa chegar à pessoa com o texto certo, no lugar certo. No terminal, o "lugar" é um rótulo antes da mensagem, escolhido pelo `codigo` com o `switch` do E13:

```javascript
function rotulo(erro) {
  switch (erro.codigo) {
    case 'CEP_INVALIDO': return 'Entrega';
    case 'CUPOM_INVALIDO': return 'Cupom';
    case 'ESTOQUE_INSUFICIENTE': return 'Carrinho';
    default: return 'Aviso';
  }
}
// Entrega: Confira o CEP 0131000: ele precisa ter 8 números.
```

- O `codigo` não muda nunca e serve ao programa; o `message` pode ser reescrito sem quebrar nada
- A mensagem diz o que aconteceu e o que fazer, sem culpar ninguém. Nunca "Erro CEP_INVALIDO"
- No app, do E30 em diante, o mesmo `codigo` escolhe o lugar na tela: o CEP embaixo do campo, o estoque num aviso rápido

---

## :icon[circle-alert] Trate o esperado, relance o bug

O `catch` de `simularEntrega`, na versão final de `src/scripts/simular-entrega.js`:

```javascript
} catch (erro) {
  if (!(erro instanceof ErroDeNegocio)) throw erro; // bug: não esconda
  console.log(`${rotulo(erro)}: ${erro.message}`);
} finally {
  console.timeEnd('simulação');
}
```

```bash
node src/scripts/simular-entrega.js 0131000
# Entrega: Confira o CEP 0131000: ele precisa ter 8 números.
```

- **`instanceof`** sobe a cadeia da aula 33: `ErroDeNegocio.prototype` está na cadeia de todos os filhos
- **Relançar** com `throw erro` deixa o bug aparecer com a pilha, em vez de virar "Confira o CEP"
- O `finally` roda mesmo quando o `catch` relança

---

## Pratique

:::example Desafio
No mesmo script, `aumentar(itens, id)` soma uma unidade com `alterarQuantidade`, que pode lançar `EstoqueInsuficienteError`. Escreva a função: se der certo, devolve a lista nova; se o estoque acabar, imprime o rótulo e a mensagem e devolve a lista de antes; qualquer outro erro sobe.
:::

:::tip Resposta
```javascript
function aumentar(itens, id) {
  const item = itens.find((i) => i.id === id);
  try {
    return alterarQuantidade(itens, id, item.qtd + 1);
  } catch (erro) {
    if (!(erro instanceof EstoqueInsuficienteError)) throw erro;
    console.log(`${rotulo(erro)}: ${erro.message}`);
    return itens; // a quantidade fica como estava
  }
}
```

Com a Luminária de Mesa (estoque 2) em 2 unidades, `aumentar` imprime "Carrinho: Luminária de Mesa: só 2 em estoque." e a lista continua com 2, porque a regra lançou antes de criar a lista nova.
:::

---

## :icon[triangle-alert] Erros comuns

:::warning
- `catch` que imprime "Algo deu errado" para tudo: o bug some e a pessoa recebe um aviso falso
- `expect(freteDoCep(100, 'abc')).toThrow()`, sem arrow: a exceção estoura antes do `expect`
- Lançar texto, como `throw 'CEP inválido'`: sem `message`, sem `stack` e sem `instanceof`
- Usar `this` antes do `super(mensagem)` no constructor: numa filha, o objeto ainda não existe
- Esquecer o `this.name`: todos os erros aparecem como `Error` na pilha
- Mostrar `erro.codigo` para a pessoa: o código é para o programa, a pessoa lê `message`
:::

---

## Resumo

:::summary
- `throw` interrompe a função e o erro sobe até um `try...catch`; o `finally` roda nos dois casos
- Erro esperado (CEP, cupom, estoque) vira mensagem; bug se corrige, e o `catch` o relança
- `src/modelos/erros.js` tem a base `ErroDeNegocio` e três erros próprios com `codigo` e um dado extra
- A regra pura lança antes de criar dados novos; quem chama escolhe a mensagem pelo `codigo`
- No Jest, `expect(() => ...).toThrow(Classe)` testa o caminho do erro
:::

Na aula 35, o JavaScript aprende a **esperar**: event loop, callbacks e Promises. O frete e o pagamento passam a demorar, e os erros de hoje chegam depois.

---

## :icon[flask-conical] No laboratório

Os erros próprios da Lojinha, com testes, e um script que leva cada falha à mensagem certa.

:::steps
1. `src/modelos/erros.js`: a base e os três filhos, com `name`, `codigo` e o dado extra; `erros.test.js`
2. `src/regras/checkout.js`: `freteDoCep` com `CepInvalidoError`; `checkout.test.js`
3. `estoque` nos 12 produtos de `src/data/produtos.js` (Luminária de Mesa com 2) e a guarda em `alterarQuantidade`, com 2 testes
4. `src/modelos/cadeia.test.js`: testes que provam a cadeia das suas classes
5. `src/scripts/simular-entrega.js`: rode com um CEP válido e com um inválido
6. `npm run verificar` sem erros, commit "E17: erros próprios" e `git push`
:::

**Critérios de entrega**: nenhum `catch` sem `instanceof`; nenhuma regra com `console.log`; nenhum `codigo` nas mensagens; testes passando. Entregue o link do repositório no sistema.
