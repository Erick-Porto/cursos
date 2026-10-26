---
title: Strings e expressões regulares
summary: Limpe, recorte e monte os textos do app e valide CEP e CPF com expressões regulares.
module: linguagem-js
duration_minutes: 40
objectives:
  - Limpar, recortar e montar textos com métodos de string e template literals
  - Validar o formato de CEP e CPF com expressões regulares e test
  - Extrair e reorganizar partes de um texto com match, replace e grupos
  - Remover acentos para a busca do app
---

# Strings e expressões regulares

Programador Mobile: Módulo Específico · Encontro E33 · Aula 47 de 71

---

## O que você vai aprender

:::goal
- Limpar o que o usuário digita com `trim`, `toLowerCase` e `replace`
- Recortar e montar textos com `slice`, `split`, `padStart` e template literals
- Conferir o formato de CEP e CPF com uma expressão regular e `test`
- Separar as partes de um texto com `match` e grupos, e formatar com `$1`
- Tirar os acentos para a busca achar "Térmica" quando o cliente digita "termica"
:::

---

## O texto do usuário chega sujo

No Checkout da Lojinha, cada cliente digita o CEP de um jeito: `01310-100`, `01310100`, ` 01310100 ` com espaço do teclado, ou `CEP: 01310-100` colado de uma mensagem. O CPF do boleto chega com pontos ou sem eles. Na busca, quem procura "garrafa termica" espera achar a **Garrafa Térmica**.

O app precisa limpar, conferir e formatar esses textos antes de calcular o frete ou gerar o boleto. Hoje você aprende as ferramentas para isso.

:::question
Como o app aceita `01310100`, `01310-100` e ` 01310-100 ` como o mesmo CEP e recusa `0131-0100`?
:::

---

## :icon[text] Strings: imutáveis e indexadas

Uma **string** é uma sequência de caracteres, contada a partir do índice 0:

```javascript
const nome = 'Fone Bluetooth';
nome.length;        // 14
nome[0];            // 'F'
nome.toUpperCase(); // 'FONE BLUETOOTH'
nome;               // 'Fone Bluetooth': não mudou
```

A string é **imutável**: todo método devolve uma string nova e deixa a original como estava. Por isso o resultado precisa ir para uma constante, para o estado ou para o `return`:

```javascript
const email = texto.trim().toLowerCase(); // certo: guarda o resultado
texto.trim();                             // o resultado é jogado fora
```

---

## :icon[keyboard] Limpar e comparar o que foi digitado

No login, o teclado do celular põe maiúscula no início e o autocompletar deixa um espaço no fim:

```javascript
const digitado = '  Maria@Email.com ';
const email = digitado.trim().toLowerCase(); // 'maria@email.com'

const nome = 'Fone Bluetooth';
nome.includes('blue');               // false: diferencia maiúsculas
nome.toLowerCase().includes('blue'); // true
'01310-100'.startsWith('0');         // true: CEP da região 0
```

| Método | O que devolve |
|---|---|
| `trim()` | o texto sem espaços nas pontas |
| `toLowerCase()`, `toUpperCase()` | o texto todo em minúsculas ou maiúsculas |
| `includes(trecho)` | `true` se o trecho aparece em qualquer ponto |
| `startsWith(trecho)` | `true` se o texto começa com o trecho |

Como cada método devolve uma string, você pode **encadear** o próximo.

---

## :icon[split] Recortar: slice e split

```javascript
const nome = 'Maria Souza';
nome.split(' ');      // ['Maria', 'Souza']
nome.split(' ')[0];   // 'Maria': "Olá, Maria" no Perfil

const cartao = '4242424242421234';
cartao.slice(-4);              // '1234': "Cartão final 1234"
'Fone Bluetooth'.slice(0, 4);  // 'Fone'
'Fone Bluetooth'.slice(5);     // 'Bluetooth'
```

- `slice(inicio, fim)` copia do índice `inicio` até **antes** de `fim`; sem `fim`, vai até o final; número negativo conta a partir do fim
- `split(separador)` quebra o texto em um **array**; `join(separador)` faz o caminho de volta
- Para cortar uma descrição longa na tela, prefira `numberOfLines` no `Text`: o corte acompanha a largura de cada aparelho

---

## :icon[braces] Montar: template literals e padStart

```javascript
const resumo = `${qtd} ${qtd === 1 ? 'item' : 'itens'} no carrinho`;

const codigo = `#${String(42).padStart(5, '0')}`; // '#00042'

