---
title: Apresentação e carreira
summary: O app da equipe em 6 minutos para a banca, a ficha dos pares e os sete projetos do curso como portfólio.
module: integracao
duration_minutes: 90
objectives:
  - Montar e ensaiar uma apresentação de 6 minutos, com o app no celular e um plano B
  - Explicar como a banca e a ficha dos pares dão a nota do Projeto 7
  - Organizar os sete projetos do curso no GitHub como portfólio
  - Planejar a busca da primeira vaga e o que estudar depois
---

# Apresentação e carreira

Programador Mobile · Encontro E45 · Aula 45 de 45

---

## O que você vai aprender

:::goal
- Contar o app da equipe em 6 minutos: o problema, o app no celular e quem fez o quê
- Preparar a demonstração e o plano B, para nada travar na hora
- Saber como a banca e os colegas avaliam o Projeto 7
- Apresentar o app para a banca
- Mostrar os sete projetos do curso como portfólio e procurar a primeira vaga
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **banca** | o grupo de avaliadores que assiste, pergunta e dá a nota |
| **demonstração** | o app funcionando ao vivo, no celular, pelo caminho principal |
| **plano B** | o que você usa se o plano principal falhar; hoje, um vídeo do app |
| **ficha dos pares** | a avaliação que cada pessoa faz dos colegas da própria equipe |
| **portfólio** | a coleção dos seus trabalhos, para mostrar a quem contrata |
| **vaga júnior** | vaga de emprego para quem está começando na profissão |

---

## :icon[milestone] Projeto 7: falta mostrar

O app da equipe está pronto: instala no Android, tem README e passou no checklist. Falta mostrar o app para quem nunca o viu.

| Do E44, a equipe já tem | Hoje, falta |
|---|---|
| o APK na Release `v1.0.0` | o roteiro de 6 minutos |
| o README com os prints | o ensaio com cronômetro |
| o checklist em todas as telas | o vídeo do plano B e a banca |

Na entrevista de emprego, o pedido é o mesmo: "me mostra um app que você fez".

:::question
Se a banca só tivesse um minuto, o que vocês mostrariam?
:::

---

## A apresentação

Seis minutos para mostrar cinco encontros de trabalho. O que entra primeiro?

---

## :icon[timer] A apresentação: o problema, o app e a equipe

A **apresentação** conta o app para quem nunca o viu, na ordem de uma notícia: primeiro a manchete, que é o problema; depois a reportagem, o app funcionando; no fim, quem fez.

| Tempo | O que mostrar | Quem fala |
|---|---|---|
| 1 min | o problema e para quem é o app | uma pessoa |
| 3 min | o caminho principal, no celular | cada pessoa, na sua tela |
| 2 min | como a equipe trabalhou e quem fez o quê | todos |

Depois, até **4 minutos de perguntas**. Metade do tempo é do app funcionando. A tecnologia, como o AsyncStorage, fica para quando a banca perguntar.

---

## :icon[timer] A apresentação na prática: o primeiro minuto

A abertura diz **quem** sofre, **com o quê** e **o que o app muda**. "Nosso app foi feito com Expo" não diz nada disso.

| Briefing | Uma abertura forte |
|---|---|
| Controle de gastos | "No primeiro emprego, o salário some e ninguém sabe para onde. Com o app, você lança um gasto na fila do caixa." |
| Agenda de serviços | "O salão marca horário num caderno, e dois clientes chegam na mesma hora. O app mostra só os horários livres." |
| Cardápio e pedidos | "No almoço, a fila do balcão chega a 20 minutos. Com o app, o cliente pede pelo celular." |

As palavras estão no README, em "O problema".

---

## A demonstração

Num test-drive, o vendedor explica cada botão ou leva você para dar uma volta?

---

## :icon[smartphone] A demonstração: um usuário, do começo ao fim

A **demonstração** é o app funcionando, ao vivo, no celular. É o test-drive: o vendedor não explica cada botão, ele leva você para dar uma volta. Siga **uma pessoa** pelo **caminho principal**:

:::steps
1. Comece onde ela começa: a primeira aba
2. Faça o que ela veio fazer: lançar um gasto, agendar, pedir
3. Mostre um **erro tratado**: um campo recusado, com a mensagem embaixo
4. Termine no resultado: o saldo mudou, o horário sumiu, o carrinho esvaziou
5. Feche o app e abra de novo: os dados continuam lá
:::

