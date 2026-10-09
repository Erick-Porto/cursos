---
title: "Laboratório: A Forja do Destino"
summary: Um mundo de RPG inteiro no banco para praticar DML, transações, trigger, view e procedure em cinco missões.
module: programacao-no-banco
duration_minutes: 60
objectives:
  - Ler o esquema do rpg_mundo e identificar as ligações entre as tabelas
  - Inserir, atualizar e remover registros com transações e ROLLBACK
  - Criar um trigger, uma view e uma procedure com validação sobre o esquema
---

# Laboratório: A Forja do Destino

Administração de Bancos de Dados · Aula 26

---

## O que você vai aprender

:::goal
- Ler o esquema de um mundo de RPG e identificar como as tabelas se ligam
- Povoar e alterar o mundo com `INSERT`, `UPDATE` e `DELETE` protegidos por transação
- Registrar eventos com um trigger, montar a ficha do herói com uma view e validar regras em uma procedure
- Somar pontos no Salão dos heróis ao cumprir cinco missões
:::

---

## :icon[swords] Por que isso importa

Um estúdio independente está criando um RPG e contratou você como DBA. Raças, classes, heróis, magias, itens, missões: tudo precisa viver em um banco que não perca um ponto de vida nem deixe um aprendiz conjurar magia de arquimago.

Nada aqui é novo. Cada missão usa um comando das aulas anteriores, agora em um sistema de verdade, com tabelas que dependem umas das outras.

:::question
De que tabelas o mundo precisa? E o que acontece com o herói quando a raça dele some do jogo?
:::

---

## :icon[map] O mapa do mundo

:::center
![Diagrama do rpg_mundo: racas e classes apontam para personagens (1:N); personagens e magias se ligam pela tabela associativa personagem_magias, que guarda a chave de cada lado e o nível de maestria](images/26-der-rpg-mundo.svg)
:::

- Um herói tem **uma** raça e **uma** classe; cada raça serve a muitos heróis
- Um herói conhece **várias** magias e cada magia é conhecida por **vários** heróis: `personagem_magias` resolve o N:M
- O mundo completo tem ainda itens, monstros e cenários; o laboratório usa este núcleo

---

## :icon[table] Raças e classes

```sql
CREATE DATABASE rpg_mundo CHARACTER SET utf8mb4;
USE rpg_mundo;

CREATE TABLE racas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(50) NOT NULL UNIQUE,
  bonus_forca INT NOT NULL DEFAULT 0,
  bonus_destreza INT NOT NULL DEFAULT 0
);
CREATE TABLE classes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(50) NOT NULL UNIQUE,
  habilidade_principal VARCHAR(100)
);
```

```sql
INSERT INTO racas (nome, bonus_forca, bonus_destreza) VALUES
  ('Humano', 1, 1), ('Elfo', 0, 2), ('Anão', 2, 0), ('Orc', 3, 0), ('Halfling', -1, 3);
INSERT INTO classes (nome, habilidade_principal) VALUES
  ('Guerreiro', 'Ataque Poderoso'), ('Mago', 'Bola de Fogo'), ('Ladino', 'Ataque Furtivo'),
  ('Clérigo', 'Cura Leve'), ('Arqueiro', 'Flecha Precisa');
```

Execute os dois blocos: o primeiro ergue as tabelas, o segundo povoa. Os `id` saem na ordem: Humano é 1 e Halfling é 5; Guerreiro é 1 e Arqueiro é 5.

---

## :icon[user] Personagens

```sql
CREATE TABLE personagens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  raca_id INT,
  classe_id INT,
  nivel INT NOT NULL DEFAULT 1,
  pontos_vida_max INT NOT NULL DEFAULT 10,
  pontos_vida INT NOT NULL DEFAULT 10,
  experiencia INT NOT NULL DEFAULT 0,
  FOREIGN KEY (raca_id) REFERENCES racas(id) ON DELETE SET NULL,
  FOREIGN KEY (classe_id) REFERENCES classes(id) ON DELETE SET NULL
);
```

