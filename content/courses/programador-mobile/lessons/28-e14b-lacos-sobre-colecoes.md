---
title: Laços sobre coleções
summary: for...in, laços aninhados, busca sem acento e paginação no catalogo.js da Lojinha, no terminal e no Jest.
module: classes-e-controle
duration_minutes: 40
objectives:
  - Percorrer as chaves de um objeto com for...in e evitá-lo em arrays
  - Escrever laços aninhados e estimar quantas voltas eles dão
  - Escrever buscarProdutos, itemMaisCaro e paginar com testes
  - Depurar um laço com breakpoint no VS Code
---

# Laços sobre coleções

Programador Mobile · Encontro E14 · Aula 28 de 89

---

## O que você vai aprender

:::goal
- Usar `for...in` nas chaves de um objeto e evitá-lo em arrays
- Escrever laços aninhados e estimar quantas voltas eles dão
- Escrever `buscarProdutos`, `itemMaisCaro` e `paginar` em `src/regras/catalogo.js`, com testes
- Pausar um laço com breakpoint e acompanhar as variáveis volta a volta
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **chave** | o nome de um campo do objeto, como `audio` em `{ audio: 3 }` |
| **`for...in`** | o laço que passa pelas **chaves** de um objeto, uma por volta |
| **laço aninhado** | um laço dentro de outro laço |
| **normalizar** | deixar dois textos no mesmo formato antes de comparar: sem acento e em minúsculas |
| **paginar** | dividir uma lista longa em pedaços do mesmo tamanho, as **páginas** |
| **breakpoint** | a linha onde o programa pausa para você olhar as variáveis (*break point*, ponto de parada) |

---

## A busca que não acha o tênis

O relatório do catálogo ganha uma busca pelo terminal. Quase todo mundo digita sem acento, e a comparação direta falha:

```javascript
'Tênis de Corrida'.toLowerCase().includes('tenis'); // false
```

O `includes` pergunta se um texto contém outro. E tem mais: quem procura "corrida tenis" espera achar o "Tênis de Corrida", com as palavras fora de ordem.

Para a busca funcionar, o código precisa passar por **cada produto**, deixar nome e termo no mesmo formato, conferir **cada palavra** do termo e guardar os produtos que combinam. É um laço dentro de outro.

:::question
Que passos a busca repete para cada produto? E o que ela devolve quando o termo está vazio?
:::

---

## for...in

Numa ficha com "Telefone: 9999-0000", qual parte é o nome do campo?

---

## :icon[braces] for...in: as chaves de um objeto

Um objeto é uma ficha de cadastro: cada campo tem nome e valor. O **`for...in`** lê a ficha campo por campo e, a cada volta, entrega o **nome** do campo, a **chave**:

```javascript
const ficha = { nome: 'Ana', cidade: 'Recife' };
for (const chave in ficha) {
  console.log(chave, '=', ficha[chave]);
}
// nome = Ana
// cidade = Recife
```

- A cada volta, `chave` recebe o **nome** do campo, como texto: `'nome'`, depois `'cidade'`
- O valor sai com colchetes: `ficha[chave]`. Com ponto, `ficha.chave` procuraria um campo chamado "chave"
- O `Object.entries` do E08 faz o mesmo e entrega chave e valor juntos

---

## :icon[layers] for...in na prática: as categorias

O catálogo guarda quantos produtos há em cada categoria. Duas perguntas, dois laços:

```javascript
const porCategoria = { audio: 3, casa: 3, esporte: 3, livros: 3 };
const linhas = [];
for (const slug in porCategoria) {
  linhas.push(slug + ': ' + porCategoria[slug] + ' produtos');
}
// ['audio: 3 produtos', 'casa: 3 produtos', ...]

let total = 0;
for (const slug in porCategoria) total += porCategoria[slug];
console.log(total); // 12
```

- O primeiro monta uma linha de texto por categoria, para o relatório
- O segundo soma os valores: 12 produtos no catálogo
- Em `porCategoria.slug`, o JavaScript procuraria uma chave chamada "slug" e devolveria `undefined`

---

## :icon[arrow-left-right] for...of ou for...in?

| Laço | Percorre | A cada volta, entrega |
|---|---|---|
| `for...of` | arrays (E07), strings, `Set` e `Map` (E12) | o **item** |
| `for...in` | objetos comuns | a **chave**, como texto |

Um objeto comum não serve no `for...of`:

```javascript
for (const x of porCategoria) {} // TypeError: porCategoria is not iterable
```

*Iterable* quer dizer "dá para percorrer item por item". Regra da Lojinha: array com `for...of` ou `for`; objeto com `for...in` ou `Object.entries`.

