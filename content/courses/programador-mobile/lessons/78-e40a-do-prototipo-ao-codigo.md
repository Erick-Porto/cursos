---
title: Do protótipo ao código
summary: Leia um protótipo de tela e traduza medidas, cores e elementos em tokens, rotas e componentes do UI kit.
module: layout-rn
duration_minutes: 40
objectives:
  - Ler medidas, cores, tipografia, espaçamentos e estados em um protótipo
  - Traduzir um protótipo em tokens, rotas e componentes do UI kit
  - Completar o que o protótipo não diz com o checklist de entrega de tela
---

# Do protótipo ao código

Programador Mobile · Encontro E40 · Aula 78 de 89

---

## O que você vai aprender

:::goal
- Entender como o trabalho de design chega até você
- Ler medidas, cores, fontes, espaçamentos e estados em um protótipo
- Traduzir o desenho em tokens, rotas e componentes do UI kit
- Entregar a tela com o checklist: estados, acessibilidade, temas e tamanhos
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **protótipo** | o desenho final das telas, com cores, letras e medidas, quase igual ao app |
| **wireframe** | o rascunho: caixas cinza que mostram o que vai em cada tela |
| **handoff** | (*passagem*) a entrega do desenho, de quem desenha para quem programa |
| **Figma** | o programa, no navegador, em que o design desenha as telas |
| **inspetor** | o painel do Figma que mostra as medidas, a cor e a fonte do que você selecionou |
| **checklist** | a lista de conferência: item por item, antes de dizer "pronto" |

---

## Por que isso importa

Você entra na equipe de um banco digital. Na segunda-feira chega o link do Figma da nova tela **Perfil** e a tarefa: "implementar até sexta".

Você monta no olho: `padding: 15` aqui, `18` ali, um roxo copiado da imagem que sai quase igual ao da marca. Na revisão, o designer aponta doze diferenças. O teste abre o app no tema escuro e o nome some. Um cliente com fonte grande vê o e-mail cortado.

:::question
Como transformar um desenho em código que fica igual ao protótipo e não quebra no que o desenho não mostra?
:::

---

## O protótipo

Quem constrói uma casa segue o quê: o rascunho no guardanapo ou a planta?

---

## :icon[route] O que é um protótipo

Um **protótipo** é o desenho de alta fidelidade das telas: cores, fontes e medidas finais, quase igual ao app. Pense na obra de uma casa:

- o **wireframe** é o rascunho a lápis: onde fica cada cômodo
- o **protótipo** é a planta do arquiteto, com todas as medidas escritas
- você é quem constrói, seguindo a planta

A passagem da planta para a obra chama-se **handoff**. No E30 você partiu de um wireframe, as caixas cinza da Lojinha. Hoje parte de um protótipo.

---

## :icon[route] Como o trabalho chega até você

| Etapa | Quem | O que entrega |
|---|---|---|
| Descoberta | produto | o problema e quem vai usar |
| Wireframe | design | caixas cinza: o que vai em cada tela |
| Protótipo | design | telas finais no Figma, com fluxo clicável |
| Implementação | você | as telas em código, ligadas aos dados |
| Revisão | design e testes | diferenças e bugs para ajustar |

O **fluxo clicável** são setas entre as telas: no Figma, tocar num botão do desenho leva à tela seguinte, como no app.

---

## :icon[user] O protótipo na prática

Um frame (a moldura de uma tela no Figma) de 390 por 844, tema claro, margem lateral de 16:

:::center
![Protótipo da tela Perfil com as medidas de cada elemento e dos espaços entre eles](images/e40-prototipo-perfil.svg)
:::

:::example Protótipo: Perfil
- Topo centralizado: foto redonda de 72 por 72; sem foto, as iniciais
- 16 abaixo: nome em Inter Bold 20, cor `#0F172A`
- 4 abaixo: e-mail em Inter Regular 16, cor `#475569`
- 24 abaixo: cartão branco, raio 12, com 4 linhas de 56 de altura: Meus pedidos, Endereços, Notificações e Ajuda
- Cada linha: ícone de 24, texto 16 e seta à direita; linha cinza de 1 entre elas
- 32 abaixo: "Sair" em roxo, com ícone de saída, sem fundo
:::

---

## Ler o protótipo

Na planta da casa, o pedreiro mede a parede no olho?

---

## :icon[search] O inspetor: as medidas da planta

