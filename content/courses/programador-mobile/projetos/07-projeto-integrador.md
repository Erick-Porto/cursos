---
title: "Projeto 7 · Projeto integrador"
summary: "Em equipe, um app Expo do briefing à banca: backlog nas Issues, branches e pull requests, dados no celular, APK e apresentação."
section: Módulo Específico
module: integracao
opens: e41-do-briefing-ao-backlog
due: e45-apresentacao-e-carreira
due_label: apresentação no E45
passing_score: 70
required: true
rubric:
  - key: app
    title: O app funcionando
    points: 30
    description: "As telas do briefing (3 na equipe de 3, 4 na equipe de 4) abrem pelas abas e pela pilha; as regras do briefing dão os resultados do enunciado com os dados do kit; o que a pessoa cria continua no app depois de fechar e abrir."
  - key: interface
    title: Interface e qualidade
    points: 15
    description: "Telas montadas com as peças do kit e as cores do useTema(), sem código de cor em app/ e nos componentes da equipe, legíveis nos dois temas, com lista vazia, mensagem embaixo de cada campo com erro e rótulos para o leitor de tela: o checklist de qualidade do E44."
  - key: equipe
    title: Trabalho em equipe no GitHub
    points: 15
    description: "Backlog nas Issues, com história, Pronto quando, rótulo e responsável; a main protegida; todo código entrou por pull request revisado por outra pessoa da equipe; conflitos resolvidos sem apagar o trabalho de ninguém."
  - key: publicacao
    title: APK e README
    points: 10
    description: "Um APK de teste feito com o EAS, que instala num Android, com o link no README; o README de portfólio com o problema, o que o app faz, os prints, como instalar e rodar e quem fez o quê."
  - key: apresentacao
    title: Apresentação
    points: 10
    description: "Até 6 minutos, com o problema no primeiro minuto, o caminho principal mostrado no celular, todas as pessoas falando e respostas diretas às perguntas da banca."
  - key: participacao
    title: A sua participação
    points: 20
    description: "Nota individual: o seu componente e a sua tela, com commits e pull requests no seu nome; uma revisão sua no pull request de um colega; a avaliação dos colegas de equipe na ficha dos pares; e você explica a sua parte quando a banca pergunta."
steps:
  - lesson: e41-do-briefing-ao-backlog
    when: E41
    title: Equipe, briefing e backlog
    summary: "Equipes de 3 ou 4, um briefing escolhido, o backlog nas Issues e o repositório da equipe criado a partir do kit, clonado por todos."
  - lesson: e42-git-em-equipe
    when: E42
    title: As primeiras telas por branch e pull request
    summary: "A main protegida, cada pessoa com a sua tela numa branch e um pull request revisado por um colega, e um conflito resolvido."
  - lesson: e43-dados-no-aparelho
    when: E43
    title: Os dados no celular
    summary: "O quadro de avisos da equipe (createContext e useContext) e o AsyncStorage: o que a pessoa cria continua lá depois de fechar o app."
  - lesson: e44-publicacao-e-portfolio
    when: E44
    title: APK e README
    summary: "O checklist de qualidade em cada tela, o APK de teste feito com o EAS e o README de portfólio com os prints."
  - lesson: e45-apresentacao-e-carreira
    when: E45
    title: Apresentação à banca
    summary: "Até 6 minutos por equipe, com o app no celular, a ficha dos pares e o link do repositório na plataforma."
---

## O que vocês vão construir

No projeto integrador, a turma trabalha em **equipes de 3 ou 4 pessoas**. Cada equipe escolhe um dos
três briefings desta página e faz o app do começo ao fim, em cinco encontros: do backlog no GitHub à
apresentação para uma banca, no E45.

O ponto de partida é um **kit** com o que vocês já conhecem do Projeto 6: o Expo Router, as peças de
tela (o UI kit), os tokens e o tema claro e escuro. Os dados fixos dos três briefings já vêm no kit.
**Cada pessoa cria uma tela e um componente seu** (no máximo dois) e monta a tela com as peças do kit.
Além disso, cada pessoa cuida de uma tarefa da equipe: o repositório, os dados no celular, o APK ou
o README.

