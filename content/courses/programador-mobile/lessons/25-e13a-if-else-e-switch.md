---
title: Decisões com if, else e switch
summary: "Faixas com else if, switch com casos agrupados e as armadilhas de truthy e falsy nas regras da Lojinha."
module: classes-e-controle
duration_minutes: 40
objectives:
  - Ordenar as faixas de um else if e testar cada borda com Jest
  - Usar switch com default, return ou break e casos agrupados
  - Prever se um valor é truthy ou falsy e evitar a armadilha do 0
  - Traduzir o status do pedido em texto e tom, impressos no terminal
---

# Decisões com if, else e switch

Programador Mobile · Encontro E13 · Aula 25 de 89

---

## O que você vai aprender

:::goal
- Ordenar as faixas de um `else if` e testar cada **borda** com Jest
- Usar `switch` com `default`, `return` ou `break` e casos agrupados
- Prever o que é **truthy** e **falsy**, e fugir da armadilha do `0`
- Traduzir o status do pedido em texto e tom, impressos no terminal
:::

---

## Um pedido, muitas decisões

A API de pedidos não manda texto nem cor: manda só `status: 'enviado'`. Quem decide que o relatório escreve "A caminho" é o código. No E30, o mesmo dado vira um selo colorido no app, e a regra que decide é a mesma de hoje.

No resumo da compra é igual: frete grátis ou pago, em quantas parcelas, cupom aceito ou recusado. No E07a você escreveu `if`, `else` e as faixas de `maximoDeParcelas`. Agora as decisões crescem: faixas com teste, vários valores possíveis e valores que enganam a condição.

:::question
Pense na última compra que você fez num app. Quantas decisões ele tomou antes de mostrar o resumo do pedido?
:::

---

## :icon[test-tube] As faixas do E07a, com teste

No E07a, `maximoDeParcelas` escolheu 1, 3, 6 ou 10 parcelas com `else if`, e a faixa fora de ordem virou **código morto** sem erro nenhum. Hoje ela vai para `src/regras/precos.js`, com `export`, e ganha testes no fim de `precos.test.js` (com `maximoDeParcelas` no `import` do topo):

```javascript
describe('maximoDeParcelas', () => {
  test('um preço dentro de cada faixa', () => {
    expect(maximoDeParcelas(49.9)).toBe(1);
    expect(maximoDeParcelas(199.9)).toBe(3);
    expect(maximoDeParcelas(459.9)).toBe(6);
  });
  test('cada borda já abre a faixa seguinte', () => {
    expect(maximoDeParcelas(50)).toBe(3);
    expect(maximoDeParcelas(300)).toBe(6);
    expect(maximoDeParcelas(1000)).toBe(10);
  });
});
```

Bug de faixa mora na **borda**, o valor exato em que uma faixa termina e a outra começa. Com as faixas invertidas, os dois testes ficam vermelhos.

---

## Pense

:::question
O selo de avaliação usa `>=`, e não `<`:

```javascript
function seloDaAvaliacao(nota) {
  if (nota >= 3) {
    return 'Boa';
  } else if (nota >= 4) {
    return 'Muito boa';
  } else if (nota >= 4.5) {
    return 'Excelente';
  } else {
    return 'Sem selo';
  }
}
```

Que selo recebe o Fone Bluetooth, de nota 4.6? Algum produto ganha "Excelente"?
:::

:::tip Resposta
"Boa". Toda nota a partir de 3 entra no primeiro `if`: "Muito boa" e "Excelente" viraram código morto.

| Comparação | Ordem das faixas | Exemplo |
|---|---|---|
| `<` ou `<=` | da menor para a maior | `maximoDeParcelas` |
| `>` ou `>=` | da maior para a menor | `seloDaAvaliacao` |

Em qualquer comparação, cada condição só pode deixar passar a faixa dela.
:::

---

## :icon[package] Os cinco status de um pedido

Um pedido da Lojinha passa por estes **status**. Cada um vira um texto e um **tom**, o tipo de aviso:

| `status` | Texto | `tom` |
|---|---|---|
| `'pendente'` | Aguardando pagamento | `alerta` |
| `'pago'` | Pagamento aprovado | `sucesso` |
| `'enviado'` | A caminho | `neutro` |
| `'entregue'` | Entregue | `sucesso` |
| `'cancelado'` | Cancelado | `perigo` |

