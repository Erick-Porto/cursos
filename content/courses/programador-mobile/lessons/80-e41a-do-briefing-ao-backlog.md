---
title: Do briefing ao backlog
summary: Escolha o app da equipe entre três briefings e transforme-o em requisitos, histórias, prioridades e protótipo.
module: integracao
duration_minutes: 40
objectives:
  - Analisar os três briefings e escolher o app da equipe
  - Separar requisitos funcionais de não funcionais
  - Escrever histórias de usuário com critérios de aceite e priorizá-las com MoSCoW
  - Desenhar o protótipo de baixa fidelidade das 5 telas mínimas
---

# Do briefing ao backlog

Programador Mobile · Encontro E41 · Aula 80 de 89

---

## O que você vai aprender

:::goal
- Ler um **briefing** e escolher, com a equipe, o app que vocês constroem até o Demo Day
- Separar requisitos funcionais de não funcionais
- Escrever histórias de usuário com critérios de aceite que alguém consegue testar
- Priorizar o backlog com MoSCoW e desenhar as 5 telas em papel
:::

---

## Por que isso importa

Três colegas resolvem fazer um app de delivery num fim de semana. Cada um abre o VS Code e começa por onde gosta: um faz o login, outro o tema escuro, o terceiro uma animação na splash.

Domingo à noite, o app tem tudo isso e não faz um pedido sequer. Ninguém errou no código. A equipe errou **no que construir primeiro**, e ninguém sabia dizer quando uma parte estava pronta.

:::question
Como a equipe decide o que construir, em que ordem e quando cada parte está pronta?
:::

---

## :icon[milestone] Do kickoff ao Demo Day

| Encontro | O que a equipe entrega |
|---|---|
| E41 · Kickoff | briefing, protótipo, backlog, repositório com quadro e o app criado |
| E42 · Arquitetura | navegação completa, tema e dados no `json-server` |
| E43 · Sprint 1 | as histórias Must, por PR revisado, e os dados no aparelho |
| E44 · Sprint 2 | as Should, testes das regras, APK, README e vídeo |
| E45 · Demo Day | pitch de 8 minutos com o app ao vivo |

**Rubrica**: Funcionalidade 30, Qualidade de código 20, Interface e experiência 20, Trabalho em equipe e processo 15, Apresentação 15. A avaliação entre pares vale 20% da nota do projeto.

---

## :icon[calendar-check] Briefing 1: Agenda de serviços

**Problema:** um salão ou barbearia do bairro marca horários por telefone e num caderno. No horário de pico, ninguém atende; às vezes, dois clientes chegam para o mesmo horário.

**Público:** clientes que marcam pelo celular, com pressa, entre um compromisso e outro.

**5 telas mínimas:**

1. **Serviços**: nome, duração e preço de cada serviço
2. **Horários**: profissional, dia e horários livres para o serviço escolhido
3. **Confirmação**: resumo do agendamento e botão Agendar
4. **Meus agendamentos**: próximos e anteriores, com status e Cancelar
5. **Perfil**: nome e telefone do cliente

---

## :icon[calendar-clock] Agenda de serviços: regras e dados

- Expediente de segunda a sábado, das 9h às 18h, em blocos de 30 minutos
- Horário livre não cruza outro agendamento do mesmo profissional; um serviço de 60 minutos ocupa dois blocos e termina até as 18h
- Agendamento com pelo menos 1 hora de antecedência e até 14 dias à frente
- Cancelamento até 2 horas antes: o status vai de `agendado` para `cancelado`; agendamento que já passou aparece como `concluido`

```json
{
  "servicos": [{ "id": "s1", "nome": "Corte", "duracaoMin": 30, "preco": 45 }],
  "profissionais": [{ "id": "p1", "nome": "Rafa", "servicoIds": ["s1", "s2"] }],
  "clientes": [{ "id": "c1", "nome": "Ana Souza", "telefone": "(11) 98765-4321" }],
  "agendamentos": [
    { "id": "a1", "clienteId": "c1", "servicoId": "s1", "profissionalId": "p1",
      "data": "2026-10-20", "hora": "14:30", "status": "agendado" }
  ]
}
```

É o `db.json` que o `json-server` serve a partir do E42: ids em texto, ligações por `servicoId` e datas no formato `AAAA-MM-DD`.

---

## :icon[store] Briefing 2: Cardápio e pedidos

**Problema:** na hora do almoço, a fila do balcão de uma lanchonete chega a 20 minutos. O cliente não vê o cardápio com preços e não sabe quando o lanche fica pronto.

