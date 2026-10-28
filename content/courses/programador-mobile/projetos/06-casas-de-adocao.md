---
title: "Projeto 6 · Casas de adoção"
summary: "App Expo para cadastrar e encontrar casas de adoção de cães e gatos: lista por cidade, cadastro validado com CEP, navegação, tema e acessibilidade."
section: Módulo Específico
module: layout-rn
opens: e30a-flexbox-no-react-native
due: e41a-do-briefing-ao-backlog
due_label: início do E41
passing_score: 70
required: true
rubric:
  - key: telas
    title: Telas e navegação
    points: 20
    description: "Abas Casas, Favoritas e Sobre; Detalhe e Cadastro na pilha e Filtros como modal; o voltar funciona em todo caminho; Editar abre o formulário preenchido e Remover pede confirmação."
  - key: regras
    title: Regras e estado
    points: 20
    description: "`src/regras/casas.js` com as funções do enunciado, puras e dando o resultado dos exemplos; `CasasContext` e `FiltrosContext` sem alterar listas recebidas; cadastrar, editar, remover e favoritar aparecem em todas as telas na hora."
  - key: formulario
    title: Formulário e CEP
    points: 20
    description: "Teclado certo em cada campo, Próximo levando ao campo seguinte, máscaras de celular e CEP, mensagem embaixo do campo que errou; o CEP preenche o endereço pela ViaCEP e trata a espera, o CEP inexistente e a falta de conexão."
  - key: visual
    title: Tokens, tema e UI kit
    points: 15
    description: "Nenhuma cor fora de `src/theme/tokens.js`; tema claro e escuro legíveis; fonte própria e ícones; `Botao`, `Cartao`, `Badge`, `Campo` e `Estado` em `src/components/ui/`, usados pelas telas; Sobre fiel ao protótipo."
  - key: acessibilidade
    title: Responsividade, acessibilidade e estados
    points: 15
    description: "Funciona em pé, deitado, em tablet e com fonte grande; o leitor de tela lê cada cartão e botão com rótulo e papel; alvos de 44 por 44; telas de vazio, erro e carregando; o coração pulsa ao favoritar."
  - key: entrega
    title: Repositório e README
    points: 10
    description: "Repositório público `casas-de-adocao` sem `node_modules/`, um commit por etapa com as mensagens do enunciado, README com o que o app faz, como rodar, prints (um no tema escuro), a tabela de acessibilidade e as pendências."
steps:
  - lesson: e30b-dimensoes-e-areas-seguras
    when: E30
    title: Projeto e tela Início
    summary: "Projeto `casas-de-adocao` no Expo Go, `src/data/casas.js` do curso e a Início com cabeçalho, chips e 3 cartões em Flexbox, dentro da área segura."
  - lesson: e31b-tema-claro-e-escuro
    when: E31
    title: Tokens e tema
    summary: "Paleta própria em `src/theme/tokens.js`, `TemaProvider` e `useTema`, Início sem nenhuma cor literal e botão de tema."
  - lesson: e32b-fontes-e-identidade-visual
    when: E32
    title: Toque, ícones, fotos e fonte
    summary: "Cartões tocáveis com feedback, ícones do Ionicons, fotos com `expo-image` e espaço reservado, fonte própria segurando a splash."
  - lesson: e33b-variantes-e-boas-praticas
    when: E33
    title: UI kit e CartaoCasa
    summary: "`Botao`, `Cartao`, `Badge` e `Campo` em `src/components/ui/`, o `CartaoCasa` com o selo de vagas e as regras de situação em `src/regras/casas.js`."
  - lesson: e34b-sectionlist-refresh-e-desempenho
    when: E34
    title: Lista por cidade e busca
    summary: "`SectionList` agrupada por cidade, busca sem acento, puxar para atualizar e lista vazia com saída."
  - lesson: e35b-validacao-e-feedback
    when: E35
    title: Formulário de cadastro
    summary: "Tela Cadastro com teclado certo, Próximo encadeado, máscaras e `validarCasa`; o `App.js` alterna entre Início e Cadastro."
  - lesson: e36b-stack-com-expo-router
    when: E36
    title: Pilha e CasasContext
    summary: "Expo Router com Início, Detalhe e Cadastro na pilha; as casas no `CasasContext`, e a casa cadastrada aparece na lista."
  - lesson: e37b-modais-links-e-fluxos
    when: E37
    title: Abas, filtros e edição
    summary: "Abas Casas, Favoritas e Sobre, favoritas, modal de filtros com `FiltrosContext`, editar e remover com confirmação."
  - lesson: e38b-acessibilidade-em-react-native
    when: E38
    title: Responsividade e acessibilidade
    summary: "Tablet, celular deitado e fonte grande com `useWindowDimensions`; rótulos, papéis e alvos de 44; auditoria com leitor de tela."
  - lesson: e39b-estados-de-carregamento-vazio-e-erro
    when: E39
    title: Estados, animação e CEP
    summary: "Componente `Estado`, coração que pulsa ao favoritar e o CEP que preenche o endereço pela ViaCEP."
  - lesson: e40b-revisao-layout-e-componentes
    when: E40
    title: Acabamento e entrega
    summary: "Tela Sobre a partir do protótipo, checklist de entrega de tela e README com prints."
