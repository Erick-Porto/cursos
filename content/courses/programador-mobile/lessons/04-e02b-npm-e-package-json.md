---
title: npm e o package.json
summary: O package.json do lojinha-regras linha a linha, scripts, um pacote instalado, faixas de versão, lock e npx.
module: ambiente-js
duration_minutes: 40
objectives:
  - Criar o package.json com npm init e configurar o projeto como módulo ES
  - Dar nome aos comandos do projeto com scripts e rodá-los com npm run
  - Instalar um pacote e explicar o papel do node_modules e do package-lock.json
  - Interpretar as faixas de versão com ^ e ~ e executar ferramentas com npx
---

# npm e o package.json

Programador Mobile · Encontro E02 · Aula 4 de 89

---

## O que você vai aprender

:::goal
- Criar o `package.json` do `lojinha-regras` e ler cada linha dele
- Dar nome aos comandos com scripts: `npm run relatorio`
- Instalar um pacote e entender o `node_modules` e o `package-lock.json`
- Ler faixas de versão com `^` e `~`
- Rodar uma ferramenta sem instalar, com `npx`
:::

---

## Funciona no meu computador

O relatório está pronto e, nesta aula, ganha cores com um pacote baixado da internet. Você copia a pasta `lojinha-regras` para o computador do laboratório, sem a pasta do pacote, que é grande, e roda o relatório:

```plaintext
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'picocolors'
```

O código é o mesmo. Faltou o que o código usa, e o outro computador não tem como adivinhar: nem quais pacotes instalar, nem em qual versão, nem qual comando roda o relatório.

:::question
Onde um projeto anota do que ele precisa, para qualquer computador instalar tudo igual com um comando?
:::

---

## :icon[package] npm init: nasce o package.json

O **npm** é o gerenciador de pacotes que veio com o Node no E01. Na raiz do `lojinha-regras`:

```bash
npm init -y
```

```json
{
  "name": "lojinha-regras",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs"
}
```

O **`package.json`** é a ficha do projeto: o que ele é, quais comandos tem e de quais pacotes precisa. É JSON, com as regras da aula 3. O `-y` aceita todas as respostas padrão; sem ele, o npm pergunta campo por campo.

---

## :icon[file-code] O package.json linha a linha

| Campo | O que guarda |
|---|---|
| `name` e `version` | nome e versão do projeto; o nome vem da pasta |
| `description` | uma frase sobre o projeto: escreva "Regras de negócio da Lojinha" |
| `main` | o arquivo de entrada quando outro projeto importa este; o `lojinha-regras` não usa |
| `scripts` | comandos com nome; o `test` criado só mostra um erro até o E04 |
| `keywords`, `author` e `license` | dados para quem publica o pacote no npm |
| `type` | como o Node lê os arquivos `.js` do projeto |

O npm escreve o arquivo e você edita no VS Code. Os pacotes que você instalar vão aparecer numa seção nova, `dependencies`.

---

## :icon[circle-alert] "type": "module"

Rode o relatório logo depois do `npm init`:

```plaintext
SyntaxError: Cannot use import statement outside a module
```

Sem `package.json`, o Node percebia o `import` e lia o arquivo como **módulo ES**. Agora quem manda é o campo `type`: com `"commonjs"`, ele lê os `.js` no sistema antigo do Node, o **CommonJS**, que não conhece `import`. Em versões mais antigas do npm, a linha `type` não aparece; aí o script roda, mas com o aviso `MODULE_TYPELESS_PACKAGE_JSON`.

A correção é a mesma nos dois casos:

```json
"type": "module"
```

Com ela, todo `.js` do projeto usa `import` e `export`, como o app da Lojinha. Os dois sistemas de módulos voltam no E11.

---

## :icon[square-terminal] Scripts: comandos com nome

Em `scripts`, cada linha é um nome e o comando que ele roda:

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "catalogo": "node src/scripts/gerar-catalogo.js",
  "relatorio": "node src/scripts/relatorio-catalogo.js"
},
```

```bash
npm run catalogo          # grava o catalogo.json
npm run relatorio audio   # o que vem depois do nome vai para o script
npm run                   # lista os scripts do projeto
```

- O npm roda os scripts a partir da raiz do projeto, mesmo com o terminal numa subpasta: o `ENOENT` da aula 3 some
- `npm test` dispensa o `run`; no E04, o `test` passa a rodar o Jest
- Uma opção que começa com `--` precisa de um `--` antes: `npm test -- --watch`
- Quem recebe o projeto descobre os comandos lendo o `package.json`

---

## :icon[download] Instalando um pacote

**Pacote** é código pronto, publicado por alguém no npm. O **picocolors** pinta texto no terminal:

```bash
npm install picocolors
# added 1 package, and audited 2 packages in 1s
# found 0 vulnerabilities
```

| O que o comando fez | Onde |
|---|---|
| baixou o pacote | `node_modules/picocolors/` |
| anotou a faixa de versão | `"dependencies": { "picocolors": "^1.1.1" }`, no `package.json` |
| registrou a versão exata | `package-lock.json` |

Ferramentas que só quem programa usa, como o ESLint do E03 e o Jest do E04, entram com `npm install -D`, numa seção à parte: **`devDependencies`**.

---

## :icon[sparkles] Usando o pacote no relatório

No topo de `relatorio-catalogo.js`, importe o pacote; nas linhas do título e da imagem, use as cores:

```javascript
import fs from 'node:fs';
import pc from 'picocolors';

