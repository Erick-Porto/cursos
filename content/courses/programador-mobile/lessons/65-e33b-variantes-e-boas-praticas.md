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

## O cartão que queria ser tudo

Num app de delivery, quase tudo é cartão: o restaurante (nome, nota, selo "Entrega grátis"), o pedido (número, status, itens, botão "Acompanhar") e o cupom (código e validade).

A equipe tentou resolver com props: `titulo`, `subtitulo`, `selo`, `icone`, `itens`, `textoBotao`, `onBotao`, `rodape`. Oito props, metade nunca usadas juntas, e o cartão do cupom ainda não coube.

:::question
Como o `Cartao` pode aceitar conteúdos tão diferentes sem ganhar uma prop para cada um?
:::

---

## :icon[component] Componentes compostos

Um **componente composto** é uma família de peças que trabalham juntas: o pai desenha a moldura e os filhos desenham as partes. Quem usa monta como quiser.

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

O selo segue as regras do E13: para um pedido `'enviado'`, `textoDoStatus` devolve `'A caminho'` e `tomDoStatus`, `'neutro'`.

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

## :icon[arrow-up-down] Tamanhos sm, md e lg

Três tamanhos bastam para quase todo app. As medidas saem dos tokens; só a altura é nova, e o `md` fica em 44, a área de toque confortável.

| Tamanho | Altura mínima | Padding lateral | Fonte | Ícone |
|---|---|---|---|---|
| `sm` | 36 | `espaco.md` (16) | `fonte.pequena` (12) | 16 |
| `md` | 44 | `espaco.lg` (24) | `fonte.corpo` (16) | 20 |
| `lg` | 56 | `espaco.xl` (32) | `fonte.titulo` (20) | 24 |

O `Avatar` usa os mesmos nomes: `sm` 32, `md` 48, `lg` 72. Mesma prop e mesmos valores em todo o kit: quem aprendeu um componente já sabe usar os outros.

---

## :icon[mouse-pointer-click] Botao completo: os dois mapas

Um mapa de tamanho, fixo e tirado dos tokens, e um mapa de variante, que depende do tema e por isso é uma função de `cores`.

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

Na `primaria`, o texto usa `cores.fundo`: claro sobre a cor primária no tema claro, escuro no tema escuro. O contraste funciona nos dois.

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

## :icon[keyboard] Campo: rótulo e entrada

Por enquanto o `Campo` é só visual: a validação e a mensagem de erro chegam no E35.

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

```jsx
export default function Divisor({ style, ...rest }) {
  const { cores } = useTema();
  return <View style={[estilos.divisor, { backgroundColor: cores.borda }, style]} {...rest} />;
}

const estilos = StyleSheet.create({
  divisor: { height: StyleSheet.hairlineWidth, marginVertical: espaco.md },
});
```

**`StyleSheet.hairlineWidth`** é a linha mais fina que a tela do aparelho consegue desenhar.

Parece pouco para virar componente. Sem ele, cada tela inventa sua linha: uma com altura 1, outra com 2, uma cinza, outra da cor da borda. Uma peça pequena também é do kit: o que conta é o padrão, não o tamanho do código.

---

## :icon[folder-tree] A pasta ui e o arquivo índice

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

É o barril do E11: cada arquivo continua com `export default`, e `export { default as ... }` dá um nome a cada um. Na tela, um import só:

```jsx
import { Botao, Cartao, Badge } from '../components/ui';
```

No Node, importar a pasta dava `ERR_UNSUPPORTED_DIR_IMPORT` e o `.js` era obrigatório. No app, o empacotador do Expo (o Metro, que o `-c` do E28 limpa) procura o `index.js` da pasta e dispensa a extensão.

---

## :icon[book-open] Galeria: a documentação viva

`src/telas/Galeria.js` mostra **todas as variantes** do kit, com um botão para trocar o tema. Quem chega à equipe abre a Galeria antes de criar uma peça nova; quem muda o `Botao` vê o efeito em todas as combinações.

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
**TypeScript**, do E12, sublinha o erro no editor antes de o app rodar: é a união de valores do `StatusPedido`. É o padrão do mercado para UI kits.

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

## :icon[lightbulb] Nomeie pelo papel, não pela aparência

| Evite | Prefira | Por quê |
|---|---|---|
| `variante="verde"` | `variante="primaria"` | a marca pode mudar de cor |
| `tom="vermelho"` | `tom="perigo"` | diz o significado, não o pigmento |
| `BotaoGrande` | `<Botao tamanho="lg">` | um componente, uma prop |
| `CartaoBranco` | `Cartao` | no tema escuro ele não é branco |
| `tamanho={44}` | `tamanho="md"` | a medida mora no kit, não na tela |

O nome descreve a decisão de produto. A aparência mora nos mapas e nos tokens, onde pode mudar sem quebrar nenhuma tela.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Esquecer `Cartao.Corpo = Corpo`: a tela vermelha diz `Element type is invalid` e `got: undefined`
- Escrever `export { Botao } from './Botao'` no índice quando o arquivo usa `export default`: o import chega `undefined`
- Desabilitar só no visual, com `opacity`, e esquecer o `disabled`: o botão apagado continua respondendo ao toque
- Errar o nome da variante, como `variante="primario"`: o mapa devolve `undefined` e o app quebra
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
