---
title: "Projeto 4 · Livro de receitas"
summary: App React com Vite que mostra receitas da DummyJSON em cartões, com busca, favoritas, carregando e erro.
section: Módulo Específico
module: react
opens: e24-react-e-o-primeiro-componente
due: e29-react-native-e-expo
due_label: início do E29
passing_score: 70
required: true
rubric:
  - key: componentes
    title: Seus componentes
    points: 25
    description: "CartaoReceita e BotaoFavorito em src/components, cada um no seu arquivo, com export default. O cartão recebe nome, foto, cozinha, minutos, dificuldade, porcoes, nota, favorita e aoFavoritar por props e usa a Etiqueta do kit; o botão recebe ativo e aoClicar e mostra Favoritar ou Favorita."
  - key: lista-e-busca
    title: Lista e busca
    points: 20
    description: "A lista sai de um map com key={receita.id}, sem aviso de key no console. A busca usa o CampoBusca do kit com um estado no App, filtra pelo nome sem diferenciar maiúsculas e mostra a ListaVazia quando nada passa."
  - key: favoritas
    title: Favoritas
    points: 15
    description: "Clicar marca e clicar de novo desmarca, sem push nem splice; o cabeçalho mostra Nenhuma favorita, 1 favorita ou 2 favoritas; a marca continua depois de buscar e apagar a busca."
  - key: api
    title: Receitas da API
    points: 25
    description: "As receitas vêm de https://dummyjson.com/recipes num useEffect com []; Carregando aparece enquanto a resposta não chega; sem internet, aparece a MensagemErro e a tela não fica presa em Carregando."
  - key: entrega
    title: Repositório e README
    points: 15
    description: "Repositório público sem node_modules, o commit do kit e um commit por etapa com a mensagem pedida, README com o que o app faz, como rodar e um print."
steps:
  - lesson: e24-react-e-o-primeiro-componente
    when: E24
    title: Kit rodando e cartão fixo
    summary: "O kit no VS Code com npm run dev, o CartaoReceita fixo da pizza, com o tempo entre chaves e a Etiqueta, e o repositório no GitHub."
  - lesson: e25-props-e-listas
    when: E25
    title: Cartão com props e a lista
    summary: "O CartaoReceita recebe props, o seu nome vai para o Rodape e as 8 receitas locais viram cartões com map e key."
  - lesson: e26-estado-e-eventos
    when: E26
    title: Busca e favoritas
    summary: "O estado da busca com o CampoBusca, a lista filtrada com a ListaVazia, o BotaoFavorito e as favoritas no App, com o total no cabeçalho."
  - lesson: e27-efeitos-e-dados-da-api
    when: E27
    title: Receitas da API e entrega
    summary: "As receitas da DummyJSON num useEffect, com Carregando e MensagemErro, o README com print e o link na plataforma."
---

## O que você vai construir

Um **livro de receitas** no navegador, feito em React. A tela mostra cada receita num cartão, com foto, tempo, porções, nota e dificuldade. A pessoa procura uma receita pelo nome e marca as favoritas. No fim, as receitas vêm de uma API de verdade, a **DummyJSON**.

```plaintext
+--------------------------------------------------------+
| Livro de Receitas                       ( 1 favorita ) |
| Receitas do mundo para cozinhar em casa                |
+--------------------------------------------------------+
  Buscar receita
  (                                        )

  +------------------------+  +------------------------+
  |         (foto)         |  |         (foto)         |
  | Pizza margherita       |  | Brigadeiro             |
  | Italiana, 35 minutos   |  | Brasileira, 30 minutos |
  | 4 porções, nota 4.6    |  | 8 porções, nota 4.2    |
  | (Fácil)     [Favorita] |  | (Fácil)    [Favoritar] |
  +------------------------+  +------------------------+
```

Você não começa do zero. O projeto vem num **kit**: um projeto React pronto para rodar, com o cabeçalho, o rodapé, o campo de busca, os avisos e todo o CSS. Você escreve **dois componentes**, o `CartaoReceita` e o `BotaoFavorito`, e a tela no `src/App.jsx`. Cada etapa é feita em aula: primeiro junto com o instrutor, depois um trecho sozinho, o **Sua vez**.

