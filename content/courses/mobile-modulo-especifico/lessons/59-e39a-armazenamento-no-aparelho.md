---
title: "Dados no aparelho: AsyncStorage e SecureStore"
summary: Guarde carrinho e favoritos com AsyncStorage e segredos com SecureStore, carregando ao abrir e salvando ao mudar.
module: linguagem-js
duration_minutes: 40
objectives:
  - Decidir o que guardar no aparelho e onde guardar cada dado
  - Salvar e ler dados com AsyncStorage usando JSON
  - Carregar o carrinho e os favoritos ao abrir e salvá-los ao mudar
  - Guardar segredos com SecureStore
---

# Dados no aparelho: AsyncStorage e SecureStore

Programador Mobile: Módulo Específico · Encontro E39 · Aula 59 de 71

---

## O que você vai aprender

:::goal
- Decidir o que fica na memória, no aparelho, no cofre do sistema ou no servidor
- Gravar e ler com AsyncStorage, convertendo com `JSON.stringify` e `JSON.parse`
- Escrever `src/servicos/armazenamento.js` com `salvar(chave, valor)` e `ler(chave, padrao)`
- Carregar o carrinho e os favoritos ao abrir e salvá-los ao mudar
- Guardar um token com SecureStore
:::

---

## Fechei o app e o carrinho sumiu

Você monta um carrinho com três produtos e troca para o WhatsApp para pedir a opinião de alguém. Meia hora depois, volta à Lojinha: o sistema fechou o app para liberar memória, e o carrinho está vazio. Os favoritos também sumiram.

Hoje o carrinho mora num `useState`: na memória, só enquanto o app está aberto. Nesta aula, ele passa a morar também no aparelho.

:::question
Se o app guardasse o carrinho no aparelho, o que mais deveria ficar guardado? E o que **nunca** deveria?
:::

---

## :icon[memory-stick] Memória ou aparelho

O estado do React vive na **memória** do app. Fechou o app, tirou dos recentes ou o sistema o encerrou: tudo some. Para durar, o dado precisa ser **persistido**, isto é, gravado no armazenamento do aparelho ou num servidor.

| Onde | Dura até | Exemplo na Lojinha |
|---|---|---|
| Estado (`useState`, contexto) | o app fechar | texto digitado na busca |
| AsyncStorage | o app ser desinstalado ou ter os dados limpos | carrinho, favoritos |
| SecureStore | você apagar a chave ou desinstalar o app | token de acesso |
| Servidor (API) | a conta existir, em qualquer aparelho | pedidos, dados da conta |

---

## :icon[list-checks] O que guardar e onde

Três perguntas, nesta ordem, decidem o lugar de cada dado:

:::steps
1. Precisa aparecer em outro aparelho ou para a loja? **Servidor**.
2. Se alguém copiar, consegue agir em nome do cliente? **SecureStore**.
3. É preferência, rascunho ou lista do cliente? **AsyncStorage**.
:::

| Dado | Onde | Por quê |
|---|---|---|
| Carrinho e favoritos | AsyncStorage | listas do cliente, sem segredo |
| Tema escolhido | AsyncStorage | preferência |
| Token de acesso | SecureStore | abre a conta sem a senha |
| Senha | em lugar nenhum | o token faz o papel dela |
| Pedidos feitos | servidor | a loja também precisa ver |

---

## :icon[hard-drive] AsyncStorage: chave e texto

**AsyncStorage** é um armazenamento de chave e valor: assíncrono, persistente e **sem criptografia**. Instale no projeto:

```bash
npx expo install @react-native-async-storage/async-storage
```

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

await AsyncStorage.setItem('lojinha.tema', 'escuro');   // grava
const tema = await AsyncStorage.getItem('lojinha.tema'); // 'escuro'
const nada = await AsyncStorage.getItem('lojinha.xyz');  // null
await AsyncStorage.removeItem('lojinha.tema');           // apaga
```

- Toda chamada devolve uma **Promise**: use `await` dentro de uma função `async`
- `getItem` devolve `null` quando a chave não existe
- Comece as chaves com o nome do app (`lojinha.`) para não colidir com as de bibliotecas

---

## :icon[braces] Só texto: JSON.stringify e JSON.parse

O AsyncStorage guarda **texto**. Para um array ou objeto, converta na ida e na volta:

```javascript
const itens = [{ id: 3, nome: 'Fone Bluetooth', preco: 199.9, qtd: 2 }];

