---
title: Protótipos e as classes por dentro
summary: A cadeia de protótipos, o que class, extends e super criam por baixo e onde moram os métodos das suas classes.
module: classes-e-controle
duration_minutes: 40
objectives:
  - Seguir a cadeia de protótipos de um objeto com Object.getPrototypeOf e Object.hasOwn
  - Explicar o que class, extends e super criam por baixo dos panos
  - Separar o que mora na instância do que é compartilhado no protótipo
  - Prever o que instanceof, o spread e o JSON fazem com uma instância
---

# Protótipos e as classes por dentro

Programador Mobile · Encontro E17 · Aula 33 de 89

---

## O que você vai aprender

:::goal
- Seguir a **cadeia de protótipos** com `Object.getPrototypeOf` e `Object.hasOwn`
- Ver o que uma `class` cria por baixo dos panos: uma função e um `prototype`
- Saber onde moram os dados, os métodos, os getters e os estáticos do `Produto` do E15
- Entender o `extends`, o `super` e a sobrescrita do E16 como elos da cadeia
- Prever o que `instanceof`, o spread e o JSON fazem com uma instância
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **protótipo** | o objeto onde um objeto procura o que ele mesmo não tem |
| **cadeia de protótipos** | a sequência de elos: o objeto, o protótipo dele, o protótipo do protótipo, até o fim |
| **propriedade própria** | uma propriedade guardada no próprio objeto, e não num protótipo |
| **sobrescrever** | ter um método com o mesmo nome num elo mais perto do objeto: ele é achado primeiro |
| **`instanceof`** | a pergunta "este objeto é da família desta classe?" |
| **açúcar sintático** | um jeito mais fácil de escrever algo que a linguagem já sabia fazer |

---

## Métodos que não estão no objeto

Pegue o `Produto` do E15 e pergunte ao objeto o que ele guarda:

```javascript
const fone = Produto.deJSON(produtos[0]);

Object.keys(fone);
// ['id', 'nome', 'preco', 'categoria', 'imagem', 'descricao', 'destaque', 'avaliacao']

fone.precoPara(2);    // 399.8
fone.precoFormatado;  // 'R$ 199,90'
`${fone}`;            // 'Fone Bluetooth, R$ 199,90': o toString do E15
```

`Object.keys(fone)` lista os nomes guardados no `fone`: só dados. O `console.log(fone)` também mostra só dados. Nem `precoPara`, nem `precoFormatado`, nem `toString` aparecem. Mesmo assim, os três funcionam.

:::question
Se os métodos não estão no `fone`, onde o JavaScript os encontra?
:::

---

## Protótipo

A receita não está no seu caderno. Onde você procura?

---

## :icon[link-2] O protótipo: um elo escondido

Pense no caderno de receitas de uma família. A receita não está no seu caderno? Você procura no caderno da sua mãe. O objeto faz igual.

Todo objeto tem um elo escondido para outro objeto: o seu **protótipo** (*prototype*). Quando você lê uma propriedade que o objeto não tem, o JavaScript procura no protótipo.

```javascript
const item = { nome: 'Fone Bluetooth', qtd: 1 }; // objeto literal, como no E08

Object.getPrototypeOf(item) === Object.prototype; // true: o elo
Object.hasOwn(item, 'nome');      // true: é do próprio objeto
Object.hasOwn(item, 'toString');  // false: não é dele...
item.toString();                  // '[object Object]': ...veio do protótipo
```

O `item` não tem `toString`, e mesmo assim a última linha funciona: o JavaScript achou o método no protótipo.

---

## :icon[list-ordered] O elo em português

| Linha | O que ela diz |
|---|---|
| `Object.getPrototypeOf(item)` | "qual é o protótipo do `item`?" (*get prototype of*: pegue o protótipo de) |
| `=== Object.prototype` | "é o `Object.prototype`?" Sim: ele é o protótipo de todo objeto escrito com `{ }`, e é lá que mora o `toString` |
| `Object.hasOwn(item, 'nome')` | "o `nome` é do próprio `item`?" (*has own*: tem como seu). Sim: é uma **propriedade própria** |
| `Object.hasOwn(item, 'toString')` | "e o `toString`, é dele?" Não: mora no protótipo |
| `item.toString()` | funciona assim mesmo: o JavaScript procurou no protótipo |

