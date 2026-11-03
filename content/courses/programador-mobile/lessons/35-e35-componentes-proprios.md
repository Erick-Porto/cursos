---
title: Componentes próprios
summary: "O seu primeiro componente no Projeto 6: o CartaoCasa, com foto da internet, ícones, toque com retorno e selo."
module: layout-rn
duration_minutes: 90
objectives:
  - Projetar um componente pelo que ele recebe e pelo que mostra, com props de dados e de ação
  - Mostrar uma foto da internet com Image e uri, com tamanho e uma imagem de reserva
  - Dar retorno visual ao toque com o pressed do Pressable e abrir um aviso com Alert.alert
  - Usar ícones do Ionicons e escolher a variante de uma peça do kit, como o tom do Badge
---

# Componentes próprios

Programador Mobile · Encontro E35 · Aula 35 de 45

---

## O que você vai aprender

:::goal
- Criar o seu primeiro componente do Projeto 6, o `CartaoCasa`
- Decidir o que uma peça recebe e o que ela mostra
- Mostrar ícones e fotos da internet no cartão
- Fazer o cartão responder ao dedo e abrir um aviso
- Escolher a variante de uma peça do kit, como a cor do selo
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **componente próprio** | uma peça que você escreve, num arquivo seu, e que as telas usam como as do kit |
| **prop de ação** | uma prop que leva uma função: o que fazer quando algo acontece, como um toque |
| **ícone** | um desenho pequeno que diz o que algo é, sem precisar ler |
| **imagem remota** | uma foto que mora na internet e chega por um endereço, a `uri` |
| **retorno visual** | a resposta da tela ao toque, na hora: o cartão muda enquanto o dedo aperta |
| **variante** | a mesma peça com outra aparência, escolhida por uma prop |

---

## O cartão ainda é rascunho

No fim do E34, a Início mostra os 12 cartões com tokens e tema. Mas cada cartão ainda é um rascunho:

::::columns
:::col
**Hoje**

```plaintext
[    ]  Lar da Mel
        Pinheiros, São Paulo
        ( 0 vagas )
```
:::
:::col
**No fim do dia**

```plaintext
[foto]  Lar da Mel
        (pino) Pinheiros, São Paulo
        (pata) Cães
        ( Lotada )
```
:::
::::

- No lugar da foto, uma caixa vazia; o selo diz "0 vagas", em cinza, numa casa lotada
- Tocar no cartão não faz nada
- O cartão mora dentro da Início, misturado com o topo e os números

:::question
Num app de delivery, como você sabe que tocou no restaurante certo, antes de a tela seguinte abrir?
:::

---

## Componente próprio

Chegou uma peça de Lego nova. O que você quer saber dela antes de encaixar?

---

## :icon[component] Projetar um componente: o que recebe e o que mostra

Um componente é uma peça de Lego (E24): pequena, reaproveitável, encaixa em outras. Hoje você cria o seu **componente próprio**, o `CartaoCasa`. Antes de escrever, responda duas perguntas:

| Pergunta | No `CartaoCasa` |
|---|---|
| O que a peça **recebe**? | `casa`, a ficha da casa; e `onPress`, o que fazer no toque |
| O que a peça **mostra**? | foto ou pata, nome, bairro e cidade, quem a casa aceita e o selo de vagas |

As respostas viram o **manual da peça**, o comentário no topo do arquivo, como nas peças do kit (E25):

```jsx
// CartaoCasa: o cartão de uma casa na lista.
// Props:
//   casa     o objeto da casa (nome, bairro, cidade, aceita, foto, capacidade, ocupacao...)
//   onPress  o que fazer quando tocam no cartão
```

---

## :icon[sliders-horizontal] Props de dados e de ação na prática

Props são o pedido feito à peça (E25): as de **dados** dizem o que mostrar; as de **ação** levam uma função, o que fazer quando algo acontece:

| Peça | Dados | Ação |
|---|---|---|
| `Badge` | `texto`, `tom` | nenhuma |
| `BotaoIcone` | `icone`, `rotulo` | `onPress` |
| `EstadoVazio` | `titulo`, `mensagem` | `onAcao` |
| `CartaoCasa`, o seu | `casa` | `onPress` |

O botão de tema do E34 usa os dois:

```jsx
<BotaoIcone icone="moon-outline" rotulo="Usar tema escuro" onPress={alternarTema} />
```

