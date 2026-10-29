---
title: Consumindo a API de produtos
summary: Busque o catálogo na DummyJSON com fetch no Node, trate erros de rede e de resposta e cancele buscas antigas.
module: classes-e-controle
duration_minutes: 40
objectives:
  - Ler pedidos e respostas HTTP pelo método, status, cabeçalhos e corpo
  - Fazer GET e POST com fetch, separando erro de rede de erro de resposta
  - Organizar o acesso à API em src/api e testá-lo com um fetch simulado
  - Cancelar buscas antigas com AbortController
---

# Consumindo a API de produtos

Programador Mobile · Encontro E19 · Aula 38 de 89

---

## O que você vai aprender

:::goal
- Ler um pedido e uma resposta HTTP: método, status, cabeçalhos e corpo em JSON
- Buscar e enviar dados com `fetch`, conferindo `resposta.ok`
- Separar erro de rede de erro de resposta e mostrar cada um no terminal
- Concentrar a API em `src/api/`, com os campos traduzidos e testes que não usam a rede
- Cancelar a busca anterior com `AbortController`
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **servidor** | um computador sempre ligado, que guarda dados e responde pedidos |
| **API** | o cardápio de pedidos que um servidor aceita |
| **HTTP** | a língua dos pedidos e das respostas na internet |
| **status** | o número da resposta: 200 deu certo, 404 não existe |
| **cancelar** (*abort*) | desistir de um pedido que ainda está no caminho |
| **`fetch` simulado** | um dublê do `fetch` nos testes: responde na hora, sem internet |

---

## Um catálogo que muda sem publicar de novo

Hoje, os 12 produtos da Lojinha moram em `src/data/produtos.js`. Para mudar um preço, só mudando o código. Lojas de verdade buscam o catálogo num **servidor**: preço, estoque e novidades chegam sem publicar uma versão nova.

A Lojinha passa a buscar os produtos na **DummyJSON** (`https://dummyjson.com`), uma API pública de testes com quase 200 produtos. Por ser de testes, os nomes vêm **em inglês** e os preços **em dólar**.

:::question
O que o script deve fazer quando a internet cai no meio da busca? E quando duas buscas voltam fora de ordem?
:::

---

## HTTP

No restaurante, como o seu pedido chega à cozinha e o prato volta para a mesa?

---

## :icon[globe] HTTP: pedido e resposta

Pense no garçom: você pede pelo cardápio, a cozinha prepara e ele traz o prato. Na internet, o programa é a mesa, o **servidor** é a cozinha e a **API** (*interface de programação*) é o cardápio: a lista de pedidos que o servidor aceita.

A conversa segue o **HTTP**: o programa manda um **pedido** e recebe uma **resposta**.

```plaintext
GET /products/1                         pedido: método e caminho
Accept: application/json                cabeçalho

200 OK                                  resposta: status
Content-Type: application/json          cabeçalho
{ "id": 1, "title": "Essence Mascara Lash Princess", "price": 9.99 }
```

Os **cabeçalhos** (*headers*) dizem como ler o corpo; o **corpo** (*body*) vem em JSON, o formato do `catalogo.json` do E02.

---

## :icon[list] Os métodos: o que você quer fazer

O **método** é o tipo do pedido: olhar o cardápio não é o mesmo que fazer um pedido novo.

| Método | Para quê | Na Lojinha |
|---|---|---|
| GET | ler | listar produtos, abrir o detalhe |
| POST | criar | enviar o carrinho, fazer login |
| PUT ou PATCH | alterar | mudar um item já salvo |
| DELETE | apagar | tirar um favorito do servidor |

Hoje você usa os dois primeiros: GET para o catálogo e POST para o carrinho.

---

## :icon[hash] Status: a resposta num número

| Status | Significa | Na DummyJSON |
|---|---|---|
| 200 OK | deu certo | `GET /products/1` |
| 201 Created | criou | `POST /carts/add` |
| 400 Bad Request | pedido mal feito | POST sem o corpo esperado |
| 401 Unauthorized | falta login | rota que pede token |
| 404 Not Found | não existe | `GET /products/9999` |
| 500 Internal Server Error | o servidor falhou | o problema não é seu |

