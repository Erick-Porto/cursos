---
title: Estado global e hooks
summary: Entenda o Context linha a linha, organize as ações do carrinho com useReducer e saiba quando o Context não basta.
module: integracao
duration_minutes: 40
objectives:
  - Explicar cada linha da receita de contexto, inclusive por que ele nasce null
  - Organizar um estado com várias ações usando useReducer e um reducer testado
  - Escolher entre useState, Context, useReducer e uma biblioteca como Zustand
  - Criar hooks próprios que escondem das telas o estado e as chamadas à API
---

# Estado global e hooks

Programador Mobile: Módulo Específico · Encontro E42 · Aula 66 de 71

---

## O que você vai aprender

:::goal
- Separar estado local, compartilhado, do servidor e do aparelho
- Ler a receita do contexto linha a linha: `createContext`, `Provider` e `useContext`
- Explicar por que o contexto nasce `null` e para que serve a guarda no hook
- Organizar as ações do carrinho com `useReducer` e testar o reducer no Jest
- Reconhecer quando o Context não basta e o que o Zustand oferece
- Criar hooks próprios que entregam às telas dados e estados prontos
:::

---

## O carrinho em cinco lugares

No app da lanchonete, o carrinho aparece em cinco lugares: o número no ícone da aba, o botão "+" do Cardápio, o "Adicionar" do Produto, a tela Carrinho com quantidades e o envio do pedido, que esvazia tudo. Cinco telas e várias ações sobre a mesma lista.

Desde o E11 você copia a receita do contexto. Hoje ela é explicada linha a linha, e o carrinho ganha um jeito mais organizado de mudar: o `useReducer`.

:::question
O carrinho começa vazio, `[]`. Então por que o contexto nasce com `createContext(null)`, e não com `createContext([])`?
:::

---

## :icon[network] Quatro tipos de estado

| Estado | Exemplo na lanchonete | Onde mora |
|---|---|---|
| local | a categoria escolhida, o texto da observação | `useState` na tela |
| compartilhado | o carrinho, o tema | um contexto acima das rotas |
| do servidor | o cardápio, os pedidos e o status | no json-server; um hook busca |
| do aparelho | o carrinho salvo, o nome do cliente | AsyncStorage, por `servicos/` |

- Comece **local**. Suba para um contexto só quando telas que não são mãe e filha precisam do mesmo dado
- Dado do servidor quase nunca vira estado global: cada tela busca o que mostra, por um hook
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
  // adicionar, remover, quantidade e total, como no E16
  const valor = { itens, adicionar, remover, quantidade, total };
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
- O `useTema` do E11 não tem a guarda. No app da equipe, acrescente

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
dispatch({ type: 'remover', id: '2' });
dispatch({ type: 'limpar' });
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

Em `src/features/carrinho/carrinhoReducer.js`:

```javascript
export function carrinhoReducer(itens, acao) {
  switch (acao.type) {
    case 'adicionar': {
      const existe = itens.some((i) => i.id === acao.produto.id);
      if (!existe) return [...itens, { ...acao.produto, qtd: 1 }];
      return itens.map((i) => (i.id === acao.produto.id ? { ...i, qtd: i.qtd + 1 } : i));
    }
    case 'remover':
      return itens.filter((i) => i.id !== acao.id);
    case 'limpar':
      return [];
    default:
      throw new Error('Ação desconhecida: ' + acao.type);
  }
}
```

- Recebe o estado atual e a ação e **devolve** o estado novo; nunca muda `itens` com `push`
- É puro: nada de `fetch`, de `set...` ou de navegação aqui dentro
- As chaves do `case 'adicionar'` criam um bloco para o `const`
- Ação com nome errado? O `default` avisa na hora

---

## :icon[zap] O Provider com dispatch

```jsx
export function CarrinhoProvider({ children }) {
  const [itens, dispatch] = useReducer(carrinhoReducer, []);
  const valor = {
    itens,
    quantidade: itens.reduce((soma, i) => soma + i.qtd, 0),
    total: itens.reduce((soma, i) => soma + i.preco * i.qtd, 0),
    adicionar: (produto) => dispatch({ type: 'adicionar', produto }),
    remover: (id) => dispatch({ type: 'remover', id }),
    limpar: () => dispatch({ type: 'limpar' }),
  };
  return <CarrinhoContext.Provider value={valor}>{children}</CarrinhoContext.Provider>;
}
```

