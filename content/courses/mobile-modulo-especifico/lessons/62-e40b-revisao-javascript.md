---
title: "Revisão: ambiente, lógica e linguagem JavaScript"
summary: Recapitulação de E21 a E40, questões comentadas no estilo da Prova 2 e a Lojinha v2, conectada e paginada.
module: linguagem-js
duration_minutes: 40
objectives:
  - Revisar os temas de ambiente, lógica e linguagem JavaScript de E21 a E40
  - Resolver questões no estilo da Prova 2
  - Entregar a versão 2 da Lojinha, conectada e paginada
---

# Revisão: ambiente, lógica e linguagem JavaScript

Programador Mobile: Módulo Específico · Encontro E40 · Aula 62 de 71

---

## :icon[map] Mapa da revisão

:::goal
- Rever cada bloco de temas e resolver cinco questões no estilo da Prova 2
- Reconhecer as armadilhas que mais derrubam nota
- Fechar a versão 2 da Lojinha no laboratório
:::

Em vinte encontros, a Lojinha ganhou testes, regras, classes, API e dados no aparelho. A prova cobre:

| Unidade | Encontros e temas | Na prova |
|---|---|---|
| Ambiente JavaScript | E21 a E24: Node, npm, Git, lint, TypeScript, testes e CI | 4 questões |
| Classes e estruturas de controle | E25 a E32: tipos, decisões, laços, funções, arrays, classes e erros | 8 questões |
| Linguagem JavaScript | E33 a E40: strings, datas, funcional, closures, Set, assíncrono, API e armazenamento | 8 questões |

---

## :icon[terminal] Node, npm e Git

- No celular, o JavaScript roda no **Hermes**; no computador, o **Node** roda Expo CLI, Metro, Jest e os seus scripts
- `dependencies` vão para o app; `devDependencies`, como Jest e ESLint, só servem ao desenvolvimento
- `~2.4.1` aceita só correções; `^2.4.1` aceita também recursos novos; nenhum dos dois aceita `3.0.0`
- O `package-lock.json` crava a versão exata e vai para o Git; o `node_modules/`, não
- Pacote do app entra com `npx expo install`, que escolhe a versão testada com o SDK
- Branch por tarefa, Pull Request revisado e merge; no conflito, escolha o trecho certo e apague os marcadores

```bash
node scripts/relatorio-catalogo.mjs --categoria=audio   # chega no process.argv
npx expo install @react-native-async-storage/async-storage
git switch -c feature/relatorio-categoria
git push -u origin feature/relatorio-categoria           # depois, o Pull Request
```

---

## :icon[shield-check] Qualidade, testes e CI

- `npx expo lint` aponta hooks e imports errados; o Prettier formata ao salvar
- A tecla `j` no terminal do Expo abre o React Native DevTools: breakpoint, watch e pilha de chamadas
- Arquivos `.ts` e `.tsx` funcionam sem configuração extra e acusam prop errada antes de rodar
- Jest: `toBe` compara valor ou referência; `toEqual` compara o conteúdo de objetos e arrays
- Variável com `EXPO_PUBLIC_` vai para o app instalado: nunca guarde segredo nela
- O GitHub Actions roda `npm ci`, lint e testes a cada push; CI vermelho bloqueia o merge

```javascript
// src/regras/precos.test.js
describe('precoComPix', () => {
  test('dá 5% de desconto', () => {
    const preco = 200; // arrange
    const resultado = precoComPix(preco); // act
    expect(resultado).toBe(190); // assert
  });
});
```

---

## :icon[calculator] Tipos, operadores e dinheiro

- `const` por padrão, `let` quando o valor muda; `var`, nunca
- O `TextInput` sempre entrega texto: `Number('3')` vale `3`, `Number('três')` vale `NaN`; teste com `Number.isNaN`
- `+` com texto junta: `'10' + 5` vale `'105'`; `-`, `*` e `/` convertem para número
- Compare com `===`: `3 === '3'` é `false`
- `0.1 + 0.2` dá `0.30000000000000004`: dinheiro se calcula em **centavos inteiros**
- O resto (`%`) mostra o centavo que sobra na divisão: ele não pode sumir

