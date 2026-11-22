---
title: Estados e acessibilidade
summary: Carregando, erro e vazio, leitor de tela, área de toque e duas colunas em tela larga; o Projeto 6 é entregue.
module: layout-rn
duration_minutes: 90
objectives:
  - Mostrar carregando, erro e lista vazia com as peças do kit e o retorno antecipado
  - Dar rótulo, papel e dica aos elementos e conferir com o leitor de tela
  - Garantir área de toque de 44 e duas colunas em tela larga com useWindowDimensions
  - Entregar o Projeto 6 com o README e os prints
---

# Estados e acessibilidade

Programador Mobile · Encontro E39 · Aula 39 de 45

---

## O que você vai aprender

:::goal
- Mostrar o que acontece enquanto as casas chegam, quando o servidor falha e quando a lista vem vazia
- Fazer o leitor de tela ler cada cartão numa frase só
- Deixar todo alvo de toque com pelo menos 44 de altura
- Mostrar duas colunas quando a tela é larga
- Entregar o Projeto 6
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **estado da tela** | o momento em que a tela está: carregando, com erro, vazia ou com os dados |
| **leitor de tela** | o programa do celular que lê em voz alta o que está na tela |
| **rótulo** | a frase que o leitor de tela lê para um elemento, o `accessibilityLabel` |
| **área de toque** | o pedaço da tela que responde ao dedo |
| **responsivo** | o layout que se ajusta à largura da tela |

---

## O app só conhece o dia bom

Com a internet fraca, a Início abre com 0 casas, 0 cidades, 0 vagas e "Nenhuma casa encontrada". Parece que não existe casa nenhuma.

| Situação | Hoje | No fim do encontro |
|---|---|---|
| o servidor demora | 0, 0, 0 e "Nenhuma casa encontrada" | "Buscando as casas..." |
| o servidor falha | o mesmo aviso | "Algo deu errado" e Tentar de novo |
| leitor de tela no cartão | textos emendados, sem dizer que é botão | uma frase, "botão" e o que o toque faz |
| celular deitado | cartões esticados | duas colunas |

:::question
Que outras pessoas usam o celular de um jeito diferente do seu?
:::

---

## Os estados da tela

O app abriu e a tela está vazia. Está carregando, não tem nada ou quebrou?

---

## :icon[layout-list] Os estados de uma tela que busca dados

Uma tela que busca dados passa por **estados**: o momento em que ela está. É o painel da lanchonete do E27: nunca fica apagado, sempre diz em que pé está o pedido.

| Estado | Quando | O que a Início mostra |
|---|---|---|
| carregando | as casas ainda não chegaram | a rodinha do `Carregando` |
| erro | o servidor falhou | o `EstadoErro`, com Tentar de novo |
| vazio | a lista chegou sem nenhuma casa | o `EstadoVazio` |
| com dados | as casas chegaram | a lista |

O Livro de Receitas do E27 já tinha carregando e erro; hoje é no celular, com as peças do kit.

---

## :icon[route] O caminho entre os estados

:::center
![Diagrama: o app abre no Carregando; quando o servidor responde, a Início vai para Com dados, para Vazio ou para Erro; do Erro, o botão Tentar de novo volta ao Carregando](images/e39-estados-da-tela.svg)
:::

Toda busca começa no carregando. Quando o servidor responde, a tela vai para um dos outros três. Do erro, o Tentar de novo volta ao começo.

---

## :icon[sliders-horizontal] Os estados na prática: a simulação

O kit traz um **servidor de mentira**, em `src/data/servidor.js`: ele responde depois de um tempo, como uma API de verdade. Para ver cada estado sem desligar a internet, troque um valor da `simulacao` e salve, como num simulado de incêndio, que treina a saída sem fogo de verdade:

```javascript
export const simulacao = {
  atraso: 800, // quanto o servidor demora para responder, em milissegundos
  falhas: 0, // quantas buscas seguidas dão erro: com 1, a primeira falha e a segunda funciona
  vazio: false, // true: o servidor responde com a lista vazia
};
```

| Troque para | Para ver |
|---|---|
| `atraso: 3000` | 3 segundos de carregando |
| `falhas: 1` | o erro; a busca do Tentar de novo funciona |
| `vazio: true` | a lista sem nenhuma casa |

