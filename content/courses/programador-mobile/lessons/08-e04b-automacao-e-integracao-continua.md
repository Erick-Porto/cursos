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
- Criar o script `verificar`, que roda o lint e os testes em sequência
- Ler configurações com `process.env` e o `.env`, com um `.env.example` como modelo
- Escrever um workflow do GitHub Actions que roda `npm ci` e o `verificar` a cada push
- Exibir o selo do CI no README e impedir o merge quando ele está vermelho
:::

---

## Funciona na minha máquina

O `lojinha-regras` já tem testes. Na terça, a sua dupla muda o `abreviar` para cortar os nomes mais cedo, roda o relatório, gosta do que vê no terminal e abre o PR. Ela não rodou `npm test`. Você lê o código no GitHub, aprova e faz o merge.

Na quarta, você roda `npm test` na `main`: três testes do `abreviar` vermelhos. Os testes que pegariam o erro estavam lá, parados, esperando alguém lembrar de rodá-los.

Testes só protegem quando rodam **sempre**, sem depender da memória de ninguém.

:::question
Como fazer os testes rodarem sozinhos a cada push e impedirem o merge de um PR quebrado?
:::

---

## :icon[terminal] O script verificar

Um comando para tudo o que precisa passar antes do push:

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

- **`&&`** só roda o segundo comando se o primeiro terminar bem. Lint com erro: os testes nem começam e o `verificar` falha
- Todo programa termina com um **código de saída**: `0` é sucesso, qualquer outro número é falha. É assim que o `&&`, e depois o GitHub, sabem se deu certo
- `eslint .` é o lint do E03 e `jest`, o teste da aula 7: dentro de um script, os dois rodam sem `npx` (E02)

Hábito da turma: `npm run verificar` antes de cada `git push`.

---

## :icon[settings] O lint precisa conhecer o Jest

O primeiro `npm run verificar` costuma parar no lint:

```plaintext
src/utils/texto.test.js
   3:1  error  'describe' is not defined  no-undef
   4:3  error  'test' is not defined      no-undef
  11:5  error  'expect' is not defined    no-undef
```

O ESLint não sabe que, nos arquivos de teste, o Jest cria `describe`, `test`, `expect` e companhia. No `eslint.config.js` do E03, que já importa o `globals` para o Node, acrescente um objeto no fim da lista:

```javascript
  {
    files: ['**/*.test.js'],
    languageOptions: { globals: globals.jest },
  },
```

- `globals.jest` é a lista pronta dos nomes que o Jest cria, como o `globals.node` do E03
- O bloco vale só para `*.test.js`: num script comum, `describe` continua sendo erro

---

## :icon[variable] Variáveis de ambiente

Alguns valores mudam conforme **onde** o código roda: o endereço da API será a DummyJSON nos estudos (E19) e o servidor da sua equipe no projeto integrador (E42). Esses valores ficam fora do código, em **variáveis de ambiente**, que o Node entrega no objeto **`process.env`**:

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

Para não definir o valor à mão a cada comando, guarde-o num arquivo **`.env`** na raiz do `lojinha-regras` e peça ao Node para lê-lo com **`--env-file`**:

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

## :icon[shield-alert] Segredo fora do repositório

O `lojinha-regras` é **público** desde o E03: tudo o que entra no Git, qualquer pessoa lê.

| Pode ficar à vista | Segredo: só no `.env` da sua máquina |
|---|---|
| endereço público da API | senha de banco de dados |
| nome do ambiente: `teste`, `producao` | token pessoal do GitHub |
| quantos produtos por página | chave secreta do serviço de pagamento |

- O `.env` nunca vai para o Git: segredo commitado fica no histórico, mesmo apagado depois
- No GitHub Actions, segredo fica em **Settings > Secrets and variables > Actions**, nunca no YAML
- Prévia do E30: no app, só variáveis `EXPO_PUBLIC_` chegam ao celular, copiadas para dentro dele; nenhuma pode ser segredo

---

## :icon[file-text] .env.example e .gitignore

O `.env` de cada pessoa tem os valores dela: no E42, cada computador terá um endereço diferente. Por isso ele fica **fora** do Git, e um modelo entra no lugar:

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

## :icon[workflow] Integração contínua com GitHub Actions

**Integração contínua** (CI) é juntar código na `main` com frequência, cada mudança conferida por uma máquina limpa. No GitHub, isso é o **GitHub Actions**:

| Peça | O que é | No lojinha-regras |
|---|---|---|
| Workflow | arquivo YAML em `.github/workflows/` | `verificar.yml` |
| Evento | o que dispara o workflow | push e PR na `main` |
| Job | um conjunto de passos numa máquina | `verificar` |
| Runner | a máquina, nova a cada execução | Linux do GitHub |
| Step | um comando ou uma ação pronta | `npm ci`, `npm run verificar` |

