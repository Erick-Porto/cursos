---
title: Decisões com if, else e switch
summary: Faça o app decidir com if, else if, else e switch, sem cair nas armadilhas de truthy e falsy.
module: logica-js
duration_minutes: 40
objectives:
  - Escrever decisões com if, else if e else, com as faixas na ordem certa
  - Usar switch com default, break e casos agrupados
  - Prever se um valor é truthy ou falsy dentro de uma condição
  - Traduzir o status do pedido em texto e tom do Badge
---

# Decisões com if, else e switch

Programador Mobile: Módulo Específico · Encontro E26 · Aula 33 de 71

---

## O que você vai aprender

:::goal
- Escrever decisões com `if`, `else if` e `else`, com as faixas na ordem certa
- Usar `switch` com `default`, `break` e casos agrupados
- Prever o que é **truthy** e **falsy**, e fugir da armadilha do `0`
- Traduzir o status do pedido em texto e tom do `Badge`
:::

---

## Um pedido, muitas decisões

Na tela "Meus pedidos" de um app de loja, cada cartão tem um selo: "Aguardando pagamento" em âmbar, "A caminho", "Cancelado" em vermelho. O servidor não manda o texto nem a cor: manda só `status: 'enviado'`. Quem decide o que aparece é o app.

No carrinho é igual: frete grátis ou pago, em quantas parcelas, cupom aceito ou recusado. Cada regra dessas é uma **decisão** no código.

:::question
Pense na última compra que você fez num app. Quantas decisões ele tomou antes de mostrar o resumo do pedido?
:::

---

## :icon[split] if: só quando a condição vale

O **`if`** executa um bloco só quando a **condição** entre parênteses dá `true`.

```javascript
const FRETE_GRATIS_A_PARTIR_DE = 150;
let aviso = 'Frete calculado pelo CEP';

if (subtotal >= FRETE_GRATIS_A_PARTIR_DE) {
  aviso = 'Você ganhou frete grátis';
}
```

- A condição é qualquer expressão que dá `true` ou `false`: `>=`, `===`, `&&`, `!`
- Com subtotal de R$ 199,90, o aviso muda; com R$ 129,80, fica o texto inicial
- Com mais de um comando, as chaves são obrigatórias. A forma sem chaves fica para uma linha só, como `if (cep === '') return null;`

---

## :icon[git-fork] else: o outro caminho

Com o **`else`**, exatamente um dos dois blocos roda:

```javascript
let aviso;
if (subtotal >= FRETE_GRATIS_A_PARTIR_DE) {
  aviso = 'Você ganhou frete grátis';
} else {
  const falta = FRETE_GRATIS_A_PARTIR_DE - subtotal;
  aviso = `Faltam ${formatarPreco(falta)} para o frete grátis`;
}
```

| Subtotal | Aviso no carrinho |
|---|---|
| R$ 199,90 | Você ganhou frete grátis |
| R$ 150,00 | Você ganhou frete grátis |
| R$ 129,80 | Faltam R$ 20,20 para o frete grátis |

A linha de R$ 150,00 confere a **borda**: com `>=`, o valor exato já ganha o frete.

---

## :icon[list-ordered] else if: faixas em ordem

Quantas parcelas sem juros a Lojinha oferece, pelo preço do produto:

```javascript
function maximoDeParcelas(preco) {
  if (preco < 50) {
    return 1;
  } else if (preco < 300) {
    return 3;
  } else if (preco < 1000) {
    return 6;
  } else {
    return 10;
  }
}
```

::::columns
:::col
![Diagrama: as quatro faixas de maximoDeParcelas lado a lado; abaixo de R$ 50 dá 1x, de 50 a 300 dá 3x, de 300 a 1.000 dá 6x e o else dá 10x; o Fone de R$ 199,90 cai na faixa de 3x](images/e26-faixas-de-parcelas.svg)
:::
:::col
- O JavaScript testa de cima para baixo e para no **primeiro** `true`
- Por isso `preco < 300` já quer dizer "de 50 a 299,99": a faixa de baixo saiu antes
- O `else` final pega todo o resto: R$ 1.000 ou mais
- O Fone Bluetooth, de R$ 199,90, cai na segunda faixa: "ou 3x de R$ 66,63"
:::
::::

---

## Pense

:::question
Alguém "organizou" a função pondo a faixa maior primeiro:

```javascript
if (preco < 1000) {
  return 6;
} else if (preco < 300) {
  return 3;
} else if (preco < 50) {
  return 1;
} else {
  return 10;
}
```

Quantas parcelas aparecem para o Livro de Receitas, de R$ 59,90? E para o Fone Bluetooth, de R$ 199,90? Algum produto ainda recebe 1 ou 3?
:::

:::tip Resposta
6 para os dois. Todo preço abaixo de 1000 entra no primeiro `if`, e os `else if` seguintes nunca rodam: 1 e 3 viraram código morto. Com `<`, ordene da faixa menor para a maior. Um teste com um preço de cada faixa pega esse erro na hora.
:::

---

## :icon[package] Os cinco status de um pedido

Um pedido da Lojinha passa por estes **status**. Cada um vira um texto e um `tom` do `Badge` do UI kit:

