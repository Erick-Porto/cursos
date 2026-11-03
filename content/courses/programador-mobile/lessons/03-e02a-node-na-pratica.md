---
title: "Node na prática: o projeto lojinha-regras"
summary: Primeiros programas no Node, com comparações, if, filter e reduce passo a passo; nasce o lojinha-regras.
module: ambiente-js
duration_minutes: 150
objectives:
  - Rodar JavaScript no terminal, no REPL ou num arquivo, com console.log, const e argumentos
  - Ler e gravar arquivos com fs e trocar dados em JSON
  - Fazer perguntas de sim ou não com comparações e decidir o caminho com if
  - Separar itens de uma lista com filter, somá-los com reduce e ler o relatório do lojinha-regras
---

# Node na prática: o projeto lojinha-regras

Programador Mobile · Encontros E02 e E03 · Aula 3 de 45

---

## O que você vai aprender

:::goal
- Rodar JavaScript no terminal, sem navegador
- Escrever seu primeiro arquivo `.js` e ver o resultado
- Ler e gravar arquivos do computador
- Fazer perguntas de sim ou não e decidir o caminho com `if`
- Separar os itens de uma lista com `filter` e somá-los com `reduce`
- Entender, linha por linha, um programa que responde perguntas sobre a loja
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **script** | um arquivo com instruções que o computador segue, de cima para baixo |
| **argumento** | uma palavra extra que você escreve no comando, depois do nome do arquivo |
| **JSON** | um jeito de escrever dados como texto, que qualquer programa entende |
| **comparação** | uma pergunta de sim ou não sobre dois valores: "o preço é maior que 200?" |
| **`filter`** | a peneira de uma lista: fica só com os itens que passam num teste |
| **`reduce`** | a calculadora que acumula: junta todos os itens de uma lista num valor só |

---

## A pergunta da reunião

A **Lojinha** é uma loja online de exemplo, com 12 produtos em 4 categorias. Hoje você trabalha com os dados dela.

Na reunião, a dona da loja pergunta:

- Quantos produtos temos? Quantos estão em destaque?
- Qual é o preço médio? E só dos produtos de áudio?
- Algum produto está sem foto?

Contar à mão leva minutos com 12 produtos e uma tarde com 300. Um **script** responde em um segundo, quantas vezes for preciso.

:::question
Se você fosse contar à mão, quais passos faria? Anote: o script de hoje faz os mesmos passos.
:::

---

## O projeto

Onde você guarda as fotos de uma viagem: espalhadas pelo celular ou numa pasta só?

---

## :icon[folder-tree] A pasta do projeto

O JavaScript desta aula fica numa pasta só, o **`lojinha-regras`**, o seu projeto de estudo. No terminal, dentro da pasta de projetos que você criou no E01:

```bash
mkdir lojinha-regras    # cria a pasta
cd lojinha-regras       # entra nela
code .                  # abre a pasta no VS Code
```

Essa é a **pasta raiz** do projeto: a pasta principal, a mais de fora. Os comandos desta aula rodam a partir dela.

:::tip Confira sempre
O terminal do VS Code mostra a pasta em que você está. O caminho precisa terminar em `lojinha-regras`.
:::

---

## :icon[folder-tree] Pastas na prática

O **`cd`** (de *change directory*, mudar de pasta) leva o terminal de uma pasta para outra:

```bash
cd lojinha-regras        # entra na pasta do projeto
cd src                   # entra numa pasta de dentro dela
cd ..                    # volta uma pasta, para a de fora
cd ../..                 # volta duas pastas de uma vez
```

- **`..`** quer dizer "a pasta de fora", a que contém a atual
- Perdeu-se? Olhe o caminho que o terminal mostra antes do cursor: ele diz onde você está

Rodar um comando na pasta errada é o erro mais comum do dia. Você vai usar o `cd ..` para consertar.

---

## O REPL

E se o computador respondesse na hora, como a calculadora do celular?

---

## :icon[terminal] O REPL: testar uma linha

No E01, você digitou `node` e o terminal passou a entender JavaScript. Esse modo se chama **REPL**: você digita uma linha, aperta <kbd>Enter</kbd> e vê o resultado na hora, como numa calculadora.

```bash
$ node
> 199.9 + 89.9
289.8
> 'Fone ' + 'Bluetooth'
'Fone Bluetooth'
> .exit
```

- Número se escreve sem aspas; **texto**, entre aspas
- Com números, o `+` soma; com textos, ele junta os pedaços
- `.exit` sai do REPL e volta ao terminal de sempre

