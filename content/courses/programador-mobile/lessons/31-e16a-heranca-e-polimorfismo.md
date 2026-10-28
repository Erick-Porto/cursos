---
title: Herança e polimorfismo nas formas de pagamento
summary: Pix, cartão e boleto como uma família de classes que o checkout trata do mesmo jeito, sem if para cada forma.
module: classes-e-controle
duration_minutes: 40
objectives:
  - Criar subclasses com extends e chamar o constructor da mãe com super
  - Sobrescrever métodos e reaproveitar a versão da mãe com super.metodo()
  - Usar polimorfismo para calcular o total sem if para cada forma de pagamento
  - Verificar a família de um objeto com instanceof e testar as classes no Jest
---

# Herança e polimorfismo nas formas de pagamento

Programador Mobile · Encontro E16 · Aula 31 de 89

---

## O que você vai aprender

:::goal
- Montar a família `Pagamento`, `PagamentoPix`, `PagamentoCartao` e `PagamentoBoleto` com `extends` e `super`
- Sobrescrever `totalAPagar(valor)` e reaproveitar a versão da mãe com `super`
- Calcular o total de qualquer forma com a mesma chamada: polimorfismo
- Perguntar a família de um objeto com `instanceof` e testar tudo no Jest
:::

---

## Um if para cada forma de pagamento

O checkout da Lojinha vai aceitar Pix, cartão e boleto. A primeira ideia é um `if` para cada forma:

```javascript
function totalAPagar(forma, valor, parcelas) {
  if (forma === 'pix') return valor * 0.95;
  if (forma === 'cartao' && parcelas > 6) return valor * 1.0199 ** parcelas;
  return valor;
}
```

Depois vem outra função com os mesmos `if` para a descrição, mais uma para o resumo do pedido, outra para o recibo. No dia em que a loja aceitar carteira digital, você caça cada `if` pelo projeto, e o que ficar para trás vira bug.

:::question
Como o checkout pode pedir o total sem saber qual forma o cliente escolheu?
:::

---

## :icon[wallet] Uma família de formas de pagamento

:::center
![Diagrama: a classe mãe Pagamento, com descricao e totalAPagar, no topo; PagamentoPix, PagamentoCartao e PagamentoBoleto embaixo, cada uma ligada à mãe por uma seta "é um" e com a sua regra de total](images/e16-familia-pagamento.svg)
:::

As três respondem às mesmas perguntas: **qual é a descrição?** e **quanto o cliente paga?**. O Pix dá 5% de desconto; o cartão cobra juros acima de 6x e tem parcelas; o boleto cobra o próprio valor e tem vencimento.

A **herança** guarda o que é comum numa classe **mãe** (ou base) e cada forma vira uma **subclasse** (filha), que muda só o que é dela. Teste rápido antes de herdar: "o Pix **é um** pagamento?" Sim. Então a herança cabe.

---

## :icon[layers] A classe mãe: Pagamento

A família inteira mora em `src/modelos/Pagamento.js`. A mãe vem primeiro:

```javascript
export class Pagamento {
  constructor(tipo, nome) {
    this.tipo = tipo; // 'pix', 'cartao' ou 'boleto': identifica a forma
    this.nome = nome; // o que o cliente lê no resumo
  }

  get descricao() {
    return this.nome;
  }

  totalAPagar(valor) {
    return valor; // sem desconto nem juros
  }
}
```

- `descricao` é um getter, como o `precoFormatado` do `Produto` no E15
- `totalAPagar(valor)` recebe o valor da compra em reais e devolve quanto o cliente paga
- Quatro classes pequenas e parentes cabem num arquivo só. Cada uma sai com `export` e nome, como as funções de `precos.js`: `import { PagamentoPix } from '../modelos/Pagamento.js'`

---

## :icon[git-fork] extends e super: herdar tudo

No mesmo arquivo, depois da mãe:

```javascript
export class PagamentoBoleto extends Pagamento {
  constructor() {
    super('boleto', 'Boleto'); // roda o constructor de Pagamento
  }
}

const boleto = new PagamentoBoleto();
boleto.descricao;          // 'Boleto': herdado
boleto.totalAPagar(199.9); // 199.9: herdado
```

- **`extends`** diz quem é a mãe: `PagamentoBoleto` ganha tudo o que `Pagamento` tem
- **`super(...)`** chama o constructor da mãe; numa subclasse, ele vem antes de qualquer `this`
- Quando a filha não tem um método, o JavaScript procura na mãe

---

## :icon[calendar] A filha acrescenta: o vencimento do boleto

Além do que herda, a subclasse pode ter métodos só dela. O boleto vence em 3 dias úteis, e a conta já existe: o `preverEntrega` do E06, em `src/utils/datas.js`.

```javascript
// no topo de Pagamento.js
import { preverEntrega } from '../utils/datas.js';

const DIAS_PARA_PAGAR = 3; // dias úteis

// dentro de PagamentoBoleto
vencimento(hoje = new Date()) {
  return preverEntrega(DIAS_PARA_PAGAR, hoje);
}
```

