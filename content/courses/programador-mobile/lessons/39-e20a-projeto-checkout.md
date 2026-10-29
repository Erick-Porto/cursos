---
title: "Projeto: o checkout completo"
summary: Junte as regras, as classes e o serviço assíncrono de E05 a E19 num checkout que roda no terminal.
module: classes-e-controle
duration_minutes: 40
objectives:
  - Relacionar as regras, os modelos e os serviços de E05 a E19 às etapas do checkout
  - Montar o pedido com fecharPedido, uma função pura que lança erros próprios
  - Finalizar a compra com await e tratar cada erro esperado no mesmo catch
  - Testar os caminhos de erro e imprimir o histórico Meus pedidos
---

# Projeto: o checkout completo

Programador Mobile · Encontro E20 · Aula 39 de 89

---

## O que você vai aprender

:::goal
- Ver onde cada regra, classe e serviço de E05 a E19 entra no checkout
- Montar o pedido com `fecharPedido`, uma função pura que lança erros próprios
- Finalizar a compra com `await finalizarCompra` e tratar cada erro esperado num `catch` só
- Testar os caminhos de erro e mostrar o histórico "Meus pedidos"
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **checkout** | do inglês, o caixa da loja: a etapa em que a loja confere o carrinho, calcula o total e cobra |
| **regra de negócio** | uma regra da loja escrita em código, como "frete grátis a partir de R$ 150" |
| **função pura** | uma função que só calcula: recebe dados e devolve um resultado, sem imprimir, cobrar nem guardar nada |
| **erro esperado** | um problema previsto, como CEP errado ou cupom vencido; vira uma mensagem para o cliente |
| **bug** | um defeito no código; não vira mensagem: precisa ser corrigido |
| **histórico** | a lista das compras que deram certo: o "Meus pedidos" |

---

## Um comando, sete regras

Você roda um comando só: `node src/scripts/checkout.js`. Para cada cliente, o script:

1. confere o estoque
2. soma os produtos
3. valida o cupom
4. calcula o frete pelo CEP
5. aplica a forma de pagamento
6. cobra
7. guarda o pedido em "Meus pedidos"

Cada regra nasceu num encontro diferente e já tem teste. Hoje elas trabalham juntas. Um problema em qualquer uma vira uma mensagem clara, nunca um total errado.

:::question
Se o CEP estiver errado, a cobrança deve começar? E o pedido deve entrar em "Meus pedidos"?
:::

---

## O checkout

No caixa do supermercado, o que acontece entre a esteira e a sacola?

---

## :icon[shopping-cart] O checkout: o caixa da loja

O **checkout** é o caixa da loja online. No supermercado, o caixa passa cada produto, aplica o cupom, soma, cobra e entrega a nota. Se o cartão não passa, você não leva nada.

No `lojinha-regras`, cada regra que você escreveu de E05 a E19 vira uma parte desse caixa. Hoje, um script junta todas. Para usar, um comando na pasta raiz:

```bash
node src/scripts/checkout.js
```

Cada compra termina de um jeito só: pedido confirmado ou "Não deu", com o motivo.

---

## :icon[square-terminal] O checkout na prática

Três clientes, três finais. É a saída de `node src/scripts/checkout.js`:

```plaintext
Ana
  Total: R$ 247,78 (Pix com 5% de desconto)
  Etapa 1 de 4: Conferindo o estoque...
  Etapa 2 de 4: Reservando seus produtos...
  Etapa 3 de 4: Processando o pagamento...
  Etapa 4 de 4: Confirmando o pedido...
  Pedido nº 864110 confirmado

Carla
  Não deu: Luminária de Mesa: só 2 em estoque.

Davi
  Não deu: Confira o CEP 0131000: ele precisa ter 8 números.
```

- Ana compra: passou por todas as regras e pela cobrança
- Carla pediu 3 luminárias, e só há 2: a compra para antes de cobrar
- Davi digitou o CEP com 7 números: a mensagem diz o que corrigir

---

## :icon[map] Mapa do projeto

