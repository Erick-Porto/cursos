---
title: Arrays essenciais
summary: Ponha, tire, procure e ordene itens nas listas do app sem bagunçar o catálogo que as outras telas usam.
module: logica-js
duration_minutes: 40
objectives:
  - Adicionar e remover itens com push, pop, shift, unshift, splice e slice
  - Procurar valores e objetos com includes, indexOf, find e findIndex
  - Ordenar números e nomes com comparadores e localeCompare
  - Distinguir os métodos que mudam o array original dos que devolvem uma cópia
---

# Arrays essenciais

Programador Mobile: Módulo Específico · Encontro E29 · Aula 39 de 71

---

## O que você vai aprender

:::goal
- Pôr e tirar itens no fim, no começo e no meio de um array
- Copiar um pedaço com `slice` sem mexer no original
- Procurar com `includes`, `indexOf`, `find` e `findIndex`
- Ordenar preços e nomes com comparador e `localeCompare`, copiando antes
:::

---

## Listas por toda parte

Abra a Lojinha e conte as listas: a vitrine, os itens do carrinho, as categorias. Hoje chegam mais duas: as **últimas buscas**, embaixo do campo de busca, e os **favoritos**. Todas são arrays, e quase tudo o que o app faz com elas é pôr, tirar, procurar e ordenar.

Um detalhe pega muita gente: alguns métodos mudam o array original. Ordene a vitrine do jeito errado e a aba Categorias aparece reordenada sem ninguém ter tocado nela.

:::question
Como ordenar a vitrine por preço sem mudar a ordem do catálogo que as outras telas usam?
:::

---

## :icon[list] Criar e acessar

```javascript
const ultimasBuscas = ['fone', 'garrafa', 'tênis'];

ultimasBuscas[0];                        // 'fone': o índice começa em 0
ultimasBuscas.length;                    // 3
ultimasBuscas[ultimasBuscas.length - 1]; // 'tênis': o último
ultimasBuscas[5];                        // undefined, sem erro
```

- Um **array** é uma lista ordenada; cada posição tem um **índice**, de 0 até `length - 1`
- Ele aceita qualquer valor: textos, números e objetos, como os 12 produtos do catálogo
- Ler uma posição que não existe devolve `undefined` em vez de dar erro: confira antes de usar
- `const` impede trocar o array inteiro, mas não impede mudar o que tem dentro

---

## :icon[arrow-right] Fim do array: push e pop

```javascript
const pilha = ['/'];          // a pilha de telas, simplificada
pilha.push('/produto/7');     // devolve 2, o novo tamanho
pilha.push('/carrinho');      // ['/', '/produto/7', '/carrinho']
pilha.pop();                  // devolve '/carrinho' e o tira da pilha
```

- `push` põe no fim e devolve o novo tamanho
- `pop` tira o último e devolve o item tirado
- É a pilha de navegação do E16: `router.push` empilha uma tela, o voltar desempilha a de cima

Os dois **mudam o array original**: depois do `pop`, `pilha` tem dois itens.

---

## :icon[arrow-left] Começo do array: unshift e shift

```javascript
const historico = ['garrafa', 'tênis'];
historico.unshift('fone');    // ['fone', 'garrafa', 'tênis']

const fila = ['pedido 101', 'pedido 102'];
const proximo = fila.shift(); // 'pedido 101'; fila fica ['pedido 102']
```

::::columns
:::col
![Diagrama: no começo do array, unshift põe e shift tira; no fim, push põe e pop tira; os quatro mudam o array original](images/e29-pontas-do-array.svg)
:::
:::col
- `unshift` põe no começo: ideal para "mais recente primeiro", como o histórico de buscas
- `shift` tira o primeiro: é a **fila**, em que quem chegou antes sai antes, como pedidos esperando a internet voltar para serem enviados
- Os dois também mudam o original
:::
::::

---

## :icon[minus] No meio: splice

```javascript
const historico = ['fone', 'garrafa', 'tênis', 'bola'];

historico.splice(1, 1);         // tira 1 item a partir do índice 1: devolve ['garrafa']
// historico: ['fone', 'tênis', 'bola']

historico.splice(1, 0, 'yoga'); // no índice 1, tira 0 e insere 'yoga'
// historico: ['fone', 'yoga', 'tênis', 'bola']
```

