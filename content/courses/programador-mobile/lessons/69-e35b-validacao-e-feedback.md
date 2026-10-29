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

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **validação** | conferir se o que a pessoa digitou serve, antes de enviar |
| **feedback** | a resposta do app ao que você fez: uma mensagem, uma cor, um "Enviando..." |
| **perder o foco** (`onBlur`) | o momento em que o usuário sai do campo, tocando em outro lugar |
| **máscara** | a função que arruma o texto enquanto a pessoa digita: `(11) 98765-4321` |
| **função pura** | uma função que recebe dados e devolve um resultado, sem mexer em mais nada |
| **`null`** | o valor que quer dizer "nada aqui"; nesta aula, "nenhum erro" |

---

## "Dados inválidos"

Você abre uma conta num app de banco. Preenche oito campos, toca em **Continuar** e recebe um alerta: "Dados inválidos". Qual dado? O que fazer? Você confere tudo, toca de novo e recebe o mesmo alerta.

No dia seguinte, outro app: na primeira letra do e-mail, o campo já fica vermelho, acusando "E-mail inválido".

Os dois erram no **feedback**: o primeiro não diz onde está o problema; o segundo acusa antes de você terminar.

:::question
Quando um app deveria avisar que o e-mail está errado: a cada letra, ao sair do campo ou só ao tocar em Continuar?
:::

---

## Validação

O que o atendente confere na sua ficha antes de aceitar o cadastro?

---

## :icon[clipboard-check] Validação: conferir antes de enviar

**Validação** é conferir os dados antes de enviar. Funciona como o atendente que confere a sua ficha no balcão: ele olha campo por campo e aponta o que falta, antes de aceitar.

| Você digita | A validação responde |
|---|---|
| `ana@` no e-mail | Use o formato nome@exemplo.com |
| nada no nome | Informe seu nome |
| `ana@email.com` no e-mail | nada: está tudo certo |

A resposta da validação é um **feedback**: o app conta o que aconteceu e o que fazer. Falta decidir **quando** conferir.

---

## :icon[timer] Quando validar

:::center
![Animação: uma linha do tempo do campo de e-mail; ao digitar ana@ nada aparece; ao sair do campo, o onBlur pinta a borda de vermelho e mostra Use o formato nome@exemplo.com; ao tocar em Criar conta, o onPress valida todos os campos](images/e35-quando-validar.svg)
:::

**`onBlur`** é o evento que o `TextInput` dispara quando perde o foco: o usuário saiu do campo.

A regra da Lojinha:

1. Valide **ao sair** de cada campo (`onBlur`), logo depois de o usuário terminar, e **ao enviar** (`onPress` do botão), que pega o que ficou em branco
2. Ao digitar (`onChangeText`), só **apague** o erro daquele campo: validar a cada tecla acusa antes de o usuário terminar e irrita

---

## Mensagens que ajudam

Qual mensagem de erro de um app já deixou você sem saber o que fazer?

---

## :icon[message-square] Mensagens que ajudam

Uma mensagem de erro é como a luz do painel do carro: diz o que aconteceu e onde. No formulário, ela também diz como corrigir.

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

## Regras fora da tela

Se o login também pede e-mail, por que escrever a mesma regra duas vezes?

---

## :icon[file-code] validar.js: a regra fora da tela

O `src/utils/validar.js` veio do `lojinha-regras` com a pasta `src/`, no E30. Ele já tem o `ehCepValido` e as máscaras do E06. As regras do cadastro entram no fim dele, como **funções puras**: recebem dados e devolvem um resultado, sem mexer na tela.

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

- `ehCepValido` responde sim ou não; `validarSenha` devolve a **mensagem de erro**, ou `null` quando está tudo certo, porque a tela precisa saber o que dizer
- Fora do componente, a regra serve ao cadastro, ao login e à edição do perfil

---

## :icon[list-ordered] As regras em português

| Linha | O que ela diz |
|---|---|
| `export function validarObrigatorio(valor, rotulo)` | "esta regra recebe o valor e o nome do campo"; o `export` a põe na vitrine para a tela usar |
| `valor.trim() === ''` | "sem os espaços das pontas, está vazio?" |
| `` `Informe ${rotulo}` `` | a mensagem com o nome do campo: `Informe seu nome` |
| `: null` | "se não, devolva `null`": nenhum erro |
| `if (senha === '') return 'Crie uma senha'` | "senha vazia? devolva a mensagem e pare" |
| `senha.length >= 8 ? null : '...'` | "8 caracteres ou mais? `null`; se não, a mensagem" |

---

## :icon[mail] validarEmail

O e-mail ganha uma regra com uma **expressão regular**, o molde de texto do E06:

```javascript
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarEmail(email) {
  const limpo = email.trim();
  if (limpo === '') return 'Informe seu e-mail';
  return FORMATO_EMAIL.test(limpo) ? null : 'Use o formato nome@exemplo.com';
}
```

- `trim()` tira os espaços das pontas: o teclado às vezes põe um espaço depois da sugestão
- O molde não garante que o e-mail existe; ele pega erros de digitação

---

## :icon[list-ordered] O molde do e-mail em português

| Peça | O que ela diz |
|---|---|
| `^` e `$` | do início ao fim: o texto inteiro precisa seguir o molde (E06) |
| `[^\s@]+` | um ou mais caracteres que **não** são espaço nem `@`. O `\s` é um espaço, e o `^` dentro dos colchetes quer dizer "menos" |
| `@` | uma arroba |
| `\.` | um ponto de verdade |
| `FORMATO_EMAIL.test(limpo)` | "o texto segue o molde?": `true` ou `false` |

Leia o molde inteiro assim: um trecho sem espaço nem `@`, um `@`, outro trecho, um ponto e mais um trecho. Só o `\s` e o `^` dentro dos colchetes são novidade; o resto você leu no CEP do E06.

---

## :icon[table] As regras na prática

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

## Máscara

Por que o formulário de papel já traz impressos os parênteses e o tracinho do telefone?

---

## :icon[phone] A máscara de telefone já existe

Uma **máscara** arruma o texto enquanto a pessoa digita, como os parênteses e o tracinho já impressos num formulário de papel: você escreve só os números. A do telefone você escreveu no E06, no mesmo `validar.js`:

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

## :icon[phone] A máscara na prática

O campo de celular do cadastro, com a máscara do E06 a cada tecla:

```jsx
<Campo rotulo="Celular" keyboardType="phone-pad" value={telefone}
  onChangeText={(t) => setTelefone(mascararTelefone(t))} />
```

| O usuário | O campo mostra |
|---|---|
| digita `1198` | `(11) 98` |
| digita os 11 dígitos, `11987654321` | `(11) 98765-4321` |
| cola `(11) 98765-4321`, copiado de uma mensagem | `(11) 98765-4321`, igual |

A máscara só olha os dígitos: digitado ou colado, com ou sem símbolos, o resultado é o mesmo.

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

## Erros como objeto

Cinco campos, cinco erros possíveis: onde guardar tudo isso sem virar bagunça?

---

## :icon[braces] Erros como objeto

Com 5 campos, um `useState` para cada valor e outro para cada erro vira bagunça. Junte tudo em dois **objetos** com as mesmas chaves, como duas fichas de cadastro iguais: na primeira, o que a pessoa digitou; na segunda, o problema de cada campo.

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
- O spread do E09 tira uma cópia do objeto e troca só uma chave
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

- `validarCadastro` devolve a ficha de erros, com as mesmas chaves de `valores`
- `temErros` junta o `Object.values` do E08 ao `some` do E09: pega as respostas da ficha e pergunta se alguma é uma mensagem. O `Boolean` conta o `null` como "não"

Ao sair de um campo, a tela confere tudo e pega só a chave dele:

```jsx
function aoSair(campo) {
  setErros({ ...erros, [campo]: validarCadastro(valores)[campo] });
}
```

`validarTelefone` é sua no laboratório: 11 dígitos, ou uma mensagem que ajude.

---

## :icon[braces] A ficha de erros na prática

```javascript
validarCadastro({ ...VAZIO, email: 'ana@' }).email;
// 'Use o formato nome@exemplo.com'

temErros(validarCadastro(VAZIO)); // true: tudo em branco
temErros({});                     // false: nenhum erro ainda
```

O objeto `erros` ao longo do preenchimento do e-mail:

| Momento | `erros` | Na tela |
|---|---|---|
| ao abrir | `{}` | nenhuma mensagem |
| sai do e-mail com `ana@` | `{ email: 'Use o formato nome@exemplo.com' }` | a mensagem embaixo do e-mail |
| volta e digita | `{ email: null }` | a mensagem some |

---

## Erro no Campo

Onde o erro do e-mail deveria aparecer: num alerta ou embaixo do e-mail?

---

## :icon[component] Campo com a prop erro

O `Campo` do UI kit (E33) ganha uma prop nova, **`erro`**: a mensagem que aparece embaixo da caixa. Como toda prop, é o pedido que a tela faz à peça: "mostre esta mensagem".

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

## :icon[component] O Campo com erro na prática

```jsx
<Campo rotulo="Nome" />
<Campo rotulo="Nome" erro="Informe seu nome" />
<Campo rotulo="E-mail" erro={erros.email} />
```