await AsyncStorage.setItem('lojinha.carrinho', JSON.stringify(itens));
// grava o texto '[{"id":3,"nome":"Fone Bluetooth","preco":199.9,"qtd":2}]'

const texto = await AsyncStorage.getItem('lojinha.carrinho');
const deVolta = JSON.parse(texto); // array de novo, com o objeto dentro
```

Sem o `stringify`, a biblioteca avisa no terminal que o valor não é texto, e o resultado fica imprevisível. Já o `JSON.parse` lança `SyntaxError` quando o texto está quebrado: esse caso também precisa de tratamento.

---

## :icon[save] armazenamento.js (1): salvar

Toda a conversa com o AsyncStorage fica num só arquivo, `src/servicos/armazenamento.js`. Telas e contextos nunca importam o AsyncStorage direto.

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

- Aceita qualquer valor que vire JSON: array, objeto, número ou texto
- Uma falha ao gravar não derruba a tela: o carrinho continua na memória e o aviso aparece no terminal
- `salvar` devolve uma Promise; quem precisar esperar a gravação usa `await`

---

## :icon[file-search] armazenamento.js (2): ler com padrão

```javascript
export async function ler(chave, padrao) {
  try {
    const texto = await AsyncStorage.getItem(chave);
    return texto === null ? padrao : JSON.parse(texto);
  } catch (erro) {
    console.warn(`Não foi possível ler ${chave}`, erro);
    return padrao;
  }
}
```

| Situação | O que `ler('lojinha.carrinho', [])` devolve |
|---|---|
| Primeira vez no app, nada salvo | `[]`, o padrão |
| Carrinho salvo antes | o array salvo |
| Texto corrompido | `[]`: o `parse` falha e o `catch` devolve o padrão |

O **padrão** tem o formato do dado: `[]` para listas, `{}` para objetos. Assim, quem chama nunca recebe `null` de surpresa.

---

## Pense

:::question
O carrinho salvo tem 2 itens. O que cada constante recebe, e o que `.length` mostra em cada uma?

```javascript
const a = ler('lojinha.carrinho', []);
const b = await AsyncStorage.getItem('lojinha.carrinho');
const c = await ler('lojinha.carrinho', []);
```
:::

:::tip Resposta
- `a` é uma **Promise**: faltou o `await`, e `a.length` é `undefined`
- `b` é o **texto** JSON: `b.length` conta caracteres, algo perto de 120
- `c` é o array: `c.length` é `2`

Só `c` está certo. Sem `await`, você tem a promessa do valor; sem `JSON.parse`, o texto do valor.
:::

---

## :icon[refresh-cw] Carregar ao abrir

No `CarrinhoProvider`, um efeito com `[]` roda uma vez, quando o app abre, e põe no estado o que estava salvo:

```jsx
const CHAVE = 'lojinha.carrinho';

export function CarrinhoProvider({ children }) {
  const [itens, setItens] = useState([]);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    async function carregar() {
      setItens(await ler(CHAVE, []));
      setCarregado(true);
    }
    carregar();
  }, []);
```

O `useEffect` não aceita uma função `async` direto: declare uma dentro dele e chame-a em seguida. No primeiro desenho, o carrinho ainda está vazio; uma fração de segundo depois, os itens salvos aparecem e o badge da aba se atualiza.

---

## :icon[save] Salvar ao mudar

Um segundo efeito grava o carrinho sempre que `itens` muda:

```jsx
useEffect(() => {
  if (carregado) salvar(CHAVE, itens);
}, [itens, carregado]);
```

Por que a trava `carregado`? Os efeitos rodam já no primeiro desenho. Sem ela, este efeito gravaria o `[]` inicial por cima do carrinho salvo, antes de a leitura terminar.

| Momento | `itens` | `carregado` | Grava? |
|---|---|---|---|
| Primeiro desenho | `[]` | `false` | não |
| Leitura terminou | itens salvos | `true` | sim, o mesmo conteúdo |
| Cliente adiciona um fone | lista nova | `true` | sim |

`adicionar`, `remover` e `alterarQuantidade` não mudam: quem grava é o efeito.

---

## :icon[hard-drive] O carrinho sobrevive ao fechar

:::center
![Animação: o salvar grava o carrinho no AsyncStorage; o app fecha e o estado na memória fica vazio; ao abrir, o ler devolve os 3 produtos ao estado](images/e39-carrinho-persistido.svg)
:::

Cada mudança grava o carrinho com `salvar`. Quando o sistema fecha o app, a memória some, mas o AsyncStorage continua no aparelho; ao abrir, o `ler` devolve os itens ao estado.

---

## :icon[heart] Favoritos: o Set vira array

O `FavoritosContext` guarda um `Set` de ids. Só que o JSON não conhece `Set`:

```javascript
JSON.stringify(new Set([3, 7])); // '{}': os ids se perderam
```

Converta na ida e na volta, com a mesma trava do carrinho:

```jsx
useEffect(() => {
  async function carregar() {
    setFavoritos(new Set(await ler(CHAVE, [])));
    setCarregado(true);
  }
  carregar();
}, []);

