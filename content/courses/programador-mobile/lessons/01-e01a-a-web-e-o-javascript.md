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

## :icon[network] Cliente e servidor

Toda página na web começa com um pedido e uma resposta.

:::center
![Animação: o navegador envia um pedido ao servidor, o servidor responde com os arquivos HTML, CSS e JS, e o navegador desenha a tela do Minhas Tarefas](images/e01-cliente-servidor.svg)
:::

:::steps
1. Você digita um endereço ou toca em um link
2. O **navegador** (o cliente) envia um pedido ao **servidor**, um computador ligado à internet que guarda os arquivos e os dados
3. O servidor responde com arquivos: HTML, CSS, JavaScript e imagens
4. O navegador lê esses arquivos e **desenha** a página na tela
:::

---

## Front-end e back-end

| | Front-end | Back-end |
|---|---|---|
| Onde roda | No navegador ou no celular do usuário | No servidor |
| O que faz | Tudo que o usuário vê e toca | Guardar dados, aplicar regras, autenticar |
| Linguagens | HTML, CSS, JavaScript | Várias: JavaScript, Python, Java, SQL |
| Exemplo | A tela do carrinho de compras | Calcular o frete e registrar o pedido |

Este curso forma **programadores mobile**: você transforma o desenho de uma tela em um app que roda no Android e no iOS, liga esse app aos dados de um back-end e cuida do que só existe no celular, como o toque e as telas de todos os tamanhos.

---

## :icon[code-xml] HTML: a estrutura

**HTML** descreve o que existe na página: títulos, textos, listas, botões. Cada peça é uma **tag**, que abre e fecha.

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

## :icon[pencil] CSS: a aparência

**CSS** define como cada peça aparece: cor, tamanho, fonte, espaçamento. Um **seletor** escolhe os elementos; as **propriedades** dizem como eles ficam.

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

`h1` e `button` são os seletores. Entre as chaves, cada linha é uma propriedade e o seu valor.

---

## :icon[zap] JavaScript: o comportamento

**JavaScript** faz a página reagir: a um clique, a uma digitação, a dados que chegaram do servidor.

```javascript
const botao = document.querySelector('button')

botao.addEventListener('click', () => {
  alert('Nova tarefa!')
})
```

- `document.querySelector('button')` encontra o botão na página
- `addEventListener('click', ...)` fica esperando um clique
- o código entre chaves roda a cada clique: aqui, abre uma caixa de alerta

Não se preocupe com cada símbolo: a partir do E05 você escreve código assim, parte por parte. Sem JavaScript, a página é um cartaz: bonito, mas parado.

---

## As três linguagens juntas

:::center
![Diagrama: a mesma página em três etapas; só com HTML ela fica sem estilo, com CSS ganha cor mas fica parada, e com JavaScript o clique no botão mostra o alerta Nova tarefa](images/e01-tres-camadas.svg)
:::

Pense em uma casa: o HTML são as paredes e os cômodos; o CSS, a pintura e os móveis; o JavaScript, os interruptores e a campainha. Os três arquivos viajam do servidor até o navegador, que junta tudo e desenha a tela.

:::tip
Mudou a cor? É CSS. Mudou o texto? É HTML. Aconteceu algo quando você clicou? É JavaScript.
:::

---

## :icon[search] DevTools: o raio-x da página

Todo navegador traz as **DevTools** (ferramentas do desenvolvedor). Com elas, você vê e altera qualquer página, inclusive as que não são suas.

Como abrir:

- Windows e Linux: `F12` ou `Ctrl` + `Shift` + `I`
- Mac: `Cmd` + `Option` + `I`
- Qualquer sistema: clique direito na página e escolha **Inspecionar**

As abas que você mais vai usar:

- **Elements**: o HTML e o CSS da página, ao vivo
- **Console**: roda JavaScript e mostra mensagens e erros
- **Network**: os pedidos feitos ao servidor

---

## :icon[mouse-pointer-click] Demonstração: aba Elements

Abra um site qualquer e acompanhe:

:::steps
1. Pressione `F12` e abra a aba **Elements**
2. Clique no ícone de seta, no canto superior esquerdo do painel, e depois em um título da página
3. Dê dois cliques no texto destacado e troque por "Olá, turma"
4. No painel **Styles**, clique no valor de `color` e digite `red`
5. Recarregue a página: tudo volta ao normal
:::

:::info
Você alterou a cópia que o navegador montou na memória, chamada **DOM**. O arquivo no servidor continua igual.
:::

---

## :icon[terminal] Demonstração: aba Console

O **Console** é uma linha de comando de JavaScript dentro do navegador. Digite e pressione Enter:

```javascript
console.log('Olá, turma!')
// Olá, turma!

2 + 2
// 4

document.title
// o texto que aparece na aba do site
```

- `console.log` imprime uma mensagem: é o jeito mais simples de ver o que o código está fazendo
- o Console também faz contas e mostra o que o navegador sabe sobre a página
- erros aparecem em vermelho, com a linha onde aconteceram

---

## Pense

:::question
Imagine que o JavaScript do app de delivery não carregou (internet ruim, erro no servidor).

- A página aparece? Com cores e fotos?
- O que acontece ao tocar em "Adicionar ao carrinho"?
- E se fosse o CSS que não carregou?
:::

:::tip Teste de verdade
No DevTools, pressione `Ctrl` + `Shift` + `P` (ou `Cmd` + `Shift` + `P`), digite "Disable JavaScript" e recarregue um site.
:::

---

## :icon[book-open] Quem define e quem executa o JavaScript

**JavaScript** é o nome popular. A regra oficial da linguagem se chama **ECMAScript**: uma norma pública, revisada por um comitê chamado **TC39**, com uma edição nova por ano (ES2015, ES2016 e assim por diante).

Quem lê o seu código e o executa é o **motor** (*engine*):

| Motor | Quem faz | Onde você encontra |
|---|---|---|
| V8 | Google | Chrome, Edge e Node.js |
| JavaScriptCore | Apple | Safari |
| SpiderMonkey | Mozilla | Firefox |
| Hermes | Meta | apps React Native, como os deste curso |

Todos seguem a mesma norma, mas cada um adota as novidades no seu próprio ritmo.

---

## :icon[layers] Runtime: o motor mais as ferramentas do lugar

O motor só entende a linguagem: contas, textos, listas, funções. O resto vem do **runtime** (ambiente de execução): o motor somado às **APIs**, as ferramentas prontas do lugar onde ele roda.

:::center
![Diagrama: navegador, Node.js e app no celular, cada um com o seu motor e as suas APIs, todos sobre a mesma linguagem ECMAScript](images/e01-runtimes.svg)
:::

- Navegador: `document` é a página da aba; `localStorage` guarda dados nela
- Node: `process` informa sobre o programa; `fs` lê e grava arquivos
- Celular: `Alert` mostra um aviso; `Vibration` faz o aparelho vibrar

---

## Pense: navegador ou Node?

:::question
Você digita cada linha no Console do navegador e depois no Node, pelo terminal. Onde cada uma funciona?

```javascript
console.log('Olá, turma!')  // 1
2 + 2                       // 2
document.title              // 3
process.version             // 4
```
:::

:::tip Resposta
1. Nos dois: os dois runtimes oferecem `console.log`
2. Nos dois: conta é da própria linguagem
3. Só no navegador: no Node, aparece `document is not defined`, porque não há página
4. Só no Node: no navegador, aparece `process is not defined`

Regra prática: o que é da **linguagem** roda em qualquer lugar; o que é do **runtime** só roda onde ele existe.
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

## Erros comuns

:::warning
- Achar que a alteração no DevTools salvou o site: ao recarregar, tudo volta. Para mudar de verdade, edite o arquivo no editor
- Misturar os papéis: tentar mudar a cor no HTML ou criar um botão no CSS
- Fechar o Console ao ver um erro em vermelho: ele é a pista, não o problema
- Escrever texto sem aspas: `console.log(Olá)` dá erro; `console.log('Olá')` funciona
- Usar no Node o que é do navegador: `document` no terminal dá `document is not defined`
:::

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
