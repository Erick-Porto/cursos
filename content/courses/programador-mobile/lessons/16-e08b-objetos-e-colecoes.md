---
title: Objetos e coleções
summary: Objetos, ponto e colchete, Object.entries e JSON aplicados à vitrine, às buscas recentes e aos favoritos.
module: linguagem-js
duration_minutes: 40
objectives:
  - Ler e montar objetos com ponto, colchete e aninhamento
  - Percorrer objetos com Object.keys, Object.values e Object.entries
  - Usar objetos como dicionários de rótulos, contagens e comparadores
  - Implementar e testar o histórico de buscas e os favoritos
---

# Objetos e coleções

Programador Mobile · Encontro E08 · Aula 16 de 89

---

## O que você vai aprender

:::goal
- Montar e ler objetos com ponto, colchete e objetos dentro de objetos
- Transformar objetos em arrays com `Object.keys`, `values` e `entries`
- Trocar uma fila de `if` por um objeto que funciona como dicionário
- Saber o que o JSON leva e o que deixa para trás
- Escrever, com testes, as regras do histórico de buscas e dos favoritos
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **objeto** | uma ficha de cadastro: junta os dados de uma coisa, e cada campo tem nome e valor |
| **chave** | o nome de um campo do objeto, como `nome` ou `preco` |
| **aninhado** | guardado dentro de outro: um objeto dentro de um objeto, ou dentro de um array |
| **dicionário** | um objeto usado para consultar: a chave leva ao valor, como a palavra leva ao significado |
| **`Object.entries`** | transforma um objeto numa lista de pares `[chave, valor]` |

---

## Buscas recentes e favoritos

Em apps de compra, você toca no campo de busca e vê as suas últimas pesquisas. Toca no coração de um produto e ele fica guardado.

Parece pouco, mas cada recurso tem regras. O histórico mostra só as 5 buscas mais recentes, a mais nova na frente e sem repetir. O favorito liga e desliga.

Hoje você escreve essas regras no `lojinha-regras` como funções puras, as do E07: recebem dados e devolvem dados, sem mexer em nada fora delas. Depois, testa com o Jest e confere no terminal. A vitrine também muda: a ordem passa a vir de comparadores guardados num objeto. No E30, tudo ganha tela.

:::question
Por que guardar nos favoritos só o `id` do produto, e não o produto inteiro?
:::

---

## Objetos

Que campos tem a sua ficha de cadastro na farmácia?

---

## :icon[braces] Objeto literal: chaves e valores

Um **objeto** é uma ficha de cadastro: junta os dados de uma mesma coisa, e cada campo tem um nome, a **chave**, e um **valor**. Escrito direto no código, com chaves `{ }`, ele se chama **objeto literal**.

```javascript
const produto = {
  id: 7,
  nome: 'Tênis de Corrida',
  preco: 349.9,
  categoria: 'esporte',
  destaque: true,
};
```

- Cada campo é `chave: valor`, e os campos vão separados por vírgula
- O valor pode ser número, texto, `true` ou `false`, array, outro objeto e até uma função
- Cada produto do `catalogo.json` (E02) é um objeto assim

---

## :icon[braces] Objetos na prática

```javascript
// 1. Ler a ficha de um produto do catálogo (o ponto do E02)
const tenis = produtos[6];
console.log(tenis.nome, tenis.preco);  // Tênis de Corrida 349.9

// 2. Montar a linha do carrinho: só o que o carrinho guarda (E07)
const item = { id: tenis.id, nome: tenis.nome, preco: tenis.preco, qtd: 1 };
console.log(item.qtd);                 // 1

// 3. Os filtros da vitrine, com o atalho
const categoria = 'casa';
const ordem = 'preco';
const filtros = { categoria, ordem };
console.log(filtros);                  // { categoria: 'casa', ordem: 'preco' }
```

O terceiro caso usa um **atalho**: quando a variável tem o mesmo nome da chave, dá para escrever só o nome. `{ categoria, ordem }` é o mesmo que `{ categoria: categoria, ordem: ordem }`. É assim que o script da vitrine monta os filtros no laboratório, e o atalho aparece muito daqui em diante.

---

## Ponto ou colchete

Num papel está escrito "preço". No dicionário, você procura "papel" ou "preço"?

---

## :icon[key] Ponto ou colchete

Há dois jeitos de ler um campo. O **ponto** usa o nome da chave escrito no código. O **colchete** usa um texto, que pode vir de uma variável.

