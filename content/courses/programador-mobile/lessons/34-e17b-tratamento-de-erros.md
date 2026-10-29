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

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **exceção** | um aviso de erro que para a função na hora e sobe até alguém tratar |
| **lançar** (`throw`) | criar a exceção: "parei aqui, deu problema" |
| **capturar** (`catch`) | pegar a exceção e tratar, sem deixar o programa cair |
| **erro esperado** | uma situação prevista, como um CEP errado, que a pessoa resolve com uma boa mensagem |
| **bug** | um defeito no código; quem resolve é você, corrigindo |
| **pilha** (*stack*) | a lista das chamadas, de função em função, até onde o erro aconteceu |

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

O `calcularFrete` do E13 devolve `null` para CEP inválido, o script monta a entrega como `null` e o `Pedido` conta frete zero. A loja paga a entrega e nenhuma mensagem aparece. Um valor especial escondido entre os números é fácil de esquecer: um único script que não confira já dá o prejuízo.

:::question
Como a regra pode avisar quem a chamou de um jeito que não dê para ignorar?
:::

---

## Lançar um erro

O que acontece com o número do trapezista quando ele erra o salto?

---

## :icon[octagon-alert] throw: parar e avisar

Pense no trapezista do circo. Se ele cai, o número para na hora, e ele cai até a rede de proteção. **`throw`** (lançar) é essa queda: lança uma **exceção**. A função para na hora, nenhuma linha abaixo roda e o erro sobe para quem a chamou, e para quem chamou essa, até alguém capturar.

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

É o mesmo `throw` do `deJSON` do E15 e do cartão em 0x do E16.

---

## :icon[list-ordered] O throw em português

| Linha | O que ela diz |
|---|---|
| `calcularFrete(subtotal, cep)` | a regra do E13: devolve o frete, ou `null` para CEP inválido |
| `if (frete === null)` | "o CEP veio errado?" |
| `throw new Error(...)` | "pare aqui e avise": cria um erro com este texto e o lança |
| `` `CEP inválido: ${cep}` `` | o texto do erro, a **mensagem** (*message*) |
| `return frete` | só chega aqui quem passou pela conferência |

Se ninguém capturar, o Node para o script e mostra `Error: CEP inválido: 0131000` e o caminho das chamadas, a **pilha** (*stack*), a partir de `at freteDoCep`. É isso que você quer: o problema não passa despercebido.

---

## :icon[octagon-alert] throw na prática

**Caso 1: com CEP válido, nada é lançado.**

```javascript
freteDoCep(89.9, '01310000'); // 9.9: o frete de São Paulo
```

**Caso 2: com CEP errado, o script para ali.**

```javascript
console.log('antes');
freteDoCep(89.9, '0131000');
console.log('depois'); // nunca roda
```

```plaintext
antes
Error: CEP inválido: 0131000
    at freteDoCep (.../src/regras/checkout.js:6:11)
```

No terminal, o Node também mostra a linha do código, com um `^` embaixo do `throw`.

**Caso 3: o `throw` do E15.** `Produto.deJSON({ nome: 'Fone' })` para com `Error: Produto inválido no JSON`: sem preço, nenhum produto nasce.

---

## try e catch

Por que o espetáculo continua quando o trapezista cai?

---

## :icon[shield-alert] try e catch: capturar o erro

Embaixo do trapezista fica a rede de proteção: se ele cair, a rede segura e o espetáculo continua. O **`try`** (tentar) é o número feito em cima da rede. O **`catch`** (pegar) é a rede: recebe o erro e trata.

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

- O `try` roda até a primeira exceção e pula direto para o `catch`
- `erro` é o objeto lançado: `message` tem o texto, `name` o tipo e `stack` o caminho das chamadas
- Depois do `catch`, o código segue normalmente: o erro foi **tratado**

---

## :icon[shield-alert] try e catch na prática

**Caso 1: uma lista de CEPs.** Um CEP errado não impede os outros:

```javascript
for (const cep of ['01310000', '123', '20040002']) {
  try {
    console.log(`${cep}: ${freteDoCep(89.9, cep)}`);
  } catch (erro) {
    console.log(`${cep}: ${erro.message}`);
  }
}
```

```plaintext
01310000: 9.9
123: CEP inválido: 123
20040002: 14.9
```

**Caso 2: um catálogo com um produto quebrado.** O preço `'249,90'` é texto, e o `deJSON` do E15 lança:

