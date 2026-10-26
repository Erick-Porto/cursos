---
title: "Integrando a API: useProdutos e paginação"
summary: Um hook próprio para os produtos da API, com páginas sob demanda, puxar para atualizar e checklist de app conectado.
module: linguagem-js
duration_minutes: 40
objectives:
  - Isolar a busca de produtos e os seus estados no hook useProdutos
  - Paginar a grade com onEndReached, limit e skip
  - Atualizar a lista com o gesto de puxar, sem tirar a grade da tela
  - Conferir uma tela conectada com o checklist de app conectado
---

# Integrando a API: useProdutos e paginação

Programador Mobile: Módulo Específico · Encontro E40 · Aula 61 de 71

---

## O que você vai aprender

:::goal
- Tirar a busca de produtos da tela e levá-la para o hook `useProdutos`
- Pedir os produtos em páginas com `limit` e `skip` e carregar mais com `onEndReached`
- Fazer o puxar para atualizar buscar de novo na API, sem trocar a grade pelo esqueleto
- Conferir a Lojinha com o checklist de app conectado
:::

---

## Por que isso importa

Abra um app de marketplace e procure "fone": são milhares de resultados, e a tela abre em menos de um segundo. O app não baixou tudo. Trouxe os primeiros 20 e, quando você chega perto do fim da rolagem, busca mais 20, com uma rodinha no rodapé.

A DummyJSON tem 194 produtos. Baixar todos ao abrir a Lojinha gasta o plano de dados de quem está no 4G e deixa o esqueleto na tela por mais tempo.

:::question
Quantos produtos o Início deve pedir ao abrir? E como o app sabe que a lista acabou?
:::

---

## :icon[arrow-down] A API entrega em páginas: limit e skip

Na DummyJSON, `limit` diz quantos produtos vêm e `skip`, quantos pular:

```bash
curl "https://dummyjson.com/products?limit=20&skip=40"
```

```json
{ "products": [{ "id": 41, "title": "..." }], "total": 194, "skip": 40, "limit": 20 }
```

:::center
![Animação: a cada pedido de 20, o skip é a quantidade que já está na tela (0, 20, 40 até 180); a última página traz só 14 e, com 194 na tela, igual ao total, não há próxima página](images/e40-paginacao-skip.svg)
:::

- `skip` é quantos você **já tem**: `produtos.length`
- `total` diz quando parar: com 194 na tela, não há próxima página

---

## :icon[cable] listarProdutos devolve a página e o total

A `listarProdutos` do E38 devolve só a lista. Para o app saber quando parar, ela passa a devolver também o `total`:

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
- O `sinal` do E38 continua: o pedido ainda pode ser cancelado
- Quem esperava um array precisa mudar. No Início, é a `buscarVitrine`

:::info API de testes
A DummyJSON tem textos em inglês e preços em dólar. A Lojinha mostra o número com `formatarPreco`; numa loja de verdade, a API já viria em reais.
:::

---

## :icon[blocks] Da tela para um hook próprio

No E38, o Início faz tudo: busca no `useEffect`, cancela com `AbortController`, guarda `carregando` e `erro` e desenha a grade. Com paginação, viriam mais estados misturados ao desenho.

A saída é a receita do `useDebounce`: um hook próprio, que busca e guarda; a tela só desenha. A `buscarVitrine` do E38 vai junto para o arquivo novo e ganha o `pular`:

```javascript
// src/hooks/useProdutos.js
import { useEffect, useRef, useState } from 'react';
import { listarProdutos, pesquisar } from '../api/produtos';

const LIMITE = 20;

async function buscarVitrine(termo, pular, sinal) {
  if (!termo.trim()) return listarProdutos({ limite: LIMITE, pular, sinal });
  const encontrados = await pesquisar(termo, sinal); // a busca vem numa página só
  return { produtos: encontrados, total: encontrados.length };
}
```

Com termo ou sem, a resposta tem o mesmo formato: `{ produtos, total }`.

---

## :icon[variable] useProdutos (1): o que entra e o que sai

```javascript
export function useProdutos({ termo = '' } = {}) {
  const [produtos, setProdutos] = useState([]);
  const [total, setTotal] = useState(0);
  const [carregando, setCarregando] = useState(true); // primeira página
  const [atualizando, setAtualizando] = useState(false); // puxar para atualizar
  const [carregandoMais, setCarregandoMais] = useState(false); // rodapé
  const [erro, setErro] = useState(null);
  const buscando = useRef(false); // trava: um pedido por vez
  const sinal = useRef(null); // cancela os pedidos do termo atual
  // buscarPagina, recarregar, o useEffect, atualizar e carregarMais
  const temMais = produtos.length < total;
  return { produtos, carregando, atualizando, carregandoMais, erro, temMais,
    recarregar, atualizar, carregarMais };
}
```

