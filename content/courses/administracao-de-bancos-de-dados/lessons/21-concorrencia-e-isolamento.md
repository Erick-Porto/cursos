---
title: Concorrência e níveis de isolamento
summary: Leitura suja, não repetível e fantasma, e como os quatro níveis de isolamento controlam cada uma.
module: transacoes
duration_minutes: 25
objectives:
  - Identificar leitura suja, leitura não repetível e leitura fantasma
  - Comparar os quatro níveis de isolamento do padrão SQL
  - Consultar e alterar o nível de isolamento no MySQL
  - Escolher o nível de isolamento pelo equilíbrio entre consistência e desempenho
---

# Concorrência e níveis de isolamento

Administração de Bancos de Dados · Aula 21

---

## O que você vai aprender

:::goal
- Por que várias sessões ao mesmo tempo podem produzir resultados estranhos
- As três anomalias de leitura, com uma linha do tempo para cada
- Os quatro níveis de isolamento e o que cada um permite
- Como ver e mudar o nível no MySQL, e quando escolher cada um
:::

---

## :icon[users] Por que isso importa

Ao mesmo tempo, na loja:

- :icon[shopping-cart] Ana finaliza a compra do último Notebook
- :icon[chart-bar] o gerente roda o relatório de estoque
- :icon[pencil] Bruno altera o preço do Monitor

Cada sessão está no meio da própria transação. O relatório deve mostrar o Notebook com estoque 5 ou 4? O preço antigo ou o novo?

:::question
O que uma transação deveria enxergar do trabalho **ainda não confirmado** das outras?
:::

---

## :icon[eye] Três anomalias de leitura

Quando o isolamento é fraco, uma transação vê coisas que não deveria. O padrão SQL dá nome a três situações:

| anomalia | o que a transação vê |
|---|---|
| **Leitura suja** | um valor que outra sessão alterou e ainda não confirmou |
| **Leitura não repetível** | a mesma linha com valores diferentes em duas leituras |
| **Leitura fantasma** | linhas novas (ou a menos) ao repetir a mesma consulta |

A seguir, cada uma ganha uma linha do tempo com duas sessões: **T1** e **T2**.

---

## :icon[eye-off] Leitura suja (dirty read)

:::center
![Linha do tempo: T2 reduz o estoque sem confirmar, T1 lê o valor provisório e T2 desfaz a alteração](images/21-leitura-suja.svg)
:::

T2 executa `UPDATE produtos SET estoque = 4 WHERE id = 5` e ainda não confirmou. T1 consulta o `estoque` do Notebook e recebe **4**. T2 faz `ROLLBACK`: o 4 que T1 leu nunca foi confirmado, e o relatório nasce errado.

:::tip
Regra prática: nunca tome decisão com base em dado que outra sessão ainda pode desfazer.
:::

---

## :icon[repeat] Leitura não repetível

:::center
![Linha do tempo: T1 lê o preço do Monitor, T2 altera e confirma, T1 lê de novo e recebe outro valor](images/21-leitura-nao-repetivel.svg)
:::

T1 lê `preco` do Monitor (id 3): 900.00. T2 executa `UPDATE produtos SET preco = 850 WHERE id = 3` e confirma. T1 repete o mesmo `SELECT` na mesma transação: 850.00. A **mesma linha**, lida duas vezes, trouxe valores diferentes.

Isso incomoda quando a transação calcula algo em etapas, como somar um carrinho e depois conferir o total.

---

## :icon[search] Leitura fantasma (phantom read)

:::center
![Linha do tempo: T1 conta os pedidos abertos, T2 insere um pedido aberto e confirma, T1 conta de novo e encontra uma linha a mais](images/21-leitura-fantasma.svg)
:::

T1 executa `SELECT COUNT(*) FROM pedidos WHERE status = 'aberto'`: 1. T2 insere um pedido aberto e confirma. T1 repete a contagem: 2.

A diferença para a leitura não repetível: a linha original não mudou. **Apareceu uma linha nova** que atende ao mesmo `WHERE`.

Também vale para linhas que **somem** porque outra sessão as apagou.

---

## :icon[layers] Os quatro níveis de isolamento

Cada nível define quais anomalias uma transação **aceita** em troca de mais velocidade.

| nível | suja | não repetível | fantasma |
|---|---|---|---|
| `READ UNCOMMITTED` | possível | possível | possível |
| `READ COMMITTED` | evitada | possível | possível |
| `REPEATABLE READ` | evitada | evitada | possível |
| `SERIALIZABLE` | evitada | evitada | evitada |

De cima para baixo: mais proteção, menos concorrência. `SERIALIZABLE` faz as transações se comportarem como se rodassem uma após a outra.

---

## :icon[database] O padrão do InnoDB: REPEATABLE READ

No InnoDB, a transação tira uma **fotografia** dos dados na primeira leitura e enxerga essa fotografia até o fim, sem travar ninguém. Por isso, as leituras comuns não veem linhas não repetíveis **nem fantasmas**.

