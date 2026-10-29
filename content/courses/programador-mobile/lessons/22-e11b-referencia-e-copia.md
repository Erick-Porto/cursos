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

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **primitivo** | um valor simples, que cabe inteiro na variável: número, texto, `true` ou `false` |
| **referência** | o endereço de um objeto ou array; a variável guarda o endereço, não o objeto |
| **efeito colateral** | quando uma função muda algo de fora dela, além de devolver o resultado |
| **cópia rasa** | uma cópia só do primeiro nível; o que está dentro continua compartilhado |
| **cópia profunda** | uma cópia de todos os níveis, que não divide nada com o original |
| **congelar** | travar um objeto com `Object.freeze`: ninguém muda o que está nele |

---

## A simulação que mudou o catálogo

Para testar uma vitrine de promoção, um colega escreveu um script que destaca os produtos de áudio. A função passa por cada produto e liga o `destaque` dos que são de áudio:

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

## Valor e referência

Dois amigos têm o seu endereço. Um pinta a sua porta. O que o outro encontra?

---

## :icon[link] Valor e referência

A variável é uma caixa com etiqueta (E05). Números, textos e booleanos são **primitivos**: cabem inteiros na caixa, e a atribuição copia o **valor**. Objetos e arrays moram fora da caixa, como numa casa: a caixa guarda só o endereço, a **referência**. Atribuir copia o papel com o endereço, não a casa.

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

Dois papéis com o mesmo endereço levam à mesma casa: o que muda por um aparece pelo outro.

---

## :icon[link] Dois nomes, o mesmo objeto

:::center
![Animação: freteComCupom recebe uma cópia do 15 e vira 0 sem mudar frete; a etiqueta noPedido é colada na mesma caixa de item, e noPedido.qtd = 3 muda a qtd que item também enxerga](images/e11-duas-etiquetas.svg)
:::

Na animação, o número é copiado: `freteComCupom` vira `0`, e `frete` continua `15`. O objeto não: a etiqueta `noPedido` vai para a mesma caixa do `item`, porque as duas variáveis guardam o mesmo endereço.

O `const` não deixa trocar o endereço guardado na variável. Ele não tranca a casa: mudar o que está dentro continua permitido.

---

## :icon[equal-not] Referência na prática: o `===`

Com objetos, `===` não olha o conteúdo: ele pergunta se é **o mesmo** objeto, no mesmo endereço. Três casos:

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

## Efeito colateral

Você pede uma cópia de um documento e recebe o original rasurado. O que deu errado?

---

## :icon[square-function] A função recebe o mesmo objeto

Passar um objeto ou array para uma função passa o endereço dele. Se a função muda o que recebeu, muda o dado de quem chamou: é um **efeito colateral**. É como pedir uma cópia de um documento e receber o original rasurado.

É a resposta da simulação: `lista` e `produtos` são o mesmo array, e cada `produto` é o mesmo objeto do catálogo.

```javascript
const simulacao = destacarCategoria(produtos, 'audio');
simulacao === produtos; // true: nem é outro array
```

O efeito fica escondido: quem lê `destacarCategoria(produtos, 'audio')` não imagina que o catálogo mudou. E, como o módulo roda uma vez, todo arquivo que importa `produtos` vê a mudança.

---

## :icon[shield-check] Efeito colateral na prática

As regras de `src/regras/` fazem o contrário: devolvem dados novos e deixam o recebido como estava. A simulação, sem efeito colateral:

```javascript
function destacarCategoria(lista, categoria) {
  return lista.map((p) => (p.categoria === categoria ? { ...p, destaque: true } : p));
}
```

```javascript
const simulacao = destacarCategoria(produtos, 'audio');
console.log(simulacao.filter((p) => p.destaque).length); // 6
console.log(produtos.filter((p) => p.destaque).length);  // 4: o catálogo não mudou
```

| Parte | O que ela diz |
|---|---|
| `lista.map(...)` | "monte uma lista nova, item por item" (E09) |
| `p.categoria === categoria ? ... : p` | "é da categoria? Então a cópia; senão, o próprio produto" |
| `{ ...p, destaque: true }` | "uma cópia do produto, com o destaque ligado" |

Com o `for` que escrevia `produto.destaque = true`, as duas linhas davam `6`.

---

## Cópia rasa

