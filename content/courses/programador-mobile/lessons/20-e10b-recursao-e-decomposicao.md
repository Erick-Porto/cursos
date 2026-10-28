---
title: Recursão e decomposição
summary: Divida um script que faz tudo em funções pequenas, tire as regras do script e use recursão numa árvore de categorias.
module: linguagem-js
duration_minutes: 40
objectives:
  - Decompor uma regra grande em funções pequenas, de cima para baixo
  - Separar o cálculo em src/regras e deixar em src/scripts só a impressão
  - Escrever uma função recursiva com caso base
  - Reconhecer quando um laço é melhor que a recursão
---

# Recursão e decomposição

Programador Mobile · Encontro E10 · Aula 20 de 89

---

## O que você vai aprender

:::goal
- Dividir um problema de cima para baixo, começando pela função que o script precisa
- Reconhecer os sinais de um código que faz coisas demais
- Tirar as contas de um script para funções puras em `src/regras/` e testá-las com Jest
- Escrever uma função recursiva com caso base numa árvore de categorias
- Escolher entre recursão e laço
:::

---

## O resumo que só se confere no olho

O `lojinha-regras` ganhou um script que imprime o resumo do carrinho: itens, frete e total. Para saber se o total está certo, você roda o script, lê o terminal e confere com a calculadora.

Agora a loja quer o mesmo resumo no app, a partir do E30. Do jeito atual, a conta está presa ao script: o app teria de copiá-la, e o Jest não tem o que testar, porque o script só imprime.

:::question
Como conferir o total com um `expect`, sem rodar o script e ler o terminal?
:::

---

## :icon[scroll-text] O script faz demais

`src/scripts/resumo-do-carrinho.js`, do jeito que foi escrito às pressas:

```javascript
const itens = [
  { id: 5, nome: 'Garrafa Térmica', preco: 79.9, qtd: 1 },
  { id: 11, nome: 'Livro de Receitas', preco: 59.9, qtd: 1 },
];
let centavos = 0;
for (const item of itens) {
  centavos = centavos + Math.round(item.preco * 100) * item.qtd;
}
let frete = 9.9; // a regra do frete, copiada à mão
if (centavos >= 15000) {
  frete = 0;
}
console.log(`Itens: R$ ${(centavos / 100).toFixed(2)}`);
console.log(`Frete: R$ ${frete.toFixed(2)}`);
console.log(`Total: R$ ${(centavos / 100 + frete).toFixed(2)}`);
```

- Calcula e imprime no mesmo lugar: o `expect` não alcança a conta
- Refaz o que já existe: `subtotal` e `calcularFrete`, e a cópia do frete já está errada para o Rio
- Soma reais com reais no total, o problema do E05

---

## :icon[workflow] Decomposição de cima para baixo

**Decomposição** é dividir um problema grande em funções pequenas. **De cima para baixo** (top-down): você escreve primeiro a função que o script precisa, chamando partes que talvez ainda nem existam, e só depois desce para cada parte.

:::center
![Diagrama: resumoDoCarrinho chama quatro partes: contarItens, do E09, subtotal, do E07, e calcularFreteComCache, da aula 19, que já existem, e somarReais, tracejada, que ainda não existe](images/e10-decomposicao.svg)
:::

:::steps
1. Dê nome à função de cima e decida o que entra e o que sai
2. Escreva o corpo chamando funções com nomes claros, mesmo que ainda não existam
3. Desça e escreva cada uma; pare quando a função for pequena e óbvia
:::

---

## :icon[receipt] Exemplo: o resumo do carrinho

```javascript
// src/regras/carrinho.js, abaixo de subtotal e contarItens
import { calcularFreteComCache } from './frete.js'; // import novo, no topo
// e somarReais entra no import de './precos.js' que já existe

export function resumoDoCarrinho(itens, cep) {
  const valorItens = subtotal(itens);
  const frete = calcularFreteComCache(valorItens, cep);
  return {
    quantidade: contarItens(itens),
    valorItens,
    frete,
    total: somarReais(valorItens, frete),
  };
}
```

