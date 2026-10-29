---
title: Tema claro e escuro
summary: Leia o tema do sistema, troque a paleta com TemaProvider e useTema e teste o app nos dois temas.
module: layout-rn
duration_minutes: 40
objectives:
  - Ler o tema do sistema com useColorScheme
  - Montar uma paleta escura legível com os mesmos tokens da clara
  - Aplicar o tema às telas com TemaProvider e useTema
  - Testar uma tela nos temas claro e escuro
---

# Tema claro e escuro

Programador Mobile · Encontro E31 · Aula 61 de 89

---

## O que você vai aprender

:::goal
- Ler o tema do sistema com `useColorScheme` e liberar o `app.json` para segui-lo
- Montar uma paleta escura legível, com os mesmos nomes de token da clara
- Entregar as cores da vez a qualquer tela com `TemaProvider` e `useTema()`
- Alternar o tema por um botão e testar a tela nos dois temas
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **tema** | o jeito do app na tela: claro, com fundo branco, ou escuro, com fundo quase preto |
| **paleta** | as cores de um tema, cada uma com o seu papel: fundo, texto, borda |
| **contraste** | a diferença de claridade entre o texto e o fundo; quanto maior, mais fácil de ler |
| **contexto** (*Context*) | um quadro de avisos do React: um valor que todas as telas leem, sem passar por props |
| **provedor** (*Provider*) | o componente que pendura o valor no quadro para quem está dentro dele |

---

## Meia-noite, tela branca

São 23h, quarto escuro, celular no tema escuro. Você abre o app do banco para conferir um Pix e a tela explode em branco: o app ignorou a escolha do sistema.

Android e iOS deixam cada pessoa escolher entre tema claro e escuro, e muita gente deixa o escuro ligado o tempo todo ou programado para a noite. Apps de banco, de mensagens e de compras acompanham essa escolha; o que não acompanha parece abandonado.

:::question
A `Inicio` da Lojinha usa `cores.claro` em todos os estilos. O que precisa mudar para ela acompanhar o celular?
:::

---

## Tema do sistema

Onde você liga o tema escuro do seu celular?

---

## :icon[smartphone] useColorScheme: o tema do sistema

O **tema do sistema** é a escolha que a pessoa faz nas configurações do celular: claro ou escuro. O hook **`useColorScheme`** (*color scheme*, esquema de cores), do `react-native`, pergunta ao celular qual está ligado e devolve `'light'` (claro) ou `'dark'` (escuro). Quando a pessoa troca nas configurações, o componente redesenha com o valor novo.

```jsx
import { Text, useColorScheme } from 'react-native';

export default function Teste() {
  const esquema = useColorScheme();
  return <Text>Tema do sistema: {esquema}</Text>;
}
```

Na tela: "Tema do sistema: light". Troque o celular para o tema escuro e o texto vira "dark", sem recarregar o app.

:::warning
O texto continua "light" com o celular no escuro? O culpado está no `app.json`.
:::

---

## :icon[braces] app.json: deixe o app seguir o sistema

O template `blank` cria o projeto preso ao tema claro, com `"userInterfaceStyle": "light"`. Assim, o app avisa ao sistema que só fala claro, e `useColorScheme` devolve sempre `'light'`. Troque por **`"automatic"`** (automático):

```json
{
  "expo": {
    "name": "lojinha",
    "slug": "lojinha",
    "userInterfaceStyle": "automatic"
  }
}
```

| Valor | O app recebe |
|---|---|
| `"light"` | sempre `'light'` |
| `"dark"` | sempre `'dark'` |
| `"automatic"` | o tema escolhido no celular |

Mudou o `app.json`? Pare o servidor e rode `npx expo start -c`.

---

## Paleta escura

Para o tema escuro, você troca a etiqueta do pote ou a tinta de dentro?

---

## :icon[sliders-horizontal] Duas paletas, os mesmos nomes