- A prop de ação é o botão do elevador do E26: **o filho avisa, o pai decide**
- No kit, as de ação começam com `on`, como no `Pressable`
- A `casa` vai inteira: o cartão escolhe o que mostrar

---

## :icon[milestone] Projeto 6 · Passo 1: o CartaoCasa nasce

Em `src/components/`, ao lado da pasta `ui`, crie o arquivo `CartaoCasa.js`, com o C e o C maiúsculos. No topo, o manual e os imports:

```jsx
// CartaoCasa: o cartão de uma casa na lista.
// Props:
//   casa     o objeto da casa (nome, bairro, cidade, aceita, foto, capacidade, ocupacao...)
//   onPress  o que fazer quando tocam no cartão
import { StyleSheet, Text, View } from 'react-native';
import { Badge, Cartao } from '@/components/ui';
import { espaco, fonte, raio, useTema } from '@/theme';
```

Logo abaixo, o cartão que estava no `map` da Início, agora numa peça:

```jsx
export default function CartaoCasa({ casa }) {
  const { cores } = useTema();
  return (
    <Cartao style={estilos.cartao}>
      <View style={[estilos.foto, { backgroundColor: cores.borda }]} />
      <View style={estilos.textos}>
        <Text style={[estilos.nome, { color: cores.texto }]}>{casa.nome}</Text>
        <Text style={[estilos.detalhe, { color: cores.textoSuave }]}>{casa.bairro}, {casa.cidade}</Text>
        <Badge texto={`${casa.capacidade - casa.ocupacao} vagas`} />
      </View>
    </Cartao>
  );
}
```

O manual já traz o `onPress`: ele diz o plano da peça inteira, e a prop chega no passo 4.

---

## :icon[milestone] Projeto 6 · Passo 1: a Início usa a peça

No fim do `CartaoCasa.js`, os estilos do cartão, que saem da Início:

```jsx
const estilos = StyleSheet.create({
  cartao: { flexDirection: 'row', alignItems: 'center', gap: espaco.md },
  foto: { width: 72, height: 72, borderRadius: raio.sm },
  textos: { flex: 1, gap: espaco.xs },
  nome: { fontSize: fonte.corpo, fontWeight: 'bold' },
  detalhe: { fontSize: fonte.pequena },
});
```

Na Início (`app/index.js`), o import da peça e um `map` curto:

```jsx
import CartaoCasa from '@/components/CartaoCasa';
```

```jsx
{casas.map((casa) => (
  <CartaoCasa key={casa.id} casa={casa} />
))}
```

Da Início saem os cinco estilos do cartão, o `Badge` do import de `@/components/ui` e o `raio` do import de `@/theme`: agora só o cartão usa.

**Pronto quando:** nada muda no celular. Os mesmos 12 cartões, agora desenhados pela sua peça.

---

## :icon[list-ordered] O passo 1 em português

| Linha | O que ela diz |
|---|---|
| `export default function CartaoCasa({ casa })` | "a peça `CartaoCasa` vai para a vitrine do arquivo e, da ficha das props, quer a `casa`" |
| `const { cores } = useTema();` | "leia o quadro de avisos do tema" (E34): toda peça pode ler, não só a tela |
| `{casa.nome}`, `{casa.bairro}` | os campos da ficha da casa, como antes, na Início |
| `import CartaoCasa from '@/components/CartaoCasa';` | sem chaves, porque o arquivo tem um `export default`; o `@` é a pasta `src/` (E33) |
| `<CartaoCasa key={casa.id} casa={casa} />` | "desenhe a peça com esta casa". A `key`, o crachá do E25, fica no `map` |

---

## Ícones

Como você acha a lupa num app, sem ler nenhuma palavra?

---

## :icon[shapes] Ícones com Ionicons

Um **ícone** é um desenho pequeno que diz o que algo é, como uma placa de trânsito: dá para entender sem ler. O pacote **`@expo/vector-icons`** já vem no kit e traz várias famílias de ícones. O kit usa a família **Ionicons**:

```jsx
import { Ionicons } from '@expo/vector-icons';

<Ionicons name="paw" size={32} color={cores.textoSuave} />
```

| Prop | O que ela diz |
|---|---|
| `name` | o nome do ícone, em inglês, letra por letra: `paw` é a pata |
| `size` | o tamanho, como o `fontSize` |
| `color` | a cor; sempre uma cor do tema, para o ícone acompanhar o claro e o escuro |

Os nomes estão no site **icons.expo.fyi**: filtre por Ionicons e busque em inglês ("paw", "location", "search"). Muitos ícones têm duas versões: cheia (`paw`) e de contorno (`paw-outline`).

