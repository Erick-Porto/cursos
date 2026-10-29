---
title: Event loop e callbacks
summary: Por que o programa não pode parar para esperar, como o event loop organiza as esperas e onde os callbacks complicam.
module: classes-e-controle
duration_minutes: 40
objectives:
  - Diferenciar código síncrono de assíncrono e explicar por que um laço longo trava o programa
  - Prever a ordem de execução com a pilha de chamadas, a fila de tarefas e o event loop
  - Usar setTimeout, clearTimeout e setInterval sem deixar timers soltos
  - Escrever callbacks com erro primeiro e reconhecer o callback hell
---

# Event loop e callbacks

Programador Mobile · Encontro E18 · Aula 35 de 89

---

## O que você vai aprender

:::goal
- Explicar por que um laço longo deixa o programa inteiro parado
- Acompanhar a pilha de chamadas, a fila de tarefas e o event loop
- Prever a ordem de execução de código com `setTimeout`
- Usar `setTimeout`, `clearTimeout` e `setInterval` sem deixar timers soltos
- Escrever callbacks com erro primeiro e reconhecer o callback hell
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **síncrono** | uma coisa de cada vez: a próxima linha só começa quando a anterior termina |
| **assíncrono** | pedir agora e receber depois, sem ficar parado esperando |
| **thread** | a linha de execução do programa; o JavaScript tem uma só |
| **event loop** | o laço (*loop*) que entrega a próxima tarefa pronta quando o programa fica livre |
| **callback** | uma função que você entrega para outra chamar depois: "me chame quando terminar" |
| **timer** | um agendamento: "rode esta função daqui a tantos milissegundos" |

---

## O programa que ficou parado

Hoje o checkout do `lojinha-regras` responde na hora: somar os itens, calcular o frete e conferir o cupom levam microssegundos. No E19, ele passa a conversar com um servidor, e cada resposta leva de meio segundo a alguns segundos.

Se o JavaScript ficar parado esperando cada resposta, nada mais acontece nesse tempo: nenhum "Processando...", nenhum outro cliente atendido. No app da Lojinha, a partir do E30, é pior: a tela congela, o botão não reage e o cliente toca de novo, achando que não funcionou. Dois toques podem virar dois pedidos.

:::question
Como o programa espera o servidor e, ao mesmo tempo, continua fazendo outras coisas?
:::

---

## Síncrono

O que acontece no restaurante se o único garçom esperar parado na cozinha?

---

## :icon[list-ordered] Síncrono: uma linha de cada vez

Imagine um restaurante com um garçom só. No jeito **síncrono**, ele leva o pedido à cozinha e fica lá, parado, até o prato sair. Só depois atende a próxima mesa.

No código síncrono, cada linha só começa quando a anterior termina. É assim que as regras do `lojinha-regras` funcionam:

```javascript
const sub = subtotal(itens);                              // 1. soma os itens
const frete = freteDoCep(sub, cep);                       // 2. usa o subtotal
const centavos = paraCentavos(sub) + paraCentavos(frete); // 3. usa os dois
console.log(formatarPreco(paraReais(centavos)));          // 4. imprime o total
```

- A ordem de execução é a ordem do texto
- Cada passo leva microssegundos: ninguém percebe a espera
- Ótimo para cálculo; um problema quando um passo depende de algo lento, como a rede

---

## :icon[cpu] Uma thread para tudo

O JavaScript roda numa **thread** (linha de execução) só: é o garçom sozinho. Enquanto ela está ocupada, nada mais do seu código acontece. Veja o que sai de `node trava.js`:

```javascript
function esperarTravando(ms) {
  const fim = Date.now() + ms;
  while (Date.now() < fim) {} // gira sem parar: a thread não fica livre
}

console.log('1. Ana finalizou a compra');
esperarTravando(2000); // "espera" o servidor
console.log('2. Pedido da Ana confirmado');
console.log('3. Bia consultou o frete'); // esperou 2 s sem motivo
```

- `Date.now()` dá a hora de agora, em milissegundos (1 s = 1000 ms)
- O `while` repete enquanto a hora não chega: gira sem fazer nada, e a thread fica presa

