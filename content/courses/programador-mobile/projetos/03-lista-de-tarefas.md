---
title: "Projeto 3 · Lista de tarefas"
summary: "Lista de tarefas com classes, herança, erros próprios, salvamento e uma API, testada no Jest. A tela vem pronta no kit."
section: Módulo Básico
module: classes-e-controle
opens: e17-condicoes-legiveis
due: e24-react-e-o-primeiro-componente
due_label: início do E24
passing_score: 70
required: true
rubric:
  - key: regras-e-classes
    title: Regras e classes
    points: 35
    description: "As funções de src/regras/prazos.js e as classes Tarefa, TarefaRecorrente e ListaDeTarefas têm os nomes do enunciado e dão os resultados das tabelas, com o hoje de 10/11/2026. Concluir a tarefa que se repete cria a próxima sem nenhum if que pergunte o tipo da tarefa."
  - key: erros
    title: Erros próprios
    points: 15
    description: "ErroDeTarefa com o campo; a tarefa recusa título vazio ou curto, prioridade e prazo errados; a que se repete recusa ficar sem prazo; a lista recusa título repetido; importar pula só os ErroDeTarefa. Na tela, a mensagem aparece embaixo do campo certo."
  - key: salvar-e-api
    title: Salvar e importar
    points: 15
    description: "As tarefas voltam depois de recarregar a página; texto salvo quebrado vira lista vazia; Importar exemplos traz as 5 pendentes da DummyJSON, não repete na segunda vez e, sem internet, mostra a mensagem em português."
  - key: testes
    title: Testes
    points: 20
    description: "`npm test` verde com a internet desligada, com testes de cada função e método das tabelas e das bordas (ontem, hoje, amanhã, 23h59, 2 e 3 letras), com o armazenamento falso e a resposta falsa. Nenhum teste usa a data de hoje, o localStorage ou a internet."
  - key: entrega
    title: Repositório, commits e README
    points: 15
    description: "Repositório público lista-de-tarefas no GitHub, sem node_modules, com o commit do kit e os das etapas 1 a 6, cada um com o nome da etapa, e um README com o que o app faz, dois prints, como rodar e como testar."
steps:
  - lesson: e17-condicoes-legiveis
    when: E17
    title: Prazo e prioridade
    summary: "O kit no GitHub; `pesoDaPrioridade`, `situacaoDoPrazo`, `proximoPrazo` e `textoDoPrazo`, com testes. A tela mostra as tarefas de demonstração."
  - lesson: e18-classes
    when: E18
    title: Classe Tarefa
    summary: "`Tarefa` com `constructor`, `concluir`, os gets `rotuloDaPrioridade` e `peso` e os métodos `situacao` e `prazoEmTexto`. O Concluir da tela funciona."
  - lesson: e19-heranca-e-composicao
    when: E19
    title: Recorrente e lista
    summary: "`TarefaRecorrente` com `extends` e `super`, `ListaDeTarefas`, `criarTarefa` e `resumo`. A tela inteira funciona."
  - lesson: e20-erros
    when: E20
    title: Erros próprios
    summary: "`ErroDeTarefa`, as conferências da tarefa e da lista e o `importar` com `try`/`catch`. A mensagem aparece embaixo do campo."
  - lesson: e21-codigo-que-espera
    when: E21
    title: Salvar e carregar
    summary: "`esperar`, `salvarTarefas` e `carregarTarefas`, com um armazenamento falso nos testes. As tarefas voltam ao recarregar."
  - lesson: e22-apis-com-fetch
    when: E22
    title: Exemplos da API e entrega
    summary: "`buscarExemplos` com `fetch` e uma resposta falsa nos testes, `converterTodo`, README com prints e o link entregue."
---

## O que você vai construir

Uma **lista de tarefas** que roda no navegador. Você escreve "Pagar a conta de luz", escolhe a prioridade e o prazo, e a lista mostra primeiro o que está atrasado, depois o que vence hoje, e assim por diante. Cada tarefa diz o prazo em palavras: "Atrasada há 2 dias", "Vence hoje", "Vence em 5 dias". A tarefa que se repete toda semana ganha a próxima sozinha quando você a conclui. Tudo fica salvo no navegador, e um botão traz tarefas de exemplo da internet.

Você constrói o projeto do E17 ao E22, em 6 etapas, uma por encontro. A etapa **é a prática da aula**: você faz a maior parte junto com o instrutor e termina sozinho a parte "Sua vez". Cada etapa usa só o que a aula dela ensinou. O E23 é de revisão e da Prova 1, e tem tempo para terminar o que faltar.