Salvar o `servidor.js` recarrega o app inteiro. No fim, volte aos valores de partida.

---

## :icon[shield-check] Um return para cada estado

Na Início, cada estado especial sai da função logo no começo, com o **retorno antecipado** do E10, o segurança na porta do show. É um `if` de uma linha, sem chaves, como no `validar` do E38:

```jsx
if (carregando) return <Carregando texto="Buscando as casas..." />;
if (erro) return <EstadoErro mensagem={erro} onTentarDeNovo={recarregar} />;
// daqui para baixo, a lista chegou: com casas ou vazia
```

| Momento | `carregando` | `erro` | Na tela |
|---|---|---|---|
| acabou de abrir | `true` | `null` | Buscando as casas... |
| o servidor falhou | `false` | a mensagem | Algo deu errado |
| tocou em Tentar de novo | `true` | a mensagem | Buscando as casas... |
| chegaram as casas | `false` | `null` | a lista |

A ordem importa: no Tentar de novo, o `erro` ainda tem a mensagem, e o carregando ganha porque vem primeiro.

---

## :icon[triangle-alert] Hooks sempre antes do primeiro return

Os **hooks** são as funções do React que começam com `use` (E27): `useTema`, `useCasas`, `useState`. O React reconhece cada um pela **ordem** em que é chamado, a cada desenho, como a chamada da escola pelo número. Com o `useState` do termo depois do `if (carregando) return`, a conta não bate:

| Desenho | `carregando` | Hooks chamados | O React |
|---|---|---|---|
| 1º, ao abrir | `true` | `useTema`, `useCasas` e sai no `return` | guarda: 2 hooks |
| 2º, a lista chegou | `false` | `useTema`, `useCasas` e `useState` | esperava 2, vieram 3 |

Resultado: a tela vermelha `Rendered more hooks than during the previous render`. A regra: todos os hooks antes de qualquer `return`.

---

## :icon[notebook-pen] Exercícios: Os estados da tela

:::example Exercícios
1. No app do ônibus, que estado é: a rodinha girando; a lista sem horários; "Sem conexão"?
2. Para ver 5 segundos de carregando, o que muda na `simulacao`?
3. O que aparece no terminal?
   ```javascript
   function tela(carregando, erro, horarios) {
     if (carregando) return 'Buscando os horários...';
     if (erro) return 'Algo deu errado';
     if (horarios.length === 0) return 'Nenhum ônibus agora';
     return horarios.length + ' ônibus';
   }
   console.log(tela(true, 'Sem rede', []));
   console.log(tela(false, null, ['701U', '8700']));
   ```
4. Com `falhas: 2`, o que aparece no primeiro toque em Tentar de novo?
5. Ache o erro e conserte:
   ```jsx
   const { treinos, carregando } = useTreinos();
   if (carregando) return <Carregando />;
   const [dia, setDia] = useState('segunda');
   ```
:::

:::tip Respostas
1. Carregando, vazio e erro
2. `atraso: 5000`, em milissegundos
3. `Buscando os horários...` e `2 ônibus`: o carregando vem primeiro e ganha do erro
4. Carregando e erro de novo: a segunda busca também falha; o toque seguinte traz a lista
5. Hook depois do `return` dá tela vermelha quando os treinos chegam: o `useState` sobe para antes do `if`
:::

---

## :icon[milestone] Projeto 6 · Passo 1: carregando

:::steps
1. Em `app/(abas)/index.js`, `Carregando` no import de `@/components/ui`
2. No `useCasas()`, pegue também **`carregando`** (`true` ou `false`) e **`erro`** (a mensagem ou `null`)
3. Logo depois do `useState` do termo, o primeiro `return`
4. Em `src/data/servidor.js`, `atraso: 3000`, e salve
:::

```jsx
const { casas, carregando, atualizando, erro, recarregar } = useCasas();
const [termo, setTermo] = useState('');

if (carregando) return <Carregando texto="Buscando as casas..." />;
```

O `texto` troca o "Carregando..." de sempre por uma frase que diz o que o app está fazendo.

**Pronto quando:** por 3 segundos, a rodinha na cor primária e "Buscando as casas..." no meio da tela; depois, a lista.

