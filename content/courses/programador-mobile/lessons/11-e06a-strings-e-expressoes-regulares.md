---
title: Strings e expressões regulares
summary: Limpe, recorte e monte textos e confira e mascare CEP, CPF e telefone com expressões regulares.
module: linguagem-js
duration_minutes: 40
objectives:
  - Limpar, recortar e montar textos com métodos de string e template strings
  - Conferir o formato de CEP e CPF com expressões regulares e test
  - Mascarar CEP, CPF e telefone com replace e grupos
  - Remover acentos para a busca no catálogo
---

# Strings e expressões regulares

Programador Mobile · Encontro E06 · Aula 11 de 89

---

## O que você vai aprender

:::goal
- Limpar o que o cliente digita com `trim`, `toLowerCase` e `replace`
- Recortar e montar textos com `slice`, `split`, `padStart` e template strings
- Conferir o formato de CEP e CPF com uma expressão regular e `test`
- Separar as partes de um texto com `match` e grupos, e mascarar com `$1`
- Tirar os acentos para a busca achar "Térmica" quando o cliente digita "termica"
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **método** | uma função que já vem com o valor; você a chama com um ponto: `nome.trim()` |
| **índice** | a posição de cada caractere no texto, contada a partir do 0 |
| **imutável** | que não muda: o método devolve um texto novo e deixa o original como estava |
| **expressão regular** | o molde de um formato de texto, como "cinco dígitos, hífen, três dígitos" |
| **grupo** | um pedaço da expressão regular entre parênteses, que você separa depois |
| **máscara** | os separadores postos no lugar enquanto a pessoa digita: `01310-100` |

---

## O texto do cliente chega sujo

Quando a Lojinha virar app, no E30, cada cliente vai digitar o CEP de um jeito: `01310-100`, `01310100`, ` 01310100 ` com espaço do teclado, ou `CEP: 01310-100` colado de uma mensagem. O CPF chega com pontos ou sem eles. Na busca, quem procura "garrafa termica" espera achar a **Garrafa Térmica**.

Hoje o texto chega pelo terminal, igualmente sujo:

```bash
node src/scripts/pedido.js "  maria souza " "CEP: 01310-100" "12345678901"
```

As regras do `lojinha-regras` precisam limpar, conferir e formatar esses textos antes de calcular o frete ou gerar o boleto.

:::question
Como aceitar `01310100`, `01310-100` e ` 01310-100 ` como o mesmo CEP e recusar `0131-0100`?
:::

---

## Strings

Para mudar um documento importante, você rasura o original ou mexe numa cópia?

---

## :icon[text] Strings: imutáveis e indexadas

Uma **string** é um texto: uma fileira de caracteres (letras, dígitos, espaços), cada um numa posição, o **índice**, contada a partir do 0. Cada string traz **métodos**, funções que já vêm com ela e se chamam com um ponto:

```javascript
const nome = 'Fone Bluetooth';
nome.length;        // 14
nome[0];            // 'F'
nome.toUpperCase(); // 'FONE BLUETOOTH'
nome;               // 'Fone Bluetooth': não mudou
```

`length` (comprimento) conta os caracteres, com o espaço; `nome[0]` lê o caractere da posição 0.

A string é **imutável**: o método tira uma cópia, mexe na cópia e devolve essa cópia, sem rasurar o original. Por isso o resultado precisa ir para uma constante ou para o `return`:

```javascript
const email = texto.trim().toLowerCase(); // certo: guarda o resultado
texto.trim();                             // o resultado é jogado fora
```

---

## :icon[keyboard] Limpar e comparar o que foi digitado

No cadastro, o teclado do celular põe maiúscula no início e o autocompletar deixa um espaço no fim:

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
| `trim()` ("aparar") | o texto sem espaços nas pontas |
| `toLowerCase()`, `toUpperCase()` | o texto todo em minúsculas ou maiúsculas |
| `includes(trecho)` ("inclui") | `true` se o trecho aparece em qualquer ponto |
| `startsWith(trecho)` ("começa com") | `true` se o texto começa com o trecho |

Como cada método devolve uma string, você pode **encadear** o próximo: em `digitado.trim().toLowerCase()`, o texto aparado vira o ponto de partida do `toLowerCase`.

---

## Recortar e montar

Como pegar só o primeiro nome de "Maria Souza"?

---

## :icon[split] Recortar: slice e split

**Recortar** é copiar só um pedaço do texto. O `slice` ("fatia") corta pelas posições; o `split` ("dividir") quebra o texto onde houver um separador, como o espaço:

```javascript
const nome = 'Maria Souza';
nome.split(' ');      // ['Maria', 'Souza']
nome.split(' ')[0];   // 'Maria': "Olá, Maria!" no terminal

const cartao = '4242424242421234';
cartao.slice(-4);              // '1234': "Cartão final 1234"
'Fone Bluetooth'.slice(0, 4);  // 'Fone'
'Fone Bluetooth'.slice(5);     // 'Bluetooth'
```

- `slice(inicio, fim)` copia do índice `inicio` até **antes** de `fim`; sem `fim`, vai até o final; número negativo conta a partir do fim
- `split(separador)` quebra o texto em pedaços e devolve um **array**: uma lista entre colchetes, como uma fileira de gavetas numeradas a partir do 0. Arrays chegam a fundo no E08
- `join(separador)` faz o caminho de volta: `'Ana Paula'.split(' ').join('-')` dá `'Ana-Paula'`

---

## :icon[braces] Montar: template strings, padStart e padEnd

Você monta mensagens com template strings, o modelo de texto com lacunas `${ }` do E05. Para alinhar o que o terminal imprime, junte com `padStart` e `padEnd` (*pad*, "enchimento"): eles completam o texto até um tamanho.

```javascript
const codigo = `#${String(42).padStart(5, '0')}`; // '#00042'
const hora = `${String(9).padStart(2, '0')}:${String(5).padStart(2, '0')}`; // '09:05'

console.log('Fone Bluetooth'.padEnd(18) + formatarPreco(199.9));
console.log('Garrafa Térmica'.padEnd(18) + formatarPreco(79.9));
// Fone Bluetooth    R$ 199,90
// Garrafa Térmica   R$ 79,90
```

- `padStart(tamanho, preenchimento)` completa pela esquerda até o tamanho pedido: número do pedido, hora
- `padEnd` completa pela direita; sem o preenchimento, usa espaços. É o que alinha a coluna de preços
- São métodos de string: converta o número antes, com `String(42)`

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

## Expressões regulares

Como você reconhece uma placa de carro, mesmo sem saber de qual carro ela é?

---

## :icon[scan] Expressão regular: o desenho de um texto

Uma **expressão regular** (em inglês, *regular expression*, ou **regex**) é o molde de um formato de texto. Pense na placa de carro: você reconhece uma placa pelo desenho, letras e números numa ordem certa, sem saber de qual carro ela é. A regex descreve o desenho, e o JavaScript confere se um texto encaixa nele.

Ela fica entre barras. A do CEP é `/^\d{5}-?\d{3}$/`, e se lê assim: "início, cinco dígitos, hífen opcional, três dígitos, fim".

- `01310-100` e `01310100` encaixam: o hífen é opcional
- `0131-0100` não encaixa: tem só quatro dígitos antes do hífen
- `CEP 01310-100` não encaixa: o desenho começa com um dígito, e o texto começa com letras

---

## :icon[scan] As peças de uma regex

Cada peça descreve um pedaço do texto, da esquerda para a direita:

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

O método **`test`** ("testar") confere se o texto encaixa no molde e devolve `true` ou `false`. Serve para conferir o CEP antes de calcular o frete, que a Lojinha ganha no E13.

Sem `^` e `$`, o padrão casa com **um pedaço** do texto: `/\d{5}-?\d{3}/` aceita `'CEP 01310-100'` e até `'013101009999'`.

:::tip
Formato certo não garante dado verdadeiro. A regex confere o desenho; o CPF ainda tem dígitos verificadores, que são uma conta, e um CEP só se confirma consultando um serviço de endereços.
:::

---

## Limpar com regex

Como tirar de uma vez todos os pontos e o hífen de um CPF?

---

## :icon[wand] replace com regex: limpar tudo de uma vez

**`replace`** ("substituir") troca um pedaço do texto por outro. Com uma regex, ele troca todo pedaço que encaixa no molde:

```javascript
const cpf = '123.456.789-01';

cpf.replace('.', '');   // '123456.789-01': só o primeiro ponto
cpf.replace(/\D/g, ''); // '12345678901': todo caractere que não é dígito
```

- `replace` com um texto troca **só a primeira** ocorrência
- A **flag** `g` (global), depois da barra final, faz a regex valer para todas as ocorrências
- A flag `i` ignora maiúsculas: `/fone/i.test('FONE Bluetooth')` é `true`
- `replace(/\D/g, '')` é o primeiro passo de toda máscara: é por isso que ela aguenta texto colado, com pontos, espaços e letras

---

## :icon[wand] replace na prática

Três textos que chegam de jeitos diferentes, limpos pela mesma linha:

```javascript
const cpfColado = '123.456.789-01';
const telefone = '(11) 98765-4321';
const cep = 'CEP: 01310-100';

