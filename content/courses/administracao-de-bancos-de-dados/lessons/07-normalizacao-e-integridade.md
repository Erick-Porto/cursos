---
title: Normalização e integridade
summary: Elimine redundância com as três formas normais e proteja os dados com constraints.
module: modelagem
duration_minutes: 25
objectives:
  - Reconhecer as anomalias de uma tabela desnormalizada
  - Aplicar a 1FN, a 2FN e a 3FN a uma tabela
  - Decidir quando desnormalizar de propósito
  - Implementar integridade de entidade, referencial e de domínio com constraints
---

# Normalização e integridade

Administração de Bancos de Dados · Aula 07

---

## O que você vai aprender

:::goal
- Por que uma tabela "faz-tudo" gera dados repetidos e contraditórios
- As três formas normais, uma de cada vez, com a tabela `pedidos`
- Quando vale a pena desnormalizar e como fazer isso com segurança
- Os quatro tipos de integridade e as constraints que os garantem
:::

---

## :icon[triangle-alert] Por que isso importa

A loja começou com uma única tabela `pedidos`, "para simplificar":

| id | cliente | email | produtos |
|---|---|---|---|
| 1 | Ana Souza | ana@exemplo.com | Teclado, Mouse |
| 2 | Bruno Lima | bruno@exemplo.com | Monitor 27" |
| 3 | Ana Souza | ana@exemplo.com | Notebook |

Funciona com três linhas. Com três mil, vira um problema.

:::question
Ana trocou de e-mail. Quantas linhas você precisa atualizar? E se esquecer uma delas?
:::

---

## :icon[bug] As três anomalias

Dados repetidos abrem três portas para o erro:

| Anomalia | O que acontece na tabela `pedidos` |
|---|---|
| **Inserção** | Diego ainda não comprou nada. Para cadastrá-lo, seria preciso inventar um pedido |
| **Atualização** | O novo e-mail de Ana precisa ser gravado em todas as linhas dela. Uma esquecida gera dois e-mails "válidos" |
| **Exclusão** | Cancelar e apagar o pedido 2 faz Bruno desaparecer do sistema |

A causa é sempre a mesma: a tabela mistura assuntos diferentes (pedido, cliente, produto).

---

## :icon[workflow] Normalização: o roteiro

**Normalizar** é dividir uma tabela em tabelas menores, cada uma sobre um único assunto, sem perder informação.

A ferramenta é a **dependência funcional**: B depende de A quando cada valor de A determina um só valor de B. Exemplo: `cliente_id` determina `email`.

:::center
![Animação: a tabela pedidos, que guardava a lista de produtos em uma célula, se divide em pedidos e itens na 1FN](images/07-normalizacao-passo-a-passo-a.svg)
:::

---

## :icon[workflow] O roteiro continua: 2FN e 3FN

Cada etapa move para uma tabela nova o que não depende da chave inteira.

:::center
![Animação: na 2FN, produto_nome sai de itens para a nova tabela produtos; na 3FN, nome e e-mail do cliente saem de pedidos para a nova tabela clientes](images/07-normalizacao-passo-a-passo-b.svg)
:::

:::tip Para memorizar
Todo atributo deve depender **da chave** (1FN), **de toda a chave** (2FN) e **de nada além da chave** (3FN).
:::

---

## :icon[rows-3] 1FN: valores atômicos

Uma tabela está na **primeira forma normal** quando cada célula guarda um único valor e não há grupos repetidos (`produto1`, `produto2`, `produto3`).

A célula `Teclado, Mouse` quebra a regra. A solução é uma linha por item:

| pedido_id | produto | quantidade |
|---|---|---|
| 1 | Teclado | 1 |
| 1 | Mouse | 1 |
| 2 | Monitor 27" | 1 |

Agora dá para filtrar, contar e somar por produto.

---

## :icon[key-round] 2FN: toda a chave

Vale para chaves compostas. A tabela está na **segunda forma normal** quando cada atributo fora da chave depende da chave **inteira**, não de parte dela.

| pedido_id | produto_id | produto_nome | quantidade |
|---|---|---|---|
| 1 | 1 | Teclado | 1 |
| 1 | 2 | Mouse | 1 |
| 3 | 5 | Notebook | 1 |

A chave é (`pedido_id`, `produto_id`). `produto_nome` depende só de `produto_id`: é uma **dependência parcial**. Se o Teclado mudar de nome, você edita todos os pedidos.

Solução: `produto_nome` vai para `produtos`; em `itens_pedido` fica só `quantidade`.

---

## :icon[waypoints] 3FN: nada além da chave

A tabela está na **terceira forma normal** quando nenhum atributo fora da chave depende de outro atributo fora da chave.

| id | cliente_id | cliente_nome | cliente_email |
|---|---|---|---|
| 1 | 1 | Ana Souza | ana@exemplo.com |
| 3 | 1 | Ana Souza | ana@exemplo.com |

`cliente_nome` depende de `cliente_id`, que depende de `id`. É uma **dependência transitiva**: o nome pertence ao cliente, não ao pedido.

Solução: `clientes(id, nome, email)` e `pedidos(id, cliente_id)`. O atributo que determinava os outros vira chave estrangeira.

---

## :icon[flask-conical] Pratique

Uma escola guarda as matrículas em uma única tabela:

```plaintext
matriculas (aluno_id, disciplina_id, aluno_nome, telefones,
            disciplina_nome, professor_id, professor_nome, nota)

aluno_id | disciplina_id | aluno_nome | telefones            | nota
1        | 10            | Ana Souza  | 9999-1111, 8888-2222 | 8.5
```