```javascript
const qtd = Number(textoDigitado);
if (Number.isNaN(qtd)) return 'Digite um número';

const centavos = Math.round(199.9 * 100); // 19990
const parcela = Math.floor(centavos / 3); // 6663: "ou 3x de R$ 66,63"
const sobra = centavos % 3; // 1 centavo, que uma das parcelas leva
```

---

## :icon[split] Decisões e repetições

- `if` e `else if` para faixas; `switch` para valores fixos, como os status do pedido
- Falsy: `false`, `0`, `''`, `null`, `undefined` e `NaN`; todo o resto é truthy
- `??` só troca `null` e `undefined`; `||` troca qualquer falsy, inclusive o `0`
- `?.` para no primeiro `null`: `usuario?.endereco?.cep`
- **Guard clause**: trate o caso inválido no começo e retorne cedo
- `for...of` percorre os valores de um array; `for...in` percorre chaves e não serve para arrays
- Todo `while` precisa de algo que mude a condição, ou a tela trava

```javascript
function textoDoFrete(frete) {
  if (frete === null) return 'Informe um CEP válido'; // guard clause
  if (frete === 0) return 'Frete grátis';
  return formatarPreco(frete);
}

let soma = 0; // acumulador
for (const item of itens) {
  soma += item.preco * item.qtd;
}
```

---

## :icon[square-function] Funções, arrays e objetos

- Arrow function, parâmetro padrão e rest: `(itens, qtd = 1, ...extras) => ...`
- **Pura**: mesmos argumentos, mesmo resultado, nenhum efeito; salvar, navegar e mostrar toast ficam fora das regras
- Recursão precisa de **caso base**, ou estoura a pilha
- `find` devolve o item ou `undefined`; `findIndex`, a posição ou `-1`; `includes`, `true` ou `false`
- `sort` muda o original e, sem comparador, ordena como texto: `[...lista].sort((a, b) => a.preco - b.preco)`; nomes com `localeCompare`
- `Object.entries(objeto)` devolve os pares `[chave, valor]`

```javascript
// src/regras/carrinho.js: devolve um array novo, sem mexer no original
export function adicionarItem(itens, produto) {
  const existe = itens.find((i) => i.id === produto.id);
  if (!existe) return [...itens, { ...produto, qtd: 1 }];
  return itens.map((i) => (i.id === produto.id ? { ...i, qtd: i.qtd + 1 } : i));
}
```

---

## :icon[boxes] Classes, herança e erros

- `class` com `constructor`; `new` cria a instância, e `this` é ela
- `static deJSON(obj)` cria a partir do JSON; `get precoFormatado()` se lê sem parênteses
- No estado do React ficam objetos simples; o método que "muda" devolve uma **nova instância**, como `pedido.comStatus('pago')`
- `extends` e `super` herdam; sobrescrever `totalAPagar` é o **polimorfismo**
- `#campo` é privado; o `Pedido` **compõe** itens, pagamento e entrega
- `throw` lança; `try`, `catch` e `finally` tratam; o erro esperado vira mensagem na tela

```javascript
export default class PagamentoPix extends Pagamento {
  constructor() {
    super('pix', 'Pix'); // antes de qualquer this
  }
  totalAPagar(valor) {
    const centavos = Math.round(valor * 100);
    return (centavos - Math.round(centavos * 0.05)) / 100; // 5% de desconto
  }
}

const formas = [new PagamentoPix(), new PagamentoCartao(3), new PagamentoBoleto()];
formas.map((forma) => forma.totalAPagar(100)); // [95, 100, 100]
```

---

## :icon[text] Strings, datas e números

