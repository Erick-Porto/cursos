---
title: this, hooks próprios e módulos
summary: O this que some no onPress, o hook useDebounce como closure e o código organizado em módulos e barris.
module: linguagem-js
duration_minutes: 40
objectives:
  - Explicar como o this é definido e corrigir um método passado direto ao onPress
  - Criar o hook useDebounce e explicar por que ele funciona como closure
  - Testar debounce e memoize com função espiã e relógio falso
  - Organizar o app em módulos com export nomeado, default e barris
---

# this, hooks próprios e módulos

Programador Mobile: Módulo Específico · Encontro E35 · Aula 52 de 71

---

## O que você vai aprender

:::goal
- Descobrir quem é o `this` em métodos, arrows e callbacks
- Consertar o bug de passar `pedido.cancelar` direto ao `onPress`
- Criar o hook `useDebounce` e ligá-lo à busca da Início
- Testar `debounce` e `memoize` com `jest.fn()` e relógio falso
- Organizar o código em módulos, com exports nomeados, default e barris
:::

---

## O botão que derruba o app

Em "Meus pedidos", você acrescenta o botão **Cancelar pedido** nos pedidos pendentes e usa um método novo da classe `Pedido`. No Jest, o teste de `pedido.cancelar()` passa. No celular, o toque derruba o app com a tela vermelha de um `TypeError`, apontando para a linha de `cancelar` em `Pedido.js`.

O mesmo método, duas chamadas, dois resultados. A diferença está numa palavra que muda de valor conforme o jeito de chamar: `this`.

:::question
Se o teste passa, por que o mesmo método quebra quando vai para o botão?
:::

---

## :icon[circle-dot] this: quem está antes do ponto

Dentro de um método, `this` é o objeto que aparece **antes do ponto no momento da chamada**. Não importa onde o método foi escrito: importa como ele foi chamado.

```javascript
// src/modelos/Pedido.js: método novo, ao lado de comStatus (E30)
cancelar() {
  return this.comStatus('cancelado');
}
```

```javascript
pedido.cancelar(); // this é pedido: devolve um Pedido cancelado

const cancelar = pedido.cancelar; // copia só a função
cancelar(); // sem ponto: this é undefined
// TypeError: não dá para ler comStatus de undefined
```

O código de uma classe roda em modo estrito: chamado sem ponto, o método recebe `this` igual a `undefined`, e não o pedido.

---

## :icon[bug] O bug do onPress={pedido.cancelar}

```jsx
// pedido: instância de Pedido (E30), montada a partir do estado da tela
<Botao titulo="Cancelar pedido" onPress={pedido.cancelar} />
```

`pedido.cancelar`, sem parênteses, entrega **só a função**, solta do objeto. No toque, o `Pressable` chama `onPress(evento)`, sem ponto e sem `pedido`: o `this` é `undefined`, e `this.comStatus` derruba o app. O teste passou porque chamava `pedido.cancelar()`, com ponto.

:::center
![Diagrama: no teste, pedido.cancelar() tem pedido antes do ponto, o this é pedido e sai um Pedido cancelado; no toque, o Pressable chama onPress(evento) sem nada antes do ponto, o this é undefined e sai um TypeError](images/e35-this-onpress.svg)
:::

E há um segundo problema: `cancelar` não muda o pedido. Como todo método que "muda" uma classe da Lojinha, ele devolve um `Pedido` novo, e alguém precisa guardar esse retorno no estado.

---

## :icon[wrench] Consertando: arrow ou bind

```jsx
// 1. arrow: no toque, a chamada acontece com ponto
<Botao
  titulo="Cancelar pedido"
  onPress={() => atualizarPedido(pedido.cancelar())}
/>
```

```javascript
// 2. bind: uma cópia da função com o this preso
const cancelarFixo = pedido.cancelar.bind(pedido);
cancelarFixo(); // this é pedido, mesmo sem ponto
```

| Conserto | Quando usar |
|---|---|
| arrow no `onPress` | no app: conserta o `this` e deixa você guardar o retorno |
| `bind` | código antigo, componentes de classe e bibliotecas que pedem uma função pronta |

`atualizarPedido` é a função da sua tela que guarda o pedido novo no estado. Com `bind`, o `this` fica certo, mas o retorno se perde.

---

## :icon[arrow-right] Arrow não tem this próprio

A arrow não recebe `this` na chamada: usa o `this` do lugar onde foi escrita. Dentro de um método, os callbacks de `map`, `filter` e `reduce` devem ser arrows. Com um fone de R$ 150 e um livro de R$ 50:

```javascript
// quanto cada item pesa no subtotal: com function, quebra
participacao() {
  return this.itens.map(function (item) {
    return (item.preco * item.qtd) / this.subtotal; // this é undefined
  });
}
```

