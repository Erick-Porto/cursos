---
title: Promises no checkout
summary: Estados, then, catch, finally, encadeamento e Promise.all, allSettled e race no checkout do lojinha-regras.
module: classes-e-controle
duration_minutes: 40
objectives:
  - Explicar os três estados de uma Promise e criar uma com new Promise
  - Encadear etapas com then, tratar falhas com catch e encerrar com finally
  - Escolher entre Promise.all, Promise.allSettled e Promise.race
  - Testar funções assíncronas no Jest com sorteio e atraso injetados
---

# Promises no checkout

Programador Mobile · Encontro E18 · Aula 36 de 89

---

## O que você vai aprender

:::goal
- Reconhecer os três estados de uma Promise e criar uma com `new Promise`
- Usar `then`, `catch` e `finally` e encadear etapas sem pirâmide
- Prever quando um `then` roda em relação a um `setTimeout`
- Escolher entre `Promise.all`, `Promise.allSettled` e `Promise.race`
- Testar código assíncrono no Jest sem depender da sorte
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **Promise** | um objeto que representa um resultado que ainda vai chegar |
| **pendente, cumprida, rejeitada** | os estados de uma Promise: esperando, deu certo, deu errado |
| **encadear** | ligar um `then` depois do outro, cada um esperando o anterior |
| **microtarefa** | um callback de Promise: ele passa na frente dos timers |
| **injetar** | passar de fora uma peça que a função usa, como o sorteio, para o teste controlar |

---

## A pirâmide do checkout

A pirâmide de callbacks do checkout funciona, mas os próximos pedidos do time já quebram o formato: "se o pagamento passar de 5 segundos, avise o cliente" e "consulte frete, prazo e cupom ao mesmo tempo".

Com **Promises**, as quatro etapas viram uma sequência lida de cima para baixo, com um único tratamento de erro:

```javascript
// esboço: a versão completa fica para o fim da aula
validarEstoque(itens)
  .then(() => reservar(itens))
  .then(() => cobrar(total, pagamento))
  .then((cobranca) => confirmar(cobranca))
  .catch(mostrarErro);
```

:::question
Se a reserva falhar, quais dessas linhas ainda rodam?
:::

---

## Promise

Na lanchonete, o que você recebe quando paga e o lanche ainda não está pronto?

---

## :icon[ticket] Promise: a senha de um resultado futuro

Na lanchonete, você paga e recebe uma senha. O lanche ainda não está pronto, mas a senha garante uma resposta: ou chamam o seu número, ou avisam que o pedido foi cancelado. Uma **Promise** (promessa) é essa senha: um objeto que representa um valor que ainda vai chegar.

:::center
![Diagrama: a Promise nasce pendente e muda uma única vez, para cumprida com um valor ou rejeitada com um erro; as duas são encerradas e nunca mudam](images/e18-estados-da-promise.svg)
:::

Ela nasce **pendente** (*pending*) e muda uma única vez: fica **cumprida** (*fulfilled*), com um valor, ou **rejeitada** (*rejected*), com um motivo, um erro. Cumprida ou rejeitada, a Promise está **encerrada** (*settled*): não volta a pendente nem troca de resultado.

---

## :icon[hammer] Criando uma Promise

`new Promise` cria a senha. Ela recebe uma função com dois parâmetros: chame **`resolve(valor)`** (resolver) para cumprir e **`reject(erro)`** (rejeitar) para rejeitar.

```javascript
function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function consultarFrete(cep) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!/^\d{5}-?\d{3}$/.test(cep)) reject(new Error('CEP inválido'));
      else resolve(19.9);
    }, 800);
  });
}
```

A função devolve a Promise **na hora**, ainda pendente: `console.log(consultarFrete('01310-100'))` mostra `Promise { <pending> }`. O resultado chega 800 ms depois.

---

## :icon[list-ordered] Criando em português

| Linha | O que ela diz |
|---|---|
| `new Promise((resolve, reject) => { ... })` | "crie uma senha; aqui dentro, decida quando ela fica pronta" |
| `setTimeout(resolve, ms)` | o `esperar`: cumpre a senha depois de `ms` milissegundos, sem valor nenhum |
| `/^\d{5}-?\d{3}$/.test(cep)` | a regex do CEP do E06 |
| `reject(new Error('CEP inválido'))` | CEP fora do formato: o pedido é cancelado, com um erro |
| `else resolve(19.9)` | deu certo: a senha fica pronta com o frete |

