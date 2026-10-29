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

## O que você vai aprender

:::goal
- Rever cada bloco de temas e resolver cinco questões no estilo da Prova 1
- Reconhecer as armadilhas que mais derrubam nota
- Conferir o `lojinha-regras` pronto para o app
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **prova simulada** | um treino com questões iguais às da prova; a resposta vem logo depois |
| **pegadinha** | a alternativa que parece certa, mas cai numa armadilha conhecida |
| **escolha única** | questão em que só uma alternativa está certa |
| **múltipla escolha** | questão em que você marca todas as alternativas certas: uma, duas ou mais |
| **lacuna** | um espaço em branco no código, que você completa com o nome exato |

---

## :icon[map] Mapa da revisão

A Prova 1 cobre as três unidades de JavaScript:

| Unidade | Encontros | Temas |
|---|---|---|
| Ambiente JavaScript | E01 a E04 | web e DevTools, Node, npm, Git, lint, depuração, Jest e CI |
| Linguagem JavaScript | E05 a E12 | tipos, dinheiro, strings, datas, funções, arrays, objetos, closures, módulos, cópia, `Map`, `Set` e TypeScript |
| Classes e estruturas de controle | E13 a E20 | decisões, laços, classes, herança, protótipos, erros, Promises, `async` e a API |

:::question
Qual das três unidades você acha mais difícil? Comece por ela quando estudar.
:::

---

## Ambiente

Se o projeto fosse um bolo, o que seria a lista de ingredientes?

---

## :icon[terminal] Ambiente: Node e npm

O **ambiente** é tudo o que roda e organiza o seu código. Um script é uma receita: passos em ordem, de cima para baixo. O **Node** segue a receita fora do navegador.

- HTML dá a estrutura, CSS a aparência e JavaScript o comportamento; o mesmo JavaScript roda no navegador e no Node
- O `package.json` é a lista de ingredientes do projeto; cada script do npm, um contato salvo com nome
- `devDependencies`, como Jest e ESLint, só servem ao desenvolvimento
- O `package-lock.json` é a nota fiscal: crava as versões e vai para o Git; o `node_modules/` não vai
- `^30.1.0` aceita qualquer 30.x a partir da 30.1.0; `~30.1.0`, só 30.1.x

```bash
node src/scripts/checkout.js --api   # o --api chega no process.argv
npm i -D jest                        # entra em devDependencies
```

---

## :icon[git-branch] Ambiente: Git, lint e testes

O Git guarda a história do projeto. Cada **commit** é uma foto do projeto naquele momento, com legenda.

- Uma **branch** por tarefa, o rascunho paralelo; o Pull Request pede a um colega para revisar antes de juntar (o merge)
- No conflito, escolha o trecho certo e apague os marcadores
- O ESLint é o corretor ortográfico do código, o Prettier formata e o breakpoint pausa o código
- O teste é uma prova com gabarito que o computador corrige: `toBe` compara valor ou referência; `toEqual` compara o conteúdo de objetos e arrays
- O CI é a inspeção automática a cada entrega: `npm ci`, lint e testes a cada push; vermelho bloqueia o merge

```bash
git switch -c feature/checkout       # uma branch por tarefa
```

---

## :icon[terminal] Ambiente na prática

Três comandos e três testes que caem na prova:

```bash
npm run checkout               # roda o apelido "checkout" do package.json
npm i -D jest                  # o jest entra em devDependencies
git switch -c feature/cupom    # Switched to a new branch 'feature/cupom'
```

```javascript
expect(precoComPix(200)).toBe(190);  // passa: número compara o valor
expect([1, 2]).toEqual([1, 2]);      // passa: mesmo conteúdo
expect([1, 2]).toBe([1, 2]);         // falha: são dois arrays diferentes
```

Com `"jest": "^30.1.0"` no `package.json`, o npm pode instalar a 30.5.2, mas nunca a 31.0.0.

---

## Valores e textos

Qual é a diferença entre uma caixa lacrada e uma que deixa trocar o conteúdo?

---

## :icon[calculator] Tipos, operadores e dinheiro

