---
title: Classes e instâncias
summary: Junte os dados e as regras do produto numa classe e crie instâncias a partir do catálogo da Lojinha.
module: classes-e-controle
duration_minutes: 40
objectives:
  - Diferenciar classe de instância e criar objetos com new
  - Escrever constructor, propriedades e métodos usando this
  - Criar a classe Produto em src/modelos a partir dos dados do catálogo
  - Testar uma classe com Jest
---

# Classes e instâncias

Programador Mobile · Encontro E15 · Aula 29 de 89

---

## O que você vai aprender

:::goal
- Entender a **orientação a objetos**: dados e comportamento no mesmo objeto
- Diferenciar **classe** de **instância** e criar objetos com `new`
- Escrever `constructor`, propriedades e métodos, usando `this`
- Criar `src/modelos/Produto.js` a partir do catálogo e testá-la com Jest
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **classe** | o molde de um tipo de objeto, escrito uma vez, como uma forma de bolo |
| **instância** | cada objeto criado a partir da classe, como cada bolo feito com a forma |
| **`new`** | a palavra que cria uma instância nova a partir da classe |
| **`constructor`** | a parte da classe que prepara cada instância nova (*constructor*, construtor) |
| **propriedade** e **método** | os dados do objeto (nome, preço) e as funções que ele sabe fazer |
| **`this`** | dentro de um método, o objeto que fez a chamada, o que vem antes do ponto |

---

## A mesma regra em três lugares

A loja decidiu: um produto fica **em destaque** quando a equipe o marcou ou quando a nota é 4,5 ou mais. A regra aparece no script da vitrine, no relatório do catálogo e na busca:

```javascript
// no script da vitrine
const destaques = produtos.filter((p) => p.destaque || p.avaliacao >= 4.5);

// no relatório do catálogo
const selo = produto.destaque || produto.avaliacao >= 4.5 ? ' [destaque]' : '';
```

Na semana seguinte, a nota mínima sobe para 4,7. Você lembra de trocar nos três? E no quarto, que um colega criou ontem? No E30, a mesma regra ainda vai para o carrossel e o selo do app.

:::question
Onde essa regra deveria morar para que todo o código use a mesma, sem cópias?
:::

---

## Orientação a objetos

E se a ficha de cadastro do produto soubesse fazer as próprias contas?

---

## :icon[boxes] Orientação a objetos: dados que sabem responder

Até aqui, o produto é uma ficha de cadastro só com dados: um **objeto literal**. As regras ficam em funções que recebem a ficha. Na **orientação a objetos**, a ficha também sabe responder perguntas sobre si: o objeto guarda as **propriedades** (nome, preço) e responde por meio de **métodos**.

```javascript
// função solta: a regra mora longe do dado
emDestaque(produto);

// orientação a objetos: o próprio produto responde
produto.emDestaque();
```

As funções puras de `src/regras/` continuam ótimas para cálculos isolados, como o frete. Classes servem para as **entidades** da loja, as coisas que ela guarda e acompanha: produto, pedido, pagamento.

---

## :icon[message-square] Orientação a objetos na prática

Você já usa objetos que respondem sobre si. Repare no ponto: primeiro o objeto, depois o método.

```javascript
'  Fone Bluetooth  '.trim(); // 'Fone Bluetooth': o texto se limpa
[1, 4, 7].includes(7);       // true: a lista procura em si mesma
(199.9).toFixed(2);          // '199.90': o número se formata
```

- Ninguém passa o texto para o `trim`: ele já sabe qual texto limpar, o que vem antes do ponto
- Hoje você cria objetos assim para a Lojinha: `produto.precoPara(2)`, `produto.emDestaque()`

---

## :icon[braces] Do objeto literal do E11 à classe

No E11, você escreveu um objeto literal com método e viu que, lá dentro, `this` é o objeto antes do ponto:

```javascript
const fone = {
  nome: 'Fone Bluetooth',
  preco: 199.9,
  precoPara(qtd) {
    return paraReais(paraCentavos(this.preco) * qtd);
  },
};

fone.precoPara(2); // 399.8
```

Funciona para um produto. Para os doze do catálogo, você copiaria o método doze vezes, e a regra de destaque também. Se a conta mudar, são doze lugares para trocar.

Uma **classe** resolve isso: você escreve os métodos **uma vez** e cria quantos produtos quiser a partir dela.