Leia pela família: **2xx** deu certo, **4xx** o pedido tem problema, **5xx** o servidor tem problema. A DummyJSON explica o erro no corpo: `{ "message": "Product with id '9999' not found" }`.

---

## :icon[globe] HTTP na prática

Três conversas de verdade com a DummyJSON:

```plaintext
GET /products/1                ->  200 OK
{ "id": 1, "title": "Essence Mascara Lash Princess", "price": 9.99, ... }

GET /products/9999             ->  404 Not Found
{ "message": "Product with id '9999' not found" }

POST /carts/add                ->  201 Created
{ "total": 19.98, "totalQuantity": 2, ... }
```

- Abrir o produto é **ler**: GET, e a resposta é 200
- Um produto que não existe também tem resposta: 404, com a explicação no corpo
- Enviar o carrinho é **criar**: POST, e a resposta é 201

---

## fetch

Quem leva o seu pedido até o servidor e traz a resposta de volta?

---

## :icon[cloud-download] GET com fetch

O **`fetch`** (buscar) é o garçom do JavaScript: leva o pedido ao servidor e traz a resposta. Ele já vem no Node (versão 18 em diante): nada para instalar.

```javascript
async function mostrarVitrine() {
  const resposta = await fetch('https://dummyjson.com/products?limit=10&skip=0');
  const dados = await resposta.json();
  console.log(resposta.status);         // 200
  console.log(dados.total);             // quantos produtos o servidor tem
  console.log(dados.products[0].title); // 'Essence Mascara Lash Princess'
}
```

- `fetch` devolve uma Promise da **resposta**, que chega antes do corpo inteiro
- **`resposta.json()`** devolve outra Promise, com o corpo já convertido em objeto: por isso são dois `await`
- A lista vem **embrulhada**: `{ products, total, skip, limit }`. O `limit` é quantos vieram e o `skip`, quantos foram pulados: a página do `paginar` do E14, feita pelo servidor

---

## :icon[cloud-download] A resposta chega em duas partes

:::center
![Animação: a Lojinha envia GET /products?limit=10&skip=0 à DummyJSON; volta primeiro o 200 OK com os cabeçalhos, que cumpre o await do fetch, e depois o corpo em JSON, que cumpre o await de resposta.json()](images/e19-pedido-em-dois-tempos.svg)
:::

Primeiro chegam o status e os cabeçalhos: o `await fetch(...)` já entrega a `resposta`. O corpo inteiro vem depois, e o `await resposta.json()` espera por ele e o converte em objeto.

---

## :icon[cloud-upload] POST com fetch

Para **enviar** dados, informe o método, o cabeçalho e o corpo. Exemplo: mandar o carrinho para o servidor calcular o total.

```javascript
const resposta = await fetch('https://dummyjson.com/carts/add', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 1,
    products: itens.map((item) => ({ id: item.id, quantity: item.qtd })),
  }),
});
const carrinho = await resposta.json(); // status 201
console.log(carrinho.total, carrinho.totalQuantity);
```

- `body` só aceita **texto**: o `JSON.stringify` do E06 converte o objeto
- O `map` troca cada item da Lojinha pelo formato da DummyJSON: `{ id, quantity }`
- Sem o `Content-Type` (*tipo do conteúdo*), a DummyJSON não entende o corpo e responde **400**: `"User id is required"`
- A DummyJSON finge que salvou: devolve o carrinho calculado, mas não guarda nada

---

## :icon[cloud-download] fetch na prática

**Caso 1: um produto.**

```javascript
const resposta = await fetch('https://dummyjson.com/products/1');
const produto = await resposta.json();
console.log(resposta.status, produto.title, produto.price);
// 200 Essence Mascara Lash Princess 9.99
```

**Caso 2: uma busca.** O termo vai no endereço, depois de `?q=`:

```javascript
const busca = await fetch('https://dummyjson.com/products/search?q=phone');
const achados = await busca.json();
console.log(achados.total, achados.products[0].title);
// 23 Apple AirPods Max Silver
```

**Caso 3: o carrinho.** Enviando `[{ id: 1, qtd: 2 }]` no POST para `/carts/add`, a resposta vem com status 201, `total` igual a `19.98` e `totalQuantity` igual a `2`: duas máscaras de 9,99.

---

## Rede ou resposta

