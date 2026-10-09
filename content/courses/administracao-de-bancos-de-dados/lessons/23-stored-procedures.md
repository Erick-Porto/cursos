---
title: Stored procedures
summary: Programe dentro do banco com procedures, parâmetros IN, OUT e INOUT, variáveis e tratamento de erro.
module: programacao-no-banco
duration_minutes: 30
objectives:
  - Explicar quando vale programar dentro do banco
  - Criar procedures com parâmetros IN, OUT e INOUT
  - Usar variáveis, IF, loops e tratamento de erro no corpo de uma procedure
  - Gerenciar procedures com SHOW e DROP
---

# Stored procedures

Administração de Bancos de Dados · Aula 23

---

## O que você vai aprender

:::goal
- Quando faz sentido programar dentro do banco, e quando não
- Como criar e chamar uma procedure com parâmetros `IN`, `OUT` e `INOUT`
- Variáveis, `IF`, loops e tratamento de erro no corpo
- Como listar, inspecionar e remover procedures
:::

---

## :icon[lightbulb] Por que isso importa

Para fechar um pedido na loja, a aplicação envia quatro comandos: cria o pedido, insere os itens, baixa o estoque e grava o total. São quatro idas e voltas pela rede, e a regra fica copiada em cada sistema que vende.

::::columns
:::col
**Programar no banco ajuda quando**

- :icon[shield] a regra precisa valer para todos os sistemas
- :icon[network] várias idas e voltas podem virar uma só
- :icon[lock] a aplicação não deve tocar nas tabelas diretamente
:::
:::col
**Evite quando**

- a lógica é de tela, não de dados
- a equipe não versiona nem testa código SQL
- o servidor de banco já é o gargalo
:::
::::

---

## :icon[puzzle] Procedure, função ou trigger?

Os três são blocos de código guardados no banco. A diferença está em como são executados.

| Objeto | Como executa | Devolve | Uso típico |
|---|---|---|---|
| **Procedure** | `CALL nome(...)` | parâmetros `OUT` ou um `SELECT` | rotinas com várias etapas |
| **Função** | dentro de expressões: `SELECT fn(x)` | sempre um valor | cálculos reutilizáveis |
| **Trigger** | sozinho, em `INSERT`, `UPDATE` ou `DELETE` | nada | auditoria e validação |

Esta aula trata das procedures. Triggers são o assunto da próxima.

---

## :icon[code] Sua primeira procedure

```sql
DELIMITER $$
CREATE PROCEDURE sp_produtos_da_categoria(IN p_categoria_id INT)
BEGIN
  SELECT id, nome, preco
  FROM produtos
  WHERE categoria_id = p_categoria_id
  ORDER BY nome;
END $$
DELIMITER ;

CALL sp_produtos_da_categoria(1);
```

| id | nome | preco |
|---|---|---|
| 2 | Mouse | 60.00 |
| 1 | Teclado | 120.00 |
| 6 | Webcam | 180.00 |

:::info
`DELIMITER` é um comando do **cliente** (mysql, Workbench), não do servidor. Ele troca o terminador `;` por `$$` para que os `;` do corpo não encerrem o comando antes da hora. No PostgreSQL o corpo vai entre `$$ ... $$` e não existe `DELIMITER`.
:::

---

## :icon[workflow] O caminho de um CALL

:::center
![Fluxo: a aplicação envia CALL, o SGBD executa a procedure, que lê e grava nas tabelas e devolve só o resultado](images/23-fluxo-call.svg)
:::

Uma única mensagem sai da aplicação. Todo o trabalho acontece ao lado dos dados, e só o resultado volta pela rede.

:::tip
A aplicação pode ter permissão apenas de `EXECUTE` na procedure, sem acesso direto às tabelas. Menos superfície para erro e para ataque.
:::

---

## :icon[arrow-left-right] Parâmetros: IN, OUT e INOUT

:::center
![Três parâmetros: IN entra na procedure, OUT sai dela, INOUT entra, é alterado e sai](images/23-parametros.svg)
:::

