---
title: "Projeto: o checkout completo"
summary: Junte as regras e os modelos de E25 a E31 num checkout com frete, cupom, pagamento, confirmação e Meus pedidos.
module: logica-js
duration_minutes: 40
objectives:
  - Relacionar as regras e os modelos da unidade às etapas do checkout
  - Montar o pedido numa função pura que lança erros próprios
  - Ligar Checkout, Confirmação e Meus pedidos com um contexto de pedidos
  - Cobrir o checkout com testes e documentar as classes no README
---

# Projeto: o checkout completo

Programador Mobile: Módulo Específico · Encontro E32 · Aula 46 de 71

---

## O que você vai aprender

:::goal
- Enxergar onde cada regra e cada classe de E25 a E31 entra no checkout
- Montar o pedido com `fecharPedido`, uma função pura que lança erros próprios
- Ligar Checkout, Confirmação e Meus pedidos com o `PedidosContext`
- Entregar o projeto com testes obrigatórios e o diagrama das classes no README
:::

---

## Um toque, sete regras

A cliente revisa o carrinho e toca em **Confirmar pedido**. Nesse toque, a Lojinha confere o estoque, soma os produtos, valida o cupom, calcula o frete pelo CEP, aplica a forma de pagamento, cria o pedido com status e guarda o pedido no histórico.

Cada regra nasceu num encontro diferente e já tem teste. Hoje elas trabalham juntas, e um problema em qualquer uma delas precisa virar uma mensagem clara, nunca um total errado.

:::question
Se o CEP estiver errado, o carrinho deve esvaziar? E o pedido deve aparecer em "Meus pedidos"?
:::

---

## :icon[map] Mapa da unidade

| Encontro | Arquivo em `src/` | Papel no checkout |
|---|---|---|
| E25 | `regras/precos.js` | dinheiro em centavos, com `paraCentavos` e `paraReais` |
| E26 | `regras/frete.js` e `regras/pedido.js` | frete pelo CEP, cupom, texto e tom do status |
| E27 e E28 | `regras/carrinho.js` | subtotal e quantidades com funções puras |
| E30 | `modelos/Produto.js` e `modelos/Pedido.js` | produto do catálogo e pedido com getters |
| E31 | `modelos/pagamentos/` | Pix, cartão e boleto com `totalAPagar` |
| E32 | `modelos/erros.js` e `regras/checkout.js` | erros próprios e a montagem do pedido |

O E29 (ordenação, histórico de buscas e favoritos) cuida da vitrine e fica fora do checkout.

---

## :icon[route] O caminho do cliente

:::steps
1. **Carrinho** (`app/(tabs)/carrinho.js`): itens com + e −, prévia do frete pelo CEP e "Finalizar compra", que leva o CEP; o + respeita o estoque
2. **Checkout** (`app/checkout.js`): CEP já preenchido, cupom com "Aplicar cupom", forma de pagamento, total sempre atualizado e "Confirmar pedido"
3. **Confirmação** (`app/confirmacao.js`): o pedido mais recente, com número, total, forma de pagamento e status
4. **Meus pedidos** (`app/pedidos.js`): aberto pela opção do Perfil, cada pedido com total e `Badge` de status
:::

---

## :icon[route] Navegação entre as telas

:::center
![Diagrama: Finalizar compra leva o CEP do Carrinho ao Checkout; Confirmar pedido abre a Confirmação com router.replace; o voltar da Confirmação vai para as abas sem reabrir o Checkout; Meus pedidos abre pelo Perfil com router.push](images/e32-caminho-checkout.svg)
:::

O cupom sai do Carrinho e vai para o Checkout, onde o pedido fecha. A confirmação abre com `router.replace`: o voltar não leva de novo ao checkout de um pedido já feito.

---

## :icon[scale] Regras de negócio

| Regra | Valor | Onde mora |
|---|---|---|
| Frete | grátis a partir de R$ 150 em produtos; senão, pela região do CEP | `calcularFrete` |
| CEP | 8 números, com ou sem hífen; senão, `CepInvalidoError` | `freteDoCep` |
| Cupom | opcional; se não vale, `CupomInvalidoError` com o motivo | `descontoDoCupom` |
| Estoque | a quantidade não passa do `estoque` do produto | `alterarQuantidade` |
| Pagamento | Pix com 5% de desconto; cartão até 12x, com juros acima de 6x; boleto | classes do E31 |
| Status | todo pedido nasce `pendente` | `Pedido` |

Cupom e frete olham o subtotal dos produtos; a forma de pagamento vem por último, sobre o valor já com desconto e frete.

---

## Pense

:::question
A cliente leva um Fone Bluetooth (R$ 199,90) e uma Luminária de Mesa (R$ 89,90), usa um cupom de 10%, mora em São Paulo e paga no Pix. Quanto ela paga? Em que ordem você aplicou as regras?
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