Uma **paleta** é o conjunto de cores de um tema. Lembre a paleta de tintas da aula 60: as duas paletas têm os mesmos potes, com as mesmas etiquetas; só muda a tinta dentro.

`cores.claro` e `cores.escuro`, em `tokens.js`, têm as mesmas 8 chaves:

```javascript
cores.claro.superficie   // '#ffffff', branco
cores.escuro.superficie  // '#1e293b', um cinza-azulado escuro
```

O componente pede `cores.superficie` e não precisa saber qual paleta está ativa: quem escolhe a paleta da vez é o tema.

---

## :icon[columns-3] As duas paletas lado a lado

| Token | Claro | Escuro |
|---|---|---|
| `fundo` | `#f8fafc`, quase branco | `#0f172a`, quase preto |
| `superficie` | `#ffffff`, branco | `#1e293b`, um degrau acima do fundo |
| `texto` | `#0f172a` | `#f1f5f9` |
| `textoSuave` | `#475569` | `#94a3b8` |
| `primaria` | `#6d28d9`, roxo forte | `#a78bfa`, roxo claro |
| `borda` | `#e2e8f0` | `#334155` |

No escuro, a superfície é **mais clara** que o fundo: ela faz o papel da sombra, que quase não aparece sobre fundo escuro. `perigo` e `sucesso` também ficam mais claros no escuro.

---

## Contraste

Qual placa você lê de longe: letra branca no azul ou cinza no cinza?

---

## :icon[eye] Contraste: legível nos dois temas

**Contraste** é a diferença de claridade entre texto e fundo. Pense numa placa de rua: letra branca no fundo azul se lê de longe; letra cinza no fundo cinza, não. Ele se mede em números: 1 : 1 é invisível; 21 : 1 é preto no branco. Texto comum pede pelo menos **4,5 : 1** (detalhes no E38).

| Par | Claro | Escuro |
|---|---|---|
| `texto` sobre `superficie` | 17,9 : 1 | 13,4 : 1 |
| `textoSuave` sobre `superficie` | 7,6 : 1 | 5,7 : 1 |
| `primaria` sobre `superficie` | 7,1 : 1 | 5,4 : 1 |

---

## :icon[eye] Contraste na prática

**Caso 1: o cinza do claro no cartão escuro.**

```jsx
<View style={{ backgroundColor: cores.escuro.superficie }}>
  <Text style={{ color: cores.claro.textoSuave }}>Áudio</Text>
</View>
```

Na tela: "Áudio" quase some. O `#475569` do claro sobre a superfície escura dá 1,9 : 1.

**Caso 2: o cinza da paleta escura.** Troque `cores.claro.textoSuave` por `cores.escuro.textoSuave`: 5,7 : 1, dá para ler de longe.

No escuro, cuide também de:

- **Borda visível**: escura demais, some; a do claro (`#e2e8f0`) vira um risco berrante
- **Sem preto e branco puros**: cansam a vista

---

## Contexto

Como avisar todo mundo da casa sem falar com cada um?

---

## :icon[file-code] TemaContext.js: o provedor

O tema precisa chegar a todas as telas. Em vez de passar `cores` por props de componente em componente, use um **contexto** (*Context*): o quadro de avisos da casa, que todos os cômodos leem. A receita fica em `src/theme/TemaContext.js`:

```jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { cores, espaco, fonte, raio } from './tokens';

const TemaContext = createContext(null);

export function TemaProvider({ children }) {
  const sistema = useColorScheme(); // 'light' ou 'dark'
  const [escuro, setEscuro] = useState(sistema === 'dark');

  // a pessoa trocou o tema no celular: o app acompanha
  useEffect(() => {
    setEscuro(sistema === 'dark');
  }, [sistema]);
```

`useState` e `useEffect` são os do E23 e do E24. O Context é explicado linha a linha no E42; por enquanto, copie e use como receita.

