---
title: Sem rasurar o original
summary: "Referência, cópia com spread e reduce para agrupar: a agenda adiciona, edita, remove e separa por letra."
module: linguagem-js
duration_minutes: 90
objectives:
  - Explicar o que é uma referência e por que mudar a lista recebida quebra o Desfazer
  - Adicionar, remover e editar contatos sem rasurar, com spread, filter e map
  - Agrupar uma lista numa ficha com reduce, começando de uma ficha vazia
  - Usar num arquivo de regras uma função que mora em outro
---

# Sem rasurar o original

Programador Mobile · Encontro E15 · Aula 15 de 45

---

## O que você vai aprender

:::goal
- Entender por que dois nomes podem levar à mesma lista: a referência
- Tirar uma cópia com spread e mexer só na cópia, em listas e em fichas
- Adicionar, remover e editar contatos sem rasurar a lista recebida
- Separar os contatos por letra com `reduce`
- Ligar o Salvar, o Remover, o Editar e o Desfazer da página da agenda
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **referência** | o endereço de uma lista ou de uma ficha; a caixa guarda o endereço, não a lista |
| **mutar** (rasurar) | mudar uma lista ou uma ficha que já existe, em vez de fazer outra |
| **imutabilidade** | o hábito de não mutar o que a função recebeu: ela devolve uma lista ou uma ficha nova |
| **spread** (`...`) | os três pontos que espalham os itens de uma lista, ou os campos de uma ficha, dentro de uma nova (*spread*, espalhar) |
| **agrupar** | separar uma lista em grupos com nome: os contatos do A, os do B |

---

## O Desfazer da agenda

Na página da agenda, você remove a Mariana sem querer e toca em **Desfazer**: ela volta. Para isso, a página guarda a lista de antes de cada mudança e, no Desfazer, volta para ela.

Hoje, o painel da página mostra 7 de 14: os botões Remover e Editar não aparecem, e o Salvar avisa "Falta adicionarContato". No fim do encontro, os três funcionam, com Desfazer, e o `npm run agenda mar` termina com as letras:

```plaintext
H: Helena Martins
M: Marcos Teixeira, Mariana Souza
```

:::question
Se a função que remove apagar a Mariana da própria lista guardada, para onde o Desfazer volta?
:::

---

## Referência

Dois amigos têm o endereço da sua casa. Um pinta a porta. O que o outro vê?

---

## :icon[map-pin] Referência: o endereço da casa

Uma lista não fica dentro da caixa da `const`. Ela mora num lugar só, como uma casa, e a caixa guarda o **endereço** dela: a **referência**. Dois papéis com o mesmo endereço levam à mesma casa.

```javascript
const lista = ['Ana', 'Bruno'];
const mesmoEndereco = lista;
mesmoEndereco.push('Carla');

console.log(lista); // [ 'Ana', 'Bruno', 'Carla' ]
```

| Linha | O que ela diz |
|---|---|
| `const mesmoEndereco = lista;` | "anote o endereço da `lista` num segundo papel": o "outro nome para a mesma lista" do E14 |
| `mesmoEndereco.push('Carla');` | "vá até essa casa e ponha a Carla no fim", o `push` do E11 |
| `console.log(lista);` | a mesma casa: a Carla está lá |

Vale para lista e para ficha. A `const` lacra a caixa com o endereço, não a casa: por isso o `push` funciona, como no E13.

---

## :icon[map-pin] Referência na prática

**Caso 1: a função recebe o endereço.** Quem recebe uma lista recebe o endereço dela. Se a função mexe na lista, mexe na lista de quem chamou:

```javascript
function convidarCarla(convidados) {
  convidados.push('Carla');
  return convidados;
}

const festa = ['Ana', 'Bruno'];
const comCarla = convidarCarla(festa);
console.log(festa.length, comCarla.length); // 3 3
```

A `festa` mudou sem ninguém pedir. É o que a página da agenda chama de "mudou a lista que recebeu".

