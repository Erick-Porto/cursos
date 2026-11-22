---
title: Erros
summary: "throw, try/catch/finally e um erro próprio: a lista de tarefas recusa o dado errado e diz onde."
module: classes-e-controle
duration_minutes: 90
objectives:
  - Lançar erros com throw e criar um erro próprio com extends Error
  - Capturar erros com try, catch e finally e relançar o erro que não é seu
  - Testar com toThrow que uma regra recusa o dado errado
  - Fazer a Tarefa e a ListaDeTarefas do Projeto 3 recusarem dados errados
---

# Erros

Programador Mobile · Encontro E20 · Aula 20 de 45

---

## O que você vai aprender

:::goal
- Fazer o seu código parar e avisar, com `throw` e `Error`
- Criar o `ErroDeTarefa`, um erro que diz o que aconteceu e onde
- Provar no Jest, com `toThrow`, que a regra recusa o dado errado
- Segurar o erro com `try` e `catch`, deixar passar o que não é seu e arrumar no `finally`
- Fazer a lista de tarefas recusar título vazio, curto ou repetido, prioridade e prazo errados
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **erro** (`Error`) | uma ficha com a mensagem do problema |
| **lançar** (`throw`) | acender o aviso: a função para ali, e o erro sobe para quem a chamou |
| **capturar** (`try`/`catch`) | segurar o erro lançado e decidir o que fazer, sem o programa parar |
| **erro próprio** | um tipo de `Error` feito por você, com mais informação |
| **bug** | um defeito no código; quem resolve é você, corrigindo |
| **relançar** | no `catch`, mandar adiante o erro que não é seu |

---

## O formulário aceita qualquer coisa

No fim do E19, a tela aceita tudo o que a pessoa envia:

| A pessoa envia | Hoje | No fim do dia |
|---|---|---|
| o título vazio | entra uma tarefa sem nome | "Escreva o título da tarefa.", embaixo do título |
| o título "ab" | entra | "O título precisa de pelo menos 3 letras." |
| "Pagar a conta de luz" de novo | entram duas iguais | "Já existe uma tarefa pendente com esse título." |
| uma semanal sem prazo | entra, e o Concluir quebra | "Tarefa que se repete precisa de prazo.", embaixo do prazo |

:::question
A classe `Tarefa` sabe que o título está vazio. Como ela avisa a tela?
:::

---

## Lançar um erro

Até hoje, quem acendia a luz do painel era o JavaScript. E se o seu código acendesse?

---

## :icon[octagon-alert] throw: o seu código acende a luz

Desde a aula 3, a **mensagem de erro** é a luz do painel do carro: diz o que aconteceu e onde. Com o **`throw`** (lançar), quem acende a luz é o seu código. A função para na hora e avisa.

```javascript
function dividir(total, pessoas) {
  if (pessoas < 1) {
    throw new Error('A conta precisa de pelo menos 1 pessoa.');
  }
  return total / pessoas;
}
```

| Linha | O que ela diz |
|---|---|
| `new Error('...')` | "crie um **erro** com esta mensagem". O `Error` é uma classe que já vem no JavaScript; o erro é uma ficha com `message` (o texto) e `name` (`'Error'`) |
| `throw` | "lance o erro": a função para aqui, e nenhuma linha abaixo roda |
| `return total / pessoas;` | só chega aqui quem passou pela conferência do `if` |

---

## :icon[octagon-alert] throw na prática

**Caso 1: a conta sem ninguém.** Quem chama `dividir(120, 0)` não recebe número nenhum:

```javascript
console.log(dividir(120, 4)); // 30
console.log(dividir(120, 0)); // para aqui
console.log('fim');           // nunca roda
```

```plaintext
30
file:///.../dividir.js:3
    throw new Error('A conta precisa de pelo menos 1 pessoa.');
          ^

Error: A conta precisa de pelo menos 1 pessoa.
    at dividir (file:///.../dividir.js:3:11)
```

**Caso 2: o kit já lança.** O `datas.js` confere o prazo antes de fazer conta. É por isso que concluir a semanal sem prazo mostra `Error: O prazo precisa ser um texto 'AAAA-MM-DD'; chegou null.`

