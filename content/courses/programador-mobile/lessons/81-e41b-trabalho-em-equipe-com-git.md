---
title: Trabalho em equipe com Git
summary: Quadro no GitHub Projects, branch por história, commits com tipo, PR revisado, main protegida e daily de 5 minutos.
module: integracao
duration_minutes: 40
objectives:
  - Organizar o backlog num quadro kanban do GitHub Projects, com uma issue por história
  - Levar cada história da branch ao merge por Pull Request revisado, com commits padronizados
  - Proteger a main com uma regra do GitHub
  - Conduzir uma daily de 5 minutos diante do quadro
---

# Trabalho em equipe com Git

Programador Mobile · Encontro E41 · Aula 81 de 89

---

## O que você vai aprender

:::goal
- Montar o quadro da equipe no **GitHub Projects**, com uma issue por história
- Criar uma branch por história e escrever commits com tipo, como `feat:` e `fix:`
- Levar cada mudança à `main` por Pull Request com modelo e revisão obrigatória
- Proteger a `main` com uma regra do GitHub e conduzir a daily de 5 minutos
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **issue** | um cartão de tarefa no GitHub, com número, como `#9` |
| **quadro kanban** | um quadro com colunas, em que cada tarefa anda da esquerda para a direita até ficar pronta |
| **Pull Request (PR)** | o pedido para juntar a sua branch à `main`, com a revisão de um colega |
| **regra de proteção** | uma regra do GitHub que recusa o que a equipe combinou não fazer |
| **daily** | a conversa de 5 minutos, em pé, no começo de cada encontro |
| **README** | o texto de apresentação do projeto, na página do repositório |

---

## Por que isso importa

Véspera da apresentação. Bruno corrige um detalhe e faz `git push` direto na `main`, com a mensagem "teste". O app para de abrir. Ana passou a tarde na tela de Horários, a mesma que Carla refez sem saber. Ninguém lembra quem mexeu no quê, e o último commit que funcionava está perdido entre "ajustes" e "agora vai".

Nada disso é falta de talento: é falta de **combinados**, as regras que a equipe decide seguir. E o próprio GitHub pode fazê-las valer.

:::question
Que regras evitam esse caos sem depender da memória nem da boa vontade de ninguém?
:::

---

## :icon[workflow] O caminho de uma história

No E03, uma mudança chegou à `main` por uma **branch**, o rascunho paralelo, e um **Pull Request**, o pedido de revisão antes de juntar. Em equipe, toda história faz esse caminho:

:::steps
1. A história vira uma **issue** no quadro, com critérios de aceite
2. Quem pega a issue move o cartão para **In Progress** e cria uma branch para ela
3. Commits pequenos, cada um com tipo: `feat:`, `fix:`, `test:`
4. `git push` e um **Pull Request** com o modelo da equipe e `Closes #N`
5. Um colega revisa, roda no celular e aprova
6. Merge na `main`: a issue fecha e o cartão vai para **Done**
:::

Ninguém faz commit direto na `main`. Hoje vocês montam o que faz isso valer.

---

## O quadro

Na lanchonete cheia, como você sabe se o seu lanche já está pronto?

---

## :icon[kanban] O quadro kanban

Um **quadro kanban** (palavra japonesa para "placa") mostra cada história como um cartão que anda da esquerda para a direita. É como o painel de pedidos de uma lanchonete: cada pedido aparece em "preparando" e passa para "pronto".

