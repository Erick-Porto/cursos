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

## A busca que dispara a cada letra

No app da Lojinha, que nasce no E30, o cliente digita "fone bluetooth" no campo de busca: são 14 letras e 14 buscas. Com 12 produtos, ninguém percebe. Quando a busca for um pedido à API, como no E19, são 14 viagens pela rede em 3 segundos, quase todas por palavras que o cliente nem terminou de digitar.

O frete tem outro desperdício: o resumo do carrinho calcula de novo, com o mesmo subtotal e o mesmo CEP.

Hoje você escreve duas funções pequenas que resolvem os dois casos e as testa no terminal.

:::question
Como uma função pode lembrar algo entre uma chamada e outra sem usar uma variável global?
:::

---

## :icon[variable] Função é um valor

Em JavaScript, uma função é um valor como um número ou um texto: você guarda numa constante, passa como argumento e devolve de outra função.

```javascript
const porPreco = (a, b) => a.preco - b.preco;     // guardada numa constante
const maisBaratos = [...produtos].sort(porPreco); // passada como argumento
```

A diferença entre entregar a função e chamá-la é um par de parênteses:

```javascript
[...produtos].sort(porPreco);   // entrega a função: o sort a chama para cada par
[...produtos].sort(porPreco()); // chama agora, sem a e b: TypeError
```

`porPreco` é a função; `porPreco()` é o que ela devolve. O `sort` precisa da função. É por isso que o objeto `comparadores` do E08 funciona: uma função cabe numa propriedade como qualquer valor.

---

## :icon[mouse-pointer-click] Callbacks: você entrega, outro código chama

Um **callback** é uma função que você entrega para outro código chamar depois: você diz o que fazer, e quem chama decide quando.

| Callback | Quem chama | Quando |
|---|---|---|
| comparador do `sort` | o `sort` | para cada par de itens |
| a arrow do `map` e do `filter` | o método | uma vez por item |
| `test('nome', fn)` | o Jest | quando roda os testes |
| `setTimeout(fn, 300)` | o Node | depois de 300 ms |

```javascript
const nomes = produtos.map((produto) => produto.nome);
```

O callback é a arrow: o `map` a chama uma vez por produto, com o produto da vez. No E23, os botões do React também recebem callbacks, como o `onClick`.

---

## :icon[layers] Funções de alta ordem

Uma **função de alta ordem** recebe uma função, devolve uma função, ou as duas coisas. `map`, `filter`, `sort` e `find` recebem; agora você escreve uma que devolve:

```javascript
function daCategoria(categoria) {
  return (produto) => produto.categoria === categoria;
}

const deAudio = produtos.filter(daCategoria('audio'));
const deLivros = produtos.filter(daCategoria('livros'));
```

- `daCategoria('audio')` não filtra nada: ela **fabrica** o teste que o `filter` usa
- O código se lê como uma frase: "produtos filtrados da categoria áudio"
- Um único molde serve para as 4 categorias da Lojinha

Repare: a função devolvida usa `categoria`, que pertence a `daCategoria`, mesmo depois que `daCategoria` terminou. Isso tem nome.

---

## :icon[lock] Closure: a função que lembra

Uma **closure** é a função junto com as variáveis do lugar onde ela foi criada. Ela continua enxergando essas variáveis mesmo depois que a função de fora terminou.

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

`criarContador` já devolveu a arrow e acabou, mas `total` não sumiu: a arrow ainda o enxerga e o altera. Na Lojinha, isso pode contar as tentativas de cupom inválido para bloquear depois da terceira.

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

## :icon[lock] Uma caixa por chamada

:::center
![Diagrama: tentativasDeCupom guarda uma closure com total = 2 e tentativasDeLogin outra com total = 1; de fora, console.log(total) não alcança nenhuma das duas e dá ReferenceError](images/e10-closures.svg)
:::

Cada chamada de `criarContador` cria uma caixa com o seu `total`, e só a arrow devolvida enxerga o que está dentro. Essa é a resposta da abertura: a função lembra porque carrega a closure com ela.

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
`2 1`. Cada chamada de `criarCarrinhoDeTeste` cria o seu `itens`. As duas funções de `a` foram criadas na mesma chamada, então dividem o mesmo `itens`; as de `b` têm outro.
:::

---

## :icon[database-zap] memoize: lembrar resultados

**Memoizar** é guardar o resultado de uma chamada para devolvê-lo de novo quando os argumentos se repetirem. O `memoize` recebe uma função e devolve outra, com um cache na closure:

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

- `...args` é o rest do E07: junta os argumentos, e `fn(...args)` os espalha de volta
- A chave é o texto dos argumentos: mesmos argumentos, mesma chave
- `chave in cache` pergunta se o objeto já tem essa chave; acha também um `0` guardado, o frete grátis

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

Como provar que a segunda chamada não calculou? Com uma **função espiã**:

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

## :icon[timer] debounce: esperar o usuário parar

O **debounce** adia a chamada até o usuário parar de chamar por um tempo. Cada nova chamada cancela a anterior e agenda de novo:

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

Quatro letras, uma busca. Se o cliente para no meio, em "fo", por mais de 300 ms, a busca de "fo" acontece: o debounce espera pausas, não a palavra inteira.

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

`node src/scripts/demo-debounce.js` imprime uma linha só, perto de 660 ms: `"fone" acha 2`, o fone e o microfone. Com `INTERVALO = 400`, um cliente lento, saem quatro buscas.

---

## :icon[split] Currying (visão)

**Currying** transforma uma função de vários argumentos numa sequência de funções de um argumento cada. Com uma closure, você fixa o CEP do cliente uma vez:

```javascript
const freteParaCep = (cep) => (subtotal) => calcularFrete(subtotal, cep);

const freteDaAna = freteParaCep('01001000');
freteDaAna(80);  // 9.9
freteDaAna(200); // 0: grátis a partir de R$ 150
```

`daCategoria(categoria)` segue o mesmo molde. Você vai encontrar currying em bibliotecas e em código funcional; use quando um argumento se repete em muitas chamadas. Não é obrigatório, e uma função comum de dois argumentos costuma ser mais fácil de ler.

---

## :icon[triangle-alert] Erros comuns

:::warning
- `sort(porPreco())`: chama na hora, sem argumentos; entregue a função, `sort(porPreco)`
- Criar `memoize(...)` ou `debounce(...)` **dentro** de uma função que roda muitas vezes: cada chamada cria uma closure nova, com o cache e o temporizador vazios. Crie uma vez, no topo do arquivo
- Memoizar função com efeito ou que lê a data de hoje: a resposta guardada fica velha
- Esquecer o `return` em `daCategoria`: ela devolve `undefined` e o `filter` quebra com `undefined is not a function`
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
