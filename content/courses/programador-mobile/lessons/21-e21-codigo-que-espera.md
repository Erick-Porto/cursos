---
title: Código que espera
summary: "Esperar sem travar: setTimeout, Promise e async/await; a lista de tarefas salva e carrega no navegador."
module: classes-e-controle
duration_minutes: 90
objectives:
  - Prever a ordem em que aparecem as linhas de um código com setTimeout
  - Criar uma Promise e esperar por ela com async e await
  - Guardar e ler a lista no localStorage com JSON.stringify e JSON.parse
  - Testar no Jest uma função que espera, com um armazenamento de mentira
---

# Código que espera

Programador Mobile · Encontro E21 · Aula 21 de 45

---

## O que você vai aprender

:::goal
- Fazer o código esperar sem travar o resto do programa
- Prever em que ordem as linhas aparecem quando algo espera
- Criar uma Promise e esperar por ela com `async` e `await`
- Guardar a lista no navegador com o `localStorage` e o JSON
- Testar no Jest o código que espera
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **assíncrono** | o que termina depois: você pede agora e recebe mais tarde, sem ficar parado |
| **callback** | uma função que você entrega para outra chamar depois |
| **milissegundo** | a milésima parte de um segundo: 1000 ms são 1 segundo |
| **Promise** | a senha de um resultado que ainda vai chegar |
| **`async` / `await`** | o jeito de esperar uma Promise sem travar o resto do programa |
| **`localStorage`** | a gaveta do navegador: guarda textos mesmo depois de fechar a página |

---

## A lista que esquece

Abra a lista de tarefas (`npx serve .` e `http://localhost:3000/web/`). Escreva "Comprar pão" e aperte <kbd>F5</kbd>: a tarefa some, e voltam as seis de demonstração. No topo, a tela avisa:

```plaintext
Sem salvar: ao recarregar, a lista volta ao começo (etapa 5).
```

| Hoje | No fim do encontro |
|---|---|
| recarregou, perdeu a tarefa | recarregou, as tarefas voltam |
| nada fica guardado | a lista fica guardada no navegador |
| nenhum aviso | "Salvando..." no topo a cada mudança |

:::question
Num app de verdade, as tarefas vão para um servidor, longe daqui, e a resposta demora. O que a tela faz enquanto espera?
:::

---

## Código que espera

No restaurante com um garçom só, ele espera o prato parado na cozinha?

---

## :icon[hourglass] Código que espera: o garçom

Um restaurante tem um garçom só. Ele anota o pedido da mesa 4 e leva à cozinha. Se ficasse lá parado até o prato sair, as outras mesas ficariam esperando. O bom garçom atende as outras e **volta quando a cozinha chama**.

O JavaScript também tem um garçom só. O que demora (salvar, buscar na internet, contar um tempo) espera "na cozinha", e o resto do código segue. O código que termina depois é **assíncrono**.

| Jeito | O garçom | No app |
|---|---|---|
| esperar parado | fica na cozinha até o prato sair | a tela congela: nenhum botão responde |
| **assíncrono** | anota, atende outras mesas e volta | a tela mostra "Salvando..." e responde |

---

## :icon[timer] setTimeout: faça isto daqui a pouco

O **`setTimeout`** (de *set timeout*, marcar um tempo) diz: "rode esta função daqui a tantos milissegundos". Aqui, ele faz o papel da cozinha. Numa pasta de exemplos, fora do projeto, crie `garcom.js` e rode com `node garcom.js`:

```javascript
console.log('Anotei o pedido da mesa 4');
setTimeout(() => {
  console.log('Prato da mesa 4 pronto');
}, 2000);
console.log('Fui atender a mesa 5');
```

```plaintext
Anotei o pedido da mesa 4
Fui atender a mesa 5
Prato da mesa 4 pronto        (2 segundos depois)
```

- `2000` é o tempo, em milissegundos: 2 segundos
- A função de seta (E07) é o que roda depois. Ela é o **callback** (de *call back*, chamar de volta): o que o garçom faz quando a cozinha chama
- O `setTimeout` não para o programa: a mesa 5 é atendida na hora

---

## :icon[timer] Callbacks na prática

**Caso 1: um callback com nome.** Uma função declarada também serve. Ela vai **sem parênteses**: você entrega a função, e quem chama é o `setTimeout`.