:::center
![Animação: o cartão #9 anda de Todo até Done, passando por In Progress e In review](images/e41-kanban-cartao.svg)
:::

| Coluna | Quer dizer |
|---|---|
| **Todo** | a fazer |
| **In Progress** | em andamento: alguém está fazendo |
| **In review** | em revisão: o PR espera um colega |
| **Done** | feito: entrou na `main` |

---

## :icon[settings] O quadro no GitHub Projects

O **GitHub Projects** é o quadro kanban que vem no GitHub. Uma pessoa da equipe monta:

:::steps
1. Na aba **Projects** do repositório, **New project** (novo projeto), modelo **Board** (quadro)
2. Colunas **Todo**, **In Progress**, **In review** e **Done**; crie a que faltar no **+** à direita
3. Nas configurações do projeto, **Manage access** (acesso): a equipe entra com permissão **Write**, a de escrever
4. **Add item**, **Create new issue**: a issue nasce no repositório e já no quadro
:::

Combinado: **um cartão em In Progress por pessoa**. Terminou? Revise o PR de alguém e só então pegue outro. A automação do Projects leva para Done a issue fechada.

---

## :icon[file-text] A issue de uma história

Cada issue traz a história, os critérios como lista de tarefas e um rótulo de prioridade:

```markdown
**História:** como cliente, quero cancelar um agendamento até
2 horas antes, para liberar o horário para outra pessoa.

**Critérios de aceite**
- [ ] Dado um corte às 14h30, quando são 12h, então o botão Cancelar aparece
- [ ] Dado o mesmo corte, quando são 13h, então o botão não aparece
- [ ] Dado que cancelei, então o status vira Cancelado e o horário volta a ficar livre
```

- `- [ ]` vira uma caixinha de marcar: quem testa marca cada critério atendido
- Título curto, com verbo: "Cancelar agendamento"
- Rótulos (*labels*) `must`, `should`, `could` e `wont`, criados em **Issues**, **Labels**
- Em **Assignees** (responsáveis), quem pegou a história: uma pessoa por issue
- O GitHub dá um número à issue, como `#9`, que aparece na branch e no PR

---

## Branches e commits

Duas pessoas no mesmo código: como uma não apaga o trabalho da outra?

---

## :icon[git-branch] Uma história, uma branch

Cada história ganha a sua **branch**: o rascunho paralelo, em que dá para mexer sem estragar a versão boa da `main`. Antes de criar, traga a `main` atualizada:

```bash
git switch main
git pull                                    # parte da main atualizada
git switch -c feature/9-cancelar-agendamento
```

| Linha | O que ela diz |
|---|---|
| `git switch main` | "vá para a `main`" |
| `git pull` | "traga da nuvem o que os colegas já juntaram" |
| `git switch -c ...` | "crie esta branch e entre nela" (`-c` de *create*, criar) |

São os comandos do E03. O que muda em equipe é o nome da branch e o tamanho dela.

---

## :icon[split] Como nomear e dividir as branches

- O nome leva o tipo, o número da issue e poucas palavras: `feature/9-cancelar-agendamento`, `fix/14-domingo-nos-horarios`
- Branch curta: um ou dois dias de trabalho, nunca um sprint inteiro
- Divida por **funcionalidade**, não por camada: quem faz "cancelar" faz a tela, a regra e a chamada à API. Com "um faz as telas, outro a API", ninguém termina uma história sozinho
- A `main` andou? Traga-a para a sua branch com `git merge main` antes de abrir o PR, como no E03

---

## :icon[git-commit-horizontal] Commits com tipo

Um **commit** é a foto do projeto naquele momento, com legenda. Em equipe, a legenda ganha um **tipo** na frente, como o nome do álbum em que a foto fica. É o padrão **Conventional Commits** (commits combinados). A mensagem continua começando por verbo, como no E03.

| Tipo | Quando | Exemplo |
|---|---|---|
| `feat:` | funcionalidade nova | `feat: mostra os horários livres do dia` |
| `fix:` | correção de bug | `fix: esconde o domingo da lista de dias` |
| `test:` | só testes | `test: cobre o cancelamento em cima da hora` |

`feat` vem de *feature* (funcionalidade); `fix` quer dizer consertar.

---

## :icon[tags] Mais três tipos de commit

| Tipo | Quando | Exemplo |
|---|---|---|
| `refactor:` | reorganiza sem mudar o comportamento | `refactor: leva horariosLivres para src/regras` |
| `docs:` | README e documentação | `docs: adiciona o protótipo ao README` |
| `chore:` | configuração e dependências | `chore: instala o expo-router` |

*Refactor* é reorganizar; *docs*, documentos; *chore*, tarefa de rotina.

Com o tipo, o `git log --oneline`, que lista um commit por linha, vira um relatório da equipe.

---

## Pratique

:::example Desafio
Você pegou a issue #7, "Ver horários livres do profissional". Escreva o nome da branch, as mensagens de três commits e a linha do PR que fecha a issue. Os commits: a regra `horariosLivres` com testes; a tela Horários usando a regra; a correção do domingo, que aparecia como dia de atendimento.
:::

:::tip Resposta
```bash
git switch -c feature/7-horarios-livres
git commit -m "feat: calcula os horários livres do profissional"
git commit -m "feat: mostra os horários livres na tela Horarios"
git commit -m "fix: esconde o domingo da lista de dias"
```

Na descrição do PR: `Closes #7`. Os testes podem vir num commit `test:` à parte. O que não vale é "ajustes", nem um commit só com tudo junto.
:::

---

## Pull Request

Antes de entregar um trabalho em grupo, por que pedir para um colega ler?

---

## :icon[send] Pull Request com modelo

O **Pull Request** (PR) é o pedido para um colega revisar a sua branch antes de juntar à `main`. Para todo PR trazer as mesmas informações, a equipe usa um **modelo**: um formulário com os campos já escritos.

- O modelo é o arquivo `.github/pull_request_template.md`, na `main`
- Ele preenche sozinho a descrição de todo PR novo
- Quem abre o PR preenche tudo e escolhe o revisor da vez: em trio, A revisa B, B revisa C e C revisa A
- O revisor faz o que aprendeu no E03: roda o código, confere os critérios e comenta o código, não a pessoa

---

## :icon[file-text] O modelo de PR

```markdown
### O que muda
Uma ou duas frases.

### Como testar
1. Passo a passo no celular

### Critérios de aceite
- [ ] Copie da issue e marque os atendidos

### Checklist
- [ ] Rodei no celular, nos temas claro e escuro
- [ ] `npm test` passa, quando houver testes

Closes #
```

- `###` abre o título de cada parte
- `- [ ]` vira uma caixinha, marcada com um clique
- **Checklist** é a lista de conferência: o que o autor confere antes de pedir a revisão
- `Closes #` mais o número da issue fecha a issue no merge, como no E03

---

## :icon[send] Um PR na prática

Bruno terminou a issue #9 e abriu o PR. O modelo veio pronto; ele só preencheu:

```markdown
### O que muda
Botão Cancelar em Meus agendamentos, até 2 horas antes.

### Como testar
1. Agende um corte para daqui a 3 horas e toque em Cancelar
2. Confira o status Cancelado e o horário livre de novo em Horários

### Critérios de aceite
- [x] Dado um corte às 14h30, quando são 12h, então o botão Cancelar aparece
- [x] Dado o mesmo corte, quando são 13h, então o botão não aparece

Closes #9
```

- `[x]` é a caixinha marcada: o critério foi conferido no celular
- Revisora da vez: Carla. Ela segue o "Como testar" e aprova ou comenta
- No merge, a issue #9 fecha e o cartão vai sozinho para Done

---

## Proteger a main

Num prédio com porteiro, quem consegue entrar?

---

## :icon[shield-check] Protegendo a main

Uma **regra de proteção** faz o GitHub recusar o que a equipe combinou não fazer. Pense no porteiro de um prédio: só entra quem foi anunciado. Na `main` protegida, só entra o que chega por um PR aprovado.

:::center
![Diagrama: push direto na main recusado; o caminho aceito é branch, Pull Request, aprovação e merge](images/e41-main-protegida.svg)
:::

- Ninguém faz push direto na `main`, nem quem criou o repositório
- O autor do PR não pode aprovar o próprio código
- No plano gratuito, a regra só vale em **repositório público**

---

## :icon[settings] Criando a regra

Em **Settings** (configurações), **Rules** (regras), **Rulesets**, **New ruleset**, **New branch ruleset**:

:::steps
1. Nome "main protegida" e **Enforcement status** em **Active**
2. Em **Target branches**, **Add target**, **Include default branch**
3. Deixe marcados **Restrict deletions** e **Block force pushes**
4. Marque **Require a pull request before merging**, com **Required approvals** em 1
5. Clique em **Create**
:::

| Opção | O que ela faz |
|---|---|
| **Active** | liga a regra |
| **Include default branch** | vale para a `main` |
| **Restrict deletions** e **Block force pushes** | ninguém apaga a `main` nem passa por cima dela com `--force` |
| **Require a pull request** | só entra por PR, com 1 aprovação |

---

## :icon[shield-check] A regra na prática

Com a regra ativa, o porteiro responde assim:

| Tentativa | O que o GitHub faz |
|---|---|
| `git push` direto na `main` | recusa, com `GH013: Repository rule violations` |
| `git push --force` na `main` | recusa: a regra bloqueia force push |
| merge de um PR sem aprovação | bloqueia o botão de merge: `Review required` |
| o autor aprova o próprio PR | não deixa: a aprovação vem de outra pessoa |
| merge de um PR aprovado por um colega | libera o merge |

Repare: nenhum caminho apaga trabalho. O que foi recusado continua no computador de quem tentou.

---

## Pense

:::question
Com a regra ativa, Bruno fez dois commits na `main` do computador dele e rodou `git push`. O terminal respondeu:

```plaintext
remote: error: GH013: Repository rule violations found for refs/heads/main.
remote: - Changes must be made through a pull request.
 ! [remote rejected] main -> main (push declined due to repository rule violations)
```

O que aconteceu, e como ele entrega os dois commits sem perder nada?
:::

:::tip Resposta
A mensagem diz: "as mudanças precisam passar por um pull request". A regra barrou o push direto na `main`, e os commits continuam no computador dele. Ele cria uma branch ali mesmo, envia e abre o PR:

```bash
git switch -c feature/9-cancelar-agendamento
git push -u origin feature/9-cancelar-agendamento
```

Depois do merge, `git switch main` e `git pull` deixam a `main` local igual à do GitHub. Nunca `--force`: a regra também o bloqueia, e com razão.
:::

---

## A daily

O que o time combina no vestiário, em poucos minutos, antes do jogo?

---

## :icon[messages-square] A daily de 5 minutos

A **daily** (do inglês, "diária") é a conversa rápida da equipe, como a do time no vestiário antes do jogo. No começo de cada encontro de projeto, a equipe para **em pé, diante do quadro**, e cada pessoa responde em até um minuto:

:::steps
1. O que terminei desde a última daily?
2. O que faço agora? É o cartão que vai para In Progress
3. O que está me travando?
:::

- A daily só **mostra** os problemas; quem precisa resolve depois, sem a equipe inteira parada
- Cartão parado em In review? Alguém se oferece para revisar logo em seguida
- Ninguém fica travado mais de 15 minutos sem pedir ajuda
- A cada encontro, uma pessoa diferente conduz, com cronômetro

---

## :icon[timer] A daily na prática

Começo do E43, equipe da Agenda, cronômetro ligado:

- **Ana**: "Terminei a regra dos horários livres, com testes. Antes de pegar outra, reviso o PR do Bruno. Nada me trava."
- **Bruno**: "Meu PR da tela Serviços está em In review desde ontem. Agora faço a Confirmação."
- **Carla**: "Hoje termino Meus agendamentos. Estou travada no IP do `.env`."

Três minutos, todos em pé. Depois da daily, longe do quadro, Bruno ajuda Carla com o `.env`. O problema apareceu na daily, mas foi resolvido fora dela.

---

## O repositório da equipe

Três pessoas, um app: onde mora o código que todos usam?

---

## :icon[smartphone] O app nasce com Expo Router

O **repositório da equipe** guarda o app no GitHub, e todos trabalham nele. Uma pessoa cria o app e o repositório; as outras clonam depois. Os passos do Expo Router são os do E36, e os do Git, os do E03:

```bash
npx create-expo-app@latest agenda-facil --template blank
cd agenda-facil
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
# main e scheme, app/_layout.js e app/index.js, como no E36
npx expo start -c
git add .
git commit -m "chore: cria o app com Expo Router"
git branch -M main
git remote add origin https://github.com/equipe-agenda/agenda-facil.git
git push -u origin main
```

O commit do app é `chore:`: é configuração, ainda sem funcionalidade.

---

## :icon[users] O repositório e a equipe

- Antes do `git remote`, crie no GitHub um repositório **público** e vazio, sem README, na conta de alguém da equipe ou numa organização gratuita, como `equipe-agenda`
- Em **Settings**, **Collaborators** (colaboradores), convide a equipe; cada pessoa aceita o convite e roda `git clone`
- O modelo de PR entra na `main` antes da regra de proteção: depois dela, até o modelo precisaria de PR

---

## :icon[book-open] README inicial

O **README** é a porta de entrada do projeto, como o manual que vem na caixa de um aparelho. Desde o primeiro dia, ele responde o que é o app, quem faz e como rodar:

```markdown
# Agenda Fácil

App para clientes de barbearia marcarem horário pelo celular, sem ligar.

**Problema:** no horário de pico ninguém atende o telefone, e às vezes
dois clientes chegam para o mesmo horário.

**Equipe:** Ana Souza (@anasouza), Bruno Lima (@brunolima), Carla Dias (@carladias)
**Quadro:** link do GitHub Projects

### Protótipo
![Tela Serviços desenhada em papel, com preço e duração](docs/prototipo/01-servicos.jpg)

### Como rodar
`npm install`, `npx expo start` e o QR code no Expo Go.
```

As fotos do protótipo ficam em `docs/prototipo/`. No E44, o README ganha telas reais, decisões e vídeo.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `GH013: Repository rule violations` | push direto na `main` protegida | criar uma branch, enviar e abrir o PR |
| `src refspec main does not match any` | a branch local tem outro nome, como `master` | `git branch -M main` e push de novo |
| `Permission to ... denied` | a pessoa ainda não é colaboradora | aceitar o convite que chegou por e-mail |
| `Review required` no PR | falta a aprovação de um colega | pedir a revisão a outra pessoa da equipe |

---

## :icon[triangle-alert] Erros comuns

:::warning
- Repositório privado no plano gratuito: a regra de proteção não vale
- Convite de colaborador esquecido no e-mail: sem aceitar, a pessoa não faz push nem revisa
- Aprovar um PR sem rodar no celular, só para destravar o colega
- Branch que dura o sprint inteiro e chega à `main` com conflito em tudo
- Dividir por camada ("eu faço as telas, você a API"): ninguém termina uma história
- Daily que vira reunião de meia hora, ou que não acontece
:::

---

## Resumo

:::summary
- Cada história é uma issue no quadro do GitHub Projects, com critérios e rótulo de prioridade
- Uma branch por história, com o número da issue no nome, e commits com tipo: `feat:`, `fix:`, `test:`
- Toda mudança chega à `main` por PR com modelo, `Closes #N` e a aprovação de um colega
- A regra de proteção faz o GitHub recusar push direto, force push e merge sem aprovação
- A daily de 5 minutos, diante do quadro, mostra o que andou e o que está travado
:::

---

## :icon[flask-conical] No laboratório

:::steps
1. Briefing escolhido e as 5 telas em papel, com teste do corredor
2. App em Expo Router num repositório público, com o modelo de PR na `main`
3. Colaboradores convidados e a regra "main protegida" ativa
4. Quadro com 12 a 20 histórias em issues, com critérios, rótulo MoSCoW e em ordem
5. Issue do README, branch `docs/readme-e-prototipo` e README com as fotos do protótipo
6. PR revisado por outra pessoa da equipe e merge, com o commit `docs: E41 README e protótipo`
7. Daily de 5 minutos diante do quadro
:::

**Critérios**: push direto na `main` recusado; 12 a 20 issues no quadro; 5 telas no README; o app abre no celular de todos. Entregue o link do repositório no sistema.
