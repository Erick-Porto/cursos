---
title: Ordenação, apelidos e limites
summary: Ordene resultados, renomeie colunas, calcule no SELECT, pagine com LIMIT e OFFSET e elimine repetições.
module: sql-consultas
duration_minutes: 25
objectives:
  - Ordenar resultados por uma ou mais colunas com ORDER BY
  - Renomear colunas e tabelas com AS e usar expressões e funções no SELECT
  - Limitar e paginar resultados com LIMIT e OFFSET e remover repetições com DISTINCT
  - Aplicar boas práticas de formatação e legibilidade em consultas
---

# Ordenação, apelidos e limites

Administração de Bancos de Dados · Aula 11

---

## O que você vai aprender

:::goal
- `ORDER BY` com `ASC`, `DESC`, várias colunas e `NULL`
- Apelidos com `AS` e por que o `WHERE` não os enxerga
- Cálculos e funções simples direto no `SELECT`
- `LIMIT`, `OFFSET`, `DISTINCT` e boas práticas de escrita
:::

---

## :icon[circle-help] Por que isso importa

A gerente quer um relatório pequeno para a reunião:

| produto | preco_unitario | valor_em_estoque |
|---|---|---|
| Notebook | 4200.00 | 21000.00 |
| Monitor 27" | 900.00 | 10800.00 |
| Cadeira ergonômica | 750.00 | 6000.00 |

Três linhas, cabeçalhos legíveis, uma coluna calculada, do mais caro ao mais barato. Você ainda não sabe escrever essa consulta. No fim da aula, vai saber.

:::question
Que partes do `SELECT` você já conhece e quais ainda faltam para produzir isso?
:::

---

## :icon[arrow-up-down] ORDER BY: ASC e DESC

Sem `ORDER BY`, a ordem das linhas **não é garantida**: o banco devolve na ordem que achar mais rápida.

```sql
SELECT nome, preco
FROM produtos
ORDER BY preco DESC;
```

| nome | preco |
|---|---|
| Notebook | 4200.00 |
| Monitor 27" | 900.00 |
| Cadeira ergonômica | 750.00 |
| Webcam | 180.00 |
| Teclado | 120.00 |
| Mouse | 60.00 |

`ASC` (crescente) é o padrão; `DESC` inverte. Texto ordena em ordem alfabética; datas, da mais antiga à mais recente.

:::info
No MySQL, `NULL` conta como o menor valor: vem primeiro em `ASC` e por último em `DESC`. No PostgreSQL é o contrário, e lá existem `NULLS FIRST` e `NULLS LAST`.
:::

---

## :icon[arrow-down-a-z] Ordenar por várias colunas

A segunda coluna é o **desempate** da primeira. Cada uma pode ter o próprio sentido.

```sql
SELECT nome, categoria_id, preco
FROM produtos
ORDER BY categoria_id ASC, preco DESC;
```

| nome | categoria_id | preco |
|---|---|---|
| Webcam | 1 | 180.00 |
| Teclado | 1 | 120.00 |
| Mouse | 1 | 60.00 |
| Monitor 27" | 2 | 900.00 |
| Cadeira ergonômica | 3 | 750.00 |
| Notebook | 4 | 4200.00 |

Dentro da categoria 1, os produtos ficam do mais caro ao mais barato. Nas outras, só há um produto.

:::tip
Precisa de uma ordem estável entre execuções? Termine com uma coluna única, como `id`.
:::

---

## :icon[tag] Apelidos com AS

`AS` dá um **apelido** a uma coluna ou a uma tabela. O apelido da coluna vira o cabeçalho do resultado.

```sql
SELECT p.nome AS produto, p.preco AS preco_unitario
FROM produtos AS p
WHERE p.estoque = 0;
```

| produto | preco_unitario |
|---|---|
| Webcam | 180.00 |

- Para colunas, o `AS` é opcional, mas deixa claro o que você quis
- Para tabelas, o apelido encurta a consulta: `p.nome` em vez de `produtos.nome`. Será essencial nos `JOIN`s
- Apelido com espaço ou acento exige crases: ``AS `preço unitário` ``. Evite

---

## :icon[workflow] O apelido não vale no WHERE

O `WHERE` roda **antes** do `SELECT`, então o apelido ainda não existe quando ele é avaliado.

```sql
SELECT nome, preco * estoque AS valor_estoque
FROM produtos
WHERE valor_estoque > 5000;
-- ERROR 1054: Unknown column 'valor_estoque' in 'where clause'
```

:::center
![Linha do tempo da execução: FROM, WHERE, SELECT, ORDER BY e LIMIT; o apelido nasce no SELECT, o WHERE não o conhece e o ORDER BY já o aceita](images/11-apelido-e-ordem-de-execucao.svg)
:::

Repita a expressão no `WHERE`. No `ORDER BY`, que roda depois, o apelido funciona:

```sql
SELECT nome, preco * estoque AS valor_estoque
FROM produtos
WHERE preco * estoque > 5000
ORDER BY valor_estoque DESC;
```

| nome | valor_estoque |
|---|---|
| Notebook | 21000.00 |
| Monitor 27" | 10800.00 |
| Cadeira ergonômica | 6000.00 |

---

## :icon[calculator] Expressões e funções no SELECT

Qualquer coluna do resultado pode ser uma **expressão**: cálculo, função ou texto fixo. Dê um apelido, senão o cabeçalho vira a própria fórmula.

```sql
SELECT nome,
       preco * estoque AS valor_estoque,
       ROUND(preco * 0.9, 2) AS com_desconto
FROM produtos
WHERE categoria_id = 1;
```