**Caso 2: o `===` compara endereços.** Com lista e ficha, ele pergunta "é a mesma casa?", e não "o que tem dentro é igual?":

```javascript
console.log(festa === comCarla);  // true: a mesma casa
console.log(['Ana'] === ['Ana']); // false: duas casas, iguais por dentro
```

---

## Spread em listas

Antes de marcar um documento importante, o que você faz para não estragar o original?

---

## :icon[copy] Spread: uma cópia para mexer

Para mudar uma lista sem rasurar o original, tire uma cópia e mexa na cópia. Os três pontos `...` são o **spread** (espalhar): eles espalham os itens de uma lista dentro de uma lista **nova**. No E14, o `[...contatos]` fez a cópia antes do `sort`.

```javascript
const lista = ['Ana', 'Bruno'];
const comCarla = [...lista, 'Carla'];

console.log(lista);    // [ 'Ana', 'Bruno' ]
console.log(comCarla); // [ 'Ana', 'Bruno', 'Carla' ]
```

| Parte | O que ela diz |
|---|---|
| `[` e `]` | "uma lista nova": uma casa nova, com endereço novo |
| `...lista` | "com todos os itens da `lista`, na mesma ordem" |
| `, 'Carla'` | "e, no fim, a Carla" |

A `lista` continua com 2. Só a cópia ganhou a Carla.

---

## :icon[copy] Spread em listas na prática

**Caso 1: um item no começo.** O contato aberto agora vai para a frente dos recentes:

```javascript
const recentes = ['Bruno', 'Helena'];
const agora = ['Mariana', ...recentes];
console.log(agora);    // [ 'Mariana', 'Bruno', 'Helena' ]
console.log(recentes); // [ 'Bruno', 'Helena' ]
```

**Caso 2: juntar duas listas.** Os convidados da noiva e os do noivo, numa lista só:

```javascript
const daNoiva = ['Ana', 'Bruno'];
const doNoivo = ['Carla', 'Daniel'];
console.log([...daNoiva, ...doNoivo]); // [ 'Ana', 'Bruno', 'Carla', 'Daniel' ]
```

**Caso 3: a cópia é outra casa.** Mexer nela não mexe no original:

```javascript
const copia = [...daNoiva];
copia.push('Elisa');
console.log(daNoiva, copia);    // [ 'Ana', 'Bruno' ] [ 'Ana', 'Bruno', 'Elisa' ]
console.log(copia === daNoiva); // false
```

---

## :icon[milestone] Projeto 2 · Passo 1: proximoId

Cada contato novo precisa de um `id` que ninguém tem: o maior `id` da lista mais 1. Em `src/regras/edicao.js`, abaixo do comentário do kit:

```javascript
// O id do próximo contato: o maior id da lista mais 1. Na lista vazia, 1.
export function proximoId(contatos) {
  let maior = 0;
  for (const contato of contatos) {
    if (contato.id > maior) {
      maior = contato.id;
    }
  }
  return maior + 1;
}
```

Volta por volta, com `[{ id: 3 }, { id: 9 }, { id: 5 }]`:

| Volta | `contato.id` | `maior` antes | `contato.id > maior`? | `maior` depois |
|---|---|---|---|---|
| 1 | 3 | 0 | sim | 3 |
| 2 | 9 | 3 | sim | 9 |
| 3 | 5 | 9 | não | 9 |

No fim, `return maior + 1` entrega 10. O `contatos.length + 1` daria 4, e depois de uma remoção repetiria um `id` que já existe.

---

## :icon[milestone] Projeto 2 · Passo 1: adicionarContato

O contato novo é montado pelo `criarContato` do E13, que mora no `contato.js`. Pela primeira vez, um arquivo de regras usa outro: o `edicao.js` pega o `criarContato` da vitrine do `contato.js`. Logo abaixo do comentário do kit, acima do `proximoId`:

```javascript
import { criarContato } from './contato.js';
```

E, no fim do `edicao.js`:

```javascript
// Uma lista nova, com o contato novo no fim. A lista recebida fica como estava.
export function adicionarContato(contatos, dados) {
  const novo = criarContato(proximoId(contatos), dados);
  return [...contatos, novo];
}
```

- `'./contato.js'`: o `./` quer dizer "nesta mesma pasta", a `src/regras`, e o `.js` no fim é obrigatório
- `criarContato(proximoId(contatos), dados)`: o `id` é o que o `proximoId` devolver; a ficha nasce como no E13
- `[...contatos, novo]`: uma lista nova, com todos os de antes e o novo no fim

---

## :icon[milestone] Projeto 2 · Passo 1: os testes

Crie `src/regras/edicao.test.js`. No topo, a ficha `rafaela`, os dados do formulário:

```javascript
import { contatos } from '../data/contatos.js';
import { proximoId, adicionarContato } from './edicao.js';

const rafaela = {
  nome: 'Rafaela Lopes',
  telefone: '(11) 91234-5678',
  email: '',
  grupo: 'amigos',
  aniversario: null,
};
```

Depois, os três testes:

```javascript
test('proximoId é o maior id mais 1', () => {
  expect(proximoId(contatos)).toBe(16);
  expect(proximoId([{ id: 3 }, { id: 9 }, { id: 5 }])).toBe(10);
  expect(proximoId([])).toBe(1);
});

test('adicionarContato põe a Rafaela no fim, com o id 16', () => {
  const nova = adicionarContato(contatos, rafaela);
  expect(nova.length).toBe(16);
  expect(nova[15].id).toBe(16);
  expect(nova[15].nome).toBe('Rafaela Lopes');
});
```

```javascript
test('adicionarContato não muda a lista recebida', () => {
  adicionarContato(contatos, rafaela);
  expect(contatos.length).toBe(15);
});
```

**Pronto quando** `npm test` mostra `Test Suites: 4 passed, 4 total` e `Tests: 25 passed, 25 total`.

---

## Mudar sem rasurar

Você risca um nome da lista de convidados. Depois, como saber quem estava nela?

---

## :icon[undo-2] Sem rasurar: a lista recebida fica como estava

A regra da agenda: **nenhuma função muda o que recebeu**. Ela tira uma cópia, mexe na cópia e devolve a lista **nova**, sem rasurar o original. Esse hábito é a **imutabilidade**. É ele que faz o Desfazer funcionar: a página guarda a lista de antes, e ela precisa continuar como estava.

| Para | Rasura (evite) | Lista nova (use) |
|---|---|---|
| adicionar | `contatos.push(novo)` | `[...contatos, novo]` |
| remover | `contatos.splice(1, 1)` | `contatos.filter(...)` |
| ordenar | `contatos.sort(...)` | `[...contatos].sort(...)` |
| trocar um campo | `contato.grupo = 'trabalho'` | uma ficha nova, com spread |

O **`splice(1, 1)`** tira 1 item da gaveta 1, na própria lista.

---

## :icon[undo-2] Sem rasurar na prática

**Caso 1: tirar o Bruno.** O `filter`, a peneira da aula 3, faz uma lista nova. O `splice` tira da própria lista:

```javascript
const antes = ['Ana', 'Bruno', 'Carla'];
const semBruno = antes.filter((nome) => nome !== 'Bruno');
console.log(antes);    // [ 'Ana', 'Bruno', 'Carla' ]
console.log(semBruno); // [ 'Ana', 'Carla' ]

antes.splice(1, 1);
console.log(antes);    // [ 'Ana', 'Carla' ]: o Bruno sumiu do original
```

**Caso 2: o Desfazer.** A página guarda o endereço da lista de antes, chama a função que remove e mostra a lista que ela devolveu:

| A função usa | A lista guardada | O Desfazer mostra |
|---|---|---|
| `filter` | continua com os 15 | os 15: a Mariana volta |
| `splice` na lista recebida | é a mesma casa da nova, com 14 | os 14: a Mariana sumiu de vez |

