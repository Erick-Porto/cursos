## Como corrigir em 15 minutos

:::steps
1. Clone o repositório numa pasta de correção, rode `npm install` e depois `npm run verificar` e `npx prettier --check .`. Anote o resultado: ele vai para "Testes" e "Qualidade".
2. Rode o script de conferência das regras (abaixo), apontando para a pasta do aluno. Cada `FALHA` é um caso do enunciado com resultado errado.
3. No terminal, na pasta do aluno: `npm run racha`, `npm run racha "R$ 100,00" 3`, `npm run racha abc` e `npm run racha 100 0`.
4. `npx serve .` na raiz do aluno e `http://localhost:3000/web/`. Siga o roteiro de uso da interface.
5. `git log --reverse --date=short --format="%ad %s"`: os 6 commits de etapa, na ordem, e as datas.
6. Leia `src/regras/conta.js`, `src/regras/conta.test.js`, `src/scripts/racha.js` e o README, nessa ordem.
:::

Repositório que não roda do zero (falta o `package-lock.json`, o `babel.config.json` ou um pacote) é devolvido para ajuste, não zerado: diga o comando e a mensagem de erro.

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

function caso(rotulo, calcular, esperado) {
  let obtido;
  try {
    obtido = calcular();
  } catch (erro) {
    falhas++;
    return console.log(`ERRO  ${rotulo}: ${erro.message}`);
  }
  const ok = JSON.stringify(obtido) === JSON.stringify(esperado);
  if (!ok) falhas++;
  const fim = ok ? '' : `  (esperado ${JSON.stringify(esperado)})`;
  console.log(`${ok ? 'ok   ' : 'FALHA'} ${rotulo} -> ${JSON.stringify(obtido)}${fim}`);
}

const reais = (texto) => 'R$\u00a0' + texto;
const itens = [
  { descricao: 'Pizza', quantidade: 1, preco: 72.9 },
  { descricao: 'Pizza', quantidade: 1, preco: 68.9 },
  { descricao: 'Refrigerante', quantidade: 2, preco: 14.5 },
  { descricao: 'Sobremesa', quantidade: 1, preco: 16.7 },
];

for (const [s, p, e] of [[18750, 10, 1875], [3330, 15, 500], [18755, 10, 1876], [8000, 0, 0]]) {
  caso(`calcularGorjeta(${s}, ${p})`, () => c.calcularGorjeta(s, p), e);
}
caso('calcularGorjeta(18750), padrão 10%', () => c.calcularGorjeta(18750), 1875);
caso('paraCentavos(0.1 + 0.2)', () => c.paraCentavos(0.1 + 0.2), 30);
for (const [n, t] of [[18750, '187,50'], [5, '0,05'], [123456, '1.234,56']]) {
  caso(`formatarReais(${n})`, () => c.formatarReais(n), reais(t));
}
for (const t of ['187,50', 'R$ 187,50', 'R$187,50', '  187,5 ', '187.50']) {
  caso(`lerValor('${t}')`, () => c.lerValor(t), 18750);
}
for (const t of ['', 'abc', '0', '0,00', '-10', '187,505']) {
  caso(`lerValor('${t}')`, () => c.lerValor(t), null);
}
for (const [t, e] of [['4', 4], [' 4 ', 4], ['1', 1], ['50', 50], ['', null], ['0', null], ['51', null], ['2,5', null], ['três', null]]) {
  caso(`lerPessoas('${t}')`, () => c.lerPessoas(t), e);
}
caso('formatarDataHora(28/10/2026 19:42)', () => c.formatarDataHora(new Date(2026, 9, 28, 19, 42)), '28/10/2026 19:42');
caso('formatarDataHora(5/3/2026 9:07)', () => c.formatarDataHora(new Date(2026, 2, 5, 9, 7)), '05/03/2026 09:07');
caso('somarItens(conta de exemplo)', () => c.somarItens(itens), 18750);
caso('somarItens([])', () => c.somarItens([]), 0);
for (const [t, p, e] of [[10000, 3, [3334, 3333, 3333]], [20625, 4, [5157, 5156, 5156, 5156]], [9000, 1, [9000]], [2, 3, [1, 1, 0]]]) {
  caso(`dividirConta(${t}, ${p})`, () => c.dividirConta(t, p), e);
}
const dados = { restaurante: 'Cantina', subtotal: 18750, percentual: 10, pessoas: 4, data: new Date(2026, 9, 28, 19, 42) };
const pedacos = ['Cantina', '28/10/2026 19:42', reais('187,50'), reais('18,75'), reais('206,25'), reais('51,57')];
caso('montarRecibo: restaurante, data e valores', () => pedacos.filter((p) => !c.montarRecibo(dados).includes(p)), []);
caso('montarRecibo: 3 pessoas com 51,56', () => c.montarRecibo(dados).split(reais('51,56')).length - 1, 3);