O 1 aparece, o terminal fica 2 s parado e o 2 e o 3 saem juntos. A Bia não dependia da Ana, mas esperou na fila. No app, quem espera é o dedo do cliente: durante o laço, nenhum toque tem resposta.

---

## Assíncrono

E como trabalha um bom garçom quando a cozinha demora?

---

## :icon[hourglass] Assíncrono: pedir agora, receber depois

No jeito **assíncrono**, o garçom anota o pedido, leva à cozinha e vai atender as outras mesas. Quando a cozinha chama, ele volta e serve.

No código, você pede algo que demora e diz o que fazer quando ficar pronto. A thread fica livre no meio tempo. Agora, `node espera.js`:

```javascript
console.log('1. Ana finalizou a compra');
setTimeout(() => {
  console.log('3. Pedido da Ana confirmado');
}, 2000);
console.log('2. Bia consultou o frete'); // na hora
```

No terminal aparecem **1 e 2 na hora e, dois segundos depois, 3**. O **`setTimeout`** (marque um tempo) agenda a função para daqui a 2000 ms e devolve o controle na hora: a linha da Bia não espera.

Aqui o `setTimeout` faz o papel do servidor. Você já o usou no `debounce` do E10.

---

## :icon[hourglass] Assíncrono na prática

**Caso 1: o "Processando..." aparece durante a espera.**

```javascript
console.log('Pagamento enviado.');
setTimeout(() => console.log('Pagamento aprovado!'), 1500);
console.log('Processando...');
```

```plaintext
Pagamento enviado.
Processando...
Pagamento aprovado!        (1,5 s depois)
```

**Caso 2: quem fica pronto primeiro sai primeiro.** A ordem do texto não decide:

```javascript
setTimeout(() => console.log('Pedido da Ana pronto'), 2000);
setTimeout(() => console.log('Pedido da Bia pronto'), 1000);
console.log('Dois pedidos anotados');
```

```plaintext
Dois pedidos anotados
Pedido da Bia pronto       (1 s depois)
Pedido da Ana pronto       (2 s depois)
```

---

## :icon[timer] Travar ou esperar, na linha do tempo

:::center
![Linha do tempo: no trava.js, a thread fica presa 2 s no laço e a Bia só é atendida depois do pedido da Ana; no espera.js, a thread fica livre, a Bia é atendida na hora e o pedido da Ana chega aos 2 s](images/e18-trava-ou-espera.svg)
:::

Os dois scripts esperam os mesmos 2 s pela Ana. No `trava.js`, a thread gira no laço e a Bia espera junto. No `espera.js`, a thread fica livre: a Bia é atendida na hora e o pedido da Ana chega quando o timer vence.

---

## O event loop

Quem avisa o garçom que o prato ficou pronto? E quando ele vai buscar?

---

## :icon[layers] As três peças por trás da espera

Três peças, ligadas pelo **event loop** (laço de eventos):

| Peça | O que faz | No restaurante |
|---|---|---|
| **Pilha de chamadas** | roda as funções de agora | o que o garçom faz agora |
| **Ambiente** | espera fora: timers, rede | a cozinha |
| **Fila de tarefas** | guarda os callbacks prontos | os pratos prontos no balcão |
| **Event loop** | leva a próxima tarefa à pilha vazia | o garçom livre olha o balcão |

O V8, o motor do JavaScript no Node, só executa o que está na pilha. Quem conta o tempo e fala com a rede é o **ambiente**: o Node, o navegador ou, no celular, o React Native.

---

## :icon[repeat] O event loop passo a passo

O **event loop** é o laço que liga as peças: quando a pilha esvazia, ele pega a próxima tarefa da fila e a coloca na pilha. Acompanhe o `espera.js`:

:::steps
1. `console.log('1...')` entra na pilha, roda e sai
2. `setTimeout` entrega o callback ao ambiente, que começa a contar 2 s
3. `console.log('2...')` roda; a pilha esvazia e a thread fica livre
4. Passados 2 s, o ambiente põe o callback na fila de tarefas
5. O event loop vê a pilha vazia e move o callback para ela
6. `console.log('3...')` roda; sem nada mais agendado, o Node encerra o script
:::

