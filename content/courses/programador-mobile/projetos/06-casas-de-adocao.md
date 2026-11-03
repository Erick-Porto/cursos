---
title: "Projeto 6 · Casas de adoção"
summary: "App Expo com Expo Router para encontrar casas de adoção de cães e gatos: telas montadas com um UI kit pronto e o seu CartaoCasa."
section: Módulo Específico
module: layout-rn
opens: e33-flexbox-e-areas-seguras
due: e41-do-briefing-ao-backlog
due_label: início do E41
passing_score: 70
required: true
rubric:
  - key: inicio
    title: Início com flexbox, tokens e tema
    points: 20
    description: "Topo em linha com o botão de tema, os três números lado a lado e os cartões, tudo dentro da Tela; nenhum código de cor em app/, espaços, raios e letras com os tokens e cores do useTema(); claro e escuro legíveis."
  - key: cartao
    title: O seu CartaoCasa
    points: 20
    description: "`src/components/CartaoCasa.js` com as props `casa` e `onPress`; foto remota ou a pata no lugar; ícones de lugar e de animais; o cartão fica mais transparente no toque; o selo com o texto e o tom da tabela de vagas."
  - key: lista-navegacao
    title: Lista, busca e navegação
    points: 20
    description: "FlatList com keyExtractor; busca por nome, bairro e cidade sem diferença de acento; lista vazia com Limpar busca; puxar para atualizar; Detalhe em `app/casa/[id].js` com `Number(id)`; abas Casas e Sobre; Outras casas com Link."
  - key: cadastro
    title: Cadastro de casa
    points: 20
    description: "Formulário com os sete campos do enunciado, teclado certo em cada um, mensagem embaixo de cada campo com erro, ocupação que não passa da capacidade, e a casa nova no topo da lista."
  - key: estados
    title: Estados e acessibilidade
    points: 10
    description: "Carregando, erro com Tentar de novo e lista vazia com as duas mensagens; o leitor de tela lê cada cartão numa frase só; duas colunas em tela larga."
  - key: entrega
    title: Repositório e README
    points: 10
    description: "Repositório público `casas-de-adocao` sem `node_modules/`, um commit por etapa com as mensagens do enunciado e o README com o que o app faz, como rodar, o que você criou e os prints."
steps:
  - lesson: e33-flexbox-e-areas-seguras
    when: E33
    title: Kit no celular e tela Início
    summary: "Kit aberto no Expo Go e no GitHub; a Início com a Tela, o topo em linha, os números lado a lado e os 12 cartões, em Flexbox."
  - lesson: e34-tokens-e-tema
    when: E34
    title: Tokens e tema
    summary: "Números do StyleSheet trocados por tokens, cores do useTema(), o botão de tema e a sua cor primária."
  - lesson: e35-componentes-proprios
    when: E35
    title: CartaoCasa
    summary: "O seu componente CartaoCasa, com foto remota, ícones, retorno ao toque e o selo de vagas."
  - lesson: e36-listas-no-app
    when: E36
    title: Lista com busca
    summary: "FlatList com as casas do useCasas(), busca por nome, bairro e cidade, lista vazia e puxar para atualizar."
  - lesson: e37-navegacao
    when: E37
    title: Detalhe e abas
    summary: "Rota `casa/[id]` com o Detalhe da casa, abas Casas e Sobre e as outras casas da cidade com Link."
  - lesson: e38-formularios
    when: E38
    title: Cadastro de casa
    summary: "Formulário com teclado certo, validação por campo e a casa nova no topo da lista."
  - lesson: e39-estados-e-acessibilidade
    when: E39
    title: Estados, acessibilidade e entrega
    summary: "Carregando, erro e vazio, rótulos para o leitor de tela, duas colunas em tela larga, README com prints e entrega."
---

## O que você vai construir

O **Casas de adoção** é um app de celular para encontrar abrigos e ONGs que cuidam de cães e gatos:
quem quer adotar acha uma casa com vaga, vê o endereço e o horário de visitas, e quem é voluntário
cadastra a casa onde ajuda.

