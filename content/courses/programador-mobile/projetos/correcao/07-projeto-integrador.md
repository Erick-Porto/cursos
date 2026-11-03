## Antes de corrigir

Guia só para instrutores. Não traz a solução: a de referência (o Gasto Certo, do briefing Controle de
gastos, com 3 telas) fica na sua máquina, fora do repositório do curso (`privado/projetos/projeto-7/`),
com o estado do código no fim de cada etapa e os quadros de avisos dos três briefings.

A nota tem duas partes. Os critérios 1 a 5 são da **equipe**: a mesma nota para todas as pessoas. O
critério 6 é **individual**. Lance na plataforma a nota de cada pessoa da equipe: os cinco primeiros
critérios iguais, o sexto de cada uma.

| Critério | Pontos | Quem avalia | Quando |
|---|---|---|---|
| 1 · O app funcionando | 30 | a banca, na demonstração | E45 |
| 2 · Interface e qualidade | 15 | a banca, na demonstração; você confirma no código | E45 |
| 3 · Trabalho em equipe no GitHub | 15 | você | véspera do E45 |
| 4 · APK e README | 10 | você | véspera do E45 |
| 5 · Apresentação | 10 | a banca | E45 |
| 6 · A sua participação | 20 | você: o GitHub (10) e a ficha dos pares (10) | véspera e depois do E45 |

A [ficha da banca](materiais/projeto-7/ficha-da-banca.html) traz os critérios 1, 2 e 5 em níveis de 0 a 4
e faz a conta: pontos = peso × nível ÷ 4. Com mais de um avaliador, a nota de cada critério é a média.
Envie a ficha à banca uma semana antes, com os três briefings do enunciado.

:::steps
1. **Na véspera do E45**, para cada equipe: clone a `main`, rode `npm install` e `npx expo start` e abra
   no Expo Go (SDK 58). Erro de versão de pacote: `npx expo install --fix` e `npx expo start -c`
2. Confira que `src/components/ui/` e `src/theme/` são os do kit (compare com
   `materiais/projeto-7/kit-app/`; só a cor primária do `tokens.js` pode mudar)
3. Preencha os critérios 3, 4 e a parte do GitHub do critério 6, com os comandos abaixo, e anote para a
   banca uma pergunta para cada pessoa sobre a parte dela
4. **No E45**, a banca preenche os critérios 1, 2 e 5 durante a apresentação. Depois, recolha as fichas
   dos pares e feche o critério 6
:::

### O que as telas mostram com os dados do kit

| Briefing | Resultado esperado |
|---|---|
| Agenda de serviços | 6 serviços; Corte de cabelo "30 min · R$ 45,00". Agendar na segunda: 6 horários livres (sem 10:00 e 14:00); na quarta, 7; nos outros dias, 8. Agendados: 3. Horários na segunda: 2 Ocupado (Ana Souza às 10:00, Bruno Lima às 14:00) |
| Cardápio e pedidos | Lanches 4 (Wrap de frango esgotado), Bebidas 3, Sobremesas 3 (Brownie esgotado). 2 X-Burger: R$ 45,80. Carrinho de exemplo: 3 unidades, R$ 54,80, previsão de 16 minutos. Total abaixo de R$ 15,00: pedido recusado |
| Controle de gastos | Saldo R$ 1727,10, entradas R$ 1950,00, saídas R$ 222,90. Categorias: Mercado R$ 45,90 (21%), Transporte R$ 22,00 (10%), Contas da casa R$ 120,00 (54%), Lazer R$ 35,00 (16%) |

Depois do E43, o primeiro uso no celular mostra os dados de exemplo; o que a pessoa criou ou apagou
fica guardado. Para ver os números da tabela, apague o app do Expo Go da lista de recentes e limpe os
dados dele, ou confira no celular de quem nunca abriu o app.

## Critério 1 · O app funcionando (30)

**O que conferir.** Na demonstração e depois, no seu celular:

- todas as telas do briefing (3 na equipe de 3, 4 na equipe de 4) abrem: as abas pela barra de baixo,
  as telas da pilha pelo toque (o cartão do serviço, o produto, o botão Novo lançamento, Fechar pedido)
- as regras, com a tabela acima: o horário ocupado que não aparece; o esgotado que não entra no
  carrinho, a quantidade de 1 a 10, o pedido mínimo e a previsão; o valor zero recusado, a categoria
  que muda com o tipo e o saldo
- os dados no celular: crie um item, feche o app de verdade (tire da lista de apps abertos), abra de
  novo. O item continua. Apague tudo: aparece o `EstadoVazio`

**Como pontuar** (nível da ficha da banca, de 0 a 4):

- 4 (30): tudo acima
- 3 (22,5): uma regra com falha pequena, como a previsão sem o limite de 45 minutos
- 2 (15): uma tela faltando, ou os dados que somem ao fechar o app
- 1 (7,5): o app abre, mas o caminho principal não termina (não agenda, não faz o pedido, não lança)
- 0: o app não abre

