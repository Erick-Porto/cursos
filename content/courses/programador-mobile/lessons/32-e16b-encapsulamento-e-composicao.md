---
title: Encapsulamento e composição no pedido
summary: Campos privados protegem as regras do cartão, e o Pedido compõe itens, pagamento e entrega para fechar o total.
module: classes-e-controle
duration_minutes: 40
objectives:
  - Proteger os dados de uma classe com campos privados e getters somente leitura
  - Separar a interface pública dos detalhes internos de uma classe
  - Escolher entre herança e composição com o teste "é um" ou "tem um"
  - Montar o Pedido com itens, pagamento e entrega e usá-lo no script do checkout
---

# Encapsulamento e composição no pedido

Programador Mobile · Encontro E16 · Aula 32 de 89

---

## O que você vai aprender

:::goal
- Esconder dados com campos privados `#` e expor só getters
- Separar a interface pública dos detalhes internos de uma classe
- Decidir entre herança e composição com "é um" ou "tem um"
- Fazer o `Pedido` compor itens, pagamento e entrega e usá-lo no checkout do terminal
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **encapsular** | decidir o que a classe mostra e o que ela guarda só para si |
| **interface pública** | o que quem usa a classe pode ver e chamar |
| **campo privado** | um campo com `#` no nome, que só existe dentro da classe |
| **somente leitura** | dá para ler, mas não dá para mudar por fora |
| **composição** | montar um objeto com outros objetos guardados nos campos dele |
| **delegar** | passar a pergunta para a peça que sabe a resposta |

---

## Cartão em 0x

No script do checkout, alguém escreve `cartao.parcelas = 0` para "zerar" a escolha. O terminal imprime "Cartão em 0x sem juros" e a parcela vira `Infinity`. Outra linha faz `cartao.parcelas = 24`, e a loja, que só parcela até 12x, cobra 24 meses de juros:

```javascript
const cartao = new PagamentoCartao(3);
cartao.parcelas = 24;      // nada impede
cartao.totalAPagar(199.9); // 320.77
```

A classe conhece as regras, mas qualquer linha do projeto passa por cima delas.

:::question
Como deixar o resto do código ler as parcelas sem conseguir mudá-las por fora?
:::

---

## Encapsulamento

No caixa eletrônico, o que você pode tocar? E o que fica trancado?

---

## :icon[eye-off] Interface pública e detalhes internos

Pense no caixa eletrônico: você usa os botões e a tela; o cofre fica fechado. **Encapsular** é decidir o que a classe mostra, a **interface pública**, e o que guarda para si, os detalhes internos.

| Interface pública: quem usa a classe vê | Detalhe interno: só a classe |
|---|---|
| `tipo` e `descricao` | o número guardado em `#parcelas` |
| `parcelas` e `temJuros`, só para ler | `TAXA_MENSAL` e `LIMITE_SEM_JUROS` |
| `totalAPagar(valor)` e `valorDaParcela(valor)` | a conta em centavos |

Regra prática: o que está fora da interface pode mudar amanhã sem quebrar o script, o `Pedido` nem os testes.

---

## :icon[lock] Campos privados com #

Um **campo privado** é o cofre do caixa eletrônico: só a própria classe abre.

```javascript
export class PagamentoCartao extends Pagamento {
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
- Fora dela, `cartao.#parcelas` nem roda: o Node recusa o arquivo com `SyntaxError` antes da primeira linha
- O getter `parcelas` deixa ler; sem setter, ninguém escreve: `cartao.parcelas = 24` lança um `TypeError`

---

## :icon[lock] Encapsulamento na prática

**Caso 1: ler pela porta da frente.**

```javascript
const cartao = new PagamentoCartao(3);
console.log(cartao.parcelas); // 3: o getter deixa ler
```

**Caso 2: tentar mudar por fora.** Sem setter, a atribuição é recusada, e o valor guardado continua 3:

```javascript
cartao.parcelas = 24;
// TypeError: Cannot set property parcelas of #<PagamentoCartao> which has only a getter
```

