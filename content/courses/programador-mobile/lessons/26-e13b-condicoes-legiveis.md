---
title: "Condições legíveis: ternário, ??, ?. e guard clauses"
summary: "Ternário, ??, ?. e guard clauses nas regras de frete e cupom da Lojinha, testadas nas bordas."
module: classes-e-controle
duration_minutes: 40
objectives:
  - Escolher entre dois valores com o ternário, numa linha e dentro de template strings
  - Tratar valores ausentes com ?? e ?. sem confundir com ||
  - Reescrever uma regra aninhada com condições com nome e guard clauses
  - Implementar e testar as regras de frete e cupom e usá-las num script de terminal
---

# Condições legíveis: ternário, ??, ?. e guard clauses

Programador Mobile · Encontro E13 · Aula 26 de 89

---

## O que você vai aprender

:::goal
- Escolher entre dois valores com o ternário, numa linha e dentro de template strings
- Tratar valores que faltam com `??` e `?.`, sem confundir com `||`
- Reescrever uma regra em pirâmide com condições com nome e guard clauses
- Implementar `calcularFrete` e `validarCupom` com testes e usá-las num script de terminal
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **ternário** | um `if` de uma linha que escolhe entre dois valores: `condição ? sim : não` |
| **expressão** | um trecho de código que produz um valor e cabe dentro de outro: `qtd === 1`, `2 + 2` |
| **`??`** | "se não veio nada, use este": troca só `null` e `undefined` |
| **`?.`** | "se existir, leia": para sem erro quando o valor falta |
| **guard clause** | um teste no começo da função que sai cedo, com `return`, quando a regra não se aplica |
| **número mágico** | um número solto no código, sem um nome que diga o que ele é |

---

## Uma regra difícil de ler

A regra de frete escrita às pressas, com um `if` dentro do outro:

```javascript
function calcularFrete(subtotal, cep) {
  if (cep) {
    if (ehCepValido(cep)) {
      if (subtotal < 150) {
        const digitos = cep.replace(/\D/g, '');
        return FRETE_POR_DIGITO[digitos[0]];
      } else {
        return 0;
      }
    } else {
      return null;
    }
  }
  return null;
}
```

Ela funciona. Mas, para saber o que acontece com um CEP incompleto, você desce três degraus e volta procurando qual `else` é de qual `if`.

:::question
Em que situações essa função devolve `null`? Quanto tempo você levou para ter certeza?
:::

---

## Ternário

Na frase "1 item" ou "3 itens", quem escolhe a palavra certa?

---

## :icon[arrow-left-right] Ternário: um valor, não passos

O **ternário** é um `if` de uma linha que escolhe entre **dois valores**: `condição ? valorSeSim : valorSeNão`. Leia o `?` como "então" e o `:` como "senão". É a bifurcação do `if` em miniatura: em vez de escolher um caminho, escolhe um valor.

No E05b, ele escolheu `qtd === 1 ? 'item' : 'itens'`. O ternário é uma **expressão**: produz um valor e cabe num `const`, num `return` e dentro do `${ }`. O `if` é uma **instrução**: decide que passos rodam.

```javascript
// bom: escolhe um valor
console.log(`Frete: ${frete === 0 ? 'Grátis' : formatarPreco(frete)}`);
```

Em português: "escreva Frete e, então, Grátis se o frete for zero; senão, o valor formatado".

---

## :icon[list-checks] Ternário na prática

**Caso 1: singular ou plural.**

```javascript
for (const qtd of [1, 3]) {
  console.log(`${qtd} ${qtd === 1 ? 'item' : 'itens'}`);
}
// 1 item
// 3 itens
```

**Caso 2: frete grátis ou o valor.**

```javascript
const frete = 0;
console.log(`Frete: ${frete === 0 ? 'Grátis' : formatarPreco(frete)}`); // Frete: Grátis
```

Com `frete = 14.9`, sai `Frete: R$ 14,90`.

**Caso 3: o aviso da vitrine.**

```javascript
const estoque = 0;
console.log(estoque > 0 ? 'Disponível' : 'Esgotado'); // Esgotado
```

