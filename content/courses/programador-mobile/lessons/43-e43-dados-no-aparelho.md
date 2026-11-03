---
title: Dados no aparelho
summary: "O quadro de avisos da equipe e a gaveta do celular: o que a pessoa cria aparece em todas as telas e volta ao abrir."
module: integracao
duration_minutes: 90
objectives:
  - Escrever o quadro de avisos da equipe com createContext e o Provider e pendurá-lo em volta do app
  - Ler e mudar a lista do quadro em qualquer tela com useContext
  - Guardar e ler a lista na gaveta do celular com o AsyncStorage e o JSON
  - Ler a gaveta ao abrir e guardar quando a lista muda, com dois useEffect e a trava carregado
---

# Dados no aparelho

Programador Mobile · Encontro E43 · Aula 43 de 45

---

## O que você vai aprender

:::goal
- Pôr a lista do app num quadro de avisos que todas as telas leem
- Escrever o quadro com `createContext`, o Provider e o `useContext`
- Guardar a lista na gaveta do celular, o AsyncStorage
- Ler a gaveta ao abrir o app e guardar de novo quando a lista muda
- Levar tudo para a `main` por branch e pull request
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **estado global** | uma lista que várias telas leem e mudam, como os lançamentos do app |
| **contexto** | o quadro de avisos do React: todas as telas leem o mesmo aviso |
| **Provider** | o provedor: a peça que pendura o quadro em volta das telas |
| **AsyncStorage** | a gaveta do celular: guarda texto mesmo depois de fechar o app |
| **chave** | a etiqueta da gaveta: o nome com que o texto é guardado e achado de novo |
| **trava** | um `true` ou `false` que não deixa o app guardar antes da hora |

---

## O lançamento que some

No Gasto Certo, a Carla salva uma saída de R$ 12,50, "Pão", na tela Novo lançamento. Aparece "Lançamento salvo". Ela volta para a Início, e o saldo continua o mesmo.

| No app | Hoje, no começo | No fim do encontro |
|---|---|---|
| salvar "Pão", R$ 12,50 | o aviso aparece, e nada muda | a Início vai para R$ 1714,60, e "Pão" fica no topo da Lançamentos |
| a lixeira | não aparece | apaga o lançamento |
| fechar o app e abrir | sempre os 6 exemplos | tudo como você deixou |

:::question
No app da sua equipe, o que some do mesmo jeito?
:::

---

## Estado global

O lançamento salvo na tela Novo precisa aparecer na Início e na Lançamentos. Quem avisa as duas?

---

## :icon[pin] Estado global: o quadro de avisos da casa

Cada `useState` é o placar de **uma** tela (E26): o da Novo não chega à Início. Uma lista que várias telas leem e mudam é um **estado global**.

No React, ele mora num **contexto**, o quadro de avisos da casa: todos os cômodos leem o mesmo. Você já usou dois prontos, o `useTema()` (E34) e o `useCasas()` (Projeto 6). Hoje, quem cuida dos dados escreve o da equipe.

| No quadro de avisos | No código |
|---|---|
| fazer o quadro | `createContext` |
| pendurar o quadro na sala, com o aviso | o **Provider**, em volta das telas, com o `value` |
| ir até o quadro e ler | `useContext`, em qualquer tela |

---

## :icon[pin] O quadro na prática

No Gasto Certo, o aviso do quadro é a lista de lançamentos e duas funções que mudam a lista. Cada tela pega o pedaço de que precisa:

| Tela | Pega do quadro | Para quê |
|---|---|---|
| Início | `lancamentos` | somar o saldo, as entradas e as saídas |
| Lançamentos | `lancamentos` e `remover` | mostrar a lista e apagar pela lixeira |
| Novo lançamento | `adicionar` | pôr o lançamento novo na lista |

A Novo chama `adicionar`. O quadro muda, e a Início e a Lançamentos desenham de novo, sozinhas. Nenhuma tela passa props para outra: todas leem o mesmo quadro.

