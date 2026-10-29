---
title: "Laços a fundo: while, break e continue"
summary: while, do...while, break, continue e acumuladores nas regras da Lojinha, e quando o laço vence o método de array.
module: classes-e-controle
duration_minutes: 40
objectives:
  - Escolher entre for, while e do...while pelo jeito de repetir
  - Levar vários contadores e acumuladores numa passada só
  - Controlar as voltas com break, continue e return
  - Decidir entre laço e método de array e evitar o laço infinito
---

# Laços a fundo: while, break e continue

Programador Mobile · Encontro E14 · Aula 27 de 89

---

## O que você vai aprender

:::goal
- Repetir sem saber quantas voltas serão, com `while` e `do...while`
- Levar vários **acumuladores** no mesmo laço
- Parar ou pular uma volta com `break` e `continue`, e mudar a regra com uma palavra
- Escolher entre laço e método de array, e reconhecer o laço infinito antes de rodar
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **laço** | um trecho de código que se repete; cada repetição é uma **volta** |
| **`while`** | o laço que repete **enquanto** uma condição for verdadeira (*while* quer dizer "enquanto") |
| **acumulador** | uma variável que guarda o resultado parcial e muda a cada volta |
| **`break`** | a palavra que encerra o laço na hora (*break*, quebrar) |
| **`continue`** | a palavra que pula o resto da volta e vai para a próxima (*continue*, continuar) |
| **laço infinito** | um laço que nunca para, porque a condição nunca fica falsa |

---

## Repetir sem uma lista na mão

Desde o E07 você percorre listas com `for` e `for...of`; no E09, com `map`, `filter` e `reduce`. Em todos eles, o número de voltas é o tamanho da lista.

Algumas perguntas da Lojinha não têm lista nenhuma:

- Quantas unidades faltam para o frete grátis?
- Qual é o próximo dia útil para despachar o pedido?
- Quais presentes da lista de desejos cabem num vale de R$ 350, na ordem?

:::question
Como repetir um trecho quando ninguém sabe, antes de começar, quantas voltas serão?
:::

---

## O while

Para ganhar o frete grátis, quando você para de pôr coisas no carrinho?

---

## :icon[refresh-cw] while: repete enquanto a condição vale

Um **laço** é como conferir o carrinho item por item, até acabar. O **`while`** é o laço que não precisa de lista: ele repete o bloco **enquanto** a condição for verdadeira.

```javascript
let centavos = 8990;        // R$ 89,90 no carrinho
while (centavos < 15000) {  // enquanto não chega a R$ 150
  centavos += 5990;         // põe mais um livro de R$ 59,90
}
console.log(centavos);      // 20970
```

- Antes de cada volta, o `while` faz a pergunta da condição: "ainda falta?"
- Se a resposta é sim, ele roda o bloco entre `{ }` e pergunta de novo
- Se é não, ele pula o bloco e segue para a linha depois do `}`

Aqui, foram duas voltas. Ninguém precisou contar antes.

---

## :icon[truck] while na prática: o frete grátis

A mesma ideia vira uma regra em `src/regras/frete.js`, junto do `FRETE_GRATIS_A_PARTIR_DE` do E10. Ela responde: quantas unidades deste produto faltam para o frete grátis?

```javascript
export function unidadesParaFreteGratis(subtotal, preco) {
  const meta = paraCentavos(FRETE_GRATIS_A_PARTIR_DE);
  let centavos = paraCentavos(subtotal);
  let unidades = 0;
  while (centavos < meta) {
    centavos += paraCentavos(preco);
    unidades++;
  }
  return unidades;
}

unidadesParaFreteGratis(89.9, 59.9); // 2: "leve mais 2 e o frete sai grátis"
unidadesParaFreteGratis(200, 59.9);  // 0: o carrinho já passou de R$ 150
```

Ninguém sabe de antemão quantas voltas serão: depende do carrinho e do preço.

---

## :icon[list-ordered] unidadesParaFreteGratis em português

