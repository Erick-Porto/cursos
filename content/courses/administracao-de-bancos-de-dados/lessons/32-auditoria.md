---
title: Auditoria em bancos de dados
summary: Quem fez o quê, quando e de onde; estratégias, triggers de auditoria com JSON, boas práticas e LGPD.
module: operacao
duration_minutes: 30
objectives:
  - Explicar o que auditar em um banco e por quê
  - Comparar logs do servidor, plugins, triggers e auditoria na aplicação
  - Implementar triggers de auditoria que guardam dados antigos e novos em JSON
  - Aplicar boas práticas e relacionar a auditoria à LGPD
---

# Auditoria em bancos de dados

Administração de Bancos de Dados · Aula 32

---

## O que você vai aprender

:::goal
- Responder "quem fez o quê, quando e de onde" com uma trilha de auditoria
- Escolher o que auditar e qual estratégia usar: logs, plugins, triggers ou aplicação
- Criar a tabela `auditoria_clientes` e os triggers `AFTER INSERT`, `AFTER UPDATE` e `AFTER DELETE`
- Proteger a trilha e usá-la para atender à LGPD
:::

---

## :icon[siren] Por que isso importa

Segunda-feira, o preço do Notebook aparece como R$ 420,00 em vez de R$ 4.200,00. Três pedidos já foram pagos. Quem alterou? Quando? Foi a aplicação, um script ou alguém no cliente `mysql`?

Sem auditoria, a resposta é "não sabemos". Com auditoria, o banco registra:

![Os quatro registros de uma trilha de auditoria: quem (conta da sessão), o quê (operação e dados antigos e novos), quando (data e hora) e de onde (host de origem)](images/32-quem-o-que-quando.svg)

Auditoria serve para **segurança** (detectar abuso), **conformidade** (provar que a lei é cumprida), **rastreabilidade** (reconstruir a história de um registro) e **investigação de incidentes**.

---

## :icon[eye] O que auditar

Auditar tudo gera volume demais e derruba o desempenho. Escolha os eventos que respondem a perguntas reais.

| Evento | Exemplo no `loja` | Por que registrar |
|---|---|---|
| Logins, inclusive falhos | 40 senhas erradas em um minuto | tentativa de invasão |
| DDL | `DROP TABLE pedidos`, `ALTER TABLE` | mudança de estrutura sem aprovação |
| DML em tabelas sensíveis | `UPDATE produtos SET preco`, `funcionarios.salario` | fraude e erro operacional |
| Mudança de privilégio | `GRANT ALL ON loja.* TO ...` | escalada de acesso |
| Leitura de dados pessoais | `SELECT` em `clientes` fora do horário | LGPD: quem acessou o quê |

`SELECT`, só nas tabelas com dados pessoais ou financeiros.

---

## :icon[workflow] Quatro estratégias

| Estratégia | Prós | Contras |
|---|---|---|
| **Logs do servidor** (`general_log`, binlog) | já existem, cobrem tudo | volume enorme; o binlog não registra `SELECT` nem logins |
| **Plugins** (MySQL Enterprise Audit, MariaDB Audit Plugin, Percona Audit Log; pgAudit no PostgreSQL) | logins, DDL e DML com filtros, sem tocar nas tabelas | licença ou instalação; sem valores antigos |
| **Triggers** | gravam `OLD` e `NEW` das colunas que você escolher | custo em cada escrita; não veem `SELECT` nem logins |
| **Na aplicação** | sabe o usuário de negócio, não só a conta do banco | quem acessa o banco por fora passa despercebido |

Combine: plugin para logins e DDL, triggers para as tabelas sensíveis.

---

## :icon[zap] Auditoria com triggers: o fluxo

![Fluxo: um UPDATE na tabela clientes dispara o trigger AFTER UPDATE, que lê OLD e NEW e insere uma linha em auditoria_clientes; relatórios consultam essa tabela](images/32-fluxo-auditoria.svg)

Um trigger `AFTER` roda depois que a operação deu certo, uma vez por linha afetada, e enxerga:

- **`OLD`**: a linha como estava antes (`UPDATE` e `DELETE`)
- **`NEW`**: a linha como ficou (`INSERT` e `UPDATE`)
- **`USER()`**: a conta e o host de quem está conectado, como `app@10.0.0.5`

Com `JSON_OBJECT()`, você guarda as colunas que interessam em um só campo, sem criar uma coluna de auditoria para cada coluna da tabela.

