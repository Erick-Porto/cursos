---
title: APIs com fetch
summary: Tarefas de exemplo da internet com fetch, o status e o ok da resposta, a falta de rede e o Projeto 3 entregue.
module: classes-e-controle
duration_minutes: 90
objectives:
  - Ler o JSON que uma API devolve, abrindo o endereço no navegador
  - Buscar dados com fetch e conferir o status e o ok da resposta
  - Tratar a falta de internet com try/catch em volta do await
  - Testar uma busca sem internet, com uma resposta de mentira e rejects.toThrow
---

# APIs com fetch

Programador Mobile · Encontro E22 · Aula 22 de 45

---

## O que você vai aprender

:::goal
- Abrir uma API no navegador e ler o JSON que ela devolve
- Buscar dados na internet com o `fetch`
- Conferir se a resposta deu certo, pelo `status` e pelo `ok`
- Testar uma busca sem internet, com uma resposta de mentira
- Terminar e entregar o Projeto 3
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **API** | o cardápio de um servidor: os endereços de pedido que ele aceita |
| **HTTP** | a língua do pedido e da resposta na internet |
| **endereço** (URL) | o pedido escrito: `https://dummyjson.com/todos?limit=10` |
| **status** | o número da resposta: 200 deu certo, 404 não existe |
| **`fetch`** | o garçom do JavaScript: leva o pedido e traz a resposta |
| **resposta de mentira** | uma resposta feita no teste, para ele rodar sem internet |

---

## Os exemplos da internet

A lista de tarefas tem um cartão **Tarefas de exemplo**, com o botão **Importar exemplos**. Hoje ele está desligado: "Chega na etapa 6: falta buscarExemplos em src/servicos/exemplos.js."

| Importar exemplos | Hoje | No fim do dia |
|---|---|---|
| um clique | desligado | "5 tarefas novas na lista." |
| outro clique | desligado | "Nenhuma tarefa nova: os exemplos já estão na lista." |
| sem internet | desligado | "Sem conexão com a internet. Confira e tente de novo." |

É a última etapa do Projeto 3. No fim do dia, ele está pronto para entregar.

:::question
As tarefas de exemplo não estão em nenhum arquivo do projeto. De onde elas vêm?
:::

---

## APIs

No restaurante, como o seu pedido chega à cozinha e o prato volta para a mesa?

---

## :icon[network] API: o cardápio do servidor

No E01, o navegador pedia uma página, e o **servidor**, a cozinha, mandava os arquivos. Um servidor também pode mandar só **dados**. É o garçom: você pede pelo cardápio, a cozinha prepara, ele traz o prato.

| No restaurante | Na internet |
|---|---|
| o cardápio | a **API** (*Application Programming Interface*, a conversa entre programas): os pedidos que o servidor aceita |
| a cozinha | o servidor; hoje, a **DummyJSON** |
| o pedido | um **endereço**: `https://dummyjson.com/todos?limit=10` |
| o prato | os dados, em **JSON**, o formato da aula 3 |

O **HTTP** é a língua do pedido e da resposta: daí o `https://` do endereço. Depois do `?`, o detalhe do pedido: `limit=10`, "só 10".

---

## :icon[braces] APIs na prática

**Caso 1: a lista.** Abra `https://dummyjson.com/todos?limit=10` numa aba do navegador. O JSON pode vir numa linha só. Organizado, com as 2 primeiras das 10 tarefas:

```json
{
  "todos": [
    { "id": 1, "todo": "Do something nice for someone you care about", "completed": false, "userId": 152 },
    { "id": 2, "todo": "Memorize a poem", "completed": true, "userId": 13 }
  ],
  "total": 254,
  "skip": 0,
  "limit": 10
}
```

| Campo | O que é |
|---|---|
| `todos` | a lista de tarefas (*to-do* é "a fazer") |
| `todo` | o título, em inglês: a API é de testes |
| `completed` | concluída: `true` ou `false` |

**Caso 2: uma tarefa só.** `https://dummyjson.com/todos/4` traz só a tarefa 4, "Watch a documentary".

---