---

## :icon[milestone] Projeto 2 · Passo 2: removerContato

No fim do `edicao.js`:

```javascript
// Uma lista nova, sem o contato daquele id.
export function removerContato(contatos, id) {
  return contatos.filter((contato) => contato.id !== id);
}
```

A peneira fica com quem tem o `id` **diferente** (`!==`): todos, menos aquele. O `filter` já devolve uma lista nova.

No `edicao.test.js`, o `import` vira `import { proximoId, adicionarContato, removerContato } from './edicao.js';` e, no fim:

```javascript
test('removerContato tira o Bruno, de id 2', () => {
  const nova = removerContato(contatos, 2);
  expect(nova.length).toBe(14);
  expect(nova[1].nome).toBe('Helena Martins');
});

test('removerContato não muda a lista recebida', () => {
  removerContato(contatos, 2);
  expect(contatos.length).toBe(15);
  expect(contatos[1].nome).toBe('Bruno Carvalho');
});
```

**Pronto quando** `npm test` mostra `Tests: 27 passed, 27 total` (4 suites).

---

## Spread em objetos

Você trocou de número de celular. Na sua ficha da academia, o que muda?

---

## :icon[copy] Spread em objetos: a ficha nova

O spread também copia **fichas**: `{ ...bruno }` espalha os campos do `bruno` numa ficha nova. Depois dele, vêm os campos que mudam. **O que vem depois ganha**:

```javascript
const bruno = { id: 2, nome: 'Bruno Carvalho', grupo: 'amigos' };
const mudancas = { grupo: 'trabalho' };
const novo = { ...bruno, ...mudancas };

console.log(novo);  // { id: 2, nome: 'Bruno Carvalho', grupo: 'trabalho' }
console.log(bruno); // { id: 2, nome: 'Bruno Carvalho', grupo: 'amigos' }
```

Campo por campo:

| Campo | do `bruno` | das `mudancas` | Na ficha nova |
|---|---|---|---|
| `id` | 2 | | 2 |
| `nome` | `'Bruno Carvalho'` | | `'Bruno Carvalho'` |
| `grupo` | `'amigos'` | `'trabalho'` | `'trabalho'`: o que vem depois ganha |

Com chaves `{ }`, nasce uma ficha; com colchetes `[ ]`, uma lista.

---

## :icon[copy] Spread em objetos na prática

**Caso 1: trocar um campo.** Depois do spread, o campo com o valor novo:

```javascript
const helena = { nome: 'Helena Martins', favorito: true };
const semEstrela = { ...helena, favorito: false };
console.log(semEstrela); // { nome: 'Helena Martins', favorito: false }
console.log(helena);     // { nome: 'Helena Martins', favorito: true }
```

**Caso 2: a ordem importa.** Com o spread por último, o campo antigo cobre o novo:

```javascript
const errado = { favorito: false, ...helena };
console.log(errado); // { favorito: true, nome: 'Helena Martins' }
```

**Caso 3: a ficha nova é outra casa**, mesmo com o mesmo conteúdo:

```javascript
const copia = { ...helena };
console.log(copia === helena); // false
```

---

## :icon[milestone] Projeto 2 · Passo 3: editarContato

O `map` do E14 é a linha de produção: monta uma lista nova, do mesmo tamanho. Com a seta de chaves, o `if` e o `return`, como no E14, ele escolhe o que sai: o contato do `id` vira uma ficha nova; os outros passam como estão. No fim do `edicao.js`:

```javascript
// Uma lista nova em que o contato daquele id é uma ficha nova, com as mudanças.
// Os outros contatos passam como estão.
export function editarContato(contatos, id, mudancas) {
  return contatos.map((contato) => {
    if (contato.id === id) {
      return { ...contato, ...mudancas };
    }
    return contato;
  });
}
```

Item por item, com `editarContato(contatos, 2, { grupo: 'trabalho' })`:

| `contato` | `contato.id === 2`? | O `map` devolve |
|---|---|---|
| Mariana (id 1) | não | a mesma ficha da Mariana |
| Bruno (id 2) | sim | uma ficha nova, com `grupo: 'trabalho'` |
| Helena (id 3) e os outros | não | as mesmas fichas de antes |

---

## :icon[milestone] Projeto 2 · Passo 3: os testes

No `edicao.test.js`, o `import` ganha `editarContato`, no fim da lista entre chaves, e, no fim do arquivo:

```javascript
test('editarContato muda só o que veio nas mudanças', () => {
  const nova = editarContato(contatos, 2, { grupo: 'trabalho' });
  expect(nova[1].grupo).toBe('trabalho');
  expect(nova[1].nome).toBe('Bruno Carvalho');
});

test('editarContato não rasura o original', () => {
  const nova = editarContato(contatos, 2, { grupo: 'trabalho' });
  expect(contatos[1].grupo).toBe('amigos');
  expect(nova[0]).toBe(contatos[0]);
});
```

- O **`toEqual`** compara o que tem dentro, campo por campo. O **`toBe`** com ficha pergunta "é a mesma casa?", como o `===`: com duas fichas iguais por dentro, ele dá vermelho, como no E13
- `expect(nova[0]).toBe(contatos[0])`: a Mariana da lista nova é **a mesma** ficha da lista de antes. Só o Bruno ganhou ficha nova

**Pronto quando** `npm test` mostra `Tests: 29 passed, 29 total` (4 suites).

---

## Agrupar com reduce

Na agenda de papel, como você acha depressa os contatos que começam com M?

---

## :icon[calculator] reduce: uma ficha no visor

O **`reduce`** é a calculadora que vai acumulando, da aula 3. Até hoje, o visor era um número. Ele também pode ser uma **ficha**, com um campo para cada grupo. Quantos contatos há em cada grupo?

```javascript
const contagem = contatos.reduce((visor, contato) => {
  visor[contato.grupo] = visor[contato.grupo] + 1;
  return visor;
}, { familia: 0, amigos: 0, trabalho: 0 });

console.log(contagem); // { familia: 4, amigos: 6, trabalho: 5 }
```

| Volta | `contato` | `contato.grupo` | `visor` depois |
|---|---|---|---|
| 1 | Mariana | `'amigos'` | `{ familia: 0, amigos: 1, trabalho: 0 }` |
| 2 | Bruno | `'amigos'` | `{ familia: 0, amigos: 2, trabalho: 0 }` |
| 3 | Helena | `'familia'` | `{ familia: 1, amigos: 2, trabalho: 0 }` |

- `visor[contato.grupo]`: os colchetes do E13 usam o grupo, `'amigos'`, como nome do campo
- `return visor` passa a ficha para a próxima volta

---

## :icon[calculator] Agrupar na prática

**Caso 1: os nomes de cada grupo.** O visor começa vazio, `{}`. Na primeira vez de um grupo, ele ganha uma lista vazia; depois, o `push` põe o nome nela:

```javascript
const nomesPorGrupo = contatos.reduce((grupos, contato) => {
  if (grupos[contato.grupo] === undefined) {
    grupos[contato.grupo] = [];
  }
  grupos[contato.grupo].push(contato.nome);
  return grupos;
}, {});

console.log(nomesPorGrupo.familia.join(', '));
// Helena Martins, Ana Beatriz Costa, Érica Nogueira, Paula Fernandes
```

- `grupos[contato.grupo] === undefined` pergunta "esse grupo ainda não tem lista?"
- O `push` aqui não rasura nada: a ficha e as listas nasceram dentro do `reduce`
- O `join(', ')`, do E12, junta os nomes num texto só

**Caso 2: a ordem dos grupos.** Cada campo nasce quando aparece o primeiro contato dele:

```javascript
console.log(Object.keys(nomesPorGrupo)); // [ 'amigos', 'familia', 'trabalho' ]
```