A fotocópia de uma ficha com um endereço anotado leva a outra casa?

---

## :icon[copy] Cópia rasa: o que fica compartilhado

No E09, você viu que spread, `slice` e `Object.assign` criam um objeto ou array **novo**. É uma **cópia rasa**: copia só o primeiro nível. Pense numa fotocópia de uma ficha: a folha é nova, mas o endereço anotado nela leva à mesma casa.

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

---

## :icon[list-checks] Cópia rasa na prática

O que muda no original depende do nível em que você mexe:

```javascript
const pedido = { id: 101, entrega: { cep: '01310-100', prazo: 5 } };
const copia = { ...pedido };

copia.id = 102;
console.log(pedido.id);            // 101: o primeiro nível é só da cópia

copia.entrega.prazo = 2;
console.log(pedido.entrega.prazo); // 2: a entrega é a mesma nos dois
```

```javascript
const ids = [1, 5];
const outros = [...ids];
outros.push(7);
console.log(ids); // [1, 5]: só números dentro, nada compartilhado
```

- Mudar um campo de fora, como o `id`, só afeta a cópia
- Mudar algo **aninhado**, um objeto dentro de outro, afeta os dois
- Com números ou textos dentro, a cópia rasa resolve: não há endereço para dividir

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

## Cópia profunda

Como mudar a entrega na cópia sem mexer na entrega do original?

---

## :icon[layers] Cópia profunda: três caminhos

Uma **cópia profunda** copia todos os níveis: a ficha e tudo o que ela aponta. Nada fica compartilhado com o original. Para mudar algo aninhado sem tocar no original, há três caminhos:

| Caminho | O que copia | Cuidado |
|---|---|---|
| Nível por nível com spread | só o caminho até o que muda | é o padrão das regras: o resto é reaproveitado |
| `structuredClone(objeto)` | todos os níveis | existe no Node e nos navegadores; no app, confira antes |
| `JSON.parse(JSON.stringify(objeto))` | todos os níveis | datas viram texto; funções e `undefined` somem |

Os dois últimos fazem a cópia profunda. O primeiro copia só o necessário.

---

## :icon[route] Nível por nível com spread

As regras copiam só o que está no caminho até o que muda:

```javascript
const atualizado = { ...pedido, entrega: { ...pedido.entrega, prazo: 2 } };
atualizado.itens === pedido.itens; // true: os itens não mudaram e foram reaproveitados
```

- `{ ...pedido, entrega: ... }`: um pedido novo, com uma `entrega` nova no lugar da antiga
- `{ ...pedido.entrega, prazo: 2 }`: a entrega nova, com o prazo trocado
- `itens` não está no caminho: vai para o pedido novo sem cópia

Reaproveitar o que não mudou não é preguiça: economiza memória e, no React (E23), deixa a tela redesenhar só o que mudou.

---

## :icon[layers] Cópia profunda na prática

O `structuredClone` e o JSON de ida e volta, no mesmo pedido:

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

- `instanceof Date` pergunta "isto é uma data?"; o `typeof`, do E05, diz o tipo
- `structuredClone` copia objetos, arrays, datas e também o `Map` e o `Set`, que você conhece no E12
- Funções ele não copia: um objeto com método, como a `promocao` da aula 21, lança `DataCloneError`
- O JSON de ida e volta também perde funções e `undefined`, só que em silêncio

---

## Object.freeze

Por que se plastifica um documento importante?

---

## :icon[snowflake] Object.freeze: proibido mexer

`Object.freeze` (em inglês, congelar) trava um objeto: nada entra, sai ou muda. É como plastificar uma ficha: dá para ler, não dá para escrever.

```javascript
const promocao = Object.freeze({ nome: 'Semana do Áudio', percentual: 10 });
promocao.percentual = 50;
// TypeError: Cannot assign to read only property 'percentual' of object

const FORMAS_DE_PAGAMENTO = Object.freeze(['pix', 'cartao', 'boleto']);
FORMAS_DE_PAGAMENTO.push('cheque');
// TypeError: Cannot add property 3, object is not extensible
```

- Em português: "não dá para mudar `percentual`, ele é só de leitura" e "não dá para acrescentar, o objeto não aceita mais nada"
- Num módulo, como os arquivos do `lojinha-regras` e os testes, a tentativa lança `TypeError`
- No REPL do Node, que não é módulo, a atribuição falha em silêncio. Nos dois casos, o objeto não muda

