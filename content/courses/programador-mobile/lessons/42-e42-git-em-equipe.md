---
title: Git em equipe
summary: Cada pessoa faz a sua tela numa branch e a leva à main por um pull request revisado, com um conflito resolvido.
module: integracao
duration_minutes: 90
objectives:
  - Criar uma branch, trabalhar nela e voltar para a main sem misturar as versões
  - Levar a branch ao GitHub e pedir a revisão de um colega num pull request
  - Revisar o pull request de um colega e trazer a main atualizada com git pull
  - Resolver um conflito escolhendo o que fica e apagando as marcas
---

# Git em equipe

Programador Mobile · Encontro E42 · Aula 42 de 45

---

## O que você vai aprender

:::goal
- Fazer a sua tela num rascunho paralelo, a branch, sem estragar a versão boa da `main`
- Proteger a `main` com uma regra do GitHub
- Mandar a branch para o GitHub e trazer o que os colegas juntaram
- Pedir a revisão de um colega num pull request, revisar o de outro e juntar à `main`
- Resolver um conflito: duas mudanças na mesma linha
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **branch** | um rascunho paralelo do projeto, em que você mexe sem estragar a versão boa |
| **merge** | juntar uma branch a outra: o rascunho passado a limpo |
| **regra de proteção** | uma regra do GitHub que recusa o push direto na `main` |
| **pull request** | o pedido, no GitHub, para um colega revisar a sua branch antes do merge |
| **revisão** | a leitura que o colega faz do seu código antes de aprovar |
| **conflito** | duas mudanças na mesma linha: o Git para e espera alguém escolher |

---

## Três pessoas, um app

Desde o E41, cada pessoa tem o app no computador, com um commit só na `main`. Hoje, todos começam a sua tela. Se cada um fizer push direto na `main`, uma tela pela metade quebra o app de todos, e ninguém confere o código de ninguém.

| Hoje, no começo | No fim do encontro |
|---|---|
| a `main` aceita push de qualquer um | a `main` protegida: só entra o que um colega aprovou |
| a Início diz "Em construção" | a primeira versão de cada tela, com os dados de exemplo |
| ninguém revisou nada | cada tela revisada antes de entrar |

:::question
Duas pessoas mudaram a mesma linha do mesmo arquivo. Qual das duas versões fica?
:::

---

## Branch

Você escreve a redação direto na folha que vai ser entregue?

---

## :icon[git-branch] Branch: o rascunho paralelo

Uma **branch** (ramo, em inglês) é um rascunho paralelo do projeto: dá para testar sem estragar a versão boa. A versão boa é a **`main`**, a linha principal do histórico, do E05. Quando o rascunho fica bom, ele é passado a limpo na `main`: é o **merge** (juntar).

