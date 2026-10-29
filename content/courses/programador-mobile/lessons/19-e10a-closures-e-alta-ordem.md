---
title: Closures e funções de alta ordem
summary: Funções como valor, callbacks e closures que lembram dados, com memoize no frete e debounce na busca.
module: linguagem-js
duration_minutes: 40
objectives:
  - Passar funções como valor e reconhecer callbacks no código
  - Escrever funções de alta ordem que recebem ou devolvem funções
  - Explicar uma closure com criarContador
  - Implementar memoize e debounce e dizer quando usar cada um
---

# Closures e funções de alta ordem

Programador Mobile · Encontro E10 · Aula 19 de 89

---

## O que você vai aprender

:::goal
- Tratar uma função como valor: guardar, passar e devolver
- Reconhecer os callbacks que o `sort`, o Jest e o Node chamam por você
- Escrever funções de alta ordem, como `daCategoria(categoria)`
- Entender a closure, a função que lembra as variáveis de onde nasceu
- Criar `memoize` para o frete e `debounce` para a busca
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **função de alta ordem** | uma função que recebe ou devolve outra função |
| **closure** | a função junto com as variáveis do lugar onde nasceu, como uma mochila que ela leva |
| **cache** | um lugar onde se guarda uma resposta para não calcular de novo |
| **memoize** | guardar o resultado de uma chamada e devolvê-lo quando os argumentos se repetem |
| **debounce** | esperar o usuário parar por um tempo antes de chamar a função |
| **função espiã** | uma função de teste que anota cada vez que foi chamada |

---

## A busca que dispara a cada letra

No app da Lojinha, que nasce no E30, o cliente digita "fone bluetooth" no campo de busca: são 14 letras e 14 buscas. Com 12 produtos, ninguém percebe.

Quando a busca for um pedido à API, o servidor da loja na internet (E19), são 14 viagens pela rede em 3 segundos. Quase todas por palavras que o cliente nem terminou de digitar.

O frete tem outro desperdício: o resumo do carrinho calcula de novo, com o mesmo subtotal e o mesmo CEP.

Hoje você escreve duas funções pequenas que resolvem os dois casos e as testa no terminal.

:::question
Como uma função pode lembrar algo entre uma chamada e outra sem usar uma variável global?
:::

---

## Função como valor

Entregar a receita a alguém é o mesmo que entregar o prato pronto?

---

## :icon[variable] Função é um valor

Uma função é uma receita com nome. Em JavaScript, essa receita é um valor, como um número ou um texto: você guarda numa constante, entrega para outra função e recebe de volta.

```javascript
const porPreco = (a, b) => a.preco - b.preco;     // guardada numa constante
const maisBaratos = [...produtos].sort(porPreco); // passada como argumento
```

A diferença entre entregar a função e chamá-la é um par de parênteses:

```javascript
[...produtos].sort(porPreco);   // entrega a função: o sort a chama para cada par
[...produtos].sort(porPreco()); // chama agora, sem a e b: TypeError
```

`porPreco` é a receita; `porPreco()` é cozinhar agora, sem os ingredientes `a` e `b`. O `sort` precisa da receita. É por isso que o objeto `comparadores` do E08 funciona: uma função cabe numa propriedade como qualquer valor.

---

## :icon[mouse-pointer-click] Callbacks: você entrega, outro código chama

Um **callback** é uma função que você entrega para outro código chamar. É o pedido deixado com o garçom: você diz o que fazer, e quem decide quando é a cozinha.

| Callback | Quem chama | Quando |
|---|---|---|
| comparador do `sort` | o `sort` | para cada par de itens |
| a arrow do `map` e do `filter` | o método | uma vez por item |
| `test('nome', fn)` | o Jest | quando roda os testes |
| `setTimeout(fn, 300)` | o Node | depois de 300 ms |

```javascript
const nomes = produtos.map((produto) => produto.nome);
```