Rejeite sempre com um `Error`, como no E17: ele traz a `message` que o script imprime.

---

## :icon[ticket] Promise na prática

**Caso 1: a senha muda de pendente para cumprida.**

```javascript
const senha = consultarFrete('01310-100');
console.log(senha);                         // Promise { <pending> }
setTimeout(() => console.log(senha), 1000); // Promise { 19.9 }
```

Na hora, a senha ainda espera. Um segundo depois, os 800 ms passaram e ela guarda o frete.

**Caso 2: a senha só muda uma vez.**

```javascript
const pedido = new Promise((resolve, reject) => {
  resolve('lanche pronto');
  reject(new Error('cancelado')); // tarde demais: a Promise já encerrou
});
setTimeout(() => console.log(pedido), 0); // Promise { 'lanche pronto' }
```

O `reject` depois do `resolve` não faz nada: cumprida é para sempre.

---

## then, catch e finally

Com a senha na mão: o que fazer quando chamam? E se cancelarem?

---

## :icon[shield-check] then, catch e finally

Com a senha na mão, você combina o que fazer em cada caso. **`then`** (então) recebe o valor quando a Promise é cumprida. **`catch`** (pegar) trata a rejeição, o pedido cancelado. **`finally`** (por fim) roda nos dois casos, como jogar a senha fora: é o lugar de desfazer o que você começou, como o "aguardando...":

```javascript
const cep = process.argv[2]; // node frete.js 01310-100
const aguardando = setInterval(() => console.log('aguardando...'), 200);

consultarFrete(cep)
  .then((valor) => console.log('Frete:', valor))
  .catch((erro) => console.log('Erro:', erro.message))
  .finally(() => clearInterval(aguardando)); // para nos dois casos
```

O `process.argv[2]` é o CEP escrito no comando, como no E02.

---

## :icon[list-checks] then, catch e finally na prática

O mesmo `frete.js`, com um CEP certo e um errado:

```plaintext
$ node frete.js 01310-100
aguardando...
aguardando...
aguardando...
Frete: 19.9

$ node frete.js 123
aguardando...
aguardando...
aguardando...
Erro: CEP inválido
```

Nos dois casos, o "aguardando..." para e o script termina: é o `finally`.

| Resultado | O que roda |
|---|---|
| cumprida | `then` e `finally` |
| rejeitada | `catch` e `finally` |

Sem `catch`, o erro derruba o script, como um `throw` que ninguém capturou.

Com o `clearInterval` só no `then`, um CEP inválido deixa o "aguardando..." repetindo para sempre. No app, é o indicador de carregamento que nunca para.

---

## Encadeamento

Você quer a sobremesa depois do lanche. Quando faz o segundo pedido?

---

## :icon[link] Encadeamento: cada then devolve uma Promise nova

Com o lanche na mão, você vai ao balcão da sobremesa: o segundo pedido só começa depois do primeiro. **Encadear** é isso. Cada `then` devolve uma Promise nova, e o que o callback dele **devolve** vira o valor do próximo `then`. Se ele devolver uma Promise, a corrente **espera** por ela:

```javascript
consultarFrete(cep)
  .then((frete) => paraCentavos(sub) + paraCentavos(frete))   // devolve um número
  .then((centavos) => cobrar(paraReais(centavos), pagamento)) // devolve uma Promise
  .then((cobranca) => console.log('Cobrado:', cobranca.valor))
  .catch((erro) => console.log('Erro:', erro.message));
```

- O número vira o `centavos` do próximo elo; a Promise de `cobrar` faz a corrente esperar a cobrança
- `paraCentavos` e `paraReais` são as contas em centavos do E05

---

## :icon[link] Encadeamento na prática

**Caso 1: cada elo recebe o que o anterior devolveu.**

```javascript
esperar(500)
  .then(() => 'lanche')
  .then((pedido) => pedido + ' e sobremesa')
  .then((bandeja) => console.log('Na bandeja:', bandeja));
// Na bandeja: lanche e sobremesa
```

**Caso 2: uma falha pula os elos seguintes.**

```javascript
consultarFrete('123')
  .then((frete) => console.log('Frete:', frete)) // pulado
  .then(() => console.log('Resumo pronto'))      // pulado
  .catch((erro) => console.log('Erro:', erro.message));
// Erro: CEP inválido
```

O CEP errado rejeita a primeira Promise: os dois `then` nem rodam, e a corrente cai direto no `catch`.

