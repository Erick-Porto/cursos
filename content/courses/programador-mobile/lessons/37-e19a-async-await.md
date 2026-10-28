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

## :icon[zap] async: a função que devolve uma Promise

A palavra **`async`** antes de `function` muda o que a função devolve: sempre uma **Promise**.

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

Vale para arrow também: `const finalizar = async () => { ... }`. Por enquanto a função não espera nada; o `await` vem agora.

---

## :icon[hourglass] await: espera a Promise sem travar o programa

**`await`** pausa a função até a Promise encerrar e entrega o valor cumprido.

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

## :icon[shield-alert] try e catch com await

Quando a Promise é rejeitada, o `await` **lança** o erro, como um `throw`. Por isso o `try/catch` do E17 volta a servir. Os pontinhos fazem o papel do "carregando" no terminal:

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

- O `catch` pega a rejeição de **qualquer** `await` dentro do `try`
- O **`finally`** para os pontinhos nos dois caminhos: sem ele, uma falha deixa o timer do E18 ligado, e o programa não termina nunca

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

## :icon[list-ordered] Em sequência: quando uma etapa depende da outra

No checkout, a ordem é regra de negócio: não se cobra sem reserva, não se confirma sem cobrança. Cada `await` espera o anterior terminar:

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

## :icon[repeat] await dentro de laços

Para consultar o estoque de cada item do carrinho, há três jeitos, e um deles está errado:

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

O `for...of` do E07 com `await` vai em fila: use quando a ordem importa ou o servidor limita pedidos. `map` com `Promise.all` vai em paralelo. O **`forEach`** ignora a Promise que a callback devolve: a função segue antes de consultar qualquer item.

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

## :icon[workflow] O checkout reescrito

Em `src/servicos/checkout.js`, o mesmo `finalizarCompra` do E18, sem a variável de fora:

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

- **`await` no nível de cima**: num módulo ES, como os arquivos do `lojinha-regras` (`"type": "module"`), o `await` vale também fora de função. É o jeito curto de escrever scripts; dentro de qualquer função, a regra continua: só em `async`
- No E30, o mesmo `finalizarCompra` vai para o botão **Finalizar compra** do app

---

## :icon[test-tube] Testes assíncronos com async e await

No Jest, a callback do `test` também pode ser `async`: o Jest espera a Promise dela. Os testes do E18, reescritos:

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
