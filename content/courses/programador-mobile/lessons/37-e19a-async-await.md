---
title: Async e await no checkout da Lojinha
summary: Reescreva o checkout com async e await, trate falhas com try/catch e escolha entre sequência e paralelo.
module: classes-e-controle
duration_minutes: 40
objectives:
  - Escrever funções async que esperam Promises com await
  - Tratar falhas assíncronas com try, catch e finally
  - Escolher entre esperar em sequência e em paralelo com Promise.all
  - Reescrever o checkout do E18 com async e await
---

# Async e await no checkout da Lojinha

Programador Mobile · Encontro E19 · Aula 37 de 89

---

## O que você vai aprender

:::goal
- Escrever funções `async` e esperar Promises com `await`
- Tratar falhas com `try`, `catch` e `finally`, sem deixar nada rodando à toa
- Decidir quando esperar em sequência e quando usar `Promise.all`
- Usar `await` dentro de laços sem cair na armadilha do `forEach`
- Reescrever o `finalizarCompra` do E18 para ler como a regra de negócio
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **`async`** | marca uma função assíncrona: ela sempre devolve uma Promise |
| **`await`** | "aguarde": pausa a função até a Promise encerrar e entrega o valor |
| **em sequência** | um depois do outro: o próximo só começa quando o anterior termina |
| **em paralelo** | todos ao mesmo tempo: o total leva o tempo do mais lento |
| **refatorar** | reescrever o código sem mudar o que ele faz |
| **nível de cima** | fora de qualquer função, direto no arquivo (*top level*) |

---

## A variável de fora do checkout

O `finalizarCompra` do E18 funciona e já não é pirâmide. Mas a confirmação precisa da reserva, que nasce dois degraus antes, e cada `then` só recebe o valor do anterior. Por isso a reserva mora numa variável de fora, alterada no meio da corrente:

```javascript
export function finalizarCompra(pedido, aoMudarEtapa = () => {}, opcoes = {}) {
  const config = { ...opcoes, aoMudarEtapa };
  let reserva; // guardada fora: a confirmação precisa dela
  return validarEstoque(pedido.itens, config)
    .then(() => reservar(pedido.itens, config))
    .then((resultado) => {
      reserva = resultado;
      return comTempoLimite(cobrar(pedido.total, pedido.pagamento, config), 5000);
    })
    .then((cobranca) => confirmar(reserva, cobranca, config));
}
```

:::question
Como escrever esse mesmo fluxo na ordem em que você o explica em voz alta: valide, reserve, cobre, confirme?
:::

---

## async

Uma função pode entregar uma senha em vez do lanche?

---

## :icon[zap] async: a função que devolve uma Promise

Lembre a senha da lanchonete do E18: a Promise. A palavra **`async`** (de *asynchronous*, assíncrono) antes de `function` faz a função sempre entregar uma senha: ela sempre devolve uma **Promise**.

```javascript
async function aplicarCupom(subtotal, codigo) {
  if (codigo !== 'BEMVINDO') throw new Error('Cupom inválido');
  return subtotal * 0.9;
}

aplicarCupom(200, 'BEMVINDO'); // Promise cumprida com 180
aplicarCupom(200, 'XYZ');      // Promise rejeitada com o erro
```

| Dentro da função `async` | Quem chama recebe |
|---|---|
| `return valor` | Promise cumprida com o valor |
| `throw erro` | Promise rejeitada com o erro |

Vale para arrow também: `const finalizar = async () => { ... }`. Esta função ainda não espera nada: quem espera é o `await`.

---

## :icon[zap] async na prática

**Caso 1: quem chama recebe a senha, não o valor.**

```javascript
console.log(aplicarCupom(200, 'BEMVINDO')); // Promise { 180 }
```

**Caso 2: o valor e o erro chegam pelo `then` e pelo `catch` do E18.**

