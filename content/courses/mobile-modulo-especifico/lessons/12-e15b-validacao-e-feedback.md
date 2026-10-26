---
title: Validação e feedback
summary: Valide no momento certo, mostre erros que ajudam e trate o envio com funções puras e o Campo do UI kit.
module: layout-rn
duration_minutes: 40
objectives:
  - Validar campos ao sair e ao enviar, com mensagens que dizem como corrigir
  - Escrever validações e máscaras como funções puras em src/utils
  - Mostrar o erro no Campo e o estado de envio do formulário
---

# Validação e feedback

Programador Mobile: Módulo Específico · Encontro E15 · Aula 12 de 71

---

## O que você vai aprender

:::goal
- Decidir **quando** validar: ao sair do campo e ao enviar
- Escrever mensagens de erro que dizem como corrigir
- Criar `validar.js` e `mascaras.js` com funções puras
- Mostrar o erro no `Campo` e o estado "Enviando..." no botão
:::

---

## "Dados inválidos"

Você abre uma conta num app de banco. Preenche oito campos, toca em **Continuar** e recebe um alerta: "Dados inválidos". Qual dado? O que fazer? Você confere tudo, toca de novo e recebe o mesmo alerta.

No dia seguinte, outro app: na primeira letra do e-mail, o campo já fica vermelho, acusando "E-mail inválido".

Os dois erram no **feedback**: o primeiro não diz onde está o problema; o segundo acusa antes de você terminar.

:::question
Quando um app deveria avisar que o e-mail está errado: a cada letra, ao sair do campo ou só ao tocar em Continuar?
:::

---

## :icon[timer] Quando validar

:::center
![Animação: uma linha do tempo do campo de e-mail; ao digitar ana@ nada aparece; ao sair do campo, o onBlur pinta a borda de vermelho e mostra Use o formato nome@exemplo.com; ao tocar em Criar conta, o onPress valida todos os campos](images/e15-quando-validar.svg)
:::

**`onBlur`** é o evento que o `TextInput` dispara quando perde o foco.

A regra da Lojinha:

1. Valide **ao sair** de cada campo (`onBlur`), logo depois de o usuário terminar, e **ao enviar** (`onPress` do botão), que pega o que ficou em branco
2. Ao digitar (`onChangeText`), só **apague** o erro daquele campo: validar a cada tecla acusa antes de o usuário terminar e irrita

---

## :icon[message-square] Mensagens que ajudam

| Ruim | Boa |
|---|---|
| Campo obrigatório | Informe seu nome |
| Formato incorreto | Use o formato nome@exemplo.com |
| Senha fraca | Use pelo menos 8 caracteres |
| "Dados inválidos" num alerta | a mensagem embaixo do campo com problema |

Uma boa mensagem:

- diz **o que fazer**, não só o que está errado
- aparece **perto do campo**, não num alerta genérico
- usa as palavras do usuário, sem culpa e sem jargão
- não depende só da cor: o texto explica, a borda vermelha reforça

---

## :icon[file-code] Funções puras: a regra fora da tela

Uma **função pura** recebe dados, devolve um resultado e não mexe em mais nada: não lê estado, não muda a tela. A mesma entrada dá sempre a mesma saída.

```javascript
// src/utils/validar.js
export function validarObrigatorio(valor, rotulo) {
  return valor.trim() === '' ? `Informe ${rotulo}` : null;
}

export function validarSenha(senha) {
  if (senha === '') return 'Crie uma senha';
  return senha.length >= 8 ? null : 'Use pelo menos 8 caracteres';
}
```

- Cada função devolve a **mensagem de erro**, ou `null` quando está tudo certo
- Fora do componente, a regra serve ao cadastro, ao login e à edição do perfil
- Você confere a regra com um `console.log`, sem abrir a tela

---

## :icon[mail] validarEmail

```javascript
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarEmail(email) {
  const limpo = email.trim();
  if (limpo === '') return 'Informe seu e-mail';
  return FORMATO_EMAIL.test(limpo) ? null : 'Use o formato nome@exemplo.com';
}
```

`FORMATO_EMAIL` é uma **expressão regular**, um molde de texto. Leia assim: um trecho sem espaço nem `@`, um `@`, outro trecho, um ponto e mais um trecho. `.test(texto)` devolve `true` quando o texto encaixa no molde.

- `trim()` tira os espaços das pontas: o teclado às vezes põe um espaço depois da sugestão
- O molde não garante que o e-mail existe; ele pega erros de digitação

---