**Caso 3: tentar abrir o cofre.** Fora da classe, o `#` nem chega a rodar:

```javascript
console.log(cartao.#parcelas);
// SyntaxError: Private field '#parcelas' must be declared in an enclosing class
```

---

## Validar na entrada

O que o caixa eletrônico faz com uma nota rasgada?

---

## :icon[shield-check] Validar na entrada

O caixa eletrônico devolve a nota rasgada logo na entrada, antes de guardar. O `constructor` é a única porta para `#parcelas`: valide ali.

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

- `Number.isInteger` (*é inteiro?*) recusa de uma vez `2.5`, `'3'` e `NaN`
- O `throw` interrompe a criação: não existe cartão em 0x nem em 24x. No E17 você aprende a capturar erros como esse
- Para mudar as parcelas, crie outro objeto: `new PagamentoCartao(10)`. Como no `comStatus` do E15, mudar é criar uma instância nova

---

## :icon[shield-check] Validar na prática

```javascript
new PagamentoCartao(7).parcelas; // 7: dentro da faixa
new PagamentoCartao(0);          // Error: Parcelas devem ser de 1 a 12
new PagamentoCartao(13);         // Error: Parcelas devem ser de 1 a 12
new PagamentoCartao('3');        // Error: Parcelas devem ser de 1 a 12 ('3' é texto)
```

- Todo cartão que existe nasceu certo: a regra foi conferida uma vez, na entrada
- O `'3'` com aspas é o caso do terminal: o `process.argv` traz texto, e o script precisa do `Number(...)` antes

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

- Por dentro, tudo usa `#parcelas`; `parcelar` vem do `precos.js` do E05: `new PagamentoCartao(7).valorDaParcela(199.9)` dá `32.78`
- As constantes do topo de `Pagamento.js` não são exportadas: também são privadas, do **módulo**
- Na mãe, `tipo` e `nome` ganham o mesmo tratamento: `#tipo`, `#nome` e dois getters. As filhas não mudam, porque usam `super(...)` e `super.descricao`

---

## Pratique

:::example Desafio
No `Pedido` do E15, o setter de `status` guarda o valor em `_status`, e o sublinhado é só um combinado: `pedido._status = 'aprovado'` passa por cima da validação. Troque por um campo privado. O que mais muda na classe?
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

Nada mais muda: o `constructor` continua com `this.status = status`, que passa pelo setter, e o `paraJSON` lê o getter. Agora `pedido._status = 'aprovado'` só cria um campo solto que nenhum método lê, e `pedido.#status` nem roda.
:::

---

## Composição

O celular é uma bateria, ou o celular tem uma bateria?

---

## :icon[puzzle] É um ou tem um?

**Composição** é montar um objeto com outros objetos guardados nos campos dele. É o celular com tela, bateria e câmera: cada peça faz a sua parte, e dá para trocar uma sem refazer o aparelho.

:::center
![Diagrama: à esquerda, PagamentoPix aponta para Pagamento com a seta "é um", que é herança com extends; à direita, o Pedido guarda itens, uma entrega e um pagamento, que é composição; embaixo, riscado: o pedido não é um pagamento](images/e16-e-um-ou-tem-um.svg)
:::

"O Pix **é um** pagamento" é verdade: herança, com `extends`. "O pedido **é um** pagamento" é falso, então não herde. Mas o pedido **tem um** pagamento, **tem** itens e **tem uma** entrega: composição.

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
- O cliente troca de Pix para cartão antes de pagar, mas um objeto não muda de classe
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

- O `frete` do E15 entra na `entrega`, um objeto simples com o CEP e o valor do `calcularFrete` do E13. O getter `frete` mantém `pedido.frete` funcionando; sem entrega, dá zero
- `this.entrega?.frete ?? 0`: "o frete da entrega, se houver entrega; se não, zero"
- `pagamento` pode ser qualquer filha de `Pagamento`: o `Pedido` não sabe qual
- `quantidade`, `subtotal`, `paraJSON` e `toString` continuam do E15

---