- Strings não mudam: `trim`, `slice`, `replace` e `padStart` devolvem texto novo
- `regex.test(texto)` responde sim ou não; `texto.match(regex)` devolve as partes ou `null`
- Parênteses na regex criam **grupos**: cada um vira uma posição do resultado do `match`
- Busca sem acento: `normalize('NFD')` e `replace` da faixa dos acentos
- `Intl.NumberFormat` e `Intl.DateTimeFormat` com `'pt-BR'` formatam dinheiro e datas
- Em `new Date(2026, 9, 16)`, o mês começa em **0**: 9 é outubro
- Nos testes, data fixa; nunca a data de hoje

```javascript
const [, inicio, fim] = '01310100'.match(/^(\d{5})-?(\d{3})$/);
`${inicio}-${fim}`; // "01310-100"

const data = new Date(2026, 9, 16);
new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })
  .format(data); // "sex., 16 de out."
```

---

## :icon[workflow] Funcional, closures e referência

- `map` transforma, `filter` seleciona, `reduce` acumula a partir de um valor inicial
- Spread copia **um nível**: um objeto aninhado continua compartilhado
- **Closure**: a função lembra as variáveis de onde nasceu; é o que faz `debounce` e `memoize` funcionarem
- `onPress={pedido.cancelar}` perde o `this`: use `onPress={() => pedido.cancelar()}`
- O React compara **referências**: depois de um `push`, `setItens(itens)` não redesenha
- `Set` guarda valores sem repetir; `Map` guarda pares com chave de qualquer tipo

```javascript
const total = itens.reduce((soma, i) => soma + i.preco * i.qtd, 0);

setItens([...itens, novo]); // array novo: a tela redesenha

setFavoritos((anteriores) => {
  const novos = new Set(anteriores); // cópia: um Set novo
  if (novos.has(id)) novos.delete(id);
  else novos.add(id);
  return novos;
});
```

---

## :icon[hourglass] Assincronismo e API

- O JavaScript do app roda numa linha só: por isso rede e timers são assíncronos, e a tela não trava
- `setTimeout(fn, 0)` roda **depois** de todo o código síncrono
- Promise: pendente, depois cumprida ou rejeitada; `then`, `catch` e `finally`
- `Promise.all` rejeita se uma falhar; `allSettled` espera todas; `race` serve de tempo limite
- Sem `await`, você recebe a Promise, não o valor
- O `fetch` só rejeita em falha de rede: 404 e 500 chegam como resposta; confira `resposta.ok`
- `AbortController` cancela a busca anterior

```javascript
// src/api/cliente.js
export async function pedir(caminho, opcoes) {
  const resposta = await fetch(process.env.EXPO_PUBLIC_API_URL + caminho, opcoes);
  if (!resposta.ok) throw new Error(`Erro ${resposta.status}`);
  return resposta.json();
}
```

---

## :icon[save] Dados no aparelho, login e paginação

- O AsyncStorage guarda **texto** e é assíncrono: `JSON.stringify` para salvar, `JSON.parse` para ler
- Carrinho e favoritos: carregue ao abrir o app e salve a cada mudança
- O token vai no **SecureStore**; nunca no AsyncStorage nem no `.env`
- O `AuthContext` entrega `usuario`, `entrar`, `sair` e `carregando`; o `Redirect` espera o `carregando` acabar
- `useProdutos` pagina com `limit` e `skip`: o `skip` é `produtos.length`, a parada é o `total` e a trava é um `useRef`

```javascript
// src/servicos/armazenamento.js, sem o try/catch
export async function ler(chave, padrao) {
  const texto = await AsyncStorage.getItem(chave); // null se não existe
  return texto === null ? padrao : JSON.parse(texto);
}

// no CarrinhoContext
const salvos = await ler('lojinha.carrinho', []);
await salvar('lojinha.carrinho', itens); // JSON.stringify por dentro
```

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
**b.** Com objetos e arrays, `toBe` pergunta "é o mesmo na memória?". O array do `adicionarItem` e o do `expect` têm o mesmo conteúdo, mas são dois. Troque por `toEqual`, que compara o conteúdo. A **a** é a pegadinha: mudar o original quebra o React, que só redesenha com array novo.
:::