---

## O que você vai construir

O **Casas de adoção** é um app de celular para cadastrar e encontrar abrigos e ONGs que cuidam de
cães e gatos. Quem é voluntário cadastra a casa onde ajuda; quem quer adotar acha uma casa com vaga
perto de casa, vê o horário de visitas e guarda as favoritas.

É o projeto mais completo do curso até aqui: um app Expo com várias telas, feito ao longo da unidade
de Layout, do E30 ao E40, num repositório seu chamado `casas-de-adocao`. A Lojinha é o laboratório
dessa unidade; este projeto usa os mesmos conceitos em outro assunto. Os dados são fictícios e ficam
na memória do app: ao recarregar, as casas voltam a ser as 12 do curso.

Assim fica a tela inicial no fim do projeto (as cores e a fonte são suas):

```plaintext
 Casas                                      (cabeçalho da aba)
 Buscar casa
 [ Nome, bairro ou cidade              ]
 [ Filtros (1) ]  [ + Nova casa ]
 12 de 12 casas · atualizado às 14:05
 Belo Horizonte, MG · 2 casas
 +-------------------------------------------+
 | [foto]  Associação Patinhas do Bem    (c) |
 |         Coração de Jesus, Belo Horizonte  |
 |         Cães e gatos                      |
 |         [ 12 vagas ]                      |
 +-------------------------------------------+
 | [foto]  Casa da Pipoca                (c) |
 |         ...               [ Última vaga ] |
 Campinas, SP · 3 casas
 ...
 [ Casas ]      [ Favoritas 2 ]      [ Sobre ]
```

`(c)` é o coração de favoritar. Os títulos das cidades ficam presos no topo enquanto a lista rola.

### Telas no fim do projeto

| Tela | Rota | O que faz |
|---|---|---|
| Início | `app/(abas)/index.js` | lista por cidade, busca, filtros e puxar para atualizar |
| Favoritas | `app/(abas)/favoritas.js` | só as casas marcadas com o coração |
| Sobre | `app/(abas)/sobre.js` | números do app e tema, feita a partir do protótipo do curso |
| Detalhe | `app/casa/[id].js` | tudo sobre uma casa, com Editar e Remover |
| Cadastro | `app/cadastro.js` | casa nova, ou edição quando recebe o `id` |
| Filtros | `app/filtros.js` | modal com aceita cães, aceita gatos e só com vagas |

### Estrutura final

```plaintext
casas-de-adocao/
├── app/
│   ├── _layout.js            pilha + TemaProvider + CasasProvider + FiltrosProvider
│   ├── (abas)/_layout.js     abas Casas, Favoritas e Sobre
│   ├── (abas)/index.js
│   ├── (abas)/favoritas.js
│   ├── (abas)/sobre.js
│   ├── casa/[id].js
│   ├── cadastro.js
│   └── filtros.js
├── src/
│   ├── data/casas.js         as 12 casas do curso
│   ├── regras/casas.js       regras puras (a seção Regras, abaixo)
│   ├── utils/                máscaras e validações de campo
│   ├── theme/                tokens.js e TemaContext.js
│   ├── components/ui/        Botao, Cartao, Badge, Campo, Estado e index.js
│   ├── components/CartaoCasa.js
│   ├── contexts/             CasasContext.js e FiltrosContext.js
│   ├── api/viacep.js
│   └── telas/                (opcional) as telas, se as rotas só reexportarem
└── README.md
```

Até a etapa 6, ainda sem Expo Router, as telas ficam em `src/telas/` e o `App.js` escolhe qual
mostrar, como na Lojinha. A partir da etapa 7, cada rota de `app/` pode reexportar a tela de
`src/telas/` (como no laboratório do E36) ou ter a tela dentro dela: as duas formas valem. Os nomes de
arquivos, componentes, contextos e funções desta página são obrigatórios: é por eles que o instrutor
encontra cada parte.

### Material do curso

- [casas.js](materiais/projeto-6/casas.js): as 12 casas fictícias em 5 cidades. Copie para
  `src/data/casas.js` na etapa 1 e não mude os dados: a correção confere a tela com eles
- [protótipo da tela Sobre](materiais/projeto-6/prototipo-sobre.svg), usado na etapa 11

Cada casa tem este formato:

```javascript
{
  id: 2,
  nome: 'Recanto São Francisco',
  responsavel: 'Paulo Henrique Sato',
  telefone: '(19) 99234-5602',
  email: 'recantosaofrancisco@email.com',
  cep: '13026-099',
  endereco: { logradouro: 'Rua Barão de Jaguara', numero: '210', bairro: 'Bosque', cidade: 'Campinas', uf: 'SP' },
  aceita: ['caes', 'gatos'],        // ['caes'], ['gatos'] ou os dois
  capacidade: 30,                   // quantos animais a casa comporta
  ocupacao: 22,                     // quantos estão lá hoje
  visitas: 'Sábados e domingos, das 10h às 16h',
  descricao: 'Canil e gatil separados no mesmo terreno...',
  foto: 'https://picsum.photos/id/1012/600/400',   // '' quando a casa não tem foto
}
```

