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

## :icon[smartphone] Do navegador para o bolso

Tradicionalmente, para ver um app no celular você precisava do Android Studio (uma instalação pesada) ou de um Mac com Xcode. Muita gente desistia antes da primeira tela.

Com o Expo, o caminho é outro:

:::steps
1. Um comando cria o projeto
2. Outro comando mostra um QR code
3. Você lê o QR code e o app abre no seu celular
:::

Hoje você sai da aula com o `minhas-tarefas-mobile` rodando no seu próprio aparelho.

---

## :icon[list-checks] Pré-requisitos

No computador, nada novo: o ambiente do E01 basta. A novidade fica no bolso.

- :icon[terminal] **Node.js LTS** do E01: confira com `node -v`
- :icon[code] VS Code aberto na pasta onde você guarda os projetos
- :icon[git-branch] Git e conta no GitHub, do E01, usados desde o E03
- :icon[smartphone] Um celular Android ou iOS com o app **Expo Go**, da Play Store ou da App Store
- :icon[wifi] Computador e celular na **mesma rede Wi-Fi**

:::tip
Sem celular à mão? O emulador Android funciona como alternativa, mas exige o Android Studio instalado.
:::

---

## :icon[terminal] Criando o app

```bash
npx create-expo-app@latest minhas-tarefas-mobile --template blank
cd minhas-tarefas-mobile
npx expo start
```

- `npx` baixa e roda o `create-expo-app` sem instalá-lo (o `npx` do E02); ele cria a pasta e instala as dependências, como o `npm create vite` do E21
- `--template blank` gera o projeto mais simples: um `App.js` em JavaScript
- `npx expo start` liga o **servidor de desenvolvimento** e mostra um QR code no terminal

A primeira execução demora um pouco: ela baixa tudo de que o projeto precisa.

---

## :icon[qr-code] Lendo o QR code no celular

Com o terminal mostrando o QR code:

::::columns
:::col
### Android
1. Abra o **Expo Go**
2. Toque em "Scan QR code"
3. Aponte a câmera para o terminal
:::
:::col
### iOS
1. Abra a **câmera do sistema**
2. Aponte para o QR code
3. Toque no aviso para abrir no Expo Go
:::
::::

Em alguns segundos aparece a tela branca com "Open up App.js to start working on your app!".

---

## :icon[wifi] O app vem do seu computador

:::center
![Animação: o Expo Go lê o QR code que o npx expo start mostra no computador, o app chega do computador ao celular pelo mesmo Wi-Fi e abre na tela do Expo Go](images/e26-qr-expo-go.svg)
:::

O QR code guarda o endereço do seu computador na rede. O Expo Go lê esse endereço e baixa o app direto do computador, pelo Wi-Fi: por isso os dois precisam estar na **mesma rede**.

---

## :icon[folder-tree] A estrutura do projeto

| Arquivo ou pasta | Para que serve |
|---|---|
| `App.js` | O primeiro componente: o que aparece na tela |
| `app.json` | Configurações do app: nome, ícone, splash |
| `assets/` | Imagens do projeto (ícone, splash) |
| `package.json` | Nome, scripts e dependências, como no E02 |
| `node_modules/` | Pacotes instalados; nunca vai para o Git |

Repare: não existe `index.html`. Sem navegador, sem DOM.

:::tip
O `.gitignore` gerado já ignora `node_modules/`. O Expo também inicia o repositório Git local para você.
:::

---

## :icon[file-code] App.js: o primeiro componente

O arquivo gerado pelo Expo (estilos compactados em uma linha):

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

Um componente React como os do E22: função, JSX e `export default`.

---

## :icon[component] As peças do App.js

| Nome | Vem de | Papel |
|---|---|---|
| `View` | `react-native` | Caixa que agrupa e posiciona, como a `div` |
| `Text` | `react-native` | Todo texto visível precisa estar dentro dele |
| `StyleSheet` | `react-native` | Cria os estilos em JavaScript, no lugar do CSS |
| `StatusBar` | `expo-status-bar` | Controla a barra de status (hora, bateria) |

