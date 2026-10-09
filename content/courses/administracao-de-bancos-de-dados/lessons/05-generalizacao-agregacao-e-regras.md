---
title: Generalização, agregação e regras de negócio
summary: Hierarquias de tipos, entidades fracas, agregação e as regras de negócio que o diagrama precisa registrar.
module: modelagem
duration_minutes: 25
objectives:
  - Modelar hierarquias com generalização e especialização
  - Reconhecer entidades fracas e seus identificadores parciais
  - Aplicar agregação quando um relacionamento precisa se relacionar
  - Registrar regras de negócio dentro e fora do diagrama
---

# Generalização, agregação e regras de negócio

Administração de Bancos de Dados · Aula 05

---

## O que você vai aprender

:::goal
- Quando dizer que uma entidade "é um tipo de" outra
- Como classificar uma hierarquia: total ou parcial, disjunta ou sobreposta
- O que são entidades fracas e agregação
- Quais regras de negócio o DER captura e quais ficam fora dele
:::

---

## :icon[users] Por que isso importa

Uma loja vende produtos físicos e digitais. A entidade `produto` ganhou atributos para os dois casos:

| nome | peso_kg | altura_cm | tamanho_mb | url_download |
|---|---|---|---|---|
| Teclado | 0.8 | 4 | NULL | NULL |
| Curso de SQL | NULL | NULL | 850 | /sql.zip |

Metade de cada linha fica vazia. E nada impede um produto com peso **e** URL.

:::question
Como guardar o que é comum uma vez só, e o que é específico apenas onde faz sentido?
:::

---

## :icon[git-branch] Generalização e especialização

Quando várias entidades compartilham atributos, você cria uma **superclasse** com o que é comum e **subclasses** com o que é específico. A relação se lê "é um tipo de".

![Hierarquia em que pessoa, com id, nome, cpf e e-mail, se especializa em cliente, com limite de crédito, e em funcionário, com matrícula e salário](images/05-generalizacao-pessoa.svg)

- **Especialização**: de cima para baixo. Pessoa se divide em cliente e funcionário
- **Generalização**: de baixo para cima. Cliente e funcionário têm nome e CPF em comum, logo existe pessoa
- **Herança**: a subclasse tem os atributos próprios mais os da superclasse

---

## :icon[split] Total ou parcial, disjunta ou sobreposta

Toda hierarquia responde a duas perguntas:

| Pergunta | Resposta | Exemplo |
|---|---|---|
| Toda instância da superclasse está em alguma subclasse? | **Total** | toda pessoa é cliente ou funcionário |
| | **Parcial** | existe pessoa que não é nenhum dos dois |
| Uma instância pode estar em mais de uma subclasse? | **Sobreposta** | um funcionário também compra na loja |
| | **Disjunta** | um produto é físico ou digital, nunca os dois |

No diagrama, isso aparece como `t` ou `p` e `d` ou `o` junto ao triângulo da hierarquia.

---

## :icon[puzzle] Entidade fraca e identificador parcial

Uma **entidade fraca** não consegue ser identificada sozinha: ela depende de uma entidade forte.

Exemplo: `dependente` de `funcionario`. Dois funcionários podem ter dependentes chamados "Maria". O que identifica cada um é o par **(funcionário, nome do dependente)**.

- O atributo que distingue os dependentes de um mesmo funcionário é o **identificador parcial**
- A participação da entidade fraca é sempre obrigatória: sem funcionário não há dependente
- Se o funcionário sai do cadastro, os dependentes saem junto

Na loja, `item_pedido` é entidade fraca de `pedido`: o item 2 do pedido 3 só existe dentro do pedido 3.

---

## :icon[combine] Agregação: relacionar relacionamentos

Às vezes algo precisa se ligar a um **relacionamento**, não a uma entidade. Um funcionário trabalha em um projeto, e **essa alocação** usa equipamentos.

![Agregação: o relacionamento trabalha em, entre funcionário e projeto, é envolvido por uma caixa tracejada e ligado a equipamento pelo relacionamento usa](images/05-agregacao.svg)

A **agregação** trata o relacionamento como se fosse uma entidade, para que ele participe de outro relacionamento.

:::tip
Na prática, quase sempre é mais simples promover o relacionamento a entidade: `alocacao`, com atributos e ligações próprios. O pé de galinha não tem símbolo de agregação; o MySQL Workbench também não.
:::

---

## :icon[circle-help] Pense

Na base `loja` existem `clientes` e `funcionarios`. Os dois têm nome; funcionários têm cargo e salário; clientes têm e-mail e cidade.

:::question
Vale criar a superclasse `pessoa`? Se sim, a especialização seria total ou parcial? Disjunta ou sobreposta?

Pense em Renata Dias, gerente de vendas, comprando um teclado na própria loja.
:::

---

