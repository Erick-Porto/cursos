---
title: Do MER ao modelo lógico e físico
summary: Regras para transformar o DER em tabelas, chaves estrangeiras, tabelas associativas e tipos do MySQL.
module: modelagem
duration_minutes: 30
objectives:
  - Mapear entidades, atributos e identificadores para tabelas, colunas e chaves primárias
  - Transformar relacionamentos 1:1, 1:N e N:M em chaves estrangeiras e tabelas associativas
  - Escolher a ação de integridade referencial adequada a cada chave estrangeira
  - Selecionar tipos de dados do MySQL no modelo físico
---

# Do MER ao modelo lógico e físico

Administração de Bancos de Dados · Aula 06

---

## O que você vai aprender

:::goal
- As regras que levam entidades e atributos a tabelas e colunas
- Onde fica a chave estrangeira em cada tipo de relacionamento
- O que acontece com os registros filhos quando o pai é apagado
- Como escolher tipos de dados no MySQL
:::

---

## :icon[route] Por que isso importa

O DER da loja está aprovado. Agora alguém precisa escrever o `CREATE TABLE`.

- Em qual tabela fica `cliente_id`: em `clientes` ou em `pedidos`?
- Onde vai a `quantidade` de "pedido contém produto"?
- Apagar um cliente deve apagar os pedidos dele?

:::question
Essas decisões podem ser tomadas no improviso, cada uma de um jeito, ou seguir regras fixas. Qual opção gera um banco mais previsível?
:::

O mapeamento é um conjunto de regras. Aplicadas em ordem, elas transformam qualquer DER em tabelas.

---

## :icon[table] Regras básicas de mapeamento

| No DER | No modelo lógico |
|---|---|
| Entidade `cliente` | tabela `clientes` |
| Atributo simples `nome` | coluna `nome` |
| Atributo composto `endereco` | uma coluna por parte: `rua`, `numero`, `cidade` |
| Atributo derivado `idade` | não vira coluna; calcule na consulta |
| Identificador `id` | `PRIMARY KEY` |
| Atributo multivalorado `telefone` | nova tabela com chave estrangeira |

:::tip
Nomes de tabela no plural e em `snake_case`: `itens_pedido`, não `ItemPedido`.
:::

---

## :icon[list] Atributo multivalorado vira tabela

Um cliente pode ter vários telefones. Uma coluna `telefone` guarda só um; `telefone1`, `telefone2` limita a quantidade.

```sql
CREATE TABLE telefones_cliente (
  cliente_id INT NOT NULL,
  numero VARCHAR(20) NOT NULL,
  PRIMARY KEY (cliente_id, numero),
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);
```

- A nova tabela recebe a chave do dono como **chave estrangeira**
- A chave primária combina a chave do dono com o valor: (`cliente_id`, `numero`)
- Zero, um ou dez telefones: cada um vira uma linha

---

## :icon[link] Relacionamento 1:1: a chave em um dos lados

Um departamento tem no máximo um gerente; um funcionário gerencia no máximo um departamento.

```sql
ALTER TABLE departamentos
  ADD COLUMN gerente_id INT UNIQUE,
  ADD FOREIGN KEY (gerente_id) REFERENCES funcionarios(id);
```

- A chave estrangeira vai para **um** dos lados; escolha o lado em que a participação é obrigatória, ou o que fica nulo menos vezes
- `UNIQUE` garante o "no máximo um": o mesmo funcionário não gerencia dois departamentos

---

## :icon[git-fork] Relacionamento 1:N: a chave no lado N

Um cliente faz vários pedidos; cada pedido é de um cliente. A chave primária do lado **1** viaja para o lado **N**.

```sql
CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  data_pedido DATE NOT NULL,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);
```

| id | cliente_id | data_pedido |
|---|---|---|
| 1 | 1 | 2025-03-02 |
| 3 | 1 | 2025-03-09 |

Ana (cliente 1) aparece em dois pedidos. O `NOT NULL` registra que a participação é obrigatória.

---

## :icon[workflow] Relacionamento N:M: tabela associativa

Um pedido contém vários produtos e um produto aparece em vários pedidos. Nenhum lado consegue guardar a chave do outro.

![Animação em três passos: o relacionamento N:M entre pedido e produto dá lugar à tabela itens_pedido, que recebe pedido_id e produto_id como chaves estrangeiras e a quantidade como coluna](images/06-nm-vira-tabela-associativa.svg)

- Crie uma **tabela associativa** entre as duas
- Ela recebe as duas chaves como chaves estrangeiras; juntas, elas formam a chave primária
- Atributos do relacionamento (`quantidade`, `preco_unitario`) viram colunas dela

---

## :icon[link-2] Chave estrangeira: a ligação entre tabelas

Uma **chave estrangeira** (FK) é a coluna que guarda a chave primária de outra tabela. A tabela referenciada é a **pai**; a que guarda a FK é a **filha**.