---

## :icon[shield-alert] Os riscos do for...in

Num array, o `for...in` não entrega os itens, e sim as posições, **como texto**:

```javascript
const nomes = ['Fone Bluetooth', 'Luminária de Mesa'];
for (const i in nomes) {
  console.log(i + 1); // '01' e '11', não 1 e 2
}
```

| Risco | O que acontece |
|---|---|
| Posição em texto | `'0' + 1` junta os dois textos e vira `'01'` |
| Chaves extras | passa também por propriedades acrescentadas ou herdadas (o E17 mostra de onde vêm as herdadas) |
| Ordem | chaves numéricas primeiro, em ordem crescente, depois as outras |

---

## Pense

:::question
Este laço deveria somar um carrinho de 2 itens. O que fica em `total`, e por quê?

```javascript
let total = 0;
for (const item in itens) {
  total += item.preco * item.qtd;
}
```
:::

:::tip Resposta
`NaN`. Com `in`, `item` recebe `'0'` e `'1'`, as posições em texto, e não os objetos. `'0'.preco` é `undefined`, e `undefined * undefined` dá `NaN` (*not a number*, "não é um número"), que contamina toda a soma: o relatório imprimiria "R$ NaN". Trocar `in` por `of` resolve, uma palavra de diferença.
:::

---

## Laços aninhados

Enquanto o ponteiro das horas anda uma hora, quantas voltas dá o dos minutos?

---

## :icon[layers] Laços aninhados

Um **laço aninhado** é um laço dentro de outro. Pense no relógio: a cada volta do ponteiro das horas, o dos minutos dá uma volta inteira. Para cada volta do laço de fora, o de dentro roda **inteiro**.

Para contar os produtos de cada categoria:

```javascript
function contarPorCategoria(categorias, produtos) {
  const contagem = {};
  for (const categoria of categorias) {
    let quantos = 0;
    for (const produto of produtos) {
      if (produto.categoria === categoria.slug) quantos++;
    }
    contagem[categoria.slug] = quantos;
  }
  return contagem; // { audio: 3, casa: 3, esporte: 3, livros: 3 }
}
```

O contador `quantos` nasce **dentro** do laço de fora: recomeça em 0 para cada categoria. São 4 categorias vezes 12 produtos: **48 voltas** do laço de dentro.

---

## :icon[gauge] Quanto custa um laço aninhado

As voltas se **multiplicam**:

| Categorias | Produtos | Voltas de dentro |
|---|---|---|
| 4 | 12 | 48 |
| 20 | 1.000 | 20.000 |
| 50 | 10.000 | 500.000 |

Se a conta roda a cada letra digitada numa busca, 500.000 voltas por letra pesam. Muitas vezes uma passada só resolve, como a contagem com objeto do E08:

```javascript
const contagem = {};
for (const produto of produtos) {
  contagem[produto.categoria] = (contagem[produto.categoria] ?? 0) + 1;
}
```

São 12 voltas em vez de 48. Aninhe quando precisar mesmo cruzar duas listas. Um `break` no laço de dentro sai só dele: o de fora segue para a próxima volta.

---

## Busca por palavras

Na lista de chamada, "ANA", "Ana" e "ana" são a mesma pessoa?

---

## :icon[search] Busca por palavras: as duas peças

Na lista de chamada, "ANA", "Ana" e "ana" são a mesma pessoa. Para a busca pensar assim, o código **normaliza** os dois lados: nome e termo ficam sem acento e em minúsculas. São duas funções pequenas:

```javascript
function normalizar(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function contemTodas(texto, palavras) {
  for (const palavra of palavras) {
    if (!texto.includes(palavra)) return false; // uma faltou: nem olha as outras
  }
  return true;
}
```

- `normalizar` é a limpeza de acentos do E06 com `toLowerCase` no fim: `'Tênis de Corrida'` vira `'tenis de corrida'`
- `contemTodas` responde se o texto tem **todas** as palavras
- As duas entram em `src/regras/catalogo.js`, abaixo do `aplicarFiltros` do E08, sem `export`: são peças internas da busca

---

## :icon[search-check] As duas peças na prática

```javascript
normalizar('Tênis de Corrida');                         // 'tenis de corrida'
normalizar('Lógica de Programação');                    // 'logica de programacao'
contemTodas('tenis de corrida', ['corrida', 'tenis']);  // true: as duas estão lá
contemTodas('fone bluetooth', ['fone', 'mesa']);        // false: falta "mesa"
```

