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

Programador Mobile: Módulo Específico · Encontro E12 · Aula 5 de 71

---

## O que você vai aprender

:::goal
- Mostrar ao usuário que o toque funcionou, com `Pressable` e `android_ripple`
- Desligar um botão com `disabled` e garantir alvos de 44 por 44
- Usar ícones do `Ionicons` com as cores do tema
- Exibir fotos remotas com `Image` e `expo-image` no `CartaoProduto`
:::

---

## O toque que ninguém viu

Você está num app de delivery e toca em **Adicionar** no X-Burguer. A tela não muda nada. Você toca de novo, só por garantia. No carrinho: dois lanches.

E a foto do lanche? Um retângulo vazio que, três segundos depois, recebe a imagem de repente e empurra o texto para baixo.

O Lojinha tem hoje problemas parecidos: botões que não reagem ao dedo, nenhum ícone e cartões sem foto.

:::question
Num app que você usa todo dia, como você sabe que o toque funcionou antes mesmo de o resultado aparecer?
:::

---

## :icon[hand] Pressable sabe quando está pressionado

Além de chamar `onPress`, o `Pressable` informa se o dedo **está encostado** nele agora. Para usar isso, passe uma **função** para `style`:

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

- A função recebe `{ pressed }`: `true` enquanto o dedo está no botão
- Ela devolve o mesmo array de estilos que você já usa com as cores do tema
- Na tela: o botão fica translúcido e encolhe um pouco ao toque; ao soltar, volta ao normal

---

## :icon[ban] disabled: quando o toque não vale

"Finalizar compra" com o carrinho vazio não deve fazer nada. A prop **`disabled`** desliga o toque: `onPress` não é chamado e `pressed` não muda.

```jsx
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

:::warning
`disabled` não muda a aparência. Sem um estilo próprio, o botão parece normal: o usuário toca, nada acontece e ele acha que o app travou.
:::

---

## :icon[circle-dot] android_ripple: a onda do Android

No Android, o toque costuma responder com uma **onda** (ripple) que se espalha a partir do dedo. O `Pressable` desenha essa onda com `android_ripple`:

```jsx
<Pressable
  onPress={comprar}
  android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}
  style={({ pressed }) => [estilos.botao, pressed && estilos.pressionado]}
>
```

| Opção | Efeito |
|---|---|
| `color` | cor da onda; use transparência |
| `borderless: true` | a onda sai em círculo, além das bordas: bom para ícones soltos |
| `radius` | tamanho máximo da onda |

:::info
O iPhone ignora `android_ripple`. Mantenha também o estilo de `pressed`: assim todo toque tem resposta nas duas plataformas.
:::

---

## :icon[shapes] Ícones com Ionicons

O pacote `@expo/vector-icons` já vem no projeto criado com `create-expo-app` e reúne várias famílias de ícones. No Lojinha, use o **Ionicons**, desenhado para iOS e Android.

```jsx
import { Ionicons } from '@expo/vector-icons';

const { cores } = useTema();

<Ionicons name="cart-outline" size={24} color={cores.primaria} />
```

- `name`: o nome exato do ícone, em texto
- `size`: o tamanho, na mesma unidade do `fontSize`
- `color`: sempre uma cor do tema, para o ícone acompanhar o claro e o escuro

:::tip Onde achar os nomes
No diretório oficial do Expo, icons.expo.fyi, filtre por Ionicons e busque em inglês: "cart", "heart", "search". Muitos têm versão cheia e de contorno: `heart` e `heart-outline`.
:::

---

## :icon[target] Área de toque: 44 por 44 e hitSlop

O dedo cobre bem mais que um cursor. As diretrizes da Apple pedem alvos de pelo menos **44 por 44** pontos; as do Android, 48. Um ícone de 24 sozinho é pequeno demais.

```jsx
// 1. dar ao Pressable o tamanho mínimo
carrinho: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
```

```jsx
// 2. ou ampliar a área sem mudar o desenho
<Pressable onPress={favoritar} hitSlop={10}>
  <Ionicons name="heart-outline" size={24} color={cores.texto} />
