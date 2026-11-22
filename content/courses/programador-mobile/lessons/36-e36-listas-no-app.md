---
title: Listas no app
summary: "A Início ganha a FlatList, as casas do servidor do kit, a busca sem acento e o puxar para atualizar."
module: layout-rn
duration_minutes: 90
objectives:
  - Trocar o map da Início por uma FlatList, com o topo no ListHeaderComponent
  - Ler as casas do useCasas() e buscar de novo ao puxar a lista
  - Filtrar as casas com o Campo do kit, o filter e a paraBusca
  - Mostrar o EstadoVazio quando nenhuma casa passa na busca
---

# Listas no app

Programador Mobile · Encontro E36 · Aula 36 de 45

---

## O que você vai aprender

:::goal
- Ler as casas que chegam do servidor do kit, com o `useCasas()`
- Trocar o `map` da Início pela `FlatList`, com o topo rolando junto
- Buscar uma casa com o `Campo` do kit, sem ligar para acento nem maiúscula
- Puxar a lista para baixo para buscar as casas de novo
- Mostrar um aviso quando a busca não acha nenhuma casa
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **servidor** | o computador que guarda os dados e responde aos pedidos do app; o kit traz um de mentira |
| **`ListHeaderComponent`** | a peça que a `FlatList` desenha antes do primeiro item e que rola junto com a lista |
| **`TextInput`** | a caixa de texto do celular, onde a pessoa digita; o `Campo` do kit tem uma dentro |
| **puxar para atualizar** | puxar a lista para baixo e soltar: aparece uma rodinha, e o app busca os dados de novo |
| **`refreshing`** | a prop que diz se a rodinha está girando (*refreshing*: atualizando) |

---

## A lista ainda não procura

As 12 casas estão na Início, mas quem procura uma casa em Campinas lê cartão por cartão.

| Hoje, no começo | No fim do encontro |
|---|---|
| as casas vêm do arquivo `casas.js` | chegam do servidor do kit |
| a tela inteira rola, com o `map` | a `FlatList` rola os cartões e o topo |
| nenhum campo para digitar | **Buscar casa**: "campinas" deixa 3 |
| dado novo, só reabrindo o app | puxar a lista busca de novo |
| nenhum aviso de lista vazia | "geladeira" mostra um aviso |

:::question
Como o app descobre quais casas mostrar a cada letra que a pessoa digita?
:::

---

## As casas do servidor

Quando você abre o app do banco, o saldo aparece na hora ou depois de um instante?

---

## :icon[pin] useCasas: o quadro de avisos das casas

O `useTema()` do E34 lê o tema no **quadro de avisos da casa**, pendurado em `app/_layout.js`. No mesmo arquivo, o kit tem um segundo quadro, o `CasasProvider`: quando o app abre, ele pede as casas ao **servidor** do kit, que responde 800 milissegundos depois, como uma API de verdade.

```jsx
import { useCasas } from '@/data/CasasContext';

const { casas, carregando, atualizando, erro, recarregar } = useCasas();
```

| Do quadro | O que é |
|---|---|
| `casas` | a lista; vazia até o servidor responder |
| `carregando` | `true` na primeira espera, sem lista |
| `atualizando` | `true` enquanto busca de novo, com a lista na tela |
| `erro` | a mensagem, se o servidor falhar; se não, `null` |
| `recarregar` | a função que pede as casas de novo |

---

## :icon[pin] useCasas, momento por momento

O servidor é de mentira: as casas moram na memória do celular, e uma Promise, a senha da lanchonete do E21, faz o app esperar. O `CasasProvider` espera com `await`, num `useEffect`, como as receitas do E27.

| Momento | `casas.length` | `carregando` | A Início mostra |
|---|---|---|---|
| o app abre | 0 | `true` | os números 0, 0 e 0, sem cartões |
| 800 ms depois | 12 | `false` | 12, 5 e 76, e os cartões |
| uma casa nova no Cadastro (E38) | 13 | `false` | 13 casas |

Toda tela lê o mesmo quadro: no E37, o Detalhe procura a casa nele.

---

## :icon[notebook-pen] Exercícios: As casas do servidor

:::example Exercícios
```jsx
// o quadro das aulas de uma academia, como o das casas
const { aulas, carregando, atualizando } = useAulas();
```

