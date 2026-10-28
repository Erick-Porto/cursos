---
title: Referência e cópia
summary: Valor e referência, cópias rasas e profundas com structuredClone e Object.freeze para provar que uma regra é pura.
module: linguagem-js
duration_minutes: 40
objectives:
  - Diferenciar valor de referência ao copiar, comparar e passar dados
  - Escolher entre cópia rasa, cópia nível por nível e structuredClone
  - Proteger dados com Object.freeze e usá-lo para testar regras puras
  - Explicar por que as regras devolvem objetos novos em vez de alterar os recebidos
---

# Referência e cópia

Programador Mobile · Encontro E11 · Aula 22 de 89

---

## O que você vai aprender

:::goal
- Saber o que a atribuição copia: o **valor** de um número ou a **referência** de um objeto
- Prever o que `===` responde e o que uma função faz com o objeto que recebe
- Escolher entre cópia rasa, cópia nível por nível e `structuredClone`
- Travar dados com `Object.freeze` e usá-lo nos testes das regras
- Entender por que as regras devolvem objetos novos, e por que o React vai agradecer no E23
:::

---

## A simulação que mudou o catálogo

Para testar uma vitrine de promoção, um colega escreveu um script que destaca os produtos de áudio:

```javascript
import { produtos } from '../data/produtos.js';

function destacarCategoria(lista, categoria) {
  for (const produto of lista) {
    if (produto.categoria === categoria) {
      produto.destaque = true;
    }
  }
  return lista;
}

const simulacao = destacarCategoria(produtos, 'audio');
console.log(simulacao.filter((p) => p.destaque).length); // 6
console.log(produtos.filter((p) => p.destaque).length);  // 6: eram 4
```

O catálogo tem 4 destaques. A função devolveu a "simulação", mas o original também ficou com 6.

:::question
Se a função devolveu uma lista, por que o catálogo original mudou?
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
![Animação: freteComCupom recebe uma cópia do 15 e vira 0 sem mudar frete; a etiqueta noPedido é colada na mesma caixa de item, e noPedido.qtd = 3 muda a qtd que item também enxerga](images/e11-duas-etiquetas.svg)
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

Por isso o `adicionarItem` procura o item pelo `id`, nunca pelo objeto inteiro. Com primitivos, `===` compara o valor: `7 === 7` é `true`, e `7 === '7'` é `false`, como no texto que chega do terminal pelo `process.argv`.

---

## :icon[square-function] A função recebe o mesmo objeto

Passar um objeto ou array para uma função passa a referência. É a resposta da simulação: `lista` e `produtos` são o mesmo array, e cada `produto` é o mesmo objeto do catálogo.

```javascript
const simulacao = destacarCategoria(produtos, 'audio');
simulacao === produtos; // true: nem é outro array
```

Esse **efeito colateral** fica escondido: quem lê `destacarCategoria(produtos, 'audio')` não imagina que o catálogo mudou. E, como o módulo roda uma vez, todo arquivo que importa `produtos` vê a mudança. As regras de `src/regras/` fazem o contrário e devolvem dados novos:

```javascript
function destacarCategoria(lista, categoria) {
  return lista.map((p) => (p.categoria === categoria ? { ...p, destaque: true } : p));
}
```

---

## :icon[copy] Cópia rasa: o que fica compartilhado

No E09, você viu que spread, `slice` e `Object.assign` criam um objeto ou array **novo**, mas copiam só o primeiro nível. Tudo o que está dentro continua sendo a mesma caixa:

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

Para mudar algo aninhado sem tocar no original, há três caminhos. Os dois últimos fazem uma **cópia profunda**, que não compartilha nada com o original:

| Caminho | O que copia | Cuidado |
|---|---|---|
| Nível por nível com spread | só o caminho até o que muda | é o padrão das regras: o resto é reaproveitado |
| `structuredClone(objeto)` | todos os níveis | existe no Node e nos navegadores; no app, confira antes |
| `JSON.parse(JSON.stringify(objeto))` | todos os níveis | datas viram texto; funções e `undefined` somem |

```javascript
const atualizado = { ...pedido, entrega: { ...pedido.entrega, prazo: 2 } };
atualizado.itens === pedido.itens; // true: os itens não mudaram e foram reaproveitados
```

Reaproveitar o que não mudou não é preguiça: economiza memória e, no React (E23), deixa a tela redesenhar só o que mudou.

---

## :icon[layers] structuredClone e JSON de perto

```javascript
const pedido = {
  id: 101,
  criadoEm: new Date('2026-10-28T14:30:00'),
  entrega: { cep: '01310-100', prazo: 5 },
};

const clone = structuredClone(pedido);
clone.entrega === pedido.entrega; // false: tudo é novo
clone.criadoEm instanceof Date;   // true: a data continua data

const viaJson = JSON.parse(JSON.stringify(pedido));
typeof viaJson.criadoEm;          // 'string': virou texto, em UTC
```

- `structuredClone` copia objetos, arrays, datas e também o `Map` e o `Set`, que você conhece no E12
- Funções ele não copia: um objeto com método, como a `promocao` da aula anterior, lança `DataCloneError`
- O JSON de ida e volta também perde funções e `undefined`, só que em silêncio

