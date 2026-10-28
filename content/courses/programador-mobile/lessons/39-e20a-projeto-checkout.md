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
- Enxergar onde cada regra, classe e serviço de E05 a E19 entra no checkout
- Montar o pedido com `fecharPedido`, uma função pura que lança erros próprios
- Finalizar a compra com `await finalizarCompra` e tratar cada erro esperado num `catch` só
- Testar os caminhos de erro e imprimir o histórico "Meus pedidos"
:::

---

## Um comando, sete regras

Você roda `node src/scripts/checkout.js`. Para cada cliente, o script confere o estoque, soma os produtos, valida o cupom, calcula o frete pelo CEP, aplica a forma de pagamento, cobra e guarda o pedido em "Meus pedidos".

Cada regra nasceu num encontro diferente e já tem teste. Hoje elas trabalham juntas, e um problema em qualquer uma delas precisa virar uma mensagem clara, nunca um total errado.

:::question
Se o CEP estiver errado, a cobrança deve começar? E o pedido deve entrar em "Meus pedidos"?
:::

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

A parte síncrona confere na hora tudo o que dá para conferir. Só um pedido inteiro chega à parte assíncrona, que cobra. Um erro esperado em qualquer ponto cai no mesmo `catch`, e o pedido não entra no histórico.

---

## :icon[scale] Regras de negócio

| Regra | Valor | Onde mora |
|---|---|---|
| Estoque | a quantidade não passa do `estoque` do produto | `conferirEstoque` |
| Cupom | opcional; se não vale, `CupomInvalidoError` com o motivo | `descontoDoCupom` |
| Frete | grátis a partir de R$ 150 em produtos; senão, pela região | `calcularFrete` |
| CEP | 8 números, com ou sem hífen; senão, `CepInvalidoError` | `freteDoCep` |
| Pagamento | Pix com 5% de desconto; cartão até 12x, juros acima de 6x; boleto | classes do E16 |
| Status | nasce `pendente`; vira `pago` depois da cobrança | `Pedido` e `finalizarCompra` |

Cupom e frete olham o subtotal; o pagamento vem por último, sobre o valor com desconto e frete.

---

## Pense

:::question
Ana leva um Fone Bluetooth (R$ 199,90) e uma Luminária de Mesa (R$ 89,90), usa o cupom `BEMVINDO10`, mora em São Paulo e paga no Pix. Quanto ela paga? Em que ordem você aplicou as regras?
:::

:::tip Resposta
1. Estoque: os dois cabem, segue
2. Subtotal dos produtos: R$ 289,80
3. Cupom de 10% sobre o subtotal: menos R$ 28,98
4. Frete: grátis, porque os produtos passam de R$ 150
5. Pix: 5% de desconto sobre R$ 260,82, total de **R$ 247,78**

No cartão em 10x, a mesma base vira R$ 317,63; em 3x ou no boleto, fica em R$ 260,82.
:::

---

## :icon[file-code] checkout.js: estoque e cupom

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

- O `validarCupom` do E13 devolve `{ valido, desconto, mensagem }`; aqui o "não vale" vira exceção, com o motivo do E13 como `message`
- O `for...of` do E14 para no primeiro item que não cabe no estoque

---

## :icon[workflow] fecharPedido: uma porta de entrada

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

Uma função só confere tudo na ordem das regras e devolve um `Pedido` pronto, ou lança o primeiro erro que encontrar. É **pura**: não imprime, não cobra e não guarda nada, e por isso cada caminho se testa no Jest.

O `Pedido` do E16 já tem `entrega`, `desconto` e `pagamento`: o `total` sai certo sem mudar uma linha da classe.

---

## :icon[users] O script: cinco clientes

`src/scripts/checkout.js` começa com uma lista de compras, cada uma por um caminho:

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

---

## :icon[list] Carrinho e etapas no terminal

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

- `map`, `find` e spread (E08 e E09) montam cada item com a `qtd`
- `mostrarEtapa` é o do `finalizar.js` do E18, com dois espaços na frente para agrupar as linhas de cada cliente: o serviço avisa qual etapa começou, e o script imprime

---

## :icon[hourglass] comprar: síncrono, depois assíncrono

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

- `fecharPedido` lança antes de qualquer `await`: com o CEP errado, a cobrança nem começa
- A rejeição do `await` vira exceção, como no E19: o mesmo `catch` trata as duas falhas
- O que não é `ErroDeNegocio` é bug: `throw erro` deixa o Node parar e mostrar a pilha

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

A guard clause do E13, o `textoDoStatus` do E13 e o `reduce` em centavos do E09: nada novo, tudo junto.

---

## Pratique

:::example Desafio
Rode `node src/scripts/checkout.js` três vezes. Por que Ana às vezes não compra, mesmo com tudo certo? E o que muda se o laço do fim virar `compras.forEach(async (compra) => comprar(compra))`?
:::

:::info Resposta
- Cada uma das quatro etapas do `finalizarCompra` sorteia uma falha com a `CHANCE_DE_FALHA` do E18. Quando sai, a etapa rejeita com um `ErroDeNegocio`: o mesmo `catch` imprime "Não deu" com a mensagem da etapa, e o pedido não entra no histórico
- Com `forEach`, ninguém espera: as cinco compras começam juntas, as linhas se misturam e "Meus pedidos" sai antes de qualquer confirmação, com "Nenhum pedido por aqui"
:::

---

## :icon[cloud-download] O carrinho vindo da API

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

- No `traduzirProduto` do E19, uma linha a mais: `estoque: p.stock`. O `conferirEstoque` passa a olhar o estoque do servidor
- Sem internet ou com um id que não existe, o `pedir` lança um `ErroDeNegocio`, e o mesmo `catch` imprime
- A DummyJSON é de testes: o id 1 é um rímel de 9,99 dólares, e quase ninguém chega ao frete grátis

---

## :icon[test-tube] Testes obrigatórios

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

Mínimo: **8 testes novos** e a suíte inteira verde no `npm test` e no CI do E04. Pelo menos metade dos novos prova que o erro certo é lançado, com `expect(() => ...).toThrow(Classe)`.

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
- O checkout reúne preços, carrinho, frete, cupom, `Pedido`, pagamentos, erros, o serviço assíncrono e a API
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
