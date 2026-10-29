---
title: Dados no aparelho e login
summary: Guarde no aparelho o que o cliente não pode perder e entre com uma conta de verdade, com o token no SecureStore.
module: integracao
duration_minutes: 30
objectives:
  - Decidir o que fica na memória, no AsyncStorage, no SecureStore e no servidor
  - Restaurar um dado do app da equipe ao abrir e gravá-lo ao mudar, com a trava carregado
  - Entrar na DummyJSON pelo pedir e guardar o token no SecureStore
  - Criar o AuthContext, que restaura a sessão e decide entre Entrar e as abas
---

# Dados no aparelho e login

Programador Mobile · Encontro E43 · Aula 85 de 89

---

## O que você vai aprender

:::goal
- Decidir onde mora cada dado: memória, aparelho, cofre do sistema ou servidor
- Escrever `src/servicos/armazenamento.js` com `salvar` e `ler`
- Restaurar o carrinho ao abrir e gravá-lo ao mudar, com a ação `carregar` no reducer
- Entrar numa conta de testes da DummyJSON pelo `pedir` e guardar o token no SecureStore
- Criar o `AuthContext`, que restaura a sessão e decide entre Entrar e as abas
:::

---

## :icon[book-open] Palavras novas de hoje

| Palavra | O que é |
|---|---|
| **persistir** | guardar um dado para ele durar depois que o app fecha |
| **AsyncStorage** | a gaveta do celular: guarda texto com um nome, mesmo com o app fechado |
| **chave** | o nome com que um dado é guardado e encontrado de novo, como `lanchonete.carrinho` |
| **SecureStore** | o cofre do sistema: guarda texto **criptografado**, embaralhado para quem não tem a chave |
| **token** | um texto que o servidor entrega no login e que prova quem você é, por um tempo |
| **sessão** | o tempo em que você continua logado, sem digitar a senha de novo |

---

## Fechei o app e o pedido sumiu

Na fila do almoço, o cliente monta o pedido no app da lanchonete: dois X-Burger e um pudim. Troca para o WhatsApp para perguntar ao colega se ele quer algo. Volta: o sistema fechou o app para liberar memória, e o carrinho está vazio.

O carrinho do E42 mora num `useReducer`: na memória, só enquanto o app está aberto. E o app ainda não sabe quem é o cliente: o nome para chamar no balcão é digitado a cada pedido.

:::question
O que o app deveria guardar no aparelho? E o que **nunca** deveria guardar?
:::

---

## Onde mora cada dado

Onde você guarda o que não pode perder: na mão, na gaveta ou no cofre?

---

## :icon[hard-drive] Onde mora cada dado

Para durar além do app aberto, o dado precisa ser **persistido**: gravado no aparelho ou num servidor. Pense nas suas coisas: o que está na mão cai quando você solta; a gaveta guarda até alguém esvaziar; o cofre guarda o que é valioso; e o que a loja precisa ver fica na loja.

Três perguntas, nesta ordem:

:::steps
1. A loja ou outro aparelho precisam ver? **Servidor**.
2. Quem copiar consegue agir em nome do cliente? **SecureStore**, o cofre.
3. É lista, rascunho ou preferência do cliente? **AsyncStorage**, a gaveta.
:::

Se nenhuma resposta for sim, o dado fica só na memória, no estado da tela.

---

## :icon[hard-drive] Cada dado no seu lugar

| Dado | Onde | Dura até |
|---|---|---|
| texto da observação | estado (`useState`) | o app fechar |
| carrinho, tema escolhido | AsyncStorage | desinstalar ou limpar os dados |
| token de acesso | SecureStore | apagar a chave ou desinstalar |
| pedidos feitos | servidor (json-server) | a loja apagar |
| senha | em lugar nenhum | |

- O pedido feito vai ao servidor porque a cozinha também precisa vê-lo
- O token vai ao cofre: com ele, alguém entra na conta sem saber a senha
- A senha não fica em lugar nenhum: ela vai uma vez, no login, e some

---

## AsyncStorage

Você fecha o WhatsApp e as conversas continuam lá. Onde elas ficam?

---

## :icon[hard-drive] AsyncStorage: chave e texto

**AsyncStorage** é a gaveta do celular: guarda texto e continua lá depois que o app fecha. Cada dado tem uma **chave**, a etiqueta da gaveta, e você o encontra de novo por ela. É assíncrono, com `await`, e **sem criptografia**.

Uma pessoa da equipe instala os dois pacotes da aula, num PR só:

```bash
npx expo install @react-native-async-storage/async-storage expo-secure-store
```

