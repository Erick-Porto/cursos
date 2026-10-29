---
title: Fontes e identidade visual
summary: Carregue a Inter com expo-font, segure a splash e alinhe StatusBar, ícone e splash à identidade do app.
module: layout-rn
duration_minutes: 40
objectives:
  - Carregar a fonte Inter com useFonts e segurar a splash até o carregamento
  - Aplicar uma hierarquia tipográfica com os tokens de fonte
  - Ajustar StatusBar, ícone e splash à identidade do app
---

# Fontes e identidade visual

Programador Mobile · Encontro E32 · Aula 63 de 89

---

## O que você vai aprender

:::goal
- Organizar a ordem de leitura de uma tela com os tokens de `fonte`
- Carregar a fonte Inter com `useFonts` e segurar a splash até ela ficar pronta
- Guardar a `fontFamily` nos tokens e trocar a `StatusBar` junto com o tema
- Configurar ícone e splash no `app.json`
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **identidade visual** | o jeito de o app se apresentar: fonte, cor, ícone e abertura |
| **hierarquia tipográfica** | a ordem em que o olho lê os textos, decidida pelo tamanho e pelo peso da letra |
| **família e peso** | a família é o desenho da letra (Inter, Roboto); o peso, a grossura (regular, negrito) |
| **splash** | a tela de abertura, que aparece enquanto o app carrega |
| **barra de status** | a faixa do topo do celular, com o relógio e a bateria |
| **ícone adaptativo** | o ícone do Android, que cada fabricante recorta num formato |

---

## Todo app parece o mesmo app

Abra o Lojinha agora: fonte padrão do sistema, ícone do Expo na tela inicial, splash branca. Ele funciona, mas poderia ser qualquer loja.

Agora pense no app do seu banco. Você o reconhece pelo ícone entre dezenas de outros, pela cor que aparece na abertura e pelo desenho dos números do saldo, antes de ler qualquer nome.

Isso é **identidade visual**. No React Native, ela também é código.

:::question
O que faz você reconhecer um app sem ler o nome dele?
:::

---

## Identidade visual

Como você sabe de que time é um jogador, de longe, sem ler o nome na camisa?

---

## :icon[sparkles] Os quatro elementos da identidade

**Identidade visual** é o jeito de o app se apresentar. Pense no uniforme de um time: a cor, o escudo e a letra do número dizem juntos de que time é o jogador.

| Elemento | Onde o usuário vê | No Lojinha |
|---|---|---|
| Fonte | em todo texto | Inter, em dois pesos |
| Cor primária | botões, preços, ícones | `cores.primaria`, do E31 |
| Ícone | tela inicial | `assets/icon.png` |
| Splash | a abertura do app | logo sobre a primária |

Os quatro contam a mesma história. Um ícone azul que abre numa splash laranja e mostra botões verdes parece três apps diferentes.

A cor veio no E31; hoje entram fonte, ícone e splash.

---

## Hierarquia tipográfica

Na capa do jornal, o que você lê primeiro? E por quê?

---

## :icon[layers] Hierarquia tipográfica

Na capa de um jornal, você lê primeiro a manchete grande e só depois o texto miúdo. **Hierarquia tipográfica** é decidir essa ordem de leitura com tamanho e peso. Os tokens `fonte` do E31 já são os níveis:

| Nível | Token | Peso | No Lojinha |
|---|---|---|---|
| Destaque | `fonte.destaque` (28) | negrito | preço na tela do produto |
| Título | `fonte.titulo` (20) | negrito | "Destaques", nome na tela do produto |
| Corpo | `fonte.corpo` (16) | regular | descrição, nome no cartão |
| Pequena | `fonte.pequena` (12) | regular | categoria, avaliação |

Para o que é secundário, use também a cor `cores.textoSuave`. Quatro níveis são suficientes: com mais, ninguém percebe a diferença entre eles.

---

## :icon[layers] Hierarquia na prática

Três textos da Início, três níveis:

**1. O título "Destaques":** tamanho de título, em negrito. Ele abre a seção.

```jsx
<Text style={{ fontSize: fonte.titulo, fontWeight: 'bold', color: cores.texto }}>Destaques</Text>
```

**2. O preço no cartão:** também grande e em negrito, na cor primária, para saltar aos olhos.

```jsx
<Text style={{ fontSize: fonte.titulo, fontWeight: 'bold', color: cores.primaria }}>R$ 199,90</Text>
```

**3. O nome no cartão:** tamanho de corpo, regular. É lido depois do preço.

