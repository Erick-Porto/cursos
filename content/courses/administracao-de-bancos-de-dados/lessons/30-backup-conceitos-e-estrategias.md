---
title: "Backup: conceitos e estratégias"
summary: RPO, RTO, tipos de backup, lógico versus físico, PITR e a regra 3-2-1.
module: operacao
duration_minutes: 25
objectives:
  - Definir RPO e RTO e usá-los para escolher uma estratégia de backup
  - Diferenciar backups completos, incrementais e diferenciais
  - Comparar backup lógico e físico
  - Explicar a regra 3-2-1 e a importância de testar a restauração
---

# Backup: conceitos e estratégias

Administração de Bancos de Dados · Aula 30

---

## O que você vai aprender

:::goal
- Traduzir as perguntas "quanto posso perder?" e "quanto tempo posso ficar fora?" em RPO e RTO
- Escolher entre backup completo, incremental e diferencial
- Distinguir backup lógico (`mysqldump`) de físico (XtraBackup, snapshots)
- Aplicar a regra 3-2-1 e tratar o teste de restauração como parte do backup
:::

---

## :icon[siren] Por que isso importa

Segunda-feira, 9h. O servidor da loja não liga: o disco morreu. O último backup tem três meses. Os pedidos de março sumiram.

Dados se perdem de muitas formas:

- :icon[user-x] Erro humano: um `DELETE` sem `WHERE`, um `DROP TABLE` no banco errado
- :icon[hard-drive] Falha de disco ou do servidor inteiro
- :icon[lock] Ransomware que criptografa tudo, inclusive os backups guardados na mesma máquina
- :icon[bug] Bug na aplicação que corrompe registros aos poucos

:::question
Antes de escolher a ferramenta, responda duas perguntas: **quanto você pode perder** e **por quanto tempo pode ficar fora**?
:::

---

## :icon[timer] RPO e RTO: as duas perguntas em números

![Linha do tempo: o intervalo entre o último backup e o incidente é o RPO; o intervalo entre o incidente e a volta do sistema é o RTO](images/30-rpo-rto.svg)

- **RPO** (Recovery Point Objective): quanto de dados você aceita perder, medido em tempo. RPO de 1 hora exige um backup (ou log) a cada hora, no máximo.
- **RTO** (Recovery Time Objective): por quanto tempo o sistema pode ficar fora. RTO de 30 minutos descarta restaurações que levam uma tarde.

:::tip
Quem define RPO e RTO é o negócio. O DBA traduz os dois números em frequência de backup, ferramenta e infraestrutura.
:::

---

## :icon[layers] Três tipos: completo, incremental e diferencial

![Animação de uma semana de backups: domingo tem um completo; os incrementais guardam só o que mudou desde o backup anterior e ficam pequenos; os diferenciais acumulam tudo desde o completo e crescem a cada dia](images/30-semana-de-backups.svg)

- **Completo**: copia tudo. Simples de restaurar, mas lento e grande.
- **Incremental**: só o que mudou desde o **último backup**, de qualquer tipo. Pequeno e rápido; restaurar exige a cadeia inteira.
- **Diferencial**: tudo o que mudou desde o **último completo**. Cresce ao longo da semana; restaurar usa só dois arquivos.

---

## :icon[scale] Comparando os três tipos

| Critério | Completo | Incremental | Diferencial |
|---|---|---|---|
| Espaço por backup | maior | menor | médio, cresce a cada dia |
| Tempo de backup | mais longo | mais curto | intermediário |
| Tempo de restauração | mais curto | mais longo | intermediário |
| Arquivos para restaurar | 1 | completo + todos os incrementais | completo + último diferencial |
| Risco | baixo | um arquivo corrompido quebra a cadeia | baixo |

Estratégia comum: completo no fim de semana e diferencial (ou incremental) nos outros dias.

---

## :icon[file-text] Lógico ou físico?

| | Lógico | Físico |
|---|---|---|
| O que copia | comandos SQL (`CREATE TABLE`, `INSERT`) em texto | os arquivos de dados do SGBD, byte a byte |
| Ferramentas | `mysqldump`, `pg_dump` | Percona XtraBackup, MySQL Enterprise Backup, snapshots de disco |
| Pontos fortes | portável entre versões, legível, restaura uma tabela só | muito mais rápido em bancos grandes, captura o estado exato |
| Pontos fracos | lento para restaurar bancos grandes | preso à mesma versão e plataforma; restauração parcial é difícil |

:::tip
Banco pequeno ou médio: `mysqldump` resolve. Centenas de GB com RTO curto: backup físico.
:::

---

## :icon[history] Point-in-Time Recovery: voltar ao minuto certo

Às 14:32 alguém rodou `DELETE FROM pedidos` sem `WHERE`. O backup completo é das 02:00. Restaurá-lo sozinho perde 12 horas de pedidos.

![Fluxo do PITR: restaurar o backup completo das 02:00, aplicar o binary log até 14:31 e parar antes do comando errado](images/30-pitr.svg)

**PITR** (Point-in-Time Recovery) resolve isso em dois passos:

1. Restaurar o último backup completo
2. Reaplicar o **binary log**, o registro de todas as alterações, até o instante anterior ao erro

:::info
No MySQL, o binary log precisa estar ativo (`log_bin`) e ser copiado para fora do servidor. No PostgreSQL, esse papel é do WAL (write-ahead log).
:::

---

## :icon[circle-help] Pense

:::question
A loja faz um backup completo no domingo e um **diferencial** de segunda a quarta, sempre às 02:00. Na quinta, às 10h, o disco morre.

1. Quais arquivos você precisa para restaurar?
2. E se, em vez de diferenciais, fossem **incrementais**?
3. Quais dados se perdem de qualquer jeito?
:::

---

## :icon[circle-check] Resposta

- **Diferenciais**: dois arquivos, o completo de domingo e o diferencial de quarta. O de quarta já contém as mudanças de segunda e terça.
- **Incrementais**: quatro arquivos, o completo e os incrementais de segunda, terça e quarta, aplicados nessa ordem. Se o de terça estiver corrompido, o de quarta não serve.
- **Perda inevitável**: tudo o que aconteceu entre 02:00 de quarta e 10h de quinta. Esse é o RPO real da estratégia: cerca de 32 horas. Se o negócio aceita menos, o binary log precisa entrar em cena.

---

## :icon[boxes] A regra 3-2-1 e a retenção

Backup no mesmo disco do banco não é backup: a falha que apaga um apaga o outro.

:::steps
1. **3** cópias dos dados: a original e dois backups
2. **2** mídias diferentes: disco local e armazenamento de rede, por exemplo
3. **1** cópia fora do site: outro prédio ou a nuvem (S3, Google Cloud Storage, Azure Blob)
:::

**Retenção** é por quanto tempo cada cópia fica guardada. Um esquema comum: 7 diários, 4 semanais, 12 mensais. A lei ou o contrato podem exigir mais.

---

## :icon[clipboard-check] O passo mais importante: testar a restauração

:::danger
Um backup nunca restaurado é uma esperança, não um backup. O arquivo pode estar vazio, corrompido ou incompleto, e você só descobre no dia do desastre.
:::

Teste de verdade, com frequência definida (mensal, por exemplo):

- :icon[server] Restaure em um servidor de teste, nunca em produção
- :icon[timer] Cronometre: o tempo medido é o seu RTO real
- :icon[search-check] Confira contagens (`SELECT COUNT(*)`) e algumas consultas do negócio
- :icon[file-text] Registre o resultado e o que precisou ser corrigido

---

## :icon[flask-conical] Pratique

:::example Cenário
A loja vende online 24 horas. O banco `loja` tem 20 GB. A direção definiu:

- **RPO de 1 hora**: pode perder no máximo uma hora de pedidos
- **RTO de 30 minutos**: o site pode ficar fora no máximo meia hora

Monte a estratégia: tipo e frequência de backup, uso do binary log, onde guardar e como testar.
:::

---

## :icon[circle-check] Solução

- **RPO de 1 hora**: backup completo diário na madrugada e binary log ativo, copiado para fora do servidor a cada hora (ou incrementais de hora em hora). Assim o PITR volta até o minuto do incidente.
- **RTO de 30 minutos**: restaurar 20 GB de `mysqldump` pode levar mais que isso. Prefira backup físico (XtraBackup) ou mantenha uma réplica pronta para assumir.
- **Armazenamento**: regra 3-2-1, com uma cópia na nuvem e retenção de 7 diários e 4 semanais.
- **Teste**: restauração mensal cronometrada no servidor de homologação. Se passar de 30 minutos, a estratégia precisa mudar.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Guardar o backup no mesmo servidor (ou no mesmo disco) do banco
- Confiar no backup sem nunca restaurar: o arquivo vazio só aparece no desastre
- Confundir incremental com diferencial na restauração e esquecer um elo da cadeia
- Achar que replicação substitui backup: um `DELETE` errado é replicado em segundos
- Descobrir no incidente que o binary log estava desligado e o PITR é impossível
:::

---

## :icon[list-checks] Resumo

:::summary
- **RPO** diz quanto você pode perder; **RTO**, por quanto tempo pode ficar fora. Os dois guiam toda a estratégia
- **Completo** copia tudo; **incremental**, só desde o último backup; **diferencial**, tudo desde o último completo
- Backup **lógico** (`mysqldump`) é portável e legível; **físico** (XtraBackup) é rápido em bancos grandes
- **PITR** combina backup completo e binary log para voltar ao minuto anterior ao erro
- Regra **3-2-1**, retenção definida e **teste de restauração** periódico
:::

---

## :icon[arrow-right] Próximos passos

Você já sabe **o que** proteger e **com que frequência**. Na próxima aula, "Backup na prática: mysqldump e automação", você coloca a mão no terminal: gera o dump do banco `loja`, restaura em um banco limpo, escreve o script e agenda no cron.

Antes disso, responda ao quiz desta aula para fixar RPO, RTO e os tipos de backup.
