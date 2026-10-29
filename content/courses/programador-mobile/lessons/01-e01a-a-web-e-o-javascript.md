---
title: "A web e o JavaScript: do navegador ao Node"
summary: Como uma página chega à tela, o papel de HTML, CSS e JavaScript e onde o JavaScript roda, do navegador ao Node.
module: ambiente-js
duration_minutes: 40
objectives:
  - Explicar o papel de HTML, CSS e JavaScript em uma página
  - Inspecionar e alterar uma página pelo DevTools
  - Diferenciar a linguagem, o motor e o runtime do JavaScript
  - Reconhecer o que roda só no navegador, só no Node e nos dois
---

# A web e o JavaScript: do navegador ao Node

Programador Mobile · Encontro E01 · Aula 1 de 89

---

## O que você vai aprender

:::goal
- Como uma página sai do servidor e chega à sua tela
- O papel de cada uma das três linguagens da web: HTML, CSS e JavaScript
- Como abrir o DevTools e mexer em qualquer página ao vivo
- Quem define o JavaScript, quem executa o código e onde ele roda: no navegador e no Node
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **código** | texto com instruções que o computador segue, escrito numa linguagem de programação |
| **servidor** | um computador ligado à internet que guarda os arquivos de um site e manda para quem pede |
| **front-end** | a parte de um site ou app que você vê e toca |
| **DevTools** | ferramentas que já vêm no navegador para olhar e mexer em qualquer página |
| **Console** | a parte do DevTools onde você digita JavaScript e vê o resultado na hora |
| **runtime** | o lugar onde o JavaScript roda, com as ferramentas daquele lugar: o navegador ou o Node |

---

## Por que isso importa

Você abre um app de delivery, toca em um restaurante e a tela aparece em menos de um segundo: foto, nome, nota, botão de pedir.

Alguém escreveu cada pedaço disso. E tomou decisões:

- onde cada texto fica
- qual cor tem o botão
- o que acontece quando você toca nele

Neste curso, você escreve tudo isso em uma linguagem só: **JavaScript**.

:::question
O que acontece entre o seu toque e a tela pronta? Quem faz esse trabalho?
:::

---

## Cliente e servidor

Você pede um prato no restaurante. Quem faz o quê até ele chegar à mesa?

---

## :icon[network] Cliente e servidor

Toda página na web começa com um pedido e uma resposta, como num restaurante: o **cliente** faz o pedido, e a cozinha prepara e manda o prato. Na web, a cozinha é o **servidor**.

:::center
![Animação: o navegador envia um pedido ao servidor, o servidor responde com os arquivos HTML, CSS e JS, e o navegador desenha a tela do Minhas Tarefas](images/e01-cliente-servidor.svg)
:::

:::steps
1. Você digita um endereço ou toca em um link
2. O **navegador**, que é o cliente, envia um pedido ao servidor: um computador ligado à internet que guarda os arquivos e os dados
3. O servidor responde com arquivos: HTML, CSS, JavaScript e imagens
4. O navegador lê esses arquivos e **desenha** a página na tela
:::

---

## :icon[network] Cliente e servidor na prática

Todo dia você é cliente várias vezes, sem perceber:

| Você... | O cliente pede | O servidor responde |
|---|---|---|
| digita `github.com` no navegador | a página inicial do site | os arquivos HTML, CSS e JavaScript da página |
| abre o app de delivery | os restaurantes perto de você | a lista, com nome, foto e nota de cada um |
| toca em "Pedir" | que o pedido seja registrado | "Pedido confirmado", com o número |

O cliente pode ser o navegador do computador ou um app no celular. O pedido viaja pela internet, e a resposta volta pelo mesmo caminho.

---

## Front-end e back-end

Num restaurante, o que o cliente vê e o que fica escondido nos fundos?

---

## :icon[store] Front-end e back-end: o salão e a cozinha

Um app tem duas partes, como um restaurante. O **front-end** é o salão: tudo o que o cliente vê e toca. O **back-end** é a cozinha: ninguém vê, mas é lá que o pedido é preparado.

