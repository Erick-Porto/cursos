## Como corrigir em 15 minutos

:::steps
1. Clone o repositório numa pasta de correção, rode `npm install` e depois `npm test`. Anote o resultado: ele vai para "Testes".
2. Rode o script de conferência das regras (abaixo), apontando para a pasta do aluno. Cada `FALHA` ou `ERRO` é um caso do enunciado com resultado errado.
3. No terminal, na pasta do aluno: `npm run racha`, `npm run racha "R$ 100,00" 3`, `npm run racha abc` e `npm run racha 100 0`.
4. `npx serve .` na raiz do aluno e `http://localhost:3000/web/`. Siga o roteiro de uso da interface.
5. `git log --reverse --date=short --format="%ad %s"`: os 9 commits de etapa, na ordem, e as datas.
6. Leia `src/regras/conta.js`, `src/regras/conta.test.js`, `src/scripts/racha.js` e o README, nessa ordem.
:::

Repositório que não roda do zero (falta o `package-lock.json`, o `babel.config.json` ou um pacote) é devolvido para ajuste, não zerado: diga o comando e a mensagem de erro. No `package.json` esperado: `"type": "module"`, os scripts `test` (`jest`) e `racha`, o `picocolors` em `dependencies` e `jest`, `babel-jest` e `@babel/preset-env` (versão 7) em `devDependencies`. Quem instalou o `@babel/preset-env` sem o `@7`, num Node 24 ou mais novo, tem a versão 8: funciona do mesmo jeito, com avisos de `ERESOLVE` na instalação. Não desconte.

No PowerShell, escreva os comandos com as aspas como acima. Sem aspas, `npm run racha 187,50` chega ao script como `187 50`; e `"R$187,50"`, sem o espaço, perde o `$187`.

### Conferência das regras

Salve como `conferir-racha-conta.mjs` **fora** do repositório do aluno, por exemplo na pasta que reúne os clones da turma, e rode `node conferir-racha-conta.mjs racha-conta-ana`. O script só importa `src/regras/conta.js` e compara com os casos do enunciado; ele não mostra como as funções são feitas.

