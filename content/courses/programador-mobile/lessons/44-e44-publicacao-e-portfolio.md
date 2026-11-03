---
title: Publicação e portfólio
summary: O checklist em cada tela, o APK feito na nuvem com o EAS, a versão v1.0.0 no GitHub e o README de portfólio.
module: integracao
duration_minutes: 90
objectives:
  - Conferir a própria tela com o checklist de qualidade e corrigir o que ele pegar
  - Gerar o APK do app com o EAS e instalar num Android, sem o Expo Go
  - Publicar o APK numa versão do GitHub, a v1.0.0
  - Escrever o README de portfólio da equipe, com os prints e quem fez o quê
---

# Publicação e portfólio

Programador Mobile · Encontro E44 · Aula 44 de 45

---

## O que você vai aprender

:::goal
- Conferir a sua tela com o checklist de qualidade antes de entregar
- Separar o app que abre no Expo Go do app instalado no celular
- Gerar o APK do app na nuvem, com o EAS, e instalar num Android
- Guardar o APK numa versão do GitHub, a `v1.0.0`
- Escrever o README que mostra o app a quem nunca o viu
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **checklist** | a lista de conferência: cada item é marcado antes de dizer "pronto" |
| **build** | o app empacotado num arquivo que se instala; em inglês, "construção" |
| **APK** | o arquivo que instala o app no Android (*Android Package*, pacote do Android) |
| **EAS** | o serviço do Expo que faz o build nos computadores dele, pela internet |
| **Release** | a página de uma versão do projeto no GitHub, com arquivos para baixar |
| **portfólio** | os seus melhores trabalhos, reunidos para mostrar a quem contrata |

---

## "Me manda o app?"

A Ana mostra o Gasto Certo à tia, que pede: "me manda?". Hoje, o app só abre no Expo Go, com o `npx expo start` ligado no computador da equipe.

| Situação | Hoje | No fim do encontro |
|---|---|---|
| a tia quer o app | nada para mandar | um link para instalar |
| o computador desliga | o app não abre | o app abre pelo ícone |
| alguém abre o GitHub da equipe | o README do kit | problema, prints e equipe |
| a banca do E45 testa as telas | ninguém conferiu | nove itens conferidos |

:::question
Quem usaria o app da equipe? Como ele chegaria ao celular dessa pessoa?
:::

---

## :icon[milestone] Projeto 7 · Etapa 4: quem faz o quê

Cada pessoa cuida da sua tela e, se tiver, da sua tarefa da equipe. Tudo por branch e pull request revisado, como desde o E42.

| Quem | O que faz | Branch |
|---|---|---|
| cada pessoa | confere a sua tela, corrige e tira o print | `qualidade-` e o nome da tela |
| quem cuida da publicação | o nome do app, o `eas.json`, o build e a `v1.0.0` | `apk` |
| quem cuida do README | o README de portfólio, com os prints | `readme` |

A ordem dos merges: as `qualidade-`, depois a `apk` e, por último, a `readme`. Depois de cada merge, todos: `git switch main` e `git pull`.

---

## Checklist de qualidade

Antes de decolar, o piloto confia na memória ou numa lista?

---

## :icon[clipboard-check] Checklist: conferir antes de entregar

O **checklist de qualidade** é a lista que você confere em cada tela antes de entregar, como o piloto antes de decolar: os mesmos itens, toda vez, mesmo com pressa.

Os nove estão na página [Checklist de qualidade](materiais/projeto-7/checklist-de-qualidade.html):

| O que olhar | Os itens |
|---|---|
| abre e se lê | 1. sem tela vermelha, 2. claro e escuro, 3. sem cor nem medida solta |
| quando falta algo | 4. a lista vazia explica, 5. o formulário diz o que corrigir |
| para todo mundo | 6. leitor de tela, 7. letra grande |
| de verdade | 8. dados no celular, 9. textos do app, sem "teste" |

A banca do E45 confere os mesmos.

---

## :icon[clipboard-check] O checklist na prática

**Caso 1: a cor solta.** O item 3 procura no código o que devia vir do tema (E34). O **`git grep`** procura um texto nos arquivos do repositório: é o Ctrl + F, no terminal.

```bash
git grep -n -E "#[0-9a-fA-F]{3,8}\b" -- app src/components ":(exclude)src/components/ui"
```

