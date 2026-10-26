---
title: Estados de carregamento, vazio e erro
summary: Projete os 4 estados de toda tela com esqueleto, vazio com ação, erro com nova tentativa e toast.
module: layout-rn
duration_minutes: 40
objectives:
  - Projetar os 4 estados de uma tela (carregando, vazio, erro e conteúdo)
  - Criar esqueleto, estado vazio e estado de erro reutilizáveis no UI kit
  - Simular carregamento e falha com setTimeout e um sorteio
  - Confirmar uma ação com um toast animado
---

# Estados de carregamento, vazio e erro

Programador Mobile: Módulo Específico · Encontro E19 · Aula 20 de 71

---

## O que você vai aprender

:::goal
- Reconhecer os 4 estados de toda tela: carregando, vazio, erro e conteúdo
- Mostrar o carregamento com `ActivityIndicator` e com um esqueleto que pulsa
- Criar `EstadoVazio` e `EstadoErro` com uma ação para o usuário seguir
- Simular a busca dos produtos e confirmar com um toast "Adicionado ao carrinho"
:::

---

## A tela branca no metrô

Você abre o app do banco no metrô, com sinal fraco. A tela do extrato fica branca.

Está carregando? Você não teve movimentações no mês? O app quebrou? Sem resposta, você fecha e abre o app três vezes, e desiste.

A tela foi pensada só para o dia bom: internet rápida e dados prontos. Em todos os outros momentos, ela fica muda.

:::question
Em quantas situações diferentes uma tela de lista pode estar, do momento em que abre até mostrar os itens?
:::

---

## :icon[layout-grid] Os 4 estados de toda tela

| Estado | Quando | O que mostrar | No Lojinha |
|---|---|---|---|
| Carregando | os dados não chegaram | esqueleto ou indicador | Início no primeiro 1,5 s |
| Vazio | chegou, mas não há nada | mensagem e ação | carrinho sem itens |
| Erro | a busca falhou | o que houve e "Tentar novamente" | sem conexão |
| Conteúdo | dados prontos | a tela de verdade | grade de produtos |

No E05 (React web), você tratou `carregando` e `erro`. Agora carregando, vazio e erro viram componentes do UI kit.

:::tip
Antes de codar uma tela, desenhe os quatro estados no papel. Estado em branco no papel é decisão que falta.
:::

---

## :icon[hourglass] ActivityIndicator no EstadoCarregando

O **`ActivityIndicator`** é o indicador de carregamento nativo: um círculo girando no Android, traços em roda no iOS.

```jsx
// imports de react-native, do tema e dos tokens omitidos
export default function EstadoCarregando({ mensagem = 'Carregando...' }) {
  const { cores } = useTema();
  return (
    <View style={[estilos.centro, { backgroundColor: cores.fundo }]}>
      <ActivityIndicator size="large" color={cores.primaria} />
      <Text style={[estilos.mensagem, { color: cores.textoSuave }]}>{mensagem}</Text>
    </View>
  );
}
```

- `size`: `'small'` (padrão) ou `'large'`
- `color`: a primária do tema, visível nos dois temas
- Bom para esperas em área pequena ou de forma desconhecida: o envio de um formulário, o rodapé de uma lista

---

## :icon[layers] Esqueleto: a forma antes do conteúdo

Um **esqueleto** (skeleton) desenha blocos cinza no lugar exato da imagem, do nome e do preço que vão chegar. Lojas, redes sociais e apps de vídeo usam essa técnica.

```jsx
<View style={estilos.cartaoEsqueleto}>
  <Esqueleto altura={140} />              {/* a imagem */}
  <Esqueleto largura="70%" altura={16} /> {/* o nome */}
  <Esqueleto largura="40%" altura={16} /> {/* o preço */}
</View>
```

| | `ActivityIndicator` | Esqueleto |
|---|---|---|
| Mostra | que algo acontece | a forma do que vem |
| Espera percebida | parece mais longa | parece mais curta |
| Quando os dados chegam | a tela muda de layout | os blocos viram cartões no mesmo lugar |