---

## Escrever um quadro

Para pôr um quadro de avisos na sala, do que você precisa?

---

## :icon[pin] createContext, Provider e useContext

O quadro de avisos precisa de três coisas, e cada uma é uma linha do React:

```jsx
// 1. fazer o quadro, num arquivo só dele
export const GastosContext = createContext(null);

// 2. pendurar o quadro em volta das telas, com o aviso no value
<GastosContext.Provider value={valor}>{children}</GastosContext.Provider>

// 3. em qualquer tela de dentro, ir até o quadro e ler
const { lancamentos } = useContext(GastosContext);
```

- **`createContext`** (criar contexto) faz o quadro. O `null` quer dizer "vazio por enquanto"
- O **`.Provider`** vem junto com o quadro: tudo o que fica entre as tags dele pode ler o `value`
- **`useContext`** é um hook, como o `useState`: vai dentro da função da tela e devolve o `value`

---

## :icon[milestone] Projeto 7 · Passo 1: o quadro dos lançamentos

Quem cuida dos dados faz; a equipe acompanha na tela dessa pessoa.

:::steps
1. `git switch main`, `git pull` e `git switch -c dados-no-celular`
2. Crie o arquivo `src/data/GastosContext.js` e escreva o topo dele
:::

```jsx
// O quadro de avisos dos lançamentos: todas as telas leem a mesma lista.
// O GastosProvider fica em app/_layout.js, em volta de tudo.
// Em qualquer tela:
//   const { lancamentos, adicionar, remover } = useContext(GastosContext);
import { createContext, useState } from 'react';
import { lancamentosDeExemplo } from './gastos';

export const GastosContext = createContext(null);
```

O `./gastos` é o `gastos.js` do kit, na mesma pasta. Na Agenda, o arquivo novo é `AgendaContext.js`; no Cardápio, `CarrinhoContext.js`.

---

## :icon[milestone] Projeto 7 · Passo 1: o GastosProvider

Logo abaixo, no mesmo arquivo, a peça que pendura o quadro:

```jsx
export function GastosProvider({ children }) {
  const [lancamentos, setLancamentos] = useState(lancamentosDeExemplo);

  function adicionar(novo) {
    setLancamentos([{ ...novo, id: Date.now() }, ...lancamentos]);
  }

  function remover(id) {
    setLancamentos(lancamentos.filter((item) => item.id !== id));
  }

  const valor = { lancamentos, adicionar, remover };
  return <GastosContext.Provider value={valor}>{children}</GastosContext.Provider>;
}
```

**Pronto quando:** o `src/data/GastosContext.js` está salvo, com o topo e o `GastosProvider`. No celular, nada muda ainda: nenhuma tela usa o quadro.

---

## :icon[list-ordered] O GastosProvider em português

| Linha | O que ela diz |
|---|---|
| `function GastosProvider({ children })` | "uma peça que recebe, na prop `children` (filhos), o que fica entre as tags dela", como a `Tela` |
| `useState(lancamentosDeExemplo)` | "a lista começa nos 6 exemplos; quando muda, quem lê o quadro desenha de novo" |
| `[{ ...novo, id: Date.now() }, ...lancamentos]` | "uma lista nova: o novo, com crachá, na frente; os antigos atrás", sem rasurar (E15) |
| `lancamentos.filter((item) => item.id !== id)` | "fica tudo, menos o do `id`": a peneira |
| `const valor = { lancamentos, adicionar, remover }` | o aviso: a lista e as duas funções. Campo e caixa de mesmo nome: uma vez só |

---

## :icon[pin] O quadro de cada briefing

Todas as equipes usam o mesmo molde; mudam os nomes:

