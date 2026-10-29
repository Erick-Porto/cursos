---
title: Formulários no mobile
summary: Teclado certo para cada dado, foco no próximo campo e um teclado que não cobre o botão de enviar.
module: layout-rn
duration_minutes: 40
objectives:
  - Configurar o TextInput com o teclado e o preenchimento certos para cada dado
  - Levar o foco ao próximo campo com useRef e onSubmitEditing
  - Evitar que o teclado cubra campos e botões com KeyboardAvoidingView
  - Montar um cadastro de 5 campos com Switch para os termos
---

# Formulários no mobile

Programador Mobile · Encontro E35 · Aula 68 de 89

---

## O que você vai aprender

:::goal
- Escolher teclado, maiúsculas e preenchimento automático para cada `TextInput`
- Levar o foco ao próximo campo com `useRef` e `onSubmitEditing`
- Impedir que o teclado cubra o botão com `KeyboardAvoidingView`
- Montar o cadastro da Lojinha: 4 campos de texto e um `Switch`
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **formulário** | a tela que pede dados, campo por campo, como uma ficha de cadastro em papel |
| **foco** | o campo que está recebendo o que você digita: o cursor pisca nele e o teclado abre |
| **teclado virtual** | o teclado que aparece na tela do celular; ele muda conforme o campo |
| **preenchimento automático** | a sugestão que aparece acima do teclado, com dados que o celular já conhece |
| **ref** | um jeito de "segurar" um componente para mandar nele pelo código |
| **interruptor** (`Switch`) | o botão de liga e desliga, como o do Wi-Fi nas configurações |

---

## O cadastro que ninguém termina

Você baixa um app de delivery com fome. Antes do primeiro pedido, ele pede um cadastro:

- o telefone abre o teclado de letras
- o e-mail começa com maiúscula sozinho: "Ana@email.com"
- o botão do teclado fecha o teclado em vez de ir ao próximo campo
- o botão **Criar conta** fica escondido atrás do teclado

Você fecha o app e pede pelo concorrente. Cada atrito num formulário custa usuários, e no celular o maior atrito é o teclado.

:::question
Qual foi o último cadastro que você abandonou no celular? O que mais irritou?
:::

---

## Formulário no celular

Por que preencher um cadastro no celular cansa mais do que no computador?

---

## :icon[smartphone] O que faz um formulário bom no celular

Um **formulário** é a ficha de cadastro na tela: cada campo pede um dado, e o botão no fim envia tudo.

No celular, metade da tela vira teclado. Por isso, um bom formulário no celular tem três coisas:

1. **Teclado certo** para cada dado
2. **Um campo por vez**, em sequência, com o botão do teclado levando ao próximo
3. **Botão sempre visível**, mesmo com o teclado aberto

Nesta aula, você monta o cadastro da Lojinha com essas três coisas: nome, e-mail, telefone, senha e um interruptor para aceitar os termos.

---

## :icon[laptop] Computador e celular: o que muda

| No computador | No celular |
|---|---|
| Teclado físico, sempre igual | Teclado virtual, que muda conforme o campo |
| <kbd>Tab</kbd> leva ao próximo campo | O botão do teclado leva ao próximo campo, se você programar |
| Tela larga, campos lado a lado | Um campo por linha, com o rótulo acima |
| Botão de enviar sempre à vista | O teclado cobre metade da tela e pode esconder o botão |

Cada linha da direita é um problema que esta aula resolve, de cima para baixo.

---

## O teclado certo

Se o campo pede o telefone, por que o celular abriria um teclado de letras?

---

## :icon[keyboard] keyboardType: o teclado certo

O celular tem vários teclados virtuais: de letras, de números, de discador. A prop **`keyboardType`** (tipo de teclado) escolhe qual deles abre quando o campo recebe o **foco**.

| Valor | Teclado | Use para |
|---|---|---|
| `default` | letras, o padrão | nome, endereço, mensagem |
| `email-address` | letras com `@` e `.` à mão | e-mail |
| `phone-pad` | números grandes, como o discador | telefone |
| `numeric` | números | CEP, quantidade, idade |

