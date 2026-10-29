---
title: Datas, números e JSON
summary: Formate preço e data em pt-BR com Intl, calcule prazos em dias úteis e leve datas pelo JSON sem erro.
module: linguagem-js
duration_minutes: 40
objectives:
  - Formatar preços, notas e datas em pt-BR com Intl.NumberFormat e Intl.DateTimeFormat
  - Criar datas, somar dias e calcular a diferença entre duas datas com Date
  - Prever a entrega em dias úteis e testar a previsão com datas fixas
  - Converter objetos com datas para JSON e de volta sem perder o dia
---

# Datas, números e JSON

Programador Mobile · Encontro E06 · Aula 12 de 89

---

## O que você vai aprender

:::goal
- Formatar preço, nota e desconto com `Intl.NumberFormat`
- Criar e ler datas com `Date`, somar dias e medir a diferença entre duas datas
- Calcular a previsão de entrega em dias úteis e mostrá-la com `Intl.DateTimeFormat`
- Testar código de datas sem depender do dia em que o teste roda
- Gravar datas num JSON e trazê-las de volta
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **formatar** | escrever um valor do jeito que as pessoas leem: `1299.9` vira `R$ 1.299,90` |
| **`Intl`** | a parte do JavaScript que formata números e datas no padrão de cada país |
| **`Date`** | o tipo que guarda um instante: dia e hora |
| **UTC** | o horário de referência do mundo; Brasília fica 3 horas atrás dele |
| **dia útil** | de segunda a sexta: os dias em que a transportadora entrega |
| **mutável** | que pode mudar depois de criado; o contrário da string, que é imutável |

---

## Preço, prazo e data em todo pedido

Abra o detalhe de um produto em qualquer app de compras: "R$ 189,90 no Pix", "Chega até qui., 16 de out.", "Pedido feito há 2 dias". Parece simples, mas cada linha esconde uma armadilha:

- a previsão que cai num domingo, quando a transportadora não entrega
- o pedido do dia 16 que aparece como dia 15 no histórico
- o teste que passa na segunda e falha no sábado

Hoje o `lojinha-regras` ganha a previsão de entrega, sem nenhum desses erros. No E30, ela vai para a tela do app.

:::question
Por que um teste que usa a data de hoje pode passar na segunda-feira e falhar no sábado?
:::

---

## Formatar números

Como se escreve 1299.9 na etiqueta de preço de uma loja brasileira?

---

## :icon[banknote] Intl.NumberFormat: dinheiro em pt-BR

**Formatar** é escrever um número do jeito que as pessoas leem. O **`Intl`** faz isso no padrão de cada país. Você cria um **formatador**, que funciona como um carimbo: regula uma vez, com o idioma e as opções, e carimba cada número com `format`:

```javascript
const moeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

moeda.format(1299.9); // 'R$ 1.299,90'
moeda.format(0.5);    // 'R$ 0,50'
```

- `'pt-BR'` é o português do Brasil; `style: 'currency'` pede moeda, e `currency: 'BRL'`, o real
- **`new`** cria um objeto a partir de um modelo pronto, como uma forma de bolo faz bolos. `Intl.NumberFormat` e `Date` são modelos assim. No E15, você cria os seus: as classes

---

## :icon[banknote] Formatar números na prática

**Caso 1: um carimbo, a vitrine inteira.** O mesmo `moeda` formata todos os preços:

```javascript
console.log(moeda.format(199.9));  // R$ 199,90
console.log(moeda.format(79.9));   // R$ 79,90
console.log(moeda.format(1299.5)); // R$ 1.299,50
```

Crie o formatador uma vez, fora da função, e reaproveite: no relatório dos 12 produtos, um formatador por linha é desperdício.

**Caso 2: o mesmo resultado do E05.** O `toLocaleString('pt-BR', { ... })` do `formatarPreco` também dá `'R$ 199,90'`, porque usa o Intl por dentro. No laboratório, o `formatarPreco` passa a usar um formatador só.

---

## :icon[percent] Nota, desconto e o problema do toFixed

```javascript
const nota = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
nota.format(4.5); // '4,5'
nota.format(4);   // '4,0'

const pct = new Intl.NumberFormat('pt-BR', { style: 'percent' });
pct.format(PERCENTUAL_PIX / 100); // '5%'

(4.5).toFixed(1); // '4.5': ponto, padrão americano
```