| Encontro | Arquivo em `src/` | Papel no checkout |
|---|---|---|
| E05 | `regras/precos.js`, `utils/formatar.js` | centavos, Pix e `formatarPreco` |
| E07 e E09 | `regras/carrinho.js` | `subtotal` e quantidades |
| E13 | `regras/frete.js`, `regras/pedido.js` | frete pelo CEP, cupom e texto do status |
| E15 e E16 | `modelos/Pedido.js`, `modelos/Pagamento.js` | pedido com total; Pix, cartão e boleto |
| E17 | `modelos/erros.js`, `regras/checkout.js` | erros próprios e `freteDoCep` |
| E18 e E19 | `servicos/checkout.js`, `api/produtos.js` | `finalizarCompra` e produtos da DummyJSON |

Hoje nascem as outras regras de `regras/checkout.js` e o script `scripts/checkout.js`. Favoritos, histórico de buscas, `Map` e `Set` (E08 e E12) cuidam da vitrine e ficam de fora.

---

## :icon[route] O caminho de cada compra

:::center
![Animação: cada compra passa por montarCarrinho, fecharPedido, que é síncrono e confere estoque, cupom e CEP, e await finalizarCompra, com 4 etapas assíncronas, até Meus pedidos; fecharPedido lança e finalizarCompra rejeita para o mesmo catch, que imprime a message do erro esperado e relança o bug](images/e20-fluxo-do-checkout.svg)
:::

- **Parte síncrona**: acontece na hora, uma linha depois da outra. O `fecharPedido` confere tudo o que dá para conferir
- **Parte assíncrona**: leva tempo, e o programa não fica parado esperando. O `finalizarCompra` cobra, em 4 etapas

Só um pedido inteiro chega à cobrança. Um erro esperado em qualquer ponto cai no mesmo `catch`, e o pedido não entra no histórico.

---

## Regras de negócio

Quem decide que o frete é grátis: quem programa ou a dona da loja?

---

## :icon[scale] Regras de negócio

**Regra de negócio** é uma decisão da loja escrita em código.

| Regra | O que diz | Onde mora |
|---|---|---|
| Estoque | a quantidade pedida não passa do `estoque` | `conferirEstoque` |
| Cupom | opcional; se não vale, `CupomInvalidoError` | `descontoDoCupom` |
| Frete | grátis a partir de R$ 150; senão, pela região | `calcularFrete` |
| CEP | 8 números, com ou sem hífen | `freteDoCep` |
| Pagamento | Pix com 5% de desconto; cartão até 12x, juros acima de 6x; boleto | classes do E16 |

Cupom e frete olham o **subtotal**, só os produtos. O pagamento vem por último, sobre o valor com desconto e frete. O `Pedido` nasce `pendente` e vira `pago` no `finalizarCompra`.

---

## :icon[calculator] Regras de negócio na prática

:::question
Ana leva um Fone Bluetooth (R$ 199,90) e uma Luminária de Mesa (R$ 89,90), usa o cupom `BEMVINDO10`, mora em São Paulo e paga no Pix. Quanto ela paga? Em que ordem você aplicou as regras?
:::

:::tip Resposta
1. Estoque: os dois cabem, segue
2. Subtotal dos produtos: R$ 289,80
3. Cupom de 10% sobre o subtotal: menos R$ 28,98
4. Frete: grátis, porque os produtos passam de R$ 150
5. Pix: 5% de desconto sobre R$ 260,82, total de **R$ 247,78**

Outros casos: no cartão em 10x, R$ 317,63; no boleto, R$ 260,82. Bruno leva só a Garrafa (R$ 79,90), no boleto, para Recife: R$ 19,90 de frete, total R$ 99,80.
:::

---

## Regras que lançam

O trapezista caiu. O que impede que o show acabe?

---

## :icon[file-code] checkout.js: estoque e cupom

Uma regra **lança** um erro com `throw` quando encontra um problema. Ela para na hora, e o erro sobe até o `catch` de quem chamou. O `catch` é a rede de proteção do trapezista, do E17: a queda acontece, a rede segura, e o show continua.

Em `src/regras/checkout.js`, ao lado do `freteDoCep` do E17, mais duas regras que lançam:

```javascript
export function conferirEstoque(itens) {
  for (const item of itens) {
    if (item.qtd > item.estoque) {
      throw new EstoqueInsuficienteError(item.nome, item.estoque);
    }
  }
}

export function descontoDoCupom(cupom, valor) {
  if (!cupom) return 0; // cupom é opcional
  const resultado = validarCupom(cupom, valor); // E13
  if (!resultado.valido) throw new CupomInvalidoError(cupom, resultado.mensagem);
  return resultado.desconto;
}
```

---

## :icon[list-ordered] Estoque e cupom em português

| Linha | O que ela diz |
|---|---|
| `for (const item of itens)` | "confira o carrinho item por item, até acabar" |
| `if (item.qtd > item.estoque)` | "se pediram mais do que tem no estoque..." |
| `throw new EstoqueInsuficienteError(...)` | "...pare no primeiro que não cabe e diga quanto tem" |
| `if (!cupom) return 0` | "sem cupom, o desconto é zero". O `!` quer dizer "não" |
| `validarCupom(cupom, valor)` | a regra do E13, que devolve `{ valido, desconto, mensagem }` |
| `if (!resultado.valido) throw ...` | "o cupom não vale: pare, com o motivo do E13 como `message`" |
| `return resultado.desconto` | "o cupom vale: entregue o desconto" |

---

## :icon[workflow] fecharPedido: uma função confere tudo

`fecharPedido` junta as regras na ordem certa. Devolve um `Pedido` pronto ou lança o primeiro erro que encontrar.

Ela é uma **função pura**, a receita que só cozinha: com os mesmos ingredientes, sai sempre o mesmo prato, e ela não serve a mesa nem cobra a conta. Por isso cada caminho se testa no Jest. E o `Pedido` do E16 não muda: ele já tem `entrega`, `desconto` e `pagamento`.

```javascript
export function fecharPedido({ itens, cep, cupom, pagamento }) {
  if (itens.length === 0) {
    throw new ErroDeNegocio('Seu carrinho está vazio.', 'CARRINHO_VAZIO');
  }
  conferirEstoque(itens);
  const valor = subtotal(itens);                  // E07
  const desconto = descontoDoCupom(cupom, valor);
  const frete = freteDoCep(valor, cep);           // sobre os produtos
  return new Pedido({ itens, entrega: { cep, frete }, desconto, pagamento });
}
```

---

## :icon[list-ordered] fecharPedido em português

| Linha | O que ela diz |
|---|---|
| `fecharPedido({ itens, cep, cupom, pagamento })` | recebe um objeto e já tira dele os quatro campos: a desestruturação do E09 |
| `if (itens.length === 0) throw ...` | "carrinho vazio: pare, com o código `CARRINHO_VAZIO`" |
| `conferirEstoque(itens)` | confere o estoque; se faltar, o erro sobe daqui |
| `subtotal(itens)` | soma os produtos, como no E07 |
| `descontoDoCupom(cupom, valor)` | o desconto, ou o erro do cupom |
| `freteDoCep(valor, cep)` | o frete sobre o valor dos produtos, ou o erro do CEP |
| `return new Pedido({ ... })` | tudo certo: um `Pedido` do E16, com status `pendente` e o `total` certo |

---

## :icon[play] fecharPedido na prática

Os `itens` são o Fone (R$ 199,90) e a Luminária (R$ 89,90), com o `estoque` de cada um. Quatro compras, quatro resultados:

```javascript
const ana = { itens, cep: '01310-100', cupom: 'BEMVINDO10', pagamento: new PagamentoPix() };

fecharPedido(ana).total;                                            // 247.78
fecharPedido({ ...ana, pagamento: new PagamentoCartao(10) }).total; // 317.63
fecharPedido({ ...ana, cep: '0131000' });
// lança CepInvalidoError: "Confira o CEP 0131000: ele precisa ter 8 números."
fecharPedido({ ...ana, cupom: 'NATAL25' });
// lança CupomInvalidoError: "Este cupom expirou"
```

