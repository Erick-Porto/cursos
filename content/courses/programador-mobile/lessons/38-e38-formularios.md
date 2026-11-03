---
title: Formulários
summary: "O cadastro de casa: campos com o teclado certo, uma escolha entre opções e o erro embaixo do campo certo."
module: layout-rn
duration_minutes: 90
objectives:
  - Montar um formulário com o Campo do kit, um useState por campo e o teclado certo para cada dado
  - Oferecer uma escolha entre opções com o Opcoes do kit
  - Conferir o formulário com uma função que devolve um objeto de erros e mostrar cada erro embaixo do seu campo
  - Salvar a casa nova com adicionarCasa e voltar para a lista com router.back()
---

# Formulários

Programador Mobile · Encontro E38 · Aula 38 de 45

---

## O que você vai aprender

:::goal
- Montar um formulário no celular com o `Campo` do kit
- Abrir o teclado certo para cada dado: letras, telefone ou números
- Guardar cada campo no seu estado e escolher uma opção com o `Opcoes`
- Conferir o formulário com `validar()` e mostrar cada erro embaixo do seu campo
- Salvar a casa nova e voltar para a lista
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **formulário** | a tela que pede dados, campo por campo, como uma ficha de cadastro em papel |
| **`TextInput`** | o componente do React Native onde a pessoa digita (*text input*: entrada de texto) |
| **placeholder** | o exemplo em cinza dentro do campo vazio; some quando a pessoa digita |
| **teclado virtual** | o teclado que aparece na tela do celular; ele muda conforme o campo |
| **validação** | conferir o que a pessoa digitou antes de salvar |
| **retorno** | a resposta do app ao que a pessoa fez: uma mensagem, uma cor, um aviso |

---

## Ninguém consegue cadastrar uma casa

A Marta, voluntária do Lar da Mel, conhece uma casa nova em Campinas e quer pôr no app. Hoje, ela não consegue:

| Hoje, no começo | No fim do encontro |
|---|---|
| nenhum botão leva ao Cadastro | o botão **Cadastrar casa**, na Início |
| a tela Nova casa diz "Em construção" | sete campos, cada um com o teclado certo |
| nada confere o que foi digitado | cada campo com problema mostra a mensagem embaixo dele |
| sempre as mesmas 12 casas | a casa nova no topo, e o número de casas vira 13 |

:::question
Você já desistiu de um cadastro no celular? O que atrapalhou?
:::

---

## Campos de texto

Numa ficha de papel, como você sabe o que escrever em cada linha?

---

## :icon[pencil] TextInput: o campo de digitar

Um **formulário** é a ficha de cadastro em papel, na tela: cada campo pede um dado. Cada campo é um **`TextInput`**, a caixa de digitar da busca do E36, de `react-native`. Ele é um **input controlado**: o estado manda, o campo obedece.

```jsx
const [nome, setNome] = useState('');

<TextInput value={nome} onChangeText={setNome} placeholder="Lar da Mel" />
```

| Prop | O que ela diz |
|---|---|
| `value={nome}` | "mostre no campo o que está no estado `nome`" |
| `onChangeText={setNome}` | "a cada letra, guarde o texto novo em `nome`" |
| `placeholder="Lar da Mel"` | o exemplo em cinza; ele não é o valor: o campo continua vazio |

O **`onChangeText`** entrega o texto pronto: o `setNome` vai direto, sem seta. Hoje, o campo ganha mais props: o teclado, as maiúsculas e a mensagem de erro.

---

## :icon[component] O Campo do kit

O **`Campo`** do kit, o da busca, é um `TextInput` com o rótulo em cima e o lugar do erro embaixo.

| Prop | O que faz |
|---|---|
| `rotulo` | o texto em cima da caixa; o leitor de tela também lê |
| `erro` | com uma mensagem, a borda fica vermelha e ela aparece embaixo |
| `icone` | um ícone dentro da caixa, como a lupa da busca |
| as outras | `value`, `placeholder`...: o `Campo` passa ao `TextInput` de dentro |

