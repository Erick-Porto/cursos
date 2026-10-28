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

## O pedido que muda no histórico

Um script da Lojinha acompanha o pedido 1042 e guarda cada versão num **histórico**: primeiro **pendente**, depois **pago**. Na conferência, as duas posições dizem "pago", e ninguém escreveu `'pago'` duas vezes.

E há mais: um status que não existe, como `'aprovado'`, precisa dar erro na hora, e não três passos depois. O preço formatado e o preço no Pix precisam sair do produto, sem `formatarPreco` repetido em cada script.

:::question
Se o pedido é uma instância de classe, como trocar o status sem estragar a versão que o histórico guardou?
:::

---

## :icon[factory] Métodos estáticos: ações da classe

Um método **`static`** pertence à classe, não às instâncias: você o chama pelo nome da classe. Você já usa vários: `Math.round()`, `Number.isNaN()`, `JSON.parse()`, `Object.keys()`.

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

`deJSON` é uma **fábrica**: o nome diz de onde o dado vem, e ela é a única porta de entrada. Se o `catalogo.json` trouxer `"preco": "199,90"`, o erro aparece aqui, com mensagem clara, e não como `R$ NaN` num relatório. O **`throw`** interrompe o programa e mostra o erro; no E17, você aprende a tratá-lo.

---

## :icon[eye] Getters: calculados, mas lidos como propriedade

Um **getter** é um método marcado com `get`. Você o lê sem parênteses, como uma propriedade, mas o valor é calculado na hora, a partir dos dados atuais.

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

## :icon[receipt] A classe Pedido

O segundo modelo da Lojinha, em `src/modelos/Pedido.js`, junta os itens do carrinho, o frete, o desconto e o status:

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

## :icon[shield-check] Setters: validar na atribuição

Um **setter**, marcado com `set`, roda toda vez que alguém atribui um valor à propriedade. É o lugar de recusar valor inválido. Ele trabalha em par com um getter e guarda o valor num campo de outro nome:

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

## :icon[text] toString: o objeto vira texto

Quando o JavaScript precisa transformar um objeto em texto, como numa template string, ele chama **`toString()`**. Sem ele, o resultado não ajuda ninguém:

```javascript
console.log(`Adicionado: ${dados}`); // Adicionado: [object Object]
```

```javascript
// dentro da classe Produto
toString() {
  return `${this.nome}, ${this.precoFormatado}`;
}
```

```javascript
console.log(`Adicionado: ${produto}`); // Adicionado: Fone Bluetooth, R$ 199,90
console.log(produto); // Produto { id: 1, nome: 'Fone Bluetooth', ... }
```

O log do terminal fica legível. O `Pedido` ganha o seu: `Pedido 1042, pago, R$ 419,70`. O `console.log(produto)` sem template string continua mostrando o objeto inteiro, com todos os campos.

---

## :icon[copy] comStatus: mudar devolvendo um pedido novo

Na Lojinha, um método que "muda" faz como o `adicionarItem` do E09 com o array: **devolve um objeto novo** e deixa o original intacto.

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
- O pedido novo passa pelo `constructor`, então o setter valida: `comStatus('aprovado')` lança erro
- A cópia é **rasa**, como no E11: o pedido novo e o antigo dividem o mesmo array `itens`. Por isso nenhum método do `Pedido` mexe nos itens

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

O array não guardou uma cópia: guardou a **referência**, como no E11. Três etiquetas, uma caixa. O setter não protege você aqui: ele valida o valor, mas a mudança atinge todo mundo que guarda aquele objeto.

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

## Pense

:::question
Para guardar o pedido em arquivo, alguém escreveu `fs.writeFileSync('pedido.json', JSON.stringify(pago))`. Ao ler de volta com `new Pedido(JSON.parse(texto))`, o pedido **pago** voltou como **pendente**, sem nenhum erro. O que aconteceu?
:::

:::tip Resposta
O `JSON.stringify` copia só os campos guardados no próprio objeto: `id`, `itens`, `_status`, `frete` e `desconto`. O getter `status` mora na classe e fica de fora. Ao recriar, o `constructor` não encontra `status` e usa o padrão `'pendente'`. O spread `{ ...pago }` tem o mesmo problema. Use `pago.paraJSON()`: ele devolve exatamente os dados que o `constructor` espera.
:::

---

## :icon[save] Guardar dados, recriar a classe

```javascript
import fs from 'node:fs';

fs.writeFileSync('pedido.json', JSON.stringify(pago.paraJSON()));

const texto = fs.readFileSync('pedido.json', 'utf-8');
const lido = new Pedido(JSON.parse(texto));
console.log(`${lido}`); // Pedido 1042, pago, R$ 419,70
```

:::steps
1. Para guardar ou enviar, use os **dados simples** do `paraJSON()`
2. Para calcular e validar, crie a instância a partir desses dados
3. Para mudar, um método devolve outra instância, e quem guardou a antiga não é afetado
:::

Criar um `Pedido` de novo é barato: ele só guarda referências e soma na hora.

---

## :icon[test-tube] Testando o Pedido

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
