---
title: Classes
summary: "A classe Tarefa do Projeto 3: a forma das tarefas, com constructor, this, métodos e get, e o botão Concluir."
module: classes-e-controle
duration_minutes: 90
objectives:
  - Criar uma classe e fazer instâncias dela com new
  - Guardar os dados de cada instância no constructor, com this
  - Escrever métodos e gets e escolher entre campo, get e método
  - Construir e testar a classe Tarefa do Projeto 3
---

# Classes

Programador Mobile · Encontro E18 · Aula 18 de 45

---

## O que você vai aprender

:::goal
- Criar uma **classe**, a forma, e fazer tarefas com ela usando `new`
- Preparar cada tarefa nova no `constructor`, com `this`
- Ensinar a tarefa a fazer coisas, com **métodos**, e a responder na hora, com `get`
- Escrever a classe `Tarefa` do Projeto 3, com testes, e ver o botão Concluir funcionar
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **classe** | a forma de um tipo de objeto, escrita uma vez, como a forma de bolo |
| **instância** | cada objeto feito com a classe pelo `new`, como cada bolo feito com a forma |
| **`constructor`** | a parte da classe que prepara cada instância nova (*constructor*, construtor) |
| **`this`** | dentro da classe, a própria instância: o "eu" do objeto (*this*, este) |
| **método** | uma função que mora dentro da classe: o que toda instância sabe fazer |
| **`get`** | um método lido como campo, sem parênteses, calculado na hora (*get*, obter) |

---

## A tarefa que ainda não sabe de si

No fim do E17, a tela mostra as 6 tarefas de demonstração, com o prazo em palavras e a cor da situação. Mas nenhuma tem botão.

::::columns
:::col
**Hoje**

- cada tarefa é só uma ficha de dados
- quem sabe as regras são as funções de `prazos.js`
- o aviso diz "Próximo passo: Etapa 2 · E18 · Tarefa.js"
:::
:::col
**No fim do encontro**

- cada tarefa nasce de uma forma, a classe `Tarefa`
- a própria tarefa responde: `luz.situacao(hoje)`
- o botão **Concluir** risca a tarefa
:::
::::

:::question
Uma tarefa escrita num papel não se risca sozinha. O que a sua tarefa deveria saber fazer, ou responder, sobre si mesma?
:::

---

## Classe e instância

Com uma forma de bolo, quantos bolos dá para fazer?

---

## :icon[boxes] A classe é a forma; a instância, o bolo

Uma **classe** é a forma de bolo: escrita uma vez, ela diz quais campos toda tarefa tem e o que toda tarefa sabe fazer. Cada **instância** é um bolo feito com a forma: os mesmos campos, cada um com os seus valores.

:::center
![Diagrama: a classe Tarefa é a forma, com os campos titulo, prioridade, prazo e concluida em branco e o método concluir; cada new faz uma tarefa com os próprios valores: luz, Pagar a conta de luz, alta, e racao, Comprar ração do gato, media](images/e18-forma-e-tarefas.svg)
:::

O **`new`** (novo) faz um bolo com a forma. Hoje, a forma é a `Tarefa`, e cada tarefa da lista é uma instância dela.

---

## :icon[boxes] Classe e instância na prática

**Caso 1: você já usou uma forma pronta.** No E12, o `new Date(...)` fez datas. O `Date` é uma classe que já vem com o JavaScript:

```javascript
const hoje = new Date(2026, 10, 10);
const prova = new Date(2026, 10, 15);

console.log(hoje.getDate());    // 10
console.log(prova.getDate());   // 15
```

**Caso 2: a sua primeira forma.** Uma classe vazia já faz instâncias, só que vazias:

```javascript
class Tarefa {}

const luz = new Tarefa();
const racao = new Tarefa();
console.log(luz);             // Tarefa {}
console.log(luz === racao);   // false
```

