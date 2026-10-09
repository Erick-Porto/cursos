---
title: Arquitetura de um SGBD
summary: Os três níveis ANSI-SPARC, a independência de dados e o caminho de uma consulta por dentro do SGBD.
module: fundamentos
duration_minutes: 25
objectives:
  - Descrever os três níveis da arquitetura ANSI-SPARC
  - Explicar a independência lógica e a independência física de dados
  - Identificar os componentes do SGBD e o caminho de uma consulta
  - Conectar-se a um servidor MySQL com um cliente
---

# Arquitetura de um SGBD

Administração de Bancos de Dados · Aula 02

---

## O que você vai aprender

:::goal
- Os três níveis da arquitetura ANSI-SPARC: externo, conceitual e interno
- O que são independência lógica e independência física de dados
- Os componentes do SGBD e o caminho que uma consulta percorre
- Como se conectar a um servidor MySQL
:::

---

## :icon[triangle-alert] Por que isso importa

O DBA da loja decide criar um índice na tabela `pedidos` para acelerar os relatórios. Na mesma semana, o time adiciona a coluna `telefone` em `clientes`.

:::question
A aplicação web precisa ser reescrita por causa dessas mudanças? E os relatórios do financeiro?
:::

A resposta é "quase nunca", e o motivo está na arquitetura do SGBD. Entender essa arquitetura é o que separa quem usa o banco de quem o administra.

---

## :icon[layers] Arquitetura ANSI-SPARC: três níveis

:::center
![Diagrama em três camadas: nível externo com as visões de cada usuário, nível conceitual com o esquema lógico global e nível interno com arquivos e índices no disco](images/02-ansi-sparc.svg)
:::

Em 1975, o comitê **ANSI-SPARC** propôs descrever um banco de dados em três níveis:

- **Externo**: o que cada usuário ou aplicação enxerga
- **Conceitual**: a estrutura lógica completa, única para todos
- **Interno**: como os bytes ficam gravados no disco

---

## :icon[eye] Os níveis em detalhe

| Nível | O que descreve | Exemplo no banco `loja` |
|---|---|---|
| **Externo** | visões parciais, uma por perfil de usuário | o vendedor vê só `nome` e `email` dos clientes |
| **Conceitual** | tabelas, colunas, tipos, chaves e regras | `clientes`, `pedidos`, `produtos` e as chaves que os ligam |
| **Interno** | arquivos, índices, páginas, alocação de espaço | arquivos InnoDB, índice em `pedidos.data_pedido`, páginas de 16 KB |

Cada nível só conversa com o vizinho. Quem usa o nível externo nunca precisa saber em que disco a tabela está.

---

## :icon[building-2] Analogia do prédio

::::columns
:::col
**Nível externo: o apartamento**

Cada morador conhece o próprio apartamento e a fachada. Não precisa saber como o prédio foi construído.
:::
:::col
**Nível conceitual: a planta**

A planta baixa mostra todos os apartamentos, corredores e áreas comuns. É única para o prédio inteiro.
:::
::::

**Nível interno: a fundação.** Vigas, encanamento e fiação: o que sustenta tudo, invisível para quem mora.

:::tip
Trocar o encanamento não muda a planta nem o apartamento. Guarde essa frase: ela é a independência de dados.
:::

---

## :icon[unlink] Independência de dados

**Independência de dados** é poder mudar um nível sem reescrever o nível acima.

::::columns
:::col
**Lógica**

Muda o esquema **conceitual** sem afetar as visões e as aplicações.

- adicionar a coluna `telefone` em `clientes`
- criar a tabela `fornecedores`
:::
:::col
**Física**

Muda o esquema **interno** sem afetar o conceitual.

- criar um índice em `pedidos.data_pedido`
- mover os arquivos para um SSD
:::
::::

A física é a mais comum no dia a dia do DBA: você otimiza o armazenamento e ninguém da aplicação percebe.

---

## :icon[circle-help] Pense

Classifique cada mudança: ela depende da independência **lógica** ou da **física**? Alguém da aplicação precisa ser avisado?

:::question
1. O DBA troca o disco do servidor por um SSD mais rápido.
2. O time adiciona a coluna `cidade` em `clientes`, mas a visão do vendedor continua mostrando só `nome` e `email`.
3. O DBA cria um índice em `produtos.nome` para acelerar as buscas.
:::

---

## :icon[circle-check] Solução

| Mudança | Nível alterado | Independência |
|---|---|---|
| Trocar o disco por SSD | interno | **física**: conceitual e aplicações intactos |
| Adicionar `cidade` em `clientes` | conceitual | **lógica**: a visão do vendedor não muda |
| Criar índice em `produtos.nome` | interno | **física**: as consultas ficam mais rápidas sem mudar |

Em nenhum dos três casos a aplicação precisa de alteração.