---

## :icon[route] Quando um elo falha

O esboço do checkout, com as quatro etapas:

```javascript
validarEstoque(itens)
  .then(() => reservar(itens))
  .then(() => cobrar(total, pagamento))
  .then((cobranca) => confirmar(cobranca))
  .catch(mostrarErro);
```

- Um erro em qualquer elo pula os `then` seguintes e cai no `catch`
- Um `throw` dentro de um `then` também rejeita a corrente
- Um `catch` no fim trata a corrente inteira

Se a reserva falhar, `cobrar` e `confirmar` nunca rodam; só o `catch`.

---

## Pratique

:::example A corrente que não esperou
Um colega escreveu o trecho abaixo. No terminal, apareceu "reserva recebida: undefined" e a cobrança começou antes de a reserva terminar. Qual é o erro e como corrigir?

```javascript
validarEstoque(itens)
  .then(() => {
    reservar(itens);
  })
  .then((reserva) => {
    console.log('reserva recebida:', reserva);
    return cobrar(total, pagamento);
  });
```
:::

:::tip Resposta
Falta o `return`. Com chaves, a arrow só devolve o que vier depois de `return`; sem ele, o `then` devolve `undefined` na hora e a corrente segue sem esperar. Se a reserva falhar, ninguém trata o erro. Corrija com `return reservar(itens);` ou sem chaves: `.then(() => reservar(itens))`.
:::

---

## Microtarefas

Na fila do banco, quem é atendido antes: a fila comum ou a preferencial?

---

## :icon[list-ordered] then nunca roda na hora

Pense na fila preferencial do caixa: quem está nela é atendido antes da fila comum. Os callbacks de Promise vão para uma fila assim, a **fila de microtarefas**. O event loop a esvazia antes de pegar a próxima tarefa da fila comum, como um timer. Por isso, mesmo uma Promise já cumprida roda o `then` **depois** do código atual, mas antes dos timers:

```javascript
console.log('1. Cliente escolheu Pix');
setTimeout(() => console.log('4. Timer de 0 ms'), 0);
Promise.resolve('Pix gerado').then((msg) => console.log('3. ' + msg));
console.log('2. Fim do código atual');
```

No Node, a saída sai na ordem **1, 2, 3, 4**. O `Promise.resolve('Pix gerado')` cria uma Promise que já nasce cumprida.

---

## :icon[repeat] Microtarefas passam na frente

:::center
![Animação: o script roda inteiro e imprime 1 e 2; com a pilha vazia, a microtarefa do then imprime 3; só depois a tarefa do setTimeout de 0 ms imprime 4](images/e18-microtarefas.svg)
:::

| Tipo | Exemplos | Quando roda |
|---|---|---|
| Código atual | o script, do começo ao fim | primeiro, inteiro |
| Microtarefa | `then`, `catch`, `finally` | logo que a pilha esvazia |
| Tarefa | `setTimeout`, `setInterval` | depois das microtarefas |

No exemplo do Pix, o `setTimeout` foi agendado antes do `then`, mas roda depois. Com a pilha vazia, o event loop esvazia a fila de microtarefas inteira e só então pega a próxima tarefa, mesmo com atraso 0.

---

## O checkout com Promises

Sem servidor de pagamento, como treinar uma etapa que às vezes falha?

---

## :icon[dices] Uma etapa simulada

Ainda não há servidor de pagamento: a API de verdade chega no E19. Por isso, cada etapa do checkout é **simulada**: espera um tempo e sorteia se deu certo, como jogar um dado. Em `src/servicos/checkout.js`:

```javascript
export const CHANCE_DE_FALHA = 0.2; // 1 força a falha

function simularEtapa(chave, mensagem, valor, opcoes = {}) {
  const { sortear = Math.random, atraso = 800, aoMudarEtapa = () => {} } = opcoes;
  aoMudarEtapa(chave);
  return esperar(atraso).then(() => {
    if (sortear() < CHANCE_DE_FALHA) throw new FalhaNoCheckoutError(chave, mensagem);
    return valor;
  });
}

export function validarEstoque(itens, opcoes) {
  return simularEtapa('estoque', 'Um produto do carrinho acabou de esgotar.', itens, opcoes);
}
```

- `aoMudarEtapa` avisa quem chamou qual etapa começou: hoje o script imprime; no app, a tela mostra
- `FalhaNoCheckoutError`, novo em `src/modelos/erros.js`, estende o `ErroDeNegocio` do E17 e guarda a `etapa`

