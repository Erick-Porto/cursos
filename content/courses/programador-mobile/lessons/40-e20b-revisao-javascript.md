---
title: "Revisão: as três unidades de JavaScript"
summary: Recapitulação de E01 a E20, questões comentadas no estilo da Prova 1 e o lojinha-regras pronto para o app.
module: classes-e-controle
duration_minutes: 40
objectives:
  - Revisar os temas das três unidades de JavaScript, de E01 a E20
  - Resolver questões no estilo da Prova 1 e reconhecer as armadilhas mais comuns
  - Conferir o lojinha-regras completo, pronto para ir ao app no E30
---

# Revisão: as três unidades de JavaScript

Programador Mobile · Encontro E20 · Aula 40 de 89

---

## :icon[map] Mapa da revisão

:::goal
- Rever cada bloco de temas e resolver cinco questões no estilo da Prova 1
- Reconhecer as armadilhas que mais derrubam nota
- Conferir o `lojinha-regras` pronto para o app
:::

A Prova 1 cobre as três unidades:

| Unidade | Encontros | Temas |
|---|---|---|
| Ambiente JavaScript | E01 a E04 | web e DevTools, Node, npm, Git, lint, depuração, Jest e CI |
| Linguagem JavaScript | E05 a E12 | tipos, dinheiro, strings, datas, funções, arrays, objetos, closures, módulos, cópia, `Map`, `Set` e TypeScript |
| Classes e estruturas de controle | E13 a E20 | decisões, laços, classes, herança, protótipos, erros, Promises, `async` e a API |

---

## :icon[terminal] Ambiente: Node, npm, Git e Jest

- HTML dá a estrutura, CSS a aparência e JavaScript o comportamento; o mesmo JavaScript roda no navegador e no **Node**
- `devDependencies`, como Jest e ESLint, só servem ao desenvolvimento; o `package-lock.json` crava as versões e vai para o Git, o `node_modules/` não
- `^30.1.0` aceita qualquer 30.x a partir da 30.1.0; `~30.1.0`, só 30.1.x
- Branch por tarefa, Pull Request revisado e merge; no conflito, escolha o trecho certo e apague os marcadores
- O ESLint aponta erros prováveis, o Prettier formata e o breakpoint pausa o código
- `toBe` compara valor ou referência; `toEqual` compara o conteúdo de objetos e arrays
- O CI roda `npm ci`, lint e testes a cada push; vermelho bloqueia o merge

```bash
node src/scripts/checkout.js --api   # o --api chega no process.argv
npm i -D jest                        # entra em devDependencies
git switch -c feature/checkout       # uma branch por tarefa
```

---

## :icon[calculator] Tipos, operadores e dinheiro

- `const` por padrão, `let` quando o valor muda; `var`, nunca
- `typeof` mostra o tipo; `Number('três')` vale `NaN`, e só `Number.isNaN` o reconhece
- `+` com texto junta: `'10' + 5` vale `'105'`; `-`, `*` e `/` convertem para número
- Compare com `===`: `3 === '3'` é `false`
- `0.1 + 0.2` dá `0.30000000000000004`: dinheiro se calcula em **centavos inteiros**
- O resto (`%`) mostra o centavo que sobra na divisão: ele não pode sumir

```javascript
const centavos = paraCentavos(199.9);     // 19990, com Math.round por dentro
const parcela = Math.floor(centavos / 3); // 6663: "3x de R$ 66,63"
const sobra = centavos % 3;               // 1 centavo, que a primeira parcela leva
```

---

## :icon[text] Strings, datas e JSON

- Strings não mudam: `trim`, `slice`, `replace` e `padStart` devolvem texto novo
- `regex.test(texto)` responde sim ou não; `texto.match(regex)` devolve as partes ou `null`
- Parênteses na regex criam **grupos**: cada um vira uma posição do resultado do `match`
- `Intl.NumberFormat` e `Intl.DateTimeFormat` com `'pt-BR'` formatam dinheiro e datas
- Em `new Date(2026, 9, 16)`, o mês começa em **0**: 9 é outubro
- Nos testes, data fixa; nunca a data de hoje
- `JSON.stringify` transforma a data em texto; o `JSON.parse` não a devolve como `Date`

```javascript
const [, inicio, fim] = '01310100'.match(/^(\d{5})-?(\d{3})$/);
`${inicio}-${fim}`; // "01310-100"

new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })
  .format(new Date(2026, 9, 16)); // "sex., 16 de out."
```

