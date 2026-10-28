---
title: Listas, keys e estilos
summary: Renderize um array de tarefas com map e key, mostre conteúdo condicional e estilize com CSS Modules.
module: react
duration_minutes: 40
objectives:
  - Renderizar uma lista com map e key
  - Preparar os dados e mostrar conteúdo condicionalmente
  - Estilizar componentes com CSS Modules
---

# Listas, keys e estilos

Programador Mobile · Encontro E22 · Aula 44 de 89

---

## O que você vai aprender

:::goal
- Gerar um cartão por tarefa com o `map` do E09a
- Dar uma `key` a cada item da lista e entender por que o React pede
- Filtrar e ordenar antes de desenhar, sem mexer na prop
- Mostrar ou esconder trechos da tela com `&&`, ternário e return antecipado
- Estilizar o `CartaoTarefa` com CSS Modules
:::

---

## Uma tag por tarefa não escala

No `minhas-tarefas`, cada tarefa hoje é uma tag escrita à mão:

```jsx
<CartaoTarefa titulo="Estudar React" prioridade="alta" />
<CartaoTarefa titulo="Fazer compras" prioridade="baixa" />
```

Num app de verdade, as tarefas chegam de um formulário (E23) ou de um servidor (E24): você não sabe quantas serão. Por isso elas viram **dados**, um array de objetos como o catálogo da Lojinha no E08b:

```javascript
const tarefas = [
  { id: 1, titulo: 'Estudar React', prioridade: 'alta', concluida: false },
  { id: 2, titulo: 'Fazer compras', prioridade: 'baixa', concluida: true },
  { id: 3, titulo: 'Ir à academia', prioridade: 'media', concluida: false },
]
```

Essa forma acompanha o app até o React Native, no E29.

:::question
Qual método do E09a transforma cada item de um array em outra coisa, sem mudar o tamanho?
:::

---

## :icon[arrow-right] map gerando JSX

No E09a, o `map` devolvia um texto por item. Se a função devolve JSX, o resultado é um array de elementos, e o React sabe desenhar um array: um atrás do outro.

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

Os parênteses em `(t) => ( ... )` só agrupam o JSX de várias linhas: é a arrow com retorno implícito do E07b.

---

## Três tarefas, três cartões

:::center
![Animação: o .map() percorre o array tarefas e, a cada volta, devolve um CartaoTarefa com o titulo e a prioridade do item; três itens viram três cartões](images/e22-map-cartoes.svg)
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

- A `key` vai na tag que o `map` devolve, aqui o `<CartaoTarefa>`; colocada na `<div>` de dentro do componente, o aviso continua
- Ela é só para o React e **não** chega ao componente: `props.key` é `undefined`

---

## Por que o id, e não o índice

O `map` também entrega a posição: `tarefas.map((t, i) => ...)`. Usar `key={i}` parece fácil, mas o índice identifica a **posição**, não a tarefa.

:::center
![Diagrama: ao remover a primeira tarefa, com key igual ao id as outras mantêm a key (2 e 3); com key igual ao índice todas mudam de key (1 vira 0, 2 vira 1)](images/e22-key-id-indice.svg)
:::

Com `key={i}`, ao remover, inserir no início ou reordenar, os cartões trocam de conteúdo e o React redesenha todos; com `key={t.id}`, cada cartão acompanha sua tarefa. `key={Math.random()}` é pior: muda a cada desenho.

:::tip
Regra prática: `key` é o `id` do dado. Índice só quando a lista nunca muda de ordem nem perde itens.
:::

---

## :icon[funnel] Filtrar e ordenar antes de desenhar

A tela mostra os dados do jeito que você os preparar. Antes do `return`, use o `filter` do E09a e o spread do E09b:

```jsx
function ListaTarefas({ tarefas }) {
  const pendentes = tarefas.filter((t) => !t.concluida)
  const concluidas = tarefas.filter((t) => t.concluida)
  const ordenadas = [...pendentes, ...concluidas]

  return (
    <section>
      <p>Pendentes: {pendentes.length}</p>
      {ordenadas.map((t) => (
        <CartaoTarefa key={t.id} titulo={t.titulo} concluida={t.concluida} />
      ))}
    </section>
  )
}
```

O contador de pendentes, que no E21 podia mentir, aqui não mente: ele é calculado dos mesmos dados a cada desenho.

:::warning
`tarefas.sort(...)` aqui dentro muda o array do pai, e props são somente leitura. Como no E08a, copie antes: `[...tarefas].sort(...)`.
:::

---

## Pratique

:::example Desafio
No `ListaTarefas`, mostre só as tarefas de prioridade alta e, acima delas, o texto "Urgentes: 2" com o número certo. Use `filter` e `map`, sem alterar `tarefas`.
:::

