---
title: Git e GitHub
summary: O Racha-conta ganha um álbum de fotos com os commits, vai para o GitHub com git push e ganha um README.
module: ambiente-js
duration_minutes: 90
objectives:
  - Criar o repositório do Racha-conta e deixar o node_modules de fora com o .gitignore
  - Tirar as fotos do projeto com git add e git commit e ler o histórico
  - Enviar o projeto ao GitHub com git remote add e git push
  - Escrever o README em Markdown, com título, parágrafo, lista e bloco de código
---

# Git e GitHub

Programador Mobile · Encontro E05 · Aula 5 de 45

---

## O que você vai aprender

:::goal
- Dar ao Racha-conta um álbum de fotos: o repositório
- Deixar o `node_modules` fora das fotos
- Tirar a foto de cada etapa, o commit, com uma legenda
- Mandar o projeto para o GitHub e ver o histórico lá
- Escrever o README, o manual do projeto
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **repositório** | a pasta do projeto com um álbum de fotos dentro: a história de tudo o que mudou |
| **commit** | uma foto do projeto naquele momento, com uma legenda dizendo o que mudou |
| **`.gitignore`** | a lista do que fica fora das fotos |
| **GitHub** | o site que guarda o álbum na nuvem; você criou a conta no E01 |
| **push** | mandar as fotos do seu computador para o GitHub |
| **README** | o manual do projeto: o que ele faz e como rodar |

---

## O Racha-conta só existe aqui

O Racha-conta do E04 mora numa pasta deste computador, e só nela. Se a máquina for formatada no fim de semana, a etapa 1 some. E quem abre a pasta não sabe o que ele faz nem como rodar.

| Hoje | No fim do encontro |
|---|---|
| uma pasta, sem história | uma foto de cada etapa, com legenda |
| só neste computador | em `github.com/seu-usuario/racha-conta` |
| nenhuma explicação | um README com o que ele faz e como rodar |

:::question
Você já perdeu um trabalho que estava num computador só? O que teria salvado?
:::

---

## :icon[milestone] Projeto 1 · Passo 1: quem tira as fotos

Toda foto do Git leva a assinatura de quem tirou: o nome e o e-mail gravados no E01. No terminal do VS Code, confira:

```bash
git config --global user.name
# Ana Souza
git config --global user.email
# ana@exemplo.com
```

Veio vazio, ou com o nome de outra pessoa? Grave os seus, entre aspas. O `--global` vale para o computador todo, e a terceira linha diz que a linha principal do histórico se chama `main`:

```bash
git config --global user.name "Ana Souza"
git config --global user.email "ana@exemplo.com"
git config --global init.defaultBranch main
```

O e-mail é **o mesmo da conta do GitHub**: é ele que liga as fotos ao seu perfil.

**Pronto quando:** os dois primeiros comandos mostram o **seu** nome e o **seu** e-mail.

---

## O repositório

Onde você guarda as fotos de uma viagem para achar depois?

---

## :icon[folder-open] Repositório: o álbum do projeto

Um **repositório** é a pasta do projeto com um álbum de fotos dentro. Cada foto guarda como todos os arquivos estavam naquele momento. Quem cria o álbum é o **`git init`**, uma vez por projeto, na pasta raiz:

```bash
git init
git status
```

```plaintext
Initialized empty Git repository in C:/Users/Ana/projetos/racha-conta/.git/
On branch main

No commits yet

Untracked files:
	node_modules/
	package-lock.json
	package.json
	src/
```

- `git init` cria a pasta oculta **`.git`**, onde mora o álbum. Não mexa nela
- **`git status`** é o painel do Git: mostra o que mudou desde a última foto
- *On branch main*: você está na `main`, a linha principal do histórico
- *No commits yet*: nenhuma foto ainda. *Untracked files*: arquivos que o Git vê, mas ainda não acompanha

---

## :icon[folder-open] O repositório na prática

**Caso 1: o terminal fora do projeto.** Ali não há álbum, e o Git avisa:

```plaintext
fatal: not a git repository (or any of the parent directories): .git
```

Quer dizer "aqui não é um repositório, nem nas pastas de fora". Olhe o caminho do terminal e entre com `cd racha-conta`.