- `{ ...ana, cep: '0131000' }` copia a compra da Ana e troca só o CEP
- A mesma compra dá sempre o mesmo total: a função é pura
- O erro sai com o nome da classe e a `message`, pronta para o cliente

---

## O script do checkout

Se a regra só calcula, quem mostra o resultado para o cliente?

---

## :icon[users] O script: cinco clientes

A regra calcula; o **script** usa a regra e mostra o resultado. É a receita do E02: passos em ordem, de cima para baixo. O `src/scripts/checkout.js` começa com uma lista de compras, cada uma por um caminho:

```javascript
const compras = [
  { cliente: 'Ana', carrinho: [{ id: 1, qtd: 1 }, { id: 4, qtd: 1 }],
    cep: '01310-100', cupom: 'BEMVINDO10', pagamento: new PagamentoPix() },
  { cliente: 'Bruno', carrinho: [{ id: 5, qtd: 1 }],
    cep: '50030-000', pagamento: new PagamentoBoleto() },
  { cliente: 'Carla', carrinho: [{ id: 4, qtd: 3 }],
    cep: '20040-020', pagamento: new PagamentoCartao(3) },
  { cliente: 'Davi', carrinho: [{ id: 7, qtd: 1 }],
    cep: '0131000', pagamento: new PagamentoPix() },
  { cliente: 'Eva', carrinho: [{ id: 10, qtd: 2 }],
    cep: '30130-000', cupom: 'NATAL25', pagamento: new PagamentoCartao(1) },
];
```

- Ana e Bruno devem comprar; Carla passa do estoque, Davi erra o CEP e Eva usa um cupom vencido
- O `carrinho` guarda só `id` e `qtd`; o produto inteiro vem do catálogo
- Cada `pagamento` é uma instância das classes do E16: `new PagamentoCartao(3)` é o cartão em 3x

---

## :icon[list] Carrinho e etapas na prática

`montarCarrinho` troca cada escolha pelo produto inteiro do catálogo. `mostrarEtapa`, copiada do `finalizar.js` do E18, imprime a etapa que o `finalizarCompra` avisa.

```javascript
function montarCarrinho(escolhas) {
  return escolhas.map(({ id, qtd }) => {
    const produto = produtos.find((p) => p.id === id);
    return { ...produto, qtd }; // preço e estoque vêm do catálogo
  });
}
```

```javascript
// TEXTO_DA_ETAPA e ORDEM: copiados do finalizar.js do E18
function mostrarEtapa(etapa) {
  const numero = ORDEM.indexOf(etapa) + 1;
  console.log(`  Etapa ${numero} de ${ORDEM.length}: ${TEXTO_DA_ETAPA[etapa]}`);
}
```

```javascript
montarCarrinho([{ id: 4, qtd: 2 }]); // [{ id: 4, nome: 'Luminária de Mesa', preco: 89.9, ..., estoque: 2, qtd: 2 }]
mostrarEtapa('pagamento');           //   Etapa 3 de 4: Processando o pagamento...
```

- `map` é a linha de produção do E09; `find` acha o produto pelo `id`; o spread copia o produto e acrescenta a `qtd`, sem rasurar o catálogo
- `ORDEM` é `['estoque', 'reserva', 'pagamento', 'confirmacao']`; o `+ 1` conta a partir de 1
- Os dois espaços na frente agrupam as linhas de cada cliente

---

## Comprar

Com a senha da lanchonete na mão, você fica parado na frente do balcão?

---

## :icon[hourglass] comprar: síncrono, depois assíncrono

A `comprar` faz uma compra inteira, do carrinho à confirmação. Ela é `async` porque espera a cobrança. O `await` é esperar a senha da lanchonete ser chamada sem travar a fila, como no E19: a cobrança leva tempo, e o pedido sai pronto ou cancelado.