:::center
![Diagrama: da primeira foto da main saem duas branches ao mesmo tempo, esqueleto-lancamentos, do Bruno, e esqueleto-novo, da Carla; cada uma ganha um commit e volta para a main por um merge, o #1 e o #2](images/e42-branches-da-equipe.svg)
:::

- Bruno e Carla trabalham ao mesmo tempo, cada um no seu rascunho
- A branch nasce como cópia da `main` daquele momento, e os commits dela ficam nela
- A `main` só muda nos merges

---

## :icon[git-branch] Branch na prática

**Caso 1: criar o rascunho e ver onde você está.**

```bash
git switch -c esqueleto-lancamentos
git branch
```

```plaintext
Switched to a new branch 'esqueleto-lancamentos'
* esqueleto-lancamentos
  main
```

O **`git switch`** troca de branch; o **`-c`** (de *create*, criar) cria antes de trocar. O **`git branch`** lista as branches, e o `*` marca onde você está: o próximo commit entra ali.

**Caso 2: trocar de branch troca os arquivos.** Com o esqueleto num commit da branch, `git switch main` tira o `lancamentos.js` da pasta, e `git switch esqueleto-lancamentos` traz de volta. Faça o commit antes de trocar: o que não virou foto vai junto para a outra branch.

**Caso 3: o nome.** Minúsculas, sem acento e sem espaço, com hífen: `esqueleto-lancamentos`, nunca `Esqueleto Lançamentos`.

---

## A main protegida

Num prédio com porteiro, quem consegue entrar?

---

## :icon[shield-check] A main protegida: o porteiro

Uma **regra de proteção** faz o GitHub recusar o que a equipe combinou não fazer, como o porteiro do prédio: só entra quem foi anunciado. Na `main` protegida, só entra o que chega por um **pull request** aprovado, o pedido para um colega revisar a branch antes do merge.

:::center
![Diagrama: o push direto na main é recusado pela regra; o caminho aceito é branch, pull request, uma aprovação e o merge na main protegida](images/e41-main-protegida.svg)
:::

- A regra vale para todos, até para quem criou o repositório
- No plano gratuito, ela só funciona em repositório **público**, como o da equipe

---

## :icon[shield-check] A regra na prática

Com a regra ligada, o push direto na `main` volta assim:

```plaintext
remote: error: GH013: Repository rule violations found for refs/heads/main.
remote: - Changes must be made through a pull request.
 ! [remote rejected] main -> main (push declined due to repository rule violations)
```

*Changes must be made through a pull request*: as mudanças precisam passar por um pull request. Nada se perde: os commits continuam no seu computador.

| Tentativa | O que o GitHub faz |
|---|---|
| push direto na `main` | recusa, com `GH013` |
| merge de um pull request sem aprovação | trava o botão: **Review required** (revisão obrigatória) |
| o autor aprova o próprio pull request | não deixa: quem aprova é outra pessoa |
| merge de um pull request aprovado por um colega | libera |

---

## :icon[milestone] Projeto 7 · Passo 1: a regra da main

Quem cuida do repositório faz, no GitHub, e a equipe acompanha na tela dela. **Settings**, no menu da esquerda **Rules**, **Rulesets**, **New ruleset**, **New branch ruleset**:

:::steps
1. **Ruleset Name** (nome da regra): `main protegida`
2. **Enforcement status** (situação): **Active**, ligada
3. **Target branches** (as branches da regra): **Add target**, **Include default branch**, que é a `main`
4. **Restrict deletions** e **Block force pushes** já vêm marcadas: ninguém apaga a `main` nem escreve por cima dela
5. Marque **Require a pull request before merging** e, em **Required approvals**, escolha 1
6. **Create**
:::

**Pronto quando:** em **Rulesets**, aparece `main protegida`, com **Active**. Daqui em diante, ninguém faz push na `main`.

---

## Push e pull

Um colega pôs fotos novas no álbum da nuvem. Como elas chegam ao seu computador?

---

## :icon[cloud-download] Push e pull: ida e volta da nuvem

O **push** manda a sua cópia para a nuvem, como no E05. O **pull** (puxar) faz a volta: traz a cópia da nuvem e junta à sua. Em equipe, você manda a sua branch e traz o que os colegas juntaram.

```bash
git push -u origin esqueleto-lancamentos
git switch main
git pull
```

| Linha | O que ela diz |
|---|---|
| `git push -u origin esqueleto-lancamentos` | "mande esta branch para o `origin`, o GitHub, e grave o destino" |
| `git switch main` | "volte para a `main`" |
| `git pull` | "traga da nuvem o que mudou na `main` e junte aqui" |

O `-u` é o do E05: depois do primeiro push, a branch vai só com `git push`.

---

## :icon[cloud-download] Push e pull na prática

**Caso 1: o "up to date" não pergunta à nuvem.** O Bruno juntou a aba Lançamentos à `main` há um minuto. No computador da Carla, `git switch main` e `git pull`:

```plaintext
Switched to branch 'main'
Your branch is up to date with 'origin/main'.
From https://github.com/ana-souza/gasto-certo
   a4bb39b..93417ac  main       -> origin/main
Updating a4bb39b..93417ac
Fast-forward
 app/(abas)/_layout.js     |  1 +
 app/(abas)/lancamentos.js | 14 ++++++++++++++
 2 files changed, 15 insertions(+)
 create mode 100644 app/(abas)/lancamentos.js
```

O *up to date* compara com o que o computador já sabia da nuvem; quem pergunta de novo é o `git pull`. **Fast-forward** (avanço rápido): a `main` dela andou até a foto da nuvem.

**Caso 2: nada novo.** O `git pull` responde `Already up to date.`

**Caso 3: a branch nova sem o `-u`.** O push responde `has no upstream branch`: a branch ainda não tem destino (*upstream*) na nuvem. Rode `git push -u origin` e o nome dela.

---

## :icon[milestone] Projeto 7 · Passo 2: a branch e o esqueleto

Cada pessoa, no clone do E41, com o terminal na pasta do app. Troque `lancamentos` pelo nome da sua tela, sem acento:

```bash
git switch main
git pull
git switch -c esqueleto-lancamentos
```

O **esqueleto** é o arquivo da sua tela, com o nome que o enunciado dá, só com a `Tela` e um aviso. A Lançamentos, em `app/(abas)/lancamentos.js`:

```jsx
// Tela Lançamentos: todos os lançamentos, do mais novo para o mais velho (a rota "/lancamentos").
import { EstadoVazio, Tela } from '@/components/ui';

export default function Lancamentos() {
  return (
    <Tela>
      <EstadoVazio
        icone="construct-outline"
        titulo="Em construção"
        mensagem="A lista de lançamentos entra aqui."
      />
    </Tela>
  );
}
```

A primeira aba, o `index.js`, já existe: quem ficou com ela faz só o botão da tela de origem.

---

## :icon[milestone] Projeto 7 · Passo 2: a linha da aba

A sua tela é uma aba? No `app/(abas)/_layout.js`, a linha dela, **numa linha só**, entre a `index` e a `sobre`:

```jsx
      <Tabs.Screen name="index" options={{ title: 'Início', tabBarIcon: iconeDaAba('home-outline') }} />
      <Tabs.Screen name="lancamentos" options={{ title: 'Lançamentos', tabBarIcon: iconeDaAba('list-outline') }} />
      <Tabs.Screen name="sobre" options={{ title: 'Sobre', tabBarIcon: iconeDaAba('information-circle-outline') }} />
```

| Tela | `name` | `title` | O ícone |
|---|---|---|---|
| Agendados | `agendamentos` | `'Agendados'` | `'calendar-outline'` |
| Horários | `horarios` | `'Horários'` | `'time-outline'` |
| Carrinho | `carrinho` | `'Carrinho'` | `'cart-outline'` |
| Lançamentos | `lancamentos` | `'Lançamentos'` | `'list-outline'` |
| Categorias | `categorias` | `'Categorias'` | `'pie-chart-outline'` |

O `name` é o nome do arquivo, sem o `.js`. Na equipe de 4, duas abas novas no mesmo lugar dão conflito: o segundo pull request de aba espera o Passo 4.

---

## :icon[milestone] Projeto 7 · Passo 2: a tela da pilha

A sua tela é da pilha? O título vai dentro dela, com o `Stack.Title` do E37. Em `app/novo.js`:

```jsx
import { Stack } from 'expo-router';
import { EstadoVazio, Tela } from '@/components/ui';

export default function Novo() {
  return (
    <Tela comCabecalho>
      <Stack.Title>Novo lançamento</Stack.Title>
      <EstadoVazio icone="construct-outline" titulo="Em construção" mensagem="O formulário entra aqui." />
    </Tela>
  );
}
```

O mesmo molde vale para `app/agendar/[id].js` ("Agendar"), `app/produto/[id].js` ("Produto") e `app/finalizar.js` ("Finalizar pedido").

A tela de origem ganha, embaixo do aviso, o botão que abre a do colega: `Botao` no import do kit e `import { router } from 'expo-router';`.

| Tela de origem | O botão do esqueleto |
|---|---|
| Início | `<Botao titulo="Novo lançamento" icone="add" onPress={() => router.push('/novo')} />` |
| Serviços | `<Botao titulo="Agendar (teste)" onPress={() => router.push('/agendar/1')} />` |
| Cardápio | `<Botao titulo="Produto (teste)" onPress={() => router.push('/produto/1')} />` |
| Carrinho (equipe de 4) | `<Botao titulo="Fechar pedido" onPress={() => router.push('/finalizar')} />` |

---

## :icon[milestone] Projeto 7 · Passo 2: commit e push da branch

Com `npx expo start`, confira no celular que o app abre sem erro. Depois:

```bash
git status
git add .
git commit -m "Esqueleto da tela Lançamentos"
git push -u origin esqueleto-lancamentos
```

O `git status` começa com `On branch esqueleto-lancamentos`: confira que não é a `main`. O push termina assim:

```plaintext
remote: Create a pull request for 'esqueleto-lancamentos' on GitHub by visiting:
remote:      https://github.com/ana-souza/gasto-certo/pull/new/esqueleto-lancamentos
To https://github.com/ana-souza/gasto-certo.git
 * [new branch]      esqueleto-lancamentos -> esqueleto-lancamentos
branch 'esqueleto-lancamentos' set up to track 'origin/esqueleto-lancamentos'.
```

**Pronto quando:** no celular, aparece a sua aba ou o seu botão (a tela da pilha aparece quando o botão do colega chega à `main`), e o push mostra `[new branch]`.

---

## Pull request

Antes de entregar um trabalho em grupo, por que pedir para um colega ler?

---

## :icon[git-merge] Pull request: pedir a revisão antes de juntar

Um **pull request** (pedido para puxar) é pedir para um colega revisar a sua branch antes do merge na `main`. No GitHub, ele mostra o que a branch muda, linha por linha. Depois do push, **Compare & pull request** abre o pedido:

- `base: main` é o destino; `compare:`, a sua branch
- **Título** com verbo
- **Descrição**: o que muda e como testar. `#3` vira link para a issue 3; **`Closes #3`** fecha a issue no merge, se o pull request cumpre o Pronto quando dela
- **Reviewers** (revisores): o colega

Aprovado, **Merge pull request** faz o merge, num commit `Merge pull request #1`. **Delete branch** apaga a branch no GitHub; no computador, `git branch -d` e o nome.

---

## :icon[search-check] A revisão: a segunda leitura

A **revisão de código** é a segunda leitura antes de entregar: quem não escreveu vê o que o autor deixou passar. No pull request, a aba **Files changed** (arquivos alterados) mostra cada mudança: linha nova em verde, com `+`; linha que saiu em vermelho, com `-`. O `+` azul ao lado de uma linha abre um comentário.

No fim, **Review changes** (revisar), uma das três opções e **Submit review** (enviar):

| Opção | Quer dizer | Quando usar |
|---|---|---|
| **Comment** | comentar | dúvida ou sugestão que não impede o merge |
| **Approve** | aprovar | rodou no celular e cumpre o Pronto quando |
| **Request changes** | pedir mudanças | algo quebra ou foge do combinado |

---

## :icon[search-check] A revisão na prática

**Caso 1: rodar a branch do colega.** Na tela de verdade, só ler o código não mostra tudo:

```bash
git fetch
git switch tela-lancamentos
npx expo start -c
```

```plaintext
branch 'tela-lancamentos' set up to track 'origin/tela-lancamentos'.
Switched to a new branch 'tela-lancamentos'
```

O **`git fetch`** (buscar) pergunta à nuvem que branches existem, sem juntar nada. O `switch` traz a branch do colega para o seu computador. Terminou? `git switch main`.

**Caso 2: comente o código, não a pessoa.**

| Assim não | Assim sim |
|---|---|
| "tá errado" | "Com o valor 0, a mensagem não aparece embaixo do campo" |
| "que nome feio" | "`l` guarda o quê? `lancamento` diz na hora" |

**Caso 3: o colega pediu um ajuste.** Um commit novo na mesma branch e `git push`: o pull request se atualiza sozinho.

---

## :icon[milestone] Projeto 7 · Passo 3: o pull request e a revisão

Cada pessoa pede a revisão do seu esqueleto e revisa o de um colega: A revisa B, B revisa C, C revisa A.

:::steps
1. No GitHub, **Compare & pull request**
2. Título: "Esqueleto da tela Lançamentos"; na descrição, o que muda, como testar e `#3`, sem `Closes`: o esqueleto não cumpre a história
3. **Reviewers**: o colega da vez; **Create pull request**
4. O colega: **Files changed**, **Review changes**, **Approve**, **Submit review**
5. O autor: **Merge pull request**, **Confirm merge**, **Delete branch**
6. Todos: `git switch main` e `git pull`
:::

**Pronto quando:** o app da `main` abre com os esqueletos, cada um aprovado por outra pessoa.

---

## Conflito

Dois colegas corrigem a mesma frase do trabalho, cada um de um jeito. Qual fica?

---

## :icon[swords] Conflito: duas correções na mesma linha

Um **conflito** acontece quando duas branches mudam a mesma linha do mesmo arquivo, ou linhas vizinhas. São duas correções na mesma linha do caderno: na hora de passar a limpo, alguém escolhe. O Git não escolhe: ele para o merge, marca as duas versões e espera.

No GitHub, o pull request avisa: *This branch has conflicts that must be resolved* (esta branch tem conflitos para resolver). Para resolver no seu computador, traga a `main` para a sua branch:

```bash
git switch main
git pull
git switch frase-bruno
git merge main --no-edit
```

```plaintext
Auto-merging src/data/equipe.js
CONFLICT (content): Merge conflict in src/data/equipe.js
Automatic merge failed; fix conflicts and then commit the result.
```

O **`git merge main`** junta a `main` à branch em que você está. O **`--no-edit`** aceita a mensagem pronta do merge, sem abrir um editor. *Automatic merge failed*: o merge automático falhou; resolva e faça o commit.

---

## :icon[swords] As marcas em português

O `src/data/equipe.js` fica assim:

```javascript
export const nomeDoApp = 'Gasto Certo';

<<<<<<< HEAD
export const frase = 'Seu dinheiro na palma da mão';
=======
export const frase = 'Saiba para onde vai o seu dinheiro';
>>>>>>> main
```

| Parte | O que ela diz |
|---|---|
| `<<<<<<< HEAD` | "daqui até o `=======`, a versão da sua branch" (o `HEAD` é o "você está aqui" do E05) |
| `=======` | "a divisa entre as duas" |
| `>>>>>>> main` | "até aqui, a versão que veio da `main`" |

Em cima do bloco, o VS Code oferece: **Accept Current Change** (fica a sua), **Accept Incoming Change** (fica a que chegou), **Accept Both Changes** (ficam as duas) e **Compare Changes** (comparar lado a lado). Com as marcas, o arquivo não é JavaScript, e o app não abre.

---

## :icon[combine] Conflito na prática

**Caso 1: duas abas novas no mesmo lugar.** As duas linhas devem ficar: **Accept Both Changes**. É por isso que cada aba fica numa linha só.

```jsx
<<<<<<< HEAD
      <Tabs.Screen name="categorias" options={{ title: 'Categorias', tabBarIcon: iconeDaAba('pie-chart-outline') }} />
=======
      <Tabs.Screen name="lancamentos" options={{ title: 'Lançamentos', tabBarIcon: iconeDaAba('list-outline') }} />
>>>>>>> main
```

**Caso 2: duas frases.** Só uma pode ficar. Com as duas, o app para com `Identifier 'frase' has already been declared` (o nome `frase` já existe). A equipe conversa e escolhe **Current** ou **Incoming**, ou escreve uma frase nova no lugar.

**Caso 3: arquivos diferentes.** Bruno mexe no `lancamentos.js`, Carla no `novo.js`: o merge junta sozinho, sem conflito. É a reforma da casa do E41: o eletricista não mexe no encanamento, e cada pessoa mexe na sua tela.

---

## :icon[milestone] Projeto 7 · Passo 4: o conflito provocado

Duas pessoas mudam a mesma linha; a terceira revisa.

:::steps
1. Cada uma, da `main` atualizada: `git switch -c frase-` e o seu nome (`frase-ana`, `frase-bruno`)
2. Cada uma troca a `frase` do `src/data/equipe.js` por outra; commit, push com `-u` e pull request
3. O primeiro é revisado e juntado. Todos: `git switch main` e `git pull`
4. O segundo avisa do conflito. Quem fez: `git switch frase-bruno` e `git merge main --no-edit`
5. No VS Code, a equipe escolhe a frase, sem marcas; depois, os comandos abaixo
6. Revisão e merge do segundo. Todos: `git switch main` e `git pull`
:::

```bash
git add .
git commit -m "Junta a main e escolhe a frase"
git push
```

**Pronto quando:** o segundo pull request entra sem conflito, e a Início da `main` mostra a frase escolhida.

---

## :icon[milestone] Projeto 7 · Sua vez: a primeira versão da sua tela

Sozinho, numa branch `tela-` e o nome da sua tela:

- o seu componente em `src/components/`, com o comentário das props
- a tela com as peças do kit e os dados de exemplo
- na tela de origem, o toque no cartão no lugar do botão de teste
- pull request com `Closes #` e a issue, revisão e merge

:::tip Dicas
- Os dados numa `const` com o nome final: `const lancamentos = lancamentosDeExemplo;`
- Lista com `FlatList` e `ListEmptyComponent`; formulário com o `validar()` do E38
- Cor só do `useTema()`; na aba, o título com `accessibilityRole="header"`
:::

**Pronto quando:** a tela mostra os números do enunciado, e a `main` abre com todas as telas.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `GH013` | commit direto na `main` | `git switch -c` e um nome; push e pull request |
| `has no upstream branch` | primeiro push sem o `-u` | `git push -u origin` e a branch |
| `CONFLICT (content)` | a mesma linha mudou nas duas | escolher, `git add .`, commit e push |
| `Committing is not possible` | faltou o `git add` | `git add .` e o commit |
| `Unexpected token` no `<<<<<<<` | sobrou marca de conflito | apagar as três marcas |
| `'frase' has already been declared` | **Accept Both** na frase | apagar uma das duas |

---

## :icon[milestone] Projeto 7 · Etapa 2 pronta

Confira no GitHub e no celular:

- :icon[shield-check] a regra `main protegida` ativa
- :icon[git-merge] em **Pull requests**, **Closed**: o esqueleto e a primeira versão de cada pessoa, aprovados por outra pessoa
- :icon[search-check] cada pessoa revisou o pull request de um colega
- :icon[swords] o conflito da frase resolvido: uma `frase` só, sem marcas
- :icon[smartphone] na `main`, o app abre com todas as telas, com os dados de exemplo

Ninguém faz commit na `main`: tudo entra por pull request. Na `main` atualizada, o `git log --oneline` mostra um `Merge pull request #` para cada um.

A sua tela não terminou? Termine em casa, na branch `tela-`, e peça a revisão: o E43 começa com todas as telas na `main`.

---

## Resumo

:::summary
- A branch é o rascunho paralelo: `git switch -c nome` cria e entra, `git branch` mostra onde você está, `git switch main` volta
- A `main` protegida só aceita o que chega por pull request aprovado por outra pessoa; o push direto volta com `GH013`
- `git push -u origin nome` leva a branch ao GitHub; `git pull` traz o que os colegas juntaram à `main`
- O pull request pede a revisão; quem revisa roda o código e aprova; o merge junta à `main`, e todos dão `git pull`
- Conflito: `git merge main --no-edit`, escolher no VS Code, sem marcas, `git add .`, commit e push
- Cada pessoa na sua tela: arquivos diferentes juntam sozinhos
:::

---

## :icon[arrow-right] Próximos passos

No E43, os dados do app passam a ficar no celular:

- :icon[pin] o quadro de avisos da equipe: uma lista que todas as telas leem e mudam
- :icon[archive] a gaveta do celular: o que a pessoa lança continua lá depois de fechar o app
- :icon[git-branch] cada mudança, de novo, numa branch e num pull request revisado
