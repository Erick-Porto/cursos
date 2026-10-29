---
title: Mobile e React Native
summary: O que diferencia um app de um site e como o React Native usa JavaScript para criar telas nativas.
module: react-native
duration_minutes: 35
objectives:
  - Diferenciar app nativo, híbrido e React Native
  - Explicar o papel do Expo
  - Identificar o que muda do React web para o React Native
---

# Mobile e React Native

Programador Mobile · Encontro E26 · Aula 50 de 89

---

## O que você vai aprender

:::goal
- Por que um app no celular é diferente de um site
- Os três jeitos de fazer um app: nativo, híbrido e React Native
- O papel do Expo no dia a dia de quem desenvolve
- O que muda, e o que fica igual, em relação ao React web
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **sistema** | o programa principal do celular, que cuida de tudo: o **Android** ou o **iOS**, o do iPhone |
| **nativo** | feito com as peças do próprio sistema, como os apps que já vêm no celular |
| **base de código** | todo o código de um app; cada base é escrita e corrigida à parte |
| **WebView** | um navegador escondido dentro de um app, mostrando uma página da web |
| **React Native** | o React que você já conhece, desenhando telas de app em vez de páginas |
| **Expo** | um conjunto de ferramentas que cria, roda e publica apps em React Native |

---

## :icon[smartphone] Um site no celular não é um app

Seu JavaScript já rodou no terminal (E01 a E20) e no navegador (E21 a E25). Falta o celular.

Abra o `minhas-tarefas`, a v1 web que você fechou no E25, no navegador do celular. Funciona, mas repare no que falta:

- :icon[store] Não está na loja nem na tela inicial: ninguém "instala" um site
- :icon[bell] Não avisa quando uma tarefa vence: sem **notificações**, os avisos no topo da tela
- :icon[image] Não fotografa um recibo para anexar à tarefa: sem acesso à **câmera**
- :icon[hand] Tela pequena e dedo no lugar do mouse: os botões precisam ser maiores

:::question
Como transformar o que você já sabe de React em um app de verdade, instalado no celular?
:::

---

## Apps nativos

Um aviso em português e em japonês: quantas pessoas você chama para escrever?

---

## :icon[cpu] Jeito 1: app nativo

Um app **nativo** é escrito na língua oficial de cada sistema. Pense num aviso que precisa sair em português e em japonês: duas pessoas escrevem o mesmo texto, cada uma na sua língua.

| Sistema | Linguagem | Ferramenta |
|---|---|---|
| Android | Kotlin | Android Studio |
| iOS | Swift | Xcode (só no Mac) |

- Resultado: o melhor desempenho e acesso total ao aparelho
- Custo: **duas bases de código**, duas equipes, cada tela feita duas vezes

Toda correção de **bug** (um defeito no código) precisa ser feita e testada nos dois lados.

---

## :icon[copy] Apps nativos na prática

O mesmo título "Minhas Tarefas", escrito duas vezes, uma em cada língua:

```plaintext
// Android, em Kotlin
Text(text = "Minhas Tarefas")

// iOS, em Swift
Text("Minhas Tarefas")
```

Na tela: o mesmo título nos dois celulares. Mas são dois arquivos, em dois projetos, cuidados por duas equipes. Mudou o título? Muda nos dois.

Onde o nativo aparece no dia a dia:

- os apps que já vêm no celular, como a câmera e as configurações
- jogos pesados, que precisam de cada gota de desempenho

---

## Apps híbridos

Ver a loja pela TV da vitrine é o mesmo que entrar nela?

---

## :icon[globe] Jeito 2: app híbrido

Um app **híbrido** é um site empacotado como app. Ele abre uma **WebView**, um navegador escondido, e carrega HTML, CSS e JavaScript dentro dela.

É como a TV na vitrine mostrando a loja: você vê a loja, mas não está dentro dela.

- Uma só base de código, feita com o que você já sabe da web
- Botões, listas e animações são da web, não do sistema: o usuário sente que "não parece um app"
- Rolagem e toques costumam ficar menos fluidos

---

## :icon[package] Apps híbridos na prática

Por dentro, um app híbrido é um site dentro de uma caixa:

```plaintext
app híbrido
└── WebView (o navegador escondido)
    └── o site: index.html, estilo.css, app.js
```

Quando uma equipe escolhe o híbrido:

- A loja já tem um site pronto e quer um ícone na tela do celular, rápido
- Um app interno de empresa, simples, usado por poucas pessoas
- O app de um evento que dura três dias

O que o usuário percebe: a rolagem engasga um pouco, e os botões têm cara de página da web.

