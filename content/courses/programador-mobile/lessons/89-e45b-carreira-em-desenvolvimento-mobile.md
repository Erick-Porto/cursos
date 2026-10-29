---
title: Carreira em desenvolvimento mobile
summary: O que você construiu em 180 horas, trilhas, vagas júnior, portfólio, lojas e os próximos estudos.
module: integracao
duration_minutes: 30
objectives:
  - Relacionar os projetos construídos no curso às competências que as vagas pedem
  - Comparar as trilhas React Native, nativo e full stack
  - Organizar um portfólio com repositórios, APK e vídeos
  - Planejar os próximos estudos e os primeiros 30 dias depois do curso
---

# Carreira em desenvolvimento mobile

Programador Mobile · Encontro E45 · Aula 89 de 89

---

## O que você vai aprender

:::goal
- Enxergar o que você construiu em 180 horas como prova de competência
- Comparar as trilhas: React Native, nativo com Kotlin ou Swift e full stack
- Ler uma vaga júnior e montar um portfólio que responde a ela
- Escolher os próximos estudos e um plano para os primeiros 30 dias
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **vaga júnior** | vaga de emprego para quem está começando na profissão |
| **trilha** | um caminho de estudo, com rumo: o que aprender depois do curso |
| **nativo** | app feito na linguagem do próprio sistema: Kotlin no Android, Swift no iPhone |
| **full stack** | quem faz o app e também o servidor e o banco de dados; em inglês, "a pilha inteira" |
| **portfólio** | a coleção dos seus melhores trabalhos, para mostrar a quem contrata |
| **código aberto** | projeto com o código público, em que qualquer pessoa pode contribuir |

---

## Por que isso importa

Uma vaga júnior pede "experiência com React Native e consumo de APIs". Quem nunca trabalhou na área pensa: "não tenho experiência". Você tem: quatro projetos no GitHub, do primeiro script no terminal a um app feito em equipe, com backlog, PRs revisados, testes e APK.

A diferença entre ter e mostrar é o portfólio. O recrutador passa poucos minutos no seu GitHub, e o que ele vê nesse tempo precisa responder à vaga.

:::question
Se um recrutador abrisse o seu GitHub agora, qual repositório veria primeiro, e o que entenderia dele?
:::

---

## Quatro projetos

Dá para chegar ao último degrau da escada sem pisar nos outros?

---

## :icon[milestone] 180 horas, quatro projetos

Cada projeto é um degrau de uma escada: programar, pensar em componentes, construir um app e entregar em equipe. Cada degrau é uma **prova**: um repositório que qualquer pessoa confere.

| Projeto | Quando | O que ele prova |
|---|---|---|
| `lojinha-regras` | E01 a E20, 80h | JavaScript no Node: regras, classes, erros e API, com testes e CI |
| Minhas Tarefas | E21 a E29, 36h | componentes, estado e hooks, da web ao celular |
| Lojinha | E30 a E40, 44h | layout, UI kit, navegação e acessibilidade num app de 5 telas |
| App da equipe | E41 a E45, 20h | Git em equipe, arquitetura, dados no aparelho, APK e Demo Day |

---

## :icon[workflow] Um projeto alimenta o outro

:::center
![Diagrama: a pasta src do lojinha-regras foi copiada para a Lojinha no E30, os componentes e hooks do Minhas Tarefas também chegaram à Lojinha, e o tema e o kit de UI da Lojinha deram a largada no app da equipe no E42](images/e45-quatro-projetos.svg)
:::

O E01 preparou o ambiente; depois, o `lojinha-regras` foi de um script ao checkout completo. Nada foi jogado fora: as regras de preço, carrinho e frete nasceram no terminal e chegaram ao app com a pasta `src/`. O tema e o kit de UI da Lojinha deram a largada no app da equipe. Na entrevista, essa é a sua história: o mesmo código, cada vez mais perto de quem usa.

---

## :icon[list-checks] O que você já sabe fazer

Na linguagem das vagas:

- JavaScript moderno no Node e no app: módulos, classes, erros, `async`/`await` e funções de array
- React e React Native com Expo e Expo Router: componentes, hooks, navegação e tema
- Consumo de API REST com `fetch`, estados de carregamento e erro, e paginação
- Armazenamento no aparelho e login com token guardado com segurança
- Testes com Jest, lint e integração contínua com GitHub Actions
- Git e GitHub em equipe: branch, PR, revisão de código e board
- Geração de APK com EAS Build

---

## As trilhas

Do terminal saem várias linhas de ônibus. O que todas elas têm em comum?

---

## :icon[route] Três trilhas

