---
title: Login de verdade e código limpo
summary: Entre na DummyJSON, guarde o token no SecureStore, crie o AuthContext e aplique 10 regras de código limpo.
module: linguagem-js
duration_minutes: 40
objectives:
  - Autenticar na DummyJSON e guardar o token no SecureStore
  - Criar o AuthContext e ligar o Redirect ao usuário logado
  - Ler dados que podem faltar com ?., ?? e at()
  - Aplicar 10 regras de código limpo ao código do app
---

# Login de verdade e código limpo

Programador Mobile: Módulo Específico · Encontro E39 · Aula 60 de 71

---

## O que você vai aprender

:::goal
- Fazer login na DummyJSON e entender o que a API devolve, inclusive nos erros
- Guardar o token no SecureStore e restaurar a sessão ao abrir o app
- Criar o `AuthContext` com `usuario`, `entrar`, `sair` e `carregando` e ligá-lo ao `Redirect`
- Ler dados que podem faltar com `?.`, `??` e `at()`
- Revisar o próprio código com 10 regras de código limpo
:::

---

## Entrar uma vez, continuar logado

No app do banco, você digita a senha uma vez. No dia seguinte, ele abre direto na sua conta. O app **não guardou a sua senha**: guardou um passe temporário que o servidor reconhece.

A Lojinha ainda finge: `const logado = true` no layout das abas e "Ana Souza" fixa no Perfil. Hoje o login fala com uma API de verdade, o passe fica no cofre do aparelho e o Perfil mostra quem entrou.

:::question
Se o app não guarda a senha, como ele prova para a API, amanhã, que é você?
:::

---

## :icon[key] Login com token, passo a passo

:::steps
1. O app envia usuário e senha uma única vez: `POST /auth/login`
2. A API confere e devolve um **token**: um texto assinado, com prazo de validade
3. O app guarda o token no SecureStore e descarta a senha
4. Cada pedido protegido leva o cabeçalho `Authorization: Bearer` seguido do token
5. Ao abrir, o app chama `GET /auth/me` com o token salvo: se ele ainda vale, a pessoa entra direto
:::

Pense no token como a pulseira de um show: você mostra o documento uma vez, na entrada, e dali em diante a pulseira basta. Ela vale só por aquela noite.

---

## :icon[key] O token entre o app, o cofre e a API

:::center
![Animação: o app envia usuário e senha ao POST /auth/login, recebe o token e o guarda no SecureStore; ao abrir de novo, lê o token salvo, chama GET /auth/me e recebe o usuário sem pedir a senha](images/e39-login-token.svg)
:::

A senha viaja uma única vez, no `POST /auth/login`. Daí em diante, quem identifica a pessoa é o token: guardado no SecureStore, ele é lido ao abrir o app e enviado no `GET /auth/me`.

---

## :icon[send] POST /auth/login na DummyJSON

A DummyJSON é uma API **de testes**, em inglês, com usuários fictícios. Usuário `emilys`, senha `emilyspass`:

```javascript
const resposta = await fetch('https://dummyjson.com/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'emilys', password: 'emilyspass' }),
});
```

Resposta com status 200, encurtada:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": 1,
  "username": "emilys",
  "email": "emily.johnson@x.dummyjson.com",
  "firstName": "Emily",
  "lastName": "Johnson",
  "image": "https://dummyjson.com/icon/emilys/128"
}
```

Senha errada: status **400** e `{ "message": "Invalid credentials" }`. O `accessToken` vale 60 minutos; o campo `expiresInMins` no corpo muda esse prazo.

---

## :icon[user-check] GET /auth/me: de quem é o token

Com o token, a API diz quem está logado:

```javascript
const resposta = await fetch('https://dummyjson.com/auth/me', {
  headers: { Authorization: `Bearer ${token}` },
});
```

A resposta traz o usuário inteiro: dezenas de campos, de `phone` e `address` até a senha e dados bancários, todos fictícios. Leve para o app só o que as telas usam.

| Situação | Status | `message` |
|---|---|---|
| Token válido | 200 | (vem o usuário) |
| Sem o cabeçalho | 401 | `Access Token is required` |
| Token vencido | 401 | `Token Expired!` |
| Token adulterado | 500 | `invalid signature` |

Para o app, qualquer resposta que não seja `ok` quer dizer o mesmo: a sessão não vale mais.

---

## :icon[file-code] auth.js (1): autenticar

O `pedir` de `src/api/cliente.js` (E38) junta o endereço do `.env` ao caminho, manda o cabeçalho `Content-Type: application/json`, devolve o JSON e lança um `ApiError` com o `status` quando a resposta não é `ok`. O login só monta o pedido:

```javascript
import { pedir } from './cliente';

const VALIDADE_EM_MINUTOS = 60 * 24 * 7; // sem este campo, a API usa 60

