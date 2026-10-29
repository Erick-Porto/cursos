---
title: Estados de carregamento, vazio e erro
summary: Projete os 4 estados de toda tela com esqueleto, vazio com ação, erro com nova tentativa e toast.
module: layout-rn
duration_minutes: 40
objectives:
  - Projetar os 4 estados de uma tela (carregando, vazio, erro e conteúdo)
  - Criar esqueleto, estado vazio e estado de erro reutilizáveis no UI kit
  - Simular a espera e a falha da rede com uma Promise, async e try/catch
  - Confirmar uma ação com um toast animado
---

# Estados de carregamento, vazio e erro

Programador Mobile · Encontro E39 · Aula 77 de 89

---

## O que você vai aprender

:::goal
- Reconhecer os 4 estados de toda tela: carregando, vazio, erro e conteúdo
- Mostrar o carregamento com `ActivityIndicator` e com um esqueleto que pulsa
- Criar `EstadoVazio` e `EstadoErro` com uma ação para o usuário seguir
- Simular a busca dos produtos com uma `Promise` que às vezes falha
- Confirmar uma ação com um toast "Adicionado ao carrinho"
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **estado de tela** | a situação em que a tela está: carregando, vazia, com erro ou com conteúdo |
| **esqueleto** (*skeleton*) | blocos cinza com a forma do conteúdo que ainda vai chegar |
| **estado vazio** | a busca deu certo, mas não há nada para mostrar |
| **simular** | imitar de propósito: aqui, imitar a espera e a falha da internet |
| **toast** | aviso curto que surge no rodapé e some sozinho, como a torrada que salta da torradeira (*toast*, em inglês) |

---

## A tela branca no metrô

Você abre o app do banco no metrô, com sinal fraco. A tela do extrato fica branca.

Está carregando? Você não teve movimentações no mês? O app quebrou? Sem resposta, você fecha e abre o app três vezes, e desiste.

A tela foi pensada só para o dia bom: internet rápida e dados prontos. Em todos os outros momentos, ela fica muda.

:::question
Em quantas situações diferentes uma tela de lista pode estar, do momento em que abre até mostrar os itens?
:::

---

## Os 4 estados

No painel da lanchonete, o que aparece ao lado da sua senha?

---

## :icon[layout-grid] Os 4 estados de toda tela

Toda tela que busca dados passa por **estados**. Pense no painel de pedidos da lanchonete: ele sempre diz em que pé está o seu pedido, preparando, pronto ou cancelado. Nunca fica apagado. A tela também não pode ficar muda.

| Estado | Quando | O que mostrar |
|---|---|---|
| Carregando | os dados ainda não chegaram | esqueleto ou indicador |
| Vazio | chegou, mas não há nada | mensagem e uma ação |
| Erro | a busca falhou | o que houve e "Tentar novamente" |
| Conteúdo | dados prontos | a tela de verdade |

Muita tela é feita só para o último. Os outros três ficam por sua conta.

---

## :icon[layout-grid] Os 4 estados na prática

| Estado | Na Lojinha |
|---|---|
| Carregando | o Início, no primeiro 1,5 segundo |
| Vazio | o carrinho sem itens |
| Erro | sem conexão |
| Conteúdo | a grade de produtos |

No E24, o Minhas Tarefas já tratava `carregando` e `erro`. Agora carregando, vazio e erro viram componentes do UI kit, prontos para qualquer tela.

:::tip
Antes de codar, desenhe os quatro estados no papel: estado em branco no papel é decisão que falta.
:::

---

## Carregando

Você toca em Enviar e nada muda. Está carregando ou travou?

---

## :icon[hourglass] ActivityIndicator no EstadoCarregando

**Carregando** é o estado da espera: os dados estão a caminho. O **`ActivityIndicator`** é a ampulheta do app, o indicador de carregamento nativo: um círculo girando no Android, traços em roda no iOS.

