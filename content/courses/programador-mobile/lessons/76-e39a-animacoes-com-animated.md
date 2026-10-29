---
title: Animações com Animated
summary: Dê movimento com propósito à Lojinha com Animated, timing, spring, interpolate e o driver nativo.
module: layout-rn
duration_minutes: 40
objectives:
  - Criar animações com Animated.Value, timing e spring
  - Animar opacidade e deslocamento com interpolate e useNativeDriver
  - Encadear a entrada dos cartões com Animated.stagger
  - Decidir o que animar e respeitar quem reduz o movimento
---

# Animações com Animated

Programador Mobile · Encontro E39 · Aula 76 de 89

---

## O que você vai aprender

:::goal
- Decidir quando uma animação comunica e quando só enfeita
- Animar com `Animated.Value`, `Animated.timing` e `Animated.spring`
- Manter 60 quadros por segundo com `useNativeDriver` e `interpolate`
- Fazer os cartões da Lojinha entrarem em sequência com `Animated.stagger`
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **animação** | uma mudança na tela que acontece aos poucos, em vez de num salto |
| **`Animated`** | a ferramenta de animação que já vem no React Native |
| **quadro** (*frame*) | cada desenho da tela; o celular faz 60 por segundo |
| **driver nativo** (*native driver*) | o modo em que o próprio celular, e não o seu JavaScript, calcula a animação |
| **interpolar** | traduzir um valor de uma faixa para outra: de 0 a 1 vira de 24 a 0 |
| **mola** (*spring*) | movimento que passa um pouco do destino e volta |

---

## O toque que parece não funcionar

Você pede uma pizza no app de delivery e toca em **Adicionar**. Nada muda na tela. Você toca de novo, só para garantir. No carrinho: duas pizzas.

O app funcionou nas duas vezes. O problema é que ele não **disse** que funcionou.

Compare com um app de banco: ao confirmar uma transferência, um aviso verde sobe do rodapé e some sozinho. Você nem precisa ler para saber que deu certo.

:::question
O que a Lojinha deveria mostrar, em menos de meio segundo, quando você toca em "Adicionar ao carrinho"?
:::

---

## Animação com propósito

Para que serve a seta do carro? E o pisca-alerta ligado sem motivo?

---

## :icon[lightbulb] Animação comunica, não enfeita

Uma **animação** é uma mudança que acontece aos poucos, em vez de num salto. A boa animação é a seta do carro: avisa algo a quem está olhando. Pisca-alerta ligado sem motivo vira ruído.

Ela responde a uma pergunta: "meu toque funcionou?", "o que mudou?".

| Animação | O que ela comunica |
|---|---|
| Botão que pulsa ao toque | seu toque funcionou |
| Cartões entrando um após o outro | o conteúdo chegou; leia de cima para baixo |
| Aviso que sobe e some | deu certo, sem interromper você |
| Blocos cinza pulsando | está carregando, e a tela vai ter este formato |

Resposta a toque: de 150 a 300 ms (milissegundos; 1000 ms são 1 segundo).

---

## :icon[ban] Quando não animar

Animação que não responde a nenhuma pergunta só atrapalha:

- **Logo girando sem parar**: nada mudou, e o giro distrai
- **Tudo se mexendo ao mesmo tempo**: o olho não sabe para onde ir
- **Transição que faz esperar**: 1 segundo para trocar de tela é 1 segundo perdido, toda vez
- **Movimento grande e rápido**: incomoda e pode dar tontura em quem é sensível

Antes de animar, pergunte: o que esta animação comunica? Se a resposta for "nada", não anime.

---

## Pense

:::question
O que cada animação comunica? Alguma só enfeita?

1. Os cartões de produto entram um depois do outro ao abrir o Início
2. O logo da Lojinha gira sem parar no cabeçalho
3. O botão "Adicionar ao carrinho" pulsa quando você toca nele
4. A tela inteira desliza por 1 segundo ao trocar de aba
:::

:::tip Resposta
1. Comunica: o conteúdo chegou, e a ordem guia a leitura.
2. Só enfeita: nada mudou, o giro distrai e incomoda quem é sensível a movimento.
3. Comunica: o toque funcionou e o produto foi para o carrinho.
4. A ideia comunica (você mudou de lugar), mas 1 segundo atrasa o usuário: 200 a 300 ms são suficientes.
:::

