---
title: "Estudo de caso: sistema de biblioteca"
summary: "Do caderno ao MySQL: requisitos, MER, modelo lógico, scripts e consultas de uma biblioteca."
module: modelagem
duration_minutes: 30
objectives:
  - Levantar requisitos de um sistema a partir de uma entrevista
  - Construir e refinar o MER de uma biblioteca até o DER final
  - Mapear o modelo para tabelas, chaves e tipos do MySQL
  - Escrever os scripts de criação, carga e consultas do projeto
---

# Estudo de caso: sistema de biblioteca

Administração de Bancos de Dados · Aula 08

---

## O que você vai aprender

:::goal
- Transformar uma conversa com o cliente em requisitos claros
- Desenhar o MER, encontrar os erros da primeira versão e refiná-lo
- Mapear entidades e relacionamentos para tabelas, chaves e tipos do MySQL
- Criar, popular e consultar o banco com scripts versionados e documentados
:::

---

## :icon[book-open] Por que isso importa

A Biblioteca Comunitária Saber & Luz controla tudo em um caderno. O bibliotecário, Arquimedes, conta:

- "Para saber quem está com um livro, folheio páginas por dez minutos"
- "Semana passada emprestamos a mesma cópia para duas pessoas"
- "Não sei quais devoluções estão atrasadas"

Ele quer um sistema. Você é o DBA do projeto e precisa modelar o banco.

:::question
Antes de desenhar qualquer tabela, o que você perguntaria a ele?
:::

---

## :icon[messages-square] Levantamento de requisitos: a entrevista

| Pergunta | Resposta de Arquimedes |
|---|---|
| Como vocês identificam um livro? | Pelo ISBN, mas os antigos não têm |
| Um livro pode ter vários autores? | Sim. E um autor, vários livros |
| Existem cópias repetidas do mesmo título? | Sim, até cinco de alguns |
| Quanto dura um empréstimo? | 14 dias; às vezes atrasa |
| Quantos livros por pessoa ao mesmo tempo? | No máximo três |
| Que dados dos leitores vocês guardam? | Nome, e-mail e telefone |

Anote tudo, inclusive as regras de negócio ("no máximo três"): elas viram constraints ou código depois.

---

## :icon[boxes] Entidades e atributos

Da entrevista saem os substantivos que o sistema precisa guardar:

- :icon[book] **Livro**: título, ISBN, ano de publicação, editora
- :icon[user] **Autor**: nome
- :icon[building-2] **Editora**: nome
- :icon[copy] **Exemplar**: número de tombo, livro ao qual pertence
- :icon[users] **Usuário**: nome, e-mail, telefone, data de cadastro
- :icon[calendar-check] **Empréstimo**: data, data prevista, data de devolução, exemplar, usuário

Os verbos da conversa ("escreve", "publica", "pega emprestado") viram relacionamentos.

---

## :icon[pencil] MER: primeira versão e seus problemas

::::columns
:::col
**Primeira versão**

- Livro tem `quantidade_exemplares`
- Autor (1) escreve (N) Livro
- Usuário (N) empresta (N) Livro, com as datas no relacionamento
:::
:::col
**O que está errado**

- Um número não diz **qual** cópia saiu nem qual voltou
- Dois autores no mesmo livro não cabem em 1:N
- Um usuário pode pegar o mesmo livro duas vezes; o N:M não permite repetir o par
:::
::::

:::question
Como separar o título (a obra) da cópia física que fica na estante?
:::

---

## :icon[copy] Refinamento: livro não é exemplar

:::center
![Um livro (a obra) tem vários exemplares (as cópias com número de tombo); o empréstimo é de um exemplar](images/08-livro-e-exemplar.svg)
:::

Três decisões corrigem a primeira versão:

1. **Exemplar** vira entidade: Livro (1) tem (N) Exemplar. O empréstimo é de um exemplar
2. Autor e Livro ficam **N:M**: um livro pode ter vários autores
3. **Empréstimo** vira entidade própria, com data, data prevista e devolução, ligada a um exemplar e a um usuário

---

