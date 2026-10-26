---
title: Laços com for e while
summary: Repita sem copiar código com for, while e do...while, somando e contando o carrinho da Lojinha.
module: logica-js
duration_minutes: 40
objectives:
  - Escrever laços com for, while e do...while
  - Somar e contar com acumuladores e contadores
  - Controlar as voltas com break e continue
  - Reconhecer e evitar o laço infinito
---

# Laços com for e while

Programador Mobile: Módulo Específico · Encontro E27 · Aula 35 de 71

---

## O que você vai aprender

:::goal
- Repetir um trecho com `for`, `while` e `do...while`
- Somar o carrinho com um **acumulador** e contar com um **contador**
- Parar ou pular uma volta com `break` e `continue`
- Reconhecer o laço infinito antes que ele congele o app
:::

---

## Um carrinho com 2 itens ou com 20

A cliente põe 2 fones e 1 luminária no carrinho, e o rodapé mostra o total. Outra pessoa põe 7 produtos diferentes. Quem escreve o total não sabe quantos itens vão chegar:

```javascript
const total = itens[0].preco * itens[0].qtd + itens[1].preco * itens[1].qtd;
// com 7 itens, 5 ficam de fora; com o carrinho vazio, itens[0] é undefined
```

Copiar a conta uma vez por item não resolve: a quantidade muda a cada toque em "Adicionar".

:::question
Como escrever a conta de um item uma vez só e fazer o JavaScript repeti-la para cada item, sejam 0, 2 ou 20?
:::

---

## :icon[list-ordered] for: quando você sabe quantas voltas

Um **laço** repete um bloco enquanto uma condição for verdadeira; cada repetição é uma **volta**. No Detalhe, as 5 estrelas da avaliação saem de um `for`:

```javascript
function iconesDaNota(nota) {
  const icones = [];
  for (let i = 1; i <= 5; i++) {
    icones.push(i <= Math.round(nota) ? 'star' : 'star-outline');
  }
  return icones;
}
iconesDaNota(4.4); // ['star', 'star', 'star', 'star', 'star-outline']
```

| Parte | No código | Pergunta |
|---|---|---|
| Início | `let i = 1` | de onde parto? |
| Condição | `i <= 5` | continuo? |
| Passo | `i++` (soma 1) | como avanço? |

A tela desenha um `Ionicons` para cada nome da lista.

---

## :icon[table] Teste de mesa: volta a volta

Para entender um laço, siga as variáveis no papel, volta a volta: é o **teste de mesa**. Em `iconesDaNota(4.4)`, `Math.round(4.4)` vale 4:

| `i` | `i <= 5`? | `i <= 4`? | Entra na lista |
|---|---|---|---|
| 1 | sim | sim | `'star'` |
| 2 | sim | sim | `'star'` |
| 3 e 4 | sim | sim | `'star'` duas vezes |
| 5 | sim | não | `'star-outline'` |
| 6 | não | | o laço termina |

A condição é testada **antes** de cada volta. Quando ela fica falsa, o JavaScript segue para a linha depois do `}`: o `return icones`.

---

## :icon[calculator] Acumulador: somando o carrinho com for

Um **acumulador** é uma variável criada antes do laço que guarda o resultado parcial e cresce a cada volta:

```javascript
function totalDoCarrinho(itens) {
  let total = 0; // começa no neutro da soma
  for (let i = 0; i < itens.length; i++) {
    total += itens[i].preco * itens[i].qtd; // soma o item da volta
  }
  return total;
}
```

- As posições vão de `0` a `itens.length - 1`: por isso `<`, e não `<=`
- Carrinho vazio: `0 < 0` é falso, nenhuma volta acontece e o total é `0`
- `total += x` é o mesmo que `total = total + x`

---

## :icon[coins] O acumulador em centavos

Teste com 2 fones de R$ 199,90 e 1 luminária de R$ 89,90: `totalDoCarrinho` devolve `489.70000000000005`. É o ponto flutuante do E25 aparecendo na soma.

A solução também vem do E25: acumule **centavos inteiros**, com `paraCentavos` e `paraReais` de `src/regras/precos.js`, e volte para reais uma vez só, no fim.

