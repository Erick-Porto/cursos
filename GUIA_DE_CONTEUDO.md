# Guia de conteúdo: como escrever cursos, aulas e avaliações

Este guia é para quem (pessoa ou agente de IA) vai produzir o conteúdo dos cursos.
Siga-o à risca: o validador (`npm run content:check`) aplica a maior parte das regras
e o `content:sync` só envia conteúdo que passa na validação.

Curso de referência completo: [content/courses/fundamentos-sql](content/courses/fundamentos-sql).

---

## 1. Princípios pedagógicos (o que torna um slide fácil de aprender)

1. **Uma ideia por slide.** Se precisou de dois títulos, são dois slides.
2. **Pouco texto.** Até 130 palavras por slide. Listas com no máximo 7 itens, frases curtas.
3. **Do concreto para o abstrato.** Apresente um problema ou exemplo antes da definição.
4. **Mostre, não só diga.** Código, tabela, diagrama ou analogia em todo conceito novo.
5. **Progressão suave.** Cada slide usa só o que foi visto antes. Termos novos em **negrito** na primeira vez.
6. **Ritmo.** A cada 4 ou 5 slides de conteúdo, um slide de prática, pergunta ou recapitulação.
7. **Feche o ciclo.** Toda aula termina com resumo e ponte para a próxima.
8. **Linguagem direta.** Voz ativa, segunda pessoa ("você"), sem jargão sem explicação.
9. **Sem emojis.** A plataforma usa ícones. Para dar destaque, use os blocos `:::tip`, `:::warning` etc.
10. **Acessível.** Toda imagem tem texto alternativo. Cores nunca são o único meio de transmitir informação.

## 2. Estrutura de pastas

```
content/courses/<slug-do-curso>/
├── course.json            metadados, módulos e conquistas do curso
├── description.md         descrição longa (Markdown), aparece na página do curso
├── lessons/
│   ├── 01-introducao.md   uma aula por arquivo, prefixo numérico define a ordem
│   └── 02-consultas.md
├── assessments/
│   ├── 01-quiz-introducao.json
│   └── 99-prova-final.json
└── images/
    └── tabela.svg         referenciadas nos slides como images/tabela.svg
```

Regras de nomes: só letras minúsculas, números e hífens. O slug da pasta é o slug do curso.

## 3. course.json

```json
{
  "slug": "fundamentos-sql",
  "title": "Fundamentos de SQL",
  "subtitle": "Consultas, filtros e os primeiros passos com bancos relacionais",
  "level": "iniciante",
  "estimated_hours": 4,
  "tags": ["sql", "banco de dados"],
  "icon": "database",
  "color": "#34d399",
  "instructor_name": "Nome do instrutor",
  "is_published": true,
  "modules": [
    { "slug": "introducao", "title": "Introdução", "description": "Conceitos essenciais" },
    { "slug": "consultas", "title": "Consultas" }
  ],
  "achievements": [
    {
      "slug": "mestre-sql",
      "title": "Mestre do SQL básico",
      "description": "Concluiu o curso Fundamentos de SQL.",
      "icon": "trophy",
      "rarity": "epic",
      "xp": 150,
      "rule": { "type": "course_completed" }
    }
  ]
}
```

| Campo | Valores |
|---|---|
| `level` | `iniciante`, `intermediario`, `avancado` |
| `icon` | um nome de `src/lib/icons.ts` (ex.: `database`, `code`, `terminal`, `server`, `shield`, `globe`, `brain`) |
| `color` | hexadecimal `#rrggbb` (cor de destaque do curso) |
| `is_published` | `false` mantém o curso visível só para instrutores |
| `modules` | ordem da lista = ordem na página. Cada aula aponta para um módulo pelo `slug` |

### Conquistas do curso

`rarity`: `common`, `rare`, `epic`, `legendary`. `rule.type` e parâmetros:

| type | parâmetros | significado |
|---|---|---|
| `lessons_completed` | `count` | concluiu N aulas deste curso |
| `course_completed` | – | concluiu o curso |
| `assessments_passed` | `count` | aprovado em N avaliações do curso |
| `perfect_score` | `count` | gabaritou N avaliações do curso |
| `first_try_pass` | `count` | aprovado de primeira em N avaliações |

Crie de 1 a 3 conquistas por curso. Uma de conclusão é obrigatória por convenção.

## 4. Aulas (`lessons/NN-slug.md`)

### 4.1 Frontmatter

