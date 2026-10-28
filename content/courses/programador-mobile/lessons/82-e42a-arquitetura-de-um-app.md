---
title: Arquitetura de um app
summary: Organize o app por funcionalidade, sirva a API da equipe com json-server e busque produtos em páginas com useProdutos.
module: integracao
duration_minutes: 50
objectives:
  - Organizar o app por funcionalidade, com as chamadas descendo da tela ao servidor
  - Servir a API da equipe com json-server e ler e gravar dados com GET, POST, PATCH e DELETE
  - Ligar o app à API pelo IP do computador, com EXPO_PUBLIC_API_URL e o pedir do E19
  - Buscar produtos em páginas sob demanda, com puxar para atualizar, no hook useProdutos
---

# Arquitetura de um app

Programador Mobile · Encontro E42 · Aula 82 de 89

---

## O que você vai aprender

:::goal
- Organizar o app da equipe por funcionalidade, em `src/features/`
- Criar a API da equipe com `json-server` e usar GET, POST, PATCH e DELETE
- Ligar o celular à API pelo IP, com `EXPO_PUBLIC_API_URL` e o `pedir` do E19
- Buscar os produtos da Lojinha em páginas, com o hook `useProdutos`
- Carregar mais no fim da lista e puxar para atualizar de verdade
:::

---

## Três pessoas, um app, um prazo

A equipe do briefing **Cardápio e pedidos** dividiu o trabalho: Ana faz o cardápio, Bruno o carrinho e Carla o acompanhamento do pedido. Se o app seguir as pastas da Lojinha, os três mexem em `src/telas/` e `src/contexts/` ao mesmo tempo, e todo Pull Request vira conflito.

E os dados? O cardápio da lanchonete não existe na DummyJSON: a equipe precisa de um servidor que ela mesma controla. Já a Lojinha, que no E39 fingia a rede com `simularRede`, vai finalmente buscar os produtos na DummyJSON.

:::question
Se o cardápio está guardado no computador do Bruno, como o celular da Ana consegue lê-lo?
:::

---

## :icon[folder-tree] Por funcionalidade: a árvore da lanchonete

A Lojinha separa os arquivos **por tipo**: todas as telas em `telas/`, todos os contextos em `contexts/`. Serve a um app pequeno, feito por uma pessoa. O app da equipe separa **por funcionalidade**: tudo do carrinho numa pasta só.

```plaintext
app/                    só rotas finas e layouts
src/
├── features/
│   ├── cardapio/       TelaCardapio, TelaProduto, useCardapio
│   ├── carrinho/       TelaCarrinho, CarrinhoContext, carrinhoReducer
│   └── pedidos/        TelaPedidos, TelaPedido, usePedidos, status.js
├── api/                cliente.js (E19), cardapio.js, pedidos.js
├── regras/, modelos/   do lojinha-regras: carrinho.js, precos.js, erros.js
├── components/ui/      o kit da Lojinha: Botao, Cartao, EstadoErro
├── theme/              tokens.js, TemaContext.js
└── utils/              formatar.js
db.json                 os dados do json-server
```

- Cada pasta de `features/` guarda telas, estado e regras de **uma** funcionalidade: cada pessoa trabalha na sua
- O que todas usam fica fora: o kit, o tema e o que veio pronto do `lojinha-regras`
- As telas levam o prefixo `Tela`, para não se misturar aos componentes da pasta

---

## :icon[layers] Camadas: quem chama quem

:::center
![Animação: a TelaCardapio chama o useCardapio, que chama listarProdutos na api/, que faz GET /produtos no json-server; as setas só descem, e a resposta sobe até a tela](images/e42-camadas.svg)
:::

As chamadas só **descem**: a tela chama o hook, o hook chama a `api/`, a `api/` chama o servidor. Nunca o contrário: a tela não chama `fetch`, o hook ou contexto não desenha e a `api/` não conhece telas. Fora dessa fila, `app/` só diz os endereços, sem lógica.

Uma funcionalidade usa outra só pela porta da frente: a `TelaProduto` chama `useCarrinho()` para adicionar o lanche, mas não importa o `carrinhoReducer` da pasta vizinha.

---

## Pratique

:::example Onde mora cada um?
Diga a pasta e o arquivo de cada peça do app da lanchonete:

1. `textoDoStatus('preparando')`, que devolve "Em preparo"
2. A função que faz `PATCH /pedidos/:id`
3. A tela "Acompanhar pedido"
4. `subtotal(itens)`, que soma o carrinho em centavos
5. O `Botao` com variantes
6. Um arquivo com uma linha só: `export { default } from ...`
:::