```jsx
// imports de react-native, do tema e dos tokens omitidos
export default function EstadoCarregando({ mensagem = 'Carregando...' }) {
  const { cores } = useTema();
  return (
    <View style={[estilos.centro, { backgroundColor: cores.fundo }]}>
      <ActivityIndicator size="large" color={cores.primaria} />
      <Text style={[estilos.mensagem, { color: cores.textoSuave }]}>{mensagem}</Text>
    </View>
  );
}
```

- `mensagem = 'Carregando...'`: o texto padrão, quando ninguém manda outro
- `size`: `'small'` (padrão) ou `'large'`
- `color`: a primária do tema, visível nos dois temas

---

## :icon[hourglass] Carregando na prática

Três esperas, três jeitos de mostrar:

```jsx
// 1. A tela inteira espera, sem forma conhecida
<EstadoCarregando />
// na tela: a roda girando e "Carregando...", no meio

// 2. A mesma espera, com um texto que diz o quê
<EstadoCarregando mensagem="Buscando seus pedidos..." />
// na tela: a roda e "Buscando seus pedidos..."

// 3. Uma espera pequena, dentro de um pedaço da tela
<ActivityIndicator size="small" color={cores.primaria} />
// na tela: uma roda pequena, como ao lado de "Buscando endereço..." no Projeto 6
```

O `ActivityIndicator` serve para esperas em área pequena ou de forma desconhecida: o envio de um formulário, o rodapé de uma lista.

---

## Esqueleto

O que o álbum de figurinhas mostra antes de você colar a figurinha?

---

## :icon[layers] Esqueleto: a forma antes do conteúdo

Um **esqueleto** (*skeleton*) desenha blocos cinza no lugar exato da imagem, do nome e do preço que vão chegar. É como o álbum de figurinhas: o espaço da figurinha já está lá, com o tamanho certo, antes de você colar. Lojas, redes sociais e apps de vídeo usam essa técnica.

```jsx
<View style={estilos.cartaoEsqueleto}>
  <Esqueleto altura={140} />              {/* a imagem */}
  <Esqueleto largura="70%" altura={16} /> {/* o nome */}
  <Esqueleto largura="40%" altura={16} /> {/* o preço */}
</View>
```

| | `ActivityIndicator` | Esqueleto |
|---|---|---|
| Mostra | que algo acontece | a forma do que vem |
| Espera percebida | parece mais longa | parece mais curta |
| Quando os dados chegam | a tela muda de layout | os blocos viram cartões no mesmo lugar |

---

## :icon[sparkles] Esqueleto pulsando com Animated.loop

Em `src/components/ui/Esqueleto.js`:

```jsx
// imports de react, react-native e do tema omitidos
export default function Esqueleto({ largura = '100%', altura = 16, style }) {
  const { cores, raio } = useTema();
  const opacidade = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const pulso = Animated.loop(Animated.sequence([
      Animated.timing(opacidade, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(opacidade, { toValue: 0.4, duration: 700, useNativeDriver: true }),
    ]));
    pulso.start();
    return () => pulso.stop();
  }, []);
  const forma = { width: largura, height: altura, borderRadius: raio.sm, backgroundColor: cores.borda };
  return <Animated.View style={[forma, { opacity: opacidade }, style]} />;
}
```

- `Animated.sequence`: clareia e depois escurece, uma animação depois da outra (aula 76)
- `Animated.loop` (*laço*): repete a sequência até alguém parar
- O `return` do efeito para o pulso quando o esqueleto sai da tela

Na tela: blocos cinza que respiram devagar, sinal de que algo está a caminho.

---

## :icon[sparkles] Esqueleto na prática

O mesmo `Esqueleto`, com medidas diferentes, desenha a forma de cada coisa:

```jsx
// 1. A foto de um cartão: largura toda, 140 de altura
<Esqueleto altura={140} />

// 2. Uma linha de texto curta, como o preço
<Esqueleto largura="40%" altura={16} />

// 3. O avatar redondo do Perfil, no E40
<Esqueleto largura={72} altura={72} style={{ borderRadius: 36 }} />
```

