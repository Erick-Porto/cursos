---
title: Inserindo dados com INSERT
summary: Adicione linhas com INSERT usando lista de colunas, NULL e DEFAULT, várias linhas, INSERT ... SELECT e constraints.
module: sql-manipulacao-e-estrutura
duration_minutes: 25
objectives:
  - Explicar o que é DML e por que ele exige cuidado
  - Escrever INSERT com lista de colunas, valores especiais e várias linhas
  - Copiar linhas de outra tabela com INSERT ... SELECT
  - Interpretar erros de constraint e recuperar o id gerado com LAST_INSERT_ID()
---

# Inserindo dados com INSERT

Administração de Bancos de Dados · Aula 15

---

## O que você vai aprender

:::goal
- O que é DML e por que ele merece mais cuidado que o `SELECT`
- Como escrever um `INSERT` que não depende da ordem das colunas
- Como `NULL`, `DEFAULT`, `AUTO_INCREMENT` e datas entram em uma linha nova
- O que o MySQL faz quando uma regra da tabela é violada
:::

---

## :icon[siren] Por que isso importa

Até aqui você só **leu** dados. Agora vai **criá-los**.

Na loja, cada cliente novo, cada pedido e cada produto do catálogo nasce de um `INSERT`. Se ele estiver errado, o erro fica gravado: cliente duplicado, pedido sem cliente, preço zerado.

- :icon[eye] `SELECT` é o radiologista: olha, analisa e não altera nada
- :icon[stethoscope] `INSERT`, `UPDATE` e `DELETE` são o cirurgião: intervêm no paciente

:::question
Quantos `INSERT` acontecem quando você finaliza uma compra online? Pense em pedido, itens, pagamento e nota fiscal.
:::

---

## :icon[layers] DML: a família que altera dados

**DML** (Data Manipulation Language) é o grupo de comandos SQL que muda o conteúdo das tabelas: `INSERT` cria linhas, `UPDATE` altera, `DELETE` remove.

:::center
![As quatro famílias do SQL: DQL lê dados, DML altera dados, DDL altera a estrutura e TCL controla transações](images/15-familias-sql.svg)
:::

Com o `autocommit` ligado (padrão do MySQL), um comando DML grava assim que termina. Não existe botão de desfazer. Por isso a atenção dobra.

---

## :icon[circle-plus] Anatomia do INSERT

```sql
INSERT INTO clientes (nome, email, cidade)
VALUES ('Fábio Nunes', 'fabio@exemplo.com', 'Belo Horizonte');
```

:::center
![Anatomia do INSERT: cada coluna da lista recebe o valor que está na mesma posição em VALUES](images/15-anatomia-insert.svg)
:::

Três partes: a **tabela**, a **lista de colunas** e os **valores**, na mesma ordem da lista. O MySQL responde `Query OK, 1 row affected`.

Texto e datas vão entre aspas simples; números, não.

---

## :icon[list-ordered] Com e sem lista de colunas

::::columns
:::col
**Recomendado**: a lista diz onde cada valor vai.

```sql
INSERT INTO produtos (nome, preco, estoque, categoria_id)
VALUES ('Headset', 250.00, 10, 1);
```
:::
:::col
**Frágil**: sem lista, você dá um valor para **todas** as colunas, na ordem do `CREATE TABLE`.

```sql
INSERT INTO produtos
VALUES (NULL, 'Headset', 250.00, 10, 1);
```
:::
::::

Se alguém acrescentar uma coluna à tabela, a forma sem lista quebra ou grava valores nas colunas erradas. A forma com lista continua funcionando.

---

## :icon[variable] NULL, DEFAULT e AUTO_INCREMENT

```sql
INSERT INTO clientes (nome, email, cidade)
VALUES ('Gabriela Reis', 'gabriela@exemplo.com', NULL);
```

| id | nome | email | cidade | criado_em |
|---|---|---|---|---|
| 7 | Gabriela Reis | gabriela@exemplo.com | NULL | 2025-03-15 10:42:07 |

- :icon[circle-minus] `NULL` grava "sem valor" em `cidade`, que aceita nulos
- :icon[hash] `id` ficou de fora: a coluna é `AUTO_INCREMENT`, o MySQL gera o próximo número
- :icon[clock] `criado_em` ficou de fora: a coluna tem `DEFAULT CURRENT_TIMESTAMP`

Para pedir o padrão de forma explícita, escreva a palavra `DEFAULT` no lugar do valor.

---

## :icon[hash] O id nasce sozinho

```sql
INSERT INTO produtos (nome, preco, estoque, categoria_id)
VALUES ('Headset', 250.00, 10, 1);

SELECT LAST_INSERT_ID();
```

:::center
![Animação: uma nova linha entra no fim da tabela produtos e o MySQL preenche o id 7 pelo AUTO_INCREMENT](images/15-nova-linha.svg)
:::

| LAST_INSERT_ID() |
|---|
| 7 |

`LAST_INSERT_ID()` devolve o id gerado pelo **seu** último `INSERT`, nesta conexão. Outros usuários inserindo ao mesmo tempo não interferem.

:::info
No PostgreSQL, o mesmo resultado vem com `INSERT ... RETURNING id`.
:::

---

## :icon[calendar] Datas e horas

