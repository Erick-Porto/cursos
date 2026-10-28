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

## Por que tantas ferramentas?

Na aula 1, o JavaScript rodou no Console do navegador. Para escrever programas de verdade, guardados em arquivos e executados no seu computador, cinco perguntas aparecem antes da primeira linha de código:

- Quem roda o JavaScript fora do navegador? **Node.js**
- De onde vêm as bibliotecas prontas? **npm**
- Onde você escreve o código? **VS Code**
- Onde você digita os comandos? **Terminal**
- Como não perder o trabalho de ontem? **Git** e **GitHub**

:::info
Hoje você instala e confere cada uma. Do E02 em diante, elas viram rotina.
:::

---

## :icon[server] Node.js: JavaScript no seu computador

O **Node.js** é um runtime de JavaScript para o computador: o motor V8, o mesmo do Chrome, mais APIs para ler arquivos, usar a rede e conversar com o terminal.

Com ele, você roda um programa com um comando, sem abrir navegador nenhum. É assim que vão funcionar os seus programas do E02 ao E20.

Ao baixar, escolha a versão **LTS** (suporte de longo prazo):

- recebe correções por mais tempo
- tem o primeiro número **par**: 22, 24, 26
- é a que as ferramentas do curso esperam

A versão "Current" traz as novidades primeiro, mas muda rápido: deixe para depois.

---

## :icon[package] npm: as bibliotecas prontas

O **npm** vem junto com o Node.js. Ele baixa **pacotes**, código pronto escrito por outras pessoas, de um catálogo público com milhões de opções.

Um exemplo: em vez de escrever do zero um programa que testa o seu código, você instala o Jest com um comando. É o que você faz no E04.

```bash
npm -v    # mostra a versão do npm, instalado junto com o Node
```

No E02, você usa o npm de verdade e cria o `package.json`, a ficha do seu projeto.

---

## :icon[square-terminal] Terminal: onde você digita comandos

O **terminal** é uma janela onde você digita um comando, aperta <kbd>Enter</kbd> e lê a resposta. Sem botões: só texto.

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

O texto antes do cursor, o **prompt**, mostra a pasta em que você está. Todo comando vale para essa pasta.

---

## :icon[terminal] Terminal: 5 comandos que bastam

| Comando | O que faz |
|---|---|
| `cd pasta` | entra na pasta (`cd ..` volta uma) |
| `ls` | lista o que há na pasta atual (no Prompt de Comando do Windows, `dir`) |
| `mkdir nome` | cria uma pasta |
| `code .` | abre a pasta atual no VS Code |
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

## :icon[code] VS Code: editor e extensões

O **VS Code** é o editor onde você escreve o código. Três extensões ajudam desde o primeiro dia:

| Extensão | Para que serve |
|---|---|
| Prettier - Code formatter | organiza o código: espaços, aspas, quebras de linha |
| ESLint | aponta erros e descuidos no código |
| Error Lens | mostra o aviso na própria linha, sem passar o mouse |

Instale pela aba Extensions (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>X</kbd>). O Prettier e o ESLint ganham as regras do seu projeto no E03.

Dois atalhos que valem ouro:

- ``Ctrl + ` `` (crase) abre o terminal dentro do editor
- `Ctrl + P` procura um arquivo pelo nome

---

## :icon[git-branch] Git: fotografias do seu projeto

O **Git** registra a história do código. A cada ponto importante, você tira uma fotografia de todos os arquivos, com uma mensagem dizendo o que mudou. Essa fotografia se chama **commit**.

Pense no "salvar jogo" de um videogame:

- você volta a qualquer ponto salvo
- sabe exatamente o que mudou entre dois pontos
- várias pessoas trabalham no mesmo projeto sem apagar o trabalho umas das outras

Hoje você só instala o Git e se apresenta a ele. Os primeiros commits ficam para o E03.

---

## :icon[user-cog] Git: diga quem você é

Todo commit leva o nome e o e-mail de quem o fez. Configure uma vez por computador, logo depois de instalar:

```bash
git config --global user.name "Ana Souza"
git config --global user.email "ana@exemplo.com"
git config --global init.defaultBranch main
```

- troque pelos seus dados, sempre **entre aspas**
- use o mesmo e-mail da sua conta no GitHub: é assim que ele liga os commits a você
- a terceira linha dá ao ramo principal o nome `main`, o mesmo que o GitHub usa

Para conferir, `git config --global user.name` mostra o nome gravado.

---

## :icon[globe] GitHub: seu portfólio público

O **GitHub** é um site que guarda repositórios Git na nuvem. Um **repositório** é a pasta de um projeto com todo o seu histórico. O GitHub serve de:

- **backup**: o computador quebrou, o código continua lá
- **portfólio**: recrutadores olham o que você publicou
- **ponto de encontro**: a equipe trabalha no mesmo código

Crie a conta em github.com/signup com um nome de usuário que caberia em um currículo, como `ana-souza`, e não um apelido de jogo. Ele aparece no endereço de todos os seus projetos: `github.com/ana-souza`.

Confirme o e-mail e coloque uma foto no perfil. No E03, você envia o seu primeiro projeto para lá.

---

## :icon[lightbulb] Pense

:::question
Você vai fazer os projetos do curso sozinho. Por que guardar o código no Git e no GitHub, se não há ninguém para dividir?

Pense em três situações:

- o programa parou de funcionar depois de uma mudança de ontem
- o computador quebrou na semana da prova
- um recrutador pediu para ver algo que você fez
:::

---

## :icon[circle-check] Conferindo a instalação

Depois de instalar, **feche o terminal e abra de novo**. Ele só enxerga os programas que já existiam quando foi aberto.

```bash
node -v           # v24.11.1, por exemplo: o primeiro número é par
npm -v            # 11.6.2, por exemplo
git --version     # git version 2.51.0, por exemplo
code --version    # opcional: confirma que o comando code funciona
```

Cada comando responde com uma versão. Os números mudam com o tempo; o que importa é cada comando responder.

Se aparecer "não é reconhecido", o programa não foi instalado ou o terminal estava aberto antes da instalação.

---

## :icon[terminal] Primeiro JavaScript fora do navegador

Com o Node instalado, digite `node` e aperte <kbd>Enter</kbd>. O prompt vira `>`: agora o terminal entende JavaScript.

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

- a conta funciona: ela é da linguagem
- `document` não existe: no Node não há página, como você viu na aula 1
- o `undefined` depois da mensagem é normal; no E02 você entende de onde ele vem
- `.exit` volta ao terminal de sempre

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

## Erros comuns

:::warning
- **"Não é reconhecido" logo depois de instalar.** O terminal estava aberto antes: feche tudo, inclusive o VS Code, e abra de novo
- **Versão ímpar no `node -v`.** Você baixou a "Current": desinstale e instale a LTS
- **Nome sem aspas no `git config`.** `user.name Ana Souza` grava só "Ana"; com aspas, grava o nome inteiro
- **Comando na pasta errada.** Confira o prompt ou rode `ls` antes: cada comando vale para a pasta em que você está
- **`npm -v` bloqueado no PowerShell** ("a execução de scripts foi desabilitada"). Rode `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` ou use o Prompt de Comando
:::

---

## Resumo

:::summary
- **Node.js** roda JavaScript no computador; escolha sempre a versão LTS, de número par
- **npm** vem com o Node e instala pacotes prontos
- O **terminal** recebe comandos: `cd`, `ls`, `mkdir`, `code .` e `clear` resolvem o dia a dia
- **VS Code** é o editor, com Prettier, ESLint e Error Lens
- **Git** guarda o histórico e precisa do seu nome e e-mail; o **GitHub** guarda os repositórios na nuvem
:::

---

## :icon[arrow-right] Próximos passos

Ferramentas instaladas e conferidas. No E02, o Node deixa de ser só um número de versão:

:::steps
1. Você escreve o seu primeiro programa em um arquivo e o roda com `node`
2. O npm cria o `package.json`, a ficha do projeto
3. Nasce o `lojinha-regras`, o projeto que guarda as regras da Lojinha até o E20
:::

Antes do E02, termine o [checklist de instalação](materiais/e01/aluno/checklist-instalacao.html): sem o Node instalado, não dá para acompanhar.