Uma **variável** é uma caixa com etiqueta: `const` é a caixa lacrada; `let`, a que deixa trocar o conteúdo. O **tipo** é o que cabe na caixa: número, texto, sim ou não.

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

Um texto, a **string**, não muda: cada método devolve um texto novo.

- `trim`, `slice`, `replace` e `padStart` devolvem texto novo
- Uma **regex** descreve o formato de um texto, como o do CEP. `regex.test(texto)` responde sim ou não; `texto.match(regex)` devolve as partes ou `null`
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

A vírgula no começo de `[, inicio, fim]` pula a posição 0, o texto inteiro.

---

## :icon[calculator] Valores e textos na prática

```javascript
'10' + 5;                          // '105': com texto, o + junta
'10' - 5;                          // 5: o - converte para número
0.1 + 0.2;                         // 0.30000000000000004
Number.isNaN(Number('três'));      // true
'  Fone '.trim();                  // 'Fone': um texto novo
new Date(2026, 9, 16).getMonth();  // 9, que é outubro
```

- As quatro primeiras linhas são pegadinhas de tipo: `+` com texto, conversão, centavos e `NaN`
- As duas últimas mostram as regras de textos e datas: o método devolve um texto novo, e o mês começa em 0

---

## Decisões e laços

Numa bifurcação da estrada, o que escolhe o caminho?

---

## :icon[split] Decisões e laços

O `if` é uma bifurcação na estrada: a condição escolhe o caminho. O laço confere o carrinho item por item, até acabar.

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

## :icon[split] Decisões e laços na prática

O `textoDoFrete`, com a guard clause, em três casos:

```javascript
textoDoFrete(null);  // 'Informe o CEP': o caso inválido sai primeiro
textoDoFrete(0);     // 'Grátis'
textoDoFrete(14.9);  // 'R$ 14,90'
```

Aqui o `0` é um valor válido. Por isso a comparação é com `===`, e não com `!frete`. A mesma armadilha aparece no `||`:

```javascript
0 || 10;  // 10: o || troca o 0, que é falsy
0 ?? 10;  // 0: o ?? só troca null e undefined
```

---

## Funções

Numa receita, qual é a diferença entre o espaço do ingrediente e o ingrediente?

---

## :icon[square-function] Funções: receitas com nome

Uma **função** é uma receita com nome, guardada para usar quando quiser. O **parâmetro** é o espaço do ingrediente; o **argumento**, o ingrediente que você põe nele. O `return` é o prato pronto; o `console.log` só mostra a foto do prato.

```javascript
const totalDoItem = (preco, qtd = 1) => preco * qtd;
totalDoItem(50, 3); // 150
totalDoItem(50);    // 50: qtd vale 1, o padrão
```

- Declaração, expressão e arrow; parâmetro padrão e rest: `(itens, qtd = 1, ...extras) => ...`
- `let` e `const` valem dentro do bloco; o que nasce dentro da função não existe fora dela
- **Pura**: mesmos argumentos, mesmo resultado, nenhum efeito; imprimir, salvar e cobrar ficam fora das regras

---

## :icon[briefcase] Closures e recursão

Uma **closure** é a mochila da função: ela leva junto as variáveis do lugar onde nasceu. É o que faz `memoize` e `debounce` funcionarem.

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

A **recursão** são as bonecas russas: a função chama a si mesma, cada vez com um pedaço menor, até a última boneca. Essa última é o **caso base**: sem ele, a recursão estoura a pilha.

---

## :icon[square-function] Funções na prática

Cada contador leva a sua própria mochila, com o seu `total`:

```javascript
const contarA = criarContador();
const contarB = criarContador();
contarA(); // 1
contarA(); // 2
contarB(); // 1: a mochila do B é outra
```

E uma recursão com caso base, a última boneca:

```javascript
function contagem(n) {
  if (n === 0) return 'Já!'; // caso base
  return n + '... ' + contagem(n - 1);
}
contagem(3); // '3... 2... 1... Já!'
```

---

## Arrays e objetos

Na fileira de gavetas, qual é o número da primeira?

---

## :icon[list] Arrays, objetos e funcional

Um **array** é uma fileira de gavetas numeradas a partir do 0. Um **objeto** é uma ficha de cadastro: cada campo tem nome e valor.

