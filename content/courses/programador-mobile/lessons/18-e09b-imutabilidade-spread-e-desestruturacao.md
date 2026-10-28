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

## O carrinho de antes mudou sozinho

Um colega achou o `adicionarItem` do E07 comprido e o encurtou (só para produto novo):

```javascript
function adicionarItem(itens, produto) {
  itens.push(criarItem(produto, 1));
  return itens;
}
```

Um script guarda o carrinho de antes para mostrar quanto a compra aumentou:

```javascript
const antes = [{ id: 1, nome: 'Fone Bluetooth', preco: 199.9, qtd: 1 }];
const depois = adicionarItem(antes, garrafa);
console.log(subtotal(antes), subtotal(depois)); // 279.8 279.8
```

:::question
A garrafa entrou em `depois`. Por que `antes` também mudou, se ninguém escreveu nada nele?
:::

---

## :icon[equal] Duas variáveis, a mesma lista

Uma variável de array ou objeto guarda uma **referência**: o endereço de onde os dados estão. O `return itens` devolve o mesmo endereço que chegou, e `antes` e `depois` viram dois nomes para a mesma lista.

```javascript
const antes = itens;
itens.push(novo);
antes === itens;   // true: mesma caixa, conteúdo trocado

const depois = [...itens, novo];
antes === depois;  // false: caixa nova
```

`push` muda o conteúdo da caixa, e todo mundo que guardou o endereço vê a mudança. O teste "não altera o carrinho recebido" do E07 pega exatamente isso. Devolver uma caixa nova e deixar a antiga em paz é **imutabilidade**. No E11, você vê valor e referência a fundo; no E23, vai ver que o React depende disso para redesenhar a tela.

---

## :icon[copy] Spread em arrays

Os três pontos `...` **espalham** os itens de um array dentro de outro. No E08, você viu `[...produtos]` como prévia: é a mesma cópia que `produtos.slice()`.

```javascript
const comNovo = [...itens, novo];            // adiciona no fim
const historico = [termo, ...buscas];        // adiciona no começo
const tudo = [...destaques, ...promocoes];   // junta duas listas
const baratos = [...produtos].sort((a, b) => a.preco - b.preco); // copia e ordena
```

- O resultado é sempre um array **novo**: quem guardou o antigo não é afetado
- Os itens de dentro são os mesmos objetos: só a "caixa" é nova

---

## :icon[braces] Spread em objetos

Em objetos, o spread copia as propriedades. **O que vem depois vence**:

```javascript
const item = { id: 1, nome: 'Fone Bluetooth', qtd: 2 };

const maisUm = { ...item, qtd: item.qtd + 1 }; // qtd: 3
const errado = { qtd: 1, ...item };             // qtd: 2, o item sobrescreveu
```

Assim você troca um campo e mantém os outros. Os filtros do catálogo (E08) mudam só a ordem:

```javascript
const filtros = { categoria: 'audio', ordem: 'nome' };
const novosFiltros = { ...filtros, ordem: 'preco' };
// { categoria: 'audio', ordem: 'preco' }: a categoria continua
```

Sem o spread, `{ ordem: 'preco' }` perderia a categoria escolhida.

---

## :icon[arrow-left-right] Atualizar sem mutar

Nas regras, use a coluna da direita:

| Quero | Muta (evite nas regras) | Cria novo (use) |
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

- Repetido: a quantidade sobe 1, pela `alterarQuantidade`, que também não muta
- Novo: um array novo com tudo o que já havia e mais um item
- O `criarItem` do E07 continua montando o item com `{ id, nome, preco, qtd }`. `{ ...produto, qtd: 1 }` copiaria também `categoria`, `imagem` e `descricao`, que o carrinho não guarda

---

## :icon[layers] Cópia rasa

O spread copia **um nível**. Um objeto dentro do objeto continua sendo o mesmo nos dois:

```javascript
const pedido = { id: 104, status: 'pago', entrega: { cep: '01310-100', numero: '200' } };

const copia = { ...pedido };
copia.status = 'enviado';    // só a cópia muda
copia.entrega.numero = '210';
pedido.entrega.numero;       // '210': a entrega é a mesma nos dois
```

No E15, o pedido vira uma classe; por enquanto, é um objeto literal como os do E08.

---

## :icon[layers] Uma entrega para dois pedidos

