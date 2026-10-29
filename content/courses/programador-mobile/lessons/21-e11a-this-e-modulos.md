---
title: this e módulos
summary: O this que se perde quando o método vira callback e o lojinha-regras organizado em módulos, pastas e barris.
module: linguagem-js
duration_minutes: 40
objectives:
  - Explicar como o this é definido e corrigir um método passado como callback
  - Usar arrow functions dentro de métodos sem perder o this
  - Exportar e importar com nome, com default e por reexportação
  - Organizar o lojinha-regras em pastas com arquivos-barril index.js
---

# this e módulos

Programador Mobile · Encontro E11 · Aula 21 de 89

---

## O que você vai aprender

:::goal
- Descobrir quem é o `this` num método: o objeto antes do ponto
- Consertar o método que perde o `this` no `setTimeout` e no `forEach`
- Usar arrow dentro de um método e saber por que o método não deve ser arrow
- Exportar com nome e com `default`, reexportar e montar barris `index.js`
- Organizar o `lojinha-regras` em pastas que importam sempre "para baixo"
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **método** | uma função guardada dentro de um objeto, que trabalha com os dados dele |
| **`this`** | a palavra que, dentro de um método, quer dizer "este objeto" |
| **callback** | uma função que você entrega para outro código chamar depois |
| **módulo** | um arquivo `.js`: tem as próprias variáveis e escolhe o que mostra aos outros arquivos |
| **barril** | um arquivo `index.js` que junta, num lugar só, o que uma pasta exporta |

---

## O aviso que sai pela metade

A Lojinha vai ter uma promoção por semana. Você guarda os dados e o aviso num objeto só:

```javascript
const promocao = {
  nome: 'Semana do Áudio',
  percentual: 10,
  anunciar() {
    console.log(`${this.nome}: ${this.percentual}% de desconto`);
  },
};

promocao.anunciar();                 // Semana do Áudio: 10% de desconto
setTimeout(promocao.anunciar, 1000); // undefined: undefined% de desconto
```

O `setTimeout`, do E10, roda uma função depois de um tempo: aqui, 1000 milissegundos, ou 1 segundo. Na hora, a frase sai certa. Um segundo depois, a mesma função imprime `undefined`. A diferença está numa palavra que muda de valor conforme o jeito de chamar: `this`.

:::question
Se o método é o mesmo, por que o `setTimeout` muda o resultado?
:::

---

## Métodos

Que ações a ficha de um cliente sabe fazer sozinha, num app?

---

## :icon[braces] Métodos: funções dentro do objeto

Um objeto é uma ficha de cadastro: cada campo tem nome e valor. Um **método** é uma ação que a ficha sabe fazer com os próprios dados: uma função guardada num campo. No E08, os `comparadores` já guardavam funções assim.

```javascript
const promocao = {
  nome: 'Semana do Áudio',
  percentual: 10,
  descrever() {
    return `${this.nome}: ${this.percentual}% de desconto`;
  },
};

promocao.descrever(); // 'Semana do Áudio: 10% de desconto'
```

- `descrever() { ... }` é a forma curta de `descrever: function () { ... }`, sem a palavra `function`
- Dentro do método, **`this`** quer dizer "este objeto": aqui, a `promocao`
- Com `this`, o método lê os dados da própria ficha sem repetir o nome dela

---

## :icon[user] Métodos na prática

Todo objeto com dados e uma ação sobre eles pode ganhar um método:

```javascript
const cliente = {
  nome: 'Ana',
  cidade: 'Recife',
  saudar() {
    return `Olá, ${this.nome}! Entregamos em ${this.cidade}.`;
  },
};
console.log(cliente.saudar()); // Olá, Ana! Entregamos em Recife.
```

```javascript
const garrafa = {
  nome: 'Garrafa Térmica',
  preco: 79.9,
  total(qtd) {
    return this.preco * qtd;
  },
};
console.log(garrafa.total(2)); // 159.8
```