---

## :icon[milestone] Projeto 6 · Passo 2: erro

:::steps
1. `EstadoErro` no import de `@/components/ui`
2. Logo abaixo do `if (carregando)`, o segundo `return`
3. No `servidor.js`, `falhas: 1`, e salve
4. Toque em Tentar de novo
5. Volte para `atraso: 800` e `falhas: 0`
:::

```jsx
if (erro) return <EstadoErro mensagem={erro} onTentarDeNovo={recarregar} />;
```

O `recarregar` vai sem parênteses: o botão chama a função só no toque.

**Pronto quando:** depois do carregando, a nuvem vermelha, "Algo deu errado", a mensagem do servidor e o botão Tentar de novo; o toque mostra o carregando de novo e traz a lista.

---

## Leitor de tela

Como uma pessoa cega escolhe uma casa no app, sem ver a tela?

---

## :icon[eye-off] Leitor de tela: o celular lê em voz alta

O **leitor de tela** é um programa do celular que lê em voz alta o que está na tela. Quem é cego ou enxerga pouco usa o leitor todo dia. No Android, ele se chama **TalkBack**; no iPhone, **VoiceOver**.

Com ele ligado, um contorno marca o elemento **em foco**, o que está sendo lido, e os gestos mudam:

| Para | TalkBack e VoiceOver |
|---|---|
| ouvir um item | um toque nele |
| ativar o item ouvido | dois toques rápidos |
| ir ao próximo | deslizar um dedo para a direita |
| rolar a lista | dois dedos no Android, três no iPhone |

O que ele fala, você escreve no código.

---

## :icon[power] Ligar e desligar o leitor de tela

Configure o atalho **antes** de ligar: ele é a saída de emergência.

| | Android: TalkBack | iPhone: VoiceOver |
|---|---|---|
| onde fica | Configurações, Acessibilidade, TalkBack | Ajustes, Acessibilidade, VoiceOver |
| o atalho | Atalho do TalkBack: as duas teclas de volume por 3 segundos | Atalho de Acessibilidade, VoiceOver: três cliques no botão lateral |
| para desligar | o mesmo atalho | o mesmo atalho, ou pedir à Siri "Desativar VoiceOver" |
| sem atalho | no interruptor do TalkBack: um toque para ouvir, dois para desligar | no interruptor do VoiceOver: um toque para ouvir, dois para desligar |

O caminho muda de um fabricante para outro. Use fone: o leitor também lê as notificações.

---

## :icon[megaphone] Rótulo, papel e dica

O leitor lê a **legenda** que você escreve, como a de um filme, só que em voz alta. Ela vem de três props:

| Prop | Responde | No cartão |
|---|---|---|
| `accessibilityLabel` (**rótulo**) | o que é? | "Lar da Mel, Pinheiros, São Paulo. Cães. Lotada" |
| `accessibilityRole` (**papel**) | que tipo de coisa? | `"button"`: o leitor diz "botão" |
| `accessibilityHint` (**dica**) | o que o toque faz? | "Abre os detalhes da casa" |

A prop **`accessible`** junta um bloco num foco só. O `Pressable` já nasce junto; a `View` e o `Cartao`, não: sem ela, o leitor para em cada texto.

Sem o papel no rótulo: "Botão Lar da Mel" vira "Botão Lar da Mel, botão".

---

## :icon[megaphone] Rótulos na prática

**Caso 1: o botão só com ícone.** O `BotaoIcone` do E34 põe o `rotulo` no `accessibilityLabel`: o leitor diz "Usar tema escuro, botão". Sem rótulo, um ícone não diz nada.

**Caso 2: o título.** Com `accessibilityRole="header"`, o leitor avisa que é um título, e quem usa leitor de tela pula de título em título.

**Caso 3: o cartão.** O rótulo é uma template string do E06, a mensagem pronta com lacunas:

```jsx
accessibilityLabel={`${casa.nome}, ${casa.bairro}, ${casa.cidade}. ${casa.aceita}. ${selo}`}
```