Você parte de um **kit**: um app Expo com Expo Router, as peças de tela prontas (o UI kit), os tokens
de design, o tema claro e escuro e os dados de 12 casas fictícias. Você **monta as telas** encaixando
as peças do kit com Flexbox, tokens e tema, e **cria um componente seu**, o `CartaoCasa`. Cada etapa é
feita em aula, de E33 a E39, num repositório seu chamado `casas-de-adocao`.

Assim fica a tela Início no fim do projeto:

```plaintext
 Casas de adoção                         ( lua )
 Adote perto de você
 +-----------+  +-----------+  +-----------+
 |    12     |  |     5     |  |    76     |
 |   casas   |  |  cidades  |  |   vagas   |
 +-----------+  +-----------+  +-----------+
 [ +  Cadastrar casa                        ]
 Buscar casa
 [ lupa  Nome, bairro ou cidade             ]
 +------------------------------------------+
 | [foto]  Lar da Mel                        |
 |         (pino) Pinheiros, São Paulo       |
 |         (pata) Cães                       |
 |         [ Lotada ]                        |
 +------------------------------------------+
 | [foto]  Recanto São Francisco             |
 ...
 [ Casas ]                        [ Sobre ]
```

| Tela | Arquivo no fim | O que faz |
|---|---|---|
| Início | `app/(abas)/index.js` | topo, números, busca e a lista de casas |
| Sobre | `app/(abas)/sobre.js` | pronta no kit: o que é o app, os números e o botão de tema |
| Detalhe | `app/casa/[id].js` | tudo sobre uma casa e as outras casas da mesma cidade |
| Cadastro | `app/cadastro.js` | o formulário de uma casa nova |

### Material do curso

- [kit-casas.zip](materiais/projeto-6/kit-casas.zip): o ponto de partida. Descompacte, renomeie a
  pasta para `casas-de-adocao` e siga a etapa 1

Versões do kit: Expo SDK 58 (`expo` 58.0.23), React Native 0.88.1, React 19.3.0 e Expo Router 58.0.30.
Abra no **Expo Go** da loja de aplicativos, atualizado. O `package-lock.json` vem junto para toda a
turma instalar as mesmas versões: rode `npm install` e não apague o lock.

### Pastas do kit

```plaintext
casas-de-adocao/
├── app/                      as telas: cada arquivo é uma rota do Expo Router
│   ├── _layout.js            o que envolve todas as telas: tema, lista de casas e a pilha
│   ├── index.js              Início (etapas 1 a 4; no E37 vai para app/(abas)/)
│   ├── cadastro.js           Cadastro (etapa 6)
│   └── sobre.js              Sobre, pronta (no E37 vai para app/(abas)/)
├── src/
│   ├── components/ui/        o UI kit pronto
│   ├── theme/                tokens.js, o useTema e a aparência da navegação
│   ├── data/                 casas.js, o servidor de mentira e o useCasas
│   └── utils/                paraBusca e resumoDasCasas
├── jsconfig.json             cria o atalho @ para a pasta src/
└── package.json, package-lock.json, app.json
```

O `@` nos imports é um atalho para a pasta `src/`: `import { Botao } from '@/components/ui'` funciona
em qualquer arquivo, em qualquer pasta. Os nomes de arquivos, componentes e props desta página são
obrigatórios: é por eles que o instrutor encontra cada parte.

## Componentes do kit

Cada peça tem, no topo do próprio arquivo, um comentário com as props que recebe. Todas usam os
tokens e as cores do tema: no tema escuro, elas escurecem sozinhas.

