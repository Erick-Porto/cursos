---
title: Métodos estáticos, getters e setters
summary: Crie produtos com métodos estáticos, calcule com getters, valide com setters e mude devolvendo uma instância nova.
module: classes-e-controle
duration_minutes: 40
objectives:
  - Criar instâncias com métodos estáticos como Produto.deJSON
  - Expor valores calculados com getters e validar dados com setters
  - Mudar um objeto devolvendo uma instância nova e guardar só dados simples
  - Modelar e testar o Pedido com subtotal, total e status
---

# Métodos estáticos, getters e setters

Programador Mobile · Encontro E15 · Aula 30 de 89

---

## O que você vai aprender

:::goal
- Criar instâncias a partir de dados do JSON com **métodos estáticos**
- Calcular valores com **getters** e validar dados com **setters**
- Dar ao objeto um texto legível com `toString()`
- Mudar um pedido devolvendo uma **instância nova**, sem estragar quem guardou o antigo
- Modelar e testar o `Pedido`
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **método estático** | um método da própria classe, chamado pelo nome dela: `Produto.deJSON(...)` (*static*, fixo) |
| **getter** | um método lido como propriedade, sem parênteses, que calcula o valor na hora (*get*, pegar) |
| **setter** | um método que roda quando alguém atribui um valor e pode recusar o valor errado (*set*, definir) |
| **`throw`** | a palavra que lança um erro e para o programa ali (*throw*, lançar) |
| **dados simples** | um objeto literal só com valores, sem métodos, pronto para virar JSON |

---

## O pedido que muda no histórico

Um script da Lojinha acompanha o pedido 1042 e guarda cada versão num **histórico**: primeiro **pendente**, depois **pago**. Na conferência, as duas posições dizem "pago", e ninguém escreveu `'pago'` duas vezes.

E há mais: um status que não existe, como `'aprovado'`, precisa dar erro na hora, e não três passos depois. O preço formatado e o preço no Pix precisam sair do produto, sem `formatarPreco` repetido em cada script.

:::question
Se o pedido é uma instância de classe, como trocar o status sem estragar a versão que o histórico guardou?
:::

---

## Métodos estáticos

Na confeitaria, você pede o bolo ao balcão ou a um bolo que já está pronto?

---

## :icon[factory] Métodos estáticos: ações da classe

Um método **`static`** pertence à classe, não às instâncias: você o chama pelo nome da classe. Na forma de bolo, é o pedido feito à confeitaria ("faça um bolo com esta encomenda"), e não a um bolo pronto. Você já usa vários: `Math.round()`, `Number.isNaN()`, `JSON.parse()`, `Object.keys()`.

```javascript
export default class Produto {
  // constructor e métodos da aula 29

  static deJSON(obj) {
    if (!obj || typeof obj.preco !== 'number') {
      throw new Error('Produto inválido no JSON');
    }
    return new Produto(obj);
  }

  static listaDeJSON(lista) {
    return lista.map((obj) => Produto.deJSON(obj));
  }
}
```

---

## :icon[list-ordered] deJSON em português

| Linha | O que ela diz |
|---|---|
| `static deJSON(obj)` | "a classe sabe criar um produto a partir de dados do JSON" |
| `!obj \|\| typeof obj.preco !== 'number'` | "se não veio nada, ou se o preço não é número..." |
| `throw new Error('Produto inválido no JSON')` | "...pare aqui, com um erro claro" |
| `return new Produto(obj)` | "tudo certo: devolva a instância" |
| `lista.map((obj) => Produto.deJSON(obj))` | "passe cada item da lista pela fábrica" |

`deJSON` é uma **fábrica**, a única porta de entrada dos dados do JSON. Se o `catalogo.json` trouxer `"preco": "199,90"`, o erro aparece aqui, e não como `R$ NaN` num relatório. No E17, você aprende a tratar o erro do `throw`.

---

## :icon[factory] Métodos estáticos na prática

**Caso 1: um produto a partir dos dados.**

```javascript
const fone = Produto.deJSON(produtos[0]);
console.log(fone instanceof Produto); // true
```

**Caso 2: o catálogo inteiro de uma vez.**

```javascript
const vitrine = Produto.listaDeJSON(produtos);
console.log(vitrine.length); // 12 instâncias de Produto
```

**Caso 3: o dado errado para na porta.**

```javascript
Produto.deJSON({ nome: 'Fone', preco: '199,90' });
// Error: Produto inválido no JSON
```

Os três chamam pela classe, `Produto.`, e nunca por um produto.

