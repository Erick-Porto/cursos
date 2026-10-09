---
title: O que é um SGBD
summary: Dados, informação e banco de dados; o que um SGBD faz por você e como ele evoluiu até hoje.
module: fundamentos
duration_minutes: 20
objectives:
  - Distinguir dados, informação e banco de dados
  - Explicar o que é um SGBD e suas funções principais
  - Reconhecer os benefícios de usar um SGBD
  - Situar as gerações de SGBDs em uma linha do tempo
---

# O que é um SGBD

Administração de Bancos de Dados · Aula 01

---

## O que você vai aprender

:::goal
- A diferença entre dados, informação e banco de dados
- O que é um SGBD e quais funções ele cumpre
- Os benefícios de confiar os dados a um SGBD
- Como os SGBDs evoluíram, do modelo hierárquico à nuvem
:::

---

## :icon[triangle-alert] Por que isso importa

Uma loja controla pedidos e estoque em planilhas. Cada vendedor tem a sua.

- O produto "Teclado" aparece com três preços diferentes
- Um pedido foi digitado duas vezes e ninguém percebeu
- O notebook que guardava a planilha principal quebrou

:::question
Quantos teclados há no estoque hoje? Quem consegue responder com certeza?
:::

Esse é o **caos dos dados sem SGBD**: redundância, inconsistência e perda. Esta aula apresenta o software que resolve isso.

---

## :icon[binary] Dados, informação e banco de dados

| Conceito | O que é | Exemplo |
|---|---|---|
| **Dado** | fato bruto, sem contexto | `Ana Souza`, `180.00`, `2025-03-02` |
| **Informação** | dados organizados, com significado | A cliente Ana Souza fez um pedido de R$ 180,00 em 2 de março de 2025 |
| **Banco de dados** | coleção organizada de dados sobre um assunto | as tabelas `clientes`, `pedidos` e `produtos` da loja |

O banco de dados guarda os dados de um jeito que facilita transformá-los em informação.

---

## :icon[library] A biblioteca sem bibliotecário

Pense em uma biblioteca grande, antes dos computadores.

::::columns
:::col
**Sem bibliotecário**

- Cada leitor devolve o livro onde quiser
- Fichas de empréstimo se perdem
- Dois leitores levam "o último exemplar"
:::
:::col
**Com o bibliotecário-chefe**

- Define onde cada livro fica
- Cataloga e localiza qualquer título
- Controla quem pega o quê e quando
:::
::::

O **SGBD** é o bibliotecário-chefe da era digital: organiza, cataloga, encontra e faz cumprir as regras.

---

## :icon[server] O que é um SGBD

Um **SGBD** (Sistema de Gerenciamento de Banco de Dados) é o **software** que cria, acessa, controla e gerencia um banco de dados.

:::center
![Fluxo: aplicações e usuários enviam comandos ao SGBD, que lê e grava nos arquivos de dados do disco](images/01-sgbd-entre-apps-e-dados.svg)
:::

Ninguém abre os arquivos de dados diretamente. Toda leitura e toda gravação passam pelo SGBD, que aplica as regras antes de tocar no disco.

:::info
MySQL, PostgreSQL, Oracle e SQL Server são SGBDs. O banco `loja` que você vai usar no curso é um banco de dados gerenciado pelo MySQL.
:::

---

## :icon[list-checks] Funções principais do SGBD

| Função | O que faz | Comandos ou mecanismo |
|---|---|---|
| **Definição** | cria e altera estruturas | `CREATE`, `ALTER`, `DROP` |
| **Manipulação** | insere, consulta, atualiza e remove | `SELECT`, `INSERT`, `UPDATE`, `DELETE` |
| **Segurança** | decide quem acessa o quê | `GRANT`, `REVOKE` |
| **Integridade** | faz cumprir as regras do negócio | `PRIMARY KEY`, `FOREIGN KEY`, `CHECK` |
| **Concorrência** | coordena acessos simultâneos | transações e locks |
| **Backup e recuperação** | protege contra falhas | cópias e log de transações |

Ao longo do curso você vai usar cada uma delas.

---

## :icon[circle-help] Pense

Volte à loja das planilhas. Para cada problema, qual função do SGBD teria evitado o estrago?

