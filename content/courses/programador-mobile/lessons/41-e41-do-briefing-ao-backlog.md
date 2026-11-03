---
title: Do briefing ao backlog
summary: "Começa o Projeto 7, em equipe: o briefing, as histórias nas Issues e o repositório no celular de todos."
module: integracao
duration_minutes: 90
objectives:
  - Ler um briefing e dividir o app da equipe em uma tela, um componente e uma tarefa por pessoa
  - Escrever histórias de usuário com um Pronto quando que qualquer pessoa confere no celular
  - Montar o backlog nas Issues do GitHub, com rótulo de prioridade e responsável
  - Criar o repositório da equipe a partir do kit, convidar os colegas e clonar com git clone
---

# Do briefing ao backlog

Programador Mobile · Encontro E41 · Aula 41 de 45

---

## O que você vai aprender

:::goal
- Começar o Projeto 7, o app da sua equipe
- Ler o briefing, o pedido de quem encomenda o app
- Escrever o que o app precisa fazer em histórias, cada uma com o seu Pronto quando
- Pôr as histórias em ordem de prioridade, nas Issues do GitHub
- Criar o repositório da equipe e trazer os colegas para dentro dele
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **briefing** | o pedido de quem encomenda o app: o problema, para quem é e o que não pode faltar |
| **história de usuário** | uma necessidade de quem usa o app, numa frase: quem, o quê e para quê |
| **Pronto quando** | a lista do que se confere no celular para dizer que a história ficou pronta |
| **backlog** | a lista do que a equipe vai fazer, da coisa mais importante para a menos |
| **issue** | uma tarefa anotada no GitHub, com número, responsável e rótulo |
| **colaborador** | uma pessoa que pode mandar código para o repositório de outra |

---

## Cada um começou por onde gostava

Três amigos fazem um app num fim de semana. Cada um começa pelo que acha legal: um faz o tema escuro, outro a tela Sobre, o terceiro troca o ícone. No domingo, o app tem tudo isso e não faz a coisa principal. Faltou combinar **o que fazer primeiro** e **quando cada parte está pronta**.

| Agora | No fim do encontro |
|---|---|
| nenhuma equipe | equipes de 3 ou 4, cada uma com um briefing |
| nenhum plano | de 8 a 12 histórias nas Issues |
| nenhum código | o repositório da equipe e o app no celular de todos |

:::question
Como a sua equipe vai decidir o que fazer primeiro?
:::

---

## :icon[milestone] Projeto 7: o app da equipe

O **Projeto 7**, o projeto integrador, é feito em **equipe**, de 3 ou 4 pessoas, com um **kit**: as peças de tela, os tokens e o tema do Projeto 6, sem as casas.

| Encontro | A equipe sai com |
|---|---|
| E41, hoje | equipe, briefing, backlog e repositório |
| E42 | a primeira versão de cada tela, revisada por um colega |
| E43 | os dados guardados no celular |
| E44 | o instalador para Android e o README |
| E45 | a apresentação para a banca, os jurados |

A nota tem uma parte da equipe e uma parte sua. Enunciado, rubrica e entrega: página do curso, em **Projetos**.

---

## Briefing

Quem encomenda uma festa, o que precisa dizer ao bufê?

---

## :icon[file-text] Briefing: a encomenda do app

Um **briefing** (do inglês *brief*, resumo) é o pedido de quem encomenda o app, por escrito. É a encomenda de uma festa: o bufê precisa saber o motivo, quem vem e o que não pode faltar.

Cada briefing do Projeto 7 tem cinco partes:

- **Problema**: o que dá errado hoje, sem o app
- **Público**: quem vai usar, e em que situação
- **Telas**: o que o app mostra; três na equipe de 3, quatro na de 4
- **Regras**: as contas e os limites que o app respeita
- **Dados**: o que o app usa; já vêm no kit, em `src/data/`

Leia as regras com atenção: são elas que dão trabalho.

---

## :icon[clipboard-list] Os três briefings

| Briefing | O problema | As telas | Uma regra |
|---|---|---|---|
| Agenda de serviços | dois clientes marcados no mesmo horário | Serviços, Agendar, Agendados (e Horários) | só aparecem os horários livres |
| Cardápio e pedidos | 20 minutos de fila, sem ver preço nem previsão | Cardápio, Produto, Carrinho (e Finalizar) | pedido mínimo de R$ 15,00 |
| Controle de gastos | o dinheiro some, e o caderno de contas fica abandonado | Início, Lançamentos, Novo lançamento (e Categorias) | saldo é entradas menos saídas |

