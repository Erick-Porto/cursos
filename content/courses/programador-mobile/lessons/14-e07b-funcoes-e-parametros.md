---
title: Funções e parâmetros
summary: Escreva funções com parâmetros padrão e rest, entenda o escopo e separe as regras puras do que imprime no terminal.
module: linguagem-js
duration_minutes: 40
objectives:
  - Escrever funções como declaração, expressão e arrow function
  - Usar parâmetros padrão, parâmetros rest e o retorno de uma função
  - Explicar o escopo de bloco e o escopo de função
  - Separar as regras puras do que imprime no terminal
---

# Funções e parâmetros

Programador Mobile · Encontro E07 · Aula 14 de 89

---

## O que você vai aprender

:::goal
- Escrever a mesma função como declaração, expressão e arrow function
- Dar valores padrão aos parâmetros e receber quantos argumentos vierem com rest
- Devolver resultados com `return`, inclusive vários valores num objeto
- Saber onde cada variável existe: escopo de bloco e de função
- Separar a regra pura do efeito: imprimir, ler o relógio, sortear
:::

---

## Uma regra, vários lugares

O preço no Pix aparece no resumo da compra e, a partir do E30, em três telas do app: a vitrine, o Detalhe e o Carrinho. Se cada lugar faz a conta por conta própria, a loja muda o desconto e alguém esquece um deles: o cliente vê dois preços para o mesmo fone.

Uma **função** guarda a regra num lugar só. Todos chamam `precoComPix(produto.preco)`, do E05, e a mudança vale para todos de uma vez. Você escreve funções desde o E05; hoje vê como elas funcionam por dentro.

:::question
Num script que simula uma compra e imprime o carrinho, que parte só calcula e que parte faz algo aparecer no terminal?
:::

---

## :icon[square-function] Anatomia de uma função

```javascript
function totalDoItem(preco, qtd) {
  return preco * qtd;
}

const valor = totalDoItem(50, 3); // 150
```

| Parte | No exemplo |
|---|---|
| Nome | `totalDoItem`: diz o que a função entrega |
| **Parâmetros** | `preco` e `qtd`: os nomes que a função usa por dentro |
| Corpo | o que fica entre `{ }` |
| **Retorno** | `return` devolve o resultado a quem chamou |
| **Argumentos** | `50` e `3`: os valores enviados na chamada |

Parâmetro é o nome na definição; argumento é o valor na chamada. Escrever a função não executa nada: ela só roda quando alguém a chama com `( )`.

---

## :icon[code] Três jeitos de escrever

```javascript
// 1. declaração
function totalDoItem(preco, qtd) {
  return preco * qtd;
}

// 2. expressão: a função é o valor de uma constante
const totalDoItem = function (preco, qtd) {
  return preco * qtd;
};

// 3. arrow function
const totalDoItem = (preco, qtd) => preco * qtd;
```

São três versões da mesma função: num arquivo real, só uma existe.

| Forma | Pode ser chamada antes da linha que a cria? |
|---|---|
| Declaração | sim: o JavaScript a **iça** (hoisting) para o topo |
| Expressão e arrow | não: `Cannot access 'totalDoItem' before initialization` |

Na Lojinha: declaração para as regras exportadas de `src/regras/`; arrow para funções curtas e para as que vão como argumento de outra.

---

## :icon[arrow-right] Arrow function de perto

```javascript
const dobro = (n) => n * 2;          // sem chaves: retorno implícito

const comFrete = (total, frete) => {
  const soma = total + frete;
  return soma;                       // com chaves: return obrigatório
};

const itemNovo = (produto) => ({ id: produto.id, qtd: 1 }); // objeto entre parênteses
```

- Sem chaves, o valor da expressão já é o retorno
- Com chaves, vira um corpo comum: sem `return`, devolve `undefined`
- Para devolver um objeto direto, envolva-o em `( )`; senão, as chaves viram corpo da função
- O `() => { ... }` que você passa ao `test` do Jest, desde o E04, é uma arrow sem parâmetros

---

## :icon[sliders-horizontal] Parâmetros padrão