```javascript
async function comprar({ cliente, carrinho, ...dados }) {
  console.log(`\n${cliente}`);
  try {
    const itens = montarCarrinho(carrinho);
    const pedido = fecharPedido({ itens, ...dados }); // síncrono: pode lançar
    console.log(`  Total: ${formatarPreco(pedido.total)} (${pedido.pagamento.descricao})`);
    const confirmacao = await finalizarCompra(pedido, mostrarEtapa, { atraso: 300 });
    meusPedidos.push(registrar(pedido, confirmacao));
    console.log(`  Pedido nº ${confirmacao.numero} confirmado`);
  } catch (erro) {
    if (!(erro instanceof ErroDeNegocio)) throw erro; // bug: não esconda
    console.log(`  Não deu: ${erro.message}`);
  }
}
```

O `fecharPedido` lança antes de qualquer `await`: com o CEP errado, a cobrança nem começa.

---

## :icon[list-ordered] comprar em português

| Linha | O que ela diz |
|---|---|
| `{ cliente, carrinho, ...dados }` | tira o nome e o carrinho; o resto vai junto em `dados` |
| `try { ... }` | "tente"; se algo lançar, pule para o `catch` |
| `fecharPedido(...)` | síncrono: confere na hora e pode lançar |
| `await finalizarCompra(...)` | espera as 4 etapas; se uma rejeita, vira exceção, como no E19 |
| `meusPedidos.push(...)` | só roda se a cobrança deu certo |
| `!(erro instanceof ErroDeNegocio)` | "não é erro esperado?" Então é bug: o `throw erro` deixa o Node parar e mostrar a **pilha**, as linhas por onde o erro passou |

O erro esperado vira "Não deu", e o script segue.

---

## :icon[package-check] Registrar só o confirmado

```javascript
function registrar(pedido, confirmacao) {
  return {
    numero: confirmacao.numero, // nasce no serviço, como num servidor
    status: confirmacao.status, // 'pago'
    forma: pedido.pagamento.descricao,
    total: pedido.total,
  };
}
```

```javascript
const meusPedidos = [];
for (const compra of compras) {
  await comprar(compra); // num módulo ES, o await vale fora de função
}
imprimirMeusPedidos(meusPedidos);
```

- O registro é um objeto simples: o número e o status vêm da confirmação; a forma e o total, do `Pedido`
- O `push` vem depois do `await`: se uma etapa falha, a linha não roda
- O `for...of` com `await` faz uma compra de cada vez, em sequência, como no E19

---

## :icon[history] Meus pedidos no terminal

```javascript
function imprimirMeusPedidos(pedidos) {
  console.log('\nMeus pedidos');
  if (pedidos.length === 0) {
    console.log('  Nenhum pedido por aqui.');
    return;
  }
  for (const p of pedidos) {
    console.log(`  Nº ${p.numero} · ${textoDoStatus(p.status)} · ${p.forma} · ${formatarPreco(p.total)}`);
  }
  const centavos = pedidos.reduce((soma, p) => soma + paraCentavos(p.total), 0);
  console.log(`  Soma dos pedidos: ${formatarPreco(paraReais(centavos))}`);
}
```

```plaintext
Meus pedidos
  Nº 675195 · Pagamento aprovado · Pix com 5% de desconto · R$ 247,78
  Nº 675731 · Pagamento aprovado · Boleto · R$ 99,80
  Soma dos pedidos: R$ 347,58
```

Nada novo, tudo junto: a guard clause do E13 (lista vazia, avisa e sai cedo), o `textoDoStatus` do E13 e o `reduce` do E09, a calculadora que vai acumulando, em centavos.

---

## Pratique

:::example Desafio
O laço do fim do script faz uma compra de cada vez:

```javascript
for (const compra of compras) {
  await comprar(compra); // num módulo ES, o await vale fora de função
}
```

1. Rode `node src/scripts/checkout.js` três vezes. Por que Ana às vezes não compra, mesmo com tudo certo?
2. O que muda se o laço virar `compras.forEach(async (compra) => comprar(compra))`?
:::

:::tip Resposta
1. Cada uma das quatro etapas do `finalizarCompra` sorteia uma falha, com a `CHANCE_DE_FALHA` do E18. Quando sai, a etapa rejeita com um `ErroDeNegocio`: o mesmo `catch` imprime "Não deu" com a mensagem da etapa, e o pedido não entra no histórico
2. Com `forEach`, ninguém espera: as cinco compras começam juntas, as linhas se misturam, e "Meus pedidos" sai antes de qualquer confirmação, com "Nenhum pedido por aqui"
:::

