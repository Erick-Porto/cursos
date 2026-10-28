---
title: "Projeto 4 · Livro de receitas"
summary: App React com Vite que busca receitas na DummyJSON, com busca, filtro por dificuldade, favoritas salvas e detalhe.
section: Módulo Específico
module: react
opens: e21a-por-que-react
due: e26a-mobile-e-react-native
due_label: início do E26
passing_score: 70
required: true
rubric:
  - key: componentes
    title: Componentes, props e listas
    points: 20
    description: "Um componente por arquivo em src/components, CartaoReceita recebe a receita inteira na prop receita, a lista sai de um map com key={receita.id} e cada componente tem o seu CSS Module."
  - key: estado
    title: Estado e eventos
    points: 20
    description: "Favoritar e desfavoritar, busca e filtro de dificuldade controlados e combinados, contador de favoritas certo (Nenhuma favorita, 1 favorita, 2 favoritas), estado sem mutação e lista filtrada calculada, sem useState a mais."
  - key: api
    title: Receitas da API
    points: 20
    description: "As receitas vêm da DummyJSON pelo useReceitas, com Carregando receitas..., erro com Tentar de novo, mensagem de busca sem resultado e uma requisição só quando a pessoa digita depressa."
  - key: hooks
    title: Hooks próprios e favoritas salvas
    points: 15
    description: "useDebounce, useReceitas e useFavoritos em src/hooks, chamados no topo dos componentes; as favoritas continuam marcadas depois do F5."
  - key: detalhe
    title: Detalhe da receita
    points: 10
    description: "Ver receita abre o detalhe com a ficha, os ingredientes e o modo de preparo; Voltar para a lista volta para a busca como estava."
  - key: entrega
    title: Repositório, README e lint
    points: 15
    description: "Repositório público sem node_modules, um commit por etapa com a mensagem pedida, README com como rodar e dois prints, npm run lint e console sem erros."
steps:
  - lesson: e21b-primeiro-projeto-vite
    when: E21
    title: Projeto Vite e cartão fixo
    summary: "Projeto livro-de-receitas com Vite, Cabecalho e um CartaoReceita fixo em JSX, README e push no GitHub."
  - lesson: e22b-listas-keys-estilos
    when: E22
    title: Lista com props e CSS Modules
    summary: "CartaoReceita({ receita }) e ListaReceitas com map e key sobre src/data/receitas.js, com CSS Modules."
  - lesson: e23b-formularios-controlados
    when: E23
    title: Favoritas, busca e filtro
    summary: "Favoritar com useState, busca controlada sem acento, filtro por dificuldade e contador de favoritas no Cabecalho."
  - lesson: e24b-hooks-proprios
    when: E24
    title: API e hooks próprios
    summary: "Receitas da DummyJSON pelo useReceitas (carregando, erro, vazio), busca com useDebounce e favoritas salvas pelo useFavoritos."
  - lesson: e25a-revisao-ambiente-react
    when: E25
    title: Detalhe, README e entrega
    summary: "DetalheReceita com ingredientes e modo de preparo, README com prints e o link do repositório na página do projeto."
---

## O que você vai construir

Um **livro de receitas** no navegador, feito em React com Vite. A pessoa procura uma receita pelo nome, filtra pela dificuldade, marca as favoritas e abre uma receita para ver os ingredientes e o modo de preparo.

```plaintext
+------------------------------------------+
|             Livro de Receitas            |
|  Receitas do mundo para cozinhar em casa |
|              ( 2 favoritas )             |
+------------------------------------------+
 Buscar [ pizza        ]  Dificuldade [Todas]

 +-------------------+  +-------------------+
 |      (foto)       |  |      (foto)       |
 | Classic Margherita|  | Italian Margherita|
 | Italian · 35 min  |  | Italian · 32 min  |
 | ( Fácil )         |  | ( Fácil )         |
 | [Ver receita]     |  | [Ver receita]     |
 | [Favorita]        |  | [Favoritar]       |
 +-------------------+  +-------------------+
```

