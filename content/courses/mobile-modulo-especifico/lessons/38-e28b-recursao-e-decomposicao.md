---
title: Recursão e decomposição
summary: Divida regras grandes em funções pequenas, use recursão numa árvore de categorias e tire as regras do contexto.
module: logica-js
duration_minutes: 40
objectives:
  - Decompor uma regra grande em funções pequenas, de cima para baixo
  - Extrair as regras do carrinho para funções puras que devolvem arrays novos
  - Escrever uma função recursiva com caso base
  - Reconhecer quando um laço é melhor que a recursão
---

# Recursão e decomposição

Programador Mobile: Módulo Específico · Encontro E28 · Aula 38 de 71

---

## O que você vai aprender

:::goal
- Dividir um problema de cima para baixo, começando pela função que a tela precisa
- Reconhecer os sinais de uma função que faz coisas demais
- Tirar as regras do `CarrinhoContext` para funções puras e testá-las com Jest
- Escrever uma função recursiva com caso base numa árvore de categorias
- Escolher entre recursão e laço
:::

---

## O carrinho que ninguém testa

Para conferir se adicionar o mesmo fone duas vezes mostra "2 x", hoje você abre o app, toca, volta, toca de novo e olha. A regra mora dentro do `CarrinhoContext`, misturada com o `setItens`, e o Jest não chega nela sem montar o React.

Agora o cliente pede botões + e − em cada item do carrinho. Do jeito atual, isso é mais regra dentro do contexto e mais toques a cada mudança.

:::question
Como testar a regra do carrinho com um `expect`, sem abrir o app?
:::

---

## :icon[workflow] Decomposição de cima para baixo

**Decomposição** é dividir um problema grande em funções pequenas. **De cima para baixo** (top-down): você escreve primeiro a função que a tela precisa, chamando partes que talvez ainda nem existam, e só depois desce para cada parte.

:::center
![Diagrama: resumoDoPedido chama três partes que já existem: subtotal, do E27, calcularFrete, do E26, e faltaParaFreteGratis, da aula 37](images/e28-decomposicao.svg)
:::

No Carrinho, `resumoDoPedido(itens, cep)` chama `subtotal`, `calcularFrete` e `faltaParaFreteGratis`, que já existem.

:::steps
1. Dê nome à função de cima e decida o que entra e o que sai
2. Escreva o corpo chamando funções com nomes claros, mesmo que ainda não existam
3. Desça e escreva cada uma; pare quando a função for pequena e óbvia
:::

---

## :icon[receipt] Exemplo: o resumo do Carrinho

```javascript
function resumoDoPedido(itens, cep) {
  const valorItens = subtotal(itens);
  const frete = calcularFrete(valorItens, cep); // null se o CEP for inválido
  return {
    valorItens,
    frete,
    falta: faltaParaFreteGratis(valorItens),
    total: valorItens + (frete ?? 0),
  };
}
```

Lida de cima, a função conta a história: soma os itens, calcula o frete, monta o resumo. Cada detalhe mora numa função pequena, que já tem nome e teste.

- A tela do Carrinho só chama `resumoDoPedido(itens, cep)` e mostra os números
- `{ valorItens }` é o atalho de `{ valorItens: valorItens }`, o mesmo do `valor` do contexto
- Mudou a regra do frete? Só `calcularFrete` muda

---

## :icon[shopping-cart] O contexto faz demais

O `adicionar` do `CarrinhoContext`, como está desde o E16:

```jsx
function adicionar(produto) {
  const existe = itens.find((i) => i.id === produto.id);
  if (existe) {
    setItens(itens.map((i) => (i.id === produto.id ? { ...i, qtd: i.qtd + 1 } : i)));
  } else {
    setItens([...itens, { ...produto, qtd: 1 }]);
  }
}
```

Sinais de que é hora de dividir:

- Decide e calcula (procura o item, soma 1) e também tem efeito (`setItens`)
- Para testar, só abrindo o app: a regra não sai do React
- O + e o − vão repetir a mesma busca e a mesma troca de `qtd`
- Em qualquer função: nome com "e" (`validarESalvar`), comentários separando etapas, mais de três parâmetros

---

## :icon[package-check] Regras puras do carrinho

```javascript
// src/regras/carrinho.js, abaixo das funções do E27
export function adicionarItem(itens, produto) {
  const existente = itens.find((item) => item.id === produto.id);
  if (existente) {
    return alterarQuantidade(itens, produto.id, existente.qtd + 1);
  }
  return [...itens, { ...produto, qtd: 1 }];
}

export function removerItem(itens, id) {
  return itens.filter((item) => item.id !== id);
}
```

