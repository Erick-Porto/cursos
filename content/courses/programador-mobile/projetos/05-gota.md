---
title: "Projeto 5 · Gota: meta de água"
summary: App de celular com Expo para registrar os copos de água do dia, com a barra da meta, a lista, o remover e o seu BotaoCopo.
section: Módulo Específico
module: react-native
opens: e29-react-native-e-expo
due: e33-flexbox-e-areas-seguras
due_label: início do E33
passing_score: 70
required: true
rubric:
  - key: celular
    title: App no celular
    points: 15
    description: "O app abre do zero no Expo Go com npm install e npx expo start. No topo, a gota com Image, o título Gota e a sua saudação, com estilos de um StyleSheet.create no fim do App.js."
  - key: botao-copo
    title: O seu BotaoCopo
    points: 25
    description: "src/components/BotaoCopo.js feito por você, com export default: um Pressable com um Text dentro e os estilos num StyleSheet.create no fim do arquivo. Recebe ml como número (ml={300}), mostra +300 ml e, no toque, chama aoAdicionar(ml). No App, três copos, de 200, 300 e 500 ml, dentro da Linha do kit."
  - key: registros
    title: Registros e total
    points: 25
    description: "registros com useState([]); cada toque cria { id, ml, hora } numa lista nova, com o registro novo em cima (spread, sem push); o total vem de um reduce com valor inicial 0 e o ProgressoMeta muda na hora, com a barra cheia e Meta batida! a partir de 2000 ml."
  - key: lista
    title: Lista e remoção
    points: 20
    description: "FlatList com data={registros}, keyExtractor devolvendo o id como texto e um ItemRegistro por copo, com o ml e a hora. Sem copos, a ListaVazia. Remover tira só aquele copo, com filter, e o total cai."
  - key: entrega
    title: Repositório e README
    points: 15
    description: "Repositório público gota, com o .gitignore e sem node_modules nem .expo; o commit do kit e um commit por etapa com a mensagem pedida; README com o que o app faz, como rodar, dois prints do celular (lista vazia e com copos) e o seu nome."
steps:
  - lesson: e29-react-native-e-expo
    when: E29
    title: App no celular
    summary: "O kit no Expo Go do seu celular, a sua saudação, a meta do dia com View e Text, e o repositório gota no GitHub."
  - lesson: e30-componentes-nativos-e-estilo
    when: E30
    title: Estilo e BotaoCopo
    summary: "Título e saudação com StyleSheet, a gota com Image e o seu BotaoCopo com Pressable: três copos que avisam no terminal."
  - lesson: e31-estado-e-listas-no-celular
    when: E31
    title: Registros, lista e entrega
    summary: "Os registros com useState, o total no ProgressoMeta, a FlatList com a lista vazia, o remover, o README com prints e a entrega."
---

## O que você vai construir

O **Gota** ajuda a beber água ao longo do dia. Cada copo que você toma vira um toque no celular, e o app mostra quanto você já bebeu e quanto falta para a meta de 2000 ml. É um app de verdade, feito com React Native e Expo, que roda no seu celular pelo **Expo Go**.

```plaintext
 (gota)
 Gota
 Olá, Ana! Bora beber água hoje?
 +------------------------------------------+
 | 800 ml                        de 2000 ml |
 | [##########...............]              |
 | 40% da meta               Faltam 1200 ml |
 +------------------------------------------+
 [ +200 ml ]       [ +300 ml ]       [ +500 ml ]
 Registros de hoje
 | 500 ml   às 10:42               [Remover] |
 | 300 ml   às 09:15               [Remover] |
```

Você não começa do zero. O projeto vem num **kit**: um app Expo pronto para rodar, com o fundo da tela, o cartão da meta, o item da lista, a mensagem de lista vazia e as cores. Você escreve **um componente**, o `BotaoCopo`, e a tela no `App.js`. Cada etapa é feita em aula: primeiro junto com o instrutor, depois um trecho sozinho, o **Sua vez**.

| Etapa | Encontro | O app ganha |
|---|---|---|
| 1 | E29 | o kit no seu celular, a sua saudação e a meta do dia |
| 2 | E30 | os estilos, a gota no topo e o seu `BotaoCopo`, que avisa no terminal |
| 3 | E31 | os registros, o total na barra, a lista, o remover, o README e a entrega |

