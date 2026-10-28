---
title: "Projeto 3 · Lista de tarefas"
summary: App web de tarefas com regras testadas, classes, erros próprios, Promises e a API, e a tela feita por você no DOM.
section: Módulo Básico
module: classes-e-controle
opens: e13a-if-else-e-switch
due: e21a-por-que-react
due_label: início do E21
passing_score: 70
required: true
rubric:
  - key: regras-e-classes
    title: Regras e classes
    points: 25
    description: "As regras de prazo, prioridade, busca, filtro, urgência e resumo dão os resultados das tabelas do enunciado; `Tarefa`, `TarefaRecorrente` e `ListaDeTarefas` têm os nomes do enunciado, `#tarefas` é privado, `concluir` devolve uma instância nova e a recorrente gera a próxima ao ser concluída."
  - key: tela
    title: A tela no navegador
    points: 25
    description: "Com `npx serve .`, a lista aparece em ordem de urgência, com prioridade, prazo e resumo; Concluir e Remover funcionam; o formulário cria tarefas; a busca e o filtro redesenham a lista; nenhuma regra mora em `src/tela/`."
  - key: erros-e-assincrono
    title: Erros, salvamento e API
    points: 20
    description: "Erros próprios com `codigo`, e só os esperados capturados; a mensagem aparece embaixo do campo certo; as tarefas voltam depois de recarregar, com o aviso Salvando...; Importar exemplos traz as tarefas da DummyJSON, desliga o botão enquanto espera e mostra a mensagem quando falta internet."
  - key: testes
    title: Testes e lint
    points: 20
    description: "`npm run verificar` verde; testes para cada regra e cada borda das tabelas, para as três classes, para os erros, para o salvamento com armazenamento falso e para a API com `fetch` simulado; nenhum teste usa a internet nem o `localStorage`."
  - key: entrega
    title: Repositório e README
    points: 10
    description: "Repositório público `lista-de-tarefas` sem `node_modules/`, um commit por etapa com as mensagens do enunciado e README com o que o app faz, dois prints, como rodar e como testar."
steps:
  - lesson: e13b-condicoes-legiveis
    when: E13
    title: Prazo e prioridade
    summary: "Repositório criado a partir do ponto de partida; `situacaoDoPrazo`, `textoDoPrazo` e `pesoDaPrioridade` com testes nas bordas."
  - lesson: e14b-lacos-sobre-colecoes
    when: E14
    title: Busca, filtro e urgência
    summary: "`buscarTarefas`, `filtrarTarefas`, `ordenarPorUrgencia` e `resumirTarefas`, com laços e testes."
  - lesson: e15b-metodos-estaticos-getters-e-setters
    when: E15
    title: Classe Tarefa e a lista na tela
    summary: "Classe `Tarefa` com getters, `deJSON` e `concluir`; a lista e o resumo desenhados no DOM."
  - lesson: e16b-encapsulamento-e-composicao
    when: E16
    title: Lista, recorrente e botões
    summary: "`ListaDeTarefas` com `#tarefas`, `TarefaRecorrente` que gera a próxima e os botões Concluir e Remover na tela."
  - lesson: e17b-tratamento-de-erros
    when: E17
    title: Erros próprios e formulário
    summary: "`ErroDeTarefa` e filhos, validação que lança e o formulário de nova tarefa com a mensagem embaixo do campo."
  - lesson: e18b-promises
    when: E18
    title: Salvar com Promises
    summary: "`salvarTarefas` e `carregarTarefas` com Promise sobre o localStorage, armazenamento falso nos testes, aviso Salvando..., busca e filtro na tela."
  - lesson: e19b-consumindo-a-api
    when: E19
    title: Importar exemplos da API
    summary: "`buscarExemplos` com async, await e fetch na DummyJSON, carregando, erro sem rede e testes sem rede."
  - lesson: e20b-revisao-javascript
    when: E20
    title: Revisão e entrega
    summary: "`npm run verificar` verde, README com prints e o link do repositório na página do projeto."
---

## O que você vai construir

Uma **lista de tarefas** que roda no navegador: você escreve "Pagar a conta de luz", escolhe a
prioridade e o prazo, e a lista mostra primeiro o que está atrasado, depois o que vence hoje, e assim
por diante. Dá para concluir, remover, buscar e filtrar; a tarefa que se repete toda semana ganha a
próxima sozinha quando você a conclui; tudo fica salvo no navegador; e um botão traz tarefas de
exemplo da internet.

