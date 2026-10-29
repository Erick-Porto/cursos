---
title: Git e GitHub
summary: O lojinha-regras ganha histórico e vai para o GitHub; depois, branch, Pull Request revisado e conflito resolvido.
module: ambiente-js
duration_minutes: 45
objectives:
  - Versionar o lojinha-regras com git init, add, commit e um .gitignore
  - Publicar o repositório no GitHub com git push
  - Levar uma mudança à main por branch, Pull Request e revisão
  - Resolver um conflito de merge sem perder o trabalho de ninguém
---

# Git e GitHub

Programador Mobile · Encontro E03 · Aula 5 de 89

---

## O que você vai aprender

:::goal
- Criar o repositório do `lojinha-regras` e fazer o primeiro commit
- Deixar o `node_modules/` fora do Git com o `.gitignore`
- Enviar o projeto ao GitHub com `git push`
- Levar uma mudança à `main` por branch, Pull Request e revisão
- Resolver um conflito de merge sem perder o trabalho de ninguém
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **repositório** | a pasta do projeto com um álbum de fotos dentro: a história de tudo o que mudou |
| **commit** | uma foto do projeto naquele momento, com uma legenda dizendo o que mudou |
| **push** | mandar os seus commits para o GitHub, na nuvem |
| **branch** | um rascunho paralelo do projeto, para mudar sem estragar a versão boa |
| **Pull Request** | o pedido para juntar o rascunho à versão boa, depois que um colega revisa |
| **conflito** | duas mudanças diferentes na mesma linha: o Git pergunta qual vale |

---

## Um projeto, dois problemas

Na segunda, o notebook da Ana não liga. O `lojinha-regras`, com tudo o que ela fez no E02, estava só nele.

Na mesma semana, Bruno e Carla dividem o `produtos.js`: ele ajusta o preço do Fone Bluetooth, ela corrige uma descrição. Os dois trocam o arquivo por mensagem, e a versão de um apaga a do outro. Ninguém percebe.

:::question
Como guardar a história do projeto fora do seu computador e trabalhar em dupla sem apagar o trabalho do colega?
:::

---

## O repositório

Onde você guarda as fotos de uma viagem para achar depois?

---

## :icon[folder-open] O primeiro repositório

Um **repositório** é a pasta do projeto com um álbum de fotos dentro. Cada foto, o **commit**, guarda como os arquivos estavam naquele momento. No E01, você instalou o Git e disse a ele quem você é. Hoje, o `lojinha-regras` ganha o álbum:

```bash
cd lojinha-regras
git init
git status
```

```plaintext
On branch main
No commits yet
Untracked files:
	node_modules/
	package-lock.json
	package.json
	src/
```

- `git init` abre o álbum: cria a subpasta oculta `.git`, onde mora a história. Uma vez por projeto, na raiz
- `git status` é o painel do Git: mostra o que mudou desde a última foto
- *No commits yet*: ainda não há nenhuma foto. *Untracked files*: arquivos que o Git vê, mas ainda não acompanha

---

## :icon[folder-open] O repositório na prática

**Caso 1: o terminal fora do projeto.** Ali não há álbum, e o Git avisa:

```bash
cd ..
git status
# fatal: not a git repository (or any of the parent directories): .git
```

*not a git repository* quer dizer "aqui não é um repositório". Volte com `cd lojinha-regras`.

**Caso 2: o `git init` duas vezes.** Não estraga nada; o Git só avisa que o álbum já existia:

```bash
git init
# Reinitialized existing Git repository in C:/Users/ana/lojinha-regras/.git/
```

**Caso 3: cada projeto, o seu álbum.** Na etapa 2 do projeto, o `racha-conta` ganha o dele, na pasta dele, ao lado do `lojinha-regras`:

```bash
cd ../racha-conta
git init
# Initialized empty Git repository in C:/Users/ana/racha-conta/.git/
```

Nunca rode `git init` dentro de outro repositório.

---

## O .gitignore

Na foto do quarto que você manda para alguém, o que fica fora?

---

## :icon[eye-off] .gitignore: o que fica fora

O **`.gitignore`** é a lista do que não entra nas fotos, um nome por linha. O `node_modules/` fica fora: o `npm install` o recria, e no E04 ele passa de 7 mil arquivos.

Crie o arquivo na raiz, pelo VS Code:

