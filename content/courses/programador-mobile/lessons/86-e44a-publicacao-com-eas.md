---
title: Publicação com EAS
summary: Gere o APK de preview do app da equipe com o EAS Build, com identidade no app.json e segredos fora do app.
module: integracao
duration_minutes: 40
objectives:
  - Configurar nome, versão, android.package, ícone e splash no app.json
  - Gerar e instalar um APK de preview com o EAS Build e o perfil preview do eas.json
  - Preparar a API da equipe para o APK e manter segredos fora do app
  - Explicar o que o EAS Update resolve e o que as lojas exigem para publicar
---

# Publicação com EAS

Programador Mobile · Encontro E44 · Aula 86 de 89

---

## O que você vai aprender

:::goal
- Diferenciar o app no Expo Go, o APK de preview e o app da loja
- Dar identidade ao app no `app.json`: nome, versão, `android.package`, ícone e splash
- Criar o `eas.json` e o perfil `preview`, que gera um APK
- Gerar o build na nuvem, instalar no celular e fazer a API da equipe responder nele
- Manter segredos fora do app e conhecer o EAS Update e as exigências das lojas
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **build** | o app empacotado num arquivo que se instala no celular; em inglês, "construção" |
| **APK** | o arquivo de app que o Android instala direto, sem passar pela loja |
| **EAS** | os serviços da Expo que fazem o build num computador deles, pela internet |
| **perfil** | um jeito de fazer o build, com nome: `preview` para testar, `production` para a loja |
| **keystore** | a chave que assina o app e prova que cada versão veio da sua equipe |
| **segredo** | senha ou chave que dá poder a quem a tem; nunca vai dentro do app |

---

## "Me manda o app?"

Fim da sprint. O dono da barbearia gostou da demonstração da agenda e pergunta: "Me manda o app para eu mostrar ao meu sócio?".

Hoje o app só existe no Expo Go, ligado ao `npx expo start` do computador da equipe. Fechou o notebook, o app para de abrir. O sócio não tem o Expo Go, não tem o QR code e não está na sua rede. E o próximo encontro é o Demo Day: a **banca**, o grupo que avalia os projetos, vai perguntar onde instala.

:::question
O que precisa mudar para o app abrir no celular de outra pessoa, com o seu computador desligado?
:::

---

## O build

Qual a diferença entre comer o bolo na padaria e levar um embalado para casa?

---

## :icon[package] O build: o app embalado para viagem

Um **build** é o app inteiro dentro de um arquivo que se instala: o JavaScript, as imagens e o **código nativo**, a parte que o Android entende sem JavaScript.

Pense num bolo assado e embalado para viagem: ele sai da padaria e chega inteiro na casa de quem recebe. No Expo Go é diferente: o app é servido na hora, direto do seu computador, pelo `npx expo start`. Fechou o notebook, acabou o app.

No Android, o build que se instala é um **APK**, um arquivo que termina em `.apk`. Exemplo: o sócio do dono da barbearia abre um link, baixa o `.apk`, toca nele, e o app aparece na tela do celular, com o ícone da barbearia.

---

## :icon[package] O JavaScript vai dentro do APK

:::center
![Diagrama: no Expo Go, o JavaScript e os dados vêm do computador, e com o notebook fechado o app não abre; no APK de preview, o JavaScript está dentro do celular, só os dados vêm do computador, e o app abre sozinho](images/e44-expo-go-x-apk.svg)
:::

No Expo Go, o JavaScript vem do `npx expo start`. No APK, ele já está dentro do celular, e o app abre sozinho. Só os **dados** ainda vêm do computador, pelo `json-server`.

---

## :icon[smartphone] Expo Go, APK e loja na prática

| | Expo Go | APK de preview | Loja |
|---|---|---|---|
| O JavaScript vem | do seu computador | de dentro do arquivo | de dentro do pacote |
| Ícone e splash | os do Expo Go | os seus | os seus |
| Quem instala | quem lê o seu QR code | quem tem o link, no Android | qualquer pessoa |
| Depende de | computador ligado | só da API | conta e revisão da loja |
| Serve para | desenvolver | testar e apresentar | publicar |

**Preview** quer dizer "prévia": a versão para testar antes da loja. Hoje vocês vão da primeira coluna à segunda.

---

## A identidade do app

Que número identifica você, e mais ninguém, no país inteiro?

---

## :icon[id-card] A identidade do app no app.json

O `app.json` guarda a **identidade** do app: o nome embaixo do ícone, a versão, o ícone e um identificador. O **`android.package`** é o CPF do app: não existe outro igual, e depois de publicado na loja ele não muda mais.