```javascript
const dados = [{ nome: 'Fone', preco: 199.9 }, { nome: 'Caixa', preco: '249,90' }];
for (const d of dados) {
  try {
    console.log(Produto.deJSON(d).precoFormatado);
  } catch (erro) {
    console.log(`${d.nome}: ${erro.message}`);
  }
}
// R$ 199,90
// Caixa: Produto inválido no JSON
```

---

## finally

Com queda ou sem queda, o que acontece no picadeiro no fim do número?

---

## :icon[check-check] finally: o que roda sempre

No fim do número, com queda ou sem queda, alguém arruma o picadeiro. O **`finally`** (por fim) roda no fim, com erro ou sem erro, mesmo que o `try` tenha um `return`. Ele fecha o que você abriu, como um cronômetro (`console.time` liga, `console.timeEnd` mostra o tempo):

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

## :icon[check-check] finally na prática

O `finally` roda até quando o `try` ou o `catch` têm `return`: ele vem antes de a função devolver o valor.

```javascript
function freteDoResumo(cep) {
  try {
    return freteDoCep(89.9, cep);
  } catch (erro) {
    return 0;
  } finally {
    console.log('consulta encerrada');
  }
}

console.log(freteDoResumo('01310000'));
console.log(freteDoResumo('123'));
```

```plaintext
consulta encerrada
9.9
consulta encerrada
0
```

- CEP válido: o `try` devolve 9.9, mas antes o `finally` escreve a linha dele
- CEP errado: o `catch` devolve 0, e o `finally` roda do mesmo jeito

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

## Esperado ou bug

Tanque vazio e defeito de fábrica: quem resolve cada um?

---

## :icon[bug] Erro esperado ou bug?

Pense num carro. Tanque vazio é previsto: o painel avisa e o motorista resolve, abastecendo. Defeito de fábrica é outra coisa: quem resolve é a oficina. No código, o tanque vazio é o **erro esperado**; o defeito de fábrica é o **bug**.

| | Erro esperado | Bug |
|---|---|---|
| Exemplos | CEP inválido, cupom vencido, estoque acabou | `undefined.nome`, `NaN` no total |
| Culpa de quem | da situação | do código |
| Quem resolve | a pessoa, com uma boa mensagem | você, corrigindo o código |
| O que fazer | lançar um erro próprio e mostrar a mensagem | deixar estourar e corrigir |

---

## :icon[scale] Esperado ou bug na prática

```javascript
freteDoCep(89.9, '0131000');
// Error: CEP inválido: 0131000            esperado: a pessoa corrige o CEP

const produto = produtos.find((p) => p.id === 99); // não existe: undefined
produto.nome;
// TypeError: Cannot read properties of undefined (reading 'nome')   bug

'199,90' * 2;
// NaN                                     bug: o preço chegou como texto
```

Erros do próprio JavaScript, como esse **`TypeError`**, quase sempre são bugs: a pessoa não tem o que fazer com "Cannot read properties of undefined".

E o cartão em 0x que o `PagamentoCartao` do E16 recusa? Escolhido numa lista de 1x a 12x, um 0x só nasce de bug. Digitado pela pessoa, é esperado. A pergunta que decide: a pessoa consegue resolver com uma boa mensagem? Se sim, é esperado.

---

## Erros próprios

Por que cada luz do painel tem um símbolo fixo, se o manual já explica tudo?

---

## :icon[file-code] Erros próprios: a base e o CEP

Cada luz do painel do carro tem um símbolo fixo, e o manual explica o que fazer. Os erros da Lojinha seguem a mesma ideia. Com `extends Error`, a herança do E16, cada situação esperada ganha uma classe em `src/modelos/erros.js`. A base **`ErroDeNegocio`** marca os erros que o programa sabe tratar e guarda o **`codigo`**: fixo, para o programa decidir, como o símbolo da luz. O `message` é o texto para a pessoa.

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

---

## :icon[list-ordered] O erro próprio em português

| Linha | O que ela diz |
|---|---|
| `class ErroDeNegocio extends Error` | "é um tipo de `Error`": herda a `message` e a `stack` |
| `super(mensagem)` | "monte a parte de `Error` com este texto": guarda a `message` |
| `this.name = 'ErroDeNegocio'` | o nome do tipo, que aparece na pilha |
| `this.codigo = codigo` | o código fixo, para o programa decidir |
| `` super(`Confira o CEP ...`, 'CEP_INVALIDO') `` | o filho passa à base a mensagem e o código |
| `this.cep = cep` | o dado extra: o CEP que veio errado |

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

No `alterarQuantidade` do E07, entra uma **guarda**: um `if` no começo que barra o que não pode seguir.

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