**Caso 2: o `git init` duas vezes.** Não estraga nada: o álbum já existia.

```plaintext
Reinitialized existing Git repository in C:/Users/Ana/projetos/racha-conta/.git/
```

**Caso 3: o `git init` na pasta de fora.** O `git status` lista as pastas dos projetos, e não os arquivos:

```plaintext
Untracked files:
	lojinha-regras/
	racha-conta/
```

O álbum nasceu na pasta de projetos. Peça ajuda para apagar a pasta oculta `.git` de lá antes de seguir: cada projeto tem o seu álbum, dentro da pasta dele.

---

## O .gitignore

Na foto do quarto que você manda para alguém, o que fica fora?

---

## :icon[eye-off] .gitignore: o que fica fora da foto

O **`.gitignore`** é a lista do que o Git não fotografa, um nome por linha. No Racha-conta, a lista tem uma linha só:

```plaintext
node_modules/
```

A barra no fim quer dizer "a pasta". O `node_modules` fica fora porque é grande e o `npm install` refaz, como no E04.

| Arquivo ou pasta | Entra nas fotos? |
|---|---|
| `src/`, com o código e a conta | sim |
| `package.json` e `package-lock.json` | sim: a ficha e a nota fiscal |
| `node_modules/` | não: o `npm install` refaz |

:::warning
Nome exato: **`.gitignore`**, com ponto no começo e sem extensão, na raiz, ao lado do `package.json`. Com outro nome (`gitignore.txt`), o Git não lê a lista.
:::

---

## :icon[milestone] Projeto 1 · Passo 2: o álbum e o .gitignore

:::steps
1. Confira que o terminal termina em `racha-conta`
2. `git init` e `git status`: o `node_modules/` está na lista
3. No painel do VS Code, na raiz, crie o arquivo `.gitignore` com a linha `node_modules/` e salve
4. Rode `git status` de novo
:::

**Pronto quando** o `node_modules/` sai da lista e o `.gitignore` entra:

```plaintext
On branch main

No commits yet

Untracked files:
	.gitignore
	package-lock.json
	package.json
	src/
```

No painel do VS Code, a pasta `node_modules` fica cinza: é o sinal de que o Git não olha para ela.

---

## Commits

Numa foto de grupo, o que acontece antes do clique?

---

## :icon[git-commit-horizontal] Commit: a foto com legenda

Um **commit** é uma foto do projeto naquele momento, com uma legenda que diz o que mudou. Ele se faz em dois passos, como a foto de grupo: primeiro você chama quem vai sair na foto, depois clica.

```bash
git add .
git commit -m "Projeto 1: etapa 1, a conta no terminal"
```

- **`git add .`** chama para a foto tudo o que mudou. Quem foi chamado espera na **área de preparação**. O `.` é a pasta em que você está, como no `code .`
- **`git commit -m "..."`** clica e grava a legenda, entre aspas. O `-m` vem de *message*, mensagem
- A foto fica no álbum **do seu computador**. O GitHub ainda não sabe dela

---

## :icon[list-ordered] O commit em português

O `git commit` responde assim:

```plaintext
[main (root-commit) 801afb4] Projeto 1: etapa 1, a conta no terminal
 5 files changed, 67 insertions(+)
 create mode 100644 .gitignore
 create mode 100644 package-lock.json
 create mode 100644 package.json
 create mode 100644 src/data/conta.json
 create mode 100644 src/scripts/racha.js
```

| A resposta tem | O que ela diz |
|---|---|
| `main` | a foto entrou na `main`, a linha principal do histórico |
| `root-commit` | é a primeira foto do álbum |
| `801afb4` | o código da foto; o seu é outro |
| `5 files changed, 67 insertions(+)` | 5 arquivos entraram na foto, com 67 linhas novas |
| `create mode 100644 .gitignore` | um arquivo novo no álbum; o número é o tipo do arquivo |

Para ver o álbum, **`git log --oneline`**: uma foto por linha, a mais nova em cima.

---

## :icon[git-commit-horizontal] Commits na prática

O `git status` separa os arquivos em grupos. O README mudou, e o `git add` ainda não rodou:

```plaintext
Changes not staged for commit:
	modified:   README.md
```