:::tip Resposta
1. `src/features/pedidos/status.js`: regra pura do briefing, com teste ao lado
2. `src/api/pedidos.js`: só a `api/` fala com o servidor
3. `src/features/pedidos/TelaPedido.js`
4. `src/regras/carrinho.js`: a do E07, copiada do `lojinha-regras`
5. `src/components/ui/Botao.js`: todas as funcionalidades usam
6. `app/pedido/[id].js`, a rota fina
:::

---

## :icon[server] json-server: a API da equipe

O **json-server** transforma um arquivo JSON numa API de verdade, rodando no computador da equipe. Cada chave do arquivo vira uma rota, e cada escrita grava no próprio arquivo.

```json
{
  "categorias": [{ "id": "lanches", "nome": "Lanches", "ordem": 1 }],
  "produtos": [
    { "id": "1", "nome": "X-Burger", "preco": 22.9, "categoriaId": "lanches", "disponivel": true }
  ],
  "pedidos": []
}
```

```bash
# na raiz do repositório, num segundo terminal
npx json-server db.json --port 3000
```

- Uma coleção por "coisa" do briefing, no plural: `produtos` vira a rota `/produtos`
- Todo `id` é texto, entre aspas; `categoriaId` liga o produto à categoria
- Na primeira vez, o `npx` pergunta se pode instalar: responda `y`. Fechou o terminal, a API sai do ar
- Serve para desenvolver e apresentar: não tem login nem validação

---

## :icon[table] CRUD: quatro métodos, seis rotas

**CRUD**: criar, ler, alterar e apagar:

| Ação | Método e rota | Resposta |
|---|---|---|
| listar | `GET /produtos` | 200 e a lista |
| filtrar | `GET /produtos?categoriaId=lanches` | 200 e os lanches |
| abrir um | `GET /produtos/1` | 200, ou 404 |
| criar | `POST /pedidos` e o corpo | 201 e o `id` novo |
| alterar | `PATCH /pedidos/xR31m` e o campo novo | 200 |
| apagar | `DELETE /pedidos/xR31m` | 200 |

- **PATCH** muda só os campos enviados; **PUT** troca o objeto inteiro e apaga o resto
- `?_sort=-criadoEm` põe o mais novo primeiro
- Cancelar é PATCH com o status `cancelado`: o pedido fica no histórico

---

## :icon[wifi] Do celular ao computador: o IP

No celular, `localhost` é o **próprio celular**. O json-server roda no computador: o app precisa do **IP do computador** na rede Wi-Fi.

:::center
![Diagrama: localhost:3000 volta ao próprio celular; 192.168.0.15:3000 chega ao json-server do computador pelo Wi-Fi](images/e42-localhost-ip.svg)
:::

:::steps
1. Descubra o IP: no Windows, `ipconfig` (linha "Endereço IPv4"); no macOS, `ipconfig getifaddr en0`. Ou leia o terminal do Expo: `exp://192.168.0.15:8081` já mostra o IP
2. No navegador **do celular**, abra `http://192.168.0.15:3000/produtos`: o JSON precisa aparecer
3. Não apareceu? Confira o mesmo Wi-Fi, o servidor ligado e o firewall, que deve deixar o Node receber conexões na rede privada
:::

O IP muda quando o computador troca de rede ou reinicia o roteador: confira no começo de cada encontro.

---

## :icon[settings] EXPO_PUBLIC_API_URL: o endereço fora do código

No E04, você usou `process.env` no Node, com `--env-file`. No app, quem lê o `.env` é o Expo, ao montar o código, e só chegam ao celular as variáveis que começam com **`EXPO_PUBLIC_`**.

```bash
# .env: cada pessoa, com o IP do próprio computador
EXPO_PUBLIC_API_URL=http://192.168.0.15:3000
```

```bash
# .env.example: no Git, o modelo para a equipe
EXPO_PUBLIC_API_URL=http://IP-DO-SEU-COMPUTADOR:3000
```

- O modelo do Expo não ignora o `.env`: acrescente a linha `.env` ao `.gitignore`
- Escreva `http://`, o IP e a porta, sem barra no fim: os caminhos começam com `/`
- Leia com ponto, `process.env.EXPO_PUBLIC_API_URL`: só assim o Expo troca pelo valor
- Mudou o `.env`? Recarregue o app com `r` no terminal do Expo; na dúvida, `npx expo start -c`
- Nada de segredo aqui: o que tem `EXPO_PUBLIC_` vai para dentro do app instalado

---

## :icon[plug] src/api/: o pedir do E19 com outro endereço

O `src/api/` do `lojinha-regras` já está na Lojinha desde o E30. No app da equipe, copie-o com o `src/modelos/erros.js` de que ele depende. Só uma linha muda:

```javascript
// src/api/cliente.js
export const URL_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'https://dummyjson.com';
```