---

## :icon[file-code] TemaContext.js: o valor e o useTema

Continuação do mesmo arquivo:

```jsx
  function alternarTema() {
    setEscuro(!escuro);
  }

  const valor = {
    cores: escuro ? cores.escuro : cores.claro,
    espaco, fonte, raio, escuro, alternarTema,
  };
  return <TemaContext.Provider value={valor}>{children}</TemaContext.Provider>;
}

export function useTema() {
  return useContext(TemaContext);
}
```

- `cores` já é a paleta da vez; os outros tokens vêm junto
- `escuro` diz qual tema está ativo; `alternarTema` troca para o outro
- `useTema()` é o que as telas chamam para ler tudo isso

O `TemaProvider` pendura o aviso no quadro, e cada componente que chama `useTema()` lê o quadro. Mudou o tema, todos redesenham.

---

## :icon[list-ordered] TemaContext.js em português

| Linha | O que ela diz |
|---|---|
| `createContext(null)` | "crie o quadro de avisos, ainda vazio" |
| `TemaProvider({ children })` | "um componente que envolve outros"; `children` (filhos) são os componentes de dentro |
| `useState(sistema === 'dark')` | "comece escuro se o celular estiver escuro" |
| `useEffect(..., [sistema])` | "quando o tema do celular mudar, acompanhe" |
| `setEscuro(!escuro)` | "troque para o contrário": o `!` vira `true` em `false` e `false` em `true` |
| `value={valor}` e `useContext(TemaContext)` | "pendure o valor no quadro" e "leia o quadro" |

---

## :icon[component] Envolva o app com o TemaProvider

`useTema()` só funciona em componentes **dentro** do `TemaProvider`: só quem está na casa lê o quadro. Por isso ele envolve a tela no `App.js`:

```jsx
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TemaProvider } from './src/theme/TemaContext';
import Inicio from './src/telas/Inicio';

export default function App() {
  return (
    <SafeAreaProvider>
      <TemaProvider>
        <Inicio />
      </TemaProvider>
    </SafeAreaProvider>
  );
}
```

Nos próximos encontros, quando você trocar a `<Inicio />` por outra tela à mão, ela continua dentro do `TemaProvider` e recebe o tema sem nenhuma linha a mais.

---

## Pense

:::question
O `TemaProvider` está ligado e o celular foi para o tema escuro. O fundo da tela escureceu, mas os cartões continuaram brancos. O estilo do cartão:

```jsx
const estilos = StyleSheet.create({
  cartao: { padding: espaco.md, backgroundColor: cores.claro.superficie },
});
```

Por que o cartão não acompanhou o tema? Resolve trocar `cores.claro` por `useTema().cores` aí dentro?
:::

:::tip Resposta
`StyleSheet.create` roda **uma vez**, quando o arquivo carrega, fora de qualquer componente: ele nunca fica sabendo que o tema mudou. E `useTema()` ali não funciona, porque hooks só podem ser chamados dentro de um componente. A cor precisa sair do `StyleSheet`.
:::

---

## Cor no array

Se o estilo é calculado uma vez só, como ele acompanha o tema?

---

## :icon[layers] Estrutura no StyleSheet, cor no array

O `StyleSheet.create` roda uma vez só, quando o arquivo carrega. Pense na parede e na tinta: a parede é construída uma vez; a tinta você troca quando quiser, da paleta da vez. Por isso o padrão da Lojinha divide cada estilo em duas partes:

- **Estrutura** (layout, espaço, fonte, raio): não muda com o tema; fica no `StyleSheet`, com tokens importados de `tokens.js`
- **Cor**: muda com o tema; vem de `useTema()` e entra no array de `style`

O jeito de escrever: `style={[estilos.cartao, { backgroundColor: cores.superficie }]}`. O array soma os dois, primeiro a estrutura e depois a cor.

---

## :icon[layers] Cor no array na prática