Nas escritas e nas leituras com lock (`UPDATE`, `SELECT ... FOR UPDATE`), o InnoDB usa **next-key locks**: trava a linha e o intervalo ao redor dela, impedindo que outra sessão insira um fantasma ali.

:::info
No PostgreSQL, o padrão é `READ COMMITTED`, e `READ UNCOMMITTED` se comporta como `READ COMMITTED`: leitura suja não existe lá.
:::

---

## :icon[sliders-horizontal] Vendo e mudando o nível

```sql
SELECT @@transaction_isolation;      -- REPEATABLE-READ

-- só para a próxima transação desta sessão
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
START TRANSACTION;
SELECT COUNT(*) FROM pedidos WHERE status = 'aberto';
COMMIT;

-- para todas as transações seguintes da sessão
SET SESSION TRANSACTION ISOLATION LEVEL SERIALIZABLE;
```

`SET GLOBAL ...` muda o padrão para as **novas** conexões; o valor definitivo fica em `my.cnf` (`transaction_isolation`).

---

## :icon[scale] Qual nível escolher

| situação | nível | motivo |
|---|---|---|
| Contador de visualizações | `READ COMMITTED` | tolera imprecisão momentânea; quase não trava |
| Venda com baixa de estoque | `REPEATABLE READ` e lock na linha | o estoque não pode ficar negativo |
| Fechamento financeiro longo | `REPEATABLE READ` | precisa de uma fotografia consistente |
| Auditoria sem margem para dúvida | `SERIALIZABLE` | correção acima de tudo; aceita esperas |

:::tip
Fique no padrão `REPEATABLE READ` e só desça para `READ COMMITTED` quando medir contenção de verdade.
:::

---

## :icon[flask-conical] Pratique: detetive de anomalias

Identifique a anomalia de cada cenário e o **nível mínimo** do padrão SQL que a evita.

:::example
**Cenário 1.** T1 lê o estoque do Notebook: 5. T2 executa `UPDATE produtos SET estoque = 4 WHERE id = 5` sem confirmar. T1 lê de novo: 4. T2 faz `ROLLBACK`.

**Cenário 2.** T1 conta os pedidos com `status = 'aberto'`: 1. T2 insere um pedido aberto e confirma. T1 conta de novo: 2.

**Cenário 3.** T1 lê o preço do Monitor: 900.00. T2 muda para 850.00 e confirma. T1 lê de novo: 850.00.
:::

---

## :icon[circle-check] Solução

| cenário | anomalia | nível mínimo que evita |
|---|---|---|
| 1 | Leitura suja | `READ COMMITTED` |
| 2 | Leitura fantasma | `SERIALIZABLE` |
| 3 | Leitura não repetível | `REPEATABLE READ` |

- No cenário 1, T1 usou um valor que T2 desfez: ele nunca existiu de verdade
- No cenário 2, a linha original não mudou; **surgiu uma nova** que atende ao filtro
- No cenário 3, a **mesma linha** mudou entre as duas leituras

No InnoDB, o padrão `REPEATABLE READ` já evita os três cenários nas leituras comuns, graças à fotografia da transação.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Confundir não repetível (a **mesma linha** mudou) com fantasma (o **conjunto** mudou)
- Achar que `READ UNCOMMITTED` é "mais rápido, logo melhor": ele entrega números que podem ser desfeitos
- Usar `SERIALIZABLE` no sistema inteiro e descobrir filas de espera no horário de pico
- Esperar que `SET TRANSACTION ISOLATION LEVEL` valha para a sessão toda: sem `SESSION`, vale só para a próxima transação
- Supor que o nível de isolamento sozinho impede duas vendas do mesmo último item
:::

---

## :icon[list-checks] Resumo

:::summary
- Sessões simultâneas podem causar leitura suja, não repetível e fantasma
- Os níveis `READ UNCOMMITTED`, `READ COMMITTED`, `REPEATABLE READ` e `SERIALIZABLE` trocam proteção por concorrência
- O InnoDB usa `REPEATABLE READ` por padrão, com fotografia dos dados e next-key locks
- `SELECT @@transaction_isolation` mostra o nível; `SET [SESSION] TRANSACTION ISOLATION LEVEL` muda
- Escolha pelo risco do negócio, não pelo medo: meça antes de descer o nível
:::

---

## :icon[arrow-right] Próximos passos

Os níveis de isolamento dizem **o que** cada transação pode ver. Quem faz isso acontecer na prática são os **locks**, e eles têm um efeito colateral famoso: o deadlock.

Na próxima aula, **Locks e deadlocks**, você vai usar `SELECT ... FOR UPDATE`, entender a espera circular entre duas sessões e aprender a evitá-la.

Antes, responda ao quiz e teste o seu faro de detetive de anomalias.