Na planta da casa, as medidas vêm escritas ao lado de cada parede: o pedreiro não mede no olho. No Figma, quem mostra as medidas é o **inspetor**:

:::steps
1. Clique num elemento do desenho, como o avatar
2. No painel da direita, o inspetor mostra largura (W), altura (H), cor e fonte
3. Com <kbd>Alt</kbd> pressionado, passe o mouse sobre outro elemento: aparece a distância entre os dois
:::

Confira se o frame está em **1x** (tamanho normal). Em 1x, **1 px do protótipo vale 1 ponto** no React Native, sem conversão. O avatar de 72 do desenho tem 72 pontos no app.

---

## :icon[search] Ler o protótipo na prática

O que o inspetor mostra na tela Perfil:

| O que ler | Onde aparece | Na tela Perfil |
|---|---|---|
| Medidas | largura e altura (W, H) | avatar 72 por 72 |
| Espaçamentos | distância entre camadas | 16 entre avatar e nome |
| Cores | hex ou nome do estilo | `#475569`, "Texto suave" |
| Tipografia | família, peso, tamanho | Inter Bold 20 |
| Estados | variantes do componente | botão normal, pressionado, desabilitado |

O **hex** é o código da cor, como `#475569`. O **estilo** é o nome que o designer deu a ela, como "Texto suave": é ele que diz a intenção. O avatar de 72 é o `tamanho="lg"` do kit.

---

## Tokens

Se a marca trocar o roxo amanhã, quantos arquivos você vai ter de mudar?

---

## :icon[sliders-horizontal] No protótipo, no código: tokens

Os **tokens** do E31 são a paleta de tintas com nome: o valor mora num lugar só, o `tokens.js`. Copie a **intenção** do desenho, não o número. Hex e números soltos ignoram o tema escuro e espalham valores que ninguém lembra de atualizar.

| No protótipo | No código |
|---|---|
| `#6D28D9`, estilo "Primária" | `cores.primaria` |
| `#475569`, estilo "Texto suave" | `cores.textoSuave` |
| espaço 16 | `espaco.md` |
| espaço 24 | `espaco.lg` |
| Inter Bold 20 | `familia.negrito` e `fonte.titulo` |
| raio 12 | `raio.md` |

:::tip Número fora da escala
Viu 15, 18 ou 22? Use o token mais próximo e confirme com o designer. Quase sempre é descuido no desenho.
:::

---

## :icon[sliders-horizontal] Tokens na prática

O e-mail da tela Perfil: Inter Regular 16, cor "Texto suave", 4 abaixo do nome.

```jsx
// Errado: tudo copiado do inspetor
email: { color: '#475569', fontFamily: 'Inter', fontSize: 16, marginTop: 4 },

// Certo: cada valor vira o token do papel
<Text style={[estilos.email, { color: cores.textoSuave }]}>{usuario.email}</Text>
email: { fontFamily: familia.regular, fontSize: fonte.corpo, marginTop: espaco.xs },
```

| Troca | Com número solto | Com token |
|---|---|---|
| Tema escuro | o e-mail continua cinza-escuro sobre fundo escuro e some | `cores.textoSuave` muda junto com o tema |
| A marca muda o cinza | você caça `#475569` em todos os arquivos | muda uma linha no `tokens.js` |
| O desenho diz 15 | `15` aqui, `16` ali | `espaco.md`, o 16 mais próximo |

---

## Pratique

:::example Desafio
Traduza cada valor do inspetor para o código da Lojinha:

1. Nome do produto em `#0F172A`, estilo "Texto"
2. Espaço de 15 entre o cartão e o botão
3. Título da página em Inter Bold 28
4. Linha da lista com 56 de altura
5. O preço "R$ 199,90" escrito no cartão
:::

:::tip Resposta
1. `{ color: cores.texto }`, no array de estilos, para mudar com o tema
2. `marginTop: espaco.md`: 15 vira 16, o token mais próximo
3. `fontFamily: familia.negrito` e `fontSize: fonte.destaque`
4. `minHeight: 56`, não `height`: com fonte grande, a linha cresce em vez de cortar o texto
5. `formatarPreco(produto.preco)`: o texto do desenho é exemplo; a regra já existe em `src/utils/formatar.js`
:::

---

## Telas viram rotas

Por que o carrinho fica numa aba e os filtros sobem por cima da tela?

---

## :icon[layers] Telas viram rotas