| Casa | O leitor lê |
|---|---|
| Lar da Mel | Lar da Mel, Pinheiros, São Paulo. Cães. Lotada |
| Casa do Bigode | Casa do Bigode, Liberdade, São Paulo. Gatos. Últimas 3 vagas |
| Recanto São Francisco | Recanto São Francisco, Bosque, Campinas. Cães e gatos. 8 vagas |

---

## :icon[notebook-pen] Exercícios: Leitor de tela

:::example Exercícios
1. Com o leitor ligado, como ativar o item ouvido? E ir ao próximo?
2. Num app de mercado, que prop recebe cada valor: `"button"`, `"Arroz 5 kg, R$ 27,90"` e `"Põe o arroz no carrinho"`?
3. Que rótulo sai daqui?
   ```javascript
   const onibus = { linha: '701U', destino: 'Butantã', minutos: 4 };
   const rotulo = `Linha ${onibus.linha}, para ${onibus.destino}. Chega em ${onibus.minutos} minutos`;
   console.log(rotulo);
   ```
4. O leitor fala "Botão Pedir lanche, botão". O que sobra?
5. O leitor lê `${item.nome}` ao pé da letra. Por quê?
   ```jsx
   accessibilityLabel={'${item.nome}, ${item.preco}'}
   ```
:::

:::tip Respostas
1. Dois toques rápidos; deslizar um dedo para a direita
2. `accessibilityRole`, o papel; `accessibilityLabel`, o rótulo; `accessibilityHint`, a dica
3. `Linha 701U, para Butantã. Chega em 4 minutos`
4. O "Botão" do rótulo: o papel já diz. Rótulo: `"Pedir lanche"`
5. Aspas simples não fazem template string: a lacuna pede crase
:::

---

## Área de toque

Por que o interruptor de tecla larga é mais fácil de acertar no escuro?

---

## :icon[hand] Área de toque: pelo menos 44

A **área de toque** é o pedaço da tela que responde ao dedo. Alvo pequeno vira toque errado, ainda mais com tremor nas mãos ou no ônibus. É o interruptor de tecla larga: acerta até no escuro.

O mínimo é **44 por 44** pontos (a Apple pede 44; o Android, 48). As peças do kit já cumprem:

| Peça | Altura |
|---|---|
| `Botao`, `BotaoIcone` e a caixa do `Campo` | 48 |
| cada opção das `Opcoes` | 44 |
| o seu `CartaoCasa`, com a foto de 72 e o padding | mais de 100 |
| os links de "Outras casas", no Detalhe | menos de 30 |

Só os links ficam abaixo do mínimo.

---

## :icon[hand] Área de toque na prática

No Detalhe, cada outra casa da cidade é um `Link`: um texto de 16 com 4 em cima e 4 embaixo. Um abaixo do outro, o dedo acerta o vizinho.

```javascript
// antes: menos de 30 de altura
link: { fontSize: fonte.corpo, fontWeight: 'bold', paddingVertical: espaco.xs },

// depois: pelo menos 44
link: { minHeight: 44, fontSize: fonte.corpo, fontWeight: 'bold', paddingVertical: espaco.sm },
```

- **`minHeight`** (altura mínima): o link começa com 44 e cresce se o texto pedir, como um nome que quebra a linha
- `height: 44` seria uma altura fixa: com a letra do celular aumentada, o texto ficaria cortado
- `espaco.sm` é o token de 8: mais folga em cima e embaixo

---

## :icon[notebook-pen] Exercícios: Área de toque

:::example Exercícios
1. A Apple pede pelo menos 44 de área de toque. E o Android?
2. Num app de academia, o botão "Marcar série" tem um texto de 20 de altura e `paddingVertical: 8`. Ele chega aos 44?
3. O que aparece no terminal?
   ```javascript
   function altura(texto, padding) {
     return texto + padding * 2;
   }
   console.log(altura(20, 4) >= 44, altura(20, 12) >= 44);
   ```
4. Complete para o item "Ver horários" começar com 44 e crescer com a letra grande do celular: `item: { ___: 44, paddingVertical: espaco.sm }`
:::

:::tip Respostas
1. 48
2. Não: 20 + 8 + 8 dá 36
3. `false true`: 28 fica abaixo; 44 chega lá
4. `minHeight`: com `height: 44`, a altura fica fixa, e o texto maior sai cortado
:::

---

