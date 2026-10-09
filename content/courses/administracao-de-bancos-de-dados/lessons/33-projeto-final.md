---
title: "Projeto final: um banco de dados completo"
summary: As cinco fases do projeto de conclusão, os critérios de cada uma e como organizar a entrega.
module: projeto-e-carreira
duration_minutes: 25
objectives:
  - Descrever as cinco fases do projeto final e os critérios de cada uma
  - Planejar o tema, as entidades e o cronograma do seu projeto
  - Organizar os scripts e os arquivos da entrega
  - Reconhecer os erros mais comuns em projetos de banco de dados
---

# Projeto final: um banco de dados completo

Administração de Bancos de Dados · Aula 33

---

## O que você vai aprender

:::goal
- As cinco fases do projeto final e o que cada uma exige
- Como escolher um tema e planejar o cronograma
- Como organizar os scripts e os arquivos da entrega
- Os erros que mais derrubam projetos de banco de dados
:::

---

## :icon[target] Por que isso importa

Até aqui você praticou cada técnica separada: modelar, criar tabelas, consultar, proteger com transações, fazer backup.

No projeto final, tudo isso vira **um banco que funciona do zero**, para um negócio que você escolhe.

É também a peça mais forte do seu portfólio: um recrutador pode abrir os scripts e ver o que você sabe fazer.

:::question
Se um colega recebesse só os seus arquivos, conseguiria criar o banco, carregar os dados e rodar as consultas sem perguntar nada a você?
:::

---

## :icon[workflow] As cinco fases e o cronograma

O tema é **livre**. O processo é o mesmo para todos e os critérios **não mudam** de um tema para outro.

:::center
![Linha com as cinco fases do projeto: modelagem conceitual, modelagem lógica, desenvolvimento SQL, testes e apresentação](images/33-fases-do-projeto.svg)
:::

Cronograma sugerido para cinco semanas:

:::steps
1. Requisitos e modelo conceitual
2. Modelo lógico, normalização e DDL
3. DML, procedures, triggers e índices
4. Testes, views, backup e restore
5. README, revisão e apresentação
:::

---

## :icon[lightbulb] Fase 1: modelagem conceitual

Comece pelo negócio, não pelas tabelas. Escreva de 5 a 10 frases sobre como ele funciona e extraia delas as entidades e os relacionamentos.

Critérios:

- :icon[square-check] No mínimo **6 entidades**
- :icon[square-check] Todos os relacionamentos definidos, com **cardinalidade** (1:1, 1:N, N:N)
- :icon[square-check] O modelo representa fielmente a lógica do negócio escolhido

:::tip
Teste o modelo com uma frase real: "um paciente marca várias consultas; cada consulta é com um médico". Se o diagrama não conta essa história, ajuste-o.
:::

---

## :icon[table] Fase 2: modelagem lógica

Agora cada entidade vira tabela, com atributos, tipos e regras que o SGBD vai aplicar.

Critérios:

- :icon[square-check] Todos os atributos de cada entidade especificados
- :icon[square-check] Tipos de dados que preservam a integridade (`DECIMAL` para dinheiro, `DATE` para datas)
- :icon[square-check] Constraints em cada tabela: `PRIMARY KEY`, `FOREIGN KEY`, `NOT NULL`, `UNIQUE`, `CHECK`
- :icon[square-check] Cardinalidades representadas corretamente (N:N vira tabela associativa)
- :icon[square-check] Normalização até a **3FN**, com justificativa das tabelas auxiliares

:::info
No MySQL, `CHECK` só é aplicado a partir da versão 8.0.16. Antes disso, a restrição era aceita e ignorada.
:::

---

## :icon[code] Fase 3: desenvolvimento SQL

Os scripts são o produto principal. Quem corrige vai executá-los do zero, na ordem.

- :icon[square-check] DDL e DML **organizados, indentados e comentados** por seção
- :icon[square-check] Sem código redundante
- :icon[square-check] **Procedures** para rotinas repetitivas ou complexas
- :icon[square-check] **Triggers** para tabelas atualizadas automaticamente a partir de outras operações
- :icon[square-check] **Índices** nas colunas de busca e de junção
- :icon[square-check] Sintaxe correta, inclusive `DELIMITER` em procedures e triggers
- :icon[square-check] Arquivo de **backup completo** gerado com `mysqldump`

:::warning
Procedures e triggers que contrariam a lógica do negócio (por exemplo, um trigger que apaga o histórico) zeram o critério.
:::

---

## :icon[flask-conical] Fase 4: testes

Um banco sem dados não prova nada. Popule as tabelas e mostre que as regras funcionam.

- :icon[square-check] Todas as tabelas com dados de teste consistentes
- :icon[square-check] `SELECT` que retornam os resultados esperados
- :icon[square-check] `INSERT`, `UPDATE` e `DELETE` mantendo a integridade referencial
- :icon[square-check] Remoção de registros demonstrando as restrições
- :icon[square-check] Consultas com diferentes tipos de `JOIN`
- :icon[square-check] **Views** para as consultas frequentes

