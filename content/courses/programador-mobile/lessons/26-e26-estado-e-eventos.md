---
title: Estado e eventos
summary: "A tela reage ao clique e à digitação: useState, a busca das receitas e o seu BotaoFavorito."
module: react
duration_minutes: 90
objectives:
  - Reagir a cliques e à digitação com onClick e onChange
  - Guardar o que muda na tela num estado com useState
  - Filtrar uma lista com o texto de um input controlado
  - Passar uma função como prop para o filho avisar o pai
---

# Estado e eventos

Programador Mobile · Encontro E26 · Aula 26 de 45

---

## O que você vai aprender

:::goal
- Fazer a tela reagir a um clique e à digitação
- Guardar o que muda na tela num **estado**, com `useState`
- Ligar o campo de busca ao estado e filtrar as receitas
- Criar o seu segundo componente, o `BotaoFavorito`
- Guardar as favoritas no `App` e contá-las no cabeçalho
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **evento** | algo que a pessoa faz na tela: clicar, digitar |
| **estado** | um valor que o componente guarda e que, quando muda, faz a tela mudar junto |
| **`useState`** | a função do React que cria um estado (*use state*: use um estado) |
| **redesenhar** | o React rodar o componente de novo e trocar na tela o que mudou |
| **input** | o campo de texto da página, a tag `<input>`, onde a pessoa digita |
| **input controlado** | um campo que mostra o que está no estado, e só isso |

---

## O livro de receitas ainda não responde

Os 8 cartões estão na tela, mas nada reage: não dá para procurar a receita do jantar nem guardar a que você quer fazer no domingo.

| Hoje, no começo | No fim do encontro |
|---|---|
| nenhum campo para digitar | o campo **Buscar receita**, acima dos cartões |
| 8 cartões, sempre os mesmos | `frango` deixa só os 2 de frango; `xyz`, um aviso |
| nenhum botão no cartão | cada cartão tem o botão **Favoritar** |
| o cabeçalho sem contador | o cabeçalho mostra "2 favoritas" |

:::question
Quando você digita uma letra na busca, quem avisa a lista de que ela precisa mudar?
:::

---

## Eventos

Quando a campainha toca, como você sabe o que fazer?

---

## :icon[mouse-pointer-click] onClick: o que fazer no clique

Um **evento** é algo que a pessoa faz na tela: clicar, digitar. Pense na campainha: você combina antes o que fazer quando ela tocar. No JSX, o combinado é um atributo que começa com `on` ("ao"). O **`onClick`** ("ao clicar") recebe a função que roda no clique:

```jsx
function BotaoOi() {
  function avisar() {
    console.log('Oi!')
  }

  return <button onClick={avisar}>Diga oi</button>
}
```

- A função `avisar` mora dentro do componente. Cada clique escreve `Oi!` no Console (F12)
- `onClick` se escreve com **C maiúsculo**: `onclick` não funciona

::::columns
:::col
**Certo:** `onClick={avisar}` entrega a função, e o React chama no clique.
:::
:::col
**Errado:** `onClick={avisar()}` roda a função ao desenhar a tela, sem clique nenhum.
:::
::::

---

## Estado

Como o estádio inteiro fica sabendo que saiu um gol?

---

## :icon[refresh-cw] useState: o placar da tela

Um **estado** é um valor que o componente guarda e que, quando muda, faz o React **redesenhar** a tela. É o placar do jogo: saiu gol, o número muda, e o telão mostra o novo. Uma variável comum também muda, mas o React não fica sabendo, e a tela continua igual.

```jsx
import { useState } from 'react'

function Contador() {
  const [contador, setContador] = useState(0)

  return (
    <button onClick={() => setContador(contador + 1)}>
      Cliques: {contador}
    </button>
  )
}
```

