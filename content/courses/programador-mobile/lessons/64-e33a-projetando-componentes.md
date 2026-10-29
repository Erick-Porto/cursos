---
title: Projetando componentes reutilizáveis
summary: O que é um UI kit e como projetar componentes com children, style externo, variantes e ...rest.
module: layout-rn
duration_minutes: 40
objectives:
  - Identificar os componentes repetidos de um app e dar uma responsabilidade a cada um
  - Projetar props claras com children, style externo e ...rest
  - Implementar variantes com um mapa de estilos em vez de uma fileira de ifs
---

# Projetando componentes reutilizáveis

Programador Mobile · Encontro E33 · Aula 64 de 89

---

## O que você vai aprender

:::goal
- Reconhecer as peças que se repetem em um app e reuni-las em um **UI kit**
- Dar a cada componente uma responsabilidade e poucas props claras
- Receber `children`, `style` de fora e `...rest` sem perder o padrão visual
- Criar variantes com um mapa de estilos, como no `Badge` e no `Avatar`
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **UI kit** | o conjunto de peças visuais que todas as telas do app usam |
| **reutilizável** | feito uma vez e usado em vários lugares, sem copiar |
| **`children`** | o que você escreve entre a abertura e o fechamento da tag de um componente |
| **variante** | uma versão com nome do mesmo componente, como `primaria` e `secundaria` |
| **`...rest`** | o que sobrou das props, repassado inteiro a outro elemento |

---

## O mesmo botão, seis cópias

Num app de loja sem kit, há botão no cartão do produto, no detalhe, nos destaques, no carrinho, no cadastro e no perfil. Cada tela ganhou sua cópia do `Pressable`: uma com `raio.md`, outra com `raio.sm`, uma sem efeito de toque, outra com o texto em negrito.

Os tokens resolvem as cores. O formato, o toque e o tamanho continuam copiados.

Agora o cliente pede: "todos os botões ganham ícone e ficam mais altos". Você abre seis arquivos e torce para não esquecer nenhum.

:::question
Que mudança no código faria esse pedido acontecer em um lugar só?
:::

---

## UI kit

O que dá para montar com uma caixa de Lego?

---

## :icon[layers] UI kit: as peças do app

Um **UI kit** (de *user interface*, interface do usuário) é o conjunto de componentes visuais genéricos que todas as telas usam. Cada componente é uma peça de Lego: pequena, reaproveitável, encaixa em outras. O kit é a caixa de peças do app.

| Peça | Onde aparece na Lojinha |
|---|---|
| `Botao` | Comprar, Adicionar ao carrinho, Ver todos |
| `Cartao` | produto, resumo do pedido, endereço |
| `Badge` | Novo, Esgotado, Últimas unidades |
| `Avatar` | foto ou iniciais no Perfil |
| `Campo` | busca, cadastro, cupom |
| `Divisor` | entre seções e entre itens do carrinho |

Os tokens padronizam cores e medidas; o kit padroniza **peças inteiras**.

---

## Uma responsabilidade

Uma peça de Lego sabe se vai virar casa ou carro?

---

## :icon[target] Uma responsabilidade por componente

Cada peça faz **uma coisa** e não sabe nada sobre a tela onde está. Uma peça de Lego não sabe se vai virar casa ou carro: quem decide é quem monta. O `Badge` desenha um selo; quem decide se o produto está esgotado é a tela.

```jsx
// Faz tudo, e só serve para produto
<CartaoProduto produto={p} mostrarSelo emPromocao corSelo="red" />

// Peças genéricas, combinadas pela tela
<Cartao>
  <Badge texto="Esgotado" tom="perigo" />
  <Text>{p.nome}</Text>
  <Botao titulo="Avise-me" variante="secundaria" />
</Cartao>
```

O `CartaoProduto` continua existindo, mas passa a ser uma **composição**, uma montagem de peças do kit, própria da Lojinha.

Teste rápido: se a peça serviria em outro app sem nenhuma mudança, ela é do kit.

---

## Props claras

No restaurante, você pede o prato do dia ou dita a receita ao cozinheiro?

---

## :icon[sliders-horizontal] Props claras e poucas

As **props** são o pedido feito à peça: quem usa diz como quer cada uma. Pedido bom fala da decisão ("é a ação principal"), não da receita ("fundo verde, letra branca, cantos de 8").

