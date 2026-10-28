---
title: "Projeto 5 · Gota: meta de água"
summary: App Expo para registrar os copos de água do dia, com barra de progresso, meta editável, lista com remoção e regras num hook.
section: Módulo Específico
module: react-native
opens: e26a-mobile-e-react-native
due: e30a-flexbox-no-react-native
due_label: início do E30
passing_score: 70
required: true
rubric:
  - key: tela
    title: Tela com componentes nativos
    points: 20
    description: "Cabeçalho com a gota de `assets/`, cartão de progresso com a barra feita de `View` e largura em porcentagem, três botões `Pressable` lado a lado; componentes em `src/components/`, estilos com `StyleSheet.create` no fim de cada arquivo e nada atrás do notch."
  - key: registros
    title: Registros, lista e remoção
    points: 25
    description: "Os botões criam registros `{ id, ml, hora }`; a `FlatList` mostra a lista (com `keyExtractor` em texto) e a mensagem de lista vazia; remover pede confirmação com `Alert` e Cancelar não remove; total e percentual mudam na hora."
  - key: meta
    title: Meta editável e validada
    points: 10
    description: "A meta muda por um `TextInput` controlado e numérico; vazio, com ponto ou fora de 500 a 5000 ml mostra a mensagem embaixo do campo e não muda a meta."
  - key: regras-e-hook
    title: Regras puras e hook
    points: 20
    description: "`src/regras/agua.js` com as funções do enunciado, puras e dando o resultado dos exemplos; `useConsumo` guarda o estado e as funções; o `App` só monta a tela e confirma a remoção."
  - key: bug
    title: Caça ao bug
    points: 10
    description: "Seção \"Caça ao bug\" no README com sintoma, como reproduzir, como você isolou (o que o terminal ou o breakpoint mostrou), a causa e a correção; o bug corrigido no código."
  - key: entrega
    title: Repositório e README
    points: 15
    description: "Repositório público `gota` sem `node_modules/`, um commit por etapa com as mensagens do enunciado, README com o que o app faz, dois prints e como rodar; o app abre no Expo Go com `npm install` e `npx expo start`."
steps:
  - lesson: e26b-ambiente-expo
    when: E26
    title: App no celular
    summary: "Projeto `gota` criado com o Expo, com título e meta do dia, aberto no Expo Go e enviado ao GitHub."
  - lesson: e27b-estilo-com-stylesheet
    when: E27
    title: Tela com StyleSheet
    summary: "Cabeçalho com a gota, cartão de progresso com a barra e três botões de copo, com valores fixos e `StyleSheet`."
  - lesson: e28b-depuracao-e-ferramentas
    when: E28
    title: Estado, lista e caça ao bug
    summary: "Registros com `useState` e `FlatList`, remoção com `Alert`, meta editável e validada, e o bug do enunciado explicado no README."
  - lesson: e29b-revisao-react-native
    when: E29
    title: Hook, regras e entrega
    summary: "Regras puras em `src/regras/agua.js`, estado no hook `useConsumo`, README com prints e entrega."
---

## O que você vai construir

O **Gota** ajuda a beber água ao longo do dia: cada copo que você toma vira um toque no celular, e o app
mostra quanto falta para a meta do dia. É um app de uma tela só, feito com Expo e React Native, num
repositório seu chamado `gota`.

Assim fica a tela no fim do projeto (os desenhos e as cores são seus):

```plaintext
 (gota) Gota
        Meta de água do dia
 +-----------------------------------------+
 | 800 ml                       de 2000 ml |
 | [##########..............]              |
 | 40% da meta              Faltam 1200 ml |
 | Bom começo. Continue                    |
 +-----------------------------------------+
 [  +200 ml  ]  [  +300 ml  ]  [  +500 ml  ]
 Meta do dia (ml)   [ 2000          ] [Salvar]
 Registros de hoje
 | 300 ml   às 10:15              [Remover] |
 | 500 ml   às 08:02              [Remover] |
```