O garçom nem chegou à cozinha, ou chegou e ouviu "acabou"? Faz diferença?

---

## :icon[wifi] Erro de rede ou erro de resposta

Se o garçom nem chega à cozinha, o pedido falhou: o `fetch` **rejeita**. Se ele chega e ouve "esse prato não existe", isso é uma resposta: a Promise é **cumprida**.

| Situação | O que o `fetch` faz | Como perceber |
|---|---|---|
| Sem internet | rejeita: `TypeError: fetch failed` | `catch` |
| Produto não existe | cumpre com status 404 | `resposta.ok` é `false` |
| Servidor fora do ar | cumpre com status 500 | `resposta.ok` é `false` |
| Tudo certo | cumpre com status 200 | `resposta.ok` é `true` |

**`resposta.ok`** é `true` para os status de 200 a 299. Confira antes de ler o corpo:

```javascript
if (!resposta.ok) throw new Error('A API respondeu ' + resposta.status);
```

---

## :icon[wifi] Rede ou resposta na prática

**Caso 1: o produto que não existe.** Chega uma resposta, e ela diz "não existe":

```javascript
const resposta = await fetch('https://dummyjson.com/products/9999');
console.log(resposta.ok, resposta.status); // false 404
console.log(await resposta.json());        // { message: "Product with id '9999' not found" }
```

**Caso 2: um endereço que não existe.** O pedido nem sai:

```javascript
await fetch('https://nao-existe.invalid'); // TypeError: fetch failed
```

**Caso 3: uma rota errada.** `/produtos` responde 404 com uma página HTML, não JSON. O `.json()` nela dá `SyntaxError: Unexpected token '<'`: o `<` é o começo do HTML. Por isso o `ok` é conferido antes do `.json()`.

---

## Pense

:::question
O script abaixo mostra o produto 9999, que não existe. O que aparece no terminal? E sem internet?

```javascript
async function mostrarProduto(id) {
  try {
    const resposta = await fetch('https://dummyjson.com/products/' + id);
    const produto = await resposta.json();
    console.log(produto.title + ': ' + produto.price);
  } catch (erro) {
    console.log('Sem conexão');
  }
}
```
:::

:::tip Resposta
Com o 9999, nenhum erro: o `fetch` cumpre com status 404 e o corpo é `{ message: "Product with id '9999' not found" }`. O terminal mostra `undefined: undefined`. Sem internet, o `fetch` rejeita e aparece "Sem conexão", certo por acaso. Falta conferir `resposta.ok` e lançar um erro para o 404.
:::

---

## A pasta src/api

Se a loja trocar de cozinha amanhã, quantos arquivos do código precisam mudar?

---

## :icon[plug] src/api/cliente.js: o endereço e o ApiError

Na Lojinha, um garçom só fala com a cozinha: todo pedido à API passa por um arquivo, o `src/api/cliente.js`. Ele guarda o endereço e o erro de resposta, com o `ErroDeNegocio` do E17 como base:

```javascript
import { ErroDeNegocio } from '../modelos/erros.js';

export const URL_BASE = 'https://dummyjson.com'; // trocar de servidor muda só esta linha

export class ApiError extends ErroDeNegocio {
  constructor(status) {
    super(status === 404 ? 'Não encontramos esse produto.' : 'A loja não respondeu. Tente de novo.', 'API_' + status);
    this.name = 'ApiError';
    this.status = status;
  }
}
```

- O `? :` do E07 escolhe a mensagem: 404 tem uma; qualquer outro status, outra
- O `codigo` vira `API_404`, `API_500`: o programa decide pelo código, a pessoa lê a mensagem

---

## :icon[plug] pedir: todo pedido passa por aqui

Toda chamada à API passa por **`pedir`**, que trata os dois tipos de erro uma vez só:

```javascript
export async function pedir(caminho, opcoes = {}) {
  let resposta;
  try {
    resposta = await fetch(URL_BASE + caminho, {
      ...opcoes,
      headers: { 'Content-Type': 'application/json', ...opcoes.headers },
    });
  } catch (erro) {
    if (erro.name === 'AbortError') throw erro; // cancelado de propósito
    throw new ErroDeNegocio('Sem conexão. Confira a internet e tente de novo.', 'SEM_CONEXAO');
  }
  if (!resposta.ok) throw new ApiError(resposta.status);
  return resposta.json();
}
```