Regra de ouro: **um callback nunca interrompe código que já está rodando**. Ele espera a pilha esvaziar.

---

## :icon[repeat] O caminho do callback

:::center
![Animação: o callback do setTimeout sai da pilha para o ambiente, espera 2 s, entra na fila de tarefas e o event loop o devolve à pilha vazia; o terminal mostra a Ana, a Bia e, por último, o pedido da Ana confirmado](images/e18-event-loop-timer.svg)
:::

Enquanto o callback espera no ambiente e na fila de tarefas, a pilha fica vazia e a thread fica livre para outro trabalho, como atender a Bia. Ele só volta à pilha pelo event loop, quando ela está vazia: por isso o 3 aparece por último.

A pilha é a mesma que o depurador do E03 mostra num breakpoint.

---

## Pense

:::question
Em que ordem as mensagens aparecem no terminal?

```javascript
console.log('A: abre o checkout');
setTimeout(() => console.log('B: frete calculado'), 500);
setTimeout(() => console.log('C: cupom conferido'), 0);
console.log('D: mostra o resumo');
```
:::

:::tip Resposta
**A, D, C, B.** A e D são síncronos e rodam primeiro. C tem atraso 0, mas mesmo assim vai para a fila e espera a pilha esvaziar. B só entra na fila depois de 500 ms. Atraso 0 não quer dizer "agora": quer dizer "assim que possível, depois do código atual".
:::

---

## Timers

O timer da cozinha apitou, mas o garçom está ocupado. O prato sai na hora?

---

## :icon[timer] setTimeout: espera mínima, não exata

Um **timer** é um agendamento, como o timer da cozinha: quando ele apita, o prato vai para o balcão. Mas o garçom só leva o prato quando fica livre. O número do `setTimeout` é o tempo **mínimo** até o callback entrar na fila. Se a thread estiver ocupada, ele espera mais:

```javascript
const inicio = Date.now();
setTimeout(() => {
  console.log(`O lembrete apareceu depois de ${Date.now() - inicio} ms`);
}, 100);
const fim = Date.now() + 1000;
while (Date.now() < fim) {} // 1 segundo de trabalho síncrono
```

No Node, a saída mostra cerca de **1000 ms**, e não 100: o callback ficou na fila até o laço terminar.

O `setTimeout` devolve um **id**, o número do agendamento. `clearTimeout(id)` (limpe o timer) cancela o agendamento antes de ele rodar, como o `debounce` do E10 faz a cada nova chamada.

---

## :icon[timer] Timers na prática

**Caso 1: cancelar um lembrete.** A pessoa voltou à loja antes dos 3 s:

```javascript
const lembrete = setTimeout(() => console.log('Seu carrinho está esperando!'), 3000);
clearTimeout(lembrete);
console.log('Lembrete cancelado.');
```

```plaintext
Lembrete cancelado.
```

O lembrete nunca aparece, e o script termina na hora: não sobrou timer para esperar.

**Caso 2: atraso 0 não fura a fila.**

```javascript
setTimeout(() => console.log('2. o timer de 0 ms'), 0);
console.log('1. o código atual');
```

```plaintext
1. o código atual
2. o timer de 0 ms
```

---

## :icon[timer-reset] setInterval: o prazo do Pix

`setInterval` (marque um intervalo) repete o callback a cada intervalo, como um alarme que toca de segundo em segundo até alguém desligar. Quem desliga é o `clearInterval`. O código Pix da Lojinha expira em 10 minutos; para testar, conte 10 segundos:

```javascript
let restantes = 10; // na loja, 600: 10 minutos

const id = setInterval(() => {
  restantes = restantes - 1;
  const mm = String(Math.floor(restantes / 60)).padStart(2, '0');
  const ss = String(restantes % 60).padStart(2, '0');
  console.log(`O código Pix expira em ${mm}:${ss}`);
  if (restantes === 0) {
    clearInterval(id); // sem isso, o timer repete para sempre
    console.log('Código expirado: gere outro Pix.');
  }
}, 1000);
```

