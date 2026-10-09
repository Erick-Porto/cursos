---
title: "Backup na prática: mysqldump e automação"
summary: Gerar, compactar e restaurar dumps com mysqldump; automatizar com script, cron e verificação.
module: operacao
duration_minutes: 30
objectives:
  - Gerar backups com mysqldump e as opções certas
  - Restaurar um dump em um banco limpo
  - Automatizar o backup com um script e o cron
  - Verificar os backups e proteger a senha
---

# Backup na prática: mysqldump e automação

Administração de Bancos de Dados · Aula 31

---

## O que você vai aprender

:::goal
- Fazer o dump de um banco, de todos os bancos ou de uma tabela com `mysqldump`
- Compactar com `gzip` e restaurar com `mysql banco < arquivo.sql`
- Escrever um script de backup com data, log e limpeza, e agendá-lo no cron
- Guardar a senha fora do script e verificar se o backup realmente funciona
:::

---

## :icon[siren] Por que isso importa

Com RPO, RTO e estratégia definidos, falta executá-la todo dia, sem depender de alguém lembrar.

- :icon[terminal] O `mysqldump` gera o backup lógico em um único comando
- :icon[file-code] Um script de poucas linhas transforma o comando em rotina
- :icon[calendar-clock] O cron executa o script enquanto você dorme
- :icon[search-check] A verificação avisa quando algo quebrou, antes do desastre

:::question
O backup da loja roda há seis meses. Alguém já abriu um dos arquivos para ver se tem algo dentro?
:::

---

## :icon[terminal] mysqldump: um banco, todos ou uma tabela

O `mysqldump` conecta ao servidor e escreve na saída um script SQL com o `CREATE TABLE` e os `INSERT` de tudo o que leu. O `>` manda esse texto para um arquivo.

```bash
# um banco inteiro
mysqldump -u root -p --single-transaction loja > loja.sql

# todos os bancos do servidor (inclui CREATE DATABASE)
mysqldump -u root -p --single-transaction --all-databases > servidor.sql

# só uma tabela
mysqldump -u root -p --single-transaction loja pedidos > pedidos.sql
```

:::tip
O `-p` sozinho faz o cliente perguntar a senha. Nunca escreva `-pSenha` na linha de comando: ela fica gravada no histórico do shell.
:::

---

## :icon[sliders-horizontal] As opções que importam

| Opção | O que faz |
|---|---|
| `--single-transaction` | lê tudo dentro de uma transação, em um instante consistente, sem travar as tabelas InnoDB |
| `--routines` | inclui procedures e functions (ficam de fora por padrão) |
| `--triggers` | inclui triggers (já vem ligado; `--skip-triggers` desliga) |
| `--events` | inclui eventos agendados |
| `--no-data` | só a estrutura, sem `INSERT`: bom para criar um banco de testes vazio |
| `--no-create-info` | só os dados, sem `CREATE TABLE` |
| `--result-file=arquivo.sql` | grava direto no arquivo, sem `>`; evita problemas de codificação no Windows |

Para um backup completo do `loja`: `--single-transaction --routines --triggers --events`.

---

## :icon[package] Compactar na saída

Um dump é texto repetitivo: `INSERT INTO` em cada linha. O `gzip` costuma reduzir o arquivo a 10% ou 20% do tamanho original.

```bash
# o | (pipe) entrega o texto do mysqldump ao gzip, sem arquivo intermediário
mysqldump -u root -p --single-transaction --routines --events loja \
  | gzip > loja_2025-03-09.sql.gz

# ler o começo sem descompactar no disco
zcat loja_2025-03-09.sql.gz | head -n 20
```

:::tip
Coloque a data no nome do arquivo, no formato `AAAA-MM-DD`: os backups ficam em ordem cronológica em qualquer listagem.
:::

---

## :icon[rotate-ccw] Restaurar: o `<` no lugar do `>`

O arquivo é SQL comum. Restaurar é entregar esse SQL ao cliente `mysql`, que executa comando a comando.

