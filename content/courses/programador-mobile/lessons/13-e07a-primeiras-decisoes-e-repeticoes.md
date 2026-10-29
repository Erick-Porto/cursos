---
title: Primeiras decisões e repetições
summary: Faça o código escolher com if e else e repetir com for e for...of, até somar o carrinho em centavos.
module: linguagem-js
duration_minutes: 40
objectives:
  - Escrever decisões com if, else if e else usando as comparações do E05
  - Repetir um trecho com for, sabendo o início, a condição e o passo
  - Percorrer uma lista com for...of, somando com acumulador e contando com contador
  - Escrever a subtotal do carrinho em centavos
---

# Primeiras decisões e repetições

Programador Mobile · Encontro E07 · Aula 13 de 89

---

## O que você vai aprender

:::goal
- Fazer o código escolher um caminho com `if`, `else if` e `else`
- Repetir um trecho com `for`: início, condição e passo
- Percorrer uma lista com `for...of`, somando com um **acumulador** e contando com um **contador**
- Escrever `subtotal`, a primeira regra de `src/regras/carrinho.js`
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **condição** | uma pergunta de sim ou não: `total >= 150` dá `true` ou `false` |
| **bloco** | o trecho entre chaves `{ }`: roda inteiro, ou não roda |
| **lista** (array) | uma fileira de gavetas numeradas a partir do 0, um item em cada |
| **laço** | um trecho que se repete; cada repetição é uma **volta** |
| **acumulador** | a variável que vai somando a cada volta, como o total do carrinho |
| **contador** | a variável que soma 1 cada vez que algo acontece |

---

## O código que só anda para frente

Até aqui, seus scripts rodaram de cima para baixo, cada linha uma vez. Uma loja precisa de mais duas coisas:

- **Escolher**: frete grátis ou "faltam R$ 20,20"? 3 ou 6 parcelas?
- **Repetir**: somar um carrinho com 2 itens ou com 20, sem saber antes quantos virão

Hoje você vê o essencial das duas: `if` para decidir e `for` para repetir. As funções da aula 14 e as listas do E08 usam isso o tempo todo. No E13 e no E14, as duas voltam com as formas avançadas.

:::question
Pense na última compra que você fez num app. Quantas decisões ele tomou antes de mostrar o total?
:::

---

## Decisões

Numa bifurcação da estrada, o que decide para que lado você vai?

---

## :icon[split] if: só quando a condição vale

O **`if`** (em inglês, "se") é uma bifurcação na estrada: a **condição**, entre parênteses, escolhe o caminho. O bloco entre chaves só roda quando a condição dá `true`.

```javascript
const FRETE_GRATIS_A_PARTIR_DE = 150;
const totalDoCarrinho = 199.9;
let aviso = 'Frete calculado pelo CEP';

if (totalDoCarrinho >= FRETE_GRATIS_A_PARTIR_DE) {
  aviso = 'Você ganhou frete grátis';
}
console.log(aviso);
```

- Leia assim: "**se** o total for maior ou igual a 150, troque o aviso"
- Com 199,90, o aviso muda; com 129,80, o bloco não roda e fica o texto inicial
- A condição usa as comparações do E05: `>=`, `<`, `===`, `!==`
- As chaves `{ }` marcam o **bloco**: tudo o que está dentro delas roda junto, ou nada roda
- `FRETE_GRATIS_A_PARTIR_DE`, todo em maiúsculas, é um valor fixo da regra da loja, como o `PERCENTUAL_PIX` do E05

---

## :icon[git-fork] else: o outro caminho

O **`else`** (em inglês, "senão") é o outro lado da bifurcação: quando a condição dá `false`, roda o bloco do `else`. Com os dois, exatamente um dos blocos roda:

```javascript
let aviso;
if (totalDoCarrinho >= FRETE_GRATIS_A_PARTIR_DE) {
  aviso = 'Você ganhou frete grátis';
} else {
  const falta = FRETE_GRATIS_A_PARTIR_DE - totalDoCarrinho;
  aviso = `Faltam ${formatarPreco(falta)} para o frete grátis`;
}
```

