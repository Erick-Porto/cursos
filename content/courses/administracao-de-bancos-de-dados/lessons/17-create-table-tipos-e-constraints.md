---
title: CREATE TABLE, tipos e constraints
summary: Crie tabelas com os tipos certos e regras que o próprio banco faz valer.
module: sql-manipulacao-e-estrutura
duration_minutes: 25
objectives:
  - Criar bancos e tabelas com CREATE DATABASE e CREATE TABLE
  - Escolher o tipo de dado adequado para cada coluna
  - Aplicar constraints que garantem a integridade dos dados
  - Nomear tabelas, colunas e constraints de forma consistente
---

# CREATE TABLE, tipos e constraints

Administração de Bancos de Dados · Aula 17

---

## O que você vai aprender

:::goal
- O que é DDL e como criar um banco e suas tabelas
- Como escolher entre `INT`, `DECIMAL`, `VARCHAR`, `DATETIME` e outros tipos
- Quais regras (constraints) o banco aplica sozinho em cada `INSERT` e `UPDATE`
- Como nomear tabelas, colunas e constraints de um jeito que não envelhece mal
:::

---

## :icon[circle-help] Por que isso importa

Até aqui você consultou e alterou as tabelas do banco `loja`. Mas quem decidiu que `preco` guarda duas casas decimais, que `email` não se repete e que todo pedido aponta para um cliente que existe?

Essas decisões vivem no `CREATE TABLE`. Quando estão erradas, o estrago aparece aos poucos:

- :icon[coins] um preço em `FLOAT` que soma R$ 0,01 a menos em mil pedidos
- :icon[user-x] dois clientes com o mesmo e-mail
- :icon[unlink] pedidos de um cliente que não existe mais

:::question
Você prefere validar essas regras em cada aplicação que acessa o banco, ou uma única vez, na própria tabela?
:::

---

## :icon[layers] DDL: a parte do SQL que define a estrutura

**DDL** (Data Definition Language) cria, altera e remove os objetos do banco: bancos, tabelas, views, índices. Enquanto o DML (`INSERT`, `UPDATE`, `DELETE`) mexe nos dados, a DDL mexe no **molde** que os dados precisam seguir.

| Comando | O que faz |
|---|---|
| `CREATE` | cria um objeto novo |
| `ALTER` | muda um objeto existente |
| `DROP` | remove o objeto e tudo que ele contém |

Tudo começa criando o banco e dizendo ao MySQL qual deles você vai usar:

```sql
CREATE DATABASE IF NOT EXISTS loja
  CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE loja;
SHOW TABLES;
```

:::info
No PostgreSQL não existe `USE`: você se conecta direto ao banco (`\c loja` no psql).
:::

---

## :icon[table] Anatomia de um CREATE TABLE

:::center
![Anatomia do CREATE TABLE: nome da tabela, colunas com tipo e constraints de coluna, e constraints de tabela no fim](images/17-anatomia-create-table.svg)
:::

Cada linha dentro dos parênteses define uma coluna: **nome**, **tipo** e, opcionalmente, **constraints de coluna**. No fim entram as **constraints de tabela**, que envolvem mais de uma coluna ou precisam de nome.

```sql
CREATE TABLE departamentos (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(80) NOT NULL UNIQUE
);
```

Depois de criar, confira a estrutura com `DESCRIBE departamentos;`.

---

## :icon[binary] Números: INT, BIGINT, DECIMAL e FLOAT

| Tipo | Guarda | Use para |
|---|---|---|
| `INT` | inteiros até cerca de 2 bilhões | ids, quantidades, estoque |
| `BIGINT` | inteiros até 9 quintilhões | ids de tabelas gigantes, contadores |
| `DECIMAL(p,s)` | valor exato: `p` dígitos, `s` decimais | dinheiro, percentuais |
| `FLOAT`, `DOUBLE` | valor aproximado (ponto flutuante) | medições científicas |

`DECIMAL(10,2)` guarda até 99.999.999,99 sem perder um centavo. Ponto flutuante arredonda por natureza:

```sql
SELECT 0.1 + 0.2 = 0.3       AS decimal_exato,
       0.1e0 + 0.2e0 = 0.3e0 AS double_aproximado;
```

| decimal_exato | double_aproximado |
|---|---|
| 1 | 0 |

:::tip
Dinheiro é sempre `DECIMAL`. Nunca `FLOAT`, nunca `DOUBLE`.
:::

---

## :icon[text] Texto: VARCHAR, CHAR e TEXT