```javascript
produto.nome;    // 'Tênis de Corrida'
produto['nome']; // o mesmo, com a chave escrita como texto

const campo = 'preco';
produto[campo];  // 349.9: a chave vem da variável
produto.campo;   // undefined: procura uma chave chamada "campo"
```

Use **ponto** quando você sabe a chave ao escrever o código. Use **colchete** quando a chave só aparece com o programa rodando, como a ordem que o cliente digita no terminal.

Repare no `produto.campo`: o ponto não olha a variável, procura uma chave com esse nome exato.

---

## :icon[book] Objeto como dicionário

Com o colchete, o objeto vira um **dicionário**: como num dicionário de papel, você procura a palavra (a chave) e lê o significado (o valor).

```javascript
const rotulosDeOrdem = { nome: 'Nome', preco: 'Menor preço', avaliacao: 'Melhor avaliação' };

rotulosDeOrdem[filtros.ordem]; // 'Menor preço' quando filtros.ordem é 'preco'
```

::::columns
:::col
![Diagrama: o valor 'preco' de filtros.ordem vira a chave da consulta em rotulosDeOrdem, que devolve 'Menor preço'](images/e08-dicionario.svg)
:::
:::col
O valor da variável vira a chave, e uma consulta toma o lugar de uma fila de `if`. Sem o dicionário, seriam três `if`, um para cada ordem.
:::
::::

---

## Objetos aninhados

Onde está a cidade da cliente: no pedido, no cliente ou no endereço?

---

## :icon[layers] Objetos dentro de objetos

Um campo pode guardar outra ficha, ou uma lista de fichas. É um objeto **aninhado**: guardado dentro de outro.

```javascript
const pedido = {
  id: 101,
  status: 'enviado',
  cliente: { nome: 'Ana Souza', endereco: { cep: '01310-100', cidade: 'São Paulo' } },
  itens: [
    { id: 1, nome: 'Fone Bluetooth', preco: 199.9, qtd: 1 },
    { id: 7, nome: 'Tênis de Corrida', preco: 349.9, qtd: 2 },
  ],
};

pedido.cliente.endereco.cidade; // 'São Paulo'
pedido.itens[1].nome;           // 'Tênis de Corrida'
pedido.entrega;                 // undefined: a chave não existe
pedido.entrega.prazo;           // TypeError: Cannot read properties of undefined
```

Leia da esquerda para a direita, um passo por vez: "no pedido, abra o cliente, depois o endereço, depois a cidade". Ler uma chave que não existe dá `undefined`; ler **dentro** de `undefined` derruba o programa. Quando uma parte pode faltar, confira antes: `if (pedido.entrega !== undefined)`. No E13, o `?.` faz essa conferência numa linha.

---

## :icon[table] Array de objetos: o catálogo

O catálogo é um **array de objetos**: uma fileira de gavetas, e cada gaveta guarda uma ficha de produto com as mesmas chaves.

```javascript
produtos[0].nome;                       // 'Fone Bluetooth'
produtos.find((p) => p.id === 7).preco; // 349.9
produtos.length;                        // 12

const maisBarato = produtos.slice().sort((a, b) => a.preco - b.preco)[0];
// { id: 11, nome: 'Livro de Receitas', preco: 59.9, ... }
```

O código só funciona porque todas as fichas seguem o mesmo combinado. Se um produto vier sem `avaliacao`, `b.avaliacao - a.avaliacao` dá `NaN`, "não é um número", e a ordem sai imprevisível. Quando os produtos vierem da API, no E19, uma função vai traduzir cada um para esse mesmo formato.

---

## Percorrer um objeto

Como você leria em voz alta todos os campos de uma ficha?

---

## :icon[list] Object.keys, values e entries

O `for...of` do E07 anda em arrays, não em objetos: num objeto, ele dá `is not iterable`, "não dá para percorrer". Por isso, primeiro você transforma a ficha em **array**: só as chaves (`keys`), só os valores (`values`) ou os pares `[chave, valor]` (`entries`).

```javascript
const porCategoria = { audio: 3, casa: 3, esporte: 3, livros: 3 };

Object.keys(porCategoria);    // ['audio', 'casa', 'esporte', 'livros']
Object.values(porCategoria);  // [3, 3, 3, 3]
Object.entries(porCategoria); // [['audio', 3], ['casa', 3], ...]

for (const [categoria, total] of Object.entries(porCategoria)) {
  console.log(`${categoria}: ${total}`);
}
```

