---
title: Revisão de layout e componentes
summary: Do E33 ao E39 lendo código das Casas de adoção, os erros mais comuns, a Prova 4 e a entrega do Projeto 6.
module: layout-rn
duration_minutes: 90
objectives:
  - Ler uma tela do React Native e dizer o que aparece no celular
  - Achar o engano num código com Flexbox, tema, props, lista, rota, formulário ou estado da tela
  - Saber como é a Prova 4 e o que ela cobra
  - Conferir as Casas de adoção antes de entregar o Projeto 6
---

# Revisão de layout e componentes

Programador Mobile · Encontro E40 · Aula 40 de 45

---

## O que você vai revisar

:::goal
- Flexbox e área segura, do E33, e tokens e tema, do E34
- O seu `CartaoCasa`, do E35, e a lista com busca, do E36
- A navegação, do E37, e o formulário, do E38
- Os estados da tela, a acessibilidade e a tela larga, do E39
- Como é a Prova 4 e o que conferir antes de entregar o Projeto 6
:::

Hoje não tem palavra nova: o encontro é para ler código. Na última hora, a Prova 4.

---

## :icon[map] O mapa da unidade

Em sete encontros, as peças do kit viraram um app de quatro telas.

- **E33**, Flexbox e área segura: a Início com a `Tela`, o topo, os números e os cartões
- **E34**, tokens e tema: os tokens, as cores do `useTema()` e o botão de tema
- **E35**, componentes próprios: o seu `CartaoCasa`, com foto, ícones, toque e selo
- **E36**, listas: a `FlatList`, a busca, a lista vazia e o puxar para atualizar
- **E37**, navegação: o Detalhe, as abas e os links
- **E38**, formulários: o Cadastro, com o erro embaixo de cada campo
- **E39**, estados e acessibilidade: carregando, erro, vazio, leitor de tela e duas colunas

A Prova 4 cobre as sete linhas, com o código do projeto.

---

## Flexbox e área segura

Na prateleira da cozinha, quem decide se os potes ficam lado a lado ou empilhados?

---

## :icon[columns-3] A prateleira e a margem do caderno

O **Flexbox** é a prateleira: a direção, o alinhamento e o espaço entre as caixas, no estilo da `View` de fora. A **área segura** é a margem do caderno: a `Tela` afasta tudo do entalhe e das barras.

| Ideia | Como se escreve |
|---|---|
| a direção | `flexDirection`: `'column'`, o padrão, ou `'row'` |
| o eixo principal | `justifyContent`, como `'space-between'` |
| o eixo cruzado | `alignItems`: `'center'`; o padrão, `'stretch'`, estica |
| o que sobra | `flex: 1`: a caixa estica, e o texto quebra |
| os espaços | `padding` por dentro, `margin` por fora, `gap` entre os filhos |
| o atalho `@` | `'@/components/ui'` leva à pasta `src/` |

---

## :icon[columns-3] Leia o código: a barra de cima

:::example Como fica a barra, dentro da `Tela`, num celular em pé?
```jsx
<View style={estilos.barra}>
  <View style={estilos.circulo} />
  <Text style={estilos.titulo}>Associação Patinhas do Bem, Coração de Jesus</Text>
  <View style={estilos.circulo} />
</View>
```

```javascript
barra: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm },
circulo: { width: 48, height: 48, borderRadius: 24, borderWidth: 1 },
titulo: { flex: 1, fontSize: fonte.subtitulo },
```
:::

:::tip Resposta
Um círculo em cada ponta e, entre eles, o texto, em duas linhas.

- `'row'`: as três caixas lado a lado, na ordem do código
- `flex: 1` no texto: ele fica com o espaço que sobra depois dos dois círculos de 48 e dos vãos, e quebra a linha ali dentro
- `alignItems: 'center'`: os círculos ficam na altura do meio das duas linhas
- `gap: espaco.sm`: 8 entre um e outro
:::

---

## Tokens e tema

O celular foi para o tema escuro. Quem avisa cada tela, e o que muda nela?

---

## :icon[tags] A paleta de tintas e o quadro de avisos

Um **token** é a tinta com nome: o valor mora num lugar só, o `src/theme/tokens.js`. As cores têm nome de papel, iguais nas paletas `claro` e `escuro`. O tema chega a toda tela pelo **contexto**, o quadro de avisos da casa.

