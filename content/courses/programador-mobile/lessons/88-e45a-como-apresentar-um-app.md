---
title: Como apresentar um app
summary: Pitch de 8 minutos com demo ao vivo, arquitetura em um slide, plano B em vídeo e a rubrica do Demo Day.
module: integracao
duration_minutes: 30
objectives:
  - Estruturar um pitch de 8 minutos, do problema aos aprendizados
  - Planejar uma demo ao vivo com dados prontos e um plano B em vídeo
  - Explicar a arquitetura do app em um slide e responder à banca
  - Interpretar a rubrica do projeto e a avaliação entre pares
---

# Como apresentar um app

Programador Mobile · Encontro E45 · Aula 88 de 89

---

## O que você vai aprender

:::goal
- Montar um pitch de 8 minutos: problema, solução, demo ao vivo, arquitetura e aprendizados
- Preparar o celular, a rede e os dados para a demo não travar, com o vídeo como plano B
- Responder às perguntas da banca com objetividade
- Entender como a banca e a turma avaliam o projeto
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **pitch** | uma apresentação curta que convence: o problema, o app funcionando e por que ele vale |
| **demo** | a demonstração do app funcionando, ao vivo |
| **banca** | o grupo de avaliadores que assiste, pergunta e dá a nota |
| **plano B** | o que você usa quando o plano principal falha; na demo, o vídeo |
| **espelhar** | mostrar a tela do celular no projetor, ao vivo |
| **rubrica** | a tabela de critérios, cada um com o seu peso, que a banca usa para dar a nota |

---

## Por que isso importa

Na entrevista para a primeira vaga, a recrutadora pede: "Me mostra um app que você fez". Você tem o celular na mão e cinco minutos. Quem abre o app e fala da tela de login por dois minutos perde a atenção. Quem conta o problema em uma frase e mostra o caminho principal funcionando sai lembrado.

Hoje é o ensaio geral disso: cada equipe apresenta o app do projeto integrador a uma banca.

:::question
Se o Wi-Fi cair no meio da sua demo, o que você mostra no lugar?
:::

---

## O pitch

Oito minutos diante de uma banca: quanto desse tempo é do app funcionando?

---

## :icon[timer] O pitch de 8 minutos

O **pitch** é a apresentação curta que convence. Como o vendedor da feira, que descasca a batata na sua frente em vez de falar do descascador, você mostra o app funcionando. No Demo Day, são 8 minutos:

| Parte | Tempo | O que mostrar |
|---|---|---|
| Problema | 1 min | quem sofre, com o quê, hoje |
| Solução | 1 min | o app em uma frase e para quem ele é |
| Demo ao vivo | 4 min | o caminho principal no celular espelhado |
| Arquitetura | 1 min | um slide com as camadas do app |
| Aprendizados | 1 min | o que deu certo e o que vocês mudariam |

---

## :icon[timer] Metade do pitch é demo

:::center
![Animação: um marcador percorre a linha do tempo de 8 minutos e passa metade dela na demo ao vivo, de 4 minutos, entre problema e solução, no começo, e arquitetura e aprendizados, no fim](images/e45-pitch-8-minutos.svg)
:::

Problema e solução cabem em 2 minutos, e arquitetura e aprendizados em mais 2. Os outros 4 são da demo: o app é a estrela, não os slides.

Depois vêm **4 minutos de perguntas** da banca. Combine antes quem fala em cada parte e quem opera o celular.

---

## :icon[timer] O pitch na prática: a Lojinha em 60 segundos

| Parte | Tempo | O que se diz ou mostra |
|---|---|---|
| Problema | 10 s | "Quem compra pelo celular desiste quando o carrinho some ao fechar o app." |
| Solução | 10 s | "A Lojinha guarda o carrinho no aparelho: a compra continua de onde parou." |
| Demo | 30 s | dois produtos no carrinho e o total; o app fechado e aberto de novo, com o carrinho lá |
| Arquitetura | 10 s | "As telas só desenham; as regras ficam em `src/regras/`, com testes, e a API em `src/api/`." |

A palavra AsyncStorage não aparece em nenhum momento: a tecnologia fica para a arquitetura.

---

## A abertura

Numa notícia, o que faz você clicar para ler o resto?

---

## :icon[target] Abra com o problema