A tela entre parênteses é só da equipe de 4. O briefing inteiro, com o público e todas as regras, está no enunciado do Projeto 7.

---

## Trabalho em equipe

Na reforma de uma casa, o pintor também faz a parte elétrica?

---

## :icon[users] Uma tela, um componente, uma tarefa

Num trabalho de verdade, o app sai de uma equipe, como a reforma de uma casa: pedreiro, eletricista e pintor, cada um na sua parte. No Projeto 7, cada pessoa fica com **uma tela**, feita com as peças do kit, **um componente seu** e **uma tarefa da equipe**:

| Tarefa | Quando | O que faz |
|---|---|---|
| Repositório | E41 | cria o repositório e convida a equipe |
| Dados no celular | E43 | guarda o que a pessoa cria |
| Publicação | E44 | faz o instalador para Android |
| README | E44 | escreve o manual, com os prints |

Na equipe de 3, sai a tela 4, e alguém fica com duas tarefas.

---

## :icon[users] A equipe na prática: o Gasto Certo

O **Gasto Certo** é o app de uma equipe de 3, com o briefing Controle de gastos:

| Pessoa | Tela | Componente | Tarefa |
|---|---|---|---|
| Ana Souza | Início | `CartaoSaldo` | repositório e publicação |
| Bruno Lima | Lançamentos | `ItemLancamento` | dados no celular |
| Carla Dias | Novo lançamento | `ResumoLancamento` | README |

Os combinados valem o projeto inteiro:

- Cada pessoa mexe nos arquivos da sua tela e do seu componente
- As peças de `src/components/ui/` e o `src/theme/` são do kit: ninguém muda
- Os nomes das telas, dos componentes e das props são os do enunciado: é por eles que o instrutor acha a parte de cada um

---

## :icon[milestone] Projeto 7 · Passo 1: a equipe e o briefing

:::steps
1. O instrutor forma as equipes, de 3 ou 4
2. A equipe escolhe um briefing do enunciado do Projeto 7, com o instrutor
3. A equipe dá ao app um nome, como **Gasto Certo**, e uma frase com o problema que ele resolve
4. Cada pessoa anota o seu usuário do GitHub
5. No [modelo de backlog](materiais/projeto-7/modelo-de-backlog.html), a tabela **Quem faz o quê**: pessoa, tela, componente e tarefa
:::

Os nomes das telas e dos componentes estão no enunciado, em **Como a equipe se divide**. O modelo só guarda o que você digita naquele navegador: imprima ou fotografe.

**Pronto quando:** cada pessoa sabe o nome da sua tela, do seu componente e da sua tarefa.

---

## História de usuário

Como pedir um bolo para quem faz entender também o motivo?

---

## :icon[notebook-pen] História: quem, o quê e para quê

Uma **história de usuário** descreve uma necessidade de quem usa o app, não uma tela. É um pedido com o motivo: "sou mãe de uma criança alérgica, quero um bolo sem leite, para o meu filho comer também". Ela cabe numa frase de três partes:

:::center
**Como** quem, **quero** o quê, **para** quê.
:::

:::example História · Agenda de serviços
Como cliente, quero ver os horários livres do dia, para marcar sem ligar para o salão.
:::

- **Como**: quem usa; aqui, o cliente do salão
- **Quero**: o que a pessoa quer fazer no app
- **Para**: o motivo, que ajuda a equipe a decidir os detalhes

---

## :icon[notebook-pen] Histórias na prática

**Caso 1: uma de cada briefing.**

- **Cardápio**: Como cliente, quero ver o total do carrinho, para saber quanto vou pagar
- **Gastos**: Como usuária, quero lançar um gasto em poucos segundos, para não desistir na fila do caixa

**Caso 2: de tela para história.** "Tela de lançamentos com FlatList" fala de tela e de código. Pergunte quem quer o quê, e para quê: "Como usuária, quero ver os meus lançamentos, do mais novo para o mais velho, para saber para onde foi o dinheiro".

**Caso 3: grande demais.** "Como usuária, quero controlar os meus gastos" é o app inteiro. Quebre em pedaços que cabem numa tela: ver o saldo, lançar um gasto, apagar um lançamento.

---

## Pronto quando

Quando a encomenda chega, o que você confere antes de aceitar?

---

## :icon[clipboard-check] Pronto quando: a conferência na entrega

Embaixo da história vem o **Pronto quando**: a lista do que qualquer pessoa da equipe confere no celular para dizer que a história ficou pronta. É a conferência da encomenda na entrega: o bolo é mesmo sem leite? Vieram as 30 fatias? Cada item dá para conferir, com os **números dos dados do kit**:

