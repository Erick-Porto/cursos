---
title: Validação e feedback
summary: Valide no momento certo, mostre erros que ajudam e trate o envio com funções puras, o Campo e try/catch.
module: layout-rn
duration_minutes: 40
objectives:
  - Validar campos ao sair e ao enviar, com mensagens que dizem como corrigir
  - Acrescentar validações puras ao validar.js do E06 e reaproveitar a máscara de telefone
  - Mostrar o erro no Campo e o estado de envio, tratando a recusa do servidor
---

# Validação e feedback

Programador Mobile · Encontro E35 · Aula 69 de 89

---

## O que você vai aprender

:::goal
- Decidir **quando** validar: ao sair do campo e ao enviar
- Escrever mensagens de erro que dizem como corrigir
- Acrescentar ao `validar.js` do E06 as regras do cadastro, como funções puras
- Mostrar o erro no `Campo`, o "Enviando..." no botão e a recusa do servidor
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
![Animação: uma linha do tempo do campo de e-mail; ao digitar ana@ nada aparece; ao sair do campo, o onBlur pinta a borda de vermelho e mostra Use o formato nome@exemplo.com; ao tocar em Criar conta, o onPress valida todos os campos](images/e35-quando-validar.svg)
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

## :icon[file-code] validar.js: a regra fora da tela

O `src/utils/validar.js` veio do `lojinha-regras` com a pasta `src/`, no E30. Ele já tem o `ehCepValido` e as máscaras do E06. As regras do cadastro entram no fim dele:

```javascript
// src/utils/validar.js, depois do que veio do E06
export function validarObrigatorio(valor, rotulo) {
  return valor.trim() === '' ? `Informe ${rotulo}` : null;
}

export function validarSenha(senha) {
  if (senha === '') return 'Crie uma senha';
  return senha.length >= 8 ? null : 'Use pelo menos 8 caracteres';
}
```

- São **funções puras**, como as do E07: recebem dados e devolvem um resultado, sem ler estado nem mudar a tela
- `ehCepValido` responde sim ou não; `validarSenha` devolve a **mensagem de erro**, ou `null` quando está tudo certo, porque a tela precisa saber o que dizer
- Fora do componente, a regra serve ao cadastro, ao login e à edição do perfil

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

`FORMATO_EMAIL` é uma expressão regular, como a do CEP no E06. Duas peças são novas: `\s` é um espaço, e `[^\s@]` é uma classe com `^` dentro, que quer dizer "qualquer caractere **menos** espaço e `@`". Leia o molde assim: um trecho sem espaço nem `@`, um `@`, outro trecho, um ponto (`\.`) e mais um trecho.

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

É assim que se confere uma função pura: uma lista de entradas e a saída esperada de cada uma. No `lojinha-regras`, uma tabela assim virava um `test.each` do Jest (E04). No app, confira por enquanto com `console.log`; o Jest volta no E42, com o preset `jest-expo`.

---

## :icon[phone] A máscara de telefone já existe

Uma **máscara** formata o texto enquanto o usuário digita. A do telefone você escreveu no E06, no mesmo `validar.js`:

```javascript
export function mascararTelefone(texto) {
  const d = texto.replace(/\D/g, '').slice(0, 11);
  return d
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}
```

- `replace(/\D/g, '')` apaga o que não é dígito; `slice(0, 11)` corta no tamanho de um celular
- Cada separador só aparece quando existe o dígito seguinte: é isso que deixa o usuário apagar

No campo, ela roda a cada tecla: `onChangeText={(t) => setTelefone(mascararTelefone(t))}`. Não escreva outra em um arquivo novo: a regra do telefone mora num lugar só.

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

- `[campo]` é o colchete do E08 (`produto[campo]`), agora ao criar o objeto: o **valor** da variável vira o nome da chave, e `alterar('email', 'ana')` muda `valores.email`
- O spread do E09 copia o objeto e troca só uma chave
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

export function temErros(erros) {
  return Object.values(erros).some(Boolean); // alguma chave tem mensagem?
}
```

A função devolve um objeto de erros com as mesmas chaves de `valores`; `temErros` junta o `Object.values` do E08 ao `some` do E09. Ao sair de um campo, a tela pega só a chave dele:

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
        style={[estilos.entrada, borda, { color: cores.texto, backgroundColor: cores.superficie }]}
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
- No fim do arquivo, um estilo novo: `erro: { fontSize: fonte.pequena, fontFamily: familia.regular }`; o `gap` do `campo` já afasta a mensagem da caixa

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
- O telefone é igual, com a máscara do E06 no caminho: `onChangeText={(t) => alterar('telefone', mascararTelefone(t))}`
- O `Switch` usa `onValueChange={(v) => alterar('termos', v)}` e mostra `erros.termos` num `Text` na cor `perigo`

---

## :icon[server] O servidor também recusa

Formato certo não basta: só o servidor sabe se o e-mail já tem conta. Até a Lojinha ter uma API de cadastro, `src/servicos/conta.js` faz esse papel:

```javascript
import { ErroDeNegocio } from '../modelos/erros.js';
import { esperar } from './checkout.js';