---

## O carrinho da API

No restaurante, quem leva o seu pedido até a cozinha e traz o prato?

---

## :icon[cloud-download] O carrinho vindo da API

Com `--api` no comando, os produtos vêm da DummyJSON, não do arquivo local. A API é o garçom do E19: você pede pelo cardápio, a cozinha prepara, e ele traz o prato, o JSON.

```javascript
const DA_API = process.argv.includes('--api'); // node src/scripts/checkout.js --api

async function montarCarrinhoDaApi(escolhas) {
  const pedidos = escolhas.map(async ({ id, qtd }) => {
    const produto = await buscarProduto(id); // E19: já traduzido
    return { ...produto, qtd };
  });
  return Promise.all(pedidos); // os pedidos saem juntos
}

// em comprar, a primeira linha do try
const itens = DA_API ? await montarCarrinhoDaApi(carrinho) : montarCarrinho(carrinho);
```

- `process.argv.includes('--api')`: "o comando tem a palavra `--api`?"
- `Promise.all` espera todas as senhas: os pedidos saem juntos, e o carrinho chega inteiro, na ordem das escolhas
- O ternário escolhe a origem: com `--api`, a DummyJSON; sem, o catálogo

---

## :icon[cloud-download] A API na prática

O mesmo comando, `node src/scripts/checkout.js --api`, em três situações. O que aparece para Ana:

| Situação | Saída |
|---|---|
| Com internet | `Total: R$ 29,05 (Pix com 5% de desconto)` e as quatro etapas |
| Sem internet | `Não deu: Sem conexão. Confira a internet e tente de novo.` |
| Uma escolha com o id 9999 | `Não deu: Não encontramos esse produto.` |

- Com internet, os produtos e os preços são os da DummyJSON, e as regras são as mesmas
- Sem internet, o `fetch` rejeita, e o `pedir` do E19 lança um `ErroDeNegocio` com a mensagem de conexão
- O id 9999 não existe: a API responde 404, e o `pedir` lança o `ApiError`

---

## :icon[cloud] O que muda com a API

- No `traduzirProduto` do E19, uma linha a mais: `estoque: p.stock`. O `conferirEstoque` passa a olhar o estoque do servidor
- Sem internet ou com um id que não existe, o `pedir` lança um `ErroDeNegocio`, e o mesmo `catch` imprime
- A DummyJSON é de testes: o id 1 é um rímel de 9,99 dólares, e quase ninguém chega ao frete grátis

O resto do checkout não muda: `fecharPedido`, `comprar` e "Meus pedidos" não sabem de onde veio o produto.

---

## Testes do checkout

Uma prova com gabarito precisa de professor para ser corrigida?

---

## :icon[test-tube] Testes obrigatórios

Um **teste automatizado** é uma prova com gabarito que o computador corrige sozinho, como no E04. No checkout, o que mais precisa de prova são os caminhos de erro.

| Arquivo | Casos que não podem faltar |
|---|---|
| `regras/checkout.test.js` | sem cupom, cupom expirado, estoque, CEP inválido, carrinho vazio, total com Pix e com cartão |
| `servicos/checkout.test.js` | os testes do E18 e do E19, ainda verdes |

```javascript
test('Pix, cupom de 10% e frete grátis', () => {
  const pagamento = new PagamentoPix();
  const pedido = fecharPedido({ itens, cep: '01310-100', cupom: 'BEMVINDO10', pagamento });
  expect(pedido.total).toBe(247.78);
  expect(pedido.status).toBe('pendente');
});
```

Mínimo: **8 testes novos** e a suíte inteira verde no `npm test` e no CI do E04. Pelo menos metade dos novos prova que o erro certo é lançado, com `expect(() => ...).toThrow(Classe)`. A arrow embrulha a chamada, para o Jest rodar e pegar o erro.

---

## :icon[test-tube] Testes na prática

Três testes que não podem faltar, cada um por um caminho:

```javascript
test('CEP inválido lança CepInvalidoError', () => {
  expect(() => fecharPedido({ itens, cep: '123', pagamento: new PagamentoPix() })).toThrow(CepInvalidoError);
});

test('cupom expirado lança com o motivo do E13', () => {
  expect(() => descontoDoCupom('NATAL25', 289.8)).toThrow('Este cupom expirou');
});

test('abaixo de R$ 150, o frete da região entra no total', () => {
  const garrafa = { id: 5, nome: 'Garrafa Térmica', preco: 79.9, estoque: 10, qtd: 1 };
  const pedido = fecharPedido({ itens: [garrafa], cep: '50030-000', pagamento: new PagamentoBoleto() });
  expect(pedido.total).toBe(99.8);
});
```

- `toThrow(CepInvalidoError)` confere a classe do erro; `toThrow('Este cupom expirou')`, o texto da `message`
- O terceiro prova a conta: R$ 79,90 da Garrafa mais R$ 19,90 de frete para Recife
- No `npm test`, os três ficam verdes ao lado dos testes do E18 e do E19

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `ERR_MODULE_NOT_FOUND` | um `import` aponta para um arquivo que não existe | conferir o caminho e o `.js` no fim |
| `SyntaxError: Unexpected reserved word` no `await` | `await` dentro de uma função sem `async` | `async` antes do `function` |
| `TypeError`, com a pilha | um bug: o `catch` relançou de propósito | ler a primeira linha da pilha e corrigir |
| `Pedido nº undefined confirmado` | faltou o `await` antes do `finalizarCompra` | acrescentar o `await` |
| `Total: R$ NaN` | um `id` que não existe no catálogo | `console.log(itens)` e conferir os ids |

---

## :icon[triangle-alert] Erros comuns

:::warning
- `push` no histórico antes do `await`: a cobrança falha e o pedido entra mesmo assim
- `finalizarCompra` sem `await`: o `catch` não pega a falha e o Node avisa de uma Promise rejeitada
- Frete calculado sobre o valor com desconto: o frete grátis olha os produtos
- `catch` que imprime "Algo deu errado" para tudo: o bug some junto com a pilha
- `forEach(async ...)` nas compras: ninguém espera, e "Meus pedidos" sai vazio
- Produto sem `estoque`: `qtd > undefined` é sempre falso, e a guarda nunca dispara
- Testar só o caminho feliz: o checkout falha mais pelos caminhos de erro
:::

---

## Resumo

:::summary
- O checkout é o caixa da loja: reúne preços, carrinho, frete, cupom, `Pedido`, pagamentos, erros, o serviço assíncrono e a API
- `fecharPedido` é pura: confere estoque, cupom e CEP na ordem e devolve um `Pedido` ou lança o primeiro erro
- `await finalizarCompra` só recebe um pedido inteiro; a rejeição vira exceção no mesmo `catch`
- O `catch` imprime a `message` do `ErroDeNegocio` e relança o bug
- "Meus pedidos" guarda objetos simples, e só depois da confirmação
:::

Próxima aula: a revisão de E01 a E20, com questões no estilo da Prova 1.

---

## :icon[flask-conical] No laboratório

:::steps
1. Confira o `estoque` do E17 nos 12 produtos de `src/data/produtos.js`, com a Luminária em 2
2. `conferirEstoque`, `descontoDoCupom` e `fecharPedido` em `src/regras/checkout.js`
3. 8 testes novos em `checkout.test.js`, com a suíte inteira verde
4. `src/scripts/checkout.js` com as cinco compras e "Meus pedidos"
5. Modo `--api`: `estoque: p.stock` no `traduzirProduto` e `montarCarrinhoDaApi`
6. Script `"checkout"` no `package.json`, seção "Como rodar o checkout" no README, commit "E20: checkout completo" e `git push`
:::

**Critérios de entrega**: cada compra termina em confirmação ou em "Não deu", nunca na pilha de erro; pedido que falhou fica fora de "Meus pedidos"; `npm test` verde. No E30, a pasta `src/` vai para o app, e o script vira a tela de Checkout.
