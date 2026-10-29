---
title: Acessibilidade em React Native
summary: Leitor de tela, rótulos, papéis, estados, área de toque e contraste para todo mundo conseguir comprar na Lojinha.
module: layout-rn
duration_minutes: 40
objectives:
  - Descrever elementos para o leitor de tela com rótulo, papel, estado e dica
  - Garantir área de toque e contraste mínimos nos componentes e nos tokens
  - Auditar telas com TalkBack ou VoiceOver seguindo um checklist
---

# Acessibilidade em React Native

Programador Mobile · Encontro E38 · Aula 75 de 89

---

## O que você vai aprender

:::goal
- Ligar, usar e desligar o TalkBack e o VoiceOver sem se perder
- Dar rótulo, papel, estado e dica aos elementos com as props `accessibility...`
- Cuidar de imagens, área de toque e contraste na Lojinha
- Auditar uma tela com um checklist de 7 itens
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **acessibilidade** | fazer o app funcionar para todo mundo, inclusive para quem tem alguma deficiência |
| **leitor de tela** | o programa do celular que fala em voz alta o que está na tela |
| **foco** | o elemento que o leitor de tela está lendo agora, marcado com um contorno |
| **rótulo** (*label*) | o nome que o leitor fala para um elemento |
| **área de toque** | o pedaço da tela que responde ao dedo |
| **contraste** | a diferença de claridade entre o texto e o fundo |

---

## Por que isso importa

Marta é cega e usa o celular todo dia com o leitor de tela. No app do banco, ela abre a tela do Pix e ouve: "botão", "botão", "imagem", "botão". Qual deles confirma o pagamento?

Ela desiste e entrega o celular desbloqueado a um vizinho.

O app funcionava. Só não para ela. Quase 19 milhões de brasileiros têm alguma deficiência (IBGE, 2022).

:::question
Se a Marta abrir a Lojinha hoje, o que ela vai ouvir no botão de filtros do Início?
:::

---

## Acessibilidade

Para quem foi feita a rampa ao lado da escada? Quem mais usa?

---

## :icon[users] Quem usa o seu app

**Acessibilidade** é fazer o app funcionar para todo mundo. Pense na rampa ao lado da escada: foi feita para a cadeira de rodas e ajuda também quem empurra carrinho de bebê ou puxa uma mala.

- **Cegueira**: usa o **leitor de tela**, que fala o que está sob o dedo
- **Baixa visão**: letra grande, zoom e cores com bom contraste
- **Daltonismo**: cerca de 8 em cada 100 homens confundem cores, quase sempre vermelho e verde
- **Deficiência motora**: tremor ou pouca força nos dedos; alvo pequeno vira toque errado
- **Pessoas idosas**: letra grande, toque menos preciso e pouca intimidade com gestos
- **Situações temporárias**: braço engessado, sol forte na tela, uma mão na barra do ônibus

---

## :icon[users] Acessibilidade na prática

Quatro pessoas, a mesma Lojinha. Uma linha de código muda o dia de cada uma.

| Quem | No código | O que muda |
|---|---|---|
| Marta, cega | `accessibilityLabel="Abrir filtros"` | o leitor fala "Abrir filtros, botão", não só "botão" |
| Seu João, com tremor nas mãos | `hitSlop={12}` na lixeira | o ícone de 20 vira um alvo de 44 por 44 |
| Rafael, daltônico | `<Badge texto="Esgotado" />` | a palavra diz o que o vermelho sozinho não diria |
| Dona Lúcia, com a letra no máximo | `minHeight` no cartão | o preço aparece, em vez de sumir |

Como a rampa, cada linha ajuda também quem não precisa dela: todo mundo acerta melhor um alvo maior.

---

## Leitor de tela

Como alguém acompanha um jogo de futebol pelo rádio, sem ver nada?

---

## :icon[eye-off] Leitor de tela: um narrador

O **leitor de tela** é um programa do celular que fala em voz alta o que está na tela. Funciona como o narrador de futebol no rádio: descreve o jogo para quem não está vendo.