```javascript
function avisarPronto() {
  console.log('Prato pronto!');
}

setTimeout(avisarPronto, 1000);
console.log('Pedido anotado');
// Pedido anotado
// Prato pronto!       (1 segundo depois)
```

**Caso 2: com parênteses, ela roda na hora.** `setTimeout(avisarPronto(), 1000)` mostra "Prato pronto!" na hora e quebra com `The "callback" argument must be of type function`: o `setTimeout` recebeu o resultado, não a função.

**Caso 3: você já usava callbacks.** O teste do `filter`, da aula 3, é um callback: o `filter` chama na hora, um item de cada vez. O do `setTimeout` é chamado depois.

---

## :icon[notebook-pen] Exercícios: Código que espera

:::example Exercícios
1. O que aparece, e quando?
   ```javascript
   console.log('Ônibus chamado no app');
   setTimeout(() => console.log('Ônibus na parada'), 1500);
   console.log('Fone no ouvido');
   ```
2. Complete para a função `avisarTreino` rodar daqui a 3 segundos: `setTimeout(___, ___);`
3. Ache o erro: `setTimeout(tocarAlarme(), 5000);`
4. Escreva a linha que mostra `'Pipoca pronta!'` daqui a 90 segundos, com uma seta
:::

:::tip Respostas
1. `Ônibus chamado no app` e `Fone no ouvido` na hora; 1,5 segundo depois, `Ônibus na parada`. O `setTimeout` não para o programa
2. `setTimeout(avisarTreino, 3000);`: a função vai sem parênteses, e 3 segundos são 3000 ms
3. Com parênteses, o alarme toca na hora, e o Node quebra com `The "callback" argument must be of type function`. O certo: `setTimeout(tocarAlarme, 5000);`
4. `setTimeout(() => console.log('Pipoca pronta!'), 90000);`
:::

---

## A ordem das linhas

Você pede suco, lanche e água. Qual chega primeiro à mesa: o primeiro pedido ou o mais rápido?

---

## :icon[list-ordered] O que aparece primeiro

Com `setTimeout`, a ordem do texto não é a ordem da tela. A regra tem duas partes:

1. Primeiro, todo o código de agora, de cima para baixo
2. Depois, cada callback, na ordem em que o tempo dele acaba

```javascript
setTimeout(() => console.log('Suco pronto'), 1000);
setTimeout(() => console.log('Lanche pronto'), 3000);
setTimeout(() => console.log('Água na mesa'), 0);
console.log('Pedidos anotados');
```

| Ordem | Aparece | Por quê |
|---|---|---|
| 1 | `Pedidos anotados` | código de agora: não espera nada |
| 2 | `Água na mesa` | 0 ms, mas depois do código de agora |
| 3 | `Suco pronto` | o tempo acaba em 1 segundo |
| 4 | `Lanche pronto` | o tempo acaba em 3 segundos |

O garçom só vai à cozinha quando termina o que está fazendo: mesmo com 0 ms, o callback espera.

---

## :icon[notebook-pen] Exercícios: A ordem das linhas

:::example Exercícios
1. Em que ordem aparecem as quatro linhas?
   ```javascript
   console.log('A: tarefa adicionada');
   setTimeout(() => console.log('B: tudo salvo'), 300);
   console.log('C: lista desenhada');
   setTimeout(() => console.log('D: lembrete'), 0);
   ```
2. Qual aparece primeiro: `setTimeout(() => console.log('Sinal da escola'), 0);` ou, na linha de baixo, `console.log('Chamada feita');`?
3. Em que ordem aparecem as linhas da academia?
   ```javascript
   function avisarAula() {
     console.log('Aula de spinning começou');
   }
   setTimeout(avisarAula, 200);
   console.log('Catraca liberada');
   setTimeout(() => console.log('Toalha entregue'), 50);
   console.log('Armário 12');
   ```
:::

:::tip Respostas
1. **A, C, D, B.** A e C são código de agora e saem primeiro, na ordem do texto. Depois, os callbacks, na ordem em que o tempo acaba: o D com 0 ms e o B com 300 ms
2. `Chamada feita`: mesmo com 0 ms, o callback espera o código de agora
3. `Catraca liberada`, `Armário 12`, `Toalha entregue` (50 ms) e `Aula de spinning começou` (200 ms)
:::

---

## Promise

Na lanchonete, você paga e o lanche ainda não está pronto. O que você recebe na mão?

---