| Etapa | Encontro | O app ganha |
|---|---|---|
| 1 | E24 | o kit rodando e o seu primeiro componente, um cartão fixo |
| 2 | E25 | o cartão com props e a lista das 8 receitas locais |
| 3 | E26 | a busca e o botão de favorito |
| 4 | E27 | as receitas da API, os avisos de carregando e de erro, o README e a entrega |

O E28 é de revisão e da Prova 2. O prazo de entrega é o **início do E29**.

## O kit

Baixe o kit aqui: [kit-receitas.zip](materiais/projeto-4/kit-receitas.zip). Ele traz React 19.3.1, Vite 8.3.5 e @vitejs/plugin-react 6.2.1; o `package-lock.json` garante as mesmas versões em todos os computadores.

### Componentes do kit

As peças prontas ficam em `src/components/`. Você as usa com `import`, sem mudar nada dentro delas. O comentário no topo de cada arquivo repete o que está nesta tabela.

| Componente | Props | O que mostra |
|---|---|---|
| `Cabecalho` | `totalFavoritas` (opcional): um número | o nome do app e, se receber o número, "Nenhuma favorita", "1 favorita" ou "2 favoritas" |
| `Rodape` | `autor` (opcional): o seu nome | "Feito por" com o seu nome e o crédito da DummyJSON |
| `CampoBusca` | `valor`: o texto do campo; `aoMudar`: a função chamada a cada letra | o campo "Buscar receita" |
| `Etiqueta` | `dificuldade`: `'Easy'`, `'Medium'` ou `'Hard'` | a etiqueta Fácil (verde), Média (amarela) ou Difícil (vermelha) |
| `ListaVazia` | `busca`: o texto buscado | `Nenhuma receita encontrada para "xyz".` |
| `Carregando` | nenhuma | "Carregando receitas...", com um círculo girando |
| `MensagemErro` | `texto`: a mensagem | a caixa vermelha de erro, com a dica de apertar F5 |

O CSS também vem pronto, em `src/styles/`. No seu JSX, você só escreve o nome da classe:

| Classe | Onde vai |
|---|---|
| `conteudo` e `grade` | no `<main>` e na `<div>` que arruma os cartões lado a lado |
| `cartao`, `cartao__foto`, `cartao__corpo` | no `<article>` do cartão, na `<img>` e na `<div>` com os textos |
| `cartao__nome`, `cartao__info`, `cartao__rodape` | no `<h2>` do nome, em cada `<p>` de informação e na `<div>` do fim |
| `favorito` e `favorito--ativo` | no `<button>`; as duas juntas quando a receita é favorita |

### Os dois componentes que você cria

| Componente | Arquivo | Props | O que mostra |
|---|---|---|---|
| `CartaoReceita` | `src/components/CartaoReceita.jsx` | `nome`, `foto`, `cozinha`, `minutos`, `dificuldade`, `porcoes`, `nota`, `favorita`, `aoFavoritar` | a foto, o nome, "Italiana, 35 minutos", "4 porções, nota 4.6", a `Etiqueta` e o `BotaoFavorito` |
| `BotaoFavorito` | `src/components/BotaoFavorito.jsx` | `ativo` (sim ou não) e `aoClicar` (função) | "Favoritar" com o coração vazio ou "Favorita" com o coração cheio |

Na etapa 1, o cartão ainda não recebe props: tudo nele é fixo. As props entram na etapa 2, e as duas últimas, `favorita` e `aoFavoritar`, na etapa 3.

### A receita

O arquivo `src/data/receitas.js` do kit traz 8 receitas no mesmo formato da DummyJSON. Os nomes dos campos estão em inglês, como a API manda; os textos estão em português.

| Campo | Exemplo | O que é |
|---|---|---|
| `id` | `1` | número único |
| `name` | `'Pizza margherita'` | nome da receita |
| `image` | `'https://cdn.dummyjson.com/recipe-images/1.webp'` | endereço da foto |
| `cuisine` | `'Italiana'` | de onde é o prato |
| `difficulty` | `'Easy'` | `'Easy'`, `'Medium'` ou `'Hard'` |
| `prepTimeMinutes` e `cookTimeMinutes` | `20` e `15` | minutos de preparo e de fogo ou forno |
| `servings` e `rating` | `4` e `4.6` | porções e nota, de 0 a 5 |