```jsx
<Campo rotulo="Nome da casa" placeholder="Lar da Mel"
  value={nome} onChangeText={setNome} autoCapitalize="words" />
```

O **`autoCapitalize`** (maiúscula automática) diz quando o teclado põe maiúscula sozinho: `'words'`, em cada palavra, bom para nomes; `'sentences'`, o padrão, no começo da frase; `'none'`, nunca, bom para e-mail.

---

## :icon[milestone] Projeto 6 · Passo 1: o botão Cadastrar casa

Na Início (`app/(abas)/index.js`), dentro do `topo`, entre a faixa de números e a busca:

```jsx
<Botao titulo="Cadastrar casa" icone="add" onPress={() => router.push('/cadastro')} />
```

- `Botao` entra no import de `@/components/ui`; o `router` já está lá desde o E37
- O `router.push('/cadastro')` põe a tela Nova casa em cima da pilha, como uma carta nova

**Pronto quando:** o botão, cheio na cor primária, abre a tela Nova casa, com a seta de voltar e o aviso "Em construção". A seta tira a tela de cima.

---

## :icon[milestone] Projeto 6 · Passo 1: o primeiro campo

Troque o `app/cadastro.js` do kit inteiro. Em cima, os imports:

```jsx
import { useState } from 'react';
import { Alert } from 'react-native';
import { Botao, Campo, Tela } from '@/components/ui';
```

Embaixo, a tela:

```jsx
export default function Cadastro() {
  const [nome, setNome] = useState('');

  function salvar() {
    Alert.alert('Cadastro', `Nome: ${nome}`);
  }

  return (
    <Tela rolar comCabecalho>
      <Campo rotulo="Nome da casa" placeholder="Lar da Mel"
        value={nome} onChangeText={setNome} autoCapitalize="words" />
      <Botao titulo="Cadastrar casa" icone="checkmark" onPress={salvar} />
    </Tela>
  );
}
```

Com `rolar`, a `Tela` rola e sobe quando o teclado abre: o campo não fica coberto. O `comCabecalho` (E37) deixa o topo para o cabeçalho da pilha.

**Pronto quando:** tocar no campo abre o teclado com maiúscula no começo das palavras, e o botão mostra o aviso com o nome digitado.

---

## O teclado certo

Se o campo pede o telefone, por que o celular abriria o teclado de letras?

---

## :icon[keyboard] keyboardType: o teclado certo

O celular tem vários **teclados virtuais**: de letras, de discar, de números. A prop **`keyboardType`** (tipo de teclado) escolhe qual deles abre quando a pessoa toca no campo.

| `keyboardType` | O teclado | Use para |
|---|---|---|
| `'default'`, o padrão | de letras | nome, bairro, cidade |
| `'phone-pad'` | o do discador, com números grandes | telefone |
| `'number-pad'` | só os números de 0 a 9 | capacidade, quantidade, idade |
| `'email-address'` | de letras, com o `@` e o `.` à mão | e-mail |

```jsx
<Campo rotulo="Telefone" placeholder="(11) 91234-5678"
  value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
```

O teclado **ajuda, mas não trava**: dá para colar qualquer texto no campo. Por isso, o formulário ainda confere tudo antes de salvar.

---

## :icon[keyboard] O teclado certo na prática

Três campos de um app de entregas e o teclado que cada um abre:

```jsx
<Campo rotulo="Celular" keyboardType="phone-pad"
  value={celular} onChangeText={setCelular} />
<Campo rotulo="Quantidade" keyboardType="number-pad"
  value={quantidade} onChangeText={setQuantidade} />
<Campo rotulo="E-mail" keyboardType="email-address" autoCapitalize="none"
  value={email} onChangeText={setEmail} />
```

| Campo | Ao tocar, abre |
|---|---|
| Celular | o teclado de discar, com os números grandes |
| Quantidade | só os números, sem letras |
| E-mail | as letras, com `@` e `.` à mão e sem maiúscula no começo |