- Sem `largura`, vale o padrão `'100%'`; sem `altura`, `16`
- O `style` de fora muda a forma: com `borderRadius` igual à metade do lado, o quadrado vira círculo
- No Início, a `GradeEsqueleto` repete o cartão de esqueleto 6 vezes, em grade

---

## Pratique

:::example Desafio (3 minutos)
Para cada situação, diga o estado e o que a tela mostra:

1. Você busca "bicicleta" e nenhum produto tem esse nome
2. O app abre com o celular em modo avião
3. A tela Detalhe espera os dados do produto
4. A aba Favoritos de quem nunca favoritou nada
:::

:::tip Resposta
1. Vazio: "Nenhum produto para 'bicicleta'" e a ação "Limpar busca".
2. Erro: "Sem conexão", a mensagem do `pedir` do E19, e "Tentar novamente".
3. Carregando: esqueleto com a forma do Detalhe (imagem grande, título, preço).
4. Vazio, mas que ensina: "Toque no coração de um produto para guardá-lo aqui" e "Ver produtos".
:::

---

## Estado vazio

Prateleira vazia no mercado: o que ajuda mais, nada ou uma placa?

---

## :icon[package] EstadoVazio: vazio com uma saída

O **estado vazio** aparece quando a busca deu certo, mas não há nada. Pense na prateleira vazia do mercado: a boa tem uma placa, "Acabou. Temos no corredor 5". Uma tela vazia sem ação é um beco sem saída; o `EstadoVazio` diz o que aconteceu e oferece o próximo passo.

```jsx
// imports omitidos: react-native, Ionicons, useTema, tokens e Botao
export default function EstadoVazio({ icone = 'file-tray-outline', titulo, mensagem, textoAcao, onAcao }) {
  const { cores } = useTema();
  return (
    <View style={[estilos.centro, { backgroundColor: cores.fundo }]}>
      <Ionicons name={icone} size={56} color={cores.textoSuave} />
      <Text style={[estilos.titulo, { color: cores.texto }]}>{titulo}</Text>
      {mensagem ? <Text style={[estilos.mensagem, { color: cores.textoSuave }]}>{mensagem}</Text> : null}
      {textoAcao ? <Botao titulo={textoAcao} onPress={onAcao} /> : null}
    </View>
  );
}
```

- `mensagem` e `textoAcao` são opcionais: o `? :` só desenha o que veio; sem eles, `null`, que não desenha nada
- `estilos.centro` usa `flex: 1` e `justifyContent` e `alignItems` em `'center'`: tudo no meio da tela

---

## :icon[shopping-cart] Estado vazio na prática

**Caso 1: o carrinho vazio.** Em `src/telas/Carrinho.js`, o vazio vem antes da lista:

```jsx
import { router } from 'expo-router';
import { EstadoVazio } from '../components/ui'; // reexportado no index.js

export default function Carrinho() {
  const { itens } = useCarrinho();
  if (itens.length === 0) {
    return (
      <EstadoVazio icone="cart-outline" titulo="Seu carrinho está vazio"
        mensagem="Os produtos que você adicionar aparecem aqui."
        textoAcao="Ver produtos" onAcao={() => router.navigate('/')} />
    );
  }
  // a lista do carrinho continua como no E37
}
```

Na tela: um carrinho em cinza, o título, a explicação e "Ver produtos", que leva à aba Início (`router.navigate('/')`). Com o carrinho vazio, a função para no `return` e desenha só isso.

**Caso 2: só o título.** `<EstadoVazio titulo="Nenhum produto por aqui" />`: sem `mensagem` nem `textoAcao`, aparecem só o ícone padrão e o título.

---

## Estado de erro

Qual a pior mensagem de erro que você já viu num app?

---