1. O app acabou de abrir, e o servidor não respondeu ainda. Quanto valem `aulas.length` e `carregando`?
2. Com as aulas na tela, o app busca a lista de novo. Qual fica `true`?
3. Ache o erro: `const { lista } = useAulas();` e, depois, `lista.length`
4. A tela Nova aula põe uma aula no quadro. A Agenda, que lê o mesmo `useAulas()`, mostra a aula nova?
:::

:::tip Respostas
1. `0` e `true`: a lista fica vazia até a resposta
2. `atualizando`; o `carregando` é só a primeira espera, sem lista
3. O campo se chama `aulas`: `lista` vale `undefined`, e o `.length` quebra
4. Sim: toda tela lê o mesmo quadro
:::

---

## :icon[milestone] Projeto 6 · Passo 1: as casas do servidor

Em `app/index.js`, troque a linha do `import` das casas:

```jsx
// sai:
import { casas } from '@/data/casas';
// entra:
import { useCasas } from '@/data/CasasContext';
```

Na função `Inicio`, logo abaixo da linha do `useTema()`:

```jsx
const { casas } = useCasas();
```

O resto fica igual: o `resumoDasCasas(casas)` e o `casas.map` passam a usar a `casas` do quadro. Salve e recarregue com `r` no terminal do `npx expo start`: o app abre do começo.

**Pronto quando:** ao abrir, os números mostram 0, 0 e 0, sem cartões, por menos de um segundo; depois chegam as 12 casas, com 12, 5 e 76.

---

## FlatList a fundo

Doze casas cabem numa tela que rola. E se o app tivesse duas mil?

---

## :icon[list] map ou FlatList

A **`FlatList`** é a esteira do E31: só desenha o que cabe na tela. O `map` dentro da `Tela rolar` desenha **todos** os cartões de uma vez: com 2.000 casas, seriam 2.000 cartões antes de mostrar o primeiro.

| | `map` na `Tela rolar` | `FlatList` |
|---|---|---|
| quem rola | a tela inteira | a própria lista |
| quantos cartões desenha | todos | os que cabem, e os próximos ao rolar |
| o crachá | `key={casa.id}` | `keyExtractor` |
| topo, aviso de vazio, puxar para atualizar | à mão | props prontas |

A `FlatList` já rola sozinha, então a `Tela` fica **sem** `rolar`: lista que rola dentro de tela que rola quebra a esteira.

---

## :icon[list] FlatList na prática

O **`ListHeaderComponent`** (a peça do cabeçalho da lista) recebe uma peça pronta, em JSX, como o `ListEmptyComponent` do E31:

```jsx
<FlatList
  data={casas}
  keyExtractor={(casa) => String(casa.id)}
  renderItem={({ item }) => <Text>{item.nome}</Text>}
  ListHeaderComponent={<Text>Casas de adoção</Text>}
  ListEmptyComponent={<Text>Nenhuma casa por aqui</Text>}
/>
```

| `casas` | A tela mostra |
|---|---|
| Lar da Mel e Recanto São Francisco | Casas de adoção, Lar da Mel, Recanto São Francisco |
| `[]`, a lista vazia | Casas de adoção, Nenhuma casa por aqui |

- O cabeçalho vem antes do primeiro item e **rola junto**: ao descer a lista, ele sobe e sai da tela
- Com a lista vazia, o cabeçalho continua, e o aviso entra no lugar dos itens

---

## :icon[notebook-pen] Exercícios: FlatList a fundo

:::example Exercícios
```jsx
<FlatList
  data={linhas}
  renderItem={({ item }) => <Text>{item.destino}</Text>}
  ListHeaderComponent={<Text>Ônibus de hoje</Text>}
  ListEmptyComponent={<Text>Nenhuma linha</Text>}
/>
```

1. Com `linhas` vazia, o que a tela mostra?
2. Com 40 linhas, ao rolar até o fim, "Ônibus de hoje" fica parado no alto?
3. Um cardápio de 4 sucos ou um extrato de 5 mil compras: qual sofre mais com o `map`?
4. Falta o crachá. Cada linha tem o `numero`, um número: `keyExtractor={(linha) => ____}`
5. Ache o erro: essa lista está dentro de uma `<Tela rolar>`
:::

:::tip Respostas
1. "Ônibus de hoje" e, embaixo, "Nenhuma linha"
2. Não: o cabeçalho rola junto e sai da tela
3. O extrato: o `map` desenharia as 5 mil de uma vez
4. `String(linha.numero)`: o crachá é texto
5. Aviso `VirtualizedLists should never be nested`: use `<Tela>`, sem `rolar`
:::