| Parte | O que ela diz |
|---|---|
| `useState(0)` | "crie um placar que começa em 0" |
| `contador` e `setContador` | o valor de agora e a função que troca o valor |
| `() => setContador(contador + 1)` | no clique, "troque pelo valor de agora mais 1". A seta (E07) espera o clique para rodar |

---

## :icon[variable] Os colchetes do useState

O `useState` devolve uma lista com **dois** itens: o valor e a função que troca o valor. Os colchetes antes do `=` dão um nome a cada item, pela **posição**. Com uma lista qualquer, no Node:

```javascript
const lanche = ['pizza', 'suco']
const [comida, bebida] = lanche

console.log(comida)   // pizza
console.log(bebida)   // suco
```

É a desestruturação do E13: com chaves, ela tira campos de uma ficha pelo nome; com colchetes, tira itens de uma lista pela posição.

- Os nomes, você escolhe. O costume é `[coisa, setCoisa]`
- O `useState` vem do pacote `react`, com chaves: `import { useState } from 'react'`, como o `import { receitas }` do E25
- Ele fica dentro do componente, no começo da função

---

## :icon[refresh-cw] O ciclo de um clique

:::center
![Animação: o clique no botão Cliques: 0 chama setContador(contador + 1), que guarda o valor 1 e pede o redesenho; o React chama Contador() de novo e o JSX novo mostra Cliques: 1](images/e23-clique-redesenha.svg)
:::

- O clique chama `setContador(contador + 1)`, que guarda o 1 e pede o redesenho
- O React roda a função `Contador()` de novo, de cima para baixo, e agora `contador` vale 1
- O JSX novo vai para a tela: `Cliques: 1`

**Redesenhar** é rodar o componente outra vez: tudo o que está dentro dele é calculado de novo.

---

## :icon[refresh-cw] Estado na prática

Três placares, cada um com um tipo de valor: número, sim ou não, e texto. Em cada caso, a primeira linha fica no começo do componente, e o botão, no `return`.

```jsx
// 1. um número: os gols do jogo
const [gols, setGols] = useState(0)
<button onClick={() => setGols(gols + 1)}>Gol! ({gols})</button>

// 2. sim ou não: mostrar o modo de preparo
const [aberto, setAberto] = useState(false)
<button onClick={() => setAberto(!aberto)}>{aberto ? 'Fechar' : 'Ver preparo'}</button>

// 3. um texto: o tamanho da pizza
const [tamanho, setTamanho] = useState('média')
<button onClick={() => setTamanho('grande')}>Tamanho: {tamanho}</button>
```

| Botão | A tela, a cada clique |
|---|---|
| gols | Gol! (0), Gol! (1), Gol! (2)... |
| preparo | Ver preparo, Fechar, Ver preparo... |
| tamanho | Tamanho: média, depois Tamanho: grande |

O `!aberto` é o contrário, do E10: `false` vira `true`. O ternário, também do E10, escolhe o texto do botão.

---

## Input controlado

Você digita no campo. Quem guarda o texto: o campo ou o seu código?

---

## :icon[keyboard] Input controlado: o estado manda

O **input** é o campo de texto da página. No React, o texto digitado fica num estado, e o campo mostra o que está lá: **o estado manda, o campo obedece**. É o **input controlado**:

```jsx
const [nome, setNome] = useState('')

return (
  <>
    <input value={nome} onChange={(evento) => setNome(evento.target.value)} />
    <p>Olá, {nome}</p>
  </>
)
```

| Parte | O que ela diz |
|---|---|
| `value={nome}` | "mostre no campo o que está em `nome`" |
| `onChange={...}` | "a cada letra, rode esta função" (*on change*: ao mudar) |
| `evento` | o evento: o React entrega à função os detalhes do que aconteceu |
| `evento.target.value` | o texto do campo agora: `target` (alvo) é o campo, e `value`, o texto dele |

Digitando `Ana`, a tela acompanha letra por letra: `Olá, A`, `Olá, An`, `Olá, Ana`.

---

## :icon[search] O CampoBusca do kit por dentro