---

## O valor animado

Como o dimmer acende a luz devagar, sem dar um salto?

---

## :icon[variable] Animated.Value guardado em useRef

O **`Animated.Value`** é um número que muda ao longo do tempo, como o botão giratório de um dimmer: a luz acompanha a posição do botão.

```jsx
import { useRef } from 'react';
import { Animated } from 'react-native';

export default function FaixaFrete() {
  const opacidade = useRef(new Animated.Value(0)).current;
  // 0 = invisível, 1 = totalmente visível
}
```

- `new Animated.Value(0)` cria o número, começando em 0
- Mudar esse número **não** redesenha o componente: o `Animated` atualiza a tela por fora do React, quadro a quadro
- O corpo do componente roda a cada renderização; o `useRef`, a caixa `{ current }` do E35, guarda **o mesmo** valor entre elas
- `.current` entrega o objeto guardado

---

## :icon[layers] Animated.View: quem lê o valor

Se o valor é o botão do dimmer, a **`Animated.View`** é a lâmpada: ela acompanha o número. Uma `View` comum não acompanha, por isso existem as versões animadas dos componentes:

```jsx
<Animated.View style={[estilos.faixa, { opacity: opacidade }]}>
  <Text style={estilos.textoFaixa}>
    Frete grátis acima de {formatarPreco(FRETE_GRATIS_A_PARTIR_DE)}
  </Text>
</Animated.View>
```

| Componente | Use para animar |
|---|---|
| `Animated.View` | caixas, cartões, faixas |
| `Animated.Text` | um texto sozinho |
| `Animated.Image` | uma imagem |
| `Animated.FlatList` | uma lista inteira |

Os filhos (`Text`, uma imagem, um `CartaoProduto`) continuam comuns: eles aparecem e se movem junto com a `Animated.View` que os envolve. O valor da faixa vem de `src/regras/frete.js`, pelo `formatarPreco`: "R$ 150,00".

---

## :icon[timer] Animated.timing: de 0 a 1 em 300 ms

**`Animated.timing`** leva o valor de onde ele está até um destino, num tempo fixo: é girar o dimmer devagar, do 0 ao máximo, em 0,3 segundo. Ao abrir a tela, a faixa aparece suavemente:

```jsx
useEffect(() => {
  Animated.timing(opacidade, {
    toValue: 1,             // destino
    duration: 300,          // em milissegundos
    useNativeDriver: true,  // o motivo aparece nesta aula
  }).start();
}, []);
```

- O `useEffect` com `[]` roda uma vez, depois que a tela aparece
- Nada acontece sem o **`.start()`**: o `timing` só descreve a animação; o `start` dá a partida
- `delay: 200` espera antes de começar
- Para sumir, outra animação com `toValue: 0`

Na tela: a faixa "Frete grátis" vai de invisível a visível em 0,3 segundo, sem salto.

---

## :icon[timer] O valor animado na prática

A mesma faixa do frete, quatro jeitos de mexer no valor:

```jsx
// 1. Aparecer: de 0 a 1 em 0,3 segundo
Animated.timing(opacidade, { toValue: 1, duration: 300, useNativeDriver: true }).start();

// 2. Sumir: de volta a 0
Animated.timing(opacidade, { toValue: 0, duration: 300, useNativeDriver: true }).start();

// 3. Esperar meio segundo e então aparecer
Animated.timing(opacidade, { toValue: 1, duration: 300, delay: 500, useNativeDriver: true }).start();

// 4. Sem o .start(): nada se move, e nenhum erro aparece
Animated.timing(opacidade, { toValue: 1, duration: 300, useNativeDriver: true });
```

O que muda de um caso para outro é só o destino (`toValue`), a espera (`delay`) e a partida (`.start()`).

---

## 60 quadros por segundo

O que acontece com o desenho animado do caderno se você pula páginas?

---

## :icon[gauge] 60 quadros por segundo

A tela do celular é redesenhada 60 vezes por segundo (em alguns aparelhos, 90 ou 120). Cada desenho é um **quadro**, e cada um tem cerca de 16 ms para ficar pronto. Quando um atrasa, o olho percebe um tranco: o app "engasga".

Pense num desenho animado nas folhas de um caderno: se você pula páginas, o boneco salta.