- O `saudar` lê dois campos da própria ficha com `this`
- O `total` recebe um parâmetro, como qualquer função, e usa o `this.preco`
- A promoção da semana faz o mesmo no `anunciar()`

---

## O this

Quando alguém diz "eu moro em Recife", quem mora em Recife?

---

## :icon[circle-dot] this: quem está antes do ponto

O `this` funciona como a palavra "eu" numa frase: quem é o "eu" depende de quem está falando. Num método, quem fala é o objeto que vem **antes do ponto**, na hora da chamada. Não importa onde o método foi escrito.

```javascript
promocao.descrever();
// antes do ponto: promocao. Lá dentro, this.nome é promocao.nome
```

A regra para guardar: **`this` é o objeto antes do ponto, na hora da chamada**. Sem nada antes do ponto, a frase fica sem ninguém falando.

---

## :icon[list-checks] this na prática

A mesma função, chamada de três jeitos:

```javascript
const semanaDaCasa = { nome: 'Semana da Casa', percentual: 15 };
semanaDaCasa.descrever = promocao.descrever; // a mesma função

promocao.descrever();     // 'Semana do Áudio: 10% de desconto'
semanaDaCasa.descrever(); // 'Semana da Casa: 15% de desconto'

const descrever = promocao.descrever; // copia só a função
descrever(); // nada antes do ponto: this é undefined
// TypeError: Cannot read properties of undefined (reading 'nome')
```

- **Com `promocao.`**, o "eu" é a promoção do áudio; **com `semanaDaCasa.`**, é a da casa. A função é uma só
- **Sem nada antes do ponto**, não há "eu". Os arquivos com `import` e `export` rodam em **modo estrito** (*strict mode*), um jeito mais rígido de rodar o JavaScript: nele, o `this` solto é `undefined`
- `this.nome` vira `undefined.nome`, e o erro diz: "não consigo ler `nome` de `undefined`"

---

## Método como callback

Um bilhete diz "eu chego às 8". Se outra pessoa o lê em voz alta, quem chega?

---

## :icon[timer] O método vira callback

Um **callback** é uma função entregue para outro código chamar depois (E10). `setTimeout(promocao.anunciar, 1000)` entrega **só a função**, sem o objeto: a frase vai sem quem fala. Depois, o temporizador a chama sem `promocao.` na frente.

:::center
![Diagrama: na chamada direta, promocao.anunciar() tem promocao antes do ponto, o this é a promoção e sai Semana do Áudio: 10%; no setTimeout, um segundo depois, a função é chamada sozinha, sem nada antes do ponto, o this não é a promoção e sai undefined: undefined%](images/e11-this-callback.svg)
:::

- Quem chama decide o `this`. O `setTimeout` do Node usa o próprio temporizador, sem `nome`: sai `undefined`
- `forEach`, `map` e `filter` chamam sem nada antes do ponto: o `this` é `undefined`, e o método quebra com `TypeError`

---

## :icon[wrench] Consertando: arrow ou bind

Dois jeitos de o método chegar ao callback junto com o objeto:

```javascript
// 1. arrow: um segundo depois, a chamada acontece com ponto
setTimeout(() => promocao.anunciar(), 1000);

// 2. bind: uma cópia da função com o this preso
const anunciarFixo = promocao.anunciar.bind(promocao);
setTimeout(anunciarFixo, 1000);
```

```plaintext
Semana do Áudio: 10% de desconto
Semana do Áudio: 10% de desconto
```

- A **arrow** é uma função nova. Quando o temporizador a chama, ela chama `promocao.anunciar()`, **com ponto**
- O **`bind`** (em inglês, amarrar) cria uma cópia da função com o `this` amarrado à promoção

| Conserto | Quando usar |
|---|---|
| arrow que chama com ponto | o padrão: fica claro quem chama e com o quê |
| `bind` | código antigo e bibliotecas que pedem uma função pronta |

---

## :icon[triangle-alert] Cuidado com os parênteses

```javascript
setTimeout(promocao.anunciar(), 1000); // errado
```

