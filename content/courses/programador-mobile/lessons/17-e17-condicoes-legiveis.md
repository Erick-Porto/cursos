---
title: Condições legíveis
summary: "Começa o Projeto 3: o kit no GitHub e as regras do prazo com switch, else if em ordem, ??, ?. e while."
module: classes-e-controle
duration_minutes: 90
objectives:
  - Escolher entre vários casos com switch, case, break e default
  - Ordenar uma cadeia de else if e tirar da frente, no começo da função, o caso que não serve
  - Dar um valor ao que não veio com ?? e ler um campo sem quebrar com ?.
  - Repetir com while e conferir que o laço tem saída
---

# Condições legíveis

Programador Mobile · Encontro E17 · Aula 17 de 45

---

## O que você vai aprender

:::goal
- Começar o Projeto 3, a Lista de tarefas, a partir de um kit
- Escolher entre vários casos com `switch`, `case`, `break` e `default`
- Pôr o `else if` em ordem e tirar da frente, logo no começo, o caso que não serve
- Dar um valor ao que não veio com `??` e ler sem quebrar com `?.`
- Repetir com `while` enquanto for preciso, sem deixar o laço sem saída
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **kit** | um projeto que vem pela metade: a tela pronta e os seus arquivos vazios, esperando o seu código |
| **`switch`** | a decisão que compara um valor com uma lista de casos, como o menu da central de atendimento |
| **`break`** | a palavra que sai do `switch` (*break*, quebrar) |
| **`??`** | "se não veio nada, use este" |
| **`?.`** | "se existir, leia; se não existir, responda `undefined`, sem erro" |
| **`while`** | o laço que repete **enquanto** a condição for `true` (*while*, enquanto) |

---

## Tarefas que vencem

Conta de luz, remédio, ração do gato. Uma lista de tarefas só ajuda se mostrar primeiro o que está atrasado e disser o prazo em palavras, sem você fazer conta de cabeça.

| Hoje, ao abrir o kit | No fim do encontro |
|---|---|
| a lista vazia, com o aviso "A lista aparece quando src/regras/prazos.js tiver pesoDaPrioridade e situacaoDoPrazo" | seis tarefas, a atrasada no alto, com a borda vermelha, e o prazo em palavras: "Atrasada há 2 dias", "Vence hoje", "Vence amanhã" |

:::question
Na sua lista, o que vem primeiro: a tarefa mais importante ou a que vence antes?
:::

---

## :icon[milestone] Projeto 3: a Lista de tarefas

O **Projeto 3** é uma lista de tarefas no navegador: uma etapa por encontro, do E17 ao E22, com entrega no início do E24. Ele começa de um **kit**:

| No kit | O que é |
|---|---|
| `web/` | a tela pronta: não mude nada nela |
| `src/utils/datas.js` | as contas com datas, prontas para usar |
| os outros arquivos de `src/` | vazios, com um comentário que diz a etapa: o seu código entra neles |

A tela importa o que você escreve em `src/`, e a lista **O que a página usa**, no fim dela, confere cada função. Enunciado, rubrica e entrega: página do curso, em **Projetos**.

---

## :icon[milestone] Projeto 3 · Passo 1: o kit no GitHub

:::steps
1. Baixe o [kit-tarefas.zip](materiais/projeto-3/kit-tarefas.zip), descompacte na pasta de projetos, ao lado de `racha-conta` e `agenda-de-contatos`, e renomeie a pasta para `lista-de-tarefas`
2. No terminal: `cd lista-de-tarefas`, `code .`, `npm install` e `npm test`
3. Na raiz, crie o `.gitignore` com a linha `node_modules/`. O zip não traz esse arquivo
4. O primeiro commit e o repositório **público** `lista-de-tarefas` no GitHub, vazio, como no E05
5. Num segundo terminal (o **+** do painel), `npx serve .` e `http://localhost:3000/web/`
:::

```bash
git init
git add .
git commit -m "Projeto 3: kit da lista de tarefas"
git remote add origin https://github.com/seu-usuario/lista-de-tarefas.git
git branch -M main
git push -u origin main
```

**Pronto quando:** `npm test` mostra `Tests: 9 passed, 9 total`; o GitHub mostra o commit do kit, sem `node_modules`; a tela abre com o aviso amarelo "Próximo passo: Etapa 1 · E17 · prazos.js".

