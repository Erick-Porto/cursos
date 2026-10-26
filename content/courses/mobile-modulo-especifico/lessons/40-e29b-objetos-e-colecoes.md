---
title: Objetos e coleções
summary: Objetos, ponto e colchete, Object.entries e JSON aplicados à vitrine, às buscas recentes e aos favoritos.
module: logica-js
duration_minutes: 40
objectives:
  - Ler e montar objetos com ponto, colchete e aninhamento
  - Percorrer objetos com Object.keys, Object.values e Object.entries
  - Usar objetos como dicionários de rótulos, contagens e comparadores
  - Implementar e testar o histórico de buscas e os favoritos
---

# Objetos e coleções

Programador Mobile: Módulo Específico · Encontro E29 · Aula 40 de 71

---

## O que você vai aprender

:::goal
- Montar e ler objetos com ponto, colchete e objetos dentro de objetos
- Transformar objetos em arrays com `Object.keys`, `values` e `entries`
- Trocar uma fila de `if` por um objeto que funciona como dicionário
- Converter dados em JSON e escrever, com testes, as regras do histórico de buscas e dos favoritos
:::

---

## Buscas recentes e coração

Em apps de compra, você toca no campo de busca e vê as suas últimas pesquisas; toca no coração de um produto e ele fica guardado. Parece pouco, mas cada recurso tem regras: o histórico mostra só as 5 buscas mais recentes, a mais nova na frente e sem repetir; o coração liga e desliga.

Hoje você escreve essas regras como funções puras, testa e liga no Início. A vitrine também muda: a ordenação passa a vir de comparadores guardados num objeto.

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
- Quando a variável tem o nome da chave, basta o nome: `{ itens, total }` é o mesmo que `{ itens: itens, total: total }`. É o `valor` dos seus contextos desde o E16

---

## :icon[key] Ponto ou colchete

```javascript
produto.nome;    // 'Tênis de Corrida'
produto['nome']; // o mesmo, com a chave escrita como texto

const campo = 'preco';
produto[campo];  // 349.9: a chave vem da variável
produto.campo;   // undefined: procura uma chave chamada "campo"
```

Use **ponto** quando você sabe a chave ao escrever o código. Use **colchete** quando a chave só aparece com o app rodando, como a ordem escolhida pelo cliente:

```javascript
const rotulosDeOrdem = { nome: 'Nome', preco: 'Menor preço', avaliacao: 'Melhor avaliação' };

rotulosDeOrdem[filtros.ordem]; // 'Menor preço' quando filtros.ordem é 'preco'
```

::::columns
:::col
![Diagrama: o valor 'preco' de filtros.ordem vira a chave da consulta em rotulosDeOrdem, que devolve 'Menor preço'](images/e29-dicionario.svg)
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
pedido.itens.length;            // 2
pedido.entrega?.prazo;          // undefined, sem erro
```

Leia da esquerda para a direita, um passo por vez. Sem o `?.` do E26, `pedido.entrega.prazo` derrubaria o app: `entrega` não existe, e não dá para ler `prazo` de `undefined`.

---

## :icon[list] Object.keys, values e entries

```javascript
const porCategoria = { audio: 3, casa: 3, esporte: 3, livros: 3 };

Object.keys(porCategoria);    // ['audio', 'casa', 'esporte', 'livros']
Object.values(porCategoria);  // [3, 3, 3, 3]
Object.entries(porCategoria); // [['audio', 3], ['casa', 3], ...]

for (const [categoria, total] of Object.entries(porCategoria)) {
  console.log(categoria + ': ' + total);
}
```

Os três transformam o objeto em **array**, e aí valem os laços e métodos de arrays. `entries` devolve pares `[chave, valor]`; o `[categoria, total]` do laço dá um nome a cada posição do par. Essa **desestruturação** volta com detalhes no E34.

---

## :icon[calculator] Contar com um objeto

```javascript
function contarPorCategoria(produtos) {
  const contagem = {};
  for (const p of produtos) {
    contagem[p.categoria] = (contagem[p.categoria] ?? 0) + 1;
  }
  return contagem;
}