Os registros ficam na memória do app: ao recarregar, o dia começa de novo. Isso é esperado.

O laboratório do React Native é o `minhas-tarefas-mobile`. O Gota usa os mesmos conceitos (componentes
nativos, `StyleSheet`, `useState`, `FlatList`, `Alert`, depuração, hooks), mas é outro app, com outros
componentes. Não copie arquivos do laboratório: escreva os seus.

### Estrutura final

```plaintext
gota/
├── App.js                    monta a tela e confirma a remoção
├── app.json                  nome do app: Gota
├── assets/gota.png           a gota do cabeçalho (fornecida pelo curso)
└── src/
    ├── components/           Cabecalho, CartaoProgresso, BotaoCopo, CampoMeta, ItemRegistro
    ├── hooks/useConsumo.js   estado e funções do dia (etapa 4)
    └── regras/agua.js        regras puras (etapa 4)
```

### Material do curso

- :icon[download] [projeto-5.zip](materiais/projeto-5.zip): a pasta com `gota.png` (para o cabeçalho)
  e `icone.png` (opcional, para o ícone do app)
- Só a gota, para abrir no navegador: [gota.png](materiais/projeto-5/gota.png)

## Funcionalidades

| O que | Como deve funcionar |
|---|---|
| Registrar um copo | Tocar em "+300 ml" cria `{ id, ml: 300, hora: '14:05' }` no topo da lista, e o total sobe 300 |
| Progresso | Com 1500 ml e meta de 2000 ml: "75% da meta", barra em três quartos, "Faltam 500 ml" |
| Passou da meta | Com 2500 ml e meta de 2000 ml: "125% da meta", barra cheia sem sair do cartão, nada falta |
| Lista vazia | Sem registros, a lista mostra "Nenhum copo registrado hoje" (ou um texto seu) |
| Remover | "Remover" abre um `Alert` com Cancelar e Remover; Cancelar mantém o registro |
| Meta do dia | Começa em 2000 ml; muda pelo campo e pelo botão Salvar |
| Mensagem do dia | Uma frase por faixa do percentual (etapa 4) |

### Validação da meta

A meta é um número inteiro de 500 a 5000 ml. O texto do campo é conferido ao tocar em Salvar:

| Digitado | Resultado |
|---|---|
| `2500` | a meta vira 2500 e o percentual muda na hora |
| `2500` com espaços antes ou depois | vale: os espaços das pontas são ignorados |
| vazio | erro: peça a meta |
| `2.000`, `2000,5`, `-300`, `abc` | erro: só números, sem ponto nem vírgula |
| `300` ou `6000` | erro: a meta vai de 500 a 5000 ml |

Com erro, a mensagem aparece **embaixo do campo** e a meta continua a mesma. Os textos das mensagens
são seus; eles precisam dizer o que está errado.

### Mensagem por faixa

| Percentual | Faixa | Exemplo de mensagem |
|---|---|---|
| 0 | ainda nada | "Que tal o primeiro copo?" |
| 1 a 49 | começou | "Bom começo. Continue" |
| 50 a 99 | mais da metade | "Mais da metade. Falta pouco" |
| 100 ou mais | meta batida | "Meta batida. Parabéns!" |

As faixas são fixas; os textos são seus.

## Etapas

Cada etapa termina com um commit com a mensagem indicada e o `git push`. Pode haver commits extras
no meio; o da etapa é o que o instrutor confere no encontro seguinte.

### Etapa 1 · E26: app no celular

- Na pasta onde você guarda os projetos (fora do `minhas-tarefas-mobile`):
  `npx create-expo-app@latest gota --template blank`
- No `App.js`, troque o texto do modelo pelo título **Gota** e pela linha **Meta do dia: 2000 ml**,
  e escolha uma cor de fundo
- Abra no Expo Go (ou no emulador). Se o servidor do laboratório estiver ligado, pare-o com
  <kbd>Ctrl</kbd> + <kbd>C</kbd> antes