| Parte | O que ela diz |
|---|---|
| `Object.entries(porCategoria)` | "me dê os pares `[chave, valor]`" |
| `for (const ... of ...)` | "para cada par..." |
| `[categoria, total]` | "chame a posição 0 do par de `categoria` e a posição 1 de `total`" |

O laço imprime `audio: 3`, `casa: 3`... Dar nome a cada posição do par é a **desestruturação**: hoje é só para ler; no E09 você aprende a escrever.

---

## :icon[calculator] Contar com um objeto

O objeto também serve de placar: uma chave para cada categoria, e o valor é quantos produtos ela tem.

```javascript
function contarPorCategoria(produtos) {
  const contagem = {};
  for (const p of produtos) {
    if (contagem[p.categoria] === undefined) {
      contagem[p.categoria] = 0; // primeira vez desta categoria
    }
    contagem[p.categoria] = contagem[p.categoria] + 1;
  }
  return contagem;
}

contarPorCategoria(produtos); // { audio: 3, casa: 3, esporte: 3, livros: 3 }
```

É o acumulador do E07 com um objeto no lugar do número. No relatório do catálogo, essa contagem vira as linhas "audio: 3"; no app, os botões "Áudio (3)".

---

## :icon[list-ordered] A contagem em português

| Linha | O que ela diz |
|---|---|
| `const contagem = {}` | "comece com uma ficha em branco" |
| `for (const p of produtos)` | "para cada produto..." |
| `if (contagem[p.categoria] === undefined)` | "esta categoria ainda não tem campo na ficha?" |
| `contagem[p.categoria] = 0` | "então crie o campo, com 0" |
| `contagem[p.categoria] + 1` | "some 1 no campo desta categoria" |
| `return contagem` | "devolva a ficha preenchida" |

Na primeira vez, `contagem['audio']` é `undefined`: o `if` cria a chave com 0 antes de somar. Repare no colchete: a chave vem de `p.categoria`, que muda a cada produto.

---

## Pratique

:::example Desafio
O script `src/scripts/vitrine.js` lista as ordens aceitas com três `console.log` escritos à mão. Gere essa lista a partir de `rotulosDeOrdem` com `Object.entries`, uma linha por ordem:

```javascript
const rotulosDeOrdem = { nome: 'Nome', preco: 'Menor preço', avaliacao: 'Melhor avaliação' };
```

```plaintext
  nome: Nome
  preco: Menor preço
  avaliacao: Melhor avaliação
```
:::

:::tip Resposta
```javascript
for (const [valor, rotulo] of Object.entries(rotulosDeOrdem)) {
  console.log(`  ${valor}: ${rotulo}`);
}
```

Cada par vira uma linha: a chave é o que se digita no terminal, o valor é o texto para gente. Uma ordem nova no objeto aparece na lista sem mexer no script. No app, o mesmo par vira um botão na tela de Filtros.
:::

---

## Funções num objeto

Num caderno de receitas, como você acha a receita do prato pedido?

---

## :icon[arrow-up-down] Comparadores guardados num objeto

Uma função também é um valor, como um número ou um texto, e cabe num campo de objeto. Assim o dicionário guarda **regras**: cada chave leva a um comparador da aula 15. Em `src/regras/catalogo.js`:

```javascript
const porNome = (a, b) => a.nome.localeCompare(b.nome, 'pt-BR');

export const comparadores = {
  nome: porNome,
  preco: (a, b) => a.preco - b.preco || porNome(a, b),
  avaliacao: (a, b) => b.avaliacao - a.avaliacao || porNome(a, b),
};

export const rotulosDeOrdem = {
  nome: 'Nome',
  preco: 'Menor preço',
  avaliacao: 'Melhor avaliação',
};
```

- `comparadores[ordem]` escolhe a regra pela chave: um dicionário de funções
- Empate dá `0`. O `||` ("ou", do E05) troca o `0` pelo valor da direita: aí o nome desempata
- Os dois objetos têm as mesmas chaves: um guarda a regra, o outro o texto

---

## :icon[funnel] aplicarFiltros: filtrar e ordenar

A vitrine usa o dicionário de comparadores. Em `src/regras/catalogo.js`, abaixo dos dois objetos:

```javascript
export function aplicarFiltros(lista, filtros = {}) {
  let base = lista;
  if (filtros.categoria) {
    base = [];
    for (const produto of lista) {
      if (produto.categoria === filtros.categoria) base.push(produto);
    }
  }
  const comparar = comparadores[filtros.ordem] || comparadores.nome;
  return base.slice().sort(comparar);
}
```

