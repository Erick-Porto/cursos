---
title: Funções agregadas e GROUP BY
summary: Resumir linhas com COUNT, SUM e AVG, agrupar com GROUP BY e filtrar grupos com HAVING.
module: sql-consultas
duration_minutes: 25
objectives:
  - Calcular totais, médias e contagens com funções agregadas
  - Agrupar linhas com GROUP BY respeitando a regra das colunas agrupadas
  - Filtrar grupos com HAVING e distinguir de WHERE
  - Descrever a ordem lógica de execução de um SELECT
---

# Funções agregadas e GROUP BY

Administração de Bancos de Dados · Aula 12

---

## O que você vai aprender

:::goal
- Resumir muitas linhas em um só número com `COUNT`, `SUM`, `AVG`, `MIN` e `MAX`
- Calcular esses resumos por grupo com `GROUP BY`
- Filtrar grupos com `HAVING` sem confundir com `WHERE`
- Ler um `SELECT` na ordem em que o banco o executa
:::

---

## :icon[chart-bar] Por que isso importa

A gerente da loja pergunta:

- :icon[coins] Quanto faturamos em março?
- :icon[users] Quantos clientes temos em cada cidade?
- :icon[trending-up] Qual cliente mais gastou?

Um `SELECT` comum devolve linhas, uma por pedido. Ela quer **números que resumem** essas linhas.

:::question
Como você responderia "quanto faturamos?" tendo só a tabela `pedidos`, com um valor por pedido?
:::

---

## :icon[sigma] Funções agregadas

Uma **função agregada** recebe um conjunto de linhas e devolve **um único valor**.

| Função | Devolve |
|---|---|
| `COUNT(*)` | quantas linhas |
| `SUM(coluna)` | a soma |
| `AVG(coluna)` | a média |
| `MIN(coluna)` / `MAX(coluna)` | o menor / o maior valor |

```sql
SELECT COUNT(*) AS pedidos, SUM(total) AS faturamento,
       ROUND(AVG(total), 2) AS ticket_medio, MAX(total) AS maior
FROM pedidos;
```

| pedidos | faturamento | ticket_medio | maior |
|---|---|---|---|
| 4 | 5340.00 | 1335.00 | 4200.00 |

---

## :icon[circle-help] COUNT(*) ou COUNT(coluna)?

`COUNT(*)` conta linhas. `COUNT(coluna)` conta só as linhas em que a coluna **não é NULL**. `COUNT(DISTINCT coluna)` conta valores diferentes.

```sql
SELECT COUNT(*) AS linhas,
       COUNT(cidade) AS com_cidade,
       COUNT(DISTINCT cidade) AS cidades
FROM clientes;
```

| linhas | com_cidade | cidades |
|---|---|---|
| 5 | 5 | 4 |

Bruno e Elisa moram em São Paulo, por isso são 4 cidades para 5 clientes.

:::info
Se a cidade de Diego fosse `NULL`, `com_cidade` cairia para 4 e `linhas` continuaria 5. `SUM`, `AVG`, `MIN` e `MAX` também ignoram `NULL`.
:::

---

## :icon[boxes] GROUP BY: um resumo por grupo

Sem `GROUP BY`, a função agregada resume a tabela inteira. Com ele, o banco separa as linhas em **grupos**, um por valor da coluna, e calcula o resumo **dentro de cada grupo**.

:::center
![Diagrama: as quatro linhas de pedidos são separadas em três baldes, um por cliente_id, e cada balde vira uma linha do resultado com a contagem e a soma](images/12-group-by-baldes.svg)
:::

Cada balde vira **uma linha** do resultado.

---

## :icon[code] GROUP BY na prática

```sql
SELECT cliente_id, COUNT(*) AS pedidos, SUM(total) AS gasto
FROM pedidos
GROUP BY cliente_id;
```

| cliente_id | pedidos | gasto |
|---|---|---|
| 1 | 2 | 4380.00 |
| 2 | 1 | 900.00 |
| 3 | 1 | 60.00 |

Ana (cliente 1) tem dois pedidos: 180,00 + 4.200,00. Diego e Elisa não aparecem: sem pedido, não há linha para agrupar.

:::tip
Você pode agrupar por mais de uma coluna: `GROUP BY cliente_id, status` cria um grupo para cada combinação.
:::

---

## :icon[scale] A regra das colunas agrupadas

Toda coluna do `SELECT` que **não** está dentro de uma função agregada precisa estar no `GROUP BY`.

```sql
SELECT departamento_id, nome, AVG(salario)
FROM funcionarios
GROUP BY departamento_id;
-- ERROR 1055: 'nome' is not in GROUP BY clause ...
-- this is incompatible with sql_mode=only_full_group_by
```

:::question
O departamento de TI tem Marcos e Júlia. Qual `nome` o banco deveria mostrar na linha de TI?
:::

