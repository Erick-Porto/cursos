---
title: Combinando tabelas com JOIN
summary: INNER, LEFT e RIGHT JOIN para reunir dados de tabelas relacionadas, e como emular o FULL no MySQL.
module: sql-consultas
duration_minutes: 30
objectives:
  - Escrever um INNER JOIN com a cláusula ON ligando chave primária e estrangeira
  - Usar LEFT JOIN para manter linhas sem correspondência e identificá-las com IS NULL
  - Encadear JOINs entre três ou mais tabelas usando apelidos
  - Reconhecer o produto cartesiano e as colunas ambíguas
---

# Combinando tabelas com JOIN

Administração de Bancos de Dados · Aula 13

---

## O que você vai aprender

:::goal
- Por que os dados vivem em tabelas separadas e como reuni-los
- `INNER JOIN`, `LEFT JOIN` e `RIGHT JOIN`, e o `FULL OUTER JOIN` que o MySQL não tem
- Apelidos de tabela e JOINs entre três ou mais tabelas
- As armadilhas: produto cartesiano e colunas ambíguas
:::

---

## :icon[puzzle] Por que isso importa

A tabela `pedidos` guarda só o `cliente_id`, não o nome:

| id | cliente_id | data_pedido | total |
|---|---|---|---|
| 1 | 1 | 2025-03-02 | 180.00 |
| 2 | 2 | 2025-03-05 | 900.00 |
| 3 | 1 | 2025-03-09 | 4200.00 |
| 4 | 3 | 2025-03-11 | 60.00 |

Isso é a normalização funcionando: o nome fica em um lugar só, em `clientes`. Mas o relatório precisa de "Bruno Lima, pedido 2, R$ 900,00".

:::question
Como juntar o nome que está em `clientes` com o total que está em `pedidos`?
:::

---

## :icon[key-round] A cláusula ON e os apelidos

Um **JOIN** combina linhas de duas tabelas. A cláusula `ON` diz **como** elas se encontram: quase sempre, chave primária de um lado igual à chave estrangeira do outro.

```sql
SELECT c.nome, p.id, p.total
FROM clientes AS c
JOIN pedidos AS p ON p.cliente_id = c.id;
```

- `clientes AS c` cria o **apelido** `c` (o `AS` é opcional)
- Depois de apelidar, use só o apelido: `c.nome`, não `clientes.nome`
- `p.cliente_id = c.id` liga cada pedido ao seu cliente

---

## :icon[layers] Os tipos de JOIN: INNER e LEFT

:::center
![Dois diagramas de conjuntos: INNER JOIN destaca só a interseção entre A e B; LEFT JOIN destaca todo o conjunto A, com ou sem par em B](images/13-tipos-de-join-a.svg)
:::

- :icon[combine] **INNER**: só as linhas que têm par nas duas tabelas
- :icon[arrow-left] **LEFT**: todas da esquerda, com ou sem par

A tabela da **esquerda** (A) é a do `FROM`; a da **direita** (B) é a do `JOIN`.

---

## :icon[layers] Os tipos de JOIN: RIGHT e FULL OUTER

:::center
![Dois diagramas de conjuntos: RIGHT JOIN destaca todo o conjunto B, com ou sem par em A; FULL OUTER JOIN destaca A e B inteiros](images/13-tipos-de-join-b.svg)
:::

- :icon[arrow-right] **RIGHT**: todas da direita, com ou sem par
- :icon[git-merge] **FULL OUTER**: todas de ambas; o MySQL não tem, mas dá para emular com `UNION`

---

## :icon[combine] INNER JOIN: só quem tem par

`JOIN` sozinho significa `INNER JOIN`. Clientes sem pedido não aparecem; pedidos sem cliente também não.

```sql
SELECT c.nome, p.id AS pedido, p.total
FROM clientes c
INNER JOIN pedidos p ON p.cliente_id = c.id
ORDER BY p.id;
```

| nome | pedido | total |
|---|---|---|
| Ana Souza | 1 | 180.00 |
| Bruno Lima | 2 | 900.00 |
| Ana Souza | 3 | 4200.00 |
| Carla Mendes | 4 | 60.00 |

Ana aparece duas vezes porque tem dois pedidos. Diego e Elisa não aparecem.

---

## :icon[arrow-left] LEFT JOIN: todos da esquerda

`LEFT JOIN` mantém **todas** as linhas da tabela da esquerda. Quando não há par, as colunas da direita vêm como `NULL`.

```sql
SELECT c.nome, p.id AS pedido, p.total
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id
ORDER BY c.id, p.id;
```

| nome | pedido | total |
|---|---|---|
| Ana Souza | 1 | 180.00 |
| Ana Souza | 3 | 4200.00 |
| Bruno Lima | 2 | 900.00 |
| Carla Mendes | 4 | 60.00 |
| Diego Rocha | NULL | NULL |
| Elisa Prado | NULL | NULL |

---

## :icon[eye] Linha a linha: quem encontra par

:::center
![Animação: cada linha de clientes procura em pedidos uma linha com o mesmo id; Ana, Bruno e Carla se ligam aos seus pedidos, enquanto Diego e Elisa ficam sem par e recebem NULL no LEFT JOIN](images/13-join-linha-a-linha.svg)
:::

Esse `NULL` é útil: ele marca quem **nunca comprou**.

```sql
SELECT c.nome
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id
WHERE p.id IS NULL;
```

| nome |
|---|
| Diego Rocha |
| Elisa Prado |

---

## :icon[arrow-right] RIGHT JOIN: todos da direita

É o espelho do `LEFT JOIN`: mantém todas as linhas da tabela da **direita** (a do `JOIN`).