Com parênteses, o método roda **na hora**: o aviso sai agora, e não daqui a um segundo. O `setTimeout` recebe o que o `anunciar()` devolveu, `undefined`, no lugar de uma função. O Node reclama:

```plaintext
TypeError [ERR_INVALID_ARG_TYPE]: The "callback" argument must be of type function. Received undefined
```

Em português: "o callback precisa ser uma função, e chegou `undefined`". Sem parênteses, você entrega a função; com parênteses, entrega o resultado dela.

---

## Arrow e this

De quem a arrow pega o "eu": de quem a chama ou do lugar onde nasceu?

---

## :icon[arrow-right] Arrow não tem this próprio

A arrow não tem um "eu" próprio. Como na mochila da closure (E10), ela leva junto o `this` do lugar onde foi escrita. Dentro de um método, esse lugar é o método: a arrow usa o `this` dele.

```javascript
const promocao = {
  nome: 'Semana do Áudio',
  categoria: 'audio',
  participantes(lista) {
    return lista.filter((produto) => produto.categoria === this.categoria);
  },
};
```

O `filter` chama a arrow sem ponto, e mesmo assim funciona: o `this` dela é o do `participantes`, a promoção. A regra cabe numa frase: arrow **dentro** do método, nunca **como** método.

---

## :icon[list-checks] Arrow na prática

Três jeitos de escrever, numa promoção com `categoria: 'audio'`:

```javascript
participantes(lista) { // com arrow, o this é o do método: a promoção
  return lista.filter((produto) => produto.categoria === this.categoria);
},
```

**Arrow dentro do método:** funciona. Saem Fone Bluetooth, Caixa de Som Portátil e Microfone USB.

```javascript
participantes(lista) { // com function, quebra
  return lista.filter(function (produto) {
    return produto.categoria === this.categoria; // this é undefined
  });
},
```

**`function` dentro do método:** o `filter` a chama sem ponto. `TypeError: Cannot read properties of undefined (reading 'categoria')`.

```javascript
const aviso = {
  nome: 'Semana do Áudio',
  anunciar: () => console.log(this.nome), // método como arrow
};

aviso.anunciar();
// TypeError: Cannot read properties of undefined (reading 'nome')
```

**Método como arrow:** ele leva o `this` de fora do objeto, que num módulo é `undefined`. Para métodos, use a forma curta: `anunciar() { ... }`.

---

## Pense

:::question
A `promocao` é esta:

```javascript
const promocao = {
  nome: 'Semana do Áudio',
  percentual: 10,
  anunciar() {
    console.log(`${this.nome}: ${this.percentual}% de desconto`);
  },
};
```

Em cada linha, o aviso sai certo, sai com `undefined` ou quebra?

```javascript
setTimeout(() => promocao.anunciar(), 1000);        // A
setTimeout(promocao.anunciar, 1000);                // B
['seg', 'qua'].forEach(promocao.anunciar);          // C
setTimeout(promocao.anunciar.bind(promocao), 1000); // D
```
:::

:::tip Resposta
- **A** sai certo: a arrow chama com ponto, um segundo depois
- **B** sai `undefined: undefined%`: o temporizador chama a função solta, e o `this` dele não tem `nome`
- **C** quebra com `TypeError`: o `forEach` chama sem nada antes do ponto, e o `this` é `undefined`
- **D** sai certo: o `bind` prendeu o `this` na promoção
:::

---

## Módulos

Numa loja, o que fica na vitrine e o que fica no estoque?

---

## :icon[package] Um arquivo, um módulo

Desde o E02, cada arquivo do `lojinha-regras` é um **módulo**. Pense numa loja: o que tem `export` vai para a vitrine, e outro arquivo pega de lá com `import`. O resto fica no estoque, e quem está fora não vê. O `formatar.js` poderia guardar as opções da moeda assim:

```javascript
// src/utils/formatar.js
const moeda = { style: 'currency', currency: 'BRL' }; // sem export: privado

export function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', moeda);
}
```

