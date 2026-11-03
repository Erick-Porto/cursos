## Antes de corrigir

Guia só para instrutores. Não traz a solução: a de referência fica na sua máquina, fora do
repositório do curso (`privado/projetos/projeto-6/`), com o estado do código no fim de cada etapa e
um README do que conferir.

:::steps
1. Clone o repositório do aluno, rode `npm install` e `npx expo start` e abra no Expo Go (SDK 58).
   Erro de versão de pacote: `npx expo install --fix` e `npx expo start -c`
2. Confira que `src/data/casas.js`, `src/data/servidor.js`, `src/data/CasasContext.js` e
   `src/components/ui/` são os do kit (`git diff` contra o kit, ou abra e compare). Se o aluno mudou os
   dados, a tabela abaixo não vale: peça para voltar aos arquivos do kit
3. Confira em `src/data/servidor.js` que a simulação voltou a `atraso: 800`, `falhas: 0` e
   `vazio: false`
4. Corrija com o celular e o código lado a lado, na ordem dos critérios. Deite o celular para o
   critério de estados e acessibilidade
:::

### O que a tela mostra com os dados do curso

| Onde | Resultado esperado |
|---|---|
| Números da Início e da Sobre | 12 casas, 5 cidades, 76 vagas |
| Selos | Lotada: Lar da Mel e Gatil Sete Vidas. Última vaga: Casa da Pipoca. Últimas 2 vagas: Abrigo Focinho Feliz. Últimas 3 vagas: Casa do Bigode. As outras 7: "N vagas", em verde |
| Busca | "sao": 4 casas (as 3 de São Paulo e o Recanto São Francisco). "RIBEIRAO": 2. "pinheiros": Lar da Mel. "geladeira": lista vazia com Limpar busca |
| Detalhe do Lar da Mel | Rua Cardeal Arcoverde, 451; Marta Ribeiro; 0 vagas de 20; outras casas: Casa do Bigode e Abrigo Rabo Abanando |
| Cadastro | capacidade 10 e 12 animais: "Não pode passar da capacidade". Com 6 animais: a casa no topo, com "4 vagas", e 13 casas nos números |

Os textos das mensagens podem variar, desde que digam a mesma coisa. Os números não.

## Critério 1 · Início com flexbox, tokens e tema (20)

**O que conferir.** No celular: o topo com título, frase e o botão de tema à direita; os três números
lado a lado, do mesmo tamanho; os cartões com a foto à esquerda. Troque o tema pelo botão e pelo
sistema, com o app aberto: nenhum texto some, nenhum bloco fica branco no escuro. No código:

```bash
git grep -n -E "#[0-9a-fA-F]{3,8}\b" -- app src/components/CartaoCasa.js
git grep -n -E "(fontSize|gap|padding|margin|borderRadius): [0-9]" -- app src/components/CartaoCasa.js
```

O primeiro deve vir vazio. O segundo pode trazer medidas de tamanho (`width: 72`, `height: 220`,
`minHeight: 44`), mas não espaços, raios e tamanhos de letra soltos. A cor primária pode ser a do kit
ou um dos pares do comentário do `tokens.js`.

**Como pontuar.**

- 20: tudo acima
- 15: um número solto ou uma cor fora do lugar, ou um texto sem a cor do tema
- 10: a Início montada, mas sem tema (o escuro fica ilegível) ou sem tokens
- 5: só o kit, com pouca coisa montada
- 0: a Início do kit sem mudança

**Erros comuns.** Cor dentro do `StyleSheet.create` (não acompanha o tema); `useTema()` chamado fora da
função do componente ("Invalid hook call"); faltou `flex: 1` na coluna de textos, e um nome comprido
empurra o selo; os três números com larguras diferentes porque faltou `flex: 1` em cada um.

## Critério 2 · O seu CartaoCasa (20)

**O que conferir.** Abra `src/components/CartaoCasa.js`:

- `export default function CartaoCasa({ casa, onPress })`, com as props desestruturadas
- `Image` com `source={{ uri: casa.foto }}` e largura e altura; o ternário que mostra a pata quando
  `casa.foto` é `''` (ONG Amigo Fiel, Gatil Sete Vidas, Lar Temporário Ronrom e Cantinho dos Bichanos)