Cada frame do protótipo é uma tela, e cada tela vira uma **rota**, um arquivo em `app/`. As setas do fluxo clicável mostram como se chega nela, e isso define o tipo de rota: a pilha de cartas (a tela nova vai por cima), as abas do fichário ou o modal.

| Tela no protótipo | Como se chega | Rota |
|---|---|---|
| Início, Categorias, Carrinho, Perfil | barra de abas | arquivos em `app/(tabs)/`, como `perfil.js` |
| Produto | toque no cartão, com voltar | `app/produto/[id].js` |
| Filtros | sobe por cima da tela | `app/filtros.js`, modal |
| Entrar | antes de tudo | `app/(auth)/entrar.js` |

A rota só reexporta a tela de `src/telas/`:

```javascript
// app/(tabs)/perfil.js
export { default } from '../../src/telas/Perfil';
```

---

## :icon[layers] Rotas na prática

Três setas do protótipo da Lojinha e o código que cada uma vira, como no E36 e no E37:

```jsx
// 1. Seta para a aba Perfil: o arquivo em app/(tabs)/ põe a aba na barra
export { default } from '../../src/telas/Perfil';

// 2. Seta do cartão para o Produto: empilha o Detalhe, com voltar
router.push('/produto/' + id);

// 3. Seta do botão de filtros: sobe o modal (presentation: 'modal' no layout raiz)
<Link href="/filtros" asChild>{/* o botão de filtros */}</Link>
```

| Seta no protótipo | Tipo | Na tela |
|---|---|---|
| para a aba | abas do fichário | a barra de baixo ganha "Perfil" |
| do cartão | pilha de cartas | o Detalhe entra por cima; voltar o tira |
| dos filtros | modal | a tela sobe de baixo e fecha com `router.back()` |

---

## Componentes do kit

Para montar um castelo de Lego, você fabrica as peças?

---

## :icon[component] Elementos viram componentes do UI kit

Os componentes do UI kit são as peças de Lego do E33: pequenas, reaproveitáveis, encaixam umas nas outras. Para cada elemento do desenho, procure a peça que já existe:

| Elemento no protótipo | Componente | Props |
|---|---|---|
| Foto redonda ou iniciais | `Avatar` | `nome`, `uri`, `tamanho="lg"` |
| Bloco branco arredondado | `Cartao` | `children` |
| Linha cinza entre opções | `Divisor` | `style` só para a margem |
| Linha com ícone, texto e seta | `OpcaoPerfil` | `icone`, `titulo`, `onPress` |
| "Sair" roxo sem fundo | `Botao` | `variante="fantasma"`, `icone` |

`OpcaoPerfil` é peça nova e só existe nesta tela, então fica no próprio `Perfil.js`. Se aparecer em outra tela, vai para `src/components/ui/`.

---

## :icon[component] Componentes na prática

Cada peça do kit, com as props do desenho, e o que aparece:

```jsx
<Avatar nome="Ana Souza" uri={null} tamanho="lg" />
// um círculo roxo de 72 com "AS": sem foto, o Avatar mostra as iniciais

<Divisor style={{ marginVertical: 0 }} />
// a linha cinza de 1, sem a margem de 16 que o Divisor traz de fábrica

<Botao titulo="Sair" variante="fantasma" icone="log-out-outline" onPress={sair} />
// texto roxo com o ícone de saída, sem fundo nem borda
```

Nenhuma dessas peças ganhou `width`, `height` ou cor por fora: a medida do desenho já é uma variante do kit. O `style` de fora só posiciona, como a margem do `Divisor`.

---

## Checklist de entrega

Antes de receber as chaves da casa nova, o que você confere?

---

## :icon[list-checks] Checklist de entrega de tela

O protótipo mostra só o dia bom: dados carregados, nome curto, tema claro. O **checklist de entrega** é a vistoria antes de entregar as chaves: o que conferir antes de dizer "pronto".

- :icon[hourglass] **4 estados**: carregando, erro, vazio e com dados
- :icon[eye] **Acessibilidade**: o leitor de tela lê tudo com rótulo e papel; toques de 44 por 44; fonte em 200% sem cortar
- :icon[sun] **2 temas**: claro e escuro, sem nenhuma cor fixa no código
- :icon[smartphone] **2 tamanhos**: celular pequeno e tablet (ou celular deitado), com o nome mais longo que você imaginar
- :icon[check-check] **Fidelidade**: lado a lado com o protótipo, cada medida virou token

