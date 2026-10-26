---
title: Carreira em desenvolvimento mobile
summary: O que você construiu em 180 horas, trilhas, vagas júnior, portfólio, lojas e os próximos estudos.
module: integracao
duration_minutes: 30
objectives:
  - Relacionar os apps construídos no curso às competências que as vagas pedem
  - Comparar as trilhas React Native, nativo e full stack
  - Organizar um portfólio com repositórios, APK e vídeos
  - Planejar os próximos estudos e os primeiros 30 dias depois do curso
---

# Carreira em desenvolvimento mobile

Programador Mobile: Módulo Específico · Encontro E45 · Aula 71 de 71

---

## O que você vai aprender

:::goal
- Enxergar o que você construiu em 180 horas como prova de competência
- Comparar as trilhas: React Native, nativo com Kotlin ou Swift e full stack
- Ler uma vaga júnior e montar um portfólio que responde a ela
- Escolher os próximos estudos e um plano para os primeiros 30 dias
:::

---

## Por que isso importa

Uma vaga júnior pede "experiência com React Native e consumo de APIs". Quem nunca trabalhou na área pensa: "não tenho experiência". Você tem: três apps, um deles em equipe, com backlog, PRs revisados, testes e APK.

A diferença entre ter e mostrar é o portfólio. O recrutador passa poucos minutos no seu GitHub, e o que ele vê nesse tempo precisa responder à vaga.

:::question
Se um recrutador abrisse o seu GitHub agora, qual repositório veria primeiro, e o que entenderia dele?
:::

---

## :icon[milestone] 180 horas, três apps

| App | Quando | O que ele prova |
|---|---|---|
| Minhas Tarefas | E01 a E09, 36h | componentes, estado e listas, da web ao celular |
| Lojinha v2 | E10 a E40, 124h | UI kit, navegação, regras testadas, classes, API e login |
| App da equipe | E41 a E45, 20h | backlog, Git em equipe, arquitetura, APK e Demo Day |

Cada app é um degrau: o primeiro mostra que você programa, o segundo que você constrói um app completo, o terceiro que você entrega em equipe.

---

## :icon[list-checks] O que você já sabe fazer

Na linguagem das vagas:

- React Native com Expo e Expo Router: telas, navegação, tema e componentes reutilizáveis
- JavaScript moderno: classes, módulos, `async`/`await` e programação funcional com arrays
- Consumo de API REST com `fetch`, estados de carregamento e erro, e paginação
- Armazenamento no aparelho e login com token guardado com segurança
- Testes com Jest e integração contínua com GitHub Actions
- Git e GitHub em equipe: branch, PR, revisão de código e board
- Geração de APK com EAS Build

---

## :icon[route] Três trilhas

| Trilha | O que você estuda | Ponto de partida |
|---|---|---|
| React Native | TypeScript, testes de componente e recursos nativos com Expo | é onde você está: aprofunde |
| Nativo | Kotlin e Jetpack Compose (Android) ou Swift e SwiftUI (iOS) | tela, estado e lista se repetem; para iOS, você precisa de um Mac |
| Full stack | Node.js, banco de dados e a sua própria API | troque o `json-server` por um backend de verdade |

---

## :icon[route] Uma base, três trilhas

:::center
![Diagrama: componentes, estado, API e Git formam a base comum, que leva às três trilhas: React Native, onde você está, com TypeScript e recursos nativos; nativo, com Kotlin ou Swift; e full stack, com Node.js, banco de dados e API](images/e45-trilhas.svg)
:::

Não existe trilha errada. Escolha uma para os próximos seis meses e mude depois, se quiser: componentes, estado, API e Git valem nas três.

---

## :icon[briefcase] O que as vagas júnior pedem

Leia dez vagas de "desenvolvedor mobile júnior" e os pedidos se repetem:

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
- APIs: o `src/api/` da Lojinha falando com a DummyJSON e o app da equipe com o `json-server`
- Git: os PRs revisados no histórico do app da equipe
- Testes: o `npm test` das regras de `src/regras/` e o selo do CI no README
- App publicado: o APK na Release do app da equipe, com o link no README; a loja é o próximo passo
:::

---

## :icon[folder-open] Portfólio: provas, não promessas

No E44 você montou o README, o vídeo e o LinkedIn do app da equipe. Agora feche o pacote dos três projetos:

- **Fixe** os três repositórios no perfil, com o projeto da equipe primeiro
- Em cada README: problema, telas, como rodar e decisões, com o **vídeo** no topo
- **APK** numa Release do GitHub: o recrutador instala, não clona
- No projeto da equipe, a sua parte com verbos e números: "fiz a tela de horários e a regra que impede conflito, com 6 testes"
- Arquive os exercícios soltos sem README

Depois do Demo Day, o post no LinkedIn ganha o que faltava: "apresentamos para uma banca".

---

## :icon[store] Publicar na loja

O APK roda em qualquer Android; na loja, o app chega a qualquer pessoa e pesa no currículo.

| Item | Google Play | App Store |
|---|---|---|
| Conta | de desenvolvedor, com taxa única | Apple Developer Program, com taxa anual |
| Exige | política de privacidade, capturas de tela, classificação etária | o mesmo, mais a revisão da Apple |
| Com o EAS | `eas build --profile production` e `eas submit` | os mesmos comandos; o build roda na nuvem, sem Mac |

As regras mudam com frequência: contas pessoais novas no Google Play, por exemplo, passam por um teste fechado antes da produção. Confira no Play Console e no App Store Connect.

---

## :icon[users] Comunidade

Ninguém aprende sozinho, e muitas vagas chegam por indicação.

- Vá a meetups e eventos de React Native e de mobile, presenciais ou on-line
- Entre na comunidade do Expo no Discord e acompanhe as novidades de cada SDK no blog
- Responda dúvidas de quem está começando: explicar é a melhor revisão
- Contribua com código aberto: issues marcadas como "good first issue" são a porta de entrada
- Mantenha contato com esta turma: seus colegas vão indicar uns aos outros

---

## :icon[graduation-cap] Próximos estudos

| Tema | Por que | Primeiro passo |
|---|---|---|
| TypeScript a fundo | as vagas pedem, e ele evita bugs de props e de API | converter o app da equipe, uma pasta por vez |
| Testes de componente | testar telas, não só regras | React Native Testing Library na tela de login |
| Notificações | trazer o usuário de volta ao app | `expo-notifications` num lembrete de agendamento |
| Mapas e câmera | recursos que só o celular tem | `react-native-maps` e `expo-camera` |
| Arquitetura | apps e equipes maiores | cache de dados do servidor e estado global |

Estude **um** tema por vez e aplique num app seu.

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
- Em 180 horas você construiu três apps que provam que você programa, constrói um app completo e entrega em equipe
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
2. Semana 1: fixe os três repositórios e confira README, APK e vídeo
3. Semana 2: poste o Demo Day no LinkedIn e leia dez vagas, anotando o que falta
4. Semanas 3 e 4: estude um tema da lista e aplique num app seu
5. Toda semana: programe três vezes e candidate-se, mesmo sem todos os requisitos
:::

**Pronto quando**: em dois minutos no seu GitHub, um recrutador entende quem você é e o que constrói. Não há entrega no sistema: daqui em diante, quem avalia é o mercado.