- A palavra **`class`** (classe) cria a forma; o que a forma tem vai entre as chaves: aqui, nada ainda
- O `console.log` mostra o nome da forma e, entre chaves, os campos do bolo: por enquanto, nenhum
- O nome da classe começa com **maiúscula**: `Tarefa` é a forma; `luz` e `racao`, os bolos
- `false`: são dois bolos, cada um no seu endereço (a referência, do E15)

---

## :icon[notebook-pen] Exercícios: Classe e instância

:::example Exercícios
1. Em `const linha42 = new Onibus();`, qual é a forma e qual é o bolo?
2. O que aparece no terminal?

   ```javascript
   class Lanche {}
   const a = new Lanche();
   const b = new Lanche();
   const c = a;
   console.log(a, a === b, a === c);
   ```

3. O Node para em `const pedido = Lanche();`. Corrija a linha.
4. Escreva a classe `Aluno` e faça duas instâncias dela, `ana` e `bruno`.
:::

:::tip Respostas
1. `Onibus` é a forma, a classe; `linha42` é o bolo, uma instância.
2. `Lanche {} false true`: `a` e `b` são dois bolos; `c` tem o mesmo endereço de `a` (E15).
3. `const pedido = new Lanche();`: sem o `new`, aparece `cannot be invoked without 'new'`.
4. `class Aluno {}`, depois `const ana = new Aluno();` e `const bruno = new Aluno();`.
:::

---

## O constructor

Na hora de fazer o bolo, o que você põe dentro da forma?

---

## :icon[factory] constructor: o preparo de cada tarefa

O **`constructor`** (construtor) prepara cada instância nova. O `new` chama o `constructor` uma vez para cada tarefa e entrega a ele uma ficha com os dados (um objeto, do E13): são os ingredientes do bolo.

```javascript
class Tarefa {
  constructor(dados) {
    this.titulo = dados.titulo;
    this.prioridade = dados.prioridade;
  }
}

const luz = new Tarefa({ titulo: 'Pagar a conta de luz', prioridade: 'alta' });
console.log(luz.titulo);   // Pagar a conta de luz
console.log(luz);          // Tarefa { titulo: 'Pagar a conta de luz', prioridade: 'alta' }
```

Dentro da classe, **`this`** é a própria tarefa que o `new` está fazendo. `this.titulo = dados.titulo` guarda o título da ficha **nesta** tarefa.

---

## :icon[list-ordered] O constructor em português

| Linha | O que ela diz |
|---|---|
| `class Tarefa {` | "esta é a forma `Tarefa`" |
| `constructor(dados) {` | "para cada tarefa nova, receba a ficha `dados`" |
| `this.titulo = dados.titulo;` | "o título desta tarefa é o título que veio na ficha" |
| `new Tarefa({ ... })` | "faça uma tarefa com esta ficha" |
| `const luz = ...` | "guarde a tarefa nova na caixa `luz`" |

O `new` faz três coisas, nesta ordem:

:::steps
1. Cria um objeto vazio, da forma `Tarefa`
2. Roda o `constructor`, com o `this` sendo esse objeto
3. Entrega o objeto pronto, que vai para a caixa `luz`
:::

---

## :icon[factory] O constructor na prática

**Caso 1: a mesma forma, valores diferentes.** Com a classe `Tarefa` de dois campos:

```javascript
const luz = new Tarefa({ titulo: 'Pagar a conta de luz', prioridade: 'alta' });
const racao = new Tarefa({ titulo: 'Comprar ração do gato', prioridade: 'media' });
console.log(luz.prioridade, racao.prioridade);   // alta media
```

**Caso 2: o que não veio na ficha.** Sem `prioridade` na ficha, o campo fica `undefined`. O `??` do E17 dá o valor de quando não vem: troca a caixa vazia (`null` ou `undefined`) pelo valor da direita.

```javascript
class Tarefa {
  constructor(dados) {
    this.titulo = dados.titulo;
    this.prioridade = dados.prioridade ?? 'media';
  }
}

const regar = new Tarefa({ titulo: 'Regar as plantas' });
console.log(regar.prioridade);   // media
```

---

## :icon[store] A classe no próprio arquivo

