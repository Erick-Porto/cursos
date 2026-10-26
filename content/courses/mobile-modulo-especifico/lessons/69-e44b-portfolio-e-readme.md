---
title: Portfólio e README
summary: Escreva o README que recruta, grave o vídeo de demonstração e leve o app da equipe ao portfólio e ao LinkedIn.
module: integracao
duration_minutes: 40
objectives:
  - Escrever um README com problema, solução, telas, como rodar, tecnologias e decisões
  - Gravar um vídeo de demonstração de 60 a 90 segundos e publicar o APK numa Release
  - Organizar o portfólio no GitHub e no LinkedIn, deixando clara a sua parte no projeto
  - Ensaiar um pitch de 5 minutos com demonstração ao vivo
---

# Portfólio e README

Programador Mobile: Módulo Específico · Encontro E44 · Aula 69 de 71

---

## O que você vai aprender

:::goal
- Montar o README que recruta, na ordem em que as pessoas leem
- Mostrar as telas com capturas e um vídeo curto, e publicar o APK numa Release
- Escrever as decisões do projeto com o porquê de cada uma
- Arrumar o perfil do GitHub e do LinkedIn em volta de três projetos
- Ensaiar o pitch de 5 minutos da equipe
:::

---

## Trinta segundos no seu repositório

Uma recrutadora tem 40 candidaturas para uma vaga de programador mobile júnior. No seu currículo, ela clica no link do GitHub e abre o repositório do app da equipe. O README tem uma linha: `# agenda-app`.

Ela não clona, não instala e não roda nada. Fecha a aba e abre o próximo candidato.

O app pode estar ótimo. Se o README não mostra, ninguém fica sabendo.

:::question
Em 30 segundos de leitura, o que o README precisa mostrar para a pessoa querer ver mais?
:::

---

## :icon[file-text] O README que recruta

Cada seção responde a uma pergunta de quem lê, na ordem em que ela surge:

| Seção | Responde |
|---|---|
| Nome, frase e vídeo | O que é? Funciona mesmo? |
| Problema | Para quem é, e por que existe? |
| Solução e telas | O que ele faz? |
| Como rodar e APK | Consigo testar agora? |
| Tecnologias e decisões | Como foi feito, e por quê? |
| Equipe | Quem fez o quê? |

---

## :icon[file-text] Quem lê para no meio

:::center
![Diagrama: o README na ordem de quem lê; nome, frase e vídeo, problema e solução e telas ficam nos 30 segundos de leitura, acima da linha em que a pessoa para; como rodar e APK, tecnologias e decisões e equipe vêm depois](images/e44-readme-ordem.svg)
:::

O mais importante vai no topo. Instalação no começo é o erro mais comum, porque a pessoa ainda nem sabe o que o app faz.

---

## :icon[target] O topo: nome, frase e problema

```markdown
# Agenda Fácil

App para clientes de barbearia marcarem horário pelo celular, sem ligar.

### Problema
A Barbearia do Bairro marca horários por telefone e num caderno. No pico,
ninguém atende, e às vezes dois clientes chegam para o mesmo horário.

### Solução
- Serviços com preço e duração
- Horários livres do dia, sem conflito com outro agendamento
- Agendar e cancelar em poucos toques, com "Meus agendamentos"
```

- É o README do E41 crescendo: as mesmas seções `###`, agora completas
- A frase de uma linha diz **o que é** e **para quem**; o vídeo entra logo abaixo dela
- O problema é uma situação concreta, não "facilitar a vida das pessoas"
- A solução lista o que o app faz hoje, não o que um dia fará

---

## :icon[image] Telas: mostre antes de explicar

```markdown
### Telas
| Serviços | Horários | Meus agendamentos |
|---|---|---|
| ![Lista de serviços com preço e duração](docs/servicos.png) | ![Grade de horários livres do dia](docs/horarios.png) | ![Agendamentos com status](docs/agendamentos.png) |
```