const EMAILS_EM_USO = ['ana@email.com'];

export async function criarConta(valores) {
  await esperar(1500); // o tempo da rede
  const email = valores.email.trim().toLowerCase();
  if (EMAILS_EM_USO.includes(email)) {
    throw new ErroDeNegocio('Este e-mail já tem conta. Use outro ou entre com ele.', 'EMAIL_EM_USO');
  }
  return { nome: valores.nome.trim(), email };
}
```

- `esperar` é o do E18, e `ErroDeNegocio`, o do E17: os dois vieram com a pasta `src/`
- A validação **devolve** mensagens, porque o formulário mostra todos os erros de uma vez. O servidor **lança**, porque a recusa interrompe o envio, como o `freteDoCep` do E17
- Com uma API de verdade, o corpo da função vira um `pedir` do E19, e a tela não muda

---

## :icon[send] Enviando: try, catch e finally

```jsx
async function enviar() {
  const novos = validarCadastro(valores);
  setErros(novos);
  if (temErros(novos)) return; // nem chama o servidor
  setEnviando(true);
  try {
    const conta = await criarConta(valores);
    Alert.alert('Conta criada', `Boas-vindas, ${conta.nome}!`);
  } catch (erro) {
    if (!(erro instanceof ErroDeNegocio)) throw erro; // bug: não esconda
    setErros({ email: erro.message }); // a recusa aparece no campo
  } finally {
    setEnviando(false); // destrava o botão, com ou sem erro
  }
}
```

- No rodapé: `<Botao titulo={enviando ? 'Enviando...' : 'Criar conta'} onPress={enviar} desabilitado={enviando} />`. O botão desabilitado impede o toque duplo, que criaria duas contas
- O `finally` do E17 garante que o botão volta, mesmo quando o servidor recusa
- No sucesso, `setValores(VAZIO)` limpa o formulário

---

## :icon[bug] Erros comuns

:::warning
- `onBlur={aoSair('email')}` sem arrow function: valida na renderização, muda o estado, renderiza de novo... e o app quebra com "Too many re-renders"
- Validar no `onChangeText`: o campo fica vermelho na primeira letra
- `erros.email = 'Informe seu e-mail'`: mudar o objeto direto não redesenha a tela; use `setErros` com spread
- Contar os caracteres do telefone mascarado: `'(11) 98765-4321'` tem 15, não 11. Conte os dígitos
- `setEnviando(false)` no fim do `try`, sem `finally`: quando o servidor recusa, o botão fica em "Enviando..." para sempre
:::

---

## Resumo

:::summary
- Valide ao sair do campo (`onBlur`) e ao enviar; ao digitar, só apague o erro daquele campo
- Boas mensagens dizem o que fazer e aparecem embaixo do campo, não num alerta genérico
- O `validar.js` do E06 ganha funções puras que devolvem a mensagem ou `null`; a máscara do telefone é a mesma do E06
- `erros` é um objeto com as mesmas chaves de `valores`; o `Campo` mostra `erro` na cor `perigo`
- O envio usa `try`, `catch` e `finally`: a recusa do servidor vira mensagem no campo e o botão sempre destrava
:::

---

## :icon[flask-conical] No laboratório

O cadastro da Lojinha, do primeiro toque ao "Conta criada".

:::steps
1. `src/utils/validar.js`: as funções da aula e `validarTelefone` (11 dígitos), conferidas com `console.log`
2. `src/servicos/conta.js` com `criarConta`; `Campo` com a prop `erro`
3. `src/telas/Cadastro.js`: os 5 campos, com teclado certo, foco encadeado e a máscara do E06 no telefone
4. `KeyboardAvoidingView`, `ScrollView` e botão no rodapé
5. Validação ao sair e ao enviar, "Enviando...", recusa no e-mail e `Alert` de sucesso
6. `<Cadastro />` no `App.js`, commit "E35: cadastro com validação" e `git push`
:::

**Critérios**: teclado sem cobrir campo nem botão; erro que aparece ao sair e some ao corrigir; máscara que aguenta texto colado; `ana@email.com` recusado no campo, com o botão destravado; nenhum `useState` em `src/utils/`. Entregue o link do repositório.