`splice(inicio, quantos, ...novos)` remove `quantos` itens a partir de `inicio` e, se você passar mais valores, insere-os ali. Ele devolve um array com os removidos e **muda o original**.

É o "apagar esta busca" do histórico: você descobre a posição do item e tira um a partir dela.

---

## :icon[copy] Uma fatia sem mexer: slice

```javascript
const historico = ['fone', 'yoga', 'tênis', 'bola', 'garrafa', 'panela'];

historico.slice(0, 5); // as 5 primeiras: o índice do fim não entra
historico.slice(-2);   // ['garrafa', 'panela']: negativo conta do fim
historico.slice();     // cópia do array inteiro
// historico continua com as 6 buscas
```

`slice(inicio, fim)` **copia** um pedaço e deixa o original como estava. Para não confundir: s**p**lice **p**ica o original; slice só tira uma fatia para você.

| Método | Muda o original? | Devolve |
|---|---|---|
| `splice` | sim | os itens removidos |
| `slice` | não | a cópia do pedaço |

---

## Pense

:::question
Depois destas linhas, o que há em `favoritos`, `copia` e `removidos`?

```javascript
const favoritos = [3, 7, 10];
const copia = favoritos.slice();
copia.push(12);
const removidos = favoritos.splice(0, 1);
```
:::

:::tip Resposta
- `favoritos` é `[7, 10]`: o `splice` tirou o 3 do original
- `copia` é `[3, 7, 10, 12]`: o `slice` copiou antes, e o `push` mexeu só na cópia
- `removidos` é `[3]`: o `splice` sempre devolve um array, mesmo com um item só

Depois do `slice`, cópia e original seguem caminhos separados.
:::

---

## :icon[search] Procurar um valor: includes e indexOf

```javascript
const favoritos = [3, 7, 10]; // ids dos produtos curtidos

favoritos.includes(7);   // true: o coração aparece cheio
favoritos.indexOf(7);    // 1: a posição
favoritos.indexOf(12);   // -1: não está
favoritos.includes('7'); // false: '7' é texto, 7 é número
```

- `includes` responde sim ou não: use quando só quer saber se o item está lá
- `indexOf` dá a posição, ou `-1`: use quando vai agir naquela posição, como num `splice`
- Os dois comparam com `===`. O `id` que chega pela rota é texto (E16): converta com `Number(id)` antes de procurar

---

## :icon[file-search] Procurar com condição: find e findIndex

```javascript
const itens = [
  { id: 1, nome: 'Fone Bluetooth', qtd: 1 },
  { id: 7, nome: 'Tênis de Corrida', qtd: 2 },
];

itens.find((i) => i.id === 7);      // o objeto do tênis
itens.findIndex((i) => i.id === 7); // 1
itens.find((i) => i.id === 99);     // undefined
itens.indexOf({ id: 7, nome: 'Tênis de Corrida', qtd: 2 }); // -1
```

Em vez de um valor, `find` e `findIndex` recebem uma **função de teste** e param no primeiro item que passa nela. `find` devolve o item ou `undefined`; `findIndex`, a posição ou `-1`.

`indexOf` não serve para objetos: um objeto escrito de novo é outro objeto, mesmo com os mesmos dados. Em arrays de objetos, procure pelo `id`.

---

## :icon[arrow-up-down] sort sem comparador ordena como texto

```javascript
const precos = [89.9, 119.9, 59.9];
precos.sort(); // [119.9, 59.9, 89.9]
```

Sem argumento, o `sort` transforma cada item em texto e compara caractere a caractere, como num dicionário: "1" vem antes de "5", que vem antes de "8". Por isso R$ 119,90 aparece antes de R$ 59,90.

Com nomes, o resultado também surpreende:

```javascript
['Livros', 'Áudio', 'Casa'].sort(); // ['Casa', 'Livros', 'Áudio']
['fone', 'Garrafa', 'bola'].sort(); // ['Garrafa', 'bola', 'fone']
```

Maiúsculas passam na frente das minúsculas, e letras acentuadas vão para o fim. Para números e nomes, passe sempre um **comparador**.

---

## :icon[scale] O comparador: negativo, zero ou positivo

O `sort` chama o comparador com dois itens, `a` e `b`, e olha o sinal da resposta: negativo põe `a` antes de `b`, positivo põe `b` antes de `a`, e zero é empate, que mantém os dois como estão.