O E32 é de revisão e da Prova 3. O prazo de entrega é o **início do E33**.

Os registros ficam na memória do app: ao recarregar, o dia começa de novo. Isso é esperado; guardar no aparelho é assunto do E43.

## O kit

Baixe o kit aqui: [kit-gota.zip](materiais/projeto-5/kit-gota.zip). Ele traz o Expo SDK 58 (`expo` 58.0.23), React Native 0.88.1, React 19.3.0, `expo-status-bar` 58.0.4 e `react-native-safe-area-context` 5.11.1; o `package-lock.json` garante as mesmas versões em todos os computadores. O app abre no **Expo Go** da loja (versão 58), no Android e no iPhone. No computador, ele precisa do Node 22.13 ou mais novo.

:::info Leve para o E29
O celular carregado, o **Expo Go** instalado da loja (Play Store ou App Store) e uma conta grátis do Expo, criada em [expo.dev/signup](https://expo.dev/signup). Anote o nome de usuário e a senha: você entra com eles no terminal e no Expo Go.
:::

### Componentes do kit

As peças prontas ficam em `src/components/`. Você as usa com `import`, sem mudar nada dentro delas. O comentário no topo de cada arquivo repete o que está nesta tabela.

| Componente | Props | O que mostra |
|---|---|---|
| `Tela` | o que vai entre `<Tela>` e `</Tela>` | o fundo azul-claro do app, longe do entalhe e da barra de status; as peças de dentro ficam uma embaixo da outra, com um espaço entre elas |
| `Linha` | o que vai entre `<Linha>` e `</Linha>` | as peças de dentro lado a lado, com o mesmo espaço entre elas |
| `ProgressoMeta` | `total` e `meta`: números, em ml | o cartão com "800 ml de 2000 ml", a barra, "40% da meta" e "Faltam 1200 ml"; de 2000 ml em diante, a barra cheia e "Meta batida!" |
| `ItemRegistro` | `ml` (número), `hora` (texto) e `aoRemover` (função) | um copo da lista: "300 ml", "às 14:05" e o botão Remover, que chama `aoRemover` |
| `ListaVazia` | `texto`: a frase | a gota clarinha e a frase, no lugar da lista sem nenhum copo |

O kit traz também dois arquivos de apoio:

| Arquivo | O que tem |
|---|---|
| `src/hora.js` | `horaAgora()`, que devolve a hora deste momento como texto: às 8h05, `'08:05'` |
| `src/tema.js` | as cores (`cores.agua`, `cores.titulo`, `cores.textoFraco`...), os espaços e os cantos do app, cada um com um nome |

### O componente que você cria

| Componente | Arquivo | Props | O que mostra |
|---|---|---|---|
| `BotaoCopo` | `src/components/BotaoCopo.js` | `ml` (número) e `aoAdicionar` (função) | um botão azul com "+300 ml"; o toque chama `aoAdicionar(300)` |

Na etapa 2, o botão ainda não recebe `aoAdicionar`: o toque só escreve no terminal. A prop `aoAdicionar` entra na etapa 3.

### O registro

Cada copo vira um **registro**, uma ficha com três campos:

| Campo | Exemplo | O que é |
|---|---|---|
| `id` | `1762180800000` | o crachá do registro: o `Date.now()`, um número que muda a cada milésimo de segundo |
| `ml` | `300` | quantos ml tinha o copo |
| `hora` | `'14:05'` | a hora do registro, de `horaAgora()` |

## Funcionalidades

Ao final, o app faz tudo isto:

1. **Topo**: a gota, o título "Gota" e a sua saudação, com estilos.
2. **Copos**: "+200 ml", "+300 ml" e "+500 ml" lado a lado. Cada toque cria um registro, que entra no topo da lista.
3. **Progresso**: o `ProgressoMeta` mostra o total do dia, a barra e quanto falta. Passou da meta, a barra fica cheia, sem sair do cartão.
4. **Lista**: um item por registro, com os ml e a hora, o mais novo em cima.
5. **Lista vazia**: sem nenhum copo, "Nenhum copo registrado hoje".
6. **Remover**: tira só aquele registro, e o total cai na hora.

Exemplos para conferir:

| Situação | O que aparece |
|---|---|
| Ao abrir | "0 ml de 2000 ml", a barra vazia, "Faltam 2000 ml" e a lista vazia |
| +300 e depois +500 | "800 ml", "40% da meta", "Faltam 1200 ml"; dois registros, o de 500 em cima |
| +500 cinco vezes, sem remover | "2500 ml", "125% da meta", a barra cheia e "Meta batida!" |
| Com 800 ml, remover o de 300 | "500 ml", "25% da meta" e um registro só |
| Remover todos | volta "Nenhum copo registrado hoje" |

## Etapas

Cada etapa é feita no encontro dela. **Juntos em aula** é o que a turma faz com o instrutor, com o código nos slides. **Sua vez** é o trecho que você faz sozinho, em aula, sem a resposta no slide. Se você faltou, faça a etapa com os slides da aula e com este enunciado antes do encontro seguinte: cada etapa começa exatamente onde a anterior terminou.

### Etapa 1 · E29: app no celular

**Juntos em aula**

:::steps
1. O kit no computador: baixe o [kit-gota.zip](materiais/projeto-5/kit-gota.zip), extraia na pasta dos seus projetos e renomeie a pasta `kit-gota` para `gota`. No terminal, entre nela com `cd gota` e abra o VS Code com `code .`. No terminal do VS Code, `npm install` (uma vez só).
2. O app no celular: `npx expo login` e entre com a sua conta Expo (o navegador abre para isso); no Expo Go, entre com a mesma conta. Depois, `npx expo start`: o terminal mostra um QR code. No Android, leia com o Expo Go ("Scan QR code"); no iPhone, com a câmera. O celular mostra "Gota" e "Olá! Troque esta frase pela sua saudação.".
3. O kit no Git: crie o arquivo `.gitignore` com duas linhas, `node_modules/` e `.expo/`. Depois, `git init`, `git add .` e `git commit -m "Kit do Gota"`.
4. A primeira mudança: no `App.js`, troque a frase do segundo `<Text>` pela sua saudação, com o seu nome, e salve. O celular atualiza sozinho em um ou dois segundos.
:::

**Sua vez**

Onde está o comentário "Etapa 1 (E29), sua vez", escreva a meta do dia: uma `View` com dois `Text`, um com "Meta do dia" e outro com "2000 ml".

Dicas: a `View` do topo, com o "Gota" e a saudação, já mostra a forma. Todo texto do app fica dentro de um `<Text>`.

**Pronto quando:** o celular mostra, um embaixo do outro, "Gota" e a sua saudação e, depois de um espaço, "Meta do dia" e "2000 ml"; o terminal não mostra erro.

**Commit e push:** `Projeto 5: etapa 1, app no celular`. Crie no GitHub o repositório **público** `gota`, ligue com o `git remote add origin` que o GitHub mostra e faça o `git push`.

### Etapa 2 · E30: estilo e BotaoCopo

**Juntos em aula**

:::steps
1. Estilo no topo: no `App.js`, importe também o `StyleSheet` de `react-native` e as `cores` de `./src/tema`. No fim do arquivo, `const estilos = StyleSheet.create(...)` com `titulo` (`fontSize: 32`, `fontWeight: 'bold'`, `color: cores.titulo`) e `saudacao` (`fontSize: 16`, `color: cores.textoFraco`). Nos dois `Text` do topo, `style={estilos.titulo}` e `style={estilos.saudacao}`.
2. A gota no topo: importe também a `Image` e, antes do "Gota", `<Image source={require('./assets/gota.png')} style={estilos.gota} />`, com o estilo `gota` (`width: 48`, `height: 48`).
3. O `BotaoCopo` nasce: crie `src/components/BotaoCopo.js` com um `Pressable` e, dentro dele, um `Text` com "+200 ml", e o `export default`. O toque escreve `Copo de 200 ml` no terminal, com `console.log`. No `App.js`, importe o botão e ponha um `<BotaoCopo />` embaixo da meta do dia.
4. O `BotaoCopo` com estilo: no fim do `BotaoCopo.js`, um `StyleSheet.create` com `botao` (`backgroundColor: cores.agua`, `borderRadius: 12`, `padding: 12`) e `texto` (`color: cores.textoNoAzul`, `fontSize: 18`, `fontWeight: 'bold'`). Dentro de `src/components/`, o `import` das cores sobe uma pasta: `'../tema'`.
:::

**Sua vez**

Os três copos. O `BotaoCopo` recebe a prop `ml` e mostra "+200 ml", "+300 ml" ou "+500 ml"; o toque escreve no terminal `Copo de 300 ml`, com o número do botão tocado. No `App.js`, três botões, de 200, 300 e 500 ml, lado a lado, dentro da `Linha` do kit.

Dicas: as props funcionam como no `CartaoReceita` do Projeto 4, desestruturadas no parâmetro. O número vai entre chaves, `ml={300}`; com aspas, `ml="300"`, ele vira texto. A frase do terminal é uma template string, a do E06. O comentário no topo de `src/components/Linha.js` mostra como usá-la.

**Pronto quando:** o celular mostra a gota, o título grande e azul-escuro, a saudação em cinza, a meta do dia e três botões azuis lado a lado, "+200 ml", "+300 ml" e "+500 ml"; cada toque escreve no terminal `Copo de 200 ml`, `Copo de 300 ml` ou `Copo de 500 ml`, conforme o botão.

**Commit e push:** `Projeto 5: etapa 2, estilo e BotaoCopo`.

### Etapa 3 · E31: registros, lista e entrega

**Juntos em aula**

:::steps
1. O estado dos registros: no `App.js`, `import { useState } from 'react'`, `import { horaAgora } from './src/hora'` e `const [registros, setRegistros] = useState([])`. A função `adicionarCopo(ml)` cria o registro `{ id: Date.now(), ml: ml, hora: horaAgora() }` e entrega ao `setRegistros` uma lista nova, com ele em cima: `[novo, ...registros]`, o spread do E15. O `BotaoCopo` recebe também `aoAdicionar` e, no toque, chama `aoAdicionar(ml)`; no `App`, os três botões ganham `aoAdicionar={adicionarCopo}`. Para ver o estado mudando, uma linha provisória dentro da meta do dia: `<Text>Copos hoje: {registros.length}</Text>`.
2. O total na barra: `const total` sai de um `reduce` com valor inicial 0, como na aula 3, somando o `ml` de cada registro. Troque a `View` da meta do dia, com a linha provisória, por `<ProgressoMeta total={total} meta={2000} />`.
3. A lista: importe a `FlatList` de `react-native` e o `ItemRegistro` do kit. Embaixo dos copos, o título `<Text style={estilos.secao}>Registros de hoje</Text>` (um estilo novo, `secao`: `fontSize: 18`, `fontWeight: 'bold'`, `color: cores.texto`) e a `FlatList` com `data={registros}`, `keyExtractor={(item) => String(item.id)}` e um `renderItem` que devolve um `ItemRegistro` com o `ml` e a `hora` do item.
4. A lista vazia: importe a `ListaVazia` do kit e passe à `FlatList` a prop `ListEmptyComponent={<ListaVazia texto="Nenhum copo registrado hoje" />}`.
:::

**Sua vez 1: remover um copo**

Os botões Remover ainda não fazem nada. Faça o toque em Remover tirar só aquele registro:

- uma função `removerRegistro(id)` no `App`, que entrega ao `setRegistros` uma lista nova, sem o registro desse `id`;
- no `renderItem`, a prop `aoRemover` do `ItemRegistro`, que chama `removerRegistro` com o `id` do item.

Dicas: tirar um item sem rasurar o original é o `filter` do E15, a peneira que deixa passar todos menos um. A prop `aoRemover` recebe uma função, `aoRemover={() => ...}`, como o `aoFavoritar` do Projeto 4.

**Sua vez 2: README e entrega**

O `README.md` do kit tem três trechos marcados com "Etapa 3". Troque cada um pelo seu texto: o que o app faz, os dois prints do celular salvos em `docs/` e o seu nome. A parte "O kit" pode ficar.

**Pronto quando:** ao abrir, aparecem "0 ml de 2000 ml" e a lista vazia com a gota clarinha; cada copo entra no topo da lista, com a hora, e a barra cresce; com 2500 ml, a barra fica cheia e aparece "Meta batida!"; Remover tira só aquele copo e o total cai; removendo todos, a lista vazia volta; no GitHub, o README mostra os dois prints.

**Commit e push:** `Projeto 5: etapa 3, registros, lista e entrega`. Depois, entregue (próxima seção).

## Como entregar

- **Repositório**: público, chamado `gota`, no seu GitHub, com o `.gitignore` da etapa 1 (sem `node_modules/` nem `.expo/`).
- **Commits**: o do kit e um por etapa, com as mensagens acima. Commits a mais entre as etapas são bem-vindos.
- **README**: o que o app faz, como rodar (`npm install` e `npx expo start`), os dois prints do celular e o seu nome.
- **Na plataforma**: na página deste projeto, cole o link do repositório. O endereço `exp://` do terminal não serve: ele só funciona enquanto o seu computador está com o `npx expo start` ligado.
- **Prazo**: início do E33. Pode colar o link antes; enquanto o instrutor não corrigir, você pode trocá-lo.
- **Depois da correção**: o instrutor pode devolver para ajustes, com um comentário por critério. Corrija, faça um commit e envie de novo pela mesma página.

## Como será avaliado

Nota mínima para aprovação: 70 de 100. O instrutor abre o seu repositório, roda `npm install` e `npx expo start`, abre o app no Expo Go do celular dele, usa o app como na tabela "Exemplos para conferir" e lê o seu `BotaoCopo` e o `App.js`.

| Critério | Pontos | Nota cheia | Exemplo de nota parcial |
|---|---|---|---|
| App no celular | 15 | abre do zero; a gota, o título e a saudação com estilos do `StyleSheet.create` | os estilos escritos dentro da tag (`style={{ fontSize: 32 }}`), sem o `StyleSheet` |
| O seu BotaoCopo | 25 | `Pressable` com `Text`, estilos no fim do arquivo, `ml` como número, `aoAdicionar(ml)` no toque, três copos na `Linha` | os três botões escritos direto no `App`, sem o componente |
| Registros e total | 25 | registro `{ id, ml, hora }` no topo de uma lista nova, total com `reduce`, `ProgressoMeta` mudando na hora | o total certo, mas o copo novo vai para o fim da lista |
| Lista e remoção | 20 | `FlatList` com `keyExtractor`, `ItemRegistro`, `ListaVazia` e Remover que tira só aquele copo | Remover tira todos os copos de uma vez |
| Repositório e README | 15 | commits por etapa, README com os dois prints, sem `node_modules/` | um commit só com tudo, ou o README sem os prints |

:::warning Você precisa saber explicar
Na correção, o instrutor pode pedir que você explique uma parte do seu código, como o `adicionarCopo` ou o `removerRegistro`, e que mude uma coisa pequena na hora, como trocar o copo de 500 por um de 400. Código que você não consegue explicar não conta como seu.
:::

## Dúvidas frequentes

**O Expo Go mostra `Something went wrong` ou `Could not connect to development server`.** O celular não alcança o computador. Confira se os dois estão no mesmo Wi-Fi (dados móveis não servem). Na primeira vez no Windows, a janela do firewall pergunta se o Node.js pode usar a rede: clique em "Permitir acesso". Se nada resolver, use o túnel (próxima pergunta).

**A rede da escola não deixa o celular conectar.** Aperte `Ctrl + C` no terminal e ligue de novo com `npx expo start --tunnel`. O túnel leva o app pela internet, como um desvio quando a rua de sempre está fechada: funciona em quase qualquer rede, só que mais devagar. Ele precisa da conta Expo no terminal (`npx expo login`).

**O Expo Go pede para entrar na conta, ou diz que o projeto é de outra conta.** O Expo Go só abre o app quando a mesma conta Expo está no terminal e no celular. No terminal, `npx expo whoami` mostra a conta; no Expo Go, toque no ícone de pessoa, no canto de cima. Com a mesma conta nos dois, o servidor aparece na tela inicial do Expo Go, em "Development servers": toque nele, sem precisar do QR code.

**O Expo Go diz `Project is incompatible with this version of Expo Go`.** O seu Expo Go está desatualizado. Atualize na loja: o kit é do SDK 58.

**O `npm install` reclama da versão do Node.** O Expo SDK 58 precisa do Node 22.13 ou mais novo. No terminal, `node -v` mostra a sua versão; se for mais velha, instale a versão LTS do site do Node.

**O terminal pergunta `Need to install the following packages: expo`.** Faltou o `npm install` na pasta do projeto, ou o terminal está fora dela. Responda `n`, entre na pasta com `cd gota` e rode `npm install`.

**A pasta ficou `kit-gota/kit-gota`.** O Windows criou uma pasta a mais ao extrair. Use a de dentro, a que tem o `package.json`, e renomeie para `gota`.

**A tela ficou vermelha com `Text strings must be rendered within a <Text> component`.** Um texto ficou fora de um `<Text>`. Às vezes é só um ponto ou uma letra solta entre duas tags.

**A tela ficou vermelha com `Property 'StyleSheet' doesn't exist`** (ou `Image`, `View`, `FlatList`). O nome não está no `import` do topo do arquivo. Acrescente-o entre as chaves do `import ... from 'react-native'`.

**A tela ficou vermelha com `Unable to resolve module`.** O caminho do `import` ou do `require` não bate com o arquivo. Confira as letras maiúsculas (`BotaoCopo`, não `botaoCopo`) e a pasta: dentro de `src/components/`, o tema é `'../tema'`.

**O total aparece como "0300200".** Os ml chegaram como texto, e o `+` do `reduce` juntou textos em vez de somar. No `App`, o número vai entre chaves: `ml={200}`, não `ml="200"`.

**O app se enche de copos sozinho e trava, e o terminal mostra `Cannot update a component (App) while rendering a different component (BotaoCopo)`.** O `onPress` do botão chama a função na hora de desenhar a tela: `onPress={aoAdicionar(ml)}`. Ele precisa receber uma função, que roda só no toque: `onPress={() => aoAdicionar(ml)}`.

**Os copos somem logo depois de aparecer.** O mesmo engano no Remover: `aoRemover={removerRegistro(item.id)}` remove na hora de desenhar a lista. Com o `() =>` na frente, a remoção espera o toque.

**Tocar num copo deixa a tela vermelha, com `aoAdicionar is not a function`.** Esse botão, no `App`, ficou sem `aoAdicionar={adicionarCopo}`.

**O `console.log` não aparece.** Ele aparece no terminal onde o `npx expo start` está ligado, com `LOG` na frente, e não no celular.

**Recarreguei o app e os registros sumiram.** É esperado: os registros ficam na memória do app. Guardar no aparelho é assunto do E43.

**Não tenho celular, ou o meu não instala o Expo Go.** Use o celular de um colega: no Expo Go dele, entre com a sua conta e saia no fim. A entrega continua individual.

**Como passo o print do celular para o computador?** Mande para você mesmo, por e-mail ou pelo WhatsApp Web, ou use o Google Drive. Salve na pasta `docs/` do projeto, com os nomes `vazio.png` e `com-registros.png`.

**Posso usar o `Button` do React Native?** Use o `Pressable`, como no E30: ele aceita o seu estilo.

**Posso mudar as peças do kit?** Pode, depois das três etapas prontas. A nota não depende do visual.

**Atrasei uma etapa.** A nota é da entrega final, mas os commits contam a história do projeto: faça a etapa atrasada antes da seguinte, com a mensagem dela.

## Para ir além

Opcional e sem ponto extra; faça só com as três etapas prontas.

- Um quarto copo, a garrafinha de 750 ml.
- Embaixo do título "Registros de hoje", quantos copos você tomou: "1 copo hoje" ou "3 copos hoje", com o `length` da lista e um `if` do E10.
- Uma frase embaixo do `ProgressoMeta`, que muda com o total: "Que tal o primeiro copo?" com 0 ml, "Falta pouco" a partir de 1000 ml, "Meta batida!" a partir de 2000 ml.
- Um botão "Zerar o dia", que entrega uma lista vazia ao `setRegistros`.
- Trocar as cores em `src/tema.js` e ver o app inteiro mudar de uma vez.