---

## :icon[milestone] Projeto 6 · Passo 2: o topo numa const

O topo e a faixa de números saem do `return` e vão para uma `const topo`, antes do `return`. A `FlatList` vai desenhá-los no `ListHeaderComponent`.

:::steps
1. Antes do `return`, escreva a moldura da `const topo` (bloco abaixo)
2. Recorte (<kbd>Ctrl</kbd> + <kbd>X</kbd>) do `return` o topo em linha e a faixa de números, e cole no lugar do comentário
3. No `StyleSheet.create`, acrescente os estilos `lista` e `cabecalho`
:::

```jsx
const topo = (
  <View style={estilos.cabecalho}>
    {/* aqui: o topo em linha e a faixa de números, como estavam */}
  </View>
);
```

```javascript
lista: { gap: espaco.md, paddingBottom: espaco.xl },
cabecalho: { gap: espaco.md },
```

A `const topo` guarda uma peça pronta, como o `let conteudo` do E26: o JSX é um valor. `{/* ... */}` é um comentário dentro do JSX.

---

## :icon[milestone] Projeto 6 · Passo 2: a FlatList no lugar do map

No `return`, sobrou a `Tela rolar` com o `casas.map`. Troque tudo por este bloco, e `FlatList` entra no `import` de `react-native`:

```jsx
<Tela>
  <FlatList
    data={casas}
    keyExtractor={(casa) => String(casa.id)}
    renderItem={({ item }) => (
      <CartaoCasa
        casa={item}
        onPress={() => Alert.alert(item.nome, `Visitas: ${item.visitas}`)}
      />
    )}
    ListHeaderComponent={topo}
    contentContainerStyle={estilos.lista}
  />
</Tela>
```

- `casa={item}`: a `FlatList` entrega cada casa no campo `item`, e o cartão continua pedindo `casa`
- **`contentContainerStyle`** (o estilo do conteúdo) vale para a parte de dentro da lista; o `gap` afasta os cartões, como a `Tela` fazia

**Pronto quando:** a tela parece a mesma, e o topo sobe junto com os cartões ao rolar.

---

## Campo de busca

Você toca na busca do WhatsApp e o teclado sobe. Para onde vai o que você digita?

---

## :icon[keyboard] TextInput: a caixa de digitar do celular

No celular, a caixa de digitar é o **`TextInput`**, de `react-native`. Ele funciona como o input controlado do E26: o texto fica num estado, e a caixa mostra o que está lá. **O estado manda, o campo obedece.**

```jsx
const [nome, setNome] = useState('');

return (
  <View>
    <TextInput value={nome} onChangeText={setNome} placeholder="Seu nome" />
    <Text>Olá, {nome}</Text>
  </View>
);
```

| Parte | O que ela diz |
|---|---|
| `value={nome}` | "mostre na caixa o que está em `nome`" |
| `onChangeText={setNome}` | "a cada letra, entregue o texto novo ao `setNome`" (*on change text*: ao mudar o texto) |
| `placeholder` | o texto clarinho da caixa vazia |

Na web, o `onChange` entregava um evento, e o texto morava em `evento.target.value`. O `onChangeText` entrega **o próprio texto**: digitando Ana, a tela mostra Olá, A; Olá, An; Olá, Ana.

---

## :icon[search] O Campo do kit na prática

O **`Campo`** do kit é um `TextInput` com rótulo em cima, ícone e lugar para a mensagem de erro. O comentário no topo de `src/components/ui/Campo.js` diz as props:

| Prop | O que faz |
|---|---|
| `rotulo` | o texto em cima da caixa; o leitor de tela também lê |
| `icone` | um ícone do Ionicons dentro da caixa, à esquerda, como `'search-outline'` |
| `erro` | uma mensagem embaixo, com a borda vermelha |
| `value`, `onChangeText`, `placeholder` | vão direto para o `TextInput` de dentro |

```jsx
// um nome, sem ícone
<Campo rotulo="Seu nome" value={nome} onChangeText={setNome} />

// a cidade, com erro (no Cadastro, no E38)
<Campo rotulo="Cidade" value={cidade} onChangeText={setCidade} erro="Informe a cidade" />
```

---

## :icon[notebook-pen] Exercícios: Campo de busca