- Crie o repositório **público** `gota` no GitHub e envie o projeto, com o fluxo do E03
- `README.md` com o nome do app, uma frase sobre o que ele faz e a seção "Como rodar"
  (`npm install` e `npx expo start`)

Commit: `Projeto 5: etapa 1, app no celular`.

### Etapa 2 · E27: tela com StyleSheet

A tela ganha forma, ainda com valores fixos.

- `npx expo install react-native-safe-area-context`; no `App.js`, `SafeAreaProvider` envolve tudo e a
  tela usa `SafeAreaView` com `flex: 1`
- Baixe a `gota.png` do material e salve em `assets/`
- `src/components/Cabecalho.js`: a gota (com `width` e `height`), o título e um subtítulo
- `src/components/CartaoProgresso.js`, com as props `total` e `meta`: mostra "1200 ml de 2000 ml", a
  barra de progresso e o percentual
- `src/components/BotaoCopo.js`, com a prop `ml`: um `Pressable` com "+200 ml"; por enquanto o toque só
  faz um `console.log`
- No `App.js`: `<CartaoProgresso total={1200} meta={2000} />` e três `BotaoCopo` (200, 300 e 500 ml)
  lado a lado
- Estilos com `StyleSheet.create` no fim de cada arquivo, com nomes pelo papel (`trilho`, `botao`),
  não pela aparência

:::tip A barra de progresso
São duas `View`: o **trilho** (fundo claro, altura fixa, cantos redondos) e o **preenchimento**
dentro dele (cor forte, mesma altura). A largura do preenchimento é uma porcentagem, escrita como
texto: `{ width: '60%' }` ocupa 60% do trilho. Monte esse texto com uma template string (E05) a partir
do percentual. Sem altura, a barra não aparece e nenhum erro avisa.
:::

O percentual é `total / meta * 100`, arredondado para baixo com `Math.floor` (E05): com 1999 ml de
2000, o app mostra 99%, não 100%.

Commit: `Projeto 5: etapa 2, tela com StyleSheet`.

### Etapa 3 · E28: estado, lista e caça ao bug

É a maior etapa. Faça na ordem: estado e lista, remoção, meta, bug.

**Estado e lista**

- No `App`: `registros` com `useState([])` e `meta` com `useState(2000)`
- `adicionarCopo(ml)` cria `{ id: Date.now(), ml, hora }` e entrega um **array novo** a
  `setRegistros`, com o registro novo no topo (o spread do E09)
- A `hora` é texto no formato `'08:05'`: `getHours()` e `getMinutes()` de um `new Date()`, com
  `padStart(2, '0')` (E06)
- `BotaoCopo` recebe `onAdicionar` e chama com o seu `ml` no toque
- O total vem de um `reduce` com valor inicial 0 (E09); o percentual, como na etapa 2. Os dois descem
  para o `CartaoProgresso`, e a barra **para em 100%** (`Math.min`, E05) mesmo passando da meta
- `src/components/ItemRegistro.js`: "300 ml às 14:05" e um `Pressable` "Remover"
- `FlatList` com `keyExtractor` devolvendo texto e `ListEmptyComponent` para a lista vazia. Não
  coloque a `FlatList` dentro de uma `ScrollView`

**Remoção**

- `removerRegistro(id)` com `filter`
- `confirmarRemocao(registro)` abre o `Alert.alert` com título, o registro na mensagem
  ("300 ml às 14:05") e os botões Cancelar e Remover

**Meta**

- `src/components/CampoMeta.js`, com as props `meta` e `onSalvar`: um `TextInput` controlado, um
  `Pressable` Salvar e a mensagem de erro embaixo do campo, como na tabela de validação
- A prop `keyboardType="numeric"` no `TextInput` abre o teclado de números. Ele ainda deixa digitar
  ponto e vírgula: por isso a validação
- Guarde a meta como **número** (`Number`, E05), não como o texto do campo

