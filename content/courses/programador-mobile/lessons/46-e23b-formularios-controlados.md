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

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **campo** (`<input>`) | a caixa da tela onde a pessoa digita |
| **formulário** (`<form>`) | o bloco que junta os campos e o botão de enviar |
| **input controlado** | um campo que mostra o que está no estado, e só isso |
| **comportamento padrão** | o que o navegador faz sozinho, se ninguém disser o contrário |
| **validar** | conferir se um dado serve, antes de usar |
| **levantar o estado** | passar o estado para o componente pai, para os filhos usarem o mesmo dado |

---

## Tarefas presas no código

O botão "Concluir" já funciona, mas o `minhas-tarefas` continua preso às tarefas que você digitou no código.

Para a pessoa criar a própria tarefa, ela precisa:

1. digitar um título em um campo
2. escolher a prioridade
3. apertar "Adicionar" e ver a tarefa na lista

:::question
Enquanto a pessoa digita, onde fica o texto do campo? Em uma variável do seu componente ou dentro do navegador?
:::

---

## Input controlado

Na frente do espelho, quem manda: você ou o espelho?

---

## :icon[keyboard] Input controlado

Um **input controlado** é um campo que mostra o que está no estado e, a cada tecla, atualiza o estado. Ele funciona como um espelho: mostra só o que está guardado no `useState`.

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

O `placeholder` é o texto cinza que aparece enquanto o campo está vazio.

---

## :icon[keyboard] Input controlado na prática

Como o texto está sempre no estado, a tela pode usá-lo enquanto a pessoa digita:

```jsx
// 1. uma saudação
<input value={nome} onChange={(e) => setNome(e.target.value)} />
<p>Olá, {nome}!</p>

// 2. um contador de letras
<input value={texto} onChange={(e) => setTexto(e.target.value)} />
<p>{texto.length}/140</p>

// 3. uma prévia em maiúsculas
<p>{texto.toUpperCase()}</p>
```

| A pessoa digita | A tela mostra |
|---|---|
| Ana | Olá, Ana! |
| Estudar React | 13/140 |
| Estudar React | ESTUDAR REACT |

Ninguém "lê o campo": a tela sai do estado, como todo o resto.

---

## :icon[list-ordered] O campo em português

| Parte | O que ela diz |
|---|---|
| `useState('')` | "o texto começa vazio" |
| `value={texto}` | "mostre no campo o que está em `texto`" |
| `onChange={...}` | "a cada tecla, chame esta função" (*on change*: ao mudar) |
| `e` | o **objeto do evento**: o React entrega ao callback os detalhes do que aconteceu |
| `e.target` | o campo em que a tecla foi digitada |
| `e.target.value` | o texto que está no campo agora, já com a letra nova |
| `setTexto(...)` | "guarde esse texto no estado" |

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

## select controlado para a prioridade

Um `<select>` é a caixa que abre uma lista de opções. Ele segue a mesma receita: `value` e `onChange`.

```jsx
const [prioridade, setPrioridade] = useState('media')

<select value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
  <option value="alta">Alta</option>
  <option value="media">Média</option>
  <option value="baixa">Baixa</option>
</select>
```

- Cada `<option>` tem dois textos: o `value`, que o código recebe (`'media'`), e o que fica entre as tags, que a pessoa vê (Média)
- O valor inicial `'media'` define a opção que aparece marcada
- `e.target.value` traz o `value` da opção escolhida, sempre como texto, como o `process.argv` do terminal

---

## Enviar o formulário

O celular responde sozinho enquanto você dirige. Quem escreveu a resposta?

---

## :icon[send] Enviando com form e preventDefault

Um **formulário** (`<form>`) junta os campos e o botão. Ele dispara o evento `onSubmit` ("ao enviar") quando a pessoa clica no botão ou aperta <kbd>Enter</kbd>.

O **comportamento padrão** do navegador é enviar os dados para um servidor e **recarregar a página**, e isso apaga todo o estado. É como uma resposta automática: se você não desligar, ela sai sozinha.

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

- `event.preventDefault()` ("impeça o padrão") diz ao navegador: "eu cuido disso"
- `event` e `e` são a mesma coisa, o objeto do evento: o nome é você quem escolhe
- `type="submit"` faz do botão o botão de enviar do formulário

---

## :icon[send] Enviar o formulário na prática

Um formulário com dois botões: um envia, o outro não.

```jsx
<form onSubmit={enviar}>
  <input value={texto} onChange={(e) => setTexto(e.target.value)} />
  <button type="submit">Adicionar</button>
  <button type="button" onClick={() => setTexto('')}>Limpar</button>
</form>
```

| A pessoa | O que acontece |
|---|---|
| digita Ler e aperta <kbd>Enter</kbd> | `enviar` roda; o console mostra `Adicionar: Ler` |
| clica em Adicionar | o mesmo: o botão `type="submit"` envia |
| clica em Limpar | o campo esvazia, e nada é enviado: `type="button"` é um botão que não envia |
| aperta <kbd>Enter</kbd> sem o `preventDefault` | a página recarrega, e o estado volta ao começo |