:::example Exercícios
```jsx
const [placa, setPlaca] = useState('');

return (
  <View>
    <TextInput value={placa} onChangeText={setPlaca} placeholder="ABC1D23" />
    <Text>Placa: {placa}</Text>
  </View>
);
```

1. Antes de digitar, o que aparece na caixa e no `Text`?
2. A pessoa digita `RIO`. O que o `Text` mostra a cada letra?
3. Ache o erro: `<TextInput value={placa} onChange={setPlaca} />`
4. Complete a busca da academia: `<Campo ____="Buscar aula" ____="search-outline" value={termo} onChangeText={setTermo} />`
5. Com `value={placa}` e sem o `onChangeText`, o que acontece ao digitar?
:::

:::tip Respostas
1. Na caixa, o `ABC1D23` clarinho; no `Text`, só `Placa:`. A `placa` vale `''`
2. `Placa: R`, `Placa: RI` e `Placa: RIO`
3. O `onChange` entrega um evento, e não o texto: `onChangeText={setPlaca}`
4. `rotulo` e `icone`
5. A caixa não muda: ela mostra a `placa`, e nada muda o estado
:::

---

## :icon[milestone] Projeto 6 · Passo 3: o campo de busca

No topo de `app/index.js`, antes dos outros `import`s, o do `useState`. E `Campo` entra no `import` de `@/components/ui`:

```jsx
import { useState } from 'react';
```

Na função, logo abaixo do `useCasas()`, o estado da busca:

```jsx
const [termo, setTermo] = useState('');
```

No fim do `topo`, depois da faixa de números, ainda dentro da `View` do `cabecalho`:

```jsx
<Campo
  rotulo="Buscar casa"
  icone="search-outline"
  placeholder="Nome, bairro ou cidade"
  value={termo}
  onChangeText={setTermo}
/>
```

**Pronto quando:** **Buscar casa** aparece embaixo dos números, com a lupa; dá para digitar, e os 12 cartões continuam, porque a lista ainda não usa o `termo`.

---

## Sem acento

Você digita "sao", sem til. O app deveria achar São Paulo?

---

## :icon[search-check] paraBusca: o texto do jeito da busca

No E26, a busca das receitas tirava a maiúscula com `toLowerCase`, mas `lamen` não achava o "Lámen japonês": o acento atrapalhava. A **`paraBusca`**, de `@/utils`, resolve as duas coisas. Ela recebe um texto e devolve o mesmo texto **em minúsculas, sem acento e sem espaço nas pontas**. É como passar os dois textos a limpo, na mesma letra, antes de comparar.

| Entra | Sai |
|---|---|
| `'São Paulo'` | `'sao paulo'` |
| `'  Ribeirão Preto '` | `'ribeirao preto'` |
| `'RIBEIRAO'` | `'ribeirao'` |
| `'Associação Patinhas do Bem'` | `'associacao patinhas do bem'` |

Na busca, ela passa a limpo **os dois lados**: o que a pessoa digitou e o nome de cada casa.

---

## :icon[search-check] paraBusca por dentro

A função mora em `src/utils/index.js`, e cada parte dela é de um encontro que você já fez:

```javascript
const SEM_ACENTO = {
  á: 'a', à: 'a', â: 'a', ã: 'a', é: 'e', ê: 'e', í: 'i',
  ó: 'o', ô: 'o', õ: 'o', ú: 'u', ü: 'u', ç: 'c',
};

export function paraBusca(texto) {
  const letras = [...texto.trim().toLowerCase()];
  return letras.map((letra) => SEM_ACENTO[letra] ?? letra).join('');
}
```

| Parte | O que ela diz |
|---|---|
| `SEM_ACENTO` | uma ficha (E13): cada letra com acento aponta para a letra sem acento |
| `texto.trim().toLowerCase()` | "tire os espaços das pontas e passe para minúsculas" (E09) |
| `[...]` | o spread do E15 abre o texto em letras: `[...'são']` dá `['s', 'ã', 'o']` |
| `SEM_ACENTO[letra] ?? letra` | "procure a letra na ficha; se não estiver lá, fique com ela mesma" (o `??` do E17) |
| `map` e `join('')` | a linha de produção do E14 troca letra por letra, e o `join` do E11 cola tudo de novo |

---

## :icon[funnel] A busca, item por item

