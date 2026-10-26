---
title: Git e GitHub em equipe
summary: Branches, merge, Pull Request com revisão, conflitos, o .gitignore do Expo, mensagens de commit e Issues.
module: ambiente-js
duration_minutes: 40
objectives:
  - Criar branches e juntá-las à main com merge
  - Abrir e revisar um Pull Request no GitHub
  - Resolver um conflito de merge no catalogo.json
  - Manter o repositório limpo com .gitignore, boas mensagens de commit e Issues
---

# Git e GitHub em equipe

Programador Mobile: Módulo Específico · Encontro E22 · Aula 26 de 71

---

## O que você vai aprender

:::goal
- Trabalhar em branches e juntá-las à `main` com merge
- Abrir um Pull Request e revisar o de um colega
- Resolver um conflito no `catalogo.json` sem perder o trabalho de ninguém
- Manter o repositório limpo com `.gitignore`, boas mensagens e Issues
:::

---

## Duas pessoas, um catálogo

Ana ajusta o preço do Fone Bluetooth no `catalogo.json` para a promoção de sexta. Na mesma hora, Bruno corrige a descrição do mesmo produto. Os dois trabalham direto na `main`.

Ana envia primeiro. O `git push` do Bruno é recusado; ele repete com `--force` e funciona. Ninguém percebe que a promoção sumiu, e na sexta o app mostra o preço antigo para todos os clientes.

:::question
Como duas pessoas mexem no mesmo app ao mesmo tempo sem apagar o trabalho uma da outra?
:::

---

## :icon[workflow] O fluxo completo do Git

Cada mudança passa por três lugares no seu computador antes de chegar ao GitHub: a **pasta de trabalho**, a **área de preparação** (*staging*) e o **repositório local**.

:::center
![Diagrama: git add leva da pasta de trabalho à área de preparação, git commit grava no repositório local, git push envia ao GitHub e git pull traz de volta](images/e22-fluxo-git.svg)
:::

- `git add arquivo` prepara a mudança; `git commit -m "..."` grava a fotografia
- `git push` envia ao GitHub; `git pull` traz os commits de lá e junta aos seus
- `git status` mostra o que mudou e o que já está preparado

O `push` é recusado quando o GitHub tem commits que você não tem: rode `git pull` primeiro, nunca `--force`.

---

## :icon[git-branch] Branches: linhas paralelas

Uma **branch** é uma linha de commits independente. A `main` guarda a versão que funciona; cada funcionalidade nasce numa branch própria e só volta para a `main` pronta.

```bash
git switch main
git pull                                   # parte da main atualizada
git switch -c feature/relatorio-categoria  # cria a branch e entra nela
git branch                                 # lista as branches; o * marca onde você está
```

| Prefixo | Para quê |
|---|---|
| `feature/` | funcionalidade nova |
| `fix/` | correção de bug |
| `chore/` | manutenção, como atualizar dependências |

Commits na branch não mexem na `main`. Em Git antigo, `git checkout -b` faz o mesmo que `git switch -c`.

---

## :icon[git-merge] Merge: juntando à main

O **merge** traz os commits de outra branch para a branch em que você está:

```bash
git switch main
git merge feature/relatorio-categoria
git log --oneline --graph
```

```plaintext
*   a41c9e2 Merge branch 'feature/relatorio-categoria'
|\
| * 7d03b18 Lista os produtos da categoria
| * 2f6a5c1 Adiciona o script relatorio
* | 5c2e8d0 Alinha dependências ao SDK
|/
* 9e1b7a4 E21: catálogo em JSON e relatório
```

- Aqui a `main` andou enquanto a branch existia, e nasceu um **commit de merge** que une as duas linhas; o merge de um Pull Request também cria um
- Se a `main` não andou, o Git só avança a `main` até o último commit da branch (**fast-forward**)
- Branch juntada pode ser apagada: `git branch -d feature/relatorio-categoria`

---

## :icon[send] Pull Request: pedindo para juntar

Em equipe, ninguém faz merge na `main` sozinho. O **Pull Request** (PR) é o pedido para juntar uma branch, com espaço para conversa e revisão.

```bash
git push -u origin feature/relatorio-categoria
```

No GitHub, clique em **Compare & pull request**, confira `base: main` e `compare: feature/relatorio-categoria` e escreva a descrição:

- **O que muda:** script `relatorio` e, com `--categoria`, a lista dos produtos dela
- **Como testar:** `npm run relatorio` e `npm run relatorio -- --categoria=livros`
- **Issue:** `Closes #1`