```javascript
// src/api/pedidos.js: um arquivo por coleção
import { pedir } from './cliente';

export const listarPedidos = () => pedir('/pedidos?_sort=-criadoEm');
export const criarPedido = (pedido) =>
  pedir('/pedidos', { method: 'POST', body: JSON.stringify(pedido) });
export const mudarStatus = (id, status) =>
  pedir('/pedidos/' + id, { method: 'PATCH', body: JSON.stringify({ status }) });
```

- Sem `.env`, o `??` do E13 cai na DummyJSON: a Lojinha segue igual. Com `.env`, o app da equipe fala com o json-server
- O resto do `pedir` é o do E19: JSON pronto, "Sem conexão" sem rede e `ApiError` com 404 ou 500
- O POST devolve o pedido com um `id` em texto, como `"xR31mCj8zuk"`: o app não inventa nem converte com `Number()`

---

## :icon[arrow-down] A Lojinha em páginas: limit, skip e total

A DummyJSON tem 194 produtos. Baixar todos ao abrir gasta o plano de dados de quem está no 4G e deixa o esqueleto mais tempo na tela. O app pede 20 e, perto do fim da rolagem, mais 20: o `onEndReached` que você preparou no E34, agora com o servidor.

:::center
![Animação: a cada pedido de 20, o skip é a quantidade que já está na tela (0, 20, 40 até 180); a última página traz só 14 e, com 194 na tela, igual ao total, não há próxima página](images/e42-paginacao-skip.svg)
:::

- `skip` é quantos você **já tem**: `produtos.length`
- `total` diz quando parar: com 194 na tela, não há próxima página

---

## :icon[cable] listarProdutos devolve a página e o total

No E19, `listarProdutos` devolvia só a lista. Para o app saber quando parar, ela passa a devolver também o `total` que a DummyJSON informa:

```javascript
// src/api/produtos.js
export async function listarProdutos({ limite = 20, pular = 0, sinal } = {}) {
  const dados = await pedir(`/products?limit=${limite}&skip=${pular}`, { signal: sinal });
  return {
    produtos: dados.products.map(traduzirProduto),
    total: dados.total,
  };
}
```

- A tradução continua aqui: a tela nunca vê `products` nem `title`
- O contrato mudou: quem esperava um array lê agora `.produtos`. No app, quem chama é o `useProdutos`
- No Início, saem o `carregar` e a `simularRede` do E39, e os produtos deixam de vir de `src/data/produtos.js`

---

## :icon[variable] useProdutos (1): o que entra e o que sai

Em `src/hooks/useProdutos.js`, com os imports de `react`, de `../api/produtos` e do `ErroDeNegocio`. É o molde do `useTarefas` do E24, agora com páginas:

```javascript
const LIMITE = 20;

export function useProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [total, setTotal] = useState(0);
  const [carregando, setCarregando] = useState(true); // esqueleto
  const [atualizando, setAtualizando] = useState(false); // rodinha do topo
  const [carregandoMais, setCarregandoMais] = useState(false); // rodinha do rodapé
  const [erro, setErro] = useState(null);
  const buscando = useRef(false); // trava: um pedido por vez
  // buscarPagina, recarregar, o efeito, atualizar e carregarMais
  const temMais = produtos.length < total;
  return { produtos, carregando, atualizando, carregandoMais, erro, temMais,
    recarregar, atualizar, carregarMais };
}
```

- Sai tudo o que o Início precisa para desenhar e agir; a tela não sabe de `fetch` nem de `skip`
- Três estados de espera, porque cada um liga uma rodinha num lugar diferente
- `buscando` é um `useRef`, a caixa `{ current }` do E35: muda na hora, sem redesenhar

---

## :icon[cloud-download] useProdutos (2): buscar uma página

```javascript
  async function buscarPagina(pular, setEsperando) {
    buscando.current = true;
    setEsperando(true); // liga a rodinha certa
    try {
      const pagina = await listarProdutos({ limite: LIMITE, pular });
      setProdutos((atuais) => (pular === 0 ? pagina.produtos : [...atuais, ...pagina.produtos]));
      setTotal(pagina.total); setErro(null);
    } catch (e) {
      if (!(e instanceof ErroDeNegocio)) throw e; // bug: não esconda (E39)
      setErro(e.message);
    } finally {
      buscando.current = false;
      setEsperando(false); // a rodinha para, mesmo quando a rede falha
    }
  }
```

- `pular === 0` é recomeçar: a primeira página **substitui** a lista. As outras entram **no fim**, com o spread do E09
- `setProdutos` recebe uma **função**: o React a chama com a lista mais recente, `atuais`, e guarda o que ela devolve. Use essa forma quando o valor novo depende do anterior e há um `await` no meio
- `setEsperando` é o `set` de uma das três esperas, passado como valor, como os callbacks do E10. O `finally` do E17 solta a trava e para a rodinha, com sucesso ou com falha

