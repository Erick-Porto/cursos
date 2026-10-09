---
title: Triggers
summary: "Código que dispara sozinho em INSERT, UPDATE e DELETE: auditoria, validação com SIGNAL e os riscos envolvidos."
module: programacao-no-banco
duration_minutes: 30
objectives:
  - Explicar o que é um trigger e quando usá-lo
  - Escrever triggers BEFORE e AFTER usando OLD e NEW
  - Auditar mudanças em uma tabela de log e validar dados com SIGNAL
  - Reconhecer riscos e gerenciar triggers com SHOW e DROP
---

# Triggers

Administração de Bancos de Dados · Aula 24

---

## O que você vai aprender

:::goal
- O que um trigger faz e os três usos clássicos: log, validação e campos derivados
- A anatomia de `CREATE TRIGGER` e a diferença entre `BEFORE` e `AFTER`
- Como `OLD` e `NEW` dão acesso à linha afetada
- Como auditar o estoque, barrar dados inválidos com `SIGNAL` e evitar armadilhas
:::

---

## :icon[lightbulb] Por que isso importa

O estoque do Notebook caiu de 5 para 2 em algum momento da semana. Ninguém sabe quando, nem qual sistema fez a baixa. Três aplicações diferentes alteram `produtos`, e só uma delas grava um histórico.

:::question
Como garantir que **toda** alteração de estoque fique registrada, não importa de onde venha?
:::

Uma regra que precisa valer sempre, para qualquer cliente do banco, é uma boa candidata a trigger.

---

## :icon[zap] O que é um trigger

Um **trigger** (gatilho) é um bloco de código ligado a uma tabela. O SGBD o executa sozinho quando acontece um `INSERT`, `UPDATE` ou `DELETE` naquela tabela. Ninguém chama um trigger: ele dispara.

Três usos clássicos:

- :icon[scroll-text] **Log**: registrar quem mudou o quê e quando
- :icon[shield] **Validação**: barrar valores que uma `CHECK` simples não cobre
- :icon[calculator] **Campos derivados**: preencher uma coluna a partir de outras

| Momento | Serve para |
|---|---|
| `BEFORE` | conferir ou ajustar a linha antes de gravar |
| `AFTER` | reagir ao que já foi gravado |

---

## :icon[code] Anatomia de um trigger

```sql
DELIMITER $$
CREATE TRIGGER nome_do_trigger
BEFORE INSERT ON tabela          -- momento + evento + tabela
FOR EACH ROW                     -- roda uma vez por linha afetada
BEGIN
  -- aqui você usa NEW.coluna e OLD.coluna
END $$
DELIMITER ;
```

- Momento: `BEFORE` ou `AFTER`
- Evento: `INSERT`, `UPDATE` ou `DELETE`, um por trigger no MySQL
- `FOR EACH ROW` é obrigatório: um `UPDATE` de 100 linhas executa o corpo 100 vezes

:::tip
Nomeie como `trg_tabela_momento_evento`: `trg_produtos_au_estoque` lê-se "produtos, after update, estoque".
:::

---

## :icon[timer] A linha do tempo de um INSERT

:::center
![Animação: em um INSERT, o trigger BEFORE roda primeiro, depois a linha é gravada e por fim o trigger AFTER dispara; os três passos acendem em ordem](images/24-linha-do-tempo-insert.svg)
:::

Os três passos acontecem na mesma transação. Se o `BEFORE` lançar um erro, nada é gravado e o `AFTER` nunca roda. Se o `AFTER` falhar, a gravação também é desfeita.

---

## :icon[history] OLD e NEW

Dentro do corpo, duas pseudolinhas dão acesso aos dados da linha afetada:

| Evento | `OLD` | `NEW` |
|---|---|---|
| `INSERT` | não existe | a linha que vai entrar |
| `UPDATE` | a linha antes da mudança | a linha depois da mudança |
| `DELETE` | a linha que vai sair | não existe |

:::tip
Em triggers `BEFORE`, você pode **alterar** `NEW` antes da gravação: `SET NEW.email = LOWER(TRIM(NEW.email));`. Em `AFTER`, `NEW` e `OLD` são só leitura.
:::

---

## :icon[scroll-text] Auditoria de estoque: a tabela de log

:::center
![Fluxo: um UPDATE em produtos dispara o trigger AFTER UPDATE, que insere uma linha em log_estoque sem que a aplicação saiba](images/24-auditoria-estoque.svg)
:::

```sql
CREATE TABLE log_estoque (
  id INT AUTO_INCREMENT PRIMARY KEY,
  produto_id INT NOT NULL,
  estoque_anterior INT NOT NULL,
  estoque_novo INT NOT NULL,
  usuario VARCHAR(80),
  alterado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

Cada linha do log guarda o antes, o depois, quem e quando.

---

## :icon[scroll-text] Auditoria de estoque: o trigger

```sql
DELIMITER $$
CREATE TRIGGER trg_produtos_au_estoque
AFTER UPDATE ON produtos
FOR EACH ROW
BEGIN
  IF OLD.estoque <> NEW.estoque THEN
    INSERT INTO log_estoque (produto_id, estoque_anterior, estoque_novo, usuario)
    VALUES (NEW.id, OLD.estoque, NEW.estoque, CURRENT_USER());
  END IF;