```json
{
  "expo": {
    "name": "Agenda Fácil",
    "slug": "agenda-facil",
    "version": "1.0.0",
    "icon": "./assets/icon.png",
    "android": {
      "package": "com.suaequipe.agendafacil",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#0f766e"
      }
    }
  }
}
```

- `name`: o nome embaixo do ícone; `slug`: o nome no endereço do expo.dev
- `version`: principal.novidade.correção, como as versões dos pacotes no E02
- `adaptiveIcon`: o ícone que o Android recorta em círculo ou quadrado, sobre a cor de fundo
- Ícone e `splash`, a tela de abertura, seguem o E32. Mexa só nessas chaves

---

## :icon[fingerprint] O android.package na prática

Três regras: só letras minúsculas e números, sem espaço, hífen nem acento; pelo menos duas partes, separadas por ponto; cada parte começa com letra.

| Valor | Vale? | Por quê |
|---|---|---|
| `com.equipeagenda.agendafacil` | sim | três partes, todas começando com letra |
| `com.equipe-agenda.app` | não | tem hífen |
| `Agenda Fácil` | não | espaço, maiúscula e acento: esse é o `name` |
| `barbearia` | não | uma parte só: falta o ponto |

Ao publicar na loja, entra também o **`android.versionCode`**: um número inteiro que diz à loja qual build é o mais novo.

---

## EAS Build

Quem não tem forno em casa e quer um bolo assado faz o quê?

---

## :icon[cloud] EAS: o build na nuvem

O **EAS** (*Expo Application Services*, serviços de app da Expo) reúne os serviços da Expo para fazer o build, atualizar e enviar apps. O **EAS Build** faz o build num computador da Expo, pela internet: a **nuvem**. É como o forno da padaria: você entrega a massa, a padaria assa e avisa quando está pronto. Você não precisa de Android Studio nem de Mac.

```bash
npm install -g eas-cli   # uma vez por computador
eas login                # e-mail e senha da conta do expo.dev
eas whoami               # mostra quem está logado
```

- Crie a conta em expo.dev e confirme o e-mail antes do `eas login`
- Uma conta por equipe: o **dono do build** faz o login e roda os comandos do EAS; o resto da equipe revisa o PR
- O plano gratuito tem fila de espera e limite mensal de builds

---

## :icon[cloud] O EAS na prática

Três situações do dia do build, todas no terminal da pasta do app:

```bash
eas whoami           # quem está logado? Mostra o usuário, como ana-souza
eas build:list       # quais builds a conta já fez, com o estado de cada um
npx eas-cli whoami   # o mesmo, num computador sem o eas-cli instalado
```

- Antes de qualquer build, o `eas whoami` confere se a conta é a do dono do build, e não a de um colega
- O `eas build:list` mostra se o build está na fila, compilando, pronto ou com erro
- No computador da escola, onde o `npm install -g` pode ser bloqueado, o **`npx eas-cli`** baixa e roda o programa na hora: troque `eas` por `npx eas-cli` em qualquer comando

---

## Perfis de build

Na câmera do celular, para que servem os modos retrato e noite?

---

## :icon[file-code] O eas.json e os perfis

O **`eas.json`** guarda os **perfis** de build. Cada perfil é um jeito de fazer o build, com nome, como os modos da câmera do celular: você escolhe "retrato" ou "noite", e a câmera ajusta tudo de uma vez. Para criar o arquivo, rode na pasta do app:

```bash
eas build:configure
```

:::steps
1. Pergunta as plataformas: escolha **Android** ou **All** (todas)
2. Liga a pasta a um projeto no expo.dev e grava o número dele, o `projectId`, no `app.json`
3. Cria o `eas.json` com três perfis de build
:::

---

## :icon[layers] Os três perfis

| Perfil | Para quê | No Android gera |
|---|---|---|
| `development` (desenvolvimento) | build de desenvolvimento, no lugar do Expo Go | APK de desenvolvimento |
| `preview` (prévia) | testar como usuário, instalado por link | AAB, até você pedir APK |
| `production` (produção) | enviar para a loja | AAB |

O **AAB** (*Android App Bundle*, pacote de app Android) é o formato que a loja recebe. O Android não instala um `.aab` direto: para testar fora da loja, o `preview` precisa gerar APK.

Faça o commit do `eas.json` e do `app.json`: a equipe inteira usa o mesmo projeto. Só o dono do build roda o `eas build:configure`; o resto da equipe recebe pelo PR.

