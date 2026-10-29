---
title: Automação e integração contínua
summary: Script verificar, variáveis de ambiente no Node e GitHub Actions rodando lint e testes a cada push.
module: ambiente-js
duration_minutes: 40
objectives:
  - Encadear lint e testes no script verificar e rodá-lo antes de cada push
  - Ler configurações com process.env e o arquivo .env sem expor segredos
  - Criar um workflow do GitHub Actions que roda npm ci e o verificar a cada push
  - Bloquear o merge quando o CI falha e exibir o selo no README
---

# Automação e integração contínua

Programador Mobile · Encontro E04 · Aula 8 de 89

---

## O que você vai aprender

:::goal
- Rodar o lint e os testes com um comando só: `npm run verificar`
- Guardar configurações fora do código, no `.env`, sem expor senhas
- Fazer o GitHub rodar o `verificar` sozinho, a cada push
- Mostrar o selo do projeto no README e impedir o merge quando algo quebra
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **código de saída** | o número que um programa deixa ao terminar: `0` quer dizer "deu certo" |
| **variável de ambiente** | uma configuração que vem do computador onde o código roda, e não do código |
| **segredo** | senha, token ou chave: nunca vai para o repositório |
| **integração contínua** (CI) | cada mudança conferida por uma máquina, sozinha, a cada envio |
| **workflow** (fluxo de trabalho) | o arquivo que diz ao GitHub o que conferir e quando |
| **selo** | a imagem no README que mostra se o projeto passou na conferência |

---

## Funciona na minha máquina

O `lojinha-regras` já tem testes. Na terça, a sua dupla muda o `abreviar` para cortar os nomes mais cedo. Ela roda o relatório, gosta do que vê no terminal e abre o PR. Mas não roda `npm test`. Você lê o código no GitHub, aprova e faz o merge.

Na quarta, você roda `npm test` na `main`: três testes do `abreviar` vermelhos. Os testes que pegariam o erro estavam lá, parados, esperando alguém lembrar de rodá-los.

Testes só protegem quando rodam **sempre**, sem depender da memória de ninguém.

:::question
Como fazer os testes rodarem sozinhos a cada push e impedirem o merge de um PR quebrado?
:::

---

## O script verificar

Antes de sair de casa, que conferências você faz sempre, na mesma ordem?

---

## :icon[terminal] O script verificar

Um script do npm é como um contato salvo com nome no celular: um apelido para um comando comprido (E02). O **`verificar`** é um apelido para dois comandos em fila: primeiro o lint, depois os testes.

```json
"scripts": {
  "lint": "eslint .",
  "test": "jest",
  "verificar": "eslint . && jest"
}
```

```bash
npm run verificar
```

- `eslint .` é o lint do E03 e `jest`, o corretor da aula 7. Dentro de um script, os dois rodam sem o `npx` do E03
- Hábito da turma: `npm run verificar` antes de cada `git push`

---

## :icon[check-check] O && e o código de saída

Todo programa, ao terminar, faz um sinal: o **código de saída**. É como um joinha: `0` quer dizer "deu certo"; qualquer outro número, "deu errado".

O **`&&`** usa esse sinal. Ele quer dizer "e depois, só se o primeiro deu certo":

| O lint termina com | O `jest` roda? | O `verificar` termina com |
|---|---|---|
| `0`, sem erros | sim | o resultado dos testes |
| `1`, com erros | não, nem começa | falha |

É pelo código de saída que o `&&`, e depois o GitHub, sabem se deu certo.

---

## :icon[terminal] O verificar na prática

Três situações antes de um `git push`:

**Caso 1: tudo certo.** O lint não acha nada, e o Jest roda os testes:

```plaintext
Tests:       12 passed, 12 total
```

Código de saída `0`: pode enviar.

**Caso 2: um erro de lint.** Ficou um `import path from 'node:path';` sem uso na primeira linha do `texto.js`:

```plaintext
  1:8  error  'path' is defined but never used  no-unused-vars
```

O `jest` nem começa. Código de saída `1`: corrija antes do push.

**Caso 3: um teste vermelho.** O lint passa, o Jest roda e mostra:

```plaintext
Tests:       1 failed, 11 passed, 12 total
```