---

## :icon[sparkles] Esqueleto pulsando com Animated.loop

Em `src/components/ui/Esqueleto.js`:

```jsx
// imports de react, react-native e do tema omitidos
export default function Esqueleto({ largura = '100%', altura = 16, style }) {
  const { cores, raio } = useTema();
  const opacidade = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const pulso = Animated.loop(Animated.sequence([
      Animated.timing(opacidade, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(opacidade, { toValue: 0.4, duration: 700, useNativeDriver: true }),
    ]));
    pulso.start();
    return () => pulso.stop();
  }, []);
  const forma = { width: largura, height: altura, borderRadius: raio.sm, backgroundColor: cores.borda };
  return <Animated.View style={[forma, { opacity: opacidade }, style]} />;
}
```

- `Animated.sequence`: clareia e depois escurece
- `Animated.loop`: repete a sequência até alguém parar
- O `return` do efeito para o pulso quando o esqueleto sai da tela

Na tela: blocos cinza que respiram devagar, sinal de que algo está a caminho.

---

## Pratique

:::example Desafio (3 minutos)
Para cada situação, diga o estado e o que a tela mostra:

1. Você busca "bicicleta" e nenhum produto tem esse nome
2. O app abre com o celular em modo avião
3. A tela Detalhe espera os dados do produto
4. A aba Favoritos de quem nunca favoritou nada
:::

:::tip Resposta
1. Vazio: "Nenhum produto para 'bicicleta'" e a ação "Limpar busca".
2. Erro: "Sem conexão" e "Tentar novamente".
3. Carregando: esqueleto com a forma do Detalhe (imagem grande, título, preço).
4. Vazio, mas que ensina: "Toque no coração de um produto para guardá-lo aqui" e "Ver produtos".
:::

---

## :icon[package] EstadoVazio: vazio com uma saída

Uma tela vazia sem ação é um beco sem saída. O `EstadoVazio` diz o que aconteceu e oferece o próximo passo.

```jsx
// imports omitidos: react-native, Ionicons, useTema, tokens e Botao
export default function EstadoVazio({ icone = 'file-tray-outline', titulo, mensagem, textoAcao, onAcao }) {
  const { cores } = useTema();
  return (
    <View style={[estilos.centro, { backgroundColor: cores.fundo }]}>
      <Ionicons name={icone} size={56} color={cores.textoSuave} />
      <Text style={[estilos.titulo, { color: cores.texto }]}>{titulo}</Text>
      {mensagem ? <Text style={[estilos.mensagem, { color: cores.textoSuave }]}>{mensagem}</Text> : null}
      {textoAcao ? <Botao titulo={textoAcao} onPress={onAcao} /> : null}
    </View>
  );
}
```

- `mensagem` e `textoAcao` são opcionais: o `? :` só desenha o que veio
- `estilos.centro` usa `flex: 1` e `justifyContent` e `alignItems` em `'center'`: tudo no meio da tela

---

## :icon[shopping-cart] Carrinho vazio com "Ver produtos"

Em `src/telas/Carrinho.js`, o vazio vem antes da lista:

```jsx
import { router } from 'expo-router';
import { EstadoVazio } from '../components/ui'; // reexportado no index.js

export default function Carrinho() {
  const { itens } = useCarrinho();
  if (itens.length === 0) {
    return (
      <EstadoVazio icone="cart-outline" titulo="Seu carrinho está vazio"
        mensagem="Os produtos que você adicionar aparecem aqui."
        textoAcao="Ver produtos" onAcao={() => router.navigate('/')} />
    );
  }
  // a lista do carrinho continua como no E17
}
```

`router.navigate('/')` troca para a aba Início. Na tela: um carrinho desenhado em cinza, o título, a explicação e um botão que leva direto às compras.

---

## :icon[refresh-cw] EstadoErro com "Tentar novamente"

Um bom erro diz o que houve, em português e sem código técnico, e oferece uma saída.

