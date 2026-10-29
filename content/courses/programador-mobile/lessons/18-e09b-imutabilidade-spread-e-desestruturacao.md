---
title: Imutabilidade, spread e desestruturação
summary: Crie arrays e objetos novos com spread, leia dados com desestruturação e escreva regras que não mudam o que recebem.
module: linguagem-js
duration_minutes: 40
objectives:
  - Explicar por que uma regra não deve alterar o array ou objeto que recebe
  - Criar listas e objetos novos com spread, map e filter, sem mutar
  - Reconhecer a cópia rasa e copiar objetos aninhados nível por nível
  - Usar desestruturação, rest e flatMap nas regras da Lojinha
---

# Imutabilidade, spread e desestruturação

Programador Mobile · Encontro E09 · Aula 18 de 89

---

## O que você vai aprender

:::goal
- Entender por que outras partes do código precisam que a lista antiga continue igual
- Adicionar, remover e alterar itens do carrinho com spread, `map` e `filter`
- Reconhecer a cópia rasa e copiar objetos aninhados nível por nível
- Ler dados com desestruturação, juntar o resto com rest e achatar listas com `flatMap`
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **referência** | o endereço onde um array ou objeto mora; a variável guarda esse endereço |
| **mutar** | alterar um array ou objeto que já existe, em vez de criar outro |
| **imutabilidade** | o hábito de não mutar o que chegou: devolver um novo |
| **spread** (`...`) | espalha os itens de um array, ou os campos de um objeto, dentro de um novo |
| **cópia rasa** | a cópia que copia só o primeiro nível; o que está dentro continua sendo o mesmo |
| **desestruturação** | tirar valores de um objeto ou array direto para constantes |

---

## O carrinho de antes mudou sozinho

Um colega achou o `adicionarItem` do E07 comprido e o encurtou (só para produto novo):

```javascript
function adicionarItem(itens, produto) {
  itens.push(criarItem(produto, 1));
  return itens;
}
```

Um script guarda o carrinho de antes para mostrar quanto a compra aumentou. A `garrafa` é a Garrafa Térmica, de R$ 79,90, e `subtotal` é a regra do E07:

```javascript
const antes = [{ id: 1, nome: 'Fone Bluetooth', preco: 199.9, qtd: 1 }];
const depois = adicionarItem(antes, garrafa);
console.log(subtotal(antes), subtotal(depois)); // 279.8 279.8
```

:::question
A garrafa entrou em `depois`. Por que `antes` também mudou, se ninguém escreveu nada nele?
:::

---

## Referência

Dois amigos têm o endereço da sua casa. Um pinta a porta. O que o outro vê?

---

## :icon[equal] Duas variáveis, a mesma lista

Um array mora num lugar só, como uma casa. A variável não guarda a casa: guarda o endereço dela, a **referência**. Dois papéis com o mesmo endereço levam à mesma casa.

```javascript
const antes = itens;
itens.push(novo);
antes === itens;   // true: mesma caixa, conteúdo trocado

const depois = [...itens, novo];
antes === depois;  // false: caixa nova
```

- `const antes = itens` não copia a lista: copia o endereço
- `push` muda o que está dentro da casa, e todo mundo que guardou o endereço vê a mudança
- O `return itens` do colega devolveu o mesmo endereço que chegou: `antes` e `depois` viraram dois papéis para a mesma lista

---

## :icon[equal] Referência na prática

```javascript
// 1. Dois nomes, uma lista: o que entra por um aparece no outro
const buscas = ['fone'];
const mesma = buscas;
mesma.push('garrafa');
console.log(buscas);  // [ 'fone', 'garrafa' ]

// 2. A função recebe o endereço, e não uma cópia
function adicionarBola(lista) {
  lista.push('bola');
}
adicionarBola(buscas);
console.log(buscas);  // [ 'fone', 'garrafa', 'bola' ]
```

```javascript
// 3. O === compara endereços, não o conteúdo
console.log([1, 2] === [1, 2]);  // false: duas casas iguais, endereços diferentes
console.log(buscas === mesma);   // true: o mesmo endereço
```

No segundo caso, quem chamou `adicionarBola` não pediu mudança nenhuma, e a lista mudou. É o erro do colega.

---

## :icon[shield-check] Imutabilidade