Quem chama recebe sempre um erro com mensagem em português; o `status` fica guardado para quem precisar decidir.

---

## :icon[list-ordered] O pedir em português

| Linha | O que ela diz |
|---|---|
| `let resposta;` | a caixa nasce fora do `try`, para ser usada depois dele |
| `fetch(URL_BASE + caminho, ...)` | o endereço inteiro: a base mais o caminho, como `/products/1` |
| `...opcoes, headers: {...}` | repassa o que veio (o método, o corpo) e sempre põe o cabeçalho de JSON |
| `catch (erro) { ... }` | o pedido nem chegou: sem internet vira `SEM_CONEXAO` |
| `erro.name === 'AbortError'` | cancelado de propósito: passa adiante, sem virar "Sem conexão" |
| `if (!resposta.ok) throw ...` | chegou, mas com erro: vira `ApiError` |
| `return resposta.json()` | deu certo: devolve o corpo como objeto |

---

## :icon[arrow-left-right] src/api/produtos.js: traduzir os campos

A DummyJSON fala inglês (`title`, `price`); a Lojinha fala `nome` e `preco`. Traduza **na entrada**, como um tradutor na porta da loja: tudo o que entra já passa para o português. Assim `formatarPreco`, `aplicarFiltros` e `Produto.deJSON` continuam iguais:

```javascript
export function traduzirProduto(p) {
  return {
    id: p.id,
    nome: p.title,
    preco: p.price, // em dólar: a API é de testes
    categoria: p.category,
    imagem: p.thumbnail,
    avaliacao: p.rating,
    descricao: p.description,
    destaque: p.rating >= 4.5, // a DummyJSON não tem destaque: a regra é sua
  };
}
```

```javascript
export async function listarProdutos({ limite = 20, pular = 0, sinal } = {}) {
  const dados = await pedir(`/products?limit=${limite}&skip=${pular}`, { signal: sinal });
  return dados.products.map(traduzirProduto);
}

export async function buscarProduto(id) {
  return traduzirProduto(await pedir('/products/' + id));
}
```

---

## :icon[terminal] O catálogo no terminal

O `buscar.js` do E14 continua procurando nos 12 produtos locais. O novo `src/scripts/buscar-api.js` procura na DummyJSON, com o `await` no nível de cima, como no script do checkout:

```javascript
import { listarProdutos, pesquisar } from '../api/produtos.js';
import { ErroDeNegocio } from '../modelos/erros.js';
import { formatarPreco } from '../utils/formatar.js';

const termo = process.argv.slice(2).join(' ');
try {
  const lista = termo ? await pesquisar(termo) : await listarProdutos({ limite: 5 });
  if (lista.length === 0) console.log(`Nada para "${termo}". A API é em inglês: tente phone.`);
  for (const p of lista) console.log(`${p.id}. ${p.nome}: ${formatarPreco(p.preco)}`);
} catch (erro) {
  if (!(erro instanceof ErroDeNegocio)) throw erro; // bug: não esconda
  console.log(erro.message);
}
```

- `process.argv.slice(2).join(' ')` junta todas as palavras depois do nome do arquivo: `smart watch` vira um termo só
- Com termo, `pesquisar`; sem termo, a vitrine com 5 produtos

---

## :icon[terminal] src/api na prática

```plaintext
$ node src/scripts/buscar-api.js fone
Nada para "fone". A API é em inglês: tente phone.

$ node src/scripts/buscar-api.js phone
101. Apple AirPods Max Silver: R$ 549,99
104. Apple iPhone Charger: R$ 19,99
...

$ node src/scripts/produto-api.js 9999
Não encontramos esse produto.

$ node src/scripts/produto-api.js 1          # com o Wi-Fi desligado
Sem conexão. Confira a internet e tente de novo.
```

Compare com `node src/scripts/buscar.js fone`, do E14: o catálogo local é em português. O `formatarPreco` mostra "R$" num preço em dólar: aceite como treino, a API é de testes.

---

## Cancelar uma busca

Você pediu um lanche e mudou de ideia. Dá para cancelar o primeiro pedido?

---

## :icon[ban] AbortController: cancelar o pedido velho

