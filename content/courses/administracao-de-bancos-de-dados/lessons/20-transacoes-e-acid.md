---
title: Transações e ACID
summary: Agrupe vários comandos em uma unidade tudo ou nada com START TRANSACTION, COMMIT, ROLLBACK e SAVEPOINT.
module: transacoes
duration_minutes: 25
objectives:
  - Explicar o que é uma transação e as quatro propriedades ACID
  - Controlar uma transação com START TRANSACTION, COMMIT e ROLLBACK
  - Desfazer parte de uma transação com SAVEPOINT
  - Reconhecer os comandos que confirmam a transação sem COMMIT
---

# Transações e ACID

Administração de Bancos de Dados · Aula 20

---

## O que você vai aprender

:::goal
- O que é uma transação e por que ela protege os seus dados
- Como abrir, confirmar e desfazer uma transação no MySQL
- As quatro garantias do ACID, com exemplos da loja
- SAVEPOINT, commit implícito e a diferença entre InnoDB e MyISAM
:::

---

## :icon[triangle-alert] Por que isso importa

Ana compra dois mouses. Para registrar a venda, a aplicação grava em **três tabelas**:

:::steps
1. Insere o pedido em `pedidos`
2. Insere o item em `itens_pedido`
3. Dá baixa no estoque em `produtos`
:::

Se a conexão cair entre o passo 2 e o passo 3, o pedido existe, mas o estoque continua errado. A loja vende um mouse que já não tem.

:::question
Como garantir que os três comandos aconteçam juntos, ou que nenhum deles aconteça?
:::

---

## :icon[package] O que é uma transação

Uma **transação** é um grupo de comandos tratado como uma única unidade de trabalho: ou todos valem, ou nenhum vale.

```sql
START TRANSACTION;
INSERT INTO pedidos (cliente_id, data_pedido, total)
VALUES (1, '2025-03-15', 120.00);
INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario)
VALUES (LAST_INSERT_ID(), 2, 2, 60.00);
UPDATE produtos SET estoque = estoque - 2 WHERE id = 2;
COMMIT;
```

- `START TRANSACTION` abre a unidade (`BEGIN` é sinônimo)
- `COMMIT` confirma tudo de uma vez
- `ROLLBACK` no lugar do `COMMIT` desfaz tudo, e o banco volta ao estado inicial

---

## :icon[rotate-ccw] O ciclo de uma transação

:::center
![Animação: a transação abre, faz mudanças provisórias e termina em COMMIT, que grava tudo, ou em ROLLBACK, que desfaz tudo](images/20-ciclo-transacao.svg)
:::

Entre o `START TRANSACTION` e o fim, as mudanças são **provisórias**: a sua sessão as enxerga, mas elas ainda não estão confirmadas.

- :icon[circle-check] `COMMIT`: as mudanças viram definitivas e visíveis para todos
- :icon[undo-2] `ROLLBACK`: as mudanças somem como se nunca tivessem acontecido

---

## :icon[zap] Autocommit: o padrão do MySQL

Por padrão, o MySQL trabalha com **autocommit** ligado: cada comando é uma transação própria, confirmada assim que termina.

```sql
SELECT @@autocommit;                                  -- 1 = ligado
UPDATE produtos SET preco = 65.00 WHERE id = 2;       -- já está confirmado
SET autocommit = 0;                                   -- daqui em diante, nada vale sem COMMIT
```

`START TRANSACTION` suspende o autocommit até o próximo `COMMIT` ou `ROLLBACK`. `SET autocommit = 0` desliga o autocommit para a sessão inteira.

:::tip
Prefira `START TRANSACTION` explícito. Com `autocommit = 0`, é fácil esquecer uma transação aberta segurando linhas por horas.
:::

---

## :icon[shield] ACID: atomicidade e consistência

:::center
![Os quatro pilares ACID: atomicidade, consistência, isolamento e durabilidade](images/20-acid.svg)
:::

::::columns
:::col
**Atomicidade**: tudo ou nada. Se a baixa no estoque falhar, o pedido e o item inseridos antes são desfeitos junto.
:::
:::col
**Consistência**: as regras continuam válidas. Nenhum `COMMIT` deixa um item apontando para um pedido inexistente ou uma `quantidade` igual a zero.
:::
::::

---

## :icon[shield-check] ACID: isolamento e durabilidade

::::columns
:::col
**Isolamento**: cada transação enxerga um estado coerente. Enquanto o pedido da Ana está aberto, um relatório em outra sessão não vê o pedido pela metade.
:::
:::col
**Durabilidade**: após o `COMMIT`, a mudança sobrevive a uma queda de energia. O InnoDB grava um registro no *redo log* em disco antes de responder "ok".
:::
::::

:::info
No InnoDB, `innodb_flush_log_at_trx_commit = 1` (padrão) força a escrita do log a cada `COMMIT`. É isso que paga a durabilidade.
:::

---

## :icon[flask-conical] Pratique

:::example
A loja quer mover **10 unidades** de estoque do Teclado (id 1) para a Webcam (id 6).

1. Abra uma transação e faça os dois `UPDATE`
2. Consulte os dois estoques ainda dentro da transação
3. Desista: desfaça tudo e consulte de novo

Antes de rodar, preveja o resultado das duas consultas.
:::

