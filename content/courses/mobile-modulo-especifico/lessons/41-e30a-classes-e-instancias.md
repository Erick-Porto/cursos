---
title: Classes e instâncias
summary: Junte os dados e as regras do produto numa classe e crie instâncias a partir do catálogo em JSON.
module: logica-js
duration_minutes: 40
objectives:
  - Diferenciar classe de instância e criar objetos com new
  - Escrever constructor, propriedades e métodos usando this
  - Criar a classe Produto em src/modelos a partir dos dados do catálogo
  - Testar uma classe com Jest
---

# Classes e instâncias

Programador Mobile: Módulo Específico · Encontro E30 · Aula 41 de 71

---

## O que você vai aprender

:::goal
- Entender a **orientação a objetos**: dados e comportamento no mesmo objeto
- Diferenciar **classe** de **instância** e criar objetos com `new`
- Escrever `constructor`, propriedades e métodos, usando `this`
- Criar `src/modelos/Produto.js` a partir do catálogo em JSON e testá-la com Jest
:::

---

## A mesma regra em três telas

Imagine que a loja decidiu: um produto fica **em destaque** quando a equipe o marcou ou quando a nota é 4,5 ou mais. A regra aparece no carrossel do Início, no selo do Detalhe e na busca:

```javascript
// src/telas/Inicio.js
const destaques = produtos.filter((p) => p.destaque || p.avaliacao >= 4.5);

// src/telas/Detalhe.js
const mostrarSelo = produto.destaque || produto.avaliacao >= 4.5;
```

Na semana seguinte, a nota mínima sobe para 4,7. Você lembra de trocar nas três telas? E na quarta, que um colega criou ontem?

:::question
Onde essa regra deveria morar para que todas as telas usem a mesma, sem cópias?
:::

---

## :icon[boxes] Orientação a objetos: dados que sabem responder

Até aqui, o produto é um **objeto literal** só com dados, e as regras ficam em funções que recebem o produto. Na **orientação a objetos**, dados e regras ficam juntos: o objeto guarda as **propriedades** (nome, preço) e responde perguntas sobre si por meio de **métodos**.

```javascript
// função solta: a regra mora longe do dado
emDestaque(produto);

// orientação a objetos: o próprio produto responde
produto.emDestaque();
```

Você já usa objetos assim: `lista.sort()` ordena aquele array, `texto.trim()` limpa aquela string e `router.push()` navega.

As funções puras de `src/regras/` continuam ótimas para cálculos isolados, como o frete. Classes servem para as **entidades** do app: produto, pedido, pagamento.

---

## :icon[copy] Classe e instância

Uma **classe** é o molde; uma **instância** é cada objeto criado a partir dele, como cada ficha preenchida a partir de uma ficha de cadastro em branco.

:::center
![Diagrama: a classe Produto é o molde, com os campos id, nome e preco em branco e o método emDestaque; new cria as instâncias fone e caixa, cada uma com os próprios valores](images/e30-classe-e-instancias.svg)
:::

A classe, escrita uma vez, define quais campos existem e declara os métodos; cada instância guarda os seus valores e usa os mesmos métodos. Na Lojinha: uma classe `Produto` e doze instâncias, do Fone Bluetooth ao último livro. Mudou a regra de destaque? Você muda **um** método e as doze passam a responder do jeito novo.

---

## :icon[code] Sua primeira classe

```javascript
class Produto {
  constructor(id, nome, preco) {
    this.id = id;
    this.nome = nome;
    this.preco = preco;
  }
}

const fone = new Produto(1, 'Fone Bluetooth', 199.9);
console.log(fone.nome); // 'Fone Bluetooth'
console.log(fone);      // no Node: Produto { id: 1, nome: 'Fone Bluetooth', preco: 199.9 }
```

- `class Produto` declara o molde. O nome vai em **PascalCase**, como o dos componentes
- O **`constructor`** roda uma vez para cada instância nova e prepara os dados dela
- `this.nome = nome` cria a **propriedade** `nome` na instância, com o valor recebido
- **`new Produto(...)`** cria a instância e chama o `constructor` com esses argumentos

---

## :icon[circle-plus] O que o new faz