## :icon[milestone] Projeto 3 · Passo 1: o endereço dos exemplos

:::steps
1. Abra `https://dummyjson.com/todos?limit=10` no navegador e conte as pendentes, com `"completed": false`: são 5 das 10
2. Abra o DevTools (<kbd>F12</kbd>), aba **Network** (Rede), e recarregue: o pedido `todos?limit=10` aparece com o **Status** 200
3. No VS Code, em `src/servicos/exemplos.js`, troque o comentário do kit por:
:::

```javascript
// Etapa 6 (E22). Tarefas de exemplo da API DummyJSON. Quem chama passa a função que
// busca na internet: a tela passa o fetch; os testes passam uma de mentira.

export const URL_DOS_EXEMPLOS = 'https://dummyjson.com/todos?limit=10';
```

O `export const` põe o endereço na vitrine, como a `CHAVE` do E21. O nome em maiúsculas avisa: é um valor fixo.

**Pronto quando:** `npm test` continua verde, com `Tests: 75 passed`: ainda não há teste novo.

---

## fetch

No JavaScript, quem faz o papel do garçom?

---

## :icon[cloud-download] fetch: o garçom do JavaScript

O **`fetch`** (buscar, em inglês) leva o pedido ao endereço e traz a resposta. Ele já vem no navegador e no Node: nada para instalar. A resposta demora, então o `fetch` devolve uma **Promise**, a senha da lanchonete do E21, e o **`await`** espera a senha ser chamada.

No REPL, a calculadora da aula 3 (`node`, no terminal), o `await` funciona solto, fora de uma função `async`:

```bash
> const resposta = await fetch('https://dummyjson.com/todos?limit=10')
undefined
> resposta.status
200
> const dados = await resposta.json()
undefined
> dados.todos.length
10
```

São dois `await`: o primeiro espera a **resposta** chegar; o segundo espera o **corpo** dela, o JSON, virar objeto.

---

## :icon[list-ordered] O fetch em português

| Linha | O que ela diz |
|---|---|
| `fetch('https://...')` | "garçom, leve este pedido a este endereço" |
| `await fetch(...)` | "espere a resposta": o número dela chega primeiro, o corpo ainda está a caminho |
| `resposta.status` | o número da resposta: `200` é "deu certo" |
| `resposta.json()` | "transforme o corpo em objeto": o `JSON.parse` da aula 3, para respostas |
| `await resposta.json()` | "espere o corpo chegar inteiro e virar objeto" |
| `dados.todos.length` | quantas tarefas vieram no campo `todos`: 10 |

Sem o segundo `await`, `dados` guarda a senha, não o prato: `dados.todos` dá `undefined`.

---

## :icon[cloud-download] fetch na prática

**Caso 1: uma tarefa só, no REPL.**

```bash
> const r = await fetch('https://dummyjson.com/todos/4')
undefined
> await r.json()
{ id: 4, todo: 'Watch a documentary', completed: false, userId: 84 }
```

**Caso 2: num arquivo `.js`.** Fora do REPL, o `await` mora dentro de uma função `async`, como no E21:

```javascript
async function mostrarPrimeira() {
  const resposta = await fetch('https://dummyjson.com/todos/1');
  const tarefa = await resposta.json();
  console.log(tarefa.todo, '|', tarefa.completed);
}

mostrarPrimeira();
```

```plaintext
Do something nice for someone you care about | false
```

---

## Status e ok

O garçom voltou e disse: "esse prato não existe". Isso é uma resposta?

---

## :icon[badge-check] status e ok: deu certo?

Toda resposta traz um número, o **status**: o aviso do garçom quando volta da cozinha.

| `status` | O garçom diz | `resposta.ok` |
|---|---|---|
| `200` | "aqui está o prato" | `true` |
| `404` | "esse prato não existe" | `false` |
| `429` | "calma: muitos pedidos seguidos" | `false` |
| `500` | "a cozinha teve um problema" | `false` |

O **`resposta.ok`** (*ok*: tudo certo) é `true` quando o status vai de 200 a 299, e `false` nos outros.