## Regras

As regras de negócio moram em `src/regras/casas.js`, **puras**: recebem dados, devolvem dados novos,
não mexem na tela nem no estado e **nunca alteram a lista recebida**. Cada uma nasce na etapa em que
a tela precisa dela. Os exemplos usam os dados do curso (`casa2` é a casa de id 2).

### Vagas e situação (etapas 1 e 4)

```javascript
export const LIMITE_POUCAS_VAGAS = 3;

vagas(casa2);                   // 8 (capacidade 30, ocupação 22); nunca negativo
situacao(casa2);                // 'com-vagas'
situacao(casa1);                // 'lotada'        (0 vagas)
situacao(casa9);                // 'poucas-vagas'  (de 1 a LIMITE_POUCAS_VAGAS)
textoDaSituacao(casa1);         // 'Lotada'
textoDaSituacao(casa9);         // 'Última vaga'
textoDaSituacao(casa11);        // 'Últimas 2 vagas'
textoDaSituacao(casa2);         // '8 vagas'
tomDaSituacao(casa1);           // 'perigo'   (lotada)
tomDaSituacao(casa11);          // 'alerta'   (poucas vagas)
tomDaSituacao(casa2);           // 'sucesso'  (com vagas): os tons do Badge
textoDeAceita(['caes', 'gatos']); // 'Cães e gatos'; ['caes'] dá 'Só cães'; ['gatos'], 'Só gatos'
```

Com os dados do curso: 2 casas lotadas, 3 com poucas vagas e 7 com vagas.

### Lista, busca e filtros (etapas 5 e 8)

```javascript
agruparPorCidade(casas);
// [{ title: 'Belo Horizonte, MG', data: [2 casas] }, { title: 'Campinas, SP', data: [3 casas] }, ...]
// seções em ordem alfabética da cidade; dentro de cada uma, casas em ordem de nome

buscarCasas(casas, 'sao');      // 4 casas: as 3 de São Paulo e o Recanto São Francisco
buscarCasas(casas, 'RIBEIRAO'); // 2 casas
buscarCasas(casas, '');         // as 12
buscarCasas(casas, 'geladeira'); // []

filtrarCasas(casas, { caes: true, gatos: false, soComVagas: false });  // 8 casas
filtrarCasas(casas, { caes: true, gatos: true, soComVagas: false });   // 4: aceitam os dois
filtrarCasas(casas, { caes: false, gatos: false, soComVagas: true });  // 10
```

A busca olha nome, bairro e cidade, sem diferenciar maiúsculas e sem acento (o `semAcentos` do E06
serve). Cada filtro ligado restringe a lista; todos desligados devolvem tudo.

### Cadastro (etapas 6 e 7)

`validarCasa(valores)` recebe os valores do formulário (textos, e `true`/`false` nos dois `Switch`)
e devolve um objeto com uma chave por campo: a mensagem de erro ou `null`, como o `validarCadastro`
do E35. `proximoId(casas)` devolve o maior id mais 1 (13 com os dados do curso; 1 com a lista vazia).

| Campo | Regra | Exemplo de mensagem |
|---|---|---|
| `nome` | obrigatório, pelo menos 3 letras | Informe o nome da casa |
| `responsavel` | obrigatório | Informe quem responde pela casa |
| `telefone` | celular com DDD: 11 números | Celular com DDD: 11 números |
| `email` | formato nome@exemplo.com | Use o formato nome@exemplo.com |
| `cep` | 8 números (o `ehCepValido` do E06) | CEP com 8 números |
| `logradouro`, `numero`, `bairro`, `cidade` | obrigatórios | Informe o bairro |
| `uf` | uma das 27 siglas, como SP | UF com 2 letras, como SP |
| `aceita` | cães, gatos ou os dois | Marque cães, gatos ou os dois |
| `capacidade` | número inteiro de 1 a 500 | De 1 a 500 |
| `ocupacao` | inteiro de 0 até a capacidade | Não pode passar da capacidade |
| `visitas`, `descricao` | opcionais | |

As mensagens podem ser outras, desde que digam o que corrigir. Dica: duas funções pequenas ajudam
(nomes livres): uma monta a casa a partir dos valores do formulário (textos viram números, os dois
`Switch` viram o array `aceita`, os campos do endereço vão para `endereco`) e outra faz o caminho
de volta, para preencher o formulário na edição.

### Sobre (etapa 11)

```javascript
resumoDasCasas(casas); // { casas: 12, cidades: 5, vagas: 76 } com os dados do curso
```

### Contextos

`src/contexts/CasasContext.js` guarda as casas com `useState` (o `useReducer` só chega no E42) e
entrega, pelo `useCasas()`:

```javascript
const { casas, favoritas, adicionar, editar, remover, alternarFavorita } = useCasas();
// casas            a lista; começa com as 12 de src/data/casas.js
// favoritas        um Set com os ids marcados (o Set do E12)
// adicionar(dados) a casa nova ganha o id de proximoId(casas)       (etapa 7)
// editar(id, dados), remover(id), alternarFavorita(id)              (etapa 8)
```

`useCasas()` tem guarda: fora do `CasasProvider`, lança um erro com uma mensagem clara.
`src/contexts/FiltrosContext.js` entrega `{ filtros, setFiltros }` pelo `useFiltros()`, com
`filtros` no formato `{ caes, gatos, soComVagas }`.

### ViaCEP (etapa 10)

A ViaCEP devolve o endereço de um CEP, sem cadastro nem chave. Abra no navegador para ver:

```plaintext
https://viacep.com.br/ws/01001000/json/
{ "cep": "01001-000", "logradouro": "Praça da Sé", "bairro": "Sé", "localidade": "São Paulo", "uf": "SP", ... }

https://viacep.com.br/ws/99999999/json/
{ "erro": "true" }
```

`buscarEndereco(cep)`, em `src/api/viacep.js`, devolve `{ logradouro, bairro, cidade, uf }`
(`cidade` vem de `localidade`) ou `{ erro: true }` quando o CEP não existe. Sem conexão, a Promise é
rejeitada, e quem chama trata com `try`/`catch`.

:::warning O erro vem como texto
Para CEP que não existe, a ViaCEP responde `200` com `"erro": "true"`, o `true` **entre aspas**.
`dados.erro === true` dá `false` e o app trataria o CEP inexistente como achado. Teste com
`if (dados.erro)`.
:::

## Etapas

Uma etapa por encontro, apresentada no fim da aula. Cada uma cabe nos 15 minutos de projeto do
encontro mais até 1 hora em casa. Termine com um commit com a mensagem indicada e o `git push`: no
bloco de projeto do encontro seguinte, o instrutor faz um check-in rápido no histórico.

### Etapa 1 · E30: projeto e tela Início

1. Ao lado da `lojinha`, crie o projeto e instale a área segura:

   ```bash
   npx create-expo-app@latest casas-de-adocao --template blank
   cd casas-de-adocao
   npx expo install react-native-safe-area-context
   ```

   No `app.json`, `"orientation": "default"`
2. Copie o [casas.js](materiais/projeto-6/casas.js) do curso para `src/data/casas.js`
3. Crie `src/regras/casas.js` com a primeira regra, `vagas(casa)`
4. `src/telas/Inicio.js` dentro da `SafeAreaView`, com a `StatusBar`:
   - cabeçalho em linha: "Casas de adoção" à esquerda e uma caixa de 32 reservando o ícone
   - uma linha de chips "Todas", "Cães", "Gatos" e "Com vagas", só visual, que quebra com `flexWrap`
     e se espaça com `gap`
   - 3 cartões com as 3 primeiras casas (`slice` e `map`): caixa cinza de 80 por 80 no lugar da foto,
     e ao lado o nome, "bairro, cidade" e "N vagas" (com a sua `vagas`)
5. `App.js`: só o `SafeAreaProvider` em volta da `<Inicio />`
6. Repositório público `casas-de-adocao` no GitHub, com um README de duas linhas: o que é e como rodar

Pronto quando: só `View`, `Text`, `ScrollView` e Flexbox; nenhuma altura fixa em bloco com texto;
um nome longo quebra sem empurrar o cartão para fora; nada atrás do notch, em pé e deitado.

Commit: `Projeto 6: etapa 1, projeto e tela Início`.

### Etapa 2 · E31: tokens e tema

1. `src/theme/tokens.js` com a **sua** paleta (escolha uma cor primária que não seja a da Lojinha):
   `cores.claro` e `cores.escuro` com os mesmos papéis (`fundo`, `superficie`, `borda`, `texto`,
   `textoSuave`, `primaria`, `perigo`, `sucesso`), mais `espaco`, `fonte` e `raio`
2. `src/theme/TemaContext.js`: a receita do E31 (pode ser igual à da aula)
3. `"userInterfaceStyle": "automatic"` no `app.json` e o `TemaProvider` no `App.js`
4. Início: estrutura e medidas no `StyleSheet`, com tokens; cores do `useTema()`, no array de `style`
5. Um botão no cabeçalho alterna o tema, e a `StatusBar` acompanha

Confira o contraste: `textoSuave` e `primaria` sobre `superficie` com pelo menos 4,5 : 1 nos dois
temas (um verificador de contraste na web faz a conta). Anote os quatro números no README.

Pronto quando: a busca por `#` em `src/telas` não acha nada; o app segue o tema do sistema e o botão.

Commit: `Projeto 6: etapa 2, tokens e tema`.

### Etapa 3 · E32: toque, ícones, fotos e fonte

1. `npx expo install expo-image expo-font expo-splash-screen @expo/vector-icons` e o pacote da sua
   fonte: a Inter (`@expo-google-fonts/inter`) ou outra família do `@expo-google-fonts`, em dois pesos