No iPhone, o teclado de números não tem a tecla de fechar: toque fora do campo para ele descer.

---

## Escolher uma opção

No rádio antigo do carro, o que acontece com a estação de antes quando você aperta outra?

---

## :icon[circle-dot] Opcoes: escolher uma só

Para "a casa aceita", digitar não é bom: um escreve "cachorro", outro "Caes". O **`Opcoes`** do kit mostra uma fileira de botões e deixa escolher **uma opção só**, como os botões de estação do rádio antigo do carro: apertar um solta o outro.

```jsx
const [aceita, setAceita] = useState('');

<Opcoes rotulo="A casa aceita" opcoes={['Cães', 'Gatos', 'Cães e gatos']}
  valor={aceita} onMudar={setAceita} />
```

| Prop | O que ela diz |
|---|---|
| `opcoes` | a lista dos textos dos botões |
| `valor` | a opção escolhida agora; `''` quando nenhuma |
| `onMudar` | a função que o `Opcoes` chama com a opção tocada, como `onMudar('Gatos')` |

É o "o pai guarda, o filho avisa" do E26: o estado `aceita` mora no Cadastro, e o `Opcoes` só avisa qual botão foi tocado.

---

## :icon[refresh-cw] Um estado por campo

Cada campo tem o seu **placar**, o seu `useState` (E26). Quando a pessoa digita ou toca, só o placar daquele campo muda, e a tela se redesenha.

| Campo | O estado | Começa com | Depois de preencher |
|---|---|---|---|
| Nome da casa | `nome` | `''` | `'Lar do Totó'` |
| Cidade | `cidade` | `''` | `'Campinas'` |
| Telefone | `telefone` | `''` | `'19 91234-5678'` |
| A casa aceita | `aceita` | `''` | `'Gatos'` |
| Capacidade | `capacidade` | `''` | `'10'`, um texto |

- Todos começam vazios, com `''`: o formulário abre em branco
- Todos guardam **texto**, até a capacidade, que veio do teclado de números

---

## :icon[milestone] Projeto 6 · Passo 2: os outros campos

No `app/cadastro.js`, embaixo do estado do nome, mais quatro:

```jsx
const [cidade, setCidade] = useState('');
const [telefone, setTelefone] = useState('');
const [aceita, setAceita] = useState('');
const [capacidade, setCapacidade] = useState('');
```

Na tela, entre o campo do nome e o botão (e `Opcoes` no import de `@/components/ui`):

```jsx
<Campo rotulo="Cidade" placeholder="São Paulo"
  value={cidade} onChangeText={setCidade} autoCapitalize="words" />
<Campo rotulo="Telefone" placeholder="(11) 91234-5678"
  value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
<Opcoes rotulo="A casa aceita" opcoes={['Cães', 'Gatos', 'Cães e gatos']}
  valor={aceita} onMudar={setAceita} />
<Campo rotulo="Capacidade (quantos animais cabem)" placeholder="20"
  value={capacidade} onChangeText={setCapacidade} keyboardType="number-pad" />
```

**Pronto quando:** o telefone abre o teclado de discar; a capacidade, o de números; tocar em Gatos deixa o botão cheio, com um visto, e só um fica escolhido.

---

## Validação por campo

Na vistoria do carro, de que adianta a folha dizer "reprovado" sem dizer em qual item?

---

## :icon[clipboard-check] validar(): a folha com o nome de cada item

**Validar** é conferir antes de salvar, como a vistoria do carro do E16: o vistoriador anota na folha o que reprovou. Hoje, a folha traz o **nome de cada item**: `validar()` devolve um **objeto de erros**, o `novos`.

```jsx
function validar() {
  const novos = {};
  if (cidade.trim() === '') novos.cidade = 'Informe a cidade';
  return novos;
}
```

O **`if` numa linha só**, sem chaves, roda só a instrução daquela linha.