- No Android, ele se chama **TalkBack**; no iPhone, **VoiceOver**. Os dois ficam nas configurações, em Acessibilidade
- Com ele ligado, um contorno marca o elemento **em foco**: o que está sendo lido agora
- Você navega por gestos: um toque ouve o item; deslizar o dedo vai ao próximo

Exemplo: no cartão do fone, o leitor fala "Fone Bluetooth, R$ 199,90, botão". O que ele fala, você escreve no código.

---

## :icon[hand] Os gestos do leitor de tela

Com o leitor ligado, os gestos mudam: um toque só ouve; para ativar, são dois.

| Ação | TalkBack (Android) | VoiceOver (iOS) |
|---|---|---|
| Atalho | 2 teclas de volume por 3 segundos | 3 cliques no botão lateral |
| Ouvir um item | tocar uma vez | tocar uma vez |
| Ativar o item | tocar duas vezes | tocar duas vezes |
| Próximo item | deslizar 1 dedo para o lado | deslizar 1 dedo para o lado |
| Rolar | deslizar 2 dedos | deslizar 3 dedos |

:::warning
Configure o atalho **antes** de ligar: ele é a sua saída de emergência. No iPhone, a Siri também desliga: "Desativar VoiceOver".
:::

---

## :icon[eye-off] Leitor de tela na prática

:::center
![Animação: o foco do leitor de tela passa pelo título Destaques, pelo botão Abrir filtros e pelo cartão do Fone Bluetooth, e o leitor fala o rótulo e o papel de cada um](images/e38-foco-do-leitor.svg)
:::

Cada deslizar de um dedo para o lado leva o foco ao próximo elemento, na ordem da tela:

| Foco em | O leitor fala |
|---|---|
| o título da seção | "Destaques, título" |
| o botão do topo | "Abrir filtros, botão" |
| o primeiro cartão | "Fone Bluetooth, R$ 199,90, avaliação 4,6 de 5, botão" |

O cartão inteiro é um foco só: nome, preço e nota chegam numa frase. É assim que o Início vai soar ao fim desta aula.

---

## O que o leitor fala

Como você descreveria um botão, por telefone, a quem não vê a tela?

---

## :icon[message-square] O que o leitor de tela fala

O leitor só fala o que você escreve para ele: as props `accessibility...` são o roteiro do narrador. Para cada elemento, ele monta uma frase com até quatro partes:

| Prop | Responde | Exemplo falado |
|---|---|---|
| `accessibilityLabel` (**rótulo**) | o que é? | "Finalizar compra" |
| `accessibilityRole` (**papel**) | que tipo de coisa? | "botão" |
| `accessibilityState` (**estado**) | como está agora? | "desativado" |
| `accessibilityHint` (**dica**) | o que acontece? | "Conclui o pedido" |

Juntas, elas viram: "Finalizar compra, botão, desativado. Conclui o pedido."

O leitor fala na língua do aparelho: você escreve `button`, e ele diz "botão".

---

## :icon[message-square] O que o leitor fala na prática

Três elementos da Lojinha, as props de cada um e a frase que sai:

| Elemento | Props | O leitor fala |
|---|---|---|
| Botão de filtros, só com ícone | `accessibilityRole="button"` e `accessibilityLabel="Abrir filtros"` | "Abrir filtros, botão" |
| Título da seção | `accessibilityRole="header"` | "Destaques, título" |
| Finalizar, com o carrinho vazio | `accessibilityState={{ disabled: true }}` e `accessibilityHint="Conclui o pedido"` | "Finalizar compra, botão, desativado. Conclui o pedido" |

O texto visível, como "Destaques" e "Finalizar compra", já serve de rótulo. O botão de filtros não tem texto, então precisa do `accessibilityLabel`.

---

## :icon[tag] Papel: que tipo de coisa é

O **papel** (`accessibilityRole`) diz que tipo de elemento é aquele. O leitor o anuncia depois do rótulo. Os mais usados:

- `button`: algo tocável que executa uma ação
- `header`: título de seção; quem usa leitor de tela pula de título em título
- `image`: imagem que informa
- `link`: abre um endereço, como um site ou um e-mail

```jsx
<Text accessibilityRole="header" style={secao}>Destaques</Text>
```