**A tela vem pronta.** Você não escreve HTML, CSS nem o código que mexe na página. O seu trabalho são as **regras** e as **classes**, em `src/`, com testes no Jest. A tela importa o que você escreveu e cresce com o projeto: a cada etapa pronta, uma parte nova passa a funcionar. No fim da página, a lista **O que a página usa** confere cada função e cada classe com os exemplos deste enunciado e diz o que ainda falta.

No celular, a página é uma coluna: o formulário em cima e as tarefas embaixo. No computador, o formulário, as tarefas de exemplo e a lista "O que a página usa" ficam à esquerda, e as tarefas à direita. A tarefa atrasada tem a borda vermelha; a concluída fica riscada.

### O kit

Baixe o [kit-tarefas.zip](materiais/projeto-3/kit-tarefas.zip). Ele traz:

| Arquivo | O que é |
|---|---|
| `package.json` e `package-lock.json` | a ficha do projeto, com o script `test` e o Jest; o lock trava as versões |
| `babel.config.json` | deixa o Jest entender `import` e `export` |
| `serve.json` | avisa ao navegador que busque sempre a versão nova dos seus arquivos |
| `web/` | a tela pronta: `index.html`, `estilo.css` e `tela.js`. Não mude nada nela |
| `src/utils/datas.js` | as datas do kit, prontas: `diasAte`, `somarDias`, `paraPrazo` e `ehDataValida` |
| `src/utils/datas.test.js` | os testes das datas do kit, que já passam |
| os outros arquivos de `src/` | vazios, com um comentário dizendo a etapa e o que entra em cada um |

Versões do kit: Jest 30.5.2, babel-jest 30.5.2 e @babel/preset-env 7.29.7. A tela abre com o `serve` 14 (`npx serve .`), o mesmo do E12.

### As datas do kit

Um **prazo** é sempre um texto `'AAAA-MM-DD'`, como `'2026-11-12'`, ou `null` quando a tarefa não tem prazo. As contas com datas vêm prontas em `src/utils/datas.js`: você só usa.

| Função | O que devolve | Exemplo |
|---|---|---|
| `diasAte(prazo, hoje)` | quantos dias faltam de hoje até o prazo; negativo quando já passou. A hora de hoje não conta | `diasAte('2026-11-15', hoje)` devolve `5` |
| `somarDias(prazo, dias)` | o prazo mais alguns dias, de novo em texto | `somarDias('2026-11-28', 7)` devolve `'2026-12-05'` |
| `paraPrazo(data)` | um `Date` em texto `'AAAA-MM-DD'` | `paraPrazo(new Date(2026, 10, 10))` devolve `'2026-11-10'` |
| `ehDataValida(texto)` | `true` se o texto é uma data de verdade no formato `'AAAA-MM-DD'` | `ehDataValida('10/11/2026')` devolve `false` |

### Estrutura final

```plaintext
lista-de-tarefas/
├── package.json, package-lock.json, babel.config.json, serve.json
├── .gitignore                  node_modules/
├── README.md                   o seu, na etapa 6
├── docs/                       os prints do README
├── web/                        a tela pronta do kit
└── src/
    ├── utils/datas.js          do kit, pronto
    ├── regras/prazos.js        etapa 1
    ├── modelos/Tarefa.js       etapa 2
    ├── modelos/TarefaRecorrente.js e ListaDeTarefas.js   etapa 3
    ├── modelos/ErroDeTarefa.js etapa 4
    ├── servicos/armazenamento.js   etapa 5
    └── servicos/exemplos.js    etapa 6
```

Cada arquivo seu tem o `.test.js` ao lado, na mesma pasta.

## As funções e as classes combinadas

Os nomes abaixo são fixos: a tela usa estes nomes, e o instrutor corrige por eles.