---

## :icon[text] A inicial do kit

Para separar por letra, falta a letra de cada nome. O kit traz pronta, em `src/regras/texto.js`, a função `inicial`:

```javascript
export function inicial(nome) {
  const letra = nome.trim()[0].toUpperCase();
  if (SEM_ACENTO[letra] !== undefined) {
    return SEM_ACENTO[letra];
  }
  return letra;
}
```

| Parte | Com `'Álvaro Mendes'` |
|---|---|
| `nome.trim()[0]` | o texto também é uma fileira de gavetas: a gaveta 0 é `'Á'` |
| `.toUpperCase()` | em maiúscula; com `'bruno'`, daria `'B'` |
| `SEM_ACENTO[letra]` | os colchetes do E13 procuram na ficha `SEM_ACENTO`, `{ Á: 'A', É: 'E', ... }`, o campo `Á`: dá `'A'` |
| `!== undefined` | o `!==` do E14, "é diferente?": a letra está na ficha? O `M` não está e volta como veio |

Com ela, Álvaro e Ana ficam juntos no A, e Érica, no E.

---

## :icon[milestone] Projeto 2 · Passo 4: agruparPorLetra

No `lista.js`, logo abaixo do comentário do kit, o `import`:

```javascript
import { inicial } from './texto.js';
```

E, no fim do `lista.js`:

```javascript
// Os contatos separados pela inicial do nome: { A: [...], B: [...] }.
// Cada letra guarda os contatos na ordem em que vieram.
export function agruparPorLetra(contatos) {
  return contatos.reduce((grupos, contato) => {
    const letra = inicial(contato.nome);
    if (grupos[letra] === undefined) {
      grupos[letra] = [];
    }
    grupos[letra].push(contato);
    return grupos;
  }, {});
}
```

É o "Agrupar na prática" com outra chave: a letra no lugar do grupo, e o contato inteiro no lugar do nome. A lista `contatos` não muda.

---

## :icon[calculator] agruparPorLetra, volta por volta

As quatro primeiras voltas, com a lista em ordem:

| Volta | `contato` | `letra` | Já tinha lista? | `grupos` depois |
|---|---|---|---|---|
| 1 | Álvaro Mendes | `A` | não: `[]` | `{ A: [Álvaro] }` |
| 2 | Ana Beatriz Costa | `A` | sim | `{ A: [Álvaro, Ana] }` |
| 3 | Bruno Carvalho | `B` | não | `{ A: [Álvaro, Ana], B: [Bruno] }` |
| 4 | Carla Dias | `C` | não | `{ A: [...], B: [...], C: [Carla] }` |

- O `{}` do fim é o visor no começo; o `return grupos` passa o visor adiante
- Lista em ordem, letras em ordem: A, B, C...

---

## :icon[milestone] Projeto 2 · Passo 4: os testes e as letras

No `lista.test.js`, o `import` ganha `agruparPorLetra` no fim da lista e, no fim do arquivo:

```javascript
test('agruparPorLetra: as 12 letras, em ordem, com a lista ordenada', () => {
  const grupos = agruparPorLetra(ordenarPorNome(contatos));
  expect(Object.keys(grupos).join('')).toBe('ABCDEFGHJMPR');
});

test('agruparPorLetra: Álvaro e Ana juntos no A', () => {
  const grupos = agruparPorLetra(ordenarPorNome(contatos));
  expect(nomesDosContatos(grupos.A)).toEqual(['Álvaro Mendes', 'Ana Beatriz Costa']);
});
```

No `agenda.js`, o `import` de `lista.js` vira `import { buscarContatos, ordenarPorNome, agruparPorLetra, nomesDosContatos } from '../regras/lista.js';` e, no fim:

```javascript
console.log('');
const porLetra = agruparPorLetra(encontrados);
for (const [letra, daLetra] of Object.entries(porLetra)) {
  console.log(`${letra}: ${nomesDosContatos(daLetra).join(', ')}`);
}
```