| Ideia | Como se escreve |
|---|---|
| os tokens | `espaco.md` (16), `fonte.titulo` (24), `raio.sm` (8) |
| o quadro | o `TemaProvider`, em `app/_layout.js` |
| ler o quadro | `const { cores, escuro, alternarTema } = useTema();` |
| a parede e a tinta | a estrutura no `StyleSheet`; a cor no array de `style` |
| o array | se repetir, vale o último |
| o botão | `onPress={alternarTema}`, sem parênteses |

---

## :icon[layers] Leia o código: o rodapé

:::example O que está errado? São dois enganos, e o app nem abre.
```jsx
import { StyleSheet, Text } from 'react-native';
import { fonte, useTema } from '@/theme';

const { cores } = useTema();

export default function Rodape() {
  return <Text style={estilos.texto}>Feito por Ana Souza</Text>;
}

const estilos = StyleSheet.create({
  texto: { fontSize: fonte.pequena, color: cores.textoSuave },
});
```
:::

:::tip Resposta
1. O `useTema()` está fora da função. Um hook só funciona dentro da função da peça, na primeira linha. Fora dela, o terminal avisa `Invalid hook call`, e o app para
2. A cor está no `StyleSheet.create`, a parede: ele roda uma vez e não fica sabendo do tema. Subir só o hook troca o erro por `Property 'cores' doesn't exist`

O conserto: o hook na função, a cor no array, e no `StyleSheet` só `texto: { fontSize: fonte.pequena }`.

```jsx
export default function Rodape() {
  const { cores } = useTema();
  return <Text style={[estilos.texto, { color: cores.textoSuave }]}>Feito por Ana Souza</Text>;
}
```
:::

---

## Componente próprio

Uma peça de Lego nova chegou. O que ela recebe, e o que ela mostra?

---

## :icon[component] A peça de Lego e o botão do elevador

O `CartaoCasa` é a sua peça de Lego. As props são o pedido feito à peça; a de ação é o botão do elevador: **o filho avisa, o pai decide**.

| Ideia | Como se escreve |
|---|---|
| a peça | `function CartaoCasa({ casa, onPress })`, com `export default` |
| a foto | `<Image source={{ uri: casa.foto }} />`, com `width` e `height` |
| a reserva | `casa.foto ? (...) : (...)`: o `''` conta como "não" |
| o ícone | `<Ionicons name="paw" size={32} color={cores.textoSuave} />` |
| o retorno | `style={({ pressed }) => (pressed ? estilos.apertado : null)}` |
| a variante | o `tom` do `Badge`: a camiseta em outra cor |

---

## :icon[mouse-pointer-click] Leia o código: o toque que não avisa

:::example O que está errado?
No fim do E35, o cartão fica translúcido enquanto o dedo aperta, mas nenhum aviso abre. Nenhuma mensagem aparece.

```jsx
// src/components/CartaoCasa.js
export default function CartaoCasa({ casa, onPress }) {
  // ...
  return (
    <Pressable onPress={onPress} style={({ pressed }) => (pressed ? estilos.apertado : null)}>
```

```jsx
// app/index.js, no map
<CartaoCasa
  key={casa.id}
  casa={casa}
  aoTocar={() => Alert.alert(casa.nome, `Visitas: ${casa.visitas}`)}
/>
```
:::

:::tip Resposta
A Início manda `aoTocar`, e o cartão espera `onPress`. O `onPress` chega `undefined`, e o `Pressable` não tem o que chamar no toque. O translúcido continua, porque o `pressed` é do próprio `Pressable`. O nome da prop é o mesmo nos dois lados: na Início, `onPress={() => Alert.alert(...)}`.
:::

---

## :icon[badge-check] Leia o código: a ordem das saídas

:::example O que mostram os selos?
A Casa da Pipoca tem 1 vaga livre; o Lar da Mel, nenhuma. Um colega escreveu o selo assim:

```jsx
let selo = `${livres} vagas`;
let tom = 'sucesso';
if (livres <= 3) {
  selo = `Últimas ${livres} vagas`;
  tom = 'alerta';
} else if (livres === 1) {
  selo = 'Última vaga';
  tom = 'alerta';
} else if (livres <= 0) {
  selo = 'Lotada';
  tom = 'perigo';
}
```
:::