Em **Reviewers**, escolha o colega e clique em **Create pull request**. Para ser revisor, ele precisa ser colaborador do repositório (**Settings**, **Collaborators**).

---

## :icon[messages-square] Revisão de código

Na aba **Files changed**, o revisor lê cada linha alterada; o `+` ao lado da linha abre um comentário. No fim, ele envia a revisão com uma destas opções:

| Opção | Quando usar |
|---|---|
| Comment | dúvida ou sugestão que não bloqueia |
| Approve | rodou, está claro e segue as convenções |
| Request changes | algo quebra ou fere uma regra da equipe |

- Rode o código: `git fetch`, `git switch` para a branch e o "Como testar"
- Confira nomes em português, ponto e vírgula e arquivos que não deveriam estar ali
- Comente o código, não a pessoa, e diga o porquê: "Que tal `produtosDaCategoria` em vez de `lista2`? O nome diz o que guarda."

---

## :icon[route] Da branch à main

:::center
![Animação: a branch feature/relatorio-categoria sai da main e recebe dois commits, o Pull Request é aberto e aprovado na revisão, e o merge cria um commit que junta tudo à main](images/e22-branch-pr-merge.svg)
:::

Todo código da equipe faz este caminho: `git switch -c` cria a branch, os commits ficam nela, o Pull Request pede a revisão e só depois do **Approve** o merge leva tudo para a `main`.

---

## Pense

:::question
Você revisa o PR "Relatório por categoria". Ele altera `package.json`, `scripts/relatorio-catalogo.mjs` e `.expo/devices.json`, num único commit chamado "aaa". O trecho do `package.json`:

```json
"scripts": {
  "start": "expo start",
  "relatorio": "node script/relatorio-catalogo.mjs"
}
```

Que comentários você deixa, e com qual opção envia a revisão?
:::

:::tip Resposta
- O script aponta para `script/`, mas a pasta é `scripts/`: `npm run relatorio` falha com `Cannot find module`. Peça para rodar antes de abrir o PR
- `.expo/` é configuração local do Expo e deveria ficar fora, pelo `.gitignore`
- "aaa" não conta nada: sugira "Adiciona o script relatorio" para os próximos commits

Envie com **Request changes**, porque o script quebra, e com tom de sugestão.
:::

---

## :icon[swords] Conflito: duas mudanças na mesma linha

Quando duas branches mudam a mesma linha do mesmo arquivo, o Git não escolhe por você: ele para o merge e marca o trecho. Você está na `feature/preco-fone-b` e traz a `main`, onde o preço já mudou:

```json
{
  "id": 1,
  "nome": "Fone Bluetooth",
<<<<<<< HEAD
  "preco": 179.9,
=======
  "preco": 189.9,
>>>>>>> main
  "categoria": "audio",
```

- Entre `<<<<<<< HEAD` e `=======`: a versão da branch em que você está
- Entre `=======` e `>>>>>>> main`: a versão que está chegando
- Com as marcas no arquivo, o JSON é inválido e o app não abre
- Mudanças em linhas distantes do mesmo arquivo, o Git junta sozinho

---

## :icon[combine] Resolvendo o conflito

:::steps
1. `git status` lista o arquivo em conflito como *both modified*
2. Abra no VS Code: acima do trecho aparecem **Accept Current Change**, **Accept Incoming Change** e **Accept Both Changes**
3. Decida com quem fez a outra mudança: qual preço vale? Conflito se resolve conversando
4. Apague as marcas que sobrarem e confira o JSON: `npm run relatorio` roda e o app abre
5. `git add src/data/catalogo.json` e `git commit -m "Resolve conflito no preço do fone"`
:::

:::tip
Se você se perdeu no meio, `git merge --abort` desfaz o merge e devolve os arquivos como estavam antes dele.
:::

---

## Pratique

:::example Desafio
Ana já fez o merge do PR dela, que muda o preço do fone. O seu PR, da branch `feature/preco-fone-b`, agora mostra no GitHub: *This branch has conflicts that must be resolved*. Escreva, em ordem, os comandos para trazer a `main` para a sua branch, resolver o conflito e atualizar o PR.
:::

:::tip Resposta
```bash
git switch main
git pull                          # a main com o PR da Ana
git switch feature/preco-fone-b
git merge main                    # o conflito aparece aqui
# combine o preço com a Ana e apague as marcas
git add src/data/catalogo.json
git commit -m "Resolve conflito no preço do fone"
git push                          # o PR se atualiza sozinho
```