| nome | valor_estoque | com_desconto |
|---|---|---|
| Teclado | 4200.00 | 108.00 |
| Mouse | 3000.00 | 54.00 |
| Webcam | 0.00 | 162.00 |

| Função | Exemplo | Resultado |
|---|---|---|
| `CONCAT` | `CONCAT(nome, ' - ', cidade)` | Ana Souza - Rio de Janeiro |
| `UPPER` | `UPPER(nome)` | ANA SOUZA |
| `NOW()` | `SELECT NOW();` | data e hora do servidor |

---

## :icon[skip-forward] LIMIT e OFFSET: paginação

`LIMIT n` devolve as **n primeiras** linhas; `OFFSET k` pula as **k primeiras** antes de contar. Juntos, fazem páginas.

```sql
SELECT nome, preco
FROM produtos
ORDER BY preco DESC
LIMIT 2 OFFSET 2;   -- página 2, com 2 por página
```

| nome | preco |
|---|---|
| Cadeira ergonômica | 750.00 |
| Webcam | 180.00 |

:::center
![Seis produtos ordenados por preço divididos em três páginas de dois itens: OFFSET 0, 2 e 4](images/11-paginacao-limit-offset.svg)
:::

:::warning
`LIMIT` sem `ORDER BY` devolve "duas linhas quaisquer", e a página pode mudar entre execuções. O MySQL também aceita `LIMIT 2, 2`: ali o **primeiro** número é o OFFSET. Prefira a forma com `OFFSET`, que é a mesma do PostgreSQL.
:::

---

## :icon[copy] DISTINCT: sem repetições

`DISTINCT` elimina linhas repetidas **do resultado**. A tabela não muda.

```sql
SELECT DISTINCT cidade
FROM clientes
ORDER BY cidade;
```

| cidade |
|---|
| Curitiba |
| Recife |
| Rio de Janeiro |
| São Paulo |

São Paulo aparece uma vez, embora Bruno e Elisa morem lá.

:::warning
`DISTINCT` olha a **linha inteira**, não só a primeira coluna. `SELECT DISTINCT cidade, nome` devolve os 5 clientes, porque cada combinação é única.
:::

---

## :icon[thumbs-up] Boas práticas iniciais

```sql
-- Periféricos em estoque, do mais caro ao mais barato
SELECT p.nome  AS produto,
       p.preco AS preco_unitario
FROM produtos AS p
WHERE p.categoria_id = 1
  AND p.estoque > 0
ORDER BY p.preco DESC
LIMIT 20;
```

- :icon[text] Palavras-chave em MAIÚSCULAS, nomes em `snake_case`, uma cláusula por linha
- :icon[tag] Apelidos que dizem o que a coluna significa
- :icon[eye-off] Nada de `SELECT *` em código de aplicação
- :icon[flask-conical] Em tabelas grandes, teste com `LIMIT` antes de rodar a consulta inteira
- :icon[pencil] Um comentário dizendo a intenção, não repetindo o código

---

## :icon[flask-conical] Pratique

:::question
Escreva a consulta do relatório da gerente: os **3 produtos mais caros que têm estoque**, com as colunas `produto`, `preco_unitario` e `valor_em_estoque` (preço vezes estoque), do mais caro ao mais barato.

Antes de rodar: a Webcam pode aparecer? Por quê?
:::

---

## :icon[circle-check] Solução

```sql
SELECT nome            AS produto,
       preco           AS preco_unitario,
       preco * estoque AS valor_em_estoque
FROM produtos
WHERE estoque > 0
ORDER BY preco DESC
LIMIT 3;
```

| produto | preco_unitario | valor_em_estoque |
|---|---|---|
| Notebook | 4200.00 | 21000.00 |
| Monitor 27" | 900.00 | 10800.00 |
| Cadeira ergonômica | 750.00 | 6000.00 |

A Webcam fica de fora pelo `WHERE estoque > 0`, não pelo `LIMIT`. Se a lista fosse dos mais baratos, a diferença apareceria.

:::tip
`ORDER BY valor_em_estoque DESC` também é aceito: o apelido já existe quando o `ORDER BY` roda. Mas o pedido foi "mais caros", então a ordem certa é por `preco`.
:::

---

## :icon[triangle-alert] Erros comuns

:::warning
- Confiar na ordem sem `ORDER BY`, principalmente com `LIMIT`
- Usar o apelido no `WHERE` e receber "Unknown column"
- `LIMIT 2, 2` achando que o primeiro número é o limite: é o OFFSET
- Esquecer o apelido numa expressão e receber um cabeçalho como `preco * estoque`
- Achar que `DISTINCT` vale só para a primeira coluna
:::

---

## :icon[list-checks] Resumo

:::summary
- `ORDER BY` define a ordem; `ASC` é o padrão, `DESC` inverte, e a segunda coluna desempata
- `AS` renomeia colunas e tabelas; o `WHERE` roda antes do `SELECT` e não vê o apelido, o `ORDER BY` vê
- O `SELECT` aceita expressões e funções: `preco * estoque`, `ROUND`, `CONCAT`, `UPPER`, `NOW()`
- `LIMIT` corta e `OFFSET` pula: juntos, com `ORDER BY`, fazem paginação
- `DISTINCT` remove linhas repetidas do resultado, olhando todas as colunas
:::

---

## :icon[arrow-right] Próximos passos

Você já escreve consultas completas: filtra, ordena, calcula e pagina. Na próxima aula, **Funções agregadas e GROUP BY**, você passa de "quais linhas" para "quantas e quanto": `COUNT`, `SUM`, `AVG`, `MIN`, `MAX` e totais por categoria.

Antes, faça o quiz e tente reproduzir o relatório da gerente de cabeça.
