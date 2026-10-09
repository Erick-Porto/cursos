---
title: Tabelas temporárias
summary: Rascunhos que vivem só na sua sessão para quebrar consultas complexas em etapas.
module: programacao-no-banco
duration_minutes: 25
objectives:
  - Explicar o que é uma tabela temporária e seu ciclo de vida na sessão
  - Criar tabelas temporárias com CREATE TEMPORARY TABLE e com AS SELECT
  - Escolher entre tabela temporária, CTE e derived table
  - Reconhecer as limitações do MySQL e aplicar boas práticas
---

# Tabelas temporárias

Administração de Bancos de Dados · Aula 25

---

## O que você vai aprender

:::goal
- O que é uma tabela temporária e por que ela é o "rascunho" do SQL
- Como criá-la com `CREATE TEMPORARY TABLE` e com `AS SELECT`
- Quando preferir uma CTE ou uma derived table
- As limitações do MySQL e as boas práticas que evitam surpresas
:::

---

## :icon[lightbulb] Por que isso importa

A gerência pede: "quem são os clientes que mais gastam, e o que eles compram?". Você escreve uma consulta com três `JOIN`, `GROUP BY` e `HAVING`. Ela devolve números estranhos. Qual etapa errou?

Consultas grandes são difíceis de conferir. Em qualquer outro trabalho você usaria um **rascunho**: guarda o resultado parcial, confere, segue para a próxima etapa.

:::question
Onde guardar o resultado de uma etapa para conferir e reaproveitar em várias consultas, sem criar uma tabela de verdade no banco?
:::

---

## :icon[notebook-pen] Um rascunho dentro do banco

Uma **tabela temporária** é uma tabela em quase tudo: colunas, tipos, `INSERT`, `SELECT`, `JOIN`. A diferença é a vida: ela existe só na sua **sessão** (a conexão atual) e some quando você desconecta.

```sql
CREATE TEMPORARY TABLE tmp_gastos (
  cliente_id INT PRIMARY KEY,
  total_gasto DECIMAL(10,2) NOT NULL
);

INSERT INTO tmp_gastos
SELECT cliente_id, SUM(total)
FROM pedidos
WHERE status <> 'cancelado'
GROUP BY cliente_id;

SELECT * FROM tmp_gastos;
```

| cliente_id | total_gasto |
|---|---|
| 1 | 4380.00 |
| 2 | 900.00 |

Nada mudou em `pedidos`: o rascunho vive à parte.

---

## :icon[history] O ciclo de vida

:::center
![Ciclo de vida: a sessão A conecta, cria tmp_gastos, usa a tabela e, ao desconectar, ela some; a sessão B, ao mesmo tempo, recebe ERROR 1146 porque não enxerga a tabela da outra sessão](images/25-ciclo-de-vida.svg)
:::

- :icon[plus] Nasce no `CREATE TEMPORARY TABLE`
- :icon[eye] Só a sessão que criou enxerga; outra recebe `ERROR 1146: Table 'loja.tmp_gastos' doesn't exist`
- :icon[trash-2] Some no `DROP TEMPORARY TABLE` ou, sozinha, quando a conexão termina

Duas sessões podem criar `tmp_gastos` ao mesmo tempo: são duas tabelas diferentes, e uma não interfere na outra.

---

## :icon[scale] Permanente ou temporária?

| | Permanente | Temporária |
|---|---|---|
| Vive até | um `DROP TABLE` | o fim da sessão |
| Quem enxerga | todas as sessões | só quem criou |
| `SHOW TABLES` | aparece | não aparece |
| Backup com `mysqldump` | incluída | ignorada |
| `FOREIGN KEY` | aceita | não aceita |

As duas aceitam `INSERT`, `UPDATE`, `DELETE`, índices e `JOIN` com qualquer outra tabela.

:::tip
Prefixo `tmp_` no nome. Assim ninguém, nem você daqui a um mês, confunde o rascunho com a tabela de verdade.
:::

---

## :icon[zap] Criar e preencher de uma vez

Com `AS SELECT`, o MySQL deduz as colunas e os tipos do resultado e já grava as linhas. É o **CTAS** (create table as select): um comando no lugar de dois.

```sql
DROP TEMPORARY TABLE IF EXISTS tmp_gastos;   -- limpa a versão anterior

CREATE TEMPORARY TABLE tmp_gastos AS
SELECT cliente_id, SUM(total) AS total_gasto
FROM pedidos
WHERE status <> 'cancelado'
GROUP BY cliente_id;
```

O conteúdo é o mesmo da versão em duas etapas, mas sem chave primária e sem índice: `AS SELECT` copia dados, não estrutura.

:::tip
Quando o tipo exato ou a chave importam, crie a estrutura primeiro e preencha com `INSERT ... SELECT`.
:::