Devolver uma lista nova e deixar a antiga em paz é **imutabilidade**: não mutar, isto é, não alterar o que chegou. É tirar uma cópia e mexer na cópia, sem rasurar o original.

O teste "não altera o carrinho recebido" do E07 pega exatamente o erro do colega: ele confere se a lista que entrou na regra continua igual depois.

No E11, você vê valor e referência a fundo. No E23, vai ver que o React depende disso para redesenhar a tela: ele só percebe a mudança quando recebe um endereço novo.

---

## Spread

Como fazer uma lista nova sem estragar a que está na geladeira?

---

## :icon[copy] Spread em arrays

Os três pontos `...` são o **spread** (em inglês, "espalhar"): eles espalham os itens de um array dentro de outro, novo. No E08, você viu `[...produtos]` como prévia: é a mesma cópia que `produtos.slice()`.

```javascript
const comNovo = [...itens, novo];            // adiciona no fim
const historico = [termo, ...buscas];        // adiciona no começo
const tudo = [...destaques, ...promocoes];   // junta duas listas
const baratos = [...produtos].sort((a, b) => a.preco - b.preco); // copia e ordena
```

- `[...itens, novo]` diz: "um array novo com todos os itens de `itens` e, no fim, `novo`"
- O resultado é sempre um array **novo**: quem guardou o antigo não é afetado
- Os itens de dentro são os mesmos objetos: só a lista é nova

---

## :icon[braces] Spread em objetos

Em objetos, o spread copia os campos para uma ficha nova. **O que vem depois vence**:

```javascript
const item = { id: 1, nome: 'Fone Bluetooth', qtd: 2 };

const maisUm = { ...item, qtd: item.qtd + 1 }; // qtd: 3
const errado = { qtd: 1, ...item };             // qtd: 2, o item sobrescreveu
```

`{ ...item, qtd: item.qtd + 1 }` diz: "copie todos os campos do item e, depois, escreva a `qtd` de novo". Assim você troca um campo e mantém os outros. Os filtros do catálogo (E08) mudam só a ordem:

```javascript
const filtros = { categoria: 'audio', ordem: 'nome' };
const novosFiltros = { ...filtros, ordem: 'preco' };
// { categoria: 'audio', ordem: 'preco' }: a categoria continua
```

Sem o spread, `{ ordem: 'preco' }` perderia a categoria escolhida.

---

## :icon[copy] Spread na prática

```javascript
// 1. A busca nova entra no começo, sem mexer no histórico
const buscas = ['garrafa', 'fone'];
const novas = ['bola', ...buscas];
console.log(novas, buscas);  // [ 'bola', 'garrafa', 'fone' ] [ 'garrafa', 'fone' ]

// 2. O cliente troca a ordem e mantém a categoria
const filtros = { categoria: 'audio', ordem: 'nome' };
console.log({ ...filtros, ordem: 'preco' });  // { categoria: 'audio', ordem: 'preco' }
console.log(filtros.ordem);                   // nome: o original ficou

// 3. Mais uma unidade num item, numa ficha nova
const item = { id: 1, nome: 'Fone Bluetooth', preco: 199.9, qtd: 2 };
const maisUm = { ...item, qtd: item.qtd + 1 };
console.log(maisUm.qtd, item.qtd);  // 3 2
```

Nos três casos, o original continua como estava: o spread sempre monta um novo.

---

## Atualizar sem mutar

Como trocar um item da lista da casa sem rasurar a original?

---

## :icon[arrow-left-right] Atualizar sem mutar

Nas regras, mexa numa cópia, nunca no original. Use a coluna da direita:

| Quero | Muta (evite) | Cria novo (use) |
|---|---|---|
| Adicionar | `itens.push(x)` | `[...itens, x]` |
| Remover | `itens.splice(indice, 1)` | `itens.filter((i) => i.id !== id)` |
| Alterar um item | `item.qtd = 3` | `map` com `{ ...item, qtd: 3 }` no item certo |
| Ordenar | `itens.sort(fn)` | `[...itens].sort(fn)` |
| Trocar um campo | `filtros.ordem = 'preco'` | `{ ...filtros, ordem: 'preco' }` |

As regras do E07 já não mutavam, mas montavam uma lista `novos` com `push`; com a coluna da direita, encolhem. Mudar o que **a própria regra criou** é seguro, como o `{}` do `reduce`; mudar o parâmetro, não.