:::info
No PostgreSQL vale a mesma arquitetura. O que muda entre SGBDs é o nível interno: formato de arquivo, tamanho de página, tipos de índice.
:::

---

## :icon[cpu] Componentes do SGBD

Por dentro, o SGBD se divide em dois subsistemas.

::::columns
:::col
**Processador de consultas**

- :icon[search-check] **Parser**: confere a sintaxe e traduz o SQL
- :icon[route] **Otimizador**: compara planos e escolhe o mais barato
- :icon[play] **Executor**: roda o plano escolhido
:::
:::col
**Gerenciador de armazenamento**

- :icon[memory-stick] **Buffer**: cache de páginas na RAM
- :icon[hard-drive] **Arquivos**: espaço em disco e estrutura dos dados
- :icon[repeat] **Transações**: tudo ou nada, mesmo com falhas
- :icon[lock] **Locks**: controle do acesso simultâneo
:::
::::

---

## :icon[workflow] O caminho de uma consulta

:::center
![Animação: o SQL entra, passa pelo parser, pelo otimizador e pelo executor, chega ao armazenamento e o resultado volta ao cliente](images/02-caminho-da-consulta.svg)
:::

Você escreve **o que** quer; o SGBD descobre **como** buscar.

:::steps
1. O **parser** valida a sintaxe e confere se `produtos` e `preco` existem
2. O **otimizador** decide, por exemplo, usar um índice em vez de ler a tabela inteira
3. O **executor** pede as páginas ao gerenciador de armazenamento
4. O resultado volta ao cliente como uma tabela
:::

---

## :icon[book-open] Dicionário de dados

**Metadados** são dados sobre os dados: nomes de tabelas, colunas, tipos, chaves, índices, usuários e permissões. O SGBD os guarda no **dicionário de dados** (ou catálogo), que o parser consulta a cada comando.

No MySQL, o catálogo é exposto pelo banco `information_schema`:

```sql
SELECT table_name, engine
FROM information_schema.tables
WHERE table_schema = 'loja'
ORDER BY table_name
LIMIT 3;
```

| table_name | engine |
|---|---|
| categorias | InnoDB |
| clientes | InnoDB |
| departamentos | InnoDB |

:::info
No PostgreSQL, o catálogo fica em `pg_catalog`; o `information_schema` também existe, por compatibilidade com o padrão SQL.
:::

---

## :icon[plug] Conectando a um servidor MySQL

Para falar com o SGBD você precisa de quatro dados: **host**, **porta** (3306 por padrão), **usuário** e **senha**.

:::example
No terminal, com o cliente `mysql`:

```bash
mysql -h 127.0.0.1 -P 3306 -u aluno -p
```

O `-p` sem valor faz o cliente pedir a senha. Conectado, explore:

```sql
SHOW DATABASES;
USE loja;
SHOW TABLES;
```

O último comando lista as sete tabelas do banco: `categorias`, `clientes`, `departamentos`, `funcionarios`, `itens_pedido`, `pedidos` e `produtos`.
:::

No **MySQL Workbench**, os mesmos quatro dados vão na tela "New Connection".

:::info
No PostgreSQL a porta padrão é 5432 e o cliente de terminal é o `psql`.
:::

---

## :icon[triangle-alert] Erros comuns

:::warning
- Confundir **nível conceitual** com **nível interno**: o conceitual descreve tabelas e chaves; o interno, arquivos e índices
- Achar que criar um índice muda o esquema conceitual: índice é nível interno, as consultas continuam iguais
- Esperar que a independência lógica seja total: remover uma coluna usada por uma visão quebra a visão
- Colar a senha no comando (`-psenha`): ela fica no histórico do terminal; use `-p` e digite quando pedir
- Tentar a porta 5432 no MySQL: ela é do PostgreSQL; o MySQL usa 3306
:::

---

## :icon[list-checks] Resumo

:::summary
- A arquitetura **ANSI-SPARC** separa o banco em nível **externo** (visões), **conceitual** (esquema lógico) e **interno** (armazenamento)
- **Independência lógica**: mudar o conceitual sem reescrever aplicações; **física**: mudar o armazenamento sem mudar o conceitual
- O **processador de consultas** (parser, otimizador, executor) decide como buscar; o **gerenciador de armazenamento** cuida de buffer, arquivos, transações e locks
- O **dicionário de dados** guarda os metadados; no MySQL, `information_schema`
- Conectar ao MySQL exige host, porta 3306, usuário e senha
:::

---

## :icon[arrow-right] Próximos passos

Você viu como um SGBD é organizado por dentro. Na próxima aula, **O universo dos SGBDs: relacional e NoSQL**, você conhece as famílias de SGBDs que existem hoje, compara tabelas com documentos, chaves e grafos e escreve seus primeiros comandos SQL no banco `loja`.

:::tip
Faça o quiz desta aula antes de avançar: ele pede para classificar mudanças entre independência lógica e física, como no exercício.
:::