- De 3 a 5 capturas na pasta `docs/`, numa tabela para ficarem lado a lado
- Capture no celular, com o APK e dados realistas: nada de "teste", "asdf" ou lista vazia
- O texto entre colchetes descreve a tela para quem usa leitor de tela
- Uma captura no tema escuro mostra que o app foi cuidado nos dois temas

---

## :icon[terminal] Como rodar e o APK

No README, a seção **Como rodar** lista os comandos na ordem, a partir de um clone:

```bash
git clone https://github.com/equipe-agenda/agenda-facil.git
cd agenda-facil
npm install
cp .env.example .env                  # troque o IP pelo do seu computador
npx json-server db.json --port 3000   # deixe este terminal aberto
npx expo start                        # num segundo terminal
```

- Teste os passos num clone limpo: se faltar um, quem tenta desiste
- APK: baixe o `.apk` da página do build e anexe numa **Release** do GitHub com a tag `v1.0.0`, a mesma `version` do `app.json`; ponha o link no README
- Diga do que o APK depende: o `json-server` ligado e o celular na mesma Wi-Fi

---

## :icon[lightbulb] Tecnologias e decisões

```markdown
### Tecnologias
React Native, Expo, Expo Router, AsyncStorage, Jest, json-server e EAS Build.

### Decisões
- **Pastas por funcionalidade** (`src/features/agenda/`): cada pessoa trabalha
  numa pasta, e os PRs quase não têm conflito.
- **useReducer no estado da agenda**: agendar, cancelar e remarcar mexem na
  mesma lista; a regra fica numa função pura, com testes.
- **json-server em vez de um backend próprio**: a sprint tinha duas semanas,
  e o foco ficou no app.
```

Uma decisão tem **o que** a equipe escolheu, **por que** e, quando houver, **a alternativa** que ficou de fora. É a seção que mais rende pergunta em entrevista: "por que vocês fizeram assim?".

---

## Pratique

:::example Desafio
Reescreva os três trechos do README do app de controle de gastos para que digam algo a quem nunca viu o app:

1. "Um app muito útil para facilitar o dia a dia."
2. "Decisões: usamos AsyncStorage."
3. "Para rodar, instale e rode."
:::

:::tip Resposta
1. "App para registrar gastos e entradas e ver o saldo do mês e o resumo por categoria."
2. "O mês escolhido e a última categoria usada ficam no AsyncStorage: o app reabre onde a pessoa parou. Os lançamentos ficam no servidor, que é a fonte da verdade."
3. Os comandos em ordem, do `git clone` ao `npx expo start`, passando pelo `cp .env.example .env` e pelo `json-server`.
:::

---

## :icon[play] Vídeo de demonstração

Um vídeo de 60 a 90 segundos convence mais que qualquer texto. Roteiro:

:::steps
1. Abertura, 5 segundos: o ícone e a splash
2. Fluxo principal, 40 segundos: a tarefa inteira, como agendar um corte
3. Caso difícil, 15 segundos: o erro tratado, a lista vazia ou o tema escuro
4. Fechamento, 10 segundos: o resultado, como o horário em "Meus agendamentos"
:::

- Grave com o gravador de tela do próprio celular, usando o APK
- Dados realistas, sem notificações na tela e sem música
- No GitHub, edite o README pelo site e arraste o `.mp4` para logo abaixo da frase do topo: ele vira um player. Acima de 10 MB, use um vídeo não listado no YouTube

---

## :icon[git-branch] A vitrine do GitHub

O seu perfil é o primeiro lugar que alguém olha depois do currículo.

- Repositório público, com descrição e tópicos (`react-native`, `expo`, `mobile`) no campo **About**
- Fixe no perfil os melhores repositórios, em **Customize your pins**. Dá para fixar o da equipe, mesmo na conta de um colega, se você contribuiu nele
- Crie o **README de perfil**: um repositório com o mesmo nome do seu usuário. O `README.md` dele aparece no topo do perfil
- Histórico com PRs revisados e mensagens de commit claras mostra como você trabalha em equipe
- Nada de `.env`, senha ou `node_modules` no repositório

---

## :icon[briefcase] Portfólio: três projetos, uma história