```plaintext
node_modules/
```

| Vai para o Git | Fica fora |
|---|---|
| `src/`, com o código e o `catalogo.json` | `node_modules/`: o `npm install` recria |
| `package.json` e `package-lock.json`: a receita e as versões exatas | `coverage/` e `.env`, que chegam no E04 |

Rode `git status` de novo: o `node_modules/` sumiu da lista e o `.gitignore` apareceu.

---

## :icon[eye-off] O .gitignore na prática

**Caso 1: mais de uma linha.** No E04, o arquivo ganha duas linhas, e cada uma tira algo das fotos:

```plaintext
node_modules/
coverage/
.env
```

**Caso 2: criado com `echo` no PowerShell.** O arquivo sai em outra codificação, o Git não o lê, e o `node_modules/` continua na lista do `git status`:

```plaintext
Untracked files:
	.gitignore
	node_modules/
```

Apague e crie de novo pelo VS Code.

**Caso 3: o `node_modules/` já entrou num commit.** O `.gitignore` não mexe nas fotos antigas. Com ele criado, rode:

```bash
git rm -r --cached node_modules   # tira do Git; a pasta continua no computador
git commit -m "Tira o node_modules do Git"
```

---

## Commits

Numa foto de grupo, o que acontece antes do clique?

---

## :icon[workflow] add e commit: a fotografia

Um commit se faz em dois passos, como uma foto de grupo: primeiro você chama quem vai sair na foto, depois clica.

:::center
![Diagrama: git add leva da pasta de trabalho à área de preparação, git commit grava no repositório local, git push envia ao GitHub e git pull traz de volta](images/e03-fluxo-git.svg)
:::

- `git add` chama os arquivos para a foto: eles vão para a **área de preparação**
- `git commit` tira a foto só do que foi preparado, com uma legenda
- `git push` e `git pull` levam e trazem commits do GitHub: é a última parte do caminho

---

## :icon[list-checks] Lendo o git status

O `git status` separa os arquivos em três grupos, em inglês:

| O `git status` mostra | Quer dizer | Para entrar no commit |
|---|---|---|
| *Untracked files* | arquivo novo, que o Git ainda não acompanha | `git add` |
| *Changes not staged for commit* | mudou, mas não foi chamado para a foto | `git add` |
| *Changes to be committed* | já foi chamado para a foto | nada: entra no próximo `git commit` |

O commit grava **só** o último grupo. O que mudou e não passou pelo `git add` fica de fora.

---

## :icon[square-terminal] O primeiro commit

```bash
git add .
git commit -m "E03: projeto lojinha-regras"
git log --oneline
```

```plaintext
9e1b7a4 (HEAD -> main) E03: projeto lojinha-regras
```

| Linha | O que ela diz |
|---|---|
| `git add .` | "chame para a foto tudo o que mudou". O `.` quer dizer a pasta inteira; `git add arquivo` chama um só |
| `git commit -m "..."` | "tire a foto, com esta legenda". O `-m` vem de *message*, mensagem |
| `git log --oneline` | "mostre o álbum, uma foto por linha, a mais nova em cima" |

Na saída, `9e1b7a4` é o código da foto, e `HEAD -> main` quer dizer "você está aqui, na `main`".

---

## :icon[history] Commits na prática

**Caso 1: uma mudança só.** Você corrigiu a descrição da Garrafa Térmica:

```bash
git add src/data/produtos.js
git commit -m "Corrige a descrição da Garrafa Térmica"
# [main 1b87013] Corrige a descrição da Garrafa Térmica
#  1 file changed, 1 insertion(+), 1 deletion(-)
```

A resposta diz: 1 arquivo mudou, 1 linha entrou e 1 saiu.

**Caso 2: esqueceu o `git add`.** Nada foi chamado para a foto, e o commit não acontece:

```plaintext
no changes added to commit (use "git add" and/or "git commit -a")
```

**Caso 3: tudo já está nas fotos.** O `git status` responde "nada mudou desde a última foto":

```plaintext
nothing to commit, working tree clean
```

---

## :icon[git-commit-horizontal] Mensagens de commit

A mensagem do commit é a legenda da foto: quem abrir o álbum daqui a um mês precisa entender o que mudou. Diga **o que** mudou numa linha curta, começando por verbo:

| Ruim | Boa |
|---|---|
| `ajustes` | `Aceita categoria com maiúscula no relatório` |
| `aaa` | `Cria o .gitignore` |
| `final agora vai` | `Corrige o preço do Fone Bluetooth` |
| `relatorio e lint e readme` | três commits, um por assunto |

- Até uns 50 caracteres: é o que o `git log --oneline` e o GitHub mostram
- Um assunto por commit: fica fácil revisar e desfazer
- O commit de entrega do laboratório leva o encontro na frente: `E03: lint e formatação`

---

## O GitHub

Se o seu celular cair na água hoje, o que acontece com as fotos?

---

## :icon[cloud-upload] GitHub: o repositório na nuvem

O **GitHub** guarda o álbum na nuvem: se o computador quebrar, as fotos continuam lá. Mandar os seus commits para lá é o **push**; trazer os de lá, o **pull**.

:::steps
1. Em github.com, **New repository**: nome `lojinha-regras`, **Public**, sem README e sem `.gitignore`
2. **Create repository**: a página mostra os comandos de *push an existing repository* (enviar um repositório que já existe)
3. Copie e rode os três, na raiz do projeto
:::

```bash
git remote add origin https://github.com/SEU-USUARIO/lojinha-regras.git
git branch -M main
git push -u origin main
```

---

## :icon[list-ordered] Os três comandos em português

| Linha | O que ela diz |
|---|---|
| `git remote add origin https://...` | "guarde o endereço do repositório no GitHub com o apelido `origin`" |
| `git branch -M main` | "o ramo principal se chama `main`" |
| `git push -u origin main` | "mande os commits da `main` para o `origin`". O `-u` memoriza o destino: dali em diante, `git push` sozinho já sabe para onde ir |

No primeiro push, o Git abre o navegador para você autorizar o acesso à sua conta.

Atualize a página do GitHub: arquivos e commit estão lá, sem o `node_modules/`.

---

## :icon[cloud] O GitHub na prática

**Caso 1: um commit novo vai para a nuvem.** Depois do primeiro push, `git push` sozinho já sabe o destino:

```bash
git push
# To https://github.com/ana-souza/lojinha-regras.git
#    9e1b7a4..1b87013  main -> main
```

A `main` do GitHub andou da foto `9e1b7a4` até a `1b87013`.

**Caso 2: o notebook da Ana não liga.** Noutro computador, o `git clone` baixa o projeto com todas as fotos:

```bash
git clone https://github.com/ana-souza/lojinha-regras.git
# Cloning into 'lojinha-regras'...
cd lojinha-regras
npm install        # o node_modules volta
```

**Caso 3: na escola e em casa.** Em casa, o `git pull` traz o que você enviou da escola:

```bash
git pull
# Updating 1b87013..df8bd78
# Fast-forward
#  src/scripts/relatorio-catalogo.js | 2 +-
```

---

## Pense

:::example Desafio
Você corrigiu uma descrição no `produtos.js` e começou um script novo, com o nome dele no `package.json`. O `git status` mostra (sem as dicas entre parênteses):

```plaintext
Changes to be committed:
	modified:   src/data/produtos.js

Changes not staged for commit:
	modified:   package.json

Untracked files:
	src/scripts/destaques.js
```

Se você rodar agora `git commit -m "Adiciona o script destaques"`, o que entra no commit?
:::

:::tip Resposta
Entra só o `produtos.js`, o único preparado, e com uma mensagem que nem fala dele. O `package.json` mudou, mas não foi preparado; o `destaques.js` o Git nem acompanha. Melhor: um commit para a descrição e outro com `git add package.json src/scripts/destaques.js`.
:::

---

## Branches

Você escreve a redação direto na folha que vai ser entregue?

---

## :icon[git-branch] Branches: linhas paralelas

Uma **branch** (ramo) é um rascunho paralelo: você testa uma mudança nela sem estragar a versão boa. Em equipe, a versão boa fica na `main`, e commit direto nela pula a revisão. Cada mudança nasce numa branch e só volta pronta.

```bash
git switch main
git pull                               # parte da main atualizada
git switch -c fix/categoria-maiuscula  # cria a branch e entra nela
git branch                             # lista as branches; o * marca onde você está
```

| Prefixo | Para quê |
|---|---|
| `feature/` | funcionalidade nova |
| `fix/` | correção de bug |
| `chore/` | manutenção: configuração, dependências |

