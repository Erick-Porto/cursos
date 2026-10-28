---
title: "Correção · Projeto 4 · Livro de receitas"
summary: O que conferir em cada critério, como pontuar, o check-in de cada etapa e os sinais de cópia.
---

## Antes de corrigir

Corrija depois do prazo (início do E26). Links colados antes servem para os check-ins: enquanto você não corrige, o aluno pode trocá-los. Cada correção leva cerca de 15 minutos.

:::steps
1. Clone o repositório numa pasta de correção, fora dos seus projetos: `git clone <link>`, `cd livro-de-receitas`, `npm install`.
2. `git log --oneline --reverse`: as cinco mensagens `Projeto 4: etapa N, ...` e as datas de cada uma.
3. `npm run lint`: anote os erros (contam no critério de entrega e, se forem de hooks, no de hooks).
4. `npm run dev`, Chrome com o DevTools aberto nas abas **Console** e **Rede** (filtro `recipes`).
5. Use o app pelo roteiro abaixo, nesta ordem, e só depois leia o código.
:::

**Roteiro de uso (5 minutos):**

1. Abra: "Carregando receitas..." e depois 12 cartões. No `npm run dev`, duas requisições, a primeira cancelada (é o `StrictMode`, aula 47).
2. Digite `pizza` depressa: na aba Rede, uma requisição só, com `q=pizza`; o campo mostra "Buscando..." enquanto você digita. Depois `frango`: `Nenhuma receita encontrada para "frango".`
3. Apague a busca e escolha Média: só selos "Média". Escolha Difícil: a mensagem de lista vazia (a API não tem receitas difíceis).
4. Favorite duas receitas e desfavorite uma: o cabeçalho passa por "1 favorita", "2 favoritas", "1 favorita". Aperte F5: a mesma receita continua favorita.
5. No Console, `localStorage.setItem('livro-de-receitas:favoritas', '{quebrado')` e F5: o app abre, com "Nenhuma favorita". (Se o aluno usou outra chave, veja qual na aba **Application**.)
6. "Ver receita": ficha, ingredientes e modo de preparo. "Voltar para a lista": a busca e o filtro continuam como estavam.
7. Sem a API: na aba Rede, clique com o botão direito na requisição de `recipes`, **Block request domain**, e aperte F5. Esperado: "Não foi possível carregar as receitas." e "Tentar de novo", sem "Carregando..." preso. Desbloqueie (`Ctrl + Shift + P`, "Show Network request blocking") e clique em "Tentar de novo": a lista volta.

Anote o que falhou e só então abra `src/`: o código explica o porquê e decide entre nota parcial e zero.

## Critério 1 · Componentes, props e listas (20)

**O que conferir:** `src/components/` com `Cabecalho`, `Filtros`, `ListaReceitas`, `CartaoReceita` e `DetalheReceita`, um por arquivo, em PascalCase, com `export default`; `CartaoReceita({ receita, ... })` lendo os campos por desestruturação; o `map` da `ListaReceitas` com `key={receita.id}`; um `.module.css` por componente com estilo; `src/utils/receitas.js` com `tempoTotal` e `rotuloDificuldade`.

| Pontos | Quando |
|---|---|
| 20 | tudo acima, console sem aviso de `key`, selo com texto e cor por dificuldade |
| 14 a 16 | um deslize: `key={i}`, um componente com estilo no `index.css`, ou o tempo total calculado dentro do JSX em vez de `tempoTotal` |
| 8 a 12 | cartão recebe os campos soltos (`nome={...} imagem={...}`) em vez da prop `receita`, ou todos os estilos em CSS global |
| 0 a 5 | tudo no `App.jsx`, sem componentes próprios, ou cartões escritos à mão em vez de `map` |

**Erros comuns:** `key` na `<article>` de dentro do `CartaoReceita` (o aviso continua); selo só com cor, sem o texto; `rotuloDificuldade` com `if` encadeado que esquece um caso (aceite, desde que funcione); `alt` vazio ou "imagem".

## Critério 2 · Estado e eventos (20)

**O que conferir:** no `App` (ou no `useFavoritos`, depois da etapa 4), `alternarFavorita` com `filter` e spread; o campo de busca e o seletor com `value` e `onChange`, o estado no `App` e o `Filtros` recebendo valores e funções por props; a lista da tela calculada antes do `return`; o contador no `Cabecalho` com singular e plural; o cartão favorito destacado.

