---
title: Variantes e boas práticas do UI kit
summary: Componentes compostos, tamanhos tirados dos tokens, o Botao completo, o índice do kit e a Galeria.
module: layout-rn
duration_minutes: 40
objectives:
  - Compor componentes com Cartao.Cabecalho e Cartao.Corpo
  - Padronizar variantes e tamanhos do Botao a partir dos tokens
  - Organizar o kit em src/components/ui com um índice e uma tela Galeria
---

# Variantes e boas práticas do UI kit

Programador Mobile · Encontro E33 · Aula 65 de 89

---

## O que você vai aprender

:::goal
- Montar componentes compostos como `Cartao.Cabecalho` e `Cartao.Corpo`
- Definir tamanhos `sm`, `md` e `lg` a partir dos tokens
- Completar o `Botao` com variante, tamanho, ícone e estado desabilitado
- Organizar o kit em `src/components/ui/` e documentá-lo na tela `Galeria`
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **componente composto** | uma família de peças que trabalham juntas, como `Cartao`, `Cartao.Cabecalho` e `Cartao.Corpo` |
| **`sm`, `md`, `lg`** | pequeno, médio e grande, do inglês *small*, *medium* e *large* |
| **arquivo índice** | o `index.js` de uma pasta, que reexporta tudo o que ela tem: o barril do E11 |
| **Galeria** | uma tela que mostra todas as peças do kit, para conferir e documentar |
| **contrato** | o combinado de uma peça: as props que ela aceita, os valores padrão e o que cada uma faz |

---

## O cartão que queria ser tudo

Num app de delivery, quase tudo é cartão: o restaurante (nome, nota, selo "Entrega grátis"), o pedido (número, status, itens, botão "Acompanhar") e o cupom (código e validade).

A equipe tentou resolver com props: `titulo`, `subtitulo`, `selo`, `icone`, `itens`, `textoBotao`, `onBotao`, `rodape`. Oito props, metade nunca usadas juntas, e o cartão do cupom ainda não coube.

:::question
Como o `Cartao` pode aceitar conteúdos tão diferentes sem ganhar uma prop para cada um?
:::

---

## Componentes compostos

Que partes tem uma folha de prova? E toda prova usa todas elas?

---

## :icon[component] Componentes compostos

Um **componente composto** é uma família de peças que trabalham juntas: o pai desenha a moldura e os filhos desenham as partes. Pense numa folha de prova: ela tem cabeçalho (nome e data) e corpo (as questões), e cada prova usa as partes de que precisa.

```jsx
<Cartao>
  <Cartao.Cabecalho titulo="Pedido #1042">
    <Badge texto="A caminho" tom="neutro" />
  </Cartao.Cabecalho>
  <Cartao.Corpo>
    <Text>2 itens · R$ 259,80</Text>
    <Botao titulo="Acompanhar" variante="secundaria" tamanho="sm" />
  </Cartao.Corpo>
</Cartao>
```

Quem usa monta como quiser. O selo segue as regras do E13: para um pedido `'enviado'`, `textoDoStatus` devolve `'A caminho'` e `tomDoStatus`, `'neutro'`.

---

## :icon[component] O que cada peça desenha