---

## :icon[table] A tabela de auditoria

```sql
CREATE TABLE auditoria_clientes (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  operacao ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
  usuario VARCHAR(160) NOT NULL,
  data_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  cliente_id INT NOT NULL,
  dados_antigos JSON,
  dados_novos JSON,
  INDEX idx_cliente (cliente_id),
  INDEX idx_data (data_hora)
);
```

- `cliente_id` sem `FOREIGN KEY`: o registro de auditoria precisa sobreviver ao `DELETE` do cliente
- `BIGINT`: a trilha cresce muito mais rápido que a tabela auditada
- Índices em `cliente_id` e `data_hora`: são os filtros de todo relatório

---

## :icon[circle-plus] Trigger AFTER INSERT

```sql
CREATE TRIGGER trg_clientes_ins
AFTER INSERT ON clientes
FOR EACH ROW
  INSERT INTO auditoria_clientes (operacao, usuario, cliente_id, dados_novos)
  VALUES ('INSERT', USER(), NEW.id,
          JSON_OBJECT('nome', NEW.nome, 'email', NEW.email, 'cidade', NEW.cidade));
```

Só existe `NEW`: a linha acabou de nascer, não há "antes".

:::tip
Com um único comando no corpo, o trigger dispensa `BEGIN ... END` e, por isso, o `DELIMITER` do cliente `mysql`. Use os dois quando precisar de `IF` ou de mais de um comando.
:::

---

## :icon[pencil] Trigger AFTER UPDATE

```sql
CREATE TRIGGER trg_clientes_upd
AFTER UPDATE ON clientes
FOR EACH ROW
  INSERT INTO auditoria_clientes
    (operacao, usuario, cliente_id, dados_antigos, dados_novos)
  VALUES ('UPDATE', USER(), NEW.id,
    JSON_OBJECT('nome', OLD.nome, 'email', OLD.email, 'cidade', OLD.cidade),
    JSON_OBJECT('nome', NEW.nome, 'email', NEW.email, 'cidade', NEW.cidade));
```

`OLD` e `NEW` lado a lado: é a comparação dos dois que mostra o que mudou.

:::warning
Dentro de um trigger, `CURRENT_USER()` devolve a conta de quem **criou** o trigger (o `DEFINER`), não a de quem executou o `UPDATE`. Para registrar o autor real, use `USER()`.
:::

---

## :icon[trash-2] Trigger AFTER DELETE

```sql
CREATE TRIGGER trg_clientes_del
AFTER DELETE ON clientes
FOR EACH ROW
  INSERT INTO auditoria_clientes (operacao, usuario, cliente_id, dados_antigos)
  VALUES ('DELETE', USER(), OLD.id,
          JSON_OBJECT('nome', OLD.nome, 'email', OLD.email, 'cidade', OLD.cidade));
```

Só existe `OLD`: a linha já foi embora. Esse JSON é, muitas vezes, a única cópia do que foi apagado e o ponto de partida para desfazer um `DELETE` indevido.

Pronto: as três operações em `clientes` deixam rastro.

---

## :icon[search] Consultando a trilha

Ana Souza mudou de cidade e a aplicação, conectada como `app@10.0.0.5`, rodou o `UPDATE`:

```sql
UPDATE clientes SET cidade = 'Niterói' WHERE id = 1;

SELECT operacao, usuario, data_hora,
       dados_antigos->>'$.cidade' AS antes,
       dados_novos->>'$.cidade' AS depois
FROM auditoria_clientes
WHERE cliente_id = 1
ORDER BY data_hora DESC;
```

| operacao | usuario | data_hora | antes | depois |
|---|---|---|---|---|
| UPDATE | app@10.0.0.5 | 2025-03-12 10:15:07 | Rio de Janeiro | Niterói |

O operador `->>` extrai um campo do JSON já sem aspas. Com `WHERE data_hora >= ...` e `usuario LIKE 'dba%'`, você monta o relatório de uma investigação.

---

## :icon[shield] Boas práticas

- :icon[lock] **Ninguém altera a trilha.** O trigger roda com os privilégios de quem o criou, então a aplicação não precisa de acesso a `auditoria_clientes`. Dê `SELECT` só a quem audita e `UPDATE` ou `DELETE` a ninguém.
- :icon[archive] **Retenção definida.** Arquive registros antigos em vez de deixar a tabela crescer para sempre.
- :icon[eye-off] **Nada de senhas ou cartões no JSON.** Registre que a coluna mudou, não o valor.
- :icon[gauge] **Desempenho.** Cada trigger é um `INSERT` a mais por linha. Audite as tabelas sensíveis, não todas.
- :icon[server] **Cópia fora do servidor.** Exporte a trilha para um sistema de logs: quem invade o banco não deve conseguir apagar as provas.

