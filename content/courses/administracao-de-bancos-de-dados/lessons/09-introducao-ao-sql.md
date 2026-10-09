---
title: Introdução ao SQL
summary: O que é SQL, suas famílias de comandos e a anatomia de um SELECT, com os primeiros exemplos.
module: sql-consultas
duration_minutes: 20
objectives:
  - Explicar o que é SQL e distinguir o padrão ANSI dos dialetos
  - Reconhecer as cinco famílias de comandos (DQL, DML, DDL, DCL e TCL)
  - Identificar as cláusulas de um SELECT e a ordem em que o banco as executa
  - Escrever consultas simples com SELECT, FROM e WHERE
---

# Introdução ao SQL

Administração de Bancos de Dados · Aula 09

---

## O que você vai aprender

:::goal
- O que é SQL, para que serve e por que cada SGBD fala um "sotaque" diferente
- As cinco famílias de comandos e onde cada uma aparece no curso
- A anatomia de um `SELECT`: o que você escreve e o que o banco executa
- Suas primeiras consultas no banco `loja`
:::

---

## :icon[circle-help] Por que isso importa

Nas aulas de modelagem você desenhou tabelas. Agora elas existem no MySQL, cheias de dados, e alguém pergunta:

- Quais produtos estão sem estoque?
- Quais clientes moram em São Paulo?
- Quanto vendemos em março?

Abrir a tabela e procurar na mão não escala. Você precisa de uma forma de **perguntar ao banco** e receber só o que interessa.

:::question
Se o banco entendesse português, como você pediria "o nome e o preço dos produtos sem estoque"?
:::

---

## :icon[terminal] O que é SQL

**SQL** (Structured Query Language) é a linguagem padrão para conversar com bancos relacionais.

Ela é **declarativa**: você diz **o que** quer, e o SGBD decide **como** buscar.

```sql
SELECT nome, preco
FROM produtos
WHERE estoque = 0;
```

| nome | preco |
|---|---|
| Webcam | 180.00 |

Com SQL você consulta dados, altera dados, define a estrutura do banco e controla quem acessa o quê. Tudo com a mesma linguagem.

---

## :icon[globe] SQL padrão e dialetos

O **SQL padrão** (ANSI/ISO) define a base: `SELECT`, `WHERE`, `JOIN`, tipos de dados. Cada SGBD implementa o padrão com extensões próprias: o seu **dialeto**.

| Recurso | MySQL | PostgreSQL | SQL Server |
|---|---|---|---|
| Limitar linhas | `LIMIT 5` | `LIMIT 5` | `TOP 5` |
| Numeração automática | `AUTO_INCREMENT` | `SERIAL` | `IDENTITY` |
| Texto ignora maiúsculas? | sim, por padrão | não | depende da collation |
| Data e hora atual | `NOW()` | `NOW()` | `GETDATE()` |

O `SELECT` básico é quase idêntico em todos. Este curso usa **MySQL 8.0**.

---

## :icon[map] As cinco famílias de comandos

:::center
![Mapa das cinco famílias de comandos SQL, DQL, DML, DDL, DCL e TCL, com os comandos de cada uma](images/09-familias-de-comandos-sql.svg)
:::

- **DQL** consulta: `SELECT`
- **DML** manipula dados: `INSERT`, `UPDATE`, `DELETE`
- **DDL** define a estrutura: `CREATE`, `ALTER`, `DROP`, `TRUNCATE`
- **DCL** controla acesso: `GRANT`, `REVOKE`
- **TCL** controla transações: `COMMIT`, `ROLLBACK`, `SAVEPOINT`

:::info
Este módulo é todo DQL. Os módulos seguintes percorrem DML e DDL, depois TCL, e DCL aparece quando tratarmos de segurança e auditoria. Você vai usar as cinco famílias.
:::

---

## :icon[search] Anatomia de um SELECT

```sql
SELECT nome, preco        -- quais colunas
FROM produtos             -- de qual tabela
WHERE estoque > 0         -- quais linhas
ORDER BY preco DESC       -- em que ordem
LIMIT 3;                  -- quantas linhas
```

| nome | preco |
|---|---|
| Notebook | 4200.00 |
| Monitor 27" | 900.00 |
| Cadeira ergonômica | 750.00 |

Só `SELECT` e `FROM` são obrigatórios. As outras cláusulas são opcionais, mas sempre nessa ordem de escrita.

---

## :icon[workflow] Ordem de escrita e ordem de execução

Você escreve `SELECT` primeiro, mas o banco **começa pelo `FROM`**.

:::center
![Duas colunas: a ordem em que você escreve as cláusulas e a ordem em que o banco as executa, começando pelo FROM](images/09-anatomia-do-select.svg)
:::

:::steps
1. `FROM` escolhe a tabela
2. `WHERE` filtra as linhas
3. `SELECT` escolhe as colunas (e cria apelidos)
4. `ORDER BY` ordena o resultado
5. `LIMIT` corta as primeiras linhas
:::

