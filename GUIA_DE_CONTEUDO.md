# Guia de conteúdo: como escrever cursos, aulas e avaliações

Este guia é para quem (pessoa ou agente de IA) vai produzir o conteúdo dos cursos.
Siga-o à risca: o validador (`npm run content:check`) aplica a maior parte das regras
e o `content:sync` só envia conteúdo que passa na validação. No texto, **(erro)** marca
regras que bloqueiam a publicação e **(aviso)** marca as que só avisam.

Curso de referência completo: [content/courses/fundamentos-sql](content/courses/fundamentos-sql).
Ele usa todos os recursos descritos aqui, inclusive diagrama estático, diagrama animado e ícones.

---

## 1. Princípios pedagógicos (o que torna um slide fácil de aprender)

1. **Uma ideia por slide.** Se precisou de dois títulos, são dois slides.
2. **Pouco texto.** Até 130 palavras por slide. Listas com no máximo 7 itens, frases curtas.
3. **Do concreto para o abstrato.** Apresente um problema ou exemplo antes da definição.
4. **Mostre, não só diga.** Código, tabela, diagrama ou analogia em todo conceito novo.
   Imagem só quando ensina algo que o texto não ensina; nunca para decorar (seção 5).
5. **Progressão suave.** Cada slide usa só o que foi visto antes. Termos novos em **negrito** na primeira vez.
6. **Ritmo.** A cada 4 ou 5 slides de conteúdo, um slide de prática, pergunta ou recapitulação.
7. **Feche o ciclo.** Toda aula termina com resumo e ponte para a próxima.
8. **Linguagem direta.** Voz ativa, segunda pessoa ("você"), sem jargão sem explicação.
9. **Sem emojis.** A plataforma usa ícones. Para dar destaque, use os blocos `:::tip`, `:::warning` etc.
   ou um ícone inline `:icon[nome]`.
10. **Acessível.** Toda imagem tem texto alternativo, toda animação respeita quem as desativa,
    e cor nunca é o único meio de transmitir informação.

## 2. Estrutura de pastas

```
content/courses/<slug-do-curso>/
├── course.json               metadados, módulos e conquistas do curso
├── description.md            descrição longa (Markdown), aparece na página do curso
├── lessons/
│   ├── 01-introducao.md      uma aula por arquivo, prefixo numérico define a ordem
│   └── 02-consultas.md
├── assessments/
│   ├── 01-quiz-introducao.json
│   └── 99-prova-final.json
├── images/
│   ├── tabela.svg            diagrama estático
│   ├── where-filtro.svg      diagrama animado (CSS @keyframes)
│   └── workbench-login.webp  captura de tela
├── roteiros/                 roteiro do instrutor por encontro presencial (seção 9)
│   └── 01-e01.md
└── materiais/                arquivos abertos no navegador ou baixados (seção 10)
    └── e01/
        ├── aluno/contador.html
        └── demos-e01/
```

Regras de nomes: só letras minúsculas, números e hífens (imagens também aceitam ponto e underline).
O slug da pasta é o slug do curso. Imagens são referenciadas nos slides e na descrição como
`images/arquivo.svg`; o `content:sync` as envia para o storage do Supabase.

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
  "cover_url": "images/capa.webp",
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
| `estimated_hours` | número maior que zero (horas de estudo) |
| `icon` | um nome de `src/lib/icons.ts` (ex.: `database`, `code`, `terminal`, `server`, `shield`, `globe`, `brain`). É uma lista diferente da dos ícones inline dos slides (seção 5.7) |
| `color` | hexadecimal `#rrggbb` (cor de destaque do curso) |
| `cover_url` | opcional. Imagem de fundo do card no catálogo: `images/capa.webp` (enviada pelo sync) ou URL `https`. Proporção 16:9, até 1200 px de largura, sem texto dentro da imagem |
| `is_published` | `false` mantém o curso visível só para instrutores |
| `modules` | ordem da lista = ordem na página. Cada aula aponta para um módulo pelo `slug` |

A descrição vem de `description.md` (preferido) ou do campo `description_md`. Ela passa pelo mesmo
renderizador dos slides: aceita blocos `:::`, ícones inline e imagens de `images/`.

### Conquistas do curso

`rarity`: `common`, `rare`, `epic`, `legendary`. `rule.type` e parâmetros:

| type | parâmetros | significado |
|---|---|---|
| `lessons_completed` | `count` | concluiu N aulas deste curso |
| `course_completed` | – | concluiu o curso |
| `assessments_passed` | `count` | aprovado em N avaliações do curso |
| `perfect_score` | `count` | gabaritou N avaliações do curso |
| `first_try_pass` | `count` | aprovado de primeira em N avaliações |

`count` é inteiro maior ou igual a 1 (erro se faltar). Crie de 1 a 6 conquistas por curso; uma de
conclusão é obrigatória por convenção. As regras `xp_reached` e `streak_days` são globais (valem para
a plataforma inteira) e ficam em `supabase/migrations/0002_seed_achievements.sql`, não em course.json.

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

