---
title: Arquitetura de um app
summary: Organize o app da equipe por funcionalidade e crie a API do briefing com json-server, acessada pelo IP.
module: integracao
duration_minutes: 40
objectives:
  - Organizar o app por funcionalidade em src/features, com as camadas api e servicos
  - Montar o db.json do briefing e servir a API da equipe com json-server
  - Ler e gravar dados com GET, POST, PATCH e DELETE
  - Ligar o celular à API pelo IP do computador com EXPO_PUBLIC_API_URL
---

# Arquitetura de um app

Programador Mobile: Módulo Específico · Encontro E42 · Aula 65 de 71

---

## O que você vai aprender

:::goal
- Organizar o app da equipe por funcionalidade, em `src/features/`
- Separar quem desenha, quem guarda estado e quem fala com o servidor
- Criar a API da equipe com `json-server` e um `db.json` com as coleções do briefing
- Ler, criar, alterar e apagar dados com GET, POST, PATCH e DELETE
- Ligar o celular à API pelo IP do computador, com `EXPO_PUBLIC_API_URL`
:::

---

## Três pessoas, um app, um prazo

A equipe do briefing **Cardápio e pedidos** dividiu o trabalho: Ana faz o cardápio, Bruno o carrinho e Carla o acompanhamento do pedido. Se o app seguir as pastas da Lojinha, os três mexem em `src/telas/` e `src/contexts/` ao mesmo tempo, e todo Pull Request vira conflito.

E os dados? O cardápio da lanchonete não existe na DummyJSON. A equipe precisa de um servidor que ela mesma controla, com os produtos, as categorias e os pedidos do briefing.

:::question
Se o cardápio está guardado no computador do Bruno, como o celular da Ana consegue lê-lo?
:::

---

## :icon[folder-tree] Por tipo ou por funcionalidade

A Lojinha separa os arquivos **por tipo**: todas as telas juntas, todos os contextos juntos. O app da equipe separa **por funcionalidade**: tudo do carrinho numa pasta só.

| | Por tipo (Lojinha) | Por funcionalidade (equipe) |
|---|---|---|
| Pastas | `telas/`, `contexts/`, `regras/` | `features/cardapio/`, `features/carrinho/` |
| Mexer no carrinho | abre 4 pastas | abre 1 pasta |
| Três pessoas | todas nas mesmas pastas | cada uma na sua pasta |
| Tirar uma funcionalidade | caçar arquivos | apagar uma pasta |
| Combina com | app pequeno, uma pessoa | app que cresce, equipe |

Nenhuma está errada: a Lojinha nasceu pequena; o app da equipe nasce para crescer com três pessoas.

---

## :icon[folder-open] A árvore do app da lanchonete

```plaintext
app/                    só rotas finas e layouts
src/
├── features/
│   ├── cardapio/       TelaCardapio, TelaProduto, CartaoProduto, useCardapio
│   ├── carrinho/       TelaCarrinho, CarrinhoContext, carrinhoReducer
│   └── pedidos/        TelaPedidos, TelaPedido, usePedidos, status.js
├── api/                cliente.js, cardapio.js, pedidos.js
├── servicos/           armazenamento.js
├── components/ui/      o kit: Botao, Cartao, EstadoErro, EstadoVazio
├── theme/              tokens.js, TemaContext.js
└── utils/              formatar.js
db.json                 os dados do json-server
```

- Cada pasta de `features/` tem as telas, os componentes, o estado e as regras de **uma** funcionalidade
- O que todas usam fica fora delas: o kit de UI, o tema, os utilitários
- As telas levam o prefixo `Tela` para não se misturar aos componentes da mesma pasta

---

## :icon[layers] Camadas: quem chama quem

:::center
![Animação: a TelaCardapio chama o useCardapio, que chama listarProdutos na api/, que faz GET /produtos no json-server; as setas só descem, e a resposta sobe até a tela](images/e42-camadas.svg)
:::

As chamadas só **descem**: a tela chama o hook, o hook chama a `api/`, a `api/` chama o servidor. Nunca o contrário: a tela não chama `fetch`, o hook ou contexto não desenha e a `api/` não conhece telas. Fora dessa fila, `app/` só diz os endereços, sem lógica, e `servicos/` guarda no aparelho e junta etapas.

Uma funcionalidade usa outra só pela porta da frente: a `TelaProduto` chama `useCarrinho()` para adicionar o lanche, mas não importa o `carrinhoReducer` da pasta vizinha.

---

## Pratique