## :icon[ticket] Promise: a senha da lanchonete

Na lanchonete, você paga e recebe uma **senha**. O lanche não está pronto, mas a senha garante uma resposta: ou chamam o seu número, ou o pedido é cancelado.

Uma **Promise** (promessa) é essa senha: um objeto que representa um resultado que ainda vai chegar. Ela nasce **pendente** e muda uma vez só:

:::center
![Diagrama: a Promise nasce pendente e muda uma única vez; se deu certo, fica cumprida, com um valor; se falhou, fica rejeitada, com um erro; cumprida ou rejeitada, ela está encerrada e nunca mais muda](images/e18-estados-da-promise.svg)
:::

- **Cumprida**: chamaram a senha, e o resultado chegou
- **Rejeitada**: o pedido foi cancelado, com um erro. Hoje toda senha é cumprida; a cancelada chega no E22, quando a internet falha

---

## :icon[ticket] Criar uma Promise: o esperar

A função `esperar` entrega uma senha que é chamada depois de `ms` milissegundos. Ela junta a Promise com o `setTimeout`:

```javascript
function esperar(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const senha = esperar(2000);
console.log(senha);   // Promise { <pending> }
```

| Parte | O que ela diz |
|---|---|
| `new Promise(...)` | "crie uma senha nova", com o `new` das classes, do E18 |
| `(resolve) => { ... }` | a função que decide quando a senha é chamada |
| `resolve` (resolver) | o botão que a Promise entrega à função: apertar é chamar a senha |
| `setTimeout(resolve, ms)` | "daqui a `ms`, chame o `resolve`": ele é o callback, sem parênteses |

O `<pending>` quer dizer pendente: a senha chegou na hora, o resultado ainda não.

---

## :icon[notebook-pen] Exercícios: Promise

:::example Exercícios
1. Você pediu um carro pelo aplicativo, e a tela diz "procurando motorista". Se o pedido fosse uma Promise, em que estado ela estaria? E se a corrida for cancelada?
2. Complete para a senha ser chamada depois de `ms` milissegundos:
   ```javascript
   function contarTempo(ms) {
     return new Promise((resolve) => {
       setTimeout(___, ms);
     });
   }
   ```
3. Ache o erro: por que aparece `undefined`, e não `Promise { <pending> }`?
   ```javascript
   function esperarOnibus(ms) {
     new Promise((resolve) => {
       setTimeout(resolve, ms);
     });
   }
   console.log(esperarOnibus(1000));
   ```
:::

:::tip Respostas
1. Pendente. Cancelada, ela fica rejeitada, com um erro, e não muda mais
2. `resolve`, sem parênteses: é o callback que o `setTimeout` chama depois de `ms`
3. Falta o `return` antes do `new Promise`: sem ele, a função não entrega a senha, e quem chama recebe `undefined`
:::

---

## async e await

Dá para esperar a senha ser chamada sem travar a fila inteira?

---

## :icon[hourglass] async e await: esperar sem travar a fila

O **`await`** (aguarde) é esperar a senha ser chamada sem travar a fila. Escrito antes de uma Promise, ele **pausa a função** naquela linha até a senha ser chamada. O resto do programa segue. O `await` só funciona dentro de uma função marcada com **`async`** (assíncrona).

```javascript
async function prepararLanche() {
  console.log('Senha 42: preparando');
  await esperar(2000);
  console.log('Senha 42: pode retirar');
}

prepararLanche();
console.log('Próximo da fila');
```

```plaintext
Senha 42: preparando
Próximo da fila
Senha 42: pode retirar        (2 segundos depois)
```

O `esperar` é o da Promise, escrito no topo do mesmo arquivo. Só a `prepararLanche` ficou parada: o "Próximo da fila" não esperou.

---

## :icon[list-ordered] O lanche, momento a momento

Quem espera a senha sai da frente do balcão: a fila anda e, quando chamam o número, a pessoa volta para retirar.

| Momento | O que roda | Aparece |
|---|---|---|
| 0 s | `prepararLanche()` começa | `Senha 42: preparando` |
| 0 s | `await esperar(2000)`: a função pausa e dá a vez | nada |
| 0 s | a última linha do arquivo | `Próximo da fila` |
| 2 s | a senha é chamada: a função continua de onde parou | `Senha 42: pode retirar` |

O `await` não trava o programa: ele tira a função da frente até a senha ser chamada.

---

