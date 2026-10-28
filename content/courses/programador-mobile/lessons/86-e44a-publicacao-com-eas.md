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
- Criar o `eas.json` e o perfil `preview` que gera um APK
- Gerar o build na nuvem, instalar no celular e fazer a API da equipe responder nele
- Manter segredos fora do app e conhecer o EAS Update e as exigências das lojas
:::

---

## "Me manda o app?"

Fim da sprint. O dono da barbearia gostou da demonstração da agenda e pergunta: "Me manda o app para eu mostrar ao meu sócio?".

Hoje o app só existe no Expo Go, ligado ao `npx expo start` do computador da equipe. Fechou o notebook, o app para de abrir. O sócio não tem o Expo Go, não tem o QR code e não está na sua rede. E o próximo encontro é o Demo Day: a banca vai perguntar onde instala.

:::question
O que precisa mudar para o app abrir no celular de outra pessoa, com o seu computador desligado?
:::

---

## :icon[smartphone] Do Expo Go ao app instalado

| | Expo Go | APK de preview | Loja |
|---|---|---|---|
| O JavaScript vem | do seu computador | de dentro do arquivo | de dentro do pacote |
| Ícone e splash | os do Expo Go | os seus | os seus |
| Quem instala | quem lê o seu QR code | quem tem o link, no Android | qualquer pessoa |
| Depende de | computador ligado | só da API | conta e revisão da loja |
| Serve para | desenvolver | testar e apresentar | publicar |

Hoje vocês vão da primeira coluna à segunda.

---

## :icon[package] O JavaScript vai dentro do APK

:::center
![Diagrama: no Expo Go, o JavaScript e os dados vêm do computador, e com o notebook fechado o app não abre; no APK de preview, o JavaScript está dentro do celular, só os dados vêm do computador, e o app abre sozinho](images/e44-expo-go-x-apk.svg)
:::

Um **build** é o app compilado num arquivo instalável, com JavaScript, imagens e código nativo dentro. No Expo Go, o JavaScript vem do `npx expo start`; no APK, só os dados ainda vêm do computador, pelo `json-server`.

---

## :icon[cloud] EAS: o build na nuvem

**EAS** (Expo Application Services) são os serviços da Expo para compilar, atualizar e enviar apps. O **EAS Build** compila num servidor da Expo: você não precisa de Android Studio nem de Mac.

```bash
npm install -g eas-cli   # uma vez por computador
eas login                # e-mail e senha da conta do expo.dev
eas whoami               # mostra quem está logado
```

- Crie a conta em expo.dev com e-mail e senha e confirme o e-mail antes do login
- Uma conta por equipe: o **dono do build** faz o login e roda os comandos do EAS; o resto da equipe revisa o PR
- O plano gratuito tem fila de espera e limite mensal de builds

---

## :icon[id-card] A identidade do app no app.json

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

- **`version`**: a versão que a pessoa vê, no formato do semver (E02)
- **`android.package`**: o identificador único do app. Minúsculas, partes separadas por ponto, cada uma começando com letra, sem hífen nem acento. Publicado na loja, não muda mais
- **`android.versionCode`**: inteiro que a loja usa para saber qual build é o mais novo; só importa ao publicar
- Ícone e `splash` seguem o E32, agora com a cara do app da equipe. Mexa só nessas chaves

---

## :icon[file-code] eas build:configure

```bash
eas build:configure
```

:::steps
1. Pergunta as plataformas: escolha **Android** ou **All**
2. Liga a pasta a um projeto no expo.dev e grava o `projectId` no `app.json`
3. Cria o `eas.json` com três perfis de build
:::

| Perfil | Para quê | No Android gera |
|---|---|---|
| `development` | build de desenvolvimento, no lugar do Expo Go | APK de desenvolvimento |
| `preview` | testar como usuário, instalado por link | AAB, até você pedir APK |
| `production` | enviar para a loja | AAB |

Faça o commit do `eas.json` e do `app.json`: a equipe inteira usa o mesmo projeto.

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

- **`distribution: "internal"`**: o build ganha um link de instalação para compartilhar
- **`buildType: "apk"`**: o arquivo que o Android instala direto, sem loja
- **`env`**: o `.env` está no `.gitignore`, e o EAS não envia arquivos ignorados. A URL da API vem daqui, com o IP do computador que vai rodar o `json-server` na apresentação
- Tudo o que está em `env` vai para dentro do app: só valores públicos

---

## Pense

:::question
A equipe do cardápio gerou o build com `eas build --profile production --platform android` e mandou o arquivo no grupo da turma. Ninguém consegue instalar: o arquivo termina em `.aab`. Por que, e o que muda para o Demo Day?
:::

:::tip Resposta
O **AAB** (Android App Bundle) é o formato que a Play Store recebe: a loja monta, a partir dele, o APK certo para cada aparelho. O Android não instala um `.aab` direto.

Para instalar sem loja, gere com `--profile preview`, que tem `distribution: "internal"` e `buildType: "apk"`, e mande o **link** do build, não o arquivo solto.
:::

---

## :icon[hammer] Gerar o build

```bash
npx expo-doctor
eas build --profile preview --platform android
```