Três peças do cartão de produto: o cartão (caso 1), o nome (caso 2) e a categoria (caso 3).

```jsx
// dentro da Inicio, que começa com: const { cores } = useTema();
<View style={[estilos.cartao, { backgroundColor: cores.superficie, borderColor: cores.borda }]}>
  <Text style={[estilos.nome, { color: cores.texto }]}>{produto.nome}</Text>
  <Text style={[estilos.categoria, { color: cores.textoSuave }]}>{produto.categoria}</Text>
</View>
```

```jsx
const estilos = StyleSheet.create({
  cartao: { flexDirection: 'row', padding: espaco.md, borderRadius: raio.md, borderWidth: 1 },
  nome: { fontSize: fonte.corpo, fontWeight: 'bold' },
  categoria: { fontSize: fonte.pequena },
});
```

Na tela: no claro, cartão branco com nome quase preto e categoria cinza; no escuro, cartão cinza-azulado com nome quase branco. O `StyleSheet` é o mesmo: só a cor do array mudou.

---

## Botão de tema

E se a pessoa quiser o tema escuro mesmo de dia?

---

## :icon[mouse-pointer-click] Botão alternar tema

Além de seguir o sistema, a pessoa pode querer escolher. `useTema()` entrega `escuro` e `alternarTema`:

```jsx
const { cores, escuro, alternarTema } = useTema();

<Pressable
  onPress={alternarTema}
  style={[estilos.botaoTema, { borderColor: cores.primaria }]}
>
  <Text style={[estilos.textoBotao, { color: cores.primaria }]}>
    {escuro ? 'Tema claro' : 'Tema escuro'}
  </Text>
</Pressable>

<StatusBar style={escuro ? 'light' : 'dark'} />
```

::::columns
:::col
![Animação: o toque em Tema escuro chama alternarTema, escuro vira true e a tela passa de cores.claro para cores.escuro; o botão passa a dizer Tema claro](images/e31-troca-de-tema.svg)
:::
:::col
Na tela: um botão de contorno roxo no cabeçalho. Toque e a tela inteira troca de paleta; o botão passa a oferecer o tema oposto. A `StatusBar`, de `expo-status-bar`, acompanha: `'light'` deixa relógio e bateria claros sobre o fundo escuro.
:::
::::

---

## Imagens no escuro

Um logo preto sobre um fundo preto aparece?

---

## :icon[image] Imagens e ícones no tema escuro

As cores vêm dos tokens, mas imagens têm cor própria e não mudam sozinhas:

- **Logo ou ícone em PNG preto** some no fundo escuro. Se a imagem tem uma cor só, `tintColor` (cor de tingir) repinta os pixels: `style={{ tintColor: cores.texto }}` no `Image`
- **Ícones vetoriais**, desenhados por linhas e não por pixels, recebem a cor por prop: passe um token, como `color={cores.textoSuave}`
- **Foto de produto com fundo branco** brilha demais no escuro: o cartão com `borda` e cantos arredondados emoldura a foto
- **Caixa reservada da imagem**, enquanto ela carrega, usa `cores.borda`, nunca `'#ccc'`

Teste com as imagens reais: o que fica bonito no claro pode sumir no escuro.

---

## :icon[list-checks] Teste nos dois temas

Toda tela é testada duas vezes. Para trocar o tema do celular:

- **Android**: Configurações, Tela (ou Visor), Tema escuro; ou o atalho na barra de notificações
- **iOS**: Ajustes, Tela e Brilho, Escuro; ou a Central de Controle

Confira nos dois temas:

:::steps
1. Todo texto é legível, inclusive o `textoSuave`
2. Bordas e divisórias aparecem, sem virar riscos berrantes
3. Nenhum bloco ficou branco no escuro: sinal de cor literal
4. Relógio e bateria aparecem na barra de status
5. O botão alterna, e a troca pelo sistema com o app aberto também funciona
:::

