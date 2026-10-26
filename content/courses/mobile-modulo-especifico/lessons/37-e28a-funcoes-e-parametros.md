---
title: Funções e parâmetros
summary: Escreva funções com parâmetros padrão e rest, entenda o escopo e separe as regras puras dos efeitos da tela.
module: logica-js
duration_minutes: 40
objectives:
  - Escrever funções como declaração, expressão e arrow function
  - Usar parâmetros padrão, parâmetros rest e o retorno de uma função
  - Explicar o escopo de bloco e o escopo de função
  - Separar funções puras de funções com efeito numa tela do app
---

# Funções e parâmetros

Programador Mobile: Módulo Específico · Encontro E28 · Aula 37 de 71

---

## O que você vai aprender

:::goal
- Escrever a mesma função como declaração, expressão e arrow function
- Dar valores padrão aos parâmetros e receber quantos argumentos vierem com rest
- Devolver resultados com `return`, inclusive vários valores num objeto
- Saber onde cada variável existe: escopo de bloco e de função
- Separar o cálculo puro do efeito (salvar, navegar, mostrar um toast)
:::

---

## Uma regra, três telas

O preço no Pix aparece no cartão da vitrine, no Detalhe e no Carrinho. Se cada tela faz a conta por conta própria, a loja muda o desconto e alguém esquece uma das três: o cliente vê dois preços para o mesmo fone e abre uma reclamação.

Uma **função** guarda a regra num lugar só. As telas chamam `precoComPix(produto.preco)`, do E25, e a mudança vale para todas de uma vez.

:::question
No botão "Adicionar ao carrinho" do Detalhe, que parte do código só calcula e que parte muda alguma coisa fora dela?
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

Na Lojinha: declaração para regras exportadas e componentes; arrow para callbacks (`onPress`, `renderItem`) e funções curtas.

---

## :icon[arrow-right] Arrow function de perto

```javascript
const dobro = (n) => n * 2;          // sem chaves: retorno implícito

const comFrete = (total, frete) => {
  const soma = total + frete;
  return soma;                       // com chaves: return obrigatório
};

const novoItem = (produto) => ({ ...produto, qtd: 1 }); // objeto entre parênteses
```

- Sem chaves, o valor da expressão já é o retorno
- Com chaves, vira um corpo comum: sem `return`, devolve `undefined`
- Para devolver um objeto direto, envolva-o em `( )`; senão, as chaves viram corpo da função
- No JSX, `onPress={() => remover(item.id)}` cria uma função que só roda no toque

---

## :icon[sliders-horizontal] Parâmetros padrão

A `paginar` do E27 fica mais fácil de chamar quando os parâmetros têm um **valor padrão**:

```javascript
export function paginar(lista, pagina = 1, tamanho = 6) {
  // o corpo do E27 não muda
}
```

| Chamada | `pagina` | `tamanho` |
|---|---|---|
| `paginar(produtos)` | 1 | 6 |
| `paginar(produtos, 2)` | 2 | 6 |
| `paginar(produtos, undefined, 4)` | 1 | 4 |
| `paginar(produtos, null)` | `null` | 6 |

O padrão só entra quando o argumento falta ou chega como `undefined`. `null` e `0` são valores: a função os recebe como vieram. Deixe os parâmetros com padrão no fim da lista.

---

## :icon[combine] Parâmetros rest

O cliente pode somar um cupom de 10% e o desconto do Pix. Com **rest**, a função aceita quantos percentuais vierem:

```javascript
function aplicarDescontos(preco, ...percentuais) {
  let resultado = preco;
  for (const p of percentuais) {
    resultado = resultado - (resultado * p) / 100;
  }
  return Math.round(resultado * 100) / 100;
}

aplicarDescontos(200, 10, 5); // 171: 10% do cupom, depois 5% do Pix
aplicarDescontos(200, 10);    // 180
aplicarDescontos(200);        // 200: percentuais chega como []
```

- `...percentuais` junta num **array** todos os argumentos que sobram
- Só pode haver um rest, e ele é sempre o último parâmetro
- Os mesmos três pontos numa chamada fazem o contrário (espalham um array): é o spread, do E34

---

## Pratique

:::example Desafio
No aviso "Faltam R$ 30,00 para o frete grátis" do E26, a conta da falta fica solta dentro do `else`. Escreva a arrow function `faltaParaFreteGratis(subtotal, minimo)`: ela devolve quanto falta, usa `FRETE_GRATIS_A_PARTIR_DE` (150, do E26) como padrão de `minimo` e devolve 0 quando o subtotal já chegou ao mínimo.
:::

:::tip Resposta
```javascript
const faltaParaFreteGratis = (subtotal, minimo = FRETE_GRATIS_A_PARTIR_DE) =>
  subtotal >= minimo ? 0 : minimo - subtotal;

faltaParaFreteGratis(120);      // 30
faltaParaFreteGratis(200);      // 0
faltaParaFreteGratis(120, 200); // 80
```

O corpo é uma expressão só, então o ternário do E26 já é o retorno. A tela monta o texto com `formatarPreco(falta)`: a função devolve número, não texto.
:::

---

## :icon[corner-down-right] O retorno

- `return` devolve um valor e **encerra** a função: nada depois dele roda
- Sem `return`, a função devolve `undefined`
- Para devolver vários valores, devolva um objeto