| Peça | Props | O que mostra |
|---|---|---|
| `Tela` | `rolar`, `comCabecalho`, `style` | o fundo do tema e a área segura, com padding e gap de 16 |
| `Cartao` | `titulo`, `style` | moldura com fundo, borda e cantos arredondados |
| `Badge` | `texto`, `tom` | selo pequeno; tons `neutro`, `sucesso`, `alerta` e `perigo` |
| `Botao` | `titulo`, `onPress`, `variante`, `icone`, `desabilitado` | botão `primaria`, `secundaria` ou `perigo` |
| `BotaoIcone` | `icone`, `rotulo`, `onPress`, `cor` | botão redondo só com ícone, alvo de 48 por 48 |
| `Campo` | `rotulo`, `erro`, `icone` e as props do `TextInput` | rótulo, caixa de texto e erro embaixo |
| `Opcoes` | `rotulo`, `opcoes`, `valor`, `onMudar`, `erro` | fileira de botões para escolher uma opção |
| `LinhaInfo` | `icone`, `texto` | uma linha com ícone e texto (some sem texto) |
| `EstadoVazio` | `titulo`, `mensagem`, `icone`, `textoAcao`, `onAcao` | aviso de "nada aqui", com ação opcional |
| `EstadoErro` | `mensagem`, `titulo`, `onTentarDeNovo` | aviso de erro com o botão Tentar de novo |
| `Carregando` | `texto` | a rodinha de espera com um texto |

Importe as peças de `@/components/ui`. Fora delas, o kit traz:

```javascript
import { espaco, fonte, raio, useTema } from '@/theme';
const { cores, escuro, alternarTema } = useTema();
// cores: a paleta do tema da vez (cores.texto, cores.primaria...); escuro: true ou false

import { useCasas } from '@/data/CasasContext';
const { casas, carregando, atualizando, erro, recarregar, adicionarCasa } = useCasas();

import { paraBusca, resumoDasCasas } from '@/utils';
paraBusca('São Paulo');  // 'sao paulo'
resumoDasCasas(casas);   // { casas: 12, cidades: 5, vagas: 76 }
```

### O que você cria

- **`src/components/CartaoCasa.js`**, o seu componente, com as props `casa` (o objeto da casa) e
  `onPress` (o que fazer no toque)
- **As telas**: a Início (`index.js`), o Detalhe (`casa/[id].js`), o Cadastro (`cadastro.js`) e o
  layout das abas (`(abas)/_layout.js`), compostos com as peças do kit
- **A sua cor primária**, no `src/theme/tokens.js`

Os outros arquivos de `src/` são do kit: leia à vontade, mas não mude, a não ser os tokens.

## Funcionalidades

Cada casa tem este formato (`src/data/casas.js`, não mude os dados):

```javascript
{
  id: 1,
  nome: 'Lar da Mel',
  bairro: 'Pinheiros',
  cidade: 'São Paulo',
  endereco: 'Rua Cardeal Arcoverde, 451',
  responsavel: 'Marta Ribeiro',
  telefone: '(11) 98123-4501',
  aceita: 'Cães',            // 'Cães', 'Gatos' ou 'Cães e gatos'
  capacidade: 20,            // quantos animais cabem
  ocupacao: 20,              // quantos estão lá hoje
  visitas: 'Sábados, das 9h às 13h',
  descricao: 'Casa de passagem para cães adultos...',
  foto: 'https://picsum.photos/id/237/600/400', // '' quando não tem foto
}
```

**Selo de vagas.** As vagas livres são `capacidade - ocupacao`. O `CartaoCasa` escolhe o selo assim:

| Vagas livres | Texto do selo | Tom do `Badge` |
|---|---|---|
| 0 | Lotada | `perigo` |
| 1 | Última vaga | `alerta` |
| 2 ou 3 | Últimas 2 vagas, Últimas 3 vagas | `alerta` |
| 4 ou mais | 8 vagas (o número) | `sucesso` |

Com os dados do curso: Lar da Mel e Gatil Sete Vidas lotadas, Casa da Pipoca com a última vaga,
Abrigo Focinho Feliz com as últimas 2 e Casa do Bigode com as últimas 3.

**Busca.** Acha pelo nome, pelo bairro ou pela cidade, sem diferença de maiúscula ou de acento:
"sao" mostra 4 casas (as 3 de São Paulo e o Recanto São Francisco), "RIBEIRAO" mostra 2,
"pinheiros" mostra o Lar da Mel e "geladeira" mostra o aviso de lista vazia.

**Cadastro.** Sete campos, todos obrigatórios:

| Campo | Teclado | Regra | Mensagem de exemplo |
|---|---|---|---|
| Nome da casa | texto, maiúscula nas palavras | pelo menos 3 letras | Escreva o nome da casa, com pelo menos 3 letras |
| Bairro | texto, maiúscula nas palavras | não pode ficar vazio | Informe o bairro |
| Cidade | texto, maiúscula nas palavras | não pode ficar vazio | Informe a cidade |
| Telefone | `phone-pad` | pelo menos 10 caracteres | Telefone com DDD, como 11 91234-5678 |
| A casa aceita | `Opcoes`: Cães, Gatos, Cães e gatos | uma escolhida | Escolha quem a casa aceita |
| Capacidade | `number-pad` | número inteiro, a partir de 1 | Quantos animais cabem: um número inteiro, a partir de 1 |
| Animais lá hoje | `number-pad` | inteiro, de 0 até a capacidade | Não pode passar da capacidade |

As mensagens podem ser outras, desde que digam o que corrigir. A casa salva entra no topo da lista e
os números da Início e da Sobre mudam. Os dados ficam na memória: ao recarregar o app, voltam as 12.

## Etapas

Cada etapa é feita no encontro. Primeiro, **juntos**: a turma faz os passos com o instrutor, com o
código nos slides. Depois, **sua vez**: você faz sozinho a parte que falta, com as dicas do slide.
Feche cada etapa com um commit com a mensagem indicada e o `git push`. Se faltar a um encontro, faça a
etapa pelos slides da aula e por esta página antes do encontro seguinte: cada etapa começa onde a
anterior terminou.

### Etapa 1 · E33: kit no celular e tela Início

**Juntos em aula**

1. Baixe o [kit-casas.zip](materiais/projeto-6/kit-casas.zip), descompacte, renomeie a pasta para
   `casas-de-adocao`, rode `npm install` e `npx expo start` e abra no Expo Go. Crie o `.gitignore`
   com `node_modules/`, `.expo/` e `dist/` (o zip não traz arquivos que começam com ponto), faça o
   primeiro commit e envie para um repositório público `casas-de-adocao` no seu GitHub
2. Em `app/index.js`, troque a `View` de fora pela `Tela` do kit: o título sai de baixo do relógio
3. O topo em linha: o título e a frase "Adote perto de você" numa coluna à esquerda e, à direita, um
   círculo de 48 que guarda o lugar do botão de tema (`flexDirection`, `justifyContent`, `alignItems`,
   `flex: 1` e `gap`)
4. Os 12 cartões com `casas.map`: cada um é um `Cartao` em linha, com uma caixa de 72 por 72 no lugar
   da foto e, ao lado, o nome, "bairro, cidade" e um `Badge` com "N vagas"

**Sua vez**: a faixa de números. Entre o topo e os cartões, três `Cartao` lado a lado, do mesmo
tamanho, com os números de `resumoDasCasas(casas)` e os rótulos casas, cidades e vagas.

**Pronto quando**: nada fica atrás do notch nem da barra de status; o topo, os números (12, 5 e 76) e
os 12 cartões aparecem; um nome comprido quebra a linha sem empurrar nada para fora da tela.
Por enquanto, use o celular no tema claro: o tema escuro é a etapa 2.

Commit: `Projeto 6: etapa 1, tela Início com flexbox`.

### Etapa 2 · E34: tokens e tema

**Juntos em aula**

1. No `StyleSheet` da Início, troque os números de espaço, raio e tamanho de letra pelos tokens de
   `@/theme` (`espaco.md`, `raio.sm`, `fonte.titulo`...)
2. As cores vêm do `useTema()`, no array de `style`: título e nome em `cores.texto`, a frase e o
   "bairro, cidade" em `cores.textoSuave`, a caixa da foto em `cores.borda`
3. O botão de tema: troque o círculo do topo por um `BotaoIcone` com lua no tema claro e sol no
   escuro, que chama `alternarTema`

**Sua vez**: os números com tokens e tema (valor em `cores.primaria` e `fonte.destaque`, rótulo em
`cores.textoSuave` e `fonte.pequena`) e a **sua cor primária**: troque as duas linhas `primaria` do
`src/theme/tokens.js` por um dos pares sugeridos no comentário do arquivo, ou mantenha a do kit.

