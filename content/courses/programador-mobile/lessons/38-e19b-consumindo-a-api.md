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

## Um catálogo que muda sem publicar de novo

Hoje, os 12 produtos da Lojinha moram em `src/data/produtos.js`. Para mudar um preço, só mudando o código. Lojas de verdade buscam o catálogo num **servidor**: preço, estoque e novidades chegam sem publicar uma versão nova.

A Lojinha passa a buscar os produtos na **DummyJSON** (`https://dummyjson.com`), uma API pública de testes com quase 200 produtos. Por ser de testes, os nomes vêm **em inglês** e os preços **em dólar**.

:::question
O que o script deve fazer quando a internet cai no meio da busca? E quando duas buscas voltam fora de ordem?
:::

---

## :icon[globe] HTTP: pedido e resposta

O programa e o servidor conversam por **HTTP**: o programa manda um **pedido** e recebe uma **resposta**.

```plaintext
GET /products/1                         pedido: método e caminho
Accept: application/json                cabeçalho

200 OK                                  resposta: status
Content-Type: application/json          cabeçalho
{ "id": 1, "title": "Essence Mascara Lash Princess", "price": 9.99 }
```

| Método | Para quê | Na Lojinha |
|---|---|---|
| GET | ler | listar produtos, abrir o detalhe |
| POST | criar | enviar o carrinho, fazer login |
| PUT ou PATCH | alterar | mudar um item já salvo |
| DELETE | apagar | tirar um favorito do servidor |

Os **cabeçalhos** dizem como ler o corpo; o **corpo** vem em JSON, o formato do `catalogo.json` do E02.

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

## :icon[cloud-download] GET com fetch

O **`fetch`** já vem no Node (versão 18 em diante): nada para instalar.

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
- Sem o `Content-Type`, a DummyJSON não entende o corpo e responde **400**: `"User id is required"`
- A DummyJSON finge que salvou: devolve o carrinho calculado, mas não guarda nada

---

## :icon[wifi] Erro de rede ou erro de resposta

O `fetch` só **rejeita** quando o pedido nem chega ao servidor. Um 404 ou um 500 é uma resposta como outra qualquer: a Promise é **cumprida**.

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

## :icon[plug] src/api/cliente.js: um lugar só para o fetch

O endereço e o erro de resposta, com o `ErroDeNegocio` do E17 como base:

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

## :icon[arrow-left-right] src/api/produtos.js: traduzir os campos

A DummyJSON fala inglês (`title`, `price`); a Lojinha fala `nome` e `preco`. Traduza **na entrada**, num lugar só, e `formatarPreco`, `aplicarFiltros` e `Produto.deJSON` continuam iguais:

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

```plaintext
$ node src/scripts/buscar-api.js fone
Nada para "fone". A API é em inglês: tente phone.
$ node src/scripts/buscar-api.js phone
101. Apple AirPods Max Silver: R$ 549,99
```

Compare com `node src/scripts/buscar.js fone`, do E14: o catálogo local é em português. O `formatarPreco` mostra "R$" num preço em dólar: aceite como treino, a API é de testes.

---

## :icon[ban] AbortController: cancelar o pedido velho

A pessoa digita "s" e, um instante depois, "shoes". Os dois pedidos saem e nada garante a ordem de chegada. No E18, o `Promise.race` não cancelava a perdedora; o **`AbortController`** cancela de verdade:

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

- O **`signal`** viaja junto do pedido; o `pedir` o repassa ao `fetch` porque espalha `...opcoes`
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

O `debounce` do E10 completa a dupla: `debounce(buscarAoDigitar, 300)` manda um pedido por pausa, não por letra; o `abort` cuida dos que ainda se cruzam.

---

## :icon[test-tube] Testes com fetch simulado

Teste que depende da internet falha sem motivo e deixa a suíte lenta. Troque o `fetch` por uma função que responde na hora:

```javascript
function responder(status, corpo) {
  globalThis.fetch = async () => ({ ok: status >= 200 && status < 300, status, json: async () => corpo });
}
```

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

- **`globalThis`** guarda as variáveis globais: trocar `globalThis.fetch` troca o `fetch` que o `pedir` usa
- Cada arquivo de teste tem o próprio `globalThis`: a troca não vaza para os outros arquivos

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