---

## :icon[link-2] Protótipo na prática

**Caso 1: o produto do E15.** Os dados moram no `fone`; os métodos, no protótipo dele.

```javascript
const fone = Produto.deJSON(produtos[0]);

Object.hasOwn(fone, 'nome');      // true: o dado mora no fone
Object.hasOwn(fone, 'precoPara'); // false: o método não mora nele...
fone.precoPara(2);                // 399.8: ...e funciona, achado no protótipo
```

**Caso 2: um texto.** Todo texto também consulta um protótipo, o `String.prototype`.

```javascript
const cupom = 'bemvindo';
cupom.toUpperCase();                            // 'BEMVINDO'
Object.hasOwn(String.prototype, 'toUpperCase'); // true: mora no protótipo dos textos
```

É a resposta para os métodos que não apareciam no `Object.keys(fone)`: eles moram no protótipo.

---

## Cadeia de protótipos

E se a sua mãe também não tiver a receita?

---

## :icon[arrow-up] A busca sobe até null

O caderno da sua mãe aponta para o da avó: o protótipo também tem protótipo. Essa sequência de elos é a **cadeia de protótipos**. Ela termina em `null`, que quer dizer "nada".

:::center
![Diagrama: a cadeia de itens vai do próprio array para Array.prototype, com map, filter e push, depois para Object.prototype, com hasOwnProperty e toString, e termina em null; itens.map é achado em Array.prototype e itens.desconto chega a null e dá undefined](images/e17-cadeia-prototipos.svg)
:::

:::steps
1. Procura no próprio objeto
2. Não achou: sobe um elo e procura lá
3. Repete até achar; em `null`, a resposta é `undefined`
:::

---

## :icon[list-tree] A cadeia na prática

Um array do carrinho e a cadeia dele, elo por elo:

```javascript
const itens = [{ id: 1, qtd: 1 }];

Object.hasOwn(itens, 'map');                                 // false: não é do array
Object.getPrototypeOf(itens) === Array.prototype;            // true: está aqui
Object.getPrototypeOf(Array.prototype) === Object.prototype; // true
Object.getPrototypeOf(Object.prototype);                     // null: fim da cadeia
itens.desconto;                                              // undefined: ninguém tem
```

- `itens.map` é achado no segundo elo, o `Array.prototype`
- `itens.desconto` não é achado em nenhum: a busca chega a `null` e devolve `undefined`

O `map`, o `filter` e o `push` do E08 e do E09 moram em `Array.prototype`. Eles existem **uma vez só** e servem a todos os arrays do programa: `[1].map === [2].map` é `true`.

---

## A class por dentro

Se 12 bolos saem da mesma forma, a receita precisa estar escrita em cada bolo?

---

## :icon[blocks] O que a class cria por baixo

A `class` do E15 é a forma de bolo, e cada instância é um bolo feito com ela. Por baixo, `class Produto` cria duas coisas:

- uma **função**, a que o `new` chama para fazer cada bolo
- o objeto **`Produto.prototype`**, o caderno que todos os produtos consultam: é lá que ficam os métodos e os getters

```javascript
typeof Produto;                                     // 'function'
Object.hasOwn(Produto.prototype, 'precoPara');      // true: o método mora aqui
Object.hasOwn(Produto.prototype, 'precoFormatado'); // true: o getter também
Object.getPrototypeOf(fone) === Produto.prototype;  // true: o passo 2 do new, no E15
```

O `typeof` diz o tipo de um valor: a `class` é, por baixo, uma `'function'`.

---

## :icon[table] Onde mora cada coisa

| Onde mora | O quê | Exemplo |
|---|---|---|
| na instância | o que o `constructor` atribui com `this` | `fone.nome` |
| em `Produto.prototype` | métodos e getters | `fone.precoPara(2)` |
| na função `Produto` | os estáticos | `Produto.deJSON(dados)` |

A busca do `fone` passa pelo próprio `fone` e pelos protótipos. A função `Produto` não é um desses elos.

