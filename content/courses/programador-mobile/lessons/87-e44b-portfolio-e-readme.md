---
title: Portfólio e README
summary: Escreva o README que recruta, grave o vídeo de demonstração e leve o app da equipe ao portfólio e ao LinkedIn.
module: integracao
duration_minutes: 40
objectives:
  - Escrever um README com problema, solução, telas, como rodar, tecnologias e decisões
  - Gravar um vídeo de demonstração de 60 a 90 segundos e publicar o APK numa Release
  - Organizar o portfólio no GitHub e no LinkedIn com os quatro projetos, deixando clara a sua parte
  - Ensaiar um pitch de 5 minutos com demonstração ao vivo
---

# Portfólio e README

Programador Mobile · Encontro E44 · Aula 87 de 89

---

## O que você vai aprender

:::goal
- Montar o README que recruta, na ordem em que as pessoas leem
- Mostrar as telas com capturas e um vídeo curto, e publicar o APK numa Release
- Escrever as decisões do projeto com o porquê de cada uma
- Arrumar o perfil do GitHub e do LinkedIn em volta dos quatro projetos do curso
- Ensaiar o pitch de 5 minutos da equipe
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **README** | o arquivo que explica o projeto, mostrado na página do repositório; em inglês, "leia-me" |
| **recrutador** | a pessoa que escolhe quem vai para a entrevista de emprego |
| **Release** | a página de uma versão do projeto no GitHub, com arquivos para baixar, como o APK |
| **portfólio** | a coleção dos seus melhores trabalhos, para mostrar a quem contrata |
| **LinkedIn** | a rede social do trabalho: currículo, vagas e contatos profissionais |
| **pitch** | uma apresentação curta que mostra o problema, o app funcionando e por que ele vale |

---

## Trinta segundos no seu repositório

Uma recrutadora tem 40 candidaturas para uma vaga de programador mobile júnior, para quem está começando. No seu currículo, ela clica no link do GitHub e abre o repositório do app da equipe. O README tem uma linha: `# agenda-app`.

Ela não clona, não instala e não roda nada. Fecha a aba e abre o próximo candidato.

O app pode estar ótimo. Se o README não mostra, ninguém fica sabendo.

:::question
Em 30 segundos de leitura, o que o README precisa mostrar para a pessoa querer ver mais?
:::

---

## O README

Você abre o repositório de alguém. O que faz você continuar lendo?

---

## :icon[file-text] O README que recruta

O **README** é a porta de entrada do projeto, como no E41: o GitHub mostra o `README.md` logo abaixo da lista de arquivos. Quem chega decide em 30 segundos se entra.

Por isso, cada seção do README responde a uma pergunta de quem lê, na ordem em que ela surge:

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

- No README, `#` marca o título, `###` um subtítulo e `-` um item de lista
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

- De 3 a 5 **capturas de tela** (fotos da tela, tiradas no próprio celular) na pasta `docs/`, numa tabela para ficarem lado a lado
- Capture com o APK e dados realistas: nada de "teste", "asdf" ou lista vazia
- `![texto](caminho)` mostra uma imagem. O texto entre colchetes descreve a tela para quem usa leitor de tela
- Uma captura no tema escuro mostra que o app foi cuidado nos dois temas

---

## :icon[terminal] Como rodar: do clone ao app

Na seção **Como rodar**, os comandos vão na ordem, a partir de um **clone**: a cópia do repositório baixada com `git clone`.

```bash
git clone https://github.com/equipe-agenda/agenda-facil.git
cd agenda-facil
npm install
cp .env.example .env                  # troque o IP pelo do seu computador
npx json-server db.json --port 3000   # deixe este terminal aberto
npx expo start                        # num segundo terminal
```

- `cp .env.example .env` copia o arquivo de exemplo para o `.env`, que o Git não guarda
- Teste os passos num clone limpo, numa pasta vazia: se faltar um, quem tenta desiste

---

## A Release

Como alguém que não programa testa o app de vocês sem clonar nada?

---

## :icon[tag] Release: o APK com o número da versão

Uma **Release** (lançamento) é a página de uma versão do projeto no GitHub, com arquivos para baixar. Ela vem presa a uma **tag** (etiqueta): se cada commit é uma foto do projeto, a tag é a etiqueta "versão 1.0.0" colada numa delas.