END $$
DELIMITER ;
```

```sql
UPDATE produtos SET estoque = estoque - 3 WHERE id = 5;
SELECT produto_id, estoque_anterior, estoque_novo, usuario FROM log_estoque;
```

| produto_id | estoque_anterior | estoque_novo | usuario |
|---|---|---|---|
| 5 | 5 | 2 | app@localhost |

O `IF` evita ruído: um `UPDATE` que muda só o preço não gera log.

---

## :icon[shield] Validação com SIGNAL

```sql
DELIMITER $$
CREATE TRIGGER trg_itens_pedido_bi_estoque
BEFORE INSERT ON itens_pedido
FOR EACH ROW
BEGIN
  DECLARE v_estoque INT;
  SELECT estoque INTO v_estoque FROM produtos WHERE id = NEW.produto_id;
  IF NEW.quantidade > v_estoque THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Estoque insuficiente para o produto';
  END IF;
END $$
DELIMITER ;
```

`SIGNAL` lança um erro e cancela o `INSERT`. O estado `45000` é reservado para erros definidos por você. Tentar vender 1 Webcam (estoque 0) devolve `ERROR 1644 (45000): Estoque insuficiente para o produto`.

---

## :icon[wrench] Gerenciar triggers

```sql
SHOW TRIGGERS FROM loja;
SHOW TRIGGERS LIKE 'produtos';
DROP TRIGGER IF EXISTS trg_produtos_au_estoque;
```

`SHOW TRIGGERS` mostra tabela, evento, momento e o corpo. Não existe `ALTER TRIGGER` no MySQL: para mudar, `DROP` e `CREATE` de novo.

:::info
Uma tabela pode ter vários triggers para o mesmo evento; a ordem segue a criação, ou `FOLLOWS` e `PRECEDES` na definição. No PostgreSQL, o corpo fica em uma função separada e o trigger apenas a referencia.
:::

---

## :icon[triangle-alert] Riscos e boas práticas

::::columns
:::col
**Riscos**

- :icon[eye-off] Efeito invisível: um `UPDATE` simples falha ou demora e ninguém lembra do trigger
- :icon[git-branch] Cascata: o trigger grava em outra tabela, que tem outro trigger, e assim por diante
- :icon[gauge] Desempenho: o corpo roda por linha; cargas em massa sofrem
:::
:::col
**Boas práticas**

- Nome que diz tabela, momento e evento
- Corpo curto; lógica pesada vai para uma procedure
- Nunca chame serviços externos
- Documente em comentário e no repositório
- Teste dentro de uma transação, com `ROLLBACK`
:::
::::

---

## :icon[scale] Banco ou aplicação?

| Coloque no banco quando | Coloque na aplicação quando |
|---|---|
| a regra vale para todos os clientes do banco | a regra muda com a tela ou o perfil do usuário |
| é integridade: log, saldo, estoque | precisa de serviços externos (e-mail, API) |
| vários sistemas gravam na mesma tabela | a equipe não versiona SQL |

Não existe resposta única. A combinação mais comum: integridade e auditoria no banco, fluxo de negócio na aplicação.

---

## :icon[flask-conical] Pratique

:::question
A loja não permite cancelar um pedido que já foi **enviado**. Hoje a regra existe só na tela, e um script de manutenção acaba de cancelar o pedido 2.

Crie `trg_pedidos_bu_status`, um trigger `BEFORE UPDATE` em `pedidos` que lança um erro com `SIGNAL` quando o status sai de `'enviado'` para `'cancelado'`.

Depois teste: `UPDATE pedidos SET status = 'cancelado' WHERE id = 2;`
:::

---

## :icon[circle-check] Solução

```sql
DELIMITER $$
CREATE TRIGGER trg_pedidos_bu_status
BEFORE UPDATE ON pedidos
FOR EACH ROW
BEGIN
  IF OLD.status = 'enviado' AND NEW.status = 'cancelado' THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Pedido enviado não pode ser cancelado';
  END IF;
END $$
DELIMITER ;

UPDATE pedidos SET status = 'cancelado' WHERE id = 2;
```

Resultado: `ERROR 1644 (45000): Pedido enviado não pode ser cancelado`, e o pedido 2 continua `enviado`. Cancelar o pedido 3, que está `aberto`, passa normalmente, porque a condição compara `OLD` com `NEW`.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Usar `OLD` em `INSERT` ou `NEW` em `DELETE`: essas pseudolinhas não existem nesses eventos
- Tentar alterar `NEW` em um trigger `AFTER`: só `BEFORE` pode ajustar a linha
- Fazer `UPDATE` na própria tabela dentro do trigger: o MySQL bloqueia; use `SET NEW.coluna` em `BEFORE`
- Esquecer `FOR EACH ROW`: o MySQL exige a cláusula
- Criar um trigger pesado e culpar o índice quando o `UPDATE` ficar lento
:::

---

## :icon[list-checks] Resumo

:::summary
- Um **trigger** dispara sozinho em `INSERT`, `UPDATE` ou `DELETE`, antes (`BEFORE`) ou depois (`AFTER`) da gravação
- `OLD` guarda a linha anterior; `NEW`, a nova; só `BEFORE` pode alterar `NEW`
- `AFTER UPDATE` com `IF OLD <> NEW` é o padrão de auditoria em tabela de log
- `SIGNAL SQLSTATE '45000'` cancela a operação com uma mensagem sua
- Triggers são invisíveis para quem executa o comando: mantenha-os curtos, nomeados e documentados
:::

---

## :icon[arrow-right] Próximos passos

Na próxima aula, **Tabelas temporárias**, você vai criar rascunhos que vivem só na sua sessão para quebrar consultas complexas em etapas e conferir cada uma delas.

Antes, faça o quiz: ele cobra `OLD`, `NEW` e o efeito de um `SIGNAL`.