Por isso `fone.deJSON` é `undefined`: o estático não está na cadeia do `fone`.

---

## :icon[users] Um método para todas as instâncias

A família tem um caderno só, e todo mundo consulta o mesmo. Com os produtos é igual:

```javascript
const fone = Produto.deJSON(produtos[0]);
const caixa = Produto.deJSON(produtos[1]);

fone.precoPara === caixa.precoPara; // true: é a mesma função
fone.precoPara(2);                  // 399.8: this é o fone
caixa.precoPara(2);                 // 499.8: this é a caixa
```

- A função existe uma vez, em `Produto.prototype`: os 12 produtos não guardam 12 cópias dela
- Quem diz de qual produto é o preço é o `this`, que vale o objeto antes do ponto, como no E15
- Por ser compartilhado, mudar um protótipo muda todas as instâncias de uma vez. É por isso que ninguém mexe no protótipo dos outros

---

## :icon[history] Antes do class: função e prototype

A palavra `class` chegou ao JavaScript em 2015. Antes, o mesmo mecanismo era escrito à mão. Você ainda encontra esse jeito em código antigo:

```javascript
function ProdutoAntigo(id, nome, preco) { // o "constructor" é uma função comum
  this.id = id;
  this.nome = nome;
  this.preco = preco;
}

ProdutoAntigo.prototype.precoPara = function (qtd) { // o método, posto à mão no protótipo
  return (Math.round(this.preco * 100) * qtd) / 100;
};

const fone = new ProdutoAntigo(1, 'Fone Bluetooth', 199.9);
fone.precoPara(2); // 399.8, achado em ProdutoAntigo.prototype
```

A `class` faz o mesmo com menos chance de erro: junta tudo num bloco e proíbe chamar sem `new`. Por isso se diz que ela é **açúcar sintático**: um jeito mais doce, mais fácil, de escrever o que a linguagem já fazia.

---

## Pratique

:::example Desafio
Desenhe a cadeia de `fone`, criado com `Produto.deJSON(produtos[0])`, e diga em que elo o JavaScript acha cada leitura:

1. `fone.nome`
2. `fone.precoFormatado`
3. `fone.toString`
4. `fone.deJSON`
:::

:::tip Resposta
`fone`, depois `Produto.prototype`, depois `Object.prototype` e, no fim, `null`.

1. No próprio `fone`: o `constructor` atribuiu com `this.nome`
2. Em `Produto.prototype`: getters moram junto com os métodos
3. Em `Produto.prototype`, o `toString` do E15. O de `Object.prototype` também existe, um elo acima, mas a busca para no primeiro que acha
4. Em nenhum: a busca chega a `null` e devolve `undefined`. O estático mora na função `Produto`, fora da cadeia, e `fone.deJSON(dados)` dá `TypeError: fone.deJSON is not a function`
:::

---

## Herança por dentro

O boleto nunca escreveu o próprio `totalAPagar`. Como ele sabe quanto cobrar?

---

## :icon[git-fork] extends liga dois protótipos

No E16, o boleto **é um tipo de** pagamento: herda o que todo pagamento tem e acrescenta o seu. Por dentro, `class PagamentoBoleto extends Pagamento` faz o protótipo da filha apontar para o da mãe. A cadeia ganha um elo.

:::center
![Diagrama: a cadeia de boleto vai do objeto para PagamentoBoleto.prototype, que só tem vencimento, depois pelo elo criado pelo extends até Pagamento.prototype, com totalAPagar e descricao, e por fim Object.prototype e null; a busca por boleto.totalAPagar não acha nada nos dois primeiros elos e para no terceiro](images/e17-cadeia-pagamento.svg)
:::

O boleto não declara `totalAPagar`. A busca passa por `PagamentoBoleto.prototype` e sobe até `Pagamento.prototype`. É o "sobe até `Pagamento`" do E16, agora com nome: **herdar** é achar o método num elo mais acima.

---

## :icon[arrow-up-down] Sobrescrever e super

