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

## Um projeto, dois problemas

Na segunda, o notebook da Ana não liga. O `lojinha-regras`, com tudo o que ela fez no E02, estava só nele.

Na mesma semana, Bruno e Carla dividem o `produtos.js`: ele ajusta o preço do Fone Bluetooth, ela corrige uma descrição. Os dois trocam o arquivo por mensagem, e a versão de um apaga a do outro. Ninguém percebe.

:::question
Como guardar a história do projeto fora do seu computador e trabalhar em dupla sem apagar o trabalho do colega?
:::

---

## :icon[folder-open] O primeiro repositório

No E01, você instalou o Git e disse a ele quem você é. Hoje o `lojinha-regras` vira um **repositório**: uma pasta cujo histórico de **commits**, as fotografias do projeto, o Git guarda.

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

- `git init` cria a subpasta oculta `.git`, onde mora o histórico: uma vez por projeto, na raiz
- `git status` é o painel do Git: o que mudou e o que vai entrar no próximo commit
- **Untracked** são arquivos que o Git vê, mas ainda não acompanha

---

## :icon[eye-off] .gitignore: o que fica fora

O `node_modules/` do picocolors apareceu na lista. Ele não vai para o Git: qualquer pessoa o recria com `npm install`, e no E04 ele chega a quase 7 mil arquivos.

No VS Code, crie na raiz do projeto o arquivo `.gitignore`, com uma linha:

```plaintext
node_modules/
```

| Vai para o Git | Fica fora |
|---|---|
| `src/`, com o código e o `catalogo.json` | `node_modules/`: o `npm install` recria |
| `package.json` e `package-lock.json`: a receita e as versões exatas | `coverage/` e `.env`, que chegam no E04 |

Rode `git status` de novo: o `node_modules/` sumiu da lista e o `.gitignore` apareceu.

---

## :icon[workflow] add e commit: a fotografia

:::center
![Diagrama: git add leva da pasta de trabalho à área de preparação, git commit grava no repositório local, git push envia ao GitHub e git pull traz de volta](images/e03-fluxo-git.svg)
:::

- `git add .` leva tudo o que mudou para a **área de preparação**; `git add arquivo` leva um só
- `git commit -m "E03: projeto lojinha-regras"` fotografa só o que foi preparado
- `git log --oneline` mostra o histórico, um commit por linha, o mais novo em cima
- `git push` e `git pull` levam e trazem commits do GitHub, como você vê a seguir

---

## :icon[git-commit-horizontal] Mensagens de commit

Uma boa mensagem diz **o que** mudou numa linha curta, começando por verbo:

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

## :icon[cloud-upload] GitHub: o repositório na nuvem

:::steps
1. Em github.com, **New repository**: nome `lojinha-regras`, **Public**, sem README e sem `.gitignore`
2. **Create repository**: a página mostra os comandos de *push an existing repository*
3. Copie e rode os três, na raiz do projeto
:::

```bash
git remote add origin https://github.com/SEU-USUARIO/lojinha-regras.git
git branch -M main
git push -u origin main
```

- `origin` é o apelido do endereço; `-u` memoriza o destino, e depois basta `git push`
- No primeiro push, o Git abre o navegador para você autorizar o acesso

Atualize a página do GitHub: arquivos e commit estão lá, sem o `node_modules/`.

---

## Pense

:::question
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

## :icon[git-branch] Branches: linhas paralelas

Em equipe, a `main` guarda a versão que funciona. Cada mudança nasce numa **branch**, uma linha de commits independente, e só volta pronta.

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

Commits na branch não mexem na `main`: com `git switch main`, os arquivos voltam a ser os da `main`; de volta à branch, as suas mudanças reaparecem.

---

## :icon[git-merge] Merge: juntando à main

O **merge** traz os commits de outra branch para a branch em que você está:

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

- A `main` andou enquanto a branch existia, e nasceu um **commit de merge**; o merge de um Pull Request também cria um
- Se a `main` não andou, o Git só avança a `main` até a branch (**fast-forward**)
- O Git pode abrir um editor para a mensagem do merge: no Vim, `:wq` e <kbd>Enter</kbd>; no VS Code, feche a aba

---

## :icon[circle-alert] Issues: o que está quebrado

Uma **Issue** registra um bug ou uma tarefa no próprio repositório, com número, responsável e conversa. Aba **Issues**, **New issue**. O bug que você anotou no E02 vira a primeira:

- **Título:** Relatório com categoria em maiúscula mostra R$ NaN
- **Passos:** `npm run relatorio Audio`
- **Esperado:** os 3 produtos de áudio
- **Obtido:** `Produtos: 0` e `Preço médio: R$ NaN`