---

## :icon[scale] Ternário ou if?

O ternário escolhe um valor. Quando cada caminho executa passos diferentes, use `if`:

```javascript
// ruim: ternário só para executar passos
cupom.valido ? aplicados.push(chave) : recusados.push(chave);

// melhor: passos diferentes pedem if
if (cupom.valido) {
  aplicados.push(chave);
} else {
  recusados.push(chave);
}
```

- Ternário: **um valor** entre dois, com condição curta
- `if`: passos diferentes em cada caminho, ou mais de dois caminhos
- No E21, no React, só expressões cabem dentro da tela: o ternário vai aparecer muito

---

## :icon[circle-alert] Ternário dentro de ternário

Três resultados num ternário só:

```javascript
const texto = frete === null ? 'Informe o CEP' : frete === 0 ? 'Grátis' : formatarPreco(frete);
```

Funciona, mas pede duas leituras, e quem mexer depois erra a ordem. Regra prática: **um** ternário por expressão. Com três ou mais resultados, use uma função com `if`, como a `textoDoFrete` da aula 25, e chame a função onde precisa do texto:

```javascript
console.log(`Frete: ${textoDoFrete(frete)}`);
```

A linha se lê como frase, e a decisão ganha um lugar onde pode ser testada.

---

## O operador ??

Num formulário, quem responde "0 filhos" deixou o campo em branco?

---

## :icon[shield-check] ??: padrão só para o que falta

O `a ?? b` devolve `b` só quando `a` é `null` ou `undefined`: quando o valor **não veio**. Pense num formulário: quem responde "0 filhos" respondeu; só o campo em branco vira "não informado". O nome do `??` é **coalescência nula**.

No E05b, o `||` deu valor padrão: `process.argv[3] || 'Visitante'`. Ele troca **qualquer** falsy, inclusive `0` e `''`: trata o "0 filhos" como campo em branco.

```javascript
const frete = calcularFrete(180, '01310-100'); // 0: frete grátis

frete || 'Informe o CEP'; // 'Informe o CEP': o 0 foi trocado
frete ?? 'Informe o CEP'; // 0: o frete grátis continua lá
```

---

## :icon[list-checks] ?? na prática

**Caso 1: somar um frete que pode faltar.** Sem CEP, o `calcularFrete` devolve `null`:

```javascript
const centavosDoFrete = paraCentavos(frete ?? 0); // sem CEP, soma 0
```

**Caso 2: a nota zero.**

```javascript
const avaliacao = 0;
console.log(avaliacao ?? 'Sem nota'); // 0: a nota zero é uma nota
console.log(avaliacao || 'Sem nota'); // Sem nota: o || apagou o zero
```

**Caso 3: o desconto que não veio.**

```javascript
let desconto;
console.log(desconto ?? 0); // 0
```

- Use **`??`** quando `0`, `''` ou `false` são valores válidos: frete, desconto, quantidade, nota
- Use `||` só quando qualquer falsy deve mesmo virar o padrão

---

## O operador ?.

Se o pedido é para retirar na loja, qual é o CEP da entrega?

---

## :icon[link] ?.: ler sem quebrar

O **encadeamento opcional** `?.` lê um campo só se o objeto existir. É como olhar antes de entrar: se não há casa no endereço, você volta sem tropeçar. Um pedido de retirada na loja não tem `entrega`, e ler um campo de `undefined` para o script:

```javascript
const pedido = { id: 1042, status: 'pago' }; // sem entrega

pedido.entrega.cep;  // TypeError: Cannot read properties of undefined
pedido.entrega?.cep; // undefined, sem erro
pedido.entrega?.cep ?? 'Retirada na loja'; // 'Retirada na loja'
```

- O `?.` para no primeiro `null` ou `undefined` e devolve `undefined`
- Ele corta a cadeia inteira: em `codigo?.trim().toUpperCase()`, com `codigo` nulo, nenhum dos dois métodos roda
- Use só onde o valor pode mesmo faltar: espalhado por todo lado, ele esconde bugs