- `find` devolve o item ou `undefined`; `findIndex`, a posição ou `-1`; `includes`, `true` ou `false`
- `push`, `splice` e `sort` mudam o original; `slice`, `map` e `filter` devolvem um array novo
- `sort` sem comparador ordena como texto: `[...lista].sort((a, b) => a.preco - b.preco)`
- `Object.entries(objeto)` devolve os pares `[chave, valor]`
- `map` é a linha de produção (transforma), `filter` a peneira (seleciona) e `reduce` a calculadora que vai acumulando, a partir de um valor inicial

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

## :icon[copy] Referência e cópia

Objetos e arrays são passados pela **referência**, o endereço de uma casa: dois papéis com o mesmo endereço levam à mesma casa.

- O spread tira uma cópia, para você mexer nela sem rasurar o original; mas copia só um nível
- `===` entre objetos pergunta "é o mesmo?", não "é igual?"
- `this` é quem chama o método; passado solto, como em `setTimeout(pedido.mostrar, 0)`, ele se perde

```javascript
const copia = { ...pedido };
copia.entrega.cep = '20040-020'; // pedido.entrega.cep também muda
```

A `entrega` de dentro não foi copiada: os dois pedidos guardam o endereço da mesma entrega.

---

## :icon[store] Módulos, Map, Set e TypeScript

Um **módulo** é uma vitrine: o `export` põe na vitrine, e o `import` pega de lá.

- `export` nomeado se importa com chaves; `export default`, sem chaves
- O `Map` é a agenda de contatos: pela chave, acha o valor sem percorrer a lista
- O `Set` é a lista de convidados: guarda valores sem repetir
- O TypeScript é a etiqueta "só cabe isto" na caixa: confere os tipos **antes** de rodar; na execução, os tipos somem

```javascript
const produtosPorId = new Map(produtos.map((p) => [p.id, p]));
produtosPorId.get(4).nome; // 'Luminária de Mesa'
```

---

## :icon[list] Arrays e objetos na prática

Quem muda o original, quem devolve um novo e onde a cópia para:

```javascript
const precos = [89.9, 199.9, 79.9];
[...precos].sort((a, b) => a - b); // [79.9, 89.9, 199.9]; precos fica igual
[9.99, 129.99, 1899.99].sort();    // [129.99, 1899.99, 9.99]: ordenou como texto
precos.filter((p) => p > 80);      // [89.9, 199.9]: a peneira
precos.reduce((s, p) => s + p, 0); // 369.70000000000005: some em centavos
```

```javascript
const pedido = { id: 1, entrega: { cep: '01310-100' } };
const copia = { ...pedido };
copia === pedido;                  // false: o objeto de fora é novo
copia.entrega === pedido.entrega;  // true: a entrega é a mesma casa
```

---

## Classes

Uma forma de bolo e três bolos: qual deles é a classe?

---

## :icon[boxes] Classes, herança e protótipos

Uma **classe** é a forma de bolo; cada **instância**, um bolo feito com ela.

- `class` com `constructor`; `new` cria a instância, e `this` é ela
- `static deJSON(obj)` cria a partir dos dados; `get total()` se lê sem parênteses; o `set` valida
- **Herança** (`extends` e `super`): o cartão é um tipo de pagamento, herda o que todo pagamento tem e acrescenta o seu
- **Polimorfismo**: o mesmo pedido, "pague", e cada forma sobrescreve `totalAPagar` do seu jeito
- `#campo` é privado, como o cofre do caixa eletrônico; o `Pedido` **tem** pagamento e entrega: é composição
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

## :icon[boxes] Classes na prática

```javascript
const cartao = new PagamentoCartao(3);
cartao instanceof Pagamento;               // true: o cartão é um tipo de pagamento
cartao.descricao;                          // 'Cartão em 3x sem juros'
new PagamentoCartao(10).descricao;         // 'Cartão em 10x com juros'
new PagamentoCartao(10).totalAPagar(100);  // 121.78
```

- `instanceof` confirma a herança: todo `PagamentoCartao` é um `Pagamento`
- A mesma classe, com argumentos diferentes, faz instâncias diferentes: dois bolos da mesma forma
- Cada forma de pagamento responde ao mesmo `totalAPagar` do seu jeito

