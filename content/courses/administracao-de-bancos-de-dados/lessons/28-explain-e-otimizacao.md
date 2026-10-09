---
title: Planos de execução com EXPLAIN
summary: Como ler o plano que o otimizador escolheu e usar isso para acelerar consultas com índices e SQL melhor.
module: operacao
duration_minutes: 25
objectives:
  - Explicar o papel do otimizador e o que EXPLAIN mostra
  - Interpretar as colunas type, key, rows e Extra de um plano
  - Reconhecer sinais de alerta como ALL, Using filesort e Using temporary
  - Aplicar técnicas de otimização em consultas e índices
---

# Planos de execução com EXPLAIN

Administração de Bancos de Dados · Aula 28

---

## O que você vai aprender

:::goal
- O que o otimizador faz com a sua consulta antes de executá-la
- Como ler um `EXPLAIN`: `type`, `key`, `rows`, `Extra`
- Quais sinais indicam uma consulta ruim e qual índice resolve
- Seis técnicas de otimização que valem para quase todo sistema
:::

---

## :icon[timer] Por que isso importa

A tabela `clientes` tem 1.000.000 de linhas. A busca por nome demora 2 segundos:

```sql
SELECT id, email, cidade
FROM clientes
WHERE nome = 'Ana Souza';
```

A consulta está correta e devolve 12 linhas. Então por que é lenta?

:::question
Como o MySQL encontra essas 12 linhas no meio de um milhão? Ele lê todas ou vai direto?
:::

---

## :icon[brain] O otimizador decide o caminho

Em SQL você diz **o que** quer, não **como** buscar. Quem decide o caminho é o **otimizador**: ele compara alternativas (varrer a tabela, usar um índice, em que ordem juntar tabelas) e escolhe a de menor custo estimado.

:::center
![Fluxo: a consulta entra no otimizador, que avalia caminhos com base em estatísticas e índices, e produz o plano de execução](images/28-otimizador.svg)
:::

O **plano de execução** é a receita escolhida. `EXPLAIN` mostra essa receita sem executar a consulta.

---

## :icon[search] EXPLAIN, EXPLAIN ANALYZE e FORMAT=JSON

```sql
EXPLAIN SELECT id, email, cidade FROM clientes WHERE nome = 'Ana Souza';

EXPLAIN ANALYZE SELECT id, email, cidade FROM clientes WHERE nome = 'Ana Souza';

EXPLAIN FORMAT=JSON SELECT id, email, cidade FROM clientes WHERE nome = 'Ana Souza';
```

| Comando | O que faz |
|---|---|
| `EXPLAIN` | mostra o plano **estimado**; não executa |
| `EXPLAIN ANALYZE` (8.0.18+) | **executa** e mostra tempo e linhas reais de cada etapa |
| `EXPLAIN FORMAT=JSON` | plano detalhado, com custos; é a base do Visual Explain do Workbench |

:::warning
`EXPLAIN ANALYZE` roda a consulta de verdade: uma consulta de 2 minutos leva 2 minutos. Use em homologação ou fora do horário de pico.
:::

---

## :icon[table] As colunas do EXPLAIN

| Coluna | Significado |
|---|---|
| `id` e `select_type` | ordem das etapas e tipo de SELECT; `DEPENDENT SUBQUERY` merece atenção |
| `table` | tabela ou apelido desta etapa |
| `type` | **como** as linhas são acessadas; a coluna mais importante |
| `possible_keys` e `key` | índices candidatos e o índice usado (`NULL`: nenhum) |
| `rows` e `filtered` | linhas estimadas e % que sobrevive ao `WHERE`; quanto menos linhas, melhor |
| `Extra` | avisos: ordenação, tabela temporária, índice que cobre tudo |

Leia primeiro `type`, `key`, `rows` e `Extra`. As outras dão contexto.

---

## :icon[trending-up] A escala de type

:::center
![Escada com seis degraus, do pior ao melhor: ALL varre a tabela inteira; index varre o índice inteiro; range lê um intervalo; ref lê linhas por igualdade em índice comum; eq_ref lê uma linha por chave única; const lê uma linha uma única vez](images/28-escala-type.svg)
:::

- `ALL` em tabela grande é o sinal vermelho: falta índice para o filtro
- `range`, `ref`, `eq_ref` e `const` significam que um índice guiou a busca
- `index` parece bom, mas lê o índice inteiro; só compensa se o índice for bem menor que a tabela

---

## :icon[triangle-alert] Sinais na coluna Extra

| Extra | O que significa | Reação |
|---|---|---|
| `Using filesort` | ordenou fora do índice, em memória ou disco | índice nas colunas do `ORDER BY` |
| `Using temporary` | criou tabela temporária (`GROUP BY`, `DISTINCT`, `UNION`) | índice no `GROUP BY` ou reescrita |
| `Using where` com `type: ALL` | leu tudo e filtrou depois | índice na coluna do `WHERE` |
| `Using index` | respondeu só com o índice, sem tocar a tabela | ótimo: **covering index** |

:::tip
`Using where` sozinho não é problema: diz apenas que um filtro foi aplicado. O problema é ele ao lado de `ALL` e `rows` enorme.
:::

---

## :icon[zap] Antes e depois de um índice

:::center
![Animação em três passos: sem índice o EXPLAIN mostra type ALL e 1.000.000 de linhas varridas; cria-se o índice em nome; depois o EXPLAIN mostra type ref e 12 linhas](images/28-antes-depois-indice.svg)
:::

```sql
CREATE INDEX idx_clientes_nome ON clientes (nome);
EXPLAIN SELECT id, email, cidade FROM clientes WHERE nome = 'Ana Souza';
```

