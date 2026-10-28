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

## :icon[receipt] Promise: o recibo de um resultado futuro

Uma **Promise** é um objeto que representa um valor que ainda vai chegar. Funciona como o número do pedido num app de delivery: você o recebe na hora e acompanha até a comida chegar ou o pedido ser cancelado.

:::center
![Diagrama: a Promise nasce pendente e muda uma única vez, para cumprida com um valor ou rejeitada com um erro; as duas são encerradas e nunca mudam](images/e18-estados-da-promise.svg)
:::

Ela nasce **pendente** (*pending*) e muda uma única vez: fica **cumprida** (*fulfilled*), com um valor, ou **rejeitada** (*rejected*), com um motivo, um erro. Cumprida ou rejeitada, a Promise está **encerrada** (*settled*): não volta a pendente nem troca de resultado.

---

## :icon[hammer] Criando uma Promise

`new Promise` recebe uma função com dois parâmetros: chame **`resolve(valor)`** para cumprir e **`reject(erro)`** para rejeitar.

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

A função devolve a Promise **na hora**, ainda pendente: `console.log(consultarFrete('01310-100'))` mostra `Promise { <pending> }`. O resultado chega 800 ms depois. Rejeite sempre com um `Error`, como no E17: ele traz a `message` que o script imprime.

---

## :icon[shield-check] then, catch e finally

**`then`** recebe o valor quando a Promise é cumprida. **`catch`** trata a rejeição. **`finally`** roda nos dois casos e é o lugar de desfazer o que você começou, como o "aguardando...":

```javascript
const cep = process.argv[2]; // node frete.js 01310-100
const aguardando = setInterval(() => console.log('aguardando...'), 200);

consultarFrete(cep)
  .then((valor) => console.log('Frete:', valor))
  .catch((erro) => console.log('Erro:', erro.message))
  .finally(() => clearInterval(aguardando)); // para nos dois casos
```

| Resultado | O que roda |
|---|---|
| cumprida | `then` e `finally` |
| rejeitada | `catch` e `finally` |

Sem `catch`, o erro derruba o script, como um `throw` que ninguém capturou. Com o `clearInterval` só no `then`, um CEP inválido deixa o "aguardando..." repetindo para sempre. No app, é o indicador de carregamento que nunca para.

---

## :icon[link] Encadeamento: cada then devolve uma Promise nova

O que o callback do `then` **devolve** vira o valor do próximo `then`. Se ele devolver uma Promise, a corrente **espera** por ela:

```javascript
consultarFrete(cep)
  .then((frete) => paraCentavos(sub) + paraCentavos(frete))   // devolve um número
  .then((centavos) => cobrar(paraReais(centavos), pagamento)) // devolve uma Promise
  .then((cobranca) => console.log('Cobrado:', cobranca.valor))
  .catch((erro) => console.log('Erro:', erro.message));
```

- O número vira o `centavos` do próximo elo; a Promise de `cobrar` faz a corrente esperar a cobrança
- Um erro em qualquer elo pula os `then` seguintes e cai no `catch`
- Um `throw` dentro de um `then` também rejeita a corrente
- Um `catch` no fim trata a corrente inteira

Resposta da pergunta do início: se a reserva falhar, `cobrar` e `confirmar` nunca rodam; só o `catch`.

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

## :icon[list-ordered] then nunca roda na hora

Mesmo uma Promise já cumprida roda o `then` **depois** do código atual. Os callbacks de Promise vão para a **fila de microtarefas**, que o event loop esvazia antes de passar para a próxima tarefa da fila, como um timer:

```javascript
console.log('1. Cliente escolheu Pix');
setTimeout(() => console.log('4. Timer de 0 ms'), 0);
Promise.resolve('Pix gerado').then((msg) => console.log('3. ' + msg));
console.log('2. Fim do código atual');
```

No Node, a saída sai na ordem **1, 2, 3, 4**.

| Tipo | Exemplos | Quando roda |
|---|---|---|
| Código atual | o script, do começo ao fim | primeiro, inteiro |
| Microtarefa | `then`, `catch`, `finally` | logo que a pilha esvazia |
| Tarefa | `setTimeout`, `setInterval` | depois das microtarefas |

---

## :icon[repeat] Microtarefas passam na frente

:::center
![Animação: o script roda inteiro e imprime 1 e 2; com a pilha vazia, a microtarefa do then imprime 3; só depois a tarefa do setTimeout de 0 ms imprime 4](images/e18-microtarefas.svg)
:::

No exemplo do Pix, o `setTimeout` foi agendado antes do `then`, mas roda depois. Com a pilha vazia, o event loop esvazia a fila de microtarefas inteira e só então pega a próxima tarefa, mesmo com atraso 0.

---

## :icon[dices] Uma etapa simulada

Sem servidor de pagamento (a API de verdade chega no E19), o laboratório simula cada etapa com espera e sorteio. Em `src/servicos/checkout.js`:

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

- `sortear` e `atraso` são **injetáveis**: o script usa os padrões; o teste passa os seus
- `aoMudarEtapa` avisa quem chamou qual etapa começou: hoje o script imprime; no app, a tela mostra
- `FalhaNoCheckoutError`, novo em `src/modelos/erros.js`, estende o `ErroDeNegocio` do E17 e guarda a `etapa`

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

## :icon[combine] Promise.all: tudo ao mesmo tempo

Frete, prazo e cupom não dependem um do outro. Com **`Promise.all`**, as três consultas (simuladas, como `consultarFrete`) começam juntas:

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

O relatório da vitrine junta destaques, categorias e banners, que vêm de lugares diferentes. Um banner fora do ar não deveria apagar o relatório inteiro, nem, no app, a tela Início:

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

**`Promise.race`** fica com o resultado da **primeira** Promise que encerrar, cumprida ou rejeitada. Corra a cobrança contra um timer:

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

## :icon[test-tube] Testes assíncronos no Jest

Em `src/servicos/checkout.test.js`, injete atraso 0 e um sorteio fixo:

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

- **Devolva** a Promise com `return`: sem ele, o Jest dá o teste por encerrado antes do resultado, e o resumo pode sair verde com o código quebrado
- `.resolves` e `.rejects` esperam a Promise e aplicam o matcher ao valor ou ao erro
- `() => 1` nunca fica abaixo de 0,2; `() => 0` sempre fica

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