Faltou algum? Anote no README o que ficou pendente.

---

## :icon[list-checks] Checklist na prática

Cada item se testa forçando o caso, sem esperar ele acontecer sozinho:

| Item | Como forçar | O que conferir |
|---|---|---|
| Erro | `CHANCE_DE_ERRO = 1` | o `EstadoErro`, com "Tentar novamente" |
| Vazio | `USUARIO_EXEMPLO = null` | "Você ainda não entrou" e o botão "Entrar" |
| Texto longo | `nome: 'Maria Aparecida dos Santos Albuquerque'` | o nome quebra linha, sem cortar |
| Fonte em 200% | `adb shell settings put system font_scale 2.0` | as linhas de 56 crescem |
| Tema escuro | o botão de tema da Lojinha | o cartão escurece e nada some |

Depois de cada teste, volte o valor: `CHANCE_DE_ERRO` em 0.3, o usuário da Ana e `font_scale 1.0`.

---

## Pense

:::question
O protótipo é um único desenho: Ana Souza, nome curto, tema claro, tela de 390, tudo carregado. O que o protótipo não diz? Liste quatro situações em que a tela pode quebrar.
:::

:::tip Resposta
- :icon[timer] **Carregando**: o que aparece antes de os dados chegarem?
- :icon[circle-alert] **Erro e vazio**: sem rede; visitante sem conta
- :icon[text] **Texto longo**: "Maria Aparecida dos Santos Albuquerque" quebra ou corta?
- :icon[search] **Fonte grande**: em 200%, as linhas de 56 ainda cabem?
- :icon[sun] **Tema escuro**: o cartão branco vira o quê?
- :icon[smartphone] **Outros tamanhos**: celular de 320 ou tablet de 800?
- :icon[eye] **Leitor de tela**: o que ele fala ao tocar no avatar?
:::

---

## A tela Perfil

Com as peças prontas e a planta na mão, quanto tempo leva para montar uma tela?

---

## :icon[file-code] Perfil.js: o topo

Montar a tela é montar o Lego seguindo o manual: o protótipo é o manual, e as peças vêm do UI kit. Começa pelo topo: avatar, nome e e-mail.

```jsx
// imports omitidos: react-native, useTema, tokens e componentes do UI kit
const usuario = { nome: 'Ana Souza', email: 'ana.souza@email.com', foto: null };
export default function Perfil() {
  const { cores } = useTema();
  return (
    <ScrollView style={{ backgroundColor: cores.fundo }} contentContainerStyle={estilos.conteudo}>
      <View style={estilos.topo}>
        <Avatar nome={usuario.nome} uri={usuario.foto} tamanho="lg" />
        <Text style={[estilos.nome, { color: cores.texto }]}>{usuario.nome}</Text>
        <Text style={[estilos.email, { color: cores.textoSuave }]}>{usuario.email}</Text>
      </View>
      {/* cartão de opções e botão Sair */}
    </ScrollView>
  );
}
```

`ScrollView`, e não `FlatList`: são poucos itens fixos. Com fonte grande, a tela passa da altura do celular e precisa rolar, mesmo que o protótipo caiba.

---

## :icon[list-ordered] O topo em português

| Trecho | O que ele diz |
|---|---|
| `const usuario = { ... }` | os dados de exemplo da Ana, enquanto o app não tem login; `foto: null` quer dizer "sem foto" |
| `<ScrollView style={{ backgroundColor: cores.fundo }}>` | "uma tela que rola, com o fundo do tema" |
| `<Avatar ... tamanho="lg" />` | a foto redonda de 72 do protótipo; sem foto, o `Avatar` mostra "AS" |
| `[estilos.nome, { color: cores.texto }]` | o tamanho e a fonte vêm do `StyleSheet`; a cor vem do tema |

As medidas do desenho (16 abaixo do avatar, 4 abaixo do nome) viram `marginTop: espaco.md` e `marginTop: espaco.xs` nos estilos `nome` e `email`.

---

## :icon[file-code] Perfil.js: opções e Sair