`title` é obrigatório; `module` também, quando o curso tem módulos. `summary` aparece na lista de
aulas: uma frase, até 120 caracteres. `objectives`: de 2 a 4 itens, começando por verbo.
`published: false` esconde a aula dos alunos (rascunho).

Atenção ao YAML: se `title` ou `summary` contiver dois-pontos seguidos de espaço, coloque o valor
entre aspas (`summary: "Monitoramento: métricas e ferramentas"`). Sem aspas, o arquivo não carrega.

### 4.2 Slides

- Slides são separados por uma linha contendo apenas `---`, **com uma linha em branco antes**.
- O **primeiro slide é a capa**: começa com `# Título da aula` e tem no máximo duas linhas de texto.
- **Todos os outros slides começam com `## Título do slide`.** Um único `##` por slide.
- Use `###` só para subdivisões curtas dentro do slide.
- Tamanho: de 8 a 20 slides por aula. Até 130 palavras por slide (aviso); 200 é o limite (erro).

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

Esqueleto para copiar (troque o conteúdo, mantenha a estrutura):

````markdown
---
title: Nome da aula
summary: Uma frase sobre o que a aula resolve.
module: slug-do-modulo
duration_minutes: 20
objectives:
  - Verbo + objeto
  - Verbo + objeto
---

# Nome da aula

Nome do curso · Aula N

---

## O que você vai aprender

:::goal
- Objetivo 1
- Objetivo 2
:::

---

## Por que isso importa

Situação concreta em duas ou três frases.

:::question
Pergunta que o aluno responde ao fim da aula.
:::

---

## Primeiro conceito

Definição curta com o **termo novo** em negrito.

```sql
SELECT ...
```

---

## Pratique

:::example Desafio
Enunciado curto.
:::

:::info Resposta
Solução comentada.
:::

---

## Erros comuns

:::warning
- Armadilha 1
- Armadilha 2
:::

---

## Resumo

:::summary
- Frase 1
- Frase 2
:::

Próxima aula: ponte em uma linha.
````

### 4.4 Blocos disponíveis

Blocos de destaque (todos aceitam título opcional após o nome):

```markdown
:::tip Título opcional
Texto do bloco. Aceita **Markdown**, listas, código e ícones inline.
:::
```

| Bloco | Uso |
|---|---|
| `:::goal` | objetivos da aula |
| `:::info` | contexto adicional, "saiba mais", resposta de um desafio |
| `:::tip` | boa prática, atalho |
| `:::example` | exemplo trabalhado, desafio |
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

Atenção: `columns` usa **quatro** dois-pontos e cada `col` usa três. No celular as colunas
empilham, então cada coluna precisa fazer sentido sozinha.

```markdown
:::center
Conteúdo centralizado (uma imagem sozinha ou uma frase de efeito)
:::

:::steps
1. Primeiro passo
2. Segundo passo
3. Terceiro passo
:::
```

Teclas: `<kbd>Ctrl</kbd> + <kbd>Enter</kbd>` é o único HTML permitido nos slides, para atalhos de
teclado. Links externos abrem em nova aba automaticamente.

### 4.5 Código

Sempre informe a linguagem. Realce disponível para: `sql`, `javascript`, `typescript`, `python`,
`bash`, `json`, `yaml`, `html`, `xml`, `css`, `java`, `csharp`, `php`, `go`, `diff`, `markdown`,
`plaintext`. Outras linguagens aparecem sem realce (use `plaintext`).

````markdown
```sql
SELECT nome FROM clientes WHERE cidade = 'Recife';
```
````

Máximo de 15 linhas de código por bloco (aviso). Se precisar de mais, divida em dois slides
(por exemplo "estrutura" e "exemplo completo"). Comente o que importa, não cada linha.
Nunca coloque código dentro de uma imagem: ele não pode ser copiado nem lido por leitores de tela.

### 4.6 Tabelas

- Tabelas Markdown para comparar até 5 colunas e 6 linhas. No celular elas rolam na horizontal.
- Prefira tabela a imagem sempre que o conteúdo for texto em linhas e colunas: ela segue o tema,
  é pesquisável e acessível. Use imagem de tabela só para apontar partes dela (seção 5.4).

### 4.7 O que não fazer

- Emojis em qualquer lugar, inclusive dentro de SVG e de questões.
- Slides com mais de um assunto, ou "paredes de texto".
- HTML cru (`<div>`, `<img>`, `<video>`, `<iframe>`, `<svg>`): os blocos acima cobrem tudo.
  Só `<kbd>` é aceito.
- Títulos genéricos ("Continuação", "Mais sobre o tema"). O título resume a ideia do slide.
- Referências a "slide anterior" ou "como vimos acima". O aluno pode navegar fora de ordem.
- Imagens decorativas: banco de imagens, ilustrações genéricas, "pessoa sorrindo com notebook".
  Cada imagem responde a uma pergunta que o aluno teria.

## 5. Mídia: imagens, diagramas, animações e ícones

### 5.1 Qual recurso usar