```javascript
aplicarCupom(200, 'BEMVINDO').then((valor) => console.log(valor)); // 180
aplicarCupom(200, 'XYZ').catch((erro) => console.log(erro.message)); // Cupom inválido
```

O `throw` dentro da função `async` não derrubou o script: virou uma Promise rejeitada, tratada no `catch`.

**Caso 3: uma arrow `async`.**

```javascript
const dobrar = async (n) => n * 2;
dobrar(21).then((valor) => console.log(valor)); // 42
```

---

## await

Dá para esperar a senha ser chamada sem travar a fila inteira?

---

## :icon[hourglass] await: espera a Promise sem travar o programa

**`await`** (aguarde) é esperar a senha ser chamada sem travar a fila. A função fica parada naquela linha até a Promise encerrar e recebe o valor cumprido. O resto do programa segue.

```javascript
async function mostrarTotal(cep, subtotal) {
  const frete = await consultarFrete(cep); // espera os 800 ms do E18
  console.log(frete);                      // 19.9: o valor, não a Promise
  console.log('Total: ' + formatarPreco(subtotal + frete)); // 'Total: R$ 119,90'
}
```

- Só a função `async` fica pausada: o event loop do E18 segue livre para timers e outros pedidos
- `await` só vale dentro de função `async`; numa função comum, é erro de sintaxe
- Sem o `await`, `frete` guardaria a Promise, e `100 + frete` viraria o texto `'100[object Promise]'`

---

## :icon[arrow-left-right] then e await lado a lado

O `await` não substitui as Promises: é outra forma de escrever o `then`. As duas versões fazem a mesma coisa.

::::columns
:::col
**Com `then`**

```javascript
function totalComFrete(cep, subtotal) {
  return consultarFrete(cep)
    .then((frete) => subtotal + frete);
}
```
:::
:::col
**Com `await`**

```javascript
async function totalComFrete(cep, subtotal) {
  const frete = await consultarFrete(cep);
  return subtotal + frete;
}
```
:::
::::

- As duas devolvem uma Promise: quem chama usa `await totalComFrete(...)` ou `.then`
- Na versão com `await`, `frete` é uma constante comum, visível até o fim da função
- `Promise.all`, `allSettled` e `race`, do E18, continuam valendo: você espera o resultado deles com `await`

---

## :icon[hourglass] await na prática

**Caso 1: o total com frete.** O `mostrarTotal`, chamado com o CEP de São Paulo e R$ 100 em produtos:

```javascript
await mostrarTotal('01310-100', 100);
```

```plaintext
19.9
Total: R$ 119,90
```

**Caso 2: o `await` esquecido.** A conta junta um número com a senha:

```javascript
async function totalSemAwait(cep, subtotal) {
  const frete = consultarFrete(cep); // faltou o await
  console.log(subtotal + frete);
}

await totalSemAwait('01310-100', 100); // 100[object Promise]
```

Nenhum erro aparece: o código roda e erra em silêncio. Se o total parecer estranho, procure o `await` que faltou.

---

## try e catch com await

Se o pedido for cancelado enquanto você espera, quem segura a queda?

---

## :icon[shield-alert] try e catch com await

Quando a Promise é rejeitada, o `await` **lança** o erro, como um `throw`. Por isso a rede de proteção do E17, o `try/catch`, volta a servir. Os pontinhos fazem o papel do "carregando" no terminal:

```javascript
async function mostrarFrete(cep) {
  const pontos = setInterval(() => process.stdout.write('.'), 200); // escreve sem pular linha
  try {
    const valor = await consultarFrete(cep);
    console.log('\nFrete: ' + formatarPreco(valor));
  } catch (erro) {
    console.log('\n' + erro.message); // 'CEP inválido'
  } finally {
    clearInterval(pontos); // roda com sucesso ou com falha
  }
}
```

