---
title: Depuração e ferramentas do Expo
summary: Menu do desenvolvedor, console.log no terminal, tela vermelha, aviso amarelo e um método para achar bugs.
module: react-native
duration_minutes: 35
objectives:
  - Usar o menu do desenvolvedor e o console do Expo
  - Ler a tela de erro e os avisos
  - Aplicar um método para encontrar bugs
---

# Depuração e ferramentas do Expo

Programador Mobile: Módulo Básico · Encontro E08 · Aula 16 de 18

---

## O que você vai aprender

:::goal
- Abrir o menu do desenvolvedor e usar o console do Expo
- Ler a tela vermelha de erro e o aviso amarelo
- Recarregar, limpar cache e usar o React DevTools e o Expo Snack
- Aplicar um método de 4 passos para encontrar bugs
:::

---

## Todo app quebra

Você salva o `App.js`, olha para o celular e vê uma tela vermelha cheia de texto. Dá vontade de fechar tudo.

Calma: a tela está dizendo **exatamente** onde e por que quebrou. **Depurar** (encontrar e corrigir bugs) é parte do trabalho de todo dia, não sinal de que você errou a carreira.

:::question
Quando o código quebra, qual é a primeira coisa que você faz hoje: lê a mensagem ou muda alguma coisa para ver se resolve?
:::

---

## :icon[smartphone] O menu do desenvolvedor

Com o app aberto no Expo Go, **agite o celular** (ou aperte `m` no terminal do Expo). Abre o **menu do desenvolvedor**:

| Opção | O que faz |
|---|---|
| Reload | recarrega o app do zero |
| Toggle element inspector | toque em um elemento e veja seus estilos e tamanho |
| Show performance monitor | mostra FPS e uso de memória no canto da tela |
| Open JS debugger | abre o depurador do JavaScript no computador |

O inspetor de elementos é o "inspecionar" do navegador, na versão celular.

---

## :icon[terminal] console.log aparece no terminal

No celular não existe aba Console. Tudo que você registra vai para o **terminal onde rodou `npx expo start`**.

```jsx
function adicionarTarefa(titulo) {
  const nova = { id: Date.now(), titulo, prioridade: 'media', concluida: false };
  console.log('nova tarefa:', nova);
  setTarefas([...tarefas, nova]);
}
```

```plaintext
 LOG  nova tarefa: {"concluida": false, "id": 1728400000000, "prioridade": "media", "titulo": "Comprar pão"}
```

- `console.log`: linha `LOG`, para acompanhar valores
- `console.warn`: linha `WARN`, em amarelo
- `console.error`: linha `ERROR`, em vermelho

---

## :icon[bug] Tela vermelha: o app parou

Um **erro** derruba o app e mostra uma tela vermelha. Leia de cima para baixo:

::::columns
:::col
![Diagrama da tela vermelha lida de cima para baixo: 1, a mensagem do erro; 2, o arquivo e a linha; 3, o stack trace, de CartaoTarefa até App](images/e08-tela-vermelha.svg)
:::
:::col
1. **Primeira linha**: a mensagem do erro. É a parte que importa
2. **Arquivo e linha**: onde aconteceu
3. **Stack trace**: a sequência de chamadas até chegar lá
:::
::::

Neste exemplo, a mensagem é `Text strings must be rendered within a <Text> component`. Causa típica: um texto solto fora de `<Text>`, como `<View>Comprar pão</View>`. Correção: `<View><Text>Comprar pão</Text></View>`. No React Native, todo texto precisa de `<Text>` em volta.

---

## :icon[triangle-alert] Aviso amarelo: roda, mas avise

Um **aviso** (warning) não para o app: aparece uma faixa amarela no rodapé e uma linha `WARN` no terminal.

```plaintext
 WARN  Each child in a list should have a unique "key" prop.
```

Exemplos frequentes:

- `key` faltando ao renderizar listas com `map`
- `FlatList` dentro de `ScrollView` ("VirtualizedLists should never be nested...")
- Uma prop com tipo errado, como `style="vermelho"`