## :icon[hourglass] async e await na prática

**Caso 1: a função `async` devolve uma senha.** O `return` dela vira o resultado da senha. Sem `await`, você pega a senha; com `await`, o resultado:

```javascript
async function contarPendentes() {
  await esperar(500);
  return 3;
}

async function mostrar() {
  const senha = contarPendentes();
  console.log(senha);                 // Promise { <pending> }
  const total = await contarPendentes();
  console.log('Pendentes:', total);   // Pendentes: 3
}

mostrar();
```

**Caso 2: `await` fora de `async` é erro.** Numa função comum, o Node para antes de rodar a primeira linha, apontando o `await`. A mensagem é `await is only valid in async functions` ou, dentro do projeto e no Jest, `Unexpected reserved word`.

---

## :icon[notebook-pen] Exercícios: async e await

:::example Exercícios
Nos três, o `esperar(ms)` é o da Promise, no topo do arquivo.

1. Em que ordem aparecem as três linhas?
   ```javascript
   async function aquecer() {
     console.log('Esteira ligada');
     await esperar(1000);
     console.log('Aquecimento feito');
   }
   aquecer();
   console.log('Música no fone');
   ```
2. Por que `function chamarProximo() { await esperar(500); }` nem chega a rodar?
3. O que aparece ao chamar `fechar()`? Conserte para mostrar `Frete: 15`.
   ```javascript
   async function precoDoFrete() {
     await esperar(200);
     return 15;
   }
   async function fechar() {
     const frete = precoDoFrete();
     console.log('Frete:', frete);
   }
   ```
:::

:::tip Respostas
1. `Esteira ligada`, `Música no fone` e, 1 segundo depois, `Aquecimento feito`: o `await` pausa só a `aquecer`
2. O `await` só vale em função `async`: o Node para antes da primeira linha, com `await is only valid in async functions`
3. `Frete: Promise { <pending> }`, a senha. Com `const frete = await precoDoFrete();`, aparece `Frete: 15`
:::

---

## Testes que esperam

Se o professor recolhe a prova antes de você responder, a nota vale alguma coisa?

---

## :icon[test-tube] O teste que espera

O teste é a prova com gabarito que o computador corrige sozinho (E08). Quando o código espera, o teste precisa esperar junto: senão, confere antes da resposta. No Jest, a função do teste também pode ser `async`, e o Jest espera por ela:

```javascript
async function contarPendentes() {
  await esperar(500);
  return 3;
}

test('contarPendentes devolve 3', async () => {
  const total = await contarPendentes();
  expect(total).toBe(3);
});
```

| Parte | O que ela diz |
|---|---|
| `async () => { ... }` | a seta do teste é `async`: dentro dela vale o `await` |
| `await contarPendentes()` | "espere a senha e guarde o resultado em `total`" |
| sem o `await` | o teste confere a senha: `Expected: 3`, `Received: Promise {}` |

---

## :icon[notebook-pen] Exercícios: Testes que esperam

:::example Exercícios
Nos três, `contarVagas()` é uma função `async` que devolve `12` depois de uma espera.

1. Complete o teste:
   ```javascript
   test('contarVagas devolve 12', ___ () => {
     const vagas = ___ contarVagas();
     expect(vagas).toBe(12);
   });
   ```
2. Sem o `await` antes de `contarVagas()`, o teste fica verde ou vermelho? O que o Jest mostra?
3. Com o `await` e sem o `async`, o que acontece?
:::

:::tip Respostas
1. `async` e `await`: a seta do teste é `async`, e o `await` espera o resultado
2. Vermelho, com `Expected: 12` e `Received: Promise {}`: o teste conferiu a senha, antes da resposta
3. O Jest nem roda o arquivo: `Unexpected reserved word 'await'`. O `await` pede uma função `async` em volta
:::

---

## :icon[milestone] Projeto 3 · Passo 1: esperar

Em `src/servicos/armazenamento.js`, troque o comentário do kit por:

```javascript
// Etapa 5 (E21). Salvar e carregar a lista. Quem chama diz onde guardar: a tela passa o
// localStorage do navegador; os testes passam um armazenamento de mentira.

// Uma Promise que termina depois de ms milissegundos. Imita a demora de um servidor.
export function esperar(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
```

Crie `src/servicos/armazenamento.test.js`:

```javascript
import { esperar } from './armazenamento.js';

test('esperar faz o código esperar o tempo pedido', async () => {
  const antes = Date.now();
  await esperar(300);
  const depois = Date.now();
  expect(depois - antes >= 290).toBe(true); // 10 ms de folga: o relógio não é exato
});
```

- **`Date.now()`** é a hora de agora, em milissegundos; `depois - antes` é quanto tempo passou
- `>= 290` dá 10 ms de folga, porque o relógio pode errar um pouco

**Pronto quando:** `npm test` verde, com `Tests: 70 passed` e `Test Suites: 7 passed`. Na tela, "O que a página usa" mostra a Etapa 5 em 1 de 4.

---

## localStorage

Você fecha a aba da loja e volta no dia seguinte. Como o carrinho ainda está lá?

---

## :icon[archive] localStorage: a gaveta do navegador

O **`localStorage`** (armazenamento local) é uma gaveta que o navegador dá a cada site: o que você guarda continua lá depois de recarregar ou fechar a página. Ele tem dois botões:

| Botão | O que faz |
|---|---|
| `localStorage.setItem(chave, texto)` | guarda o texto com um nome, a **chave** |
| `localStorage.getItem(chave)` | devolve o texto guardado, ou `null` se não há nada |

- A gaveta só guarda **texto**. Uma lista vira texto com `JSON.stringify` e volta a ser lista com `JSON.parse`, da aula 3
- Cada endereço tem a sua gaveta: `localhost:3000` e `localhost:3001` não enxergam a do outro
- No DevTools, a aba **Application** (aplicação), em **Local storage**, mostra o que está guardado

---

## :icon[archive] localStorage na prática

Na página da lista, abra o Console do DevTools (<kbd>F12</kbd>) e digite uma linha de cada vez:

```plaintext
> localStorage.setItem('recado', 'Comprar pão')
undefined
> localStorage.getItem('recado')
'Comprar pão'
> localStorage.getItem('nada')
null
```

Aperte <kbd>F5</kbd> e peça o recado de novo: ele continua lá. Uma lista vai com o JSON:

```plaintext
> localStorage.setItem('tarefas', JSON.stringify(['Regar as plantas', 'Comprar pão']))
undefined
> localStorage.getItem('tarefas')
'["Regar as plantas","Comprar pão"]'
> JSON.parse(localStorage.getItem('tarefas')).length
2
```

Sem o `JSON.stringify`, um objeto vira o texto `'[object Object]'`, e a lista se perde.

---

## :icon[archive] O armazenamento de mentira

O Jest roda no Node, sem navegador: lá não existe `localStorage` (`ReferenceError: localStorage is not defined`). Por isso, `salvarTarefas` e `carregarTarefas` **recebem** o armazenamento. A tela passa o `localStorage`; o teste passa um **armazenamento de mentira**, uma classe (E18) com os mesmos dois botões. Ela vai no `armazenamento.test.js`, logo abaixo dos imports:

```javascript
// Um armazenamento de mentira: tem o getItem e o setItem do localStorage,
// mas guarda os textos num objeto comum. Funciona no Jest, sem navegador.
class ArmazenamentoFalso {
  constructor() {
    this.guardado = {};
  }

  getItem(chave) {
    return this.guardado[chave] ?? null;
  }

  setItem(chave, texto) {
    this.guardado[chave] = texto;
  }
}
```

- `this.guardado[chave]`: a chave vem de uma variável, então vai entre colchetes (E13)
- `?? null`: sem nada naquela chave, devolve `null`, como o `localStorage` (o `??` do E17)

---

## :icon[notebook-pen] Exercícios: localStorage

:::example Exercícios
1. No Console do navegador, `localStorage.setItem('volume', 8)` e depois `localStorage.getItem('volume') + 2`. O que aparece?
2. Escreva a linha que guarda a lista `['Pão', 'Leite']` na chave `'compras'`
3. O que aparece?
   ```javascript
   const treino = { aluno: 'Rita', series: 3 };
   const texto = JSON.stringify(treino);
   console.log(texto);
   console.log(texto.series, JSON.parse(texto).series);
   ```
4. Ontem, o app da academia abriu em `localhost:3000`; hoje, em `localhost:3001`. A ficha salva ontem aparece?
:::