Como o formato é o mesmo, na etapa 4 você troca de onde as receitas vêm, e o resto do código continua igual.

## Funcionalidades

Ao final, o app faz tudo isto:

1. **Cartão**: foto com `alt`, nome, cozinha, tempo total (preparo mais cozimento), porções, nota, a `Etiqueta` da dificuldade e o botão de favorito.
2. **Lista**: um cartão por receita, gerado por `map`.
3. **Busca**: o campo filtra pelo nome, sem diferenciar maiúsculas de minúsculas. Sem nenhuma receita na busca, a `ListaVazia`.
4. **Favoritas**: o botão alterna entre "Favoritar" e "Favorita"; o cabeçalho mostra o total. Buscar e apagar a busca não apaga as marcas.
5. **Receitas da API**: ao abrir, "Carregando receitas..." e, depois, as 30 receitas de `https://dummyjson.com/recipes`.
6. **Erro**: sem internet, "Não foi possível carregar as receitas.", e a tela não fica presa em "Carregando receitas...".

Exemplos para conferir:

| Situação | O que aparece |
|---|---|
| Etapa 3, busca `frango` ou `FRANGO` | "Fettuccine Alfredo com frango" e "Biryani de frango" |
| Etapa 3, busca `xyz` | `Nenhuma receita encontrada para "xyz".` |
| 0, 1 e 2 receitas favoritas | "Nenhuma favorita", "1 favorita", "2 favoritas" |
| Etapa 4, ao abrir | "Carregando receitas..." e depois 30 cartões, com os nomes em inglês |
| Etapa 4, busca `chicken` | 5 receitas, todas com "Chicken" no nome |
| Etapa 4, sem internet | "Não foi possível carregar as receitas." |

## Etapas

Cada etapa é feita no encontro dela. **Juntos em aula** é o que a turma faz com o instrutor, com o código nos slides. **Sua vez** é o trecho que você faz sozinho, em aula, sem a resposta no slide. Se você faltou, faça a etapa com os slides da aula e com este enunciado antes do encontro seguinte: cada etapa começa exatamente onde a anterior terminou.

### Etapa 1 · E24: kit rodando e cartão fixo

**Juntos em aula**

:::steps
1. Baixe o [kit-receitas.zip](materiais/projeto-4/kit-receitas.zip), extraia na pasta dos seus projetos e renomeie a pasta `kit-receitas` para `livro-de-receitas`. No terminal, entre nela com `cd` e abra o VS Code com `code .`.
2. No terminal do VS Code: `npm install` (uma vez só) e `npm run dev`. Abra `http://localhost:5173`: aparecem o cabeçalho, o aviso "O seu cartão de receita aparece aqui." e o rodapé.
3. O kit no Git: crie o arquivo `.gitignore` com duas linhas, `node_modules/` e `dist/`. Depois, `git init`, `git add .` e `git commit -m "Kit do livro de receitas"`.
4. O primeiro componente: crie `src/components/CartaoReceita.jsx` com um `<article className="cartao">`, a foto da pizza (`cartao__foto`, com `alt`), o nome "Pizza margherita" (`cartao__nome`) e o `export default`. No `App.jsx`, importe o cartão e troque o aviso por `<div className="grade">` com o `<CartaoReceita />` dentro.
5. O tempo entre chaves: no cartão, duas constantes, `preparo` (20) e `cozimento` (15), e a linha `Italiana, {preparo + cozimento} minutos` num `<p className="cartao__info">`.
:::

**Sua vez**

Complete o cartão fixo:

- uma segunda linha de informação, "4 porções, nota 4.6", com duas constantes novas, `porcoes` e `nota`, entre chaves;
- a `Etiqueta` do kit, com a dificuldade da pizza, `"Easy"`, dentro de uma `<div className="cartao__rodape">` no fim do corpo do cartão.

Dicas: o comentário no topo de `src/components/Etiqueta.jsx` mostra como usá-la. O `CartaoReceita` e a `Etiqueta` estão na mesma pasta, então o caminho do `import` começa com `./`.

