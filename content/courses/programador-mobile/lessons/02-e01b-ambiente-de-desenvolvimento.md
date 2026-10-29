---
title: "Ambiente de desenvolvimento: Node.js, VS Code, Git e GitHub"
summary: As ferramentas que você instala hoje, os primeiros comandos no terminal e as versões conferidas para começar o E02.
module: ambiente-js
duration_minutes: 40
objectives:
  - Explicar para que servem Node.js, npm, VS Code, Git e GitHub
  - Usar os comandos básicos do terminal
  - Conferir cada instalação pela versão no terminal
  - Configurar o nome e o e-mail do Git e criar a conta no GitHub
---

# Ambiente de desenvolvimento: Node.js, VS Code, Git e GitHub

Programador Mobile · Encontro E01 · Aula 2 de 89

---

## O que você vai aprender

:::goal
- Para que serve cada ferramenta: Node.js, npm, VS Code, Git e GitHub
- Abrir o terminal e usar cinco comandos que resolvem o dia a dia
- Conferir cada instalação pela versão
- Configurar o Git e criar a sua conta no GitHub
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **terminal** | uma janela onde você conversa com o computador por escrito: digita um comando e lê a resposta |
| **comando** | uma ordem escrita para o computador, como `mkdir projetos`: "crie a pasta projetos" |
| **versão** | o número que diz qual edição de um programa está instalada, como `v24.11.1` |
| **extensão** | um complemento que dá uma função nova ao VS Code, como um app que você instala no celular |
| **commit** | uma foto do projeto num momento, com uma legenda dizendo o que mudou |
| **repositório** | a pasta de um projeto com todas as fotos dele: o álbum do projeto |

---

## Por que tantas ferramentas?

Na aula 1, o JavaScript rodou no Console do navegador. Para escrever programas de verdade, guardados em arquivos e executados no seu computador, cinco perguntas aparecem antes da primeira linha de código:

- Onde você digita os comandos? **Terminal**
- Quem roda o JavaScript fora do navegador? **Node.js**
- De onde vem o código pronto, feito por outras pessoas? **npm**
- Onde você escreve o código? **VS Code**
- Como não perder o trabalho de ontem? **Git** e **GitHub**

:::info
Hoje você instala e confere cada uma. Do E02 em diante, elas viram rotina.
:::

---

## O terminal

Dá para usar o computador sem mouse, só escrevendo?

---

## :icon[square-terminal] Terminal: onde você digita comandos

O **terminal** é uma conversa por escrito com o computador: você digita um **comando**, aperta <kbd>Enter</kbd> e lê a resposta. Sem botões: só texto.

