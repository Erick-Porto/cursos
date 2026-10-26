---
title: "Condições legíveis: ternário, ??, ?. e guard clauses"
summary: "Ternário, ??, ?. e guard clauses nas regras de frete e cupom da Lojinha, testadas nas bordas."
module: logica-js
duration_minutes: 40
objectives:
  - Escolher entre dois valores com o ternário, dentro e fora do JSX
  - Tratar valores ausentes com ?? e ?. sem confundir com ||
  - Reescrever uma regra aninhada com condições com nome e guard clauses
  - Implementar e testar as regras de frete e cupom e ligá-las ao Carrinho
---

# Condições legíveis: ternário, ??, ?. e guard clauses

Programador Mobile: Módulo Específico · Encontro E26 · Aula 34 de 71

---

## O que você vai aprender

:::goal
- Escolher entre dois valores com o ternário, dentro e fora do JSX
- Tratar valores que faltam com `??` e `?.`, sem confundir com `||`
- Reescrever uma regra em pirâmide com condições com nome e guard clauses
- Implementar `calcularFrete` e `validarCupom` com testes e ligar as duas ao Carrinho
:::

---

## Uma regra difícil de ler

A regra de frete escrita às pressas, com um `if` dentro do outro:

```javascript
function calcularFrete(subtotal, cep) {
  if (cep) {
    const digitos = cep.replace(/\D/g, '');
    if (digitos.length === 8) {
      if (subtotal < 150) {
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

## :icon[arrow-left-right] Ternário: um valor ou outro

O **operador ternário** escolhe entre dois valores: `condição ? seVerdadeiro : seFalso`.

```jsx
const rotulo = quantidade === 1 ? '1 item' : `${quantidade} itens`;

<Text style={{ color: cores.textoSuave }}>{rotulo}</Text>
<Text style={{ color: cupom.valido ? cores.sucesso : cores.perigo }}>
  {cupom.mensagem}
</Text>
```

- O `if` é uma **instrução**: não cabe dentro das chaves do JSX
- O ternário é uma **expressão**: produz um valor, e por isso cabe em `{ }`, em props e em template strings
- Você já usou um no E15: `valor.trim() === '' ? ... : null` no `validarObrigatorio`
- Serve para **dois** resultados e uma condição curta

---

## :icon[circle-alert] Ternário dentro de ternário

Três resultados num ternário só:

```javascript
const texto = frete === null ? 'Informe o CEP' : frete === 0 ? 'Grátis' : formatarPreco(frete);
```

Funciona, mas pede duas leituras, e quem mexer depois erra a ordem. Regra prática: **um** ternário por expressão. Com três ou mais resultados, use uma função com `if`, como a `textoDoFrete` da aula 33, e chame a função no JSX:

```jsx
<Text style={{ color: cores.texto }}>Frete: {textoDoFrete(frete)}</Text>
```

A tela fica com uma chamada que se lê como frase, e a decisão ganha um lugar onde pode ser testada.

---

## :icon[shield-check] ??: padrão só para o que falta

`a ?? b` devolve `b` só quando `a` é `null` ou `undefined`. O `||` troca **qualquer** falsy, inclusive `0` e `''`.

```javascript
const frete = calcularFrete(180, '01310-100'); // 0: frete grátis

frete || 'Informe o CEP'; // 'Informe o CEP': o 0 foi trocado
frete ?? 'Informe o CEP'; // 0: o frete grátis continua lá

const totalAPagar = total - desconto + (frete ?? 0); // sem CEP, soma 0
```

- Use **`??`** quando `0`, `''` ou `false` são valores válidos: frete, desconto, quantidade, nota
- Use `||` só quando qualquer falsy deve mesmo virar o padrão
- O `??` se chama **coalescência nula**

---

## :icon[link] ?.: ler sem quebrar

Um pedido de retirada na loja não tem `entrega`. Ler um campo de `undefined` derruba o app:

```javascript
const pedido = { id: 1042, status: 'pago' }; // sem entrega

pedido.entrega.cep;  // tela vermelha: Cannot read property 'cep' of undefined
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
| 5 | tela vermelha | ler `codigo` de `null` |
:::

---

## :icon[tag] Condições com nome

Uma condição longa obriga quem lê a decifrar a regra. Dê um nome a ela:

```javascript
// antes: o que isso quer dizer?
if (cep.replace(/\D/g, '').length === 8 && subtotal >= 150) { /* ... */ }

// depois
const FRETE_GRATIS_A_PARTIR_DE = 150;
const digitos = cep.replace(/\D/g, '');
const cepValido = digitos.length === 8;
const temFreteGratis = subtotal >= FRETE_GRATIS_A_PARTIR_DE;

if (cepValido && temFreteGratis) { /* ... */ }
```

- Booleanos com nome de pergunta de sim ou não: `cepValido`, `temFreteGratis`, `podeAplicar`
- Número mágico vira **constante** em maiúsculas: o `150` passa a ter nome, e a regra muda num lugar só

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

Traduzir um dígito num valor, sem outra lógica, é trabalho de **mapa**, como o `corDoTom` do `Badge`:

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
export const FRETE_GRATIS_A_PARTIR_DE = 150;

