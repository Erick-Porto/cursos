---
title: Datas, números e JSON
summary: Formate preço e data em pt-BR com Intl, calcule prazos em dias úteis e leve datas pelo JSON sem erro.
module: linguagem-js
duration_minutes: 40
objectives:
  - Formatar preços, notas e datas em pt-BR com Intl.NumberFormat e Intl.DateTimeFormat
  - Criar datas, somar dias e calcular a diferença entre duas datas com Date
  - Calcular uma previsão de entrega em dias úteis e testá-la com datas fixas
  - Converter objetos com datas para JSON e de volta sem perder o dia
---

# Datas, números e JSON

Programador Mobile: Módulo Específico · Encontro E33 · Aula 48 de 71

---

## O que você vai aprender

:::goal
- Formatar preço, nota e desconto com `Intl.NumberFormat`
- Criar e ler datas com `Date`, somar dias e medir a diferença entre duas datas
- Calcular a previsão de entrega em dias úteis e mostrá-la com `Intl.DateTimeFormat`
- Testar código de datas sem depender do dia em que o teste roda
- Mandar datas pelo JSON e trazê-las de volta
:::

---

## Preço, prazo e data em toda tela de compra

Abra o detalhe de um produto em qualquer app de compras: "R$ 189,90 no Pix", "Chega até qui., 16 de out.", "Pedido feito há 2 dias". Parece simples, mas cada linha esconde uma armadilha:

- a previsão que cai num domingo, quando a transportadora não entrega
- o pedido do dia 16 que aparece como dia 15 no histórico
- o teste que passa na segunda e falha no sábado

Hoje a Lojinha ganha a previsão de entrega no Detalhe, sem nenhum desses erros.

:::question
Por que um teste que usa a data de hoje pode passar na segunda-feira e falhar no sábado?
:::

---

## :icon[banknote] Intl.NumberFormat: dinheiro em pt-BR

```javascript
const moeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

moeda.format(1299.9); // 'R$ 1.299,90'
moeda.format(0.5);    // 'R$ 0,50'
```

- O **Intl** é a API de internacionalização do JavaScript. Um **formatador** guarda o idioma e as opções, e o `format` aplica a cada número
- Crie o formatador uma vez, fora da função, e reaproveite: numa lista de 100 produtos, criar um por cartão é desperdício
- O `toLocaleString('pt-BR', { ... })` do seu `formatarPreco` dá o mesmo resultado
- Com `currency: 'USD'`, o mesmo formatador mostra `US$ 9,99`

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
pct.format(0.05); // '5%'

(4.5).toFixed(1); // '4.5': ponto, padrão americano
```

- `minimumFractionDigits` e `maximumFractionDigits` fixam as casas decimais: a nota do produto sempre com uma
- `percent` multiplica por 100: passe `0.05` para mostrar o desconto do Pix, não `5`
- `toFixed` devolve texto com ponto decimal: na tela brasileira, use o `Intl`

---

## :icon[calendar] Date: criar e ler uma data

```javascript
const agora = new Date();              // agora, pelo relógio do celular
const entrega = new Date(2025, 9, 16); // 16 de outubro de 2025

entrega.getDate();     // 16
entrega.getMonth();    // 9: os meses começam em 0
entrega.getFullYear(); // 2025
entrega.getDay();      // 4: quinta-feira (0 é domingo, 6 é sábado)
```

- Um **`Date`** guarda um instante: dia e hora
- No construtor com números, o mês vai de 0 (janeiro) a 11 (dezembro): `new Date(2025, 10, 16)` é 16 de **novembro**
- `getDate` é o dia do mês; `getDay` é o dia da semana. Os nomes enganam, então confira duas vezes

---

## :icon[clock] A armadilha da data em texto

A API manda `'2025-10-16'`, e parece seguro criar a data a partir desse texto:

```javascript
const data = new Date('2025-10-16');
data.getDate(); // 15 no Brasil
// Wed Oct 15 2025 21:00:00 GMT-0300
```

Uma string só com a data é lida como **meia-noite em UTC**, o horário de referência mundial. Em Brasília (UTC-3), isso ainda é 21h do dia anterior: o pedido do dia 16 aparece como dia 15. Monte a data pelos números:

```javascript
const partes = '2025-10-16'.split('-');
const certa = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
certa.getDate(); // 16, no fuso do celular
```

---

## :icon[calendar-clock] Somar dias sem estragar a original

```javascript
function somarDias(data, dias) {
  const nova = new Date(data.getFullYear(), data.getMonth(), data.getDate());
  nova.setDate(nova.getDate() + dias);
  return nova;
}

