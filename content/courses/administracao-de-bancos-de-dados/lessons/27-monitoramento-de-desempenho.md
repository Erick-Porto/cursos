---
title: Monitoramento de desempenho
summary: "Como descobrir onde o banco está lento: gargalos, métricas do SO e do MySQL e as ferramentas do DBA."
module: operacao
duration_minutes: 25
objectives:
  - Explicar o que é um gargalo e a diferença entre monitoramento proativo e reativo
  - Interpretar as principais métricas do sistema operacional e do MySQL
  - Usar SHOW GLOBAL STATUS, SHOW PROCESSLIST e o sys schema para diagnosticar problemas
  - Aplicar boas práticas de linha de base, alertas e histórico
---

# Monitoramento de desempenho

Administração de Bancos de Dados · Aula 27

---

## O que você vai aprender

:::goal
- O que é um gargalo e por que a fila se forma no recurso mais lento
- Quais métricas do sistema operacional e do MySQL observar, e o que cada uma indica
- Como usar `SHOW GLOBAL STATUS`, `SHOW PROCESSLIST` e o `sys` schema no dia a dia
- Como montar uma rotina de monitoramento com linha de base, alertas e histórico
:::

---

## :icon[timer] Por que isso importa

A loja cresceu: a tabela `pedidos` passou de 4 linhas para 1.000.000. Na segunda-feira, a tela de pedidos demora 8 segundos para abrir.

- :icon[users] O usuário espera. Depois de 3 segundos, muitos desistem
- :icon[banknote] Lentidão vira custo: servidor maior, mais nuvem, mais horas de suporte
- :icon[siren] Um banco lento derruba todas as aplicações que dependem dele

:::question
Por onde você começaria a procurar: pelo servidor, pelo MySQL ou pelas consultas?
:::

---

## :icon[funnel] O que é um gargalo

Um **gargalo** é o recurso mais lento do caminho. Não importa quão rápido seja o resto: a fila se forma nele.

:::center
![Funil: muitas consultas entram pelo topo, a fila se forma no recurso mais estreito (CPU, memória, disco, rede ou locks) e poucas respostas saem por vez](images/27-funil-gargalo.svg)
:::

Monitorar é descobrir **qual** recurso está estrangulando a vazão antes de trocar o servidor inteiro.

---

## :icon[eye] Proativo ou reativo

:::center
![Duas linhas do tempo: no modo reativo a correção vem depois da reclamação dos usuários; no modo proativo o alerta chega antes do impacto](images/27-proativo-reativo.svg)
:::

::::columns
:::col
**Reativo**: age depois do problema. "O sistema caiu, os usuários estão reclamando."
:::
:::col
**Proativo**: acompanha tendências e corrige antes. "A CPU subiu de 40% para 75% em um mês."
:::
::::

:::tip
A meta é ser proativo. O reativo sempre vai existir; use cada incidente para criar um alerta novo.
:::

---

## :icon[cpu] Métricas do sistema operacional

O MySQL roda sobre o sistema operacional. Se o servidor sofre, o banco sofre junto.

| Métrica | O que indica quando está alta |
|---|---|
| CPU (uso e load average) | consultas pesadas, falta de índices, muitas conexões ativas |
| Memória e swap | buffer pool maior que a RAM; swap ativo é sinal crítico |
| IOPS e latência de disco | leituras que não cabem no cache; disco lento ou saturado |
| Rede (tráfego e latência) | resultados grandes demais (`SELECT *`), muitas idas e voltas |

:::info
No Linux, `top`, `vmstat` e `iostat` mostram isso. No Windows, o Monitor de Recursos.
:::

---

## :icon[database] Métricas do próprio MySQL