- Depois do `normalizar`, "LOGICA", "Lógica" e "logica" ficam iguais
- A ordem das palavras não importa: o `contemTodas` procura cada uma no texto inteiro
- Se faltar uma palavra só, a resposta já é `false`

---

## :icon[list-ordered] As duas peças em português

| Linha | O que ela diz |
|---|---|
| `texto.normalize('NFD')` | "separe cada letra do seu acento": o `ê` vira `e` mais o `^` |
| `.replace(...)` | "apague os acentos que ficaram soltos" |
| `.toLowerCase()` | "passe tudo para minúsculas" |
| `for (const palavra of palavras)` | "para cada palavra do termo..." |
| `if (!texto.includes(palavra)) return false` | "...se o texto não tem esta palavra, responda não e pare aqui" |
| `return true` | "passou por todas: responda sim" |

O `return` dentro do laço para na primeira palavra que falta: é o `every` do E09 escrito à mão.

---

## :icon[search-check] buscarProdutos: um laço dentro do outro

```javascript
export function buscarProdutos(produtos, termo) {
  const palavras = normalizar(termo ?? '').split(' ').filter((p) => p !== '');
  if (palavras.length === 0) return produtos; // termo vazio: a vitrine toda
  const encontrados = [];
  for (const produto of produtos) {
    if (contemTodas(normalizar(produto.nome), palavras)) {
      encontrados.push(produto);
    }
  }
  return encontrados;
}
```

- O `filter` tira as palavras vazias que sobram do `split`: `'  '.split(' ')` dá `['', '', '']`
- Termo vazio, só com espaços ou ausente devolve a vitrine toda: `?? ''` e guard clause, do E13
- O laço de dentro está no `contemTodas`: 12 produtos e 2 palavras dão no máximo 24 comparações
- O laço de fora é um `filter` escrito à mão; `produtos.filter(...)` com o mesmo teste passa nos mesmos testes

---

## :icon[list-ordered] buscarProdutos em português

| Linha | O que ela diz |
|---|---|
| `normalizar(termo ?? '')` | "limpe o termo; se não veio termo, use um texto vazio" |
| `.split(' ')` | "corte o termo nos espaços: uma palavra por item" |
| `.filter((p) => p !== '')` | "jogue fora os pedaços vazios" |
| `if (palavras.length === 0) return produtos` | "sem nenhuma palavra, devolva a vitrine toda" |
| `for (const produto of produtos)` | "para cada produto..." |
| `if (contemTodas(normalizar(produto.nome), palavras))` | "...se o nome limpo tem todas as palavras..." |
| `encontrados.push(produto)` | "...guarde o produto" |

Os dois lados passam pelo `normalizar`: o termo e o nome de cada produto.

---

## Paginação

Num catálogo com 5 produtos por folha, em que folha está o 11º produto?

---

## :icon[layout-list] paginar: um pedaço da lista por vez

**Paginar** é dividir uma lista longa em pedaços do mesmo tamanho, como um catálogo impresso com 5 produtos por folha. Ninguém lê 500 resultados de uma vez. Na página `p` de tamanho `t`, a primeira posição é `(p - 1) * t`. Os valores padrão são do E07:

```javascript
export function paginar(lista, pagina = 1, tamanho = 6) {
  if (pagina < 1 || tamanho < 1) return [];
  const inicio = (pagina - 1) * tamanho;
  const fim = Math.min(inicio + tamanho, lista.length);
  const pedaco = [];
  for (let i = inicio; i < fim; i++) {
    pedaco.push(lista[i]);
  }
  return pedaco;
}
```

Aqui o `for` clássico entra porque você precisa das **posições**: começar em `inicio` e parar em `fim`.

---

## :icon[list-ordered] paginar em português

| Linha | O que ela diz |
|---|---|
| `pagina = 1, tamanho = 6` | "se não disserem, página 1, com 6 itens" |
| `if (pagina < 1 \|\| tamanho < 1) return []` | "página 0 ou tamanho 0: devolva uma lista vazia" |
| `const inicio = (pagina - 1) * tamanho` | "pule os itens das páginas anteriores" |
| `Math.min(inicio + tamanho, lista.length)` | "pare no fim da página ou no fim da lista, o que vier primeiro" |
| `for (let i = inicio; i < fim; i++)` | "da posição de início até antes do fim..." |
| `pedaco.push(lista[i])` | "...ponha o item na página" |

O `Math.min` devolve o menor dos números que recebe.

---

## :icon[layout-list] As páginas como fatias