2. Cartão inteiro tocável: `Pressable` com o estilo de `pressed` e `android_ripple`. Por enquanto, o
   toque mostra um `Alert` com o nome da casa e o horário de visitas (o Detalhe chega na etapa 7)
3. Ícones do `Ionicons` com cores do tema: a pata (`paw`) no lugar da caixa do cabeçalho,
   `location-outline` ao lado do bairro e um `heart-outline` no canto do cartão, ainda sem ação, com
   alvo de 44 por 44
4. Foto da casa com `expo-image`: tamanho fixo, `contentFit`, `placeholder` e `transition`. Casa com
   `foto: ''` mostra a pata numa caixa da cor da borda, nunca um buraco
5. Fonte com `useFonts`, a splash segurando até carregar ou falhar, os nomes em `familia` no
   `tokens.js` e nenhum `fontWeight` sobre a fonte própria

Pronto quando: todo toque tem retorno visual; nenhum alvo menor que 44 por 44; as fotos chegam com
o espaço reservado; a fonte própria está em todos os textos, nos dois temas.

Commit: `Projeto 6: etapa 3, toque, ícones, fotos e fonte`.

### Etapa 4 · E33: UI kit e CartaoCasa

1. Acrescente `alerta` aos dois temas do `tokens.js`
2. `src/components/ui/` com o seu kit, cada peça com `style` de fora no fim do array e `...rest`:
   - `Botao`: `titulo`, `onPress`, `variante` (`primaria`, `secundaria`, `fantasma`), `tamanho`
     (`sm`, `md`, `lg`), `icone` e `desabilitado`
   - `Cartao`: moldura com `children`
   - `Badge`: `texto` e `tom` (`neutro`, `sucesso`, `alerta`, `perigo`), por mapa, sem fileira de `if`
   - `Campo`: `rotulo` e o `TextInput` (a prop `erro` chega na etapa 6)
   - `index.js` reexportando as peças

   Peças de kit servem em qualquer app: pode partir do kit que você escreveu na Lojinha, desde que
   cada peça use os tokens deste projeto. O `CartaoCasa` e as regras são novos.
3. Em `src/regras/casas.js`: `LIMITE_POUCAS_VAGAS`, `situacao`, `textoDaSituacao`, `tomDaSituacao`
   e `textoDeAceita`
4. `src/components/CartaoCasa.js`, montado com `Cartao` e `Badge`: recebe `casa` e `onPress` e mostra
   foto, nome, bairro e cidade, `textoDeAceita` e o selo de vagas. O cartão não decide nada: o selo
   vem das regras, e o toque, da tela
5. A Início mostra as 12 casas com `CartaoCasa` (ainda num `ScrollView` com `map`) e um `Botao`
   "Nova casa", que por enquanto não faz nada

Pronto quando: nenhuma cor fora dos tokens no kit; Lotada, Últimas 2 vagas e 8 vagas aparecem com
tons diferentes **e** com o texto; um `accessibilityLabel` passado ao `Botao` chega ao `Pressable`.

Commit: `Projeto 6: etapa 4, UI kit e CartaoCasa`.

### Etapa 5 · E34: lista por cidade e busca

1. Em `src/regras/casas.js`: `agruparPorCidade` e `buscarCasas`
2. A Início troca o `ScrollView` por uma `SectionList` com as seções de `agruparPorCidade`:
   - key estável (`String(item.id)`) e separador entre os cartões
   - cabeçalho de seção com a cidade e a quantidade ("Campinas, SP · 3 casas"), preso no topo com
     `stickySectionHeadersEnabled` e com cor de fundo
3. Busca: um `Campo` controlado acima da lista; a lista mostra `buscarCasas(casas, termo)`
4. Puxar para atualizar com `RefreshControl` nas cores do tema: por enquanto, um `setTimeout` de
   1 segundo que atualiza um "atualizado às" no topo da lista
5. Lista vazia com saída: `ListEmptyComponent` com ícone, a mensagem "Nenhuma casa encontrada" e um
   botão "Limpar busca"

Pronto quando: 5 seções na ordem certa; "sao" mostra 4 casas; "geladeira" mostra o aviso e o botão
limpa a busca; a rodinha para sozinha; nenhum `ScrollView` em volta da lista.

Commit: `Projeto 6: etapa 5, lista por cidade e busca`.

### Etapa 6 · E35: formulário de cadastro

1. `Campo` ganha a prop `erro`: borda na cor `perigo` e a mensagem embaixo, em texto
2. Em `src/utils/`: as máscaras de celular e CEP e o `ehCepValido` (as suas do `lojinha-regras`
   servem) e as validações de campo do E35 (`validarObrigatorio`, `validarEmail`, `validarTelefone`
   e `temErros`)
