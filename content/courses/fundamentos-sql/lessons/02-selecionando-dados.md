---
title: Selecionando dados
summary: Sua primeira consulta com SELECT e FROM, escolhendo e renomeando colunas.
module: consultas
duration_minutes: 20
objectives:
  - Escrever um SELECT simples
  - Escolher colunas específicas e renomeá-las com AS
  - Ordenar e limitar o resultado
---

# Selecionando dados

Fundamentos de SQL · Aula 2

---

## O que você vai aprender

:::goal
- Montar uma consulta com `SELECT` e `FROM`
- Escolher só as colunas que interessam
- Dar nomes melhores às colunas com `AS`
- Ordenar com `ORDER BY` e limitar com `LIMIT`
:::

---

## A tabela desta aula

Vamos usar a tabela `produtos`:

| id | nome            | categoria | preco |
|----|-----------------|-----------|-------|
| 1  | Teclado         | periferico| 120   |
| 2  | Monitor 24"     | video     | 900   |
| 3  | Mouse           | periferico| 60    |
| 4  | Webcam          | video     | 250   |

---

## A consulta mais simples

```sql
SELECT *
FROM produtos;
```

- `SELECT` diz **o que** você quer ver
- `FROM` diz **de onde** vem
- `*` significa "todas as colunas"

O resultado é a tabela inteira, do jeito que está.

---

## Escolhendo colunas

Na prática, quase nunca queremos tudo.

```sql
SELECT nome, preco
FROM produtos;
```

| nome        | preco |
|-------------|-------|
| Teclado     | 120   |
| Monitor 24" | 900   |
| Mouse       | 60    |
| Webcam      | 250   |

:::tip
Liste só as colunas necessárias. A consulta fica mais rápida e o resultado, mais legível.
:::

---

## Renomeando com AS

O nome da coluna no banco nem sempre é bom para quem vai ler.

```sql
SELECT nome AS produto,
       preco AS preco_em_reais
FROM produtos;
```

`AS` cria um **apelido** (alias) só para o resultado. A tabela não muda.

---

## Ordenando o resultado

```sql
SELECT nome, preco
FROM produtos
ORDER BY preco DESC;
```

- `ORDER BY preco` ordena do menor para o maior (`ASC`, padrão)
- `DESC` inverte: do maior para o menor

Sem `ORDER BY`, a ordem das linhas **não é garantida**.

---

## Limitando a quantidade

```sql
SELECT nome, preco
FROM produtos
ORDER BY preco DESC
LIMIT 2;
```

| nome        | preco |
|-------------|-------|
| Monitor 24" | 900   |
| Webcam      | 250   |

`LIMIT` devolve só as primeiras linhas. Combinado com `ORDER BY`, responde "os 2 mais caros".

---

## Pratique

:::example Desafio
Escreva uma consulta que mostre o **nome** e a **categoria** dos produtos, com a coluna de categoria chamada `tipo`, em ordem alfabética de nome.
:::

:::info Resposta
```sql
SELECT nome, categoria AS tipo
FROM produtos
ORDER BY nome;
```
:::

---

## Erros comuns

:::warning
- Esquecer a vírgula entre colunas: `SELECT nome preco` trata `preco` como apelido de `nome`
- Usar `ORDER BY` depois de `LIMIT`: a ordem das cláusulas é fixa
- Confiar na ordem das linhas sem `ORDER BY`
:::

---

## Resumo

:::summary
- `SELECT colunas FROM tabela` é a base de toda consulta
- `AS` renomeia colunas no resultado
- `ORDER BY` ordena; `DESC` inverte
- `LIMIT` corta o resultado nas primeiras linhas
:::

Próxima aula: filtrando linhas com `WHERE`.