## :icon[milestone] Projeto 6 · Passo 3: acessibilidade

:::steps
1. No `CartaoCasa`, o `Pressable` de fora ganha papel, rótulo e dica
2. Na Início, o `Text` do título ganha `accessibilityRole="header"`
3. No Detalhe, a foto grande ganha `accessible` e rótulo: sozinha, sem rótulo, o leitor a pula. A do cartão fica dentro do `Pressable`, que já tem o rótulo
4. No Detalhe, o estilo `link` ganha os 44
:::

```jsx
<Pressable
  onPress={onPress}
  accessibilityRole="button"
  accessibilityLabel={`${casa.nome}, ${casa.bairro}, ${casa.cidade}. ${casa.aceita}. ${selo}`}
  accessibilityHint="Abre os detalhes da casa"
  style={({ pressed }) => (pressed ? estilos.apertado : null)}
>
```

```jsx
<Image
  source={{ uri: casa.foto }}
  style={estilos.foto}
  accessible
  accessibilityLabel={`Foto da casa ${casa.nome}`}
/>
```

```javascript
link: { minHeight: 44, fontSize: fonte.corpo, fontWeight: 'bold', paddingVertical: espaco.sm },
```

**Pronto quando:** com o leitor ligado, um toque no Lar da Mel lê o rótulo, diz "botão" e, depois de uma pausa, "Abre os detalhes da casa" (as palavras exatas variam com o celular); dois toques abrem o Detalhe.

---

## Tela larga

Você deita o celular para ver um vídeo. O Casas de adoção acompanha?

---

## :icon[smartphone] useWindowDimensions: a fita métrica da tela

Um app **responsivo** se ajusta à largura da tela. Quem mede é o **`useWindowDimensions`**, um hook do React Native que é a fita métrica da tela: entrega a largura (`width`) e a altura (`height`), em pontos, os números sem `px` do E30.

```jsx
const { width } = useWindowDimensions();
const colunas = width >= 700 ? 2 : 1;
```

| Linha | O que ela diz |
|---|---|
| `const { width } = useWindowDimensions();` | "meça a tela e guarde a largura em `width`" (a desestruturação do E13) |
| `width >= 700 ? 2 : 1` | "700 ou mais? Então 2; senão, 1" (o ternário do E10) |

Quando o celular gira, a medida muda e a tela desenha de novo, como com o estado. Deixe a rotação automática do celular ligada.

---

## :icon[smartphone] Tela larga na prática

A mesma linha, com a largura de quatro telas, num `for...of` do E11:

```javascript
for (const width of [393, 667, 820, 852]) {
  const colunas = width >= 700 ? 2 : 1;
  console.log(width, '->', colunas, 'coluna(s)');
}
```

```plaintext
393 -> 1 coluna(s)
667 -> 1 coluna(s)
820 -> 2 coluna(s)
852 -> 2 coluna(s)
```

| Largura | Que tela é |
|---|---|
| 393 | um celular comum, em pé |
| 667 | um celular pequeno, deitado |
| 820 | um tablet, em pé |
| 852 | o celular comum, deitado |

Quem decide é a largura, não o aparelho: o mesmo celular tem 393 em pé e 852 deitado.

---

## :icon[notebook-pen] Exercícios: Tela larga

:::example Exercícios
1. Complete para pegar a altura da tela: `const { ___ } = useWindowDimensions();`
2. Num app de receitas, `const fotoGrande = width >= 800;`. Quanto vale num tablet em pé, com 768?
3. O que aparece no terminal?
   ```javascript
   function colunas(width) {
     if (width >= 1000) return 3;
     return width >= 600 ? 2 : 1;
   }
   console.log(colunas(390), colunas(600), colunas(1180));
   ```
4. A equipe queria 2 colunas com 700, e sai 1. Ache o erro: `const colunas = width > 700 ? 2 : 1;`
5. O celular girou. Precisa chamar o `useWindowDimensions` de novo?
:::

:::tip Respostas
1. `height`, o campo da altura
2. `false`: 768 é menor que 800
3. `1 2 3`
4. O `>` deixa o 700 de fora; com `>=`, ele entra
5. Não: a medida muda, e a tela se redesenha sozinha
:::

---

## Duas colunas

