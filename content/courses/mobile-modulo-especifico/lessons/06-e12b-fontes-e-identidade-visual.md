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

Programador Mobile: Módulo Específico · Encontro E12 · Aula 6 de 71

---

## O que você vai aprender

:::goal
- Organizar a ordem de leitura de uma tela com os tokens de `fonte`
- Carregar a fonte Inter com `useFonts` e segurar a splash até ela ficar pronta
- Guardar a `fontFamily` nos tokens e trocar a `StatusBar` junto com o tema
- Configurar ícone e splash no `app.json`
:::

---

## Todo app parece o mesmo app

Abra o Lojinha agora: fonte padrão do sistema, ícone do Expo na tela inicial, splash branca. Ele funciona, mas poderia ser qualquer loja.

Agora pense no app do seu banco. Você o reconhece pelo ícone entre dezenas de outros, pela cor que aparece na abertura e pelo desenho dos números do saldo, antes de ler qualquer nome.

Isso é **identidade visual**. No React Native, ela também é código.

:::question
O que faz você reconhecer um app sem ler o nome dele?
:::

---

## :icon[sparkles] Os quatro elementos da identidade

| Elemento | Onde o usuário vê | No Lojinha |
|---|---|---|
| Fonte | em todo texto | Inter, em dois pesos |
| Cor primária | botões, preços, ícones ativos | `cores.primaria`, do E11 |
| Ícone | tela inicial do celular | `assets/icon.png` |
| Splash | os primeiros segundos, enquanto o app abre | logo sobre a cor primária |

Os quatro contam a mesma história. Um ícone azul que abre numa splash laranja e mostra botões verdes parece três apps diferentes.

A cor você resolveu no E11. Hoje entram a fonte, o ícone e a splash.

---

## :icon[layers] Hierarquia tipográfica

Numa vitrine, você lê primeiro o preço grande e só depois as letras miúdas. **Hierarquia tipográfica** é decidir essa ordem de leitura com tamanho e peso. Os tokens `fonte` do E11 já são os níveis:

| Nível | Token | Peso | No Lojinha |
|---|---|---|---|
| Destaque | `fonte.destaque` (28) | negrito | preço na tela do produto |
| Título | `fonte.titulo` (20) | negrito | "Destaques", nome na tela do produto |
| Corpo | `fonte.corpo` (16) | regular | descrição, nome no cartão |
| Pequena | `fonte.pequena` (12) | regular | categoria, avaliação |

Para o que é secundário, use também a cor `cores.textoSuave`. Quatro níveis bastam: com mais, ninguém percebe a diferença entre eles.

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

## :icon[text] Uma fonte com a cara do app

Sem `fontFamily`, o app usa a fonte do sistema: **Roboto** no Android e **San Francisco** no iPhone. O mesmo Lojinha muda de cara em cada aparelho.

Com uma fonte própria, o texto fica igual nos dois. A **Inter** é gratuita, legível em tamanhos pequenos e tem números bem desenhados, bons para preços.

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

## :icon[hourglass] useFonts: carregar antes de desenhar

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

- `useFonts` recebe um objeto, e cada **chave** vira um nome para o `fontFamily`. `{ Inter_700Bold }` é atalho para `{ Inter_700Bold: Inter_700Bold }`: o nome é `'Inter_700Bold'`
- Devolve dois valores: se carregou e se deu erro
- Enquanto carrega, `return null` não desenha nada. Sem isso, o texto nasce na fonte do sistema e "pula" para a Inter
- Se der erro, o app abre com a fonte do sistema em vez de travar

---

## :icon[smartphone] A splash segura a abertura

`return null` deixa a tela em branco por um instante. Melhor manter a **splash**, a tela de abertura, até a fonte ficar pronta:

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

::::columns
:::col
![Animação: preventAutoHideAsync segura a splash roxa, useFonts carrega a Inter com return null e, pronta ou com erro, hideAsync esconde a splash e o app abre na Inter](images/e12-splash-fontes.svg)
:::
:::col
- `preventAutoHideAsync()` avisa: "não esconda a splash sozinho"
- `hideAsync()` esconde quando a fonte carregou **ou** falhou
- Na tela: a splash fica até a Inter estar pronta, e o app já abre com a letra certa
:::
::::

---

## :icon[sliders-horizontal] fontFamily nos tokens

Escrever `'Inter_700Bold'` em cada estilo é pedir um erro de digitação. Guarde os nomes em `tokens.js`, ao lado de `fonte`:

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

## :icon[sun] StatusBar combinando com o tema

A **barra de status**, a faixa do relógio e da bateria, também faz parte da identidade: ícones sem contraste parecem defeito. Você a ligou ao tema no E11; confira se ficou assim.

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

## :icon[smartphone] Ícone do app no app.json

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
- `android.adaptiveIcon`: cada fabricante recorta o ícone num formato (círculo, quadrado arredondado, gota). `foregroundImage` é o desenho, com margem folgada para não ser cortado; `backgroundColor` preenche o fundo

Edite só essas chaves e deixe as outras como estão. O fundo `#6d28d9` é a `primaria` do tema claro.

---

## :icon[smartphone] Ícone adaptativo: o recorte

:::center
![Diagrama: o fundo roxo do backgroundColor e o logo do foregroundImage formam um quadrado; cada fabricante recorta em círculo, quadrado arredondado ou gota, e o logo no centro aparece inteiro nos três](images/e12-icone-adaptativo.svg)
:::

O Android junta as duas camadas do `adaptiveIcon` e aplica o formato do aparelho. Deixe o desenho do `foregroundImage` na área central, dentro do círculo tracejado: o que passa dela pode ser cortado em algum recorte.

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

## :icon[component] O Botao do Lojinha

No laboratório, o botão com ícone e feedback vira um componente em `src/components/ui/Botao.js`, usado assim:

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

Por dentro: `Pressable` com `({ pressed })`, `android_ripple`, `minHeight: 44` e `familia.negrito` no texto. No E13, ele ganha tamanhos e a variante `fantasma`.

---

## :icon[triangle-alert] Erros comuns

:::warning
- `fontFamily: 'Inter'` com `useFonts({ Inter_400Regular })`: o nome não existe. No Android, o texto volta para a Roboto sem avisar
- `hideAsync()` esquecido, ou chamado só quando `fontesCarregadas` é `true`: se a fonte falhar, a splash nunca some
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

Dê feedback e identidade ao Lojinha, no seu celular.

:::steps
1. `npx expo install expo-image expo-font @expo-google-fonts/inter expo-splash-screen`
2. `src/utils/formatar.js` com `formatarPreco`; `familia` no `tokens.js`
3. `src/components/ui/Botao.js` com `titulo`, `onPress`, `variante`, `icone` e `desabilitado`
4. `src/components/CartaoProduto.js` com `expo-image`, placeholder, preço formatado e carrinho de 44 por 44
5. Em `Inicio.js`, uma `FlatList` de `CartaoProduto` e, no rodapé, um `Botao` primário com ícone e um secundário
6. Em `App.js`, a Inter com `useFonts` e a splash segurando até o carregamento
7. `git commit -m "E12: toque, ícones, imagens e fontes"` e `git push`
:::

**Critérios de entrega**: todo toque com feedback; alvos de 44 por 44; fotos com placeholder; Inter em todos os textos; claro e escuro funcionando. Entregue o link do repositório no sistema.