:::example Pronto quando · ver os horários livres do dia
- Na segunda, aparecem 6 horários: o 10:00 e o 14:00 já estão ocupados
- Na quarta, aparecem 7: o 09:00 está ocupado
- Sem escolher o dia, aparece "Escolha o dia" embaixo das opções
:::

No kit, os agendamentos de exemplo ocupam esses horários: quem testa abre o app e compara.

---

## :icon[square-check] Vago ou dá para conferir?

Se ninguém consegue conferir no celular, não é Pronto quando. Troque o vago pelo número:

| Vago | Dá para conferir |
|---|---|
| O saldo aparece certo | Com os dados do kit, o saldo é R$ 1727,10 |
| O carrinho funciona direito | Com 2 X-Burger e 1 suco, o total é R$ 54,80 |
| O formulário avisa o erro | Com o valor 0, aparece "Digite um valor maior que zero, como 45,90" embaixo do campo |
| O lançamento não some | Fechei o app e abri de novo: o lançamento continua lá |

Os números de cada briefing estão no enunciado do Projeto 7, em **Com os dados do kit**.

---

## :icon[milestone] Projeto 7 · Passo 2: uma história com o Pronto quando

Juntos, no quadro, uma história de cada briefing. No GitHub, ela é escrita em Markdown, como o README do E05. A da Agenda:

```markdown
**História:** Como cliente, quero ver os horários livres do dia,
para marcar sem ligar para o salão.

**Pronto quando:**
- [ ] Na segunda, aparecem 6 horários: o 10:00 e o 14:00 já estão ocupados
- [ ] Na quarta, aparecem 7: o 09:00 está ocupado
- [ ] Sem escolher o dia, aparece "Escolha o dia" embaixo das opções

**Tela:** Agendar (app/agendar/[id].js)
```

- Dois asteriscos de cada lado, `**História:**`, deixam o texto em negrito
- O `- [ ]` vira uma caixinha no GitHub: quem testa marca cada item atendido
- O modelo tem o botão **Copiar**, no [modelo de backlog](materiais/projeto-7/modelo-de-backlog.html)

**Pronto quando:** cada equipe tem, no caderno, uma história da tela 1 do seu briefing, com as três partes e um Pronto quando com número.

---

## O repositório da equipe

Três pessoas, um app: onde mora o código que todos usam?

---

## :icon[folder-open] Um álbum para a equipe

O **repositório** é o álbum de fotos do projeto, do E05, e o GitHub é o álbum na nuvem. No Projeto 7, a equipe tem **um repositório só**, e quem cuida do repositório faz o começo:

:::steps
1. Prepara o kit no computador e tira a primeira foto, o commit
2. Manda as fotos para um repositório **público** no GitHub, com o push
3. Convida os colegas como colaboradores
:::

Um **colaborador** recebe a chave da casa, como quem mora junto: pode mandar código para o repositório de outra pessoa. Quem foi convidado não baixa o kit: faz um **`git clone`**, que baixa da nuvem o álbum inteiro, com todas as fotos.

---

## :icon[milestone] Projeto 7 · Passo 3: o kit no computador

Quem cuida do repositório faz; a equipe acompanha na tela dela.

:::steps
1. Baixe o [kit-app.zip](materiais/projeto-7/kit-app.zip), extraia na pasta dos projetos (botão direito, **Extrair tudo**) e renomeie `kit-app` para o nome do app, sem acento nem espaço: `gasto-certo`
2. No terminal, `code gasto-certo`; no do VS Code, `npm install` e `npx expo start`; o QR code no Expo Go
3. Na raiz, o `.gitignore` do E33, com as três linhas abaixo
4. Apague de `src/data/` os dois arquivos dos briefings que a equipe não escolheu
:::

```plaintext
node_modules/
.expo/
dist/
```

O `npm install` sugere `npm audit fix --force`: não rode, porque ele troca as versões do kit.

**Pronto quando:** o Expo Go mostra "Nome do app" e o aviso "Em construção".

---

## :icon[milestone] Projeto 7 · Passo 3: as abas

Como no E37, a Início e a Sobre viram abas:

:::steps
1. Crie a pasta `(abas)` dentro de `app`, com os parênteses, e arraste para dentro dela o `index.js` e o `sobre.js`
2. Crie o `app/(abas)/_layout.js` com o código abaixo
3. No `app/_layout.js`, troque `name="index"` por `name="(abas)"`
:::

