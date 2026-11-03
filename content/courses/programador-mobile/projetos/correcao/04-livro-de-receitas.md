---
title: "Correção · Projeto 4 · Livro de receitas"
summary: O que conferir em cada critério, como pontuar, o check-in de cada etapa e os sinais de cópia.
---

## Antes de corrigir

Corrija depois do prazo (início do E29). Links colados antes servem para os check-ins: enquanto você não corrige, o aluno pode trocá-los. Cada correção leva cerca de 15 minutos.

:::steps
1. Clone o repositório numa pasta de correção, fora dos seus projetos: `git clone <link>`, `cd livro-de-receitas`, `npm install`.
2. `git log --oneline --reverse`: "Kit do livro de receitas" e as quatro mensagens `Projeto 4: etapa N, ...`, com as datas.
3. `npm run dev`, Chrome com o DevTools aberto nas abas **Console** e **Rede** (filtro `recipes`).
4. Use o app pelo roteiro abaixo, nesta ordem, e só depois leia o código.
:::

**Roteiro de uso (5 minutos):**

1. Abra: "Carregando receitas..." por um instante e depois 30 cartões, com os nomes em inglês. Na aba Rede, **um** pedido a `recipes` (o kit não usa `StrictMode`, então é um só também no `npm run dev`).
2. Olhe um cartão: foto, nome, "Italian, 35 minutos", "4 porções, nota 4.6", a etiqueta "Fácil" e o botão "Favoritar".
3. Busque `chicken` (5 cartões), depois `CHICKEN` (os mesmos 5) e `xyz` (`Nenhuma receita encontrada para "xyz".`). Apague a busca: os 30 voltam.
4. Favorite duas receitas: o cabeçalho passa a "2 favoritas". Desmarque uma: "1 favorita". Busque `zzz` e apague: a que ficou continua com "Favorita".
5. Sem a API: na aba Rede, clique com o botão direito no pedido `recipes`, **Bloquear URL da solicitação** (*Block request URL*), e aperte F5. Esperado: "Não foi possível carregar as receitas.", sem "Carregando receitas..." preso. Desbloqueie (`Ctrl + Shift + P`, "Show Network request blocking") e aperte F5.
6. No Console, nada vermelho além do pedido bloqueado do passo 5.

Anote o que falhou e só então abra `src/`: o código explica o porquê e decide entre nota parcial e zero.

:::info O que é igual na turma toda
Os passos "juntos em aula" saem dos slides, iguais para todos: o `CampoBusca` ligado ao estado, o `filter` da busca, o `let conteudo` com `if`, o `map` com as props, o efeito com o `fetch`. Isso é esperado. O trabalho individual está nos trechos **Sua vez**: as props `porcoes` e `nota` (etapa 2), o desmarcar e o total no cabeçalho (etapa 3), o `try`/`catch`/`finally` com o erro (etapa 4) e o README.
:::

## Critério 1 · Seus componentes (25)

**O que conferir:** `src/components/CartaoReceita.jsx` e `src/components/BotaoFavorito.jsx`, um componente por arquivo, nome com inicial maiúscula e `export default`. O cartão desestrutura as props no parâmetro (`nome`, `foto`, `cozinha`, `minutos`, `dificuldade`, `porcoes`, `nota`, `favorita`, `aoFavoritar`), usa as classes do `cartao.css`, a `Etiqueta` do kit com `dificuldade={dificuldade}` e o `BotaoFavorito` com `ativo` e `aoClicar`. O botão troca a classe (`favorito` ou `favorito favorito--ativo`) e o texto ("Favoritar" ou "Favorita") pelo `ativo` e entrega a função ao `onClick`, sem parênteses.

| Pontos | Quando |
|---|---|
| 25 | tudo acima, foto com `alt` igual ao nome |
| 18 a 22 | um deslize: `alt` vazio ou fixo ("foto"); props com outros nomes, mas coerentes nos dois lados; ou o cartão recebe a receita inteira (`receita={receita}`) e lê os campos dentro dele |
| 10 a 15 | o botão de favorito escrito dentro do cartão, sem o `BotaoFavorito`; ou o cartão ainda com textos fixos que deveriam ser props (todas as receitas com "4 porções, nota 4.6") |
| 0 a 8 | sem componentes próprios: tudo escrito no `App.jsx` |