- O `'\n'` pula uma linha: a mensagem não sai grudada nos pontinhos
- O `catch` pega a rejeição de **qualquer** `await` dentro do `try`
- O **`finally`** para os pontinhos nos dois caminhos: sem ele, uma falha deixa o timer do E18 ligado, e o programa não termina nunca

---

## :icon[shield-alert] try e catch com await na prática

**Caso 1: o `mostrarFrete`, com um CEP certo e um errado.**

```plaintext
$ node pontinhos.js 01310-100
...
Frete: R$ 19,90

$ node pontinhos.js 123
...
CEP inválido
```

**Caso 2: um `catch` só para dois `await`.**

```javascript
async function resumo(cep) {
  try {
    const frete = await consultarFrete(cep);
    const prazo = await consultarPrazo(cep);
    console.log(`Frete ${frete}, prazo de ${prazo} dias`);
  } catch (erro) {
    console.log('Não deu: ' + erro.message);
  }
}

await resumo('01310-100'); // Frete 19.9, prazo de 3 dias
await resumo('123');       // Não deu: CEP inválido
```

---

## Pense

:::question
O script chama a função abaixo, e o pagamento é recusado. O `mostrarEtapa` é o do E18, que imprime "Etapa 1 de 4: Conferindo o estoque..." e as seguintes. O que aparece no terminal?

```javascript
async function finalizar(pedido) {
  try {
    finalizarCompra(pedido, mostrarEtapa);
    console.log('Pedido confirmado!');
  } catch (erro) {
    console.log('Não deu: ' + erro.message);
  }
}
```
:::

:::tip Resposta
Aparecem a etapa 1 e, na hora, "Pedido confirmado!", antes de qualquer etapa terminar; as etapas 2 e 3 vêm depois. Sem `await`, `finalizarCompra` só começa e a função segue. Quando o pagamento falha, o `try` já acabou: o `catch` não pega nada e o Node para com o `FalhaNoCheckoutError` de uma Promise rejeitada sem tratamento. A correção é uma palavra: `await finalizarCompra(...)`.
:::

---

## Sequência e paralelo

Três pedidos: um caixa só, um de cada vez, ou três caixas ao mesmo tempo?

---

## :icon[list-ordered] Em sequência: quando uma etapa depende da outra

Numa lanchonete com um caixa só, os pedidos andam **em sequência**: o próximo só começa quando o anterior sai. Com três caixas, eles andam **em paralelo**, todos ao mesmo tempo. No checkout, a ordem é regra de negócio: não se cobra sem reserva, não se confirma sem cobrança. Cada `await` espera o anterior terminar:

```javascript
await validarEstoque(pedido.itens, config);                // 800 ms
const reserva = await reservar(pedido.itens, config);      // mais 800 ms
const cobranca = await cobrar(pedido.total, pedido.pagamento, config); // mais 800 ms
// cerca de 2,4 s no total: a soma das etapas
```

- Use sequência quando o passo seguinte **precisa do resultado** ou da garantia do anterior
- Se o estoque falhar, o `await` lança e as linhas de baixo nem rodam: nada é reservado nem cobrado
- O tempo total é a **soma** das etapas

---

## :icon[combine] Em paralelo: Promise.all com await

Frete, prazo e cupom, do E18, não dependem um do outro. Esperar um de cada vez desperdiça tempo:

```javascript
// em sequência: 800 + 600 + 400 = 1800 ms
const frete = await consultarFrete(cep);
const prazo = await consultarPrazo(cep);
const desconto = await consultarCupom(codigo);
```

```javascript
// em paralelo: 800 ms, o tempo da mais lenta
const [frete, prazo, desconto] = await Promise.all([
  consultarFrete(cep),
  consultarPrazo(cep),
  consultarCupom(codigo),
]);
```

- `Promise.all` devolve os resultados **na ordem do array**; a desestruturação do E09 dá nome a cada um
- Se uma falhar, o `await` lança aquele erro e o `catch` cuida dele
- Pergunta-guia: o segundo pedido precisa do resultado do primeiro? Se não precisa, paralelo