Uma **trilha** é um caminho de estudo, com rumo. Pense nas linhas de ônibus que saem do mesmo terminal: o curso é o terminal, e cada linha leva a um bairro.

| Trilha | O que você estuda | Ponto de partida |
|---|---|---|
| React Native | TypeScript, testes de componente e recursos nativos com Expo | é onde você está: aprofunde |
| Nativo | Kotlin e Jetpack Compose (Android) ou Swift e SwiftUI (iOS, o sistema do iPhone) | tela, estado e lista se repetem; para iOS, você precisa de um Mac |
| Full stack | Node.js, banco de dados e a sua própria API | você roda Node desde o E02: troque o `json-server` por um backend de verdade |

---

## :icon[route] Uma base, três trilhas

:::center
![Diagrama: componentes, estado, API e Git formam a base comum, que leva às três trilhas: React Native, onde você está, com TypeScript e recursos nativos; nativo, com Kotlin ou Swift; e full stack, com Node.js, banco de dados e API](images/e45-trilhas.svg)
:::

Não existe trilha errada. Escolha uma para os próximos seis meses e mude depois, se quiser: componentes, estado, API e Git valem nas três.

---

## Vagas júnior

Na lista de compras do mês, o que não pode faltar, e o que entra só se der?

---

## :icon[briefcase] O que as vagas júnior pedem

Uma **vaga júnior** é para quem está começando na profissão. O anúncio funciona como a lista de compras do mês: tem o que não pode faltar e o que entra "se der". Leia dez vagas de "desenvolvedor mobile júnior" e os pedidos se repetem:

::::columns
:::col
**Quase sempre**

- JavaScript ou TypeScript
- React Native
- Consumo de APIs REST
- Git e GitHub
- Comunicação e trabalho em equipe
:::
:::col
**Diferenciais**

- App publicado ou APK para testar
- Testes automatizados e CI
- Noções de Kotlin ou Swift
- Inglês para ler documentação
:::
::::

Quase tudo da primeira coluna você já mostrou num repositório. Os diferenciais são o seu próximo passo.

---

## Pratique

:::example Desafio
Ligue cada requisito desta vaga a uma prova que está no seu GitHub:

"Desenvolvedor(a) mobile júnior. Requisitos: React Native, consumo de APIs, Git, testes unitários. Diferencial: app publicado."
:::

:::tip Resposta
- React Native: a Lojinha e o app da equipe, com Expo Router
- APIs: o `src/api/` do `lojinha-regras` buscando produtos na DummyJSON (E19) e o app da equipe com o `json-server`
- Git: os PRs revisados no histórico do app da equipe
- Testes: o `npm test` do `lojinha-regras`, com o selo do CI no README, e os testes de regras do app da equipe
- App publicado: o APK na Release do app da equipe, com o link no README; a loja é o próximo passo
:::

---

## Portfólio

O que o cabeleireiro mostra antes do primeiro corte de um cliente novo?

---

## :icon[folder-open] Portfólio: provas, não promessas

O **portfólio** é o álbum de fotos dos cortes do cabeleireiro (E44): mostra o que você já fez. Agora, feche o dos quatro projetos:

- **Fixe** os repositórios no perfil (o GitHub aceita seis), com o projeto da equipe primeiro
- Em cada README: problema, telas, como rodar e decisões, com o **vídeo** no topo; no `lojinha-regras`, o selo do CI
- **APK** numa Release do GitHub: o recrutador instala, não clona
- No projeto da equipe, a sua parte com verbos e números: "fiz a tela de horários e a regra que impede conflito, com 6 testes"
- Arquive os exercícios soltos sem README

Depois do Demo Day, o post no LinkedIn ganha o que faltava: "apresentamos para uma banca".

---

## :icon[folder-open] Portfólio na prática

O mesmo projeto, mostrado de dois jeitos:

| No portfólio | Promessa | Prova |
|---|---|---|
| App da equipe | "Fiz o app." | "Fiz a tela de horários e a regra que impede conflito, com 6 testes." |
| `lojinha-regras` | só o código, sem README | README com o selo verde do CI e o `npm test` |
| Lojinha | só o link do repositório | vídeo curto no topo do README e capturas das 5 telas |

A prova deixa tudo à vista: quem lê confere em segundos, sem clonar nada.

---

## :icon[store] Publicar na loja

As **lojas** são o supermercado dos apps (E44): o APK chega a quem recebe o link; na loja, o app chega a qualquer pessoa e pesa no currículo.

| Item | Google Play | App Store |
|---|---|---|
| Conta | de desenvolvedor, com taxa única | Apple Developer Program, com taxa anual |
| Exige | política de privacidade, capturas de tela, classificação etária | o mesmo, mais a revisão da Apple |
| Com o EAS | `eas build --profile production` e `eas submit` | os mesmos comandos; o build roda na nuvem, sem Mac |