```jsx
<TextInput keyboardType="phone-pad" placeholder="(11) 98765-4321" />
```

:::info
O teclado ajuda, mas não trava: o usuário ainda pode colar qualquer texto no campo. Por isso a validação continua necessária. Ela é o assunto da aula 69.
:::

---

## :icon[keyboard] O teclado certo na prática

Três campos da Lojinha e o teclado que cada um abre:

```jsx
<TextInput keyboardType="numeric" placeholder="Quantidade" />
<TextInput keyboardType="phone-pad" placeholder="Celular" />
<TextInput keyboardType="email-address" placeholder="E-mail" />
```

| Campo | Na tela, ao tocar no campo |
|---|---|
| Quantidade | um teclado só de números |
| Celular | números grandes, como o discador do telefone |
| E-mail | letras, com o `@` e o `.` ao lado do espaço |

No e-mail, o teclado certo ainda deixa a primeira letra maiúscula. Quem resolve é o `autoCapitalize`.

---

## :icon[text] autoCapitalize e autoComplete

Duas props fazem o usuário digitar menos e errar menos:

```jsx
<TextInput
  keyboardType="email-address"
  autoCapitalize="none"  // nada de "Ana@email.com"
  autoCorrect={false}    // o corretor não "conserta" o domínio
  autoComplete="email"   // sugere o e-mail salvo no aparelho
/>
```

- **`autoCapitalize`** (maiúscula automática): `'sentences'` (padrão, maiúscula no início da frase), `'words'` para nomes, `'none'` para e-mail e senha
- **`autoComplete`** (preenchimento automático): diz ao sistema que dado é esse, e o teclado sugere o que o aparelho já conhece: `'name'`, `'email'`, `'tel'`, `'new-password'`
- `autoCorrect={false}` desliga o corretor. As chaves levam ao JSX um valor do JavaScript: aqui, o `false`

Com `autoComplete`, o usuário preenche nome e e-mail com um toque na sugestão.

---

## :icon[lock] secureTextEntry: a senha escondida

Na senha, cada letra vira um ponto na tela, para ninguém ler por cima do ombro. É a prop **`secureTextEntry`** (entrada de texto segura):

```jsx
const [mostrar, setMostrar] = useState(false);

<TextInput
  value={senha}
  onChangeText={setSenha}
  secureTextEntry={!mostrar}
  autoCapitalize="none"
  autoComplete="new-password"
/>
<Pressable onPress={() => setMostrar(!mostrar)}>
  <Text>{mostrar ? 'Ocultar senha' : 'Mostrar senha'}</Text>
</Pressable>
```

- `!mostrar` é o contrário de `mostrar`: com `mostrar` em `false`, a senha fica escondida
- `autoComplete="new-password"` deixa o gerenciador de senhas do aparelho sugerir uma senha forte
- O botão **Mostrar senha** ajuda quem digita com o polegar, no ônibus, a conferir o que escreveu

---

## Pense

:::question
Qual `keyboardType` você usa para o **CEP**? E para o **e-mail**? Que outras props cada um precisa?
:::

:::tip Resposta
- **CEP**: `keyboardType="numeric"`, porque o CEP só tem dígitos; o hífen vem do `mascararCep` do E06. Junte `autoComplete="postal-code"` para o aparelho sugerir o CEP salvo
- **E-mail**: `keyboardType="email-address"` com `autoCapitalize="none"`, `autoCorrect={false}` e `autoComplete="email"`

Só o teclado de e-mail não resolve: sem `autoCapitalize="none"`, a primeira letra vira maiúscula.
:::

---

## O botão do teclado

O que deveria acontecer quando você toca no botão do canto do teclado?

---

## :icon[arrow-right] returnKeyType e onSubmitEditing

No canto do teclado há um botão, que no computador seria o <kbd>Enter</kbd>. A prop **`returnKeyType`** escolhe o que ele mostra:

| `returnKeyType` | O botão mostra | Use no |
|---|---|---|
| `next` | Próximo, ou uma seta | campos do meio do formulário |
| `done` | Concluído | último campo |
| `search` | Buscar | campo de busca |
| `send` | Enviar | caixa de mensagem |

```jsx
<TextInput
  returnKeyType="done"
  onSubmitEditing={() => console.log('tocou no botão do teclado')}
/>
```

**`onSubmitEditing`** é o evento do toque nesse botão. Atenção: `returnKeyType="next"` só muda o desenho. Quem leva o foco ao próximo campo é o seu código.

---

## :icon[arrow-right] O botão do teclado na prática

```jsx
<TextInput placeholder="Buscar produto" returnKeyType="search"
  onSubmitEditing={() => console.log('buscar')} />
<TextInput placeholder="Mensagem para a loja" returnKeyType="send"
  onSubmitEditing={() => Alert.alert('Mensagem enviada')} />
<TextInput placeholder="Senha" returnKeyType="done" onSubmitEditing={enviar} />
```

| Campo | O botão mostra | O toque faz |
|---|---|---|
| Busca | Buscar | escreve `buscar` no terminal |
| Mensagem | Enviar | abre o alerta "Mensagem enviada" |
| Senha | Concluído | chama `enviar`, que cria a conta |

Repare na arrow function `() =>` nos dois primeiros: ela faz o código esperar o toque. No terceiro, `enviar` vai sem parênteses pelo mesmo motivo.

---

## useRef

Como o código consegue pôr o cursor num campo sem ninguém tocar nele?

---

## :icon[target] useRef: o controle remoto do campo

Para mover o foco, o código precisa "segurar" o próximo campo. Um **ref** funciona como um controle remoto apontado para o campo: com ele, o código manda no campo sem o usuário tocar nele. O hook **`useRef`** cria esse controle.

```jsx
import { useRef } from 'react';

const emailRef = useRef(null);

<TextInput
  placeholder="Nome"
  returnKeyType="next"
  onSubmitEditing={() => emailRef.current.focus()}
/>
<TextInput ref={emailRef} placeholder="E-mail" />
```

Na tela: no nome, o toque em Próximo leva o cursor ao e-mail, e o teclado continua aberto.

---

## :icon[list-ordered] O foco em português

| Linha | O que ela diz |
|---|---|
| `useRef(null)` | "crie um controle remoto, ainda sem apontar para nada" (`null` quer dizer "nada") |
| `ref={emailRef}` | "aponte o controle para o campo de e-mail": o React guarda o campo em `emailRef.current` |
| `onSubmitEditing={() => ...}` | "quando tocarem no botão do teclado, faça isto" |
| `emailRef.current.focus()` | "aperte o botão de focar": o cursor vai ao e-mail e o teclado dele abre |

Por dentro, o ref é um objeto `{ current }` que guarda o mesmo valor entre as renderizações, sem redesenhar a tela.

---

## :icon[target] O foco na prática

Três situações do cadastro em que o código aperta um botão do controle remoto:

```jsx
emailRef.current.focus(); // no Próximo do nome
emailRef.current.focus(); // ao enviar com o e-mail errado
senhaRef.current.blur();  // num botão "Fechar teclado"
```

| Situação | Na tela |
|---|---|
| Próximo no nome | o cursor pula para o e-mail, e o teclado continua aberto |
| Enviar com o e-mail errado | o cursor volta ao e-mail, pronto para corrigir |
| "Fechar teclado" | o campo perde o foco e o teclado desce |

O controle tem mais um botão: `.clear()`, que apaga o texto do campo.

---

## KeyboardAvoidingView

Onde foi parar o botão Criar conta quando o teclado subiu?

---

## :icon[layers] KeyboardAvoidingView: o teclado não cobre o botão

O teclado ocupa quase metade da tela. No iOS, ele sempre cobre o que está embaixo; no Android, depende do aparelho. A **`KeyboardAvoidingView`** (vista que evita o teclado) é uma área elástica: quando o teclado sobe, ela encolhe e leva o conteúdo junto, para cima.

