---
title: "Ambiente de desenvolvimento: Node.js, npm, VS Code e Git"
summary: As ferramentas do dia a dia de quem desenvolve em React e como versionar seu código com Git e GitHub.
module: react
duration_minutes: 35
objectives:
  - Explicar o papel do Node.js e do npm
  - Usar os comandos básicos do terminal
  - Versionar um projeto com Git e publicá-lo no GitHub
---

# Ambiente de desenvolvimento: Node.js, npm, VS Code e Git

Programador Mobile: Módulo Básico · Encontro E02 · Aula 3 de 18

---

## O que você vai aprender

:::goal
- O que o Node.js e o npm fazem por um projeto React
- Cinco comandos de terminal que resolvem o dia a dia
- O VS Code com três extensões e dois atalhos
- Versionar com Git e publicar no GitHub
:::

---

## Por que tantas ferramentas?

Você quer escrever o app Minhas Tarefas em React. Mas o navegador só entende HTML, CSS e JavaScript puro: o código React precisa ser traduzido antes de chegar nele.

Quatro perguntas aparecem antes da primeira linha de código:

- Quem traduz e serve seu código enquanto você desenvolve? **Node.js**
- De onde vem o React? **npm**
- Onde você digita os comandos? **Terminal**
- Como não perder o trabalho de ontem? **Git**

:::info
Hoje a resposta vira hábito: configurar, instalar, versionar. Nos próximos encontros você só repete.
:::

---

## :icon[server] Node.js: JavaScript fora do navegador

Por muito tempo, JavaScript só rodava dentro de páginas web. O **Node.js** é um programa que executa JavaScript direto no seu computador, sem navegador.

Por que o React precisa dele enquanto você desenvolve?

- Para rodar o **Vite**, o servidor que mostra o projeto no navegador e o atualiza a cada mudança
- Para traduzir o código React em JavaScript que o navegador entende
- Para instalar e executar ferramentas (npm, Prettier, testes)

```bash
node -v   # mostra a versão instalada no E01 (a LTS)
```

:::info
Quem usa o site pronto não precisa de Node.js: na hora de publicar, o Vite gera HTML, CSS e JavaScript puros.
:::

---

## :icon[package] npm: a loja de pacotes

O **npm** vem junto com o Node.js. Ele baixa **pacotes** (bibliotecas prontas, como o próprio React) de um catálogo público com milhões de opções.

Dois nomes que você vai ver em todo projeto:

- **`package.json`**: a lista de compras do projeto, com nome, scripts e os pacotes que ele usa
- **`node_modules/`**: a pasta onde os pacotes baixados ficam instalados, grande e recriável

```bash
npm -v          # versão do npm
npm install     # baixa tudo que o package.json pede
npm run dev     # executa o script "dev" do package.json
```

:::tip
Apagou o `node_modules`? Sem pânico: `npm install` recria a pasta inteira a partir do `package.json`.
:::

---

## :icon[terminal] Terminal: 5 comandos que bastam

O **terminal** é onde você digita comandos em vez de clicar. Com cinco deles você se vira:

| Comando | O que faz |
|---|---|
| `cd pasta` | entra na pasta (`cd ..` volta uma) |
| `ls` (no Windows também `dir`) | lista o que há na pasta atual |
| `mkdir nome` | cria uma pasta |
| `code .` | abre a pasta atual no VS Code |
| `clear` | limpa a tela |

```bash
cd Documentos
mkdir projetos-react
cd projetos-react
ls
code .
```

:::tip
`Tab` completa nomes de pastas e a seta para cima repete o último comando.
:::

---

## :icon[code] VS Code: editor, extensões e atalhos

O **VS Code** é o editor onde você escreve o código. Três extensões deixam o trabalho com React mais leve:

| Extensão | Para que serve |
|---|---|
| ES7+ React/Redux/React-Native snippets | digite `rfce` e `Tab`: um componente pronto aparece |
| Prettier | formata o código ao salvar (indentação, aspas, ponto e vírgula) |
| Error Lens | mostra o erro na própria linha, sem passar o mouse |

Dois atalhos que valem ouro:

- :icon[square-terminal] ``Ctrl + ` `` (tecla de crase) abre o terminal integrado dentro do editor
- :icon[search] `Ctrl + P` procura um arquivo pelo nome

Instale pela aba Extensions (`Ctrl + Shift + X`).

---

## :icon[git-branch] Git: fotografias do seu projeto

O **Git** registra a história do código. A cada ponto importante, você tira uma fotografia de todos os arquivos, com uma mensagem dizendo o que mudou. Essa fotografia é um **commit**.

Pense no "salvar jogo" de um videogame:

- Você volta a qualquer ponto salvo
- Sabe exatamente o que mudou entre dois pontos
- Várias pessoas trabalham no mesmo projeto sem apagar o trabalho umas das outras

A pasta com esse histórico é um **repositório**. O Git guarda tudo em uma subpasta oculta chamada `.git`.

```plaintext
a1b2c3  Adiciona rodapé
d4e5f6  Cria o cabeçalho
g7h8i9  Cria o projeto
```

---

## :icon[git-commit-horizontal] Git em 4 comandos

```bash
git init                        # 1. cria o repositório na pasta atual (uma vez só)
git add .                       # 2. marca todos os arquivos alterados para o próximo commit
git commit -m "Cria o projeto"  # 3. tira a fotografia, com mensagem
git log --oneline               # 4. mostra o histórico, um commit por linha
```

O `git init` acontece uma vez por projeto.

Mensagem boa é curta e diz o que o commit faz: "Adiciona rodapé", "Corrige título".

:::info Primeira vez usando Git neste computador?
```bash
git config --global user.name "Seu Nome"
git config --global user.email "voce@exemplo.com"
```
:::

---

## Do arquivo editado ao commit

:::center
![Animação: notas.txt é editado na pasta, o git add . marca o arquivo para o commit e o git commit -m tira a fotografia Cria notas.txt, que entra no histórico](images/e02-ciclo-do-commit.svg)
:::

O `git add .` marca o que mudou; o `git commit -m` fotografa só o que foi marcado e guarda a fotografia no histórico. Arquivo editado e não marcado fica de fora do commit.

Ciclo do dia a dia: editar, `git add .`, `git commit -m "..."`.

---

## :icon[flask-conical] Pratique: seu primeiro commit

:::example Desafio de 5 minutos
No terminal, execute um comando por vez e leia a resposta de cada um:

```bash
mkdir meu-primeiro-repo
cd meu-primeiro-repo
git init
echo "Olá, Git" > notas.txt
git add .
git commit -m "Cria notas.txt"
git log --oneline
```

Depois abra `notas.txt` no VS Code (`code .`), acrescente uma linha, salve e faça um segundo commit com a mensagem "Adiciona segunda linha". O `git log --oneline` deve mostrar duas linhas.
:::

:::tip
`git status` mostra o que mudou e ainda não entrou em nenhum commit. Use sempre que ficar em dúvida.
:::

---

## :icon[globe] GitHub: seu portfólio público

O **GitHub** hospeda repositórios Git na nuvem. Serve de backup, de portfólio (recrutadores olham) e de ponto de encontro com colegas.

1. No GitHub, clique em **New repository**, nomeie `meu-primeiro-repo`, deixe **Public** e crie sem marcar README
2. Conecte a pasta local ao repositório remoto e envie:

```bash
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/meu-primeiro-repo.git
git push -u origin main
```

- `origin` é o apelido do endereço remoto
- `-u` memoriza o destino: das próximas vezes, basta `git push`

Atualize a página do GitHub: seus arquivos e commits estão lá. Na primeira vez, o Git abre o navegador para você autorizar o acesso.

---

## :icon[triangle-alert] node_modules nunca vai para o Git

:::warning
A pasta `node_modules/` tem milhares de arquivos e dezenas de megabytes, e qualquer pessoa a recria com `npm install`. Enviá-la deixa o repositório lento e pesado, e o GitHub pode até recusar o push.
:::

O arquivo **`.gitignore`** lista o que o Git deve fingir que não existe:

```plaintext
node_modules
dist
.env
```

- Projetos criados com Vite já vêm com um `.gitignore` pronto
- Antes do commit, rode `git status`: se `node_modules/` aparecer na lista, pare e confira o `.gitignore`

---

## :icon[lightbulb] Pense

:::question
Você vai fazer o projeto `minhas-tarefas` sozinho. Por que versionar com Git se não há ninguém para dividir o código?

Pense em três situações: o app parou de funcionar depois de uma mudança de ontem; o computador quebrou; um recrutador pediu para ver algo que você fez.
:::

---

## :icon[bug] Erros comuns

:::warning
- **Rodar o comando na pasta errada.** `npm install` ou `git init` fora da pasta do projeto. Confira com `ls` antes: o `package.json` precisa estar ali.
- **Esquecer o `git add`.** O `git commit` responde "nothing to commit" e a mudança fica de fora. Verifique com `git status`.
- **Commit sem mensagem.** `git commit` sem `-m` abre um editor estranho no terminal. Se cair nele, digite `:q!` e `Enter`, e repita com `-m "mensagem"`.
- **Fechar o terminal e perder o lugar.** Cada terminal novo começa na pasta inicial; entre na pasta do projeto de novo com `cd`.
:::

---

## :icon[list-checks] Resumo

:::summary
- **Node.js** executa JavaScript fora do navegador: é ele que roda o Vite enquanto você desenvolve
- **npm** instala pacotes: o `package.json` lista, o `node_modules/` guarda
- Cinco comandos de terminal resolvem o dia a dia: `cd`, `ls`, `mkdir`, `code .`, `clear`
- **Git** tira fotografias do projeto: `git init`, `git add .`, `git commit -m`, `git log --oneline`
- **GitHub** guarda o repositório na nuvem: `git remote add origin` e `git push`
:::

---

## :icon[arrow-right] Próximos passos

Ferramentas instaladas, Git funcionando. Na próxima aula você junta tudo:

:::steps
1. Cria o projeto `minhas-tarefas` com um único comando do Vite
2. Roda `npm run dev` e vê a página atualizar sozinha a cada mudança
3. Escreve os primeiros componentes e publica no GitHub
:::

Deixe o terminal aberto na pasta `projetos-react`: é dali que o projeto vai nascer.