| `totalDoCarrinho` | Aviso no terminal |
|---|---|
| 199.9 | Você ganhou frete grátis |
| 150 | Você ganhou frete grátis |
| 129.8 | Faltam R$ 20,20 para o frete grátis |

`let aviso;` cria a caixa vazia, e cada caminho põe nela o seu texto. A linha do 150 confere a **borda**: com `>=`, o valor exato já ganha o frete. Com `>`, ele ficaria de fora.

---

## :icon[binary] Condições com &&, || e !

A condição pode juntar comparações com os operadores lógicos do E05. `produtos[0]` é o primeiro produto de `src/data/produtos.js`, o Fone Bluetooth:

```javascript
const produto = produtos[0]; // destaque: true, avaliacao: 4.6, preco: 199.9

if (produto.destaque === true && produto.avaliacao >= 4.5) {
  console.log(`${produto.nome}: queridinho da loja`);
}
if (produto.preco < 50 || produto.categoria === 'livros') {
  console.log(`${produto.nome}: sugestão de presente`);
}
```

- `&&`: entra só se as duas comparações valem. O Fone entra
- `||`: entra se pelo menos uma vale. O Fone custa mais de 50 e é de áudio: não entra
- `!`: inverte. `!produto.destaque` vale para quem **não** está em destaque

---

## :icon[split] Decisões na prática

**Caso 1: o CEP que não tem o formato.** No E06, o `ehCepValido` do laboratório só respondia `true` ou `false`. Agora o `if` decide o que fazer:

```javascript
const cep = '0131-0100';
if (ehCepValido(cep)) {
  console.log(`Frete calculado para o CEP ${cep}`);
} else {
  console.log('Confira o CEP: são 8 dígitos');
}
// Confira o CEP: são 8 dígitos
```

**Caso 2: a quantidade que não é número.** No E05, a conversão falhava e o `NaN` seguia para a conta:

```javascript
const qtd = Number(process.argv[2]);
if (Number.isNaN(qtd)) {
  console.log('Digite a quantidade em números');
} else {
  console.log(`${qtd} no carrinho`);
}
```

Com `2` no comando, sai `2 no carrinho`; com `dois`, sai o aviso.

---

## Faixas

Em quantas vezes a loja deixa parcelar um livro de R$ 59,90? E um jogo de panelas?

---

## :icon[list-ordered] else if: faixas em ordem

O **`else if`** ("senão, se") testa outra condição quando a anterior deu `false`, como uma estrada com várias saídas. Quantas parcelas sem juros a Lojinha oferece, pelo preço:

```javascript
function maximoDeParcelas(preco) {
  if (preco < 50) {
    return 1;
  } else if (preco < 300) {
    return 3;
  } else if (preco < 1000) {
    return 6;
  } else {
    return 10;
  }
}
```

::::columns
:::col
![Diagrama: as quatro faixas de maximoDeParcelas lado a lado; abaixo de R$ 50 dá 1x, de 50 a 300 dá 3x, de 300 a 1.000 dá 6x e o else dá 10x; o Fone de R$ 199,90 cai na faixa de 3x](images/e07-faixas-de-parcelas.svg)
:::
:::col
- O JavaScript testa de cima para baixo e para no **primeiro** `true`
- Por isso `preco < 300` já quer dizer "de 50 a 299,99": a faixa de baixo saiu antes
- O `else` final pega todo o resto: R$ 1.000 ou mais
:::
::::

---

## :icon[list-ordered] Faixas na prática

A mesma função, com preços de cada faixa:

```javascript
console.log(maximoDeParcelas(49.9));  // 1: um cabo, abaixo de R$ 50
console.log(maximoDeParcelas(59.9));  // 3: o Livro de Receitas
console.log(maximoDeParcelas(199.9)); // 3: o Fone Bluetooth
console.log(maximoDeParcelas(300));   // 6: R$ 300 em ponto já é da faixa de cima
console.log(maximoDeParcelas(459.9)); // 6: o Jogo de Panelas
console.log(maximoDeParcelas(1200));  // 10: o else pega o resto
```