export function calcularFrete(subtotal, cep) {
  const digitos = (cep ?? '').replace(/\D/g, '');
  const cepValido = digitos.length === 8;

  if (!cepValido) return null;
  if (subtotal >= FRETE_GRATIS_A_PARTIR_DE) return 0;
  return FRETE_POR_DIGITO[digitos[0]];
}
```

- Leia de cima para baixo: CEP ruim sai, compra grande sai, o resto paga a região
- A ordem das guardas é regra de negócio: o CEP vem antes, porque não há entrega em CEP inválido, nem de graça
- `cep ?? ''` protege do `undefined` antes do `replace`
- Mesmo resultado da pirâmide, com metade das linhas

---

## :icon[corner-down-right] O caminho das guardas

:::center
![Fluxograma: calcularFrete testa primeiro cepValido e, se não, devolve null; se sim, testa subtotal >= 150 e devolve 0; senão, devolve o valor de FRETE_POR_DIGITO pelo primeiro dígito do CEP](images/e26-fluxo-do-frete.svg)
:::

Cada guarda é uma saída pela direita. O CEP inválido sai primeiro, com `null`, mesmo numa compra acima de R$ 150; a compra a partir de R$ 150 sai com `0`; só o que passou pelas duas desce até o valor da região.

---

## :icon[test-tube] Testes nas bordas

Bug de decisão mora na **borda**: exatamente R$ 150, um centavo abaixo, CEP com um dígito a menos. Em `src/regras/frete.test.js`:

```javascript
import { calcularFrete } from './frete';

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

Um teste por guarda e um valor de cada faixa da tabela: se alguém trocar a ordem das guardas, o `npm test` avisa.

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

`recusar(mensagem)` devolve `{ valido: false, desconto: 0, mensagem }`: toda resposta tem o mesmo formato. O percentual usa o `calcularDesconto` do E25, em centavos: 10% de R$ 199,90 dá R$ 19,99.

---

## :icon[shopping-cart] O Carrinho só chama as regras

```jsx
const { itens, remover, total } = useCarrinho(); // total: subtotal dos produtos
const [cep, setCep] = useState('');
const [codigo, setCodigo] = useState('');
const [codigoAplicado, setCodigoAplicado] = useState(null);

const frete = calcularFrete(total, cep);
const cupom = codigoAplicado === null ? null : validarCupom(codigoAplicado, total);
const desconto = cupom?.desconto ?? 0;
const totalAPagar = total - desconto + (frete ?? 0);
```

- Frete, cupom e total são **calculados** a cada renderização, como o `total` do contexto: ao remover um item, tudo se atualiza, inclusive um `LOJINHA20` que deixou de valer
- O botão "Aplicar" só faz `setCodigoAplicado(codigo)`
- Na tela: `Frete: {textoDoFrete(frete)}`, a `mensagem` do cupom recusado no `erro` do `Campo` e o total com `formatarPreco`

---

## :icon[triangle-alert] Erros comuns

:::warning
- Ternário dentro de ternário: com três resultados, use uma função com `if`
- `||` onde `0` ou `''` são válidos: o frete grátis vira "Informe o CEP". Use `??`
- `?.` em todo acesso: esconde o bug de um dado que deveria existir
- Guardas na ordem errada: o frete grátis antes da validação aceita CEP inválido
- Guarda sem `return`: a função segue e o caso inválido passa adiante
- CEP guardado como número: `01310100` vira `1310100` e perde o primeiro dígito
:::

---

## Resumo

:::summary
- O ternário escolhe entre dois valores e cabe no JSX; para três ou mais, uma função com `if`
- `??` troca só `null` e `undefined`; `||` troca qualquer falsy, inclusive `0`
- `?.` lê sem quebrar quando o valor pode faltar e corta a cadeia inteira
- Condições com nome e constantes deixam a regra legível; guard clauses tiram os casos inválidos do caminho principal
- `calcularFrete` e `validarCupom` são funções puras testadas nas bordas, e o Carrinho só as chama
:::

---

## :icon[flask-conical] No laboratório

Frete, status e cupom: testados e na tela.

:::steps
1. `src/regras/frete.js`: constante, mapa, `calcularFrete` e `textoDoFrete`
2. `frete.test.js`: bordas de R$ 150, cada valor da tabela, CEP com hífen e inválido
3. `src/regras/pedido.js`: `textoDoStatus`, `tomDoStatus`, `CUPONS` e `validarCupom`
4. `pedido.test.js`: os status, um desconhecido e as recusas do cupom
5. Carrinho: campo de CEP, frete e aviso de frete grátis
6. Campo de cupom com "Aplicar" e o resumo: subtotal, desconto, frete e total
7. `npm test` verde, commit "E26: frete, status e cupom" e `git push`
:::

**Critérios de entrega**: 12 testes ou mais passando; nenhuma regra de frete ou cupom na tela; "Grátis" a partir de R$ 150; cupom recusado com mensagem; total atualizado ao remover item. Entregue o link do repositório no sistema.