---

## Questão comentada 2

:::question
Um produto esgotado tem `estoque: 0`, mas o seletor de quantidade deixa o cliente escolher até 10. Sem estoque informado, o limite padrão é mesmo 10. Qual linha corrige o bug?

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
Você quer ordenar por preço, do menor para o maior, sem mudar o `produtos`, que outras telas usam. Quais linhas servem? Marque todas.

- a) `const lista = [...produtos].sort((a, b) => a.preco - b.preco);`
- b) `const lista = produtos.sort((a, b) => a.preco - b.preco);`
- c) `const lista = produtos.slice().sort((a, b) => a.preco - b.preco);`
- d) `const lista = [...produtos].sort((a, b) => a.preco > b.preco);`
- e) `const lista = [...produtos].sort();`
:::

:::tip Resposta
**a** e **c.** Spread e `slice()` criam um array novo, e o `sort` mexe só nele. A **b** muda o `produtos` de todas as telas. A **d** parece certa, mas o comparador devolve `true` ou `false`, nunca negativo: a ordem sai errada. A **e** ordena como texto.
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
if (!resposta.ok) return null; // ou lance um erro, como o pedir do E38
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

## :icon[triangle-alert] Erros que mais reprovam

:::warning
- `toBe` em array ou objeto no Jest: compare o conteúdo com `toEqual`
- `||` onde `0` ou `''` são valores válidos: use `??`
- `sort` no array original, ou sem comparador numérico
- `push` seguido de `setItens(itens)`: mesma referência, a tela não muda
- `fetch` sem conferir `resposta.ok`, ou `await` esquecido
- `onPress={pedido.cancelar}`: o `this` se perde; use arrow function
- Dinheiro em ponto flutuante: calcule em centavos
:::

Se um enunciado parece fácil demais, procure um desses sete antes de responder.

---

## :icon[clipboard-check] Como será a prova

| Item | Como é |
|---|---|
| Questões | 20 objetivas: 4 de ambiente, 8 de lógica e classes, 8 de linguagem |
| Tempo | 60 minutos, 1 tentativa |
| Nota mínima | 70 |
| Conteúdo | E21 a E40 (aulas 23 a 61) |
| Onde | No sistema, na última hora do encontro |

Tipos: **escolha única**, **múltipla escolha** (marque todas as corretas), **verdadeiro ou falso** e **lacuna** (o nome exato, como `toEqual`).

:::tip Leia o enunciado
- Em código, ache o tipo de cada valor, quem muda o original e onde falta `await`
- Palavras como **não**, **sempre**, **só** e **todos** mudam a resposta
- O gabarito não aparece ao enviar: sai depois da correção
:::

---

## :icon[flask-conical] No laboratório

**40 minutos.** Paginação e a **v2 da Lojinha**.

:::steps
1. `listarProdutos` com `total` e o `useProdutos`
2. Início com o hook: esqueleto, erro, vazio e grade
3. `onEndReached` e o rodapé
4. Puxar para atualizar
5. Checklist: modo avião, `&delay=2000` e fim da lista
6. Vídeo de até 20 segundos no README
7. `git add .`, `git commit -m "v2 Lojinha conectada"` e `git push`
:::

**Critérios**: nada repetido nem pulado, nenhum pedido depois do fim, erro no rodapé sem apagar a grade. Entrega: link do repositório no sistema. Depois, a **Prova 2**.

**Para casa, até o E41**: Categorias e Filtros com `listarCategorias()` e `/products/category/{slug}`; favoritos com `Promise.all` e `buscarProduto`.
