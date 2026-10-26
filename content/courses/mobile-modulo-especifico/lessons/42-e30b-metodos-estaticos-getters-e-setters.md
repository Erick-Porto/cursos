---
title: Métodos estáticos, getters e setters
summary: Crie produtos a partir do JSON, calcule com getters, valide com setters e use classes sem travar o estado.
module: logica-js
duration_minutes: 40
objectives:
  - Criar instâncias com métodos estáticos como Produto.deJSON
  - Expor valores calculados com getters e validar dados com setters
  - Manter objetos simples no estado do React e devolver instâncias novas ao mudar
  - Modelar e testar o Pedido com subtotal, total e status
---

# Métodos estáticos, getters e setters

Programador Mobile: Módulo Específico · Encontro E30 · Aula 42 de 71

---

## O que você vai aprender

:::goal
- Criar instâncias a partir do JSON com **métodos estáticos**
- Calcular valores com **getters** e validar dados com **setters**
- Dar ao objeto um texto legível com `toString()`
- Usar classes com o estado do React: dados simples no estado e instâncias novas a cada mudança
- Modelar e testar o `Pedido`
:::

---

## O pedido que não muda na tela

Em "Meus pedidos", o cliente paga pelo Pix e o app recebe a confirmação. O pedido tem de passar de **Pendente** para **Pago**, com o Badge mudando de cor na hora. Se alguém tentar um status que não existe, como `'aprovado'`, o erro precisa aparecer já, e não três telas depois.

No Detalhe, o preço formatado, o preço no Pix e o selo de destaque também precisam sair do produto, sem conta repetida em cada tela.

:::question
Se o pedido é uma instância de classe, como trocar o status de um jeito que o React perceba?
:::

---

## :icon[factory] Métodos estáticos: ações da classe

Um método **`static`** pertence à classe, não às instâncias: você o chama pelo nome da classe. Você já usa vários: `Math.round()`, `Number.isNaN()`, `JSON.parse()`, `Object.keys()`.

```javascript
export default class Produto {
  // constructor e métodos da aula 41

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

`deJSON` é uma **fábrica**: o nome diz de onde o dado vem, e ela é a única porta de entrada do JSON. Se o arquivo vier quebrado, o erro aparece aqui, com mensagem clara, e não como `R$ NaN` no carrinho. O **`throw`** interrompe tudo e mostra o erro; no E32, você aprende a tratá-lo.

---

## :icon[eye] Getters: calculados, mas lidos como propriedade

Um **getter** é um método marcado com `get`. Você o lê sem parênteses, como uma propriedade, mas o valor é calculado na hora, a partir dos dados atuais.

```javascript
import { formatarPreco } from '../utils/formatar';

export default class Produto {
  get precoFormatado() {
    return formatarPreco(this.preco);
  }

  get emDestaque() {
    return this.destaque || this.avaliacao >= 4.5;
  }
}
```

```jsx
<Text style={[estilos.preco, { color: cores.primaria }]}>{produto.precoFormatado}</Text>
{produto.emDestaque && <Badge texto="Destaque" tom="sucesso" />}
```

O `emDestaque()` da aula 41 virou getter: nas telas, `produto.emDestaque()` passa a ser `produto.emDestaque`.

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
O Detalhe mostra "R$ 189,90 no Pix". A conta já existe em `src/regras/precos.js`: a função `precoComPix(preco)`, do E25. Escreva o getter `precoNoPix` do `Produto` e a linha do Detalhe que o usa.
:::

:::tip Resposta
```javascript
import { precoComPix } from '../regras/precos';

// dentro da classe Produto
get precoNoPix() {
  return precoComPix(this.preco);
}
```

```jsx
<Text style={[estilos.pix, { color: cores.textoSuave }]}>
  {formatarPreco(produto.precoNoPix)} no Pix
</Text>
```

É getter porque não tem parâmetro e sai dos dados do produto. A classe não reescreve a regra do Pix: chama a função pura que já tem testes.
:::

---

## :icon[receipt] A classe Pedido

O segundo modelo da Lojinha, em `src/modelos/Pedido.js`, junta os itens do carrinho, o frete, o desconto e o status:

```javascript
import { contarItens, subtotal as somarItens } from '../regras/carrinho';

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
- Os getters chamam as funções de `src/regras/carrinho.js`, do E27: a classe junta dados e regras, não as repete
- O `as` dá outro nome ao import, porque `subtotal` também é o nome do getter

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
- O sublinhado de `_status` é um combinado: "não mexa por fora". No E31, o campo privado `#status` vira regra da linguagem
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

```jsx
console.log(`Adicionado: ${produto}`); // Adicionado: Fone Bluetooth, R$ 199,90

<View accessible accessibilityLabel={`${produto}`}>
  <Text>{produto.nome}</Text>
  <Text>{produto.precoFormatado}</Text>
</View>
```

O log no terminal do Expo fica legível, e o leitor de tela lê o bloco de uma vez: "Fone Bluetooth, R$ 199,90". O `Pedido` ganha o seu: `Pedido 1042, pago, R$ 419,70`. O `console.log(produto)` sem template string continua mostrando o objeto inteiro.

---

## :icon[copy] comStatus: mudar devolvendo um pedido novo

Na Lojinha, um método que "muda" faz como o `adicionarItem` do E28 com o array: **devolve um objeto novo** e deixa o original intacto.