- Só guarda texto: array e objeto passam por `JSON.stringify` na ida e `JSON.parse` na volta, como no E06
- O nome do app na frente da chave, como em `lanchonete.carrinho`, evita colisão com as chaves de bibliotecas

---

## :icon[hard-drive] AsyncStorage na prática

Gravar, ler, ler o que não existe e apagar:

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

await AsyncStorage.setItem('lanchonete.tema', 'escuro');
const tema = await AsyncStorage.getItem('lanchonete.tema'); // 'escuro'
const nada = await AsyncStorage.getItem('lanchonete.xyz'); // null
await AsyncStorage.removeItem('lanchonete.tema');
```

| Linha | O que ela diz |
|---|---|
| `setItem(chave, texto)` | "guarde este texto na gaveta com esta etiqueta" |
| `getItem(chave)` | "me dê o texto desta etiqueta", ou `null` se não houver |
| `removeItem(chave)` | "esvazie esta gaveta" |

Lembrete do E12: `JSON.stringify(new Set([3, 7]))` dá `'{}'`. Salve `[...favoritos]` e leia com `new Set(lista)`.

---

## :icon[save] src/servicos/armazenamento.js

Telas e contextos nunca importam o AsyncStorage: toda a conversa com ele passa por este arquivo.

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function salvar(chave, valor) {
  try {
    await AsyncStorage.setItem(chave, JSON.stringify(valor));
  } catch (erro) {
    console.warn(`Não foi possível salvar ${chave}`, erro);
  }
}
```

```javascript
export async function ler(chave, padrao = null) {
  try {
    const texto = await AsyncStorage.getItem(chave);
    return texto === null ? padrao : JSON.parse(texto);
  } catch (erro) {
    console.warn(`Não foi possível ler ${chave}`, erro);
    return padrao;
  }
}
```

- `salvar` transforma o valor em texto e guarda; se gravar falhar, o carrinho continua na tela, e o aviso no terminal é suficiente
- `ler` traz o texto e o transforma de volta. O ternário do E13 diz: sem nada salvo, devolva o **padrão**
- O padrão também volta quando o texto está quebrado: `[]` para listas, `{}` para objetos

---

## Carregar e salvar

Você volta ao app depois de uma ligação: o carrinho deveria estar como você deixou?

---

## :icon[refresh-cw] Carregar ao abrir: a ação carregar

O app guarda o carrinho em dois momentos: **ao abrir**, ele lê o que estava salvo; **ao mudar**, ele grava de novo. Quem faz os dois é o `useEffect`: "depois de desenhar a tela, faça isto".

O `carrinhoReducer` do E42 ganha uma ação, que troca a lista pelo que estava salvo:

```javascript
case 'carregar':
  return acao.itens; // o que estava salvo no aparelho
```

No `CarrinhoProvider`, com `const CHAVE = 'lanchonete.carrinho';` no topo do arquivo:

```jsx
const [itens, dispatch] = useReducer(carrinhoReducer, []);
const [carregado, setCarregado] = useState(false);

useEffect(() => {
  async function carregar() {
    dispatch({ type: 'carregar', itens: await ler(CHAVE, []) });
    setCarregado(true);
  }
  carregar();
}, []);
```

O efeito com `[]` roda uma vez, quando o app abre. Ele não aceita uma função `async` direto: declare uma dentro dele e chame-a.

---

## :icon[save] Salvar ao mudar, com a trava

Um segundo efeito grava o carrinho sempre que `itens` muda:

```jsx
useEffect(() => {
  if (carregado) salvar(CHAVE, itens);
}, [itens, carregado]);
```

Os efeitos rodam já no primeiro desenho. Sem a trava `carregado`, este gravaria o `[]` inicial por cima do carrinho salvo, antes de a leitura terminar. É como guardar uma gaveta vazia por cima da cheia, sem olhar o que tinha dentro.

| Momento | `itens` | `carregado` | Grava? |
|---|---|---|---|
| Primeiro desenho | `[]` | `false` | não |
| Leitura terminou | os salvos | `true` | sim, o mesmo conteúdo |
| Cliente soma um pudim | lista nova | `true` | sim |

As telas, o `adicionar` e o `remover` não mudam: quem grava é o efeito.

---

## :icon[refresh-cw] Carregar e salvar na prática

Cada briefing guarda um dado com a mesma receita: chave, padrão, carregar ao abrir e salvar ao mudar com a trava.

| Briefing | Chave | Padrão do `ler` | Depois do `r` |
|---|---|---|---|
| Cardápio | `lanchonete.carrinho` | `[]` | o carrinho volta com os mesmos itens |
| Agenda | `agenda.telefone` | `''` | o telefone volta preenchido no Perfil |
| Gastos | `gastos.mes` | o mês de hoje | o app abre no mês que estava aberto |

