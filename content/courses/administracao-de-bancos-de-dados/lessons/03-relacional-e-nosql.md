---
title: "O universo dos SGBDs: relacional e NoSQL"
summary: Os SGBDs relacionais, os quatro tipos de NoSQL, quando usar cada um e seus primeiros comandos SQL.
module: fundamentos
duration_minutes: 25
objectives:
  - Caracterizar o modelo relacional e seus principais SGBDs
  - Distinguir os quatro tipos de bancos NoSQL
  - Escolher entre relacional e NoSQL a partir do caso de uso
  - Criar tabelas, inserir e consultar dados com SQL básico
---

# O universo dos SGBDs: relacional e NoSQL

Administração de Bancos de Dados · Aula 03

---

## O que você vai aprender

:::goal
- O que define um SGBD relacional e quais são os mais usados
- Os quatro tipos de NoSQL: chave-valor, documentos, família de colunas e grafos
- Como escolher entre relacional e NoSQL para cada problema
- Seus primeiros comandos SQL: `CREATE TABLE`, `INSERT` e `SELECT`
:::

---

## :icon[triangle-alert] Por que isso importa

A loja vai sair das planilhas e ganhar um sistema. Alguém sugere MySQL. Outro diz que "MongoDB é mais moderno". Um terceiro quer Redis "porque é rápido".

:::question
Pedidos, pagamentos e estoque precisam bater o centavo. Qual dos três você escolheria? E se a pergunta fosse "onde guardar o carrinho de compras temporário"?
:::

Escolher o tipo errado de SGBD custa caro: migrar dados depois é um dos projetos mais arriscados que um DBA enfrenta.

---

## :icon[table] O modelo relacional

Em um **SGBD relacional**, tudo vive em **tabelas** com linhas e colunas, e as tabelas se ligam por **chaves**.

:::center
![Duas tabelas, categorias e produtos; a coluna categoria_id de produtos aponta para a chave primária id de categorias](images/03-tabelas-relacionadas.svg)
:::

- O **esquema** é definido antes de inserir dados: cada coluna tem nome e tipo
- A **chave primária** identifica a linha; a **chave estrangeira** aponta para outra tabela
- A linguagem é o **SQL**, e as gravações seguem as garantias **ACID**: atomicidade, consistência, isolamento e durabilidade

---

## :icon[database] Os principais SGBDs relacionais

| SGBD | Perfil | Onde você encontra |
|---|---|---|
| **MySQL** | livre, leve, o mais usado na web | aplicações web, WordPress, este curso |
| **PostgreSQL** | livre, rico em recursos e extensões | sistemas que exigem padrão SQL rigoroso e tipos avançados |
| **SQL Server** | Microsoft, integrado ao Windows e ao .NET | empresas com ecossistema Microsoft |
| **Oracle** | comercial, voltado a grandes corporações | bancos, telecom, ERPs de grande porte |
| **SQLite** | embutido, um arquivo só, sem servidor | celulares, navegadores, aplicativos desktop |

Todos falam SQL; mudam detalhes de sintaxe, recursos e licença.

---

## :icon[boxes] NoSQL: "not only SQL"

Nos anos 2000, sites com milhões de usuários esbarraram em três limites do relacional:

- :icon[trending-up] **Escala**: crescer significava um servidor maior, não vários servidores
- :icon[shapes] **Esquema**: cada mudança de coluna exigia alterar a tabela inteira
- :icon[activity] **Disponibilidade**: o sistema precisava responder mesmo com um nó fora do ar

Os bancos **NoSQL** trocam parte das garantias ACID por **escala horizontal** e **esquema flexível**. Muitos seguem o modelo **BASE**: basicamente disponível, estado leve, consistente **eventualmente**.

---

## :icon[shapes] Os quatro tipos de NoSQL

:::center
![Quatro painéis lado a lado: chave-valor com pares chave e valor, documentos com um JSON, família de colunas com linhas de colunas variáveis e grafo com nós ligados por arestas](images/03-tipos-nosql.svg)
:::

- :icon[key] **Chave-valor** (Redis): um dicionário gigante; cache, sessões, contadores
- :icon[file-text] **Documentos** (MongoDB): JSON com campos livres; catálogos, perfis, conteúdo
- :icon[columns-3] **Família de colunas** (Cassandra): linhas com colunas variáveis em escala massiva; logs, séries temporais, IoT
- :icon[waypoints] **Grafos** (Neo4j): nós e arestas com propriedades; redes sociais, recomendações, fraude

---

## :icon[scale] Comparativo: relacional vs NoSQL

| Característica | Relacional | NoSQL |
|---|---|---|
| **Esquema** | fixo, definido antes (schema-on-write) | flexível, interpretado na leitura (schema-on-read) |
| **Transações** | ACID, consistência forte | BASE, consistência eventual (na maioria) |
| **Escala** | vertical: servidor maior | horizontal: mais servidores |
| **Consulta** | SQL, padrão entre fornecedores | API ou linguagem própria de cada banco |
| **Casos de uso** | pedidos, financeiro, ERP, cadastro | cache, big data, tempo real, redes sociais |

:::info
"NoSQL" é uma família ampla. Alguns, como o MongoDB, já oferecem transações ACID entre vários documentos.
:::