---

## React Native

Numa reunião com um estrangeiro, o que faz o intérprete?

---

## :icon[component] Jeito 3: React Native

**React Native** usa JavaScript e React, mas o resultado não é um site. Ele trabalha como um intérprete: você escreve em JavaScript, e ele repete cada pedido na língua do aparelho. Cada `View` e cada `Text` vira um componente **nativo de verdade**: o mesmo botão que o Kotlin ou o Swift desenhariam.

```jsx
<View>
  <Text>Minhas Tarefas</Text>
</View>
```

- `View` é uma caixa, como a `div`; `Text` guarda um texto, como o `p`
- Uma só base de código para Android e iOS
- Aparência e toque nativos, sem WebView
- Componentes, props, estado e hooks: o mesmo React do E21 ao E25

---

## :icon[globe] React Native na prática

Empresas conhecidas mantêm apps em React Native, inteiros ou em partes:

- Meta: Facebook, Instagram e Messenger (a criadora da tecnologia)
- Microsoft: Outlook, Office e o app do Xbox
- Shopify
- Discord
- Pinterest
- Mercado Livre

A lição: a tecnologia sustenta apps de grande porte, não só projetos pequenos. E o mesmo `<Text>Minhas Tarefas</Text>` vira o título nativo no Android e no iPhone, escrito uma vez só.

---

## :icon[columns-3] Os três jeitos lado a lado

:::center
![Diagrama: o nativo tem duas bases de código, Kotlin e Swift, e tela nativa; o híbrido tem uma base em HTML, CSS e JS e mostra uma tela da web na WebView; o React Native tem uma base em JS e React e tela nativa, sem WebView](images/e26-tres-jeitos.svg)
:::

Duas perguntas separam os três jeitos: **quantas bases de código** a equipe mantém e **quem desenha a tela**, o sistema ou uma página da web. Só o React Native junta uma base única com tela nativa.

---

## :icon[layers] Como o React Native conversa com o aparelho

Dentro do app instalado existe um **motor JavaScript**: a parte que lê e executa o seu código, como o Node faz no computador. Seu código roda nele e pede ao sistema: "desenhe um texto aqui, um botão ali".

| Camada | O que faz |
|---|---|
| Seu código JS | Decide o que mostrar (componentes, estado) |
| React Native | Traduz cada componente para o sistema: é o intérprete |
| Android ou iOS | Desenha botões e textos nativos na tela |

:::info Para lembrar
O que aparece na tela é nativo; o que decide o que aparece é JavaScript.
:::

---

## :icon[lightbulb] Pense

:::question
Uma equipe de duas pessoas precisa lançar um app para Android e iOS em três meses.

Por que **uma só base de código** faz tanta diferença nesse cenário? Pense em tempo de desenvolvimento, correção de bugs e lançamento de novas funcionalidades.
:::

:::tip Resposta
- Cada tela é feita uma vez, não duas: um app de 10 telas são 10 telas, e não 20
- Cada bug é corrigido uma vez e some nos dois sistemas
- Uma novidade chega ao Android e ao iOS no mesmo dia
:::

---

## Expo

Para montar um móvel: ferramentas avulsas ou uma caixa completa?

---

## :icon[package] Expo: o kit de ferramentas

**Expo** é um conjunto de ferramentas construído sobre o React Native. Pense numa caixa de ferramentas completa: em vez de comprar cada peça separada, você recebe tudo junto e começa a trabalhar.

- :icon[terminal] Cria o projeto com um comando: `npx create-expo-app@latest`
- :icon[smartphone] Roda no seu celular pelo app **Expo Go**, sem instalar Android Studio ou Xcode
- :icon[blocks] Dá acesso a câmera, localização, notificações e sensores com pacotes prontos
- :icon[cloud-download] Gera o arquivo final para publicar nas lojas quando chegar a hora

:::tip
O Expo é o Vite do E21, no mundo mobile: ele não é o React Native, é o que torna o React Native fácil de usar.
:::

---

## :icon[wrench] Expo na prática

Três usos do Expo que você vê já nos próximos dois encontros:

```bash
# 1. Criar o projeto (aula 51)
npx create-expo-app@latest minhas-tarefas-mobile --template blank

# 2. Ligar o app e mostrar o QR code no terminal (aula 51)
npx expo start

# 3. Instalar um pacote pronto, na versão certa para o projeto (aula 52)
npx expo install react-native-safe-area-context
```