:::warning
Com 404 ou 500, o `fetch` **não** lança erro: chegou uma resposta, e ela diz que não deu. Quem confere é você, pelo `ok`, antes de ler o corpo.
:::

---

## :icon[badge-check] status e ok na prática

**Caso 1: a tarefa 9999 não existe.** A resposta chega, com o motivo no corpo:

```bash
> const nada = await fetch('https://dummyjson.com/todos/9999')
undefined
> nada.ok
false
> nada.status
404
> await nada.json()
{ message: "Todo with id '9999' not found" }
```

**Caso 2: a cozinha falhou.** A DummyJSON tem um endereço que sempre responde 500, para treinar:

```bash
> const falha = await fetch('https://dummyjson.com/http/500')
undefined
> falha.ok
false
> falha.status
500
```

---

## :icon[split] O ok, resposta por resposta

O `if` do E10 confere o `ok`. Se a resposta não deu certo, o `throw` do E20 lança um `ErroDeTarefa`, com o status dentro da template string do E06:

```javascript
if (!resposta.ok) {
  throw new ErroDeTarefa(
    `O servidor de exemplos respondeu ${resposta.status}. Tente mais tarde.`,
  );
}
```

O `!` troca o sim pelo não: `!resposta.ok` pergunta "não deu certo?".

| `status` | `resposta.ok` | `!resposta.ok` | O que acontece |
|---|---|---|---|
| 200 | `true` | `false` | pula o `if` e lê o corpo |
| 404 | `false` | `true` | lança "...respondeu 404. Tente mais tarde." |
| 500 | `false` | `true` | lança "...respondeu 500. Tente mais tarde." |

---

## Busca de mentira

Como testar um pedido com a cozinha fechada e o Wi-Fi desligado?

---

## :icon[plug] A busca entra por parâmetro

Um teste que vai à internet falha sem Wi-Fi. Por isso o `buscarExemplos` **recebe** a função que busca, no parâmetro `buscar`, como o `salvarTarefas` do E21 recebe o armazenamento. A tela pronta chama assim:

```javascript
const exemplos = await buscarExemplos(fetch);
```

| Quem chama | Passa em `buscar` | A busca |
|---|---|---|
| a tela | `fetch` | vai à DummyJSON pela internet |
| um teste | `buscarQueDaCerto` | responde na hora, com status 200 |
| outro teste | `buscarComErro` | responde na hora, com status 500 |

A busca de mentira é um **garçom de treino**: tem o jeito do de verdade, mas nem sai da sala. A função vai **sem parênteses**: você entrega a receita, e o `buscarExemplos` cozinha quando precisa.

---

## :icon[plug] A resposta de mentira

O garçom de treino traz uma **resposta de mentira**, como o armazenamento de mentira do E21: um objeto feito com a classe `RespostaFalsa`, a forma de bolo do E18. Ela tem as três coisas que o `buscarExemplos` usa de uma resposta do `fetch`: o `status`, o `ok` e o `json()`.

```javascript
// Uma resposta de mentira: tem o ok, o status e o json() de uma resposta do fetch.
class RespostaFalsa {
  constructor(status, dados) {
    this.status = status;
    this.ok = status === 200;
    this.dados = dados;
  }

  async json() {
    return this.dados;
  }
}
```

- `this.ok = status === 200` guarda a resposta da comparação: `true` com 200, `false` com 500
- `async json()` é um método `async`: devolve uma Promise, como o `json()` de verdade. O `await resposta.json()` funciona com os dois
- `new RespostaFalsa(500, null)` é a resposta 500, com o corpo vazio (`null`, "não tem")

---

## Esperar um erro

O `toThrow` do E20 confere um erro que sai na hora. E o erro que chega depois?

---

## :icon[test-tube] await expect(...).rejects.toThrow

No E20, o erro saía na hora, e o `expect` recebia uma função, com a seta. O `buscarExemplos` é `async`: devolve uma senha, e o erro chega depois, quando a senha é **cancelada**. No Jest:

```javascript
await expect(buscarExemplos(buscarComErro)).rejects.toThrow('respondeu 500');
```

