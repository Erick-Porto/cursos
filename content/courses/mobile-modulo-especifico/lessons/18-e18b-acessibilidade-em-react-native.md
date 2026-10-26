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

Programador Mobile: Módulo Específico · Encontro E18 · Aula 18 de 71

---

## O que você vai aprender

:::goal
- Ligar, usar e desligar o TalkBack e o VoiceOver sem se perder
- Dar rótulo, papel, estado e dica aos elementos com as props `accessibility...`
- Cuidar de imagens, área de toque e contraste na Lojinha
- Auditar uma tela com um checklist de 7 itens
:::

---

## Por que isso importa

Marta é cega e usa o celular todo dia com o leitor de tela. No app do banco, ela abre a tela do Pix e ouve: "botão", "botão", "imagem", "botão". Qual deles confirma o pagamento?

Ela desiste e entrega o celular desbloqueado a um vizinho.

O app funcionava. Só não para ela. Quase 19 milhões de brasileiros têm alguma deficiência (IBGE, 2022).

:::question
Se a Marta abrir a Lojinha hoje, o que ela vai ouvir no botão de filtros do Início?
:::

---

## :icon[users] Quem usa o seu app

- **Cegueira**: usa o **leitor de tela**, que fala o que está sob o dedo
- **Baixa visão**: letra grande, zoom e cores com bom contraste
- **Daltonismo**: cerca de 8 em cada 100 homens confundem cores, quase sempre vermelho e verde
- **Deficiência motora**: tremor ou pouca força nos dedos; alvo pequeno vira toque errado
- **Pessoas idosas**: costumam somar letra grande, toque menos preciso e pouca intimidade com gestos
- **Situações temporárias**: braço engessado, sol forte na tela, uma mão segurando a barra do ônibus

Acessibilidade é projetar para essas pessoas. De quebra, o app fica melhor para todo mundo.

---

## :icon[eye-off] TalkBack e VoiceOver

O **leitor de tela** fala o elemento em foco; você navega por gestos. Os dois ficam em Acessibilidade.

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

## :icon[eye-off] O foco anda pela tela

:::center
![Animação: o foco do leitor de tela passa pelo título Destaques, pelo botão Abrir filtros e pelo cartão do Fone Bluetooth, e o leitor fala o rótulo e o papel de cada um](images/e18-foco-do-leitor.svg)
:::

Com o leitor ligado, um contorno marca o elemento **em foco**. Cada deslizar de um dedo para o lado leva o foco ao próximo, na ordem da tela, e o leitor fala o que encontrou. O cartão inteiro é um foco só.

É assim que o Início da Lojinha vai soar ao fim desta aula.

---

## :icon[message-square] O que o leitor de tela fala

Para cada elemento, o leitor monta uma frase com até quatro partes. Cada parte vem de uma prop:

| Prop | Responde | Exemplo falado |
|---|---|---|
| `accessibilityLabel` | o que é? | "Finalizar compra" |
| `accessibilityRole` | que tipo de coisa? | "botão" |
| `accessibilityState` | como está agora? | "desativado" |
| `accessibilityHint` | o que acontece? | "Conclui o pedido" |

Papéis mais usados em `accessibilityRole`:

- `button`: algo tocável que executa uma ação
- `header`: título de seção; o usuário pula de título em título
- `image`: imagem que informa
- `link`: abre um endereço, como um site ou um e-mail

O leitor fala na língua do aparelho: `button` vira "botão".

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
- Sem o papel: "Botão filtros" vira "Botão filtros, botão"
- Específico fora de contexto: "Remover Fone Bluetooth", não só "Remover"
- Se o texto visível já explica, ele é o rótulo: não repita

:::info
Você também vai encontrar `aria-label` e `role`: são nomes novos para as mesmas props. Nesta unidade, usamos os `accessibility...`.
:::

---

## :icon[square-check] Estado e dica

**`accessibilityState`** diz como o elemento está: `selected` (filtro ou aba escolhidos), `disabled` (ainda não funciona), `checked` (caixa marcada). **`accessibilityHint`** diz o resultado, quando ele não é óbvio.

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

Com o carrinho vazio, o leitor anuncia algo como "Finalizar compra, botão, desativado".

A dica começa com verbo, não repete o rótulo e pode ser desligada pelo usuário: nada essencial mora só nela.

---

## Pratique

:::example Desafio
No modal de filtros do E17, cada categoria é um `Botao` pequeno: `primaria` quando escolhida, `secundaria` quando não. O TalkBack fala todos do mesmo jeito: "Áudio, botão". O que falta para ele dizer "Áudio, botão, selecionado"?

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

## :icon[image] Imagens decorativas e informativas

| | Decorativa | Informativa |
|---|---|---|
| Exemplo | foto no cartão, cujo nome já está no rótulo | estrelas da avaliação |
| Leitor de tela | ignora | lê um rótulo com a informação |
| Como fazer | nada: `Image` nasce com `accessible` desligado | `accessible` e `accessibilityLabel` |

Se o Detalhe mostrar a avaliação em estrelas, os cinco ícones viram uma imagem só:

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

**`accessible`** junta a `View` e os filhos em um só foco. Com `nota = produto.avaliacao.toLocaleString('pt-BR')`, o leitor diz "quatro vírgula seis", não "quatro ponto seis".

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

