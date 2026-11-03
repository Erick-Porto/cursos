---
title: Herança e composição
summary: "A tarefa que se repete herda da Tarefa, e a lista guarda as tarefas: a tela do Projeto 3 funciona inteira."
module: classes-e-controle
duration_minutes: 90
objectives:
  - Criar uma classe filha com extends e montar a parte da mãe com super
  - Sobrescrever um método e reaproveitar o da mãe com super.concluir()
  - Montar uma classe que guarda outros objetos e cuida deles pelos métodos
  - Escolher a classe pelos dados e concluir qualquer tarefa sem perguntar o tipo dela
---

# Herança e composição

Programador Mobile · Encontro E19 · Aula 19 de 45

---

## O que você vai aprender

:::goal
- Criar a `TarefaRecorrente`, um tipo de tarefa, com `extends` e `super`
- Fazer a recorrente concluir do jeito dela e gerar a próxima vez
- Montar a `ListaDeTarefas`, a classe que guarda as tarefas e dá um número a cada uma
- Pedir "conclua" a qualquer tarefa sem perguntar o tipo dela
- Ver a tela do Projeto 3 funcionar inteira: formulário, Concluir e Remover
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **herança** | uma classe, a **filha**, aproveita tudo o que outra, a **mãe**, tem e acrescenta o seu |
| **`extends`** | a palavra que diz quem é a mãe (*extends*, estende) |
| **`super`** | a palavra que chama o que é da mãe: o `constructor` ou um método dela |
| **sobrescrever** | escrever na filha um método com o mesmo nome do da mãe; vale o da filha |
| **polimorfismo** | o mesmo pedido, e cada objeto responde do seu jeito (*poli*, muitas; *morfo*, formas) |
| **composição** | um objeto que guarda outros objetos e cuida deles |

---

## Regar as plantas, toda semana

A tela do Projeto 3 já mostra as tarefas com prazo e cor, e o Concluir risca. Mas ainda não é uma lista de verdade:

| Hoje, no fim do E18 | No fim de hoje |
|---|---|
| concluir "Regar as plantas" só risca | concluir faz nascer a rega da semana que vem |
| o formulário está desligado | o formulário adiciona tarefas |
| não há como tirar uma tarefa | cada tarefa tem o Remover |
| ninguém conta as tarefas | o topo mostra "5 pendentes · 1 atrasada · 1 concluída" |

:::tip Para ver a tela
Na raiz do projeto, `npx serve .` e abra `http://localhost:3000/web/`. Salvou um arquivo? Recarregue a página.
:::

---

## Herança

Regar as plantas toda semana: é outra coisa, ou uma tarefa com algo a mais?

---

## :icon[list-tree] Herança: um tipo de tarefa

O cartão é um tipo de pagamento: herda o que todo pagamento tem e acrescenta o seu, as parcelas. A tarefa que se repete é um tipo de tarefa: herda tudo o que a `Tarefa` tem e acrescenta a **frequência**. Isso é **herança**: a classe **filha** aproveita a classe **mãe** inteira.

```javascript
import Tarefa from './Tarefa.js';

export default class TarefaRecorrente extends Tarefa {
  constructor(dados) {
    super(dados);
    this.frequencia = dados.frequencia ?? 'semanal';
  }
}
```

- **`extends Tarefa`**: "é um tipo de `Tarefa`". A filha ganha os campos, os métodos e os `get` da mãe
- **`super(dados)`**: "monte primeiro a parte da mãe". Roda o `constructor` da `Tarefa` com a mesma ficha
- Depois do `super`, o que só a filha tem: a frequência, `'semanal'` quando não vem (o `??` do E17)

---

## :icon[list-tree] Herança na prática

**Caso 1: a filha responde ao que nunca escreveu.** A `TarefaRecorrente` só tem o `constructor`, e sabe tudo o que a `Tarefa` sabe:

```javascript
const hoje = new Date(2026, 10, 10); // 10 de novembro de 2026
const regar = new TarefaRecorrente({ titulo: 'Regar as plantas', prazo: '2026-11-10' });

console.log(regar.rotuloDaPrioridade); // Média
console.log(regar.peso);               // 2
console.log(regar.prazoEmTexto(hoje)); // Vence hoje
console.log(regar.frequencia);         // semanal
```