O `const` não deixa trocar o endereço; o `Object.freeze` plastifica o que está nele.

---

## :icon[test-tube] Object.freeze na prática

Uma regra **pura** não mexe no que recebe: só devolve um resultado. Congele a entrada no teste: se a regra tentar alterá-la, o teste fica vermelho na hora.

```javascript
// src/regras/carrinho.test.js
test('adicionarItem não altera a lista recebida', () => {
  const itens = Object.freeze([{ id: 1, nome: 'Fone Bluetooth', preco: 199.9, qtd: 1 }]);
  const novos = adicionarItem(itens, { id: 5, nome: 'Garrafa Térmica', preco: 79.9 });
  expect(novos).toHaveLength(2);
});
```

Se alguém trocar o fim do `adicionarItem` por `itens.push(...)`, o teste acusa: `TypeError: Cannot add property 1, object is not extensible`. O congelamento pega também o `sort`, que ordena a lista no lugar:

```javascript
const lista = Object.freeze([{ nome: 'Tênis' }, { nome: 'Bola' }]);
lista.sort((a, b) => a.nome.localeCompare(b.nome));
// TypeError: Cannot assign to read only property '0' of object '[object Array]'
[...lista].sort((a, b) => a.nome.localeCompare(b.nome)); // certo: copia antes
```

---

## :icon[snowflake] O congelamento é raso

Plastificar a ficha não tranca a casa do endereço anotado nela. `Object.freeze(itens)` trava o array, não os itens: `itens[0].qtd = 3` continua funcionando. Para travar todos os níveis, use a recursão do E10:

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

## :icon[list-ordered] O congelarTudo em português

| Linha | O que ela diz |
|---|---|
| `if (typeof valor !== 'object' \|\| valor === null)` | "não é objeto nem array? Então não há o que congelar" |
| `return valor;` | o **caso base** (E10): devolve o valor como veio e para |
| `for (const dentro of Object.values(valor))` | "para cada valor guardado aqui dentro..." |
| `congelarTudo(dentro);` | "...congele esse valor e tudo o que estiver dentro dele" |
| `return Object.freeze(valor);` | "por fim, congele este nível e devolva" |

O `valor === null` está ali porque `typeof null` também responde `'object'`, uma esquisitice antiga do JavaScript.

---

## Por que copiar

Como a torcida percebe, de longe, que o placar mudou?

---

## :icon[refresh-cw] Prévia do E23: o React compara referências

No E23, a tela do React guarda dados num **estado**, como o placar de um jogo: quando muda, a tela se redesenha. Para saber se mudou, o React pergunta se é **o mesmo** objeto com `Object.is`, que para objetos funciona como o `===`:

```javascript
Object.is(itens, itens);      // true: para o React, nada mudou
Object.is(itens, [...itens]); // false: array novo, a tela redesenha
```

- Comparar endereços é instantâneo; comparar o conteúdo de cada item a cada mudança custaria caro
- Alterar por dentro e entregar o mesmo array é invisível para o React: a tela não muda
- Por isso as regras do `lojinha-regras` devolvem arrays e objetos novos: no E30, elas vão direto para o estado do app

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Cannot assign to read only property` | alguém tentou mudar um objeto congelado | se foi no teste, a regra mexe na entrada: devolva um objeto novo |
| `object is not extensible` | `push` ou campo novo num objeto ou array congelado | devolva um array novo: `[...itens, novo]` |
| `DataCloneError` | `structuredClone` num objeto com função | copie com spread, nível por nível |
| `Maximum call stack size exceeded` | `congelarTudo` sem o caso base | o `if` do `typeof` antes do `for` |

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

---

## :icon[milestone] Projeto 2 · Etapa 4: barril, dados congelados e edição

No `agenda-de-contatos`:

- `src/index.js`: o barril, com os contatos e todas as funções; os scripts passam a importar dele
- `src/data/contatos.js` congelado: cada contato e a lista, com `Object.freeze`
- `editarContato(contatos, id, mudancas)`: um objeto novo só para o contato do id, e o id não muda
- testes que rodam as regras sobre os contatos congelados: nenhuma pode quebrar

Commit: `Projeto 2: etapa 4, barril, dados congelados e edição`. Enunciado completo: página do curso, em **Projetos**.