| Etapa | Arquivo | Nome | Recebe | Devolve |
|---|---|---|---|---|
| 1 | `regras/prazos.js` | `pesoDaPrioridade` | `prioridade` | `3`, `2`, `1` ou `0` |
| 1 | `regras/prazos.js` | `situacaoDoPrazo` | `prazo`, `hoje` | `'atrasada'`, `'vence-hoje'`, `'em-dia'` ou `'sem-prazo'` |
| 1 | `regras/prazos.js` | `proximoPrazo` | `prazo`, `frequencia`, `hoje` | o prazo da próxima vez, sempre depois de hoje |
| 1 | `regras/prazos.js` | `textoDoPrazo` | `prazo`, `hoje` | o prazo em palavras |
| 2 | `modelos/Tarefa.js` | `Tarefa` (`export default`) | `dados` | uma tarefa |
| 3 | `modelos/TarefaRecorrente.js` | `TarefaRecorrente` (`export default`) | `dados` | uma tarefa que se repete |
| 3 | `modelos/ListaDeTarefas.js` | `ListaDeTarefas` (`export default`) | nada | uma lista vazia |
| 3 | `modelos/ListaDeTarefas.js` | `criarTarefa` | `dados` | uma `TarefaRecorrente` ou uma `Tarefa` |
| 4 | `modelos/ErroDeTarefa.js` | `ErroDeTarefa` (`export default`) | `mensagem`, `campo` | um erro |
| 5 | `servicos/armazenamento.js` | `CHAVE`, `esperar`, `salvarTarefas`, `carregarTarefas` | veja a etapa 5 | |
| 6 | `servicos/exemplos.js` | `URL_DOS_EXEMPLOS`, `converterTodo`, `buscarExemplos` | veja a etapa 6 | |

O que as classes têm:

| Classe | Campos | Métodos e gets |
|---|---|---|
| `Tarefa` | `titulo`, `prioridade` (`'media'` quando não vem), `prazo` (`null` quando não vem), `concluida` (`false` quando não vem) | `concluir()`, `get rotuloDaPrioridade`, `get peso`, `situacao(hoje)`, `prazoEmTexto(hoje)`, `validar()` |
| `TarefaRecorrente extends Tarefa` | os da `Tarefa`, mais `frequencia` (`'semanal'` quando não vem, ou `'diaria'`) | `concluir(hoje)` sobrescrito |
| `ListaDeTarefas` | `tarefas` (uma lista), `proximoId` (começa em 1) | `adicionar(tarefa)`, `buscar(id)`, `concluir(id, hoje)`, `remover(id)`, `resumo(hoje)`, `importar(listaDeDados)` |
| `ErroDeTarefa extends Error` | `message`, `name` (`'ErroDeTarefa'`), `campo` (`'titulo'`, `'prioridade'`, `'prazo'` ou `null`) | os do `Error` |

### Exemplos que viram testes

Nos testes, **hoje é 10 de novembro de 2026**: `const HOJE = new Date(2026, 10, 10);` (o mês começa em 0). Cada linha das tabelas é um teste.

| `prazo` | `situacaoDoPrazo(prazo, HOJE)` | `textoDoPrazo(prazo, HOJE)` |
|---|---|---|
| `null` | `'sem-prazo'` | `'Sem prazo'` |
| `'2026-11-07'` | `'atrasada'` | `'Atrasada há 3 dias'` |
| `'2026-11-09'` | `'atrasada'` | `'Atrasada há 1 dia'` |
| `'2026-11-10'` | `'vence-hoje'` | `'Vence hoje'` |
| `'2026-11-11'` | `'em-dia'` | `'Vence amanhã'` |
| `'2026-11-15'` | `'em-dia'` | `'Vence em 5 dias'` |

- A hora de hoje não muda a resposta: às 23h59 do dia 10, o prazo `'2026-11-10'` ainda "vence hoje"
- `pesoDaPrioridade`: `'alta'` dá `3`, `'media'` dá `2`, `'baixa'` dá `1`, qualquer outra coisa dá `0`

| `proximoPrazo(prazo, frequencia, HOJE)` | Devolve | Por quê |
|---|---|---|
| `'2026-11-10'`, `'semanal'` | `'2026-11-17'` | 7 dias depois |
| `'2026-11-10'`, `'diaria'` | `'2026-11-11'` | 1 dia depois |
| `'2026-11-12'`, `'semanal'` | `'2026-11-19'` | concluída antes do prazo: 7 dias depois do prazo |
| `'2026-10-27'`, `'semanal'` | `'2026-11-17'` | o dia 3 já passou e o 10 é hoje: pula até ficar depois de hoje |
| `'2026-11-28'`, `'semanal'` | `'2026-12-05'` | a virada do mês |

