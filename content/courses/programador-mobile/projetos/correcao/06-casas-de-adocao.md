## Antes de corrigir

Guia só para instrutores. Não traz a solução: a de referência fica na sua máquina, fora do
repositório do curso (`privado/projetos/projeto-6/`), com um README do que conferir.

:::steps
1. Clone o repositório do aluno, rode `npm install` e `npx expo start`, e abra no Expo Go. Erro de
   versão de pacote: `npx expo install --fix` e `npx expo start -c`
2. Confira que `src/data/casas.js` é o do curso (12 casas, ids de 1 a 12). Se o aluno mudou os dados,
   a tabela abaixo não vale: peça para voltar ao arquivo do curso
3. Corrija com o celular e o código lado a lado, na ordem dos critérios. Um tablet ou um emulador de
   tablet ajuda no critério de responsividade; sem ele, use o celular deitado
:::

### O que a tela mostra com os dados do curso

| Onde | Resultado esperado |
|---|---|
| Início | 5 seções nesta ordem: Belo Horizonte, MG (2), Campinas, SP (3), Curitiba, PR (2), Ribeirão Preto, SP (2), São Paulo, SP (3) |
| Selos | Lotada: Lar da Mel e Gatil Sete Vidas. Última vaga: Casa da Pipoca. Últimas 2 vagas: Abrigo Focinho Feliz. Últimas 3 vagas: Casa do Bigode. As outras 7: "N vagas" |
| Busca | "sao": 4 casas (as 3 de São Paulo e o Recanto São Francisco). "RIBEIRAO": 2. "pinheiros": Lar da Mel. "geladeira": lista vazia com saída |
| Filtros | cães: 8; gatos: 8; cães e gatos: 4; só com vagas: 10; gatos e só com vagas: 7 |
| Sobre | 12 casas, 5 cidades, 76 vagas |
| CEP | 01001-000 preenche Praça da Sé, Sé, São Paulo, SP; 99999-999: CEP não encontrado; modo avião: mensagem de falta de conexão |

Os textos dos selos e das mensagens podem variar, desde que digam a mesma coisa. Os números não.

## Critério 1 · Telas e navegação (20)

**O que conferir.** Faça este roteiro no celular:

1. Casas: toque em Lar da Mel. O Detalhe abre por cima das abas, com o nome no cabeçalho
2. Volte pelo botão do cabeçalho e pelo voltar do sistema (ou o gesto, no iPhone)
3. Nova casa, depois Cancelar: volta à Início sem salvar
4. Filtros: o modal sobe por cima; feche pelo gesto sem aplicar e confira que a lista não mudou
5. Detalhe de qualquer casa, Editar: o formulário vem preenchido e o título é "Editar casa". Mude a
   ocupação, salve, e confira o selo no Detalhe e na Início
6. Remover: Cancelar não remove; Remover tira a casa da lista e volta
7. Abas Favoritas e Sobre abrem, cada uma com ícone

No código: `app/(abas)/` com as três abas; `casa/[id].js`, `cadastro.js` e `filtros.js` fora do grupo;
`presentation: 'modal'` no filtros.

**Como pontuar.**

- 20: o roteiro inteiro funciona
- 15: um item falha, como Remover sem confirmação ou o título fixo no Detalhe
- 10: dois itens falham, ou Editar cria uma casa nova em vez de mudar a existente
- 5: só a pilha funciona, sem abas nem modal
- 0: sem Expo Router (o `App.js` ainda decide a tela)

**Erros comuns.** Detalhe dentro de `(abas)`, com a barra de abas embaixo dele; `router.push('/')`
depois de salvar, e o voltar leva de novo ao formulário; `onPress={router.push(...)}` sem arrow
function, que navega ao desenhar; o `id` comparado sem `Number(id)`, e o Detalhe sempre diz "não
encontrada".

Editar e Remover podem ter entrado só no commit da etapa 9: o enunciado permite. Não desconte.

## Critério 2 · Regras e estado (20)

**O que conferir.** Abra `src/regras/casas.js`:

- as funções do enunciado com esses nomes: `vagas`, `situacao`, `textoDaSituacao`, `tomDaSituacao`,
  `textoDeAceita`, `agruparPorCidade`, `buscarCasas`, `filtrarCasas`, `validarCasa`, `proximoId` e
  `resumoDasCasas`, mais a constante `LIMITE_POUCAS_VAGAS`
- nada de React, `useState` ou `Alert` no arquivo
- nenhuma lista recebida alterada: `sort` só sobre cópia (`[...lista]`), sem `push` na lista recebida

Depois confira os resultados da tabela do início deste guia e o contexto: cadastre uma casa (ela
aparece na seção da cidade), favorite (aparece na aba Favoritas e o coração muda no Detalhe), remova
uma favorita (some das duas abas) e veja os números da Sobre mudarem.

Em `src/contexts/CasasContext.js`: `useState` (não `useReducer`, que é do E42), `useCasas()` com
guarda, `alternarFavorita` criando um `Set` novo.

