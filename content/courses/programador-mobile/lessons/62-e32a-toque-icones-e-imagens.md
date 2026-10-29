---
title: Toque, ícones e imagens
summary: Feedback de toque com Pressable, ícones do Ionicons e imagens remotas com expo-image no Lojinha.
module: layout-rn
duration_minutes: 40
objectives:
  - Dar feedback visual ao toque com Pressable, respeitando a área mínima de 44 por 44
  - Usar ícones do Ionicons com as cores do tema
  - Exibir imagens remotas com Image e expo-image
---

# Toque, ícones e imagens

Programador Mobile · Encontro E32 · Aula 62 de 89

---

## O que você vai aprender

:::goal
- Mostrar ao usuário que o toque funcionou, com `Pressable` e `android_ripple`
- Desligar um botão com `disabled` e garantir alvos de 44 por 44
- Usar ícones do `Ionicons` com as cores do tema
- Exibir fotos remotas com `Image` e `expo-image` no `CartaoProduto`
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **feedback** | a resposta do app ao toque: o botão muda na hora, e você sabe que funcionou |
| **desabilitado** | um botão desligado de propósito, que não responde ao toque |
| **área de toque** | o pedaço da tela que aceita o dedo; pode ser maior que o desenho |
| **imagem remota** | uma foto que vem da internet, por um endereço, e leva um tempo para chegar |
| **placeholder** | o que aparece no lugar da foto enquanto ela baixa (do inglês, "guarda-lugar") |
| **cache** | a cópia que o celular guarda do que já baixou, para mostrar na hora da próxima vez |

---

## O toque que ninguém viu

Você está num app de delivery e toca em **Adicionar** no X-Burguer. A tela não muda nada. Você toca de novo, só por garantia. No carrinho: dois lanches.

E a foto do lanche? Um retângulo vazio que, três segundos depois, recebe a imagem de repente e empurra o texto para baixo.

O Lojinha tem hoje problemas parecidos: botões que não reagem ao dedo, nenhum ícone e cartões sem foto.

:::question
Num app que você usa todo dia, como você sabe que o toque funcionou antes mesmo de o resultado aparecer?
:::

---

## Feedback de toque

Como você sabe que o elevador ouviu o seu chamado, antes de ele chegar?

---

## :icon[hand] Pressable sabe quando está pressionado

**Feedback** é a resposta do app ao seu toque. Pense no botão do elevador: ele acende na hora em que você aperta, antes de o elevador chegar. Você sabe que deu certo e não aperta de novo.

O `Pressable` do E27 avisa se o dedo **está encostado** nele agora. Para usar esse aviso, passe uma **função** para `style`, como você passa um callback desde o E10:

```jsx
<Pressable
  onPress={() => console.log('comprar')}
  style={({ pressed }) => [
    estilos.botao,
    { backgroundColor: cores.primaria },
    pressed && estilos.pressionado,
  ]}
>
  <Text style={estilos.texto}>Comprar</Text>
</Pressable>
```

```jsx
pressionado: { opacity: 0.7, transform: [{ scale: 0.97 }] },
```

Na tela: o botão fica translúcido e encolhe um pouco ao toque; ao soltar, volta ao normal.

---

## :icon[list-ordered] O estilo de toque em português

| Linha | O que ela diz |
|---|---|
| `style={(...) => [...]}` | "o estilo é uma função": o `Pressable` chama de novo quando o dedo encosta e quando solta |
| `({ pressed })` | "do objeto que chegar, pegue o campo `pressed`": a desestruturação no parâmetro (E09) |
| `pressed` | `true` enquanto o dedo está no botão; `false` quando não está |
| `[estilos.botao, ...]` | o mesmo array de estilos do E27: os estilos se somam |
| `pressed && estilos.pressionado` | "**só se** estiver pressionado, some este estilo"; com `false`, o array ignora |
| `opacity: 0.7` e `scale: 0.97` | 70% de opacidade, translúcido, e 97% do tamanho |

---

## :icon[circle-dot] android_ripple: a onda do Android

No Android, o toque costuma responder com uma **onda** (em inglês, *ripple*): um círculo nasce no ponto do dedo e se espalha, como a pedra que cai na água. O `Pressable` desenha essa onda com `android_ripple`:

