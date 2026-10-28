---
title: Modais, links e fluxos
summary: Abra os filtros como modal, proteja telas com Redirect, abra rotas por deep link e reconheça fluxos de entrada.
module: layout-rn
duration_minutes: 40
objectives:
  - Abrir uma tela como modal e aplicar a escolha com um contexto e as regras do catálogo
  - Proteger um grupo de rotas com Redirect e replace
  - Abrir uma rota da Lojinha por deep link
  - Reconhecer os padrões de onboarding e checkout
---

# Modais, links e fluxos

Programador Mobile · Encontro E37 · Aula 73 de 89

---

## O que você vai aprender

:::goal
- Abrir os filtros da Lojinha como modal e aplicar a escolha com um contexto e o `aplicarFiltros` do E08
- Escolher entre `push`, `back` e `replace` em cada situação
- Proteger um grupo de rotas com `Redirect`
- Abrir um produto por deep link e reconhecer os fluxos de onboarding e checkout
:::

---

## Por cima, direto e antes

Três cenas de apps que você usa:

- :icon[banknote] No banco, o Pix abre uma tela que **sobe por cima** e some com um gesto
- :icon[link] Um amigo manda o link de um produto e a loja abre **direto nele**
- :icon[lock] O checkout pede login **antes** de seguir

Cada cena é uma ferramenta de navegação: modal, deep link e fluxo protegido. A Lojinha já tem abas e pilhas; agora ganha as três.

:::question
Por que os filtros de uma loja quase sempre sobem por cima da lista, em vez de abrir como uma tela comum?
:::

---

## :icon[arrow-up] Modal: uma tarefa curta por cima

Uma tela **modal** interrompe o que você fazia para uma tarefa curta e fechada em si. Ao terminar ou desistir, você volta exatamente ao ponto de partida.

:::center
![Animação: a tela empilhada do Detalhe desliza da lateral e cobre a vitrine; o modal de Filtros sobe de baixo, e a vitrine do Início continua aparecendo atrás dele](images/e37-modal-sobe.svg)
:::

- **Fechar**: a tela empilhada sai pela seta de voltar; o modal, com o gesto para baixo, o voltar ou um botão de ação
- **Exemplos de modal**: filtros, novo endereço, compartilhar

Os filtros são o caso clássico: a vitrine continua lá embaixo, esperando o resultado.

---

## :icon[list-filter] `presentation: 'modal'` na pilha raiz

Crie `app/filtros.js` **fora** de `(tabs)` e declare a tela na `Pilha` de `app/_layout.js`:

```jsx
<Stack screenOptions={{ /* cores do tema, como no E36 */ }}>
  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
  <Stack.Screen name="filtros" options={{ presentation: 'modal', title: 'Filtros' }} />
</Stack>
```

No Início, o "Ver carrinho" do rodapé perdeu a função: a aba tem badge, e ele pode sair. No topo da tela, entra o botão de filtros:

```jsx
<Link href="/filtros" asChild>
  <Pressable style={estilos.botaoTopo}>
    <Ionicons name="options-outline" size={22} color={cores.texto} />
  </Pressable>
</Link>
```

No iOS, o modal sobe como um cartão e fecha puxando para baixo. No Android, ocupa a tela e fecha com o voltar do sistema.

---

## :icon[list-filter] A tela de filtros: rascunho e aplicar

`src/telas/Filtros.js`, que `app/filtros.js` só reexporta, guarda a escolha num `useState` local: um **rascunho**. Só o botão Aplicar grava a escolha para o resto do app.

```jsx
export default function Filtros() {
  const { filtros, setFiltros } = useFiltros(); // contexto novo, receita do carrinho
  const [categoria, setCategoria] = useState(filtros.categoria);
  const [ordem, setOrdem] = useState(filtros.ordem);

  function aplicar() {
    setFiltros({ categoria, ordem }); // grava no contexto
    router.back();                    // fecha o modal
  }
  // return com as opções e os botões Aplicar e Limpar
}
```

`router.back()` tira a tela de cima da pilha: aqui, fecha o modal. Se o cliente desistir com o gesto ou o voltar, o rascunho some e nada muda na vitrine.

---

## :icon[component] Opções com o Botao do UI kit

Cada opção é um `Botao` pequeno: `primaria` quando escolhida, `secundaria` quando não.

```jsx
<Text style={[estilos.rotulo, { color: cores.texto }]}>Categoria</Text>
<View style={estilos.opcoes}>
  <Botao titulo="Todas" tamanho="sm"
    variante={categoria === null ? 'primaria' : 'secundaria'}
    onPress={() => setCategoria(null)} />
  {categorias.map((c) => (
    <Botao key={c.slug} titulo={c.nome} tamanho="sm"
      variante={categoria === c.slug ? 'primaria' : 'secundaria'}
      onPress={() => setCategoria(c.slug)} />
  ))}
</View>
<Botao titulo="Aplicar" onPress={aplicar} />
```

- `opcoes: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.sm }` quebra a linha quando não cabe
- A ordenação repete o padrão, e os rótulos já existem: o `rotulosDeOrdem` do E08 (desafio do Pratique)