A vitrine anuncia 3 parcelas (`PARCELAS_NA_VITRINE`, do E05), mas o resumo da compra pode pedir 6. Um **valor padrão** cobre o caso comum:

```javascript
function textoDasParcelas(preco, parcelas = PARCELAS_NA_VITRINE) {
  const resultado = parcelar(preco, parcelas);
  return `${parcelas}x de ${formatarPreco(resultado.valor)}`;
}
```

| Chamada | `parcelas` | Devolve |
|---|---|---|
| `textoDasParcelas(199.9)` | 3 | `'3x de R$ 66,63'` |
| `textoDasParcelas(199.9, 6)` | 6 | `'6x de R$ 33,31'` |
| `textoDasParcelas(199.9, undefined)` | 3 | `'3x de R$ 66,63'` |
| `textoDasParcelas(199.9, null)` | `null` | `'nullx de R$ ∞'` |

O padrão só entra quando o argumento falta ou chega como `undefined`. `null` e `0` são valores: a função os recebe como vieram, e a divisão quebra. Deixe os parâmetros com padrão no fim da lista.

---

## :icon[combine] Parâmetros rest

O cliente pode somar um cupom de 10% e o desconto do Pix. Com **rest**, a função aceita quantos percentuais vierem:

```javascript
function aplicarDescontos(preco, ...percentuais) {
  let centavos = paraCentavos(preco);
  for (const p of percentuais) {
    centavos = centavos - Math.round((centavos * p) / 100);
  }
  return paraReais(centavos);
}

aplicarDescontos(200, 10, 5); // 171: 10% do cupom, depois 5% do Pix
aplicarDescontos(200, 10);    // 180
aplicarDescontos(200);        // 200: percentuais chega como []
```

- `...percentuais` junta numa **lista** todos os argumentos que sobram, e o `for...of` da aula 13 a percorre
- Só pode haver um rest, e ele é sempre o último parâmetro
- Os mesmos três pontos numa chamada fazem o contrário, espalham uma lista: é o spread, que você vê no E09

---

## Pratique

:::example Desafio
No aviso "Faltam R$ 20,20 para o frete grátis" da aula 13, a conta da falta fica solta dentro do `else`. Escreva a arrow function `faltaParaFreteGratis(subtotal, minimo)`:

- devolve quanto falta, em reais, com a conta em centavos
- usa `FRETE_GRATIS_A_PARTIR_DE` (150) como padrão de `minimo`
- devolve 0 quando o subtotal já chegou ao mínimo
:::

:::tip Resposta
```javascript
const faltaParaFreteGratis = (subtotal, minimo = FRETE_GRATIS_A_PARTIR_DE) => {
  if (subtotal >= minimo) {
    return 0;
  } else {
    return paraReais(paraCentavos(minimo) - paraCentavos(subtotal));
  }
};

faltaParaFreteGratis(129.8);    // 20.2
faltaParaFreteGratis(200);      // 0
faltaParaFreteGratis(120, 200); // 80
```

Com chaves, a arrow precisa de `return`. A função devolve número, não texto: quem imprime monta a frase com `formatarPreco`, e um número é mais fácil de testar.
:::

---

## :icon[corner-down-right] O retorno

- `return` devolve um valor e **encerra** a função: nada depois dele roda
- Sem `return`, a função devolve `undefined`
- Para devolver vários valores, devolva um objeto

```javascript
function resumirCarrinho(itens) {
  if (itens.length === 0) {
    return null; // encerra aqui: as linhas de baixo não rodam
  }
  return {
    linhas: itens.length,
    total: subtotal(itens),
  };
}

const resumo = resumirCarrinho(itens);
```

Com o carrinho do Pratique da aula 13 (fones, luminária e garrafas), `resumo` é `{ linhas: 3, total: 969.1 }`, e o script lê `resumo.linhas` e `resumo.total`. Quem chama sabe o que esperar: `null` para o carrinho vazio, um objeto com dois números nos outros casos.

---

## :icon[braces] Escopo de bloco

**Escopo** é a região do código onde um nome existe. `let` e `const` vivem só no **bloco** `{ }` em que nasceram: o de um `if`, de um `for` ou de uma função.

