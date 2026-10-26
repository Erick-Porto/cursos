---
title: Listas, keys e estilos
summary: Renderize um array de tarefas com map e key, mostre conteúdo condicional e estilize com CSS Modules.
module: react
duration_minutes: 40
objectives:
  - Renderizar uma lista com map e key
  - Mostrar conteúdo condicionalmente
  - Estilizar componentes com CSS Modules
---

# Listas, keys e estilos

Programador Mobile: Módulo Básico · Encontro E03 · Aula 6 de 18

---

## O que você vai aprender

:::goal
- Guardar as tarefas em um **array** e percorrê-lo com `.map()`
- Dar uma `key` a cada item da lista e entender por que o React pede
- Mostrar ou esconder trechos da tela com `&&` e com o ternário
- Estilizar o `CartaoTarefa` com CSS Modules
:::

---

## Uma tag por tarefa não escala

No `minhas-tarefas`, cada tarefa hoje é uma tag escrita à mão:

```jsx
<CartaoTarefa titulo="Estudar React" prioridade="alta" />
<CartaoTarefa titulo="Fazer compras" prioridade="baixa" />
<CartaoTarefa titulo="Ir à academia" prioridade="media" />
```

Em um app de verdade, as tarefas vêm de um formulário ou de um servidor. Você não sabe de antemão quantas serão nem o que dizem.

:::question
Como desenhar um cartão para cada tarefa sem saber quantas existem?
:::

---

## :icon[list] Arrays: várias coisas em uma só variável

Um **array** é uma lista ordenada de valores. Cada posição tem um índice, que começa em 0.

```javascript
const tarefas = [
  { id: 1, titulo: 'Estudar React', prioridade: 'alta', concluida: false },
  { id: 2, titulo: 'Fazer compras', prioridade: 'baixa', concluida: true },
  { id: 3, titulo: 'Ir à academia', prioridade: 'media', concluida: false },
]

tarefas.length       // 3
tarefas[0].titulo    // 'Estudar React'
tarefas[2].id        // 3
```

Cada item é um objeto com a mesma forma: `id`, `titulo`, `prioridade` e `concluida`. Essa forma vai acompanhar o projeto até o fim do curso.

---

## :icon[refresh-cw] map: transformar cada item em outra coisa

`.map()` percorre o array, aplica uma função a cada item e devolve um **novo array** com os resultados. O original não muda.

```javascript
const numeros = [1, 2, 3]
const dobros = numeros.map((n) => n * 2)
// dobros: [2, 4, 6]

const titulos = tarefas.map((t) => t.titulo)
// titulos: ['Estudar React', 'Fazer compras', 'Ir à academia']
```

| Entra | `(n) => n * 2` | Sai |
|---|---|---|
| 1 | 1 * 2 | 2 |
| 2 | 2 * 2 | 4 |
| 3 | 3 * 2 | 6 |

`(n) => n * 2` é uma **arrow function**: recebe `n` e devolve `n * 2`. É a forma curta de escrever uma função.

---

## map gerando JSX

Se a função devolve JSX, o resultado é um array de elementos. O React sabe exibir um array: desenha um atrás do outro.

```jsx
function ListaTarefas({ tarefas }) {
  return (
    <section>
      {tarefas.map((t) => (
        <CartaoTarefa
          titulo={t.titulo}
          prioridade={t.prioridade}
          concluida={t.concluida}
        />
      ))}
    </section>
  )
}
```

---

## Três tarefas, três cartões

:::center
![Animação: o .map() percorre o array tarefas e, a cada volta, devolve um CartaoTarefa com o titulo e a prioridade do item; três itens viram três cartões](images/e03-map-cartoes.svg)
:::

A cada volta, o `.map()` recebe uma tarefa `t` e devolve um `<CartaoTarefa />` com os dados dela. Três tarefas no array, três cartões na tela. Trinta tarefas, trinta cartões, com o mesmo código.

Só falta um detalhe: o console mostra um aviso sobre `key`.

