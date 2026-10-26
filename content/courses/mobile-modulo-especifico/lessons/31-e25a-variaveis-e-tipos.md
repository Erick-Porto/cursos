---
title: Variáveis e tipos no app
summary: const, let, tipos primitivos e a conversão do texto do TextInput em número, até as mensagens da tela.
module: logica-js
duration_minutes: 35
objectives:
  - Declarar valores com const e let e explicar por que evitar var
  - Identificar os tipos primitivos com typeof
  - Converter o texto do TextInput em número com Number, parseInt e Number.isNaN
  - Montar mensagens da tela com template strings
---

# Variáveis e tipos no app

Programador Mobile: Módulo Específico · Encontro E25 · Aula 31 de 71

---

## O que você vai aprender

:::goal
- Declarar valores com `const` e `let`, e por que deixar o `var` de lado
- Reconhecer os tipos primitivos e perguntar o tipo com `typeof`
- Converter o texto do `TextInput` em número com `Number`, `parseInt` e `Number.isNaN`
- Montar as mensagens da tela com template strings
:::

---

## 2 + 1 = 21 no carrinho

No Carrinho, o cliente digita **2** no campo Quantidade e toca em **+**. Em vez de 3, a tela mostra **21 unidades**, e o total do fone vai para R$ 4.197,90.

Ninguém errou a conta. O campo entregou o texto `'2'`, e texto mais número junta, não soma.

Hoje você aprende a enxergar o **tipo** de cada valor que chega ao app e a converter na hora certa. É a base das regras de negócio que a Lojinha ganha nesta unidade.

:::question
Por que `qtd + 1` deu `'21'`, mas `qtd * preco` calculou um valor?
:::

---

## :icon[variable] const: um nome para um valor

Uma **variável** guarda um valor com um nome. Na Lojinha, quase tudo nasce com **`const`**: o nome fica preso àquele valor.

```javascript
const nomeDaLoja = 'Lojinha';
const freteFixo = 15;
const produto = produtos.find((p) => p.id === Number(id));

freteFixo = 20; // erro: uma const não pode ser reatribuída
```

- Nomes em português e em camelCase, que dizem o que guardam: `precoComDesconto`, não `pcd`
- Reatribuir uma `const` é erro, e o problema aparece logo, não semanas depois
- `const` prende o nome, não o conteúdo: as propriedades de um objeto `const` ainda podem mudar

---

## :icon[pencil] let: quando o valor muda

Use **`let`** quando o mesmo nome precisa receber outro valor mais adiante, como um total que vai somando:

```javascript
let total = 0;
total = total + 199.9; // fone
total = total + 79.9;  // garrafa: total agora é 279.8

let mensagem = 'Seu carrinho está vazio';
if (total > 0) {
  mensagem = 'Pronto para finalizar';
}
```

No componente, o estado não é `let`: é `const [qtd, setQtd] = useState(1)`, e quem muda o valor é o `setQtd`.

:::tip Regra prática
Comece sempre com `const` e troque por `let` só quando precisar reatribuir. Quem lê sabe que uma `const` não muda no meio do caminho.
:::

---

## :icon[ban] Por que não var

**`var`** é a forma antiga de declarar, de antes do `let` e do `const`. Ela ignora os blocos `{ }` do `if`:

```javascript
if (temCupom) {
  var desconto = 10;
}
console.log(desconto); // 10 ou undefined: o var vaza do bloco

if (temCupom) {
  let descontoCupom = 10;
}
console.log(descontoCupom); // ReferenceError: só existe dentro do if
```

- `var` vale na função inteira e pode ser declarada duas vezes sem aviso
- `let` e `const` valem só no **bloco** onde nasceram: menos surpresa
- Você ainda vai ver `var` em código antigo e em respostas da internet; em código novo, não use

---

## :icon[shapes] Tipos primitivos

Todo valor tem um **tipo**. Os que mais aparecem nas regras da Lojinha:

| Tipo | Exemplo | Onde aparece |
|---|---|---|
| `string` | `'Fone Bluetooth'`, `'01310-100'` | nomes, CEP, tudo que sai de um campo |
| `number` | `199.9`, `3` | preço, quantidade, avaliação |
| `boolean` | `true`, `false` | `destaque`, está logado, tem estoque |
| `undefined` | valor que nunca foi definido | `produto` quando o `find` não acha |
| `null` | "nada", de propósito | nenhum cupom escolhido |