- **Escopo próprio**: as variáveis de um arquivo só existem nele. Duas constantes `moeda` em arquivos diferentes não se misturam
- **Exportar é escolher** o que os outros arquivos podem usar, como a closure do E10 esconde o `total`
- **Modo estrito**: todo módulo roda nele; por isso a chamada sem ponto deu `undefined`
- No Node, o `import` de um arquivo seu leva a extensão: `'./precos.js'`

---

## :icon[store] Módulos na prática

**Caso 1: cada arquivo com as suas variáveis.** Um script pode ter a própria `moeda`, sem esbarrar na do `formatar.js`:

```javascript
// src/scripts/teste-modulo.js
import { formatarPreco } from '../utils/formatar.js';

const moeda = 'reais'; // outra moeda, só deste arquivo
console.log(formatarPreco(199.9), 'em', moeda); // R$ 199,90 em reais
```

**Caso 2: o estoque não sai da loja.** Pedir o que não tem `export` para o script antes da primeira linha:

```javascript
import { moeda } from '../utils/formatar.js';
// SyntaxError: The requested module '../utils/formatar.js'
//   does not provide an export named 'moeda'
```

Em português: "esse arquivo não tem um export chamado `moeda`". Para outro arquivo usar, só com `export`.

---

## Export e import

Uma vitrine tem vários produtos com etiqueta e um destaque. Quantos destaques cabem?

---

## :icon[file-code] Export nomeado e export default

Há dois jeitos de pôr algo na vitrine. O **export nomeado** mostra cada coisa com a sua etiqueta de nome. O **export default** (em inglês, padrão) é o destaque da vitrine: a coisa principal do arquivo.

```javascript
// exports nomeados: quantos quiser, cada um com o seu nome
export function paraCentavos(reais) { /* ... */ }
export const PERCENTUAL_PIX = 5;

// export default: no máximo um por arquivo, a "coisa principal" dele
export default promocao;
```

```javascript
import { paraCentavos, PERCENTUAL_PIX } from './precos.js'; // nomes exatos, entre chaves
import promocao from '../data/promocao.js';                 // sem chaves, qualquer nome
import { paraCentavos as centavos } from './precos.js';     // renomeia com as
import * as precos from './precos.js';                      // tudo: precos.paraCentavos(...)
```

---

## :icon[list-ordered] Os imports em português

| Linha | O que ela diz |
|---|---|
| `import { paraCentavos, PERCENTUAL_PIX } from './precos.js'` | "traga estes dois nomes de `precos.js`". As chaves pedem os nomes exatos |
| `import promocao from '../data/promocao.js'` | "traga o destaque de `promocao.js`". Sem chaves, e o nome você escolhe |
| `import { paraCentavos as centavos } ...` | "traga `paraCentavos`, mas aqui ele se chama `centavos`" |
| `import * as precos ...` | "traga tudo, guardado em `precos`": `precos.paraCentavos(...)` |

Convenção do `lojinha-regras`: regras, utilitários e dados com exports nomeados. O `default` fica para arquivos de uma coisa só, como a promoção da semana e, a partir do E15, cada classe.

---

## :icon[square-terminal] Export e import na prática

Um script do `lojinha-regras` com três jeitos de importar:

```javascript
// src/scripts/teste-imports.js
import { paraCentavos } from '../regras/precos.js';
import promocao from '../data/promocao.js';
import * as precos from '../regras/precos.js';

console.log(paraCentavos(199.9));     // 19990
console.log(promocao.nome);           // Semana do Áudio
console.log(precos.paraReais(19990)); // 199.9
```

- **Nomeado**, entre chaves: o `paraCentavos` sai da vitrine de `precos.js` com o nome exato
- **Default**, sem chaves: o destaque de `promocao.js`, a promoção da semana
- **Tudo**, com `* as`: as funções de `precos.js` viram campos de `precos`

---

## :icon[bug] Quando o import erra