| Tipo | Tamanho | Use para |
|---|---|---|
| `VARCHAR(n)` | variável, até `n` caracteres | nomes, e-mails, títulos |
| `CHAR(n)` | fixo, sempre `n` caracteres | siglas e códigos de tamanho certo |
| `TEXT` | longo, até 64 KB | descrições, observações |

`VARCHAR(120)` ocupa só o que o texto usa, mais 1 ou 2 bytes de controle. `CHAR(2)` completa com espaços e é perfeito para `'SP'`, `'RJ'`.

:::tip
Escolha um `n` com folga, mas realista: `nome VARCHAR(120)` documenta a regra; `VARCHAR(255)` em tudo não documenta nada. Para textos sem limite previsível, use `TEXT`.
:::

:::info
`TEXT` não aceita `DEFAULT` literal nem índice sem prefixo. Com tamanho máximo conhecido, prefira `VARCHAR`.
:::

---

## :icon[calendar] Datas, booleanos, ENUM e JSON

| Tipo | Exemplo | Observação |
|---|---|---|
| `DATE` | `'2025-03-02'` | só a data |
| `DATETIME` | `'2025-03-02 14:30:00'` | data e hora, guardada como você escreveu |
| `TIMESTAMP` | idem | convertida para UTC; vai só até 2038 |
| `BOOLEAN` | `TRUE`, `FALSE` | no MySQL é um `TINYINT(1)` |
| `ENUM('aberto','pago')` | `'pago'` | lista fechada de valores |
| `JSON` | `'{"cor": "preto"}'` | documento validado e consultável |

Regra prática: `DATE` para datas de negócio (nascimento, pedido), `DATETIME` para registrar quando algo aconteceu, `ENUM` só para listas que quase nunca mudam. Para atributos que variam de produto para produto, `JSON` evita criar dez colunas vazias.

---

## :icon[key-round] Constraints de coluna

Uma **constraint** é uma regra que o banco verifica em todo `INSERT` e `UPDATE`. Se a regra falha, o comando falha, e o dado ruim nunca entra.

