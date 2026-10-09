---
title: Subconsultas
summary: Aninhar um SELECT dentro de outro com IN, EXISTS, ANY e ALL, e saber quando um JOIN é mais claro.
module: sql-consultas
duration_minutes: 25
objectives:
  - Identificar onde uma subconsulta pode aparecer e que forma de resultado ela devolve
  - Aplicar IN, NOT IN, EXISTS, ANY e ALL com subconsultas
  - Distinguir subconsultas independentes de correlacionadas
  - Escolher entre subconsulta e JOIN pela clareza da consulta
---

# Subconsultas

Administração de Bancos de Dados · Aula 14

---

## O que você vai aprender

:::goal
- O que é uma subconsulta e onde ela pode aparecer: `WHERE`, `FROM` e `SELECT`
- As três formas de resultado: um valor, uma lista ou uma tabela
- Os operadores `IN`, `NOT IN`, `EXISTS`, `ANY` e `ALL`
- A diferença entre subconsulta independente e correlacionada, e quando preferir um `JOIN`
:::

---

## :icon[circle-help] Por que isso importa

"Quais produtos custam mais que a média?"

Para responder, você precisa de dois passos:

:::steps
1. Descobrir a média: `SELECT AVG(preco) FROM produtos` devolve 1035.00
2. Filtrar: `SELECT nome FROM produtos WHERE preco > 1035.00`
:::

Funciona, mas o valor 1035.00 fica **colado** na consulta. Amanhã, com preços novos, ela estará errada.

:::question
Como fazer o banco calcular a média e usá-la na mesma consulta?
:::

---

## :icon[braces] O que é uma subconsulta

Uma **subconsulta** é um `SELECT` escrito entre parênteses dentro de outro comando. O banco resolve a de dentro e usa o resultado na de fora.

```sql
SELECT nome, preco
FROM produtos
WHERE preco > (SELECT AVG(preco) FROM produtos);
```

| nome | preco |
|---|---|
| Notebook | 4200.00 |

Só o Notebook passa de 1035.00. Se os preços mudarem, a consulta continua certa. Ela pode aparecer em três lugares:

| Onde | Para quê |
|---|---|
| `WHERE` | comparar ou filtrar por um resultado |
| `FROM` | tratar o resultado como uma tabela (**tabela derivada**) |
| `SELECT` | calcular uma coluna extra por linha |

---

## :icon[shapes] Três formas de resultado

:::center
![Três formas de resultado de subconsulta: escalar (uma linha e uma coluna, usada com comparações), lista (várias linhas e uma coluna, usada com IN, ANY e ALL) e tabela (várias linhas e colunas, usada no FROM com apelido)](images/14-formas-de-subconsulta.svg)
:::

- :icon[hash] **Escalar**: 1 linha, 1 coluna. Use com `=`, `>`, `<`. Se vier mais de uma linha: erro 1242
- :icon[list] **Lista**: N linhas, 1 coluna. Use com `IN`, `ANY`, `ALL`
- :icon[table] **Tabela**: N linhas, M colunas. Use no `FROM`, sempre com apelido

---

## :icon[list] IN e NOT IN

`IN` testa se o valor está na lista devolvida pela subconsulta.

```sql
SELECT nome
FROM clientes
WHERE id NOT IN (SELECT cliente_id FROM pedidos);
```

| nome |
|---|
| Diego Rocha |
| Elisa Prado |

A lista é (1, 2, 1, 3); sobram os ids 4 e 5. Com `IN` no lugar de `NOT IN`, viriam Ana, Bruno e Carla.

:::warning
Se a lista contiver um `NULL`, `NOT IN` não devolve **nenhuma** linha: `4 <> NULL` é desconhecido, não verdadeiro. Em colunas que aceitam `NULL`, acrescente `WHERE coluna IS NOT NULL` na subconsulta ou prefira `NOT EXISTS`.
:::

---

## :icon[search-check] EXISTS e NOT EXISTS

`EXISTS` pergunta só uma coisa: a subconsulta devolve **alguma** linha? Por isso o que vai no `SELECT` dela não importa; `SELECT 1` é o costume.

```sql
SELECT c.nome
FROM clientes c
WHERE NOT EXISTS (
  SELECT 1 FROM pedidos p WHERE p.cliente_id = c.id
);
```

| nome |
|---|
| Diego Rocha |
| Elisa Prado |

Mesmo resultado do `NOT IN`, com duas vantagens: `NULL` não o engana e o banco para na primeira linha encontrada.

---

## :icon[scale] ANY e ALL

Comparam um valor com **cada** item da lista.

```sql
-- mais caro que TODOS os periféricos (categoria 1)
SELECT nome, preco FROM produtos
WHERE preco > ALL (SELECT preco FROM produtos WHERE categoria_id = 1);
```

| nome | preco |
|---|---|
| Monitor 27" | 900.00 |
| Cadeira ergonômica | 750.00 |
| Notebook | 4200.00 |

Os periféricos custam 120, 60 e 180; `> ALL` equivale a `> 180`.

| Expressão | Equivale a |
|---|---|
| `> ALL (lista)` | maior que o máximo |
| `> ANY (lista)` | maior que o mínimo |
| `= ANY (lista)` | `IN (lista)` |

---

## :icon[workflow] Independente ou correlacionada