- Recebem a lista e devolvem **uma lista nova**: nada de `setItens`, nada de React
- `filter`, `map` e `[...itens, novo]` sempre criam um array novo; o E29 e o E34 aprofundam
- `adicionarItem` chama `alterarQuantidade`, que ainda não existe: é o top-down em ação

---

## Pratique

:::example Desafio
Escreva `alterarQuantidade(itens, id, qtd)`:

- devolve uma lista nova em que o item do `id` tem a `qtd` nova
- com `qtd` 0 ou menos, o item sai do carrinho (reaproveite `removerItem`)
- os outros itens não mudam, e a lista recebida também não
:::

:::tip Resposta
```javascript
export function alterarQuantidade(itens, id, qtd) {
  if (qtd <= 0) return removerItem(itens, id);
  return itens.map((item) => (item.id === id ? { ...item, qtd } : item));
}
```

A guarda do E26 resolve o zero chamando outra regra. `{ ...item, qtd }` copia o item e troca só a quantidade; o `map` devolve os outros itens como estavam. Com um `id` que não existe, nenhum item muda.
:::

---

## :icon[plug] O contexto só chama

No `CarrinhoContext`, importe as cinco funções de `../regras/carrinho` e troque o miolo do provedor:

```jsx
// dentro do CarrinhoProvider, logo depois do useState
function adicionar(produto) {
  setItens(adicionarItem(itens, produto));
}
function remover(id) {
  setItens(removerItem(itens, id));
}
function alterar(id, qtd) {
  setItens(alterarQuantidade(itens, id, qtd));
}

const quantidade = contarItens(itens);
const total = subtotal(itens);
const valor = { itens, adicionar, remover, alterar, quantidade, total };
```

Cada função do contexto virou uma linha: a regra pura calcula e o `setItens` guarda. `alterar` é nova, para os botões + e −. O Detalhe, as abas e o Início continuam chamando `useCarrinho()` do mesmo jeito.

---

## :icon[test-tube] Testando as regras

Em `src/regras/carrinho.test.js`, ao lado dos testes do E27:

```javascript
import { adicionarItem } from './carrinho';

const fone = { id: 1, nome: 'Fone Bluetooth', preco: 199.9 };

describe('adicionarItem', () => {
  test('produto novo entra com qtd 1', () => {
    expect(adicionarItem([], fone)).toEqual([{ ...fone, qtd: 1 }]);
  });
  test('produto repetido soma 1 e não altera o carrinho original', () => {
    const itens = [{ ...fone, qtd: 1 }];
    const novos = adicionarItem(itens, fone);
    expect(novos[0].qtd).toBe(2);
    expect(itens[0].qtd).toBe(1);
  });
});
```

Rode `npm test`. O segundo teste confere o resultado e também o carrinho original. Se uma regra fizer `item.qtd++`, a primeira verificação passa e a segunda acusa.

---

## :icon[folder-tree] Uma árvore de categorias

Só nesta aula, imagine que a Lojinha ganhou subcategorias (o catálogo do app não muda):

```plaintext
Casa (1 produto)
├── Cozinha (3)
└── Iluminação (1)
    └── Lâmpadas (2)
```

```javascript
const casa = {
  nome: 'Casa',
  produtos: ['Tapete'],
  subcategorias: [
    { nome: 'Cozinha', produtos: ['Panela', 'Chaleira', 'Faqueiro'], subcategorias: [] },
    {
      nome: 'Iluminação',
      produtos: ['Abajur'],
      subcategorias: [
        { nome: 'Lâmpadas', produtos: ['Lâmpada LED', 'Fita LED'], subcategorias: [] },
      ],
    },
  ],
};
```

Cada subcategoria tem o mesmo formato da categoria. Quantos níveis existem? Não dá para saber: amanhã a loja cria Lâmpadas, Inteligentes. Laços aninhados só alcançam os níveis que você escreveu.

---

## :icon[repeat] Recursão com caso base

**Recursão** é uma função que chama a si mesma para resolver uma parte menor do mesmo problema. Toda recursão precisa de um **caso base**: a situação em que ela responde sem chamar a si mesma.

```javascript
function contarProdutos(categoria) {
  // caso base: categoria sem subcategorias
  if (categoria.subcategorias.length === 0) {
    return categoria.produtos.length;
  }
  // caso recursivo: os próprios mais os de cada subcategoria
  let total = categoria.produtos.length;
  for (const sub of categoria.subcategorias) {
    total += contarProdutos(sub);
  }
  return total;
}

contarProdutos(casa); // 7
```