| Briefing | Arquivo em `src/data/` | O `useContext` entrega | Quem muda a lista |
|---|---|---|---|
| Agenda | `AgendaContext.js`, com o `AgendaProvider` | `agendamentos`, `adicionar`, `remover` | o Agendar adiciona; o Agendados cancela |
| Cardápio | `CarrinhoContext.js`, com o `CarrinhoProvider` | `itens`, `adicionar`, `remover`, `esvaziar` | o Produto adiciona; o Carrinho tira; o pedido esvazia |
| Gastos | `GastosContext.js`, com o `GastosProvider` | `lancamentos`, `adicionar`, `remover` | a Novo adiciona; a Lançamentos apaga |

A lista de partida vem dos dados do kit: `agendamentosDeExemplo`, de `./agenda`, ou `carrinhoDeExemplo`, de `./cardapio`. O `esvaziar` é uma função a mais, de uma linha: `setItens([])`.

---

## :icon[pin] useContext: a tela lê o quadro

Na tela, dois `import` e uma linha na função:

```jsx
import { useContext } from 'react';
import { GastosContext } from '@/data/GastosContext';

export default function Lancamentos() {
  const { cores } = useTema();
  const { lancamentos, remover } = useContext(GastosContext);
```

- `useContext(GastosContext)` devolve o `value` do Provider. As chaves tiram dele só o que a tela usa: a desestruturação do E13
- O `useTema()` do kit faz isso por dentro: é um `useContext` do quadro do tema
- Só lê o quadro quem está **dentro** do Provider. Fora dele, o `useContext` devolve o `null` do `createContext(null)`, e o app para com `Cannot read property 'lancamentos' of null`

---

## :icon[milestone] Projeto 7 · Passo 2: o quadro em volta do app

No `app/_layout.js`, o import do Provider e o `GastosProvider` em volta da `Pilha`, dentro do `TemaProvider`. É o que o comentário `E43`, no topo do arquivo do kit, pedia:

```jsx
import { GastosProvider } from '@/data/GastosContext';

// ... a função Pilha continua igual

export default function LayoutRaiz() {
  return (
    <TemaProvider>
      <GastosProvider>
        <Pilha />
      </GastosProvider>
    </TemaProvider>
  );
}
```

A `Pilha` são todas as telas do app: com o Provider em volta dela, qualquer tela lê o quadro.

---

## :icon[milestone] Projeto 7 · Passo 2: a Lançamentos lê o quadro

Na tela de quem cuida dos dados (no Gasto Certo, a Lançamentos):

```jsx
// sai, no topo:
import { lancamentosDeExemplo } from '@/data/gastos';
// entram, no topo:
import { useContext } from 'react';
import { GastosContext } from '@/data/GastosContext';

// na função, sai:
const lancamentos = lancamentosDeExemplo;
// entra:
const { lancamentos, remover } = useContext(GastosContext);
```

No `renderItem`, a lixeira ganha o que fazer no toque. O `ItemLancamento` do E42 só mostra a lixeira com o `onRemover`:

```jsx
renderItem={({ item }) => (
  <ItemLancamento lancamento={item} onRemover={() => remover(item.id)} />
)}
```

**Pronto quando:** cada lançamento tem a lixeira, que apaga. Aperte `r` no terminal do Expo: o app recarrega e o apagado **volta**. O quadro mora na memória; falta a gaveta.

---

## AsyncStorage

Você fecha o WhatsApp e abre de novo. Por que as conversas continuam lá?

---

## :icon[archive] AsyncStorage: a gaveta do celular

O quadro mora na **memória**: fechou o app, apagou. O **AsyncStorage** (armazenamento assíncrono) é a gaveta do celular: o que você guarda continua lá depois de fechar o app. É a gaveta do navegador do E21, o `localStorage`, agora no celular, com os mesmos dois botões:

| Botão | O que faz |
|---|---|
| `AsyncStorage.setItem(chave, texto)` | guarda o texto com uma etiqueta, a **chave** |
| `AsyncStorage.getItem(chave)` | devolve o texto guardado, ou `null` se não há nada |