---

## :icon[split] Decisões e laços

- `if` e `else if` para faixas, na ordem certa; `switch` para valores fixos, com `break` e `default`
- Falsy: `false`, `0`, `''`, `null`, `undefined` e `NaN`; todo o resto é truthy
- `??` só troca `null` e `undefined`; `||` troca qualquer falsy, inclusive o `0`
- `?.` para no primeiro `null`: `pedido?.entrega?.cep`
- **Guard clause**: trate o caso inválido no começo e retorne cedo
- `for...of` percorre valores; `for...in` percorre chaves e não serve para arrays
- Todo `while` precisa de algo que mude a condição; `break` sai do laço, `continue` pula a volta

```javascript
function textoDoFrete(frete) {
  if (frete === null) return 'Informe o CEP'; // guard clause
  if (frete === 0) return 'Grátis';
  return formatarPreco(frete);
}
```

---

## :icon[square-function] Funções, closures e recursão

- Declaração, expressão e arrow; parâmetro padrão e rest: `(itens, qtd = 1, ...extras) => ...`
- `let` e `const` valem dentro do bloco; o que nasce dentro da função não existe fora dela
- **Pura**: mesmos argumentos, mesmo resultado, nenhum efeito; imprimir, salvar e cobrar ficam fora das regras
- **Closure**: a função lembra as variáveis de onde nasceu; é o que faz `memoize` e `debounce` funcionarem
- Recursão precisa de **caso base**, ou estoura a pilha

```javascript
function criarContador() {
  let total = 0; // continua vivo dentro da closure
  return () => {
    total += 1;
    return total;
  };
}
const contar = criarContador();
contar(); // 1
contar(); // 2
```

---

## :icon[list] Arrays, objetos e funcional

- `find` devolve o item ou `undefined`; `findIndex`, a posição ou `-1`; `includes`, `true` ou `false`
- `push`, `splice` e `sort` mudam o original; `slice`, `map` e `filter` devolvem um array novo
- `sort` sem comparador ordena como texto: `[...lista].sort((a, b) => a.preco - b.preco)`
- `Object.entries(objeto)` devolve os pares `[chave, valor]`
- `map` transforma, `filter` seleciona e `reduce` acumula a partir de um valor inicial

```javascript
// src/regras/carrinho.js: devolve um array novo, sem mexer no original
export function adicionarItem(itens, produto) {
  const existe = itens.find((i) => i.id === produto.id);
  if (!existe) return [...itens, { ...produto, qtd: 1 }];
  return itens.map((i) => (i.id === produto.id ? { ...i, qtd: i.qtd + 1 } : i));
}

const total = itens.reduce((soma, i) => soma + i.preco * i.qtd, 0);
```

---

## :icon[copy] Referência, módulos, Map e Set

- Objetos e arrays são passados pela **referência**; o spread copia só um nível
- `===` entre objetos pergunta "é o mesmo?", não "é igual?"
- `this` é quem chama o método; passado solto, como em `setTimeout(pedido.mostrar, 0)`, ele se perde
- `export` nomeado se importa com chaves; `export default`, sem chaves
- `Set` guarda valores sem repetir; `Map` acha pela chave sem percorrer a lista
- O TypeScript confere os tipos **antes** de rodar; na execução, os tipos somem

```javascript
const copia = { ...pedido };
copia.entrega.cep = '20040-020'; // pedido.entrega.cep também muda

const produtosPorId = new Map(produtos.map((p) => [p.id, p]));
produtosPorId.get(4).nome; // 'Luminária de Mesa'
```

---

## :icon[boxes] Classes, herança e protótipos

- `class` com `constructor`; `new` cria a instância, e `this` é ela
- `static deJSON(obj)` cria a partir dos dados; `get total()` se lê sem parênteses; o `set` valida
- `extends` e `super` herdam; sobrescrever `totalAPagar` é o **polimorfismo**
- `#campo` é privado; o `Pedido` **tem** pagamento e entrega: é composição
- Os métodos moram no **protótipo**: todas as instâncias dividem a mesma função

```javascript
export class PagamentoPix extends Pagamento {
  constructor() {
    super('pix', 'Pix'); // antes de qualquer this
  }
  totalAPagar(valor) {
    return precoComPix(valor); // 5% de desconto, em centavos
  }
}

const formas = [new PagamentoPix(), new PagamentoCartao(3), new PagamentoBoleto()];
formas.map((forma) => forma.totalAPagar(100)); // [95, 100, 100]
```