| Sistema | Como abrir |
|---|---|
| Windows | <kbd>Win</kbd> + <kbd>X</kbd> e escolha **Terminal** |
| macOS | <kbd>Cmd</kbd> + <kbd>Espaço</kbd> e digite "Terminal" |
| Linux | <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>T</kbd> |
| VS Code | ``Ctrl + ` `` (crase) abre um terminal dentro do editor |

```bash
echo oi
# oi
```

O `echo` repete o que vem depois dele: é o jeito mais simples de ver o terminal responder. O texto antes do cursor, o **prompt**, mostra a pasta em que você está, como o "você está aqui" de um mapa. Todo comando vale para essa pasta.

---

## :icon[terminal] Terminal: 5 comandos do dia a dia

| Comando | O que faz |
|---|---|
| `cd pasta` | entra na pasta (*change directory*, mudar de pasta); `cd ..` volta uma |
| `ls` | lista o que há na pasta atual (*list*, listar); no Prompt de Comando do Windows, `dir` |
| `mkdir nome` | cria uma pasta (*make directory*, criar pasta) |
| `code .` | abre a pasta atual no VS Code; o ponto quer dizer "esta pasta" |
| `clear` | limpa a tela |

```bash
mkdir projetos
cd projetos
ls
code .
```

O terminal abre na sua pasta de usuário: crie ali uma pasta para os projetos do curso.

:::tip
<kbd>Tab</kbd> completa nomes de pastas e a seta para cima repete o último comando.
:::

---

## :icon[terminal] Terminal na prática

**Caso 1: criar a pasta do curso e entrar nela.** Repare no prompt, que muda com o `cd`:

```bash
mkdir projetos   # cria a pasta
cd projetos      # entra: o prompt passa a terminar em projetos
ls               # nada aparece: a pasta acabou de nascer, vazia
```

**Caso 2: voltar e conferir.**

```bash
cd ..            # volta uma pasta: o prompt perde o projetos
ls               # a lista agora mostra a pasta projetos
```

**Caso 3: ganhar tempo.** Digite `cd proj` e aperte <kbd>Tab</kbd>: o terminal completa para `cd projetos`. A seta para cima traz o último comando de volta.

Na dúvida sobre onde está, olhe o prompt ou rode `ls` antes do próximo comando.

---

## Node.js e npm

Dá para rodar JavaScript sem abrir o navegador?

---

## :icon[server] Node.js: JavaScript no seu computador

Na aula 1, o mesmo motor ia num carro comum ou numa ambulância, e o que mudava era o equipamento. O **Node.js** é um runtime de JavaScript para o computador: o motor V8, o mesmo do Chrome, com as ferramentas do computador no lugar das da página. Ele lê arquivos, usa a rede e conversa com o terminal.

Com ele, você roda um programa com um comando, sem abrir navegador nenhum. É assim que vão funcionar os seus programas do E02 ao E20.

---

## :icon[shield-check] Qual versão baixar: LTS

No site do Node.js, escolha a versão **LTS** (*Long Term Support*, suporte de longo prazo):

- recebe correções por mais tempo
- tem o primeiro número **par**: 22, 24, 26
- é a que as ferramentas do curso esperam

A versão "Current" (atual) traz as novidades primeiro, mas muda rápido: deixe para depois.

:::warning
Se o `node -v` mostrar um primeiro número ímpar, como `v25.1.0`, você baixou a Current. Desinstale e instale a LTS.
:::

---

## :icon[package] npm: código pronto para baixar

Para fazer um bolo, você compra a farinha pronta, em vez de plantar o trigo. Programar é igual: muita coisa já existe pronta. O **npm** vem junto com o Node.js e baixa **pacotes**: código pronto, escrito por outras pessoas, de um catálogo público com milhões de opções.

Um exemplo: em vez de escrever do zero um programa que testa o seu código, você instala o Jest com um comando. É o que você faz no E04.

```bash
npm -v    # mostra a versão do npm, instalado junto com o Node
```

No E02, você usa o npm de verdade e cria o `package.json`, a ficha do seu projeto.

---

## :icon[terminal] Node na prática: JavaScript no terminal

Com o Node instalado, digite `node` e aperte <kbd>Enter</kbd>. O prompt vira `>`: agora o terminal entende JavaScript, como o Console do navegador.

```bash
$ node
> console.log('Olá, Node!')
Olá, Node!
undefined
> 2 + 2
4
> document.title
Uncaught ReferenceError: document is not defined
> .exit
```

- A mensagem aparece: o Node também tem `console.log`
- A conta funciona: ela é da linguagem
- `document` não existe: no Node não há página, como você viu na aula 1
- O `undefined` depois da mensagem é normal; no E02 você entende de onde ele vem
- `.exit` volta ao terminal de sempre

---

## VS Code

Dá para escrever um app inteiro no Bloco de Notas?

---

## :icon[code] VS Code: o editor

O **VS Code** é o programa onde você escreve o código. É um editor de texto feito para programar: pinta cada parte do código de uma cor, completa nomes e aponta erros enquanto você digita.

A tela tem três partes:

- à esquerda, os arquivos da pasta aberta
- no centro, o arquivo que você está escrevendo
- embaixo, o terminal, quando você abre

Dois atalhos que valem ouro:

- ``Ctrl + ` `` (crase) abre o terminal dentro do editor
- `Ctrl + P` procura um arquivo pelo nome

---

## :icon[puzzle] Extensões: funções a mais

**Extensões** são como os apps do celular: você instala e o editor ganha uma função nova. Três ajudam desde o primeiro dia:

| Extensão | Para que serve |
|---|---|
| Prettier - Code formatter | arruma a aparência do código: espaços, aspas, quebras de linha |
| ESLint | aponta erros e descuidos no código, como um corretor ortográfico |
| Error Lens | mostra o aviso na própria linha, sem passar o mouse |

Instale pela aba Extensions (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>X</kbd>): procure pelo nome e clique em **Install**. O Prettier e o ESLint ganham as regras do seu projeto no E03.

---

## :icon[code] VS Code na prática

**Caso 1: abrir a pasta do curso.** No terminal, dentro de `projetos`, rode `code .`: o VS Code abre com a pasta no painel da esquerda.

**Caso 2: ver um erro na hora.** Crie o arquivo `teste.js` com a linha abaixo, sem fechar o parêntese, e salve com <kbd>Ctrl</kbd> + <kbd>S</kbd>:

```javascript
console.log('Olá'
```

O Error Lens escreve o aviso na própria linha: `')' expected.`, quer dizer "faltou fechar o parêntese". Feche o parêntese, salve, e o aviso some.

