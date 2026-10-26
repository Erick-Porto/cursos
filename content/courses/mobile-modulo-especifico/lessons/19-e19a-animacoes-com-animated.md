---
title: Animações com Animated
summary: Dê movimento com propósito ao Lojinha com Animated, timing, spring, interpolate e o driver nativo.
module: layout-rn
duration_minutes: 40
objectives:
  - Criar animações com Animated.Value, timing e spring
  - Animar opacidade e deslocamento com interpolate e useNativeDriver
  - Encadear a entrada dos cartões com Animated.stagger
  - Decidir o que animar e respeitar quem reduz o movimento
---

# Animações com Animated

Programador Mobile: Módulo Específico · Encontro E19 · Aula 19 de 71

---

## O que você vai aprender

:::goal
- Decidir quando uma animação comunica e quando só enfeita
- Animar com `Animated.Value`, `Animated.timing` e `Animated.spring`
- Manter 60 quadros por segundo com `useNativeDriver` e `interpolate`
- Fazer os cartões do Lojinha entrarem em sequência com `Animated.stagger`
:::

---

## O toque que parece não funcionar

Você pede uma pizza no app de delivery e toca em **Adicionar**. Nada muda na tela. Você toca de novo, só para garantir. No carrinho: duas pizzas.

O app funcionou nas duas vezes. O problema é que ele não **disse** que funcionou.

Compare com um app de banco: ao confirmar uma transferência, um aviso verde sobe do rodapé e some sozinho. Você nem precisa ler para saber que deu certo.

:::question
O que o Lojinha deveria mostrar, em menos de meio segundo, quando você toca em "Adicionar ao carrinho"?
:::

---

## :icon[lightbulb] Animação comunica, não enfeita

Uma boa animação responde a uma pergunta do usuário: "meu toque funcionou?", "o que mudou?", "o que está chegando?".

| Animação | O que ela comunica |
|---|---|
| Botão que pulsa ao toque | seu toque funcionou |
| Cartões entrando um após o outro | o conteúdo chegou; leia de cima para baixo |
| Aviso que sobe e some | deu certo, sem interromper você |
| Blocos cinza pulsando | está carregando, e a tela vai ter este formato |

**Quando não animar**: logo girando sem parar, tudo se mexendo ao mesmo tempo, transição que faz o usuário esperar. Uma resposta a toque cabe em 150 a 300 ms.

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

- Mudar esse número **não** redesenha o componente: o `Animated` atualiza a tela por fora do React, quadro a quadro
- O corpo do componente roda a cada renderização; o `useRef`, o mesmo do foco no Cadastro, guarda **o mesmo** valor entre elas
- `.current` entrega o objeto guardado

---

## :icon[layers] Animated.View: quem lê o valor

Uma `View` comum não acompanha um `Animated.Value`. Para isso existem as versões animadas dos componentes:

```jsx
<Animated.View style={[estilos.faixa, { opacity: opacidade }]}>
  <Text style={estilos.textoFaixa}>Frete grátis acima de R$ 150</Text>
</Animated.View>
```

| Componente | Use para animar |
|---|---|
| `Animated.View` | caixas, cartões, faixas |
| `Animated.Text` | um texto sozinho |
| `Animated.Image` | uma imagem |
| `Animated.FlatList` | uma lista inteira |

Os filhos (`Text`, uma imagem, um `CartaoProduto`) continuam comuns: eles aparecem e se movem junto com a `Animated.View` que os envolve.

---

## :icon[timer] Animated.timing: de 0 a 1 em 300 ms

**`Animated.timing`** leva o valor de onde ele está até um destino, num tempo fixo. Ao abrir a tela, a faixa aparece suavemente:

```jsx
useEffect(() => {
  Animated.timing(opacidade, {
    toValue: 1,             // destino
    duration: 300,          // em milissegundos
    useNativeDriver: true,  // o motivo aparece nesta aula
  }).start();
}, []);
```

- Nada acontece sem o **`.start()`**: o `timing` só descreve a animação
- `delay: 200` espera antes de começar
- Para sumir, outra animação com `toValue: 0`

Na tela: a faixa "Frete grátis" vai de invisível a visível em 0,3 segundo, sem salto.

---

## Pense

:::question
O que cada animação comunica? Alguma só enfeita?

1. Os cartões de produto entram um depois do outro ao abrir o Início
2. O logo do Lojinha gira sem parar no cabeçalho
3. O botão "Adicionar ao carrinho" pulsa quando você toca nele
4. A tela inteira desliza por 1 segundo ao trocar de aba
:::

:::tip Resposta
1. Comunica: o conteúdo chegou, e a ordem guia a leitura.
2. Só enfeita: nada mudou, o giro distrai e incomoda quem é sensível a movimento.
3. Comunica: o toque funcionou e o produto foi para o carrinho.
4. A ideia comunica (você mudou de lugar), mas 1 segundo atrasa o usuário: 200 a 300 ms bastam.
:::

---

## :icon[gauge] 60 quadros por segundo

A tela do celular é redesenhada 60 vezes por segundo (em alguns aparelhos, 90 ou 120). Cada **quadro** tem cerca de 16 ms para ficar pronto. Quando um atrasa, o olho percebe um tranco: o app "engasga".

Pense num desenho animado feito nas folhas de um caderno: se você pula páginas ao folhear, o boneco salta.

No React Native, duas linhas de execução dividem o trabalho:

| Linha | Cuida de |
|---|---|
| JavaScript | seu código: estado, renderizações, `setTimeout` |
| Nativa | desenhar a tela, receber toques, rolar listas |

Sem ajuda, uma animação é calculada no JavaScript a cada quadro. Se ele estiver ocupado montando uma lista grande, os quadros atrasam.

---

## :icon[zap] useNativeDriver: a animação no lado nativo

Com **`useNativeDriver: true`**, o `start()` entrega a animação inteira ao lado nativo, que calcula cada quadro sozinho. O JavaScript pode travar por um instante, e a animação segue lisa.

| | `false` | `true` |
|---|---|---|
| Quem calcula cada quadro | o JavaScript | o lado nativo |
| JavaScript ocupado | a animação engasga | a animação segue lisa |
| O que pode animar | qualquer estilo | só `opacity` e `transform` |

`transform` cobre deslocar (`translateX`, `translateY`), escalar (`scale`) e girar (`rotate`). Isso basta para quase tudo: aparecer, sumir, deslizar, pulsar.

:::tip
Use `true` sempre que puder. Precisa mudar largura ou cor? Tente `scale` ou `opacity` antes de desligar o driver.
:::

---

## :icon[arrow-up] interpolate: o cartão que entra deslizando

**`interpolate`** traduz um valor em outro. Com um único valor de 0 a 1, o cartão aparece **e** sobe ao mesmo tempo:

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

:::center
![Animação: o valor anda de 0 a 1 e, pelo interpolate, o translateY anda de 24 a 0; o cartão Fone Bluetooth aparece e sobe até o lugar](images/e19-interpolate.svg)
:::

Com `valor` em 0, o cartão fica invisível e 24 abaixo do lugar; em 0,5, meio visível e 12 abaixo; em 1, visível e no lugar.

Uso: `<EntradaAnimada valor={entrada}>` envolvendo o `CartaoProduto`, com `entrada` levado de 0 a 1 por um `timing`.

---

## :icon[list-ordered] Animated.stagger: um cartão depois do outro

Na grade do Início, cada cartão precisa do próprio valor. **`Animated.stagger`** dispara uma lista de animações com um intervalo entre elas:

```jsx
const entradas = useRef(produtos.map(() => new Animated.Value(0))).current;

useEffect(() => {
  const animacoes = entradas.map((valor) =>
    Animated.timing(valor, { toValue: 1, duration: 300, useNativeDriver: true })
  );
  Animated.stagger(80, animacoes).start();
}, []);
```

No `renderItem`, a `EntradaAnimada` envolve o `CartaoProduto`, recebe `valor={entradas[index]}` e fica com o `style={estilos.celula}` que estava no cartão.

:::center
![Linha do tempo de três animações de 300 ms: sequence termina em 900 ms, uma depois da outra; parallel termina em 300 ms, todas juntas; stagger(80) termina em 460 ms, cada uma começando 80 ms depois da anterior](images/e19-stagger.svg)
:::

`Animated.sequence` dispara cada uma depois que a anterior termina; `Animated.parallel`, todas juntas; `Animated.stagger`, cada uma 80 ms depois da anterior, sem esperar o fim.

---

## :icon[shopping-cart] Animated.spring: o botão que pulsa

**`Animated.spring`** não tem duração fixa: simula uma mola, que passa do destino e volta. É o movimento certo para responder a um toque.

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

Na tela: o botão encolhe e volta com um pequeno pulo. Quanto menor o `friction`, mais a mola balança. No E17 o botão voltava à vitrine; agora o cliente fica no Detalhe e o pulo confirma a compra.

| | `timing` | `spring` |
|---|---|---|
| Controla | a duração exata | a física da mola |
| Bom para | aparecer, sumir, deslizar | responder a toque, pulsar |

---

## :icon[eye-off] Quem desliga o movimento

Para algumas pessoas, movimento na tela causa tontura ou enjoo. Por isso o Android tem **Remover animações** e o iOS tem **Reduzir movimento**, nas configurações de acessibilidade.

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

Com `duracao` igual a 0, o cartão aparece pronto, sem deslizar: a informação fica, só o movimento sai.

:::info Visão
Nesta aula, basta conhecer a ideia. Aplique-a quando o app tiver muitas animações, como no projeto integrador.
:::

---

## :icon[rocket] Reanimated: quando migrar

O **Reanimated** é a biblioteca de animação mais usada em apps React Native profissionais. Instalação: `npx expo install react-native-reanimated`.

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

## :icon[triangle-alert] Erros comuns

:::warning
- `new Animated.Value(0)` direto no corpo, sem `useRef`: cada renderização cria um valor novo em 0, e o cartão some no primeiro `setState`
- Esquecer o `.start()`: nada se move e nenhum erro aparece
- Animar `width`, `height` ou `backgroundColor` com `useNativeDriver: true`: tela vermelha `Style property 'width' is not supported by native animated module`
- Passar o valor animado para uma `View` comum: troque por `Animated.View`
- Animar para enfeitar: logo girando, transições de 1 segundo; cada animação precisa responder "o que mudou?"
:::

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

Na aula 20, você desenha os 4 estados de toda tela e usa a animação para comunicar cada um:

- :icon[hourglass] carregando, com um esqueleto que pulsa
- :icon[shopping-cart] vazio, com uma ação para seguir em frente
- :icon[circle-alert] erro, com "Tentar novamente"
- :icon[message-square] um toast "Adicionado ao carrinho", sem biblioteca
