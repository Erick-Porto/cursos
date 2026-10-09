---
title: Modelagem conceitual com MER
summary: Entidades, atributos, relacionamentos e cardinalidades para desenhar a planta baixa do seu banco.
module: modelagem
duration_minutes: 25
objectives:
  - Explicar por que modelar antes de criar tabelas
  - Diferenciar os níveis conceitual, lógico e físico
  - Identificar entidades, atributos e relacionamentos em um cenário
  - Ler cardinalidades e participação em um DER
---

# Modelagem conceitual com MER

Administração de Bancos de Dados · Aula 04

---

## O que você vai aprender

:::goal
- Por que desenhar o modelo antes de escrever qualquer `CREATE TABLE`
- Os três níveis de modelagem: conceitual, lógico e físico
- Os blocos do MER: entidades, atributos e relacionamentos
- Como ler cardinalidade e participação em um diagrama
:::

---

## :icon[building-2] Por que isso importa

Ninguém constrói uma casa sem planta. Com banco de dados é igual: o **modelo** é a planta baixa.

Uma loja criou a tabela `pedidos` com uma coluna `produto`. Três meses depois descobriu que um pedido pode ter vários produtos.

- Mudar no diagrama custa uma borracha
- Mudar com o sistema no ar custa migração de dados, consultas refeitas e código reescrito

:::question
Quantas telas, relatórios e consultas dependem de uma tabela depois de três meses de uso?
:::

---

## :icon[layers] Os três níveis de modelagem

![Diagrama com três etapas em sequência: modelo conceitual com entidades e relacionamentos, modelo lógico com tabelas e chaves, modelo físico com tipos de dados do MySQL](images/04-niveis-de-modelagem.svg)

- **Conceitual**: o que existe no negócio e como se relaciona. Não cita SGBD. É o MER.
- **Lógico**: tabelas, colunas, chaves primárias e estrangeiras. Normalização.
- **Físico**: tipos de dados, índices e detalhes do MySQL. É o `CREATE TABLE`.

Esta aula fica no nível conceitual.

---

## :icon[map] MER e DER: o modelo e o desenho

**MER** (Modelo Entidade-Relacionamento) é o conjunto de conceitos: entidades, atributos e relacionamentos. **DER** (Diagrama Entidade-Relacionamento) é o desenho que representa o modelo.

| Elemento | Notação de Chen | Pé de galinha |
|---|---|---|
| Entidade | retângulo | caixa com os atributos dentro |
| Atributo | elipse ligada à entidade | linha dentro da caixa |
| Relacionamento | losango com o verbo | linha entre as caixas |
| Cardinalidade | 1 e N escritos na linha | símbolos nas pontas da linha |

Neste curso, as figuras usam **pé de galinha**, a notação do MySQL Workbench.

---

## :icon[boxes] Entidades: sobre o que guardamos dados

Uma **entidade** é algo do mundo real sobre o qual você precisa guardar informação: um cliente, um produto, um pedido.

Cada ocorrência concreta é uma **instância**: Ana Souza é uma instância de cliente.

Teste rápido para decidir se algo é entidade:

- :icon[users] Existem várias ocorrências dele?
- :icon[tags] Ele tem características próprias que você precisa guardar?
- :icon[link] Ele se relaciona com outras coisas do sistema?

:::tip
Nomeie entidades com substantivos, sempre do mesmo jeito: `cliente`, `produto`, `pedido`.
:::

---

## :icon[tags] Atributos: as características

**Atributos** são os dados que descrevem uma entidade. Eles têm tipos diferentes:

| Tipo | Exemplo | O que significa |
|---|---|---|
| Simples | `preco` | não se divide em partes |
| Composto | `endereco` | tem partes: rua, número, cidade |
| Multivalorado | `telefone` | um cliente pode ter vários |
| Derivado | `idade` | calculado a partir de `data_nascimento` |
| Identificador | `cpf`, `id` | único para cada instância |

O identificador vai se tornar a **chave primária** no modelo lógico.

---

## :icon[link] Relacionamentos: como as entidades se ligam

Um **relacionamento** é uma associação entre entidades. O nome é um verbo:

- cliente **faz** pedido
- pedido **contém** produto
- médico **atende** consulta

Um relacionamento também pode ter atributos próprios. Em "pedido contém produto", a `quantidade` não pertence ao pedido nem ao produto: pertence ao par.