**Pronto quando:** `npm run dev` mostra um cartão com a foto da pizza, "Pizza margherita", "Italiana, 35 minutos", "4 porções, nota 4.6" e a etiqueta verde "Fácil", e o Console do navegador (F12) não tem mensagem vermelha.

**Commit e push:** `Projeto 4: etapa 1, kit e cartão fixo`. Crie no GitHub o repositório **público** `livro-de-receitas`, ligue com o `git remote add origin` que o GitHub mostra e faça o `git push`.

### Etapa 2 · E25: cartão com props e a lista

**Juntos em aula**

:::steps
1. O seu nome no rodapé: no `App`, `<Rodape autor="Seu Nome" />`, com o seu nome.
2. O cartão recebe props: o `CartaoReceita` recebe `nome`, `foto`, `cozinha`, `minutos` e `dificuldade` (desestruturadas no parâmetro) e usa cada uma no lugar do texto fixo. As constantes `preparo` e `cozimento` saem. No `App`, importe as receitas (`import { receitas } from './data/receitas.js'`) e monte dois cartões, um com `receitas[0]` (a pizza) e outro com `receitas[7]` (o brigadeiro).
3. A lista com `map`: troque os dois cartões por `receitas.map(...)`, que devolve um `CartaoReceita` por receita, com `key={receita.id}`.
:::

**Sua vez**

Repare: os 8 cartões mostram "4 porções, nota 4.6", que são da pizza. Transforme `porcoes` e `nota` em props do cartão e, no `map`, passe as porções e a nota de cada receita.

Dicas: o nome da prop precisa ser igual nos dois lados, na tag do `App` e na lista de props do cartão. A tabela "A receita", acima, diz em que campo está cada informação.

**Pronto quando:** aparecem 8 cartões; o brigadeiro mostra "Brasileira, 30 minutos" e "8 porções, nota 4.2"; a moussaka tem a etiqueta vermelha "Difícil"; o rodapé mostra o seu nome; e o Console não tem o aviso `Each child in a list should have a unique "key" prop`.

**Commit e push:** `Projeto 4: etapa 2, cartão com props e lista`.

### Etapa 3 · E26: busca e favoritas

**Juntos em aula**

:::steps
1. O estado da busca: no `App`, `import { useState } from 'react'` e `const [busca, setBusca] = useState('')`. Acima da grade, o campo do kit: `<CampoBusca valor={busca} aoMudar={setBusca} />`. Para ver o estado mudando, uma linha provisória: `<p>Você buscou: {busca}</p>`.
2. A lista filtrada: `visiveis` sai de um `filter` sobre as receitas, que deixa passar quem tem a busca no nome (`includes`, com `toLowerCase` nos dois lados), e o `map` passa a percorrer `visiveis`. Com `let conteudo` e `if`/`else`: sem nenhuma receita visível, `<ListaVazia busca={busca} />`; com receitas, a grade. Apague a linha provisória.
3. O segundo componente: crie `src/components/BotaoFavorito.jsx`, que recebe `ativo` e `aoClicar`. Com `ativo`, a classe `favorito favorito--ativo` e o texto "Favorita"; sem, `favorito` e "Favoritar"; o clique chama `aoClicar`. O cartão recebe `favorita` e `aoFavoritar` e passa ao botão, dentro do `cartao__rodape`. No `App`, por enquanto, `favorita={false}` e um `aoFavoritar` que escreve no Console o nome da receita.
4. As favoritas no estado: `const [favoritas, setFavoritas] = useState([])`, a lista com os ids das favoritas. A função `alternarFavorita(id)` põe o id na lista com o spread do E15. No `map`: `favorita={favoritas.includes(receita.id)}` e `aoFavoritar={() => alternarFavorita(receita.id)}`.
:::

**Sua vez**

- Clicar de novo desmarca: se o id já está na lista, `alternarFavorita` tira; se não está, põe. Sem `push` nem `splice`.
- O cabeçalho conta as favoritas: passe o total ao `Cabecalho` do kit.

Dicas: o `includes` responde se o id está na lista; para tirar um item sem rasurar o original, use o `filter` do E15. O comentário no topo de `Cabecalho.jsx` diz o nome da prop.