## :icon[refresh-cw] EstadoErro com "Tentar novamente"

O **estado de erro** aparece quando a busca falhou. Ele é a luz do painel do carro: diz o que aconteceu, em português e sem código técnico, e oferece uma saída.

```jsx
// imports omitidos: react-native, Ionicons, useTema, tokens e Botao
export default function EstadoErro({ mensagem = 'Confira sua conexão e tente de novo.', onTentarNovamente }) {
  const { cores } = useTema();
  return (
    <View style={[estilos.centro, { backgroundColor: cores.fundo }]}>
      <Ionicons name="cloud-offline-outline" size={56} color={cores.perigo} />
      <Text style={[estilos.titulo, { color: cores.texto }]}>Algo deu errado</Text>
      <Text style={[estilos.mensagem, { color: cores.textoSuave }]}>{mensagem}</Text>
      <Botao titulo="Tentar novamente" onPress={onTentarNovamente} />
    </View>
  );
}
```

- `onTentarNovamente`: a função que a tela manda para o botão, a mesma que busca os dados
- O ícone em `cores.perigo` reforça, mas o título diz o mesmo: a cor nunca é o único sinal

---

## :icon[refresh-cw] Estado de erro na prática

```jsx
// 1. Sem mensagem: vale o texto padrão
<EstadoErro onTentarNovamente={carregar} />
// "Algo deu errado" / "Confira sua conexão e tente de novo." / [Tentar novamente]

// 2. Com a mensagem que veio do erro
<EstadoErro mensagem={erro} onTentarNovamente={carregar} />
// com erro = "A loja não respondeu. Tente de novo.", a mensagem do ApiError 503 (E19)
```

Nos dois, o botão chama o `carregar` de novo, e a tela volta ao carregando.

| Evite | Prefira |
|---|---|
| "Error 500" | "Não conseguimos buscar os produtos" |
| "Falha na requisição" | "Confira sua conexão e tente de novo" |
| erro sem botão | "Tentar novamente", que busca de novo |

Uma boa mensagem passa em três perguntas: quem não programa entende? Diz o que aconteceu? Diz o que fazer agora?

---

## Rede simulada

Para que serve um simulado de incêndio na escola?

---

## :icon[dices] Uma rede de mentira: Promise com sorteio

**Simular** é imitar de propósito, como o simulado de incêndio: treina a saída sem fogo de verdade. Os produtos estão em `src/data/produtos.js` e chegam na hora; a busca na DummyJSON só entra no app no E42. Até lá, você simula a espera e a falha da rede em `src/api/simulacao.js`:

```javascript
import { ApiError } from './cliente';

export const CHANCE_DE_ERRO = 0.3; // 1 força o erro; 0 nunca falha

export function simularRede(espera = 1500) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < CHANCE_DE_ERRO) reject(new ApiError(503));
      else resolve();
    }, espera);
  });
}
```

É o molde do `consultarFrete` do E18: um `setTimeout` dentro de uma `Promise`, a senha da lanchonete, que fica pronta ou é cancelada.

- A rede de mentira não traz dados: os produtos continuam vindo do `src/data/produtos.js`
- Sem `src/api/` no app? Copie a pasta do `lojinha-regras`: no E30 ela era opcional

---

## :icon[list-ordered] A rede de mentira em português

| Trecho | O que ele diz |
|---|---|
| `CHANCE_DE_ERRO = 0.3` | "falhe 3 vezes em cada 10", como o `CHANCE_DE_FALHA` do checkout |
| `espera = 1500` | "espere 1,5 segundo", se ninguém mandar outro tempo |
| `new Promise((resolve, reject) => ...)` | "entregue uma senha: ela vai ficar pronta (`resolve`) ou ser cancelada (`reject`)" |
| `setTimeout(() => ..., espera)` | "depois da espera, decida" |
| `Math.random() < CHANCE_DE_ERRO` | "sorteie um número de 0 a 1; se der menos que 0.3, falhe" |
| `reject(new ApiError(503))` | "cancele com o erro 503, o da loja que não respondeu" |

