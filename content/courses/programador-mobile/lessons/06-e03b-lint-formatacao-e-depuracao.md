---
title: Lint, formatação e depuração
summary: ESLint e Prettier no lojinha-regras e breakpoints no VS Code para ver o que o código faz de verdade.
module: ambiente-js
duration_minutes: 45
objectives:
  - Configurar o ESLint com o eslint.config.js e corrigir o que ele aponta
  - Padronizar o código com Prettier, EditorConfig e formatação ao salvar
  - Depurar um script no VS Code com breakpoints, Variables, Watch e Call Stack
  - Reconhecer quando o console.log ainda vale a pena
---

# Lint, formatação e depuração

Programador Mobile · Encontro E03 · Aula 6 de 89

---

## O que você vai aprender

:::goal
- Instalar o ESLint e escrever o `eslint.config.js` do `lojinha-regras`
- Ler a saída do lint e corrigir o que ele aponta
- Formatar o código com Prettier, EditorConfig e formatação ao salvar
- Depurar um script no VS Code com breakpoints, passo a passo, Variables, Watch e Call Stack
- Deixar o `console.log` para quando o depurador não ajuda
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **linter** | um programa que lê o seu código sem rodar e aponta erros, como um corretor ortográfico |
| **formatador** | um programa que arruma a aparência do código (espaços, aspas, quebras de linha) sem mudar o que ele faz |
| **depurador** | uma ferramenta que pausa o programa numa linha para você olhar tudo por dentro |
| **breakpoint** | ponto de parada: a linha onde o depurador pausa o programa |
| **`devDependencies`** | os pacotes que só quem programa usa; o projeto funciona sem eles |

---

## A semana antes da entrega

O `lojinha-regras` vai para a revisão da equipe na segunda. Na sexta, três coisas acontecem:

- :icon[circle-x] `npm run relatorio casa` quebra com `ReferenceError: categria is not defined`. Sem categoria, o relatório roda, e ninguém tinha visto
- :icon[messages-square] O PR do colega tem 40 comentários, e 35 são sobre aspas e espaços
- :icon[bug] O `catalogo.json` foi editado à mão, e o relatório mostra `Preço médio: R$ NaN`

Cada problema tem a sua ferramenta: o **linter**, o **formatador** e o **depurador**. Hoje você liga as três no `lojinha-regras`.

:::question
Qual dos três problemas daria para achar sem nem rodar o script?
:::

---

## O linter

Como o corretor do celular acha a palavra errada antes de você enviar?

---

## :icon[shield-check] Linter: o revisor que não cansa

Um **linter** é o corretor ortográfico do código. Ele lê os arquivos **sem executá-los** e sublinha erros e riscos conhecidos: um nome digitado errado, um `import` que ninguém usa. No JavaScript, o mais usado é o **ESLint**.

O `categria` da sexta é um exemplo: o relatório só quebrava quando alguém passava uma categoria, mas o linter o acha sem rodar nada.

O linter não substitui o teste nem o depurador: ele pega **forma e regras**, não a lógica do negócio. Lint sem nenhum aviso não quer dizer programa sem bug.

---

## :icon[download] Instalando o ESLint

O ESLint é ferramenta de quem programa: o relatório funciona sem ele. Por isso, ele entra numa lista separada do `package.json`, a **`devDependencies`** (dependências de desenvolvimento). Quem instala assim é o `-D`:

```bash
npm install -D eslint @eslint/js globals
```

| Pacote | O que traz |
|---|---|
| `eslint` | o programa que lê o código |
| `@eslint/js` | as regras recomendadas pela equipe do ESLint |
| `globals` | a lista do que já existe no Node, como `console` e `process` |

Abra o `package.json`: os três aparecem em `"devDependencies"`, e o `picocolors` do E02 continua em `"dependencies"`.

---

## :icon[settings] O eslint.config.js

Na raiz do projeto, crie o arquivo que diz ao ESLint o que conferir:

```javascript
import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  js.configs.recommended,
  {
    languageOptions: {
      globals: globals.node,
    },
  },
]);
```

Ele é uma lista `[ ]` com dois blocos: as regras recomendadas e um objeto `{ }`, a ficha do E02, que diz onde o código roda.