A **abertura** é a primeira frase do pitch, e ela decide se a banca presta atenção. Funciona como a manchete de uma notícia: em uma linha, quem lê decide se continua. Compare duas aberturas do app **Agenda de serviços**:

| Abertura fraca | Abertura forte |
|---|---|
| "Nosso app foi feito em React Native com Expo Router e json-server." | "A barbearia do bairro marca horário por mensagem. Dois clientes chegam na mesma hora e um vai embora." |
| "Agora vamos mostrar as telas." | "Com o app, o cliente vê só os horários livres e agenda em três toques." |

Fórmula: **quem** + **qual dor** + **o que o app muda**. A tecnologia aparece no slide de arquitetura, não na abertura.

---

## A demo

Num test-drive, o vendedor mostra cada botão ou leva você para dar uma volta?

---

## :icon[smartphone] A demo conta a história de um usuário

A **demo** é o app funcionando, ao vivo. Pense num test-drive: o vendedor não explica cada botão do carro; ele leva você para dar uma volta. Na demo, siga **um usuário** pelo caminho principal, do começo ao fim. No **Cardápio e pedidos**:

:::steps
1. Ana abre o cardápio e põe só um suco no carrinho
2. Tenta enviar: o app avisa que o pedido mínimo é R$ 15,00
3. Volta e adiciona um X-Salada "sem cebola"; o carrinho mostra o total
4. Envia o pedido e vê "Recebido", com a previsão de retirada
5. Um colega, no papel da cozinha, avança o status; Ana puxa para atualizar e vê "Em preparo"
:::

---

## :icon[circle-check] O erro de propósito

Na demo do Cardápio, Ana tenta enviar só um suco, e o app recusa: o pedido mínimo é R$ 15,00. Isso é um **erro de propósito**: uma regra funcionando convence mais do que esconder os casos ruins.

- Escolha um erro que o app trata bem, como um valor zero recusado ou um horário ocupado que não aparece
- Use dados realistas: nada de "aaa", "teste123" ou R$ 0,00 na tela
- Ensaie com cronômetro: 4 minutos, com folga de 30 segundos

---

## Pense

:::question
Sua equipe fez o **Controle de gastos**. Em 4 minutos de demo, quais três momentos você mostra? E o que fica de fora?
:::

:::tip Resposta
Uma história possível:

1. Lançar R$ 45,90 em Mercado, depois de o formulário recusar o valor zero
2. Ver o saldo do mês cair na hora e o alerta de Mercado passar de 80% do limite
3. Abrir o resumo por categoria e mostrar para onde o dinheiro foi

Ficam de fora o cadastro de categorias, a edição de lançamentos e o tema escuro, a menos que a banca pergunte. O critério é: o que prova que o app resolve o problema?
:::

---

## O plano B

Por que todo carro sai com estepe, se quase nunca fura um pneu?

---

## :icon[shield-check] O plano B: o vídeo da demo

O **plano B** é o que você usa quando o plano principal falha. É o estepe do carro: você torce para não precisar, mas não sai sem ele.

Na demo, o plano B é o vídeo do README, gravado no E44 e baixado no computador da apresentação. Se a rede da sala cair, você mostra o mesmo caminho no vídeo.

:::tip Regra dos 30 segundos
Travou por 30 segundos? Diga "vou mostrar no vídeo" e narre por cima dele. Falha da rede da sala não tira ponto de quem tem plano B.
:::

---

## :icon[monitor] Prepare o palco

Teste rede, celular e dados na sala, antes da sua vez:

- :icon[smartphone] Celular carregado, em **não perturbe** (sem notificações), só com o app aberto
- :icon[monitor] **Espelhamento** testado: **scrcpy**, um programa gratuito, no Android; QuickTime num Mac, no iPhone; ou uma câmera
- :icon[wifi] Mesma rede e `json-server` no ar; se o IP mudou desde o build do APK, use o Expo Go
- :icon[database] `db.json` realista, restaurado com `git restore db.json` antes de cada ensaio: o comando desfaz as mudanças no arquivo e volta ao último commit
- :icon[play] O vídeo do README baixado e aberto no computador

---

## Arquitetura

Num restaurante, o cliente entra na cozinha para buscar o prato?

---

## :icon[network] Arquitetura em um slide

A **arquitetura** é como o app se divide em partes, e quem fala com quem. Pense num restaurante: o cliente fica no salão (as telas) e pede ao garçom (a API); a cozinha (o **backend**, a parte que roda no servidor) prepara. O cliente nunca entra na cozinha.