:::tip Respostas
1. `'82'`: a gaveta guardou o 8 como texto, e o `+` com texto junta
2. `localStorage.setItem('compras', JSON.stringify(['Pão', 'Leite']));`: a gaveta só guarda texto
3. `{"aluno":"Rita","series":3}` e `undefined 3`: o texto não tem campos; o `JSON.parse` devolve a ficha
4. Não: cada endereço tem a sua gaveta
:::

---

## :icon[milestone] Projeto 3 · Passo 2: salvar

Em `armazenamento.js`, a `CHAVE` logo abaixo do comentário do topo e a `salvarTarefas` no fim do arquivo:

```javascript
export const CHAVE = 'lista-de-tarefas';

// ... o esperar continua igual

export async function salvarTarefas(lista, armazenamento) {
  await esperar(300);
  const texto = JSON.stringify(lista.tarefas);
  armazenamento.setItem(CHAVE, texto);
}
```

| Linha | O que ela diz |
|---|---|
| `export const CHAVE = ...` | o nome da gaveta, na vitrine para o teste e a tela usarem |
| `export async function` | a função espera alguma coisa, então é `async` |
| `await esperar(300)` | finge a demora de um servidor: 300 ms |
| `JSON.stringify(lista.tarefas)` | a lista de tarefas vira texto |
| `armazenamento.setItem(CHAVE, texto)` | guarda o texto no armazenamento que veio de fora |

---

## :icon[milestone] Projeto 3 · Passo 2: o teste do salvar

Em `armazenamento.test.js`, troque o import do topo por estes três. Logo abaixo deles, a classe `ArmazenamentoFalso`; no fim, o teste novo:

```javascript
import { CHAVE, esperar, salvarTarefas } from './armazenamento.js';
import ListaDeTarefas from '../modelos/ListaDeTarefas.js';
import Tarefa from '../modelos/Tarefa.js';

// ... a classe ArmazenamentoFalso e o teste do esperar

test('salvarTarefas guarda a lista em texto JSON', async () => {
  const lista = new ListaDeTarefas();
  lista.adicionar(new Tarefa({ titulo: 'Pagar a conta de luz', prioridade: 'alta' }));
  const armazenamento = new ArmazenamentoFalso();
  await salvarTarefas(lista, armazenamento);
  const salvas = JSON.parse(armazenamento.getItem(CHAVE));
  expect(salvas.length).toBe(1);
  expect(salvas[0].titulo).toBe('Pagar a conta de luz');
});
```

**Pronto quando:** `Tests: 71 passed`. Na tela, cada mudança mostra "Salvando..." no topo e depois "Salvo. Ao recarregar, a lista ainda volta ao começo: falta carregarTarefas.". No DevTools, em Local storage, aparece a chave `lista-de-tarefas`. A Etapa 5 mostra 2 de 4.

---

## :icon[milestone] Projeto 3 · Passo 3: carregar

Em `armazenamento.js`, o import da lista na primeira linha e a `carregarTarefas` no fim:

```javascript
import ListaDeTarefas from '../modelos/ListaDeTarefas.js';

// ... o comentário, a CHAVE, o esperar e o salvarTarefas continuam iguais

export async function carregarTarefas(armazenamento) {
  await esperar(300);
  const texto = armazenamento.getItem(CHAVE) ?? '[]';
  const dados = JSON.parse(texto);
  const lista = new ListaDeTarefas();
  lista.importar(dados);
  return lista;
}
```

| Linha | O que ela diz |
|---|---|
| `getItem(CHAVE) ?? '[]'` | o texto guardado; na primeira visita vem `null`, e fica `'[]'`, uma lista vazia em texto |
| `JSON.parse(texto)` | o texto volta a ser uma lista de fichas |
| `lista.importar(dados)` | o `importar` do E20: cria cada tarefa e pula a que tiver problema |
| `return lista` | o resultado da senha: quem chama recebe com `await` |

---

## :icon[milestone] Projeto 3 · Passo 3: o teste da ida e volta

No `armazenamento.test.js`, o `carregarTarefas` entra no primeiro import. No fim, o teste que salva e carrega de volta:

```javascript
import { CHAVE, carregarTarefas, esperar, salvarTarefas } from './armazenamento.js';

test('carregarTarefas devolve o que foi salvo', async () => {
  const lista = new ListaDeTarefas();
  lista.adicionar(new Tarefa({ titulo: 'Pagar a conta de luz', prioridade: 'alta' }));
  lista.adicionar(new Tarefa({ titulo: 'Comprar ração do gato', concluida: true }));
  const armazenamento = new ArmazenamentoFalso();
  await salvarTarefas(lista, armazenamento);
  const carregada = await carregarTarefas(armazenamento);
  expect(carregada.tarefas.length).toBe(2);
  expect(carregada.buscar(1).prioridade).toBe('alta');
  expect(carregada.buscar(2).concluida).toBe(true);
});
```