---

## :icon[calculator] O REPL na prática

Use o REPL para tirar uma dúvida rápida, sem criar arquivo nenhum:

```bash
> 120 / 4                 # a pizza de R$ 120 dividida por 4 amigos
30
> 89.9 * 2                # dois cabos de R$ 89,90
179.8
> 'Lojinha' + ' Online'   # juntar dois textos
'Lojinha Online'
```

- **`/`** divide e **`*`** multiplica
- O resultado aparece na linha de baixo, logo depois do <kbd>Enter</kbd>
- No REPL, o que vem depois de `#` é só explicação deste slide: não precisa digitar

---

## :icon[circle-help] E aquele undefined?

No E01, depois da mensagem apareceu um `undefined`. Agora você entende:

```bash
> console.log('Olá')
Olá
undefined
```

- O **`console.log`** **escreve** na tela o que está entre os parênteses
- O REPL sempre mostra o que a linha **devolve** como resultado. Uma conta como `2 + 2` devolve `4`
- O `console.log` só escreve, não devolve nada. Quando não há nada, o REPL mostra **`undefined`**, que quer dizer "nada aqui"

Não é erro. É o REPL avisando que aquela linha não teve resultado.

---

## Arquivos .js

Por que escrever a receita no papel, se dá para cozinhar de cabeça?

---

## :icon[file-code] Seu primeiro arquivo .js

Um **script** é um arquivo `.js` com instruções, como uma receita: o Node faz uma linha de cada vez, de cima para baixo. No VS Code, crie `ola.js` na pasta raiz e escreva:

```javascript
console.log('Olá, Lojinha!');
console.log('Total:', 199.9 + 89.9);
```

Salve com <kbd>Ctrl</kbd> + <kbd>S</kbd> e, no terminal, rode:

```bash
node ola.js
# Olá, Lojinha!
# Total: 289.8
```

- `node ola.js` roda o arquivo: o Node lê e faz cada linha, na ordem
- A vírgula separa os valores dentro do `console.log`; na tela, eles aparecem com um espaço entre eles
- O `;` marca o fim de cada instrução

---

## :icon[file-code] Scripts na prática

Um script guarda passos para repetir quantas vezes quiser. Este, `recibo.js`, mostra o recibo de um pedido:

```javascript
console.log('Pedido 1023');
console.log('Fone Bluetooth:', 199.9);
console.log('Cabo USB-C:', 49.9);
console.log('Total:', 199.9 + 49.9);
```

```bash
node recibo.js
# Pedido 1023
# Fone Bluetooth: 199.9
# Cabo USB-C: 49.9
# Total: 249.8
```

No REPL, as quatro linhas se perdem quando você sai. No arquivo, elas ficam: amanhã é só rodar de novo.

---

## Constantes

O que nunca muda no seu RG, nem depois de dez anos?

---

## :icon[tag] Constantes: um nome para um valor

Uma **constante** é um valor guardado com um nome, que não muda depois de criado. Pense numa caixa lacrada com etiqueta: a etiqueta é o nome, e o valor fica dentro. Ela nasce com **`const`**:

```javascript
const loja = 'Lojinha';
const total = 199.9 + 89.9;

console.log('Olá,', loja);
console.log('Total do carrinho:', total);
```

```bash
node ola.js
# Olá, Lojinha
# Total do carrinho: 289.8
```

O nome vai sem aspas: `loja` é a etiqueta, e `'Lojinha'` é o texto guardado nela. Você estuda nomes e valores a fundo no E06.

---

## :icon[tag] Constantes na prática

**Caso 1: um valor usado em vários lugares.** O frete é o mesmo para todo produto:

```javascript
const frete = 15;
const fone = 199.9;
const cabo = 49.9;

console.log('Fone com frete:', fone + frete);   // Fone com frete: 214.9
console.log('Cabo com frete:', cabo + frete);   // Cabo com frete: 64.9
```

Se o frete subir, você troca o `15` numa linha só, e todas as contas acompanham.

**Caso 2: a caixa é lacrada.** Tentar trocar o valor de uma constante dá erro:

```javascript
const frete = 15;
frete = 20;   // TypeError: Assignment to constant variable.
```

---

## Argumentos

Quando você pede um lanche, o que diz além de "quero um lanche"?

---

## :icon[list] Argumento: uma palavra no comando

Dá para mandar uma informação ao script na hora de rodar: é só escrever depois do nome do arquivo. Essa palavra é o **argumento**.