:::center
![Fluxo de execução: a subconsulta independente roda uma vez e entrega um valor à consulta externa; a correlacionada recebe um valor de cada linha externa, roda de novo e devolve verdadeiro ou falso](images/14-correlacionada-vs-independente.svg)
:::

- **Independente**: não cita a consulta de fora. Roda **uma vez**; você pode executá-la sozinha. Ex.: `(SELECT AVG(preco) FROM produtos)`
- **Correlacionada**: usa uma coluna de fora, como `c.id`. Roda **para cada linha** externa; sozinha, não faz sentido. Ex.: o `NOT EXISTS` com `p.cliente_id = c.id`

:::tip
Para reconhecer: tente rodar a subconsulta isolada. Se ela reclamar de uma coluna desconhecida, é correlacionada.
:::

---

## :icon[table] Subconsulta no FROM e no SELECT

No `FROM`, o resultado vira uma **tabela derivada** e precisa de apelido:

```sql
SELECT ROUND(AVG(t.gasto), 2) AS media_por_cliente
FROM (
  SELECT cliente_id, SUM(total) AS gasto
  FROM pedidos
  GROUP BY cliente_id
) AS t;
```

| media_por_cliente |
|---|
| 1780.00 |

É a média dos gastos 4380, 900 e 60. Sem o `AS t`: erro 1248. No `SELECT`, uma subconsulta escalar correlacionada cria uma coluna por linha:

```sql
SELECT c.nome,
       (SELECT COUNT(*) FROM pedidos p WHERE p.cliente_id = c.id) AS pedidos
FROM clientes c;
```

Devolve 2, 1, 1, 0 e 0 para Ana, Bruno, Carla, Diego e Elisa.

---

## :icon[arrow-left-right] Subconsulta ou JOIN?

"Clientes sem pedido" tem mais de uma resposta correta. Além do `NOT EXISTS`, o `LEFT JOIN` resolve:

```sql
SELECT c.nome
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.id
WHERE p.id IS NULL;
```

| Prefira | Quando |
|---|---|
| Subconsulta | a pergunta tem um "passo antes": média, máximo, existe? |
| `JOIN` | você precisa de colunas das duas tabelas no resultado |

:::info
O otimizador do MySQL 8 reescreve a maioria dos `IN` e `EXISTS` como uma junção interna (semijoin) e funde tabelas derivadas simples na consulta externa. O desempenho costuma empatar; escolha pela clareza e confirme com `EXPLAIN`, assunto da aula **Planos de execução com EXPLAIN**.
:::

---

## :icon[flask-conical] Pratique

:::example
1. Liste os produtos da mesma categoria que a Webcam, sem digitar o número da categoria.
2. Liste as categorias que têm **algum** produto com estoque zero.
3. Liste os funcionários que ganham mais que a média do **próprio** departamento.
:::

Dica: a 1 é escalar, a 2 pede `EXISTS` e a 3 é correlacionada.

---

## :icon[circle-check] Solução

```sql
SELECT nome FROM produtos
WHERE categoria_id = (SELECT categoria_id FROM produtos WHERE nome = 'Webcam');
```

Teclado, Mouse e Webcam (categoria 1).

```sql
SELECT c.nome FROM categorias c
WHERE EXISTS (SELECT 1 FROM produtos p
              WHERE p.categoria_id = c.id AND p.estoque = 0);
```

Periféricos: a Webcam está com estoque 0.

```sql
SELECT f.nome, f.salario FROM funcionarios f
WHERE f.salario > (SELECT AVG(salario) FROM funcionarios
                   WHERE departamento_id = f.departamento_id);
```

Marcos Silva (9500 contra a média 7850 de TI) e Renata Dias (8700 contra 6250 de Vendas). Tiago empata com a média do Financeiro e fica de fora.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Subconsulta escalar que devolve mais de uma linha: `ERROR 1242 Subquery returns more than 1 row`. Use `IN`, `ANY` ou garanta uma linha só
- `NOT IN` com `NULL` na lista: resultado vazio, sem aviso
- Tabela derivada sem apelido: `ERROR 1248 Every derived table must have its own alias`
- Subconsulta correlacionada em tabela grande sem índice na coluna de ligação: roda milhares de vezes e demora
- Subconsulta no `SELECT` para buscar várias colunas de outra tabela: um `JOIN` fica mais claro
:::

---

## :icon[list-checks] Resumo

:::summary
- Uma subconsulta é um `SELECT` entre parênteses dentro de outro, no `WHERE`, no `FROM` ou no `SELECT`
- Ela devolve um valor (compare com `=`, `>`), uma lista (`IN`, `ANY`, `ALL`) ou uma tabela (`FROM ... AS t`)
- `EXISTS` testa se há alguma linha e não se confunde com `NULL`; `NOT IN` se confunde
- A independente roda uma vez; a correlacionada roda para cada linha externa
- Subconsulta e `JOIN` muitas vezes se equivalem: escolha a mais legível
:::

---

## :icon[arrow-right] Próximos passos

Este foi o último passo do módulo **SQL: consultas**: você já filtra, ordena, agrupa, combina tabelas e aninha consultas.

O próximo módulo, **SQL: manipulação e estrutura**, começa pela aula **Inserindo dados com INSERT**: hora de colocar linhas novas no banco, não só lê-las.

Faça o quiz para fechar o módulo.
