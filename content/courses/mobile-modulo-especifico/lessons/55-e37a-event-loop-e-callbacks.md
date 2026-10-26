---
title: Event loop e callbacks
summary: Por que a tela não pode travar, como o event loop organiza as esperas e onde os callbacks se complicam.
module: linguagem-js
duration_minutes: 40
objectives:
  - Diferenciar código síncrono de assíncrono e explicar por que um laço longo trava o app
  - Prever a ordem de execução com a pilha de chamadas, a fila de tarefas e o event loop
  - Usar setTimeout, clearTimeout e setInterval sem deixar timers soltos
  - Escrever callbacks com erro primeiro e reconhecer o callback hell
---

# Event loop e callbacks

Programador Mobile: Módulo Específico · Encontro E37 · Aula 55 de 71

---

## O que você vai aprender

:::goal
- Explicar por que um trabalho longo no `onPress` trava o app
- Acompanhar a pilha de chamadas, a fila de tarefas e o event loop
- Prever a ordem de execução de código com `setTimeout`
- Usar `setTimeout`, `clearTimeout` e `setInterval` sem deixar timers soltos
- Escrever callbacks com erro primeiro e reconhecer o callback hell
:::

---

## A tela que congelou

Você toca em **Finalizar compra** na Lojinha. O app precisa conferir o estoque, reservar os produtos, cobrar e confirmar. Num app de verdade, cada etapa é uma conversa com um servidor, que leva de meio segundo a alguns segundos.

Se o JavaScript ficar parado esperando cada resposta, o app parece travado: o botão não reage, a tela não muda e o cliente toca de novo, achando que não funcionou. Dois toques podem virar dois pedidos.

:::question
Como o app espera o servidor e, ao mesmo tempo, continua respondendo ao dedo do cliente?
:::

---

## :icon[list-ordered] Síncrono: uma linha de cada vez

No código **síncrono**, cada linha só começa quando a anterior termina. É assim que as regras da Lojinha funcionam:

```javascript
const sub = subtotal(itens);           // 1. soma os itens
const frete = calcularFrete(sub, cep); // 2. usa o subtotal
const total = sub + (frete ?? 0);      // 3. usa os dois
setResumo({ sub, frete, total });      // 4. atualiza a tela
```

- A ordem de execução é a ordem do texto
- Cada passo leva microssegundos: ninguém percebe a espera
- Ótimo para cálculo; um problema quando um passo depende de algo lento, como a rede

---

## :icon[cpu] Uma thread para tudo

O JavaScript do app roda numa **thread** só, uma única linha de execução. É ela que roda os componentes, trata os toques e executa as suas funções. Enquanto ela está ocupada, nada mais do JavaScript acontece.

```jsx
function finalizarTravando() {
  const fim = Date.now() + 3000;
  while (Date.now() < fim) {} // "espera" 3 segundos sem soltar a thread
  setMensagem('Pedido confirmado');
}
```

| Durante os 3 segundos | O que o cliente vê |
|---|---|
| Toques em botões | nenhuma resposta |
| `setState` | a tela não muda |
| Animação feita em JavaScript | parada |

Animações com `useNativeDriver: true`, do E19, continuam: elas rodam no lado nativo, fora dessa thread.

---

## :icon[hourglass] Assíncrono: pedir agora, receber depois

No código **assíncrono**, você pede algo que demora e diz o que fazer quando ficar pronto. A thread fica livre no meio tempo.

```javascript
console.log('1. Toque em Finalizar');
setTimeout(() => {
  console.log('3. Servidor respondeu');
}, 2000);
console.log('2. Tela mostra "Processando..."');
```

No terminal aparecem **1, 2 e, dois segundos depois, 3**. O `setTimeout` agenda a função e devolve o controle na hora: a linha 2 não espera.

Aqui o `setTimeout` faz o papel do servidor. Você já o usou no E19, para simular o carregamento do Início, e no `useDebounce` do E35. Hoje você vê o que acontece por baixo.

---

## :icon[layers] As três peças por trás da espera