```jsx
<Pressable
  onPress={comprar}
  android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}
  style={({ pressed }) => [estilos.botao, pressed && estilos.pressionado]}
>
```

`rgba(255, 255, 255, 0.3)` é branco com 30% de força: os três primeiros números formam a cor; o último, a transparência.

| Opção | Efeito |
|---|---|
| `color` | cor da onda; use transparência |
| `borderless: true` | a onda sai em círculo, além das bordas: bom para ícones soltos |
| `radius` | tamanho máximo da onda |

:::info
O iPhone ignora `android_ripple`. Mantenha também o estilo de `pressed`: assim todo toque tem resposta nas duas plataformas.
:::

---

## :icon[hand] Feedback de toque na prática

Três lugares do Lojinha, três jeitos de responder ao dedo:

**1. Botão "Comprar":** fica translúcido enquanto o dedo está em cima.

```jsx
style={({ pressed }) => [estilos.botao, pressed && { opacity: 0.7 }]}
```

**2. Cartão inteiro tocável:** o fundo escurece um pouco, com a cor da borda do tema.

```jsx
style={({ pressed }) => [estilos.cartao, pressed && { backgroundColor: cores.borda }]}
```

**3. Ícone solto, como um coração:** no Android, a onda sai redonda, além das bordas. No iPhone, quem responde é o estilo de `pressed`.

```jsx
android_ripple={{ color: cores.borda, borderless: true }}
```

---

## Botão desabilitado

Por que a máquina de refrigerante acende a luz de "esgotado" antes de você apertar?

---

## :icon[ban] disabled: quando o toque não vale

Um botão **desabilitado** está desligado de propósito. Pense na máquina de refrigerante com a luz "esgotado" acesa: o botão não funciona, e a luz avisa antes de você tentar.

"Finalizar compra" com o carrinho vazio não deve fazer nada. A prop **`disabled`** desliga o toque: `onPress` não é chamado e `pressed` não muda.

```jsx
const carrinhoVazio = itens.length === 0;

<Pressable
  onPress={finalizar}
  disabled={carrinhoVazio}
  style={[estilos.botao, carrinhoVazio && estilos.desabilitado]}
>
  <Text style={estilos.texto}>Finalizar compra</Text>
</Pressable>
```

```jsx
desabilitado: { opacity: 0.4 },
```

`carrinhoVazio` é `true` quando a lista não tem itens. Ele faz duas coisas: desliga o toque e liga o estilo apagado.

:::warning
`disabled` não muda a aparência: a luz de "esgotado" é por sua conta. Sem um estilo próprio, o usuário toca, nada acontece e ele acha que o app travou.
:::

---

## :icon[ban] disabled na prática

Dois botões do Lojinha que às vezes não valem. Nos dois, a mesma condição desliga o toque **e** liga o estilo apagado.

**1. "Finalizar compra", com o carrinho vazio:**

```jsx
disabled={itens.length === 0}
style={[estilos.botao, itens.length === 0 && estilos.desabilitado]}
```

**2. "Adicionar", com o produto esgotado:**

```jsx
disabled={produto.estoque === 0}
style={[estilos.botao, produto.estoque === 0 && estilos.desabilitado]}
```

Na tela: enquanto a condição é `true`, o botão fica com 40% de opacidade e não responde. Quando ela vira `false`, ele volta ao normal sozinho, no próximo desenho.

---

## Ícones

Como você acha a lupa num app sem ler nenhuma palavra?

---

## :icon[shapes] Ícones com Ionicons

Um **ícone** é um desenho pequeno que diz o que o botão faz, como uma placa de trânsito: dá para entender sem ler.

O pacote `@expo/vector-icons` reúne várias famílias de ícones. O projeto criado com `create-expo-app --template blank` não traz o pacote: instale com `npx expo install @expo/vector-icons`. No Lojinha, use o **Ionicons**, desenhado para iOS e Android.

```jsx
import { Ionicons } from '@expo/vector-icons';

const { cores } = useTema();

<Ionicons name="cart-outline" size={24} color={cores.primaria} />
```

- `name`: o nome exato do ícone, em texto
- `size`: o tamanho, na mesma unidade do `fontSize`
- `color`: sempre uma cor do tema, para o ícone acompanhar o claro e o escuro

---

## :icon[search] Onde achar o nome do ícone