---

## :icon[shapes] Ícones na prática

**Caso 1: o kit já usava.** O botão de tema do E34 recebe o nome de um ícone, `icone={escuro ? 'sunny-outline' : 'moon-outline'}`. Por dentro, o `BotaoIcone` desenha um `Ionicons` com esse nome.

**Caso 2: um ícone ao lado de um texto.** Numa linha, a `flexDirection: 'row'` do E33, o pino e o texto ficam lado a lado:

```jsx
<View style={estilos.linha}>
  <Ionicons name="location-outline" size={16} color={cores.textoSuave} />
  <Text style={[estilos.detalhe, { color: cores.textoSuave }]}>Pinheiros, São Paulo</Text>
</View>
```

**Caso 3: nome errado.** `name="pata"` não existe. O app não quebra: no lugar do desenho aparece um `?`, e o terminal avisa `"pata" is not a valid icon name for family "ionicons"`.

---

## Imagem da internet

Você compraria um sofá pela internet sem medir a sala antes?

---

## :icon[image] Image com endereço: a foto da internet

No E30, a gota era uma imagem local, que mora no projeto. A foto das casas é uma **imagem remota**: mora na internet e chega por um endereço, a **`uri`**.

```jsx
<Image source={{ uri: 'https://picsum.photos/id/237/600/400' }} style={estilos.foto} />
```

| Parte | O que ela diz |
|---|---|
| `source={{ ... }}` | as chaves de fora são as do JSX (E24); as de dentro fazem uma ficha |
| `uri: '...'` | o campo da ficha com o endereço da foto |
| `style={estilos.foto}` | o tamanho, com `width` e `height`: **obrigatório** |

É o sofá comprado pela internet: você mede o espaço antes de ele chegar. Sem `width` e `height`, a foto fica com tamanho zero, e nada aparece, sem mensagem.

---

## :icon[image] Imagens na prática

**Caso 1: a foto do cartão, 72 por 72.** No endereço do picsum, os dois últimos números são a largura e a altura: a foto da Lar da Mel é deitada, 600 por 400. No quadrado, ela preenche o espaço e corta as sobras dos lados: é o jeito padrão da `Image`.

```jsx
foto: { width: 72, height: 72, borderRadius: raio.sm },
```

**Caso 2: a foto redonda.** Com o `borderRadius` na metade do lado, o quadrado vira círculo, como a foto de perfil de um contato:

```jsx
perfil: { width: 48, height: 48, borderRadius: 24 },
```

**Caso 3: sem internet.** O endereço não responde, e a foto fica vazia, do tamanho pedido. Nada quebra. No E37, a mesma `Image` aparece grande, no Detalhe da casa.

---

## :icon[arrow-left-right] Foto ou pata: a imagem de reserva

Quatro casas não têm foto: no `casas.js`, elas têm `foto: ''`, um texto vazio. Para elas, o cartão mostra uma **imagem de reserva**, a pata numa caixa, como o contato sem foto no celular, que mostra as iniciais. Quem escolhe é o ternário do E10, a placa aberto ou fechado:

```jsx
{casa.foto ? (
  <Image source={{ uri: casa.foto }} style={estilos.foto} />
) : (
  <View style={[estilos.foto, estilos.semFoto, { backgroundColor: cores.borda }]}>
    <Ionicons name="paw" size={32} color={cores.textoSuave} />
  </View>
)}
```

| Casa | `casa.foto` | Conta como | Na tela |
|---|---|---|---|
| Lar da Mel | `'https://picsum.photos/id/237/600/400'` | sim | a `Image` |
| ONG Amigo Fiel | `''` | não | a caixa com a pata |

O texto vazio conta como "não", como o `undefined` no `if` da aula 3. Os parênteses guardam o JSX de várias linhas de cada lado do `:`.

---

## :icon[milestone] Projeto 6 · Passo 2: a foto e a pata

No topo do `CartaoCasa.js`, a `Image` entra no import de `react-native`, e o `Ionicons` chega num import novo:

```jsx
import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
```

No lugar da caixa da foto, a linha `<View style={[estilos.foto, { backgroundColor: cores.borda }]} />`, o ternário:

```jsx
{casa.foto ? (
  <Image source={{ uri: casa.foto }} style={estilos.foto} />
) : (
  <View style={[estilos.foto, estilos.semFoto, { backgroundColor: cores.borda }]}>
    <Ionicons name="paw" size={32} color={cores.textoSuave} />
  </View>
)}
```