---

## :icon[clock] A soma ou a mais lenta

:::center
![Animação: uma linha do tempo percorre as consultas de frete, prazo e cupom; em paralelo, com Promise.all, as três terminam em 800 ms; em sequência, uma depois da outra, só terminam em 1800 ms](images/e19-sequencia-e-paralelo.svg)
:::

Em sequência, cada `await` espera o anterior: o total é a soma, 1800 ms. Com `Promise.all`, as três consultas saem juntas e o total é o tempo da mais lenta, 800 ms.

---

## await em laços

Três jeitos de consultar cada item do carrinho. Qual deles sai sem esperar ninguém?

---

## :icon[repeat] await dentro de laços

O laço do E07 confere o carrinho item por item. Com `await`, dá para consultar o estoque de cada item de três jeitos, e um deles está errado:

```javascript
// 1. em fila, na ordem do carrinho; para no primeiro erro
for (const item of itens) {
  await consultarEstoque(item.id, item.qtd);
}

// 2. todos ao mesmo tempo; espera o último terminar
await Promise.all(itens.map((item) => consultarEstoque(item.id, item.qtd)));

// 3. errado: o forEach não espera ninguém
itens.forEach(async (item) => {
  await consultarEstoque(item.id, item.qtd);
});
```

O **`forEach`** ignora a Promise que a callback devolve: a função segue antes de consultar qualquer item.

---

## :icon[list-ordered] Os três laços em português

| Jeito | Como os pedidos saem | Use quando |
|---|---|---|
| `for...of` com `await` | em fila: um termina, o próximo começa | a ordem importa ou o servidor limita pedidos |
| `Promise.all` com `map` | todos juntos; espera o último | os itens não dependem um do outro |
| `forEach(async ...)` | todos juntos, e ninguém espera | nunca, quando você precisa do resultado |

O `for...of` com `await` pausa a cada volta e para no primeiro erro. O `map` é a linha de produção do E09: cada item entra e sai como uma Promise, e o `Promise.all` espera todas.

---

## :icon[repeat] await em laços na prática

Três itens no carrinho. Cada consulta leva 300 ms e escreve uma linha:

```javascript
async function consultarEstoque(id, qtd) {
  await esperar(300);
  console.log(`  item ${id} (${qtd}): em estoque`);
}
```

Os três laços, cronometrados com o `console.time` do E17 (as três linhas de cada consulta foram resumidas):

```plaintext
for...of: 938ms
Promise.all: 312ms
forEach: 0.149ms
```

- `for...of`: um depois do outro, 3 vezes 300 ms
- `Promise.all`: os três juntos, o tempo de um só
- `forEach`: "terminou" antes de consultar; as três linhas do estoque aparecem depois do tempo

---

## Pratique

:::example Desafio
`reservarTudo` deveria reservar os itens **na ordem do carrinho** e devolver a lista de reservas, mas devolve `[]`. Corrija.

```javascript
async function reservarTudo(itens) {
  const reservas = [];
  itens.forEach(async (item) => {
    reservas.push(await reservarItem(item));
  });
  return reservas;
}
```
:::

:::tip Resposta
```javascript
async function reservarTudo(itens) {
  const reservas = [];
  for (const item of itens) {
    reservas.push(await reservarItem(item));
  }
  return reservas;
}
```

O `forEach` dispara as callbacks e não espera nenhuma: o `return` acontece com o array ainda vazio. Com `for...of`, cada `await` pausa a própria `reservarTudo`. `Promise.all(itens.map((item) => reservarItem(item)))` também devolveria a lista, mas com os pedidos saindo juntos.
:::

---

## O checkout reescrito

Dá para reescrever uma função inteira e provar que nada mudou?

---

## :icon[workflow] O checkout reescrito

**Refatorar** é reescrever o código sem mudar o que ele faz. Em `src/servicos/checkout.js`, o mesmo `finalizarCompra` do E18, sem a variável de fora:

```javascript
export async function finalizarCompra(pedido, aoMudarEtapa = () => {}, opcoes = {}) {
  const config = { ...opcoes, aoMudarEtapa }; // cada etapa avisa quem chamou quando começa
  await validarEstoque(pedido.itens, config);
  const reserva = await reservar(pedido.itens, config);
  const cobranca = await comTempoLimite(cobrar(pedido.total, pedido.pagamento, config), 5000);
  return confirmar(reserva, cobranca, config);
}
```

- Cada linha é uma etapa, na ordem da regra; `reserva` é uma constante comum, visível até o fim
- A assinatura não muda, e o `config` chega a todas as etapas: é por ele que os testes injetam `atraso` e `sortear`
- As etapas e o `comTempoLimite` não mudam; como no E18, não há `catch` aqui: quem chama decide como mostrar o erro
- Uma função `async` devolve Promise, então quem já chamava `finalizarCompra` não percebe a troca

---

## :icon[terminal] O script do checkout com await

Em `src/scripts/finalizar.js`, os imports, o `mostrarEtapa` e o pedido do E18 continuam iguais. Muda só o fim do arquivo, a corrente que chamava o checkout:

```javascript
// antes, no E18
finalizarCompra(pedido, mostrarEtapa)
  .then((confirmacao) => console.log(`Pedido nº ${confirmacao.numero} confirmado.`))
  .catch((falha) => {
    if (!(falha instanceof ErroDeNegocio)) throw falha; // bug: não esconda
    console.log(`Não deu certo: ${falha.message}`);
  });
```

```javascript
// agora, com await
try {
  const confirmacao = await finalizarCompra(pedido, mostrarEtapa);
  console.log(`Pedido nº ${confirmacao.numero} confirmado.`);
} catch (falha) {
  if (!(falha instanceof ErroDeNegocio)) throw falha; // bug: não esconda
  console.log(`Não deu certo: ${falha.message}`);
}
```

- **`await` no nível de cima**, fora de qualquer função: num módulo ES, como os arquivos do `lojinha-regras` (`"type": "module"`), ele vale. É o jeito curto de escrever scripts; dentro de qualquer função, a regra continua: só em `async`
- No E30, o mesmo `finalizarCompra` vai para o botão **Finalizar compra** do app

---

## :icon[workflow] O checkout reescrito na prática

**Caso 1: a prova de que nada mudou.** Os testes do E18 rodam antes e depois da troca:

```plaintext
$ npm test           # antes, com then
Tests:       6 passed, 6 total
$ npm test           # depois, com await
Tests:       6 passed, 6 total
```

**Caso 2: o script, com o `try` e o `await` no nível de cima.** A saída é a mesma do E18:

```plaintext
$ node src/scripts/finalizar.js
Total: R$ 449,80
Etapa 1 de 4: Conferindo o estoque...
Etapa 2 de 4: Reservando seus produtos...
Etapa 3 de 4: Processando o pagamento...
Etapa 4 de 4: Confirmando o pedido...
Pedido nº 418613 confirmado.
```

Com `CHANCE_DE_FALHA = 1`, a última linha vira "Não deu certo: Um produto do carrinho acabou de esgotar."

---

## Testes com await

Se o teste não espera a resposta, ele corrige o quê?

---

## :icon[test-tube] Testes assíncronos com async e await

O teste continua sendo a prova com gabarito do E04. No Jest, a callback do `test` também pode ser `async`: o Jest espera a Promise dela. Os testes do E18, reescritos:

```javascript
test('confirma o pedido quando nenhuma etapa falha', async () => {
  const confirmacao = await finalizarCompra(pedido, semAviso, nuncaFalha);
  expect(confirmacao).toMatchObject({ status: 'pago' });
});

test('rejeita informando a etapa que falhou', async () => {
  await expect(finalizarCompra(pedido, semAviso, sempreFalha)).rejects.toMatchObject({ etapa: 'estoque' });
});
```