| Encontro | A equipe sai do encontro com |
|---|---|
| E41 | equipe, briefing, backlog nas Issues e o repositório da equipe no celular de todos |
| E42 | a `main` protegida e a primeira versão de cada tela, cada uma por um pull request revisado |
| E43 | os dados guardados no celular: fechou o app, abriu de novo, está tudo lá |
| E44 | o checklist de qualidade feito, o APK de teste e o README de portfólio |
| E45 | a apresentação para a banca e a ficha dos pares |

A prática de cada encontro é a etapa do projeto: a turma faz os passos junto com o instrutor e,
depois, cada equipe faz a sua parte em aula.

### Material do curso

- [kit-app.zip](materiais/projeto-7/kit-app.zip): o ponto de partida. Só quem cria o repositório
  baixa (etapa 1); o resto da equipe clona do GitHub
- [Modelo de backlog](materiais/projeto-7/modelo-de-backlog.html): como escrever uma história e o
  Pronto quando, os rótulos, as histórias de partida de cada briefing e a tabela de quem faz o quê
- [Checklist de qualidade](materiais/projeto-7/checklist-de-qualidade.html): o que cada tela precisa
  passar antes do APK (etapa 4)
- [Ficha dos pares](materiais/projeto-7/ficha-dos-pares.html): a avaliação dos colegas de equipe,
  preenchida no E45
- [Ficha da banca](materiais/projeto-7/ficha-da-banca.html): o que a banca confere em cada equipe

Versões do kit: Expo SDK 58 (`expo` 58.0.23), React Native 0.88.1, React 19.3.0, Expo Router 58.0.30
e AsyncStorage 2.2.0. Abra no **Expo Go** da loja de aplicativos, atualizado. O `package-lock.json`
vem junto para toda a equipe instalar as mesmas versões: rode `npm install` e não apague o lock.
Não instale nenhum pacote novo: tudo o que o projeto usa já está no kit.

### Pastas do kit

```plaintext
kit-app/ (a equipe renomeia para o nome do app, como gasto-certo)
├── app/                      as telas: cada arquivo é uma rota do Expo Router
│   ├── _layout.js            o que envolve todas as telas: o tema e a pilha
│   ├── index.js              Início (no E41 vai para app/(abas)/)
│   └── sobre.js              Sobre, pronta (no E41 vai para app/(abas)/)
├── src/
│   ├── components/ui/        o UI kit pronto, o mesmo do Projeto 6
│   ├── theme/                tokens.js, o useTema e a aparência da navegação, os mesmos do Projeto 6
│   ├── data/                 equipe.js e os dados dos três briefings
│   └── utils/                formatarReais, lerValor, formatarData e paraBusca
├── jsconfig.json             cria o atalho @ para a pasta src/
└── package.json, package-lock.json, app.json
```

O `@` nos imports é um atalho para a pasta `src/`, como no Projeto 6. Os nomes de arquivos,
componentes e props desta página são obrigatórios: é por eles que o instrutor encontra a parte de
cada pessoa.

## Os três briefings

Um **briefing** é o pedido de quem encomenda o app: o problema, para quem é e o que não pode faltar.
Cada equipe escolhe um no E41 e fica com ele até o fim. A equipe de 3 faz as três primeiras telas da
tabela; a equipe de 4 faz as quatro.

### Briefing 1 · Agenda de serviços

**Problema:** o salão do bairro marca horários por telefone e num caderno. No horário de pico ninguém
atende, e às vezes dois clientes chegam para o mesmo horário.

**Público:** clientes que marcam pelo celular, com pressa, entre um compromisso e outro.

**Dados:** `src/data/agenda.js`, com os 6 `servicos` (nome, duração, preço em centavos, descrição e
ícone), os `dias` (segunda a sábado), os 8 `horarios` do dia e 3 `agendamentosDeExemplo`.

