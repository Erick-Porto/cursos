---
title: "JavaScript por dentro: motores e runtimes"
summary: Quem define a linguagem, quais motores a executam, onde roda o código do app e o papel do Node nas suas ferramentas.
module: ambiente-js
duration_minutes: 35
objectives:
  - Explicar o papel do ECMAScript, do TC39 e das edições anuais da linguagem
  - Diferenciar motor de runtime e reconhecer o Hermes como o motor do app
  - Descrever o caminho do código até o celular, passando por Metro e Babel
  - Identificar as ferramentas do dia a dia que rodam no Node.js
---

# JavaScript por dentro: motores e runtimes

Programador Mobile: Módulo Específico · Encontro E21 · Aula 23 de 71

---

## O que você vai aprender

:::goal
- Saber quem define o JavaScript e como a linguagem ganha recursos novos todo ano
- Diferenciar **motor** de **runtime** e conhecer o Hermes, o motor do seu app
- Entender por que o mesmo código funciona no navegador e quebra no celular
- Seguir o caminho do código do editor até o Expo Go, passando por Metro e Babel
- Reconhecer o Node.js por trás de cada ferramenta que você usa
:::

---

## O código que funcionava no site

Você acha num tutorial uma função pronta para guardar o carrinho entre uma visita e outra:

```javascript
function salvarCarrinho(itens) {
  localStorage.setItem('carrinho', JSON.stringify(itens));
}
```

No Console do navegador, funciona. Você cola a função no `CarrinhoContext` da Lojinha, toca em **Adicionar ao carrinho** e o app mostra a tela vermelha: `Property 'localStorage' doesn't exist`.

:::question
Se é tudo JavaScript, por que a mesma função funciona no navegador e quebra no celular?
:::

---

## :icon[book-open] ECMAScript: a norma da linguagem

**JavaScript** é o nome popular. A norma oficial, que diz o que cada trecho de código significa, se chama **ECMAScript**: um documento público com as regras de `const`, `if`, funções, classes, `JSON.parse` e todo o resto.

| Quem | Papel |
|---|---|
| Ecma International | organização que publica a norma |
| **TC39** | comitê que discute e aprova cada mudança; reúne empresas como Google, Apple, Microsoft, Mozilla e Meta |
| Motores | programas que leem o seu código e o executam seguindo a norma |

A norma diz **o que** `itens.filter(...)` devolve; o motor é **quem** faz isso acontecer no aparelho.

---

## :icon[calendar] Uma edição por ano

Desde 2015, o ECMAScript ganha **uma edição por ano**, com o ano no nome: ES2015 (o famoso ES6), ES2016, ES2017 e assim por diante. Cada recurso novo é uma **proposta** que passa por estágios no TC39, do 0 ao 4, e só entra na edição no estágio 4, já implementado em motores.

Na Lojinha, você já usa várias edições:

| Recurso | Edição | Onde aparece |
|---|---|---|
| `const`, arrow function, `import` e `export` | ES2015 | todos os arquivos do app |
| `async` e `await` | ES2017 | E38, ao buscar a API |
| `{ ...item, qtd: 1 }` | ES2018 | `CarrinhoContext` |
| `?.` e `??` | ES2020 | E26, nas regras de pedido |

---

## :icon[cpu] Motores: quem executa o código

O **motor** (*engine*) é o programa que lê o JavaScript, traduz para instruções do processador e executa. Cada empresa mantém o seu:

| Motor | Quem faz | Onde você encontra |
|---|---|---|
| V8 | Google | Chrome, Edge e Node.js |
| JavaScriptCore | Apple | Safari |
| SpiderMonkey | Mozilla | Firefox |
| **Hermes** | Meta | apps React Native, inclusive a Lojinha |

Todos seguem o mesmo ECMAScript, mas cada um implementa os recursos novos no seu próprio ritmo. Um método recém-aprovado pode já existir no Chrome e ainda faltar no Hermes.

---

## :icon[smartphone] Hermes: o motor do seu app