O nome do ícone precisa estar escrito igual ao do catálogo, letra por letra, e em inglês.

:::steps
1. Abra o diretório oficial do Expo: icons.expo.fyi
2. Filtre por **Ionicons**, para não pegar ícone de outra família
3. Busque em inglês: "cart" (carrinho), "heart" (coração), "search" (lupa)
4. Clique no ícone e copie o nome que o site mostra
:::

Muitos ícones têm duas versões: **cheia** e de **contorno**, como `heart` e `heart-outline`. Nome errado não derruba o app: no lugar do ícone aparece um ponto de interrogação.

---

## :icon[shapes] Ícones na prática

Três usos, no Lojinha e no Projeto 6:

**1. No cabeçalho, o carrinho na cor do tema:**

```jsx
<Ionicons name="cart-outline" size={24} color={cores.primaria} />
```

**2. Favorito, cheio ou de contorno:** o ternário do E13 escolhe o nome conforme o valor de `favorito`.

```jsx
<Ionicons name={favorito ? 'heart' : 'heart-outline'} size={24} color={cores.perigo} />
```

**3. Ao lado de um texto, menor e discreto,** como o local da casa no Projeto 6:

```jsx
<Ionicons name="location-outline" size={16} color={cores.textoSuave} />
```

Na tela: ao trocar o tema, os três mudam de cor junto, porque a cor vem de `cores`.

---

## Área de toque

Por que o dedo erra um botão que o mouse acertaria fácil?

---

## :icon[target] Área de toque: 44 por 44

A **área de toque** é o pedaço da tela que aceita o dedo. Pense num alvo de dardos: a ponta do dedo é grossa, e um alvo pequeno demais faz errar.

As diretrizes da Apple pedem alvos de pelo menos **44 por 44** pontos; as do Android, 48. Um ícone de 24 sozinho é pequeno demais.

O jeito mais direto é dar ao `Pressable` o tamanho mínimo:

```jsx
// 1. dar ao Pressable o tamanho mínimo
carrinho: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
```

O `width` e o `height` fazem a área de 44 por 44; o `alignItems` e o `justifyContent` põem o ícone no meio dela.

---

## :icon[target] hitSlop: um alvo maior que o desenho

Quando o desenho precisa continuar pequeno, amplie só a área que aceita o dedo:

```jsx
// 2. ou ampliar a área sem mudar o desenho
<Pressable onPress={favoritar} hitSlop={10}>
  <Ionicons name="heart-outline" size={24} color={cores.texto} />
</Pressable>
```

::::columns
:::col
![Diagrama: um ícone de coração de 24 com hitSlop de 10 em cada lado; a área de toque tracejada fica com 44 por 44 sem mudar o desenho](images/e32-hitslop.svg)
:::
:::col
**`hitSlop`** estende a área sensível para fora do componente: 24 + 10 de cada lado = 44. Aceita um número ou `{ top, bottom, left, right }`.
:::
::::

:::warning
Não deixe o `hitSlop` invadir outro alvo: dois ícones colados com áreas sobrepostas disputam o mesmo toque.
:::

---

## :icon[target] Área de toque na prática

Três alvos do Lojinha, três soluções:

**1. Carrinho no cartão:** há espaço sobrando, então o próprio `Pressable` ganha 44 por 44.

```jsx
carrinho: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
```

**2. Dois ícones colados, coração e compartilhar:** o `hitSlop` cresce mais para cima e para baixo, e pouco para os lados, para não invadir o vizinho.

```jsx
<Pressable onPress={favoritar} hitSlop={{ top: 10, bottom: 10, left: 4, right: 4 }}>
```

**3. Um link de texto, "Ver todos":** a letra é pequena, mas a área cresce em volta dela.

```jsx
<Pressable onPress={verTodos} hitSlop={12}>
  <Text style={estilos.link}>Ver todos</Text>
</Pressable>
```

Na tela: nada muda no desenho. Só a área que aceita o dedo cresce.

---

## Pense

```jsx
<Pressable
  onPress={adicionar}
  disabled={esgotado}
  android_ripple={{ color: 'rgba(0, 0, 0, 0.12)' }}
  style={({ pressed }) => [estilos.botao, pressed && { opacity: 0.7 }]}
>
  <Ionicons name="cart-outline" size={20} color={cores.fundo} />
  <Text style={estilos.texto}>Adicionar</Text>
</Pressable>
```