```javascript
function resumirCarrinho(itens) {
  if (itens.length === 0) return null; // retorno antecipado (E26)
  return {
    quantidade: contarItens(itens),
    total: subtotal(itens),
  };
}

const resumo = resumirCarrinho(itens);
// na tela: resumo.quantidade e resumo.total
```

A tela recebe um pacote pronto e só mostra. Quem chama sabe o que esperar: `null` para o carrinho vazio, um objeto com dois números no resto dos casos.

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

A correção é a forma do aviso do E26: declare a variável no bloco em que ela vai ser usada.

```javascript
function avisoDoFrete(subtotal) {
  let aviso;
  if (subtotal >= FRETE_GRATIS_A_PARTIR_DE) {
    aviso = 'Você ganhou frete grátis';
  } else {
    const falta = FRETE_GRATIS_A_PARTIR_DE - subtotal; // só existe neste bloco
    aviso = `Faltam ${formatarPreco(falta)} para o frete grátis`;
  }
  return aviso;
}
```

O `i` de um `for (let i = 0; ...)` também só existe dentro do laço. O `var` ignora blocos: por isso você não o usa desde o E25.

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
![Diagrama: dentro de contarBemAvaliados, o código enxerga NOTA_MINIMA, do módulo; o console.log(total) de fora não enxerga o total da função e dá ReferenceError](images/e28-escopo.svg)
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
![Diagrama: a pura totalDoItem recebe 50 e 3 e devolve sempre 150, sem mexer em nada fora; a impura adicionarBrinde dá push e muda a lista itens que recebeu](images/e28-funcao-pura.svg)
:::
:::col
Por que a Lojinha quer regras puras:

- :icon[test-tube] Um `expect` testa a regra sem abrir o app
- :icon[smartphone] Ela roda igual no Node, no Jest e no Hermes
- :icon[refresh-cw] Uma lista nova avisa o React que algo mudou; a mesma lista alterada por dentro, não
:::
::::

---

## :icon[zap] Funções com efeito

Um app precisa de efeitos: é por eles que algo acontece na tela. **Efeito colateral** é tudo o que a função faz além de devolver um valor.

| Efeito | Exemplo na Lojinha |
|---|---|
| Mudar estado | `setItens(...)`, `setToastVisivel(true)` |
| Navegar | `router.push('/carrinho')` |
| Mostrar algo | toast, `Alert.alert`, `console.log` |
| Salvar ou buscar | AsyncStorage (E39), `fetch` (E38) |
| Ler o mundo | `new Date()`, `Math.random()` |

Regra da Lojinha: o cálculo mora numa função pura em `src/regras/`; o efeito mora no handler da tela, que chama a regra e depois age.

```jsx
function adicionarAoCarrinho() {
  adicionar(produto);     // muda o estado do carrinho
  setToastVisivel(true);  // mostra o toast
}
```

---

## Pense

:::question
Quais destas funções da Lojinha são puras?

1. `formatarPreco(valor)`
2. `comprar()` no Detalhe, que chama `adicionar(produto)` e `router.push('/carrinho')`
3. `calcularFrete(subtotal, cep)`, do E26
4. A falha simulada do E19: `() => Math.random() < CHANCE_DE_ERRO`
5. `() => new Date()`, para saber o dia de hoje
:::

:::tip Resposta
Puras: 1 e 3. Devolvem o mesmo resultado para as mesmas entradas e não mexem em nada fora delas. A 2 muda o estado e navega: é efeito e mora na tela. A 4 e a 5 leem o mundo (o sorteio e o relógio): cada chamada pode dar um resultado diferente. Para testar uma regra que precisa da data, receba a data por parâmetro em vez de ler o relógio lá dentro.
:::

---

## :icon[triangle-alert] Erros comuns

:::warning
- Arrow com chaves e sem `return`: `(item) => { item.preco * item.qtd }` devolve `undefined`
- Objeto sem parênteses na arrow: em `() => { qtd: 1 }`, as chaves viram corpo e o retorno é `undefined`
- Chamar uma arrow ou expressão antes da linha que a cria: `Cannot access ... before initialization`
- Esperar o valor padrão com `null`: só o argumento ausente ou `undefined` ativa o padrão
- Usar fora do `if` uma `const` criada dentro dele: `ReferenceError`
- Alterar com `push` a lista recebida numa regra: o teste fica imprevisível e a tela não atualiza
:::

---

## Resumo

:::summary
- Uma função guarda uma regra num lugar só: parâmetros entram, `return` devolve o resultado
- Declaração é içada; expressão e arrow só existem depois da linha que as cria
- Parâmetro padrão cobre o argumento ausente; rest junta o resto num array
- `let` e `const` vivem no bloco em que nasceram, e o que nasce na função fica nela
- Regra pura em `src/regras/`, efeito no handler da tela
:::

---

## Próximos passos

Na aula 38, você usa funções para dividir problemas grandes: decomposição de cima para baixo, recursão numa árvore de categorias e as regras do carrinho saindo do `CarrinhoContext` para `src/regras/carrinho.js`, com testes.

:::tip Antes da aula 38
Abra `src/contexts/CarrinhoContext.js` e responda: quais linhas de `adicionar` só calculam e qual muda o estado? É exatamente essa separação que o laboratório faz.
:::