O MySQL espera `'AAAA-MM-DD'` para `DATE` e `'AAAA-MM-DD HH:MM:SS'` para `DATETIME`. Para "agora", use funções:

| Função | Devolve |
|---|---|
| `CURDATE()` | só a data de hoje |
| `NOW()` ou `CURRENT_TIMESTAMP` | data e hora atuais |

```sql
INSERT INTO pedidos (cliente_id, data_pedido)
VALUES (2, CURDATE());
```

| id | cliente_id | data_pedido | status | total |
|---|---|---|---|---|
| 5 | 2 | 2025-03-15 | aberto | 0.00 |

Bruno fez um novo pedido hoje, o de número 5. `status` e `total` vieram dos seus `DEFAULT`.

---

## :icon[rows-3] Várias linhas de uma vez

Separe cada conjunto de valores por vírgula. Um comando, uma ida ao servidor, três linhas:

```sql
INSERT INTO produtos (nome, preco, estoque, categoria_id) VALUES
  ('Mousepad', 45.00, 40, 1),
  ('Monitor 24"', 650.00, 9, 2),
  ('Mesa reta', 480.00, 4, 3);
```

`Query OK, 3 rows affected`. Os ids 8, 9 e 10 saem em sequência.

Para copiar linhas que já existem em outra tabela, troque `VALUES` por um `SELECT`:

```sql
CREATE TABLE produtos_backup LIKE produtos;

INSERT INTO produtos_backup
SELECT * FROM produtos;
```

O `SELECT` pode ter `WHERE` e `JOIN`; só precisa devolver colunas na mesma quantidade e ordem das colunas de destino. `CREATE TABLE ... LIKE` cria uma cópia vazia da estrutura.

---

## :icon[shield] Quando uma regra é violada

A linha é **rejeitada inteira**: nada é gravado. A constraint protegeu os dados.

| Regra | O que você tentou | O MySQL responde |
|---|---|---|
| `NOT NULL` | `nome` como `NULL` em produtos | `Column 'nome' cannot be null` (1048) |
| `UNIQUE` | repetir `ana@exemplo.com` em clientes | `Duplicate entry 'ana@exemplo.com' for key 'clientes.email'` (1062) |
| `FOREIGN KEY` | `categoria_id = 99`, que não existe | `Cannot add or update a child row: a foreign key constraint fails` (1452) |
| `CHECK` | `preco = -5` em produtos | `Check constraint 'produtos_chk_1' is violated` (3819) |

:::tip
Coluna `NOT NULL` sem `DEFAULT` esquecida? `Field 'preco' doesn't have a default value` (1364).
:::

---

## :icon[flask-conical] Pratique

:::example Desafio
A loja vai vender produtos de áudio.

1. Crie a categoria `Áudio`.
2. Insira dois produtos nela em um único comando, sem digitar o id da categoria à mão: Fone bluetooth (320.00, estoque 15) e Caixa de som (199.90, estoque 20).
3. Confira o resultado com um `SELECT`.
:::

Escreva os três comandos antes de ver a solução. Dica: `LAST_INSERT_ID()` pode aparecer dentro de `VALUES`.

---

## :icon[circle-check] Solução

```sql
INSERT INTO categorias (nome) VALUES ('Áudio');

INSERT INTO produtos (nome, preco, estoque, categoria_id) VALUES
  ('Fone bluetooth', 320.00, 15, LAST_INSERT_ID()),
  ('Caixa de som', 199.90, 20, LAST_INSERT_ID());

SELECT id, nome, preco, categoria_id
FROM produtos
WHERE categoria_id = 5;
```

| id | nome | preco | categoria_id |
|---|---|---|---|
| 11 | Fone bluetooth | 320.00 | 5 |
| 12 | Caixa de som | 199.90 | 5 |

`LAST_INSERT_ID()` vale 5 (o id de Áudio) nas duas linhas: o valor só muda quando o segundo `INSERT` termina.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Omitir a lista de colunas e confiar na ordem da tabela
- Digitar o `id` à mão em coluna `AUTO_INCREMENT`: funciona hoje e colide amanhã
- Escrever a data como `'15/03/2025'`; o MySQL quer `'2025-03-15'`
- Esquecer as aspas simples em textos e datas, ou colocá-las em números
- Confundir `NULL` (sem valor) com `''` (texto vazio) ou `0`
:::

---

## :icon[list-checks] Resumo

:::summary
- DML (`INSERT`, `UPDATE`, `DELETE`) altera o conteúdo das tabelas; com `autocommit`, grava na hora
- `INSERT INTO tabela (colunas) VALUES (...)` é a forma segura: cada valor tem endereço certo
- Omita colunas `AUTO_INCREMENT` e com `DEFAULT`; use `NULL` só onde a coluna aceita
- Várias linhas vão em um só comando, por `VALUES (...), (...)` ou por `INSERT ... SELECT`
- Uma constraint violada rejeita a linha inteira; `LAST_INSERT_ID()` devolve o id que o MySQL gerou
:::

---

## :icon[arrow-right] Próximos passos

Criar linhas é só o começo. Na próxima aula, "UPDATE e DELETE com segurança", você vai alterar e apagar dados sem levar a tabela inteira junto: a cláusula `WHERE` vira questão de sobrevivência.

Antes disso, faça o quiz desta aula e confira se o `INSERT` ficou claro.
