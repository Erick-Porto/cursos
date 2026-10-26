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

Programador Mobile: Módulo Específico · Encontro E15 · Aula 11 de 71

---

## O que você vai aprender

:::goal
- Escolher teclado, maiúsculas e preenchimento automático para cada `TextInput`
- Levar o foco ao próximo campo com `useRef` e `onSubmitEditing`
- Impedir que o teclado cubra o botão com `KeyboardAvoidingView`
- Montar o cadastro da Lojinha: 4 campos de texto e um `Switch`
:::

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

## :icon[smartphone] O que faz um formulário bom no celular

| No computador | No celular |
|---|---|
| Teclado físico, sempre igual | Teclado virtual, que muda conforme o campo |
| <kbd>Tab</kbd> leva ao próximo campo | O botão do teclado leva ao próximo campo, se você programar |
| Tela larga, campos lado a lado | Um campo por linha, com o rótulo acima |
| Botão de enviar sempre à vista | O teclado cobre metade da tela e pode esconder o botão |

Um bom formulário no celular tem três coisas:

1. **Teclado certo** para cada dado
2. **Um campo por vez**, em sequência, com o botão do teclado levando ao próximo
3. **Botão sempre visível**, mesmo com o teclado aberto

---

## :icon[keyboard] keyboardType: o teclado certo

`keyboardType` diz ao sistema qual teclado abrir quando o campo recebe o foco.

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
O teclado é uma ajuda, não uma trava: o usuário ainda pode colar qualquer texto no campo. Validar continua necessário, e é o assunto da aula 12.
:::

---

## autoCapitalize e autoComplete

```jsx
<TextInput
  keyboardType="email-address"
  autoCapitalize="none"  // nada de "Ana@email.com"
  autoCorrect={false}    // o corretor não "conserta" o domínio
  autoComplete="email"   // sugere o e-mail salvo no aparelho
/>
```

- **`autoCapitalize`**: `'sentences'` (padrão, maiúscula no início da frase), `'words'` para nomes, `'none'` para e-mail e senha
- **`autoComplete`**: diz ao sistema que dado é esse, e o teclado sugere o que o aparelho já conhece: `'name'`, `'email'`, `'tel'`, `'new-password'`

Com `autoComplete`, o usuário preenche nome e e-mail com um toque na sugestão, sem digitar letra por letra.

---

## :icon[lock] secureTextEntry: a senha escondida

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

- `secureTextEntry` troca cada caractere por um ponto
- `autoComplete="new-password"` deixa o gerenciador de senhas do aparelho sugerir uma senha forte
- O botão **Mostrar senha** ajuda quem digita com o polegar, no ônibus, a conferir o que escreveu

---

## :icon[arrow-right] returnKeyType e onSubmitEditing

O botão no canto do teclado também se configura.

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

**`onSubmitEditing`** é o evento disparado pelo toque nesse botão. Atenção: `returnKeyType="next"` só muda o desenho. Quem leva o foco ao próximo campo é o seu código.

---

## useRef: o controle remoto do campo

Para mover o foco, você precisa "segurar" o próximo campo. **`useRef`** cria uma caixa `{ current }` que guarda um valor entre as renderizações, sem redesenhar a tela.

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

- `ref={emailRef}`: o React guarda o campo de e-mail em `emailRef.current`
- `.focus()`: põe o cursor no campo e abre o teclado dele
- Existem também `.blur()`, que tira o foco, e `.clear()`, que apaga o texto

O `ref` é um controle remoto apontado para o campo; `.focus()` é o botão que você aperta.

---

## Pense

:::question
Qual `keyboardType` você usa para o **CEP**? E para o **e-mail**? Que outras props cada um precisa?
:::

:::tip Resposta
- **CEP**: `keyboardType="numeric"`, porque o CEP só tem dígitos; o hífen pode vir de uma máscara. Junte `autoComplete="postal-code"` para o aparelho sugerir o CEP salvo
- **E-mail**: `keyboardType="email-address"` com `autoCapitalize="none"`, `autoCorrect={false}` e `autoComplete="email"`

O teclado de e-mail sozinho não basta: sem `autoCapitalize="none"`, a primeira letra vira maiúscula.
:::

---

## :icon[layers] KeyboardAvoidingView: o teclado não cobre o botão

O teclado ocupa quase metade da tela. No iOS, ele sempre cobre o que está embaixo; no Android, depende do aparelho e da configuração. **`KeyboardAvoidingView`** mede o teclado e afasta o conteúdo dele.

```jsx
import { KeyboardAvoidingView, Platform } from 'react-native';

<KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
>
  {/* campos e botão */}
</KeyboardAvoidingView>
```

- `Platform.OS` vale `'ios'` ou `'android'`
- `'padding'` acrescenta embaixo um espaço do tamanho do teclado
- `'height'` encolhe a altura da área para caber acima do teclado
- `flex: 1` é obrigatório: sem ele, a área tem só a altura do conteúdo e não há o que encolher

---

## :icon[layers] Com e sem KeyboardAvoidingView

:::center
![Animação: o teclado sobe nos dois celulares; sem KeyboardAvoidingView ele cobre o botão Criar conta; com KeyboardAvoidingView o botão do rodapé sobe junto com o teclado e continua à vista](images/e15-teclado-e-kav.svg)
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

- Os campos rolam no `ScrollView`; o botão fica no rodapé e sobe junto com o teclado
- **`keyboardShouldPersistTaps="handled"`**: com o teclado aberto, um toque no `Switch` ou num botão dentro da rolagem funciona de primeira. Sem ele, o primeiro toque só fecha o teclado

---

## :icon[square-check] Switch para aceitar os termos

O **`Switch`** é o interruptor de liga e desliga. Ele é controlado como o `TextInput`, mas com um `boolean`:

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
- `estilos.linha` tem `flexDirection: 'row'`, `alignItems: 'center'` e `gap: espaco.sm`

---

## :icon[user-plus] Exemplo: os 5 campos do cadastro

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

- O `Campo` do UI kit repassa `...rest` ao `TextInput`. No React atual, `ref` é uma prop como as outras e chega lá junto
- São três refs, criados com `useRef(null)`: `emailRef`, `telefoneRef` e `senhaRef`. O nome não precisa, porque nenhum campo pula para ele

---

## :icon[bug] Erros comuns

:::warning
- `onSubmitEditing={emailRef.current.focus()}` sem arrow function: roda na renderização, quando `current` ainda é `null`, e o app quebra
- `emailRef.focus()` sem `.current`: o ref é a caixa; o campo está dentro dela
- `keyboardType="email"`: o valor certo é `email-address`
- `KeyboardAvoidingView` sem `flex: 1`: a área não ocupa a tela e nada sobe
- `ScrollView` sem `keyboardShouldPersistTaps="handled"`: o usuário toca duas vezes no `Switch` e acha que o app travou
:::

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

Na aula 12, você ensina o formulário a responder ao usuário:

- :icon[circle-alert] validação ao sair do campo e ao enviar, com mensagens que ajudam
- :icon[phone] máscara de telefone no formato (11) 98765-4321
- :icon[send] botão "Enviando..." e a mensagem de sucesso
