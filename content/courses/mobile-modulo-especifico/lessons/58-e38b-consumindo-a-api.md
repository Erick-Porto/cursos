---
title: Consumindo a API de produtos
summary: Busque o catálogo na DummyJSON com fetch, trate erros de rede e de resposta e cancele buscas antigas.
module: linguagem-js
duration_minutes: 40
objectives:
  - Ler pedidos e respostas HTTP pelo método, status, cabeçalhos e corpo
  - Fazer GET e POST com fetch, separando erro de rede de erro de resposta
  - Organizar o acesso à API em src/api, com o endereço no .env
  - Cancelar buscas antigas com AbortController
---

# Consumindo a API de produtos

Programador Mobile: Módulo Específico · Encontro E38 · Aula 58 de 71

---

## O que você vai aprender

:::goal
- Ler um pedido e uma resposta HTTP: método, status, cabeçalhos e corpo em JSON
- Buscar e enviar dados com `fetch`, conferindo `resposta.ok`
- Separar erro de rede de erro de resposta e mostrar cada um na tela
- Concentrar a API em `src/api/`, com o endereço no `.env` e os campos traduzidos
- Cancelar a busca anterior com `AbortController`
:::

---

## Uma vitrine que muda sem atualizar o app

Hoje, os 12 produtos da Lojinha moram no `catalogo.json`, dentro do app. Para mudar um preço, só publicando uma versão nova. Lojas de verdade buscam o catálogo num **servidor** quando a tela abre: preço, estoque e novidades chegam sem atualizar o app.

A Lojinha passa a buscar os produtos na **DummyJSON** (`https://dummyjson.com`), uma API pública de testes com quase 200 produtos. Por ser de testes, os nomes vêm **em inglês** e os preços **em dólar**.

:::question
O que o app deve fazer quando a internet cai no meio da busca? E quando a pessoa digita mais rápido do que o servidor responde?
:::

---

## :icon[globe] HTTP: pedido e resposta

O app e o servidor conversam por **HTTP**: o app manda um **pedido** e recebe uma **resposta**.

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

Os **cabeçalhos** dizem como ler o corpo; o **corpo** vem em JSON, o formato do `catalogo.json`.

---

## :icon[hash] Status: a resposta num número

| Status | Significa | Na DummyJSON |
|---|---|---|
| 200 OK | deu certo | `GET /products/1` |
| 201 Created | criou | `POST /carts/add` |
| 400 Bad Request | pedido mal feito | POST sem o corpo esperado |
| 401 Unauthorized | falta login | rota que pede token |
| 404 Not Found | não existe | `GET /products/9999` |
| 500 Internal Server Error | o servidor falhou | o problema não é do app |

Leia pela família: **2xx** deu certo, **4xx** o pedido tem problema, **5xx** o servidor tem problema. A DummyJSON explica o erro no corpo: `{ "message": "Product with id '9999' not found" }`.

---

## :icon[cloud-download] GET com fetch

```javascript
async function carregarVitrine() {
  const resposta = await fetch('https://dummyjson.com/products?limit=10&skip=0');
  const dados = await resposta.json();
  console.log(resposta.status);         // 200
  console.log(dados.total);             // quantos produtos o servidor tem
  console.log(dados.products[0].title); // 'Essence Mascara Lash Princess'
}
```

- **`fetch`** devolve uma Promise da **resposta**, que chega antes do corpo inteiro
- **`resposta.json()`** devolve outra Promise, com o corpo já convertido em objeto: por isso são dois `await`
- A lista vem **embrulhada**: `{ products, total, skip, limit }`. O `limit` é quantos vieram e o `skip`, quantos foram pulados; com eles, o E40 faz a paginação

---

## :icon[cloud-download] A resposta chega em duas partes

:::center
![Animação: a Lojinha envia GET /products?limit=10&skip=0 à DummyJSON; volta primeiro o 200 OK com os cabeçalhos, que cumpre o await do fetch, e depois o corpo em JSON, que cumpre o await de resposta.json()](images/e38-pedido-em-dois-tempos.svg)
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

- `body` só aceita **texto**: `JSON.stringify` converte o objeto
- Sem o `Content-Type`, a DummyJSON não entende o corpo e responde **400**: `"User id is required"`
- A DummyJSON finge que salvou: devolve o carrinho calculado, mas não guarda nada