---

## :icon[key-round] key: a etiqueta de cada item

Em toda lista, o React pede uma prop **key** única em cada item. É assim que ele reconhece quem é quem quando a lista muda: item removido, inserido ou reordenado.

```jsx
{tarefas.map((t) => (
  <CartaoTarefa
    key={t.id}
    titulo={t.titulo}
    prioridade={t.prioridade}
    concluida={t.concluida}
  />
))}
```

Sem `key`, o console avisa: `Each child in a list should have a unique "key" prop`.

:::info
A `key` é só para o React. Ela **não** chega dentro do componente: `props.key` é `undefined`.
:::

---

## Por que o id, e não o índice

`.map()` também entrega a posição: `tarefas.map((t, i) => ...)`. Usar `key={i}` parece fácil, mas o índice identifica a **posição**, não a tarefa.

:::center
![Diagrama: ao remover a primeira tarefa, com key igual ao id as outras mantêm a key (2 e 3); com key igual ao índice todas mudam de key (1 vira 0, 2 vira 1)](images/e03-key-id-indice.svg)
:::

Ao reordenar a lista ou inserir no início, o problema se repete: com `key={i}`, os cartões trocam de conteúdo e o React redesenha todos; com `key={t.id}`, cada cartão acompanha sua tarefa.

:::tip
Regra prática: `key` é o `id` do dado. Índice só quando a lista nunca muda de ordem nem perde itens.
:::

---

## :icon[eye] Mostrar algo só às vezes: &&

Lista vazia não deve ficar em branco. Com `&&`, o JSX da direita só aparece quando a condição da esquerda é verdadeira:

```jsx
function ListaTarefas({ tarefas }) {
  return (
    <section>
      {tarefas.length === 0 && <p>Nenhuma tarefa por aqui</p>}
      {tarefas.map((t) => (
        <CartaoTarefa key={t.id} titulo={t.titulo} />
      ))}
    </section>
  )
}
```

Leia como: "se a lista está vazia, **então** mostre o aviso". Quando a condição é `false`, o React não desenha nada.

Com o array vazio, o `.map()` não gera cartão nenhum e só o aviso aparece.

---

## Escolher entre dois: o ternário

Quando há duas opções, use o **operador ternário**: `condicao ? seVerdadeiro : seFalso`.

```jsx
function CartaoTarefa({ titulo, prioridade, concluida }) {
  return (
    <div>
      <h3>{titulo}</h3>
      <p>Prioridade: {prioridade}</p>
      <p>{concluida ? 'Concluída' : 'Pendente'}</p>
    </div>
  )
}
```

| `concluida` | Texto na tela |
|---|---|
| `true` | Concluída |
| `false` | Pendente |

`&&` serve para "mostrar ou nada"; o ternário, para "isto ou aquilo".

---

## :icon[lightbulb] Pense

:::question
O cartão de uma tarefa precisa de borda, espaçamento e uma cor de destaque quando a prioridade é alta.

- Onde fica esse estilo: no `index.css` do projeto inteiro ou junto do componente?
- Se outro componente também criar uma classe `.cartao`, o que acontece?
- E se o destaque de prioridade alta precisar de `:hover`?
:::

---

## Três formas de estilizar

| Forma | Como | Vantagem | Limite |
|---|---|---|---|
| CSS global | `index.css` importado no `main.jsx`; `className="cartao"` | simples, vale para o app todo | nomes de classe podem colidir |
| CSS Modules | `CartaoTarefa.module.css`; `className={estilos.cartao}` | classe exclusiva do componente | precisa do `.module` no nome |
| Inline | `style={{ color: 'red' }}` | rápido para um ajuste pontual | sem `:hover` nem media queries |

Neste curso, o estilo de cada componente fica em **CSS Modules**. O `index.css` cuida só de fonte e cor de fundo.

:::warning
Estilo inline é um objeto JavaScript (por isso as chaves duplas). Não aceita `:hover`, `@media` nem seletores; use só para um ajuste pequeno.
:::