| | Front-end | Back-end |
|---|---|---|
| Onde roda | No navegador ou no celular de quem usa | No servidor |
| O que faz | Tudo o que a pessoa vê e toca | Guarda os dados, aplica as regras, confere a senha de quem entra |
| Linguagens | HTML, CSS, JavaScript | Várias: JavaScript, Python, Java, SQL |
| Exemplo | A tela do carrinho de compras | Calcular o frete e registrar o pedido |

---

## :icon[store] Front-end e back-end na prática

Cada toque mexe com as duas partes:

| Você... | O front-end | O back-end |
|---|---|---|
| abre o carrinho | desenha os produtos e o total | guarda o que está no seu carrinho |
| digita o CEP | mostra o campo e o botão "Calcular" | calcula o frete até esse CEP |
| faz login | mostra os campos de e-mail e senha | confere se a senha está certa |

Este curso forma **programadores mobile**: você transforma o desenho de uma tela em um app para Android e iOS, liga o app aos dados de um back-end e cuida do que só existe no celular, como o toque e as telas de todos os tamanhos.

---

## HTML

O que uma casa precisa ter antes de ganhar pintura e móveis?

---

## :icon[code-xml] HTML: a estrutura

Pense numa casa. O **HTML** são as paredes e os cômodos: ele diz o que existe na página. Cada peça é uma **tag** (marcação): um nome entre `<` e `>` que abre a peça, e o mesmo nome com uma barra, que fecha. `<h1>` abre, `</h1>` fecha.

```html
<h1>Minhas Tarefas</h1>
<p>Você tem 2 tarefas pendentes.</p>
<ul>
  <li>Estudar JavaScript</li>
  <li>Comprar pão</li>
</ul>
<button>Adicionar tarefa</button>
```

- `<h1>` é o título principal; `<p>`, um parágrafo
- `<ul>` é uma lista; cada `<li>` é um item
- `<button>` cria um botão clicável (que ainda não faz nada)

---

## :icon[code-xml] HTML na prática

Três peças da página de perfil que você monta no laboratório:

**Caso 1: título e parágrafo.**

```html
<h1>Ana Souza</h1>
<p>Estudante de programação mobile.</p>
```

**Caso 2: um link.** O `href` diz para onde o clique leva; o texto entre as tags é o que aparece na tela:

```html
<a href="https://github.com/anasouza">GitHub</a>
```

**Caso 3: uma imagem.** A tag `<img>` não fecha. O `src` diz qual arquivo mostrar, e o `alt` descreve a foto para quem não enxerga:

```html
<img src="foto.jpg" alt="Foto de Ana Souza">
```

Na tela: o nome em letras grandes, a frase embaixo, a palavra "GitHub" azul e sublinhada, que leva ao perfil, e a foto.

---

## CSS

Duas casas com a mesma planta. O que faz uma parecer diferente da outra?

---

## :icon[pencil] CSS: a aparência

Na casa, o **CSS** é a pintura e os móveis: define como cada peça aparece. Um **seletor** escolhe as peças; as **propriedades** dizem como elas ficam.

```css
h1 {
  color: #0b7285;
  font-family: sans-serif;
}

button {
  background: #22d3ee;
  padding: 8px 16px;
  border-radius: 8px;
}
```

| Linha | O que ela diz |
|---|---|
| `h1 {` e `button {` | os seletores: "para todo título `h1`" e "para todo botão" |
| `color: #0b7285;` | "a cor do texto é este azul-petróleo", escrito em código |
| `font-family: sans-serif;` | "use uma letra simples, sem os pezinhos" |
| `background: #22d3ee;` | "o fundo é azul-claro" |
| `padding: 8px 16px;` | "deixe espaço por dentro: 8 em cima e embaixo, 16 dos lados" |
| `border-radius: 8px;` | "arredonde os cantos" |

---

## :icon[pencil] CSS na prática

**Caso 1: a cor de todo parágrafo.** Todo `<p>` da página fica cinza; o resto não muda.

```css
p {
  color: gray;
}
```

**Caso 2: uma foto redonda.** Com a largura igual à altura, `border-radius: 50%` transforma o quadrado num círculo. O `px` mede em pontinhos da tela:

```css
img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}
```

**Caso 3: os links em negrito.**

```css
a {
  font-weight: bold;
}
```

O seletor diz **quem** muda; as propriedades dizem **como**.

---

## JavaScript

Numa casa, o que reage quando você aperta, gira ou toca?

---

## :icon[zap] JavaScript: o comportamento

Na casa, o **JavaScript** são os interruptores e a campainha: ele faz a página reagir a um clique, a uma digitação, a dados que chegaram do servidor. Este código mostra um aviso quando alguém clica no botão:

```javascript
const botao = document.querySelector('button')

botao.addEventListener('click', () => {
  alert('Nova tarefa!')
})
```

Sem JavaScript, a página é uma casa sem interruptores: bonita, mas nada acende.

Hoje o código é só para ler. Você aprende a escrever código assim, parte por parte, a partir do E05.

---

## :icon[list-ordered] O botão em português

| Linha | O que ela diz |
|---|---|
| `const botao = document.querySelector('button')` | "procure o botão na página e guarde com o nome `botao`" |
| `botao.addEventListener('click', () => {` | "fique de olho no botão; a cada clique, faça o que está entre as chaves" |
| `alert('Nova tarefa!')` | "mostre uma caixa de aviso com o texto Nova tarefa!" |
| `})` | "fim do que fazer no clique" |

- `document` é a página que está aberta na aba
- Texto vai entre aspas: `'button'`, `'Nova tarefa!'`
- `addEventListener` quer dizer "adicionar um ouvinte de evento". O evento, aqui, é o `'click'`

---

## As três linguagens juntas

:::center
![Diagrama: a mesma página em três etapas; só com HTML ela fica sem estilo, com CSS ganha cor mas fica parada, e com JavaScript o clique no botão mostra o alerta Nova tarefa](images/e01-tres-camadas.svg)
:::

A mesma página em três etapas: o HTML levanta as paredes, o CSS pinta e mobília, e o JavaScript liga os interruptores. Os três arquivos viajam do servidor até o navegador, que junta tudo e desenha a tela.

:::tip
Mudou a cor? É CSS. Mudou o texto? É HTML. Aconteceu algo quando você clicou? É JavaScript.
:::

---

## DevTools

E se você pudesse ver qualquer site por dentro, como num raio-x?

---

## :icon[search] DevTools: o raio-x da página

Todo navegador traz as **DevTools** (*developer tools*, ferramentas do desenvolvedor). Elas são o raio-x da página: mostram o que existe por dentro e deixam você mexer em qualquer site, inclusive nos que não são seus.

Como abrir:

- Windows e Linux: `F12` ou `Ctrl` + `Shift` + `I`
- Mac: `Cmd` + `Option` + `I`
- Qualquer sistema: clique direito na página e escolha **Inspecionar**

As abas que você mais vai usar:

- **Elements** (elementos): o HTML e o CSS da página, ao vivo
- **Console**: roda JavaScript e mostra mensagens e erros
- **Network** (rede): os pedidos feitos ao servidor

---

## :icon[mouse-pointer-click] DevTools na prática: a aba Elements

Abra um site qualquer e acompanhe:

:::steps
1. Pressione `F12` e abra a aba **Elements**
2. Clique no ícone de seta, no canto superior esquerdo do painel, e depois em um título da página
3. Dê dois cliques no texto destacado e troque por "Olá, turma"
4. No painel **Styles**, clique no valor de `color` e digite `red`
5. Recarregue a página: tudo volta ao normal
:::

:::info
O navegador lê o HTML como quem lê a planta de uma casa e monta uma maquete na memória, chamada **DOM**. No DevTools, você mexe na maquete; o arquivo no servidor continua igual. Para mudar de verdade, edite o arquivo no editor.
:::

---

## O Console

Que app do celular mostra o resultado de uma conta assim que você digita?

---

## :icon[terminal] O Console: JavaScript na hora

O **Console** é a aba do DevTools que entende JavaScript. Funciona como uma calculadora: você digita uma linha, aperta <kbd>Enter</kbd> e vê o resultado na hora.