3. Em `src/regras/casas.js`: `validarCasa(valores)`, com as regras da tabela
4. `src/telas/Cadastro.js` com nome, responsável, celular, e-mail, CEP, rua, número, bairro, cidade,
   UF, capacidade e ocupação, mais visitas e descrição opcionais:
   - teclado certo em cada campo (`phone-pad`, `email-address`, `number-pad`) e `autoCapitalize`
     adequado
   - `returnKeyType="next"` e `onSubmitEditing` com `useRef`: o Próximo leva ao campo seguinte
   - `Switch` para "Aceita cães" e "Aceita gatos"
   - `KeyboardAvoidingView` e `ScrollView` com `keyboardShouldPersistTaps="handled"`: o teclado
     não cobre o botão Salvar
   - o erro de cada campo aparece ao sair dele (`onBlur`) e todos aparecem ao salvar
5. `App.js`: um `useState` com a tela da vez (`'inicio'` ou `'cadastro'`). O "Nova casa" da Início
   abre o Cadastro; Cancelar volta. Sem erros, Salvar mostra um `Alert` e volta para a Início (a casa
   entra na lista de verdade na etapa 7)

```jsx
// o contrato entre o App e as telas nesta etapa
<Inicio onNovaCasa={() => setTela('cadastro')} />
<Cadastro onSalvar={salvar} onCancelar={() => setTela('inicio')} />
```

Por enquanto, rua, bairro, cidade e UF são digitados; na etapa 10, o CEP preenche esses campos.

Pronto quando: o formulário vazio mostra uma mensagem embaixo de cada campo obrigatório e não
salva; `(11) 9123` no celular, `ana@` no e-mail e ocupação maior que a capacidade são recusados; o
Próximo percorre o formulário até a ocupação.

Commit: `Projeto 6: etapa 6, formulário de cadastro`.

### Etapa 7 · E36: pilha e CasasContext

1. Instale o Expo Router como na aula 71, troque o `main` do `package.json` para
   `expo-router/entry` e dê ao app um `scheme` próprio no `app.json` (`casasdeadocao`). O `App.js` sai
2. `app/_layout.js`: as fontes e a splash que estavam no `App.js`, o `TemaProvider` e o
   `CasasProvider` por fora da pilha, e o cabeçalho nas cores do tema
3. `src/contexts/CasasContext.js` com `casas` (as de `src/data/casas.js`) e `adicionar(dados)`; o id
   da casa nova vem de `proximoId(casas)`, a regra que entra agora em `src/regras/casas.js`
4. Rotas:
   - `app/index.js`: a Início, agora lendo as casas do `useCasas()`
   - `app/casa/[id].js`: o Detalhe, com foto grande, nome no cabeçalho, selo de vagas, endereço
     completo, responsável, celular, e-mail, visitas e descrição. O `id` chega como texto: compare com
     `Number(id)`, e mostre "Casa não encontrada" quando não achar
   - `app/cadastro.js`: Salvar chama `adicionar` e `router.back()`
5. Tocar num `CartaoCasa` abre o Detalhe com `router.push('/casa/' + casa.id)`; "Nova casa" abre o
   Cadastro

Pronto quando: Início, Detalhe e voltar funcionam com o botão do cabeçalho e com o voltar do
sistema; a casa cadastrada aparece na seção da cidade dela; com id inexistente, o Detalhe não quebra.

Commit: `Projeto 6: etapa 7, pilha e CasasContext`.

### Etapa 8 · E37: abas, filtros e edição

1. `app/(abas)/_layout.js` com `Tabs`: Casas (a Início, que vai para `app/(abas)/index.js`),
   Favoritas e Sobre, com ícones e cores do tema. A Sobre por enquanto mostra o nome do app e o botão
   de tema; a definitiva é a etapa 11. Na pilha raiz, `(abas)` sem cabeçalho; Detalhe, Cadastro e
   Filtros ficam fora das abas
2. Favoritas: `favoritas` (um `Set`) e `alternarFavorita(id)` no `CasasContext`, devolvendo sempre um
   `Set` novo; o coração do `CartaoCasa` e um coração no Detalhe ligam e desligam; a aba Favoritas
   lista só as marcadas, com um aviso quando não houver nenhuma
3. Filtros: `src/contexts/FiltrosContext.js`, a regra `filtrarCasas` e `app/filtros.js` como modal
   (`presentation: 'modal'`), com três `Switch` num rascunho local, Aplicar (`setFiltros` e
   `router.back()`) e Limpar. A Início mostra `buscarCasas(filtrarCasas(casas, filtros), termo)` e o
   botão diz quantos filtros estão ligados: "Filtros (2)"
4. Editar: no Detalhe, `router.push('/cadastro?id=' + casa.id)`. O Cadastro lê o `id` com
   `useLocalSearchParams()`: sem `id`, casa nova; com `id`, o formulário vem preenchido, o título
   vira "Editar casa" e Salvar chama `editar(id, dados)`
5. Remover: no Detalhe, um `Alert` com Cancelar e Remover; só o Remover chama `remover(id)` e volta.
   Remover também tira a casa das favoritas

:::tip Etapa longa
É a etapa com mais coisas do projeto. Se não der tempo, faça abas, favoritas e filtros nesta
semana; **Editar e Remover podem chegar até o commit da etapa 9** sem perder ponto. Diga no README
em que commit eles entraram.
:::