No E10, o `lerValor` devolvia `null`, e quem chamava precisava lembrar de conferir. O erro lançado não deixa esquecer: ou alguém trata, ou o programa para.

---

## :icon[notebook-pen] Exercícios: Lançar um erro

:::example Exercícios
1. Complete: `___ new ___('Escolha o tamanho do açaí.');`
2. O que aparece no terminal?

   ```javascript
   function pagarPassagem(saldo) {
     if (saldo < 5) {
       throw new Error('Saldo insuficiente no cartão.');
     }
     return saldo - 5;
   }
   console.log(pagarPassagem(12));
   console.log(pagarPassagem(3));
   console.log('Boa viagem');
   ```

3. Com `if (litros <= 0) { new Error('Escolha quantos litros.'); }`, a função não para. Por quê?
4. Escreva `conferirIdade(idade)`, que lança `'Filme para maiores de 16 anos.'` quando a idade é menor que 16.
:::

:::tip Respostas
1. `throw` e `Error`: o `new Error` cria o erro, e o `throw` lança.
2. `7` e, depois, `Error: Saldo insuficiente no cartão.`; o programa para, e `Boa viagem` não aparece.
3. Faltou o `throw`: o erro foi criado, ninguém lançou, e o código segue.
4. `function conferirIdade(idade) { if (idade < 16) { throw new Error('Filme para maiores de 16 anos.'); } }`
:::

---

## Erros próprios

A luz do painel diz o que aconteceu. O que mais ela precisa dizer?

---

## :icon[badge-alert] Erros próprios: o que aconteceu e onde

A luz do painel diz o que aconteceu **e onde**. O `Error` guarda só o que aconteceu, na `message`. A tela precisa saber também onde: embaixo de qual campo mostrar a mensagem.

Com o `extends` do E19, você cria um **erro próprio**. O `ErroDeTarefa` é um tipo de `Error`, como o cartão é um tipo de pagamento: herda a `message` e acrescenta o **`campo`**.

```javascript
export default class ErroDeTarefa extends Error {
  constructor(mensagem, campo = null) {
    super(mensagem);
    this.name = 'ErroDeTarefa';
    this.campo = campo;
  }
}
```

---

## :icon[list-ordered] O erro próprio em português

| Linha | O que ela diz |
|---|---|
| `class ErroDeTarefa extends Error` | "um erro de tarefa é um tipo de `Error`": herda a `message` |
| `constructor(mensagem, campo = null)` | recebe a mensagem e o campo; sem campo, `null` (o valor padrão do E07) |
| `super(mensagem);` | "monte a parte do `Error` com esta mensagem": ela vira a `message` |
| `this.name = 'ErroDeTarefa';` | o nome do tipo, que aparece no terminal e que o `catch` confere |
| `this.campo = campo;` | onde: `'titulo'`, `'prioridade'`, `'prazo'` ou `null` |

O `super(mensagem)` vem antes de qualquer `this`, como no E19. O `name` você escreve à mão: sem ele, o erro continua se chamando `Error`.

---

## :icon[badge-alert] Erros próprios na prática

**Caso 1: o que o erro carrega.**

```javascript
const erro = new ErroDeTarefa('Escreva o título da tarefa.', 'titulo');
console.log(erro.message); // Escreva o título da tarefa.
console.log(erro.campo);   // titulo
console.log(erro.name);    // ErroDeTarefa
```

**Caso 2: sem campo.** `new ErroDeTarefa('Sem conexão com a internet.').campo` é `null`. A tela usa o `campo` para escolher o lugar da mensagem:

| `campo` | A tela mostra a mensagem |
|---|---|
| `'titulo'`, `'prioridade'`, `'prazo'` | embaixo desse campo do formulário |
| `null` | no topo do formulário |

**Caso 3: lançado sem ninguém para segurar.** `throw erro;` mostra o nome, a mensagem e, no fim, o campo:

```plaintext
ErroDeTarefa: Escreva o título da tarefa.
    at file:///.../teste.js:3:14 {
  campo: 'titulo'
}
```

---

## :icon[notebook-pen] Exercícios: Erros próprios