- `minimumFractionDigits` e `maximumFractionDigits` (o mínimo e o máximo de casas decimais) fixam as casas: a nota do produto sempre com uma
- `percent` multiplica por 100: o `PERCENTUAL_PIX` do E05 vale `5`, então divida por 100 antes
- `toFixed` devolve texto com ponto decimal: no padrão brasileiro, use o `Intl`

---

## Datas

O que o cupom fiscal anota sobre o momento da compra?

---

## :icon[calendar] Date: criar e ler uma data

Um **`Date`** guarda um instante, dia e hora, como a data e a hora impressas num cupom fiscal. Ele também se cria com `new`:

```javascript
const agora = new Date();              // agora, pelo relógio do computador
const entrega = new Date(2025, 9, 16); // 16 de outubro de 2025

entrega.getDate();     // 16
entrega.getMonth();    // 9: os meses começam em 0
entrega.getFullYear(); // 2025
entrega.getDay();      // 4: quinta-feira (0 é domingo, 6 é sábado)
```

- Ao criar a data com números, o mês vai de 0 (janeiro) a 11 (dezembro), como as gavetas numeradas a partir do 0: `new Date(2025, 10, 16)` é 16 de **novembro**
- Os métodos `get...` (*get*, "pegar") leem uma parte da data
- `getDate` é o dia do mês; `getDay` é o dia da semana. Os nomes enganam, então confira duas vezes

---

## :icon[calendar] Datas na prática

Um pedido feito na quinta, 9 de outubro de 2025, às 14h30:

```javascript
const pedido = new Date(2025, 9, 9, 14, 30);
```

**Caso 1: o dia, o mês e o ano, para gente ler.** O mês ganha 1, porque o `Date` conta a partir do 0:

```javascript
console.log(pedido.getDate(), pedido.getMonth() + 1, pedido.getFullYear()); // 9 10 2025
```

**Caso 2: a hora do pedido.** Os dois últimos números da criação são a hora e os minutos:

```javascript
console.log(pedido.getHours(), pedido.getMinutes()); // 14 30
```

**Caso 3: o dia da semana.** `pedido.getDay()` dá `4`: quinta-feira.

---

## :icon[clock] A armadilha da data em texto

Um arquivo ou uma API manda `'2025-10-16'`, e parece seguro criar a data a partir desse texto:

```javascript
const data = new Date('2025-10-16');
data.getDate(); // 15 no Brasil
// Wed Oct 15 2025 21:00:00 GMT-0300
```

Uma string só com a data é lida como **meia-noite em UTC**, o horário de referência mundial. Em Brasília (UTC-3), isso ainda é 21h do dia anterior: o pedido do dia 16 aparece como dia 15. Monte a data pelos números:

```javascript
const partes = '2025-10-16'.split('-');
const certa = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
certa.getDate(); // 16, no fuso do computador
```

---

## Contas com datas

Que dia cai 5 dias depois de 30 de outubro?

---

## :icon[calendar-clock] Somar dias sem estragar a original

Para somar dias, o `Date` tem o `setDate` ("definir o dia"). Só que ele **muda** a data: um `Date` é **mutável**, ao contrário da string. Por isso a função tira uma cópia e mexe só na cópia:

```javascript
export function somarDias(data, dias) {
  const nova = new Date(data.getFullYear(), data.getMonth(), data.getDate());
  nova.setDate(nova.getDate() + dias);
  return nova;
}

somarDias(new Date(2025, 9, 31), 1);  // 1 de novembro de 2025
somarDias(new Date(2025, 11, 31), 1); // 1 de janeiro de 2026
```

- A primeira linha monta a cópia, `nova`, com o ano, o mês e o dia da data recebida; assim, ela também zera a hora
- O `setDate` muda só a cópia: a `data` de quem chamou fica como estava
- Passou do fim do mês? O `Date` ajusta sozinho: o dia 32 de outubro vira 1 de novembro

---

## :icon[hourglass] Diferença entre datas

Para saber quantos dias faltam, subtraia uma data da outra:

```javascript
const UM_DIA = 24 * 60 * 60 * 1000; // um dia em milissegundos

export function diasEntre(inicio, fim) {
  return Math.round((fim - inicio) / UM_DIA);
}

const hoje = new Date(2025, 9, 13);
const vencimento = new Date(2025, 9, 16);
diasEntre(hoje, vencimento); // 3: "Seu boleto vence em 3 dias"
```

- Subtrair dois `Date` dá a diferença em **milissegundos**, milésimos de segundo: o `-` converte as datas em número, como converte texto em número (E05)
- Dividir por `UM_DIA` converte em dias; o `Math.round` absorve as horas quebradas
- A mesma função escreve "Pedido feito há 2 dias": `diasEntre(dataDoPedido, hoje)`