**Erros comuns.** `item.id === id` sem `Number(id)` no Agendar ou no Produto: a tela não acha nada;
horário livre calculado só pela hora, sem o dia; o total do carrinho somando só os preços, sem a
quantidade; `lerValor` trocado por `Number(valor)`, que aceita "abc" como `NaN`; o Provider fora do
`app/_layout.js`, e uma tela que mostra outra lista.

## Critério 2 · Interface e qualidade (15)

**O que conferir.** O [checklist de qualidade](materiais/projeto-7/checklist-de-qualidade.html), tela por
tela: troque o tema na Sobre e no celular; esvazie a lista; envie o formulário vazio; ligue o TalkBack ou
o VoiceOver num cartão e num botão só com ícone; aumente a letra do celular ao máximo. No código:

```bash
git grep -n -E "#[0-9a-fA-F]{3,8}\b" -- app src/components ":(exclude)src/components/ui"
git grep -n -E "(fontSize|gap|padding|margin|borderRadius): [0-9]" -- app src/components ":(exclude)src/components/ui"
```

O primeiro deve vir vazio. O segundo pode trazer medidas de tamanho (`width: 72`, `minHeight: 44`),
mas não espaços, raios e letras soltos.

**Como pontuar:**

- 4 (15): o checklist todo marcado em todas as telas
- 3 (11,25): um item falhando numa tela, como uma lixeira sem `rotulo`
- 2 (7,5): o tema escuro ilegível numa tela, ou o formulário que mostra os erros só num `Alert`
- 1 (3,75): as telas sem as peças do kit, com cores escritas à mão
- 0: nada da lista

**Erros comuns.** Cor dentro do `StyleSheet.create`; o texto da pessoa sem `color` do tema, que fica
preto no escuro; `BotaoIcone` sem `rotulo`; `accessibilityLabel` no `Text` de dentro, e não no bloco; o
"Em construção" do kit esquecido numa tela.

## Critério 3 · Trabalho em equipe no GitHub (15)

**O que conferir.** No repositório da equipe:

- **Issues**: de 8 a 12 histórias (fechadas ou abertas), com "Como..., quero..., para...", o Pronto
  quando, um rótulo `precisa-ter`, `deveria-ter` ou `poderia-ter` e um responsável
- a regra da `main`: a página `/rules` do repositório (aberta a qualquer pessoa num repositório público)
  mostra o ruleset `main protegida` ativo
- **Pull requests**, aba **Closed**: cada um com a aprovação de outra pessoa ("approved these changes") e,
  de preferência, `Closes #N`. No terminal, os merges e os autores:

```bash
git log --merges --oneline --first-parent main
git shortlog -sn --no-merges
```

O primeiro lista um `Merge pull request #N` por pull request. Commits diretos na `main` depois do E41
aparecem na mesma lista, sem o "Merge pull request": anote quais.

**Como pontuar:**

- 15: as Issues completas, a regra ativa desde o E42 e todos os pull requests revisados por outra pessoa
- 11: até 2 pull requests sem revisão, ou as Issues sem responsável ou sem rótulo
- 7: a regra desligada ou ligada só no fim, ou metade dos pull requests aprovados pelo próprio autor
- 3: o código entrou quase todo por commit direto na `main`
- 0: um repositório privado, ou sem Issues nem pull requests

**Erros comuns.** Repositório privado, onde a regra não vale no plano gratuito; o pull request fechado
sem merge e o código copiado para a `main` à mão; o conflito resolvido com "Accept Current" e a linha
do colega apagada (a aba do colega some do `app/(abas)/_layout.js`).

## Critério 4 · APK e README (10)

**O que conferir.** O link do README abre a versão `v1.0.0` em **Releases**, com o `.apk` anexado (ou,
no mínimo, a página do build no expo.dev). Baixe e instale num Android: o app abre sem o Expo Go, com o
nome e o ícone do app. O `eas.json` tem o perfil `preview` com `"buildType": "apk"`; o `app.json` tem o
`android.package`. O README segue o modelo do enunciado: o problema, o que o app faz, um print por tela
em `docs/`, como instalar, como rodar, a tabela da equipe com o que cada pessoa fez e o "Fora desta
versão".

**Como pontuar:**

- 10: o APK instala e abre, e o README tem tudo do modelo
- 7: falta uma parte do README, ou o link do APK é a página do build, que pode expirar
- 4: README sem prints, ou sem APK (o build falhou e a equipe não refez)
- 0: o README do kit sem mudança

**Erros comuns.** O APK feito antes das últimas mudanças da `main` (o celular mostra a versão velha);
`android.package` com hífen; a tabela da equipe sem dizer o que cada pessoa fez.

## Critério 5 · Apresentação (10)