```jsx
// Difícil de usar e fácil de sair do padrão
<Botao texto="Comprar" corFundo="#16a34a" corTexto="#fff"
  raio={8} paddingVertical={12} negrito />

// Poucas props, com nomes de decisão
<Botao titulo="Comprar" variante="primaria" tamanho="lg" />
```

- Cada prop responde a uma pergunta de produto: "esta é a ação principal?", não "qual é o hexadecimal?"
- Valores padrão na desestruturação (E09), como `variante = 'primaria'`, deixam o uso comum curto
- Menos props, menos combinações para testar

---

## children

Uma moldura precisa saber qual quadro vai dentro dela?

---

## :icon[boxes] children: o que vai dentro

O **`children`** do E22 é tudo o que você escreve entre a abertura e o fechamento da tag. Pense numa moldura de quadro: ela é sempre a mesma, e o quadro dentro muda. Como o `Card` daquela aula, o `Cartao` desenha a moldura e não precisa saber o que vai dentro.

```jsx
export default function Cartao({ children, style, ...rest }) {
  const { cores } = useTema();
  return (
    <View
      style={[estilos.cartao, { backgroundColor: cores.superficie, borderColor: cores.borda }, style]}
      {...rest}
    >
      {children}
    </View>
  );
}

const estilos = StyleSheet.create({
  cartao: { padding: espaco.md, borderRadius: raio.md, borderWidth: 1 },
});
```

Imports de `react-native`, `useTema` e dos tokens omitidos. O `{children}` entre as tags da `View` é onde o conteúdo aparece: um produto, um endereço ou um formulário. Na primeira linha, `style` e `...rest` também chegam: com eles, a tela posiciona a peça e passa outras props.

---

## :icon[boxes] children na prática

Três telas, a mesma moldura. Muda só o que vai entre `<Cartao>` e `</Cartao>`:

**1. Resumo do pedido, no carrinho:**

```jsx
<Cartao>
  <Text>Resumo do pedido</Text>
  <Text>2 itens · R$ 259,80</Text>
</Cartao>
```

**2. Endereço, na entrega:**

```jsx
<Cartao>
  <Text>Entregar em</Text>
  <Text>Rua das Flores, 120</Text>
</Cartao>
```

**3. Outras peças do kit dentro, num produto esgotado:**

```jsx
<Cartao>
  <Badge texto="Esgotado" tom="perigo" />
  <Botao titulo="Avise-me" variante="secundaria" />
</Cartao>
```

Na tela: três cartões com a mesma borda, o mesmo fundo e os mesmos cantos.

---

## Style de fora

Quem decide em que parede vai o quadro: a loja da moldura ou você?

---

## :icon[combine] style de fora, no fim do array

O `style` de fora é o prego na parede: a moldura vem pronta do kit, e a tela só escolhe onde pendurar, com uma margem ou uma largura. Todo componente do kit aceita `style` e o coloca **por último** no array, porque em conflito o último vence (a regra do array de estilos do E27).

```jsx
<Cartao style={{ marginBottom: espaco.md }}>
  <Text>Resumo do pedido</Text>
</Cartao>
```

| Posição | Quem define | Exemplo |
|---|---|---|
| 1ª | o estilo base do kit | `padding`, `borderRadius` |
| 2ª | o tema atual | `backgroundColor: cores.superficie` |
| 3ª | quem usa a peça | `marginBottom`, `width`, `flex` |

:::tip
Use o `style` de fora para **posicionar**, não para redesenhar. Se toda tela muda a cor do cartão, falta uma variante.
:::

---

## :icon[combine] style de fora na prática

Nos três casos, a tela só **posiciona** o cartão; a borda, o fundo e os cantos continuam os do kit.

**1. No carrinho, um espaço embaixo de cada cartão:**

```jsx
<Cartao style={{ marginBottom: espaco.md }}>
```

**2. Na Galeria, o cartão ocupa a largura toda:**

```jsx
<Cartao style={{ width: '100%' }}>
```

**3. Dois cartões lado a lado, numa linha com `flexDirection: 'row'`, dividindo o espaço:**

```jsx
<Cartao style={{ flex: 1 }}>
```

