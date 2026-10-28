---
title: "Node na prática: o projeto lojinha-regras"
summary: REPL, arquivos .js, process.argv, fs e JSON; nasce o lojinha-regras, com o catálogo e um relatório no terminal.
module: ambiente-js
duration_minutes: 40
objectives:
  - Executar JavaScript no Node pelo REPL e por arquivos .js
  - Ler os argumentos de um comando com process.argv
  - Ler e gravar arquivos com fs e converter dados com JSON.parse e JSON.stringify
  - Criar o projeto lojinha-regras com o catálogo da Lojinha e um relatório no terminal
---

# Node na prática: o projeto lojinha-regras

Programador Mobile · Encontro E02 · Aula 3 de 89

---

## O que você vai aprender

:::goal
- Testar JavaScript no REPL do Node e rodar arquivos com `node`
- Mostrar resultados no terminal com `console.log`
- Ler os argumentos do comando com `process.argv`
- Ler e gravar arquivos com `fs` e converter dados com JSON
- Criar o `lojinha-regras`, com o catálogo da Lojinha e um relatório
:::

---

## A pergunta da reunião

A **Lojinha** é a loja online que você vai construir neste curso. O app de celular chega no E30; antes dele vêm os dados e as regras do negócio: preço, frete, carrinho, pedido.

Na reunião de segunda, a dona da loja pergunta:

- Quantos produtos temos, e quantos estão em destaque?
- Qual é o preço médio do catálogo? E o do áudio?
- Algum produto está sem foto?

Contar à mão leva minutos com 12 produtos e uma tarde com 300. Um **script** de 20 linhas responde em um segundo, quantas vezes for preciso.

:::question
O que um script precisa saber fazer para responder a essas três perguntas?
:::

---

## :icon[folder-tree] O projeto lojinha-regras

Hoje nasce a pasta que acompanha você até o E20. No terminal, dentro da sua pasta de projetos:

```bash
mkdir lojinha-regras
cd lojinha-regras
code .
```

Ao fim do encontro, ela terá esta forma:

```plaintext
lojinha-regras/
└── src/
    ├── data/       produtos.js e catalogo.json
    └── scripts/    gerar-catalogo.js e relatorio-catalogo.js
```

A cada encontro chega uma pasta nova em `src/`: utilitários, regras de preço e de frete, carrinho, classes. No E30, essa `src/` vai inteira para o app da Lojinha.

---

## :icon[terminal] O REPL: JavaScript na hora

No E01, você digitou JavaScript no Console do navegador. O Node tem o mesmo recurso no terminal: o **REPL** (ler, avaliar, mostrar e repetir). Digite `node` e tecle <kbd>Enter</kbd>:

```bash
$ node
> 199.9 + 89.9
289.8
> 'Fone ' + 'Bluetooth'
'Fone Bluetooth'
> const loja = 'Lojinha'
undefined
> loja
'Lojinha'
> .exit
```

- Cada linha roda quando você tecla <kbd>Enter</kbd>, e o REPL mostra o resultado
- Texto vai entre aspas; com texto, o `+` junta os pedaços
- `const` dá um nome a um valor; a linha em si não tem resultado, por isso o `undefined`
- Para sair: `.exit` ou <kbd>Ctrl</kbd> + <kbd>C</kbd> duas vezes

---

## :icon[file-code] Rodando um arquivo

Para mais de uma linha, escreva um arquivo. Na raiz do `lojinha-regras`, crie `ola.js`:

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

- `console.log` mostra no terminal os valores entre parênteses, separados por um espaço
- O `;` fecha cada instrução, e o script roda de cima para baixo e termina
- Não há página: a saída aparece no próprio terminal em que você rodou o comando

Você estuda `const`, texto e números a fundo no E05.

---

## :icon[list] process.argv: os argumentos do comando

O que você escreve depois do nome do arquivo chega ao script em **`process.argv`**, uma lista com as partes do comando:

```javascript
const nome = process.argv[2];
console.log('Olá,', nome);
```

```bash
node ola.js Ana     # Olá, Ana
node ola.js         # Olá, undefined
```

As posições da lista começam em 0. Com `console.log(process.argv)`, você vê todas:

```plaintext
[ 'C:\\Program Files\\nodejs\\node.exe', 'C:\\...\\lojinha-regras\\ola.js', 'Ana' ]
```

A posição 0 é o `node`, a 1 é o script e a 2 é o primeiro argumento seu. Sem argumento, a posição 2 fica vazia: `undefined`.

---

## Pratique

:::example Desafio
Um script de frete é chamado assim:

```bash
node frete.js 01310-100 150
```

1. O que guardam `process.argv[2]` e `process.argv[3]`?
2. O script calcula `process.argv[3] + 10`. Qual é o resultado?
:::

:::tip Resposta
1. `'01310-100'` e `'150'`: dois textos, inclusive o `150`. Tudo o que vem do comando chega como texto
2. `'15010'`: com texto, o `+` junta em vez de somar. Para fazer a conta, converta antes:

```javascript
const subtotal = Number(process.argv[3]); // 150, agora um número
console.log(subtotal + 10);               // 160
```
:::

---

## :icon[database] Os dados da Lojinha

O catálogo mora em `src/data/produtos.js`: 4 categorias e 12 produtos, 3 por categoria e 4 em destaque.

```javascript
export const categorias = [
  { slug: 'audio', nome: 'Áudio' },
  { slug: 'casa', nome: 'Casa' },
  { slug: 'esporte', nome: 'Esporte' },
  { slug: 'livros', nome: 'Livros' },
];

export const produtos = [
  { id: 1, nome: 'Fone Bluetooth', preco: 199.9, categoria: 'audio', destaque: true, avaliacao: 4.6,
    imagem: 'https://picsum.photos/seed/fone/400/400', descricao: 'Fone sem fio com 20 horas de bateria.' },
  // ... mais 11 produtos
];
```

- `[ ]` é uma **lista** (array); `{ }` é um **objeto**, um grupo de campos `nome: valor`. Os dois ficam para o E08
- `export` deixa outros arquivos usarem `categorias` e `produtos`
- O preço é em reais, com ponto: `199.9`

São dados, não precisam ser digitados: copie o arquivo inteiro da [página do laboratório](materiais/e02/aluno/laboratorio-lojinha-regras.html).

---

## :icon[file-text] fs: lendo e gravando arquivos

O módulo **`fs`** (*file system*) dá ao script acesso aos arquivos do computador, algo que o navegador não oferece:

```javascript
import fs from 'node:fs';

fs.writeFileSync('teste.txt', 'Olá, arquivo');         // cria ou substitui o arquivo
const texto = fs.readFileSync('teste.txt', 'utf-8');   // lê o arquivo inteiro, como texto
console.log(texto);                                    // Olá, arquivo
```

- `import` traz um módulo para o script; o prefixo `node:` indica um que já vem com o Node
- Com `'utf-8'`, o `readFileSync` devolve texto, com os acentos certos
- O caminho parte da pasta em que você rodou o comando, não da pasta do script
- Arquivo que não existe derruba o script com `ENOENT: no such file or directory`

---

## :icon[braces] JSON: dados como texto

**JSON** é texto escrito no formato dos objetos e listas do JavaScript. É assim que uma API manda dados (E19). Duas funções fazem a ponte:

```javascript
const produto = { id: 1, nome: 'Fone Bluetooth', preco: 199.9 };

const texto = JSON.stringify(produto);
console.log(texto);          // {"id":1,"nome":"Fone Bluetooth","preco":199.9}

const deVolta = JSON.parse(texto);
console.log(deVolta.nome);   // Fone Bluetooth
```

- `JSON.stringify` transforma objeto em texto; `JSON.parse`, texto em objeto
- `deVolta.nome` lê o campo `nome` do objeto

Regras do JSON: nomes e textos entre **aspas duplas**, nenhuma vírgula sobrando no fim e nada de comentários. Um JSON inválido faz o `JSON.parse` falhar com `SyntaxError`.

---

## :icon[wrench] Gerando o catalogo.json

O primeiro script grava o catálogo como JSON. Crie `src/scripts/gerar-catalogo.js`:

```javascript
import fs from 'node:fs';
import { categorias, produtos } from '../data/produtos.js';

const catalogo = { categorias, produtos };
const texto = JSON.stringify(catalogo, null, 2);
fs.writeFileSync('src/data/catalogo.json', texto);

console.log('catalogo.json gravado com', produtos.length, 'produtos');
```

```bash
node src/scripts/gerar-catalogo.js
# catalogo.json gravado com 12 produtos
```

- No `import`, o caminho parte do **arquivo do script**: `..` sobe uma pasta, e a extensão `.js` é obrigatória
- `{ categorias, produtos }` junta as duas listas num objeto só
- O `null, 2` grava o texto com recuo de 2 espaços, fácil de ler
- `produtos.length` é a quantidade de itens da lista

---

## :icon[arrow-left-right] Ida e volta: disco, texto e objeto

:::center
![Diagrama: fs.readFileSync leva o catalogo.json do disco a um texto e JSON.parse leva o texto a um objeto; na volta, JSON.stringify faz o texto e fs.writeFileSync grava no disco](images/e02-disco-texto-objeto.svg)
:::

O gerador fez o caminho de baixo: objeto, texto, disco. O relatório faz o de cima: disco, texto, objeto. Só no objeto dá para contar e filtrar.

Por que um JSON, se já existe o `produtos.js`? Porque JSON qualquer programa lê: uma planilha, um site, outra linguagem. O relatório lê o arquivo como leria um catálogo vindo de fora, e a API que você usa no E19 manda os produtos nesse mesmo formato.

---

## :icon[file-search] O relatório (1): ler e filtrar

Crie `src/scripts/relatorio-catalogo.js`. A primeira parte lê o JSON e, se o comando trouxer uma categoria, fica só com os produtos dela:

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

- `let` dá nome a um valor que ainda pode mudar: aqui, a lista e o título
- `if (categoria) { ... }` só roda o que está entre chaves se veio uma categoria
- `filter` passa por cada produto e fica com os que deixam a condição verdadeira; `===` compara se é igual

---

## :icon[chart-bar] O relatório (2): contar e mostrar

A segunda parte responde às perguntas da reunião e imprime:

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

```bash
node src/scripts/relatorio-catalogo.js audio
# Relatório do catálogo: audio
# Produtos: 3
# Em destaque: 1
# Preço médio: R$ 259.90
# Sem imagem: 0
```

`reduce` soma os preços, começando do 0, e `toFixed(2)` mostra duas casas decimais. O ponto no lugar da vírgula fica para o E05, quando você escreve o `formatarPreco`.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Rodar o relatório de dentro de `src/scripts/`: o Node procura `src/scripts/src/data/catalogo.json` e falha com `ENOENT`. Rode sempre da raiz do `lojinha-regras`
- Esquecer a extensão no `import` de um arquivo seu: `'../data/produtos'` dá `Cannot find module`
- Confundir os dois caminhos: no `import`, ele parte do arquivo; no `fs`, da pasta do terminal
- Editar o JSON à mão e deixar uma vírgula sobrando ou aspas simples: `SyntaxError` no `JSON.parse`
- Somar um argumento sem converter: `'150' + 10` dá `'15010'`
:::

---

## Resumo

:::summary
- `node` sozinho abre o REPL; `node arquivo.js` roda um script de cima para baixo
- `console.log` mostra valores no terminal, e `process.argv[2]` traz o primeiro argumento, sempre como texto
- `fs.readFileSync` e `fs.writeFileSync` leem e gravam arquivos, com caminho a partir da pasta do terminal
- `JSON.parse` transforma texto em objeto, e `JSON.stringify` faz o caminho inverso
- O `lojinha-regras` nasce com `src/data/produtos.js`, o gerador do `catalogo.json` e o relatório
:::

---

## :icon[arrow-right] Próximos passos

O relatório funciona, mas o comando é comprido e o projeto ainda não diz a ninguém o que ele é nem do que precisa. Na aula 4, o `lojinha-regras` ganha um `package.json`:

- :icon[square-terminal] `npm run relatorio audio` no lugar de `node src/scripts/relatorio-catalogo.js audio`
- :icon[package] um pacote instalado do npm, que colore o relatório
- :icon[lock] as versões travadas, para todo computador rodar igual

Depois, no laboratório, você monta o projeto inteiro no seu computador.