---

## :icon[list-checks] ?. na prática

**Caso 1: o cliente sem endereço.**

```javascript
const cliente = { nome: 'Ana' };
console.log(cliente.endereco?.cidade ?? 'Sem endereço'); // Sem endereço
```

**Caso 2: um método num valor que faltou.**

```javascript
let codigo; // o cupom não foi digitado
console.log(codigo?.trim()); // undefined, sem TypeError
```

Sem o `?.`, `codigo.trim()` pararia com `Cannot read properties of undefined (reading 'trim')`.

**Caso 3: a lista que pode não vir.**

```javascript
const pedidoSemItens = { id: 1042 };
console.log(pedidoSemItens.itens?.length ?? 0); // 0
```

---

## Pratique

:::example Preveja o resultado
```javascript
const pedido = { id: 1042, status: 'pago', cupom: null, entrega: { cep: '' } };
```

1. `pedido.cupom?.codigo ?? 'Sem cupom'`
2. `pedido.entrega?.cep || 'CEP não informado'`
3. `pedido.entrega?.cep ?? 'CEP não informado'`
4. `pedido.pagamento?.parcelas ?? 1`
5. `pedido.cupom.codigo`
:::

:::tip Resposta
| Item | Resultado | Por quê |
|---|---|---|
| 1 | `'Sem cupom'` | `cupom` é `null` |
| 2 | `'CEP não informado'` | `''` é falsy |
| 3 | `''` | `??` só troca `null` e `undefined` |
| 4 | `1` | `pagamento` não existe |
| 5 | `TypeError` | ler `codigo` de `null` |
:::

---

## Condições com nome

O que se entende mais rápido: "frete grátis" ou "subtotal >= 150"?

---

## :icon[tag] Condições com nome

Uma condição longa obriga quem lê a decifrar a regra. Guarde o sim ou não numa constante com nome, como uma caixa com etiqueta: quem lê entende pela etiqueta, sem abrir a caixa.

```javascript
// antes: o que isso quer dizer?
if (/^\d{5}-?\d{3}$/.test(cep.trim()) && subtotal >= 150) { /* ... */ }

// depois
const cepValido = ehCepValido(cep); // do E06
const temFreteGratis = subtotal >= FRETE_GRATIS_A_PARTIR_DE;

if (cepValido && temFreteGratis) { /* ... */ }
```

- Booleanos com nome de pergunta de sim ou não: `cepValido`, `temFreteGratis`, `podeAplicar`
- Uma função com nome é uma condição reaproveitável: o `ehCepValido` do E06 esconde a regex
- **Número mágico** vira **constante** em maiúsculas, como a `FRETE_GRATIS_A_PARTIR_DE` do E10: o `150` ganha nome, e a regra muda num lugar só

---

## :icon[list-checks] Condições com nome na prática

A página do produto decide dois avisos:

```javascript
const produto = { nome: 'Tênis de Corrida', preco: 349.9, estoque: 1 };

const podeParcelar = maximoDeParcelas(produto.preco) > 1;
const ultimaUnidade = produto.estoque === 1;

console.log(podeParcelar, ultimaUnidade); // true true
if (ultimaUnidade) console.log(`Corra: última unidade de ${produto.nome}`);
// Corra: última unidade de Tênis de Corrida
```

- **`podeParcelar`**: "dá para parcelar?". O `maximoDeParcelas` da aula 25 responde 6, e 6 é mais que 1
- **`ultimaUnidade`**: "é a última?". Com estoque 1, sim
- O `if` se lê como frase: "se é a última unidade, avise"

---

## Frete por região

Por que o frete para Rio Branco custa mais que para São Paulo?

---

## :icon[truck] A tabela de frete da Lojinha

O **primeiro dígito do CEP** indica a região:

| 1º dígito | Estados | Frete (R$) |
|---|---|---|
| 0 e 1 | SP | 9,90 |
| 2 e 3 | RJ, ES e MG | 14,90 |
| 4 e 5 | BA, SE, PE, AL, PB e RN | 19,90 |
| 6 | CE, PI, MA, PA, AP, AM, RR e AC | 24,90 |
| 7 | DF, GO, TO, MT, MS e RO | 19,90 |
| 8 e 9 | PR, SC e RS | 14,90 |