:::steps
1. Cria um objeto vazio
2. Liga esse objeto à classe, para que ele enxergue os métodos dela
3. Roda o `constructor` com `this` apontando para o objeto novo
4. Devolve o objeto pronto, que você guarda numa constante
:::

Sem o `new`, nada disso acontece e o JavaScript para com um erro:

```javascript
const fone = Produto(1, 'Fone Bluetooth', 199.9);
// TypeError: Class constructor Produto cannot be invoked without 'new'
```

Essa é a mensagem do Node e do Jest; no app ela pode vir com outras palavras, mas a causa é a mesma. A ligação do passo 2 se chama **protótipo**, e você a vê por dentro no E36.

---

## :icon[layers] Cada instância tem os seus dados

```javascript
const fone = new Produto(1, 'Fone Bluetooth', 199.9);
const caixa = new Produto(2, 'Caixa de Som Portátil', 249.9);

console.log(fone.preco);              // 199.9
console.log(caixa.preco);             // 249.9
console.log(fone instanceof Produto); // true

const doCatalogo = { id: 1, nome: 'Fone Bluetooth', preco: 199.9 };
console.log(doCatalogo instanceof Produto); // false
```

As duas instâncias vêm do mesmo molde, mas cada uma guarda os próprios valores. O operador **`instanceof`** pergunta se um objeto foi criado por aquela classe.

Um objeto literal com os mesmos campos **não** é instância: ele tem os dados, mas não tem os métodos da classe.

---

## :icon[square-function] Métodos: o que o produto sabe fazer

```javascript
class Produto {
  // constructor como antes, agora também com categoria

  ehDaCategoria(slug) {
    return this.categoria === slug;
  }

  precoPara(qtd) {
    // em centavos inteiros, como no E25
    return (Math.round(this.preco * 100) * qtd) / 100;
  }
}

fone.ehDaCategoria('audio'); // true
fone.precoPara(2);           // 399.8
```

- Um **método** é uma função declarada dentro da classe, **sem** a palavra `function`
- Entre os métodos não há vírgula: classe não é objeto literal
- Você chama com ponto e parênteses, como qualquer função: `fone.precoPara(2)`

---

## :icon[target] this: a instância antes do ponto

Dentro de um método, **`this`** é a instância que fez a chamada. O método é um só, escrito na classe; o `this` muda a cada chamada.

| Chamada | `this` vale | Resultado |
|---|---|---|
| `fone.precoPara(2)` | `fone` | `399.8` |
| `caixa.precoPara(2)` | `caixa` | `499.8` |
| `fone.ehDaCategoria('casa')` | `fone` | `false` |

Regra prática: olhe o que vem **antes do ponto** na chamada. É por isso que `this.preco` encontra o preço certo de cada produto sem que você passe o preço como argumento.

:::info
Passar o método solto, como em `onPress={fone.precoPara}`, separa o método do objeto e o `this` se perde. Você vê esse caso e a solução no E35.
:::

---

## Pense

:::question
O colega escreveu o método abaixo. O que acontece na última linha?

```javascript
class Produto {
  constructor(nome, preco) {
    this.nome = nome;
    this.preco = preco;
  }

  precoPara(qtd) {
    return preco * qtd;
  }
}

new Produto('Fone Bluetooth', 199.9).precoPara(2);
```
:::

:::tip Resposta
O JavaScript para com `ReferenceError: preco is not defined`. Sozinho, `preco` procura uma **variável** com esse nome, e ela só existiu como parâmetro do `constructor`, que já terminou. O valor ficou guardado na instância: leia com `this.preco`. Dentro da classe, propriedade é sempre `this.alguma`.
:::

---

## :icon[braces] Muitos campos: receba um objeto

O produto do catálogo tem oito campos. Com oito parâmetros, a ordem vira armadilha: `new Produto('Fone Bluetooth', 199.9, 1)` não dá erro, só cria um produto chamado `199.9` que custa R$ 1,00.

O jeito seguro é receber **um objeto** e desestruturar os campos pelo nome, como as props de um componente:

```javascript
export default class Produto {
  constructor({
    id, nome, preco, categoria, imagem, descricao,
    destaque = false, avaliacao = 0,
  }) {
    this.id = id;
    this.nome = nome;
    this.preco = preco;
    // categoria, imagem, descricao, destaque e avaliacao do mesmo jeito
  }
}
```