Quem não programa não clona nada: abre a Release no celular, toca no `.apk` e instala. Por isso, o lugar do APK é a Release, e não o grupo de mensagens, onde ele some na conversa.

Exemplo: a Release `v1.0.0` da Agenda Fácil, com o `agenda-facil.apk` para baixar e uma linha sobre o que esta versão traz.

---

## :icon[tag] A Release na prática

:::steps
1. Baixe o `.apk` da página do build no expo.dev
2. No repositório, abra **Releases** e **Draft a new release** (rascunhar uma versão)
3. Tag `v1.0.0`, a mesma `version` do `app.json`; arraste o `.apk` para a página
4. **Publish release** (publicar) e ponha o link no README
:::

- O link que termina em `/releases/latest` leva sempre à Release mais nova
- Versão nova do app, Release nova: `v1.1.0` para uma novidade, `v1.0.1` para uma correção, como as versões do E02
- Diga do que o APK depende: o `json-server` ligado e o celular na mesma Wi-Fi

---

## Decisões

Como você explicaria a um amigo por que comprou o celular que tem?

---

## :icon[lightbulb] Tecnologias e decisões

Uma **decisão** é uma escolha da equipe, com o motivo. É como explicar a um amigo por que você comprou aquele celular: "peguei este, e não o mais caro, porque a bateria dura o dia todo". No README, cada decisão tem **o que** a equipe escolheu, **por que** e, quando houver, **a alternativa** que ficou de fora.

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

É a seção que mais rende pergunta em entrevista: "por que vocês fizeram assim?".

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

## Vídeo de demonstração

O que um trailer de filme mostra em dois minutos?

---

## :icon[play] Vídeo de demonstração

O **vídeo de demonstração** mostra o app funcionando em 60 a 90 segundos. É o trailer do app: em pouco tempo, mostra as melhores cenas e convence mais que qualquer texto. Roteiro:

:::steps
1. Abertura, 5 segundos: o ícone e a splash
2. Fluxo principal, 40 segundos: a tarefa inteira, como agendar um corte
3. Caso difícil, 15 segundos: o erro tratado, a lista vazia ou o tema escuro
4. Fechamento, 10 segundos: o resultado, como o horário em "Meus agendamentos"
:::

---

## :icon[smartphone] Gravar e pôr no README

- Grave com o gravador de tela do próprio celular, usando o APK
- Dados realistas, sem notificações na tela e sem música
- No GitHub, edite o README pelo site e arraste o `.mp4`, o arquivo do vídeo, para logo abaixo da frase do topo: ele vira um player, que toca ali mesmo
- Acima de 10 MB, use um vídeo **não listado** no YouTube: só quem tem o link assiste

---

## Portfólio

Antes de cortar o cabelo com alguém novo, o que você pede para ver?

---

## :icon[briefcase] Portfólio: quatro projetos, uma história

O **portfólio** é a coleção dos seus melhores trabalhos. É como o cabeleireiro que mostra no celular as fotos dos cortes que já fez: o cliente vê o resultado antes de sentar na cadeira. O seu tem quatro projetos:

| Projeto | O que mostra |
|---|---|
| `lojinha-regras` | lógica testada com Jest, CI (E04) e TypeScript (E12) |
| Minhas Tarefas | React: componentes, estado e listas |
| Lojinha | layout, UI kit e navegação num app completo |
| App da equipe | equipe, arquitetura, APK e apresentação |

Para cada um: uma frase, o link e, quando houver, vídeo e APK. Sem tela, o `lojinha-regras` mostra o selo verde do CI, a inspeção automática do E04.

---

## :icon[user-check] A sua parte no projeto da equipe

Num projeto de equipe, quem avalia quer saber o que **você** fez. "Fiz o app" não diz nada e ainda vira pergunta difícil na entrevista. Diga a sua parte com verbos e resultados:

:::example O que eu fiz
"Construí a tela de horários livres e a regra que impede dois agendamentos no mesmo horário, com 6 testes. Revisei 14 PRs da equipe."
:::

A fórmula: um verbo no passado, o que você construiu e um número, como testes, telas ou PRs revisados.

---

## :icon[git-branch] O seu perfil no GitHub

O seu perfil é o primeiro lugar que alguém olha depois do currículo.