:::tip Resposta
"Últimas 1 vagas" e "Últimas 0 vagas", os dois em laranja. Na estrada com várias saídas, vale a primeira que serve.

| `livres` | `livres <= 3`? | O selo |
|---|---|---|
| 0 | `true` | Últimas 0 vagas |
| 1 | `true` | Últimas 1 vagas |
| 8 | `false`, e as outras também | 8 vagas |

O conserto: do caso mais estreito ao mais largo, `<= 0`, `=== 1` e `<= 3`.
:::

---

## Listas e busca

Alguém digita "sao", sem til. Como o app acha São Paulo e desenha só o que cabe?

---

## :icon[list] A esteira, a peneira e o texto passado a limpo

A **`FlatList`** é a esteira: só desenha o que cabe na tela. A busca é a peneira do `filter`, e a `paraBusca` passa os dois lados a limpo: minúsculas, sem acento, sem espaço nas pontas.

| Ideia | Como se escreve |
|---|---|
| as casas | `useCasas()`, o quadro de avisos das casas |
| a esteira | `keyExtractor={(casa) => String(casa.id)}` e `renderItem={({ item }) => ...}` |
| o topo | `ListHeaderComponent={topo}`, e a `Tela` sem `rolar` |
| o campo | `value={termo}` e `onChangeText={setTermo}`: o estado manda |
| a peneira | `paraBusca(casa.nome).includes(busca) \|\| ...` |
| o vazio e o puxar | `ListEmptyComponent`, `refreshing` e `onRefresh` |

---

## :icon[search] Leia o código: os números da busca

:::example O que a faixa de números mostra?
A Início é a do fim do projeto, com uma diferença: o `resumo` saiu de cima e foi para depois da busca. A pessoa digita `curitiba`.

```jsx
const busca = paraBusca(termo);
const visiveis = casas.filter(
  (casa) =>
    paraBusca(casa.nome).includes(busca) ||
    paraBusca(casa.bairro).includes(busca) ||
    paraBusca(casa.cidade).includes(busca),
);
const resumo = resumoDasCasas(visiveis);
```
:::

:::tip Resposta
Os números 2, 1 e 21, e os dois cartões de Curitiba: ONG Amigo Fiel, com 14 vagas, e Cantinho dos Bichanos, com 7. O `resumoDasCasas(visiveis)` conta só o que passou na peneira: 2 casas, 1 cidade, 14 + 7 vagas.

No projeto, o `resumo` usa `casas`, e os números ficam 12, 5 e 76 em qualquer busca: eles contam o app inteiro.
:::

---

## :icon[list] Leia o código: a lista que não abre

:::example O que está errado? São dois enganos.
Quando as casas chegam, a tela vermelha diz `Cannot read property 'capacidade' of undefined`. Consertado esse engano, o terminal ainda avisa `VirtualizedLists should never be nested inside plain ScrollViews`.

```jsx
return (
  <Tela rolar>
    <FlatList
      data={visiveis}
      keyExtractor={(casa) => String(casa.id)}
      renderItem={({ casa }) => (
        <CartaoCasa casa={casa} onPress={() => router.push('/casa/' + casa.id)} />
      )}
      ListHeaderComponent={topo}
    />
  </Tela>
);
```
:::

:::tip Resposta
1. A `FlatList` entrega cada casa no campo `item`. O `({ casa })` pega um campo que não existe, e o cartão recebe `undefined`. O conserto: `renderItem={({ item }) => <CartaoCasa casa={item} ... />}`, com `item.id` no endereço
2. A `Tela rolar` põe a lista dentro de uma tela que rola, e a esteira quebra. Com a `FlatList`, é `<Tela>`, sem `rolar`
:::

---

## Navegação

Você abriu uma casa e, nela, outra. Quantos toques em voltar até a lista?

---

## :icon[route] O endereço, a pilha de cartas e o fichário

No **Expo Router**, cada arquivo de `app/` é uma tela, e o nome dele é o endereço. A **pilha** é a pilha de cartas: a tela nova vai por cima. As **abas** são as de um fichário: trocar de aba não empilha nada.