| Linha | O que ela diz |
|---|---|
| `const meta = ...` | "a meta é R$ 150, em centavos: 15000" |
| `let centavos = ...` | "comece com o que já está no carrinho" |
| `let unidades = 0` | "ainda não pus nenhuma unidade" |
| `while (centavos < meta) {` | "enquanto não chegou à meta, faça:" |
| `centavos += paraCentavos(preco)` | "ponha mais uma unidade no carrinho" |
| `unidades++` | "conte mais uma" |
| `return unidades` | "devolva quantas foram" |

Com R$ 200 no carrinho, a condição nasce falsa e o laço roda **zero** vezes. A conta vai em centavos, como manda a regra do E05.

---

## :icon[table] Teste de mesa do while

Siga as variáveis volta a volta, no papel: é o **teste de mesa** do E07. Em `unidadesParaFreteGratis(89.9, 59.9)`, a meta é 15000 e cada unidade soma 5990:

| Volta | `centavos` antes | `centavos < 15000`? | Depois da volta |
|---|---|---|---|
| 1 | 8990 | sim | 14980 e `unidades` 1 |
| 2 | 14980 | sim | 20970 e `unidades` 2 |
| 3 | 20970 | não | o laço termina |

A condição é testada **antes** de cada volta. Quando ela fica falsa, o código segue para a linha depois do `}`: o `return unidades`, que devolve 2.

---

## :icon[arrow-left-right] for e while: o mesmo laço, arrumado de outro jeito

::::columns
:::col
```javascript
for (let i = 0; i < 3; i++) {
  console.log(produtos[i].nome);
}
```
:::
:::col
```javascript
let i = 0;
while (i < 3) {
  console.log(produtos[i].nome);
  i++;
}
```
:::
::::

Os dois imprimem os 3 primeiros nomes. O `for` junta início, condição e passo numa linha só; no `while`, eles ficam espalhados.

- Há um contador que anda até um limite conhecido? `for`: o passo fica no cabeçalho e não se perde
- A parada depende de algo que muda lá dentro, como os centavos? `while`
- No `while`, esquecer o `i++` deixa o `i` parado e o laço não termina

---

## O do...while

Quantas vezes, no mínimo, você toca a campainha de alguém?

---

## :icon[calendar-check] do...while: o corpo roda pelo menos uma vez

O **`do...while`** (*faça... enquanto*) primeiro **faz** a volta e só depois pergunta se repete. É como tocar a campainha: você toca pelo menos uma vez e toca de novo enquanto ninguém atende.

```javascript
let toques = 0;
do {
  toques++;                // toca a campainha
} while (toques < 1);      // a pergunta vem depois da volta
console.log(toques);       // 1: mesmo com a condição falsa, rodou uma vez
```

| `while` | `do...while` |
|---|---|
| pergunta **antes** de cada volta | pergunta **depois** de cada volta |
| pode rodar zero vezes | roda pelo menos uma vez |

Repare no `;` depois do `while (...)` final: ele fecha o `do...while`.

---

## :icon[calendar-clock] do...while na prática: o dia de despacho

Na Lojinha, o pedido nunca é despachado no mesmo dia. A data anda **pelo menos** um dia e continua andando enquanto não cair num dia útil (`ehDiaUtil`, do E06):

```javascript
export function proximoDiaUtil(hoje) {
  const data = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  do {
    data.setDate(data.getDate() + 1);
  } while (!ehDiaUtil(data));
  return data;
}

proximoDiaUtil(new Date(2025, 9, 10)); // sexta, 10/10: devolve segunda, 13/10
proximoDiaUtil(new Date(2025, 9, 11)); // sábado, 11/10: devolve segunda, 13/10
proximoDiaUtil(new Date(2025, 9, 13)); // segunda, 13/10: devolve terça, 14/10
```

---

## :icon[list-ordered] proximoDiaUtil em português

| Linha | O que ela diz |
|---|---|
| `const data = new Date(...)` | "copie a data de hoje, só com dia, mês e ano" |
| `do {` | "faça isto:" |
| `data.setDate(data.getDate() + 1)` | "ande um dia no calendário" |
| `} while (!ehDiaUtil(data));` | "repita enquanto a data **não** for dia útil". O `!` quer dizer "não" |
| `return data` | "devolva a data encontrada" |