:::steps
1. O `expo-doctor` aponta pacotes fora da versão do SDK antes de você gastar um build
2. Na primeira vez, o EAS pergunta se gera um **keystore** novo: responda que sim. É a chave que assina o app, e o EAS a guarda para você
3. O projeto é compactado e enviado, sem os arquivos do `.gitignore`
4. O build entra na fila, e o terminal mostra o link para acompanhar no expo.dev
5. No fim, a página do build tem o botão **Install** e um QR code
:::

Pode fechar o terminal: o build continua na nuvem, e `eas build:list` lista os builds da conta. Falhou? Na página do build, abra a primeira etapa vermelha do log.

---

## :icon[cloud] Do computador ao celular

:::center
![Animação: o eas build envia o projeto sem o .env; na nuvem, o EAS Build passa pela fila, compila e assina; o .apk chega ao celular por link ou QR code e fica instalado](images/e44-build-na-nuvem.svg)
:::

O seu computador só envia o projeto, sem os arquivos do `.gitignore`. Fila, compilação e assinatura com o keystore acontecem na nuvem da Expo, e o resultado volta como um link: é por ele que o `.apk` chega ao celular.

---

## :icon[download] Instalar o APK e conferir

:::steps
1. No celular Android, leia o QR code da página do build ou abra o link
2. Baixe o `.apk` e toque nele; o Android pede permissão para instalar apps vindos do navegador: permita
3. O Play Protect pode avisar que não conhece o app. É esperado, porque ele não veio da loja: confirme a instalação
4. Desligue o `npx expo start` e abra o app pelo ícone
:::

Agora aparecem o seu ícone, o seu nome e a sua splash. O app abre sozinho; só os dados dependem do `json-server` ligado e do celular na mesma Wi-Fi do computador.

O APK é só para Android. No iPhone, sem conta paga da Apple, a equipe apresenta pelo Expo Go.

---

## :icon[wifi] http:// no APK

O Expo Go aceita `http://`. O APK é um build de **release**, e o Android bloqueia tráfego sem criptografia por padrão: a tela mostra "Network request failed" só no APK. Para liberar o `json-server` da rede local:

```bash
npx expo install expo-build-properties
```

```json
"plugins": [
  "expo-router",
  ["expo-build-properties", { "android": { "usesCleartextTraffic": true } }]
]
```

- Mantenha os plugins que já estão na lista; se o nome `expo-build-properties` já entrou sozinho, troque pela forma com as opções
- É configuração nativa: só vale num **build novo**
- APIs com `https://`, como a DummyJSON, não precisam disso. Num app de verdade, o servidor tem `https`

---

## :icon[shield-alert] Segredos fora do app

Quem baixa o APK consegue abri-lo e ler o JavaScript que está dentro.

| Dado | Onde fica |
|---|---|
| URL da API, nome do ambiente | no `env` do perfil ou em `EXPO_PUBLIC_` |
| chave pública (anon) do Supabase, com RLS | pode ir no app: foi feita para isso |
| chave `service_role`, chave de pagamento | só no servidor, nunca no app nem no Git |
| token do usuário | no SecureStore, depois do login (E43) |
| keystore que assina o app | com o EAS, nunca no repositório |

Antes do build, procure no código por `senha`, `secret` e `key`: o que estiver lá vai para o celular de todo mundo.

---

## :icon[refresh-cw] EAS Update: corrigir sem novo build

Você mandou o APK para a banca e achou um erro de texto. Sem atualização pelo ar, é um build novo e uma instalação nova. O **EAS Update** envia só o JavaScript e as imagens novas, e o app baixa sozinho.

```bash
npx expo install expo-updates
eas update:configure
eas update --channel preview --message "Corrige o texto do botão Agendar"
```

- Depois do `update:configure`, gere **um** build novo: só ele sabe buscar atualizações
- O app baixa a atualização ao abrir e passa a usá-la na abertura seguinte
- Vale para JavaScript e imagens. Biblioteca com código nativo, permissão nova ou ícone pedem build novo

Fica como visão: nesta sprint, um build bem testado basta.

---

## :icon[store] O que as lojas exigem

| Exigência | Google Play | App Store |
|---|---|---|
| Conta de desenvolvedor | taxa única | anuidade da Apple |
| Pacote | AAB assinado | build de iOS assinado, que o EAS gera sem Mac |
| Política de privacidade | link público | link público |
| Página na loja | ícone, capturas, descrições | ícone, capturas por tamanho de tela |
| Formulários | segurança dos dados, classificação | privacidade, classificação etária |
| Revisão | a cada publicação | humana, a cada versão |

Contas pessoais novas na Play passam por um teste fechado antes da produção; as regras mudam, confira no Play Console. O `eas submit` envia o build às lojas.

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
- `eas build --profile preview --platform android` compila na nuvem; para o `json-server` em `http://`, o `usesCleartextTraffic` vem antes
- Tudo o que vai no app é público: segredos ficam no servidor; o EAS Update e as lojas são o próximo passo
:::

---

## :icon[arrow-right] Próximos passos

O app já pode sair do Expo Go. Falta ele ser encontrado e entendido por quem nunca o viu.

Na aula 87, portfólio e README:

- :icon[file-text] o README que recruta: problema, solução, telas, como rodar e decisões
- :icon[play] o vídeo de demonstração de 60 a 90 segundos
- :icon[flask-conical] o laboratório: a sprint 2, com APK, README e o ensaio do pitch

Antes dela: o dono do build da equipe dispara o primeiro `eas build`. Ele espera na fila enquanto vocês veem a próxima aula.