`git switch main` volta para a `main`, e os arquivos voltam a ser os dela. De volta à branch, as suas mudanças reaparecem.

---

## :icon[git-branch] Branches na prática

**Caso 1: criar o rascunho e ver onde você está.**

```bash
git switch -c chore/readme
# Switched to a new branch 'chore/readme'
git branch
# * chore/readme
#   main
```

**Caso 2: o rascunho não mexe na versão boa.** Na branch, crie o `README.md` e faça o commit. Depois, troque de branch e olhe o painel do VS Code:

```bash
git switch main
# Switched to branch 'main'          (o README.md some da pasta)
git switch chore/readme
# Switched to branch 'chore/readme'  (e volta)
```

A `main` só recebe o README quando o rascunho for passado a limpo, no merge.

---

## :icon[git-merge] Merge: juntando à main

O **merge** (juntar) passa o rascunho a limpo na versão boa: traz os commits de outra branch para a branch em que você está.

```bash
git switch main
git merge fix/categoria-maiuscula
git log --oneline --graph
```

```plaintext
*   a41c9e2 Merge branch 'fix/categoria-maiuscula'
|\
| * 7d03b18 Aceita categoria com maiúscula no relatório
* | 5c2e8d0 Cria o README com os comandos
|/
* 9e1b7a4 E03: projeto lojinha-regras
```

- Cada `*` é um commit; as linhas mostram os dois caminhos se juntando
- A `main` andou enquanto a branch existia, e nasceu um **commit de merge**. O merge de um Pull Request também cria um
- Se a `main` não andou, o Git só avança a `main` até a branch: é o **fast-forward** (avanço rápido)
- O Git pode abrir um editor para a mensagem do merge: no Vim, `:wq` e <kbd>Enter</kbd>; no VS Code, feche a aba

---

## Issues

Na assistência técnica, o que você recebe quando deixa o celular quebrado?

---

## :icon[circle-alert] Issues: o que está quebrado

Uma **Issue** (chamado) é como o chamado da assistência técnica: registra um defeito ou uma tarefa no próprio repositório, com número, responsável e conversa. Aba **Issues**, **New issue**. O bug que você anotou no E02 vira a primeira:

- **Título:** Relatório com categoria em maiúscula mostra R$ NaN
- **Passos:** `npm run relatorio Audio`
- **Esperado:** os 3 produtos de áudio
- **Obtido:** `Produtos: 0` e `Preço médio: R$ NaN`

O GitHub dá um número à Issue: `#1`. Quem for corrigir cria a branch `fix/categoria-maiuscula`, e o Pull Request da correção diz `Closes #1` ("fecha o chamado 1").

---

## :icon[circle-alert] Issues na prática

**Caso 1: uma tarefa, não um defeito.** Issue também serve para combinar o que fazer. O GitHub dá a ela o número `#2`:

```markdown
**Título:** Criar o README com os comandos
**O que fazer:** explicar npm install, npm run catalogo e npm run relatorio
```

**Caso 2: um comentário que ajuda.** Na conversa da Issue #1, alguém testa outra categoria e conta o que viu:

```markdown
Repeti com `npm run relatorio Casa`: também mostra `Produtos: 0`.
```

**Caso 3: fechar pelo Pull Request.** Com `Closes #1` na descrição do PR, a Issue passa de **Open** (aberta) a **Closed** (fechada) no merge, com o link do PR que a resolveu.

---

## Pull Request

Antes de entregar um trabalho em grupo, por que pedir para um colega ler?

---

## :icon[send] Pull Request: pedindo para juntar

Um **Pull Request** (PR, pedido para juntar) é pedir para um colega revisar a sua branch antes de juntá-la à `main`. Em equipe, ninguém faz merge na `main` sozinho. Primeiro, a branch vai para o GitHub:

```bash
git push -u origin fix/categoria-maiuscula
```

No GitHub, clique em **Compare & pull request**. Confira `base: main` (o destino) e `compare: fix/categoria-maiuscula` (a sua branch) e descreva:

- **O que muda:** o filtro compara a categoria em minúsculas, com `toLowerCase()`, que transforma `'Audio'` em `'audio'` (textos a fundo no E06)
- **Como testar:** `npm run relatorio Audio` mostra os 3 produtos de áudio
- `Closes #1`: a Issue fecha sozinha quando o PR entra na `main`