**Caso 3: o terminal sem sair do editor.** ``Ctrl + ` `` abre o terminal embaixo, já na pasta aberta. Rode `ls` e veja o `teste.js` na lista.

---

## Git

Já quis voltar um trabalho para o jeito que ele estava ontem?

---

## :icon[git-branch] Git: fotografias do seu projeto

O **Git** registra a história do código. A cada ponto importante, você tira uma foto de todos os arquivos, com uma legenda dizendo o que mudou. Essa foto se chama **commit**. As fotos ficam no **repositório**: o álbum do projeto, a pasta com todo o histórico.

Com o álbum:

- você volta a qualquer foto
- sabe exatamente o que mudou entre duas fotos
- várias pessoas trabalham no mesmo projeto sem apagar o trabalho umas das outras

Hoje você só instala o Git e se apresenta a ele. Os primeiros commits ficam para o E03.

---

## :icon[user-cog] Git: diga quem você é

Toda foto leva a assinatura de quem tirou: o nome e o e-mail. Configure uma vez por computador, logo depois de instalar:

```bash
git config --global user.name "Ana Souza"
git config --global user.email "ana@exemplo.com"
git config --global init.defaultBranch main
```

| Linha | O que ela diz |
|---|---|
| `user.name "Ana Souza"` | "meu nome é Ana Souza" |
| `user.email "ana@exemplo.com"` | "meu e-mail é este": use o mesmo da conta no GitHub, que liga os commits a você |
| `init.defaultBranch main` | "a linha principal do histórico se chama `main`", o mesmo nome que o GitHub usa |

O `--global` vale para todos os projetos deste computador. Troque pelos seus dados, sempre **entre aspas**.

---

## :icon[user-cog] Git na prática

**Caso 1: conferir o que ficou gravado.** Sem nada depois do nome da configuração, o comando mostra o valor guardado:

```bash
git config --global user.name
# Ana Souza
git config --global user.email
# ana@exemplo.com
```

**Caso 2: o nome sem aspas.** O espaço separa as partes do comando, e o Git grava só a primeira palavra:

```bash
git config --global user.name Ana Souza
git config --global user.name
# Ana
```

Para corrigir, repita o comando com o nome entre aspas.

**Caso 3: a versão instalada.**

```bash
git --version
# git version 2.51.0.windows.1
```

---

## GitHub

Se o seu computador quebrasse hoje, o que você perderia?

---

## :icon[globe] GitHub: seu portfólio público

O **GitHub** é um site que guarda repositórios na nuvem: o álbum do projeto fora do seu computador, como o backup de fotos do celular. Ele serve de:

- **backup** (cópia de segurança): o computador quebrou, o código continua lá
- **portfólio** (a coleção dos seus trabalhos): recrutadores olham o que você publicou
- **ponto de encontro**: a equipe trabalha no mesmo código

Crie a conta em github.com/signup com um nome de usuário que caberia em um currículo, como `ana-souza`, e não um apelido de jogo. Confirme o e-mail e coloque uma foto no perfil. No E03, você envia o seu primeiro projeto para lá.

---

## :icon[globe] GitHub na prática

O nome de usuário aparece no endereço de tudo o que você publica:

| Endereço | O que abre |
|---|---|
| `github.com/ana-souza` | o perfil, com a foto e a lista de projetos |
| `github.com/ana-souza/racha-conta` | um repositório: os arquivos e o histórico de um projeto |
| `github.com/ana-souza.png` | só a foto do perfil; serve de imagem na página do laboratório |

Por isso o nome precisa ser apresentável: ele vai no currículo, no link de cada projeto e na entrega dos trabalhos do curso.

---

## :icon[lightbulb] Pense

:::example Desafio
Você vai fazer os projetos do curso sozinho. Por que guardar o código no Git e no GitHub, se não há ninguém para dividir?

Pense em três situações:

- o programa parou de funcionar depois de uma mudança de ontem
- o computador quebrou na semana da prova
- um recrutador pediu para ver algo que você fez
:::

:::tip Resposta
1. Você volta à foto de ontem, quando o programa funcionava, e vê o que mudou
2. O código está no GitHub, e não só no computador quebrado
3. Você manda o link do seu perfil: `github.com/seu-usuario`
:::

---

## Conferir a instalação

Como saber se um programa foi mesmo instalado?

---

## :icon[circle-check] Conferindo a instalação

Todo programa tem uma **versão**, o número da edição instalada. Pedir a versão é o jeito de conferir: se o terminal responde com um número, o programa está lá.

Depois de instalar, **feche o terminal e abra de novo**. Ele só enxerga os programas que já existiam quando foi aberto.

```bash
node -v           # v24.11.1, por exemplo: o primeiro número é par
npm -v            # 11.6.2, por exemplo
git --version     # git version 2.51.0, por exemplo
code --version    # opcional: confirma que o comando code funciona
```

Os números mudam com o tempo; o que importa é cada comando responder. Se aparecer "não é reconhecido", o programa não foi instalado ou o terminal estava aberto antes da instalação.

---

## :icon[list-checks] Checklist de instalação

| O que | Onde baixar | Como conferir |
|---|---|---|
| **Node.js LTS** (vem com o npm) | nodejs.org, botão LTS | `node -v` e `npm -v` |
| **Git** | git-scm.com | `git --version` e `git config --global user.name` |
| **VS Code** | code.visualstudio.com | Prettier, ESLint e Error Lens instalados |
| **Navegador** com DevTools | Chrome ou Edge | `F12` abre o painel |
| **Conta no GitHub** | github.com/signup | `github.com/seu-usuario` abre o seu perfil |

:::tip
No Windows, prefira o **User Installer** do VS Code: ele não pede senha de administrador.
:::

Versão completa, com passo a passo por sistema e o que fazer se falhar: [checklist de instalação](materiais/e01/aluno/checklist-instalacao.html).

---

## Mensagens de erro

O terminal respondeu "não é reconhecido". O que ele está tentando avisar?

---

## :icon[siren] Quando aparece um erro

Como a luz do painel do carro, a mensagem de erro diz o que aconteceu e onde. Leia antes de pedir ajuda.

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `não é reconhecido` | o terminal não achou o programa | fechar tudo, inclusive o VS Code, e abrir de novo; se continuar, instalar |
| `a execução de scripts foi desabilitada` | o PowerShell bloqueou o `npm` | rodar `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` ou usar o Prompt de Comando |
| `Já existe um item` | a pasta já foi criada | entrar nela com `cd` |
| `document is not defined` | no Node não há página | usar `document` só no navegador |

---

## :icon[siren] O erro mais comum: "não é reconhecido"

Você instala o Node com o terminal aberto, roda `node -v` e recebe:

```plaintext
node : O termo 'node' não é reconhecido como nome de cmdlet, função,
arquivo de script ou programa operável.
```

- **O que aconteceu:** o terminal não achou nenhum programa chamado `node`
- **Por quê:** ele foi aberto antes da instalação e só enxerga o que já existia naquela hora
- **O que fazer:** feche o terminal e o VS Code, abra de novo e repita o `node -v`. Continuou? O Node não foi instalado: refaça pelo checklist

No Prompt de Comando, a mensagem começa com `'node' não é reconhecido como um comando interno`. O mesmo vale para `git` e `code`.

---

## Resumo

:::summary
- O **terminal** recebe comandos: `cd`, `ls`, `mkdir`, `code .` e `clear` resolvem o dia a dia
- **Node.js** roda JavaScript no computador; escolha sempre a versão LTS, de número par
- **npm** vem com o Node e baixa pacotes, código pronto feito por outras pessoas
- **VS Code** é o editor, com Prettier, ESLint e Error Lens
- **Git** guarda o histórico em commits, as fotos do projeto, e precisa do seu nome e e-mail; o **GitHub** guarda os repositórios na nuvem
:::

---

## :icon[clipboard-check] Como você vai ser avaliado

| O que | Quantos | Como |
|---|---|---|
| Quizzes | um em quase todo encontro | no fim do encontro, na plataforma |
| Provas | 4: no E20, no E25, no E29 e no E40 | uma tentativa, 60 minutos |
| Projetos | 6, três por módulo | em etapas, um pouco a cada encontro |

- Cada projeto é um repositório seu no GitHub, feito sozinho, com um commit por etapa
- Para entregar, você cola o link do repositório na página do projeto; o instrutor corrige critério por critério e pode devolver para ajustes
- Provas e projetos aprovam com 70

O primeiro projeto, o Racha-conta, começa no E02.

---

## :icon[flask-conical] No laboratório

Hoje você monta a sua primeira página e deixa o computador pronto para o E02.

:::steps
1. Crie `perfil.html` e `estilo.css` com uma foto, o seu nome e três links (GitHub, LinkedIn, e-mail ou outros). Abra no navegador e inspecione com o DevTools
2. Instale Node.js LTS, Git e VS Code com as três extensões
3. Feche e abra o terminal, confira as versões e configure o Git
4. Crie a sua conta no GitHub
:::

**Entrega**: `perfil.html`, `estilo.css` e uma captura de tela do terminal com as versões e o seu nome no Git, enviados ao instrutor pelo sistema. Quem não terminar hoje entrega até o início do E02.

Enunciado completo, com esqueleto e erros comuns: [laboratório do E01](materiais/e01/aluno/laboratorio-perfil.html).

---

## :icon[arrow-right] Próximos passos

Ferramentas instaladas e conferidas. No E02, o Node deixa de ser só um número de versão:

:::steps
1. Você escreve o seu primeiro programa em um arquivo e o roda com `node`
2. O npm cria o `package.json`, a ficha do projeto
3. Nasce o `lojinha-regras`, o projeto que guarda as regras da Lojinha até o E20
:::

Antes do E02, termine o [checklist de instalação](materiais/e01/aluno/checklist-instalacao.html): sem o Node instalado, não dá para acompanhar.
