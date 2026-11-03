---
title: npm e o Racha-conta
summary: "Começa o Projeto 1: a conta do restaurante no terminal, com a ficha do projeto, um comando curto e um pacote."
module: ambiente-js
duration_minutes: 90
objectives:
  - Ler a conta de um arquivo JSON e somar os itens com reduce
  - Criar o package.json com npm init e deixar o projeto pronto para usar import
  - Dar nome aos comandos do projeto com scripts e rodá-los com npm run
  - Instalar um pacote e saber o que levar quando o projeto muda de computador
---

# npm e o Racha-conta

Programador Mobile · Encontro E04 · Aula 4 de 45

---

## O que você vai aprender

:::goal
- Começar o Projeto 1, o Racha-conta
- Ler a conta do restaurante de um arquivo e somar os itens
- Criar a ficha do projeto, o `package.json`
- Trocar um comando comprido por um nome curto: `npm run racha`
- Baixar e usar um pacote, código pronto feito por outra pessoa
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

## A conta chegou

Fim do jantar: R$ 187,50 para quatro amigos, mais 10% de gorjeta, dá R$ 206,25. Alguém abre a calculadora e diz: "dá 51,5625 para cada um".

Ninguém paga 51,5625. Se todo mundo arredonda para 51,56, falta 1 centavo. Se arredonda para 51,57, sobra.

:::question
Como vocês dividiriam essa conta para fechar certinho, sem faltar nem sobrar centavo?
:::

---

## :icon[milestone] Projeto 1: o Racha-conta

O **Racha-conta** é o primeiro projeto avaliado do curso. Ele lê a conta do restaurante, calcula a gorjeta e divide o total em partes que sempre fecham: o centavo que sobra vai para a primeira pessoa.

| Encontro | O Racha-conta ganha |
|---|---|
| E04, hoje | a conta no terminal |
| E05 | um lugar no GitHub |
| E06 a E08 | a gorjeta em centavos, as primeiras funções e os testes |
| E09 a E11 | o valor digitado, os avisos e a divisão |
| E12 | o recibo e uma página web |

Cada etapa é feita em aula, num projeto só seu. Enunciado, rubrica e entrega: página do curso, em **Projetos**.

---

## A conta em JSON

Como você anotaria a conta do restaurante para outro programa conseguir ler?

---

## :icon[braces] A conta como ficha

A conta é uma **ficha** (um objeto, da aula 3): cada campo tem nome e valor. Os itens são uma **lista** de fichas, uma para cada linha da comanda. Em **JSON**, com aspas duplas em tudo:

```json
{
  "restaurante": "Cantina Bella Nonna",
  "pessoas": 4,
  "gorjeta": 10,
  "itens": [
    { "descricao": "Pizza grande marguerita", "quantidade": 1, "preco": 72.9 },
    { "descricao": "Pizza grande calabresa", "quantidade": 1, "preco": 68.9 },
    { "descricao": "Refrigerante 2 litros", "quantidade": 2, "preco": 14.5 },
    { "descricao": "Petit gâteau", "quantidade": 1, "preco": 16.7 }
  ]
}
```

- `gorjeta` é o percentual: 10 quer dizer 10%
- O preço é em reais, com **ponto**: `72.9`, nunca `72,9`

---

## :icon[braces] A conta na prática

Depois do `JSON.parse`, a conta vira um objeto, e cada pedaço tem um caminho:

| O que você quer saber | O caminho | O valor |
|---|---|---|
| o nome do restaurante | `conta.restaurante` | `'Cantina Bella Nonna'` |
| quantas pessoas | `conta.pessoas` | `4` |
| quantos itens | `conta.itens.length` | `4` |
| o primeiro item | `conta.itens[0].descricao` | `'Pizza grande marguerita'` |
| o preço do refrigerante | `conta.itens[2].preco` | `14.5` |

O ponto entra num campo da ficha. O `[2]` abre uma gaveta da fileira, e a fileira começa no 0: o refrigerante é a terceira linha.

---

## :icon[milestone] Projeto 1 · Passo 1: a pasta e a conta

O Racha-conta mora numa pasta própria, **ao lado** do `lojinha-regras`, nunca dentro dele.

:::steps
1. No terminal do VS Code, saia do `lojinha-regras`: `cd ..`
2. `mkdir racha-conta`, depois `cd racha-conta` e `code .`
3. No painel do VS Code, crie a pasta `src` e, dentro dela, `data` e `scripts`
4. Em `src/data`, crie o `conta.json` e digite a conta da Cantina Bella Nonna
:::

**Pronto quando:** o terminal termina em `racha-conta`, e o painel mostra `src/data/conta.json`.

