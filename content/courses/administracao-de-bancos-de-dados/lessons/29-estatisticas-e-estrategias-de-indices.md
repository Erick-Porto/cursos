---
title: Estatísticas e estratégias de índices
summary: Como o otimizador usa estatísticas, como um índice B-tree funciona e como escolher índices que valem o custo.
module: operacao
duration_minutes: 30
objectives:
  - Explicar como as estatísticas guiam o otimizador e quando atualizá-las
  - Descrever a estrutura B-tree e os tipos de índice do InnoDB
  - Aplicar a regra do prefixo mais à esquerda, a seletividade e o covering index
  - Propor um conjunto de índices para as consultas de uma aplicação
---

# Estatísticas e estratégias de índices

Administração de Bancos de Dados · Aula 29

---

## O que você vai aprender

:::goal
- Por que o otimizador depende de estatísticas e o que acontece quando elas envelhecem
- Como um índice B-tree é construído e quais tipos o InnoDB oferece
- Como índices compostos, seletividade e covering index mudam um plano
- Como decidir quais índices criar, e quais remover, a partir das consultas reais
:::

---

## :icon[timer] Por que isso importa

Sexta-feira: a importação noturna carregou 900.000 pedidos antigos na tabela `pedidos`. Segunda-feira: um relatório que levava 50 ms passou a levar 6 segundos. Ninguém mudou o SQL nem os índices.

```sql
EXPLAIN SELECT id, total FROM pedidos
WHERE cliente_id = 3 AND data_pedido > '2025-03-01';
```

O plano mostra `type: ALL`, embora exista índice em `cliente_id`.

:::question
Se o índice existe e a consulta é a mesma, o que mudou na cabeça do otimizador?
:::

---

## :icon[chart-bar] O otimizador depende de estatísticas

O otimizador não olha os dados: ele olha **estatísticas**, um resumo guardado sobre cada tabela e índice.

| Estatística | O que diz | Para que serve |
|---|---|---|
| linhas estimadas | tamanho da tabela | custo de varrer tudo |
| **cardinalidade** | valores distintos no índice | quantas linhas um `=` deve devolver |
| distribuição (histograma) | frequência de cada valor | se o valor buscado é raro ou comum |

Estatísticas **desatualizadas** enganam o otimizador: ele acha que a tabela tem 100 linhas e varre tudo, ou acha que um índice devolve 1 linha quando devolve 200.000.

```sql
SHOW INDEX FROM pedidos;   -- veja a coluna Cardinality
```

---

## :icon[refresh-cw] Atualizando as estatísticas

```sql
ANALYZE TABLE pedidos;
```

| Table | Op | Msg_type | Msg_text |
|---|---|---|---|
| loja.pedidos | analyze | status | OK |

- :icon[database] O InnoDB guarda as estatísticas em disco (`innodb_stats_persistent = ON`, o padrão) e as recalcula sozinho quando cerca de 10% das linhas mudam
- :icon[upload] Depois de uma carga grande ou de criar um índice em tabela cheia, rode `ANALYZE TABLE` sem esperar
- :icon[chart-column] Para colunas com valores muito desiguais, um **histograma** registra a distribuição: `ANALYZE TABLE pedidos UPDATE HISTOGRAM ON status;`

:::info
No PostgreSQL o comando é `ANALYZE pedidos;` e o `autovacuum` cuida da rotina.
:::

---

## :icon[layers] Como um índice é construído: a B-tree

Um índice InnoDB é uma **B-tree**: uma árvore ordenada e balanceada. Toda busca desce da raiz às folhas em poucos passos, mesmo com milhões de linhas.

:::center
![B-tree simplificada: a raiz aponta para nós internos, que apontam para folhas ordenadas e encadeadas; a folha encontrada aponta para a linha na tabela, e o caminho da busca por 57 está destacado em verde](images/29-btree.svg)
:::

- Buscar 57: raiz, um nó interno, uma folha. Três leituras para um milhão de linhas
- Folhas encadeadas: `BETWEEN`, `>` e `ORDER BY` percorrem em sequência
- Por isso a B-tree serve para igualdade, intervalo, prefixo (`LIKE 'Ana%'`) e ordenação