const mensagem = `Olha o que achei na Lojinha:
${produto.nome} por ${formatarPreco(produto.preco)}`;
```

- Entre crases, o **template literal** aceita qualquer expressão em `${...}`, inclusive um ternário para o plural
- Ele também aceita quebra de linha: é o texto pronto para o botão "Compartilhar produto"
- `padStart(tamanho, preenchimento)` completa pela esquerda até o tamanho pedido: número do pedido, hora `09:05`
- `padStart` é método de string: converta o número antes, com `String(42)`

---

## Pense

:::question
Sem rodar o código, diga o valor de `a`, `b`, `c` e `d`:

```javascript
let cupom = ' frete10 ';
cupom.toUpperCase();
const a = cupom;
const b = cupom.trim().toUpperCase();
const c = 'Ana Paula Lima'.split(' ')[1];
const d = String(7).padStart(2, '0') + ':' + String(30).padStart(2, '0');
```
:::

:::tip Resposta
- `a` é `' frete10 '`, com os espaços e em minúsculas: o resultado da segunda linha foi descartado
- `b` é `'FRETE10'`: primeiro tira os espaços, depois põe em maiúsculas
- `c` é `'Paula'`: o índice 1 é a segunda parte do array
- `d` é `'07:30'`: o 7 ganha um zero à esquerda e o 30 já tem dois dígitos
:::

---

## :icon[scan] Expressão regular: o desenho de um texto

Uma **expressão regular** (regex) descreve o formato de um texto. Ela fica entre barras: `/^\d{5}-?\d{3}$/` quer dizer "início, cinco dígitos, hífen opcional, três dígitos, fim".

| Peça | Significa | Exemplo |
|---|---|---|
| `\d` | um dígito de 0 a 9 | `\d\d` casa com `42` |
| `\D` | o que não é dígito | espaço, ponto, hífen, letra |
| `{5}` | o anterior, 5 vezes | `\d{5}` casa com `01310` |
| `?` | o anterior é opcional | `-?` aceita hífen ou não |
| `+` | o anterior, uma ou mais vezes | `\d+` casa com `7` e `2025` |
| `^` e `$` | início e fim do texto | `^\d{5}$` recusa `01310x` |

---

## :icon[badge-check] test: o texto tem o formato?

```javascript
const CEP = /^\d{5}-?\d{3}$/;

CEP.test('01310-100');     // true
CEP.test('01310100');      // true
CEP.test('01310-10');      // false: faltou um dígito
CEP.test('CEP 01310-100'); // false: sobra texto no início
```

O método **`test`** devolve `true` ou `false`. Serve para conferir o CEP antes de calcular o frete ou para mostrar o erro no `Campo`.

Sem `^` e `$`, o padrão casa com **um pedaço** do texto: `/\d{5}-?\d{3}/` aceita `'CEP 01310-100'` e até `'013101009999'`.

:::tip
Formato certo não garante dado verdadeiro. A regex confere o desenho; o CPF ainda tem dígitos verificadores, que são uma conta, e um CEP só se confirma consultando um serviço de endereços.
:::

---

## :icon[wand] replace com regex: limpar tudo de uma vez

```javascript
const cpf = '123.456.789-01';

cpf.replace('.', '');   // '123456.789-01': só o primeiro ponto
cpf.replace(/\D/g, ''); // '12345678901': todo caractere que não é dígito
```

- `replace` com um texto troca **só a primeira** ocorrência
- A **flag** `g` (global), depois da barra final, faz a regex valer para todas as ocorrências
- A flag `i` ignora maiúsculas: `/fone/i.test('FONE Bluetooth')` é `true`
- `replace(/\D/g, '')` é o primeiro passo de toda máscara: o `mascararTelefone` do E15 começa assim, e é por isso que ele aguenta texto colado

---

## :icon[search-check] match e grupos: separar as partes

:::center
![Diagrama: a regex do CEP em peças; o grupo 1, (\d{5}), casa com 01310 e o grupo 2, (\d{3}), casa com 100; o array partes tem o trecho inteiro na posição 0, o grupo 1 na posição 1 e o grupo 2 na posição 2](images/e33-grupos-cep.svg)
:::

```javascript
const CEP = /^(\d{5})-?(\d{3})$/;
const partes = '01310-100'.match(CEP);
// ['01310-100', '01310', '100']: partes[0], partes[1] e partes[2]