| No E16, a agenda | Hoje, o cadastro |
|---|---|
| `const erros = [];` | `const novos = {};` |
| `erros.push('Informe o nome');` | `novos.cidade = 'Informe a cidade';` |
| `['Informe o nome']`: só a mensagem | `{ cidade: 'Informe a cidade' }`: campo e mensagem |

Com o **nome do campo**, a tela sabe onde mostrar cada mensagem. Folha em branco, `{}`: aprovado.

---

## :icon[hash] Do campo vem texto

O que sai de um campo é sempre **texto**: a capacidade chega como `'20'`, não `20`. Para conferir como número, o `Number` (E09) converte, e o `Number.isInteger` (E10) pergunta se é inteiro:

| O campo tem | `Number(...)` dá | `Number.isInteger(...)` |
|---|---|---|
| `'20'` | `20` | `true` |
| `''`, vazio | `0` | `true` |
| `'2,5'` | `NaN` | `false` |
| `'2.5'` | `2.5` | `false` |
| `'vinte'` | `NaN` | `false` |

Comparar textos engana: `'6' > '10'` é `true`, porque o texto compara letra por letra, como no dicionário, e o `'6'` vem depois do `'1'`. Com números, `6 > 10` é `false`. Antes de comparar, `Number`.

---

## :icon[list-ordered] validar() em português

| Linha | O que ela diz |
|---|---|
| `const novos = {};` | "a folha da vistoria começa em branco" |
| `if (nome.trim().length < 3) novos.nome = '...';` | "sem os espaços das pontas, o nome tem menos de 3 letras? Anote em `nome`" |
| `if (aceita === '') novos.aceita = '...';` | "nenhuma opção escolhida? Anote em `aceita`" |
| `const lugares = Number(capacidade);` | "a capacidade, em número" |
| `if (!Number.isInteger(lugares) \|\| lugares < 1)` | "não é inteiro, ou é menor que 1? Anote em `capacidade`" |
| `return novos;` | "entregue a folha; em branco, `{}`, é tudo certo" |

Cidade vazia e telefone com menos de 10 caracteres também vão para a folha.

---

## :icon[list-checks] validar(), campo por campo

A Bia preencheu assim e tocou em Cadastrar casa:

| Campo | Tem | A pergunta vira | Resposta | Entra em `novos`? |
|---|---|---|---|---|
| nome | `'Lá'` | `2 < 3` | `true` | sim: `nome` |
| cidade | `''` | `'' === ''` | `true` | sim: `cidade` |
| telefone | `'1199'` | `4 < 10` | `true` | sim: `telefone` |
| aceita | `'Gatos'` | `'Gatos' === ''` | `false` | não |
| capacidade | `'2,5'` | `NaN` não é inteiro | `true` | sim: `capacidade` |

No fim, `novos` tem 4 campos. O **`Object.keys(novos)`** (E13) dá `['nome', 'cidade', 'telefone', 'capacidade']`, e o `.length` é 4. Com tudo certo, a folha volta em branco: `.length` 0.

---

## Retorno ao usuário

Você faz um Pix e a tela não mostra nada. O que você faz?

---

## :icon[message-square] Retorno: o app responde

O **retorno** é a resposta do app ao que a pessoa fez, como o comprovante do Pix: sem ele, ninguém sabe se deu certo.

| Ao cadastrar... | O app responde |
|---|---|
| há erro | borda vermelha e mensagem embaixo de cada campo errado, e "Confira o formulário" |
| tudo certo | "Casa cadastrada" e a volta à lista, com a casa no topo |

A prop `erro` leva cada mensagem ao seu campo:

```jsx
<Campo rotulo="Cidade" value={cidade} onChangeText={setCidade} erro={erros.cidade} />
```

- Com `{ cidade: 'Informe a cidade' }` em `erros`, a mensagem aparece embaixo da cidade
- `erros.telefone` não está na folha: dá `undefined`, e o telefone fica sem mensagem
- A mensagem diz **o que fazer**: "Informe a cidade", não "Campo inválido"