| O `git status` mostra | Quer dizer | Para entrar na foto |
|---|---|---|
| `Untracked files` | arquivo novo, que o Git não acompanha | `git add` |
| `Changes not staged for commit` | mudou (`modified`), mas não foi chamado | `git add` |
| `Changes to be committed` | já foi chamado para a foto | nada: entra no próximo commit |
| `nothing to commit, working tree clean` | nada mudou desde a última foto | nada |

O commit grava **só** o grupo `Changes to be committed`. O que não passou pelo `git add` fica fora da foto.

---

## :icon[milestone] Projeto 1 · Passo 3: a foto da etapa 1

A primeira foto é a da etapa 1: o código está como o E04 deixou.

```bash
git add .
git commit -m "Projeto 1: etapa 1, a conta no terminal"
git log --oneline
```

```plaintext
warning: in the working copy of 'package-lock.json', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'package.json', LF will be replaced by CRLF the next time Git touches it
[main (root-commit) 801afb4] Projeto 1: etapa 1, a conta no terminal
 5 files changed, 67 insertions(+)
 (as cinco linhas create mode)
801afb4 (HEAD -> main) Projeto 1: etapa 1, a conta no terminal
```

- O `warning: ... LF will be replaced by CRLF` é um aviso do Windows sobre o fim das linhas dos arquivos que o npm escreveu. Não é erro: siga
- **`HEAD -> main`** quer dizer "você está aqui"

**Pronto quando:** o `git log --oneline` mostra uma linha, com a legenda da etapa 1, e um `git status` responde `nothing to commit, working tree clean`.

---

## GitHub e push

Se o seu celular cair na água hoje, o que acontece com as fotos?

---

## :icon[globe] GitHub: o álbum na nuvem

O **GitHub** guarda o álbum na nuvem, como o backup de fotos do celular, da aula 2. Se o computador quebrar, as fotos continuam lá. A cópia do álbum que fica no GitHub se chama **repositório remoto**: remoto quer dizer longe de você.

Cada repositório tem um endereço com o seu usuário:

```plaintext
https://github.com/ana-souza/racha-conta
```

- **Público** (*Public*): qualquer pessoa vê. É o seu portfólio, e é pelo link que o instrutor corrige o projeto
- O repositório do Racha-conta nasce **vazio** no GitHub: as fotos vão do seu computador para lá

---

## :icon[cloud-upload] Push: mandar a sua cópia para a nuvem

O **push** (empurrar, em inglês) manda as fotos do álbum do seu computador para o GitHub. Só vai o que já virou foto: o que mudou e não teve commit fica para trás.

:::center
![Diagrama: git add leva a mudança da pasta do projeto para a área de preparação, git commit grava a foto no álbum do computador e git push envia as fotos ao GitHub, na nuvem](images/e05-fluxo-git.svg)
:::

---

## :icon[list-ordered] Os três comandos em português

Quando o repositório nasce vazio, o GitHub mostra três comandos. Eles ligam o seu álbum ao do GitHub e fazem o primeiro push:

```bash
git remote add origin https://github.com/ana-souza/racha-conta.git
git branch -M main
git push -u origin main
```

| Linha | O que ela diz |
|---|---|
| `git remote add origin https://...` | "guarde o endereço do GitHub com o apelido `origin`" |
| `git branch -M main` | "a linha principal se chama `main`". Para quem gravou o `main` no Passo 1 ou no E01, não muda nada |
| `git push -u origin main` | "mande as fotos da `main` para o `origin`". O `-u` grava o destino: dali em diante, o comando é só `git push` |

---

## :icon[user-check] O login no primeiro push

No primeiro push, o GitHub confere que a conta é sua. No Windows, abre a janela **Connect to GitHub** (conectar ao GitHub):

:::steps
1. Clique em **Sign in with your browser** (entrar pelo navegador)
2. No navegador, entre com o seu usuário e a sua senha do GitHub
3. Pediu um código? É o do app da verificação em duas etapas, ou o que o GitHub mandou para o seu e-mail
4. Autorize o **Git Credential Manager**, no botão verde
5. Feche a aba e volte ao VS Code: o push continua sozinho
:::

O computador guarda o acesso. Nos próximos push, ele não pergunta de novo.

