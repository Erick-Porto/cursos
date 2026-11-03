---
title: Datas, recibo e a página web
summary: "Fim do Projeto 1: a data no recibo, o recibo inteiro como texto e a conta dividida numa página web."
module: linguagem-js
duration_minutes: 90
objectives:
  - Criar datas com Date e ler as partes com os getters, lembrando que o mês começa em 0
  - Formatar data e hora com zero à esquerda e testar com uma data fixa
  - Montar o recibo como texto, com push e join, e imprimi-lo no terminal
  - Abrir a interface web com npx serve e entregar o Projeto 1
---

# Datas, recibo e a página web

Programador Mobile · Encontro E12 · Aula 12 de 45

---

## O que você vai aprender

:::goal
- Criar uma data e ler o dia, o mês, o ano, a hora e o minuto
- Mostrar a data como no Brasil, `28/10/2026 19:42`, com zero à esquerda
- Testar uma regra de data sem depender do dia de hoje
- Montar o recibo do Racha-conta como um texto, uma linha por informação
- Abrir a interface web com um servidor local e entregar o Projeto 1
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **`Date`** | o tipo do JavaScript que guarda um instante: a data e a hora juntas |
| **getter** | um método que lê uma parte de um valor: `getMonth()` lê o mês da data |
| **zero à esquerda** | o `0` que completa um número de um dígito: `9` vira `09` |
| **quebra de linha** | o <kbd>Enter</kbd> dentro de um texto, escrito `'\n'` |
| **servidor local** | um programa no seu computador que entrega os arquivos da pasta ao navegador |
| **`localhost`** | o endereço do seu próprio computador |

---

## O recibo que falta

O `npm run racha` mostra tudo o que o projeto calcula, mas ainda não é um recibo: não diz quando foi o jantar e só existe no terminal.

::::columns
:::col
**Hoje**

```plaintext
Racha-conta: Cantina Bella Nonna
Pessoas na mesa: 4
Itens na conta: 4
(a tabela dos itens)
Unidades pedidas: 5
Itens acima de R$ 50: 2
Subtotal: R$ 187,50
...
Pessoa 4: R$ 51,56
```
:::
:::col
**No fim do dia**

```plaintext
Racha-conta
Cantina Bella Nonna
28/10/2026 19:42
Subtotal: R$ 187,50
Gorjeta (10%): R$ 18,75
Total: R$ 206,25
Pessoa 1: R$ 51,57
...
Pessoa 4: R$ 51,56
```
:::
::::

E a mesma conta numa página web, que faz as contas com as **suas** funções.

:::question
Um amigo paga a parte dele na semana que vem. Como ele sabe de qual jantar é aquele recibo?
:::

---

## Datas

O que o cupom fiscal anota sobre o momento da compra?

---

## :icon[calendar] Date: a data e a hora num valor só

Um **`Date`** guarda um instante: o dia e a hora juntos, como o canto do cupom fiscal que diz quando a compra aconteceu. Ele nasce com **`new`**, a palavra que cria um valor novo a partir de um modelo que o JavaScript já traz:

```javascript
const agora = new Date();                      // agora, pelo relógio do computador
const jantar = new Date(2026, 9, 28, 19, 42);  // 28 de outubro de 2026, 19h42
```

- Sem nada entre os parênteses, a data é a de **agora**: muda a cada vez que o código roda
- Com números, a data é **fixa**: ano, mês, dia, hora e minuto, nessa ordem
- **O mês começa em 0**, como as gavetas de uma lista: janeiro é o 0, outubro é o 9, dezembro é o 11

No E18, você cria os seus próprios modelos, as classes.

---

## :icon[calendar] Os getters: uma parte de cada vez

Para ler uma parte da data, use um **getter** (de *get*, "pegar"): um método que devolve a parte como número.

| Getter | Lê | Com o `jantar` |
|---|---|---|
| `getDate()` | o dia do mês | `28` |
| `getMonth()` | o mês, **a partir do 0** | `9` |
| `getFullYear()` | o ano, com 4 dígitos | `2026` |
| `getHours()` | a hora, de 0 a 23 | `19` |
| `getMinutes()` | o minuto | `42` |

