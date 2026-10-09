---
title: UPDATE e DELETE com segurança
summary: Altere e apague linhas com o WHERE certo, modo seguro, transações e respeito às chaves estrangeiras.
module: sql-manipulacao-e-estrutura
duration_minutes: 30
objectives:
  - Escrever UPDATE com SET, WHERE e expressões sobre o valor atual
  - Apagar linhas com DELETE e distinguir DELETE, TRUNCATE e DROP
  - Aplicar a rotina segura com SELECT antes, transação durante e conferência depois
  - Prever o efeito de uma chave estrangeira ao apagar uma linha referenciada
---

# UPDATE e DELETE com segurança

Administração de Bancos de Dados · Aula 16

---

## O que você vai aprender

:::goal
- Alterar uma ou várias colunas com `UPDATE`, inclusive com expressões
- Remover linhas com `DELETE` e saber quando `TRUNCATE` ou `DROP` entram em cena
- Usar o modo seguro e a rotina "SELECT antes, transação durante, conferir depois"
- Entender o que a chave estrangeira faz quando você apaga um cliente com pedidos
:::

---

## :icon[siren] Por que isso importa

Sexta-feira, 17h. Um analista quer zerar o estoque do notebook, que esgotou. Ele digita:

```sql
UPDATE produtos SET estoque = 0;
```

e aperta Enter antes de escrever o `WHERE`. Em menos de um segundo, **todos** os produtos ficam com estoque zero e o site para de vender.

Não houve erro de sintaxe. O MySQL fez exatamente o que foi pedido.

:::question
O que poderia ter evitado o estrago: uma configuração, um hábito ou os dois?
:::

---

## :icon[pencil] Anatomia do UPDATE

```sql
UPDATE clientes
SET cidade = 'Olinda'
WHERE id = 3;
```

- :icon[table] `UPDATE clientes`: a tabela
- :icon[pencil] `SET cidade = 'Olinda'`: o que muda
- :icon[funnel] `WHERE id = 3`: em quais linhas

O MySQL responde `Rows matched: 1  Changed: 1`. Carla Mendes agora mora em Olinda; os outros quatro clientes continuam iguais.

:::tip
Para mexer em **uma** linha, filtre pela chave primária. É o único filtro que garante uma linha só.
:::

---

## :icon[calculator] Várias colunas e expressões

Separe as atribuições por vírgula. Do lado direito pode ir uma expressão que usa o valor atual da própria linha:

```sql
UPDATE produtos
SET preco = preco * 1.10,
    estoque = estoque + 20
WHERE categoria_id = 1;
```

| id | nome | preco antes | preco depois | estoque depois |
|---|---|---|---|---|
| 1 | Teclado | 120.00 | 132.00 | 55 |
| 2 | Mouse | 60.00 | 66.00 | 70 |
| 6 | Webcam | 180.00 | 198.00 | 20 |

`Rows matched: 3`. Cada linha usa o **seu** preço e o **seu** estoque: a expressão é avaliada linha a linha.

---

## :icon[triangle-alert] O desastre: UPDATE sem WHERE

:::center
![Animação: sem WHERE, as seis linhas de produtos mudam de uma vez; com WHERE id = 5, só o notebook muda](images/16-update-sem-where.svg)
:::

Sem `WHERE`, o alvo é a tabela inteira. O MySQL não pergunta "tem certeza?": responde `Rows matched: 6  Changed: 5` (a webcam já estava com 0) e segue.

Com `WHERE id = 5`, a mesma alteração atinge uma linha: `Rows matched: 1`.

:::danger
Leia a resposta do servidor. Se `Rows matched` for maior do que você esperava, o estrago já aconteceu, e sem transação não há como voltar.
:::

---

## :icon[trash-2] DELETE: com WHERE e sem WHERE

Elisa pediu a exclusão do cadastro. Ela não tem pedidos:

```sql
DELETE FROM clientes WHERE id = 5;
```

`Query OK, 1 row affected`. `DELETE` remove linhas inteiras; para apagar só um valor, use `UPDATE ... SET coluna = NULL`.

Sem `WHERE`, a regra é a mesma do `UPDATE`:

```sql
DELETE FROM funcionarios;
```

`Query OK, 5 rows affected`. A tabela continua existindo, mas vazia.

:::danger
`DELETE` não tem lixeira. Fora de uma transação, a única volta é o backup.
:::

---

## :icon[scale] DELETE, TRUNCATE ou DROP?

Três comandos esvaziam uma tabela; não são a mesma coisa:

| | `DELETE FROM t` | `TRUNCATE TABLE t` | `DROP TABLE t` |
|---|---|---|---|
| Escopo | linhas filtradas ou todas | todas as linhas | a tabela inteira |
| Aceita `WHERE` | sim | não | não |
| `ROLLBACK` desfaz | sim, na transação | não (é DDL) | não (é DDL) |
| `AUTO_INCREMENT` | continua | volta a 1 | some |
| Velocidade | linha a linha | instantâneo | instantâneo |
| Dispara triggers | sim | não | não |

:::tip
`TRUNCATE` falha se outra tabela referencia esta por chave estrangeira. Reserve-o para tabelas de teste ou de carga.
:::

---

## :icon[lock] Modo seguro: SQL_SAFE_UPDATES

```sql
SET SQL_SAFE_UPDATES = 1;

UPDATE produtos SET estoque = 0;
```