---

## :icon[bookmark] Tipos de índice no InnoDB

| Tipo | Como é | Exemplo |
|---|---|---|
| **clustered** (chave primária) | a própria tabela, ordenada pela PK | `PRIMARY KEY (id)` |
| secundário | B-tree com a coluna e o valor da PK | `INDEX (data_pedido)` |
| `UNIQUE` | secundário que proíbe repetição | `UNIQUE (email)` |
| composto | várias colunas, na ordem declarada | `INDEX (cliente_id, data_pedido)` |
| prefixo | só os primeiros N caracteres | `INDEX (nome(20))` |
| `FULLTEXT` | palavras, para busca textual | `FULLTEXT (nome)` |

Um índice secundário guarda o valor da PK; para trazer outras colunas, o InnoDB volta à tabela por ela. Há também índices espaciais (`SPATIAL`), para coordenadas.

---

## :icon[list-ordered] A regra do prefixo mais à esquerda

Um índice composto é ordenado pela primeira coluna e, dentro dela, pela segunda. Ele só serve a consultas que filtram **a partir da esquerda**.

:::center
![Índice composto em (cliente_id, data_pedido): a consulta por cliente usa o índice, a consulta por cliente e data usa as duas colunas, e a consulta só por data não usa](images/29-prefixo-esquerda.svg)
:::

```sql
CREATE INDEX idx_pedidos_cliente_data ON pedidos (cliente_id, data_pedido);
```

| WHERE | Usa o índice? |
|---|---|
| `cliente_id = 3` | sim |
| `cliente_id = 3 AND data_pedido > '2025-03-01'` | sim, as duas colunas |
| `data_pedido > '2025-03-01'` | não: pula a primeira coluna |

---

## :icon[funnel] Seletividade

**Seletividade** é a razão entre valores distintos e total de linhas. Quanto mais perto de 1, mais um índice reduz a busca.

| Coluna de `pedidos` | Distintos | Seletividade | Índice ajuda? |
|---|---|---|---|
| `id` | 1.000.000 | 1,0 | sempre: uma linha |
| `cliente_id` | 80.000 | 0,08 | sim: cerca de 12 linhas por valor |
| `status` | 4 | 0,000004 | quase nunca |

Com `status = 'pago'` em 85% das linhas, o índice devolveria 850.000 ponteiros, e o InnoDB ainda voltaria à tabela por cada um. Varrer a tabela em sequência é mais barato, e o otimizador sabe disso.

:::tip
Coluna pouco seletiva pode entrar em um índice composto, depois de uma coluna seletiva: `(cliente_id, status)`.
:::

---

## :icon[package-check] Covering index: responder sem tocar a tabela

Se todas as colunas que a consulta usa estão no índice, o InnoDB nem visita a tabela. O `EXPLAIN` mostra `Using index`.

```sql
CREATE INDEX idx_pedidos_cliente_data_total
  ON pedidos (cliente_id, data_pedido, total);

EXPLAIN SELECT data_pedido, total
FROM pedidos WHERE cliente_id = 3;
```

| type | key | rows | Extra |
|---|---|---|---|
| `ref` | `idx_pedidos_cliente_data_total` | 12 | Using index |

A coluna `id` também vem de graça: todo índice secundário carrega a chave primária. Vale a pena para as consultas mais frequentes do sistema, não para todas.

---

## :icon[scale] Todo índice tem custo

Cada `INSERT`, `UPDATE` ou `DELETE` atualiza **todos** os índices da tabela. Dez índices em `pedidos` são dez escritas extras por pedido novo.

- :icon[copy] **Redundante**: `(cliente_id)` ao lado de `(cliente_id, data_pedido)`; o composto já atende tudo o que o simples atende
- :icon[eye-off] **Não usado**: criado para um relatório que não existe mais, e pago em toda escrita

```sql
SELECT * FROM sys.schema_redundant_indexes;
SELECT * FROM sys.schema_unused_indexes;   -- uso desde o último restart
```