:::example Onde mora cada um?
Diga a pasta e o arquivo de cada peça do app da lanchonete:

1. `textoDoStatus('preparando')`, que devolve "Em preparo"
2. A função que faz `PATCH /pedidos/:id`
3. A tela "Acompanhar pedido"
4. `salvar('carrinho', itens)`, com AsyncStorage
5. O `Botao` com variantes
6. Um arquivo com uma linha só: `export { default } from ...`
:::

:::tip Resposta
1. `src/features/pedidos/status.js`: regra pura, com teste ao lado
2. `src/api/pedidos.js`: só a `api/` fala com o servidor
3. `src/features/pedidos/TelaPedido.js`
4. `src/servicos/armazenamento.js`, o do E39
5. `src/components/ui/Botao.js`: todas as funcionalidades usam
6. `app/pedido/[id].js`, a rota fina
:::

---

## :icon[server] json-server: a API da equipe

O **json-server** transforma um arquivo JSON numa API de verdade, rodando no computador da equipe. Cada chave do arquivo vira uma rota, e cada escrita (POST, PATCH, DELETE) grava no próprio arquivo.

```bash
# na raiz do repositório, num segundo terminal
npx json-server db.json --port 3000
```

```plaintext
JSON Server started on PORT :3000
Endpoints:
http://localhost:3000/categorias
http://localhost:3000/produtos
http://localhost:3000/pedidos
```

- Na primeira vez, o `npx` pergunta se pode instalar: responda `y`
- A saída mostra `localhost`, mas o servidor também atende pelo IP do computador
- O terminal fica aberto: fechou, a API sai do ar
- Editou o `db.json` à mão? O servidor recarrega sozinho
- Serve para desenvolver e apresentar: não tem login nem validação. O **Supabase** é a opção avançada para quem quiser um banco na nuvem

---

## :icon[database] db.json: as coleções do briefing

```json
{
  "categorias": [
    { "id": "lanches", "nome": "Lanches", "ordem": 1 },
    { "id": "bebidas", "nome": "Bebidas", "ordem": 2 }
  ],
  "produtos": [
    { "id": "1", "nome": "X-Burger", "preco": 22.9, "categoriaId": "lanches", "disponivel": true },
    { "id": "2", "nome": "Suco de laranja", "preco": 9.5, "categoriaId": "bebidas", "disponivel": true }
  ],
  "pedidos": []
}
```

- Uma coleção por "coisa" do briefing, com nome no plural: ele vira a rota `/produtos`
- `categoriaId` liga o produto à categoria
- Todo `id` é texto, entre aspas: o json-server trata qualquer `id` como texto
- Campos em português e no formato do app: nada de traduzir, como na DummyJSON
- Cadastre de 8 a 12 produtos realistas: a tela precisa parecer de verdade

---

## :icon[table] CRUD: quatro métodos, seis rotas

**CRUD**: criar, ler, alterar e apagar, cada um com seu método HTTP:

| Ação | Método e rota | Resposta |
|---|---|---|
| listar o cardápio | `GET /produtos` | 200 e a lista |
| só os lanches | `GET /produtos?categoriaId=lanches` | 200 e os filtrados |
| abrir um produto | `GET /produtos/1` | 200, ou 404 |
| fazer o pedido | `POST /pedidos` e o corpo | 201 e o `id` novo |
| mudar o status | `PATCH /pedidos/xR31m` com `{ "status": "pronto" }` | 200 |
| apagar | `DELETE /pedidos/xR31m` | 200 |

- **PATCH** muda só os campos enviados; **PUT** troca o objeto inteiro e apaga o resto
- `?_sort=-criadoEm` põe o mais novo primeiro

---

## Pense

:::question
O cliente cancela um pedido que ainda não foi para a chapa. Na equipe, Bruno quer `DELETE /pedidos/xR31m`; Carla quer `PATCH /pedidos/xR31m` com `{ "status": "cancelado" }`. Quem tem razão? E na Agenda de serviços, quando alguém desmarca um horário?
:::

:::tip Resposta
Carla. Com PATCH, o pedido cancelado continua existindo: aparece em "Meus pedidos" com o Badge "Cancelado", a cozinha sabe que não precisa preparar e o resumo do dia conta os cancelamentos. DELETE apaga como se o pedido nunca tivesse existido.

Na agenda vale o mesmo: o agendamento vai para `cancelado`, e a regra dos horários livres ignora os cancelados. DELETE é para o que some sem deixar falta, como uma categoria sem lançamentos no Controle de gastos.
:::

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