:::warning Não confunda
O **`getDay()`** devolve o dia da **semana**, de 0 (domingo) a 6 (sábado): o `jantar` dá `3`, quarta-feira. Para o dia do mês, é o `getDate()`.
:::

---

## :icon[calendar] Datas na prática

**Caso 1: o mês para gente ler.** Some 1, porque o `Date` conta a partir do 0:

```javascript
const jantar = new Date(2026, 9, 28, 19, 42);
console.log(jantar.getDate(), jantar.getMonth() + 1, jantar.getFullYear());   // 28 10 2026
```

**Caso 2: a hora de agora.** Muda a cada vez que você roda:

```javascript
const agora = new Date();
console.log(agora.getHours(), agora.getMinutes());   // 13 45, se forem 13h45
```

**Caso 3: sem a hora, a data começa à meia-noite.**

```javascript
const natal = new Date(2026, 11, 25);
console.log(natal.getMonth(), natal.getHours());   // 11 0
```

:::tip
`console.log(jantar)` mostra `2026-10-28T22:42:00.000Z`: o horário de referência do mundo (o `Z` no fim), 3 horas à frente de Brasília. Para ler a data, use os getters.
:::

---

## Zero à esquerda

No relógio do celular, como aparecem nove horas e sete minutos?

---

## :icon[clock] String e padStart: o 9 vira 09

Os getters devolvem **números**, e número não tem zero à esquerda: 9 horas e 7 minutos aparecem como `9:7`. O relógio mostra `09:07`.

O **`padStart`** (de *pad*, "preencher", e *start*, "começo") completa um texto pela esquerda, até o tamanho pedido. Só que ele é um método de **texto**. Por isso, antes, o **`String()`** transforma o número em texto: o `9` da caixa de número vira o `'9'` da caixa de texto.

```javascript
const hora = String(9).padStart(2, '0');
console.log(hora);   // 09
```

| Parte | O que ela diz |
|---|---|
| `String(9)` | "transforme o número 9 no texto `'9'`" |
| `.padStart(2, '0')` | "complete com `'0'` pela esquerda até ter 2 caracteres" |

---

## :icon[clock] Zero à esquerda na prática

| Número | `String(...)` | `.padStart(2, '0')` |
|---|---|---|
| `9` | `'9'` | `'09'` |
| `7` | `'7'` | `'07'` |
| `19` | `'19'` | `'19'`: já tem 2, fica igual |
| `0` | `'0'` | `'00'` |

A hora de um alarme, com uma data fixa de 9h07:

```javascript
const alarme = new Date(2026, 10, 3, 9, 7);
const hora = String(alarme.getHours()).padStart(2, '0');
const minuto = String(alarme.getMinutes()).padStart(2, '0');
console.log(`${hora}:${minuto}`);   // 09:07
```

Sem o `String`, `alarme.getMinutes().padStart(2, '0')` para com `TypeError: alarme.getMinutes(...).padStart is not a function`: número não tem `padStart`.

---

## Teste com data fixa

Se a pergunta da prova mudasse a cada minuto, o gabarito ainda serviria?

---

## :icon[test-tube] Data fixa: o gabarito que não muda

Um teste é uma prova com gabarito que o computador corrige sozinho (E08). Com `new Date()`, a pergunta muda a cada minuto, e nenhum gabarito serve.

Por isso, a regra de hoje, a `formatarDataHora`, **recebe** a data pelo parâmetro, em vez de criar a sua:

```javascript
formatarDataHora(new Date());                     // no script: a data de agora
formatarDataHora(new Date(2026, 9, 28, 19, 42));  // no teste: sempre a mesma
```

- O **script** passa a data de agora: o recibo mostra quando a conta foi dividida
- O **teste** passa uma data fixa: a mesma entrada dá sempre a mesma saída, em qualquer dia
- Assim a regra continua **pura**, como todas do `conta.js`: recebe valores e devolve valores

---

## :icon[test-tube] Data fixa na prática

**Caso 1: o teste que só passaria num minuto.** Com a data de agora, ele fica vermelho:

```javascript
test('formatarDataHora com a data de agora', () => {
  expect(formatarDataHora(new Date())).toBe('28/10/2026 19:42');
});
```

```plaintext
Expected: "28/10/2026 19:42"
Received: "03/11/2026 13:49"
```