Lida de cima, a função conta a história: soma os itens, calcula o frete, monta o resumo. Cada detalhe mora numa função pequena, com nome e teste.

- Devolve um objeto e não imprime nada: quem decide o que fazer com ele é quem chama
- `valorItens` sozinho é o atalho de `valorItens: valorItens`
- `somarReais` ainda não existe: é o top-down em ação

---

## Pratique

:::example Desafio
Escreva `somarReais(a, b)` em `src/regras/precos.js`:

- soma dois valores em reais e devolve o resultado em reais
- sem o erro do ponto flutuante: `139.8 + 9.9` dá `149.70000000000002`, e `somarReais(139.8, 9.9)` deve dar `149.7`
- reaproveite as funções do E05 que já moram nesse arquivo
:::

:::tip Resposta
```javascript
export function somarReais(a, b) {
  return paraReais(paraCentavos(a) + paraCentavos(b));
}
```

Cada valor vira centavos inteiros, a soma é exata e o resultado volta para reais uma vez, no fim. Uma linha, mas com nome: quem lê `somarReais(valorItens, frete)` entende sem conhecer o truque dos centavos.
:::

---

## :icon[terminal] O script só imprime

```javascript
// src/scripts/resumo-do-carrinho.js
import { resumoDoCarrinho } from '../regras/carrinho.js';
import { formatarPreco } from '../utils/formatar.js';

const itens = [
  { id: 5, nome: 'Garrafa Térmica', preco: 79.9, qtd: 1 },
  { id: 11, nome: 'Livro de Receitas', preco: 59.9, qtd: 1 },
];
const resumo = resumoDoCarrinho(itens, '01001000');

console.log(`Itens (${resumo.quantidade}): ${formatarPreco(resumo.valorItens)}`);
console.log(`Frete: ${formatarPreco(resumo.frete)}`);
console.log(`Total: ${formatarPreco(resumo.total)}`);
```

| Pasta | O que faz | Como você confere |
|---|---|---|
| `src/regras/` | calcula e devolve, sem `console.log` | `expect` no Jest |
| `src/scripts/` | monta os dados, chama as regras e imprime | rodando no terminal |

No E30, `src/regras/` vai inteira para o app. Muda só quem chama: a tela no lugar do script.

---

## :icon[test-tube] Testando a regra

Em `src/regras/carrinho.test.js`, ao lado dos testes do E07 e do E09:

```javascript
import { resumoDoCarrinho } from './carrinho.js';

const garrafa = { id: 5, nome: 'Garrafa Térmica', preco: 79.9 };
const livro = { id: 11, nome: 'Livro de Receitas', preco: 59.9 };

describe('resumoDoCarrinho', () => {
  test('soma os itens, o frete e o total', () => {
    const itens = [{ ...garrafa, qtd: 1 }, { ...livro, qtd: 1 }];
    expect(resumoDoCarrinho(itens, '01001000')).toEqual({
      quantidade: 2, valorItens: 139.8, frete: 9.9, total: 149.7,
    });
  });
});
```

Rode `npm test`. O total que você conferia com a calculadora agora é conferido a cada `npm test`, e o CI do E04 faz o mesmo a cada `push`. Se alguém trocar o `somarReais` por um `+`, o teste acusa `149.70000000000002`.

---

## :icon[folder-tree] Uma árvore de categorias

Só nesta aula, imagine que a Lojinha ganhou subcategorias (o catálogo de verdade não muda):

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

Cada subcategoria tem o mesmo formato da categoria. Quantos níveis existem? Não dá para saber: amanhã a loja cria Lâmpadas, Inteligentes. Um `for` dentro de outro só alcança os níveis que você escreveu.

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
![Animação: Casa chama Cozinha, que devolve 3; depois chama Iluminação, que chama Lâmpadas; Lâmpadas devolve 2, Iluminação devolve 1 + 2 = 3 e Casa devolve 1 + 3 + 3 = 7](images/e10-recursao.svg)
:::