A máquina limpa não tem o seu `node_modules` nem o seu `.env`: se passa lá, passa para qualquer pessoa da turma.

---

## :icon[workflow] Do push ao visto verde

:::center
![Animação: o git push liga um runner Linux novo, que roda npm ci e, pelo verificar, eslint e jest; cada passo ganha um visto em sequência; com todos passando, o resultado é o visto verde; se algum falha, é o X vermelho](images/e04-pipeline-ci.svg)
:::

A cada push ou PR para a `main`, o runner instala as dependências com `npm ci` e roda o `verificar`: primeiro o lint, depois os testes. Tudo passou: visto verde no commit e no PR. Algo falhou: o passo fica vermelho, os seguintes não rodam e o resultado é o X.

---

## :icon[file-code] verificar.yml (1): quando e onde

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

- **`on`**: roda a cada push na `main` e a cada PR para ela, inclusive a cada novo push na branch do PR
- **`runs-on`**: a máquina; o Linux é o runner mais usado e o que gasta menos minutos
- **`timeout-minutes`**: se algo travar, o job para em 10 minutos, e não em horas
- YAML usa **espaços**, nunca tab: a indentação é a estrutura do arquivo

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

- **`uses`** chama uma ação pronta: baixar o repositório, instalar o Node com cache do npm
- **`lts/*`** é a versão LTS mais nova do Node, a mesma linha que você instalou no E01
- **`run`** executa um comando, como no seu terminal
- **`npm ci`** é a instalação das máquinas limpas: apaga o `node_modules`, instala exatamente as versões do `package-lock.json` e, se ele não bate com o `package.json`, falha em vez de consertar
- Passo com código de saída diferente de `0` fica vermelho, e os seguintes não rodam

---

## Pense

:::question
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

## :icon[circle-check] Lendo o resultado no GitHub

Depois do `git push`, abra a aba **Actions** do repositório:

- Círculo amarelo: rodando. Visto verde: todos os passos passaram. X vermelho: algum passo falhou
- O mesmo símbolo aparece ao lado do commit e dentro do PR
- Clique no X, depois no job `verificar`, e abra o passo vermelho: o log é o mesmo que você veria no terminal
- Corrigiu? Novo commit e novo push: o workflow roda de novo sozinho

:::tip
Para reproduzir uma falha do CI, imite a máquina limpa: `npm ci` e depois `npm run verificar`. Quase sempre é mais rápido que ler o log inteiro.
:::

---

## :icon[badge-check] Selo no README

O selo mostra o estado da `main` a quem abre o repositório: colega, professor ou recrutador.

```markdown
# lojinha-regras

![Verificar](https://github.com/SEU-USUARIO/lojinha-regras/actions/workflows/verificar.yml/badge.svg)
```

- O endereço segue o padrão `github.com/<usuário>/<repositório>/actions/workflows/<arquivo>/badge.svg`
- O texto entre colchetes descreve a imagem para quem usa leitor de tela
- A aba Actions gera o código pronto: abra o workflow, clique em `...` e em **Create status badge**

Selo verde é sinal de projeto cuidado; no E44, ele vai para o portfólio.

---

## :icon[git-merge] CI vermelho bloqueia o merge

O selo informa; a **regra de proteção da branch** obriga. Em **Settings > Branches**, crie uma regra (*branch protection rule*):

:::steps
1. Em *Branch name pattern*, escreva `main`
2. Marque **Require a pull request before merging**
3. Marque **Require status checks to pass before merging** e escolha o job `verificar`
4. Marque **Do not allow bypassing the above settings**, para valer também para quem é dono
5. Salve com **Create**
:::

Um PR com teste vermelho passa a mostrar "Merging is blocked". O check só aparece na busca depois que o workflow rodou uma vez. No `lojinha-regras`, a regra é opcional; no projeto em equipe (E41), ela nasce no primeiro dia.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Workflow fora de `.github/workflows/`, ou pasta `github` sem o ponto: o GitHub não acha o arquivo e nada roda
- Tab na indentação do YAML: o workflow nem começa e a aba Actions mostra "Invalid workflow file"
- `"test": "jest --watchAll"`, como em alguns tutoriais: no CI, o passo fica esperando mudanças até o tempo limite
- `package-lock.json` fora do commit: o `npm ci` falha
- `.env` commitado antes de entrar no `.gitignore`: tire do Git com `git rm --cached .env` e troque qualquer segredo que estava nele
- Teste que depende do `.env`: no CI ele não existe
:::

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