**Caso 2: datas escolhidas para conferir o que importa.**

| Data fixa | O que ela confere |
|---|---|
| `new Date(2026, 9, 28, 19, 42)` | tudo com 2 dígitos; o mês 9 sai como `10` |
| `new Date(2026, 2, 5, 9, 7)` | o zero à esquerda no dia, no mês, na hora e no minuto |

---

## :icon[milestone] Projeto 1 · Passo 1: formatarDataHora

No fim do `src/regras/conta.js`:

```javascript
export function formatarDataHora(data) {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  const hora = String(data.getHours()).padStart(2, '0');
  const minuto = String(data.getMinutes()).padStart(2, '0');
  return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
}
```

No fim do `conta.test.js`, com `formatarDataHora` no `import`:

```javascript
test('formatarDataHora mostra dia, mês, ano, hora e minuto', () => {
  const data = new Date(2026, 9, 28, 19, 42);
  expect(formatarDataHora(data)).toBe('28/10/2026 19:42');
});

test('formatarDataHora põe zero à esquerda', () => {
  const data = new Date(2026, 2, 5, 9, 7);
  expect(formatarDataHora(data)).toBe('05/03/2026 09:07');
});
```

**Pronto quando:** `npm test` passa com 43 testes.

---

## :icon[list-ordered] formatarDataHora, linha por linha

Com `new Date(2026, 2, 5, 9, 7)`, 5 de março, às 9h07:

| Linha | O getter devolve | Depois do `String` e do `padStart` |
|---|---|---|
| `dia` | `5` | `'05'` |
| `mes` | `2`, mais 1: `3` | `'03'` |
| `ano` | `2026` | `2026`, sem mudança: já tem 4 dígitos |
| `hora` | `9` | `'09'` |
| `minuto` | `7` | `'07'` |

- O `+ 1` fica **dentro** do `String(...)`: a conta é feita com número, e só o resultado vira texto
- A template string do `return` junta tudo com `/`, um espaço e `:`
- A função devolve `'05/03/2026 09:07'`, o texto que o segundo teste espera

---

## Quebra de linha

Como nove linhas soltas viram um recibo só, para imprimir ou copiar?

---

## :icon[receipt] Quebra de linha e join: a lista vira um texto

Dentro de um texto, **`'\n'`** é a **quebra de linha**: o <kbd>Enter</kbd>. O `console.log` mostra o que vem depois dela na linha de baixo:

```javascript
console.log('Linha 1\nLinha 2');
// Linha 1
// Linha 2
```

O **`join`** (juntar) faz o caminho contrário do `split` do E09. O `split` parte o texto nos separadores, como a barra de chocolate nos sulcos; o `join` junta os itens de uma lista num texto só, com um **separador** entre eles.

```javascript
const compras = ['arroz', 'feijão', 'café'];
console.log(compras.join(', '));   // arroz, feijão, café
```

Com `join('\n')`, o separador é a quebra de linha: um item em cada linha.

---

## :icon[receipt] join na prática

**Caso 1: o separador escolhe o jeito.**

```javascript
const lanches = ['X-salada', 'Suco', 'Pudim'];
console.log(lanches.join(' + '));   // X-salada + Suco + Pudim
console.log(lanches.join('\n'));
// X-salada
// Suco
// Pudim
```

**Caso 2: um recibo pequeno, com o `push` do E11 e o `join`.**

```javascript
const linhas = [];
linhas.push('Padaria Pão Quente');
linhas.push('Total: R$ 12,50');
console.log(linhas.join('\n'));
// Padaria Pão Quente
// Total: R$ 12,50
```

:::warning
`join()`, sem nada entre os parênteses, usa a vírgula sem espaço: `X-salada,Suco,Pudim`.
:::

---

## :icon[milestone] Projeto 1 · Passo 2: montarRecibo

Uma regra pura que monta o recibo inteiro e **devolve** o texto: quem imprime é o script. Ela recebe **`dados`**, uma ficha com cinco campos: `restaurante`, `subtotal` (em centavos), `percentual`, `pessoas` e `data`. `dados.subtotal` lê um campo da ficha.

No fim do `conta.js`, primeiro as contas, com as regras que você já tem:

```javascript
export function montarRecibo(dados) {
  const gorjeta = calcularGorjeta(dados.subtotal, dados.percentual);
  const total = dados.subtotal + gorjeta;
  const partes = dividirConta(total, dados.pessoas);
```

Logo abaixo, uma linha vazia e a lista `linhas`: como a `partes` do E11, ela nasce vazia e ganha um item por `push`. O `join` fecha:

```javascript
  const linhas = [];
  linhas.push(dados.restaurante);
  linhas.push(formatarDataHora(dados.data));
  linhas.push(`Subtotal: ${formatarReais(dados.subtotal)}`);
  linhas.push(`Gorjeta (${dados.percentual}%): ${formatarReais(gorjeta)}`);
  linhas.push(`Total: ${formatarReais(total)}`);
  for (let i = 0; i < partes.length; i++) {
    linhas.push(`Pessoa ${i + 1}: ${formatarReais(partes[i])}`);
  }
  return linhas.join('\n');
}
```

**Pronto quando:** `npm test` continua verde, com 43 testes, sem erro no arquivo.

---

## :icon[list-ordered] montarRecibo, push por push

Com a conta de exemplo, as contas dão gorjeta `1875`, total `20625` e partes `[5157, 5156, 5156, 5156]`. Depois, a lista `linhas` cresce assim:

| Linha do código | Entra na lista |
|---|---|
| `push(dados.restaurante)` | `'Cantina Bella Nonna'` |
| `push(formatarDataHora(dados.data))` | `'28/10/2026 19:42'` |
| os três `push` seguintes | `'Subtotal: R$ 187,50'`, `'Gorjeta (10%): R$ 18,75'` e `'Total: R$ 206,25'` |
| o `for`, volta 1 | `'Pessoa 1: R$ 51,57'` |
| o `for`, voltas 2 a 4 | `'Pessoa 2: R$ 51,56'` e as outras duas |
| `join('\n')` | as 9 linhas num texto só, uma embaixo da outra |

As linhas que o `racha.js` imprimia com `console.log` passam a morar aqui.

---

## :icon[milestone] Projeto 1 · Passo 3: o racha.js final

:::steps
1. No `import`, ficam `lerValor`, `lerPessoas` e `somarItens`, e entra `montarRecibo`. Saem `calcularGorjeta`, `formatarReais` e `dividirConta`: quem usa as três agora é o `montarRecibo`
2. Saem as duas linhas do `unidades` e do `caros`, logo abaixo do `JSON.parse`
3. Dentro do `else`, tudo dá lugar ao recibo
:::

```javascript
import { lerValor, lerPessoas, somarItens, montarRecibo } from '../regras/conta.js';
```

```javascript
} else {
  const recibo = montarRecibo({
    restaurante: conta.restaurante,
    subtotal: subtotalCentavos,
    percentual: conta.gorjeta,
    pessoas: pessoas,
    data: new Date(),
  });
  console.log(pc.bold('Racha-conta'));
  console.log(recibo);
}
```

**Pronto quando:** `npm run racha` mostra o recibo da Cantina com a data e a hora de agora, e `npm run racha "R$ 100,00" 3` termina com `Pessoa 3: R$ 36,66`.

---

## :icon[list-ordered] O racha.js final em português

| Linha | O que ela diz |
|---|---|
| `montarRecibo({ ... })` | "monte o recibo com esta ficha": a ficha nasce ali mesmo, entre as chaves |
| `subtotal: subtotalCentavos,` | "o campo `subtotal` recebe o valor da caixa `subtotalCentavos`" |
| `pessoas: pessoas,` | o campo e a caixa têm o mesmo nome: à esquerda o campo, à direita o valor |
| `data: new Date(),` | a data de agora: o recibo diz quando a conta foi dividida |
| `console.log(recibo);` | mostra o texto que a regra devolveu |

`npm run racha` (a data e a hora são as de agora):

```plaintext
Racha-conta
Cantina Bella Nonna
03/11/2026 13:49
Subtotal: R$ 187,50
Gorjeta (10%): R$ 18,75
Total: R$ 206,25
Pessoa 1: R$ 51,57
Pessoa 2: R$ 51,56
Pessoa 3: R$ 51,56
Pessoa 4: R$ 51,56
```