| Código | Resultado |
|---|---|
| `new Tarefa({ titulo: 'Comprar ração do gato' })` | `prioridade` `'media'`, `prazo` `null`, `concluida` `false` |
| `rotuloDaPrioridade` de uma tarefa `'media'` | `'Média'` (e `'Alta'`, `'Baixa'`) |
| `peso` de uma tarefa `'alta'` | `3` |
| `situacao(HOJE)` com prazo `'2026-11-09'` / concluída | `'atrasada'` / `'concluida'` |
| `prazoEmTexto(HOJE)` com prazo `'2026-11-10'` / concluída | `'Vence hoje'` / `'Concluída'` |
| `concluir()` de uma `Tarefa` | marca `concluida` e devolve `null` |
| `concluir(HOJE)` de uma semanal com prazo `'2026-11-10'` | marca esta e devolve uma `TarefaRecorrente` nova, pendente, com prazo `'2026-11-17'` |
| `adicionar` duas tarefas numa lista nova | ids `1` e `2`; `adicionar` devolve a tarefa |
| `lista.concluir(1, HOJE)` com a semanal acima | a lista fica com 2 tarefas: a 1 concluída e a 2 com prazo `'2026-11-17'` |
| `resumo(HOJE)` com uma atrasada, uma em dia e uma concluída | `{ pendentes: 2, atrasadas: 1, concluidas: 1 }` |

### Erros

| Situação | `campo` | Mensagem |
|---|---|---|
| título vazio ou só com espaços | `'titulo'` | Escreva o título da tarefa. |
| título com menos de 3 letras (sem os espaços das pontas) | `'titulo'` | O título precisa de pelo menos 3 letras. |
| prioridade que não é `'alta'`, `'media'` nem `'baixa'` | `'prioridade'` | Escolha a prioridade: alta, média ou baixa. |
| prazo que não é uma data `'AAAA-MM-DD'` | `'prazo'` | Use uma data no formato AAAA-MM-DD. |
| tarefa que se repete sem prazo | `'prazo'` | Tarefa que se repete precisa de prazo. |
| título igual ao de uma tarefa **pendente** da lista, sem ligar para maiúsculas | `'titulo'` | Já existe uma tarefa pendente com esse título. |
| a API respondeu com erro | `null` | O servidor de exemplos respondeu 500. Tente mais tarde. (com o status que veio) |
| sem internet | `null` | Sem conexão com a internet. Confira e tente de novo. |

Todos são `ErroDeTarefa`. A tela usa o `campo` para escolher onde mostrar a mensagem: embaixo do título, da prioridade, do prazo ou no topo do formulário. O título é guardado sem os espaços das pontas. As mensagens podem ter outras palavras; o `campo`, não.

## Regras

- **Não mude a tela.** Os arquivos de `web/` e o `src/utils/datas.js` são do kit. Se a tela mostra algo errado, o problema está no seu código
- **Nada de `document` em `src/`.** As regras e as classes não sabem que existe uma página: é por isso que rodam no Jest
- **Hoje entra por parâmetro.** Toda função ou método que depende do dia recebe `hoje`. A tela passa `new Date()`; os testes passam `HOJE`, sempre fixo. Teste nenhum usa a data de verdade
- **Quem chama diz onde guardar e onde buscar.** `salvarTarefas` e `carregarTarefas` recebem o armazenamento; `buscarExemplos` recebe a função que busca. A tela passa o `localStorage` e o `fetch`; os testes passam um armazenamento falso e uma busca falsa. Teste nenhum usa o `localStorage` nem a internet
- **Use só o que o curso ensinou até o encontro da etapa.** Expressões regulares, campos com `#`, métodos `static`, setters e o DOM não fazem parte do projeto
- **Nenhum `if` pergunta o tipo da tarefa.** Concluir na lista chama o `concluir` da própria tarefa, e cada classe faz do seu jeito

## Etapas

Cada etapa começa onde a anterior terminou e termina com um **commit** cujo nome é `Projeto 3: etapa N, nome da etapa`, seguido do `git push`. Pode haver outros commits no meio; o da etapa marca o ponto em que ela ficou pronta.

Os passos "Juntos em aula" têm o código completo nos slides da aula do encontro. Quem faltou faz a etapa pelos slides e por este enunciado. Os "Sua vez" você faz sozinho; os slides trazem o enunciado e as dicas, sem a resposta.

Para ver a tela: na raiz do repositório, `npx serve .` e `http://localhost:3000/web/`. Salvou um arquivo? Recarregue a página. Para parar o servidor, Ctrl + C no terminal.

### Etapa 1 · E17: prazo e prioridade

**Juntos em aula:**