Código de saída `1`: o `verificar` falha, mesmo com o lint limpo.

---

## :icon[settings] O lint precisa conhecer o Jest

O primeiro `npm run verificar` costuma parar no lint:

```plaintext
src/utils/texto.test.js
   3:1  error  'describe' is not defined  no-undef
   4:3  error  'test' is not defined      no-undef
  11:5  error  'expect' is not defined    no-undef
```

O ESLint, o corretor ortográfico do código, não sabe que, nos arquivos de teste, o Jest cria `describe`, `test`, `expect` e companhia. No `eslint.config.js` do E03, que já importa o `globals` para o Node, acrescente um objeto no fim da lista:

```javascript
  {
    files: ['**/*.test.js'],
    languageOptions: { globals: globals.jest },
  },
```

- `files: ['**/*.test.js']`: vale só para os arquivos terminados em `.test.js`, em qualquer pasta (`**/`). Num script comum, `describe` continua sendo erro
- `globals.jest` é a lista pronta dos nomes que o Jest cria, como o `globals.node` do E03

---

## Variáveis de ambiente

Por que o celular pede uma senha nova em cada casa que você visita?

---

## :icon[variable] Variáveis de ambiente

Alguns valores mudam conforme **onde** o código roda. Pense no Wi-Fi: o celular é o mesmo, mas o nome e a senha do Wi-Fi mudam de casa para casa.

No curso, o endereço da API, o lugar de onde o app busca os dados, será a DummyJSON nos estudos (E19) e o servidor da sua equipe no projeto integrador (E42). Esses valores ficam fora do código, em **variáveis de ambiente**, que o Node entrega no objeto **`process.env`**:

```javascript
// src/scripts/ambiente.js
console.log('API:', process.env.API_URL);
```

```bash
node src/scripts/ambiente.js
# API: undefined
```

- `process.env` traz todas as variáveis do terminal em que o comando rodou; o sistema já cria várias, como a pasta do seu usuário
- Uma variável que ninguém definiu chega como `undefined`, sem erro
- Leia sempre com ponto e o nome exato: `process.env.API_URL`

---

## :icon[file-text] O arquivo .env

Para não definir o valor à mão a cada comando, guarde-o num arquivo **`.env`** na raiz do `lojinha-regras`. É o papel na geladeira com a senha do Wi-Fi: fica na casa e não vai na mudança. O Node lê o arquivo com **`--env-file`**:

```bash
# .env
API_URL=https://dummyjson.com
```

```bash
node --env-file=.env src/scripts/ambiente.js
# API: https://dummyjson.com
```

- Uma variável por linha, no formato `NOME=valor`; `#` começa um comentário
- Num script: `"ambiente": "node --env-file=.env src/scripts/ambiente.js"`
- Sem o arquivo, o comando para com `.env: not found`
- O Jest não lê o `.env`: nenhum teste pode depender dele

---

## :icon[variable] Variáveis de ambiente na prática

O mesmo `ambiente.js`, sem mudar uma linha, em três situações:

**Caso 1: duas máquinas, dois `.env`.** Cada lugar tem o seu arquivo:

```bash
# no seu computador, o .env tem API_URL=https://dummyjson.com
node --env-file=.env src/scripts/ambiente.js
# API: https://dummyjson.com

# no computador do servidor da equipe (E42), API_URL=http://192.168.0.15:3000
node --env-file=.env src/scripts/ambiente.js
# API: http://192.168.0.15:3000
```

**Caso 2: esqueceu o `--env-file`.** `node src/scripts/ambiente.js` mostra `API: undefined`: o valor não chegou.

**Caso 3: com o script do npm.** `npm run ambiente` já traz o `--env-file`, e ninguém precisa lembrar dele.

---

## Segredos

Você postaria a senha do Wi-Fi da sua casa numa rede social?

---

## :icon[shield-alert] Segredo fora do repositório

Um **segredo** é uma senha, um token (uma senha longa que um site gera para você) ou uma chave. O `lojinha-regras` é **público** desde o E03: tudo o que entra no Git, qualquer pessoa lê.

| Pode ficar à vista | Segredo: só no `.env` da sua máquina |
|---|---|
| endereço público da API | senha de banco de dados |
| nome do ambiente: `teste`, `producao` | token pessoal do GitHub |
| quantos produtos por página | chave secreta do serviço de pagamento |