Pronto quando: as três abas funcionam e o contador da aba Favoritas acompanha (opcional:
`tabBarBadge`); o modal fecha com Aplicar e com o gesto, e desistir não muda a lista; editar muda a
casa em todas as telas; Cancelar no `Alert` não remove nada.

Commit: `Projeto 6: etapa 8, abas, filtros e edição`.

### Etapa 9 · E38: responsividade e acessibilidade

1. `useWindowDimensions`: a partir de 600 de largura (tablet ou celular deitado), o Detalhe põe a
   foto ao lado das informações, e a lista, o formulário e as outras telas ganham largura máxima
   (`maxWidth` com `alignSelf: 'center'`). Opcional: Favoritas em 2 colunas, com `numColumns` e a
   `key` que muda junto
2. Celular deitado, tablet (ou emulador) e fonte do sistema no máximo sem nada cortado:
   `minHeight` no lugar de `height` e `flexShrink` em texto que divide a linha
3. `CartaoCasa` como um foco só: `accessibilityRole="button"`, um rótulo com nome, cidade, animais
   e vagas e a dica "Abre os detalhes da casa". O coração fica fora do `Pressable` do cartão, com o
   rótulo "Favoritar" mais o nome e `accessibilityState={{ selected: favorita }}`
4. Vagas sempre escritas no `Badge`, não só na cor; títulos de cidade com `accessibilityRole="header"`;
   `Switch` com rótulo; todo alvo com 44 por 44 (tamanho ou `hitSlop`)
5. Auditoria com TalkBack ou VoiceOver na Início, no Detalhe e no Cadastro. O README ganha a tabela
   "Acessibilidade" com pelo menos 3 correções: tela, problema, correção

Pronto quando: o leitor de tela lê cada cartão numa frase só e diz se a casa é favorita; nada sai da
tela deitado ou com fonte grande.

Commit: `Projeto 6: etapa 9, responsividade e acessibilidade`.

### Etapa 10 · E39: estados, animação e CEP

1. `src/components/ui/Estado.js`, um componente com a prop `tipo` (`'carregando'`, `'vazio'` ou
   `'erro'`, por mapa, como o `Badge`), `titulo`, `mensagem` e uma ação opcional (`textoAcao` e
   `onAcao`). Reexporte no `index.js` e use em: Favoritas sem nenhuma, busca sem resultado e casa não
   encontrada
2. O coração pulsa ao favoritar: `Animated.Value` num `useRef`, `Animated.spring` na escala e
   `useNativeDriver: true`
3. `src/api/viacep.js` com `buscarEndereco(cep)`: `fetch`, `async`/`await` e o JSON da seção ViaCEP
4. No Cadastro, quando o CEP fica com 8 números:
   - durante a espera, "Buscando endereço..." com um `ActivityIndicator`
   - achou: preenche rua, bairro, cidade e UF e leva o foco ao número
   - CEP inexistente: "CEP não encontrado" embaixo do campo
   - sem conexão: uma mensagem no campo para preencher à mão
   - em todos os casos, os campos continuam editáveis e o formulário continua salvando

Teste com `01001-000` (Praça da Sé), `99999-999` (não existe) e com o celular em modo avião.

Commit: `Projeto 6: etapa 10, estados, animação e CEP`.

### Etapa 11 · E40: acabamento e entrega

O E40 tem a Prova 4: em aula, a etapa é curta; o grosso fica para casa.

1. A tela Sobre fiel ao [protótipo](materiais/projeto-6/prototipo-sobre.svg), com tokens no lugar dos
   números do desenho e os totais de `resumoDasCasas(casas)`, lidos do contexto (mudam ao cadastrar)
2. O checklist de entrega de tela da aula 78 em todas as telas: os estados, o leitor de tela, fonte
   em 200%, os dois temas e o celular deitado. O que ficar faltando vai para "Pendências" no README
3. README final: o que o app faz, como rodar (`npm install` e `npx expo start`), prints das telas
   (pelo menos um no tema escuro), a tabela de acessibilidade, as decisões que você tomou e as
   pendências
4. Link do repositório na página deste projeto até o **início do E41**

:::example Protótipo: Sobre
- Frame de 390 de largura, tema claro, margem lateral de 16
- Topo centralizado: círculo de 72 na cor primária com a pata de 36 na cor do fundo
- 16 abaixo: "Casas de adoção", negrito, tamanho de título; 4 abaixo, "Adote perto de você", corpo,
  texto suave
- 24 abaixo: cartão com 3 colunas iguais: número em negrito tamanho destaque, na primária, e o rótulo
  pequeno em texto suave (casas, cidades, vagas)
- 24 abaixo: "Como funciona", negrito; um cartão com 3 linhas de 56 de altura, cada uma com ícone de
  24 na primária e texto: Busque a cidade, Marque a visita, Cadastre a casa; linha da cor da borda
  entre elas
- 32 abaixo: botão secundário "Tema escuro" com ícone de lua (no tema escuro, "Tema claro")
- 16 abaixo: "Dados fictícios", pequeno, texto suave, centralizado
:::