Inteiro e decimal são o mesmo tipo: `number`. Existem ainda `bigint` e `symbol`, raros em app.

---

## :icon[search] typeof: pergunte o tipo

**`typeof`** devolve o nome do tipo, como texto:

```javascript
typeof 'Fone Bluetooth'; // 'string'
typeof 199.9;            // 'number'
typeof true;             // 'boolean'
typeof undefined;        // 'undefined'
typeof null;             // 'object': um erro antigo da linguagem
```

É a primeira pergunta quando uma conta dá um resultado estranho:

```javascript
const { id } = useLocalSearchParams();
console.log(typeof id); // 'string': parâmetro de rota é sempre texto
```

Foi assim que apareceu o bug do Detalhe que pedia `Number(id)`: o `'7'` da rota não é o `7` do catálogo.

---

## :icon[keyboard] O TextInput sempre entrega texto

O `keyboardType="numeric"` muda o teclado, não o tipo do valor. O `onChangeText` sempre recebe uma **string**:

```jsx
const [textoQtd, setTextoQtd] = useState('1');

<Campo
  rotulo="Quantidade"
  keyboardType="numeric"
  value={textoQtd}
  onChangeText={setTextoQtd} // recebe '2', nunca 2
/>
```

| De onde vem | Tipo que chega |
|---|---|
| `TextInput` e `Campo` | sempre `string` |
| parâmetro de rota, como `[id]` | sempre `string` |
| `catalogo.json` | o tipo escrito no JSON |

Guarde no estado o texto, do jeito que o campo entrega, e converta só na hora da conta.

---

## :icon[combine] Coerção: o JavaScript converte sozinho

Quando os tipos não combinam, o JavaScript converte um deles por conta própria. Isso é **coerção**, e o `+` é o operador mais traiçoeiro:

```javascript
'10' + 5;     // '105': com texto de um lado, o + junta
'10' - 5;     // 5: o - converte para número
'2' * 199.9;  // 399.8: o * também converte
'R$ 10' * 2;  // NaN: não deu para converter
```

Com uma string de um lado, o `+` vira **concatenação**: junta os textos. Os outros operadores aritméticos tentam converter para número.

:::center
![Diagrama: o campo Quantidade entrega o texto '2'; textoQtd + 1 junta os textos e dá '21', enquanto Number(textoQtd) + 1 soma e dá 3](images/e25-texto-mais-numero.svg)
:::

Não conte com a coerção, nem quando ela acerta por sorte. Converta você mesmo, de forma **explícita**.

---

## Pense

:::question
No carrinho que mostrou 21 unidades, o campo entregou `qtd = '2'` e o código fazia:

```javascript
const novaQtd = qtd + 1;
const subtotal = qtd * 199.9;
```

Por que `novaQtd` deu errado e `subtotal` deu certo? Como corrigir as duas linhas de uma vez só?
:::

:::tip Resposta
`qtd + 1` concatena: `'2' + 1` é `'21'`. Já `qtd * 199.9` converte o texto e dá `399.8`, por sorte. A correção é converter uma vez, logo depois de ler o campo: `const qtd = Number(textoQtd);`. Daí em diante, todas as contas recebem um número de verdade.
:::

---

## :icon[binary] Number e parseInt

Duas conversões, com regras diferentes:

| Texto do campo | `Number(texto)` | `parseInt(texto, 10)` |
|---|---|---|
| `'2'` | `2` | `2` |
| `' 7 '` | `7` | `7` |
| `'2.5'` | `2.5` | `2` |
| `'2,5'` | `NaN` | `2` |
| `'3 unidades'` | `NaN` | `3` |
| `''` | `0` | `NaN` |

- **`Number`** exige que o texto inteiro seja número; ignora só os espaços nas pontas
- **`parseInt`** lê até o primeiro caractere que não é dígito e descarta o resto. Passe sempre a base `10`
- Com `Number`, campo vazio vira `0`: confira o vazio antes
- A vírgula que o brasileiro digita engana os dois: `NaN` em um, `2` calado no outro