Cada classe mora num arquivo com o nome dela: `src/modelos/Tarefa.js`. Ela sai com o **`export default`** do E16, a peça principal da vitrine do arquivo:

```javascript
// src/modelos/Tarefa.js
export default class Tarefa {
  // o constructor e o resto da forma
}
```

```javascript
// src/modelos/Tarefa.test.js, na mesma pasta
import Tarefa from './Tarefa.js';
```

- O `import` de um `default` vai **sem chaves**: `import Tarefa`, e não `import { Tarefa }`
- O `.js` no fim é obrigatório: o Jest aceita sem, a tela no navegador não
- O nome do arquivo repete o nome da classe, com o **T maiúsculo**

---

## :icon[notebook-pen] Exercícios: O constructor

:::example Exercícios
1. Complete: `constructor(dados) { ___.turma = dados.turma; }`
2. O que aparece no terminal?

   ```javascript
   class Lanche {
     constructor(dados) {
       this.nome = dados.nome;
       this.preco = dados.preco ?? 10;
     }
   }
   const xSalada = new Lanche({ nome: 'X-salada' });
   const misto = new Lanche({ nome: 'Misto', preco: 8 });
   console.log(xSalada.preco, misto.preco);
   console.log(misto);
   ```

3. No `constructor`, `this.nome = nome;` dá `nome is not defined`. Corrija.
4. `Onibus.js` tem `export default class Onibus`. Qual serve: `import { Onibus }` ou `import Onibus`?
5. Escreva o `constructor` do `Pedido`: guarda a `mesa` e os `itens`; sem itens, `[]`.
:::

:::tip Respostas
1. `this`: o campo é desta instância.
2. `10 8` e `Lanche { nome: 'Misto', preco: 8 }`: sem preço na ficha, o `??` dá 10.
3. `this.nome = dados.nome;`: o nome vem na ficha `dados`.
4. `import Onibus from './Onibus.js';`: o `default` entra sem chaves.
5. `this.mesa = dados.mesa;` e `this.itens = dados.itens ?? [];` dentro de `constructor(dados)`.
:::

---

## :icon[milestone] Projeto 3 · Passo 1: a forma da tarefa

:::steps
1. No `lista-de-tarefas`, abra `src/modelos/Tarefa.js`: ele só tem o comentário do kit. Troque o comentário por este código
2. Na mesma pasta, crie `Tarefa.test.js` com os dois testes da forma
3. Rode `npm test` e, com o `npx serve .` do E17 ligado, recarregue a tela em `http://localhost:3000/web/`
:::

```javascript
// Etapa 2 (E18). A forma de todas as tarefas da lista.
export default class Tarefa {
  constructor(dados) {
    this.titulo = dados.titulo;
    this.prioridade = dados.prioridade ?? 'media';
    this.prazo = dados.prazo ?? null;
    this.concluida = dados.concluida ?? false;
  }
}
```

Em português: "a prioridade desta tarefa é a que veio na ficha; se não veio nada, `'media'`". Sem prazo, `null`; sem `concluida`, `false`: a tarefa nasce pendente.

---

## :icon[milestone] Projeto 3 · Passo 1: os testes da forma

Em `src/modelos/Tarefa.test.js`, a tarefa com a ficha completa e a tarefa só com o título:

```javascript
import Tarefa from './Tarefa.js';

test('a tarefa guarda o que recebeu', () => {
  const luz = new Tarefa({
    titulo: 'Pagar a conta de luz',
    prioridade: 'alta',
    prazo: '2026-11-12',
  });
  expect(luz.titulo).toBe('Pagar a conta de luz');
  expect(luz.prioridade).toBe('alta');
  expect(luz.prazo).toBe('2026-11-12');
  expect(luz.concluida).toBe(false);
});
```

```javascript
test('sem prioridade nem prazo, a tarefa é média, sem prazo e pendente', () => {
  const racao = new Tarefa({ titulo: 'Comprar ração do gato' });
  expect(racao.prioridade).toBe('media');
  expect(racao.prazo).toBe(null);
  expect(racao.concluida).toBe(false);
});
```