---

## Pense

:::question
Sem rodar o código, diga os três valores que aparecem no console:

```javascript
const pedido = new Date(2025, 9, 9); // quinta, 9 de outubro
const entrega = pedido;
entrega.setDate(entrega.getDate() + 2);

console.log(pedido.getDate());
console.log(entrega.getDay());
console.log(new Date(2025, 9, 32).getMonth());
```
:::

:::tip Resposta
- `11`: `entrega = pedido` não copia a data. Os dois nomes são como dois papéis com o mesmo endereço: levam ao **mesmo objeto**, então o `setDate` mudou a data do pedido também
- `6`: 11 de outubro de 2025 é um sábado, e a entrega cairia no fim de semana
- `10`: o dia 32 de outubro vira 1 de novembro, o mês 10

Para não alterar o pedido, copie a data primeiro, como no `somarDias`.
:::

---

## Dias úteis

Comprou na sexta à noite: quando a transportadora começa a contar o prazo?

---

## :icon[truck] Dias úteis: o próximo dia de entrega

Um **dia útil** vai de segunda a sexta: é quando a transportadora entrega. A Lojinha precisa de duas respostas: hoje é dia útil? E qual é o próximo?

```javascript
export function ehDiaUtil(data) {
  const dia = data.getDay(); // 0 = domingo, 6 = sábado
  return dia !== 0 && dia !== 6;
}

// de domingo (0) a sábado (6): quantos dias até o próximo dia útil
const DIAS_ATE_O_PROXIMO_UTIL = [1, 1, 1, 1, 1, 3, 2];

export function proximoDiaUtil(data) {
  return somarDias(data, DIAS_ATE_O_PROXIMO_UTIL[data.getDay()]);
}
```

| Hoje é | `getDay()` | Salto | Próximo dia útil |
|---|---|---|---|
| quinta | 4 | 1 | sexta |
| sexta | 5 | 3 | segunda |
| sábado | 6 | 2 | segunda |

- `ehDiaUtil` responde "o dia não é domingo **e** não é sábado"
- O array funciona como uma tabela: a posição é o dia da semana, e o valor é quantos dias pular. `DIAS_ATE_O_PROXIMO_UTIL[data.getDay()]` abre a gaveta do dia de hoje

---

## :icon[repeat] preverEntrega: a versão pronta

A previsão aplica o `proximoDiaUtil` uma vez para cada dia útil do prazo. Repetir é trabalho de um **laço**, que você aprende a escrever no E07. Hoje, use a versão pronta:

```javascript
export function preverEntrega(diasUteis, hoje = new Date()) {
  let data = hoje;
  for (let i = 0; i < diasUteis; i++) {
    data = proximoDiaUtil(data); // uma volta por dia útil
  }
  return data;
}
```

- O `for` repete o bloco `diasUteis` vezes; a cada volta, `data` passa a ser o próximo dia útil
- `hoje = new Date()` é um **valor padrão**: quem não passa a data recebe a de hoje, e o teste passa uma data fixa
- Cada volta cria uma data nova com o `somarDias`: o `hoje` de quem chamou fica intacto
- Feriados ficam de fora por enquanto. No E16, o boleto usa esta função para calcular o vencimento

---

## :icon[truck] Volta a volta até a entrega

:::center
![Animação: a partir de quinta, 9 de outubro de 2025, a data pula de dia útil em dia útil; a volta 1 chega na sexta, a volta 2 pula o sábado e o domingo e chega na segunda, as voltas 3 a 5 chegam na terça, quarta e quinta, e a entrega chega na quinta, 16](images/e06-proximo-dia-util.svg)
:::

Pedido na quinta, 9 de outubro de 2025, com 5 dias úteis: a volta 1 chega na sexta; a volta 2 pula o fim de semana e chega na segunda; as voltas 3 a 5 chegam na terça, na quarta e na quinta. Chega na quinta, 16.

---

## Formatar datas

Como caber "quinta-feira, 16 de outubro" num cantinho da tela do celular?

---

## :icon[calendar-check] Intl.DateTimeFormat: a data no padrão brasileiro

O carimbo também serve para datas: o **`Intl.DateTimeFormat`** regula como a data aparece. `weekday` é o dia da semana, `day` é o dia e `month` é o mês; `'short'` pede a forma abreviada:

```javascript
const formatoCurto = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
});

export function formatarData(data) {
  return formatoCurto.format(data);
}

formatarData(new Date(2025, 9, 16)); // 'qui., 16 de out.'
```