---

## :icon[list-ordered] O eslint.config.js em português

| Linha | O que ela diz |
|---|---|
| os três `import` | "traga as regras recomendadas, a lista do Node e a ajuda para montar a configuração" |
| `export default defineConfig([ ... ])` | "esta é a configuração". O `export` a põe na vitrine para o ESLint |
| `js.configs.recommended` | "ligue as regras recomendadas" |
| `globals: globals.node` | "o código roda no Node: `console` e `process` existem" |

- Sem o bloco do `globals.node`, o ESLint acusa `'console' is not defined` e `'process' is not defined`
- Cada bloco novo entra no fim da lista
- O arquivo usa `import` e `export`: o `"type": "module"` do E02 vale para ele também

---

## :icon[square-terminal] Rodando o lint

No `package.json`, crie o script `"lint": "eslint ."`, o apelido do comando, e rode `npm run lint`. O `.` quer dizer o projeto inteiro; o `node_modules/` fica de fora sozinho.

```plaintext
C:\Users\ana\lojinha-regras\src\scripts\relatorio-catalogo.js
   2:8   error  'path' is defined but never used  no-unused-vars
  12:59  error  'categria' is not defined         no-undef

2 problems (2 errors, 0 warnings)
```

- Cada linha traz a posição (linha:coluna), a gravidade, a mensagem e o nome da regra
- *is defined but never used*: "foi criado e nunca usado". *is not defined*: "não existe"
- Sem problemas, o comando não imprime nada além do nome do script

---

## :icon[square-terminal] O lint na prática

**Caso 1: a mesma chave duas vezes.** Alguém repetiu o `preco` no fim da Garrafa Térmica, no `produtos.js`:

```plaintext
C:\Users\ana\lojinha-regras\src\data\produtos.js
  18:108  error  Duplicate key 'preco'  no-dupe-keys

1 problem (1 error, 0 warnings)
```

*Duplicate key* quer dizer "chave repetida": só o último preço vale.

**Caso 2: tudo certo.** Com o código limpo, o `npm run lint` só mostra o nome do script:

```plaintext
> lojinha-regras@1.0.0 lint
> eslint .
```

**Caso 3: no editor, enquanto você digita.** Com as extensões ESLint e Error Lens do E01, o nome errado ganha um sublinhado vermelho, e a mensagem aparece escrita no fim da própria linha, antes mesmo de salvar.

---

## :icon[list-checks] As regras recomendadas

São 64 regras, e cada uma aponta código que quase certamente está errado. Três aparecem logo:

| Regra | O que aponta | Exemplo no `lojinha-regras` |
|---|---|---|
| `no-undef` | um nome que não existe | `categria`, com erro de digitação |
| `no-unused-vars` | variável ou import que ninguém usa | `import path from 'node:path'` esquecido |
| `no-dupe-keys` | a mesma chave duas vezes num objeto | `preco` repetido num produto: vale o último |

A gravidade **error** é quase certamente um bug; **warning** (aviso) é um risco. A entrega pede zero dos dois.

Corrija a causa. Desligar a regra só esconde o problema, e ele volta na mão de quem usa o script.

---

## Pense

:::example Desafio
Rode o lint de cabeça. Quais problemas deste `src/scripts/livros.js` o `npm run lint` aponta, e qual passa sem aviso? O `filter` e o `reduce` são os do relatório do E02.

```javascript
import { produtos } from '../data/produtos.js';
import path from 'node:path';

const livros = produtos.filter((p) => p.categoria === 'livros');
const soma = livros.reduce((total, p) => total + p.preco, 0);

console.log('Livros:', livro.length);
console.log('Preço médio: R$', (soma / produtos.length).toFixed(2));
```
:::

:::tip Resposta
- `path` importado e sem uso: `no-unused-vars`
- `livro` não existe, o nome é `livros`: `no-undef`
- A média divide pelos 12 produtos do catálogo, e não pelos 3 livros: sai R$ 17.06 em vez de R$ 68.23. O código é válido, e nenhuma regra entende a conta. Isso é trabalho do depurador e dos testes (E04)
:::

---

## O formatador

Por que a escola pede o trabalho com a mesma fonte e a mesma margem?