```jsx
// As abas do app: a barra embaixo, como as abas de um fichário.
// Cada tela de aba é um arquivo desta pasta: index.js é a primeira.
import { Tabs } from 'expo-router/js-tabs';
import { iconeDaAba, opcoesDasAbas, useTema } from '@/theme';

export default function LayoutAbas() {
  const { cores } = useTema();
  return (
    <Tabs screenOptions={opcoesDasAbas(cores)}>
      <Tabs.Screen name="index" options={{ title: 'Início', tabBarIcon: iconeDaAba('home-outline') }} />
      <Tabs.Screen name="sobre" options={{ title: 'Sobre', tabBarIcon: iconeDaAba('information-circle-outline') }} />
    </Tabs>
  );
}
```

- Cada aba numa **linha só**: no E42, cada pessoa acrescenta a linha da sua, e as linhas não se misturam
- Agenda: `title: 'Serviços'` e `iconeDaAba('cut-outline')`. Cardápio: `title: 'Cardápio'` e `iconeDaAba('fast-food-outline')`

Pare o servidor com <kbd>Ctrl</kbd> + <kbd>C</kbd> e rode `npx expo start -c`.

**Pronto quando:** o celular mostra duas abas embaixo: Início (a casa) e Sobre (o "i").

---

## :icon[milestone] Projeto 7 · Passo 3: a equipe e o primeiro push

No `src/data/equipe.js`, troque os quatro valores pelos da equipe, uma linha por pessoa, com o usuário do GitHub sem o `@`:

```javascript
export const nomeDoApp = 'Gasto Certo';

export const frase = 'Lance um gasto em segundos, na fila do caixa';

export const briefing = 'Controle de gastos';

export const equipe = [
  { nome: 'Ana Souza', github: 'ana-souza' },
  { nome: 'Bruno Lima', github: 'bruno-lima' },
  { nome: 'Carla Dias', github: 'carla-dias' },
];
```

No GitHub, **New repository** com o nome da pasta, **Public**, sem README. Num segundo terminal do VS Code, os comandos do E33, com o seu usuário no lugar de `ana-souza`:

```bash
git init
git add .
git commit -m "Kit do app e as abas Início e Sobre"
git branch -M main
git remote add origin https://github.com/ana-souza/gasto-certo.git
git push -u origin main
```

O `git add .` mostra uma linha `LF will be replaced by CRLF` por arquivo: é aviso do Windows, não erro.

**Pronto quando:** a Sobre mostra a equipe, e o GitHub mostra o commit, com o `.gitignore` e sem `node_modules`.

---

## :icon[cloud-download] git clone: o álbum inteiro

O **`git clone`** baixa um repositório do GitHub para uma pasta nova, com o nome dele. É assim que cada colega tem o projeto:

```bash
git clone https://github.com/ana-souza/gasto-certo.git
cd gasto-certo
npm install
```

```plaintext
Cloning into 'gasto-certo'...
remote: Enumerating objects: 46, done.
remote: Total 46 (delta 1), reused 0 (delta 0), pack-reused 0 (from 0)
Receiving objects: 100% (46/46), 87.76 KiB | 5.16 MiB/s, done.
Resolving deltas: 100% (1/1), done.
```

| Vem no clone | Não vem |
|---|---|
| o código que entrou nos commits, o `.gitignore`, o `package-lock.json` e o histórico | o `node_modules/`, que o `.gitignore` deixou de fora: por isso o `npm install` |

- `Cloning into` é "copiando para a pasta"; os números mudam de repositório para repositório
- O clone já sabe o endereço do GitHub: não precisa de `git remote add`

---

## :icon[milestone] Projeto 7 · Passo 4: a equipe entra no repositório

**Quem cuida do repositório**, no GitHub: **Settings**, **Collaborators** (no grupo **Access**), **Add people**, o usuário do colega e **Add ... to this repository**. Um convite por pessoa.

**Cada colega:**

:::steps
1. No e-mail "invited you to collaborate", **View invitation** e **Accept invitation** (ou `github.com/ana-souza/gasto-certo/invitations`)
2. No repositório, botão verde **Code**, aba **HTTPS**: copie o endereço
3. Na pasta dos projetos, fora de outro projeto: `git clone` e o endereço, `cd gasto-certo` e `npm install`
4. `npx expo start` e o QR code no Expo Go
:::

**Pronto quando:** o app abre no celular de todas as pessoas da equipe, com as duas abas.

---

## Backlog

A festa tem pouco dinheiro: o que não pode faltar?

---

## :icon[list-ordered] Backlog: o que vem primeiro

O **backlog** é a lista de histórias da equipe, da mais importante para a menos. Cada história ganha um **rótulo**, como na festa com pouco dinheiro: o bolo precisa ter, os docinhos deveriam ter, o mágico só se sobrar dinheiro, e os fogos ficam de fora.