---

## :icon[settings] O perfil preview gera o APK

No `eas.json`, dentro de `build`, complete o perfil `preview`. Os outros perfis continuam como vieram:

```json
"preview": {
  "distribution": "internal",
  "android": {
    "buildType": "apk"
  },
  "env": {
    "EXPO_PUBLIC_API_URL": "http://192.168.0.15:3000"
  }
}
```

- **`distribution: "internal"`** (distribuição interna): o build ganha um link de instalação para compartilhar
- **`buildType: "apk"`** (tipo de build): o arquivo que o Android instala direto, sem loja
- **`env`** (de *environment*, ambiente): valores que o app recebe no build. Aqui, a URL da API, com o IP do computador que vai rodar o `json-server` na apresentação
- Por que não no `.env`? Ele está no `.gitignore`, e o EAS não envia arquivos ignorados
- Tudo o que está em `env` vai para dentro do app: só valores públicos

---

## Pense

:::question
A equipe do cardápio gerou o build com `eas build --profile production --platform android` e mandou o arquivo no grupo da turma. Ninguém consegue instalar: o arquivo termina em `.aab`. Por que, e o que muda para o Demo Day?
:::

:::tip Resposta
O **AAB** é o formato que a Play Store recebe: a loja monta, a partir dele, o APK certo para cada aparelho. O Android não instala um `.aab` direto.

Para instalar sem loja, gere com `--profile preview`, que tem `distribution: "internal"` e `buildType: "apk"`, e mande o **link** do build, não o arquivo solto.
:::

---

## http e https

Quem consegue ler um cartão-postal no caminho até a casa de quem recebe?

---

## :icon[wifi] http:// no APK

Um endereço com **`http://`** manda os dados sem proteção, como um cartão-postal: quem está no caminho consegue ler. Com **`https://`**, os dados vão numa carta lacrada, com **criptografia**: embaralhados para quem não é o destinatário.

O Expo Go aceita `http://`. O APK é um build de **release** (versão final), e o Android bloqueia `http://` por padrão. O sintoma: o app instala e abre, mas a tela mostra "Network request failed" ("o pedido pela rede falhou").

---

## :icon[wifi] http e https na prática

O mesmo app, buscando dados em três endereços:

| A API está em | No Expo Go | No APK |
|---|---|---|
| `https://dummyjson.com` | a lista carrega | a lista carrega |
| `http://192.168.0.15:3000`, o `json-server` | a lista carrega | "Network request failed" |
| o mesmo `http://`, com o `usesCleartextTraffic` e um build novo | a lista carrega | a lista carrega |

A DummyJSON usa `https://`: passa em qualquer lugar. O `json-server` do computador da equipe usa `http://`: no APK, ele precisa da liberação.

---

## :icon[plug] Liberar o http:// para o json-server

Para o APK aceitar o `json-server` da rede local, instale um pacote e ligue uma opção na lista `plugins` (complementos do build) do `app.json`:

```bash
npx expo install expo-build-properties
```

```json
"plugins": [
  "expo-router",
  ["expo-build-properties", { "android": { "usesCleartextTraffic": true } }]
]
```

- **`expo-build-properties`** muda configurações nativas do build; `usesCleartextTraffic: true` quer dizer "aceite dados sem criptografia", o cartão-postal
- Mantenha os plugins que já estão na lista; se o nome `expo-build-properties` já entrou sozinho, troque pela forma com as opções
- É configuração nativa: só vale num **build novo**
- APIs com `https://`, como a DummyJSON, não precisam disso. Num app de verdade, o servidor tem `https`

---

## Gerar e instalar

Antes de pôr o bolo no forno, o que você confere?

---

## :icon[hammer] Gerar o build

Gerar o build é levar o projeto ao forno do EAS. Antes, confira a massa: o **`expo-doctor`** ("médico do Expo") aponta pacotes fora da versão do Expo que o projeto usa, o **SDK**, antes de você gastar um build.

```bash
npx expo-doctor
eas build --profile preview --platform android
```

| Parte | O que ela diz |
|---|---|
| `npx expo-doctor` | "examine o projeto e diga o que está fora do lugar" |
| `eas build` | "faça o build na nuvem do EAS" |
| `--profile preview` | "use o perfil `preview` do `eas.json`" |
| `--platform android` | "faça para Android" |

---

## :icon[list-ordered] O que acontece no build