---

## :icon[wand] Prettier: formatação sem discussão

Um **formatador** é como as normas de formatação de um trabalho escolar: mesma fonte e mesma margem para todo mundo. Ele reescreve a aparência do código (aspas, ponto e vírgula, quebras de linha e **recuo**, os espaços no começo da linha) e não muda o que o código faz. O PR volta a discutir o que importa.

O mais usado é o **Prettier**. O padrão dele é aspas duplas; no projeto, ele entra com o estilo do curso:

```bash
npm install -D prettier
```

O `.prettierrc`, na raiz:

```json
{
  "singleQuote": true,
  "printWidth": 100,
  "endOfLine": "auto"
}
```

- `singleQuote`: aspas simples; `printWidth`: linhas de até 100 caracteres
- `endOfLine`: no Windows, o Git troca o fim das linhas ao baixar os arquivos; com `auto`, o Prettier não reclama disso

---

## :icon[file-check] Formatando o projeto

```bash
npx prettier --write .   # formata o projeto inteiro
npx prettier --check .   # só confere, sem mudar nada
```

- O **`npx`** roda uma ferramenta instalada no projeto, sem precisar criar um script para ela no `package.json`
- Ponto e vírgula e recuo de 2 espaços já são o padrão
- O primeiro `--write` reescreve o `produtos.js`: cada produto passava de 100 caracteres e ganha uma propriedade por linha
- Faça disso um commit só dele: misturada a uma correção, a formatação esconde a correção no **diff**, a lista do que mudou
- Quem escreve o `catalogo.json` é o `npm run catalogo`. Deixe-o fora: crie o `.prettierignore` com a linha `src/data/catalogo.json`
- No `package.json`, um script para não decorar: `"formatar": "prettier --write ."`

Lint e Prettier se completam: o lint pega **erros**, o Prettier cuida da **aparência**.

---

## :icon[file-check] O Prettier na prática

**Caso 1: conferir antes de formatar.** O `--check` aponta o arquivo fora do estilo e não muda nada:

```plaintext
Checking formatting...
[warn] src/data/produtos.js
[warn] Code style issues found in the above file. Run Prettier with --write to fix.
```

*Code style issues*: "problemas de estilo; rode com `--write` para corrigir".

**Caso 2: formatar.** O `--write` lista cada arquivo. Um trecho da lista:

```plaintext
eslint.config.js 13ms (unchanged)
src/data/produtos.js 18ms
src/scripts/relatorio-catalogo.js 15ms (unchanged)
```

*unchanged* quer dizer "sem mudança": só o `produtos.js` foi reescrito.

**Caso 3: conferir depois.** É o que a entrega do laboratório pede:

```plaintext
Checking formatting...
All matched files use Prettier code style!
```

---

## :icon[save] EditorConfig e formatar ao salvar

O **EditorConfig** combina o básico entre editores: recuo, codificação e a linha em branco no fim. Instale a extensão **EditorConfig for VS Code**, ao lado do Prettier e do ESLint do E01. Na raiz, o `.editorconfig`:

```plaintext
root = true

[*]
indent_style = space
indent_size = 2
charset = utf-8
insert_final_newline = true
```

E o `.vscode/settings.json`, as configurações do VS Code que valem para quem abrir o projeto:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

Com os arquivos no repositório, cada <kbd>Ctrl</kbd> + <kbd>S</kbd> formata o arquivo, e a equipe inteira salva igual.

---

## O depurador

Num replay de futebol, para que serve a câmera lenta com pausa?

---

## :icon[bug] O depurador do VS Code

O **depurador** é uma câmera lenta com pausa: para o programa numa linha e mostra cada detalhe daquele instante, como o valor de cada variável.

O relatório mostra `R$ NaN`. Para ver a soma produto a produto, separe a conta numa função, em `src/scripts/preco-medio.js`:

```javascript
import fs from 'node:fs';

const texto = fs.readFileSync('src/data/catalogo.json', 'utf-8');
const produtos = JSON.parse(texto).produtos;

function somar(total, produto) {
  return total + produto.preco;
}

const soma = produtos.reduce(somar, 0);
const media = soma / produtos.length;
console.log('Preço médio: R$', media.toFixed(2));
```