- As telas continuam chamando `adicionar(produto)`: o `dispatch` fica escondido no Provider
- `quantidade` e `total` são calculados a partir de `itens`: não são estado
- Trocar `useState` por `useReducer` não mudou nenhuma tela. É a vantagem de ter o hook como porta da frente
- Depois do POST do pedido, a tela Carrinho chama `limpar()`

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

- Sem tela, sem celular, sem json-server: o reducer é uma função como as `regras/` da Lojinha
- O último `expect` do primeiro teste prova que o estado antigo não foi alterado
- No app da equipe, o Jest segue a configuração do E24, com o preset `jest-expo`

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
  limpar: () => set({ itens: [] }),
}));
```

```jsx
const itens = useCarrinhoStore((estado) => estado.itens);
```

- A função passada ao hook é um **seletor**: o componente só renderiza de novo quando aquele pedaço muda
- O reducer puro serve aqui também: a regra não depende de onde o estado mora
- Instale com `npx expo install zustand` quando o Context pesar. No projeto integrador, Context e `useReducer` bastam

---

## :icon[blocks] Hooks próprios: a porta da frente da tela

Em `src/features/pedidos/usePedidos.js`, com os imports de `react` e de `../../api/pedidos`:

```javascript
export function usePedidos() {
  const [pedidos, setPedidos] = useState(null); // null: ainda não chegou
  const [erro, setErro] = useState(null);
  async function recarregar() {
    setPedidos(null); setErro(null);
    try {
      setPedidos(await listarPedidos());
    } catch (e) {
      setErro(e.message);
    }
  }
  useEffect(() => { recarregar(); }, []);
  const carregando = pedidos === null && !erro;
  return { pedidos: pedidos ?? [], carregando, erro, recarregar };
}
```

- A `TelaPedidos` só faz `const { pedidos, carregando, erro, recarregar } = usePedidos();`
- `carregando` é calculado: sem lista e sem erro, ainda está buscando
- Como o `useProdutos` do E40, a tela não sabe de `fetch`, IP nem json-server
- Cada chamada de `usePedidos()` tem estados **próprios**: um hook compartilha a lógica, não os dados

---

## :icon[triangle-alert] Erros comuns

:::warning
- `createContext([])` ou com funções vazias: o Provider esquecido vira um bug silencioso
- Telas com `useContext(CarrinhoContext)` em vez de `useCarrinho()`: a guarda se perde
- Chamar o hook no mesmo componente que renderiza o Provider: ele ainda não enxerga o valor
- `itens.push(...)` no reducer: a referência não muda e a tela não atualiza
- `fetch` ou navegação dentro do reducer: ele precisa ser puro
- Um `AppContext` com tudo: qualquer mudança redesenha o app inteiro
- Achar que duas telas com `usePedidos()` dividem a mesma lista
:::

---

## Resumo

:::summary
- Estado local fica na tela; compartilhado, num contexto; do servidor, num hook que busca; do aparelho, em `servicos/`
- `createContext(null)` cria o canal, o `Provider` entrega o `value` abaixo dele e `useContext` lê o Provider mais próximo
- O `null` mais a guarda no hook transformam o Provider esquecido num erro claro
- `useReducer` concentra as ações num reducer puro, testável no Jest, e as telas não percebem a troca
- Context dividido por assunto basta no projeto; Zustand é a saída quando ele pesar
:::

---

## :icon[flask-conical] No laboratório

O esqueleto do app da equipe, ligado ao json-server.

:::steps
1. `db.json` do briefing e json-server no ar, testado no navegador do celular
2. `.env` com o seu IP, `.env.example` e `src/api/` com um arquivo por coleção
3. `src/features/`, tema e kit de UI da Lojinha, com as cores da equipe
4. Abas e pilha com as 5 telas do protótipo
5. Contexto do domínio com `useReducer`, guarda e 2 testes do reducer
6. Tela principal com dados do json-server, carregando e erro
7. Uma branch e um PR revisado por parte; por último, `feat: E42 arquitetura e estado global`
:::

**Critérios**: 5 telas navegáveis; dados do `db.json` na tela principal; nenhum `fetch` fora de `src/api/`; `npm test` verde. Entregue o link do repositório no sistema.