Em **Reviewers** (revisores), escolha o colega. Antes, ele precisa ser colaborador: **Settings**, **Collaborators**, **Add people**.

---

## :icon[send] Pull Request na prática

**Caso 1: a correção da Issue #1, do começo ao fim.**

```bash
git switch -c fix/categoria-maiuscula
# corrija o filtro e confira: npm run relatorio Audio
git add src/scripts/relatorio-catalogo.js
git commit -m "Aceita categoria com maiúscula no relatório"
git push -u origin fix/categoria-maiuscula
```

No GitHub: o PR com `Closes #1`, a revisão e o **Merge pull request**.

**Caso 2: o revisor pediu um ajuste.** Faça um commit novo na mesma branch e `git push`: o PR se atualiza sozinho, sem abrir outro.

**Caso 3: depois do merge, limpe.** A branch cumpriu o papel:

```bash
git switch main
git pull                                 # traz o merge
git branch -d fix/categoria-maiuscula
# Deleted branch fix/categoria-maiuscula (was 7d03b18).
```

---

## :icon[messages-square] Revisão de código

Na aba **Files changed** (arquivos alterados), quem revisa lê cada linha; o `+` ao lado dela abre um comentário. No fim, escolhe uma opção:

| Opção | Quer dizer | Quando usar |
|---|---|---|
| Comment | comentar | dúvida ou sugestão que não bloqueia |
| Approve | aprovar | rodou, está claro e segue as convenções |
| Request changes | pedir mudanças | algo quebra ou fere uma regra da equipe |

Com o **Approve**, o botão **Merge pull request** junta a branch à `main`.

---

## :icon[list-checks] O que conferir na revisão

- **Rode o código.** Nunca aprove sem rodar: `git clone` do repositório do colega (uma vez), `git switch` para a branch, `npm install` e o "Como testar"
- Confira nomes em português e arquivos que não deveriam estar ali, como o `node_modules/`
- Comente o código, não a pessoa, e diga o porquê: "Que tal `categoria` em vez de `c`? O nome diz o que guarda."

---

## :icon[route] Da branch à main

:::center
![Animação: a branch fix/categoria-maiuscula sai da main e recebe dois commits, o Pull Request é aberto e aprovado na revisão, e o merge cria um commit que junta tudo à main](images/e03-branch-pr-merge.svg)
:::

Todo código da equipe faz este caminho:

:::steps
1. `git switch -c` cria a branch, e os commits ficam nela
2. O Pull Request pede a revisão
3. Só depois do **Approve**, o merge leva tudo para a `main`
:::

---

## Pense

:::example Desafio
Você revisa o PR "Aceita categoria com maiúscula". Ele altera `relatorio-catalogo.js` e a pasta `node_modules/` inteira, num único commit chamado "aaa". O trecho do relatório:

```javascript
if (categoria) {
  lista = lista.filter((produto) => produto.categoria === categoria.toLowercase());
  titulo = categoria;
}
```

Que comentários você deixa, e com qual opção envia a revisão?
:::

:::tip Resposta
- `toLowercase`, com `c` minúsculo, não existe: `npm run relatorio Audio` quebra com `TypeError: categoria.toLowercase is not a function`. O certo é `toLowerCase`. Peça para rodar o "Como testar" antes de abrir o PR
- Falta o `.gitignore`; com ele criado, `git rm -r --cached node_modules` e um commit tiram a pasta do Git
- "aaa" não conta nada: sugira "Aceita categoria com maiúscula no relatório"

Envie com **Request changes**, porque o script quebra, e com tom de sugestão.
:::

---

## Conflitos

Dois colegas corrigem a mesma frase do trabalho, cada um de um jeito. Qual fica?

---

## :icon[swords] Conflito: duas mudanças na mesma linha

Um **conflito** é quando duas pessoas escrevem coisas diferentes na mesma linha do mesmo trabalho: o Git não escolhe qual vale, ele para o merge e pergunta. Você está na `feature/preco-fone-b` e traz a `main`, onde o preço do fone já mudou:

```javascript
export const produtos = [
<<<<<<< HEAD
  { id: 1, nome: 'Fone Bluetooth', preco: 179.9, categoria: 'audio', destaque: true, avaliacao: 4.6,
=======
  { id: 1, nome: 'Fone Bluetooth', preco: 189.9, categoria: 'audio', destaque: true, avaliacao: 4.6,
>>>>>>> main
```

- Entre `<<<<<<< HEAD` e `=======`: a versão da branch em que você está (`HEAD`)
- Entre `=======` e `>>>>>>> main`: a versão que está chegando
- O Git compara linhas inteiras: a linha toda aparece duas vezes, mesmo que só o preço mude
- Com as marcas, o arquivo não é JavaScript válido: `SyntaxError` em todo script que o importa

---

## :icon[swords] Conflitos na prática

**Caso 1: o merge para no meio.** O `git merge main` diz onde está o conflito:

```plaintext
Auto-merging src/data/produtos.js
CONFLICT (content): Merge conflict in src/data/produtos.js
Automatic merge failed; fix conflicts and then commit the result.
```

A última linha quer dizer: "o merge automático falhou; resolva e faça o commit".

**Caso 2: o PR avisa.** No GitHub aparece *This branch has conflicts that must be resolved* (esta branch tem conflitos para resolver). Traga a `main` atualizada para a sua branch e resolva no seu computador:

```bash
git switch main
git pull
git switch feature/preco-fone-b
git merge main
```

**Caso 3: arquivo gerado.** Não se resolve à mão. Resolva o `produtos.js` ou o `package.json` e gere de novo o `catalogo.json` (`npm run catalogo`) ou o lock (`npm install`).

---

## :icon[combine] Resolvendo o conflito

:::steps
1. `git status` marca o arquivo como *both modified* (os dois mudaram)
2. No VS Code, acima do trecho: **Accept Current Change** (fica a sua), **Accept Incoming Change** (fica a que chega) ou **Accept Both Changes** (ficam as duas)
3. Combine com quem fez a outra mudança qual preço vale: conflito se resolve conversando
4. Apague as marcas; o `git diff --check` acusa as esquecidas. O `npm run catalogo` roda sem erro e grava o JSON com o preço combinado
5. `git add` nos dois arquivos, `git commit -m "Resolve conflito no preço do fone"` e `git push`
:::

Depois do `git push`, o PR se atualiza sozinho.

:::tip
Perdeu-se no meio? `git merge --abort` desfaz o merge.
:::

---

## Mensagens de erro

O Git também acende luzes no painel. Você sabe ler cada uma?

---

## :icon[siren] Quando aparece um erro

A mensagem de erro é a luz do painel do carro: diz o que aconteceu e onde.

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `nothing added to commit` | nada foi chamado para a foto | `git add` antes |
| `Author identity unknown` | o Git não sabe quem você é | `git config` do E01 |
| `rejected` no `git push` | o GitHub tem commits que você não tem | `git pull` e `git push`; nunca `--force`, que apaga o trabalho alheio |
| `CONFLICT` | duas branches mudaram a mesma linha | resolver e fazer o commit |
| `Unexpected token '<<'` | sobraram marcas de conflito | apagar as marcas |

---

## :icon[cloud-upload] O erro mais comum: o push recusado

Você fez um commit, mas a sua dupla enviou outro antes. O `git push` responde:

```plaintext
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'https://github.com/ana-souza/lojinha-regras.git'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally. This is usually caused by another repository pushing to
```

O *hint* (dica) diz: o GitHub tem trabalho que você não tem. Traga primeiro, envie depois:

```bash
git pull      # traz e junta; se os dois mudaram a mesma linha, é conflito
git push
```

Nunca use `git push --force`: ele envia por cima e apaga o commit da sua dupla.

---

## Resumo

:::summary
- `git init` cria o repositório; `git add` prepara, `git commit -m` grava e `git status` mostra o que mudou
- O `.gitignore` deixa o `node_modules/` fora; `package.json` e lock vão juntos
- `git remote add origin` e `git push -u origin main` levam o projeto ao GitHub
- Cada mudança nasce numa branch e volta à `main` por um Pull Request revisado, ligado à Issue com `Closes #N`
- Conflito é a mesma linha mudada em duas branches: converse, apague as marcas, `git add` e `git commit`
:::

Próxima aula: o `lojinha-regras` ganha um revisor automático (ESLint), um formatador (Prettier) e o depurador do VS Code.
