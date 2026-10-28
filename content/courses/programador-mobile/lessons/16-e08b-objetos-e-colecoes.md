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

## Buscas recentes e favoritos

Em apps de compra, você toca no campo de busca e vê as suas últimas pesquisas; toca no coração de um produto e ele fica guardado. Parece pouco, mas cada recurso tem regras: o histórico mostra só as 5 buscas mais recentes, a mais nova na frente e sem repetir; o favorito liga e desliga.

Hoje você escreve essas regras como funções puras no `lojinha-regras`, testa com Jest e confere no terminal. A vitrine também muda: a ordenação passa a vir de comparadores guardados num objeto. No E30, tudo isso ganha tela.

:::question
Por que guardar nos favoritos só o `id` do produto, e não o produto inteiro?
:::

---

## :icon[braces] Objeto literal: chaves e valores

```javascript
const produto = {
  id: 7,
  nome: 'Tênis de Corrida',
  preco: 349.9,
  categoria: 'esporte',
  destaque: true,
};
```

- Um **objeto** junta os dados de uma mesma coisa: cada **chave** aponta para um **valor**
- O valor pode ser número, texto, booleano, array, outro objeto e até uma função
- Cada produto do `catalogo.json` (E02) é um objeto assim
- Quando a variável tem o nome da chave, basta o nome: `{ categoria, ordem }` é o mesmo que `{ categoria: categoria, ordem: ordem }`. É assim que o script da vitrine monta os filtros no laboratório

---

## :icon[key] Ponto ou colchete

```javascript
produto.nome;    // 'Tênis de Corrida'
produto['nome']; // o mesmo, com a chave escrita como texto

const campo = 'preco';
produto[campo];  // 349.9: a chave vem da variável
produto.campo;   // undefined: procura uma chave chamada "campo"
```

Use **ponto** quando você sabe a chave ao escrever o código. Use **colchete** quando a chave só aparece com o programa rodando, como a ordem digitada no terminal:

```javascript
const rotulosDeOrdem = { nome: 'Nome', preco: 'Menor preço', avaliacao: 'Melhor avaliação' };

rotulosDeOrdem[filtros.ordem]; // 'Menor preço' quando filtros.ordem é 'preco'
```

::::columns
:::col
![Diagrama: o valor 'preco' de filtros.ordem vira a chave da consulta em rotulosDeOrdem, que devolve 'Menor preço'](images/e08-dicionario.svg)
:::
:::col
Usado assim, o objeto é um **dicionário**: o valor da variável vira a chave, e uma consulta toma o lugar de uma fila de `if`.
:::
::::

---

## :icon[layers] Objetos dentro de objetos

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

Leia da esquerda para a direita, um passo por vez. Ler uma chave que não existe dá `undefined`; ler **dentro** de `undefined` derruba o programa. Quando uma parte pode faltar, confira antes: `if (pedido.entrega !== undefined)`. No E13, o `?.` faz essa conferência numa linha.

---

## :icon[list] Object.keys, values e entries

```javascript
const porCategoria = { audio: 3, casa: 3, esporte: 3, livros: 3 };

Object.keys(porCategoria);    // ['audio', 'casa', 'esporte', 'livros']
Object.values(porCategoria);  // [3, 3, 3, 3]
Object.entries(porCategoria); // [['audio', 3], ['casa', 3], ...]

for (const [categoria, total] of Object.entries(porCategoria)) {
  console.log(`${categoria}: ${total}`);
}
```

Os três transformam o objeto em **array**, e aí valem o `for...of` do E07 e os métodos de arrays da aula 15. `entries` devolve pares `[chave, valor]`; o `[categoria, total]` do laço dá um nome a cada posição do par. Essa **desestruturação** volta com detalhes no E09.

---

## :icon[calculator] Contar com um objeto

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

O objeto começa vazio e ganha uma chave para cada categoria encontrada. Na primeira vez, `contagem['audio']` é `undefined`: o `if` cria a chave com 0 antes de somar.

