---
title: Views e índices
summary: Salve consultas como views e acelere buscas com índices, sabendo o que cada um custa.
module: sql-manipulacao-e-estrutura
duration_minutes: 25
objectives:
  - Criar, usar e remover views para simplificar consultas e proteger colunas
  - Reconhecer quando uma view aceita INSERT e UPDATE
  - Explicar como um índice B-tree acelera a busca por uma linha
  - Decidir em quais colunas criar índices e avaliar seus custos
---

# Views e índices

Administração de Bancos de Dados · Aula 19

---

## O que você vai aprender

:::goal
- O que é uma view, como criar com `CREATE OR REPLACE VIEW` e para que ela serve
- Quais views aceitam `INSERT` e `UPDATE`, e quais são só leitura
- Como um índice encontra uma linha sem ler a tabela inteira
- Quando criar um índice, em que ordem colocar as colunas e o preço disso
:::

---

## :icon[circle-help] Por que isso importa

Dois pedidos chegam ao DBA da `loja` na mesma manhã:

- :icon[file-text] "O relatório de pedidos com nome do cliente é um `JOIN` que cinco pessoas reescrevem toda semana, cada uma de um jeito."
- :icon[timer] "Buscar um cliente pelo e-mail demora 3 segundos. A tabela tem 2 milhões de linhas."

O primeiro problema é de **organização**: a consulta precisa de um nome. O segundo é de **acesso**: o MySQL está lendo a tabela inteira para achar uma linha.

:::question
Como você guardaria uma consulta para reutilizar? E como evitaria ler 2 milhões de linhas para achar uma?
:::

---

## :icon[eye] View: uma consulta com nome

Uma **view** é um `SELECT` salvo no banco com um nome. Você consulta a view como se fosse uma tabela, e o MySQL executa o `SELECT` guardado por baixo.

```sql
CREATE OR REPLACE VIEW vw_pedidos_clientes AS
SELECT p.id, c.nome AS cliente, p.data_pedido, p.status, p.total
FROM pedidos p
JOIN clientes c ON c.id = p.cliente_id;

SELECT cliente, total FROM vw_pedidos_clientes WHERE status = 'pago';
```

| cliente | total |
|---|---|
| Ana Souza | 180.00 |

:::center
![Duas tabelas base alimentam a view, que guarda só a consulta; a aplicação consulta a view como se fosse uma tabela](images/19-view-consulta-salva.svg)
:::

`OR REPLACE` substitui a definição se a view já existir. Para apagar: `DROP VIEW IF EXISTS vw_pedidos_clientes;`.

---

## :icon[layers] Para que servem as views

- :icon[combine] **Simplificar**: um `JOIN` de três tabelas vira `SELECT * FROM vw_relatorio_vendas`
- :icon[eye-off] **Esconder colunas sensíveis**: a view mostra só o que aquele usuário pode ver
- :icon[file-check] **Padronizar relatórios**: todo mundo usa a mesma regra de "pedido pago"

```sql
CREATE OR REPLACE VIEW vw_funcionarios_publico AS
SELECT id, nome, cargo, departamento_id
FROM funcionarios;

GRANT SELECT ON loja.vw_funcionarios_publico TO 'atendimento'@'%';
```

O usuário `atendimento` consulta nomes e cargos, mas nunca vê `salario`: a coluna não existe na view, e ele não tem acesso à tabela `funcionarios`.

:::info
A view não guarda dados nem resultados. Cada `SELECT` nela roda a consulta de novo: ela organiza, não acelera.
:::

---

## :icon[pencil] Views atualizáveis e suas limitações

Uma view aceita `INSERT`, `UPDATE` e `DELETE` quando o MySQL consegue mapear cada linha dela para **uma linha de uma única tabela**:

```sql
UPDATE vw_funcionarios_publico SET cargo = 'DBA Sênior' WHERE id = 1;
-- funciona: altera funcionarios.cargo
```

Ela deixa de ser atualizável se tiver:

- :icon[sigma] funções agregadas, `GROUP BY` ou `HAVING`
- :icon[copy] `DISTINCT`, `UNION` ou subconsulta no `SELECT`
- :icon[combine] `JOIN`, no caso de `INSERT` e `DELETE` (`UPDATE` em uma tabela só ainda pode funcionar)
- :icon[calculator] coluna calculada (`preco * quantidade`) justamente na coluna que você quer alterar

`INSERT` pela view exige que todas as colunas `NOT NULL` sem `DEFAULT` da tabela estejam na view.

:::tip
`WITH CHECK OPTION` no fim da view impede gravar linhas que a própria view não mostraria.
:::

---

## :icon[circle-help] Pense

:::question
A aplicação roda 5 mil vezes por minuto:

```sql
SELECT cliente, total FROM vw_pedidos_clientes WHERE status = 'pago';
```

Um colega sugere: "Como a view já está criada, essa consulta é mais rápida que o `JOIN` escrito à mão."

Ele tem razão? O que realmente acontece quando a view é consultada?
:::

Resposta: não. A view só guarda o texto do `SELECT`; a cada execução o MySQL faz o `JOIN` de novo, com o mesmo plano. O que acelera essa consulta é um **índice** bem escolhido, assunto a partir de agora.

---

## :icon[search] Índice: o atalho para a linha certa

Sem índice, `WHERE email = 'gabi@exemplo.com'` obriga o MySQL a ler **todas** as linhas, uma a uma: a **varredura completa** (full scan).

Um **índice** é uma estrutura à parte, ordenada pelos valores da coluna, em que cada entrada aponta para a linha. O InnoDB usa uma **B-tree**: árvore rasa e larga em que a busca desce poucos níveis (três ou quatro, mesmo com milhões de linhas) e chega ao ponteiro.

:::center
![Animação comparando a busca por um e-mail: sem índice as oito linhas acendem uma a uma; com índice a busca desce raiz, folha e linha](images/19-busca-com-e-sem-indice.svg)
:::

Como o índice remissivo de um livro: você acha o termo na lista ordenada e vai direto à página, sem folhear tudo.

---

## :icon[plus] CREATE INDEX, UNIQUE INDEX e SHOW INDEX

```sql
CREATE INDEX idx_clientes_cidade ON clientes (cidade);
CREATE UNIQUE INDEX uq_produtos_nome ON produtos (nome);
DROP INDEX idx_clientes_cidade ON clientes;
```

`UNIQUE INDEX` acelera a busca **e** proíbe repetição, como a constraint `UNIQUE`. Aliás, `PRIMARY KEY`, `UNIQUE` e `FOREIGN KEY` já criam índices sozinhos: não duplique.

```sql
SHOW INDEX FROM pedidos;
```

| Non_unique | Key_name | Seq_in_index | Column_name |
|---|---|---|---|
| 0 | PRIMARY | 1 | id |
| 1 | cliente_id | 1 | cliente_id |

O índice `cliente_id` apareceu sem você pedir: o InnoDB o criou junto com a chave estrangeira.

---

## :icon[columns-3] Índice composto: a ordem das colunas importa

```sql
CREATE INDEX idx_pedidos_cliente_data ON pedidos (cliente_id, data_pedido);
```

O índice fica ordenado por `cliente_id` e, dentro de cada cliente, por `data_pedido`. Como uma lista telefônica: por sobrenome, depois por nome. Ele só serve se a busca começar pela **primeira** coluna (regra do prefixo à esquerda).

| Consulta | Usa o índice? |
|---|---|
| `WHERE cliente_id = 1` | sim |
| `WHERE cliente_id = 1 AND data_pedido >= '2025-03-01'` | sim |
| `WHERE cliente_id = 1 ORDER BY data_pedido` | sim, e sem ordenar depois |
| `WHERE data_pedido = '2025-03-09'` | não: a primeira coluna não está no filtro |

:::tip
Coloque primeiro a coluna de igualdade mais usada; a de intervalo ou ordenação vem depois.
:::

---

## :icon[scale] Quando criar um índice e quanto ele custa

::::columns
:::col
**Vale a pena quando a coluna**