- **Grátis** com subtotal dos produtos a partir de R$ 150,00
- CEP com 8 dígitos, com ou sem hífen; inválido devolve `null`, mesmo acima de R$ 150

---

## :icon[map-pin] Da tabela ao código: FRETE_POR_DIGITO

Traduzir um dígito num valor, sem outra lógica, é trabalho de **dicionário**, como o `rotulosDeOrdem` do E08: você procura a chave e acha o valor.

```javascript
// primeiro dígito do CEP: valor do frete em reais
const FRETE_POR_DIGITO = {
  0: 9.9, // SP
  1: 9.9, // SP
  2: 14.9, // RJ e ES
  3: 14.9, // MG
  4: 19.9, // BA e SE
  5: 19.9, // PE, AL, PB e RN
  6: 24.9, // CE, PI, MA, PA, AP, AM, RR e AC
  7: 19.9, // DF, GO, TO, MT, MS e RO
  8: 14.9, // PR e SC
  9: 14.9, // RS
};
```

- Cada faixa da tabela de frete vira linhas de código: conferir é ler lado a lado
- Um `switch` com dez `case` faria o mesmo em mais que o dobro de linhas

---

## :icon[list-checks] Dicionário na prática

```javascript
FRETE_POR_DIGITO['6']; // 24.9: a chave 6
FRETE_POR_DIGITO[6];   // 24.9: o número vira texto e acha a mesma chave

const digitos = '69900-000'.replace(/\D/g, ''); // '69900000': só os dígitos
FRETE_POR_DIGITO[digitos[0]];                   // 24.9: o primeiro dígito, '6'
```

- As chaves de um objeto são sempre texto: `FRETE_POR_DIGITO['6']` e `FRETE_POR_DIGITO[6]` acham a mesma chave
- O `replace(/\D/g, '')` do E06 tira tudo o que não é dígito, como o hífen
- `digitos[0]` é o primeiro caractere do texto: a região. Rio Branco (`69900-000`) paga R$ 24,90

---

## Guard clauses

Num show, o segurança barra quem não tem ingresso na porta ou lá dentro?

---

## :icon[corner-down-right] Guard clauses: saia cedo

Uma **guard clause** (em inglês, cláusula de guarda) trata logo no início o caso que impede a regra e sai com `return`. É o segurança na porta do show: quem não pode entrar é barrado ali, e lá dentro só fica quem passou. O caminho principal fica sem `else` e sem degraus:

```javascript
// src/regras/frete.js: FRETE_GRATIS_A_PARTIR_DE já vem do E10
export function calcularFrete(subtotal, cep) {
  const cepValido = ehCepValido(cep ?? ''); // do E06
  if (!cepValido) return null;
  if (subtotal >= FRETE_GRATIS_A_PARTIR_DE) return 0;

  const digitos = cep.replace(/\D/g, '');
  return FRETE_POR_DIGITO[digitos[0]];
}
```

Leia de cima para baixo: CEP ruim sai, compra grande sai, o resto paga a região. Mesmo resultado da pirâmide, sem degraus.

---

## :icon[list-ordered] As guardas em português

| Linha | O que ela diz |
|---|---|
| `ehCepValido(cep ?? '')` | "o CEP é válido?". Sem CEP, testa um texto vazio |
| `if (!cepValido) return null;` | "não é válido? Saia com `null`". O `!` quer dizer "não" |
| `if (subtotal >= FRETE_GRATIS_A_PARTIR_DE) return 0;` | "compra a partir de R$ 150? Saia com frete grátis" |
| `cep.replace(/\D/g, '')` | "só os dígitos do CEP" |
| `return FRETE_POR_DIGITO[digitos[0]];` | "o frete da região, pelo primeiro dígito" |