**O que conferir.** O cronômetro (6 minutos de apresentação, 4 de perguntas): o problema no primeiro
minuto; o caminho principal no celular, do começo ao fim (agendar, fazer um pedido, lançar um gasto e
ver o saldo mudar), com um erro tratado (o formulário recusando um campo); como a equipe trabalhou;
todas as pessoas falando. Demonstração que trava por mais de 30 segundos: a equipe passa para o vídeo
gravado, e isso não tira ponto.

**Como pontuar:**

- 4 (10): tudo acima, dentro do tempo
- 3 (7,5): passou até 1 minuto, ou a demonstração pulou uma parte do caminho
- 2 (5): o problema não ficou claro, ou só uma ou duas pessoas falaram
- 1 (2,5): sem demonstração e sem vídeo
- 0: a equipe não apresentou

## Critério 6 · A sua participação (20)

Nota de cada pessoa, em duas metades de 10.

**O GitHub (10).** Em **Pull requests** e no `git log --author="Nome"`:

| O que ver | Pontos |
|---|---|
| o componente da pessoa em `src/components/`, com as props e o comentário no topo, em commits dela | 3 |
| a tela da pessoa, com as peças do kit, em commits dela | 3 |
| pelo menos um pull request dela com merge, revisado por outra pessoa | 2 |
| pelo menos uma revisão dela no pull request de um colega (aprovação ou comentário) | 2 |

A tarefa da equipe (repositório, dados, publicação, README) não soma pontos aqui: ela já conta nos
critérios da equipe. Mas quem só fez a tarefa e nenhuma tela perde os 6 pontos da tela e do componente.

**A ficha dos pares (10).** Cada pessoa avalia cada colega da própria equipe em 5 itens, com Sim (2),
Em parte (1) ou Não (0): de 0 a 10 por colega. A nota da pessoa é a média do que os colegas deram.

:::steps
1. Recolha a [ficha dos pares](materiais/projeto-7/ficha-dos-pares.html) no fim do E45, uma por pessoa,
   preenchida longe dos colegas
2. Tire a média de cada pessoa. Na equipe de 3, são duas notas; na de 4, três
3. Notas que destoam (um colega dá 2 e o outro dá 10): converse com cada um em particular antes de
   lançar. Valem o que o GitHub mostra e o que você viu em aula
4. Ficha sem comentário que dá 0 a alguém não vale sozinha: a nota precisa de um motivo
5. Nunca conte quem deu qual nota. Repasse à pessoa só a média e os comentários, sem nome
:::

Sem ficha (a pessoa faltou ao E45), a metade dos pares vale o que você viu nos encontros E41 a E44.

**A pergunta da banca.** Se a pessoa não explica a própria tela nem o próprio componente, anote em
"Observações" da ficha da banca e converse depois, antes de lançar a nota (veja "Sinais de que alguém
não participou").

## Check-in por etapa

No começo do encontro seguinte, 2 a 3 minutos: abra o repositório de uma equipe no projetor e olhe
**uma** coisa.

| Etapa | O que olhar |
|---|---|
| 1 · E41 | as Issues com rótulo e responsável; a aba Sobre com a equipe |
| 2 · E42 | a página `/rules`; um pull request com a aprovação de um colega |
| 3 · E43 | o `useEffect` do `setItem` com a trava `carregado`; o app fechado e aberto de novo |
| 4 · E44 | o link do APK no README e o perfil `preview` no `eas.json` |
| 5 · E45 | o link na página do projeto (painel do instrutor, aba Projetos), de cada pessoa |

## Sinais de que alguém não participou

- Nenhum commit nem pull request com o nome da pessoa, ou só commits no README
- O componente e a tela da pessoa em commits de outra conta ("o colega fez por mim")
- Todos os commits da pessoa no último dia, depois de uma semana parada
- As fichas dos colegas dizem o mesmo, com motivos ("não veio no E43 e não avisou", "não abriu o pull
  request da tela")
- A pessoa não explica a própria tela: não sabe de onde vem a lista nem o que a prop do componente faz

**Como agir.** Converse em particular, sem acusar. Peça para a pessoa abrir a tela dela e mudar algo ao
vivo: "faça o selo Esgotado ficar amarelo", "mostre o valor sem o sinal de menos". Quem fez responde em
um minuto. Se não souber, a metade do GitHub vale o que os commits mostram, e a nota da equipe não muda.
Equipe que cobriu a falta de um colega não perde ponto por isso.

## Sinais de cópia entre equipes

- Duas equipes do mesmo briefing com os mesmos nomes de variáveis incomuns, os mesmos comentários e os
  mesmos erros
- Telas iguais às da solução de referência do instrutor além do que foi feito juntos em aula. Os
  passos juntos (o quadro de avisos, o esqueleto das telas, a tela Lançamentos da demonstração) são
  iguais em todas as equipes: isso não é cópia
- Bibliotecas e padrões que o curso não usou: TypeScript, `axios`, Redux, `useReducer`, hooks próprios,
  comentários em inglês por todo o código

Ajuda entre equipes e consulta às aulas não são cópia; código idêntico sem entendimento é.