**Sobrescrever** é pôr um método com o mesmo nome num elo mais perto do objeto. É ter a sua versão da receita no seu caderno: você nem abre o da avó. Assim o `toString` do `Produto` esconde o de `Object.prototype`. No Pix, a busca acha `totalAPagar` em `PagamentoPix.prototype` e para ali: o da mãe nem é visitado.

```javascript
const pix = new PagamentoPix();
const boleto = new PagamentoBoleto();

Object.getPrototypeOf(PagamentoPix.prototype) === Pagamento.prototype; // true: o elo do extends
pix.totalAPagar === Pagamento.prototype.totalAPagar;    // false: achou o do Pix antes
boleto.totalAPagar === Pagamento.prototype.totalAPagar; // true: subiu até a mãe
```

- `super.totalAPagar(valor)`, no `PagamentoCartao`, começa a busca **um elo acima**, em `Pagamento.prototype`, com o mesmo `this`
- `super(...)` no constructor roda o constructor da mãe. Numa filha, é ele que cria o objeto: antes do `super`, o `this` ainda não existe

---

## :icon[credit-card] Herança na prática

As três formas de pagamento do E16, com a mesma compra de R$ 199,90:

```javascript
const boleto = new PagamentoBoleto();
const pix = new PagamentoPix();
const cartao = new PagamentoCartao(3);

boleto.totalAPagar(199.9); // 199.9: não achou no boleto, subiu até Pagamento
pix.totalAPagar(199.9);    // 189.9: achou em PagamentoPix.prototype e parou
cartao.totalAPagar(199.9); // 199.9: até 6x, o super.totalAPagar usa a regra da mãe
pix.descricao;             // 'Pix com 5% de desconto': o super.descricao e o resto
```

| Chamada | Onde a busca parou | Por quê |
|---|---|---|
| `boleto.totalAPagar` | `Pagamento.prototype` | herdado |
| `pix.totalAPagar` | `PagamentoPix.prototype` | sobrescrito |
| `super.totalAPagar`, no cartão | `Pagamento.prototype` | começou um elo acima |

---

## Pense

:::question
Uma versão curta das classes do E16, sem campos `#`. Sem rodar, o que aparece no terminal?

```javascript
class Pagamento {
  constructor(tipo) { this.tipo = tipo; }
  totalAPagar(valor) { return valor; }
}
class PagamentoPix extends Pagamento {
  constructor() { super('pix'); }
  totalAPagar(valor) { return valor * 0.95; }
}

const pix = new PagamentoPix();
console.log(Object.keys(pix));
console.log(Object.hasOwn(pix, 'totalAPagar'));
console.log(Object.getPrototypeOf(pix) === Pagamento.prototype);
console.log(pix instanceof Pagamento);
```
:::

:::tip Resposta
`['tipo']`, `false`, `false` e `true`. O `tipo` foi atribuído com `this` no constructor da mãe, então mora no objeto. O `totalAPagar` não é do objeto: está em `PagamentoPix.prototype`. Esse é o protótipo direto do `pix`; `Pagamento.prototype` vem um elo acima. E é por estar na cadeia que o `instanceof` responde `true`.
:::

---

## instanceof

Um Pix é um pagamento? E uma cópia do Pix, ainda é?

---

## :icon[search-check] instanceof percorre a cadeia

O **`instanceof`** (é instância de) pergunta: "este objeto é da família desta classe?". Para responder, ele sobe os cadernos da família procurando um nome.

`x instanceof Classe` sobe a cadeia de `x` procurando `Classe.prototype`. Achou em qualquer elo: `true`. Chegou a `null` sem achar: `false`.

```javascript
const pix = new PagamentoPix();
pix instanceof Pagamento; // true: Pagamento.prototype está na cadeia do pix
```

A resposta não depende do `name` nem de nenhum dado do objeto: só dos elos da cadeia.

---

## :icon[search-check] instanceof na prática

| Expressão | Resultado | Por quê |
|---|---|---|
| `pix instanceof PagamentoPix` | `true` | é o primeiro elo |
| `pix instanceof Pagamento` | `true` | é o segundo elo |
| `pix instanceof Object` | `true` | a cadeia passa por `Object.prototype` |
| `pix instanceof PagamentoCartao` | `false` | outro ramo da família |
| `{ ...pix } instanceof Pagamento` | `false` | a cópia é um objeto literal |