| Modo | Sentido | Exemplo |
|---|---|---|
| `IN` (padrão) | o chamador envia um valor | `IN p_categoria_id INT` |
| `OUT` | a procedure devolve um valor | `OUT p_total DECIMAL(10,2)` |
| `INOUT` | entra, pode mudar e volta | `INOUT p_preco DECIMAL(10,2)` |

---

## :icon[corner-down-right] OUT na prática

```sql
DELIMITER $$
CREATE PROCEDURE sp_total_gasto(
  IN p_cliente_id INT,
  OUT p_total DECIMAL(10,2)
)
BEGIN
  SELECT COALESCE(SUM(total), 0) INTO p_total
  FROM pedidos
  WHERE cliente_id = p_cliente_id AND status <> 'cancelado';
END $$
DELIMITER ;

CALL sp_total_gasto(1, @total);
SELECT @total AS total_gasto;
```

| total_gasto |
|---|
| 4380.00 |

`@total` é uma **variável de sessão**: a procedure grava nela e você lê depois com `SELECT`. Ela vive até a desconexão.

---

## :icon[repeat] INOUT na prática

```sql
DELIMITER $$
CREATE PROCEDURE sp_aplicar_desconto(
  INOUT p_preco DECIMAL(10,2),
  IN p_percentual INT
)
BEGIN
  SET p_preco = ROUND(p_preco * (100 - p_percentual) / 100, 2);
END $$
DELIMITER ;

SET @preco = 900.00;
CALL sp_aplicar_desconto(@preco, 10);
SELECT @preco;
```

| @preco |
|---|
| 810.00 |

O valor entra em `@preco`, é alterado dentro da procedure e volta na mesma variável.

---

## :icon[braces] Variáveis, IF e um loop

```sql
DELIMITER $$
CREATE PROCEDURE sp_somar_ate(IN p_n INT, OUT p_soma INT)
BEGIN
  DECLARE v_i INT DEFAULT 1;
  SET p_soma = 0;
  IF p_n < 1 THEN
    SET p_soma = NULL;
  ELSE
    WHILE v_i <= p_n DO
      SET p_soma = p_soma + v_i;
      SET v_i = v_i + 1;
    END WHILE;
  END IF;
END $$
DELIMITER ;
```

- `DECLARE` cria uma variável local e vem sempre no início do bloco
- `SET` atribui; `SELECT ... INTO` guarda o resultado de uma consulta
- `CALL sp_somar_ate(4, @s); SELECT @s;` devolve `10`

---

## :icon[siren] Quando algo dá errado

```sql
DELIMITER $$
CREATE PROCEDURE sp_novo_pedido(IN p_cliente INT, IN p_produto INT, IN p_qtd INT)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;    -- desfaz o que já foi gravado
    RESIGNAL;    -- repassa o erro a quem chamou
  END;
  START TRANSACTION;
  INSERT INTO pedidos (cliente_id, data_pedido) VALUES (p_cliente, CURDATE());
  INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario)
    SELECT LAST_INSERT_ID(), id, p_qtd, preco FROM produtos WHERE id = p_produto;
  COMMIT;
END $$
DELIMITER ;
```

`CALL sp_novo_pedido(2, 1, 0)` viola o `CHECK (quantidade > 0)`. O **handler** captura o erro, desfaz o pedido criado e devolve o erro. Sem ele, a procedure pararia no meio, com a transação aberta e um pedido sem itens.

---

## :icon[wrench] Gerenciar e manter

```sql
SHOW PROCEDURE STATUS WHERE Db = 'loja';
SHOW CREATE PROCEDURE sp_total_gasto;
DROP PROCEDURE IF EXISTS sp_total_gasto;
```

No MySQL, `ALTER PROCEDURE` só muda características (comentário, segurança), não o corpo. Para alterar a lógica: `DROP` e `CREATE` de novo.

:::tip Boas práticas
- Prefixo `sp_` no nome e `p_` nos parâmetros: ninguém confunde com tabela ou coluna
- Uma procedure, uma responsabilidade: `sp_novo_pedido` não envia e-mail
- Um comentário no início dizendo o que faz, o que recebe e o que devolve
- Guarde o código em arquivos versionados, como qualquer programa
:::