**Pronto quando**: em `app/index.js` não sobra nenhum código de cor (`#...`) nem número solto de
espaço ou de letra; no celular em tema escuro, a tela abre escura; o botão troca o tema e tudo continua
legível nos dois.

Commit: `Projeto 6: etapa 2, tokens e tema`.

### Etapa 3 · E35: o seu CartaoCasa

**Juntos em aula**

1. Crie `src/components/CartaoCasa.js` com a prop `casa` e leve para ele o cartão da Início; a Início
   passa a usar `<CartaoCasa key={casa.id} casa={casa} />`
2. A foto: `Image` com `source={{ uri: casa.foto }}` e 72 por 72; casa com `foto: ''` mostra a pata
   (`paw` do `Ionicons`) numa caixa na cor da borda
3. Os ícones: `location-outline` antes de "bairro, cidade" e uma linha nova com `paw-outline` e
   `casa.aceita`
4. O toque: `Pressable` em volta do `Cartao`, com a prop `onPress` e o cartão mais transparente enquanto o
   dedo aperta; por enquanto, a Início mostra um `Alert` com o nome e o horário de visitas

**Sua vez**: o selo de vagas. No `CartaoCasa`, calcule as vagas livres e escolha o texto e o tom do
`Badge` pela tabela da seção Funcionalidades.

**Pronto quando**: os cartões mostram foto ou pata, os dois ícones e o selo certo (2 Lotada, 1 Última
vaga, 1 Últimas 2 vagas, 1 Últimas 3 vagas e 7 em verde); tocar num cartão dá retorno e abre o aviso.

Commit: `Projeto 6: etapa 3, CartaoCasa`.

### Etapa 4 · E36: lista com busca

**Juntos em aula**

1. A lista vem do `useCasas()`, no lugar do import de `@/data/casas`
2. `FlatList` no lugar do `map`: `data`, `renderItem`, `keyExtractor` com `String(casa.id)` e o topo
   num `ListHeaderComponent`; a `Tela` fica sem `rolar`
3. A busca: um `Campo` controlado com `useState`, e a lista mostra só as casas cujo nome contém o termo,
   comparando com `paraBusca`
4. Puxar para atualizar: `refreshing={atualizando}` e `onRefresh={recarregar}`

**Sua vez**: a busca também pelo bairro e pela cidade, e a lista vazia: um `EstadoVazio` com
"Nenhuma casa encontrada" e o botão Limpar busca, que apaga o termo.

**Pronto quando**: os resultados da seção Funcionalidades batem ("sao", "RIBEIRAO", "pinheiros" e
"geladeira"); Limpar busca volta às 12; puxar a lista para baixo mostra a rodinha, que para sozinha.

Commit: `Projeto 6: etapa 4, lista com busca`.

### Etapa 5 · E37: Detalhe e abas

**Juntos em aula**

1. A rota com parâmetro: `app/casa/[id].js` lê o `id` com `useLocalSearchParams()` e acha a casa com
   `casas.find` e `Number(id)`; no `app/_layout.js`, a pilha ganha `casa/[id]` com o título "Casa"
2. Tocar num cartão abre o Detalhe: `router.push('/casa/' + item.id)` no lugar do `Alert`
3. O Detalhe de verdade, dentro de `<Tela rolar comCabecalho>`: foto grande (ou a pata), nome,
   descrição e o nome da casa no cabeçalho com `<Stack.Title>`; sem casa, um `EstadoVazio` com
   "Casa não encontrada"
4. As abas: a pasta `app/(abas)/` com um `_layout.js` de `Tabs` (Casas e Sobre); `index.js` e
   `sobre.js` vão para dentro dela, e a pilha troca `index` por `(abas)`

**Sua vez**: o resto do Detalhe. Um `Cartao` "Vagas e visitas" e um "Endereço e contato", com
`LinhaInfo` para o que a casa aceita, as vagas, as visitas, o endereço, o bairro e a cidade, o
responsável e o telefone; e um `Cartao` "Outras casas em" + a cidade, com um `Link` para cada outra
casa da mesma cidade.