---

## :icon[shopping-cart] adicionarItem e removerItem sem mutar

```javascript
export function adicionarItem(itens, produto) {
  const existente = itens.find((item) => item.id === produto.id);
  if (existente !== undefined) {
    return alterarQuantidade(itens, produto.id, existente.qtd + 1);
  }
  return [...itens, criarItem(produto, 1)];
}

export function removerItem(itens, id) {
  return itens.filter((item) => item.id !== id);
}
```

- `existente !== undefined`: o `find` achou o produto no carrinho. Repetido, a quantidade sobe 1, pela `alterarQuantidade`, que também não muta
- Novo: um array novo com tudo o que já havia e mais um item
- O `criarItem` do E07 continua montando o item com `{ id, nome, preco, qtd }`. `{ ...produto, qtd: 1 }` copiaria também `categoria`, `imagem` e `descricao`, que o carrinho não guarda

---

## :icon[shopping-cart] Atualizar sem mutar na prática

O script do começo da aula, agora com as regras novas. A `garrafa` é a Garrafa Térmica do catálogo:

```javascript
const antes = [{ id: 1, nome: 'Fone Bluetooth', preco: 199.9, qtd: 1 }];
const depois = adicionarItem(antes, garrafa);

console.log(subtotal(antes), subtotal(depois));  // 199.9 279.8
console.log(antes.length, depois.length);        // 1 2: o antes ficou como estava

const outra = adicionarItem(depois, garrafa);    // a garrafa de novo
console.log(outra[1].qtd, depois[1].qtd);        // 2 1: a quantidade subiu só no novo

console.log(removerItem(depois, 1));
// [ { id: 5, nome: 'Garrafa Térmica', preco: 79.9, qtd: 1 } ]
```

Agora o script mostra a diferença que queria: a compra aumentou R$ 79,90.

---

## Cópia rasa

Você tira cópia de uma ficha com o endereço de entrega. As duas levam à mesma casa?

---

## :icon[layers] Cópia rasa

O spread copia **um nível**. Pense numa ficha de pedido com o endereço de entrega anotado: você tira uma cópia da ficha, mas o endereço anotado nas duas leva à mesma casa. Um objeto dentro do objeto continua sendo o mesmo nos dois:

```javascript
const pedido = { id: 104, status: 'pago', entrega: { cep: '01310-100', numero: '200' } };

const copia = { ...pedido };
copia.status = 'enviado';    // só a cópia muda
copia.entrega.numero = '210';
pedido.entrega.numero;       // '210': a entrega é a mesma nos dois
```

Isso é a **cópia rasa**: só a ficha de fora é nova. No E15, o pedido vira uma classe; por enquanto, é um objeto literal como os do E08.

---

## :icon[layers] Uma entrega para dois pedidos

:::center
![Diagrama: pedido e copia são objetos diferentes, com status 'pago' e 'enviado', mas o campo entrega dos dois aponta para a mesma entrega, cujo numero virou '210' para ambos](images/e09-copia-rasa.svg)
:::

Cada objeto tem o seu `status`, mas o campo `entrega` guarda o mesmo endereço nos dois. Para mudar algo aninhado, copie **cada nível** que você vai alterar:

```javascript
const corrigido = { ...pedido, entrega: { ...pedido.entrega, numero: '210' } };
```

Em português: "um pedido novo, com todos os campos do antigo, e uma entrega nova, com os campos da entrega antiga e o número trocado". No E11, você compara as outras formas de copiar, inclusive a cópia profunda.

---

## Pense

:::question
Esta versão de `alterarQuantidade` devolve um array novo. Mesmo assim, o teste "não altera o carrinho recebido" do E07 falha: `itens[0].qtd` virou 3. Por quê?

```javascript
function alterarQuantidade(itens, id, qtd) {
  const copia = [...itens];
  const item = copia.find((i) => i.id === id);
  item.qtd = qtd;
  return copia;
}
```
:::

:::tip Resposta
`[...itens]` é uma cópia rasa: o array é novo, mas os objetos de dentro são os mesmos. `item` aponta para o objeto que também está em `itens`, e `item.qtd = qtd` altera os dois. A versão certa cria um objeto novo só para o item alterado, com `map` e spread.
:::

---

## :icon[pencil] alterarQuantidade: um objeto novo no item certo