:::center
![Diagrama: no cartão do Pedido #1042, o Cartao desenha a moldura, Cartao.Cabecalho põe o título e o selo A caminho na mesma linha e Cartao.Corpo empilha o texto 2 itens e o botão Acompanhar](images/e33-cartao-composto.svg)
:::

O `Cartao` desenha a moldura. `Cartao.Cabecalho` põe o `titulo` e o seu `children` na mesma linha; `Cartao.Corpo` empilha o `children` em coluna.

O cupom usa só `Cartao.Corpo`; o pedido usa as duas partes. Nenhuma prop nova. O ponto em `Cartao.Corpo` mostra que a peça pertence à família do `Cartao`.

---

## :icon[component] Cartao.Cabecalho e Cartao.Corpo por dentro

Função é valor (E10) e também objeto: como o `ProdutoAntigo.prototype` do E17, ela aceita propriedades. Dá para pendurar outras funções nela.

```jsx
function Cabecalho({ titulo, children }) {
  const { cores } = useTema();
  return (
    <View style={estilos.cabecalho}>
      <Text style={[estilos.titulo, { color: cores.texto }]}>{titulo}</Text>
      {children}
    </View>
  );
}

const Corpo = ({ children, style }) => <View style={[estilos.corpo, style]}>{children}</View>;

Cartao.Cabecalho = Cabecalho;
Cartao.Corpo = Corpo;
```

Tudo no mesmo `Cartao.js`, abaixo do `Cartao`. Quem importa `Cartao` leva a família inteira. Nos estilos, `cabecalho` fica em linha (`flexDirection: 'row'`, `justifyContent: 'space-between'`) e `corpo` ganha `gap: espaco.sm`.

---

## :icon[list-ordered] A família do Cartao em português

| Linha | O que ela diz |
|---|---|
| `function Cabecalho({ titulo, children })` | uma peça comum: recebe o título e o que vier entre as tags |
| `const Corpo = ({ children, style }) => ...` | outra peça, numa arrow function (E10): uma coluna com o `children` |
| `Cartao.Cabecalho = Cabecalho;` | "pendure o `Cabecalho` no `Cartao`, com o nome `Cabecalho`" |
| `Cartao.Corpo = Corpo;` | "pendure o `Corpo` também" |
| `<Cartao.Corpo>` na tela | "use a peça `Corpo` que está pendurada no `Cartao`" |

Sem a atribuição, `Cartao.Corpo` não existe: é `undefined`, e a tela quebra.

---

## :icon[component] Cartao composto na prática

Cada cartão usa só as partes de que precisa:

**1. Cupom: só o corpo.**

```jsx
<Cartao>
  <Cartao.Corpo>
    <Text>Cupom PRIMEIRACOMPRA</Text>
    <Text>Válido até 30/11</Text>
  </Cartao.Corpo>
</Cartao>
```

**2. Endereço: o título com um botão ao lado, e o corpo embaixo.**

```jsx
<Cartao>
  <Cartao.Cabecalho titulo="Entregar em">
    <Botao titulo="Editar" variante="fantasma" tamanho="sm" />
  </Cartao.Cabecalho>
  <Cartao.Corpo>
    <Text>Rua das Flores, 120</Text>
  </Cartao.Corpo>
</Cartao>
```

**3. Produto esgotado: o selo no cabeçalho e o botão no corpo.**

```jsx
<Cartao>
  <Cartao.Cabecalho titulo="Tênis de Corrida">
    <Badge texto="Esgotado" tom="perigo" />
  </Cartao.Cabecalho>
  <Cartao.Corpo>
    <Botao titulo="Avise-me" variante="secundaria" tamanho="sm" />
  </Cartao.Corpo>
</Cartao>
```

Na tela: as mesmas bordas e cantos; no cabeçalho, título à esquerda e o resto à direita.

---

## Tamanhos

Por que a lanchonete vende o copo em P, M e G, e não em 37 tamanhos?

---

## :icon[arrow-up-down] Tamanhos sm, md e lg

Os **tamanhos** são versões da mesma peça em pequeno, médio e grande, como o copo P, M e G da lanchonete. As medidas saem dos tokens; só a altura é nova, e o `md` fica em 44, a área de toque confortável.

| Tamanho | Altura mínima | Padding lateral | Fonte | Ícone |
|---|---|---|---|---|
| `sm` | 36 | `espaco.md` (16) | `fonte.pequena` (12) | 16 |
| `md` | 44 | `espaco.lg` (24) | `fonte.corpo` (16) | 20 |
| `lg` | 56 | `espaco.xl` (32) | `fonte.titulo` (20) | 24 |

O `Avatar` usa os mesmos nomes: `sm` 32, `md` 48, `lg` 72. Mesmos nomes em todo o kit: quem aprendeu um componente já sabe usar os outros.

---

## O Botao completo

Três variantes e três tamanhos: quantos botões diferentes cabem num componente só?

---

## :icon[mouse-pointer-click] Botao completo: os dois mapas

O `Botao` completo escolhe a aparência em dois mapas, os dicionários do E08: um de tamanho, fixo e tirado dos tokens, e um de variante, que depende do tema e por isso é uma função de `cores`.

```jsx
const tamanhos = {
  sm: { altura: 36, padding: espaco.md, fonte: fonte.pequena, icone: 16 },
  md: { altura: 44, padding: espaco.lg, fonte: fonte.corpo, icone: 20 },
  lg: { altura: 56, padding: espaco.xl, fonte: fonte.titulo, icone: 24 },
};

function variantes(cores) {
  return {
    primaria: { fundo: cores.primaria, texto: cores.fundo, borda: cores.primaria },
    secundaria: { fundo: 'transparent', texto: cores.primaria, borda: cores.primaria },
    fantasma: { fundo: 'transparent', texto: cores.primaria, borda: 'transparent' },
  };
}
```

`'transparent'` é sem cor: o fundo da tela aparece por trás. Na `primaria`, o texto usa `cores.fundo`: claro sobre a cor primária no tema claro, escuro no tema escuro. O contraste funciona nos dois.

---

## :icon[mouse-pointer-click] Botao completo: o componente

```jsx
export default function Botao({ titulo, onPress, variante = 'primaria', tamanho = 'md',
  icone, desabilitado = false, style, ...rest }) {
  const { cores } = useTema();
  const v = variantes(cores)[variante];
  const t = tamanhos[tamanho];
  return (
    <Pressable onPress={onPress} disabled={desabilitado} accessibilityRole="button"
      style={({ pressed }) => [estilos.base, { minHeight: t.altura, paddingHorizontal: t.padding,
        backgroundColor: v.fundo, borderColor: v.borda }, pressed && estilos.pressionado,
        desabilitado && estilos.desabilitado, style]} {...rest}>
      {icone ? <Ionicons name={icone} size={t.icone} color={v.texto} /> : null}
      <Text style={[estilos.titulo, { fontSize: t.fonte, color: v.texto }]}>{titulo}</Text>
    </Pressable>
  );
}
```

- `disabled` bloqueia o toque; `estilos.desabilitado`, com `opacity: 0.5`, mostra isso
- `icone` recebe um nome do `Ionicons`, como `'cart-outline'`
- `estilos.base`: `flexDirection: 'row'`, centralizado, `gap: espaco.sm`, `borderWidth: 1` e `borderRadius: raio.md`

---

## :icon[list-ordered] O Botao completo em português

| Linha | O que ela diz |
|---|---|
| `variante = 'primaria', tamanho = 'md'` | os padrões: sem nada, o botão é o principal e médio |
| `variantes(cores)[variante]` | "monte o mapa com as cores do tema e pegue a versão pedida" |
| `tamanhos[tamanho]` | "pegue as medidas do tamanho pedido" |
| `v.fundo`, `t.altura` | um campo da versão (`v`) ou das medidas (`t`) |
| `accessibilityRole="button"` | avisa ao leitor de tela que isto é um botão |
| `icone ? <Ionicons ... /> : null` | "tem ícone? desenhe; não tem? nada" |
| `style` no fim e `{...rest}` | a tela posiciona e repassa props, como no `Cartao` |

---

## :icon[mouse-pointer-click] O Botao na prática

Na tela do produto, três botões com pesos diferentes:

```jsx
<Botao titulo="Comprar agora" tamanho="lg" icone="cart-outline" onPress={comprar} />
<Botao titulo="Adicionar ao carrinho" variante="secundaria" onPress={adicionar} />
<Botao titulo="Ver todos" variante="fantasma" tamanho="sm" onPress={verTodos} />
```

| Botão | Na tela |
|---|---|
| Comprar agora | fundo cheio na cor primária, 56 de altura e o ícone do carrinho |
| Adicionar ao carrinho | só a borda e o texto na cor primária, 44 de altura |
| Ver todos | só o texto, sem borda, 36 de altura e letra pequena |

O que não foi escrito vem do padrão: `variante="primaria"` no primeiro e `tamanho="md"` no segundo.

---

## Pratique

:::example Desafio
A tela do carrinho tem três ações:

- "Finalizar compra": a principal, grande, com o ícone `'card-outline'`
- "Continuar comprando": a alternativa, no tamanho normal
- "Limpar carrinho": discreta e pequena, desabilitada quando o carrinho está `vazio`

Escreva os três `Botao`.
:::

:::tip Resposta
```jsx
<Botao titulo="Finalizar compra" tamanho="lg" icone="card-outline" onPress={finalizar} />
<Botao titulo="Continuar comprando" variante="secundaria" onPress={voltar} />
<Botao titulo="Limpar carrinho" variante="fantasma" tamanho="sm"
  desabilitado={vazio} onPress={limpar} />
```

`variante="primaria"` e `tamanho="md"` são os padrões: não precisam ser escritos.
:::

---

## Campo e Divisor

Num formulário de papel, o que tem em cada linha?

---

## :icon[keyboard] Campo: rótulo e entrada

O **`Campo`** é a linha de um formulário de papel: o nome do campo em cima (o **rótulo**) e o espaço para escrever embaixo, o `TextInput` do E27. Por enquanto ele é só visual: a validação e a mensagem de erro chegam no E35.

```jsx
export default function Campo({ rotulo, style, ...rest }) {
  const { cores } = useTema();
  return (
    <View style={[estilos.campo, style]}>
      <Text style={[estilos.rotulo, { color: cores.textoSuave }]}>{rotulo}</Text>
      <TextInput
        style={[estilos.entrada, { color: cores.texto, borderColor: cores.borda }]}
        placeholderTextColor={cores.textoSuave}
        accessibilityLabel={rotulo}
        {...rest}
      />
    </View>
  );
}
```

Aqui o `style` vai para a `View` de fora, que posiciona o campo, e o `...rest` vai para o `TextInput`. Assim `value`, `onChangeText`, `placeholder` e `keyboardType` chegam onde fazem sentido:

```jsx
<Campo rotulo="E-mail" placeholder="voce@email.com" keyboardType="email-address" />
```

---

## :icon[minus] Divisor: a menor peça do kit

O **`Divisor`** é uma linha fina entre duas partes da tela.

```jsx
export default function Divisor({ style, ...rest }) {
  const { cores } = useTema();
  return <View style={[estilos.divisor, { backgroundColor: cores.borda }, style]} {...rest} />;
}

const estilos = StyleSheet.create({
  divisor: { height: StyleSheet.hairlineWidth, marginVertical: espaco.md },
});
```

**`StyleSheet.hairlineWidth`** é a linha mais fina que a tela do aparelho consegue desenhar (*hairline* é "da espessura de um fio de cabelo").

Parece pouco para virar componente. Sem ele, cada tela inventa sua linha: uma com altura 1, outra com 2, uma cinza, outra da cor da borda. Uma peça pequena também é do kit: o que conta é o padrão, não o tamanho do código.

---

## :icon[keyboard] Campo e Divisor na prática

**1. Busca controlada, como no E23:** `value` e `onChangeText` não estão nas props do `Campo`; chegam ao `TextInput` pelo `...rest`.

```jsx
const [busca, setBusca] = useState('');

<Campo rotulo="Buscar" placeholder="Fone, livro, garrafa..." value={busca} onChangeText={setBusca} />
```

**2. Cupom com espaço embaixo:** o `style` vai para a `View` de fora e afasta o campo seguinte.

```jsx
<Campo rotulo="Cupom" placeholder="PRIMEIRACOMPRA" style={{ marginBottom: espaco.md }} />
```

**3. Divisor entre dois itens do carrinho:**

```jsx
<Text>Fone Bluetooth</Text>
<Divisor />
<Text>Garrafa Térmica</Text>
```

Na tela: o rótulo em cima de cada entrada e, entre os itens, uma linha fina na cor da borda do tema, com 16 de espaço em cima e embaixo.

---

## O arquivo índice

Seis peças em seis arquivos: cada tela precisa de seis imports?

---

## :icon[folder-tree] A pasta ui e o arquivo índice

Lembre do E11: o `export` põe a peça na vitrine e o `import` pega de lá. O **arquivo índice** é a vitrine da pasta inteira: junta as peças de cada arquivo numa vitrine só.

```plaintext
src/components/
├── ui/            peças genéricas: Avatar, Badge, Botao, Campo, Cartao, Divisor
│   └── index.js   reexporta todas
└── CartaoProduto.js   peça da Lojinha, montada com o kit
```

```javascript
// src/components/ui/index.js
export { default as Avatar } from './Avatar';
export { default as Badge } from './Badge';
export { default as Botao } from './Botao';
export { default as Campo } from './Campo';
export { default as Cartao } from './Cartao';
export { default as Divisor } from './Divisor';
```

É o barril do E11. Na tela, um import só:

```jsx
import { Botao, Cartao, Badge } from '../components/ui';
```

---

## :icon[list-ordered] O índice em português

| Linha | O que ela diz |
|---|---|
| `export { default as Botao } from './Botao'` | "pegue o `export default` do arquivo `Botao.js` e ponha na vitrine com o nome `Botao`" |
| `export { Botao } from './Botao'` | errado aqui: procura um export **com nome** `Botao`, que o arquivo não tem |
| `import { Botao, Cartao } from '../components/ui'` | "da vitrine da pasta `ui`, traga estas duas peças" |

No Node, importar a pasta dava `ERR_UNSUPPORTED_DIR_IMPORT` e o `.js` era obrigatório. No app, o empacotador do Expo (o Metro, que o `-c` do E28 limpa) procura o `index.js` da pasta e dispensa a extensão.

---

## :icon[folder-tree] O índice na prática

O caminho do import muda conforme o lugar do arquivo que importa:

**1. Numa tela, em `src/telas/Galeria.js`:** sobe uma pasta e entra em `components/ui`.

```jsx
import { Avatar, Badge, Botao, Campo, Cartao, Divisor } from '../components/ui';
```

**2. No `CartaoProduto`, em `src/components/`:** a pasta `ui` está ao lado.

```jsx
import { Badge, Botao, Cartao } from './ui';
```

**3. O import antigo, direto do arquivo, continua valendo:**

```jsx
import Botao from '../components/ui/Botao';
```

O índice só encurta o caminho. Na tela, nada muda: as peças são as mesmas.

---

## A Galeria

Na loja de azulejos, dá para escolher sem ver todos lado a lado?

---

## :icon[book-open] Galeria: a documentação viva

A **Galeria** é o mostruário do kit, como o painel de azulejos de uma loja de material de construção: todas as peças à vista, lado a lado. `src/telas/Galeria.js` mostra **todas as variantes**, com um botão para trocar o tema. Quem chega à equipe abre a Galeria antes de criar uma peça nova; quem muda o `Botao` vê o efeito em todas as combinações.

```jsx
export default function Galeria() {
  const { cores, escuro, alternarTema } = useTema();
  return (
    <SafeAreaView style={[estilos.tela, { backgroundColor: cores.fundo }]}>
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <Botao titulo={escuro ? 'Tema claro' : 'Tema escuro'} variante="secundaria" onPress={alternarTema} />
        <Text style={[estilos.secao, { color: cores.texto }]}>Botao</Text>
        <Botao titulo="Primária" />
        <Botao titulo="Secundária" variante="secundaria" />
        <Botao titulo="Fantasma" variante="fantasma" />
        {/* tamanhos, ícone, desabilitado, Badge, Avatar, Cartao, Campo, Divisor */}
      </ScrollView>
    </SafeAreaView>
  );
}
```

Documentação que roda não fica desatualizada: se o código mudou, a Galeria mudou junto.

---

## PropTypes e TypeScript

E se o editor sublinhasse o erro antes mesmo de o app rodar?

---

## :icon[file-code] PropTypes e TypeScript: uma visão

Como avisar quem usa o `Badge` que `tom="vermelho"` não existe?

::::columns
:::col
**PropTypes** declarava o tipo de cada prop e avisava no console. Você vai encontrá-lo em código antigo; nas versões atuais do React, ele é ignorado em componentes de função.

```javascript
Badge.propTypes = {
  tom: PropTypes.oneOf(['neutro', 'sucesso', 'alerta', 'perigo']),
};
```
:::
:::col
**TypeScript**, do E12, é a etiqueta "só cabe isto" na caixa, conferida antes de rodar: sublinha o erro no editor. É a união de valores do `StatusPedido` e o padrão do mercado para UI kits.

```typescript
type BadgeProps = {
  texto: string;
  tom?: 'neutro' | 'sucesso' | 'alerta' | 'perigo';
};
```
:::
::::

A Lojinha segue em JavaScript: os valores padrão e a Galeria documentam o contrato.

---

## Nomes de papel

Você chamaria a gerente de "a moça de camisa azul"?

---

## :icon[lightbulb] Nomeie pelo papel, não pela aparência

Chame pelo cargo, não pela roupa: "a gerente", e não "a de camisa azul". Amanhã ela troca de camisa e continua gerente.

| Evite | Prefira | Por quê |
|---|---|---|
| `variante="verde"` | `variante="primaria"` | a marca pode mudar de cor |
| `tom="vermelho"` | `tom="perigo"` | diz o significado, não o pigmento |
| `BotaoGrande` | `<Botao tamanho="lg">` | um componente, uma prop |
| `CartaoBranco` | `Cartao` | no tema escuro ele não é branco |
| `tamanho={44}` | `tamanho="md"` | a medida mora no kit, não na tela |

A aparência mora nos mapas e nos tokens, onde pode mudar sem quebrar nenhuma tela.

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Element type is invalid` e `got: undefined` | a tela usou uma peça que chegou `undefined`: `Cartao.Corpo = Corpo` esquecido, ou `export { Botao }` no índice quando o arquivo usa `export default` | conferir a atribuição e o `export { default as ... }` |
| `Cannot read property 'fundo' of undefined` | o nome da variante não está no mapa, como `"primario"` | usar um nome do mapa: `primaria`, `secundaria` ou `fantasma` |

---

## :icon[triangle-alert] Erros comuns

Estes não mostram mensagem nenhuma:

:::warning
- Desabilitar só no visual, com `opacity`, e esquecer o `disabled`: o botão apagado continua respondendo ao toque
- Conferir a Galeria só no tema claro: o texto escuro some no tema escuro e ninguém percebe
:::

---

## Resumo

:::summary
- Componentes compostos, como `Cartao.Cabecalho` e `Cartao.Corpo`, trocam uma pilha de props por peças que a tela combina
- Tamanhos `sm`, `md` e `lg` saem dos tokens, com os mesmos nomes em todo o kit
- O `Botao` completo junta dois mapas, variante e tamanho, com `icone`, `desabilitado`, `style` e `...rest`
- `src/components/ui/index.js` reexporta o kit; a `Galeria` mostra todas as variantes nos dois temas
- Os nomes descrevem o papel; a aparência mora nos mapas e nos tokens
:::

---

## :icon[flask-conical] No laboratório

Complete o UI kit e monte a `Galeria`.

:::steps
1. Em `tokens.js`, acrescente a cor `alerta` aos dois temas
2. Em `src/components/ui/`, termine `Botao`, `Cartao` (com `Cabecalho` e `Corpo`), `Badge`, `Avatar`, `Campo` e `Divisor`
3. Crie `src/components/ui/index.js` reexportando os seis
4. Crie `src/telas/Galeria.js` com todas as variantes e exiba-a no `App.js`
5. Confira os dois temas no celular, faça o commit "E33: UI kit e Galeria" e o `git push`
:::

**Critérios**: peças com `style` e `...rest`; nenhuma cor fora dos tokens; Galeria legível nos dois temas. Entregue o link do repositório no sistema.

**Para casa**: refaça o `CartaoProduto` com o kit e em pé, imagem em cima (`width: '100%'`, `aspectRatio: 1`), para a grade do E34.

---

## :icon[milestone] Projeto 6 · Etapa 4: UI kit e CartaoCasa

No seu repositório `casas-de-adocao`:

- `src/components/ui/` com `Botao`, `Cartao`, `Badge` e `Campo`, todos com `style` e `...rest`, e o `index.js`
- `situacao`, `textoDaSituacao` e `tomDaSituacao` em `src/regras/casas.js`
- `src/components/CartaoCasa.js` montado com o kit: foto, nome, bairro, cidade e o selo de vagas ("Lotada", "Últimas 2 vagas", "8 vagas")
- a Início com as 12 casas e um `Botao` "Nova casa"
- nenhuma cor fora do `tokens.js`, com `alerta` nos dois temas

Commit: `Projeto 6: etapa 4, UI kit e CartaoCasa`. Enunciado completo e entrega: página do curso, em **Projetos**.