```sql
CONSTRAINT fk_pedidos_clientes
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
  ON DELETE RESTRICT
  ON UPDATE CASCADE
```

O MySQL recusa um `cliente_id` que não exista em `clientes`. Isso é a **integridade referencial**.

:::tip
Dê nome às constraints (`fk_filha_pai`). O nome aparece nas mensagens de erro e é exigido no `ALTER TABLE ... DROP FOREIGN KEY`.
:::

---

## :icon[shield] Integridade referencial: o que fazer com os filhos

`ON DELETE` define o que acontece com as linhas filhas quando a linha pai é apagada:

| Ação | Ao apagar o pai | Quando usar |
|---|---|---|
| `RESTRICT` (padrão) | o `DELETE` falha se houver filhos | pedidos de um cliente, produtos de uma categoria |
| `CASCADE` | os filhos são apagados junto | itens de um pedido |
| `SET NULL` | a FK dos filhos vira `NULL` | categoria de um produto, se a coluna aceitar `NULL` |

:::question
Se um cliente pedir para sair do cadastro, os pedidos dele devem sumir? Pense no financeiro antes de responder.
:::

---

## :icon[hard-drive] Modelo físico: números e texto

O **modelo físico** troca os tipos genéricos do lógico pelos tipos do MySQL.

| Tipo | Use para | Exemplo |
|---|---|---|
| `INT` | contadores e chaves até 2 bilhões | `id`, `estoque` |
| `BIGINT` | chaves de tabelas gigantes | `id` de logs |
| `DECIMAL(10,2)` | dinheiro, com casas decimais exatas | `preco`, `salario` |
| `VARCHAR(n)` | texto curto, com limite | `nome VARCHAR(120)` |
| `TEXT` | texto longo, sem limite prático | `descricao` |

:::warning
Nunca use `FLOAT` ou `DOUBLE` para dinheiro: eles arredondam, e somas de centavos acumulam erro.
:::

---

## :icon[calendar] Modelo físico: datas, lógicos e listas

| Tipo | Use para | Exemplo |
|---|---|---|
| `DATE` | só a data | `data_pedido` |
| `DATETIME` | data e hora | `criado_em` |
| `BOOLEAN` | sim ou não; é o mesmo que `TINYINT(1)` | `ativo` |
| `ENUM('a','b')` | lista fixa e pequena de valores | `status` |

:::info
No PostgreSQL, `BOOLEAN` é um tipo próprio, `ENUM` precisa ser criado antes com `CREATE TYPE`, e `DATETIME` se chama `TIMESTAMP`.
:::

---

## :icon[database] Exemplo: o banco loja

:::example
![Modelo lógico da loja: clientes ligados a pedidos por cliente_id, pedidos ligados a itens_pedido por pedido_id e produtos ligados a itens_pedido por produto_id](images/06-der-logico-loja.svg)

Cada chave estrangeira aponta para a chave primária da tabela pai. Em `pedidos`:

```sql
CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  data_pedido DATE NOT NULL,
  status ENUM('aberto','pago','enviado','cancelado') NOT NULL DEFAULT 'aberto',
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  CONSTRAINT fk_pedidos_clientes FOREIGN KEY (cliente_id)
    REFERENCES clientes(id) ON DELETE RESTRICT
);
```

Na base `loja`, `itens_pedido` usa um `id` próprio como chave primária e guarda as duas FKs. As duas formas valem; com `id`, acrescente `UNIQUE (pedido_id, produto_id)`.
:::

---

## :icon[triangle-alert] Erros comuns

:::warning
- Colocar a chave estrangeira no lado 1 (um `pedido_id` em `clientes`) e só conseguir guardar um pedido por cliente
- Criar a tabela associativa sem chave primária e aceitar o mesmo produto duas vezes no mesmo pedido
- Usar `ON DELETE CASCADE` em tudo e apagar o histórico de vendas junto com o cliente
- `SET NULL` em coluna `NOT NULL`: o MySQL recusa a criação da constraint
- `FLOAT` para preço e `VARCHAR` para data
:::

---

## :icon[list-checks] Resumo

:::summary
- Entidade vira tabela, atributo vira coluna, identificador vira chave primária; multivalorado vira outra tabela
- 1:1 põe a FK em um dos lados com `UNIQUE`; 1:N põe a FK no lado N; N:M cria uma tabela associativa com chave composta
- A chave estrangeira garante integridade referencial; `ON DELETE` decide entre `RESTRICT`, `CASCADE` e `SET NULL`
- O modelo físico escolhe tipos do MySQL: `DECIMAL` para dinheiro, `VARCHAR` com limite, `DATE` e `DATETIME` para tempo
:::

---

## :icon[arrow-right] Próximos passos

As tabelas existem, mas ainda podem guardar dados repetidos e inconsistentes. Na próxima aula, **Normalização e integridade**, você vai aplicar as formas normais e as restrições que mantêm o banco coerente.

Faça o quiz desta aula: ele pede que você mapeie relacionamentos e escolha tipos e ações de integridade.