```javascript
// Confere as funções de src/regras/conta.js de um aluno com os casos do enunciado.
// Uso, fora do repositório do aluno: node conferir-racha-conta.mjs caminho/do/racha-conta
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const arquivo = path.resolve(process.argv[2] ?? '.', 'src/regras/conta.js');
const c = await import(pathToFileURL(arquivo).href);
let falhas = 0;
let casos = 0;

// o espaço especial do Intl ( ) conta como espaço comum
const limpar = (v) => (typeof v === 'string' ? v.replaceAll(' ', ' ') : v);
// NaN, null e undefined são diferentes (o JSON.stringify mostraria os três como null)
const igual = (a, b) =>
  Array.isArray(b)
    ? Array.isArray(a) && a.length === b.length && a.every((x, i) => Object.is(x, b[i]))
    : Object.is(a, b);
const mostrar = (v) =>
  Array.isArray(v) ? `[${v.map(mostrar).join(', ')}]` : typeof v === 'string' ? `'${v}'` : String(v);

function caso(rotulo, calcular, esperado) {
  casos++;
  let obtido;
  try {
    obtido = limpar(calcular());
  } catch (erro) {
    falhas++;
    return console.log(`ERRO  ${rotulo}: ${erro.message}`);
  }
  const ok = igual(obtido, esperado);
  if (!ok) falhas++;
  const fim = ok ? '' : `  (esperado ${mostrar(esperado)})`;
  console.log(`${ok ? 'ok   ' : 'FALHA'} ${rotulo} -> ${mostrar(obtido)}${fim}`);
}

const itens = [
  { descricao: 'Pizza grande marguerita', quantidade: 1, preco: 72.9 },
  { descricao: 'Pizza grande calabresa', quantidade: 1, preco: 68.9 },
  { descricao: 'Refrigerante 2 litros', quantidade: 2, preco: 14.5 },
  { descricao: 'Petit gâteau', quantidade: 1, preco: 16.7 },
];

for (const [r, e] of [[187.5, 18750], [72.9, 7290], [0.1 + 0.2, 30]]) {
  caso(`paraCentavos(${r})`, () => c.paraCentavos(r), e);
}
for (const [s, p, e] of [[18750, 10, 1875], [3330, 15, 500], [18755, 10, 1876], [8000, 0, 0]]) {
  caso(`calcularGorjeta(${s}, ${p})`, () => c.calcularGorjeta(s, p), e);
}
caso('calcularGorjeta(18750), padrão 10%', () => c.calcularGorjeta(18750), 1875);
for (const [n, t] of [[18750, 'R$ 187,50'], [5, 'R$ 0,05'], [20625, 'R$ 206,25']]) {
  caso(`formatarReais(${n})`, () => c.formatarReais(n), t);
}
for (const [t, e] of [['187,50', 18750], ['R$ 187,50', 18750], ['R$187,50', 18750], ['  187,5 ', 18750], ['187.50', 18750], ['187', 18700]]) {
  caso(`lerValor('${t}')`, () => c.lerValor(t), e);
}
for (const t of ['', 'abc', '0', '0,00', '-10', '187,505']) {
  caso(`lerValor('${t}')`, () => c.lerValor(t), null);
}
for (const [t, e] of [['4', 4], [' 4 ', 4], ['1', 1], ['50', 50], ['', null], ['0', null], ['51', null], ['2,5', null], ['-3', null], ['três', null]]) {
  caso(`lerPessoas('${t}')`, () => c.lerPessoas(t), e);
}
caso('somarItens(conta de exemplo)', () => c.somarItens(itens), 18750);
caso('somarItens([])', () => c.somarItens([]), 0);
for (const [t, p, e] of [[10000, 3, [3334, 3333, 3333]], [20625, 4, [5157, 5156, 5156, 5156]], [11000, 3, [3667, 3667, 3666]], [9000, 1, [9000]], [2, 3, [1, 1, 0]]]) {
  caso(`dividirConta(${t}, ${p})`, () => c.dividirConta(t, p), e);
}
caso('formatarDataHora(28/10/2026 19:42)', () => c.formatarDataHora(new Date(2026, 9, 28, 19, 42)), '28/10/2026 19:42');
caso('formatarDataHora(5/3/2026 9:07)', () => c.formatarDataHora(new Date(2026, 2, 5, 9, 7)), '05/03/2026 09:07');
const dados = { restaurante: 'Cantina Bella Nonna', subtotal: 18750, percentual: 10, pessoas: 4, data: new Date(2026, 9, 28, 19, 42) };
caso('montarRecibo(conta de exemplo), linha por linha', () => limpar(c.montarRecibo(dados)).split('\n'), [
  'Cantina Bella Nonna',
  '28/10/2026 19:42',
  'Subtotal: R$ 187,50',
  'Gorjeta (10%): R$ 18,75',
  'Total: R$ 206,25',
  'Pessoa 1: R$ 51,57',
  'Pessoa 2: R$ 51,56',
  'Pessoa 3: R$ 51,56',
  'Pessoa 4: R$ 51,56',
]);

console.log(falhas === 0 ? `\nTudo certo: ${casos} casos.` : `\n${falhas} de ${casos} caso(s) com problema.`);
```

São 43 casos; a solução de referência passa em todos. Função com outro nome aparece como `ERRO ... is not a function`: confira se é só o nome (a interface web também falha) antes de descontar a regra inteira. Uma cópia do script fica em `privado/projetos/projeto-1/`.

### Saídas esperadas no terminal

| Comando | O que deve aparecer |
|---|---|
| `npm run racha` | `Racha-conta` em negrito e o recibo da conta da Cantina, com a data e a hora de agora: R$ 187,50, R$ 18,75, R$ 206,25 e 51,57 + 51,56 + 51,56 + 51,56 |
| `npm run racha "R$ 100,00" 3` | o recibo com subtotal R$ 100,00, gorjeta R$ 10,00 (os 10% do `conta.json`), total R$ 110,00 e 36,67 + 36,67 + 36,66 |
| `npm run racha abc` | `Valor inválido: "abc". Digite como 187,50 ou "R$ 187,50".`, sem recibo e sem erro do Node |
| `npm run racha 100 0` | `Número de pessoas inválido: "0". Digite um número inteiro de 1 a 50.` |

O texto exato do aviso pode variar; o que conta é aparecer um aviso, e não o recibo nem um `TypeError`. Se o aluno trocou o `conta.json` por uma conta própria depois da etapa 9 ("Para ir além"), os valores do primeiro comando mudam: confira que a soma das partes fecha o total.

### Roteiro de uso da interface

| Passo | O que fazer | O que deve aparecer |
|---|---|---|
| 1 | Abrir `http://localhost:3000/web/` | sem aviso amarelo; as 7 funções marcadas como encontradas |
| 2 | Cantina Bella Nonna, `R$ 187,50`, 4 pessoas, 10%, Dividir a conta | total R$ 206,25; 51,57 e três de 51,56; "As 4 partes somam R$ 206,25, o total da conta. Nenhum centavo sumiu."; recibo com a data de agora |
| 3 | Trocar para Sem gorjeta | total R$ 187,50; 46,88 + 46,88 + 46,87 + 46,87 |
| 4 | `100`, 3 pessoas, Sem gorjeta | 33,34 + 33,33 + 33,33 |
| 5 | `abc` e 0 pessoas | as duas mensagens embaixo dos campos, sem resultado |
| 6 | `0,05` e 7 pessoas, Sem gorjeta | cinco de R$ 0,01 e duas de R$ 0,00, e a conferência verde |