A peneira do `filter`, da aula 3, com o furo da busca do E26. Agora, com a `paraBusca` dos dois lados:

```jsx
const busca = paraBusca(termo);
const visiveis = casas.filter((casa) => paraBusca(casa.nome).includes(busca));
```

A pessoa digita `SÃO`, e `busca` vale `'sao'`:

| `casa.nome` | `paraBusca(casa.nome)` | Tem `'sao'`? | Fica? |
|---|---|---|---|
| Lar da Mel | `'lar da mel'` | não | não |
| Recanto São Francisco | `'recanto sao francisco'` | sim | sim |
| Casa do Bigode | `'casa do bigode'` | não | não |
| Lar Temporário Ronrom | `'lar temporario ronrom'` | não | não |

Das 12, só o Recanto São Francisco passa. Sem a `paraBusca`, nem ele: `'recanto são francisco'` tem `são`, com til.

---

## :icon[milestone] Projeto 6 · Passo 3: a lista filtrada

`paraBusca` entra no `import` de `@/utils`:

```jsx
import { paraBusca, resumoDasCasas } from '@/utils';
```

Logo abaixo da linha do `resumo`, a busca e a lista filtrada:

```jsx
const busca = paraBusca(termo);
const visiveis = casas.filter((casa) => paraBusca(casa.nome).includes(busca));
```

Na `FlatList`, troque `data={casas}` por `data={visiveis}`.

- O `resumo` continua com `casas`: os números contam todas as casas, não só as da busca
- `visiveis` não é estado: cada letra chama o `setTermo`, a Início é desenhada de novo, e o `filter` roda outra vez

**Pronto quando:** "lar" deixa 2 casas, Lar da Mel e Lar Temporário Ronrom; "SÃO" e "sao" deixam 1, o Recanto São Francisco; apagar volta às 12; os números continuam 12, 5 e 76.

---

## :icon[binary] O ||: pelo menos um sim

As casas de São Paulo têm "sao" na cidade, não no nome. Para achá-las, a busca precisa fazer mais de uma pergunta. O **`||`** (ou) do E10 junta perguntas de sim ou não: o resultado é `true` se **pelo menos uma** responder `true`.

```javascript
const aceitaCaes = casa.aceita === 'Cães' || casa.aceita === 'Cães e gatos';
```

| `casa.aceita` | 1ª pergunta | 2ª pergunta | `aceitaCaes` |
|---|---|---|---|
| `'Cães'` | `true` | `false` | `true` |
| `'Gatos'` | `false` | `false` | `false` |
| `'Cães e gatos'` | `false` | `true` | `true` |

Com três perguntas, vale o mesmo: um `true` já faz o resultado dar `true`. Uma pergunta comprida pode descer de linha, como o teste do `filter` do E26.

---

## :icon[notebook-pen] Exercícios: Sem acento

:::example Exercícios
Para rodar, copie no arquivo a `SEM_ACENTO` e a `paraBusca`, sem o `export`.

1. Quanto vale `paraBusca('  Pão de QUEIJO ')`?
2. E `'São Paulo'.toLowerCase().includes('sao')`?
3. O que aparece?
   ```javascript
   const frutas = ['Maçã', 'Limão', 'Açaí', 'Uva'];
   console.log(frutas.filter((f) => paraBusca(f).includes(paraBusca('ÇA'))));
   ```
4. Ache o erro: com `termo` igual a `'MAÇÃ'`, `frutas.filter((f) => paraBusca(f).includes(termo))` não acha nada
5. Com `const meia = idade >= 60 || estudante;`, quanto vale `meia` para 30 anos e `estudante` igual a `true`? E com `false`?
:::

:::tip Respostas
1. `'pao de queijo'`
2. `false`: `'são paulo'` tem o til
3. `[ 'Maçã', 'Açaí' ]`: o `'ÇA'` vira `'ca'`, que está em `'maca'` e em `'acai'`
4. O termo não passou a limpo: `includes(paraBusca(termo))`
5. `true`, porque um sim basta; e `false`, porque as duas dão não
:::

---

## Puxar para atualizar

O que você faz no app do banco para ver se o Pix já caiu?

---

## :icon[refresh-cw] refreshing e onRefresh

**Puxar para atualizar** é puxar a lista para baixo e soltar: aparece uma rodinha, e o app busca os dados de novo. A `FlatList` cuida do gesto e da rodinha. Você diz duas coisas:

| Prop | O que ela diz |
|---|---|
| `onRefresh` | **o que fazer** quando a pessoa puxa e solta (*on refresh*: ao atualizar) |
| `refreshing` | **se** a rodinha está girando: com `true`, gira; com `false`, some |

A lista não desliga a rodinha sozinha: ela gira enquanto `refreshing` for `true`. Quem liga e desliga é um estado, o placar do E26. Na Início, os dois vêm do quadro das casas:

```jsx
refreshing={atualizando}
onRefresh={recarregar}
```

---

## :icon[refresh-cw] Quem liga e quem desliga a rodinha

**Na Início, o kit cuida do estado.** O `recarregar` liga o `atualizando` e pede as casas; a resposta desliga.

| Momento | Quem faz | `atualizando` |
|---|---|---|
| a pessoa puxa e solta | a `FlatList` chama o `recarregar` | `true`: a rodinha gira |
| 800 ms depois | o servidor responde e o quadro guarda a lista | `false`: a rodinha some |

**Numa lista sem o kit, o estado é seu.** O `setTimeout` do E21 faz de conta que a rede demora 1,5 segundo:

```jsx
const [atualizando, setAtualizando] = useState(false);

function atualizar() {
  setAtualizando(true);
  setTimeout(() => setAtualizando(false), 1500);
}
```

Na `FlatList`: `refreshing={atualizando}` e `onRefresh={atualizar}`. Sem o `setAtualizando(false)`, a rodinha gira para sempre.

---

## :icon[notebook-pen] Exercícios: Puxar para atualizar

:::example Exercícios
Os horários de ônibus, numa `FlatList`:

```jsx
const [buscando, setBuscando] = useState(false);

function buscarDeNovo() {
  setBuscando(true);
  setTimeout(() => setBuscando(false), 3000);
}
```

1. Complete a `FlatList`: `refreshing={____}` e `onRefresh={____}`
2. A pessoa puxa a lista e solta. Por quanto tempo a rodinha gira?
3. Sem a linha do `setTimeout`, o que acontece?
4. Ache o erro: as duas props estão na `Tela`, em volta da lista, e puxar não faz nada
:::

:::tip Respostas
1. `refreshing={buscando}` e `onRefresh={buscarDeNovo}`
2. 3 segundos: o `setBuscando(false)` roda 3000 milissegundos depois
3. A rodinha gira para sempre: nada desliga o `buscando`
4. Quem cuida do gesto e da rodinha é a `FlatList`: as duas props vão nela
:::

---

## :icon[milestone] Projeto 6 · Passo 4: puxar para atualizar

No `useCasas()`, pegue mais dois campos do quadro:

```jsx
const { casas, atualizando, recarregar } = useCasas();
```

Na `FlatList`, logo depois do `ListHeaderComponent`:

```jsx
refreshing={atualizando}
onRefresh={recarregar}
```

**Pronto quando:** puxar a lista para baixo e soltar mostra a rodinha no topo, que some sozinha em menos de um segundo; os cartões e a busca continuam como estavam.

---

## Lista vazia

Você buscou "geladeira". O app mostra uma tela vazia ou um aviso?

---

## :icon[square] EstadoVazio: o aviso pronto do kit

Sem nenhuma casa na `visiveis`, a `FlatList` mostra o topo e, embaixo, nada: parece que o app travou. O `ListEmptyComponent` do E31 recebe a peça que aparece **no lugar dos cartões**, só enquanto a lista está vazia. O kit tem essa peça pronta, o **`EstadoVazio`**:

| Prop | O que mostra |
|---|---|
| `titulo` | a frase principal, em negrito |
| `mensagem` | uma explicação curta, embaixo |
| `icone` | um ícone grande do Ionicons; sem ele, a pata (`'paw-outline'`) |
| `textoAcao` e `onAcao` | o texto e o que faz um botão; o botão só aparece com os dois |

```jsx
<EstadoVazio titulo="Nenhuma casa por aqui" mensagem="As casas aparecem assim que chegarem." />
```

O topo continua no lugar: o `ListHeaderComponent` aparece mesmo com a lista vazia.

---

## :icon[notebook-pen] Exercícios: Lista vazia