- A gaveta do celular demora um pouco: os dois botões devolvem uma Promise, a senha da lanchonete, e você espera com `await` (E21)
- Só guarda **texto**: a lista vai com `JSON.stringify` e volta com `JSON.parse`, da aula 3

---

## :icon[archive] AsyncStorage na prática

O pacote já está no `package.json` do kit: ninguém instala nada. O `@` do nome é parte do pacote, não o atalho `@/` da pasta `src`.

```jsx
import AsyncStorage from '@react-native-async-storage/async-storage';

async function testarGaveta() {
  await AsyncStorage.setItem('gastos.recado', 'Pagar a luz');
  const recado = await AsyncStorage.getItem('gastos.recado');
  console.log(recado);   // Pagar a luz
  const nada = await AsyncStorage.getItem('gastos.nada');
  console.log(nada);     // null
}
```

Uma lista vai como texto, dentro de uma função `async` como esta:

```jsx
const lista = [{ id: 1, descricao: 'Pão' }, { id: 2, descricao: 'Conta de luz' }];
await AsyncStorage.setItem('gastos.teste', JSON.stringify(lista));
const texto = await AsyncStorage.getItem('gastos.teste');
console.log(texto);                     // [{"id":1,"descricao":"Pão"},{"id":2,"descricao":"Conta de luz"}]
console.log(JSON.parse(texto).length);  // 2
```

Sem o `JSON.stringify`, o terminal avisa `The value for key "gastos.teste" is not a string`.

---

## :icon[archive] O quadro e a gaveta

:::center
![Diagrama: as telas Início, Lançamentos e Novo leem o GastosProvider, o quadro na memória com lancamentos, adicionar e remover; embaixo, a gaveta do AsyncStorage com a chave gastos.lancamentos; ao abrir o app, o quadro tira a lista da gaveta com getItem; quando a lista muda, guarda de novo com setItem](images/e43-quadro-e-gaveta.svg)
:::

As telas só falam com o quadro. O quadro fala com a gaveta em dois momentos: **ao abrir o app**, tira a lista de lá; **quando a lista muda**, guarda de novo. Cada momento é um `useEffect` dentro do Provider.

---

## Ler ao abrir

Quando você abre um app, quem lembra o que você deixou lá ontem?

---

## :icon[zap] O primeiro efeito: ler ao abrir

O **`useEffect`** é o bilhete "depois de desenhar a tela, faça isto", do E27. Com o `[]` no fim, ele roda **uma vez**, quando o app abre. E, como no E27, a função `async` mora dentro do efeito e é chamada logo abaixo. No `GastosProvider`:

```jsx
const [carregado, setCarregado] = useState(false);

// ao abrir o app: tira da gaveta o que estava guardado
useEffect(() => {
  async function carregar() {
    const texto = await AsyncStorage.getItem(CHAVE);
    if (texto !== null) {
      setLancamentos(JSON.parse(texto));
    }
    setCarregado(true);
  }
  carregar();
}, []);
```

A **`CHAVE`** é uma `const` com a etiqueta, `'gastos.lancamentos'`: o nome do app na frente não mistura com outras gavetas. O **`carregado`** é a trava: começa em `false` e vira `true` quando a leitura termina.

---

## :icon[split] O primeiro efeito, caminho por caminho

O `if` escolhe o caminho:

| Quando | `texto` | A lista fica com | `carregado` |
|---|---|---|---|
| primeiro uso do app | `null` | os 6 exemplos do `useState` | vira `true` |
| a gaveta tem 7 | o texto JSON dos 7 | os 7, do `JSON.parse` | vira `true` |

| Linha | O que ela diz |
|---|---|
| `await AsyncStorage.getItem(CHAVE)` | "me dê o texto desta etiqueta, e espere" |
| `if (texto !== null)` | "se tinha algo guardado...": o `!==` é o "é diferente?" |
| `setLancamentos(JSON.parse(texto))` | "...troque a lista pelo que estava lá" |
| `setCarregado(true)` | "a leitura terminou": a trava abre nos dois caminhos |

