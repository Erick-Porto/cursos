---
title: "Correção · Projeto 5 · Gota: meta de água"
summary: O que conferir em cada critério, como pontuar, o check-in de cada etapa e os sinais de cópia.
---

## Antes de corrigir

Corrija depois do prazo (início do E33). Links colados antes servem para os check-ins: enquanto você não corrige, o aluno pode trocá-los. Cada correção leva cerca de 15 minutos.

:::steps
1. Clone o repositório numa pasta de correção, fora dos seus projetos: `git clone <link>`, `cd gota`, `npm install`.
2. `git log --oneline --reverse`: "Kit do Gota" e as três mensagens `Projeto 5: etapa N, ...`, com as datas.
3. No terminal, a sua conta Expo (`npx expo whoami`; se não houver, `npx expo login`), a mesma do Expo Go do seu celular. Depois, `npx expo start` e o QR code. Não abriu? `npx expo start -c` limpa o cache; na rede da escola, `npx expo start --tunnel`.
4. Use o app pelo roteiro abaixo, com o terminal à vista, e só depois leia o código.
:::

O kit é do Expo SDK 58: o seu Expo Go precisa estar atualizado na loja. Se o `package.json` do aluno tiver outras versões de `expo` ou de `react-native-safe-area-context`, ele rodou um `npm install <pacote>` por conta própria; `npx expo install --check` mostra a diferença.

**Roteiro de uso (5 minutos):**

1. Abra: a gota, "Gota" e a saudação do aluno; "0 ml de 2000 ml", a barra vazia e "Faltam 2000 ml"; os três copos lado a lado; "Registros de hoje" e a lista vazia, com a gota clarinha.
2. Toque em +300 e depois em +500: "800 ml", "40% da meta", "Faltam 1200 ml"; dois registros com a hora de agora, o de 500 em cima.
3. Toque em +500 três vezes: "2300 ml", "114% da meta" (a conta dá 114,99..., e o número é cortado, não arredondado), a barra cheia sem sair do cartão e "Meta batida!".
4. Remova o de 300: "2000 ml", "100% da meta", "Meta batida!" e quatro registros de 500.
5. Remova o de cima: "1500 ml", "75% da meta", "Faltam 500 ml" e três registros; os horários mostram que saiu só aquele.
6. Remova todos: "0 ml" e a lista vazia de volta.
7. No terminal: nenhuma mensagem vermelha (`ERROR`) e nenhum aviso amarelo (`WARN`) de `key`.

Recarregar o app (tecla `r` no terminal) zera o dia: é esperado, não desconte. Anote o que falhou e só então abra o `App.js` e o `src/components/BotaoCopo.js`: o código explica o porquê e decide entre nota parcial e zero.

:::info O que é igual na turma toda
Os passos "juntos em aula" saem dos slides, iguais para todos: os estilos do topo, a gota, o `BotaoCopo` com `Pressable` e estilo, o estado com `adicionarCopo`, o `reduce` do total, a `FlatList` com `keyExtractor` e a `ListaVazia`. Isso é esperado. O trabalho individual está nos trechos **Sua vez**: a meta do dia com `View` e `Text` (etapa 1), a prop `ml` com os três copos na `Linha` (etapa 2), o `removerRegistro` com `filter` e o README (etapa 3). A saudação é de cada um.
:::

## Critério 1 · App no celular (15)

**O que conferir:** o passo 1 do roteiro, com o app abrindo do zero, sem tela vermelha. No `App.js`: a `Image` com `require('./assets/gota.png')` e um estilo com `width` e `height`; os dois `Text` do topo com `style={estilos.titulo}` e `style={estilos.saudacao}` (ou nomes do aluno); o `const estilos = StyleSheet.create(...)` no fim do arquivo, depois do componente.

| Pontos | Quando |
|---|---|
| 15 | tudo acima |
| 11 a 13 | um deslize: estilo escrito dentro da tag (`style={{ fontSize: 32 }}`), sem o `StyleSheet`; o `StyleSheet.create` no meio do arquivo; a gota sem `width` e `height`, enorme |
| 6 a 9 | sem a gota, ou o topo sem estilo nenhum (texto preto e pequeno) |
| 0 a 4 | o topo do kit sem mudança nenhuma ("Olá! Troque esta frase pela sua saudação.") |

