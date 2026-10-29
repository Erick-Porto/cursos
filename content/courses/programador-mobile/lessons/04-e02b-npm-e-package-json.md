---
title: npm e o package.json
summary: A ficha do projeto, comandos com nome, um pacote baixado da internet e o que levar para outro computador.
module: ambiente-js
duration_minutes: 40
objectives:
  - Criar o package.json com npm init e deixar o projeto pronto para usar import
  - Dar nome aos comandos do projeto com scripts e rodá-los com npm run
  - Instalar um pacote e saber o papel do node_modules e do package-lock.json
  - Recuperar um projeto copiado para outro computador com npm install
---

# npm e o package.json

Programador Mobile · Encontro E02 · Aula 4 de 89

---

## O que você vai aprender

:::goal
- Criar a ficha do projeto, o `package.json`
- Trocar comandos compridos por nomes curtos: `npm run relatorio`
- Baixar e usar um pacote, código pronto feito por outra pessoa
- Levar o projeto para outro computador sem perder nada
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **npm** | o programa que baixa pacotes; veio junto com o Node no E01 |
| **pacote** | código pronto, feito por outra pessoa, que você baixa e usa no seu projeto |
| **`package.json`** | a ficha do projeto: o nome, os comandos e os pacotes de que ele precisa |
| **script** (no npm) | um apelido para um comando comprido |
| **dependência** | um pacote de que o projeto precisa para funcionar |

---

## Funciona no meu computador

O relatório da aula 3 ganha cores nesta aula, com um pacote baixado da internet. Você copia a pasta para o computador do laboratório, roda o relatório e aparece:

```plaintext
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'picocolors'
```

O código é o mesmo. Faltou o pacote que o código usa, e o outro computador não tem como adivinhar qual era.

:::question
Pense numa receita de bolo. O que ela traz, além do modo de preparo, para qualquer pessoa conseguir repetir?
:::

A lista de ingredientes. O `package.json` é essa lista para o projeto.

---

## O package.json

Se o seu projeto tivesse uma ficha de cadastro, o que ela diria?

---

## :icon[package] package.json: a ficha do projeto

O **`package.json`** é a ficha do projeto, como a lista de ingredientes de uma receita: o nome, os comandos e os pacotes de que ele precisa. Para criar, rode na pasta raiz do `lojinha-regras`:

```bash
npm init -y
```

O npm cria o arquivo `package.json`. O `-y` aceita as respostas padrão sem perguntar nada:

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

Hoje, só três campos importam: o **nome**, os **`scripts`** e o **`type`**. O resto pode ficar como está.

---

## :icon[package] Lendo a ficha de um projeto

No fim desta aula, a ficha do `lojinha-regras` vai ter estes campos (os outros continuam lá):

```json
{
  "name": "lojinha-regras",
  "type": "module",
  "scripts": {
    "catalogo": "node src/scripts/gerar-catalogo.js",
    "relatorio": "node src/scripts/relatorio-catalogo.js"
  },
  "dependencies": {
    "picocolors": "^1.1.1"
  }
}
```

Só de ler, qualquer pessoa descobre:

- **como o projeto se chama**: `name`
- **quais comandos ele tem**: `scripts`
- **de que pacotes ele precisa**: `dependencies`

Em todo projeto JavaScript, o primeiro arquivo a abrir é o `package.json`.

---

## :icon[circle-alert] "type": "module"

Rode o relatório depois do `npm init`:

```plaintext
SyntaxError: Cannot use import statement outside a module
```

O seu código usa `import`. O `"type": "commonjs"` diz ao Node para ler os arquivos num modo antigo, que não entende `import`. A correção é trocar uma palavra no `package.json`:

```json
"type": "module"
```

Salve e rode de novo: funciona.

:::warning
Deixe **uma** linha `type` só. Se houver duas, vale a última. Em computadores com npm mais antigo, a linha não aparece: aí, acrescente.
:::

---

## Scripts do npm

Você decora o telefone dos amigos ou salva o contato com o nome?

---

## :icon[square-terminal] Scripts: apelidos para comandos