---

## :icon[milestone] Projeto 1 · Passo 4: o Racha-conta no GitHub

:::steps
1. No github.com, botão **+** no alto, à direita, **New repository**
2. Nome: `racha-conta`. Visibilidade: **Public**. README, `.gitignore` e licença: deixe tudo desligado
3. **Create repository**. Copie as três linhas de *…or push an existing repository from the command line* (enviar um repositório que já existe)
4. Cole no terminal, na pasta `racha-conta`, aperte <kbd>Enter</kbd> e faça o login
:::

```plaintext
To https://github.com/ana-souza/racha-conta.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.
```

- `[new branch] main -> main`: a `main` chegou ao GitHub pela primeira vez. `set up to track`: o `-u` gravou o destino
- Antes, aparecem linhas de contagem (`Enumerating objects...`), com números que mudam de computador para computador

**Pronto quando:** recarregada, a página do repositório mostra `src`, `.gitignore`, `package-lock.json` e `package.json`, sem `node_modules`.

---

## O README

Comprou um aparelho novo. Onde você descobre como ligar?

---

## :icon[file-text] README: o manual do projeto

O **README** (*leia-me*) é o manual que vem na caixa: diz o que o projeto faz e como usar. O GitHub mostra o `README.md` embaixo da lista de arquivos.

O `.md` quer dizer **Markdown**: texto com algumas marcas, que o GitHub transforma em página. Como no WhatsApp, onde asteriscos deixam a palavra em negrito.

| Você escreve | O GitHub mostra |
|---|---|
| `# racha-conta` | o título da página, grande |
| `## Como rodar` | o título de uma seção, menor |
| uma frase entre linhas em branco | um parágrafo |
| `- npm install` | um item de lista, com bolinha |
| três crases com `bash`, o código, três crases | um bloco de código |

---

## :icon[file-text] Markdown na prática

**Caso 1: o bloco de código.** Abre com três crases e o nome da linguagem (`bash` para comandos do terminal), fecha com três crases:

~~~markdown
```bash
npm install
npm run racha
```
~~~

No teclado ABNT2, a crase é <kbd>Shift</kbd> + a tecla do acento agudo, à direita do P, e depois espaço. Com o acento agudo (`´´´`), o bloco não aparece.

**Caso 2: o espaço e a linha em branco.** `#racha-conta`, sem espaço depois do `#`, sai como texto comum. Duas frases em linhas seguidas viram um parágrafo só: é a linha em branco que separa.

**Caso 3: a prévia.** <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>V</kbd> mostra, no VS Code, o README como o GitHub vai mostrar.

---

## :icon[milestone] Projeto 1 · Passo 5: o README e a foto da etapa 2

Na raiz, crie o `README.md` e confira na prévia:

 ~~~markdown
 # racha-conta

 Divide a conta do restaurante entre as pessoas da mesa, sem perder nenhum centavo.

 ## Como rodar

 ```bash
 npm install
 npm run racha
 ```
 ~~~

Depois, a foto e o push, agora sem o `-u`:

```bash
git add .
git commit -m "Projeto 1: etapa 2, GitHub e README"
git push
```

**Pronto quando:** o push termina com `801afb4..8505def  main -> main` (a `main` do GitHub andou da foto da etapa 1 para a da etapa 2; os seus códigos são outros), e a página do repositório mostra o README embaixo dos arquivos, com o título e o bloco de código.

---

## O histórico

No álbum do celular, como você acha a foto de um dia específico?

---

## :icon[history] O histórico: no terminal e no site

O **histórico** é o álbum inteiro, da foto mais nova para a mais velha. No terminal, `git log --oneline`:

```plaintext
8505def (HEAD -> main, origin/main) Projeto 1: etapa 2, GitHub e README
801afb4 Projeto 1: etapa 1, a conta no terminal
```

- Uma foto por linha: o código e a legenda. A mais nova fica em cima
- **`HEAD -> main`**: você está aqui
- **`origin/main`**: a foto mais nova que o GitHub tem. Na mesma linha do `HEAD`, tudo já foi enviado

No site, o link **Commits**, com um relógio, fica acima da lista de arquivos. Ele mostra as mesmas fotos, com a data e quem tirou. Clique numa delas para ver o que mudou: as linhas novas aparecem em verde, com `+`.