:::example Exercícios
1. O que aparece no terminal?

   ```javascript
   class ErroDeSaldo extends Error {
     constructor(mensagem, falta = 0) {
       super(mensagem);
       this.name = 'ErroDeSaldo';
       this.falta = falta;
     }
   }
   const erro = new ErroDeSaldo('Saldo insuficiente.', 2);
   console.log(erro.name, erro.falta);
   console.log(erro.message);
   console.log(new ErroDeSaldo('Cartão bloqueado.').falta);
   ```

2. Sem a linha `this.name = 'ErroDeSaldo';`, o que mostra `erro.name`?
3. O `constructor` começa com `this.falta = falta;` e só depois chama `super(mensagem)`. O que acontece?
4. Lance um `ErroDeSaldo` com a mensagem `'Recarregue o cartão.'` e a falta 3.
:::

:::tip Respostas
1. `ErroDeSaldo 2`, `Saldo insuficiente.` e `0`: sem a falta, vale o padrão.
2. `Error`: sem o `name` escrito à mão, fica o nome da mãe.
3. O Node para com `Must call super constructor`: o `super` vem antes de qualquer `this`.
4. `throw new ErroDeSaldo('Recarregue o cartão.', 3);`
:::

---

## Testar o erro

Como provar, sem abrir a tela, que a tarefa recusa o título vazio?

---

## :icon[test-tube] toThrow: a prova de que lança

O teste do E08 é uma prova com gabarito que o computador corrige sozinho. Para um erro, o gabarito diz: "esta chamada precisa lançar". Quem confere é o **`toThrow`** (lança):

```javascript
test('a conta sem ninguém lança um erro', () => {
  expect(() => dividir(120, 0)).toThrow('pelo menos 1 pessoa');
});
```

- **A seta** `() =>`, a função sem ingredientes do E08, embrulha a chamada numa receita. O Jest roda a receita dentro do `expect` e confere se ela lançou
- Sem a seta, `dividir(120, 0)` roda antes do `expect`: o erro estoura ali e derruba o teste
- Uma função com nome também serve, **sem parênteses**: se `lancar` é uma função que lança, `expect(lancar)` entrega a receita, e o Jest cozinha

---

## :icon[test-tube] toThrow na prática

Três jeitos de conferir, e o resultado de cada um:

```javascript
// 1. pelo texto: a mensagem contém esse pedaço. Verde
expect(() => dividir(120, 0)).toThrow('pelo menos 1 pessoa');

// 2. pelo tipo: é um Error. Verde (todo erro próprio também é)
expect(() => dividir(120, 0)).toThrow(Error);

// 3. sem a seta: vermelho
expect(dividir(120, 0)).toThrow(Error);
```

No terceiro, o Jest mostra o próprio erro no lugar da conferência:

```plaintext
● a conta sem ninguém lança um erro

  A conta precisa de pelo menos 1 pessoa.
```

Quando a chamada não lança nada, o vermelho é outro: `Received function did not throw` (a função não lançou).

---

## :icon[notebook-pen] Exercícios: Testar o erro

:::example Exercícios
Verde ou vermelho, com esta função?

```javascript
function pagarPassagem(saldo) {
  if (saldo < 5) {
    throw new Error('Saldo insuficiente no cartão.');
  }
  return saldo - 5;
}
```

1. `expect(() => pagarPassagem(3)).toThrow('Saldo insuficiente');`
2. `expect(() => pagarPassagem(10)).toThrow(Error);`
3. `expect(pagarPassagem(3)).toThrow(Error);`
4. `expect(() => pagarPassagem(3)).toThrow('saldo insuficiente');`
5. Escreva o `expect` de que `pagarPassagem(0)` lança um `Error`.
:::

:::tip Respostas
1. Verde: a mensagem contém o pedaço.
2. Vermelho, `Received function did not throw`: com 10, a passagem é paga.
3. Vermelho: sem a seta, o erro estoura antes do `expect`, e o Jest mostra `Saldo insuficiente no cartão.`
4. Vermelho: o pedaço precisa ser igual letra por letra, e a mensagem tem `Saldo`, com S maiúsculo.
5. `expect(() => pagarPassagem(0)).toThrow(Error);`
:::

---

## :icon[milestone] Projeto 3 · Passo 1: o erro da tarefa

:::steps
1. Em `src/modelos/ErroDeTarefa.js`, troque o comentário do kit pela classe
2. Ao lado, crie `ErroDeTarefa.test.js` com os três testes e rode `npm test`
:::