:::center
![Diagrama: as posições 0 a 11 de 12 produtos divididas em páginas de 5; a página 1 tem 0 a 4, a 2 tem 5 a 9, a 3 só 10 e 11 porque Math.min corta o fim em 12, e a página 4 começa em 15 e devolve uma lista vazia](images/e14-paginar.svg)
:::

Com 12 produtos e páginas de 5: a página 1 tem as posições 0 a 4; a 3, só 10 e 11; a 4, nenhuma. Na página 3, o `Math.min` corta o `fim` em 12; na 4, o `inicio` já passou do fim e o laço não dá nenhuma volta.

---

## :icon[copy] O mesmo paginar com slice

Com os testes escritos, você pode trocar o laço por um método e conferir que nada mudou:

```javascript
export function paginar(lista, pagina = 1, tamanho = 6) {
  if (pagina < 1 || tamanho < 1) return [];
  const inicio = (pagina - 1) * tamanho;
  return lista.slice(inicio, inicio + tamanho); // o slice já para no fim da lista
}
```

- O `slice` do E08 copia um pedaço da lista: faz o laço por dentro e não passa do fim. Por isso o `Math.min` sai
- `npm test` verde com as duas versões: o comportamento é o mesmo
- Escreva o laço para entender; troque pelo método quando ele disser a mesma coisa em menos linhas

No E19, a mesma conta vira o `skip` da API de produtos: quantos itens pular para chegar à página pedida.

---

## Pratique

:::example Desafio
Escreva `itemMaisCaro(itens)` com `for...of`. Ela devolve o item de maior **preço unitário**; com a lista vazia, `null`; no empate, fica o primeiro.
:::

:::tip Resposta
```javascript
export function itemMaisCaro(itens) {
  let maisCaro = null;
  for (const item of itens) {
    if (maisCaro === null || item.preco > maisCaro.preco) {
      maisCaro = item;
    }
  }
  return maisCaro;
}
```

É o acumulador "o melhor até agora", começando em `null`. O `>`, e não `>=`, mantém o primeiro no empate. Compare `preco`, não `preco * qtd`: 6 garrafas somam mais que 2 fones, mas o item mais caro é o fone. O `reduce` com `null` também resolve; o laço se lê de cima para baixo.
:::

---

## Busca no terminal

No E02, como o script recebia o nome de quem rodava o comando?

---

## :icon[terminal] A busca no terminal

O script `src/scripts/buscar.js` junta as duas regras. Ele recebe o termo pelos **argumentos**, o detalhe do pedido escrito depois do nome do arquivo (E02), e imprime uma página de resultados:

```javascript
import { produtos } from '../data/produtos.js';
import { buscarProdutos, paginar } from '../regras/catalogo.js';
import { formatarPreco } from '../utils/formatar.js';

const args = process.argv.slice(2);
const opcao = args.find((a) => a.startsWith('--pagina='));
const pagina = opcao ? Number(opcao.split('=')[1]) : 1;
const termo = args.filter((a) => !a.startsWith('--')).join(' ');

const encontrados = buscarProdutos(produtos, termo);
console.log(`${encontrados.length} produto(s) para "${termo}", página ${pagina}`);
for (const produto of paginar(encontrados, pagina, 5)) {
  console.log(`  ${produto.nome}: ${formatarPreco(produto.preco)}`);
}
```

---

## :icon[list-ordered] O script em português

| Linha | O que ela diz |
|---|---|
| `process.argv.slice(2)` | "as palavras digitadas depois do nome do arquivo" |
| `args.find((a) => a.startsWith('--pagina='))` | "procure a palavra que começa com `--pagina=`" |
| `opcao ? Number(...) : 1` | "achou? o número depois do `=`; não achou? página 1" |
| `args.filter(...).join(' ')` | "as outras palavras, juntas de novo, são o termo" |
| `paginar(encontrados, pagina, 5)` | "só os 5 da página pedida" |

```bash
node src/scripts/buscar.js corrida tenis
# 1 produto(s) para "corrida tenis", página 1
#   Tênis de Corrida: R$ 349,90

node src/scripts/buscar.js de --pagina=2
# 9 produto(s) para "de", página 2
#   Bola de Futebol: R$ 99,90
#   Lógica de Programação: R$ 69,90
#   Livro de Receitas: R$ 59,90
#   Guia de Viagem: R$ 74,90
```

---

## Breakpoint

Num vídeo, o que você faz para ver um lance de perto?

---

## :icon[bug] Breakpoint dentro do laço

Um **breakpoint** pausa o programa numa linha, como o botão de pausa de um vídeo: tudo para naquele quadro, e você olha os detalhes. Um `console.log` num laço de 500 voltas enche o terminal; o breakpoint mostra uma volta de cada vez.