| Parte | O que quer dizer |
|---|---|
| `buscarExemplos(buscarComErro)` | a senha, a Promise: sem a seta |
| `.rejects` | (rejeita) "essa senha tem de ser cancelada" |
| `.toThrow('respondeu 500')` | "com este pedaço de texto no erro"; aceita a classe: `toThrow(ErroDeTarefa)` |
| `await`, no começo | "espere a conferência"; por isso o teste é `async` |

:::warning
Sem o `await`, o teste acaba antes da conferência: com o código certo, passa sem conferir; com algo errado, o Jest para no meio.
:::

---

## :icon[milestone] Projeto 3 · Passo 2: buscarExemplos

Em `src/servicos/exemplos.js`, o import no topo e a função no fim:

```javascript
import ErroDeTarefa from '../modelos/ErroDeTarefa.js';

// ... o comentário e o URL_DOS_EXEMPLOS continuam iguais

export async function buscarExemplos(buscar) {
  const resposta = await buscar(URL_DOS_EXEMPLOS);
  if (!resposta.ok) {
    throw new ErroDeTarefa(
      `O servidor de exemplos respondeu ${resposta.status}. Tente mais tarde.`,
    );
  }
  const dados = await resposta.json();
  return dados.todos;
}
```

- `buscar(URL_DOS_EXEMPLOS)`: o garçom que veio no parâmetro leva o pedido
- O `ErroDeTarefa` vai sem `campo`: a tela mostra a mensagem embaixo do botão
- `return dados.todos`: só a lista, sem o `total`, o `skip` e o `limit`

Na tela, recarregue: o botão Importar exemplos liga.

---

## :icon[milestone] Projeto 3 · Passo 2: a resposta de mentira e os dados

Crie `src/servicos/exemplos.test.js`. No topo, o import e a resposta de mentira:

```javascript
import { buscarExemplos } from './exemplos.js';

// Uma resposta de mentira: tem o ok, o status e o json() de uma resposta do fetch.
class RespostaFalsa {
  constructor(status, dados) {
    this.status = status;
    this.ok = status === 200;
    this.dados = dados;
  }

  async json() {
    return this.dados;
  }
}
```

Logo abaixo, os dados de mentira, no formato que a DummyJSON devolve:

```javascript
// O mesmo formato que a DummyJSON devolve, com 2 tarefas.
const DA_API = {
  todos: [
    {
      id: 1,
      todo: 'Do something nice for someone you care about',
      completed: false,
      userId: 152,
    },
    { id: 4, todo: 'Watch a documentary', completed: false, userId: 84 },
  ],
  total: 254,
  skip: 0,
  limit: 2,
};
```

`DA_API` vai em maiúsculas, como o `HOJE` dos testes: um valor fixo, que nenhum teste muda.

---

## :icon[milestone] Projeto 3 · Passo 2: os testes da busca

No fim de `exemplos.test.js`, dois testes, cada um com o seu garçom de treino:

```javascript
test('buscarExemplos devolve as tarefas que vieram da API', async () => {
  async function buscarQueDaCerto(url) {
    return new RespostaFalsa(200, DA_API);
  }
  const exemplos = await buscarExemplos(buscarQueDaCerto);
  expect(exemplos.length).toBe(2);
});

test('buscarExemplos avisa quando o servidor responde com erro', async () => {
  async function buscarComErro(url) {
    return new RespostaFalsa(500, null);
  }
  await expect(buscarExemplos(buscarComErro)).rejects.toThrow('respondeu 500');
});
```

- A busca de mentira recebe o `url`, como o `fetch`, mas nem olha: responde sempre igual, na hora
- No segundo teste, a senha tem de ser cancelada, com "respondeu 500" no erro

**Pronto quando:** `npm test` mostra `Tests: 77 passed` e `Test Suites: 8 passed`. Na tela, "O que a página usa" mostra a Etapa 6 em 2 de 5. Desligue o Wi-Fi e rode `npm test` de novo: continua verde.

---

## Sem internet

O Wi-Fi caiu no meio do pedido. Quem segura a queda?

---

## :icon[shield-check] try e catch com await

