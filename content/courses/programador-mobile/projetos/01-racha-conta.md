---
title: "Projeto 1 · Racha-conta"
summary: Divida a conta do restaurante entre amigos, no terminal e no navegador, em centavos e com testes, sem perder nenhum centavo.
section: Módulo Básico
module: linguagem-js
opens: e02a-node-na-pratica
due: e08a-arrays-essenciais
due_label: início do E08
passing_score: 70
required: true
rubric:
  - key: regras
    title: Regras da conta
    points: 35
    description: "As funções de src/regras/conta.js dão o resultado certo, em centavos: gorjeta arredondada ao centavo (10% por padrão), divisão em partes que sempre somam o total, com a sobra nas primeiras pessoas, leitura do valor e das pessoas digitados e recibo com data e hora."
  - key: testes
    title: Testes
    points: 20
    description: "`npm test` verde, com testes para cada função pública e para as bordas: gorjeta de 0%, sobra de centavos, uma pessoa, valores e pessoas inválidos e data fixa, nunca a de hoje."
  - key: terminal-e-web
    title: Recibo no terminal e interface web
    points: 20
    description: "`npm run racha` imprime o recibo da conta de exemplo; com valor e pessoas no comando, imprime o recibo deles; entrada inválida mostra um aviso. A interface web em web/ divide a conta com as suas funções."
  - key: qualidade
    title: Qualidade do código
    points: 10
    description: "`npm run verificar` sem erros e `npx prettier --check .` limpo. Regras puras em src/regras/, sem console.log e sem fs; o que imprime fica no script. Nomes que dizem o que guardam."
  - key: entrega
    title: Repositório, commits e README
    points: 15
    description: "Repositório público racha-conta no GitHub, com um commit por etapa (as 6, com o nome de cada uma) e um README que explica o projeto, como rodar no terminal e na web, com um print da interface."
steps:
  - lesson: e02b-npm-e-package-json
    when: E02
    title: Projeto npm e a conta no terminal
    summary: "package.json com type module, src/data/conta.json e npm run racha mostrando os itens da conta."
  - lesson: e03b-lint-formatacao-e-depuracao
    when: E03
    title: GitHub, README, lint e formatação
    summary: "Repositório público racha-conta, .gitignore, README, ESLint e Prettier, com o commit da etapa 1 e o da etapa 2."
  - lesson: e04b-automacao-e-integracao-continua
    when: E04
    title: O primeiro teste
    summary: "calcularGorjeta nascida de um teste vermelho, com Jest, test.each e o script verificar."
  - lesson: e05b-operadores-e-dinheiro
    when: E05
    title: Centavos, gorjeta e reais
    summary: "paraCentavos, calcularGorjeta em centavos e formatarReais, com testes; npm run racha 187.5 mostra subtotal, gorjeta e total."
  - lesson: e06b-datas-numeros-e-json
    when: E06
    title: Valor digitado e data do recibo
    summary: "lerValor e lerPessoas com expressões regulares e formatarDataHora, com testes de data fixa."
  - lesson: e07b-funcoes-e-parametros
    when: E07
    title: Divisão, recibo e interface web
    summary: "somarItens e dividirConta com for e if, montarRecibo pura, o script com avisos e a interface web ligada."
---

## O que você vai construir

Fim do jantar, a conta chega: R$ 187,50, mais 10% de gorjeta, para 4 pessoas. Alguém abre a calculadora, divide e diz "dá 51,5625". Ninguém paga 51,5625. Se todo mundo arredonda para 51,56, falta um centavo; se arredonda para 51,57, sobra. O **racha-conta** resolve isso: soma os itens, calcula a gorjeta e divide o total em partes que **sempre fecham a conta**, com o centavo que sobra na primeira pessoa.

Você constrói o projeto ao longo do Ambiente JavaScript e do começo da Linguagem JavaScript, em 6 etapas pequenas, uma por encontro, do E02 ao E07. Cada etapa usa só o que o encontro dela ensinou. No fim, o mesmo código roda em três lugares: nos testes do Jest, no terminal e numa página web.

No terminal, `npm run racha` lê a conta de exemplo e imprime o recibo:

```plaintext
Cantina Bella Nonna
28/10/2026 19:42
Subtotal: R$ 187,50
Gorjeta (10%): R$ 18,75
Total: R$ 206,25
Pessoa 1: R$ 51,57
Pessoa 2: R$ 51,56
Pessoa 3: R$ 51,56
Pessoa 4: R$ 51,56
```

No navegador, a **interface web pronta** do curso mostra um formulário (restaurante, valor da conta, pessoas e gorjeta), a parte de cada pessoa, a conferência "as partes somam o total" e o recibo para copiar. A página não faz conta nenhuma: ela importa as **suas** funções de `src/regras/conta.js`. Por isso os nomes e as assinaturas abaixo são combinados e não podem mudar.

O repositório, no fim:

```plaintext
racha-conta/
├── src/
│   ├── data/conta.json        a conta de exemplo
│   ├── regras/conta.js        as regras, puras e testadas
│   ├── regras/conta.test.js   os testes
│   └── scripts/racha.js       o recibo no terminal
├── web/                       a interface pronta do curso (E07)
├── eslint.config.js, .prettierrc, babel.config.json
├── package.json, package-lock.json, .gitignore
└── README.md
```

O projeto é individual e é **seu**: um repositório próprio, separado do `lojinha-regras`. Ele usa as mesmas ideias do laboratório num assunto diferente; copiar código do laboratório não ajuda, porque as regras aqui são outras.

## As funções combinadas

Todas ficam em `src/regras/conta.js`, com `export`. Dinheiro entra e sai em **centavos inteiros**. Reais só aparecem nos preços do `conta.json` (que `paraCentavos` e `somarItens` convertem), no que alguém digita (`lerValor`) e na hora de mostrar (`formatarReais`).

| Função | Devolve | Etapa |
|---|---|---|
| `calcularGorjeta(subtotal, percentual = 10)` | a gorjeta, em centavos | E04, muda no E05 e no E07 |
| `paraCentavos(reais)` | os centavos de um valor em reais | E05 |
| `formatarReais(centavos)` | o texto em reais: `'R$ 187,50'` | E05 |
| `lerValor(texto)` | os centavos do valor digitado, ou `null` | E06 |
| `lerPessoas(texto)` | o número de pessoas, de 1 a 50, ou `null` | E06 |
| `formatarDataHora(data)` | o texto `'28/10/2026 19:42'` | E06 |
| `somarItens(itens)` | a soma dos itens, em centavos | E07 |
| `dividirConta(total, pessoas)` | uma lista com a parte de cada pessoa, em centavos | E07 |
| `montarRecibo(dados)` | o recibo inteiro, num texto com uma linha por informação | E07 |

Exemplos de uso, que viram testes:

```javascript
calcularGorjeta(18750, 10); // 1875
calcularGorjeta(18750); // 1875: sem o percentual, 10% (E07)
formatarReais(18750); // 'R$\u00a0187,50', com o espaço que não quebra
lerValor('R$ 187,50'); // 18750
lerValor('abc'); // null
lerPessoas('4'); // 4
dividirConta(10000, 3); // [3334, 3333, 3333]
```

A interface web usa sete delas: `lerValor`, `lerPessoas`, `calcularGorjeta`, `dividirConta`, `formatarReais`, `formatarDataHora` e `montarRecibo`. Com um nome diferente, mesmo numa letra, a página avisa que não encontrou a função.

## Regras

### Dinheiro em centavos

O `number` do JavaScript não guarda decimais com exatidão (E05): 15% de R$ 33,30 em reais dá `4.994999999999999`, e o arredondamento cai para o lado errado. Em centavos, a conta é exata. Converta uma vez, na entrada, com `Math.round(reais * 100)`.

### Gorjeta

A gorjeta é um percentual do subtotal, **10% por padrão**, e pode ser zero ("sem gorjeta"). O resultado é arredondado ao centavo, com o meio centavo subindo:

| Subtotal | Percentual | Gorjeta |
|---|---|---|
| R$ 187,50 | 10 | R$ 18,75 |
| R$ 33,30 | 15 | R$ 5,00 (a conta exata é 4,995) |
| R$ 187,55 | 10 | R$ 18,76 (18,755 sobe) |
| R$ 80,00 | 0 | R$ 0,00 |