O Node confere todos os imports **antes** de rodar a primeira linha. Um nome que o arquivo não exporta derruba o script na largada:

```javascript
// promocao.js só tem export default, e o import pede um nome
import { promocao } from '../data/promocao.js';
// SyntaxError: The requested module '../data/promocao.js'
//   does not provide an export named 'promocao'

import { formatarPreco } from '../utils/formatar'; // faltou o .js
// Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../src/utils/formatar'
```

Em português: "o módulo não tem um export chamado `promocao`" e "não achei o arquivo".

:::warning O Jest perdoa, o Node não
O Jest passa os arquivos pelo Babel (E04), que aceita caminho sem extensão e entrega `undefined` no lugar de um nome que falta. O erro só aparece na chamada, como `is not a function`. Teste verde não garante script funcionando: rode também os scripts com `node`.
:::

---

## Barris e pastas

Três arquivos de regras pedem mesmo três linhas de import?

---

## :icon[boxes] O barril: uma vitrine para a pasta

Um **barril** (em inglês, *barrel*) é um `index.js` que junta numa vitrine só o que os arquivos da pasta exportam. Quem está fora da pasta importa de um lugar só:

```javascript
// src/regras/index.js
export * from './precos.js';
export * from './carrinho.js';
export * from './frete.js';
```

```javascript
// num script: três arquivos de regras, uma linha só
import { calcularDesconto, subtotal, calcularFreteComCache } from '../regras/index.js';
```

`export * from './precos.js'` quer dizer: "ponha nesta vitrine tudo o que `precos.js` exporta com nome". O barril não tem regra própria: só repassa o que os outros arquivos exportam.

---

## :icon[square-terminal] Barril na prática

Duas regras de arquivos diferentes, `precos.js` e `carrinho.js`, numa linha de import só:

```javascript
// src/scripts/teste-barril.js
import { calcularDesconto, subtotal } from '../regras/index.js';

console.log(calcularDesconto(199.9, 10));         // 19.99
console.log(subtotal([{ preco: 79.9, qtd: 2 }])); // 159.8
```

E o mesmo import apontando só a pasta, sem o `index.js`:

```javascript
import { subtotal } from '../regras';
```

```plaintext
Error [ERR_UNSUPPORTED_DIR_IMPORT]: Directory import '...\src\regras' is not supported
```

Em português: "importar uma pasta não é aceito". O Node quer o nome do arquivo: `'../regras/index.js'`.

---

## :icon[triangle-alert] Três cuidados com o barril

- **Escreva o `index.js` no caminho.** No Node, importar só a pasta (`'../regras'`) dá `ERR_UNSUPPORTED_DIR_IMPORT`
- **Dentro da pasta, nunca importe do próprio barril.** Em `regras/`, importe direto do arquivo (`'./precos.js'`). Se `frete.js` importa o barril, e o barril importa `frete.js`, um espera pelo outro: é um **ciclo**, que pode quebrar com `ReferenceError: Cannot access ... before initialization`
- **Barril vale para pastas** com vários arquivos usados juntos

---

## :icon[corner-down-right] Reexportar: export ... from

**Reexportar** é mostrar na sua vitrine o que outro arquivo exporta, sem usar ele mesmo. O barril usa o `export *`; há mais duas formas:

```javascript
export { paraCentavos, paraReais } from './precos.js'; // só estes dois
export * from './carrinho.js';                         // todos os nomeados
export { default as promocao } from './promocao.js';   // o default vira nomeado
```

- Nada é copiado: quem importa daqui recebe as mesmas funções do arquivo original
- `export *` não leva o `default`; para ele, use `export { default as nome }`
- Se dois arquivos exportam o mesmo nome, o `export *` não escolhe nenhum: importar esse nome quebra com `contains conflicting star exports`

---

## :icon[folder-tree] Organização por pasta

Pense nos andares de um prédio: as importações só **descem**, nunca sobem.