```javascript
const nome = process.argv[2];
console.log('Olá,', nome);
```

```bash
node ola.js Ana     # Olá, Ana
node ola.js         # Olá, undefined
```

- **`process.argv[2]`** guarda o primeiro argumento: a primeira palavra depois do nome do arquivo
- Sem argumento, não chega nada: `undefined`
- Por que o 2? O Node guarda o comando inteiro numa lista, e as posições 0 e 1 são o `node` e o arquivo

---

## :icon[list] Argumentos na prática

O mesmo script dá respostas diferentes, conforme o argumento:

```bash
node ola.js Ana      # Olá, Ana
node ola.js Bruno    # Olá, Bruno
node ola.js 42       # Olá, 42
```

Daqui a pouco, o relatório da Lojinha usa um argumento para escolher a categoria:

```bash
node src/scripts/relatorio-catalogo.js audio    # só os produtos de áudio
node src/scripts/relatorio-catalogo.js livros   # só os livros
```

Um script só, várias perguntas: o argumento é o detalhe do pedido.

---

## Pratique

:::example Desafio
O `ola.js` tem estas duas linhas:

```javascript
const nome = process.argv[2];
console.log('Olá,', nome);
```

O que aparece em cada comando?

```bash
node ola.js Maria
node ola.js Maria Souza
node ola.js "Maria Souza"
```
:::

:::tip Resposta
1. `Olá, Maria`
2. `Olá, Maria` de novo. O espaço separa os argumentos: `Souza` é o segundo, e o script só usa o primeiro
3. `Olá, Maria Souza`. Com aspas, o nome inteiro vira um argumento só
:::

---

## Objetos e listas

Que campos tem a sua ficha de cadastro na farmácia?

---

## :icon[database] Os dados da Lojinha

Os produtos ficam em `src/data/produtos.js`. Cada produto é uma ficha com **campos**:

```javascript
{ id: 1, nome: 'Fone Bluetooth', preco: 199.9, categoria: 'audio', destaque: true }
```

- **`{ }`** guarda uma ficha, chamada **objeto**: cada campo tem nome, dois-pontos e valor
- **`[ ]`** guarda uma **lista** de fichas, separadas por vírgula: são 12 produtos e 4 categorias
- O preço é em reais, com ponto: `199.9`
- `destaque: true` quer dizer "sim"; `false` seria "não"
- O `export` no começo do arquivo deixa outros arquivos usarem as listas

São dados prontos: copie o arquivo inteiro da [página do laboratório](materiais/e02/aluno/laboratorio-lojinha-regras.html). Objetos a fundo: E13; listas a fundo: E14.

---

## :icon[database] Objetos e listas na prática

Para ler um campo da ficha, use o nome dela, um ponto e o nome do campo. Para saber o tamanho da lista, use **`.length`**:

```javascript
const produto = { nome: 'Fone Bluetooth', preco: 199.9, destaque: true };
console.log(produto.nome);       // Fone Bluetooth
console.log(produto.preco);      // 199.9

const categorias = ['audio', 'casa', 'esporte', 'livros'];
console.log(categorias.length);  // 4
console.log(categorias[0]);      // audio
```

- `categorias[0]` pega o item da posição 0: a lista começa a contar do zero
- É assim que o relatório vai contar os produtos: `produtos.length`

Para treinar: a [lista de exercícios de listas e objetos](materiais/e02/aluno/exercicios-listas-e-objetos.html), com respostas.

---

## Ler e gravar arquivos

Um site pode abrir as fotos do seu computador sem você escolher?

---

## :icon[file-text] fs: o Node mexe em arquivos

O navegador não pode abrir os arquivos do seu computador, por segurança. O Node pode, com o **`fs`** (de *file system*, sistema de arquivos):

```javascript
import fs from 'node:fs';

fs.writeFileSync('teste.txt', 'Olá, arquivo');
const texto = fs.readFileSync('teste.txt', 'utf-8');
console.log(texto);   // Olá, arquivo
```

| Linha | O que faz |
|---|---|
| `import fs from 'node:fs'` | traz o `fs` para o script; ele já vem com o Node |
| `writeFileSync` | **grava** um arquivo: cria ou substitui |
| `readFileSync` | **lê** um arquivo e devolve o texto dele; o `'utf-8'` acerta os acentos |

Tudo depois de `//` é um **comentário**: o Node ignora, é só um recado para quem lê.

---