O mês começa em 0: em `new Date(2025, 9, 10)`, o 9 é outubro. Com `while`, você teria de avançar um dia antes do laço e repetir a mesma linha dentro dele.

---

## Pense

:::question
Um colega trocou o `do...while` de `proximoDiaUtil` por um `while`. Com um pedido feito na sexta, 10/10, que data a função devolve agora?

```javascript
const data = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
while (!ehDiaUtil(data)) {
  data.setDate(data.getDate() + 1);
}
return data;
```
:::

:::tip Resposta
A própria sexta, 10/10. Sexta é dia útil, então `!ehDiaUtil(data)` nasce falso e o laço roda zero vezes: o pedido "sai" no mesmo dia, contra a regra. Num sábado, a função até acerta a segunda; o bug só aparece de segunda a sexta. Por isso o teste precisa de uma data em dia útil.
:::

---

## Acumuladores

No caixa do mercado, onde fica o total enquanto os produtos passam?

---

## :icon[calculator] Acumuladores de vários tipos

Um **acumulador** guarda o resultado parcial do laço, como a calculadora que vai acumulando do `reduce` (E09). Ele guarda qualquer resultado, desde que nasça **antes** do laço:

| Acumulador | Começa em | A cada volta |
|---|---|---|
| **Contador** | `0` | `++` quando a condição vale |
| Soma | `0` | `+=` um valor, em centavos se for dinheiro |
| Texto | `''` | `+=` um trecho |
| Lista | `[]` | `push` do que passa no teste |
| O melhor até agora | `null` | troca quando aparece um melhor |

O `null` quer dizer "nenhum ainda": antes da primeira volta, não há candidato. A primeira volta sempre vence o `null`, e a lista vazia devolve `null`.

---

## :icon[chart-bar] Uma passada, três respostas

Acumuladores na prática: o relatório do catálogo ganha um resumo, e um laço só leva três acumuladores.

```javascript
export function resumirCatalogo(produtos) {
  let emDestaque = 0; // contador
  let centavos = 0; // soma
  let maisBarato = null; // o melhor até agora
  for (const produto of produtos) {
    if (produto.destaque) emDestaque++;
    centavos += paraCentavos(produto.preco);
    if (maisBarato === null || produto.preco < maisBarato.preco) {
      maisBarato = produto;
    }
  }
  return { emDestaque, total: paraReais(centavos), maisBarato };
}
// com os 12 produtos: 4 em destaque, total 2183.8 e o Livro de Receitas
```

Com métodos, seriam três passadas: um `filter` para os destaques e dois `reduce`. Com 12 produtos, a velocidade é a mesma; o ganho é ler as três regras juntas.

---

## :icon[list-ordered] O resumo em português

| Linha | O que ela diz |
|---|---|
| `let emDestaque = 0` | "ainda não contei nenhum destaque" |
| `let maisBarato = null` | "ainda não tenho o mais barato" |
| `if (produto.destaque) emDestaque++` | "se está em destaque, conte mais um". Com uma instrução só, o `if` dispensa as chaves |
| `maisBarato === null \|\| ...` | "se ainda não tenho nenhum, ou se este é mais barato..." |
| `maisBarato = produto` | "...este passa a ser o mais barato" |
| `return { ... }` | "devolva as três respostas num objeto" |

A soma vai em centavos. Somando em reais, o total viria `2183.8000000000006`.

---

## break e continue

Conferindo o carrinho, quando você para antes do fim? E quando pula um item?

---

## :icon[octagon-alert] break e continue: parar ou pular

Na conferência do carrinho item por item, duas palavras mudam o caminho das voltas:

- **`break`** encerra o laço na hora: "parei aqui; o resto eu nem olho"
- **`continue`** pula o resto daquela volta e vai para a próxima: "este eu pulo; sigo para o próximo"

```javascript
const precos = [199.9, 79.9, 349.9, 59.9];

for (const preco of precos) {
  if (preco > 300) break;     // achou um caro: para tudo
  console.log(preco);         // 199.9 e 79.9
}

for (const preco of precos) {
  if (preco > 300) continue;  // pula o caro e segue
  console.log(preco);         // 199.9, 79.9 e 59.9
}
```