:::question
1. Dois vendedores baixaram o estoque do mesmo teclado no mesmo instante, e a contagem ficou errada.
2. Um pedido foi registrado para um cliente que não existe no cadastro.
3. O notebook com a planilha principal quebrou e levou os dados junto.
:::

---

## :icon[circle-check] Solução

| Problema | Função do SGBD |
|---|---|
| Dois vendedores alteram o mesmo estoque | **Concorrência**: o SGBD ordena as duas gravações e o saldo final fica correto |
| Pedido de cliente inexistente | **Integridade**: a chave estrangeira recusa um pedido sem cliente |
| Notebook quebrou | **Backup e recuperação**: a cópia e o log de transações restauram os dados |

:::tip
Nenhuma dessas proteções depende de o usuário "lembrar de fazer certo". O SGBD aplica a regra sempre.
:::

---

## :icon[thumbs-up] Benefícios de usar um SGBD

- :icon[copy] **Menos redundância**: cada fato é guardado uma vez
- :icon[check-check] **Consistência**: um dado não contradiz outro
- :icon[shield] **Integridade**: regras de negócio viram restrições no banco
- :icon[lock] **Segurança**: permissões por usuário e por tabela
- :icon[users] **Concorrência**: muitos usuários ao mesmo tempo, sem bagunça
- :icon[database-backup] **Recuperação**: falhas de energia ou de disco não apagam o trabalho
- :icon[unlink] **Independência de dados**: a aplicação não precisa saber onde os bytes estão

---

## :icon[history] Breve história dos SGBDs

:::center
![Linha do tempo: hierárquico nos anos 1960, rede em 1969, relacional em 1970, SQL padrão em 1986, objeto-relacional nos anos 1990, NoSQL nos anos 2000 e nuvem nos anos 2010](images/01-linha-do-tempo.svg)
:::

Cada geração nasceu de um limite da anterior:

- Nos modelos **hierárquico** e de **rede**, o programa precisava saber o caminho até o dado
- Em 1970, **Edgar Codd** propôs o modelo **relacional**: tabelas, e você descreve o que quer, não como buscar
- O **SQL** virou padrão em 1986 e segue dominante

---

## :icon[milestone] O que cada geração resolveu

| Geração | Ideia central | Exemplos |
|---|---|---|
| Hierárquico e rede | registros ligados por ponteiros | IMS, IDMS |
| Relacional | tabelas, chaves e SQL | MySQL, PostgreSQL, Oracle |
| Objeto-relacional | tipos complexos e extensões dentro do relacional | PostgreSQL |
| NoSQL | esquema flexível e escala horizontal | MongoDB, Cassandra, Redis |
| Nuvem | banco como serviço, sem cuidar do servidor | Amazon RDS, Cloud SQL |

:::info
Nenhuma geração "matou" a anterior. Hoje, o relacional ainda guarda a maior parte dos dados críticos das empresas.
:::

---

## :icon[triangle-alert] Erros comuns

:::warning
- Chamar o **MySQL** de "banco de dados": o MySQL é o SGBD; o banco de dados é o `loja` que ele gerencia
- Achar que planilha e banco de dados são a mesma coisa: a planilha não impõe regras nem controla concorrência
- Confundir **dado** (`180.00`) com **informação** (o valor do pedido da Ana)
- Supor que o NoSQL substituiu o relacional: eles convivem e resolvem problemas diferentes
:::

---

## :icon[list-checks] Resumo

:::summary
- **Dados** são fatos brutos; **informação** é dado com contexto; o **banco de dados** guarda tudo de forma organizada
- O **SGBD** é o software entre as aplicações e os arquivos: define, manipula, protege e recupera dados
- Suas funções principais: definição, manipulação, segurança, integridade, concorrência e backup
- Do hierárquico à nuvem, cada geração respondeu a um limite da anterior; o relacional de Codd segue como base
:::

---

## :icon[arrow-right] Próximos passos

Você já sabe **o que** um SGBD faz. Na próxima aula, **Arquitetura de um SGBD**, você abre a caixa e vê **como** ele faz: os três níveis ANSI-SPARC, a independência de dados e o caminho que uma consulta percorre do parser ao disco.

:::tip
Antes de seguir, faça o quiz desta aula. Ele cobra justamente as funções e os benefícios que você acabou de ver.
:::
