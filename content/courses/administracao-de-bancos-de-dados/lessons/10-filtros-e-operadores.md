---
title: Filtros e operadores no WHERE
summary: Compare, busque intervalos, listas, padrões de texto e NULL, e combine condições com AND, OR e NOT.
module: sql-consultas
duration_minutes: 25
objectives:
  - Filtrar linhas com os operadores de comparação, BETWEEN, IN e LIKE
  - Testar valores ausentes com IS NULL e IS NOT NULL
  - Combinar condições com AND, OR e NOT, controlando a precedência com parênteses
---

# Filtros e operadores no WHERE

Administração de Bancos de Dados · Aula 10

---

## O que você vai aprender

:::goal
- Como o `WHERE` decide, linha a linha, o que entra no resultado
- Operadores de comparação, `BETWEEN`, `IN` e `LIKE`
- Por que `= NULL` nunca funciona e o que usar no lugar
- `AND`, `OR`, `NOT` e o papel dos parênteses
:::

---

## :icon[circle-help] Por que isso importa

A gerente da loja pede, em uma única mensagem:

"Quero os produtos de Periféricos ou Monitores que custem até 200, com estoque, e cujo nome comece com M."

Cada pedaço dessa frase é uma **condição**. O `WHERE` é onde você as escreve, e os operadores desta aula são o vocabulário para traduzi-las.

:::question
Quantas condições diferentes você contou nessa frase? Que tipo de comparação cada uma exige?
:::

---

## :icon[funnel] WHERE: uma pergunta por linha

O banco pega **cada linha** da tabela, testa a condição e guarda só as que respondem **verdadeiro**.

```sql
SELECT nome, estoque
FROM produtos
WHERE estoque < 10;
```

:::center
![Animação: as seis linhas de produtos são testadas; Teclado, Mouse e Monitor não atendem a estoque menor que 10 e somem; Cadeira, Notebook e Webcam ficam](images/10-where-filtra-linhas.svg)
:::

| nome | estoque |
|---|---|
| Cadeira ergonômica | 8 |
| Notebook | 5 |
| Webcam | 0 |

---

## :icon[equal] Operadores de comparação

| Operador | Significado | Exemplo |
|---|---|---|
| `=` | igual | `status = 'pago'` |
| `<>` ou `!=` | diferente | `cidade <> 'Recife'` |
| `<` e `<=` | menor, menor ou igual | `preco <= 120` |
| `>` e `>=` | maior, maior ou igual | `estoque >= 12` |

```sql
SELECT nome, preco
FROM produtos
WHERE preco >= 750;
```

| nome | preco |
|---|---|
| Monitor 27" | 900.00 |
| Cadeira ergonômica | 750.00 |
| Notebook | 4200.00 |

:::tip
`<>` é o padrão SQL; `!=` funciona no MySQL, no PostgreSQL e no SQL Server. Escolha um e seja consistente.
:::

---

## :icon[sliders-horizontal] BETWEEN e IN

**`BETWEEN a AND b`** testa um intervalo **fechado**: inclui as duas pontas. Vale para números, datas e texto.

```sql
SELECT nome, preco FROM produtos
WHERE preco BETWEEN 100 AND 200;
```

| nome | preco |
|---|---|
| Teclado | 120.00 |
| Webcam | 180.00 |

**`IN (lista)`** testa se o valor é um dos listados. Substitui uma cadeia de `OR`.

```sql
SELECT nome, cidade FROM clientes
WHERE cidade IN ('Recife', 'Curitiba');
```

| nome | cidade |
|---|---|
| Carla Mendes | Recife |
| Diego Rocha | Curitiba |

Os dois aceitam negação: `NOT BETWEEN`, `NOT IN`.

---

## :icon[percent] LIKE: padrões em texto

`LIKE` compara com um **padrão**. Dois curingas:

| Curinga | Significa | `nome LIKE` | Casa com |
|---|---|---|---|
| `%` | zero ou mais caracteres | `'M%'` | Mouse, Monitor 27" |
| `_` | exatamente um caractere | `'_ouse'` | Mouse |
| os dois | qualquer trecho | `'%cam%'` | Webcam |

```sql
SELECT nome, email
FROM clientes
WHERE email LIKE '%@exemplo.com';
```

Retorna os 5 clientes: todos os e-mails terminam assim.

:::tip
`'M%'` é rápido: o banco pode usar um índice. `'%cam%'` obriga a ler a tabela inteira. Você verá o motivo na aula de índices.
:::

---

## :icon[text] Maiúsculas, acentos e collation

No MySQL 8, a **collation** padrão é `utf8mb4_0900_ai_ci`:

- `ci` (*case insensitive*): `'m%'` também casa com Mouse e Monitor 27"
- `ai` (*accent insensitive*): `'Sao Paulo'` casa com São Paulo

```sql
SELECT nome FROM produtos WHERE nome LIKE 'm%';                      -- Mouse, Monitor 27"
SELECT nome FROM produtos WHERE nome COLLATE utf8mb4_bin LIKE 'm%';  -- nenhuma linha
```

Para diferenciar maiúsculas, use uma collation `_bin` ou `_cs` na comparação.

:::info
No PostgreSQL é o contrário: `LIKE` diferencia maiúsculas por padrão. Lá existe `ILIKE` para ignorá-las.
:::

---

## :icon[circle-help] NULL: ausência de valor

`NULL` não é zero nem texto vazio: é **"não sei"**. Comparar com `NULL` nunca dá verdadeiro nem falso: dá `NULL`.