Estoque inicial: Teclado 35, Webcam 0.

---

## :icon[circle-check] Solução

```sql
START TRANSACTION;
UPDATE produtos SET estoque = estoque - 10 WHERE id = 1;
UPDATE produtos SET estoque = estoque + 10 WHERE id = 6;
SELECT id, nome, estoque FROM produtos WHERE id IN (1, 6);
ROLLBACK;
SELECT id, nome, estoque FROM produtos WHERE id IN (1, 6);
```

| consulta | Teclado | Webcam |
|---|---|---|
| dentro da transação | 25 | 10 |
| depois do `ROLLBACK` | 35 | 0 |

A primeira consulta vê as mudanças provisórias. O `ROLLBACK` apaga as duas, e o banco volta ao início.

---

## :icon[bookmark] SAVEPOINT: desfazer só uma parte

Um **savepoint** marca um ponto dentro da transação. `ROLLBACK TO SAVEPOINT` desfaz o que veio depois dele e mantém a transação aberta.

```sql
START TRANSACTION;
INSERT INTO pedidos (cliente_id, data_pedido) VALUES (2, '2025-03-16');
SET @pedido = LAST_INSERT_ID();
INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario)
VALUES (@pedido, 2, 1, 60.00);
SAVEPOINT item_mouse;
INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario)
VALUES (@pedido, 6, 1, 180.00);        -- webcam sem estoque: desistir
ROLLBACK TO SAVEPOINT item_mouse;      -- desfaz só a webcam
COMMIT;                                -- grava o pedido com o mouse
```

`RELEASE SAVEPOINT nome` apaga o marcador sem desfazer nada.

---

## :icon[milestone] O que o COMMIT gravou

:::center
![Linha do tempo: o item webcam, inserido depois do savepoint, é desfeito; pedido e mouse são gravados pelo COMMIT](images/20-savepoint.svg)
:::

O `ROLLBACK TO SAVEPOINT item_mouse` apagou só a webcam. O pedido e o item mouse, criados antes do marcador, continuaram provisórios até o `COMMIT`, que os gravou.

:::tip
Um `COMMIT` ou um `ROLLBACK` completo descarta todos os savepoints da transação.
:::

---

## :icon[octagon-alert] Commit implícito: o DDL fecha a transação

Alguns comandos confirmam a transação em andamento **sem que você escreva COMMIT**:

- :icon[table] `CREATE`, `ALTER`, `DROP`, `RENAME` e `TRUNCATE TABLE`
- :icon[users] `CREATE USER`, `GRANT` e `REVOKE`
- :icon[lock] `LOCK TABLES` e um novo `START TRANSACTION`

```sql
START TRANSACTION;
DELETE FROM itens_pedido WHERE pedido_id = 4;
ALTER TABLE pedidos ADD COLUMN observacao VARCHAR(200);  -- COMMIT implícito
ROLLBACK;   -- tarde demais: o DELETE já foi confirmado
```

:::info
No PostgreSQL, o DDL participa da transação: um `CREATE TABLE` pode ser desfeito com `ROLLBACK`. No MySQL, não.
:::

---

## :icon[layers] Só o InnoDB tem transações

O MySQL permite escolher o **motor de armazenamento** de cada tabela. Transações, `ROLLBACK` e chaves estrangeiras existem apenas no **InnoDB**, o motor padrão.

```sql
SELECT table_name, engine
FROM information_schema.tables
WHERE table_schema = 'loja';
```

| table_name | engine |
|---|---|
| clientes | InnoDB |
| pedidos | InnoDB |
| produtos | InnoDB |

Em uma tabela **MyISAM**, cada comando é gravado na hora: `ROLLBACK` não desfaz nada e só gera um aviso. Para converter: `ALTER TABLE nome ENGINE = InnoDB;`.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Abrir a transação e esquecer de fechá-la: as linhas ficam travadas para as outras sessões
- Achar que `ROLLBACK` desfaz um `TRUNCATE` ou um `ALTER TABLE`
- Pedir dados ao usuário com a transação aberta: segundos viram minutos de bloqueio
- Confiar em `ROLLBACK` numa tabela MyISAM
- Usar `ROLLBACK TO SAVEPOINT` e achar que a transação terminou: ela continua aberta até o `COMMIT`
:::

---

## :icon[list-checks] Resumo

:::summary
- Uma transação agrupa comandos em uma unidade tudo ou nada: `START TRANSACTION`, depois `COMMIT` ou `ROLLBACK`
- Com autocommit ligado, cada comando solto já é uma transação confirmada
- ACID: atomicidade, consistência, isolamento e durabilidade
- `SAVEPOINT` permite desfazer só uma parte sem encerrar a transação
- DDL faz commit implícito, e só o InnoDB suporta transações
:::

---

## :icon[arrow-right] Próximos passos

Você viu que cada transação enxerga um estado coerente. Mas o que acontece quando **duas sessões** mexem na mesma linha ao mesmo tempo?

Na próxima aula, **Concorrência e níveis de isolamento**, você vai conhecer as leituras suja, não repetível e fantasma, e os quatro níveis que controlam cada uma.

Antes disso, faça o quiz desta aula e confirme que `COMMIT`, `ROLLBACK` e `SAVEPOINT` ficaram claros.
