---
title: Closures e funções de alta ordem
summary: Funções como valor, callbacks e closures que lembram dados, com memoize no frete e debounce na busca.
module: linguagem-js
duration_minutes: 40
objectives:
  - Passar funções como valor e reconhecer callbacks na tela
  - Escrever funções de alta ordem que recebem ou devolvem funções
  - Explicar uma closure com criarContador
  - Implementar memoize e debounce e dizer quando usar cada um
---

# Closures e funções de alta ordem

Programador Mobile: Módulo Específico · Encontro E35 · Aula 51 de 71

---

## O que você vai aprender

:::goal
- Tratar uma função como valor: guardar, passar e devolver
- Reconhecer os callbacks que a tela chama por você
- Escrever funções de alta ordem, como `daCategoria(categoria)`
- Entender a closure, a função que lembra as variáveis de onde nasceu
- Criar `memoize` para o frete e `debounce` para a busca
:::

---

## A busca que dispara a cada letra

O cliente digita "fone bluetooth" no campo de busca da Lojinha: são 14 letras e 14 buscas. Hoje elas filtram 12 produtos e ninguém percebe. No E38, cada busca vira um pedido à API: 14 viagens pela rede em 3 segundos, quase todas por palavras que o cliente nem terminou de digitar.

No Carrinho, o frete é recalculado a cada renderização, com o mesmo subtotal e o mesmo CEP.

Hoje você escreve duas funções pequenas que resolvem os dois casos.

:::question
Como uma função pode lembrar algo entre uma chamada e outra sem estado do React e sem variável global?
:::

---

## :icon[variable] Função é um valor

Em JavaScript, uma função é um valor como um número ou um texto: você guarda numa constante, passa como argumento e devolve de outra função.

```javascript
const porPreco = (a, b) => a.preco - b.preco; // guardada numa constante
const maisBaratos = [...produtos].sort(porPreco); // passada como argumento
```

Na tela, a diferença entre entregar a função e chamá-la é um par de parênteses:

```jsx
<Botao titulo="Comprar" onPress={comprar} />   // entrega a função: roda no toque
<Botao titulo="Comprar" onPress={comprar()} /> // chama agora, durante a renderização
```

`comprar` é a função; `comprar()` é o que ela devolve. O `onPress` precisa da função.

---

## :icon[mouse-pointer-click] Callbacks: você entrega, o app chama

Um **callback** é uma função que você entrega para outro código chamar depois. Você escreve o que fazer; quem decide quando é o componente, a lista ou o motor.

| Callback | Quem chama | Quando |
|---|---|---|
| `onPress` | o `Pressable` | no toque |
| `onChangeText` | o `TextInput` | a cada letra, com o texto novo |
| `renderItem` | a `FlatList` | para cada item que vai aparecer |
| comparador do `sort` | o `sort` | para cada par de itens |
| `setTimeout(fn, 300)` | o motor | depois de 300 ms |

```jsx
<TextInput value={termo} onChangeText={setTermo} />
```

Aqui o callback é o próprio `setTermo`: a cada letra, o `TextInput` o chama com o texto digitado.

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

`criarContador` já devolveu a arrow e acabou, mas `total` não sumiu: a arrow ainda o enxerga e o altera. No app, isso conta as tentativas de cupom inválido para bloquear depois da terceira.

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
![Diagrama: tentativasDeCupom guarda uma closure com total = 2 e tentativasDeLogin outra com total = 1; de fora, console.log(total) não alcança nenhuma das duas e dá ReferenceError](images/e35-closures.svg)
:::

Cada chamada de `criarContador` cria uma caixa com o seu `total`, e só a arrow devolvida enxerga o que está dentro. Essa é a resposta da abertura: a função lembra porque carrega a closure com ela.

---

## Pense

:::question
O que aparece no console?

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

- `...args` aceita qualquer número de argumentos e os repassa com `fn(...args)`
- A chave é o texto dos argumentos: mesmos argumentos, mesma chave
- O `in` acha também o `null` guardado, o resultado de um CEP inválido

