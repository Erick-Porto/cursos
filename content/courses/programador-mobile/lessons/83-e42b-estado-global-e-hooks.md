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
- Reconhecer quando o Context não dá conta e o que o Zustand oferece
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **contexto** | um jeito de várias telas lerem o mesmo dado, sem passar props de tela em tela |
| **Provider** | o componente que entrega o valor do contexto a todos os que estão abaixo dele |
| **guarda** | um `if` no começo da função que para tudo com um erro claro quando falta algo |
| **reducer** | uma função que recebe o estado atual e uma ação e devolve o estado novo |
| **ação** | um objeto que diz o que aconteceu, como `{ type: 'esvaziar' }` |
| **preset** | um pacote de configurações prontas; aqui, o que ensina o Jest a ler o app |

---

## O carrinho em cinco lugares

No app da lanchonete, o carrinho aparece em cinco lugares: o número no ícone da aba, o botão "+" do Cardápio, o "Adicionar" do Produto, a tela Carrinho com quantidades e o envio do pedido, que esvazia tudo. Cinco telas e várias ações sobre a mesma lista.

Desde o E31 você copia a receita do contexto, e no E36 ela guardou o carrinho da Lojinha. Hoje ela é explicada linha a linha, e o carrinho ganha um jeito mais organizado de mudar: o `useReducer`.

:::question
O carrinho começa vazio, `[]`. Então por que o contexto nasce com `createContext(null)`, e não com `createContext([])`?
:::

---

## Tipos de estado

Que recado fica só com você, e qual vai para o quadro da geladeira?

---

## :icon[network] Quatro tipos de estado

O **estado** é o placar do app: o dado que, quando muda, faz a tela se redesenhar. Ele mora num lugar diferente conforme quem precisa dele:

| Estado | Exemplo na lanchonete | Onde mora | Lembra |
|---|---|---|---|
| local | a categoria escolhida | `useState` na tela | o placar de uma mesa de jogo |
| compartilhado | o carrinho, o tema | um contexto acima das rotas | o quadro de avisos da casa |
| do servidor | o cardápio, os pedidos e o status | no json-server; um hook busca | a cozinha, pelo garçom |
| do aparelho | o carrinho salvo, o nome do cliente | AsyncStorage, no E43 | a gaveta do celular |

---

## :icon[compass] Onde guardar cada dado

- Comece **local**. Suba para um contexto só quando telas que não são mãe e filha precisam do mesmo dado
- Dado do servidor quase nunca vira estado global: cada tela busca o que mostra, por um hook, como o `useProdutos`
- Na dúvida: "se esta tela fechar, alguém sente falta deste dado?"

:::example
A categoria escolhida no Cardápio só importa ao Cardápio: estado local. O carrinho aparece em cinco telas: contexto. A lista de pedidos está no json-server: um hook que busca.
:::

---

## Contexto

Como avisar todo mundo da casa sem passar de cômodo em cômodo?

---

## :icon[megaphone] O contexto: um quadro de avisos

Um **contexto** deixa várias telas lerem o mesmo dado, sem passar props de tela em tela. É o quadro de avisos da casa: todos os cômodos leem o mesmo aviso.

A receita tem três peças:

| Peça | No quadro de avisos | No código |
|---|---|---|
| `createContext` | fazer o quadro | cria o canal, ainda sem valor |
| `Provider` | pendurar o quadro e escrever o aviso | entrega o `value` a quem está abaixo |
| `useContext` | ir até o quadro e ler | devolve o `value` do Provider mais próximo |

Na lanchonete, o aviso do quadro é o carrinho: cinco telas leem a mesma lista.

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

Sem Provider, é como procurar o quadro na parede e não achar: quem lê recebe o padrão, `null`.

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

## :icon[megaphone] Contexto na prática

Três telas leem o mesmo carrinho, cada uma o pedaço de que precisa:

```jsx
// app/(tabs)/_layout.js: o número na aba
const { quantidade } = useCarrinho();

// TelaProduto: o botão Adicionar
const { adicionar } = useCarrinho();

// TelaCarrinho: a lista, o total e o envio
const { itens, total, esvaziar } = useCarrinho();
```

O cliente toca duas vezes em "Adicionar" no X-Burger. Na mesma hora:

- o ícone da aba Carrinho mostra **2**
- a TelaCarrinho lista o X-Burger com `qtd: 2`, e o `total` vira `45.8`