| O que medir | Onde ver | Sinal de alerta |
|---|---|---|
| Conexões | `Threads_connected` e `max_connections` | perto do limite: erro "Too many connections" |
| Consultas lentas | `slow_query_log`, `long_query_time` | log crescendo todo dia |
| Buffer pool do InnoDB | `Innodb_buffer_pool_reads` e `_read_requests` | taxa de acerto abaixo de 99% |
| Locks e esperas | `Innodb_row_lock_waits`, `Innodb_row_lock_time_avg` | esperas longas e frequentes |
| Tabelas temporárias | `Created_tmp_disk_tables` | muitas indo para o disco |

Cada linha aponta para uma causa diferente: conexões vazando, SQL ruim, memória curta, transações longas ou `GROUP BY` sem índice.

---

## :icon[hourglass] O log de consultas lentas

O **slow query log** grava toda consulta que demora mais que `long_query_time` segundos. É a fonte mais direta de "o que está lento".

```sql
SET PERSIST slow_query_log = ON;
SET PERSIST long_query_time = 1;   -- padrão: 10 segundos
SET PERSIST log_queries_not_using_indexes = ON;
SHOW VARIABLES LIKE 'slow_query_log_file';
```

:::example
Uma entrada típica traz `Query_time: 4.21`, `Rows_examined: 1000000` e `Rows_sent: 12`. Um milhão de linhas lidas para devolver doze: falta um índice.
:::

:::tip
Para resumir um log grande, use `mysqldumpslow` (vem com o MySQL) ou `pt-query-digest` (Percona Toolkit).
:::

---

## :icon[terminal] SHOW GLOBAL STATUS e SHOW PROCESSLIST

`SHOW GLOBAL STATUS` mostra contadores acumulados desde que o servidor subiu. `SHOW PROCESSLIST` mostra o que cada conexão faz **agora**.

```sql
SHOW GLOBAL STATUS LIKE 'Threads_%';
SHOW GLOBAL STATUS LIKE 'Innodb_row_lock%';
SHOW PROCESSLIST;
```

| Id | Command | Time | State | Info |
|---|---|---|---|---|
| 12 | Query | 37 | executing | SELECT ... FROM pedidos WHERE status = 'pago' |
| 15 | Sleep | 600 | | NULL |

- `Time` está em segundos; uma `Query` com `Time` alto merece atenção
- `State` diz o que ela espera: lock, disco, ordenação
- `KILL 12;` encerra a conexão, em último caso

---

## :icon[activity] performance_schema e sys schema

O **performance_schema** registra tudo que o servidor faz: instruções, esperas, locks. O **sys schema** é um conjunto de views que traduz esses dados para algo legível.

```sql
SELECT query, exec_count, avg_latency, rows_examined_avg
FROM sys.statement_analysis
ORDER BY total_latency DESC
LIMIT 5;
```

| query | exec_count | avg_latency | rows_examined_avg |
|---|---|---|---|
| SELECT ... FROM `pedidos` WHERE `status` = ? | 18.420 | 2.14 s | 1.000.000 |
| SELECT ... FROM `clientes` WHERE `id` = ? | 90.113 | 180 us | 1 |

Outras views úteis: `sys.statements_with_full_table_scans`, `sys.innodb_lock_waits` e `sys.schema_unused_indexes`.

---

## :icon[monitor] Painéis: Workbench e ferramentas externas

O **MySQL Workbench** traz um Performance Dashboard (menu Performance) com tráfego, conexões e atividade do InnoDB em tempo real. Bom para olhar agora, fraco para guardar histórico.

Para produção, use uma ferramenta que colete, armazene e alerte:

- :icon[chart-line] **Percona Monitoring and Management (PMM)**: feito para MySQL, com análise de consultas
- :icon[server] **Prometheus + Grafana**: coleta com o `mysqld_exporter`, painéis e alertas flexíveis
- :icon[bell] **Zabbix**: monitoramento genérico de infraestrutura, com templates para MySQL

:::info
Todas leem as mesmas fontes: `SHOW GLOBAL STATUS` e `performance_schema`. A diferença está em histórico, gráficos e alertas.
:::