## :icon[file-text] Ler e gravar na prática

Um recado que muda de horário. Gravar de novo **substitui** o texto antigo:

```javascript
import fs from 'node:fs';

fs.writeFileSync('recado.txt', 'Reunião às 10h');
console.log(fs.readFileSync('recado.txt', 'utf-8'));   // Reunião às 10h

fs.writeFileSync('recado.txt', 'Reunião às 11h');
console.log(fs.readFileSync('recado.txt', 'utf-8'));   // Reunião às 11h
```

Na Lojinha, hoje:

- o **gerador** grava o catálogo no arquivo `catalogo.json`
- o **relatório** lê esse arquivo para fazer as contas

---

## JSON

Como mandar a lista de produtos para alguém que usa outro programa?

---

## :icon[braces] JSON: dados escritos como texto

Um arquivo só guarda **texto**. Para gravar a lista de produtos num arquivo, ela vira texto num formato chamado **JSON**, que qualquer programa entende: um site, uma planilha, um app.

```javascript
const produto = { nome: 'Fone Bluetooth', preco: 199.9 };

const texto = JSON.stringify(produto);   // objeto vira texto
console.log(texto);    // {"nome":"Fone Bluetooth","preco":199.9}

const deVolta = JSON.parse(texto);       // texto vira objeto
console.log(deVolta.nome);               // Fone Bluetooth
```

- **`JSON.stringify`**: objeto para texto, para gravar ou enviar
- **`JSON.parse`**: texto para objeto, para usar no código
- `deVolta.nome` lê um campo: o nome do objeto, um ponto e o nome do campo

---

## :icon[braces] JSON na prática

O JSON aparece em muitos lugares do curso:

| Onde | Para quê |
|---|---|
| `catalogo.json`, hoje | guardar os produtos num arquivo |
| `package.json`, na aula 4 | a ficha do projeto |
| uma API, no E22 | o servidor manda os dados para o app |

Assim fica um catálogo em JSON, com uma lista dentro de um objeto:

```json
{
  "categorias": ["audio", "casa", "esporte", "livros"],
  "produtos": [
    { "id": 1, "nome": "Fone Bluetooth", "preco": 199.9 }
  ]
}
```

---

## :icon[triangle-alert] As regras do JSON

O JSON é mais exigente que o JavaScript:

| Certo | Errado | Por quê |
|---|---|---|
| `{"nome": "Fone"}` | `{'nome': 'Fone'}` | JSON só aceita aspas duplas |
| `{"preco": 199.9}` | `{"preco": 199,9}` | número usa ponto, não vírgula |
| `{"a": 1, "b": 2}` | `{"a": 1, "b": 2,}` | vírgula sobrando no fim |

Também não aceita comentários. Um JSON com erro faz o `JSON.parse` falhar com **`SyntaxError`**.

Guarde estas regras: o `package.json` da aula 4 também é JSON.

---

## :icon[arrow-left-right] Ida e volta: arquivo, texto e objeto

:::center
![Diagrama: fs.readFileSync leva o catalogo.json do disco a um texto e JSON.parse leva o texto a um objeto; na volta, JSON.stringify faz o texto e fs.writeFileSync grava no disco](images/e02-disco-texto-objeto.svg)
:::

- **Para ler** (caminho de cima): `fs.readFileSync` tira o texto do arquivo, e `JSON.parse` transforma o texto em objeto
- **Para gravar** (caminho de baixo): `JSON.stringify` transforma o objeto em texto, e `fs.writeFileSync` grava o texto no arquivo

Só depois de virar objeto dá para contar e somar. Os dois scripts de hoje fazem um caminho cada um: o gerador grava, o relatório lê.

---

## O gerador do catálogo

Doze produtos digitados à mão: quanto tempo leva? E se um preço mudar?

---

## :icon[wrench] Script 1: o gerador do catálogo

O gerador grava os produtos num arquivo JSON. Crie `src/scripts/gerar-catalogo.js`:

```javascript
import fs from 'node:fs';
import { categorias, produtos } from '../data/produtos.js';

const catalogo = { categorias, produtos };
const texto = JSON.stringify(catalogo, null, 2);
fs.writeFileSync('src/data/catalogo.json', texto);

console.log('catalogo.json gravado com', produtos.length, 'produtos');
```

Rode da pasta raiz:

```bash
node src/scripts/gerar-catalogo.js
# catalogo.json gravado com 12 produtos
```

O arquivo `src/data/catalogo.json` aparece no painel do VS Code. Abra e veja o catálogo, agora em JSON.