**Caso 2: o `this` antes do `super`.** Com as duas linhas do `constructor` trocadas de lugar, o Node para:

```plaintext
ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor
```

*Derived class* é a classe filha. Ela chama o `super` antes de usar o `this`: a parte da mãe vem primeiro.

---

## :icon[milestone] Projeto 3 · Passo 1: a tarefa que se repete

O kit deixou `src/modelos/TarefaRecorrente.js` só com um comentário. Troque o comentário pela classe:

```javascript
import Tarefa from './Tarefa.js';

// Etapa 3 (E19). Uma tarefa que se repete: tem tudo o que a Tarefa tem, mais a frequência.
export default class TarefaRecorrente extends Tarefa {
  constructor(dados) {
    super(dados);
    this.frequencia = dados.frequencia ?? 'semanal';
  }
}
```

- `'./Tarefa.js'` começa com `./`: a mãe mora na mesma pasta, `src/modelos`
- O `.js` no fim é obrigatório: sem ele, o navegador não acha o arquivo e a tela para

Os testes ficam ao lado, num arquivo novo: `TarefaRecorrente.test.js`.

---

## :icon[milestone] Projeto 3 · Passo 1: os testes da recorrente

Crie `src/modelos/TarefaRecorrente.test.js` com o primeiro teste:

```javascript
import TarefaRecorrente from './TarefaRecorrente.js';

test('a recorrente tem tudo o que a tarefa tem, mais a frequência', () => {
  const regar = new TarefaRecorrente({
    titulo: 'Regar as plantas',
    prazo: '2026-11-10',
    frequencia: 'diaria',
  });
  expect(regar.titulo).toBe('Regar as plantas');
  expect(regar.prioridade).toBe('media');
  expect(regar.rotuloDaPrioridade).toBe('Média');
  expect(regar.frequencia).toBe('diaria');
});
```

Logo abaixo, depois de uma linha em branco, o segundo:

```javascript
test('sem frequência, a recorrente é semanal', () => {
  const regar = new TarefaRecorrente({ titulo: 'Regar as plantas', prazo: '2026-11-10' });
  expect(regar.frequencia).toBe('semanal');
});
```

O primeiro teste mostra a herança: o `rotuloDaPrioridade` não foi escrito na `TarefaRecorrente`, e passa.

**Pronto quando:** `npm test` todo verde (com estes testes, `Tests: 44 passed` e `Test Suites: 4 passed`). Na tela, a lista **O que a página usa** mostra a Etapa 3 em 1 de 6.

---

## Sobrescrever

Você conclui a rega de hoje. Quem cria a rega da semana que vem?

---

## :icon[square-pen] Sobrescrever: cada uma conclui do seu jeito

Herdado, o `concluir()` da recorrente é o da `Tarefa`: só risca. Para gerar a próxima vez, a filha escreve um método com o **mesmo nome**. Isso é **sobrescrever**: quando alguém chama `concluir`, vale o da filha.

```javascript
concluir(hoje) {
  super.concluir();
  return new TarefaRecorrente({
    titulo: this.titulo,
    prioridade: this.prioridade,
    prazo: proximoPrazo(this.prazo, this.frequencia, hoje),
    frequencia: this.frequencia,
  });
}
```

No caixa, o pedido é o mesmo, "pague", e cada forma de pagamento faz do seu jeito. Na lista, o pedido é "conclua": a tarefa comum só risca; a recorrente risca e gera a próxima. Isso é o **polimorfismo**: o mesmo pedido, e cada tipo responde do seu jeito.

---

## :icon[list-ordered] O concluir em português

| Linha | O que ela diz |
|---|---|
| `concluir(hoje) {` | "o mesmo nome do método da mãe"; este recebe o hoje |
| `super.concluir();` | "faça o que toda tarefa faz ao concluir": marque `concluida`. O `super` com ponto chama um método da mãe |
| `return new TarefaRecorrente({` | "devolva uma recorrente nova, com esta ficha:" |
| `titulo: this.titulo,` | "o mesmo título"; a prioridade e a frequência passam iguais |
| `prazo: proximoPrazo(...)` | "o prazo da próxima vez", com a função do E17 |