```bash
# 1. o dump de um banco só não o recria: crie antes
mysql -u root -p -e "CREATE DATABASE loja_restaurada"

# 2. execute o script dentro dele
mysql -u root -p loja_restaurada < loja.sql

# compactado? descompacte no caminho
gunzip -c loja_2025-03-09.sql.gz | mysql -u root -p loja_restaurada
```

Restaurar em um banco com outro nome (`loja_restaurada`) é o jeito seguro de testar sem tocar no `loja` de produção.

:::info
No PostgreSQL, `pg_dump -Fc loja > loja.dump` gera um arquivo compactado e `pg_restore -d loja_restaurada loja.dump` o restaura. Dumps em texto (`-Fp`) são restaurados com `psql`.
:::

---

## :icon[flask-conical] O ciclo completo em quatro comandos

:::example Backup, restauração e conferência
```bash
mysqldump -u root -p --single-transaction --routines --events loja \
  | gzip > loja_teste.sql.gz
mysql -u root -p -e "CREATE DATABASE loja_teste"
gunzip -c loja_teste.sql.gz | mysql -u root -p loja_teste
mysql -u root -p -e "SELECT COUNT(*) AS clientes FROM loja_teste.clientes"
```

Resultado esperado:

| clientes |
|---|
| 5 |

Se a contagem bate com a do banco original, o dump está íntegro. Depois do teste, `DROP DATABASE loja_teste`.
:::

---

## :icon[file-code] O script de backup

```bash
#!/bin/bash
# backup_loja.sh: dump diário do banco loja, compactado, com log
DIA=$(date +%F)                      # 2025-03-09
DESTINO=/var/backups/mysql/$DIA      # uma pasta por dia
LOG=/var/log/backup_loja.log
mkdir -p "$DESTINO"
mysqldump --login-path=backup --single-transaction --routines --events loja \
  | gzip > "$DESTINO/loja_$(date +%H%M).sql.gz"
if [ "${PIPESTATUS[0]}" -eq 0 ]; then
  echo "$(date '+%F %T') OK $DESTINO" >> "$LOG"
else
  echo "$(date '+%F %T') FALHA no mysqldump" >> "$LOG"
fi
find /var/backups/mysql -mindepth 1 -maxdepth 1 -type d -mtime +7 -exec rm -r {} +
```

- `PIPESTATUS[0]` é o código de saída do `mysqldump`; `$?` olharia só o `gzip`
- O `find` apaga as pastas com mais de 7 dias: retenção de uma semana
- `--login-path=backup` lê usuário e senha de um arquivo protegido, não do script

---

## :icon[calendar-clock] Agendar com cron

O **cron** executa comandos em horários fixos. Cada linha do `crontab` tem cinco campos de tempo e o comando.

![Sintaxe do crontab: os cinco campos são minuto, hora, dia do mês, mês e dia da semana; "0 2 * * *" significa todo dia às 02:00](images/31-cron.svg)

```bash
chmod +x /usr/local/bin/backup_loja.sh   # torna o script executável
crontab -e                                # abre o agendamento do seu usuário
```

```plaintext
0 2 * * * /usr/local/bin/backup_loja.sh
```

`*` significa "qualquer valor"; `*/6` na hora rodaria a cada 6 horas; `0` no dia da semana é domingo.

:::info
No Windows, o equivalente é o Agendador de Tarefas: uma tarefa diária que executa o `mysqldump.exe` ou um script PowerShell.
:::

---

## :icon[key-round] Senha fora do script

Senha dentro do script ou do crontab vaza em qualquer `cat`, cópia ou repositório. O MySQL oferece dois lugares seguros.

::::columns
:::col
**Arquivo `~/.my.cnf`**

```plaintext
[client]
user=backup
password=senha-forte
```

Proteja com `chmod 600 ~/.my.cnf`. O `mysqldump` lê o arquivo sozinho.
:::
:::col
**`mysql_config_editor`**

