---
title: React Native e Expo
summary: "Começa o Projeto 5: o kit do Gota no seu celular, com Expo, Expo Go e a conta Expo, e a tela com View e Text."
module: react-native
duration_minutes: 90
objectives:
  - Explicar o que muda de um site para um app nativo e o que o React Native faz
  - Abrir o kit do Projeto 5 no celular com o Expo Go, a conta Expo e o QR code
  - Escrever a tela com View e Text, sem texto solto
  - Ler o terminal do npx expo start, com os logs, o recarregar e o desligar
---

# React Native e Expo

Programador Mobile · Encontro E29 · Aula 29 de 45

---

## O que você vai aprender

:::goal
- Começar o Projeto 5, o Gota, um app que abre no seu celular
- Dizer o que muda de um site para um app e o que o React Native faz
- Abrir o kit no celular com o Expo Go, a conta Expo e o QR code
- Montar a tela com as peças do celular: `View` e `Text`
- Ler o terminal do `npx expo start`
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **app nativo** | um app instalado no celular, feito com as peças do próprio aparelho |
| **React Native** | o React do Projeto 4, desenhando telas de celular em vez de páginas |
| **Expo** | a caixa de ferramentas que roda o app React Native no seu celular enquanto você programa |
| **Expo Go** | o app, baixado da loja, que abre no celular o projeto do seu computador |
| **QR code** | o quadradinho de pontos que a câmera lê, como o da mesa do restaurante |
| **`View` e `Text`** | as peças do celular que entram no lugar da `<div>` e do `<p>` |

---

## :icon[milestone] Projeto 5: o Gota

Até o E28, os seus projetos abriam no navegador. O **Gota** abre no seu celular, como os apps da loja: cada copo de água vira um toque, e uma barra mostra quanto falta para a meta de 2000 ml.

| Encontro | O Gota ganha |
|---|---|
| E29, hoje | o kit no seu celular, a sua saudação e a meta do dia |
| E30 | os estilos e o seu componente, o `BotaoCopo` |
| E31 | os copos do dia, a barra, a lista e a entrega |

Hoje, o kit abre com "Olá! Troque esta frase pela sua saudação.". No fim do dia, a frase é sua, com a meta embaixo. Enunciado e entrega: página do curso, em **Projetos**.

---

## App ou site

O que o app do banco faz no seu celular que o site do banco não faz?

---

## :icon[smartphone] App nativo e site: o que muda

Um **site** abre no navegador, pelo endereço. Um **app nativo** é instalado da loja e usa as peças do próprio **sistema** do celular: o Android ou o iOS, o do iPhone. O site visita o seu celular; o app mora nele.

| | Site | App nativo |
|---|---|---|
| Para quem usa: como abre | pelo endereço, no navegador | pelo ícone, na tela inicial |
| Para quem usa: o que faz | o que o navegador deixa | avisos, câmera, digital |
| Para quem programa: a tela | tags do HTML | peças do sistema: botões, textos, listas |
| Para quem programa: onde testa | no navegador | no celular |

---

## :icon[smartphone] App e site na prática

**Caso 1: o mesmo banco, dois jeitos.** No site, você digita a senha a cada visita. No app, a digital abre a conta, e um aviso chega quando o Pix cai.

**Caso 2: um app para cada sistema.** O app nativo tradicional é escrito duas vezes, cada uma na língua do seu sistema. O mesmo título, nas duas línguas:

```plaintext
Text(text = "Gota")     // Android, na língua Kotlin
Text("Gota")            // iPhone, na língua Swift
```

São dois projetos, cada tela feita duas vezes. Mudou o título? Muda nos dois.

**Caso 3: o Livro de receitas e o Gota.** O Projeto 4 é um site: abre em qualquer navegador. O Gota é um app: abre no celular, pelo Expo Go.

---

## :icon[notebook-pen] Exercícios: App ou site

:::example Exercícios
1. O cardápio da lanchonete abre no navegador, pelo endereço. Site ou app nativo?
2. Com a tela bloqueada, o app avisa que o ônibus está chegando. Por que o site não avisa?
3. Qual destas linhas é do Android: `Text(text = "Academia")` ou `Text("Academia")`?
4. Do jeito tradicional, um app de 6 telas para Android e iPhone: quantas telas a equipe escreve?
:::