---

## :icon[file-code] CSS Modules na prática: o arquivo

Crie `src/components/CartaoTarefa.module.css`. O nome termina em `.module.css`: é isso que avisa o Vite para tratar as classes como exclusivas do componente.

```css
.cartao {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
}

.alta {
  border-left: 4px solid #d33;
}

.concluida {
  opacity: 0.6;
  text-decoration: line-through;
}
```

---

## CSS Modules na prática: o componente

Importe o arquivo como um objeto e use as classes como propriedades:

```jsx
import estilos from './CartaoTarefa.module.css'

export default function CartaoTarefa({ titulo, prioridade, concluida }) {
  return (
    <div className={estilos.cartao}>
      <h3>{titulo}</h3>
      <p>Prioridade: {prioridade}</p>
      <p>{concluida ? 'Concluída' : 'Pendente'}</p>
    </div>
  )
}
```

`estilos.cartao` vale algo como `"_cartao_x7f2a"`: um nome gerado, único. Por isso dois componentes podem ter `.cartao` sem conflito. Abra o DevTools e veja o nome real no HTML.

---

## :icon[zap] Classes dinâmicas

Para juntar duas classes, monte a string com um **template literal**: crases e `${ }` para encaixar valores.

```jsx
<div className={`${estilos.cartao} ${concluida ? estilos.concluida : ''}`}>
```

Com mais de uma condição, variáveis deixam a tag legível:

```jsx
const classeAlta = prioridade === 'alta' ? estilos.alta : ''
const classeConcluida = concluida ? estilos.concluida : ''

<div className={`${estilos.cartao} ${classeAlta} ${classeConcluida}`}>
```

| Tarefa | `className` resultante |
|---|---|
| alta, pendente | `cartao alta` |
| media, concluída | `cartao concluida` |

Quando a condição é falsa, entra uma string vazia e nada é aplicado.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Esquecer a `key`: a lista aparece, mas o console avisa e a tela pode bagunçar quando a lista mudar
- `key={i}` com o índice: funciona até alguém remover ou reordenar um item
- Escrever `class` em vez de `className`: em JSX, `class` é palavra reservada do JavaScript
- Nomear o arquivo `CartaoTarefa.css` e importar como objeto: sem `.module`, `estilos.cartao` é `undefined` e nada estiliza
- `{tarefas.length && <p>...</p>}`: com a lista vazia aparece um `0` na tela; compare com `=== 0`
:::

---

## :icon[list-checks] Resumo

:::summary
- Um array guarda as tarefas; `.map()` transforma cada uma em um `CartaoTarefa`
- Todo item da lista leva `key={t.id}`: a key identifica o dado, não a posição
- `condicao && <JSX />` mostra ou esconde; `condicao ? a : b` escolhe entre dois
- CSS Modules (`Nome.module.css` e `import estilos from ...`) dá classes exclusivas ao componente
- Classes dinâmicas: template literal juntando `estilos.cartao` com a classe condicional
:::

---

## :icon[flask-conical] No laboratório

Monte a lista do `minhas-tarefas`:

:::steps
1. Crie `src/components/CartaoTarefa.jsx` com as props `titulo`, `prioridade` e `concluida`, e `CartaoTarefa.module.css` com as classes `cartao`, `alta` e `concluida`
2. Crie `src/components/ListaTarefas.jsx`: recebe a prop `tarefas` e gera um `CartaoTarefa` por item, com `key={t.id}`
3. No `App.jsx`, declare um array com 5 tarefas e passe `<ListaTarefas tarefas={tarefas} />`
4. Destaque a prioridade alta e mostre "Nenhuma tarefa por aqui" quando a lista estiver vazia
5. `git add .`, `git commit -m "Lista de tarefas com CSS Modules"` e `git push`
:::

**Critérios:** lista renderizada a partir do array; sem avisos de `key` no console; prioridade alta visualmente diferente; estado vazio funcionando ao trocar o array por `[]`.