| Rótulo | Quer dizer | Entra |
|---|---|---|
| `precisa-ter` | sem isso, não há app | E42 e E43 |
| `deveria-ter` | importante, mas a apresentação vive sem | E43 e E44 |
| `poderia-ter` | só se sobrar tempo | E44, se der |
| sem issue | fica fora desta versão | no README |

É o **MoSCoW**: *must*, *should*, *could* e *won't*, em inglês. Se tudo é `precisa-ter`, nada é prioridade.

---

## :icon[tags] O backlog nas Issues

No GitHub, o backlog mora nas **Issues** do repositório: uma **issue** por história. Ela é a ordem de serviço da assistência técnica: uma folha por conserto, com número, o técnico responsável e a urgência.

| Na issue | O que vai |
|---|---|
| título | curto, com verbo: "Ver os horários livres do dia" |
| descrição | a história e o Pronto quando |
| **Assignees** | quem faz |
| **Labels** | o rótulo de prioridade |
| número | o GitHub dá sozinho: `#4` |

- Os rótulos, uma vez por equipe: **Issues**, **Labels**, **New label**, o nome, **Create label**
- Uma issue: **Issues**, **New issue**, título, descrição, **Assignees** e **Labels**, **Create**

---

## :icon[milestone] Projeto 7 · Sua vez da equipe: o backlog nas Issues

A equipe sozinha, cada pessoa no próprio computador:

1. Uma pessoa cria os rótulos `precisa-ter`, `deveria-ter` e `poderia-ter`
2. Cada pessoa escreve 2 ou 3 histórias da **sua tela**, uma issue cada: a história, o Pronto quando, você em **Assignees** e um rótulo
3. Quem cuida dos dados escreve a de guardar no celular, `precisa-ter`
4. A equipe lê o backlog junto: nem tudo é `precisa-ter`; anote o que sai

:::tip Dicas
- Histórias de partida: no [modelo de backlog](materiais/projeto-7/modelo-de-backlog.html), na aba do seu briefing
- Os números: no enunciado, em **Com os dados do kit**
:::

**Pronto quando:** de 8 a 12 issues, cada uma com rótulo e responsável; cada pessoa tem pelo menos 2.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Unmatched Route` | rotas guardadas de antes da mudança | `npx expo start -c` |
| `No route named "(abas)"` | pasta sem os parênteses | o mesmo `(abas)` na pasta e no layout |
| `LF will be replaced by CRLF` | aviso do Windows | nada: siga |
| `[rejected] main -> main (fetch first)` | repositório criado com README | apagar e criar vazio |
| `destination path ... already exists` | essa pasta já existe ali | clonar em outra pasta |
| `Cannot determine the project's Expo SDK version` | faltou o `npm install` | `npm install`, sem nome de pacote |

---

## :icon[milestone] Projeto 7 · Etapa 1 pronta

- :icon[globe] o repositório **público** da equipe mostra o kit, com o `.gitignore` e sem `node_modules/`
- :icon[git-commit-horizontal] na `main`, o commit `Kit do app e as abas Início e Sobre`
- :icon[smartphone] o app abre no celular de todas as pessoas, com a aba da tela 1 e a Sobre
- :icon[users] a Sobre mostra o nome do app, a frase, o briefing e a equipe
- :icon[list-checks] de 8 a 12 issues, cada uma com rótulo e responsável

Hoje não há outro commit: o backlog mora nas Issues, não no código. Faltou alguma issue? Termine em casa, antes do E42. Quem faltou pede o convite, faz o `git clone` e escreve as issues da sua tela.

---

## Resumo

:::summary
- O briefing é a encomenda do app: problema, público, telas, regras e dados
- Cada pessoa fica com uma tela, um componente seu e uma tarefa da equipe
- A história diz quem quer o quê, e para quê; o Pronto quando lista, com números, o que se confere no celular
- O backlog põe as histórias em ordem com os rótulos `precisa-ter`, `deveria-ter` e `poderia-ter`; o resto fica fora desta versão
- No GitHub, cada história é uma issue, com responsável e rótulo
- Um repositório por equipe: quem cuida dele convida os colegas, e cada colega faz `git clone` e `npm install`
:::

---

## :icon[arrow-right] Próximos passos

No E42, Git em equipe: cada pessoa começa a sua tela sem atropelar a dos colegas.

- :icon[git-branch] a **branch**, o rascunho paralelo
- :icon[git-merge] o **pull request**, o pedido para um colega revisar antes de juntar
- :icon[shield-check] a `main` protegida e o primeiro conflito, resolvido junto