**Pronto quando:** `npm test` todo verde, com `Test Suites: 3 passed` (`Tests: 33 passed` no exemplo); na tela, "O que a página usa" mostra a Etapa 2 em 1 de 6.

---

## Métodos

O que uma tarefa deveria saber fazer sozinha?

---

## :icon[square-function] Método: uma função dentro da classe

Um **método** é uma função (a receita com nome, do E07) que mora dentro da classe: toda instância sabe fazer o que a forma ensina. O cofrinho é uma classe do dia a dia: o `constructor` recebe só o nome do dono, todo cofrinho começa com saldo 0, e cada um sabe `depositar`:

```javascript
class Cofrinho {
  constructor(dono) {
    this.dono = dono;
    this.saldo = 0;
  }

  depositar(valor) {
    this.saldo = this.saldo + valor;
  }
}

const daAna = new Cofrinho('Ana');
daAna.depositar(10);
daAna.depositar(5);
console.log(daAna.saldo);   // 15
```

:::warning
O método não leva a palavra `function`, e entre os métodos não há vírgula. Os dois erros param o teste com `Unexpected token`.
:::

---

## :icon[square-function] Métodos na prática

**Caso 1: você já usa métodos.** Primeiro o objeto, depois o ponto, o nome do método e os parênteses:

```javascript
const hoje = new Date(2026, 10, 10);
console.log('  Regar as plantas '.trim());   // Regar as plantas (o texto, do E09)
console.log(hoje.getDate());                 // 10 (a data, do E12)
```

**Caso 2: cada cofrinho, o seu saldo.** O método é um só, escrito na forma; cada instância guarda os próprios dados:

```javascript
const daAna = new Cofrinho('Ana');
const doBruno = new Cofrinho('Bruno');
daAna.depositar(10);
doBruno.depositar(2);
daAna.depositar(5);
console.log(daAna.saldo, doBruno.saldo);   // 15 2
```

No Projeto 3, a tarefa ganha o método `concluir()`: `regar.concluir()` conclui a `regar`, e só ela.

---

## :icon[notebook-pen] Exercícios: Métodos

:::example Exercícios
1. Chame o método `girar` da catraca `saida`.
2. O que aparece no terminal?

   ```javascript
   class Catraca {
     constructor() {
       this.passagens = 0;
     }
     girar() {
       this.passagens = this.passagens + 1;
     }
   }
   const entrada = new Catraca();
   const saida = new Catraca();
   entrada.girar();
   saida.girar();
   entrada.girar();
   console.log(entrada.passagens, saida.passagens);
   ```

3. Na classe `Garrafa`, a linha `function beber(gole) {` para o Node. Por quê?
4. Escreva o método `beber(gole)` da `Garrafa`, que tira o `gole` de `this.ml`.
:::

:::tip Respostas
1. `saida.girar();`: o objeto, o ponto, o nome do método e os parênteses.
2. `2 1`: o método é um só, e cada catraca guarda as próprias passagens.
3. Método não leva `function`: o Node mostra `Unexpected identifier 'beber'`.
4. `beber(gole) { this.ml = this.ml - gole; }`, dentro da classe.
:::

---

## O this

Quando a Ana diz "eu" e o Bruno diz "eu", é a mesma pessoa?

---

## :icon[user] this: o "eu" da instância

O **`this`** funciona como a palavra **eu**: quem é o "eu" depende de quem fala. Dentro da classe, `this` é a própria instância:

- no **`constructor`**, a que o `new` está fazendo agora
- num **método**, a que vem **antes do ponto** na chamada

```javascript
depositar(valor) {
  this.saldo = this.saldo + valor;   // "o meu saldo passa a ser o meu saldo mais o valor"
}
```

Em `daAna.depositar(10)`, quem fala é a `daAna`: o `this.saldo` é o saldo dela. Em `doBruno.depositar(2)`, é o do Bruno. O método é um só, e o `this` muda a cada chamada.

---

## :icon[user] this, chamada por chamada

Os dois cofrinhos começam com saldo 0:

| Chamada | `this` vale | A conta | O saldo depois |
|---|---|---|---|
| `daAna.depositar(10)` | `daAna` | `0 + 10` | Ana: 10 |
| `doBruno.depositar(2)` | `doBruno` | `0 + 2` | Bruno: 2 |
| `daAna.depositar(5)` | `daAna` | `10 + 5` | Ana: 15 |

**Sem o `this.`, o cofrinho não acha o próprio saldo:**

```javascript
depositar(valor) {
  saldo = saldo + valor;   // ReferenceError: saldo is not defined
}
```

Sozinho, `saldo` procura uma caixa (`const` ou `let`) com esse nome, e ela não existe. O saldo mora na instância: `this.saldo`. Dentro da classe, campo é sempre `this.` e o nome.

---

## :icon[notebook-pen] Exercícios: O this

:::example Exercícios
1. Em `daBia.correr(3)`, quem é o `this`?
2. O que aparece no terminal?

   ```javascript
   class Esteira {
     constructor() {
       this.km = 0;
     }
     correr(km) {
       this.km = this.km + km;
     }
   }
   const daAna = new Esteira();
   const daBia = new Esteira();
   daAna.correr(2);
   daBia.correr(3);
   daAna.correr(4);
   console.log(daAna.km, daBia.km);
   ```

3. O placar dá `ReferenceError: gols is not defined` em `marcar() { gols = gols + 1; }`. Corrija.
4. Escreva o método `zerar()` da `Esteira`, que volta o `km` dela a 0.
:::

:::tip Respostas
1. A `daBia`, que vem antes do ponto.
2. `6 3`: quando a `daAna` chama, o `this` é ela, e soma 2 e 4; a `daBia` soma só o 3.
3. `this.gols = this.gols + 1;`: o campo mora na instância.
4. `zerar() { this.km = 0; }`, dentro da classe.
:::

---

## :icon[milestone] Projeto 3 · Passo 2: concluir

Concluir é algo que a tarefa faz: um método. Em `Tarefa.js`, depois do `constructor` e ainda dentro da classe:

```javascript
// Etapa 2 (E18). A forma de todas as tarefas da lista.
export default class Tarefa {
  constructor(dados) {
    this.titulo = dados.titulo;
    this.prioridade = dados.prioridade ?? 'media';
    this.prazo = dados.prazo ?? null;
    this.concluida = dados.concluida ?? false;
  }

  concluir() {
    this.concluida = true;
  }
}
```

No fim de `Tarefa.test.js`, o teste. Em `regar.concluir()`, o `this` é a `regar`:

```javascript
test('concluir marca a tarefa como concluída', () => {
  const regar = new Tarefa({ titulo: 'Regar as plantas' });
  regar.concluir();
  expect(regar.concluida).toBe(true);
});
```

**Pronto quando:** `npm test` verde (`Tests: 34 passed` no exemplo); na tela, a Etapa 2 em 2 de 6.

---

## O get

Na balança da feira, você aperta um botão para ver o preço?

---

## :icon[eye] get: calculado na hora, lido sem parênteses

Um **`get`** (obter) é como o visor da balança da feira: você só olha, e o número é calculado na hora, a partir do que está no prato. É um método com a palavra `get` na frente, que se **lê como um campo**, sem parênteses:

```javascript
class Cofrinho {
  // o constructor e o depositar continuam iguais

  get vazio() {
    return this.saldo === 0;
  }
}

const daAna = new Cofrinho('Ana');
console.log(daAna.vazio);   // true
daAna.depositar(10);
console.log(daAna.vazio);   // false
```

- O `get` sempre tem `return`: o que ele devolve é o valor lido
- Ninguém guardou `vazio`: cada leitura faz a conta de novo, com o saldo de agora

---

## :icon[eye] get na prática

**Caso 1: um texto pronto para mostrar.** Com a template string do E06, dentro da classe `Cofrinho`:

```javascript
get resumo() {
  return `${this.dono}: R$ ${this.saldo}`;
}
```