| Tela | Arquivo | O que mostra |
|---|---|---|
| Serviços (primeira aba) | `app/(abas)/index.js` | os 6 serviços com nome, duração e preço; tocar num serviço abre o Agendar |
| Agendar | `app/agendar/[id].js` | o serviço escolhido, o dia, só os horários livres desse dia, o nome do cliente e o botão Agendar |
| Agendados (aba) | `app/(abas)/agendamentos.js` | os agendamentos, com serviço, dia, hora e cliente, e o botão Cancelar |
| Horários (aba, equipe de 4) | `app/(abas)/horarios.js` | um dia escolhido e os 8 horários, cada um Livre ou Ocupado |

**Regras:**

- Um horário está **ocupado** quando já existe um agendamento com o mesmo dia e a mesma hora. O
  Agendar mostra só os livres
- Para agendar: um dia escolhido, um horário escolhido e o nome com pelo menos 2 letras, cada erro
  embaixo do seu campo
- Cancelar tira o agendamento da lista, e o horário volta a ficar livre

**Com os dados do kit:** Corte de cabelo aparece como "30 min · R$ 45,00"; na segunda, 6 horários
livres (o 10:00 e o 14:00 estão ocupados); na quarta, 7; nos outros dias, 8. Agendados mostra 3.

### Briefing 2 · Cardápio e pedidos

**Problema:** na hora do almoço, a fila do balcão da lanchonete chega a 20 minutos. O cliente não vê o
cardápio com os preços e não sabe quando o lanche fica pronto.

**Público:** quem trabalha ou estuda perto, pede no intervalo e retira no balcão.

**Dados:** `src/data/cardapio.js`, com as 3 `categorias`, os 10 `produtos` (nome, categoria, preço em
centavos, descrição e `disponivel`) e o `carrinhoDeExemplo`, com 2 itens.

| Tela | Arquivo | O que mostra |
|---|---|---|
| Cardápio (primeira aba) | `app/(abas)/index.js` | a escolha da categoria e os produtos dela, com nome, descrição e preço; tocar abre o Produto |
| Produto | `app/produto/[id].js` | o produto, a quantidade, a observação, o subtotal e o botão Adicionar ao carrinho |
| Carrinho (aba) | `app/(abas)/carrinho.js` | os itens com quantidade, observação e subtotal, a lixeira, o total e o botão do pedido |
| Finalizar (equipe de 4) | `app/finalizar.js` | as unidades, o total, a previsão de retirada, o nome para chamar no balcão e Confirmar pedido |

**Regras:**

- Produto com `disponivel: false` aparece apagado, com o selo Esgotado, e não entra no carrinho
- Quantidade de 1 a 10; observação de até 140 letras, como "sem cebola"
- Pedido mínimo de R$ 15,00
- Previsão de retirada: 10 minutos mais 2 por unidade, no máximo 45
- Fazer o pedido esvazia o carrinho. Na equipe de 3, o botão Fazer pedido fica no Carrinho; na
  equipe de 4, o Carrinho leva ao Finalizar, que pede o nome com pelo menos 2 letras

**Com os dados do kit:** Lanches mostra 4 produtos (o Wrap de frango esgotado), Bebidas 3 e
Sobremesas 3 (o Brownie esgotado); 2 X-Burger dão R$ 45,80; o carrinho de exemplo tem 3 unidades,
R$ 54,80 e previsão de 16 minutos.

### Briefing 3 · Controle de gastos

**Problema:** muita gente chega ao fim do mês sem saber para onde foi o dinheiro. Anota no caderno ou
numa planilha e desiste na segunda semana.

**Público:** jovens no primeiro emprego ou estágio, que querem lançar um gasto em segundos, na fila do
caixa.

**Dados:** `src/data/gastos.js`, com os `tipos` (Entrada e Saída), as 6 `categorias` (cada uma de um
tipo) e 6 `lancamentosDeExemplo` (tipo, valor em centavos, categoria, descrição e data).

| Tela | Arquivo | O que mostra |
|---|---|---|
| Início (primeira aba) | `app/(abas)/index.js` | o saldo, as entradas e as saídas, e o botão Novo lançamento |
| Lançamentos (aba) | `app/(abas)/lancamentos.js` | os lançamentos, do mais novo para o mais velho, com o valor em verde ou vermelho e a lixeira |
| Novo lançamento | `app/novo.js` | o tipo, o valor, a categoria (só as do tipo), a descrição, o resumo e o botão Salvar |
| Categorias (aba, equipe de 4) | `app/(abas)/categorias.js` | cada categoria de saída com o total, a porcentagem das saídas e uma barra |