```yaml
---
title: Selecionando dados
summary: Sua primeira consulta com SELECT e FROM.
module: consultas
duration_minutes: 20
objectives:
  - Escrever um SELECT simples
  - Escolher colunas e renomear com AS
---
```

`title` e `module` são obrigatórios quando o curso tem módulos. `summary` aparece na lista de aulas:
uma frase, até 120 caracteres. `objectives`: de 2 a 4 itens, começando por verbo.

### 4.2 Slides

- Slides são separados por uma linha contendo apenas `---`, **com uma linha em branco antes**.
- O **primeiro slide é a capa**: começa com `# Título da aula` e tem no máximo duas linhas de texto.
- **Todos os outros slides começam com `## Título do slide`.** Um único `##` por slide.
- Use `###` só para subdivisões curtas dentro do slide.
- Tamanho: de 8 a 20 slides por aula. Até 130 palavras por slide.

### 4.3 Roteiro recomendado de uma aula

| # | Slide | Conteúdo |
|---|---|---|
| 1 | Capa | `# Título` + nome do curso e número da aula |
| 2 | O que você vai aprender | bloco `:::goal` com os objetivos |
| 3 | Por que isso importa | problema real, situação do dia a dia ou pergunta |
| 4…n | Um conceito por slide | definição curta + exemplo (código, tabela ou imagem) |
| meio | Pratique ou Pense | `:::question` ou `:::example` com um pequeno desafio |
| n+1 | Erros comuns | `:::warning` com 3 a 5 armadilhas |
| n+2 | Resumo | `:::summary` com 3 a 5 frases |
| n+3 | Próximos passos | ponte para a próxima aula ou para o quiz |

### 4.4 Blocos disponíveis

Blocos de destaque (todos aceitam título opcional após o nome):

```markdown
:::tip Título opcional
Texto do bloco. Aceita **Markdown**, listas e código.
:::
```

| Bloco | Uso |
|---|---|
| `:::goal` | objetivos da aula |
| `:::info` | contexto adicional, "saiba mais" |
| `:::tip` | boa prática, atalho |
| `:::example` | exemplo trabalhado |
| `:::question` | pergunta para o aluno pensar antes de avançar |
| `:::warning` | cuidado, erro comum |
| `:::danger` | ação destrutiva ou risco real |
| `:::summary` | recapitulação |
| `:::quote` | citação |

Blocos de layout:

```markdown
::::columns
:::col
Conteúdo da esquerda
:::
:::col
Conteúdo da direita
:::
::::
```

Atenção: `columns` usa **quatro** dois-pontos e cada `col` usa três.

```markdown
:::center
Conteúdo centralizado (bom para uma imagem ou frase de efeito)
:::

:::steps
1. Primeiro passo
2. Segundo passo
3. Terceiro passo
:::
```

### 4.5 Código

Sempre informe a linguagem: `sql`, `javascript`, `typescript`, `python`, `bash`, `json`, `yaml`,
`html`, `css`, `java`, `csharp`, `php`, `go`, `diff`, `plaintext`.

```markdown
```sql
SELECT nome FROM clientes WHERE cidade = 'Recife';
```
```

Máximo de 15 linhas de código por slide. Se precisar de mais, divida em dois slides
(por exemplo "estrutura" e "exemplo completo"). Comente o que importa, não cada linha.

### 4.6 Tabelas e imagens

- Tabelas Markdown para comparar até 5 colunas e 6 linhas.
- Imagens ficam em `images/` e são referenciadas como `![descrição útil](images/arquivo.svg)`.
- Formatos: SVG (diagramas), WebP ou PNG (capturas), até 400 KB e 1600 px de largura.
- Nunca use links externos para imagens: eles expiram e quebram.
- O texto alternativo descreve o que a imagem ensina ("Diagrama de uma tabela com 3 colunas e 2 linhas"), não o arquivo.

### 4.7 O que não fazer

- Emojis em qualquer lugar.
- Slides com mais de um assunto, ou "paredes de texto".
- HTML cru, salvo em último caso. Os blocos acima cobrem quase tudo.
- Títulos genéricos ("Continuação", "Mais sobre o tema"). O título resume a ideia do slide.
- Referências a "slide anterior" ou "como vimos acima". O aluno pode navegar fora de ordem.

## 5. Avaliações (`assessments/NN-slug.json`)

