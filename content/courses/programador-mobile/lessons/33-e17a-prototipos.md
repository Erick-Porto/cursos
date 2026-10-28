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

`Object.keys` lista só dados. O `console.log(fone)` também. Nem `precoPara`, nem `precoFormatado`, nem `toString` aparecem, e mesmo assim os três funcionam.

:::question
Se os métodos não estão no `fone`, onde o JavaScript os encontra?
:::

---

## :icon[link-2] O protótipo: um elo escondido

Todo objeto tem um elo escondido para outro objeto: o seu **protótipo**. Quando você lê uma propriedade que o objeto não tem, o JavaScript procura no protótipo.

```javascript
const item = { nome: 'Fone Bluetooth', qtd: 1 }; // objeto literal, como no E08

Object.getPrototypeOf(item) === Object.prototype; // true: o elo
Object.hasOwn(item, 'nome');      // true: é do próprio objeto
Object.hasOwn(item, 'toString');  // false: não é dele...
item.toString();                  // '[object Object]': ...veio do protótipo
```

- **`Object.getPrototypeOf(obj)`** devolve o protótipo de `obj`
- **`Object.hasOwn(obj, 'x')`** responde se `x` é uma propriedade **própria** de `obj`
- `Object.prototype` é o protótipo de todo objeto literal: é lá que mora o `toString`

---

## :icon[list-tree] A cadeia de um array

O protótipo também tem protótipo. A sequência de elos é a **cadeia de protótipos**, e ela termina em `null`.

```javascript
const itens = [{ id: 1, qtd: 1 }];

Object.hasOwn(itens, 'map');                                 // false: não é do array
Object.getPrototypeOf(itens) === Array.prototype;            // true: está aqui
Object.getPrototypeOf(Array.prototype) === Object.prototype; // true
Object.getPrototypeOf(Object.prototype);                     // null: fim da cadeia
itens.desconto;                                              // undefined: ninguém tem
```

O `map`, o `filter` e o `push` do E08 e do E09 moram em `Array.prototype`. Eles existem **uma vez só** e servem a todos os arrays do programa: `[1].map === [2].map` é `true`.

---

## :icon[arrow-up] A busca sobe até null

:::center
![Diagrama: a cadeia de itens vai do próprio array para Array.prototype, com map, filter e push, depois para Object.prototype, com hasOwnProperty e toString, e termina em null; itens.map é achado em Array.prototype e itens.desconto chega a null e dá undefined](images/e17-cadeia-prototipos.svg)
:::

:::steps
1. Procura no próprio objeto
2. Não achou: sobe para o protótipo e procura lá
3. Repete até achar ou chegar a `null`; em `null`, a resposta é `undefined`
:::

---

## :icon[blocks] O que a class cria por baixo

`class Produto` cria duas coisas: uma **função**, a que o `new` chama, e o objeto **`Produto.prototype`**, onde ficam os métodos e os getters.

```javascript
typeof Produto;                                     // 'function'
Object.hasOwn(Produto.prototype, 'precoPara');      // true: o método mora aqui
Object.hasOwn(Produto.prototype, 'precoFormatado'); // true: o getter também
Object.getPrototypeOf(fone) === Produto.prototype;  // true: o passo 2 do new, no E15
```

| Onde mora | O quê | Exemplo |
|---|---|---|
| na instância | o que o `constructor` atribui com `this` | `fone.nome` |
| em `Produto.prototype` | métodos e getters | `fone.precoPara(2)` |
| na função `Produto` | os estáticos | `Produto.deJSON(dados)` |

Por isso `fone.deJSON` é `undefined`: o estático não está na cadeia do `fone`.

---

## :icon[history] Antes do class: função e prototype

A palavra `class` chegou ao JavaScript em 2015. Antes, escrevia-se o mesmo mecanismo à mão, e você ainda encontra esse jeito em código antigo:

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

A `class` faz o mesmo com menos chance de erro: junta tudo num bloco e proíbe chamar sem `new`. Por isso se diz que ela é **açúcar sintático**: um jeito mais claro de escrever o que a linguagem já fazia.

---

## :icon[users] Um método para todas as instâncias

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

## :icon[git-fork] extends liga dois protótipos

:::center
![Diagrama: a cadeia de boleto vai do objeto para PagamentoBoleto.prototype, que só tem vencimento, depois pelo elo criado pelo extends até Pagamento.prototype, com totalAPagar e descricao, e por fim Object.prototype e null; a busca por boleto.totalAPagar não acha nada nos dois primeiros elos e para no terceiro](images/e17-cadeia-pagamento.svg)
:::

`class PagamentoBoleto extends Pagamento` faz o protótipo da filha apontar para o da mãe: a cadeia ganha um elo. O boleto não declara `totalAPagar`, então a busca passa por `PagamentoBoleto.prototype` e acha o método em `Pagamento.prototype`. É o "o JavaScript sobe até `Pagamento`" do E16, agora com nome: **herdar** é achar o método num elo mais acima.

---

## :icon[arrow-up-down] Sobrescrever e super

**Sobrescrever** é pôr um método com o mesmo nome num elo mais perto do objeto, como o `toString` do `Produto` esconde o de `Object.prototype`. No Pix, a busca acha `totalAPagar` em `PagamentoPix.prototype` e para ali: o da mãe nem é visitado.

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

## :icon[search-check] instanceof percorre a cadeia

`x instanceof Classe` sobe a cadeia de `x` procurando `Classe.prototype`. Achou em qualquer elo: `true`.

| Expressão | Resultado | Por quê |
|---|---|---|
| `pix instanceof PagamentoPix` | `true` | é o primeiro elo |
| `pix instanceof Pagamento` | `true` | é o segundo elo |
| `pix instanceof Object` | `true` | a cadeia passa por `Object.prototype` |
| `pix instanceof PagamentoCartao` | `false` | outro ramo da família |
| `{ ...pix } instanceof Pagamento` | `false` | a cópia é um objeto literal |

Na aula 34, é assim que você separa os seus erros dos bugs: `erro instanceof ErroDeNegocio` vale para toda a família de erros da Lojinha.

---

## :icon[unlink] Cópias e JSON perdem a cadeia

O spread e o `JSON.stringify` levam só as propriedades **próprias** do objeto. O que mora no protótipo fica para trás:

```javascript
const fone = Produto.deJSON(produtos[0]);
const copia = { ...fone };
copia.nome;               // 'Fone Bluetooth': os dados vieram
copia.precoFormatado;     // undefined: o getter ficou em Produto.prototype
copia instanceof Produto; // false: o protótipo da cópia é Object.prototype

const texto = JSON.stringify(fone);                // só os dados viram texto
const deVolta = Produto.deJSON(JSON.parse(texto)); // a fábrica do E15 refaz a ligação
deVolta.precoFormatado;   // 'R$ 199,90'
```

É a cópia rasa do E11 com mais um detalhe: ela copia só o que é **do próprio** objeto, e campos `#` também ficam de fora. Por isso vale a regra do E15: para guardar, dados (`paraJSON`); para calcular, a classe; para mudar, uma instância nova (`comStatus`), nunca `{ ...this }`.

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