// ... a leitura, o filtro e as contas continuam iguais

console.log(pc.bold('Relatório do catálogo:'), titulo);
console.log(pc.yellow('Sem imagem:'), semImagem.length);
```

- Um pacote se importa pelo **nome**, sem `./` e sem extensão: o Node procura em `node_modules`
- `pc.bold` devolve o texto em negrito e `pc.yellow`, em amarelo
- `npm run relatorio`: o título sai em negrito e o "Sem imagem" em amarelo

---

## :icon[folder] node_modules: grande e descartável

O **`node_modules/`** guarda os pacotes baixados e os pacotes de que eles dependem. Hoje tem um só; no E04, o Jest e o Babel trazem mais de 200 pacotes e quase 7 mil arquivos.

- Apagou? `npm install` lê o `package.json` e o lock e baixa tudo de novo
- Para levar o projeto, leve o resto e rode `npm install` no destino; no E03, o `.gitignore` deixa a pasta fora do Git
- Não edite nada lá dentro: a próxima instalação desfaz a mudança
- `Cannot find package` quase sempre é `npm install` que faltou, ou terminal na pasta errada

Era o caso do computador do laboratório: a pasta chegou sem `node_modules`, e um `npm install` resolve.

---

## :icon[tag] Versão semântica: X.Y.Z

Quase todo pacote segue a **versão semântica** (semver): **MAJOR.MINOR.PATCH**, ou maior, menor e correção. Imagine uma biblioteca de datas na versão `2.4.1`:

| Lançamento | Nova versão | O que significa para o seu projeto |
|---|---|---|
| Correção | `2.4.2` | um bug corrigido; seu código não muda |
| Menor | `2.5.0` | recurso novo; o que existia continua igual |
| Maior | `3.0.0` | algo mudou de propósito e pode quebrar seu código |

Antes de subir uma versão maior, leia as notas de lançamento (o *changelog*). Semver é uma promessa do autor, não uma garantia: por isso a equipe trava as versões.

---

## :icon[sliders-horizontal] Faixas: ^ e ~

No `package.json`, o símbolo antes do número diz quais versões o npm pode instalar:

:::center
![Diagrama: numa reta de versões, a faixa ~2.4.1 vai até 2.4.9 e para antes de 2.5.0; a faixa ^2.4.1 vai até 2.9.3 e para antes de 3.0.0, a versão maior](images/e02-faixas-semver.svg)
:::

- **`"~2.4.1"`** aceita só correções (`2.4.9`); **`"^2.4.1"`** aceita também recursos novos (`2.9.3`); nenhum dos dois aceita `3.0.0`
- Sem símbolo, `"2.4.1"` aceita só a própria `2.4.1`
- O `npm install` grava `^` por padrão: o `"^1.1.1"` do picocolors aceita uma `1.2.0`, nunca uma `2.0.0`

---

## :icon[lock] package-lock.json: a versão exata

O `package.json` guarda a faixa que você pediu. O **`package-lock.json`** guarda a versão exata instalada de cada pacote e de cada dependência deles.

| Arquivo | Guarda | Vai junto com o projeto? |
|---|---|---|
| `package.json` | as faixas que você pediu | sim |
| `package-lock.json` | a versão exata de tudo | sim |
| `node_modules/` | os arquivos baixados | não |

- O lock anda sempre junto com o `package.json`: no E03, os dois entram em todo commit que muda pacotes
- Nunca edite o lock à mão: quem escreve nele é o npm
- `npm install` respeita o lock; `npm ci` apaga o `node_modules` e instala exatamente o lock, como a integração contínua faz no E04

---

## Pense

:::question
No `package.json` de um projeto, uma biblioteca de datas está como `"^2.4.1"`. O autor já publicou `2.4.3`, `2.6.0` e `3.0.0`.

1. Sem `package-lock.json`, que versão um `npm install` instala?
2. E se o lock que veio com o projeto registrou `2.4.1`?
3. E se a faixa fosse `"~2.4.1"`, sem lock?
:::

:::tip Resposta
1. `2.6.0`: a mais nova dentro do `^`, que para antes de `3.0.0`
2. `2.4.1`, em todos os computadores: o lock manda enquanto a versão dele couber na faixa
3. `2.4.3`: o `~` só aceita correções

Com o lock junto, o computador do laboratório recebe as mesmas versões que o seu.
:::

---

## :icon[zap] npx: executar sem instalar

O **`npx`** roda o comando de um pacote. Se o pacote está no `node_modules` do projeto, usa essa versão; se não está, baixa, roda e descarta, sem mexer no `package.json`.

```bash
npx prettier --check src
# Need to install the following packages: prettier  Ok to proceed? (y)
# [warn] Code style issues found in 4 files. Run Prettier with --write to fix.
```

O **Prettier** é um formatador de código. Ele reclamou de 4 arquivos porque ainda não conhece o estilo da equipe: prefere aspas duplas, por exemplo. No E03, ele entra no projeto com as regras combinadas.

| Comando | O que acontece |
|---|---|
| `npx prettier --check src` | baixa o Prettier só para esta vez |
| `npx eslint .` (E03) | usa o ESLint instalado no projeto |
| `npx jest` (E04) | usa o Jest instalado no projeto |

---

## :icon[search-check] Como escolher um pacote

Antes de instalar, responda:

1. **Precisa mesmo?** `toFixed`, `toLocaleString` e `console.table` já vêm com o JavaScript; não instale um pacote por uma função de cinco linhas
2. **O nome está certo?** Pacotes falsos imitam nomes conhecidos: confira letra por letra na página do npmjs.com
3. **Está vivo?** Última versão recente e issues respondidas no GitHub
4. **Quantos usam?** Downloads por semana são sinal, não prova
5. **O que ele traz junto?** O picocolors não depende de nenhum outro pacote
6. **A licença permite uso comercial?** MIT, ISC e Apache permitem

Depois de instalar, `npm audit` compara as versões com uma lista pública de falhas de segurança. A meta é `found 0 vulnerabilities`.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Rodar `npm` fora da raiz do projeto: `Could not read package.json`
- Deixar o `"type": "commonjs"` do `npm init`: `Cannot use import statement outside a module`
- Vírgula sobrando ao editar o `package.json`: `EJSONPARSE` e nenhum script roda
- `npm relatorio` sem o `run`: `Unknown command`; só `start` e `test` dispensam
- Copiar o projeto e não rodar `npm install`: `Cannot find package 'picocolors'`
- Apagar o `package-lock.json` para "resolver" um erro: as versões deixam de ser as mesmas para todos
:::

---

## Resumo

:::summary
- `npm init -y` cria o `package.json`, a ficha do projeto; `"type": "module"` libera `import` e `export` nos `.js`
- `scripts` dão nome aos comandos: `npm run relatorio audio`, sempre a partir da raiz
- `npm install` baixa para o `node_modules`, anota a faixa em `dependencies` e a versão exata no `package-lock.json`
- `~` aceita correções e `^` aceita também recursos novos; nenhum aceita versão maior
- `npx` roda uma ferramenta sem instalar no projeto
:::

Próximo encontro: o `lojinha-regras` vai para o GitHub, com Git, branch e Pull Request.

---

## :icon[flask-conical] No laboratório

O `lojinha-regras` completo no seu computador, seguindo a [página do laboratório](materiais/e02/aluno/laboratorio-lojinha-regras.html).

:::steps
1. Pastas `src/data/` e `src/scripts/`; o `ola.js` pode ser apagado
2. `src/data/produtos.js` copiado da página do laboratório
3. Gerador e relatório digitados e rodados da raiz
4. `npm init -y`, `"type": "module"` e os scripts `catalogo` e `relatorio`
5. `npm install picocolors` e as duas cores no relatório
6. Imagem da Bola esvaziada no JSON, `npm run relatorio esporte` e `npm run catalogo` para desfazer
7. Linha "Acima de R$ 200"; `node_modules` apagado e recuperado com `npm install`
:::

**Entrega:** o `package.json` e a saída de `npm run relatorio casa`: 3 produtos, 1 em destaque, 1 acima de R$ 200 e preço médio `R$ 209.90`.

---

## :icon[milestone] Projeto 1 · Etapa 1: a conta no terminal

O **Racha-conta** divide a conta do restaurante entre amigos sem perder nenhum centavo. Ele cresce uma etapa por encontro, até o E07, num repositório só seu.

Hoje, na pasta `racha-conta`:

- `npm init -y`, com `"type": "module"`
- `src/data/conta.json`: restaurante, pessoas, gorjeta e pelo menos 4 itens
- `src/scripts/racha.js` lê o JSON e mostra o restaurante, as pessoas e os itens
- o script `racha`: `npm run racha`

Ainda sem Git: o commit desta etapa é o primeiro do E03. Enunciado completo e entrega: página do curso, em **Projetos**.