**Pronto quando**: tocar no Lar da Mel abre o Detalhe com tudo dele e as outras 2 casas de São Paulo;
tocar em Casa do Bigode abre o Detalhe dela por cima; voltar desfaz a pilha uma tela por vez; as abas
Casas e Sobre ficam embaixo e somem no Detalhe.

Commit: `Projeto 6: etapa 5, detalhe e abas`.

### Etapa 6 · E38: cadastro de casa

**Juntos em aula**

1. Um `Botao` "Cadastrar casa" na Início abre `/cadastro`; no `app/cadastro.js`, o primeiro `Campo`
   (nome) com `useState`, `value` e `onChangeText`, e o botão Cadastrar casa
2. Os campos cidade, telefone (`keyboardType="phone-pad"`) e capacidade (`number-pad`), e as `Opcoes`
   Cães, Gatos e Cães e gatos
3. A validação por campo: uma função `validar()` devolve um objeto com uma mensagem por campo com erro,
   e cada `Campo` mostra a sua com a prop `erro`
4. Salvar de verdade: sem erros, `adicionarCasa(...)`, um `Alert` de "Casa cadastrada" e
   `router.back()`

**Sua vez**: os campos Bairro e Animais lá hoje, com as regras da tabela da seção Funcionalidades
(o número de animais não pode passar da capacidade), e os dois valores entrando no `adicionarCasa`.

**Pronto quando**: com tudo vazio, cada campo mostra a sua mensagem e nada é salvo; com capacidade 10
e 12 animais, aparece "Não pode passar da capacidade"; com 6 animais, a casa entra no topo da lista
com "4 vagas" e os números viram 13 casas.

Commit: `Projeto 6: etapa 6, cadastro de casa`.

### Etapa 7 · E39: estados, acessibilidade e entrega

**Juntos em aula**

1. Carregando: enquanto `carregando` for `true`, a Início mostra `<Carregando />` (teste com
   `atraso: 3000` no `src/data/servidor.js`)
2. Erro: com `falhas: 1` no `servidor.js`, a Início mostra o `EstadoErro` com Tentar de novo, que chama
   `recarregar`; depois volte para `falhas: 0`
3. Acessibilidade: o `CartaoCasa` ganha `accessibilityRole`, um `accessibilityLabel` que diz tudo do
   cartão numa frase e um `accessibilityHint`; a foto do Detalhe ganha um rótulo; os links do Detalhe
   ganham altura mínima de 44; teste com o TalkBack ou o VoiceOver
4. Tela larga: com `useWindowDimensions`, a partir de 700 de largura (tablet ou celular deitado) a
   lista mostra duas colunas (`numColumns` e `key`)

**Sua vez**: o vazio que explica e os números acessíveis. Sem busca, a lista vazia diz "Nenhuma casa
cadastrada" (teste com `vazio: true` no `servidor.js`); com busca, continua "Nenhuma casa encontrada"
com Limpar busca. Cada `Cartao` de número é lido de uma vez, como "12 casas". Depois, o README da
entrega (seção Como entregar).

**Pronto quando**: os três estados aparecem nos testes do `servidor.js`, que volta para `atraso: 800`,
`falhas: 0` e `vazio: false`; o leitor de tela lê "Lar da Mel, Pinheiros, São Paulo. Cães. Lotada" num
toque só; deitado, a lista tem duas colunas.

Commit: `Projeto 6: etapa 7, estados, acessibilidade e entrega`.

## Como entregar

1. Repositório **público** `casas-de-adocao` no seu GitHub, sem `node_modules/` (o seu `.gitignore`
   da etapa 1 cuida disso)
2. Um commit por etapa, com as mensagens acima, e o último `git push` feito
3. O `README.md` do kit trocado pelo seu, com:

   ```markdown
   # Casas de adoção

   App para encontrar casas de adoção de cães e gatos, feito no curso Programador Mobile.

   ## Como rodar
   npm install e npx expo start; abra no Expo Go (SDK 58).

   ## O que eu fiz
   O componente CartaoCasa, as telas Início, Detalhe e Cadastro e a minha cor primária.

   ## Prints
   ![Início no tema claro](docs/inicio-claro.png)
   ![Início no tema escuro](docs/inicio-escuro.png)
   ![Detalhe](docs/detalhe.png)
   ![Cadastro com erros](docs/cadastro.png)
   ```

   Os prints ficam na pasta `docs/`, tirados do seu celular