A página diz qual função falhou e com qual entrada, em amarelo, como `lerValor('abc') devolveu NaN; o esperado é um número inteiro de centavos, ou null quando o texto não vale.` O texto do aviso é um bom comentário de correção: copie para o aluno. Com o código parado na etapa 8, a página avisa que faltam `formatarDataHora` e `montarRecibo`, divide a conta e, no lugar do recibo, diz que ele aparece quando o `montarRecibo` existir.

## Critério por critério

### Regras da conta (35)

Fonte principal: o script de conferência. Depois, leia o `conta.js`.

| Pontos | Quando |
|---|---|
| 35 | os 43 casos `ok`; dinheiro em centavos do começo ao fim |
| 28 a 32 | um grupo com problema numa borda: `lerValor('0')` devolve `0`, ou `lerValor('187,505')` devolve `18751` |
| 18 a 25 | uma regra central errada: a divisão perde ou sobra centavo, a gorjeta não arredonda (`calcularGorjeta(3330, 15)` dá `499.5`) ou `lerValor` não aceita `'R$ 187,50'` |
| 8 a 15 | só as regras até o E09 funcionam (`paraCentavos`, `calcularGorjeta`, `formatarReais` e `lerValor` sem os `null`) |
| 0 | `conta.js` ausente, ou nada roda |

Erros comuns:

- A sobra toda na primeira pessoa: `dividirConta(10000, 3)` passa por coincidência, mas `dividirConta(11000, 3)` dá `[3668, 3666, 3666]` e `dividirConta(2, 3)` dá `[2, 0, 0]`
- O `for` com `i <= pessoas`: uma parte a mais, `dividirConta(9000, 1)` dá `[9000, 9000]`
- `Math.round` em cada parte: R$ 100,00 por 3 vira três de 33,33
- `lerValor` sem conferir as casas: `'187,505'` vira `18751`. Ou conferindo com `reais * 100`, que falha em `72.9`
- `lerValor` devolvendo `NaN` ou `0` no lugar de `null`. A interface acusa: "devolveu NaN"
- `formatarDataHora` com `getMonth()` sem o `+ 1` (`'28/09/2026 19:42'`), ou `getDay` no lugar de `getDate` (`'03/10/2026 19:42'`: o `getDay` é o dia da semana)
- `montarRecibo` que imprime com `console.log` e não devolve nada: a interface diz "montarRecibo devolveu undefined; o esperado é um texto."

### Testes (20)

Rode `npm test` e leia o `conta.test.js`. A solução de referência tem 44 testes; o número do aluno pode variar. Confira cada função e as bordas da rubrica.

| Pontos | Quando |
|---|---|
| 20 | todas as funções testadas; bordas: 0%, sem percentual, sobra de centavos, 1 pessoa, lista vazia, os recusados do `lerValor` e do `lerPessoas`, datas fixas e a soma das partes |
| 14 a 17 | falta uma função ou as bordas de uma delas |
| 8 a 12 | só o caminho feliz, ou um teste com `new Date()` sem data fixa |
| 0 a 5 | `npm test` vermelho, ou testes que não conferem nada (sem `expect`) |

Erros comuns: valor esperado copiado da saída da própria função (pergunte "como você sabe que 5157 está certo?"); teste do recibo com `new Date()`, que passa só no minuto em que foi escrito; `toBe` com uma lista, que falha com "serializes to the same string" e, em vez de trocar por `toEqual`, o aluno apaga o teste.

### Recibo no terminal e interface web (20)

| Pontos | Quando |
|---|---|
| 20 | os quatro comandos da tabela e os seis passos da interface como esperado |
| 14 a 17 | um comando falha: `npm run racha abc` mostra `R$ NaN` em vez do aviso, ou o recibo não tem a data |
| 8 a 12 | só o terminal funciona: a pasta `web/` falta ou a página avisa que falta função |
| 0 | o script não roda |

Erros comuns: `web/` sem os três arquivos, ou com os arquivos editados (compare com o zip do curso); o servidor aberto dentro de `web/`; o `racha.js` que soma em reais ou calcula a gorjeta por conta própria, em vez de chamar as regras (desconte em "Qualidade", não aqui).

### Qualidade do código (10)