- os ícones `location-outline` e `paw-outline` com cores do tema
- `Pressable` com o `onPress` recebido e o estilo que muda com `pressed`
- o selo escolhido por `if`/`else if` (ou equivalente), com os textos e os tons da tabela do enunciado

No celular, confira os selos com a tabela do início deste guia e toque num cartão: ele fica mais transparente
enquanto o dedo aperta.

**Como pontuar.**

- 20: tudo acima
- 15: um selo errado (por exemplo, "Últimas 1 vagas" no lugar de "Última vaga"), ou sem retorno ao toque
- 10: o componente existe, mas a casa sem foto fica com um buraco, ou o selo é sempre o mesmo
- 5: o cartão continua dentro da Início, sem componente próprio
- 0: sem cartão

**Erros comuns.** `function CartaoCasa(casa)` sem as chaves: aparece "NaN vagas" em todos os cartões;
`Image` remota sem `width` e `height` (a foto não aparece); `onPress` recebido e não repassado ao
`Pressable`; import com chaves (`import { CartaoCasa }`) de um `export default`, que dá "Element type
is invalid".

## Critério 3 · Lista, busca e navegação (20)

**O que conferir.** No celular, faça este roteiro:

1. Busque "sao", "RIBEIRAO", "pinheiros" e "geladeira" e confira com a tabela; toque em Limpar busca
2. Puxe a lista para baixo: a rodinha aparece e para sozinha
3. Toque no Lar da Mel: o Detalhe abre por cima das abas, com o nome no cabeçalho, foto, descrição,
   vagas, visitas, endereço, responsável e telefone
4. Toque em Casa do Bigode, em Outras casas: abre o Detalhe dela. Volte duas vezes, pelo cabeçalho e
   pelo voltar do sistema (ou o gesto): Lar da Mel, depois a lista
5. Toque na aba Sobre e volte para Casas

No código: `FlatList` com `keyExtractor` que devolve texto; `app/casa/[id].js` com
`useLocalSearchParams` e `Number(id)`; `app/(abas)/_layout.js` com `Tabs` e as abas `index` e `sobre`;
no `app/_layout.js`, `(abas)` sem cabeçalho e `casa/[id]` na pilha.

**Como pontuar.**

- 20: o roteiro inteiro funciona
- 15: um item falha, como a busca só pelo nome ou as outras casas sem `Link`
- 10: dois itens falham, ou o Detalhe abre dentro das abas, com a barra embaixo
- 5: só a lista, sem Detalhe
- 0: a lista ainda com `map` dentro da `Tela` com `rolar`, sem busca nem navegação

**Erros comuns.** `item.id === id` sem `Number`: o Detalhe sempre diz "Casa não encontrada";
`onPress={router.push(...)}` sem `() =>`, que navega ao desenhar a lista; a pasta `casa/` dentro de
`(abas)/`; o `ListHeaderComponent` escrito como função (`() => topo`), e o teclado fecha a cada letra
da busca; a `Tela` ainda com `rolar` em volta da `FlatList` (aviso de lista dentro de `ScrollView`).

## Critério 4 · Cadastro de casa (20)

**O que conferir.** No Cadastro:

- toque em cada campo: o teclado de telefone no Telefone, o numérico na Capacidade e nos Animais, a
  maiúscula no começo das palavras em Nome, Bairro e Cidade
- Cadastrar com tudo vazio: uma mensagem embaixo de cada um dos sete campos, e nada é salvo
- capacidade 10 com 12 animais: a mensagem embaixo dos Animais; com 6, salva
- a casa nova aparece no topo da lista com o selo "4 vagas", e os números da Início e da Sobre mudam

No código: um `useState` por campo, uma função de validação que devolve um objeto de erros, e
`adicionarCasa` com os valores convertidos com `Number` na capacidade e na ocupação.

**Como pontuar.**

- 20: tudo acima
- 15: falta um campo, ou um teclado errado
- 10: os erros só num `Alert` geral, sem mensagem no campo; ou a ocupação maior que a capacidade aceita
- 5: o formulário salva sem validar
- 0: sem formulário

**Erros comuns.** Capacidade e ocupação comparadas como texto (`'6' > '10'` é `true`); `onPress={salvar()}`
com parênteses ("Too many re-renders"); `onChangeText={setNome()}`; a casa salva sem `adicionarCasa`,
só com o `Alert`.