A cada chamada, o problema diminui um nível, até chegar às folhas da árvore.

---

## :icon[list-tree] Seguindo as chamadas

:::center
![Animação: Casa chama Cozinha, que devolve 3; depois chama Iluminação, que chama Lâmpadas; Lâmpadas devolve 2, Iluminação devolve 1 + 2 = 3 e Casa devolve 1 + 3 + 3 = 7](images/e28-recursao.svg)
:::

Cozinha e Lâmpadas não têm subcategorias: são casos base e devolvem os próprios produtos, 3 e 2. Iluminação devolve 1 + 2 = 3; Casa, 1 + 3 + 3 = 7.

Cada chamada espera as de baixo terminarem. Elas se empilham na **pilha de chamadas**, a mesma do painel Call Stack do React Native DevTools (E23), e desempilham devolvendo o resultado.

Casa é a primeira a começar e a última a terminar: só soma quando Cozinha e Iluminação já responderam, e Iluminação só responde depois de Lâmpadas.

---

## Pense

:::question
Duas versões alteradas de `contarProdutos`. O que cada uma faz com `casa`?

- **A**: sem o `if` do caso base; o resto igual
- **B**: com o `if`, mas o laço chama `contarProdutos(categoria)` em vez de `contarProdutos(sub)`
:::

:::tip Resposta
A funciona e devolve 7. Numa categoria sem subcategorias, o `for` não roda e ela devolve só os próprios produtos: o caso base continua lá, escondido no laço vazio. O `if` só o deixa explícito.

B nunca termina. Casa chama Casa de novo, o problema não diminui e as chamadas se empilham até estourar: `RangeError: Maximum call stack size exceeded`. Toda chamada recursiva precisa receber um problema **menor**.
:::

---

## :icon[scale] Quando não usar recursão

- :icon[list] Lista plana, como o carrinho ou a vitrine: um laço é mais simples de ler
- :icon[layers] Muitos níveis: cada chamada ocupa um lugar na pilha, e a pilha tem limite
- :icon[folder-tree] Use recursão quando o dado é uma árvore de profundidade desconhecida: categorias, comentários com respostas, menus com submenus

```javascript
// funciona, mas é pior que o laço do E27
function subtotalRecursivo(itens, i = 0) {
  if (i === itens.length) return 0;
  return itens[i].preco * itens[i].qtd + subtotalRecursivo(itens, i + 1);
}
```

Com uma lista de 200 mil itens, essa versão estoura a pilha; o `for` do E27 soma sem problema. Se o laço resolve com clareza, fique com o laço.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Recursão sem caso base, ou chamando com o mesmo problema: `Maximum call stack size exceeded`
- Chamar `contarProdutos(sub)` sem somar o resultado: a chamada roda e o valor se perde
- Regra que chama `setItens` ou `router`: deixa de ser pura e o Jest não a testa sozinho
- Mudar o item recebido (`item.qtd++`) e devolver `[...itens]`: a lista é nova, mas o item é o mesmo
- `onPress={alterar(item.id, item.qtd + 1)}` sem arrow: roda na renderização, não no toque
- Dividir demais: uma função de uma linha que só repete o nome de outra
:::

---

## Resumo

:::summary
- De cima para baixo: escreva a função que a tela precisa e depois as partes que ela chama
- Cálculo misturado com efeito, nome com "e" e lógica repetida pedem divisão
- As regras do carrinho são puras e moram em `src/regras/carrinho.js`; o contexto só chama e guarda
- Recursão chama a si mesma com um problema menor e para no caso base
- Para listas planas, prefira o laço; a recursão é para árvores
:::

---

## :icon[flask-conical] No laboratório

As regras do carrinho saem do contexto, ganham testes e viram os botões + e −.

:::steps
1. `adicionarItem`, `removerItem` e `alterarQuantidade` em `src/regras/carrinho.js`
2. Testes: produto novo, repetido, remover, id inexistente, trocar a `qtd`, `qtd` 0, carrinho original intacto
3. `npm test` todo verde
4. `CarrinhoContext` só chamando as regras, com `alterar(id, qtd)`
5. Botões − e + em cada item do Carrinho, com alvo de 44 e `accessibilityLabel`
6. No celular: − até zero remove o item
7. Commit "E28: regras do carrinho em funções puras" e `git push`
:::

**Critérios de entrega**: contexto sem regras; pelo menos 7 testes novos passando; `src/regras/` sem React; + e − funcionando e anunciados pelo leitor de tela. Entregue o link do repositório no sistema.
