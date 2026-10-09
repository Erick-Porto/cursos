---
title: Locks e deadlocks
summary: Como o InnoDB trava linhas, o que é um deadlock e como evitá-lo com transações curtas e ordem fixa.
module: transacoes
duration_minutes: 25
objectives:
  - Diferenciar controle pessimista de otimista e locks compartilhados de exclusivos
  - Proteger leituras com SELECT ... FOR UPDATE e FOR SHARE
  - Explicar como um deadlock surge e como o InnoDB o resolve
  - Aplicar boas práticas que reduzem bloqueios e deadlocks
---

# Locks e deadlocks

Administração de Bancos de Dados · Aula 22

---

## O que você vai aprender

:::goal
- Duas estratégias para lidar com conflito: travar antes ou conferir depois
- Locks compartilhados e exclusivos, e por que o InnoDB trava por linha
- `SELECT ... FOR UPDATE`, `FOR SHARE` e o lock wait timeout
- O que é um deadlock, como o InnoDB o resolve e como evitá-lo
:::

---

## :icon[swords] Por que isso importa

Resta **1 Notebook** no estoque. Ana e Bruno clicam em "comprar" no mesmo segundo.

:::steps
1. A sessão da Ana lê `estoque = 1`
2. A sessão do Bruno lê `estoque = 1`
3. As duas calculam `1 - 1` e gravam `estoque = 0`
:::

Dois pedidos, um produto. O isolamento não impediu isso: cada sessão leu um valor verdadeiro na hora. Faltou **coordenar a escrita**.

:::question
Como fazer a segunda sessão esperar a primeira terminar?
:::

---

## :icon[scale] Pessimista ou otimista

::::columns
:::col
**Controle pessimista**

Assume que o conflito é provável. Trava o recurso antes de usá-lo; quem chegar depois **espera**.

É o que o InnoDB faz com locks.
:::
:::col
**Controle otimista**

Assume que o conflito é raro. Lê sem travar e, ao gravar, **confere** se nada mudou. Se mudou, repete.
:::
::::

```sql
-- otimista, com uma coluna versao na tabela
UPDATE produtos SET estoque = 0, versao = versao + 1
WHERE id = 5 AND versao = 7;   -- 0 linhas afetadas? alguém passou na frente
```

---

## :icon[lock] Locks compartilhados e exclusivos

- **Compartilhado (S)**: para ler. Várias transações podem segurar um S na mesma linha ao mesmo tempo
- **Exclusivo (X)**: para escrever. Só uma transação por vez, e ninguém mais lê com lock enquanto ele dura

| já existe | pedido de S | pedido de X |
|---|---|---|
| nenhum lock | concedido | concedido |
| lock S | concedido | espera |
| lock X | espera | espera |

`INSERT`, `UPDATE` e `DELETE` pegam lock X sozinhos. Um `SELECT` comum no InnoDB **não trava nada**: ele lê a fotografia da transação.

---

## :icon[rows-3] Granularidade: linha, página ou tabela

:::center
![Comparação: lock de linha deixa as outras linhas livres; lock de tabela faz todas as sessões esperarem](images/22-granularidade.svg)
:::

O InnoDB trava **por linha** (na verdade, por registro de índice). Duas vendas de produtos diferentes não esperam uma pela outra. O MyISAM trava a **tabela inteira** a cada escrita.

:::warning
Sem índice na coluna do `WHERE`, o InnoDB varre a tabela e trava **todas** as linhas que examinou. Um `UPDATE ... WHERE nome = 'Mouse'` sem índice em `nome` vira, na prática, um lock de tabela.
:::

---

## :icon[key-round] SELECT ... FOR UPDATE e FOR SHARE

Para a venda do último Notebook, leia a linha **já travando** com lock X:

```sql
START TRANSACTION;
SELECT estoque FROM produtos WHERE id = 5 FOR UPDATE;  -- lock X na linha
-- a aplicação confere: ainda tem estoque?
UPDATE produtos SET estoque = estoque - 1 WHERE id = 5;
COMMIT;   -- libera o lock; só agora a sessão do Bruno lê
```

`FOR SHARE` pega lock S: você lê e garante que ninguém altera a linha até o seu `COMMIT`, mas outras sessões também podem ler com `FOR SHARE`.

:::tip
`FOR UPDATE NOWAIT` falha na hora se a linha estiver travada; `FOR UPDATE SKIP LOCKED` pula as linhas travadas. Útil em filas de tarefas.
:::

---

## :icon[swords] Deadlock: a espera circular

:::center
![Animação: T1 trava a linha A e espera B, T2 trava B e espera A; as setas de espera formam um ciclo e o InnoDB desfaz T2](images/22-deadlock.svg)
:::

Um **deadlock** acontece quando duas transações seguram o que a outra precisa. Sem ajuda, esperariam para sempre.

O InnoDB detecta o ciclo **na hora** (`innodb_deadlock_detect = ON`), escolhe uma **vítima**, em geral a transação que alterou menos linhas, e a desfaz por completo. A outra segue normalmente.

---

## :icon[hourglass] Timeout e deadlock: dois erros diferentes

Esperar um lock não é para sempre: o limite é `innodb_lock_wait_timeout`, **50 segundos** por padrão.