:::tip
Guarde essa ordem. Ela explica, por exemplo, por que o `WHERE` não enxerga um apelido criado no `SELECT`.
:::

---

## :icon[text] Aspas, ponto e vírgula e comentários

```sql
-- Texto vai entre aspas simples; número, não
SELECT nome, cidade
FROM clientes
WHERE cidade = 'Recife';   /* o ; encerra o comando */
```

- **Aspas simples** delimitam texto e datas: `'Recife'`, `'2025-03-02'`. Números ficam sem aspas: `900`
- **Ponto e vírgula** encerra cada comando. Obrigatório quando há vários comandos no mesmo script
- **Comentários**: `--` vai até o fim da linha; `/* ... */` abrange um bloco. O banco os ignora

:::warning
No padrão SQL, aspas duplas delimitam **nomes** de colunas e tabelas, não texto. O MySQL as aceita como texto por padrão, mas não conte com isso.
:::

---

## :icon[flask-conical] Passo a passo: clientes

Comece amplo e vá estreitando.

```sql
SELECT * FROM clientes;
```

Traz as 5 linhas e todas as colunas (`id`, `nome`, `email`, `cidade`, `criado_em`). Bom para explorar.

```sql
SELECT nome, cidade FROM clientes;
```

Lista de colunas: só o que você precisa, na ordem que pediu.

```sql
SELECT nome, cidade FROM clientes WHERE cidade = 'São Paulo';
```

| nome | cidade |
|---|---|
| Bruno Lima | São Paulo |
| Elisa Prado | São Paulo |

:::tip
Em produção, liste as colunas. `SELECT *` traz dados a mais e o resultado muda se alguém acrescentar uma coluna.
:::

---

## :icon[flask-conical] Passo a passo: produtos

Agora a consulta completa, com todas as cláusulas.

```sql
SELECT nome, preco, estoque
FROM produtos
WHERE preco > 500
ORDER BY preco DESC
LIMIT 2;
```

:::steps
1. `FROM produtos`: as 6 linhas da tabela
2. `WHERE preco > 500`: sobram Monitor 27", Cadeira ergonômica e Notebook
3. `SELECT nome, preco, estoque`: três colunas
4. `ORDER BY preco DESC`: Notebook, Monitor, Cadeira
5. `LIMIT 2`: ficam as duas primeiras
:::

| nome | preco | estoque |
|---|---|---|
| Notebook | 4200.00 | 5 |
| Monitor 27" | 900.00 | 12 |

---

## :icon[circle-help] Pratique

:::question
Escreva uma consulta que mostre o **nome** e o **preço** dos produtos que custam menos de 200, do mais barato ao mais caro.

Antes de rodar, preveja: quantas linhas vão aparecer?
:::

Dica: você só precisa de `SELECT`, `FROM`, `WHERE` e `ORDER BY`.

---

## :icon[circle-check] Solução

```sql
SELECT nome, preco
FROM produtos
WHERE preco < 200
ORDER BY preco;
```

| nome | preco |
|---|---|
| Mouse | 60.00 |
| Teclado | 120.00 |
| Webcam | 180.00 |

Três linhas. `ORDER BY preco` sem `DESC` ordena do menor para o maior: `ASC` é o padrão.

:::tip
Se escreveu `ORDER BY preco ASC`, também está certo. Ser explícito nunca é errado.
:::

---

## :icon[triangle-alert] Erros comuns

:::warning
- Escrever texto sem aspas: `WHERE cidade = Recife` procura uma **coluna** chamada `Recife` e falha
- Trocar a ordem das cláusulas: `WHERE` antes de `FROM` é erro de sintaxe
- Esquecer o `;` em um script com vários comandos: o MySQL junta tudo e reclama na linha errada
- Usar `SELECT *` em código de aplicação: mais dados na rede e surpresas quando a tabela mudar
- Confundir aspas simples (texto) com crases (nomes de colunas e tabelas)
:::

---

## :icon[list-checks] Resumo

:::summary
- SQL é declarativa: você descreve o resultado e o SGBD decide o caminho
- Existe um padrão ANSI, mas cada SGBD tem seu dialeto; aqui usamos MySQL 8
- Cinco famílias: DQL consulta, DML manipula, DDL define, DCL controla acesso, TCL controla transações
- Você escreve `SELECT` primeiro, mas o banco executa `FROM`, `WHERE`, `SELECT`, `ORDER BY` e `LIMIT`, nessa ordem
- Texto entre aspas simples, `;` no fim, comentários com `--` e `/* */`
:::

---

## :icon[arrow-right] Próximos passos

Você já filtra linhas com uma condição simples. Na próxima aula, **Filtros e operadores no WHERE**, você combina condições com `AND`, `OR` e `NOT`, busca intervalos com `BETWEEN`, listas com `IN`, padrões de texto com `LIKE` e aprende a lidar com `NULL`.

Antes disso, faça o quiz desta aula para fixar a anatomia do `SELECT`.