O app cresce junto com as aulas, uma etapa por encontro, do E21 ao E25:

| Etapa | Encontro | O app ganha |
|---|---|---|
| 1 | E21 | o projeto Vite, o `Cabecalho` e um cartão fixo |
| 2 | E22 | a lista de receitas locais, com props e CSS Modules |
| 3 | E23 | favoritas, busca e filtro por dificuldade |
| 4 | E24 | as receitas da API, os hooks próprios e as favoritas salvas |
| 5 | E25 | o detalhe da receita, o README e a entrega |

:::info O laboratório e o projeto
O **Minhas Tarefas** é o laboratório: você constrói junto com a turma e vê cada conceito pela primeira vez. O **Livro de Receitas** é o seu projeto: os mesmos conceitos, aplicados por você em outro app. Não copie arquivos do `minhas-tarefas`; escreva cada componente de novo, pensando nas receitas.
:::

## A receita

Do começo ao fim, o app trabalha com receitas neste formato:

| Campo | Exemplo | O que é |
|---|---|---|
| `id` | `1` | número único |
| `nome` | `'Pizza margherita'` | nome da receita |
| `imagem` | `'https://cdn.dummyjson.com/recipe-images/1.webp'` | endereço da foto |
| `cozinha` | `'Italiana'` | origem do prato |
| `dificuldade` | `'facil'` | `'facil'`, `'media'` ou `'dificil'` |
| `tempoPreparo` | `20` | minutos |
| `tempoCozimento` | `15` | minutos (`0` quando vai cru) |
| `porcoes` | `4` | quantas pessoas serve |
| `nota` | `4.6` | de 0 a 5 |
| `ingredientes` | `['Massa de pizza', ...]` | lista de textos |
| `modoDePreparo` | `['Preaqueça o forno...', ...]` | passos, na ordem |

Nas etapas 2 e 3, as receitas vêm de um arquivo local com 8 receitas em português: [receitas.js](materiais/projeto-4/receitas.js). Na etapa 4, elas passam a vir da API **DummyJSON** (`https://dummyjson.com/recipes`), em inglês, e o seu código traduz os campos para este formato. Como o formato não muda, os componentes não mudam.

## Funcionalidades

Ao final, o app precisa fazer tudo isto:

1. **Cartão da receita**: foto (com `alt`), nome, cozinha, tempo total (preparo + cozimento), porções, nota e um selo com a dificuldade em português (Fácil, Média, Difícil), com uma cor para cada nível e o texto escrito, nunca só a cor.
2. **Lista**: um cartão por receita, gerado por `map`; sem receitas para mostrar, a mensagem "Nenhuma receita encontrada."
3. **Favoritas**: o botão do cartão alterna entre "Favoritar" e "Favorita", e o cartão favorito fica destacado. O cabeçalho mostra o total: "Nenhuma favorita", "1 favorita", "2 favoritas".
4. **Busca**: um campo de texto filtra pelo nome. Com os dados locais, sem diferenciar maiúsculas nem acentos; com a API, a busca vai para o servidor, uma vez por pausa na digitação.
5. **Filtro de dificuldade**: um seletor com Todas, Fácil, Média e Difícil, que combina com a busca.
6. **Estados da tela** (com a API): "Carregando receitas..." ao abrir; sem rede, "Não foi possível carregar as receitas." e um botão "Tentar de novo"; busca sem resultado, a mensagem com o termo procurado.
7. **Favoritas salvas**: depois do F5, as mesmas receitas continuam favoritas.
8. **Detalhe**: "Ver receita" abre a receita com a ficha completa, os ingredientes e o modo de preparo; "Voltar para a lista" volta.

Exemplos para conferir:

| Situação | O que aparece |
|---|---|
| Busca `LAMEN`, dados locais | só "Lámen japonês" |
| Busca `frango` e dificuldade Média, dados locais | "Fettuccine Alfredo com frango" e "Biryani de frango" |
| Dificuldade Difícil, dados locais | só "Moussaka grega" |
| 0, 1 e 3 receitas favoritas | "Nenhuma favorita", "1 favorita", "3 favoritas" |
| Busca `pizza`, API | duas receitas de pizza |
| Busca `frango`, API | Nenhuma receita encontrada para "frango". |
| API fora do ar | a mensagem de erro e o botão "Tentar de novo" |

## Etapas

Cada etapa cabe nos 15 minutos de projeto do encontro mais até uma hora em casa. Termine a etapa antes do encontro seguinte: o check-in do começo do bloco de projeto olha o commit dela.

### Etapa 1 · E21: projeto Vite e cartão fixo

1. Na pasta onde você guarda os projetos (fora do `lojinha-regras` e do `minhas-tarefas`), crie o projeto com os 4 comandos da aula 42, trocando o nome: `npm create vite@latest livro-de-receitas -- --template react --eslint`.
2. Limpe o modelo, como no laboratório: o `App` só com o que é seu, sem o contador nem os logos.
3. `src/components/Cabecalho.jsx`: um `<header>` com o título "Livro de Receitas" e uma frase sobre o app.
4. `src/components/CartaoReceita.jsx`: um cartão **fixo**, escrito direto no JSX, para a pizza margherita (a primeira receita da tabela acima): foto com `alt`, nome, cozinha, dificuldade e porções. O tempo total sai de uma expressão entre chaves, com duas constantes: `preparo` (20) e `cozimento` (15).
5. O `App` mostra o `Cabecalho` e o `CartaoReceita`.
6. `README.md`: o nome do app, uma frase sobre ele e como rodar (`npm install` e `npm run dev`).
7. `npm run lint` sem erros, repositório **público** `livro-de-receitas` no GitHub e push.

Commit: `Projeto 4: etapa 1, projeto Vite e cartão fixo`.

**Pronto quando:** `npm run dev` mostra o cabeçalho e o cartão com a foto e "35 min"; o repositório está no GitHub sem `node_modules`.

### Etapa 2 · E22: lista com props e CSS Modules

1. Abra [receitas.js](materiais/projeto-4/receitas.js), salve com <kbd>Ctrl</kbd> + <kbd>S</kbd> e coloque em `src/data/receitas.js`. Ele exporta `receitas`, um array com 8 receitas.
2. `src/utils/receitas.js`, só com funções puras (como as do `lojinha-regras`): `tempoTotal(receita)` e `rotuloDificuldade(dificuldade)`.
3. `CartaoReceita({ receita })`: o cartão recebe a receita **inteira** em uma prop só e lê os campos com desestruturação. O selo da dificuldade usa `rotuloDificuldade`; o tempo, `tempoTotal`.
4. `src/components/ListaReceitas.jsx`: recebe `receitas`, gera um `CartaoReceita` por item com `key={receita.id}` e mostra "Nenhuma receita encontrada." quando o array vem vazio.
5. Estilos em CSS Modules: `CartaoReceita.module.css` (cartão, foto, selo e uma classe para cada dificuldade), `ListaReceitas.module.css` (a grade de cartões) e `Cabecalho.module.css`. O `index.css` fica só com fonte e fundo.
6. O `App` importa as receitas e passa para a `ListaReceitas`.

```javascript
tempoTotal({ tempoPreparo: 20, tempoCozimento: 15 }) // 35
rotuloDificuldade('media')                           // 'Média'
rotuloDificuldade('Hard')                            // 'Não informada'
```

```jsx
<ListaReceitas receitas={receitas} />
<CartaoReceita receita={receitas[0]} />
```

Commit: `Projeto 4: etapa 2, lista com props e CSS Modules`.

**Pronto quando:** 8 cartões na tela, cada selo com a sua cor e o seu texto, nenhum aviso de `key` no console e, trocando `receitas` por `[]` no `App`, a mensagem de lista vazia (depois, desfaça).

### Etapa 3 · E23: favoritas, busca e filtro