Hoje o tom aparece entre colchetes no relatório do terminal; no E30, ele escolhe a cor do selo no app. Um status fora da tabela, como um novo que a API passe a mandar, vira "Status desconhecido", tom `neutro`: a regra não pode quebrar por causa dele.

`textoDoStatus(status)` e `tomDoStatus(status)` moram em `src/regras/pedido.js`.

---

## :icon[list-checks] switch: um valor, vários casos

Quando a decisão compara **o mesmo valor** com várias opções fixas, o **`switch`** lê melhor que cinco `else if`. Este é o corpo de `textoDoStatus(status)`:

```javascript
switch (status) {
  case 'pendente':
    return 'Aguardando pagamento';
  case 'pago':
    return 'Pagamento aprovado';
  case 'enviado':
    return 'A caminho';
  case 'entregue':
    return 'Entregue';
  case 'cancelado':
    return 'Cancelado';
  default:
    return 'Status desconhecido';
}
```

- Cada `case` compara com `===`: `'Pago'`, com maiúscula, não entra em `'pago'`
- O `return` entrega o texto e sai da função
- O **`default`** cobre qualquer outro valor, inclusive `undefined`

---

## :icon[arrow-down] Sem return nem break, a execução desce

Quando o `case` não sai da função com `return`, ele precisa terminar com **`break`**. Sem ele, a execução continua no `case` de baixo:

```javascript
let tom;
switch (status) {
  case 'pendente':
    tom = 'alerta'; // faltou o break
  case 'cancelado':
    tom = 'perigo';
    break;
  default:
    tom = 'neutro';
}
```

Com `status = 'pendente'`, o `tom` termina `'perigo'`: o relatório marca como perigo o pedido que só espera o pagamento, como se tivesse sido cancelado. Esse "descer" se chama **fall-through**, ou cascata.

:::tip
Numa função que devolve o resultado, como `tomDoStatus`, use `return` em cada `case`: ele sai na hora e dispensa o `break`.
:::

---

## :icon[arrow-down] A cascata, passo a passo

:::center
![Animação: com status 'pendente', a execução entra no case 'pendente' e faz tom = 'alerta', desce sem break pelo case 'cancelado', troca para tom = 'perigo' e só sai no break; o default não roda](images/e13-switch-cascata.svg)
:::

A execução passa pelo `case 'cancelado'` sem comparar nada: o `tom` vira `'alerta'`, logo depois `'perigo'`, e só o `break` faz sair do `switch`. O `default` nem chega a rodar.

---

## :icon[combine] Casos agrupados: tomDoStatus

A cascata também serve de propósito: um `case` vazio seguido de outro **agrupa** valores com o mesmo resultado.

```javascript
export function tomDoStatus(status) {
  switch (status) {
    case 'pendente':
      return 'alerta';
    case 'pago':
    case 'entregue':
      return 'sucesso';
    case 'cancelado':
      return 'perigo';
    default:
      return 'neutro'; // enviado e status desconhecido
  }
}
```

`'pago'` entra no seu `case`, que está vazio, e desce até o primeiro comando: o `return 'sucesso'` que ele divide com `'entregue'`.

---

## :icon[square-terminal] O relatório de pedidos