---

## :icon[wifi] Erro de rede ou erro de resposta

O `fetch` só **rejeita** quando o pedido nem chega ao servidor. Um 404 ou um 500 é uma resposta como outra qualquer: a Promise é **cumprida**.

| Situação | O que o `fetch` faz | Como perceber |
|---|---|---|
| Modo avião | rejeita: `Network request failed` | `catch` |
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
O Detalhe abre o produto 9999, que não existe. O que aparece na tela com o código abaixo? E em modo avião?

```javascript
async function carregar() {
  try {
    const resposta = await fetch('https://dummyjson.com/products/' + id);
    setProduto(await resposta.json());
  } catch (erro) {
    setErro('Sem conexão');
  }
}
```
:::

:::tip Resposta
Com o 9999, nenhum erro: o `fetch` cumpre com status 404 e o corpo é `{ message: "Product with id '9999' not found" }`. Esse objeto vira o `produto`, e a tela mostra um produto em branco. Em modo avião, o `fetch` rejeita e aparece "Sem conexão", certo por acaso. Falta conferir `resposta.ok` e lançar um erro para o 404.
:::

---

## :icon[settings] O endereço da API no .env

Endereço repetido em cada tela é retrabalho certo: na troca do servidor de testes pelo de produção, você caçaria cada `fetch`. Guarde-o no `.env` da raiz, como no E24:

```bash
# .env (fora do Git) e .env.example (no Git, como modelo)
EXPO_PUBLIC_API_URL=https://dummyjson.com
```

```javascript
const URL_BASE = process.env.EXPO_PUBLIC_API_URL;
```

- Só variáveis com o prefixo **`EXPO_PUBLIC_`** chegam ao app, copiadas para dentro dele
- Por isso, **nunca** guarde senha ou chave secreta nelas: qualquer pessoa extrai do app instalado
- Leia com o ponto, como acima; desestruturar `process.env` não funciona
- Mudou o `.env`? Reinicie com `npx expo start -c`

---

## :icon[plug] src/api/cliente.js: um lugar só para o fetch

Toda chamada à API passa por **`pedir`**. Endereço, cabeçalho e os dois tipos de erro são tratados uma vez só:

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

```javascript
// src/modelos/erros.js, junto dos erros do E32
export class ApiError extends ErroDeNegocio {
  constructor(status) {
    super(status === 404 ? 'Não encontramos esse produto.' : 'A loja não respondeu. Tente de novo.', 'API_' + status);
    this.name = 'ApiError';
    this.status = status;
  }
}
```

A tela recebe sempre um erro com mensagem em português; o `status` fica guardado para quem precisar decidir.

---

## :icon[arrow-left-right] src/api/produtos.js: traduzir os campos

A DummyJSON fala inglês (`title`, `price`); o app fala a língua da Lojinha (`nome`, `preco`). Traduza **na entrada**, num lugar só, e `CartaoProduto`, `CarrinhoContext`, `aplicarFiltros` e `Produto.deJSON` continuam iguais:

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

`/products/categories` devolve `[{ slug, name, url }]`; a `listarCategorias` traduz para `{ slug, nome }`, o formato das categorias da Lojinha.

---

## :icon[smartphone] O Detalhe carregando da API

O `id` continua vindo de `useLocalSearchParams`. O que muda é de onde o produto vem:

```jsx
const [produto, setProduto] = useState(null);
const [erro, setErro] = useState(null);
const [tentativa, setTentativa] = useState(0);

useEffect(() => {
  async function carregar() {
    setErro(null);
    try {
      setProduto(await buscarProduto(id));
    } catch (e) {
      setErro(e.message);
    }
  }
  carregar();
}, [id, tentativa]);
```

```jsx
if (erro) return <EstadoErro mensagem={erro} onTentarNovamente={() => setTentativa(tentativa + 1)} />;
if (!produto) return <EstadoCarregando mensagem="Abrindo o produto..." />;
```

- O `useEffect` não aceita função `async` direto: ela devolveria uma Promise no lugar da limpeza. Crie a função dentro e chame
- `produto` nulo é o carregando; mudar `tentativa` roda o efeito de novo
- Os `if` vêm depois de todos os hooks, como no E19

---

## :icon[ban] AbortController: cancelar o pedido velho