---

## :icon[snowflake] Object.freeze: proibido mexer

`Object.freeze` trava um objeto: nada entra, sai ou muda. Num módulo, como os arquivos do `lojinha-regras` e os testes, a tentativa lança `TypeError`. No REPL do Node, que não é módulo, a atribuição falha em silêncio. Nos dois casos, o objeto não muda.

```javascript
const promocao = Object.freeze({ nome: 'Semana do Áudio', percentual: 10 });
promocao.percentual = 50;
// TypeError: Cannot assign to read only property 'percentual' of object

const FORMAS_DE_PAGAMENTO = Object.freeze(['pix', 'cartao', 'boleto']);
FORMAS_DE_PAGAMENTO.push('cheque');
// TypeError: Cannot add property 3, object is not extensible
```

O `const` trava a etiqueta; o `Object.freeze` trava a caixa.

---

## :icon[test-tube] Congele a entrada nos testes

Uma regra pura não mexe no que recebe. Congele a entrada no teste: se a regra tentar alterá-la, o teste fica vermelho na hora.

```javascript
// src/regras/carrinho.test.js
test('adicionarItem não altera a lista recebida', () => {
  const itens = Object.freeze([{ id: 1, nome: 'Fone Bluetooth', preco: 199.9, qtd: 1 }]);
  const novos = adicionarItem(itens, { id: 5, nome: 'Garrafa Térmica', preco: 79.9 });
  expect(novos).toHaveLength(2);
});
```

Se alguém trocar o fim do `adicionarItem` por `itens.push(...)`, o teste acusa: `TypeError: Cannot add property 1, object is not extensible`. O congelamento transforma um bug silencioso num teste vermelho.

---

## :icon[snowflake] O congelamento é raso

`Object.freeze(itens)` trava o array, não os itens: `itens[0].qtd = 3` continua funcionando. Para travar todos os níveis, use a recursão do E10:

```javascript
// src/utils/congelar.js
export function congelarTudo(valor) {
  if (typeof valor !== 'object' || valor === null) {
    return valor; // caso base: número, texto, null...
  }
  for (const dentro of Object.values(valor)) {
    congelarTudo(dentro); // congela cada nível de dentro
  }
  return Object.freeze(valor);
}
```

`Object.values` também funciona em arrays: devolve os itens. Com `congelarTudo(itens)`, `itens[0].qtd = 3` lança `TypeError`.

---

## :icon[refresh-cw] Prévia do E23: o React compara referências

No E23, a tela do React guarda dados num **estado**. Quando você entrega um valor novo, o React pergunta se é **o mesmo** objeto com `Object.is`, que para objetos funciona como o `===`:

```javascript
Object.is(itens, itens);      // true: para o React, nada mudou
Object.is(itens, [...itens]); // false: array novo, a tela redesenha
```

- Comparar endereços é instantâneo; comparar o conteúdo de cada item a cada mudança custaria caro
- Alterar por dentro e entregar o mesmo array é invisível para o React: a tela não muda
- Por isso as regras do `lojinha-regras` devolvem arrays e objetos novos: no E30, elas vão direto para o estado do app

---

## :icon[triangle-alert] Erros comuns

:::warning
- Achar que `const` impede mudar o objeto: ele só impede trocar a referência
- Escrever no parâmetro de uma função: o objeto de quem chamou muda junto
- Copiar com spread e alterar um nível de dentro: o original muda junto
- Procurar um objeto com `includes` ou `indexOf`: compare pelo `id`
- Usar `structuredClone` num objeto com método, ou o JSON num objeto com datas
- Confiar em `Object.freeze` para proteger o que está aninhado: o congelamento é raso
:::

---

## Resumo

:::summary
- Primitivos são copiados por valor; objetos e arrays, por referência
- `===` em objetos pergunta se é o mesmo objeto, e uma função que escreve no parâmetro muda o dado de quem chamou
- Spread faz cópia rasa; para mudar algo aninhado, copie nível por nível e reaproveite o resto
- `structuredClone` copia todos os níveis, inclusive datas, mas não funções
- `Object.freeze` trava o primeiro nível; `congelarTudo` trava todos e prova nos testes que uma regra é pura
:::

---

## :icon[flask-conical] No laboratório

Barris, a promoção da semana e testes que provam que as regras não mexem na entrada.

:::steps
1. Barris `src/regras/index.js` e `src/utils/index.js`; os scripts importam deles
2. `src/data/promocao.js` com `export default`, `anunciar()` e `participantes(lista)`
3. `src/scripts/promocao.js`: anuncia e, 1 segundo depois, lista os preços com desconto
4. `src/utils/congelar.js` com `congelarTudo` e testes
5. Entradas congeladas nos testes de `adicionarItem`, `removerItem` e `alterarQuantidade`
6. `npm test` verde, commit "E11: módulos, barris e regras congeladas" e `git push`
:::

**Critérios de entrega**: nenhum arquivo de `regras/` importa o próprio barril; `node src/scripts/promocao.js` imprime o aviso e os preços certos; pelo menos 5 testes novos passando. Entregue o link do repositório no sistema. No E12: `Set` nos favoritos e `Map` no catálogo.