Um **script do npm** é um apelido para um comando comprido, como um contato salvo com nome no celular. Os apelidos ficam em `scripts`, no `package.json`: o apelido à esquerda, o comando à direita.

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "catalogo": "node src/scripts/gerar-catalogo.js",
  "relatorio": "node src/scripts/relatorio-catalogo.js"
},
```

Para rodar, escreva `npm run` e o apelido: `npm run relatorio` faz o mesmo que `node src/scripts/relatorio-catalogo.js`.

O `test` já vem pronto e só mostra um erro por enquanto. Ele ganha função no E04.

---

## :icon[square-terminal] Scripts na prática

Com os apelidos `catalogo` e `relatorio` no `package.json`:

```bash
npm run catalogo          # grava o catalogo.json
npm run relatorio         # relatório do catálogo inteiro
npm run relatorio audio   # o que vem depois do apelido vai para o script
npm run                   # lista os apelidos que existem
```

Nos próximos encontros, outros apelidos aparecem: `npm test` roda os testes (E04) e `npm run dev` abre o app React no navegador (E21). É o mesmo jeito de usar.

---

## :icon[circle-check] Por que o npm run é melhor

- **Funciona de qualquer pasta do projeto.** O npm sempre roda o comando a partir da pasta raiz. O `ENOENT` da pasta errada, da aula 3, some
- **Quem recebe o projeto descobre os comandos** só de olhar o `package.json`
- **Menos erro de digitação:** o caminho comprido fica escrito uma vez só

Lembre o `run`: `npm relatorio` sem ele dá `Unknown command`.

---

## :icon[triangle-alert] Cuidado com as vírgulas

O `package.json` é JSON, com as regras da aula 3. O erro mais comum é a vírgula:

```json
"scripts": {
  "catalogo": "node src/scripts/gerar-catalogo.js",
  "relatorio": "node src/scripts/relatorio-catalogo.js"
},
```

- Cada linha dentro das chaves termina com vírgula, **menos a última**
- Aspas duplas em tudo: nos nomes e nos comandos

Vírgula faltando ou sobrando faz todo `npm run` falhar com **`EJSONPARSE`**. A mensagem traz a linha e a coluna: vá direto nelas.

---

## Pratique

:::example Desafio
O `package.json` tem os scripts `catalogo` e `relatorio`. Qual comando:

1. Mostra o relatório só dos livros?
2. Grava o `catalogo.json` de novo?
3. Mostra quais apelidos existem?
:::

:::tip Resposta
1. `npm run relatorio livros`
2. `npm run catalogo`
3. `npm run`, sem nada depois
:::

---

## Pacotes

Para fazer um bolo, você planta o trigo ou compra a farinha pronta?

---

## :icon[download] Instalando um pacote

**Pacote** é código pronto. O **picocolors** pinta texto no terminal. Na pasta raiz:

```bash
npm install picocolors
# added 1 package, and audited 2 packages in 1s
# found 0 vulnerabilities
```

O comando faz três coisas:

| O que mudou | Onde |
|---|---|
| baixou o código do pacote | na pasta nova `node_modules/` |
| anotou o pacote na ficha | no `package.json`, em `"dependencies"` |
| anotou a versão exata | no arquivo novo `package-lock.json` |

O `found 0 vulnerabilities` quer dizer que não há falha de segurança conhecida nesse pacote.

---

## :icon[sparkles] Usando o pacote no relatório

No topo do `relatorio-catalogo.js`, acrescente a segunda linha de `import`. Depois, troque o primeiro e o último `console.log`:

```javascript
import fs from 'node:fs';
import pc from 'picocolors';

// ... a leitura, o filtro e as contas continuam iguais