| Opções | Resultado |
|---|---|
| `{ dateStyle: 'short' }` | `16/10/2025` |
| `{ dateStyle: 'long' }` | `16 de outubro de 2025` |
| `{ weekday: 'long' }` | `quinta-feira` |

:::tip
No terminal e nos testes, quem formata é o `Intl` do Node. No app (E30), é o do motor do celular, e a pontuação pode variar um pouco: confira na tela.
:::

---

## :icon[calendar-check] Formatar datas na prática

**Caso 1: a previsão de entrega.** O `formatarData` recebe a data que o `preverEntrega` devolve:

```javascript
console.log(`Chega até ${formatarData(preverEntrega(5, new Date(2025, 9, 9)))}`);
// Chega até qui., 16 de out.
```

**Caso 2: a data por extenso, no histórico de pedidos.** Outro carimbo, com `dateStyle: 'long'`:

```javascript
const longo = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' });
console.log(`Pedido feito em ${longo.format(new Date(2025, 9, 9))}`);
// Pedido feito em 9 de outubro de 2025
```

**Caso 3: só o dia da semana.**

```javascript
const diaDaSemana = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' });
console.log(`Entrega na ${diaDaSemana.format(new Date(2025, 9, 16))}`);
// Entrega na quinta-feira
```

---

## Testes com datas

Se a pergunta da prova mudasse todo dia, o gabarito ainda serviria?

---

## :icon[test-tube] Testar datas: nunca a data de hoje

Um teste é uma prova com gabarito que o computador corrige sozinho. Com `new Date()`, a pergunta muda a cada dia, e o gabarito deixa de servir. Por isso `preverEntrega` recebe `hoje` como **parâmetro**: o script não passa nada, e o teste passa uma data fixa.

```javascript
preverEntrega(5);                       // muda a cada dia: conta a partir de hoje
preverEntrega(5, new Date(2025, 9, 9)); // sempre quinta, 16 de outubro de 2025
```

- No script, a primeira forma: o cliente quer a previsão a partir de hoje
- No teste, a segunda: a mesma entrada dá sempre a mesma saída, e o gabarito vale em qualquer dia
- Escolha datas que mostrem o que importa: uma quinta, uma sexta, um sábado, uma virada de mês

---

## :icon[test-tube] Testes de datas na prática

Três testes com datas fixas, que passam em qualquer dia:

```javascript
import { ehDiaUtil, formatarData, preverEntrega } from './datas.js';

const QUINTA = new Date(2025, 9, 9); // 9 de outubro de 2025

test('5 dias úteis a partir de quinta chegam na quinta seguinte', () => {
  expect(preverEntrega(5, QUINTA)).toEqual(new Date(2025, 9, 16));
});

test('a previsão nunca cai no fim de semana', () => {
  expect(ehDiaUtil(preverEntrega(3, new Date(2025, 9, 10)))).toBe(true);
});

test('formata com dia da semana e mês abreviados', () => {
  expect(formatarData(new Date(2025, 9, 16))).toBe('qui., 16 de out.');
});
```

O `toEqual` compara dois `Date` pelo instante. O `toBe` falharia: são dois objetos diferentes.

---

## JSON e datas

O que acontece com uma data quando ela vira texto num arquivo?

---

## :icon[braces] JSON e datas: ida e volta

O **JSON**, do E02, escreve dados como texto: `JSON.stringify` transforma o objeto em texto, e `JSON.parse` traz de volta. Você usou os dois com o catálogo. Com uma data dentro, a volta muda:

```javascript
const pedido = { id: 42, criadoEm: new Date(2025, 9, 9, 14, 30) };

const texto = JSON.stringify(pedido);
// '{"id":42,"criadoEm":"2025-10-09T17:30:00.000Z"}'

const volta = JSON.parse(texto);
typeof volta.criadoEm;               // 'string', não Date
new Date(volta.criadoEm).getHours(); // 14 de novo, no fuso do computador
```

- **JSON** é texto: arquivos, a API (E19) e o armazenamento do celular (E43) só guardam e trocam texto
- O `stringify` transforma o `Date` num texto em UTC: 14h30 em Brasília vira `17:30:00.000Z`, e o `Z` no fim quer dizer UTC
- O `parse` não sabe que aquilo era uma data. Recrie com `new Date(texto)`: com hora e `Z`, o instante é exato e o dia não muda

---

## :icon[file-text] O pedido num arquivo

