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

Programador Mobile: Módulo Específico · Encontro E20 · Aula 21 de 71

---

## O que você vai aprender

:::goal
- Entender como o trabalho de design chega até você
- Ler medidas, cores, fontes, espaçamentos e estados em um protótipo
- Traduzir o desenho em tokens, rotas e componentes do UI kit
- Entregar a tela com o checklist: estados, acessibilidade, temas e tamanhos
:::

---

## Por que isso importa

Você entra na equipe de um banco digital. Na segunda-feira chega o link do Figma da nova tela **Perfil** e a tarefa: "implementar até sexta".

Você monta no olho: `padding: 15` aqui, `18` ali, um roxo copiado da imagem que sai quase igual ao da marca. Na revisão, o designer aponta doze diferenças. O teste abre o app no tema escuro e o nome some. Um cliente com fonte grande vê o e-mail cortado.

:::question
Como transformar um desenho em código que fica igual ao protótipo e não quebra no que o desenho não mostra?
:::

---

## :icon[route] Como o trabalho chega até você

| Etapa | Quem | O que entrega |
|---|---|---|
| Descoberta | produto | o problema e quem vai usar |
| Wireframe | design | caixas cinza: o que vai em cada tela |
| Protótipo | design | telas finais no Figma, com fluxo clicável |
| Implementação | você | as telas em código, ligadas aos dados |
| Revisão | design e testes | diferenças e bugs para ajustar |

**Protótipo** é o desenho de alta fidelidade: cores, fontes e medidas finais, quase igual ao app. A passagem do design para o código chama-se **handoff**.

No E10 você partiu de um wireframe. Hoje parte do protótipo.

---

## :icon[user] Exemplo: o protótipo da tela Perfil

Um frame de 390 por 844, tema claro, margem lateral de 16:

:::center
![Protótipo da tela Perfil com as medidas de cada elemento e dos espaços entre eles](images/e20-prototipo-perfil.svg)
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

## :icon[search] O que ler em um protótipo

No Figma, selecione um elemento e veja o painel de inspeção. Com <kbd>Alt</kbd> pressionado, o mouse sobre outro elemento mostra a distância.

| O que ler | Onde aparece | Na tela Perfil |
|---|---|---|
| Medidas | largura e altura (W, H) | avatar 72 por 72 |
| Espaçamentos | distância entre camadas | 16 entre avatar e nome |
| Cores | hex ou nome do estilo | `#475569`, "Texto suave" |
| Tipografia | família, peso, tamanho | Inter Bold 20 |
| Estados | variantes do componente | botão normal, pressionado, desabilitado |

Frame em 1x: **1 px do protótipo vale 1 ponto** no React Native, sem conversão. O avatar de 72 é o `tamanho="lg"` do kit.

---

## :icon[sliders-horizontal] No protótipo, no código: tokens

Copie a **intenção**, não o número. Hex e números soltos ignoram o tema escuro e espalham valores que ninguém lembra de atualizar.

| No protótipo | No código |
|---|---|
| `#6D28D9`, estilo "Primária" | `cores.primaria` |
| `#475569`, estilo "Texto suave" | `cores.textoSuave` |
| espaço 16 | `espaco.md` |
| espaço 24 | `espaco.lg` |
| Inter Bold 20 | `familia.negrito` e `fonte.titulo` |
| raio 12 | `raio.md` |

:::tip Número fora da escala
Viu 15, 18 ou 22? Use o token mais próximo e confirme com o designer. Quase sempre é descuido no desenho, não intenção.
:::

---

## Pratique

:::example Desafio
Traduza cada valor do inspetor para o código da Lojinha:

1. Nome do produto em `#0F172A`, estilo "Texto"
2. Espaço de 15 entre o cartão e o botão
3. Título da página em Inter Bold 28
4. Linha da lista com 56 de altura
:::

