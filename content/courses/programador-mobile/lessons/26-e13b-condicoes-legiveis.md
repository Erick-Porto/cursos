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

## :icon[arrow-left-right] Ternário: um valor, não passos

No E05b, o **ternário** escolheu entre dois valores: `qtd === 1 ? 'item' : 'itens'`. Ele é uma **expressão**: produz um valor e cabe num `const`, num `return` e dentro do `${ }`. O `if` é uma **instrução**: decide que passos rodam.

```javascript
// bom: escolhe um valor
console.log(`Frete: ${frete === 0 ? 'Grátis' : formatarPreco(frete)}`);

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

## :icon[shield-check] ??: padrão só para o que falta

No E05b, o `||` deu valor padrão: `process.argv[3] || 'Visitante'`. Ele troca **qualquer** falsy, inclusive `0` e `''`. Já `a ?? b` devolve `b` só quando `a` é `null` ou `undefined`.

```javascript
const frete = calcularFrete(180, '01310-100'); // 0: frete grátis

frete || 'Informe o CEP'; // 'Informe o CEP': o 0 foi trocado
frete ?? 'Informe o CEP'; // 0: o frete grátis continua lá

const centavosDoFrete = paraCentavos(frete ?? 0); // sem CEP, soma 0
```

- Use **`??`** quando `0`, `''` ou `false` são valores válidos: frete, desconto, quantidade, nota
- Use `||` só quando qualquer falsy deve mesmo virar o padrão
- O `??` se chama **coalescência nula**

---

## :icon[link] ?.: ler sem quebrar

Um pedido de retirada na loja não tem `entrega`. Ler um campo de `undefined` para o script:

```javascript
const pedido = { id: 1042, status: 'pago' }; // sem entrega

pedido.entrega.cep;  // TypeError: Cannot read properties of undefined
pedido.entrega?.cep; // undefined, sem erro
pedido.entrega?.cep ?? 'Retirada na loja'; // 'Retirada na loja'
```

- O **encadeamento opcional** `?.` para no primeiro `null` ou `undefined` e devolve `undefined`
- Ele corta a cadeia inteira: em `codigo?.trim().toUpperCase()`, com `codigo` nulo, nenhum dos dois métodos roda
- Use só onde o valor pode mesmo faltar: espalhado por todo lado, ele esconde bugs

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

## :icon[tag] Condições com nome

Uma condição longa obriga quem lê a decifrar a regra. Dê um nome a ela:

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
- Número mágico vira **constante** em maiúsculas, como a `FRETE_GRATIS_A_PARTIR_DE` do E10: o `150` tem nome, e a regra muda num lugar só

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

Traduzir um dígito num valor, sem outra lógica, é trabalho de **dicionário**, como o `rotulosDeOrdem` do E08:

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
- As chaves de um objeto são sempre texto: `FRETE_POR_DIGITO['6']` encontra a chave `6`
- Um `switch` com dez `case` faria o mesmo em mais que o dobro de linhas

---

## :icon[corner-down-right] Guard clauses: saia cedo

Uma **guard clause** (cláusula de guarda) trata logo no início o caso que impede a regra e sai com `return`. O caminho principal fica sem `else` e sem degraus:

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

- Leia de cima para baixo: CEP ruim sai, compra grande sai, o resto paga a região
- A ordem das guardas é regra de negócio: o CEP vem antes, porque não há entrega em CEP inválido, nem de graça
- `cep ?? ''` protege do `undefined`: o `ehCepValido` chama `trim`, e `undefined.trim()` é `TypeError`
- Mesmo resultado da pirâmide, sem degraus

---

## :icon[corner-down-right] O caminho das guardas

:::center
![Fluxograma: calcularFrete testa primeiro cepValido e, se não, devolve null; se sim, testa subtotal >= 150 e devolve 0; senão, devolve o valor de FRETE_POR_DIGITO pelo primeiro dígito do CEP](images/e13-fluxo-do-frete.svg)
:::

Cada guarda é uma saída pela direita. O CEP inválido sai primeiro, com `null`, mesmo numa compra acima de R$ 150; a compra a partir de R$ 150 sai com `0`; só o que passou pelas duas desce até o valor da região.

Esta versão substitui o `calcularFrete` simples do E10. O `calcularFreteComCache` continua no fim do `frete.js` e passa a lembrar a regra completa.

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

## :icon[ticket] As regras do cupom

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

`recusar(mensagem)` devolve `{ valido: false, desconto: 0, mensagem }`: toda resposta tem o mesmo formato. O percentual usa o `calcularDesconto` do E05, em centavos: 10% de R$ 199,90 dá R$ 19,99.

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