```javascript
function avisoDoFrete(subtotal) {
  if (subtotal >= FRETE_GRATIS_A_PARTIR_DE) {
    const aviso = 'Você ganhou frete grátis';
  } else {
    const aviso = 'Ainda falta para o frete grátis';
  }
  return aviso; // ReferenceError: aviso is not defined
}
```

A correção é a forma do aviso da aula 13: declare a variável no bloco em que ela vai ser usada.

```javascript
function avisoDoFrete(subtotal) {
  let aviso;
  if (subtotal >= FRETE_GRATIS_A_PARTIR_DE) {
    aviso = 'Você ganhou frete grátis';
  } else {
    const falta = faltaParaFreteGratis(subtotal); // só existe neste bloco
    aviso = `Faltam ${formatarPreco(falta)} para o frete grátis`;
  }
  return aviso;
}
```

O `i` de um `for (let i = 0; ...)` também só existe dentro do laço. O `var` ignora blocos: por isso você não o usa desde o E05.

---

## :icon[eye-off] Escopo de função

Parâmetros e variáveis criados dentro de uma função só existem durante aquela chamada, e cada chamada tem os seus. A função enxerga o que está fora dela; quem está fora não enxerga o que está dentro.

```javascript
const NOTA_MINIMA = 4.5; // escopo do módulo: o arquivo inteiro vê

function contarBemAvaliados(produtos) {
  let total = 0; // só existe aqui dentro, e cada chamada tem o seu
  for (const p of produtos) {
    if (p.avaliacao >= NOTA_MINIMA) total++;
  }
  return total;
}

contarBemAvaliados([{ avaliacao: 4.8 }, { avaliacao: 3.9 }]); // 1
console.log(total); // ReferenceError: total is not defined
```

::::columns
:::col
![Diagrama: dentro de contarBemAvaliados, o código enxerga NOTA_MINIMA, do módulo; o console.log(total) de fora não enxerga o total da função e dá ReferenceError](images/e07-escopo.svg)
:::
:::col
Ler `NOTA_MINIMA` de fora é seguro. Se o `let total` ficasse no topo do arquivo, cada chamada somaria em cima da anterior: o resultado passaria a depender de quem chamou antes.
:::
::::

---

## :icon[equal] Funções puras

Uma **função pura** cumpre duas regras: com as mesmas entradas, devolve sempre a mesma saída; e não muda nada fora dela.

```javascript
// pura: depende só dos parâmetros e devolve um valor novo
function totalDoItem(preco, qtd) {
  return preco * qtd;
}

// impura: muda a lista que recebeu
function adicionarBrinde(itens) {
  itens.push({ id: 99, nome: 'Brinde', preco: 0, qtd: 1 });
}
```

::::columns
:::col
![Diagrama: a pura totalDoItem recebe 50 e 3 e devolve sempre 150, sem mexer em nada fora; a impura adicionarBrinde dá push e muda a lista itens que recebeu](images/e07-funcao-pura.svg)
:::
:::col
Por que a Lojinha quer regras puras:

- :icon[test-tube] Um `expect` testa a regra sem rodar script nenhum
- :icon[smartphone] Ela roda igual no Node, no Jest e, a partir do E30, no app
- :icon[shield-check] Quem chamou continua com a lista que tinha
:::
::::

---

## :icon[shopping-cart] Uma regra pura do carrinho

Para tirar um item sem mexer na lista recebida, crie uma lista **nova** e copie para ela só o que fica. `[]` cria uma lista vazia e `push` põe um item no fim dela; o E08 mostra o resto dos arrays.

```javascript
export function removerItem(itens, id) {
  const novos = [];
  for (const item of itens) {
    if (item.id !== id) {
      novos.push(item);
    }
  }
  return novos;
}
```

O `push` vai na lista **nova**, nunca na recebida, e quem chama guarda o resultado: `itens = removerItem(itens, 4);`. No laboratório, `adicionarItem` e `alterarQuantidade` seguem o mesmo molde. Para mudar a `qtd`, ponha na lista nova um objeto novo, `{ id: item.id, nome: item.nome, preco: item.preco, qtd: 2 }`: mudar `item.qtd` mexeria no item de quem chamou.

