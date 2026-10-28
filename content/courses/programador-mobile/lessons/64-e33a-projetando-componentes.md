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

## O mesmo botão, seis cópias

Num app de loja sem kit, há botão no cartão do produto, no detalhe, nos destaques, no carrinho, no cadastro e no perfil. Cada tela ganhou sua cópia do `Pressable`: uma com `raio.md`, outra com `raio.sm`, uma sem efeito de toque, outra com o texto em negrito.

Os tokens resolvem as cores. O formato, o toque e o tamanho continuam copiados.

Agora o cliente pede: "todos os botões ganham ícone e ficam mais altos". Você abre seis arquivos e torce para não esquecer nenhum.

:::question
Que mudança no código faria esse pedido acontecer em um lugar só?
:::

---

## :icon[layers] UI kit: as peças do app

Um **UI kit** é o conjunto de componentes visuais genéricos que todas as telas usam. Apps de banco, de delivery e de loja têm um kit interno, às vezes com dezenas de peças.

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

## :icon[target] Uma responsabilidade por componente

Cada peça faz **uma coisa** e não sabe nada sobre a tela onde está. O `Badge` desenha um selo; quem decide se o produto está esgotado é a tela.

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

O `CartaoProduto` continua existindo, mas passa a ser uma **composição** de peças do kit, própria da Lojinha.

Teste rápido: se a peça serviria em outro app sem nenhuma mudança, ela é do kit.

---

## :icon[sliders-horizontal] Props claras e poucas

As props são o painel de controle do componente. Com botões demais no painel, ninguém sabe qual apertar.

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

## :icon[boxes] children: o que vai dentro

O **`children`** do E22 é tudo o que você escreve entre a abertura e o fechamento da tag. Como o `Card` daquela aula, o `Cartao` desenha a moldura e não precisa saber o que vai dentro.

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

Imports de `react-native`, `useTema` e dos tokens omitidos. Dentro do `Cartao` cabe um produto, um endereço ou um formulário.

---

## :icon[combine] style de fora, no fim do array

Às vezes a tela precisa posicionar a peça: uma margem, uma largura. Todo componente do kit aceita `style` e o coloca **por último** no array, porque em conflito o último vence (a regra do array de estilos do E27).

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

## :icon[split] Variantes: o problema dos ifs

O `Badge` mostra "Novo", "Últimas unidades" e "Esgotado", cada um com uma cor. O primeiro impulso é um `if` por caso:

```jsx
let cor = cores.textoSuave;
if (tom === 'sucesso') cor = cores.sucesso;
else if (tom === 'alerta') cor = cores.alerta;
else if (tom === 'perigo') cor = cores.perigo;
```

Funciona, mas cada caso novo pede mais um `else if`, a regra se espalha pelo componente e é fácil esquecer um. Quando chegarem tamanho e estado, os `if` se multiplicam.

Uma **variante** é uma versão nomeada do componente, escolhida por uma prop: `tom="perigo"`, `variante="secundaria"`.

---

## :icon[tag] Mapa de variantes: o Badge

Troque os `if` por um objeto: a chave é o valor da prop; o valor é o que muda. É o dicionário dos `comparadores` do E08, consultado com colchetes.

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

Os quatro tons são os que o `tomDoStatus` do E13 devolve: `tom={tomDoStatus(pedido.status)}` funciona direto. Tom novo é uma linha no mapa. O tema não tinha cor de alerta: acrescente `alerta` em `cores.claro` e `cores.escuro` no `tokens.js`, nunca um hexadecimal no componente.

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

## :icon[corner-down-right] ...rest: repassando props nativas

O `Pressable` aceita dezenas de props: `accessibilityLabel`, `testID`, `onLongPress`, `hitSlop`. Declarar uma a uma no `Botao` não acaba nunca. O **`...rest`** é o rest do E09, que você usou nas props no E22: junta tudo o que o componente não desestruturou, e o spread `{...rest}` repassa ao elemento nativo.

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

O `Botao` desestrutura `titulo` e `onPress` e usa cada um no seu lugar. O que ele não pediu, como o `accessibilityLabel`, sobra no `rest` e chega ao `Pressable` pelo `{...rest}`.

O leitor de tela anuncia "Adicionar ao carrinho", e não "mais".

---

## :icon[user] Avatar: foto ou iniciais

O `Avatar` mostra a foto do cliente. Sem `uri`, mostra as **iniciais** do nome sobre a cor primária, nunca um círculo vazio. A função `iniciais` só usa o que você já conhece: `split` (E06), `filter`, `slice`, `map` e `join` (E08 e E09).

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

- `Image` vem do `expo-image`, como no `CartaoProduto`
- `medidas` é outro mapa de variantes, agora de tamanho
- `estilos.iniciais` centraliza o texto com `alignItems` e `justifyContent: 'center'`

Na tela: `<Avatar nome="Ana Clara" />` desenha um círculo de 48 com "AC".

---

## :icon[triangle-alert] Erros comuns

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