| Projeto | O que mostra |
|---|---|
| Minhas Tarefas | os fundamentos: componentes, estado e listas |
| Lojinha v2 | layout, UI kit, API, armazenamento, testes e CI |
| App da equipe | trabalho em equipe, arquitetura, APK e apresentação |

Para cada um: uma frase, o link do repositório, o vídeo e, quando houver, o APK. No projeto da equipe, acrescente **o que eu fiz**, com verbos e resultados:

:::example O que eu fiz
"Construí a tela de horários livres e a regra que impede dois agendamentos no mesmo horário, com 6 testes. Revisei 14 PRs da equipe."
:::

Dê crédito: "fiz o app" num projeto de três pessoas pesa contra você na entrevista.

---

## :icon[contact] LinkedIn

- **Título**: o que você faz e com quê, como "Programador mobile júnior | React Native, Expo e JavaScript"
- **Sobre**: três frases: a formação, o que você construiu e o que procura
- **Projetos**: o app da equipe e a Lojinha, com o link do repositório
- **Em destaque**: o vídeo ou o post de lançamento do app
- **Post de lançamento**: o problema em uma frase, o vídeo, o que você aprendeu e o link; marque as pessoas da equipe
- Link do GitHub nas informações de contato

Recrutadores buscam por palavra-chave: escreva os nomes das tecnologias por extenso, do jeito que aparecem nas vagas.

---

## :icon[timer] Ensaio do pitch: 5 minutos

Hoje, uma versão curta do pitch do Demo Day, para outra equipe:

| Tempo | O quê |
|---|---|
| 0:00 a 0:45 | o problema e o público, com a situação real |
| 0:45 a 3:30 | demo ao vivo do fluxo principal, no celular com o APK |
| 3:30 a 4:30 | uma decisão de arquitetura e o porquê |
| 4:30 a 5:00 | o que aprenderam e o próximo passo |

- Todo mundo fala; quem não fala, opera o celular
- Cronômetro visível: deu 5 minutos, para
- A equipe que assiste devolve três coisas: o que entendeu do problema, onde a demo travou e o que cortaria

---

## :icon[triangle-alert] Erros comuns

:::warning
- README que começa pela instalação: quem lê ainda não sabe o que o app faz
- Capturas com "teste", "asdf" e telas vazias
- "Como rodar" nunca testado num clone limpo, ou sem o `.env.example`
- Vídeo de 4 minutos com tela de carregamento e sem o fluxo completo
- "Fiz o app" num projeto de equipe, sem dizer a sua parte
- APK só no grupo de mensagens: some na conversa; o lugar dele é a Release
- Ensaio sem o `json-server` ligado ou com o IP antigo no build
:::

---

## Resumo

:::summary
- O README segue a ordem de quem lê: nome e frase, problema, solução e telas, como rodar, tecnologias e decisões, equipe
- Capturas reais e um vídeo de 60 a 90 segundos mostram que o app funciona; o APK fica numa Release com a tag da versão
- Decisão boa tem o que, o porquê e a alternativa
- No GitHub e no LinkedIn, três projetos contam a sua história, com a sua parte dita com clareza
- O pitch de 5 minutos: problema, demo ao vivo, uma decisão e o aprendizado
:::

---

## :icon[flask-conical] No laboratório

**Sprint 2 da equipe**, com mentoria e ensaio do pitch.

:::steps
1. Um dado do briefing salvo com o `armazenamento.js` do E39 e restaurado ao abrir
2. Toda chamada à API com carregamento, `EstadoErro` e "Tentar novamente"
3. 10 testes das regras do app verdes no `npm test`
4. APK de preview instalado, falando com o `json-server`
5. README com todas as seções da aula, de problema a equipe
6. Vídeo no README e APK numa Release `v1.0.0`
7. Ensaio do pitch e PR "E44: sprint 2, APK e README" com merge na `main`
:::

**Critérios**: o app reabre com o dado salvo; nenhuma tela em branco sem o `json-server`; README com vídeo e Release. Cada pessoa entrega o link do repositório no sistema.