---

## :icon[layers] Relatório em etapas

O rascunho fica na sessão, então cada etapa seguinte é uma consulta curta, fácil de ler e de conferir.

```sql
-- Etapa 2: quem são esses clientes
SELECT c.nome, g.total_gasto
FROM tmp_gastos g
JOIN clientes c ON c.id = g.cliente_id
ORDER BY g.total_gasto DESC;

-- Etapa 3: o mesmo rascunho, outra pergunta
SELECT AVG(total_gasto) AS media FROM tmp_gastos;
```

| nome | total_gasto |
|---|---|
| Ana Souza | 4380.00 |
| Bruno Lima | 900.00 |

A média devolve `2640.00`. A agregação pesada rodou uma vez; as consultas seguintes só leram o rascunho.

---

## :icon[braces] Dentro de uma procedure

Relatórios que rodam todo dia costumam virar procedure. A tabela temporária entra como área de trabalho:

```sql
DELIMITER $$
CREATE PROCEDURE sp_relatorio_gastos(IN p_minimo DECIMAL(10,2))
BEGIN
  DROP TEMPORARY TABLE IF EXISTS tmp_gastos;
  CREATE TEMPORARY TABLE tmp_gastos AS
    SELECT cliente_id, SUM(total) AS total_gasto
    FROM pedidos WHERE status <> 'cancelado' GROUP BY cliente_id;
  SELECT c.nome, g.total_gasto
  FROM tmp_gastos g JOIN clientes c ON c.id = g.cliente_id
  WHERE g.total_gasto >= p_minimo
  ORDER BY g.total_gasto DESC;
  DROP TEMPORARY TABLE tmp_gastos;
END $$
DELIMITER ;
```

`CALL sp_relatorio_gastos(1000)` devolve só Ana Souza. O `DROP ... IF EXISTS` no início permite chamar duas vezes na mesma sessão; o `DROP` no fim libera a memória assim que o relatório sai.

---

## :icon[git-branch] Alternativas: CTE e derived table

Para um único comando, o SQL moderno tem rascunhos que dispensam o `CREATE`:

```sql
WITH gastos AS (
  SELECT cliente_id, SUM(total) AS total_gasto
  FROM pedidos
  WHERE status <> 'cancelado'
  GROUP BY cliente_id
)
SELECT c.nome, g.total_gasto
FROM gastos g
JOIN clientes c ON c.id = g.cliente_id;
```

A **CTE** (`WITH`) dá nome a um resultado que vive só neste comando. A **derived table** é a mesma ideia escrita dentro do `FROM`: `FROM (SELECT ...) AS g`. Nenhuma das duas sobrevive ao `;`.

:::center
![Alcance de cada rascunho: a derived table vale dentro de uma subconsulta, a CTE dentro de um comando e a tabela temporária durante a sessão inteira](images/25-escopos-de-rascunho.svg)
:::

---

## :icon[ban] Limitações no MySQL

```sql
SELECT a.cliente_id, b.cliente_id
FROM tmp_gastos a
JOIN tmp_gastos b ON b.total_gasto > a.total_gasto;
```

Resultado: `ERROR 1137 (HY000): Can't reopen table: 'a'`. As regras do MySQL 8:

- :icon[copy] A mesma temporária **não** pode aparecer duas vezes na mesma consulta: nem em self-join, nem no `FROM` e numa subconsulta
- :icon[eye-off] Não aparece em `SHOW TABLES` nem em `information_schema.tables`
- :icon[unlink] Não aceita `FOREIGN KEY`
- :icon[shield] Exige o privilégio `CREATE TEMPORARY TABLES`
- :icon[layers] Com o **mesmo nome** de uma permanente, ela esconde a permanente na sua sessão até o `DROP`

:::info
No PostgreSQL a temporária pode ser lida duas vezes na mesma consulta e aceita `ON COMMIT DROP`, que a apaga no fim da transação.
:::

---

## :icon[shield-check] Boas práticas

```sql
DROP TEMPORARY TABLE IF EXISTS tmp_gastos;
CREATE TEMPORARY TABLE tmp_gastos (
  cliente_id INT PRIMARY KEY,
  total_gasto DECIMAL(10,2) NOT NULL,
  INDEX idx_total (total_gasto)
);
```

:::tip
- Comece com `DROP TEMPORARY TABLE IF EXISTS`: o script roda de novo sem `ERROR 1050`, e a palavra `TEMPORARY` garante que nenhuma tabela permanente seja apagada por engano
- Prefixo `tmp_` no nome
- Índice quando a tabela for grande e entrar em `JOIN` ou `WHERE`
- `DROP` ao terminar: em conexões reaproveitadas por um pool, a sessão não acaba quando você acha
- Rascunho de milhões de linhas pesa no tablespace temporário do servidor, para todos. Avalie uma tabela de trabalho permanente
:::