---

## :icon[list-ordered] A etapa simulada em português

| Linha | O que ela diz |
|---|---|
| `CHANCE_DE_FALHA = 0.2` | cada etapa tem 20% de chance de falhar |
| `const { sortear = Math.random, ... } = opcoes` | pega as opções; o que faltar usa o padrão, como no E09 |
| `esperar(atraso).then(...)` | espera o atraso e só então sorteia |
| `sortear() < CHANCE_DE_FALHA` | o sorteio dá um número de 0 a 1: abaixo de 0.2, falha |
| `throw new FalhaNoCheckoutError(...)` | o `throw` dentro do `then` rejeita a Promise da etapa |

`sortear` e `atraso` são **injetáveis**: o script usa os padrões, e o teste passa os seus. É um dado viciado: no teste, você sabe o resultado antes de jogar.

---

## :icon[workflow] O checkout sem pirâmide

`reservar`, `cobrar` e `confirmar` seguem o modelo de `validarEstoque`. A função que o script chama só encadeia as etapas:

```javascript
export function finalizarCompra(pedido, aoMudarEtapa = () => {}, opcoes = {}) {
  const config = { ...opcoes, aoMudarEtapa }; // cada etapa avisa quem chamou quando começa
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

- Cada etapa só começa quando a anterior é cumprida; sem `catch` aqui, quem chama decide como mostrar o erro
- Cada `then` só recebe o valor do anterior: por isso a reserva fica numa variável de fora

:::info Simulação
Num sistema de verdade, essas etapas rodam no servidor, numa chamada só. Hoje você as simula para treinar Promises e a espera.
:::

---

## :icon[dices] O checkout na prática

**Caso 1: o dado viciado.** Com o sorteio escolhido, você sabe o resultado antes:

```javascript
const itens = [{ id: 1, nome: 'Fone Bluetooth', preco: 199.9, qtd: 1 }];

validarEstoque(itens, { atraso: 0, sortear: () => 1 })
  .then(() => console.log('estoque ok'));

validarEstoque(itens, { atraso: 0, sortear: () => 0 })
  .catch((falha) => console.log(falha.etapa, '-', falha.message));
// estoque ok
// estoque - Um produto do carrinho acabou de esgotar.
```

**Caso 2: o script do laboratório**, com o sorteio de verdade. Cada vez sai uma coisa:

```plaintext
$ node src/scripts/finalizar.js
Total: R$ 449,80
Etapa 1 de 4: Conferindo o estoque...
Etapa 2 de 4: Reservando seus produtos...
Não deu certo: Não conseguimos reservar seus produtos.
```

---

## Combinar Promises

Lanche, bebida e sobremesa em três balcões: você espera as três senhas ou só a primeira?

---

## :icon[combine] Promise.all: tudo ao mesmo tempo

Você pede lanche, bebida e sobremesa em três balcões, com três senhas, e só come quando as três forem chamadas. Se uma for cancelada, você fica sabendo na hora. É o **`Promise.all`** (todas). Frete, prazo e cupom não dependem um do outro: com ele, as três consultas (simuladas, como `consultarFrete`) começam juntas:

```javascript
const inicio = Date.now();
Promise.all([consultarFrete(cep), consultarPrazo(cep), consultarCupom(codigo)])
  .then(([frete, prazo, desconto]) => console.log({ frete, prazo, desconto }))
  .catch((erro) => console.log('Erro:', erro.message))
  .finally(() => console.log(`${Date.now() - inicio} ms`));
```

| Consultas de 800, 600 e 400 ms | Tempo total |
|---|---|
| uma depois da outra, com `then` | 1800 ms |
| juntas, com `Promise.all` | 800 ms, o da mais lenta |

- O resultado é um array na ordem do pedido, pronto para a desestruturação do E09
- Se **uma** falhar, o `Promise.all` rejeita na hora com aquele erro

---

## :icon[list-checks] Promise.allSettled: cada parte por si

O **`Promise.allSettled`** (todas encerradas) espera todas as senhas e anota o que veio e o que foi cancelado, sem desistir. O relatório da vitrine junta destaques, categorias e banners, que vêm de lugares diferentes. Um banner fora do ar não deveria apagar o relatório inteiro, nem, no app, a tela Início:

```javascript
Promise.allSettled([buscarDestaques(), buscarCategorias(), buscarBanners()])
  .then(([destaques, categorias, banners]) => {
    if (destaques.status === 'fulfilled') console.log('Destaques:', destaques.value.length);
    if (categorias.status === 'fulfilled') console.log('Categorias:', categorias.value.length);
    if (banners.status === 'rejected') console.log('Sem banners:', banners.reason.message);
  });