```javascript
// com arrow, o this é o do método: o pedido
participacao() {
  return this.itens.map((item) => (item.preco * item.qtd) / this.subtotal);
} // [0.75, 0.25]
```

O `map` chama a `function` sem ponto. Nos componentes de função você não usa `this`: ele aparece nas classes de `src/modelos/`.

---

## Pense

:::question
Para cada botão: quando `cancelar` roda e o que acontece?

```jsx
<Botao titulo="A" onPress={pedido.cancelar} />
<Botao titulo="B" onPress={() => atualizarPedido(pedido.cancelar())} />
<Botao titulo="C" onPress={pedido.cancelar()} />
<Botao titulo="D" onPress={pedido.cancelar.bind(pedido)} />
```
:::

:::tip Resposta
- **A** roda no toque, sem ponto: `this` é `undefined` e o app quebra
- **B** roda no toque, com ponto, e guarda o pedido novo: é a forma certa
- **C** roda durante a renderização; o `onPress` recebe um `Pedido`, não uma função, e o toque falha
- **D** roda no toque com o `this` certo, mas o pedido devolvido se perde e a tela não muda
:::

---

## :icon[timer] O hook useDebounce

Um **hook próprio** é uma função que começa com `use` e chama outros hooks. Em `src/hooks/useDebounce.js`:

```javascript
import { useEffect, useState } from 'react';

export function useDebounce(valor, espera = 300) {
  const [atrasado, setAtrasado] = useState(valor);

  useEffect(() => {
    const temporizador = setTimeout(() => setAtrasado(valor), espera);
    return () => clearTimeout(temporizador);
  }, [valor, espera]);

  return atrasado;
}
```

- Recebe um valor que muda a cada letra e devolve uma cópia que só muda depois de `espera` ms de pausa
- A limpeza do efeito cancela o agendamento anterior antes de o próximo começar

Por que não a função `debounce` da aula 51? Criada dentro da tela, ela nasceria de novo a cada renderização, com o temporizador vazio.

---

## :icon[history] Cada renderização, uma closure

A cada letra, o `termo` muda, a tela renderiza e o efeito roda de novo. Antes, o React chama a limpeza da renderização anterior, e ela lembra o **seu** `temporizador`:

| `termo` | Primeiro, a limpeza | Depois, o efeito |
|---|---|---|
| "f" | da renderização inicial | agenda "f" para 300 ms |
| "fo" | cancela "f" | agenda "fo" |
| "fon" | cancela "fo" | agenda "fon" |
| "fone" | cancela "fon" | agenda "fone" |
| pausa de 300 ms | nada | `atrasado` vira "fone" |

Cada renderização cria as suas funções, e cada uma lembra as variáveis daquela renderização: é a closure da aula 51, agora dentro do React.

---

## :icon[search] A busca da Início com useDebounce

```jsx
import { useDebounce } from '../hooks/useDebounce';

// dentro de Inicio: termo, Campo de busca e buscarProdutos vêm do E27
const [termo, setTermo] = useState('');
const termoAtrasado = useDebounce(termo, 300);
const vitrine = buscarProdutos(aplicarFiltros(produtos, filtros), termoAtrasado);
const esperando = termo !== termoAtrasado;
```

- O campo continua ligado a `termo`: cada letra aparece na hora
- A lista usa `termoAtrasado`: só muda depois da pausa
- `esperando` mostra "Buscando..." enquanto os dois valores são diferentes

Com 12 produtos, filtrar é instantâneo. No E38, `termoAtrasado` dispara a busca na API, e as 14 viagens de "fone bluetooth" viram uma ou duas.

---

## :icon[test-tube] Testando com função espiã e relógio falso

Em `src/utils/funcoes.test.js`, o Jest controla o tempo:

```javascript
import { debounce } from './funcoes';

jest.useFakeTimers(); // relógio falso: o tempo só anda quando você manda

test('debounce busca uma vez, com o último termo', () => {
  const buscar = jest.fn(); // função espiã: anota cada chamada
  const buscarComAtraso = debounce(buscar, 300);
  buscarComAtraso('f');
  buscarComAtraso('fo');
  buscarComAtraso('fone');
  jest.advanceTimersByTime(300); // 300 ms em um instante
  expect(buscar).toHaveBeenCalledTimes(1);
  expect(buscar).toHaveBeenCalledWith('fone');
});
```

- `jest.fn()` cria uma função que guarda quantas vezes e com o quê foi chamada
- No `memoize`, a espiã prova que a função original rodou uma vez só para os mesmos argumentos

---

## :icon[package] Módulos: export nomeado e default