- Sem o `await` antes do `expect` com `rejects`, o teste termina antes da conferência: aparece como aprovado, e a falha, se vier, vem solta depois do resumo
- Rode os testes do E18 **antes** de mexer no `finalizarCompra` e de novo depois: verdes nas duas vezes provam que a refatoração não mudou o comportamento

---

## :icon[test-tube] Testes com await na prática

**Caso 1: parar no pagamento.** Cada `await` espera, e a conferência das etapas vem depois do erro:

```javascript
test('para no pagamento quando o terceiro sorteio falha', async () => {
  const sorteios = [1, 1, 0]; // estoque passa, reserva passa, pagamento falha
  const etapas = [];
  const opcoes = { atraso: 0, sortear: () => sorteios.shift() };
  await expect(finalizarCompra(pedido, (etapa) => etapas.push(etapa), opcoes))
    .rejects.toMatchObject({ etapa: 'pagamento', codigo: 'FALHA_PAGAMENTO' });
  expect(etapas).toEqual(['estoque', 'reserva', 'pagamento']);
});
```

`sorteios.shift()` tira o primeiro número da lista a cada etapa: 1, depois 1, depois 0. Verde.

**Caso 2: a armadilha.** Sem o `await` antes do `expect`, um teste `async` com o esperado errado também sai verde: o Jest não esperou a conferência.

---

## :icon[siren] Quando aparece um erro

| Você vê | Quer dizer | O que fazer |
|---|---|---|
| `Unexpected reserved word` ou `await is only valid in async functions` | `await` numa função sem `async` | pôr `async` na função |
| `[object Promise]` no meio de um texto | faltou `await`: você usou a senha, não o valor | `await` antes da chamada |
| `undefined` ao ler um campo, como `produto.nome` | faltou `await`: a Promise não tem esse campo | `await` antes da chamada |
| o Node para com o erro, mesmo com `try` | faltou `await`: o erro chegou depois do `try` | `await` na chamada |
| os pontinhos não param | `clearInterval` fora do `finally` | mover para o `finally` |

---

## :icon[triangle-alert] Erros comuns

:::warning
- Esquecer o `await`: a variável guarda a Promise e o erro escapa do `catch`
- `await` numa função sem `async`, inclusive numa callback de `setTimeout`: erro de sintaxe
- `forEach(async ...)`: ninguém espera; use `for...of` ou `Promise.all` com `map`
- Tudo em sequência por hábito: consultas independentes, como frete e cupom, vão juntas com `Promise.all`
- `try` sem `finally`: numa falha, o timer dos pontinhos segue ligado e o script não termina
- Teste `async` sem `await` no `expect`: passa sem conferir nada
:::

---

## Resumo

:::summary
- Função `async` sempre devolve uma Promise: `return` cumpre, `throw` rejeita
- `await` pausa só a função e entrega o valor; o event loop continua livre
- Rejeição vira exceção: `try/catch` trata a falha e `finally` faz a limpeza nos dois caminhos
- Em sequência quando uma etapa depende da outra; `Promise.all` quando são independentes
- Em laços, `for...of` com `await` vai em fila e `map` com `Promise.all` vai em paralelo; `forEach` não espera
:::

---

## Próximos passos

Até aqui, as Promises do checkout eram simuladas com `setTimeout`. Na próxima aula, elas vêm da rede: o `fetch` busca o catálogo na **DummyJSON**, e cada `await` que você praticou hoje traz a lista, o detalhe e a busca de produtos para o terminal.

:::tip Para chegar pronto
Confira se o `formatarPreco` do E05 e o `debounce` do E10 estão no seu `lojinha-regras`: a próxima aula usa os dois. E teste a internet: `node -e "fetch('https://dummyjson.com/products/1').then((r) => console.log(r.status))"` deve mostrar 200.
:::