:::tip Respostas
1. Site: abre pelo endereço, sem instalar
2. O aviso é uma peça do sistema, que o app nativo usa; o site só faz o que o navegador deixa
3. A primeira, na língua Kotlin. A segunda é Swift, do iPhone
4. 12: as 6 telas em Kotlin e as mesmas 6 em Swift
:::

---

## React Native

Numa reunião com um estrangeiro, o que faz o intérprete?

---

## :icon[layers] React Native: o mesmo React, outras peças

O **React Native** é o React do Projeto 4 desenhando telas de celular. Ele trabalha como um intérprete: você escreve componentes em JSX, e ele repete cada peça na língua do sistema. Na tela aparece um texto nativo, o mesmo que o Kotlin ou o Swift desenhariam.

```jsx
<View>
  <Text>Gota</Text>
</View>
```

- **Um código só**: o mesmo arquivo vira o app do Android e o do iPhone
- **Outras peças**: no lugar das tags do HTML, as do celular, como a `View` e o `Text`
- O seu código decide **o que** aparece; o sistema desenha

---

## :icon[layers] React Native na prática

Quase tudo o que você aprendeu no Projeto 4 vai junto para o Gota. Mudam as peças da tela e o lugar onde o app abre:

| No Livro de receitas (P4) | No Gota (P5) |
|---|---|
| componente, JSX, chaves e props | igual |
| `useState`, `map` com `key`, `import` e `export` | igual |
| `<div>` e `<p>` | `<View>` e `<Text>` |
| `npm run dev` e o navegador | `npx expo start` e o Expo Go, no celular |

Apps conhecidos usam React Native, no app inteiro ou em partes dele: o Discord, o Shopify e o Instagram.

---

## :icon[notebook-pen] Exercícios: React Native

:::example Exercícios
1. Com React Native, um app de 6 telas para Android e iPhone: quantas telas a equipe escreve?
2. Do Projeto 4 para o Gota, vai igual ou muda: o `useState`, a `<div>`, o `map` com `key`?
3. O que o celular mostra?

   ```jsx
   <View>
     <Text>Treino de {3 * 15} minutos</Text>
   </View>
   ```

4. Quem desenha esse texto no celular: o seu código ou o sistema?
:::

:::tip Respostas
1. 6: um código só vira o app do Android e o do iPhone
2. O `useState` e o `map` com `key` vão iguais; a `<div>` vira `View`
3. `Treino de 45 minutos`: as chaves calculam, como no Projeto 4
4. O sistema: o seu código diz o que aparece, e o React Native repete a peça na língua do sistema
:::

---

## Expo

Para montar um móvel: ferramentas avulsas ou uma caixa completa?

---

## :icon[wrench] Expo: a caixa de ferramentas

O **Expo** é a caixa de ferramentas do React Native: em vez de buscar cada ferramenta, você recebe tudo junto, num pacote do npm, o `expo`.

| Ferramenta | O que faz |
|---|---|
| `npx expo start` | liga o **servidor de desenvolvimento**, que entrega o app ao celular enquanto você programa: o `npm run dev` do E24 |
| **Expo Go** | o app da loja que abre no celular o projeto do seu computador |
| `npx expo login` | entra na sua conta Expo, pelo terminal |

O `npx` é o do `npx serve`, do E12: roda o comando de um pacote. Sem o Expo, ver o app no celular pedia programas pesados, como o Android Studio.

---

## :icon[notebook-pen] Exercícios: Expo

:::example Exercícios
1. Qual comando liga o servidor de desenvolvimento do Expo?
2. No Projeto 4, o `npm run dev` servia a página, e o navegador a abria. E no Gota?
3. O Expo Go fica no computador ou no celular? De onde ele vem?
4. O que o `npx` faz em `npx expo login`?
:::

:::tip Respostas
1. `npx expo start`
2. O `npx expo start` serve o app, e o Expo Go o abre no celular
3. No celular: é um app da loja, a Play Store ou a App Store
4. Roda o comando de um pacote, como no `npx serve` do E12: aqui, o `login` do pacote `expo`
:::

---

## :icon[milestone] Projeto 5 · Passo 1: o kit no computador

:::steps
1. Baixe o [kit-gota.zip](materiais/projeto-5/kit-gota.zip) e extraia na pasta dos seus projetos (no Windows: botão direito, **Extrair tudo**)
2. Renomeie `kit-gota` para `gota`. Se aparecer `kit-gota/kit-gota`, use a de dentro, a do `package.json`
3. No terminal: `cd gota` e `code .`
4. No terminal do VS Code: `npm install`, uma vez só. Ele baixa o Expo e o React Native, como no E04
:::

