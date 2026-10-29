---
title: Ambiente Expo
summary: Criar um app React Native com Expo, rodar no celular pelo Expo Go e entender os arquivos do projeto.
module: react-native
duration_minutes: 40
objectives:
  - Criar um app React Native com Expo
  - Rodar o app no celular com o Expo Go
  - Reconhecer a estrutura do projeto e resolver os erros mais comuns de execução
---

# Ambiente Expo

Programador Mobile · Encontro E26 · Aula 51 de 89

---

## O que você vai aprender

:::goal
- Criar o projeto `minhas-tarefas-mobile` com um comando
- Abrir o app no celular com o **Expo Go** (ou no emulador)
- Reconhecer os arquivos do projeto: `App.js`, `app.json`, `assets/`
- Resolver os erros mais comuns de rede e execução
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **Expo Go** | o app, baixado da loja, que abre no celular o projeto que está no seu computador |
| **servidor de desenvolvimento** | um programa ligado no computador que entrega o app ao celular enquanto você programa |
| **QR code** | o quadradinho de pontos que a câmera lê, como o do cardápio do restaurante |
| **emulador** | um celular de mentira, que roda numa janela do computador |
| **Fast Refresh** | atualização rápida: salvou o arquivo, o celular mostra a mudança |
| **firewall** | o porteiro do computador: decide quais conexões podem entrar |

---

## :icon[smartphone] Do navegador para o bolso

Antes, para ver um app no celular, você precisava do Android Studio (uma instalação pesada) ou de um Mac com Xcode. Muita gente desistia antes da primeira tela.

Com o Expo, o caminho é outro:

:::steps
1. Um comando cria o projeto
2. Outro comando mostra um QR code
3. Você lê o QR code e o app abre no seu celular
:::

Hoje você sai da aula com o `minhas-tarefas-mobile` rodando no seu próprio aparelho.

---

## :icon[list-checks] Pré-requisitos

No computador, nada novo: o ambiente do E01 serve. A novidade fica no bolso.

- :icon[terminal] **Node.js LTS** do E01: confira com `node -v`
- :icon[code] VS Code aberto na pasta onde você guarda os projetos
- :icon[git-branch] Git e conta no GitHub, do E01, usados desde o E03
- :icon[smartphone] Um celular Android ou iOS com o app **Expo Go**, da Play Store ou da App Store
- :icon[wifi] Computador e celular na **mesma rede Wi-Fi**

:::tip
Sem celular à mão? O emulador Android funciona como alternativa, mas exige o Android Studio instalado.
:::

---

## Criar o projeto

O que acontece com a música quando a rádio sai do ar?

---

## :icon[terminal] Criando o app

Dois comandos põem o app no ar. O primeiro monta a pasta do projeto, pronta, como o `npm create vite` do E21. O segundo liga o **servidor de desenvolvimento**: o computador passa a transmitir o app, como uma rádio, enquanto o servidor estiver ligado.

```bash
npx create-expo-app@latest minhas-tarefas-mobile --template blank
cd minhas-tarefas-mobile
npx expo start
```

- `npx` baixa e roda o `create-expo-app` sem instalá-lo (o `npx` do E03); ele cria a pasta e instala as dependências
- `--template blank` (modelo em branco) gera o projeto mais simples: um `App.js` em JavaScript
- `cd` entra na pasta nova
- `npx expo start` liga o servidor e mostra um QR code no terminal

A primeira execução demora um pouco: ela baixa tudo de que o projeto precisa.

---

## :icon[square-terminal] Criar e ligar, na prática

Depois do `npx expo start`, o terminal mostra o QR code e, embaixo, um menu de teclas (trecho):

```plaintext
› Metro waiting on exp://192.168.0.10:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press w │ open web
› Press j │ open debugger
› Press r │ reload app
› Press m │ toggle menu
```

| Tecla | O que faz | Quando você usa |
|---|---|---|
| `a` | abre o app no emulador Android | sem celular, ainda hoje |
| `r` | recarrega o app | app travado (E28) |
| `m` e `j` | abrem o menu do desenvolvedor e o depurador | para achar erros (E28) |
| <kbd>Ctrl</kbd> + <kbd>C</kbd> | desliga o servidor: a rádio sai do ar | antes de abrir outro projeto |