## :icon[table] Entradas e saídas

| Chamada | Devolve |
|---|---|
| `validarObrigatorio('   ', 'seu nome')` | `'Informe seu nome'` |
| `validarObrigatorio('Ana', 'seu nome')` | `null` |
| `validarEmail('ana@email')` | `'Use o formato nome@exemplo.com'` |
| `validarEmail('ana@email.com ')` | `null` |
| `validarSenha('1234567')` | `'Use pelo menos 8 caracteres'` |
| `validarSenha('12345678')` | `null` |

É assim que se confere uma função pura: uma lista de entradas e a saída esperada de cada uma. Mais adiante no curso, essa tabela vira teste automático.

---

## :icon[phone] Máscara de telefone

Uma **máscara** formata o texto enquanto o usuário digita. A função recebe o que está no campo e devolve o texto formatado.

```javascript
// src/utils/mascaras.js
export function mascararTelefone(texto) {
  const d = texto.replace(/\D/g, '').slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}
```

- `replace(/\D/g, '')` apaga tudo o que não é dígito: parênteses, espaços, hífen, letras
- `slice(0, 11)` corta no tamanho de um celular: DDD e 9 dígitos
- O resto monta o formato aos pedaços, conforme a quantidade de dígitos

No campo: `onChangeText={(t) => setTelefone(mascararTelefone(t))}`.

---

## Pratique

:::example Preveja a saída
Sem rodar o código, diga o que `mascararTelefone` devolve em cada caso:

1. `'119'`
2. `'11 9 8765 4321'`
3. `'(11) 98765-43219'`, colado com um dígito a mais
4. `'(11) 98765-'`, depois de apagar o último dígito
:::

:::tip Resposta
| Entrada | Saída |
|---|---|
| `'119'` | `'(11) 9'` |
| `'11 9 8765 4321'` | `'(11) 98765-4321'` |
| `'(11) 98765-43219'` | `'(11) 98765-4321'` |
| `'(11) 98765-'` | `'(11) 98765'` |

Espaços e símbolos somem, o que passa de 11 dígitos é cortado e o hífen só aparece quando existe o oitavo dígito.
:::

---

## :icon[braces] Erros como objeto

Com 5 campos, um `useState` para cada valor e outro para cada erro vira bagunça. Junte tudo em dois objetos com as mesmas chaves:

```jsx
const VAZIO = { nome: '', email: '', telefone: '', senha: '', termos: false };

const [valores, setValores] = useState(VAZIO);
const [erros, setErros] = useState({}); // ex.: { email: 'Use o formato nome@exemplo.com' }

function alterar(campo, valor) {
  setValores({ ...valores, [campo]: valor });
  setErros({ ...erros, [campo]: null }); // apaga o erro ao digitar
}
```

- `[campo]` usa o **valor** da variável como nome da chave: `alterar('email', 'ana')` muda `valores.email`
- O spread copia o objeto e troca só uma chave, como você já faz com arrays
- No campo: `onChangeText={(t) => alterar('email', t)}`

---

## :icon[list-checks] validarCadastro: todas as regras de uma vez

```javascript
// src/utils/validar.js
export function validarCadastro(valores) {
  return {
    nome: validarObrigatorio(valores.nome, 'seu nome'),
    email: validarEmail(valores.email),
    telefone: validarTelefone(valores.telefone),
    senha: validarSenha(valores.senha),
    termos: valores.termos ? null : 'Aceite os termos para continuar',
  };
}
```

A função devolve um objeto de erros com as mesmas chaves de `valores`. Ao sair de um campo, a tela pega só a chave dele:

```jsx
function aoSair(campo) {
  setErros({ ...erros, [campo]: validarCadastro(valores)[campo] });
}
```

`validarTelefone` é sua no laboratório: 11 dígitos, ou uma mensagem que ajude.

---

## :icon[component] Campo com a prop erro

```jsx
export default function Campo({ rotulo, erro, style, ...rest }) {
  const { cores } = useTema();
  const borda = erro ? { borderColor: cores.perigo, borderWidth: 2 } : { borderColor: cores.borda };
  return (
    <View style={[estilos.campo, style]}>
      <Text style={[estilos.rotulo, { color: cores.textoSuave }]}>{rotulo}</Text>
      <TextInput
        style={[estilos.entrada, borda, { color: cores.texto }]}
        placeholderTextColor={cores.textoSuave} accessibilityLabel={rotulo}
        {...rest}
      />
      {erro ? <Text style={[estilos.erro, { color: cores.perigo }]}>{erro}</Text> : null}
    </View>
  );
}
```

