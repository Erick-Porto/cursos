---
title: Filtrando com WHERE
summary: Como trazer só as linhas que interessam usando condições.
module: consultas
duration_minutes: 20
objectives:
  - Filtrar linhas com WHERE
  - Combinar condições com AND, OR e NOT
  - Usar LIKE, IN e BETWEEN
---

# Filtrando com WHERE

Fundamentos de SQL · Aula 3

---

## O que você vai aprender

:::goal
- Escrever condições com `WHERE`
- Combinar condições com `AND`, `OR` e `NOT`
- Buscar padrões, listas e faixas com `LIKE`, `IN` e `BETWEEN`
:::

---

## Por que filtrar

Uma tabela pode ter milhões de linhas. Você quase sempre quer uma **parte** delas: os pedidos de hoje, os produtos de uma categoria, os clientes de uma cidade.

:::center
![Animação: a condição WHERE categoria = 'video' destaca duas linhas da tabela produtos e esmaece as outras duas](images/where-filtro.svg)
:::

`WHERE` é o filtro que separa o que importa.

---

## A forma básica

```sql
SELECT nome, preco
FROM produtos
WHERE categoria = 'video';
```

| nome        | preco |
|-------------|-------|
| Monitor 24" | 900   |
| Webcam      | 250   |

Só as linhas em que a condição é **verdadeira** entram no resultado.

---

## Operadores de comparação

| Operador | Significado        | Exemplo              |
|----------|--------------------|----------------------|
| `=`      | igual              | `preco = 60`         |
| `<>`     | diferente          | `categoria <> 'video'` |
| `>` `<`  | maior, menor       | `preco > 100`        |
| `>=` `<=`| maior ou igual, menor ou igual | `preco <= 250` |

:::tip
Textos vão entre **aspas simples**: `'video'`. Números, não: `100`.
:::

---

## Combinando condições

```sql
SELECT nome, preco
FROM produtos
WHERE categoria = 'periferico'
  AND preco < 100;
```

- `AND`: as duas condições precisam ser verdadeiras
- `OR`: basta uma ser verdadeira
- `NOT`: inverte a condição

Use parênteses quando misturar `AND` e `OR`: `(a OR b) AND c`.

---

## Padrões com LIKE

```sql
SELECT nome
FROM produtos
WHERE nome LIKE 'M%';
```

- `%` substitui **qualquer quantidade** de caracteres
- `_` substitui **um** caractere

`'M%'` encontra Monitor e Mouse. `'%cam'` encontra Webcam.

---

## Listas e faixas

```sql
-- em uma lista
WHERE categoria IN ('video', 'audio')

-- em uma faixa (inclui os limites)
WHERE preco BETWEEN 100 AND 300
```

`IN` evita vários `OR`. `BETWEEN` evita `>=` e `<=` juntos.

---

## Pratique

:::example Desafio
Liste nome e preço dos produtos da categoria `periferico` **ou** que custem mais de 500, do mais caro para o mais barato.
:::

:::info Resposta
```sql
SELECT nome, preco
FROM produtos
WHERE categoria = 'periferico' OR preco > 500
ORDER BY preco DESC;
```
:::

---

## Erros comuns

:::warning
- Aspas duplas em textos: em muitos bancos, `"video"` é um nome de coluna, não um valor
- Esquecer os parênteses ao misturar `AND` e `OR`
- `LIKE 'm%'` quando o dado está como `Mouse`: alguns bancos diferenciam maiúsculas
:::

:::danger
`WHERE` também filtra em `UPDATE` e `DELETE`. Sem ele, o comando atinge **todas** as linhas.
:::

---

## Resumo

:::summary
- `WHERE` mantém só as linhas em que a condição é verdadeira
- Combine condições com `AND`, `OR`, `NOT` e parênteses
- `LIKE` busca padrões, `IN` compara com listas, `BETWEEN` com faixas
:::

Agora é hora do quiz e, depois, da prova final do curso.
