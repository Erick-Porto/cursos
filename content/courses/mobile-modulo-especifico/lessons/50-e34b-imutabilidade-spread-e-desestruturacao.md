---
title: Imutabilidade, spread e desestruturação
summary: Crie arrays e objetos novos com spread, leia dados com desestruturação e faça o React ver cada mudança.
module: linguagem-js
duration_minutes: 40
objectives:
  - Explicar por que o React só redesenha quando recebe um array ou objeto novo
  - Atualizar listas e objetos do estado com spread, map e filter, sem mutar
  - Reconhecer a cópia rasa e copiar objetos aninhados nível por nível
  - Usar desestruturação, rest e flatMap no código do app
---

# Imutabilidade, spread e desestruturação

Programador Mobile: Módulo Específico · Encontro E34 · Aula 50 de 71

---

## O que você vai aprender

:::goal
- Entender por que o React precisa de arrays e objetos **novos** para redesenhar
- Adicionar, remover e alterar itens do estado com spread, `map` e `filter`
- Reconhecer a cópia rasa e copiar objetos aninhados nível por nível
- Ler dados com desestruturação, juntar o resto com rest e achatar listas com `flatMap`
:::

---

## O carrinho que não atualiza

Um colega mudou o `adicionar` do carrinho para "economizar uma linha":

```javascript
function adicionar(produto) {
  itens.push({ ...produto, qtd: 1 });
  setItens(itens);
}
```

Você toca em **Adicionar ao carrinho** e nada muda: o badge da aba continua no mesmo número. Um `console.log(itens.length)` mostra que o item entrou no array.

:::question
Se o item está no array e o `setItens` foi chamado, por que a tela não mudou?
:::

---

## :icon[equal] O React compara referências

Uma variável de array ou objeto guarda uma **referência**: o endereço de onde os dados estão. Ao receber o novo estado, o React compara o endereço antigo com o novo. Endereço igual: "nada mudou", e a tela não é redesenhada.

```javascript
const antes = itens;
itens.push(novo);
antes === itens;   // true: mesma caixa, conteúdo trocado

const depois = [...itens, novo];
antes === depois;  // false: caixa nova
```

`push` muda o conteúdo da caixa, mas a caixa é a mesma. Para a tela mudar, entregue ao `setItens` uma caixa nova. No E36, você vê valor e referência a fundo.

---

## :icon[copy] Spread em arrays

Os três pontos `...` **espalham** os itens de um array dentro de outro:

```javascript
const comNovo = [...itens, novo];            // adiciona no fim
const historico = [termo, ...buscas];        // adiciona no começo
const tudo = [...destaques, ...promocoes];   // junta duas listas
const baratos = [...produtos].sort((a, b) => a.preco - b.preco); // copia e ordena
```

- O resultado é sempre um array **novo**: referência nova, o React vê
- Os itens de dentro são os mesmos objetos: só a "caixa" é nova
- O `adicionar` certo é `setItens([...itens, { ...produto, qtd: 1 }])`

---

## :icon[braces] Spread em objetos

Em objetos, o spread copia as propriedades. **O que vem depois vence**:

```javascript
const item = { id: 1, nome: 'Fone Bluetooth', qtd: 2 };

const maisUm = { ...item, qtd: item.qtd + 1 }; // qtd: 3
const errado = { qtd: 1, ...item };             // qtd: 2, o item sobrescreveu
```

Assim você troca um campo e mantém os outros. Um atalho "Mais baratos" na Início muda só a ordem:

```javascript
setFiltros({ ...filtros, ordem: 'preco' });
// { categoria: 'audio', ordem: 'preco' }: a categoria continua
```

Sem o spread, `setFiltros({ ordem: 'preco' })` apagaria a categoria escolhida.

---

## :icon[arrow-left-right] Atualizar sem mutar

Tudo o que vai para o estado do React segue a coluna da direita:

| Quero | Muta (evite no estado) | Cria novo (use) |
|---|---|---|
| Adicionar | `itens.push(x)` | `[...itens, x]` |
| Remover | `itens.splice(indice, 1)` | `itens.filter((i) => i.id !== id)` |
| Alterar um item | `item.qtd = 3` | `itens.map((i) => (i.id === id ? { ...i, qtd: 3 } : i))` |
| Ordenar | `itens.sort(fn)` | `[...itens].sort(fn)` |
| Trocar um campo | `filtros.ordem = 'preco'` | `{ ...filtros, ordem: 'preco' }` |

As funções do E28 (`adicionarItem`, `removerItem`, `alterarQuantidade`) já seguem esta tabela: recebem um array e devolvem outro.

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

---

## :icon[layers] Uma entrega para dois pedidos

:::center
![Diagrama: pedido e copia são objetos diferentes, com status 'pago' e 'enviado', mas o campo entrega dos dois aponta para a mesma entrega, cujo numero virou '210' para ambos](images/e34-copia-rasa.svg)
:::

Cada objeto tem o seu `status`, mas o campo `entrega` guarda o mesmo endereço nos dois. Para mudar algo aninhado, copie **cada nível** que você vai alterar:

```javascript
const corrigido = { ...pedido, entrega: { ...pedido.entrega, numero: '210' } };
```

`structuredClone` faz cópia profunda no navegador e no Node; confira antes de usar no app.

---

## Pense