```plaintext
app/(abas)/lancamentos.js:41:  titulo: { fontSize: 24, fontWeight: 'bold', color: '#222' },
```

| Parte | O que ela diz |
|---|---|
| `-n` | "mostre o número da linha": aqui, a 41 |
| `-E "#[0-9a-fA-F]{3,8}\b"` | "procure um `#` com 3 a 8 dígitos de cor, como `#222`" |
| `-- app src/components` | "só nestas pastas" |
| `":(exclude)src/components/ui"` | "menos as peças do kit" |

Saída vazia: o item passa. **Caso 2: o leitor de tela.** Um toque no cartão do saldo lê só "Saldo", e o valor pede outro toque: o item 6 falha.

---

## :icon[milestone] Projeto 7 · Passo 1: o checklist na sua tela

Cada pessoa, na própria tela e no próprio celular:

:::steps
1. `git switch main`, `git pull` e `npx expo start -c`
2. Abra o [Checklist de qualidade](materiais/projeto-7/checklist-de-qualidade.html) e escreva no topo a sua tela e o seu componente
3. Item por item, faça o "Como conferir" no celular
4. No terminal, as três buscas copiadas da página: cor solta (`#222`), medida solta (`fontSize: 24`) e "Em construção"
5. Anote numa folha o número de cada item que falhou e o que aconteceu
:::

**Pronto quando:** os nove itens foram conferidos na sua tela, e você tem a lista do que falhou, mesmo que vazia.

---

## :icon[milestone] Projeto 7 · Sua vez: o que o checklist pegou

Sozinho, na sua tela:

1. `git switch -c qualidade-` e o nome da tela, como `qualidade-lancamentos`
2. Corrija o que falhou, com o "Se falhar" da página
3. Com os nove passando, o print da tela em `docs/`, num nome sem acento nem espaço: `docs/lancamentos.png`. Avise quem cuida do README
4. Commit, `git push -u origin` e a branch, pull request; um colega revisa no celular; merge

:::tip Dicas
- Print: no Android, ligar e baixar o volume; no iPhone, lateral e aumentar o volume
- Nada falhou? A branch leva só o print
:::

**Pronto quando:** o pull request está na `main`, com as correções e o print, e o checklist da tela, todo marcado.

---

## O app instalado

Como o app chega ao celular da sua tia, com o seu computador desligado?

---

## :icon[smartphone] Expo Go e APK: de onde vem o app

No **Expo Go**, o app vem do seu computador toda vez que abre: o `npx expo start` entrega o código pelo Wi-Fi. Desligou o computador, o app não abre.

O **APK** é o **instalador** do app, como o instalador de um programa no computador: um arquivo que você baixa e instala uma vez. Depois, o app **mora** no celular, como no E29: tem ícone e nome próprios e abre sem o computador e sem o Expo Go.

:::center
![Diagrama: no Expo Go, o código vem do computador pelo Wi-Fi e, sem o computador, o app não abre; no APK instalado, o código está dentro do celular e o app abre sem o computador](images/e44-expo-go-x-apk-instalado.svg)
:::

---

## :icon[smartphone] Expo Go e APK na prática

| | Expo Go | APK instalado |
|---|---|---|
| o código vem | do computador | de dentro do celular |
| ícone e nome | os do Expo Go | os do `app.json` |
| serve para | programar | testar e mostrar |

Na loja, a Google Play, publicar pede conta paga (US$ 25, uma vez): fica para depois do curso.

:::example Pergunta rápida
A equipe corrigiu um texto na `main` depois do build. No APK da tia, aparece o texto novo?
:::

:::tip Resposta
Não: o APK é uma foto do app na hora do build. O texto novo aparece no Expo Go; no APK, só com outro build. Por isso o checklist vem antes.
:::

---

## Build na nuvem

Para imprimir 100 convites de aniversário, você usa a impressora de casa ou leva à gráfica?

---

## :icon[cloud] EAS Build: a gráfica do app

O **build** empacota o app no instalador; no seu computador, pediria programas pesados. O **EAS Build** (*Expo Application Services*) faz o build nos computadores do Expo, pela internet. É a **gráfica**: você manda o arquivo, ela imprime e avisa quando fica pronto. Como toda gráfica:

- **Tem fila.** Na conta gratuita, de poucos minutos a mais de uma hora e meia nos horários de pico; depois, uns 10 a 20 minutos de build
- **Tem limite.** 15 builds de Android por mês, de até 45 minutos cada
- **O pedido fica no nome de quem encomendou.** Os próximos builds, só quem fez o primeiro
- **Revise antes de mandar.** O erro que vai para a gráfica volta para a fila

---

## :icon[cloud] O build na prática

**Caso 1: a fila.** O terminal mostra `Waiting in Free tier queue` e a posição. Pode fechar o terminal: o build continua, e a página dele fica no expo.dev, na conta de quem rodou.

**Caso 2: o pedido no nome da Ana.** A Ana fez o primeiro build: o projeto é o `@ana-souza/gasto-certo`, e o `app.json` ganhou o número dele, o `projectId`. Na conta do Bruno, o EAS recusa o próximo.

**Caso 3: o link do fim.** O build termina com o link da página dele, que tem o botão de instalar. A página fica na conta da Ana, e o arquivo não fica lá para sempre: o APK vai para o GitHub, numa Release.

---

## :icon[id-card] O app.json: o nome e o android.package

Antes do build, o app ganha nome no `app.json`, a identidade do app (E29):

| Campo | No kit | No Gasto Certo |
|---|---|---|
| `name` | `Nome do app` | `Gasto Certo`: o nome embaixo do ícone |
| `slug` | `nome-do-app` | `gasto-certo`: o nome do projeto no expo.dev |
| `scheme` | `nomedoapp` | `gastocerto`: o começo do link que abre o app |
| `android.package` | não tem | `com.anasouza.gastocerto` |

O **`android.package`** é o nome único do app no Android, como um CPF: dois apps com o mesmo não ficam juntos no celular. Partes separadas por ponto, cada uma começando com letra; só minúsculas e números, sem hífen, espaço nem acento. Dentro de `"android"`:

```json
    "android": {
      "package": "com.anasouza.gastocerto",
      "adaptiveIcon": {
```

---

## :icon[file-code] O eas.json em português

Na raiz do projeto, ao lado do `app.json`, crie o `eas.json`: ele diz ao EAS como fazer o build.

```json
{
  "cli": {
    "version": ">= 16.0.0",
    "appVersionSource": "remote"
  },
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

| Parte | O que ela diz |
|---|---|
| `"preview"` | "o nome do **perfil**, um jeito de fazer o build: este é o de teste" |
| `"distribution": "internal"` | "para instalar direto no celular, sem a loja" |
| `"buildType": "apk"` | "gere o APK"; sem isso, sai um AAB, que só a loja instala |
| `"appVersionSource": "remote"` | "o número da versão fica guardado no Expo"; sem isso, o EAS avisa |
| `"version": ">= 16.0.0"` | "o `eas-cli` precisa ser da versão 16 ou mais nova" |

---

## :icon[milestone] Projeto 7 · Passo 2: o APK com o EAS

Quem cuida da publicação faz, com as correções do checklist já na `main`:

:::steps
1. `git switch main`, `git pull` e `git switch -c apk`
2. No `app.json`, os quatro campos; na raiz, o `eas.json`
3. Commit (`Dá nome ao app e cria o eas.json`) e `git push -u origin apk`
4. `npx eas-cli@latest login`: entre no navegador com a conta do E29
5. `npx eas-cli@latest build -p android --profile preview` e as respostas do terminal
6. Com o build na fila, commit do `app.json`, que ganhou o `projectId`, push e pull request
:::

**Pronto quando:** o terminal mostra `Waiting in Free tier queue`, e a página do build aparece no expo.dev.

---

## :icon[square-terminal] O que o terminal pergunta

O `npx` (E12) roda o **`eas-cli`**, o programa do EAS, e o `@latest` pede a versão mais nova. O `-p android` escolhe o Android, e `--profile preview`, o perfil.

| O terminal mostra | O que fazer |
|---|---|
| `Would you like to automatically create an EAS project for @ana-souza/gasto-certo?` | `Y`: grava o `projectId` |
| `Generate a new Android Keystore?` | `Y`: o Expo guarda a **chave** que assina o app |
| `Waiting in Free tier queue` | esperar; fechar o terminal não cancela |
| `Build finished`, um QR code e um link | abrir o link no Android |
| `Install and run the Android build on an emulator?` | `n`: **emulador** é celular de mentira |

---

## README de portfólio

Uma recrutadora tem 40 currículos e 30 segundos para olhar o seu GitHub. O que ela precisa ver?

---

## :icon[file-text] README de portfólio: para quem nunca viu o app

O README é o manual que vem na caixa (E05). O **README de portfólio** é para quem nunca viu o app, como a recrutadora, na ordem das perguntas dela:

| Seção | Responde |
|---|---|
| título, frase e um print | o que é? |
| O problema | para quem, e por quê? |
| O que o app faz, com os prints | funciona? |
| Instale no Android; Como rodar o código | dá para testar? |
| Equipe; Feito com; Fora desta versão | quem fez o quê? |

O **portfólio** é o álbum de cortes do cabeleireiro: o cliente vê o que ele já fez antes de sentar.

---

## :icon[file-text] O README na prática: o topo

O topo do README do Gasto Certo. Quem lê só isto já sabe o que o app é, para quem e como ele fica:

```markdown
# Gasto Certo