---

## :icon[list-ordered] O preco-medio.js em português

| Linha | O que ela diz |
|---|---|
| 3 e 4 | "leia o `catalogo.json` e fique com a lista de produtos" |
| 6, `function somar(total, produto)` | "esta é a receita `somar`: recebe o total até ali e um produto" |
| 7, `return total + produto.preco` | "entregue o total mais o preço deste produto" |
| 10, `produtos.reduce(somar, 0)` | "comece do 0 e use a `somar` com cada produto, um por vez" |
| 11 e 12 | "divida pela quantidade e mostre com 2 casas" |

`somar` é uma **função**: uma receita com nome, guardada para usar quando quiser. Hoje é só para ler; escrever funções vem no E07, e o `reduce` a fundo, no E09.

---

## :icon[square-terminal] Ligando o depurador

No painel do terminal, abra a seta ao lado do `+` e escolha **JavaScript Debug Terminal** (Terminal de Depuração JavaScript, no VS Code em português). Rode nele:

```bash
node src/scripts/preco-medio.js
```

O depurador se liga sozinho.

:::warning
Num terminal comum, o script roda sem parar em lugar nenhum: só o JavaScript Debug Terminal liga o depurador.
:::

Outro caminho é um `.vscode/launch.json` com `"program": "${file}"`, que faz o <kbd>F5</kbd> depurar o arquivo aberto.

---

## :icon[bug] O depurador na prática

**Caso 1: num terminal comum.** O script roda até o fim, sem pausa:

```bash
node src/scripts/preco-medio.js
# Preço médio: R$ 181.98
```

**Caso 2: no JavaScript Debug Terminal.** O mesmo comando, com o depurador ligado. Sem nenhum breakpoint, ele também vai até o fim:

```plaintext
Debugger attached.
Preço médio: R$ 181.98
Waiting for the debugger to disconnect...
```

As duas linhas novas dizem "depurador ligado" e "esperando o depurador se desligar".

**Caso 3: o mistério.** No `catalogo.json`, o preço da Garrafa Térmica foi escrito entre aspas: `"79.90"`. O script não quebra, mas a conta sai errada:

```plaintext
Preço médio: R$ NaN
```

`NaN` (*Not a Number*) quer dizer "não é um número". Para achar o culpado, o filme precisa pausar.

---

## Breakpoints

Onde você aperta o pause para ver o lance que importa?

---

## :icon[pause] Breakpoints: pausar e andar passo a passo

O **breakpoint** (ponto de parada) é onde o filme pausa. Clique à esquerda do número 7, a linha do `return`, e rode de novo: o programa **para** no ponto vermelho. Comande pela barra do topo:

| Tecla | Botão | O que faz |
|---|---|---|
| <kbd>F5</kbd> | Continue (continuar) | segue até a próxima pausa |
| <kbd>F10</kbd> | Step Over (passar por cima) | roda a linha e para na próxima |
| <kbd>F11</kbd> | Step Into (entrar) | entra na função da linha |
| <kbd>Shift</kbd> + <kbd>F11</kbd> | Step Out (sair) | volta a quem chamou a função |
| <kbd>Shift</kbd> + <kbd>F5</kbd> | Stop (parar) | encerra |

No DevTools do navegador, o Continue é <kbd>F8</kbd>.

---

## :icon[pause] Breakpoints na prática

**Caso 1: pausar a cada produto.** Breakpoint na linha 7, a do `return`. Cada <kbd>F5</kbd> segue até a próxima pausa, um produto por vez. Em Variables:

| Pausa | `produto.nome` | `total` |
|---|---|---|
| 1ª | Fone Bluetooth | 0 |
| 2ª | Caixa de Som Portátil | 199.9 |
| 3ª | Microfone USB | 449.8 |

**Caso 2: entrar na função.** Breakpoint na linha 10, a do `reduce`. O <kbd>F11</kbd> (Step Into) entra em `somar`, com `total: 0` e o Fone Bluetooth.

**Caso 3: passar por cima.** Com o catálogo certo, na mesma pausa da linha 10, o <kbd>F10</kbd> (Step Over) roda o `reduce` inteiro e para na linha 11, com `soma: 2183.8000000000006`. Esse monte de casas é assunto do E05.