---

## :icon[chevrons-right] useProdutos (3): abrir, puxar e carregar mais

```javascript
  function recarregar() { // ao abrir e no "Tentar novamente": esqueleto
    buscarPagina(0, setCarregando);
  }
  useEffect(() => { recarregar(); }, []);

  function atualizar() { // puxar para atualizar: rodinha do topo
    if (buscando.current) return;
    buscarPagina(0, setAtualizando);
  }

  function carregarMais() { // perto do fim: rodinha do rodapé
    if (buscando.current || carregando || produtos.length >= total) return;
    buscarPagina(produtos.length, setCarregandoMais);
  }
```

- As três ações usam a mesma `buscarPagina`; cada uma diz de onde pedir e qual rodinha ligar
- `atualizar` ignora o gesto se já há um pedido em andamento
- Três motivos para não carregar mais: já há um pedido, a primeira página não chegou ou a lista já tem o `total`
- O `skip` da próxima página é `produtos.length`: nada de contar páginas

---

## Pense

:::question
Ao chegar no fim da grade, o `onEndReached` disparou duas vezes seguidas, antes de a primeira resposta chegar. Sem o `buscando.current` no `if` do `carregarMais`, o que aparece na tela? E por que a trava é um `useRef`, e não um `useState`?
:::

:::tip Resposta
Os dois pedidos saem com `skip=20`, porque `produtos.length` ainda vale 20 nas duas chamadas. Os produtos 21 a 40 entram **duas vezes**, e o terminal avisa `Encountered two children with the same key`.

O `useRef` muda na hora: a segunda chamada já lê `true` e para. Um `setBuscando(true)` só vale na próxima renderização, e a segunda chamada ainda veria `false`.
:::

---

## :icon[layout-grid] O Início só desenha

```jsx
const { produtos, carregando, atualizando, carregandoMais, erro, temMais,
  recarregar, atualizar, carregarMais } = useProdutos();

if (carregando) return <GradeEsqueleto colunas={colunas} />;
if (erro && produtos.length === 0) {
  return <EstadoErro mensagem={erro} onTentarNovamente={recarregar} />;
}
return (
  <FlatList /* data, numColumns, extraData={favoritos} e renderItem como no E39 */
    onEndReached={carregarMais}
    onEndReachedThreshold={0.5}
    ListFooterComponent={desenharRodape()}
    refreshControl={<RefreshControl refreshing={atualizando} onRefresh={atualizar} />}
  />
);
```

```jsx
function desenharRodape() { // dentro do Inicio, antes dos returns
  if (carregandoMais) return <ActivityIndicator color={cores.primaria} />;
  if (erro) return <Botao titulo="Tentar de novo" variante="secundaria" onPress={carregarMais} />;
  if (!temMais) return <Text style={{ color: cores.textoSuave }}>Você viu todos os produtos</Text>;
  return null;
}
```

- Erro sem produtos toma a tela; erro com produtos vai para o rodapé, e ninguém perde o que já viu
- O puxar do E34 agora busca de verdade: `atualizar` gira só a rodinha do topo, com a grade visível
- O `entradas` do E39 tinha 12 valores fixos: com páginas, cada `EntradaAnimada` cria o seu valor e recebe um atraso, `(index % 20) * 80`

---

## :icon[triangle-alert] Erros comuns

:::warning
- `localhost` no `.env`: no celular, ele aponta para o próprio celular
- `.env` no Git ou `fetch` fora de `src/api/`: o IP de um vira problema de todos
- PUT para mudar só o status: o pedido perde os itens e o total
- `Number(id)` com os ids do json-server: `Number('xR31m')` dá `NaN`
- `skip` pela página, como `pagina * 20` com a página começando em 1: os 20 primeiros nunca aparecem
- Pedir sem trava, ou com a trava num `useState`: a mesma página entra repetida
- Ligar `carregando` no puxar para atualizar: a grade some e o esqueleto pisca
:::

---

## Resumo

:::summary
- O app da equipe se organiza por funcionalidade, e as chamadas descem: tela, hook ou contexto, `api/`, servidor
- `npx json-server db.json --port 3000` serve as coleções do briefing, com GET, POST, PATCH e DELETE
- O celular chega ao computador pelo IP, em `EXPO_PUBLIC_API_URL`; sem `.env`, o `??` mantém a Lojinha na DummyJSON
- `useProdutos` pede páginas de 20 a partir de `produtos.length`, para no `total` e trava com `useRef`
- `atualizar` liga só `atualizando`: a grade fica na tela enquanto a rodinha gira
:::

Na aula 83, o estado que várias telas dividem: o Context linha a linha e o `useReducer` com as regras do carrinho.