1. **O kit no GitHub.** Descompacte o kit, renomeie a pasta para `lista-de-tarefas` e abra no VS Code. `npm install` e `npm test`: os 9 testes das datas do kit passam. Crie o `.gitignore` com `node_modules/`, faça o primeiro commit, `Projeto 3: kit da lista de tarefas`, e envie para o repositório **público** `lista-de-tarefas` no GitHub, como no E05. Abra a tela: ela diz que falta o `pesoDaPrioridade`
2. **O peso da prioridade.** Em `src/regras/prazos.js`, `pesoDaPrioridade` com `switch` e `default`. Em `src/regras/prazos.test.js`, um `test.each` com as quatro prioridades da tabela
3. **A situação do prazo.** `situacaoDoPrazo`: o "sem prazo" sai logo, num retorno antecipado; o resto é uma cadeia de `else if` sobre `diasAte(prazo, hoje)`. Os testes da tabela, mais o das 23h59. A tela passa a mostrar as tarefas de demonstração, com as cores da situação
4. **O próximo prazo.** `proximoPrazo`: os dias da frequência (1 ou 7) com um ternário, e um `while` que soma mais um período enquanto a data nova não ficar depois de hoje. Os testes da tabela

**Sua vez:** `textoDoPrazo(prazo, hoje)`, com a tabela de exemplos. Um retorno antecipado para o sem prazo e uma cadeia de `else if` para atrasada, hoje, amanhã e os outros dias, com template string. "1 dia" ou "3 dias" é trabalho de um ternário. Os testes primeiro: os seis casos num `test.each`.

**Pronto quando:** `npm test` verde e, na tela, as tarefas de demonstração aparecem com o prazo em palavras ("Atrasada há 2 dias", "Vence hoje"). Na lista "O que a página usa", a Etapa 1 mostra 4 de 4.

**Commit:** `Projeto 3: etapa 1, prazo e prioridade`, e `git push`.

### Etapa 2 · E18: classe Tarefa

**Juntos em aula:**

1. **A forma da tarefa.** Em `src/modelos/Tarefa.js`, a classe `Tarefa` com `export default` e um `constructor(dados)` que guarda `titulo`, `prioridade`, `prazo` e `concluida`, com o `??` do E17 para os valores de quando não vêm. Em `Tarefa.test.js`, dois testes com `new Tarefa(...)`: a que recebe tudo e a que recebe só o título
2. **Concluir.** O método `concluir()`, que muda `this.concluida` para `true`, e o teste dele
3. **O rótulo da prioridade.** O `get rotuloDaPrioridade`, com `switch`: `'Alta'`, `'Média'` e `'Baixa'`. O teste, com `test.each`

**Sua vez:** o `get peso`, que devolve `pesoDaPrioridade(this.prioridade)`, e os métodos `situacao(hoje)` e `prazoEmTexto(hoje)`. Os dois respondem pela tarefa concluída (`'concluida'` e `'Concluída'`) e, senão, chamam as funções da etapa 1 com o prazo da tarefa: a regra continua num lugar só. Importe as três funções de `../regras/prazos.js`. Os testes da tabela, com `HOJE`.

**Pronto quando:** `npm test` verde e, na tela, as tarefas de demonstração são da sua classe: o botão Concluir risca a tarefa. A Etapa 2 mostra 6 de 6.

**Commit:** `Projeto 3: etapa 2, classe Tarefa`, e `git push`.

### Etapa 3 · E19: recorrente e lista

**Juntos em aula:**

1. **A tarefa que se repete.** Em `src/modelos/TarefaRecorrente.js`, `class TarefaRecorrente extends Tarefa`. O `constructor` chama `super(dados)` e guarda a `frequencia`. Os testes: ela tem tudo o que a tarefa tem, mais a frequência, e é semanal quando a frequência não vem
2. **Concluir, cada uma do seu jeito.** O `concluir()` da `Tarefa` passa a devolver `null`: a tarefa comum não gera outra. A `TarefaRecorrente` sobrescreve o `concluir(hoje)`: chama `super.concluir()` e devolve uma `TarefaRecorrente` nova, com o `proximoPrazo` da etapa 1. Os testes das duas
3. **A lista que guarda tarefas.** Em `src/modelos/ListaDeTarefas.js`, a classe `ListaDeTarefas`, com `this.tarefas` e `this.proximoId`, o `adicionar(tarefa)`, que dá o id e devolve a tarefa, e o `buscar(id)`, com `find`. Os testes
4. **Concluir e remover pela lista.** `concluir(id, hoje)` busca a tarefa, chama o `concluir` dela e, se veio uma próxima, adiciona. `remover(id)` com `filter`. A função `criarTarefa(dados)`, com `export`: `TarefaRecorrente` quando `dados.frequencia` vem preenchida, `Tarefa` nos outros casos. A tela inteira passa a funcionar: formulário, Concluir, Remover e a tarefa que se repete