```sql
INSERT INTO personagens (nome, raca_id, classe_id, nivel, pontos_vida_max, pontos_vida) VALUES
  ('Aragorn', 1, 1, 5, 50, 50), ('Legolas', 2, 5, 5, 40, 40),
  ('Gandalf', 1, 2, 7, 35, 35), ('Gimli', 3, 1, 5, 60, 60),
  ('Frodo', 5, 3, 3, 25, 25);
```

`ON DELETE SET NULL` responde à pergunta do início: se a raça sumir do jogo, o herói fica, sem raça. Aragorn é o `id` 1 e Frodo, o 5.

---

## :icon[wand] Magias e o grimório de cada herói

```sql
CREATE TABLE magias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE,
  custo_mana INT NOT NULL DEFAULT 0,
  nivel_requerido INT NOT NULL DEFAULT 1
);
CREATE TABLE personagem_magias (
  personagem_id INT NOT NULL,
  magia_id INT NOT NULL,
  nivel_maestria INT NOT NULL DEFAULT 1,
  PRIMARY KEY (personagem_id, magia_id),
  FOREIGN KEY (personagem_id) REFERENCES personagens(id) ON DELETE CASCADE,
  FOREIGN KEY (magia_id) REFERENCES magias(id) ON DELETE CASCADE
);
```

```sql
INSERT INTO magias (nome, custo_mana, nivel_requerido) VALUES
  ('Bola de Fogo', 10, 1), ('Cura Leve', 8, 1), ('Escudo Mágico', 12, 2),
  ('Força do Urso', 15, 3), ('Chuva de Meteoros', 40, 9);
INSERT INTO personagem_magias (personagem_id, magia_id) VALUES (3, 1), (3, 3), (1, 2);
```

A chave primária composta impede que um herói aprenda a mesma magia duas vezes. `ON DELETE CASCADE`: se o herói for apagado, o grimório vai junto. Gandalf conhece duas magias; Aragorn, uma.

---

## :icon[user-plus] Missão 1: Recrutas e a primeira vitória

:::question
**Parte A.** A guerreira humana **Brienne de Tarth** chega à guilda no nível 1, com 15 pontos de vida. Inscreva-a em `personagens` buscando `raca_id` e `classe_id` por subconsulta, sem digitar números. No mesmo dia, um pergaminho revela a magia **Visão Noturna** (mana 5, nível requerido 2). Registre-a em `magias`.

**Parte B.** Frodo (`id` 5, nível 3, 25 de vida) venceu sua primeira missão. Suba um nível, aumente a vida máxima em 10, cure-o por completo e zere a experiência, tudo em um único `UPDATE`.
:::

Antes do `UPDATE`, rode um `SELECT` com o mesmo `WHERE`: a regra de ouro da aula de `UPDATE` vale aqui também.

---

## :icon[circle-check] Solução da missão 1

```sql
INSERT INTO personagens (nome, raca_id, classe_id, nivel, pontos_vida_max, pontos_vida)
VALUES ('Brienne de Tarth',
  (SELECT id FROM racas WHERE nome = 'Humano'),
  (SELECT id FROM classes WHERE nome = 'Guerreiro'),
  1, 15, 15);
INSERT INTO magias (nome, custo_mana, nivel_requerido) VALUES ('Visão Noturna', 5, 2);

UPDATE personagens
SET nivel = nivel + 1,
    pontos_vida = pontos_vida_max + 10,
    pontos_vida_max = pontos_vida_max + 10,
    experiencia = 0
WHERE id = 5;
```

| id | nome | nivel | pontos_vida | pontos_vida_max |
|---|---|---|---|---|
| 5 | Frodo | 4 | 35 | 35 |

:::info
A ordem no `SET` importa no MySQL: ele avalia da esquerda para a direita e já usa o valor novo nas atribuições seguintes. Por isso `pontos_vida` vem antes de `pontos_vida_max`. No PostgreSQL, todas as atribuições enxergam o valor antigo.
:::