## :icon[network] O DER final

:::center
![DER da biblioteca: editora publica livros; livro tem autores (N:M) e exemplares; usuário faz empréstimos; cada empréstimo é de um exemplar](images/08-der-biblioteca.svg)
:::

Leitura: uma editora publica N livros; um livro tem N autores e N exemplares; um usuário faz N empréstimos; cada empréstimo é de **um** exemplar.

---

## :icon[table] Mapeamento lógico

Aplicando as regras de mapeamento:

- Editora, Autor e Usuário viram `editoras`, `autores` e `usuarios`, com PK `id`
- Livro vira `livros` e recebe a FK `editora_id` (lado N do 1:N)
- Exemplar vira `exemplares`, com FK `livro_id`
- O N:M "escreve" vira a tabela associativa `livro_autor`, com PK composta (`livro_id`, `autor_id`)
- Empréstimo vira `emprestimos`, com FKs `exemplar_id` e `usuario_id`

:::tip Normalização verificada
Nenhuma célula guarda listas (1FN). `livro_autor` só tem a chave (2FN). O nome da editora fica em `editoras`, não em `livros` (3FN).
:::

---

## :icon[server] Modelo físico: tabelas independentes

Primeiro as tabelas que não dependem de nenhuma outra:

```sql
CREATE TABLE editoras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE
);
CREATE TABLE autores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(150) NOT NULL
);
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  telefone VARCHAR(20),
  cadastrado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

:::tip
`DEFAULT CURRENT_TIMESTAMP` registra a data de cadastro sem que a aplicação precise informá-la.
:::

---

## :icon[book] Script: livros e autores

```sql
CREATE TABLE livros (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  isbn VARCHAR(13) UNIQUE,
  ano_publicacao SMALLINT,
  editora_id INT,
  FOREIGN KEY (editora_id) REFERENCES editoras(id)
);
CREATE TABLE livro_autor (
  livro_id INT NOT NULL,
  autor_id INT NOT NULL,
  PRIMARY KEY (livro_id, autor_id),
  FOREIGN KEY (livro_id) REFERENCES livros(id),
  FOREIGN KEY (autor_id) REFERENCES autores(id)
);
```

:::tip Escolha de tipos
`isbn` aceita nulo porque livros antigos não têm. `SMALLINT` em vez de `YEAR`: o tipo `YEAR` só vai de 1901 a 2155, e Dom Casmurro é de 1899.
:::

---

## :icon[calendar-check] Script: exemplares e empréstimos

```sql
CREATE TABLE exemplares (
  id INT AUTO_INCREMENT PRIMARY KEY,   -- número de tombo
  livro_id INT NOT NULL,
  FOREIGN KEY (livro_id) REFERENCES livros(id)
);
CREATE TABLE emprestimos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  exemplar_id INT NOT NULL,
  usuario_id INT NOT NULL,
  data_emprestimo DATE NOT NULL,
  data_prevista DATE NOT NULL,
  data_devolucao DATE,
  FOREIGN KEY (exemplar_id) REFERENCES exemplares(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
```

:::tip
`data_devolucao` aceita nulo: nulo significa "ainda não devolvido". Para proibir prazo anterior ao empréstimo, acrescente `CHECK (data_prevista > data_emprestimo)`.
:::

---

## :icon[database] Dados de exemplo

A ordem importa: tabelas pai antes das filhas, por causa das chaves estrangeiras.

```sql
INSERT INTO editoras (nome) VALUES ('Editora Aurora'), ('Editora Horizonte');
INSERT INTO autores (nome) VALUES ('Machado de Assis'), ('Clarice Lispector');
INSERT INTO usuarios (nome, email) VALUES
  ('Ana Souza', 'ana@exemplo.com'), ('Bruno Lima', 'bruno@exemplo.com');
INSERT INTO livros (titulo, ano_publicacao, editora_id) VALUES
  ('Dom Casmurro', 1899, 1), ('A Hora da Estrela', 1977, 2);
INSERT INTO livro_autor (livro_id, autor_id) VALUES (1, 1), (2, 2);
INSERT INTO exemplares (livro_id) VALUES (1), (1), (2);
INSERT INTO emprestimos
  (exemplar_id, usuario_id, data_emprestimo, data_prevista, data_devolucao) VALUES
  (1, 1, '2025-03-01', '2025-03-15', '2025-03-10'),
  (2, 2, '2025-03-05', '2025-03-19', NULL),
  (3, 1, '2025-03-20', '2025-04-03', NULL);
```

Os tombos 1 e 2 são cópias de Dom Casmurro; o tombo 3 é A Hora da Estrela.

---

## :icon[search] Consultas úteis

:::example
Exemplares que ainda não voltaram:

```sql
SELECT l.titulo, e.id AS tombo, u.nome, em.data_prevista
FROM emprestimos em
JOIN exemplares e ON e.id = em.exemplar_id
JOIN livros l ON l.id = e.livro_id
JOIN usuarios u ON u.id = em.usuario_id
WHERE em.data_devolucao IS NULL;
```

| titulo | tombo | nome | data_prevista |
|---|---|---|---|
| Dom Casmurro | 2 | Bruno Lima | 2025-03-19 |
| A Hora da Estrela | 3 | Ana Souza | 2025-04-03 |

Para só os atrasados, acrescente `AND em.data_prevista < CURDATE()`. Em 25/03/2025, só Bruno aparece.
:::

:::info
`JOIN` e `CURDATE()` são assunto do módulo **SQL: consultas**. Por enquanto, leia a consulta como uma frase.
:::

---

## :icon[file-text] Documentação e boas práticas

- :icon[text] **Nomenclatura**: tabelas no plural e em `snake_case` (`livro_autor`); FKs como `tabela_id`
- :icon[clipboard-list] **Dicionário de dados**: para cada coluna, tipo, se aceita nulo, chave e significado
- :icon[git-branch] **Versionamento**: o script `.sql` vive no Git; cada mudança de esquema é um arquivo novo, nunca uma edição do antigo
- :icon[scroll-text] **Justificativas**: por que `exemplares` existe, por que `data_devolucao` aceita nulo

Trecho do dicionário:

| Coluna | Tipo | Nulo | Significado |
|---|---|---|---|
| `emprestimos.data_prevista` | DATE | não | prazo de devolução, 14 dias após o empréstimo |
| `emprestimos.data_devolucao` | DATE | sim | nulo enquanto o exemplar não voltar |

---

## :icon[triangle-alert] Erros comuns

:::warning
- Guardar `quantidade_exemplares` em `livros` em vez de uma linha por cópia: você nunca sabe qual exemplar saiu
- Copiar o título do livro para `emprestimos`: dependência transitiva e dado repetido
- Inserir em `livros` antes de `editoras`: a chave estrangeira rejeita a linha
- Tratar `data_devolucao` nula como erro: nulo significa "empréstimo em aberto"
- Começar pelos scripts sem conversar com quem usa o sistema
:::

---

## :icon[list-checks] Resumo

:::summary
- O projeto começa na entrevista: perguntas sobre identificação, cardinalidades, prazos e limites
- Livro é a obra; exemplar é a cópia física. O empréstimo liga um exemplar a um usuário
- N:M vira tabela associativa; 1:N vira chave estrangeira no lado N
- Scripts no MySQL com PK, FK, `UNIQUE` e `DEFAULT`, carregados na ordem pai antes de filho
- Documentar e versionar o script faz parte da entrega
:::

---

## :icon[arrow-right] Próximos passos

Para o projeto da biblioteca:

- :icon[list-checks] Aplicar a regra "no máximo três empréstimos ativos" (trigger ou aplicação)
- :icon[search] Criar índices em `livros.titulo` e `usuarios.email`
- :icon[eye] Criar views para empréstimos ativos e atrasados

Para o curso: aqui termina o módulo de modelagem. O próximo módulo é **SQL: consultas**, e a próxima aula, **Introdução ao SQL**, ensina a escrever o `SELECT` que você acabou de ler.

Faça o quiz e confira se o caminho da entrevista ao script ficou claro.