É o projeto mais difícil do Módulo Básico, e o único em que **a tela é sua**: o JavaScript que mexe
na página (o **DOM**) é você quem escreve. As regras e as classes ficam separadas da tela e são
testadas no Jest, como no `lojinha-regras`.

No celular, a página é uma coluna: o formulário em cima, a lista embaixo. No computador, o formulário
e o botão de exemplos ficam à esquerda, e a lista, com busca, filtro e resumo, à direita. Cada tarefa
é uma linha com o título, um selo da prioridade (Alta, Média, Baixa), o prazo em texto ("Atrasada há
2 dias", "Vence hoje", "Vence em 5 dias") e os botões Concluir e Remover. A atrasada tem a borda
vermelha; a concluída fica riscada.

### Material do curso

- [ponto-de-partida.zip](materiais/projeto-3/ponto-de-partida.zip): o `index.html` e o `estilo.css`
  prontos, com tema claro e escuro, mais `package.json`, Jest e ESLint configurados. Você não precisa
  escrever HTML nem CSS: o seu trabalho é o JavaScript
- [Guia do DOM](materiais/projeto-3/guia-dom.html): o essencial para mexer na página (encontrar,
  criar e apagar elementos, classes, eventos, formulário, `dataset`, `localStorage`), com exemplos que
  funcionam na própria página. Cada etapa diz quais partes do guia usar

O `index.html` traz três tarefas escritas à mão dentro da lista. Elas são o **molde**: mostram o
HTML e as classes que o seu JavaScript vai criar para cada tarefa. Quando a sua renderização
funcionar, ela apaga o molde.

### A tarefa

| Campo | Tipo | Exemplo |
|---|---|---|
| `id` | número inteiro | `1` |
| `titulo` | texto, de 3 a 80 caracteres | `'Pagar a conta de luz'` |
| `prioridade` | `'alta'`, `'media'` ou `'baixa'` | `'alta'` |
| `prazo` | texto `'AAAA-MM-DD'` ou `null` | `'2026-10-30'` |
| `concluida` | `true` ou `false` | `false` |
| `frequencia` | só na tarefa que se repete: `'diaria'` ou `'semanal'` | `'semanal'` |

### Estrutura final

```plaintext
lista-de-tarefas/
├── index.html, estilo.css       do ponto de partida
├── package.json, babel.config.json, eslint.config.js
├── README.md
├── docs/                        os prints do README
└── src/
    ├── utils/datas.js           lerData, inicioDoDia, diasEntre, somarDias, paraTextoDeData
    ├── regras/tarefas.js        prazo, prioridade, busca, filtro, urgência e resumo
    ├── data/tarefas.js          tarefas de exemplo escritas por você
    ├── modelos/                 Tarefa.js, TarefaRecorrente.js, ListaDeTarefas.js, erros.js
    ├── servicos/armazenamento.js  salvar e carregar, com Promises
    ├── api/exemplos.js          as tarefas de exemplo da DummyJSON
    └── tela/                    app.js e render.js: o código que mexe no DOM
```

Cada arquivo de `src/` (menos os de `tela/`) tem o seu `.test.js` ao lado.

:::warning A regra das pastas
`regras/`, `modelos/`, `servicos/` e `api/` **nunca** usam `document`: por isso rodam no Jest.
`tela/` não decide nada: lê o que a pessoa fez, chama as classes e desenha. Se você escreveu um `if`
sobre prazo ou prioridade dentro de `tela/`, ele está no lugar errado.
:::

## Regras

Os nomes das funções, classes, métodos e códigos de erro abaixo são fixos: o instrutor corrige por
eles. Os exemplos usam **hoje = quarta, 28 de outubro de 2026**, que nos testes é
`new Date(2026, 9, 28)` (o mês começa em 0).

### Prazo e prioridade

| `prazo` | `situacaoDoPrazo(prazo, hoje)` | `textoDoPrazo(prazo, hoje)` |
|---|---|---|
| `null`, `undefined` ou `''` | `'sem-prazo'` | `'Sem prazo'` |
| `'2026-10-25'` | `'atrasada'` | `'Atrasada há 3 dias'` |
| `'2026-10-27'` | `'atrasada'` | `'Atrasada há 1 dia'` |
| `'2026-10-28'` | `'vence-hoje'` | `'Vence hoje'` |
| `'2026-10-29'` | `'em-dia'` | `'Vence amanhã'` |
| `'2026-11-02'` | `'em-dia'` | `'Vence em 5 dias'` |

- A hora de `hoje` não muda a resposta: às 23h59 do dia 28, o prazo `'2026-10-28'` ainda "vence hoje"
- `pesoDaPrioridade(prioridade)`: `'alta'` 3, `'media'` 2, `'baixa'` 1, qualquer outra coisa 0
- Os valores de `situacaoDoPrazo` são os nomes das classes do CSS: `atrasada`, `vence-hoje`,
  `em-dia` e `sem-prazo`

### Busca, filtro, urgência e resumo

| Função | O que devolve |
|---|---|
| `buscarTarefas(tarefas, termo)` | as tarefas cujo título tem **todas** as palavras do termo, em qualquer ordem, sem diferenciar maiúsculas nem acentos; termo vazio, só com espaços ou ausente devolve todas |
| `filtrarTarefas(tarefas, filtro, hoje)` | `'todas'`, `'pendentes'`, `'concluidas'` ou `'atrasadas'` (pendente e com o prazo vencido); filtro desconhecido devolve todas |
| `ordenarPorUrgencia(tarefas)` | uma **cópia** ordenada: pendentes antes das concluídas; prazo mais cedo primeiro e sem prazo no fim; mesmo prazo, a prioridade maior primeiro; empate, título em ordem alfabética |
| `resumirTarefas(tarefas, hoje)` | `{ total, pendentes, concluidas, atrasadas }`; atrasada conta só se estiver pendente |

Nenhuma delas muda a lista recebida. Exemplos: `buscarTarefas(tarefas, 'TECNICO')` acha "Ligar para o
técnico"; `'luz conta'` acha "Pagar a conta de luz"; `'conta gato'` não acha nada.

### Classes

| Classe | O que precisa ter |
|---|---|
| `Tarefa` (`export default`) | `constructor` que recebe um objeto, com `prioridade = 'media'`, `prazo = null` e `concluida = false`; estáticos `deJSON(obj)` e `listaDeJSON(lista)`; getters `peso` e `rotuloDaPrioridade` (`'Alta'`, `'Média'`, `'Baixa'`); métodos `situacao(hoje)`, `textoDoPrazo(hoje)`, `concluir()`, `proxima()` e `paraJSON()` |
| `TarefaRecorrente extends Tarefa` (`export default`) | campo privado `#frequencia` (`'diaria'` ou `'semanal'`, padrão `'semanal'`) com getter só de leitura; getter `rotuloDaFrequencia` (`'Todo dia'`, `'Toda semana'`); sobrescreve `concluir()`, `proxima(id)` e `paraJSON()` |
| `ListaDeTarefas` (`export default`) | campo privado `#tarefas`; `constructor(tarefas = [])`; estático `deJSON(lista)`; getters `todas` (uma cópia) e `tamanho`; métodos `adicionar(dados)`, `concluir(id)`, `remover(id)`, `importar(lista)` e `paraJSON()`; mais a função exportada `criarTarefa(dados)` |

- `concluir()` devolve **outra** instância, concluída; a original não muda (E15)
- `proxima()` devolve `null` numa `Tarefa`. Numa `TarefaRecorrente`, `proxima(id)` devolve uma
  recorrente nova, pendente, com o `id` recebido e o prazo 1 dia (diária) ou 7 dias (semanal) depois
  do prazo atual: de `'2026-10-30'`, a semanal vai para `'2026-11-06'`
- `lista.concluir(id)` troca a tarefa pela versão concluída e, se `tarefa.proxima(novoId)` não for
  `null`, acrescenta a próxima. É polimorfismo: nenhum `if` pergunta o tipo da tarefa. Concluir uma
  tarefa já concluída não faz nada
- `lista.adicionar(dados)` dá o id (o maior id da lista mais 1) e devolve a tarefa criada;
  `criarTarefa(dados)` cria uma `TarefaRecorrente` quando `dados.frequencia` está preenchida e uma
  `Tarefa` nos outros casos

### Erros

| Situação | Classe | `codigo` | Mensagem sugerida |
|---|---|---|---|
| título vazio ou só com espaços | `TituloInvalidoError` | `TITULO_INVALIDO` | Escreva o título da tarefa. |
| título com menos de 3 caracteres (sem os espaços das pontas) | `TituloInvalidoError` | `TITULO_INVALIDO` | O título precisa de pelo menos 3 letras. |
| título com mais de 80 caracteres | `TituloInvalidoError` | `TITULO_INVALIDO` | O título pode ter até 80 caracteres. |
| título igual ao de uma tarefa pendente, sem diferenciar maiúsculas | `TituloInvalidoError` | `TITULO_INVALIDO` | Já existe uma tarefa pendente com esse título. |
| prazo fora do formato `AAAA-MM-DD` | `PrazoInvalidoError` | `PRAZO_INVALIDO` | Use uma data no formato AAAA-MM-DD. |
| tarefa que se repete sem prazo | `PrazoInvalidoError` | `PRAZO_INVALIDO` | Tarefa que se repete precisa de prazo. |
| `concluir` ou `remover` com um id que não está na lista | `TarefaNaoEncontradaError` | `TAREFA_NAO_ENCONTRADA` | Essa tarefa não está mais na lista. |

Todas estendem `ErroDeTarefa(mensagem, codigo)`, que estende `Error`. Prioridade ou frequência
desconhecida também lança um `ErroDeTarefa`, com o código que você escolher. O título é guardado sem
os espaços das pontas. As mensagens podem ter outras palavras; os códigos, não.

## Etapas

Cada etapa termina com um commit com a mensagem indicada e o `git push`. Pode haver commits extras no
meio; o da etapa é o que o instrutor confere no encontro seguinte. Em cada encontro, 15 minutos da
aula são do projeto: você começa ali e termina em casa.

### Etapa 1 · E13: prazo e prioridade

**O repositório**

- Baixe o [ponto-de-partida.zip](materiais/projeto-3/ponto-de-partida.zip), descompacte, renomeie a
  pasta para `lista-de-tarefas` e rode `npm install`
- Crie o `.gitignore` com a linha `node_modules/`, faça o primeiro commit
  (`Projeto 3: ponto de partida`) e envie para o repositório **público** `lista-de-tarefas` no GitHub,
  com o fluxo do E03
- Rode `npx serve .` e abra o endereço que aparece: a página mostra as três tarefas do molde. Os botões
  ainda não fazem nada

**As regras**

- `src/utils/datas.js`: `lerData('2026-10-28')` monta o `Date` pelos números, como no E06b (nunca
  `new Date('2026-10-28')`, que no Brasil vira o dia 27); `inicioDoDia(data)`, o mesmo dia sem a hora;
  `diasEntre(inicio, fim)`, do E06b
- `src/regras/tarefas.js`: `situacaoDoPrazo`, `textoDoPrazo` e `pesoDaPrioridade`, com a tabela de
  "Prazo e prioridade". O "sem prazo" sai numa guard clause; o peso usa `switch` com `default`; "dia"
  ou "dias" é trabalho de um ternário
- `src/regras/tarefas.test.js` com `hoje` fixo: ontem, hoje e amanhã (as bordas), os três jeitos de
  não ter prazo, hoje às 23h59, a virada do mês, o plural e a prioridade desconhecida
- `npm run verificar` verde

:::tip Por que zerar a hora
Às 15h do dia 28, até a meia-noite do dia 29 faltam 9 horas: 0,375 dia, que o `Math.round` do
`diasEntre` arredonda para 0. Sem o `inicioDoDia`, a tarefa de amanhã "vence hoje". O teste das 23h59
pega esse bug.
:::

Commit: `Projeto 3: etapa 1, prazo e prioridade`.

### Etapa 2 · E14: busca, filtro e urgência

As quatro funções da tabela "Busca, filtro, urgência e resumo", em `src/regras/tarefas.js`. Elas
recebem uma lista de objetos no formato da tarefa e funcionam igual quando, na etapa 3, a lista for
de instâncias.

- `buscarTarefas` com laço: uma função auxiliar, sem `export`, que para na primeira palavra que falta
  (E14b), e os dois lados sem acento e em minúsculas (E06a)
- `filtrarTarefas` com `switch` e `default`
- `ordenarPorUrgencia` copia antes de ordenar (E08a) e usa um comparador com desempates; texto
  `'AAAA-MM-DD'` em ordem alfabética já está em ordem de data
- `resumirTarefas` numa passada só, com `for...of` e três acumuladores (E14a)
- No teste, uma lista de 6 tarefas que cubra os casos; 2 testes ou mais por função, um deles com a
  lista ou o termo vazio, e um que prove que a lista recebida não mudou

Commit: `Projeto 3: etapa 2, busca, filtro e urgência`.

### Etapa 3 · E15: classe Tarefa e a lista na tela

**A classe** (`src/modelos/Tarefa.js`), com a linha `Tarefa` da tabela "Classes", menos o
`proxima()`, que chega na etapa 4:

- `deJSON(obj)` lança `new Error('Tarefa inválida no JSON')` quando `obj` não tem um `titulo` em
  texto; a etapa 5 troca esse erro por um próprio
- `situacao(hoje)` e `textoDoPrazo(hoje)` são métodos, não getters, porque recebem `hoje`; os dois
  chamam as funções da etapa 1, e a regra continua num lugar só
- `concluir()` devolve `new Tarefa({ ...this.paraJSON(), concluida: true })`, o jeito do `comStatus`
  do E15
- `Tarefa.test.js` com 6 testes ou mais, entre eles a original intacta depois de `concluir()` e a ida
  e volta pelo JSON

**Os dados**: `src/data/tarefas.js` exporta `tarefas`, 5 ou 6 objetos escritos por você, com prazos
perto da data de hoje: pelo menos uma atrasada, uma que vence hoje, uma concluída e uma sem prazo.

**A tela** ([Guia do DOM](materiais/projeto-3/guia-dom.html), partes 1 a 6):

- `src/tela/render.js`: uma função que cria o `<li>` de uma tarefa igual ao molde (classes `tarefa`,
  `prioridade-...`, a situação e, se for o caso, `concluida`; título, selo da prioridade e o texto do
  prazo, ou "Concluída"), ainda sem botões, e uma que desenha a lista inteira
- `src/tela/app.js`: cria as instâncias com `Tarefa.listaDeJSON(tarefas)` e tem uma função
  `renderizar()` que ordena por urgência, desenha a lista, escreve o resumo no `#resumo` (por exemplo,
  "3 pendentes · 1 atrasada · 2 concluídas") e mostra o `#vazio` só quando não há tarefas
- Abra com `npx serve .`: o molde some e aparecem as suas tarefas, na ordem certa

Commit: `Projeto 3: etapa 3, classe Tarefa e a lista na tela`.

### Etapa 4 · E16: lista, recorrente e botões

**As classes**

- `Tarefa` ganha `proxima()`, que devolve `null`
- `src/utils/datas.js` ganha `somarDias(data, dias)` (E06b) e `paraTextoDeData(data)`, que devolve
  `'AAAA-MM-DD'` com `padStart` (E06a)
- `src/modelos/TarefaRecorrente.js`, com a linha da tabela "Classes": `super(...)` no `constructor`,
  `super.paraJSON()` no `paraJSON()` e o `concluir()` sobrescrito para continuar recorrente. Frequência
  desconhecida ou falta de prazo: `throw new Error(...)` por enquanto
- `src/modelos/ListaDeTarefas.js`, com `criarTarefa`, `adicionar`, `concluir`, `remover`, `todas`,
  `tamanho`, `deJSON` e `paraJSON` (o `importar` fica para a etapa 7)
- Testes: a próxima semanal e a diária (com virada de mês), `frequencia` só de leitura, `todas`
  devolvendo uma cópia, concluir a recorrente cria a próxima, concluir duas vezes não cria duas,
  remover e a ida e volta pelo JSON mantendo a `TarefaRecorrente`

**A tela** (guia, partes 7 e 9):

- O dado do `app.js` passa a ser uma `ListaDeTarefas`, criada com `ListaDeTarefas.deJSON(tarefas)`;
  ponha uma tarefa semanal nos seus dados de exemplo
- Cada item ganha os botões Concluir (só nas pendentes) e Remover, com `data-acao` e `data-id`, como
  no molde, e o selo "Toda semana" nas recorrentes. Aqui o `instanceof` é bem-vindo: mostrar algo que
  só a filha tem, como no E16a
- **Um** ouvinte de `click`, na `<ul>`, lê o `dataset`, chama `concluir` ou `remover` com `Number(id)`
  e redesenha. Concluir a semanal faz a próxima aparecer na lista

Commit: `Projeto 3: etapa 4, lista, recorrente e botões`.

### Etapa 5 · E17: erros próprios e formulário

**Os erros**

- `src/modelos/erros.js`: `ErroDeTarefa` e os três filhos da tabela "Erros", cada um com `name`,
  `codigo` e o dado extra (`titulo`, `prazo` ou `id`)
- O `constructor` da `Tarefa` valida título, prioridade e prazo; a `TarefaRecorrente` troca os
  `throw new Error` por erros próprios; o `deJSON` também
- `ListaDeTarefas`: título repetido em `adicionar`, id que não existe em `concluir` e `remover`. A
  guarda vem antes de mudar a lista: se lançar, a lista fica como estava
- Testes com `toThrow(Classe)` (com a arrow!) e o `codigo`, nas bordas de 2, 3, 80 e 81 caracteres

**A tela** (guia, partes 8 e 10):

- O formulário cria a tarefa: `submit` com `preventDefault`, lê os quatro campos (o prazo vazio vira
  `null`) e chama `lista.adicionar(...)`; deu certo, limpa o formulário, devolve o foco ao título e
  redesenha
- `try...catch` em volta do `adicionar`: o que não for `ErroDeTarefa` sobe (é bug); o resto vai para a
  mensagem certa, escolhida pelo `codigo` com um `switch` (E13 e E17b): `TITULO_INVALIDO` embaixo do
  título, `PRAZO_INVALIDO` embaixo do prazo, os outros no `#aviso` do topo
- O campo com erro ganha `aria-invalid="true"`; no envio seguinte, as mensagens antigas somem
- Os botões da etapa 4 também ganham `try...catch`: `TarefaNaoEncontradaError` vira aviso no `#aviso`

Commit: `Projeto 3: etapa 5, erros próprios e formulário`.

### Etapa 6 · E18: salvar com Promises

**O serviço** (`src/servicos/armazenamento.js`), sem `async` nem `await`, que chegam no E19:

- `export const CHAVE = 'lista-de-tarefas'` e `esperar(ms)`, a Promise com `setTimeout` do E18b
- `salvarTarefas(lista, opcoes = {})`: devolve uma Promise que, depois de `atraso` ms (padrão 400),
  grava o JSON de `lista.paraJSON()` na `CHAVE`
- `carregarTarefas(opcoes = {})`: devolve uma Promise da `ListaDeTarefas`; nada salvo, lista vazia;
  texto quebrado ou tarefa inválida, rejeita com `ErroDeTarefa` de código `DADOS_CORROMPIDOS`
- `opcoes` traz `armazenamento` (padrão `localStorage`) e `atraso`: o mesmo jeito de injetar do
  `simularEtapa` do E18b

O `localStorage` responde na hora; o atraso imita um servidor de verdade, que demora, e deixa o aviso
"Salvando..." aparecer. Quando o app for para o celular, o lugar de guardar muda e a tela continua
igual, porque ela já espera uma Promise.

**Os testes** (`armazenamento.test.js`) recebem um **armazenamento falso**: um objeto com o mesmo
`getItem` e `setItem`, que guarda os textos num objeto comum. Teste salvar e carregar de volta (com a
classe certa), a primeira visita, o texto quebrado e a tarefa inválida, com `atraso: 0` e
`return expect(...).resolves` ou `.rejects` (E18b). Nenhum teste toca no `localStorage` de verdade.

**A tela** (guia, partes 7 e 11):

- Ao abrir a página: "Carregando..." no `#aviso`, `carregarTarefas()` e, no `then`, a lista salva
  vira o dado; no `catch`, a mensagem do erro; no `finally`, `renderizar()`
- Depois de cada mudança: "Salvando...", `salvarTarefas(lista)` e "Tudo salvo." (ou a mensagem de
  falha)
- A busca (`input`) e o filtro (`change`) passam a redesenhar a lista, com as funções da etapa 2
- O `src/data/tarefas.js` sai do `app.js`: na primeira visita, a lista começa vazia

Recarregue a página: as tarefas continuam lá. No DevTools, aba Application, o texto salvo aparece em
Local storage.

Commit: `Projeto 3: etapa 6, salvar com Promises`.

### Etapa 7 · E19: importar exemplos da API

A DummyJSON tem tarefas de exemplo, em inglês, em `https://dummyjson.com/todos?limit=10`:

```json
{
  "todos": [
    { "id": 1, "todo": "Do something nice for someone you care about", "completed": false, "userId": 152 },
    { "id": 2, "todo": "Memorize a poem", "completed": true, "userId": 13 }
  ],
  "total": 254, "skip": 0, "limit": 10
}
```

- `src/api/exemplos.js`: `URL_DOS_EXEMPLOS`; `traduzirTodo(todo)`, em que `todo` vira `titulo`,
  `completed` vira `concluida`, a prioridade é `'media'` e o prazo é `null`; e
  `async function buscarExemplos()`, que devolve as tarefas traduzidas
- Sem internet, `buscarExemplos` rejeita com `ErroDeTarefa` de código `SEM_CONEXAO` e uma mensagem em
  português; resposta com `ok` falso, com o código `API_` mais o status (`API_500`, `API_429`)
- `lista.importar(dados)` acrescenta cada tarefa com `adicionar`, pula as que têm um título igual ao
  de qualquer tarefa da lista e devolve quantas entraram: importar duas vezes não duplica
- Testes com `fetch` simulado (`globalThis.fetch`, E19b): tradução, resposta 500 e falta de rede;
  mais os do `importar`. Desligue o Wi-Fi e rode `npm test`: tudo verde

**A tela** (guia, parte 12): o botão Importar exemplos, num ouvinte `async`, fica desligado enquanto
espera, mostra "Carregando exemplos..." no `#status-importacao`, importa, redesenha, salva e mostra
quantas entraram; no erro, a mensagem; no `finally`, o botão volta. Teste no navegador com a aba
Network do DevTools em **Offline**.

Se quiser, reescreva com `await` o carregamento da etapa 6: a tela continua igual.

Commit: `Projeto 3: etapa 7, importar exemplos da API`.

### Etapa 8 · E20: revisão e entrega

O E20 tem a Prova 1: esta etapa é curta, e o prazo vai até o início do E21.

- Passe pela lista "Antes de entregar", abaixo
- Tire dois prints da página (um no tamanho de celular, com o DevTools; outro no computador) e salve
  em `docs/`
- Troque o README do ponto de partida pelo seu: o que o app faz, os prints, como rodar
  (`npm install` e `npx serve .`), como testar (`npm run verificar`) e a estrutura de pastas
- Cole o link do repositório na página deste projeto

Commit: `Projeto 3: etapa 8, revisão e entrega`.

:::steps
1. `npm run verificar` verde, com o Wi-Fi desligado
2. Nenhum `console.log` esquecido e nenhum `document` fora de `src/tela/`
3. Nenhum `fetch` fora de `src/api/` e nenhum `localStorage` fora de `src/servicos/`
4. Numa janela anônima, com `npx serve .`: adicionar, concluir a semanal, remover, buscar, filtrar,
   recarregar, importar e importar de novo, enviar o título vazio
5. Os oito commits de etapa no GitHub
:::

## Como entregar

1. Repositório **público** `lista-de-tarefas` no seu GitHub, sem `node_modules/`
2. Um commit por etapa, com as mensagens acima, e o último `git push` feito
3. README com o que o app faz, dois prints, como rodar e como testar
4. Na página deste projeto, cole o link do repositório. O link de demonstração é opcional: o app não
   tem build, então o GitHub Pages serve a pasta como está (no repositório, Settings, Pages, Branch
   `main`, pasta `/ (root)`, Save; o endereço fica `https://seu-usuario.github.io/lista-de-tarefas/`)

**Prazo: início do E21.** O instrutor corrige pela rubrica, critério por critério, e pode devolver o
projeto para ajustes antes da nota final. Aprovação com 70.

## Como será avaliado

O instrutor clona o repositório, roda `npm install` e `npm run verificar`, abre a página com
`npx serve .` numa janela anônima e segue um roteiro de uso: o da lista "Antes de entregar", mais o
Wi-Fi desligado na hora de importar. Depois lê o código e o README.

| Critério | Pontos | Nota cheia | Perde pontos se |
|---|---|---|---|
| Regras e classes | 25 | as tabelas de "Regras" batem, nomes do enunciado, `#tarefas` privado, recorrente gerando a próxima sem `if` de tipo | a tarefa de amanhã "vence hoje", a ordem ignora a prioridade, `concluir` muda a própria instância, `instanceof` decide a próxima |
| A tela no navegador | 25 | lista, resumo, botões, formulário, busca e filtro funcionando, regra nenhuma em `src/tela/` | a lista duplica a cada ação, o resumo não muda, o texto do prazo é calculado na tela |
| Erros, salvamento e API | 20 | mensagem no campo certo, tarefas de volta depois de recarregar, Salvando..., importar com carregando e erro sem rede | `catch` que esconde bug, erro só no Console, botão que fica desligado depois de uma falha |
| Testes e lint | 20 | `npm run verificar` verde sem internet, bordas testadas, armazenamento falso e `fetch` simulado | teste que depende do dia de hoje ou da internet, regra sem teste, lint vermelho |
| Repositório e README | 10 | oito commits de etapa, README completo, `npm install` e `npx serve .` funcionando do zero | commit único no fim, prints faltando, `node_modules/` no repositório |

Exemplos de nota parcial: tudo funciona, mas a busca não acha "tecnico" sem acento (Regras e classes:
21 de 25). A mensagem aparece, mas sempre no `#aviso`, nunca embaixo do campo (Erros, salvamento e
API: 16 de 20). Testes ótimos, mas um deles chama a DummyJSON de verdade (Testes e lint: 15 de 20).

## Para ir além

Opcional e sem ponto extra:

- Editar o título com um duplo clique no item
- Desfazer a última remoção, com um aviso "Tarefa removida. Desfazer" por alguns segundos
- A próxima recorrente nunca nasce atrasada: se o prazo novo ainda for antes de hoje, conte a partir
  de hoje
- Um contador de caracteres embaixo do título ("12 de 80")
- Cancelar a importação com o `AbortController` do E19b, num botão Cancelar

## Dúvidas frequentes

**O `npm test` diz "No tests found" logo depois do `npm install`.** É normal: o ponto de partida não
tem testes. Ele some com o primeiro `tarefas.test.js`.

**Abri o `index.html` com dois cliques e a página não funciona.** Pelo `file://`, o navegador
bloqueia módulos. Rode `npx serve .` e use o endereço que ele mostra.

**Posso mudar o HTML ou o CSS?** Pode, desde que os ids e as classes que o seu JavaScript usa
continuem lá e a página continue acessível (rótulos nos campos, botões de verdade). Visual não vale
ponto: capriche no JavaScript.

**Posso usar `innerHTML`?** Para o título da tarefa, não: o texto vem da pessoa, e o `innerHTML` o
trataria como HTML. Use `textContent` (guia, parte 3).

**O ESLint reclama de `document is not defined` num teste.** O teste importou algo de `src/tela/`.
Teste as regras, as classes e os serviços; a tela você confere no navegador.

**O ESLint reclama do `erro` que não uso no `catch`.** Escreva só `catch {`, sem os parênteses: o
JavaScript aceita quando você não precisa do erro.

**O teste da data passou hoje e falhou amanhã.** Ele usou o dia de verdade. Passe `hoje` como
parâmetro, sempre fixo nos testes, como no E06b.

**As tarefas salvas sumiram.** O `npx serve` abriu em outra porta, e cada endereço tem o seu
`localStorage` (guia, parte 11).

**"O servidor de exemplos respondeu 429."** A DummyJSON limita os pedidos por endereço, e a sala
inteira sai pelo mesmo. Espere alguns segundos e tente de novo; os seus testes não dependem dela.

**Os exemplos vêm em inglês.** É uma API de testes: a tradução muda os nomes dos campos, não o texto.

**Posso usar React?** Não: o projeto é JavaScript puro no DOM. O React chega no E21, e você vai
entender na hora o que ele resolve.

**Posso pedir ajuda a um colega ou a uma IA?** Pode pedir explicação, não código pronto. No check-in
de cada encontro, o instrutor pode pedir que você explique uma parte do seu código, e o que você não
souber explicar não conta como seu.
