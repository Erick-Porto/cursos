---
title: O que é um banco de dados
summary: Por que guardamos dados de forma organizada e qual é o papel do SQL.
module: introducao
duration_minutes: 15
objectives:
  - Explicar o que é um banco de dados relacional
  - Identificar tabelas, linhas e colunas
  - Reconhecer o papel do SQL
---

# O que é um banco de dados

Fundamentos de SQL · Aula 1

---

## O que você vai aprender

:::goal
- O que é um banco de dados e por que ele existe
- Como os dados se organizam em tabelas, linhas e colunas
- Onde o SQL entra nessa história
:::

---

## Um problema do dia a dia

Imagine uma loja que anota os pedidos em planilhas.

- Cada vendedor mantém a própria planilha
- O mesmo cliente aparece com três grafias diferentes
- Ninguém sabe qual é o estoque real

:::question
Como responder "quantos pedidos tivemos ontem?" com confiança?
:::

---

## Banco de dados: um lugar único e confiável

Um **banco de dados** guarda informação de forma organizada, com regras, para muitas pessoas ao mesmo tempo.

Ele garante que:

- os dados sigam **regras**: todo pedido tem um cliente
- várias pessoas leiam e gravem **ao mesmo tempo** sem bagunça
- nada se perca quando o computador desliga

---

## Tabelas, linhas e colunas

![Diagrama de uma tabela: nomes das colunas no topo e uma linha para cada registro](images/tabela.svg)

- **Tabela**: um assunto (clientes, pedidos, produtos)
- **Coluna**: uma característica (nome, e-mail, preço)
- **Linha**: um registro (um cliente específico)

---

## Exemplo: a tabela clientes

| id | nome         | cidade         |
|----|--------------|----------------|
| 1  | Ana Souza    | Rio de Janeiro |
| 2  | Bruno Lima   | São Paulo      |
| 3  | Carla Mendes | Recife         |

Cada linha é um cliente. Cada coluna é um dado sobre ele.

:::tip
A coluna `id` identifica cada linha de forma única. Ela é a **chave primária** da tabela.
:::

---

## Onde o SQL entra

**SQL** (Structured Query Language) é a linguagem para conversar com o banco.

```sql
SELECT nome, cidade
FROM clientes
WHERE cidade = 'Recife';
```

Lê-se: "selecione nome e cidade, da tabela clientes, onde a cidade é Recife".

---

## Pense

:::question
A loja do início da aula tem pedidos, clientes e produtos.

Quais seriam as **tabelas**? Que **colunas** a tabela de pedidos precisaria ter para ligar um pedido ao cliente que o fez?
:::

---

## Erros comuns no começo

:::warning
- Confundir **tabela** (o conjunto) com **linha** (um registro)
- Supor que o banco entende variações: `Recife` e `recife` podem ser valores diferentes
- Esquecer o `;` no fim do comando em algumas ferramentas
:::

---

## Resumo

:::summary
- Um banco de dados organiza informação com regras e acesso simultâneo
- Os dados vivem em **tabelas**, feitas de **colunas** e **linhas**
- **SQL** é a linguagem para consultar e alterar esses dados
:::

Na próxima aula: sua primeira consulta com `SELECT`.