```json
{
  "title": "Quiz: Introdução",
  "description": "Verifique se os conceitos da aula ficaram claros.",
  "lesson": "o-que-e-um-banco-de-dados",
  "kind": "quiz",
  "passing_score": 70,
  "max_attempts": null,
  "time_limit_minutes": null,
  "shuffle_questions": true,
  "shuffle_options": true,
  "show_answers": true,
  "is_required": true,
  "questions": [ ... ]
}
```

| Campo | Significado |
|---|---|
| `lesson` | slug da aula à qual o quiz pertence. `null` para a avaliação final do curso |
| `kind` | `quiz` (curto, após uma aula) ou `exam` (prova do curso, vale mais XP) |
| `passing_score` | nota mínima em %, padrão 70 |
| `max_attempts` | `null` = ilimitado. Provas costumam usar 2 ou 3 |
| `time_limit_minutes` | `null` = sem limite. Só para provas |
| `show_answers` | `false` esconde o gabarito depois do envio (use em provas) |
| `is_required` | conta no progresso do curso (padrão `true`) |

### 5.1 Tipos de questão

Escolha única:

```json
{
  "id": "q1",
  "type": "single",
  "prompt": "Qual comando lê dados de uma tabela?",
  "options": { "a": "SELECT", "b": "INSERT", "c": "UPDATE", "d": "DELETE" },
  "answer": "a",
  "explanation": "SELECT consulta; os outros três alteram dados.",
  "points": 1
}
```

Múltipla escolha (todas as corretas precisam ser marcadas):

```json
{
  "id": "q2",
  "type": "multiple",
  "prompt": "Quais comandos alteram dados?",
  "options": { "a": "INSERT", "b": "SELECT", "c": "DELETE" },
  "answer": ["a", "c"],
  "explanation": "SELECT apenas lê."
}
```

Verdadeiro ou falso:

```json
{ "id": "q3", "type": "truefalse", "prompt": "DELETE sem WHERE apaga todas as linhas.", "answer": true, "explanation": "Sem filtro, o comando vale para a tabela inteira." }
```

Preencher lacunas (`___` marca cada lacuna; cada lacuna tem uma lista de respostas aceitas):

```json
{
  "id": "q4",
  "type": "fill",
  "prompt": "A cláusula ___ filtra as linhas de um SELECT.",
  "answer": [["WHERE"]],
  "explanation": "WHERE define a condição que cada linha precisa atender."
}
```

A correção de lacunas ignora maiúsculas, espaços duplicados e espaços nas pontas.
Liste variações aceitas quando fizer sentido: `[["NOT NULL", "not null"]]`.

### 5.2 Boas questões

- Quizzes: 5 a 10 questões. Provas: 10 a 20.
- Cada objetivo da aula aparece em pelo menos uma questão.
- Enunciado completo, sem depender de "ver o slide X".
- Alternativas com tamanho e estilo parecidos. Distratores plausíveis (erros que alunos cometem de verdade).
- Nunca "todas as anteriores" ou "nenhuma das anteriores".
- `explanation` obrigatória na prática: diga por que a certa está certa e por que a mais tentadora está errada.
- Misture dificuldades: 40% lembrar, 40% aplicar, 20% analisar.
- `points` maior (2 ou 3) só para questões de aplicação ou análise.

## 6. Fluxo de trabalho

1. Crie ou edite os arquivos em `content/courses/<slug>/`.
2. Rode `npm run content:check` e corrija todos os **erros**. Leia os avisos: eles apontam slides longos, listas grandes, imagens sem alt.
3. Rode `npm run content:sync` para publicar no Supabase (precisa do `.env` com `SUPABASE_SERVICE_ROLE_KEY`).
4. Abra o curso na plataforma e passe por todos os slides em tela de celular e de desktop.
5. Faça o quiz como aluno. A explicação de cada questão aparece no resultado: confira se faz sentido.

Para remover do banco aulas ou questões que você apagou do repositório: `npm run content:sync:prune`.

## 7. Checklist final por aula

- [ ] Capa com `#`, demais slides com um único `##`
- [ ] 8 a 20 slides, até 130 palavras cada
- [ ] Objetivos no início, resumo no fim
- [ ] Pelo menos um exemplo concreto por conceito
- [ ] Um `:::question` ou `:::example` no meio da aula
- [ ] Código com linguagem declarada, até 15 linhas por bloco
- [ ] Imagens locais, com alt text, até 400 KB
- [ ] Nenhum emoji
- [ ] Quiz com 5 a 10 questões cobrindo todos os objetivos, todas com `explanation`
- [ ] `npm run content:check` sem erros