---

## Validar o campo

O caixa da loja aceita qualquer cédula sem olhar?

---

## :icon[check] Validação e limpeza do campo

**Validar** é conferir se o dado serve antes de usar, como o caixa da loja, que confere a cédula antes de aceitar. Aqui, duas regras pequenas evitam uma lista cheia de tarefas vazias:

```jsx
function enviar(event) {
  event.preventDefault()
  if (texto.trim() === '') return // vazio ou só espaços: ignora
  console.log('Adicionar:', texto)
  setTexto('') // limpa o campo
}
```

- `trim()` é o do E06a: tira os espaços das pontas, e `"   "` vira `""`
- O `return` logo no início é a guard clause do E13b: sai antes de adicionar
- `setTexto('')` esvazia o estado e, como o input é controlado, o campo limpa sozinho

---

## :icon[check] Validar na prática

Três envios, a mesma regra: `if (texto.trim() === '') return`.

| A pessoa envia | `texto.trim()` | O que acontece |
|---|---|---|
| o campo vazio | `''` | nada: a guarda sai antes de adicionar |
| três espaços | `''` | nada: o `trim()` tirou os espaços |
| Ler | `'Ler'` | o console mostra `Adicionar: Ler`, e o campo fica vazio |

```javascript
'   '.trim()   // ''
'Ler'.trim()   // 'Ler'
```

Sem o `trim()`, os três espaços passariam na conferência e virariam uma tarefa em branco.

---

## Onde o estado mora

Se cada torcedor anotasse o placar no próprio papel, qual seria o placar certo?

---

## :icon[layers] Onde o estado deve morar

Quando vários componentes precisam do mesmo dado, ele mora num lugar só. É o placar do jogo: se cada torcedor anotasse o seu, cada um teria um número. O placar fica no telão, e todos olham o mesmo.

A regra: o estado mora no **componente pai mais próximo** que precisa do dado e desce para os filhos por props. Subir o estado até esse pai se chama **lifting state up** (levantar o estado).

| Componente | Precisa de `tarefas`? | Recebe por prop |
|---|---|---|
| `App` | guarda o estado | nada |
| `FormularioTarefa` | não; só cria | `onAdicionar` |
| `ListaTarefas` | sim, para mostrar | `tarefas`, `onAlternar` |
| `Cabecalho` | só a contagem | `pendentes` |

---

## :icon[layers] Onde o estado mora na prática

Três dados do `minhas-tarefas`, três lugares:

```jsx
// no FormularioTarefa: o texto digitado só interessa a ele
const [titulo, setTitulo] = useState('')

// no App: as tarefas interessam a três componentes
const [tarefas, setTarefas] = useState(tarefasIniciais)

// no App: a contagem sai das tarefas e desce pronta, sem useState
const pendentes = tarefas.filter((t) => !t.concluida).length
<Cabecalho pendentes={pendentes} />
```

| Dado | Quem usa | Onde mora |
|---|---|---|
| o texto digitado | só o formulário | `FormularioTarefa` |
| as tarefas | formulário, lista e cabeçalho | `App` |
| quantas pendentes | o cabeçalho | calculado no `App` a cada desenho |

Com duas tarefas, uma concluída, o `Cabecalho` mostra `1 pendente(s)`.

---

## :icon[lightbulb] Pratique: onde mora a lista?

:::example Desafio
No `minhas-tarefas`, três componentes precisam do mesmo array de tarefas:

- `FormularioTarefa` cria tarefas novas
- `ListaTarefas` mostra todas
- `Cabecalho` exibe quantas estão pendentes

Se cada um tivesse o próprio `useState`, o que aconteceria ao adicionar uma tarefa? Em qual componente o array deveria morar?
:::

:::tip Resposta
Seriam três listas que não se enxergam: a tarefa nova entraria só na lista do formulário, sem aparecer na tela nem no contador. O array mora no `App`, o pai dos três, e cada filho recebe por prop só o que precisa.
:::

---

## FormularioTarefa: a lógica

O formulário não guarda tarefas: ele guarda só o que está sendo digitado. Ele recebe `onAdicionar` por prop e **avisa** o `App` quando a pessoa envia:

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

- `{/* campos */}` é um comentário dentro do JSX, no lugar do input e do select
- Depois de avisar o pai, o título limpa; a prioridade pode ficar

---

## FormularioTarefa: o JSX

Os campos são o input e o select controlados, agora com `titulo` e `prioridade`:

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

Não esqueça o `export default` no fim do arquivo e o `import` no `App`:

```jsx
export default FormularioTarefa                                   // fim de FormularioTarefa.jsx
import FormularioTarefa from './components/FormularioTarefa.jsx'  // topo de App.jsx
```