---

## Erros

Para que serve a rede do trapezista, se ele quase nunca cai?

---

## :icon[octagon-alert] Erros

O `try`/`catch` é a rede de proteção do trapezista. O `throw` é a queda: para a função na hora, e o erro cai no `catch` mais próximo.

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

## :icon[octagon-alert] Erros na prática

Um erro esperado, um bug e o `finally`:

```javascript
try {
  freteDoCep(100, '123');
} catch (erro) {
  console.log(erro.name, erro.message);
}
// CepInvalidoError Confira o CEP 123: ele precisa ter 8 números.

try {
  null.descricao;
} catch (erro) {
  console.log(erro.name, erro instanceof ErroDeNegocio);
}
// TypeError false: é bug, e o catch do checkout o relança
```

```javascript
function testarFinally() {
  try { return 'saiu'; } finally { console.log('finally rodou'); }
}
testarFinally(); // imprime 'finally rodou' e devolve 'saiu'
```

---

## Assincronismo

Com a senha da lanchonete na mão, o lanche já está pronto?

---

## :icon[hourglass] Event loop e Promises

O JavaScript roda numa linha só. O **event loop** é o garçom que anota o pedido, atende outras mesas e volta quando a cozinha chama: rede e timers são assíncronos, e o programa não para esperando.

- `setTimeout(fn, 0)` roda **depois** de todo o código síncrono, e o `then` passa na frente dele
- A **Promise** é a senha da lanchonete: pendente, depois cumprida ou rejeitada; `then`, `catch` e `finally`
- `Promise.all` rejeita se uma falhar; `allSettled` espera todas; `race` serve de tempo limite

```javascript
setTimeout(() => console.log('timer'), 0);
Promise.resolve().then(() => console.log('then'));
console.log('síncrono');
// síncrono, then, timer
```

---

## :icon[cloud-download] async, await e a API

O `await` é esperar a senha ser chamada sem travar a fila. A **API** é o garçom do restaurante: você pede pelo cardápio, a cozinha prepara, e ele traz o prato, o JSON.

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

## :icon[hourglass] Assincronismo na prática

O `esperar(ms)`, do E18, devolve uma Promise que cumpre depois de um tempo:

```javascript
const senha = esperar(300).then(() => 'lanche pronto');
console.log(senha);        // Promise { <pending> }: a senha, ainda sem o lanche
console.log(await senha);  // lanche pronto

const pedidos = [esperar(100).then(() => 'A'), esperar(50).then(() => 'B')];
await Promise.all(pedidos); // ['A', 'B']: na ordem do array, mesmo com o B pronto antes
```

- Sem o `await`, você tem a senha, não o lanche
- O `Promise.all` espera as duas senhas e respeita a ordem em que foram pedidas

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

## :icon[milestone] Projeto 3 · Etapa 8: revisão e entrega

No seu repositório `lista-de-tarefas`, depois da prova e até o **início do E21**:

- `npm run verificar` verde com o Wi-Fi desligado
- nenhum `document` fora de `src/tela/` e nenhum `fetch` fora de `src/api/`
- dois prints em `docs/` e o README com o que o app faz, como rodar e como testar
- a lista "Antes de entregar" do enunciado, conferida numa janela anônima
- o link do repositório colado na página do projeto

Commit: `Projeto 3: etapa 8, revisão e entrega`. Enunciado completo e entrega: página do curso, em **Projetos**.

---

## Resumo

:::summary
- Ambiente: o Node roda os scripts, o npm cuida das dependências, o Git guarda a história e o Jest prova as regras
- Linguagem: dinheiro em centavos, `===`, funções puras, métodos que devolvem cópia, closures e referência
- Classes e controle: guard clauses, laços, classes que herdam e compõem, erros próprios e `await` dentro do `try`
- Armadilhas: `toBe` em objeto, `||` no lugar de `??`, `sort` no original, `fetch` sem `resposta.ok`, `await` esquecido
:::

Agora, a **Prova 1**. No E21, o JavaScript vira tela: por que React e o primeiro projeto com Vite.