:::question
Que feedback este botão dá ao toque no Android? E no iPhone? E quando `esgotado` é `true`?
:::

:::tip Resposta
- Android: a onda se espalha e o botão fica translúcido
- iPhone: só fica translúcido, porque `android_ripple` é ignorado
- Esgotado: não responde, mas **parece igual**. Falta `esgotado && estilos.desabilitado` no array, e o usuário acha que o app travou
:::

---

## :icon[mouse-pointer-click] Exemplo: botão com ícone e feedback

Tudo junto: onda no Android, transparência nas duas plataformas, ícone e texto lado a lado.

```jsx
<Pressable
  onPress={() => console.log('ver carrinho')}
  android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}
  style={({ pressed }) => [
    estilos.botao,
    { backgroundColor: cores.primaria },
    pressed && { opacity: 0.8 },
  ]}
>
  <Ionicons name="cart-outline" size={20} color={cores.fundo} />
  <Text style={[estilos.texto, { color: cores.fundo }]}>Ver carrinho</Text>
</Pressable>
```

```jsx
botao: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  gap: espaco.sm, minHeight: 44, paddingHorizontal: espaco.lg, borderRadius: raio.md },
```

- `flexDirection: 'row'` põe ícone e texto na mesma linha, e o `gap` separa os dois
- `minHeight: 44` garante a área de toque, mesmo com texto curto
- Ícone e texto usam `cores.fundo` para contrastar com a primária

---

## Imagens

Você compraria um sofá pela internet sem medir a sala antes?

---

## :icon[image] Image do React Native

A **`Image`** mostra uma foto. Ela pode vir de dois lugares:

- **Local:** um arquivo dentro do projeto, trazido com `require`. O tamanho dele já é conhecido
- **Remota:** uma foto da internet, por um endereço. É como um móvel comprado pela internet: você mede o espaço antes de ele chegar. O React Native só descobre o tamanho da foto depois que ela chega; sem `width` e `height`, ela fica com tamanho zero e nada aparece

```jsx
import { Image } from 'react-native';

<Image source={require('../../assets/icon.png')} style={{ width: 48, height: 48 }} />

<Image
  source={{ uri: 'https://picsum.photos/seed/fone/400/400' }}
  style={{ width: 120, height: 120, borderRadius: raio.md }}
  resizeMode="cover"
/>
```

Em `source={{ uri: '...' }}`, as chaves de fora são do JSX; as de dentro formam um objeto com o campo `uri`, o endereço da foto.

---

## :icon[image] resizeMode: a foto dentro do espaço

Quando a foto e o espaço reservado têm formatos diferentes, o **`resizeMode`** decide como ela se ajeita.

:::center
![Comparação: a mesma foto deitada numa caixa quadrada; cover preenche e corta as sobras, contain mostra tudo com faixas vazias, stretch deforma e center não amplia](images/e32-resizemode.svg)
:::

| Valor | O que faz |
|---|---|
| `cover` (padrão) | preenche o espaço e corta as sobras |
| `contain` | mostra a foto inteira; pode sobrar faixa vazia |
| `stretch` | estica a foto e deforma |
| `center` | centraliza, sem ampliar |

---

## :icon[image] Imagens na prática

O tamanho e o `resizeMode` mudam conforme o lugar da foto:

**1. Foto do produto no cartão:** quadrada; preenche e corta as sobras.

```jsx
<Image source={{ uri: produto.imagem }} style={{ width: 80, height: 80 }} resizeMode="cover" />
```

**2. Foto de perfil:** redonda. Com o `borderRadius` na metade do lado, o quadrado vira círculo.

```jsx
<Image source={{ uri: 'https://picsum.photos/seed/ana/200/200' }} style={{ width: 48, height: 48, borderRadius: 24 }} />
```

**3. Logo da loja:** inteiro, sem cortar nada; sobra faixa vazia nos lados.

```jsx
<Image source={require('../../assets/icon.png')} style={{ width: 120, height: 60 }} resizeMode="contain" />
```

---

## :icon[zap] expo-image: a imagem do Expo

O **`expo-image`** é um pacote do Expo que substitui a `Image` do React Native por uma versão mais rápida, com cache e um espaço reservado enquanto a foto baixa.