```javascript
// src/scripts/pedidos.js
import { textoDoStatus, tomDoStatus } from '../regras/pedido.js';

const pedidos = [
  { id: 1041, status: 'entregue' },
  { id: 1042, status: 'enviado' },
  { id: 1043, status: 'pendente' },
  { id: 1044, status: 'devolvido' },
];

for (const pedido of pedidos) {
  const texto = textoDoStatus(pedido.status);
  console.log(`#${pedido.id}  ${texto}  [${tomDoStatus(pedido.status)}]`);
}
```

```plaintext
$ node src/scripts/pedidos.js
#1041  Entregue  [sucesso]
#1042  A caminho  [neutro]
#1043  Aguardando pagamento  [alerta]
#1044  Status desconhecido  [neutro]
```

O `'devolvido'` não está na tabela e cai no `default` das duas funções: o relatório segue até o fim.

---

## :icon[scale] if, switch ou dicionário?

| A decisão é... | Use | Na Lojinha |
|---|---|---|
| faixas e comparações | `if` e `else if` | parcelas pelo preço |
| um valor contra opções fixas | `switch` | tom do status |
| traduzir um valor em outro | objeto como dicionário | `rotulosDeOrdem`, do E08 |
| dois valores, uma linha | ternário, do E05b | "item" ou "itens" |

O `textoDoStatus` também caberia num dicionário, como o `rotulosDeOrdem` do E08. O `switch` ganha quando há **grupos** de valores e um `default` que precisa ficar à vista. Com `<` e `>=`, só o `if` serve: o `case` compara apenas com `===`.

---

## :icon[circle-help] Truthy e falsy

No E05b, você viu que só seis valores contam como falso: são os **falsy**. Dentro do `if`, eles decidem o caminho, e os que enganam estão do outro lado:

| Falsy | Truthy que engana |
|---|---|
| `false` | `'false'` |
| `0` | `'0'` |
| `''` (texto vazio) | `' '` (um espaço) |
| `null` e `undefined` | `[]` (array vazio) |
| `NaN` | `{}` (objeto vazio) |

Todo o resto é **truthy**.

```javascript
if (cep) { /* ... */ }          // '' não entra; '   ' entra
if (itens.length) { /* ... */ } // carrinho com 0 itens não entra
if (itens) { /* ... */ }        // entra sempre, até com []
```

---

## :icon[bug] A armadilha do zero

Nas regras da Lojinha, `0` costuma ser um valor **válido**: frete grátis, desconto zero, carrinho vazio.

```javascript
const frete = 0; // frete grátis
if (frete) {
  console.log('Frete: Grátis'); // nunca roda: 0 é falsy
}
```

O curto-circuito do E05b engana do mesmo jeito: `0 && 'ok'` dá `0`, e não `false`. Num resumo:

```javascript
const desconto = 0;
const linha = desconto && `Desconto: ${formatarPreco(desconto)}`;
console.log(linha); // 0: o resumo imprime um zero solto
```

No E30, esse mesmo `0` solto derruba a tela do app.

:::tip
Escreva a condição que você quer dizer: `frete === 0`, `desconto > 0`, `itens.length > 0`.
:::

---

## Pratique

:::example Desafio
A regra de frete da aula 26 devolve `null` quando o CEP falta ou é inválido, `0` quando o frete é grátis e o valor em reais nos outros casos. Escreva `textoDoFrete(frete)` com `if`, `else if` e `else`, devolvendo:

- `'Informe o CEP'` para `null`
- `'Grátis'` para `0`
- o valor com `formatarPreco` para o resto
:::

:::tip Resposta
```javascript
function textoDoFrete(frete) {
  if (frete === null) {
    return 'Informe o CEP';
  } else if (frete === 0) {
    return 'Grátis';
  } else {
    return formatarPreco(frete);
  }
}
```

Com `if (!frete)`, os dois primeiros casos se misturam: no frete grátis, o cliente leria "Informe o CEP". Na aula 26, esta função encolhe com guard clauses.
:::

---

## :icon[triangle-alert] Erros comuns

:::warning
- `if (status === 'pago' || 'entregue')`: o lado direito é um texto, sempre truthy, e a condição vale para qualquer status. Escreva `status === 'pago' || status === 'entregue'`
- `else if` fora de ordem: a faixa mais larga primeiro engole as outras; com `>=`, a maior vem primeiro
- `case` sem `break` nem `return`: a execução desce para o caso de baixo
- `switch` sem `default`: um status novo da API vira `undefined` no relatório
- `if (frete)` ou `desconto && ...` quando `0` é um valor válido
- `'Pago'` ou `' pago'` no lugar de `'pago'`: o `case` compara com `===`, sem tolerância
:::

---

## Resumo

:::summary
- `else if` para no primeiro acerto: com `<`, a menor faixa vem primeiro; com `>=`, a maior. Um teste por faixa e por borda pega a ordem errada
- `switch` compara um valor com `===` contra cada `case`; o `default` cobre o resto
- Sem `return` nem `break`, a execução desce para o `case` seguinte; `case` vazios agrupam valores de propósito
- Falsy são `false`, `0`, `''`, `null`, `undefined` e `NaN`; todo o resto é truthy, e o `&&` devolve um dos lados
- `textoDoStatus` e `tomDoStatus` traduzem o status do pedido no relatório do terminal
:::

---

## :icon[arrow-right] Próximos passos

A aula 26 deixa as decisões curtas e fáceis de ler, e leva as regras para o laboratório:

- :icon[arrow-left-right] ternário encadeado e quando preferir o `if`
- :icon[shield-check] `??` e `?.` para valores que faltam, sem `TypeError`
- :icon[corner-down-right] condições com nome e guard clauses
- :icon[truck] `src/regras/frete.js` e `src/regras/pedido.js` com testes, e frete e cupom calculados no terminal