console.log(cpfColado.replace(/\D/g, '')); // 12345678901
console.log(telefone.replace(/\D/g, ''));  // 11987654321
console.log(cep.replace(/\D/g, ''));       // 01310100
```

- Os três saem só com dígitos, prontos para a máscara ou para o `test`
- Sem o `g`, a troca para no primeiro: `cpfColado.replace(/\D/, '')` dá `'123456.789-01'`
- A string original não muda: `cpfColado` continua com os pontos e o hífen

---

## Grupos

Como separar os cinco primeiros dígitos do CEP dos três últimos?

---

## :icon[search-check] match e grupos: separar as partes

O **`match`** ("encaixar") devolve as partes do texto que encaixaram na regex. Cada par de parênteses cria um **grupo**: uma parte que você quer separar.

```javascript
const CEP = /^(\d{5})-?(\d{3})$/;
const partes = '01310-100'.match(CEP);
// ['01310-100', '01310', '100']: partes[0], partes[1] e partes[2]

'0131'.match(CEP); // null: não casou
```

O resultado é um array: o trecho inteiro na posição 0 e depois um item por grupo, na ordem em que os parênteses abrem.

Se o texto não casa, o resultado é `null`, e ler `partes[1]` derruba o script com `TypeError`. Confira o formato com `test` antes; no E07, um `if` decide o que fazer quando não casa.

---

## :icon[search-check] Os grupos do CEP, peça por peça

:::center
![Diagrama: a regex do CEP em peças; o grupo 1, (\d{5}), casa com 01310 e o grupo 2, (\d{3}), casa com 100; o array partes tem o trecho inteiro na posição 0, o grupo 1 na posição 1 e o grupo 2 na posição 2](images/e06-grupos-cep.svg)
:::

Siga cada grupo até a sua posição no array: o grupo 1, `(\d{5})`, vai para `partes[1]`; o grupo 2, `(\d{3})`, vai para `partes[2]`. A posição 0 guarda o trecho inteiro, `'01310-100'`.

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

No `replace`, `$1`, `$2`... repetem o que cada grupo capturou. Leia `'$1.$2.$3-$4'` como "o grupo 1, um ponto, o grupo 2, um ponto, o grupo 3, um hífen e o grupo 4". Assim você formata em uma linha:

```javascript
'12345678901'.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
// '123.456.789-01'
```

---

## Pratique

:::example Desafio
A **máscara** põe os separadores no lugar enquanto a pessoa digita. No app, o campo de CEP vai chamar a máscara a cada tecla. Hoje, você a escreve e testa no terminal. Escreva `mascararCep(texto)` que:

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

## Máscaras

Para que servem os tracinhos já impressos num formulário de papel?

---

## :icon[phone] Máscaras em cadeia: o telefone

Uma **máscara** põe os separadores no lugar enquanto a pessoa digita, como os tracinhos de um formulário de papel: `(__) _____-____`. A do telefone usa dois `replace`, um depois do outro:

```javascript
export function mascararTelefone(texto) {
  const d = texto.replace(/\D/g, '').slice(0, 11);
  return d
    .replace(/^(\d{2})(\d)/, '($1) $2') // (11) 9...
    .replace(/(\d{5})(\d)/, '$1-$2');   // (11) 98765-4...
}