---

## :icon[milestone] Projeto 6 · Passo 3: a função validar

No `app/cadastro.js`, embaixo dos estados dos campos, mais um estado, para a folha de erros, e a função `validar`:

```jsx
const [erros, setErros] = useState({});

function validar() {
  const novos = {};
  if (nome.trim().length < 3) novos.nome = 'Escreva o nome da casa, com pelo menos 3 letras';
  if (cidade.trim() === '') novos.cidade = 'Informe a cidade';
  if (telefone.trim().length < 10) novos.telefone = 'Telefone com DDD, como 11 91234-5678';
  if (aceita === '') novos.aceita = 'Escolha quem a casa aceita';
  const lugares = Number(capacidade);
  if (!Number.isInteger(lugares) || lugares < 1) {
    novos.capacidade = 'Quantos animais cabem: um número inteiro, a partir de 1';
  }
  return novos;
}
```

O estado `erros` começa com `{}`, a folha em branco: o formulário abre sem nenhuma mensagem. Na tela, nada muda ainda: quem chama o `validar` é o `salvar`.

---

## :icon[milestone] Projeto 6 · Passo 3: cada erro no seu campo

Troque a função `salvar` por esta:

```jsx
function salvar() {
  const novos = validar();
  setErros(novos);
  if (Object.keys(novos).length > 0) {
    Alert.alert('Confira o formulário', 'Os campos em vermelho precisam de ajuste.');
    return;
  }
  Alert.alert('Tudo certo', nome);
}
```

- `setErros(novos)` guarda a folha no estado, e a tela se redesenha com as mensagens
- Folha com algum campo? Há erro: o aviso aparece, e o `return;` sai da função ali, sem seguir (o retorno antecipado do E10)

Depois, cada campo ganha a sua mensagem: `erro={erros.nome}`, `erro={erros.cidade}`, `erro={erros.telefone}`, `erro={erros.aceita}` nas `Opcoes` e `erro={erros.capacidade}`.

**Pronto quando:** com tudo vazio, as bordas ficam vermelhas, cada campo mostra a sua mensagem e aparece "Confira o formulário"; corrigir e tocar de novo tira as mensagens e mostra "Tudo certo".

---

## Salvar e voltar

Na pilha de cartas, como você volta a ver a carta de baixo?

---

## :icon[undo-2] adicionarCasa e router.back()

O `useCasas()` é o quadro de avisos das casas (E36): todas as telas leem a mesma lista. Ele também traz o **`adicionarCasa`**, que põe uma casa nova no começo da lista. E o **`router.back()`** tira a tela de cima da pilha (E37), como tirar a carta de cima: a Início, que estava embaixo, volta a aparecer.

```jsx
const { adicionarCasa } = useCasas();

adicionarCasa({ nome: nome.trim(), aceita, capacidade: Number(capacidade) });
router.back();
```

- O objeto entre as chaves é a ficha preenchida (E13); os campos que faltam, o kit deixa vazios
- `aceita` sozinho é o atalho de `aceita: aceita`: o campo e o estado têm o mesmo nome
- `nome.trim()` tira os espaços das pontas; `Number(capacidade)` guarda o número, não o texto
- A Início lê o mesmo quadro: a casa aparece lá sem nenhuma linha nova na Início

---

## :icon[milestone] Projeto 6 · Passo 4: salvar de verdade

No `app/cadastro.js`, mais dois imports e, no começo da função `Cadastro`, o `adicionarCasa`:

```jsx
import { router } from 'expo-router';
import { useCasas } from '@/data/CasasContext';
```

```jsx
const { adicionarCasa } = useCasas();
```

No `salvar`, no lugar do `Alert.alert('Tudo certo', nome)`:

```jsx
adicionarCasa({
  nome: nome.trim(),
  cidade: cidade.trim(),
  telefone: telefone.trim(),
  aceita,
  capacidade: Number(capacidade),
});
Alert.alert('Casa cadastrada', `${nome.trim()} já aparece na lista.`);
router.back();
```