---

## Classe e instância

Com uma forma de bolo, quantos bolos dá para fazer?

---

## :icon[copy] Classe e instância

Uma **classe** é a forma de bolo; cada **instância** é um bolo feito com ela. A forma é uma só e define o formato; cada bolo tem o seu recheio.

:::center
![Diagrama: a classe Produto é o molde, com os campos id, nome e preco em branco e o método emDestaque; new cria as instâncias fone e caixa, cada uma com os próprios valores](images/e15-classe-e-instancias.svg)
:::

A classe define quais campos existem e declara os métodos; cada instância guarda os seus valores e usa os mesmos métodos. Na Lojinha: uma classe `Produto` e doze instâncias, do Fone Bluetooth ao Guia de Viagem. Mudou a regra de destaque? Você muda **um** método e as doze passam a responder do jeito novo.

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
console.log(fone);      // Produto { id: 1, nome: 'Fone Bluetooth', preco: 199.9 }
```

- `class Produto` declara a forma. O nome vai em **PascalCase**, com a primeira letra maiúscula: é o combinado que separa a classe (`Produto`) das variáveis e funções (`produto`, `calcularFrete`)
- O **`constructor`** roda uma vez para cada instância nova e prepara os dados dela
- `this.nome = nome` cria a **propriedade** `nome` na instância, com o valor recebido
- **`new Produto(...)`** cria a instância e chama o `constructor` com esses argumentos

---

## O new

O que precisa acontecer para a forma virar um bolo?

---

## :icon[circle-plus] O que o new faz

O **`new`** é a hora de fazer um bolo com a forma: ele pega a classe e entrega uma instância nova, pronta. Por dentro, são quatro passos:

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

A ligação do passo 2 se chama **protótipo**, e você a vê por dentro no E17.

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

As duas instâncias vêm da mesma forma, mas cada uma guarda os próprios valores. O operador **`instanceof`** (*instância de*) pergunta se um objeto foi criado por aquela classe.

Um objeto literal com os mesmos campos **não** é instância: ele tem os dados, mas não tem os métodos da classe.

---

## Métodos

Que perguntas um produto deveria saber responder sozinho?

---

## :icon[square-function] Métodos: o que o produto sabe fazer

Um **método** é uma função que mora dentro da classe: é a pergunta que você faz ao objeto. "Você é da categoria áudio?" "Quanto custam 2 de você?"

```javascript
class Produto {
  // constructor como antes, agora também com categoria

  ehDaCategoria(slug) {
    return this.categoria === slug;
  }

  precoPara(qtd) {
    // em centavos inteiros, com paraCentavos e paraReais do E05
    return paraReais(paraCentavos(this.preco) * qtd);
  }
}

fone.ehDaCategoria('audio'); // true
fone.precoPara(2);           // 399.8
```

- O método se escreve **sem** a palavra `function`, e entre os métodos não há vírgula: classe não é objeto literal
- Você chama com ponto e parênteses, como qualquer função: `fone.precoPara(2)`

---

## :icon[store] Métodos na prática: a vitrine pergunta

Com a categoria no `constructor`, cada produto responde por si. A vitrine só pergunta:

```javascript
const fone = new Produto(1, 'Fone Bluetooth', 199.9, 'audio');
const luminaria = new Produto(4, 'Luminária de Mesa', 89.9, 'casa');