---

## :icon[ticket] break na prática: o vale-presente

A cliente tem um vale-presente e uma lista de desejos em ordem de preferência. Os presentes entram na ordem até o próximo não caber:

```javascript
export function escolherPeloVale(desejos, valor) {
  const maximo = paraCentavos(valor);
  const escolhidos = [];
  let centavos = 0;
  for (const produto of desejos) {
    const preco = paraCentavos(produto.preco);
    if (centavos + preco > maximo) break; // o próximo não cabe: para aqui
    centavos += preco;
    escolhidos.push(produto);
  }
  return escolhidos;
}
```

A parada depende do que **já foi somado**: o `filter` julga cada item sozinho, e o `reduce` passa por todos os itens.

---

## :icon[list-ordered] O vale-presente em português

| Linha | O que ela diz |
|---|---|
| `const escolhidos = []` | "a sacola de presentes começa vazia" |
| `let centavos = 0` | "ainda não gastei nada do vale" |
| `if (centavos + preco > maximo) break` | "se este presente passa do vale, pare o laço aqui" |
| `centavos += preco` | "some o preço ao que já gastei" |
| `escolhidos.push(produto)` | "ponha o presente na sacola" |

Depois do `break`, o código segue na linha depois do `}`: o `return escolhidos`. Dentro de uma função, `return` também sai do laço, e da função junto.

---

## :icon[skip-forward] continue na prática: pular e seguir

Em `escolherPeloVale`, troque `break` por `continue`: o presente que não cabe é pulado, e o laço tenta os próximos.

```javascript
if (centavos + preco > maximo) continue; // não cabe: pula e tenta o próximo
```

| Vale de R$ 350 | Com `break` | Com `continue` |
|---|---|---|
| Fone Bluetooth (199,90) | entra | entra |
| Garrafa Térmica (79,90) | entra: 279,80 | entra: 279,80 |
| Tênis de Corrida (349,90) | não cabe: **para** | não cabe: **pula** |
| Livro de Receitas (59,90) | nem é visto | entra: 339,70 |

As duas versões funcionam; qual delas vale é **regra de negócio**. Antes de escolher, pergunte a quem pediu a função.

---

## Laço ou método

Que métodos de array já dão as voltas sozinhos, sem você escrever o laço?

---

## :icon[scale] Laço ou método de array?

Um **método de array** (`map`, `filter`, `reduce`, `find`, `some`) é um laço pronto, com nome: ele dá as voltas por você. O laço escrito à mão dá mais controle sobre as voltas.

```javascript
// "algum item tem qtd acima de 10?": o nome do método já diz a pergunta
const temMuito = itens.some((item) => item.qtd > 10);
```

Regra prática: se o nome do método diz o que você quer, use o método. Se você precisa controlar as voltas, como parar pelo que já somou ou repetir sem lista, use o laço.

---

## :icon[table] Laço ou método na prática

```javascript
produtos.filter((p) => p.destaque).map((p) => p.nome); // método: os 4 nomes em destaque
escolherPeloVale(desejos, 350);       // laço com break: Fone e Garrafa
unidadesParaFreteGratis(89.9, 59.9);  // while, sem lista: 2
```

| Situação | Prefira | Na Lojinha |
|---|---|---|
| Transformar, filtrar ou somar tudo | `map`, `filter`, `reduce` | nomes dos destaques |
| Achar um item ou testar a lista | `find`, `some`, `every` | item sem estoque? |
| Parar pelo que já acumulou | `for...of` com `break` | presentes até o vale |
| Repetir sem lista | `while`, `do...while` | frete grátis, dia útil |
| Usar a posição ou outro passo | `for` clássico | de trás para a frente |
| Várias respostas numa passada | um `for...of` | resumo do catálogo |

---

## Pratique

:::example Qual ferramenta?
Escolha `for`, `for...of`, `while`, `do...while` ou um método de array para cada regra, e justifique:

1. Os nomes dos produtos em destaque
2. Sortear um código de cupom de novo enquanto ele já existir
3. Algum item do carrinho tem `qtd` acima de 10?
4. A vitrine numerada, do último produto para o primeiro
5. A data de despacho, que pode ser hoje se hoje for dia útil
:::