App de celular para lançar um gasto em segundos, na fila do caixa, e saber para onde foi o dinheiro do mês.
Projeto integrador do curso Programador Mobile, feito em equipe com Expo e React Native.

![Início no tema claro](docs/inicio-claro.png)

## O problema

Quem está no primeiro emprego ou estágio chega ao fim do mês sem saber para onde foi o dinheiro.
Anota no caderno ou numa planilha e desiste na segunda semana.
```

- A frase do topo diz **o que é** e **para quem**
- O problema é uma situação de verdade, do briefing, e não "facilitar a vida das pessoas"
- Os `#`, os `##` e a imagem são os do E05 e do E12

---

## :icon[file-text] O README na prática: tabela e link

Duas marcas novas do Markdown: a **tabela**, para os prints ficarem lado a lado, e o **link**, para a versão com o APK.

```markdown
| Início | Lançamentos | Novo lançamento |
|---|---|---|
| ![Saldo, entradas e saídas](docs/inicio-claro.png) | ![Lista de lançamentos](docs/lancamentos.png) | ![Formulário com os erros embaixo de cada campo](docs/novo-erros.png) |

## Instale no Android

Baixe o APK na página da versão: [Gasto Certo v1.0.0](https://github.com/ana-souza/gasto-certo/releases/tag/v1.0.0).
No celular, abra o arquivo e permita instalar apps desta fonte.

## Equipe

| Pessoa | O que fez |
|---|---|
| Ana Souza ([@ana-souza](https://github.com/ana-souza)) | tela Início e o componente CartaoSaldo; o build do APK |
```

- **Tabela:** cada linha entre barras verticais; a segunda linha, com os tracinhos, separa o cabeçalho
- **Link:** o texto entre colchetes vira um link para o endereço entre parênteses
- **Equipe:** cada pessoa com a sua tela, o seu componente e a sua tarefa. É o que a entrevista pergunta: "o que você fez?"

---

## :icon[milestone] Projeto 7 · Passo 3: o README de portfólio

Quem cuida do README, com o build na fila:

:::steps
1. `git switch main`, `git pull` (os prints chegam em `docs/`) e `git switch -c readme`
2. No `README.md`, no lugar do texto do kit: título e frase, O problema, O que o app faz (com os prints), Instale no Android, Como rodar o código, Equipe, Feito com, Fora desta versão
3. Como rodar: `npm install`, `npx expo start` e o Expo Go (SDK 58). Fora desta versão: as histórias que ficaram de fora
4. Prévia com <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>V</kbd>; commit, push e pull request
:::

**Pronto quando:** a prévia mostra os prints e a tabela da equipe; o pull request espera a `v1.0.0`, do passo 4.

---

## Release do GitHub

Como alguém que não programa baixa o app de vocês daqui a seis meses?

---

## :icon[tag] Release: a versão com o APK

Cada commit é uma foto do projeto, com legenda (E05). Uma **tag** é uma etiqueta colada numa dessas fotos: `v1.0.0`, a versão 1.0.0. A **Release** é a página dessa versão no GitHub, com arquivos para baixar: o `.apk` vai anexado nela.

Por que não mandar o link do expo.dev? Ele fica na conta de uma pessoa, e o arquivo não fica lá para sempre. A Release fica no repositório da equipe, ao lado do código, e o link no README não muda.