---

## :icon[clipboard-check] Boas práticas de monitoramento

:::steps
1. **Linha de base**: registre como o sistema se comporta em um dia normal. Sem ela, você não sabe o que é "alto"
2. **Alertas com limites**: CPU acima de 80% por 10 minutos, conexões acima de 90% do máximo, buffer pool abaixo de 99%
3. **Histórico**: guarde meses de métricas; tendências aparecem em semanas, não em minutos
4. **Revisão**: depois de cada incidente, pergunte "qual alerta teria avisado antes?" e crie esse alerta
:::

:::tip
Alerta que dispara todo dia vira ruído e passa a ser ignorado. Ajuste o limite ou corrija a causa.
:::

---

## :icon[flask-conical] Pratique

A aplicação travou na tela de pedidos. Você roda `SHOW PROCESSLIST` e vê isto:

| Id | Command | Time | State | Info |
|---|---|---|---|---|
| 12 | Sleep | 840 | | NULL |
| 31 | Query | 790 | Waiting for table metadata lock | ALTER TABLE pedidos ADD COLUMN cupom VARCHAR(20) |
| 45 | Query | 788 | Waiting for table metadata lock | SELECT id, total FROM pedidos WHERE cliente_id = 3 |
| 46 | Query | 781 | Waiting for table metadata lock | INSERT INTO pedidos (cliente_id, data_pedido) VALUES (5, '2025-03-12') |

:::question
Quem está bloqueando quem? Qual é a causa raiz e o que você faz para liberar a fila?
:::

---

## :icon[circle-check] Solução

:::steps
1. O `ALTER TABLE` (Id 31) precisa de um **metadata lock** exclusivo em `pedidos` e espera há 790 segundos
2. Quem o impede é a conexão 12: está em `Sleep` há 840 segundos, mas dentro de uma transação aberta que leu `pedidos` e nunca fez `COMMIT`
3. Enquanto o `ALTER` espera, toda consulta nova em `pedidos` (45 e 46) entra na fila atrás dele
:::

```sql
SELECT trx_mysql_thread_id, trx_started
FROM information_schema.innodb_trx;   -- confirma a transação da conexão 12
KILL 12;                              -- libera o lock; o ALTER roda e a fila esvazia
```

:::tip
Prevenção: transações curtas na aplicação, `ALTER` em janela de baixo uso e `SET lock_wait_timeout = 30` na sessão do DDL, para ele desistir em vez de travar todo mundo.
:::

---

## :icon[triangle-alert] Erros comuns

:::warning
- Trocar o servidor por um maior sem saber qual recurso é o gargalo
- Deixar `long_query_time` nos 10 segundos padrão: consultas de 3 segundos passam despercebidas
- Olhar `Threads_connected` uma vez e concluir que está tudo bem; sem histórico não há tendência
- Rodar `SHOW PROCESSLIST` só quando o sistema já caiu
- Ignorar conexões em `Sleep` com `Time` alto: elas podem segurar locks
:::

---

## :icon[list-checks] Resumo

:::summary
- Um **gargalo** é o recurso mais lento: CPU, memória, disco, rede ou locks. A fila se forma nele
- Monitore o SO (CPU, memória, IOPS, rede) e o MySQL (conexões, consultas lentas, buffer pool, locks, tabelas temporárias)
- `SHOW GLOBAL STATUS`, `SHOW PROCESSLIST` e `sys.statement_analysis` são o kit básico do DBA
- Linha de base, alertas e histórico transformam monitoramento reativo em proativo
:::

---

## :icon[arrow-right] Próximos passos

O monitoramento diz **qual** consulta está lenta. A próxima aula, **Planos de execução com EXPLAIN**, mostra **por quê**: como o MySQL decide ler uma tabela e como enxergar essa decisão.

Antes de seguir, faça o quiz desta aula.