- O Fone Bluetooth, de R$ 199,90, cai na segunda faixa: 3 parcelas
- Com 300, a pergunta `300 < 300` dá `false`: a função segue para a faixa seguinte
- O `return` entrega o número e encerra a função: as faixas de baixo nem são testadas

---

## Pense

:::question
Alguém "organizou" a função pondo a faixa maior primeiro:

```javascript
if (preco < 1000) {
  return 6;
} else if (preco < 300) {
  return 3;
} else if (preco < 50) {
  return 1;
} else {
  return 10;
}
```

Quantas parcelas aparecem para o Livro de Receitas, de R$ 59,90? E para o Fone Bluetooth, de R$ 199,90? Algum produto ainda recebe 1 ou 3?
:::

:::tip Resposta
6 para os dois. Todo preço abaixo de 1000 entra no primeiro `if`, e os `else if` seguintes nunca rodam: o 1 e o 3 viraram código morto. Com `<`, ordene da faixa menor para a maior. Um teste com um preço de cada faixa pega esse erro na hora.
:::

---

## Listas

Como o carrinho guarda 2, 7 ou 20 produtos num nome só?

---

## :icon[list] O que é uma lista

Uma **lista**, em inglês *array*, guarda vários valores em ordem, num nome só. Pense numa fileira de gavetas numeradas a partir do 0: cada item mora numa gaveta. As quatro categorias da Lojinha, só pelo nome:

```javascript
const categorias = ['audio', 'casa', 'esporte', 'livros'];
console.log(categorias[0]);     // audio
console.log(categorias[3]);     // livros
console.log(categorias.length); // 4
```

| Parte | O que ela diz |
|---|---|
| `[ ... ]` | "uma lista com estes itens, separados por vírgula" |
| `categorias[0]` | "abra a gaveta 0": o primeiro item |
| `.length` | "quantos itens a lista tem" |

A última gaveta é a de número `length - 1`: com 4 itens, a 3. A gaveta 4 não existe, e ler `categorias[4]` dá `undefined`.

---

## :icon[shopping-cart] Repetir sem copiar

O carrinho é uma lista de fichas: cada item tem `id`, `nome`, `preco` e `qtd`.

```javascript
const itens = [
  { id: 1, nome: 'Fone Bluetooth', preco: 199.9, qtd: 2 },
  { id: 4, nome: 'Luminária de Mesa', preco: 89.9, qtd: 1 },
];
itens[0].nome; // 'Fone Bluetooth'
itens.length;  // 2

const total = itens[0].preco * itens[0].qtd + itens[1].preco * itens[1].qtd;
```

`itens[0].nome` abre a gaveta 0 e lê o campo `nome` da ficha. A conta de baixo só serve para 2 itens: com 7, cinco ficam de fora; com o carrinho vazio, `itens[0]` nem existe. O E08 aprofunda os arrays; hoje, o que importa é ler por posição e percorrer.

:::question
Como escrever a conta de **um** item e fazer o JavaScript repeti-la para cada item, sejam 0, 2 ou 20?
:::

---

## Laços

Como conferir um carrinho de 20 itens sem escrever 20 linhas?

---

## :icon[repeat] for: início, condição e passo

Um **laço** repete um bloco enquanto a condição vale, como conferir o carrinho item por item, até acabar. Cada repetição é uma **volta**. O **`for`** é o laço mais usado. Aqui, ele desenha as estrelas da avaliação no terminal:

```javascript
function estrelasDaNota(nota) {
  const cheias = Math.round(nota);
  let estrelas = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= cheias) {
      estrelas += '*';
    } else {
      estrelas += '-';
    }
  }
  return estrelas;
}
console.log(estrelasDaNota(4.4)); // ****-
```

| Parte | No código | Pergunta |
|---|---|---|
| Início | `let i = 1` | de onde parto? |
| Condição | `i <= 5` | continuo? |
| Passo | `i++` | como avanço? |

`estrelas += '*'` junta mais uma estrela ao texto, a cada volta em que `i` não passou da nota.

---

## :icon[table] Teste de mesa: volta a volta