Na tela: margem, largura e divisão mudam; a aparência do cartão é a mesma nos três.

---

## Variantes

O copo P, M e G da lanchonete é o mesmo copo?

---

## :icon[split] Variantes: o problema dos ifs

Uma **variante** é uma versão com nome da mesma peça, escolhida por uma prop: `tom="perigo"`, `variante="secundaria"`. Pense no copo P, M e G da lanchonete: o copo é o mesmo, e o nome escolhe a versão.

O `Badge` mostra "Novo", "Últimas unidades" e "Esgotado", cada um com uma cor. O primeiro impulso é um `if` por caso:

```jsx
let cor = cores.textoSuave;
if (tom === 'sucesso') cor = cores.sucesso;
else if (tom === 'alerta') cor = cores.alerta;
else if (tom === 'perigo') cor = cores.perigo;
```

Funciona, mas cada caso novo pede mais um `else if`, a regra se espalha pelo componente e é fácil esquecer um. Quando chegarem tamanho e estado, os `if` se multiplicam.

---

## :icon[tag] Mapa de variantes: o Badge

Troque os `if` por um objeto: a chave é o valor da prop; o valor é o que muda. É o dicionário do E08, como o dos `comparadores`: você procura a palavra (a chave) com colchetes e lê o significado (o valor).

```jsx
const corDoTom = {
  neutro: 'textoSuave', sucesso: 'sucesso', alerta: 'alerta', perigo: 'perigo',
};

export default function Badge({ texto, tom = 'neutro', style, ...rest }) {
  const { cores } = useTema();
  const cor = cores[corDoTom[tom]];
  return (
    <View style={[estilos.badge, { borderColor: cor }, style]} {...rest}>
      <Text style={[estilos.texto, { color: cor }]}>{texto}</Text>
    </View>
  );
}
```

Tom novo é uma linha no mapa. Os quatro tons são os que o `tomDoStatus` do E13 devolve: `tom={tomDoStatus(pedido.status)}` funciona direto. O tema não tinha cor de alerta: acrescente `alerta` em `cores.claro` e `cores.escuro` no `tokens.js`, nunca um hexadecimal no componente.

---

## :icon[list-ordered] O Badge em português

| Linha | O que ela diz |
|---|---|
| `const corDoTom = { ... }` | o mapa: para cada tom, o nome da cor no tema |
| `tom = 'neutro'` | "se a tela não disser o tom, use `neutro`" |
| `corDoTom[tom]` | "procure o tom no mapa": `'perigo'` dá `'perigo'`, e `'neutro'` dá `'textoSuave'` |
| `cores[...]` | "agora procure essa cor nas cores do tema da vez" |
| `borderColor: cor` e `color: cor` | a borda e o texto ganham a cor encontrada |

---

## :icon[tag] Badge na prática

O mesmo `Badge`, quatro selos:

```jsx
<Badge texto="Neutro" />
<Badge texto="Novo" tom="sucesso" />
<Badge texto="Últimas unidades" tom="alerta" />
<Badge texto={textoDoStatus('pendente')} tom={tomDoStatus('pendente')} />
```

- Sem `tom`: cinza, porque o padrão é `neutro`
- `sucesso` sai verde, e `alerta`, âmbar
- O último usa as regras do E13: para um pedido `'pendente'`, `textoDoStatus` devolve `'Aguardando pagamento'`, e `tomDoStatus`, `'alerta'`

Na tela: quatro selos com borda e texto da mesma cor; o último diz "Aguardando pagamento", em âmbar. A regra decide o texto e o tom; o `Badge` só desenha.

---

## Pense

:::question
O `Botao` do E32 tem duas variantes e um tamanho só. Na Lojinha ele aparece como "Comprar agora" no detalhe, "Adicionar ao carrinho" logo ao lado, "Ver todos" acima dos destaques, "Cancelar" no rodapé de um formulário e "Finalizar compra" no carrinho.

Quantas variantes o `Botao` precisa? Que nome você dá a cada uma?
:::

:::tip Resposta
Três, separadas pelo **peso da ação**, não pela cor:

- `primaria`: a ação principal da tela, como "Comprar agora" e "Finalizar compra"; uma por tela
- `secundaria`: a alternativa ao lado, como "Adicionar ao carrinho"
- `fantasma`: a ação discreta, só texto, como "Ver todos" e "Cancelar"
:::