---

## :icon[pause] Breakpoint condicional

O `somar` roda 12 vezes. Um **breakpoint condicional** pausa só na cena que interessa. Clique com o botão direito no ponto vermelho, **Edit Breakpoint**, e escreva a condição `typeof produto.preco !== 'number'`, que quer dizer "o preço não é um número":

:::center
![Animação: com o breakpoint condicional typeof produto.preco !== 'number' na linha do return de somar, o Fone Bluetooth (199.9) e a Luminária de Mesa (89.9) seguem direto e o script pausa na Garrafa Térmica, com o preço "79.90" em texto](images/e03-breakpoint-condicional.svg)
:::

O script só para quando a condição é verdadeira: os preços em número passam direto, e a pausa acontece na Garrafa Térmica. O `typeof` pergunta o tipo de um valor (E05).

---

## Os painéis

Com o vídeo pausado, o que você olha primeiro?

---

## :icon[eye] Variables, Watch e Call Stack

Com o filme pausado na Garrafa, três painéis da aba **Run and Debug** mostram a cena por dentro:

| Painel | O que mostra | Na pausa em `somar` |
|---|---|---|
| **Variables** (variáveis; Scope, no navegador) | as variáveis naquele instante | `total: 869.6` e, em `produto`, `preco: '79.90'`: texto |
| **Watch** (vigiar) | o que você escolhe acompanhar | `typeof produto.preco` mostra `'string'` |
| **Call Stack** (pilha de chamadas) | quem chamou quem, do mais novo ao mais antigo | `somar` e, abaixo, a linha 10, do `reduce` |

O erro veio do dado: o preço chegou como texto no `catalogo.json`. O `npm run catalogo` o grava de novo.

:::tip
No **Debug Console**, teste expressões na pausa: `Number(produto.preco)`.
:::

---

## :icon[eye] Os painéis na prática

**Caso 1: o Watch acompanha.** Escreva `produto.nome` e `total` no Watch: a cada pausa, os dois se atualizam sozinhos.

**Caso 2: o Debug Console testa uma ideia.** Pausado na Garrafa Térmica:

| Você digita | O Debug Console responde |
|---|---|
| `typeof produto.preco` | `'string'` |
| `Number(produto.preco)` | `79.9` |
| `total + Number(produto.preco)` | `949.5` |

Com o preço convertido em número, a conta daria certo: o problema é o dado.

**Caso 3: a Call Stack mostra quem chamou.** Clique na linha de baixo da Call Stack: o editor pula para a linha 10, a do `reduce`, que chamou o `somar`.

---

## Pratique

:::example Desafio
Com o catálogo corrigido, você quer saber qual produto faz a soma passar de R$ 1.000. Um colega pôs o breakpoint na linha 10, a do `reduce`, e o depurador parou uma vez só, antes de qualquer soma. Onde vai o breakpoint, e com qual condição?

```javascript
import fs from 'node:fs';

const texto = fs.readFileSync('src/data/catalogo.json', 'utf-8');
const produtos = JSON.parse(texto).produtos;

function somar(total, produto) {
  return total + produto.preco;
}

const soma = produtos.reduce(somar, 0);
const media = soma / produtos.length;
console.log('Preço médio: R$', media.toFixed(2));
```
:::

:::tip Resposta
Na linha 7, dentro de `somar`: ela roda uma vez por produto, enquanto a linha do `reduce` roda uma vez só. Condição: `total + produto.preco > 1000`. A primeira pausa mostra `total: 949.5` e, em `produto`, o Jogo de Panelas. Da linha 10, o <kbd>F11</kbd> também entraria em `somar`, mas no primeiro produto, e você teria de andar até o sexto.
:::

---

## O console.log

Quantas vezes você rodaria o script para ver doze preços, um de cada vez?

---

## :icon[terminal] console.log: o último recurso

O `console.log` do E02 também serve para investigar: você escreve um valor na tela e roda o script de novo. Funciona, mas custa caro:

- A cada nova suspeita, você edita, salva e roda de novo
- Mostra um valor por vez; o breakpoint mostra **todas** as variáveis e a pilha
- Esquecido no código, enche o terminal de quem usa o script

