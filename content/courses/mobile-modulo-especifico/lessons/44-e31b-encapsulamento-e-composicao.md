---
title: Encapsulamento e composição no pedido
summary: Campos privados protegem as regras do cartão, e o Pedido compõe itens, pagamento e entrega no Checkout.
module: logica-js
duration_minutes: 40
objectives:
  - Proteger os dados de uma classe com campos privados e getters somente leitura
  - Separar a interface pública dos detalhes internos de uma classe
  - Escolher entre herança e composição com o teste "é um" ou "tem um"
  - Montar o Pedido com itens, pagamento e entrega e usá-lo na tela de Checkout
---

# Encapsulamento e composição no pedido

Programador Mobile: Módulo Específico · Encontro E31 · Aula 44 de 71

---

## O que você vai aprender

:::goal
- Esconder dados com campos privados `#` e expor só getters
- Separar a interface pública dos detalhes internos de uma classe
- Decidir entre herança e composição com "é um" ou "tem um"
- Fazer o `Pedido` compor itens, pagamento e entrega e usá-lo no Checkout
:::

---

## Cartão em 0x

No Checkout, alguém escreve `cartao.parcelas = 0` para "limpar" a escolha. A tela mostra "Cartão em 0x sem juros" e a parcela vira `Infinity`. Outra linha faz `cartao.parcelas = 24`, e a loja, que só parcela até 12x, cobra 24 meses de juros:

```javascript
const cartao = new PagamentoCartao(3);
cartao.parcelas = 24;      // nada impede
cartao.totalAPagar(199.9); // 320.77
```

A classe conhece as regras, mas qualquer linha do app passa por cima delas.

:::question
Como deixar a tela ler as parcelas sem conseguir mudá-las por fora?
:::

---

## :icon[eye-off] Interface pública e detalhes internos

Pense na maquininha de cartão: você digita o valor e escolhe as parcelas; a taxa e a conta ficam lá dentro. **Encapsular** é decidir o que a classe mostra e o que guarda para si.

| Interface pública: a tela usa | Detalhe interno: só a classe |
|---|---|
| `tipo` e `descricao` | o número guardado em `#parcelas` |
| `parcelas` e `temJuros`, só para ler | `TAXA_MENSAL` e `LIMITE_SEM_JUROS` |
| `totalAPagar(valor)` e `valorDaParcela(valor)` | a conta em centavos |

Regra prática: o que está fora da interface pode mudar amanhã sem quebrar nenhuma tela.

---

## :icon[lock] Campos privados com #

```javascript
export default class PagamentoCartao extends Pagamento {
  #parcelas; // declarado no corpo da classe

  constructor(parcelas = 1) {
    super('cartao', 'Cartão');
    this.#parcelas = parcelas;
  }

  get parcelas() {
    return this.#parcelas; // a porta de leitura
  }
}
```

- O `#` faz parte do nome: `#parcelas` só existe **dentro** das chaves da classe
- Fora dela, `cartao.#parcelas` nem compila: o erro aparece antes de o app abrir
- O getter `parcelas` deixa ler; sem setter, ninguém escreve: `cartao.parcelas = 24` lança um `TypeError`

---

## :icon[shield-check] Validar na entrada

O constructor é a única porta para `#parcelas`. Valide ali:

```javascript
const MAXIMO_DE_PARCELAS = 12;

constructor(parcelas = 1) {
  super('cartao', 'Cartão');
  if (!Number.isInteger(parcelas) || parcelas < 1 || parcelas > MAXIMO_DE_PARCELAS) {
    throw new Error(`Parcelas devem ser de 1 a ${MAXIMO_DE_PARCELAS}`);
  }
  this.#parcelas = parcelas;
}
```

- `Number.isInteger` recusa de uma vez `2.5`, `'3'` e `NaN`
- O `throw` interrompe a criação: não existe cartão em 0x nem em 24x. No E32 você aprende a capturar erros como esse
- Para mudar as parcelas, crie outro objeto: `new PagamentoCartao(10)`. Como no `Pedido` do E30, mudar é criar uma instância nova

---

## :icon[credit-card] PagamentoCartao encapsulado

O resto da classe, depois do getter `parcelas`:

```javascript
  get temJuros() {
    return this.#parcelas > LIMITE_SEM_JUROS;
  }
  get descricao() {
    const juros = this.temJuros ? 'com juros' : 'sem juros';
    return `${super.descricao} em ${this.#parcelas}x ${juros}`;
  }
  totalAPagar(valor) {
    if (!this.temJuros) return super.totalAPagar(valor);
    const comJuros = paraCentavos(valor) * (1 + TAXA_MENSAL) ** this.#parcelas;
    return paraReais(Math.round(comJuros));
  }
  valorDaParcela(valor) {
    return parcelar(this.totalAPagar(valor), this.#parcelas).valor;
  }
```

- Por dentro, tudo usa `#parcelas`; `parcelar` vem do `precos.js` do E25: `new PagamentoCartao(7).valorDaParcela(199.9)` dá `32.78`
- As constantes do topo do arquivo não são exportadas: também são privadas, do **módulo**
- Na mãe, `tipo` e `nome` ganham o mesmo tratamento: `#tipo`, `#nome` e dois getters. As filhas não mudam, porque usam `super(...)` e `super.descricao`

---

## Pratique

:::example Desafio
No `Pedido` do E30, o setter de `status` guarda o valor em `_status`, e o sublinhado é só um combinado: `pedido._status = 'aprovado'` passa por cima da validação. Troque por um campo privado. O que mais muda na classe?
:::

:::tip Resposta
```javascript
export default class Pedido {
  #status;

  get status() {
    return this.#status;
  }

  set status(valor) {
    if (!STATUS.includes(valor)) {
      throw new Error(`Status inválido: ${valor}`);
    }
    this.#status = valor;
  }
}
```

Nada mais muda: o `constructor` continua com `this.status = status`, que passa pelo setter, e o `paraJSON` lê o getter. Agora `pedido._status = 'aprovado'` só cria um campo solto que nenhum método lê, e `pedido.#status` nem compila.
:::

---

## :icon[puzzle] É um ou tem um?

:::center
![Diagrama: à esquerda, PagamentoPix aponta para Pagamento com a seta "é um", que é herança com extends; à direita, o Pedido guarda itens, uma entrega e um pagamento, que é composição; embaixo, riscado: o pedido não é um pagamento](images/e31-e-um-ou-tem-um.svg)
:::

"O Pix **é um** pagamento" é verdade: herança, com `extends`. "O pedido **é um** pagamento" é falso, então não herde. Mas o pedido **tem um** pagamento, **tem** itens e **tem uma** entrega: composição.

**Composição** é montar um objeto com outros objetos guardados nos campos dele. É o celular com tela, bateria e câmera: cada peça faz a sua parte, e dá para trocar uma sem refazer o aparelho.

---

## :icon[boxes] Herança errada: subclasses demais

E se o pedido herdasse a forma de pagamento?

```javascript
class PedidoPix extends Pedido { /* total com desconto */ }
class PedidoCartao extends Pedido { /* total com juros */ }
class PedidoBoleto extends Pedido { /* total igual */ }
// e se a loja tivesse retirada: PedidoPixRetirada, PedidoCartaoRetirada...
```

- Cada combinação vira uma classe: 3 formas vezes 2 entregas dão 6, e cada forma nova soma mais 2
- O cliente troca de Pix para cartão no Checkout, mas um objeto não muda de classe
- A regra do Pix fica em `PagamentoPix` e de novo em `PedidoPix`

Herde só quando "é um" for verdade. No resto, componha.

---

## :icon[package] O Pedido compõe itens, pagamento e entrega

```javascript
constructor({ id, itens = [], status = 'pendente', entrega = null, desconto = 0, pagamento = null } = {}) {
  this.id = id;
  this.itens = itens;         // [{ ...produto, qtd }]
  this.status = status;       // passa pelo setter
  this.entrega = entrega;     // { cep, frete } ou null
  this.desconto = desconto;
  this.pagamento = pagamento; // qualquer filha de Pagamento, ou null
}

get frete() {
  return this.entrega?.frete ?? 0;
}
```

- O `frete` do E30 entra na `entrega`, um objeto simples com o CEP e o valor do `calcularFrete` do E26. O getter `frete` mantém `pedido.frete` funcionando; sem entrega, dá zero
- `pagamento` pode ser qualquer filha de `Pagamento`: o `Pedido` não sabe qual
- `quantidade`, `subtotal`, `paraJSON` e `toString` continuam do E30

---

## :icon[workflow] Delegação: o total pergunta ao pagamento

```javascript
get valorDaCompra() { // o total do E30, com outro nome
  const centavos = paraCentavos(this.subtotal) + paraCentavos(this.frete) - paraCentavos(this.desconto);
  return paraReais(Math.max(centavos, 0));
}

get total() {
  if (!this.pagamento) return this.valorDaCompra;
  return this.pagamento.totalAPagar(this.valorDaCompra);
}
```

**Delegar** é passar a pergunta para a peça que sabe a resposta. O `Pedido` não tem `if` de Pix nem de cartão: fecha o valor da compra e pergunta ao pagamento quanto cobrar.

| Livro de Receitas + Guia de Viagem, frete R$ 9,90 | Total |
|---|---|
| Pix | R$ 137,46 |
| Cartão em 3x | R$ 144,70 |
| Cartão em 10x | R$ 176,22 |
| Boleto | R$ 144,70 |

Em reais, `134.8 + 9.9` dá `144.70000000000002`; em centavos, 144,70 exato.

---

## :icon[refresh-cw] Trocar a peça sem trocar o pedido

```javascript
comPagamento(pagamento) {
  return new Pedido({ ...this.paraJSON(), pagamento });
}

comStatus(novo) {
  return new Pedido({ ...this.paraJSON(), pagamento: this.pagamento, status: novo });
}
```

```javascript
const noPix = new Pedido({ itens, entrega, pagamento: new PagamentoPix() });
const noCartao = noPix.comPagamento(new PagamentoCartao(10));
noCartao.total; // 176.22
noPix.total;    // 137.46: o original não mudou
```

- O `paraJSON` do E30 agora devolve `entrega` no lugar de `frete`. O pagamento fica fora dele: é uma peça que calcula, não um dado, e por isso vai à parte
- `{ ...this }` não serviria: perde o `#status`, como o spread do E30 perdia o getter
- Com composição, a peça troca a qualquer momento; com herança, o pedido teria de virar outra classe

---

## :icon[list-tree] Diagrama de classes em texto

```plaintext
Pagamento            tipo, nome, descricao
│                    totalAPagar(valor)
├── PagamentoPix     5% de desconto
├── PagamentoCartao  #parcelas, temJuros
│                    valorDaParcela(valor)
└── PagamentoBoleto  vencimento(hoje)

Pedido               id, #status, desconto
│                    subtotal, frete, total
├── tem itens        [{ ...produto, qtd }]
├── tem uma entrega  { cep, frete }
└── tem um pagamento qualquer filha de Pagamento
```

Debaixo de `Pagamento`, os ramos são herança: cada filha **é um** pagamento. Debaixo de `Pedido`, são composição: o pedido **tem** as peças. Um desenho assim, num bloco de código do README, mostra a arquitetura a quem chega ao projeto. Ele entra no README no E32.

---

## :icon[smartphone] Checkout: estado simples, classes no cálculo

```jsx
const { itens, total: subtotal } = useCarrinho();
const { cep } = useLocalSearchParams();      // o CEP vem do Carrinho
const [tipo, setTipo] = useState('pix');     // texto
const [parcelas, setParcelas] = useState(1); // número

// a cada renderização, as instâncias nascem do estado
const frete = calcularFrete(subtotal, cep);
const entrega = frete === null ? null : { cep, frete };
const formas = [new PagamentoPix(), new PagamentoCartao(parcelas), new PagamentoBoleto()];
const pagamento = formas.find((forma) => forma.tipo === tipo);
const pedido = new Pedido({ itens, pagamento, entrega });
```

- No estado ficam `tipo` e `parcelas`, valores simples; as classes só calculam, como no E30
- Tocar em "10x" chama `setParcelas(10)`: a tela renderiza, nasce um `PagamentoCartao(10)` e o total muda
- `JSON.stringify(new PagamentoCartao(3))` dá `'{}'`: campos `#` não viram texto. Mais um motivo para não guardar a instância no estado

---

## :icon[triangle-alert] Erros comuns

:::warning
- Ler `this.#nome` dentro de uma filha: erro de sintaxe, o arquivo nem compila. Use o getter `this.nome`
- Usar `this.#parcelas` sem declarar `#parcelas;` no corpo da classe: o mesmo erro de sintaxe
- Getter que lê a si mesmo, como `get parcelas() { return this.parcelas; }`: chama sem parar até `Maximum call stack size exceeded`
- Herdar só para reaproveitar código, como `class Pedido extends PagamentoPix`: o pedido não **é um** Pix
- Guardar a instância no `useState` e mudar um campo dela: o React não vê mudança e a tela não atualiza
- Chamar `new Pedido(itens, pagamento)`: o constructor espera um objeto com nomes
:::

---

## Resumo

:::summary
- Encapsular é escolher a interface pública; o resto pode mudar sem quebrar nenhuma tela
- Um campo `#` só existe dentro da classe que o declarou; getter sem setter deixa ler e impede escrever
- Validar no constructor garante que todo objeto nasce certo: não existe cartão em 0x
- "É um" pede herança; "tem um" pede composição. O `Pedido` tem itens, pagamento e entrega
- O `Pedido` delega o total ao pagamento, e trocar a forma é criar outro pedido com `comPagamento`
:::

---

## :icon[flask-conical] No laboratório

Pagamentos, o `Pedido` que os compõe e a tela de Checkout.

:::steps
1. `src/modelos/pagamentos/`: as quatro classes com `#` e um `index.js` que as reexporta
2. `pagamentos.test.js`: Pix, juros de 7x e 12x, parcela, recusa de 0x e 13x, boleto numa sexta
3. `Pedido`: `#status`, `entrega`, `pagamento`, `total` delegado e `comPagamento`, com testes
4. `src/telas/Checkout.js` e `app/checkout.js`; no Carrinho, "Finalizar compra" leva o CEP
5. Checkout: as três formas com seus totais, parcelas só no cartão e o total do pedido
6. `npm test` verde, commit "E31: pagamentos e checkout" e `git push`
:::

**Critérios de entrega**: nenhum `if` de forma de pagamento na tela; `parcelas` só para leitura; no estado, só `tipo` e `parcelas`; testes passando. Entregue o link do repositório no sistema.
