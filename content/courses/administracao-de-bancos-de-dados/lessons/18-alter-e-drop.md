---
title: "Evoluindo o esquema: ALTER e DROP"
summary: Mude colunas, constraints e tabelas sem perder dados, e saiba quando o DROP é definitivo.
module: sql-manipulacao-e-estrutura
duration_minutes: 25
objectives:
  - Alterar colunas e constraints de uma tabela com ALTER TABLE
  - Avaliar o risco de um ALTER em tabelas grandes e organizar mudanças em migrations
  - Remover tabelas e bancos com DROP, diferenciando DROP, TRUNCATE e DELETE
  - Tratar dependências de chave estrangeira antes de remover uma tabela
---

# Evoluindo o esquema: ALTER e DROP

Administração de Bancos de Dados · Aula 18

---

## O que você vai aprender

:::goal
- Adicionar, modificar, renomear e remover colunas com `ALTER TABLE`
- Incluir e retirar constraints de uma tabela que já tem dados
- Por que um `ALTER` em tabela grande merece planejamento, e como as migrations ajudam
- Usar `DROP` com segurança e distinguir `DROP`, `TRUNCATE` e `DELETE`
:::

---

## :icon[circle-help] Por que isso importa

A tabela `funcionarios` nasceu com `nome`, `cargo`, `salario` e `departamento_id`. Três meses depois, o RH pede:

- :icon[mail] um e-mail por funcionário, sem repetição
- :icon[calendar] a data de admissão
- :icon[coins] salários acima de R$ 99.999.999,99 (um diretor da matriz)

Ninguém acerta a estrutura de primeira. O **esquema** evolui junto com o negócio, e a tabela já tem dados que não podem sumir.

:::question
Como adicionar uma coluna obrigatória a uma tabela com 2 milhões de linhas, sem parar o sistema e sem inventar valores?
:::

---

## :icon[plus] Adicionar colunas: ADD COLUMN

```sql
ALTER TABLE funcionarios
  ADD COLUMN email VARCHAR(160) AFTER nome;

ALTER TABLE funcionarios
  ADD COLUMN data_admissao DATE NOT NULL DEFAULT (CURRENT_DATE);
```

`AFTER nome` posiciona a coluna; `FIRST` coloca no início. Sem os dois, ela vai para o fim.

| id | nome | email | cargo | data_admissao |
|---|---|---|---|---|
| 1 | Marcos Silva | NULL | DBA | 2025-06-01 |
| 2 | Júlia Costa | NULL | Analista | 2025-06-01 |

:::tip
Coluna nova em tabela com dados nasce `NULL` em todas as linhas. Se ela for `NOT NULL`, informe um `DEFAULT`: é o valor que as linhas antigas recebem (acima, a data do dia em que o `ALTER` rodou).
:::

---

## :icon[pencil] MODIFY COLUMN e CHANGE COLUMN

Os dois redefinem uma coluna; a diferença é o nome.

```sql
-- MODIFY: muda tipo, tamanho ou atributos; o nome fica
ALTER TABLE funcionarios
  MODIFY COLUMN salario DECIMAL(12,2) NOT NULL;

-- CHANGE: renomeia e, obrigatoriamente, redefine a coluna inteira
ALTER TABLE funcionarios
  CHANGE COLUMN cargo funcao VARCHAR(60);

-- Só renomear, sem repetir a definição (MySQL 8)
ALTER TABLE funcionarios RENAME COLUMN funcao TO cargo;
```

:::warning
Diminuir o tamanho (`VARCHAR(120)` para `VARCHAR(60)`) ou trocar o tipo pode truncar ou falhar nas linhas que não cabem. Tornar `NOT NULL` uma coluna que já tem `NULL` falha com `ERROR 1138: Invalid use of NULL value`. Trate os dados antes.
:::

:::info
No PostgreSQL: `ALTER COLUMN salario TYPE NUMERIC(12,2)` e `ALTER COLUMN salario SET NOT NULL`.
:::

---

## :icon[trash-2] Remover colunas e renomear a tabela

```sql
ALTER TABLE funcionarios DROP COLUMN data_admissao;

ALTER TABLE funcionarios RENAME TO colaboradores;
RENAME TABLE colaboradores TO funcionarios;  -- forma alternativa, desfazendo
```

`DROP COLUMN` apaga a coluna **e todos os valores dela**, sem confirmação e sem volta. Antes de rodar:

:::steps
1. Procure a coluna em views, índices, constraints e no código das aplicações
2. Faça um backup, ou copie a coluna para uma tabela auxiliar
3. Rode primeiro em um ambiente de testes
:::