App que não abre do zero não leva zero: devolva para ajuste antes da nota (veja o fim deste guia).

**Erros comuns:** `require('assets/gota.png')` sem o `./`, ou `../assets` no `App.js` (`Unable to resolve module`); `fontSize: '32px'` ou `width: '48px'`: o React Native usa número, sem `px`; o `Image` importado e esquecido no `import` (`Property 'Image' doesn't exist`).

## Critério 2 · O seu BotaoCopo (25)

**O que conferir:** `src/components/BotaoCopo.js`, com inicial maiúscula e `export default`. Dentro: um `Pressable` com um `Text`; as props desestruturadas no parâmetro, `{ ml, aoAdicionar }`; o texto `+{ml} ml`; `onPress={() => aoAdicionar(ml)}`; um `StyleSheet.create` no fim do arquivo, com o estilo do botão e o do texto (cores de `'../tema'` ou escritas como código: as duas valem). No `App`: três `<BotaoCopo ml={...} aoAdicionar={adicionarCopo} />`, de 200, 300 e 500, dentro da `<Linha>`. Os passos 2 e 3 do roteiro.

| Pontos | Quando |
|---|---|
| 25 | tudo acima |
| 18 a 22 | um deslize: os botões fora da `Linha`, um embaixo do outro; `Button` no lugar do `Pressable`; o `console.log` da etapa 2 ainda no toque, junto com o `aoAdicionar` (desconte 1) |
| 10 a 15 | o botão ignora a prop: os três mostram "+200 ml", ou somam sempre o mesmo valor; ou três componentes quase iguais, um por copo |
| 0 a 8 | sem componente: os três `Pressable` escritos direto no `App.js` |

**Erros comuns:** `ml="300"`, com aspas: o total vira "0300500" (desconte aqui, não em Registros); `onPress={aoAdicionar(ml)}`, sem o `() =>`: o app se enche de copos sozinho e trava, com `Cannot update a component (App) while rendering a different component (BotaoCopo)` no terminal (devolva para ajuste); `import { cores } from './tema'` dentro de `src/components/` (`Unable to resolve module`).

## Critério 3 · Registros e total (25)

**O que conferir:** no `App`, `const [registros, setRegistros] = useState([])`; o `adicionarCopo(ml)` que cria `{ id: Date.now(), ml: ml, hora: horaAgora() }` e chama `setRegistros([novo, ...registros])`; antes do `return`, `const total` com `registros.reduce(...)` e valor inicial 0; `<ProgressoMeta total={total} meta={2000} />` no lugar da `View` da meta do dia. Os passos 2 e 3 do roteiro.

| Pontos | Quando |
|---|---|
| 25 | tudo acima |
| 18 a 22 | um deslize: o copo novo no fim da lista (`[...registros, novo]`); a linha provisória "Copos hoje" ou a `View` da meta da etapa 1 ainda na tela; a hora escrita fixa, sem `horaAgora()` |
| 10 a 15 | o total num segundo `useState`, somado à mão: certo ao adicionar, errado depois de remover; ou o `ProgressoMeta` com `total` fixo |
| 0 a 8 | `registros.push(novo)` com `setRegistros(registros)`: a lista é a mesma, o React não percebe a mudança e a tela não muda, sem erro nenhum |

**Erros comuns:** `reduce` sem o valor inicial: com a lista vazia, a tela vermelha `Reduce of empty array with no initial value` logo ao abrir (devolva para ajuste); `id: 1` fixo, que dá o mesmo crachá a todos os registros (o terminal avisa `Encountered two children with the same key` e o Remover tira todos: desconte em Lista e remoção).

## Critério 4 · Lista e remoção (20)

**O que conferir:** a `FlatList` com `data={registros}`, `keyExtractor={(item) => String(item.id)}` e o `renderItem` que devolve um `ItemRegistro` com `ml`, `hora` e `aoRemover`; `ListEmptyComponent` com a `ListaVazia`; o `removerRegistro(id)` com `registros.filter(...)` que deixa passar quem tem outro `id`; `aoRemover={() => removerRegistro(item.id)}`. Os passos 4 a 6 do roteiro.