---

## Getters

Na balança da feira, você aperta um botão para ver o preço?

---

## :icon[eye] Getters: calculados, mas lidos como propriedade

Um **getter** é como o visor da balança: você só olha, e o número é calculado na hora, a partir do que está no prato. É um método marcado com `get`, lido sem parênteses, como uma propriedade.

```javascript
import { formatarPreco } from '../utils/formatar.js';

export default class Produto {
  get precoFormatado() {
    return formatarPreco(this.preco);
  }

  get emDestaque() {
    return this.destaque || this.avaliacao >= 4.5;
  }
}
```

```javascript
// src/scripts/vitrine.js
if (produto.emDestaque) {
  console.log(`${produto.nome}: ${produto.precoFormatado}`);
}
```

O `emDestaque()` da aula 29 virou getter: nos scripts e nos testes, `produto.emDestaque()` passa a ser `produto.emDestaque`. No E30, as telas do app leem os mesmos getters.

---

## :icon[eye] Getters na prática

```javascript
const fone = Produto.deJSON(produtos[0]);
const garrafa = Produto.deJSON(produtos[4]);

console.log(fone.precoFormatado); // R$ 199,90
console.log(fone.emDestaque);     // true: a loja marcou
console.log(garrafa.emDestaque);  // true: não foi marcada, mas tem nota 4,5 ou mais
```

- Nenhum parêntese: getter se lê como propriedade
- Cada leitura calcula de novo, a partir dos dados de agora
- A garrafa tem `destaque: false` e mesmo assim responde `true`: o getter olha também a nota

---

## :icon[scale] Estático, getter ou método?

| Use | Quando | Exemplo |
|---|---|---|
| método estático | cria instâncias ou trabalha com várias | `Produto.deJSON(dados)` |
| getter | valor sem parâmetro, calculado dos dados | `produto.precoFormatado` |
| método | precisa de parâmetro | `produto.precoPara(3)` |
| método | cria algo novo a partir da instância | `pedido.comStatus('pago')` |

Trocar um pelo outro quebra:

- `produto.precoFormatado()` dá `TypeError: ... is not a function`: o getter já devolveu o texto, e texto não se chama
- `fone.deJSON(dados)` também dá `is not a function`: o estático mora na classe, não na instância
- `produto.precoPara` sem parênteses devolve a própria função, e não o preço

---

## Pratique

:::example Desafio
A vitrine imprime "R$ 189,90 no Pix" ao lado do preço. A conta já existe em `src/regras/precos.js`: a função `precoComPix(preco)`, do E05. Escreva o getter `precoNoPix` do `Produto` e a linha do script que o usa.
:::

:::tip Resposta
```javascript
import { precoComPix } from '../regras/precos.js';

// dentro da classe Produto
get precoNoPix() {
  return precoComPix(this.preco);
}
```

```javascript
console.log(`${formatarPreco(produto.precoNoPix)} no Pix`);
```

É getter porque não tem parâmetro e sai dos dados do produto. A classe não reescreve a regra do Pix: chama a função pura que já tem testes.
:::

---

## A classe Pedido

O que um pedido da loja precisa guardar?

---

## :icon[receipt] A classe Pedido

O segundo modelo da Lojinha, em `src/modelos/Pedido.js`, é outra forma: cada pedido da loja vira uma instância, com os itens do carrinho, o frete, o desconto e o status.

```javascript
import { contarItens, subtotal as somarItens } from '../regras/carrinho.js';

export default class Pedido {
  constructor({ id, itens = [], status = 'pendente', frete = 0, desconto = 0 }) {
    this.id = id;
    this.itens = itens;
    this.status = status;
    this.frete = frete;
    this.desconto = desconto;
  }

  get quantidade() { return contarItens(this.itens); }
  get subtotal() { return somarItens(this.itens); }
  // get total(): subtotal + frete - desconto, em centavos e nunca negativo
}
```

- Os itens têm o formato do carrinho: `{ ...produto, qtd }`
- Os getters chamam as funções de `src/regras/carrinho.js`, do E07 e do E09: a classe junta dados e regras, não as repete
- O `as` do E11 dá outro nome ao import, porque `subtotal` também é o nome do getter

---

## :icon[receipt] A classe Pedido na prática

```javascript
const pedido = new Pedido({
  id: 1042,
  itens: [{ id: 1, nome: 'Fone Bluetooth', preco: 199.9, qtd: 2 }],
  frete: 19.9,
});

console.log(pedido.status);     // pendente: o valor padrão
console.log(pedido.quantidade); // 2
console.log(pedido.subtotal);   // 399.8
console.log(pedido.total);      // 419.7: subtotal mais frete
```