```javascript
console.log(nomes.slice(0, 2)); // [ 'Fone Bluetooth', 'Caixa de Som Portátil' ]
setTimeout(() => console.log('300 ms depois'), 300); // o Node chama depois
```

O callback é a arrow: o `map` a chama uma vez por produto. No E23, o `onClick` dos botões do React também é um callback.

---

## Alta ordem

E se uma fábrica fizesse a peneira certa para cada coisa que você peneira?

---

## :icon[layers] Funções de alta ordem

Uma **função de alta ordem** recebe uma função, devolve uma função, ou as duas coisas. `map`, `filter`, `sort` e `find` recebem. Agora você escreve uma que devolve, como uma fábrica de peneiras: você diz a categoria, e ela entrega a peneira pronta para o `filter`.

```javascript
function daCategoria(categoria) {
  return (produto) => produto.categoria === categoria;
}

const deAudio = produtos.filter(daCategoria('audio'));
const deLivros = produtos.filter(daCategoria('livros'));
```

- `daCategoria('audio')` não filtra nada: ela **fabrica** o teste que o `filter` usa, `(produto) => produto.categoria === 'audio'`
- O código se lê como uma frase: "produtos filtrados da categoria áudio"
- Um único molde serve para as 4 categorias da Lojinha

---

## :icon[layers] Alta ordem na prática

Uma função que **recebe** outra, `contarSe`, e a fábrica que **devolve** testes, `daCategoria`, trabalhando juntas:

```javascript
function contarSe(lista, teste) {
  return lista.filter(teste).length;
}

contarSe(produtos, daCategoria('audio'));    // 3
contarSe(produtos, (p) => p.preco > 200);    // 4: qualquer teste serve

produtos.filter(daCategoria('livros')).map((p) => p.nome);
// ['Lógica de Programação', 'Livro de Receitas', 'Guia de Viagem']

produtos.some(daCategoria('jardim'));        // false: nenhum produto
```

- `contarSe` não sabe o que está contando: quem decide é o teste que você entrega
- O mesmo teste fabricado serve para `filter`, `some`, `every` e `find`

Repare: a função devolvida por `daCategoria` usa `categoria`, que pertence a `daCategoria`, mesmo depois que `daCategoria` terminou. Isso tem nome: closure.

---

## Closure

Como uma função pode lembrar algo entre uma chamada e outra?

---

## :icon[lock] Closure: a função que lembra

Uma **closure** é a função junto com as variáveis do lugar onde ela foi criada. Pense numa mochila: a função leva junto as variáveis de onde nasceu e continua enxergando o que está nelas, mesmo depois que a função de fora terminou.

```javascript
function criarContador() {
  let total = 0; // fica guardado na closure
  return () => {
    total = total + 1;
    return total;
  };
}

const tentativasDeCupom = criarContador();
tentativasDeCupom(); // 1
tentativasDeCupom(); // 2
```

`criarContador` já devolveu a arrow e acabou, mas `total` não sumiu: está na mochila da arrow, que ainda o enxerga e o altera. Na Lojinha, isso pode contar as tentativas de cupom inválido para bloquear depois da terceira.

---

## :icon[list-ordered] O contador em português

| Linha | O que ela diz |
|---|---|
| `let total = 0` | "crie um placar zerado" |
| `return () => { ... }` | "devolva uma função nova, que leva o placar na mochila" |
| `total = total + 1; return total;` | "a cada chamada, some 1 e diga quanto deu" |
| `const tentativasDeCupom = criarContador()` | "guarde a função devolvida" |
| `tentativasDeCupom()` | "chame a função: 1, depois 2" |

Quem guarda o `total` não é `criarContador`, que já terminou: é a arrow devolvida.

---

## :icon[shield] Estado privado e independente

Cada chamada de `criarContador` cria um `total` novo, numa closure nova:

```javascript
const tentativasDeCupom = criarContador();
const tentativasDeLogin = criarContador();

tentativasDeCupom(); // 1
tentativasDeCupom(); // 2
tentativasDeLogin(); // 1: outro total, outra closure
console.log(total);  // ReferenceError: total is not defined
```