- Entra um objeto com o termo da busca, que aceita outros filtros no futuro; sai tudo o que a tela precisa para desenhar
- Três estados de espera, porque cada um liga uma rodinha diferente: o esqueleto, a do topo e a do rodapé
- `temMais` é calculado a cada renderização: não precisa de estado

---

## :icon[cloud-download] useProdutos (2): buscar uma página

```javascript
  async function buscarPagina(pular) {
    const meu = sinal.current;
    buscando.current = true;
    try {
      const pagina = await buscarVitrine(termo, pular, meu);
      setProdutos((atuais) => (pular === 0 ? pagina.produtos : [...atuais, ...pagina.produtos]));
      setTotal(pagina.total);
      setErro(null);
    } catch (e) {
      if (e.name !== 'AbortError') setErro(e.message);
    } finally {
      buscando.current = false;
    }
    return !meu.aborted; // false: o termo mudou e o pedido foi cancelado
  }
```

- `pular === 0` é recomeçar: a primeira página **substitui** a lista. As outras entram **no fim**, com spread
- A mensagem do erro já vem em português, do `pedir` do E38
- Cancelar não é falha: o `AbortError` não vira mensagem
- O `finally` solta a trava com sucesso ou com falha

---

## :icon[rotate-cw] useProdutos (3): abrir e trocar de termo

```javascript
  async function recarregar() {
    setCarregando(true);
    const valeu = await buscarPagina(0);
    if (valeu) setCarregando(false); // cancelado: quem desliga é o pedido novo
  }

  useEffect(() => {
    const controle = new AbortController(); // um por termo, como no E38
    sinal.current = controle.signal;
    recarregar(); // ao abrir e a cada termo novo
    return () => controle.abort(); // termo novo: cancela os pedidos do antigo
  }, [termo]);
```

- `recarregar` liga o esqueleto: serve para abrir a tela, para cada termo novo e para o "Tentar novamente"
- Todo pedido de um termo usa o mesmo sinal: trocar o termo cancela a primeira página e o "carregar mais" do termo velho

---

## :icon[chevrons-right] useProdutos (4): atualizar e carregar mais

```javascript
  async function atualizar() {
    if (buscando.current) return;
    setAtualizando(true);
    await buscarPagina(0);
    setAtualizando(false);
  }

  async function carregarMais() {
    if (buscando.current || carregando || produtos.length >= total) return;
    setCarregandoMais(true);
    await buscarPagina(produtos.length);
    setCarregandoMais(false);
  }
```

- `atualizar` liga só a rodinha do topo; se outro pedido está em andamento, ignora o gesto
- Três motivos para não carregar mais: já há um pedido, a primeira página não chegou ou a lista já tem o `total`
- O `skip` da próxima página é `produtos.length`. Na busca, que vem inteira, o `total` já foi alcançado

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

## :icon[layout-grid] Início: a tela só desenha

O `useEffect` da busca, os estados e a `tentativa` saem do `Inicio.js`. No lugar, o hook, importado de `'../hooks/useProdutos'` e chamado com o termo do debounce:

```jsx
export default function Inicio() {
  // useTema, useFiltros, colunas, termo e termoAtrasado continuam no topo
  const { produtos, carregando, atualizando, carregandoMais, erro, temMais,
    recarregar, atualizar, carregarMais } = useProdutos({ termo: termoAtrasado });
  const vitrine = aplicarFiltros(produtos, filtros); // como no E38

  function desenharConteudo() {
    if (carregando) return <GradeEsqueleto colunas={colunas} />; // o esqueleto do E19 volta
    if (erro && produtos.length === 0) {
      return <EstadoErro mensagem={erro} onTentarNovamente={recarregar} />;
    }
    if (vitrine.length === 0) return <EstadoVazio /* o "Nada encontrado" do E38 */ />;
    return <FlatList /* a grade paginada */ />;
  }
}
```

- O `return` continua como no E38: o campo de busca e, abaixo dele, `{desenharConteudo()}`. Assim o teclado não fecha a cada busca
- O `EstadoErro` só toma a vitrine quando não há nada para mostrar; com a grade preenchida, o erro vai para o rodapé

---

## :icon[list] Grade paginada: onEndReached e rodapé

```jsx
<FlatList
  data={vitrine}
  // key, numColumns, keyExtractor e renderItem como no E38
  onEndReached={carregarMais}
  onEndReachedThreshold={0.5}
  ListFooterComponent={desenharRodape()}
/>
```

