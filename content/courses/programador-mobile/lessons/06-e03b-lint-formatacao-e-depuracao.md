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

## :icon[shield-check] Linter: o revisor que não cansa

Um **linter** lê o código sem executá-lo e aponta erros e riscos conhecidos. No JavaScript, o mais usado é o **ESLint**. Ele é ferramenta de quem programa, então entra em `devDependencies` (E02):

```bash
npm install -D eslint @eslint/js globals
```

| Pacote | O que traz |
|---|---|
| `eslint` | o programa que lê o código |
| `@eslint/js` | as regras recomendadas pela equipe do ESLint |
| `globals` | a lista do que já existe no Node, como `console` e `process` |

O linter não substitui o teste nem o depurador: ele pega **forma e regras**, não a lógica do negócio.

---

## :icon[settings] O eslint.config.js

Na raiz do projeto, o arquivo que diz ao ESLint o que conferir:

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

- É uma lista de blocos de configuração; cada bloco novo entra no fim da lista
- `js.configs.recommended` liga as regras recomendadas
- `globals.node` avisa que o código roda no Node. Sem esse bloco, o ESLint acusa `'console' is not defined` e `'process' is not defined` em todo script
- O arquivo usa `import` e `export`: o `"type": "module"` do E02 vale para ele também

---

## :icon[square-terminal] Rodando o lint

No `package.json`, crie o script `"lint": "eslint ."` e rode `npm run lint`. O `.` quer dizer o projeto inteiro; o `node_modules/` fica de fora sozinho.

```plaintext
C:\Users\ana\lojinha-regras\src\scripts\relatorio-catalogo.js
   2:8   error  'path' is defined but never used  no-unused-vars
  12:59  error  'categria' is not defined         no-undef

2 problems (2 errors, 0 warnings)
```

- Cada linha traz a posição (linha:coluna), a gravidade, a mensagem e o nome da regra
- O `categria` quebraria o relatório só quando alguém passasse uma categoria; o lint acha sem rodar nada
- Sem problemas, o comando não imprime nada além do nome do script

Com a extensão ESLint do E01, o editor sublinha o mesmo erro enquanto você digita, e o Error Lens escreve a mensagem na linha.

---

## :icon[list-checks] As regras recomendadas

São 64 regras, e cada uma aponta código que quase certamente está errado. Três aparecem logo:

| Regra | O que aponta | Exemplo no `lojinha-regras` |
|---|---|---|
| `no-undef` | um nome que não existe | `categria`, com erro de digitação |
| `no-unused-vars` | variável ou import que ninguém usa | `import path from 'node:path'` esquecido no topo |
| `no-dupe-keys` | a mesma chave duas vezes num objeto | `preco` repetido num produto: vale o último |

Toda saída tem a gravidade: **error** é quase certamente um bug; **warning** é um risco. A entrega do `lojinha-regras` pede zero dos dois.

Corrija a causa. Desligar a regra só esconde o problema, e ele volta na mão de quem usa o script.

---

## Pense

:::question
Rode o lint de cabeça. Quais problemas deste `src/scripts/livros.js` o `npm run lint` aponta, e qual passa sem aviso?

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

## :icon[wand] Prettier: formatação sem discussão

Um **formatador** reescreve o código num estilo fixo: aspas, ponto e vírgula, quebras de linha e recuo. O PR volta a discutir o que importa. No E02, o `npx prettier --check` reclamou do seu código porque o padrão dele é aspas duplas. Agora ele entra no projeto com o estilo do curso:

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
- Ponto e vírgula e recuo de 2 espaços já são o padrão

---

## :icon[file-check] Formatando o projeto

```bash
npx prettier --write .   # formata o projeto inteiro
npx prettier --check .   # só confere, sem mudar nada
```

- O primeiro `--write` reescreve o `produtos.js`: cada produto passava de 100 caracteres e ganha uma propriedade por linha
- Faça disso um commit só dele: misturada a uma correção, a formatação esconde a correção no diff
- Quem escreve o `catalogo.json` é o `npm run catalogo`. Deixe-o fora: crie o `.prettierignore` com a linha `src/data/catalogo.json`
- No `package.json`, um script para não decorar: `"formatar": "prettier --write ."`

Lint e Prettier se completam: o lint pega **erros**, o Prettier cuida da **aparência**.

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

E o `.vscode/settings.json`, que vale para quem abrir o projeto:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

Com os arquivos no repositório, cada <kbd>Ctrl</kbd> + <kbd>S</kbd> formata o arquivo, e a equipe inteira salva igual.

---

## :icon[bug] O depurador do VS Code

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

`somar` é uma **função**: o `reduce` a chama uma vez por produto, com o total até ali (funções a fundo no E07).