1. No `App`, três estados: `busca` (começa `''`), `dificuldade` (começa `'todas'`) e `favoritas`, um array com os **ids** das receitas favoritas (começa `[]`).
2. `alternarFavorita(id)` no `App`: tira o id se ele está no array, põe se não está. Sem `push` nem `splice`: as receitas do E23 (spread e `filter`).
3. `src/components/Filtros.jsx`: o campo de busca e o seletor de dificuldade, os dois **controlados**. O estado mora no `App`; o `Filtros` recebe os valores e as funções que os trocam por props: `busca`, `onMudarBusca`, `dificuldade` e `onMudarDificuldade`.
4. Em `src/utils/receitas.js`: `buscarPorNome(receitas, busca)`, que ignora maiúsculas e acentos (traga o `semAcentos` do `lojinha-regras`, do E06), e `filtrarPorDificuldade(receitas, dificuldade)`, em que `'todas'` devolve todas.
5. A lista que vai para a tela é **calculada** a partir das receitas, da busca e da dificuldade, antes do `return`. Ela não ganha um `useState` próprio.
6. `CartaoReceita` recebe também `favorita` (booleano) e `onFavoritar`: o botão mostra "Favoritar" ou "Favorita" e avisa o `App` com o id da receita; o cartão favorito ganha uma classe de destaque.
7. `Cabecalho` recebe `totalFavoritas` e mostra "Nenhuma favorita", "1 favorita" ou "N favoritas".

```javascript
buscarPorNome(receitas, 'LAMEN')           // [ a receita 'Lámen japonês' ]
buscarPorNome(receitas, '')                // as 8 receitas
filtrarPorDificuldade(receitas, 'dificil') // [ a receita 'Moussaka grega' ]
filtrarPorDificuldade(receitas, 'todas')   // as 8 receitas
```

:::tip Estado ou cálculo?
A lista filtrada e o total de favoritas saem de estados que já existem. Valor que dá para calcular não vira estado: assim ele nunca fica desatualizado.
:::

Commit: `Projeto 4: etapa 3, favoritas, busca e filtro`.

**Pronto quando:** os exemplos da tabela de Funcionalidades marcados como "dados locais" funcionam, o contador acompanha cada clique e o console está limpo.

### Etapa 4 · E24: API e hooks próprios

1. `src/api/receitas.js` com duas funções:
   - `traduzirReceita(item)`: recebe uma receita da API e devolve uma receita no formato do app (tabela abaixo). A dificuldade vem em inglês: `'Easy'` vira `'facil'`, `'Medium'` vira `'media'` e `'Hard'` vira `'dificil'`.
   - `buscarReceitas(busca, sinal)`: faz o `fetch` de `https://dummyjson.com/recipes/search?q=TERMO&limit=12`, com o termo sem espaços nas pontas e protegido por `encodeURIComponent`; confere `resposta.ok`; devolve as receitas já traduzidas. Atenção: a lista vem dentro de `dados.recipes`.
2. `src/hooks/useDebounce.js`: o hook da aula 48. Ele é genérico; pode escrevê-lo igual ao da aula.
3. `src/hooks/useReceitas.js`: `useReceitas(busca)` devolve `{ receitas, carregando, erro, recarregar }`. O efeito busca ao montar e a cada busca nova, e a limpeza cancela o pedido anterior com `AbortController`.
4. `src/hooks/useFavoritos.js`: `useFavoritos()` devolve `{ favoritas, alternarFavorita }`. As favoritas começam com o que estiver salvo: leia o `localStorage` no valor inicial do `useState`, não num efeito. Um efeito salva as favoritas sempre que elas mudam.
5. No `App`: `busca` passa pelo `useDebounce(busca, 300)` e a busca atrasada vai para o `useReceitas`. Enquanto as duas são diferentes, o `Filtros` mostra "Buscando...". A dificuldade continua filtrando no navegador, sobre o que a API devolveu.
6. Os estados da tela: "Carregando receitas..."; o erro com o botão "Tentar de novo", que chama `recarregar`; e, sem resultado, `Nenhuma receita encontrada para "TERMO".`
7. O `App` fica sem `useEffect` e sem `fetch`. O `src/data/receitas.js` e o `buscarPorNome` deixam de ser usados: pode apagar.