```bash
mysql_config_editor set --login-path=backup \
  --user=backup --password
mysqldump --login-path=backup loja
```

A senha fica cifrada em `~/.mylogin.cnf`.
:::
::::

:::tip
Crie um usuário só para backup, com privilégios de leitura (`SELECT`, `SHOW VIEW`, `TRIGGER`, `EVENT` e, em algumas versões, `RELOAD`). Nunca use o `root`.
:::

---

## :icon[search-check] Verificar e fechar o ciclo

Backup que ninguém olha falha em silêncio: disco cheio, senha trocada, servidor fora do ar.

```bash
ls -lh /var/backups/mysql/2025-03-09/     # tamanho razoável, nunca 0 bytes
zcat loja_0200.sql.gz | head -n 20         # cabeçalho do dump, sem mensagem de erro
sha256sum loja_0200.sql.gz                 # para conferir a cópia remota
tail -n 3 /var/log/backup_loja.log         # OK ou FALHA
```

![Animação do ciclo: backup, verificação, cópia remota e teste de restauração, que recomeça no dia seguinte](images/31-ciclo-backup.svg)

O checksum prova que a cópia enviada à nuvem é idêntica. A restauração periódica no servidor de teste é a única prova definitiva.

---

## :icon[flask-conical] Pratique

:::example Cenário
A loja quer um backup do banco `loja` **todo dia às 23:30**, compactado, incluindo procedures e eventos, salvo em `/backups/loja` com a data no nome. A senha deve ficar fora do comando.

Escreva:

1. O comando `mysqldump` (pode ser o conteúdo de `/usr/local/bin/backup_loja.sh`)
2. A linha do `crontab`
:::

---

## :icon[circle-check] Solução

```bash
#!/bin/bash
# /usr/local/bin/backup_loja.sh
mysqldump --login-path=backup --single-transaction --routines --events loja \
  | gzip > /backups/loja/loja_$(date +%F).sql.gz
```

```plaintext
30 23 * * * /usr/local/bin/backup_loja.sh >> /var/log/backup_loja.log 2>&1
```

- `30 23`: minuto 30 da hora 23; os três `*` cobrem todo dia, todo mês, qualquer dia da semana
- `--login-path=backup` lê a senha gravada pelo `mysql_config_editor`
- `--triggers` já é o padrão, por isso não aparece
- `>> ... 2>&1` guarda no log tudo o que o script imprimir, inclusive erros

---

## :icon[triangle-alert] Erros comuns

:::warning
- Usar `>` em vez de `<` na restauração: o arquivo de backup é sobrescrito com nada
- Esquecer `--single-transaction` e travar a loja durante o dump, ou obter dados inconsistentes
- Restaurar o dump por cima do banco de produção para "testar"
- Rodar o script à mão com sucesso e descobrir que, no cron, o `PATH` ou a senha são outros: confira o log no dia seguinte
- Deixar os arquivos crescerem até encher o disco por falta de retenção
:::

---

## :icon[list-checks] Resumo

:::summary
- `mysqldump --single-transaction --routines --events banco > arquivo.sql` gera um backup lógico consistente
- Restaure com `mysql banco < arquivo.sql`, sempre em um banco criado antes e, para testes, com outro nome
- `| gzip` compacta na saída; `gunzip -c | mysql` restaura sem descompactar no disco
- Um script com data no nome, log e limpeza de arquivos antigos, agendado com `0 2 * * *` no cron
- Senha em `~/.my.cnf` ou no `mysql_config_editor`; verificação diária e restauração de teste periódica
:::

---

## :icon[arrow-right] Próximos passos

O backup responde "como recuperar". A próxima aula, "Auditoria em bancos de dados", responde a outra pergunta: **quem fez o quê, quando e de onde**. Você vai registrar cada alteração nas tabelas sensíveis do `loja` com triggers e JSON.

Antes, faça o quiz: ele pede o comando e a linha do cron para um cenário novo.