:::warning
Antes de remover um índice, confirme que o servidor está no ar há tempo suficiente para registrar o uso, e lembre que a chave estrangeira exige um índice que comece por `cliente_id`.
:::

---

## :icon[git-merge] Como o MySQL 8 executa um JOIN

| Algoritmo | Como funciona | Quando aparece |
|---|---|---|
| **Nested loop** | para cada linha da tabela externa, busca a correspondente na interna pelo índice | o caso normal, com índice na coluna do `ON` |
| **Block nested loop** | lê blocos da externa e varre a interna para cada bloco | sem índice, em versões anteriores à 8.0.20 |
| **Hash join** (8.0.18+) | monta uma tabela hash em memória com a tabela menor e procura nela | sem índice útil no `ON`; substituiu o block nested loop |

O `EXPLAIN FORMAT=TREE` mostra `Nested loop inner join` ou `Inner hash join`. Hash join em junção frequente costuma indicar falta de índice na coluna do `ON`.

---

## :icon[flask-conical] Pratique

A aplicação roda estas consultas o dia todo em `pedidos` (1.000.000 de linhas; a chave estrangeira já criou o índice `cliente_id`):

```sql
-- 1: histórico do cliente
SELECT id, data_pedido, total FROM pedidos
WHERE cliente_id = ? ORDER BY data_pedido DESC;
-- 2: pedidos recentes do cliente
SELECT id, total FROM pedidos
WHERE cliente_id = ? AND data_pedido > ?;
-- 3: painel
SELECT COUNT(*) FROM pedidos WHERE status = 'pago';
-- 4: login
SELECT id, nome FROM clientes WHERE email = ?;
```

:::question
Quais índices você cria? Qual pode ser removido? Qual consulta não ganha nada com índice?
:::

---

## :icon[circle-check] Solução

```sql
CREATE INDEX idx_pedidos_cliente_data ON pedidos (cliente_id, data_pedido);
ALTER TABLE pedidos DROP INDEX cliente_id;   -- redundante: o composto começa por cliente_id
```

- Consultas **1 e 2** usam o composto: igualdade em `cliente_id` e, na sequência, ordenação ou intervalo em `data_pedido`. O `Using filesort` da consulta 1 desaparece
- O índice `cliente_id` sozinho vira redundante; a chave estrangeira continua válida porque o composto começa por ela
- Consulta **3**: `status` tem 4 valores e `pago` é a maioria. Índice não ajuda; se o painel for crítico, mantenha um contador em outra tabela
- Consulta **4**: `email` já é `UNIQUE`, logo já tem índice. Nada a fazer

:::tip
Acrescentar `total` ao composto o tornaria covering para 1 e 2. Decida medindo: índice mais largo custa mais em cada escrita.
:::

---

## :icon[triangle-alert] Erros comuns

:::warning
- Criar índice em coluna de 2 ou 4 valores (`status`, `ativo`) e esperar milagre
- Criar `(data_pedido, cliente_id)` quando as consultas filtram por `cliente_id` primeiro: a ordem das colunas decide
- Manter índices simples que já estão cobertos por um composto
- Carregar milhões de linhas e esquecer o `ANALYZE TABLE`
- Indexar tudo "por garantia" em uma tabela que recebe milhares de escritas por minuto
:::

---

## :icon[list-checks] Resumo

:::summary
- O otimizador decide por **estatísticas** (linhas, cardinalidade, histogramas); `ANALYZE TABLE` as atualiza depois de cargas grandes
- Índices InnoDB são **B-trees**: a PK é a própria tabela (clustered) e os secundários apontam para ela
- Em índice composto vale o **prefixo mais à esquerda**; coluna pouco seletiva sozinha não ajuda
- **Covering index** responde sem tocar a tabela; índices redundantes e não usados só custam escrita
- Nested loop com índice é o JOIN comum; hash join cobre o caso sem índice
:::

---

## :icon[arrow-right] Próximos passos

Com monitoramento, `EXPLAIN` e índices, você sabe deixar o banco rápido. A próxima aula, **Backup: conceitos e estratégias**, cuida do outro lado da operação: garantir que os dados sobrevivam a falhas, erros e desastres.

Faça o quiz antes de seguir.