```javascript
import fs from 'node:fs';

const entrega = preverEntrega(5);
const pedido = { produto: 'Fone Bluetooth', cep: '01310-100', entrega };
fs.writeFileSync('pedido.json', JSON.stringify(pedido, null, 2) + '\n');

// outro script, outro dia
const lido = JSON.parse(fs.readFileSync('pedido.json', 'utf-8'));
const entregaLida = new Date(lido.entrega); // Date de novo
```

- O `stringify` descarta `undefined` e funções, e `NaN` vira `null`: só dados simples sobrevivem
- Arquivo vazio ou corrompido faz o `parse` lançar `SyntaxError` e parar o script. No E17, você aprende a capturar esse erro
- O arquivo é gerado pelo script: ponha `pedido.json` no `.gitignore`

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Unexpected end of JSON input` | o `JSON.parse` recebeu um texto vazio | confira o arquivo; no E17, você captura esse erro |
| `getHours is not a function` | a data voltou do JSON como texto | recrie com `new Date(texto)` |
| `serializes to the same string` (Jest) | `toBe` com duas datas iguais | use `toEqual` |
| `Invalid Date` | o texto não é uma data que o `Date` entende, como `'16/10/2025'` | monte com números: `new Date(ano, mes - 1, dia)` |

---

## :icon[triangle-alert] Erros comuns

:::warning
- Contar o mês a partir de 1: `new Date(2025, 10, 16)` é 16 de **novembro**
- `new Date('2025-10-16')`: meia-noite em UTC, que no Brasil ainda é o dia anterior
- `setDate` direto na data recebida: altera o pedido ou a constante do teste
- Trocar `getDay` (dia da semana) por `getDate` (dia do mês)
- Teste que chama `new Date()` sem data fixa: o resultado muda com o dia
- Comparar preço formatado digitando espaço comum: entre `R$` e o número, o `Intl` põe um **espaço não separável**
- `toBe` para comparar datas: use `toEqual`
:::

---

## Resumo

:::summary
- `Intl.NumberFormat` formata preço, nota e porcentagem em pt-BR; crie o formatador uma vez e chame `format`
- `new Date(ano, mes, dia)` conta o mês a partir de 0; texto só com a data é lido em UTC e pode virar o dia anterior
- `Date` é mutável: copie antes de `setDate`; subtrair datas dá milissegundos
- `proximoDiaUtil` pula o fim de semana, `preverEntrega` repete o salto e `Intl.DateTimeFormat` mostra "qui., 16 de out."
- Testes de data recebem `hoje` como parâmetro fixo; no JSON, a data vira texto e volta com `new Date(texto)`
:::

No E07, você escreve as suas primeiras decisões e repetições, e o `for` do `preverEntrega` deixa de ser código pronto.

---

## :icon[flask-conical] No laboratório

:::steps
1. `src/utils/validar.js`: `ehCepValido`, `ehCpfValido`, `mascararCep`, `mascararTelefone`, `mascararCpf` e `semAcentos`, com `validar.test.js`
2. `src/utils/datas.js`: `somarDias`, `diasEntre`, `ehDiaUtil`, `proximoDiaUtil`, a versão pronta de `preverEntrega` e `formatarData`
3. `src/utils/datas.test.js` com datas fixas: sexta, sábado, virada de mês, hora do pedido
4. `formatarPreco` com um `Intl.NumberFormat` criado uma vez; os testes do E05 seguem verdes
5. `src/scripts/pedido.js`: nome, CEP e CPF vêm do terminal; imprime saudação, preço, Pix, CEP e CPF mascarados e "Chega até"; grava `pedido.json`
6. `npm run verificar` sem erros
7. Commit "E06: textos, datas e máscaras" e `git push`
:::

**Critérios de entrega**: testes que não dependem do dia; nenhum `new Date('AAAA-MM-DD')`; máscaras que aguentam texto colado; previsão no script; CI verde. Entregue o link do repositório no sistema.

---

## :icon[milestone] Projeto 1 · Etapa 5: valor digitado e data

No seu `racha-conta`:

- `lerValor(texto)`: `'187,50'` e `'R$ 187,50'` viram `18750`; `'abc'` e `'0'` viram `null`
- `lerPessoas(texto)`: inteiro de 1 a 50, ou `null`
- `formatarDataHora(data)`: `'28/10/2026 19:42'`, testada com datas fixas
- `npm run racha "R$ 187,50"` mostra o restaurante, a data e a hora

Commit: `Projeto 1: etapa 5, valor digitado e data do recibo`. Enunciado completo e entrega: página do curso, em **Projetos**.