---

## :icon[octagon-alert] Erros

- `throw` para a função na hora; o erro sobe até o `catch` mais próximo
- `finally` roda sempre: com erro, sem erro e até depois de um `return`
- Erro esperado (CEP, cupom, estoque) vira mensagem; bug se corrige, e o `catch` o relança
- Erro próprio: `class CepInvalidoError extends ErroDeNegocio`, com `super` antes do `this`
- No Jest, `expect(() => freteDoCep(100, '123')).toThrow(CepInvalidoError)`: sem a arrow, o erro estoura antes do `expect`

```javascript
try {
  const pedido = fecharPedido(dados);
  await finalizarCompra(pedido, mostrarEtapa);
} catch (erro) {
  if (!(erro instanceof ErroDeNegocio)) throw erro; // bug: não esconda
  console.log(`Não deu: ${erro.message}`);
}
```

---

## :icon[hourglass] Assincronismo e API

- O JavaScript roda numa linha só: rede e timers são assíncronos, e o programa não para esperando
- `setTimeout(fn, 0)` roda **depois** de todo o código síncrono, e o `then` passa na frente dele
- Promise: pendente, depois cumprida ou rejeitada; `then`, `catch` e `finally`
- `Promise.all` rejeita se uma falhar; `allSettled` espera todas; `race` serve de tempo limite
- Sem `await`, você recebe a Promise, não o valor; e o `forEach` não espera ninguém
- O `fetch` só rejeita em falha de rede: 404 e 500 chegam como resposta; confira `resposta.ok`

```javascript
// src/api/cliente.js, sem o tratamento da falha de rede
export async function pedir(caminho, opcoes) {
  const resposta = await fetch(URL_BASE + caminho, opcoes); // 'https://dummyjson.com'
  if (!resposta.ok) throw new ApiError(resposta.status);
  return resposta.json();
}
```

---

## :icon[folder-tree] O lojinha-regras pronto

```plaintext
lojinha-regras/
├── package.json         "type": "module"; test, lint, verificar e checkout
├── babel.config.json    e eslint.config.js
└── src/
    ├── data/            produtos.js
    ├── utils/           formatar, validar, datas, funcoes
    ├── regras/          precos, frete, carrinho, catalogo, favoritos, pedido, checkout...
    ├── modelos/         Produto, Pedido, Pagamento, erros
    ├── servicos/        checkout, com o finalizarCompra
    ├── api/             cliente e produtos, na DummyJSON
    └── scripts/         relatórios e o checkout do terminal
```

Regras puras, classes, erros próprios, um serviço assíncrono e a API, tudo com teste. No E30, a pasta `src/` vai inteira para o app: `formatarPreco`, o carrinho, o frete e o checkout viram tela sem que você reescreva as regras.

---

## Questão comentada 1

:::question
O teste abaixo falha, e o Jest avisa `serializes to the same string`. O `adicionarItem` está certo. Por que o teste falha?

```javascript
test('adiciona o fone ao carrinho vazio', () => {
  const fone = { id: 1, nome: 'Fone Bluetooth', preco: 199.9 };
  const itens = adicionarItem([], fone);
  expect(itens).toBe([{ ...fone, qtd: 1 }]);
});
```

- a) `adicionarItem` deveria mudar o array recebido em vez de devolver outro
- b) `toBe` compara referências, e dois arrays criados separadamente nunca são o mesmo
- c) Falta `async` no `test`
- d) O spread `{ ...fone, qtd: 1 }` não copia o `preco`
:::

:::tip Resposta
**b.** Com objetos e arrays, `toBe` pergunta "é o mesmo na memória?". O array do `adicionarItem` e o do `expect` têm o mesmo conteúdo, mas são dois. Troque por `toEqual`, que compara o conteúdo. A **a** é a pegadinha: mudar o array recebido surpreende quem ainda usa a lista antiga.
:::

---

## Questão comentada 2

:::question
Um produto esgotado tem `estoque: 0`, mas a função abaixo diz que dá para comprar até 10. Sem estoque informado, o limite padrão é mesmo 10. Qual linha corrige o bug?

```javascript
const maximo = produto.estoque || 10;
```