Para abrir: `F12` e a aba **Console**. Você digita depois do sinal `>`.

O comando mais usado é o **`console.log(...)`**: ele escreve na tela o que está entre os parênteses. Texto vai entre aspas:

```javascript
console.log('Bom dia!')
// Bom dia!
```

Tudo depois de `//` é um **comentário**: um recado para quem lê, que o JavaScript ignora. Nos slides, ele mostra o que aparece na tela.

---

## :icon[terminal] O Console na prática

Digite uma linha de cada vez e pressione <kbd>Enter</kbd>:

```javascript
console.log('Olá, turma!')
// Olá, turma!

2 + 2
// 4

document.title
// o texto que aparece na aba do site
```

- `console.log` é o jeito mais simples de ver o que o código está fazendo. Depois da mensagem, aparece um `undefined` cinza: é normal, e no E02 você entende de onde ele vem
- O Console também faz contas e mostra o que o navegador sabe sobre a página
- Erros aparecem em vermelho, com a linha onde aconteceram

---

## Pense

:::example Desafio
Imagine que o JavaScript do app de delivery não carregou (internet ruim, erro no servidor).

- A página aparece? Com cores e fotos?
- O que acontece ao tocar em "Adicionar ao carrinho"?
- E se fosse o CSS que não carregou?
:::

:::tip Teste de verdade
No DevTools, pressione `Ctrl` + `Shift` + `P` (ou `Cmd` + `Shift` + `P`), digite "Disable JavaScript" e recarregue um site.
:::

:::tip Resposta
Sem JavaScript, a página aparece, com cores e fotos, mas "Adicionar ao carrinho" não faz nada. Sem CSS, os botões funcionam, mas a página fica sem estilo: texto preto, links azuis e imagens no tamanho original.
:::

---

## Motor e runtime

Uma ambulância e um carro comum podem ter o mesmo motor. O que muda entre eles?

---

## :icon[cog] Quem define e quem executa o JavaScript

**JavaScript** é o nome popular. As regras oficiais da linguagem estão num documento público, o **ECMAScript**. Um comitê, o **TC39**, revisa as regras e publica uma edição nova por ano: ES2015, ES2016...

Quem lê o seu código e faz o que ele diz é o **motor** (*engine*). Como num carro, é o motor que faz tudo andar:

| Motor | Quem faz | Onde você encontra |
|---|---|---|
| V8 | Google | Chrome, Edge e Node.js |
| JavaScriptCore | Apple | Safari |
| SpiderMonkey | Mozilla | Firefox |
| Hermes | Meta | apps React Native, como os deste curso |

Todos seguem as mesmas regras, mas cada um adota as novidades no seu próprio ritmo.

---

## :icon[layers] Runtime: o motor mais as ferramentas do lugar

O mesmo motor vai num carro comum ou numa ambulância, mas só a ambulância tem sirene. Com o JavaScript é igual. O motor só entende a linguagem: contas, textos, listas. O resto vem do **runtime** (ambiente de execução): o motor somado às **APIs**, as ferramentas prontas do lugar onde ele roda.

:::center
![Diagrama: navegador, Node.js e app no celular, cada um com o seu motor e as suas APIs, todos sobre a mesma linguagem ECMAScript](images/e01-runtimes.svg)
:::

- Navegador: `document` é a página da aba; `localStorage` guarda dados nela
- Node: `process` informa sobre o programa; `fs` lê e grava arquivos
- Celular: `Alert` mostra um aviso; `Vibration` faz o aparelho vibrar

---

## :icon[layers] Runtime na prática: o mesmo código em dois lugares

As mesmas quatro linhas, digitadas no Console do navegador e no Node, pelo terminal:

```javascript
console.log('Olá, turma!')  // 1
2 + 2                       // 2
document.title              // 3
process.version             // 4
```

| Linha | No navegador | No Node |
|---|---|---|
| 1 | `Olá, turma!` | `Olá, turma!` |
| 2 | `4` | `4` |
| 3 | o título da aba | erro: `document is not defined` |
| 4 | erro: `process is not defined` | a versão do Node, como `'v24.11.1'` |