| Quero mostrar | Use | Não use |
|---|---|---|
| Dados em linhas e colunas | tabela Markdown | imagem de tabela |
| Sequência de passos sem ramificação | `:::steps` | fluxograma |
| Relação entre partes (arquitetura, tabelas e chaves, fluxo com decisões) | diagrama SVG (5.4) | captura de uma ferramenta de desenho |
| Algo que muda no tempo (transação, lock, índice sendo percorrido) | SVG animado (5.5) | GIF |
| A tela de um programa (Workbench, terminal, navegador) | captura PNG ou WebP (5.3) | foto da tela |
| Uma sequência de cliques numa ferramenta | WebP animado ou GIF (5.6) | vídeo |
| Ênfase num título ou item de lista | `:icon[nome]` (5.7) | emoji |
| Código | bloco de código | imagem de código |

Um recurso visual por slide. Se precisa de dois, são dois slides (ou `::::columns` para
comparar lado a lado).

### 5.2 Regras para qualquer imagem

- Arquivo em `images/`, nome em minúsculas (`fluxo-de-commit.svg`). Referência: `![texto alternativo](images/arquivo.svg)`.
- **Formatos**: SVG para diagramas e animações; WebP (ou PNG) para capturas; JPEG só para fotos;
  GIF só para capturas em movimento quando WebP animado não for possível. AVIF é aceito.
  Outras extensões são erro.
- **Peso**: até 400 KB para imagens estáticas (aviso) e 1 MB para animadas (aviso); 2 MB é erro.
- **Largura**: até 1600 px (aviso). O slide tem no máximo 980 px de largura; mais que isso é desperdício.
- **Texto alternativo** obrigatório na prática (aviso se faltar ou for genérico). Ele descreve o
  que a imagem ensina, não o arquivo: "Diagrama: a tabela pedidos aponta para clientes pela coluna
  cliente_id", nunca "diagrama" ou "imagem1.png". Com menos de 15 caracteres o validador avisa.
- **Nunca** links externos (`https://...`) nem base64 (`data:`): são erro. Eles expiram e quebram.
- **Imagem sozinha** no slide vai dentro de `:::center`. Ao lado de texto, use `::::columns`.
- **Tema**: a imagem é carregada como `<img>` e não enxerga o tema claro ou escuro do site.
  Por isso diagramas carregam o próprio fundo (cartão escuro, seção 5.4) e capturas de tela
  ficam bem nos dois temas por terem bordas arredondadas aplicadas pela plataforma.
- **Imagem não usada** em nenhuma aula, na descrição ou na capa gera aviso: apague o arquivo.
- **Trocar uma imagem**: o CDN guarda o arquivo por até uma hora. Ao substituir uma imagem,
  renomeie (`fluxo-v2.svg`) e atualize a referência; assim o aluno nunca vê a versão antiga.
- Questões (`assessments/*.json`) **não** carregam imagens de `images/` (erro). Descreva em
  texto, tabela ou código.

### 5.3 Capturas de tela e fotos

- Capture só a região que importa, com zoom suficiente para o texto ficar legível no celular
  (a imagem será exibida com no máximo 360 px de largura num telefone comum).
- Antes de capturar: tema escuro da ferramenta quando houver, fonte aumentada, janela limpa
  (sem abas pessoais, notificações ou dados reais de pessoas).
- Destaque a parte relevante com um retângulo na cor `#34d399` ou `#fbbf24`, nunca só com
  uma seta vermelha fina. Se precisar de mais de um destaque, numere-os e explique no texto.
- Salve como WebP com qualidade 80 (ou PNG se tiver texto pequeno e o WebP borrar).
  Comando útil com o ffmpeg instalado:

```bash
ffmpeg -i captura.png -vf "scale='min(1600,iw)':-1" -quality 80 images/workbench-login.webp
```

- Fotos só quando o assunto é físico (um servidor, um cabo). JPEG, qualidade 80, até 1600 px.

### 5.4 Diagramas (SVG)

Use diagrama quando a **posição** das coisas importa: o que aponta para o quê, o que está dentro
de quê, por onde o dado passa. Se dá para dizer com uma lista ou tabela, não é diagrama.

**Convenções**

- `viewBox` obrigatório (erro sem ele): é o que faz o SVG redimensionar no celular.
  Use largura de 480 a 720 unidades e proporção paisagem entre 3:2 e 5:2.
- `<title>` logo após `<svg>` com uma frase sobre o que o diagrama mostra (aviso sem ele).
  O texto alternativo do Markdown continua obrigatório: é ele que o leitor de tela lê.
- **Cartão com fundo próprio**: `<rect>` cobrindo tudo com `rx="16"` e a cor `#0b1020`.
  Assim o diagrama fica igual nos dois temas do site.
- **Fonte**: `font-family="Inter, system-ui, sans-serif"` (é a fonte da plataforma; o navegador
  usa a do sistema se não tiver). Para código, `'JetBrains Mono', Consolas, monospace`.
- **Tamanho de texto**: no mínimo 1/32 da largura do viewBox (720 de largura: 22 px; 480: 15 px).
  Menos que isso vira ilegível no celular. Se não cabe, divida em dois diagramas.
- Máximo de cerca de 12 elementos (caixas, setas, rótulos). Mais que isso é um diagrama por slide
  ou uma sequência de slides que vai "construindo" o desenho.
