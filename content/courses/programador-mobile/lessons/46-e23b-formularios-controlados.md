---
title: Formulários controlados
summary: Inputs ligados ao estado, envio sem recarregar a página e o estado no componente certo.
module: react
duration_minutes: 40
objectives:
  - Controlar inputs com estado
  - Tratar o envio de formulários
  - Levantar o estado para o componente pai
  - Impedir dados inválidos
---

# Formulários controlados

Programador Mobile · Encontro E23 · Aula 46 de 89

---

## O que você vai aprender

:::goal
- Ligar um `input` e um `select` ao estado com `value` e `onChange`
- Tratar o envio de um `<form>` sem recarregar a página
- Impedir dados inválidos e limpar o campo depois de enviar
- Decidir em qual componente o estado deve morar
:::

---

## Por que isso importa

O botão "Concluir" já funciona, mas o `minhas-tarefas` continua preso às tarefas que você digitou no código.

Para a pessoa criar a própria tarefa, ela precisa:

1. digitar um título em um campo
2. escolher a prioridade
3. apertar "Adicionar" e ver a tarefa na lista

:::question
Enquanto a pessoa digita, onde fica o texto do campo? Em uma variável do seu componente ou dentro do navegador?
:::

---

## :icon[keyboard] Input controlado

Um **input controlado** mostra o que está no estado e, a cada tecla, atualiza o estado:

```jsx
import { useState } from 'react'

function CampoTitulo() {
  const [texto, setTexto] = useState('')

  return (
    <input
      value={texto}
      onChange={(e) => setTexto(e.target.value)}
      placeholder="Nova tarefa"
    />
  )
}
```

- `value={texto}`: o campo exibe o estado
- `onChange`: dispara a cada tecla; o React entrega ao callback o objeto do evento, `e`, e `e.target.value` é o texto do campo

---

## Por que "controlado"

Em HTML puro, o campo guarda o próprio valor e você pergunta a ele quando precisa. No React, é o contrário: **o estado manda, o campo obedece**.

:::steps
1. A pessoa digita uma letra
2. `onChange` roda e chama `setTexto` com o texto novo
3. O React redesenha o componente
4. O `input` mostra o `value` atualizado
:::

Vantagem: o texto está sempre em `texto`, pronto para validar, limpar ou enviar sem precisar "ler o campo".

---

## :icon[send] Enviando com form e preventDefault

Um `<form>` dispara `onSubmit` ao clicar no botão ou apertar Enter. Mas o comportamento padrão do navegador é **enviar para um servidor e recarregar a página**, apagando todo o estado.

```jsx
function enviar(event) {
  event.preventDefault() // cancela o recarregamento
  console.log('Adicionar:', texto)
}

<form onSubmit={enviar}>
  <input value={texto} onChange={(e) => setTexto(e.target.value)} />
  <button type="submit">Adicionar</button>
</form>
```

`event.preventDefault()` diz ao navegador: "eu cuido disso".

---

## :icon[check] Validação e limpeza do campo

Duas regras pequenas evitam uma lista cheia de tarefas vazias:

```jsx
function enviar(event) {
  event.preventDefault()
  if (texto.trim() === '') return // vazio ou só espaços: ignora
  console.log('Adicionar:', texto)
  setTexto('') // limpa o campo
}
```

- `trim()` é o do E06a: `"   "` vira `""`
- O `return` logo no início é a guard clause do E13b: sai antes de adicionar
- `setTexto('')` esvazia o estado e, como o input é controlado, o campo limpa sozinho

---

## select controlado para a prioridade

Um `<select>` segue a mesma receita: `value` e `onChange`.

```jsx
const [prioridade, setPrioridade] = useState('media')

<select value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
  <option value="alta">Alta</option>
  <option value="media">Média</option>
  <option value="baixa">Baixa</option>
</select>
```

O valor inicial `'media'` define a opção que aparece marcada. `e.target.value` traz o `value` da opção escolhida, sempre como texto, como o `process.argv` do terminal.

---

## :icon[lightbulb] Pense

:::question
No `minhas-tarefas`, três componentes precisam do mesmo array de tarefas:

- `FormularioTarefa` cria tarefas novas
- `ListaTarefas` mostra todas
- `Cabecalho` exibe quantas estão pendentes

Se cada um tivesse o próprio `useState`, o que aconteceria ao adicionar uma tarefa? Em qual componente o array deveria morar?
:::

---

## :icon[layers] Onde o estado deve morar

Regra: o estado mora no **componente pai mais próximo** que precisa do dado e desce para os filhos por props. Subir o estado para esse pai se chama **lifting state up** (levantar o estado).

| Componente | Precisa de `tarefas`? | Recebe por prop |
|---|---|---|
| `App` | guarda o estado | nada |
| `FormularioTarefa` | não; só cria | `onAdicionar` |
| `ListaTarefas` | sim, para mostrar | `tarefas`, `onAlternar` |
| `Cabecalho` | só a contagem | `pendentes` |

O formulário não guarda tarefas: ele guarda só o que está sendo digitado e **avisa** o `App` quando a pessoa envia.

---

## FormularioTarefa: a lógica

O componente recebe `onAdicionar` por prop e controla os próprios campos:

```jsx
import { useState } from 'react'

function FormularioTarefa({ onAdicionar }) {
  const [titulo, setTitulo] = useState('')
  const [prioridade, setPrioridade] = useState('media')

  function enviar(event) {
    event.preventDefault()
    if (titulo.trim() === '') return
    onAdicionar(titulo, prioridade)
    setTitulo('')
  }

  return <form onSubmit={enviar}>{/* campos */}</form>
}
```

Depois de avisar o pai, o título limpa; a prioridade pode ficar.

---

## FormularioTarefa: o JSX

```jsx
<form onSubmit={enviar}>
  <input
    value={titulo}
    onChange={(e) => setTitulo(e.target.value)}
    placeholder="O que precisa fazer?"
  />
  <select value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
    <option value="alta">Alta</option>
    <option value="media">Média</option>
    <option value="baixa">Baixa</option>
  </select>
  <button type="submit">Adicionar</button>
</form>
```

Não esqueça o `export default FormularioTarefa` no fim do arquivo e o `import` no `App`.

---

## :icon[hash] Cada tarefa precisa de um id

A `key` da lista e as funções de remover e alternar dependem de um `id` único. Duas opções prontas no navegador:

```javascript
Date.now()          // 1728400000000 (milissegundos desde 1970)
crypto.randomUUID() // '3b241101-e2bb-4255-8caf-4136c566a962'
```

| Opção | Quando usar |
|---|---|
| `Date.now()` | o mesmo do debounce do E10a; número simples, serve para o laboratório |
| `crypto.randomUUID()` | texto único mesmo criando várias no mesmo milissegundo |

Quando as tarefas vierem de uma API, o `id` vem de lá.

---

## App: o dono das tarefas

```jsx
function App() {
  const [tarefas, setTarefas] = useState(tarefasIniciais)

  function adicionarTarefa(titulo, prioridade) {
    const nova = { id: Date.now(), titulo, prioridade, concluida: false }
    setTarefas([...tarefas, nova])
  }

  return (
    <div>
      <FormularioTarefa onAdicionar={adicionarTarefa} />
      <ListaTarefas tarefas={tarefas} />
    </div>
  )
}
```

- `{ titulo, prioridade }` é o atalho do E08 para chave e variável de mesmo nome
- O spread entrega um array novo ao `setTarefas`, e o React redesenha a lista
- `alternarConcluida` e `onAlternar` continuam como na aula de eventos e estado

---

## :icon[arrow-up-down] Fluxo de dados em uma direção

:::center
![Animação: no FormularioTarefa a pessoa envia, o evento sobe por onAdicionar até o App, o App chama setTarefas e a lista nova desce pela prop tarefas até ListaTarefas, que mostra a tarefa nova](images/e23-evento-sobe-dado-desce.svg)
:::

- Dados **descem** por props: `<ListaTarefas tarefas={tarefas} />`
- Eventos **sobem** por funções passadas como props: `<FormularioTarefa onAdicionar={adicionarTarefa} />`

O filho nunca altera o estado do pai por conta própria: ele chama a função que recebeu, e o pai decide o que fazer.

:::tip Uma fonte da verdade
Cada dado vive em um único lugar. Se `tarefas` está no `App`, nenhum outro componente guarda uma cópia: todos leem de lá e pedem mudanças por função.
:::

---

## :icon[bug] Erros comuns

:::warning
- Esquecer o `event.preventDefault()`: a página recarrega e a lista some
- Esquecer o `value`: o campo aceita texto, mas `setTexto('')` não o limpa
- Colocar `value` sem `onChange`: o campo fica **travado**, nada do que você digita aparece
- Tentar mudar o estado do pai direto no filho (`tarefas.push` dentro do formulário)
- Usar `onClick` no botão em vez de `onSubmit` no form: o Enter deixa de funcionar
:::

---

## :icon[list-checks] Resumo

:::summary
- Input controlado: `value={estado}` + `onChange={(e) => setEstado(e.target.value)}`
- `<form onSubmit>` com `event.preventDefault()` evita o recarregamento da página
- Valide antes de usar (`trim() === ''`) e limpe o campo com `setTexto('')`
- O estado mora no pai mais próximo que precisa dele; filhos recebem dados por props e devolvem eventos por funções
- Cada tarefa precisa de um `id` único, como `Date.now()`
:::

---

## :icon[flask-conical] No laboratório

Deixe o `minhas-tarefas` interativo:

:::steps
1. No `App`, renomeie o array do E22 para `tarefasIniciais` e passe-o para `useState`
2. Crie `src/components/FormularioTarefa.jsx` com input de título, select de prioridade e botão; ele recebe `onAdicionar`
3. No `App`, implemente `adicionarTarefa`, `alternarConcluida` e `removerTarefa`; passe por props até `CartaoTarefa`, que ganha os botões "Concluir" e "Remover"
4. Mostre o contador de pendentes no `Cabecalho` pela prop `pendentes` (`filter(...).length`)
5. Impeça tarefa vazia e limpe o campo após adicionar
6. `git add .`, `git commit -m "E23: estado e formulário"` e `git push`
:::

**Critérios:** adicionar, concluir e remover funcionando; campo limpa após adicionar; contador correto; nenhum erro no console. Entregue o link do repositório.
