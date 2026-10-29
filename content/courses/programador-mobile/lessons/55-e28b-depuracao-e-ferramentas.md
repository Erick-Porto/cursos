---
title: Depuração e ferramentas do Expo
summary: Menu do desenvolvedor, console no terminal, tela vermelha, aviso amarelo, breakpoints e um método para achar bugs.
module: react-native
duration_minutes: 40
objectives:
  - Usar o menu do desenvolvedor e o console do Expo
  - Ler a tela de erro e os avisos
  - Pausar o app com breakpoints no React Native DevTools
  - Aplicar um método para encontrar bugs
---

# Depuração e ferramentas do Expo

Programador Mobile · Encontro E28 · Aula 55 de 89

---

## O que você vai aprender

:::goal
- Abrir o menu do desenvolvedor e usar o console do Expo
- Ler a tela vermelha de erro e o aviso amarelo
- Ver props e estado e pausar o app com breakpoints no React Native DevTools, como no E03
- Recarregar, limpar o cache e mostrar um bug no Expo Snack
- Aplicar um método de 4 passos para encontrar bugs
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **depurar** | achar e corrigir um erro no código (em inglês, *debug*) |
| **bug** | um defeito no código: o app quebra ou faz a coisa errada |
| **aviso** | uma mensagem amarela (*warning*): o app continua, mas algo está errado |
| **stack trace** | a lista de quem chamou quem, do ponto do erro até o `App` |
| **breakpoint** | ponto de parada: a linha onde o app pausa para você olhar por dentro |
| **cache** | uma cópia guardada para ir mais rápido, que às vezes fica velha |

---

## Todo app quebra

Você salva o `App.js`, olha para o celular e vê uma tela vermelha cheia de texto. Dá vontade de fechar tudo.

Calma: a tela está dizendo **exatamente** onde e por que quebrou. **Depurar** (encontrar e corrigir bugs) é parte do trabalho de todo dia, não sinal de que você errou a carreira.

:::question
Quando o código quebra, qual é a primeira coisa que você faz hoje: lê a mensagem ou muda alguma coisa para ver se resolve?
:::

---

## Menu do desenvolvedor

Numa loja, o que existe atrás da porta "só funcionários"?

---

## :icon[smartphone] O menu do desenvolvedor

O **menu do desenvolvedor** é a porta "só funcionários" do app: ferramentas que só quem programa vê. Com o app aberto no Expo Go, **agite o celular** (ou aperte `m` no terminal do Expo):

| Opção | O que faz |
|---|---|
| Reload (recarregar) | recarrega o app do zero |
| Toggle element inspector (inspetor) | toque em um elemento e veja seus estilos e tamanho |
| Show performance monitor (desempenho) | mostra o FPS, quantas vezes por segundo a tela se redesenha, e o uso de memória |
| Open JS debugger (depurador) | abre o React Native DevTools no computador, como a tecla `j` |

O inspetor de elementos é o "inspecionar" do navegador, na versão celular.

---

## :icon[wrench] O menu na prática

Três usos do menu no `minhas-tarefas-mobile`:

| Você quer | Use | O que aparece |
|---|---|---|
| ver o espaço e as cores de um cartão | o inspetor, tocando no cartão | o tamanho e os estilos dele, como `padding: 16` |
| saber se a lista rola lisa | o monitor de desempenho, rolando a lista | o FPS: perto de 60, a rolagem está lisa |
| começar do zero | Reload | o app abre de novo, com o estado do começo |

Para fechar o inspetor ou o monitor, abra o menu de novo e toque na mesma opção.

---

## Mensagens no terminal

No celular não tem Console. Para onde vai o `console.log`?

---

## :icon[terminal] console.log aparece no terminal

O `console.log` é um recado que o código deixa para você. No celular não existe aba Console: tudo que você registra vai para o **terminal onde rodou `npx expo start`**.

- `console.log`: linha `LOG`, para acompanhar valores
- `console.warn` (*warn*, avisar): linha `WARN`, em amarelo
- `console.error`: linha `ERROR`, em vermelho

Escreva o recado dentro da função que você quer acompanhar, salve e repita a ação no celular.

---

## :icon[message-square] console.log na prática

Para ver a tarefa nova que nasce em `adicionarTarefa`:

```jsx
function adicionarTarefa(titulo) {
  const nova = { id: Date.now(), titulo, prioridade: 'media', concluida: false };
  console.log('nova tarefa:', nova);
  setTarefas([...tarefas, nova]);
}
```

Adicione "Comprar pão" no celular. No terminal:

```plaintext
 LOG  nova tarefa: {"concluida": false, "id": 1728400000000, "prioridade": "media", "titulo": "Comprar pão"}
```