export async function autenticar(nomeDeUsuario, senha) {
  const dados = await pedir('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: nomeDeUsuario, password: senha, expiresInMins: VALIDADE_EM_MINUTOS }),
  });
  return dados.accessToken;
}
```

- Os nomes do corpo são os da API, em inglês: com `usuario` e `senha`, a DummyJSON responde 400, `Username and password required`
- O nome da constante explica o número: 7 dias de sessão
- A função devolve só o token; os dados do usuário vêm do `/auth/me`

---

## :icon[circle-help] auth.js (2): `?.` e `??` na tradução

```javascript
export async function buscarUsuario(token) {
  const dados = await pedir('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
  return traduzirUsuario(dados);
}

function traduzirUsuario(dados) {
  return {
    id: dados.id,
    nome: `${dados.firstName} ${dados.lastName}`,
    email: dados.email,
    foto: dados.image ?? null,
    cidade: dados.address?.city ?? '',
  };
}
```

- `dados.address?.city`: se `address` não vier, o resultado é `undefined`, e não um erro que derruba o app
- `?? ''` troca **só** `null` e `undefined` pelo padrão; o `||` trocaria também `0` e `''`
- `traduzirUsuario` não é exportada: só este arquivo conhece os nomes em inglês, e o app inteiro usa `{ id, nome, email, foto, cidade }`

---

## Pense

:::question
O login deu certo. Para cada dado, decida se o app guarda e onde: o **token**, o **usuário** (nome, e-mail, foto) e a **senha** digitada.
:::

:::tip Resposta
- **Token**: no SecureStore. Ele abre a conta, então vai para o cofre
- **Usuário**: só no estado do `AuthContext`, na memória. Ao abrir o app, o `/auth/me` devolve os dados atualizados a partir do token
- **Senha**: em lugar nenhum. Ela vai no pedido de login e some com o formulário

Guardar o usuário no AsyncStorage funcionaria, mas o Perfil mostraria um nome velho se ele mudasse no servidor.
:::

---

## :icon[lock] AuthContext (1): restaurar a sessão

Em `src/contexts/AuthContext.js`, no topo: os imports, `const CHAVE_TOKEN = 'lojinha.token';` e `const AuthContext = createContext(null);`. Dentro do `AuthProvider({ children })`:

```jsx
const [usuario, setUsuario] = useState(null);
const [carregando, setCarregando] = useState(true);
useEffect(() => {
  async function restaurarSessao() {
    try {
      const token = await SecureStore.getItemAsync(CHAVE_TOKEN);
      if (token) setUsuario(await buscarUsuario(token));
    } catch {
      await SecureStore.deleteItemAsync(CHAVE_TOKEN); // vencido ou inválido
    } finally {
      setCarregando(false);
    }
  }
  restaurarSessao();
}, []);
```

| Token salvo? | `/auth/me` | Resultado |
|---|---|---|
| não | não é chamado | `usuario` nulo: tela Entrar |
| sim, válido | 200 | `usuario` preenchido: abas |
| sim, vencido | 401: o `pedir` lança `ApiError` | token apagado: tela Entrar |

O `catch` sem parênteses serve quando o erro em si não importa.

---

## :icon[lock] AuthContext (2): entrar e sair

```jsx
  async function entrar(nomeDeUsuario, senha) {
    const token = await autenticar(nomeDeUsuario, senha);
    await SecureStore.setItemAsync(CHAVE_TOKEN, token);
    setUsuario(await buscarUsuario(token));
  }

  async function sair() {
    await SecureStore.deleteItemAsync(CHAVE_TOKEN);
    setUsuario(null);
  }

  const valor = { usuario, entrar, sair, carregando };
  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
```

- `entrar` não trata o erro: se o login falhar, o erro sobe para a tela, que sabe o que mostrar
- Entrar e reabrir o app passam pelo mesmo `buscarUsuario`: o Perfil recebe sempre o mesmo formato
- `useAuth()` segue a receita do `useCarrinho`: lê o contexto e lança erro fora do provedor

---

## :icon[route] Redirect e Perfil leem a sessão

Em `app/_layout.js`, o `AuthProvider` entra logo dentro do `TemaProvider`, por fora dos outros provedores. No `app/(tabs)/_layout.js`, a constante `logado` do E17 dá lugar ao contexto:

```jsx
const { usuario, carregando } = useAuth(); // junto dos outros hooks

if (carregando) return <EstadoCarregando mensagem="Abrindo a Lojinha..." />;
if (!usuario) return <Redirect href="/entrar" />;
```

No Perfil, `USUARIO_EXEMPLO` e a simulação saem:

```jsx
const { usuario, sair } = useAuth();
const primeiroNome = usuario?.nome.split(' ').at(0) ?? 'cliente'; // 'Emily'
```

**`at(0)`** pega o primeiro item e `at(-1)`, o último: índices negativos contam do fim. O "Sair" do `Alert` só chama `sair()`: com `usuario` nulo, o `Redirect` das abas leva a Entrar sozinho.

---

## :icon[user] A tela Entrar com a API

O formulário usa o `Campo` do E15. A função de envio chama o contexto e cuida do erro:

```jsx
async function enviar() {
  setErro(null);
  setEnviando(true);
  try {
    await entrar(nomeDeUsuario.trim(), senha);
    router.replace('/');
  } catch (erro) {
    setErro(erro.status === 400 ? 'Usuário ou senha incorretos.' : erro.message);
  } finally {
    setEnviando(false);
  }
}
```

```jsx
<Botao titulo={enviando ? 'Entrando...' : 'Entrar'} onPress={enviar} desabilitado={enviando} />
```

- O botão desabilitado evita dois logins com toques repetidos
- `Invalid credentials` é para quem programa: com o `status` 400, a tela mostra a sua frase; nos outros casos, a do `pedir`, como "Sem conexão"
- `replace`, como no E17: o voltar não leva de novo ao login

---

## :icon[sparkles] Código limpo (1): nomes e funções

Código limpo é o que outra pessoa, ou você daqui a um mês, lê sem esforço. As cinco primeiras regras:

| # | Regra | Na Lojinha |
|---|---|---|
| 1 | Nomes dizem o que guardam | `nomeDeUsuario`, não `u` nem `dados2` |
| 2 | Função com verbo e uma tarefa só | `autenticar`, `traduzirUsuario` |
| 3 | Funções curtas | `restaurarSessao` separada do resto do provedor |
| 4 | Retorno antecipado | `if (!usuario) return <Redirect href="/entrar" />` |
| 5 | Nada de número ou texto mágico | `VALIDADE_EM_MINUTOS`, `CHAVE_TOKEN` |

---

## :icon[sparkles] Código limpo (2): camadas e erros

| # | Regra | Na Lojinha |
|---|---|---|
| 6 | Não se repita | `JSON.stringify` só em `armazenamento.js`, `fetch` só em `cliente.js` |
| 7 | Cada camada no seu lugar | a tela chama `entrar`, nunca `fetch` ou `SecureStore` |
| 8 | Trate o erro onde dá para agir | a tela mostra a mensagem; nunca `catch` vazio |
| 9 | Comente o porquê, não o quê | `// sem este campo, a API usa 60` |
| 10 | A máquina formata e revisa | Prettier ao salvar e `npx expo lint` sem avisos |

Precisou de um comentário para explicar **o que** um trecho faz? Troque o trecho por uma função com esse nome.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Fazer o login com um `fetch` solto, sem o `'Content-Type': 'application/json'` do `pedir`: a DummyJSON responde 400, `Username and password required`
- Colar o `Bearer` no token, sem espaço: a resposta é 500, `invalid token`
- Testar só `usuario` no layout das abas, sem `carregando`: o app abre em Entrar mesmo com a sessão salva
- `router.push('/')` depois de entrar: o voltar leva de novo ao login
- Mostrar `Invalid credentials` na tela: mensagem em inglês, feita para quem programa
- Guardar a senha para "entrar sozinho depois": guarde o token
:::

---

## Resumo

:::summary
- O login troca usuário e senha por um token; o app guarda o token no SecureStore e nunca a senha
- `src/api/auth.js` chama `POST /auth/login` e `GET /auth/me` pelo `pedir` e traduz o usuário para o formato do app
- O `AuthContext` restaura a sessão ao abrir e oferece `usuario`, `entrar`, `sair` e `carregando`
- O `Redirect` das abas lê o contexto: o estado decide qual tela aparece
- `?.`, `??` e `at()` leem com segurança dados que podem faltar, e 10 regras mantêm o código legível
:::

---

## :icon[flask-conical] No laboratório

Carrinho, favoritos e login sobrevivem a fechar o app.

:::steps
1. `npx expo install @react-native-async-storage/async-storage expo-secure-store`
2. `src/servicos/armazenamento.js` com `salvar` e `ler`
3. Carrinho e favoritos: carregar ao abrir e salvar ao mudar
4. `src/api/auth.js`, `AuthContext` e `AuthProvider` no `app/_layout.js`
5. Abas com `useAuth()` no lugar de `logado`; Entrar com formulário
6. Perfil com os dados da API e Sair pelo contexto
7. Feche e reabra o app; commit "E39: dados no aparelho e login" e `git push`
:::

**Critérios de entrega**: carrinho e favoritos voltam ao reabrir; `emilys` entra e a senha errada mostra a mensagem; reabrir mantém o login; Sair leva a Entrar sem volta. Entregue o link do repositório no sistema.