Para testar, aperte `r` no terminal do Expo: a memória se apaga, o aparelho fica. No primeiro desenho o carrinho está vazio; um instante depois, os itens salvos voltam e o badge da aba se atualiza.

---

## Pense

:::question
O carrinho salvo tem 2 itens: o X-Burger com `qtd: 2` e o pudim com `qtd: 1`. O que cada constante recebe, e o que `.length` mostra em cada uma?

```javascript
const a = ler('lanchonete.carrinho', []);
const b = await AsyncStorage.getItem('lanchonete.carrinho');
const c = await ler('lanchonete.carrinho', []);
```
:::

:::tip Resposta
- `a` é uma **Promise**: faltou o `await`, e `a.length` é `undefined`
- `b` é o **texto** JSON: `b.length` conta caracteres, perto de 300 com os campos do `db.json`
- `c` é o array: `c.length` é `2`

Só `c` está certo. Sem `await`, você tem a promessa do valor; sem `JSON.parse`, o texto do valor.
:::

---

## SecureStore

O que você guarda num cofre, e não numa gaveta?

---

## :icon[lock] SecureStore: o cofre do sistema

**SecureStore** guarda texto **criptografado** pelo sistema: embaralhado, e só o app consegue ler. É o cofre do celular, no Keychain do iPhone e com o Keystore do Android. É o lugar do token.

- Também só texto e assíncrono, com `Async` no fim dos nomes das funções
- A chave aceita só letras, números, ponto, hífen e `_`
- Feito para valores curtos; listas ficam no AsyncStorage
- Não funciona no app aberto no navegador: teste no celular

:::danger Nunca guarde
A **senha**, nem no SecureStore: guarde o token, que vence e pode ser apagado. Nem chave secreta de API: o que vai dentro do app, quem o instala consegue ler.
:::

---

## :icon[lock] SecureStore na prática

O app da equipe fala com o cofre por um arquivo só:

```javascript
// src/servicos/sessao.js
import * as SecureStore from 'expo-secure-store';

const CHAVE_TOKEN = 'lanchonete.token'; // só letras, números, ponto, hífen e _

export const guardarToken = (token) => SecureStore.setItemAsync(CHAVE_TOKEN, token);
export const lerToken = () => SecureStore.getItemAsync(CHAVE_TOKEN); // null se não houver
export const apagarToken = () => SecureStore.deleteItemAsync(CHAVE_TOKEN);
```

| Chamada | O que acontece |
|---|---|
| `guardarToken('eyJhbGci...')` depois do login | o token vai para o cofre |
| `lerToken()` antes de qualquer login | devolve `null` |
| `apagarToken()` no Sair | o cofre fica vazio |
| chave `'lanchonete:token'`, com dois-pontos | erro: chave inválida |

---

## Login com token

No show, você mostra o documento toda vez que volta do banheiro?

---

## :icon[key] Login com token

O **login com token** é como a pulseira de um show: o documento na entrada, depois só a pulseira, que vale por uma noite. O json-server da equipe não tem contas. O login usa a DummyJSON, API de testes com usuários fictícios: `emilys`, senha `emilyspass`.

::::columns
:::col
![Animação: o app troca usuário e senha pelo token no POST /auth/login e o guarda no SecureStore; ao reabrir, envia o token salvo ao GET /auth/me e recebe o usuário](images/e43-login-token.svg)
:::
:::col
1. Usuário e senha vão uma vez: `POST /auth/login`
2. A API devolve um **token**: texto assinado, com prazo
3. O token vai para o SecureStore; a senha, para lugar nenhum
4. Ao abrir, `GET /auth/me` com o token devolve o usuário
:::
::::

---

## :icon[send] src/api/auth.js: entrar na DummyJSON

O `pedir` do E42 soma o `URL_BASE` a todo caminho. Para chegar a outro servidor, ele ganha uma linha no topo, e o `fetch` passa a usar `url`:

```javascript
const url = caminho.startsWith('http') ? caminho : URL_BASE + caminho;
```

```javascript
import { pedir } from './cliente.js';

const URL_CONTAS = 'https://dummyjson.com/auth'; // o json-server não tem login
const VALIDADE_EM_MINUTOS = 60 * 24 * 7; // sem este campo, a API usa 60

export async function autenticar(nomeDeUsuario, senha) {
  const dados = await pedir(URL_CONTAS + '/login', {
    method: 'POST',
    body: JSON.stringify({ username: nomeDeUsuario, password: senha, expiresInMins: VALIDADE_EM_MINUTOS }),
  });
  return dados.accessToken;
}
```