Ninguém fez conta no script: o pedido calcula e responde.

---

## Setters

O que o porteiro faz quando chega alguém que não está na lista?

---

## :icon[shield-check] Setters: validar na atribuição

Um **setter** é o porteiro da propriedade: toda atribuição passa por ele, e valor que não está na lista não entra. Marcado com `set`, ele trabalha em par com um getter e guarda o valor num campo de outro nome:

```javascript
const STATUS = ['pendente', 'pago', 'enviado', 'entregue', 'cancelado'];

export default class Pedido {
  get status() {
    return this._status;
  }

  set status(valor) {
    if (!STATUS.includes(valor)) {
      throw new Error(`Status inválido: ${valor}`);
    }
    this._status = valor;
  }
}
```

- O `this.status = status` do `constructor` já passa pelo setter: `new Pedido({ status: 'aprovado' })` lança o erro na hora
- O sublinhado de `_status` é um combinado: "não mexa por fora". No E16, o campo privado `#status` vira regra da linguagem
- Dentro do setter, nunca escreva `this.status = valor`: ele chamaria a si mesmo até `Maximum call stack size exceeded`

---

## :icon[shield-check] Setters na prática

**Caso 1: um status da lista entra.**

```javascript
const pedido = new Pedido({ id: 1042, itens: [] });
pedido.status = 'pago';
console.log(pedido.status); // pago
```

**Caso 2: um status fora da lista é barrado.**

```javascript
pedido.status = 'aprovado'; // Error: Status inválido: aprovado
```

**Caso 3: o `constructor` também passa pelo porteiro.**

```javascript
new Pedido({ id: 7, status: 'enviado' }).status; // 'enviado'
new Pedido({ id: 8, status: 'aprovado' });       // Error: Status inválido: aprovado
```

---

## toString

Que texto aparece quando você imprime um objeto no meio de uma frase?

---

## :icon[text] toString: o objeto vira texto

O **`toString()`** diz como o objeto se apresenta numa frase. O JavaScript o chama sozinho quando precisa transformar o objeto em texto, como numa template string. Sem ele, o resultado não ajuda ninguém:

```javascript
console.log(`Adicionado: ${dados}`); // Adicionado: [object Object]
```

```javascript
// dentro da classe Produto
toString() {
  return `${this.nome}, ${this.precoFormatado}`;
}
```

---

## :icon[text] toString na prática

```javascript
console.log(`Adicionado: ${produto}`); // Adicionado: Fone Bluetooth, R$ 199,90
console.log(produto); // Produto { id: 1, nome: 'Fone Bluetooth', ... }
```

O log do terminal fica legível. O `Pedido` ganha o seu: `Pedido 1042, pago, R$ 419,70`. O `console.log(produto)` sem template string continua mostrando o objeto inteiro, com todos os campos.

---

## Uma instância nova

Para corrigir um contrato assinado, você rasura o original ou faz outra versão?

---

## :icon[copy] comStatus: mudar devolvendo um pedido novo

Mudar sem estragar é tirar uma cópia e mexer na cópia, sem rasurar o original. Na Lojinha, um método que "muda" faz como o `adicionarItem` do E09 com o array: **devolve um objeto novo** e deixa o original intacto.

```javascript
comStatus(novo) {
  return new Pedido({ ...this.paraJSON(), status: novo });
}

paraJSON() {
  const { id, itens, status, frete, desconto } = this;
  return { id, itens, status, frete, desconto };
}
```

- `paraJSON()` devolve os **dados simples** do pedido, no formato que o `constructor` recebe
- `{ ...this.paraJSON(), status: novo }` quer dizer "copie os dados deste pedido e troque só o status"
- O pedido novo passa pelo `constructor`, então o setter valida: `comStatus('aprovado')` lança erro
- A cópia é **rasa**, como no E11: os dois pedidos dividem o mesmo array `itens`. Por isso nenhum método do `Pedido` mexe nos itens

---

## :icon[bug] O erro: mudar o objeto que o histórico guardou

```javascript
const pedido = new Pedido(dados);
const historico = [pedido];   // guarda a versão pendente

pedido.status = 'pago';       // o setter valida e muda o MESMO objeto
historico.push(pedido);

console.log(historico.map((p) => p.status)); // [ 'pago', 'pago' ]
console.log(historico[0] === historico[1]);  // true
```

