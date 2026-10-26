---
title: Referência, cópia e protótipos
summary: Valor e referência, cópias rasas e profundas, Object.freeze, protótipos e por que o React compara referências.
module: linguagem-js
duration_minutes: 40
objectives:
  - Diferenciar valor de referência ao copiar, comparar e passar dados do app
  - Escolher entre cópia rasa e profunda e proteger dados com Object.freeze
  - Explicar a cadeia de protótipos e o que uma classe cria por baixo dos panos
  - Relacionar a comparação por referência do React com estado, memo e useEffect
---

# Referência, cópia e protótipos

Programador Mobile: Módulo Específico · Encontro E36 · Aula 53 de 71

---

## O que você vai aprender

:::goal
- Saber o que a atribuição copia: o **valor** de um número ou a **referência** de um objeto
- Prever o que `===` responde e o que uma função faz com o objeto que recebe
- Escolher entre cópia rasa, cópia nível por nível e `Object.freeze`
- Seguir a cadeia de protótipos e ver o que uma `class` cria por baixo dos panos
- Explicar onde o React compara referências: no estado, no `memo` e no `useEffect`
:::

---

## O 2 que aparece do nada

Um colega escreveu o botão **+** do Carrinho assim:

```jsx
function aumentar(id) {
  const item = itens.find((i) => i.id === id);
  item.qtd = item.qtd + 1; // muda o objeto que já está no estado
  setItens(itens);         // entrega o mesmo array
}
```

Você toca no **+** do fone: a quantidade continua 1. Depois, troca o tema do app e, de repente, a linha mostra 2. Ninguém tocou de novo.

No E34 você viu que o React precisa de um array novo. Hoje você vê o porquê, por dentro da linguagem.

:::question
Se o objeto mudou na hora do toque, por que a tela só mostrou o 2 depois?
:::

---

## :icon[link] Valor e referência

Números, textos e booleanos são **primitivos**: a atribuição copia o **valor**. Objetos e arrays ficam guardados à parte, e a variável guarda uma **referência**, o endereço deles. Atribuir copia o endereço, não o objeto.

```javascript
let frete = 15;
let freteComCupom = frete;
freteComCupom = 0;
console.log(frete);    // 15: o número foi copiado

const item = { nome: 'Fone Bluetooth', qtd: 1 };
const noPedido = item;
noPedido.qtd = 3;
console.log(item.qtd); // 3: as duas variáveis apontam o mesmo objeto
```

---

## :icon[link] Duas etiquetas, uma caixa

:::center
![Animação: freteComCupom recebe uma cópia do 15 e vira 0 sem mudar frete; a etiqueta noPedido é colada na mesma caixa de item, e noPedido.qtd = 3 muda a qtd que item também enxerga](images/e36-duas-etiquetas.svg)
:::

Pense em etiquetas: `item` e `noPedido` são duas etiquetas coladas na mesma caixa. O `const` trava a etiqueta, não a caixa: ele impede trocar a referência, mas deixa mudar o que está dentro.

---

## :icon[equal-not] `===` compara endereços

Com objetos, `===` não olha o conteúdo: ele pergunta se é **o mesmo** objeto.

```javascript
const a = { id: 7 };
const b = { id: 7 };
const c = a;
a === b; // false: iguais por dentro, dois endereços
a === c; // true: o mesmo objeto

const itens = [{ id: 7, qtd: 1 }];
itens.includes({ id: 7, qtd: 1 }); // false: procura este endereço
itens.some((i) => i.id === 7);     // true: compara pelo id
```

Por isso o carrinho procura um item pelo `id`, nunca pelo objeto inteiro. Com primitivos, `===` compara o valor: `7 === 7` é `true`, e `7 === '7'` é `false`, como no parâmetro de rota do E16.

---

## :icon[square-function] A função recebe o mesmo objeto

Passar um objeto para uma função passa a referência. Se a função escreve no parâmetro, altera o dado de quem a chamou:

```javascript
function aplicarCupom(pedido) {
  pedido.desconto = 20; // altera o pedido de quem chamou
  return pedido;
}

const pedido = { subtotal: 200, desconto: 0 };
const comCupom = aplicarCupom(pedido);
console.log(pedido.desconto);     // 20: o original mudou
console.log(comCupom === pedido); // true: nem é outro objeto
```

Esse **efeito colateral** fica escondido: quem lê `aplicarCupom(pedido)` não imagina que o pedido mudou. As regras de `src/regras/` fazem o contrário e devolvem um objeto novo:

```javascript
function aplicarCupom(pedido) {
  return { ...pedido, desconto: 20 }; // o original fica intacto
}
```

---

## :icon[copy] Cópia rasa: o que fica compartilhado

Spread, `slice` e `Object.assign` criam um objeto ou array **novo**, mas copiam só o primeiro nível. Tudo o que está dentro continua sendo a mesma caixa:

```javascript
const pedido = {
  id: 101,
  itens: [{ id: 1, nome: 'Fone Bluetooth', qtd: 1 }],
  entrega: { cep: '01310-100', prazo: 5 },
};
const copia = { ...pedido };

copia === pedido;                 // false: o objeto de fora é novo
copia.entrega === pedido.entrega; // true: a entrega é a mesma
copia.itens === pedido.itens;     // true: os itens também
```

| Cópia rasa de | Formas |
|---|---|
| Array | `[...lista]`, `lista.slice()` |
| Objeto | `{ ...objeto }`, `Object.assign({}, objeto)` |

Mudar `copia.id` não afeta o pedido. Mudar `copia.entrega.prazo` afeta os dois.

---

## Pense

:::question
Sem rodar, o que aparece no console?

```javascript
function comFreteGratis(pedido) {
  const novo = { ...pedido };
  novo.entrega.valor = 0;
  return novo;
}

const pedido = { id: 101, entrega: { cep: '01310-100', valor: 15 } };
const gratis = comFreteGratis(pedido);
console.log(gratis === pedido, gratis.entrega === pedido.entrega, pedido.entrega.valor);
```
:::

:::tip Resposta
`false true 0`. O spread criou um objeto de fora novo, então `gratis === pedido` é `false`. Mas `entrega` foi copiada como referência: os dois apontam a mesma entrega, e zerar o valor por um zera pelo outro. A função parece pura e não é. A versão certa copia também o nível de dentro: `{ ...pedido, entrega: { ...pedido.entrega, valor: 0 } }`.
:::

---

## :icon[layers] Cópia profunda: três caminhos

Uma **cópia profunda** não compartilha nada com o original. Há três jeitos, com custos diferentes:

| Caminho | O que copia | Cuidado |
|---|---|---|
| Nível por nível com spread | só o caminho até o que muda | é o padrão do app: o resto é reaproveitado |
| `structuredClone(objeto)` | todos os níveis | recurso do navegador e do Node: confira antes de usar no app |
| `JSON.parse(JSON.stringify(objeto))` | todos os níveis | datas viram texto; funções, `undefined` e classes somem |

```javascript
const atualizado = { ...pedido, entrega: { ...pedido.entrega, prazo: 2 } };
atualizado.itens === pedido.itens; // true: os itens não mudaram e foram reaproveitados
```

Reaproveitar o que não mudou não é preguiça: economiza memória e, como você vê no fim da aula, deixa o React redesenhar só o que mudou.

---

## :icon[snowflake] Object.freeze: proibido mexer

`Object.freeze` trava um objeto: nada entra, sai ou muda. Num módulo, como os arquivos do app, os `.mjs` e os testes, a tentativa lança `TypeError`. Fora de módulo, a atribuição falha em silêncio. Nos dois casos, o objeto não muda.

```javascript
const STATUS = Object.freeze(['pendente', 'pago', 'enviado', 'entregue', 'cancelado']);
STATUS.push('extraviado'); // TypeError: Cannot add property 5, object is not extensible
```

Nos testes, congele a entrada para provar que a regra não mexe nela:

```javascript
test('adicionarItem não altera a lista recebida', () => {
  const itens = Object.freeze([{ id: 1, nome: 'Fone Bluetooth', preco: 199.9, qtd: 1 }]);
  const novos = adicionarItem(itens, { id: 5, nome: 'Garrafa Térmica', preco: 79.9 });
  expect(novos).toHaveLength(2); // um push dentro da regra quebraria aqui
});
```

O congelamento é **raso**: `Object.freeze(itens)` trava o array, não os itens. `itens[0].qtd = 3` continua funcionando.

---

## :icon[list-tree] Protótipos e a cadeia

Você nunca escreveu um `map` dentro do seu array, e mesmo assim `itens.map` existe. Todo objeto tem um elo escondido para outro objeto: o seu **protótipo**. Se a propriedade não está no objeto, o JavaScript procura no protótipo, depois no protótipo dele, até chegar a `null`.

```javascript
const itens = [{ id: 1, qtd: 1 }];
itens.hasOwnProperty('map');                                 // false: não é do array
Object.getPrototypeOf(itens) === Array.prototype;            // true: está aqui
Object.getPrototypeOf(Array.prototype) === Object.prototype; // true
Object.getPrototypeOf(Object.prototype);                     // null: fim da cadeia
itens.desconto;                                              // undefined: ninguém tem
```

:::center
![Diagrama: a cadeia de itens vai do próprio array para Array.prototype, com map, filter e push, depois para Object.prototype, com hasOwnProperty e toString, e termina em null; itens.map é achado em Array.prototype e itens.desconto chega a null e dá undefined](images/e36-cadeia-prototipos.svg)
:::

Os métodos existem uma vez só, no protótipo, e servem a todos os arrays do app.

---

## :icon[blocks] Classes por baixo dos panos

`class` é um jeito mais claro de escrever o que o JavaScript já fazia com funções e protótipos. Numa versão curta do `Produto` do E30:

```javascript
class Produto {
  constructor({ id, nome, preco }) {
    this.id = id;
    this.nome = nome;
    this.preco = preco;
  }
  get precoFormatado() {
    return formatarPreco(this.preco);
  }
}
const tenis = new Produto({ id: 7, nome: 'Tênis de Corrida', preco: 349.9 });
```

| Expressão | Resultado |
|---|---|
| `typeof Produto` | `'function'` |
| `Object.keys(tenis)` | `['id', 'nome', 'preco']` |
| `Object.getPrototypeOf(tenis) === Produto.prototype` | `true` |
| `tenis instanceof Produto` | `true`: `Produto.prototype` está na cadeia |

Os dados do `constructor` ficam **no objeto**. Métodos e getters ficam **no protótipo**, compartilhados por todas as instâncias.

---

## :icon[unlink] Copiar uma instância perde a classe

O spread copia só as propriedades **do próprio objeto**. O que mora no protótipo fica para trás:

```javascript
const copia = { ...tenis };
copia.nome;               // 'Tênis de Corrida': os dados vieram
copia.precoFormatado;     // undefined: o getter ficou no protótipo
copia instanceof Produto; // false: virou um objeto simples

JSON.stringify(tenis);    // '{"id":7,"nome":"Tênis de Corrida","preco":349.9}'
```

O mesmo vale para o JSON: só os dados viajam. Por isso a regra do E30 continua valendo: no estado do React ficam **objetos simples**, e a classe calcula e valida. Para usar os getters de novo, recrie a instância com `Produto.deJSON(dados)`.

---

## :icon[refresh-cw] Por que o React compara referências

Quando você chama `setItens(novo)`, o React compara o valor novo com o atual usando **`Object.is`**, que para objetos funciona como o `===`. Se for o mesmo, ele ignora a atualização e não redesenha.

```javascript
Object.is(itens, itens);      // true: para o React, nada mudou
Object.is(itens, [...itens]); // false: array novo, a tela redesenha
```

- Comparar endereços é instantâneo; comparar o conteúdo de cada item a cada toque custaria caro
- O React não olha dentro do objeto: mudar por dentro e entregar a mesma referência é invisível para ele

O 2 do começo: o toque mudou o objeto, mas o `setItens(itens)` foi ignorado. Ao trocar o tema, outra atualização redesenhou o Carrinho, que leu o objeto já alterado. A correção: `setItens(itens.map((i) => (i.id === id ? { ...i, qtd: i.qtd + 1 } : i)))`.

---

## :icon[gauge] Três lugares onde o React compara

A mesma pergunta, "é o mesmo objeto?", aparece em três lugares:

```jsx
// 1. estado: referência igual, atualização ignorada
setItens(novosItens);

// 2. memo: o cartão só redesenha se alguma prop mudar de referência
export default memo(CartaoProduto);
<CartaoProduto produto={item} />        // mesmo objeto: não redesenha
<CartaoProduto produto={{ ...item }} /> // objeto novo a cada vez: sempre redesenha

// 3. useEffect: roda de novo quando uma dependência muda de referência
useEffect(() => { console.log('filtros mudaram'); }, [filtros]);
```

Agora o `map` que devolve `i` para os itens que não mudaram faz sentido: eles mantêm a referência, e com `memo` só o cartão alterado redesenha.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Achar que `const` impede mudar o objeto: ele só impede trocar a referência
- Copiar com spread e alterar um nível de dentro: o original muda junto
- Procurar um objeto com `includes` ou `indexOf`: compare pelo `id`
- Confiar em `Object.freeze` para proteger o que está aninhado: o congelamento é raso
- Espalhar uma instância de classe (`{ ...tenis }`) e esperar os getters
- Mudar o estado por dentro e chamar o `set` com a mesma referência: a tela não muda, ou muda na hora errada
:::

---

## Resumo

:::summary
- Primitivos são copiados por valor; objetos e arrays, por referência
- `===` em objetos pergunta se é o mesmo objeto, e uma função que escreve no parâmetro muda o dado de quem chamou
- Spread faz cópia rasa; para mudar algo aninhado, copie nível por nível e reaproveite o resto
- `Object.freeze` trava o primeiro nível e ajuda a provar nos testes que uma regra é pura
- Métodos moram no protótipo; uma classe é uma função com protótipo, e o spread de uma instância perde os métodos
- O React compara com `Object.is` no estado, no `memo` e no `useEffect`: para mudar a tela, entregue um objeto novo
:::

---

## :icon[arrow-right] Próximos passos

Você sabe por que o React precisa de objetos novos. Na aula 54, as duas coleções que faltam:

- :icon[fingerprint] `Set`, que guarda valores sem repetição, como os ids dos favoritos
- :icon[key-round] `Map`, que acha um produto pelo id sem percorrer a lista
- :icon[heart] os favoritos num contexto próprio, e por que um `Set` no estado precisa ser recriado a cada toque