O `CampoBusca` do kit é um input controlado. Ele não guarda o texto: recebe do `App` o `valor` e a função `aoMudar`.

```jsx
<label className="busca__rotulo" htmlFor="busca">
  Buscar receita
</label>
<input
  id="busca"
  className="busca__campo"
  type="search"
  placeholder="Digite um nome, como pizza"
  value={valor}
  onChange={(evento) => aoMudar(evento.target.value)}
/>
```

| Linha | O que ela diz |
|---|---|
| `<label htmlFor="busca">` | o **rótulo**, ligado ao campo de `id="busca"` (o nome único do campo na página). `htmlFor` é o `for` do HTML, renomeado como o `class` virou `className` |
| `type="search"` | campo de busca: aparece um X para apagar o texto |
| `placeholder` | o texto cinza do campo vazio |
| `onChange={...}` | a cada letra, avisa o `App` com o texto novo: `aoMudar(...)` |

---

## :icon[milestone] Projeto 4 · Passo 1: o estado da busca

No topo do `App.jsx`, o `import` do `useState` antes dos outros, e o do `CampoBusca` junto das peças do kit. No começo da função, o estado:

```jsx
import { useState } from 'react'
import CampoBusca from './components/CampoBusca.jsx'

function App() {
  const [busca, setBusca] = useState('')
```

No `<main>`, acima da grade, o campo e uma linha provisória, para ver o estado mudar:

```jsx
      <main className="conteudo">
        <CampoBusca valor={busca} aoMudar={setBusca} />
        <p>Você buscou: {busca}</p>
        <div className="grade">
```

- `aoMudar={setBusca}` entrega ao campo a função que troca a busca: a cada letra, ele chama `setBusca` com o texto novo
- O `map` da grade continua igual

**Pronto quando:** digitando `piz`, aparece "Você buscou: piz", e os 8 cartões continuam.

---

## Filtrar com estado

Na agenda do celular, você digita "ma". O que acontece com a lista de contatos?

---

## :icon[funnel] A peneira com o que a pessoa digitou

A busca é a peneira do `filter`, da aula 3, com um furo que muda: o teste usa o estado `busca`. Passa a receita que **tem** no nome o texto buscado:

```jsx
const visiveis = receitas.filter((receita) =>
  receita.name.toLowerCase().includes(busca.toLowerCase())
)
```

| Parte | O que ela diz |
|---|---|
| `receita.name.toLowerCase()` | o nome da receita, em minúsculas (E09) |
| `.includes(...)` | "tem dentro este texto?" (E09): `true` ou `false` |
| `busca.toLowerCase()` | o texto buscado, também em minúsculas |
| `visiveis` | a lista nova, só com quem passou |

- A pergunta foi para a linha de baixo por ser comprida: é a mesma seta
- `visiveis` **não** é estado: a cada letra, o `App` é redesenhado, e o `filter` roda de novo

---

## :icon[funnel] A busca, item por item

Busca `FRANGO`: o `busca.toLowerCase()` vira `'frango'`.

| Receita | `name.toLowerCase()` | Tem `'frango'`? | Fica? |
|---|---|---|---|
| Pizza margherita | `'pizza margherita'` | não | não |
| Fettuccine Alfredo com frango | `'fettuccine alfredo com frango'` | sim | sim |
| Biryani de frango | `'biryani de frango'` | sim | sim |
| Brigadeiro | `'brigadeiro'` | não | não |

As outras 4 também respondem não: `visiveis` fica com 2 receitas.

- Sem o `toLowerCase` da busca, `'FRANGO'` nunca está num nome em minúsculas: nada passa
- Com a busca vazia, todo nome tem o texto vazio dentro: passam as 8
- A busca diferencia acentos: `lamen` não acha o "Lámen japonês"; `lámen` acha

---

## :icon[milestone] Projeto 4 · Passo 2: a lista filtrada