O aviso some do PR e o botão de merge volta a ficar verde.
:::

---

## :icon[eye-off] O .gitignore do Expo

O `create-expo-app` já cria um `.gitignore`. Trecho dele:

```plaintext
node_modules/
.expo/
dist/
web-build/
*.jks
*.p8
*.p12
*.key
.env*.local
```

| Linha | Por que fica fora |
|---|---|
| `node_modules/` | qualquer um recria com `npm install` |
| `.expo/` | configuração local do servidor do Expo |
| `dist/` e `web-build/` | arquivos gerados pelos builds |
| `*.jks`, `*.p8`, `*.p12`, `*.key` | chaves de assinatura do app: segredo |
| `.env*.local` | variáveis locais (no E24 entra o `.env`) |

Arquivo que já entrou num commit continua no Git: `git rm -r --cached .expo` e um commit o tiram.

---

## :icon[git-commit-horizontal] Mensagens de commit

Uma boa mensagem diz **o que** mudou numa linha curta, começando por verbo:

| Ruim | Boa |
|---|---|
| `ajustes` | `Lista os produtos da categoria` |
| `aaa` | `Adiciona o script relatorio` |
| `final agora vai` | `Corrige o preço do Fone Bluetooth` |
| `relatorio e carrinho e tema` | três commits, um por assunto |

- Até uns 50 caracteres: é o que o `git log --oneline` e o GitHub mostram
- Um assunto por commit: fica fácil revisar e desfazer
- Nos laboratórios, o commit de entrega continua com o prefixo do encontro: `E22: ...`
- Muitas equipes combinam prefixos como `feat:` e `fix:`; você volta a isso no E41

---

## :icon[circle-alert] Issues: o que está quebrado e o que fazer

Uma **Issue** registra um bug ou uma tarefa no próprio repositório, com número, responsável e conversa. Aba **Issues**, **New issue**:

- **Título:** Relatório recusa categoria com maiúscula
- **Passos:** `npm run relatorio -- --categoria=Audio`
- **Esperado:** o relatório de áudio
- **Obtido:** `Categoria "Audio" não existe.`

O GitHub dá um número à Issue, como `#1`. Na descrição do PR que corrige o bug, escreva `Closes #1`: quando o PR entra na `main`, a Issue fecha sozinha e fica ligada ao código que a resolveu.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Trabalhar direto na `main` e só descobrir o problema no `push` recusado
- `git push --force` para "resolver" um push recusado: apaga os commits de quem enviou antes
- Fazer commit com as marcas `<<<<<<<` no arquivo: o JSON quebra e o app não abre
- Resolver à mão um conflito no `package-lock.json`: resolva o `package.json` e rode `npm install` para gerar o lock de novo
- Criar a branch sem `git pull` antes: ela nasce de uma `main` velha
- Aprovar um PR sem rodar o código
:::

---

## Resumo

:::summary
- Cada funcionalidade nasce numa branch (`git switch -c feature/...`) e volta para a `main` por merge
- Em equipe, o merge passa por um Pull Request com descrição, "Como testar" e revisão de um colega
- Conflito é a mesma linha mudada em duas branches: converse, apague as marcas, `git add` e `git commit`
- O `.gitignore` do Expo deixa fora `node_modules/`, `.expo/`, builds e chaves de assinatura
- Mensagens curtas que começam por verbo e Issues ligadas ao PR com `Closes #N` contam a história do app
:::

---

## :icon[flask-conical] No laboratório

O script `relatorio` entra pelo caminho de uma equipe.

:::steps
1. Na `main`, `npx expo-doctor` sem problemas (corrija com `npx expo install --check`)
2. Issue "Listar os produtos da categoria" e branch `feature/relatorio-categoria`
3. Script `relatorio`; com `--categoria`, a lista dos produtos dela
4. Commit "E22: script relatorio e produtos da categoria" e `git push -u`
5. PR com "Como testar" e `Closes #N`; o colega como revisor
6. Revise o PR do colega, atenda aos comentários no seu e faça o merge
7. Em dupla, crie e resolva um conflito no preço do fone
:::

**Critérios de entrega**: `--categoria=audio` lista os produtos de áudio; `expo-doctor` sem problemas; PR com revisão e merge; Issue fechada; conflito sem marcas. Entregue o link do repositório no sistema.