console.log(pc.bold('Relatório do catálogo:'), titulo);
console.log(pc.yellow('Sem imagem:'), semImagem.length);
```

- Pacote se importa pelo **nome**, sem `./` e sem `.js`: o Node procura dentro do `node_modules`
- `pc.bold` deixa o texto em negrito, e `pc.yellow`, em amarelo

Rode `npm run relatorio`: o título sai em negrito.

---

## :icon[folder] node_modules: grande e descartável

A pasta **`node_modules/`** guarda o código dos pacotes baixados. Hoje tem um pacote só; no E04, chega a mais de 200.

- **Não vai junto** quando você leva o projeto: é grande e o npm baixa de novo
- **Apagou?** Rode `npm install`, sem nome de pacote: o npm lê a ficha e baixa tudo outra vez
- **Não mexa** em nada lá dentro: a próxima instalação desfaz a mudança

O erro `Cannot find package` quase sempre quer dizer: faltou rodar `npm install`.

---

## Versões dos pacotes

Por que a loja guarda a nota fiscal de cada compra?

---

## :icon[lock] package-lock.json: a nota fiscal

O `package.json` diz **quais** pacotes o projeto usa. O **`package-lock.json`** guarda a **versão exata** de cada um, como uma nota fiscal do que foi instalado.

- Com ele, todo computador instala as mesmas versões, e o projeto funciona igual em todos
- **Vai junto** com o projeto, sempre
- **Não edite à mão:** quem escreve nele é o npm

Não apague o lock para "resolver" um erro: as versões deixam de ser as mesmas para todo mundo.

---

## :icon[tag] O ^ antes da versão

No `package.json` aparece `"picocolors": "^1.1.1"`. A versão tem três números: **principal.novidade.correção**.

| Versão nova do pacote | O `^` aceita? | Por quê |
|---|---|---|
| `1.1.2` | sim | só corrige um defeito |
| `1.2.0` | sim | traz novidade, sem quebrar o que já existia |
| `2.0.0` | não | o primeiro número mudou: pode quebrar o seu código |

O `^` quer dizer: "pode atualizar, desde que o primeiro número continue o mesmo".

---

## Levar o projeto

Numa mudança de casa, o que vai no caminhão e o que se compra de novo?

---

## :icon[arrow-left-right] Levando o projeto para outro computador

| Arquivo ou pasta | Vai junto? |
|---|---|
| `src/` (o seu código) | sim |
| `package.json` | sim |
| `package-lock.json` | sim |
| `node_modules/` | não |

No outro computador, abra a pasta raiz e rode:

```bash
npm install
```

Pronto: o npm lê a ficha e a nota fiscal e baixa tudo. Era só isso que faltava no computador do laboratório, no começo da aula.

---

## Mensagens de erro

O npm também acende luzes no painel. Você sabe ler cada uma?

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Could not read package.json` | não há `package.json` nesta pasta | ir para a pasta raiz do projeto |
| `Cannot use import statement outside a module` | o `type` não é `module` | trocar para `"type": "module"` |
| `EJSONPARSE` | vírgula ou aspas erradas no `package.json` | ir na linha e coluna da mensagem |
| `Missing script` | o apelido não existe | `npm run` lista os que existem |
| `Unknown command` | faltou o `run` | `npm run relatorio` |
| `Cannot find package` | o pacote não foi baixado | `npm install` na pasta raiz |

---

## Resumo

:::summary
- `npm init -y` cria o `package.json`, a ficha do projeto
- `"type": "module"` deixa o projeto usar `import`
- Em `scripts`, cada apelido roda um comando: `npm run relatorio audio`, sempre a partir da raiz
- `npm install pacote` baixa para o `node_modules`, anota em `dependencies` e grava a versão exata no `package-lock.json`
- Para levar o projeto: tudo, menos o `node_modules`. No destino, `npm install`
- O `^` aceita correções e novidades, nunca um novo número principal
:::

Próximo encontro: o `lojinha-regras` vai para o GitHub.

---

## :icon[flask-conical] No laboratório

O `lojinha-regras` completo no seu computador. Siga a [página do laboratório](materiais/e02/aluno/laboratorio-lojinha-regras.html): ela traz cada passo, o código para copiar e as saídas esperadas.

:::steps
1. Pastas `src/data/` e `src/scripts/`; copie o `produtos.js` da página
2. Digite o gerador e rode: `node src/scripts/gerar-catalogo.js`
3. Digite o relatório e rode, com e sem categoria
4. `npm init -y`, `"type": "module"` e os scripts `catalogo` e `relatorio`
5. `npm install picocolors` e as duas cores no relatório
6. A linha "Acima de R$ 200"
7. Em casa: o teste do "Sem imagem" e o `node_modules` apagado e recuperado
:::

**Entrega:** o `package.json` e a saída de `npm run relatorio casa`: 3 produtos, 1 em destaque, 1 acima de R$ 200 e preço médio `R$ 209.90`.

---

## :icon[milestone] Projeto 1 · Etapa 1: a conta no terminal

O **Racha-conta** divide a conta do restaurante entre amigos sem perder nenhum centavo. Ele cresce uma etapa por encontro, até o E07, num repositório só seu.

Hoje, na pasta `racha-conta`, ao lado do `lojinha-regras`:

- `npm init -y`, com `"type": "module"`
- `src/data/conta.json`: restaurante, pessoas, gorjeta e pelo menos 4 itens
- `src/scripts/racha.js` lê o JSON e mostra o restaurante, as pessoas e os itens
- o script `racha`: `npm run racha`

Ainda sem Git: o commit desta etapa é o primeiro do E03. Enunciado completo e entrega: página do curso, em **Projetos**.