**Regras:**

- O valor é obrigatório e maior que zero: `lerValor('45,90')` dá `4590`; o que não é valor dá `null`
- Tipo e categoria escolhidos; descrição com pelo menos 3 letras; cada erro embaixo do seu campo
- Saldo = soma das entradas menos soma das saídas
- Porcentagem de uma categoria: `Math.round(valor * 100 / totalDasSaidas)`, ou 0 sem saídas

**Com os dados do kit:** saldo R$ 1727,10, entradas R$ 1950,00 e saídas R$ 222,90. Nas Categorias:
Mercado R$ 45,90 (21%), Transporte R$ 22,00 (10%), Contas da casa R$ 120,00 (54%) e Lazer R$ 35,00
(16%).

## Componentes do kit

As peças são as mesmas do Projeto 6. Cada uma tem, no topo do próprio arquivo, um comentário com as
props que recebe, e todas usam as cores do tema: no tema escuro, elas escurecem sozinhas.

| Peça | Props | O que mostra |
|---|---|---|
| `Tela` | `rolar`, `comCabecalho`, `style` | o fundo do tema e a área segura, com padding e gap de 16 |
| `Cartao` | `titulo`, `style` | moldura com fundo, borda e cantos arredondados |
| `Badge` | `texto`, `tom` | selo pequeno; tons `neutro`, `sucesso`, `alerta` e `perigo` |
| `Botao` | `titulo`, `onPress`, `variante`, `icone`, `desabilitado` | botão `primaria`, `secundaria` ou `perigo` |
| `BotaoIcone` | `icone`, `rotulo`, `onPress`, `cor` | botão redondo só com ícone, alvo de 48 por 48 |
| `Campo` | `rotulo`, `erro`, `icone` e as props do `TextInput` | rótulo, caixa de texto e erro embaixo |
| `Opcoes` | `rotulo`, `opcoes`, `valor`, `onMudar`, `erro` | fileira de botões para escolher uma opção |
| `LinhaInfo` | `icone`, `texto` | uma linha com ícone e texto (some sem texto) |
| `EstadoVazio` | `titulo`, `mensagem`, `icone`, `textoAcao`, `onAcao` | aviso de "nada aqui", com ação opcional |
| `EstadoErro` | `mensagem`, `titulo`, `onTentarDeNovo` | aviso de erro com o botão Tentar de novo |
| `Carregando` | `texto` | a rodinha de espera com um texto |

Importe as peças de `@/components/ui`. Fora delas, o kit traz:

```javascript
import { espaco, fonte, raio, useTema } from '@/theme';
const { cores, escuro, alternarTema } = useTema();

import { formatarData, formatarReais, lerValor, paraBusca } from '@/utils';
formatarReais(4590);                  // 'R$ 45,90'
lerValor('45,90');                    // 4590 (centavos); lerValor('abc') dá null
formatarData(new Date(2026, 9, 8));   // '08/10/2026'
paraBusca(' Água ');                  // 'agua'

import { briefing, equipe, frase, nomeDoApp } from '@/data/equipe';
```

As três primeiras funções de `@/utils` são as do Projeto 1. A tela Sobre vem pronta e lê o nome do
app, a frase e a equipe de `src/data/equipe.js`.

## Como a equipe se divide

Cada pessoa fica com **uma tela e um componente seu**, que a tela usa. Quem quiser cria um segundo
componente, no máximo. O componente vai em `src/components/` (fora da pasta `ui/`) e tem, no topo, o
comentário com as props, como as peças do kit.