| Pontos | Quando |
|---|---|
| 20 | favoritar e desfavoritar, busca e filtro combinados, contador certo nos três casos, nada mutado |
| 14 a 16 | um deslize: "1 favoritas", destaque só por cor, ou um `useState` a mais para guardar a lista filtrada (funciona, mas duplica o estado) |
| 8 a 12 | filtro e busca que não se combinam (um apaga o outro), ou estado de busca dentro do `Filtros` com uma cópia no `App` |
| 0 a 5 | `favoritas.push(id)` ou `splice` no estado (a tela não acompanha), ou campo não controlado |

**Erros comuns:** `onClick={onFavoritar(id)}` (dispara ao desenhar: todas viram favoritas ou aparece "Too many re-renders"); filtros dentro de um `<form>` com botões sem `type="button"` (a página recarrega); `'difícil'` com acento no `value` de um lado e sem do outro.

## Critério 3 · Receitas da API (20)

**O que conferir:** `src/api/receitas.js` com `buscarReceitas(busca, sinal)` e `traduzirReceita(item)`; a URL `https://dummyjson.com/recipes/search?q=...&limit=12` com `encodeURIComponent` e `trim`; `resposta.ok` conferido; a lista lida de `dados.recipes`; as três dificuldades traduzidas; na tela, carregando, erro com "Tentar de novo", vazio com o termo e "Buscando...".

| Pontos | Quando |
|---|---|
| 20 | os passos 1, 2, 3 e 7 do roteiro de uso funcionam |
| 14 a 16 | um estado faltando: busca vazia sem o termo, sem "Buscando...", ou `Hard` fora da tradução |
| 8 a 12 | sem rede, fica em "Carregando receitas..." para sempre (`setCarregando(false)` dentro do `try`), ou "Tentar de novo" que não busca de novo (`tentativa` fora das dependências) |
| 0 a 5 | dados ainda locais, ou o `fetch` sem tradução (cartões vazios) |

**Erros comuns:** `dados.map is not a function` porque a lista está em `dados.recipes`; `limit` diferente de 12 (aceite: não muda nada importante); `useReceitas(busca)` em vez da busca atrasada (cada letra vira uma requisição; desconte aqui, não no critério de hooks).

## Critério 4 · Hooks próprios e favoritas salvas (15)

**O que conferir:** `src/hooks/useDebounce.js`, `useReceitas.js` e `useFavoritos.js`, com export nomeado e nome começando por `use`; todos chamados no topo do `App`, antes de qualquer `return` e fora de `if`; o `App` sem `useEffect` e sem `fetch`; o efeito do `useReceitas` com limpeza (`AbortController`) e as dependências certas (`[busca, tentativa]` ou equivalente); o `useFavoritos` lendo o `localStorage` no valor inicial e salvando num efeito com `[favoritas]`; os passos 4 e 5 do roteiro de uso.

| Pontos | Quando |
|---|---|
| 15 | três hooks certos, `npm run lint` sem `react-hooks/...`, favoritas depois do F5 e o JSON quebrado sem derrubar o app |
| 10 a 12 | favoritas salvas, mas o JSON quebrado deixa a tela em branco (sem `try/catch`), ou o efeito sem limpeza |
| 5 a 8 | favoritas não sobrevivem ao F5: salva, mas não lê o `localStorage` no valor inicial do `useState` |
| 0 a 3 | lógica toda no `App`, sem hooks próprios, ou hook chamado depois de um `return` (o app quebra) |

**Erros comuns:** `useEffect(async () => ...)`; o `useFavoritos` que começa com `useState([])` e lê o `localStorage` num efeito: o lint acusa `react-hooks/set-state-in-effect` e, no `npm run dev`, as favoritas somem a cada F5 (o `StrictMode` roda o efeito que salva `[]` antes da segunda leitura); `catch (erro)` sem usar `erro`, que o lint acusa como `no-unused-vars` (o enunciado ensina o `catch {`). O `useDebounce` igual ao da aula 48 é esperado e não desconta: ele é genérico, e o enunciado permite.

## Critério 5 · Detalhe da receita (10)