| `status` | Texto no selo | `tom` |
|---|---|---|
| `'pendente'` | Aguardando pagamento | `alerta` |
| `'pago'` | Pagamento aprovado | `sucesso` |
| `'enviado'` | A caminho | `neutro` |
| `'entregue'` | Entregue | `sucesso` |
| `'cancelado'` | Cancelado | `perigo` |

Um status fora da lista, como um novo que o servidor passe a mandar, mostra "Status desconhecido" com tom `neutro`: o app não pode quebrar por causa dele.

Duas funções fazem a tradução, `textoDoStatus(status)` e `tomDoStatus(status)`, em `src/regras/pedido.js`.

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

Com `status = 'pendente'`, o `tom` termina `'perigo'`: o pedido que só espera o pagamento aparece em vermelho, como se tivesse sido cancelado. Esse "descer" se chama **fall-through**, ou cascata.

:::tip
Numa função que devolve o resultado, como `tomDoStatus`, use `return` em cada `case`: ele sai na hora e dispensa o `break`.
:::

---

## :icon[arrow-down] A cascata, passo a passo

:::center
![Animação: com status 'pendente', a execução entra no case 'pendente' e faz tom = 'alerta', desce sem break pelo case 'cancelado', troca para tom = 'perigo' e só sai no break; o default não roda](images/e26-switch-cascata.svg)
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

Na tela, as duas funções alimentam o selo:

```jsx
<Badge texto={textoDoStatus(pedido.status)} tom={tomDoStatus(pedido.status)} />
```

---

## :icon[scale] if, switch ou mapa?

| A decisão é... | Use | Na Lojinha |
|---|---|---|
| faixas e comparações | `if` e `else if` | parcelas pelo preço |
| um valor contra opções fixas | `switch` | tom do status |
| traduzir um valor em outro | objeto (mapa) | `corDoTom` do `Badge` |
| dois resultados, uma linha | ternário (aula 34) | "1 item" ou "2 itens" |

O `textoDoStatus` também caberia num mapa, como o `corDoTom` do E13. O `switch` ganha quando há **grupos** de valores e um `default` que precisa ficar à vista. Com `<` e `>=`, só o `if` serve: o `case` compara apenas com `===`.

---

## :icon[circle-help] Truthy e falsy

Dentro do `if`, qualquer valor vira `true` ou `false`. Os que viram `false` são os **falsy**, e são só seis:

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
```

---

## :icon[bug] A armadilha do zero

No app, `0` costuma ser um valor **válido**: frete grátis, desconto zero, carrinho vazio.

```javascript
const frete = 0; // frete grátis
if (frete) {
  mostrarFrete(frete); // nunca roda: 0 é falsy
}
```

No JSX, o mesmo engano derruba o app:

```jsx
{itens.length && <ResumoDoPedido itens={itens} />}
```

Com o carrinho vazio, `0 && ...` devolve `0`. O React Native tenta desenhar esse número fora de um `Text` e mostra a tela vermelha `Text strings must be rendered within a <Text> component`.

:::tip
Escreva a condição que você quer dizer: `frete !== null`, `itens.length > 0`.
:::

---

## Pratique

:::example Desafio
A regra de frete da aula 34 devolve `null` quando o CEP ainda não foi informado, `0` quando o frete é grátis e o valor em reais nos outros casos. Escreva `textoDoFrete(frete)` com `if`, `else if` e `else`, devolvendo:

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

Com `if (!frete)`, os dois primeiros casos se misturam: no frete grátis, o cliente leria "Informe o CEP". Na aula 34, esta função encolhe com retorno antecipado.
:::

---

## :icon[triangle-alert] Erros comuns

:::warning
- `if (status = 'pago')`, com um `=` só: atribui em vez de comparar, e a condição vale sempre
- `else if` fora de ordem: a faixa mais larga primeiro engole as outras
- `case` sem `break` nem `return`: a execução desce para o caso de baixo
- `switch` sem `default`: um status novo do servidor deixa o selo sem texto
- `if (frete)` ou `{itens.length && ...}` quando `0` é um valor válido
- `'Pago'` ou `' pago'` no lugar de `'pago'`: o `case` compara com `===`, sem tolerância
:::

---

## Resumo

:::summary
- `if` executa um bloco quando a condição dá `true`, `else` é o outro caminho e `else if` testa faixas de cima para baixo, parando no primeiro acerto
- `switch` compara um valor com `===` contra cada `case`; o `default` cobre o resto
- Sem `return` nem `break`, a execução desce para o `case` seguinte; `case` vazios agrupam valores de propósito
- Falsy são `false`, `0`, `''`, `null`, `undefined` e `NaN`; todo o resto é truthy
- `textoDoStatus` e `tomDoStatus` traduzem o status do pedido para o `Badge`
:::

---

## :icon[arrow-right] Próximos passos

A aula 34 deixa as decisões curtas e fáceis de ler, e leva as regras para o laboratório:

- :icon[arrow-left-right] ternário para escolher entre dois valores dentro do JSX
- :icon[shield-check] `??` e `?.` para valores que faltam, sem tela vermelha
- :icon[corner-down-right] condições com nome e retorno antecipado
- :icon[truck] `src/regras/frete.js` e `src/regras/pedido.js` com testes, e o Carrinho mostrando frete e cupom