console.log(falhas === 0 ? '\nTudo certo.' : `\n${falhas} caso(s) com problema.`);
```

São 39 casos; a solução de referência passa em todos. Função com outro nome aparece como `ERRO ... is not a function`: confira se é só o nome (a interface web também falha) antes de descontar a regra inteira.

### Saídas esperadas no terminal

| Comando | O que deve aparecer |
|---|---|
| `npm run racha` | o recibo da conta do `conta.json`, com a data e a hora de agora. Com a conta de exemplo: R$ 187,50, R$ 18,75, R$ 206,25 e 51,57 + 51,56 + 51,56 + 51,56 |
| `npm run racha "R$ 100,00" 3` | subtotal R$ 100,00 e, com os 10% do exemplo, total R$ 110,00 em 36,67 + 36,67 + 36,66 |
| `npm run racha abc` | um aviso de valor inválido, sem recibo e sem erro do Node |
| `npm run racha 100 0` | um aviso de pessoas inválidas |

Se o aluno trocou o `conta.json` por uma conta própria, os valores mudam: confira que a soma das partes fecha o total.

### Roteiro de uso da interface

| Passo | O que fazer | O que deve aparecer |
|---|---|---|
| 1 | Abrir `http://localhost:3000/web/` | sem aviso amarelo; as 7 funções marcadas como encontradas |
| 2 | `R$ 187,50`, 4 pessoas, 10%, Dividir a conta | total R$ 206,25; 51,57 e três de 51,56; conferência "Nenhum centavo sumiu"; recibo com a data de agora |
| 3 | Trocar para Sem gorjeta | total R$ 187,50; 46,88 + 46,88 + 46,87 + 46,87 |
| 4 | `100`, 3 pessoas, Sem gorjeta | 33,34 + 33,33 + 33,33 |
| 5 | `abc` e 0 pessoas | as duas mensagens embaixo dos campos, sem resultado |
| 6 | `0,05` e 7 pessoas, Sem gorjeta | cinco de R$ 0,01 e duas de R$ 0,00, e a conferência verde |

A página diz qual função falhou e com qual entrada, em amarelo. O texto do aviso é um bom comentário de correção: copie para o aluno.

## Critério por critério

### Regras da conta (35)

Fonte principal: o script de conferência. Depois, leia o `conta.js`.

| Pontos | Quando |
|---|---|
| 35 | todos os casos `ok`; dinheiro em centavos do começo ao fim |
| 28 a 32 | um grupo com problema numa borda: `lerValor('0')` devolve `0`, ou `lerPessoas('2,5')` devolve `2` |
| 18 a 25 | uma regra central errada: a divisão perde ou sobra centavo, a gorjeta não arredonda (`calcularGorjeta(3330, 15)` dá `499.5`) ou `lerValor` não aceita `'R$ 187,50'` |
| 8 a 15 | só as regras do E04 e do E05 funcionam |
| 0 | `conta.js` ausente, ou nada roda |

Erros comuns:

- `dividirConta` com `Math.round` em cada parte: R$ 100,00 por 3 vira três de 33,33. É o erro do slide "Erros comuns" da aula 10, num laço
- A sobra toda na primeira pessoa, como no `parcelar` do laboratório: `[3334, 3333, 3333]` passa por coincidência, mas `dividirConta(2, 3)` dá `[2, 0, 0]` em vez de `[1, 1, 0]`, e `dividirConta(5, 3)` dá `[3, 1, 1]` em vez de `[2, 2, 1]`
- `lerValor` com `parseFloat` sem conferir o formato: aceita `'187,505'` e `'12abc'`
- `lerValor` devolvendo `NaN` ou `0` no lugar de `null`. A interface acusa: "devolveu NaN"
- `formatarDataHora` com `getMonth()` sem o `+ 1`, ou `getDay` no lugar de `getDate`

### Testes (20)

Rode `npm test` e leia o `conta.test.js`. Confira cada função pública e as bordas da rubrica.

| Pontos | Quando |
|---|---|
| 20 | todas as funções testadas; bordas: 0%, sobra de centavos, 1 pessoa, inválidos do `lerValor` e do `lerPessoas`, datas fixas; o `formatarReais` com `\u00a0` |
| 14 a 17 | falta uma função ou as bordas de uma delas |
| 8 a 12 | só o caminho feliz, ou um teste com `new Date()` sem data fixa |
| 0 a 5 | `npm test` vermelho, ou testes que não conferem nada (sem `expect`) |

Erros comuns: valor esperado copiado da saída da própria função (pergunte "como você sabe que 5157 está certo?"); teste do recibo com `new Date()`, que passa só no minuto em que foi escrito; espaço comum no lugar do `\u00a0`, com o teste apagado em vez de corrigido.