---

## :icon[file-text] Ler a conta: o caminho da aula 3

Para ler um arquivo JSON, são as mesmas duas linhas do relatório da aula 3:

```javascript
import fs from 'node:fs';

const texto = fs.readFileSync('src/data/conta.json', 'utf-8');
const conta = JSON.parse(texto);
```

- `fs.readFileSync` lê o arquivo e devolve o **texto** de dentro dele
- `JSON.parse` transforma o texto num **objeto**, com os campos que o código acessa com ponto
- O caminho parte da pasta **em que o terminal está**: rode sempre da pasta raiz, a `racha-conta`

---

## :icon[milestone] Projeto 1 · Passo 2: a conta no terminal

Crie `src/scripts/racha.js`:

```javascript
import fs from 'node:fs';

const texto = fs.readFileSync('src/data/conta.json', 'utf-8');
const conta = JSON.parse(texto);

console.log('Racha-conta:', conta.restaurante);
console.log('Pessoas na mesa:', conta.pessoas);
console.log('Itens na conta:', conta.itens.length);
console.table(conta.itens);
```

Rode da pasta raiz: `node src/scripts/racha.js`

**Pronto quando:** aparecem o restaurante, `Pessoas na mesa: 4`, `Itens na conta: 4` e uma tabela com os quatro itens.

---

## :icon[list-ordered] O racha.js em português

| Linha | O que ela diz |
|---|---|
| `import fs from 'node:fs';` | "traga o `fs`, a parte do Node que mexe em arquivos" |
| `readFileSync` e `JSON.parse` | "leia o `conta.json` e transforme o texto em objeto" |
| `console.log('Racha-conta:', conta.restaurante);` | "mostre o texto e, ao lado, o nome do restaurante" |
| `conta.itens.length` | "quantos itens a lista tem" |
| `console.table(conta.itens);` | "mostre a lista como **tabela**: uma linha por item, uma coluna por campo" |

O **`console.table`** é um `console.log` que desenha tabela. A coluna `(index)` traz o número da gaveta de cada item, a partir do 0.

---

## Somar a conta

Na comanda, o refrigerante aparece com quantidade 2. Como ele entra na soma?

---

## :icon[calculator] O subtotal com reduce

O **`reduce`** é a calculadora que acumula, da aula 3: o visor começa no 0, e cada item soma a sua parte ao que já estava lá. Na conta, a parte de cada item é o **preço vezes a quantidade**:

```javascript
const subtotal = conta.itens.reduce((total, item) => total + item.preco * item.quantidade, 0);
```

| Parte | O que quer dizer |
|---|---|
| `0`, no fim | o visor no começo, antes do primeiro item |
| `total` | a soma até aqui |
| `item` | o item da vez |
| `item.preco * item.quantidade` | quanto o item custa: 2 refrigerantes de 14.5 dão 29 |

Como na matemática, a multiplicação (`*`) vem antes da soma.

---

## :icon[calculator] O subtotal, volta por volta

| Volta | `total` antes | `item` | A conta | `total` depois |
|---|---|---|---|---|
| 1 | 0 | Pizza marguerita | `0 + 72.9 * 1` | 72.9 |
| 2 | 72.9 | Pizza calabresa | `72.9 + 68.9 * 1` | 141.8 |
| 3 | 141.8 | Refrigerante | `141.8 + 14.5 * 2` | 170.8 |
| 4 | 170.8 | Petit gâteau | `170.8 + 16.7 * 1` | 187.5 |

- O `total` depois de uma volta é o `total` antes da próxima
- Acabaram os itens: o `reduce` entrega o último total, e `subtotal` vale 187.5

---

## :icon[milestone] Projeto 1 · Passo 3: o subtotal

No `racha.js`, logo abaixo do `JSON.parse`, a linha do `reduce`. No fim do arquivo, a linha que mostra o subtotal:

```javascript
const subtotal = conta.itens.reduce((total, item) => total + item.preco * item.quantidade, 0);

// ... os console.log continuam iguais

console.log('Subtotal: R$', subtotal.toFixed(2));
```

O **`toFixed(2)`** mostra o número com 2 casas depois do ponto: `187.5` aparece como `187.50`.

**Pronto quando:** a última linha é `Subtotal: R$ 187.50`.

---

## O package.json

Se o seu projeto tivesse uma ficha de cadastro, o que ela diria?

---

## :icon[package] package.json: a ficha do projeto

O **`package.json`** é a ficha do projeto, como a lista de ingredientes de uma receita: o nome, os comandos e os pacotes de que ele precisa. Para criar, na pasta raiz:

```bash
npm init -y
```

O `-y` aceita as respostas padrão sem perguntar nada. O npm grava:

```json
{
  "name": "racha-conta",
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

Hoje, quatro campos importam: `name`, `description`, `scripts` e `type`. O resto fica como está.

---

## :icon[circle-alert] "type": "module"

Rode o script depois do `npm init`:

```plaintext
SyntaxError: Cannot use import statement outside a module
```

O seu código usa `import`. O `"type": "commonjs"` manda o Node ler os arquivos num modo antigo, que não entende `import`. A correção é trocar uma palavra no `package.json`:

```json
"type": "module"
```

Salve e rode de novo: funciona.

:::warning
Deixe **uma** linha `type` só: se houver duas, vale a última. Em computadores com npm mais antigo, a linha não aparece. Aí, acrescente.
:::

---

## :icon[milestone] Projeto 1 · Passo 4: a ficha do Racha-conta

:::steps
1. Na pasta raiz, `npm init -y`
2. Rode `node src/scripts/racha.js` e leia o erro do `import`
3. No `package.json`, troque para `"type": "module"`
4. Preencha a `description`: `"Divide a conta do restaurante sem perder nenhum centavo"`
5. Salve e rode de novo
:::

**Pronto quando:** o script volta a mostrar a conta, e o `package.json` tem a `description` e uma linha `type` só.

---

## Scripts do npm

Você decora o telefone dos amigos ou salva o contato com o nome?

---

## :icon[square-terminal] Scripts: apelidos para comandos

Um **script do npm** é um apelido para um comando comprido, como um contato salvo com nome no celular. Os apelidos ficam em `scripts`, no `package.json`: o apelido à esquerda, o comando à direita.

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "racha": "node src/scripts/racha.js"
},
```

Para rodar, escreva `npm run` e o apelido: `npm run racha` faz o mesmo que `node src/scripts/racha.js`.

O `test` já vem pronto e, por enquanto, só mostra um erro. Ele ganha função no E08, com os testes.

---

## :icon[square-terminal] Scripts na prática

```bash
npm run racha      # mostra a conta
npm run            # lista os apelidos que existem
npm racha          # sem o run: Unknown command
```

- **Funciona de qualquer pasta do projeto.** O npm roda o comando a partir da pasta raiz. De dentro de `src/scripts`, o `npm run racha` funciona, e o `ENOENT` da pasta errada, da aula 3, some
- **Quem recebe o projeto descobre os comandos** só de olhar o `package.json`
- Antes da saída, o npm mostra duas linhas começadas por `>`: o projeto e o comando que ele rodou

Outros apelidos chegam depois: `npm test` roda os testes (E08) e `npm run dev` abre o app React no navegador (E24).

---

## :icon[triangle-alert] Cuidado com as vírgulas

O `package.json` é JSON, com as regras da aula 3. O erro mais comum é a vírgula:

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "racha": "node src/scripts/racha.js"
},
```

- Cada linha dentro das chaves termina com vírgula, **menos a última**
- Aspas duplas em tudo: nos nomes e nos comandos

Vírgula faltando ou sobrando faz todo `npm run` falhar com **`EJSONPARSE`**. A mensagem traz a linha e a coluna: vá direto nelas.

---

## :icon[milestone] Projeto 1 · Passo 5: npm run racha

:::steps
1. Em `scripts`, acrescente `"racha": "node src/scripts/racha.js"`, com a vírgula no fim da linha do `test`
2. Salve e rode `npm run racha`
3. Rode `npm run`, sem nada depois, e veja o apelido na lista
4. Entre em `src/scripts` com `cd`, rode `npm run racha` de lá e volte com `cd ../..`
:::

**Pronto quando:** `npm run racha` mostra a conta inteira, com `Subtotal: R$ 187.50`, da raiz e de dentro de `src/scripts`.

---

## Pacotes

Para fazer um bolo, você planta o trigo ou compra a farinha pronta?

---

## :icon[download] Instalando um pacote

**Pacote** é código pronto, como a farinha comprada. O **picocolors** pinta texto no terminal. Na pasta raiz:

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

## :icon[milestone] Projeto 1 · Passo 6: o título em negrito

No topo do `racha.js`, a segunda linha de `import`. Depois, o primeiro `console.log` ganha o negrito:

```javascript
import fs from 'node:fs';
import pc from 'picocolors';

// ... a leitura e o reduce continuam iguais