| | espera longa | deadlock |
|---|---|---|
| erro | 1205 `Lock wait timeout exceeded` | 1213 `Deadlock found when trying to get lock` |
| quando | passou de 50 s esperando | ciclo detectado na hora |
| o que é desfeito | só o comando que esperava | a transação inteira da vítima |
| o que fazer | repetir ou desfazer; achar a transação longa | repetir a transação do zero |

Os dois terminam com a mesma dica: `try restarting transaction`.

---

## :icon[search] Investigando locks e deadlocks

Dois lugares para olhar quando algo trava:

```sql
SHOW ENGINE INNODB STATUS;
-- seção LATEST DETECTED DEADLOCK: as duas transações e os locks envolvidos

SELECT object_name, lock_type, lock_mode, lock_status
FROM performance_schema.data_locks;
```

| object_name | lock_type | lock_mode | lock_status |
|---|---|---|---|
| produtos | TABLE | IX | GRANTED |
| produtos | RECORD | X,REC_NOT_GAP | GRANTED |
| produtos | RECORD | X,REC_NOT_GAP | WAITING |

`data_lock_waits` mostra quem espera por quem. Com `innodb_print_all_deadlocks = ON`, cada deadlock vai para o log de erros.

---

## :icon[flask-conical] Pratique

Duas sessões rodam ao mesmo tempo, intercalando os comandos na ordem das linhas:

::::columns
:::col
**Sessão A**

```sql
START TRANSACTION;
UPDATE produtos SET estoque = estoque - 1 WHERE id = 1;
-- (B executa o primeiro UPDATE)
UPDATE produtos SET estoque = estoque - 1 WHERE id = 2;
COMMIT;
```
:::
:::col
**Sessão B**

```sql
START TRANSACTION;
UPDATE produtos SET estoque = estoque - 1 WHERE id = 2;
-- (A tenta o segundo UPDATE)
UPDATE produtos SET estoque = estoque - 1 WHERE id = 1;
COMMIT;
```
:::
::::

:::question
1. Em que momento surge o deadlock? 2. Qual sessão recebe o erro? 3. Como reescrever B para evitar o problema?
:::

---

## :icon[circle-check] Solução

:::steps
1. A trava a linha 1; B trava a linha 2
2. A pede a linha 2 e **espera** B
3. B pede a linha 1 e **espera** A: ciclo fechado, deadlock
4. O InnoDB escolhe uma vítima, em geral a que alterou menos linhas. Suponha B: ela é desfeita com o erro 1213
5. A recebe a linha 2 e conclui; a aplicação repete B
:::

Correção: faça B atualizar na **mesma ordem** que A (id 1, depois id 2). Com ordem fixa, quem chega depois apenas espera, sem ciclo.

:::tip
Um único `UPDATE ... WHERE id IN (1, 2)` também resolve: o InnoDB trava as linhas na ordem do índice.
:::

---

## :icon[shield-check] Boas práticas contra bloqueios

- :icon[timer] **Transações curtas**: abra, grave, confirme. Nunca espere o usuário com a transação aberta
- :icon[list-ordered] **Mesma ordem** de acesso às tabelas e às linhas em todo o código
- :icon[key-round] **Índices** nas colunas do `WHERE` de `UPDATE` e `DELETE`: menos linhas travadas
- :icon[refresh-cw] **Trate o erro 1213** e repita a transação algumas vezes antes de desistir
- :icon[lock] Use `FOR UPDATE` logo na leitura quando for alterar a linha
- :icon[gauge] Desça para `READ COMMITTED` só onde você mediu contenção de gap locks

---

## :icon[triangle-alert] Erros comuns

:::warning
- Ler com `SELECT` comum, calcular na aplicação e gravar: duas sessões vendem o mesmo último item
- Tratar o deadlock como bug do banco. Ele é esperado; o bug é não repetir a transação
- Confundir timeout (desfaz o comando, erro 1205) com deadlock (desfaz a transação, erro 1213)
- Fazer `UPDATE` com `WHERE` em coluna sem índice e travar a tabela inteira sem perceber
- Pegar `FOR SHARE` em duas sessões e depois tentar `UPDATE` nas duas: deadlock garantido
:::

---

## :icon[list-checks] Resumo

:::summary
- Pessimista trava antes (locks); otimista confere na hora de gravar (versão) e repete
- Lock S permite várias leituras; lock X é exclusivo para escrita. O InnoDB trava por linha de índice
- `SELECT ... FOR UPDATE` trava a linha antes da alteração; `FOR SHARE` só impede escritas
- Espera demais gera o erro 1205; espera circular é deadlock, erro 1213, resolvido com rollback da vítima
- Transações curtas, ordem fixa, índices e repetição em caso de 1213
:::

---

## :icon[arrow-right] Próximos passos

Este foi o último tema do módulo **Transações e concorrência**. Você já sabe agrupar comandos, escolher o isolamento e lidar com locks.

No próximo módulo, **Programação no banco**, a lógica passa a morar dentro do MySQL. A próxima aula, **Stored procedures**, mostra como empacotar uma venda inteira, com transação e tratamento de erro, em um único `CALL`.

Faça o quiz desta aula para fechar o módulo.