contarPorCategoria(produtos); // { audio: 3, casa: 3, esporte: 3, livros: 3 }
```

O objeto começa vazio e ganha uma chave para cada categoria encontrada. Na primeira vez, `contagem['audio']` é `undefined`, e o `?? 0` começa a conta do zero.

É o acumulador do E27 com um objeto no lugar do número. Na tela de filtros, essa contagem vira "Áudio (3)".

---

## Pratique

:::example Desafio
Na tela de Filtros, os botões de ordem vêm de um array `ordens` escrito à mão. Gere os botões a partir de `rotulosDeOrdem` com `Object.entries`, mantendo `key`, `titulo`, `variante` e `onPress`.
:::

:::tip Resposta
```jsx
{Object.entries(rotulosDeOrdem).map(([valor, rotulo]) => (
  <Botao key={valor} titulo={rotulo} tamanho="sm"
    variante={ordem === valor ? 'primaria' : 'secundaria'}
    onPress={() => setOrdem(valor)} />
))}
```

Cada par vira um botão: a chave é o que vai para o filtro, o valor é o texto do botão. Uma ordem nova no objeto aparece na tela sem mexer no JSX.
:::

---

## :icon[table] Array de objetos: o catálogo

O catálogo é um **array de objetos**: cada produto é uma ficha com as mesmas chaves.

```javascript
produtos[0].nome;                          // 'Fone Bluetooth'
produtos.find((p) => p.id === 7).preco;    // 349.9
produtos.filter((p) => p.destaque).length; // 4

const maisBarato = [...produtos].sort((a, b) => a.preco - b.preco)[0];
// { id: 11, nome: 'Livro de Receitas', preco: 59.9, ... }
```

O código só funciona porque todas as fichas seguem o mesmo combinado. Se um produto vier sem `avaliacao`, `b.avaliacao - a.avaliacao` dá `NaN`, e a ordem sai imprevisível. Quando os produtos vierem da API, no E38, uma camada vai traduzir cada um para esse mesmo formato.

---

## :icon[arrow-up-down] Comparadores guardados num objeto

Funções também são valores e cabem num objeto. O `aplicarFiltros` do E17 troca a fila de `if` por uma consulta:

```javascript
const porNome = (a, b) => a.nome.localeCompare(b.nome, 'pt-BR');

export const comparadores = {
  nome: porNome,
  preco: (a, b) => a.preco - b.preco || porNome(a, b),
  avaliacao: (a, b) => b.avaliacao - a.avaliacao || porNome(a, b),
};

export function aplicarFiltros(lista, { categoria = null, ordem = 'nome' } = {}) {
  const base = categoria ? lista.filter((p) => p.categoria === categoria) : lista;
  const comparar = comparadores[ordem] ?? comparadores.nome;
  return [...base].sort(comparar);
}
```

- Empate dá `0`, que é falsy: o `||` passa a decisão ao nome
- Sem categoria, `base` é a própria `lista`: a cópia protege o catálogo
- Ordem nova é uma linha em `comparadores` e outra em `rotulosDeOrdem`

---

## :icon[file-code] JSON: dados em forma de texto

```javascript
const favoritos = [3, 7];
const texto = JSON.stringify(favoritos); // '[3,7]': agora é texto
JSON.parse(texto);                       // [3, 7]: de volta a array