---

## :icon[flask-conical] Pratique

Suponha os itens dos pedidos: o pedido 1 tem 1 Teclado e 1 Mouse; o 2, 1 Monitor 27"; o 3, 1 Notebook; o 4, 1 Mouse.

:::question
**1. Produtos mais vendidos.** Crie `tmp_vendas_produto` com `AS SELECT`, contendo `produto_id`, `nome` e `quantidade_vendida` (soma de `quantidade` em `itens_pedido`). Depois liste os produtos do mais vendido ao menos vendido.

**2. Clientes VIP.** Crie `tmp_clientes_vip` com `cliente_id`, `nome` e `total_gasto` dos clientes que somam mais de 500 em pedidos não cancelados. Use a tabela para listar `id`, `data_pedido` e `total` dos pedidos desses clientes, com o nome de cada um.
:::

Confira cada rascunho com `SELECT *` antes de seguir para a etapa seguinte.

---

## :icon[circle-check] Solução 1

```sql
DROP TEMPORARY TABLE IF EXISTS tmp_vendas_produto;
CREATE TEMPORARY TABLE tmp_vendas_produto AS
SELECT p.id AS produto_id, p.nome, SUM(i.quantidade) AS quantidade_vendida
FROM itens_pedido i
JOIN produtos p ON p.id = i.produto_id
GROUP BY p.id, p.nome;

SELECT nome, quantidade_vendida
FROM tmp_vendas_produto
ORDER BY quantidade_vendida DESC, nome;
```

| nome | quantidade_vendida |
|---|---|
| Mouse | 2 |
| Monitor 27" | 1 |
| Notebook | 1 |
| Teclado | 1 |

A Webcam e a Cadeira não aparecem: nunca foram vendidas. Para excluir o pedido cancelado, junte `pedidos` e filtre `status` na primeira etapa; o rascunho muda sem tocar na consulta final.

---

## :icon[circle-check] Solução 2

```sql
DROP TEMPORARY TABLE IF EXISTS tmp_clientes_vip;
CREATE TEMPORARY TABLE tmp_clientes_vip AS
SELECT c.id AS cliente_id, c.nome, SUM(p.total) AS total_gasto
FROM clientes c
JOIN pedidos p ON p.cliente_id = c.id
WHERE p.status <> 'cancelado'
GROUP BY c.id, c.nome
HAVING SUM(p.total) > 500;

SELECT p.id, p.data_pedido, p.total, v.nome
FROM pedidos p
JOIN tmp_clientes_vip v ON v.cliente_id = p.cliente_id
ORDER BY v.nome, p.data_pedido;
```

| id | data_pedido | total | nome |
|---|---|---|---|
| 1 | 2025-03-02 | 180.00 | Ana Souza |
| 3 | 2025-03-09 | 4200.00 | Ana Souza |
| 2 | 2025-03-05 | 900.00 | Bruno Lima |

Carla não entrou: seu único pedido foi cancelado. O pedido 1, de 180, aparece porque o filtro de 500 é sobre o cliente, não sobre o pedido.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Criar a tabela em uma conexão e consultar em outra: cada aba do Workbench pode ser uma sessão diferente
- Usar a mesma temporária duas vezes na consulta e receber `ERROR 1137: Can't reopen table`
- Rodar o script pela segunda vez sem `DROP ... IF EXISTS` e parar no `ERROR 1050: Table already exists`
- Dar à temporária o nome de uma tabela real e passar uma hora consultando o rascunho achando que é a tabela
- Confiar que `AS SELECT` trouxe chave primária e índices: ele copia só os dados
:::

---

## :icon[list-checks] Resumo

:::summary
- Uma **tabela temporária** é um rascunho que vive só na sua sessão e some ao desconectar
- `CREATE TEMPORARY TABLE` define a estrutura; `AS SELECT` cria e preenche de uma vez, sem chaves nem índices
- Ela quebra consultas longas em etapas que você confere e reaproveita, inclusive dentro de procedures
- Para um único comando, prefira uma **CTE** (`WITH`) ou uma derived table
- No MySQL, não use a mesma temporária duas vezes na consulta e comece sempre com `DROP TEMPORARY TABLE IF EXISTS`
:::

---

## :icon[arrow-right] Próximos passos

Procedures, triggers e tabelas temporárias já estão na sua caixa de ferramentas. Na próxima aula, **Laboratório: A Forja do Destino**, tudo isso entra em campo de uma vez: um mundo de RPG inteiro para povoar, proteger e consultar com SQL.

Antes, faça o quiz: ele cobra o ciclo de vida, o `AS SELECT` e as limitações do MySQL.