Na aula 34, o `instanceof` separa os seus erros dos bugs: `erro instanceof ErroDeNegocio` vale para toda a família de erros da Lojinha.

---

## Cópias e JSON

A xerox da sua ficha leva junto o caderno de receitas da família?

---

## :icon[unlink] Cópias e JSON perdem a cadeia

O spread do E11 tira uma cópia do objeto, como uma xerox da ficha. O `JSON.stringify` do E02 transforma o objeto em texto. Os dois levam só as propriedades **próprias**: o que mora no protótipo, e o elo com ele, fica para trás.

```javascript
const fone = Produto.deJSON(produtos[0]);
const copia = { ...fone };
copia.nome;               // 'Fone Bluetooth': os dados vieram
copia.precoFormatado;     // undefined: o getter ficou em Produto.prototype
copia instanceof Produto; // false: o protótipo da cópia é Object.prototype
```

É a cópia rasa do E11 com mais um detalhe: ela copia só o que é **do próprio** objeto, e campos `#` também ficam de fora.

---

## :icon[arrow-left-right] Cópias e JSON na prática

**Guardar e recuperar um produto.** O texto leva só os dados; a fábrica `deJSON` do E15 devolve o produto à família:

```javascript
const texto = JSON.stringify(fone);                // só os dados viram texto
const deVolta = Produto.deJSON(JSON.parse(texto)); // a fábrica do E15 refaz a ligação
deVolta.precoFormatado;   // 'R$ 199,90'
deVolta instanceof Produto; // true: de volta à família
```

Por isso vale a regra do E15:

| Para | Use |
|---|---|
| guardar | os dados (`paraJSON`) |
| calcular | a classe, com os métodos |
| mudar | uma instância nova (`comStatus`), nunca `{ ...this }` |

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `fone.deJSON is not a function` | o estático foi chamado pela instância | chamar pela classe: `Produto.deJSON(dados)` |
| `copia.precoPara is not a function` | a cópia com spread perdeu o protótipo | usar o original, ou recriar com `Produto.deJSON` |
| `cannot be invoked without 'new'` | a classe foi chamada sem `new` | `new Produto(...)` |
| `Cannot set properties of undefined` | uma função antiga, como `ProdutoAntigo`, foi chamada sem `new` | pôr o `new` antes |

As quatro começam com `TypeError`: o valor existe, mas não é do tipo que o código esperava.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Procurar um método com `Object.keys` ou `Object.hasOwn` e concluir que ele não existe: ele pode estar num elo acima
- Esperar que o spread ou o JSON levem métodos e getters: só os dados viajam; recrie com `Produto.deJSON`
- Chamar um estático pela instância, como `fone.deJSON(dados)`: ele mora na função `Produto`, fora da cadeia
- Achar que `extends` copia os métodos da mãe para a filha: ele só liga os protótipos, e a busca sobe
- Pôr métodos novos em `Array.prototype` ou `Object.prototype`: muda todos os arrays do programa e das bibliotecas. Escreva uma função em `src/utils/`
:::

---

## Resumo

:::summary
- Todo objeto tem um protótipo; ler uma propriedade que ele não tem sobe a cadeia até achar ou chegar a `null`
- `class` cria uma função e um `prototype`: dados na instância, métodos e getters no protótipo, estáticos na função
- `extends` liga o protótipo da filha ao da mãe; sobrescrever é ser achado antes, e `super.metodo()` começa a busca um elo acima
- `instanceof` pergunta se o `prototype` da classe está em algum elo da cadeia do objeto
- Spread e JSON copiam só os dados próprios: a cópia perde a cadeia e os métodos
:::

---

## :icon[arrow-right] Próximos passos

Na aula 34, uma família nova nasce com `extends Error`: os erros próprios da Lojinha.

- :icon[octagon-alert] lançar e capturar erros com `throw`, `try`, `catch` e `finally`
- :icon[file-code] criar `ErroDeNegocio` e três filhos em `src/modelos/erros.js`
- :icon[search-check] separar o erro esperado do bug com o `instanceof` de hoje