---

## Guardar quando muda

Você guardaria uma gaveta nova por cima da antiga, sem olhar o que tinha dentro?

---

## :icon[zap] O segundo efeito: guardar quando muda

O segundo efeito guarda a lista na gaveta. A **lista de dependências** do E27 agora tem nomes dentro: o efeito roda depois do primeiro desenho e **de novo** a cada desenho em que `lancamentos` ou `carregado` mudou.

```jsx
// a lista mudou: guarda de novo na gaveta
useEffect(() => {
  if (carregado) {
    AsyncStorage.setItem(CHAVE, JSON.stringify(lancamentos));
  }
}, [lancamentos, carregado]);
```

| Linha | O que ela diz |
|---|---|
| `[lancamentos, carregado]` | "toda vez que a lista ou a trava mudar, faça isto de novo" |
| `if (carregado)` | "só guarde depois de ler o que já estava guardado" |
| `setItem(CHAVE, JSON.stringify(lancamentos))` | "guarde a lista, como texto, com esta etiqueta" |

Aqui não tem `await`: depois de guardar, não há mais nada a fazer.

---

## :icon[lock] A trava, momento a momento

Os dois efeitos rodam logo depois do primeiro desenho, e a leitura da gaveta demora. Com 7 lançamentos guardados:

| Momento | `lancamentos` | `carregado` | O segundo efeito guarda? |
|---|---|---|---|
| primeiro desenho | os 6 exemplos | `false` | não: ainda não leu a gaveta |
| a leitura terminou | os 7 guardados | `true` | sim, os mesmos 7 |
| a pessoa apaga um | 6 | `true` | sim, os 6 |

Sem a trava, o primeiro desenho guarda os 6 exemplos por cima dos 7, sem olhar o que tinha dentro. Se a leitura ainda não tinha pegado os 7, eles se perdem. A trava garante a ordem: primeiro ler, depois guardar.

---

## :icon[milestone] Projeto 7 · Passo 3: a gaveta, ao abrir

No topo do `GastosContext.js`, o `useEffect` no import do React, o import do AsyncStorage e a chave:

```jsx
import { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lancamentosDeExemplo } from './gastos';

export const GastosContext = createContext(null);

const CHAVE = 'gastos.lancamentos';
```

Dentro do `GastosProvider`, logo abaixo do `useState` da lista, a trava e o primeiro efeito:

```jsx
  const [carregado, setCarregado] = useState(false);

  // ao abrir o app: tira da gaveta o que estava guardado
  useEffect(() => {
    async function carregar() {
      const texto = await AsyncStorage.getItem(CHAVE);
      if (texto !== null) {
        setLancamentos(JSON.parse(texto));
      }
      setCarregado(true);
    }
    carregar();
  }, []);
```

---

## :icon[milestone] Projeto 7 · Passo 3: a gaveta, quando muda

Logo abaixo do primeiro efeito, o segundo. O `adicionar`, o `remover` e o `return` continuam iguais:

```jsx
  // a lista mudou: guarda de novo na gaveta
  useEffect(() => {
    if (carregado) {
      AsyncStorage.setItem(CHAVE, JSON.stringify(lancamentos));
    }
  }, [lancamentos, carregado]);
```

Na Agenda, a chave é `'agenda.agendamentos'` e a lista, `agendamentos`; no Cardápio, `'cardapio.carrinho'` e `itens`.

**Pronto quando:** no celular, apague um lançamento e aperte `r`: ele **não volta**. Feche o app de verdade (tire o Expo Go da lista de apps abertos) e abra de novo: continua apagado.

---

## :icon[milestone] Projeto 7 · Passo 4: o pull request dos dados