---

## :icon[compass] Quando escolher cada um

::::columns
:::col
**Escolha relacional quando**

- os dados têm estrutura estável e se relacionam
- cada centavo precisa bater: pedidos, pagamentos, estoque
- muitas pessoas consultam os dados de formas diferentes
:::
:::col
**Escolha NoSQL quando**

- o esquema muda toda semana ou varia por registro
- o volume ou a velocidade exigem dezenas de servidores
- o problema é uma rede de ligações, como amigos de amigos
:::
::::

:::tip
Na prática, os dois convivem: o MySQL guarda os pedidos da loja; o Redis guarda o carrinho temporário e a sessão do usuário.
:::

---

## :icon[terminal] Primeiro contato com SQL: criar tabelas

Hora de criar o banco `loja` que acompanha o curso. Primeiro, as estruturas:

:::example
```sql
CREATE DATABASE loja;
USE loja;
CREATE TABLE categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(60) NOT NULL UNIQUE
);
CREATE TABLE produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  preco DECIMAL(10,2) NOT NULL CHECK (preco >= 0),
  estoque INT NOT NULL DEFAULT 0,
  categoria_id INT,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);
```
:::

`AUTO_INCREMENT` numera as linhas sozinho; `FOREIGN KEY` liga cada produto à sua categoria.

:::info
No PostgreSQL, troque `INT AUTO_INCREMENT` por `INT GENERATED ALWAYS AS IDENTITY`.
:::

---

## :icon[terminal] Inserindo e consultando

:::example
```sql
INSERT INTO categorias (nome)
VALUES ('Periféricos'), ('Monitores'), ('Móveis'), ('Computadores');

INSERT INTO produtos (nome, preco, estoque, categoria_id)
VALUES ('Teclado', 120.00, 35, 1),
       ('Mouse', 60.00, 50, 1),
       ('Monitor 27"', 900.00, 12, 2);

SELECT nome, preco FROM produtos WHERE preco > 100;
```

| nome | preco |
|---|---|
| Teclado | 120.00 |
| Monitor 27" | 900.00 |
:::

A ordem importa: as categorias entram antes dos produtos, porque a chave estrangeira exige que a categoria já exista.

---

## :icon[flask-conical] Pratique

Com as tabelas `categorias` e `produtos` criadas, resolva no seu cliente MySQL:

:::question
1. Insira dois produtos: `Cadeira ergonômica`, preço 750.00, estoque 8, categoria 3; e `Notebook`, preço 4200.00, estoque 5, categoria 4.
2. Liste o nome e o estoque dos produtos da categoria 1 (Periféricos).
3. Tente inserir `Webcam`, preço 180.00, estoque 0, categoria 9. O que acontece?
:::

---

## :icon[circle-check] Solução

```sql
INSERT INTO produtos (nome, preco, estoque, categoria_id)
VALUES ('Cadeira ergonômica', 750.00, 8, 3),
       ('Notebook', 4200.00, 5, 4);

SELECT nome, estoque FROM produtos WHERE categoria_id = 1;
```

| nome | estoque |
|---|---|
| Teclado | 35 |
| Mouse | 50 |

O terceiro comando **falha**: não existe categoria 9. O MySQL responde com o erro `1452`, "Cannot add or update a child row: a foreign key constraint fails". A integridade referencial protegeu o banco.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Inserir produtos antes das categorias: a chave estrangeira recusa um `categoria_id` que ainda não existe
- Usar aspas duplas em textos: o MySQL aceita por padrão, mas no PostgreSQL elas indicam nomes de colunas; acostume-se com `'Mouse'`
- Esquecer o `;` no fim do comando: o cliente fica esperando a continuação
- Tratar NoSQL como "melhor" ou "pior": é uma troca de garantias por flexibilidade, não um upgrade
- Confundir SQLite com "MySQL pequeno": são SGBDs diferentes, com arquivos e sintaxe próprios
:::

---

## :icon[list-checks] Resumo

:::summary
- Um SGBD **relacional** guarda tudo em tabelas ligadas por chaves, com esquema fixo, SQL e garantias ACID; MySQL, PostgreSQL, SQL Server, Oracle e SQLite são os principais
- **NoSQL** reúne quatro famílias: chave-valor (Redis), documentos (MongoDB), família de colunas (Cassandra) e grafos (Neo4j)
- Relacional para dados estruturados e transações críticas; NoSQL para esquema flexível, escala horizontal e redes de ligações
- `CREATE TABLE` define a estrutura, `INSERT` grava linhas e `SELECT ... WHERE` consulta; a chave estrangeira exige que a linha referenciada exista
:::

---

## :icon[arrow-right] Próximos passos

Com esta aula você fecha o módulo **Fundamentos de SGBD**: já sabe o que é um SGBD, como ele é organizado e quais tipos existem.

O próximo módulo é **Modelagem de dados**. Antes de escrever qualquer `CREATE TABLE`, um DBA desenha o banco. A próxima aula, **Modelagem conceitual com MER**, mostra como transformar as regras do negócio em entidades, atributos e relacionamentos.

:::tip
Faça o quiz desta aula. Ele inclui a leitura de um `SELECT` e a escolha entre relacional e NoSQL para cenários reais.
:::