:::question
Esta versão de `alterarQuantidade` faz a tela atualizar, porque devolve um array novo. Mesmo assim, o teste "não altera o carrinho original" falha: `itens[0].qtd` virou 3. Por quê?

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
`[...itens]` é uma cópia rasa: o array é novo, mas os objetos de dentro são os mesmos. `item` aponta para o objeto que também está em `itens`, e `item.qtd = qtd` altera os dois. A versão certa cria um objeto novo só para o item alterado: `itens.map((i) => (i.id === id ? { ...i, qtd } : i))`.
:::

---

## :icon[variable] Desestruturação de objetos

Tire propriedades de um objeto direto para constantes, pelo **nome**:

```javascript
const { nome, preco } = produto;          // duas constantes
const { nome: titulo } = produto;         // renomeia
const { qtd = 1 } = item;                 // padrão, se vier undefined
const { entrega: { cep } } = pedido;      // nível de dentro
```

Você já usa desestruturação desde o começo do curso:

```jsx
const { cores } = useTema();
const { itens, total } = useCarrinho();
export default function CartaoProduto({ produto, onPress }) { /* ... */ }
renderItem={({ item }) => <CartaoProduto produto={item} />}
```

Nas props, as chaves desestruturam o objeto `props` que o React passa ao componente.

---

## :icon[list-ordered] Desestruturação de arrays

Em arrays, vale a **posição**, não o nome:

```javascript
const [itens, setItens] = useState([]);    // 1ª e 2ª posições
const [primeiro, , terceiro] = produtos;   // a vírgula pula uma
const [ano, mes] = '2026-10'.split('-');   // '2026' e '10', texto
```

Junto com `Object.entries`, que devolve pares `[chave, valor]`:

```javascript
Object.entries(grupos).map(([slug, lista]) => `${slug}: ${lista.length}`);
// ['audio: 3', 'casa: 3', ...]
```

Por isso o `useState` deixa você escolher os nomes: são posições, e `[carregando, setCarregando]` funciona igual.

---

## :icon[package] Rest: o que sobra

Os mesmos `...`, do lado **esquerdo** ou nos parâmetros, **juntam** o que sobrou:

```javascript
const { id, ...semId } = produto;                  // tudo menos o id
const [maisRecente, ...anteriores] = historico;    // o 1º e os outros

function somarCentavos(...valores) {               // quantos vierem
  return valores.reduce((soma, v) => soma + v, 0);
}
somarCentavos(19990, 8990, 7990); // 36970
```

Num componente, o rest repassa as props que você não usa:

```jsx
function Botao({ titulo, variante, ...resto }) {
  return <Pressable {...resto}>{/* titulo e variante usados aqui */}</Pressable>;
}
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

`flatMap` faz um `map` e **achata** um nível. Se a função devolver `[]`, o item some do resultado: dá para transformar e descartar na mesma passada.

```javascript
pedidos.flatMap((p) => (p.status === 'cancelado' ? [] : p.itens));
```

---

## :icon[repeat] Do laço ao reduce sem quebrar nada

Refatorar é mudar **como** a função faz sem mudar **o que** ela faz. Os testes do E27 provam o "o quê".

::::columns
:::col
```javascript
// E27
export function contarItens(itens) {
  let total = 0;
  for (const item of itens) {
    total += item.qtd;
  }
  return total;
}
```
:::
:::col
```javascript
// E34
export function contarItens(itens) {
  return itens.reduce((total, item) => total + item.qtd, 0);
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
- `push`, `splice`, `sort` ou `item.qtd = 3` no estado e depois `setItens` com o mesmo array: a tela não muda
- Achar que `[...itens]` copia os objetos de dentro: só a lista é nova
- Spread na ordem errada: `{ qtd: 1, ...item }` mantém a `qtd` antiga
- `setFiltros({ ordem })` sem `...filtros`: as outras escolhas somem
- Desestruturar algo que pode ser `undefined`: `const { nome } = undefined` derruba o app
- Usar `map` quando cada item devolve uma lista e depois estranhar o array de arrays: use `flatMap`
:::

---

## Resumo

:::summary
- O React compara referências: para a tela mudar, o estado precisa de um array ou objeto novo
- Spread (`...`) cria arrays e objetos novos; em objetos, o que vem depois vence
- A cópia é rasa: copie cada nível aninhado que você vai alterar
- Desestruturação lê por nome em objetos e por posição em arrays; o rest junta o que sobra
- `flatMap` transforma e achata um nível; refatore com os testes verdes antes e depois
:::

---

## :icon[flask-conical] No laboratório

As regras do carrinho com `reduce` e dois resumos novos na Lojinha.

:::steps
1. `npm test` verde antes de mexer
2. Reescreva `subtotal`, `contarItens` e `itemMaisCaro` com `reduce` em `src/regras/carrinho.js`, sem mudar os testes
3. `agruparPorCategoria(produtos)` em `src/regras/catalogo.js`, montando as seções da `SectionList` de Categorias
4. `totalPorMes(pedidos)` em `src/regras/pedido.js`: sem cancelados, mês mais recente primeiro
5. `formatarMes` em `src/utils/datas.js` e `src/components/ResumoGastos.js` no topo de "Meus pedidos"
6. Testes novos para as três funções, com datas fixas
7. Commit "E34: regras com reduce e resumo de pedidos" e `git push`
:::

**Critérios de entrega**: nenhum `for` nas funções do E27; testes antigos intactos e verdes; Categorias igual à de antes; resumo como "outubro de 2026: R$ 389,80"; 6 testes novos. Entregue o link do repositório no sistema.