```jsx
import { KeyboardAvoidingView, Platform } from 'react-native';

<KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
>
  {/* campos e botão */}
</KeyboardAvoidingView>
```

- `Platform.OS` vale `'ios'` ou `'android'`; o ternário diz "se for iOS, `'padding'`; se não, `'height'`"
- `'padding'` acrescenta embaixo um espaço do tamanho do teclado
- `'height'` encolhe a altura da área para caber acima do teclado
- `flex: 1` é obrigatório: sem ele, a área tem só a altura do conteúdo e não há o que encolher

---

## :icon[layers] Com e sem KeyboardAvoidingView

:::center
![Animação: o teclado sobe nos dois celulares; sem KeyboardAvoidingView ele cobre o botão Criar conta; com KeyboardAvoidingView o botão do rodapé sobe junto com o teclado e continua à vista](images/e35-teclado-e-kav.svg)
:::

Sem ela, o teclado sobe por cima da tela e esconde o **Criar conta**. Com ela, a área encolhe e o botão do rodapé sobe junto com o teclado, sempre à vista.

---

## :icon[rows-3] A estrutura da tela: rolagem e rodapé

```jsx
<SafeAreaView style={[estilos.tela, { backgroundColor: cores.fundo }]}>
  <KeyboardAvoidingView
    style={estilos.tela}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  >
    <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
      {/* os campos e o Switch */}
    </ScrollView>
    <View style={estilos.rodape}>
      <Botao titulo="Criar conta" onPress={enviar} />
    </View>
  </KeyboardAvoidingView>
</SafeAreaView>
```

- A `SafeAreaView` do E30 afasta tudo do entalhe; dentro dela, a área elástica
- Os campos rolam no `ScrollView`; o botão fica no rodapé e sobe junto com o teclado
- **`keyboardShouldPersistTaps="handled"`**: com o teclado aberto, um toque no `Switch` ou num botão dentro da rolagem funciona de primeira. Sem ele, o primeiro toque só fecha o teclado

---

## Switch

Como você liga o Wi-Fi do celular: digitando "sim" ou tocando num botão?

---

## :icon[square-check] Switch para aceitar os termos

O **`Switch`** é o interruptor de liga e desliga, como o do Wi-Fi nas configurações do celular. Ele guarda um `boolean`, sim ou não: `true` ligado, `false` desligado. É controlado como o `TextInput`:

```jsx
const [termos, setTermos] = useState(false);

<View style={estilos.linha}>
  <Switch
    value={termos}
    onValueChange={setTermos}
    trackColor={{ false: cores.borda, true: cores.primaria }}
    accessibilityLabel="Aceitar os termos de uso"
  />
  <Text style={{ color: cores.texto }}>Li e aceito os termos de uso</Text>
</View>
```

- `value`: ligado (`true`) ou desligado (`false`)
- `onValueChange`: recebe o valor novo, pronto para o `set`
- `trackColor`: a cor do trilho desligado (`false`) e ligado (`true`), do tema
- `accessibilityLabel`: o que o leitor de tela fala ao chegar no interruptor
- `estilos.linha` tem `flexDirection: 'row'`, `alignItems: 'center'` e `gap: espaco.sm`

---

## :icon[square-check] O Switch na prática

Um interruptor para receber ofertas por e-mail, com um texto que acompanha o estado:

```jsx
const [ofertas, setOfertas] = useState(false);

<Switch value={ofertas} onValueChange={setOfertas} />
<Text>{ofertas ? 'Você vai receber ofertas' : 'Sem ofertas por e-mail'}</Text>
```

| Momento | `ofertas` | Na tela |
|---|---|---|
| ao abrir | `false` | interruptor desligado e "Sem ofertas por e-mail" |
| primeiro toque | `true` | trilho colorido e "Você vai receber ofertas" |
| segundo toque | `false` | desligado de novo |

Os termos do cadastro funcionam igual: `termos` começa em `false`, e só com `true` a conta pode ser criada.

---

## Campos encadeados

Dá para criar a conta inteira sem tirar o dedo do teclado?

---