| Ideia | Como se escreve |
|---|---|
| a moldura | `_layout.js`: a `Stack` e as `Tabs` |
| o endereço com número | `app/casa/[id].js` atende `/casa/4` |
| o `id` chega em texto | `Number(id)` no `find` |
| abrir por cima | `onPress={() => router.push('/casa/' + item.id)}` |
| o texto que navega | `<Link href={'/casa/' + outra.id}>` |
| o grupo | `(abas)` não entra no endereço: a Sobre é `/sobre` |

---

## :icon[map-pin] Leia o código: o endereço com número

:::example O que o Detalhe mostra em cada endereço?
O começo do `app/casa/[id].js`, do projeto:

```jsx
const { id } = useLocalSearchParams();
const { casas } = useCasas();
const casa = casas.find((item) => item.id === Number(id));

if (!casa) {
  return <EstadoVazio titulo="Casa não encontrada" mensagem="Volte para a lista e escolha outra casa." />;
}
```

Os endereços: `/casa/9`, `/casa/nove` e `/casa/13`, antes e depois de cadastrar o Lar do Totó.
:::

:::tip Resposta
| Endereço | `Number(id)` | A tela |
|---|---|---|
| `/casa/9` | `9` | o Detalhe da Casa da Pipoca |
| `/casa/nove` | `NaN` | Casa não encontrada |
| `/casa/13`, antes do cadastro | `13` | Casa não encontrada: só existem 12 |
| `/casa/13`, depois | `13` | o Detalhe do Lar do Totó: o `adicionarCasa` deu a ele o `id` 13 |

Nenhum dá `Unmatched Route`: os quatro batem com o arquivo `app/casa/[id].js`. Quem decide a tela é o `find`.
:::

---

## Formulários

Na vistoria do carro, a folha diz o que reprovou. No cadastro, quem diz?

---

## :icon[square-pen] A ficha de papel e a folha da vistoria

O formulário é a ficha de cadastro em papel, na tela: cada `Campo` com o seu `useState`. O `validar()` é a vistoria do carro: devolve uma folha com o **nome de cada campo** que reprovou. Folha em branco, `{}`, aprovado.

| Ideia | Como se escreve |
|---|---|
| o campo | `value={nome}` e `onChangeText={setNome}` |
| o teclado | `keyboardType="phone-pad"` ou `"number-pad"` |
| uma opção só | `<Opcoes valor={aceita} onMudar={setAceita} />` |
| do campo vem texto | `Number` antes de comparar: `'6' > '10'` é `true` |
| o erro no lugar | `novos.cidade = '...'` e `erro={erros.cidade}` |
| salvar e voltar | `adicionarCasa(...)` e `router.back()` |

---

## :icon[list-checks] Leia o código: a vistoria do cadastro

:::example O que aparece ao tocar em Cadastrar casa?
A Bia digitou: nome `'  Lar  '`, bairro `'Centro'`, cidade `'   '` (três espaços), telefone `'(19) 3251-4400'`, Gatos, capacidade `'10'` e animais `'12'`. Parte do `validar`:

```jsx
if (nome.trim().length < 3) novos.nome = 'Escreva o nome da casa, com pelo menos 3 letras';
if (cidade.trim() === '') novos.cidade = 'Informe a cidade';
const lugares = Number(capacidade);
const animais = Number(ocupacao);
if (ocupacao.trim() === '') {
  novos.ocupacao = 'Quantos animais estão lá hoje (0 se nenhum)';
} else if (!Number.isInteger(animais) || animais < 0) {
  novos.ocupacao = 'Use um número inteiro, como 12';
} else if (animais > lugares) {
  novos.ocupacao = 'Não pode passar da capacidade';
}
```
:::

:::tip Resposta
Duas mensagens, com a borda vermelha: "Informe a cidade" embaixo da Cidade e "Não pode passar da capacidade" embaixo dos Animais. E o aviso "Confira o formulário". Nada é salvo.

| Campo | O `validar` vê | Reprova? |
|---|---|---|
| nome | `'Lar'`: o `trim` tira os espaços das pontas, e sobram 3 letras | não |
| cidade | `''`: só havia espaços | sim |
| animais | `12 > 10`, em números | sim |
:::