Na `Tarefa`, o `concluir()` ganha `return null;`: o **`null`** do E10, o "nada" de propósito. A tarefa comum avisa que **não nasce nenhuma**.

---

## :icon[square-pen] Polimorfismo na prática

**Caso 1: o mesmo pedido, três respostas.** A mesma linha, `tarefa.concluir(hoje)`, roda o `concluir` de cada tarefa:

```javascript
const hoje = new Date(2026, 10, 10); // 10 de novembro de 2026
const tarefas = [
  new Tarefa({ titulo: 'Pagar a conta de luz', prazo: '2026-11-12' }),
  new TarefaRecorrente({ titulo: 'Regar as plantas', prazo: '2026-11-10' }),
  new TarefaRecorrente({ titulo: 'Tomar o remédio', prazo: '2026-11-10', frequencia: 'diaria' }),
];
for (const tarefa of tarefas) {
  const proxima = tarefa.concluir(hoje);
  console.log(tarefa.titulo, '->', proxima === null ? 'nada nasce' : proxima.prazo);
}
// Pagar a conta de luz -> nada nasce
// Regar as plantas -> 2026-11-17
// Tomar o remédio -> 2026-11-11
```

- O `for...of` do E11 faz o pedido a cada tarefa; o ternário do E10 escolhe o que mostrar
- Nenhum `if` pergunta "você é recorrente?": cada tarefa sabe concluir
- A comum recebe o `hoje` e não usa: o argumento que sobra é ignorado

**Caso 2: duas regas.** A de hoje fica riscada; a da semana que vem nasce pendente:

```javascript
const regar = new TarefaRecorrente({ titulo: 'Regar as plantas', prazo: '2026-11-10' });
const proxima = regar.concluir(hoje);
console.log(regar.concluida, proxima.concluida); // true false
```

---

## :icon[milestone] Projeto 3 · Passo 2: a comum devolve null

Em `src/modelos/Tarefa.js`, o `concluir()` ganha um comentário em cima e uma linha no fim. O resto da classe continua igual:

```javascript
  // Etapa 3 (E19): devolve a tarefa que nasce depois desta. A comum não gera nenhuma.
  concluir() {
    this.concluida = true;
    return null;
  }
```

Em `src/modelos/Tarefa.test.js`, logo depois do teste do `concluir`, um teste novo:

```javascript
test('concluir uma tarefa comum devolve null', () => {
  const luz = new Tarefa({ titulo: 'Pagar a conta de luz' });
  expect(luz.concluir()).toBe(null);
});
```

Sem o `return null`, o `concluir` devolve `undefined`, e este teste fica vermelho: `Expected: null`, `Received: undefined`.

---

## :icon[milestone] Projeto 3 · Passo 2: a recorrente gera a próxima

Em `src/modelos/TarefaRecorrente.js`, um `import` novo logo abaixo do primeiro. Depois do `constructor`, ainda dentro da classe, o `concluir(hoje)`:

```javascript
import Tarefa from './Tarefa.js';
import { proximoPrazo } from '../regras/prazos.js';

// ... o comentário, a classe e o constructor continuam iguais

  // Concluir faz o que toda tarefa faz e devolve a próxima vez desta.
  concluir(hoje) {
    super.concluir();
    return new TarefaRecorrente({
      titulo: this.titulo,
      prioridade: this.prioridade,
      prazo: proximoPrazo(this.prazo, this.frequencia, hoje),
      frequencia: this.frequencia,
    });
  }
```

- `'../regras/prazos.js'`: o `..` sobe uma pasta, de `modelos` para `src`, e entra em `regras`, o arquivo da etapa 1
- `{ proximoPrazo }` vem entre chaves: no E17, a função saiu com `export` e nome

---

## :icon[milestone] Projeto 3 · Passo 2: os testes da recorrente

Em `TarefaRecorrente.test.js`, logo abaixo do `import`:

```javascript
const HOJE = new Date(2026, 10, 10); // 10 de novembro de 2026 (o mês começa em 0)
```

No fim do arquivo, depois dos dois testes do passo 1, o primeiro teste novo:

```javascript
test('concluir a recorrente conclui esta e devolve a próxima', () => {
  const regar = new TarefaRecorrente({
    titulo: 'Regar as plantas',
    prazo: '2026-11-10',
    frequencia: 'semanal',
  });
  const proxima = regar.concluir(HOJE);
  expect(regar.concluida).toBe(true);
  expect(proxima.titulo).toBe('Regar as plantas');
  expect(proxima.prazo).toBe('2026-11-17');
  expect(proxima.concluida).toBe(false);
  expect(proxima.frequencia).toBe('semanal');
});
```

E o segundo, no fim:

```javascript
test('a próxima diária vence amanhã', () => {
  const remedio = new TarefaRecorrente({
    titulo: 'Tomar o remédio',
    prazo: '2026-11-10',
    frequencia: 'diaria',
  });
  expect(remedio.concluir(HOJE).prazo).toBe('2026-11-11');
});
```

**Pronto quando:** `npm test` todo verde (`Tests: 47 passed`). Na tela, a Etapa 3 em 2 de 6. A tela ainda não usa a recorrente: ela precisa da lista.

---

## Composição

Na lista de compras do mercado, onde ficam os itens? E onde você risca?

---

## :icon[clipboard-list] Composição: a lista guarda as tarefas

A lista de compras guarda os itens; quem risca um item, risca na própria lista. A **`ListaDeTarefas`** faz o mesmo com as tarefas: guarda todas num campo, `this.tarefas`, e cuida delas pelos métodos. Um objeto que guarda outros é **composição**.

:::center
![Diagrama: à esquerda, a TarefaRecorrente aponta para a Tarefa com a seta "é uma", a herança com extends; à direita, a ListaDeTarefas guarda em this.tarefas as tarefas 1, 2 e 3; embaixo, riscado: a lista não é uma tarefa, ela guarda tarefas](images/e19-herda-ou-guarda.svg)
:::

Para escolher, pergunte: "a recorrente **é uma** tarefa?" Sim: herança. "A lista é uma tarefa?" Não: ela **guarda** tarefas. Composição.

---

## :icon[list-ordered] A lista por dentro

```javascript
export default class ListaDeTarefas {
  constructor() {
    this.tarefas = [];
    this.proximoId = 1;
  }

  adicionar(tarefa) {
    tarefa.id = this.proximoId;
    this.proximoId = this.proximoId + 1;
    this.tarefas.push(tarefa);
    return tarefa;
  }
}
```

| Linha | O que ela diz |
|---|---|
| `constructor() {` | "a lista nasce sem receber nada" |
| `this.tarefas = [];` | "a fileira de gavetas onde as tarefas vão morar começa vazia" |
| `tarefa.id = this.proximoId;` | "escreva o número na ficha da tarefa": um campo novo, como no E13 |
| `this.proximoId = this.proximoId + 1;` | "o próximo número sobe um" |
| `this.tarefas.push(tarefa);` | "guarde no fim da fileira", com o `push` do E11 |
| `return tarefa;` | "devolva a mesma tarefa, agora com o número" |

---

## :icon[clipboard-list] Composição na prática

**Caso 1: cada tarefa ganha um número.**

```javascript
const lista = new ListaDeTarefas();
const luz = lista.adicionar(new Tarefa({ titulo: 'Pagar a conta de luz' }));
const racao = lista.adicionar(new Tarefa({ titulo: 'Comprar ração do gato' }));

console.log(luz.id, racao.id);     // 1 2
console.log(lista.tarefas.length); // 2
console.log(lista.proximoId);      // 3
```

**Caso 2: quem risca, risca na própria lista.** O `buscar(2)` acha a tarefa pelo número, com o `find` do E14. Ela não é uma cópia: é a mesma da lista, como dois papéis com o mesmo endereço levam à mesma casa (E15).

```javascript
const achada = lista.buscar(2);
achada.concluir();
console.log(lista.tarefas[1].concluida); // true
console.log(lista.buscar(99));           // undefined
```

Nenhuma tarefa tem o número 99: o `find` não acha e devolve `undefined`.

---

## :icon[milestone] Projeto 3 · Passo 3: a lista que guarda tarefas

Em `src/modelos/ListaDeTarefas.js`, troque o comentário do kit pela classe:

```javascript
// Etapa 3 (E19). A lista guarda as tarefas e dá um número (id) a cada uma.
export default class ListaDeTarefas {
  constructor() {
    this.tarefas = [];
    this.proximoId = 1;
  }

  adicionar(tarefa) {
    tarefa.id = this.proximoId;
    this.proximoId = this.proximoId + 1;
    this.tarefas.push(tarefa);
    return tarefa;
  }
```

