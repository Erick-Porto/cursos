---
title: "Node na prática: scripts para o app"
summary: REPL, módulos, process.argv, fs, path e JSON para levar o catálogo da Lojinha a um JSON e gerar um relatório dele.
module: ambiente-js
duration_minutes: 40
objectives:
  - Executar JavaScript no Node pelo REPL e por arquivos .mjs
  - Diferenciar módulos ES de CommonJS
  - Ler argumentos e arquivos com process.argv, fs e path
  - Converter dados entre texto e objeto com JSON.parse e JSON.stringify
---

# Node na prática: scripts para o app

Programador Mobile: Módulo Específico · Encontro E21 · Aula 24 de 71

---

## O que você vai aprender

:::goal
- Testar ideias no REPL do Node e rodar arquivos com `node`
- Diferenciar módulos ES de CommonJS e saber por que os seus scripts usam `.mjs`
- Ler os argumentos do comando com `process.argv`
- Ler e gravar arquivos com `fs` e montar caminhos com `path`
- Levar o catálogo da Lojinha para JSON e gerar um relatório dele
:::

---

## A pergunta da reunião

Na reunião de segunda, a dona da loja pergunta: "Quantos produtos temos em cada categoria? Qual é o preço médio do áudio? Algum produto está sem foto?"

Você poderia abrir o app e contar na tela. Com 12 produtos, leva alguns minutos; com 300, uma tarde, e com erro. Um **script** de 30 linhas responde em um segundo, quantas vezes for preciso, e no E24 pode até rodar sozinho a cada `git push`.

:::question
O que um script precisa saber fazer para responder a essas três perguntas sem abrir o app?
:::

---

## :icon[terminal] O REPL: JavaScript na hora

`node -v` mostra a versão instalada. Digite só `node` e você entra no **REPL** (ler, avaliar, mostrar e repetir): cada linha roda assim que você tecla <kbd>Enter</kbd>.

```bash
$ node
> 199.9 * 3
599.7
> const precos = [199.9, 89.9]
undefined
> precos.length
2
> .exit
```

- O REPL mostra o valor de cada expressão; uma declaração com `const` não tem valor, por isso aparece `undefined`
- Use-o para testar uma conta, um método de array ou um `JSON.parse` antes de levar ao código
- Para sair: `.exit` ou <kbd>Ctrl</kbd> + <kbd>C</kbd> duas vezes

---

## :icon[file-code] Rodando um arquivo

Para algo maior que uma linha, escreva um arquivo e passe o caminho dele ao `node`. Na raiz do `lojinha`, crie `scripts/ola.mjs`:

```javascript
const loja = 'Lojinha';
const precos = [199.9, 249.9, 329.9];
const total = precos.reduce((soma, preco) => soma + preco, 0);

console.log(`${loja}: ${precos.length} produtos, R$ ${total.toFixed(2)}`);
```

```bash
node scripts/ola.mjs
# Lojinha: 3 produtos, R$ 779.70
```

O script começa na primeira linha, vai até a última e termina. Não há tela, Metro nem celular: o `console.log` sai no próprio terminal em que você rodou o comando.

---

## :icon[package] Módulos ES e CommonJS

O Node conhece dois sistemas de módulos, com sintaxes diferentes para importar e exportar:

::::columns
:::col
**Módulos ES**, os mesmos do app

```javascript
import fs from 'node:fs';

export function contar(lista) {
  return lista.length;
}
```
:::
:::col
**CommonJS**, o sistema antigo do Node

```javascript
const fs = require('node:fs');

function contar(lista) {
  return lista.length;
}
module.exports = { contar };
```
:::
::::

| Extensão | Como o Node lê o arquivo |
|---|---|
| `.mjs` | sempre como módulo ES |
| `.cjs` | sempre como CommonJS |
| `.js` | conforme o campo `"type"` do `package.json` |

O prefixo `node:` indica um módulo que já vem com o Node.

---

## :icon[file-check] Por que os seus scripts terminam em .mjs

O `package.json` da Lojinha não tem o campo `"type"`. Num `.js`, então, o `import` gera o erro `Cannot use import statement outside a module` ou, nas versões recentes do Node, um aviso sugerindo acrescentar `"type": "module"`.

Seguir a sugestão parece inofensivo, mas muda a regra para **todos** os `.js` que o Node carrega no projeto, inclusive arquivos de configuração escritos com `module.exports`.

:::tip
Use `.mjs` nos scripts: a regra vale só para aquele arquivo e você escreve `import` e `export` como no app. Num `.mjs`, `require` e `__dirname` não existem: são do CommonJS.
:::

---

## :icon[list] process.argv: os argumentos do comando

O objeto **`process`** descreve o programa em execução. Em `process.argv` ficam as partes do comando, já separadas:

```bash
node scripts/relatorio-catalogo.mjs --categoria=audio
```

```javascript
console.log(process.argv);
// [ 'C:\\...\\node.exe', 'C:\\...\\scripts\\relatorio-catalogo.mjs', '--categoria=audio' ]

const args = process.argv.slice(2);                        // [ '--categoria=audio' ]
const opcao = args.find((a) => a.startsWith('--categoria='));
const filtro = opcao ? opcao.split('=')[1] : null;         // 'audio' ou null
```

As duas primeiras posições são o caminho do `node` e o do script; os seus argumentos começam na posição 2. Todos chegam como **texto**, como os parâmetros de rota do Expo Router.

---

## Pratique

:::example Desafio
Um script calcula o frete de teste e é chamado assim:

```bash
node scripts/frete.mjs 01310-100 150
```

1. O que `process.argv.slice(2)` devolve?
2. Escreva as linhas que guardam o CEP em `cep` e o subtotal, como número, em `subtotal`.
:::

:::tip Resposta
1. `['01310-100', '150']`: duas strings, inclusive o `150`
2. Desestruture e converta:

```javascript
const [cep, textoSubtotal] = process.argv.slice(2);
const subtotal = Number(textoSubtotal); // 150, agora um número
```

Sem o `Number`, a comparação `subtotal >= 150` até funciona por coerção, mas `subtotal + 10` vira o texto `'15010'`.
:::

---

## :icon[folder-tree] path: caminhos para qualquer sistema

No Windows, as pastas se separam com `\`; no macOS e no Linux, com `/`. O módulo **`path`** monta o caminho certo para o sistema em que o script roda:

```javascript
import path from 'node:path';

const arquivo = path.join(process.cwd(), 'src', 'data', 'catalogo.json');
// Windows: C:\Users\ana\lojinha\src\data\catalogo.json
// macOS:   /Users/ana/lojinha/src/data/catalogo.json
```

| Chamada | Devolve |
|---|---|
| `process.cwd()` | a pasta em que você rodou o comando |
| `path.join(...)` | as partes unidas com o separador do sistema |
| `path.basename(arquivo)` | `catalogo.json` |
| `path.extname(arquivo)` | `.json` |

Rode os scripts sempre da **raiz** do `lojinha`: o `cwd` é o ponto de partida do caminho.

---

## :icon[file-text] fs: lendo e gravando arquivos

O módulo **`fs`** (*file system*) dá ao script acesso ao disco do computador, algo que o app no celular não tem:

```javascript
import fs from 'node:fs';

const texto = fs.readFileSync(arquivo, 'utf-8');       // o arquivo inteiro, como texto
fs.writeFileSync('relatorio.txt', 'Produtos: 12\n');   // cria ou substitui o arquivo
console.log(fs.existsSync(arquivo));                   // true se o arquivo existe
```

- Com `'utf-8'`, o `readFileSync` devolve texto, com os acentos certos; sem ele, devolve bytes
- As funções `Sync` esperam o disco terminar antes de seguir: num script curto, é o jeito mais simples
- Um arquivo que não existe derruba o script com `ENOENT: no such file or directory`

---

## :icon[braces] JSON: dados como texto

**JSON** é texto no formato de objetos e arrays do JavaScript. É assim que as APIs mandam dados (E38) e que o celular guarda dados (E39). Duas funções fazem a ponte:

```javascript
const pedido = { id: 7, itens: ['Fone Bluetooth'], pago: false };

const texto = JSON.stringify(pedido);
// '{"id":7,"itens":["Fone Bluetooth"],"pago":false}'

const deVolta = JSON.parse(texto);
console.log(deVolta.itens[0]);                 // Fone Bluetooth

console.log(JSON.stringify(pedido, null, 2));  // o mesmo texto, com recuo de 2 espaços
```

Regras do JSON: chaves e textos entre **aspas duplas**, nenhuma vírgula sobrando no fim, nada de comentários, funções ou `undefined`. Um JSON inválido faz o `JSON.parse` lançar `SyntaxError`.

---

## :icon[database] O catálogo vira JSON

Hoje o catálogo é código, em `src/data/produtos.js`. No laboratório, ele vira `src/data/catalogo.json`, no formato de uma resposta de API:

```json
{
  "categorias": [{ "slug": "audio", "nome": "Áudio" }],
  "produtos": [
    { "id": 1, "nome": "Fone Bluetooth", "preco": 199.9, "categoria": "audio",
      "destaque": true, "avaliacao": 4.6, "imagem": "https://...", "descricao": "..." }
  ]
}
```

O `produtos.js` passa a só reexportar o JSON:

```javascript
import catalogo from './catalogo.json';
export const { categorias, produtos } = catalogo;
```

O Metro transforma o JSON em objeto sozinho. As telas continuam importando de `produtos.js` e nem percebem a troca.

---

## :icon[wrench] Gerando o JSON com um script

Reescrever 12 produtos à mão, pondo aspas duplas em cada chave, é lento e cheio de erros. Deixe o Node fazer: copie `src/data/produtos.js` para `scripts/produtos-antigos.mjs`, que o `.mjs` permite importar, e rode uma vez:

```javascript
// scripts/gerar-catalogo.mjs
import fs from 'node:fs';
import path from 'node:path';
import { categorias, produtos } from './produtos-antigos.mjs';