---

## :icon[scale] Conformidade: LGPD e outras normas

A **LGPD** (Lei Geral de Proteção de Dados) trata `clientes.nome`, `email` e `cidade` como **dados pessoais**. Para cada uso, a empresa precisa de uma **base legal** (contrato, consentimento, obrigação legal) e deve provar que protege esses dados.

Onde a auditoria entra:

- :icon[fingerprint] Registro de quem acessou e alterou dados pessoais, e de onde
- :icon[file-clock] Prova de que exclusões pedidas pelo titular foram feitas
- :icon[siren] Reconstrução de um incidente para notificar a ANPD e os afetados

:::info
Outras normas exigem o mesmo tipo de trilha: **SOX** (controles sobre dados financeiros de empresas listadas em bolsa) e **PCI DSS** (todo acesso a dados de cartão registrado e revisado).
:::

---

## :icon[flask-conical] Pratique

:::example Cenário
A tabela `produtos` precisa de auditoria, mas só para o que importa ao financeiro: **mudanças de preço e de estoque**. Alterar o nome ou a categoria não deve gerar registro.

Crie a tabela `auditoria_produtos` com `produto_id`, `usuario`, `data_hora`, preço antigo e novo, estoque antigo e novo, e o trigger `AFTER UPDATE` que grava apenas quando `preco` ou `estoque` mudou.
:::

---

## :icon[circle-check] Solução

```sql
CREATE TABLE auditoria_produtos (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  produto_id INT NOT NULL,
  usuario VARCHAR(160) NOT NULL,
  data_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  preco_antigo DECIMAL(10,2), preco_novo DECIMAL(10,2),
  estoque_antigo INT, estoque_novo INT
);
```

```sql
DELIMITER $$
CREATE TRIGGER trg_produtos_upd
AFTER UPDATE ON produtos FOR EACH ROW
BEGIN
  IF OLD.preco <> NEW.preco OR OLD.estoque <> NEW.estoque THEN
    INSERT INTO auditoria_produtos
      (produto_id, usuario, preco_antigo, preco_novo, estoque_antigo, estoque_novo)
    VALUES (NEW.id, USER(), OLD.preco, NEW.preco, OLD.estoque, NEW.estoque);
  END IF;
END$$
DELIMITER ;
```

O `IF` exige `BEGIN ... END`, e o `DELIMITER` impede que o cliente corte o comando no primeiro `;`.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Usar `CURRENT_USER()` no trigger e registrar sempre o DBA que o criou
- Colocar `FOREIGN KEY` da tabela de auditoria para a tabela auditada: o `DELETE` do cliente falha ou apaga a trilha em cascata
- Dar ao usuário da aplicação `DELETE` na tabela de auditoria
- Guardar senhas, tokens ou números de cartão dentro do JSON
- Auditar todas as tabelas com triggers e descobrir o custo no horário de pico
:::

---

## :icon[list-checks] Resumo

:::summary
- Auditoria registra **quem** fez **o quê**, **quando** e **de onde**, para segurança, conformidade, rastreabilidade e investigação
- Audite logins, DDL, DML em tabelas sensíveis, privilégios e leituras de dados pessoais; não tudo
- Logs e plugins cobrem o servidor inteiro; triggers guardam `OLD` e `NEW` das tabelas que você escolher
- Triggers `AFTER INSERT`, `AFTER UPDATE` e `AFTER DELETE` com `USER()` e `JSON_OBJECT()` montam a trilha; o `->>` consulta o JSON
- Proteja a trilha contra alteração, defina retenção e não registre segredos; a LGPD exige esse rastro para dados pessoais
:::

---

## :icon[arrow-right] Próximos passos

Este foi o último tema do módulo Operação do DBA. O próximo módulo, Projeto final e carreira, começa com "Projeto final: um banco de dados completo": você vai modelar, criar, popular, proteger e documentar um banco do zero, aplicando o que viu de modelagem a auditoria.

Antes, faça o quiz desta aula e confira se `OLD`, `NEW` e `USER()` ficaram claros.