mascararTelefone('11987654321');      // '(11) 98765-4321'
mascararTelefone('1198765');          // '(11) 98765'
mascararTelefone('(11) 98765-43219'); // '(11) 98765-4321': corta o excesso
```

- Cada `replace` devolve uma string nova, e o próximo trabalha em cima dela, como em `trim().toLowerCase()`
- Como no CEP, cada separador só aparece quando já existe o dígito seguinte
- Na substituição, `(` e `)` são texto comum; só dentro da regex eles criam grupos

No laboratório, o CPF segue o mesmo caminho: ponto, ponto e hífen.

---

## :icon[phone] A máscara a cada tecla

No app, a máscara roda a cada tecla. É isto que o cliente vê enquanto digita o telefone:

```javascript
mascararTelefone('1');           // '1'
mascararTelefone('11');          // '11'
mascararTelefone('119');         // '(11) 9'
mascararTelefone('1198765');     // '(11) 98765'
mascararTelefone('11987654');    // '(11) 98765-4'
mascararTelefone('11987654321'); // '(11) 98765-4321'
```

- Com só o DDD, nada muda: o parêntese espera o terceiro dígito
- O hífen só aparece quando chega o dígito depois dos cinco primeiros do número
- Se o cliente apagar um dígito, a máscara refaz tudo a partir do que sobrou

---

## Acentos

Quem digita "termica" na busca quer achar a Garrafa Térmica?

---

## :icon[search] Remover acentos na busca

Para a busca achar "Térmica" quando o cliente digita "termica", tire os acentos dos dois lados antes de comparar:

```javascript
export function semAcentos(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

semAcentos('Garrafa Térmica'); // 'Garrafa Termica'
semAcentos('Calçado');         // 'Calcado'

const termo = semAcentos('TERMICA').toLowerCase();
semAcentos('Garrafa Térmica').toLowerCase().includes(termo); // true
```

- `normalize('NFD')` separa a letra do acento: `é` vira `e` seguido do acento sozinho
- `[̀-ͯ]` é uma **classe**: qualquer caractere entre esses dois códigos, a faixa dos acentos soltos
- Normalize **os dois lados**: o termo digitado e o nome do produto. No E14, você escreve o `buscarProdutos` em `src/regras/catalogo.js`, e ele usa esta limpeza

---

## :icon[search] Busca sem acentos na prática

O que o cliente digita e o que a busca responde:

```javascript
const termo = semAcentos('termica').toLowerCase();
semAcentos('Garrafa Térmica').toLowerCase().includes(termo);          // true
semAcentos('Caixa de Som Portátil').toLowerCase().includes('portatil'); // true
semAcentos('Lógica de Programação').toLowerCase(); // 'logica de programacao'

'Garrafa Térmica'.toLowerCase().includes('termica'); // false: faltou o semAcentos
```

- Os dois lados passam pela mesma limpeza: sem acento e em minúsculas
- Na última linha, só o nome do produto foi para minúsculas: o `é` continua lá, e a busca falha

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Cannot read properties of null (reading '1')` | o `match` não casou e devolveu `null` | confira o formato com `test` antes de ler as partes |
| `Cannot read properties of undefined (reading 'trim')` | o texto não chegou: faltou o argumento | dê um valor padrão, o "de sempre" do E05 |
| `padStart is not a function` | o valor é um número, não um texto | converta antes: `String(42)` |
| `Invalid regular expression` | um parêntese ou colchete ficou sem par na regex | conte os que abrem e os que fecham |

---

## :icon[triangle-alert] Erros comuns

:::warning
- Chamar `texto.trim()` sem guardar o resultado: a string original não muda
- Validar com regex sem `^` e `$`: o padrão aceita sobras antes e depois
- Esperar que `replace('.', '')` troque todos os pontos: só troca o primeiro; use `/\./g` ou `/\D/g`
- Usar `.` sem barra querendo o ponto: `/\d{3}.\d{3}/` aceita `123x456`
- Ler `match(...)[1]` quando o texto não casa: o `match` devolve `null` e o script para com `TypeError`
- Confundir formato com validade: `000.000.000-00` passa na regex do CPF
:::

---

## Resumo

:::summary
- Strings são imutáveis: `trim`, `toLowerCase`, `slice` e `replace` devolvem um texto novo, que você precisa guardar
- `split` quebra em array, `slice` recorta por índice, `padStart` e `padEnd` completam e a template string monta mensagens com `${...}`
- Uma regex descreve um formato; `test` responde se o texto tem esse formato, e `^` e `$` exigem o texto inteiro
- `replace(/\D/g, '')` limpa tudo o que não é dígito; grupos com parênteses separam partes no `match` e reaparecem como `$1` no `replace`
- `normalize('NFD')` com a classe `[̀-ͯ]` tira os acentos da busca
:::

---

## :icon[arrow-right] Próximos passos

O CEP e o CPF já têm formato. Falta o resto do que todo pedido mostra: preço, data e prazo.

Na aula 12, você trabalha com números, datas e JSON:

- :icon[banknote] `Intl.NumberFormat` para preço, nota e desconto no padrão brasileiro
- :icon[calendar] `Date` para criar, somar dias e medir a diferença entre datas
- :icon[truck] dias úteis para a previsão "Chega até qui., 16 de out."
- :icon[braces] JSON e datas: o que acontece com uma data que vai para um arquivo e volta

No laboratório, as máscaras e a previsão entram em `src/utils/` e num script de pedido.