Logo abaixo, depois de uma linha em branco, o `buscar` e a chave que fecha a classe:

```javascript
  buscar(id) {
    return this.tarefas.find((tarefa) => tarefa.id === id);
  }
}
```

`buscar(id)` diz: "ache a tarefa com este número". É o `buscarPorId` da agenda, do E14, agora como método da lista.

---

## :icon[milestone] Projeto 3 · Passo 3: os testes da lista

Crie `src/modelos/ListaDeTarefas.test.js`:

```javascript
import ListaDeTarefas from './ListaDeTarefas.js';
import Tarefa from './Tarefa.js';

test('a lista começa vazia', () => {
  const lista = new ListaDeTarefas();
  expect(lista.tarefas).toEqual([]);
});
```

```javascript
test('adicionar dá um número a cada tarefa', () => {
  const lista = new ListaDeTarefas();
  const luz = lista.adicionar(new Tarefa({ titulo: 'Pagar a conta de luz' }));
  const racao = lista.adicionar(new Tarefa({ titulo: 'Comprar ração do gato' }));
  expect(luz.id).toBe(1);
  expect(racao.id).toBe(2);
  expect(lista.tarefas.length).toBe(2);
});
```

```javascript
test('buscar acha a tarefa pelo número', () => {
  const lista = new ListaDeTarefas();
  lista.adicionar(new Tarefa({ titulo: 'Pagar a conta de luz' }));
  lista.adicionar(new Tarefa({ titulo: 'Comprar ração do gato' }));
  expect(lista.buscar(2).titulo).toBe('Comprar ração do gato');
  expect(lista.buscar(99)).toBe(undefined);
});
```

**Pronto quando:** `npm test` todo verde (`Tests: 50 passed`, `Test Suites: 5 passed`). Na tela, a Etapa 3 em 3 de 6.

---

## Escolher a forma

No formulário, você marca "Toda semana" ou "Não repete". Qual forma de bolo usar?

---

## :icon[split] criarTarefa: os dados escolhem a forma

A tela só tem os **dados** do formulário, numa ficha. Quem escolhe a forma de bolo, a `Tarefa` ou a `TarefaRecorrente`, é a função **`criarTarefa`**:

```javascript
export function criarTarefa(dados) {
  if (dados.frequencia) {
    return new TarefaRecorrente(dados);
  }
  return new Tarefa(dados);
}
```

- Ela mora em `ListaDeTarefas.js`, **fora** da classe, com `export` e nome: uma função comum, como as do E07
- `if (dados.frequencia)` pergunta "veio uma frequência?". Como no `if (nome)` da aula 3, um texto com letras conta como sim; `undefined` e o texto vazio, `''`, contam como não
- O primeiro `return` já sai da função: é o retorno antecipado do E17

---

## :icon[split] criarTarefa na prática

| A ficha que chega | O `if` responde | `criarTarefa` devolve |
|---|---|---|
| `{ titulo: 'Regar as plantas', frequencia: 'semanal' }` | sim | uma `TarefaRecorrente` |
| `{ titulo: 'Pagar a conta de luz' }` | não: `undefined` | uma `Tarefa` |
| `{ titulo: 'Estudar para a prova', frequencia: '' }` | não: texto vazio | uma `Tarefa` |

```javascript
const regar = criarTarefa({ titulo: 'Regar as plantas', prazo: '2026-11-10', frequencia: 'semanal' });
const luz = criarTarefa({ titulo: 'Pagar a conta de luz' });
console.log(regar.frequencia); // semanal
console.log(luz.frequencia);   // undefined: a Tarefa comum nem tem esse campo
```

No **Adicionar tarefa**, a tela faz `lista.adicionar(criarTarefa(dados))`. Para usar as duas coisas num arquivo, um `import` só:

```javascript
import ListaDeTarefas, { criarTarefa } from './ListaDeTarefas.js';
```

O `export default` vem sem chaves; o `export` com nome, entre chaves. É a vitrine do E16, numa linha.

---

## :icon[milestone] Projeto 3 · Passo 4: concluir e remover pela lista