Crachá novo, o porteiro acha que é outra pessoa. E se a lista inteira trocar de crachá?

---

## :icon[columns-3] numColumns e a key da lista

A `FlatList` põe os cartões em colunas com **`numColumns`** (número de colunas). Ela tem uma regra: não troca o número de colunas com a lista já montada. A saída é a **`key`**, o crachá do E25, agora na própria `FlatList`: crachá novo, lista nova. Mudou a coluna, o React desmonta a lista e monta outra.

```jsx
<FlatList
  key={colunas}
  numColumns={colunas}
  columnWrapperStyle={colunas === 2 ? estilos.linha : null}
  renderItem={({ item }) => (
    <View style={colunas === 2 ? estilos.metade : null}>
      <CartaoCasa casa={item} onPress={() => router.push('/casa/' + item.id)} />
    </View>
  )}
  // data, keyExtractor e as outras props continuam iguais
/>
```

Sem a `key`, a primeira vez que o celular deita dá tela vermelha: `Changing numColumns on the fly is not supported` ("não dá para trocar o `numColumns` com a lista rodando").

---

## :icon[list-ordered] Duas colunas em português

| Linha | O que ela diz |
|---|---|
| `key={colunas}` | "meu crachá é 1 ou 2": girou, crachá novo, lista nova |
| `numColumns={colunas}` | "ponha os cartões em 1 ou 2 colunas" |
| `columnWrapperStyle` | o estilo de cada linha da grade: o espaço entre os dois cartões; com uma coluna, `null` |
| `<View style={colunas === 2 ? estilos.metade : null}>` | em duas colunas, cada cartão vai numa caixa com metade da linha |
| `metade: { flex: 1, maxWidth: '50%' }` | o `flex: 1` divide a linha; o `maxWidth` segura a casa que fica sozinha |

Com 12 casas, 6 linhas de 2. A busca "campinas" acha 3: a terceira fica sozinha, com metade da largura.

---

## :icon[notebook-pen] Exercícios: Duas colunas

:::example Exercícios
1. Um app de mercado mostra 7 ofertas em 2 colunas. Quantas linhas? Como fica a última?
2. Complete:
   ```jsx
   <FlatList
     key={___}
     numColumns={colunas}
     columnWrapperStyle={colunas === 2 ? estilos.linha : ___}
   />
   ```
3. Com `metade: { flex: 1 }`, a sétima oferta, sozinha na linha, estica até a borda. O que falta?
4. Com 1 coluna, o `renderItem` põe o cartão numa `View` com `style={null}`. Muda alguma coisa na tela?
:::

:::tip Respostas
1. 4 linhas: 3 com 2 ofertas e a última com 1, na metade da largura
2. `colunas` e `null`: mudou a coluna, crachá novo; com uma coluna, nada de estilo de linha
3. `maxWidth: '50%'`: só com o `flex: 1`, ela fica com a linha toda
4. Não: `null` é "nada a mais", e o cartão ocupa a linha inteira, como antes
:::

---

## :icon[milestone] Projeto 6 · Passo 4: duas colunas

:::steps
1. `useWindowDimensions` no import de `react-native`
2. As duas linhas junto dos outros hooks, antes do `if (carregando)`
3. Na `FlatList`, `key`, `numColumns`, `columnWrapperStyle` e o `renderItem` com a `View`
4. No `StyleSheet`, os estilos `linha` e `metade`
5. Deite o celular
:::

```jsx
const { width } = useWindowDimensions();
const colunas = width >= 700 ? 2 : 1;
```

```jsx
<FlatList
  key={colunas}
  numColumns={colunas}
  columnWrapperStyle={colunas === 2 ? estilos.linha : null}
  renderItem={({ item }) => (
    <View style={colunas === 2 ? estilos.metade : null}>
      <CartaoCasa casa={item} onPress={() => router.push('/casa/' + item.id)} />
    </View>
  )}
  // data, keyExtractor e as outras props continuam iguais
/>
```

```javascript
linha: { gap: espaco.md },
metade: { flex: 1, maxWidth: '50%' },
```

**Pronto quando:** em pé, uma coluna; deitado, duas, sem tela vermelha; a busca "campinas" deixa a terceira casa sozinha, sem esticar. Um celular pequeno deitado pode ficar abaixo de 700 e continuar com uma.