- A linha nova diz: "se o caminho já começa com `http`, é um endereço completo; use-o como está"
- `60 * 24 * 7` minutos são 7 dias: a pulseira vale uma semana
- Os nomes do corpo são os da API, em inglês: com `usuario` e `senha`, a DummyJSON responde 400
- Senha errada: 400 e `Invalid credentials`. O `pedir` lança o `ApiError` do E19, com `status` 400

---

## :icon[user-check] GET /auth/me: de quem é o token

```javascript
export async function buscarUsuario(token) {
  const dados = await pedir(URL_CONTAS + '/me', { headers: { Authorization: `Bearer ${token}` } });
  return traduzirUsuario(dados);
}

function traduzirUsuario(dados) {
  return {
    id: dados.id,
    nome: `${dados.firstName} ${dados.lastName}`,
    email: dados.email,
    foto: dados.image ?? null,
  };
}
```

O cabeçalho `Authorization: Bearer` (portador) mostra a pulseira: "quem porta este token".

| Situação | Status |
|---|---|
| Token válido | 200 e o usuário, com dezenas de campos fictícios |
| Sem o cabeçalho `Authorization` | 401 |
| Token vencido | 401 |
| Token adulterado | 500 |

`traduzirUsuario` não é exportada: só este arquivo conhece os nomes em inglês, como o `traduzirProduto` do E19. O app inteiro usa `{ id, nome, email, foto }`.

---

## AuthContext

Sem pulseira, o que o segurança faz na porta da área do show?

---

## :icon[lock] AuthContext (1): restaurar a sessão

O **`AuthContext`** é o quadro de avisos que diz a todas as telas quem entrou. Em `src/features/conta/AuthContext.js`, a receita do E42: `createContext(null)`, o `AuthProvider` e o `useAuth` com guarda. O `ApiError` vem de `../../api/cliente.js`.

```jsx
const [usuario, setUsuario] = useState(null);
const [carregando, setCarregando] = useState(true);
useEffect(() => {
  async function restaurarSessao() {
    try {
      const token = await lerToken();
      if (token) setUsuario(await buscarUsuario(token));
    } catch (erro) {
      if (erro instanceof ApiError) await apagarToken(); // vencido ou inválido
    } finally {
      setCarregando(false);
    }
  }
  restaurarSessao();
}, []);
```

| Token salvo? | `/auth/me` | Resultado |
|---|---|---|
| não | não é chamado | `usuario` nulo: Entrar |
| sim, válido | 200 | `usuario` preenchido: abas |
| sim, vencido | 401: `ApiError` | token apagado: Entrar |
| sim, mas sem rede | "Sem conexão" | token mantido para a próxima vez |

---

## :icon[lock] AuthContext (2): entrar e sair

```jsx
async function entrar(nomeDeUsuario, senha) {
  const token = await autenticar(nomeDeUsuario, senha);
  await guardarToken(token);
  setUsuario(await buscarUsuario(token));
}

async function sair() {
  await apagarToken();
  setUsuario(null);
}

const valor = { usuario, carregando, entrar, sair };
return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
```

- `entrar` não trata o erro: ele sobe para a tela, que sabe o que mostrar
- Entrar e reabrir passam pelo mesmo `buscarUsuario`: as telas recebem sempre o mesmo formato
- O `AuthProvider` entra no `app/_layout.js`, dentro do `TemaProvider` e por fora do `CarrinhoProvider`
- O nome da conta substitui o que era digitado: no pedido, `clienteNome: usuario.nome`

---

## :icon[route] Entrar e o Redirect das abas

No `app/(tabs)/_layout.js`, como o `logado` de faz de conta da Lojinha no E37, agora com a sessão de verdade. As abas são a área do show, e o layout é o segurança na porta:

```jsx
const { usuario, carregando } = useAuth(); // junto dos outros hooks
if (carregando) return <EstadoCarregando mensagem="Abrindo o app..." />;
if (!usuario) return <Redirect href="/entrar" />;
```

Na `TelaEntrar`, com o `Campo` e o `Botao` do kit, o envio segue o item Formulário do checklist: travar enquanto envia e avisar o resultado.

```jsx
async function enviar() {
  setErro(null);
  setEnviando(true);
  try {
    await entrar(nomeDeUsuario.trim(), senha);
    router.replace('/');
  } catch (e) {
    setErro(e instanceof ApiError && e.status === 400 ? 'Usuário ou senha incorretos.' : e.message);
  } finally {
    setEnviando(false);
  }
}
```