:::center
![Animação: pedido e historico[0] apontam para o mesmo Pedido 1042; pedido.status = 'pago' troca o status dentro dele; historico.push(pedido) faz historico[1] apontar para o mesmo objeto, e o histórico mostra pago duas vezes](images/e15-mesma-referencia.svg)
:::

O array não guardou uma cópia: guardou a **referência**, o endereço do objeto, como no E11. São três papéis com o mesmo endereço e uma casa só. O setter não protege você aqui: ele valida o valor, mas a mudança atinge todo mundo que guarda aquele objeto.

---

## :icon[circle-check] O certo: cada versão é um objeto

```javascript
const pendente = new Pedido(dados);
const pago = pendente.comStatus('pago'); // outro objeto
const historico = [pendente, pago];

console.log(historico.map((p) => p.status)); // [ 'pendente', 'pago' ]
console.log(pendente === pago);              // false
```

:::center
![Diagrama: historico[0] aponta para o Pedido 1042 pendente e historico[1] para outro Pedido 1042, pago, criado por comStatus; o histórico mostra pendente e pago](images/e15-objeto-novo.svg)
:::

Quem guardou o pedido pendente continua com ele, intacto. No E23, o estado do React vai comparar exatamente assim, pela referência: mudar por dentro e entregar o mesmo objeto não atualiza a tela. A regra de hoje já evita esse bug.

---

## Guardar e recriar

Para guardar a encomenda de um bolo, você guarda o bolo ou o papel?

---

## :icon[save] Guardar dados, recriar a classe

Para guardar num arquivo ou mandar pela internet, use os **dados simples** do pedido, e não a instância. É como a encomenda de um bolo: o papel guarda o pedido, e o bolo se faz de novo quando precisar.

:::steps
1. Para guardar ou enviar, use os **dados simples** do `paraJSON()`
2. Para calcular e validar, crie a instância a partir desses dados
3. Para mudar, um método devolve outra instância, e quem guardou a antiga não é afetado
:::

Criar um `Pedido` de novo é barato: ele só guarda referências e soma na hora.

---

## :icon[save] Guardar e recriar na prática

O pedido pago vai para um arquivo e volta inteiro:

```javascript
import fs from 'node:fs';

fs.writeFileSync('pedido.json', JSON.stringify(pago.paraJSON()));

const texto = fs.readFileSync('pedido.json', 'utf-8');
const lido = new Pedido(JSON.parse(texto));
console.log(`${lido}`); // Pedido 1042, pago, R$ 419,70
```

- Na ida, o `paraJSON()` entrega os dados, e o `JSON.stringify` os transforma em texto
- Na volta, o `JSON.parse` refaz os dados, e o `new Pedido` refaz a instância, com getters e setter
- O status voltou `pago`: ele estava nos dados simples

---

## Pense

:::question
Para guardar o pedido em arquivo, alguém escreveu `fs.writeFileSync('pedido.json', JSON.stringify(pago))`, sem o `paraJSON()`. Ao ler de volta com `new Pedido(JSON.parse(texto))`, o pedido **pago** voltou como **pendente**, sem nenhum erro. O que aconteceu?
:::

:::tip Resposta
O `JSON.stringify` copia só os campos guardados no próprio objeto: `id`, `itens`, `_status`, `frete` e `desconto`. O getter `status` mora na classe e fica de fora. Ao recriar, o `constructor` não encontra `status` e usa o padrão `'pendente'`. O spread `{ ...pago }` tem o mesmo problema. Use `pago.paraJSON()`: ele devolve exatamente os dados que o `constructor` espera.
:::

---

## Testar o Pedido

Como provar, num teste, que o código dá erro quando precisa dar?

---

## :icon[test-tube] Testando o Pedido

O teste confere os getters e também o erro: um status inválido **precisa** lançar.

```javascript
import Pedido from './Pedido.js';

const dados = { id: 1042, itens: [{ id: 1, nome: 'Fone Bluetooth', preco: 199.9, qtd: 2 }], frete: 19.9 };

test('soma subtotal e total', () => {
  const pedido = new Pedido(dados);
  expect(pedido.subtotal).toBe(399.8);
  expect(pedido.total).toBe(419.7);
});

test('recusa status inválido', () => {
  expect(() => new Pedido({ ...dados, status: 'aprovado' })).toThrow('Status inválido');
});
```