JSON.stringify({ nome: 'Fone', preco: 199.9, desconto: undefined, formatar() {} });
// '{"nome":"Fone","preco":199.9}': funções e undefined somem
```

**JSON** é um texto com o formato de objetos e arrays, que qualquer linguagem entende. Na Lojinha ele aparece em três lugares: no `catalogo.json` do E21, nas respostas da API (E38) e no armazenamento do aparelho (E39), que só guarda texto.

Regras do formato: chaves e textos entre aspas duplas, nada de vírgula sobrando no fim, nada de funções. Os dados viajam como JSON; as regras ficam no código.

---

## :icon[history] Histórico de buscas: fila com limite

`src/regras/historico.js`:

```javascript
export function registrarBusca(historico, termo, limite = 5) {
  const limpo = termo.trim();
  if (limpo === '') return historico;

  const novo = [...historico];
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
![Animação: com cinco buscas guardadas, o unshift põe garrafa na posição 0, fone, bola, yoga, panela e livro andam uma posição e o slice(0, 5) deixa livro de fora](images/e29-historico-limite.svg)
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
  const novo = [...favoritos];
  const posicao = novo.indexOf(id);
  if (posicao === -1) {
    novo.push(id);
  } else {
    novo.splice(posicao, 1);
  }
  return novo;
}
```

- Guarde o **id**, não o produto: preço e foto mudam, o id não; e `[3, 7]` vira um JSON pequeno para salvar no aparelho no E39
- **Alternar** é o coração: um toque liga, outro desliga
- A função copia antes de mexer e devolve o array novo para o `setFavoritos`. No E36, os favoritos ganham contexto próprio e viram um `Set`

---

## :icon[test-tube] Testes das regras

```javascript
import { registrarBusca } from './historico';

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

- `toEqual` compara o conteúdo; `toBe` compara se é o mesmo array, e dois arrays escritos separadamente nunca são
- Teste também o que **não** pode acontecer: mudar o array recebido é o bug que o React não perdoa
- Os testes do `aplicarFiltros` do E24 precisam continuar verdes depois da troca para comparadores

---

## :icon[triangle-alert] Erros comuns

:::warning
- `produto.campo` quando a chave está na variável `campo`: use `produto[campo]`
- Ler `pedido.entrega.prazo` sem `?.` quando `entrega` pode faltar: o app cai
- `toBe` para comparar arrays no teste: falha mesmo com o mesmo conteúdo; use `toEqual`
- Guardar o produto inteiro nos favoritos: preço desatualizado e JSON grande
- Comparar buscas sem `toLowerCase`: "Fone" e "fone" viram duas entradas
- Esperar que `JSON.parse` devolva os métodos de um objeto: só os dados voltam
:::

---

## Resumo

:::summary
- Objeto junta dados com chave e valor; ponto para chave conhecida, colchete para chave numa variável
- Objetos aninhados se leem passo a passo, com `?.` onde algo pode faltar
- `Object.keys`, `values` e `entries` transformam o objeto em array para percorrer e gerar telas
- Objeto como dicionário guarda rótulos, contagens e até comparadores, no lugar de uma fila de `if`
- JSON é texto: `stringify` para guardar ou enviar, `parse` para voltar a objeto
:::

---

## :icon[flask-conical] No laboratório

Comparadores, buscas recentes e favoritos na Lojinha.

:::steps
1. `src/utils/filtrar.js` com `comparadores`, `rotulosDeOrdem` e o novo `aplicarFiltros`
2. `src/regras/historico.js` (`registrarBusca`) e `src/regras/favoritos.js` (`ehFavorito`, `alternarFavorito`)
3. Testes dos três arquivos: no mínimo 12 novos, e os do E24 seguem verdes
4. Início: a busca confirmada entra no histórico; as recentes viram botões
5. Coração no `CartaoProduto` (`favorito`, `onFavoritar`), com os ids no Início
6. Filtros: botões de ordem com `Object.entries(rotulosDeOrdem)`
7. `npm test` verde, commit "E29: ordenação, histórico e favoritos" e `git push`
:::

**Critérios de entrega**: três ordens corretas, acentos no lugar; Categorias não muda ao ordenar a vitrine; até 5 buscas, sem repetir; coração liga e desliga; nenhuma regra muda o array recebido. Entregue o link do repositório no sistema.