---

## :icon[list-ordered] O gerador em português

| Linha | O que ela diz |
|---|---|
| `import fs ...` | "vou usar o `fs` para gravar um arquivo" |
| `import { categorias, produtos } ...` | "traga as duas listas do arquivo de dados". O `..` sobe uma pasta, e o `.js` no fim é obrigatório |
| `const catalogo = ...` | "junte as duas listas num objeto só" |
| `JSON.stringify(catalogo, null, 2)` | "transforme em texto". O `null, 2` organiza o texto em linhas, com recuo |
| `fs.writeFileSync(...)` | "grave o texto em `src/data/catalogo.json`" |
| `produtos.length` | a quantidade de itens da lista: 12 |

---

## Perguntas de sim ou não

"Este fone custa mais de R$ 200?" Quantas respostas essa pergunta pode ter?

---

## :icon[scale] Comparar: a resposta é true ou false

Uma **comparação** é uma pergunta de sim ou não: dois valores com um sinal no meio. O Node responde **`true`** (sim) ou **`false`** (não), as palavras do campo `destaque`.

| Sinal | Pergunta | Exemplo | Resposta |
|---|---|---|---|
| `===` | é igual? | `'audio' === 'audio'` | `true` |
| `>` | é maior? | `199.9 > 200` | `false` |
| `<` | é menor? | `89.9 < 100` | `true` |
| `>=` | é maior ou igual? | `150 >= 150` | `true` |

- O `===` tem **três** sinais de igual. Um só, `=`, guarda um valor na caixa: `const total = 180`
- Texto só é igual letra por letra, maiúsculas incluídas

---

## :icon[scale] Comparações na prática

No REPL, com a ficha do fone:

```bash
> const fone = { nome: 'Fone Bluetooth', preco: 199.9, categoria: 'audio' };
undefined
> fone.categoria === 'audio'
true
> fone.preco > 200
false
> fone.categoria === 'Audio'
false
```

- O Node troca o campo pelo valor e só então compara: `fone.preco > 200` vira `199.9 > 200`
- A última dá `false` por causa da maiúscula: `'Audio'` e `'audio'` são textos diferentes
- O `undefined` depois do `const` é o de sempre: criar uma constante não devolve resultado

---

## Decidir com if

Se estiver chovendo, você leva o guarda-chuva. E se não estiver?

---

## :icon[split] if: só faz se a resposta for sim

O **`if`** ("se", em inglês) é uma bifurcação na estrada: a comparação escolhe o caminho. As chaves `{ }` só rodam se a resposta for `true`; se for `false`, o Node pula as chaves.

```javascript
const total = 180;
let frete = 15;

if (total >= 150) {
  frete = 0;
}

console.log('Frete:', frete);   // Frete: 0
```

| Linha | O que ela diz |
|---|---|
| `let frete = 15;` | "crie a caixa `frete` com 15". O **`let`** é a caixa que deixa trocar o conteúdo; a `const` é lacrada |
| `if (total >= 150) {` | "se o total for 150 ou mais, faça o que está nas chaves" |
| `frete = 0;` | "troque o conteúdo da caixa para 0": frete grátis |

Com `total` igual a 120, a resposta é `false`, e sai `Frete: 15`.

---

## :icon[split] if na prática

**O argumento veio?** No `if`, um valor que chegou conta como "sim", e `undefined`, a caixa vazia, conta como "não":

```javascript
const nome = process.argv[2];
let saudacao = 'Olá, visitante';

if (nome) {
  saudacao = 'Olá, ' + nome;
}

console.log(saudacao);
```

```bash
node ola.js Ana    # Olá, Ana
node ola.js        # Olá, visitante
```

O relatório da Lojinha usa este mesmo caso: `if (categoria)` quer dizer "se veio uma categoria no comando". O `if` volta no E10, com o `else`, o caminho do "senão".

---

## Filtrar uma lista

Na obra, como se separa a areia fina da grossa sem escolher grão por grão?

---

## :icon[square-function] O teste: a pergunta feita a cada item

Na peneira, o furo decide o que passa. No código, quem decide é o **teste**: uma pergunta de sim ou não, escrita uma vez e feita a cada item.

```javascript
(produto) => produto.preco > 200
```

| Parte | O que quer dizer |
|---|---|
| `(produto)` | o item que chega para ser testado; o nome é você quem escolhe |
| `=>` | a seta: "responda" |
| `produto.preco > 200` | a pergunta feita a esse item: o preço dele passa de 200? |