Em `src/regras/checkout.js`, ao lado do `freteDoCep` da aula 45, mais duas regras que lançam:

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
  const resultado = validarCupom(cupom, valor); // E26
  if (!resultado.valido) throw new CupomInvalidoError(cupom, resultado.mensagem);
  return resultado.desconto;
}
```

- O `validarCupom` do E26 devolve `{ valido, desconto, mensagem }`; aqui o "não vale" vira exceção, com o motivo do E26 como `message`
- O `for...of` do E27 para no primeiro item que não cabe no estoque

---

## :icon[workflow] fecharPedido: uma porta de entrada

```javascript
export function fecharPedido({ itens, cep, cupom, pagamento }) {
  if (itens.length === 0) {
    throw new ErroDeNegocio('Seu carrinho está vazio.', 'CARRINHO_VAZIO');
  }
  conferirEstoque(itens);
  const valor = subtotal(itens);                  // E27
  const desconto = descontoDoCupom(cupom, valor);
  const frete = freteDoCep(valor, cep);           // sobre os produtos
  return new Pedido({ itens, entrega: { cep, frete }, desconto, pagamento });
}
```

A tela chama uma função só. Ela confere tudo na ordem das regras e devolve um `Pedido` pronto, ou lança o primeiro erro que encontrar. É **pura**: não mexe no estado, não navega e não guarda nada, e por isso dá para testar cada caminho no Jest.

O `Pedido` do E31 já tem `entrega`, `desconto` e `pagamento`: o `total` sai certo sem mudar uma linha da classe.

---

## :icon[smartphone] Checkout: o que muda

```jsx
const params = useLocalSearchParams();
const [cep, setCep] = useState(params.cep ?? ''); // vem do Carrinho, agora editável
const [codigo, setCodigo] = useState('');
const [cupomAplicado, setCupomAplicado] = useState(null); // { codigo, desconto }
const [erros, setErros] = useState({ cep: null, cupom: null });
// tipo, parcelas, frete, entrega e pagamento: como no E31
const pedido = new Pedido({ itens, entrega, pagamento, desconto: cupomAplicado?.desconto ?? 0 });
```

```jsx
function aplicarCupom() {
  try {
    const desconto = descontoDoCupom(codigo, subtotal);
    setCupomAplicado(desconto > 0 ? { codigo, desconto } : null);
    setErros({ ...erros, cupom: null });
  } catch (erro) {
    setCupomAplicado(null);
    mostrarErro(erro);
  }
}
```

O CEP ganha um `Campo` com o `aoSairDoCep` da aula 45. A prévia continua nascendo a cada renderização, como no E31.

---

## :icon[circle-alert] Finalizar: cada erro no seu lugar

```jsx
function mostrarErro(erro) {
  if (!(erro instanceof ErroDeNegocio)) throw erro; // bug: não esconda
  switch (erro.codigo) {
    case 'CEP_INVALIDO': setErros({ ...erros, cep: erro.message }); break;
    case 'CUPOM_INVALIDO': setErros({ ...erros, cupom: erro.message }); break;
    default: setAviso(erro.message); // estoque e carrinho vazio: Toast
  }
}
```

```jsx
function finalizar() {
  setEnviando(true);
  try {
    const fechado = fecharPedido({ itens, cep, cupom: cupomAplicado?.codigo, pagamento });
    registrar(fechado);
    router.replace('/confirmacao');
    limpar(); // novo no CarrinhoContext: setItens([])
  } catch (erro) {
    mostrarErro(erro);
  } finally {
    setEnviando(false);
  }
}
```

Se `fecharPedido` lança, as linhas seguintes do `try` não rodam: nada é registrado, a tela não muda e o carrinho continua cheio.

---

## :icon[package-check] Pedidos compartilhados

Checkout, Confirmação e Meus pedidos leem a mesma lista. É a receita do `CarrinhoContext`, em `src/contexts/PedidosContext.js`:

```jsx
export function PedidosProvider({ children }) {
  const [pedidos, setPedidos] = useState([]);

  function registrar(pedido) {
    const registro = {
      ...pedido.paraJSON(), // dados simples, como no E30
      id: pedidos.length + 1,
      data: new Date().toISOString(),
      total: pedido.total,
      forma: pedido.pagamento.descricao,
    };
    setPedidos([registro, ...pedidos]);
  }
```

- A classe calcula e o estado guarda o resultado: o pagamento não vai para o estado, só a `descricao` e o `total` que ele calculou
- O `id` e a data nascem aqui, fora da regra pura, e `fecharPedido` continua testável
- `usePedidos()` e o `PedidosProvider` no `app/_layout.js` seguem a receita do carrinho; no E39, a lista passa a ser salva no aparelho

---

## :icon[badge-check] Meus pedidos com o Badge

```jsx
// src/telas/MeusPedidos.js, o renderItem da FlatList
renderItem={({ item }) => (
  <Cartao style={estilos.cartao}>
    <View style={estilos.linha}>
      <Text style={[estilos.numero, { color: cores.texto }]}>Pedido nº {item.id}</Text>
      <Badge texto={textoDoStatus(item.status)} tom={tomDoStatus(item.status)} />
    </View>
    <Text style={[estilos.info, { color: cores.textoSuave }]}>{item.forma}</Text>
    <Text style={[estilos.total, { color: cores.texto }]}>{formatarPreco(item.total)}</Text>
  </Cartao>
)}
```

Na tela: "Pedido nº 1", o selo âmbar "Aguardando pagamento", "Pix com 5% de desconto" e "R$ 247,78". A rota `app/pedidos.js` reexporta a tela, e a opção "Meus pedidos" do Perfil troca o `Alert` do E20 por `router.push('/pedidos')`. A Confirmação mostra `pedidos[0]`, o mais recente, com o mesmo selo.

---

## :icon[test-tube] Testes obrigatórios

| Arquivo | Casos que não podem faltar |
|---|---|
| `regras/checkout.test.js` | CEP inválido, sem cupom, cupom inválido, estoque, carrinho vazio, total certo |
| `modelos/erros.test.js` | cada erro é `ErroDeNegocio` e `Error`, com `codigo` e `message` |
| `regras/carrinho.test.js` | quantidade acima do estoque lança e não muda a lista |

```javascript
test('Pix, cupom de 10% e frete grátis', () => {
  const pagamento = new PagamentoPix();
  const pedido = fecharPedido({ itens, cep: '01310000', cupom: 'BEMVINDO10', pagamento });
  expect(pedido.total).toBe(247.78);
});
```

Mínimo: **8 testes novos** e a suíte inteira com **20 ou mais** passando no `npm test` e no CI do E24. Pelo menos metade dos novos prova que o erro certo é lançado.

---

## :icon[network] Diagrama das classes no README

Comece pelo desenho do E31 e acrescente o `Produto` e a família de erros, num bloco de código do `README.md`:

```plaintext
Produto              id, nome, preco, estoque
                     deJSON(obj), precoFormatado

Pedido               id, #status, desconto
│                    subtotal, frete, total
├── tem itens        [{ ...produto, qtd }]
├── tem uma entrega  { cep, frete }
└── tem um pagamento qualquer filha de Pagamento

Pagamento            tipo, nome, descricao, totalAPagar(valor)
└── PagamentoPix, PagamentoCartao e PagamentoBoleto

Error
└── ErroDeNegocio    codigo
    └── CepInvalidoError, CupomInvalidoError e EstoqueInsuficienteError
```

Ramos com **tem** são composição; os outros são herança. Quem chega ao projeto entende o domínio sem abrir o código. Atualize o desenho sempre que uma classe mudar.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Limpar o carrinho ou navegar antes de `fecharPedido`: o erro chega depois e o pedido se perde
- Guardar a instância de `Pedido` no estado: guarde o objeto simples que o `registrar` monta
- Calcular o frete sobre o valor com desconto: o frete grátis olha os produtos
- `router.push` para a confirmação: o voltar reabre o checkout de um pedido já feito
- Mandar todo erro para o `Toast`: o erro do CEP fica embaixo do campo do CEP
- Esquecer o `estoque` no `catalogo.json` ou no `Produto`: a guarda nunca dispara
- Testar só o caminho feliz: o checkout falha mais pelos caminhos de erro
:::

---

## Resumo

:::summary
- O checkout reúne `precos`, `frete`, `pedido`, `carrinho`, `Produto`, `Pedido`, os pagamentos e os erros da unidade
- `fecharPedido` é pura: confere estoque, cupom e CEP na ordem e devolve um `Pedido` ou lança o primeiro erro
- A tela decide pelo `codigo`: `Campo` para CEP e cupom, `Toast` para o resto, e relança o bug
- O `PedidosContext` guarda objetos simples, a confirmação abre com `router.replace` e Meus pedidos mostra o `Badge`
- O projeto fecha com testes dos caminhos de erro e o diagrama das classes no README
:::

---

## :icon[flask-conical] No laboratório

O checkout completo da Lojinha.

:::steps
1. `estoque` nos 12 produtos do `catalogo.json` e no `Produto`; guarda no `alterarQuantidade`
2. `src/modelos/erros.js` e `src/regras/checkout.js`, com `fecharPedido`
3. Testes: 8 novos, com a suíte inteira passando de 20
4. `PedidosContext` e `limpar`; Checkout com CEP, cupom, pagamento e "Confirmar pedido"
5. `app/confirmacao.js`, `app/pedidos.js` e a opção "Meus pedidos" do Perfil
6. Erro de estoque em `Toast` no Carrinho e no Detalhe
7. Diagrama no README, commit "E32: checkout" e `git push`
:::

**Critérios de entrega**: fluxo completo até Meus pedidos; nenhum erro esperado vira tela vermelha; carrinho esvazia só com o pedido feito; `npm test` verde com 20 testes ou mais; diagrama no README. Entregue o link do repositório no sistema.