1. `filtros = {}`: sem filtros, use uma ficha vazia (o parâmetro padrão do E07)
2. `let base = lista`: comece com a lista inteira; se veio categoria, troque por uma lista nova só com ela
3. `comparadores[filtros.ordem]`: procure a regra da ordem pedida. Ordem desconhecida, como `'cor'`, dá `undefined`, e o `||` cai no nome
4. `base.slice().sort(comparar)`: copie e ordene a cópia, nunca o catálogo

No E09, o laço da categoria vira uma linha com `filter`.

---

## :icon[arrow-up-down] Funções num objeto na prática

```javascript
// 1. A vitrine da casa, do mais barato para o mais caro
const casa = aplicarFiltros(produtos, { categoria: 'casa', ordem: 'preco' });
console.log(casa[0].nome, casa.length);  // Garrafa Térmica 3

// 2. Ordem desconhecida: o dicionário dá undefined, e vale o nome
const todos = aplicarFiltros(produtos, { ordem: 'cor' });
console.log(todos[0].nome);              // Bola de Futebol

// 3. O catálogo continua na ordem original
console.log(produtos[0].nome);           // Fone Bluetooth
```

Para uma ordem nova, como "Maior preço", são duas linhas: uma em `comparadores`, outra em `rotulosDeOrdem`. A função `aplicarFiltros` não muda: ela só consulta o dicionário.

---

## JSON

Por mensagem, dá para mandar a lista de compras? E o liquidificador?

---

## :icon[file-code] JSON: o que vai e o que fica

O **JSON** é o jeito de escrever dados como texto, que você usa desde o `catalogo.json` do E02. Pense numa mensagem de celular: ela leva a lista de compras, mas não leva o liquidificador. Texto pode ser gravado num arquivo ou enviado pela internet; um objeto, não.

```javascript
const favoritos = [3, 7];
const texto = JSON.stringify(favoritos); // '[3,7]': agora é texto
JSON.parse(texto);                       // [3, 7]: de volta a array

JSON.stringify({ nome: 'Fone', preco: 199.9, desconto: undefined, formatar: () => 'R$' });
// '{"nome":"Fone","preco":199.9}': funções e undefined somem
JSON.stringify(comparadores); // '{}': as regras não viajam
```

No E06, você levou datas pelo JSON. Agora que você monta objetos, repare no que **não** passa: funções e `undefined` somem sem aviso.

Os dados viajam como JSON; as regras ficam no código. Por isso os favoritos são um array de ids: `[3, 7]` vira um texto pequeno para gravar num arquivo com `fs.writeFileSync` (E02) ou, no E43, no aparelho.

---

## :icon[file-code] JSON na prática

```javascript
import fs from 'node:fs';

// 1. Gravar os favoritos num arquivo
fs.writeFileSync('favoritos.json', JSON.stringify([3, 7]));

// 2. Na próxima vez que o script rodar, ler de volta
const salvos = JSON.parse(fs.readFileSync('favoritos.json', 'utf-8'));
console.log(salvos.includes(7));  // true: voltou um array de verdade

// 3. Um produto viaja sem a função de formatar
const texto = JSON.stringify({ nome: 'Fone', preco: 199.9, formatar: () => 'R$' });
console.log(texto);               // {"nome":"Fone","preco":199.9}
```

O `favoritos.json` fica com o texto `[3,7]`. Na volta, o `JSON.parse` devolve o array, e o `includes` funciona de novo. A função `formatar` não chega do outro lado: quem recebe os dados usa as regras do próprio código.

---

## Histórico de buscas

No app de compras, quais pesquisas aparecem quando você toca na busca?

---

## :icon[history] Histórico de buscas: fila com limite

O **histórico de buscas** guarda as últimas pesquisas do cliente: a mais nova na frente, sem repetir, no máximo 5. A regra recebe o histórico e o termo e devolve um histórico **novo**. Em `src/regras/historico.js`:

```javascript
export function registrarBusca(historico, termo, limite = 5) {
  const limpo = termo.trim();
  if (limpo === '') return historico;

  const novo = historico.slice();
  const repetida = novo.findIndex((t) => t.toLowerCase() === limpo.toLowerCase());
  if (repetida !== -1) novo.splice(repetida, 1);

  novo.unshift(limpo);
  return novo.slice(0, limite);
}
```