- Enquanto houver um timer ativo, o Node não encerra o script
- Sem o `clearInterval`, a contagem segue negativa e o terminal só volta com <kbd>Ctrl</kbd> + <kbd>C</kbd>
- No app, o timer também precisa parar quando a tela fecha

---

## :icon[list-ordered] O prazo do Pix em português

| Linha | O que ela diz |
|---|---|
| `let restantes = 10` | os segundos que faltam; `let`, porque o valor muda |
| `const id = setInterval(..., 1000)` | "rode esta função a cada 1000 ms" e guarde o número do timer |
| `Math.floor(restantes / 60)` | os minutos inteiros, como no E05 |
| `restantes % 60` | o resto da divisão: os segundos |
| `String(...).padStart(2, '0')` | completa com zero à esquerda, como no E06: `9` vira `09` |
| `clearInterval(id)` | desliga o alarme quando a contagem chega a 0 |

A cada volta, a função enxerga o `restantes` atualizado: é a mochila da closure do E10.

---

## Callbacks

Que recado você deixa na cozinha para não ficar esperando lá?

---

## :icon[phone] Callbacks: "me chame quando terminar"

Um **callback** (chamar de volta) é uma função que você entrega para outra chamar depois. No restaurante, é o recado que fica com a cozinha: "quando o prato ficar pronto, leve à mesa 4". Você não espera parado: deixa o recado e segue.

```javascript
function avisarPronto() {
  console.log('Pedido pronto!');
}

setTimeout(avisarPronto, 1000); // entrega a função; quem a chama é o ambiente
console.log('Pedido anotado.');
```

```plaintext
Pedido anotado.
Pedido pronto!
```

O `avisarPronto` vai **sem parênteses**: você entrega a função, não a chama. Com parênteses, ela rodaria na hora, e o `setTimeout` receberia o resultado dela.

---

## :icon[list] Callbacks que você já usa

| Callback | Quem chama | Quando |
|---|---|---|
| `itens.map((i) => i.preco)` | o `map` | agora, para cada item |
| `setTimeout(() => lembrar(), 3000)` | o ambiente, pela fila | daqui a 3 s |
| `debounce(buscar, 300)` | o timer do `debounce` | 300 ms depois da última chamada |
| `onPress={() => comprar()}`, no app | o React Native | no toque |

O do `map` é **síncrono**: roda inteiro antes da próxima linha. O do timer e o do toque são **assíncronos**: passam pela fila. Receber um callback não torna uma função assíncrona; o que importa é **quando** ela o chama.

---

## :icon[circle-alert] Erro primeiro: a convenção dos callbacks

Quando a cozinha não consegue fazer o prato, ela avisa primeiro: "acabou o frango". Uma função assíncrona não devolve o resultado com `return`: quando ele chega, a função já terminou. Por convenção, o callback recebe primeiro o **erro** (ou `null`, se deu certo) e depois o resultado:

```javascript
function consultarFrete(cep, callback) {
  setTimeout(() => {
    if (!/^\d{5}-?\d{3}$/.test(cep)) return callback(new Error('CEP inválido'));
    callback(null, 19.9);
  }, 800);
}

consultarFrete('01310-100', (erro, valor) => {
  if (erro) return console.log('Erro:', erro.message);
  console.log('Frete:', valor);
});
```

:::warning
Um `try/catch` em volta de `consultarFrete` não pega um erro lançado dentro do callback: quando ele roda, o `try` já terminou há 800 ms, e o erro derruba o script. Por isso o erro viaja como parâmetro.
:::

---

## :icon[list-ordered] O consultarFrete em português

| Linha | O que ela diz |
|---|---|
| `function consultarFrete(cep, callback)` | recebe o CEP e a função que vai avisar no fim |
| `setTimeout(() => { ... }, 800)` | finge que o servidor leva 800 ms |
| `/^\d{5}-?\d{3}$/.test(cep)` | a regex do CEP do E06: "o CEP tem o formato certo?" |
| `return callback(new Error(...))` | deu errado: avisa com o erro no primeiro lugar e para ali |
| `callback(null, 19.9)` | deu certo: `null` no lugar do erro e o frete em segundo |
| `(erro, valor) => { if (erro) ... }` | quem chama confere o erro antes de usar o valor |