No painel do terminal, abra a seta ao lado do `+`, escolha **JavaScript Debug Terminal** (Terminal de Depuração JavaScript, no VS Code em português) e rode nele `node src/scripts/preco-medio.js`: o depurador se liga sozinho. Outro caminho é um `.vscode/launch.json` com `"program": "${file}"`, que faz o <kbd>F5</kbd> depurar o arquivo aberto.

---

## :icon[pause] Breakpoints: pausar e andar passo a passo

Clique à esquerda do número 7, a linha do `return`: o ponto vermelho é o **breakpoint**. Rode o script de novo: ali, o programa **para**, e você comanda pela barra do topo:

| Tecla | Botão | O que faz |
|---|---|---|
| <kbd>F5</kbd> | Continue | segue até o próximo breakpoint |
| <kbd>F10</kbd> | Step Over | roda a linha e para na próxima |
| <kbd>F11</kbd> | Step Into | entra na função chamada na linha |
| <kbd>Shift</kbd> + <kbd>F11</kbd> | Step Out | sai da função e volta a quem chamou |
| <kbd>Shift</kbd> + <kbd>F5</kbd> | Stop | encerra o script |

No DevTools do navegador, o Continue é <kbd>F8</kbd>.

---

## :icon[pause] Breakpoint condicional

O `somar` roda 12 vezes. Para não apertar <kbd>F5</kbd> a cada produto, clique com o botão direito no ponto vermelho, **Edit Breakpoint**, e escreva a condição `typeof produto.preco !== 'number'`:

:::center
![Animação: com o breakpoint condicional typeof produto.preco !== 'number' na linha do return de somar, o Fone Bluetooth (199.9) e a Luminária de Mesa (89.9) seguem direto e o script pausa na Garrafa Térmica, com o preço "79.90" em texto](images/e03-breakpoint-condicional.svg)
:::

O script só para quando a condição é verdadeira: os preços em número passam direto, e a pausa acontece na Garrafa Térmica.

---

## :icon[eye] Variables, Watch e Call Stack

Pausado na Garrafa, três painéis da aba **Run and Debug** contam a história:

| Painel | O que mostra | Na pausa em `somar` |
|---|---|---|
| **Variables** (Scope, no navegador) | as variáveis naquele instante | `total: 869.6` e, em `produto`, `preco: '79.90'`, entre aspas: é texto |
| **Watch** | expressões que você escolhe acompanhar | `typeof produto.preco` mostra `'string'` |
| **Call Stack** | quem chamou quem, do mais recente ao mais antigo | `somar` e, abaixo, a linha 10, a do `reduce` |

O erro veio do dado: o preço chegou entre aspas no `catalogo.json`, e o `npm run catalogo` o grava de novo.

:::tip
Pausado, o **Debug Console** avalia expressões do momento, como `Number(produto.preco)`.
:::

---

## Pratique

:::example Desafio
Com o catálogo corrigido, você quer saber qual produto faz a soma passar de R$ 1.000. Um colega pôs o breakpoint na linha 10, a do `reduce`, e o depurador parou uma vez só, antes de qualquer soma. Onde vai o breakpoint, e com qual condição?
:::

:::tip Resposta
Na linha 7, dentro de `somar`: ela roda uma vez por produto, enquanto a linha do `reduce` roda uma vez só. Condição: `total + produto.preco > 1000`. A primeira pausa mostra `total: 949.5` e, em `produto`, o Jogo de Panelas. Da linha 10, o <kbd>F11</kbd> também entraria em `somar`, mas no primeiro produto, e você teria de andar até o sexto.
:::

---

## :icon[terminal] console.log: o último recurso

O `console.log` funciona: a saída aparece no terminal. Mas ele custa caro:

- A cada nova suspeita, você edita, salva e roda de novo
- Mostra um valor por vez; o breakpoint mostra **todas** as variáveis e a pilha
- Esquecido no código, enche o terminal de quem usa o script

Um meio-termo é o **logpoint**: botão direito à esquerda da linha, **Add Logpoint**, e a mensagem `{produto.nome}: {produto.preco}`. A cada passagem, ele escreve no Debug Console, sem mudar o arquivo.

Se usar `console.log` para investigar, apague antes do commit: o `git diff` mostra se sobrou algum.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Escrever o `eslint.config.js` com `require` e `module.exports`: com `"type": "module"`, o Node recusa com `require is not defined in ES module scope`
- Esquecer o bloco do `globals.node`: `'console' is not defined` em todo script
- Desligar uma regra para sumir com o erro, em vez de corrigir a causa
- Misturar a formatação do projeto com uma correção no mesmo commit
- Rodar o script num terminal comum e esperar que o breakpoint pare: só o JavaScript Debug Terminal liga o depurador
- Achar que lint zerado é programa sem bug: ele não entende a regra de negócio
:::

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