---

## Servidor local

Uma página web precisa da internet para funcionar?

---

## :icon[server] Servidor local: a cozinha no seu computador

No E01, o navegador é o cliente: ele pede, e o **servidor**, a cozinha, entrega os arquivos. A interface do Racha-conta não precisa da internet, mas precisa de um servidor, e ele pode rodar no seu computador: é o **servidor local**.

```bash
npx serve .
```

- **`npx`** roda um pacote sem instalar no projeto: o `serve` não entra no `package.json`
- **`serve`** é o pacote do servidor; o **`.`** quer dizer "esta pasta", a raiz
- **`localhost`** é o seu computador, e `3000` é a **porta**, a entrada desse servidor

Com dois cliques, a página abre como arquivo (`file://`), e o navegador, por segurança, não deixa um arquivo puxar outros do disco com `import`. Pelo servidor, o endereço é `http://localhost:3000/web/`, como o de um site.

---

## :icon[server] O servidor na prática

Na primeira vez, o npm pergunta se pode baixar o `serve`: responda `y` e <kbd>Enter</kbd>.

```plaintext
Need to install the following packages:
serve@14.2.6
Ok to proceed? (y)
```

Depois, o servidor mostra o endereço e fica esperando os pedidos do navegador:

```plaintext
   ┌──────────────────────────────────────────┐
   │                                          │
   │   Serving!                               │
   │                                          │
   │   - Local:    http://localhost:3000      │
   │   - Network:  http://192.168.0.15:3000   │
   │                                          │
   │   Copied local address to clipboard!     │
   │                                          │
   └──────────────────────────────────────────┘
```

- O terminal fica **preso** ao servidor: para outros comandos, abra outro terminal, no **+** do painel
- Para parar o servidor, <kbd>Ctrl</kbd> + <kbd>C</kbd>
- Porta 3000 ocupada? Ele escolhe outra e avisa `This port was picked because 3000 is in use.`: use a que ele mostrar

---

## :icon[globe] A interface pronta usa as suas funções

A interface vem pronta, em três arquivos, como a casa do E01: `index.html` (as paredes), `estilo.css` (a pintura) e `tela.js` (os interruptores). Você não muda nada neles.

A página não faz conta nenhuma: o `tela.js` importa as **suas** funções de `../src/regras/conta.js`. O `..` sobe da pasta `web` para a raiz.

```plaintext
racha-conta/              o npx serve . abre aqui
├── src/regras/conta.js   as suas funções
└── web/
    ├── index.html
    ├── estilo.css
    └── tela.js           importa ../src/regras/conta.js
```

- O servidor abre na **raiz**: aberto dentro de `web/`, ele não enxerga o `src`
- As regras são puras, sem `fs`: no navegador, o `fs` não existe
- No fim da página, "Funções que a página usa" marca as 7 que ela encontrou

---

## :icon[milestone] Projeto 1 · Passo 4: a interface web

:::steps
1. Baixe o [interface-web.zip](materiais/projeto-1/interface-web.zip) e descompacte
2. Na raiz do `racha-conta`, crie a pasta `web` e copie para ela, sem a pasta do zip, o `index.html`, o `estilo.css` e o `tela.js`
3. No terminal, **na raiz**: `npx serve .`
4. No navegador: `http://localhost:3000/web/`
5. Restaurante Cantina Bella Nonna, valor `R$ 187,50`, 4 pessoas, 10%, e **Dividir a conta**
:::

**Pronto quando:** a página abre sem aviso no topo, com as 7 funções marcadas, e mostra Total R$ 206,25, Pessoa 1 com R$ 51,57, as outras três com R$ 51,56, "Nenhum centavo sumiu." e o recibo com a data de agora. Com **Sem gorjeta**, as partes viram 46,88 + 46,88 + 46,87 + 46,87.

---

## :icon[milestone] Projeto 1 · Sua vez: o teste do recibo

Agora, sozinho. No `conta.test.js`, com `montarRecibo` no `import`, um teste para o recibo da conta de exemplo:

- restaurante `'Cantina Bella Nonna'`, subtotal `18750`, gorjeta de `10`% e `4` pessoas
- a data fixa de 28 de outubro de 2026, às 19h42
- o teste confere as **9 linhas** do recibo, uma por uma

