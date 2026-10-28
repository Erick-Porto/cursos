---
title: Estado global e hooks
summary: O Context linha a linha, o carrinho com useReducer e as regras do lojinha-regras, e o reducer testado no app.
module: integracao
duration_minutes: 40
objectives:
  - Explicar cada linha da receita de contexto, inclusive por que ele nasce null
  - Organizar as ações do carrinho com useReducer, usando as regras puras do lojinha-regras
  - Configurar o Jest no app com jest-expo e testar o reducer
  - Escolher entre useState, Context, useReducer, um hook de dados e uma biblioteca como Zustand
---

# Estado global e hooks

Programador Mobile · Encontro E42 · Aula 83 de 89

---

## O que você vai aprender

:::goal
- Separar estado local, compartilhado, do servidor e do aparelho
- Ler a receita do contexto linha a linha: `createContext`, `Provider` e `useContext`
- Explicar por que o contexto nasce `null` e para que serve a guarda no hook
- Organizar as ações do carrinho com `useReducer` e as regras de `src/regras/carrinho.js`
- Rodar o Jest no app com o preset `jest-expo` e testar o reducer
- Reconhecer quando o Context não basta e o que o Zustand oferece
:::

---

## O carrinho em cinco lugares

No app da lanchonete, o carrinho aparece em cinco lugares: o número no ícone da aba, o botão "+" do Cardápio, o "Adicionar" do Produto, a tela Carrinho com quantidades e o envio do pedido, que esvazia tudo. Cinco telas e várias ações sobre a mesma lista.

Desde o E31 você copia a receita do contexto, e no E36 ela guardou o carrinho da Lojinha. Hoje ela é explicada linha a linha, e o carrinho ganha um jeito mais organizado de mudar: o `useReducer`.

:::question
O carrinho começa vazio, `[]`. Então por que o contexto nasce com `createContext(null)`, e não com `createContext([])`?
:::

---

## :icon[network] Quatro tipos de estado

| Estado | Exemplo na lanchonete | Onde mora |
|---|---|---|
| local | a categoria escolhida | `useState` na tela |
| compartilhado | o carrinho, o tema | um contexto acima das rotas |
| do servidor | o cardápio, os pedidos e o status | no json-server; um hook busca |
| do aparelho | o carrinho salvo, o nome do cliente | AsyncStorage, no E43 |

- Comece **local**. Suba para um contexto só quando telas que não são mãe e filha precisam do mesmo dado
- Dado do servidor quase nunca vira estado global: cada tela busca o que mostra, por um hook, como o `useProdutos`
- Na dúvida: "se esta tela fechar, alguém sente falta deste dado?"

---

## :icon[file-code] A receita (1): createContext e o null

```jsx
// src/features/carrinho/CarrinhoContext.js
import { createContext, useContext, useReducer } from 'react';

const CarrinhoContext = createContext(null);
```

- `createContext` cria um **canal**: liga quem fornece um valor a quem lê, sem passar props tela por tela
- O argumento é o **valor padrão**: o que `useContext` devolve quando **não há Provider** acima do componente
- `null` é de propósito: significa "esqueceram o Provider", e o hook pode conferir isso
- O `[]` do carrinho vazio não é o padrão: é o estado inicial, e mora dentro do Provider
- O `CarrinhoContext` não tem `export`: ninguém de fora usa o canal direto

Pense num rádio: `createContext` escolhe a frequência, o Provider é a antena e `useContext` é o aparelho sintonizado.

---

## :icon[file-code] A receita (2): o Provider e o value

```jsx
export function CarrinhoProvider({ children }) {
  const [itens, setItens] = useState([]);
  // adicionar, remover, alterar e esvaziar chamam as regras, como no E36
  const valor = { itens, adicionar, remover, alterar, esvaziar, quantidade, total };
  return <CarrinhoContext.Provider value={valor}>{children}</CarrinhoContext.Provider>;
}
```

```jsx
// app/_layout.js
<TemaProvider>
  <CarrinhoProvider>
    <Pilha />
  </CarrinhoProvider>
</TemaProvider>
```

:::center
![Diagrama: o CarrinhoProvider, dentro do TemaProvider, envolve a Pilha; o ícone da aba, a TelaProduto e a TelaCarrinho leem o mesmo value com useCarrinho()](images/e42-provider-arvore.svg)
:::