**Caça ao bug**

Com tudo funcionando, faça um commit. Depois troque as suas funções `removerRegistro` e
`confirmarRemocao` por estas, salve e use o app:

```jsx
function removerRegistro(id) {
  setRegistros(registros.filter((registro) => registro.id !== id));
}

function confirmarRemocao(registro) {
  Alert.alert('Remover registro?', `${registro.ml} ml às ${registro.hora}`, [
    { text: 'Cancelar' },
    { text: 'Remover', onPress: removerRegistro(registro.id) },
  ]);
}
```

Há um bug aí. Ele não derruba o app nem mostra tela vermelha. Aplique o método de 4 passos do E28
(reproduzir, isolar, formular uma hipótese, testar uma mudança por vez) e escreva no `README.md` uma
seção **Caça ao bug** com:

1. **Sintoma**: o que você viu acontecer
2. **Como reproduzir**: os passos exatos
3. **Como isolou**: o `console.log` ou o breakpoint que usou, e o que ele mostrou
4. **Causa**: por que o código faz isso
5. **Correção**: o que você mudou, e o teste que mostrou que resolveu

Corrija o bug no código. A nota vem da explicação, não só da correção.

Commit: `Projeto 5: etapa 3, estado, lista e bug`.

### Etapa 4 · E29: hook, regras e entrega

Etapa curta: o E29 tem a Prova 3. A tela não muda; muda onde a lógica mora.

**Regras puras** em `src/regras/agua.js`, com estes nomes e export nomeado (E11). Elas recebem valores
e devolvem valores: nada de `useState`, `Alert` ou componentes dentro delas.

```javascript
totalDoDia([{ id: 1, ml: 300, hora: '08:00' }, { id: 2, ml: 500, hora: '10:15' }]) // 800
percentualDaMeta(1500, 2000) // 75
percentualDaMeta(1999, 2000) // 99, arredonda para baixo
percentualDaMeta(2500, 2000) // 125
quantoFalta(1500, 2000)      // 500
quantoFalta(2500, 2000)      // 0, nunca negativo
mensagemDaFaixa(75)          // a frase da faixa de 50 a 99
validarMeta('2500')          // { valida: true, meta: 2500, mensagem: '' }
validarMeta('2.000')         // { valida: false, meta: null, mensagem: 'Use só números...' }
formatarHora(new Date(2026, 9, 28, 8, 5)) // '08:05'
```

**Hook** em `src/hooks/useConsumo.js`, como os hooks do E24:

```javascript
export function useConsumo(metaInicial = 2000) {
  // ...
  return { registros, meta, total, percentual, falta, mensagem,
    adicionarCopo, removerRegistro, definirMeta };
}
```

- O estado (`registros` e `meta`) e as funções que o mudam saem do `App` e vão para o hook, que usa as
  regras de `agua.js` para calcular total, percentual, quanto falta e mensagem
- O `App` chama `useConsumo()` e só monta a tela. O `confirmarRemocao`, com o `Alert`, fica no `App`:
  ele é tela
- O `CampoMeta` usa `validarMeta`; o `CartaoProgresso` passa a mostrar quanto falta e a mensagem da
  faixa

**Entrega**

- No `app.json`, `"name": "Gota"`
- README completo: o que o app faz, **dois prints do celular** (lista vazia e com registros), como
  rodar e a seção Caça ao bug. Salve os prints em `assets/` e mostre no README com
  `![descrição](assets/captura-vazio.png)`
- Confira tudo pela rubrica, abaixo

Commit: `Projeto 5: etapa 4, hook, regras e entrega`. Depois, a entrega na plataforma.

## Como entregar

1. Repositório **público** `gota` no seu GitHub, sem `node_modules/` (o `.gitignore` do Expo já cuida
   disso)