**Pronto quando:** o `npm install` termina com `added 456 packages` (o número pode variar), e o painel mostra a pasta `node_modules/`.

:::warning
O `npm install` avisa `5 moderate severity vulnerabilities` e sugere `npm audit fix --force`. Não rode: ele troca o Expo do kit por um antigo, que o Expo Go não abre.
:::

---

## :icon[folder-tree] O kit do Gota: um projeto Expo

| Arquivo ou pasta | O que é |
|---|---|
| `App.js` | a tela do app, o que aparece no celular: é aqui que você trabalha |
| `index.js` | liga o `App` ao Expo; você não mexe |
| `app.json` | a identidade do app: o nome Gota e o ícone |
| `package.json` | os pacotes `expo`, `react-native` e `react`, e o script `start` |
| `assets/` | as imagens: a gota e o ícone |
| `src/` | as peças prontas, em `components/`, e as cores e a hora, do E30 e do E31 |

Não existe `index.html`: sem navegador, não há página. O seu `BotaoCopo.js` entra em `src/components/` no E30.

---

## A conta do Expo

Por que as suas fotos aparecem no celular e no computador?

---

## :icon[user-check] A conta do Expo: a mesma nos dois lados

A **conta Expo** é o seu cadastro grátis no site do Expo, feito em [expo.dev/signup](https://expo.dev/signup). É como a conta do Google: a mesma no celular e no computador, e os dois se reconhecem.

- **No terminal:** `npx expo login` abre o navegador para você entrar; o terminal responde `Logged in`
- **No Expo Go:** o ícone de pessoa, no canto de cima, e a mesma conta
- **Para conferir:** `npx expo whoami` mostra a conta do terminal, ou `Not logged in`

Desde setembro de 2026, o Expo Go do iPhone só abre o app com a mesma conta nos dois lados. No Android ainda não é obrigatório, mas todos entram: o túnel, o caminho pela internet, pede a conta.

---

## :icon[notebook-pen] Exercícios: A conta do Expo

:::example Exercícios
1. Qual comando entra na conta Expo pelo terminal? E qual mostra quem entrou?
2. A Bia entrou no terminal como `bia.souza` e, no Expo Go do iPhone, como `bia2010`. O app abre?
3. No Android, a mesma conta ainda não é obrigatória. Por que a turma entra assim mesmo?
4. Quanto custa a conta Expo, e onde se cria?
:::

:::tip Respostas
1. `npx expo login`; depois, `npx expo whoami` mostra a conta, ou `Not logged in`
2. Não: desde setembro de 2026, o iPhone pede a mesma conta nos dois lados
3. O túnel, o caminho pela internet, pede a conta no terminal
4. É grátis, em `expo.dev/signup`
:::

---

## O QR code

No restaurante, o que acontece quando você lê o QR code da mesa?

---

## :icon[qr-code] O QR code e o mesmo Wi-Fi

O `npx expo start` liga o servidor e mostra um **QR code** no terminal. Como o da mesa do restaurante, ele guarda um endereço: o do seu computador na rede, como `exp://192.168.101.6:8081`.

:::center
![Animação: o Expo Go lê o QR code que o npx expo start mostra no computador, o app chega ao celular pelo mesmo Wi-Fi e abre na tela](images/e26-qr-expo-go.svg)
:::

O servidor transmite como uma rádio de alcance curto: só pega quem está no **mesmo Wi-Fi**. No Android, quem lê o QR code é o Expo Go; no iPhone, a câmera do sistema.

---

## :icon[wifi] A rede na prática

**Caso 1: em casa.** Celular e computador no mesmo Wi-Fi: o app abre em segundos. Com o celular nos dados móveis, ele fica fora do alcance, e o Expo Go mostra `Something went wrong` ("algo deu errado").

**Caso 2: a rede da escola bloqueia.** Algumas redes não deixam um aparelho falar com o outro. Aperte <kbd>Ctrl</kbd> + <kbd>C</kbd> e ligue o **túnel**:

```bash
npx expo start --tunnel
```

O túnel leva o app pela internet, como um desvio quando a rua de sempre está fechada: funciona em quase qualquer rede, só que mais devagar. Ele precisa da conta Expo no terminal.

**Caso 3: a primeira vez no Windows.** O **firewall**, o porteiro do computador, pergunta se o Node.js pode usar a rede: clique em **Permitir acesso**.

---

## :icon[notebook-pen] Exercícios: O QR code

:::example Exercícios
1. O que o QR code do `npx expo start` guarda?
2. No iPhone, quem lê o QR code? E no Android?
3. O computador está no Wi-Fi da escola; o celular, no da padaria ao lado. O app abre?
4. A rede bloqueia a conversa entre aparelhos. Complete: `npx expo start ___`
5. O firewall do Windows pergunta se o Node.js pode usar a rede. Qual botão?
:::

:::tip Respostas
1. O endereço do computador na rede, como `exp://192.168.0.20:8081`
2. A câmera do sistema; no Android, o Expo Go
3. Não: o servidor é uma rádio de alcance curto, que só pega no mesmo Wi-Fi
4. `--tunnel`: o desvio pela internet, mais devagar, com a conta Expo
5. **Permitir acesso**
:::

---

## :icon[milestone] Projeto 5 · Passo 2: o app no celular

:::steps
1. No terminal do VS Code, na pasta `gota`: `npx expo login`, e entre com a sua conta no navegador
2. No celular, o Expo Go (da Play Store ou da App Store), com a mesma conta
3. `npx expo start`: o terminal mostra o QR code
4. Android: no Expo Go, **Scan QR code** (ler o QR code), apontando para o terminal. iPhone: a câmera, e o aviso para abrir no Expo Go
:::

Com a mesma conta nos dois lados, o Expo Go lista o seu computador em **Development servers** (servidores de desenvolvimento): um toque abre o app.

**Pronto quando:** o celular mostra "Gota" e "Olá! Troque esta frase pela sua saudação." no fundo azul-claro.

---

## O terminal do Expo

O app roda no celular. Para onde vai o `console.log`?

---

## :icon[server] O terminal do npx expo start

Enquanto o servidor está ligado, o terminal é a conversa entre o computador e o celular. Embaixo do QR code, ele escreve (trecho):

```plaintext
› Scan the QR code above to open in Expo Go.
› Metro: exp://192.168.101.6:8081

› Using Expo Go
› Press r │ reload app

Logs for your project will appear below. Press Ctrl+C to exit.
```

| A linha | O que quer dizer |
|---|---|
| `Metro: exp://...:8081` | o endereço que o QR code guarda; o número muda de rede para rede. O **Metro** é a parte do Expo que junta o seu código e entrega ao celular |
| `Press r │ reload app` | a tecla `r` abre o app de novo, do começo |
| `Logs for your project will appear below` | os recados do app, como o `console.log`, aparecem aqui embaixo |
| `Press Ctrl+C to exit` | <kbd>Ctrl</kbd> + <kbd>C</kbd> desliga o servidor |

---

## :icon[server] O terminal na prática

**Caso 1: salvou, o celular muda.** Com o servidor ligado, troque um texto no `App.js` e salve: em um ou dois segundos, o celular mostra a mudança, sem ler o QR code de novo. É o **Fast Refresh** (atualização rápida), o "salvou, mudou" do Vite no E24.

**Caso 2: o `console.log` vem para o computador.** O app roda no celular, mas o recado aparece no terminal, com `LOG` na frente:

```jsx
// dentro da função App, antes do return
console.log('O App desenhou a tela');
```

```plaintext
 LOG  O App desenhou a tela
```

**Caso 3: recarregar e desligar.** A tecla `r` escreve `› Reloading apps` e abre o app do começo. Com <kbd>Ctrl</kbd> + <kbd>C</kbd>, o servidor sai do ar, e o celular para de atualizar.

---

## :icon[notebook-pen] Exercícios: O terminal do Expo

:::example Exercícios
1. Qual tecla do terminal abre o app de novo, do começo?
2. O que quer dizer cada linha?

   ```plaintext
   › Metro: exp://192.168.0.20:8081
    LOG  Treino salvo
   ```

3. Você trocou um texto, salvou, e o celular mudou sozinho. Como se chama isso?
4. O celular parou de mudar ao salvar, e o terminal não mostra mais o menu do Expo. O que houve?
:::

:::tip Respostas
1. `r`, que escreve `› Reloading apps`
2. O endereço que o QR code guarda; e um `console.log('Treino salvo')` que rodou no app
3. Fast Refresh, o "salvou, mudou" do Vite, agora no celular
4. O servidor saiu do ar, com <kbd>Ctrl</kbd> + <kbd>C</kbd>: rode `npx expo start` de novo
:::

---

## :icon[milestone] Projeto 5 · Passo 3: o kit no Git

O terminal do servidor fica ocupado: abra um segundo terminal no VS Code, no botão **+**.

:::steps
1. Na raiz da pasta `gota`, crie o arquivo `.gitignore` com duas linhas: `node_modules/` e `.expo/`
2. `git init`
3. `git add .` e `git status`: a lista não pode ter `node_modules/` nem `.expo/`
4. `git commit -m "Kit do Gota"`
:::

O `node_modules/` o `npm install` refaz. A `.expo/` é uma pasta que o `npx expo start` criou, com configurações da sua máquina. As duas ficam fora do Git.

**Pronto quando:** o commit mostra `16 files changed`, e `git log --oneline` mostra `Kit do Gota`.

---

## View e Text

No celular não existe página nem HTML. Com que peças se monta a tela?

---

## :icon[code-xml] View e Text: a caixa e o texto

No React Native, as tags do HTML dão lugar às peças do celular. As duas primeiras vêm do pacote `react-native`:

| Peça | O que é | No Projeto 4 |
|---|---|---|
| `View` | uma caixa que agrupa outras peças; sozinha, não aparece | a `<div>` |
| `Text` | a única peça que mostra letras na tela | o `<p>` e o `<h2>` |

```jsx
<View>
  <Text>Gota</Text>
  <Text>Olá! Troque esta frase pela sua saudação.</Text>
</View>
```

Duas regras novas:

- **Não existe `div`**: sem navegador, não há HTML, e as tags da web não funcionam
- **Texto só dentro de `Text`**: no P4, uma `<div>` aceitava texto solto; a `View`, não

---

## :icon[code-xml] View e Text na prática

**Caso 1: texto solto.** O texto ficou direto na `View`: `<View>Olá!</View>`. O React Native avisa numa faixa escura embaixo da tela do celular (toque nela para ler o aviso inteiro) e no terminal, com `ERROR` na frente:

```plaintext
Text strings must be rendered within a <Text> component.
```

Às vezes é só um ponto esquecido entre duas tags. O conserto: `<View><Text>Olá!</Text></View>`.

**Caso 2: uma tag da web.** Com uma `<div>` em volta do `Text`, o app para, e a tela **Render Error** (erro ao desenhar) diz:

```plaintext
View config getter callback for component `div` must be a function (received `undefined`). Make sure to start component names with a capital letter.
```

O celular não conhece a `div`, nem a `view` em minúscula. Troque por `View` e salve: a tela de erro some sozinha.

---

## :icon[list-ordered] O App.js do kit em português

| Linha | O que ela diz |
|---|---|
| `import { Text, View } from 'react-native';` | "traga o `Text` e a `View`, peças do celular"; com chaves: um `export` nomeado (E16) |
| `import Tela from './src/components/Tela';` | "traga a `Tela`, uma peça do kit"; sem chaves: ela sai com `export default` |
| `export default function App() {` | "esta é a peça `App`, a tela": o `export default` do E24, na linha da função |
| `<Tela> ... </Tela>` | "ponha tudo isto no fundo azul-claro, longe do relógio"; o que fica entre as tags chega à `Tela` na prop `children` (filhos) |
| `{/* ... */}` | um **comentário no JSX**: nada aparece no celular |

---

## :icon[notebook-pen] Exercícios: View e Text

:::example Exercícios
1. Troque a tag da web pela peça do celular: `<p>Ponto final</p>`
2. O que o celular mostra?

   ```jsx
   <View>
     <Text>Academia aberta</Text>
     {/* <Text>Fechada</Text> */}
     <Text>Até as {20 + 2}h</Text>
   </View>
   ```

3. Conserte o texto solto: `<View>Bom treino!</View>`
4. A tela **Render Error** fala do componente `view`. O que está errado em `<view><Text>Oi</Text></view>`?
5. Complete: `import { ___, ___ } from '___';`
:::

:::tip Respostas
1. `<Text>Ponto final</Text>`: só o `Text` mostra letras
2. `Academia aberta` e, embaixo, `Até as 22h`: o comentário não aparece
3. `<View><Text>Bom treino!</Text></View>`, e o aviso `Text strings must be rendered within a <Text> component` some
4. A `view` em minúscula: o celular só conhece a `View`, com V maiúsculo
5. `Text` e `View`, em qualquer ordem, e `react-native`
:::

---

## :icon[milestone] Projeto 5 · Passo 4: a primeira mudança

No `App.js`, troque a frase do segundo `Text` pela sua saudação, com o seu nome, e salve com <kbd>Ctrl</kbd> + <kbd>S</kbd>:

```jsx
      <View>
        <Text>Gota</Text>
        <Text>Olá, Ana! Bora beber água hoje?</Text>
      </View>
```

Não toque no celular: o Fast Refresh leva a mudança sozinho.

Depois, veja o aviso do texto solto: apague o `<Text>` e o `</Text>` da saudação, salve e leia a mensagem no celular e no terminal. Desfaça com <kbd>Ctrl</kbd> + <kbd>Z</kbd> e salve de novo.

**Pronto quando:** em um ou dois segundos, o celular mostra a sua saudação, sem você apertar nada, e o aviso sumiu.

---

## :icon[milestone] Projeto 5 · Sua vez: a meta do dia

Agora, sozinho. No `App.js`, no lugar do comentário `{/* Etapa 1 (E29), sua vez: a meta do dia */}`, escreva a meta do dia: uma `View` com dois `Text`, um com "Meta do dia" e outro com "2000 ml".

:::tip Dicas
- A `View` do topo, com o "Gota" e a saudação, já mostra a forma
- Todo texto do app fica dentro de um `<Text>`
- Os outros comentários do kit ficam: eles dizem onde entram as próximas etapas
:::

**Pronto quando:** o celular mostra, um embaixo do outro, "Gota" e a sua saudação e, depois de um espaço, "Meta do dia" e "2000 ml"; o terminal não mostra erro.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Something went wrong` | o celular não alcança o computador | mesmo Wi-Fi, **Permitir acesso** ou `--tunnel` |
| o Expo Go fala em outra conta | contas diferentes | conferir com `npx expo whoami` |
| `incompatible with this version of Expo Go` | Expo Go velho | atualizar na loja |
| `Need to install the following packages` | faltou o `npm install`, ou é outra pasta | `n`, `cd gota`, `npm install` |
| `Port 8081 is being used` | outro servidor ligado | `Y`, ou fechar o outro |
| `Text strings must be rendered` | texto fora do `Text` | pôr num `<Text>` |

---

## :icon[milestone] Projeto 5 · Etapa 1 pronta

O celular mostra "Gota", a sua saudação, "Meta do dia" e "2000 ml". No segundo terminal:

```bash
git add .
git commit -m "Projeto 5: etapa 1, app no celular"
```

No GitHub: **New repository**, nome `gota`, **Public**, sem README nem `.gitignore`, porque o projeto já tem. Depois, os três comandos que o GitHub mostra:

```bash
git remote add origin https://github.com/SEU-USUARIO/gota.git
git branch -M main
git push -u origin main
```

O histórico mostra dois commits: o do kit e o da etapa 1. Se faltou algo, termine em casa: o celular e o computador no mesmo Wi-Fi de casa, e a etapa inteira está no enunciado, em **Projetos**.

---

## Resumo

:::summary
- Um site abre no navegador; um app nativo é instalado e usa as peças do celular. O React Native é o React do Projeto 4 desenhando essas peças
- O Expo é a caixa de ferramentas: `npx expo start` liga o servidor, e o Expo Go abre o app no celular pelo QR code
- Celular e computador no mesmo Wi-Fi e com a mesma conta Expo (`npx expo login`); se a rede bloqueia, `npx expo start --tunnel`
- No celular não existe `div`: a `View` agrupa, e o `Text` mostra as letras; texto solto gera aviso
- O terminal do servidor mostra o `console.log` com `LOG`; `r` recarrega, <kbd>Ctrl</kbd> + <kbd>C</kbd> desliga, e o Fast Refresh atualiza o celular ao salvar
:::

---

## :icon[arrow-right] Próximos passos

No E30, o Gota ganha cara:

- :icon[pencil] os **estilos**: tamanho, negrito e cor, com o `StyleSheet`
- :icon[image] a gota no topo, com a peça `Image`
- :icon[component] o seu componente, o `BotaoCopo`, um botão que responde ao toque

Traga o celular carregado, com o Expo Go e a conta Expo funcionando.