- O `Provider` entrega o `value` a **todos** os componentes abaixo dele, em qualquer profundidade
- `children` são as telas: o `CarrinhoProvider` só as envolve
- Quem lê recebe o valor do Provider **mais próximo acima**: dois Providers, dois carrinhos
- Quando `itens` muda, `valor` é um objeto novo e todos que leem o contexto renderizam de novo

---

## :icon[file-code] A receita (3): useContext e a guarda

```jsx
export function useCarrinho() {
  const valor = useContext(CarrinhoContext);
  if (!valor) throw new Error('useCarrinho precisa estar dentro do CarrinhoProvider');
  return valor;
}
```

- `useContext` sobe a árvore e devolve o `value` do Provider mais próximo. Sem Provider, devolve o padrão: `null`
- A **guarda** transforma o esquecimento num erro claro, com o nome do Provider que falta
- As telas chamam `useCarrinho()`, nunca `useContext(CarrinhoContext)`: o hook é a porta da frente
- O `useCarrinho` do E36 já tinha a guarda; o `useTema` do E31, não. No app da equipe, acrescente

O arquivo exporta duas coisas: o `CarrinhoProvider`, para o layout, e o `useCarrinho`, para as telas.

---

## Pense

:::question
Um colega escreve `createContext({ itens: [], adicionar: () => {} })` "para nunca dar erro" e esquece o `CarrinhoProvider` no `_layout.js`. O que o cliente vê ao tocar em "Adicionar"? E com `createContext(null)` e a guarda no `useCarrinho`?
:::

:::tip Resposta
Com o padrão falso, nada quebra e nada funciona: o toque chama a função vazia, o carrinho segue com zero itens e ninguém sabe por quê. O bug aparece no dia da demonstração.

Com `null` e a guarda, o app para na hora, com "useCarrinho precisa estar dentro do CarrinhoProvider". O erro diz o que falta e onde. É por isso que o contexto nasce `null`.
:::

---

## :icon[workflow] useReducer: muitas ações, um estado

Com `useState`, cada função do Provider calcula a lista nova do seu jeito. Com **`useReducer`**, toda mudança passa por uma função só, o **reducer**:

```jsx
const [itens, dispatch] = useReducer(carrinhoReducer, []);

dispatch({ type: 'adicionar', produto }); // a tela diz o que aconteceu
dispatch({ type: 'alterar', id: '2', qtd: 3 });
dispatch({ type: 'esvaziar' });
```

| | `useState` | `useReducer` |
|---|---|---|
| Muda com | `setItens(novaLista)` | `dispatch({ type, ... })` |
| A regra mora | em cada função | no reducer, num lugar só |
| Testar sem React | difícil | é só chamar a função |
| Combina com | um valor, poucas ações | várias ações no mesmo estado |

A **ação** é um objeto com `type` e os dados de que ela precisa.

---

## :icon[code] O reducer do carrinho

Em `src/features/carrinho/carrinhoReducer.js`, com as regras do E07 e do E09, copiadas do `lojinha-regras` para `src/regras/`:

```javascript
import { adicionarItem, alterarQuantidade, removerItem } from '../../regras/carrinho';
export function carrinhoReducer(itens, acao) {
  switch (acao.type) {
    case 'adicionar':
      return adicionarItem(itens, acao.produto);
    case 'alterar':
      return alterarQuantidade(itens, acao.id, acao.qtd);
    case 'remover':
      return removerItem(itens, acao.id);
    case 'esvaziar':
      return [];
    default:
      throw new Error('Ação desconhecida: ' + acao.type);
  }
}
```

- O reducer recebe o estado atual e a ação e **devolve** o estado novo; quem faz a conta é a regra, já testada no `lojinha-regras`
- Cada regra devolve uma lista nova: nada de `push` em `itens`
- É puro: nada de `fetch`, de `set...` ou de navegação aqui dentro
- `alterarQuantidade` com 0 tira o item; ação com nome errado cai no `default`, que avisa na hora

---

## :icon[zap] O Provider com dispatch

```jsx
export function CarrinhoProvider({ children }) {
  const [itens, dispatch] = useReducer(carrinhoReducer, []);
  const valor = {
    itens,
    quantidade: contarItens(itens),
    total: subtotal(itens),
    adicionar: (produto) => dispatch({ type: 'adicionar', produto }),
    alterar: (id, qtd) => dispatch({ type: 'alterar', id, qtd }),
    remover: (id) => dispatch({ type: 'remover', id }),
    esvaziar: () => dispatch({ type: 'esvaziar' }),
  };
  return <CarrinhoContext.Provider value={valor}>{children}</CarrinhoContext.Provider>;
}
```