---

## :icon[split] Parâmetro ou contexto?

Um modal não devolve valor como uma função. A tela de baixo precisa ler a escolha de algum lugar.

:::center
![Diagrama: o parâmetro vai do Início ao Detalhe junto com router.push; a escolha feita nos Filtros volta ao Início pelo FiltrosContext, com setFiltros e router.back](images/e37-parametro-ou-contexto.svg)
:::

- **Parâmetro** vai junto ao **abrir**: `router.push('/produto/' + id)`. Vive na URL, sempre como texto, e identifica a tela: `id`, `slug`
- **Contexto** **volta** para quem ficou embaixo: `setFiltros(...)` e `router.back()`. Vive na memória enquanto o app roda e guarda escolhas que outras telas leem

Na Lojinha, o Início lê o filtro depois que o modal fecha: contexto. Se os filtros abrissem uma tela nova de resultados, um parâmetro bastaria, como em `/categorias/audio`.

---

## FiltrosContext: a escolha que sobrevive ao modal

Mesma receita do `CarrinhoContext`, em `src/contexts/FiltrosContext.js`:

```jsx
import { createContext, useContext, useState } from 'react';

const FiltrosContext = createContext(null);

export function FiltrosProvider({ children }) {
  const [filtros, setFiltros] = useState({ categoria: null, ordem: 'nome' });
  const valor = { filtros, setFiltros };
  return <FiltrosContext.Provider value={valor}>{children}</FiltrosContext.Provider>;
}

export function useFiltros() {
  const valor = useContext(FiltrosContext);
  if (!valor) throw new Error('useFiltros fora do FiltrosProvider');
  return valor;
}
```

Em `app/_layout.js`, ponha o `FiltrosProvider` por dentro do `CarrinhoProvider`, em volta da `Pilha`. Acima da pilha, o modal e o Início enxergam o mesmo `filtros`.

---

## :icon[list-filter] As regras do catálogo já existem

No E08, você escreveu e testou `src/regras/catalogo.js` no terminal. No E30, ele veio para o app com a pasta `src/`:

| Nome | O que é |
|---|---|
| `aplicarFiltros(lista, filtros)` | lista **nova**, só da `categoria` escolhida (todas, com `null`), na `ordem` pedida |
| `comparadores` | um comparador por ordem: `nome`, `preco` e `avaliacao`; no empate, vale o nome |
| `rotulosDeOrdem` | o texto de cada ordem: `preco` vira "Menor preço" |

```javascript
aplicarFiltros(produtos, { categoria: 'audio', ordem: 'preco' });
// Fone Bluetooth, Caixa de Som Portátil, Microfone USB
```

O `filtros` do contexto tem o formato que a regra recebe: `{ categoria, ordem }`. A tela guarda a escolha; a regra filtra e ordena.

---

## Pratique

:::example Desafio (5 min)
Ligue o modal e a vitrine às regras, sem escrever nenhuma ordenação:

1. Em `Filtros.js`, gere os botões de ordem a partir de `rotulosDeOrdem`, com o `Object.entries` do E08
2. No Início, faça a grade mostrar os produtos filtrados
:::

:::tip Resposta
```jsx
{Object.entries(rotulosDeOrdem).map(([valor, rotulo]) => (
  <Botao key={valor} titulo={rotulo} tamanho="sm"
    variante={ordem === valor ? 'primaria' : 'secundaria'}
    onPress={() => setOrdem(valor)} />
))}
```

```jsx
// src/telas/Inicio.js, junto dos outros hooks; na grade, data={lista}
const { filtros } = useFiltros();
const lista = aplicarFiltros(produtos, filtros);
```

A chave vai para o filtro; o valor é o texto do botão. Ordem nova é uma linha em `comparadores` e outra em `rotulosDeOrdem`: o botão aparece sem mexer no JSX.
:::

---

## :icon[navigation] push, back e replace

| Chamada | O que faz com a pilha | Na Lojinha |
|---|---|---|
| `router.push(rota)` | põe uma tela por cima; voltar retorna | abrir o detalhe |
| `router.back()` | tira a tela de cima | Aplicar nos filtros |
| `router.replace(rota)` | troca a tela atual; não há como voltar a ela | sair de Entrar para a vitrine |
| `<Redirect href={rota} />` | um `replace` feito ao desenhar | mandar quem não entrou para Entrar |

Pergunta-guia: se o cliente tocar em voltar, para onde ele **deve** ir? Se a resposta for "para a tela de antes", use `push`. Se voltar ali não fizer sentido, como a um login já feito, use `replace`.

---

## :icon[lock] Fluxo de entrada com `(auth)` e Redirect

O grupo `(auth)` reúne as telas de quem ainda não entrou: `app/(auth)/entrar.js` responde por `/entrar`. O layout das abas manda quem não entrou para lá:

```jsx
// app/(tabs)/_layout.js, depois dos hooks e antes do return
const logado = false; // simulação: troque para true
if (!logado) return <Redirect href="/entrar" />;
```