---

## O switch

Na central de atendimento, o que acontece quando você digita 2?

---

## :icon[list-checks] switch: um valor, vários casos

O **`switch`** compara **um valor** com vários casos. É o menu da central de atendimento: cada tecla leva a um setor, e "outras opções" pega o resto.

```javascript
function setorDoMenu(tecla) {
  switch (tecla) {
    case 1:
      return 'Segunda via da conta';
    case 2:
      return 'Falar com um atendente';
    default:
      return 'Opção inválida';
  }
}

console.log(setorDoMenu(2)); // Falar com um atendente
console.log(setorDoMenu(9)); // Opção inválida
```

| Linha | O que ela diz |
|---|---|
| `switch (tecla) {` | "olhe a tecla" |
| `case 1:` | "se ela for 1..." |
| `return 'Segunda via da conta';` | "...devolva este texto e saia da função" |
| `default:` | "qualquer outra tecla": o 9 cai aqui |

---

## :icon[list-checks] switch na prática

**Caso 1: o `case` compara com `===`.** O `'2'` entre aspas é texto, e o `case 2` espera o número:

```javascript
console.log(setorDoMenu('2')); // Opção inválida
```

**Caso 2: guardar numa caixa, com `break`.** Fora de uma função não há `return`. O `let rotulo;` cria a caixa ainda sem nada (`undefined`), cada caso põe o seu texto nela e termina com **`break`**, que sai do `switch`:

```javascript
const frequencia = 'semanal';
let rotulo;
switch (frequencia) {
  case 'diaria':
    rotulo = 'Todo dia';
    break;
  case 'semanal':
    rotulo = 'Toda semana';
    break;
  default:
    rotulo = 'Não repete';
}
console.log(rotulo); // Toda semana
```

:::warning
Sem o `break` do `'semanal'`, a execução desce para o caso de baixo, e o `rotulo` termina `'Não repete'`.
:::

---

## :icon[notebook-pen] Exercícios: O switch

:::example Exercícios
1. A tarifa do ônibus. O que aparece?

   ```javascript
   function tarifa(tipo) {
     switch (tipo) {
       case 'estudante':
         return 2.5;
       case 'idoso':
         return 0;
       default:
         return 5;
     }
   }
   console.log(tarifa('idoso'), tarifa('Estudante'));
   ```

2. Complete o caso do professor, que paga 3: `___ 'professor': ___ 3;`
3. Fora de função, o `case 'estudante':` faz `rotulo = 'Meia';` sem `break`, e logo abaixo vem `default: rotulo = 'Inteira';`. Com `'estudante'`, quanto vale o `rotulo`?
4. Para a nota virar `'Aprovado'` a partir de 6: `switch` ou `if`?
:::

:::tip Respostas
1. `0 5`: o `case` compara com `===`, e `'Estudante'`, com maiúscula, cai no `default`
2. `case` e `return`, antes do `default`
3. `'Inteira'`: sem o `break`, a execução desce para o `default`
4. `if`: o `switch` só compara valores exatos, e "a partir de 6" é `nota >= 6`
:::

---

## :icon[milestone] Projeto 3 · Passo 2: o peso da prioridade

Quanto maior o peso, mais urgente: a tela usa o peso para ordenar as tarefas. Em `src/regras/prazos.js`, no lugar do comentário do kit:

```javascript
// Etapa 1 (E17). O peso de cada prioridade: quanto maior, mais urgente.
export function pesoDaPrioridade(prioridade) {
  switch (prioridade) {
    case 'alta':
      return 3;
    case 'media':
      return 2;
    case 'baixa':
      return 1;
    default:
      return 0;
  }
}
```

Na mesma pasta, crie `prazos.test.js`:

```javascript
import { pesoDaPrioridade } from './prazos.js';

test.each([
  ['alta', 3],
  ['media', 2],
  ['baixa', 1],
  ['urgente', 0],
])('pesoDaPrioridade(%s) devolve %s', (prioridade, peso) => {
  expect(pesoDaPrioridade(prioridade)).toBe(peso);
});
```

O `'urgente'` não bate com nenhum `case`: cai no `default` e pesa `0`.