A pessoa digita "s" e, um instante depois, "shoes". Os dois pedidos saem, e nada garante a ordem de chegada. É como dizer ao garçom: "esquece o primeiro pedido". No E18, o `Promise.race` não cancelava a perdedora; o **`AbortController`** (controle de cancelamento) cancela de verdade:

```javascript
export async function pesquisar(termo, sinal) {
  const caminho = '/products/search?q=' + encodeURIComponent(termo.trim());
  const dados = await pedir(caminho, { signal: sinal });
  return dados.products.map(traduzirProduto);
}
```

```javascript
const controle = new AbortController();
const promessa = pesquisar('shoes', controle.signal);
controle.abort(); // corta o pedido no meio do caminho
await promessa;   // rejeita com um erro de nome 'AbortError'
```

- O **`signal`** (sinal) viaja junto do pedido; o `pedir` o repassa ao `fetch` porque espalha `...opcoes`
- **`encodeURIComponent`** protege espaços e acentos no endereço
- Cancelar não é falha: ignore o `AbortError` em vez de mostrar uma mensagem de erro

---

## :icon[ban] A corrida entre "s" e "shoes"

:::center
![Animação: o pedido de s ainda está em andamento quando sai o de shoes; abort() corta o pedido velho, o AbortError é ignorado e só os resultados de shoes chegam ao terminal](images/e19-busca-cancelada.svg)
:::

Sem cancelar, a resposta lenta de "s" chegaria depois e seria impressa por último, como se fosse o resultado atual. Com `abort()`, o pedido velho é cortado assim que o termo muda; o `AbortError` é ignorado e só a resposta de "shoes" chega ao terminal.

---

## :icon[search] Busca cancelável no terminal

Em `src/scripts/digitar.js`, cada termo novo cancela a busca que ainda estava no caminho:

```javascript
let controleAtual = null; // o controle da busca em andamento

async function buscarAoDigitar(termo) {
  controleAtual?.abort(); // termo novo: cancela o pedido velho
  const controle = new AbortController();
  controleAtual = controle;
  try {
    const lista = await pesquisar(termo, controle.signal);
    console.log(`"${termo}": ${lista.length} produtos`);
  } catch (erro) {
    if (erro.name === 'AbortError') return console.log(`"${termo}": cancelada`);
    console.log(erro.message);
  }
}
```

```javascript
buscarAoDigitar('s');
setTimeout(() => buscarAoDigitar('shoes'), 100); // saída: "s": cancelada, depois "shoes": 4 produtos
```

- O `?.` do E13 só chama o `abort()` se já existir um controle: na primeira busca, ele é `null`
- O `debounce` do E10 completa a dupla: `debounce(buscarAoDigitar, 300)` manda um pedido por pausa, não por letra; o `abort` cuida dos que ainda se cruzam

---

## fetch simulado

No cinema, quem faz a cena perigosa no lugar do ator?

---

## :icon[test-tube] Testes com fetch simulado

Teste que depende da internet falha sem motivo e deixa a suíte lenta. No cinema, o dublê faz a cena perigosa no lugar do ator. No teste, um dublê do `fetch` responde na hora, sempre igual, sem rede:

```javascript
function responder(status, corpo) {
  globalThis.fetch = async () => ({ ok: status >= 200 && status < 300, status, json: async () => corpo });
}
```

| Parte | O que ela faz |
|---|---|
| `globalThis.fetch = ...` | troca o `fetch` de verdade pelo dublê |
| `async () => ({ ... })` | o dublê devolve uma Promise de uma resposta falsa |
| `ok: status >= 200 && status < 300` | o `ok` calculado como o de verdade |
| `json: async () => corpo` | o corpo que o teste escolheu |

**`globalThis`** guarda as variáveis globais: trocar `globalThis.fetch` troca o `fetch` que o `pedir` usa.

---

## :icon[test-tube] fetch simulado na prática

```javascript
test('404 vira ApiError com o status', async () => {
  responder(404, { message: "Product with id '9999' not found" });
  await expect(buscarProduto(9999)).rejects.toMatchObject({ name: 'ApiError', status: 404 });
});

test('sem rede, rejeita com SEM_CONEXAO', async () => {
  globalThis.fetch = async () => { throw new TypeError('fetch failed'); };
  await expect(buscarProduto(1)).rejects.toMatchObject({ codigo: 'SEM_CONEXAO' });
});
```