Em voz alta: "dado um produto, responda: o preço passa de 200?". Esse teste é uma **função**: uma receita curta, que recebe um ingrediente e entrega uma resposta. Funções a fundo: E07.

---

## :icon[square-function] O teste, um produto de cada vez

Para ver o teste trabalhando, guarde-o numa constante e entregue um produto de cada vez:

```javascript
const fone = { nome: 'Fone Bluetooth', preco: 199.9 };
const caixa = { nome: 'Caixa de Som Portátil', preco: 249.9 };
const caro = (produto) => produto.preco > 200;

console.log(caro(fone));    // false
console.log(caro(caixa));   // true
```

- `caro(fone)` entrega o fone ao teste: ele entra no lugar de `produto`
- A pergunta vira `fone.preco > 200`, depois `199.9 > 200`, e a resposta é `false`
- Com a caixa, `249.9 > 200` dá `true`

Fazer isso à mão com 12 produtos cansa. O `filter` faz sozinho, com a lista inteira.

---

## :icon[funnel] filter: a peneira

O **`filter`** (filtrar) é a peneira da lista. Ele passa a lista inteira pelo teste, um item de cada vez: quem responde `true` fica, quem responde `false` sai. No fim, entrega uma **lista nova**, só com quem passou.

```javascript
const caros = produtos.filter((produto) => produto.preco > 200);
console.log(caros.length);   // 4
```

| Parte | O que ela diz |
|---|---|
| `produtos.filter(...)` | "peneire a lista `produtos`" |
| `(produto) => produto.preco > 200` | o teste, o furo da peneira |
| `const caros = ...` | "guarde a lista nova na caixa `caros`" |
| `caros.length` | quantos passaram: 4 dos 12 |

A lista `produtos` não muda: continua com os 12. O `filter` só copia para a lista nova quem passou.

---

## :icon[funnel] filter, item por item

O mesmo teste com os três produtos de áudio. O `filter` faz esta tabela sozinho, para 3, 12 ou 300 produtos:

| `produto` | A pergunta vira | Resposta | Fica? |
|---|---|---|---|
| Fone Bluetooth | `199.9 > 200` | `false` | não |
| Caixa de Som Portátil | `249.9 > 200` | `true` | sim |
| Microfone USB | `329.9 > 200` | `true` | sim |

O resultado é uma lista nova com 2 produtos: a Caixa de Som e o Microfone, na mesma ordem em que estavam.

---

## :icon[funnel] A peneira em ação

:::center
![Animação: os três produtos de áudio passam pelo teste produto.preco > 200; o Fone, de 199.9, responde false e sai; a Caixa de Som, de 249.9, e o Microfone, de 329.9, respondem true e ficam na lista caros, que termina com 2 produtos](images/e02-filter-peneira.svg)
:::

Cada produto recebe a mesma pergunta. Só quem responde `true` segue para a lista nova.

---

## :icon[funnel] filter na prática

Trocando só o teste, a mesma peneira responde perguntas diferentes sobre os 12 produtos:

```javascript
const destaques = produtos.filter((produto) => produto.destaque);
const deAudio = produtos.filter((produto) => produto.categoria === 'audio');
const semImagem = produtos.filter((produto) => produto.imagem === '');

console.log(destaques.length);   // 4
console.log(deAudio.length);     // 3
console.log(semImagem.length);   // 0
```

- `produto.destaque` já é `true` ou `false`: o campo é a própria resposta
- `produto.imagem === ''` pergunta "a imagem está vazia?". `''` é um texto sem nada dentro
- O `.length` da lista nova responde "quantos?"

---

## Somar uma lista

No caixa do mercado, como a máquina chega ao total da compra?

---

## :icon[calculator] reduce: a calculadora que acumula

O **`reduce`** (reduzir) junta a lista inteira num **valor só**. Funciona como a máquina do caixa: o visor começa no 0, e cada produto que passa soma o preço dele ao que já estava no visor.

```javascript
const soma = lista.reduce((total, produto) => total + produto.preco, 0);
```

| Parte | O que quer dizer |
|---|---|
| `0`, no fim | o visor no começo, antes do primeiro produto |
| `total` | o que está no visor agora: a soma até aqui |
| `produto` | o produto da vez |
| `total + produto.preco` | a conta de cada volta; o resultado vira o novo `total` |

O `filter` devolve uma lista; o `reduce` devolve um valor só.

---