---

## :icon[flask-conical] Pratique

:::question
**1.** Crie `sp_buscar_produtos_por_faixa_de_preco`, com dois parâmetros `IN` (`p_min` e `p_max`, `DECIMAL(10,2)`). Ela deve listar `id`, `nome`, `preco` e `estoque` dos produtos com preço entre os dois valores, inclusive, do mais barato ao mais caro.

**2.** Crie `sp_adicionar_cliente`, que recebe `p_nome` e `p_email`, insere o cliente e devolve o `id` gerado em um parâmetro `OUT` chamado `p_id`. Se o e-mail já existir, não insira e devolva `NULL`.
:::

Teste cada uma com `CALL` antes de ver a solução.

---

## :icon[circle-check] Solução 1

```sql
DELIMITER $$
CREATE PROCEDURE sp_buscar_produtos_por_faixa_de_preco(
  IN p_min DECIMAL(10,2),
  IN p_max DECIMAL(10,2)
)
BEGIN
  SELECT id, nome, preco, estoque
  FROM produtos
  WHERE preco BETWEEN p_min AND p_max
  ORDER BY preco;
END $$
DELIMITER ;

CALL sp_buscar_produtos_por_faixa_de_preco(100, 1000);
```

| id | nome | preco | estoque |
|---|---|---|---|
| 1 | Teclado | 120.00 | 35 |
| 6 | Webcam | 180.00 | 0 |
| 4 | Cadeira ergonômica | 750.00 | 8 |
| 3 | Monitor 27" | 900.00 | 12 |

---

## :icon[circle-check] Solução 2

```sql
DELIMITER $$
CREATE PROCEDURE sp_adicionar_cliente(
  IN p_nome VARCHAR(120), IN p_email VARCHAR(160), OUT p_id INT
)
BEGIN
  IF EXISTS (SELECT 1 FROM clientes WHERE email = p_email) THEN
    SET p_id = NULL;
  ELSE
    INSERT INTO clientes (nome, email) VALUES (p_nome, p_email);
    SET p_id = LAST_INSERT_ID();
  END IF;
END $$
DELIMITER ;
CALL sp_adicionar_cliente('Fábio Reis', 'fabio@exemplo.com', @id);
SELECT @id;
```

| @id |
|---|
| 6 |

`LAST_INSERT_ID()` devolve o valor `AUTO_INCREMENT` gerado pelo último `INSERT` da sua sessão. Chamar de novo com o mesmo e-mail devolve `NULL` e não insere nada.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Esquecer o `DELIMITER` e ver o cliente reclamar de erro de sintaxe no primeiro `;` do corpo
- Chamar com `EXEC` ou `EXECUTE`: no MySQL o comando é `CALL`
- Passar um valor literal onde a procedure espera `OUT`: precisa ser uma variável, como `@total`
- Pôr `DECLARE` depois de outros comandos: as declarações vêm primeiro no bloco
- Abrir `START TRANSACTION` sem handler: um erro no meio deixa a transação pendurada
:::

---

## :icon[list-checks] Resumo

:::summary
- Uma **stored procedure** guarda uma rotina no banco e roda com `CALL`, perto dos dados
- `IN` entra, `OUT` sai e `INOUT` faz os dois; o valor de `OUT` é lido em variáveis de sessão como `@total`
- O corpo aceita `DECLARE`, `IF`, loops e `SELECT ... INTO`
- `DECLARE EXIT HANDLER FOR SQLEXCEPTION` com `ROLLBACK` evita trabalho pela metade
- `SHOW PROCEDURE STATUS` lista, `DROP PROCEDURE` remove; para mudar o corpo, recrie
:::

---

## :icon[arrow-right] Próximos passos

Procedures rodam quando alguém chama. Na próxima aula, **Triggers**, você vai ver código que dispara sozinho a cada `INSERT`, `UPDATE` ou `DELETE`: auditoria, validação e campos calculados sem depender da aplicação.

Antes, faça o quiz e confira se `IN`, `OUT` e `INOUT` ficaram claros.