```jsx
const opcoes = [
  { icone: 'receipt-outline', titulo: 'Meus pedidos' },
  { icone: 'location-outline', titulo: 'Endereços' },
  { icone: 'notifications-outline', titulo: 'Notificações' },
  { icone: 'help-circle-outline', titulo: 'Ajuda' },
];
<Cartao style={estilos.cartao}>
  {opcoes.map((opcao, i) => (
    <View key={opcao.titulo}>
      {i > 0 && <Divisor style={{ marginVertical: 0 }} />}
      <OpcaoPerfil icone={opcao.icone} titulo={opcao.titulo} />
    </View>
  ))}
</Cartao>
<Botao titulo="Sair" variante="fantasma" icone="log-out-outline" onPress={sair} style={estilos.sair} />
```

- `opcoes.map((opcao, i) => ...)`: uma linha para cada opção; o `i` é a posição, de 0 a 3, e o título serve de crachá (`key`)
- `i > 0 &&` põe a linha cinza só **entre** as opções, como no desenho: a primeira, de posição 0, fica sem
- O `Divisor` do kit tem margem vertical de 16; aqui a linha de 56 já dá o respiro, então a margem sai
- Quatro itens fixos dentro de uma `ScrollView`: o `map` resolve, sem `FlatList`

---

## :icon[file-code] OpcaoPerfil: uma linha da lista

```jsx
function OpcaoPerfil({ icone, titulo, onPress }) {
  const { cores } = useTema();
  return (
    <Pressable onPress={onPress} accessibilityRole="button"
      style={({ pressed }) => [estilos.opcao, pressed && { opacity: 0.6 }]}>
      <Ionicons name={icone} size={24} color={cores.primaria} />
      <Text style={[estilos.textoOpcao, { color: cores.texto }]}>{titulo}</Text>
      <Ionicons name="chevron-forward" size={20} color={cores.textoSuave} />
    </Pressable>
  );
}

// no StyleSheet de Perfil.js
opcao: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: espaco.md },
textoOpcao: { flex: 1, fontFamily: familia.regular, fontSize: fonte.corpo },
```

- `pressed && { opacity: 0.6 }`: enquanto o dedo aperta, a linha fica mais clara, o retorno ao toque do E32
- `chevron-forward` é a seta para a direita
- `flex: 1` no texto empurra a seta para a direita e faz um título longo quebrar linha, em vez de jogar a seta para fora da tela

---

## :icon[search] Fonte grande: minHeight, não height

:::center
![Animação: a fonte vai ao máximo e o título Meus pedidos quebra em duas linhas; com height: 56 a linha corta o texto, com minHeight: 56 a linha cresce](images/e40-fonte-grande.svg)
:::

O protótipo mostra só a fonte padrão. Com a fonte do celular no máximo, o título cresce e o `flex: 1` o quebra em duas linhas.

- `height: 56` é a caixa de sapato do E38: a linha fica presa e corta o texto
- `minHeight: 56` é a sacola: tem 56 de partida e cresce junto com o texto

---

## :icon[triangle-alert] Erros comuns

:::warning
- Copiar hex e números do inspetor direto no `StyleSheet`: o tema escuro quebra e a escala vira bagunça
- Medir num frame em 2x e usar o valor como está: tudo sai com o dobro do tamanho
- Fixar `height` em linhas e cartões com texto: com fonte grande, o texto corta. Use `minHeight` e `padding`
- Criar um `BotaoSair` com estilo próprio quando o `Botao` do kit já tem a variante
- Montar o preço à mão com `toFixed`: a `formatarPreco` do E05 já faz isso
- Entregar só o caminho feliz: sem carregando, erro e vazio, sem testar fonte grande e tema escuro
:::

---

## Resumo

:::summary
- O protótipo chega do design no handoff, com medidas, cores, fontes, espaçamentos e estados
- Cada valor do inspetor vira um token: `cores`, `espaco`, `fonte`, `familia` e `raio`; fora da escala, use o mais próximo e confirme
- Frames viram rotas do Expo Router e elementos viram componentes do UI kit
- O protótipo não mostra carregando, erro, vazio, texto longo, fonte grande, tema escuro nem outros tamanhos
- O checklist de entrega cobre 4 estados, acessibilidade, 2 temas e 2 tamanhos
:::

---

## :icon[arrow-right] Próximos passos

Você sabe ler um protótipo e entregar uma tela completa. Falta provar que domina a unidade inteira.

Na aula 79, a revisão de layout e componentes:

- :icon[map] um slide por tema, do Flexbox às animações
- :icon[circle-help] cinco questões comentadas no estilo da prova
- :icon[flask-conical] o laboratório: a tela Perfil completa e o commit "v1 Lojinha"

Depois, a **Prova 4**, de E30 a E40, no sistema.