- `carregando` é o segurança conferindo a pulseira: sem o `if (carregando)`, o app abre em Entrar mesmo com a sessão salva
- `Redirect` leva quem está sem pulseira para Entrar; `replace`, como no E37, faz o voltar não levar de novo ao login

---

## Código limpo

Um colega abre o seu código amanhã: ele entende sem perguntar nada?

---

## :icon[sparkles] Código limpo: nomes e funções

**Código limpo** é código que outra pessoa lê como um texto bem escrito: nomes claros, frases curtas, cada assunto no seu parágrafo. São 10 regras para a revisão; as cinco primeiras:

1. Nomes dizem o que guardam: `nomeDeUsuario`, não `u`
2. Função com verbo e uma tarefa: `autenticar`
3. Funções curtas: `restaurarSessao` à parte
4. Retorno antecipado: `if (!usuario) return`
5. Nada de número mágico: `VALIDADE_EM_MINUTOS`

Um **número mágico** é um número solto no código, sem nome: quem lê `10080` não sabe que são 7 dias.

---

## :icon[sparkles] Código limpo: camadas e erros

6. Não se repita: `JSON.stringify` só em `armazenamento.js`
7. Cada camada no seu lugar: a tela chama `entrar`, nunca `fetch`
8. Trate o erro onde dá para agir; nunca `catch` vazio
9. Comente o porquê: `// o json-server não tem login`
10. A máquina formata e revisa: Prettier e ESLint, do E03

Na revisão cruzada, cite o número da regra junto com o item do checklist: "Regra 5: o `45` do cálculo da previsão podia ser `PREVISAO_MAXIMA`".

---

## :icon[triangle-alert] Erros comuns

:::warning
- Gravar array ou objeto sem `JSON.stringify`, ou ler sem `await`
- Salvar sem a trava `carregado`: o `[]` inicial apaga o carrinho salvo
- A mesma chave escrita de dois jeitos: `'carrinho'` num arquivo e `'lanchonete.carrinho'` no outro
- Token no AsyncStorage, ou a senha em qualquer lugar
- Corpo do login com `usuario` e `senha`: a DummyJSON responde 400
- Abas sem o `if (carregando)`: o app abre em Entrar mesmo logado
- Mostrar `Invalid credentials` na tela: mensagem em inglês, feita para quem programa
:::

---

## :icon[siren] Quando aparece um erro

| A mensagem tem | Quer dizer | O que fazer |
|---|---|---|
| `AsyncStorage is null` | o pacote foi instalado com `npm install`, em versão errada | `npx expo install` de novo e `npx expo start -c` |
| `Invalid credentials` (400) | usuário ou senha errados | mostrar "Usuário ou senha incorretos." |
| `Username and password required` (400) | o corpo não tem `username` e `password` | conferir os nomes em inglês no `body` |
| `precisa estar dentro do AuthProvider` | o `AuthProvider` não está no `app/_layout.js` | pôr o provedor por fora da `Pilha` |
| erro de chave inválida no SecureStore | chave com `:` ou espaço | só letras, números, `.`, `-` e `_` |

---

## Resumo

:::summary
- O estado vive na memória; o que precisa durar vai para o aparelho ou para o servidor
- `armazenamento.js` concentra `salvar` e `ler`: AsyncStorage, JSON e um padrão
- Carregue ao abrir com a ação `carregar` e salve ao mudar com a trava `carregado`
- O login troca usuário e senha por um token, que vai para o SecureStore; a senha não fica em lugar nenhum
- O `AuthContext` restaura a sessão, e as abas leem `carregando` antes de `usuario`
:::

No E44, o app da equipe vira um APK instalável com o EAS, e o README vira portfólio.

---

## :icon[kanban] Sprint 1, parte 2

**Meta**: o app lembra do cliente ao reabrir.

| Briefing | No AsyncStorage | A conta aparece |
|---|---|---|
| Cardápio | o carrinho | no nome do pedido |
| Agenda | o telefone do Perfil | no Perfil |
| Gastos | o mês aberto | na saudação do Mês |

:::steps
1. Uma pessoa instala os dois pacotes num PR curto
2. `armazenamento.js` e o dado da tabela, com a trava
3. `pedir`, `auth.js`, `sessao.js`, `AuthContext` e Entrar
4. PR aberto, sem merge, para a revisão cruzada
5. README da sprint no commit `docs: E43 fechamento da sprint 1`
:::

**Critérios**: o dado volta depois do `r`; `emilys` continua logada ao reabrir; `npm test` verde; link do repositório no sistema.