| Momento | type | key | rows |
|---|---|---|---|
| antes | `ALL` | `NULL` | 1.000.000 |
| depois | `ref` | `idx_clientes_nome` | 12 |

De 2 segundos para alguns milissegundos, sem mudar uma letra da consulta.

---

## :icon[wrench] Técnicas: pedir menos e filtrar cedo

- :icon[columns-3] **Evite `SELECT *`**: traga só as colunas que a tela usa. Menos disco, rede e memória, e abre caminho para covering index
- :icon[funnel] **Filtre o mais cedo possível**: um `WHERE` seletivo antes do `JOIN` reduz o trabalho de todas as etapas seguintes
- :icon[bookmark] **Indexe o que filtra, junta e ordena**: colunas de `WHERE`, `JOIN ... ON` e `ORDER BY`
- :icon[rows-3] **`LIMIT` na paginação**: `LIMIT 20` devolve só a primeira página; `OFFSET` gigante lê e descarta milhares de linhas

:::tip
Em páginas profundas, prefira `WHERE id > :ultimo_id ORDER BY id LIMIT 20`: o índice vai direto ao ponto.
:::

---

## :icon[calendar] Função sobre coluna indexada

Com índice em `data_pedido`, estas duas consultas trazem o mesmo resultado, mas com planos muito diferentes:

```sql
-- type: ALL. YEAR() precisa ser calculada linha a linha; o índice não serve
SELECT id, total FROM pedidos WHERE YEAR(data_pedido) = 2025;

-- type: range. Intervalo direto no índice
SELECT id, total FROM pedidos
WHERE data_pedido >= '2025-01-01' AND data_pedido < '2026-01-01';
```

O mesmo vale para `LOWER(email) = ...`, `DATE(criado_em) = ...` e `LIKE '%texto'`: a expressão esconde a coluna do índice.

:::info
O MySQL 8.0.13+ aceita **índices funcionais**: `CREATE INDEX idx ON pedidos ((YEAR(data_pedido)));`. Reescrever a consulta costuma ser mais simples.
:::

---

## :icon[git-merge] JOIN no lugar de subconsulta correlacionada

```sql
-- DEPENDENT SUBQUERY: roda uma vez para cada cliente
SELECT c.nome,
       (SELECT COUNT(*) FROM pedidos p WHERE p.cliente_id = c.id) AS pedidos
FROM clientes c;

-- Um JOIN e um GROUP BY: uma passada só
SELECT c.nome, COUNT(p.id) AS pedidos
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id
GROUP BY c.id, c.nome;
```

| nome | pedidos |
|---|---|
| Ana Souza | 2 |
| Bruno Lima | 1 |
| Carla Mendes | 1 |
| Diego Rocha | 0 |
| Elisa Prado | 0 |

Com 1.000.000 de clientes, a primeira versão executa a subconsulta um milhão de vezes.

---

## :icon[flask-conical] Pratique

Duas consultas da tela de relatórios, com 1.000.000 de pedidos. Os planos:

```sql
-- A
SELECT id, total FROM pedidos WHERE cliente_id = 3 AND status = 'aberto';
-- B
SELECT id, cliente_id, total FROM pedidos
WHERE data_pedido BETWEEN '2025-03-01' AND '2025-03-31'
ORDER BY total DESC;
```

| Consulta | type | key | rows | Extra |
|---|---|---|---|---|
| A | `ref` | `cliente_id` | 12 | Using where |
| B | `ALL` | `NULL` | 1.000.000 | Using where; Using filesort |

:::question
Qual consulta precisa de ajuda? Qual índice você criaria, e o que muda no plano dela?
:::

---

## :icon[circle-check] Solução

A consulta **A** já usa o índice que a chave estrangeira criou em `cliente_id`: lê 12 linhas e filtra `status` nelas. Não precisa de índice novo.

A consulta **B** varre um milhão de linhas e ainda ordena o resultado. O filtro é um intervalo em `data_pedido`:

```sql
CREATE INDEX idx_pedidos_data ON pedidos (data_pedido);
```

| Consulta | type | key | rows | Extra |
|---|---|---|---|---|
| B | `range` | `idx_pedidos_data` | 31.000 | Using index condition; Using filesort |

O `filesort` continua, mas agora ordena 31 mil linhas em vez de um milhão. Um índice em `status` não ajudaria: `aberto` é frequente demais, e A já está rápida.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Criar um índice para cada coluna do `WHERE` sem olhar o `EXPLAIN` antes e depois
- Confundir `index` com "usou o índice bem": ele lê o índice inteiro
- Testar com 4 linhas: o otimizador escolhe `ALL` porque a tabela é minúscula, e o plano muda em produção
- Aplicar função na coluna do filtro e culpar o índice "que não funciona"
- Rodar `EXPLAIN ANALYZE` de uma consulta pesada no servidor de produção
:::

---

## :icon[list-checks] Resumo

:::summary
- O **otimizador** escolhe o plano de menor custo estimado; `EXPLAIN` mostra esse plano sem executar
- Leia `type`, `key`, `rows` e `Extra`; `ALL` com `rows` enorme é o alerta principal
- A escala de `type` vai de `ALL` (pior) a `const` (melhor); `Using filesort` e `Using temporary` pedem índice ou reescrita
- Peça só as colunas necessárias, filtre cedo, indexe `WHERE`, `JOIN` e `ORDER BY`, e não aplique função na coluna indexada
:::

---

## :icon[arrow-right] Próximos passos

O `EXPLAIN` mostra se um índice foi usado. A próxima aula, **Estatísticas e estratégias de índices**, explica como o otimizador toma essa decisão, como um índice é construído por dentro e como escolher o índice certo para um conjunto de consultas.

Faça o quiz antes de avançar.