- a) `const maximo = produto.estoque ?? 10;`
- b) `const maximo = produto.estoque && 10;`
- c) `const maximo = produto.estoque === 0 || 10;`
- d) `const maximo = Number(produto.estoque || 10);`
:::

:::tip Resposta
**a.** O `||` troca qualquer falsy, e `0` é falsy: o esgotado vira 10. O `??` só troca `null` e `undefined`, então `0` continua `0`. A **b** acerta o esgotado por acaso, mas devolve 10 para quem tem 3 em estoque. A **d** mantém o mesmo `||`.
:::

---

## Questão comentada 3

:::question
Você quer ordenar por preço, do menor para o maior, sem mudar o `produtos`, que outros módulos usam. Quais linhas servem? Marque todas.

- a) `const lista = [...produtos].sort((a, b) => a.preco - b.preco);`
- b) `const lista = produtos.sort((a, b) => a.preco - b.preco);`
- c) `const lista = produtos.slice().sort((a, b) => a.preco - b.preco);`
- d) `const lista = [...produtos].sort((a, b) => a.preco > b.preco);`
- e) `const lista = [...produtos].sort();`
:::

:::tip Resposta
**a** e **c.** Spread e `slice()` criam um array novo, e o `sort` mexe só nele. A **b** muda o `produtos` de todo o projeto. A **d** parece certa, mas o comparador devolve `true` ou `false`, nunca negativo: a ordem sai errada. A **e** ordena como texto.
:::

---

## Questão comentada 4

:::question
Verdadeiro ou falso: "Para o produto 9999, que não existe na API, esta função devolve `null`."

```javascript
async function buscarProduto(id) {
  try {
    const resposta = await fetch(`https://dummyjson.com/products/${id}`);
    return await resposta.json();
  } catch (e) {
    return null;
  }
}
```
:::

:::tip Resposta
**Falso.** A API responde com status 404, e o `fetch` só rejeita quando a rede falha: um 404 chega como resposta normal. O `catch` não roda, e a função devolve o corpo do erro, `{ message: "Product with id '9999' not found" }`, como se fosse um produto.

```javascript
if (!resposta.ok) return null; // ou lance um erro, como o pedir do E19
```
:::

---

## Questão comentada 5

:::question
Complete para buscar os três produtos do pedido **ao mesmo tempo** e receber um array com os três, na ordem dos ids:

```javascript
const ids = [3, 7, 12];
const produtos = await Promise.___(ids.map((id) => buscarProduto(id)));
```
:::

:::tip Resposta
**`all`**. O `map` cria as três Promises de uma vez, e os três pedidos saem juntos. O `Promise.all` espera todos e devolve os resultados na ordem do array, não na de chegada. Se um falhar, ele rejeita; para aproveitar os que deram certo, use `allSettled`, que devolve `{ status, value }` de cada um.

Um `for` com `await` dentro buscaria um depois do outro, e a espera somaria os três tempos.
:::

---

## :icon[clipboard-check] Como será a prova

| Item | Como é |
|---|---|
| Questões | 20 objetivas, das três unidades de JavaScript |
| Tempo | 60 minutos, 1 tentativa |
| Nota mínima | 70 |
| Conteúdo | E01 a E20 (aulas 1 a 40) |
| Onde | No sistema, na última hora do encontro |

Tipos: **escolha única**, **múltipla escolha** (marque todas as corretas), **verdadeiro ou falso** e **lacuna** (o nome exato, como `toEqual`).

:::tip Leia o enunciado
- Em código, ache o tipo de cada valor, quem muda o original e onde falta `await`
- Palavras como **não**, **sempre**, **só** e **todos** mudam a resposta
- O gabarito não aparece ao enviar: sai depois da correção
:::

---

## Resumo

:::summary
- Ambiente: o Node roda os scripts, o npm cuida das dependências, o Git guarda a história e o Jest prova as regras
- Linguagem: dinheiro em centavos, `===`, funções puras, métodos que devolvem cópia, closures e referência
- Classes e controle: guard clauses, laços, classes que herdam e compõem, erros próprios e `await` dentro do `try`
- Armadilhas: `toBe` em objeto, `||` no lugar de `??`, `sort` no original, `fetch` sem `resposta.ok`, `await` esquecido
:::

Agora, a **Prova 1**. No E21, o JavaScript vira tela: por que React e o primeiro projeto com Vite.