```javascript
import { paraCentavos, paraReais } from './precos';

export function subtotal(itens) {
  let centavos = 0;
  for (let i = 0; i < itens.length; i++) {
    centavos += paraCentavos(itens[i].preco) * itens[i].qtd;
  }
  return paraReais(centavos); // 489.7
}
```

`paraCentavos(199.9)` dá `19990`: um inteiro, sem sobra. Essa é a `subtotal` que você grava em `src/regras/carrinho.js` no laboratório.

---

## :icon[calculator] O acumulador, volta a volta

:::center
![Animação: em subtotal com 2 fones e 1 luminária, centavos começa em 0, ganha 39980 na volta 0 e 8990 na volta 1; com i valendo 2 o laço termina e a função devolve paraReais(48970), 489.7](images/e27-acumulador.svg)
:::

Em `subtotal([fone, luminaria])`, `centavos` começa em 0, ganha 39980 na volta 0 (2 fones de 19990) e 8990 na volta 1 (1 luminária). Com `i` valendo 2, `2 < 2` é falso, o laço termina e a função devolve `paraReais(48970)`: `489.7`.

---

## :icon[hash] Contador: quantos atendem à condição

Um **contador** é um acumulador que soma sempre 1, e só quando algo acontece. Quantos produtos estão em destaque, para o Badge da vitrine?

```javascript
let emDestaque = 0;
for (let i = 0; i < produtos.length; i++) {
  if (produtos[i].destaque) {
    emDestaque++;
  }
}
// <Badge texto={emDestaque + ' em destaque'} tom="sucesso" />
```

| | Acumulador | Contador |
|---|---|---|
| Começa em | `0` | `0` |
| Cada volta soma | um valor, como `preco * qtd` | `1`, se a condição vale |
| Na Lojinha | total do carrinho | 4 produtos em destaque |

---

## Pense

:::question
Este total derruba o app com a tela vermelha `Cannot read property 'preco' of undefined`, mesmo com todos os itens do carrinho certinhos. O que está errado?

```javascript
let total = 0;
for (let i = 0; i <= itens.length; i++) {
  total += itens[i].preco * itens[i].qtd;
}
```
:::

:::tip Resposta
Com 3 itens, as posições são 0, 1 e 2. O `<=` faz uma quarta volta com `i` valendo 3, e `itens[3]` é `undefined`. Troque por `i < itens.length`. Errar por uma volta, para mais ou para menos, é tão comum que tem nome: **off-by-one**.
:::

---

## :icon[refresh-cw] while: quando você não sabe quantas voltas

O `while` repete enquanto a condição for verdadeira, sem início nem passo embutidos. No Detalhe, a Lojinha avisa quantas unidades faltam para o frete grátis, que começa em R$ 150 (`FRETE_GRATIS_A_PARTIR_DE`, do E26):

```javascript
function unidadesParaFreteGratis(valorNoCarrinho, preco) {
  let unidades = 0;
  let valor = valorNoCarrinho;
  while (valor < FRETE_GRATIS_A_PARTIR_DE) {
    valor += preco;
    unidades++;
  }
  return unidades;
}
unidadesParaFreteGratis(89.9, 59.9); // 2: "Leve 2 e ganhe frete grátis"
```

Ninguém sabe de antemão quantas voltas serão: depende do carrinho e do preço. Se o carrinho já passa de R$ 150, a condição nasce falsa e o laço roda **zero** vezes.

---

## :icon[dices] do...while: pelo menos uma vez

No fim do Detalhe, "Você também pode gostar" sorteia um produto. Ele não pode ser o próprio produto aberto:

```javascript
let sugestao;
do {
  const posicao = Math.floor(Math.random() * produtos.length);
  sugestao = produtos[posicao];
} while (sugestao.id === produto.id); // sorteou o mesmo? sorteia de novo
```

O `do...while` roda o corpo **primeiro** e testa depois: o sorteio sempre acontece ao menos uma vez e só se repete quando cai no produto aberto. Com `while`, você teria de sortear uma vez antes do laço e repetir o mesmo código dentro dele.

---

## :icon[search-check] break: parar ao encontrar