## :icon[package] Composição na prática

```javascript
const itens = [
  { id: 11, nome: 'Livro de Receitas', preco: 59.9, qtd: 1 },
  { id: 12, nome: 'Guia de Viagem', preco: 74.9, qtd: 1 },
];

const semEntrega = new Pedido({ itens });
console.log(semEntrega.frete, semEntrega.quantidade); // 0 2

const comEntrega = new Pedido({ itens, entrega: { cep: '01310-100', frete: 9.9 } });
console.log(comEntrega.frete); // 9.9: o pedido leu da peça entrega
```

O mesmo `Pedido`, com ou sem a peça `entrega`. Nenhuma classe nova precisou nascer.

---

## Delegação

Quem calcula as parcelas: o caixa da loja ou a maquininha?

---

## :icon[workflow] Delegação: o total pergunta ao pagamento

**Delegar** é passar a pergunta para a peça que sabe a resposta, como o caixa da loja que passa o cartão na maquininha: quem calcula as parcelas é a maquininha.

```javascript
get valorDaCompra() { // o total do E15, com outro nome
  const centavos = paraCentavos(this.subtotal) + paraCentavos(this.frete) - paraCentavos(this.desconto);
  return paraReais(Math.max(centavos, 0));
}

get total() {
  if (!this.pagamento) return this.valorDaCompra;
  return this.pagamento.totalAPagar(this.valorDaCompra);
}
```

O `Pedido` não tem `if` de Pix nem de cartão: fecha o valor da compra e pergunta ao pagamento quanto cobrar.

---

## :icon[workflow] Delegação na prática

O mesmo pedido, quatro formas de pagamento:

| Livro de Receitas + Guia de Viagem, frete R$ 9,90 | Total |
|---|---|
| Pix | R$ 137,46 |
| Cartão em 3x | R$ 144,70 |
| Cartão em 10x | R$ 176,22 |
| Boleto | R$ 144,70 |

- O valor da compra é sempre R$ 144,70; quem muda o total é a peça `pagamento`
- Em reais, `134.8 + 9.9` dá `144.70000000000002`; em centavos, 144,70 exato

---

## :icon[refresh-cw] Trocar a peça sem trocar o pedido

Como trocar a bateria sem trocar o celular:

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

- O `paraJSON` do E15 agora devolve `entrega` no lugar de `frete`. O pagamento fica fora dele: `JSON.stringify(new PagamentoCartao(3))` dá `'{}'`, porque campos `#` não viram texto
- `{ ...this }` não serviria: o spread copia só campos públicos, deixa o `#status` de fora, e um pedido pago voltaria a pendente

---

## Diagrama de classes

Como mostrar, num desenho só, quem herda de quem e quem tem o quê?

---

## :icon[list-tree] Diagrama de classes em texto

Um **diagrama de classes** é o mapa do projeto: mostra quem herda de quem e quem tem o quê.

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

Debaixo de `Pagamento`, os ramos são herança: cada filha **é um** pagamento. Debaixo de `Pedido`, são composição: o pedido **tem** as peças. Um desenho assim, num bloco de código do README, mostra a arquitetura a quem chega ao projeto. Ele entra no README no E20.

---

## :icon[terminal] O diagrama na prática: o checkout no terminal

O script da aula 31 ganha o pedido. Os imports somam `Pedido`, `subtotal` e `calcularFrete`; `itens` traz o Livro de Receitas e o Guia de Viagem.

```javascript
const cep = process.argv[2] ?? '01310-100';
const parcelas = Number(process.argv[3] ?? 1);

const frete = calcularFrete(subtotal(itens), cep);
const entrega = frete === null ? null : { cep, frete };
const pedido = new Pedido({ itens, entrega }); // ainda sem pagamento
const formas = [new PagamentoPix(), new PagamentoCartao(parcelas), new PagamentoBoleto()];

console.log(`Frete: ${formatarPreco(pedido.frete)}`);
for (const forma of formas) {
  console.log(`${forma.descricao}: ${formatarPreco(pedido.comPagamento(forma).total)}`);
}
```