**Pronto quando:** `npm test` todo verde, com `Tests: 13 passed, 13 total`. Na tela, recarregada, a lista **O que a página usa** mostra a Etapa 1 com 1 de 4. As tarefas ainda não aparecem.

---

## Retorno antecipado

Num show, o segurança barra quem não tem ingresso na porta ou lá dentro?

---

## :icon[shield-check] Retorno antecipado: a guarda protege o resto

No E10, o **retorno antecipado** era o segurança do show: cada `if` barra um problema na porta, com `return`, e o fim da função só cuida de quem passou. Esse `if` da porta se chama **guarda**. Ela também protege o resto da função de um valor que ele não sabe usar, como o `null`, a caixa vazia de propósito.

```javascript
function primeiraLetra(nome) {
  if (nome === null) {
    return '?';
  }
  return nome[0].toUpperCase();
}

console.log(primeiraLetra('mariana')); // M
console.log(primeiraLetra(null)); // ?
```

- O `[0]` de um texto é a primeira letra, e o `toUpperCase`, do E09, passa para maiúscula
- O `return` sai da função na hora: com `null`, a última linha nem roda

---

## :icon[shield-check] Retorno antecipado na prática

**Caso 1: sem a guarda, a função quebra.** A última linha tenta ler a letra 0 de `null`:

```javascript
function primeiraLetraSemGuarda(nome) {
  return nome[0].toUpperCase();
}
primeiraLetraSemGuarda(null);
// TypeError: Cannot read properties of null (reading '0')
```

**Caso 2: o `diasAte` do kit não aceita `null`.** A tarefa sem prazo tem `prazo: null`, e o kit avisa:

```javascript
const hoje = new Date(2026, 10, 10);
diasAte(null, hoje);
// Error: O prazo precisa ser um texto 'AAAA-MM-DD'; chegou null.
```

Por isso a `situacaoDoPrazo`, do passo 3, barra o "sem prazo" na primeira linha, antes de chamar o `diasAte`.

---

## :icon[notebook-pen] Exercícios: Retorno antecipado

:::example Exercícios
1. O crachá da academia. O que aparece?

   ```javascript
   function apelido(nome) {
     if (nome === null) {
       return 'Visitante';
     }
     return nome.trim().toUpperCase();
   }
   console.log(apelido(' bia '), apelido(null));
   ```

2. Sem a guarda, o que `apelido(null)` mostra?
3. Escreva a guarda do `precoPorPessoa(total, pessoas)`: com `pessoas` igual a `0`, ela devolve `0` antes da divisão
4. Ache o erro: `const letra = nome[0];` vem antes de `if (nome === null) { return '?'; }`
:::

:::tip Respostas
1. `BIA Visitante`: o `null` sai na guarda, e o resto da função nem roda
2. `TypeError: Cannot read properties of null (reading 'trim')`: a última linha tenta ler o `trim` da caixa vazia
3. `if (pessoas === 0) { return 0; }`, na primeira linha da função
4. Com `null`, o `nome[0]` quebra antes de chegar à guarda: ela vem primeiro
:::

---

## Cadeia de else if

No app de entrega, o restaurante de nota 4.7 ganha o selo "Bom" ou "Excelente"?

---

## :icon[list-ordered] Cadeia de else if: a ordem das saídas

No E10, o `else if` era a estrada com várias saídas: o JavaScript pergunta de cima para baixo, vale a **primeira** que dá `true`, e o `else` pega o resto. Com `<`, a faixa menor vinha primeiro. Com `>=`, é o contrário: a **maior** vem primeiro.

```javascript
function seloDaNota(nota) {
  if (nota >= 4.5) {
    return 'Excelente';
  } else if (nota >= 4) {
    return 'Muito bom';
  } else if (nota >= 3) {
    return 'Bom';
  } else {
    return 'Sem selo';
  }
}
```

| `nota` | `>= 4.5`? | `>= 4`? | `>= 3`? | Devolve |
|---|---|---|---|---|
| 4.7 | sim | não pergunta | não pergunta | `'Excelente'` |
| 4.2 | não | sim | não pergunta | `'Muito bom'` |
| 2.8 | não | não | não | `'Sem selo'`, do `else` |

---