---

## Estados e acessibilidade

Internet fraca, olhos fechados, celular deitado: o app continua dizendo o que acontece?

---

## :icon[layout-list] O painel, a legenda e a fita métrica

Uma tela que busca dados tem **estados**, como o painel da lanchonete: carregando, erro, vazio ou com dados. Os especiais saem com o retorno antecipado, o segurança na porta do show.

| Ideia | Como se escreve |
|---|---|
| os estados | `if (carregando) return ...;` e, depois, `if (erro)` |
| a regra dos hooks | os `use...` antes do primeiro `return` |
| a legenda | rótulo, papel e dica; `accessible` junta um bloco |
| o alvo do dedo | pelo menos 44: `minHeight: 44` nos links |
| a fita métrica | `useWindowDimensions()` e `width >= 700 ? 2 : 1` |
| crachá novo, lista nova | `key={colunas}` e `numColumns={colunas}` |

---

## :icon[triangle-alert] Leia o código: o hook atrasado

:::example O que aparece no celular, em pé?
Um colega arrumou o começo da Início assim:

```jsx
export default function Inicio() {
  const { cores, escuro, alternarTema } = useTema();
  const { casas, carregando, atualizando, erro, recarregar } = useCasas();
  const [termo, setTermo] = useState('');

  if (carregando) return <Carregando texto="Buscando as casas..." />;
  if (erro) return <EstadoErro mensagem={erro} onTentarDeNovo={recarregar} />;

  const { width } = useWindowDimensions();
  const colunas = width >= 700 ? 2 : 1;
```
:::

:::tip Resposta
"Buscando as casas..." e, quando as casas chegam, a tela vermelha `Rendered more hooks than during the previous render`.

| Desenho | `carregando` | Hooks chamados |
|---|---|---|
| 1º, ao abrir | `true` | 3, e sai no primeiro `return` |
| 2º, as casas chegaram | `false` | 4: o React esperava 3 |

O conserto: as duas linhas do `useWindowDimensions` sobem para junto dos outros hooks, antes do `if (carregando)`.
:::

---

## :icon[smartphone] Leia o código: a tela que gira

:::example O que está errado? São dois enganos.
Em pé, a Início abre com a tela vermelha `columnWrapperStyle not supported for single column lists`. Com esse engano consertado, deitar o celular dá `Changing numColumns on the fly is not supported`.

```jsx
<FlatList
  numColumns={colunas}
  columnWrapperStyle={estilos.linha}
  data={visiveis}
  keyExtractor={(casa) => String(casa.id)}
  renderItem={({ item }) => (
    <View style={colunas === 2 ? estilos.metade : null}>
      <CartaoCasa casa={item} onPress={() => router.push('/casa/' + item.id)} />
    </View>
  )}
/>
```
:::

:::tip Resposta
1. O `columnWrapperStyle` é o estilo de cada linha da grade. Com uma coluna, não há grade: `columnWrapperStyle={colunas === 2 ? estilos.linha : null}`
2. Falta o crachá da própria lista: `key={colunas}`. Girou, crachá novo, lista nova
:::

---

## :icon[siren] Os erros que mais apareceram

| O engano | O que aparece | O conserto |
|---|---|---|
| faltou `flex: 1` | o nome passa da borda | `flex: 1` na caixa que estica |
| a cor no `StyleSheet` | o texto some no escuro | a cor no array |
| `item.id === id` | "Casa não encontrada" | `Number(id)` |
| `onPress={router.push(...)}` | um Detalhe abre sozinho | a seta: `() => router.push(...)` |
| `'6' > '10'` | 6 animais em 10 lugares não passa | `Number` antes |
| um hook depois do `return` | `Rendered more hooks` | os hooks no começo |

Sem mensagem: o `flex: 1`, a cor, o `Number(id)` e o `'6' > '10'`. A pista é a tela.

---

## :icon[clipboard-check] Como é a Prova 4

| Item | Como é |
|---|---|
| questões | 20, do E33 ao E39, embaralhadas para cada pessoa |
| tempo | 60 minutos: o cronômetro começa no **Começar** e, no zero, envia sozinho |
| tentativas | uma; ela só conta quando você clica em **Enviar** |
| consulta | nenhuma: só a aba da prova aberta, sem slides, sem VS Code, celular guardado |
| nota mínima | 70 |
| gabarito | não aparece ao enviar: você vê a nota e se foi aprovado |