Um meio-termo é o **logpoint**, um ponto que escreve sem pausar: botão direito à esquerda da linha, **Add Logpoint**, e a mensagem `{produto.nome}: {produto.preco}`. A cada passagem, ele escreve no Debug Console, sem mudar o arquivo.

Se usar `console.log` para investigar, apague antes do commit: o `git diff` mostra se sobrou algum.

---

## :icon[terminal] O console.log na prática

**Caso 1: um console.log dentro de `somar`.** Uma linha antes do `return`, e o script de novo:

```javascript
function somar(total, produto) {
  console.log(produto.nome, produto.preco);
  return total + produto.preco;
}
```

```plaintext
Fone Bluetooth 199.9
Caixa de Som Portátil 249.9
Microfone USB 329.9
```

E mais 9 linhas, uma por produto, antes da média.

**Caso 2: o logpoint, sem mexer no arquivo.** Na linha 7, com a mensagem `{produto.nome}: {produto.preco}`, ele escreve no Debug Console `Fone Bluetooth: 199.9`, e assim por diante.

**Caso 3: o console.log esquecido.** Antes do commit, o `git diff` mostra a linha que sobrou, com `+` na frente:

```plaintext
+  console.log(produto.nome, produto.preco);
```

---

## Mensagens de erro

O ESLint também acende luzes no painel. Você sabe ler cada uma?

---

## :icon[siren] Quando aparece um erro

A mensagem de erro é a luz do painel do carro: diz o que aconteceu e onde.

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `'console' is not defined` | o ESLint não sabe que é Node | o bloco do `globals.node` |
| `require is not defined in ES module scope` | configuração com `require` e `module.exports` | `import` e `export default` |
| `couldn't find an eslint.config` | arquivo com outro nome ou fora da raiz | `eslint.config.js` na raiz |
| `is defined but never used` | algo criado e nunca usado | apagar o que sobrou |
| `is not defined` num nome seu | nome digitado errado | conferir a grafia |

---

## Resumo

:::summary
- O ESLint aponta erros sem executar o código; o `eslint.config.js` liga as regras recomendadas e os globais do Node
- `npm run lint` mostra arquivo, posição, mensagem e regra: corrija a causa, não desligue a regra
- Prettier com `.prettierrc`, EditorConfig e formatar ao salvar acabam com a discussão de estilo
- No JavaScript Debug Terminal, breakpoints, passo a passo, Variables, Watch e Call Stack mostram o que o código faz de verdade
- `console.log` é o último recurso, e não vai para o commit
:::

---

## :icon[flask-conical] No laboratório

Em dupla, cada um revisando o repositório do outro.

:::steps
1. Issue "Relatório com categoria em maiúscula mostra R$ NaN" e branch `fix/categoria-maiuscula`
2. Prove a causa com o breakpoint condicional `lista.length === 0` na linha da `media`
3. `categoria.toLowerCase()` no filtro; PR com `Closes #1`, revisão e merge
4. Branch `chore/qualidade`: ESLint com `globals.node` e o script `lint`
5. Prettier, `.prettierignore` e EditorConfig; commit "E03: lint e formatação" e outro só da formatação
6. PR, revisão e merge
7. Um conflito em dupla no preço do Fone Bluetooth
:::

**Critérios**: `npm run relatorio Audio` mostra 3 produtos; `npm run lint` e `npx prettier --check .` sem problemas; dois PRs revisados, Issue fechada e nenhuma marca de conflito. Entregue o link do repositório no sistema.

---

## :icon[milestone] Projeto 1 · Etapa 2: GitHub, lint e formatação

No seu `racha-conta`:

- `git init`, `.gitignore` e o commit `Projeto 1: etapa 1, projeto npm e leitura da conta`
- repositório público `racha-conta` no GitHub e `git push`
- `README.md` com o que o projeto faz e como rodar
- ESLint e Prettier como no laboratório, com os scripts `lint` e `formatar`
- `npm run lint` e `npx prettier --check .` sem problemas

Commit: `Projeto 1: etapa 2, GitHub, lint e formatação`. Enunciado completo e entrega: página do curso, em **Projetos**.