```jsx
// src/telas/Entrar.js, o botão principal
<Botao titulo="Entrar" onPress={() => router.replace('/')} />
```

Com `false`, o app abre em Entrar. Troque para `true`, salve e toque em Entrar: as abas aparecem e o voltar não leva de novo ao login. Por enquanto, `logado` é de faz de conta; no E43, ele virá de um contexto preenchido pelo login de verdade, na DummyJSON.

---

## :icon[link] Deep link: um endereço para cada tela

Com o `"scheme": "lojinha"` do `app.json`, cada rota ganha um endereço que outro app pode abrir. Os grupos não entram:

| Link | Abre |
|---|---|
| `lojinha://produto/3` | `app/produto/[id].js` com `id` igual a `'3'` |
| `lojinha://categorias/audio` | a pilha da aba Categorias, em Áudio |
| `lojinha://carrinho` | a aba Carrinho |

No Expo Go, quem recebe o link é o próprio Expo Go: troque `lojinha://` pelo endereço `exp://` que o terminal mostra, com `/--/` antes da rota. Para testar num emulador Android:

```bash
npx uri-scheme open "exp://192.168.0.10:8081/--/produto/3" --android
```

Com `--ios`, o mesmo vale para o simulador do Mac.

---

## :icon[refresh-cw] useFocusEffect: agir ao voltar para a tela

As abas continuam **montadas** quando você troca de aba. Por isso, um `useEffect` com `[]` roda só na primeira visita: ao voltar ao Carrinho, nada roda de novo.

```jsx
import { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';

// dentro do componente da tela
useFocusEffect(
  useCallback(() => {
    console.log('Carrinho em foco');
    return () => console.log('Carrinho saiu de foco');
  }, [])
);
```

A função roda **cada vez** que a tela ganha foco, e a que ela devolve roda quando a tela perde o foco. O `useCallback` evita repetir o efeito a cada desenho. Quando o app buscar os pedidos na API, com o `fetch` do E19, é aqui que o Perfil vai recarregá-los.

---

## :icon[workflow] Padrões de fluxo: onboarding e checkout

| Fluxo | Estrutura | Cuidado |
|---|---|---|
| Onboarding | grupo `(onboarding)` com 2 ou 3 telas de boas-vindas e `Redirect` para quem já viu | lembrar que já viu exige guardar no aparelho, tema do E43 |
| Entrada | grupo `(auth)` com Entrar e Cadastro, o formulário do E35 | `replace` ao entrar, para o voltar não levar ao login |
| Checkout | pilha fora das abas: endereço, pagamento, confirmação | ao confirmar, `router.dismissAll()` fecha a pilha e volta às abas |

Os três seguem a mesma ideia: um grupo ou uma pilha **fora das abas**, com começo, meio e fim. As abas são o lugar de descanso; os fluxos são caminhos com saída.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Criar `filtros.js` dentro de `(tabs)`: ele vira mais uma aba e não sobe como modal
- Guardar a escolha só no `useState` do modal: ao fechar, ela se perde; grave no contexto antes do `router.back()`
- Usar `router.push('/')` depois de entrar: o voltar leva de novo ao login; use `replace`
- Escrever o `if (!logado) return` antes dos hooks: a ordem dos hooks muda entre os desenhos e o app quebra
- Testar `lojinha://` no Expo Go: o link não abre o app; use o endereço `exp://` com `/--/`
:::

---

## Resumo

:::summary
- Modal é uma tarefa curta por cima: `presentation: 'modal'` na pilha raiz, fechado com `router.back()`
- Parâmetro leva dados ao abrir uma rota; contexto devolve a escolha para quem ficou embaixo, e o `aplicarFiltros` do E08 a transforma na lista da vitrine
- `replace` e `Redirect` trocam a tela sem deixar volta: ideais para fluxos de entrada
- Com o `scheme`, cada rota tem um deep link, como `lojinha://produto/3`, sem os grupos
- `useFocusEffect` age cada vez que a tela volta ao foco; `useEffect` com `[]`, só na primeira
:::

---

## :icon[flask-conical] No laboratório

Monte as 4 abas, a pilha em Categorias e o modal de filtros.

:::steps
1. Mova `index.js` e `carrinho.js` para `app/(tabs)/` e corrija os caminhos e a `Pilha`
2. `app/(tabs)/_layout.js`: 4 abas com ícones, cores do tema e badge
3. `src/telas/Perfil.js` provisório e `app/(tabs)/perfil.js`
4. Pilha em Categorias: `_layout.js`, `index.js` e `[slug].js` com `ProdutosCategoria`
5. `FiltrosContext`, `Filtros.js` com `rotulosDeOrdem` e `app/filtros.js` como modal
6. No Início, o botão do topo abre os filtros e a grade usa `aplicarFiltros`
7. Commit "E37: abas, pilha e modal de filtros" e `git push`
:::

**Critérios de entrega**: 4 abas nos dois temas; badge some com o carrinho vazio; um cabeçalho por tela; detalhe cobre a barra; vitrine filtrada por `aplicarFiltros`. Extra: `app/(auth)/entrar.js` com `Redirect`. Entregue o link do repositório.