4. Na página deste projeto, cole o link do repositório. O endereço `exp://` do `npx expo start` não
   serve: ele some quando o seu computador desliga

**Prazo: início do E41.** O instrutor corrige pela rubrica, critério por critério, e pode devolver o
projeto para ajustes antes da nota final. Aprovação com 70.

## Como será avaliado

A correção roda o app no Expo Go com os dados do curso e lê o seu código. Antes de entregar, confira
cada critério você mesmo.

- **Início com flexbox, tokens e tema (20).** Nota cheia: a Início como no desenho do começo desta
  página, sem código de cor em `app/`, com tokens nos espaços, raios e letras, legível nos dois temas.
  Parcial: uma cor
  escrita direto no `StyleSheet`, ou um texto que some no tema escuro.
- **O seu CartaoCasa (20).** Nota cheia: o arquivo e as props com os nomes do enunciado, foto ou pata,
  os dois ícones, o retorno ao toque e os selos da tabela. Parcial: selo só com a cor certa e o texto
  errado, ou a casa sem foto com um buraco no lugar.
- **Lista, busca e navegação (20).** Nota cheia: as buscas da seção Funcionalidades, a lista vazia, o
  puxar para atualizar, o Detalhe completo, as abas e os links das outras casas. Parcial: a busca que
  não acha "sao", ou o Detalhe que sempre diz "Casa não encontrada".
- **Cadastro de casa (20).** Nota cheia: os sete campos com o teclado certo, uma mensagem embaixo de
  cada campo com erro e a casa nova no topo. Parcial: erros só num `Alert` geral, ou ocupação maior
  que a capacidade aceita.
- **Estados e acessibilidade (10).** Nota cheia: os três estados, o cartão lido numa frase só e as duas
  colunas. Parcial: falta um dos três.
- **Repositório e README (10).** Nota cheia: um commit por etapa com as mensagens do enunciado e o
  README com os prints. Parcial: commits todos no último dia, ou README sem prints.

## Dúvidas frequentes

**O Expo Go diz que o projeto é de outra versão.** Atualize o Expo Go na loja de aplicativos: o kit é
do SDK 58. Se o erro continuar, rode `npx expo start -c`.

**Aparece `Unable to resolve "@/components/ui"`.** Confira a grafia do caminho (`components`, no
plural) e se o `jsconfig.json` do kit está na pasta do projeto. Depois, `npx expo start -c`.

**A lista some por um instante quando o app abre.** É o servidor de mentira do kit: ele responde
depois de 800 milissegundos, como uma API de verdade. Na etapa 7 você põe o Carregando nesse tempo.

**As casas que cadastrei somem quando recarrego o app.** É o esperado: os dados ficam na memória.
Guardar no aparelho é assunto do E43, no projeto integrador.

**Posso mudar as peças do kit?** Não: use as props que elas oferecem. O que é seu são as telas, o
`CartaoCasa` e a cor primária no `tokens.js`.

**Meu nome de grupo pode ser `(tabs)`?** Pode funcionar, mas use `(abas)`, como no enunciado: é por
esse nome que o instrutor encontra o arquivo. O nome entre parênteses não entra no endereço da tela.

**Atrasei uma etapa. Perco ponto?** A nota é da entrega final. O commit de cada etapa mostra o
caminho; faça-o com a mensagem da etapa quando terminar.

## Para ir além

Opcional e sem ponto extra:

- Um botão "Ligar" no Detalhe que abre o discador com `Linking.openURL('tel:' + casa.telefone)`
- No Cadastro, mostrar o erro de um campo ao sair dele, com a prop `onBlur` do `Campo`
- Ordenar a lista por mais vagas, com um `Botao` que troca a ordem
- Uma tela Galeria com todas as peças do kit e as variantes, nos dois temas