:::info Resposta
```jsx
const urgentes = tarefas.filter((t) => t.prioridade === 'alta')

// no JSX
<p>Urgentes: {urgentes.length}</p>
{urgentes.map((t) => (
  <CartaoTarefa key={t.id} titulo={t.titulo} prioridade={t.prioridade} />
))}
```

O `filter` devolve um array novo; `tarefas` continua com todas. A `key` continua sendo o `id`, mesmo na lista filtrada.
:::

---

## :icon[eye] Mostrar ou nada: &&

Lista vazia não deve ficar em branco. É o `&&` do E13a: se a esquerda é falsa, ele devolve a esquerda e para; se é verdadeira, devolve o JSX da direita.

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

O React não desenha `false`, `null` nem `undefined`. Com o array vazio, o `map` não gera cartão e só o aviso aparece.

:::warning
O `0` ele desenha. `{tarefas.length && ...}` com a lista vazia mostra um `0` solto: é a armadilha do zero do E13a. Escreva a condição completa, `=== 0` ou `> 0`.
:::

---

## :icon[arrow-left-right] Isto ou aquilo: o ternário

Quando há duas opções, use o ternário do E13b. Ele é uma expressão, por isso cabe entre as chaves do JSX; o `if`, como você viu no E21, não cabe.

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

## :icon[corner-down-right] Return antecipado

O `if` não cabe dentro do JSX, mas cabe **antes** do `return`. Quando a tela inteira muda, use a guard clause do E13b e saia cedo:

```jsx
function ListaTarefas({ tarefas }) {
  if (tarefas.length === 0) {
    return <p>Nenhuma tarefa por aqui</p>
  }

  return (
    <section>
      {tarefas.map((t) => (
        <CartaoTarefa key={t.id} titulo={t.titulo} />
      ))}
    </section>
  )
}
```

| Situação | Use |
|---|---|
| um trecho aparece ou não | `&&` |
| um trecho ou outro | ternário |
| o componente inteiro muda | `if` com `return` antes do JSX |

Um componente também pode devolver `null`: não desenha nada.

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
Estilo inline é um objeto, por isso as chaves duplas, como em `autor={{ nome: 'Ana' }}` na aula E22a. Sem `:hover`, `@media` nem seletores: só para um ajuste pequeno.
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

O `import` do arquivo devolve um objeto; cada classe é uma propriedade dele:

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

`estilos.cartao` vale algo como `"_cartao_p62cn_1"`: um nome gerado, único. Por isso dois componentes podem ter `.cartao` sem conflito. Abra a aba Elements do DevTools, a do E01, e veja o nome real no HTML.

---

## :icon[zap] Classes dinâmicas

Para juntar duas classes, monte a string com a **template string** do E05: crases e `${ }` para encaixar valores.

```jsx
<div className={`${estilos.cartao} ${concluida ? estilos.concluida : ''}`}>
```

Com mais de uma condição, variáveis com nome deixam a tag legível, como as condições com nome do E13b:

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
- Esquecer a `key`, ou colocá-la dentro do componente: o console avisa e a tela pode bagunçar quando a lista mudar
- `key={i}` com o índice: funciona até alguém remover ou reordenar um item
- `{tarefas.length && <p>...</p>}`: com a lista vazia aparece um `0` na tela; compare com `=== 0`
- `tarefas.sort()` ou `tarefas.push()` dentro do componente: muda a prop do pai; copie com spread antes
- Nomear o arquivo `CartaoTarefa.css` e importar como objeto: sem `.module`, `estilos.cartao` é `undefined` e nada estiliza
:::

---

## :icon[list-checks] Resumo

:::summary
- O array guarda as tarefas; o `map` transforma cada uma em um `CartaoTarefa` com `key={t.id}`
- A key identifica o dado, não a posição, e vai na tag que o `map` devolve
- `filter` e spread preparam os dados antes do `return`, sem alterar a prop
- `&&` mostra ou esconde, o ternário escolhe entre dois, o return antecipado troca o componente inteiro
- CSS Modules (`Nome.module.css` e `import estilos from ...`) dá classes exclusivas; a template string junta as condicionais
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

---

## :icon[milestone] Projeto 4 · Etapa 2: lista com props e CSS Modules

No seu repositório `livro-de-receitas`:

- salve as 8 receitas de [receitas.js](materiais/projeto-4/receitas.js) em `src/data/receitas.js`
- `tempoTotal` e `rotuloDificuldade` em `src/utils/receitas.js`
- `CartaoReceita({ receita })`: a receita inteira numa prop só
- `ListaReceitas` com `map`, `key={receita.id}` e a mensagem de lista vazia
- CSS Modules, com um selo de cor e texto para cada dificuldade

Commit: `Projeto 4: etapa 2, lista com props e CSS Modules`. Enunciado completo e entrega: página do curso, em **Projetos**.
