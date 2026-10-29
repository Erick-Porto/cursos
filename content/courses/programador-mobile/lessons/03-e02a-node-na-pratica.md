---
title: "Node na prática: o projeto lojinha-regras"
summary: Seus primeiros programas no Node, explicados linha por linha; nasce o lojinha-regras, com o catálogo e um relatório.
module: ambiente-js
duration_minutes: 40
objectives:
  - Rodar JavaScript no terminal, uma linha no REPL ou um arquivo inteiro com node
  - Mostrar resultados com console.log e dar nome a valores com const
  - Ler e gravar arquivos com fs e trocar dados em JSON
  - Ler, linha por linha, os dois scripts do lojinha-regras, o gerador e o relatório
---

# Node na prática: o projeto lojinha-regras

Programador Mobile · Encontro E02 · Aula 3 de 89

---

## O que você vai aprender

:::goal
- Rodar JavaScript no terminal, sem navegador
- Escrever seu primeiro arquivo `.js` e ver o resultado
- Ler e gravar arquivos do computador
- Entender, linha por linha, um programa que responde perguntas sobre a loja
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **script** | um arquivo com instruções que o computador segue, de cima para baixo |
| **pasta raiz** | a pasta principal de um projeto, a mais de fora |
| **argumento** | uma palavra extra que você escreve no comando, depois do nome do arquivo |
| **JSON** | um jeito de escrever dados como texto, que qualquer programa entende |
| **mensagem de erro** | o aviso que o computador mostra quando algo dá errado; ela diz o quê e onde |

---

## A pergunta da reunião

A **Lojinha** é a loja online que você vai construir neste curso. Antes do app, vêm os dados e as regras da loja.

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

Todo o JavaScript do curso fica numa pasta só, o **`lojinha-regras`**. No terminal, dentro da pasta de projetos que você criou no E01:

```bash
mkdir lojinha-regras    # cria a pasta
cd lojinha-regras       # entra nela
code .                  # abre a pasta no VS Code
```

Essa é a **pasta raiz** do projeto. Ela acompanha você até o E20 e, no E30, o que estiver nela vai para o app da Lojinha.

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

O nome vai sem aspas: `loja` é a etiqueta, e `'Lojinha'` é o texto guardado nela. Você estuda nomes e valores a fundo no E05.

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
- Por que o 2? O Node guarda o comando inteiro numa lista, e as posições 0 e 1 são o `node` e o arquivo. No E05 você vê isso de perto

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

São dados prontos: copie o arquivo inteiro da [página do laboratório](materiais/e02/aluno/laboratorio-lojinha-regras.html). Listas e objetos a fundo: E08.

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
| a API de produtos, no E19 | o servidor manda os dados para o app |

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

1. Lê o `catalogo.json` como texto e transforma o texto em objeto
2. Guarda em `categoria` o argumento do comando: `audio`, `casa`... ou nada
3. Começa com a lista inteira e o título "todas as categorias"
4. **`let`** é como o `const`, mas o valor pode ser trocado depois
5. **`if (categoria) { ... }`**: faz o que está entre as chaves **só se** veio uma categoria
6. **`filter`** funciona como uma peneira: olha produto por produto e fica só com os que passam no teste. O teste aqui é `produto.categoria === categoria`, e o `===` pergunta "é igual?"

Hoje você só precisa ler e entender. Escrever `if` e `filter` sozinho vem com calma, no E07 e no E09.

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
| `destaques` | peneira só os produtos em destaque |
| `semImagem` | peneira os produtos com a imagem vazia (`''`, um texto sem nada) |
| `soma` | **`reduce`** soma os preços um por um, começando do 0, como uma calculadora que vai acumulando |
| `media` | divide a soma pela quantidade de produtos |
| `.length` | diz quantos itens a lista tem |
| `toFixed(2)` | mostra o número com 2 casas decimais: `259.90` |
| `console.log(...)` | mostra cada resposta no terminal |

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
- O preço sai com ponto (`259.90`). No E05, você troca para `R$ 259,90`

Pronto: as perguntas da reunião têm resposta, em um segundo.

---

## Mensagens de erro

Quando acende uma luz no painel do carro, você ignora ou lê?

---

## :icon[siren] Quando aparece um erro

Erro faz parte: quem programa vê vários por dia. Leia a mensagem com calma: ela diz **o que** aconteceu e, quase sempre, **onde**.

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
- `node` abre o REPL, para testar uma linha; `.exit` sai dele
- `node arquivo.js` roda um script, de cima para baixo
- `console.log(...)` mostra valores no terminal; `const` dá um nome a um valor
- `process.argv[2]` é o primeiro argumento, a palavra depois do nome do arquivo
- `fs.readFileSync` lê um arquivo e `fs.writeFileSync` grava, a partir da pasta do terminal
- `JSON.parse` transforma texto em objeto e `JSON.stringify` faz o contrário
- Erro: leia a mensagem. `ENOENT` quase sempre é a pasta errada
:::

---

## :icon[arrow-right] Próximos passos

Na aula 4, o projeto ganha uma ficha de identidade, o `package.json`:

- :icon[square-terminal] `npm run relatorio audio`, um comando curto, que funciona de qualquer pasta do projeto
- :icon[package] um pacote baixado da internet, que colore o relatório

Depois, no laboratório, você monta o projeto inteiro no seu computador, com a [página do laboratório](materiais/e02/aluno/laboratorio-lojinha-regras.html) aberta ao lado.