:::tip
Leia sempre nos dois sentidos: "um cliente faz pedidos" e "um pedido é feito por um cliente". Cada sentido tem a própria cardinalidade.
:::

---

## :icon[circle-help] Pense

Na loja, o cadastro guarda a **cidade** de cada cliente e a **categoria** de cada produto.

:::question
`cidade` é uma entidade ou um atributo de cliente?

E `categoria`? Ela tem dados próprios (nome, descrição) e vários produtos apontam para ela. Isso muda a resposta?
:::

Dica: aplique o teste rápido das entidades. Não existe resposta única; depende do que o negócio precisa guardar.

---

## :icon[git-fork] Cardinalidade: quantos para quantos

A **cardinalidade** diz quantas instâncias de uma entidade podem se ligar a uma instância da outra.

![Três relacionamentos em notação pé de galinha: departamento tem um gerente, que é 1:1; cliente faz vários pedidos, que é 1:N; pedido contém vários produtos e produto aparece em vários pedidos, que é N:M](images/04-cardinalidades.svg)

- **1:1**: um departamento tem um gerente; um funcionário gerencia um departamento
- **1:N**: um cliente faz vários pedidos; cada pedido é de um cliente
- **N:M**: um pedido contém vários produtos; um produto aparece em vários pedidos

---

## :icon[check-check] Participação: obrigatória ou opcional

Além do máximo (1 ou N), cada lado tem um **mínimo**: 0 ou 1.

| Lado | Mínimo | Leitura |
|---|---|---|
| pedido para cliente | 1 | todo pedido **deve** ter cliente (obrigatória) |
| cliente para pedido | 0 | um cliente **pode** não ter pedidos (opcional) |

No pé de galinha, o círculo na ponta da linha significa 0 e o traço significa 1.

Na base `loja`, Diego e Elisa são clientes sem pedidos: a participação de cliente é opcional. Já um pedido sem cliente não existe.

---

## :icon[flask-conical] Pratique: a clínica

Modele, no papel ou em uma ferramenta, o sistema de uma clínica:

- :icon[user] **Pacientes**: CPF (único), nome, data de nascimento
- :icon[stethoscope] **Médicos**: CRM (único), nome, especialidade
- :icon[calendar-check] **Consultas**: data e hora, status (agendada, realizada, cancelada); sempre com um paciente e um médico

:::question
Quais são as entidades e os identificadores? Quais são os relacionamentos, com cardinalidade máxima e mínima de cada lado?
:::

---

## :icon[circle-check] Solução: DER da clínica

![DER da clínica: paciente e médico ligados a consulta por relacionamentos 1:N; cada consulta tem exatamente um paciente e um médico, e cada um deles pode ter zero ou muitas consultas](images/04-der-clinica.svg)

- Três entidades: `paciente` (identificador `cpf`), `medico` (`crm`) e `consulta` (`id`)
- `paciente` **tem** `consulta`: 1:N. Um paciente pode ter zero ou muitas consultas; uma consulta tem exatamente um paciente
- `medico` **atende** `consulta`: 1:N, com a mesma lógica

`especialidade` ficou como atributo. Se a clínica precisar cadastrar especialidades com dados próprios, ela vira entidade.

---

## :icon[triangle-alert] Erros comuns

:::warning
- Pular a modelagem e criar tabelas direto no MySQL: o custo aparece meses depois
- Transformar todo substantivo em entidade: `cidade` costuma ser só um atributo
- Guardar atributos derivados, como `idade`, que ficam desatualizados
- Definir só o máximo da cardinalidade e esquecer o mínimo (obrigatório ou opcional)
- Ler o relacionamento em um sentido só
:::

---

## :icon[list-checks] Resumo

:::summary
- O modelo é a planta do banco: corrigir no papel custa muito menos que corrigir em produção
- Conceitual descreve o negócio; lógico define tabelas e chaves; físico escolhe tipos e índices
- O MER é feito de entidades, atributos (simples, compostos, multivalorados, derivados, identificadores) e relacionamentos
- Cardinalidade diz quantos para quantos (1:1, 1:N, N:M); participação diz se o mínimo é 0 ou 1
:::

---

## :icon[arrow-right] Próximos passos

Nem toda entidade é simples. Na próxima aula, **Generalização, agregação e regras de negócio**, você vai modelar hierarquias como "cliente é um tipo de pessoa", entidades que dependem de outras e regras que o diagrama precisa registrar.

Antes disso, faça o quiz desta aula e confira se consegue ler um DER sem ajuda.