:::center
![Diagrama: o sinal do comparador decide a ordem; negativo põe a antes de b, positivo põe b antes de a, zero mantém; 59.9 - 89.9 é negativo, então 59.9 vem antes](images/e29-comparador.svg)
:::

```javascript
const precos = [89.9, 119.9, 59.9];
precos.sort((a, b) => a - b); // [59.9, 89.9, 119.9]
precos.sort((a, b) => b - a); // [119.9, 89.9, 59.9]

itens.sort((a, b) => a.preco - b.preco);         // objetos: menor preço primeiro
itens.sort((a, b) => b.avaliacao - a.avaliacao); // melhor avaliação primeiro
```

Subtrair dá exatamente esse sinal: se `a` é menor, `a - b` é negativo e `a` vai para a frente. Para decrescente, inverta: `b - a`.

---

## :icon[arrow-down-a-z] Nomes com acento: localeCompare

Texto não se subtrai. Use **`localeCompare`**, que já devolve negativo, zero ou positivo seguindo as regras do idioma:

```javascript
'Áudio'.localeCompare('Casa', 'pt-BR'); // negativo: Áudio vem antes

const nomes = ['Livros', 'Áudio', 'Casa'];
nomes.sort((a, b) => a.localeCompare(b, 'pt-BR'));
// ['Áudio', 'Casa', 'Livros']

['fone', 'Garrafa', 'bola'].sort((a, b) => a.localeCompare(b, 'pt-BR'));
// ['bola', 'fone', 'Garrafa']
```

O `'pt-BR'` escolhe as regras do português: o Á fica junto do A e a maiúscula não fura a fila. Para produtos, compare o campo: `(a, b) => a.nome.localeCompare(b.nome, 'pt-BR')`.

---

## :icon[copy] sort muda o original: copie antes

```javascript
import { produtos } from '../data/produtos';

const porPreco = produtos.sort((a, b) => a.preco - b.preco);
// porPreco e produtos são o MESMO array, agora ordenado por preço
```

O `sort` ordena **no lugar** e devolve o próprio array. Como Início, Categorias e Detalhe importam o mesmo `produtos`, todas passam a ver o catálogo reordenado. Copie e ordene a cópia:

```javascript
const porPreco = [...produtos].sort((a, b) => a.preco - b.preco);
```

`[...produtos]` cria um array novo com os mesmos itens; o `sort` mexe só nele.

| Mudam o original | Devolvem um array novo |
|---|---|
| `push`, `pop`, `shift`, `unshift`, `splice`, `sort` | `slice`, `filter`, `map`, `[...lista]` |

---

## :icon[triangle-alert] Erros comuns

:::warning
- `precos.sort()` sem comparador: números e nomes com acento saem fora de ordem
- Comparador que devolve `true` ou `false`, como `(a, b) => a.preco > b.preco`: ele nunca devolve negativo e a ordem sai errada; devolva um número
- Ordenar `produtos` direto: as outras telas veem o catálogo reordenado; use `[...produtos].sort(...)`
- Trocar `splice` por `slice`: um corta o original, o outro só copia
- `if (lista.indexOf(id))`: a posição 0 é falsy e o `-1` é truthy; use `includes` ou compare com `-1`
- Procurar `'7'` em `[3, 7]`: o `===` diferencia texto de número
:::

---

## Resumo

:::summary
- `push` e `pop` mexem no fim; `unshift` e `shift`, no começo; `splice` corta ou insere no meio
- `slice` copia um pedaço e deixa o original intacto
- `includes` e `indexOf` procuram um valor; `find` e `findIndex` procuram com uma condição, como o `id`
- O `sort` precisa de comparador: subtração para números, `localeCompare` com `'pt-BR'` para nomes
- `sort` muda o original: na Lojinha, ordene sempre `[...lista]`
:::

---

## Próximos passos

Na aula 40, o foco passa para os itens das listas: **objetos**, ponto e colchete, `Object.entries` e JSON.

No laboratório, você junta as duas aulas na Lojinha: a vitrine ordenada por comparadores guardados num objeto, as 5 últimas buscas sem repetir e o coração dos favoritos, tudo com testes.

Para fixar, abra o Node no terminal (`node`) e refaça o "Pense" e o `sort` dos preços: veja com os próprios olhos o original mudando ou não.