## Critério 5 · Estados e acessibilidade (10)

**O que conferir.**

- em `src/data/servidor.js`, troque para `atraso: 3000` e recarregue: a Início mostra o Carregando
- `falhas: 1`: a tela de erro, e Tentar de novo traz a lista
- `vazio: true`: "Nenhuma casa cadastrada", sem o botão Limpar busca
- volte os três valores e ligue o TalkBack (ou o VoiceOver): um toque no cartão do Lar da Mel lê
  "Lar da Mel, Pinheiros, São Paulo. Cães. Lotada" e diz que é um botão; os números são lidos como
  "12 casas"
- deite o celular (ou use um tablet): duas colunas de cartões

**Como pontuar.**

- 10: tudo acima
- 7: falta uma parte, como as duas colunas ou os números acessíveis
- 4: só os estados, sem acessibilidade
- 0: nada desta lista

**Erros comuns.** `useWindowDimensions` ou `useState` depois do `if (carregando) return`, que dá erro de
hooks na troca de estado; `numColumns` sem a `key` que muda junto ("Changing numColumns on the fly");
`columnWrapperStyle` com uma coluna só; o rótulo do cartão no `Text` de dentro, e não no `Pressable`.

## Critério 6 · Repositório e README (10)

**O que conferir.** `git log --oneline --date=short --format="%ad %s"`: 7 commits com as mensagens do
enunciado, em datas que acompanham os encontros. README com o que o app faz, como rodar, o que o aluno
fez e os prints em `docs/` (Início clara e escura, Detalhe e Cadastro com erros). Sem `node_modules/`
no repositório.

**Como pontuar.**

- 10: tudo acima
- 7: faltam até 2 commits de etapa, ou falta um item do README
- 4: um commit só, ou README sem prints
- 0: repositório privado, ou o README do kit sem mudança

## Check-in por etapa

No começo do encontro seguinte, 2 a 3 minutos: pergunte quem fez o commit da etapa anterior, abra um
repositório no projetor e olhe **uma** coisa.

| Etapa | Commit | O que olhar |
|---|---|---|
| 1 · E33 | `etapa 1, tela Início com flexbox` | o `.gitignore` com `node_modules/` e o `flex: 1` na coluna de textos |
| 2 · E34 | `etapa 2, tokens e tema` | busca por `#` em `app/` vazia; a cor no array de `style` |
| 3 · E35 | `etapa 3, CartaoCasa` | a desestruturação `{ casa, onPress }` e o selo da Casa da Pipoca |
| 4 · E36 | `etapa 4, lista com busca` | "sao" ao vivo; o `keyExtractor` com `String` |
| 5 · E37 | `etapa 5, detalhe e abas` | o `Number(id)` e a pasta `(abas)` |
| 6 · E38 | `etapa 6, cadastro de casa` | o objeto de erros e o `Number` na comparação da ocupação |
| 7 · E39 | `etapa 7, estados, acessibilidade e entrega` | o link na página do projeto (painel do instrutor, aba Projetos) |

Etapa atrasada não perde ponto no check-in: anote e lembre que a nota é da entrega final.

## Sinais de cópia

- Todos os commits no mesmo dia, ou um commit só com o projeto inteiro
- Dois alunos com os mesmos nomes de variáveis incomuns, os mesmos comentários e os mesmos erros
- O kit alterado para esconder uma parte que o aluno devia escrever (por exemplo, um `CartaoCasa`
  dentro de `src/components/ui/`)
- Bibliotecas e padrões que o curso não usou: TypeScript, `styled-components`, `react-hook-form`,
  `axios`, hooks próprios, comentários em inglês por todo o código
- O aluno não explica o próprio código

**Como agir.** Converse em particular, sem acusar. Peça para explicar o selo do `CartaoCasa` e para
mudar algo ao vivo: "faça a Casa do Bigode mostrar 'Poucas vagas' em vez de 'Últimas 3 vagas'".
Quem fez responde em um minuto. Se não souber, devolva o projeto para ajustes com um prazo e o pedido
de refazer a parte copiada, e siga a política da instituição para casos repetidos. Ajuda de colega e
consulta à aula não são cópia; código idêntico sem entendimento é.