| Briefing | Tela 1 | Tela 2 | Tela 3 | Tela 4 (equipe de 4) |
|---|---|---|---|---|
| Agenda de serviços | Serviços: `CartaoServico` (`servico`, `onPress`) | Agendar: `ResumoServico` (`servico`) | Agendados: `CartaoAgendamento` (`agendamento`, `onCancelar`) | Horários: `LinhaHorario` (`hora`, `cliente`) |
| Cardápio e pedidos | Cardápio: `CartaoProduto` (`produto`, `onPress`) | Produto: `SeletorQuantidade` (`valor`, `onMudar`) | Carrinho: `ItemCarrinho` (`item`, `onRemover`) | Finalizar: `ResumoPedido` (`itens`) |
| Controle de gastos | Início: `CartaoSaldo` (`rotulo`, `valor`, `cor`) | Lançamentos: `ItemLancamento` (`lancamento`, `onRemover`) | Novo: `ResumoLancamento` (`tipo`, `valor`, `categoria`) | Categorias: `BarraCategoria` (`nome`, `valor`, `percentual`) |

Além da tela, cada pessoa cuida de **uma tarefa da equipe**. Na equipe de 3, alguém fica com duas.

| Tarefa | Quando | O que faz |
|---|---|---|
| Repositório | E41 | baixa o kit, cria o repositório no GitHub, convida a equipe e liga a regra da `main` |
| Dados no celular | E43 | escreve o quadro de avisos com o AsyncStorage, que as outras telas usam |
| Publicação | E44 | faz o APK de teste com o EAS e a página da versão no GitHub |
| README | E44 | escreve o README de portfólio, com os prints que a equipe manda |

Combinados que valem o projeto inteiro:

- Ninguém faz commit na `main`: cada mudança vai numa branch e entra por pull request
- Cada pull request é revisado por outra pessoa da equipe, que roda no celular antes de aprovar
- Cada pessoa mexe nos arquivos da sua tela e do seu componente. Arquivo de todos (`app/_layout.js`,
  `app/(abas)/_layout.js`, `src/data/`) muda só no que a etapa pede
- As peças de `src/components/ui/` e o `src/theme/` são do kit: não mude, a não ser a cor primária
  no `tokens.js`, se a equipe quiser outra

## Etapas

Cada etapa é feita no encontro. Primeiro, **juntos**: a turma faz os passos com o instrutor, com o
código nos slides. Depois, **a vez da equipe**: cada pessoa faz a sua parte, com as dicas do slide.
Quem faltou faz a sua parte pelos slides da aula e por esta página antes do encontro seguinte, e avisa
a equipe: cada etapa começa onde a anterior terminou.

### Etapa 1 · E41: equipe, briefing e backlog

**Juntos em aula**

1. As equipes de 3 ou 4 e o briefing de cada uma, combinados com o instrutor. A equipe dá um nome ao
   app e preenche a tabela "Quem faz o quê" do [modelo de backlog](materiais/projeto-7/modelo-de-backlog.html)
2. Uma história de usuário escrita juntos, com o Pronto quando: "Como cliente, quero ver os horários
   livres do dia, para marcar sem ligar"
3. Quem cuida do repositório baixa o [kit-app.zip](materiais/projeto-7/kit-app.zip), descompacta,
   renomeia a pasta para o nome do app, roda `npm install` e `npx expo start` e abre no Expo Go. Depois:
   cria o `.gitignore` (`node_modules/`, `.expo/` e `dist/`); cria a pasta `app/(abas)`, leva para
   dentro dela o `index.js` e o `sobre.js` e cria o `_layout.js` das abas, como no E37, com uma aba por linha: a
   primeira com o nome da tela 1 do briefing (Serviços, Cardápio ou Início) e a Sobre;
   apaga de `src/data/` os dois briefings que a equipe não escolheu; preenche o `src/data/equipe.js`; faz
   o primeiro commit e envia para um repositório **público** no GitHub
4. Ainda quem cuida do repositório: **Settings**, **Collaborators**, **Add people**, e convida cada
   pessoa da equipe. Cada pessoa aceita o convite que chega por e-mail, roda `git clone` com o endereço
   do repositório, `npm install` e `npx expo start`, e abre o app no próprio celular