O GitHub dá um número à Issue: `#1`. Quem for corrigir cria a branch `fix/categoria-maiuscula`, e o Pull Request da correção diz `Closes #1`.

---

## :icon[send] Pull Request: pedindo para juntar

Em equipe, ninguém faz merge na `main` sozinho. O **Pull Request** (PR) pede para juntar uma branch, com espaço para conversa e revisão.

```bash
git push -u origin fix/categoria-maiuscula
```

No GitHub, clique em **Compare & pull request**, confira `base: main` e `compare: fix/categoria-maiuscula` e descreva:

- **O que muda:** o filtro compara a categoria em minúsculas, com `toLowerCase()`
- **Como testar:** `npm run relatorio Audio` mostra os 3 produtos de áudio
- `Closes #1`: a Issue fecha sozinha quando o PR entra na `main`

Em **Reviewers**, escolha o colega. Antes, ele precisa ser colaborador do repositório: **Settings**, **Collaborators**, **Add people**.

---

## :icon[messages-square] Revisão de código

Na aba **Files changed**, quem revisa lê cada linha; o `+` ao lado dela abre um comentário. No fim, escolhe uma opção:

| Opção | Quando usar |
|---|---|
| Comment | dúvida ou sugestão que não bloqueia |
| Approve | rodou, está claro e segue as convenções |
| Request changes | algo quebra ou fere uma regra da equipe |

- Rode o código: `git clone` do repositório do colega (uma vez), `git switch` para a branch, `npm install` e o "Como testar"
- Confira nomes em português e arquivos que não deveriam estar ali
- Comente o código, não a pessoa, e diga o porquê: "Que tal `categoria` em vez de `c`? O nome diz o que guarda."

---

## :icon[route] Da branch à main

:::center
![Animação: a branch fix/categoria-maiuscula sai da main e recebe dois commits, o Pull Request é aberto e aprovado na revisão, e o merge cria um commit que junta tudo à main](images/e03-branch-pr-merge.svg)
:::

Todo código da equipe faz este caminho: `git switch -c` cria a branch, os commits ficam nela, o Pull Request pede a revisão e só depois do **Approve** o merge leva tudo para a `main`.

---

## Pense

:::question
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

## :icon[swords] Conflito: duas mudanças na mesma linha

Quando duas branches mudam a mesma linha do mesmo arquivo, o Git não escolhe por você: ele para o merge e marca o trecho. Você está na `feature/preco-fone-b` e traz a `main`, onde o preço do fone já mudou:

```javascript
export const produtos = [
<<<<<<< HEAD
  { id: 1, nome: 'Fone Bluetooth', preco: 179.9, categoria: 'audio', destaque: true, avaliacao: 4.6,
=======
  { id: 1, nome: 'Fone Bluetooth', preco: 189.9, categoria: 'audio', destaque: true, avaliacao: 4.6,
>>>>>>> main
```

- Entre `<<<<<<< HEAD` e `=======`: a versão da branch em que você está
- Entre `=======` e `>>>>>>> main`: a versão que está chegando
- O Git compara linhas inteiras: a linha toda aparece duas vezes, mesmo que só o preço mude
- Com as marcas, o arquivo não é JavaScript válido: `SyntaxError` em todo script que o importa

---

## :icon[combine] Resolvendo o conflito

:::steps
1. `git status` marca o arquivo como *both modified*
2. No VS Code, acima do trecho: **Accept Current Change**, **Accept Incoming Change** ou **Accept Both Changes**
3. Combine com quem fez a outra mudança qual preço vale: conflito se resolve conversando
4. Apague as marcas (`git diff --check` acusa as esquecidas); o `npm run catalogo` roda sem erro e grava o JSON com o preço combinado
5. `git add` nos dois arquivos, `git commit -m "Resolve conflito no preço do fone"` e `git push`
:::

Se o PR mostra *This branch has conflicts that must be resolved*, traga a `main` atualizada: `git switch main`, `git pull`, `git switch feature/preco-fone-b` e `git merge main`.

:::tip
Perdeu-se no meio? `git merge --abort` desfaz o merge.
:::

---

## :icon[triangle-alert] Erros comuns

:::warning
- Trabalhar direto na `main` e só descobrir o problema no `push` recusado
- `git push --force` quando o push é recusado: apaga os commits de quem enviou antes. Rode `git pull` e depois `git push`
- Criar o `.gitignore` com `echo` no PowerShell: o arquivo sai em outra codificação e o Git não o lê. Crie pelo VS Code
- Fazer commit com as marcas `<<<<<<<` no arquivo: os scripts quebram
- Resolver à mão um conflito num arquivo gerado: resolva o `package.json` ou o `produtos.js` e gere de novo o lock (`npm install`) ou o `catalogo.json` (`npm run catalogo`)
- Aprovar um PR sem rodar o código
:::

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