## :icon[list-ordered] A ordem da cadeia na prática

**Caso 1: a ordem trocada.** A pergunta mais larga em cima engole as outras:

```javascript
function seloTrocado(nota) {
  if (nota >= 3) {
    return 'Bom';
  } else if (nota >= 4) {
    return 'Muito bom';
  } else if (nota >= 4.5) {
    return 'Excelente';
  } else {
    return 'Sem selo';
  }
}
console.log(seloTrocado(4.7)); // Bom
```

Toda nota a partir de 3 entra na primeira saída: "Muito bom" e "Excelente" nunca aparecem, e nenhum erro avisa.

**Caso 2: a borda.** O erro de ordem mora na **borda**, o valor exato em que uma faixa começa. O teste pega o 4.5, o 4.49 e o 3:

```javascript
console.log(seloDaNota(4.5), seloDaNota(4.49), seloDaNota(3));
// Excelente Muito bom Bom
```

---

## :icon[notebook-pen] Exercícios: Cadeia de else if

:::example Exercícios
1. A faixa de idade do cadastro. O que aparece?

   ```javascript
   function faixa(idade) {
     if (idade >= 60) {
       return 'Idoso';
     } else if (idade >= 18) {
       return 'Adulto';
     } else {
       return 'Jovem';
     }
   }
   console.log(faixa(60), faixa(17), faixa(18));
   ```

2. Com a ordem trocada, `idade >= 18` em cima e `idade >= 60` embaixo, o que `faixa(70)` dá?
3. Quais idades o teste dessa função precisa conferir?
4. Reescreva a cadeia com `<`: qual pergunta vem primeiro?
:::

:::tip Respostas
1. `Idoso Jovem Adulto`: no 60 e no 18, as bordas, o `>=` já vale
2. `'Adulto'`: 70 é `>= 18`, e a primeira saída engole a outra
3. As bordas: 60 e 59, 18 e 17
4. `idade < 18`, o `'Jovem'`; depois `idade < 60`, o `'Adulto'`; e o `else`, o `'Idoso'`
:::

---

## :icon[milestone] Projeto 3 · Passo 3: a situação do prazo

A tela pinta cada tarefa pela situação do prazo. No topo de `prazos.js`:

```javascript
import { diasAte } from '../utils/datas.js';
```

No fim do arquivo, uma guarda e uma cadeia de `else if`:

```javascript
// Etapa 1 (E17). A situação do prazo. O texto devolvido é também a cor da tarefa na tela.
export function situacaoDoPrazo(prazo, hoje) {
  if (prazo === null) {
    return 'sem-prazo';
  }
  const dias = diasAte(prazo, hoje);
  if (dias < 0) {
    return 'atrasada';
  } else if (dias === 0) {
    return 'vence-hoje';
  } else {
    return 'em-dia';
  }
}
```

O `..` sobe uma pasta, de `src/regras` para `src`, e de lá entra em `utils`. O `diasAte`, do kit, conta os dias de hoje até o prazo (hoje = 10/11):

| `prazo` | `dias` | O caminho | Devolve |
|---|---|---|---|
| `null` | não calcula | sai na guarda | `'sem-prazo'` |
| `'2026-11-07'` | -3 | `dias < 0` | `'atrasada'` |
| `'2026-11-10'` | 0 | `dias === 0` | `'vence-hoje'` |
| `'2026-11-15'` | 5 | o `else` | `'em-dia'` |

---

## :icon[milestone] Projeto 3 · Passo 3: os testes

Em `prazos.test.js`, a `situacaoDoPrazo` entra no `import`, e o `HOJE` fica logo abaixo dele:

```javascript
import { pesoDaPrioridade, situacaoDoPrazo } from './prazos.js';

const HOJE = new Date(2026, 10, 10); // 10 de novembro de 2026 (o mês começa em 0)
```

No fim do arquivo:

```javascript
test.each([
  [null, 'sem-prazo'],
  ['2026-11-07', 'atrasada'],
  ['2026-11-09', 'atrasada'],
  ['2026-11-10', 'vence-hoje'],
  ['2026-11-11', 'em-dia'],
  ['2026-11-15', 'em-dia'],
])('situacaoDoPrazo(%s) devolve %s', (prazo, situacao) => {
  expect(situacaoDoPrazo(prazo, HOJE)).toBe(situacao);
});

test('a hora de hoje não muda a situação', () => {
  const quaseMeiaNoite = new Date(2026, 10, 10, 23, 59);
  expect(situacaoDoPrazo('2026-11-10', quaseMeiaNoite)).toBe('vence-hoje');
});
```