```javascript
const daAna = new Cofrinho('Ana');
daAna.depositar(10);
console.log(daAna.resumo);   // Ana: R$ 10
daAna.depositar(5);
console.log(daAna.resumo);   // Ana: R$ 15
console.log(daAna);          // Cofrinho { dono: 'Ana', saldo: 15 }
```

O `console.log(daAna)` mostra só os campos guardados: o `get` não fica guardado, é calculado.

**Caso 2: com parênteses, quebra.** `daAna.vazio()` dá `TypeError: daAna.vazio is not a function`. O `get` já devolveu `false`, e `false` não é uma função.

---

## :icon[notebook-pen] Exercícios: O get

:::example Exercícios
1. O ônibus tem `get lotado`. Qual lê certo: `linha42.lotado` ou `linha42.lotado()`?
2. O que aparece no terminal?

   ```javascript
   class Onibus {
     constructor() {
       this.passageiros = 0;
     }
     get lotado() {
       return this.passageiros >= 40;
     }
   }
   const linha42 = new Onibus();
   console.log(linha42.lotado);
   linha42.passageiros = 40;
   console.log(linha42.lotado);
   console.log(linha42);
   ```

3. Complete: `___ total() { ___ this.preco * this.quantidade; }`
4. O que dá `console.log(linha42.lotado());`?
:::

:::tip Respostas
1. `linha42.lotado`: o `get` se lê sem parênteses.
2. `false`, `true` e `Onibus { passageiros: 40 }`: o `get` faz a conta a cada leitura e não fica guardado.
3. `get` e `return`: o `get` sempre devolve o valor lido.
4. `TypeError: linha42.lotado is not a function`: o `get` já devolveu um `true` ou `false`.
:::

---

## :icon[milestone] Projeto 3 · Passo 3: o rótulo da prioridade

O código guarda `'media'`, sem acento; a tela mostra "Média". O rótulo sai da prioridade, sem receber nada: é um `get`. Em `Tarefa.js`, depois do `concluir()`, ainda dentro da classe:

```javascript
  get rotuloDaPrioridade() {
    switch (this.prioridade) {
      case 'alta':
        return 'Alta';
      case 'media':
        return 'Média';
      case 'baixa':
        return 'Baixa';
      default:
        return 'Sem prioridade';
    }
  }
```

É o `switch` do E17, olhando `this.prioridade`, a prioridade desta tarefa:

| `this.prioridade` | O `case` que bate | O `get` devolve |
|---|---|---|
| `'alta'` | `case 'alta'` | `'Alta'` |
| `'media'` | `case 'media'` | `'Média'` |
| `'urgente'` | nenhum: `default` | `'Sem prioridade'` |

---

## :icon[milestone] Projeto 3 · Passo 3: o teste do rótulo

No fim de `Tarefa.test.js`, um `test.each` com as três prioridades. Repare em `prova.rotuloDaPrioridade`, **sem parênteses**:

```javascript
test.each([
  ['alta', 'Alta'],
  ['media', 'Média'],
  ['baixa', 'Baixa'],
])('o rótulo da prioridade %s é %s', (prioridade, rotulo) => {
  const prova = new Tarefa({ titulo: 'Estudar para a prova', prioridade: prioridade });
  expect(prova.rotuloDaPrioridade).toBe(rotulo);
});
```

Cada linha da lista vira um teste: o `%s` do nome troca pelos valores da linha, como no E08.

**Pronto quando:** `npm test` verde (`Tests: 37 passed` no exemplo); na tela, a Etapa 2 em 3 de 6, e o aviso pede o `get peso`. A tela só passa a usar a sua classe quando ela tiver os 6 itens.

---

## :icon[circle-help] Campo, get ou método?

| Use | Quando | Na `Tarefa` |
|---|---|---|
| campo | o valor fica guardado | `titulo`, `prazo`, `concluida` |
| `get` | o valor sai dos campos, sem receber nada | `rotuloDaPrioridade` |
| método | faz algo, ou precisa receber um valor | `concluir()` |

Trocar um pelo outro quebra:

- `get` com parênteses dá `TypeError: ... is not a function`
- método sem parênteses devolve a própria função: o teste mostra `Received: [Function ...]`

:::example Pense
O cofrinho vai dizer se dá para comprar algo de certo preço. É `get` ou método?
:::

:::tip Resposta
Método, `podeComprar(preco)`: ele precisa receber o preço, e um `get` não recebe nada.
:::

---

## :icon[milestone] Projeto 3 · Sua vez: peso, situação e prazo em texto

Agora, sozinho: complete a `Tarefa`, com um teste por resultado (são cinco):

| Escreva | Devolve |
|---|---|
| `get peso` | o `pesoDaPrioridade` da prioridade: `3` numa tarefa `'alta'` |
| `situacao(hoje)` | concluída: `'concluida'`; senão, a `situacaoDoPrazo` do prazo: `'atrasada'` com `'2026-11-09'` |
| `prazoEmTexto(hoje)` | concluída: `'Concluída'`; senão, o `textoDoPrazo` do prazo: `'Vence hoje'` com `'2026-11-10'` |

:::tip Dicas
- Importe as três funções de `'../regras/prazos.js'` no topo; no teste, o `HOJE` do `prazos.test.js`
- No método, o prazo é `this.prazo`, e o `hoje` vem pelo parâmetro: o método só chama a função
:::

**Pronto quando:** `npm test` verde; na tela, o botão **Concluir** risca a tarefa; Etapa 2 em 6 de 6.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `cannot be invoked without 'new'` | faltou o `new` | `new Tarefa({ ... })` |
| `_Tarefa.default is not a constructor` | falta o `export default` | `export default class Tarefa` |
| `Cannot read properties of undefined (reading 'titulo')` | `new Tarefa()` sem a ficha | `new Tarefa({ titulo: '...' })` |
| `is not a function`, num `get` | o `get` foi lido com `()` | `tarefa.peso`, sem `()` |
| `Expected: true`, `Received: false`, no `concluir` | faltou o `this.` | `this.concluida = true;` |
| `situacaoDoPrazo is not defined` | faltou o `import` | o `import` no topo de `Tarefa.js` |

---

## :icon[milestone] Projeto 3 · Etapa 2 pronta

- `src/modelos/Tarefa.js` com o `constructor`, o `concluir()`, os gets `rotuloDaPrioridade` e `peso` e os métodos `situacao(hoje)` e `prazoEmTexto(hoje)`
- `src/modelos/Tarefa.test.js` com um teste para cada um; `npm test` todo verde (`Tests: 42 passed` no exemplo)
- Na tela: o botão **Concluir** em cada tarefa pendente; "O que a página usa" com a Etapa 2 em 6 de 6

```bash
git add .
git commit -m "Projeto 3: etapa 2, classe Tarefa"
git push
```

Faltou alguma parte? Termine em casa, pelo enunciado do Projeto 3, e faça o commit antes do E19: a etapa 3 começa da `Tarefa` completa.

---

## Resumo

:::summary
- A **classe** é a forma; cada **instância** é um bolo feito com ela pelo `new`
- O `constructor` prepara cada instância nova com a ficha de dados; o `??` dá o valor de quando não vem
- Dentro da classe, `this` é a própria instância: a que está nascendo, ou a que vem antes do ponto
- Um **método** é uma função da classe, chamada com ponto e parênteses: `regar.concluir()`
- Um `get` é calculado na hora e lido sem parênteses: `prova.rotuloDaPrioridade`
- A classe sai com `export default class Tarefa` e entra com `import Tarefa from './Tarefa.js'`
:::

---

## :icon[arrow-right] Próximos passos

No E19, Herança e composição, a lista de tarefas fica completa:

- :icon[repeat] a tarefa que se repete é **um tipo de** tarefa: herda tudo da `Tarefa` e acrescenta a frequência
- :icon[layout-list] a `ListaDeTarefas` guarda as tarefas e dá um número a cada uma
- :icon[square-check] na tela, o formulário, o Remover e a tarefa semanal que ganha a próxima ao ser concluída