---

## O QR code

No restaurante, o que acontece quando você lê o QR code da mesa?

---

## :icon[qr-code] Lendo o QR code no celular

O **QR code** guarda um endereço, como o do cardápio do restaurante: a câmera lê e abre o que ele aponta. O do Expo aponta para o seu computador. Com o terminal mostrando o QR code:

::::columns
:::col
### Android
1. Abra o **Expo Go**
2. Toque em "Scan QR code" (ler o QR code)
3. Aponte a câmera para o terminal
:::
:::col
### iOS
1. Abra a **câmera do sistema**
2. Aponte para o QR code
3. Toque no aviso para abrir no Expo Go
:::
::::

Em alguns segundos aparece a tela branca com "Open up App.js to start working on your app!" ("abra o App.js para começar a trabalhar no seu app").

---

## :icon[wifi] O QR code na prática

:::center
![Animação: o Expo Go lê o QR code que o npx expo start mostra no computador, o app chega do computador ao celular pelo mesmo Wi-Fi e abre na tela do Expo Go](images/e26-qr-expo-go.svg)
:::

O QR code guarda o endereço do computador na rede, como `exp://192.168.0.10:8081`, e o app vem por ele, pelo Wi-Fi. O servidor é uma rádio de alcance curto: só pega quem está na **mesma rede**.

- Celular e computador no mesmo Wi-Fi: o app abre em segundos
- Celular nos dados móveis: fora do alcance, aparece `Something went wrong`
- Sem celular: um emulador no computador, com a tecla `a`

---

## :icon[monitor] Alternativa: emulador Android

Um **emulador** é um celular de mentira: um Android que roda numa janela do computador, como um simulador de voo imita um avião. Serve para quem está sem celular, ou para testar outro tamanho de tela.

- Exige o **Android Studio** instalado, com um dispositivo virtual criado
- Com o emulador aberto, no terminal do `npx expo start`, aperte a tecla `a`
- O Expo instala o Expo Go no emulador e abre o app sozinho

:::info
Para iOS, o simulador só existe no Mac, com Xcode. Por isso o celular físico é o caminho principal do curso.
:::

---

## Os arquivos do projeto

No projeto web, em qual arquivo estava a tela principal?

---

## :icon[folder-tree] A estrutura do projeto

O `create-expo-app` montou uma pasta com estes arquivos. Cada um tem um papel:

| Arquivo ou pasta | Para que serve |
|---|---|
| `App.js` | O primeiro componente: o que aparece na tela |
| `app.json` | Configurações do app: nome, ícone e tela de abertura |
| `assets/` | Imagens do projeto (ícone, tela de abertura) |
| `package.json` | Nome, scripts e dependências, como no E02 |
| `node_modules/` | Pacotes instalados; nunca vai para o Git |

Repare: não existe `index.html`. Sem navegador, não há DOM, a árvore da página que o navegador monta.

:::tip
O `.gitignore` gerado já ignora `node_modules/`. O Expo também inicia o repositório Git local para você.
:::

---

## :icon[file-code] App.js: o primeiro componente

É um componente React como os do E22: função, JSX e `export default`. O arquivo gerado pelo Expo, com os estilos compactados em uma linha:

```jsx
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
});
```

- `export default function App()`: o componente principal, o que o Expo mostra primeiro
- `style={styles.container}`: aplica à `View` o estilo `container`, criado no fim do arquivo: ocupar a tela toda, fundo branco e conteúdo no centro. Cada propriedade vem no E27

---

## :icon[component] As peças do App.js

As duas linhas de `import` trazem quatro peças:

| Nome | Vem de | Papel |
|---|---|---|
| `View` | `react-native` | Caixa que agrupa e posiciona, como a `div` |
| `Text` | `react-native` | Todo texto visível precisa estar dentro dele |
| `StyleSheet` | `react-native` | Cria os estilos em JavaScript, no lugar do CSS |
| `StatusBar` | `expo-status-bar` | Controla a barra de status (hora, bateria); `style="auto"` escolhe a cor sozinho |

:::tip
A partir do E27, o objeto de estilos se chama `estilos`, em português, como o resto do projeto.
:::

---

## :icon[lightbulb] Pense

:::question
Compare o `minhas-tarefas` (Vite) com o `minhas-tarefas-mobile` (Expo).