Nenhuma tela passou props para outra: todas leram o mesmo quadro de avisos.

---

## Pense

:::question
Um colega escreve `createContext({ itens: [], adicionar: () => {} })` "para nunca dar erro" e esquece o `CarrinhoProvider` no `_layout.js`. O que o cliente vê ao tocar em "Adicionar"? E com `createContext(null)` e a guarda no `useCarrinho`?
:::

:::tip Resposta
Com o padrão falso, nada quebra e nada funciona: o toque chama a função vazia, o carrinho segue com zero itens e ninguém sabe por quê. É um quadro pintado na parede: parece ter aviso, mas nunca muda. O bug aparece no dia da demonstração.

Com `null` e a guarda, o app para na hora, com "useCarrinho precisa estar dentro do CarrinhoProvider". O erro diz o que falta e onde. É por isso que o contexto nasce `null`.
:::

---

## useReducer

Como a calculadora chega ao total novo quando você aperta "+ 5"?

---

## :icon[workflow] useReducer: muitas ações, um estado

Com `useState`, cada função do Provider calcula a lista nova do seu jeito. Com **`useReducer`**, toda mudança passa por uma função só, o **reducer**. Ele lembra o `reduce` do E09, a calculadora que vai acumulando: recebe o estado atual e uma **ação**, a tecla apertada, e devolve o estado novo.

```jsx
const [itens, dispatch] = useReducer(carrinhoReducer, []);

dispatch({ type: 'adicionar', produto }); // a tela diz o que aconteceu
dispatch({ type: 'alterar', id: '2', qtd: 3 });
dispatch({ type: 'esvaziar' });
```

- `useReducer` recebe o reducer e o estado inicial, `[]`, e devolve o estado e o `dispatch`
- `dispatch` (despachar, enviar) é apertar a tecla: entrega a ação ao reducer
- A **ação** é um objeto com `type`, o que aconteceu, e os dados de que ela precisa

---

## :icon[scale] useState ou useReducer

| | `useState` | `useReducer` |
|---|---|---|
| Muda com | `setItens(novaLista)` | `dispatch({ type, ... })` |
| A regra mora | em cada função | no reducer, num lugar só |
| Testar sem React | difícil | chame a função, como qualquer outra |
| Combina com | um valor, poucas ações | várias ações no mesmo estado |

O carrinho tem quatro ações sobre a mesma lista: adicionar, alterar, remover e esvaziar. É o caso do `useReducer`.

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

- O `switch` do E13 escolhe o caminho pelo `type` da ação; `default` é o caminho de quando nenhum `case` combina
- O reducer recebe o estado atual e a ação e **devolve** o estado novo; quem faz a conta é a regra, já testada no `lojinha-regras`
- Cada regra devolve uma lista nova: nada de `push` em `itens`
- É puro: nada de `fetch`, de `set...` ou de navegação aqui dentro
- `alterarQuantidade` com 0 tira o item; ação com nome errado cai no `default`, que avisa na hora

---

## :icon[calculator] O reducer na prática

Cada `dispatch` é uma tecla apertada; o reducer devolve o carrinho novo. Com `xBurger = { id: '1', nome: 'X-Burger', preco: 22.9 }`:

| Ação enviada | Carrinho antes | Carrinho depois |
|---|---|---|
| `{ type: 'adicionar', produto: xBurger }` | vazio | X-Burger com `qtd: 1` |
| a mesma ação, de novo | X-Burger com `qtd: 1` | X-Burger com `qtd: 2` |
| `{ type: 'alterar', id: '1', qtd: 0 }` | X-Burger com `qtd: 2` | vazio, `[]` |
| `{ type: 'pagar' }` | qualquer um | erro: `Ação desconhecida: pagar` |

Com o carrinho do segundo passo, `contarItens` dá `2` e `subtotal` dá `45.8`: as mesmas regras do `lojinha-regras`.

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
- Na lanchonete, o produto não tem `estoque`: a regra nunca lança, e o `dispatch` direto resolve

---

## Jest no app

Quem corrige uma prova escrita numa língua que não conhece?

---

## :icon[settings] Jest no app: o preset jest-expo

O **Jest** é o corretor da prova com gabarito do E04: roda os testes e diz o que passou. No E30, os testes ficaram no `lojinha-regras`, onde o `babel-jest` traduz o código do Node. O app tem JSX e módulos do React Native, que o Jest sozinho não lê. Quem ensina é o preset **`jest-expo`**, um pacote de configurações prontas:

```bash
npx expo install jest-expo jest -- --save-dev
```

```json
"scripts": { "test": "jest" },
"jest": { "preset": "jest-expo" }
```

- `--save-dev` anota os dois em `devDependencies`: são ferramentas de quem desenvolve, como no E04
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
- No terminal, `npm test` termina com `Tests: 2 passed, 2 total`: os dois casos passaram
- O último `expect` do primeiro teste prova que o estado antigo não foi alterado
- As regras já têm testes próprios; aqui você testa o que o reducer acrescenta: as ações e o `default`

---

## Quando o Context pesa

Se todos os avisos da casa ficam num quadro só, o que acontece a cada aviso novo?

---

## :icon[gauge] Os sinais de que o Context pesa

Um quadro só, com todos os avisos da casa, faz todo mundo parar a cada aviso novo. No Context, quem lê redesenha sempre que o `value` muda. Num app de cinco telas, tudo bem. Ele pesa assim:

- **Um `AppContext` com tudo**: mudar o carrinho redesenha quem só lê o tema. Saída: um contexto por assunto
- **Cada item da lista lê o contexto**: 40 cartões redesenham a cada "+". Saída: ler no pai e passar props
- **Cardápio guardado no contexto**: cópia velha, sem carregando nem erro. Saída: um hook que busca
- **Muitos contextos, um dentro do outro**: o `_layout.js` vira uma pirâmide. Saída: uma biblioteca de estado

Por isso tema e carrinho moram em contextos separados.

---

## :icon[boxes] Zustand, como visão

O **Zustand** é uma biblioteca pequena de estado global. Você cria uma **store** (depósito), que já é um hook, e não precisa de Provider: é um quadro de avisos que não precisa ser pendurado.

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
- Instale com `npx expo install zustand` quando o Context pesar. No projeto integrador, Context e `useReducer` são suficientes

---

## Dados do servidor

Duas mesas pedem o mesmo prato: chega um prato para as duas, ou um para cada?

---

## :icon[blocks] Dado do servidor: um hook por tela

Dado do servidor, como os pedidos, não vai para um contexto: cada tela o busca por um **hook de dados**, o amigo que cuida do pedido da mesa. Em `src/features/pedidos/usePedidos.js`, com os imports de `react`, de `../../api/pedidos` e do `ErroDeNegocio`:

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

## :icon[blocks] Um hook por tela na prática

A `TelaPedidos` só desenha o que o `usePedidos()` devolve:

```jsx
const { pedidos, carregando, erro, recarregar } = usePedidos();

if (carregando) return <EstadoCarregando />;
if (erro) return <EstadoErro mensagem={erro} onTentarNovamente={recarregar} />;
return <FlatList data={pedidos} /* keyExtractor e renderItem */ />;
```

| Situação | O que a tela mostra |
|---|---|
| a resposta ainda não chegou | `EstadoCarregando` |
| json-server desligado | `EstadoErro`, com "Tentar novamente" |
| a lista chegou | os pedidos, do mais novo para o mais antigo |

Duas telas com `usePedidos()` fazem dois pedidos e guardam duas listas: duas mesas, dois pratos.

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

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `precisa estar dentro do CarrinhoProvider` | o Provider não está acima da tela | pôr o Provider em volta da `Pilha`, no `_layout.js` |
| `TypeError` que fala de `null` | contexto sem Provider e sem guarda | acrescentar a guarda no hook |
| `Ação desconhecida` | o `type` da ação está escrito errado | conferir o nome no `dispatch` e no `case` |
| `Missing script: "test"` | falta o script `test` no `package.json` | `"test": "jest"` em `scripts` |
| `Cannot use import statement outside a module` | o Jest está sem o preset | `"jest": { "preset": "jest-expo" }` |

---

## Resumo

:::summary
- Estado local fica na tela; compartilhado, num contexto; do servidor, num hook que busca; do aparelho, no AsyncStorage do E43
- `createContext(null)` cria o canal, o `Provider` entrega o `value` abaixo dele e `useContext` lê o Provider mais próximo
- O `null` mais a guarda no hook transformam o Provider esquecido num erro claro
- `useReducer` concentra as ações num reducer puro, que usa as regras do `lojinha-regras` e se testa com o Jest e o `jest-expo`
- Context dividido por assunto dá conta do projeto; Zustand é a saída quando ele pesar
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