Em `ListaDeTarefas.js`, no topo, antes do comentário da classe, os dois `import` e o `criarTarefa`:

```javascript
import Tarefa from './Tarefa.js';
import TarefaRecorrente from './TarefaRecorrente.js';

// Etapa 3 (E19). Os dados dizem qual forma usar: quem tem frequência se repete.
export function criarTarefa(dados) {
  if (dados.frequencia) {
    return new TarefaRecorrente(dados);
  }
  return new Tarefa(dados);
}
```

Dentro da classe, depois do `buscar`, dois métodos novos:

```javascript
  concluir(id, hoje) {
    const tarefa = this.buscar(id);
    const proxima = tarefa.concluir(hoje);
    if (proxima !== null) {
      this.adicionar(proxima);
    }
  }

  remover(id) {
    this.tarefas = this.tarefas.filter((tarefa) => tarefa.id !== id);
  }
```

O `remover` é a peneira do `removerContato` do E15: fica quem tem outro número, e a lista nova vai para `this.tarefas`.

---

## :icon[waypoints] Concluir pela lista, passo a passo

No clique em Concluir, a tela chama `lista.concluir(id, hoje)`. Numa lista só com a "Regar as plantas", semanal, número 1, prazo `'2026-11-10'`, e hoje em 10/11/2026:

| Quem | Faz o quê | E devolve |
|---|---|---|
| `this.buscar(1)` | acha a tarefa 1 | a "Regar as plantas", uma `TarefaRecorrente` |
| `tarefa.concluir(hoje)` | roda o `concluir` **da recorrente**: risca e cria a próxima | a rega do dia 17 |
| `if (proxima !== null)` | "nasceu alguma?" Sim | |
| `this.adicionar(proxima)` | dá o número 2 e guarda | a rega nova |

Numa tarefa comum, o `concluir` devolve `null`, e o `if` pula o `adicionar`. A lista não pergunta o tipo: quem sabe concluir é a tarefa.

---

## :icon[milestone] Projeto 3 · Passo 4: os testes do concluir

Em `ListaDeTarefas.test.js`, troque os dois `import` do topo por estes três e acrescente o `HOJE`:

```javascript
import ListaDeTarefas, { criarTarefa } from './ListaDeTarefas.js';
import Tarefa from './Tarefa.js';
import TarefaRecorrente from './TarefaRecorrente.js';

const HOJE = new Date(2026, 10, 10); // 10 de novembro de 2026 (o mês começa em 0)
```

No fim do arquivo, os testes do `concluir`:

```javascript
test('concluir a recorrente acrescenta a próxima', () => {
  const lista = new ListaDeTarefas();
  lista.adicionar(
    new TarefaRecorrente({
      titulo: 'Regar as plantas',
      prazo: '2026-11-10',
      frequencia: 'semanal',
    }),
  );
  lista.concluir(1, HOJE);
  expect(lista.tarefas.length).toBe(2);
  expect(lista.buscar(1).concluida).toBe(true);
  expect(lista.buscar(2).prazo).toBe('2026-11-17');
});
```

```javascript
test('concluir uma tarefa comum não acrescenta nada', () => {
  const lista = new ListaDeTarefas();
  lista.adicionar(new Tarefa({ titulo: 'Pagar a conta de luz' }));
  lista.concluir(1, HOJE);
  expect(lista.tarefas.length).toBe(1);
  expect(lista.buscar(1).concluida).toBe(true);
});
```

---

## :icon[milestone] Projeto 3 · Passo 4: os testes do remover e do criarTarefa

Ainda no fim de `ListaDeTarefas.test.js`:

```javascript
test('remover tira a tarefa da lista', () => {
  const lista = new ListaDeTarefas();
  lista.adicionar(new Tarefa({ titulo: 'Pagar a conta de luz' }));
  lista.adicionar(new Tarefa({ titulo: 'Comprar ração do gato' }));
  lista.remover(1);
  expect(lista.tarefas.length).toBe(1);
  expect(lista.buscar(1)).toBe(undefined);
});
```