'0131'.match(CEP); // null: não casou
```

Os **parênteses** criam **grupos**. O `match` devolve um array com o trecho inteiro na posição 0 e depois um item por grupo, na ordem em que os parênteses abrem.

Se o texto não casa, o resultado é `null`: confira antes de ler `partes[1]`, ou use `partes?.[1]`.

---

## :icon[id-card] CPF: um grupo para cada bloco

```javascript
const CPF = /^(\d{3})\.?(\d{3})\.?(\d{3})-?(\d{2})$/;

CPF.test('123.456.789-01');     // true
CPF.test('12345678901');        // true
'123.456.789-01'.match(CPF)[4]; // '01': os dígitos verificadores
```

- `\.` é o ponto de verdade; sem a barra, `.` quer dizer "qualquer caractere"
- Cada bloco tem o seu grupo, e os separadores são opcionais

No `replace`, `$1`, `$2`... repetem o que cada grupo capturou. Assim você formata em uma linha:

```javascript
'12345678901'.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
// '123.456.789-01'
```

---

## Pratique

:::example Desafio
O campo de CEP do Checkout recebe o que o cliente digita, letra por letra. Escreva `mascararCep(texto)` que:

1. Fica só com os dígitos, no máximo 8
2. Põe o hífen depois do quinto dígito, só quando já existe o sexto

Confira com `'01310'`, `'013101'` e `'CEP: 01310-1009'`.
:::

:::tip Resposta
```javascript
export function mascararCep(texto) {
  const d = texto.replace(/\D/g, '').slice(0, 8);
  return d.replace(/^(\d{5})(\d)/, '$1-$2');
}
```

Saídas: `'01310'`, `'01310-1'` e `'01310-100'`. O grupo `(\d)` exige o sexto dígito: com cinco, o padrão não casa e o `replace` devolve o texto como está. É isso que deixa o cliente apagar o hífen.
:::

---

## :icon[search] Remover acentos na busca

```javascript
function semAcentos(texto) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

semAcentos('Garrafa Térmica'); // 'Garrafa Termica'
semAcentos('Calçado');         // 'Calcado'

const termo = semAcentos(busca).toLowerCase();
semAcentos(produto.nome).toLowerCase().includes(termo);
```

- `normalize('NFD')` separa a letra do acento: `é` vira `e` seguido do acento sozinho
- `[\u0300-\u036f]` é uma **classe**: qualquer caractere entre esses dois códigos, a faixa dos acentos soltos
- É a mesma limpeza do `buscarProdutos` do E27. Confira no Expo Go: o resultado que vale é o do celular

---

## :icon[triangle-alert] Erros comuns

:::warning
- Chamar `texto.trim()` sem guardar o resultado: a string original não muda
- Validar com regex sem `^` e `$`: o padrão aceita sobras antes e depois
- Esperar que `replace('.', '')` troque todos os pontos: só troca o primeiro; use `/\./g` ou `/\D/g`
- Usar `.` sem barra querendo o ponto: `/\d{3}.\d{3}/` aceita `123x456`
- Ler `match(...)[1]` sem conferir `null`: a tela fica vermelha quando o texto não casa
- Confundir formato com validade: `000.000.000-00` passa na regex do CPF
:::

---

## Resumo

:::summary
- Strings são imutáveis: `trim`, `toLowerCase`, `slice` e `replace` devolvem um texto novo, que você precisa guardar
- `split` quebra em array, `slice` recorta por índice, `padStart` completa pela esquerda e o template literal monta mensagens com `${...}`
- Uma regex descreve um formato; `test` responde se o texto tem esse formato, e `^` e `$` exigem o texto inteiro
- `replace(/\D/g, '')` limpa tudo o que não é dígito; grupos com parênteses separam partes no `match` e reaparecem como `$1` no `replace`
- `normalize('NFD')` com a classe `[\u0300-\u036f]` tira os acentos da busca
:::

---

## :icon[arrow-right] Próximos passos

O CEP e o CPF já têm formato. Falta o resto do que todo app de compras mostra: preço, data e prazo.

Na aula 48, você trabalha com números, datas e JSON:

- :icon[banknote] `Intl.NumberFormat` para preço, nota e desconto no padrão brasileiro
- :icon[calendar] `Date` para criar, somar dias e medir a diferença entre datas
- :icon[truck] dias úteis para a previsão "Chega até qui., 16 de out." no Detalhe
- :icon[braces] JSON e datas: o que acontece com uma data que vai e volta da API