- A ordem das guardas é regra de negócio: o CEP vem antes, porque não há entrega em CEP inválido, nem de graça
- `cep ?? ''` protege do `undefined`: o `ehCepValido` chama `trim`, e `undefined.trim()` é `TypeError`

---

## :icon[corner-down-right] O caminho das guardas

:::center
![Fluxograma: calcularFrete testa primeiro cepValido e, se não, devolve null; se sim, testa subtotal >= 150 e devolve 0; senão, devolve o valor de FRETE_POR_DIGITO pelo primeiro dígito do CEP](images/e13-fluxo-do-frete.svg)
:::

Cada guarda é uma saída pela direita. O CEP inválido sai primeiro, com `null`, mesmo numa compra acima de R$ 150; a compra a partir de R$ 150 sai com `0`; só o que passou pelas duas desce até o valor da região.

Esta versão substitui o `calcularFrete` simples do E10. O `calcularFreteComCache` continua no fim do `frete.js` e passa a lembrar a regra completa.

---

## :icon[list-checks] Guard clauses na prática

Quatro chamadas, quatro caminhos pelo fluxograma:

```javascript
calcularFrete(200, '1234');         // null: sai na primeira guarda, CEP inválido
calcularFrete(180, '01310-100');    // 0: passa o CEP, sai na segunda guarda
calcularFrete(129.8, '69900-000');  // 24.9: passa pelas duas e paga a região
calcularFrete(59.9, ' 20040-020 '); // 14.9: os espaços das pontas não atrapalham
```

- O CEP `'1234'` é barrado na porta, mesmo com R$ 200 de compra
- A compra de R$ 180 nem chega ao dicionário: sai grátis
- Só quem passa pelas duas guardas consulta a tabela da região

---

## :icon[test-tube] Testes nas bordas

Bug de decisão mora na **borda**: exatamente R$ 150, um centavo abaixo, CEP com um dígito a menos. Em `src/regras/frete.test.js`:

```javascript
import { calcularFrete } from './frete.js';

describe('calcularFrete', () => {
  test('grátis a partir de R$ 150', () => {
    expect(calcularFrete(150, '01310-100')).toBe(0);
  });
  test('cobra pela região abaixo de R$ 150', () => {
    expect(calcularFrete(149.99, '01310-100')).toBe(9.9);
    expect(calcularFrete(149.99, '69900-000')).toBe(24.9);
  });
  test('CEP inválido devolve null, mesmo acima de R$ 150', () => {
    expect(calcularFrete(200, '1234')).toBeNull();
    expect(calcularFrete(50, undefined)).toBeNull();
  });
});
```

Um teste por guarda e um valor de cada faixa da tabela: se alguém trocar a ordem das guardas, o `npm test` avisa. O teste do E10 que cobrava R$ 19,90 do Rio fica vermelho: a regra mudou de propósito, e o teste muda com ela.

---

## O cupom

Quantos motivos uma loja tem para recusar um cupom?

---

## :icon[ticket] As regras do cupom

Um **cupom** é um código que dá desconto. A Lojinha tem três, e cada recusa vira uma guarda:

| Cupom | Desconto | Condição |
|---|---|---|
| `BEMVINDO10` | 10% do subtotal | nenhuma |
| `LOJINHA20` | R$ 20,00 | subtotal a partir de R$ 100 |
| `NATAL25` | 25% | expirado: sempre recusado |

```javascript
export function validarCupom(codigo, subtotal) {
  const chave = codigo?.trim().toUpperCase() ?? '';
  if (chave === '') return recusar('Digite o código do cupom');

  const cupom = CUPONS[chave];
  if (!cupom) return recusar('Cupom não encontrado');
  // mais duas guardas: expirado e abaixo do mínimo
  // no fim: { valido: true, desconto, mensagem: `Cupom ${chave} aplicado` }
}
```

O percentual usa o `calcularDesconto` do E05, em centavos: 10% de R$ 199,90 dá R$ 19,99.

---

## :icon[list-ordered] O cupom em português