O texto entre aspas no `console.log` é a sua etiqueta: com ela, você acha a linha no meio de muitas.

---

## Tela vermelha

Acendeu a luz vermelha no painel do carro: você segue viagem?

---

## :icon[bug] Tela vermelha: o app parou

Um **erro** derruba o app e mostra uma tela vermelha. É a luz vermelha do painel do carro: pare e veja o que aconteceu. Leia de cima para baixo:

::::columns
:::col
![Diagrama da tela vermelha lida de cima para baixo: 1, a mensagem do erro; 2, o arquivo e a linha; 3, o stack trace, de CartaoTarefa até App](images/e28-tela-vermelha.svg)
:::
:::col
1. **Primeira linha**: a mensagem do erro. É a parte que importa
2. **Arquivo e linha**: onde aconteceu
3. **Stack trace**: quem chamou quem até chegar lá
:::
::::

Neste exemplo, a mensagem é `Text strings must be rendered within a <Text> component`: um texto solto fora de `<Text>`, como `<View>Comprar pão</View>`. Correção: `<View><Text>Comprar pão</Text></View>`.

---

## :icon[siren] Tela vermelha na prática

Três telas vermelhas que a turma vai ver nesta semana:

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Text strings must be rendered within a <Text> component` | há texto solto fora de `<Text>` | envolver o texto em `<Text>` |
| `Property 'Alert' doesn't exist` | o `Alert` faltou no `import` | acrescentar ao `import { ... } from 'react-native'` |
| `Cannot read property 'value' of undefined` | `e.target.value` no `onChangeText` | o parâmetro já é o texto: `onChangeText={setTexto}` |

Corrigiu e salvou? O Fast Refresh tira a tela vermelha sozinho.

---

## Aviso amarelo

E a luz amarela do painel: dá para seguir viagem?

---

## :icon[triangle-alert] Aviso amarelo: roda, mas avise

Um **aviso** (*warning*) é a luz amarela do painel: dá para seguir viagem, mas leve à oficina logo. O app não para: aparece uma faixa amarela no rodapé e uma linha `WARN` no terminal.

```plaintext
 WARN  Each child in a list should have a unique "key" prop.
```

Em português: "cada item de uma lista precisa de uma `key` única", o crachá do item.

:::tip
Trate o aviso como um bug que ainda não apareceu. Toque na faixa para ler a mensagem completa e corrija antes de seguir.
:::

---

## :icon[circle-alert] Avisos na prática

Exemplos frequentes, com a correção:

| O aviso fala de | A causa | A correção |
|---|---|---|
| `unique "key" prop` | `key` faltando ao renderizar listas com `map` | uma `key` única por item, ou a `FlatList` com `keyExtractor` |
| `VirtualizedLists should never be nested...` | `FlatList` dentro de `ScrollView` | tirar a `ScrollView`; usar o cabeçalho da própria lista |
| uma prop com tipo errado | algo como `style="vermelho"` | `style` recebe objeto ou array |

A faixa amarela some quando a causa sai do código.

---

## Pratique

:::example Ache os 2 bugs
Este cartão não reage ao toque e, quando a tarefa está concluída, o app quebra. Encontre os dois problemas.

```jsx
function CartaoTarefa({ titulo, concluida, onAlternar }) {
  return (
    <Pressable onClick={onAlternar} style={estilos.cartao}>
      <Text style={estilos.titulo}>{titulo}</Text>
      {concluida && 'Concluída'}
    </Pressable>
  );
}
```
:::

:::tip Resposta
1. `onClick` não existe no React Native: o `Pressable` usa `onPress`. Falha em silêncio, sem erro
2. `'Concluída'` é um texto solto fora de `<Text>`: tela vermelha `Text strings must be rendered within a <Text> component`. Correção: `{concluida && <Text>Concluída</Text>}`
:::

---

## DevTools

O que o raio X mostra que o olho não vê?

---

## :icon[search] React Native DevTools: a tecla j

O **React Native DevTools** é o raio X do app: mostra por dentro o que a tela não mostra, como props e estado. É o DevTools do navegador, ligado ao JavaScript do celular. Com o app aberto no Expo Go, tecle `j` no terminal do `npx expo start`: ele abre no Chrome ou no Edge.

| Aba | O que mostra |
|---|---|
| Console | os `console.log` do app; aceita expressões |
| Sources (o código) | o seu código, onde entram os breakpoints |
| Components (componentes) | a árvore de componentes, com props e estado |

:::tip
A tecla não abriu nada? Recarregue com `r` e tente de novo.
:::

---

## :icon[scan] DevTools na prática

Na aba **Components**, sem espalhar `console.log`:

- Selecione `App` e veja o array `tarefas`, com cada tarefa e seus campos
- Selecione um `CartaoTarefa` e confira se `titulo` e `concluida` chegaram
- Em `App`, mude o `concluida` de uma tarefa para `true`: o cartão esmaece no celular, sem nenhum toque

Se o `titulo` aparece vazio no `CartaoTarefa`, o problema está em quem manda a prop, e não no cartão. O raio X mostrou onde procurar.

---

## :icon[pause] Breakpoints no app, como no E03

O **breakpoint** é onde o filme pausa (E03): o app para numa linha, e você olha cada variável daquele instante. No app, ele fica na aba **Sources** do DevTools:

:::steps
1. <kbd>Ctrl</kbd> + <kbd>P</kbd> e digite `App` para abrir o `App.js`
2. Clique no número da linha do `setTarefas` de `adicionarTarefa`: nasce um **breakpoint**
3. Adicione uma tarefa no celular: o app **para** naquela linha
4. No painel **Scope**, as variáveis do momento, leia `titulo` e `nova`; <kbd>F10</kbd> anda uma linha e <kbd>F8</kbd> segue até o próximo breakpoint
:::

O **Call Stack** (pilha de chamadas) mostra quem chamou: `adicionarTarefa`, o `adicionar` do `FormularioTarefa` e, embaixo, o React Native tratando o toque. Pausado, o app não responde: é normal.

---

## Recarregar

Você leria o jornal de ontem para saber as notícias de hoje?

---

## :icon[refresh-cw] Recarregar e limpar cache

Ao salvar um arquivo, o **Fast Refresh** atualiza o app sozinho. Quando isso não resolve, você recarrega o app ou limpa o **cache**: a cópia guardada para ir mais rápido, que às vezes fica velha, como o jornal de ontem.

- Tecla `r` no terminal: recarrega o app, como o Reload do menu
- `npx expo start -c`: liga o servidor de novo, com o cache limpo

O `-c` limpa o cache do **empacotador**, o programa que junta os seus arquivos para o celular. Ele guarda versões antigas dos arquivos para ser rápido e, às vezes, mostra código velho.

---

## :icon[rotate-cw] Recarregar na prática

| Situação | O que fazer |
|---|---|
| A tela ficou presa ou estranha | tecla `r` no terminal (ou Reload no menu) |
| Mudou um arquivo e nada aconteceu | `r` de novo; se persistir, pare e rode `npx expo start -c` |
| Instalou um pacote novo | pare o Expo e rode `npx expo start` de novo |
| Mudou o `app.json` | pare o Expo e rode `npx expo start -c` |

"Pare o Expo" é <kbd>Ctrl</kbd> + <kbd>C</kbd> no terminal do servidor. Comece sempre pelo mais leve: `r`, depois o `-c`.

---

## Expo Snack

Como mostrar um problema a alguém que está longe?

---

## :icon[globe] Expo Snack: teste e compartilhe no navegador