useEffect(() => {
  if (carregado) salvar(CHAVE, [...favoritos]);
}, [favoritos, carregado]);
```

Grave o **mínimo**: para favoritos, bastam os ids. Nome, preço e foto vêm da API, sempre atualizados.

---

## :icon[lock] SecureStore: o cofre do sistema

**SecureStore** guarda texto **criptografado** pelo sistema: no Keychain do iOS e, no Android, com as chaves do Keystore. É o lugar do token de acesso.

```bash
npx expo install expo-secure-store
```

```javascript
import * as SecureStore from 'expo-secure-store';

await SecureStore.setItemAsync('lojinha.token', token);
const salvo = await SecureStore.getItemAsync('lojinha.token'); // null se não houver
await SecureStore.deleteItemAsync('lojinha.token');
```

- Também só texto e também assíncrono, com `Async` no fim dos nomes
- Chaves aceitam letras, números, `.`, `-` e `_`: `lojinha:token` dá erro
- Feito para valores curtos, como um token; listas ficam no AsyncStorage
- Não funciona na versão web do app

---

## :icon[shield] AsyncStorage ou SecureStore?

| | AsyncStorage | SecureStore |
|---|---|---|
| Criptografia | não: texto aberto num arquivo do app | sim, pelo sistema |
| Tamanho | listas e objetos pequenos | valores curtos |
| Funções | `setItem`, `getItem`, `removeItem` | `setItemAsync`, `getItemAsync`, `deleteItemAsync` |
| Na Lojinha | carrinho, favoritos, tema | token de acesso |

:::danger Nunca guarde
- A **senha** do cliente, nem no SecureStore: guarde o token, que vence e pode ser cancelado
- Chave secreta de API dentro do app: o `.env` com `EXPO_PUBLIC_` vai junto no app instalado
:::

No iOS, o SecureStore pode sobreviver à desinstalação do app. Não conte com isso, nem a favor nem contra.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Gravar array ou objeto sem `JSON.stringify`: o valor não volta como você gravou
- Esquecer o `await`: você recebe uma Promise no lugar do carrinho
- Salvar sem a trava `carregado`: o `[]` inicial apaga o carrinho salvo
- `JSON.stringify` num `Set`: grava `'{}'`; converta com `[...favoritos]`
- Usar `:` ou espaço numa chave do SecureStore: a chamada lança erro
- Guardar o token no AsyncStorage, ou a senha em qualquer lugar
:::

---

## Resumo

:::summary
- O estado vive na memória e some ao fechar o app; para durar, persista no aparelho ou no servidor
- AsyncStorage guarda texto por chave, sem criptografia: `JSON.stringify` na ida, `JSON.parse` na volta
- `src/servicos/armazenamento.js` concentra `salvar(chave, valor)` e `ler(chave, padrao)`
- Carregue ao abrir com um efeito `[]` e salve ao mudar com a trava `carregado`
- SecureStore guarda segredos curtos, como o token, criptografados; a senha, nunca
:::

---

## Próximos passos

Na próxima aula, o SecureStore ganha o que guardar: o **token** de um login de verdade na DummyJSON. Você cria o `AuthContext`, troca a constante `logado` do E17 pelo usuário que a API devolve e fecha com 10 regras de código limpo.

:::tip Antes da aula 60
Abra o `app/(tabs)/_layout.js` e localize a constante `logado` e o `Redirect`: são eles que mudam.
:::