| Na API | No app |
|---|---|
| `name` | `nome` |
| `image` | `imagem` |
| `cuisine` | `cozinha` |
| `difficulty` | `dificuldade`, traduzida |
| `prepTimeMinutes` e `cookTimeMinutes` | `tempoPreparo` e `tempoCozimento` |
| `servings` e `rating` | `porcoes` e `nota` |
| `ingredients` e `instructions` | `ingredientes` e `modoDePreparo` |

O `localStorage`, que você usou no Projeto 3, guarda **texto** no navegador. Por isso o `JSON.stringify` do E06 na ida e o `JSON.parse` na volta:

```javascript
localStorage.setItem('livro-de-receitas:favoritas', JSON.stringify([1, 16]))
JSON.parse(localStorage.getItem('livro-de-receitas:favoritas') ?? '[]') // [1, 16]
```

Sem nada salvo, `getItem` devolve `null` e o `??` do E13 troca por `'[]'`. Se o que estiver salvo não for um JSON válido, o `JSON.parse` lança: com o `try/catch` do E17, comece com `[]` em vez de quebrar o app.

Commit: `Projeto 4: etapa 4, API, hooks próprios e favoritas salvas`.

**Pronto quando:** o app abre com 12 receitas da API depois de "Carregando receitas..."; `pizza` digitado depressa gera uma requisição só na aba Rede; sem rede, aparecem o erro e o "Tentar de novo"; marque duas favoritas, aperte F5 e elas continuam lá; `npm run lint` sem erros.

### Etapa 5 · E25: detalhe, README e entrega

1. `src/components/DetalheReceita.jsx` e o seu CSS Module: botão "Voltar para a lista", foto, nome, a ficha (cozinha, dificuldade, preparo, cozimento, porções e nota), "Ingredientes" em uma lista `<ul>` e "Modo de preparo" em uma lista numerada `<ol>`.
2. `CartaoReceita` ganha o botão "Ver receita", que avisa o `App` com o id (prop `onAbrir`).
3. No `App`, um estado com o id da receita aberta (`null` quando nenhuma está aberta). Com uma receita aberta, o detalhe aparece no lugar dos filtros e da lista; "Voltar para a lista" põe `null` de novo. Todos os hooks continuam no topo, antes de qualquer `return`.
4. README completo: o que o app faz, como rodar, os limites (a API é de testes e está em inglês) e dois prints, da lista e do detalhe, em uma pasta `docs/`.
5. Cole o link do repositório na página deste projeto.

Nas listas do detalhe, a `key` do ingrediente pode ser o próprio texto. No modo de preparo, o índice serve: a lista nunca muda de ordem nem perde itens (aula 44).

Commit: `Projeto 4: etapa 5, detalhe da receita e README`.

**Pronto quando:** "Ver receita" e "Voltar para a lista" funcionam, a busca e o filtro continuam como estavam ao voltar, e o README mostra os dois prints no GitHub.

## Como entregar

- **Repositório**: público, chamado `livro-de-receitas`, no seu GitHub, com o `.gitignore` que o Vite cria (sem `node_modules`).
- **Commits**: um por etapa, com as mensagens acima. Commits a mais entre as etapas são bem-vindos.
- **README**: o que o app faz, como rodar (`npm install` e `npm run dev`) e os dois prints.
- **Na plataforma**: na página deste projeto, cole o link do repositório. Se você publicou o app (veja "Para ir além"), cole também o link de demonstração.
- **Prazo**: início do E26. Pode colar o link antes; enquanto o instrutor não corrigir, você pode trocá-lo.
- **Depois da correção**: o instrutor pode devolver para ajustes, com um comentário por critério. Corrija, faça um commit e envie de novo pela mesma página.

## Como será avaliado