:::steps
1. Em `catalogo.js`, clique à esquerda do número da linha do `if` dentro do laço de `buscarProdutos`: aparece um ponto vermelho
2. No terminal do VS Code, abra um **JavaScript Debug Terminal** (seta ao lado do `+`)
3. Rode `node src/scripts/buscar.js tenis`: o programa pausa naquela linha
4. Em **Variables**, veja `produto` e `encontrados`; <kbd>F5</kbd> segue até a próxima volta e <kbd>F10</kbd> anda uma linha
:::

---

## :icon[pause] Breakpoint condicional

Com 12 produtos, apertar <kbd>F5</kbd> volta a volta até o tênis cansa. O **breakpoint condicional** só pausa quando uma condição é verdadeira:

:::steps
1. Clique com o botão direito no número da linha e escolha "Add Conditional Breakpoint"
2. Escreva `produto.id === 7` e aperte <kbd>Enter</kbd>
3. Rode de novo no JavaScript Debug Terminal: o programa só pausa na volta do tênis
:::

Funciona igual com `npx jest catalogo` no mesmo terminal. Num terminal comum, o breakpoint não pausa.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `is not iterable` | `for...of` num objeto comum | `for...in` ou `Object.entries` |
| `NaN` no total | `for...in` num array: a posição chegou no lugar do item | trocar `in` por `of` |
| `Cannot find module` | o `import` aponta para um arquivo que não existe | conferir o caminho e o `.js` no fim |
| o terminal não volta | laço infinito | <kbd>Ctrl</kbd> + <kbd>C</kbd>; conferir a condição e o passo |

---

## :icon[triangle-alert] Erros comuns

:::warning
- `for...in` num array: posições em texto e `NaN` na soma
- Normalizar só o termo: "Tênis de Corrida" nunca aparece, com ou sem acento na busca
- `return true` dentro do laço de `contemTodas`: uma palavra já serve, e "fone mesa" acha até a luminária
- Página começando em 0 num lugar e em 1 no outro: a primeira página some ou se repete
- Laço aninhado para uma conta que uma passada resolve
- `push` ou `splice` na própria lista que o laço percorre: voltas a mais ou a menos
:::

---

## Resumo

:::summary
- `for...of` percorre arrays, strings, `Set` e `Map`; `for...in` percorre as chaves de um objeto, como texto, e não serve para arrays
- Em laços aninhados as voltas se multiplicam: prefira uma passada quando ela resolve
- A busca normaliza os dois lados e exige todas as palavras, com um laço que para na primeira que falta
- `paginar` usa as posições com o `for` clássico; com testes, trocar o laço por `slice` é seguro
- Um breakpoint, condicional se preciso, mostra as variáveis de cada volta sem encher o terminal
:::

---

## :icon[flask-conical] No laboratório

:::steps
1. `unidadesParaFreteGratis` em `src/regras/frete.js`, com a guarda do preço zero e 3 testes
2. Em `src/regras/catalogo.js`: `itemMaisCaro` com `for...of`, testada com lista vazia e empate
3. `paginar` com `for`, testada na primeira página, na última, depois do fim e na 0; depois, `slice`
4. `normalizar`, `contemTodas` e `buscarProdutos`; teste "TENIS", "corrida tênis", "fone" e vazio
5. `src/scripts/buscar.js`; rode com "tenis" e com "de --pagina=2"
6. `npm run verificar`, commit "E14: busca, paginação e laços nas regras" e `git push`
:::

**Critérios de entrega**: `itemMaisCaro`, `contemTodas` e `buscarProdutos` com laços; 2 testes ou mais por função, um com lista ou termo vazio, todos verdes; a busca acha "tenis", "LOGICA" e "corrida tenis". Entregue o link do repositório no sistema.

---

## :icon[milestone] Projeto 3 · Etapa 2: busca, filtro e urgência

No seu repositório `lista-de-tarefas`, em `src/regras/tarefas.js`:

- `buscarTarefas(tarefas, termo)`: todas as palavras, sem acento nem maiúsculas
- `filtrarTarefas(tarefas, filtro, hoje)`: todas, pendentes, concluídas ou atrasadas
- `ordenarPorUrgencia(tarefas)`: uma cópia, por prazo, prioridade e título
- `resumirTarefas(tarefas, hoje)`: as contagens numa passada só, com `for...of`
- 2 testes ou mais por função, um com a lista ou o termo vazio

Commit: `Projeto 3: etapa 2, busca, filtro e urgência`. Enunciado completo e entrega: página do curso, em **Projetos**.