for (const produto of [fone, luminaria]) {
  console.log(produto.nome, produto.precoPara(3), produto.ehDaCategoria('casa'));
}
// Fone Bluetooth 599.7 false
// Luminária de Mesa 269.7 true
```

O laço não sabe o preço de ninguém: cada produto faz a própria conta.

---

## O this

Quando a Ana diz "eu" e o Bruno diz "eu", é a mesma pessoa?

---

## :icon[target] this: a instância antes do ponto

O **`this`** funciona como a palavra "eu" numa frase: quem é o "eu" depende de quem está falando. Num método, quem fala é a instância **antes do ponto**, como no E11.

```javascript
precoPara(qtd) {
  return paraReais(paraCentavos(this.preco) * qtd); // this.preco: "o meu preço"
}
```

O método é um só, escrito na classe; o `this` muda a cada chamada. Por isso `this.preco` acha o preço de cada produto sem você passar o preço como argumento.

:::info Método solto
Como no E11, o método solto perde o `this`: depois de `const calcular = fone.precoPara;`, a chamada `calcular(2)` dá `TypeError`: não há ninguém antes do ponto.
:::

---

## :icon[target] this na prática

Olhe o que vem antes do ponto em cada chamada:

| Chamada | `this` vale | Resultado |
|---|---|---|
| `fone.precoPara(2)` | `fone` | `399.8` |
| `caixa.precoPara(2)` | `caixa` | `499.8` |
| `fone.ehDaCategoria('casa')` | `fone` | `false` |
| `caixa.ehDaCategoria('audio')` | `caixa` | `true` |

Mesmo método, `this` diferente: o `precoPara` lê 199.9 quando o `fone` chama, e 249.9 quando a `caixa` chama.

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

## Receber um objeto

O que acontece se alguém escreve o telefone no campo do nome?

---

## :icon[variable] Muitos campos: receba um objeto

Quando a classe tem muitos campos, o `constructor` recebe **um objeto só**, a ficha inteira, e tira cada campo pelo nome. Com oito parâmetros soltos, a ordem vira armadilha: `new Produto('Fone Bluetooth', 199.9, 1)` não dá erro, só cria um produto de id `'Fone Bluetooth'`, chamado `199.9`, que custa R$ 1,00.

O jeito seguro é desestruturar os campos pelo nome, com valores padrão, como no E09:

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

---

## :icon[list-ordered] O constructor com objeto em português

| Parte | O que ela diz |
|---|---|
| `constructor({ ... })` | "recebo uma ficha; tiro dela cada campo pelo nome" |
| `id, nome, preco, ...` | "quero estes campos da ficha" |
| `destaque = false` | "se a ficha não trouxer `destaque`, use `false`": é o **valor padrão** |
| `this.id = id` | "guarde o `id` na instância" |

A ordem deixa de importar, e campo ausente recebe o valor padrão. Cada item de `src/data/produtos.js` já chega nesse formato: `new Produto(produtos[0])`.

---

## :icon[id-card] Receber um objeto na prática

**Caso 1: a ficha do catálogo entra inteira.**

```javascript
const fone = new Produto(produtos[0]);
console.log(fone.nome, fone.destaque); // Fone Bluetooth true
```

**Caso 2: outra ordem, campos faltando.** Os nomes guiam cada valor, e o que falta usa o padrão:

```javascript
const caneca = new Produto({ preco: 39.9, nome: 'Caneca', id: 13 });
console.log(caneca.nome, caneca.destaque, caneca.avaliacao); // Caneca false 0
```

---

## Classes no projeto

Em que pasta do lojinha-regras moram os dados? E as regras?

---

## :icon[folder] O arquivo src/modelos/Produto.js

A pasta **`src/modelos/`** guarda as classes da loja, em geral uma por arquivo, com o nome da classe. Pelo combinado do E11, classe sai com `export default`: `import Produto from '../modelos/Produto.js';`.

```javascript
// src/modelos/Produto.js
import { paraCentavos, paraReais } from '../regras/precos.js';

export default class Produto {
  // o constructor que recebe um objeto

  emDestaque() {
    return this.destaque || this.avaliacao >= 4.5;
  }

  // ehDaCategoria(slug) e precoPara(qtd) como antes
}
```

A regra de destaque agora mora em **um** lugar. A nota mínima mudou? Troque `4.5` por `4.7` aqui, e todo código que pergunta `produto.emDestaque()` passa a obedecer.

---

## :icon[database] Do catálogo às instâncias

```javascript
// src/scripts/vitrine.js
import { produtos } from '../data/produtos.js';
import Produto from '../modelos/Produto.js';
import { formatarPreco } from '../utils/formatar.js';

const lista = produtos.map((dados) => new Produto(dados));