:::tip Resposta
1. `{ color: cores.texto }`, no array de estilos, para mudar com o tema
2. `marginTop: espaco.md`: 15 vira 16, o token mais próximo
3. `fontFamily: familia.negrito` e `fontSize: fonte.destaque`
4. `minHeight: 56`, não `height`: com fonte grande, a linha cresce em vez de cortar o texto
:::

---

## :icon[layers] Telas viram rotas

Cada frame é uma tela. As setas do modo protótipo mostram como se chega nela, e isso define o tipo de rota.

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

## :icon[component] Elementos viram componentes do UI kit

| Elemento no protótipo | Componente | Props |
|---|---|---|
| Foto redonda ou iniciais | `Avatar` | `nome`, `uri`, `tamanho="lg"` |
| Bloco branco arredondado | `Cartao` | `children` |
| Linha cinza entre opções | `Divisor` | `style` só para a margem |
| Linha com ícone, texto e seta | `OpcaoPerfil` | `icone`, `titulo`, `onPress` |
| "Sair" roxo sem fundo | `Botao` | `variante="fantasma"`, `icone` |

Antes de criar um componente, procure no UI kit. `OpcaoPerfil` só existe nesta tela, então fica no próprio `Perfil.js`. Se aparecer em outra tela, vai para `src/components/ui/`.

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

## :icon[list-checks] Checklist de entrega de tela

Antes de dizer "pronto", passe a tela por estes itens. Eles cobrem o que o protótipo não diz.

- :icon[hourglass] **4 estados**: carregando, erro, vazio e com dados. Force cada um à mão, como a `CHANCE_DE_ERRO = 1` do E19
- :icon[eye] **Acessibilidade**: TalkBack ou VoiceOver lê cada elemento com rótulo e papel; toques de 44 por 44; fonte em 200% sem cortar
- :icon[sun] **2 temas**: claro e escuro, sem nenhuma cor fixa no código
- :icon[smartphone] **2 tamanhos**: celular pequeno e tablet (ou celular deitado), com o nome mais longo que você imaginar
- :icon[check-check] **Fidelidade**: lado a lado com o protótipo, cada medida virou token

Faltou algum? Anote no README o que ficou pendente.

---

## :icon[file-code] Perfil.js: o topo

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

- `i > 0 &&` põe a linha cinza só **entre** as opções, como no desenho
- O `Divisor` do kit tem margem vertical de 16; aqui a linha de 56 já dá o respiro, então a margem sai
- Quatro itens fixos dentro de uma `ScrollView`: `map` basta, sem `FlatList`

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

`flex: 1` no texto empurra a seta para a direita e faz um título longo quebrar linha, em vez de jogar a seta para fora da tela.

---

## :icon[search] Fonte grande: minHeight, não height

:::center
![Animação: a fonte vai ao máximo e o título Meus pedidos quebra em duas linhas; com height: 56 a linha corta o texto, com minHeight: 56 a linha cresce](images/e20-fonte-grande.svg)
:::

O protótipo mostra só a fonte padrão. Com a fonte do celular no máximo, o título cresce e o `flex: 1` o quebra em duas linhas. Com `height: 56`, a linha fica presa e corta o texto; com `minHeight: 56`, ela cresce junto.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Copiar hex e números do inspetor direto no `StyleSheet`: o tema escuro quebra e a escala vira bagunça
- Medir num frame em 2x e usar o valor como está: tudo sai com o dobro do tamanho
- Fixar `height` em linhas e cartões com texto: com fonte grande, o texto corta. Use `minHeight` e `padding`
- Criar um `BotaoSair` com estilo próprio quando o `Botao` do kit já tem a variante
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

Na aula 22, a revisão de layout e componentes:

- :icon[map] um slide por tema, do Flexbox às animações
- :icon[circle-help] cinco questões comentadas no estilo da prova
- :icon[flask-conical] o laboratório: a tela Perfil completa e o commit "v1 Lojinha"

Depois, a **Prova 1** do módulo específico, no sistema.