O **Hermes** foi criado pela Meta para apps React Native e é o motor padrão nos projetos Expo. A ideia central dele é **compilar antes**:

:::steps
1. Ao gerar o app instalável, o código vira **bytecode**, um formato pronto para o motor executar
2. O app chega ao celular com esse bytecode, sem o trabalho de ler o texto do código
3. Ao abrir, o Hermes pula essa etapa: o app **abre mais rápido** e gasta menos memória
:::

No desenvolvimento, o Hermes do Expo Go recebe o código em texto, enviado pelo Metro. Para conferir que é ele quem roda o app, uma linha basta:

```javascript
console.log('Hermes?', typeof HermesInternal === 'object'); // true no app
```

---

## :icon[layers] Motor mais APIs: o runtime

O motor só entende a linguagem. O que conversa com o mundo de fora vem do **runtime** (ambiente de execução): o motor somado às APIs do lugar onde ele roda.

:::center
![Diagrama: navegador, Node.js e app, cada um com o seu motor e as suas APIs, sobre a mesma linguagem ECMAScript](images/e21-runtimes.svg)
:::

Só o navegador tem `document` e `localStorage`; só o Node, `process`, `fs` e `path`; só o app, os componentes nativos, `Alert` e `Dimensions`. `console.log`, `setTimeout` e `fetch` aparecem nos três, mas cada runtime fornece a sua versão. Por isso o `localStorage` do tutorial não existe no celular: ele é do navegador, não da linguagem.

---

## :icon[map-pin] Onde roda cada parte do seu trabalho

No dia a dia de quem programa apps, o JavaScript roda em três lugares:

| Onde | Runtime | O que roda ali |
|---|---|---|
| Navegador | Chrome, Safari | o Console do DevTools, sites e painéis da loja |
| Computador | Node.js | Expo CLI, Metro, npm, testes e os seus scripts |
| Celular | Hermes, no Expo Go | telas, contextos e regras da Lojinha |

O código das telas **não** roda no Node do seu computador: o Node prepara o código e o entrega ao celular. A exceção são os testes automatizados (E24), que rodam as regras do app no Node. Por isso uma regra testável não pode depender de nada do celular.

---

## Pense

:::question
Um colega propõe quatro linhas para a Lojinha. Em qual runtime cada uma funciona: navegador, Node ou app?

```javascript
document.querySelector('#total').textContent = 'R$ 199,90';         // 1
const texto = fs.readFileSync('src/data/catalogo.json', 'utf-8');    // 2
Alert.alert('Carrinho', 'Produto adicionado');                      // 3
const total = itens.reduce((soma, i) => soma + i.preco * i.qtd, 0); // 4
```
:::

:::tip Resposta
1. Só no navegador: `document` é a página HTML, e o app não tem página
2. Só no Node: `fs` lê o disco do computador, que o celular não enxerga
3. Só no app: `Alert` vem do React Native
4. Nos três: `reduce` é da linguagem, definido no ECMAScript

Regra prática: o que é da **linguagem** roda em qualquer lugar; o que é do **runtime** só roda onde ele existe.
:::

---

## :icon[circle-alert] Mesmo código, comportamento diferente

Quase todo "funciona aqui e não funciona lá" tem uma de duas causas:

- **API que o runtime não tem**: `document`, `localStorage` ou `fs` no app. O Hermes avisa com `Property '...' doesn't exist`; a saída é usar o equivalente do app, como o AsyncStorage no E39
- **Recurso novo que o motor ainda não tem**: um método recém-aprovado pode faltar no Hermes, e o erro diz que aquilo `is not a function`

```javascript
const ordenados = produtos.toSorted((a, b) => a.preco - b.preco);  // recente: confira antes
const copia = [...produtos].sort((a, b) => a.preco - b.preco);     // funciona em todos
```

:::tip
Antes de usar algo de um tutorial de site, pergunte: é da linguagem ou do navegador? É recente? Teste no Expo Go antes de espalhar pelo app.
:::