for (const produto of lista) {
  if (produto.emDestaque()) {
    console.log(`${produto.nome}: ${formatarPreco(produto.preco)}`);
  }
}
```

Os itens de `produtos.js` são **dados**: objetos literais, sem métodos. O `map` passa cada um pelo `new` e devolve instâncias, que já respondem `emDestaque()`. `node src/scripts/vitrine.js` imprime os 6 produtos em destaque.

---

## :icon[folder-tree] Cada pasta com o seu papel

| Pasta | O que guarda | Exemplo |
|---|---|---|
| `src/data/` | dados crus | `produtos.js` |
| `src/regras/` | funções puras | `calcularFrete(subtotal, cep)` |
| `src/modelos/` | classes da loja | `Produto`, `Pedido` |
| `src/scripts/` | o que roda no terminal | `vitrine.js` |

Os dados ficam em `data`, as contas em `regras`, as entidades em `modelos`. Os scripts só juntam as peças e imprimem.

---

## Testar a classe

Como o computador corrige sozinho a prova de uma classe?

---

## :icon[test-tube] Testando a classe com Jest

Um teste automatizado é uma prova com gabarito que o computador corrige sozinho (E04). A classe não depende de terminal nem de arquivo: testar é criar uma instância com dados conhecidos e conferir o que ela responde. Em `src/modelos/Produto.test.js`:

```javascript
import Produto from './Produto.js';

const dados = { id: 4, nome: 'Luminária de Mesa', preco: 89.9, categoria: 'casa', avaliacao: 4.5 };

describe('Produto', () => {
  test('guarda os dados e aplica os padrões', () => {
    const produto = new Produto(dados);
    expect(produto.nome).toBe('Luminária de Mesa');
    expect(produto.destaque).toBe(false);
  });

  test('precoPara(3) não perde centavo', () => {
    expect(new Produto(dados).precoPara(3)).toBe(269.7); // 89.9 * 3 dá 269.70000000000005
  });
});
```

Rode com `npm test`, como no E04.

---

## :icon[test-tube] Testes na prática: verde e vermelho

**Caso 1: mais uma regra com gabarito.** Cada método ganha o seu teste:

```javascript
test('ehDaCategoria compara a categoria', () => {
  const produto = new Produto(dados); // a Luminária, da categoria casa
  expect(produto.ehDaCategoria('casa')).toBe(true);
  expect(produto.ehDaCategoria('audio')).toBe(false);
});
```

**Caso 2: o teste pega o erro.** Apague o `this.` de `precoPara` e rode `npm test`: o teste do `precoPara` fica vermelho com `ReferenceError: preco is not defined`. Devolva o `this.`: verde de novo.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `cannot be invoked without 'new'` | faltou o `new` antes da classe | `new Produto(dados)` |
| `preco is not defined` | o método leu `preco` sem o `this.` | `this.preco` |
| `Cannot read properties of undefined` | o método foi chamado solto, sem objeto antes do ponto | chamar com o ponto: `fone.precoPara(2)` |
| `Unexpected token ','` | vírgula entre os métodos da classe | apagar a vírgula |
| `emDestaque is not a function` | o item de `produtos.js` ainda não passou pelo `new` | criar a instância antes |

---

## :icon[triangle-alert] Erros comuns

:::warning
- Esquecer o `new`: `Produto(dados)` para com `TypeError` em vez de criar o produto
- Ler `preco` em vez de `this.preco` dentro do método: `ReferenceError`
- Escrever `function` antes do método ou pôr vírgula entre métodos: erro de sintaxe, porque classe não é objeto literal
- Tratar o item de `produtos.js` como instância: ele só tem `emDestaque()` depois de passar pelo `new`
- Parâmetros na ordem errada no `constructor`: nenhum erro aparece, só dados trocados. Receba um objeto
:::

---

## Resumo

:::summary
- A orientação a objetos junta dados (propriedades) e comportamento (métodos) no mesmo objeto
- A classe é a forma; cada `new Produto(dados)` cria uma instância com os próprios valores
- O `constructor` prepara a instância, e `this` é a instância que vem antes do ponto na chamada
- `src/modelos/Produto.js` recebe um objeto do catálogo e concentra regras como `emDestaque()`
- Uma classe se testa com Jest como uma função pura: dados conhecidos, resposta esperada
:::

---

## Próximos passos

Na aula 30, o `Produto` ganha **métodos estáticos**, que criam instâncias a partir de dados do JSON (`Produto.deJSON`), **getters**, que se leem como propriedade (`produto.precoFormatado`), e **setters**, que validam. Você também cria a classe `Pedido`.

:::info Guarde esta pergunta
Se o pedido é uma instância e o status dele muda de pendente para pago, o que acontece com quem guardou aquele pedido antes da mudança? A resposta é a regra mais importante do encontro.
:::