## :icon[file-code] Erros próprios na prática

**Caso 1: o que um erro próprio carrega.**

```javascript
const erro = new EstoqueInsuficienteError('Luminária de Mesa', 2);
erro.message;                  // 'Luminária de Mesa: só 2 em estoque.'
erro.codigo;                   // 'ESTOQUE_INSUFICIENTE'
erro instanceof ErroDeNegocio; // true: é da família
```

**Caso 2: o cupom, com e sem motivo.**

```javascript
new CupomInvalidoError('NATAL25', 'Este cupom expirou').message; // 'Este cupom expirou'
new CupomInvalidoError('XYZ').message; // 'Este cupom não vale para este pedido'
```

**Caso 3: a guarda do estoque.** A lista recebida não muda:

```javascript
const itens = [{ id: 4, nome: 'Luminária de Mesa', preco: 89.9, estoque: 2, qtd: 2 }];
alterarQuantidade(itens, 4, 3); // lança EstoqueInsuficienteError
itens[0].qtd;                   // 2
```

---

## Testar o erro

Como provar, sem rodar o script à mão, que a regra recusa um CEP errado?

---

## :icon[test-tube] Testando quem lança

Um teste é uma prova com gabarito que o computador corrige (E04). Para um erro, o gabarito diz: "esta chamada precisa lançar `CepInvalidoError`". Antes, troque o `new Error` de `freteDoCep` por `new CepInvalidoError(cep)`: é ele que os testes esperam.

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

- **`toThrow`** (lança) recebe uma **função**: a arrow adia a chamada para dentro do `expect`. Você entrega a receita, e o Jest cozinha
- Sem a arrow, a exceção estoura antes do `expect` e o teste quebra
- Se nada for lançado, `erro` fica `undefined` e o segundo teste também falha, como deve

---

## :icon[test-tube] Testar o erro na prática

Três jeitos de conferir um erro no Jest, e o resultado de cada um:

```javascript
// 1. pela classe do erro: verde
expect(() => freteDoCep(100, '0131000')).toThrow(CepInvalidoError);

// 2. pelo texto da mensagem (itens: a Luminária, estoque 2, já com 2): verde
expect(() => alterarQuantidade(itens, 4, 3)).toThrow('Luminária de Mesa: só 2 em estoque.');

// 3. sem a arrow: vermelho, o erro estoura antes do expect
expect(freteDoCep(100, '0131000')).toThrow(CepInvalidoError);
```

- Com um texto, o `toThrow` confere se a mensagem **contém** esse texto
- Use a classe quando importa o tipo do erro; o texto, quando importa o que a pessoa vai ler
- O terceiro é o erro mais comum do laboratório: sem a arrow, não há receita para o Jest cozinhar

---

## A mensagem certa

Acende uma luz no painel e aparece só "Erro 0x3F". Isso ajuda alguém?

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

Um exemplo de bug: `subtotl(itens)`, com uma letra a menos, lança `ReferenceError` antes mesmo de `freteDoCep` rodar. Sem a linha do `instanceof`, ele viraria "Aviso: subtotl is not defined".

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

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Error: ...` seguido de linhas `at` | um erro que ninguém capturou | a primeira linha `at` diz onde ele nasceu; capture em quem chama |
| `Must call super constructor` | `this` antes do `super(...)` | `super` primeiro |
| `does not provide an export named` | o nome no `import` está diferente | conferir a grafia, com chaves |
| `erro.message` sai `undefined` | lançaram um texto, não um `Error` | `throw new CepInvalidoError(cep)` |
| `ReferenceError: ... is not defined` | um nome escrito errado: é bug | corrigir o nome; nunca esconder no `catch` |

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

---

## :icon[milestone] Projeto 3 · Etapa 5: erros próprios e formulário

No seu repositório `lista-de-tarefas`:

- `ErroDeTarefa(mensagem, codigo)` e os filhos `TituloInvalidoError`, `PrazoInvalidoError` e `TarefaNaoEncontradaError`
- a `Tarefa` e a `ListaDeTarefas` lançam: título vazio, curto ou repetido, prazo errado, id sumido
- o formulário cria a tarefa (`submit` com `preventDefault`), e o `codigo` escolhe onde a mensagem aparece: embaixo do título ou do prazo
- testes com `toThrow(Classe)` nas bordas de 2, 3, 80 e 81 caracteres

Commit: `Projeto 3: etapa 5, erros próprios e formulário`. Enunciado completo e entrega: página do curso, em **Projetos**.