```sql
SELECT NULL = NULL AS igual, NULL IS NULL AS eh_nulo;
```

| igual | eh_nulo |
|---|---|
| NULL | 1 |

Por isso `WHERE cidade = NULL` devolve **zero linhas, sempre**. O teste certo é `IS NULL` ou `IS NOT NULL`:

```sql
SELECT nome FROM clientes WHERE cidade IS NULL;      -- hoje: nenhuma linha
SELECT nome FROM clientes WHERE cidade IS NOT NULL;  -- os 5 clientes
```

:::warning
`<> NULL` tem o mesmo problema. E uma linha com `NULL` em `preco` não entra em `preco > 100` nem em `preco <= 100`.
:::

---

## :icon[git-branch] AND, OR e NOT

- **`AND`**: todas as condições precisam ser verdadeiras
- **`OR`**: basta uma verdadeira
- **`NOT`**: inverte a condição

```sql
SELECT nome, preco, estoque
FROM produtos
WHERE categoria_id = 1 AND estoque > 0;
```

| nome | preco | estoque |
|---|---|---|
| Teclado | 120.00 | 35 |
| Mouse | 60.00 | 50 |

Webcam é da categoria 1, mas tem estoque 0: falha na segunda condição e sai.

```sql
SELECT id, status FROM pedidos
WHERE NOT status = 'cancelado';   -- o mesmo que status <> 'cancelado'
```

---

## :icon[braces] Precedência: AND antes de OR

Sem parênteses, o banco resolve o **`AND` primeiro**. Isso muda o resultado:

```sql
-- Lê-se: pago (qualquer total) OU (enviado E acima de 500)
SELECT id, status, total FROM pedidos
WHERE status = 'pago' OR status = 'enviado' AND total > 500;
```

| id | status | total |
|---|---|---|
| 1 | pago | 180.00 |
| 2 | enviado | 900.00 |

Com parênteses, `(status = 'pago' OR status = 'enviado') AND total > 500` devolve só o pedido 2: o pedido 1 custa 180.

:::center
![Duas expressões comparadas: sem parênteses, o AND agrupa enviado com total maior que 500 e sobram os pedidos 1 e 2; com parênteses, o OR é avaliado primeiro e sobra só o pedido 2](images/10-precedencia-and-or.svg)
:::

:::tip
Misturou `AND` com `OR`? Use parênteses, mesmo quando não precisar. Quem ler depois agradece.
:::

---

## :icon[flask-conical] Pratique

:::question
1. Liste **nome** e **preço** dos produtos que custam entre 100 e 1000 e **não** são da categoria 1.
2. Liste **id**, **status** e **total** dos pedidos que não estão cancelados e têm total acima de 500.
3. Traduza a frase da gerente: **nome** dos produtos das categorias 1 ou 2, com preço até 200, estoque acima de zero e nome começando com M.

Para cada uma, preveja o número de linhas antes de rodar.
:::

---

## :icon[circle-check] Solução

```sql
-- 1: Monitor 27" (900.00) e Cadeira ergonômica (750.00)
SELECT nome, preco FROM produtos
WHERE preco BETWEEN 100 AND 1000 AND categoria_id <> 1;

-- 2: pedidos 2 (enviado, 900.00) e 3 (aberto, 4200.00)
SELECT id, status, total FROM pedidos
WHERE status <> 'cancelado' AND total > 500;

-- 3: só o Mouse (o Monitor custa 900)
SELECT nome FROM produtos
WHERE categoria_id IN (1, 2) AND preco <= 200
  AND estoque > 0 AND nome LIKE 'M%';
```

Na 3, só há `AND`, então os parênteses são dispensáveis. Se você escrevesse "categoria 1 ou 2" com `OR`, teria que agrupar: `(categoria_id = 1 OR categoria_id = 2) AND ...`.

---

## :icon[triangle-alert] Erros comuns

:::warning
- `WHERE preco = NULL` ou `<> NULL`: resultado sempre vazio. Use `IS NULL` e `IS NOT NULL`
- Misturar `AND` e `OR` sem parênteses e confiar na sorte
- `BETWEEN 200 AND 100` (limites invertidos): nenhuma linha, e nenhum erro para avisar
- `LIKE 'Mouse'` sem curinga funciona como `=`; e `LIKE '%'` sozinho casa com tudo que não é `NULL`
- Esquecer as aspas no `IN`: `IN (Recife, Curitiba)` procura colunas com esses nomes
:::

---

## :icon[list-checks] Resumo

:::summary
- O `WHERE` testa cada linha; só as que dão verdadeiro entram no resultado
- Compare com `=`, `<>`, `<`, `>`, `<=`, `>=`; use `BETWEEN` para intervalos e `IN` para listas
- `LIKE` casa padrões: `%` é qualquer trecho, `_` é um caractere; no MySQL, a collation `_ci` ignora maiúsculas
- `NULL` só se testa com `IS NULL` e `IS NOT NULL`
- `AND` é resolvido antes de `OR`; parênteses deixam a intenção explícita
:::

---

## :icon[arrow-right] Próximos passos

Filtrar é metade do trabalho. Na próxima aula, **Ordenação, apelidos e limites**, você controla a ordem do resultado com `ORDER BY`, renomeia colunas com `AS`, calcula valores direto no `SELECT` e pagina com `LIMIT` e `OFFSET`.

Antes, faça o quiz e teste suas previsões de resultado.