Commit: `Projeto 6: etapa 11, acabamento e entrega`.

## Como entregar

1. Repositório **público** `casas-de-adocao` no seu GitHub, sem `node_modules/` (o `.gitignore` do
   Expo já cuida disso)
2. Um commit por etapa, com as mensagens acima, e o último `git push` feito
3. README com o que o app faz, como rodar, prints, a tabela de acessibilidade e as pendências
4. Na página deste projeto, cole o link do repositório. Link de demonstração é opcional; o endereço
   `exp://` do `npx expo start` não serve, porque some quando o seu computador desliga

**Prazo: início do E41.** O instrutor corrige pela rubrica, critério por critério, e pode devolver o
projeto para ajustes antes da nota final. Aprovação com 70.

## Como será avaliado

A correção roda o app no Expo Go com os dados do curso e lê o código. Antes de entregar, confira
cada critério você mesmo.

- **Telas e navegação (20).** Nota cheia: as seis telas, cada uma no lugar certo (abas, pilha e
  modal), o voltar funcionando em todo caminho, Editar preenchido e Remover com confirmação.
  Parcial: Remover sem confirmação, Editar que cria uma casa nova em vez de mudar a existente, ou o
  Detalhe aberto dentro de uma aba, com a barra de abas embaixo dele.
- **Regras e estado (20).** Nota cheia: as funções da seção Regras com os nomes do enunciado e os
  resultados dos exemplos, sem alterar a lista recebida, e o contexto mudando todas as telas na hora.
  Parcial: regra dentro da tela em vez de `src/regras/casas.js`, busca que não acha "sao", ou
  `push` direto na lista do estado.
- **Formulário e CEP (20).** Nota cheia: teclado e Próximo certos, máscaras, mensagem embaixo do
  campo que errou e o CEP tratando os três casos (achou, não existe, sem conexão). Parcial: erro só
  num `Alert` geral, ou CEP inexistente tratado como achado (o `"true"` em texto).
- **Tokens, tema e UI kit (15).** Nota cheia: nenhuma cor literal fora do `tokens.js`, dois temas
  legíveis, o kit usado pelas telas e a Sobre fiel ao protótipo. Parcial: um cartão que fica branco
  no tema escuro, ou o kit criado mas cada tela com o seu próprio `Pressable` de botão.
- **Responsividade, acessibilidade e estados (15).** Nota cheia: deitado, tablet e fonte grande sem
  corte; leitor de tela lendo cartões e botões; alvos de 44; os três estados e o coração animado.
  Parcial: coração só com ícone, sem rótulo, ou lista vazia em branco.
- **Repositório e README (10).** Nota cheia: um commit por etapa com as mensagens do enunciado e o
  README completo. Parcial: commits todos no último dia ou README sem prints.

## Para ir além

Opcional e sem ponto extra:

- Depois do E43: guardar casas e favoritas com o AsyncStorage, para que sobrevivam ao fechar o app
- Depois do E42: testes das regras de `src/regras/casas.js` com o `jest-expo`
- Um botão "Ligar" no Detalhe que abre o discador com `Linking.openURL('tel:' + numero)`
- Uma tela Galeria com todas as variantes do seu kit, nos dois temas
- Ordenar a lista por mais vagas, além de por cidade

## Dúvidas frequentes

**Posso copiar código da Lojinha?** Os conceitos, sim; o código, não. Telas, `CartaoCasa`,
contextos e regras são do seu domínio e com os nomes desta página. As exceções: as receitas que a
aula manda copiar (o `TemaContext` e o carregamento das fontes) e o seu próprio UI kit (`Botao`,
`Cartao`, `Badge`, `Campo`), que é genérico por definição, usando os tokens deste projeto.

**Aparece `Unable to resolve "@expo/vector-icons"`.** No Expo atual, o pacote não vem no projeto
novo. Rode `npx expo install @expo/vector-icons` dentro de `casas-de-adocao` e `npx expo start -c`.

**A foto não aparece.** Imagem remota precisa de largura e altura. Se a casa tem `foto: ''`, o certo
é a pata no lugar; sem internet, fica o espaço reservado.

**As casas que cadastrei somem quando recarrego o app.** É o esperado: os dados ficam na memória.
Guardar no aparelho é o "Para ir além" do E43.

**No laboratório o grupo das abas é `(tabs)`; aqui é `(abas)`. Faz diferença?** Não. O nome entre
parênteses é seu e não entra no endereço; use `(abas)`, como na estrutura acima.

**O CEP 01001-000 não preenche nada.** Confira se a busca roda com o CEP completo, se o `fetch` tem
`await` e se o `if (dados.erro)` não está ao contrário. No emulador, confira se ele tem internet.

**Atrasei uma etapa. Perco ponto?** A nota é da entrega final. O commit de cada etapa serve para o
check-in e para mostrar o caminho; faça-o com o nome da etapa quando terminar.

**Posso usar outra fonte ou outras cores?** Deve: a paleta é sua desde a etapa 2, e a fonte, desde a
etapa 3. Só confira o contraste nos dois temas.