```jsx
<Text style={{ fontSize: fonte.corpo, color: cores.texto }}>Fone Bluetooth</Text>
```

Na tela: o olho vai do título ao preço e só depois ao nome.

---

## Pratique

:::example Desafio (3 minutos)
A tela do produto tem quatro textos: "Fone Bluetooth", "R$ 199,90", "Fone sem fio com 20 horas de bateria." e "Áudio · 4,6".

Para cada um, escolha o token de tamanho, o peso e a cor do tema.
:::

:::tip Resposta
- "R$ 199,90": `fonte.destaque`, negrito, `cores.primaria`. É o que decide a compra
- "Fone Bluetooth": `fonte.titulo`, negrito, `cores.texto`
- Descrição: `fonte.corpo`, regular, `cores.texto`
- "Áudio · 4,6": `fonte.pequena`, regular, `cores.textoSuave`

Outras escolhas funcionam. O erro é deixar tudo em 16 e regular: o olho não sabe por onde começar.
:::

---

## Fonte própria

Você reconhece a letra de mão de alguém da sua família?

---

## :icon[text] Uma fonte com a cara do app

A **fonte** é o desenho das letras, como a letra de mão de cada pessoa. Sem `fontFamily`, o app escreve com a letra do celular: **Roboto** no Android e **San Francisco** no iPhone. O mesmo Lojinha muda de cara em cada aparelho.

Com uma fonte própria, o texto fica igual nos dois. A **Inter** é gratuita, legível em letra pequena e tem números bem desenhados.

:::tip No máximo 2 famílias
Uma família em dois pesos já resolve um app inteiro. Se quiser contraste, use uma segunda família só nos títulos, nunca uma terceira. Cada peso é mais um arquivo que o app carrega antes de abrir, e cada família a mais deixa a tela com cara de colagem.
:::

---

## :icon[package] Instalando a Inter

```bash
npx expo install expo-font @expo-google-fonts/inter expo-splash-screen
```

| Pacote | Para que serve |
|---|---|
| `expo-font` | carrega arquivos de fonte no app |
| `@expo-google-fonts/inter` | os arquivos da Inter e o hook `useFonts` pronto |
| `expo-splash-screen` | controla quando a tela de abertura some |

Cada peso vem como uma constante com família, peso e estilo no nome: `Inter_400Regular` e `Inter_700Bold`. O número é o peso: 400 é o regular e 700, o negrito.

Importe só os pesos que você usa. O Lojinha usa dois.

---

## :icon[text] Fontes próprias na prática

Toda família do Google Fonts tem um pacote `@expo-google-fonts/` com o mesmo jeito de usar. Muda o nome:

| Família | Pacote | Pesos regular e negrito |
|---|---|---|
| Inter, no Lojinha | `@expo-google-fonts/inter` | `Inter_400Regular`, `Inter_700Bold` |
| Nunito, mais arredondada | `@expo-google-fonts/nunito` | `Nunito_400Regular`, `Nunito_700Bold` |
| Poppins, mais geométrica | `@expo-google-fonts/poppins` | `Poppins_400Regular`, `Poppins_700Bold` |

```bash
npx expo install expo-font @expo-google-fonts/nunito expo-splash-screen
```

No Projeto 6, você pode escolher outra família, sempre em dois pesos. O nome que vai no `fontFamily` é a constante inteira: `'Nunito_700Bold'`, e não `'Nunito'`.

---

## Carregar a fonte

O que a senha da lanchonete garante enquanto o lanche não fica pronto?

---

## :icon[hourglass] useFonts: carregar antes de desenhar

Antes de escrever com a Inter, o app precisa carregar os arquivos dela, e isso leva um instante. O **`useFonts`** é o hook que carrega e avisa o resultado, como a senha da lanchonete (E18): o pedido vai ficar pronto ou vai dar erro. Até lá, o app espera.

```jsx
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';

export default function App() {
  const [fontesCarregadas, erroFonte] = useFonts({ Inter_400Regular, Inter_700Bold });

  if (!fontesCarregadas && !erroFonte) return null;

  return (
    <TemaProvider>
      <Inicio />
    </TemaProvider>
  );
}
```

Na tela: nada aparece por um instante; depois, o app abre já com a Inter.

---

## :icon[list-ordered] O useFonts em português