console.log(pc.bold('Racha-conta:'), conta.restaurante);
```

- Pacote se importa pelo **nome**, sem `./` e sem `.js`: o Node procura dentro do `node_modules`
- `pc.bold` deixa o texto em negrito; `pc.green` e `pc.yellow` pintam de verde e de amarelo

**Pronto quando:** `npm run racha` mostra `Racha-conta:` em negrito.

---

## :icon[folder] node_modules: grande e descartável

A pasta **`node_modules/`** guarda o código dos pacotes baixados. Hoje tem um pacote só; no E08, com o Jest, passa de 200.

- **Apagou?** Rode `npm install`, sem nome de pacote: o npm lê a ficha e baixa tudo outra vez
- **Não mexa** em nada lá dentro: a próxima instalação desfaz a mudança

Para levar o projeto a outro computador:

| Arquivo ou pasta | Vai junto? |
|---|---|
| `src/`, o seu código | sim |
| `package.json` e `package-lock.json` | sim |
| `node_modules/` | não: no destino, `npm install` baixa de novo |

O erro `Cannot find package` quase sempre quer dizer: faltou rodar `npm install`.

---

## :icon[lock] package-lock.json e o ^

O **`package-lock.json`** guarda a **versão exata** de cada pacote, como a nota fiscal de uma compra. Com ele, todo computador instala as mesmas versões. Vai junto com o projeto, e quem escreve nele é o npm.

Na ficha aparece `"picocolors": "^1.1.1"`. A versão tem três números: **principal.novidade.correção**. O **`^`** quer dizer "pode atualizar, desde que o primeiro número continue o mesmo":

| Versão nova | O `^` aceita? | Por quê |
|---|---|---|
| `1.1.2` | sim | só corrige um defeito |
| `1.2.0` | sim | traz novidade sem quebrar o que existia |
| `2.0.0` | não | o primeiro número mudou: pode quebrar o seu código |

---

## :icon[milestone] Projeto 1 · Sua vez: unidades e itens caros

Agora, sozinho. Acrescente duas linhas ao `racha.js`, depois do subtotal:

1. `Unidades pedidas: 5`: a soma das **quantidades** de todos os itens, com outro `reduce`
2. `Itens acima de R$ 50: 2`: quantos itens custam mais de R$ 50, com um `filter` e o `.length`

:::tip Dicas
- O segundo `reduce` é quase igual ao do subtotal: muda só a conta de cada volta
- O teste do `filter` pergunta a cada item: "o seu preço é maior que 50?"
:::

**Pronto quando:** as duas linhas aparecem depois do subtotal, com 5 e 2.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Cannot use import statement outside a module` | o `type` não é `module` | `"type": "module"`, uma linha só |
| `EJSONPARSE` | vírgula ou aspas erradas no `package.json` | ir na linha e na coluna da mensagem |
| `Missing script` | o apelido não existe | `npm run` lista os que existem |
| `Unknown command` | faltou o `run` | `npm run racha` |
| `Cannot find package` | o pacote não foi baixado | `npm install` na pasta raiz |
| `ENOENT` | arquivo não encontrado | rodar da raiz, ou usar o `npm run` |

---

## :icon[milestone] Projeto 1 · Etapa 1 pronta

`npm run racha` mostra:

```plaintext
Racha-conta: Cantina Bella Nonna
Pessoas na mesa: 4
Itens na conta: 4
(a tabela dos quatro itens)
Subtotal: R$ 187.50
Unidades pedidas: 5
Itens acima de R$ 50: 2
```

- A pasta `racha-conta` fica **ao lado** do `lojinha-regras`
- O `package.json` tem a `description`, `"type": "module"`, o script `racha` e o picocolors em `dependencies`

Ainda não há Git: guarde a pasta. No E05, ela vai para o GitHub, e esta etapa vira o primeiro commit. Se o computador do laboratório é apagado entre os encontros, leve a pasta sem o `node_modules`.

---

## Resumo

:::summary
- O Racha-conta lê a conta de um JSON com `fs.readFileSync` e `JSON.parse`; o `reduce` soma preço vezes quantidade
- `console.table` mostra uma lista como tabela; `toFixed(2)` mostra 2 casas decimais
- `npm init -y` cria o `package.json`, a ficha do projeto; `"type": "module"` deixa usar `import`
- Em `scripts`, cada apelido roda um comando: `npm run racha`, de qualquer pasta do projeto
- `npm install pacote` baixa para o `node_modules`, anota em `dependencies` e grava a versão exata no `package-lock.json`
- Para levar o projeto: tudo, menos o `node_modules`; no destino, `npm install`
:::

---

## :icon[arrow-right] Próximos passos

No E05, o Racha-conta vai para o **GitHub**:

- :icon[history] cada etapa vira um **commit**, uma foto do projeto com legenda
- :icon[cloud-upload] o projeto fica na nuvem, e você abre em qualquer computador
- :icon[file-text] um **README** conta o que ele faz e como rodar