**Sua vez:** o método `resumo(hoje)` da lista, que devolve `{ pendentes, atrasadas, concluidas }`, contados com `filter` e `length`. A atrasada conta só se estiver pendente. Teste com uma atrasada, uma em dia e uma concluída, e com a lista vazia.

**Pronto quando:** `npm test` verde e, na tela, concluir "Regar as plantas" (a semanal) faz aparecer outra, vencendo em 7 dias; o resumo no topo da lista acompanha. A Etapa 3 mostra 6 de 6.

**Commit:** `Projeto 3: etapa 3, recorrente e lista`, e `git push`.

### Etapa 4 · E20: erros próprios

**Juntos em aula:**

1. **O erro da tarefa.** Em `src/modelos/ErroDeTarefa.js`, `class ErroDeTarefa extends Error`, com `constructor(mensagem, campo = null)`, o `super(mensagem)`, o `name` e o `campo`. Os testes, com `toThrow`
2. **A tarefa recusa o título vazio.** O `constructor` da `Tarefa` guarda o título sem os espaços das pontas e chama `this.validar()`; o `validar()` lança um `ErroDeTarefa` com campo `'titulo'` quando o título fica vazio. O teste, com `toThrow` e a seta. Na tela, enviar o título vazio mostra a mensagem embaixo do campo
3. **A lista recusa o título repetido.** No `adicionar`, antes de dar o id: se já existe uma tarefa pendente com o mesmo título, sem ligar para maiúsculas (as pendentes com `filter`, a repetida com `some` e `toLowerCase`), lança o erro. Os testes
4. **Importar pulando o que tem problema.** O método `importar(listaDeDados)`: para cada dado, `try` com `adicionar(criarTarefa(dados))` e conta mais uma; no `catch`, pula o `ErroDeTarefa` e deixa passar qualquer outro erro. Devolve quantas entraram. O teste

**Sua vez:** as outras conferências da tabela "Erros". No `validar()`: título com menos de 3 letras, prioridade com peso `0` (o `pesoDaPrioridade` já sabe quais valem) e prazo que não é `null` nem uma data (o `ehDataValida` do kit). No `constructor` da `TarefaRecorrente`, depois do `super`: tarefa que se repete sem prazo. Um teste para cada, e o do título com 3 letras, que vale.

**Pronto quando:** `npm test` verde e, na tela, o título vazio, o título "ab", a semanal sem prazo e um título repetido mostram a mensagem embaixo do campo certo, sem entrar na lista. A Etapa 4 mostra 7 de 7.

**Commit:** `Projeto 3: etapa 4, erros próprios`, e `git push`.

### Etapa 5 · E21: salvar e carregar

**Juntos em aula:**

1. **Esperar.** Em `src/servicos/armazenamento.js`, `esperar(ms)`: uma Promise que termina depois de `ms` milissegundos, com `setTimeout`. Ela imita a demora de um servidor. O teste, com `async` e `await`
2. **Salvar.** `export const CHAVE = 'lista-de-tarefas'` e `salvarTarefas(lista, armazenamento)`, com `async`: espera 300 ms e grava `JSON.stringify(lista.tarefas)` com `armazenamento.setItem(CHAVE, texto)`. No teste, um **armazenamento falso**: uma classe com o mesmo `getItem` e `setItem` do `localStorage`, que guarda os textos num objeto. Na tela, cada mudança mostra "Salvando..." no topo
3. **Carregar.** `carregarTarefas(armazenamento)`, com `async`: espera, lê o texto da `CHAVE` (`'[]'` quando não há nada, com `??`), transforma com `JSON.parse` e devolve uma `ListaDeTarefas` nova com tudo importado. O teste salva e carrega de volta. Na tela, recarregar a página traz as tarefas de volta

**Sua vez:** o texto salvo pode estar quebrado. Com o `try`/`catch` do E20 em volta do `JSON.parse`, o texto quebrado vira uma lista vazia, sem erro. Três testes: a primeira visita (nada salvo) devolve a lista vazia; o texto `'{quebrado'` devolve a lista vazia; a tarefa que se repete volta com a `frequencia`.