| Linha | O que ela diz |
|---|---|
| `codigo?.trim().toUpperCase() ?? ''` | "se veio um código, tire os espaços das pontas e passe para maiúsculas; se não veio, use texto vazio" |
| `if (chave === '') return recusar(...)` | "código vazio? Recuse e saia" |
| `const cupom = CUPONS[chave];` | "procure o cupom no dicionário `CUPONS`" |
| `if (!cupom) return recusar(...)` | "não achou? Recuse e saia" |

`recusar(mensagem)` devolve `{ valido: false, desconto: 0, mensagem }`: toda resposta tem o mesmo formato, aceita ou recusada. As duas guardas que faltam, expirado e abaixo do mínimo, seguem o mesmo molde.

---

## :icon[list-checks] Cupom na prática

```javascript
validarCupom('bemvindo10', 199.9);
// { valido: true, desconto: 19.99, mensagem: 'Cupom BEMVINDO10 aplicado' }

validarCupom('LOJINHA20', 59.9);
// { valido: false, desconto: 0, mensagem: 'Válido em compras a partir de R$ 100' }

validarCupom(undefined, 100);
// { valido: false, desconto: 0, mensagem: 'Digite o código do cupom' }
```

- **Minúsculas passam**: a primeira linha da função já põe o código em maiúsculas
- **Abaixo do mínimo**, a guarda do `LOJINHA20` recusa, com a mensagem do motivo
- **Sem código**, o `?.` e o `??` evitam o `TypeError`, e a primeira guarda recusa

---

## :icon[receipt] O resumo do E10 ganha o cupom

```javascript
// src/regras/carrinho.js: validarCupom entra no import de ./pedido.js
export function resumoDoCarrinho(itens, cep, codigo) {
  const valorItens = subtotal(itens);
  const frete = calcularFreteComCache(valorItens, cep);
  const cupom = codigo === undefined ? null : validarCupom(codigo, valorItens);
  const desconto = cupom?.desconto ?? 0;
  const semDesconto = somarReais(valorItens, frete ?? 0); // sem CEP, soma 0
  return {
    quantidade: contarItens(itens), valorItens, frete, cupom, desconto,
    total: somarReais(semDesconto, -desconto),
  };
}
```

- `codigo` é opcional: sem ele, `cupom` é `null` e o `desconto`, `0`. O ternário escolhe um valor, e o `??` cobre o que falta
- O `frete` agora pode ser `null`: o `frete ?? 0` soma zero, e o resumo guarda o `null` para quem precisar do texto
- O teste do E10 que usa `toEqual` ganha `cupom: null` e `desconto: 0`: a regra cresceu, e o teste acompanha

---

## :icon[square-terminal] O resumo no terminal

```javascript
// src/scripts/resumo-do-carrinho.js, depois dos imports e dos itens do E10
const [cep, codigo] = process.argv.slice(2); // os dois podem faltar
const resumo = resumoDoCarrinho(itens, cep, codigo);

console.log(`Itens (${resumo.quantidade}): ${formatarPreco(resumo.valorItens)}`);
if (resumo.cupom !== null) console.log(resumo.cupom.mensagem);
if (resumo.desconto > 0) console.log(`Desconto: - ${formatarPreco(resumo.desconto)}`);
console.log(`Frete: ${textoDoFrete(resumo.frete)}`);
console.log(`Total: ${formatarPreco(resumo.total)}`);
```

```plaintext
$ node src/scripts/resumo-do-carrinho.js 01310-100 bemvindo10
Itens (2): R$ 139,80
Cupom BEMVINDO10 aplicado
Desconto: - R$ 13,98
Frete: R$ 9,90
Total: R$ 135,72
```

Sem CEP, o `formatarPreco(resumo.frete)` do E10 pararia com `TypeError`: `null` não tem `toLocaleString`. Quem decide o texto é o `textoDoFrete`. O script só chama e imprime; no E30, estas linhas vão para a tela do Carrinho.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `(reading 'cep')` | o objeto do meio não existe: pedido sem `entrega` | `?.` onde o valor pode faltar |
| `(reading 'trim')` | `undefined` chegou onde se esperava texto: CEP ou cupom que faltou | `?? ''` antes, como no `calcularFrete` |
| `of null (reading 'toLocaleString')` | `formatarPreco(null)`: o frete sem CEP | deixar o `textoDoFrete` decidir o texto |
| `ERR_MODULE_NOT_FOUND` | import relativo sem `.js`: passa no Jest, quebra no `node` | `'../regras/pedido.js'` |