Nota mínima para aprovação: 70 de 100. O instrutor abre o seu repositório, roda `npm install`, `npm run lint` e `npm run dev` e usa o app.

| Critério | Pontos | Nota cheia | Exemplo de nota parcial |
|---|---|---|---|
| Componentes, props e listas | 20 | um componente por arquivo, `CartaoReceita({ receita })`, `key={receita.id}`, CSS Modules | cartões certos, mas `key={i}` ou estilos todos no `index.css` |
| Estado e eventos | 20 | favoritar, busca e filtro combinados, contador certo, nada mutado | filtro que ignora a busca, ou contador "1 favoritas" |
| Receitas da API | 20 | carregando, erro com "Tentar de novo", vazio com o termo, uma requisição por pausa | funciona com rede, mas fica em "Carregando receitas..." para sempre sem ela |
| Hooks próprios e favoritas salvas | 15 | três hooks em `src/hooks`, no topo, favoritas depois do F5 | hooks certos, mas as favoritas somem no F5 |
| Detalhe da receita | 10 | ficha, ingredientes, modo de preparo e voltar | detalhe sem o modo de preparo |
| Repositório, README e lint | 15 | 5 commits com as mensagens, README com prints, lint e console limpos | um commit só no último dia, ou README sem como rodar |

:::warning Você precisa saber explicar
Na correção, o instrutor pode pedir que você explique uma parte do seu código, como o efeito do `useReceitas` ou o `alternarFavorita`. Código que você não consegue explicar não conta como seu.
:::

## Para ir além

Opcional e sem ponto extra; faça só com as cinco etapas prontas.

- Um filtro "Só favoritas", que combina com a busca e a dificuldade.
- Favoritar também pelo detalhe.
- O título da aba com o nome da receita aberta, com um hook como o `useTituloDaAba` da aula 48.
- Um botão "Limpar busca".
- "Mostrando 12 de 50 receitas", com o campo `total` que a API devolve.
- Publicar o app (Vercel, Netlify ou GitHub Pages) e colar o link de demonstração na entrega.

## Dúvidas frequentes

**Posso começar do `minhas-tarefas` e trocar os nomes?** Não. Crie o projeto com o Vite e escreva os componentes pensando nas receitas. Copiar a estrutura do laboratório é o primeiro sinal de cópia que o instrutor procura.

**Na etapa 4, `frango` não acha nada.** A API está em inglês: busque `chicken`, `pasta` ou `salad`. Os nomes e a cozinha das receitas também chegam em inglês; só a dificuldade é traduzida pelo app.

**O filtro "Difícil" ficou vazio na etapa 4.** A DummyJSON não tem receitas difíceis. A mensagem de lista vazia aparece, e está certo. Com os dados locais, a moussaka é difícil.

**Aparecem duas requisições ao abrir, no `npm run dev`.** É o `StrictMode` (aula 47): a primeira aparece cancelada. No `npm run build` é uma só.

**O lint reclama de `'erro' is defined but never used` no `catch`.** Quando você não usa o erro, escreva o `catch` sem a variável: `catch { return [] }`.

**Cliquei em "Favoritar" e a página recarregou.** O botão está dentro de um `<form>`. Os filtros não precisam de formulário; se usar um, dê `type="button"` aos botões.

**As favoritas sumiram.** O `localStorage` é separado por endereço: `localhost:5173` (`npm run dev`) e `localhost:4173` (`npm run preview`) guardam favoritas diferentes. Limpar os dados do navegador também apaga.

**Preciso de outra biblioteca para o detalhe?** Não. O detalhe é um estado no `App`, como o filtro. A navegação entre telas chega no E36, com o Expo Router.

**As fotos não aparecem.** Elas vêm do site da DummyJSON e precisam de internet. Sem rede, o texto do `alt` aparece no lugar.

**Atrasei uma etapa.** A nota é da entrega final, mas os commits contam a história do projeto: faça a etapa atrasada antes da seguinte, com a mensagem dela.