**Pronto quando:** `frango` e `FRANGO` mostram só "Fettuccine Alfredo com frango" e "Biryani de frango"; `xyz` mostra `Nenhuma receita encontrada para "xyz".`; favoritar duas receitas mostra "2 favoritas" e desmarcar uma mostra "1 favorita"; e a favorita continua marcada depois de buscar e apagar a busca.

**Commit e push:** `Projeto 4: etapa 3, busca e favoritas`.

### Etapa 4 · E27: receitas da API e entrega

**Juntos em aula**

:::steps
1. O efeito que busca: no `App`, importe também o `useEffect`. Um `useEffect` com `[]` no fim, e dentro dele uma função `async`, `carregarReceitas`, com o `fetch` de `https://dummyjson.com/recipes`, o `json()` e um `console.log(dados)`. No Console aparece o objeto da API, com a lista `recipes` dentro.
2. As receitas da API na tela: `const [receitas, setReceitas] = useState([])` e, no lugar do `console.log`, `setReceitas(dados.recipes)`. O `import` das receitas locais sai do `App`. Os cartões chegam com os nomes em inglês.
3. O aviso de carregando: `const [carregando, setCarregando] = useState(true)`, `setCarregando(false)` logo depois do `setReceitas` e, no começo do `if` do `conteudo`, o caminho `<Carregando />`.
:::

**Sua vez 1: quando a API falha**

Desligue o Wi-Fi e aperte F5: a tela fica presa em "Carregando receitas...". Faça o app avisar o erro:

- um estado `erro`, que começa `false`;
- no `carregarReceitas`, o `try`/`catch`/`finally` do E22: o `catch` liga o `erro` e o `finally` desliga o `carregando`;
- confira o `ok` da resposta, como no E22: sem ele, a API fora do ar não cai no `catch`;
- na tela, logo depois do carregando, o caminho do erro: `<MensagemErro texto="Não foi possível carregar as receitas." />`.

Dicas: o `finally` roda com erro e sem erro. Para conferir o `ok`, troque por um instante o endereço por `https://dummyjson.com/recipes/9999`, uma receita que não existe: a API responde com o status 404, e a tela precisa mostrar o erro, não ficar em branco. Depois, desfaça.

**Sua vez 2: README e entrega**

O `README.md` do kit tem três trechos marcados com "Etapa 4". Troque cada um pelo seu texto: o que o app faz, um print da tela salvo em `docs/tela.png` e o seu nome. A parte "O kit" pode ficar.

**Pronto quando:** ao abrir, aparece "Carregando receitas..." e depois 30 cartões (para ver o aviso com calma, use na aba **Rede** do DevTools a limitação **3G**); `chicken` mostra 5 receitas; com o Wi-Fi desligado, F5 mostra "Não foi possível carregar as receitas." sem o carregando preso, e com o Wi-Fi de volta, F5 traz a lista; o README mostra o print no GitHub.

**Commit e push:** `Projeto 4: etapa 4, receitas da API e README`. Depois, entregue (próxima seção).

## Como entregar

- **Repositório**: público, chamado `livro-de-receitas`, no seu GitHub, com o `.gitignore` da etapa 1 (sem `node_modules/`).
- **Commits**: o do kit e um por etapa, com as mensagens acima. Commits a mais entre as etapas são bem-vindos.
- **README**: o que o app faz, como rodar (`npm install` e `npm run dev`) e o print.
- **Na plataforma**: na página deste projeto, cole o link do repositório. Se você publicou o site (veja "Para ir além"), cole também o link dele; não é obrigatório.
- **Prazo**: início do E29. Pode colar o link antes; enquanto o instrutor não corrigir, você pode trocá-lo.
- **Depois da correção**: o instrutor pode devolver para ajustes, com um comentário por critério. Corrija, faça um commit e envie de novo pela mesma página.

## Como será avaliado

Nota mínima para aprovação: 70 de 100. O instrutor abre o seu repositório, roda `npm install` e `npm run dev`, usa o app e lê os seus dois componentes e o `App.jsx`.