Nos estilos, um novo, que põe a pata no meio da caixa: `semFoto: { alignItems: 'center', justifyContent: 'center' },`

**Pronto quando:** 8 cartões com foto, que chegam da internet uma a uma, e 4 com a pata: ONG Amigo Fiel, Gatil Sete Vidas, Lar Temporário Ronrom e Cantinho dos Bichanos.

---

## :icon[milestone] Projeto 6 · Passo 3: os ícones das linhas

No lugar do `Text` de bairro e cidade, duas linhas, cada uma com um ícone e um texto. A segunda é nova e mostra `casa.aceita`: Cães, Gatos ou Cães e gatos.

```jsx
<View style={estilos.linha}>
  <Ionicons name="location-outline" size={16} color={cores.textoSuave} />
  <Text style={[estilos.detalhe, { color: cores.textoSuave }]}>
    {casa.bairro}, {casa.cidade}
  </Text>
</View>
<View style={estilos.linha}>
  <Ionicons name="paw-outline" size={16} color={cores.textoSuave} />
  <Text style={[estilos.detalhe, { color: cores.textoSuave }]}>{casa.aceita}</Text>
</View>
```

Nos estilos, a `linha` é nova, e o `detalhe` ganha `flex: 1`, para um texto comprido quebrar sem empurrar o ícone:

```jsx
linha: { flexDirection: 'row', alignItems: 'center', gap: espaco.xs },
detalhe: { flex: 1, fontSize: fonte.pequena },
```

**Pronto quando:** um pino antes de "Pinheiros, São Paulo" e uma pata antes de "Cães", nos 12 cartões.

---

## Retorno ao toque

O botão do elevador acende na hora em que você aperta. Para que serve essa luz?

---

## :icon[mouse-pointer-click] pressed: o estilo enquanto o dedo aperta

O botão do elevador do E26 **acende na hora** do toque: você sabe que deu certo e não aperta de novo. É o **retorno visual**. O `Pressable` do E30 sabe se o dedo está nele; para usar isso, o `style` vira uma **função**:

```jsx
<Pressable onPress={onPress} style={({ pressed }) => (pressed ? estilos.apertado : null)}>
```

| Momento | `pressed` | O estilo e a tela |
|---|---|---|
| o dedo encosta | `true` | `estilos.apertado`: translúcido |
| o dedo solta | `false` | `null`, nada a mais: normal, e o `onPress` é chamado |

- `({ pressed })`: das chaves da ficha que o `Pressable` entrega, o campo `pressed`
- `apertado: { opacity: 0.6 }`: a **`opacity`** vai de 1 (inteiro) a 0 (invisível)

---

## :icon[message-square] Alert: um aviso na tela

O retorno visual diz "recebi o toque". Para dar um recado, o React Native tem o **`Alert`**: uma caixa no meio da tela, por cima do app, com título, mensagem e o botão OK. É o tipo de aviso que o celular mostra quando a bateria está fraca.

```jsx
import { Alert } from 'react-native';

Alert.alert('Lar da Mel', 'Visitas: Sábados, das 9h às 13h');
```

| Parte | O que ela diz |
|---|---|
| `Alert.alert(...)` | "do `Alert`, chame a função `alert`", como o `JSON.parse` da aula 3 |
| o primeiro texto | o título, em negrito, no alto da caixa |
| o segundo texto | a mensagem, logo abaixo |

O botão OK vem sozinho e fecha o aviso. No navegador (o `w` do `npx expo start`), o `Alert` não aparece: confira no celular.

---

## :icon[mouse-pointer-click] Toque e aviso na prática

**Caso 1: as peças do kit já respondem.** Segure o botão de tema: ele fica mais transparente enquanto o dedo está em cima. O `Botao` e o `BotaoIcone` usam o `pressed` por dentro.

**Caso 2: a tela decide o que o toque faz.** O cartão só avisa. Hoje, a Início abre um aviso, com a template string do E06:

```jsx
onPress={() => Alert.alert(casa.nome, `Visitas: ${casa.visitas}`)}
```

No E37, a mesma prop abre o Detalhe da casa, sem mudar o cartão.

**Caso 3: sem a seta.** `onPress={Alert.alert(casa.nome, ...)}` chama o aviso na hora de desenhar a tela: um aviso por casa, 12 ao todo, antes de qualquer toque. É o "sem a seta" do E30: a seta `() =>` guarda o aviso para a hora do toque.