---

## :icon[milestone] Projeto 6 · Sua vez: o vazio e os números

Sozinho, na Início:

1. **O vazio com duas mensagens.** Sem busca, a lista vazia diz "Nenhuma casa cadastrada", sem botão. Com busca, continua "Nenhuma casa encontrada", com Limpar busca e o termo: `Nada com "geladeira". Tente outro nome, bairro ou cidade.`
2. **Os números acessíveis.** Cada número é lido de uma vez: "12 casas", "5 cidades", "76 vagas"

:::tip Dicas
- Uma `const vazio` com um ternário pelo `termo` (o texto vazio, `''`, conta como "não") e `ListEmptyComponent={vazio}`
- O `Cartao` aceita `accessible` e `accessibilityLabel`
- Teste com `vazio: true` e volte para `false`
:::

**Pronto quando:** com `vazio: true`, os números 0 e "Nenhuma casa cadastrada"; com o leitor, um toque no 12 lê "12 casas".

---

## :icon[milestone] Projeto 6 · Sua vez: README e prints

Troque o `README.md` do kit pelo seu, no modelo do enunciado:

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

- **Print no celular:** no Android, botão de ligar e diminuir volume juntos; no iPhone, botão lateral e aumentar volume
- Passe as fotos para o computador (cabo, e-mail ou nuvem) e salve na pasta `docs/`, com os nomes do README

**Pronto quando:** <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>V</kbd> no VS Code mostra o README com os quatro prints.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Rendered more hooks than during the previous render` | um hook depois de um `return` | os hooks antes dos `return` |
| `Changing numColumns on the fly is not supported` | a `FlatList` sem `key` | `key={colunas}` |
| `columnWrapperStyle not supported for single column lists` | uma coluna só | `colunas === 2 ? estilos.linha : null` |
| `Property 'Carregando' doesn't exist` | a peça fora do import | no import de `@/components/ui` |
| a tela de erro não sai | `falhas` alto | `falhas: 0` |
| o leitor lê "12" e depois "casas" | `Cartao` sem `accessible` | `accessible` e o rótulo |

---

## :icon[milestone] Projeto 6 · Etapa 7 pronta

É a última etapa. Antes de entregar, confira no celular:

- :icon[hourglass] carregando, erro com Tentar de novo e as duas listas vazias
- :icon[settings] a `simulacao` de volta: `atraso: 800`, `falhas: 0`, `vazio: false`
- :icon[eye-off] o leitor lê cada cartão numa frase e "12 casas" num toque
- :icon[rotate-cw] deitado, duas colunas
- :icon[file-text] o README com os quatro prints

```bash
git add .
git commit -m "Projeto 6: etapa 7, estados, acessibilidade e entrega"
git push
```

No GitHub, confira os prints no README e cada critério da rubrica, na página do projeto. Na plataforma, na página do Projeto 6, cole o link do repositório. **Prazo: início do E41.** O E40 é a revisão e a Prova 4.

---

## Resumo

:::summary
- Uma tela que busca dados tem estados: carregando, erro, vazio e com dados; a `simulacao` do kit provoca cada um
- Carregando e erro saem da função com retorno antecipado; o carregando vem primeiro, e todos os hooks vêm antes do primeiro `return`
- O leitor de tela lê o rótulo (`accessibilityLabel`), o papel (`accessibilityRole`) e a dica (`accessibilityHint`); `accessible` junta um bloco num foco só
- Todo alvo de toque tem pelo menos 44 por 44; `minHeight` deixa o alvo crescer
- `useWindowDimensions` mede a tela; `numColumns` e `key` mudam juntos na `FlatList`
:::

---

## :icon[arrow-right] Próximos passos

No E40, a **revisão de layout** e a **Prova 4**, do E33 ao E39:

- :icon[layout-grid] flexbox, área segura, tokens e tema
- :icon[component] componentes próprios e listas com `FlatList`
- :icon[route] navegação com pilha, abas e rota com parâmetro
- :icon[square-pen] formulários e estados da tela

Traga o Casas de adoção funcionando. A entrega do Projeto 6 vai até o início do E41.