- O primeiro dublê responde 404: o `pedir` vê `ok` falso e lança `ApiError`
- O segundo lança `TypeError`, como a falta de internet: o `pedir` troca por `SEM_CONEXAO`
- Os dois ficam verdes com o Wi-Fi desligado. Cada arquivo de teste tem o próprio `globalThis`: a troca não vaza para os outros arquivos

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `TypeError: fetch failed` | o pedido não chegou ao servidor | conferir a rede e o `URL_BASE` |
| `Unexpected token '<'` | `.json()` numa página HTML de erro | conferir `resposta.ok` antes |
| `reading 'map'` | `dados.products` não existe: faltou `await` no `.json()`, ou a rota é de um produto só | conferir os dois `await` e abrir a URL |
| `User id is required`, status 400 | POST sem `Content-Type` ou sem `JSON.stringify` | os dois no `fetch` |
| status 429 | muitos pedidos seguidos | esperar e tentar de novo |
| `AbortError` | o pedido foi cancelado de propósito | ignorar |

---

## :icon[triangle-alert] Erros comuns

:::warning
- `resposta.json()` sem `await`: `dados` é uma Promise e `dados.products` é `undefined`
- Confiar no `catch` para o 404: o `fetch` só rejeita sem rede; confira `resposta.ok`
- POST com `body: objeto` ou sem `Content-Type`: o servidor não entende e responde 400
- Mostrar o `AbortError` como falha: cancelar é normal, ignore esse erro
- Buscar "fone" e achar nada: a API de testes é em inglês; tente "phone"
- Teste que chama a DummyJSON de verdade: sem internet, a suíte inteira fica vermelha
:::

---

## Resumo

:::summary
- HTTP é pedido e resposta: método, status, cabeçalhos e corpo em JSON
- `fetch` rejeita só sem rede; 404 e 500 chegam como resposta, e `resposta.ok` separa os casos
- POST leva `method`, `Content-Type` e `body` com `JSON.stringify`
- `pedir` concentra endereço, cabeçalho e erros; `produtos.js` traduz a DummyJSON para a Lojinha
- `AbortController` cancela o pedido velho; nos testes, um `fetch` simulado dispensa a rede
:::

---

## :icon[flask-conical] No laboratório

O `lojinha-regras` deixa de depender só do catálogo local e passa a buscar produtos na DummyJSON.

:::steps
1. `finalizarCompra` com `await` e `src/scripts/finalizar.js`; testes do E18 verdes antes e depois
2. `URL_BASE`, `ApiError` e `pedir` em `src/api/cliente.js`
3. `src/api/produtos.js` com `traduzirProduto`, `listarProdutos`, `buscarProduto` e `pesquisar`
4. `src/scripts/buscar-api.js` e `src/scripts/produto-api.js`, que mostra um produto pelo id
5. `src/scripts/digitar.js`: "s" cancelada, "shoes" impressa
6. `src/api/produtos.test.js` com `fetch` simulado: tradução, 404, sem rede e cancelamento
7. Produto 9999, "fone" e Wi-Fi desligado testados; `npm test` verde; commit "E19: async/await e catálogo da API" e `git push`
:::

**Critérios de entrega**: nenhum `fetch` fora de `src/api/cliente.js`; sem internet, os scripts mostram "Sem conexão..." em vez de cair; nenhum teste usa a rede. Entregue o link do repositório no sistema.

---

## :icon[milestone] Projeto 3 · Etapa 7: importar exemplos da API

No seu repositório `lista-de-tarefas`:

- `buscarExemplos()` com `async`, `await` e `fetch` em `https://dummyjson.com/todos?limit=10`: `todo` vira `titulo`, `completed` vira `concluida`
- sem rede, `ErroDeTarefa` com o código `SEM_CONEXAO`; resposta com erro, `API_` mais o status
- `lista.importar(dados)` sem duplicar títulos
- na tela, o botão desligado enquanto espera, "Carregando exemplos..." e a mensagem de erro
- testes com `fetch` simulado, verdes com o Wi-Fi desligado

Commit: `Projeto 3: etapa 7, importar exemplos da API`. Enunciado completo e entrega: página do curso, em **Projetos**.