:::center
![Diagrama: pedido e copia são objetos diferentes, com status 'pago' e 'enviado', mas o campo entrega dos dois aponta para a mesma entrega, cujo numero virou '210' para ambos](images/e09-copia-rasa.svg)
:::

Cada objeto tem o seu `status`, mas o campo `entrega` guarda o mesmo endereço nos dois. Para mudar algo aninhado, copie **cada nível** que você vai alterar:

```javascript
const corrigido = { ...pedido, entrega: { ...pedido.entrega, numero: '210' } };
```

No E11, você compara as outras formas de copiar, inclusive a cópia profunda.

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

- O `map` devolve um array novo, do mesmo tamanho
- O item do `id` vira um objeto **novo**, com a `qtd` trocada; os outros passam como estão
- `{ ...item, qtd }` faz o que o `criarItem(item, qtd)` do E07 fazia: o item já tem o formato do carrinho, e o spread copia `id`, `nome` e `preco`
- `qtd` sozinho é o mesmo que `qtd: qtd`, o atalho do E08 para chave e variável de mesmo nome

---

## :icon[variable] Desestruturação de objetos

Tire propriedades de um objeto direto para constantes, pelo **nome**:

```javascript
const { nome, preco } = produto;          // duas constantes
const { nome: titulo } = produto;         // renomeia
const { qtd = 1 } = item;                 // padrão, se vier undefined
const { entrega: { cep } } = pedido;      // nível de dentro
```

Nos parâmetros, a função escolhe os campos que vai usar. O `aplicarFiltros` do E08 lia `filtros.categoria` e `filtros.ordem`; desestruturado, fica assim:

```javascript
export function aplicarFiltros(lista, { categoria, ordem = 'nome' } = {}) {
  // categoria e ordem já são constantes aqui dentro
}

aplicarFiltros(produtos, { categoria: 'audio' }); // ordem vale 'nome'
aplicarFiltros(produtos);                         // o = {} evita o erro
```

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

É o `[categoria, total]` do `for...of` do E08, agora com nome. No E23, o `useState` do React devolve um par assim, e por isso você escolhe os dois nomes.

---

## :icon[package] Rest: o que sobra

Os mesmos `...`, do lado **esquerdo** do `=`, **juntam** o que sobrou. Nos parâmetros, você já viu o rest no E07:

```javascript
const { id, ...semId } = produto;                  // tudo menos o id
const [maisRecente, ...anteriores] = historico;    // o 1º e os outros

function somarCentavos(...valores) {               // quantos vierem
  return valores.reduce((soma, v) => soma + v, 0);
}
somarCentavos(19990, 8990, 7990); // 36970
```

Regra: **spread espalha** (à direita do `=`, nas chamadas); **rest junta** (à esquerda do `=`, nos parâmetros).

---

## :icon[combine] flatMap: listas dentro de listas

Cada pedido tem o seu array de `itens`. Para "Comprar de novo", você quer todos os itens de todos os pedidos numa lista só:

```javascript
pedidos.map((p) => p.itens);
// [[Fone, Garrafa], [Tênis]]: um array de arrays

pedidos.flatMap((p) => p.itens);
// [Fone, Garrafa, Tênis]: um array só
```

`flatMap` faz um `map` e **achata** um nível. Se a função devolver `[]`, o item some do resultado: dá para transformar e descartar na mesma passada, como um pedido cancelado que não entra no "Comprar de novo".

---

## :icon[repeat] Do laço ao reduce sem quebrar nada

Refatorar é mudar **como** a função faz sem mudar **o que** ela faz. Os testes do E07 provam o "o quê".

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

## :icon[triangle-alert] Erros comuns

:::warning
- `push`, `splice`, `sort` ou `item.qtd = 3` no array que chegou pelo parâmetro: quem guardou a lista antiga vê a mudança
- Achar que `[...itens]` copia os objetos de dentro: só a lista é nova
- Spread na ordem errada: `{ qtd: 1, ...item }` mantém a `qtd` antiga
- `{ ...produto, qtd: 1 }` no carrinho: o item ganha campos que o carrinho não guarda; use o `criarItem`
- Desestruturar algo que pode ser `undefined`: `const { nome } = undefined` lança `TypeError`
- Usar `map` quando cada item devolve uma lista e depois estranhar o array de arrays: use `flatMap`
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