:::tip Dicas
- A ficha vai entre os parênteses do `montarRecibo`, como no `racha.js`; a data entra pelo campo `data`
- `recibo.split('\n')` transforma o texto numa lista de linhas, e o `toEqual` compara com a lista esperada
- As 9 linhas são as do recibo da Cantina, com `'28/10/2026 19:42'` na segunda
:::

**Pronto quando:** `npm test` passa com 44 testes.

---

## :icon[milestone] Projeto 1 · Sua vez: o print e o README

1. Com a conta dividida, recorte a página com <kbd>Win</kbd> + <kbd>Shift</kbd> + <kbd>S</kbd>, clique no aviso do canto da tela e salve (<kbd>Ctrl</kbd> + <kbd>S</kbd>) como `interface.png`, numa pasta nova `docs`, na raiz
2. No README, o print logo abaixo da frase do começo
3. A seção "Como rodar na web", com o `npx serve .` e o endereço
4. Em "O que ele mostra", a saída nova do `npm run racha`

:::tip Imagem no Markdown
`![Interface do racha-conta com a conta dividida](docs/interface.png)`: entre colchetes, a descrição da imagem; entre parênteses, o caminho. Tudo em minúsculas: o GitHub diferencia.
:::

**Pronto quando:** depois do `git push`, o README no GitHub mostra o print e as duas seções.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Received: "28/09/2026 19:42"` | faltou o `+ 1` do mês | `data.getMonth() + 1` |
| `Received: "03/10/2026 19:42"` | `getDay`: o dia da semana | `getDate()` |
| `padStart is not a function` | `padStart` direto no número | `String(...)` antes |
| `A página não encontrou as suas funções` | aberta com dois cliques | `npx serve .` e `http://localhost:3000/web/` |
| `Não deu para importar src/regras/conta.js` | servidor aberto dentro de `web/` | <kbd>Ctrl</kbd> + <kbd>C</kbd>, `cd ..` e `npx serve .` |
| `Faltam funções em src/regras/conta.js` | nome diferente ou sem `export` | conferir letra por letra |

---

## :icon[milestone] Projeto 1 · Etapa 9 pronta

Antes de entregar, rode na raiz:

| Comando | Precisa aparecer |
|---|---|
| `npm test` | `Tests: 44 passed, 44 total` |
| `npm run racha` | o recibo, com a hora de agora |
| `npm run racha "R$ 100,00" 3` | 36,67 + 36,67 + 36,66 |
| `npm run racha abc` | o aviso `Valor inválido: "abc"...` |
| a página web | a conta dividida, sem aviso |

Depois, o commit `Projeto 1: etapa 9, recibo e página web` e o `git push`. No GitHub, confira o print no README e os 9 commits.

**Entrega:** na página do curso, em **Projetos**, abra o Projeto 1, cole o link do repositório (`https://github.com/seu-usuario/racha-conta`) e envie. Prazo: **início do E13**.

---

## Resumo

:::summary
- `new Date()` é a data de agora; `new Date(2026, 9, 28, 19, 42)` é uma data fixa, e o mês começa em 0
- Os getters leem as partes: `getDate`, `getMonth`, `getFullYear`, `getHours` e `getMinutes`; o `getDay` é o dia da semana
- `String(9).padStart(2, '0')` dá `'09'`: o número vira texto, e o texto ganha o zero à esquerda
- Teste de data usa data fixa: a regra recebe a data, e só o script passa a de agora
- `'\n'` é a quebra de linha; `join('\n')` junta a lista num texto, um item por linha
- `npx serve .` na raiz liga um servidor local; a página fica em `http://localhost:3000/web/` e usa as suas funções
:::

---

## :icon[arrow-right] Próximos passos

No E13 começa o **Projeto 2, a Agenda de contatos**, e a ficha ganha uma aula só dela:

- :icon[contact] a ficha de um contato: criar, ler e mudar os campos
- :icon[braces] o objeto a fundo: campo novo, colchetes e `Object.keys`
- :icon[package] um kit pronto, com testes e uma interface web, como a de hoje
- :icon[send] o Projeto 1 entregue até o início do encontro