**Como pontuar.**

- 20: nomes, resultados e contexto certos
- 15: uma função com nome diferente, ou um resultado errado da tabela
- 10: regras escritas dentro das telas, funcionando; ou uma lista do estado alterada no lugar
- 5: a maior parte das regras falta ou dá resultado errado
- 0: sem `src/regras/casas.js`

**Erros comuns.**

- `casas.sort(...)` dentro de `agruparPorCidade`: ordena o estado do contexto no lugar, e a ordem muda
  em outras telas sem ninguém pedir
- `proximoId` como `casas.length + 1`: depois de remover uma casa, o próximo cadastro repete um id.
  Teste: remova a Associação Patinhas do Bem (id 3) e cadastre uma casa; ela ganha o id 12, o mesmo
  do Cantinho dos Bichanos, e tocar numa delas abre a outra
- busca sem tirar acento: "sao" não acha São Paulo
- `aceita.includes('cães')`, com acento, quando o dado é `'caes'`
- capacidade e ocupação comparadas como texto: `'9' > '10'` é `true`
- `favoritas.add(id); setFavoritas(favoritas)`: o mesmo `Set`, e a tela não atualiza

## Critério 3 · Formulário e CEP (20)

**O que conferir.** No Cadastro:

- toque em cada campo: celular com teclado de telefone, e-mail com @, CEP e números com teclado
  numérico, nome com maiúscula no início das palavras
- o Próximo pula para o campo seguinte; no iPhone, teclado numérico não tem Próximo: não desconte
- digite `11912345678` no celular: aparece `(11) 91234-5678`. `01001000` no CEP: `01001-000`
- Salvar com tudo vazio: uma mensagem embaixo de cada campo obrigatório, e nada é salvo
- saia de um campo inválido: a mensagem aparece na hora; ao corrigir, some
- ocupação maior que a capacidade é recusada
- com o teclado aberto, o botão Salvar continua alcançável rolando
- CEP: `01001-000`, `99999-999` e o celular em modo avião, com a tabela do início do guia. Depois de
  preenchido pelo CEP, os campos continuam editáveis

No código, `src/api/viacep.js` com `fetch`, `await` e o teste `if (dados.erro)`; no Cadastro, `try` e
`catch` em volta da busca e um estado para a espera.

**Como pontuar.**

- 20: tudo acima
- 15: falta uma parte, como a máscara de CEP ou o Próximo
- 10: erros só num `Alert` geral, sem mensagem no campo; ou o CEP sem tratar inexistente e falta de
  conexão
- 5: formulário sem validação
- 0: sem formulário

**Erros comuns.** `dados.erro === true`: a ViaCEP manda `"true"` em texto, e o CEP inexistente vira
"achado" com campos vazios. Busca disparada a cada tecla, com o CEP incompleto (a ViaCEP responde 400).
`fetch` sem `await`. Validação que conta os caracteres da máscara em vez dos números.

## Critério 4 · Tokens, tema e UI kit (15)

**O que conferir.** Na pasta do projeto:

```bash
git grep -n -E "#[0-9a-fA-F]{3,8}\b" -- src app ":!src/theme/tokens.js"
git grep -n -E "'(white|black|gray|grey)'" -- src app
```

Os dois devem vir vazios (`rgba` no `android_ripple` é aceitável). Troque o tema pelo botão e pelo
sistema, com o app aberto, e passe por todas as telas no escuro: nenhum bloco branco, nenhum texto
sumindo, relógio e bateria visíveis. Confira no README os números de contraste da etapa 2.

Kit: `src/components/ui/` com `Botao`, `Cartao`, `Badge`, `Campo`, `Estado` e o `index.js`;
procure `<Pressable` nas telas: os botões de texto devem ser `Botao`. `CartaoCasa` montado com
`Cartao` e `Badge`. Fonte própria com `useFonts` e `familia` nos tokens. Sobre ao lado do protótipo
(`materiais/projeto-6/prototipo-sobre.svg`): ícone, nome, números em 3 colunas, "Como funciona" com
3 linhas, botão de tema e rodapé.

**Como pontuar.**

- 15: tudo acima
- 11: uma cor literal fora do `tokens.js`, ou uma tela que ignora o kit
- 7: tema escuro com partes ilegíveis, ou o kit criado e pouco usado
- 3: só os tokens
- 0: cores e medidas soltas em todo lugar

**Erros comuns.** Cor dentro do `StyleSheet.create` (não acompanha o tema); `StatusBar style="auto"`
com o botão de tema; `fontWeight: 'bold'` sobre a fonte própria; a paleta da Lojinha copiada sem
mudança (desconte só se o enunciado foi ignorado de propósito; converse antes).

## Critério 5 · Responsividade, acessibilidade e estados (15)

**O que conferir.**

- celular deitado e, se tiver, tablet: o Detalhe põe a foto ao lado; a lista não estica de borda a
  borda