## :icon[user-plus] Exemplo: os 5 campos do cadastro

**Encadear** os campos é ligar um ao outro, como os vagões de um trem: o Próximo de cada campo leva ao seguinte, e o último envia.

| Campo | `keyboardType` | `autoCapitalize` | `autoComplete` | `returnKeyType` |
|---|---|---|---|---|
| Nome | `default` | `words` | `name` | `next` |
| E-mail | `email-address` | `none` | `email` | `next` |
| Telefone | `phone-pad` | `none` | `tel` | `next` |
| Senha | `default`, com `secureTextEntry` | `none` | `new-password` | `done` |
| Termos | `Switch`, sem teclado | | | |

O `done` da senha chama `enviar` no `onSubmitEditing`: o usuário cria a conta sem tirar o dedo do teclado. O `Switch` fica por último, logo acima do botão.

---

## Cadastro.js: os campos encadeados

```jsx
<Campo rotulo="Nome" value={nome} onChangeText={setNome}
  autoCapitalize="words" autoComplete="name" returnKeyType="next"
  onSubmitEditing={() => emailRef.current.focus()} />

<Campo ref={emailRef} rotulo="E-mail" value={email} onChangeText={setEmail}
  keyboardType="email-address" autoCapitalize="none" autoComplete="email"
  returnKeyType="next" onSubmitEditing={() => telefoneRef.current.focus()} />

{/* o telefone segue o mesmo padrão e leva à senha */}

<Campo ref={senhaRef} rotulo="Senha" value={senha} onChangeText={setSenha}
  secureTextEntry autoCapitalize="none" autoComplete="new-password"
  returnKeyType="done" onSubmitEditing={enviar} />
```

- O `Campo` do UI kit (E33) repassa `...rest` ao `TextInput`. No React atual, `ref` é uma prop como as outras e chega lá junto
- São três refs, criados com `useRef(null)`: `emailRef`, `telefoneRef` e `senhaRef`. O nome não precisa, porque nenhum campo pula para ele

---

## Erros comuns

O que a tela vermelha e o teclado teimoso estão tentando contar para você?

---

## :icon[siren] Quando aparece um erro

| O que aparece | Quer dizer | O que fazer |
|---|---|---|
| tela vermelha `Cannot read property 'focus' of null` ao abrir | sem arrow function, o `.focus()` roda ao desenhar, com `current` ainda `null` | `() => emailRef.current.focus()` |
| `emailRef.focus is not a function` | faltou o `.current`: o campo está dentro do ref | `emailRef.current.focus()` |
| e-mail com o teclado de letras comum | `keyboardType="email"` não existe | `email-address` |
| o teclado cobre o botão, mesmo com a `KeyboardAvoidingView` | falta `flex: 1`: a área não ocupa a tela | `style={{ flex: 1 }}` |
| o primeiro toque no `Switch` só fecha o teclado | falta `keyboardShouldPersistTaps="handled"` no `ScrollView` | acrescentar a prop |

---

## Resumo

:::summary
- Formulário bom no celular: teclado certo, um campo por vez e botão sempre visível
- `keyboardType`, `autoCapitalize` e `autoComplete` adaptam o teclado e o preenchimento a cada dado
- `useRef` segura o próximo campo; `onSubmitEditing` chama `.focus()` nele
- `KeyboardAvoidingView`, com `behavior` escolhido por `Platform.OS`, afasta o conteúdo do teclado
- `ScrollView` com `keyboardShouldPersistTaps="handled"` e o `Switch` completam o cadastro
:::

---

## :icon[arrow-right] Próximos passos

O cadastro já é confortável de digitar. Mas ainda aceita "ana@" como e-mail, "123" como senha e um telefone cheio de letras.

Na aula 69, você ensina o formulário a responder ao usuário:

- :icon[circle-alert] validação ao sair do campo e ao enviar, com mensagens que ajudam
- :icon[phone] a máscara de telefone do E06 ligada ao campo, no formato (11) 98765-4321
- :icon[send] botão "Enviando...", a recusa do servidor e a mensagem de sucesso