Duas linhas de execução dividem o trabalho:

| Linha | Cuida de |
|---|---|
| JavaScript | seu código: estado, renderizações, `setTimeout` |
| Nativa | desenhar a tela, receber toques, rolar listas |

Sem ajuda, a animação é calculada no JavaScript a cada quadro. Como no event loop do E18, ele faz uma coisa por vez: ocupado, deixa os quadros atrasarem.

---

## :icon[zap] useNativeDriver: a animação no lado nativo

Sem o driver, o JavaScript é um músico que toca cada nota ao vivo: se ele para para atender o telefone, a música engasga. Com **`useNativeDriver: true`**, você entrega a gravação ao rádio, o lado nativo, e ela toca até o fim, mesmo com o músico ocupado.

Na prática, o `start()` entrega a animação inteira ao lado nativo, que calcula cada quadro sozinho.

| | `false` | `true` |
|---|---|---|
| Quem calcula cada quadro | o JavaScript | o lado nativo |
| JavaScript ocupado | a animação engasga | a animação segue lisa |
| O que pode animar | qualquer estilo | só `opacity` e `transform` |

---

## :icon[zap] Driver nativo na prática

Com o driver nativo, só duas propriedades de estilo podem ser animadas: **`opacity`** (a transparência, de 0 a 1) e **`transform`** (deslocar com `translateX` e `translateY`, escalar com `scale`, girar com `rotate`). Três casos, todos com `useNativeDriver: true`:

```jsx
// 1. Aparecer: funciona
<Animated.View style={{ opacity: valor }} />

// 2. Subir até o lugar: funciona
<Animated.View style={{ transform: [{ translateY: valor }] }} />

// 3. Crescer a largura: tela vermelha
<Animated.View style={{ width: valor }} />
// Style property 'width' is not supported by native animated module
```

A mensagem diz: "a propriedade `width` não é aceita pelo módulo nativo". `opacity` e `transform` resolvem quase tudo: aparecer, sumir, deslizar, pulsar.

:::tip
Use `true` sempre que puder. Precisa mudar largura ou cor? Tente `scale` ou `opacity` antes de desligar o driver.
:::

---

## :icon[rocket] Para saber mais: Reanimated

:::info Para saber mais
O **Reanimated** é a biblioteca de animação mais usada em apps React Native profissionais. Ela resolve o que o `Animated` com driver nativo não faz. Não é preciso instalar no curso; se quiser testar em casa: `npx expo install react-native-reanimated`.
:::

```jsx
const opacidade = useSharedValue(0);
const estilo = useAnimatedStyle(() => ({ opacity: opacidade.value }));

// num efeito ou num toque:
opacidade.value = withTiming(1, { duration: 300 });
```

| Situação | `Animated` | Reanimated |
|---|---|---|
| Aparecer, deslizar, pulsar | resolve | resolve |
| Arrastar um cartão com o dedo | trabalhoso | feito para isso |
| Animar altura, largura e cor | só no JavaScript, pode engasgar | no lado nativo |
| Instalação | já vem no React Native | pacote extra |

Comece com `Animated`. Migre quando a animação precisar seguir o dedo ou mexer no layout.

---

## interpolate

Quando o tanque enche, o que o ponteiro do combustível faz?

---

## :icon[arrow-up] interpolate: um valor vira outro

**`interpolate`** traduz um valor em outro, como o marcador de combustível do carro: o tanque vai de vazio a cheio, e o ponteiro anda junto, de um lado ao outro. Com um único valor de 0 a 1, o cartão aparece **e** sobe ao mesmo tempo:

```jsx
function EntradaAnimada({ valor, style, children }) {
  const subida = valor.interpolate({
    inputRange: [0, 1],    // por onde o valor passa
    outputRange: [24, 0],  // o deslocamento correspondente
  });
  return (
    <Animated.View style={[style, { opacity: valor, transform: [{ translateY: subida }] }]}>
      {children}
    </Animated.View>
  );
}
```

- `inputRange` (*faixa de entrada*): o tanque, de 0 a 1
- `outputRange` (*faixa de saída*): o ponteiro, de 24 a 0
- `children` é o que vier dentro da `EntradaAnimada`, como o `CartaoProduto`

---

## :icon[arrow-up] interpolate na prática