:::steps
1. `git add .` e `git commit -m "Guarda os lançamentos no celular"`
2. `git push -u origin dados-no-celular`
3. No GitHub, **Compare & pull request**, com `Closes #` e o número da issue "Guardar os lançamentos no celular"
4. Toda a equipe lê os três arquivos no **Files changed**; uma pessoa roda no celular e aprova
5. **Merge pull request** e, em todos os computadores, `git switch main` e `git pull`
:::

Ninguém instala pacote: o AsyncStorage já veio no kit, e um pacote instalado em duas branches dá conflito no `package-lock.json`.

**Pronto quando:** na `main` de todos, a Lançamentos tem a lixeira, e o apagado continua apagado depois de fechar o app.

---

## :icon[milestone] Projeto 7 · Sua vez: cada tela no quadro

Cada pessoa, numa branch `dados-` mais o nome da sua tela:

1. Troque os dados de exemplo pelo `useContext` do quadro
2. Onde a tela muda a lista, chame `adicionar`, `remover` ou `esvaziar`
3. Pull request revisado e merge; depois, todos `git pull`

:::tip Dicas
- Dois `import`: o `useContext`, de `'react'`, e o quadro, de `'@/data/'`
- Só a linha da lista muda; o resto fica igual
- O `adicionar` vem antes do `Alert` e do `router.back()`; o `remover` recebe o `id`
:::

**Pronto quando:** o que você cria numa tela aparece nas outras ("Pão", R$ 12,50, leva o saldo a R$ 1714,60); fechou e abriu o app, está tudo lá; com a lista vazia, o `EstadoVazio`.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Cannot read property 'lancamentos' of null` | a tela leu fora do Provider | o Provider em volta da `<Pilha />` |
| `is not a string` | a lista foi sem virar texto | `JSON.stringify` no `setItem` |
| `JSON Parse error` | faltou o `await`: veio a Promise | `await` antes do `getItem` |
| `NativeModule: AsyncStorage is null` | instalaram outra versão do pacote | chamar o instrutor |
| (nenhuma) tudo volta aos exemplos | faltou a trava | `if (carregado)` e `[lancamentos, carregado]` |
| (nenhuma) a Início não muda ao salvar | a tela lê os exemplos | `useContext` no lugar deles |

---

## :icon[milestone] Projeto 7 · Etapa 3 pronta

Na `main` da equipe:

- `src/data/GastosContext.js` (ou `AgendaContext.js`, ou `CarrinhoContext.js`) com o quadro, a gaveta e a trava
- o Provider em volta da `<Pilha />`, no `app/_layout.js`
- cada tela que usa a lista lendo o quadro com `useContext`, cada uma por um pull request revisado
- o que a pessoa cria numa tela aparece nas outras e continua lá depois de fechar o app

O que faltar termina em casa, na sua branch `dados-`, com o pull request aberto antes do E44. Avise a equipe: ela revisa e junta.

---

## Resumo

:::summary
- Estado global é uma lista que várias telas leem e mudam; no React, ela mora num contexto, o quadro de avisos
- `createContext(null)` faz o quadro; o Provider pendura o quadro em volta das telas, com o `value`; o `useContext` lê o quadro em qualquer tela de dentro
- O AsyncStorage é a gaveta do celular: `setItem(chave, texto)` guarda e `getItem(chave)` devolve o texto, ou `null`, com `await`
- A gaveta só guarda texto: `JSON.stringify` na ida, `JSON.parse` na volta
- Um efeito com `[]` lê a gaveta ao abrir; outro, com `[lancamentos, carregado]`, guarda quando a lista muda
- A trava `carregado` só deixa guardar depois de ler
:::

---

## :icon[arrow-right] Próximos passos

No E44, o app sai do Expo Go e vai para o portfólio:

- :icon[clipboard-check] o checklist de qualidade, tela por tela
- :icon[package] o APK de teste, feito com o EAS, que instala num Android
- :icon[file-text] o README de portfólio, com os prints de cada tela