---

## :icon[circle-alert] NaN e Number.isNaN

**`NaN`** (*not a number*) é o resultado de uma conversão que falhou. Ele é do tipo `number` e contamina as contas: `NaN * 199.9` é `NaN`, e a tela mostra "R$ NaN".

```javascript
const qtd = Number('dois');
qtd === NaN;         // false: NaN não é igual nem a si mesmo
Number.isNaN(qtd);   // true: o jeito certo de testar
Number.isNaN('abc'); // false: só é true para o próprio NaN
```

Teste logo depois de converter e avise no campo:

```javascript
function confirmar() {
  const qtd = parseInt(textoQtd, 10);
  if (Number.isNaN(qtd)) {
    setErro('Digite a quantidade em números'); // aparece no Campo
    return;
  }
  setErro(null); // daqui para baixo, qtd é número de verdade
}
```

---

## :icon[message-square] Template strings nas mensagens

Entre crases, uma **template string** encaixa valores com `${ }`. Qualquer expressão cabe lá dentro:

```javascript
// com +: fácil esquecer um espaço
'Adicionado: ' + qtd + ' x ' + produto.nome;

// com template string
`Adicionado: ${qtd} x ${produto.nome}`;
`${quantidade} itens · ${formatarPreco(total)}`;
```

Na tela, ela vai direto na prop, entre chaves:

```jsx
<Toast mensagem={`${produto.nome} foi para o carrinho`} visivel={toastVisivel} />
```

O rótulo de acessibilidade do `CartaoProduto` já usa uma, com o nome, o preço e a avaliação do produto.

---

## Pratique

:::example Desafio
No Detalhe, o campo Quantidade guarda o texto em `textoQtd`. Escreva a função pura `resumoDaCompra(textoQtd, preco)` que devolve:

- `'Digite a quantidade em números'` quando o texto não vira número
- senão, um texto como `'2 x R$ 199,90 = R$ 399,80'`, usando `formatarPreco`
:::

:::tip Resposta
```javascript
export function resumoDaCompra(textoQtd, preco) {
  const qtd = parseInt(textoQtd, 10);
  if (Number.isNaN(qtd)) {
    return 'Digite a quantidade em números';
  }
  return `${qtd} x ${formatarPreco(preco)} = ${formatarPreco(qtd * preco)}`;
}
```

Converta uma vez, teste o `NaN` em seguida e só então faça a conta. A função não sabe nada de tela: recebe dados e devolve texto, por isso é fácil de testar.
:::

---

## :icon[triangle-alert] Erros comuns

:::warning
- Somar o valor do `TextInput` sem converter: `'2' + 1` vira `'21'`
- Achar que `keyboardType="numeric"` entrega número: ele muda só o teclado
- Testar com `=== NaN`, que é sempre `false`: use `Number.isNaN`
- `parseInt` sem a base `10`, ou `Number('')` virando `0` num campo vazio
- Declarar com `let` o que nunca muda, ou usar `var` em código novo
- Guardar número no estado do campo: o `value` do `TextInput` espera texto
:::

---

## Resumo

:::summary
- `const` por padrão, `let` quando o valor precisa mudar, `var` nunca em código novo
- Os primitivos do dia a dia são `string`, `number`, `boolean`, `undefined` e `null`; `typeof` diz qual é qual
- `TextInput` e parâmetros de rota entregam sempre texto: converta com `Number` ou `parseInt(texto, 10)` antes da conta
- Conversão que falha dá `NaN`; teste com `Number.isNaN`
- Template strings montam as mensagens da tela com `${ }`
:::

---

## :icon[arrow-right] Próximos passos

Os valores agora chegam às contas com o tipo certo. Na aula 32, você faz as contas: operadores, comparação com `===`, curto-circuito e `Math`.

E um mistério para resolver: no JavaScript, `0.1 + 0.2` não dá `0.3`. Num app de loja, isso vira centavo sumindo da parcela.

No laboratório, a Lojinha ganha a sua primeira regra de negócio de verdade: `src/regras/precos.js`, com desconto, Pix e parcelas, tudo coberto por testes.