```

- Espera **todas** encerrarem, deem certo ou não, e nunca rejeita
- Cada resultado é `{ status: 'fulfilled', value }` ou `{ status: 'rejected', reason }`
- Use quando cada parte vive sozinha; use `all` quando uma falha invalida o conjunto

---

## :icon[timer] Promise.race: o tempo limite

O **`Promise.race`** (corrida) fica com o resultado da **primeira** Promise que encerrar, cumprida ou rejeitada. É esperar o lanche, mas desistir se passar de 5 minutos. Corra a cobrança contra um timer:

```javascript
export function comTempoLimite(promessa, ms) {
  let id;
  const limite = new Promise((resolve, reject) => {
    id = setTimeout(() => reject(new TempoEsgotadoError(ms)), ms);
  });
  return Promise.race([promessa, limite]).finally(() => clearTimeout(id));
}
```

- Cobrança antes de 5 s: vence a cobrança. Depois: vence o `TempoEsgotadoError`, outro erro novo de `erros.js`
- O `finally` desliga o timer quando a corrida acaba; sem ele, o script espera os 5 s para terminar
- A perdedora **não é cancelada**: ela continua rodando. Cancelar de verdade é com `AbortController`, no E19

---

## :icon[combine] Combinar Promises na prática

`consultarPrazo` (600 ms, 3 dias) e `consultarCupom` (400 ms, 10% para `BEMVINDO`) são simuladas como o `consultarFrete`.

```javascript
Promise.all([consultarFrete('01310-100'), consultarPrazo('01310-100'), consultarCupom('BEMVINDO')])
  .then(([frete, prazo, desconto]) => console.log({ frete, prazo, desconto }));
// { frete: 19.9, prazo: 3, desconto: 0.1 }, depois de 800 ms

Promise.all([consultarFrete('123'), consultarPrazo('123')])
  .catch((erro) => console.log('Erro:', erro.message));
// Erro: CEP inválido: uma falha derruba o conjunto

Promise.allSettled([consultarFrete('123'), consultarPrazo('123')])
  .then((resultados) => console.log(resultados.map((r) => r.status)));
// [ 'rejected', 'fulfilled' ]: cada uma com o seu resultado
```

| Situação | Use |
|---|---|
| frete, prazo e cupom do total | `all`: sem um deles, não há total |
| destaques, categorias e banners | `allSettled`: cada parte vive sozinha |
| pagamento com limite de 5 s | `race`, contra um timer |

---

## Testes assíncronos

O que acontece se o professor recolher a prova antes de você responder?

---

## :icon[test-tube] Testes assíncronos no Jest

Um teste é uma prova com gabarito (E04). Num teste assíncrono, a resposta chega depois, e o Jest precisa esperar por ela. Em `src/servicos/checkout.test.js`, injete atraso 0 e um sorteio fixo:

```javascript
import { finalizarCompra } from './checkout.js';

const pedido = { itens: [{ id: 1, nome: 'Fone Bluetooth', preco: 199.9, qtd: 1 }], total: 199.9 };
const semAviso = () => {};
const nuncaFalha = { atraso: 0, sortear: () => 1 };
const sempreFalha = { atraso: 0, sortear: () => 0 };

test('confirma o pedido quando nenhuma etapa falha', () => {
  return expect(finalizarCompra(pedido, semAviso, nuncaFalha)).resolves.toMatchObject({ status: 'pago' });
});