:::center
![Animação: o valor anda de 0 a 1 e, pelo interpolate, o translateY anda de 24 a 0; o cartão Fone Bluetooth aparece e sobe até o lugar](images/e39-interpolate.svg)
:::

| `valor` | Opacidade | `translateY` | O cartão |
|---|---|---|---|
| 0 | 0 | 24 | invisível, 24 abaixo do lugar |
| 0,25 | 0,25 | 18 | quase invisível, 18 abaixo |
| 0,5 | 0,5 | 12 | meio visível, 12 abaixo |
| 1 | 1 | 0 | visível e no lugar |

Uso: `<EntradaAnimada valor={entrada}>` envolvendo o `CartaoProduto`, com `entrada` levado de 0 a 1 por um `timing`.

---

## Cartões em cascata

Como se faz a ola no estádio?

---

## :icon[list-ordered] Animated.stagger: um cartão depois do outro

**`Animated.stagger`** (*escalonar*) dispara uma lista de animações com um intervalo entre elas, como a ola no estádio: cada pessoa levanta um pouco depois da vizinha, sem esperar a vizinha sentar.

Na grade do Início, cada cartão precisa do próprio valor:

```jsx
const entradas = useRef(produtos.map(() => new Animated.Value(0))).current;

useEffect(() => {
  const animacoes = entradas.map((valor) =>
    Animated.timing(valor, { toValue: 1, duration: 300, useNativeDriver: true })
  );
  Animated.stagger(80, animacoes).start();
}, []);
```

- `produtos.map(() => new Animated.Value(0))`: um valor em 0 para cada produto, guardados no `useRef`
- `entradas.map(...)`: uma animação de 300 ms para cada valor
- `Animated.stagger(80, animacoes)`: cada animação começa 80 ms depois da anterior

No `renderItem`, a `EntradaAnimada` envolve o `CartaoProduto`, recebe `valor={entradas[index]}` e fica com o `style={estilos.celula}` que estava no cartão.

---

## :icon[list-ordered] Cascata na prática: sequence, parallel e stagger

:::center
![Linha do tempo de três animações de 300 ms: sequence termina em 900 ms, uma depois da outra; parallel termina em 300 ms, todas juntas; stagger(80) termina em 460 ms, cada uma começando 80 ms depois da anterior](images/e39-stagger.svg)
:::

Três animações de 300 ms, a, b e c, disparadas de três jeitos:

| Código | Como dispara | Terminam em |
|---|---|---|
| `Animated.sequence([a, b, c])` | cada uma depois que a anterior **termina**, como a fila do caixa | 900 ms |
| `Animated.parallel([a, b, c])` | todas **juntas** | 300 ms |
| `Animated.stagger(80, [a, b, c])` | cada uma 80 ms depois da anterior, sem esperar o fim: a ola | 460 ms |

---

## A mola

O que uma mola faz quando você aperta e solta?

---

## :icon[shopping-cart] Animated.spring: o botão que pulsa

**`Animated.spring`** não tem duração fixa: simula uma mola, que passa do destino e volta, balançando até parar. É o movimento certo para responder a um toque.

```jsx
const escala = useRef(new Animated.Value(1)).current;

function adicionarAoCarrinho() {
  adicionar(produto);
  escala.setValue(0.85); // encolhe na hora, sem animar
  Animated.spring(escala, { toValue: 1, friction: 3, useNativeDriver: true }).start();
}

<Animated.View style={{ transform: [{ scale: escala }] }}>
  <Botao titulo="Adicionar ao carrinho" onPress={adicionarAoCarrinho} />
</Animated.View>
```

- `scale` de 1 é o tamanho normal; 0,85 é 85% dele
- `setValue(0.85)` muda o número na hora, sem animar
- `friction` (*atrito*): quanto menor, mais a mola balança

Na tela: o botão encolhe e volta com um pequeno pulo. No E37 o botão voltava à vitrine; agora o cliente fica no Detalhe e o pulo confirma a compra.

---

## :icon[shopping-cart] A mola na prática

O mesmo botão, com três atritos:

```jsx
Animated.spring(escala, { toValue: 1, friction: 1, useNativeDriver: true }).start();
// balança muito, como gelatina: chama mais atenção que a compra

Animated.spring(escala, { toValue: 1, friction: 3, useNativeDriver: true }).start();
// um pulo curto: o toque funcionou

Animated.spring(escala, { toValue: 1, friction: 10, useNativeDriver: true }).start();
// quase não balança: parece um timing
```