| Linha | O que ela diz |
|---|---|
| `useFonts({ Inter_400Regular, Inter_700Bold })` | "carregue estas duas fontes" |
| `{ Inter_700Bold }` | o atalho do E08 para `{ Inter_700Bold: Inter_700Bold }`: cada **chave** vira o nome para o `fontFamily`, aqui `'Inter_700Bold'` |
| `[fontesCarregadas, erroFonte]` | o par que o `useFonts` devolve, como o `useState`: se carregou e se deu erro, por posição (E09) |
| `if (!fontesCarregadas && !erroFonte) return null` | "nem carregou nem deu erro? Não desenhe nada ainda" |

Sem o `return null`, o texto nasce na fonte do sistema e "pula" para a Inter. Se der erro, o app abre com a fonte do sistema em vez de travar.

---

## :icon[smartphone] A splash segura a abertura

`return null` deixa a tela em branco por um instante. Melhor manter a **splash**, a tela de abertura, até a fonte ficar pronta. Ela funciona como a cortina do teatro: fica fechada até o palco estar pronto.

```jsx
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync(); // fora do componente, no topo do arquivo

export default function App() {
  const [fontesCarregadas, erroFonte] = useFonts({ Inter_400Regular, Inter_700Bold });

  useEffect(() => {
    if (fontesCarregadas || erroFonte) SplashScreen.hideAsync();
  }, [fontesCarregadas, erroFonte]);

  if (!fontesCarregadas && !erroFonte) return null;
  // o return com o TemaProvider continua igual
```

---

## :icon[smartphone] A splash em português

::::columns
:::col
![Animação: preventAutoHideAsync segura a splash roxa, useFonts carrega a Inter com return null e, pronta ou com erro, hideAsync esconde a splash e o app abre na Inter](images/e32-splash-fontes.svg)
:::
:::col
- `preventAutoHideAsync()` avisa: "não abra a cortina sozinho"
- O `useEffect` roda depois de desenhar, e de novo quando um dos dois valores muda
- `hideAsync()` abre a cortina quando a fonte carregou **ou** falhou
- O `Async` no nome indica uma Promise (E18); ninguém precisa do resultado, por isso não há `await`
- Na tela: a splash fica até a Inter estar pronta, e o app já abre com a letra certa
:::
::::

---

## :icon[hourglass] Carregar a fonte na prática

O `useFonts` passa por três situações. Em cada uma, o `App.js` faz uma coisa:

| `fontesCarregadas` | `erroFonte` | O que acontece | O usuário vê |
|---|---|---|---|
| `false` | `null` | ainda carregando: `return null` | a splash |
| `true` | `null` | carregou: `hideAsync()` | o app, já na Inter |
| `false` | um erro | falhou: `hideAsync()` também | o app, na fonte do sistema |

Por isso as duas condições testam os dois valores:

```jsx
if (fontesCarregadas || erroFonte) SplashScreen.hideAsync();
if (!fontesCarregadas && !erroFonte) return null;
```

Sem o `erroFonte`, a terceira linha da tabela vira splash para sempre.

---

## Fonte nos tokens

Na loja de tintas, por que cada cor tem um nome no pote?

---

## :icon[sliders-horizontal] fontFamily nos tokens

Escrever `'Inter_700Bold'` em cada estilo é pedir um erro de digitação. Os tokens do E31 são a paleta de tintas com nome: o valor mora num lugar só. Guarde os nomes das fontes ali, em `tokens.js`, ao lado de `fonte`:

```javascript
// src/theme/tokens.js (acrescente)
export const familia = {
  regular: 'Inter_400Regular',
  negrito: 'Inter_700Bold',
};
```

```jsx
import { familia, fonte } from '../theme/tokens';

nome: { fontFamily: familia.regular, fontSize: fonte.corpo },
preco: { fontFamily: familia.negrito, fontSize: fonte.titulo }, // era fontWeight: 'bold'
```

A fonte não muda com o tema, então `familia` entra direto no `StyleSheet`, como `espaco` e `fonte`.

:::warning
Com fonte própria, troque `fontWeight: 'bold'` por `familia.negrito`. Sobre a Inter regular, `fontWeight` é ignorado em alguns aparelhos e vira um negrito falso, desenhado pelo sistema, em outros.
:::

---

## :icon[sliders-horizontal] familia na prática

Com `familia` e `fonte` importados de `tokens.js`, cada texto escolhe a família e o tamanho pelo nome:

**1. O título de uma seção da Início:**

```jsx
secao: { fontFamily: familia.negrito, fontSize: fonte.titulo },
```

**2. A descrição do produto:**

```jsx
descricao: { fontFamily: familia.regular, fontSize: fonte.corpo },
```

**3. O texto do `Botao`:**

```jsx
texto: { fontFamily: familia.negrito, fontSize: fonte.corpo },
```