- O primeiro cria a pasta com tudo dentro, como o `npm create vite` do E21
- O segundo mostra um QR code; o **Expo Go** lê e abre o app no celular
- O terceiro traz um pacote pronto que afasta o conteúdo da câmera e do relógio

---

## Da web ao celular

Quando você muda de casa, o que vai junto e o que fica?

---

## :icon[arrow-right] O que muda em relação ao React web

É como mudar de casa: a mobília vai junto, mas as tomadas são outras. A lógica do React fica; mudam as peças da tela e o estilo.

| Na web (React) | No celular (React Native) |
|---|---|
| `<div>` | `<View>` |
| Texto solto no JSX | Sempre dentro de `<Text>`; solto, dá erro |
| `className` e CSS em arquivos `.css` | `style` com `StyleSheet`, em JavaScript |
| Navegação por páginas e URLs | Navegação por **telas** |
| DOM do navegador | Sem DOM: componentes nativos |

O que fica igual: JSX (E21), componentes e props (E22), `useState` (E23), `useEffect` e hooks próprios (E24) e o `fetch` do E19.

---

## :icon[arrow-left-right] Da web ao celular na prática

O mesmo cartão de tarefa, no `minhas-tarefas` web e no app:

```jsx
// na web (E22)
<div className="cartao">
  <p>Estudar React</p>
</div>

// no celular (a partir do E27)
<View style={estilos.cartao}>
  <Text>Estudar React</Text>
</View>
```

- `div` virou `View`; o `p` virou `Text`; `className` virou `style`
- O estado não muda nada: `const [tarefas, setTarefas] = useState([]);` é igual nos dois projetos

Na tela: o mesmo cartão, no navegador e no celular.

---

## Limites

Dá para correr na Fórmula 1 com o carro da família?

---

## :icon[triangle-alert] Limites: quando não usar

React Native resolve a maioria dos apps do dia a dia: lojas, bancos, redes sociais. É como um carro de passeio: serve para quase toda viagem, mas não para uma corrida de Fórmula 1.

- **Jogos 3D pesados**: precisam de ferramentas próprias para jogos e de cada gota de desempenho
- **APIs nativas muito específicas** (os recursos que o sistema oferece aos apps): um recurso recém-lançado do sistema, ou um hardware incomum, pode não ter pacote pronto
- Apps que precisam do último detalhe de aparência de cada sistema

Nesses casos, parte do app (ou todo ele) acaba em Kotlin e Swift.

---

## :icon[scale] Limites na prática

:::example Desafio
Para cada app, o React Native serve? Por quê?

1. Um app de delivery: cardápio, carrinho e pagamento
2. Um jogo de corrida em 3D, com gráficos pesados
3. O app de um banco, com saldo, extrato e Pix
:::

:::tip Resposta
1. Serve: são telas, listas e formulários, o dia a dia do React Native
2. Não serve: jogo 3D pesado pede ferramentas próprias para jogos
3. Serve: é um app de negócio. Se um dia usar um recurso muito novo do aparelho, só essa parte vai para Kotlin e Swift
:::

---

## :icon[bug] Erros comuns de expectativa

:::warning
- Achar que React Native é "um site empacotado": não é; a tela é nativa, sem WebView
- Supor que roda igual em todo aparelho sem testar: Android e iOS têm diferenças de fonte, barra de status e teclado
- Esperar que todo pacote do npm funcione no celular: bibliotecas que usam `document` ou `window`, peças do navegador, não funcionam aqui
- Acreditar que não precisa aprender nada novo: o React é o mesmo, mas os componentes e o estilo mudam
:::

---

## :icon[list-checks] Resumo

:::summary
- Um app é instalado, pode notificar e acessar câmera e sensores; um site no navegador não
- Nativo: duas bases de código. Híbrido: site dentro de uma WebView. React Native: JavaScript que vira componentes nativos
- O código JS roda em um motor dentro do app e pede ao sistema para desenhar a tela
- Expo é o kit que cria o projeto, roda no celular e dá acesso ao aparelho
- Muda `div` por `View`, texto por `Text`, CSS por `StyleSheet`; componentes e hooks continuam iguais
:::

---

## :icon[rocket] Próximos passos

Na próxima aula você sai da teoria: vai criar o projeto `minhas-tarefas-mobile` com o Expo e ver o app aparecer no seu próprio celular.

Antes dela, confira:

- :icon[smartphone] Instale o app **Expo Go** pela loja do seu celular (Play Store ou App Store)
- :icon[wifi] Celular e computador precisam estar no mesmo Wi-Fi
- :icon[terminal] No computador, nada novo: o Node.js LTS do E01 é o que o Expo usa