**Público:** quem trabalha ou estuda perto, pede no intervalo e retira no balcão.

**5 telas mínimas:**

1. **Cardápio**: produtos por categoria, como lanches, bebidas e sobremesas
2. **Produto**: foto, descrição, quantidade e observação, como "sem cebola"
3. **Carrinho**: itens, quantidades, total e o nome para chamar no balcão
4. **Acompanhar pedido**: a etapa atual do pedido feito
5. **Meus pedidos**: os pedidos anteriores, com status e total

---

## :icon[receipt] Cardápio e pedidos: regras e dados

- Produto com `disponivel: false` aparece apagado e não entra no carrinho
- De 1 a 10 unidades por produto; observação de até 140 caracteres
- Pedido mínimo de R$ 15,00
- Status em ordem: `recebido`, `preparando`, `pronto`, `retirado`; o cliente cancela (`cancelado`) só enquanto está `recebido`
- Previsão de retirada: 10 minutos mais 2 por unidade, no máximo 45
- Quem avança o status é a cozinha; a tela de acompanhar busca de novo ao puxar e a cada 15 segundos

```json
{
  "categorias": [{ "id": "lanches", "nome": "Lanches", "ordem": 1 }],
  "produtos": [
    { "id": "1", "nome": "X-Burger", "preco": 22.9, "categoriaId": "lanches", "disponivel": true,
      "descricao": "Pão, hambúrguer, queijo e salada", "imagem": null }
  ],
  "pedidos": [
    { "id": "pd1", "clienteNome": "Ana", "criadoEm": "2026-10-20T12:05:00", "status": "recebido",
      "total": 22.9,
      "itens": [{ "produtoId": "1", "nome": "X-Burger", "qtd": 1, "preco": 22.9, "observacao": "sem cebola" }] }
  ]
}
```

---

## :icon[wallet] Briefing 3: Controle de gastos

**Problema:** muita gente chega ao fim do mês sem saber para onde foi o dinheiro. Anota no caderno ou numa planilha e desiste na segunda semana.

**Público:** jovens no primeiro emprego ou estágio, que querem lançar um gasto em menos de 10 segundos, na fila do caixa.

**5 telas mínimas:**

1. **Mês**: saldo do mês, com entradas, saídas e troca de mês
2. **Lançamentos**: a lista do mês, agrupada por dia
3. **Novo lançamento**: valor, entrada ou saída, categoria, data e descrição; a mesma tela edita
4. **Categorias**: lista com limite mensal opcional; criar e excluir
5. **Resumo por categoria**: quanto das saídas foi para cada uma

---

## :icon[chart-pie] Controle de gastos: regras e dados

- Valor obrigatório e maior que zero, guardado em centavos; data obrigatória e nunca no futuro
- O mês de um lançamento é o da `data` dele, não o dia em que foi cadastrado
- Saldo do mês: soma das entradas menos soma das saídas
- Resumo: percentual de cada categoria sobre as saídas, do maior para o menor
- Limite da categoria: alerta a partir de 80% e perigo acima de 100%
- Categoria com lançamentos não pode ser excluída

```json
{
  "categorias": [
    { "id": "mercado", "nome": "Mercado", "tipo": "saida", "limiteCentavos": 60000 },
    { "id": "salario", "nome": "Salário", "tipo": "entrada", "limiteCentavos": null }
  ],
  "lancamentos": [
    { "id": "l1", "tipo": "saida", "valorCentavos": 4590, "categoriaId": "mercado",
      "data": "2026-10-08", "descricao": "Feira da semana" },
    { "id": "l2", "tipo": "entrada", "valorCentavos": 180000, "categoriaId": "salario",
      "data": "2026-10-05", "descricao": "Bolsa do estágio" }
  ]
}
```

---

## :icon[list-checks] Requisitos funcionais e não funcionais

Um **requisito funcional** diz **o que** o app faz. Um **requisito não funcional** diz **como** ele precisa se comportar enquanto faz.

| Funcional | Não funcional |
|---|---|
| O cliente cancela até 2 horas antes | Funciona em Android e iOS, nos dois temas |
| O carrinho recusa produto indisponível | O cardápio aparece em até 2 segundos no 4G |
| O resumo mostra o percentual de cada categoria | Texto legível com a fonte do sistema em 200% |

Os não funcionais valem para todas as telas. Em vez de virar uma história, entram nos critérios de aceite e no checklist do PR.

---

## :icon[notebook-pen] Histórias de usuário e critérios de aceite

Uma **história de usuário** descreve uma necessidade, não uma tela: **Como** quem, **quero** o quê, **para** quê.

