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

## :icon[refresh-cw] while: repete enquanto a condição vale

O `while` só tem a condição. O início fica antes do laço, e o passo, dentro dele. Em `src/regras/frete.js`, junto do `FRETE_GRATIS_A_PARTIR_DE` do E10:

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
```

Ninguém sabe de antemão quantas voltas serão: depende do carrinho e do preço. Com R$ 200 no carrinho, a condição nasce falsa e o laço roda **zero** vezes. A conta vai em centavos, como manda a regra do E05.

---

## :icon[table] Teste de mesa do while

Siga as variáveis volta a volta, no papel: é o **teste de mesa**. Em `unidadesParaFreteGratis(89.9, 59.9)`, a meta é 15000 e cada unidade soma 5990:

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

## :icon[calendar-check] do...while: o corpo roda pelo menos uma vez

Regra da Lojinha: o pedido nunca é despachado no mesmo dia. A data anda **pelo menos** um dia e continua andando enquanto não cair num dia útil (`ehDiaUtil`, do E06):

```javascript
export function proximoDiaUtil(hoje) {
  const data = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  do {
    data.setDate(data.getDate() + 1);
  } while (!ehDiaUtil(data));
  return data;
}

proximoDiaUtil(new Date(2025, 9, 10)); // sexta, 10/10: devolve segunda, 13/10
```

O `do...while` roda o corpo **primeiro** e testa depois. Com `while`, você teria de avançar um dia antes do laço e repetir a mesma linha dentro dele.

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

## :icon[calculator] Acumuladores de vários tipos

No E07, o acumulador somou o carrinho. Ele pode guardar qualquer resultado parcial, desde que nasça **antes** do laço:

| Acumulador | Começa em | A cada volta |
|---|---|---|
| **Contador** | `0` | `++` quando a condição vale |
| Soma | `0` | `+=` um valor, em centavos se for dinheiro |
| Texto | `''` | `+=` um trecho |
| Lista | `[]` | `push` do que passa no teste |
| O melhor até agora | `null` | troca quando aparece um melhor |

O "melhor até agora" começa em `null` porque, antes da primeira volta, ainda não existe candidato. A primeira volta sempre vence o `null`, e a lista vazia devolve `null` sem nenhum `if` extra.

---

## :icon[chart-bar] Uma passada, três respostas

O relatório do catálogo ganha um resumo. Um laço só leva três acumuladores:

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

Com métodos, seriam três passadas: um `filter` para os destaques e dois `reduce`. Com 12 produtos, a velocidade é a mesma; o ganho é ler as três regras juntas. Somando em reais, o total viria `2183.8000000000006`.

---

## :icon[octagon-alert] break: parar no meio

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

`break` encerra o laço na hora, e o código segue depois do `}`. A parada depende do que **já foi somado**: o `filter` julga cada item sozinho, e o `reduce` passa por todos os itens. Dentro de uma função, `return` também sai do laço, e da função junto.

---

## :icon[skip-forward] continue: pular e seguir

Troque uma palavra: com `continue`, o presente que não cabe é pulado e o laço tenta os próximos.

```javascript
if (centavos + preco > maximo) continue; // não cabe: pula e tenta o próximo
```

Vale de R$ 350 e esta lista de desejos:

| Desejo | Com `break` | Com `continue` |
|---|---|---|
| Fone Bluetooth (199,90) | entra | entra |
| Garrafa Térmica (79,90) | entra: 279,80 | entra: 279,80 |
| Tênis de Corrida (349,90) | não cabe: **para** | não cabe: **pula** |
| Livro de Receitas (59,90) | nem é visto | entra: 339,70 |

As duas versões funcionam; qual delas vale é **regra de negócio**. Antes de escolher, pergunte a quem pediu a função.

---

## :icon[scale] Laço ou método de array?

| Situação | Prefira | Na Lojinha |
|---|---|---|
| Transformar, filtrar ou somar tudo | `map`, `filter`, `reduce` | nomes dos destaques |
| Achar um item ou testar a lista | `find`, `some`, `every` | item sem estoque? |
| Parar pelo que já acumulou | `for...of` com `break` | presentes até o vale |
| Repetir sem lista | `while`, `do...while` | frete grátis, dia útil |
| Usar a posição ou outro passo | `for` clássico | de trás para a frente |
| Várias respostas numa passada | um `for...of` | resumo do catálogo |

Regra prática: se o nome do método diz o que você quer, use o método; se precisa controlar as voltas, use o laço.

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

## :icon[siren] Laço infinito: o terminal para

Se a condição nunca fica falsa, o laço não termina:

```javascript
unidadesParaFreteGratis(89.9, 0); // preço 0: os centavos nunca chegam a 15000
```

O script não imprime mais nada e não volta para o terminal; o Jest trava do mesmo jeito. Encerre com <kbd>Ctrl</kbd> + <kbd>C</kbd>. A partir do E30, num app, o mesmo laço congela a tela inteira.

Antes de rodar, confira:

- A condição usa uma variável que muda dentro do laço?
- O passo anda na direção da saída (`i++`, e não `i--`)?
- Existe uma entrada sem saída? Trate-a antes, com uma guard clause do E13:

```javascript
if (paraCentavos(preco) <= 0) return null; // sem preço, não há como chegar à meta
```

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