- Getters se testam como propriedades: `pedido.total`, sem parênteses
- **`toThrow`** confere se o código lança erro. O código vai dentro de uma arrow function, para o Jest chamá-lo e capturar o erro; sem a arrow, o erro estoura antes do `expect`

---

## :icon[test-tube] Testes do Pedido na prática

```javascript
test('comStatus devolve outro Pedido e não muda o original', () => {
  const pendente = new Pedido(dados);
  const pago = pendente.comStatus('pago');
  expect(pago).not.toBe(pendente); // não é o mesmo objeto
  expect(pendente.status).toBe('pendente');
});

test('recusa status inválido também na atribuição', () => {
  const pedido = new Pedido(dados);
  expect(() => {
    pedido.status = 'aprovado';
  }).toThrow('Status inválido: aprovado');
});
```

O `.not` inverte a conferência: `not.toBe` passa quando os dois **não** são o mesmo objeto.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `is not a function` | getter chamado com parênteses, ou estático chamado pela instância | `produto.precoFormatado`, sem parênteses; `Produto.deJSON(dados)` |
| `Maximum call stack size exceeded` | o setter faz `this.status = valor` e chama a si mesmo | gravar em `this._status` |
| `Status inválido` | o status não está na lista `STATUS` | usar um dos cinco status da lista |
| `Produto inválido no JSON` | veio um produto sem preço em número | corrigir o dado: `"preco": 199.9` |

---

## :icon[triangle-alert] Erros comuns

:::warning
- Mudar uma instância que outra parte do código guarda (`pedido.status = 'pago'`): todos veem a mudança. Use `comStatus`
- Salvar `{ ...pedido }` ou `JSON.stringify(pedido)`: o `status` se perde. Use `paraJSON()`
- Ignorar o retorno: `pedido.comStatus('pago')` sozinho cria um pedido que ninguém guarda
- Chamar getter com parênteses: `produto.precoFormatado()` dá `is not a function`
- `this.status = valor` dentro do setter: ele chama a si mesmo até estourar a pilha
- Chamar o estático pela instância: é `Produto.deJSON(dados)`, não `fone.deJSON(dados)`
:::

---

## Resumo

:::summary
- Métodos `static` pertencem à classe: `Produto.deJSON` e `Produto.listaDeJSON` criam instâncias a partir do JSON
- Getters calculam valores lidos sem parênteses; setters validam cada atribuição, inclusive a do `constructor`
- `toString()` define como o objeto vira texto em template strings e logs
- Para mudar, um método devolve uma instância nova (`comStatus`); o original fica intacto para quem o guardou
- Para guardar, use os dados simples do `paraJSON()` e recrie a classe para calcular
:::

---

## :icon[flask-conical] No laboratório

Os dois modelos da Lojinha, com testes, e a vitrine no terminal usando o `Produto`.

:::steps
1. `src/modelos/Produto.js`: `deJSON`, `listaDeJSON`, getters `precoFormatado`, `precoNoPix` e `emDestaque`, métodos `ehDaCategoria`, `precoPara` e `toString`
2. `src/modelos/Pedido.js`: setter de `status`, getters `quantidade`, `subtotal` e `total`, `comStatus`, `paraJSON` e `toString`
3. `Produto.test.js` e `Pedido.test.js` com pelo menos 10 testes, incluindo status inválido e o original intacto depois de `comStatus`
4. `src/scripts/vitrine.js`: `Produto.listaDeJSON(produtos)` e uma linha por produto, com preço, preço no Pix e "[destaque]"
5. `npm run verificar` sem erros, commit "E15: classes Produto e Pedido" e `git push`
:::

**Critérios de entrega**: classes sem `console.log` nem leitura de arquivo; 10 testes passando; a vitrine sem conta de preço nem regra de destaque. Entregue o link do repositório no sistema.

---

## :icon[milestone] Projeto 3 · Etapa 3: a classe Tarefa e a lista na tela

No seu repositório `lista-de-tarefas`:

- `src/modelos/Tarefa.js`: `deJSON`, getters `peso` e `rotuloDaPrioridade`, `situacao(hoje)` e `concluir()` devolvendo uma tarefa nova
- `src/data/tarefas.js` com 5 ou 6 tarefas suas
- `src/tela/`: a lista desenhada no DOM igual ao molde do HTML, em ordem de urgência, com o resumo

Para a tela, as partes 1 a 6 do [Guia do DOM](materiais/projeto-3/guia-dom.html). Commit: `Projeto 3: etapa 3, classe Tarefa e a lista na tela`. Enunciado completo e entrega: página do curso, em **Projetos**.