---

## O id da tarefa

Numa festa com dois Joões, como o segurança sabe quem é quem?

---

## :icon[hash] Cada tarefa precisa de um id

O **id** é o crachá da tarefa: um número ou texto só dela, que não muda. A `key` da lista e as funções de remover e alternar dependem dele. Duas opções prontas no navegador:

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

## :icon[hash] O id na prática

O crachá aparece em três momentos da vida de uma tarefa:

```jsx
// 1. ao criar: o crachá nasce com a tarefa
const nova = { id: Date.now(), titulo, prioridade, concluida: false }

// 2. ao desenhar a lista: o crachá vira a key
<CartaoTarefa key={t.id} id={t.id} titulo={t.titulo} />

// 3. ao remover: o crachá diz qual tarefa sai
setTarefas(tarefas.filter((t) => t.id !== id))
```

| Momento | Resultado |
|---|---|
| criar Dormir | `{ id: 1728400000000, titulo: 'Dormir', ... }`, um número que nenhuma outra tem |
| desenhar | cada cartão com a sua `key`, sem aviso no console |
| remover o id 2 | a lista sem a tarefa 2; as outras ficam como estavam |

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

- `nova` é a ficha da tarefa: o id, o título, a prioridade e `concluida: false`
- `{ titulo, prioridade }` é o atalho do E08: quando a chave e a variável têm o mesmo nome, `titulo: titulo` vira só `titulo`
- O spread entrega um array novo ao `setTarefas`, e o React redesenha a lista
- `alternarConcluida` e `onAlternar` continuam como na aula 45

---

## Fluxo de dados

Numa rua de mão única, dá para voltar pela contramão?

---

## :icon[arrow-up-down] Fluxo de dados em uma direção

No React, os dados andam numa rua de mão única: descem do pai para os filhos, por props. Para pedir uma mudança, o filho não sobe na contramão: ele toca a campainha do pai, chamando a função que recebeu.

- Dados **descem** por props: `<ListaTarefas tarefas={tarefas} />`
- Eventos **sobem** por funções passadas como props: `<FormularioTarefa onAdicionar={adicionarTarefa} />`

O filho nunca altera o estado do pai por conta própria: ele chama a função que recebeu, e o pai decide o que fazer.

:::tip Uma fonte da verdade
Cada dado vive em um único lugar. Se `tarefas` está no `App`, nenhum outro componente guarda uma cópia: todos leem de lá e pedem mudanças por função.
:::

---

## :icon[route] Fluxo de dados na prática

:::center
![Animação: no FormularioTarefa a pessoa envia, o evento sobe por onAdicionar até o App, o App chama setTarefas e a lista nova desce pela prop tarefas até ListaTarefas, que mostra a tarefa nova](images/e23-evento-sobe-dado-desce.svg)
:::

| A pessoa | Sobe para o `App` | Desce do `App` |
|---|---|---|
| adiciona Dormir | `onAdicionar('Dormir', 'baixa')` | `tarefas`, com Dormir no fim |
| conclui Ler | `onAlternar(1)` | `tarefas`, com Ler riscada |
| só olha a tela | nada | `pendentes`, até o `Cabecalho` |

---

## Mensagens de erro

Nem todo defeito acende uma luz no painel. Como perceber os que ficam quietos?

---

## :icon[siren] Quando aparece um erro

| O que aparece | Quer dizer | O que fazer |
|---|---|---|
| a página pisca e a lista volta ao começo | faltou `event.preventDefault()` | ponha na primeira linha de `enviar` |
| o campo não aceita digitação; o console avisa `without an onChange handler` | `value` sem `onChange` | `onChange={(e) => setTitulo(e.target.value)}` |
| a tarefa entra, mas o campo não limpa | o input está sem `value` | `value={titulo}` |
| o <kbd>Enter</kbd> não adiciona | `onClick` no botão em vez de `onSubmit` no form | `<form onSubmit={enviar}>` e botão `type="submit"` |
| a tarefa não aparece, e o formulário tem `tarefas.push` | o filho tentou mudar o estado do pai | chame a função recebida: `onAdicionar` |

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

---

## :icon[milestone] Projeto 4 · Etapa 3: favoritas, busca e filtro

No seu repositório `livro-de-receitas`:

- no `App`, os estados `busca`, `dificuldade` e `favoritas` (um array de ids)
- `Filtros` com o campo e o seletor controlados; o estado fica no `App`
- `buscarPorNome` (sem acento nem maiúsculas) e `filtrarPorDificuldade`, combinados
- botão "Favoritar" no cartão, sem mutar o array
- "Nenhuma favorita", "1 favorita" ou "3 favoritas" no `Cabecalho`

Commit: `Projeto 4: etapa 3, favoritas, busca e filtro`. Enunciado completo e entrega: página do curso, em **Projetos**.