Sem internet, o pedido nem chega à cozinha: a senha do `fetch` é **cancelada**. A Promise fica rejeitada, com um erro `TypeError` (no navegador, `Failed to fetch`; no Node, `fetch failed`). O `await` que espera uma senha cancelada **lança** esse erro ali, na linha dele, como um `throw`. E o erro lançado cai na rede de proteção do trapezista, o `try`/`catch` do E20.

Um endereço que não existe faz o mesmo que a falta de internet:

```javascript
async function testarConexao() {
  try {
    await fetch('https://nao-existe.invalid');
    console.log('Chegou uma resposta');
  } catch (erro) {
    console.log('Caiu na rede:', erro.message);
  }
  console.log('O programa continua');
}

testarConexao();
```

```plaintext
Caiu na rede: fetch failed
O programa continua
```

Sem o `try`, o erro sobe sem rede, e o Node para com `TypeError: fetch failed`.

---

## :icon[wifi] O erro esperado: o pedido que não chegou

No E20, a rede pegava só o **erro esperado** e relançava o resto. Aqui, o erro esperado é o pedido que não chegou: culpa da internet, não do código, mesmo sendo um `TypeError`. Por isso a rede é **pequena**: só a linha do `await buscar(...)` fica no `try`.

| Situação | Quem cuida | A tela mostra |
|---|---|---|
| sem internet | o `catch` | "Sem conexão com a internet..." |
| a resposta 500 | o `if` do `ok`, fora do `try` | "...respondeu 500. Tente mais tarde." |
| um bug depois do `try` | ninguém | "Erro inesperado" e o bug |

Um bug **dentro** daquela linha cai na rede: `buscarQueDaCerto()`, com parênteses, vira "Sem conexão".

---

## :icon[milestone] Projeto 3 · Passo 3: sem internet

No `buscarExemplos`, o `let resposta;` e o `try`/`catch`; o resto continua igual:

```javascript
export async function buscarExemplos(buscar) {
  let resposta;
  try {
    resposta = await buscar(URL_DOS_EXEMPLOS);
  } catch (erro) {
    throw new ErroDeTarefa('Sem conexão com a internet. Confira e tente de novo.');
  }
  if (!resposta.ok) {
    throw new ErroDeTarefa(
      `O servidor de exemplos respondeu ${resposta.status}. Tente mais tarde.`,
    );
  }
  const dados = await resposta.json();
  return dados.todos;
}
```

- `let resposta;` nasce **antes** do `try`, como o `dados` do E21: assim a caixa existe depois dele
- No `catch`, o erro em inglês vira um `ErroDeTarefa`, que a tela mostra

No teste, a linha `import ErroDeTarefa from '../modelos/ErroDeTarefa.js';` no topo e, no fim:

```javascript
test('buscarExemplos avisa quando falta internet', async () => {
  async function buscarSemInternet(url) {
    throw new TypeError('Failed to fetch');
  }
  await expect(buscarExemplos(buscarSemInternet)).rejects.toThrow(ErroDeTarefa);
  await expect(buscarExemplos(buscarSemInternet)).rejects.toThrow('Sem conexão');
});
```

A busca de mentira imita o `fetch` sem internet: a senha dela é cancelada, com um `TypeError`.

**Pronto quando:** `Tests: 78 passed`. Na aba **Network**, troque **Sem limitação** por **Offline** e clique em Importar exemplos: "Sem conexão com a internet. Confira e tente de novo.", e o botão volta (o `finally` da tela). Volte para **Sem limitação**.

---

## :icon[milestone] Projeto 3 · Sua vez: converter e filtrar as pendentes

Importar ainda diz "Chegaram 10 exemplos, mas nenhum entrou": a API fala inglês; a lista, português. Sozinho, em `exemplos.js`:

1. `converterTodo(todo)`, com `export`, devolve `{ titulo, prioridade: 'media', prazo: null }`, com o `todo` da API no `titulo`
2. O `buscarExemplos` devolve só as **pendentes** (`completed` falso), já convertidas