| Histórico | Busca | Resultado |
|---|---|---|
| `['garrafa']` | `'fone'` | `['fone', 'garrafa']` |
| `['fone', 'garrafa', 'tênis']` | `'Garrafa'` | `['Garrafa', 'fone', 'tênis']` |
| 5 buscas | uma nova | a nova e as 4 mais recentes |

---

## :icon[list-ordered] registrarBusca em português

1. **Limpar**: `trim()` tira os espaços das pontas (E06). Busca vazia devolve o histórico como estava
2. **Copiar**: `slice()` faz uma cópia; a regra nunca mexe no histórico recebido
3. **Achar a repetida**: `findIndex` procura a mesma busca, comparando tudo em minúsculas com `toLowerCase` (E06)
4. **Tirar**: se achou (`repetida !== -1`), o `splice` tira a repetida da cópia
5. **Pôr na frente**: `unshift(limpo)` põe a busca nova na posição 0
6. **Cortar no limite**: `slice(0, limite)` fica só com as 5 primeiras

O `limite = 5` é um parâmetro padrão (E07): quem chamar sem limite ganha 5.

---

## :icon[list-ordered] O limite de 5, passo a passo

:::center
![Animação: com cinco buscas guardadas, o unshift põe garrafa na posição 0, fone, bola, yoga, panela e livro andam uma posição e o slice(0, 5) deixa livro de fora](images/e08-historico-limite.svg)
:::

```javascript
registrarBusca(['fone', 'bola', 'yoga', 'panela', 'livro'], 'garrafa');
// ['garrafa', 'fone', 'bola', 'yoga', 'panela']
```

O `unshift` põe a busca nova na posição 0 e empurra as outras uma casa para o fim. Agora são seis: o `slice(0, 5)` devolve só as cinco primeiras, e `'livro'`, a busca mais antiga, fica de fora.

---

## Favoritos

Se o preço do tênis muda, o que mostra um favorito que guardou o produto inteiro?

---

## :icon[heart] Favoritos: um array de ids

Os **favoritos** são os produtos que o cliente marcou com o coração. A Lojinha guarda só o **id** de cada um, num array: `[3, 7]`. Em `src/regras/favoritos.js`:

```javascript
export function ehFavorito(favoritos, id) {
  return favoritos.includes(id);
}

export function alternarFavorito(favoritos, id) {
  const novo = favoritos.slice();
  const posicao = novo.indexOf(id);
  if (posicao === -1) {
    novo.push(id);
  } else {
    novo.splice(posicao, 1);
  }
  return novo;
}
```

- Guarde o **id**, não o produto: preço e foto mudam, o id não; e `[3, 7]` vira um JSON pequeno
- **Alternar** é o coração do app: se o id não está (`-1`), entra; se está, sai. Um toque liga, outro desliga
- A função copia antes de mexer e devolve o array novo. No E12, os favoritos viram um `Set`

---

## :icon[heart] Favoritos na prática

Três toques no coração, e a resposta de cada um:

```javascript
let favoritos = [3];

favoritos = alternarFavorito(favoritos, 7);  // toca no 7: entra
console.log(favoritos);                      // [ 3, 7 ]

favoritos = alternarFavorito(favoritos, 3);  // toca no 3 de novo: sai
console.log(favoritos);                      // [ 7 ]

console.log(ehFavorito(favoritos, 7));       // true: o coração aparece cheio
```

```javascript
const antes = [3, 7];
const depois = alternarFavorito(antes, 10);
console.log(antes, depois);                  // [ 3, 7 ] [ 3, 7, 10 ]
```

O `favoritos = ...` guarda o array novo que a regra devolve. E o `antes` não muda: a regra copia antes de mexer.

---

## :icon[test-tube] Testes das regras

O teste é uma prova com gabarito que o computador corrige sozinho (E04). Em `src/regras/historico.test.js`:

```javascript
import { registrarBusca } from './historico.js';

describe('registrarBusca', () => {
  test('não repete: a busca repetida sobe para o começo', () => {
    expect(registrarBusca(['fone', 'garrafa', 'tênis'], 'Garrafa'))
      .toEqual(['Garrafa', 'fone', 'tênis']);
  });

  test('não altera o histórico recebido', () => {
    const historico = ['fone', 'garrafa'];
    registrarBusca(historico, 'bola');
    expect(historico).toEqual(['fone', 'garrafa']);
  });
});
```