O `console.log('')` deixa uma linha em branco. O `Object.entries` dá os pares `[letra, contatos]`, como no E13, e o `join` do E12 junta os nomes.

**Pronto quando** `npm test` mostra `Tests: 31 passed, 31 total` e `npm run agenda mar` termina com `H: Helena Martins` e `M: Marcos Teixeira, Mariana Souza`.

---

## :icon[milestone] Projeto 2 · Sua vez: aniversariantesDoMes

Agora, sozinho. No `lista.js`, com `export`, escreva `aniversariantesDoMes(contatos, mes)`; o `mes` vai de 1 a 12. Ela devolve quem faz aniversário no mês, do dia menor ao maior; quem tem `aniversario: null` nunca entra.

Três testes: outubro (10) dá Juliana (dia 8) e Mariana (dia 30), nessa ordem; março (3), Fernanda e Bruno; só o Daniel, `[contatos[10]]`, dá `[]`.

:::tip Dicas
- Duas peneiras: uma tira quem não tem aniversário; a outra fica com quem é do mês, `contato.aniversario.mes`
- Para ordenar pelo dia, o `sort` com números do E14. O `filter` já fez uma lista nova: o `sort` nela não rasura
- Nos testes, `nomesDosContatos` ajuda a comparar com `toEqual`
:::

**Pronto quando** `npm test` mostra `Tests: 34 passed, 34 total`.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `não muda a lista recebida`, `Received: 17` | `push` na lista do kit | `[...contatos, novo]` |
| `tira o Bruno`, `Received: 1` | `===`: ficou só o Bruno | `!==` na peneira |
| `não rasura o original`, `Received: "trabalho"` | `contato.grupo = ...` no `map` | `{ ...contato, ...mudancas }` |
| `undefined (reading 'A')` | faltou o `return grupos` | `return grupos;` no fim |
| `inicial is not defined` | faltou o `import` no `lista.js` | `import { inicial } from './texto.js';` |
| na página, "mudou a lista que recebeu" | `push`, `splice` ou `sort` na lista que chegou | `[...]` ou `filter` |

---

## :icon[milestone] Projeto 2 · Etapa 3 pronta

| Onde | Precisa aparecer |
|---|---|
| `npm test` | `Tests: 34 passed, 34 total` |
| `npm run agenda mar` | as 3 linhas e, depois, `H: Helena Martins` e `M: Marcos Teixeira, Mariana Souza` |
| a página (`npx serve .`) | 13 de 14, sem aviso vermelho; as letras; Salvar, Editar e Remover funcionam, e o Desfazer volta a agenda de antes |

Depois, `git add .`, o commit `Projeto 2: etapa 3, adicionar, editar, remover e agrupar` e o `git push`.

Em casa, se faltar: a Sua vez e o push. O E16 começa daqui.

---

## Resumo

:::summary
- Lista e ficha moram num lugar só; a caixa guarda o endereço, a referência. `const b = a` não copia: os dois levam à mesma casa
- Mudar a lista recebida muda a lista de quem chamou, e o Desfazer da página deixa de funcionar
- O spread tira uma cópia: `[...lista, novo]` numa lista, `{ ...ficha, campo: valor }` numa ficha; o que vem depois ganha
- Adicionar com `[...]`, remover com `filter` e editar com `map` e spread: sempre uma lista nova
- `toEqual` compara o conteúdo; `toBe` com ficha pergunta se é a mesma
- O `reduce` pode acumular numa ficha: começa em `{}` e ganha um campo por grupo
:::

---

## :icon[arrow-right] Próximos passos

No E16, a última etapa da agenda, e a entrega:

- :icon[store] o `export default`, o item de destaque da vitrine, no `validarContato`
- :icon[list-checks] a validação devolve a lista dos problemas do formulário
- :icon[globe] a página com 14 de 14 e o README com o print
- :icon[send] o Projeto 2 entregue até o início do E17