### Recibo no terminal e interface web (20)

| Pontos | Quando |
|---|---|
| 20 | os quatro comandos da tabela e os seis passos da interface como esperado |
| 14 a 17 | um comando falha: `npm run racha abc` quebra com `TypeError`, ou o recibo não tem a data |
| 8 a 12 | só o terminal funciona: a pasta `web/` falta ou a página avisa que falta função |
| 0 | o script não roda |

Erros comuns: `web/` sem os três arquivos, ou com os arquivos editados (compare com o zip do curso); lint vermelho no `tela.js` com `'document' is already defined`, porque o aluno acrescentou o `globals.browser` que o `tela.js` dispensa (desconte em "Qualidade", não aqui); o `racha.js` que soma em reais ou calcula a gorjeta por conta própria.

### Qualidade do código (10)

| Pontos | Quando |
|---|---|
| 10 | `npm run verificar` e `npx prettier --check .` limpos; nenhuma conta no script; nenhum `console.log` ou `fs` em `src/regras/` |
| 6 a 8 | um dos dois comandos com problema, ou nomes genéricos (`x`, `aux`, `valor2`) |
| 2 a 4 | conta no script, ou `console.log` dentro das regras |
| 0 | lint e Prettier nunca configurados |

Um `eslint-disable` para calar um erro vale como lint com problema.

### Repositório, commits e README (15)

| Pontos | Quando |
|---|---|
| 15 | repositório público, 6 commits de etapa na ordem, em datas diferentes; README com o que é, como rodar no terminal e na web e o print |
| 10 a 12 | falta o print, ou um commit de etapa |
| 5 a 8 | todos os commits no mesmo dia, ou README com o texto padrão do GitHub |
| 0 | repositório privado ou vazio no prazo |

Repositório privado: peça para tornar público e só então corrija. Não conte como zero na primeira vez.

## Check-in por etapa

O roteiro de cada encontro reserva 2 a 3 minutos para o check-in. Pergunte quem fez o commit da etapa anterior e abra **um** repositório no projetor. Olhe só a coisa da tabela.

| Encontro | Etapa anterior | O que olhar |
|---|---|---|
| E03 | 1 | `npm run racha` no computador de um aluno: a lista de itens aparece? `"type": "module"` no `package.json` |
| E04 | 2 | no GitHub: o `.gitignore` funcionou (sem `node_modules/`) e os dois primeiros commits |
| E05 | 3 | o `conta.test.js`: o teste nasceu antes? Pergunte o que apareceu no vermelho |
| E06 | 4 | o teste do `formatarReais`: tem o `\u00a0`? A gorjeta usa `Math.round` sobre centavos? |
| E07 | 5 | os casos recusados do `lerValor` e a data fixa no teste do `formatarDataHora` |
| E08 | 6 (entrega) | no painel, quantos entregaram; abra um e rode `npm run racha "R$ 100,00" 3` |

Quem não tem o commit da etapa anterior combina com você quando entrega; a etapa nova não espera.

## Sinais de cópia

- Os seis commits no mesmo dia, ou um commit só com tudo
- `conta.js` idêntico ao de um colega, inclusive nos comentários e nos nomes internos
- Funções com nomes do `lojinha-regras` (`precoComPix`, `parcelar`, `subtotal`) ou estrutura de outra solução da internet: `reduce`, `map`, classes e `toFixed`, que a turma ainda não viu
- Testes que não testam as bordas pedidas, mas o código trata todas
- Aluno que não sabe explicar o próprio `dividirConta`

Como agir: não acuse pelo texto da correção. Marque uma conversa de 5 minutos no próximo encontro e peça para o aluno explicar o `dividirConta` linha por linha e mudar uma regra na hora (por exemplo, a sobra para as **últimas** pessoas). Quem fez explica e muda em minutos. Se não explicar, a nota dos critérios de código fica suspensa até uma nova entrega, feita por ele, com o histórico de commits. Commits num dia só, com explicação boa, perdem só os pontos de commits.

## Como devolver para ajustes

Devolva quando um ajuste pequeno leva o projeto a 70 ou mais: uma função com nome errado, a pasta `web/` faltando, o `package-lock.json` fora do commit. No comentário, diga o critério, o comando e o que apareceu:

:::example Comentário de devolução
Regras: `dividirConta(10000, 3)` devolve `[3333, 3333, 3333]` e a interface mostra "as partes somam R$ 99,99". Os centavos que sobram (`10000 % 3`) vão para as primeiras pessoas. Escreva o teste desse caso, veja o vermelho e corrija. O resto está ótimo: a leitura do valor aceita todos os formatos do enunciado.
:::