</Pressable>
```

::::columns
:::col
![Diagrama: um ícone de coração de 24 com hitSlop de 10 em cada lado; a área de toque tracejada fica com 44 por 44 sem mudar o desenho](images/e12-hitslop.svg)
:::
:::col
**`hitSlop`** estende a área sensível para fora do componente: 24 + 10 de cada lado = 44. Aceita um número ou `{ top, bottom, left, right }`.
:::
::::

:::warning
Não deixe o `hitSlop` invadir outro alvo: dois ícones colados com áreas sobrepostas disputam o mesmo toque.
:::

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

`flexDirection: 'row'` põe ícone e texto na mesma linha, `gap` separa os dois e `minHeight: 44` garante a área de toque. Ícone e texto usam `cores.fundo` para contrastar com a primária.

---

## :icon[image] Image do React Native

Uma imagem **local** vem com `require` e já tem tamanho conhecido. Uma imagem **remota** só chega depois do download: o React Native não sabe o tamanho dela e, sem `width` e `height`, ela fica com tamanho zero.

```jsx
import { Image } from 'react-native';

<Image source={require('../../assets/icon.png')} style={{ width: 48, height: 48 }} />

<Image
  source={{ uri: 'https://picsum.photos/seed/fone/400/400' }}
  style={{ width: 120, height: 120, borderRadius: raio.md }}
  resizeMode="cover"
/>
```

:::center
![Comparação: a mesma foto deitada numa caixa quadrada; cover preenche e corta as sobras, contain mostra tudo com faixas vazias, stretch deforma e center não amplia](images/e12-resizemode.svg)
:::

`resizeMode`: `cover` (padrão) preenche a caixa e corta as sobras; `contain` mostra a foto inteira e pode sobrar faixa vazia; `stretch` estica e deforma; `center` centraliza sem ampliar.

---

## :icon[zap] expo-image: a imagem do Expo

O **`expo-image`** substitui a `Image` do React Native por uma versão mais rápida, com cache e um espaço reservado enquanto a foto baixa.

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

- **`placeholder`**: o que aparece enquanto baixa. O **blurhash** é um texto curto que desenha uma versão borrada de uma foto (gere o seu em blurha.sh)
- **`transition`**: a foto entra num esmaecimento de 300 milissegundos
- **Cache**: a foto baixada fica guardada no aparelho e, na próxima vez, aparece na hora, até sem internet. A prop `cachePolicy` muda esse comportamento

---

## :icon[shopping-cart] Exemplo: CartaoProduto

Em `src/components/CartaoProduto.js`, o cartão de wireframe do E10 ganha foto, preço formatado e botão de carrinho. `BLURHASH` é uma constante no topo do arquivo.

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

`formatarPreco(199.9)` devolve `R$ 199,90`. Ela mora em `src/utils/formatar.js`:

```javascript
export function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
```

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

---

## :icon[triangle-alert] Erros comuns

:::warning
- Imagem remota sem `width` e `height`: ela baixa, mas fica com tamanho zero e nada aparece
- `pressed` fora da função: `style={[estilos.botao, pressed && ...]}` quebra, porque `pressed` só existe dentro de `({ pressed }) => ...`
- Nome de ícone errado ou de outra família (`carrinho`, `shopping-cart`): aparece um ponto de interrogação e um aviso no terminal
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

Na aula 6, você dá identidade a ele:

- :icon[text] a fonte Inter carregada com `useFonts`, com a splash segurando a abertura
- :icon[layers] uma hierarquia tipográfica com os tokens de `fonte`
- :icon[smartphone] `StatusBar`, ícone e splash combinando com o tema
- :icon[flask-conical] no laboratório, `Botao`, `CartaoProduto` e `formatarPreco` de verdade