O número tem três partes, como as versões dos pacotes do E04: **principal.novidade.correção**. A primeira versão que vai para o mundo é a `1.0.0`, a mesma `version` do `app.json`.

---

## :icon[tag] A Release na prática

**Caso 1: o link antes da versão.** O endereço é sempre o do repositório, mais `releases/tag/` e a tag:

```plaintext
https://github.com/ana-souza/gasto-certo/releases/tag/v1.0.0
```

Por isso ele já vai no README: abre assim que a versão for publicada.

**Caso 2: a próxima versão.** Depois da banca, a equipe corrige um defeito: build novo e Release `v1.0.1`. Uma novidade, como a troca de mês: `v1.1.0`.

**Caso 3: quem tem iPhone.** O APK é só para Android. No iPhone, o app abre pelo Expo Go, como sempre. Na banca, a equipe mostra num Android ou no Expo Go.

---

## :icon[milestone] Projeto 7 · Passo 4: o APK no celular e a v1.0.0

Com o `Build finished`, num Android:

:::steps
1. Abra o link (ou o QR code) do build e toque em **Install**
2. Permita instalar apps desta fonte; se o Play Protect, a proteção do Android, avisar, confirme
3. Abra pelo ícone, sem o Expo Go
4. Quem publica baixa o `.apk` no computador
5. No GitHub: **Releases**, **Create a new release**, **Choose a tag**, `v1.0.0`, **Create new tag**; título "Gasto Certo v1.0.0"
6. Arraste o `.apk` para os anexos e **Publish release**
7. Quem revisa a `readme` confere o link e aprova; merge
:::

**Pronto quando:** o app abre pelo ícone, e o link do README mostra a `v1.0.0` com o `.apk`.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Invalid format of Android applicationId` | `android.package` com hífen, acento ou número depois do ponto | um válido, como `com.anasouza.gastocerto` |
| `does not match the "slug" field` | o `slug` mudou depois do primeiro build | voltar o `slug` antigo |
| `Build concurrency limit reached` | outro build da conta na fila | esperar |
| `Build failed` | quebrou no servidor | ler os logs da página do build |
| "App não instalado", no Android | outro app com o mesmo `android.package` | desinstalar o antigo |
| `Waiting in Free tier queue`, demorando | a fila gratuita | não cancelar; seguir com o README |

---

## :icon[milestone] Projeto 7 · Etapa 4 pronta

- :icon[clipboard-check] o checklist marcado em todas as telas, cada correção por pull request
- :icon[package] o APK instalado em pelo menos um Android da equipe, abrindo sem o Expo Go
- :icon[tag] a versão `v1.0.0` em **Releases**, com o `.apk`
- :icon[file-text] o README com os prints, o link da `v1.0.0` e quem fez o quê
- :icon[git-merge] as branches `qualidade-`, `apk` e `readme` juntadas na `main`

Depois do último merge, todos: `git switch main` e `git pull`.

O build não saiu da fila até o fim da aula? Quem cuida da publicação faz o passo 4 em casa, e a equipe revisa e junta a `readme` pelo GitHub, antes do E45.

---

## Resumo

:::summary
- O checklist confere nove itens em cada tela antes de entregar; o que falha vira uma correção por pull request
- No Expo Go, o app vem do computador; o APK é o instalador, e o app instalado abre sozinho, só no Android
- O EAS Build é a gráfica: faz o build na nuvem, com fila e limite, na conta de quem fez o primeiro
- O `eas.json` com o perfil `preview` e `"buildType": "apk"` gera o APK; o `android.package` é o nome único do app
- A Release `v1.0.0` guarda o APK no GitHub; o README de portfólio mostra o problema, os prints, como instalar e quem fez o quê
:::

---

## :icon[arrow-right] Próximos passos

No E45, a banca: cada equipe apresenta o app em até 6 minutos, e o curso fecha com a carreira mobile.

- :icon[timer] o problema, o caminho principal no celular e como a equipe trabalhou
- :icon[play] o plano B: um vídeo de 1 minuto do caminho principal, gravado do celular antes do encontro (Android: Gravador de tela, no painel rápido; iPhone: Gravação de Tela, na Central de Controle)
- :icon[briefcase] o que vem depois do curso: vagas, portfólio e próximos estudos