somarDias(new Date(2025, 9, 31), 1);  // 1 de novembro de 2025
somarDias(new Date(2025, 11, 31), 1); // 1 de janeiro de 2026
```

- `setDate` **muda** o objeto: um `Date` é mutável, ao contrário da string
- Por isso a função cria uma cópia antes; montar a cópia com ano, mês e dia também zera a hora
- Passou do fim do mês? O `Date` ajusta sozinho: o dia 32 de outubro vira 1 de novembro

---

## :icon[hourglass] Diferença entre datas

```javascript
const UM_DIA = 24 * 60 * 60 * 1000; // um dia em milissegundos

function diasEntre(inicio, fim) {
  return Math.round((fim - inicio) / UM_DIA);
}

const hoje = new Date(2025, 9, 13);
const vencimento = new Date(2025, 9, 16);
diasEntre(hoje, vencimento); // 3: "Seu boleto vence em 3 dias"
```

- Subtrair dois `Date` dá a diferença em **milissegundos**
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
- `11`: `entrega` e `pedido` são o **mesmo objeto**, então o `setDate` mudou a data do pedido também
- `6`: 11 de outubro de 2025 é um sábado, e a entrega cairia no fim de semana
- `10`: o dia 32 de outubro vira 1 de novembro, o mês 10

Para não alterar o pedido, copie a data primeiro, como no `somarDias`.
:::

---

## :icon[truck] Dias úteis: a previsão de entrega

```javascript
export function ehDiaUtil(data) {
  const dia = data.getDay(); // 0 = domingo, 6 = sábado
  return dia !== 0 && dia !== 6;
}

export function preverEntrega(diasUteis, hoje = new Date()) {
  const data = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  let contados = 0;
  while (contados < diasUteis) {
    data.setDate(data.getDate() + 1);
    if (ehDiaUtil(data)) contados++;
  }
  return data;
}
```

É o laço do vencimento do boleto (E31), agora numa função própria, que também zera a hora. Feriados ficam de fora por enquanto.

---

## :icon[truck] Volta a volta até a entrega

:::center
![Animação: a partir de quinta, 9 de outubro de 2025, a data avança um dia por volta; sexta conta 1, sábado e domingo não contam, de segunda a quinta contam 2 a 5 e a entrega chega na quinta, 16](images/e33-dias-uteis.svg)
:::

Pedido na quinta, 9 de outubro de 2025, com 5 dias úteis: sexta conta 1, sábado e domingo não contam, e de segunda a quinta contam 2 a 5. Chega na quinta, 16.

---

## :icon[calendar-check] Intl.DateTimeFormat: a data no padrão brasileiro

```javascript
const formatoCurto = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
});

formatoCurto.format(new Date(2025, 9, 16)); // 'qui., 16 de out.'
```

| Opções | Resultado |
|---|---|
| `{ dateStyle: 'short' }` | `16/10/2025` |
| `{ dateStyle: 'long' }` | `16 de outubro de 2025` |
| `{ weekday: 'long' }` | `quinta-feira` |
| `{ hour: '2-digit', minute: '2-digit' }` | `09:05` |

:::tip
No celular, quem formata é o `Intl` do Hermes, o motor do app; no Jest, é o do Node. A pontuação pode variar um pouco entre os dois: confira a tela no Expo Go.
:::

---

## :icon[test-tube] Testar datas: nunca a data de hoje

Um teste que usa `new Date()` muda de resultado conforme o dia. Por isso `preverEntrega` recebe `hoje` como **parâmetro**, com `new Date()` como padrão: a tela não passa nada, e o teste passa uma data fixa.

```javascript
import { formatarData, preverEntrega } from './datas';