Dois `await`, um de cada vez: primeiro espera salvar, depois espera carregar.

**Pronto quando:** `Tests: 72 passed`. Recarregue a tela: as tarefas continuam lá, e o topo diz "Tarefas carregadas.". Para começar do zero, apague a chave `lista-de-tarefas` no DevTools e recarregue: "Nenhuma tarefa por aqui.". A Etapa 5 mostra 3 de 4.

---

## :icon[milestone] Projeto 3 · Sua vez: o texto salvo quebrado

Se alguém mexer no texto salvo pelo DevTools, o `carregarTarefas` lança um erro. Faça o texto quebrado virar uma **lista vazia**, com três testes novos:

1. Nada salvo: a lista vem vazia
2. `'{quebrado'` salvo na `CHAVE`: a lista vem vazia
3. Uma `TarefaRecorrente` salva volta com a `frequencia`

:::tip Dicas
- A rede do E20 abraça **só** o `JSON.parse`. Assim, o único erro que cai nela é o esperado, o texto quebrado, e aqui não é preciso relançar
- No `catch`, os dados viram `[]`. O `let dados` nasce antes do `try`, para existir depois dele
:::

**Pronto quando:** `npm test` verde. No Console, `localStorage.setItem('lista-de-tarefas', '{quebrado')` e <kbd>F5</kbd>: a lista começa vazia. Etapa 5 em 4 de 4.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `await is only valid` ou `Unexpected reserved word` | `await` numa função sem `async` | `async` na função |
| `Promise { <pending> }` ou `Received: Promise {}` | veio a senha, não o resultado | `await` antes da chamada |
| `Cannot read properties of null` | o teste leu antes de gravar | `await salvarTarefas(...)` |
| `localStorage is not defined` | a função usou a gaveta direto | usar o `armazenamento` recebido |
| `Expected property name` | texto quebrado no `JSON.parse` | o `try`/`catch` da Sua vez |
| `dados is not defined` | `let dados` dentro do `try` | declarar antes do `try` |

---

## :icon[milestone] Projeto 3 · Etapa 5 pronta

`npm test` verde, sem nenhum teste tocar no `localStorage` de verdade. Com os testes do enunciado, das etapas 1 a 5:

```plaintext
Test Suites: 7 passed, 7 total
Tests:       75 passed, 75 total
```

- `src/servicos/armazenamento.js` com `CHAVE`, `esperar`, `salvarTarefas` e `carregarTarefas`, cada um com `export`
- `armazenamento.test.js` com o `ArmazenamentoFalso` e os seis testes
- Na tela, as tarefas voltam depois de recarregar, e o DevTools mostra o texto salvo
- "O que a página usa": a Etapa 5 em 4 de 4

Commit `Projeto 3: etapa 5, salvar e carregar` e `git push`. O que faltar, termine em casa: o E22 começa daqui.

---

## Resumo

:::summary
- Código assíncrono termina depois, e o programa não para: é o garçom que atende outras mesas
- `setTimeout(callback, ms)` roda o callback depois de `ms` milissegundos; o código de agora sai sempre primeiro
- Uma Promise é a senha de um resultado que vai chegar; no `new Promise((resolve) => ...)`, o `resolve` chama a senha
- `await` espera a senha sem travar a fila e só vale dentro de função `async`, que sempre devolve uma Promise
- O `localStorage` guarda texto: `JSON.stringify` para gravar, `JSON.parse` para ler; `getItem` devolve `null` se não há nada
- No Jest, o teste que espera é `async`, com `await`, e um armazenamento de mentira faz o papel do `localStorage`
:::

---

## :icon[arrow-right] Próximos passos

No E22, a espera é de verdade: o **`fetch`** busca tarefas de exemplo numa API, na internet.

- :icon[cloud-download] o botão **Importar exemplos** passa a funcionar
- :icon[shield-alert] sem internet, a senha é cancelada, e o `try`/`catch` com `await` mostra a mensagem em português
- :icon[send] o README e a entrega do Projeto 3