```sql
CREATE TABLE clientes (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  nome      VARCHAR(120) NOT NULL,
  email     VARCHAR(160) NOT NULL UNIQUE,
  cidade    VARCHAR(80),
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

- :icon[key-round] `PRIMARY KEY`: identifica a linha; implica `NOT NULL` e `UNIQUE`; só uma por tabela
- :icon[plus] `AUTO_INCREMENT`: o MySQL gera 1, 2, 3... sem você informar
- :icon[ban] `NOT NULL`: valor obrigatório
- :icon[fingerprint] `UNIQUE`: nenhum valor se repete (vários `NULL` são permitidos)
- :icon[circle-dot] `DEFAULT`: valor usado quando o `INSERT` não informa a coluna

---

## :icon[shield-check] CHECK e FOREIGN KEY

`CHECK` valida uma condição sobre a própria linha. `FOREIGN KEY` garante que o valor exista em outra tabela: é a **integridade referencial**.

```sql
CREATE TABLE produtos (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  nome         VARCHAR(120) NOT NULL,
  preco        DECIMAL(10,2) NOT NULL CHECK (preco >= 0),
  categoria_id INT,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    ON DELETE SET NULL ON UPDATE CASCADE
);
```

:::center
![Três reações da chave estrangeira ao apagar uma categoria: RESTRICT recusa, CASCADE apaga os produtos, SET NULL deixa os produtos sem categoria](images/17-foreign-key-acoes.svg)
:::

:::info
O MySQL aceita a sintaxe de `CHECK` há muito tempo, mas só **aplica** a regra desde a versão 8.0.16. Antes disso, ela era ignorada em silêncio.
:::

---

## :icon[tag] Exemplo completo, com constraints nomeadas

```sql
CREATE TABLE IF NOT EXISTS departamentos (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(80) NOT NULL,
  CONSTRAINT uq_departamentos_nome UNIQUE (nome)
);
CREATE TABLE IF NOT EXISTS funcionarios (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  nome            VARCHAR(120) NOT NULL,
  cargo           VARCHAR(60),
  salario         DECIMAL(10,2),
  departamento_id INT,
  CONSTRAINT chk_funcionarios_salario CHECK (salario >= 0),
  CONSTRAINT fk_funcionarios_departamento
    FOREIGN KEY (departamento_id) REFERENCES departamentos(id)
);
```

A tabela referenciada precisa existir antes: `departamentos` vem primeiro. `IF NOT EXISTS` evita erro em scripts que rodam mais de uma vez.

Nomear constraints (`CONSTRAINT nome ...`) rende mensagens de erro legíveis e permite removê-las depois pelo nome. Sem isso, o MySQL inventa nomes como `funcionarios_ibfk_1` e `funcionarios_chk_1`.

---

## :icon[pencil] Boas práticas de nomenclatura

| Objeto | Padrão | Exemplo |
|---|---|---|
| tabela | plural, `snake_case` | `itens_pedido` |
| coluna | singular, sem repetir a tabela | `nome`, não `nome_produto` |
| chave primária | `id` | `id` |
| chave estrangeira | tabela no singular + `_id` | `cliente_id` |
| constraint | prefixo + tabela + coluna | `fk_pedidos_cliente`, `uq_clientes_email`, `chk_produtos_preco` |

- :icon[ban] Sem acentos, espaços ou maiúsculas: no Linux, `Clientes` e `clientes` são tabelas diferentes
- :icon[ban] Evite palavras reservadas como `order`, `group` e `desc`
- :icon[check] Um padrão só, no banco inteiro: consistência vale mais que a convenção escolhida

---

## :icon[flask-conical] Pratique

Em um banco de testes, crie a tabela `produtos` com estas regras:

:::example
1. `id` inteiro, chave primária, gerado automaticamente
2. `nome` texto de até 120 caracteres, obrigatório
3. `codigo_barras` com 13 caracteres fixos, único, opcional
4. `preco` com até 10 dígitos e 2 decimais, obrigatório, nunca negativo (constraint `chk_produtos_preco`)
5. `estoque` inteiro, obrigatório, começa em 0
6. `categoria_id` ligado a `categorias(id)`; se a categoria for apagada, o produto fica sem categoria (constraint `fk_produtos_categoria`)
7. `criado_em` com data e hora, preenchido sozinho no `INSERT`
:::

Depois, confira com `DESCRIBE produtos;` e tente inserir um preço negativo.

---

## :icon[circle-check] Solução

```sql
CREATE TABLE IF NOT EXISTS produtos (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nome          VARCHAR(120) NOT NULL,
  codigo_barras CHAR(13) UNIQUE,
  preco         DECIMAL(10,2) NOT NULL,
  estoque       INT NOT NULL DEFAULT 0,
  categoria_id  INT,
  criado_em     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_produtos_preco CHECK (preco >= 0),
  CONSTRAINT fk_produtos_categoria
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    ON DELETE SET NULL
);
```

Teste a regra de preço:

```sql
INSERT INTO produtos (nome, preco) VALUES ('Teclado', -1);
```

O MySQL responde `ERROR 3819: Check constraint 'chk_produtos_preco' is violated.` e nada é gravado. Repare que o nome da constraint aparece na mensagem.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Guardar dinheiro em `FLOAT` ou `DOUBLE`: os centavos somem nas somas
- Criar a tabela filha antes da tabela pai: a `FOREIGN KEY` falha porque `categorias` ainda não existe
- Esquecer `NOT NULL` em colunas obrigatórias e descobrir meses depois milhares de `NULL`
- Confiar no `CHECK` em um MySQL anterior ao 8.0.16, que aceita a sintaxe e ignora a regra
- Deixar o MySQL nomear as constraints (`produtos_ibfk_1`) e não saber o que remover depois
:::

---

## :icon[list-checks] Resumo

:::summary
- DDL define a estrutura: `CREATE DATABASE`, `CREATE TABLE` e, mais adiante, `ALTER` e `DROP`
- Cada coluna tem um tipo: `DECIMAL` para dinheiro, `VARCHAR` para texto variável, `DATE` ou `DATETIME` para tempo
- Constraints (`PRIMARY KEY`, `NOT NULL`, `UNIQUE`, `DEFAULT`, `CHECK`, `FOREIGN KEY`) fazem o banco rejeitar dados inválidos
- `ON DELETE` e `ON UPDATE` decidem o que acontece com os filhos quando o pai muda
- Nomes em `snake_case`, consistentes, e constraints nomeadas facilitam a manutenção
:::

---

## :icon[arrow-right] Próximos passos

Uma tabela raramente nasce pronta: surgem colunas novas, tipos que precisam crescer, regras que mudam. Na próxima aula, **Evoluindo o esquema: ALTER e DROP**, você aprende a mudar a estrutura sem perder os dados que já estão lá.

Antes, responda ao quiz desta aula e confira se os tipos e as constraints ficaram claros.