`break` encerra o laço na hora. Para achar o produto de `id` 7, não há por que olhar os 12:

```javascript
let encontrado = null;
for (let i = 0; i < produtos.length; i++) {
  if (produtos[i].id === id) {
    encontrado = produtos[i];
    break; // achou: as voltas que faltam não rodam
  }
}
```

O Tênis de Corrida está na posição 6: o laço roda 7 voltas em vez de 12. É o que o `find` faz por dentro, e você vai usá-lo no E29. Dentro de uma função, `return` também sai do laço, e da função junto.

---

## :icon[skip-forward] continue: pular uma volta

`continue` encerra só a volta atual e segue para a próxima. Itens "salvos para depois" ficam no carrinho, mas fora do total:

```javascript
let total = 0;
for (let i = 0; i < itens.length; i++) {
  if (itens[i].paraDepois) continue; // pula este item
  total += itens[i].preco * itens[i].qtd;
}
```

| Comando | O que acontece |
|---|---|
| `continue` | pula o resto desta volta; no `for`, vai ao `i++` e à condição |
| `break` | sai do laço; o código segue depois do `}` |

:::warning
No `while`, o passo fica dentro do corpo. Um `continue` antes do `i++` pula o passo, e o laço repete a mesma volta para sempre.
:::

---

## Pratique

:::example Qual laço?
Escolha `for`, `while` ou `do...while` para cada situação da Lojinha e justifique:

1. Montar os 6 cartões de `Esqueleto` enquanto a vitrine carrega
2. Gerar um código de cupom e sortear outro se ele já existir
3. Avançar a data de entrega até cair num dia útil
:::

:::tip Resposta
1. `for`: o número de voltas é conhecido, 6
2. `do...while`: o código precisa ser gerado ao menos uma vez antes de ser conferido
3. `while`: se a data já cai num dia útil, não há o que avançar, e o laço roda zero vezes
:::

---

## :icon[siren] Laço infinito: o app congela

Se a condição nunca fica falsa, o laço não termina:

```javascript
unidadesParaFreteGratis(89.9, 0); // preço 0: o valor nunca chega a 150
```

O JavaScript do app roda numa linha só: enquanto o laço gira, nenhum toque é atendido e a tela para. Se o `r` do terminal não recarregar, feche o Expo Go e abra de novo depois de corrigir. No Jest, o teste trava até você apertar <kbd>Ctrl</kbd> + <kbd>C</kbd>.

Antes de rodar, confira:

- A condição usa uma variável que muda dentro do laço?
- O passo anda na direção da saída (`i++`, e não `i--`)?
- Existe um caso sem saída? Trate-o antes, com guard clause: `if (preco <= 0) return null;`

---

## :icon[triangle-alert] Erros comuns

:::warning
- `i <= itens.length`: uma volta a mais e `undefined` na última
- Acumulador declarado **dentro** do laço: ele volta a `0` a cada volta e o total fica só com o último item
- Somar reais em ponto flutuante: `489.70000000000005` no total; acumule centavos
- `continue` antes do `i++` num `while`: o laço nunca sai da mesma volta
- `do...while` que sorteia "outro produto" numa vitrine com um produto só: nunca termina
- `const i` no `for` clássico: o `i++` dá `Assignment to constant variable`
:::

---

## Resumo

:::summary
- Um laço tem início, condição e passo; a condição é testada antes de cada volta
- `for` quando você sabe quantas voltas; `while` quando depende de uma condição; `do...while` quando o corpo roda ao menos uma vez
- Acumulador soma valores e contador soma 1; os dois nascem **antes** do laço
- `break` sai do laço; `continue` pula para a próxima volta
- Todo laço precisa de um caminho até a saída, senão o app congela
:::

---

## :icon[arrow-right] Próximos passos

Hoje cada volta usou um índice: `itens[i]`. Na aula 36, você percorre listas e textos sem índice e escreve as regras do laboratório:

- :icon[list] `for...of` em arrays e strings, e os riscos do `for...in`
- :icon[layers] laços aninhados e quanto eles custam no celular
- :icon[search] a busca da Início sem acento e sem maiúsculas
- :icon[bug] um breakpoint dentro do laço, no React Native DevTools