O leitor fala "Destaques, título". No Projeto 6, o nome de cada cidade ganha o mesmo papel.

---

## :icon[tag] Rótulo: o nome do elemento

O botão de filtros do Início é só um ícone. Sem rótulo, o leitor não tem o que falar; sem papel, não diz que é um botão.

```jsx
<Link href="/filtros" asChild>
  <Pressable
    style={estilos.botaoTopo}
    accessibilityRole="button"
    accessibilityLabel="Abrir filtros"
  >
    <Ionicons name="options-outline" size={22} color={cores.texto} />
  </Pressable>
</Link>
```

- Curto e no idioma do app: "Abrir filtros"
- Não ponha o papel no rótulo: "Botão filtros" vira "Botão filtros, botão"
- Específico fora de contexto: "Remover Fone Bluetooth", não só "Remover"
- Se o texto visível já explica, ele é o rótulo: não repita

:::info
Você também vai encontrar `aria-label` e `role`: são nomes novos para as mesmas props. Nesta unidade, usamos os `accessibility...`.
:::

---

## :icon[square-check] Estado e dica

O **estado** (`accessibilityState`) diz como o elemento está agora: `selected` (filtro ou aba escolhidos), `disabled` (ainda não funciona), `checked` (caixa marcada). A **dica** (`accessibilityHint`) diz o resultado, quando ele não é óbvio.

```jsx
const vazio = itens.length === 0;

<Pressable
  onPress={finalizar}
  disabled={vazio}
  accessibilityRole="button"
  accessibilityState={{ disabled: vazio }}
  accessibilityHint="Conclui o pedido e esvazia o carrinho"
>
  <Text>Finalizar compra</Text>
</Pressable>
```

- `vazio` é `true` quando o carrinho não tem itens
- `disabled={vazio}` desliga o toque; `accessibilityState={{ disabled: vazio }}` conta isso ao leitor
- O rótulo é o próprio texto do botão, "Finalizar compra"

Com o carrinho vazio, o leitor anuncia algo como "Finalizar compra, botão, desativado". A dica começa com verbo, não repete o rótulo e pode ser desligada pelo usuário: nada essencial mora só nela.

---

## Pratique

:::example Desafio
No modal de filtros do E37, cada categoria é um `Botao` pequeno: `primaria` quando escolhida, `secundaria` quando não. O TalkBack fala todos do mesmo jeito: "Áudio, botão". O que falta para ele dizer "Áudio, botão, selecionado"?

```jsx
<Botao key={c.slug} titulo={c.nome} tamanho="sm"
  variante={categoria === c.slug ? 'primaria' : 'secundaria'}
  onPress={() => setCategoria(c.slug)} />
```
:::

:::tip Resposta
```jsx
  accessibilityState={{ selected: categoria === c.slug }}
```

O `Botao` repassa o `...rest` ao `Pressable`, então a prop chega lá. Na tela, preenchido e contornado já se distinguem sem depender do roxo; quem não vê a tela precisa do estado.
:::

---

## Imagens e grupos

O narrador de rádio conta a cor da grama?

---

## :icon[image] Imagens decorativas e informativas

O narrador de rádio conta o placar, não a cor da grama. O leitor de tela faz o mesmo com as imagens:

- **Informativa**: traz uma informação que não está escrita em outro lugar, como as estrelas da avaliação
- **Decorativa**: só enfeita, ou repete o que o texto já diz, como a foto no cartão, cujo nome já está no rótulo

| | Decorativa | Informativa |
|---|---|---|
| Leitor de tela | ignora | lê um rótulo com a informação |
| Como fazer | nada: `Image` nasce com `accessible` desligado | `accessible` e `accessibilityLabel` |

Na dúvida, pergunte: se a imagem sumir, a pessoa perde alguma informação? Se sim, ela é informativa.

---

## :icon[combine] accessible: vários em um foco só

**`accessible`** junta uma `View` e todos os filhos dela em um foco só, lido numa frase. Se o Detalhe mostrar a avaliação em estrelas, os cinco ícones viram uma imagem só:

```jsx
<View
  accessible
  accessibilityRole="image"
  accessibilityLabel={`Avaliação ${nota} de 5`}
  style={estilos.estrelas}
>
  {[1, 2, 3, 4, 5].map((n) => (
    <Ionicons key={n} name={n <= Math.round(produto.avaliacao) ? 'star' : 'star-outline'} size={16} />
  ))}
</View>
```

- Sem o `accessible`, o leitor passaria por cinco ícones mudos
- O `map` desenha 5 estrelas: cheia até a nota arredondada, vazia depois
- Com `nota = produto.avaliacao.toLocaleString('pt-BR')`, o leitor diz "quatro vírgula seis", não "quatro ponto seis"

---

## :icon[combine] Exemplo: CartaoProduto acessível

```jsx
export default function CartaoProduto({ produto, onPress }) {
  const { cores } = useTema();
  const preco = formatarPreco(produto.preco);
  const nota = produto.avaliacao.toLocaleString('pt-BR');
  return (
    <Pressable onPress={onPress} style={[estilos.cartao, { backgroundColor: cores.superficie }]}
      accessibilityRole="button"
      accessibilityLabel={`${produto.nome}, ${preco}, avaliação ${nota} de 5`}
      accessibilityHint="Abre os detalhes do produto">
      <Image source={produto.imagem} style={estilos.imagem} contentFit="cover" />
      <Text style={[estilos.nome, { color: cores.texto }]}>{produto.nome}</Text>
      <Text style={[estilos.preco, { color: cores.primaria }]}>{preco}</Text>
    </Pressable>
  );
}
```

`Pressable` já nasce com `accessible`: o leitor foca o cartão inteiro e fala o rótulo no lugar dos filhos, então tudo o que importa entra nele. O rótulo é uma template string, a do E05: os `${}` trocam cada nome pelo valor. A foto, decorativa, fica em silêncio.

- Antes: "Fone Bluetooth, R$ 199,90", sem dizer que dá para tocar
- Depois: "Fone Bluetooth, R$ 199,90, avaliação 4,6 de 5, botão"

---

## :icon[heart] Exemplo: o coração de favoritos

O `CartaoProduto` ganha as props `favorito` e `onFavoritar`. O coração fica **fora** do `Pressable` do cartão, por cima da foto: assim cada um tem o próprio foco no leitor de tela.

```jsx
<View>
  <Pressable /* o cartão acessível, sem mudança */ />
  <Pressable
    onPress={onFavoritar}
    style={[estilos.coracao, { backgroundColor: cores.superficie }]} // 44 por 44
    accessibilityRole="button"
    accessibilityLabel={'Favoritar ' + produto.nome}
    accessibilityState={{ selected: favorito }}
  >
    <Ionicons name={favorito ? 'heart' : 'heart-outline'} size={22} color={cores.primaria} />
  </Pressable>
</View>
```

- O rótulo não muda; o estado diz se está marcado: "Favoritar Fone Bluetooth, botão, selecionado"
- No Início, um `Set` em `useState(new Set())`: `ehFavorito` responde e `alternarFavorito` troca, as regras do E12
- Na grade, `extraData={favoritos}`: sem ele, a `FlatList` não redesenha os cartões

---

## Área de toque

Por que o interruptor de tecla larga é mais fácil de acertar no escuro?

---

## :icon[hand] Área de toque: 44 por 44

A **área de toque** é o pedaço da tela que responde ao dedo. Dedo não é cursor: alvo pequeno vira toque errado, principalmente para quem tem tremor. O mínimo é **44 por 44** (o Android recomenda 48).

- `minWidth` e `minHeight` no estilo: o alvo cresce e aparece maior
- **`hitSlop`** (*folga do toque*): a área cresce para fora, sem mudar o desenho. É o interruptor de tecla larga: acende mesmo com toque torto

```jsx
// lixeira de cada item do carrinho
<Pressable
  onPress={() => remover(item.id)}
  hitSlop={12} // ícone de 20 + 12 de cada lado = 44
  accessibilityRole="button"
  accessibilityLabel={'Remover ' + item.nome + ' do carrinho'}
>
  <Ionicons name="trash-outline" size={20} color={cores.perigo} />
</Pressable>
```