- **Independente**: os contadores do cupom e do login não se misturam
- **Privado**: fora da função, ninguém lê nem altera `total`; só a arrow devolvida mexe nele
- **Duradouro**: o `total` vive enquanto alguém guardar a arrow

---

## :icon[lock] Uma mochila por chamada

:::center
![Diagrama: tentativasDeCupom guarda uma closure com total = 2 e tentativasDeLogin outra com total = 1; de fora, console.log(total) não alcança nenhuma das duas e dá ReferenceError](images/e10-closures.svg)
:::

Cada chamada de `criarContador` cria uma mochila com o seu `total`, e só a arrow devolvida enxerga o que está dentro.

É assim que uma função lembra algo entre uma chamada e outra sem variável global: ela carrega a closure com ela.

---

## Pense

:::question
O que aparece no terminal?

```javascript
function criarCarrinhoDeTeste() {
  let itens = 0;
  return {
    adicionar: () => { itens = itens + 1; },
    quantos: () => itens,
  };
}

const a = criarCarrinhoDeTeste();
const b = criarCarrinhoDeTeste();
a.adicionar();
a.adicionar();
b.adicionar();
console.log(a.quantos(), b.quantos());
```
:::

:::tip Resposta
`2 1`. Cada chamada de `criarCarrinhoDeTeste` cria o seu `itens`. As duas funções de `a` foram criadas na mesma chamada, então dividem o mesmo `itens`, a mesma mochila; as de `b` têm outro.
:::

---

## memoize

Alguém pergunta a mesma conta duas vezes. Você calcula de novo ou olha a anotação?

---

## :icon[database-zap] memoize: lembrar resultados

**Memoizar** é guardar o resultado de uma chamada para devolvê-lo de novo quando os argumentos se repetirem. Pense num caderno de contas: antes de calcular, você olha se a resposta já está anotada. O caderno é o **cache**. O `memoize` recebe uma função e devolve outra, com o cache na closure:

```javascript
// src/utils/funcoes.js
export function memoize(fn) {
  const cache = {}; // um por função memoizada
  return (...args) => {
    const chave = JSON.stringify(args); // [80,"01001000"]
    if (chave in cache) return cache[chave];
    const resultado = fn(...args);
    cache[chave] = resultado;
    return resultado;
  };
}
```

---

## :icon[list-ordered] O memoize em português

| Linha | O que ela diz |
|---|---|
| `memoize(fn)` | "receba a função original" |
| `const cache = {}` | "um caderno em branco, que fica na closure" |
| `return (...args) => {` | "devolva uma função nova; o rest do E07 junta os argumentos que vierem" |
| `JSON.stringify(args)` | "escreva os argumentos como texto: é a chave do caderno" |
| `if (chave in cache) return cache[chave]` | "a conta já está anotada? devolva a resposta anotada" |
| `fn(...args)` e `cache[chave] = resultado` | "senão, calcule com a original, espalhando os argumentos de volta, e anote" |

O `in` pergunta se o caderno já tem essa chave. Ele acha também um `0` guardado, o frete grátis.

---

## :icon[truck] Um frete simples para memoizar

Para ter o que memoizar, a Lojinha ganha hoje uma regra de frete. Ela é **pura**: mesmos argumentos, mesmo resultado, sem efeito.

```javascript
// src/regras/frete.js
import { memoize } from '../utils/funcoes.js';

export const FRETE_GRATIS_A_PARTIR_DE = 150;

// versão simples: o E13 acrescenta a validação do CEP e a tabela por região
export function calcularFrete(subtotal, cep) {
  if (subtotal >= FRETE_GRATIS_A_PARTIR_DE) {
    return 0;
  }
  if (cep[0] === '0' || cep[0] === '1') {
    return 9.9; // CEP de São Paulo
  }
  return 19.9; // resto do país
}
```

- A partir de R$ 150, o frete é grátis
- `cep[0]` é o primeiro caractere do CEP: começando com 0 ou 1, é de São Paulo