## :icon[scale] Regras de negócio que o DER registra

Grande parte das regras do negócio já cabe no diagrama:

| Regra | Onde fica no modelo |
|---|---|
| Todo pedido pertence a um cliente | cardinalidade mínima 1 |
| Um cliente pode não ter pedidos | cardinalidade mínima 0 |
| Um pedido tem um único cliente | cardinalidade máxima 1 |
| O e-mail do cliente é obrigatório e único | atributo obrigatório e identificador alternativo |
| Um cliente tem vários telefones | atributo multivalorado |
| Todo cliente é uma pessoa | especialização total |

---

## :icon[scroll-text] Regras que ficam fora do diagrama

Algumas regras envolvem valores ou condições, e o DER não tem símbolo para elas:

- O desconto de um item não passa de 30%
- Um pedido só pode ser cancelado enquanto está `aberto`
- O salário de um funcionário não supera o do gerente do departamento

Anote essas regras em um documento junto ao diagrama. No modelo físico, elas viram `CHECK`, triggers ou validação na aplicação.

:::info
O MySQL aplica a restrição `CHECK` desde a versão 8.0.16. Em versões anteriores, ela era aceita e ignorada.
:::

---

## :icon[wrench] Ferramentas de modelagem

| Ferramenta | Para que serve | Custo |
|---|---|---|
| MySQL Workbench | diagramas EER, engenharia reversa e geração do SQL para MySQL | gratuito |
| brModelo | modelo conceitual com notação clássica, muito usado no ensino | gratuito |
| draw.io | diagramas livres, inclusive pé de galinha; roda no navegador | gratuito |
| dbdiagram.io | você descreve as tabelas em texto e o site desenha o DER | gratuito com limites |

:::tip
Para o conceitual, comece no papel ou no brModelo. Para o lógico e o físico, o Workbench exporta o `CREATE TABLE` pronto.
:::

---

## :icon[flask-conical] Pratique: loja online

Modele uma loja online com estas regras:

- :icon[package] **Produto**: código, nome, preço. Todo produto é **físico** (peso, altura, largura) ou **digital** (tamanho em MB, URL de download), nunca os dois
- :icon[users] **Cliente**: id, nome, e-mail único
- :icon[receipt] **Pedido**: id, data, status; pertence a um cliente e tem vários itens, cada um com produto, quantidade e preço unitário

:::question
Desenhe o DER com a hierarquia de produtos. Classifique a especialização nas duas dimensões e aponte a entidade fraca.
:::

---

## :icon[circle-check] Solução: produtos físicos e digitais

:::center
![DER da solução: produto, com código, nome e preço, se especializa em produto físico e produto digital; o triângulo traz t e d, especialização total e disjunta](images/05-solucao-loja-produtos-a.svg)
:::

- `produto` é a superclasse; `produto_fisico` e `produto_digital` são as subclasses
- **Total**: todo produto está em uma subclasse. **Disjunta**: nunca nas duas

---

## :icon[circle-check] Solução: pedido e seus itens

:::center
![DER da solução: cliente faz pedido em 1:N e pedido tem item_pedido em 1:N; item_pedido tem borda dupla, por ser entidade fraca, e num_item sublinhado como identificador parcial](images/05-solucao-loja-produtos-b.svg)
:::

- `item_pedido` é entidade fraca de `pedido`; o identificador parcial é o número do item
- `cliente` faz `pedido` em 1:N, com participação obrigatória do lado do pedido

---

## :icon[triangle-alert] Erros comuns

:::warning
- Criar hierarquia para entidades que só compartilham `nome`: generalize quando há vários atributos e relacionamentos em comum
- Esquecer de decidir total ou parcial e disjunta ou sobreposta: isso muda as tabelas do modelo lógico
- Dar identificador próprio a uma entidade fraca e esquecer a dependência da entidade forte
- Usar agregação onde uma entidade associativa resolve com menos complexidade
- Deixar regras de valor, como limites de desconto, só na cabeça de quem modelou
:::

---

## :icon[list-checks] Resumo

:::summary
- Generalização e especialização criam hierarquias "é um tipo de", com herança de atributos
- Toda hierarquia é total ou parcial, e disjunta ou sobreposta
- Entidade fraca depende de uma forte e usa identificador parcial
- Agregação trata um relacionamento como entidade; na prática, prefira promovê-lo a entidade
- O DER registra cardinalidades e atributos obrigatórios; regras de valor ficam documentadas à parte
:::

---

## :icon[arrow-right] Próximos passos

O diagrama está pronto. Na próxima aula, **Do MER ao modelo lógico e físico**, você vai transformar cada entidade em tabela, cada relacionamento em chave estrangeira ou tabela associativa, e escolher os tipos de dados do MySQL.

Faça o quiz e teste se você classifica hierarquias e reconhece entidades fracas com segurança.