Liste duas coisas que **mudaram** e duas que **ficaram iguais**. Pense no comando de criação, em onde o app aparece, nos arquivos da pasta e na forma de escrever um componente.
:::

:::tip Resposta
- Mudaram: o comando (`npx create-expo-app` no lugar de `npm create vite`), onde o app aparece (no celular, não no navegador) e os arquivos (`app.json` e `assets/`, sem `index.html`)
- Ficaram iguais: o componente é uma função com JSX e `export default`, e o `package.json` com scripts e dependências
:::

---

## app.json

O que tem no seu RG, além do nome?

---

## :icon[braces] app.json: a identidade do app

O `app.json` é o RG do app: o nome, a foto (o ícone) e o que aparece quando ele abre. O `App.js` decide o que aparece **dentro** do app; o `app.json`, como ele se apresenta **fora**, na tela inicial do celular. Trecho do arquivo gerado:

```json
{
  "expo": {
    "name": "minhas-tarefas-mobile",
    "slug": "minhas-tarefas-mobile",
    "version": "1.0.0",
    "icon": "./assets/icon.png",
    "splash": { "image": "./assets/splash-icon.png", "backgroundColor": "#ffffff" }
  }
}
```

- `name`: o nome que aparece embaixo do ícone no celular
- `icon`: a imagem do ícone, dentro de `assets/`
- `splash`: a **tela de abertura**, mostrada enquanto o app carrega

---

## :icon[id-card] app.json na prática

Três mudanças comuns, sempre dentro de `"expo"`:

| Você escreve | O que acontece |
|---|---|
| `"name": "Minhas Tarefas"` | o nome do app: no Expo Go, na lista de projetos; no app publicado, embaixo do ícone |
| `"backgroundColor": "#e0f2fe"`, dentro de `splash` | a tela de abertura fica azul-clara |
| `"icon": "./assets/icone.png"` | o ícone vira a sua imagem, salva em `assets/` |

O `app.json` não atualiza sozinho. Depois de mudar, pare o servidor com <kbd>Ctrl</kbd> + <kbd>C</kbd> e rode `npx expo start -c`.

---

## Fast Refresh

No E21, o que acontecia com a página quando você salvava o arquivo?

---

## :icon[refresh-cw] Salvou, atualizou

O **Fast Refresh** (atualização rápida) mostra a mudança no celular assim que você salva o arquivo. É o mesmo "salvou, apareceu" do Vite no E21, agora no aparelho.

Com o app aberto no celular, mude duas coisas no `App.js` e salve:

```jsx
// Troque o texto...
<Text>Minhas Tarefas</Text>

// ...e a cor de fundo
container: { flex: 1, backgroundColor: '#e0f2fe', alignItems: 'center', justifyContent: 'center' },
```

O celular atualiza sozinho, sem montar o app de novo nem ler o QR code outra vez. O `#e0f2fe` é um azul bem claro, escrito em código de cor, como no CSS.

---

## :icon[zap] Fast Refresh na prática

| Você salva | O celular |
|---|---|
| um texto ou uma cor nova no `App.js` | mostra a mudança em um segundo |
| um erro de digitação, como um `<Text>` sem fechar | mostra uma tela vermelha, com a linha do erro |
| a correção do erro | volta sozinho, sem ler o QR code de novo |
| uma mudança no `app.json` | não muda: pare o servidor e rode `npx expo start -c` |

Salve sempre com <kbd>Ctrl</kbd> + <kbd>S</kbd> e olhe o celular. Arquivo não salvo (a bolinha na aba do VS Code) não chega ao aparelho.

---

## A rede

O que o porteiro faz com um visitante que ele não conhece?

---

## :icon[wifi] Wi-Fi e firewall

O celular carrega o app **pela rede**, direto do seu computador. Se a conexão falhar, o QR code não abre nada.

:::warning
- Celular e computador precisam estar na **mesma rede Wi-Fi**; dados móveis não servem
- Redes de empresa ou escola às vezes bloqueiam a conexão entre aparelhos
- O **firewall** do Windows, o porteiro do computador, pode pedir permissão para o Node.js na primeira vez: aceite
:::

Plano B: o **modo túnel** leva o app pela internet, como um desvio quando a rua de sempre está fechada. Funciona em quase qualquer rede, só que mais lento.