No pitch, a arquitetura cabe em um slide: as camadas do app e **uma decisão, com o porquê**. Exemplo de decisão:

:::example Uma decisão
"Deixamos as regras fora das telas para testá-las sem abrir o app."
:::

---

## :icon[layers] As camadas da Agenda de serviços

| Camada | Onde fica | No app |
|---|---|---|
| Telas | `app/` e `src/features/` | Serviços, Horários, Meus agendamentos |
| Estado | hook ou contexto | os agendamentos do cliente |
| Regras | funções puras testadas | horários livres, cancelar até 2 horas antes |
| API | `src/api/` | `GET /servicos`, `POST /agendamentos` |
| Backend | `json-server` | `db.json` no computador da equipe |

As chamadas só descem, da tela ao servidor, como no E42: a tela chama o hook ou o contexto, ele chama a `api/`, e só a `api/` fala com o backend.

---

## A banca

No desfile das escolas de samba, como os jurados chegam à nota?

---

## :icon[messages-square] Perguntas da banca

A **banca** é o grupo de avaliadores: assiste, pergunta e dá a nota, como os jurados de um desfile de escola de samba. As perguntas que costumam aparecer:

- "O que acontece se a internet cair?"
- "Onde estão as regras de negócio, e como vocês as testaram?"
- "Por que Context e não outra biblioteca de estado?"
- "Quem fez o quê?" e "Qual foi o conflito de Git mais difícil?"
- "O que vocês fariam com mais duas semanas?"

Como responder: **ouça até o fim**, responda em até 30 segundos e mostre no app ou no código se ajudar. Não sabe? "Não testamos esse caso; eu começaria por..." vale mais do que inventar.

---

## :icon[clipboard-check] Como o projeto é avaliado

A **rubrica** é a tabela de critérios da banca. Como os quesitos do desfile, cada critério tem o seu peso:

| Critério | Peso | O que a banca observa |
|---|---|---|
| Funcionalidade | 30 | telas e regras do briefing funcionando no celular |
| Qualidade de código | 20 | pastas por funcionalidade, regras testadas, lint limpo |
| Interface e experiência | 20 | os 4 estados, tema, acessibilidade, toque |
| Trabalho em equipe e processo | 15 | board, PRs revisados, commits de todos |
| Apresentação | 15 | tempo, problema claro, demo, respostas |

---

## :icon[users] A avaliação entre pares

Além da banca, a turma também avalia. A **avaliação entre pares** (os pares são os colegas) vale 20% da nota do projeto.

Cada colega dá de 1 a 5 às outras equipes em três pontos:

- **Problema e solução:** entendi para quem é o app e que problema ele resolve?
- **Demo:** o app funcionou, e a história fez sentido?
- **Clareza e tempo:** a equipe se fez entender dentro dos 8 minutos?

E escreve um ponto forte e uma sugestão. Ninguém avalia a própria equipe.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Abrir com a tecnologia ou com a tela de login em vez do problema
- Demo sem roteiro: passear por todas as telas e estourar o tempo
- Dados de teste como "aaa", "teste123" e R$ 0,00 na tela
- Testar o espelhamento só na hora e perder três minutos com cabo e rede
- Ler os slides de costas para a banca
- Uma pessoa fala tudo e as outras só assistem
:::

---

## Resumo

:::summary
- O pitch tem 8 minutos: problema, solução, 4 minutos de demo, arquitetura e aprendizados
- A abertura diz quem sofre, com o quê, e o que o app muda
- A demo segue a história de um usuário, com dados realistas e um erro tratado de propósito
- Rede, celular e dados se testam na sala; o vídeo baixado entra em 30 segundos se algo travar
- A banca avalia por uma rubrica de 100 pontos, e a turma responde por 20% da nota
:::

---

## :icon[arrow-right] Próximos passos

Agora vêm as apresentações, na ordem sorteada. Nos minutos antes da sua vez:

:::steps
1. `git restore db.json` e o `json-server` no ar
2. App aberto no celular, carregando da API, em não perturbe
3. Vídeo baixado e aberto no computador
4. Combinado quem fala cada parte e quem opera o celular
:::

Enquanto as outras equipes apresentam, preencha a ficha da avaliação entre pares. Depois do resultado, a aula 89 fecha o curso: carreira em desenvolvimento mobile.