```javascript
export function alterarQuantidade(itens, id, qtd) {
  if (qtd <= 0) {
    return removerItem(itens, id);
  }
  return itens.map((item) => {
    if (item.id === id) {
      return { ...item, qtd };
    }
    return item;
  });
}
```

- Quantidade 0 ou menos remove o item, como no E07
- O `map` devolve um array novo, do mesmo tamanho
- O item do `id` vira um objeto **novo**, com a `qtd` trocada; os outros passam como estão
- `{ ...item, qtd }` faz o que o `criarItem(item, qtd)` do E07 fazia: o item já tem o formato do carrinho, e o spread copia `id`, `nome` e `preco`
- `qtd` sozinho é o mesmo que `qtd: qtd`, o atalho do E08 para chave e variável de mesmo nome

---

## Desestruturação

Ao chegar do mercado, como você acha na sacola o que vai para a geladeira?

---

## :icon[variable] Desestruturação de objetos

**Desestruturar** é desempacotar: como tirar as compras da sacola e pôr cada item no seu lugar, com etiqueta. Você tira campos de um objeto direto para constantes, pelo **nome**:

```javascript
const { nome, preco } = produto;          // duas constantes
const { nome: titulo } = produto;         // renomeia
const { qtd = 1 } = item;                 // padrão, se vier undefined
const { entrega: { cep } } = pedido;      // nível de dentro
```

| Linha | O que ela diz |
|---|---|
| `const { nome, preco } = produto` | "tire `nome` e `preco` do produto, cada um para uma constante com o mesmo nome" |
| `{ nome: titulo }` | "tire o `nome`, mas guarde numa constante chamada `titulo`" |
| `{ qtd = 1 }` | "tire a `qtd`; se ela não vier, use 1" |
| `{ entrega: { cep } }` | "entre na `entrega` e tire o `cep`" |

---

## :icon[sliders-horizontal] Desestruturação nos parâmetros

Nos parâmetros, a função escolhe os campos que vai usar. O `aplicarFiltros` do E08 lia `filtros.categoria` e `filtros.ordem`; desestruturado, fica assim:

```javascript
export function aplicarFiltros(lista, { categoria, ordem = 'nome' } = {}) {
  // categoria e ordem já são constantes aqui dentro
}

aplicarFiltros(produtos, { categoria: 'audio' }); // ordem vale 'nome'
aplicarFiltros(produtos);                         // o = {} evita o erro
```

- `{ categoria, ordem = 'nome' }`: "do segundo argumento, tire `categoria` e `ordem`; sem ordem, use `'nome'`"
- `= {}` no fim: "se não vier segundo argumento, desempacote um objeto vazio"

Sem o `= {}`, chamar sem filtros tentaria desestruturar `undefined`. No E22, as props dos componentes React chegam assim.

---

## :icon[list-ordered] Desestruturação de arrays

Em arrays, vale a **posição**, não o nome:

```javascript
const [primeiro, , terceiro] = produtos;   // a vírgula pula uma
const [ano, mes] = '2026-10'.split('-');   // '2026' e '10', texto
```

Junto com `Object.entries`, que devolve pares `[chave, valor]`:

```javascript
Object.entries(grupos).map(([slug, lista]) => `${slug}: ${lista.length}`);
// ['audio: 3', 'casa: 3', ...]
```

O `([slug, lista]) => ...` recebe um par e já dá nome às duas posições: a 0 vira `slug`, a 1 vira `lista`. É o `[categoria, total]` do `for...of` do E08, agora com nome. No E23, o `useState` do React devolve um par assim, e por isso você escolhe os dois nomes.

---

## :icon[package] Rest: o que sobra

O **rest** usa os mesmos `...`, do lado **esquerdo** do `=`. Em vez de espalhar, ele **junta** o que sobrou: você tira da sacola o que quer, e o resto continua junto, numa sacola só. Nos parâmetros, você já viu o rest no E07:

```javascript
const { id, ...semId } = produto;                  // tudo menos o id
const [maisRecente, ...anteriores] = historico;    // o 1º e os outros
```

```javascript
function somarCentavos(...valores) {               // quantos vierem
  return valores.reduce((soma, v) => soma + v, 0);
}
somarCentavos(19990, 8990, 7990); // 36970
```