**A vez da equipe**: o backlog. Cada pessoa escreve nas **Issues** do repositório as 2 ou 3 histórias
da sua tela, cada uma com a história, o Pronto quando, o rótulo de prioridade e a própria pessoa como
responsável. Os rótulos são `precisa-ter`, `deveria-ter` e `poderia-ter`; o que fica de fora vai para o
README, na seção "Fora desta versão".

**Pronto quando**: o repositório público mostra o kit, sem `node_modules/`; o app abre no celular de
todos, com as duas abas (a da tela 1 e a Sobre), e a Sobre mostra o nome do app, a frase e a equipe; as Issues têm de
8 a 12 histórias, cada uma com rótulo e responsável.

Primeiro commit: `Kit do app e as abas Início e Sobre`.

### Etapa 2 · E42: as primeiras telas por branch e pull request

**Juntos em aula**

1. Quem cuida do repositório liga a regra da `main`: **Settings**, **Rules**, **Rulesets**, **New
   ruleset**, **New branch ruleset**, com o nome `main protegida`, **Active**, **Include default
   branch** e **Require a pull request before merging** com 1 aprovação. Daqui em diante, ninguém faz
   push direto na `main`
2. Cada pessoa cria a sua branch a partir da `main` atualizada (`git switch main`, `git pull` e
   `git switch -c esqueleto-` mais o nome da tela) e faz o esqueleto da sua tela: o arquivo com a
   `Tela` e um `EstadoVazio` "Em construção" e, se a tela é uma aba, a linha dela no
   `app/(abas)/_layout.js`. Commit e `git push -u origin` mais o nome da branch
3. O pull request: no GitHub, **Compare & pull request**, a descrição com `Closes #` e o número da
   issue, e um colega como revisor. O colega abre **Files changed**, roda no celular, aprova com
   **Review changes**, **Approve**, e o autor faz o **Merge pull request**. Depois de cada merge, todos:
   `git switch main` e `git pull`
4. O conflito: duas pessoas mudam a mesma linha (a `frase` do `src/data/equipe.js`) em branches
   diferentes. O segundo pull request avisa que tem conflito; a pessoa traz a `main` para a branch com
   `git merge main --no-edit`, escolhe no VS Code o que fica, faz o commit e o push

**A vez da equipe**: a primeira versão da sua tela, numa branch `tela-` mais o nome da tela, com o seu
componente e os dados de exemplo do kit, montada com as peças do kit. Pull request revisado por outra
pessoa e merge. A tela que leva a uma tela da pilha já tem o toque que abre a tela do colega.

**Pronto quando**: a regra recusa um push direto na `main`; na `main`, o app abre com todas as telas da
equipe na primeira versão, com os números da seção do seu briefing; cada pessoa tem pelo menos dois
pull requests com merge e revisou o de um colega.

### Etapa 3 · E43: os dados no celular

**Juntos em aula**

1. Quem cuida dos dados cria, numa branch `dados-no-celular`, o **quadro de avisos** da equipe:
   `src/data/GastosContext.js` (ou `AgendaContext.js`, ou `CarrinhoContext.js`), com `createContext`,
   o Provider com a lista num `useState` (começando nos dados de exemplo) e as funções `adicionar` e
   `remover` (e `esvaziar`, no Cardápio). A equipe acompanha na tela dessa pessoa
2. O Provider entra no `app/_layout.js`, em volta da `Pilha`, e a tela dessa pessoa passa a ler a
   lista com `useContext`, no lugar do import dos dados de exemplo
3. A gaveta do celular: dois `useEffect` com o AsyncStorage. Um, ao abrir o app, lê o texto guardado
   com `getItem` e o transforma de volta com `JSON.parse`; o outro guarda de novo com `setItem` e
   `JSON.stringify` sempre que a lista muda, só depois da primeira leitura
4. Pull request revisado por toda a equipe, merge, e todos `git switch main` e `git pull`

**A vez da equipe**: cada pessoa liga a sua tela ao quadro, numa branch `dados-` mais o nome da tela:
`useContext` no lugar dos dados de exemplo e, onde a tela muda a lista, `adicionar`, `remover` ou
`esvaziar`. Pull request revisado e merge.