- O `.env` nunca vai para o Git: segredo commitado fica no histórico, mesmo apagado depois
- Commitou sem querer? `git rm --cached .env` tira o arquivo do Git; troque o segredo

---

## :icon[shield-alert] Segredos na prática

**Caso 1: o `.env` foi para o commit sem querer.**

```bash
git rm --cached .env    # rm '.env': sai do Git e continua no seu computador
```

Faça um commit, ponha o `.env` no `.gitignore` e troque o segredo: o antigo continua no histórico.

**Caso 2: um segredo no CI.** O GitHub Actions guarda segredos em **Settings > Secrets and variables > Actions**, nunca no YAML, que é público como o resto do repositório.

**Caso 3: um segredo no app.** Prévia do E30: no app, só variáveis `EXPO_PUBLIC_` chegam ao celular, copiadas para dentro dele. Nenhuma pode ser segredo.

---

## :icon[file-text] .env.example e .gitignore

O `.env` de cada pessoa tem os valores dela: no E42, cada computador terá um endereço diferente. Por isso ele fica **fora** do Git, e um modelo entra no lugar. O **`.env.example`** é o modelo do papel da geladeira: os nomes, sem as senhas.

```bash
# .env.example (vai para o Git)
API_URL=https://dummyjson.com
```

```bash
# .gitignore (acrescente no fim)
.env
coverage/
```

- Quem clona o repositório copia o modelo: `cp .env.example .env` (no Prompt de Comando do Windows, `copy`)
- Variável nova entra no `.env` **e** no `.env.example`, no mesmo commit
- Segredo aparece no modelo só com o nome, vazio: `PAGAMENTO_TOKEN=`
- A pasta `coverage/` é refeita a cada `--coverage`: também fica fora do Git

---

## Integração contínua

Numa fábrica, quem garante que cada peça saiu boa?

---

## :icon[workflow] Integração contínua com GitHub Actions

**Integração contínua** (CI, de *continuous integration*) é uma inspeção automática a cada entrega: toda mudança que vai para a `main` é conferida por uma máquina limpa, sem ninguém precisar lembrar.

No GitHub, o inspetor se chama **GitHub Actions**. Exemplo do que ele faz a cada push:

:::steps
1. Liga uma máquina nova, vazia
2. Baixa o seu repositório e instala os pacotes
3. Roda o `npm run verificar`
4. Marca o commit com um visto verde ou um X vermelho
:::

A máquina limpa não tem o seu `node_modules` nem o seu `.env`: se passa lá, passa para qualquer pessoa da turma.

---

## :icon[list-checks] As peças do GitHub Actions

| Peça | O que é | No lojinha-regras |
|---|---|---|
| Workflow (fluxo de trabalho) | arquivo YAML em `.github/workflows/` | `verificar.yml` |
| Evento | o que dispara o workflow | push e PR na `main` |
| Job (tarefa) | um conjunto de passos numa máquina | `verificar` |
| Runner | a máquina, nova a cada execução: uma bancada vazia a cada inspeção | Linux do GitHub |
| Step (passo) | um comando ou uma ação pronta | `npm ci`, `npm run verificar` |

---

## :icon[workflow] Do push ao visto verde

:::center
![Animação: o git push liga um runner Linux novo, que roda npm ci e, pelo verificar, eslint e jest; cada passo ganha um visto em sequência; com todos passando, o resultado é o visto verde; se algum falha, é o X vermelho](images/e04-pipeline-ci.svg)
:::

A cada push ou PR para a `main`, o runner instala as dependências com `npm ci` e roda o `verificar`: primeiro o lint, depois os testes. Tudo passou: visto verde no commit e no PR. Algo falhou: o passo fica vermelho, os seguintes não rodam e o resultado é o X.

---

## :icon[workflow] Integração contínua na prática

Três entregas do `lojinha-regras` e o que o inspetor mostra em cada uma:

| O que aconteceu | O que o CI mostra |
|---|---|
| A dupla mudou o `abreviar` e abriu o PR sem rodar os testes | X vermelho no passo **Lint e testes**, antes do merge |
| Você rodou o `verificar` e fez o push | visto verde no commit e no PR |
| Alguém instalou um pacote e deixou o `package-lock.json` fora do commit | X vermelho em **Instalar dependências** |

A mudança quebrada aparece no PR, antes do merge, sem depender da memória de ninguém.

---

## O workflow

Que instruções você deixaria para um inspetor que nunca viu o projeto?

---

## :icon[file-code] verificar.yml (1): quando e onde

O workflow é um arquivo **YAML**, um formato de texto para configurações: cada linha tem um nome, dois-pontos e um valor. Ele mora em `.github/workflows/`, com o ponto no começo. Em outra pasta, o GitHub não acha o arquivo e nada roda.

```yaml
# .github/workflows/verificar.yml
name: Verificar

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  verificar:
    runs-on: ubuntu-latest
    timeout-minutes: 10
```

YAML usa **espaços**, nunca tab: a indentação, o recuo da linha, é a estrutura do arquivo.

---

## :icon[list-ordered] verificar.yml (1) em português

| Linha | O que ela diz |
|---|---|
| `name: Verificar` | o nome que aparece na aba Actions |
| `on:` e `push: branches: [main]` | "rode a cada push na `main`..." |
| `pull_request: branches: [main]` | "...e a cada PR para ela, inclusive a cada novo push na branch do PR" |
| `jobs:` e `verificar:` | "a tarefa se chama `verificar`" |
| `runs-on: ubuntu-latest` | "numa máquina Linux nova", o runner mais usado e que gasta menos minutos |
| `timeout-minutes: 10` | "se travar, pare em 10 minutos, e não em horas" |

O que trava? Um `"test": "jest --watchAll"`, como em alguns tutoriais: ele espera mudanças nos arquivos e nunca termina. Nos scripts, fica só `jest`.

---

## :icon[file-code] verificar.yml (2): os passos

O mesmo arquivo continua, dentro do job `verificar`:

```yaml
    steps:
      - name: Baixar o código
        uses: actions/checkout@v7
      - name: Preparar o Node
        uses: actions/setup-node@v7
        with:
          node-version: lts/*
          cache: npm
      - name: Instalar dependências
        run: npm ci
      - name: Lint e testes
        run: npm run verificar
```

Cada `- name:` abre um passo, com o nome que aparece no GitHub. Os passos rodam em ordem, de cima para baixo, como uma receita.

---

## :icon[list-ordered] verificar.yml (2) em português

| Linha | O que ela diz |
|---|---|
| `steps:` | "os passos, em ordem" |
| `uses: actions/checkout@v7` | "use a ação pronta que baixa o repositório"; o `@v7` é a versão dela |
| `uses: actions/setup-node@v7` | "use a ação pronta que instala o Node" |
| `node-version: lts/*` | "a versão LTS mais nova do Node", a mesma linha que você instalou no E01 |
| `cache: npm` | "guarde os pacotes baixados para a próxima vez" |
| `run: npm ci` | "rode este comando, como no seu terminal" |
| `run: npm run verificar` | "rode o lint e os testes" |

Passo com código de saída diferente de `0` fica vermelho, e os seguintes não rodam.

---

## :icon[file-code] O workflow na prática

O `on:` e o `timeout-minutes` do `verificar.yml` decidem quando o inspetor trabalha e quanto tempo ele espera:

| O que você faz | O workflow roda? |
|---|---|
| `git push` na `main` | sim |
| abre um PR da `feature/testes-e-ci` para a `main` | sim |
| faz mais um push na branch desse PR | sim, de novo |
| faz push numa branch que não tem PR | não |
| deixa `"test": "jest --watchAll"` no `package.json` | roda e trava: para em 10 minutos, com X |

Quer que o inspetor confira uma branch? Abra o PR dela para a `main`.

---

## npm ci

Quando a compra do mercado chega, como você confere se veio tudo certo?

---

## :icon[package-check] npm ci: instalar pela nota fiscal

O **`npm ci`** (*clean install*, instalação limpa) é a instalação das máquinas limpas. Lembra da nota fiscal do E02, o `package-lock.json`? O `npm ci` instala exatamente o que está nela:

- Apaga o `node_modules`, se houver, e instala tudo do zero
- Instala as versões exatas do `package-lock.json`, inclusive as `devDependencies`, como o Jest
- Se a nota fiscal não bate com a lista de ingredientes, o `package.json`, ele **para** em vez de consertar

| `npm install` | `npm ci` |
|---|---|
| no seu computador, ao instalar ou mudar pacotes | no CI, numa máquina limpa |
| pode atualizar o lock | nunca muda o lock |

---

## :icon[package-check] npm ci na prática

**Caso 1: imitar a máquina limpa.** O CI falhou e você quer ver o mesmo erro no seu computador:

```bash
npm ci               # apaga o node_modules e instala pelo lock
npm run verificar    # o mesmo que o runner roda
```

Quase sempre é mais rápido que ler o log inteiro.

**Caso 2: revisar o PR da dupla.** No clone do repositório do colega (E03), o `npm ci` instala as mesmas versões que ele usou. Se der erro, é o mesmo erro dele.

**Caso 3: instalar um pacote novo.** Aí é o `npm install nome-do-pacote`: ele atualiza o lock, e o lock novo vai no mesmo commit do `package.json`.

---

## Pense

:::example Desafio
Ontem você instalou um pacote e fez o commit só do `package.json`. Hoje, na sua máquina, `npm run verificar` passa. No GitHub, o passo **Instalar dependências** fica vermelho:

```plaintext
npm error `npm ci` can only install packages when your package.json
and package-lock.json are in sync.
```

Por que só o CI falhou, e como corrigir?
:::

:::tip Resposta
Na sua máquina, o pacote já está no `node_modules` e o lock local foi atualizado. O runner começa do zero e só tem o que está no Git: um `package.json` com o pacote novo e um lock antigo, sem ele. O `npm install` consertaria o lock; o `npm ci` se recusa e para. Faça o commit do `package-lock.json` atualizado: os dois arquivos andam sempre juntos (E02).
:::

---

## Ler o resultado

Como você sabe que o pedido do delivery saiu, sem ligar para o restaurante?

---

## :icon[circle-check] Lendo o resultado no GitHub

Cada inspeção termina com um símbolo. Depois do `git push`, abra a aba **Actions** do repositório:

- Círculo amarelo: rodando. Visto verde: todos os passos passaram. X vermelho: algum passo falhou
- O mesmo símbolo aparece ao lado do commit e dentro do PR
- Clique no X, depois no job `verificar`, e abra o passo vermelho: o log, o registro do que aconteceu, é o mesmo que você veria no terminal
- Corrigiu? Novo commit e novo push: o workflow roda de novo sozinho

---

## :icon[circle-check] Ler o resultado na prática

Um X vermelho no PR. O caminho até a causa:

:::steps
1. No PR, clique em **Details**, ao lado do check `Verificar / verificar`
2. Abra o passo vermelho: aqui, **Lint e testes**
3. Leia o log como se fosse o seu terminal
:::

```plaintext
Expected: "Fone Bluetooth"
Received: "Fone Blueto..."

Tests:       1 failed, 11 passed, 12 total
```

Uma borda do `abreviar` quebrou: alguém trocou `<=` por `<`. Corrija, faça o commit e o push: o check roda de novo e fica verde.

---

## :icon[badge-check] Selo no README

O **selo** (*badge*) é como o selo de vistoria de um carro: mostra o estado da `main` a quem abre o repositório, seja colega, professor ou recrutador.

```markdown
# lojinha-regras

![Verificar](https://github.com/SEU-USUARIO/lojinha-regras/actions/workflows/verificar.yml/badge.svg)
```

- O endereço segue o padrão `github.com/<usuário>/<repositório>/actions/workflows/<arquivo>/badge.svg`
- O texto entre colchetes descreve a imagem para quem usa leitor de tela
- A aba Actions gera o código pronto: abra o workflow, clique em `...` e em **Create status badge**

Selo verde é sinal de projeto cuidado; no E44, ele vai para o portfólio.

---

## Proteger a main

No metrô, o que impede quem não pagou de passar?

---

## :icon[git-merge] CI vermelho bloqueia o merge

O selo informa; a **regra de proteção da branch** (*branch protection rule*) obriga. Ela é a catraca: só passa com o visto verde. Em **Settings > Branches**, crie a regra:

:::steps
1. Em *Branch name pattern*, escreva `main`
2. Marque **Require a pull request before merging**
3. Marque **Require status checks to pass before merging** e escolha o job `verificar`
4. Marque **Do not allow bypassing the above settings**, para valer também para quem é dono
5. Salve com **Create**
:::

Um PR com teste vermelho passa a mostrar "Merging is blocked". O check só aparece na busca depois que o workflow rodou uma vez. No `lojinha-regras`, a regra é opcional; no projeto em equipe (E41), ela nasce no primeiro dia.

---

## :icon[git-merge] A proteção na prática

Com a regra criada na `main`:

| Situação | O que o GitHub faz |
|---|---|
| PR com o check verde | o check deixa de travar o merge |
| PR com o check vermelho, como um `<` no lugar de `<=` | mostra "Merging is blocked" e trava o botão de merge |
| `git push` direto na `main`, mesmo de quem é dono | recusa o push |

O push direto na `main` volta com:

```plaintext
remote: error: GH006: Protected branch update failed for refs/heads/main.
remote: error: Changes must be made through a pull request.
```

Toda mudança passa pela catraca: branch, PR e visto verde.

---

## Mensagens de erro

O GitHub e o Node também acendem luzes no painel. Você sabe ler cada uma?

---

## :icon[siren] Quando aparece um erro

A mensagem de erro é a luz do painel do carro: diz o que aconteceu e onde.

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `'describe' is not defined` | o lint não conhece o Jest | o bloco do `globals.jest` |
| `.env: not found` | não há `.env` na pasta | `cp .env.example .env` |
| `API: undefined` | a variável não chegou | rodar com `--env-file=.env` |
| `Invalid workflow file` | erro no YAML, quase sempre um tab | trocar o tab por espaços |
| `npm ci` com `in sync` | lock e `package.json` diferentes | `npm install` e commit do lock |

---

## Resumo

:::summary
- `"verificar": "eslint . && jest"` roda tudo de uma vez e para no primeiro erro; o lint precisa do bloco com o `globals.jest`
- `process.env` traz as variáveis de ambiente; `node --env-file=.env` lê o `.env`, que fica fora do Git, com um `.env.example` como modelo
- O GitHub Actions roda `npm ci` e o `verificar` numa máquina limpa a cada push e a cada PR para a `main`
- O selo mostra o estado da `main`; a regra de proteção impede o merge com CI vermelho
:::

Próximo encontro: começa a Linguagem JavaScript, com variáveis, tipos e operadores nas regras de preço (E05).

---

## :icon[flask-conical] No laboratório

Testes nas primeiras funções e um CI de verdade no `lojinha-regras`.

:::steps
1. Jest e `babel.config.json`; `texto.js` com o `abreviar` e os testes dele (com `test.each`); teste das categorias
2. `boasVindas` pelo TDD da aula 7, com os três casos do Pense
3. Script `verificar` e bloco do Jest no `eslint.config.js`, sem erros
4. `.env` e `.env.example` com `API_URL`, lidos pelo `ambiente.js`; `.env` e `coverage/` no `.gitignore`
5. `.github/workflows/verificar.yml` e o selo no `README.md`
6. Commit "E04: testes e CI" numa branch e PR, como no E03: check verde, merge e visto verde na `main`
:::

**Critérios de entrega**: 12 testes ou mais passando; `verificar` sem erros; `.env` fora do Git e `.env.example` dentro; selo verde. Entregue o link do repositório no sistema.

---

## :icon[milestone] Projeto 1 · Etapa 3: o primeiro teste

No seu `racha-conta`:

- Jest e `babel.config.json`, como no laboratório
- **primeiro o teste**: `calcularGorjeta(100, 10)` espera `10`, e o `npm test` fica vermelho
- `calcularGorjeta(subtotal, percentual)` em `src/regras/conta.js`, por enquanto em reais
- mais casos com `test.each`, inclusive a gorjeta de 0%
- o bloco do `globals.jest` e o script `verificar`

Commit: `Projeto 1: etapa 3, primeiro teste`. Enunciado completo e entrega: página do curso, em **Projetos**.