---

## :icon[wand] Transpilação: o Babel dentro do Metro

Nem tudo o que você escreve é JavaScript que o motor entende. O **JSX** não existe no ECMAScript: nenhum motor sabe o que é `<Botao />`.

Antes de chegar ao celular, cada arquivo passa pelo **Babel**, um **transpilador**: ele lê o código e o reescreve em JavaScript que o motor executa.

```jsx
// o que você escreve
<Botao titulo="Comprar" onPress={comprar} />
```

```javascript
// o que o Hermes recebe (simplificado)
jsx(Botao, { titulo: 'Comprar', onPress: comprar });
```

O Expo já traz o Babel configurado, com o `babel-preset-expo`, e o **Metro** o chama a cada arquivo salvo. Você não instala nem configura nada.

---

## :icon[workflow] Do editor ao celular

:::center
![Animação: o JSX do Detalhe.js vira JavaScript no Babel, segue no bundle pela Wi-Fi e a tela do Expo Go se atualiza](images/e21-do-editor-ao-celular.svg)
:::

:::steps
1. Você salva `src/telas/Detalhe.js` no editor
2. O **Metro**, que roda no Node do seu computador, percebe a mudança
3. O Babel transforma o JSX e o código do arquivo
4. O Metro junta o código num **bundle**, o pacote que o app executa
5. O Expo Go recebe o código novo pela rede Wi-Fi
6. O Hermes executa, e a tela se atualiza
:::

No app publicado (E44), o bundle vai junto, já em bytecode, sem Metro nem computador. Por isso o `console.log` do app só aparece no terminal do `npx expo start` durante o desenvolvimento.

---

## :icon[terminal] O Node no seu dia a dia

O **Node.js** é um runtime de JavaScript para o computador: o motor V8 mais acesso a arquivos, rede e terminal. Para quem programa apps, ele é a base de quase todas as ferramentas:

| Ferramenta | Comando | Quando |
|---|---|---|
| Expo CLI e Metro | `npx expo start` | desde o primeiro app |
| npm | `npm install` e `npx expo install` | E22 |
| ESLint | `npx expo lint` | E23 |
| Jest | `npm test` | E24 |
| Seus scripts | `node scripts/relatorio-catalogo.mjs` | hoje |

Sem Node, não há `npx expo start`. É por isso que ele foi a primeira coisa instalada no curso.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Achar que o app roda no Node do computador: o Node prepara e entrega; quem executa é o Hermes no celular
- Colar código de tutorial de site com `document` ou `localStorage`: no app, o erro é `Property '...' doesn't exist`
- Usar um método recém-aprovado sem testar no Expo Go: o que roda no Chrome pode faltar no Hermes
- Procurar o `console.log` do app no navegador: ele aparece no terminal do `npx expo start`
- Confundir ECMAScript (a norma), motor (quem executa) e runtime (motor mais APIs)
:::

---

## Resumo

:::summary
- O ECMAScript é a norma da linguagem; o TC39 aprova as mudanças, publicadas numa edição por ano
- O motor executa o código: V8 no Chrome e no Node, JavaScriptCore no Safari, Hermes no app
- O Hermes compila o código antes, em bytecode, e por isso o app abre mais rápido
- Runtime é o motor mais as APIs do lugar: `document` no navegador, `fs` no Node, `Alert` no app
- O Metro roda no Node, passa cada arquivo pelo Babel e entrega o código ao celular
:::

---

## :icon[arrow-right] Próximos passos

Na aula 24, o Node deixa de ser só o motor das ferramentas dos outros e vira ferramenta sua:

- :icon[terminal] o REPL e o `node arquivo.mjs` para testar ideias e rodar scripts
- :icon[file-code] módulos ES e CommonJS, e por que os seus scripts terminam em `.mjs`
- :icon[folder-open] `process.argv`, `fs` e `path` para ler argumentos e arquivos
- :icon[braces] o catálogo da Lojinha em JSON e um script que gera um relatório dele