```javascript
// Etapa 4 (E20). O erro que o app sabe tratar: a mensagem é para a pessoa ler,
// o campo diz onde a tela mostra a mensagem ('titulo', 'prioridade', 'prazo' ou null).
export default class ErroDeTarefa extends Error {
  constructor(mensagem, campo = null) {
    super(mensagem);
    this.name = 'ErroDeTarefa';
    this.campo = campo;
  }
}
```

```javascript
import ErroDeTarefa from './ErroDeTarefa.js';

test('o erro guarda a mensagem, o campo e o nome', () => {
  const erro = new ErroDeTarefa('Escreva o título da tarefa.', 'titulo');
  expect(erro.message).toBe('Escreva o título da tarefa.');
  expect(erro.campo).toBe('titulo');
  expect(erro.name).toBe('ErroDeTarefa');
});

test('sem campo, o campo é null', () => {
  const erro = new ErroDeTarefa('Sem conexão com a internet.');
  expect(erro.campo).toBe(null);
});
```

```javascript
test('o erro pode ser lançado e conferido com toThrow', () => {
  function lancar() {
    throw new ErroDeTarefa('Teste');
  }
  expect(lancar).toThrow(ErroDeTarefa);
  expect(lancar).toThrow(Error);
  expect(lancar).toThrow('Teste');
});
```

**Pronto quando:** `npm test` todo verde (`Tests: 59 passed`, `Test Suites: 6 passed`); na tela, "O que a página usa" mostra a Etapa 4 em 1 de 7.

---

## :icon[milestone] Projeto 3 · Passo 2: a tarefa confere o título

Em `src/modelos/Tarefa.js`, no topo, a linha `import ErroDeTarefa from './ErroDeTarefa.js';`. No `constructor`, o título sem os espaços das pontas e a chamada do `validar`. Logo abaixo, o método novo:

```javascript
  constructor(dados) {
    this.titulo = (dados.titulo ?? '').trim();
    this.prioridade = dados.prioridade ?? 'media';
    this.prazo = dados.prazo ?? null;
    this.concluida = dados.concluida ?? false;
    this.validar();
  }

  // Etapa 4 (E20). Confere os dados; se algo estiver errado, lança um ErroDeTarefa.
  validar() {
    if (this.titulo === '') {
      throw new ErroDeTarefa('Escreva o título da tarefa.', 'titulo');
    }
  }
```

- `(dados.titulo ?? '').trim()`: se o título não veio, o texto vazio; depois, o `trim` do E09 tira os espaços das pontas. `'   '` vira `''`
- `this.validar()`: a tarefa confere a si mesma, um método chamando outro da mesma classe. Vem por último, quando todos os campos já existem
- Se o `validar` lança, o `new Tarefa(...)` não devolve nada: a tarefa errada não nasce

---

## :icon[milestone] Projeto 3 · Passo 2: o teste do título vazio

No topo de `src/modelos/Tarefa.test.js`, a linha `import ErroDeTarefa from './ErroDeTarefa.js';`. No fim do arquivo, os dois testes:

```javascript
test('a tarefa recusa o título vazio', () => {
  expect(() => new Tarefa({ titulo: '   ' })).toThrow('Escreva o título da tarefa.');
  expect(() => new Tarefa({ titulo: '   ' })).toThrow(ErroDeTarefa);
});

test('a tarefa guarda o título sem os espaços das pontas', () => {
  const regar = new Tarefa({ titulo: '  Regar as plantas  ' });
  expect(regar.titulo).toBe('Regar as plantas');
});
```

O primeiro confere a mensagem e o tipo. A seta embrulha o `new Tarefa(...)`: sem ela, o erro estoura antes do `expect`.

**Pronto quando:** `npm test` todo verde (`Tests: 61 passed`). Na tela, enviar o título vazio mostra "Escreva o título da tarefa." embaixo do título, com o campo em vermelho, e nada entra na lista. A Etapa 4 fica em 2 de 7.

---

## :icon[milestone] Projeto 3 · Passo 3: a lista recusa o título repetido

Em `ListaDeTarefas.js`, o `import ErroDeTarefa from './ErroDeTarefa.js';` no topo. No começo do `adicionar`, antes de dar o id, a conferência:

```javascript
  adicionar(tarefa) {
    // Etapa 4 (E20). Duas pendentes com o mesmo título confundem: a lista recusa.
    const titulo = tarefa.titulo.toLowerCase();
    const pendentes = this.tarefas.filter((outra) => !outra.concluida);
    const repetida = pendentes.some((outra) => outra.titulo.toLowerCase() === titulo);
    if (repetida) {
      throw new ErroDeTarefa('Já existe uma tarefa pendente com esse título.', 'titulo');
    }
    tarefa.id = this.proximoId;
    this.proximoId = this.proximoId + 1;
    this.tarefas.push(tarefa);
    return tarefa;
  }
```

- O `toLowerCase` do E09 deixa "PAGAR" e "Pagar" iguais; o `some` do E14 pergunta "alguma pendente tem esse título?"
- O `throw` vem antes do id: a repetida não muda a lista. Só as pendentes contam: a semanal concluída e a próxima dela têm o mesmo título

No fim de `ListaDeTarefas.test.js`:

```javascript
test('a lista recusa duas pendentes com o mesmo título', () => {
  const lista = new ListaDeTarefas();
  lista.adicionar(new Tarefa({ titulo: 'Pagar a conta de luz' }));
  expect(() => lista.adicionar(new Tarefa({ titulo: 'PAGAR A CONTA DE LUZ' }))).toThrow(
    'Já existe uma tarefa pendente com esse título.',
  );
  expect(lista.tarefas.length).toBe(1);
});

test('o título de uma tarefa concluída pode voltar', () => {
  const lista = new ListaDeTarefas();
  lista.adicionar(new Tarefa({ titulo: 'Pagar a conta de luz', concluida: true }));
  lista.adicionar(new Tarefa({ titulo: 'Pagar a conta de luz' }));
  expect(lista.tarefas.length).toBe(2);
});
```

**Pronto quando:** `npm test` todo verde (`Tests: 63 passed`); na tela, o título repetido, até em maiúsculas, mostra a mensagem embaixo do título; Etapa 4 em 3 de 7.

---

## try e catch

Por que o espetáculo continua quando o trapezista cai?

---

## :icon[shield-check] try e catch: a rede de proteção

Embaixo do trapezista fica a **rede de proteção**: se ele cai, a rede segura, e o espetáculo continua. O **`try`** (tentar) é o número feito em cima da rede. O **`catch`** (pegar) é a rede: recebe o erro lançado e decide o que fazer.

```javascript
try {
  const tarefa = new Tarefa({ titulo: '   ' });
  console.log('Criada:', tarefa.titulo); // não roda
} catch (erro) {
  console.log(erro.message); // Escreva o título da tarefa.
  console.log(erro.campo);   // titulo
}
console.log('O programa continua');
```

- O `try` roda até o primeiro erro e pula direto para o `catch`
- **`erro`** é o erro lançado, com `message`, `name` e `campo`; o nome da caixa é você quem escolhe
- Sem erro, o `catch` não roda. Com erro ou sem erro, o código depois dele continua

---

## :icon[shield-check] try e catch na prática

**Caso 1: o formulário da tela.** Quando você clica em Adicionar, a tela do kit faz isto com o que foi digitado (no lugar do `console.log`, ela escreve na página):

```javascript
const dados = { titulo: '   ' }; // o que a pessoa digitou
try {
  lista.adicionar(criarTarefa(dados));
  console.log('Entrou na lista');
} catch (erro) {
  console.log(`Embaixo do campo ${erro.campo}: ${erro.message}`);
}
// Embaixo do campo titulo: Escreva o título da tarefa.
```

**Caso 2: o erro sobe até a rede.** O `throw` está no `validar`, três chamadas abaixo do `try`:

| Quem | Tem rede? | O erro |
|---|---|---|
| `validar()` | não | nasce no `throw` |
| `constructor` da `Tarefa` | não | passa direto |
| `criarTarefa(dados)` | não | passa direto |
| a tela, no `try` | sim | cai no `catch` |

---

## :icon[notebook-pen] Exercícios: try e catch