```bash
npx expo install expo-image
```

```jsx
import { Image } from 'expo-image';

<Image
  source="https://picsum.photos/seed/fone/400/400"
  contentFit="cover"
  style={{ width: 120, height: 120, borderRadius: raio.md }}
/>
```

- `source` aceita o endereço direto, sem `{ uri }` (o formato com `uri` também funciona)
- **`contentFit`** faz o papel do `resizeMode`: `cover`, `contain`, `fill`, `none` ou `scale-down`
- O tamanho continua obrigatório

:::warning
O nome é o mesmo nos dois pacotes: `Image`. Importe de um lugar só em cada arquivo.
:::

---

## :icon[hourglass] placeholder, transition e cache

No 4G do ônibus, a foto do fone leva 2 segundos. Sem nada no lugar, o cartão fica com um buraco e a foto surge de repente.

```jsx
const BLURHASH = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

<Image
  source={produto.imagem}
  placeholder={{ blurhash: BLURHASH }}
  transition={300}
  contentFit="cover"
  style={estilos.imagem}
/>
```

- **`placeholder`**: o que aparece enquanto baixa, como a plaquinha de "reservado" na mesa do restaurante. O **blurhash** é um texto curto que desenha uma versão borrada de uma foto (gere o seu em blurha.sh)
- **`transition`**: a foto entra num esmaecimento de 300 milissegundos
- **Cache**: a gaveta do celular. A foto baixada fica guardada no aparelho e, na próxima vez, aparece na hora, até sem internet. A prop `cachePolicy` muda esse comportamento

---

## O CartaoProduto

Foto, preço e carrinho num cartão só: e se o cliente pedir mais do que tem no estoque?

---

## :icon[shopping-cart] Exemplo: CartaoProduto

O `CartaoProduto` junta o que você viu hoje. Em `src/components/CartaoProduto.js`, o cartão de wireframe do E30 ganha foto e botão de carrinho. `BLURHASH` é uma constante no topo do arquivo.

```jsx
// imports de react-native, expo-image, Ionicons, tema e formatarPreco omitidos
export default function CartaoProduto({ produto, onAdicionar }) {
  const { cores } = useTema();
  return (
    <View style={[estilos.cartao, { backgroundColor: cores.superficie }]}>
      <Image source={produto.imagem} placeholder={{ blurhash: BLURHASH }}
        contentFit="cover" transition={300} style={estilos.imagem} />
      <View style={estilos.textos}>
        <Text style={[estilos.nome, { color: cores.texto }]}>{produto.nome}</Text>
        <Text style={[estilos.preco, { color: cores.primaria }]}>{formatarPreco(produto.preco)}</Text>
      </View>
      {/* botão de carrinho */}
    </View>
  );
}
```

O preço não pede código novo. O `formatarPreco` mora em `src/utils/formatar.js` desde o E05 e chegou ao app com a pasta `src/` do `lojinha-regras`, no E30. Importe, não reescreva:

```javascript
import { formatarPreco } from '../utils/formatar';

formatarPreco(199.9); // 'R$ 199,90'
```

Por dentro, é o `Intl.NumberFormat` do E06, criado uma vez. A mesma função que formatava no terminal agora formata na tela.

---

## :icon[target] CartaoProduto: o botão de carrinho

No lugar do comentário `{/* botão de carrinho */}`, um ícone com área de 44 por 44 e onda circular:

```jsx
<Pressable
  onPress={onAdicionar}
  android_ripple={{ color: cores.borda, borderless: true }}
  style={({ pressed }) => [estilos.carrinho, pressed && { opacity: 0.6 }]}
>
  <Ionicons name="cart-outline" size={24} color={cores.primaria} />
</Pressable>
```

```jsx
const estilos = StyleSheet.create({
  cartao: { flexDirection: 'row', alignItems: 'center', gap: espaco.md, padding: espaco.md, borderRadius: raio.md },
  imagem: { width: 80, height: 80, borderRadius: raio.sm },
  textos: { flex: 1, gap: espaco.xs },
  nome: { fontSize: fonte.corpo },
  preco: { fontSize: fonte.titulo, fontWeight: 'bold' },
  carrinho: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
```