Cada arquivo é um **módulo**: o que ele não exporta, ninguém de fora vê.

```javascript
// src/utils/funcoes.js: exports nomeados, quantos quiser
export function memoize(fn) { /* ... */ }
export function debounce(fn, espera = 300) { /* ... */ }

// src/components/ui/Botao.js: no máximo um export default por arquivo
export default function Botao({ titulo, onPress }) { /* ... */ }
```

```javascript
import { memoize, debounce } from '../utils/funcoes'; // nomes exatos, entre chaves
import Botao from '../components/ui/Botao'; // sem chaves, qualquer nome
import { debounce as atrasar } from '../utils/funcoes'; // renomeia com as
```

Convenção da Lojinha: telas, componentes e classes de `src/modelos/` com `export default`; regras, utilitários, hooks e contextos com exports nomeados.

---

## :icon[boxes] Barris: um index.js que reexporta

Um **barril** é um `index.js` que reexporta os módulos da pasta. O kit de UI já tem o seu:

```javascript
// src/components/ui/index.js
export { default as Botao } from './Botao';
export { default as Cartao } from './Cartao';
export { default as EstadoErro } from './EstadoErro';
```

```javascript
import { Botao, Cartao, EstadoErro } from '../components/ui'; // uma linha só
```

- `export { default as Botao }` transforma o default de `Botao.js` em export nomeado do barril
- Importar uma pasta procura o `index.js` dela
- Vale para pastas com muitos arquivos usados juntos; numa pasta com um arquivo só, o barril é um passo a mais
- Um arquivo de dentro da pasta não importa o próprio barril: o ciclo pode entregar `undefined`

---

## :icon[folder-tree] Organização por pasta

| Pasta | O que mora lá | Pode importar |
|---|---|---|
| `telas/` | as telas | todas as pastas abaixo |
| `components/` e `hooks/` | peças visuais e hooks próprios | `contexts/`, `regras/`, `utils/` |
| `contexts/` | estado compartilhado | `regras/`, `utils/` |
| `regras/` e `modelos/` | funções puras e classes, sem React | `utils/` |
| `utils/` | `formatar`, `validar`, `funcoes` | nada do app |

As importações descem a tabela: uma regra nunca importa uma tela.

**O módulo roda uma vez**, na primeira importação. O `calcularFreteComCache` criado em `src/regras/frete.js` é o mesmo para o Carrinho e o Checkout, com um cache só. Criado dentro de uma tela, ele nasceria vazio a cada renderização.

---

## :icon[triangle-alert] Erros comuns

:::warning
- `onPress={pedido.cancelar}`: o método perde o `this`; use uma arrow que chama com ponto
- `function` dentro de um método, no `map` ou no `filter`: o `this` some; use arrow
- `import { Botao } from './Botao'` quando o `Botao` é `export default`: chega `undefined` e a tela vermelha diz `Element type is invalid`
- Passar à lista o `termo` em vez do `termoAtrasado`: o hook existe, mas a busca continua a cada letra
- Esquecer o `return () => clearTimeout(temporizador)`: todas as letras disparam, só que atrasadas
:::

---

## Resumo

:::summary
- `this` é o objeto antes do ponto na hora da chamada; método solto perde o `this`
- No `onPress`, use uma arrow que chama o método com ponto e guarda o retorno; `bind` prende o `this`
- A arrow usa o `this` de onde foi escrita, por isso serve nos callbacks dentro de métodos
- `useDebounce` é um hook próprio: cada renderização cria uma closure, e a limpeza cancela o agendamento anterior
- Módulos exportam por nome ou por default; barris reexportam; cada módulo roda uma vez
:::

---

## :icon[flask-conical] No laboratório

A busca espera a pausa, o frete lembra o que já calculou e o `this` ganha testes.

:::steps
1. `src/utils/funcoes.js` com `memoize` e `debounce`, exportados por nome
2. `src/utils/funcoes.test.js`: `memoize` com `jest.fn()` e `debounce` com relógio falso
3. Em `src/regras/frete.js`, exporte `calcularFreteComCache`; o Carrinho e o `freteDoCep` passam a usá-lo
4. `src/hooks/useDebounce.js` com 300 ms; a Início filtra por `termoAtrasado` e mostra "Buscando..."
5. Método `cancelar()` na `Pedido`, com testes: com ponto, sem ponto e com `bind`
6. `npm test` verde, commit "E35: closures, debounce e memoize" e `git push`
:::

**Critérios de entrega**: digitar "fone" depressa filtra uma vez, 300 ms depois da última letra; `memoize` e `debounce` fora de componentes; testes novos e antigos passando. Entregue o link do repositório no sistema.