| Pontos | Quando |
|---|---|
| 20 | tudo acima |
| 15 a 17 | um deslize: sem `keyExtractor` (funciona, porque o registro tem `id`: desconte 2); a mensagem de lista vazia escrita fora da `FlatList`, aparecendo também com copos |
| 8 a 12 | o Remover não funciona (parou nos passos juntos); ou a lista num `registros.map(...)` dentro de uma `View`, sem a `FlatList`, que não rola com muitos copos |
| 0 a 6 | sem lista: os registros não aparecem |

**Erros comuns:** o `filter` com `===` no lugar de `!==`, que deixa só o copo tocado; `aoRemover={removerRegistro(item.id)}`, sem o `() =>`, que apaga os copos logo depois de aparecerem, com `Cannot update a component (App) while rendering a different component (CellRenderer)` no terminal; `splice` na lista do estado, que não muda a tela.

## Critério 5 · Repositório e README (15)

| Pontos | O que vale |
|---|---|
| 5 | o commit do kit e os três das etapas, com as mensagens pedidas, em dias que acompanham os encontros |
| 5 | README com o que o app faz, como rodar, os dois prints do celular aparecendo no GitHub e o nome, sem os trechos "Etapa 3" do kit sobrando |
| 5 | repositório público, com o `.gitignore`, sem `node_modules/` nem `.expo/` |

Desconte por parte: um print só, 3 de 5; prints do computador no lugar do celular, 4 de 5; um commit só com tudo, 0 a 2 na primeira linha; `node_modules/` no repositório, 0 na terceira.

## Check-in por etapa

A abertura de cada encontro tem 2 a 3 minutos de check-in: mãos levantadas para quem fez o commit da etapa anterior e **um** repositório no projetor, olhando uma coisa só.

| Encontro | Etapa conferida | Olhe só isto |
|---|---|---|
| E30 | 1 | o repositório no GitHub sem `node_modules/` e a meta do dia numa `View` com dois `Text` |
| E31 | 2 | o `BotaoCopo.js` com `ml` desestruturado e, no `App`, `ml={300}` entre chaves |
| E32 | 3 | no celular de um aluno, Remover tira só aquele copo e o total cai |
| E33 | entrega | no painel do instrutor, aba Projetos, quantos entregaram |

Quem não fez a etapa anterior fica com ela de tarefa, antes da próxima. Duas etapas atrasadas: converse no intervalo. No E29, quem não conseguiu conectar o celular faz a etapa 1 em casa, na rede de casa, e mostra no E30.

## Sinais de cópia

- **Entre colegas**: a mesma saudação, as mesmas frases no README, os mesmos prints; a mesma solução incomum nos trechos Sua vez (o mesmo nome de função fora do padrão, o mesmo comentário, o mesmo erro no mesmo lugar).
- **No histórico**: as três etapas commitadas no mesmo dia, perto do prazo; um commit gigante com tudo.
- **De fora do curso**: recursos que a turma não viu até o E31, como navegação, `AsyncStorage`, contexto, hooks próprios, `useReducer`, TypeScript ou bibliotecas de componentes prontos.
- **Na conversa**: o aluno não explica o próprio código.

**Como agir:** antes de dar a nota, chame o aluno por 5 minutos. Peça que explique o `adicionarCopo` e o `removerRegistro`, e que faça uma mudança pequena na hora, como trocar o copo de 500 por um de 400 ou mudar a cor do `BotaoCopo`. Quem explica e muda com segurança fica com a nota do código. Quem não consegue recebe a entrega devolvida para ajustes, com o combinado de refazer a parte copiada; em caso de cópia entre colegas, siga a regra da instituição para os dois.

## Devolver ou dar a nota

Devolva para ajustes quando o problema se resolve em até uma hora: o app que não abre do zero ou trava (`onPress` sem o `() =>`, `Reduce of empty array`, um `import` com o caminho errado), o Remover que falta, o README sem prints, o repositório privado. Escreva no comentário do critério o passo do roteiro de uso que falhou ("passo 5: Remover tira todos os copos"). Dê a nota final quando o app cumpre os critérios ou quando o aluno já usou a chance de ajuste.