`ERROR 1175: You are using safe update mode and you tried to update a table without a WHERE that uses a KEY column.`

Com o modo seguro ligado, o MySQL recusa `UPDATE` e `DELETE` sem `WHERE` em uma coluna com índice (como a chave primária) e sem `LIMIT`. A configuração vale para a sua sessão.

- :icon[monitor] O MySQL Workbench já vem com ele ligado (Edit, Preferences, SQL Editor, Safe Updates)
- :icon[terminal] No cliente de linha de comando, ative com o comando acima

:::tip
É um cinto de segurança, não um piloto automático: ele não impede um `WHERE id = 3` que deveria ser `id = 30`.
:::

---

## :icon[list-checks] A rotina segura

:::center
![Fluxo da rotina segura: SELECT para conferir o filtro, START TRANSACTION, o comando, SELECT de conferência e então COMMIT ou ROLLBACK](images/16-rotina-segura.svg)
:::

:::steps
1. `SELECT` com o **mesmo** `WHERE`: conte as linhas e veja se são as certas
2. `START TRANSACTION;` para abrir uma área provisória
3. Execute o `UPDATE` ou `DELETE` e leia `Rows matched` ou `rows affected`
4. `SELECT` de novo para conferir o resultado
5. `COMMIT;` se estiver certo; `ROLLBACK;` se não estiver
:::

Até o `COMMIT`, nada é definitivo. Você verá como as transações funcionam por dentro na aula "Transações e ACID".

---

## :icon[flask-conical] Pratique

:::example Desafio
Dois pedidos chegaram ao DBA:

1. O Monitor 27" (id 3) entra em promoção: 10% de desconto e estoque reposto para 20 unidades.
2. Diego Rocha (id 4) pediu a exclusão do cadastro. Ele não tem pedidos.

Escreva o roteiro completo seguindo a rotina segura: `SELECT` antes, transação, comandos, conferência e `COMMIT`.
:::

Pense também: o que você faria se o `SELECT` de conferência mostrasse um preço estranho?

---

## :icon[circle-check] Solução

```sql
SELECT id, nome, preco, estoque FROM produtos WHERE id = 3;
SELECT id, nome FROM clientes WHERE id = 4;

START TRANSACTION;
UPDATE produtos SET preco = preco * 0.90, estoque = 20 WHERE id = 3;
DELETE FROM clientes WHERE id = 4;

SELECT id, nome, preco, estoque FROM produtos WHERE id = 3;
SELECT COUNT(*) FROM clientes WHERE id = 4;
COMMIT;
```

| id | nome | preco | estoque |
|---|---|---|---|
| 3 | Monitor 27" | 810.00 | 20 |

O `COUNT(*)` devolve 0. Se o preço estivesse errado, a resposta seria `ROLLBACK;`, e a tabela voltaria ao estado anterior.

---

## :icon[link] A chave estrangeira na hora de apagar

Ana Souza (id 1) tem os pedidos 1 e 3. Tente apagá-la:

```sql
DELETE FROM clientes WHERE id = 1;
```

`ERROR 1451: Cannot delete or update a parent row: a foreign key constraint fails`

:::center
![Chave estrangeira ao apagar um cliente com pedidos: RESTRICT bloqueia o DELETE; ON DELETE CASCADE apaga os pedidos junto](images/16-fk-ao-apagar.svg)
:::

| Opção da FK | Ao apagar Ana |
|---|---|
| `RESTRICT` (padrão) | erro; nada é apagado |
| `ON DELETE CASCADE` | apaga Ana **e** os pedidos 1 e 3 |
| `ON DELETE SET NULL` | pedidos ficariam com `cliente_id = NULL` (impossível aqui: a coluna é `NOT NULL`) |

Quem escolhe a opção é quem cria a tabela. Você fará isso na aula "CREATE TABLE, tipos e constraints".

---

## :icon[triangle-alert] Erros comuns

:::warning
- Executar `UPDATE` ou `DELETE` antes de terminar de escrever o `WHERE`
- Filtrar por nome ou cidade quando a intenção era uma única linha: use a chave primária
- Usar `AND` no lugar de vírgula para separar colunas no `SET`
- Confiar que `TRUNCATE` ou `DROP` podem ser desfeitos com `ROLLBACK`
- Esquecer que `ON DELETE CASCADE` apaga em outras tabelas, não só na que você mirou
:::

---

## :icon[list-checks] Resumo

:::summary
- `UPDATE tabela SET coluna = valor WHERE condição` altera; a expressão no `SET` usa o valor atual da linha
- `DELETE FROM tabela WHERE condição` remove linhas inteiras; sem `WHERE`, os dois comandos atingem a tabela toda
- `TRUNCATE` e `DROP` são DDL: rápidos, sem `WHERE` e sem `ROLLBACK`
- Modo seguro (`SQL_SAFE_UPDATES`) e a rotina `SELECT` antes, transação durante, conferência depois protegem contra o `WHERE` esquecido
- A chave estrangeira impede (`RESTRICT`) ou propaga (`CASCADE`) a exclusão
:::

---

## :icon[arrow-right] Próximos passos

Você já cria, altera e apaga dados. Falta construir o lugar onde eles moram. Na próxima aula, "CREATE TABLE, tipos e constraints", você define colunas, tipos e as regras (`NOT NULL`, `UNIQUE`, `CHECK`, `FOREIGN KEY`) que até agora só esbarraram no seu caminho.

Antes, faça o quiz e teste a rotina segura na memória.