```javascript
test('criarTarefa escolhe a forma pelos dados', () => {
  const regar = criarTarefa({
    titulo: 'Regar as plantas',
    prazo: '2026-11-10',
    frequencia: 'semanal',
  });
  const luz = criarTarefa({ titulo: 'Pagar a conta de luz' });
  expect(regar.frequencia).toBe('semanal');
  expect(luz.frequencia).toBe(undefined);
});
```

**Pronto quando:** `npm test` todo verde (`Tests: 54 passed`) e **a tela inteira funciona**: o formulário adiciona, cada tarefa tem Concluir e Remover, e concluir a "Regar as plantas" faz nascer outra, "Vence em 7 dias", com o selo "Toda semana". A Etapa 3 em 5 de 6.

---

## :icon[milestone] Projeto 3 · Sua vez: o resumo

Agora, sozinho. Escreva o método `resumo(hoje)` da `ListaDeTarefas`. Ele devolve uma ficha com três números, `{ pendentes, atrasadas, concluidas }`. A atrasada conta só se estiver pendente.

Dois testes, com o `HOJE`:

1. Prazos `'2026-11-08'` e `'2026-11-15'` e uma concluída: `{ pendentes: 2, atrasadas: 1, concluidas: 1 }`
2. A lista vazia: tudo zero

:::tip Dicas
- Duas peneiras: as pendentes (`filter` com `!tarefa.concluida`) e, delas, as atrasadas, pela `situacao(hoje)`
- Cada número é o `.length` de uma peneira. As concluídas são o total menos as pendentes
:::

**Pronto quando:** `npm test` todo verde e, na tela, o topo da lista mostra "5 pendentes · 1 atrasada · 1 concluída" e acompanha cada clique. A Etapa 3 em 6 de 6.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Must call super constructor` | o `this` veio antes do `super` | `super(dados);` na primeira linha |
| `Tarefa is not defined` | faltou o `import` da mãe | `import Tarefa from './Tarefa.js';` |
| `(setting 'id')` | um `concluir` devolveu `undefined` | `return null;` na `Tarefa`; `return new` na recorrente |
| `(reading 'concluir')` | esse número não está na lista | conferir o id |
| `criarTarefa) is not a function` | sem `export`, ou importado sem chaves | `export function`; no teste, `{ criarTarefa }` |

Sem mensagem, a rega de hoje continua pendente? Faltou o `super.concluir()`. Nada nasce? Confira o nome: `concluir`.

---

## :icon[milestone] Projeto 3 · Etapa 3 pronta

- `npm test` todo verde (com os testes do enunciado, `Tests: 56 passed` e `Test Suites: 5 passed`)
- Na tela, concluir a "Regar as plantas" faz nascer outra, "Vence em 7 dias", e o resumo do topo acompanha
- O formulário adiciona, e o Remover tira a tarefa da lista
- Na lista **O que a página usa**, a Etapa 3 em 6 de 6

A foto da etapa vai para o GitHub:

```bash
git add .
git commit -m "Projeto 3: etapa 3, recorrente e lista"
git push
```

Faltou a Sua vez? Termine em casa, antes do E20, e faça o commit do mesmo jeito.

---

## Resumo

:::summary
- `class TarefaRecorrente extends Tarefa`: a filha herda tudo o que a mãe tem e acrescenta o seu
- `super(dados)` monta a parte da mãe e vem antes de qualquer `this`
- Sobrescrever é escrever na filha um método com o mesmo nome; `super.concluir()` reaproveita o da mãe
- Polimorfismo: o mesmo pedido, `concluir`, e cada tarefa faz do seu jeito; a lista não pergunta o tipo
- Composição: a `ListaDeTarefas` guarda as tarefas em `this.tarefas`, dá o número e cuida delas pelos métodos
- `criarTarefa` escolhe a forma pelos dados; `import ListaDeTarefas, { criarTarefa }` traz o default e o nomeado
:::

---

## :icon[arrow-right] Próximos passos

No E20, a lista aprende a dizer não. Hoje o formulário aceita até título vazio:

- :icon[octagon-alert] `throw` e `Error`: a tarefa se recusa a nascer com título vazio
- :icon[list-tree] `ErroDeTarefa extends Error`: a herança de hoje, numa classe de erro própria
- :icon[shield-check] `try`/`catch`: a rede de proteção, que segura o erro e deixa o resto seguir
- :icon[test-tube] `toThrow`: o teste que confere se o erro aparece