**Pronto quando**: o que a pessoa cria numa tela aparece nas outras (um lançamento novo muda o saldo;
um agendamento novo ocupa o horário; um item novo muda o total do carrinho); fechou o app de verdade
(tirou da lista de apps abertos) e abriu de novo, está tudo lá; com a lista vazia, aparece o
`EstadoVazio`.

### Etapa 4 · E44: APK e README

**Juntos em aula**

1. Cada pessoa passa a sua tela pelo [checklist de qualidade](materiais/projeto-7/checklist-de-qualidade.html):
   tema escuro, lista vazia, formulário com erros, leitor de tela, letra grande e nenhuma cor solta
2. Quem cuida da publicação, numa branch `apk`: o nome do app no `app.json` (`name`, `slug`, `scheme`
   e o `android.package`, como `com.anasouza.gastocerto`) e o arquivo `eas.json` com o perfil
   `preview`, que gera um APK. Depois, `npx eas-cli@latest login` com a conta do Expo e
   `npx eas-cli@latest build -p android --profile preview`. O build vai para a fila gratuita do Expo:
   pode levar de alguns minutos a mais de uma hora, então ele começa cedo
3. Quem cuida do README escreve o README de portfólio (modelo na seção Como entregar) numa branch
   `readme`; cada pessoa manda o print da sua tela, tirado do celular, para a pasta `docs/`
4. Com o build pronto, o link da página do build abre no Android, baixa e instala o APK. Quem cuida da
   publicação baixa o APK e cria a versão `v1.0.0` em **Releases**, no GitHub, com o arquivo anexado

**A vez da equipe**: cada pessoa corrige na sua tela o que o checklist pegou, numa branch
`qualidade-` mais o nome da tela, e o pull request entra antes do README.

**Pronto quando**: o APK instalou em pelo menos um Android da equipe e abre sem o Expo Go; o README
mostra os prints e o link da versão `v1.0.0`; o checklist de cada tela está todo marcado.

### Etapa 5 · E45: apresentação à banca

**Juntos em aula**

1. O roteiro de 6 minutos: o problema (1 minuto), o caminho principal no celular (3), como a equipe
   trabalhou e o que cada pessoa fez (2)
2. Um ensaio cronometrado por equipe, com o celular espelhado ou numa câmera, e o plano B pronto: um
   vídeo curto da tela do celular, gravado antes, para o caso de a demonstração travar

**A vez da equipe**: a apresentação para a banca, com até 4 minutos de perguntas. Depois, cada pessoa
preenche a [ficha dos pares](materiais/projeto-7/ficha-dos-pares.html) sobre os colegas da própria
equipe.

**Pronto quando**: a equipe apresentou com todas as pessoas falando, a ficha dos pares foi entregue e
cada pessoa colou o link do repositório na página deste projeto.

## Como entregar

1. Um repositório **público** por equipe, sem `node_modules/`, com a `main` protegida e todo o código
   entrando por pull request
2. **Cada pessoa** cola o link do repositório da equipe na página deste projeto, na plataforma. O
   endereço `exp://` do `npx expo start` não serve: ele some quando o computador desliga
3. O `README.md` do kit trocado pelo da equipe, com:

   ```markdown
   # Gasto Certo

   App para lançar um gasto em segundos, na fila do caixa. Projeto integrador do curso
   Programador Mobile, feito em equipe.

   ## O problema
   Duas ou três frases, do briefing.

   ## O que o app faz
   - Uma linha por tela

   ## Prints
   ![Início no tema claro](docs/inicio.png)

   ## Instale no Android
   O link da versão v1.0.0, com o APK.

   ## Como rodar o código
   npm install e npx expo start; abra no Expo Go (SDK 58).

   ## Equipe
   | Pessoa | O que fez |
   |---|---|
   | Ana Souza (@ana-souza) | tela Início e o componente CartaoSaldo; o APK |

   ## Fora desta versão
   O que ficou para depois.
   ```

   Os prints ficam na pasta `docs/`, um por tela, tirados do celular
4. A ficha dos pares, preenchida no E45

**Prazo: a apresentação no E45.** A banca e o instrutor avaliam a `main` como ela estava no início do
encontro. O instrutor dá a nota pela rubrica, critério por critério, para cada pessoa. Aprovação com 70.