O que é da **linguagem** roda em qualquer lugar; o que é do **runtime** só roda onde ele existe.

---

## Pense: navegador ou Node?

:::example Desafio
Onde cada linha funciona: só no navegador, só no Node ou nos dois?

```javascript
alert('Nova tarefa!')          // 1
10 * 3                         // 2
document.querySelector('h1')   // 3
process.argv                   // 4
```
:::

:::tip Resposta
1. Só no navegador: o `alert` é uma ferramenta do navegador. No Node, aparece `alert is not defined`
2. Nos dois: conta é da própria linguagem. O `*` é a multiplicação, e o resultado é `30`
3. Só no navegador: no Node não há página
4. Só no Node: no navegador, aparece `process is not defined`
:::

---

## :icon[route] Onde o JavaScript roda neste curso

| Encontros | Onde roda | O que você constrói |
|---|---|---|
| E02 a E20 | Node.js, no terminal | `lojinha-regras`: preços, frete, carrinho e checkout de uma loja |
| E21 a E25 | Navegador | Minhas Tarefas, o seu primeiro app em React |
| E26 a E29 | Celular, no Expo Go | Minhas Tarefas em React Native |
| E30 a E40 | Celular | a Lojinha, com as regras do `lojinha-regras` |
| E41 a E45 | Celular | o app da sua equipe |

Por que começar pelo terminal? Sem tela para desenhar, você foca na linguagem. Quando o app chegar, as regras da loja já estarão prontas e testadas.

---

## Mensagens de erro

Acendeu uma luz no painel do carro. O que você faz?

---

## :icon[siren] Como ler uma mensagem de erro

Erro faz parte: quem programa vê vários por dia. A **mensagem de erro** é como a luz do painel do carro: diz o que aconteceu e onde. No Console, ela aparece em vermelho. Não feche: leia.

Digite `console.log(Olá)`, sem aspas, e veja a mensagem em partes:

```plaintext
Uncaught ReferenceError: Olá is not defined
```

| Parte | Quer dizer |
|---|---|
| `Uncaught` | "não tratado": ninguém cuidou do erro, e o código parou ali |
| `ReferenceError` | o tipo do erro: um nome que o JavaScript não conhece |
| `Olá is not defined` | o nome que faltou: "`Olá` não foi definido" |

Sem aspas, `Olá` não é texto: é um nome, e esse nome não existe.

---

## :icon[siren] Quando aparece um erro

As mensagens que você mais vai ver hoje:

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Olá is not defined` | um texto ficou sem aspas, e o JavaScript procurou um nome `Olá` | pôr o texto entre aspas: `console.log('Olá')` |
| `consol is not defined` | erro de digitação no nome | conferir letra por letra: `console` |
| `document is not defined` | você está no Node, e lá não há página | usar `document` só no navegador |
| `process is not defined` | você está no navegador, e o `process` é do Node | usar `process` só no Node |

---

## Resumo

:::summary
- O navegador (cliente) pede a página ao servidor, recebe os arquivos e desenha a tela
- **HTML** dá a estrutura, **CSS** dá a aparência e **JavaScript** dá o comportamento
- O DevTools mostra e altera a página ao vivo: **Elements** para HTML e CSS, **Console** para JavaScript
- O **ECMAScript** define a linguagem, o **motor** executa o código e o **runtime** é o motor mais as APIs do lugar
- Neste curso, o JavaScript roda primeiro no Node, depois no navegador e, por fim, no celular
:::

---

## :icon[arrow-right] Próximos passos

Para rodar JavaScript fora do navegador, o seu computador precisa de algumas ferramentas. Na próxima aula, **Ambiente de desenvolvimento**, você conhece cada uma:

- :icon[server] Node.js e npm, para rodar JavaScript no computador
- :icon[code] VS Code, o editor do curso
- :icon[git-branch] Git e GitHub, para guardar o histórico do seu código
- :icon[terminal] o terminal, onde tudo isso se conecta

No laboratório, você monta a sua primeira página e deixa o computador pronto para o E02.