:::tip Resposta
1. `filter` e `map`: a lista toda, filtrada e transformada
2. `do...while`: o código é gerado ao menos uma vez
3. `some`: para no primeiro que passa
4. `for` com `i--`, de `produtos.length - 1` até `0`
5. `while`: se hoje já é útil, zero voltas
:::

---

## Laço infinito

O que acontece com um carro numa rotatória sem saída?

---

## :icon[siren] Laço infinito: o terminal para

Um **laço infinito** nunca termina, porque a condição nunca fica falsa. É como um carro numa rotatória sem saída: dá voltas para sempre.

```javascript
unidadesParaFreteGratis(89.9, 0); // preço 0: os centavos nunca chegam a 15000
```

Cada volta soma 0 centavos, e `centavos < meta` continua verdadeiro.

- O script não imprime mais nada e não volta para o terminal; o Jest trava do mesmo jeito
- Encerre com <kbd>Ctrl</kbd> + <kbd>C</kbd>
- A partir do E30, num app, o mesmo laço congela a tela inteira

---

## :icon[repeat] Laço infinito na prática: três armadilhas

```javascript
// 1. o passo não chega à saída: cada volta soma 0
unidadesParaFreteGratis(89.9, 0);

// 2. o passo anda para o lado errado: i fica negativo e continua menor
for (let i = 0; i < itens.length; i--) { voltas++; }

// 3. continue antes do passo: o i++ não roda e a mesma volta se repete
let i = 0;
while (i < itens.length) {
  if (itens[i].qtd === 0) continue;
  total += itens[i].qtd;
  i++;
}
```

Os três travam o terminal. O terceiro trava quando algum item tem `qtd` igual a 0. No `for`, o mesmo `continue` não trava: ele pula para o `i++` do cabeçalho.

---

## :icon[shield-check] Antes de rodar: o laço tem saída?

Confira:

- A condição usa uma variável que muda dentro do laço?
- O passo anda na direção da saída (`i++`, e não `i--`)?
- Há um `continue` antes do passo? No `while`, ele pula o `i++` e a mesma volta se repete
- Existe uma entrada sem saída? Trate-a antes, com uma **guard clause** do E13, o `if` no começo da função que devolve logo:

```javascript
if (paraCentavos(preco) <= 0) return null; // sem preço, não há como chegar à meta
```

Com essa linha no começo de `unidadesParaFreteGratis`, o preço 0 devolve `null` em vez de travar.

---

## :icon[triangle-alert] Erros comuns

:::warning
- `while` sem passo, ou com `continue` antes do passo: a mesma volta para sempre
- Trocar `do...while` por `while` e perder a volta obrigatória: o pedido sai no mesmo dia
- Acumulador declarado **dentro** do laço: ele recomeça a cada volta
- `break` onde a regra pedia `continue`, ou o contrário: a lista de presentes muda
- `reduce` para parar no meio: ele passa por todos os itens; use um laço com `break`
- Somar dinheiro em reais no acumulador: `2183.8000000000006`; acumule centavos
:::

---

## Resumo

:::summary
- `for` quando um contador anda até um limite; `while` quando a parada depende do que muda no laço; `do...while` quando o corpo roda ao menos uma vez
- Um laço pode levar vários acumuladores: contador, soma, texto, lista e o melhor até agora, todos criados antes dele
- `break` sai do laço, `continue` pula para a próxima volta e `return` sai da função; trocar um pelo outro muda a regra
- Método de array quando o nome dele diz o que você quer; laço quando você precisa controlar as voltas
- Todo laço precisa de um caminho até a saída; a guard clause trata a entrada que não teria saída
:::

---

## :icon[arrow-right] Próximos passos

Na aula 28, os laços andam sobre coleções e viram regras do `src/regras/catalogo.js`:

- :icon[braces] `for...in` nas chaves de um objeto, e por que evitá-lo em arrays
- :icon[layers] laços aninhados e quantas voltas eles custam
- :icon[search] a busca sem acento que acha "tenis" e "corrida tenis"
- :icon[bug] um breakpoint dentro do laço, no VS Code