O **Expo Snack** ([snack.expo.dev](https://snack.expo.dev)) é um editor de React Native na internet: você escreve o código, vê rodando no navegador ou lê o QR code com o Expo Go.

Um link de Snack é como mandar um print do problema, só que funcionando: quem abre vê o bug acontecer.

:::tip
Antes de compartilhar, reduza ao menor código que ainda mostra o bug. Muitas vezes, ao reduzir, você mesmo acha o erro.
:::

---

## :icon[send] Expo Snack na prática

Para que serve, com um exemplo de cada:

- **Testar um trecho isolado** sem mexer no projeto: o `Text` aninhado do E27, antes de levar para o `CartaoTarefa`
- **Mandar o bug reproduzido** para um colega ou para o instrutor: só o cartão que não responde ao toque, e o link
- **Experimentar um componente novo** antes de usar no app: o `ItemSeparatorComponent` da `FlatList`, com três tarefas fixas

Quem recebe o link abre no navegador ou no Expo Go e vê o mesmo que você.

---

## Método de depuração

O que o médico faz antes de receitar um remédio?

---

## :icon[list-checks] Método de depuração em 4 passos

Achar um bug é como uma consulta médica: o médico ouve o sintoma, examina, dá um diagnóstico e testa um remédio por vez.

:::steps
1. **Reproduzir**: descubra os passos exatos que causam o problema. Acontece sempre? Só depois de remover?
2. **Isolar**: encontre o componente ou a linha, com a tela vermelha, um breakpoint, um `console.log` ou comentando trechos
3. **Formular uma hipótese**, um palpite que dá para testar: diga em uma frase o que acha que está errado
4. **Testar uma mudança por vez**: aplique a correção, recarregue, observe. Não resolveu? Desfaça e teste a próxima hipótese
:::

Sem hipótese, você muda coisas ao acaso e, se funcionar, não sabe por quê.

---

## :icon[stethoscope] O método na prática

O cartão do "Pratique", que não reage ao toque, passo a passo:

1. **Reproduzir**: toco em qualquer cartão, sempre, e nada acontece. Nenhuma tela vermelha
2. **Isolar**: um `console.log('toque')` no começo da função que o cartão recebe. Toco: o terminal fica vazio. O toque não chega à função
3. **Hipótese**: "o `Pressable` não conhece `onClick`"
4. **Testar**: troco só o `onClick` por `onPress`, salvo e toco. Aparece `LOG  toque`, e o cartão esmaece

Uma mudança, um resultado: agora você sabe o que resolveu, e consegue explicar.

---

## :icon[triangle-alert] Erros comuns ao depurar

:::warning
- Mudar várias coisas de uma vez: se funcionar, você não sabe o que resolveu; se piorar, não sabe o que estragou
- Ignorar o aviso amarelo: ele vira tela vermelha na próxima funcionalidade
- Ler só o stack trace e pular a primeira linha, que é a mensagem do erro
- Procurar o `console.log` no celular: ele está no terminal do Expo
- Esquecer um breakpoint ativo: o app parece travado. Aperte <kbd>F8</kbd> e limpe os breakpoints
- Supor que o código "não mudou" sem tentar `r` e `npx expo start -c`
:::

---

## Resumo

:::summary
- Agite o celular ou aperte `m`: o menu do desenvolvedor tem Reload, inspetor e monitor de performance
- `console.log` aparece no terminal do Expo, com `LOG`, `WARN` e `ERROR`
- Tela vermelha para o app: leia a primeira linha, o arquivo e a linha. O aviso amarelo deixa rodar, mas é um bug esperando a vez
- Tecla `j`: o React Native DevTools mostra props e estado (Components) e pausa o app em breakpoints (Sources), como no E03
- Método: reproduzir, isolar, formular hipótese, testar uma mudança por vez
:::

---

## :icon[file-code] Laboratório: App.js com 3 bugs

Na segunda parte do laboratório, troque o seu `App.js` por este (mantenha seus imports e o `estilos`). Ele tem 3 bugs: um derruba o app e dois falham em silêncio.

```jsx
export default function App() {
  const [tarefas, setTarefas] = useState([]);
  const pendentes = tarefas.filter((t) => !t.concluida).length;
  function adicionarTarefa(titulo) {
    tarefas.push({ id: Date.now(), titulo, prioridade: 'media', concluida: false });
  }
  return (
    <SafeAreaView style={estilos.tela}>
      <View style={estilos.cabecalho}>{pendentes} pendentes</View>
      <FormularioTarefa onAdicionar={adicionarTarefa} />
      <FlatList data={tarefas} keyExtractor={(item) => String(item.id)}
        renderItem={(item) => <CartaoTarefa titulo={item.titulo} />} />
    </SafeAreaView>
  );
}
```

---

## :icon[flask-conical] No laboratório

Torne o `minhas-tarefas-mobile` funcional e depois cace 3 bugs.

:::steps
1. Estado `tarefas` com `useState` no `App`; contador de pendentes no cabeçalho
2. `FormularioTarefa` adicionando pelo `onAdicionar`
3. `FlatList` com `CartaoTarefa`, `ItemSeparatorComponent` e `ListEmptyComponent`
4. Concluir ao tocar no cartão; remover com `Alert` de confirmação; `git commit`
5. Troque o `App.js` pelo arquivo com 3 bugs (instrutor ou slide "App.js com 3 bugs") e corrija-os lendo a tela vermelha, o terminal e, se precisar, um breakpoint
6. Anote no `README.md` qual era cada bug; volte ao seu `App.js` com `git restore App.js`
7. `git add .`, `git commit -m "E28: lista funcional e bugs"` e `git push`
:::

**Entrega:** adicionar, concluir e remover funcionando no celular; lista vazia tratada; 3 bugs identificados e descritos no README.

---

## :icon[milestone] Projeto 5 · Etapa 3: estado, lista e caça ao bug

No `gota`, a tela ganha vida:

- `registros` e `meta` com `useState`; cada `BotaoCopo` cria `{ id, ml, hora }`
- Total com `reduce` e percentual no `CartaoProgresso`; a barra para em 100%
- `ItemRegistro` numa `FlatList`, com lista vazia e remoção confirmada por `Alert`
- `CampoMeta`: meta de 500 a 5000 ml num `TextInput` numérico, com o erro embaixo do campo
- Caça ao bug: cole o trecho do enunciado, ache o bug com o método de 4 passos e explique no README

Commit: `Projeto 5: etapa 3, estado, lista e bug`. Enunciado completo e entrega: página do curso, em **Projetos**.