## :icon[calculator] reduce, volta por volta

Os três produtos de áudio passam pela calculadora:

| Volta | `total` antes | `produto` | A conta | `total` depois |
|---|---|---|---|---|
| 1 | 0 | Fone Bluetooth | `0 + 199.9` | 199.9 |
| 2 | 199.9 | Caixa de Som Portátil | `199.9 + 249.9` | 449.8 |
| 3 | 449.8 | Microfone USB | `449.8 + 329.9` | 779.7 |

- O `total` depois de uma volta é o `total` antes da próxima
- Acabaram os produtos: o `reduce` entrega o último total, e `soma` vale 779.7
- A média é a soma dividida pela quantidade, `779.7 / 3`. O relatório mostra `259.90`: o `toFixed(2)` deixa 2 casas decimais

---

## :icon[calculator] A calculadora em ação

:::center
![Animação: o visor começa em 0; o Fone soma 199.9 e o total vai a 199.9; a Caixa de Som soma 249.9 e o total vai a 449.8; o Microfone soma 329.9 e o total vai a 779.7, o resultado do reduce](images/e02-reduce-acumula.svg)
:::

O resultado de cada volta é o começo da próxima. O último total é o que o `reduce` entrega.

---

## :icon[calculator] reduce na prática

**Quantas unidades tem o carrinho?** A conta de cada volta soma a quantidade, não o preço:

```javascript
const carrinho = [
  { nome: 'Cabo USB-C', qtd: 2 },
  { nome: 'Garrafa Térmica', qtd: 1 },
  { nome: 'Tapete de Yoga', qtd: 3 },
];
const unidades = carrinho.reduce((total, item) => total + item.qtd, 0);
console.log('Unidades:', unidades);   // Unidades: 6
```

**Quanto custam juntos os produtos em destaque?** Primeiro o `filter` separa, depois o `reduce` soma:

```javascript
const destaques = produtos.filter((produto) => produto.destaque);
const soma = destaques.reduce((total, produto) => total + produto.preco, 0);
console.log(soma);   // 709.6
```

---

## Pratique com filter e reduce

:::example Desafio
O estoque de quatro produtos está numa lista:

```javascript
const estoques = [5, 0, 12, 3];

const temEstoque = estoques.filter((qtd) => qtd > 0);
const unidades = estoques.reduce((total, qtd) => total + qtd, 0);

console.log(temEstoque.length);
console.log(temEstoque);
console.log(unidades);
```

O que aparece em cada uma das três linhas?
:::

:::tip Resposta
1. `3`: o 0 responde `false` a `qtd > 0` e fica de fora
2. `[ 5, 12, 3 ]`: a lista nova, na mesma ordem, sem o 0
3. `20`: volta a volta, 0 + 5 = 5, 5 + 0 = 5, 5 + 12 = 17 e 17 + 3 = 20
:::

---

## O relatório do catálogo

As perguntas da dona da loja, respondidas em um segundo. Como?

---

## :icon[file-search] Script 2: o relatório, parte 1

O relatório lê o JSON e, se você passar uma categoria, fica só com os produtos dela. Crie `src/scripts/relatorio-catalogo.js`:

```javascript
import fs from 'node:fs';

const texto = fs.readFileSync('src/data/catalogo.json', 'utf-8');
const catalogo = JSON.parse(texto);
const categoria = process.argv[2];

let lista = catalogo.produtos;
let titulo = 'todas as categorias';
if (categoria) {
  lista = lista.filter((produto) => produto.categoria === categoria);
  titulo = categoria;
}
```

---

## :icon[list-ordered] A parte 1 em português

| Linha | O que ela diz |
|---|---|
| `readFileSync` e `JSON.parse` | "leia o `catalogo.json` e transforme o texto em objeto" |
| `const categoria = process.argv[2];` | "guarde o argumento": `audio`, `casa`... ou nada |
| `let lista = ...` e `let titulo = ...` | a lista inteira e o título; `let` porque os dois podem ser trocados |
| `if (categoria) {` | "se veio uma categoria no comando..." |
| `lista = lista.filter(...)` | "...peneire e fique só com os produtos dela" |
| `titulo = categoria;` | "...e troque o título" |

O teste pergunta a cada produto: "a sua categoria é igual à do comando?". Com `audio`, passam 3 dos 12.

---

## :icon[chart-bar] Script 2: o relatório, parte 2

A segunda parte, logo abaixo da primeira, faz as contas e mostra as respostas:

```javascript
const destaques = lista.filter((produto) => produto.destaque);
const semImagem = lista.filter((produto) => produto.imagem === '');
const soma = lista.reduce((total, produto) => total + produto.preco, 0);
const media = soma / lista.length;

console.log('Relatório do catálogo:', titulo);
console.log('Produtos:', lista.length);
console.log('Em destaque:', destaques.length);
console.log('Preço médio: R$', media.toFixed(2));
console.log('Sem imagem:', semImagem.length);
```

---

## :icon[list-ordered] A parte 2 em português

| Linha | O que ela faz |
|---|---|
| `destaques` | peneira: fica só quem tem `destaque: true` |
| `semImagem` | peneira: fica só quem tem a imagem vazia (`''`, um texto sem nada) |
| `soma` | calculadora: soma os preços da lista, volta por volta, começando do 0 |
| `media` | divide a soma pela quantidade de produtos da lista |
| `media.toFixed(2)` | mostra a média com 2 casas decimais: `259.90` |
| `console.log(...)` | mostra cada resposta; o `.length` de cada lista nova responde "quantos?" |

---

## :icon[square-terminal] Rodando o relatório

Sempre da pasta raiz, com ou sem categoria no fim:

```bash
node src/scripts/relatorio-catalogo.js audio
```

```plaintext
Relatório do catálogo: audio
Produtos: 3
Em destaque: 1
Preço médio: R$ 259.90
Sem imagem: 0
```

- Sem categoria, ele mostra o catálogo inteiro: 12 produtos
- Escreva a categoria como ela está no arquivo: `audio`, `casa`, `esporte` ou `livros`
- O preço sai com ponto (`259.90`). No E09, você troca para `R$ 259,90`

Pronto: as perguntas da reunião têm resposta, em um segundo.

---

## Mensagens de erro

Quando acende uma luz no painel do carro, você ignora ou lê?

---

## :icon[siren] Quando aparece um erro

A **mensagem de erro** é o aviso do computador quando algo dá errado, como a luz do painel do carro. Ela diz **o que** aconteceu e, quase sempre, **onde**.

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `ENOENT` | arquivo não encontrado | rodar da pasta raiz; conferir o nome do arquivo |
| `Cannot find module` | o `import` aponta para um arquivo que não existe | conferir o caminho e o `.js` no fim |
| `SyntaxError` | algo foi escrito errado | olhar a linha indicada: aspas, vírgula, parêntese |
| `undefined` onde devia ter um valor | o valor não chegou | faltou o argumento? O nome do campo está certo? |

---

## :icon[folder-tree] O erro mais comum: a pasta errada

O caminho dentro do `fs` parte da pasta **em que o terminal está**, não da pasta do script.

```bash
cd src/scripts
node relatorio-catalogo.js
# Error: ENOENT: no such file or directory,
#   open '...\lojinha-regras\src\scripts\src\data\catalogo.json'
```

Veja o caminho da mensagem: o Node procurou `src\data` **dentro** de `src\scripts`, e lá não existe. A correção é voltar para a raiz:

```bash
cd ../..                                  # sobe duas pastas
node src/scripts/relatorio-catalogo.js    # agora funciona
```

Na aula 4, o `npm run` acaba com esse problema.

---

## Resumo

:::summary
- `node` abre o REPL; `node arquivo.js` roda um script, de cima para baixo
- `console.log` mostra valores, `const` dá nome a um valor, `process.argv[2]` é o primeiro argumento
- `fs.readFileSync` lê e `fs.writeFileSync` grava, a partir da pasta do terminal
- `JSON.parse` transforma texto em objeto e `JSON.stringify` faz o contrário
- Comparações (`===`, `>`, `<`, `>=`) respondem `true` ou `false`; o `if` só roda as chaves com `true`
- `filter` peneira a lista com um teste e devolve uma lista nova; `reduce` acumula a lista num valor só
- Erro: leia a mensagem. `ENOENT` quase sempre é a pasta errada
:::

---

## :icon[arrow-right] Próximos passos

Na aula 4, no E04, começa o **Projeto 1, o Racha-conta**: dividir a conta do restaurante entre amigos. Ele nasce com o npm:

- :icon[package] o `package.json`, a ficha de identidade do projeto
- :icon[square-terminal] `npm run racha`, um comando curto, que funciona de qualquer pasta do projeto
- :icon[download] um pacote baixado da internet, que colore o título
- :icon[calculator] o `reduce` de hoje, somando os itens da conta