O `FRETE_GRATIS_A_PARTIR_DE` da aula 13 (E07) passa a morar aqui, exportado. Os valores ficam em reais, como o `preco` do catálogo.

---

## :icon[truck] memoize no frete

No fim de `src/regras/frete.js`, uma linha cria a versão que lembra:

```javascript
export const calcularFreteComCache = memoize(calcularFrete);
```

```javascript
calcularFreteComCache(80, '01001000'); // calcula e guarda: 9.9
calcularFreteComCache(80, '01001000'); // devolve da memória
calcularFreteComCache(80, '20040020'); // outra chave: calcula, 19.9
```

| Memoize | Não memoize |
|---|---|
| funções puras | funções com efeito: imprimir, salvar, enviar |
| chamadas repetidas com os mesmos argumentos | funções que leem a data de hoje ou sorteiam |
| cálculo caro ou, mais tarde, uma consulta à rede | argumentos que nunca se repetem |

Hoje o ganho é pequeno. Quando o frete vier de um serviço externo, ele evita viagens repetidas; e, quando o E13 completar `calcularFrete`, a versão com cache acompanha sem mudar uma linha.

---

## :icon[test-tube] Testando o cache com uma função espiã

Como provar que a segunda chamada não calculou? Com uma **função espiã**: um porteiro que anota cada pessoa que entra. Ela faz o mesmo que a função original e anota cada chamada.

```javascript
// src/utils/funcoes.test.js
import { memoize } from './funcoes.js';

test('memoize roda a original uma vez por argumentos', () => {
  const freteFalso = jest.fn(() => 9.9); // espiã: devolve 9.9 e anota cada chamada
  const comCache = memoize(freteFalso);
  comCache(80, '01001000');
  comCache(80, '01001000');
  comCache(80, '20040020');
  expect(freteFalso).toHaveBeenCalledTimes(2);
});
```

- `jest.fn(fn)` cria uma função que faz o mesmo que `fn` e anota cada chamada
- `toHaveBeenCalledTimes(2)`: três chamadas ao memoizado, duas à original; a segunda veio do cache
- A espiã ignora os argumentos, mas o `memoize` não: a chave continua sendo `[80,"01001000"]`

---

## debounce

Por que a porta do elevador espera um pouco antes de fechar?

---

## :icon[timer] debounce: esperar o usuário parar

O **debounce** adia a chamada até o usuário parar de chamar por um tempo. Pense na porta do elevador: cada pessoa que entra reinicia a espera, e a porta só fecha quando ninguém entra por alguns segundos. Cada nova chamada cancela a anterior e agenda de novo:

```javascript
// src/utils/funcoes.js, logo abaixo do memoize
export function debounce(fn, espera = 300) {
  let temporizador; // guardado na closure
  return (...args) => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => fn(...args), espera);
  };
}
```

- `setTimeout(fn, ms)` agenda `fn` para daqui a `ms` milissegundos e devolve um identificador
- `clearTimeout(id)` cancela o que foi agendado e ainda não rodou
- O `temporizador` mora na closure: todas as chamadas veem o mesmo e cancelam o agendamento anterior

O E18 mostra como o Node executa o que foi agendado.

---

## :icon[search] O debounce passo a passo

```javascript
const buscarComAtraso = debounce((termo) => console.log('buscando', termo), 300);
```

O cliente digita "fone", e cada letra chama `buscarComAtraso`:

:::center
![Animação: as letras f, o, n e e chegam em 0, 120, 250 e 380 ms; cada uma agenda a busca para 300 ms depois e cancela o agendamento anterior; só o último sobrevive e busca "fone" em 680 ms](images/e10-debounce.svg)
:::

Quatro letras, uma busca. Se o cliente para no meio, em "fo", por mais de 300 ms, a busca de "fo" acontece: o debounce espera pausas, não a palavra inteira. Com o elevador é igual: se ninguém entra por um tempo, a porta fecha, mesmo que mais gente chegue depois.