| Pasta | O que mora lá | Pode importar |
|---|---|---|
| `scripts/` | o que roda no terminal | todas as pastas abaixo |
| `regras/` | funções puras: preços, carrinho, frete | `utils/` e `data/` |
| `utils/` | `formatar`, `funcoes`, `validar`, `datas` | nada do projeto |
| `data/` | catálogo e promoção da semana | nada do projeto |

Uma regra nunca importa um script, e um utilitário não conhece as regras.

A estrutura cresce sem mudar a direção: `modelos/` chega no E15, `servicos/` e `api/` no E18 e no E19. No E30, a pasta `src/` inteira vai para o app.

---

## Módulo roda uma vez

A vitrine da loja é montada de novo para cada cliente que entra?

---

## :icon[database-zap] O módulo roda uma vez

A vitrine é montada uma vez, quando a loja abre, e todo cliente vê os mesmos produtos. Com o módulo é igual: o código solto dele roda **uma vez**, na primeira importação. Quem importa depois recebe o que já foi criado, e não uma cópia.

```javascript
// src/regras/frete.js (E10)
export const calcularFreteComCache = memoize(calcularFrete); // roda uma vez
```

- Todos os arquivos que importam `calcularFreteComCache` dividem **o mesmo cache**, a memória de respostas do E10
- Todo arquivo que importa `produtos` recebe **o mesmo array**
- Se um arquivo alterar esse array, todos os outros enxergam a mudança. A aula 22 mostra por quê, e como evitar

---

## :icon[list-checks] Uma vez só, na prática

Ponha por um momento `console.log('carregando precos.js');` na primeira linha de `precos.js` e rode:

```javascript
// src/scripts/teste-uma-vez.js
import { calcularDesconto } from '../regras/index.js'; // o barril importa precos.js
import { paraCentavos } from '../regras/precos.js';    // e este também

console.log(paraCentavos(calcularDesconto(199.9, 10))); // 1999
```

```plaintext
carregando precos.js
1999
```

Dois caminhos até o mesmo arquivo, e a frase sai uma vez só. Apague o `console.log` depois. Agora, o array:

```javascript
import { produtos } from '../data/produtos.js';
import { produtos as outraVez } from '../data/produtos.js';

outraVez.push({ id: 99, nome: 'Teste' });
console.log(produtos.length); // 13: eram 12, e é o mesmo array
```

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `undefined: undefined%` | o `setTimeout` recebeu o método solto | `() => promocao.anunciar()` |
| `(reading 'nome')` | método chamado sem ponto ou escrito como arrow | arrow com ponto; método na forma curta |
| `(reading 'categoria')` | `function` no `filter` dentro do método | trocar por arrow |
| `does not provide an export named` | chaves no import de um `default` | import do default sem chaves |
| `ERR_MODULE_NOT_FOUND`, `ERR_UNSUPPORTED_DIR_IMPORT` | faltou o `.js` ou o `index.js` no caminho | caminho completo: `'../regras/index.js'` |
| `Cannot access ... before initialization` | arquivo de `regras/` importando o próprio barril | importar direto do arquivo |

---

## Resumo

:::summary
- `this` é o objeto antes do ponto na hora da chamada; método solto perde o `this`
- Ao passar um método como callback, use uma arrow que chama com ponto, ou `bind`
- A arrow usa o `this` de onde foi escrita: serve nos callbacks dentro de métodos, não como método
- Módulos exportam por nome ou por `default`, reexportam com `export ... from` e se juntam num barril `index.js`
- As pastas importam para baixo, e cada módulo roda uma vez
:::

---

## :icon[arrow-right] Próximos passos

Na próxima aula, ainda no E11, a pergunta que ficou no ar: por que um arquivo que altera `produtos` muda o catálogo de todo mundo?

- :icon[link] valor e referência: o que a atribuição copia de verdade
- :icon[copy] cópias rasas e profundas, com `structuredClone`
- :icon[snowflake] `Object.freeze` para provar nos testes que uma regra não mexe na entrada

No E15, os métodos ganham uma casa própria, as classes, e o `this` segue a mesma regra do ponto.