- Repositório público, com descrição e **tópicos** (etiquetas de assunto, como `react-native`, `expo`, `mobile`) no campo **About** (sobre)
- Fixe no perfil os melhores repositórios, em **Customize your pins** (escolher os fixados). Dá para fixar o da equipe, mesmo na conta de um colega, se você contribuiu nele
- Crie o **README de perfil**: um repositório com o mesmo nome do seu usuário. O `README.md` dele aparece no topo do perfil
- Histórico com PRs revisados e mensagens de commit claras mostra como você trabalha em equipe
- Nada de `.env`, senha ou `node_modules` no repositório

---

## LinkedIn

Onde um recrutador procura candidatos?

---

## :icon[contact] LinkedIn

O **LinkedIn** é a rede social do trabalho: no lugar das fotos de férias, ficam o currículo, os projetos e os contatos profissionais. É lá que recrutadores procuram candidatos.

- **Título**: o que você faz e com quê, como "Programador mobile júnior | React Native, Expo e JavaScript"
- **Sobre**: três frases: a formação, o que você construiu e o que procura
- **Projetos**: o app da equipe, a Lojinha e o `lojinha-regras`, com o link de cada repositório
- **Em destaque**: o vídeo ou o post de lançamento do app
- Link do GitHub nas informações de contato

Recrutadores buscam por palavra-chave: escreva os nomes das tecnologias por extenso, do jeito que aparecem nas vagas.

---

## :icon[megaphone] LinkedIn na prática

:::example Sobre
Concluí o curso Programador Mobile, de 180 horas. Construí quatro projetos, de regras em JavaScript a um app feito em equipe, com APK. Procuro a minha primeira vaga em desenvolvimento mobile.
:::

:::example Post de lançamento
A Barbearia do Bairro marcava horário num caderno, e dois clientes chegavam na mesma hora. Em duas semanas, nossa equipe fez a Agenda Fácil, em React Native. (vídeo de 60 segundos) Aprendi a dividir o trabalho em PRs revisados. Repositório no link. Com Ana Souza e Carla Dias.
:::

O **post de lançamento** tem o problema em uma frase, o vídeo, o que você aprendeu e o link. Marque a equipe: ele chega também aos contatos dela.

---

## O pitch

Na feira, que vendedor faz você parar: o que fala do produto ou o que mostra funcionando?

---

## :icon[timer] Ensaio do pitch: 5 minutos

Um **pitch** é uma apresentação curta que convence. Lembra o vendedor da feira: em vez de falar do descascador, ele descasca uma batata na sua frente. Hoje, uma versão de 5 minutos do pitch do Demo Day, para outra equipe:

| Tempo | O quê |
|---|---|
| 0:00 a 0:45 | o problema e o público, com a situação real |
| 0:45 a 3:30 | demo ao vivo do fluxo principal, no celular com o APK |
| 3:30 a 4:30 | uma decisão de arquitetura e o porquê |
| 4:30 a 5:00 | o que aprenderam e o próximo passo |

A **demo** é a demonstração do app funcionando, ao vivo.

---

## :icon[users] As regras do ensaio

- Todo mundo fala; quem não fala, opera o celular
- Cronômetro visível: deu 5 minutos, para
- A equipe que assiste devolve três coisas: o que entendeu do problema, onde a demo travou e o que cortaria

No Demo Day, o pitch tem 8 minutos e uma banca de avaliadores. O ensaio de hoje é o rascunho.

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
- No GitHub e no LinkedIn, quatro projetos contam a sua história, do `lojinha-regras` ao app da equipe, com a sua parte dita com clareza
- O pitch de 5 minutos: problema, demo ao vivo, uma decisão e o aprendizado
:::

---

## :icon[flask-conical] No laboratório

**Sprint 2 da equipe**, com mentoria e ensaio do pitch.

:::steps
1. Um dado do briefing salvo com o `armazenamento.js` do E43 e restaurado ao abrir no APK
2. Toda chamada à API com carregamento, `EstadoErro` e "Tentar novamente"
3. 10 testes das regras do app verdes no `npm test`
4. APK de preview instalado, falando com o `json-server`
5. README com todas as seções da aula, de problema a equipe
6. Vídeo no README e APK numa Release `v1.0.0`
7. Ensaio do pitch e PR "E44: sprint 2, APK e README" com merge na `main`
:::

**Critérios**: o app reabre com o dado salvo; nenhuma tela em branco sem o `json-server`; README com vídeo e Release. Cada pessoa entrega o link do repositório no sistema.