As regras mudam: contas pessoais novas no Google Play passam por um teste fechado antes da produção. Confira no Play Console e no App Store Connect.

---

## Comunidade

Como você ficou sabendo deste curso?

---

## :icon[users] Comunidade

Uma **comunidade** de programação é o grupo de pessoas que estudam o mesmo tema e se ajudam. É como esta turma, só que do tamanho do país. Ninguém aprende sozinho, e muitas vagas chegam por indicação.

- Vá a **meetups** (encontros sobre um tema) de React Native e de mobile, presenciais ou on-line
- Entre na comunidade do Expo no Discord, um app de grupos de conversa, e acompanhe as novidades de cada SDK no blog
- Responda dúvidas de quem está começando: explicar é a melhor revisão
- Contribua com código aberto: issues marcadas como "good first issue" (boa primeira tarefa) são a porta de entrada
- Mantenha contato com esta turma: seus colegas vão indicar uns aos outros

---

## :icon[users] Comunidade na prática

Três jeitos de começar, já na primeira semana:

:::example Num meetup
"Oi, sou a Ana. Terminei um curso de 180 horas e fiz em equipe um app de agenda, com APK. Estou procurando a primeira vaga."
:::

:::example Numa dúvida de outra pessoa
"O Network request failed só no APK costuma ser o `http://`: confira o `usesCleartextTraffic` e gere um build novo."
:::

:::example Numa issue "good first issue"
"Posso pegar esta? Pretendo abrir o PR até sexta." Pergunte antes de começar, para duas pessoas não fazerem a mesma coisa.
:::

---

## Próximos estudos

O que rende mais na academia: um treino toda semana ou sete treinos num dia só?

---

## :icon[graduation-cap] Próximos estudos: um tema por vez

Depois do curso, estude **um** tema por vez e aplique num app seu. É como a academia: um treino toda semana rende mais do que sete treinos num dia só e depois nada.

Exemplo: um mês de testes de componente, aplicados na tela de login do app da equipe. Só depois, o próximo tema.

Estudar cinco tecnologias ao mesmo tempo costuma terminar em nenhuma.

---

## :icon[library] Temas para estudar

| Tema | Por que | Primeiro passo |
|---|---|---|
| TypeScript a fundo | as vagas pedem, e ele evita bugs de props e de API | do rascunho do E12 ao app da equipe, uma pasta por vez |
| Testes de componente | testar telas, não só regras | React Native Testing Library na tela de login |
| Notificações | trazer o usuário de volta ao app | `expo-notifications` num lembrete de agendamento |
| Mapas e câmera | recursos que só o celular tem | `react-native-maps` e `expo-camera` |
| Arquitetura | apps e equipes maiores | cache de dados do servidor e estado global |

**Cache**: uma cópia guardada no aparelho, para não buscar de novo.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Esperar "estar pronto" para se candidatar: a vaga júnior existe para quem está começando
- GitHub cheio de exercícios sem README e nenhum projeto fixado
- Apresentar um projeto de tutorial como se fosse seu: a primeira pergunta da entrevista derruba
- Estudar cinco tecnologias ao mesmo tempo e não terminar nenhuma
- Parar de programar depois do curso: em três meses sem código, o Git e o Expo parecem novos de novo
:::

---

## Resumo

:::summary
- Em 180 horas você construiu quatro projetos que provam que você programa, pensa em componentes, constrói um app completo e entrega em equipe
- As trilhas são React Native, nativo (Kotlin ou Swift) e full stack, e os fundamentos valem nas três
- Vagas júnior pedem JavaScript, React Native, API, Git e trabalho em equipe: mostre cada um num repositório
- Portfólio é GitHub arrumado: repositórios fixados, README, APK e vídeo
- Estude um tema por vez, aplicando num app seu, e fique perto da comunidade
:::

---

## :icon[flag] Seus próximos 30 dias

O curso acaba hoje. Um plano possível:

:::steps
1. Semana 1: aplique o feedback da banca no app da equipe, com o commit "Demo Day: ajustes da banca"
2. Semana 1: fixe os quatro projetos e confira README, APK, vídeo e o selo do CI
3. Semana 2: poste o Demo Day no LinkedIn e leia dez vagas, anotando o que falta
4. Semanas 3 e 4: estude um tema da lista e aplique num app seu
5. Toda semana: programe três vezes e candidate-se, mesmo sem todos os requisitos
:::

**Pronto quando**: em dois minutos no seu GitHub, um recrutador entende quem você é e o que constrói. Não há entrega no sistema: daqui em diante, quem avalia é o mercado.