| | `timing` | `spring` |
|---|---|---|
| Controla | a duração exata | a física da mola |
| Bom para | aparecer, sumir, deslizar | responder a toque, pulsar |
| Na Lojinha | a faixa do frete, os cartões em cascata | o botão "Adicionar ao carrinho" |

---

## Movimento reduzido

O modo silencioso tira o som do celular. A mensagem deixa de chegar?

---

## :icon[eye-off] Quem desliga o movimento

Para algumas pessoas, movimento na tela causa tontura ou enjoo. Por isso o Android tem **Remover animações** e o iOS tem **Reduzir movimento**, nas configurações de acessibilidade. Funciona como o modo silencioso do celular: a mensagem continua chegando, só o toque sai.

O `AccessibilityInfo` pergunta ao sistema se a opção está ligada:

```jsx
const [reduzir, setReduzir] = useState(false);

useEffect(() => {
  async function verificar() {
    setReduzir(await AccessibilityInfo.isReduceMotionEnabled());
  }
  verificar();
}, []);

const duracao = reduzir ? 0 : 300;
```

`isReduceMotionEnabled()` devolve uma `Promise`: por isso a função `async` dentro do efeito, como no E24.

:::info Visão
Nesta aula, a ideia é só conhecer o recurso. Aplique-o quando o app tiver muitas animações, como no projeto integrador.
:::

---

## :icon[eye-off] Movimento reduzido na prática

A mesma linha decide a duração para as duas pessoas:

```javascript
for (const reduzir of [false, true]) {
  const duracao = reduzir ? 0 : 300;
  console.log('reduzir:', reduzir, '-> duração:', duracao);
}
// reduzir: false -> duração: 300
// reduzir: true -> duração: 0
```

| Na Lojinha | Movimento normal | Movimento reduzido |
|---|---|---|
| Cartões do Início | sobem em 300 ms | aparecem prontos, no lugar |
| Aviso "Adicionado ao carrinho" | sobe, espera e some | aparece, espera e some |

A informação fica; só o movimento sai. Esconder o cartão ou o aviso puniria quem precisa da opção.

---

## Mensagens de erro

Nada se mexe e nenhum erro aparece. Por onde começar a procurar?

---

## :icon[siren] Quando aparece um erro

A mensagem é a luz do painel do carro: diz o que aconteceu e onde.

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Style property 'width' is not supported by native animated module` | `width`, `height` ou cor com o driver nativo | animar `scale` ou `opacity` |
| `Animated: useNativeDriver was not specified` (aviso amarelo) | faltou dizer se o driver está ligado | `useNativeDriver: true` |
| Nada se move, sem erro | falta o `.start()`, ou a `View` não é animada | `.start()`; `Animated.View` |
| O cartão some ao trocar o tema | `new Animated.Value(0)` sem `useRef`: cada renderização cria outro valor em 0 | `useRef(...).current` |

---

## Resumo

:::summary
- Uma boa animação comunica: o toque funcionou, o conteúdo chegou, algo mudou
- `useRef(new Animated.Value(0)).current` guarda o número; `Animated.View` o lê; `timing` e `spring` o mudam
- `useNativeDriver: true` leva a animação ao lado nativo e mantém os 60 quadros por segundo, animando só `opacity` e `transform`
- `interpolate` tira opacidade e deslocamento do mesmo valor; `stagger` encadeia a entrada dos cartões
- Respeite quem reduz o movimento; para gestos e animações de layout, migre para o Reanimated
:::

---

## :icon[arrow-right] Próximos passos

Os cartões entram e o botão responde. Mas, antes de os cartões existirem, o que o usuário vê? E se a busca falhar, ou o carrinho estiver vazio?

Na aula 77, você desenha os 4 estados de toda tela e usa a animação para comunicar cada um:

- :icon[hourglass] carregando, com um esqueleto que pulsa
- :icon[shopping-cart] vazio, com uma ação para seguir em frente
- :icon[circle-alert] erro, com "Tentar novamente"
- :icon[message-square] um toast "Adicionado ao carrinho", sem biblioteca