:::example Exercícios
1. Complete: `___ { pagarPassagem(2); } ___ (erro) { console.log(erro.message); }`
2. O que aparece no terminal?

   ```javascript
   function pagarPassagem(saldo) {
     if (saldo < 5) {
       throw new Error('Saldo insuficiente.');
     }
     return saldo - 5;
   }
   try {
     console.log('Saldo:', pagarPassagem(3));
     console.log('Catraca liberada');
   } catch (erro) {
     console.log('Aviso:', erro.message);
   }
   console.log('Próximo da fila');
   ```

3. E com `pagarPassagem(12)` no lugar do 3?
4. O `try` chama `embarcar(2)`, que chama `pagarPassagem(2)`. Sem rede no `embarcar`, quem segura o erro?
:::

:::tip Respostas
1. `try` e `catch`.
2. `Aviso: Saldo insuficiente.` e `Próximo da fila`: o `try` pula direto para o `catch`.
3. `Saldo: 7`, `Catraca liberada` e `Próximo da fila`: sem erro, o `catch` não roda.
4. O `catch` do `try`: o erro sobe pelas chamadas sem rede até cair nele.
:::

---

## Esperado ou bug

Se o seu código tem um erro de digitação, você quer descobrir ou prefere que ninguém veja?

---

## :icon[bug] Erro esperado ou bug?

O `catch` segura **qualquer** erro, até os que não são seus. Eles são de dois tipos:

| | Erro esperado | Bug |
|---|---|---|
| Exemplo | título vazio, título repetido | um nome escrito errado |
| A culpa é | do dado que chegou | do código |
| Quem resolve | a pessoa, lendo a mensagem | você, corrigindo |
| O `name` | `'ErroDeTarefa'` | `'ReferenceError'`, `'TypeError'` |

A rede de hoje é para o erro esperado. O bug ela **relança** com `throw erro`: ele segue em frente e acende a luz do painel.

```javascript
try {
  lista.adicionar(criarTarefa(dados));
} catch (erro) {
  if (erro.name !== 'ErroDeTarefa') {
    throw erro; // não é nosso: deixe passar
  }
  console.log(erro.message); // é nosso: a pessoa lê
}
```

---

## :icon[bug] Esperado ou bug na prática

**O bug escondido.** Um `s` a mais no nome da função, e um `catch` que segura tudo:

```javascript
try {
  lista.adicionar(criarTarefas(dados)); // um s a mais: bug
} catch (erro) {
  console.log(erro.message);
}
```

| O `catch` | O que aparece |
|---|---|
| sem o `if` | `criarTarefas is not defined`, como se fosse um aviso para a pessoa |
| com o `if` | `ReferenceError: criarTarefas is not defined` e a linha do erro: você acha e corrige |

Num laço que pula as tarefas com problema, o mesmo bug sem o `if` faz pior: pula **todas**, devolve 0 e ninguém fica sabendo por quê.

---

## :icon[notebook-pen] Exercícios: Esperado ou bug

:::example Exercícios
1. Esperado ou bug? A senha vazia; `pagarPasagem is not defined`; o CPF com 5 números.
2. O que aparece no terminal?

   ```javascript
   function pagarPassagem(saldo) {
     return saldo - 5;
   }
   try {
     pagarPasagem(3); // faltou um s
   } catch (erro) {
     console.log('Aviso:', erro.message);
   }
   ```

3. Complete o `catch` para relançar o que não é seu: `if (erro.name !== 'ErroDeSaldo') { ___ }`
4. Com o `if` do exercício 3 no começo do `catch`, o que aparece agora?
:::

:::tip Respostas
1. Esperado, bug e esperado: a senha e o CPF são culpa do dado; o nome errado, do código.
2. `Aviso: pagarPasagem is not defined`: o bug virou um aviso para a pessoa.
3. `throw erro;`
4. O programa para com `ReferenceError: pagarPasagem is not defined`, e você corrige o nome.
:::

---

## :icon[milestone] Projeto 3 · Passo 4: importar pulando o que tem problema

No fim da classe `ListaDeTarefas`, o método `importar`. Ele recebe uma lista de fichas de dados, cria e adiciona cada uma e devolve quantas entraram:

```javascript
  // Etapa 4 (E20). Acrescenta as tarefas que estão certas, pula as outras e diz quantas entraram.
  importar(listaDeDados) {
    let quantas = 0;
    for (const dados of listaDeDados) {
      try {
        this.adicionar(criarTarefa(dados));
        quantas = quantas + 1;
      } catch (erro) {
        if (erro.name !== 'ErroDeTarefa') {
          throw erro;
        }
      }
    }
    return quantas;
  }
```