2. Um commit por etapa, com as mensagens acima, e o último `git push` feito
3. README com o que o app faz, dois prints, como rodar e a seção Caça ao bug
4. Na página deste projeto, cole o link do repositório. Link de demonstração é opcional (um Snack, por
   exemplo); o link `exp://` do túnel não serve, porque some quando o seu computador desliga

**Prazo: início do E30.** O instrutor corrige pela rubrica, critério por critério, e pode devolver o
projeto para ajustes antes da nota final. Aprovação com 70.

## Como será avaliado

O instrutor clona o repositório, roda `npm install` e `npx expo start`, abre no Expo Go e segue um
roteiro de uso: adicionar copos, passar da meta, remover com Cancelar e com Remover, digitar metas
erradas e certas. Depois lê o código e o README.

| Critério | Pontos | Nota cheia | Perde pontos se |
|---|---|---|---|
| Tela com componentes nativos | 20 | os cinco componentes em `src/components/`, barra com duas `View`, `Pressable` nos botões, nada atrás do notch | a barra é um texto, os botões são `Button`, os estilos estão inline ou espalhados |
| Registros, lista e remoção | 25 | adicionar, listar, lista vazia e remover com confirmação funcionando no celular | Cancelar também remove, a barra sai do cartão, o total não atualiza, `ScrollView` com `map` no lugar da `FlatList` |
| Meta editável e validada | 10 | todos os casos da tabela de validação | aceita `2000,5` ou `300`, quebra com o campo vazio, não mostra o erro |
| Regras puras e hook | 20 | as seis funções com os resultados dos exemplos, `useConsumo` com o retorno do enunciado, `App` sem cálculo | regra com `useState` dentro, cálculo repetido no `App`, nomes diferentes dos do enunciado |
| Caça ao bug | 10 | os cinco itens, com a evidência do terminal ou do breakpoint | só a correção, sem dizer como chegou nela |
| Repositório e README | 15 | quatro commits de etapa, README completo, app abrindo do zero | commit único no fim, prints faltando, `node_modules/` no repositório |

Exemplo de nota parcial: remover pede confirmação, mas a barra passa de 100% e sai do cartão
(Registros: 21 de 25). README com o bug corrigido e a causa certa, mas sem dizer como isolou
(Caça ao bug: 6 de 10).

## Para ir além

Opcional e sem ponto extra:

- Ícone do app: `icone.png` do material em `assets/` e `"icon": "./assets/icone.png"` no `app.json`
- Um copo de tamanho livre: um campo para digitar os ml
- Um botão "Zerar o dia", com confirmação
- Conferir as regras sem o celular: um arquivo `conferir.mjs` na raiz com
  `import { percentualDaMeta } from './src/regras/agua.js'` e alguns `console.log`, rodado com
  `node conferir.mjs`. O Node avisa que o tipo do módulo não está definido: pode ignorar, e não mude o
  `package.json` do Expo por isso

## Dúvidas frequentes

**Posso usar `Button` nos copos?** Não. Use `Pressable`, que aceita o seu estilo, como no E27.

**A barra não aparece.** Confira a altura do trilho e do preenchimento e a largura como texto com `%`
(`'60%'`). `width: 60%`, sem aspas, é erro de sintaxe.

**O `Alert` não aparece no navegador.** Na versão web (tecla `w`), o `Alert.alert` não faz nada.
Teste a remoção no Expo Go.

**O total aparece como "0300500".** Os ml chegaram como texto, e o `+` juntou textos em vez de somar.
Confira os botões: `ml="300"` passa texto; `ml={300}` passa número. A meta também precisa ser número.

**Recarreguei o app e os registros sumiram.** É esperado: os dados ficam na memória. Guardar no
aparelho é assunto do E43b.

**Não tenho celular.** Use o emulador, se houver, ou o celular de um colega lendo o QR code do seu
computador, como no E26. A entrega continua individual.

**Posso reaproveitar o `minhas-tarefas-mobile`?** Os conceitos, sim: é para isso que o laboratório
existe. O código, não. Componentes, nomes e regras do Gota são os deste enunciado.