---

## :icon[rotate-ccw] Missão 2: Despedida com rede de segurança

O jogador de Gandalf (`id` 3) pediu para apagar o personagem. Minutos depois mandou mensagem: "espera, era brincadeira".

:::question
Dentro de uma transação, apague Gandalf de `personagens`. Ainda dentro dela, conte quantas linhas restaram em `personagem_magias` para o `personagem_id` 3 e explique o número. Depois desfaça tudo e confirme que Gandalf voltou com as duas magias.
:::

:::danger
Fora de uma transação o `DELETE` é definitivo assim que termina: o MySQL trabalha com `autocommit` ligado.
:::

---

## :icon[circle-check] Solução da missão 2

```sql
START TRANSACTION;
DELETE FROM personagens WHERE id = 3;
SELECT COUNT(*) AS magias FROM personagem_magias WHERE personagem_id = 3;
ROLLBACK;
SELECT nome, nivel FROM personagens WHERE id = 3;
SELECT COUNT(*) AS magias FROM personagem_magias WHERE personagem_id = 3;
```

| consulta | resultado |
|---|---|
| magias, dentro da transação | 0 |
| nome e nivel, depois do `ROLLBACK` | Gandalf, 7 |
| magias, depois do `ROLLBACK` | 2 |

O `0` vem do `ON DELETE CASCADE`: apagar o herói apagou o grimório na mesma transação. O `ROLLBACK` devolveu as três linhas de uma vez. Com `COMMIT` no lugar, Gandalf e suas magias teriam sumido de vez.

---

## :icon[scroll-text] Missão 3: O eco da queda

O estúdio quer um livro de **crônicas**: toda vez que a vida de um herói chega a zero, o banco registra a queda sozinho, sem depender do jogo. A tabela já existe:

```sql
CREATE TABLE cronicas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  personagem_id INT,
  evento VARCHAR(200) NOT NULL,
  registrado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

:::question
Crie o trigger `trg_personagens_au_queda`, `AFTER UPDATE` em `personagens`. Quando `pontos_vida` sair de um valor positivo para zero ou menos, insira em `cronicas` o `id` do herói e o texto "Nome caiu em combate no nível N". Teste com Brienne (`id` 6), que enfrentou um lobo cedo demais.
:::

Sem `FOREIGN KEY` de propósito: a crônica deve sobreviver ao herói.

---

## :icon[circle-check] Solução da missão 3

```sql
DELIMITER $$
CREATE TRIGGER trg_personagens_au_queda
AFTER UPDATE ON personagens
FOR EACH ROW
BEGIN
  IF OLD.pontos_vida > 0 AND NEW.pontos_vida <= 0 THEN
    INSERT INTO cronicas (personagem_id, evento)
    VALUES (NEW.id, CONCAT(NEW.nome, ' caiu em combate no nível ', NEW.nivel));
  END IF;
END $$
DELIMITER ;

UPDATE personagens SET pontos_vida = 0 WHERE id = 6;
SELECT personagem_id, evento FROM cronicas;
```

| personagem_id | evento |
|---|---|
| 6 | Brienne de Tarth caiu em combate no nível 1 |

A condição compara `OLD` com `NEW`: curar um herói ou trocar o nome não gera crônica, e um herói já caído não é registrado duas vezes.

---

## :icon[id-card] Missão 4: A ficha do herói

A tela de personagem do jogo mostra nome, raça, classe, nível, vida atual sobre a máxima e quantas magias o herói conhece. Hoje o programador escreve três `JOIN` toda vez.

:::question
Crie a view `vw_ficha_heroi` com as colunas `id`, `nome`, `raca`, `classe`, `nivel`, `vida` (no formato `35/35`) e `magias` (quantidade). Um herói sem raça, sem classe ou sem magias precisa continuar aparecendo na ficha. Confira a ficha de Gandalf.
:::

Dica: pense em qual `JOIN` mantém a linha da esquerda mesmo sem par na direita.

---

## :icon[circle-check] Solução da missão 4

```sql
CREATE VIEW vw_ficha_heroi AS
SELECT p.id, p.nome, r.nome AS raca, c.nome AS classe, p.nivel,
       CONCAT(p.pontos_vida, '/', p.pontos_vida_max) AS vida,
       COUNT(pm.magia_id) AS magias