Com mais dois números, o `Date` ganha a hora e o minuto: 23h59 do dia 10. O prazo do dia 10 continua vencendo hoje.

**Pronto quando:** `npm test` todo verde (`Tests: 20 passed`). Na tela, as 6 tarefas de demonstração, com a borda colorida pela situação; o prazo ainda em data e sem botões. Etapa 1: 2 de 4.

---

## O operador ??

A tarefa que não diz a prioridade é de prioridade alta, média ou baixa?

---

## :icon[circle-dot] ??: o valor de quando não vem

O **`??`** dá um valor para quando o outro não veio: `a ?? b` devolve `a`, mas troca por `b` quando a caixa `a` está vazia. Vazia é `null`, a caixa vazia de propósito do E10, ou `undefined`, a caixa que ninguém encheu.

```javascript
const dados = { titulo: 'Comprar ração do gato' };

const prioridade = dados.prioridade ?? 'media';
const prazo = dados.prazo ?? null;

console.log(prioridade); // media
console.log(prazo); // null
```

- A ficha não tem o campo `prioridade`. Ler um campo que não existe dá `undefined`, e o `??` troca por `'media'`
- Com o `prazo`, o mesmo: sem prazo, `null`
- No E18, a tarefa que só diz o título ganha a prioridade e o prazo com estas duas linhas

---

## :icon[circle-dot] ?? na prática

**Caso 1: o que veio, fica.** A conta de luz disse a prioridade, e o `??` não troca:

```javascript
const luz = { titulo: 'Pagar a conta de luz', prioridade: 'alta' };
console.log(luz.prioridade ?? 'media'); // alta
```

**Caso 2: o zero é um valor.** Uma mesa da Cantina Bella Nonna decidiu não dar gorjeta; a outra conta nem diz a gorjeta:

```javascript
const semGorjeta = { restaurante: 'Cantina Bella Nonna', gorjeta: 0 };
const semCampo = { restaurante: 'Cantina Bella Nonna' };

console.log(semGorjeta.gorjeta ?? 10); // 0
console.log(semCampo.gorjeta ?? 10); // 10
```

A primeira caixa tem um 0 dentro: não está vazia, e o `??` respeita a escolha. Ele não pergunta "é zero?", só "está vazia?". O mesmo vale para o texto vazio, `''`: ele fica.

---

## :icon[notebook-pen] Exercícios: O operador ??

:::example Exercícios
1. O pedido da lanchonete. O que cada linha mostra?

   ```javascript
   const pedido = { lanche: 'X-salada', gelo: 0, troco: null };
   console.log(pedido.bebida ?? 'água');
   console.log(pedido.gelo ?? 3);
   console.log(pedido.troco ?? 'sem troco');
   ```

2. Complete para o volume do celular ser 5 quando `config.volume` não vier: `const volume = config.volume ___ 5;`
3. Na ficha `{ nome: 'Leo', ativo: false }`, o que dá `ficha.ativo ?? true`?
4. Com `ficha.apelido ?? 'sem apelido'`, qual a diferença entre a ficha `{ apelido: '' }` e a ficha `{}`?
:::

:::tip Respostas
1. `água`, `0` e `sem troco`: a `bebida` não existe e o `troco` é `null`, mas o `0` é um valor e fica
2. `??`
3. `false`: o `??` só troca `null` e `undefined`
4. Com `''`, fica o texto vazio; sem o campo, `undefined`, e vem `'sem apelido'`
:::

---

## O operador ?.

Dá para ler o dia do aniversário de quem não informou o aniversário?

---

## :icon[link] ?.: ler sem quebrar

Na agenda do Projeto 2, o aniversário é uma ficha dentro da ficha do contato, ou `null`, a caixa vazia, para quem não informou. Ler o `dia` de dentro da caixa vazia para o programa com erro. O **`?.`** olha antes de entrar: se a ficha está lá, lê o campo; se a caixa está vazia, responde `undefined` e segue.