Cada pessoa mostra a própria tela. O tema escuro e a Sobre ficam para as perguntas.

---

## :icon[smartphone] A demonstração na prática: os três caminhos

Com os dados do kit:

| Briefing | O caminho | O erro tratado |
|---|---|---|
| Gastos | uma saída de R$ 51,57 em Lazer: o saldo vai de R$ 1727,10 a R$ 1675,53 | o valor 0, recusado |
| Agenda | Corte de cabelo, segunda às 11:00: os Agendados passam a 4 | o 10:00 e o 14:00 não aparecem |
| Cardápio | a Água e 2 X-Burger "sem cebola": R$ 49,80, Fazer pedido | antes, só a Água, de R$ 4,00: abaixo do mínimo de R$ 15,00 |

Use dados de verdade: nada de "teste" ou "aaa" na tela. Antes da banca, apague pelas telas o que os ensaios criaram.

---

## :icon[milestone] Projeto 7 · Passo 1: o roteiro de 6 minutos

Numa folha, com a equipe:

:::steps
1. A abertura numa frase: quem, qual dor, o que o app muda
2. O caminho principal e o erro tratado do seu briefing, na ordem das telas
3. Quem fala em cada parte: quem abre, quem mostra cada tela, quem conta como a equipe trabalhou
4. A história da equipe: um pull request que a revisão mudou, ou o conflito resolvido
5. O que cada pessoa fez, numa frase com verbo: "fiz a tela Lançamentos e o ItemLancamento"
6. A leitura em voz alta, com o cronômetro do celular
:::

**Pronto quando:** a leitura cabe em 6 minutos, e cada pessoa sabe o que fala e quando.

---

## O plano B

Por que todo carro sai com estepe, se o pneu quase nunca fura?

---

## :icon[shield-check] O plano B: o vídeo do caminho principal

O **plano B** é o que você usa quando o plano principal falha. É o estepe: ninguém quer usar, ninguém sai sem ele. Na apresentação, é um **vídeo de 1 minuto** do caminho principal, gravado da tela do celular:

- **Android:** Gravador de tela, no painel rápido
- **iPhone:** Gravação de Tela, na Central de Controle
- Uma cópia no computador do instrutor, antes da banca

:::tip A regra dos 30 segundos
Travou por 30 segundos? Diga "vamos mostrar no vídeo" e narre por cima dele. Usar o plano B não tira ponto.
:::

---

## :icon[siren] Quando algo dá errado na hora

| O que acontece | Quer dizer | O que fazer |
|---|---|---|
| a demonstração travou | rede, cabo ou projetor | o vídeo, aos 30 segundos |
| o app mostra "teste" e "aaa" | a gaveta guardou os ensaios | apagar antes, pelas telas |
| o APK mostra uma versão velha | um build antigo | o Expo Go, com a `main` atualizada |
| o Expo Go não acha o projeto | redes diferentes | `npx expo start --tunnel`, ou o APK |
| o celular não aparece no projetor | faltou testar a ligação | a câmera, ou o computador do instrutor |

O APK abre sem computador e sem rede: é o mais seguro.

---

## :icon[milestone] Projeto 7 · Passo 2: o ensaio e o plano B

:::steps
1. Grave o vídeo de 1 minuto do caminho principal e mande uma cópia ao instrutor
2. Ensaie a apresentação inteira, de pé, com o cronômetro, como na banca
3. Onde passou do tempo, corte nas falas, nunca no caminho principal
4. Teste o celular no projetor. **Espelhar** a tela é mostrar o celular no projetor, ao vivo
5. Apague pelas telas o que o ensaio e o vídeo criaram
6. Deixe o celular carregado, no não perturbe, com o brilho alto e só o app aberto
:::

**Pronto quando:** o ensaio coube em 6 minutos, com todas as pessoas falando, e o vídeo está no computador do instrutor.

---

## A banca

No desfile das escolas de samba, como os jurados chegam à nota?

---

## :icon[clipboard-check] A banca e a ficha

A **banca** é o grupo de avaliadores: assiste, pergunta e dá a nota, como os jurados do desfile com a ficha dos quesitos. A [ficha da banca](materiais/projeto-7/ficha-da-banca.html) tem três critérios:

| Critério | Pontos | O que a banca confere |
|---|---|---|
| 1 · O app funcionando | 30 | as telas, as regras, os dados depois de fechar |
| 2 · Interface e qualidade | 15 | as peças do kit, os dois temas, a lista vazia |
| 5 · Apresentação | 10 | o tempo, o problema no começo, todos falando |

Cada critério ganha um nível de 0 a 4: pontos = peso × nível ÷ 4. Os outros 45 pontos são do instrutor.

---

## :icon[messages-square] A banca na prática: as perguntas

A banca faz **uma pergunta a cada pessoa**, sobre a parte dela:

- "De onde vem a lista desta tela?"
- "O que a prop do seu componente faz?"
- "O que mudou na revisão do seu pull request?"

E perguntas para a equipe: "o que vocês fariam com mais uma semana?", "por que usar o app, e não um caderno?".

Como responder:

- Ouça a pergunta até o fim
- Responda em até 30 segundos, mostrando no app se ajudar
- Não sabe? "Não testamos esse caso; eu começaria por..." vale mais do que inventar

A resposta conta na sua participação: quem fez a tela explica a tela.

---

## :icon[users] A ficha dos pares

No fim, cada pessoa avalia os colegas da **própria equipe** na [ficha dos pares](materiais/projeto-7/ficha-dos-pares.html). É a nota do motorista no app de transporte: quem viajou junto avalia a viagem, não a simpatia. Para cada colega:

1. Fez a tela e o componente combinados
2. Veio aos encontros, ou avisou e recuperou
3. Revisou pull requests e ajudou quem travou
4. Avisou quando travou ou ia atrasar
5. Seguiu os combinados: branch, pull request, nada na tela do outro sem falar

Sim vale 2, Em parte 1, Não 0: de 0 a 10 por colega. A média é metade da sua participação, 10 dos 20 pontos; a outra metade vem do seu GitHub. Só o instrutor lê a ficha.

---

## :icon[milestone] Projeto 7 · A vez da equipe: a banca

:::steps
1. Na vez anterior à sua, a mesa de ensaio: celular no projetor, app aberto, vídeo pronto
2. Até 6 minutos: o problema, o caminho no celular, a equipe
3. Até 4 minutos de perguntas: cada pessoa responde sobre a sua parte
4. Na plateia, a ficha dos pares: um ponto forte e uma sugestão para cada outra equipe, sem nota
5. No fim, longe da equipe, a nota de cada colega; a ficha vai para o instrutor
:::

:::tip Dica
Fale olhando para a banca, não para o celular.
:::

**Pronto quando:** a equipe apresentou com todos falando, a ficha dos pares foi entregue e cada pessoa colou o link do repositório na página do Projeto 7.

---

## :icon[milestone] Projeto 7 · Etapa 5 pronta

- :icon[check] A equipe apresentou para a banca, com todas as pessoas falando
- :icon[clipboard-check] A ficha dos pares entregue ao instrutor
- :icon[link] O link do repositório da equipe na página do Projeto 7, colado por cada pessoa

A banca e o instrutor avaliam a `main` como ela estava no começo do encontro. O instrutor lança a nota na plataforma, critério por critério, com o recado da banca e a média dos colegas, sem nomes.

Quer aplicar o que a banca sugeriu? É para o portfólio, não para a nota: numa branch nova, como `ajustes-da-banca`, com pull request revisado, como sempre.

---

## O portfólio

Antes do primeiro corte, o que o cabeleireiro mostra para um cliente novo?

---

## :icon[folder-open] Portfólio: sete projetos, sete provas

O **portfólio** é a coleção dos seus trabalhos: o álbum do cabeleireiro, com as fotos dos cortes que ele já fez. O seu tem sete projetos:

- **Racha-conta**, E04 a E12: JavaScript no Node e testes com Jest
- **Agenda de contatos**, E13 a E16: objetos, listas e validação
- **Lista de tarefas**, E17 a E22: classes, erros, `localStorage` e `fetch`
- **Livro de receitas**, E24 a E27: React com dados de uma API
- **Gota**, E29 a E31: o primeiro app no celular
- **Casas de adoção**, E33 a E39: layout, tema, navegação e acessibilidade
- **O app da equipe**, E41 a E45: Git em equipe, APK e banca

Cada um é uma prova: quem lê confere, sem precisar acreditar em você.

---

## :icon[folder-open] O GitHub como vitrine