Para entender um laço, siga as variáveis no papel, volta a volta: é o **teste de mesa**. Em `estrelasDaNota(4.4)`, `cheias` vale 4:

| `i` | `i <= 5`? | `i <= cheias`? | `estrelas` depois da volta |
|---|---|---|---|
| 1 | sim | sim | `'*'` |
| 2 | sim | sim | `'**'` |
| 3 e 4 | sim | sim | `'***'`, depois `'****'` |
| 5 | sim | não | `'****-'` |
| 6 | não | | o laço termina |

A condição é testada **antes** de cada volta. Quando ela fica falsa, o JavaScript segue para a linha depois do `}`: o `return estrelas`.

---

## :icon[list] for...of: um item por volta

Quando você precisa de cada item, e não da posição, o **`for...of`** ("para cada... de") entrega o item da volta direto: "para cada item do carrinho, faça isto".

```javascript
// for clássico: índice, condição e passo por sua conta
for (let i = 0; i < itens.length; i++) {
  console.log(itens[i].nome);
}

// for...of: o JavaScript entrega cada item, na ordem
for (const item of itens) {
  console.log(item.nome);
}
```

- Os dois imprimem `Fone Bluetooth` e `Luminária de Mesa`, um por linha
- `item` é uma constante nova a cada volta: `const` é o certo aqui
- Sem índice, não existe `<=` para errar
- Precisa da posição, como em "item 1 de 3"? Use o `for` clássico

---

## Acumulador

Como o caixa do mercado chega ao total, passando item por item?

---

## :icon[calculator] Acumulador: somando o carrinho

Um **acumulador** é uma variável que nasce antes do laço e cresce a cada volta, como o visor do caixa do mercado, que vai somando item por item. Com o `for` e as posições:

```javascript
let total = 0; // começa no neutro da soma
for (let i = 0; i < itens.length; i++) {
  total += itens[i].preco * itens[i].qtd;
}
console.log(total); // 489.70000000000005
```

- A cada volta: "some ao total o preço vezes a quantidade do item da posição `i`"
- As posições vão de `0` a `itens.length - 1`: por isso `<`, e não `<=`
- Carrinho vazio: `0 < 0` é falso, nenhuma volta acontece e o total fica `0`
- `total += x` é o mesmo que `total = total + x`, como no E05

E o `489.70000000000005`? É o ponto flutuante do E05: somar reais deixa sobra.

---

## :icon[coins] subtotal em centavos

A solução do E05 vale aqui: acumule **centavos inteiros** e volte para reais uma vez, no fim. Esta é a primeira regra de `src/regras/carrinho.js`:

```javascript
import { paraCentavos, paraReais } from './precos.js';

export function subtotal(itens) {
  let centavos = 0;
  for (const item of itens) {
    centavos += paraCentavos(item.preco) * item.qtd;
  }
  return paraReais(centavos);
}
```

`paraCentavos(199.9)` dá `19990`, um inteiro sem sobra. Com 2 fones e 1 luminária, `subtotal(itens)` devolve `489.7`. Você escreve esta função e os testes dela no laboratório.

---

## :icon[coins] O acumulador, volta a volta

:::center
![Animação: em subtotal com for...of, centavos começa em 0, ganha 39980 na volta do Fone (2 de 19990) e 8990 na volta da Luminária; sem mais itens, o laço termina e a função devolve paraReais(48970), 489.7](images/e07-subtotal-volta-a-volta.svg)
:::

`centavos` começa em 0. Na volta do Fone, ganha 39980 (2 de 19990); na da Luminária, 8990. Sem mais itens, o laço termina e a função devolve `paraReais(48970)`: `489.7`.

---

## Contador

Como a catraca do ônibus sabe quantas pessoas já passaram?

---

## :icon[hash] Contador: quantos atendem à condição

Um **contador** soma sempre 1, e só quando algo acontece, como a catraca do ônibus: cada pessoa que passa conta uma. Ele nasce em 0, antes do laço, e um `if` dentro do laço decide se aquela volta conta: `if (condição) { contador++; }`.