---

## Repassar props

O que o porteiro faz com uma carta que não é para ele?

---

## :icon[corner-down-right] ...rest: repassando props nativas

O **`...rest`** junta as props que o componente não pegou pelo nome e as entrega, inteiras, ao elemento nativo. Pense no porteiro do prédio: a carta com o nome dele, ele abre; as outras, ele entrega ao morador sem abrir.

O `Pressable` aceita dezenas de props: `accessibilityLabel`, `testID`, `onLongPress`, `hitSlop`. Declarar uma a uma no `Botao` não acaba nunca. O `...rest` é o rest do E09, que você usou nas props no E22, e o spread `{...rest}` repassa tudo.

```jsx
export default function Botao({ titulo, onPress, style, ...rest }) {
  return (
    <Pressable onPress={onPress} style={[estilos.botao, style]} {...rest}>
      <Text style={estilos.titulo}>{titulo}</Text>
    </Pressable>
  );
}

// accessibilityLabel não está nas props do Botao, mas chega ao Pressable
<Botao titulo="+" onPress={adicionar} accessibilityLabel="Adicionar ao carrinho" />
```

---

## :icon[corner-down-right] ...rest: o caminho de cada prop

:::center
![Animação: a tela passa titulo, onPress e accessibilityLabel ao Botao; titulo desce para o Text, onPress para o Pressable, e o accessibilityLabel, que o Botao não desestruturou, entra no rest e chega ao Pressable pelo {...rest}](images/e33-rest-repassa-props.svg)
:::

- `{ titulo, onPress, style, ...rest }`: "pegue estas três pelo nome; o resto vai junto em `rest`"
- `{...rest}` no `Pressable`: "espalhe aqui tudo o que está em `rest`"
- O **`accessibilityLabel`** é o texto que o leitor de tela, o recurso que lê a tela em voz alta para quem não enxerga, fala no lugar do botão

O leitor de tela anuncia "Adicionar ao carrinho", e não "mais".

---

## :icon[corner-down-right] ...rest na prática

Nenhuma destas props foi escrita no `Botao` ou no `Cartao`. Todas passam pelo `...rest`:

**1. Segurar o dedo:** o `onLongPress` chega ao `Pressable`.

```jsx
<Botao titulo="Remover" onPress={remover} onLongPress={() => console.log('segurou')} />
```

No terminal, ao segurar o botão: `segurou`.

**2. Um alvo maior:** o `hitSlop` do E32 chega ao `Pressable`.

```jsx
<Botao titulo="Ver todos" variante="fantasma" hitSlop={10} />
```

**3. Um texto para o leitor de tela no cartão:** o `accessibilityLabel` chega à `View` do `Cartao`.

```jsx
<Cartao accessibilityLabel="Resumo do pedido: 2 itens, 259 reais e 80 centavos">
```

---

## O Avatar

O que aparece no contato que não tem foto no seu celular?

---

## :icon[user] Avatar: foto ou iniciais

O **`Avatar`** é a peça que mostra a foto do cliente, num círculo. Sem `uri`, mostra as **iniciais** do nome sobre a cor primária, nunca um círculo vazio. A função `iniciais` só usa o que você já conhece: `split` (E06), `filter`, `slice`, `map` e `join` (E08 e E09).

```javascript
function iniciais(nome = '') {
  return nome
    .split(' ')
    .filter(Boolean) // ignora espaços duplos
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join('');
}

iniciais('Ana Clara Souza'); // 'AC'
iniciais('joão'); // 'J'
```

| Prop | Valores | Padrão |
|---|---|---|
| `uri` | endereço da foto | sem foto |
| `nome` | nome do cliente | `''` |
| `tamanho` | `'sm'`, `'md'`, `'lg'` | `'md'` |

---

## :icon[list-ordered] As iniciais, passo a passo

Com `'Ana Clara Souza'`, cada linha recebe o resultado da anterior:

| Linha | O que ela diz | Resultado |
|---|---|---|
| `.split(' ')` | "corte o texto nos espaços" | `['Ana', 'Clara', 'Souza']` |
| `.filter(Boolean)` | "tire os pedaços vazios", que aparecem com espaço duplo | `['Ana', 'Clara', 'Souza']` |
| `.slice(0, 2)` | "fique com os dois primeiros" | `['Ana', 'Clara']` |
| `.map(...)` | "de cada um, a primeira letra, em maiúscula" | `['A', 'C']` |
| `.join('')` | "junte tudo, sem nada entre as letras" | `'AC'` |

Com `'Ana  Clara'`, dois espaços, o `split` faz `['Ana', '', 'Clara']`, e o `filter` tira o `''`.

---

## :icon[user] Avatar: o componente

```jsx
const medidas = { sm: 32, md: 48, lg: 72 };

export default function Avatar({ uri, nome = '', tamanho = 'md', style, ...rest }) {
  const { cores } = useTema();
  const lado = medidas[tamanho];
  const forma = { width: lado, height: lado, borderRadius: lado / 2 };
  if (uri) {
    return <Image source={{ uri }} style={[forma, style]} contentFit="cover" accessibilityLabel={nome} {...rest} />;
  }
  return (
    <View style={[estilos.iniciais, forma, { backgroundColor: cores.primaria }, style]} {...rest}>
      <Text style={[estilos.texto, { color: cores.fundo, fontSize: lado * 0.4 }]}>{iniciais(nome)}</Text>
    </View>
  );
}
```

- `medidas` é outro mapa de variantes, agora de tamanho
- `borderRadius: lado / 2`: cantos com metade do lado viram um círculo
- `if (uri)`: com foto, devolve a `Image`, que vem do `expo-image`, como no `CartaoProduto`; sem foto, o segundo `return` desenha as iniciais
- `estilos.iniciais` centraliza o texto com `alignItems` e `justifyContent: 'center'`

Na tela: `<Avatar nome="Ana Clara" />` desenha um círculo de 48 com "AC".

---

## :icon[user] Avatar na prática

Os três tamanhos, com e sem foto:

```jsx
<Avatar nome="Ana Clara" tamanho="sm" />
<Avatar nome="Bruno Lima" />
<Avatar nome="Carla Dias" tamanho="lg" uri="https://picsum.photos/seed/carla/400/400" />
```

| Linha | Na tela |
|---|---|
| `nome="Ana Clara" tamanho="sm"` | círculo de 32 com "AC" |
| `nome="Bruno Lima"` | círculo de 48 com "BL": `md` é o padrão |
| `tamanho="lg"` com `uri` | a foto da Carla, redonda, com 72 |

Sem `uri`, as iniciais aparecem sobre a cor primária, nos dois temas.

---

## :icon[triangle-alert] Erros comuns

Nenhum destes mostra mensagem: o app roda, mas sai do padrão.

:::warning
- Esquecer `{...rest}` no JSX: o `accessibilityLabel` que a tela passou some sem nenhum aviso
- Pôr o `style` de fora no começo do array: o estilo base vence e a margem pedida pela tela é ignorada
- Escrever cor fixa no componente, como `color: '#000'`: no tema escuro o texto some no fundo
- Nomear a variante pela aparência, como `variante="verde"`: quando a marca mudar de cor, o nome vira mentira
- Redesenhar a peça com `style` em cada tela: o kit deixa de ser padrão
:::

---

## Resumo

:::summary
- Um UI kit reúne as peças visuais genéricas que todas as telas usam
- Cada componente tem uma responsabilidade e poucas props, com nomes de decisão e valores padrão
- `children` recebe o conteúdo; o `style` de fora vai por último no array; `...rest` repassa props nativas
- Variantes saem de um mapa indexado pela prop, não de uma fileira de `if`
- Sem foto, o `Avatar` mostra as iniciais do nome
:::

---

## :icon[arrow-right] Próximos passos

Você tem as peças soltas: `Cartao`, `Badge`, `Avatar` e um `Botao` que pede três variantes.

Na aula 65, o kit fica completo:

- :icon[component] `Cartao.Cabecalho` e `Cartao.Corpo`, um componente composto
- :icon[arrow-up-down] tamanhos `sm`, `md` e `lg` tirados dos tokens
- :icon[folder-tree] a pasta `src/components/ui/` com um arquivo índice
- :icon[book-open] a tela `Galeria`, que mostra o kit inteiro nos dois temas