Quem contrata passa poucos minutos no seu GitHub. Arrume a vitrine:

- **Fixe seis repositórios** no perfil, em **Customize your pins**, com o app da equipe primeiro. Vale o repositório de um colega, se você contribuiu nele
- Em cada um, uma frase no **About**: o que o app faz
- Cada README é o manual que vem na caixa: o problema, um print e como rodar
- Exercício solto, sem README, fica fora dos fixados

Diga a sua parte com verbo e número:

| Promessa | Prova |
|---|---|
| "Fiz o app." | "Fiz a tela Lançamentos e o ItemLancamento, e revisei 4 pull requests." |
| "Sei React Native." | "O APK do Gasto Certo está na Release v1.0.0." |

---

## A primeira vaga

Na lista de compras do mês, o que não pode faltar, e o que entra só se der?

---

## :icon[briefcase] O que a vaga júnior pede

Uma **vaga júnior** é para quem está começando na profissão. O anúncio é a lista de compras do mês: tem o que não pode faltar e o que entra "se der". Os anúncios de desenvolvimento mobile júnior costumam pedir:

::::columns
:::col
**Quase sempre**

- JavaScript
- React ou React Native
- buscar dados de uma API
- Git e GitHub
- trabalho em equipe
:::
:::col
**Diferenciais**

- app publicado ou APK para testar
- testes automatizados
- TypeScript
- inglês para ler documentação
:::
::::

A primeira coluna inteira está nos seus repositórios. Dos diferenciais, você já tem o APK e os testes com Jest.

---

## :icon[search] Como procurar a primeira vaga

:::steps
1. Leia dez anúncios de "desenvolvedor mobile júnior", "front-end júnior" e estágio, e anote o que se repete
2. Para cada requisito, aponte a prova: o repositório e a tela
3. Candidate-se mesmo sem todos os itens: a vaga júnior existe para quem está começando
4. Conte à turma e aos conhecidos que você procura: muita vaga chega por indicação
5. Na entrevista, "me mostra um app" pede os 6 minutos de hoje: o problema, o caminho no celular e a sua parte
:::

Um perfil no **LinkedIn**, a rede social do trabalho, com o link do seu GitHub, leva quem procura gente para contratar até os seus projetos.

---

## :icon[route] O que estudar depois

:::center
![Diagrama: componentes, estado, API e Git são a base das três trilhas: React Native, onde você está; nativo, com Kotlin ou Swift; e full stack, com Node.js, banco de dados e API](images/e45-trilhas.svg)
:::

Uma **trilha** é um caminho de estudo, como as linhas de ônibus que saem do mesmo terminal. A base vale nas três: React Native, com TypeScript; nativo, com Kotlin no Android ou Swift no iPhone, que pede um Mac; full stack, com o servidor e o banco de dados.

Publicar na loja tem custo: hoje, US$ 25 uma vez no Google Play e US$ 99 por ano na Apple. Estude um tema por vez, aplicado num app seu.

---

## Resumo

:::summary
- A apresentação tem até 6 minutos: o problema, o caminho no celular e a equipe; depois, até 4 de perguntas
- A demonstração é o test-drive: uma pessoa, do começo ao fim, com um erro tratado
- O plano B é o vídeo de 1 minuto: travou por 30 segundos, ele entra, sem tirar ponto
- A banca dá 55 pontos, em níveis de 0 a 4; a ficha dos pares é metade da sua participação
- Os sete projetos no GitHub são o seu portfólio: fixados, com README e a sua parte com verbo e número
- A vaga júnior pede o que você já mostra: candidate-se e estude um tema por vez
:::

---

## :icon[graduation-cap] 180 horas depois

No E01, o primeiro programa foi uma linha no Console do navegador: `console.log('Bom dia!')`. Depois vieram a conta do restaurante, a agenda, as tarefas, as receitas, os copos de água, as casas de adoção e, hoje, o app da equipe diante da banca.

Os próximos 30 dias:

:::steps
1. Semana 1: o recado da banca no app da equipe, com pull request
2. Semana 1: seis repositórios fixados, com o About e o README
3. Semana 2: dez anúncios de vaga lidos e anotados
4. Semanas 3 e 4: um tema de estudo, aplicado num app seu
5. Toda semana: programar três vezes e mandar currículo
:::

Daqui em diante, quem avalia é o mercado. E você já tem o que mostrar.