```javascript
const mariana = { nome: 'Mariana Souza', aniversario: { dia: 30, mes: 10 } };
const daniel = { nome: 'Daniel Rocha', aniversario: null };

console.log(mariana.aniversario?.dia); // 30
console.log(daniel.aniversario?.dia); // undefined
console.log(daniel.aniversario.dia);
// TypeError: Cannot read properties of null (reading 'dia')
```

O `?.` fica no lugar do ponto, logo depois do que pode faltar: `aniversario?.dia`.

---

## :icon[link] ?. na prática

**Caso 1: `?.` e `??` juntos.** O `?.` lê sem quebrar, e o `??` dá o texto de quando não veio:

```javascript
console.log(daniel.aniversario?.dia ?? 'sem data'); // sem data
```

**Caso 2: o `find` que não acha.** Desde o E14, você sabe que o `find` devolve `undefined` quando nenhum item passa no teste:

```javascript
const tarefas = [{ titulo: 'Regar as plantas', prazo: '2026-11-10' }];
const achada = tarefas.find((tarefa) => tarefa.titulo === 'Lavar o carro');

console.log(achada?.prazo); // undefined
console.log(achada?.prazo ?? 'não achei'); // não achei
console.log(achada.prazo);
// TypeError: Cannot read properties of undefined (reading 'prazo')
```

:::tip
Use o `?.` só onde o valor pode faltar de verdade. Espalhado por todo lado, ele esconde o erro de um dado que devia estar lá.
:::

---

## :icon[notebook-pen] Exercícios: O operador ?.

:::example Exercícios
1. O endereço do cadastro. O que aparece?

   ```javascript
   const ana = { nome: 'Ana', endereco: { cidade: 'Recife' } };
   const leo = { nome: 'Leo', endereco: null };
   console.log(ana.endereco?.cidade, leo.endereco?.cidade);
   ```

2. E `console.log(leo.endereco.cidade)`?
3. Complete para mostrar `sem cidade` quando o endereço faltar: `leo.endereco___cidade ___ 'sem cidade'`
4. As linhas de ônibus. O que aparece?

   ```javascript
   const linhas = [{ numero: 101, destino: 'Centro' }];
   const achada = linhas.find((linha) => linha.numero === 202);
   console.log(achada?.destino ?? 'linha não existe');
   ```
:::

:::tip Respostas
1. `Recife undefined`: o endereço do Leo é `null`, e o `?.` responde `undefined`, sem erro
2. `TypeError: Cannot read properties of null (reading 'cidade')`: sem o `?.`, o ponto entra na caixa vazia
3. `?.` e `??`: o `?.` lê sem quebrar, e o `??` troca o `undefined` pelo texto
4. `linha não existe`: o `find` não achou a 202 e deu `undefined`
:::

---

## O while

Guardando R$ 30 por semana, quando você para de guardar para juntar R$ 100?

---

## :icon[repeat] while: repete enquanto a condição vale

Um **laço** repete um trecho, como conferir o carrinho item por item, até acabar. O **`while`** (enquanto) repete sem precisar de lista: antes de cada volta, faz a pergunta da condição. Com `true`, roda as chaves e pergunta de novo; com `false`, segue para depois do `}`.

```javascript
let guardado = 0;
let semanas = 0;
while (guardado < 100) {
  guardado = guardado + 30;
  semanas = semanas + 1;
}
console.log(semanas, guardado); // 4 120
```

| Volta | `guardado` antes | `guardado < 100`? | Depois da volta |
|---|---|---|---|
| 1 | 0 | sim | 30, 1 semana |
| 2 | 30 | sim | 60, 2 semanas |
| 3 | 60 | sim | 90, 3 semanas |
| 4 | 90 | sim | 120, 4 semanas |
| fim | 120 | não | sai do laço |

---

## :icon[triangle-alert] O laço que não acaba

O `while` só para quando a condição vira `false`. Se nada dentro das chaves muda a caixa da condição, ela fica `true` para sempre: é o laço sem fim do E11, o **laço infinito**.

```javascript
let guardado = 0;
let semanas = 0;
while (guardado < 100) {
  semanas = semanas + 1; // faltou guardar os 30
}
console.log(semanas);
```