:::steps
1. Na primeira vez, o EAS pergunta se gera um **keystore** novo: responda que sim. É a chave que assina o app, como a sua assinatura num documento: as próximas versões precisam da mesma. O EAS a guarda para você
2. O projeto é compactado e enviado, sem os arquivos do `.gitignore`
3. O build entra na fila, e o terminal mostra o link para acompanhar no expo.dev
4. No fim, a página do build tem o botão **Install** (instalar) e um QR code
:::

Pode fechar o terminal: o build continua na nuvem, e `eas build:list` lista os builds da conta. Falhou? Na página do build, abra o **log**, o registro de cada etapa, e leia a primeira etapa vermelha.

---

## :icon[cloud] Do computador ao celular

:::center
![Animação: o eas build envia o projeto sem o .env; na nuvem, o EAS Build passa pela fila, compila e assina; o .apk chega ao celular por link ou QR code e fica instalado](images/e44-build-na-nuvem.svg)
:::

O seu computador só envia o projeto, sem os arquivos do `.gitignore`. Fila, **compilação** (a montagem do app instalável) e assinatura com o keystore acontecem na nuvem da Expo, e o resultado volta como um link: é por ele que o `.apk` chega ao celular.

---

## :icon[download] Instalar o APK e conferir

:::steps
1. No celular Android, leia o QR code da página do build ou abra o link
2. Baixe o `.apk` e toque nele; o Android pede permissão para instalar apps vindos do navegador: permita
3. O **Play Protect**, a proteção do Android, pode avisar que não conhece o app. É esperado, porque ele não veio da loja: confirme a instalação
4. Desligue o `npx expo start` e abra o app pelo ícone
:::

Agora aparecem o seu ícone, nome e splash. O app abre sozinho; só os dados dependem do `json-server` ligado e do celular na mesma Wi-Fi do computador.

O APK é só para Android. No iPhone, sem conta paga da Apple, a equipe apresenta pelo Expo Go.

---

## Segredos no app

O cardápio vai para a mão de todo cliente. O que nunca pode estar escrito nele?

---

## :icon[shield-alert] Segredos fora do app

Um **segredo** é uma senha ou chave que dá poder a quem a tem: ler os dados de todos os clientes, cobrar um cartão. Ele nunca vai dentro do app.

Pense no APK como o cardápio impresso que o restaurante entrega a cada cliente. Quem baixa consegue abrir o arquivo e ler o JavaScript que está dentro: o que estiver escrito lá, qualquer pessoa lê.

:::tip Antes do build
Procure no código por `senha`, `secret` e `key`: o que estiver lá vai para o celular de todo mundo.
:::

---

## :icon[lock] Segredos na prática

| Dado | Onde fica |
|---|---|
| URL da API, nome do ambiente | no app: `env` do perfil ou `EXPO_PUBLIC_` |
| chave anon (pública) do Supabase, com RLS | no app: foi feita para isso |
| chave `service_role`, chave de pagamento | só no servidor, nunca no app nem no Git |
| token do usuário | no SecureStore, depois do login (E43) |
| keystore que assina o app | com o EAS, nunca no repositório |

O **Supabase** é um banco de dados na nuvem. A chave **anon** vai no app porque o **RLS**, as regras de quem lê cada linha, protege os dados. A `service_role` passa por cima do RLS; a de pagamento cobra cartões.

---

## EAS Update

Precisa assar outro bolo só para trocar a cobertura?

---

## :icon[refresh-cw] EAS Update: corrigir sem novo build

O **EAS Update** (atualização) manda ao app já instalado só o JavaScript e as imagens novas. É como trocar a cobertura do bolo que já está na casa da pessoa, sem assar outro. Mudar a massa pede build novo: biblioteca com código nativo, permissão nova ou ícone.

```bash
npx expo install expo-updates
eas update:configure
eas update --channel preview --message "Corrige o texto do botão Agendar"
```

- `expo-updates` é o pacote que busca as atualizações; o `update:configure` prepara o projeto
- Depois dele, gere **um** build novo: só ele sabe buscar atualizações
- `eas update` envia aos builds do canal (*channel*) `preview`, com uma mensagem, como num commit
- O app baixa ao abrir e passa a usar a versão nova na abertura seguinte

Nesta sprint, fica como visão: um build bem testado resolve.

---

## :icon[refresh-cw] O EAS Update na prática

Quatro mudanças depois que o APK já está no celular da banca:

| Mudança | Como chega ao celular |
|---|---|
| o texto do botão Agendar estava errado | `eas update`: o app baixa ao abrir e usa na abertura seguinte |
| a foto do serviço Corte foi trocada | `eas update`: imagem também vai pelo ar |
| o app ganhou ícone novo | build novo e instalação nova |
| a equipe instalou o `expo-camera`, com código nativo | build novo e instalação nova |

A pergunta é sempre a mesma: mudou só a cobertura (JavaScript e imagens) ou mudou a massa (nativo, permissão, ícone)?

---

## As lojas

Onde você procura um app novo para instalar no celular?

---

## :icon[store] As lojas: o app ao alcance de todos

As **lojas** de apps são a Google Play, no Android, e a App Store, no iPhone. Nelas, qualquer pessoa acha e instala o app, sem link nem QR code.

Funcionam como um supermercado: só põem na prateleira o produto que tem cadastro, rótulo e passou na conferência. Na loja, isso quer dizer conta de desenvolvedor, página do app e revisão.

O `eas submit` (enviar) manda o build às lojas. As regras mudam: contas pessoais novas na Play, por exemplo, passam por um teste fechado antes da produção. Confira no Play Console.

---

## :icon[clipboard-list] O que as lojas exigem

Para publicar, cada loja pede:

| Exigência | Google Play | App Store |
|---|---|---|
| Conta de desenvolvedor | taxa única | anuidade da Apple |
| Pacote | AAB assinado | build de iOS assinado, que o EAS gera sem Mac |
| Política de privacidade | link público | link público |
| Página na loja | ícone, capturas, descrições | ícone, capturas por tamanho de tela |
| Formulários | segurança dos dados, classificação | privacidade, classificação etária |
| Revisão | a cada publicação | humana, a cada versão |

A **política de privacidade** é o texto que diz o que o app faz com os dados de quem usa.

---

## Mensagens de erro

Quando acende uma luz no painel do carro, o que você faz?

---

## :icon[siren] Quando aparece um erro

A mensagem de erro é a luz do painel do carro: diz o que aconteceu e onde.

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `'eas' não é reconhecido` | terminal aberto antes da instalação | reabrir o terminal, ou `npx eas-cli` |
| `Network request failed`, só no APK | `http://` bloqueado, ou URL só no `.env` | plugin e URL no `env`; build novo |
| o `.aab` não instala | perfil `production` | `--profile preview` e o link |
| `Install dependencies` em vermelho | pacote fora da versão do SDK | `npx expo-doctor` e build novo |
| `Waiting in queue` (na fila) | fila do plano gratuito | esperar sem cancelar |

---

## :icon[triangle-alert] Erros comuns

:::warning
- Mandar o `.aab` do perfil `production` para instalar: o Android não abre; use o `preview` com `buildType: "apk"`
- Contar com o `.env` no build: ele está no `.gitignore` e não sobe; a URL vai no `env` do perfil
- `json-server` em `http://` sem o `usesCleartextTraffic`: "Network request failed" só no APK
- Cada pessoa da equipe rodando `eas build:configure` na própria conta: projetos diferentes e `projectId` em conflito no PR
- Segredo em `EXPO_PUBLIC_` ou no `env`: vai para dentro do APK
- Trocar o `android.package` depois de publicar: para a loja, é outro app
- Gerar build a cada commit: a fila e o limite do plano gratuito acabam com a sprint
:::

---

## Resumo

:::summary
- O Expo Go depende do seu computador; o APK de preview leva o app inteiro dentro e instala por link no Android
- `name`, `version` e `android.package` dão identidade ao app; ícone e splash aparecem de verdade no build
- `eas build:configure` cria o `eas.json`; o perfil `preview` com `distribution: "internal"`, `buildType: "apk"` e `env` gera o APK com a URL da API
- `eas build --profile preview --platform android` faz o build na nuvem; para o `json-server` em `http://`, o `usesCleartextTraffic` vem antes
- Tudo o que vai no app é público: segredos ficam no servidor
- O EAS Update troca JavaScript e imagens sem build novo; as lojas pedem conta, página e revisão
:::

---

## :icon[arrow-right] Próximos passos

O app já pode sair do Expo Go. Falta ele ser encontrado e entendido por quem nunca o viu.

Na aula 87, portfólio e README:

- :icon[file-text] o README que recruta: problema, solução, telas, como rodar e decisões
- :icon[play] o vídeo de demonstração de 60 a 90 segundos
- :icon[flask-conical] o laboratório: a sprint 2, com APK, README e o ensaio do pitch

Antes dela: o dono do build da equipe dispara o primeiro `eas build`. Ele espera na fila enquanto vocês veem a próxima aula.