---

## :icon[history] O histórico na prática

**Caso 1: a foto que não subiu.** Você fez o commit e esqueceu o push:

```plaintext
3889264 (HEAD -> main) Corrige a frase do README
8505def (origin/main) Projeto 1: etapa 2, GitHub e README
```

O `origin/main` ficou uma linha abaixo: o GitHub ainda não tem a foto de cima. O `git status` também avisa: `Your branch is ahead of 'origin/main' by 1 commit` (à frente do GitHub por 1 foto). O que falta é o `git push`.

**Caso 2: a legenda conta a história.** Quem abre o álbum daqui a um mês lê só as legendas:

| Legenda ruim | Legenda boa |
|---|---|
| `ajustes` | `Corrige a frase do README` |
| `aaa` | `Cria o .gitignore` |
| `final agora vai` | `Projeto 1: etapa 2, GitHub e README` |

---

## :icon[milestone] Projeto 1 · Sua vez: o que ele mostra

Agora, sozinho. No README, depois de "Como rodar", a seção **`## O que ele mostra`**, com a saída do `npm run racha` num bloco de código. Depois, uma foto com uma legenda que diga o que mudou, o push e, no GitHub, o histórico.

:::tip Dicas
- Para copiar: selecione com o mouse, de `Racha-conta:` até a última linha, e aperte <kbd>Ctrl</kbd> + <kbd>C</kbd>
- O bloco abre com três crases e `plaintext` (texto comum, sem cores) e fecha com três crases
- O histórico fica no link **Commits**, com o relógio, acima dos arquivos
:::

**Pronto quando:** o README no GitHub mostra a tabela dos itens dentro do bloco, e o histórico tem 3 commits.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `fatal: not a git repository` | fora do projeto, ou sem `git init` | `cd racha-conta`; `git init` |
| `Author identity unknown` | o Git não sabe quem você é | Passo 1 |
| `nothing added to commit` | nada chamado para a foto | `git add .` antes |
| `src refspec main does not match any` | push antes da primeira foto | commit antes do push |
| `remote origin already exists` | o `remote add` rodou duas vezes | seguir: o endereço já existe |
| `[rejected]` e `fetch first` | repositório criado com README | apagar (**Settings**, no fim) e criar vazio |

---

## :icon[milestone] Projeto 1 · Etapa 2 pronta

Em `github.com/seu-usuario/racha-conta`:

- o repositório é **público** e mostra `src`, `.gitignore`, `package-lock.json`, `package.json` e `README.md`, **sem** `node_modules`
- o README tem as seções "Como rodar" e "O que ele mostra"
- o histórico tem 3 fotos: a da etapa 1, a da etapa 2 e a da Sua vez
- o código não mudou: `npm run racha` mostra o mesmo do E04

Do E06 em diante, toda etapa termina assim: `git add .`, `git commit -m "Projeto 1: etapa N, nome"` e `git push`. Faltou algo? Termine em casa, com commit e push.

:::warning
Computador do laboratório: ao terminar, saia da sua conta no navegador e rode `git credential-manager github logout seu-usuario`. Assim, ninguém envia nada em seu nome.
:::

---

## Resumo

:::summary
- `git init` cria o repositório, o álbum do projeto; `git status` mostra o que mudou desde a última foto
- O `.gitignore` deixa o `node_modules/` fora das fotos: o `npm install` refaz
- `git add .` chama para a foto e `git commit -m "legenda"` tira a foto, no seu computador
- `git remote add origin` guarda o endereço do GitHub; `git push -u origin main` manda as fotos, e depois é só `git push`
- O README é o manual do projeto, em Markdown: `#` título, `##` seção, `-` lista e três crases para o código
- `git log --oneline` e o link Commits mostram o histórico, da foto mais nova para a mais velha
:::

---

## :icon[arrow-right] Próximos passos

No E06, o Racha-conta faz contas com dinheiro:

- :icon[calculator] o subtotal, a gorjeta e o total em **centavos**, sem o erro do `0.1 + 0.2`
- :icon[git-commit-horizontal] a etapa 3 termina com commit e push, como a de hoje