| | Acumulador | Contador |
|---|---|---|
| Começa em | `0` | `0` |
| Cada volta soma | um valor, como `preco * qtd` | `1`, se a condição vale |
| Na Lojinha | o subtotal do carrinho | 4 produtos em destaque |

O acumulador responde "quanto?"; o contador responde "quantos?".

---

## :icon[hash] Contador na prática

**Caso 1: quantos produtos da vitrine estão em destaque?**

```javascript
let emDestaque = 0;
for (const produto of produtos) {
  if (produto.destaque === true) {
    emDestaque++;
  }
}
console.log(`${emDestaque} produtos em destaque`); // 4
```

**Caso 2: quantos custam mais de R$ 200?** A mesma forma, com outra condição:

```javascript
let caros = 0;
for (const produto of produtos) {
  if (produto.preco > 200) {
    caros++;
  }
}
console.log(`${caros} produtos acima de R$ 200`); // 4 produtos acima de R$ 200
```

O `if` dentro do `for` decide, volta a volta, se aquele produto conta.

---

## Pratique

:::example Desafio
O carrinho tem 2 Fones Bluetooth (R$ 199,90), 1 Luminária de Mesa (R$ 89,90) e 6 Garrafas Térmicas (R$ 79,90). Com um `for...of` só:

1. Some as **unidades**, o número que aparece no ícone do carrinho
2. Conte quantas **linhas** custam mais de R$ 100 por unidade
:::

:::tip Resposta
```javascript
let unidades = 0;
let caros = 0;
for (const item of itens) {
  unidades += item.qtd;
  if (item.preco > 100) {
    caros++;
  }
}
// unidades: 9; caros: 1, só o Fone
```

Um acumulador e um contador no mesmo laço. Os dois nascem **antes** do `for`: dentro dele, voltariam a 0 a cada volta. No E09, a soma das unidades vira a regra `contarItens`.
:::

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Cannot read properties of undefined (reading 'preco')` | o laço passou do fim da lista | use `i < itens.length`, nunca `<=` |
| `NaN` no total | `for...in` no lugar de `for...of`, ou um campo com o nome errado | troque `in` por `of`; confira o nome do campo |
| `489.70000000000005` | a soma foi feita em reais | some centavos, com `paraCentavos` |
| o terminal não volta | laço sem fim: a condição nunca fica falsa | <kbd>Ctrl</kbd> + <kbd>C</kbd>; confira a condição e o passo |

---

## :icon[triangle-alert] Erros comuns

:::warning
- `if (status = 'pago')`, com um `=` só: atribui em vez de comparar; compare com `===`
- `else if` fora de ordem: a faixa mais larga primeiro engole as outras
- `i <= itens.length`: uma volta a mais, e `itens[2].preco` quebra com `Cannot read properties of undefined`
- Acumulador ou contador criado **dentro** do laço: volta a 0 a cada volta
- Somar reais: `489.70000000000005`; some centavos
- `for (const item in itens)`, com `in`: `item` vira a posição em texto e a soma dá `NaN`; o certo é `of`
:::

---

## Resumo

:::summary
- `if` executa um bloco quando a condição dá `true`; `else` é o outro caminho
- `else if` testa faixas de cima para baixo e para no primeiro acerto: ordene da menor para a maior
- Uma lista guarda itens em gavetas numeradas a partir do 0; `length` diz quantos são
- O `for` tem início, condição e passo; a condição é testada antes de cada volta
- `for...of` entrega cada item da lista, sem índice
- Acumulador soma valores, contador soma 1, e os dois nascem antes do laço; dinheiro, sempre em centavos
:::

---

## :icon[arrow-right] Próximos passos

Na aula 14, você junta decisões e laços dentro de **funções** e escreve as regras do carrinho:

- :icon[square-function] parâmetros, retorno e escopo
- :icon[shopping-cart] `adicionarItem`, `removerItem` e `alterarQuantidade` em `src/regras/carrinho.js`, com testes
- :icon[terminal] um script que simula uma compra e imprime o carrinho

No E13 e no E14, decisões e laços voltam a fundo: `switch`, `while`, `break` e laços dentro de laços.