:::tip
A partir do E27, vamos chamar o objeto de estilos de `estilos`, em português, como o resto do projeto.
:::

---

## :icon[lightbulb] Pense

:::question
Compare o `minhas-tarefas` (Vite) com o `minhas-tarefas-mobile` (Expo).

Liste duas coisas que **mudaram** e duas que **ficaram iguais**. Pense no comando de criação, em onde o app aparece, nos arquivos da pasta e na forma de escrever um componente.
:::

---

## :icon[braces] app.json: a identidade do app

Trecho do arquivo gerado:

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
- `splash`: a tela de abertura, mostrada enquanto o app carrega

---

## :icon[refresh-cw] Salvou, atualizou

Com o app aberto no celular, mude duas coisas no `App.js` e salve:

```jsx
// Troque o texto...
<Text>Minhas Tarefas</Text>

// ...e a cor de fundo
container: { flex: 1, backgroundColor: '#e0f2fe', alignItems: 'center', justifyContent: 'center' },
```

O celular atualiza sozinho, sem recompilar nem ler o QR code de novo. Esse recurso se chama **Fast Refresh**: o mesmo "salvou, apareceu" do Vite no E21, agora no aparelho.

---

## :icon[monitor] Alternativa: emulador Android

Sem celular, ou para testar em outro tamanho de tela, use um **emulador**: um Android virtual rodando no computador.

- Exige o **Android Studio** instalado, com um dispositivo virtual criado
- Com o emulador aberto, no terminal do `npx expo start`, aperte a tecla `a`
- O Expo instala o Expo Go no emulador e abre o app sozinho

:::info
Para iOS, o simulador só existe no Mac, com Xcode. Por isso o celular físico é o caminho principal do curso.
:::

---

## :icon[wifi] Wi-Fi e firewall

:::warning
O celular carrega o app **pela rede**, direto do seu computador. Se a conexão falhar, o QR code não abre nada.

- Celular e computador precisam estar na **mesma rede Wi-Fi**; dados móveis não servem
- Redes de empresa ou escola às vezes bloqueiam a conexão entre aparelhos
- O firewall do Windows pode pedir permissão para o Node.js na primeira vez: aceite
:::

Plano B: o **modo túnel** passa pela internet e funciona em quase qualquer rede, só que mais lento.

```bash
npx expo start --tunnel
```

---

## :icon[bug] Erros comuns

| Sintoma | Causa provável | Solução |
|---|---|---|
| "Something went wrong" ao ler o QR | Redes diferentes ou bloqueio | Mesmo Wi-Fi ou `npx expo start --tunnel` |
| "Port 8081 is being used" | Outro Expo aberto | Responda `Y` para usar outra porta, ou feche o outro terminal |
| "Cannot find module" | `node_modules/` faltando | `npm install` na pasta do projeto |
| Mudança não aparece ou erro sem sentido | Cache antigo | `npx expo start -c` |

:::warning
Leia a mensagem no terminal e no celular antes de reiniciar tudo: quase sempre ela diz o que fazer.
:::

---

## :icon[list-checks] Resumo

:::summary
- `npx create-expo-app@latest minhas-tarefas-mobile --template blank` cria o projeto; `npx expo start` liga o servidor
- O **Expo Go** lê o QR code e abre o app no celular; o emulador Android é a alternativa (tecla `a`)
- `App.js` é o primeiro componente; `app.json` guarda nome, ícone e splash; `assets/` guarda as imagens
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

Fora da pasta do laboratório:

- `npx create-expo-app@latest gota --template blank`
- `App.js` com o título "Gota", a linha "Meta do dia: 2000 ml" e uma cor de fundo sua
- O app aberto no Expo Go (pare antes o servidor do laboratório)
- Repositório público `gota` no GitHub, com README: o que é e como rodar

Commit: `Projeto 5: etapa 1, app no celular`. Enunciado completo e entrega: página do curso, em **Projetos**.