## :icon[settings] EXPO_PUBLIC_API_URL em cada máquina

```bash
# .env: cada pessoa, com o IP do próprio computador (fora do Git)
EXPO_PUBLIC_API_URL=http://192.168.0.15:3000
```

```bash
# .env.example: no Git, o modelo para a equipe
EXPO_PUBLIC_API_URL=http://IP-DO-SEU-COMPUTADOR:3000
```

- O `db.json` vai para o Git: todos começam com os mesmos dados
- Cada pessoa roda o próprio json-server e aponta o app para o próprio IP
- Escreva `http://`, o IP e a porta, sem barra no fim: os caminhos começam com `/`
- Mudou o `.env`? Reinicie com `npx expo start -c`
- Nada de segredo aqui: o que tem `EXPO_PUBLIC_` vai para dentro do app instalado

---

## :icon[plug] src/api/cliente.js: um lugar só para o fetch

```javascript
const URL_BASE = process.env.EXPO_PUBLIC_API_URL;
export async function pedir(caminho, opcoes = {}) {
  let resposta;
  try {
    resposta = await fetch(URL_BASE + caminho, {
      ...opcoes,
      headers: { 'Content-Type': 'application/json', ...opcoes.headers },
    });
  } catch (erro) {
    if (erro.name === 'AbortError') throw erro;
    throw new Error('Sem conexão com o servidor. Confira o Wi-Fi e o IP do .env.');
  }
  if (!resposta.ok) throw new Error('O servidor respondeu ' + resposta.status + '.');
  return resposta.json();
}
```

- É o `pedir` do E38, agora com a base apontando para o json-server
- Sem rede, a mensagem já diz o que conferir; com 404 ou 500, `resposta.ok` é `false`
- Nenhuma tela conhece o endereço: trocar o json-server pelo Supabase mexe só na `api/`

---

## :icon[cloud-upload] Um arquivo por coleção

```javascript
// src/api/cardapio.js
import { pedir } from './cliente';

export const listarCategorias = () => pedir('/categorias?_sort=ordem');
export const listarProdutos = () => pedir('/produtos');
export const buscarProduto = (id) => pedir('/produtos/' + id);
```

```javascript
// src/api/pedidos.js
import { pedir } from './cliente';

export const listarPedidos = () => pedir('/pedidos?_sort=-criadoEm');
export const criarPedido = (pedido) =>
  pedir('/pedidos', { method: 'POST', body: JSON.stringify(pedido) });
export const mudarStatus = (id, status) =>
  pedir('/pedidos/' + id, { method: 'PATCH', body: JSON.stringify({ status }) });
```

- O app nunca inventa o `id`: o POST devolve o pedido com um `id` como `"xR31mCj8zuk"`
- Por ser texto, compare sem `Number()`: `p.id === id`, ao contrário da Lojinha

---

## :icon[triangle-alert] Erros comuns

:::warning
- `localhost` no `.env`: no celular, ele aponta para o próprio celular
- Fechar o terminal do json-server: o app mostra "Sem conexão"
- Celular no 4G ou no Wi-Fi de visitantes: ele não enxerga o computador
- `Number(id)` com os ids do json-server: `Number('xR31m')` dá `NaN`
- PUT para mudar só o status: o pedido perde os itens e o total
- `fetch` dentro da tela: quando a rota mudar, você caça em cinco arquivos
- Importar arquivos internos de outra funcionalidade em vez do hook dela
:::

---

## Resumo

:::summary
- O app da equipe se organiza por funcionalidade: `src/features/<nome>/` guarda telas, estado e regras de uma parte do app
- As chamadas descem: tela, hook ou contexto, `api/`, servidor; `servicos/` cuida do aparelho
- `npx json-server db.json --port 3000` transforma as coleções do briefing numa API com GET, POST, PATCH e DELETE
- O celular chega ao computador pelo IP, guardado em `EXPO_PUBLIC_API_URL` no `.env` de cada pessoa
- O `id` nasce no servidor e é texto: o app não inventa nem converte
:::

---

## :icon[arrow-right] Próximos passos

A arquitetura está no papel e a API responde no navegador do celular. Falta o estado que várias telas compartilham.

Na aula 66, estado global e hooks:

- :icon[network] Context a fundo: a receita que você usa desde o E11, linha a linha
- :icon[workflow] `useReducer` para o carrinho com várias ações
- :icon[flask-conical] o laboratório: o esqueleto do app da equipe falando com o json-server