---

## :icon[truck] memoize no frete

O `calcularFrete(subtotal, cep)` do E26 é **puro**: mesmos argumentos, mesmo resultado, sem efeito. Por isso pode ser memoizado:

```javascript
// src/regras/frete.js, no fim, depois de calcularFrete
export const calcularFreteComCache = memoize(calcularFrete);
```

```javascript
calcularFreteComCache(80, '01001000'); // calcula e guarda
calcularFreteComCache(80, '01001000'); // devolve da memória
calcularFreteComCache(80, '20040020'); // outra chave: calcula
```

| Memoize | Não memoize |
|---|---|
| funções puras | funções com efeito: salvar, navegar, mostrar toast |
| chamadas repetidas com os mesmos argumentos | funções que leem a data de hoje ou sorteiam |
| cálculo caro ou, mais tarde, uma consulta à rede | argumentos que nunca se repetem |

Hoje o ganho é pequeno; quando o frete vier de um serviço externo, ele evita viagens repetidas.

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

O E37 mostra como o motor executa o que foi agendado.

---

## :icon[search] O debounce passo a passo

```javascript
const buscarComAtraso = debounce((termo) => console.log('buscando', termo), 300);
```

O cliente digita "fone" chamando `buscarComAtraso` a cada letra:

:::center
![Animação: as letras f, o, n e e chegam em 0, 120, 250 e 380 ms; cada uma agenda a busca para 300 ms depois e cancela o agendamento anterior; só o último sobrevive e busca "fone" em 680 ms](images/e35-debounce.svg)
:::

Quatro letras, uma busca. Se o cliente para no meio, em "fo", por mais de 300 ms, a busca de "fo" acontece: o debounce espera pausas, não a palavra inteira.

---

## :icon[split] Currying (visão)

**Currying** transforma uma função de vários argumentos numa sequência de funções de um argumento cada. Com uma closure, você fixa o CEP do cliente uma vez:

```javascript
const freteParaCep = (cep) => (subtotal) => calcularFrete(subtotal, cep);

const freteDaAna = freteParaCep('01001000');
freteDaAna(80);  // frete do carrinho de R$ 80
freteDaAna(200); // 0: grátis a partir de R$ 150
```

`daCategoria(categoria)` segue o mesmo molde. Você vai encontrar currying em bibliotecas e em código funcional; no app, use quando um argumento se repete em muitas chamadas. Não é obrigatório, e uma função comum de dois argumentos costuma ser mais fácil de ler.

---

## :icon[triangle-alert] Erros comuns

:::warning
- `onPress={comprar()}`: chama durante a renderização; entregue a função, `onPress={comprar}`
- Criar `memoize(...)` ou `debounce(...)` **dentro** do componente: cada renderização cria uma closure nova, com o cache e o temporizador vazios
- Memoizar função com efeito ou que lê a data de hoje: a resposta guardada fica velha
- Esquecer o `return` em `daCategoria`: ela devolve `undefined` e o `filter` quebra com `undefined is not a function`
- Esperar que dois contadores dividam o total: cada chamada de `criarContador` cria o seu
:::

---

## Resumo

:::summary
- Função é valor: `comprar` entrega a função e `comprar()` entrega o resultado
- Callback é a função que você entrega para o componente, a lista ou o motor chamar depois
- Função de alta ordem recebe ou devolve funções, como `daCategoria(categoria)`
- Closure é a função com as variáveis de onde nasceu: privadas, independentes e duradouras
- `memoize` guarda resultados de funções puras; `debounce` espera uma pausa antes de chamar
:::

---

## Próximos passos

Na aula 52, você:

- Descobre por que `onPress={pedido.cancelar}` derruba o app e conserta com arrow ou `bind`
- Transforma o debounce no hook `useDebounce`, que é uma closure a cada renderização
- Organiza `memoize`, `debounce` e o hook em módulos com `export` e `import`

No laboratório, a busca da Início espera 300 ms de pausa e o frete passa a ser memoizado, com testes.