---

## :icon[dices] Rede simulada na prática

O mesmo teste, com três valores de `CHANCE_DE_ERRO`:

```javascript
simularRede(100)
  .then(() => console.log('cumprida: mostra os produtos'))
  .catch((e) => console.log('rejeitada:', e.message));
```

| `CHANCE_DE_ERRO` | O que sai | Para quê |
|---|---|---|
| `0` | sempre `cumprida: mostra os produtos` | ver a grade sem sustos |
| `1` | sempre `rejeitada: A loja não respondeu. Tente de novo.` | testar o `EstadoErro` agora, sem depender da sorte |
| `0.3` | uma das duas; a rejeitada, umas 3 vezes em 10 | o uso normal, para entregar |

O `Math.random()` vai de 0 até um pouco menos de 1: com `1`, ele sempre fica abaixo, e a promessa sempre rejeita.

---

## A função carregar

No fim da receita, deu certo ou não, o que você sempre faz?

---

## :icon[cloud-download] carregar: async, try, catch e finally

A função **`carregar`** busca os dados e escolhe o estado. O `try`/`catch` é a rede de proteção do trapezista, do E17; o `finally` é desligar o fogão no fim da receita: acontece sempre, tenha o bolo dado certo ou não. No `src/telas/Inicio.js`, importe `simularRede` e o `ErroDeNegocio` do E17 (`src/modelos/erros.js`):

```jsx
const [carregando, setCarregando] = useState(true);
const [erro, setErro] = useState(null);

async function carregar() {
  setCarregando(true);
  setErro(null);
  try {
    await simularRede(); // no E42, a busca de verdade: listarProdutos()
  } catch (e) {
    if (!(e instanceof ErroDeNegocio)) throw e; // bug: não esconda (E19)
    setErro(e.message);
  } finally {
    setCarregando(false); // com ou sem erro: o esqueleto nunca fica preso
  }
}
```

- `useEffect(() => { carregar(); }, []);` busca uma vez, ao abrir a tela
- "Tentar novamente" chama o mesmo `carregar`, que volta ao carregando

---

## :icon[list-ordered] O carregar em português

| Trecho | O que ele diz |
|---|---|
| `setCarregando(true); setErro(null);` | "volte ao carregando e apague o erro antigo" |
| `await simularRede()` | "espere a senha ser chamada", sem travar a tela |
| `catch (e)` | "se a senha foi cancelada, venha para cá" |
| `if (!(e instanceof ErroDeNegocio)) throw e;` | "se não é um erro esperado, é bug: não esconda" |
| `setErro(e.message)` | "guarde a mensagem para o `EstadoErro`" |
| `finally { setCarregando(false); }` | "deu certo ou não, saia do carregando" |

Com a API de verdade (E42), uma busca que pode ficar velha, como a busca por termo, se cancela com o `AbortController` do E19.

---

## :icon[split] O carregar na prática

:::center
![Diagrama: carregar() leva ao carregando; depois de 1,5 s a tela vai para conteúdo com produtos, para vazio com a lista vazia ou para erro quando falha, 3 vezes em 10; do erro, Tentar novamente volta ao carregando](images/e39-quatro-estados.svg)
:::

Toda busca começa no **carregando**. Quando a `Promise` termina, cumprida ou rejeitada, a tela segue para um dos outros três estados:

| A busca | `carregando` | `erro` | A tela mostra |
|---|---|---|---|
| ainda esperando | `true` | `null` | o esqueleto |
| cumprida | `false` | `null` | a grade |
| rejeitada | `false` | a mensagem | o `EstadoErro`; "Tentar novamente" recomeça pelo carregando |

---

## :icon[route] Inicio: um estado por vez

Quando a busca termina sem erro, os cartões entram com o `stagger`. Depois dos hooks, um `if` por estado decide o que desenhar:

```jsx
useEffect(() => {
  if (carregando || erro) return;
  Animated.stagger(80, entradas.map((valor) =>
    Animated.timing(valor, { toValue: 1, duration: 300, useNativeDriver: true })
  )).start();
}, [carregando, erro]);

if (carregando) return <GradeEsqueleto colunas={colunas} />;
if (erro) return <EstadoErro mensagem={erro} onTentarNovamente={carregar} />;
if (produtos.length === 0) return <EstadoVazio titulo="Nenhum produto por aqui" />;
return <FlatList /* a grade do E38, com EntradaAnimada no renderItem */ />;
```

- O efeito do `stagger` só anima quando não está carregando nem com erro; `[carregando, erro]` o faz rodar de novo quando eles mudam
- Cada `if` com `return` para a função ali: só um estado é desenhado por vez
- `GradeEsqueleto`: componente no próprio `Inicio.js`, com 6 cartões de esqueleto em grade
- Com dados locais, o vazio nunca aparece; no E42, com a API, uma busca sem resultado cai nele
- Todos os hooks vêm **antes** do primeiro `return`

---

## Toast

Você tranca o carro pelo controle. Como sabe que trancou?

---

## :icon[message-square] Toast: avisar sem interromper

Um **toast** é um aviso curto que aparece no rodapé e some sozinho. É o bipe do carro quando você tranca pelo controle: confirma que deu certo, e você nem para de andar.

No Detalhe, o botão deixa de voltar à lista: o usuário fica e o toast confirma.

```jsx
const [toastVisivel, setToastVisivel] = useState(false);

function adicionarAoCarrinho() {
  adicionar(produto);
  setToastVisivel(true);
}

// último filho da View raiz, fora de qualquer ScrollView
<Toast mensagem="Adicionado ao carrinho" visivel={toastVisivel}
  onSumir={() => setToastVisivel(false)} />
```

- `toastVisivel` começa `false`; o toque em "Adicionar" o põe em `true`, e o toast aparece
- `onSumir` volta o estado a `false` quando o aviso termina de sumir

---

## :icon[file-code] O componente Toast

Em `src/components/ui/Toast.js`, sem biblioteca: uma `Animated.View` com posição absoluta que aparece, espera e some.

```jsx
export default function Toast({ mensagem, visivel, onSumir }) {
  const { cores } = useTema();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visivel) return;
    AccessibilityInfo.announceForAccessibility(mensagem);
    Animated.sequence([
      Animated.timing(anim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(1800),
      Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => onSumir());
  }, [visivel]);
```

```jsx
  if (!visivel) return null;
  return (
    <Animated.View style={[estilos.toast, { backgroundColor: cores.texto, opacity: anim }]}>
      <Text style={[estilos.texto, { color: cores.fundo }]}>{mensagem}</Text>
    </Animated.View>
  );
}
// estilos.toast: position 'absolute', com left, right e bottom
```

- A sequência: aparece em 200 ms, `Animated.delay(1800)` segura o aviso, some em 200 ms
- `start` recebe uma função que roda no fim: ela avisa o pai para esconder o toast
- `announceForAccessibility` faz o leitor de tela falar a mensagem, que não recebe foco

---

## :icon[message-square] Toast na prática

Confirmar é com toast; decidir é com `Alert`:

```jsx
// 1. Deu certo: o toast confirma e some sozinho
<Toast mensagem="Adicionado ao carrinho" visivel={toastVisivel}
  onSumir={() => setToastVisivel(false)} />

// 2. Precisa decidir: o Alert para tudo e espera a resposta
Alert.alert('Remover do carrinho?', 'O Fone Bluetooth sai do pedido.', [
  { text: 'Cancelar', style: 'cancel' },
  { text: 'Remover', style: 'destructive', onPress: () => remover(item.id) },
]);
```