É o acumulador do E07 com um objeto no lugar do número. No relatório do catálogo, essa contagem vira as linhas "audio: 3"; no app, os botões "Áudio (3)".

---

## Pratique

:::example Desafio
O script `src/scripts/vitrine.js` lista as ordens aceitas com três `console.log` escritos à mão. Gere essa lista a partir de `rotulosDeOrdem` com `Object.entries`, imprimindo uma linha por ordem: `  preco: Menor preço`.
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

## :icon[table] Array de objetos: o catálogo

O catálogo é um **array de objetos**: cada produto é uma ficha com as mesmas chaves.

```javascript
produtos[0].nome;                       // 'Fone Bluetooth'
produtos.find((p) => p.id === 7).preco; // 349.9
produtos.length;                        // 12

const maisBarato = produtos.slice().sort((a, b) => a.preco - b.preco)[0];
// { id: 11, nome: 'Livro de Receitas', preco: 59.9, ... }
```

O código só funciona porque todas as fichas seguem o mesmo combinado. Se um produto vier sem `avaliacao`, `b.avaliacao - a.avaliacao` dá `NaN`, e a ordem sai imprevisível. Quando os produtos vierem da API, no E19, uma função vai traduzir cada um para esse mesmo formato.

---

## :icon[arrow-up-down] Comparadores guardados num objeto

Funções também são valores e cabem num objeto. Em `src/regras/catalogo.js`:

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
- Empate dá `0`, e o `||` do E05 troca o `0` pelo segundo valor: o nome desempata
- Os dois objetos têm as mesmas chaves: uma para a regra, outra para o texto

---

## :icon[funnel] aplicarFiltros: filtrar e ordenar

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

- Sem categoria, `base` é a própria `lista`: o `slice()` protege o catálogo
- Ordem desconhecida, como `'cor'`, dá `undefined` no dicionário, e o `||` cai no nome
- Ordem nova é uma linha em `comparadores` e outra em `rotulosDeOrdem`
- No E09, o laço da categoria vira uma linha com `filter`

---

## :icon[file-code] JSON: o que vai e o que fica

```javascript
const favoritos = [3, 7];
const texto = JSON.stringify(favoritos); // '[3,7]': agora é texto
JSON.parse(texto);                       // [3, 7]: de volta a array

JSON.stringify({ nome: 'Fone', preco: 199.9, desconto: undefined, formatar: () => 'R$' });
// '{"nome":"Fone","preco":199.9}': funções e undefined somem
JSON.stringify(comparadores); // '{}': as regras não viajam
```

Você usa **JSON** desde o `catalogo.json` do E02, e no E06 levou datas por ele. Agora que você monta objetos, repare no que **não** passa: funções e `undefined` somem sem aviso.

Os dados viajam como JSON; as regras ficam no código. Por isso os favoritos são um array de ids: `[3, 7]` vira um texto pequeno para gravar num arquivo com `fs.writeFileSync` (E02) ou, no E43, no aparelho.

---

## :icon[history] Histórico de buscas: fila com limite

`src/regras/historico.js`:

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

## :icon[heart] Favoritos: um array de ids

`src/regras/favoritos.js`:

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
- **Alternar** é o coração do app: um toque liga, outro desliga
- A função copia antes de mexer e devolve o array novo. No E12, os favoritos viram um `Set`

---

## :icon[test-tube] Testes das regras

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

## :icon[triangle-alert] Erros comuns

:::warning
- `produto.campo` quando a chave está na variável `campo`: use `produto[campo]`
- Ler `pedido.entrega.prazo` quando `entrega` pode faltar: `TypeError`; confira antes
- `toBe` para comparar arrays no teste: falha mesmo com o mesmo conteúdo; use `toEqual`
- Guardar o produto inteiro nos favoritos: preço desatualizado e JSON grande
- Comparar buscas sem `toLowerCase`: "Fone" e "fone" viram duas entradas
- Esperar que `JSON.parse` devolva as funções de um objeto: só os dados voltam
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