**Pronto quando:** `npm test` verde, sem nenhum teste tocar no `localStorage` de verdade. Na tela, as tarefas continuam lá depois de recarregar, e o DevTools (aba Application, Local storage) mostra o texto salvo. A Etapa 5 mostra 4 de 4.

**Commit:** `Projeto 3: etapa 5, salvar e carregar`, e `git push`.

### Etapa 6 · E22: exemplos da API e entrega

A DummyJSON tem tarefas de exemplo, em inglês, em `https://dummyjson.com/todos?limit=10`:

```json
{
  "todos": [
    { "id": 1, "todo": "Do something nice for someone you care about", "completed": false, "userId": 152 },
    { "id": 2, "todo": "Memorize a poem", "completed": true, "userId": 13 }
  ],
  "total": 254,
  "skip": 0,
  "limit": 10
}
```

**Juntos em aula:**

1. **A API no navegador.** Abra o endereço no navegador e leia o JSON: a lista vem no campo `todos`. Em `src/servicos/exemplos.js`, `export const URL_DOS_EXEMPLOS` com o endereço
2. **Buscar.** `buscarExemplos(buscar)`, com `async`: `await buscar(URL_DOS_EXEMPLOS)`; se `resposta.ok` for falso, lança um `ErroDeTarefa` com o `status`; senão, `await resposta.json()` e devolve `dados.todos`. No teste, uma **resposta falsa** (uma classe com `ok`, `status` e `json()`) e uma função `buscar` falsa que a devolve: a resposta 200 e a 500, com `rejects.toThrow`
3. **Sem internet.** O `fetch` lança um erro quando o pedido nem chega ao servidor. Um `try`/`catch` em volta do `await buscar(...)` troca esse erro por um `ErroDeTarefa` em português. O teste, com uma busca falsa que lança. Na tela, Importar exemplos ainda não traz nada: os exemplos chegam em inglês, sem o campo `titulo`

**Sua vez:** `converterTodo(todo)` devolve `{ titulo, prioridade: 'media', prazo: null }`, com o `todo` da API no `titulo`. O `buscarExemplos` passa a devolver só as pendentes (`completed` falso), com `filter`, já convertidas, com `map`. Os testes: o `converterTodo` com um item da API e o `buscarExemplos` com uma resposta que tem uma concluída e uma pendente.

**README e entrega:** tire dois prints da tela (um em tamanho de celular, com o DevTools; outro no computador) e salve em `docs/`. Troque o README do kit pelo seu: o que o app faz, os dois prints, como rodar (`npm install` e `npx serve .`), como testar (`npm test`) e o que tem em cada arquivo de `src/`.

**Pronto quando:** `npm test` verde **com a internet desligada**. Na tela, Importar exemplos traz 5 tarefas novas; importar de novo diz que não há nenhuma nova; com o DevTools em Offline (aba Network), aparece a mensagem em português e o botão volta a funcionar. A lista "O que a página usa" mostra todas as etapas completas.

**Commit:** `Projeto 3: etapa 6, exemplos da API e entrega`, e `git push`.

## Como entregar

1. Repositório **público** `lista-de-tarefas` no seu GitHub, com tudo enviado (`git push`) e sem `node_modules/`
2. Os commits, na ordem: `Projeto 3: kit da lista de tarefas` e os das etapas 1 a 6
3. README com o que o app faz, os dois prints (as imagens ficam no repositório, em `docs/`), como rodar e como testar
4. Na página deste projeto, cole o link do repositório (`https://github.com/seu-usuario/lista-de-tarefas`) e envie
5. Prazo: **início do E24**

Antes de enviar, rode `npm test` com a internet desligada e abra a tela numa janela anônima (o `localStorage` começa limpo): adicione, conclua a semanal, remova, recarregue, importe duas vezes e envie o título vazio. O instrutor corrige pela rubrica, critério por critério, e pode devolver o projeto para ajustes antes da nota final. A aprovação é com 70 pontos.

## Como será avaliado

