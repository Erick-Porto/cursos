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

Na hora, a frase sai certa. Um segundo depois, a mesma função imprime `undefined`. A diferença está numa palavra que muda de valor conforme o jeito de chamar: `this`.

:::question
Se o método é o mesmo, por que o `setTimeout` muda o resultado?
:::

---

## :icon[braces] Métodos: funções dentro do objeto

No E08, você guardou funções como valores de um objeto, nos `comparadores`. Uma função que mora num objeto e trabalha com os dados dele é um **método**. A forma curta dispensa a palavra `function`:

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

- `descrever() { ... }` é o mesmo que `descrever: function () { ... }`
- Dentro do método, **`this`** é o objeto que fez a chamada: aqui, `promocao`
- Com `this`, o método lê os dados do próprio objeto sem repetir o nome dele

---

## :icon[circle-dot] this: quem está antes do ponto

O `this` não é decidido onde o método foi escrito, e sim **na hora da chamada**: vale o objeto que aparece antes do ponto.

```javascript
const semanaDaCasa = { nome: 'Semana da Casa', percentual: 15 };
semanaDaCasa.descrever = promocao.descrever; // a mesma função

promocao.descrever();     // 'Semana do Áudio: 10% de desconto'
semanaDaCasa.descrever(); // 'Semana da Casa: 15% de desconto'

const descrever = promocao.descrever; // copia só a função
descrever(); // nada antes do ponto: this é undefined
// TypeError: Cannot read properties of undefined (reading 'nome')
```

Os arquivos com `import` e `export` rodam em **modo estrito**: uma função chamada sem ponto recebe `this` igual a `undefined`, e ler `this.nome` lança o erro.

---

## :icon[timer] O método vira callback

:::center
![Diagrama: na chamada direta, promocao.anunciar() tem promocao antes do ponto, o this é a promoção e sai Semana do Áudio: 10%; no setTimeout, um segundo depois, a função é chamada sozinha, sem nada antes do ponto, o this não é a promoção e sai undefined: undefined%](images/e11-this-callback.svg)
:::

`setTimeout(promocao.anunciar, 1000)` entrega **só a função**, solta do objeto. Um segundo depois, o temporizador a chama sem `promocao.` na frente.

- Quem chama o callback decide o `this`. No Node, o `setTimeout` usa o próprio temporizador, que não tem `nome`: sai `undefined`
- `forEach`, `map` e `filter` chamam sem nada: o `this` é `undefined`, e o método quebra com `TypeError`

---

## :icon[wrench] Consertando: arrow ou bind

```javascript
// 1. arrow: um segundo depois, a chamada acontece com ponto
setTimeout(() => promocao.anunciar(), 1000);

// 2. bind: uma cópia da função com o this preso
const anunciarFixo = promocao.anunciar.bind(promocao);
setTimeout(anunciarFixo, 1000);
```

| Conserto | Quando usar |
|---|---|
| arrow que chama com ponto | o padrão: fica claro quem chama e com o quê |
| `bind` | código antigo e bibliotecas que pedem uma função pronta |

Cuidado com `setTimeout(promocao.anunciar(), 1000)`: com parênteses, o aviso sai **na hora**, e o `setTimeout` recebe `undefined` no lugar de uma função. O Node reclama: `The "callback" argument must be of type function`.

---

## :icon[arrow-right] Arrow não tem this próprio

A arrow não recebe `this` na chamada: usa o `this` do lugar onde foi escrita. Por isso, dentro de um método, os callbacks de `filter`, `map` e `forEach` devem ser arrows:

```javascript
participantes(lista) { // com function, quebra
  return lista.filter(function (produto) {
    return produto.categoria === this.categoria; // this é undefined
  });
},
```

```javascript
participantes(lista) { // com arrow, o this é o do método: a promoção
  return lista.filter((produto) => produto.categoria === this.categoria);
},
```

O contrário não vale: escrito como arrow, o **método** não recebe o objeto como `this`. `anunciar: () => console.log(this.nome)` lança `TypeError`. Para métodos, use a forma curta, `anunciar() { ... }`.

---

## Pense

:::question
`promocao` tem o `anunciar()` do começo da aula. Em cada linha, o aviso sai certo, sai com `undefined` ou quebra?

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

## :icon[package] Um arquivo, um módulo

Desde o E02, cada arquivo do `lojinha-regras` é um **módulo**: tem as próprias variáveis, e o que ele não exporta ninguém de fora vê. O `formatar.js` poderia guardar as opções da moeda assim:

```javascript
// src/utils/formatar.js
const moeda = { style: 'currency', currency: 'BRL' }; // sem export: privado

export function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', moeda);
}
```

- **Escopo próprio**: duas constantes `moeda` em arquivos diferentes não se misturam
- **Exportar é escolher** o que os outros arquivos podem usar, como a closure do E10 esconde o `total`
- **Modo estrito**: todo módulo roda nele; por isso a chamada sem ponto deu `undefined`
- No Node, o `import` de um arquivo seu leva a extensão: `'./precos.js'`

---

## :icon[file-code] Export nomeado e export default

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

Convenção do `lojinha-regras`: regras, utilitários e dados com exports nomeados. O `default` fica para arquivos de uma coisa só, como a promoção da semana e, a partir do E15, cada classe.

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

:::warning O Jest perdoa, o Node não
O Jest passa os arquivos pelo Babel, que aceita caminho sem extensão e entrega `undefined` no lugar de um nome que falta: o erro só aparece na chamada, como `is not a function`. Teste verde não garante script funcionando: rode também os scripts com `node`.
:::

---

## :icon[corner-down-right] Reexportar: export ... from

Um arquivo pode **reexportar** o que outro exporta, sem usar ele mesmo:

```javascript
export { paraCentavos, paraReais } from './precos.js'; // só estes dois
export * from './carrinho.js';                         // todos os nomeados
export { default as promocao } from './promocao.js';   // o default vira nomeado
```

- Nada é copiado: quem importa daqui recebe as mesmas funções do arquivo original
- `export *` não leva o `default`; para ele, use `export { default as nome }`
- Se dois arquivos exportam o mesmo nome, o `export *` não escolhe nenhum: importar esse nome quebra com `contains conflicting star exports`

---

## :icon[boxes] O barril: um index.js por pasta

Um **barril** é um `index.js` que reexporta os módulos da pasta. Quem está fora importa de um lugar só:

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

- No Node, escreva o `index.js`: importar só a pasta (`'../regras'`) dá `ERR_UNSUPPORTED_DIR_IMPORT`
- Dentro de `regras/`, importe direto do arquivo (`'./precos.js'`), nunca do próprio barril: o ciclo pode quebrar com `ReferenceError: Cannot access ... before initialization`
- Barril vale para pastas com vários arquivos usados juntos

---

## :icon[folder-tree] Organização por pasta

| Pasta | O que mora lá | Pode importar |
|---|---|---|
| `scripts/` | o que roda no terminal | todas as pastas abaixo |
| `regras/` | funções puras: preços, carrinho, frete | `utils/` e `data/` |
| `utils/` | `formatar`, `funcoes`, `validar`, `datas` | nada do projeto |
| `data/` | catálogo e promoção da semana | nada do projeto |

As importações descem a tabela: uma regra nunca importa um script, e um utilitário não conhece as regras.

A estrutura cresce sem mudar a direção: `modelos/` chega no E15, `servicos/` e `api/` no E18 e no E19. No E30, a pasta `src/` inteira vai para o app.

---

## :icon[database-zap] O módulo roda uma vez

O código solto de um módulo roda **uma vez**, na primeira importação. Quem importa depois recebe o que já foi criado:

```javascript
// src/regras/frete.js (E10)
export const calcularFreteComCache = memoize(calcularFrete); // roda uma vez
```

- Todos os arquivos que importam `calcularFreteComCache` dividem **o mesmo cache**
- Todo arquivo que importa `produtos` recebe **o mesmo array**, não uma cópia
- Se um arquivo alterar esse array, todos os outros enxergam a mudança. A próxima aula mostra por quê, e como evitar

---

## :icon[triangle-alert] Erros comuns

:::warning
- `setTimeout(promocao.anunciar, 1000)` ou `lista.forEach(promocao.anunciar)`: o método perde o `this`; use uma arrow que chama com ponto
- `function` dentro de um método, no `filter` ou no `map`: o `this` some; use arrow
- Escrever o próprio método como arrow (`anunciar: () => ...`): ele não recebe o objeto como `this`
- Chaves para importar um `export default`, ou nenhuma para um nomeado: o Node para com `does not provide an export named`
- Importar a pasta sem `index.js` ou o arquivo sem `.js`: os testes passam e o `node` falha
- Um arquivo de `regras/` importando o próprio barril
:::

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