const QUINTA = new Date(2025, 9, 9); // 9 de outubro de 2025

test('5 dias úteis a partir de quinta chegam na quinta seguinte', () => {
  expect(preverEntrega(5, QUINTA)).toEqual(new Date(2025, 9, 16));
});

test('formata com dia da semana e mês abreviados', () => {
  expect(formatarData(new Date(2025, 9, 16))).toBe('qui., 16 de out.');
});
```

O `toEqual` compara dois `Date` pelo instante. O `toBe` falharia: são dois objetos diferentes.

---

## :icon[braces] JSON e datas: ida e volta

```javascript
const pedido = { id: 42, criadoEm: new Date(2025, 9, 9, 14, 30) };

const texto = JSON.stringify(pedido);
// '{"id":42,"criadoEm":"2025-10-09T17:30:00.000Z"}'

const volta = JSON.parse(texto);
typeof volta.criadoEm;               // 'string', não Date
new Date(volta.criadoEm).getHours(); // 14 de novo, no fuso do celular
```

- **JSON** é texto: a API (E38) e o armazenamento do aparelho (E39) só trocam texto
- O `stringify` transforma o `Date` num texto em UTC: 14h30 em Brasília vira `17:30:00.000Z`
- O `parse` não sabe que aquilo era uma data. Recrie com `new Date(texto)`: com hora e `Z`, o instante é exato e o dia não muda

---

## :icon[file-warning] JSON.parse pode lançar erro

```javascript
function lerJSON(texto, padrao) {
  try {
    return JSON.parse(texto);
  } catch {
    return padrao; // texto vazio ou corrompido
  }
}

lerJSON('{"itens":[]}', null); // { itens: [] }
lerJSON('', null);             // null, sem derrubar o app

console.log(JSON.stringify(pedido, null, 2)); // indentado, fácil de ler
```

- Texto que não é JSON válido faz o `parse` lançar um `SyntaxError`: trate com `try/catch`, como no E32
- O `stringify` descarta `undefined` e funções, e `NaN` vira `null`: só dados simples sobrevivem
- No E39, o `ler(chave, padrao)` do armazenamento faz exatamente isso

---

## :icon[triangle-alert] Erros comuns

:::warning
- Contar o mês a partir de 1: `new Date(2025, 10, 16)` é 16 de **novembro**
- `new Date('2025-10-16')`: meia-noite em UTC, que no Brasil ainda é o dia anterior
- `setDate` direto na data recebida: altera o pedido, o estado ou a constante do teste
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
- `preverEntrega` pula sábados e domingos, e `Intl.DateTimeFormat` mostra "qui., 16 de out."
- Testes de data recebem `hoje` como parâmetro fixo; no JSON, a data vira texto e volta com `new Date(texto)`
:::

---

## :icon[flask-conical] No laboratório

:::steps
1. `src/utils/datas.js`: `ehDiaUtil`, `preverEntrega(diasUteis, hoje = new Date())` e `formatarData(data)`
2. `src/utils/datas.test.js` com datas fixas: sexta, sábado, virada de mês, hora do pedido
3. `mascararCep` e `mascararCpf` em `mascaras.js`, testadas com digitação, texto colado e excesso
4. No Detalhe, abaixo do preço: "Chega até qui., 16 de out.", com 5 dias úteis
5. No Checkout, as máscaras no CEP (sem o `maxLength={8}`) e no CPF do boleto
6. `formatarPreco` com um `Intl.NumberFormat` criado uma vez; `npm run verificar` sem erros
7. Commit "E33: datas e máscaras" e `git push`
:::

**Critérios de entrega**: testes que não dependem do dia; nenhum `new Date('AAAA-MM-DD')`; máscaras que aguentam texto colado; previsão no Detalhe; CI verde. Entregue o link do repositório no sistema.