```jsx
function desenharRodape() {
  if (carregandoMais) return <ActivityIndicator color={cores.primaria} style={estilos.rodape} />;
  if (erro) return <Botao titulo="Tentar de novo" variante="secundaria" onPress={carregarMais} />;
  if (!temMais) {
    return <Text style={[estilos.rodape, { color: cores.textoSuave }]}>Você viu todos os produtos</Text>;
  }
  return null;
}
```

- `onEndReached` chama `carregarMais` quando falta meia tela para o fim; o hook decide se pede
- O rodapé mostra um estado por vez: rodinha, "Tentar de novo" ou o fim da lista
- `desenharRodape` fica dentro do `Inicio`, para enxergar o hook e as cores

---

## :icon[refresh-cw] Puxar para atualizar de verdade

No E14, a rodinha girava com um `setTimeout`. Agora `atualizar` pede a primeira página de novo:

```jsx
<FlatList
  // as props da grade paginada
  refreshControl={
    <RefreshControl refreshing={atualizando} onRefresh={atualizar}
      colors={[cores.primaria]} tintColor={cores.primaria} />
  }
/>
```

| | `recarregar` | `atualizar` |
|---|---|---|
| Quando | ao abrir, a cada termo e no "Tentar novamente" | no gesto de puxar |
| Enquanto busca | esqueleto no lugar da grade | rodinha no topo, grade visível |
| Ao chegar | primeira página | primeira página, no lugar de todas |

Se `atualizar` ligasse `carregando`, a grade sumiria no meio do gesto e o esqueleto piscaria.

---

## :icon[smartphone] Cada estado no seu lugar

:::center
![Diagrama: no Início, atualizando liga a rodinha do topo; carregando e o erro sem produtos ocupam o lugar da grade; carregandoMais, o erro com produtos e o fim da lista aparecem no rodapé](images/e40-estados-inicio.svg)
:::

O Início lê os estados do `useProdutos` e mostra **um por vez em cada parte** da tela: o topo é do puxar para atualizar, o meio é da grade e o rodapé é do carregar mais. Por isso a rede que cai na página 3 não apaga o que o usuário já viu.

---

## :icon[clipboard-check] Checklist de app conectado

Teste cada linha no celular antes de entregar:

| Situação | Como testar | O que a tela mostra |
|---|---|---|
| Primeira carga | abrir o app | esqueleto, depois a grade |
| Sem rede ao abrir | modo avião e reabrir | `EstadoErro` com "Tentar novamente" |
| Rede cai no meio | modo avião e rolar | grade intacta, "Tentar de novo" no rodapé |
| Rede lenta | `&delay=2000` no caminho | rodinha no rodapé, sem repetidos |
| Fim da lista | rolar até o 194 | "Você viu todos os produtos" |
| Busca sem resultado | pesquisar "zzzz" | `EstadoVazio` |

E também: puxar para atualizar, dois temas e URL só no `.env`.

---

## :icon[triangle-alert] Erros comuns

:::warning
- `skip: pagina * 20` com a página começando em 1: os 20 primeiros nunca aparecem. Use `produtos.length`
- Pedir sem trava: o `onEndReached` dispara duas vezes e a mesma página entra repetida
- `setProdutos(pagina.produtos)` em toda página: a lista é trocada em vez de crescer
- Não comparar com `total`: no fim da lista, o app ainda pede uma página vazia
- Trocar a grade pelo `EstadoErro` quando só a página 3 falhou: o usuário perde o que já viu
- Ligar `carregando` no puxar para atualizar: a grade some e o esqueleto pisca
- Chamar `useProdutos()` sem o `termo`: a busca deixa de funcionar
:::

---

## Resumo

:::summary
- A DummyJSON pagina com `limit` e `skip` e devolve o `total`; `listarProdutos` repassa `{ produtos, total }`
- `useProdutos({ termo })` guarda os estados e as ações e cancela os pedidos do termo velho; o Início só escolhe o que desenhar
- `carregarMais` pede a partir de `produtos.length`, para no `total` e usa uma trava em `useRef`
- `atualizar` liga `atualizando`, não `carregando`: a grade fica na tela enquanto a rodinha gira
- Erro sem produtos toma a tela; erro com produtos vai para o rodapé
:::

---

## :icon[arrow-right] Próximos passos

A Lojinha agora percorre um catálogo de verdade, página a página. É a versão 2, e ela fecha a unidade Linguagem JavaScript.

Na aula 62, a revisão de E21 a E40:

- :icon[map] um slide por tema, do Node ao `useProdutos`
- :icon[circle-help] cinco questões comentadas no estilo da prova
- :icon[flask-conical] o laboratório: paginação no seu app e o commit "v2 Lojinha conectada"

Depois, a **Prova 2**, no sistema.