:::example História · Agenda de serviços
Como cliente, quero ver os horários livres do dia, para marcar sem trocar mensagens.

**Critérios de aceite**
- Dado que o Rafa tem um corte às 14h30 do dia 20, quando escolho o Rafa no dia 20, então 14h30 não aparece
- Dado que são 13h50, quando abro o dia de hoje, então o primeiro horário é 15h
- Dado um serviço de 60 minutos, então 17h30 não aparece
:::

Os **critérios de aceite** seguem **Dado, Quando, Então**: qualquer pessoa da equipe testa sem perguntar nada, e a partir do E43 eles viram testes automatizados.

---

## Pratique

:::example Desafio
No Controle de gastos, a usuária quer saber se está perto de estourar o limite do Mercado. Escreva a história e dois critérios de aceite com Dado, Quando, Então.
:::

:::tip Resposta
Como usuária, quero ver quanto já gastei do limite de cada categoria, para segurar os gastos antes do fim do mês.

- Dado o limite de R$ 600,00 no Mercado e R$ 500,00 gastos em outubro, quando abro o resumo de outubro, então o Mercado mostra 83% com o selo de alerta
- Dado R$ 650,00 gastos no Mercado em outubro, quando abro o mesmo resumo, então ele mostra 108% com o selo de perigo

Números concretos tornam o critério testável. "Mostrar o limite corretamente" não diz o que conferir.
:::

---

## :icon[list-ordered] Backlog e MoSCoW

O **backlog** é a lista de histórias da equipe, ordenada por prioridade: o topo é o que se faz primeiro. **MoSCoW** separa as histórias em quatro grupos: **Must**, sem isso não há app; **Should**, importante, mas a demo vive sem; **Could**, se sobrar tempo; **Won't**, não desta vez, e fica escrito.

:::center
![Diagrama: o backlog da Agenda de serviços em quatro faixas; os Must vão para o Sprint 1, os Should para o Sprint 2, os Could só entram se sobrar tempo e os Won't ficam de fora](images/e41-moscow-backlog.svg)
:::

Os Must cabem no Sprint 1 (E43); os Should, no Sprint 2 (E44). Se tudo é Must, nada é prioridade.

---

## :icon[pencil] Protótipo de baixa fidelidade

Antes de qualquer código, desenhe as 5 telas **em papel**: caixas, rótulos e setas, sem cor e sem fonte. Errar no papel custa um minuto; no código, uma tarde.

:::steps
1. Um retângulo de celular por tela, com o nome dela no topo
2. Caixas para o conteúdo, com texto real: "Corte · 30 min · R$ 45,00"
3. Setas entre as telas, rotuladas com o toque: "toca em Agendar"
4. Teste do corredor: alguém de outra equipe tenta agendar só apontando com o dedo, sem você explicar
5. Onde a pessoa travou, redesenhe; depois, fotografe as telas para o README
:::

Excalidraw ou Figma também servem, desde que o desenho continue rápido e sem cor.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Escolher o briefing pelo que parece mais fácil, sem ler as regras: são elas que dão trabalho
- História que descreve tela ou tecnologia, como "Tela de login com Firebase", em vez de uma necessidade
- História grande demais, como "Como usuário, quero gerenciar meus gastos": quebre em partes que caibam num encontro
- Critério vago, como "funcionar direito" ou "ser rápido"
- Tudo Must e nenhum Won't: o escopo não cabe em quatro encontros
- Pular o protótipo, ou caprichar tanto nele que ninguém quer mudar o fluxo
:::

---

## Resumo

:::summary
- O briefing traz problema, público, telas mínimas, regras e dados; as regras são o coração do app
- Requisito funcional diz o que o app faz; não funcional, como ele se comporta em todas as telas
- História de usuário: Como, quero, para; critérios com Dado, Quando, Então viram testes
- O backlog ordenado com MoSCoW diz o que entra em cada sprint e o que fica de fora
- O protótipo em papel testa o fluxo antes da primeira linha de código
:::

---

## :icon[arrow-right] Próximos passos

O app da equipe tem rumo: briefing, histórias e protótipo. Falta combinar **como duas ou três pessoas mexem no mesmo código** sem atropelar ninguém.

Na aula 81, o trabalho em equipe com Git:

- :icon[kanban] o backlog num quadro do GitHub Projects
- :icon[git-branch] uma branch por história e Pull Request com revisão obrigatória
- :icon[shield-check] a `main` protegida por uma regra do GitHub
- :icon[messages-square] a daily de 5 minutos