| Critério | Pontos | Nota cheia | Nota parcial |
|---|---|---|---|
| Regras e classes | 35 | as tabelas das funções e das classes dão o resultado certo, e a lista "O que a página usa" fica completa nas etapas 1 a 3 | a tarefa de amanhã "vence hoje", a próxima semanal nasce atrasada, ou um `if` pergunta se a tarefa é recorrente |
| Erros próprios | 15 | a tabela "Erros" inteira, com o `campo` certo, e o `importar` pulando só o `ErroDeTarefa` | a mensagem sempre no topo, nunca embaixo do campo, ou um `catch` que esconde qualquer erro |
| Salvar e importar | 15 | as tarefas voltam ao recarregar e o Importar funciona com e sem internet | as tarefas somem ao recarregar, ou importar duas vezes repete as tarefas |
| Testes | 20 | um teste por linha das tabelas, com `HOJE` fixo, armazenamento falso e resposta falsa | só o caminho feliz, ou um teste que usa a data de hoje ou a internet |
| Repositório, commits e README | 15 | o commit do kit e os 6 de etapa, e o README com os dois prints | todos os commits num dia só, ou README sem como rodar |

Um critério sem nada entregue vale zero. Código que você não sabe explicar também: o instrutor pode pedir, em aula, que você mostre um método e diga o que cada linha faz.

## Dúvidas frequentes

**O `npm test` falha logo depois de criar um arquivo de teste vazio.** O Jest reclama de arquivo `.test.js` sem nenhum `test`. Escreva o primeiro teste, ou apague o arquivo até a hora de usá-lo.

**Na instalação, o npm fala em vulnerabilidades.** São avisos sobre pacotes que o Jest usa por dentro e não afetam o projeto. Não rode `npm audit fix --force`: ele troca o Jest por uma versão antiga.

**Abri o `index.html` com dois cliques e a página não funciona.** O navegador só importa os arquivos de `src/` por um servidor. Rode `npx serve .` na raiz do repositório e abra `http://localhost:3000/web/`.

**A tela diz que não conseguiu importar um arquivo.** Rode `npm test`: um erro de sintaxe aparece lá com a linha. Confira também os imports, letra por letra, com o `.js` no fim (`'./Tarefa.js'`, e não `'./Tarefa'`).

**A tela diz que falta algo que eu escrevi.** Confira o nome letra por letra, o `export` (ou o `export default`, nas classes) e, nos gets, a palavra `get`.

**O teste da data passou hoje e falhou amanhã.** Ele usou o dia de verdade. Passe `HOJE` como parâmetro, sempre fixo.

**`toThrow` não pegou o erro.** O `expect` precisa receber uma função, com a seta: `expect(() => new Tarefa({ titulo: '' })).toThrow(...)`. Sem a seta, o erro estoura antes do `expect`.

**O Jest parou com `Received promise resolved instead of rejected` e um texto enorme.** Faltou o `await` antes do `expect(...).rejects`. Sem ele, o teste termina antes da Promise: quando o código está certo, passa sem conferir nada; quando está errado, o Jest para no meio.

**A tela diz `Failed to fetch dynamically imported module`, mas o `npm test` passa.** Um import sem o `.js` no fim: o Jest aceita `'./Tarefa'`, o navegador só aceita `'./Tarefa.js'`.

**As tarefas salvas sumiram.** O `npx serve` abriu em outra porta (3001, por exemplo), e cada endereço tem o seu `localStorage`. Feche o servidor antigo ou use o endereço novo.

**Quero começar a lista do zero.** No DevTools, aba Application, Local storage, apague a chave `lista-de-tarefas` e recarregue.

**"O servidor de exemplos respondeu 429."** A DummyJSON limita os pedidos por endereço, e a sala inteira sai pela mesma internet. Espere alguns segundos e tente de novo; os seus testes não dependem dela.

**Os exemplos vêm em inglês.** É uma API de testes: o `converterTodo` troca os nomes dos campos, não o texto.

**Faltei a um encontro.** Faça a etapa pelos slides da aula e por este enunciado antes do encontro seguinte: ele começa onde ela termina.

**Não terminei a tempo.** O E23 tem tempo para terminar. Entregue o que tiver até o início do E24: o instrutor corrige o que existe e pode devolver para ajustes.

## Para ir além

Nada aqui vale ponto extra. É para quem terminou e quer praticar mais.

- O título com no máximo 80 letras, com mais uma conferência no `validar()` e um teste com 81
- `lista.concluir(1, HOJE)` duas vezes na mesma semanal tenta criar a próxima de novo e, depois da etapa 4, lança o erro do título repetido. Um retorno antecipado no `concluir` da lista resolve: tarefa já concluída não faz nada. Escreva o teste primeiro
- Um método `pendentes()` na lista, que devolve só as tarefas pendentes, com teste
- No `carregarTarefas`, quantas tarefas salvas não puderam voltar, guardado num campo da lista