:::example
```sql
-- Deve falhar: o cliente 1 tem pedidos
DELETE FROM clientes WHERE id = 1;
-- ERROR 1451 (23000): Cannot delete or update a parent row:
-- a foreign key constraint fails
```
O erro é o resultado esperado: ele prova que a chave estrangeira protege os dados.
:::

---

## :icon[megaphone] Fase 5: apresentação

Você mostra o banco **em pleno funcionamento** e explica a utilidade dele para o tema escolhido.

Roteiro de 10 minutos:

:::steps
1. O negócio e o problema que o banco resolve
2. O modelo: entidades e relacionamentos principais
3. Scripts rodando do zero: DDL, DML, procedures
4. Consultas, views e uma restrição sendo aplicada
5. Backup e restore
6. Benefícios para a organização
:::

:::tip
Ensaie com o cronômetro. O avaliador quer ver o banco funcionando, não ler o seu código projetado na tela.
:::

---

## :icon[puzzle] Sugestões de tema

Escolha um negócio que você conhece: entender as regras é metade do trabalho.

| Tema | Entidades típicas | Rotina para procedure |
|---|---|---|
| Clínica | pacientes, médicos, consultas, exames | agendar consulta |
| Escola | alunos, turmas, disciplinas, notas | lançar nota |
| Locadora | clientes, veículos, locações, multas | registrar devolução |
| Oficina | clientes, veículos, ordens de serviço, peças | fechar ordem |
| Academia | alunos, planos, matrículas, treinos | renovar matrícula |
| Biblioteca | leitores, livros, exemplares, empréstimos | emprestar livro |

:::question
No seu tema, quais são as 6 entidades? Qual tabela precisaria de um trigger para se atualizar sozinha?
:::

---

## :icon[scale] Rubrica de avaliação

Os critérios de cada fase viram pontos. Pesos sugeridos:

| Fase | Peso | O que mais pesa |
|---|---|---|
| Modelagem conceitual | 15% | fidelidade ao negócio |
| Modelagem lógica | 20% | constraints e 3FN |
| Desenvolvimento SQL | 30% | scripts que rodam do zero |
| Testes | 25% | integridade demonstrada |
| Apresentação | 10% | banco funcionando |

:::info
Cada critério não atendido desconta dentro da fase. Um script que não executa zera a fase de desenvolvimento, mesmo que o resto esteja bonito.
:::

---

## :icon[folder-tree] Entrega: pastas e arquivos

Uma pasta por projeto, com estes nomes. Quem corrige executa os scripts na ordem do diagrama, em um servidor vazio.

:::center
![Ordem de execução da entrega: ddl.sql, dml.sql, procedures.sql e consultas.sql em sequência; o mysqldump gera backup.sql; modelo.png e README.md documentam](images/33-ordem-dos-scripts.svg)
:::

- :icon[image] `modelo.png`: diagrama conceitual ou lógico
- :icon[file-code] `ddl.sql`: banco, tabelas, constraints e índices
- :icon[file-code] `dml.sql`: carga de dados de teste
- :icon[file-code] `procedures.sql`: procedures e triggers, com `DELIMITER`
- :icon[file-code] `consultas.sql`: SELECTs, JOINs e views
- :icon[database-backup] `backup.sql`: saída do `mysqldump`
- :icon[file-text] `README.md`: tema, como executar e decisões de modelagem

---

## :icon[triangle-alert] Erros comuns em projetos

:::warning
- **Modelar sem requisitos**: tabelas inventadas que não refletem o negócio e geram relacionamentos errados
- **Pular a normalização**: dados repetidos, atualizações inconsistentes e tabelas associativas ausentes
- **Scripts que não rodam do zero**: dependem de um banco que só existe na sua máquina ou criam tabelas fora de ordem
- **Não testar o restore**: um `backup.sql` que nunca foi restaurado em um servidor vazio não é backup
- **Deixar a documentação para o fim**: README escrito às pressas não explica como executar
:::

---

## :icon[list-checks] Resumo

:::summary
- O projeto final é o desenvolvimento completo de um banco, com tema livre e critérios iguais para todos
- Cinco fases: modelagem conceitual, modelagem lógica, desenvolvimento SQL, testes e apresentação
- Cada fase tem um checklist objetivo: use-o antes de entregar
- Scripts organizados, comentados e que rodam do zero valem a maior parte da nota
- A entrega tem nomes fixos de arquivos e um README que explica como executar
:::

---

## :icon[arrow-right] Próximos passos

Com o projeto pronto, você tem algo concreto para mostrar. A próxima aula, **Carreira: portfólio, currículo e LinkedIn**, ensina a transformar esse trabalho em visibilidade: publicar no GitHub, cadastrar o curso no LinkedIn e montar o currículo de DBA júnior.

Antes disso, responda ao quiz desta aula para fixar as fases e os critérios do projeto.