Regra: **spread espalha** (à direita do `=`, nas chamadas); **rest junta** (à esquerda do `=`, nos parâmetros).

---

## :icon[variable] Desestruturação na prática

```javascript
// 1. Dois campos de um produto do catálogo
const { nome, preco } = produtos[4];
console.log(nome, preco);  // Garrafa Térmica 79.9

// 2. A linha do carrinho, com os campos já no parâmetro
const linha = ({ nome, qtd }) => `${qtd}x ${nome}`;
console.log(linha({ id: 1, nome: 'Fone Bluetooth', preco: 199.9, qtd: 2 }));  // 2x Fone Bluetooth

// 3. Ano e mês de uma data escrita como texto
const [ano, mes] = '2026-10-29'.split('-');
console.log(ano, Number(mes));  // 2026 10
```

```javascript
// 4. A busca mais recente e o resto, com o rest
const [maisRecente, ...anteriores] = ['bola', 'garrafa', 'fone'];
console.log(maisRecente, anteriores);  // bola [ 'garrafa', 'fone' ]
```

No caso 3, o `split` devolve textos: o `Number` transforma o mês em número antes de comparar. O aniversário do Projeto 2 é lido assim.

---

## flatMap

Três caixas de ovos: como deixar todos os ovos numa fileira só?

---

## :icon[combine] flatMap: listas dentro de listas

Cada pedido tem o seu array de `itens`. Para "Comprar de novo", você quer todos os itens de todos os pedidos numa lista só. Pense em cada pedido como uma caixa: o `map` devolve as caixas; o **`flatMap`** abre cada caixa e enfileira os itens.

```javascript
pedidos.map((p) => p.itens);
// [[Fone, Garrafa], [Tênis]]: um array de arrays

pedidos.flatMap((p) => p.itens);
// [Fone, Garrafa, Tênis]: um array só
```

`flatMap` faz um `map` e **achata** um nível. Se a função devolver `[]`, uma caixa vazia, o item some do resultado: dá para transformar e descartar na mesma passada, como um pedido cancelado que não entra no "Comprar de novo".

---

## :icon[combine] flatMap na prática

```javascript
const pedidos = [
  { id: 101, status: 'entregue', itens: [{ nome: 'Fone Bluetooth' }, { nome: 'Garrafa Térmica' }] },
  { id: 102, status: 'cancelado', itens: [{ nome: 'Jogo de Panelas' }] },
  { id: 103, status: 'entregue', itens: [{ nome: 'Tênis de Corrida' }] },
];

// 1. Quantos itens o cliente já comprou, somando todos os pedidos?
console.log(pedidos.flatMap((p) => p.itens).length);  // 4
```

```javascript
// 2. "Comprar de novo": os nomes, sem os pedidos cancelados
const nomesParaRepetir = (p) => {
  if (p.status === 'cancelado') return [];
  return p.itens.map((i) => i.nome);
};

console.log(pedidos.flatMap(nomesParaRepetir));
// [ 'Fone Bluetooth', 'Garrafa Térmica', 'Tênis de Corrida' ]
console.log(pedidos.map(nomesParaRepetir));
// [ [ 'Fone Bluetooth', 'Garrafa Térmica' ], [], [ 'Tênis de Corrida' ] ]
```

Com `map`, a caixa vazia do pedido cancelado continua lá; com `flatMap`, ela some na hora de enfileirar.

---

## Refatorar

Um restaurante reforma a cozinha. O que o cliente não pode perceber?

---

## :icon[repeat] Do laço ao reduce sem quebrar nada

**Refatorar** é mudar **como** a função faz sem mudar **o que** ela faz. É reformar a cozinha sem mudar o cardápio: os pratos têm de sair iguais. Os testes do E07 provam o "o quê".

::::columns
:::col
```javascript
// E07: laço
export function subtotal(itens) {
  let centavos = 0;
  for (const item of itens) {
    centavos += paraCentavos(item.preco) * item.qtd;
  }
  return paraReais(centavos);
}
```
:::
:::col
```javascript
// E09: reduce
export function subtotal(itens) {
  const centavos = itens.reduce(
    (soma, item) => soma + paraCentavos(item.preco) * item.qtd,
    0,
  );
  return paraReais(centavos);
}
```
:::
::::