- O terminal fica parado: não mostra nada e não volta. O `npm test` trava do mesmo jeito
- Para encerrar: <kbd>Ctrl</kbd> + <kbd>C</kbd> no terminal
- Antes de rodar, confira: alguma linha dentro das chaves muda a caixa da condição? Ela anda na direção da saída?

---

## :icon[notebook-pen] Exercícios: O while

:::example Exercícios
1. O celular carregando. O que aparece?

   ```javascript
   let bateria = 20;
   let minutos = 0;
   while (bateria < 100) {
     bateria = bateria + 25;
     minutos = minutos + 10;
   }
   console.log(minutos, bateria);
   ```

2. E se a `bateria` começasse em `100`?
3. Ache o erro:

   ```javascript
   let degrau = 0;
   while (degrau < 10) {
     console.log(degrau);
   }
   ```

4. Na academia, a corrida começa com 2 km e ganha 1 km por semana. Escreva o `while` que conta as semanas até 10 km
:::

:::tip Respostas
1. `40 120`: quatro voltas, com a bateria em 45, 70, 95 e 120
2. `0 100`: a condição já começa `false`, e o laço roda zero vezes
3. Nada muda o `degrau`, e o laço não acaba: falta `degrau = degrau + 1;` dentro das chaves
4. `while (km < 10) { km = km + 1; semanas = semanas + 1; }`, com `km` em 2 e `semanas` em 0: 8 semanas
:::

---

## :icon[milestone] Projeto 3 · Passo 4: o próximo prazo

"Regar as plantas" se repete toda semana. Ao concluir, a próxima vez precisa cair **depois de hoje**. No topo de `prazos.js`, o `somarDias` entra no `import`:

```javascript
import { diasAte, somarDias } from '../utils/datas.js';
```

No fim do arquivo:

```javascript
// Etapa 1 (E17). O prazo da próxima vez de uma tarefa que se repete.
// A próxima data fica sempre depois de hoje: enquanto não ficar, pula mais um período.
export function proximoPrazo(prazo, frequencia, hoje) {
  const dias = frequencia === 'diaria' ? 1 : 7;
  let novo = somarDias(prazo, dias);
  while (diasAte(novo, hoje) <= 0) {
    novo = somarDias(novo, dias);
  }
  return novo;
}
```

| Linha | O que ela diz |
|---|---|
| `frequencia === 'diaria' ? 1 : 7` | o ternário do E10: "diária pula 1 dia; senão, 7" |
| `somarDias(prazo, dias)` | do kit: "o prazo mais tantos dias", de novo em texto |
| `while (diasAte(novo, hoje) <= 0)` | "enquanto a data nova não passar de hoje, pule mais um período" |

O `<= 0` inclui o hoje: quem conclui hoje a tarefa da semana não quer outra para hoje.

---

## :icon[milestone] Projeto 3 · Passo 4: os testes, volta por volta

Em `prazos.test.js`, o `import` ganha o `proximoPrazo`, e o teste vai no fim. Cada linha traz três valores, e a função do teste recebe os três, na ordem:

```javascript
import { pesoDaPrioridade, proximoPrazo, situacaoDoPrazo } from './prazos.js';
```

```javascript
test.each([
  ['2026-11-10', 'semanal', '2026-11-17'],
  ['2026-11-10', 'diaria', '2026-11-11'],
  ['2026-11-12', 'semanal', '2026-11-19'],
  ['2026-10-27', 'semanal', '2026-11-17'],
  ['2026-11-28', 'semanal', '2026-12-05'],
])('proximoPrazo(%s, %s) devolve %s', (prazo, frequencia, esperado) => {
  expect(proximoPrazo(prazo, frequencia, HOJE)).toBe(esperado);
});
```

O prazo `'2026-10-27'`, semanal, com hoje = 10/11:

| Volta | `novo` | `diasAte(novo, hoje)` | `<= 0`? |
|---|---|---|---|
| antes do `while` | `'2026-11-03'` | -7 | sim: soma 7 |
| 1 | `'2026-11-10'` | 0 | sim: soma 7 |
| 2 | `'2026-11-17'` | 7 | não: sai e devolve |

**Pronto quando:** `npm test` todo verde (`Tests: 25 passed`); na tela, Etapa 1: 3 de 4.