---

## :icon[circle-alert] Erro primeiro na prática

Com o mesmo `consultarFrete`, um callback com nome serve para os dois casos:

```javascript
function mostrar(erro, valor) {
  if (erro) return console.log('Erro:', erro.message);
  console.log('Frete:', valor);
}

consultarFrete('01310-100', mostrar);
consultarFrete('123', mostrar);
```

```plaintext
Frete: 19.9
Erro: CEP inválido
```

- As duas respostas chegam 800 ms depois, na ordem em que foram pedidas
- O `mostrar` vai sem parênteses: quem o chama é o `consultarFrete`, quando a resposta fica pronta
- O script não cai no CEP errado: o erro chegou como parâmetro, não como `throw`

---

## Callback hell

E se cada prato só pudesse ser pedido quando o anterior chegasse?

---

## :icon[workflow] O checkout em callbacks

Quando cada etapa espera a anterior, os callbacks entram um dentro do outro, como um recado dentro de outro recado. O código vira uma escada que desce para a direita: é o **callback hell** (inferno dos callbacks). O checkout tem quatro etapas, cada uma **dentro** da anterior:

```javascript
validarEstoque(itens, (erro) => {
  if (erro) return mostrarErro(erro);
  reservar(itens, (erro, reserva) => {
    if (erro) return mostrarErro(erro);
    cobrar(total, pagamento, (erro, cobranca) => {
      if (erro) return mostrarErro(erro);
      confirmar(reserva, cobranca, (erro, pedido) => {
        if (erro) return mostrarErro(erro);
        console.log(`Pedido nº ${pedido.numero} confirmado.`);
      });
    });
  });
});
```

Funciona. Agora imagine acrescentar o cupom, o tempo limite do pagamento e o registro do pedido no histórico.

---

## :icon[mountain] Callback hell: por que dói

Esse formato também se chama pirâmide da perdição. Os problemas aparecem no primeiro ajuste:

- Cada etapa nova empurra o código mais para a direita
- O tratamento de erro se repete em todo nível; esqueça um e a falha some sem aviso
- Rodar duas consultas ao mesmo tempo e esperar as duas exige contadores feitos à mão
- Um callback chamado duas vezes pode cobrar o cliente duas vezes
- Testar exige callbacks falsos em cada nível

Na próxima aula, as **Promises** achatam a pirâmide numa sequência com um único tratamento de erro.

---

## :icon[triangle-alert] Erros comuns

:::warning
- "Esperar" com laço `while` ou cálculo pesado: o programa inteiro para, e no app a tela congela
- Achar que `setTimeout(fn, 0)` roda na hora: ele espera o código atual terminar
- Usar na linha seguinte o resultado de uma função assíncrona, como se ele já existisse
- `setInterval` sem `clearInterval`: o timer repete para sempre e o script não termina
- `try/catch` em volta de quem agenda o callback, esperando pegar o erro que acontece dentro dele
:::

---

## Resumo

:::summary
- O JavaScript roda numa thread só; trabalho síncrono longo deixa todo o resto esperando
- Assíncrono é pedir agora e receber depois: o ambiente espera e a thread fica livre
- O event loop move tarefas da fila para a pilha de chamadas só quando ela está vazia
- O atraso do `setTimeout` é mínimo; `clearTimeout` e `clearInterval` cancelam timers
- Callbacks com erro primeiro funcionam, mas em sequência viram o callback hell
:::

---

## Próximos passos

Na aula 36, você reescreve o checkout com **Promises**: estados, `then`, `catch`, `finally`, encadeamento e as combinações `Promise.all`, `Promise.allSettled` e `Promise.race`.

No laboratório, o `finalizarCompra` do `lojinha-regras` passa por quatro etapas assíncronas, e o terminal mostra cada uma enquanto espera.

:::tip Para treinar
Salve os exemplos desta aula em arquivos `.js` e rode cada um com `node`, prevendo a ordem antes de olhar a saída. Depois troque os atrasos e preveja de novo.
:::