Na tela: os três em Inter, cada um no peso certo. Para trocar a Inter por outra fonte, você muda o `useFonts` e o `tokens.js`; os estilos continuam iguais.

---

## Barra de status

E se o relógio do celular ficasse preto sobre um fundo preto?

---

## :icon[sun] StatusBar combinando com o tema

A **barra de status** é a faixa do topo do celular, com o relógio e a bateria. Ela também faz parte da identidade: ícones sem contraste parecem defeito. Você a ligou ao tema no E31; confira se ficou assim.

```jsx
import { StatusBar } from 'expo-status-bar';

export default function Inicio() {
  const { cores, escuro } = useTema();
  return (
    <SafeAreaView style={[estilos.tela, { backgroundColor: cores.fundo }]}>
      <StatusBar style={escuro ? 'light' : 'dark'} />
      {/* resto da tela */}
    </SafeAreaView>
  );
}
```

- `'dark'`: ícones escuros, para fundo claro; `'light'`: ícones claros, para fundo escuro
- `'auto'` segue o tema do **sistema**, não o botão de tema do Lojinha. Celular claro com o app no escuro: o relógio some
- A `StatusBar` fica na tela, e não no `App.js`, porque `useTema()` só funciona dentro do `TemaProvider`

---

## :icon[sun] StatusBar na prática

O `style` depende da cor que fica atrás da barra:

**1. Fundo claro:** ícones escuros.

```jsx
<StatusBar style="dark" />
```

**2. Fundo escuro:** ícones claros.

```jsx
<StatusBar style="light" />
```

**3. O Lojinha, com o botão de tema:** o ternário escolhe pelo tema do **app**, e não pelo do sistema.

```jsx
<StatusBar style={escuro ? 'light' : 'dark'} />
```

Na tela: com o celular no claro, troque o tema pelo botão do Lojinha. O relógio e a bateria continuam visíveis nos dois temas.

---

## Ícone e splash

O que acontece com o desenho que encosta na borda do cortador de biscoito?

---

## :icon[smartphone] Ícone do app no app.json

O **ícone** é a figura do app na tela inicial do celular. Ele e a splash ficam no `app.json`, o arquivo de configuração do Expo:

```json
{
  "expo": {
    "name": "Lojinha",
    "icon": "./assets/icon.png",
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#6d28d9"
      }
    }
  }
}
```

- `name`: o nome embaixo do ícone na tela inicial
- `icon`: PNG quadrado de 1024 por 1024, usado no iPhone e como reserva
- `android.adaptiveIcon`: o ícone do Android, em duas camadas. `foregroundImage` é o desenho, com margem folgada para não ser cortado; `backgroundColor` preenche o fundo

Edite só essas chaves e deixe as outras como estão. O fundo `#6d28d9` é a `primaria` do tema claro.

---

## :icon[smartphone] Ícone adaptativo: o recorte

:::center
![Diagrama: o fundo roxo do backgroundColor e o logo do foregroundImage formam um quadrado; cada fabricante recorta em círculo, quadrado arredondado ou gota, e o logo no centro aparece inteiro nos três](images/e32-icone-adaptativo.svg)
:::

Cada fabricante de Android usa um cortador de biscoito diferente: círculo, quadrado arredondado, gota. O Android junta as duas camadas do `adaptiveIcon` e aplica o formato do aparelho.

Deixe o desenho do `foregroundImage` na área central, dentro do círculo tracejado: o que passa dela pode ser cortado em algum recorte.

---

## :icon[smartphone] Splash no app.json

```json
"splash": {
  "image": "./assets/splash-icon.png",
  "resizeMode": "contain",
  "backgroundColor": "#6d28d9"
}
```

- `image`: o logo no centro, não um desenho da tela inteira
- `resizeMode: "contain"`: o logo aparece inteiro em qualquer tamanho de tela
- `backgroundColor`: a cor que preenche o resto, a mesma do fundo do ícone

:::warning O Expo Go não mostra tudo
O Expo Go exibe o próprio ícone e pode não exibir a sua splash. Ícone e splash de verdade aparecem quando você gera um build do app, mais adiante no curso. Hoje, confira os caminhos dos arquivos e se o `app.json` continua um JSON válido.
:::

---

## O Botao

Toque, ícone e fonte: quantas vezes você quer escrever tudo isso, botão por botão?

---

## :icon[component] O Botao do Lojinha

O **`Botao`** é a peça de Lego que junta o toque, o ícone e a fonte de hoje. No laboratório, ele vira um componente em `src/components/ui/Botao.js`, usado assim:

```jsx
<Botao titulo="Ver carrinho" icone="cart-outline" onPress={abrirCarrinho} />
<Botao titulo="Continuar comprando" variante="secundaria" onPress={voltar} />
<Botao titulo="Finalizar compra" desabilitado />
```

| Prop | O que faz | Padrão |
|---|---|---|
| `titulo` | texto do botão | obrigatória |
| `onPress` | função chamada no toque | nenhuma |
| `variante` | `'primaria'`: fundo cheio; `'secundaria'`: só a borda | `'primaria'` |
| `icone` | nome de um Ionicons, à esquerda do texto | sem ícone |
| `desabilitado` | não responde e fica esmaecido | `false` |

Por dentro: `Pressable` com `({ pressed })`, `android_ripple`, `minHeight: 44` e `familia.negrito` no texto. No E33, ele ganha tamanhos e a variante `fantasma`.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Unrecognized font family` (iPhone) | o `fontFamily` não é uma chave do `useFonts` (no Android, a letra volta à Roboto sem aviso) | usar `familia.regular` ou `familia.negrito` |
| a splash não some | o `hideAsync()` não roda: faltou, ou só testa `fontesCarregadas` | testar `fontesCarregadas` **ou** `erroFonte` no `useEffect` |
| não consegue ler `cores` de `null` | `useTema()` fora do `TemaProvider`, como no `App.js` | levar o código para a tela |
| `Unable to resolve` com o nome de um pacote | o pacote não foi instalado neste projeto | `npx expo install` e o nome; depois, `npx expo start -c` |

---

## :icon[triangle-alert] Erros comuns

:::warning
- `fontWeight: 'bold'` sobre `familia.regular`: negrito falso ou ignorado. Use `familia.negrito`
- `<StatusBar style="auto" />` com tema manual: relógio escuro sobre fundo escuro
- Trocar o `icon` e procurá-lo no Expo Go: ele mostra o próprio ícone, não o seu
:::

---

## Resumo

:::summary
- Identidade visual é fonte, cor primária, ícone e splash contando a mesma história
- Hierarquia tipográfica usa tamanho, peso e cor; os tokens de `fonte` são os níveis, e duas famílias são o máximo
- `useFonts` carrega a Inter; `preventAutoHideAsync` e `hideAsync` seguram a splash até ela carregar ou falhar
- O nome no `fontFamily` é a chave passada ao `useFonts`; guarde-o em `familia`, no `tokens.js`
- `StatusBar` segue o tema do app, e `icon`, `splash` e `adaptiveIcon` ficam no `app.json`
:::

---

## :icon[flask-conical] No laboratório

Dê feedback e identidade ao Lojinha.

:::steps
1. `npx expo install expo-image expo-font @expo-google-fonts/inter expo-splash-screen @expo/vector-icons`
2. `familia` no `tokens.js`
3. `src/components/ui/Botao.js` com `titulo`, `onPress`, `variante`, `icone` e `desabilitado`
4. `src/components/CartaoProduto.js` com `expo-image`, placeholder, `formatarPreco` importado e carrinho de 44 por 44
5. Em `Inicio.js`: `FlatList` de `CartaoProduto`, `adicionar` com `try` e, no rodapé, o `subtotal` formatado, um `Botao` com ícone e um "Esvaziar" desabilitado sem itens
6. Em `App.js`, a Inter com `useFonts` e a splash segurando até o carregamento
7. `git commit -m "E32: toque, ícones, imagens e fontes"` e `git push`
:::

**Critérios de entrega**: todo toque com feedback; alvos de 44 por 44; fotos com placeholder; Inter em todos os textos; claro e escuro funcionando. Entregue o link do repositório no sistema.

---

## :icon[milestone] Projeto 6 · Etapa 3: toque, ícones, fotos e fonte

No seu repositório `casas-de-adocao`:

- `npx expo install expo-image expo-font expo-splash-screen @expo/vector-icons` e o pacote da sua fonte
- cartão inteiro tocável, com retorno visual; por enquanto, o toque mostra um `Alert` com o horário de visitas
- `Ionicons` nas cores do tema: a pata no cabeçalho, o local ao lado do bairro e um coração de 44 por 44
- foto com `expo-image` e espaço reservado; casa com `foto: ''` mostra a pata
- fonte própria com `useFonts`, a splash segurando até carregar

Commit: `Projeto 6: etapa 3, toque, ícones, fotos e fonte`. Enunciado completo e entrega: página do curso, em **Projetos**.