:::steps
1. No `App`, logo abaixo do estado da busca, a lista `visiveis` (bloco abaixo)
2. No `return`, troque `receitas.map` por `visiveis.map`
3. Apague a linha provisória, a do "Você buscou"
:::

```jsx
function App() {
  const [busca, setBusca] = useState('')

  const visiveis = receitas.filter((receita) =>
    receita.name.toLowerCase().includes(busca.toLowerCase())
  )
```

**Pronto quando:** `BRIG` mostra só o brigadeiro; `frango` e `FRANGO`, os 2 de frango; e `xyz` deixa a tela vazia, sem cartão nem aviso.

---

## :icon[split] Escolher o que aparece

O `if`/`else` do E10, a bifurcação na estrada, também escolhe **o que aparece na tela**. O JSX escolhido vai para uma variável `let`, e o `return` mostra a variável entre chaves:

```jsx
function Aviso({ busca }) {
  let aviso
  if (busca === '') {
    aviso = <p>Digite o nome de uma receita.</p>
  } else {
    aviso = <p>Você buscou: {busca}</p>
  }

  return <div>{aviso}</div>
}
```

| `busca` | Caminho | A tela mostra |
|---|---|---|
| `''` | o do `if` | Digite o nome de uma receita. |
| `'piz'` | o do `else` | Você buscou: piz |

O JSX é um valor, como um número ou um texto: cabe numa variável. O `let aviso` cria a caixa vazia, e cada caminho põe um JSX dentro.

---

## :icon[milestone] Projeto 4 · Passo 2: quando nada passa

No topo, junto das peças do kit: `import ListaVazia from './components/ListaVazia.jsx'`. No `App`, abaixo do `visiveis`, o começo da escolha:

```jsx
  let conteudo
  if (visiveis.length === 0) {
    conteudo = <ListaVazia busca={busca} />
  } else {
    conteudo = (
```

:::steps
1. Recorte (<kbd>Ctrl</kbd> + <kbd>X</kbd>) a grade do `return`, do `<div className="grade">` ao `</div>` que a fecha, e cole logo abaixo do `conteudo = (`
2. Feche o `else`: uma linha com `)` e outra com `}`
3. No `return`, onde estava a grade, escreva `{conteudo}`
:::

Os parênteses deixam o JSX ocupar várias linhas, como no `return ( ... )` do E24.

**Pronto quando:** `xyz` mostra `Nenhuma receita encontrada para "xyz".`, e apagar a busca traz as 8.

---

## O filho avisa

O botão do elevador guarda a lista dos andares chamados, ou só avisa o painel?

---

## :icon[arrow-up] Função como prop: o pai guarda, o filho avisa

Uma prop também pode levar uma **função**: o pai entrega, e o filho chama quando algo acontece. É o botão do elevador: ele só avisa o painel, que guarda os andares chamados e acende a luz do botão. **O pai guarda, o filho avisa.**

| Peça | Recebe do pai | Chama a função |
|---|---|---|
| `CampoBusca`, do kit | `valor` e `aoMudar` | a cada letra |
| `BotaoFavorito`, o seu | `ativo` e `aoClicar` | no clique |

As favoritas moram no `App`: o cabeçalho conta todas, e a marca não pode sumir quando a busca esconde o cartão.

O nome com `ao` ("ao mudar", "ao clicar") avisa: a prop é a função de um evento.

---

## :icon[milestone] Projeto 4 · Passo 3: o BotaoFavorito

Novo arquivo, o seu segundo componente: `src/components/BotaoFavorito.jsx`.

```jsx
function BotaoFavorito({ ativo, aoClicar }) {
  return (
    <button
      className={ativo ? 'favorito favorito--ativo' : 'favorito'}
      onClick={aoClicar}
    >
      {ativo ? 'Favorita' : 'Favoritar'}
    </button>
  )
}

export default BotaoFavorito
```