Na tela: foto quadrada à esquerda, nome e preço no meio, carrinho à direita. O `flex: 1` dos textos empurra o ícone para a borda.

O cartão não guarda carrinho: só chama `onAdicionar`. Quem decide o que o toque faz é a tela.

---

## :icon[warehouse] O carrinho respeita o estoque

Na `Inicio`, o toque usa o `adicionarItem` do E09, que veio em `src/regras/carrinho.js`. Desde o E17, ele lança `EstoqueInsuficienteError` quando a quantidade passa do estoque. O Tênis de Corrida tem 1: sem tratamento, o segundo toque vira tela vermelha.

O `try`/`catch` do E17 é a rede de proteção do trapezista: se a regra lançar o erro, o `catch` segura, e o app não cai.

```javascript
function adicionar(item) {
  try {
    setItens(adicionarItem(itens, item));
  } catch (erro) {
    if (!(erro instanceof ErroDeNegocio)) throw erro;
    Alert.alert('Carrinho', erro.message);
  }
}
```

```jsx
<CartaoProduto produto={item} onAdicionar={() => adicionar(item)} />
```

`ErroDeNegocio` vem de `../modelos/erros`, e o `Alert`, do `react-native` (E28).

---

## :icon[list-ordered] O adicionar em português

| Linha | O que ela diz |
|---|---|
| `try { ... }` | "tente fazer isto" |
| `setItens(adicionarItem(itens, item))` | "monte a lista nova, com o item, e entregue ao estado" |
| `catch (erro)` | "se der erro, segure aqui" |
| `if (!(erro instanceof ErroDeNegocio)) throw erro` | "não é erro de negócio? Então é bug: lance de novo" |
| `Alert.alert('Carrinho', erro.message)` | "mostre um aviso com o título Carrinho e o texto do erro" |
| `onAdicionar={() => adicionar(item)}` | "no toque, chame `adicionar` com este produto" |

É o padrão do E17: trate o esperado, relance o bug. Na tela: "Tênis de Corrida: só 1 em estoque."

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Property 'pressed' doesn't exist` | `pressed` foi usado fora da função do `style` | `style={({ pressed }) => [...]}` |
| `?` no lugar do ícone e um aviso no terminal | nome errado ou de outra família (`carrinho`, `shopping-cart`) | copiar o nome do icons.expo.fyi, com o filtro Ionicons |
| `Unable to resolve` com `expo-image` ou `@expo/vector-icons` | o pacote não foi instalado neste projeto | `npx expo install` e o nome, na pasta do app; depois, `npx expo start -c` |
| `Tênis de Corrida: só 1 em estoque.` em tela vermelha | o erro do estoque chegou sem `try` | usar o `adicionar(item)`, com `try` |

---

## :icon[triangle-alert] Erros comuns

Estes não mostram mensagem nenhuma:

:::warning
- Imagem remota sem `width` e `height`: ela baixa, mas fica com tamanho zero e nada aparece
- `disabled` sem estilo próprio: o botão para de responder, mas parece igual
- Ícone de 24 sem `hitSlop` nem área de 44: o dedo erra e acerta o vizinho
:::

---

## Resumo

:::summary
- `style={({ pressed }) => [...]}` dá feedback ao toque; `android_ripple` soma a onda no Android
- `disabled` desliga o toque, mas a aparência de desabilitado é por sua conta
- Todo alvo de toque tem pelo menos 44 por 44, com tamanho próprio ou `hitSlop`
- `Ionicons` recebe `name`, `size` e uma `color` do tema; os nomes estão em icons.expo.fyi
- Imagem remota precisa de tamanho; o `expo-image` acrescenta `contentFit`, `placeholder`, `transition` e cache
:::

---

## :icon[arrow-right] Próximos passos

O Lojinha agora responde ao toque e mostra fotos, mas ainda tem a cara de qualquer app: fonte do sistema, ícone do Expo, splash branca.

Na aula 63, você dá identidade a ele:

- :icon[text] a fonte Inter carregada com `useFonts`, com a splash segurando a abertura
- :icon[layers] uma hierarquia tipográfica com os tokens de `fonte`
- :icon[smartphone] `StatusBar`, ícone e splash combinando com o tema
- :icon[flask-conical] no laboratório, `Botao`, `CartaoProduto` e o carrinho com as regras do `lojinha-regras`