**O que conferir:** `DetalheReceita` com a ficha, `<ul>` de ingredientes e `<ol>` do modo de preparo, com `key` nos dois `map`; "Ver receita" no cartão; no `App`, um estado com o id (ou a receita) aberto e a troca entre lista e detalhe; ao voltar, a busca e o filtro intactos (o estado continua no `App`).

| Pontos | Quando |
|---|---|
| 10 | passo 6 do roteiro de uso completo, sem aviso no console |
| 6 a 8 | falta parte da ficha ou o modo de preparo, ou a busca zera ao voltar |
| 3 a 5 | detalhe abre, mas "Voltar" recarrega a página |
| 0 | sem detalhe |

**Erros comuns:** `key` ausente nas listas do detalhe (aviso no console); um `useState` declarado depois do `if (aberta) return ...` (`Rendered more hooks than during the previous render`).

## Critério 6 · Repositório, README e lint (15)

| Pontos | O que vale |
|---|---|
| 5 | cinco commits com as mensagens pedidas, em dias diferentes, acompanhando os encontros |
| 5 | README com o que o app faz, como rodar e os dois prints aparecendo no GitHub |
| 5 | `npm run lint` sem erros, console sem avisos, repositório público sem `node_modules` |

Desconte por parte: README sem prints, 3 de 5; um commit só com tudo, 0 a 2 na primeira linha; `node_modules` no repositório, 0 na terceira.

## Check-in por etapa

O bloco de projeto de cada encontro abre com 2 a 3 minutos de check-in: mãos levantadas para quem fez o commit da etapa anterior e **um** repositório no projetor, olhando uma coisa só.

| Encontro | Etapa conferida | Olhe só isto |
|---|---|---|
| E22 | 1 | o commit da etapa 1 no GitHub e o `CartaoReceita` com `{preparo + cozimento}` (não "35" digitado) |
| E23 | 2 | `CartaoReceita({ receita })` e o `map` da `ListaReceitas` com `key={receita.id}` |
| E24 | 3 | a lista da tela calculada antes do `return`, sem `useState` para ela; digite "lamen" e veja o "Lámen japonês" |
| E25 | 4 | na aba Rede do app do aluno, `pizza` digitado depressa gera uma requisição só |
| E26 | 5 (entrega) | no painel do instrutor, aba Projetos, quantos entregaram |

Quem não fez a etapa anterior fica com ela de tarefa, antes da próxima. Duas etapas atrasadas: converse no intervalo.

## Sinais de cópia

- **Do laboratório**: nomes do `minhas-tarefas` que sobraram (`tarefas`, `prioridade`, `onAlternar`, `CartaoTarefa`), o título "Minhas Tarefas" no `index.html`, a mensagem "Não foi possível carregar as tarefas.", ou `useTarefas` renomeado com as funções de adicionar e remover que o projeto não pede.
- **Entre colegas**: o mesmo CSS (cores, nomes de classe incomuns), os mesmos comentários e as mesmas frases no README, os mesmos erros nos mesmos lugares.
- **No histórico**: as cinco etapas commitadas no mesmo dia, perto do prazo; um commit gigante com tudo.
- **Na conversa**: o aluno não explica o próprio código.

O `useDebounce` igual ao da aula e um `useReceitas` com a mesma forma do `useTarefas` são esperados: o que é do aluno está na tradução dos campos, nas mensagens, nos componentes e no CSS.

**Como agir:** antes de dar a nota, chame o aluno por 5 minutos. Peça que explique o efeito do `useReceitas` e o `alternarFavorita`, e que faça uma mudança pequena na hora, como trocar "Nenhuma favorita" por "Sem favoritas" ou mostrar a cozinha no detalhe. Quem explica e muda com segurança fica com a nota do código. Quem não consegue recebe a entrega devolvida para ajustes, com o combinado de refazer a parte copiada; em caso de cópia entre colegas, siga a regra da instituição para os dois.

## Devolver ou dar a nota

Devolva para ajustes quando o problema se resolve em até uma hora: favoritas que somem no F5, falta o "Tentar de novo", README sem prints, lint com erro. Escreva no comentário do critério o passo do roteiro de uso que falhou ("passo 7: sem rede, fica em Carregando"). Dê a nota final quando o app cumpre os critérios ou quando o aluno já usou a chance de ajuste.