A chave é (`aluno_id`, `disciplina_id`). Cada disciplina tem um único professor.

:::question
Leve a tabela até a 3FN. Para cada tabela nova, diga qual forma normal a exigiu.
:::

---

## :icon[circle-check] Solução

```plaintext
alunos          (id, nome)
aluno_telefones (aluno_id, telefone)        -- 1FN
disciplinas     (id, nome, professor_id)    -- 2FN
professores     (id, nome)                  -- 3FN
matriculas      (aluno_id, disciplina_id, nota)
```

:::steps
1. **1FN**: `telefones` guardava uma lista. Agora é uma linha por telefone em `aluno_telefones`.
2. **2FN**: `aluno_nome` depende só de `aluno_id`; `disciplina_nome` e `professor_id`, só de `disciplina_id`. Cada um vai para a sua tabela.
3. **3FN**: em `disciplinas`, `professor_nome` dependia de `professor_id`, não da chave. Nasce `professores`.
:::

`nota` depende da chave inteira e fica em `matriculas`.

---

## :icon[gauge] Quando desnormalizar de propósito

Normalizar protege a escrita. Às vezes a leitura pede o contrário:

- :icon[chart-bar] **Relatórios**: uma tabela larga, pré-calculada, evita dezenas de junções
- :icon[sigma] **Valores derivados**: `pedidos.total` poupa somar os itens a cada consulta
- :icon[history] **Fotografia do momento**: `itens_pedido.preco_unitario` guarda o preço do dia, mesmo que o produto mude depois

:::tip Regra de ouro
Desnormalize depois de medir, documente a cópia e defina quem a mantém sincronizada (trigger ou aplicação).
:::

---

## :icon[shield] Integridade: quatro camadas de proteção

Normalizar organiza. **Integridade** é o conjunto de regras que impede dados inválidos de entrar.

:::center
![Quatro camadas de integridade: entidade, referencial, domínio e negócio, com o mecanismo de cada uma](images/07-tipos-de-integridade.svg)
:::

| Tipo | Garante | Mecanismo |
|---|---|---|
| Entidade | cada linha é única e identificável | `PRIMARY KEY` |
| Referencial | toda referência aponta para uma linha que existe | `FOREIGN KEY` |
| Domínio | cada valor é válido para a coluna | tipo, `NOT NULL`, `CHECK`, `DEFAULT` |
| Negócio | regras da empresa | triggers, aplicação |

---

## :icon[code] Exemplo: constraints no MySQL

:::example
```sql
CREATE TABLE clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,        -- entidade
  nome VARCHAR(120) NOT NULL,               -- domínio
  email VARCHAR(160) NOT NULL UNIQUE,
  cidade VARCHAR(80)
);
CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  data_pedido DATE NOT NULL,
  total DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)   -- referencial
    ON DELETE RESTRICT
);
```
:::

`ON DELETE RESTRICT` (o padrão) impede apagar um cliente que tem pedidos. `CASCADE` apagaria os pedidos junto; `SET NULL` desfaria o vínculo.

---

## :icon[flask-conical] O que o MySQL responde

:::example
```sql
INSERT INTO clientes (nome, email) VALUES ('Ana Souza', 'ana@exemplo.com');
INSERT INTO pedidos (cliente_id, data_pedido) VALUES (99, '2025-03-02');
INSERT INTO pedidos (cliente_id, data_pedido, total) VALUES (1, '2025-03-02', -5);
INSERT INTO clientes (nome, email) VALUES ('Ana Souza', 'ana@exemplo.com');
```

| Linha | Resultado |
|---|---|
| 1 | OK, cliente 1 criado |
| 2 | Erro 1452: a chave estrangeira falha; não existe cliente 99 |
| 3 | Erro 3819: a constraint `CHECK` foi violada |
| 4 | Erro 1062: entrada duplicada para `email` |
:::

:::info
No MySQL, `CHECK` só é aplicado desde a versão 8.0.16; antes era aceito e ignorado. No PostgreSQL sempre valeu.
:::

---

## :icon[triangle-alert] Erros comuns

:::warning
- Guardar listas em uma célula (`Teclado, Mouse`): impede filtrar, contar e somar
- Copiar o nome do cliente para `pedidos` "para facilitar": é a dependência transitiva que a 3FN proíbe
- Confiar só na aplicação para validar: outro sistema ou um script grava lixo; a constraint vale para todos
- Normalizar relatórios ao extremo e viver de junções lentas: desnormalize com critério
- Usar `ON DELETE CASCADE` sem pensar: apagar um cliente leva todos os pedidos junto
:::

---

## :icon[list-checks] Resumo

:::summary
- Tabelas que misturam assuntos geram anomalias de inserção, atualização e exclusão
- 1FN: um valor por célula. 2FN: tudo depende da chave inteira. 3FN: nada depende de outro atributo fora da chave
- Desnormalize só para leitura intensa, medindo e documentando
- Integridade de entidade (PK), referencial (FK), de domínio (tipo, `NOT NULL`, `CHECK`, `DEFAULT`) e de negócio (triggers, aplicação)
:::

---

## :icon[arrow-right] Próximos passos

Você já sabe modelar, mapear e normalizar. Na próxima aula, **Estudo de caso: sistema de biblioteca**, você aplica tudo isso de ponta a ponta: da entrevista com o bibliotecário aos scripts no MySQL.

Antes, faça o quiz desta aula e confira se as três formas normais ficaram claras.