- fonte do sistema no máximo: nada cortado nos cartões, nos botões e no formulário
- TalkBack ou VoiceOver na Início: cada cartão é lido numa frase (nome, cidade, animais, vagas) e
  anunciado como botão; o coração diz "Favoritar" mais o nome e se está selecionado; os títulos de
  cidade são lidos como título
- alvos pequenos: coração e ícones com 44 por 44
- estados: Favoritas sem nenhuma, busca sem resultado e casa não encontrada usam o `Estado`; a espera
  do CEP mostra o carregando; favoritar faz o coração pulsar
- README com a tabela "Acessibilidade" e pelo menos 3 correções

**Como pontuar.**

- 15: tudo acima
- 11: falta uma parte, como a tabela no README ou o layout largo
- 7: acessibilidade parcial (coração sem rótulo, cartão lido em pedaços) ou um dos estados em branco
- 3: só os estados
- 0: nada desta lista

**Erros comuns.** Coração dentro do `Pressable` do cartão (o leitor lê os dois juntos, e o toque no
coração abre o Detalhe); `numColumns` trocado sem mudar a `key`; selo de vagas que só muda de cor.

## Critério 6 · Repositório e README (10)

**O que conferir.** `git log --oneline --date=short --format="%ad %s"`: 11 commits com as mensagens
do enunciado, em datas que acompanham os encontros. README com o que o app faz, como rodar, prints
(pelo menos um no tema escuro), a tabela de acessibilidade, decisões e pendências. Sem `node_modules/`
no repositório.

**Como pontuar.**

- 10: tudo acima
- 7: faltam até 3 commits de etapa, ou falta um item do README
- 4: um commit só, ou README sem prints
- 0: repositório privado ou sem README

## Check-in por etapa

No começo do bloco de projeto de cada encontro, 2 a 3 minutos: pergunte quem fez o commit da etapa
anterior, abra um repositório no projetor e olhe **uma** coisa. A tabela traz o commit da etapa e o que
olhar no encontro seguinte.

| Etapa | Commit | O que olhar |
|---|---|---|
| 1 · E30 | `etapa 1, projeto e tela Início` | `src/data/casas.js` igual ao do curso e o `flex: 1` na coluna de textos do cartão |
| 2 · E31 | `etapa 2, tokens e tema` | busca por `#` em `src/telas` vazia; a primária não é a da Lojinha |
| 3 · E32 | `etapa 3, toque, ícones, fotos e fonte` | o `style` do cartão como função de `pressed`; a casa sem foto com a pata |
| 4 · E33 | `etapa 4, UI kit e CartaoCasa` | o `Badge` por mapa e as regras de situação em `src/regras/casas.js` |
| 5 · E34 | `etapa 5, lista por cidade e busca` | `agruparPorCidade` sem `sort` na lista recebida; busca "sao" ao vivo |
| 6 · E35 | `etapa 6, formulário de cadastro` | `validarCasa` devolvendo um objeto de erros; o `ref` do Próximo |
| 7 · E36 | `etapa 7, pilha e CasasContext` | `useCasas()` com guarda; `Number(id)` no Detalhe |
| 8 · E37 | `etapa 8, abas, filtros e edição` | o rascunho do modal em `useState` local, gravado só no Aplicar |
| 9 · E38 | `etapa 9, responsividade e acessibilidade` | o rótulo do `CartaoCasa` e a tabela no README |
| 10 · E39 | `etapa 10, estados, animação e CEP` | `if (dados.erro)` no `viacep.js`; teste o 99999-999 ao vivo |
| 11 · E40 | `etapa 11, acabamento e entrega` | o link na página do projeto (painel do instrutor, aba Projetos) |

Etapa atrasada não perde ponto no check-in: anote e lembre que a nota é da entrega final.

## Sinais de cópia

- Todos os commits no mesmo dia, ou um commit só com o projeto inteiro
- Código da Lojinha com nomes trocados: variáveis `produto` e `itens`, `formatarPreco`, `categorias`,
  restos de carrinho, a mesma paleta e a mesma Galeria
- Dois alunos com os mesmos nomes incomuns, os mesmos comentários e os mesmos bugs
- Bibliotecas e padrões que o curso não usou até o E40: `useReducer`, Redux ou Zustand, `axios`,
  `react-hook-form`, `styled-components`, TypeScript, comentários em inglês por todo o código
- O aluno não explica o próprio código

**Como agir.** Converse em particular, sem acusar. Peça para explicar uma função (o
`agruparPorCidade`, por exemplo) e para mudar algo ao vivo: "troque o `LIMITE_POUCAS_VAGAS` para 5;
o que muda na Início?". Quem fez responde em um minuto. Se não souber, devolva o projeto para ajustes
com um prazo e o pedido de refazer a parte copiada, e siga a política da instituição para casos
repetidos. Ajuda de colega e consulta à aula não são cópia; código idêntico sem entendimento é.