Pedido numa sexta, 9 de outubro: o laço do E06 pula sábado e domingo e o boleto vence na quarta, 14. Feriados continuam de fora. O parâmetro `hoje` existe para o teste passar uma data fixa.

---

## :icon[percent] Sobrescrita: o Pix muda o total

```javascript
// no topo de Pagamento.js
import { PERCENTUAL_PIX, precoComPix } from '../regras/precos.js';

export class PagamentoPix extends Pagamento {
  constructor() {
    super('pix', 'Pix');
  }
  get descricao() {
    return `${super.descricao} com ${PERCENTUAL_PIX}% de desconto`;
  }
  totalAPagar(valor) {
    return precoComPix(valor); // a regra do E05, já testada
  }
}
```

- **Sobrescrever** é declarar na filha um método com o mesmo nome do da mãe: vale o da filha
- `super.descricao` lê a versão da mãe (`'Pix'`) e acrescenta o resto: "Pix com 5% de desconto"
- A classe não refaz a conta: chama o `precoComPix` do E05. O Fone de R$ 199,90 sai por R$ 189,90

---

## :icon[calculator] A regra do cartão: juros compostos

- **Até 6x:** sem juros; o total é o próprio valor
- **De 7x a 12x:** juros de 1,99% ao mês, um mês por parcela. São compostos: cada mês cresce 1,99% sobre o mês anterior. **Total = valor × 1,0199 elevado ao número de parcelas**
- **Parcela:** o `parcelar` do E05 divide o total; a sobra vai na primeira

| Fone de R$ 199,90 | Total | Parcela |
|---|---|---|
| 6x | 199,90 | 33,31 |
| 7x | 229,46 | 32,78 |
| 10x | 243,44 | 24,34 |
| 12x | 253,22 | 21,10 |

Bancos usam a Tabela Price, de total menor; esta fórmula é simplificada. Ela mora num método só: trocá-la não mexe no checkout.

---

## :icon[credit-card] PagamentoCartao: super.metodo()

```javascript
// no topo, junto dos imports de paraCentavos e paraReais
const TAXA_MENSAL = 0.0199; // 1,99% ao mês
const LIMITE_SEM_JUROS = 6;

export class PagamentoCartao extends Pagamento {
  constructor(parcelas = 1) {
    super('cartao', 'Cartão');
    this.parcelas = parcelas; // depois do super, nunca antes
  }
  totalAPagar(valor) {
    if (this.parcelas <= LIMITE_SEM_JUROS) return super.totalAPagar(valor);
    const comJuros = paraCentavos(valor) * (1 + TAXA_MENSAL) ** this.parcelas;
    return paraReais(Math.round(comJuros));
  }
}
```

`super.totalAPagar(valor)` reaproveita a regra da mãe em vez de repeti-la. O `**` eleva à potência: `1.0199 ** 7` multiplica 1,0199 por ele mesmo sete vezes. A conta é em centavos, com os ajudantes do E05. A versão completa, com `descricao` ("Cartão em 7x com juros") e `valorDaParcela(valor)`, você escreve no laboratório.

---

## Pense

:::question
Quanto vale `totais`? E por que o boleto responde a `totalAPagar`, se a classe dele não declara esse método?

```javascript
const formas = [new PagamentoPix(), new PagamentoCartao(3), new PagamentoBoleto()];
const totais = formas.map((forma) => forma.totalAPagar(100));
```
:::

:::tip Resposta
`[95, 100, 100]`. O Pix sobrescreve o método e tira 5%. O cartão em 3x não passa de 6 parcelas: `super.totalAPagar` devolve os 100. O boleto não declara o método, então o JavaScript sobe até `Pagamento` e usa o de lá. A mesma linha `forma.totalAPagar(100)` rodou três códigos diferentes.
:::

---

## :icon[shapes] Polimorfismo: uma chamada, vários comportamentos

```javascript
const formas = [new PagamentoPix(), new PagamentoCartao(10), new PagamentoBoleto()];

for (const forma of formas) {
  console.log(forma.descricao, forma.totalAPagar(199.9));
}
// Pix com 5% de desconto 189.9
// Cartão em 10x com juros 243.44
// Boleto 199.9
```

**Polimorfismo** quer dizer "muitas formas": a mesma chamada `forma.totalAPagar(...)` faz coisas diferentes conforme o objeto que a recebe. Quem chama não sabe qual é a classe, e nem precisa.

Quando a loja aceitar carteira digital: uma classe nova que estende `Pagamento` e um item a mais no array. Nenhum `if` muda.

---

## :icon[shapes] Quem responde à chamada

:::center
![Animação: a mesma chamada forma.totalAPagar(199.9) chega a cada forma; o Pix responde 189.9 e o cartão em 10x responde 243.44, cada um com o próprio método; o boleto não tem o método, o JavaScript procura na mãe Pagamento e a resposta é 199.9](images/e16-polimorfismo.svg)
:::