:::steps
1. `npm test` antes de mexer: tudo verde
2. Reescreva **uma** função e rode `npm test` de novo
3. Vermelho? O erro está na reescrita, não no teste: não mude o teste
:::

---

## :icon[repeat] Refatorar na prática

O `removerItem` do E07 e o do E09 fazem a mesma coisa:

```javascript
// E07: laço com a lista novos
export function removerItem(itens, id) {
  const novos = [];
  for (const item of itens) {
    if (item.id !== id) {
      novos.push(item);
    }
  }
  return novos;
}
```

```javascript
// E09: a mesma promessa, numa linha
export function removerItem(itens, id) {
  return itens.filter((item) => item.id !== id);
}
```

```plaintext
$ npm test -- carrinho
Tests:       10 passed, 10 total
```

Os 10 testes do carrinho do E07, sem mudar uma linha, provam que a versão nova cumpre a mesma promessa. Se um ficar vermelho, a reescrita mudou o que a função faz.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Cannot destructure property 'categoria' of 'undefined'` | a função desempacotou um argumento que não veio | dar um padrão ao parâmetro: `{ categoria } = {}` |
| teste "não altera o carrinho recebido" vermelho | a regra mutou o que chegou: `push`, `splice`, `sort` ou `item.qtd = ...` | criar um novo, com spread, `filter` ou `map` |
| `Received: NaN` no teste do `subtotal` | `reduce` sem o valor inicial | `0` como último argumento |
| um array de arrays, `[[...], [...]]` | `map` onde cada item devolve uma lista | trocar por `flatMap` |

---

## :icon[triangle-alert] Erros comuns

:::warning
- Achar que `[...itens]` copia os objetos de dentro: só a lista é nova
- Spread na ordem errada: `{ qtd: 1, ...item }` mantém a `qtd` antiga
- `{ ...produto, qtd: 1 }` no carrinho: o item ganha campos que o carrinho não guarda; use o `criarItem`
- Desestruturar algo que pode ser `undefined`: `const { nome } = undefined` lança `TypeError`
- Mudar o teste para ele passar: o teste deixa de provar o que a função fazia
:::

---

## Resumo

:::summary
- Array e objeto são guardados por referência: mudar o que chegou pelo parâmetro muda para todos que guardaram a lista
- Spread (`...`) cria arrays e objetos novos; em objetos, o que vem depois vence
- No carrinho, `[...itens, novo]` adiciona, `filter` remove e `map` com spread altera, sem mutar
- A cópia é rasa: copie cada nível aninhado que você vai alterar
- Desestruturação lê por nome em objetos e por posição em arrays; o rest junta o que sobra
:::

---

## :icon[flask-conical] No laboratório

O carrinho e o catálogo com métodos de array, sem mudar um teste antigo.

:::steps
1. `npm run verificar` verde antes de mexer
2. `carrinho.js`: `subtotal` com `reduce` e `contarItens(itens)` nova
3. `adicionarItem`, `removerItem` e `alterarQuantidade` com `find`, spread, `filter` e `map`
4. `catalogo.js`: `aplicarFiltros` com `filter`, `[...base]` e filtros desestruturados
5. `agruparPorCategoria(produtos)` no mesmo arquivo
6. Testes novos; `simular-carrinho.js` com `map` e `contarItens`; `categorias.js` novo
7. `npm run verificar`, commit "E09: regras com métodos de array" e `git push`
:::

**Critérios**: nenhum `for` nem `push` em `carrinho.js`; testes do E07 e do E08 intactos e verdes; 5 testes novos ou mais; quatro categorias com 3 produtos no terminal. Entregue o link do repositório.

---

## :icon[milestone] Projeto 2 · Etapa 2: grupos, aniversários e cadastro

No `agenda-de-contatos`, em `src/regras/agenda.js`, sem mexer na lista recebida:

- `agruparPorInicial(contatos)` com `reduce`: Álvaro fica no A
- `contarPorGrupo(contatos)`: os três grupos, mesmo os que têm zero
- `aniversariantesDoMes(contatos, mes)`: do dia 1 ao 31
- `adicionarContato(contatos, dados)`, com o maior id mais 1, e `removerContato(contatos, id)`
- testes de cada uma e o script `resumo.js`

Commit: `Projeto 2: etapa 2, grupos, aniversários e cadastro`. Enunciado completo: página do curso, em **Projetos**.