```jsx
// imports omitidos: react-native, Ionicons, useTema, tokens e Botao
export default function EstadoErro({ mensagem = 'Confira sua conexão e tente de novo.', onTentarNovamente }) {
  const { cores } = useTema();
  return (
    <View style={[estilos.centro, { backgroundColor: cores.fundo }]}>
      <Ionicons name="cloud-offline-outline" size={56} color={cores.perigo} />
      <Text style={[estilos.titulo, { color: cores.texto }]}>Algo deu errado</Text>
      <Text style={[estilos.mensagem, { color: cores.textoSuave }]}>{mensagem}</Text>
      <Botao titulo="Tentar novamente" onPress={onTentarNovamente} />
    </View>
  );
}
```

| Evite | Prefira |
|---|---|
| "Error 500" | "Não conseguimos buscar os produtos" |
| "Falha na requisição" | "Confira sua conexão e tente de novo" |
| erro sem botão | "Tentar novamente", que busca de novo |

O ícone em `cores.perigo` reforça, mas o título diz o mesmo: a cor nunca é o único sinal.

---

## :icon[dices] Simulando a busca com setTimeout e sorteio

Os produtos estão em `src/data/produtos.js` e chegam na hora; a API de verdade só chega na UC6. Até lá, você **simula** a espera e a falha em `src/telas/Inicio.js`:

```jsx
const CHANCE_DE_ERRO = 0.3; // fora do componente; 1 força o erro
// dentro de Inicio:
const [carregando, setCarregando] = useState(true);
const [erro, setErro] = useState(null);

function carregar() {
  setCarregando(true);
  setErro(null);
  setTimeout(() => {
    if (Math.random() < CHANCE_DE_ERRO) setErro('Não conseguimos buscar os produtos.');
    setCarregando(false);
  }, 1500);
}

useEffect(() => { carregar(); }, []);
```

- `setTimeout` de 1500 ms imita a espera da rede
- `Math.random()` sorteia um número entre 0 e 1: abaixo de 0.3, falha (3 vezes em 10)
- "Tentar novamente" chama o mesmo `carregar`

---

## :icon[split] Para onde o carregamento leva

:::center
![Diagrama: carregar() leva ao carregando; depois de 1,5 s a tela vai para conteúdo com produtos, para vazio com a lista vazia ou para erro quando falha, 3 vezes em 10; do erro, Tentar novamente volta ao carregando](images/e19-quatro-estados.svg)
:::

Toda busca começa no **carregando**. Quando o `setTimeout` termina, a tela segue para um dos outros três estados. Do erro, o "Tentar novamente" chama o mesmo `carregar` e tudo recomeça pelo carregando.

---

## :icon[route] Inicio: um estado por vez

Quando a simulação termina sem erro, os cartões entram com o `stagger`. Depois dos hooks, um `if` por estado decide o que desenhar:

```jsx
useEffect(() => {
  if (carregando || erro) return;
  Animated.stagger(80, entradas.map((valor) =>
    Animated.timing(valor, { toValue: 1, duration: 300, useNativeDriver: true })
  )).start();
}, [carregando, erro]);

if (carregando) return <GradeEsqueleto colunas={colunas} />;
if (erro) return <EstadoErro mensagem={erro} onTentarNovamente={carregar} />;
if (produtos.length === 0) return <EstadoVazio titulo="Nenhum produto por aqui" />;
return <FlatList /* a grade do E18, com EntradaAnimada no renderItem */ />;
```

- `GradeEsqueleto`: componente no próprio `Inicio.js`, com 6 cartões de esqueleto em grade
- Com dados locais, o vazio nunca aparece; com a API, uma busca sem resultado cai nele
- Todos os hooks vêm **antes** do primeiro `return`

---

## :icon[message-square] Toast: avisar sem interromper

Um **toast** é um aviso curto que aparece no rodapé e some sozinho. Ele confirma sem travar o usuário.

