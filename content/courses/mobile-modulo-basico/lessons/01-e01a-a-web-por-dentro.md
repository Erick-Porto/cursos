---
title: "A web por dentro: HTML, CSS e JavaScript"
summary: Como uma página chega ao navegador, o que HTML, CSS e JavaScript fazem nela e por que o mobile começa aqui.
module: react
duration_minutes: 35
objectives:
  - Explicar o papel de HTML, CSS e JavaScript em uma página
  - Inspecionar e alterar uma página pelo DevTools
  - Descrever o que um programador mobile faz e por que o curso começa pela web
---

# A web por dentro: HTML, CSS e JavaScript

Programador Mobile: Módulo Básico · Encontro E01 · Aula 1 de 18

---

## O que você vai aprender

:::goal
- Como uma página sai do servidor e chega à sua tela
- O papel de cada uma das três linguagens da web: HTML, CSS e JavaScript
- Como abrir o DevTools e mexer em qualquer página ao vivo
- O que um programador mobile faz no dia a dia e por que começamos pela web
:::

---

## Por que isso importa

Você abre um app de delivery, toca em um restaurante e a tela aparece em menos de um segundo: foto, nome, nota, botão de pedir.

Alguém escreveu cada pedaço disso. E tomou decisões:

- onde cada texto fica
- qual cor tem o botão
- o que acontece quando você toca nele

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

Este curso forma **programadores mobile**: você constrói o front que roda no celular e conversa com um back-end. A tabela vale tanto para apps quanto para sites.

---

## :icon[code-xml] HTML: a estrutura

**HTML** descreve o que existe na página: títulos, textos, listas, botões. Cada peça é uma **tag**, que abre e fecha.

```html
<h1>Minhas Tarefas</h1>
<p>Você tem 2 tarefas pendentes.</p>
<ul>
  <li>Estudar React</li>
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

Sem JavaScript, a página é um cartaz: bonito, mas parado.

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
// 'Minhas Tarefas'
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

## :icon[briefcase] O que faz um programador mobile

- Transforma o desenho de uma tela (design) em um app que roda no Android e no iOS
- Conecta o app aos dados do servidor: login, catálogo, pedidos, notificações
- Lida com o que só existe no celular: toque, câmera, localização, telas de todos os tamanhos
- Publica nas lojas, mede o uso e melhora o que está no ar
- Cuida de acessibilidade e desempenho

:::info Por que começar pela web
No **React Native**, o app é escrito em JavaScript com as mesmas ideias do **React** da web: componentes, props e estado. A web é o lugar mais rápido para aprender isso: os cinco primeiros encontros ficam no navegador e, do sexto em diante, tudo vai para o celular.
:::

---

## Erros comuns

:::warning
- Achar que a alteração no DevTools salvou o site: ao recarregar, tudo volta. Para mudar de verdade, edite o arquivo no editor
- Misturar os papéis: tentar mudar a cor no HTML ou criar um botão no CSS
- Fechar o Console ao ver um erro em vermelho: ele é a pista, não o problema
- Pensar que programar para celular é "só o visual": há lógica, dados e muitas decisões de código
- Escrever texto sem aspas: `console.log(Olá)` dá erro; `console.log('Olá')` funciona
:::

---

## Resumo

:::summary
- O navegador (cliente) pede a página ao servidor, recebe os arquivos e desenha a tela
- **HTML** dá a estrutura, **CSS** dá a aparência e **JavaScript** dá o comportamento
- O DevTools mostra e altera a página ao vivo: **Elements** para HTML e CSS, **Console** para JavaScript
- O programador mobile constrói o app que o usuário toca; React (web) e React Native (celular) usam a mesma base, por isso começamos pela web
:::

---

## :icon[arrow-right] Próximos passos

Você já sabe fazer um botão reagir a um clique com JavaScript. Agora imagine uma tela com lista, contador e mensagens que precisam mudar juntos a cada toque.

Na próxima aula, **Por que React**, você vai:

- ver o problema de atualizar a tela "na mão"
- conhecer o jeito declarativo do React e a ideia de componente
- preparar o ambiente: Node.js, VS Code e Git

Em seguida, no laboratório, você monta sua primeira página e deixa o computador pronto para o React.