Não há resposta certa, por isso o MySQL 8 recusa a consulta (modo `ONLY_FULL_GROUP_BY`, ligado por padrão). Tire `nome` do `SELECT` ou acrescente-o ao `GROUP BY`.

---

## :icon[funnel] HAVING: filtrando grupos

`WHERE` filtra linhas antes de agrupar e **não aceita** funções agregadas. Para filtrar pelo resultado do resumo, use `HAVING`, que roda **depois** do `GROUP BY`.

```sql
SELECT departamento_id, ROUND(AVG(salario), 2) AS media
FROM funcionarios
GROUP BY departamento_id
HAVING AVG(salario) > 6000;
```

| departamento_id | media |
|---|---|
| 1 | 7850.00 |
| 2 | 6250.00 |

O Financeiro (média 5400,00) formou um grupo, mas foi descartado pelo `HAVING`.

---

## :icon[arrow-left-right] WHERE ou HAVING?

| | `WHERE` | `HAVING` |
|---|---|---|
| Filtra | linhas | grupos |
| Roda | antes do `GROUP BY` | depois do `GROUP BY` |
| Aceita agregação | não | sim |

Os dois podem aparecer juntos:

```sql
SELECT cliente_id, SUM(total) AS gasto
FROM pedidos
WHERE status <> 'cancelado'
GROUP BY cliente_id
HAVING SUM(total) > 500;
```

| cliente_id | gasto |
|---|---|
| 1 | 4380.00 |
| 2 | 900.00 |

O pedido cancelado de Carla saiu no `WHERE`; o grupo dela nem chegou a existir.

---

## :icon[workflow] A ordem em que o banco lê sua consulta

Você escreve `SELECT` primeiro, mas o banco executa nesta ordem:

:::center
![Diagrama em seis etapas: FROM escolhe as tabelas, WHERE filtra linhas, GROUP BY forma grupos, HAVING filtra grupos, SELECT calcula as colunas e ORDER BY ordena](images/12-ordem-logica.svg)
:::

Isso explica dois detalhes:

- :icon[funnel] `WHERE` não pode usar agregação: os grupos ainda não existem
- :icon[tag] `WHERE` não conhece apelidos do `SELECT`; `ORDER BY` conhece, porque roda depois

:::tip
`LIMIT` entra por último, depois do `ORDER BY`.
:::

---

## :icon[flask-conical] Pratique

:::example
Com o banco `loja`, escreva as consultas:

1. Quantos produtos e qual estoque total cada categoria (`categoria_id`) tem, só para categorias com mais de um produto.
2. O faturamento (`SUM(total)`) por `status` de pedido, do maior para o menor.
:::

Antes de executar, preveja o resultado olhando as tabelas.

---

## :icon[circle-check] Solução

```sql
SELECT categoria_id, COUNT(*) AS produtos, SUM(estoque) AS estoque
FROM produtos
GROUP BY categoria_id
HAVING COUNT(*) > 1;
```

| categoria_id | produtos | estoque |
|---|---|---|
| 1 | 3 | 85 |

Só Periféricos tem mais de um produto: Teclado, Mouse e Webcam (35 + 50 + 0).

```sql
SELECT status, SUM(total) AS faturamento
FROM pedidos
GROUP BY status
ORDER BY faturamento DESC;
```

| status | faturamento |
|---|---|
| aberto | 4200.00 |
| enviado | 900.00 |
| pago | 180.00 |
| cancelado | 60.00 |

---

## :icon[triangle-alert] Erros comuns

:::warning
- Colocar no `SELECT` uma coluna que não está no `GROUP BY` nem em agregação: erro 1055
- Usar `WHERE COUNT(*) > 1`: agregação só funciona em `HAVING`
- Confiar em `COUNT(coluna)` para contar linhas: ele pula `NULL`
- Esquecer que `AVG` ignora `NULL`: a média de (10, NULL, 20) é 15, não 10
- Agrupar por `nome` quando duas pessoas podem ter o mesmo nome; agrupe pelo `id`
:::

---

## :icon[list-checks] Resumo

:::summary
- Funções agregadas (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`) transformam muitas linhas em um valor
- `COUNT(*)` conta linhas; `COUNT(coluna)` ignora `NULL`
- `GROUP BY` forma um grupo por valor e aplica a agregação em cada um
- Toda coluna fora de agregação precisa estar no `GROUP BY`
- `WHERE` filtra linhas antes de agrupar; `HAVING` filtra grupos depois
:::

---

## :icon[arrow-right] Próximos passos

Até agora cada consulta usou uma tabela só. Para mostrar o **nome** do cliente ao lado do total gasto, você precisa combinar `clientes` e `pedidos`.

Na próxima aula, **Combinando tabelas com JOIN**, você aprende a fazer exatamente isso.

Antes, faça o quiz desta aula para fixar `GROUP BY` e `HAVING`.