| Critério | Pontos | Nota cheia | Exemplo de nota parcial |
|---|---|---|---|
| Seus componentes | 25 | `CartaoReceita` e `BotaoFavorito` com as props da tabela, a `Etiqueta` e as classes do kit | o cartão funciona, mas o botão de favorito está escrito dentro do cartão, sem componente próprio |
| Lista e busca | 20 | `map` com `key={receita.id}`, busca sem diferenciar maiúsculas, `ListaVazia` | busca que só acha com a primeira letra maiúscula |
| Favoritas | 15 | marca, desmarca, total no cabeçalho, marca que sobrevive à busca | não desmarca, ou o total fica sempre em "Nenhuma favorita" |
| Receitas da API | 25 | 30 receitas da DummyJSON, carregando e erro | funciona com internet, mas sem ela fica preso em "Carregando receitas..." |
| Repositório e README | 15 | commits por etapa, README com print, sem `node_modules` | um commit só com tudo, ou README sem o print |

:::warning Você precisa saber explicar
Na correção, o instrutor pode pedir que você explique uma parte do seu código, como o `alternarFavorita` ou o efeito que busca a API, e que mude uma coisa pequena na hora. Código que você não consegue explicar não conta como seu.
:::

## Dúvidas frequentes

**A pasta ficou `kit-receitas/kit-receitas`.** O Windows criou uma pasta a mais ao extrair. Use a de dentro, a que tem o `package.json`, e renomeie para `livro-de-receitas`.

**O terminal diz que `vite` não é reconhecido.** Faltou o `npm install` dentro da pasta do projeto.

**O terminal diz `Could not read package.json` ou `Missing script: "dev"`.** O terminal está fora da pasta do projeto. Entre nela com `cd livro-de-receitas`.

**A tela ficou em branco.** Abra o Console (F12): a mensagem vermelha diz o que aconteceu e em que arquivo. Os casos mais comuns são o `export default` esquecido, o caminho do `import` com o nome errado e uma prop usada no cartão que não está na lista de props.

**Os cartões vieram em inglês na etapa 4.** A DummyJSON é em inglês. Busque `pizza`, `chicken`, `pasta` ou `salad`.

**Busquei `lamen` e não achou o "Lámen japonês".** A busca diferencia acentos: `lámen` acha. A comparação sem acentos fica fora deste projeto.

**Os corações marcam sozinhos, ou a página trava, e o Console diz `Cannot update a component (App) while rendering a different component (BotaoFavorito)`.** No botão, o `onClick` recebe a função, sem os parênteses: `onClick={aoClicar}`. Com `aoClicar()`, ela roda na hora de desenhar a tela, e não no clique.

**Cliquei no coração e nada mudou, sem nenhum erro.** Confira duas coisas: o evento se escreve `onClick`, com C maiúsculo; e a lista nova de favoritas sai de um spread ou de um `filter`. Um `push` muda a lista velha, e o React não percebe a mudança.

**Posso mudar o CSS ou as peças do kit?** Pode, depois das quatro etapas prontas. A nota não depende do visual.

**Posso apagar o `src/data/receitas.js` na etapa 4?** Pode deixar. Ele não atrapalha, e o `App` não o importa mais.

**As fotos não aparecem.** Elas vêm do site da DummyJSON e precisam de internet. Sem rede, o texto do `alt` aparece no lugar.

**Atrasei uma etapa.** A nota é da entrega final, mas os commits contam a história do projeto: faça a etapa atrasada antes da seguinte, com a mensagem dela.

## Para ir além

Opcional e sem ponto extra; faça só com as quatro etapas prontas.

- Mostrar "8 de 30 receitas" acima da grade, com o `length` das duas listas.
- Buscar também pela cozinha: a receita passa no `filter` se o nome **ou** a cozinha têm o texto buscado.
- Um botão "Só favoritas", com um estado a mais, que combina com a busca.
- Guardar as favoritas no `localStorage` do E21, para continuarem marcadas depois do F5: um segundo `useEffect`, com `[favoritas]` no fim, salva a lista sempre que ela muda.
- Publicar o site: `npm run build` cria a pasta `dist/`; arraste essa pasta para o [Netlify Drop](https://app.netlify.com/drop) e cole o link na entrega.