---

## :icon[milestone] Projeto 6 · Passo 4: o cartão sente o toque

No `CartaoCasa.js`, o `Pressable` entra no import, e a função recebe a segunda prop, a de ação:

```jsx
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
```

```jsx
export default function CartaoCasa({ casa, onPress }) {
```

O `Pressable` abraça o `Cartao` inteiro, no `return`:

```jsx
return (
  <Pressable onPress={onPress} style={({ pressed }) => (pressed ? estilos.apertado : null)}>
    <Cartao style={estilos.cartao}>
      {/* foto, textos e selo, como antes */}
    </Cartao>
  </Pressable>
);
```

O `{/* ... */}` é um comentário dentro do JSX: ele marca o que já estava lá, e nada de dentro do `Cartao` sai. Nos estilos, mais um: `apertado: { opacity: 0.6 },`

O `onPress={onPress}` vai sem parênteses, como o `aoClicar` do E26: o `Pressable` chama, na hora do toque, a função que veio da tela.

---

## :icon[milestone] Projeto 6 · Passo 4: a Início decide o toque

Na Início, o `Alert` entra no import de `react-native`, e cada cartão recebe o que fazer no toque:

```jsx
import { Alert, StyleSheet, Text, View } from 'react-native';
```

```jsx
{casas.map((casa) => (
  <CartaoCasa
    key={casa.id}
    casa={casa}
    onPress={() => Alert.alert(casa.nome, `Visitas: ${casa.visitas}`)}
  />
))}
```

O cartão não decide o que o toque faz: quem decide é a tela. A peça fica igual em qualquer lugar onde for usada.

**Pronto quando:** o cartão fica mais transparente enquanto o dedo aperta; ao soltar, abre o aviso "Lar da Mel", com "Visitas: Sábados, das 9h às 13h", e o OK fecha. Cada cartão mostra o horário da sua casa.

---

## Variantes

A mesma camiseta, em quatro cores: é um modelo só ou são quatro?

---

## :icon[layers] Variante: a mesma peça, outra aparência

Uma **variante** é a mesma peça com outra aparência, escolhida por uma prop. É o mesmo modelo de camiseta em cores diferentes: o molde é um só, e você escolhe a cor pelo nome. No kit, o `Badge` tem a prop **`tom`**, com quatro variantes. Por dentro, um mapa liga cada tom a uma cor do tema:

```jsx
// cada tom aponta para uma cor do tema
const corDoTom = {
  neutro: 'textoSuave',
  sucesso: 'sucesso',
  alerta: 'alerta',
  perigo: 'perigo',
};

// e, dentro do Badge, a cor do fundo do selo:
const fundo = cores[corDoTom[tom]] ?? cores.textoSuave;
```

- `corDoTom[tom]`: os colchetes do E13 leem o campo cujo nome está na caixa `tom`
- `cores[...]`: a cor com esse papel, no tema da vez; o `??` do E17 deixa um tom desconhecido em cinza
- O nome diz o **papel**, não a cor: `perigo`, e não `vermelho`. No tema escuro, o vermelho é outro, e o nome continua certo

---

## :icon[layers] Variantes na prática

**Caso 1: os quatro tons do `Badge`.**

| A tag | Na tela, no tema claro |
|---|---|
| `<Badge texto="5 vagas" />` | cinza: sem `tom`, vale o padrão, `neutro` |
| `<Badge texto="8 vagas" tom="sucesso" />` | verde |
| `<Badge texto="Última vaga" tom="alerta" />` | laranja |
| `<Badge texto="Lotada" tom="perigo" />` | vermelho |

**Caso 2: o `Botao` tem `variante`.** São três: `primaria` (cheio, o padrão), `secundaria` (só o contorno) e `perigo` (contorno vermelho). O "Limpar busca" do E36 é `secundaria`.

**Caso 3: o `CartaoCasa` não tem variante.** Todo cartão de casa tem a mesma cara; o que muda é a casa, um dado. Quem muda de cor é o selo: o cartão escolhe o tom e pede ao `Badge`.

---

## :icon[list-ordered] Escolher o tom com else if

Quem escolhe o tom é uma regra: o `else if` do E10, a estrada com várias saídas. As perguntas vão de cima para baixo, e vale a primeira que dá `true`. Um exemplo com a bateria do celular:

```javascript
const carga = 15;

let aviso = 'Bateria boa';
let tom = 'sucesso';
if (carga <= 5) {
  aviso = 'Carregue agora';
  tom = 'perigo';
} else if (carga <= 20) {
  aviso = 'Bateria fraca';
  tom = 'alerta';
}

console.log(aviso, tom);   // Bateria fraca alerta
```

| `carga` | `carga <= 5`? | `carga <= 20`? | `aviso` e `tom` |
|---|---|---|---|
| 3 | `true` | nem pergunta | Carregue agora, `perigo` |
| 15 | `false` | `true` | Bateria fraca, `alerta` |
| 80 | `false` | `false` | Bateria boa, `sucesso`: os valores do começo |

As duas caixas `let` começam com o caso mais comum, e cada saída troca as duas. No app, elas vão para o selo: `<Badge texto={aviso} tom={tom} />`.

---

## :icon[milestone] Projeto 6 · Sua vez: o selo de vagas

Agora, sozinho: no `CartaoCasa`, o selo segue a tabela.

| Vagas livres | Texto do selo | Tom |
|---|---|---|
| 0 | Lotada | `perigo` |
| 1 | Última vaga | `alerta` |
| 2 ou 3 | Últimas 2 vagas, Últimas 3 vagas | `alerta` |
| 4 ou mais | 8 vagas, 12 vagas | `sucesso` |

:::tip Dicas
- Vagas livres: `casa.capacidade - casa.ocupacao`, numa `const` antes do `return`
- `let selo` e `let tom` começam com o "4 ou mais"; `if` e `else if` trocam
- No `Badge`: `texto={selo}` e `tom={tom}`
:::

**Pronto quando:** 2 "Lotada" em vermelho; Casa da Pipoca, Abrigo Focinho Feliz e Casa do Bigode em laranja; 7 em verde.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Element type is invalid` | import com chaves, ou sem `export default` | `import CartaoCasa from ...`, sem chaves |
| `Unable to resolve` | outra pasta ou grafia (`Cartaocasa.js`) | conferir pasta e maiúsculas |
| `is not a valid icon name` | o ícone não existe | copiar o nome do icons.expo.fyi |
| `Property 'Alert' doesn't exist` | faltou no import | `Alert` no import de `react-native` |
| (sem mensagem) "NaN vagas" | `function CartaoCasa(casa)`, sem chaves | `function CartaoCasa({ casa, onPress })` |
| (sem mensagem) foto sumida | sem `width` e `height`, ou sem rede | as duas medidas; a internet |

---

## :icon[milestone] Projeto 6 · Etapa 3 pronta

- `src/components/CartaoCasa.js` com o manual no topo e as props `casa` e `onPress`
- Foto ou pata; o pino com bairro e cidade; a pata com quem a casa aceita
- O selo da tabela: 2 Lotada, 1 Última vaga, 1 Últimas 2 vagas, 1 Últimas 3 vagas e 7 em verde
- O cartão fica mais transparente no toque e abre o aviso com o horário de visitas
- A Início sem os estilos do cartão: ela só entrega a casa e o que fazer no toque
- Tudo legível nos dois temas

```bash
git add .
git commit -m "Projeto 6: etapa 3, CartaoCasa"
git push
```

O que faltar, termine em casa, com o enunciado do projeto: o E36 começa com o cartão pronto.

---

## Resumo

:::summary
- Projetar uma peça é decidir o que ela recebe e o que mostra; o manual no topo do arquivo registra isso
- Props de dados dizem o que mostrar (`casa`); props de ação levam uma função (`onPress`), e quem decide o toque é a tela
- `Ionicons` desenha um ícone com `name`, `size` e uma `color` do tema; os nomes estão em icons.expo.fyi
- A `Image` remota usa `source={{ uri }}`, com `width` e `height`; sem foto, o ternário mostra a reserva
- O `style` do `Pressable` como função de `pressed` dá o retorno visual; `Alert.alert(titulo, mensagem)` abre um aviso
- Variante é a mesma peça com outra aparência, escolhida por uma prop: o `tom` do `Badge`, a `variante` do `Botao`
:::

---

## :icon[arrow-right] Próximos passos

No E36, a Início vira uma lista de verdade, e o seu `CartaoCasa` entra nela sem mudar nada:

- :icon[list] a `FlatList` a fundo, a esteira do E31, no lugar do `map`
- :icon[search] a busca por nome, bairro e cidade, com o `Campo` do kit
- :icon[square] o aviso de lista vazia, com o botão Limpar busca
- :icon[refresh-cw] puxar a lista para baixo para atualizar