---

## :icon[triangle-alert] Erros comuns

:::warning
- Ternário dentro de ternário, ou só para executar passos: use `if`
- `||` onde `0` ou `''` são válidos: o frete grátis vira "Informe o CEP". Use `??`
- `?.` em todo acesso: esconde o bug de um dado que deveria existir
- Guardas na ordem errada: o frete grátis antes da validação aceita CEP inválido
- Guarda sem `return`: a função segue e o caso inválido passa adiante
- CEP como número: `Number('01310100')` vira `1310100` e perde o primeiro dígito
:::

---

## Resumo

:::summary
- O ternário escolhe um valor entre dois; para passos diferentes ou três resultados, `if`
- `??` troca só `null` e `undefined`; `||` troca qualquer falsy, inclusive `0`
- `?.` lê sem quebrar quando o valor pode faltar e corta a cadeia inteira
- Condições com nome e constantes deixam a regra legível; guard clauses tiram os casos inválidos do caminho principal
- `calcularFrete` e `validarCupom` são funções puras testadas nas bordas; o `resumoDoCarrinho` as junta, e o script só imprime
:::

---

## :icon[flask-conical] No laboratório

Status, parcelas, frete e cupom com testes.

:::steps
1. `src/regras/pedido.js`: `textoDoStatus` e `tomDoStatus`, e o relatório `src/scripts/pedidos.js`
2. `maximoDeParcelas` em `precos.js`, com um teste por faixa e por borda
3. `frete.js`: dicionário, `calcularFrete` com guardas e `textoDoFrete`; o resto do E10 fica
4. `frete.test.js`: borda de R$ 150, cada valor da tabela, CEP com hífen e inválido
5. `CUPONS` e `validarCupom` em `pedido.js`, com os testes das recusas
6. `resumoDoCarrinho` com o cupom, e o script lendo CEP e cupom do terminal
7. `npm test` e `npm run lint` verdes, commit "E13: frete, status e cupom" e `git push`
:::

**Critérios de entrega**: 15 testes novos ou mais; os testes do E10 atualizados, não apagados; nenhuma regra nos scripts. Link do repositório no sistema.

---

## :icon[milestone] Projeto 3 · Lista de tarefas

O projeto mais difícil do Módulo Básico: um app de tarefas no navegador, com a tela feita por você no DOM e as regras testadas no Jest.

- :icon[calendar-clock] Prazo, prioridade, busca e ordem por urgência
- :icon[boxes] Classes, tarefa que se repete e erros próprios
- :icon[save] Tudo salvo no navegador, com Promises
- :icon[cloud-download] Tarefas de exemplo vindas de uma API

Oito etapas, uma por encontro, do E13 ao E20, num repositório seu. Entrega pela plataforma até o **início do E21**, com a rubrica na página do projeto.

O Projeto 2, a Agenda de contatos, fechou no início de hoje: confira se o link está na página dele.

---

## :icon[milestone] Projeto 3 · Etapa 1: prazo e prioridade

Repositório `lista-de-tarefas`, a partir do [ponto-de-partida.zip](materiais/projeto-3/ponto-de-partida.zip):

- `situacaoDoPrazo(prazo, hoje)`: `'atrasada'`, `'vence-hoje'`, `'em-dia'` ou `'sem-prazo'`
- `textoDoPrazo(prazo, hoje)`: "Atrasada há 2 dias", "Vence amanhã"
- `pesoDaPrioridade(prioridade)` com `switch` e `default`
- testes com `hoje` fixo: ontem, hoje, amanhã e hoje às 23h59

Commit: `Projeto 3: etapa 1, prazo e prioridade`. Enunciado completo e entrega: página do curso, em **Projetos**.