---

## Mensagens de erro

Quando acende uma luz no painel do carro, o que você faz?

---

## :icon[siren] Quando aparece um erro

A mensagem é a luz do painel do carro: diz o que aconteceu e onde. Leia a primeira linha da tela vermelha.

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Cannot read property 'cores' of null` | `useTema()` fora do `TemaProvider`, como no próprio `App` | chamar `useTema()` só nas telas de dentro |
| `Too many re-renders` | `onPress={alternarTema()}`: com parênteses, a função roda ao desenhar, e de novo, e de novo | sem parênteses: `onPress={alternarTema}` |

---

## :icon[eye-off] Erros de cor, sem mensagem

O app roda, mas a cor sai errada. Confira o que você vê:

| O que você vê | Por quê | O que fazer |
|---|---|---|
| o texto continua "light" com o celular no escuro | `"userInterfaceStyle": "light"` no `app.json` | `"automatic"` e `npx expo start -c` |
| o fundo escureceu, o cartão ficou branco | cor no `StyleSheet.create`, ou `cores.claro` no array | a cor do `useTema()`, no array |
| relógio e bateria somem no escuro | `<StatusBar style="dark" />` fixo | `style={escuro ? 'light' : 'dark'}` |
| texto suave ilegível no escuro | o `textoSuave` do claro copiado para o escuro | um cinza mais claro, como `#94a3b8` |

---

## Resumo

:::summary
- `useColorScheme` devolve `'light'` ou `'dark'`, desde que o `app.json` tenha `"userInterfaceStyle": "automatic"`
- `cores.claro` e `cores.escuro` têm as mesmas chaves; no escuro, superfície acima do fundo e texto suave ainda legível
- `TemaProvider` envolve o app, como o quadro de avisos da casa; `useTema()` entrega as `cores` da vez, os outros tokens, `escuro` e `alternarTema`
- Estrutura no `StyleSheet`, cor no array: `style={[estilos.cartao, { backgroundColor: cores.superficie }]}`
- Toda tela é testada nos dois temas, com imagens, ícones e barra de status
:::

---

## :icon[flask-conical] No laboratório

Leve a `Inicio` do E30 para tokens e tema claro e escuro.

:::steps
1. Crie `src/theme/tokens.js` e `src/theme/TemaContext.js` com as receitas das duas aulas do E31
2. No `App.js`, o `TemaProvider` envolve a `<Inicio />`; no `app.json`, `"userInterfaceStyle": "automatic"`
3. Refatore a `Inicio`: medidas por token no `StyleSheet`, cores de `useTema()` no array
4. No cabeçalho, um botão chama `alternarTema`; a `StatusBar` acompanha o tema
5. Teste no celular: sistema claro, sistema escuro e botão
6. `git add .`, `git commit -m "E31: tokens e tema"` e `git push`
:::

**Critérios de entrega**: nenhum `#` em `src/telas`; espaços, fontes e raios da `Inicio` vêm dos tokens; os dois temas legíveis; o app segue o sistema e o botão. Entregue o link do repositório no sistema.

---

## :icon[milestone] Projeto 6 · Etapa 2: tokens e tema

No seu repositório `casas-de-adocao`:

- `src/theme/tokens.js` com a **sua** paleta (não a da Lojinha) nos dois temas, mais espaço, fonte e raio
- o `TemaContext.js` da aula e `"userInterfaceStyle": "automatic"` no `app.json`
- Início sem nenhuma cor literal: estrutura no `StyleSheet`, cor do `useTema()` no array
- botão de tema no cabeçalho, com a `StatusBar` acompanhando
- no README, o contraste de `textoSuave` e `primaria` sobre `superficie` nos dois temas: no mínimo 4,5 : 1

Commit: `Projeto 6: etapa 2, tokens e tema`. Enunciado completo e entrega: página do curso, em **Projetos**.