O Pix e o cartão respondem com o `totalAPagar` que sobrescreveram. O `PagamentoBoleto` não declara o método: o JavaScript sobe até `Pagamento` e usa o de lá.

Essa subida tem nome, **cadeia de protótipos**, e você a vê por dentro no E17.

---

## :icon[terminal] O checkout trata todas do mesmo jeito

```javascript
// src/scripts/formas-de-pagamento.js
import { PagamentoBoleto, PagamentoCartao, PagamentoPix } from '../modelos/Pagamento.js';
import { formatarPreco } from '../utils/formatar.js';

const valor = Number(process.argv[2] ?? 199.9);
const parcelas = Number(process.argv[3] ?? 1);
const formas = [new PagamentoPix(), new PagamentoCartao(parcelas), new PagamentoBoleto()];

for (const forma of formas) {
  console.log(`${forma.descricao}: ${formatarPreco(forma.totalAPagar(valor))}`);
}
```

```bash
node src/scripts/formas-de-pagamento.js 199.9 10
# Pix com 5% de desconto: R$ 189,90
# Cartão em 10x com juros: R$ 243,44
# Boleto: R$ 199,90
```

O laço não tem nenhum `if` sobre a forma de pagamento: cada objeto sabe a própria descrição e o próprio total. Quando a Lojinha virar app, a partir do E30, essas mesmas classes calculam o que a tela mostra.

---

## :icon[search-check] instanceof: perguntar a família

```javascript
const cartao = new PagamentoCartao(10);

cartao instanceof PagamentoCartao; // true
cartao instanceof Pagamento;       // true: todo cartão é um pagamento
cartao instanceof PagamentoPix;    // false
typeof cartao;                     // 'object': typeof não enxerga a classe
```

**`instanceof`** responde se o objeto foi criado pela classe ou por uma das filhas dela.

| Use para | Evite para |
|---|---|
| imprimir algo que só uma filha tem, como o valor da parcela do cartão | calcular o total com `if (forma instanceof PagamentoPix)` |
| conferir a família num teste | escolher regra: isso é trabalho do método sobrescrito |

---

## :icon[test-tube] Testando a família no Jest

```javascript
import { Pagamento, PagamentoBoleto, PagamentoPix } from './Pagamento.js';

test('Pix é um Pagamento com 5% de desconto', () => {
  const pix = new PagamentoPix();
  expect(pix).toBeInstanceOf(Pagamento);
  expect(pix.totalAPagar(199.9)).toBe(189.9);
});

test('boleto pedido na sexta vence na quarta', () => {
  const sexta = new Date(2026, 9, 9); // o mês começa em 0: 9 é outubro
  const vencimento = new PagamentoBoleto().vencimento(sexta);
  expect(vencimento).toEqual(new Date(2026, 9, 14));
});
```

- `toBeInstanceOf` confere a família, como o `instanceof`
- `toEqual` compara as datas pelo valor; `toBe` compararia se são o mesmo objeto
- Nos testes, datas sempre fixas: com a data de hoje, o teste muda de resultado conforme o dia

---

## :icon[triangle-alert] Erros comuns

:::warning
- Usar `this` antes de `super(...)` no constructor: `ReferenceError`, porque a parte da mãe ainda não foi montada
- Errar o nome na sobrescrita (`totalApagar`): nada quebra, a filha herda o método da mãe e o Pix sai sem desconto. Só um teste pega
- Declarar uma filha acima da mãe no arquivo: `ReferenceError: Cannot access 'Pagamento' before initialization`. A mãe vem primeiro
- Calcular o total com uma fila de `instanceof`: é o `if` do começo voltando por outra porta
- Escrever `new Date(2026, 10, 9)` pensando em outubro: o mês começa em 0, então 10 é novembro
:::

---

## Resumo

:::summary
- Herança cabe quando a frase "a filha **é uma** mãe" é verdadeira: o Pix é um pagamento
- `extends` liga a filha à mãe; `super(...)` roda o constructor da mãe antes de qualquer `this`
- Sobrescrever é redeclarar o método na filha; `super.metodo()` reaproveita a versão da mãe
- Polimorfismo: o checkout chama `forma.totalAPagar(valor)` e cada objeto responde do seu jeito, sem `if`
- `instanceof` pergunta a família: bom para recursos de uma filha só, ruim para escolher regra
:::

---

## :icon[arrow-right] Próximos passos

Na aula 32, a família de pagamentos fica protegida e entra no pedido:

- :icon[lock] campos privados com `#`, para ninguém pedir o cartão em 0x ou em 24x
- :icon[puzzle] composição: o `Pedido` do E15 passa a ter itens, pagamento e entrega
- :icon[list-tree] o diagrama das classes da Lojinha em texto
- :icon[credit-card] no laboratório, as quatro classes com testes e o script do checkout com o total de cada forma