```javascript
comStatus(novo) {
  return new Pedido({ ...this.paraJSON(), status: novo });
}

paraJSON() {
  const { id, itens, status, frete, desconto } = this;
  return { id, itens, status, frete, desconto };
}
```

```javascript
const pendente = new Pedido(dados);
const pago = pendente.comStatus('pago');
console.log(pendente.status, pago.status); // 'pendente' 'pago'
```

- `paraJSON()` devolve os **dados simples** do pedido, no formato que o `constructor` recebe
- O pedido novo passa pelo `constructor`, então o setter valida: `comStatus('aprovado')` lança erro

---

## :icon[bug] O erro: mudar a instância guardada no estado

```jsx
const [pedido, setPedido] = useState(new Pedido(dadosDoPedido));

function confirmarPagamento() {
  pedido.status = 'pago'; // o setter valida e muda o MESMO objeto
  setPedido(pedido);      // mesma referência de antes
}

<Badge texto={textoDoStatus(pedido.status)} tom={tomDoStatus(pedido.status)} />
```

:::center
![Animação: pedido.status = 'pago' troca o status dentro do mesmo objeto; setPedido(pedido) recebe a mesma referência, o React não redesenha e o Badge continua Pendente](images/e30-mesma-referencia.svg)
:::

Você toca em **Confirmar pagamento** e o Badge continua **Pendente**. O `setPedido` compara o valor novo com o atual pela **referência**: é o mesmo objeto, então o React conclui que nada mudou e não atualiza a tela.

Pior: quando você troca o tema, a tela renderiza por outro motivo e o **Pago** aparece do nada. Bug que aparece e some é o mais difícil de achar. O setter não protege você aqui: ele valida o valor, mas a mudança acontece escondida do React.

---

## :icon[circle-check] O certo: dados simples no estado

```jsx
const [dados, setDados] = useState(dadosDoPedido); // objeto simples
const pedido = new Pedido(dados);                  // recriado a cada renderização

function confirmarPagamento() {
  setDados(pedido.comStatus('pago').paraJSON());   // objeto novo: a tela atualiza
}
```

:::center
![Diagrama: setDados recebe um objeto novo com status 'pago'; o estado deixa o objeto antigo, o React redesenha e o Badge mostra Pago](images/e30-objeto-novo.svg)
:::

:::steps
1. O estado guarda **dados simples**, como vieram do JSON ou do carrinho
2. A cada renderização, a classe é criada a partir deles para calcular e validar
3. Para mudar, um método devolve outra instância, e o estado recebe os dados dela
:::

Por que não guardar a instância? O contexto, o `JSON.stringify` e o armazenamento no aparelho, do E39, lidam com dados, não com getters. E criar um `Pedido` a cada renderização é barato: ele só guarda referências e soma na hora.

---

## Pense

:::question
Para guardar o pedido, alguém escreveu `setDados({ ...pedido })`. Depois disso, um pedido **pago** voltou a aparecer como **Pendente**, sem nenhum erro. O que aconteceu?
:::

:::tip Resposta
O spread copia só os campos guardados no próprio objeto: `id`, `itens`, `_status`, `frete` e `desconto`. O getter `status` mora na classe e fica de fora. Na renderização seguinte, `new Pedido(dados)` não encontra `status` e usa o padrão `'pendente'`. O `JSON.stringify(pedido)` tem o mesmo problema. Use `pedido.paraJSON()`: ele devolve exatamente os dados que o `constructor` espera.
:::

---

## :icon[test-tube] Testando o Pedido

```javascript
import Pedido from './Pedido';

const dados = { id: 1042, itens: [{ id: 1, nome: 'Fone', preco: 199.9, qtd: 2 }], frete: 19.9 };

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
- Mudar a instância guardada no estado (`pedido.status = 'pago'`): a tela não atualiza. Guarde dados simples e use `comStatus`
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
- `toString()` define como o objeto vira texto em template strings e rótulos de acessibilidade
- No estado do React ficam dados simples; a classe é criada a partir deles para calcular e validar
- Para mudar, um método devolve uma instância nova (`comStatus`), e o estado recebe o `paraJSON()` dela
:::

---

## :icon[flask-conical] No laboratório

Os dois modelos da Lojinha, com testes, e o Detalhe usando o `Produto`.

:::steps
1. `src/modelos/Produto.js`: `deJSON`, `listaDeJSON`, getters `precoFormatado`, `precoNoPix` e `emDestaque`, métodos `ehDaCategoria`, `precoPara` e `toString`
2. `src/modelos/Pedido.js`: setter de `status`, getters `quantidade`, `subtotal` e `total`, `comStatus`, `paraJSON` e `toString`
3. `Produto.test.js` e `Pedido.test.js` com pelo menos 10 testes, incluindo status inválido e o original intacto depois de `comStatus`
4. No Detalhe: `Produto.deJSON(dados)`, `precoFormatado`, `precoNoPix` e o Badge "Destaque" com `emDestaque`
5. O carrinho continua recebendo dados simples: `adicionar(dados)`
6. `npm run verificar` sem erros, commit "E30: classes Produto e Pedido" e `git push`
:::

**Critérios de entrega**: classes sem React; 10 testes passando; Detalhe sem conta de preço nem regra de destaque; nenhuma instância no estado. Entregue o link do repositório no sistema.