- Sem `<script>`, sem eventos `on*`, sem `href` externo, sem `@import` (erro). Sem `<image>`
  ou raster embutido (aviso): desenhe com formas e texto.
- Sem emoji dentro do SVG (erro). Para um pictograma, copie um ícone do lucide (abaixo).

**Paleta** (os mesmos tokens do tema escuro da plataforma, `src/styles/tokens.css`):

| Uso | Cor |
|---|---|
| fundo do cartão | `#0b1020` |
| caixas e células | `#131c33` com borda `#2a3a5c` |
| texto principal | `#e8edf7` |
| texto secundário | `#b4bfd3` |
| primária (cabeçalhos, o que está "certo") | `#34d399`, texto sobre ela `#06281c` |
| destaque, rótulos e setas | `#a78bfa` |
| atenção | `#fbbf24` |
| erro, bloqueio | `#f87171` |
| informação | `#60a5fa` |

Cor nunca é o único sinal: uma linha "errada" é vermelha **e** tracejada ou rotulada.

**Modelo** (copie e adapte; é o padrão de `fundamentos-sql/images/tabela.svg`):

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 300" font-family="Inter, system-ui, sans-serif">
  <title>A coluna cliente_id de pedidos aponta para a chave primária de clientes</title>
  <style>
    .box  { fill: #131c33; stroke: #2a3a5c; stroke-width: 1.5; }
    .head { fill: #34d399; }
    .t    { fill: #e8edf7; font-size: 22px; }
    .h    { fill: #06281c; font-size: 22px; font-weight: 700; }
    .lbl  { fill: #a78bfa; font-size: 18px; font-weight: 700; }
    .line { stroke: #a78bfa; stroke-width: 2; fill: none; }
  </style>
  <rect width="720" height="300" rx="16" fill="#0b1020"/>

  <rect class="box" x="40" y="60" width="260" height="180" rx="10"/>
  <rect class="head" x="40" y="60" width="260" height="44"/>
  <text class="h" x="56" y="90">clientes</text>
  <text class="t" x="56" y="140">id</text>
  <text class="t" x="56" y="176">nome</text>

  <rect class="box" x="420" y="60" width="260" height="180" rx="10"/>
  <rect class="head" x="420" y="60" width="260" height="44"/>
  <text class="h" x="436" y="90">pedidos</text>
  <text class="t" x="436" y="140">id</text>
  <text class="t" x="436" y="176">cliente_id</text>

  <path class="line" d="M 300 132 L 420 168"/>
  <text class="lbl" x="330" y="128">1 : N</text>
</svg>
```

**Ícone do lucide dentro de um SVG**: copie o conteúdo do ícone em `src/lib/inline-icons.ts`
para um `<g>` posicionado e escalado (o ícone original tem 24 × 24):

```xml
<g transform="translate(300 120) scale(1.5)" fill="none" stroke="#34d399" stroke-width="2"
   stroke-linecap="round" stroke-linejoin="round">
  <!-- key-round -->
  <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/>
  <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/>
</g>
```

**Ferramentas** (todas devem terminar num `.svg` que passe no validador):

- Escrever à mão, como no modelo: melhor resultado para até 12 elementos, e é o que um agente de IA deve fazer.
- Mermaid: escreva o `.mmd` e gere o SVG com a CLI, desligando rótulos em HTML
  (eles viram `<foreignObject>`, que não renderiza de forma confiável):
  `npx -p @mermaid-js/mermaid-cli mmdc -i fluxo.mmd -o images/fluxo.svg -t dark -b "#0b1020" -c mermaid.json`
  com `mermaid.json` contendo `{ "flowchart": { "htmlLabels": false } }`. Confira o tamanho do texto.
- Excalidraw ou draw.io: exporte como SVG com fundo (`#0b1020`), sem "incluir cópia do diagrama"
  e com texto como `<text>` (no draw.io, desligue "Formatted text" antes de exportar).
  Abra o arquivo no navegador e confira se o texto aparece.
- Não use capturas de tela de diagramas: ficam borradas e não seguem a paleta.

### 5.5 Animações (SVG animado)

Para mostrar um **processo** (uma transação que faz rollback, um índice sendo percorrido, linhas
sendo filtradas), prefira um SVG animado a um GIF: pesa poucos KB, fica nítido em qualquer tela
e pode ser desligado por quem não quer movimento.

Regras:

- Anime com `@keyframes` dentro de um `<style>` no próprio SVG. Não use `<animate>` (SMIL):
  ele ignora a preferência de movimento reduzido e gera aviso.
- Anime só `opacity` e `transform`. Nada de mudar cor, tamanho ou posição por atributo.
- Inclua `@media (prefers-reduced-motion: reduce) { .x { animation: none; } }` (aviso sem isso).
  **O estado sem animação deve ser o estado final**, legível e completo: quem desativa animações
  vê o resultado, não o começo.
- Ciclos de 4 a 8 segundos, em loop (`infinite`), com uma pausa no fim para o aluno ler o resultado.
- No máximo 3 coisas se movendo. Se o olho não sabe para onde olhar, divida em dois slides.
- O texto alternativo descreve o que acontece e o resultado: "Animação: a condição WHERE destaca
  duas linhas e esmaece as outras".

Exemplo completo: `fundamentos-sql/images/where-filtro.svg`. Modelo mínimo:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 300" font-family="Inter, system-ui, sans-serif">
  <title>Transação: a alteração só vale depois do COMMIT</title>
  <style>
    .t  { fill: #e8edf7; font-size: 22px; font-family: 'JetBrains Mono', Consolas, monospace; }
    .ok { animation: aparece 6s infinite; }
    @keyframes aparece {
      0%, 30%  { opacity: 0; transform: translateY(8px); }
      45%, 85% { opacity: 1; transform: translateY(0); }
      100%     { opacity: 0; }
    }
    @media (prefers-reduced-motion: reduce) { .ok { animation: none; } }
  </style>
  <rect width="720" height="300" rx="16" fill="#0b1020"/>
  <text class="t" x="40" y="80">UPDATE contas SET saldo = saldo - 100 WHERE id = 1;</text>
  <text class="t" x="40" y="140">COMMIT;</text>
  <g class="ok">
    <rect x="40" y="180" width="300" height="48" rx="8" fill="#34d399"/>
    <text x="56" y="212" font-size="22" font-weight="700" fill="#06281c">saldo gravado</text>
  </g>
</svg>
```

Padrões que funcionam bem: aparecer em sequência (passos de um algoritmo), esmaecer o que foi
descartado (filtros, locks), deslocar um marcador (ponteiro de um índice, cursor), pulsar uma borda
(o que está sendo lido agora).

### 5.6 GIF e WebP animado (capturas em movimento)

Use só para **gravar uma tela real**: uma sequência de cliques no Workbench, o terminal mostrando
a saída de um comando. Para explicar conceitos, use SVG animado (5.5).

- Prefira **WebP animado** a GIF: é de 3 a 5 vezes menor com a mesma qualidade. GIF só se a
  ferramenta de gravação não exportar WebP.
- Até 10 segundos, 10 quadros por segundo, 960 px de largura. Limite: 1 MB (aviso), 2 MB (erro).
- Grave só a região relevante, com zoom. Comece num estado reconhecível e termine com o resultado
  parado por 1,5 s antes de repetir.
- Sem piscar, sem flashes, sem trocas bruscas de tela: o formato não pode ser pausado pelo aluno.
- GIF estático (um quadro só) gera aviso: converta para PNG ou WebP.
- Conversão de um vídeo de tela (gravado com o Xbox Game Bar, OBS ou ScreenToGif) com ffmpeg:

```bash
# WebP animado (preferido)
ffmpeg -i gravacao.mp4 -vf "fps=10,scale=960:-1" -loop 0 -c:v libwebp -q:v 60 images/criar-tabela.webp

# GIF, se precisar
ffmpeg -i gravacao.mp4 -vf "fps=10,scale=960:-1,split[a][b];[a]palettegen[p];[b][p]paletteuse" -loop 0 images/criar-tabela.gif
```

- Texto alternativo: o que a pessoa faz e o que acontece ("Gravação: clicar em Execute no
  Workbench e ver as 4 linhas no painel de resultado").
- Vídeo (`.mp4`) não é suportado nos slides. Se um vídeo for indispensável, publique fora da
  plataforma e coloque um link com o que o aluno vai ver e a duração.

### 5.7 Ícones inline

Qualquer texto de slide (título, item de lista, parágrafo, célula de tabela, bloco, questão e
descrição do curso) aceita `:icon[nome]`, que vira um ícone do lucide na cor do tema.

```markdown
## :icon[database] O que é um SGBD

- :icon[users] Várias pessoas acessam ao mesmo tempo
- :icon[shield] Regras garantem a consistência
```

- Em títulos `##` o ícone fica na cor primária; no início de um item de lista ou parágrafo, na cor
  de destaque. No meio de uma frase, na cor do texto.
- **Um ícone por título** e, no máximo, um por item de lista. Ele reforça a ideia, não a substitui:
  o leitor de tela ignora o ícone, então a palavra precisa estar ali.
- **Vocabulário fixo por curso**: o mesmo conceito usa sempre o mesmo ícone (por exemplo,
  `key-round` é chave primária em todas as aulas; `lock` é lock; `database-backup` é backup).
- Não use ícone no título da capa (`#`), em código, em `summary` ou em `title` do frontmatter.
- Não transforme toda lista em lista de ícones: use-os quando os itens são de tipos diferentes
  (segurança, desempenho, custo) ou quando o slide precisa de ancoragem visual.
- Dentro de blocos de código e de código inline, `:icon[...]` é texto literal (não vira ícone).
- Nomes válidos: Apêndice A deste guia (gerado a partir de `src/lib/inline-icons.ts`).
  Nome inexistente é erro.

**Duas listas de ícones**, com finalidades diferentes:

| Lista | Onde | Como adicionar |
|---|---|---|
| `src/lib/icons.ts` | `icon` do curso e das conquistas (componentes Vue) | importe o componente do `lucide-vue-next` e inclua no `iconMap` |
| `src/lib/inline-icons.ts` | `:icon[nome]` nos slides (SVG embutido) | inclua o nome em `NAMES` de `scripts/inline-icons.mjs` e rode `node scripts/inline-icons.mjs`; o script também atualiza o Apêndice A |

Para procurar um ícone pelo significado: [lucide.dev/icons](https://lucide.dev/icons). Use o nome
exatamente como aparece lá (kebab-case).

### 5.8 Posição e tamanho na tela

- A imagem ocupa no máximo a largura do slide (até 980 px no desktop, a largura da tela no celular)
  e no máximo 52% da altura da janela; acima disso ela encolhe. Diagramas em paisagem aproveitam
  melhor o espaço; evite imagens altas e estreitas.
- `:::center` para uma imagem sozinha. `::::columns` com a imagem numa coluna e 3 ou 4 linhas de
  texto na outra quando a explicação é curta. No celular, a imagem vem primeiro se estiver na
  primeira coluna: coloque-a lá.
- Nunca dependa da imagem para o slide fazer sentido: o título e uma frase devem bastar.
- Não repita a mesma imagem em vários slides; se precisar "voltar" a um diagrama, use uma versão
  com o destaque movido (`fluxo-passo-2.svg`).

### 5.9 Acessibilidade da mídia

- Texto alternativo em toda imagem, descrevendo o ensinamento (5.2). Para animações, o que acontece.
- Contraste mínimo de 4,5:1 entre texto e fundo dentro de diagramas (a paleta de 5.4 cumpre).
- Cor nunca é o único canal: combine com rótulo, forma, tracejado ou posição.
- Animações respeitam `prefers-reduced-motion` e têm estado final legível (5.5).
- GIF e WebP animado não podem ser pausados: por isso são curtos, calmos e sem flashes (5.6).
- Nada de texto essencial só dentro de imagem: código, comandos e nomes de colunas vão no slide.

## 6. Avaliações (`assessments/NN-slug.json`)

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

O prefixo `NN-` do nome do arquivo define a ordem (`position`). Use `99-` para a prova final.

### 6.1 Tipos de questão

`prompt`, `explanation` e o texto das alternativas aceitam Markdown: negrito, código inline,
blocos de código (no `prompt`) e ícones inline. Imagens locais não (seção 5.2).

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
Se o enunciado tiver bloco de código, mais de uma linha ou uma lacuna dentro de código inline, o player mostra
o enunciado inteiro com `[1]`, `[2]`... no lugar das lacunas e os campos de resposta logo abaixo. Em enunciados
de uma linha sem código, o campo aparece no meio da frase.
Liste variações aceitas quando fizer sentido: `[["NOT NULL", "not null"]]`.

Questão com código no enunciado:

```json
{
  "id": "q5",
  "type": "single",
  "prompt": "Na consulta abaixo, qual parte indica **de qual tabela** os dados vêm?\n\n```sql\nSELECT nome\nFROM clientes;\n```",
  "options": { "a": "SELECT nome", "b": "FROM clientes" },
  "answer": "b",
  "explanation": "FROM aponta a tabela de origem."
}
```

### 6.2 Boas questões

- Quizzes: 5 a 10 questões. Provas: 10 a 20.
- Cada objetivo da aula aparece em pelo menos uma questão.
- Enunciado completo, sem depender de "ver o slide X" nem de uma imagem.
- Alternativas com tamanho e estilo parecidos. Distratores plausíveis (erros que alunos cometem de verdade).
- Nunca "todas as anteriores" ou "nenhuma das anteriores".
- `explanation` obrigatória na prática: diga por que a certa está certa e por que a mais tentadora está errada.
- Misture dificuldades: 40% lembrar, 40% aplicar, 20% analisar.
- `points` maior (2 ou 3) só para questões de aplicação ou análise.

## 7. Fluxo de trabalho

1. Crie ou edite os arquivos em `content/courses/<slug>/`.
2. Rode `npm run content:check` e corrija todos os **erros**. Leia os avisos: eles apontam slides
   longos, listas grandes, imagens pesadas ou sem alt, SVG sem título, ícones fora do padrão.
   Para um curso só: `node scripts/content.mjs check --course=<slug>`.
3. Rode `npm run content:sync` para publicar no Supabase (precisa do `.env` com `SUPABASE_SERVICE_ROLE_KEY`).
   As imagens vão para o bucket `course-assets`, em `<slug>/images/`.
4. Abra o curso na plataforma e passe por todos os slides em tela de celular e de desktop,
   nos dois temas. Confira que as imagens carregam, que o texto dos diagramas é legível no
   celular e que as animações param quando o sistema está com movimento reduzido.
5. Faça o quiz como aluno. A explicação de cada questão aparece no resultado: confira se faz sentido.

Para remover do banco e do storage aulas, questões e imagens que você apagou do repositório:
`npm run content:sync:prune`.

## 8. Checklist final por aula

- [ ] Capa com `#`, demais slides com um único `##`
- [ ] 8 a 20 slides, até 130 palavras cada
- [ ] Objetivos no início, resumo no fim
- [ ] Pelo menos um exemplo concreto por conceito
- [ ] Um `:::question` ou `:::example` no meio da aula
- [ ] Código com linguagem declarada, até 15 linhas por bloco
- [ ] Imagens locais em `images/`, com alt descritivo, até 400 KB (1 MB se animada), até 1600 px
- [ ] Uma imagem por slide, dentro de `:::center` ou `::::columns`
- [ ] SVG com `viewBox`, `<title>`, fundo próprio e texto de pelo menos 1/32 da largura
- [ ] SVG animado com `@keyframes`, `prefers-reduced-motion` e estado final legível
- [ ] GIF ou WebP animado só para capturas de tela, até 10 s
- [ ] Ícones inline só com nomes do Apêndice A, um por título, mesmo ícone para o mesmo conceito
- [ ] Nenhum emoji (nem dentro de SVG ou de questões)
- [ ] Nenhuma imagem sem uso em `images/`
- [ ] Quiz com 5 a 10 questões cobrindo todos os objetivos, todas com `explanation`
- [ ] `npm run content:check` sem erros

## 9. Roteiros do instrutor (`roteiros/NN-slug.md`)

Um roteiro é o passo a passo de um **encontro presencial** (as aulas em slides são o material do
aluno; o roteiro é o material de quem dá a aula). Fica em `content/courses/<curso>/roteiros/`,
vai para a tabela `class_scripts` e só instrutores e administradores o leem, na aba
"Roteiros de aula" do painel do instrutor e por um atalho no player da aula.

```yaml
---
title: "E01 · A web e o front-end"
summary: Como conduzir o primeiro encontro, do DevTools à instalação do ambiente.
module: react
duration_minutes: 240
lessons:
  - e01a-o-que-e-front-end
  - e01b-por-que-react
---
```

- O nome do arquivo segue o padrão das aulas: `NN-slug.md` (NN = ordem, slug = identificador).
- `lessons` lista os slugs das aulas em slides usadas no encontro; todas precisam existir em `lessons/`.
- O corpo é um **documento** em Markdown (sem separadores `---` de slide), com os mesmos blocos
  `:::tip`, `:::warning`, `:::steps` etc. e os ícones inline das aulas. Comece pelo `##`: o título vem do frontmatter.
- Estrutura recomendada: Visão do encontro; Antes do encontro (checklist); Linha do tempo (tabela
  horário, bloco, minutos); um `##` por bloco (Abertura, Bloco 1, Bloco 2, Laboratório, Fechamento,
  Encerramento) com o que o instrutor faz e diz, as demonstrações passo a passo e as perguntas para a
  turma; Dificuldades frequentes (sintoma, causa, como ajudar); Plano B.
- O validador exige título, aulas existentes e blocos fechados; avisa roteiros curtos (menos de 150 palavras)
  e código sem linguagem. Não há limite de palavras por seção.
- Materiais que o roteiro pede para preparar (demonstrações, soluções de referência) ficam em `materiais/`
  e entram no roteiro como link (seção 10), em vez de só serem citados pelo nome.

## 10. Materiais de aula (`materiais/`)

Arquivos que o aluno ou o instrutor abre no navegador ou baixa: demonstrações em HTML, soluções de
referência, arquivos iniciais de laboratório. Ficam em `content/courses/<curso>/materiais/` e são
publicados **junto com o site** (GitHub Pages), não pelo `content:sync`. O endereço é
`<site>/materiais/<curso>/<caminho>`; no `npm run dev`, o servidor local serve direto da pasta do curso.

```
materiais/
└── e01/                       uma pasta por encontro
    ├── aluno/                 o que o aluno abre, ligado pelos slides
    │   └── contador.html
    └── demos-e01/             pasta do instrutor, baixada como demos-e01.zip pelo roteiro
        ├── contador.html
        └── perfil/
            ├── perfil.html
            ├── estilo.css
            └── foto.jpg
```

- **Link**, em slides, roteiros e descrição: `[abra o contador em outra aba](materiais/e01/aluno/contador.html)`.
  A plataforma troca pelo endereço completo e abre em nova aba.
- **Pasta inteira**: `[demos-e01.zip](materiais/e01/demos-e01.zip)` baixa a pasta `demos-e01/` compactada.
  O zip é gerado no build a partir do link; não coloque o `.zip` no repositório.
- **Versão do aluno** (`aluno/`): página autoexplicativa para ler e acompanhar a aula, inclusive no
  celular. Mostra o exemplo funcionando, o código explicado linha por linha e os passos da
  demonstração do instrutor; quando a demonstração depende do DevTools, mostre o mesmo dado na
  própria página para quem está sem ele. Siga a paleta da plataforma, com tema claro e escuro.
- **Pasta do instrutor**: os arquivos exatamente como nos slides (para editar ao vivo) e as soluções
  de referência do laboratório. O nome segue o que o roteiro cita (`demos-e01/`).
- Tudo em `materiais/` é público para quem tiver o endereço; só o roteiro é restrito ao instrutor.
  Nunca coloque gabarito de prova ou de quiz em materiais.
- Questões (`assessments/*.json`) não têm links para materiais (erro).
- Nomes só com minúsculas, números, ponto, hífen e underline (o caminho vira URL). Sem emojis.
  Até 2 MB por arquivo (aviso).
- O validador confere se cada link aponta para um arquivo (ou, no caso do `.zip`, para uma pasta) e
  avisa sobre página HTML sem link em nenhuma aula, roteiro ou descrição.
- Publicação: o material vai ao ar no próximo deploy (push na `main`); a aula ou o roteiro que o cita
  vai pelo `content:sync`. Faça os dois.

## Apêndice A: ícones inline disponíveis

Nomes aceitos em `:icon[nome]`. A lista é gerada por `node scripts/inline-icons.mjs` a partir de
`src/lib/inline-icons.ts`; não edite à mão.

<!-- inline-icons:start -->
`activity` · `alarm-clock` · `archive` · `archive-restore` · `arrow-down` · `arrow-down-a-z` · `arrow-left` · `arrow-left-right` · `arrow-right` · `arrow-up`
`arrow-up-a-z` · `arrow-up-down` · `award` · `badge-alert` · `badge-check` · `ban` · `banknote` · `bell` · `binary` · `blocks`
`book` · `book-open` · `bookmark` · `bot` · `boxes` · `braces` · `brain` · `briefcase` · `bug` · `building-2`
`cable` · `calculator` · `calendar` · `calendar-check` · `calendar-clock` · `chart-bar` · `chart-column` · `chart-line` · `chart-pie` · `check`
`check-check` · `chevrons-right` · `circle-alert` · `circle-check` · `circle-dot` · `circle-help` · `circle-minus` · `circle-plus` · `circle-x` · `clipboard-check`
`clipboard-list` · `clock` · `cloud` · `cloud-download` · `cloud-upload` · `code` · `code-xml` · `cog` · `coins` · `columns-3`
`combine` · `compass` · `component` · `contact` · `copy` · `corner-down-right` · `cpu` · `credit-card` · `crown` · `database`
`database-backup` · `database-zap` · `dices` · `download` · `equal` · `equal-not` · `eye` · `eye-off` · `factory` · `file-check`
`file-clock` · `file-code` · `file-lock` · `file-search` · `file-text` · `file-warning` · `files` · `fingerprint` · `flag` · `flame`
`flask-conical` · `folder` · `folder-open` · `folder-tree` · `footprints` · `funnel` · `gamepad-2` · `gauge` · `gem` · `git-branch`
`git-commit-horizontal` · `git-fork` · `git-merge` · `globe` · `goal` · `graduation-cap` · `grid-2x2` · `hammer` · `hand` · `handshake`
`hard-drive` · `hard-drive-download` · `hard-drive-upload` · `hash` · `heart` · `heart-pulse` · `history` · `hourglass` · `id-card` · `image`
`info` · `kanban` · `key` · `key-round` · `keyboard` · `lamp` · `landmark` · `laptop` · `layers` · `layout-grid`
`layout-list` · `leaf` · `library` · `lightbulb` · `link` · `link-2` · `list` · `list-checks` · `list-filter` · `list-ordered`
`list-tree` · `lock` · `lock-open` · `magnet` · `mail` · `map` · `map-pin` · `medal` · `megaphone` · `memory-stick`
`merge` · `message-square` · `messages-square` · `milestone` · `minus` · `monitor` · `mountain` · `mouse-pointer-click` · `navigation` · `network`
`newspaper` · `notebook-pen` · `octagon-alert` · `package` · `package-check` · `paperclip` · `party-popper` · `pause` · `pencil` · `percent`
`phone` · `pin` · `play` · `plug` · `plug-zap` · `plus` · `power` · `puzzle` · `qr-code` · `receipt`
`redo-2` · `refresh-cw` · `repeat` · `rocket` · `rotate-ccw` · `rotate-cw` · `route` · `rows-3` · `save` · `scale`
`scan` · `school` · `scroll-text` · `search` · `search-check` · `send` · `server` · `server-cog` · `server-crash` · `settings`
`shapes` · `sheet` · `shield` · `shield-alert` · `shield-check` · `shield-off` · `shopping-cart` · `sigma` · `siren` · `skip-forward`
`sliders-horizontal` · `smartphone` · `smile` · `snowflake` · `sparkles` · `split` · `square` · `square-check` · `square-function` · `square-pen`
`square-terminal` · `star` · `stethoscope` · `store` · `sun` · `swords` · `table` · `table-2` · `table-properties` · `tag`
`tags` · `target` · `terminal` · `test-tube` · `text` · `thumbs-down` · `thumbs-up` · `ticket` · `timer` · `timer-reset`
`trash-2` · `trending-down` · `trending-up` · `triangle-alert` · `trophy` · `truck` · `undo-2` · `unlink` · `upload` · `user`
`user-check` · `user-cog` · `user-plus` · `user-x` · `users` · `variable` · `wallet` · `wand` · `warehouse` · `waypoints`
`wifi` · `workflow` · `wrench` · `x` · `zap`
<!-- inline-icons:end -->