| Linha | O que ela diz |
|---|---|
| `{ ativo, aoClicar }` | as duas props: sim ou não, e a função do clique |
| `className={ativo ? ... : ...}` | o ternário: a favorita ganha as duas classes do kit, separadas por espaço (o botão cheio); a outra, só `favorito` |
| `onClick={aoClicar}` | "no clique, chame a função que veio do pai", sem parênteses |
| `{ativo ? 'Favorita' : 'Favoritar'}` | o texto do botão, escolhido do mesmo jeito |

A tag `<button` ficou comprida: o `>` sozinho na linha fecha a abertura dela.

---

## :icon[milestone] Projeto 4 · Passo 3: o botão no cartão

No `CartaoReceita.jsx`: no topo, `import BotaoFavorito from './BotaoFavorito.jsx'`; no fim da lista de props, depois do `nota,`, mais duas: `favorita,` e `aoFavoritar,`. No rodapé do cartão, o botão:

```jsx
        <div className="cartao__rodape">
          <Etiqueta dificuldade={dificuldade} />
          <BotaoFavorito ativo={favorita} aoClicar={aoFavoritar} />
        </div>
```

No `App`, no `map`, depois do `nota={receita.rating}`, duas props provisórias para testar o botão:

```jsx
            favorita={false}
            aoFavoritar={() => console.log('Favoritar', receita.name)}
```

O cartão só repassa: o `aoFavoritar` que chega do `App` vira o `aoClicar` do botão.

**Pronto quando:** cada cartão tem o botão Favoritar, e o clique na pizza escreve `Favoritar Pizza margherita` no Console.

---

## Lista no estado

Você rasura a lista de compras ou passa a limpo numa folha nova?

---

## :icon[copy] Lista no estado: sempre uma lista nova

As favoritas são uma **lista de ids** num estado que começa vazio: `useState([])`. Para mudar, entregue ao `set` uma **lista nova**, com o spread do E15: tire uma cópia e mexa na cópia, sem rasurar o original.

```jsx
const [favoritas, setFavoritas] = useState([])

// certo: uma lista nova, com o id a mais
setFavoritas([...favoritas, id])

// errado: muda a lista velha por dentro
favoritas.push(id)
setFavoritas(favoritas)
```

- Com o `push`, o `set` recebe **a mesma** lista, no mesmo endereço (E15). O React compara, acha igual e não redesenha: o clique não muda nada, e não aparece erro
- Para saber se uma receita é favorita, o `includes` do E14: `favoritas.includes(1)` responde `true` ou `false`

---

## :icon[milestone] Projeto 4 · Passo 4: as favoritas no estado

No `App`, o segundo estado e a função que põe um id na lista:

```jsx
function App() {
  const [busca, setBusca] = useState('')
  const [favoritas, setFavoritas] = useState([])

  function alternarFavorita(id) {
    setFavoritas([...favoritas, id])
  }
```

No `map`, as duas props provisórias viram:

```jsx
            favorita={favoritas.includes(receita.id)}
            aoFavoritar={() => alternarFavorita(receita.id)}
```

- A `alternarFavorita` mora dentro do `App`: por isso enxerga `favoritas` e `setFavoritas`
- A seta leva junto o id daquele cartão. Sem ela, `alternarFavorita(receita.id)` rodaria ao desenhar a tela, como o `avisar()` errado

**Pronto quando:** Favoritar vira **Favorita**, com o coração cheio, e buscar `zzz` e apagar a busca não tira a marca.

---

## :icon[waypoints] O clique na pizza, passo a passo

:::center
![Diagrama: o clique no BotaoFavorito sobe por aoClicar até o CartaoReceita e por aoFavoritar até o App, que chama setFavoritas([1]); o valor novo desce por favorita={true} até o cartão e por ativo={true} até o botão, que mostra Favorita](images/e26-aviso-sobe-valor-desce.svg)
:::