**Erros comuns:** a etiqueta escrita à mão (`<span>Fácil</span>`) em vez da `Etiqueta`: aceite com 2 pontos a menos; `onClick={aoClicar()}`, que marca as receitas sozinho e mostra `Cannot update a component (App) while rendering a different component (BotaoFavorito)`; `onclick` com c minúsculo (nada acontece; o Console diz ``Invalid event handler property `onclick` ``).

## Critério 2 · Lista e busca (20)

**O que conferir:** no `App`, o `map` sobre a lista filtrada, com `key={receita.id}` na tag `CartaoReceita` que ele devolve; o estado `busca` com `useState('')`, ligado ao `CampoBusca` por `valor` e `aoMudar`; a lista filtrada calculada antes do `return`, com `toLowerCase` no nome e na busca; a `ListaVazia` com `busca={busca}` quando nada passa; os passos 3 e 6 do roteiro de uso.

| Pontos | Quando |
|---|---|
| 20 | tudo acima, sem aviso de `key` no Console |
| 14 a 16 | um deslize: `key={index}` ou a `key` no elemento de dentro do cartão (o aviso continua); ou `toLowerCase` só de um lado (`CHICKEN` não acha nada) |
| 8 a 12 | sem a `ListaVazia` (a tela fica vazia sem aviso); ou um campo próprio sem `value`, que não é controlado pelo estado |
| 0 a 5 | cartões escritos um a um, sem `map`; ou sem busca |

**Erros comuns:** a lista filtrada guardada num `useState` a mais, atualizada à mão (funciona até a busca mudar sem atualizar a cópia): desconte 4; a busca no `cuisine` em vez do `name`.

## Critério 3 · Favoritas (15)

**O que conferir:** no `App`, o estado `favoritas` com `useState([])`, uma lista de ids; `alternarFavorita(id)` que confere com `includes` e devolve uma lista **nova** (spread para pôr, `filter` para tirar); no `map`, `favorita={favoritas.includes(receita.id)}` e `aoFavoritar={() => alternarFavorita(receita.id)}`; o `Cabecalho` com `totalFavoritas={favoritas.length}`; o passo 4 do roteiro de uso.

| Pontos | Quando |
|---|---|
| 15 | marca, desmarca, total no cabeçalho, marca que sobrevive à busca |
| 10 a 12 | marca e desmarca, mas sem o total no cabeçalho |
| 5 a 8 | só marca (parou no passo juntos: clicar de novo não desmarca); ou o estado dentro do `BotaoFavorito`, com `useState` próprio: alterna, mas a marca some ao buscar e o cabeçalho não conta |
| 0 a 3 | `favoritas.push(id)` ou `splice` (a tela não muda, sem erro), ou sem favoritas |

**Erros comuns:** `if (favoritas.includes(id))` com o `filter` invertido (`item === id`), que apaga todas as outras; dois `setFavoritas` seguidos, sem `else`: o segundo vence, e a receita nunca é desmarcada.

## Critério 4 · Receitas da API (25)

**O que conferir:** no `App`, o `useEffect` com `[]` no fim e, dentro dele, uma função `async` chamada logo em seguida (o efeito em si não é `async`); o `fetch` de `https://dummyjson.com/recipes`, o `ok` da resposta conferido, `setReceitas(dados.recipes)`; os estados `carregando` (começa `true`) e `erro` (começa `false`); o `try`/`catch`/`finally`, com `setCarregando(false)` no `finally`; no `if` do `conteudo`, o carregando primeiro e o erro em seguida; o `import` das receitas locais fora do `App`; os passos 1 e 5 do roteiro de uso.