```sql
SELECT c.nome, p.id AS pedido
FROM pedidos p
RIGHT JOIN clientes c ON p.cliente_id = c.id;
```

O resultado é o mesmo do `LEFT JOIN` anterior: todos os clientes, com `NULL` para Diego e Elisa.

:::tip
Quase todo `RIGHT JOIN` pode virar um `LEFT JOIN` trocando a ordem das tabelas. Padronize no `LEFT`: a tabela "principal" fica no `FROM` e a consulta fica mais fácil de ler.
:::

---

## :icon[git-merge] FULL OUTER JOIN: o MySQL não tem

O `FULL OUTER JOIN` traria todas as linhas das duas tabelas. O MySQL 8 **não o implementa**; emule com a união de um `LEFT` e um `RIGHT`:

```sql
SELECT c.nome, p.id AS pedido
FROM clientes c LEFT JOIN pedidos p ON p.cliente_id = c.id
UNION
SELECT c.nome, p.id
FROM clientes c RIGHT JOIN pedidos p ON p.cliente_id = c.id;
```

`UNION` descarta as linhas repetidas (as que tinham par nos dois lados).

:::info
No PostgreSQL, `FULL OUTER JOIN` existe e funciona direto. Aqui, como `cliente_id` é chave estrangeira obrigatória, não há pedido órfão e o resultado é igual ao do `LEFT JOIN`. Ele faz diferença quando os dois lados podem ter linhas sem par, como em dados importados de planilhas.
:::

---

## :icon[network] JOINs múltiplos

Para chegar ao nome do produto de um pedido, o caminho passa por três ligações. Suponha que o pedido 1 (pago, 180,00) tenha dois itens: 1 Teclado (120,00) e 1 Mouse (60,00).

```sql
SELECT c.nome AS cliente, pr.nome AS produto, i.quantidade
FROM pedidos p
JOIN clientes c ON c.id = p.cliente_id
JOIN itens_pedido i ON i.pedido_id = p.id
JOIN produtos pr ON pr.id = i.produto_id
WHERE p.status = 'pago';
```

| cliente | produto | quantidade |
|---|---|---|
| Ana Souza | Teclado | 1 |
| Ana Souza | Mouse | 1 |

Cada `JOIN` acrescenta uma tabela e seu próprio `ON`. O `WHERE` continua filtrando o conjunto final.

---

## :icon[flask-conical] Pratique

:::example
1. Liste cada produto com o **nome da categoria** e o estoque, usando `produtos` e `categorias`.
2. Mostre cada cliente com a quantidade de pedidos e o total gasto, **incluindo** quem nunca comprou (com 0 e 0.00). Ordene do maior gasto para o menor.
:::

Dica para o item 2: combine o `LEFT JOIN` com `GROUP BY` e pense no que `COUNT(*)` faria com as linhas de `NULL`.

---

## :icon[circle-check] Solução

```sql
SELECT p.nome, c.nome AS categoria, p.estoque
FROM produtos p
JOIN categorias c ON c.id = p.categoria_id;
```

Seis linhas, como `Teclado | Periféricos | 35` e `Notebook | Computadores | 5`.

```sql
SELECT c.nome, COUNT(p.id) AS pedidos, COALESCE(SUM(p.total), 0) AS gasto
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id
GROUP BY c.id, c.nome
ORDER BY gasto DESC, c.nome;
```

| nome | pedidos | gasto |
|---|---|---|
| Ana Souza | 2 | 4380.00 |
| Bruno Lima | 1 | 900.00 |
| Carla Mendes | 1 | 60.00 |
| Diego Rocha | 0 | 0.00 |
| Elisa Prado | 0 | 0.00 |

`COUNT(p.id)` ignora o `NULL` de Diego e Elisa; `COUNT(*)` daria 1 para eles. `COALESCE` troca o `NULL` da soma por 0.

---

## :icon[triangle-alert] Armadilhas

:::warning
- :icon[grid-2x2] Esquecer o `ON` (ou usar `CROSS JOIN`): cada cliente combina com cada pedido, 5 × 4 = 20 linhas sem sentido. É o **produto cartesiano**
- :icon[circle-help] `SELECT id` com duas tabelas que têm `id`: erro 1052, coluna **ambígua**. Prefixe sempre: `c.id`
- :icon[funnel] Filtrar a tabela da direita no `WHERE` (`WHERE p.status = 'pago'`) descarta as linhas com `NULL` e transforma o `LEFT JOIN` em `INNER`. Coloque a condição no `ON`
- :icon[sigma] `COUNT(*)` depois de `LEFT JOIN` conta 1 para quem não tem par; use `COUNT(p.id)`
:::

---

## :icon[list-checks] Resumo

:::summary
- `JOIN ... ON` combina linhas de duas tabelas pela chave que elas compartilham
- `INNER JOIN` devolve só as linhas com par; `LEFT JOIN` mantém todas da esquerda, com `NULL` onde não há par
- `RIGHT JOIN` é o espelho do `LEFT`; o `FULL OUTER JOIN` não existe no MySQL e se emula com `UNION`
- Apelidos encurtam a consulta e evitam colunas ambíguas
- Cada tabela a mais é mais um `JOIN` com seu próprio `ON`
:::

---

## :icon[arrow-right] Próximos passos

Com `JOIN` você combina tabelas lado a lado. Às vezes, porém, uma pergunta depende da resposta de outra: "quais produtos custam mais que a média?" exige calcular a média primeiro.

A próxima aula, **Subconsultas**, mostra como aninhar um `SELECT` dentro de outro para resolver isso.

Faça o quiz desta aula antes de seguir.