O total da conta é o subtotal mais a gorjeta.

### Divisão que sempre fecha

Cada pessoa paga a parte inteira da divisão, em centavos. Os centavos que **sobram** vão, um a um, para as **primeiras** pessoas. Assim as partes diferem em no máximo 1 centavo e a soma é sempre o total.

| Total | Pessoas | Partes |
|---|---|---|
| R$ 100,00 | 3 | 33,34 + 33,33 + 33,33 |
| R$ 206,25 | 4 | 51,57 + 51,56 + 51,56 + 51,56 |
| R$ 110,00 | 3 | 36,67 + 36,67 + 36,66 |
| R$ 90,00 | 1 | 90,00 |
| R$ 0,02 | 3 | 0,01 + 0,01 + 0,00 |

### O que a pessoa digita

O valor da conta chega como texto, do jeito que se escreve no Brasil. `lerValor` devolve os centavos ou `null`:

| Aceita | Vira | Recusa (`null`) |
|---|---|---|
| `'187,50'` | 18750 | `''` (vazio) e `'abc'` |
| `'R$ 187,50'` e `'R$187,50'` | 18750 | `'0'` e `'0,00'`: conta precisa ser positiva |
| `'  187,5 '`, com espaços | 18750 | `'-10'` |
| `'187.50'`, com ponto | 18750 | `'187,505'`: três casas |
| `'187'` | 18700 | `'1.250,00'`: milhar com ponto (veja "Para ir além") |

O número de pessoas também chega como texto. `lerPessoas` aceita um **inteiro de 1 a 50** (`'4'`, `' 4 '`, `'1'`, `'50'`) e devolve `null` para o resto (`''`, `'0'`, `'51'`, `'2,5'`, `'-3'`, `'três'`).

### Recibo

O recibo tem, nesta ordem: o restaurante, a data e a hora (`'28/10/2026 19:42'`, com zero à esquerda: `'05/03/2026 09:07'`), o subtotal, a gorjeta com o percentual, o total e uma linha por pessoa. Todos os valores em reais, com `formatarReais`. A data entra por parâmetro: o script passa `new Date()`, e o teste passa uma data fixa.

## Etapas

Cada etapa termina com um **commit** cujo nome começa por `Projeto 1: etapa N`. Pode haver outros commits no meio; o da etapa marca o ponto em que ela ficou pronta. Comece cada etapa no encontro (o slide "Projeto 1" fica no fim da segunda aula) e termine em casa: cada uma cabe em cerca de uma hora.

### Etapa 1 · E02: projeto npm e a conta no terminal

O que fazer:

1. Crie a pasta `racha-conta` na sua pasta de projetos, ao lado do `lojinha-regras` e nunca dentro dele, e abra no VS Code (`code .`)
2. `npm init -y`; no `package.json`, `"type": "module"` e uma `description`
3. Crie `src/data/conta.json` com a conta abaixo, ou com a da sua última ida a um restaurante: pelo menos 4 itens, preço em reais com ponto
4. Crie `src/scripts/racha.js`: leia o JSON com `fs.readFileSync` e `JSON.parse` e mostre o nome do restaurante, as pessoas, quantos itens a conta tem e a lista dos itens
5. No `package.json`, o script `"racha": "node src/scripts/racha.js"`

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

Para a lista, `console.log(conta.itens)` funciona: ele mostra a lista inteira.

Pronto quando `npm run racha` mostra algo assim:

```plaintext
Racha-conta: Cantina Bella Nonna
Pessoas na mesa: 4
Itens na conta: 4
┌─────────┬───────────────────────────┬────────────┬───────┐
│ (index) │ descricao                 │ quantidade │ preco │
├─────────┼───────────────────────────┼────────────┼───────┤
│ 0       │ 'Pizza grande marguerita' │ 1          │ 72.9  │
...
```

Ainda não há Git: guarde a pasta. O commit desta etapa é o primeiro do E03.

### Etapa 2 · E03: GitHub, README, lint e formatação

O que fazer:

1. `git init` e o `.gitignore` com `node_modules/`, criado pelo VS Code
2. Commit `Projeto 1: etapa 1, projeto npm e leitura da conta`
3. No GitHub, o repositório **público** `racha-conta`, sem README; `git remote add`, `git push -u origin main`
4. `README.md` com o nome, uma frase sobre o projeto e a seção "Como rodar" (`npm install` e `npm run racha`)
5. ESLint como no laboratório: `eslint.config.js` com as regras recomendadas e o `globals.node`, e o script `lint`
6. Prettier com o mesmo `.prettierrc` do laboratório e o script `formatar`
7. Commit `Projeto 1: etapa 2, GitHub, lint e formatação` e `git push`

Pronto quando: o repositório abre no GitHub sem `node_modules/`, `npm run lint` não acusa nada e `npx prettier --check .` diz que todos os arquivos estão no estilo.

No projeto você trabalha sozinho e pode fazer commit direto na `main`. Branch e Pull Request, como no laboratório, são um bom treino, mas não valem ponto.

### Etapa 3 · E04: o primeiro teste

A primeira regra nasce de um teste vermelho, como o `boasVindas` da aula 7.

1. Jest e Babel como no laboratório: `npm i -D jest babel-jest @babel/preset-env`, o `babel.config.json` e `"test": "jest"`
2. **Primeiro o teste**: em `src/regras/conta.test.js`, um teste para `calcularGorjeta(100, 10)`, esperando `10`. Rode `npm test` e veja o vermelho: a função ainda não existe
3. Em `src/regras/conta.js`, `calcularGorjeta(subtotal, percentual)`, com `export`, por enquanto **em reais**: devolve `percentual` por cento do `subtotal`. Verde
4. Mais casos numa tabela do `test.each`: `187.5` com 10 dá `18.75`, `50` com 15 dá `7.5` e `80` com 0 dá `0`
5. O bloco do `globals.jest` no `eslint.config.js`, o script `verificar` e `coverage/` no `.gitignore`
6. Commit `Projeto 1: etapa 3, primeiro teste`

:::tip Para pensar
Acrescente um teste com `calcularGorjeta(33.3, 15)` esperando `4.995` e rode. O Jest mostra `Received: 4.994999999999999`. Apague esse teste antes do commit e anote o número: o E05 explica e resolve.
:::

Pronto quando `npm run verificar` passa, com pelo menos 4 casos verdes.

### Etapa 4 · E05: centavos, gorjeta e reais

1. `paraCentavos(reais)`: `187.5` vira `18750` e `0.1 + 0.2` vira `30`
2. `calcularGorjeta` passa a receber e devolver **centavos**, arredondando com `Math.round`. Mude os testes primeiro e veja o vermelho: `18750` com 10 dá `1875`, `3330` com 15 dá `500`, `18755` com 10 dá `1876` e `8000` com 0 dá `0`
3. `formatarReais(centavos)`: `18750` vira `'R$ 187,50'`, `5` vira `'R$ 0,05'` e `123456` vira `'R$ 1.234,56'`. No teste, escreva o espaço depois do `R$` como `\u00a0`, como no `formatarPreco` da aula 9
4. No `racha.js`, o valor da conta vem do comando, em reais: `npm run racha 187.5`. Converta com `Number` e `paraCentavos`, use o percentual de `conta.gorjeta` e imprima subtotal, gorjeta e total com `formatarReais`
5. Commit `Projeto 1: etapa 4, centavos, gorjeta e reais`

Somar os itens do `conta.json` pede um laço, que chega no E07. Até lá, o valor da conta vem do comando.

Pronto quando `npm run racha 187.5` termina com:

```plaintext
Subtotal: R$ 187,50
Gorjeta (10%): R$ 18,75
Total: R$ 206,25
```

### Etapa 5 · E06: valor digitado e data do recibo