| Pontos | Quando |
|---|---|
| 25 | os passos 1 e 5 do roteiro funcionam e o código tem tudo acima |
| 18 a 22 | um deslize: sem conferir o `ok` (troque o endereço por `https://dummyjson.com/recipes/9999`: a tela fica em branco, com `Cannot read properties of undefined (reading 'filter')`, em vez do erro); ou o carregando que nunca aparece porque o estado começa `false` |
| 10 a 15 | sem a API, fica preso em "Carregando receitas..." (`setCarregando(false)` só no `try`, ou sem `catch`); ou o efeito sem `[]`, que repete o pedido sem parar na aba Rede |
| 0 a 8 | as receitas ainda vêm do `src/data/receitas.js` |

**Erros comuns:** `setReceitas(dados)` em vez de `dados.recipes` (`receitas.filter is not a function`, tela branca); `useEffect(async () => ...)`, que funciona mas mostra no Console `useEffect must not return anything besides a function`: desconte 3; `catch (erro)`, com o mesmo nome do estado: funciona, não desconte, mas comente.

## Critério 5 · Repositório e README (15)

| Pontos | O que vale |
|---|---|
| 5 | o commit do kit e os quatro das etapas, com as mensagens pedidas, em dias que acompanham os encontros |
| 5 | README com o que o app faz, como rodar e o print aparecendo no GitHub, sem os trechos "Etapa 4" do kit sobrando |
| 5 | repositório público, com o `.gitignore`, sem `node_modules/` nem `dist/` |

Desconte por parte: README sem o print, 3 de 5; um commit só com tudo, 0 a 2 na primeira linha; `node_modules/` no repositório, 0 na terceira.

## Check-in por etapa

A abertura de cada encontro tem 2 a 3 minutos de check-in: mãos levantadas para quem fez o commit da etapa anterior e **um** repositório no projetor, olhando uma coisa só.

| Encontro | Etapa conferida | Olhe só isto |
|---|---|---|
| E25 | 1 | o repositório no GitHub sem `node_modules/` e o `{preparo + cozimento}` no cartão (não "35" digitado) |
| E26 | 2 | o brigadeiro com "8 porções, nota 4.2" e o Console sem o aviso de `key` |
| E27 | 3 | digite `FRANGO` e desmarque uma favorita: o total acompanha |
| E28 | 4 | na aba Rede, um pedido a `recipes`; com o pedido bloqueado, a mensagem de erro |
| E29 | entrega | no painel do instrutor, aba Projetos, quantos entregaram |

Quem não fez a etapa anterior fica com ela de tarefa, antes da próxima. Duas etapas atrasadas: converse no intervalo.

## Sinais de cópia

- **Entre colegas**: as mesmas frases no README; a mesma solução incomum nos trechos Sua vez (o mesmo nome de variável fora do padrão, o mesmo comentário, o mesmo erro no mesmo lugar).
- **No histórico**: as quatro etapas commitadas no mesmo dia, perto do prazo; um commit gigante com tudo.
- **De fora do curso**: recursos que a turma não viu, como hooks próprios, `useReducer`, `useMemo`, CSS Modules ou TypeScript.
- **Na conversa**: o aluno não explica o próprio código.

**Como agir:** antes de dar a nota, chame o aluno por 5 minutos. Peça que explique o `alternarFavorita` e o efeito que busca a API, e que faça uma mudança pequena na hora, como trocar o texto "Favoritar" por "Salvar" ou mostrar só o tempo de preparo no cartão. Quem explica e muda com segurança fica com a nota do código. Quem não consegue recebe a entrega devolvida para ajustes, com o combinado de refazer a parte copiada; em caso de cópia entre colegas, siga a regra da instituição para os dois.

## Devolver ou dar a nota

Devolva para ajustes quando o problema se resolve em até uma hora: o carregando preso sem internet, o desmarcar que falta, o total no cabeçalho, o README sem print. Escreva no comentário do critério o passo do roteiro de uso que falhou ("passo 5: sem a API, fica em Carregando"). Dê a nota final quando o app cumpre os critérios ou quando o aluno já usou a chance de ajuste.