Com `node src/scripts/formas-de-pagamento.js 01310-100 10`: frete R$ 9,90; Pix R$ 137,46; "Cartão em 10x com juros" R$ 176,22; boleto R$ 144,70. As classes do diagrama calculam, o script só imprime. No E20, ele vira o checkout completo, com cupom e estoque.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Private field '#...' must be declared` | o `#` foi usado fora da classe que o declarou, ou sem a declaração no corpo | na filha, ler pelo getter; declarar `#parcelas;` no topo da classe |
| `which has only a getter` | alguém tentou mudar um campo somente leitura | criar outro objeto: `new PagamentoCartao(10)` |
| `Maximum call stack size exceeded` | o getter lê a si mesmo: `return this.parcelas` | devolver `this.#parcelas` |
| `Parcelas devem ser de 1 a 12` | parcelas fora da faixa, ou em texto | `Number(...)` e um valor de 1 a 12 |

---

## :icon[triangle-alert] Erros comuns

:::warning
- Ler `this.#nome` dentro de uma filha: `SyntaxError`, o arquivo nem roda. Use o getter `this.nome`
- Usar `this.#parcelas` sem declarar `#parcelas;` no corpo da classe: o mesmo `SyntaxError`
- Getter que lê a si mesmo, como `get parcelas() { return this.parcelas; }`: chama sem parar até `Maximum call stack size exceeded`
- Herdar só para reaproveitar código, como `class Pedido extends PagamentoPix`: o pedido não **é um** Pix
- Passar as parcelas do `process.argv` sem `Number`: `'10'` é texto, e o constructor recusa
- Chamar `new Pedido(itens, pagamento)`: o constructor espera um objeto com nomes
:::

---

## Resumo

:::summary
- Encapsular é escolher a interface pública; o resto pode mudar sem quebrar quem usa a classe
- Um campo `#` só existe dentro da classe que o declarou; getter sem setter deixa ler e impede escrever
- Validar no constructor garante que todo objeto nasce certo: não existe cartão em 0x
- "É um" pede herança; "tem um" pede composição. O `Pedido` tem itens, pagamento e entrega
- O `Pedido` delega o total ao pagamento, e trocar a forma é criar outro pedido com `comPagamento`
:::

---

## :icon[flask-conical] No laboratório

Os pagamentos, o `Pedido` que os compõe e o checkout no terminal.

:::steps
1. `src/modelos/Pagamento.js`: as quatro classes com `#`, cada uma com `export` e nome
2. `Pagamento.test.js`: Pix, juros de 7x e 12x, parcela, recusa de 0x e 13x, boleto numa sexta
3. `Pedido`: `#status`, `entrega`, `pagamento`, `total` delegado e `comPagamento`, com testes
4. `src/scripts/formas-de-pagamento.js`: CEP e parcelas do comando, uma linha por forma e a parcela do cartão
5. Rode com `01310-100 10` e `60000-000 7` e confira os totais na calculadora
6. `npm run verificar` sem erros, commit "E16: pagamentos e pedido" e `git push`
:::

**Critérios de entrega**: nenhum `if` com `'pix'` ou `'cartao'` no script nem no `Pedido`; `parcelas` só para leitura; testes passando. Entregue o link do repositório no sistema.

---

## :icon[milestone] Projeto 3 · Etapa 4: lista, recorrente e botões

No seu repositório `lista-de-tarefas`:

- `ListaDeTarefas` com `#tarefas`: `adicionar`, `concluir(id)`, `remover(id)` e `todas`, que devolve uma cópia
- `TarefaRecorrente extends Tarefa`, com `#frequencia`: ao concluir, a lista pede `proxima(id)` sem perguntar o tipo
- botões Concluir e Remover com `data-id` e um ouvinte só na lista ([Guia do DOM](materiais/projeto-3/guia-dom.html), partes 7 e 9)

Commit: `Projeto 3: etapa 4, lista, recorrente e botões`. Enunciado completo e entrega: página do curso, em **Projetos**.