| Chamada | Na tela |
|---|---|
| sem `erro` | a caixa com a borda comum, sem mensagem |
| `erro="Informe seu nome"` | borda na cor `perigo`, mais grossa, e "Informe seu nome" embaixo |
| `erro={erros.email}` | depende da ficha: com `null`, nada; com um texto, a mensagem aparece |

Ponha os dois primeiros na `Galeria` do E33 e troque o tema do celular: a cor `perigo` muda junto.

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

## O envio

O formato está certo, mas o e-mail já tem conta. Quem sabe disso?

---

## :icon[server] O servidor também recusa

O **servidor** é o computador da loja, que guarda as contas. Ele é a cozinha do restaurante: só a cozinha sabe se o prato ainda existe. Do mesmo jeito, formato certo não diz se o e-mail já tem conta. Até a Lojinha ter uma API de cadastro, `src/servicos/conta.js` faz o papel do servidor:

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
- Com uma API de verdade, o corpo da função vira um `pedir` do E19, e a tela não muda

---

## :icon[send] Enviando: try, catch e finally

O `try` é a rede de proteção do trapezista (E17): se o servidor recusar, o app cai no `catch` em vez de quebrar. O `finally` roda sempre, com queda ou sem queda.

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
- No sucesso, `setValores(VAZIO)` limpa o formulário

---

## :icon[list-ordered] O envio em português

| Linha | O que ela diz |
|---|---|
| `validarCadastro` e `setErros(novos)` | "confira tudo e mostre os erros" |
| `if (temErros(novos)) return` | "tem erro? pare aqui, sem chamar o servidor" |
| `setEnviando(true)` | "o botão passa a dizer Enviando... e trava" |
| `try { ... await criarConta(...) }` | "tente criar a conta e espere a resposta" |
| `catch (erro)` | "recusou? um `ErroDeNegocio` vira mensagem no campo; outro erro é bug: relance" |
| `finally` | "com ou sem erro, destrave o botão" |

A validação **devolve** mensagens, porque o formulário mostra todos os erros de uma vez. O servidor **lança**, porque a recusa interrompe o envio, como o `freteDoCep` do E17.

---

## :icon[send] O envio na prática

Três tentativas de criar a conta com o `enviar` da aula e o `criarConta` simulado:

| Você preenche e toca em Criar conta | O que acontece |
|---|---|
| nada | todas as mensagens aparecem de uma vez, e o servidor nem é chamado |
| tudo certo, com `bia@email.com` | "Enviando...", com o botão apagado; depois, o alerta "Conta criada" com o nome |
| tudo certo, com `ana@email.com` | "Enviando..."; depois de 1,5 s, a recusa aparece embaixo do e-mail e o botão destrava |

A recusa é a mensagem do `ErroDeNegocio`: "Este e-mail já tem conta. Use outro ou entre com ele." Toque duas vezes rápido no botão: o segundo toque não faz nada, porque ele está desabilitado.

---

## Erros comuns

O botão ficou em "Enviando..." para sempre. O que deu errado?

---

## :icon[siren] Quando aparece um erro

| O que aparece | Quer dizer | O que fazer |
|---|---|---|
| `Too many re-renders` ao abrir | sem arrow function, `aoSair('email')` roda ao desenhar e muda o estado, sem fim | `onBlur={() => aoSair('email')}` |
| o campo fica vermelho na primeira letra | a validação está no `onChangeText` | validar no `onBlur` |
| o erro não aparece | `erros.email = '...'` muda o objeto direto e não redesenha | `setErros` com spread |
| telefone completo dado como incompleto | contou os 15 caracteres de `'(11) 98765-4321'` | contar os dígitos: são 11 |
| botão preso em "Enviando..." | `setEnviando(false)` no fim do `try`: a recusa pula a linha | levar a linha para o `finally` |

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

---

## :icon[milestone] Projeto 6 · Etapa 6: formulário de cadastro

No seu repositório `casas-de-adocao`:

- `src/telas/Cadastro.js` com nome, responsável, celular, e-mail, CEP, rua, número, bairro, cidade, UF, capacidade e ocupação, mais visitas e descrição opcionais: teclado certo em cada campo e o Próximo levando ao seguinte
- `Switch` para "aceita cães" e "aceita gatos"; o botão de salvar sem o teclado cobrir
- máscaras de telefone e CEP em `src/utils/` (as suas do `lojinha-regras` servem)
- `validarCasa(valores)` em `src/regras/casas.js`: devolve os erros, mostrados embaixo de cada campo ao sair e ao salvar
- no `App.js`, um `useState` alterna entre a Início e o Cadastro; sem erros, Salvar mostra um `Alert`

Commit: `Projeto 6: etapa 6, formulário de cadastro`. Enunciado completo e entrega: página do curso, em **Projetos**.