Testes primeiro: o `converterTodo` com a tarefa 4; o `buscarExemplos` com uma resposta de mentira de uma concluída e uma pendente.

:::tip Dicas
- A peneira do `filter` (aula 3), depois a linha de produção do `map` (E14)
- O `converterTodo` fica acima do `buscarExemplos`; compare com `toEqual`
:::

**Pronto quando:** `npm test` verde; Importar exemplos traz "5 tarefas novas na lista."; Etapa 6 em 5 de 5.

---

## :icon[milestone] Projeto 3 · Sua vez: o README

O README do kit dá lugar ao seu, como no E12:

:::steps
1. Dois prints em `docs/`: `computador.png` e `celular.png`. Para o do celular, <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>M</kbd> no DevTools
2. No `README.md`, no lugar do texto do kit: o que o app faz e os prints, com `![a lista no computador](docs/computador.png)`
3. Como rodar (`npm install` e `npx serve .`) e como testar (`npm test`)
4. Uma tabela com o que faz cada arquivo de `src/`
:::

:::tip Dicas
- Print: <kbd>Win</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd>, a área, o aviso e <kbd>Ctrl</kbd> + <kbd>S</kbd>
- <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>V</kbd> mostra o README como no GitHub
:::

**Pronto quando:** a pré-visualização mostra o texto, os prints e a tabela.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Received promise resolved instead of rejected` | o código não lançou | confira o `if` e a resposta de mentira |
| `resposta is not defined` | o `let resposta` nasceu dentro do `try` | antes do `try` |
| `reading 'todos'` | leu o corpo sem conferir o `ok` | o `if (!resposta.ok)` antes do `json()` |
| `"Sem conexão..."` no teste da 500 | o `if` do `ok` ficou dentro do `try` | só o `await buscar(...)` no `try` |
| `reading 'length'` | faltou o `await` do `resposta.json()` | `await resposta.json()` |
| "respondeu 429", na tela | pedidos demais da sala | espere um pouco |

---

## :icon[milestone] Projeto 3 · Etapa 6 pronta

É a última etapa. Antes de entregar, confira:

- :icon[wifi] `npm test` verde **com o Wi-Fi desligado**
- :icon[monitor] numa janela anônima (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>N</kbd>), a lista começa vazia: adicione, conclua uma semanal, remova, recarregue, importe duas vezes e envie o título vazio
- :icon[list-checks] "O que a página usa" com as 6 etapas completas e nenhum aviso no topo
- :icon[file-text] o README com os dois prints

```bash
git add .
git commit -m "Projeto 3: etapa 6, exemplos da API e entrega"
git push
```

No GitHub, confira os 7 commits e os prints. **Entrega:** na página do curso, em **Projetos**, abra o Projeto 3, cole o link (`https://github.com/seu-usuario/lista-de-tarefas`) e clique em **Enviar entrega**. **Prazo: início do E24.** O E23 tem a revisão, tempo para terminar e a Prova 1.

---

## Resumo

:::summary
- Uma API é o cardápio de um servidor: cada endereço é um pedido, e a resposta vem em JSON
- `await fetch(endereço)` traz a resposta; `await resposta.json()` transforma o corpo em objeto: são dois `await`
- Com 404 ou 500, o `fetch` responde, com `ok` falso: confira o `ok` antes de ler o corpo
- Sem internet, o `fetch` lança um erro; o `try`/`catch` em volta do `await` troca por uma mensagem em português
- A função que busca entra por parâmetro: a tela passa o `fetch`; o teste, uma busca de mentira, que devolve uma `RespostaFalsa`
- `await expect(promessa).rejects.toThrow(...)` confere uma Promise que tem de falhar; sem o `await`, não confere nada
:::

---

## :icon[arrow-right] Próximos passos

O E23 fecha o JavaScript:

- :icon[history] a revisão do E04 ao E22, com as dúvidas da turma
- :icon[clock] tempo para terminar o Projeto 3, com o instrutor por perto
- :icon[graduation-cap] a Prova 1, na última hora: 20 questões, 60 minutos, 1 tentativa
- :icon[send] o Projeto 3 entregue até o início do E24, quando começa o React