Abra o `conta.js` e o `racha.js` no VS Code e aperte <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>F</kbd>. Se quase nada muda, o Formatar Documento foi aplicado. Quem usou o formatador do Prettier (aspas duplas, parênteses em `(a * b) / 100`) também formatou: vale igual.

| Pontos | Quando |
|---|---|
| 10 | código formatado; nenhuma conta no script; nenhum `console.log` ou `fs` em `src/regras/`; nomes que dizem o que guardam |
| 6 a 8 | recuo misturado em um arquivo, ou nomes genéricos (`x`, `aux`, `valor2`) |
| 2 a 4 | conta no script (gorjeta ou divisão calculadas no `racha.js`), ou `console.log` dentro das regras |
| 0 | código sem recuo nenhum e regras misturadas ao script |

### Repositório, commits e README (15)

| Pontos | Quando |
|---|---|
| 15 | repositório público, sem `node_modules/`, 9 commits de etapa na ordem, em datas diferentes; README com o que é, como rodar no terminal e na web e o print |
| 10 a 12 | falta o print, ou um ou dois commits de etapa |
| 5 a 8 | todos os commits no mesmo dia, `node_modules/` enviado, ou README com o texto padrão do GitHub |
| 0 | repositório privado ou vazio no prazo |

Repositório privado: peça para tornar público e só então corrija. Não conte como zero na primeira vez. O commit da etapa 1 é feito no E05, junto com o da etapa 2: as duas datas iguais são o esperado.

## Check-in por etapa

O roteiro de cada encontro reserva 2 a 3 minutos para o check-in. Pergunte quem fez o commit da etapa anterior e abra **um** repositório no projetor. Olhe só a coisa da tabela.

| Encontro | Etapa anterior | O que olhar |
|---|---|---|
| E05 | 1 | `npm run racha` no computador de um aluno: as linhas `Unidades pedidas: 5` e `Itens acima de R$ 50: 2`; `"type": "module"` no `package.json` |
| E06 | 2 | no GitHub: sem `node_modules/`, os commits das etapas 1 e 2 e o README com "O que ele mostra" |
| E07 | 3 | a saída termina em `Por pessoa: R$ 51.56` e `Centavos que sobram: 1`; a gorjeta usa `Math.round` sobre centavos |
| E08 | 4 | o `conta.js` com as três funções e o `export`, sem `console.log`; a saída igual à da etapa 3 |
| E09 | 5 | `npm test` com 11 verdes. Pergunte o que apareceu no vermelho |
| E10 | 6 | `npm run racha "R$ 100,00"` mostra `Subtotal: R$ 100,00`, com vírgula |
| E11 | 7 | `npm run racha abc` mostra o aviso; os seis recusados do `lerValor` nos testes |
| E12 | 8 | `npm run racha` mostra `Pessoa 1: R$ 51,57`; o teste que soma as partes |
| E13 | 9 (entrega) | no painel, quantos entregaram; abra um e rode `npm run racha "R$ 100,00" 3` |

Quem não tem o commit da etapa anterior combina com você quando entrega; a etapa nova não espera.

## Sinais de cópia

- Os nove commits no mesmo dia, ou um commit só com tudo
- `conta.js` idêntico ao de um colega, inclusive nos comentários e nos nomes internos
- Recursos que a turma não viu até o E12: `Intl.NumberFormat` ou `toLocaleString` no `formatarReais`, expressões regulares (`/^\d+$/`) no `lerValor`, `parseFloat`, `map`, `forEach`, classes
- Testes que não testam as bordas pedidas, mas o código trata todas
- Aluno que não sabe explicar o próprio `dividirConta`

Como agir: não acuse pelo texto da correção. Marque uma conversa de 5 minutos no próximo encontro e peça para o aluno explicar o `dividirConta` linha por linha e mudar uma regra na hora (por exemplo, a sobra para as **últimas** pessoas). Quem fez explica e muda em minutos. Se não explicar, a nota dos critérios de código fica suspensa até uma nova entrega, feita por ele, com o histórico de commits. Commits num dia só, com explicação boa, perdem só os pontos de commits.

## Como devolver para ajustes

Devolva quando um ajuste pequeno leva o projeto a 70 ou mais: uma função com nome errado, a pasta `web/` faltando, o `package-lock.json` fora do commit. No comentário, diga o critério, o comando e o que apareceu:

:::example Comentário de devolução
Regras: `dividirConta(11000, 3)` devolve `[3668, 3666, 3666]`: a sobra foi toda para a primeira pessoa. Os centavos que sobram (`11000 % 3`, que dá 2) vão, um para cada, para as primeiras pessoas: `[3667, 3667, 3666]`. Escreva o teste desse caso, veja o vermelho e corrija. O resto está ótimo: a leitura do valor aceita todos os formatos do enunciado.
:::