---

## :icon[terminal] O debounce no terminal

Ainda não há campo de busca: um script faz o papel do cliente, com uma letra a cada 120 ms, e a busca é um `filter` por nome, como no E09.

```javascript
// src/scripts/demo-debounce.js
import { produtos } from '../data/produtos.js';
import { debounce } from '../utils/funcoes.js';

const inicio = Date.now();
const buscar = debounce((termo) => {
  const achados = produtos.filter((p) => p.nome.toLowerCase().includes(termo));
  console.log(`${Date.now() - inicio} ms: "${termo}" acha ${achados.length}`);
}, 300);

const INTERVALO = 120; // ms entre uma letra e outra; troque por 400
const termos = ['f', 'fo', 'fon', 'fone'];
for (let i = 0; i < termos.length; i++) {
  setTimeout(() => buscar(termos[i]), i * INTERVALO);
}
```

- `Date.now()` dá a hora atual em milissegundos; `Date.now() - inicio` mostra quanto tempo passou
- O `for` agenda as quatro letras: em 0, 120, 240 e 360 ms

`node src/scripts/demo-debounce.js` imprime uma linha só, perto de 660 ms: `"fone" acha 2`, o fone e o microfone. Com `INTERVALO = 400`, um cliente lento, saem quatro buscas.

---

## :icon[split] Para saber mais: currying

:::info Para saber mais
**Currying** transforma uma função de vários argumentos numa sequência de funções de um argumento cada. É como deixar o endereço salvo no app de entrega: você informa o CEP uma vez, e depois só escolhe o pedido.

```javascript
const freteParaCep = (cep) => (subtotal) => calcularFrete(subtotal, cep);

const freteDaAna = freteParaCep('01001000');
freteDaAna(80);  // 9.9
freteDaAna(200); // 0: grátis a partir de R$ 150
```

`daCategoria(categoria)` segue o mesmo molde. Você vai encontrar currying em bibliotecas e em código funcional; use quando um argumento se repete em muitas chamadas. Não é obrigatório, e uma função comum de dois argumentos costuma ser mais fácil de ler.
:::

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Cannot read properties of undefined (reading 'preco')`, no `sort` | `sort(porPreco())`: a função rodou na hora, sem `a` e `b` | entregar a função, sem parênteses: `sort(porPreco)` |
| `undefined is not a function`, no `filter` | o `filter` recebeu `undefined`: faltou o `return` em `daCategoria` | devolver a arrow com `return` |
| `ReferenceError: total is not defined` | você leu de fora uma variável que mora na closure | só a função devolvida mexe nela |
| `Expected number of calls` e `Received number of calls` | a espiã contou chamadas diferentes do esperado | criar o `memoize` uma vez só; usar o `in` |

---

## :icon[triangle-alert] Erros comuns

:::warning
- `sort(porPreco())`: chama na hora, sem argumentos; entregue a função, `sort(porPreco)`
- Criar `memoize(...)` ou `debounce(...)` **dentro** de uma função que roda muitas vezes: cada chamada cria uma closure nova, com o cache e o temporizador vazios. Crie uma vez, no topo do arquivo
- Memoizar função com efeito ou que lê a data de hoje: a resposta guardada fica velha
- `if (cache[chave])` no lugar do `in`: o `0` do frete grátis conta como falso e é calculado de novo
- Esperar que dois contadores dividam o total: cada chamada de `criarContador` cria o seu
:::

---

## Resumo

:::summary
- Função é valor: `porPreco` entrega a função e `porPreco()` entrega o resultado
- Callback é a função que você entrega para o método, o Jest ou o Node chamar depois
- Função de alta ordem recebe ou devolve funções, como `daCategoria(categoria)`
- Closure é a função com as variáveis de onde nasceu: privadas, independentes e duradouras
- `memoize` guarda resultados de funções puras; `debounce` espera uma pausa antes de chamar
:::

Na aula 20, você divide um script que faz tudo em funções pequenas e usa recursão numa árvore de categorias.
