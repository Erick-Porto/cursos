---
title: Tratamento de erros
summary: Lance, capture e teste erros, crie erros próprios com código e leve cada falha ao componente certo da tela.
module: logica-js
duration_minutes: 40
objectives:
  - Lançar e capturar erros com throw, try, catch e finally
  - Criar erros próprios com a propriedade codigo em src/modelos/erros.js
  - Distinguir um erro esperado de um bug
  - Mostrar cada erro na tela com Campo, Toast ou EstadoErro
---

# Tratamento de erros

Programador Mobile: Módulo Específico · Encontro E32 · Aula 45 de 71

---

## O que você vai aprender

:::goal
- Lançar e capturar erros com `throw`, `try`, `catch` e `finally`
- Criar `src/modelos/erros.js` com erros próprios que têm a propriedade `codigo`
- Separar o erro esperado, que o usuário resolve, do bug, que você corrige
- Testar o caminho do erro no Jest e mostrar cada erro com `Campo`, `Toast` ou `EstadoErro`
:::

---

## O CEP que virou frete grátis

A cliente digita o CEP com um número a menos: `0131000`. No E26, `calcularFrete` devolve `null` para CEP inválido, e a tela soma sem desconfiar:

```javascript
const frete = calcularFrete(subtotal, cep); // null
const total = subtotal + frete;             // 89.9 + null dá 89.9
```

Na soma, o `null` virou zero. O pedido sai sem frete, a loja paga a entrega e nenhuma mensagem aparece. Um valor especial escondido entre os números é fácil de esquecer: basta uma tela que não confira.

:::question
Como a regra pode avisar a tela de um jeito que ela não consiga ignorar?
:::

---

## :icon[octagon-alert] throw: parar e avisar

**`throw`** lança uma **exceção**: a função para na hora, nenhuma linha abaixo roda e o erro sobe para quem a chamou, e para quem chamou essa, até alguém capturar.

```javascript
// src/regras/checkout.js
import { calcularFrete } from './frete';

export function freteDoCep(subtotal, cep) {
  const frete = calcularFrete(subtotal, cep);
  if (frete === null) {
    throw new Error(`CEP inválido: ${cep}`);
  }
  return frete; // daqui para baixo, frete é sempre um número
}
```

Se ninguém capturar, a tela vermelha mostra a mensagem durante o desenvolvimento e o app instalado pode fechar. É exatamente o que você quer: o problema não passa despercebido.

---

## :icon[shield-alert] try e catch: capturar o erro

```javascript
try {
  const frete = freteDoCep(subtotal, cep);
  console.log('Frete:', frete);  // só roda se não houve erro
} catch (erro) {
  console.log(erro.name);        // Error
  console.log(erro.message);     // CEP inválido: 0131000
}
console.log('o app continua');
```

- O **`try`** roda até a primeira exceção e pula direto para o **`catch`**
- `erro` é o objeto lançado: `message` tem o texto, `name` o tipo e `stack` o caminho das chamadas
- Depois do `catch`, o código segue normalmente: o erro foi **tratado**

---

## :icon[check-check] finally: o que roda sempre

O **`finally`** roda no fim, com erro ou sem erro, mesmo que o `try` tenha um `return`. Ele desfaz o que você começou, como travar o botão de envio:

```jsx
function finalizar() {
  setEnviando(true);
  try {
    const pedido = fecharPedido(dados); // monta o pedido; pode lançar
    registrar(pedido);
    router.replace('/confirmacao');
  } catch (erro) {
    mostrarErro(erro);
  } finally {
    setEnviando(false); // destrava o botão nos dois casos
  }
}
```

| Caso | O que roda |
|---|---|
| Sem erro | o `try` inteiro e o `finally` |
| Com erro | o `try` até o `throw`, o `catch` e o `finally` |

No E37 o envio fica assíncrono, e o `finally` passa a esconder o "Enviando..." de verdade.

---

## :icon[arrow-up] O erro sobe até o catch mais próximo

:::center
![Animação: o throw em freteDoCep sobe por fecharPedido, que não tem catch, e para no catch de finalizar; registrar não roda, mostrarErro trata o erro e o finally roda setEnviando(false)](images/e32-erro-sobe.svg)
:::

O `fecharPedido` chama `freteDoCep`, que lança. Sem `catch` no caminho, o erro atravessa `fecharPedido` e para no `catch` de `finalizar`: o `registrar` não roda, o `mostrarErro` trata o erro e o `finally` destrava o botão.

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
| Quem resolve | o usuário, com uma boa mensagem | você, corrigindo o código |
| O que fazer | lançar um erro próprio e tratar na tela | deixar estourar e corrigir |

Erros do próprio JavaScript, como o **`TypeError`** de `Cannot read property 'nome' of undefined`, quase sempre são bugs. E o cartão em 0x que o `PagamentoCartao` do E31 recusa? Com parcelas vindas de botões de 1x a 12x, um 0x só nasce de bug; se a pessoa digitasse as parcelas, seria esperado.

---

## :icon[file-code] Erros próprios: a base e o CEP

Com `extends Error`, a herança do E31, cada situação esperada ganha uma classe em `src/modelos/erros.js`. A base **`ErroDeNegocio`** marca os erros que a tela sabe tratar e guarda o **`codigo`**: fixo, para o programa decidir. O `message` é o texto para a pessoa.

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

Escreva o `name` à mão: no app publicado, o código é minificado e o nome da classe pode mudar.

---

## :icon[file-code] Erros próprios: cupom e estoque

O mesmo arquivo, com as outras duas situações do checkout:

```javascript
export class CupomInvalidoError extends ErroDeNegocio {
  constructor(cupom, motivo = 'Este cupom não vale para este pedido') {
    super(motivo, 'CUPOM_INVALIDO'); // o motivo vem do validarCupom do E26
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

## :icon[shopping-cart] Lance na regra, trate na tela

A regra pura lança, o contexto repassa e a tela decide como mostrar. No `alterarQuantidade` do E28, entra uma guarda no começo:

```javascript
// src/regras/carrinho.js
export function alterarQuantidade(itens, id, qtd) {
  const item = itens.find((i) => i.id === id);
  if (item && qtd > item.estoque) {
    throw new EstoqueInsuficienteError(item.nome, item.estoque);
  }
  // ...o resto continua como no E28
}
```

```javascript
// src/contexts/CarrinhoContext.js, como no E28
function alterar(id, qtd) {
  setItens(alterarQuantidade(itens, id, qtd)); // a regra roda antes do setItens
}
```

O argumento é calculado **antes** de o `setItens` ser chamado: se a regra lança, o estado não muda e o erro chega à tela. Já dentro de `setItens((atual) => ...)`, a regra roda na renderização, e o erro estoura longe do `catch` da tela.

---

## :icon[test-tube] Testando quem lança

```javascript
import { freteDoCep } from './checkout';
import { CepInvalidoError } from '../modelos/erros';

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

Os testes usam `CepInvalidoError`: troque o `new Error` de `freteDoCep` por `new CepInvalidoError(cep)`.

---

## :icon[message-square] Da exceção à tela

Cada erro aparece **perto de onde o usuário pode resolvê-lo**:

| Erro | Onde aparece | Componente |
|---|---|---|
| `CepInvalidoError` | embaixo do campo do CEP | `Campo` com `erro` |
| `CupomInvalidoError` | embaixo do campo do cupom | `Campo` com `erro` |
| `EstoqueInsuficienteError` | aviso rápido, quantidade mantida | `Toast` |
| Falha ao carregar a tela | a tela inteira | `EstadoErro` |
| Bug | tela vermelha no desenvolvimento | nenhum: corrija |

A mensagem diz o que aconteceu e o que fazer, sem culpar ninguém: "Confira o CEP 0131000: ele precisa ter 8 números", nunca "Erro CEP_INVALIDO".

---

## :icon[circle-alert] Na tela: trate o esperado, relance o bug

```jsx
function aoSairDoCep() {
  try {
    freteDoCep(subtotal, cep); // só confere: o frete da tela sai da renderização
    setErros({ ...erros, cep: null });
  } catch (erro) {
    if (!(erro instanceof ErroDeNegocio)) throw erro; // bug: não esconda
    setErros({ ...erros, cep: erro.message });
  }
}

<Campo rotulo="CEP" value={cep} onChangeText={setCep} onBlur={aoSairDoCep}
  keyboardType="number-pad" maxLength={9} erro={erros.cep} />
```

- **`instanceof`** pergunta se o erro é um dos seus, e vale para todas as subclasses
- **Relançar** com `throw erro` deixa o bug aparecer em vez de virar "CEP inválido"
- O texto chega pronto em `erro.message`: a tela não monta mensagem

---

## Pratique

:::example Desafio
No Carrinho, o botão + chama `alterar(item.id, item.qtd + 1)` do contexto, que pode lançar `EstoqueInsuficienteError`. Escreva `aumentar(item)`: a mensagem vai para um `Toast` e qualquer outro erro estoura. Use um estado `aviso` que começa em `null`.
:::

:::tip Resposta
```jsx
function aumentar(item) {
  try {
    alterar(item.id, item.qtd + 1);
  } catch (erro) {
    if (!(erro instanceof EstoqueInsuficienteError)) throw erro;
    setAviso(erro.message);
  }
}

<Toast mensagem={aviso} visivel={aviso !== null} onSumir={() => setAviso(null)} />
```

A quantidade fica como estava, porque o `setItens` nunca rodou. O `Toast` vai no fim da tela, como último filho da `View` com `flex: 1`.
:::

---

## :icon[triangle-alert] Erros comuns

:::warning
- `catch` que mostra "Algo deu errado" para tudo: o bug some e o usuário recebe um aviso falso
- `expect(freteDoCep(100, 'abc')).toThrow()`, sem arrow: a exceção estoura antes do `expect`
- Lançar texto, como `throw 'CEP inválido'`: sem `message`, sem `stack` e sem `instanceof`
- Esquecer o `super(mensagem)` no construtor: o JavaScript não deixa usar `this` antes dele
- Chamar a regra dentro de `setItens((atual) => ...)`: o erro estoura na renderização
- Mostrar `erro.codigo` na tela: o código é para o programa, a pessoa lê `message`
:::

---

## Resumo

:::summary
- `throw` interrompe a função e o erro sobe até um `try...catch`; o `finally` roda nos dois casos
- Erro esperado (CEP, cupom, estoque) vira mensagem na tela; bug se corrige, e o `catch` o relança
- `src/modelos/erros.js` tem a base `ErroDeNegocio` e três erros próprios com `codigo` e um dado extra
- A regra pura lança antes de mudar o estado; a tela escolhe entre `Campo`, `Toast` e `EstadoErro`
- No Jest, `expect(() => ...).toThrow(Classe)` testa o caminho do erro
:::

---

## Próximos passos

Na aula 46, as regras e os modelos de E25 a E31 e os erros de hoje viram o **checkout completo** da Lojinha: CEP e frete, cupom, forma de pagamento, confirmação do pedido e "Meus pedidos" no Perfil.

:::tip Antes do laboratório
Rode `npm test` no seu projeto: o checkout começa com a suíte verde. Tenha à mão `frete.js` e `pedido.js` do E26 e as classes de pagamento do E31.
:::