`Pressable` já nasce com `accessible`: o leitor foca o cartão inteiro e fala o rótulo no lugar dos filhos, então tudo o que importa entra nele. A foto, decorativa, fica em silêncio.

- Antes: "Fone Bluetooth, R$ 199,90", sem dizer que dá para tocar
- Depois: "Fone Bluetooth, R$ 199,90, avaliação 4,6 de 5, botão"

---

## :icon[hand] Área de toque: 44 por 44

Dedo não é cursor: alvo pequeno vira toque errado, principalmente para quem tem tremor. O mínimo é **44 por 44** (o Android recomenda 48).

- `minWidth` e `minHeight` no estilo: o alvo cresce e aparece maior
- **`hitSlop`**: a área de toque cresce para fora, sem mudar o desenho

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

O `hitSlop` não passa da borda do pai e não deve invadir o alvo vizinho: deixe pelo menos 8 de espaço entre eles.

---

## :icon[mouse-pointer-click] Exemplo: Botao acessível

O `Botao` do E13 já tem `accessibilityRole="button"`. Faltam o estado e os 44 do tamanho `sm`, que tem 36 de altura:

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
      style={({ pressed }) => [estilos.base, /* demais estilos do E13 */ style]} {...rest}>
      {/* ícone e título como no E13 */}
    </Pressable>
  );
}
```

- `accessibilityState` sai do `...rest` para ser combinado: o `selected` dos filtros e o `disabled` valem juntos
- Botão só com ícone recebe o rótulo por fora: `<Botao icone="trash-outline" accessibilityLabel="Remover Fone Bluetooth" />`

---

## :icon[sun] Cor: contraste e um sinal a mais

A WCAG, referência internacional de acessibilidade digital, pede no nível AA **4,5 para 1** entre texto e fundo, e 3 para 1 em texto grande, ícones e bordas de controles. Os tokens da Lojinha sobre `superficie`:

| Par | Claro | Escuro |
|---|---|---|
| `textoSuave` | 7,58 | 5,71 |
| `primaria` | 7,10 | 5,38 |
| `alerta`, se for `#f59e0b` | 2,15 | 6,81 |
| `borda` do `Campo` | 1,23 | 1,41 |

No claro, escureça o `alerta` para `#b45309` (5,02). A borda do cartão é enfeite; a do `Campo` mostra onde digitar: use `textoSuave` nela.

Cor nunca é o único sinal: o erro do `Campo` vem escrito e o `Badge` tem `texto`, não só `tom`.

---

## :icon[list-checks] Checklist de auditoria

Ligue o leitor de tela, abra uma tela e confira item por item:

1. **Nome**: todo elemento tocável tem rótulo que faz sentido sozinho
2. **Papel e estado**: botões dizem "botão", títulos dizem "título", filtros dizem "selecionado"
3. **Ordem e grupos**: a leitura segue a tela, e cada cartão é um foco só
4. **Imagens**: as informativas são descritas e as decorativas ficam em silêncio
5. **Toque**: todo alvo tem pelo menos 44 por 44
6. **Cor**: texto com contraste de 4,5 para 1 e nada dito só por cor
7. **Fonte**: no tamanho máximo, nada cortado nem sobreposto

Para cada falha, anote **tela, problema e correção**.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Papel dentro do rótulo: `accessibilityLabel="Botão comprar"` vira "Botão comprar, botão"
- Botão dentro de um cartão agrupado, como o carrinho do E12 dentro do `Pressable` do cartão: no iPhone, o VoiceOver não chega até ele
- Rótulo genérico: "Remover" em todos os itens do carrinho, sem dizer qual
- `hitSlop` maior que o espaço até o vizinho: o toque cai no botão errado
- Testar só com os olhos: a maioria dos problemas só aparece com o leitor de tela ligado
:::

---

## Resumo

:::summary
- O leitor de tela fala rótulo, papel, estado e dica, que vêm das props `accessibility...`
- Botão só com ícone precisa de `accessibilityLabel`, e o papel nunca entra no rótulo
- `accessible` junta um cartão ou um grupo de ícones em um só foco
- Todo alvo tem pelo menos 44 por 44, com `minHeight` ou `hitSlop`
- Texto com contraste de 4,5 para 1 nos tokens, e cor nunca é o único sinal
:::

---

## :icon[flask-conical] No laboratório

Deixe Início, Detalhe e Carrinho responsivos e acessíveis.

:::steps
1. `Inicio.js`: 2 colunas no celular e 3 a partir de 600 de largura, com a `key` junto
2. Gire o celular e ponha a fonte no máximo: corrija o que cortar, vazar ou sumir no notch
3. `Botao` e `CartaoProduto` com rótulo, papel, estado e alvo de 44 por 44
4. Em dupla, audite as três telas com TalkBack ou VoiceOver, pelo checklist
5. Corrija pelo menos 5 problemas e registre no `README.md`, em "E18: acessibilidade": tela, problema e correção
6. Commit "E18: responsividade e acessibilidade" e `git push`
:::

**Critérios**: 2 colunas em pé e 3 deitado, sem tela vermelha; nada cortado com fonte máxima; 5 correções no README. Entregue o link do repositório.