FROM personagens p
LEFT JOIN racas r ON r.id = p.raca_id
LEFT JOIN classes c ON c.id = p.classe_id
LEFT JOIN personagem_magias pm ON pm.personagem_id = p.id
GROUP BY p.id, p.nome, r.nome, c.nome, p.nivel, p.pontos_vida, p.pontos_vida_max;

SELECT nome, raca, classe, vida, magias FROM vw_ficha_heroi WHERE id = 3;
```

| nome | raca | classe | vida | magias |
|---|---|---|---|---|
| Gandalf | Humano | Mago | 35/35 | 2 |

`LEFT JOIN` em todas as ligações: Brienne, sem magias, aparece com `0`; um herói cuja raça foi removida aparece com `raca` nulo. `COUNT(pm.magia_id)` ignora os nulos, então o zero sai certo.

---

## :icon[wand] Missão 5: O mestre de magias

Aprender uma magia é um `INSERT` em `personagem_magias`. Mas há uma regra: o herói precisa ter nível igual ou maior que o `nivel_requerido` da magia. Hoje nada impede o jogo de ignorá-la.

:::question
Crie a procedure `sp_aprender_magia(p_personagem_id, p_magia_id)`. Ela lê o nível do herói e o nível requerido da magia; se o herói não alcança o requisito, lança `SIGNAL SQLSTATE '45000'` com a mensagem "Nível insuficiente para esta magia"; senão, insere a linha. Teste com Frodo aprendendo Força do Urso e, depois, Chuva de Meteoros.
:::

---

## :icon[circle-check] Solução da missão 5

```sql
DELIMITER $$
CREATE PROCEDURE sp_aprender_magia(IN p_personagem_id INT, IN p_magia_id INT)
BEGIN
  DECLARE v_nivel INT;
  DECLARE v_requerido INT;
  SELECT nivel INTO v_nivel FROM personagens WHERE id = p_personagem_id;
  SELECT nivel_requerido INTO v_requerido FROM magias WHERE id = p_magia_id;
  IF v_nivel < v_requerido THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Nível insuficiente para esta magia';
  END IF;
  INSERT INTO personagem_magias (personagem_id, magia_id) VALUES (p_personagem_id, p_magia_id);
END $$
DELIMITER ;
```

| chamada | resultado |
|---|---|
| `CALL sp_aprender_magia(5, 4)` | Frodo (nível 4) aprende Força do Urso (nível 3) |
| `CALL sp_aprender_magia(5, 5)` | `ERROR 1644 (45000): Nível insuficiente para esta magia` |

A regra agora vale para qualquer cliente do banco. Chamar de novo com a mesma magia falha na chave primária composta: o grimório não repete feitiço.

---

## :icon[trophy] Salão dos heróis

| Missão | Prova | Pontos |
|---|---|---|
| 1. Recrutas | `INSERT` e `UPDATE` | 15 |
| 2. Despedida segura | transação e `ROLLBACK` | 15 |
| 3. O eco da queda | trigger | 20 |
| 4. A ficha do herói | view com `LEFT JOIN` | 20 |
| 5. O mestre de magias | procedure com `SIGNAL` | 30 |

Missão resolvida sem olhar a solução vale os pontos inteiros; com ajuda, metade. Com 70 ou mais, a Forja desperta.

Aqui termina o módulo Programação no banco. O próximo, **Operação do DBA**, abre com **Monitoramento de desempenho**: o que medir e onde está o gargalo.

Antes, faça o quiz e grave seu nome no salão.