```bash
npx expo start --tunnel
```

---

## :icon[network] A rede na prática

Três situações que acontecem com quase todo mundo:

- **Em casa**, celular e computador no mesmo Wi-Fi: `npx expo start`, e o QR code abre o app em segundos
- **Na escola ou na empresa**, a rede bloqueia: <kbd>Ctrl</kbd> + <kbd>C</kbd> e `npx expo start --tunnel`. Na primeira vez, o Expo instala um pacote extra; depois o app abre, mais devagar
- **Primeira vez no Windows**: a janela do firewall pergunta se o Node.js pode usar a rede. Clique em "Permitir acesso"

---

## :icon[siren] Quando aparece um erro

Leia a mensagem antes de reiniciar tudo: como a luz do painel do carro, ela diz o que aconteceu.

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Something went wrong` | "algo deu errado": redes diferentes ou bloqueio | mesmo Wi-Fi ou `--tunnel` |
| `Port 8081 is being used` | "porta 8081 ocupada": outro Expo aberto | `Y` (outra porta) ou feche o outro terminal |
| `Cannot find module` | falta o `node_modules/` | `npm install` na pasta do projeto |
| nada muda, ou erro sem sentido | cache velho | `npx expo start -c` |

**Cache**: uma cópia guardada para ir mais rápido, que às vezes fica velha, como o jornal de ontem.

---

## :icon[list-checks] Resumo

:::summary
- `npx create-expo-app@latest minhas-tarefas-mobile --template blank` cria o projeto; `npx expo start` liga o servidor
- O **Expo Go** lê o QR code e abre o app no celular; o emulador Android é a alternativa (tecla `a`)
- `App.js` é o primeiro componente; `app.json` guarda nome, ícone e tela de abertura; `assets/` guarda as imagens
- Salvou o arquivo, o celular atualiza: **Fast Refresh**
- Mesma rede Wi-Fi é obrigatória; `--tunnel` é o plano B e `-c` limpa o cache
:::

---

## :icon[flask-conical] No laboratório

Crie o app e deixe-o rodando no seu celular.

:::steps
1. Crie o `minhas-tarefas-mobile` e abra no celular (ou no emulador)
2. Troque o texto para "Minhas Tarefas"
3. Mude a cor de fundo em `StyleSheet.create`
4. Mostre uma imagem local da pasta `assets/` (importe `Image` de `react-native`)
5. Crie um repositório no GitHub e envie o projeto com o fluxo do E03 (`git add .`, `git commit`, `git push`)
:::

```jsx
<Image source={require('./assets/icon.png')} style={{ width: 80, height: 80 }} />
```

O `require` traz a imagem de `assets/`; o `style` dá o tamanho, porque o `icon.png` é enorme.

**Critérios**: app rodando no seu celular ou emulador; título, cor e imagem visíveis; repositório com commit.

**Entrega**: mostre o app rodando ao instrutor e envie o link do repositório.

---

## :icon[milestone] Projeto 5 · Gota: meta de água

Seu projeto avaliado do React Native: um app para registrar os copos de água do dia e acompanhar a meta. Repositório próprio, `gota`, feito por você, uma etapa por encontro:

| Encontro | Etapa |
|---|---|
| E26 | app no celular |
| E27 | tela com componentes e `StyleSheet` |
| E28 | estado, lista, `Alert` e caça ao bug |
| E29 | hook `useConsumo`, regras puras e entrega |

Entrega até o **início do E30**: link do repositório na página do projeto. Rubrica de 100 pontos, aprovação com 70.

---

## :icon[milestone] Projeto 5 · Etapa 1: app no celular

Na pasta onde você guarda os projetos, fora da pasta do laboratório:

- `npx create-expo-app@latest gota --template blank`
- `App.js` com o título "Gota", a linha "Meta do dia: 2000 ml" e uma cor de fundo sua
- O app aberto no Expo Go (pare antes o servidor do laboratório, com <kbd>Ctrl</kbd> + <kbd>C</kbd>)
- Repositório público `gota` no GitHub, com README: o que é e como rodar

Commit: `Projeto 5: etapa 1, app no celular`. Enunciado completo e entrega: página do curso, em **Projetos**.