1. `lerValor(texto)`, com as regras da tabela "O que a pessoa digita". Um caminho: `trim`, tirar o `R$` com `replace`, trocar a vírgula por ponto, conferir o formato com uma expressão regular e `test` e converter com `paraCentavos`. O ternário do E05 escolhe entre os centavos e `null`. Na regex, o `$` do `R$` precisa de barra, como o ponto: `R\$`
2. `lerPessoas(texto)`: inteiro de 1 a 50, ou `null`
3. `formatarDataHora(data)`: `'28/10/2026 19:42'`, montado com `getDate`, `getMonth`, `getFullYear`, `getHours`, `getMinutes` e o `padStart` da aula 11. Lembre: o mês começa em 0
4. Testes com `test.each` para cada função: pelo menos 5 textos aceitos e 5 recusados no `lerValor`, as bordas 1 e 50 e três recusados no `lerPessoas` e duas datas **fixas** no `formatarDataHora`, uma com zeros à esquerda
5. No `racha.js`, o valor passa por `lerValor`: `npm run racha "R$ 187,50"`. O recibo ganha o restaurante e a data e a hora de agora
6. Commit `Projeto 1: etapa 5, valor digitado e data do recibo`

Pronto quando `npm run racha "R$ 187,50"` e `npm run racha 187,50` mostram o mesmo subtotal, e `npm run verificar` passa. As aspas são necessárias quando o valor tem espaço.

### Etapa 6 · E07: divisão, recibo e interface web

1. `somarItens(itens)`: um `for...of` com acumulador soma `quantidade` vezes o preço em centavos. A conta de exemplo dá `18750`; a lista vazia dá `0`
2. `dividirConta(total, pessoas)`: um `for` monta a lista das partes, e um `if` decide quem leva um centavo a mais. Os casos da tabela "Divisão que sempre fecha" viram testes, mais um que soma as partes e confere o total
3. `calcularGorjeta` ganha o valor padrão: sem o percentual, 10%
4. `montarRecibo(dados)`: **regra pura**, que devolve o recibo como texto em vez de imprimir. `dados` é um objeto com `restaurante`, `subtotal`, `percentual`, `pessoas` e `data`. Monte as linhas numa lista com `push` e junte com `join('\n')`. As linhas que o script imprimia com `console.log` passam a morar aqui
5. O `racha.js` final: sem argumentos, usa os itens e as pessoas do `conta.json`; com argumentos (`npm run racha "R$ 100,00" 3`), usa o que foi digitado. Valor ou pessoas inválidos: um aviso no lugar do recibo, decidido com `if` e `else`
6. A interface web (veja abaixo)
7. No README: como rodar no terminal e na web, e um print da interface
8. Commit `Projeto 1: etapa 6, divisão, recibo e interface web`, `git push` e a entrega

Pronto quando `npm run racha` imprime o recibo da conta de exemplo, `npm run racha "R$ 100,00" 3` divide R$ 110,00 (com os 10% do `conta.json`) em 36,67 + 36,67 + 36,66, `npm run racha abc` mostra o aviso e a página web divide a conta.

#### A interface web

1. Baixe [interface-web.zip](materiais/projeto-1/interface-web.zip) e descompacte. Copie os três arquivos (`index.html`, `estilo.css` e `tela.js`) para uma pasta `web/` na raiz do repositório. Não mude nada neles
2. O `tela.js` roda no navegador e já avisa o ESLint disso, num comentário `/* global ... */` no topo: o `npm run lint` passa sem mudar o `eslint.config.js`. Não acrescente o `globals.browser` para a pasta `web/`: com ele, o ESLint acusa os mesmos nomes como declarados duas vezes
3. Na raiz do repositório, `npx serve .` e abra `http://localhost:3000/web/` no navegador
4. A lista "Funções que a página usa" mostra o que foi encontrado. Se uma conta sair errada, a página diz qual função e com qual entrada: escreva um teste com ela e corrija

Aberta com dois cliques no arquivo, a página não funciona: o navegador só importa módulos de um servidor. Para parar o servidor, <kbd>Ctrl</kbd> + <kbd>C</kbd> no terminal.

## Como entregar

1. Repositório **público** `racha-conta` no seu GitHub, com tudo enviado (`git push`)
2. Um commit por etapa, com o nome da etapa, na ordem: `Projeto 1: etapa 1, ...` até `Projeto 1: etapa 6, ...`
3. README com o que o projeto faz, como rodar no terminal e na web e um print da interface (a imagem fica no repositório, numa pasta `docs/`, por exemplo)
4. Na página deste projeto, cole o link do repositório (`https://github.com/seu-usuario/racha-conta`) e envie
5. Prazo: **início do E08**