| | `Alert` | Toast |
|---|---|---|
| Interrompe? | sim, exige um toque | não, some em 2 segundos |
| Use para | decidir algo, como remover | confirmar que deu certo |
| Com leitor de tela | lê a pergunta e os botões | fala a mensagem uma vez |

---

## Mensagens de erro

Tela vermelha logo depois de mexer num `useEffect`. Coincidência?

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Rendered more hooks than during the previous render` | um `useEffect` depois de um `return` | hooks antes dos `return` |
| `Text strings must be rendered within a <Text> component` | `{itens.length && ...}` com 0 itens deixa o `0` fora de `<Text>` | `itens.length > 0 &&` ou `? :` |
| `Unable to resolve module ./cliente` | `src/api/` não veio do `lojinha-regras` | copiar a pasta |
| `Possible unhandled promise rejection` | um bug subiu do `carregar`, como um nome de função errado | ler o terminal e corrigir |
| Esqueleto que nunca sai | `setCarregando(false)` no `try`, pulado na falha | no `finally` |

---

## :icon[triangle-alert] Erros comuns

:::warning
- Tela só com o estado "conteúdo": sem rede, o usuário vê uma tela branca e não sabe o que fazer
- `Toast` dentro do `ScrollView`: ele rola junto com a tela; deixe-o como último filho da `View` raiz
- Entregar com `CHANCE_DE_ERRO = 1`: o Início nunca mostra os produtos
:::

---

## Resumo

:::summary
- Toda tela que busca dados tem 4 estados: carregando, vazio, erro e conteúdo
- `ActivityIndicator` serve para esperas pequenas; o esqueleto mostra a forma do que vem e encurta a espera percebida
- Vazio e erro sempre oferecem uma ação, como "Ver produtos" ou "Tentar novamente"
- Até a API entrar no app, uma `Promise` com `setTimeout` e `Math.random()` simula a espera e a falha; `finally` encerra o carregando
- O toast confirma sem interromper; o `Alert` fica para o que exige decisão
:::

---

## :icon[flask-conical] No laboratório

Os 4 estados e o movimento chegam à Lojinha.

:::steps
1. Desenhe no papel os 4 estados do Início e o carrinho vazio
2. `EstadoCarregando`, `EstadoVazio`, `EstadoErro`, `Esqueleto` e `Toast` no UI kit e no `index.js`
3. `src/api/simulacao.js`; no Início, `carregar` com `finally` e a `GradeEsqueleto`
4. Com `CHANCE_DE_ERRO = 1`, teste o "Tentar novamente"; volte a 0.3
5. Cartões entrando com `Animated.stagger` e `EntradaAnimada`
6. Carrinho vazio com "Ver produtos"; no Detalhe, toast e botão que pulsa
7. Dois temas, commit "E39: animações e estados de tela" e `git push`
:::

**Critérios de entrega**: Início com os 4 estados e `CHANCE_DE_ERRO` de volta a 0.3; valores em `useRef` e `useNativeDriver: true`; vazio e erro com ação; toast que some. Entregue o link do repositório.

---

## :icon[milestone] Projeto 6 · Etapa 10: estados, animação e CEP

No seu repositório `casas-de-adocao`:

- `Estado` no UI kit, com as variantes `carregando`, `vazio` e `erro`, mensagem e ação: Favoritas sem nenhuma, busca sem resultado e casa não encontrada
- `src/api/viacep.js`: `buscarEndereco(cep)` com `fetch` em `https://viacep.com.br/ws/{cep}/json/`
- no Cadastro, o CEP completo preenche rua, bairro, cidade e UF: "Buscando endereço..." durante a espera, mensagem no campo para CEP inexistente e para falta de conexão, e os campos continuam editáveis
- o botão de favoritar pulsa com `Animated.spring` e `useNativeDriver: true`

Commit: `Projeto 6: etapa 10, estados, animação e CEP`. Enunciado completo e entrega: página do curso, em **Projetos**.