| Peça | O que faz | No checkout |
|---|---|---|
| **Pilha de chamadas** | guarda as funções que estão rodando agora | `finalizar()` chamou `calcularTotal()` |
| **Ambiente** | espera fora do JavaScript: timers, rede, disco | o timer de 2 s, a resposta do servidor |
| **Fila de tarefas** | guarda os callbacks prontos para rodar | o callback do timer que já venceu |

O motor (o Hermes, no app) só executa o que está na pilha. Quem conta o tempo e fala com a rede é o **ambiente**: o React Native no celular, o navegador ou o Node.

É a mesma pilha que o React Native DevTools mostra quando um breakpoint para o código.

---

## :icon[repeat] O event loop passo a passo

O **event loop** é o laço que liga as peças: quando a pilha esvazia, ele pega a próxima tarefa da fila e a coloca na pilha. Acompanhe o exemplo do "Processando...":

:::steps
1. `console.log('1...')` entra na pilha, roda e sai
2. `setTimeout` entrega o callback ao ambiente, que começa a contar 2 s
3. `console.log('2...')` roda; a pilha esvazia e o app fica livre para toques e para a tela
4. Passados 2 s, o ambiente põe o callback na fila de tarefas
5. O event loop vê a pilha vazia e move o callback para ela
6. `console.log('3...')` roda
:::

Regra de ouro: **um callback nunca interrompe código que já está rodando**. Ele espera a pilha esvaziar.

---

## :icon[repeat] O caminho do callback

:::center
![Animação: o callback do setTimeout sai da pilha para o ambiente, espera 2 s, entra na fila de tarefas e o event loop o devolve à pilha vazia; o terminal mostra 1, 2 e, por último, 3](images/e37-event-loop-timer.svg)
:::

Enquanto o callback espera no ambiente e na fila de tarefas, a pilha fica vazia e o app responde aos toques. Ele só volta à pilha pelo event loop, quando ela está vazia: por isso o "3" aparece por último.

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

## :icon[timer] setTimeout: espera mínima, não exata

O número do `setTimeout` é o tempo **mínimo** até o callback entrar na fila. Se a thread estiver ocupada, ele espera mais:

```javascript
const inicio = Date.now();
setTimeout(() => {
  console.log(`O toast sumiu depois de ${Date.now() - inicio} ms`);
}, 100);
const fim = Date.now() + 1000;
while (Date.now() < fim) {} // 1 segundo de trabalho síncrono
```

No Node, a saída mostra cerca de **1000 ms**, e não 100: o callback ficou na fila até o laço terminar.

O `setTimeout` devolve um **id**. `clearTimeout(id)` cancela o agendamento antes de ele rodar, como o `useDebounce` do E35 faz a cada letra digitada na busca.

---

## :icon[timer-reset] setInterval: o prazo do Pix

`setInterval` repete o callback a cada intervalo, até `clearInterval`. Na tela do Pix, o código expira em 10 minutos:

```jsx
const [segundos, setSegundos] = useState(600);

useEffect(() => {
  const id = setInterval(() => {
    setSegundos((s) => (s > 0 ? s - 1 : 0));
  }, 1000);
  return () => clearInterval(id); // a tela fechou: pare o timer
}, []);

const mm = String(Math.floor(segundos / 60)).padStart(2, '0');
const ss = String(segundos % 60).padStart(2, '0');
// <Text>O código expira em {mm}:{ss}</Text>
```

- `setSegundos((s) => ...)` lê o valor atual; o `segundos` da closure ficaria parado em 600
- Sem o `clearInterval`, o timer continua depois que a tela fecha

---

## :icon[phone] Callbacks: "me chame quando terminar"

Um **callback** é uma função que você entrega para outra chamar depois. Você já usa vários:

| Callback | Quem chama | Quando |
|---|---|---|
| `onPress={() => comprar()}` | o React Native | no toque |
| `itens.map((i) => i.preco)` | o `map` | agora, para cada item |
| `setTimeout(() => esconder(), 3000)` | o ambiente, pela fila | daqui a 3 s |