test('rejeita informando a etapa que falhou', () => {
  return expect(finalizarCompra(pedido, semAviso, sempreFalha)).rejects.toMatchObject({ etapa: 'estoque' });
});
```

- **Devolva** a Promise com `return`. Sem ele, é recolher a prova antes da resposta: o Jest dá o teste por encerrado, e o resumo pode sair verde com o código quebrado
- `.resolves` e `.rejects` esperam a Promise e aplicam o matcher ao valor ou ao erro
- `() => 1` nunca fica abaixo de 0,2; `() => 0` sempre fica

---

## :icon[test-tube] Testes assíncronos na prática

**Caso 1: conferir a ordem das etapas**, com `then` e `return`:

```javascript
test('avisa as quatro etapas, nesta ordem', () => {
  const etapas = [];
  return finalizarCompra(pedido, (etapa) => etapas.push(etapa), nuncaFalha).then(() => {
    expect(etapas).toEqual(['estoque', 'reserva', 'pagamento', 'confirmacao']);
  });
});
```

O callback `(etapa) => etapas.push(etapa)` anota cada etapa avisada; no fim, o teste confere a lista. Verde.

**Caso 2: a armadilha.** Sem `return` e com atraso de 50 ms, este teste sai verde, mesmo esperando o status errado:

```javascript
test('confirma o pedido', () => {
  expect(finalizarCompra(pedido, semAviso, { atraso: 50, sortear: () => 1 }))
    .resolves.toMatchObject({ status: 'cancelado' });
});
```

O Jest recolheu a prova antes da resposta. Com `return` antes do `expect`, ele fica vermelho, como deve.

---

## :icon[siren] Quando aparece um erro

| Você vê | Quer dizer | O que fazer |
|---|---|---|
| `Promise { <pending> }` | você imprimiu a senha, não o resultado | receber o valor no `then` |
| o erro e a pilha, e o script para | uma rejeição sem `catch` | `catch` no fim da corrente |
| `sortear is not a function` | passou `Math.random()`, um número | passar a função: `Math.random` |
| `ERR_MODULE_NOT_FOUND` só no `node` | import relativo sem `.js` | `.js` no fim do caminho |
| "aguardando..." sem parar | o `clearInterval` está só no `then` | `finally` |

---

## :icon[triangle-alert] Erros comuns

:::warning
- `then` com chaves e sem `return`: a corrente não espera a etapa
- Corrente sem `catch`: a rejeição não tratada derruba o script
- Parar o "aguardando..." só no `then`: na falha ele repete para sempre; use `finally`
- `Promise.all` quando uma parte pode falhar sozinha: um banner fora do ar apaga o relatório
- Achar que `Promise.race` cancela a perdedora: ela continua rodando
- Teste assíncrono sem `return`: passa mesmo com o código quebrado
:::

---

## Resumo

:::summary
- Uma Promise nasce pendente e encerra uma única vez: cumprida com um valor ou rejeitada com um erro
- `then` recebe o valor, `catch` trata a falha e `finally` roda nos dois casos
- O que um `then` devolve alimenta o próximo; devolver uma Promise faz a corrente esperar
- Callbacks de Promise são microtarefas: rodam antes dos timers
- `all` espera todas e falha na primeira falha; `allSettled` relata cada uma; `race` fica com a primeira
:::

---

## :icon[flask-conical] No laboratório

O checkout do `lojinha-regras` fica assíncrono, e o terminal mostra cada etapa.

:::steps
1. `FalhaNoCheckoutError` e `TempoEsgotadoError` em `src/modelos/erros.js`, estendendo `ErroDeNegocio`
2. `src/servicos/checkout.js`: `esperar`, `simularEtapa`, as quatro etapas, `comTempoLimite` e `finalizarCompra`
3. `src/scripts/finalizar.js`: um pedido com o Fone e a Caixa de Som, uma linha por etapa ("Etapa 2 de 4: Reservando seus produtos...") e, no fim, o número do pedido ou a mensagem do erro
4. `src/servicos/checkout.test.js` com pelo menos 6 testes, sem depender da sorte
5. `npm test` verde, commit "E18: checkout assíncrono com Promises" e `git push`
:::

**Critérios de entrega**: `node src/scripts/finalizar.js` mostra as etapas; com `CHANCE_DE_FALHA = 1`, aparece a mensagem do estoque; testes verdes. Entregue o link do repositório no sistema.

---

## :icon[milestone] Projeto 3 · Etapa 6: salvar com Promises

No seu repositório `lista-de-tarefas`:

- `salvarTarefas(lista, opcoes)` e `carregarTarefas(opcoes)` em `src/servicos/armazenamento.js`, devolvendo Promises sobre o `localStorage`
- nos testes, um armazenamento falso e `atraso: 0`, como o sorteio injetado do checkout
- na tela: "Carregando..." ao abrir, "Salvando..." a cada mudança e as tarefas de volta depois de recarregar
- a busca e o filtro redesenhando a lista

Commit: `Projeto 3: etapa 6, salvar com Promises`. Enunciado completo e entrega: página do curso, em **Projetos**.