- O `try` fica **dentro** do `for...of`: a rede segura uma tarefa de cada vez, e o laço segue para a próxima
- `quantas` é o acumulador do E11: só soma 1 quando o `adicionar` deu certo. O `criarTarefa` é o do E19, no mesmo arquivo
- O `catch` não faz nada com o `ErroDeTarefa`: pular é o tratamento

---

## :icon[milestone] Projeto 3 · Passo 4: o importar, volta por volta

No fim de `ListaDeTarefas.test.js`:

```javascript
test('importar pula as tarefas com problema e conta as que entraram', () => {
  const lista = new ListaDeTarefas();
  const quantas = lista.importar([
    { titulo: 'Pagar a conta de luz' },
    { titulo: '' },
    { titulo: 'pagar a conta de luz' },
    { titulo: 'Regar as plantas', prazo: '2026-11-10', frequencia: 'semanal' },
  ]);
  expect(quantas).toBe(2);
  expect(lista.tarefas.length).toBe(2);
  expect(lista.buscar(2).frequencia).toBe('semanal');
});
```

| Volta | `dados` | O que acontece | `quantas` |
|---|---|---|---|
| 1 | Pagar a conta de luz | entra, com o id 1 | 1 |
| 2 | título `''` | "Escreva o título" cai no `catch`: pula | 1 |
| 3 | pagar a conta de luz | "Já existe..." cai no `catch`: pula | 1 |
| 4 | a semanal Regar as plantas | entra, com o id 2 | 2 |

**Pronto quando:** `npm test` todo verde (`Tests: 64 passed`); Etapa 4 em 4 de 7.

---

## finally

Com queda ou sem queda, o que acontece no picadeiro quando o número termina?

---

## :icon[check-check] finally: o que roda sempre

No fim do número, com queda ou sem queda, alguém arruma o picadeiro para o próximo. O **`finally`** (por fim) é essa arrumação: vem depois do `catch` e roda **sempre**, com erro ou sem erro.

```javascript
function apresentar(titulo) {
  try {
    console.log('1. no trapézio');
    const tarefa = new Tarefa({ titulo: titulo });
    console.log('2. aplausos para', tarefa.titulo);
  } catch (erro) {
    console.log('3. caiu na rede:', erro.message);
  } finally {
    console.log('4. picadeiro arrumado');
  }
}
```

| Chamada | O que aparece |
|---|---|
| `apresentar('Regar as plantas')` | 1, 2 (aplausos para Regar as plantas) e 4 |
| `apresentar('   ')` | 1, 3 (caiu na rede: Escreva o título da tarefa.) e 4 |

---

## :icon[check-check] finally na prática

**Caso 1: o botão que não pode ficar desligado.** Enquanto a tarefa é enviada, o botão se desliga, para ninguém clicar duas vezes. O `finally` religa:

```javascript
const botao = { ligado: true };

function enviar(dados) {
  botao.ligado = false; // ninguém clica duas vezes
  try {
    lista.adicionar(criarTarefa(dados));
  } catch (erro) {
    if (erro.name !== 'ErroDeTarefa') {
      throw erro;
    }
    console.log('Recusada:', erro.message);
  } finally {
    botao.ligado = true; // com erro ou sem erro
  }
}
```

```javascript
enviar({ titulo: '   ' });  // Recusada: Escreva o título da tarefa.
console.log(botao.ligado);  // true
enviar({ titulo: 'Comprar ração do gato' });
console.log(botao.ligado);  // true
```

**Caso 2: o botão Importar exemplos, da tela.** Ele faz o mesmo: desliga enquanto busca as tarefas na internet e religa no `finally`. Você vê esse botão funcionar no E22.

---

## :icon[notebook-pen] Exercícios: finally

:::example Exercícios
1. Complete: `try { ... } catch (erro) { ... } ___ { impressora.ligada = true; }`
2. Religar a impressora no fim, com erro ou sem erro: no `catch` ou no `finally`?
3. O que aparece no terminal?

   ```javascript
   function imprimir(paginas) {
     try {
       console.log('A');
       if (paginas > 10) {
         throw new Error('Limite de 10 páginas.');
       }
       console.log('B');
     } catch (erro) {
       console.log('C', erro.message);
     } finally {
       console.log('D');
     }
   }
   imprimir(3);
   imprimir(25);
   ```