- :icon[funnel] filtra no `WHERE` com frequência
- :icon[link] liga tabelas no `JOIN`
- :icon[arrow-down-a-z] ordena no `ORDER BY`
- :icon[fingerprint] tem **alta seletividade**: muitos valores distintos (`email`, não `status`)
:::
:::col
**Custa, porque cada índice**

- :icon[hard-drive] ocupa espaço em disco
- :icon[pencil] é atualizado em todo `INSERT`, `UPDATE` e `DELETE`
- :icon[gauge] torna a escrita mais lenta: dez índices, dez estruturas a manter
- :icon[eye] precisa ser observado: índice sem uso é só custo
:::
::::

Crie poucos, nas consultas que doem, e meça. Na aula **Planos de execução com EXPLAIN** você vê como o MySQL mostra se usou o índice.

---

## :icon[flask-conical] Pratique

:::example
1. Crie a view `vw_produtos_categorias` com `id`, `nome` e `preco` do produto e o nome da categoria como `categoria`. Produtos sem categoria precisam aparecer.
2. A busca `SELECT * FROM clientes WHERE cidade = 'São Paulo'` virou a mais frequente do sistema. Crie o índice adequado.
3. A consulta `SELECT * FROM pedidos WHERE cliente_id = 2 AND status = 'pago'` roda milhares de vezes por dia. Crie um índice composto e justifique a ordem das colunas.
:::

Para conferir, consulte a view e rode `SHOW INDEX FROM pedidos;`.

---

## :icon[circle-check] Solução

```sql
CREATE OR REPLACE VIEW vw_produtos_categorias AS
SELECT p.id, p.nome, p.preco, c.nome AS categoria
FROM produtos p
LEFT JOIN categorias c ON c.id = p.categoria_id;

CREATE INDEX idx_clientes_cidade ON clientes (cidade);

CREATE INDEX idx_pedidos_cliente_status ON pedidos (cliente_id, status);
```

1. `LEFT JOIN` mantém produtos com `categoria_id` nulo; com `JOIN` eles sumiriam.
2. `cidade` aparece no `WHERE` e tem valores variados: um índice simples resolve.
3. `cliente_id` vai primeiro: é a coluna mais seletiva (muitos clientes, só quatro status), e assim o índice também atende `WHERE cliente_id = 2` sozinho. O índice automático da chave estrangeira pode ser removido: o composto, que começa por `cliente_id`, serve à `FOREIGN KEY` do mesmo jeito.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Achar que a view guarda o resultado: ela só guarda a consulta, e roda tudo de novo a cada `SELECT`
- Tentar `INSERT` em uma view com `JOIN` ou `GROUP BY` e não entender o erro
- Criar índice em coluna de poucos valores (`status`, `ativo`) e não ganhar nada
- Criar índice `(data_pedido, cliente_id)` e filtrar só por `cliente_id`: na ordem errada, o índice fica sem uso
- Indexar todas as colunas "por garantia" e ver os `INSERT` ficarem lentos
:::

---

## :icon[list-checks] Resumo

:::summary
- Uma **view** é um `SELECT` com nome: simplifica `JOIN`s, esconde colunas e padroniza regras, mas não acelera nada
- Views sobre uma única tabela, sem agregação, aceitam `UPDATE` e `INSERT`; as demais são só leitura
- Um **índice** B-tree é uma estrutura ordenada que leva à linha em poucos passos, sem varrer a tabela
- Crie índices em colunas de `WHERE`, `JOIN` e `ORDER BY` com alta seletividade; no composto, a primeira coluna manda
- Cada índice custa disco e escrita mais lenta; `PRIMARY KEY`, `UNIQUE` e `FOREIGN KEY` já criam os seus
:::

---

## :icon[arrow-right] Próximos passos

Este foi o último passo do módulo **SQL: manipulação e estrutura**. Você já consulta, altera, constrói e otimiza um banco. O próximo módulo, **Transações e concorrência**, começa com a aula **Transações e ACID**: o que garante que uma venda com três `UPDATE` termine inteira ou não aconteça.

Antes de seguir, responda ao quiz desta aula.
