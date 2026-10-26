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

Programador Mobile: Módulo Específico · Encontro E41 · Aula 64 de 71

---

## O que você vai aprender

:::goal
- Montar o quadro da equipe no **GitHub Projects**, com uma issue por história
- Criar uma branch por história e escrever commits com tipo, como `feat:` e `fix:`
- Levar cada mudança à `main` por Pull Request com modelo e revisão obrigatória
- Proteger a `main` com uma regra do GitHub e conduzir a daily de 5 minutos
:::

---

## Por que isso importa

Véspera da apresentação. Bruno corrige um detalhe e faz `git push` direto na `main`, com a mensagem "teste". O app para de abrir. Ana passou a tarde na tela de Horários, a mesma que Carla refez sem saber. Ninguém lembra quem mexeu no quê, e o último commit que funcionava está perdido entre "ajustes" e "agora vai".

Nada disso é falta de talento: é falta de **combinados**, e o próprio GitHub pode fazê-los valer.

:::question
Que regras evitam esse caos sem depender da memória nem da boa vontade de ninguém?
:::

---

## :icon[workflow] O caminho de uma história

Toda mudança no app da equipe faz o mesmo caminho, do quadro à `main`:

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

## :icon[kanban] O quadro no GitHub Projects

Um **quadro kanban** mostra cada história como um cartão que anda da esquerda para a direita.

:::center
![Animação: o cartão #9 anda de Todo até Done, passando por In Progress e In review](images/e41-kanban-cartao.svg)
:::

:::steps
1. Na aba **Projects** do repositório, **New project**, modelo **Board**
2. Colunas **Todo**, **In Progress**, **In review** e **Done**; crie a que faltar no **+** à direita
3. Nas configurações do projeto, **Manage access**: a equipe entra com permissão **Write**
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

- Título curto, com verbo: "Cancelar agendamento"
- Rótulos `must`, `should`, `could` e `wont`, criados em **Issues**, **Labels**
- Em **Assignees**, quem pegou a história: uma pessoa por issue
- O GitHub dá um número à issue, como `#9`, que aparece na branch e no PR

---

## :icon[git-branch] Uma história, uma branch

```bash
git switch main
git pull                                    # parte da main atualizada
git switch -c feature/9-cancelar-agendamento
```

- O nome leva o tipo, o número da issue e poucas palavras: `feature/9-cancelar-agendamento`, `fix/14-domingo-nos-horarios`
- Branch curta: um ou dois dias de trabalho, nunca um sprint inteiro
- Divida por **funcionalidade**, não por camada: quem faz "cancelar" faz a tela, a regra e a chamada à API. Com "um faz as telas, outro a API", ninguém termina uma história sozinho
- A `main` andou? Traga-a para a sua branch com `git merge main` antes de abrir o PR, como no E22

---

## :icon[git-commit-horizontal] Commits com tipo

A mensagem continua começando por verbo, como no E22, e ganha um **tipo** na frente, no padrão **Conventional Commits**:

| Tipo | Quando | Exemplo |
|---|---|---|
| `feat:` | funcionalidade nova | `feat: mostra os horários livres do dia` |
| `fix:` | correção de bug | `fix: esconde o domingo da lista de dias` |
| `test:` | só testes | `test: cobre o cancelamento em cima da hora` |
| `refactor:` | reorganiza sem mudar o comportamento | `refactor: leva horariosLivres para src/regras` |
| `docs:` | README e documentação | `docs: adiciona o protótipo ao README` |
| `chore:` | configuração e dependências | `chore: instala o expo-router` |

Com o tipo, o `git log --oneline` vira um relatório da equipe.

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

## :icon[send] Pull Request com modelo

O arquivo `.github/pull_request_template.md`, na `main`, preenche a descrição de todo PR novo:

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

Quem abre o PR preenche tudo e escolhe o revisor da vez: em trio, A revisa B, B revisa C e C revisa A. O revisor faz o que aprendeu no E22: roda o código, confere os critérios e comenta o código, não a pessoa.

---

## :icon[shield-check] Protegendo a main

Uma **regra de proteção** faz o GitHub recusar o que a equipe combinou não fazer. Em **Settings**, **Rules**, **Rulesets**, **New ruleset**, **New branch ruleset**:

:::steps
1. Nome "main protegida" e **Enforcement status** em **Active**
2. Em **Target branches**, **Add target**, **Include default branch**
3. Deixe marcados **Restrict deletions** e **Block force pushes**
4. Marque **Require a pull request before merging**, com **Required approvals** em 1
5. Clique em **Create**
:::

:::center
![Diagrama: push direto na main recusado; o caminho aceito é branch, Pull Request, aprovação e merge](images/e41-main-protegida.svg)
:::

Agora ninguém faz push direto na `main`, nem quem criou o repositório, e o autor do PR não pode aprovar o próprio código. No plano gratuito, a regra só vale em **repositório público**.

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
A regra barrou o push direto na `main`, e os commits continuam no computador dele. Ele cria uma branch ali mesmo, envia e abre o PR:

```bash
git switch -c feature/9-cancelar-agendamento
git push -u origin feature/9-cancelar-agendamento
```

Depois do merge, `git switch main` e `git pull` deixam a `main` local igual à do GitHub. Nunca `--force`: a regra também o bloqueia, e com razão.
:::

---

## :icon[messages-square] A daily de 5 minutos

No começo de cada encontro de projeto, a equipe para **em pé, diante do quadro**, e cada pessoa responde em até um minuto:

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

## :icon[smartphone] O app nasce com Expo Router

Uma pessoa cria o app e o repositório; as outras clonam depois. Os passos do Expo Router são os do E16:

```bash
npx create-expo-app@latest agenda-facil --template blank
cd agenda-facil
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
# main e scheme, app/_layout.js e app/index.js, como no E16
npx expo start -c
git add .
git commit -m "chore: cria o app com Expo Router"
git branch -M main
git remote add origin https://github.com/equipe-agenda/agenda-facil.git
git push -u origin main
```

- Antes do `git remote`, crie no GitHub um repositório **público** e vazio, sem README, na conta de alguém da equipe ou numa organização gratuita, como `equipe-agenda`
- Em **Settings**, **Collaborators**, convide a equipe; cada pessoa aceita o convite e roda `git clone`
- O modelo de PR entra na `main` antes da regra de proteção

---

## :icon[book-open] README inicial

O README é a porta de entrada do projeto. Desde o primeiro dia, ele responde o que é o app, quem faz e como rodar:

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