| | `Alert` | Toast |
|---|---|---|
| Interrompe? | sim, exige um toque | não, some em 2 segundos |
| Use para | decidir algo, como remover | confirmar que deu certo |
| Exemplo | "Remover do carrinho?" | "Adicionado ao carrinho" |

No Detalhe, o botão deixa de voltar à lista: o usuário fica e o toast confirma.

```jsx
const [toastVisivel, setToastVisivel] = useState(false);

function adicionarAoCarrinho() {
  adicionar(produto);
  setToastVisivel(true);
}

// último filho da View raiz, fora de qualquer ScrollView
<Toast mensagem="Adicionado ao carrinho" visivel={toastVisivel}
  onSumir={() => setToastVisivel(false)} />
```

---

## :icon[file-code] O componente Toast

Em `src/components/ui/Toast.js`, sem biblioteca: uma `Animated.View` com posição absoluta que aparece, espera e some.

```jsx
export default function Toast({ mensagem, visivel, onSumir }) {
  const { cores } = useTema();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visivel) return;
    AccessibilityInfo.announceForAccessibility(mensagem);
    Animated.sequence([
      Animated.timing(anim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(1800),
      Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => onSumir());
  }, [visivel]);
```

```jsx
  if (!visivel) return null;
  return (
    <Animated.View style={[estilos.toast, { backgroundColor: cores.texto, opacity: anim }]}>
      <Text style={[estilos.texto, { color: cores.fundo }]}>{mensagem}</Text>
    </Animated.View>
  );
}
// estilos.toast: position 'absolute', com left, right e bottom
```

- `Animated.delay(1800)` segura o aviso antes de sumir
- `start` recebe uma função que roda no fim: ela avisa o pai para esconder o toast
- `announceForAccessibility` faz o leitor de tela falar a mensagem, que não recebe foco

---

## :icon[triangle-alert] Erros comuns

:::warning
- Tela só com o estado "conteúdo": sem rede, o usuário vê uma tela branca e não sabe o que fazer
- Vazio ou erro sem ação: ofereça "Ver produtos" ou "Tentar novamente"
- `{itens.length && <Text>...}` com o carrinho vazio: o `0` vai parar fora de `<Text>` e o app quebra; use `itens.length > 0 &&` ou `? :`
- `useEffect` escrito depois de um `if (...) return`: tela vermelha `Rendered more hooks than during the previous render`
- Entregar com `CHANCE_DE_ERRO = 1`: o Início nunca mostra os produtos
:::

---

## Resumo

:::summary
- Toda tela que busca dados tem 4 estados: carregando, vazio, erro e conteúdo
- `ActivityIndicator` serve para esperas pequenas; o esqueleto mostra a forma do que vem e encurta a espera percebida
- Vazio e erro sempre oferecem uma ação, como "Ver produtos" ou "Tentar novamente"
- Até a API chegar, `setTimeout` e `Math.random()` simulam a espera e a falha
- O toast confirma sem interromper; o `Alert` fica para o que exige decisão
:::

---

## :icon[flask-conical] No laboratório

Os 4 estados e o movimento chegam ao Lojinha.

:::steps
1. Desenhe no papel os 4 estados do Início e o carrinho vazio
2. Crie `EstadoCarregando`, `EstadoVazio`, `EstadoErro`, `Esqueleto` e `Toast` em `src/components/ui/` e no `index.js`
3. No Início, simule a busca de 1,5 segundo e mostre a `GradeEsqueleto`
4. Com `CHANCE_DE_ERRO = 1`, teste o "Tentar novamente"; volte a 0.3
5. Cartões entrando com `Animated.stagger` e `EntradaAnimada`
6. Carrinho vazio com "Ver produtos"; no Detalhe, toast e botão que pulsa
7. Teste nos dois temas, commit "E19: animações e estados de tela" e `git push`
:::

**Critérios de entrega**: Início com os 4 estados; valores em `useRef` e `useNativeDriver: true`; vazio e erro com ação; toast que some. Entregue o link do repositório no sistema.
