---
title: Automação e integração contínua
summary: Script verificar, variáveis EXPO_PUBLIC_ no .env e GitHub Actions rodando lint e testes a cada push.
module: ambiente-js
duration_minutes: 40
objectives:
  - Encadear lint e testes no script verificar e rodá-lo antes de cada push
  - Configurar o app com .env e EXPO_PUBLIC_ sem expor segredos
  - Criar um workflow do GitHub Actions que roda npm ci, lint e testes
  - Bloquear o merge quando o CI falha e exibir o selo no README
---

# Automação e integração contínua

Programador Mobile: Módulo Específico · Encontro E24 · Aula 30 de 71

---

## O que você vai aprender

:::goal
- Criar o script `verificar`, que roda o lint e os testes em sequência
- Guardar a configuração do app em `.env`, com `EXPO_PUBLIC_` e um `.env.example`
- Escrever um workflow do GitHub Actions que roda `npm ci`, lint e testes a cada push
- Exibir o selo do CI no README e impedir o merge quando ele está vermelho
:::

---

## Funciona na minha máquina

A Lojinha já tem 20 testes. Na terça, o Bruno ajusta o `aplicarFiltros`, abre o app, vê a lista certa no Início e abre o PR. Ele não rodou `npm test`. Você revisa o código pelo celular, aprova e faz o merge.

Na quarta, a ordenação por preço está quebrada na `main`. Os testes que pegariam o erro estavam lá, parados, esperando alguém lembrar de rodá-los.

Testes só protegem quando rodam **sempre**, sem depender da memória de ninguém.

:::question
Como fazer os testes rodarem sozinhos a cada push e impedirem o merge de um PR quebrado?
:::

---

## :icon[terminal] O script verificar

Um comando para tudo o que precisa passar antes do push:

```json
"scripts": {
  "test": "jest",
  "verificar": "npx expo lint && npm test"
}
```

```bash
npm run verificar
```

- **`&&`** só roda o segundo comando se o primeiro terminar bem. Lint com erro: os testes nem começam e o `verificar` falha
- Todo programa termina com um **código de saída**: `0` é sucesso, qualquer outro número é falha. É assim que o `&&`, e depois o GitHub, sabem se deu certo
- Dentro de um script o `npx` é dispensável (E22); ele fica para o comando ser igual ao que você digita no terminal

Hábito da equipe: `npm run verificar` antes de cada `git push`.

---

## :icon[settings] O lint precisa conhecer o Jest

O primeiro `npm run verificar` costuma parar no lint:

```plaintext
src/utils/validar.test.js
  3:1  error  'describe' is not defined  no-undef
  4:3  error  'test' is not defined      no-undef
```

O ESLint do Expo não sabe que, nos arquivos de teste, o Jest cria `describe`, `test`, `expect` e `jest`. Avise no `eslint.config.js` criado no E23, acrescentando um bloco:

```javascript
module.exports = defineConfig([
  expoConfig,
  { ignores: ['dist/*'] },
  {
    files: ['**/*.test.js'],
    languageOptions: {
      globals: { describe: 'readonly', test: 'readonly', expect: 'readonly', jest: 'readonly' },
    },
  },
]);
```

O bloco vale só para `*.test.js`: numa tela, `describe` continua sendo erro.

---

## :icon[variable] Variáveis de ambiente

Alguns valores mudam conforme **onde** o app roda: o endereço da API será a DummyJSON nos estudos (E38) e o `json-server` da sua equipe no projeto integrador (E42). Esses valores ficam fora do código, num arquivo **`.env`** na raiz do projeto:

```bash
# .env
EXPO_PUBLIC_API_URL=https://dummyjson.com
```

```javascript
const urlDaApi = process.env.EXPO_PUBLIC_API_URL;
```

- O Expo CLI lê o `.env` ao iniciar e só entrega ao app as variáveis com o prefixo **`EXPO_PUBLIC_`**
- Leia sempre com ponto e o nome inteiro: com colchetes ou desestruturando o `process.env`, o valor chega `undefined`
- Mudou o `.env`? Reinicie o `npx expo start`

---

## :icon[shield-alert] EXPO_PUBLIC_ não é segredo

O valor de uma variável `EXPO_PUBLIC_` é **copiado para dentro do app** quando o pacote é montado. Quem baixar o APK consegue lê-lo.

| Pode ir em `EXPO_PUBLIC_` | Nunca vai para o app |
|---|---|
| endereço da API | chave secreta do gateway de pagamento |
| nome do ambiente: `teste`, `producao` | senha do banco de dados |
| chave pública, feita para ficar no app | token de administrador |

Segredo fica no **servidor**: o app pede ao seu backend, que guarda a chave e conversa com o serviço de pagamento. Deixar o `.env` fora do Git protege o repositório, não o app instalado.

---

## :icon[file-text] .env.example e .gitignore

O `.env` de cada pessoa tem os valores dela: no E42, cada computador terá um IP diferente para o `json-server`. Por isso ele fica **fora** do Git, e um modelo entra no lugar:

```bash
# .env.example (vai para o Git)
EXPO_PUBLIC_API_URL=https://dummyjson.com
```

```bash
# .gitignore (acrescente no fim)
.env
coverage/
```

- Quem clona a Lojinha copia o modelo: `cp .env.example .env` (no Prompt de Comando do Windows, `copy`)
- Variável nova entra no `.env` **e** no `.env.example`, no mesmo commit
- A pasta `coverage/` é refeita a cada `--coverage`: também fica fora do Git

---

## :icon[workflow] Integração contínua com GitHub Actions

**Integração contínua** (CI) é juntar código na `main` com frequência, cada mudança conferida por uma máquina limpa. No GitHub, isso é o **GitHub Actions**:

| Peça | O que é | Na Lojinha |
|---|---|---|
| Workflow | arquivo YAML em `.github/workflows/` | `verificar.yml` |
| Evento | o que dispara o workflow | push e PR na `main` |
| Job | um conjunto de passos numa máquina | `verificar` |
| Runner | a máquina, nova a cada execução | Linux do GitHub |
| Step | um comando ou uma ação pronta | `npm ci`, lint, testes |

A máquina limpa não tem o seu `node_modules` nem o seu `.env`: se passa lá, passa para qualquer pessoa da equipe.

---

## :icon[workflow] Do push ao visto verde

:::center
![Animação: o git push liga um runner Linux novo, que roda npm ci, npx expo lint e npm test, e cada passo ganha um visto em sequência; com todos passando, o resultado é o visto verde; se algum falha, é o X vermelho](images/e24-pipeline-ci.svg)
:::

A cada push ou PR para a `main`, o runner roda os passos em ordem: `npm ci`, `npx expo lint` e `npm test`. Todos passaram: visto verde no commit e no PR. Um passo falhou: ele fica vermelho, os seguintes não rodam e o resultado é o X.

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
      - name: Lint
        run: npx expo lint
      - name: Testes
        run: npm test
```

- **`uses`** chama uma ação pronta: baixar o repositório, instalar o Node com cache do npm
- **`run`** executa um comando, como no seu terminal
- **`npm ci`** instala exatamente o `package-lock.json` e falha se ele não bate com o `package.json`
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
Na sua máquina, o pacote já está no `node_modules` e o lock local foi atualizado. O runner começa do zero e só tem o que está no Git: um `package.json` com o pacote novo e um lock antigo, sem ele. Faça o commit do `package-lock.json` atualizado. Os dois arquivos andam sempre juntos (E22).
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
# Lojinha

![Verificar](https://github.com/SEU-USUARIO/lojinha/actions/workflows/verificar.yml/badge.svg)
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

Um PR com teste vermelho passa a mostrar "Merging is blocked". O check só aparece na busca depois que o workflow rodou uma vez. Na Lojinha, a regra é opcional: com ela, toda mudança entra por PR. No projeto em equipe (E41), ela nasce no primeiro dia.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Workflow fora de `.github/workflows/`, ou pasta `github` sem o ponto: o GitHub não acha o arquivo e nada roda
- Tab na indentação do YAML: o workflow nem começa e a aba Actions mostra "Invalid workflow file"
- `"test": "jest --watchAll"`, como em alguns tutoriais: no CI, o passo fica esperando mudanças até o tempo limite
- `package-lock.json` fora do commit: o `npm ci` falha
- `.env` commitado antes de entrar no `.gitignore`: tire do Git com `git rm --cached .env`
- Chave secreta em `EXPO_PUBLIC_`: ela vai para dentro do app instalado
:::

---

## Resumo

:::summary
- `"verificar": "npx expo lint && npm test"` roda tudo de uma vez e para no primeiro erro; o lint precisa do bloco com os globais do Jest
- O `.env` guarda a configuração com `EXPO_PUBLIC_`, fica fora do Git e tem um `.env.example` como modelo; nada de segredo nele
- O GitHub Actions roda `npm ci`, lint e testes numa máquina limpa a cada push e a cada PR para a `main`
- O selo mostra o estado da `main`; a regra de proteção impede o merge com CI vermelho
:::

---

## :icon[flask-conical] No laboratório

Testes nos utilitários e um CI de verdade na Lojinha.

:::steps
1. Testes de `formatarPreco`, `validarEmail`, `mascararTelefone` (com o +55) e `aplicarFiltros`: no mínimo 12, todos verdes
2. Script `verificar` e bloco do Jest no `eslint.config.js`; `npm run verificar` sem erros
3. `.env` e `.env.example` com `EXPO_PUBLIC_API_URL`; `.env` e `coverage/` no `.gitignore`
4. `.github/workflows/verificar.yml` com `npm ci`, lint e testes
5. Selo do workflow no topo do `README.md`
6. Commit "E24: testes e CI" numa branch e PR para a `main`, como desde o E22: check verde no PR, merge e visto verde na `main`
:::

**Critérios de entrega**: 12 testes ou mais passando; `verificar` sem erros; `.env` fora do Git e `.env.example` dentro; selo verde no README. Entregue o link do repositório no sistema.