:::tip
Várias alterações cabem em um único `ALTER TABLE`, separadas por vírgula. A tabela é reconstruída uma vez só, em vez de uma vez por comando.
:::

---

## :icon[shield] Constraints: adicionar e remover

```sql
ALTER TABLE funcionarios
  ADD CONSTRAINT uq_funcionarios_email UNIQUE (email),
  ADD CONSTRAINT chk_funcionarios_salario CHECK (salario >= 0),
  ADD CONSTRAINT fk_funcionarios_departamento
    FOREIGN KEY (departamento_id) REFERENCES departamentos(id);
```

O MySQL confere os dados existentes na hora: se já houver um e-mail repetido ou um `departamento_id` sem departamento, o `ALTER` inteiro falha.

Para remover, o nome da constraint é tudo:

```sql
ALTER TABLE funcionarios DROP CONSTRAINT chk_funcionarios_salario;
ALTER TABLE funcionarios DROP FOREIGN KEY fk_funcionarios_departamento;
ALTER TABLE funcionarios DROP INDEX uq_funcionarios_email;
```

:::info
`DROP CONSTRAINT` funciona para qualquer tipo desde o MySQL 8.0.19. `DROP FOREIGN KEY` e `DROP INDEX` (para `UNIQUE`) são as formas antigas, ainda muito usadas.
:::

---

## :icon[flask-conical] Pratique

Aplique as mudanças pedidas pelo RH na tabela `funcionarios`:

:::example
1. Adicione `email VARCHAR(160)` logo após `nome`, único, com a constraint chamada `uq_funcionarios_email`
2. Faça `salario` aceitar até 12 dígitos com 2 decimais, obrigatório e nunca negativo (`chk_funcionarios_salario`)
3. Adicione `ativo BOOLEAN NOT NULL DEFAULT TRUE`
4. Renomeie `cargo` para `funcao`, confira com `DESCRIBE` e volte ao nome original
:::

Confira o resultado com `DESCRIBE funcionarios;` e tente gravar um salário de `-1`.

---

## :icon[circle-check] Solução

```sql
ALTER TABLE funcionarios
  ADD COLUMN email VARCHAR(160) AFTER nome,
  ADD CONSTRAINT uq_funcionarios_email UNIQUE (email);

ALTER TABLE funcionarios
  MODIFY COLUMN salario DECIMAL(12,2) NOT NULL,
  ADD CONSTRAINT chk_funcionarios_salario CHECK (salario >= 0),
  ADD COLUMN ativo BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE funcionarios RENAME COLUMN cargo TO funcao;
ALTER TABLE funcionarios RENAME COLUMN funcao TO cargo;  -- de volta
```

O `UNIQUE` em `email` funciona mesmo com a coluna vazia: vários `NULL` não contam como repetição. O teste `UPDATE funcionarios SET salario = -1 WHERE id = 3;` é recusado com `ERROR 3819: Check constraint 'chk_funcionarios_salario' is violated.`

`DESCRIBE funcionarios;` mostra as colunas na ordem `id, nome, email, cargo, salario, departamento_id, ativo`.

---

## :icon[timer] ALTER em tabelas grandes

Em `funcionarios`, com 5 linhas, tudo é instantâneo. Em uma tabela de 50 milhões de linhas, um `ALTER` pode:

- :icon[hourglass] **demorar**: o MySQL pode precisar reconstruir a tabela inteira em uma cópia
- :icon[lock] **bloquear**: em partes da operação, escritas (às vezes leituras) ficam esperando
- :icon[hard-drive] **ocupar disco**: a cópia temporária precisa do mesmo espaço que a tabela

O MySQL 8 tem três algoritmos: `INSTANT` (só metadados; serve para adicionar coluna, por exemplo), `INPLACE` (sem cópia completa) e `COPY` (reconstrói tudo). Peça o mais leve e deixe o servidor avisar se não der:

```sql
ALTER TABLE pedidos ADD COLUMN observacao VARCHAR(200), ALGORITHM=INSTANT;
```

:::tip
Meça o tempo em um ambiente de testes com volume parecido, avise a equipe e agende uma janela se precisar.
:::

---

## :icon[git-branch] Migrations: o esquema com histórico

Em vez de rodar `ALTER` à mão em cada servidor, equipes guardam cada mudança em um arquivo numerado, a **migration**, versionado junto com o código.

:::center
![Linha do tempo do esquema: v1 cria funcionarios, v2 adiciona email com ALTER, v3 amplia salario com outro ALTER; cada passo é um arquivo numerado](images/18-linha-do-tempo-migrations.svg)
:::