const destino = path.join(process.cwd(), 'src', 'data', 'catalogo.json');
const texto = JSON.stringify({ categorias, produtos }, null, 2);

fs.writeFileSync(destino, texto + '\n');
console.log(`catalogo.json gravado com ${produtos.length} produtos`);
```

No Node, o `import` de um arquivo seu leva a extensão: `'./produtos-antigos.mjs'`. Depois de gerar o JSON, apague os dois arquivos: eles serviram uma vez só.

---

## :icon[arrow-left-right] Ida e volta: disco, texto e objeto

:::center
![Diagrama: fs.readFileSync leva o catalogo.json do disco a um texto e JSON.parse leva o texto a um objeto; na volta, JSON.stringify faz o texto e fs.writeFileSync grava no disco](images/e21-disco-texto-objeto.svg)
:::

O catálogo existe em três formas. O `gerar-catalogo.mjs` fez o caminho de baixo: objeto, texto, disco. O `relatorio-catalogo.mjs` faz o de cima: disco, texto, objeto. Só no objeto o `filter` e o `reduce` funcionam.

---

## :icon[file-search] O relatório: ler e filtrar

O começo de `scripts/relatorio-catalogo.mjs` junta tudo o que você viu:

```javascript
import fs from 'node:fs';
import path from 'node:path';

const arquivo = path.join(process.cwd(), 'src', 'data', 'catalogo.json');
const { categorias, produtos } = JSON.parse(fs.readFileSync(arquivo, 'utf-8'));

const opcao = process.argv.slice(2).find((a) => a.startsWith('--categoria='));
const filtro = opcao ? opcao.split('=')[1] : null;
const lista = filtro ? produtos.filter((p) => p.categoria === filtro) : produtos;

console.log(`Relatório do catálogo: ${filtro ? filtro : 'todas as categorias'}`);
console.log(`Produtos: ${lista.length}`);
```

No laboratório, você completa a contagem por categoria, o preço médio e os produtos sem imagem. Cada pergunta da dona da loja vira um `filter`, um `reduce` ou um `map` sobre a `lista`.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Rodar o script de dentro de `scripts/`: o `cwd` muda, o Node procura `scripts/src/data/...` e falha com `ENOENT`
- Salvar o script como `.js` e ver o erro ou o aviso de tipo de módulo: renomeie para `.mjs`
- Esquecer a extensão no `import` de um arquivo seu: no Node, é `'./produtos-antigos.mjs'`
- Vírgula sobrando ou aspas simples no JSON: o Metro e o `JSON.parse` acusam erro de sintaxe
- Usar `fs` ou `process.argv` numa tela: são do Node e não existem no celular
- Somar argumentos sem converter: `process.argv` só tem texto; use `Number`
:::

---

## Resumo

:::summary
- `node` sozinho abre o REPL; `node arquivo.mjs` roda um script do início ao fim
- Módulos ES usam `import` e `export`, como o app; o `.mjs` garante esse modo sem mexer no `package.json`
- `process.argv.slice(2)` traz os argumentos do comando, sempre como texto
- `path.join` monta caminhos para qualquer sistema e `fs.readFileSync` lê um arquivo como texto
- `JSON.parse` transforma texto em objeto e `JSON.stringify` faz o caminho inverso
:::

---

## :icon[flask-conical] No laboratório

O catálogo da Lojinha vira JSON e ganha um relatório no terminal.

:::steps
1. Com `git status` limpo, crie `scripts/` na raiz do `lojinha`
2. Gere `src/data/catalogo.json` com o `gerar-catalogo.mjs` e apague os temporários
3. Deixe o `produtos.js` só reexportando e confira no Expo Go que nada mudou
4. `scripts/relatorio-catalogo.mjs`: produtos por categoria, preço médio e sem imagem
5. Aceite o filtro opcional `--categoria=audio`; categoria inexistente lista as válidas e encerra com `process.exit(1)`
6. Esvazie uma `imagem` no JSON, confira o "sem imagem" e desfaça
7. Commit "E21: catálogo em JSON e relatório" e `git push`
:::

**Critérios de entrega**: app igual ao da v1, lendo o JSON; relatório certo com e sem filtro; nenhum `fs` dentro de `src/`. Entregue o link do repositório no sistema.