**Pronto quando:** a tela volta para a Início com o aviso, a casa nova no topo da lista e 13 casas nos números. Sem bairro, o cartão mostra ", Campinas" e todas as vagas livres: é a Sua vez.

---

## :icon[milestone] Projeto 6 · Sua vez: bairro e animais lá hoje

Agora, sozinho. Mais dois campos obrigatórios, com mensagem:

1. **Bairro**, logo depois do nome: não pode ficar vazio
2. **Animais lá hoje**, depois da capacidade, com o teclado de números: inteiro, de 0 até a capacidade
3. Os dois entram no `adicionarCasa`

:::tip Dicas
- Na ocupação, três casos, com `if`, `else if` e `else if` (E10): vazia; não inteira ou menor que 0; maior que a capacidade
- Compare **números**: `'6' > '10'` é `true`
- No `adicionarCasa`, `bairro: bairro.trim()` e `ocupacao: Number(ocupacao)`
:::

**Pronto quando:** capacidade 10 e 12 animais mostra uma frase como "Não pode passar da capacidade"; com 6, a casa entra no topo, com o bairro e "4 vagas".

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `Property 'Opcoes' doesn't exist` | faltou no import; vale para `Botao` e `router` | pôr no import |
| `Too many re-renders` | `onPress={salvar()}`: com parênteses, roda ao desenhar | `onPress={salvar}` |
| nenhuma; o nome digitado chega vazio ao `validar` | `value` sem `onChangeText` | `onChangeText={setNome}` |
| nenhuma; 6 animais em 10 lugares não passa | comparou texto: `'6' > '10'` | comparar com `Number` |
| nenhuma; a mensagem não aparece | `novos.cidades` e `erros.cidade` | o mesmo nome |
| `The action 'GO_BACK' was not handled` | o app recarregou no Cadastro, sem tela embaixo | abrir o Cadastro pela Início |

---

## :icon[milestone] Projeto 6 · Etapa 6 pronta

- O botão Cadastrar casa, na Início, abre a tela Nova casa
- Sete campos: nome, bairro, cidade, telefone, quem a casa aceita, capacidade e animais lá hoje, cada um com o seu teclado
- Com tudo vazio, cada campo mostra a sua mensagem, e nada é salvo
- Com capacidade 10 e 6 animais, a casa entra no topo com "4 vagas", e os números viram 13 casas

```bash
git add .
git commit -m "Projeto 6: etapa 6, cadastro de casa"
git push
```

A casa nova fica na memória: ao recarregar o app, voltam as 12. O que faltar, termine em casa antes do E39, pelos slides e pela página do Projeto 6.

---

## Resumo

:::summary
- O `TextInput` é o campo de digitar; o `Campo` do kit põe o rótulo em cima, o erro embaixo e passa o resto para ele
- `value` e `onChangeText` ligam o campo ao estado; o `placeholder` é só o exemplo em cinza
- `keyboardType` escolhe o teclado (`phone-pad`, `number-pad`); `autoCapitalize`, as maiúsculas
- Um `useState` por campo; o `Opcoes` escolhe uma opção só e avisa com `onMudar`
- Do campo vem texto: `Number` antes de conferir ou comparar
- `validar()` devolve um objeto de erros, com o nome do campo; `erro={erros.cidade}` mostra a mensagem embaixo da cidade
- Sem erros: `adicionarCasa`, o aviso de retorno e `router.back()`
:::

---

## :icon[arrow-right] Próximos passos

No E39, o acabamento e a entrega do Projeto 6:

- :icon[hourglass] a tela de espera e a de erro, enquanto a lista não chega do servidor
- :icon[megaphone] o leitor de tela, que lê cada cartão em voz alta, numa frase só
- :icon[columns-3] duas colunas de cartões com o celular deitado
- :icon[send] o README com prints e a entrega na plataforma