O do `map` é **síncrono**: roda inteiro antes da próxima linha. O do toque e o do timer são **assíncronos**: passam pela fila de tarefas. Receber um callback não torna uma função assíncrona; o que importa é **quando** ela o chama.

---

## :icon[circle-alert] Erro primeiro: a convenção dos callbacks

Uma função assíncrona não devolve o resultado com `return`: quando ele chega, a função já terminou. Por convenção, o callback recebe primeiro o **erro** (ou `null`) e depois o resultado:

```javascript
function consultarFrete(cep, callback) {
  setTimeout(() => {
    if (!/^\d{5}-?\d{3}$/.test(cep)) return callback(new Error('CEP inválido'));
    callback(null, 19.9);
  }, 800);
}

consultarFrete('01310-100', (erro, valor) => {
  if (erro) return setErroCep(erro.message);
  setFrete(valor);
});
```

:::warning
Um `try/catch` em volta de `consultarFrete` não pega um erro lançado dentro do callback: quando ele roda, o `try` já terminou há 800 ms. Por isso o erro viaja como parâmetro.
:::

---

## :icon[workflow] O checkout em callbacks

As quatro etapas do checkout dependem uma da outra. Com callbacks, cada etapa entra **dentro** da anterior:

```javascript
validarEstoque(itens, (erro) => {
  if (erro) return mostrarErro(erro);
  reservar(itens, (erro, reserva) => {
    if (erro) return mostrarErro(erro);
    cobrar(total, pagamento, (erro, cobranca) => {
      if (erro) return mostrarErro(erro);
      confirmar(reserva, cobranca, (erro) => {
        if (erro) return mostrarErro(erro);
        router.replace('/confirmacao');
      });
    });
  });
});
```

Funciona. Agora imagine acrescentar o cupom, o tempo limite do pagamento e o registro em "Meus pedidos".

---

## :icon[mountain] Callback hell: por que dói

Esse formato tem nome: **callback hell**, ou pirâmide da perdição. Os problemas aparecem no primeiro ajuste:

- Cada etapa nova empurra o código mais para a direita
- O tratamento de erro se repete em todo nível; esqueça um e a falha some sem aviso
- Rodar duas consultas ao mesmo tempo e esperar as duas exige contadores feitos à mão
- Um callback chamado duas vezes pode cobrar o cliente duas vezes
- Testar exige callbacks falsos em cada nível

Na próxima aula, as **Promises** achatam a pirâmide numa sequência com um único tratamento de erro.

---

## :icon[triangle-alert] Erros comuns

:::warning
- "Esperar" com laço `while` ou cálculo pesado no `onPress`: o app para de responder
- Achar que `setTimeout(fn, 0)` roda na hora: ele espera o código atual terminar
- Usar na linha seguinte o resultado de uma função assíncrona, como se ele já existisse
- `setInterval` sem `clearInterval` no retorno do `useEffect`: o timer segue depois que a tela fecha
- `try/catch` em volta de quem agenda o callback, esperando pegar o erro que acontece dentro dele
:::

---

## Resumo

:::summary
- O JavaScript do app roda numa thread só; trabalho síncrono longo deixa os toques sem resposta
- Assíncrono é pedir agora e receber depois: o ambiente espera e a thread fica livre
- O event loop move tarefas da fila para a pilha de chamadas só quando ela está vazia
- O atraso do `setTimeout` é mínimo; `clearTimeout` e `clearInterval` cancelam timers
- Callbacks com erro primeiro funcionam, mas em sequência viram o callback hell
:::

---

## Próximos passos

Na aula 56, você reescreve o checkout com **Promises**: estados, `then`, `catch`, `finally`, encadeamento e as combinações `Promise.all`, `Promise.allSettled` e `Promise.race`.

No laboratório, o botão **Finalizar compra** passa por um serviço assíncrono, e a tela mostra cada etapa enquanto espera.

:::tip Antes da próxima aula
Rode no Node os exemplos desta aula com `node arquivo.mjs` e preveja a ordem antes de olhar a saída. Depois troque os atrasos e preveja de novo.
:::