A ordem deixa de importar, campo ausente recebe o **valor padrão** e cada item do `catalogo.json` já chega nesse formato: `new Produto(catalogo.produtos[0])`.

---

## :icon[folder] O arquivo src/modelos/Produto.js

A pasta **`src/modelos/`** guarda as classes do domínio, uma por arquivo, com o nome da classe. O `export default` funciona como nos componentes: `import Produto from '../modelos/Produto';`.

```javascript
// src/modelos/Produto.js, depois do constructor
  emDestaque() {
    return this.destaque || this.avaliacao >= 4.5;
  }

  ehDaCategoria(slug) {
    return this.categoria === slug;
  }

  precoPara(qtd) {
    return (Math.round(this.preco * 100) * qtd) / 100;
  }
}
```

A regra de destaque agora mora em **um** lugar. A nota mínima mudou? Troque `4.5` por `4.7` aqui, e todas as telas que perguntam `produto.emDestaque()` passam a obedecer.

---

## :icon[database] Do catálogo às instâncias

```javascript
// numa tela em src/telas/
import catalogo from '../data/catalogo.json';
import Produto from '../modelos/Produto';

const lista = catalogo.produtos.map((dados) => new Produto(dados));
const doAudio = lista.filter((p) => p.ehDaCategoria('audio'));
```

O JSON traz **dados**: objetos literais, sem métodos. O `map` passa cada um pelo `new` e devolve uma lista de instâncias, que já respondem `emDestaque()`, `ehDaCategoria()` e `precoPara()`.

| Pasta | O que guarda | Exemplo |
|---|---|---|
| `src/data/` | dados crus | `catalogo.json` |
| `src/regras/` | funções puras | `calcularFrete(subtotal, cep)` |
| `src/modelos/` | classes do domínio | `Produto`, `Pedido` |
| `src/telas/` | o que aparece na tela | `Detalhe.js` |

---

## :icon[test-tube] Testando a classe com Jest

A classe não depende de tela nem de React. Testar é criar uma instância com dados conhecidos e conferir o que ela responde. Em `src/modelos/Produto.test.js`:

```javascript
import Produto from './Produto';

const dados = { id: 5, nome: 'Luminária', preco: 89.9, categoria: 'casa', avaliacao: 4.7 };

describe('Produto', () => {
  test('guarda os dados e aplica os padrões', () => {
    const produto = new Produto(dados);
    expect(produto.nome).toBe('Luminária');
    expect(produto.destaque).toBe(false);
  });

  test('precoPara(3) não perde centavo', () => {
    expect(new Produto(dados).precoPara(3)).toBe(269.7); // 89.9 * 3 dá 269.70000000000005
  });
});
```

Rode com `npm test`, como no E24.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Esquecer o `new`: `Produto(dados)` para com `TypeError` em vez de criar o produto
- Ler `preco` em vez de `this.preco` dentro do método: `ReferenceError`
- Escrever `function` antes do método ou pôr vírgula entre métodos: erro de sintaxe, porque classe não é objeto literal
- Tratar o objeto do JSON como instância: ele só tem `emDestaque()` depois de passar pelo `new`
- Parâmetros na ordem errada no `constructor`: nenhum erro aparece, só dados trocados. Receba um objeto
:::

---

## Resumo

:::summary
- A orientação a objetos junta dados (propriedades) e comportamento (métodos) no mesmo objeto
- A classe é o molde; cada `new Produto(dados)` cria uma instância com os próprios valores
- O `constructor` prepara a instância, e `this` é a instância que vem antes do ponto na chamada
- `src/modelos/Produto.js` recebe um objeto do catálogo e concentra regras como `emDestaque()`
- Uma classe sem React se testa com Jest como uma função pura: dados conhecidos, resposta esperada
:::

---

## Próximos passos

Na aula 42, o `Produto` ganha **métodos estáticos**, que criam instâncias a partir do JSON (`Produto.deJSON`), **getters**, que se leem como propriedade (`produto.precoFormatado`), e **setters**, que validam. Você também cria a classe `Pedido`.

:::info Guarde esta pergunta
Se o pedido é uma instância de classe e o status dele muda de Pendente para Pago, como a tela fica sabendo? A resposta é a regra mais importante do encontro.
:::