- `erro` sai do `...rest`: o `TextInput` não recebe uma prop que não conhece
- Com erro, a borda fica na cor `perigo` e mais grossa, e a mensagem aparece embaixo
- Sem erro, o ternário devolve `null` e nada é desenhado
- No fim do arquivo, um estilo novo: `erro: { marginTop: espaco.xs, fontSize: fonte.pequena }`

---

## :icon[pencil] Ligando o Campo ao cadastro

```jsx
<Campo
  ref={emailRef}
  rotulo="E-mail"
  value={valores.email}
  onChangeText={(t) => alterar('email', t)}
  onBlur={() => aoSair('email')}
  erro={erros.email}
  keyboardType="email-address"
  autoCapitalize="none"
  autoComplete="email"
  returnKeyType="next"
  onSubmitEditing={() => telefoneRef.current.focus()}
/>
```

- Ao tocar em Próximo, o e-mail perde o foco: `onBlur` valida enquanto o cursor já está no telefone
- O telefone é igual, com a máscara no caminho: `onChangeText={(t) => alterar('telefone', mascararTelefone(t))}`
- O `Switch` usa `onValueChange={(v) => alterar('termos', v)}` e mostra `erros.termos` num `Text` na cor `perigo`

---

## :icon[send] Estado de envio e sucesso

```jsx
const [enviando, setEnviando] = useState(false);

function enviar() {
  const novos = validarCadastro(valores);
  setErros(novos);
  if (Object.values(novos).some(Boolean)) return; // há pelo menos um erro
  setEnviando(true);
  setTimeout(() => { // simula o servidor
    setEnviando(false);
    Alert.alert('Conta criada', `Boas-vindas, ${valores.nome.trim()}!`);
    setValores(VAZIO);
  }, 1500);
}

<Botao titulo={enviando ? 'Enviando...' : 'Criar conta'} onPress={enviar} desabilitado={enviando} />
```

- `Object.values(novos).some(Boolean)`: alguma chave tem mensagem? Então há erro e o envio para
- "Enviando..." mostra que o app recebeu o toque; o botão desabilitado impede o toque duplo, que criaria duas contas
- O `setTimeout` faz o papel do servidor até o app ganhar uma API de verdade

---

## :icon[bug] Erros comuns

:::warning
- `onBlur={aoSair('email')}` sem arrow function: valida na renderização, muda o estado, renderiza de novo... e o app quebra com "Too many re-renders"
- Validar no `onChangeText`: o campo fica vermelho na primeira letra
- `erros.email = 'Informe seu e-mail'`: mudar o objeto direto não redesenha a tela; use `setErros` com spread
- Contar os caracteres do telefone mascarado: `'(11) 98765-4321'` tem 15, não 11. Conte os dígitos
- Botão sem `desabilitado` durante o envio: dois toques, duas contas
:::

---

## Resumo

:::summary
- Valide ao sair do campo (`onBlur`) e ao enviar; ao digitar, só apague o erro daquele campo
- Boas mensagens dizem o que fazer e aparecem embaixo do campo, não num alerta genérico
- `validar.js` e `mascaras.js` guardam funções puras: recebem dados, devolvem um resultado, nada mais
- `erros` é um objeto com as mesmas chaves de `valores`; o `Campo` mostra `erro` na cor `perigo`
- Durante o envio, o botão fica desabilitado e diz "Enviando..."; o sucesso aparece num `Alert`
:::

---

## :icon[flask-conical] No laboratório

Construa o cadastro da Lojinha, do primeiro toque ao "Conta criada".

:::steps
1. `src/utils/validar.js`: as três funções da aula, `validarTelefone` (11 dígitos) e `validarCadastro`
2. `src/utils/mascaras.js`: `mascararTelefone`, conferida com `console.log`
3. `Campo` com a prop `erro`
4. `src/telas/Cadastro.js`: nome, e-mail, telefone com máscara, senha e `Switch` de termos, com teclado certo e foco encadeado
5. `KeyboardAvoidingView`, `ScrollView` e botão no rodapé
6. Validação ao sair e ao enviar, "Enviando..." e `Alert` de sucesso
7. `<Cadastro />` no `App.js`, commit "E15: cadastro com validação" e `git push`
:::

**Critérios de entrega**: teclado sem cobrir campo nem botão; erro que aparece ao sair e some ao corrigir; máscara que aguenta texto colado; nenhum `useState` em `src/utils/`. Entregue o link do repositório no sistema.