Cozinha e Lâmpadas não têm subcategorias: são casos base e devolvem os próprios produtos, 3 e 2. Iluminação devolve 1 + 2 = 3; Casa, 1 + 3 + 3 = 7.

Cada chamada espera as de baixo terminarem. Elas se empilham na **pilha de chamadas**, a mesma do painel Call Stack do depurador (E03), e desempilham devolvendo o resultado.

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

- :icon[list] Lista plana, como o carrinho ou a vitrine: um laço ou um `reduce` é mais simples de ler
- :icon[layers] Muitos níveis: cada chamada ocupa um lugar na pilha, e a pilha tem limite
- :icon[folder-tree] Use recursão quando o dado é uma árvore de profundidade desconhecida: categorias, comentários com respostas, menus com submenus

```javascript
// funciona, mas é pior que o subtotal do E07, com for...of
function subtotalRecursivo(itens, i = 0) {
  if (i === itens.length) return 0;
  return itens[i].preco * itens[i].qtd + subtotalRecursivo(itens, i + 1);
}
```

Com uma lista de 200 mil itens, essa versão estoura a pilha; o `for...of` do `subtotal` do E07 soma sem problema. Se o laço resolve com clareza, fique com o laço.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Recursão sem caso base, ou chamando com o mesmo problema: `Maximum call stack size exceeded`
- Chamar `contarProdutos(sub)` sem somar o resultado: a chamada roda e o valor se perde
- `console.log` dentro de uma regra: ela passa a ter efeito, e o teste enche o terminal; a regra devolve, o script imprime
- Script que refaz a conta em vez de chamar a regra: duas versões da mesma regra, e uma delas fica velha
- Dividir demais: uma função de uma linha que só repete o nome de outra
:::

---

## Resumo

:::summary
- De cima para baixo: escreva a função que o script precisa e depois as partes que ela chama
- Cálculo misturado com impressão, conta repetida e nomes com "e" pedem divisão
- As contas moram em `src/regras/` e devolvem valores; `src/scripts/` só monta os dados e imprime
- Recursão chama a si mesma com um problema menor e para no caso base
- Para listas planas, prefira o laço; a recursão é para árvores
:::

---

## :icon[flask-conical] No laboratório

Frete com cache, debounce no terminal e o resumo fora do script.

:::steps
1. `src/utils/funcoes.js` com `memoize` e `debounce`, exportados por nome
2. `src/utils/funcoes.test.js`: o `memoize` com `jest.fn()`, inclusive o `0` guardado
3. `src/regras/frete.js` com `calcularFrete` e `calcularFreteComCache`, com testes
4. `src/scripts/demo-debounce.js`: uma busca com 120 ms entre letras, quatro com 400 ms
5. `resumo-do-carrinho.js` do jeito "tudo junto"; anote a saída
6. `somarReais` e `resumoDoCarrinho`, com testes; o script só chama e imprime, com os mesmos valores
7. `npm test` verde, commit "E10: closures, memoize e decomposição" e `git push`
:::

**Critérios de entrega**: nenhum `console.log` em `src/regras/` e `src/utils/`; script sem contas; `memoize` criado uma vez, em `frete.js`; pelo menos 8 testes novos. Entregue o link do repositório no sistema.

---

## :icon[milestone] Projeto 2 · Etapa 3: validação e debounce

No `agenda-de-contatos`:

- `src/regras/validacao.js`: um validador pequeno por campo e `validarContato(dados)`, que junta as mensagens num objeto (`{}` quando está tudo certo)
- `debounce(fn, espera)` em `src/utils/funcoes.js` e o script `digitar.js`: digitação rápida, uma busca só
- `doGrupo(grupo)`, que devolve o teste para o `filter`
- testes dos validadores, de `validarContato` e de `doGrupo`

Commit: `Projeto 2: etapa 3, validação e debounce`. Enunciado completo: página do curso, em **Projetos**.