- O `value` tem o formato do E36: as telas continuam chamando `adicionar(produto)`, e o `dispatch` fica escondido no Provider
- `quantidade` e `total` vêm de `contarItens` e `subtotal`, do mesmo `regras/carrinho.js`, que soma em centavos: não são estado
- Trocar `useState` por `useReducer` não mudou nenhuma tela. É a vantagem de ter o hook como porta da frente
- Depois do POST do pedido, a tela Carrinho chama `esvaziar()`

---

## :icon[warehouse] Estoque: o erro fica fora do reducer

Na Lojinha, o item guarda o `estoque`, e `adicionarItem` lança `EstoqueInsuficienteError` (E17) quando a quantidade passa dele. Desde o E32, quem chama a regra trata o erro esperado com um `Alert`. O reducer não pode fazer isso: ele é puro. A conferência vem **antes** do `dispatch`, no Provider:

```jsx
function adicionar(produto) {
  try {
    adicionarItem(itens, produto); // só confere: a regra é pura, nada muda
    dispatch({ type: 'adicionar', produto });
  } catch (erro) {
    if (!(erro instanceof ErroDeNegocio)) throw erro; // bug: não esconda
    Alert.alert('Carrinho', erro.message);
  }
}
```

- Chamar a regra uma vez a mais é seguro: ela só devolve uma lista nova, que aqui é descartada
- Se ela lança, o `dispatch` nem acontece, e o carrinho segue igual
- O `alterar` segue o mesmo molde, com `alterarQuantidade`
- Na lanchonete, o produto não tem `estoque`: a regra nunca lança, e o `dispatch` direto basta

---

## :icon[settings] Jest no app: o preset jest-expo

No E30, os testes ficaram no `lojinha-regras`, porque o app ainda não rodava o Jest. Lá, o Jest do E04 lia código do Node com o `babel-jest`. O app tem JSX e módulos do React Native, e quem ensina o Jest a lê-los é o preset **`jest-expo`**:

```bash
npx expo install jest-expo jest -- --save-dev
```

```json
"scripts": { "test": "jest" },
"jest": { "preset": "jest-expo" }
```

- `test`, `expect`, `toEqual` e `toThrow` são os mesmos do E04
- O `npm test` acha todo `*.test.js` do app: os do reducer e os das regras que vieram do `lojinha-regras`
- No app da equipe, `npm test` verde antes de abrir cada PR

---

## :icon[test-tube] O reducer se testa sem React

```javascript
// src/features/carrinho/carrinhoReducer.test.js
import { carrinhoReducer } from './carrinhoReducer';

const xBurger = { id: '1', nome: 'X-Burger', preco: 22.9 };

test('o mesmo lanche duas vezes soma a quantidade', () => {
  const um = carrinhoReducer([], { type: 'adicionar', produto: xBurger });
  const dois = carrinhoReducer(um, { type: 'adicionar', produto: xBurger });
  expect(dois).toEqual([{ ...xBurger, qtd: 2 }]);
  expect(um[0].qtd).toBe(1); // o estado antigo continua igual
});

test('ação desconhecida lança erro', () => {
  expect(() => carrinhoReducer([], { type: 'pagar' })).toThrow('Ação desconhecida');
});
```

- Sem tela, sem celular, sem json-server: o reducer é uma função, como as do `lojinha-regras`
- O último `expect` do primeiro teste prova que o estado antigo não foi alterado
- As regras já têm testes próprios; aqui você testa o que o reducer acrescenta: as ações e o `default`

---

## :icon[gauge] Quando o Context não basta

O Context dá conta de um app de cinco telas. Ele pesa nestes casos:

| Sinal | O que acontece | Saída |
|---|---|---|
| um `AppContext` com tudo | mudar o carrinho renderiza quem só lê o tema | um contexto por assunto |
| cada item da lista lê o contexto | 40 cartões renderizam a cada "+" | ler no pai e passar props |
| cardápio guardado no contexto | cópia velha, sem carregando nem erro | um hook que busca |
| muitos contextos aninhados | o `_layout.js` vira uma pirâmide | uma biblioteca de estado |

Por isso o tema e o carrinho ficam em contextos separados: somar um lanche não redesenha quem só lê as cores.

