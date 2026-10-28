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

## :icon[smartphone] Um site no celular não é um app

Seu JavaScript já rodou no terminal (E01 a E20) e no navegador (E21 a E25). Falta o celular.

Abra o `minhas-tarefas`, a v1 web que você fechou no E25, no navegador do celular. Funciona, mas repare no que falta:

- :icon[store] Não está na loja nem na tela inicial: ninguém "instala" um site
- :icon[bell] Não avisa quando uma tarefa vence: sem **notificações**
- :icon[image] Não fotografa um recibo para anexar à tarefa: sem acesso à **câmera**
- :icon[hand] Tela pequena e dedo no lugar do mouse: botões precisam ser maiores

:::question
Como transformar o que você já sabe de React em um app de verdade, instalado no celular?
:::

---

## :icon[cpu] Jeito 1: app nativo

Um app **nativo** é escrito na linguagem oficial de cada sistema:

| Sistema | Linguagem | Ferramenta |
|---|---|---|
| Android | Kotlin | Android Studio |
| iOS | Swift | Xcode (só no Mac) |

- Resultado: o melhor desempenho e acesso total ao aparelho
- Custo: **duas bases de código**, duas equipes, cada tela feita duas vezes

Toda correção de bug precisa ser feita e testada nos dois lados.

---

## :icon[globe] Jeito 2: app híbrido

Um app **híbrido** é um site empacotado: o app abre uma **WebView** (um navegador escondido) e carrega HTML, CSS e JavaScript dentro dela.

- Uma só base de código, feita com o que você já sabe da web
- Botões, listas e animações são da web, não do sistema: o usuário sente que "não parece um app"
- Rolagem e toques costumam ficar menos fluidos

Analogia: uma vitrine com uma TV mostrando a loja. Você vê a loja, mas não está dentro dela.

---

## :icon[component] Jeito 3: React Native

**React Native** usa JavaScript e React, mas o resultado não é um site. Cada `View` e cada `Text` vira um componente **nativo de verdade**: o mesmo botão que o Kotlin ou o Swift desenhariam.

```jsx
<View>
  <Text>Minhas Tarefas</Text>
</View>
```

- Uma só base de código para Android e iOS
- Aparência e toque nativos, sem WebView
- Componentes, props, estado e hooks: o mesmo React do E21 ao E25

---

## :icon[columns-3] Os três jeitos lado a lado

:::center
![Diagrama: o nativo tem duas bases de código, Kotlin e Swift, e tela nativa; o híbrido tem uma base em HTML, CSS e JS e mostra uma tela da web na WebView; o React Native tem uma base em JS e React e tela nativa, sem WebView](images/e26-tres-jeitos.svg)
:::

Duas perguntas separam os três jeitos: **quantas bases de código** a equipe mantém e **quem desenha a tela**. Só o React Native junta uma base única com tela nativa.

---

## :icon[layers] Como o React Native conversa com o aparelho

Dentro do app instalado existe um **motor JavaScript**. Seu código roda nele e pede ao sistema: "desenhe um texto aqui, um botão ali".

| Camada | O que faz |
|---|---|
| Seu código JS | Decide o que mostrar (componentes, estado) |
| React Native | Traduz cada componente para o sistema |
| Android ou iOS | Desenha botões e textos nativos na tela |

:::info
Você não precisa saber como essa conversa acontece por dentro. Basta lembrar: o que aparece na tela é nativo; o que decide o que aparece é JavaScript.
:::

---

## :icon[lightbulb] Pense

:::question
Uma equipe de duas pessoas precisa lançar um app para Android e iOS em três meses.

Por que **uma só base de código** faz tanta diferença nesse cenário? Pense em tempo de desenvolvimento, correção de bugs e lançamento de novas funcionalidades.
:::

---

## :icon[package] Expo: o kit de ferramentas

**Expo** é um conjunto de ferramentas construído sobre o React Native. Ele resolve a parte chata para você começar:

- :icon[terminal] Cria o projeto com um comando: `npx create-expo-app@latest`
- :icon[smartphone] Roda no seu celular pelo app **Expo Go**, sem instalar Android Studio ou Xcode
- :icon[blocks] Dá acesso a câmera, localização, notificações e sensores com pacotes prontos
- :icon[cloud-download] Gera o arquivo final para publicar nas lojas quando chegar a hora

:::tip
Pense no Expo como o Vite do E21, no mundo mobile: ele não é o React Native, é o que torna o React Native fácil de usar.
:::

---

## :icon[globe] Quem usa React Native

Empresas conhecidas mantêm apps em React Native, inteiros ou em partes:

- Meta: Facebook, Instagram e Messenger (a criadora da tecnologia)
- Microsoft: Outlook, Office e o app do Xbox
- Shopify
- Discord
- Pinterest
- Mercado Livre

A lição: a tecnologia sustenta apps de grande porte, não só projetos pequenos.

---

## :icon[arrow-right] O que muda em relação ao React web

| Na web (React) | No celular (React Native) |
|---|---|
| `<div>` | `<View>` |
| Texto solto no JSX | Sempre dentro de `<Text>` |
| CSS em arquivos `.css` | `StyleSheet` em JavaScript |
| Navegação por páginas e URLs | Navegação por **telas** |
| DOM do navegador | Sem DOM: componentes nativos |

O que fica igual: JSX (E21), componentes e props (E22), `useState` (E23), `useEffect` e hooks próprios (E24) e o `fetch` do E19.

---

## :icon[triangle-alert] Limites: quando não usar

React Native resolve a maioria dos apps de negócio, mas não todos:

- **Jogos 3D pesados**: exigem motores gráficos dedicados e cada gota de desempenho
- **APIs nativas muito específicas**: um recurso recém-lançado do sistema, ou hardware incomum, pode não ter pacote pronto
- Apps que precisam do último detalhe de aparência de cada plataforma

Nesses casos, parte do app (ou todo ele) acaba em Kotlin e Swift.

---

## :icon[bug] Erros comuns de expectativa

:::warning
- Achar que React Native é "um site empacotado": não é; a tela é nativa, sem WebView
- Supor que roda igual em todo aparelho sem testar: Android e iOS têm diferenças de fonte, barra de status e teclado
- Esperar que todo pacote do npm funcione no celular: bibliotecas que usam `document` ou `window` não existem aqui
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