## Como será avaliado

Os cinco primeiros critérios são da **equipe**: a mesma nota para todas as pessoas. O último é
**individual**. Antes de entregar, confira cada critério com a equipe.

- **O app funcionando (30).** Nota cheia: todas as telas da equipe, as regras do briefing com os números
  da seção dele e os dados que continuam depois de fechar o app. Parcial: uma tela faltando, uma regra
  errada (um horário ocupado que aparece, um pedido abaixo do mínimo aceito), ou os dados que somem.
- **Interface e qualidade (15).** Nota cheia: o checklist de qualidade todo marcado em todas as telas.
  Parcial: um texto que some no tema escuro, um formulário que só mostra um `Alert` geral, uma lixeira
  sem rótulo.
- **Trabalho em equipe no GitHub (15).** Nota cheia: as Issues com rótulo e responsável, a regra da
  `main` ativa e todos os pull requests revisados por outra pessoa. Parcial: pull requests aprovados
  pelo próprio autor, ou histórias sem Pronto quando.
- **APK e README (10).** Nota cheia: o APK instala e abre; o README tem tudo do modelo. Parcial: o
  README sem prints, ou sem o link do APK.
- **Apresentação (10).** Nota cheia: dentro dos 6 minutos, o problema no começo, o app funcionando no
  celular e todas as pessoas falando. Parcial: passou muito do tempo, ou só uma pessoa falou.
- **A sua participação (20).** Metade vem do que o GitHub mostra de você: o seu componente e a sua
  tela, com commits e pull requests no seu nome, e uma revisão sua no pull request de um colega. A
  outra metade vem da ficha dos pares, a média do que os colegas de equipe disseram do seu trabalho. A
  banca também pergunta a cada pessoa sobre a parte dela.

## Dúvidas frequentes

**A equipe ficou com 2 pessoas.** Avise o instrutor no E41: ele junta a dupla a outra pessoa ou
combina as telas. Se alguém deixar o curso no meio do projeto, a equipe tira a tela 4 do plano e
continua.

**Posso fazer as quatro telas na equipe de 3?** Pode, e a tela a mais não conta ponto extra. Primeiro,
as três da tabela.

**Meu colega não revisa o meu pull request.** Peça na daily do encontro ou pelo grupo da equipe. A
regra da `main` não deixa o autor aprovar o próprio pull request: sem revisão, não tem merge.

**O terminal recusou o meu push com `GH013`.** É a regra da `main`: você fez commit direto nela. Crie
uma branch ali mesmo (`git switch -c` e um nome), faça o push dela e abra o pull request. Nada se
perde: os commits vão junto para a branch nova.

**Apareceu um conflito e fiquei com medo de perder código.** O conflito não apaga nada: o Git mostra as
duas versões e espera você escolher. Se quiser desistir e começar de novo, `git merge --abort` volta a
branch para como estava antes do merge.

**O build do EAS está na fila há muito tempo.** É a fila gratuita do Expo. Fechar o terminal não
cancela o build: acompanhe pela página do build, no site do Expo. A conta gratuita tem um limite de
builds por mês, então faça o build só quando o checklist estiver pronto.

**Tenho iPhone. Como instalo o APK?** O APK é só para Android. Quem tem iPhone abre o app pelo Expo Go,
como nos outros projetos, e a equipe instala o APK no Android de alguém.

**Faltei a um encontro.** Faça a sua parte da etapa pelos slides e por esta página, numa branch, e
abra o pull request antes do encontro seguinte. Avise a equipe: ela revisa e junta.

## Para ir além

Opcional e sem ponto extra:

- Uma busca na lista com o `Campo` e o `paraBusca` do kit
- Confirmação antes de apagar, com um `Alert` de dois botões
- Agenda: serviço de 60 minutos que ocupa dois horários; Cardápio: o mesmo produto somado na mesma
  linha do carrinho; Gastos: um limite por categoria, com o selo de alerta a partir de 80%
- Um ícone próprio para o app, trocando os arquivos de `assets/`