- **O aviso sobe** pelas funções: o botão chama `aoClicar`, que é o `aoFavoritar` do cartão, que é `() => alternarFavorita(1)`
- O `App` troca o estado: `setFavoritas([...favoritas, 1])` entrega `[1]`, e o React redesenha
- **O valor desce** pelas props: `favoritas.includes(1)` é `true`, e o botão recebe `ativo` igual a `true`

Clique de novo na pizza: a lista vira `[1, 1]`, e ela continua marcada.

---

## :icon[milestone] Projeto 4 · Sua vez: desmarcar e contar

Agora, sozinho. Duas mudanças no `App`:

1. **Clicar de novo desmarca.** Se o id já está na lista, `alternarFavorita` tira; se não está, põe. Sem `push` nem `splice`
2. **O cabeçalho conta as favoritas.** Passe o total ao `Cabecalho` do kit

:::tip Dicas
- O `includes` responde se o id já está na lista, e o `if`/`else` do E10 escolhe o caminho
- Para tirar um item sem rasurar o original, use o `filter` do E15
- O comentário no topo de `Cabecalho.jsx` diz o nome da prop
:::

**Pronto quando:** favoritar duas receitas mostra "2 favoritas"; desmarcar uma mostra "1 favorita"; desmarcar a outra, "Nenhuma favorita"; e a favorita continua marcada depois de buscar e apagar a busca.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `useState is not defined` | faltou importar | `import { useState } from 'react'` |
| `aoMudar is not a function` | o `CampoBusca` sem `aoMudar` | `aoMudar={setBusca}` |
| `Cannot update a component (App) while rendering a different component (BotaoFavorito)` | `onClick={aoClicar()}` roda ao desenhar | `onClick={aoClicar}` |
| ``Invalid event handler property `onclick` `` | `onclick` minúsculo | `onClick` |
| nenhuma; o clique não muda nada | `push` na lista do estado | `[...favoritas, id]` |
| nenhuma; `FRANGO` não acha nada | `toLowerCase` de um lado só | nos dois lados |

Aparecem no Console (F12) e no terminal do `npm run dev`.

---

## :icon[milestone] Projeto 4 · Etapa 3 pronta

- `frango` e `FRANGO` mostram os 2 de frango; `xyz`, a `ListaVazia`
- Cada cartão tem o `BotaoFavorito`: clicar marca, clicar de novo desmarca
- O cabeçalho conta: "Nenhuma favorita", "1 favorita", "2 favoritas"
- A marca continua depois de buscar e apagar a busca
- O Console não tem mensagem vermelha

Num segundo terminal do VS Code (o primeiro está ocupado com o `npm run dev`):

```bash
git add .
git commit -m "Projeto 4: etapa 3, busca e favoritas"
git push
```

O que faltar, termine em casa antes do E27; o enunciado está na página do Projeto 4.

---

## Resumo

:::summary
- Evento é o que a pessoa faz na tela; `onClick={funcao}` entrega a função, sem parênteses
- Estado é o placar: `const [valor, setValor] = useState(inicial)`; o `set` troca o valor, e o React redesenha
- Input controlado: o `value` mostra o estado, e o `onChange` guarda o `evento.target.value`
- A lista da tela sai do estado a cada desenho, com `filter`, `includes` e `toLowerCase`, sem estado próprio
- `let conteudo` com `if`/`else` escolhe o JSX que aparece
- O pai guarda, o filho avisa: a função vai como prop; a lista no estado é sempre uma lista nova
:::

---

## :icon[arrow-right] Próximos passos

No E27, as receitas deixam o arquivo do kit e vêm da internet, da API DummyJSON:

- :icon[cloud-download] um **efeito**, o `useEffect`, busca as 30 receitas depois de a tela aparecer
- :icon[hourglass] "Carregando receitas..." enquanto a resposta não chega
- :icon[triangle-alert] sem internet, a mensagem de erro, no lugar de uma tela presa
- :icon[file-text] o README com print e a entrega do Projeto 4