---

## :icon[zap] Funções com efeito

Um programa precisa de efeitos: é por eles que algo acontece. **Efeito colateral** é tudo o que a função faz além de devolver um valor.

| Efeito | Exemplo no `lojinha-regras` |
|---|---|
| Mostrar algo | `console.log` no terminal |
| Mudar o que veio de fora | `push` na lista recebida |
| Ler ou gravar arquivo | `fs.readFileSync`, do E02 |
| Ler o mundo | `new Date()`, `Math.random()` |

Regra da Lojinha: o cálculo mora numa função pura em `src/regras/`; o efeito mora no script de `src/scripts/`, que chama a regra e imprime.

```javascript
let itens = [];
itens = adicionarItem(itens, produtos[0]); // regra pura: só calcula
console.log(`Subtotal: ${formatarPreco(subtotal(itens))}`); // efeito: imprime
```

---

## Pense

:::question
Quais destas funções do `lojinha-regras` são puras?

1. `formatarPreco(valor)`, do E05
2. `imprimirCarrinho(itens)`, que dá um `console.log` por item
3. `calcularDesconto(preco, percentual)`, do E05
4. Um sorteio de cupom: `() => Math.random() < 0.1`
5. `() => new Date()`, para saber o dia de hoje
:::

:::tip Resposta
Puras: 1 e 3. Devolvem o mesmo resultado para as mesmas entradas e não mexem em nada fora delas. A 2 imprime: é efeito e mora no script. A 4 e a 5 leem o mundo (o sorteio e o relógio): cada chamada pode dar um resultado diferente. Para testar uma regra que precisa da data, receba a data por parâmetro, como nos testes de datas do E06, em vez de ler o relógio lá dentro.
:::

---

## :icon[triangle-alert] Erros comuns

:::warning
- Arrow com chaves e sem `return`: `(item) => { item.preco * item.qtd }` devolve `undefined`
- Objeto sem parênteses na arrow: em `() => { qtd: 1 }`, as chaves viram corpo e o retorno é `undefined`
- Chamar uma arrow ou expressão antes da linha que a cria: `Cannot access ... before initialization`
- Esperar o valor padrão com `null`: só o argumento ausente ou `undefined` ativa o padrão
- Usar fora do `if` uma `const` criada dentro dele: `ReferenceError`
- `push` na lista recebida numa regra: quem chamou perde a lista que tinha, e o teste fica imprevisível
- Chamar a regra e jogar o resultado fora: `removerItem(itens, 4);` sozinho não muda `itens`
:::

---

## Resumo

:::summary
- Uma função guarda uma regra num lugar só: parâmetros entram, `return` devolve o resultado
- Declaração é içada; expressão e arrow só existem depois da linha que as cria
- Parâmetro padrão cobre o argumento ausente; rest junta o resto numa lista
- `let` e `const` vivem no bloco em que nasceram, e o que nasce na função fica nela
- Regra pura em `src/regras/`, efeito (imprimir) no script de `src/scripts/`
:::

---

## :icon[flask-conical] No laboratório

As regras do carrinho em `src/regras/carrinho.js`, testadas, e um script que simula uma compra.

:::steps
1. `subtotal(itens)`, da aula 13: 2 fones e 1 luminária dão `489.7`; vazio dá `0`
2. `removerItem(itens, id)`, como no slide
3. `alterarQuantidade(itens, id, qtd)`: troca a `qtd`; 0 ou menos remove o item
4. `adicionarItem(itens, produto)`: novo entra com `qtd` 1; repetido soma 1
5. Testes de cada regra, inclusive "a lista recebida não mudou"
6. `src/scripts/simular-carrinho.js`: monta um carrinho e imprime as linhas e o subtotal
7. `npm run verificar`, commit "E07: regras do carrinho com funções e laços" e `git push`
:::

**Critérios de entrega**: regras sem `console.log`; 8 testes ou mais, verdes; o script roda com `node src/scripts/simular-carrinho.js`. Entregue o link do repositório no sistema.