A pessoa digita "s" e, um instante depois, "shoes". Os dois pedidos saem e nada garante a ordem de chegada: se "s" responder por último, a vitrine mostra o resultado errado. No E37, o `Promise.race` não cancelava a perdedora; o **`AbortController`** cancela de verdade:

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
- Cancelar não é falha: ignore o `AbortError` em vez de mostrar `EstadoErro`

---

## :icon[ban] A corrida entre "s" e "shoes"

:::center
![Animação: o pedido de s ainda está em andamento quando sai o de shoes; abort() corta o pedido velho, o AbortError é ignorado e a vitrine mostra os resultados de shoes](images/e38-busca-cancelada.svg)
:::

Sem cancelar, a resposta lenta de "s" chegaria depois e trocaria a vitrine. Com `abort()`, o pedido velho é cortado assim que o termo muda; o `AbortError` é ignorado e só a resposta de "shoes" chega à tela.

---

## :icon[search] Busca com debounce e cancelamento

No Início, o `termoAtrasado` do E35 decide o pedido, e cada pedido novo cancela o anterior:

```jsx
// fora do componente: sem termo, a vitrine; com termo, a busca
function buscarVitrine(termo, sinal) {
  return termo.trim() ? pesquisar(termo, sinal) : listarProdutos({ sinal });
}
```

```jsx
useEffect(() => {
  const controle = new AbortController();
  async function carregar() {
    setCarregando(true); setErro(null);
    try {
      setProdutos(await buscarVitrine(termoAtrasado, controle.signal));
    } catch (e) {
      if (e.name !== 'AbortError') setErro(e.message);
    } finally {
      if (!controle.signal.aborted) setCarregando(false);
    }
  }
  carregar();
  return () => controle.abort(); // termo novo: cancela o pedido velho
}, [termoAtrasado, tentativa]);
```

O campo de busca fica **fora** da troca de estados: se o `EstadoCarregando` ocupar a tela inteira, o campo some e o teclado fecha a cada busca.

---

## :icon[triangle-alert] Erros comuns

:::warning
- `resposta.json()` sem `await`: `dados` é uma Promise e `dados.products` é `undefined`
- Confiar no `catch` para o 404: o `fetch` só rejeita sem rede; confira `resposta.ok`
- POST com `body: objeto` ou sem `Content-Type`: o servidor não entende e responde 400
- `useEffect(async () => ...)`: crie a função `async` dentro do efeito e chame
- Mostrar o `AbortError` como falha: cancelar é normal, ignore esse erro
- Buscar "fone" e achar nada: a API de testes é em inglês; tente "phone"
- Segredo numa variável `EXPO_PUBLIC_`: ela vai para dentro do app instalado
:::

---

## Resumo

:::summary
- HTTP é pedido e resposta: método, status, cabeçalhos e corpo em JSON
- `fetch` rejeita só sem rede; 404 e 500 chegam como resposta, e `resposta.ok` separa os casos
- POST leva `method`, `Content-Type` e `body` com `JSON.stringify`
- `pedir` concentra endereço do `.env`, cabeçalho e erros; `produtos.js` traduz a DummyJSON para a Lojinha
- `AbortController` cancela o pedido velho, e o debounce do E35 evita um pedido por letra
:::

---

## :icon[flask-conical] No laboratório

A Lojinha deixa o `catalogo.json` e passa a buscar o catálogo na DummyJSON.

:::steps
1. `finalizarCompra` com `await`; testes do E37 verdes
2. `.env` e `.env.example` com `EXPO_PUBLIC_API_URL`; `npx expo start -c`
3. `ApiError` em `src/modelos/erros.js` e `pedir` em `src/api/cliente.js`
4. `src/api/produtos.js` com as cinco funções e um teste de `traduzirProduto`
5. Início com `buscarVitrine`, os estados e a busca com `AbortController`
6. Detalhe com `buscarProduto(id)` e "Tentar novamente"
7. Modo avião, `/produto/9999` e digitação rápida testados; commit "E38: async/await e catálogo da API" e `git push`
:::

**Critérios de entrega**: nenhum `fetch` fora de `src/api/`; modo avião mostra `EstadoErro` e "Tentar novamente" recupera; a busca nunca mostra um termo antigo nem fecha o teclado. Entregue o link do repositório no sistema.