:::tip
Trate o aviso como um bug que ainda não apareceu. Toque na faixa para ler a mensagem completa e corrija antes de seguir.
:::

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

## :icon[search] React DevTools

O **React DevTools** mostra a árvore de componentes do app e as props e o estado de cada um, como no navegador.

```bash
npx react-devtools
```

Rode em um segundo terminal, com o app aberto no Expo Go. Depois:

- Selecione `App` e veja o array `tarefas` no painel de hooks
- Selecione um `CartaoTarefa` e confira se `titulo` e `concluida` chegaram
- Edite um valor de estado e veja a tela mudar na hora

Serve para responder "a prop chegou ou não?" sem espalhar `console.log`.

---

## :icon[refresh-cw] Recarregar e limpar cache

Ao salvar um arquivo, o **Fast Refresh** atualiza o app sozinho. Quando isso não basta:

| Situação | O que fazer |
|---|---|
| A tela ficou presa ou estranha | tecla `r` no terminal (ou Reload no menu) |
| Mudou um arquivo e nada aconteceu | `r` de novo; se persistir, pare e rode `npx expo start -c` |
| Instalou um pacote novo | pare o Expo e rode `npx expo start` de novo |
| Mudou o `app.json` | pare o Expo e rode `npx expo start -c` |

O `-c` limpa o **cache** do empacotador: ele guarda versões antigas dos arquivos para ser rápido e, às vezes, mostra código velho.

---

## :icon[globe] Expo Snack: teste e compartilhe no navegador

**Expo Snack** ([snack.expo.dev](https://snack.expo.dev)) é um editor online de React Native: você escreve o código, vê rodando no navegador ou lê o QR code com o Expo Go.

Para que serve:

- Testar um trecho isolado sem mexer no projeto
- Mandar o link para um colega ou para o instrutor com o bug reproduzido
- Experimentar um componente novo antes de usar no app

:::tip
Antes de compartilhar, reduza ao menor código que ainda mostra o bug. Muitas vezes, ao reduzir, você mesmo acha o erro.
:::

---

## :icon[list-checks] Método de depuração em 4 passos

:::steps
1. **Reproduzir**: descubra os passos exatos que causam o problema. Acontece sempre? Só depois de remover?
2. **Isolar**: encontre o componente ou a linha. Use `console.log`, a tela vermelha ou comente trechos até o erro sumir
3. **Formular uma hipótese**: diga em uma frase o que acha que está errado, como "o `item` chega como objeto `{ item }`"
4. **Testar uma mudança por vez**: aplique a correção, recarregue, observe. Não resolveu? Desfaça e teste a próxima hipótese
:::

Sem hipótese, você muda coisas ao acaso e, se funcionar, não sabe por quê.

---

## :icon[triangle-alert] Erros comuns ao depurar

:::warning
- Mudar várias coisas de uma vez: se funcionar, você não sabe o que resolveu; se piorar, não sabe o que estragou
- Ignorar o aviso amarelo: ele vira tela vermelha na próxima funcionalidade
- Ler só o stack trace e pular a primeira linha, que é a mensagem do erro
- Procurar o `console.log` no celular: ele está no terminal do Expo
- Supor que o código "não mudou" sem tentar `r` e `npx expo start -c`
:::

---

## Resumo

:::summary
- Agite o celular ou aperte `m`: o menu do desenvolvedor tem Reload, inspetor e monitor de performance
- `console.log` aparece no terminal do Expo, com `LOG`, `WARN` e `ERROR`
- Tela vermelha para o app: leia a primeira linha, o arquivo e a linha
- Aviso amarelo continua rodando, mas é um bug esperando a vez
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
5. Troque o `App.js` pelo arquivo com 3 bugs (instrutor ou slide "App.js com 3 bugs") e corrija-os lendo o terminal e a tela vermelha
6. Anote no `README.md` qual era cada bug; volte ao seu `App.js` com `git restore App.js`
7. `git add .`, `git commit -m "E08: lista funcional e bugs"` e `git push`
:::

**Entrega:** adicionar, concluir e remover funcionando no celular; lista vazia tratada; 3 bugs identificados e descritos no README.