4. E com `imprimir(10)`?
:::

:::tip Respostas
1. `finally`.
2. No `finally`: o `catch` só roda quando há erro.
3. `A`, `B`, `D` e, depois, `A`, `C Limite de 10 páginas.`, `D`.
4. `A`, `B` e `D`: 10 não é maior que 10, e nada é lançado.
:::

---

## :icon[milestone] Projeto 3 · Sua vez: as outras conferências

No `validar()` da `Tarefa`, três conferências, cada uma com o seu teste:

- menos de 3 letras: `'titulo'`, "O título precisa de pelo menos 3 letras."
- prioridade que não vale: `'prioridade'`, "Escolha a prioridade: alta, média ou baixa."
- prazo que não é `null` nem data: `'prazo'`, "Use uma data no formato AAAA-MM-DD."

Na `TarefaRecorrente`, sem prazo: `'prazo'`, "Tarefa que se repete precisa de prazo." E teste que `'Pão'` vale.

:::tip Dicas
- Prioridade errada tem peso 0 no `pesoDaPrioridade`; a data, o `ehDataValida` do kit
- Na recorrente, a conferência vem depois do `super(dados)`
:::

**Pronto quando:** tudo verde; na tela, "ab" e a semanal sem prazo mostram a mensagem no campo certo; Etapa 4: 7 de 7.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| teste vermelho com `ErroDeTarefa: Escreva...` | o `expect` recebeu a tarefa, não a seta | a seta: `expect(() => new Tarefa(...))` |
| `Received function did not throw` | nada foi lançado | o `throw` no `if`; o `this.validar()` |
| `Must call super constructor` | a conferência veio antes do `super` | depois do `super(dados)` |
| `reading 'trim'` | faltou o `?? ''` no título | `(dados.titulo ?? '').trim()` |
| na tela, a mensagem fica no topo | o `campo` faltou ou está diferente | `'titulo'`, sem acento |
| "O seu código lançou um erro inesperado" | faltou o `name` | `this.name = 'ErroDeTarefa';` |

---

## :icon[milestone] Projeto 3 · Etapa 4 pronta

- `ErroDeTarefa.js`, com `name` e `campo`, e os três testes dele
- A `Tarefa` recusa título vazio ou curto, prioridade e prazo errados; a `TarefaRecorrente` recusa ficar sem prazo
- A lista recusa o título repetido e importa pulando só o `ErroDeTarefa`
- `npm test` todo verde: `Tests: 69 passed`, `Test Suites: 6 passed`
- Na tela, cada mensagem embaixo do campo certo e a Etapa 4 em 7 de 7

```bash
git add .
git commit -m "Projeto 3: etapa 4, erros próprios"
git push
```

Recarregar a página ainda volta ao começo ("Sem salvar"): salvar é a etapa 5, no E21. Faltou a Sua vez? Termine em casa, pelos slides e pelo enunciado, antes do E21.

---

## Resumo

:::summary
- `throw new Error('...')` para a função na hora e avisa: o seu código acende a luz do painel
- Um erro próprio nasce com `extends Error`: o `ErroDeTarefa` guarda o que aconteceu (`message`) e onde (`campo`)
- No Jest, `expect(() => ...).toThrow(...)`: com a seta, o Jest roda a chamada e confere o erro
- `try` e `catch` são a rede: o erro lançado em qualquer chamada dentro do `try` cai no `catch`, e o programa continua
- A rede segura o erro esperado e relança o bug com `throw erro`
- O `finally` roda sempre, com erro ou sem erro
:::

---

## :icon[arrow-right] Próximos passos

No E21, **código que espera**: a lista de tarefas passa a ser salva no navegador e volta quando você recarrega a página.

- :icon[timer] o `setTimeout` e a Promise, a senha da lanchonete
- :icon[save] `salvarTarefas` e `carregarTarefas`, com `async` e `await`
- :icon[shield-check] o `try` e `catch` de hoje, para o texto salvo que chegar quebrado