:::example Exercícios
1. Sem a prop `icone`, que ícone o `EstadoVazio` mostra?
2. O que aparece com `<EstadoVazio titulo="Nenhum pedido" textoAcao="Fazer pedido" />`?
3. A lista de treinos tem 3 itens e um `ListEmptyComponent`. O aviso aparece?
4. Ache o erro: o `EstadoVazio` do carrinho foi escrito embaixo da `FlatList`, fora dela, e aparece mesmo com produtos
:::

:::tip Respostas
1. A pata, `'paw-outline'`, o padrão do kit
2. A pata e o título, sem botão: o botão só aparece com `textoAcao` e `onAcao`
3. Não: ele só aparece enquanto a lista está vazia
4. Fora da `FlatList`, ele aparece sempre; no `ListEmptyComponent`, só com o carrinho vazio
:::

---

## :icon[milestone] Projeto 6 · Sua vez: a busca completa e a lista vazia

Agora, sozinho. Duas mudanças na Início:

1. A busca acha a casa também pelo **bairro** e pela **cidade**
2. Sem nenhuma casa na busca, a lista mostra o `EstadoVazio` com o título "Nenhuma casa encontrada", uma mensagem curta e o botão **Limpar busca**, que apaga o termo

:::tip Dicas
- No teste do `filter`, uma pergunta `paraBusca(...).includes(busca)` para cada campo, juntas com o `||`
- O aviso vai no `ListEmptyComponent`; o botão chama `setTermo('')`, e o campo controlado se apaga junto
:::

**Pronto quando:** "sao" mostra 4 casas (as 3 de São Paulo e o Recanto São Francisco), "RIBEIRAO" 2, "pinheiros" 1 e "geladeira" o aviso, embaixo do topo; Limpar busca traz as 12 de volta.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `VirtualizedLists should never be nested` | `FlatList` dentro da `Tela rolar` | `<Tela>`, sem `rolar` |
| `Cannot read property 'capacidade' of undefined` | `({ casa })` no `renderItem` | `({ item })` e `casa={item}` |
| `trim is not a function` | `onChange` no lugar de `onChangeText` | `onChangeText={setTermo}` |
| `Property 'paraBusca' doesn't exist` | faltou o `import` | pôr no `import` certo |
| (sem mensagem) o teclado fecha a cada letra | `ListHeaderComponent={() => topo}` refaz o topo | `ListHeaderComponent={topo}` |
| (sem mensagem) "sao" não acha São Paulo | o teste só olha o nome | o `\|\|` com bairro e cidade |

---

## :icon[milestone] Projeto 6 · Etapa 4 pronta

- As casas vêm do `useCasas()`; o `import` de `@/data/casas` saiu da Início
- `FlatList` com `keyExtractor`, o topo no `ListHeaderComponent` e a `Tela` sem `rolar`
- Busca por nome, bairro e cidade, sem diferença de acento nem de maiúscula
- "geladeira" mostra o aviso com Limpar busca; puxar a lista mostra a rodinha, que para sozinha

Ao abrir o app, o aviso aparece por menos de um segundo, enquanto as casas não chegam. É a espera do servidor: no E39, ela ganha o Carregando.

```bash
git add .
git commit -m "Projeto 6: etapa 4, lista com busca"
git push
```

O que faltar, termine em casa, com o enunciado do Projeto 6: o E37 começa com a lista e a busca prontas.

---

## Resumo

:::summary
- O `useCasas()` lê as casas no quadro de avisos do kit; o servidor responde 800 ms depois de o app abrir
- A `FlatList` é a esteira: só desenha o que cabe; o topo vai no `ListHeaderComponent`, e a `Tela` fica sem `rolar`
- O `TextInput` mostra o estado no `value` e entrega o texto novo no `onChangeText`; o `Campo` do kit tem um dentro
- A `paraBusca` passa os dois lados a limpo: minúsculas, sem acento e sem espaço nas pontas
- `refreshing` diz se a rodinha gira; `onRefresh` diz o que fazer quando a pessoa puxa a lista
- O `ListEmptyComponent` mostra o `EstadoVazio` no lugar dos cartões, e o topo continua
:::

---

## :icon[arrow-right] Próximos passos

No E37, o toque no cartão deixa de abrir um aviso e abre uma tela nova, o **Detalhe** da casa:

- :icon[layers] a **pilha de telas**: a tela nova entra por cima, e voltar tira a de cima
- :icon[map-pin] o endereço com número: `/casa/4` é a Casa do Bigode
- :icon[book-open] as **abas** Casas e Sobre, como as abas de um fichário