- :icon[list-ordered] Cada arquivo roda **uma vez**, na ordem; uma tabela de controle registra o que já foi aplicado
- :icon[lock] Migration aplicada não se edita: a correção é uma migration nova
- :icon[server] Desenvolvimento, testes e produção chegam ao mesmo esquema pelo mesmo caminho
- :icon[rotate-ccw] Pense no caminho de volta (`DROP COLUMN email`, por exemplo) antes de aplicar

---

## :icon[siren] DROP TABLE e DROP DATABASE

```sql
DROP TABLE IF EXISTS funcionarios_backup;
DROP DATABASE IF EXISTS loja_teste;
```

`IF EXISTS` evita erro quando o objeto não existe: útil em scripts que rodam mais de uma vez.

:::danger
`DROP` apaga a estrutura **e todos os dados**, sem confirmação. É DDL: faz commit implícito e não aceita `ROLLBACK`. `DROP DATABASE` leva junto todas as tabelas, views e índices do banco. A única volta é um backup recente e testado.
:::

Antes de qualquer `DROP` em produção:

- :icon[search] confirme o nome e o banco atual (`SELECT DATABASE();`)
- :icon[database-backup] garanta um backup recente e testado
- :icon[users] verifique quem mais depende do objeto: views, procedures, aplicações

---

## :icon[scale] DROP, TRUNCATE ou DELETE?

| | `DELETE FROM t` | `TRUNCATE TABLE t` | `DROP TABLE t` |
|---|---|---|---|
| Remove | as linhas (ou só as filtradas) | todas as linhas | linhas e estrutura |
| Tipo | DML | DDL | DDL |
| `ROLLBACK` | sim | não | não |
| `AUTO_INCREMENT` | continua | volta a 1 | some com a tabela |
| Velocidade | linha a linha | quase instantâneo | quase instantâneo |

`TRUNCATE` parece um `DELETE` rápido, mas é DDL: commit implícito, sem triggers de `DELETE`, e falha se outra tabela tiver `FOREIGN KEY` apontando para esta.

:::tip
Para esvaziar uma tabela de testes, `TRUNCATE`. Para apagar linhas de verdade, `DELETE ... WHERE` em uma transação.
:::

---

## :icon[link] Dependências: quem aponta para quem

`funcionarios.departamento_id` referencia `departamentos.id`. Enquanto essa chave estrangeira existir, o MySQL recusa apagar a tabela pai:

```sql
DROP TABLE departamentos;
-- ERROR 3730: Cannot drop table 'departamentos' referenced by a foreign key
-- constraint 'fk_funcionarios_departamento' on table 'funcionarios'.
```

:::center
![Tabela funcionarios aponta para departamentos pela chave estrangeira; o DROP da tabela pai é bloqueado até remover a FK ou a tabela filha](images/18-dependencia-fk.svg)
:::

Ordem segura: remova primeiro a `FOREIGN KEY` (ou a tabela filha), depois a tabela pai. Existe `SET FOREIGN_KEY_CHECKS = 0`, que desliga a verificação, mas deixa `departamento_id` apontando para o nada. Use só em cargas controladas, e religue em seguida.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Rodar `ALTER` ou `DROP` direto em produção, sem testar antes com volume parecido
- Escrever `DROP TABLE departamentos CASCADE`: o MySQL aceita a palavra, mas o `CASCADE` não faz nada
- Usar `TRUNCATE` achando que dá para voltar com `ROLLBACK`
- Diminuir o tamanho de uma coluna sem checar se todos os valores cabem
- Remover uma `FOREIGN KEY` e esquecer o índice que ela criou, que continua ocupando espaço
:::

---

## :icon[list-checks] Resumo

:::summary
- `ALTER TABLE` adiciona (`ADD COLUMN`), redefine (`MODIFY`, `CHANGE`), renomeia (`RENAME COLUMN`, `RENAME TO`) e remove (`DROP COLUMN`) colunas
- Constraints entram com `ADD CONSTRAINT` e saem pelo nome: por isso vale nomeá-las
- Em tabelas grandes, `ALTER` custa tempo, disco e bloqueios; migrations versionadas dão ordem e histórico às mudanças
- `DROP` e `TRUNCATE` são DDL, sem `ROLLBACK`; a proteção é backup e atenção às dependências
:::

---

## :icon[arrow-right] Próximos passos

Com `CREATE`, `ALTER` e `DROP` você já constrói e evolui qualquer esquema. Na próxima aula, **Views e índices**, você cria consultas com nome, para simplificar relatórios e esconder colunas sensíveis, e descobre como um índice transforma uma varredura completa em uma busca direta.

Antes, faça o quiz desta aula e teste o que aprendeu sobre `ALTER` e `DROP`.