Os tipos de questão: escolha única, múltipla escolha (marque todas as certas), verdadeiro ou falso e lacuna (a palavra exata, como no código).

---

## :icon[book-open] O que estudar para a prova

Mais da metade das questões traz um código para ler: o que aparece no celular ou o que está errado.

:::steps
1. Leia o código linha por linha antes de olhar as alternativas
2. Procure primeiro os enganos mais comuns: o `flex: 1`, a cor fora do array, o nome das props, o `({ item })`, o `Number(id)`, a seta no `onPress`, o `Number` antes de comparar e a ordem dos `if` e dos hooks
3. Repare nas palavras que mudam a resposta: **não**, **sempre**, **primeiro**, **antes**
4. Na múltipla escolha, julgue cada alternativa sozinha
:::

Para estudar: as aulas do E33 ao E39, os sete quizzes e o seu Casas de adoção, da Início ao Cadastro.

---

## :icon[milestone] Projeto 6 · Antes de entregar

Com o app aberto no celular, faça o caminho da correção:

- :icon[check] 12, 5 e 76; os selos da tabela de vagas; tudo se lê nos dois temas
- :icon[search] "sao" mostra 4, "RIBEIRAO" 2, "geladeira" o aviso; puxar mostra a rodinha
- :icon[route] o Lar da Mel abre o Detalhe com dois links; voltar tira uma tela por vez
- :icon[square-pen] o Cadastro vazio mostra sete mensagens; 10 lugares e 6 animais: "4 vagas", no topo
- :icon[eye-off] o leitor lê o cartão numa frase e "12 casas"; deitado, duas colunas
- :icon[settings] o `servidor.js` com `atraso: 800`, `falhas: 0` e `vazio: false`; os quatro prints

Na correção, o instrutor pode pedir que você explique o selo do `CartaoCasa`.

---

## :icon[milestone] Projeto 6 · Como entregar

A etapa 7 ainda sem commit? Num segundo terminal do VS Code:

```bash
git add .
git commit -m "Projeto 6: etapa 7, estados, acessibilidade e entrega"
git push
```

Um ajuste depois desse commit vai num commit novo, com uma mensagem que diz o que mudou, como `Projeto 6: prints no README`.

:::steps
1. No GitHub, abra o repositório `casas-de-adocao`: os sete commits das etapas, os prints no README e nenhuma pasta `node_modules`
2. Na página do curso, em **Projetos**, abra o Projeto 6 e cole o link do repositório: nem o do seu perfil, nem o `exp://` do Expo
3. Até a correção, você pode trocar o link
:::

**Prazo: início do E41.** O instrutor pode devolver o projeto para ajustes, com um comentário por critério: corrija, faça um commit e envie de novo pela mesma página.

---

## Resumo

:::summary
- Flexbox é a prateleira: direção, alinhamento, `flex: 1` e `gap`; a `Tela` cuida da área segura
- Os tokens dão nome às medidas; a cor do `useTema()` vai no array de `style`, e o hook, dentro da função
- O `CartaoCasa` recebe `casa` e `onPress`, com o mesmo nome nos dois lados; no `else if`, vale a primeira saída
- A `FlatList` entrega cada casa em `item`; a busca passa os dois lados pela `paraBusca`
- O `id` do endereço chega em texto: `Number(id)`; o `router.push` vai numa seta
- O `validar` devolve uma folha com o nome de cada campo; os hooks vêm antes do primeiro `return`
- A Prova 4: 20 questões, 60 minutos, uma tentativa, nota mínima 70
:::

---

## :icon[arrow-right] Próximos passos

No E41, começa o **projeto integrador**, em equipe:

- :icon[users] equipes de 3 ou 4 pessoas, e cada equipe escolhe um dos três briefings
- :icon[clipboard-list] do briefing ao backlog: o que o app precisa fazer, em histórias de usuário
- :icon[package] o kit do integrador: as peças, os tokens e o tema que você já conhece do Projeto 6

Pense em quem você quer na sua equipe. O Projeto 6 entra até o início do E41.