---

## :icon[boxes] Zustand, como visão

O **Zustand** é uma biblioteca pequena de estado global. Você cria uma **store**, que já é um hook, e não precisa de Provider:

```javascript
import { create } from 'zustand';
import { carrinhoReducer } from './carrinhoReducer';

export const useCarrinhoStore = create((set) => ({
  itens: [],
  adicionar: (produto) =>
    set((estado) => ({ itens: carrinhoReducer(estado.itens, { type: 'adicionar', produto }) })),
  esvaziar: () => set({ itens: [] }),
}));
```

```jsx
const itens = useCarrinhoStore((estado) => estado.itens);
```

- A função passada ao hook é um **seletor**: o componente só renderiza de novo quando aquele pedaço muda
- O reducer puro serve aqui também: a regra não depende de onde o estado mora
- Instale com `npx expo install zustand` quando o Context pesar. No projeto integrador, Context e `useReducer` bastam

---

## :icon[blocks] Dado do servidor: um hook por tela

Em `src/features/pedidos/usePedidos.js`, com os imports de `react`, de `../../api/pedidos` e do `ErroDeNegocio`:

```javascript
export function usePedidos() {
  const [pedidos, setPedidos] = useState(null); // null: ainda não chegou
  const [erro, setErro] = useState(null);
  async function recarregar() {
    setPedidos(null); setErro(null);
    try {
      setPedidos(await listarPedidos());
    } catch (e) {
      if (!(e instanceof ErroDeNegocio)) throw e; // bug: não esconda (E39)
      setErro(e.message);
    }
  }
  useEffect(() => { recarregar(); }, []);
  return { pedidos: pedidos ?? [], carregando: pedidos === null && !erro, erro, recarregar };
}
```

- A `TelaPedidos` só faz `const { pedidos, carregando, erro, recarregar } = usePedidos();`
- `carregando` é calculado: sem lista e sem erro, ainda está buscando
- É o molde do `useTarefas` do E24 e do `useProdutos` da aula 82, sem páginas
- Como você viu no E24, cada chamada de `usePedidos()` tem estados **próprios**: um hook divide a lógica, não os dados

---

## :icon[triangle-alert] Erros comuns

:::warning
- `createContext([])` ou com funções vazias: o Provider esquecido vira um bug silencioso
- Telas com `useContext(CarrinhoContext)` em vez de `useCarrinho()`: a guarda se perde
- Chamar o hook no mesmo componente que renderiza o Provider: ele ainda não enxerga o valor
- `itens.push(...)` no reducer, em vez da regra: a referência não muda e a tela não atualiza
- `fetch`, `Alert` ou navegação dentro do reducer: ele precisa ser puro
- `npm test` sem o preset `jest-expo`: o Jest para em "Cannot use import statement outside a module"
- Achar que duas telas com `usePedidos()` dividem a mesma lista
:::

---

## Resumo

:::summary
- Estado local fica na tela; compartilhado, num contexto; do servidor, num hook que busca; do aparelho, no AsyncStorage do E43
- `createContext(null)` cria o canal, o `Provider` entrega o `value` abaixo dele e `useContext` lê o Provider mais próximo
- O `null` mais a guarda no hook transformam o Provider esquecido num erro claro
- `useReducer` concentra as ações num reducer puro, que usa as regras do `lojinha-regras` e se testa com o Jest e o `jest-expo`
- Context dividido por assunto basta no projeto; Zustand é a saída quando ele pesar
:::

---

## :icon[flask-conical] No laboratório

:::steps
1. `db.json` do briefing e json-server no ar, visto no celular
2. `.env` fora do Git, `.env.example` e `src/api/` com o `cliente.js` do `lojinha-regras` e um arquivo por coleção
3. `src/features/`, tema e kit de UI da Lojinha, com as cores da equipe
4. Abas e pilha com as 5 telas do protótipo
5. Contexto do domínio com `useReducer`, guarda e 2 testes com o `jest-expo`
6. Tela principal com dados do json-server por um hook: carregando, erro e puxar para atualizar
7. Um PR revisado por parte; por último, `feat: E42 arquitetura e estado global`
:::

**Critérios**: 5 telas navegáveis; dados do `db.json` na tela principal; nenhum `fetch` fora de `src/api/`; `npm test` verde. **Para casa**: o Início da Lojinha com o `useProdutos`.