O `hitSlop` não passa da borda do pai e não deve invadir o vizinho: deixe 8 de espaço entre eles.

---

## :icon[hand] Área de toque na prática

Quanto de folga cada alvo precisa? O que falta para 44, dividido pelos dois lados:

```javascript
function folga(tamanho) {
  return Math.max(0, (44 - tamanho) / 2);
}
console.log(folga(20)); // 12: a lixeira do carrinho
console.log(folga(24)); // 10: um ícone de 24
console.log(folga(36)); // 4: o Botao tamanho sm
console.log(folga(56)); // 0: o Botao lg já passa de 44
```

- `(44 - 20) / 2`: faltam 24 para 44; metade vai para cada lado
- `Math.max(0, ...)` devolve o maior dos dois números: se a conta der negativa, como no `lg` (-6), fica 0

---

## :icon[mouse-pointer-click] Exemplo: Botao acessível

O `Botao` do E33 já tem `accessibilityRole="button"`. Faltam o estado e os 44 do tamanho `sm`, que tem 36 de altura:

```jsx
export default function Botao({ titulo, onPress, variante = 'primaria', tamanho = 'md',
  icone, desabilitado = false, accessibilityState, style, ...rest }) {
  const { cores } = useTema();
  const v = variantes(cores)[variante];
  const t = tamanhos[tamanho];
  const folga = Math.max(0, (44 - t.altura) / 2); // novo: no sm, 4 de cada lado
  return (
    <Pressable onPress={onPress} disabled={desabilitado} accessibilityRole="button"
      accessibilityState={{ ...accessibilityState, disabled: desabilitado }} // novo
      hitSlop={folga} // novo
      style={({ pressed }) => [estilos.base, /* demais estilos do E33 */ style]} {...rest}>
      {/* ícone e título como no E33 */}
    </Pressable>
  );
}
```

- `folga`: a mesma conta, com a altura do tamanho escolhido
- `accessibilityState` sai do `...rest` para ser combinado: o `selected` dos filtros e o `disabled` valem juntos
- Botão só com ícone recebe o rótulo por fora: `<Botao icone="trash-outline" accessibilityLabel="Remover Fone Bluetooth" />`

---

## Contraste

Por que a placa de trânsito é branca no azul, e não cinza no branco?

---

## :icon[sun] Contraste: a placa de trânsito

**Contraste** é a diferença de claridade entre o texto e o fundo. Pense numa placa de trânsito: letra branca no fundo azul, para ler de longe, com sol ou com chuva. Cinza-claro no branco seria uma placa que ninguém lê.

O contraste se mede como uma razão: 1 para 1 é invisível; 21 para 1 é preto no branco. A WCAG, referência internacional de acessibilidade digital, pede no nível AA:

| O quê | Mínimo |
|---|---|
| Texto normal | 4,5 para 1 |
| Texto grande, ícones e bordas de controles | 3 para 1 |

Para medir, cole as duas cores num verificador de contraste, como o WebAIM Contrast Checker.

---

## :icon[sun] Contraste na prática

Os tokens da Lojinha sobre `superficie`, medidos no verificador:

| Par | Claro | Escuro |
|---|---|---|
| `textoSuave` | 7,58 | 5,71 |
| `primaria` | 7,10 | 5,38 |
| `alerta`, se for `#f59e0b` | 2,15 | 6,81 |
| `borda` do `Campo` | 1,23 | 1,41 |

- No claro, escureça o `alerta` para `#b45309` (5,02)
- A borda do cartão é enfeite; a do `Campo` mostra onde digitar: use `textoSuave` nela

Cor nunca é o único sinal: o erro do `Campo` vem escrito e o `Badge` tem `texto`, não só `tom`.

---

## Auditoria

O que o mecânico faz numa vistoria?

---

## :icon[list-checks] Checklist de auditoria

**Auditar** é conferir a tela item por item, com a lista na mão, como na vistoria de um carro. Ligue o leitor de tela, abra uma tela e confira:

1. **Nome**: todo elemento tocável tem rótulo que faz sentido sozinho
2. **Papel e estado**: botões dizem "botão", títulos dizem "título", filtros dizem "selecionado"
3. **Ordem e grupos**: a leitura segue a tela, e cada cartão é um foco só
4. **Imagens**: as informativas são descritas e as decorativas ficam em silêncio
5. **Toque**: todo alvo tem pelo menos 44 por 44
6. **Cor**: texto com contraste de 4,5 para 1 e nada dito só por cor
7. **Fonte**: no tamanho máximo, nada cortado nem sobreposto

Para cada falha, anote **tela, problema e correção**.

---

## :icon[list-checks] Auditoria na prática

Uma dupla auditou a Lojinha com o TalkBack. Parte do que foi para o `README.md`:

| Tela | Problema | Correção |
|---|---|---|
| Início | botão de filtros sem papel: não diz que é botão | `accessibilityRole="button"` |
| Carrinho | "Remover" igual em todos os itens; alvo menor que 44 | rótulo "Remover Fone Bluetooth do carrinho" e `hitSlop={12}` |
| Filtros | categoria escolhida anunciada igual às outras | `accessibilityState={{ selected }}` em cada `Botao` |
| Todas | `alerta` com contraste de 2,15 no tema claro | token trocado por `#b45309` (5,02) |

Cada linha nasce de um item do checklist: nome, toque, estado e cor.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Papel dentro do rótulo: `accessibilityLabel="Botão comprar"` vira "Botão comprar, botão"
- Botão dentro de um cartão agrupado, como um coração dentro do `Pressable` do cartão: no iPhone, o VoiceOver não chega até ele
- Rótulo genérico: "Remover" em todos os itens do carrinho, sem dizer qual
- `hitSlop` maior que o espaço até o vizinho: o toque cai no botão errado
- `favoritos.has is not a function`: o `favoritos.js` é o do E08, com array; use o do E12, com `Set`
- Testar só com os olhos: a maioria dos problemas só aparece com o leitor de tela ligado
:::

---

## Resumo

:::summary
- O leitor de tela fala rótulo, papel, estado e dica, que vêm das props `accessibility...`
- Botão só com ícone precisa de `accessibilityLabel`; o papel nunca entra no rótulo, e o que liga e desliga, como o coração, vai no estado
- `accessible` junta um cartão ou um grupo de ícones em um só foco
- Todo alvo tem pelo menos 44 por 44, com `minHeight` ou `hitSlop`
- Texto com contraste de 4,5 para 1 nos tokens, e cor nunca é o único sinal
:::

---

## :icon[flask-conical] No laboratório

Deixe Início, Detalhe e Carrinho responsivos e acessíveis.

:::steps
1. `Inicio.js`: 2 colunas, ou 3 a partir de 600 de largura, com a `key` junto
2. Gire o celular e ponha a fonte no máximo: corrija o que quebrar
3. `Botao`, `CartaoProduto` e o coração de favoritos com rótulo, papel, estado e alvo de 44 por 44
4. Em dupla, audite as três telas com o leitor de tela, pelo checklist
5. Corrija 5 problemas ou mais e registre no `README.md`, em "E38: acessibilidade"
6. Commit "E38: responsividade e acessibilidade" e `git push`
:::

**Critérios**: 2 colunas em pé e 3 deitado, sem tela vermelha; nada cortado com fonte máxima; coração com foco próprio e "selecionado"; 5 correções no README; link do repositório entregue.

---

## :icon[milestone] Projeto 6 · Etapa 9: responsividade e acessibilidade

No seu repositório `casas-de-adocao`:

- `useWindowDimensions`: a partir de 600 de largura, o Detalhe põe a foto ao lado das informações, e as listas ganham largura máxima, centralizadas
- celular deitado, tablet e fonte no máximo sem nada cortado
- `CartaoCasa` como um foco só: nome, cidade e vagas no rótulo, papel `button` e dica; favoritar com o estado `selected`
- vagas escritas no `Badge`, não só na cor; cidades com papel `header`; alvos de 44 por 44
- auditoria com TalkBack ou VoiceOver e a tabela "Acessibilidade" no README, com 3 correções

Commit: `Projeto 6: etapa 9, responsividade e acessibilidade`. Enunciado completo e entrega: página do curso, em **Projetos**.