---

## :icon[milestone] Projeto 3 · Sua vez: o prazo em palavras

Sozinho: `textoDoPrazo(prazo, hoje)`, com `export`, em `prazos.js`, devolve o prazo em palavras. Os testes vêm primeiro, num `test.each` com os seis casos (hoje = 10/11):

```javascript
textoDoPrazo(null, HOJE); // 'Sem prazo'
textoDoPrazo('2026-11-07', HOJE); // 'Atrasada há 3 dias'
textoDoPrazo('2026-11-09', HOJE); // 'Atrasada há 1 dia'
textoDoPrazo('2026-11-10', HOJE); // 'Vence hoje'
textoDoPrazo('2026-11-11', HOJE); // 'Vence amanhã'
textoDoPrazo('2026-11-15', HOJE); // 'Vence em 5 dias'
```

:::tip Dicas
- O começo é o da `situacaoDoPrazo`: a guarda e o `diasAte`
- O menos na frente troca o sinal: com `dias` em -3, `-dias` dá 3
- "dia" ou "dias" é um ternário, que cabe dentro do `${ }`, como em `${n === 1 ? 'item' : 'itens'}`
:::

**Pronto quando:** `npm test` todo verde; na tela, "Atrasada há 2 dias", "Vence hoje" e "Vence amanhã"; Etapa 1: 4 de 4.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `is not a function` | sem `export`, ou outro nome | `export` e o nome letra por letra |
| `diasAte precisa de hoje` | faltou passar o `hoje` | `diasAte(prazo, hoje)` |
| `O prazo precisa ser um texto` | o `null` chegou ao `diasAte` | a guarda vem antes |
| `Received: undefined` | um caminho sem `return` | `return` em todo caminho |
| `Failed to fetch dynamically imported module`, na tela | `import` sem o `.js` | `'../utils/datas.js'` |
| `Could not read package.json` ou `'jest' não é reconhecido` | fora da pasta, ou sem `npm install` | `cd lista-de-tarefas` e `npm install` |

---

## :icon[milestone] Projeto 3 · Etapa 1 pronta

- `src/regras/prazos.js` com as quatro funções, cada uma com `export`: `pesoDaPrioridade`, `situacaoDoPrazo`, `proximoPrazo` e `textoDoPrazo`
- `src/regras/prazos.test.js` com os testes delas, e o `npm test` todo verde (31 testes no exemplo do curso)
- Na tela, as 6 tarefas de demonstração com o prazo em palavras, ainda sem botões; o aviso amarelo já pede a Etapa 2, `Tarefa.js`

```bash
git add .
git commit -m "Projeto 3: etapa 1, prazo e prioridade"
git push
```

O GitHub mostra dois commits: o do kit e o da etapa 1. Faltou a Sua vez? Termine em casa, pelos slides e pelo enunciado, e faça o commit da etapa quando ela ficar pronta.

---

## Resumo

:::summary
- O `switch` compara um valor com cada `case`, com `===`; `return` ou `break` saem, e o `default` pega o resto
- Sem `return` nem `break`, a execução desce para o `case` de baixo
- Na cadeia de `else if`, vale a primeira `true`: com `<`, a faixa menor primeiro; com `>=`, a maior. Teste as bordas
- O retorno antecipado tira da frente, no começo da função, o caso que não serve
- `a ?? b` troca só a caixa vazia, `null` ou `undefined`: o `0` e o `''` ficam
- `?.` lê o campo só se o que vem antes existe; se não, `undefined`, sem erro
- O `while` repete enquanto a condição é `true`: alguma linha dentro dele precisa levar à saída
:::

---

## :icon[arrow-right] Próximos passos

No E18, a tarefa vira uma **classe**, a forma de bolo de onde saem todas as tarefas da lista:

- :icon[boxes] `new Tarefa({ titulo: 'Pagar a conta de luz' })` cria uma tarefa
- :icon[circle-dot] o `??` de hoje dá a prioridade `'media'` à tarefa que não disse a dela
- :icon[list-checks] um `switch`, como o do peso, escreve o rótulo: `'Alta'`, `'Média'`, `'Baixa'`
- :icon[circle-check] o botão Concluir da tela passa a funcionar