Antes de enviar, rode na raiz, nesta ordem: `npm run verificar`, `npx prettier --check .`, `npm run racha` e `npm run racha abc`. Depois, abra a interface web e divida uma conta. O instrutor corrige pela rubrica, critério por critério, e pode devolver o projeto para ajustes antes da nota final. A aprovação é com 70 pontos.

## Como será avaliado

| Critério | Pontos | Nota cheia | Nota parcial |
|---|---|---|---|
| Regras da conta | 35 | todas as tabelas das Regras dão o resultado certo | a divisão perde ou sobra centavo, ou `lerValor` aceita `'abc'` |
| Testes | 20 | um teste por função pública e as bordas de cada uma | só o caminho feliz, ou um teste que usa a data de hoje |
| Recibo no terminal e interface web | 20 | os três comandos do "Pronto quando" da etapa 6 e a página funcionando | o script quebra com argumento inválido, ou a página avisa que falta uma função |
| Qualidade do código | 10 | `verificar` e Prettier limpos, regras sem `console.log` | lint com avisos, ou o cálculo da gorjeta feito dentro do script |
| Repositório, commits e README | 15 | 6 commits de etapa e README com print | todos os commits num dia só, ou README sem como rodar |

Um critério sem nada entregue vale zero. Código que você não sabe explicar também: o instrutor pode pedir, em aula, que você mostre uma função e diga o que cada linha faz.

## Para ir além

Nada aqui vale ponto extra. É para quem terminou e quer praticar mais.

- O título do recibo em negrito no terminal, com o `picocolors` do E02
- O workflow do GitHub Actions do E04, rodando o `verificar` a cada push, e o selo no README
- `lerValor` aceitando milhar com ponto: `'1.250,00'` vira `125000`
- No terminal, os itens alinhados em colunas com `padEnd`, como a vitrine da aula 11: `Pizza grande marguerita    R$ 72,90`
- O `.editorconfig` e o formatar ao salvar do E03

## Dúvidas frequentes

**Posso usar a minha própria conta no `conta.json`?** Pode, e é melhor. Os testes não dependem dele: cada teste monta os dados de que precisa.

**Posso usar o que o curso ainda não mostrou, como `reduce` ou `map`?** Use o que a etapa pede. A etapa 6 existe para você escrever o seu primeiro `for` e o seu primeiro `if`; resolver com outra coisa pula o treino.

**Esqueci o commit de uma etapa. E agora?** Faça quando lembrar, com o nome da etapa. O que conta é ter um commit por etapa, na ordem, ao longo das semanas.

**O teste do `formatarReais` falha com o Expected igual ao Received.** É o espaço depois do `R$`: o JavaScript usa um espaço que não quebra a linha. No teste, escreva `'R$\u00a0187,50'`.

**`npm run racha R$ 187,50` não funcionou.** Com espaço no valor, use aspas: `npm run racha "R$ 187,50"`.

**A página diz que não encontrou as funções.** Três causas comuns: a página foi aberta com dois cliques, e não pelo `npx serve .`; o servidor foi aberto dentro de `web/`, e não na raiz; ou o `conta.js` importa o `fs`. As regras não leem arquivos: quem lê o `conta.json` é o script.

**A página diz que falta uma função que eu escrevi.** Confira o nome letra por letra e o `export` antes da função.

**A página mostra "as partes somam R$ 99,99, mas o total é R$ 100,00".** O seu `dividirConta` perdeu a sobra. Escreva o teste de R$ 100,00 para 3 pessoas e corrija até ficar verde.

**Posso aproveitar o `parcelar` do laboratório?** A ideia é parecida, mas no `parcelar` a primeira parcela leva toda a sobra. Aqui a sobra se espalha, um centavo por pessoa, e isso pede um laço. Escreva a sua.

**Não terminei a tempo.** Entregue o que tiver até o início do E08: o instrutor corrige o que existe e pode devolver para ajustes.