- `toEqual` compara o conteúdo; `toBe` compara se é o mesmo array, e dois arrays escritos separadamente nunca são (E04)
- Teste também o que **não** pode acontecer: mudar o array recebido bagunça o catálogo hoje e, no app, impede a tela de atualizar
- Os testes antigos seguem verdes: `npm run verificar` antes do commit

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Cannot read properties of undefined` | você leu um campo dentro de algo que não existe | conferir antes a parte que pode faltar |
| `favoritos.includes is not a function` | `favoritos` não é mais um array: o `push` devolveu um número | usar o que a regra devolve: `favoritos = alternarFavorito(favoritos, id)` |
| `is not iterable` | `for...of` direto num objeto | percorrer `Object.entries(objeto)` |
| `serializes to the same string`, num teste | `toBe` com dois arrays de mesmo conteúdo | trocar por `toEqual` |
| `ERR_MODULE_NOT_FOUND` | `import` relativo sem o `.js` | `'../regras/catalogo.js'` |

---

## :icon[triangle-alert] Erros comuns

:::warning
- `produto.campo` quando a chave está na variável `campo`: use `produto[campo]`
- Guardar o produto inteiro nos favoritos: preço desatualizado e JSON grande
- Comparar buscas sem `toLowerCase`: "Fone" e "fone" viram duas entradas
- Esperar que `JSON.parse` devolva as funções de um objeto: só os dados voltam
- Chaves diferentes em `comparadores` e `rotulosDeOrdem`: a ordem cai no nome sem avisar
:::

---

## Resumo

:::summary
- Objeto junta dados com chave e valor; ponto para chave conhecida, colchete para chave numa variável
- Objetos aninhados se leem passo a passo; confira antes de ler dentro de algo que pode faltar
- `Object.keys`, `values` e `entries` transformam o objeto em array para percorrer e imprimir
- Objeto como dicionário guarda rótulos, contagens e até comparadores, no lugar de uma fila de `if`
- JSON é texto: leva dados, não leva funções
:::

---

## :icon[flask-conical] No laboratório

Comparadores, buscas recentes e favoritos no `lojinha-regras`.

:::steps
1. `src/regras/catalogo.js` com `comparadores`, `rotulosDeOrdem` e `aplicarFiltros`
2. `src/regras/historico.js` (`registrarBusca`) e `src/regras/favoritos.js` (`ehFavorito`, `alternarFavorito`)
3. Testes dos três arquivos: no mínimo 12 novos, e os antigos seguem verdes
4. `src/scripts/vitrine.js`: ordem e categoria vêm do terminal; ordem desconhecida lista as opções com `Object.entries`
5. `src/scripts/buscas.js`: imprime o histórico depois de cada termo do terminal
6. `src/scripts/favoritos.js`: cada id do terminal liga ou desliga um favorito
7. `npm run verificar` verde, commit "E08: ordenação, histórico e favoritos" e `git push`
:::

**Critérios de entrega**: três ordens corretas, com acentos; a vitrine termina com "Primeiro do catálogo: Fone Bluetooth"; até 5 buscas, sem repetir; favorito liga e desliga; nenhuma regra muda o array recebido. Entregue o link do repositório.

---

## :icon[milestone] Projeto 2 · Agenda de contatos

O segundo projeto avaliado começa hoje: a **agenda de contatos** de um celular, num repositório novo, `agenda-de-contatos`, feito por você, sozinho.

- :icon[contact] 15 contatos de exemplo, com telefone, e-mail, aniversário e grupo
- :icon[list-checks] busca, grupos, aniversariantes, cadastro, validação e favoritos, com testes
- :icon[monitor] no E12, uma interface web pronta passa a usar as suas funções
- :icon[calendar-check] uma etapa por encontro, do E08 ao E12; entrega até o início do E13

O Projeto 1, o Racha-conta, fechou no início de hoje: confira se o link está na página dele.

---

## :icon[milestone] Projeto 2 · Etapa 1: busca, ordem e histórico

No repositório novo, com Jest e ESLint como no Projeto 1 e o [contatos.js](materiais/projeto-2/contatos.js) em `src/data/`:

- `buscarContatos(contatos, termo)`: pelo nome ou pelos dígitos do telefone, sem diferenciar maiúsculas; `'zé'` não acha todo mundo
- `ordenarPorNome(contatos)`: uma cópia, em ordem alfabética
- `registrarBusca(historico, termo)`: 5 buscas, a mais nova na frente, sem repetir
- testes, com "não altera a lista recebida", e o script `buscar.js`

Commit: `Projeto 2: etapa 1, busca, ordem e histórico`. Enunciado completo e entrega: página do curso, em **Projetos**.
